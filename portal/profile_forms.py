from io import BytesIO
import warnings
from django import forms
from PIL import Image, UnidentifiedImageError
from .models import StudentProfile


class ProfileForm(forms.ModelForm):
    photo_upload = forms.FileField(required=False)
    remove_photo = forms.BooleanField(required=False)
    cover_upload = forms.FileField(required=False)
    remove_cover = forms.BooleanField(required=False)

    class Meta:
        model = StudentProfile
        fields = ['full_name', 'education', 'institution', 'course', 'graduation_year', 'city', 'interests', 'career_goal', 'bio', 'headline', 'skills', 'preferred_fields', 'goals', 'linkedin_url', 'github_url', 'qualification', 'school_completion_year', 'quote', 'available_for_mentorship']

    def clean(self):
        data = super().clean()
        for field in ['full_name', 'education', 'institution', 'city', 'career_goal']:
            if not data.get(field):
                self.add_error(field, 'This field is required.')
        year = data.get('graduation_year')
        if year is not None and not 1950 <= year <= 2100:
            self.add_error('graduation_year', 'Enter a year between 1950 and 2100.')
        school_year = data.get('school_completion_year')
        if school_year is not None and not 1950 <= school_year <= 2100:
            self.add_error('school_completion_year', 'Enter a year between 1950 and 2100.')
        for field in ['linkedin_url', 'github_url']:
            if data.get(field) and not data[field].startswith('https://'):
                self.add_error(field, 'Use a secure https:// URL.')
        return data

    @staticmethod
    def normalize_choices(value, maximum=None):
        choices = list({item.strip().casefold(): item.strip() for item in value.split(',') if item.strip()}.values())
        if maximum and len(choices) > maximum:
            raise forms.ValidationError(f'Select no more than {maximum} options.')
        return ', '.join(choices)

    def clean_career_goal(self):
        return self.normalize_choices(self.cleaned_data.get('career_goal', ''), 3)

    def clean_preferred_fields(self):
        return self.normalize_choices(self.cleaned_data.get('preferred_fields', ''), 3)

    def clean_skills(self):
        return self.normalize_choices(self.cleaned_data.get('skills', ''))

    def clean_photo_upload(self):
        return self.normalize_image(self.cleaned_data.get('photo_upload'), (512, 512))

    def clean_cover_upload(self):
        return self.normalize_image(self.cleaned_data.get('cover_upload'), (1600, 400))

    @staticmethod
    def normalize_image(upload, size):
        if not upload:
            return None
        if upload.size > 2 * 1024 * 1024:
            raise forms.ValidationError('Choose an image smaller than 2 MB.')
        try:
            with warnings.catch_warnings():
                warnings.simplefilter('error', Image.DecompressionBombWarning)
                with Image.open(upload) as image:
                    if image.format not in ('JPEG', 'PNG', 'WEBP'):
                        raise forms.ValidationError('Use a JPEG, PNG or WebP image.')
                    if image.width * image.height > 10_000_000:
                        raise forms.ValidationError('Choose an image below 10 megapixels.')
                    image.load()
                    from PIL import ImageOps
                    image = ImageOps.exif_transpose(image)
                    image = ImageOps.fit(image.convert('RGB'), size)
                    output = BytesIO()
                    image.save(output, format='JPEG', quality=85)
                    return output.getvalue()
        except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError, Image.DecompressionBombWarning):
            raise forms.ValidationError('The image could not be read. Choose a valid JPEG, PNG or WebP file.')
