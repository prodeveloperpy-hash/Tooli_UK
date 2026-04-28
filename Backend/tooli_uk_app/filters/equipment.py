import django_filters

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

    # Related exact/date filters
    location_id = django_filters.NumberFilter(field_name="locations__location_id")
    interval_id = django_filters.NumberFilter(field_name="prices__interval_id")
    availability_from_gte = django_filters.IsoDateTimeFilter(
        field_name="availabilities__availability_from",
        lookup_expr="gte",
    )
    availability_to_lte = django_filters.IsoDateTimeFilter(
        field_name="availabilities__availability_to",
        lookup_expr="lte",
    )

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
            "location_id",
            "interval_id",
            "availability_from_gte",
            "availability_to_lte",
        )
