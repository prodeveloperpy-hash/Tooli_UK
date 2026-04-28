from rest_framework import viewsets

from tooli_uk_app.models import EquipmentImage
from tooli_uk_app.serializers.equipment_image import EquipmentImageSerializer


class EquipmentImageViewSet(viewsets.ModelViewSet):
    queryset = EquipmentImage.objects.all()
    serializer_class = EquipmentImageSerializer
     