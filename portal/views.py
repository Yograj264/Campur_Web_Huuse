"""Read-only college catalogue used by the landing page and college directory."""
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET
from .models import College, CareerRoadmap


@require_GET
def index(request, section=None):
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
        if college.data.get('coursesManaged') or college.managed_courses.exists():
            courses = list(college.managed_courses.filter(published=True))
            data['programs'] = ', '.join(course.name for course in courses)
            data['courses'] = [{'name': course.name, 'description': course.description,
                'duration': course.duration, 'eligibility': course.eligibility,
                'annualFee': f'INR {course.annual_fee:.2f} L/yr' if course.annual_fee is not None else next((str(item.get('annualFee') or item.get('fee') or '') for item in college.data.get('courses', []) if isinstance(item, dict) and item.get('name') == course.name), '')} for course in courses]
        colleges.append(data)
    return JsonResponse({'colleges': colleges})


@require_GET
def roadmaps(request):
    records = []
    order = {key: index for index, key in enumerate(['software-development', 'data-science', 'cyber-security', 'product-management', 'ui-ux-design'])}
    rows = sorted(CareerRoadmap.objects.filter(published=True), key=lambda row: (order.get(row.pk, 5), row.title.casefold()))
    for row in rows:
        plans = [{'id': plan.pk, 'name': plan.name, 'duration': plan.duration,
                  'description': plan.description, 'steps': plan.steps.splitlines()}
                 for plan in row.plans.filter(published=True)]
        records.append({'id': row.pk, 'title': row.title, 'summary': row.summary,
                        'icon': row.icon, 'theme': row.theme, 'stages': row.stages,
                        'details': {**row.details, 'plans': plans}})
    return JsonResponse({'roadmaps': records})
