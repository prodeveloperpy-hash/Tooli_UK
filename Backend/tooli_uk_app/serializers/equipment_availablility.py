from rest_framework import serializers

from tooli_uk_app.models import EquipmentAvailability


class EquipmentAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentAvailability
        fields = "__all__"
     
