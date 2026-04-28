from rest_framework import serializers

from tooli_uk_app.models import Equipment
from tooli_uk_app.serializers.equipment_availablility import EquipmentAvailabilitySerializer
from tooli_uk_app.serializers.equipment_image import EquipmentImageSerializer
from tooli_uk_app.serializers.equipment_location import EquipmentLocationSerializer
from tooli_uk_app.serializers.equipment_price import EquipmentPriceSerializer


class EquipmentSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(
        source="organization_id.name",
        read_only=True,
    )
    locations = EquipmentLocationSerializer(many=True, read_only=True)
    prices = EquipmentPriceSerializer(many=True, read_only=True)
    images = EquipmentImageSerializer(many=True, read_only=True)
    availabilities = EquipmentAvailabilitySerializer(many=True, read_only=True)

    class Meta:
        model = Equipment
        fields = "__all__"
    
