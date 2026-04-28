from rest_framework import viewsets

from tooli_uk_app.models import EquipmentPrice
from tooli_uk_app.serializers.equipment_price import EquipmentPriceSerializer


class EquipmentPriceViewSet(viewsets.ModelViewSet):
    queryset = EquipmentPrice.objects.all()
    serializer_class = EquipmentPriceSerializer
    lookup_field = "equipment_price_id"
