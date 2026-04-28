from rest_framework import serializers

from tooli_uk_app.models import Equipment


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = "__all__"
        read_only_fields = ("equipment_id", "created_datetime", "updated_datetime")
