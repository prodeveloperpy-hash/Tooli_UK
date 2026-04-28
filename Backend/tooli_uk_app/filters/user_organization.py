import django_filters

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.user_organization import UserOrganization


class UserOrganizationFilter(BasePartialFilterSet):
    class Meta:
        model = UserOrganization
        fields = "__all__"
