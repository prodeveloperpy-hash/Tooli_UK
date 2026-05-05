from django.urls import reverse
from rest_framework import serializers

from tooli_uk_app.models import Organization
from tooli_uk_app.serializers.user import _is_public_http_url


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = "__all__"
        read_only_fields = ("organization_id", "created_datetime", "updated_datetime")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        raw = (instance.logo or "").strip()
        if not raw or _is_public_http_url(raw):
            return data
        request = self.context.get("request")
        if request is None:
            return data
        path = reverse("organization-logo", kwargs={"pk": instance.pk})
        data["logo"] = request.build_absolute_uri(path)
        return data
