"""No-op command: superadmin is hardcoded and not stored in DB."""

from django.core.management.base import BaseCommand

from tooli_uk_app.services.superadmin import (
    HARDCODED_SUPERADMIN_EMAIL,
)


class Command(BaseCommand):
    help = (
        f"Hardcoded SUPERADMIN login is enabled for {HARDCODED_SUPERADMIN_EMAIL}. "
        "No database user is created."
    )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS(
                "No action taken. Superadmin credentials are hardcoded in backend login."
            )
        )
