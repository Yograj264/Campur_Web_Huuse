"""Read-only college catalogue used by the landing page and college directory."""
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET
from .models import College


@require_GET
def index(request):
    return render(request, 'index.html')


@require_GET
def bootstrap(request):
    colleges = []
    for college in College.objects.order_by('name'):
        data = {key: value for key, value in college.data.items() if key != 'isSaved'}
        data.update({
            'id': college.pk,
            'name': college.name,
            'location': college.location,
            'annualFeeNumber': float(college.annual_fee),
            'annualFee': f'INR {college.annual_fee:.2f} L/yr',
        })
        colleges.append(data)
    return JsonResponse({'colleges': colleges})
