import django_filters

from tooli_uk_app.models.equipment_availablility import EquipmentAvailability


class EquipmentAvailabilityFilter(django_filters.FilterSet):
    class Meta:
        model = EquipmentAvailability
        fields = "__all__"
