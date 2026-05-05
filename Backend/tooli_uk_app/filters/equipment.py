from datetime import datetime, time

import django_filters
from django.utils import timezone

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.equipment import Equipment


class EquipmentFilter(BasePartialFilterSet):
    # Name (equipment title)
    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")
    name_starts_with = django_filters.CharFilter(
        field_name="name",
        lookup_expr="istartswith",
    )
    name_exact = django_filters.CharFilter(field_name="name", lookup_expr="iexact")
    description = django_filters.CharFilter(
        field_name="description",
        lookup_expr="icontains",
    )

    # Related partial filters
    organization_name = django_filters.CharFilter(
        field_name="organization_id__name",
        lookup_expr="icontains",
    )
    # Category: display label or stable key
    category_name = django_filters.CharFilter(
        field_name="category_id__category_display_name",
        lookup_expr="icontains",
    )
    category_key = django_filters.CharFilter(
        field_name="category_id__category_key",
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
    location_state = django_filters.CharFilter(
        field_name="locations__location_id__state",
        lookup_expr="icontains",
    )

    # Equipment row timestamps (when the listing was created / last updated)
    created_datetime_after = django_filters.IsoDateTimeFilter(
        field_name="created_datetime",
        lookup_expr="gte",
    )
    created_datetime_before = django_filters.IsoDateTimeFilter(
        field_name="created_datetime",
        lookup_expr="lte",
    )
    updated_datetime_after = django_filters.IsoDateTimeFilter(
        field_name="updated_datetime",
        lookup_expr="gte",
    )
    updated_datetime_before = django_filters.IsoDateTimeFilter(
        field_name="updated_datetime",
        lookup_expr="lte",
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

    def filter_queryset(self, queryset):
        qs = super().filter_queryset(queryset)
        data = getattr(self, "data", None) or {}
        start = data.get("availability_overlap_start")
        end = data.get("availability_overlap_end")
        if start and end:
            qs = qs.filter(
                availabilities__availability_from__lt=end,
                availabilities__availability_to__gt=start,
            ).distinct()
        return qs

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
            "name_starts_with",
            "name_exact",
            "description",
            "is_active",
            "category_id",
            "organization_id",
            "created_by",
            "updated_by",
            "organization_name",
            "category_name",
            "category_key",
            "image_url",
            "currency",
            "location_name",
            "location_country",
            "location_state",
            "location_id",
            "interval_id",
            "created_datetime_after",
            "created_datetime_before",
            "updated_datetime_after",
            "updated_datetime_before",
            "availability_from_gte",
            "availability_from_lte",
            "availability_to_lte",
            "availability_to_gte",
            "available_on",
        )
