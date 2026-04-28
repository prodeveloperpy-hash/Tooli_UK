import django_filters

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.location import Location


class LocationFilter(BasePartialFilterSet):
    class Meta:
        model = Location
        fields = "__all__"
