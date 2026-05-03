from django.urls import reverse
from rest_framework import serializers

from tooli_uk_app.models import User


def _is_public_http_url(value: str) -> bool:
    v = (value or "").strip().lower()
    return v.startswith("http://") or v.startswith("https://")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        read_only_fields = ("user_id", "created_datetime", "updated_datetime")
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        raw = instance.avatar_url or ""
        if not raw or _is_public_http_url(raw):
            return data
        request = self.context.get("request")
        if request is None:
            return data
        path = reverse("user-avatar", kwargs={"pk": instance.pk})
        data["avatar_url"] = request.build_absolute_uri(path)
        return data
