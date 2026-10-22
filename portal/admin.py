from django.contrib import admin
from .models import College


@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'annual_fee')
    search_fields = ('name', 'location')

from .models import StudentProfile
from .models import Course, CareerRoadmap, StudyPlan

admin.site.register(Course)
admin.site.register(CareerRoadmap)
admin.site.register(StudyPlan)

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'education', 'institution', 'city')
    search_fields = ('full_name', 'user__email', 'institution')
