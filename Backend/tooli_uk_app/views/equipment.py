from rest_framework import viewsets

from tooli_uk_app.models import Equipment
from tooli_uk_app.serializers.equipment import EquipmentSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
