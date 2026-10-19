import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import transaction
from portal.models import College


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
            save(id=college['id'], defaults={
                'name': college['name'], 'location': college['location'],
                'annual_fee': college['annualFeeNumber'], 'data': details,
            })
        self.stdout.write(self.style.SUCCESS('Sample colleges loaded.'))
