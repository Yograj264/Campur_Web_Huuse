import re
from tempfile import TemporaryDirectory
from django.conf import settings
from django.core.management import call_command
from django.test import TestCase, override_settings
from .models import College


class CatalogueTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seed_demo', verbosity=0)

    def test_landing_shell(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Campus Web Connect')
        self.assertContains(response, '/static/frontend/assets/')

    def test_catalogue_only_returns_colleges(self):
        data = self.client.get('/api/bootstrap/').json()
        self.assertEqual(set(data), {'colleges'})
        self.assertEqual(len(data['colleges']), College.objects.count())
        self.assertTrue(all('isSaved' not in college for college in data['colleges']))

    def test_catalogue_uses_current_admin_fields(self):
        college = College.objects.first()
        college.name = 'Updated College'
        college.annual_fee = '3.50'
        college.save()
        record = next(row for row in self.client.get('/api/bootstrap/').json()['colleges'] if row['id'] == college.pk)
        self.assertEqual(record['name'], 'Updated College')
        self.assertEqual(record['annualFeeNumber'], 3.5)
        self.assertEqual(record['annualFee'], 'INR 3.50 L/yr')

    def test_catalogue_is_read_only(self):
        self.assertEqual(self.client.post('/api/bootstrap/').status_code, 405)
        self.assertEqual(self.client.post('/api/action/').status_code, 404)
        self.assertEqual(self.client.get('/api/mobile/bootstrap/').status_code, 404)
        self.assertEqual(self.client.get('/api/discussions/missing/answers/').status_code, 404)

    def test_empty_catalogue(self):
        College.objects.all().delete()
        self.assertEqual(self.client.get('/api/bootstrap/').json(), {'colleges': []})

    def test_seed_preserves_existing_records(self):
        count = College.objects.count()
        college = College.objects.first()
        college.name = 'Keep my edits'
        college.save()
        call_command('seed_demo', verbosity=0)
        college.refresh_from_db()
        self.assertEqual(College.objects.count(), count)
        self.assertEqual(college.name, 'Keep my edits')


class ProductionAssetsTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.directory = TemporaryDirectory(prefix='.test-static-', dir=settings.BASE_DIR)
        cls.production = override_settings(DEBUG=False, STATIC_ROOT=cls.directory.name)
        cls.production.enable()
        call_command('collectstatic', interactive=False, verbosity=0, post_process=False)

    @classmethod
    def tearDownClass(cls):
        cls.production.disable()
        cls.directory.cleanup()
        super().tearDownClass()

    def test_built_assets_load_in_production(self):
        page = self.client.get('/')
        urls = re.findall(r'/static/frontend/assets/[^" ]+', page.content.decode())
        self.assertTrue(any(url.endswith('.js') for url in urls))
        self.assertTrue(any(url.endswith('.css') for url in urls))
        for url in urls + ['/static/frontend/landing/student-hero.png', '/static/frontend/auth/campus-student.png']:
            with self.subTest(url=url):
                response = self.client.get(url)
                self.assertEqual(response.status_code, 200)
                self.assertNotIn('text/html', response['Content-Type'])
                response.close()
