from rest_framework import viewsets

from tooli_uk_app.filters.equipment_price import EquipmentPriceFilter
from tooli_uk_app.models import EquipmentPrice
from tooli_uk_app.serializers.equipment_price import EquipmentPriceSerializer


class EquipmentPriceViewSet(viewsets.ModelViewSet):
    queryset = EquipmentPrice.objects.select_related("interval_id").all()
    serializer_class = EquipmentPriceSerializer
    filterset_class = EquipmentPriceFilter
    lookup_field = "equipment_price_id"
