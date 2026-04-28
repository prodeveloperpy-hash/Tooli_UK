import django_filters

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.equipment_location import EquipmentLocation


class EquipmentLocationFilter(BasePartialFilterSet):
    class Meta:
        model = EquipmentLocation
        fields = "__all__"
