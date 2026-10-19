import json
import re
from datetime import timedelta
from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.core import mail
from django.test import Client, TestCase, override_settings
from django.utils import timezone
from .models import AuthChallenge, AuthRate, PhoneIdentity

User = get_user_model()

@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class AuthenticationTests(TestCase):
    def post(self, action, data, client=None):
        return (client or self.client).post('/api/auth/' + action + '/', json.dumps(data), content_type='application/json')

    def signup(self):
        result = self.post('signup', {'identity': 'student@example.com', 'fullName': 'Student Example', 'password': 'A-good-passphrase-902!', 'terms': 'on'})
        self.assertEqual(result.status_code, 200, result.content)
        code = re.search(r'code is (\d{6})', mail.outbox[-1].body).group(1)
        return result.json()['challenge'], code

    def test_signup_requires_verification_then_persists_session_and_logout(self):
        challenge, code = self.signup()
        self.assertFalse(User.objects.filter(email='student@example.com').exists())
        record = AuthChallenge.objects.get(pk=challenge)
        self.assertNotEqual(record.code_hash, code)
        self.assertNotIn(code, json.dumps(record.payload))
        response = self.post('verify', {'challenge': challenge, 'otp': code})
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(email='student@example.com')
        self.assertTrue(user.check_password('A-good-passphrase-902!'))
        self.assertEqual(self.client.get('/api/auth/session/').json()['user']['id'], user.pk)
        self.post('logout', {})
        self.assertIsNone(self.client.get('/api/auth/session/').json()['user'])
        self.assertEqual(self.post('login', {'identity': 'STUDENT@example.com', 'password': 'A-good-passphrase-902!'}).status_code, 200)

    def test_codes_cannot_be_reused(self):
        challenge, code = self.signup()
        self.post('verify', {'challenge': challenge, 'otp': code})
        self.assertEqual(self.post('verify', {'challenge': challenge, 'otp': code}).status_code, 400)
        self.assertEqual(AuthChallenge.objects.get(pk=challenge).payload, {})

    def test_code_is_bound_to_browser_session(self):
        challenge, code = self.signup()
        self.assertEqual(self.post('verify', {'challenge': challenge, 'otp': code}, Client()).status_code, 400)

    def test_wrong_code_attempt_limit_persists(self):
        challenge, code = self.signup()
        wrong = '000000' if code != '000000' else '111111'
        for _ in range(5):
            self.assertEqual(self.post('verify', {'challenge': challenge, 'otp': wrong}).status_code, 400)
        self.assertEqual(AuthChallenge.objects.get(pk=challenge).attempts, 5)
        self.assertEqual(self.post('verify', {'challenge': challenge, 'otp': code}).status_code, 400)

    def test_expired_code_rejected(self):
        challenge, code = self.signup()
        AuthChallenge.objects.filter(pk=challenge).update(expires_at=timezone.now()-timedelta(seconds=1))
        self.assertEqual(self.post('verify', {'challenge': challenge, 'otp': code}).status_code, 400)

    def test_send_throttle_and_password_validation(self):
        values = {'identity': 'student@example.com', 'fullName': 'Student', 'password': '12345678', 'terms': 'on'}
        self.assertEqual(self.post('signup', values).status_code, 400)
        self.signup()
        values['password'] = 'A-good-passphrase-902!'
        self.assertEqual(self.post('signup', values).status_code, 400)
        self.assertEqual(len(mail.outbox), 1)

    def test_password_reset_invalidates_sessions_and_old_reset_codes(self):
        user = User.objects.create_user(username='student', email='student@example.com', password='Old-password-902!')
        old_client = Client()
        old_client.force_login(user)
        response = self.post('reset', {'email': user.email})
        challenge = response.json()['challenge']
        code = re.search(r'code is (\d{6})', mail.outbox[-1].body).group(1)
        self.assertEqual(self.post('verify', {'challenge': challenge, 'otp': code, 'password': 'New-passphrase-890!'}).status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.check_password('New-passphrase-890!'))
        self.assertIsNone(old_client.get('/api/auth/session/').json()['user'])
        self.assertIsNone(self.client.get('/api/auth/session/').json()['user'])

    def test_reset_unknown_email_does_not_send_or_disclose_account(self):
        response = self.post('reset', {'email': 'unknown@example.com'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('If this email', response.json()['message'])
        self.assertEqual(len(mail.outbox), 0)

    @patch('portal.auth_views.twilio')
    def test_phone_provider_send_check_and_existing_account(self, provider):
        provider.return_value = {'status': 'pending'}
        response = self.post('phone', {'phone': '+15555550123'})
        self.assertEqual(response.status_code, 200)
        provider.assert_called_with('Verifications', {'To': '+15555550123', 'Channel': 'sms'})
        provider.return_value = {'status': 'approved'}
        result = self.post('verify', {'challenge': response.json()['challenge'], 'otp': '123456'})
        self.assertEqual(result.status_code, 200)
        self.assertEqual(PhoneIdentity.objects.count(), 1)
        self.assertFalse(PhoneIdentity.objects.first().user.has_usable_password())
        self.post('logout', {})
        AuthRate.objects.all().delete()
        response = self.post('phone', {'phone': '+15555550123'})
        self.post('verify', {'challenge': response.json()['challenge'], 'otp': '123456'})
        self.assertEqual(PhoneIdentity.objects.count(), 1)

    @override_settings(TWILIO_ACCOUNT_SID='', TWILIO_AUTH_TOKEN='', TWILIO_VERIFY_SERVICE_SID='')
    def test_phone_not_configured_fails_without_fake_success(self):
        response = self.post('phone', {'phone': '+15555550123'})
        self.assertEqual(response.status_code, 400)
        self.assertIn('not configured', response.json()['error'])
        self.assertFalse(AuthChallenge.objects.exists())

    def test_csrf_is_required_and_token_flow_works(self):
        client = Client(enforce_csrf_checks=True)
        self.assertEqual(self.post('logout', {}, client).status_code, 403)
        token = client.get('/api/auth/session/').json()['csrfToken']
        self.assertEqual(client.post('/api/auth/logout/', '{}', content_type='application/json', HTTP_X_CSRFTOKEN=token).status_code, 200)

    def test_login_failures_are_throttled(self):
        for _ in range(10):
            self.post('login', {'identity': 'no@example.com', 'password': 'invalid'})
        response = self.post('login', {'identity': 'no@example.com', 'password': 'invalid'})
        self.assertIn('Too many', response.json()['error'])

    def test_invalid_json_and_non_string_payload(self):
        self.assertEqual(self.client.post('/api/auth/login/', 'not json', content_type='application/json').status_code, 400)
        self.assertEqual(self.post('login', {'identity': []}).status_code, 400)

    @patch('portal.auth_views.send_mail', side_effect=OSError('provider failure'))
    def test_delivery_failure_does_not_create_challenge(self, send):
        response = self.post('signup', {'identity': 'student@example.com', 'fullName': 'Student', 'password': 'A-good-passphrase-902!', 'terms': 'on'})
        self.assertEqual(response.status_code, 400)
        self.assertFalse(AuthChallenge.objects.exists())

    def test_second_reset_code_cannot_change_password_after_first_reset(self):
        user = User.objects.create_user(username='student', email='student@example.com', password='Old-password-902!')
        first = self.post('reset', {'email': user.email}).json()['challenge']
        first_code = re.search(r'code is (\d{6})', mail.outbox[-1].body).group(1)
        AuthRate.objects.all().delete()
        other = Client()
        second = self.post('reset', {'email': user.email}, other).json()['challenge']
        second_code = re.search(r'code is (\d{6})', mail.outbox[-1].body).group(1)
        self.assertEqual(self.post('verify', {'challenge': first, 'otp': first_code, 'password': 'New-password-942!'}).status_code, 200)
        self.assertEqual(self.post('verify', {'challenge': second, 'otp': second_code, 'password': 'Another-password-932!'}, other).status_code, 400)

    @patch('portal.auth_views.twilio')
    def test_unapproved_phone_code_cannot_login(self, provider):
        provider.return_value = {'status': 'pending'}
        challenge = self.post('phone', {'phone': '+15555550123'}).json()['challenge']
        self.assertEqual(self.post('verify', {'challenge': challenge, 'otp': '123456'}).status_code, 400)
        self.assertFalse(PhoneIdentity.objects.exists())

    def test_disabled_user_cannot_login(self):
        User.objects.create_user(username='student', email='student@example.com', password='Password-902!', is_active=False)
        self.assertEqual(self.post('login', {'identity': 'student@example.com', 'password': 'Password-902!'}).status_code, 400)

    def test_session_not_cacheable_and_actions_require_post(self):
        response = self.client.get('/api/auth/session/')
        self.assertIn('no-store', response['Cache-Control'])
        self.assertEqual(self.client.get('/api/auth/logout/').status_code, 405)
        self.assertNotIn('password', response.json())
