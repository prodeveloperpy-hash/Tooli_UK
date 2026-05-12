import django_filters

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.user_organization import UserOrganization


class UserOrganizationFilter(BasePartialFilterSet):
    # Common lookup helpers for admin listing screens.
    user_email = django_filters.CharFilter(
        field_name="user_id__email",
        lookup_expr="icontains",
    )
    organization_name = django_filters.CharFilter(
        field_name="organization_id__name",
        lookup_expr="icontains",
    )
    role_key = django_filters.CharFilter(
        field_name="role_id__role_key",
        lookup_expr="iexact",
    )
    is_active = django_filters.BooleanFilter(field_name="is_active")
    is_approved = django_filters.BooleanFilter(field_name="is_approved")

    class Meta:
        model = UserOrganization
        fields = (
            "user_organization_id",
            "user_id",
            "organization_id",
            "role_id",
            "created_by",
            "updated_by",
            "approved_by",
            "is_active",
            "is_approved",
            "user_email",
            "organization_name",
            "role_key",
        )
