import django_filters

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.user_organization import UserOrganization

is_active = django_filters.BooleanFilter(method='filter_is_active')
is_approved = django_filters.BooleanFilter(method='filter_is_approved')
class UserOrganizationFilter(BasePartialFilterSet):
    is_active = django_filters.BooleanFilter(method='filter_is_active')
    is_approved = django_filters.BooleanFilter(method='filter_is_approved')
    class Meta:
        model = UserOrganization
        fields = "__all__"
