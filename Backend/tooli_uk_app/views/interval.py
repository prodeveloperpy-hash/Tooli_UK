from rest_framework import viewsets

from tooli_uk_app.models import Interval
from tooli_uk_app.serializers.interval import IntervalSerializer


class IntervalViewSet(viewsets.ModelViewSet):
    """REST CRUD via DefaultRouter (list/create/detail/update/delete)."""

    queryset = Interval.objects.all().order_by("interval_id")
    serializer_class = IntervalSerializer
    lookup_field = "interval_id"
