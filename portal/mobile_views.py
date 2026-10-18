"""Anonymous device sessions for native clients; browser endpoints keep CSRF protection."""
from functools import wraps
from importlib import import_module
from django.conf import settings
from django.core import signing
from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from . import views

SALT = 'campus.mobile.visitor.v1'
MAX_AGE = 60 * 60 * 24 * 14

def device_session(request, create=False):
    """Use only an explicit signed bearer, never ambient browser cookies."""
    store = import_module(settings.SESSION_ENGINE).SessionStore
    header = request.headers.get('Authorization', '')
    if header:
        if not header.startswith('Bearer '):
            raise signing.BadSignature('Invalid authorization scheme')
        key = signing.loads(header[7:], salt=SALT, max_age=MAX_AGE)
        if not isinstance(key, str) or not store().exists(key):
            raise signing.BadSignature('Session expired')
        request.session = store(session_key=key)
    elif create:
        request.session = store()
        request.session.create()
    else:
        raise signing.BadSignature('Bearer token required')

def native_only(view):
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        try:
            device_session(request)
        except signing.BadSignature:
            return JsonResponse({'error': 'Device session expired. Reconnect to the server.'}, status=401)
        return view(request, *args, **kwargs)
    return wrapped

@never_cache
@require_GET
def bootstrap(request):
    try:
        device_session(request, create=True)
    except signing.BadSignature:
        return JsonResponse({'error': 'Device session expired.'}, status=401)
    payload = views.state_payload(request)
    payload['token'] = signing.dumps(request.session.session_key, salt=SALT)
    return JsonResponse(payload)

# These dedicated endpoints authenticate explicit bearer tokens. They do not use
# browser-cookie authorization. The existing /api/action/ remains CSRF protected.
@csrf_exempt
@never_cache
@require_POST
@native_only
def action(request):
    return views.action(request)

@never_cache
@require_GET
@native_only
def answers(request, identifier):
    return views.answers(request, identifier)
