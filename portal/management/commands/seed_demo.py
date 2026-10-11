import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import transaction
from portal.models import College, Discussion, Answer
class Command(BaseCommand):
    help = 'Load original sample data without overwriting existing records.'
    def add_arguments(self, parser):
        parser.add_argument('--refresh', action='store_true', help='Replace only the original sample records with the bundled sample data.')
    @transaction.atomic
    def handle(self,*args,**options):
        data = json.loads((Path(__file__).resolve().parents[2] / 'demo_data.json').read_text(encoding='utf-8'))
        college_save = College.objects.update_or_create if options['refresh'] else College.objects.get_or_create
        discussion_save = Discussion.objects.update_or_create if options['refresh'] else Discussion.objects.get_or_create
        answer_save = Answer.objects.update_or_create if options['refresh'] else Answer.objects.get_or_create
        for c in data['INITIAL_COLLEGES']:
            college_save(id=c['id'],defaults={'name':c['name'],'location':c['location'],'annual_fee':c['annualFeeNumber'],'data':c})
        for d in data['INITIAL_DISCUSSIONS']:
            discussion_save(id=d['id'],defaults={'title':d['title'],'body':d.get('body',''),'data':d})
        for a in data['DISCUSSION_1_ANSWERS']:
            answer_save(id=a['id'],defaults={'discussion_id':'discussion-1','data':a})
        self.stdout.write(self.style.SUCCESS('Original demo content loaded.'))
