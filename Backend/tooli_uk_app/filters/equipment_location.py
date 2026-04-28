import django_filters

from tooli_uk_app.models.equipment_location import EquipmentLocation


class EquipmentLocationFilter(django_filters.FilterSet):
    class Meta:
        model = EquipmentLocation
        fields = "__all__"
