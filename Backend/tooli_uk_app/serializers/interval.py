from rest_framework import serializers

from tooli_uk_app.models import Interval


class IntervalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interval
        fields = ("interval_id", "interval_key", "interval_display_name")
        read_only_fields = ("interval_id",)
