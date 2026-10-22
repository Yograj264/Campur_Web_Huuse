"""Permission, CSRF and persistence regression tests for custom administration."""
import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.contrib.admin.models import LogEntry
from .models import College, Course, StudyPlan, CareerRoadmap, StudentProfile

User = get_user_model()

class ManagementTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.admin = User.objects.create_superuser(username='management-admin', email='admin@example.com', password='Management-admin-904!')
        cls.staff = User.objects.create_user(username='limited-staff', password='Management-staff-904!', is_staff=True)
        cls.student = User.objects.create_user(username='management-student', email='student@example.com', password='Management-student-904!')
        cls.college = College.objects.create(id='management-college', name='Example College', location='Pune', annual_fee='2.50', data={'category': 'Private'})

    def setUp(self):
        self.client.force_login(self.admin)

    def send(self, path, values, method='post', client=None):
        return getattr(client or self.client, method)('/api/admin/'+path, json.dumps(values), content_type='application/json')

    def test_shell_routes_and_original_admin(self):
        guest = Client()
        for route in ['/admin/', '/admin/login/', '/admin/colleges/', '/admin/students/']:
            self.assertEqual(guest.get(route).status_code, 200)
        self.assertEqual(guest.get('/django-admin/').status_code, 302)
        self.assertEqual(guest.get('/api/admin/summary/').status_code, 401)
        self.assertEqual(guest.get('/api/admin/session/').json()['user'], None)

    def test_login_staff_only_username_email_and_session_expiry(self):
        guest = Client()
        self.assertEqual(self.send('login/', {'identity': 'student@example.com', 'password': 'Management-student-904!'}, client=guest).status_code, 403)
        self.assertNotIn('_auth_user_id', guest.session)
        for identity in ['management-admin', 'admin@example.com']:
            response = self.send('login/', {'identity': identity, 'password': 'Management-admin-904!', 'remember': True}, client=guest)
            self.assertEqual(response.status_code, 200, response.content)
            self.assertEqual(response.json()['user']['id'], self.admin.pk)
            self.assertTrue(guest.get('/api/auth/session/').json()['user']['is_staff'])
        self.assertFalse(guest.session.get_expire_at_browser_close())
        self.send('logout/', {}, client=guest)
        self.assertEqual(guest.get('/api/admin/summary/').status_code, 401)

    def test_session_and_mutations_require_csrf(self):
        client = Client(enforce_csrf_checks=True)
        self.assertEqual(self.send('login/', {'identity': 'management-admin', 'password': 'Management-admin-904!'}, client=client).status_code, 403)
        token = client.get('/api/admin/session/').json()['csrfToken']
        response = client.post('/api/admin/login/', json.dumps({'identity':'management-admin','password':'Management-admin-904!'}), content_type='application/json', HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.send('colleges/', {'name':'Blocked'}, client=client).status_code, 403)
        self.assertEqual(client.get('/api/admin/colleges/').status_code, 200)

    def test_nonstaff_and_limited_staff_permissions(self):
        self.client.force_login(self.student)
        self.assertEqual(self.client.get('/api/admin/colleges/').status_code, 403)
        self.client.force_login(self.staff)
        self.assertEqual(self.client.get('/api/admin/colleges/').status_code, 403)
        self.staff.user_permissions.add(Permission.objects.get(codename='view_college', content_type__app_label='portal'))
        self.assertEqual(self.client.get('/api/admin/colleges/').status_code, 200)
        self.assertEqual(self.send('colleges/', {'name':'No privilege'}).status_code, 403)
        summary = self.client.get('/api/admin/summary/').json()
        self.assertIsNone(summary['counts']['students'])
        self.assertEqual(summary['students'], [])
        self.assertEqual(summary['growth'], [])

    def test_college_crud_validation_and_audit(self):
        response = self.send('colleges/', {'name':'New College','location':'Delhi','annual_fee':'3.00','category':'Private'})
        self.assertEqual(response.status_code, 201, response.content)
        row = response.json()['record']
        values = dict(row, name='Edited College')
        self.assertEqual(self.send(f"colleges/{row['id']}/", values, 'put').status_code, 200)
        self.assertEqual(College.objects.get(pk=row['id']).name, 'Edited College')
        self.assertEqual(self.send('colleges/', dict(values, annual_fee='-1')).status_code, 400)
        self.assertEqual(self.send(f"colleges/{row['id']}/", {}, 'delete').status_code, 400)
        self.assertEqual(self.send(f"colleges/{row['id']}/", {'confirm_id':row['id']}, 'delete').status_code, 200)
        self.assertFalse(College.objects.filter(pk=row['id']).exists())
        self.assertEqual(LogEntry.objects.filter(user=self.admin).count(), 3)

    def test_student_create_update_permissions_and_no_role_escalation(self):
        response = self.send('students/', {'full_name':'New Student','email':'new@example.com','password':'Riverton!893-Lake','is_active':True,'is_staff':True,'is_superuser':True})
        self.assertEqual(response.status_code, 201, response.content)
        row = response.json()['record']
        user = User.objects.get(pk=row['id'])
        self.assertTrue(user.check_password('Riverton!893-Lake'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertNotIn('password', row)
        self.assertEqual(self.send(f"students/{user.pk}/", dict(row,institution='Updated School', password=''), 'put').status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.check_password('Riverton!893-Lake'))
        self.assertEqual(StudentProfile.objects.get(user=user).institution, 'Updated School')
        self.assertEqual(self.send('students/', {'full_name':'Duplicate','email':'NEW@example.com','password':'Riverton!893-Lake'}).status_code, 400)
        self.assertEqual(self.send(f'students/{self.admin.pk}/', {'is_staff':False}, 'put').status_code, 404)
        self.assertEqual(self.client.get('/api/admin/students/not-a-number/').status_code, 404)

    def test_course_publishing_and_deletion_updates_public_catalogue(self):
        response = self.send('courses/', {'college':self.college.pk,'name':'MCA','duration':'2 years','annual_fee':'1.50','published':True})
        self.assertEqual(response.status_code, 201, response.content)
        row = response.json()['record']
        public = next(v for v in self.client.get('/api/bootstrap/').json()['colleges'] if v['id']==self.college.pk)
        self.assertEqual(public['courses'][0]['name'], 'MCA')
        self.assertEqual(public['programs'], 'MCA')
        self.send(f"courses/{row['id']}/", {'confirm_id':row['id']}, 'delete')
        public = next(v for v in self.client.get('/api/bootstrap/').json()['colleges'] if v['id']==self.college.pk)
        self.assertEqual(public['courses'], [])
        self.assertEqual(public['programs'], '')

    def test_roadmap_and_linked_plan_publication(self):
        data = {'title':'Robotics','summary':'Build robots','icon':'code','theme':'blue','stages':['Learn electronics','Build a project'],'details':{'role':'Robotics Engineer','skills':['Python'],'core':['Electronics']},'published':True}
        response = self.send('roadmaps/', data)
        self.assertEqual(response.status_code, 201, response.content)
        row = response.json()['record']
        response = self.send('plans/', {'name':'Robotics Starter','roadmap':row['id'],'steps':'Learn circuits\nTry a simulator','duration':'Flexible','published':True})
        self.assertEqual(response.status_code, 201, response.content)
        public = next(v for v in self.client.get('/api/roadmaps/').json()['roadmaps'] if v['id']==row['id'])
        self.assertEqual(public['details']['plans'][0]['name'], 'Robotics Starter')
        self.assertEqual(public['details']['tools'], [])
        self.assertEqual(self.send(f"roadmaps/{row['id']}/", dict(data,published=False), 'put').status_code, 200)
        self.assertFalse(any(v['id']==row['id'] for v in self.client.get('/api/roadmaps/').json()['roadmaps']))

    def test_invalid_roadmap_resources_rejected(self):
        data = {'title':'Unsafe','summary':'Example','icon':'code','theme':'blue','stages':['Learn'],'details':{'resources':[{'name':'Unsafe','description':'test','type':'Guide','url':'javascript:alert(1)'}]},'published':True}
        self.assertEqual(self.send('roadmaps/', data).status_code, 400)
        self.assertEqual(self.send('roadmaps/', dict(data, stages=[''],details={'role':'Test'})).status_code, 400)

    def test_summary_counts_and_no_fake_activity(self):
        response = self.client.get('/api/admin/summary/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['counts']['users'], User.objects.count())
        self.assertEqual(data['counts']['colleges'], College.objects.count())
        self.assertEqual(len(data['growth']), 6)
        self.assertEqual(data['activity'], [])
