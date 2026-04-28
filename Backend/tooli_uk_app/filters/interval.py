import django_filters

from tooli_uk_app.models.interval import Interval


class IntervalFilter(django_filters.FilterSet):
    class Meta:
        model = Interval
        fields = "__all__"
