from django.contrib import admin
from .models import College, Discussion, VisitorState, Answer, MentorQuestion
@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('name','location','annual_fee')
    search_fields = ('name','location')
@admin.register(Discussion)
class DiscussionAdmin(admin.ModelAdmin):
    list_display = ('title','created_at')
    search_fields = ('title','body')
admin.site.register([VisitorState, Answer, MentorQuestion])
