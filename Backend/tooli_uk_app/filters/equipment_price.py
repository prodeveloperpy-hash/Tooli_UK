import django_filters

from tooli_uk_app.models.equipment_price import EquipmentPrice


class EquipmentPriceFilter(django_filters.FilterSet):
    class Meta:
        model = EquipmentPrice
        fields = "__all__"
