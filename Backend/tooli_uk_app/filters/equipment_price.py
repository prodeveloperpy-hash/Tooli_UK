import django_filters

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.equipment_price import EquipmentPrice


class EquipmentPriceFilter(BasePartialFilterSet):
    class Meta:
        model = EquipmentPrice
        fields = "__all__"
