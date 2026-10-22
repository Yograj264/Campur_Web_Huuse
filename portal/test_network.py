from unittest.mock import patch
from django.test import SimpleTestCase, RequestFactory, override_settings
from django.middleware.csrf import CsrfViewMiddleware, get_token
from campus_project.network import local_ipv4_addresses


class LocalNetworkTests(SimpleTestCase):
    @patch('campus_project.network.socket.getaddrinfo')
    def test_only_machine_private_ipv4_addresses_are_discovered(self, lookup):
        lookup.return_value = [(None,None,None,None,(ip,0)) for ip in ['192.168.1.4','10.0.0.2','8.8.8.8','127.0.0.1','192.168.1.4']]
        self.assertEqual(local_ipv4_addresses(), ['10.0.0.2','192.168.1.4'])

    @patch('campus_project.network.socket.getaddrinfo', side_effect=OSError())
    def test_discovery_failure_does_not_prevent_startup(self, lookup):
        self.assertEqual(local_ipv4_addresses(), [])

    @override_settings(ALLOWED_HOSTS=['192.168.1.4','127.0.0.1'], CSRF_TRUSTED_ORIGINS=['http://192.168.1.4:3000'])
    def test_lan_proxy_csrf_still_requires_valid_token_and_origin(self):
        factory = RequestFactory()
        seed = factory.get('/')
        token = get_token(seed)
        for origin, with_token, expected in [('http://192.168.1.4:3000',True,None),('http://untrusted.example',True,403),('http://192.168.1.4:3000',False,403)]:
            request = factory.post('/api/auth/signup/', HTTP_HOST='127.0.0.1:8000', HTTP_ORIGIN=origin)
            request.COOKIES['csrftoken']=seed.META['CSRF_COOKIE']
            if with_token: request.META['HTTP_X_CSRFTOKEN']=token
            middleware = CsrfViewMiddleware(lambda request:None)
            middleware.process_request(request)
            response=middleware.process_view(request,lambda request:None,(),{})
            self.assertEqual(response.status_code if response else None, expected)
