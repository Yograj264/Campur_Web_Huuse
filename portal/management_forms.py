"""Validated management forms. User roles and privileges are never client-editable."""
from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import College, Course, CareerRoadmap, StudyPlan
from .profile_forms import ProfileForm

User = get_user_model()

class CollegeForm(forms.ModelForm):
    category = forms.CharField(max_length=100, required=False)
    subLocation = forms.CharField(max_length=200, required=False)
    image = forms.URLField(max_length=1000, required=False)
    description = forms.CharField(max_length=5000, required=False)
    naacGrade = forms.CharField(max_length=100, required=False)
    entranceExam = forms.CharField(max_length=150, required=False)

    class Meta:
        model = College
        fields = ['name', 'location', 'annual_fee']

    def clean_annual_fee(self):
        fee = self.cleaned_data['annual_fee']
        if fee < 0:
            raise forms.ValidationError('Fee cannot be negative.')
        return fee

    def clean_image(self):
        value = self.cleaned_data.get('image', '')
        if value and not value.startswith('https://'):
            raise forms.ValidationError('Use an HTTPS image URL.')
        return value

    def save(self, commit=True):
        row = super().save(commit=False)
        row.data = {**(row.data or {}), **{key: self.cleaned_data.get(key, '') for key in ['category', 'subLocation', 'image', 'description', 'naacGrade', 'entranceExam']}}
        if commit:
            row.save()
        return row

class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ['college', 'name', 'description', 'duration', 'annual_fee', 'eligibility', 'published']

    def clean_annual_fee(self):
        value = self.cleaned_data.get('annual_fee')
        if value is not None and value < 0:
            raise forms.ValidationError('Fee cannot be negative.')
        return value

class StudyPlanForm(forms.ModelForm):
    class Meta:
        model = StudyPlan
        fields = ['name', 'roadmap', 'duration', 'description', 'steps', 'published']

class RoadmapForm(forms.ModelForm):
    class Meta:
        model = CareerRoadmap
        fields = ['title', 'summary', 'icon', 'theme', 'stages', 'details', 'published']

    def clean_icon(self):
        value = self.cleaned_data['icon']
        if value not in ['code', 'data', 'shield', 'bulb', 'palette', 'briefcase', 'cap', 'building', 'chart', 'target']:
            raise forms.ValidationError('Choose one of the available icons.')
        return value

    def clean_theme(self):
        value = self.cleaned_data['theme']
        if value not in ['blue', 'green', 'orange', 'purple', 'pink']:
            raise forms.ValidationError('Choose one of the available colours.')
        return value

    def clean_stages(self):
        stages = self.cleaned_data.get('stages')
        if not isinstance(stages, list) or not 1 <= len(stages) <= 30 or any(not isinstance(v, str) or not 1 <= len(v.strip()) <= 500 for v in stages):
            raise forms.ValidationError('Provide 1–30 nonempty learning stages, up to 500 characters each.')
        return [v.strip() for v in stages]

    def clean_details(self):
        data = self.cleaned_data.get('details')
        if not isinstance(data, dict):
            raise forms.ValidationError('Details must be an object.')
        result = {}
        for key in ['role', 'tagline', 'about', 'bestFor']:
            value = data.get(key, '')
            if not isinstance(value, str) or len(value) > 3000:
                raise forms.ValidationError(f'{key} must be text, up to 3000 characters.')
            result[key] = value.strip()
        result['role'] = result['role'] or self.cleaned_data.get('title', 'Career')
        for key in ['skills', 'tools', 'projects', 'focus', 'core']:
            value = data.get(key, [])
            if not isinstance(value, list) or len(value) > 50 or any(not isinstance(v, str) or len(v) > 500 for v in value):
                raise forms.ValidationError(f'{key} must be a list of up to 50 short text items.')
            result[key] = [v.strip() for v in value if v.strip()]
        for key, required in [('degrees', ['id', 'title', 'description', 'kind']), ('resources', ['name', 'description', 'type', 'url'])]:
            values = data.get(key, [])
            if not isinstance(values, list) or len(values) > 40:
                raise forms.ValidationError(f'{key} must be a list of up to 40 objects.')
            cleaned = []
            for item in values:
                if not isinstance(item, dict) or any(not isinstance(item.get(k), str) or len(item[k]) > 1000 for k in required):
                    raise forms.ValidationError(f'Each {key} entry needs text fields: {", ".join(required)}.')
                record = {k: item[k].strip() for k in required}
                if key == 'resources':
                    forms.URLField().clean(record['url'])
                    if not record['url'].startswith('https://'):
                        raise forms.ValidationError('Resource URLs must use HTTPS.')
                    if record['type'] not in ['Documentation', 'Practice', 'Guide']:
                        raise forms.ValidationError('Resource type must be Documentation, Practice or Guide.')
                elif not record['id'] or not record['title'] or record['id'] in [v['id'] for v in cleaned]:
                    raise forms.ValidationError('Degree IDs must be unique and titles cannot be empty.')
                cleaned.append(record)
            result[key] = cleaned
        return result

class StudentForm(forms.Form):
    full_name = forms.CharField(max_length=150)
    email = forms.EmailField()
    password = forms.CharField(required=False, max_length=128)
    is_active = forms.BooleanField(required=False)
    education = forms.ChoiceField(required=False, choices=[('', 'Not added'), ('school', 'School student'), ('college', 'College student'), ('graduate', 'Graduate')])
    institution = forms.CharField(max_length=200, required=False)
    course = forms.CharField(max_length=150, required=False)
    city = forms.CharField(max_length=100, required=False)
    career_goal = forms.CharField(max_length=200, required=False)

    def __init__(self, *args, account=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.account = account

    def clean_email(self):
        email = self.cleaned_data['email'].strip().lower()
        if User.objects.filter(email__iexact=email).exclude(pk=self.account.pk if self.account else None).exists():
            raise forms.ValidationError('An account with this email already exists.')
        return email

    def clean_career_goal(self):
        return ProfileForm.normalize_choices(self.cleaned_data.get('career_goal', ''), 3)

    def clean(self):
        data = super().clean()
        password = data.get('password')
        if not self.account and not password:
            self.add_error('password', 'Set an initial password for the new student.')
        if password:
            account = User(email=data.get('email', ''), first_name=data.get('full_name', ''))
            try:
                validate_password(password, account)
            except ValidationError as error:
                self.add_error('password', error)
        return data
