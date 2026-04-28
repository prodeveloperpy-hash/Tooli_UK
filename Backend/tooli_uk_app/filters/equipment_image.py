import django_filters

from tooli_uk_app.models.equipment_image import EquipmentImage


class EquipmentImageFilter(django_filters.FilterSet):
    class Meta:
        model = EquipmentImage
        fields = "__all__"
