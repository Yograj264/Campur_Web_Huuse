import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from portal.models import Discussion, MentorQuestion


class CampusConnectionsTests(TestCase):
    def setUp(self):
        self.user=get_user_model().objects.create_user(username='campus-test',password='Campus-test-902!')

    def test_public_questions_and_signed_in_post(self):
        self.assertEqual(self.client.get('/api/community/').status_code,200)
        payload={'title':'How do I choose a college?', 'body':'Which factors should I compare when choosing between colleges?'}
        self.assertEqual(self.client.post('/api/community/',json.dumps(payload),content_type='application/json').status_code,401)
        self.client.force_login(self.user)
        response=self.client.post('/api/community/',json.dumps(payload),content_type='application/json')
        self.assertEqual(response.status_code,201)
        self.assertEqual(response.json()['threads'][0]['title'],payload['title'])
        self.assertEqual(Discussion.objects.count(),1)

    def test_guidance_is_private_and_persists_for_account(self):
        self.assertEqual(self.client.get('/api/guidance/').status_code,401)
        self.client.force_login(self.user)
        response=self.client.post('/api/guidance/',json.dumps({'question':'What projects should I build before applying for an internship?'}),content_type='application/json')
        self.assertEqual(response.status_code,201)
        self.assertEqual(len(response.json()['questions']),1)
        other=get_user_model().objects.create_user(username='other-campus-test')
        second=Client();second.force_login(other)
        self.assertEqual(second.get('/api/guidance/').json()['questions'],[])
        self.assertEqual(MentorQuestion.objects.count(),1)

    def test_csrf_and_validation(self):
        protected=Client(enforce_csrf_checks=True);protected.force_login(self.user)
        self.assertEqual(protected.post('/api/community/','{}',content_type='application/json').status_code,403)
        self.client.force_login(self.user)
        for endpoint in ['community','guidance']:
            self.assertEqual(self.client.post('/api/'+endpoint+'/',json.dumps({'title':[]}),content_type='application/json').status_code,400)

    def test_legacy_author_objects_are_returned_as_names(self):
        Discussion.objects.create(id='legacy-question', title='Legacy question', body='A previous student question.', data={'author': {'name': 'Campus Student', 'role': 'Student'}})
        response = self.client.get('/api/community/')
        self.assertEqual(response.json()['threads'][0]['author'], 'Campus Student')
