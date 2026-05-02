from datetime import datetime, time

import django_filters
from django.utils import timezone

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.equipment import Equipment


class EquipmentFilter(BasePartialFilterSet):
    # Equipment partial filters
    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")
    description = django_filters.CharFilter(
        field_name="description",
        lookup_expr="icontains",
    )

    # Related partial filters
    organization_name = django_filters.CharFilter(
        field_name="organization_id__name",
        lookup_expr="icontains",
    )
    category_name = django_filters.CharFilter(
        field_name="category_id__category_display_name",
        lookup_expr="icontains",
    )
    image_url = django_filters.CharFilter(
        field_name="images__image_url",
        lookup_expr="icontains",
    )
    currency = django_filters.CharFilter(
        field_name="prices__currency",
        lookup_expr="icontains",
    )
    # Location "name" in the schema is stored as ``Location.city_name``.
    location_name = django_filters.CharFilter(
        field_name="locations__location_id__city_name",
        lookup_expr="icontains",
    )
    location_country = django_filters.CharFilter(
        field_name="locations__location_id__country",
        lookup_expr="icontains",
    )

    # Related exact/date filters
    location_id = django_filters.NumberFilter(field_name="locations__location_id")
    interval_id = django_filters.NumberFilter(field_name="prices__interval_id")
    availability_from_gte = django_filters.IsoDateTimeFilter(
        field_name="availabilities__availability_from",
        lookup_expr="gte",
    )
    availability_from_lte = django_filters.IsoDateTimeFilter(
        field_name="availabilities__availability_from",
        lookup_expr="lte",
    )
    availability_to_lte = django_filters.IsoDateTimeFilter(
        field_name="availabilities__availability_to",
        lookup_expr="lte",
    )
    availability_to_gte = django_filters.IsoDateTimeFilter(
        field_name="availabilities__availability_to",
        lookup_expr="gte",
    )
    available_on = django_filters.DateFilter(method="filter_available_on")

    def filter_available_on(self, queryset, name, value):
        """Equipment with at least one availability window covering this local calendar day."""
        if not value:
            return queryset
        tz = timezone.get_current_timezone()
        start = timezone.make_aware(datetime.combine(value, time.min), tz)
        end = timezone.make_aware(datetime.combine(value, time.max), tz)
        return queryset.filter(
            availabilities__availability_from__lte=end,
            availabilities__availability_to__gte=start,
        ).distinct()

    class Meta:
        model = Equipment
        fields = (
            "equipment_id",
            "name",
            "description",
            "is_active",
            "category_id",
            "organization_id",
            "created_by",
            "updated_by",
            "organization_name",
            "category_name",
            "image_url",
            "currency",
            "location_name",
            "location_country",
            "location_id",
            "interval_id",
            "availability_from_gte",
            "availability_from_lte",
            "availability_to_lte",
            "availability_to_gte",
            "available_on",
        )
