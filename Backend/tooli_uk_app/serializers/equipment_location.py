from rest_framework import serializers

from tooli_uk_app.models import EquipmentLocation


class EquipmentLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentLocation
        fields = "__all__"
        read_only_fields = ("equipment_location_id", "created_datetime")
