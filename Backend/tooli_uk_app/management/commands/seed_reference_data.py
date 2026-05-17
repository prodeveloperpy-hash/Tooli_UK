"""Seed core reference data for equipment categories and locations."""

from django.core.management.base import BaseCommand
from django.utils import timezone

from tooli_uk_app.models import Category, Location


CATEGORY_DISPLAY_NAMES = (
    "Mini Excavator (1-3T)",
    "Midi Excavator (3-8T)",
    "Large Excavator (8T+)",
    "Site Dumper",
    "Telehandler",
    "Roller (Compactor)",
    "Plate Compactor (Wacker Plate)",
    "Skid Steer Loader",
    "Backhoe Loader",
    "Concrete Mixer",
    "Scissor Lift",
    "Boom Lift (Cherry Picker)",
    "Generator",
    "Tower Light",
    "Tracked Loader / Bulldozer",
)

LOCATION_CITIES = (
    "London",
    "Birmingham",
    "Manchester",
    "Leeds",
    "Bristol",
    "Liverpool",
    "Nottingham",
    "Sheffield",
    "Reading",
    "Cambridge",
)


def _to_category_key(display_name: str) -> str:
    key = display_name.lower()
    replacements = (
        ("&", " and "),
        ("/", " "),
        ("+", " plus "),
        ("(", " "),
        (")", " "),
        (",", " "),
        ("-", " "),
    )
    for old, new in replacements:
        key = key.replace(old, new)
    return "_".join(part for part in key.split() if part).upper()


class Command(BaseCommand):
    help = "Seed equipment category and location reference records."

    def handle(self, *args, **options):
        now = timezone.now()
        created_categories = 0
        updated_categories = 0
        created_locations = 0

        for display_name in CATEGORY_DISPLAY_NAMES:
            normalized_key = _to_category_key(display_name)
            legacy_key = normalized_key.lower()
            category = Category.objects.filter(category_key=normalized_key).first()

            if category:
                needs_update = False
                if category.category_display_name != display_name:
                    category.category_display_name = display_name
                    needs_update = True
                if category.is_active is not True:
                    category.is_active = True
                    needs_update = True
                if needs_update:
                    category.save(update_fields=["category_display_name", "is_active"])
                    updated_categories += 1
                continue

            legacy_category = Category.objects.filter(category_key=legacy_key).first()
            if legacy_category:
                legacy_category.category_key = normalized_key
                legacy_category.category_display_name = display_name
                legacy_category.is_active = True
                legacy_category.save(
                    update_fields=["category_key", "category_display_name", "is_active"]
                )
                updated_categories += 1
                continue

            _, created = Category.objects.get_or_create(
                category_key=normalized_key,
                defaults={
                    "category_display_name": display_name,
                    "is_active": True,
                    "created_at": now,
                },
            )
            if created:
                created_categories += 1

        for city in LOCATION_CITIES:
            _, created = Location.objects.get_or_create(
                city_name=city,
                country="United Kingdom",
                defaults={
                    "state": None,
                    "is_active": True,
                    "created_datetime": now,
                },
            )
            if created:
                created_locations += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Reference data seeded. Categories created: {created_categories}, "
                f"Categories updated: {updated_categories}, "
                f"Locations created: {created_locations}."
            )
        )
