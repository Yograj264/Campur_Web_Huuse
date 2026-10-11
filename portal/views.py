import json
from uuid import uuid4
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST
from .models import College, Discussion, VisitorState, MentorQuestion, Answer

def visitor(request):
    if not request.session.session_key:
        request.session.create()
    obj, _ = VisitorState.objects.get_or_create(session_key=request.session.session_key)
    return obj

def state_payload(request):
    state = visitor(request).data
    colleges = [dict(c.data, id=c.pk, name=c.name, location=c.location, annualFeeNumber=float(c.annual_fee), isSaved=state.get('colleges', {}).get(c.pk, c.data.get('isSaved', False))) for c in College.objects.all()]
    discussions = []
    for d in Discussion.objects.order_by('-created_at'):
        voted = state.get('votes', {}).get(d.pk, d.data.get('hasUpvoted', False))
        discussions.append(dict(d.data, id=d.pk, title=d.title, body=d.body, hasUpvoted=voted, isSaved=state.get('discussions', {}).get(d.pk, d.data.get('isSaved', False)), answersCount=d.answers.count()))
    return {'colleges':colleges,'discussions':discussions,'profileScore':state.get('profileScore',85),'unreadCount':state.get('unreadCount',3),'reminders':state.get('reminders',{}),'activeTrack':state.get('activeTrack','')}

@ensure_csrf_cookie
@require_GET
def index(request):
    return render(request, 'index.html')

@ensure_csrf_cookie
@require_GET
def bootstrap(request):
    return JsonResponse(state_payload(request))

@require_POST
@transaction.atomic
def action(request):
    try:
        data = json.loads(request.body)
        if not isinstance(data, dict): raise ValueError()
    except (ValueError, UnicodeDecodeError):
        return JsonResponse({'error':'Invalid JSON object'}, status=400)
    obj = visitor(request)
    obj = VisitorState.objects.select_for_update().get(pk=obj.pk)
    state = obj.data
    kind, identifier = data.get('action'), str(data.get('id',''))
    if kind in ('save_college','save_discussion','vote_discussion','reminder'):
        mapping = {'save_college':'colleges','save_discussion':'discussions','vote_discussion':'votes','reminder':'reminders'}[kind]
        defaults = False
        record = None
        if kind == 'save_college':
            record = get_object_or_404(College, pk=identifier)
            defaults = record.data.get('isSaved',False)
        elif kind in ('save_discussion','vote_discussion'):
            record = get_object_or_404(Discussion.objects.select_for_update(), pk=identifier)
            defaults = record.data.get('hasUpvoted' if kind == 'vote_discussion' else 'isSaved',False)
        values = state.setdefault(mapping,{})
        previous = values.get(identifier, defaults)
        values[identifier] = not previous
        if kind == 'vote_discussion':
            record.data['upvotes'] = max(0,record.data.get('upvotes',0) + (-1 if previous else 1))
            record.save(update_fields=['data'])
    elif kind == 'create_answer':
        discussion = get_object_or_404(Discussion, pk=identifier)
        body = str(data.get('body','')).strip()
        if not body or len(body)>20000: return JsonResponse({'error':'Enter an answer (up to 20000 characters).'},status=400)
        Answer.objects.create(id='ans-'+uuid4().hex,discussion=discussion,data={'author':{'name':'Campus Student','role':'Student','alumniInfo':'Community Contributor','avatar':'','badgeTag':'STUDENT'},'timeAgo':'Just now','steps':[{'headline':'Community Contribution','content':body}],'upvotes':0,'helpfulCount':0,'nestedCount':0,'hasUpvoted':False})
    elif kind in ('vote_answer','helpful_answer'):
        answer = get_object_or_404(Answer.objects.select_for_update(),pk=identifier)
        mapping, flag, count = ('answerVotes','hasUpvoted','upvotes') if kind == 'vote_answer' else ('answerHelpful','hasMarkedHelpful','helpfulCount')
        values = state.setdefault(mapping,{})
        previous = values.get(identifier,answer.data.get(flag,False))
        values[identifier] = not previous
        answer.data[count] = max(0,answer.data.get(count,0)+(-1 if previous else 1))
        answer.save(update_fields=['data'])
    elif kind == 'profile': state['profileScore'] = 100
    elif kind == 'read_notifications': state['unreadCount'] = 0
    elif kind == 'assessment': state['activeTrack'] = str(data.get('track',''))[:200]
    elif kind == 'create_discussion':
        title, body = str(data.get('title','')).strip(), str(data.get('body','')).strip()
        if not title or len(title)>300 or not body or len(body)>20000:
            return JsonResponse({'error':'Provide a title (up to 300 characters) and details (up to 20000).'},status=400)
        tags = data.get('tags',[])
        if not isinstance(tags,list) or len(tags)>4 or any(not isinstance(t,str) or len(t)>50 for t in tags):
            return JsonResponse({'error':'Invalid tags'},status=400)
        identifier = 'discussion-' + uuid4().hex
        Discussion.objects.create(id=identifier,title=title,body=body,data={'author':{'name':'Campus Student','role':'Student','college':'Your Campus','avatar':'','isOP':True},'timeAgo':'Just now','viewsCount':'1 view','tags':tags,'upvotes':1,'hasUpvoted':False,'category':str(data.get('category','Career & Placements'))[:100]})
        state.setdefault('votes',{})[identifier] = True
    elif kind == 'mentor_question':
        question = str(data.get('question','')).strip()
        if not question or len(question)>20000: return JsonResponse({'error':'Enter a question (up to 20000 characters).'},status=400)
        MentorQuestion.objects.create(session_key=obj.session_key,mentor=str(data.get('mentor',''))[:200],question=question)
    else: return JsonResponse({'error':'Unknown action'},status=400)
    obj.data = state
    obj.save(update_fields=['data'])
    return JsonResponse(state_payload(request))

@require_GET
def answers(request, identifier):
    discussion = get_object_or_404(Discussion, pk=identifier)
    state = visitor(request).data
    rows = [dict(a.data,id=a.pk,hasUpvoted=state.get('answerVotes',{}).get(a.pk,a.data.get('hasUpvoted',False)),hasMarkedHelpful=state.get('answerHelpful',{}).get(a.pk,a.data.get('hasMarkedHelpful',False))) for a in discussion.answers.order_by('created_at')]
    return JsonResponse({'answers':rows})
