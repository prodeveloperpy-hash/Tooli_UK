from rest_framework import viewsets

from tooli_uk_app.filters.location import LocationFilter
from tooli_uk_app.models import Location
from tooli_uk_app.serializers.location import LocationSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    filterset_class = LocationFilter
    lookup_field = "location_id"
