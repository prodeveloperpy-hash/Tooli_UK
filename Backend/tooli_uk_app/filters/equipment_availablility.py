import django_filters

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.equipment_availablility import EquipmentAvailability


class EquipmentAvailabilityFilter(BasePartialFilterSet):
    class Meta:
        model = EquipmentAvailability
        fields = "__all__"
