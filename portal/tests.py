import json
from django.test import TestCase, Client
from django.core.management import call_command
from .models import College, Discussion, Answer, MentorQuestion

class PortalTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seed_demo', verbosity=0)
    def action(self, data, client=None):
        return (client or self.client).post('/api/action/',data=json.dumps(data),content_type='application/json')
    def test_page_and_bootstrap(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code,200)
        self.assertContains(response,'/static/frontend/assets/')
        self.assertIn('csrftoken',response.cookies)
        self.assertEqual(len(self.client.get('/api/bootstrap/').json()['colleges']),College.objects.count())
    def test_bookmarks_persist_and_are_session_specific(self):
        first = self.client.get('/api/bootstrap/').json()['colleges'][0]
        response = self.action({'action':'save_college','id':first['id']}).json()
        changed = next(c for c in response['colleges'] if c['id']==first['id'])
        self.assertEqual(changed['isSaved'],not first['isSaved'])
        self.assertEqual(self.client.get('/api/bootstrap/').json()['colleges'],response['colleges'])
        other = Client().get('/api/bootstrap/').json()['colleges'][0]
        self.assertEqual(other['isSaved'],first['isSaved'])
    def test_discussion_and_answers(self):
        response = self.action({'action':'create_discussion','title':'Django learning','body':'How do I learn Django?','tags':['Python']})
        self.assertEqual(response.status_code,200)
        discussion = Discussion.objects.get(title='Django learning')
        self.assertEqual(self.client.get(f'/api/discussions/{discussion.pk}/answers/').json()['answers'],[])
        self.assertEqual(self.action({'action':'create_answer','id':discussion.pk,'body':'Start with the tutorial.'}).status_code,200)
        answers = self.client.get(f'/api/discussions/{discussion.pk}/answers/').json()['answers']
        self.assertEqual(len(answers),1)
        self.assertEqual(answers[0]['steps'][0]['content'],'Start with the tutorial.')
    def test_validation_and_methods(self):
        self.assertEqual(self.action({'action':'create_discussion','title':'','body':'x'}).status_code,400)
        self.assertEqual(self.action({'action':'missing'}).status_code,400)
        self.assertEqual(self.action({'action':'save_college','id':'missing'}).status_code,404)
        self.assertEqual(self.client.get('/api/action/').status_code,405)
        self.assertEqual(self.client.post('/api/action/',data='[]',content_type='application/json').status_code,400)
    def test_csrf_is_required(self):
        client = Client(enforce_csrf_checks=True)
        self.assertEqual(self.action({'action':'profile'},client).status_code,403)
        client.get('/')
        response = client.post('/api/action/', data=json.dumps({'action':'profile'}), content_type='application/json', HTTP_X_CSRFTOKEN=client.cookies['csrftoken'].value)
        self.assertEqual(response.status_code,200)
    def test_votes_roundtrip(self):
        original = self.client.get('/api/bootstrap/').json()
        d = original['discussions'][0]
        self.action({'action':'vote_discussion','id':d['id']})
        result = self.action({'action':'vote_discussion','id':d['id']}).json()
        updated = next(v for v in result['discussions'] if v['id']==d['id'])
        self.assertEqual(updated['upvotes'],d['upvotes'])
        self.assertEqual(updated['hasUpvoted'],d['hasUpvoted'])
    def test_progress_and_mentor_question(self):
        self.action({'action':'profile'})
        self.action({'action':'read_notifications'})
        self.action({'action':'mentor_question','question':'How can I improve my resume?'})
        state = self.client.get('/api/bootstrap/').json()
        self.assertEqual(state['profileScore'],100)
        self.assertEqual(state['unreadCount'],0)
        self.assertEqual(MentorQuestion.objects.count(),1)
    def test_seed_is_idempotent(self):
        count = College.objects.count()
        call_command('seed_demo',verbosity=0)
        self.assertEqual(College.objects.count(),count)
