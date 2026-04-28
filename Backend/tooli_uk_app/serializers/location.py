from rest_framework import serializers

from tooli_uk_app.models import Location


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"
        read_only_fields = ("location_id", "created_datetime")
