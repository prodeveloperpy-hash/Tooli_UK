import django_filters

from tooli_uk_app.models.equipment import Equipment


class EquipmentFilter(django_filters.FilterSet):
    class Meta:
        model = Equipment
        fields = "__all__"
