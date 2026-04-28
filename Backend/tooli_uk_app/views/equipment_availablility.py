from rest_framework import viewsets

from tooli_uk_app.filters.equipment_availablility import EquipmentAvailabilityFilter
from tooli_uk_app.models import EquipmentAvailability
from tooli_uk_app.serializers.equipment_availablility import EquipmentAvailabilitySerializer


class EquipmentAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = EquipmentAvailability.objects.all()
    serializer_class = EquipmentAvailabilitySerializer
    filterset_class = EquipmentAvailabilityFilter
    lookup_field = "equipment_availability_id"