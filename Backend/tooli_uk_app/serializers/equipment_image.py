from rest_framework import serializers

from tooli_uk_app.models import EquipmentImage


class EquipmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentImage
        fields = "__all__"
       