from io import BytesIO
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, Client
from PIL import Image
from .models import StudentProfile


class StudentProfileTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='profile-student', email='student@example.com', password='Student-test-902!', first_name='Student')
        self.other = get_user_model().objects.create_user(username='other-student', password='Student-test-902!')
        self.client.force_login(self.user)
        self.values = {'full_name':'Student Example', 'education':'college', 'institution':'Example College', 'course':'Computer Science', 'city':'Pune', 'graduation_year':'2028', 'career_goal':'Software developer', 'interests':'Python, design', 'bio':'I enjoy building projects.'}

    def image(self):
        buffer = BytesIO()
        Image.new('RGB', (100, 80), 'blue').save(buffer, format='PNG')
        return SimpleUploadedFile('photo.png', buffer.getvalue(), content_type='image/png')

    def test_anonymous_cannot_access_profile_or_photo(self):
        client = Client()
        self.assertEqual(client.get('/api/profile/').status_code, 401)
        self.assertEqual(client.post('/api/profile/', self.values).status_code, 401)
        self.assertEqual(client.get('/api/profile/photo/').status_code, 401)

    def test_session_creates_incomplete_profile_for_existing_account(self):
        response = self.client.get('/api/auth/session/')
        self.assertFalse(response.json()['user']['profile_complete'])
        self.assertEqual(StudentProfile.objects.filter(user=self.user).count(), 1)
        self.client.get('/api/auth/session/')
        self.assertEqual(StudentProfile.objects.filter(user=self.user).count(), 1)

    def test_save_and_reload_profile_updates_own_name_only(self):
        result = self.client.post('/api/profile/', self.values)
        self.assertEqual(result.status_code, 200, result.content)
        self.assertTrue(result.json()['profile']['is_complete'])
        self.assertEqual(self.client.get('/api/profile/').json()['profile']['course'], 'Computer Science')
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Student Example')
        self.assertEqual(self.client.get('/api/auth/session/').json()['user']['name'], 'Student Example')
        other = Client(); other.force_login(self.other)
        self.assertFalse(other.get('/api/profile/').json()['profile']['is_complete'])

    def test_uploaded_photo_normalized_private_and_not_in_profile_json(self):
        values = dict(self.values, photo_upload=self.image())
        self.assertEqual(self.client.post('/api/profile/', values).status_code, 200)
        response = self.client.get('/api/profile/photo/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'image/jpeg')
        self.assertTrue(self.client.get('/api/auth/session/').json()['user']['photo_url'].startswith('/api/profile/photo/'))
        self.assertIn('no-store', response['Cache-Control'])
        image = Image.open(BytesIO(response.content))
        self.assertEqual(image.size, (512,512))
        self.assertNotIn('photo', self.client.get('/api/profile/').json()['profile'])
        other = Client(); other.force_login(self.other)
        self.assertEqual(other.get('/api/profile/photo/?user_id='+str(self.user.pk)).status_code, 404)
        self.assertEqual(self.client.get('/api/profile/photo/').status_code, 200)

    def test_fake_image_and_oversized_upload_rejected(self):
        for file in [SimpleUploadedFile('fake.jpg',b'<svg>not an image</svg>',content_type='image/jpeg'),SimpleUploadedFile('large.png',b'x'*(2*1024*1024+1),content_type='image/png')]:
            response = self.client.post('/api/profile/',dict(self.values,photo_upload=file))
            self.assertEqual(response.status_code, 400)
            self.assertIn('photo_upload',response.json()['fields'])
        self.assertFalse(StudentProfile.objects.get(user=self.user).photo)

    def test_incomplete_or_invalid_fields_rejected(self):
        for changes in [{'full_name':' '},{'education':'invalid'},{'graduation_year':'1900'},{'city':''},{'bio':'x'*1001}]:
            response = self.client.post('/api/profile/',dict(self.values,**changes))
            self.assertEqual(response.status_code, 400, response.content)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name,'Student')

    def test_cannot_edit_other_account_or_account_email(self):
        self.client.post('/api/profile/',dict(self.values,user=str(self.other.pk),email='attacker@example.com'))
        self.assertFalse(StudentProfile.objects.filter(user=self.other).exists())
        self.user.refresh_from_db()
        self.assertEqual(self.user.email,'student@example.com')

    def test_remove_and_replace_photo(self):
        self.client.post('/api/profile/',dict(self.values,photo_upload=self.image()))
        self.assertEqual(self.client.get('/api/profile/photo/').status_code,200)
        self.client.post('/api/profile/',dict(self.values,remove_photo='on'))
        self.assertEqual(self.client.get('/api/profile/photo/').status_code,404)
        self.assertIsNone(self.client.get('/api/auth/session/').json()['user']['photo_url'])
        self.client.post('/api/profile/',dict(self.values,photo_upload=self.image()))
        self.assertEqual(self.client.get('/api/profile/photo/').status_code,200)

    def test_profile_post_requires_csrf(self):
        client = Client(enforce_csrf_checks=True)
        client.force_login(self.user)
        self.assertEqual(client.post('/api/profile/',self.values).status_code,403)
        token=client.get('/api/auth/session/').json()['csrfToken']
        self.assertEqual(client.post('/api/profile/',self.values,HTTP_X_CSRFTOKEN=token).status_code,200)

    def test_dashboard_details_round_trip_and_secure_links(self):
        details = dict(self.values, headline='Aspiring developer', skills='Python, Django',
                       preferred_fields='Software Development, AI / ML', goals='Build a portfolio\nFind an internship',
                       linkedin_url='https://www.linkedin.com/in/example', github_url='https://github.com/example',
                       qualification='12th Pass', school_completion_year='2023', quote='Keep learning.',
                       available_for_mentorship='on')
        response = self.client.post('/api/profile/', details)
        self.assertEqual(response.status_code, 200, response.content)
        record = self.client.get('/api/profile/').json()['profile']
        self.assertEqual(record['skills'], 'Python, Django')
        self.assertEqual(record['goals'], 'Build a portfolio\nFind an internship')
        self.assertEqual(record['school_completion_year'], 2023)
        self.assertTrue(record['available_for_mentorship'])
        for changes in [{'github_url': 'javascript:alert(1)'}, {'linkedin_url': 'http://example.com'},
                        {'school_completion_year': '1900'}, {'skills': 'x' * 501}]:
            self.assertEqual(self.client.post('/api/profile/', dict(details, **changes)).status_code, 400)

    def test_multi_select_goals_and_fields_limit_and_normalization(self):
        values = dict(self.values, career_goal='Developer, Designer, Researcher',
                      preferred_fields='Software Development, AI / ML, Cybersecurity', skills='Python, Django, python')
        result = self.client.post('/api/profile/', values)
        self.assertEqual(result.status_code, 200, result.content)
        record = self.client.get('/api/profile/').json()['profile']
        self.assertEqual(len(record['career_goal'].split(',')), 3)
        self.assertEqual(record['preferred_fields'], values['preferred_fields'])
        self.assertEqual(len(record['skills'].split(',')), 2)
        for field in ['career_goal', 'preferred_fields']:
            result = self.client.post('/api/profile/', dict(values, **{field: 'One, Two, Three, Four'}))
            self.assertEqual(result.status_code, 400)
            self.assertIn(field, result.json()['fields'])
        self.assertEqual(self.client.post('/api/profile/', dict(values, career_goal=' , ')).status_code, 400)

    def test_cover_upload_private_normalized_and_removable(self):
        self.assertEqual(Client().get('/api/profile/cover/').status_code, 401)
        response = self.client.post('/api/profile/', dict(self.values, cover_upload=self.image()))
        self.assertEqual(response.status_code, 200, response.content)
        self.assertTrue(response.json()['profile']['cover_url'].startswith('/api/profile/cover/'))
        cover = self.client.get('/api/profile/cover/')
        self.assertEqual(Image.open(BytesIO(cover.content)).size, (1600, 400))
        self.assertIn('no-store', cover['Cache-Control'])
        other = Client(); other.force_login(self.other)
        self.assertEqual(other.get('/api/profile/cover/?user_id=' + str(self.user.pk)).status_code, 404)
        self.assertEqual(self.client.post('/api/profile/', dict(self.values, cover_upload=SimpleUploadedFile('bad.jpg', b'bad'))).status_code, 400)
        self.client.post('/api/profile/', dict(self.values, remove_cover='on'))
        self.assertEqual(self.client.get('/api/profile/cover/').status_code, 404)

    def test_photo_survives_separate_requests_and_no_public_id_route(self):
        self.client.post('/api/profile/',dict(self.values,photo_upload=self.image()))
        client = Client(); client.force_login(self.user)
        self.assertEqual(client.get('/api/profile/photo/').status_code,200)
        self.assertEqual(client.get('/api/profile/123/').status_code,404)
