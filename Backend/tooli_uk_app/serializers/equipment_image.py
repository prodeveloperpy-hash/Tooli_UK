from django.urls import reverse
from rest_framework import serializers

from tooli_uk_app.models import EquipmentImage


def _is_public_http_url(value: str) -> bool:
    v = (value or "").strip().lower()
    return v.startswith("http://") or v.startswith("https://")


class EquipmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentImage
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        raw = instance.image_url or ""
        if not raw or _is_public_http_url(raw):
            return data
        request = self.context.get("request")
        if request is None:
            return data
        path = reverse(
            "equipment-image-content",
            kwargs={"pk": instance.pk},
        )
        data["image_url"] = request.build_absolute_uri(path)
        return data
       