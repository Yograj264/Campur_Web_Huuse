"""Same-origin session authentication. OTP challenges are browser-session bound."""
import base64
import hashlib
import json
import re
import secrets
import uuid
from datetime import timedelta
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from django.conf import settings
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.core.mail import send_mail
from django.db import transaction, IntegrityError
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.views.decorators.cache import never_cache
from .models import AuthChallenge, PhoneIdentity, AuthRate, StudentProfile

User = get_user_model()

class AuthError(Exception):
    pass

def user_data(user):
    if not user.is_authenticated:
        return None
    profile, _ = StudentProfile.objects.get_or_create(user=user, defaults={'full_name': user.first_name})
    return {'id': user.pk, 'name': user.first_name or (user.email.split('@')[0] if user.email else 'Phone user'), 'email': user.email, 'is_staff': user.is_staff, 'profile_complete': profile.is_complete, 'photo_url': '/api/profile/photo/?v=' + profile.updated_at.isoformat() if profile.photo else None} if user.is_authenticated else None

def limit(key, maximum, seconds):
    digest = hashlib.sha256(key.encode()).hexdigest()
    now = timezone.now()
    with transaction.atomic():
        row, _ = AuthRate.objects.select_for_update().get_or_create(key=digest, defaults={'started_at': now})
        if row.started_at < now - timedelta(seconds=seconds):
            row.count, row.started_at = 0, now
        if row.count >= maximum:
            raise AuthError('Too many attempts. Please wait before trying again.')
        row.count += 1
        row.save()

def twilio(endpoint, data):
    if not all([settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN, settings.TWILIO_VERIFY_SERVICE_SID]):
        raise AuthError('Phone verification is not configured. Use email or contact the administrator.')
    credentials = base64.b64encode(f'{settings.TWILIO_ACCOUNT_SID}:{settings.TWILIO_AUTH_TOKEN}'.encode()).decode()
    request = Request(f'https://verify.twilio.com/v2/Services/{settings.TWILIO_VERIFY_SERVICE_SID}/{endpoint}', data=urlencode(data).encode(), headers={'Authorization': 'Basic ' + credentials})
    try:
        with urlopen(request, timeout=15) as response:
            return json.load(response)
    except Exception as exc:
        raise AuthError('SMS verification failed or expired. Please request a new code.') from exc

def issue(request, purpose, destination, payload=None):
    limit('send:' + destination, 1, 60)
    limit('send-hour:' + destination, 5, 3600)
    code = f'{secrets.randbelow(1000000):06d}'
    if purpose == 'phone':
        twilio('Verifications', {'To': destination, 'Channel': 'sms'})
    else:
        try:
            if settings.EMAIL_BACKEND == 'django.core.mail.backends.smtp.EmailBackend' and not settings.EMAIL_HOST:
                raise AuthError('Email delivery is not configured.')
            send_mail('Campus Connect verification code', f'Your {purpose} code is {code}. It expires in 10 minutes. If you did not request it, ignore this email.', settings.DEFAULT_FROM_EMAIL, [destination])
        except Exception as exc:
            raise AuthError('Email could not be sent. Please contact the administrator or try later.') from exc
    AuthChallenge.objects.filter(session=request.session.session_key, purpose=purpose, destination=destination, consumed=False).update(consumed=True)
    challenge = AuthChallenge.objects.create(session=request.session.session_key, purpose=purpose, destination=destination, payload=payload or {}, code_hash=make_password(code) if purpose != 'phone' else '', expires_at=timezone.now() + timedelta(minutes=10))
    local = purpose != 'phone' and settings.EMAIL_BACKEND.endswith('console.EmailBackend')
    return {'challenge': str(challenge.pk), 'message': 'Development email: read the code in the Django terminal.' if local else 'A verification code has been sent.'}

@never_cache
@require_http_methods(['GET', 'POST'])
def auth_api(request, action):
    if request.method == 'GET':
        if action != 'session':
            return JsonResponse({'error': 'Method not allowed.'}, status=405)
        return JsonResponse({'user': user_data(request.user), 'csrfToken': get_token(request)})
    if action == 'session':
        return JsonResponse({'error': 'Method not allowed.'}, status=405)
    try:
        if len(request.body) > 8192:
            raise AuthError('Request is too large.')
        data = json.loads(request.body or '{}')
        if not isinstance(data, dict) or any(not isinstance(v, str) for v in data.values()):
            raise AuthError('Invalid form data.')
        if not request.session.session_key:
            request.session.create()
        limit('ip:' + request.META.get('REMOTE_ADDR', ''), 60, 600)
        if action == 'logout':
            logout(request)
            return JsonResponse({'user': None})
        if action == 'login':
            identity = data.get('identity', '').strip().lower()
            limit('login:' + identity, 10, 600)
            account = User.objects.filter(email__iexact=identity, is_active=True).first()
            user = authenticate(request, username=account.username if account else '__invalid__', password=data.get('password', ''))
            if not user:
                raise AuthError('Email or password is incorrect. Verify your email before signing in.')
            login(request, user)
            return JsonResponse({'user': user_data(user)})
        if action in ('signup', 'reset', 'phone'):
            if action == 'phone':
                destination = re.sub(r'\s+', '', data.get('phone', ''))
                if not re.fullmatch(r'\+[1-9][0-9]{7,14}', destination):
                    raise AuthError('Use international format, for example +919876543210.')
                return JsonResponse(issue(request, 'phone', destination))
            email = data.get('identity', data.get('email', '')).strip().lower()
            validate_email(email)
            if len(email) > 254:
                raise AuthError('Email address is too long.')
            payload = {}
            if action == 'signup':
                name = data.get('fullName', '').strip()
                if not name or len(name) > 150:
                    raise AuthError('Enter your full name (up to 150 characters).')
                if data.get('terms') != 'on':
                    raise AuthError('Please confirm the registration terms.')
                if User.objects.filter(email__iexact=email).exists():
                    raise AuthError('An account already uses this email. Please log in or reset its password.')
                validate_password(data.get('password', ''), User(email=email, first_name=name))
                payload = {'name': name, 'password': make_password(data['password'])}
            elif not User.objects.filter(email__iexact=email, is_active=True).exists():
                # Keep response shape indistinguishable; never send to an unknown account.
                limit('send:' + email, 1, 60)
                return JsonResponse({'challenge': str(uuid.uuid4()), 'message': 'If this email has an account, a code has been sent.'})
            if action == 'reset':
                account = User.objects.filter(email__iexact=email, is_active=True).first()
                payload = {'password_version': hashlib.sha256(account.password.encode()).hexdigest()}
            result = issue(request, action, email, payload)
            if action == 'reset' and not settings.DEBUG:
                result['message'] = 'If this email has an account, a code has been sent.'
            return JsonResponse(result)
        if action == 'verify':
            limit('verify:' + request.session.session_key, 20, 600)
            try:
                challenge = AuthChallenge.objects.get(pk=data.get('challenge'), session=request.session.session_key)
            except (AuthChallenge.DoesNotExist, ValueError, ValidationError):
                raise AuthError('Invalid or expired request. Request a new code.')
            # Increment and commit attempts before verification; failed checks must persist.
            with transaction.atomic():
                challenge = AuthChallenge.objects.select_for_update().get(pk=challenge.pk)
                if challenge.consumed or challenge.expires_at <= timezone.now() or challenge.attempts >= 5:
                    raise AuthError('Code expired or attempt limit reached. Request a new code.')
                challenge.attempts += 1
                challenge.save(update_fields=['attempts'])
            code = data.get('otp', '')
            if not re.fullmatch(r'[0-9]{6}', code):
                raise AuthError('Enter the six-digit code.')
            approved = twilio('VerificationCheck', {'To': challenge.destination, 'Code': code}).get('status') == 'approved' if challenge.purpose == 'phone' else check_password(code, challenge.code_hash)
            if not approved:
                raise AuthError('Incorrect verification code.')
            with transaction.atomic():
                challenge = AuthChallenge.objects.select_for_update().get(pk=challenge.pk)
                if challenge.consumed or challenge.expires_at <= timezone.now():
                    raise AuthError('This code has already been used.')
                if challenge.purpose == 'signup':
                    if User.objects.filter(email__iexact=challenge.destination).exists():
                        raise AuthError('Account already exists. Please log in.')
                    # Deterministic username also prevents simultaneous duplicate email registration.
                    username = 'email_' + hashlib.sha256(challenge.destination.encode()).hexdigest()
                    user = User.objects.create(username=username, email=challenge.destination, first_name=challenge.payload['name'], password=challenge.payload['password'])
                elif challenge.purpose == 'reset':
                    user = User.objects.filter(email__iexact=challenge.destination, is_active=True).first()
                    if not user:
                        raise AuthError('Invalid reset request.')
                    if challenge.payload.get('password_version') != hashlib.sha256(user.password.encode()).hexdigest():
                        raise AuthError('Password was already changed. Request a new reset code.')
                    validate_password(data.get('password', ''), user)
                    user.set_password(data['password'])
                    user.save(update_fields=['password'])
                else:
                    identity = PhoneIdentity.objects.select_related('user').filter(phone=challenge.destination).first()
                    if identity:
                        user = identity.user
                    else:
                        user = User.objects.create_user(username='phone_' + hashlib.sha256(challenge.destination.encode()).hexdigest(), password=None)
                        PhoneIdentity.objects.create(user=user, phone=challenge.destination)
                    if not user.is_active:
                        raise AuthError('This account is disabled.')
                challenge.consumed = True
                challenge.payload = {}
                challenge.code_hash = ''
                challenge.save()
            if challenge.purpose == 'reset':
                logout(request)
                return JsonResponse({'message': 'Password updated. Please log in with your new password.'})
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            return JsonResponse({'user': user_data(user)})
        return JsonResponse({'error': 'Unknown action.'}, status=404)
    except (AuthError, ValidationError) as exc:
        return JsonResponse({'error': ' '.join(exc.messages) if isinstance(exc, ValidationError) else str(exc)}, status=400)
    except (json.JSONDecodeError, UnicodeDecodeError, IntegrityError):
        return JsonResponse({'error': 'Invalid request or account already exists.'}, status=400)
