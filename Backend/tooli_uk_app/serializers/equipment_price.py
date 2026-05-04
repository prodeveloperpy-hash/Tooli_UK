from rest_framework import serializers

from tooli_uk_app.models import EquipmentPrice


class IntervalBriefSerializer(serializers.Serializer):
    """How the price is billed (e.g. per day, per week)."""

    interval_id = serializers.IntegerField(read_only=True)
    interval_key = serializers.CharField(read_only=True, allow_null=True)
    interval_display_name = serializers.CharField(read_only=True, allow_null=True)


class EquipmentPriceSerializer(serializers.ModelSerializer):
    """Includes linked interval so clients can show e.g. \"£18.50 / day\" vs \"/ week\"."""

    interval = IntervalBriefSerializer(source="interval_id", read_only=True)
    price_period = serializers.SerializerMethodField()

    class Meta:
        model = EquipmentPrice
        fields = (
            "equipment_price_id",
            "equipment_id",
            "location_id",
            "is_active",
            "price",
            "interval_id",
            "currency",
            "created_datetime",
            "interval",
            "price_period",
        )
        read_only_fields = ("equipment_price_id", "created_datetime")

    def get_price_period(self, obj):
        """Human label for the billing cadence (display name, else key)."""
        rel = getattr(obj, "interval_id", None)
        if rel is None:
            return None
        label = (rel.interval_display_name or "").strip()
        if label:
            return label
        key = (rel.interval_key or "").strip()
        return key or None
