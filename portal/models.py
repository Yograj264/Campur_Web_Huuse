from django.db import models
class College(models.Model):
    id = models.SlugField(primary_key=True)
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    annual_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    data = models.JSONField(default=dict)
    def __str__(self): return self.name
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
