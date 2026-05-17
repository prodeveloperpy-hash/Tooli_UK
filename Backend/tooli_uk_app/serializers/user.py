from django.urls import reverse
from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from tooli_uk_app.models import User
from tooli_uk_app.services.gcs_images import should_use_api_url_in_json


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
        if not raw or not should_use_api_url_in_json(raw):
            return data
        request = self.context.get("request")
        if request is None:
            return data
        path = reverse("user-avatar", kwargs={"pk": instance.pk})
        data["avatar_url"] = request.build_absolute_uri(path)
        return data

    def _hash_password_if_present(self, validated_data: dict) -> dict:
        password = validated_data.get("password")
        if password:
            validated_data["password"] = make_password(password)
        elif "password" in validated_data:
            # Do not overwrite an existing password with empty value.
            validated_data.pop("password")
        return validated_data

    def create(self, validated_data):
        validated_data = self._hash_password_if_present(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data = self._hash_password_if_present(validated_data)
        return super().update(instance, validated_data)
