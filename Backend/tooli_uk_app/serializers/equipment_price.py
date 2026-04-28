from rest_framework import serializers

from tooli_uk_app.models import EquipmentPrice


class EquipmentPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentPrice
        fields = "__all__"
        read_only_fields = ("equipment_price_id", "created_datetime")
