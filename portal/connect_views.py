import json
from uuid import uuid4
from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_http_methods
from .auth_views import limit, AuthError
from .models import Discussion, MentorQuestion


def author_name(data):
    value = data.get('author', 'Campus member')
    if isinstance(value, dict):
        value = value.get('name', 'Campus member')
    return value if isinstance(value, str) else 'Campus member'


@never_cache
@require_http_methods(['GET', 'POST'])
def community(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Please sign in to post a question.'}, status=401)
        try:
            if len(request.body) > 10000:
                raise ValueError()
            data = json.loads(request.body)
            title, body = data.get('title', ''), data.get('body', '')
            if not isinstance(title, str) or not isinstance(body, str) or not 5 <= len(title.strip()) <= 160 or not 10 <= len(body.strip()) <= 3000:
                raise ValueError()
            limit('community:' + str(request.user.pk), 10, 3600)
            Discussion.objects.create(id='question-' + uuid4().hex, title=title.strip(), body=body.strip(), data={'author': request.user.first_name or 'Campus member', 'author_id': request.user.pk})
        except AuthError as error:
            return JsonResponse({'error': str(error)}, status=429)
        except (ValueError, AttributeError, TypeError):
            return JsonResponse({'error': 'Use a title of 5–160 characters and a question of 10–3000 characters.'}, status=400)
    threads = [{'id': row.pk, 'title': row.title, 'body': row.body, 'author': author_name(row.data), 'created_at': row.created_at.isoformat()} for row in Discussion.objects.order_by('-created_at')[:40]]
    return JsonResponse({'threads': threads}, status=201 if request.method == 'POST' else 200)


@never_cache
@require_http_methods(['GET', 'POST'])
def guidance(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Please sign in to save your guidance questions.'}, status=401)
    owner = 'user:' + str(request.user.pk)
    if request.method == 'POST':
        try:
            if len(request.body) > 5000:
                raise ValueError()
            data = json.loads(request.body)
            question = data.get('question', '')
            if not isinstance(question, str) or not 10 <= len(question.strip()) <= 2000:
                raise ValueError()
            limit('guidance:' + str(request.user.pk), 20, 3600)
            MentorQuestion.objects.create(session_key=owner, mentor='Personal guidance planner', question=question.strip())
        except AuthError as error:
            return JsonResponse({'error': str(error)}, status=429)
        except (ValueError, AttributeError, TypeError):
            return JsonResponse({'error': 'Write a question between 10 and 2000 characters.'}, status=400)
    return JsonResponse({'questions': [{'id': row.pk, 'question': row.question, 'created_at': row.created_at.isoformat()} for row in MentorQuestion.objects.filter(session_key=owner).order_by('-created_at')[:50]]}, status=201 if request.method == 'POST' else 200)
