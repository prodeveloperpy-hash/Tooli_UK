import django_filters

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.equipment_image import EquipmentImage


class EquipmentImageFilter(BasePartialFilterSet):
    class Meta:
        model = EquipmentImage
        fields = "__all__"
