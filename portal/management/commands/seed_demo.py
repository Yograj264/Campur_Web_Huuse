import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import transaction
from portal.models import College, Course


class Command(BaseCommand):
    help = 'Import sample colleges without overwriting existing records.'

    def add_arguments(self, parser):
        parser.add_argument('--refresh', action='store_true', help='Replace matching sample college records.')

    @transaction.atomic
    def handle(self, *args, **options):
        data = json.loads((Path(__file__).resolve().parents[2] / 'demo_data.json').read_text(encoding='utf-8'))
        save = College.objects.update_or_create if options['refresh'] else College.objects.get_or_create
        for college in data['colleges']:
            details = {key: value for key, value in college.items() if key != 'isSaved'}
            record, _ = save(id=college['id'], defaults={
                'name': college['name'], 'location': college['location'],
                'annual_fee': college['annualFeeNumber'], 'data': details,
            })
            if not record.data.get('coursesManaged'):
                programs = str(record.data.get('programs', '')).split(',')
                if not record.managed_courses.exists():
                    for name in programs:
                        if name.strip():
                            Course.objects.get_or_create(college=record, name=name.strip()[:200])
                if record.managed_courses.exists():
                    record.data = {**record.data, 'coursesManaged': True}
                    record.save(update_fields=['data'])
        self.stdout.write(self.style.SUCCESS('Sample colleges loaded.'))
