import uuid
from django.db import models
class College(models.Model):
    id = models.SlugField(primary_key=True)
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    annual_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    data = models.JSONField(default=dict)
    def __str__(self): return self.name
# Existing tables and records are preserved. Discussion now backs public community questions;
# MentorQuestion also stores account-linked private guidance notes. VisitorState and Answer
# remain for compatibility; no tables are dropped by the redesign.
class Discussion(models.Model):
    id = models.SlugField(primary_key=True)
    title = models.CharField(max_length=300)
    body = models.TextField()
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.title
class VisitorState(models.Model):
    session_key = models.CharField(max_length=40, unique=True)
    data = models.JSONField(default=dict)
class Answer(models.Model):
    id = models.SlugField(primary_key=True)
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE, related_name='answers')
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
class MentorQuestion(models.Model):
    session_key = models.CharField(max_length=40)
    mentor = models.CharField(max_length=200, blank=True)
    question = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class AuthChallenge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.CharField(max_length=64)
    purpose = models.CharField(max_length=20)
    destination = models.CharField(max_length=254)
    code_hash = models.CharField(max_length=256, blank=True)
    payload = models.JSONField(default=dict)
    attempts = models.PositiveIntegerField(default=0)
    consumed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

class PhoneIdentity(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    phone = models.CharField(max_length=16, unique=True)

class AuthRate(models.Model):
    key = models.CharField(max_length=64, unique=True)
    count = models.PositiveIntegerField(default=0)
    started_at = models.DateTimeField()

class StudentProfile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='student_profile')
    full_name = models.CharField(max_length=150, blank=True)
    education = models.CharField(max_length=20, blank=True, choices=[('school', 'School student'), ('college', 'College student'), ('graduate', 'Graduate')])
    institution = models.CharField(max_length=200, blank=True)
    course = models.CharField(max_length=150, blank=True)
    graduation_year = models.PositiveIntegerField(null=True, blank=True)
    city = models.CharField(max_length=100, blank=True)
    interests = models.CharField(max_length=250, blank=True)
    career_goal = models.CharField(max_length=200, blank=True)
    bio = models.TextField(max_length=1000, blank=True)
    headline = models.CharField(max_length=200, blank=True)
    skills = models.CharField(max_length=500, blank=True)
    preferred_fields = models.CharField(max_length=500, blank=True)
    goals = models.TextField(max_length=1500, blank=True)
    linkedin_url = models.URLField(max_length=300, blank=True)
    github_url = models.URLField(max_length=300, blank=True)
    qualification = models.CharField(max_length=150, blank=True)
    school_completion_year = models.PositiveIntegerField(null=True, blank=True)
    quote = models.CharField(max_length=250, blank=True)
    available_for_mentorship = models.BooleanField(default=False)
    cover = models.BinaryField(blank=True, default=bytes, editable=False)
    # Small, normalized avatars live with the account database, not an ephemeral media directory.
    photo = models.BinaryField(blank=True, default=bytes, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_complete(self):
        return all([self.full_name, self.education, self.institution, self.city, self.career_goal])

    def __str__(self):
        return self.full_name or f'Student {self.user_id}'

class CareerRoadmap(models.Model):
    id = models.SlugField(primary_key=True, max_length=80)
    title = models.CharField(max_length=150)
    summary = models.TextField(max_length=1000)
    icon = models.CharField(max_length=30, default='code')
    theme = models.CharField(max_length=20, default='blue')
    stages = models.JSONField(default=list)
    details = models.JSONField(default=dict)
    published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Course(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='managed_courses')
    name = models.CharField(max_length=200)
    description = models.TextField(max_length=3000, blank=True)
    duration = models.CharField(max_length=100, blank=True)
    annual_fee = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    eligibility = models.CharField(max_length=500, blank=True)
    published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class StudyPlan(models.Model):
    name = models.CharField(max_length=200)
    roadmap = models.ForeignKey(CareerRoadmap, null=True, blank=True, on_delete=models.SET_NULL, related_name='plans')
    duration = models.CharField(max_length=100, blank=True)
    description = models.TextField(max_length=2000, blank=True)
    steps = models.TextField(max_length=5000, blank=True)
    published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
