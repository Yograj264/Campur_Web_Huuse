"""Session-authenticated, permission-checked management API for the custom admin UI."""
import json
import uuid
from datetime import timedelta
from functools import wraps
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.admin.models import LogEntry, ADDITION, CHANGE, DELETION
from django.core.paginator import Paginator
from django.db import transaction, IntegrityError
from django.db.models import Q, Count
from django.db.models.functions import TruncMonth
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.text import slugify
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_http_methods
from .auth_views import limit, AuthError
from .models import College, Course, StudentProfile, StudyPlan, CareerRoadmap
from .management_forms import CollegeForm, CourseForm, StudentForm, StudyPlanForm, RoadmapForm

User = get_user_model()
RESOURCES = {
    'colleges': (College, CollegeForm, 'portal', 'college'),
    'students': (User, StudentForm, 'auth', 'user'),
    'courses': (Course, CourseForm, 'portal', 'course'),
    'plans': (StudyPlan, StudyPlanForm, 'portal', 'studyplan'),
    'roadmaps': (CareerRoadmap, RoadmapForm, 'portal', 'careerroadmap'),
}

def permitted(user, resource, action):
    _, _, app, model = RESOURCES[resource]
    allowed = user.has_perm(f'{app}.{action}_{model}')
    if resource == 'students':
        allowed = allowed and user.has_perm(f'portal.{action}_studentprofile')
    return allowed


def permissions(user):
    return {resource: {action: permitted(user, resource, action) for action in ['view', 'add', 'change', 'delete']} for resource in RESOURCES}


def staff_data(user):
    if not user.is_authenticated or not user.is_active or not user.is_staff:
        return None
    return {'id': user.pk, 'name': user.first_name or user.username, 'email': user.email,
            'is_superuser': user.is_superuser, 'permissions': permissions(user)}


def read_body(request):
    if len(request.body) > 100_000:
        raise ValueError('Request too large.')
    value = json.loads(request.body or '{}')
    if not isinstance(value, dict):
        raise ValueError('Invalid form data.')
    return value


@never_cache
@require_http_methods(['GET', 'POST'])
def admin_auth(request, action):
    if action == 'session' and request.method == 'GET':
        return JsonResponse({'user': staff_data(request.user), 'csrfToken': get_token(request)})
    if request.method != 'POST' or action not in ['login', 'logout']:
        return JsonResponse({'error': 'Method not allowed.'}, status=405)
    if action == 'logout':
        logout(request)
        return JsonResponse({'user': None})
    try:
        data = read_body(request)
        identity = data.get('identity', '')
        password = data.get('password', '')
        if not isinstance(identity, str) or not isinstance(password, str) or len(identity) > 254 or len(password) > 256:
            raise ValueError('Invalid credentials.')
        identity = identity.strip()
        limit('admin-ip:' + request.META.get('REMOTE_ADDR', ''), 20, 600)
        limit('admin-login:' + identity.casefold(), 10, 600)
        # Username is accepted for existing Django superusers; email must identify exactly one account.
        account = User.objects.filter(username=identity).first()
        if account is None:
            candidates = list(User.objects.filter(email__iexact=identity)[:2])
            account = candidates[0] if len(candidates) == 1 else None
        user = authenticate(request, username=account.username if account else '__invalid_admin__', password=password)
        if not user or not user.is_active or not user.is_staff:
            return JsonResponse({'error': 'Invalid credentials or this account is not authorized for administration.'}, status=403)
        login(request, user)
        request.session.set_expiry(60 * 60 * 24 * 7 if data.get('remember') is True else 0)
        return JsonResponse({'user': staff_data(user), 'csrfToken': get_token(request)})
    except AuthError as error:
        return JsonResponse({'error': str(error)}, status=429)
    except (ValueError, TypeError):
        return JsonResponse({'error': 'Invalid login data.'}, status=400)


def staff_required(view):
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Please sign in as an administrator.'}, status=401)
        if not request.user.is_active or not request.user.is_staff:
            return JsonResponse({'error': 'Administrator access is required.'}, status=403)
        return view(request, *args, **kwargs)
    return wrapped


def queryset(resource):
    if resource == 'students':
        return User.objects.filter(is_staff=False, is_superuser=False).select_related('student_profile').order_by('-date_joined')
    return RESOURCES[resource][0].objects.all().order_by('pk')


def serialize(resource, row):
    if resource == 'students':
        p = getattr(row, 'student_profile', None)
        return {'id': row.pk, 'full_name': p.full_name if p else row.first_name or row.username,
                'email': row.email, 'is_active': row.is_active, 'joined': row.date_joined.isoformat(),
                **{key: getattr(p, key, '') if p else '' for key in ['education', 'institution', 'course', 'city', 'career_goal']}}
    fields = RESOURCES[resource][1]._meta.fields
    data = model_to_dict(row, fields=fields)
    data['id'] = row.pk
    if resource == 'colleges':
        data.update({key: (row.data or {}).get(key, '') for key in ['category', 'subLocation', 'image', 'description', 'naacGrade', 'entranceExam']})
    if resource == 'courses':
        data['college_name'] = row.college.name
    if resource == 'plans':
        data['roadmap_title'] = row.roadmap.title if row.roadmap_id else ''
    return data


def audit(request, row, flag):
    LogEntry.objects.log_actions(user_id=request.user.pk, queryset=[row], action_flag=flag,
                                change_message='Changed through Campus Connect management panel.')


def mark_courses(college_id):
    if college_id:
        row = College.objects.get(pk=college_id)
        row.data = {**(row.data or {}), 'coursesManaged': True}
        row.save(update_fields=['data'])


@never_cache
@staff_required
@require_http_methods(['GET', 'POST', 'PUT', 'DELETE'])
def records(request, resource, record_id=None):
    if resource not in RESOURCES:
        return JsonResponse({'error': 'Unknown management section.'}, status=404)
    action = {'GET': 'view', 'POST': 'add', 'PUT': 'change', 'DELETE': 'delete'}[request.method]
    if not permitted(request.user, resource, action):
        return JsonResponse({'error': 'You do not have permission for this operation.'}, status=403)
    if (request.method == 'POST' and record_id is not None) or (request.method in ['PUT', 'DELETE'] and record_id is None):
        return JsonResponse({'error': 'Method not allowed for this address.'}, status=405)
    if record_id is not None and resource in ['students', 'courses', 'plans'] and not record_id.isdigit():
        return JsonResponse({'error': 'Record not found.'}, status=404)
    rows = queryset(resource)
    if record_id is None and request.method == 'GET':
        query = request.GET.get('q', '').strip()[:150]
        if query:
            if resource == 'students':
                rows = rows.filter(Q(first_name__icontains=query) | Q(email__icontains=query) | Q(student_profile__institution__icontains=query))
            elif resource == 'roadmaps':
                rows = rows.filter(title__icontains=query)
            else:
                rows = rows.filter(name__icontains=query)
        page = Paginator(rows, 20).get_page(request.GET.get('page', 1))
        return JsonResponse({'records': [serialize(resource, row) for row in page], 'count': page.paginator.count, 'page': page.number, 'pages': page.paginator.num_pages})
    row = get_object_or_404(rows, pk=record_id) if record_id is not None else None
    if request.method == 'GET':
        return JsonResponse({'record': serialize(resource, row)})
    previous_college = row.college_id if resource == 'courses' and row else None
    try:
        data = read_body(request)
        with transaction.atomic():
            if request.method == 'DELETE':
                # Explicit confirmation prevents accidental cascades from a stale one-click action.
                if str(data.get('confirm_id', '')) != str(row.pk):
                    return JsonResponse({'error': 'Confirm the record ID before deletion.'}, status=400)
                old_college = row.college_id if resource == 'courses' else None
                audit(request, row, DELETION)
                row.delete()
                mark_courses(old_college)
                return JsonResponse({'message': 'Record deleted.'})
            if resource == 'students':
                form = StudentForm(data, account=row)
            else:
                form = RESOURCES[resource][1](data, instance=row)
            if not form.is_valid():
                return JsonResponse({'error': 'Please check the highlighted fields.', 'fields': form.errors.get_json_data()}, status=400)
            if resource == 'students':
                clean = form.cleaned_data
                account = row or User(username='student-' + uuid.uuid4().hex)
                account.email, account.first_name, account.is_active = clean['email'], clean['full_name'], clean['is_active']
                if clean.get('password'):
                    account.set_password(clean['password'])
                account.save()
                profile, _ = StudentProfile.objects.get_or_create(user=account)
                for key in ['full_name', 'education', 'institution', 'course', 'city', 'career_goal']:
                    setattr(profile, key, clean.get(key, ''))
                profile.save()
                saved = account
            else:
                saved = form.save(commit=False)
                if row is None and resource in ['colleges', 'roadmaps']:
                    saved.pk = (slugify(saved.name if resource == 'colleges' else saved.title)[:40 if resource == 'colleges' else 60] or 'record') + '-' + uuid.uuid4().hex[:8]
                old_college = previous_college
                saved.save()
                if resource == 'courses':
                    mark_courses(saved.college_id)
                    mark_courses(old_college)
            audit(request, saved, CHANGE if row else ADDITION)
            return JsonResponse({'record': serialize(resource, saved), 'message': 'Changes saved.'}, status=200 if row else 201)
    except IntegrityError:
        return JsonResponse({'error': 'The record conflicts with an existing record. Refresh and try again.'}, status=400)
    except (ValueError, TypeError):
        return JsonResponse({'error': 'Invalid form data.'}, status=400)


@never_cache
@staff_required
@require_http_methods(['GET'])
def options(request):
    data = {'colleges': [], 'roadmaps': []}
    if permitted(request.user, 'colleges', 'view'):
        data['colleges'] = list(College.objects.values('id', 'name').order_by('name'))
    if permitted(request.user, 'roadmaps', 'view'):
        data['roadmaps'] = list(CareerRoadmap.objects.values('id', 'title').order_by('title'))
    return JsonResponse(data)


@never_cache
@staff_required
@require_http_methods(['GET'])
def summary(request):
    user = request.user
    counts = {name: queryset(name).count() if permitted(user, name, 'view') else None for name in RESOURCES}
    counts['users'] = User.objects.count() if user.has_perm('auth.view_user') else None
    categories = {}
    if permitted(user, 'colleges', 'view'):
        for row in College.objects.all():
            category = str((row.data or {}).get('category') or 'Not specified')
            categories[category] = categories.get(category, 0) + 1
    growth = []
    if user.has_perm('auth.view_user'):
        today = timezone.localdate()
        start = today.replace(day=1)
        for _ in range(5):
            start = (start - timedelta(days=1)).replace(day=1)
        grouped = User.objects.filter(date_joined__date__gte=start).annotate(month=TruncMonth('date_joined')).values('month').annotate(total=Count('pk'))
        totals = {row['month'].strftime('%Y-%m'): row['total'] for row in grouped}
        cursor = start
        for _ in range(6):
            growth.append({'month': cursor.strftime('%b %Y'), 'count': totals.get(cursor.strftime('%Y-%m'), 0)})
            cursor = (cursor.replace(day=28) + timedelta(days=4)).replace(day=1)
    # Staff see only their own activity; superusers may see all administrative changes.
    logs = LogEntry.objects.select_related('user', 'content_type').order_by('-action_time')
    if not user.is_superuser:
        logs = logs.filter(user=user)
    activity = [{'id': row.pk, 'object': row.object_repr, 'action': row.get_action_flag_display(), 'actor': row.user.first_name or row.user.username, 'time': row.action_time.isoformat()} for row in logs[:8]]
    return JsonResponse({'counts': counts, 'categories': categories, 'growth': growth, 'activity': activity,
        'colleges': [serialize('colleges', row) for row in College.objects.order_by('name')[:5]] if permitted(user, 'colleges', 'view') else [],
        'students': [serialize('students', row) for row in queryset('students')[:5]] if permitted(user, 'students', 'view') else []})
