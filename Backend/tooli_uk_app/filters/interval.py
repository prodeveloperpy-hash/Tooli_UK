import django_filters

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.interval import Interval


class IntervalFilter(BasePartialFilterSet):
    class Meta:
        model = Interval
        fields = "__all__"
