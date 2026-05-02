"""Ensure SUPERADMIN role and superadmin@gmail.com user (dev / bootstrap)."""

from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from django.utils import timezone

from tooli_uk_app.models import Role, User

EMAIL = "superadmin@gmail.com"
PASSWORD = "superadmin"


class Command(BaseCommand):
    help = f'Create or update {EMAIL} with role SUPERADMIN (password: {PASSWORD}).'

    def handle(self, *args, **options):
        now = timezone.now()
        role, _ = Role.objects.get_or_create(
            role_key="SUPERADMIN",
            defaults={"role_display_name": "Super admin"},
        )

        user = User.objects.filter(email__iexact=EMAIL).first()
        if user:
            user.first_name = user.first_name or "Super"
            user.last_name = user.last_name or "Admin"
            user.password = make_password(PASSWORD)
            user.role_id_id = role.role_id
            user.is_active = True
            user.updated_datetime = now
            user.save(
                update_fields=[
                    "first_name",
                    "last_name",
                    "password",
                    "role_id_id",
                    "is_active",
                    "updated_datetime",
                ]
            )
            self.stdout.write(self.style.SUCCESS(f"Updated {EMAIL} (password reset to configured value)."))
            return

        user = User.objects.create(
            first_name="Super",
            last_name="Admin",
            email=EMAIL,
            password=make_password(PASSWORD),
            role_id_id=role.role_id,
            is_active=True,
            created_datetime=now,
            updated_datetime=now,
        )
        user.created_by_id = user.user_id
        user.updated_by_id = user.user_id
        user.save(update_fields=["created_by_id", "updated_by_id"])
        self.stdout.write(self.style.SUCCESS(f"Created {EMAIL} with SUPERADMIN role."))
