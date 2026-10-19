from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from portal.models import AuthChallenge, AuthRate

class Command(BaseCommand):
    help = 'Delete expired/consumed authentication challenges and old rate-limit records.'

    def handle(self, *args, **options):
        challenges, _ = AuthChallenge.objects.filter(expires_at__lt=timezone.now()).delete()
        consumed, _ = AuthChallenge.objects.filter(consumed=True).delete()
        rates, _ = AuthRate.objects.filter(started_at__lt=timezone.now()-timedelta(days=1)).delete()
        self.stdout.write(f'Removed {challenges + consumed} challenges and {rates} old rate records.')
