"""Ensure the hardcoded superadmin has a matching DB user row (for FKs)."""

from django.core.management.base import BaseCommand

from tooli_uk_app.services.superadmin import (
    HARDCODED_SUPERADMIN_EMAIL,
    get_or_create_hardcoded_superadmin_user,
)


class Command(BaseCommand):
    help = (
        f"Create or sync the DB user for hardcoded SUPERADMIN login ({HARDCODED_SUPERADMIN_EMAIL})."
    )

    def handle(self, *args, **options):
        user = get_or_create_hardcoded_superadmin_user()
        self.stdout.write(
            self.style.SUCCESS(
                f"Superadmin user ready: user_id={user.user_id} email={user.email}"
            )
        )
