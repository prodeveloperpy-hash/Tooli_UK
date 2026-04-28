from rest_framework import viewsets

from tooli_uk_app.filters.equipment_location import EquipmentLocationFilter
from tooli_uk_app.models import EquipmentLocation
from tooli_uk_app.serializers.equipment_location import EquipmentLocationSerializer


class EquipmentLocationViewSet(viewsets.ModelViewSet):
    queryset = EquipmentLocation.objects.all()
    serializer_class = EquipmentLocationSerializer
    filterset_class = EquipmentLocationFilter
     