import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create the initial superuser from ADMIN_USERNAME / ADMIN_PASSWORD (/ ADMIN_EMAIL) if it does not exist."

    def handle(self, *args, **opts):
        username = os.environ.get("ADMIN_USERNAME")
        password = os.environ.get("ADMIN_PASSWORD")
        email = os.environ.get("ADMIN_EMAIL", "")
        if not username or not password:
            self.stdout.write("ADMIN_USERNAME/ADMIN_PASSWORD not set — skipping superuser creation.")
            return
        User = get_user_model()
        if User.objects.filter(username=username).exists():
            self.stdout.write(f"Superuser '{username}' already exists.")
            return
        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f"Created superuser '{username}'."))
