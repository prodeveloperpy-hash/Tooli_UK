import django_filters

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.organization import Organization


class OrganizationFilter(BasePartialFilterSet):
    class Meta:
        model = Organization
        fields = "__all__"
