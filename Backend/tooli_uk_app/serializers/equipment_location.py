from rest_framework import serializers

from tooli_uk_app.models import EquipmentLocation


class EquipmentLocationSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(
        source="location_id.city_name",
        read_only=True,
    )
    country = serializers.CharField(
        source="location_id.country",
        read_only=True,
    )
    state = serializers.CharField(
        source="location_id.state",
        read_only=True,
    )

    class Meta:
        model = EquipmentLocation
        fields = "__all__"
        read_only_fields = ("equipment_location_id", "created_datetime")
