from django.db import transaction
from django.http import HttpResponse, JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_http_methods, require_GET
from .models import StudentProfile
from .profile_forms import ProfileForm


def serialize(profile):
    fields = ['full_name', 'education', 'institution', 'course', 'graduation_year', 'city', 'interests', 'career_goal', 'bio', 'headline', 'skills', 'preferred_fields', 'goals', 'linkedin_url', 'github_url', 'qualification', 'school_completion_year', 'quote', 'available_for_mentorship']
    data = {field: getattr(profile, field) for field in fields}
    data.update({
        'email': profile.user.email,
        'is_complete': profile.is_complete,
        'photo_url': '/api/profile/photo/?v=' + profile.updated_at.isoformat() if profile.photo else None,
        'cover_url': '/api/profile/cover/?v=' + profile.updated_at.isoformat() if profile.cover else None,
    })
    return data


@never_cache
@require_http_methods(['GET', 'POST'])
def profile(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Please log in to access your profile.'}, status=401)
    record, _ = StudentProfile.objects.get_or_create(user=request.user, defaults={'full_name': request.user.first_name})
    if request.method == 'GET':
        return JsonResponse({'profile': serialize(record)})
    form = ProfileForm(request.POST, request.FILES, instance=record)
    if not form.is_valid():
        return JsonResponse({'error': 'Please check the highlighted fields.', 'fields': form.errors.get_json_data()}, status=400)
    with transaction.atomic():
        record = form.save(commit=False)
        if form.cleaned_data.get('remove_photo'):
            record.photo = b''
        if form.cleaned_data.get('photo_upload') is not None:
            record.photo = form.cleaned_data['photo_upload']
        if form.cleaned_data.get('remove_cover'):
            record.cover = b''
        if form.cleaned_data.get('cover_upload') is not None:
            record.cover = form.cleaned_data['cover_upload']
        record.save()
        request.user.first_name = record.full_name
        request.user.save(update_fields=['first_name'])
    return JsonResponse({'profile': serialize(record), 'message': 'Your profile has been saved.'})


@never_cache
@require_GET
def photo(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Please log in.'}, status=401)
    record = StudentProfile.objects.filter(user=request.user).first()
    if not record or not record.photo:
        return HttpResponse(status=404)
    response = HttpResponse(bytes(record.photo), content_type='image/jpeg')
    response['X-Content-Type-Options'] = 'nosniff'
    return response


@never_cache
@require_GET
def cover(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Please log in.'}, status=401)
    record = StudentProfile.objects.filter(user=request.user).first()
    if not record or not record.cover:
        return HttpResponse(status=404)
    response = HttpResponse(bytes(record.cover), content_type='image/jpeg')
    response['X-Content-Type-Options'] = 'nosniff'
    return response
