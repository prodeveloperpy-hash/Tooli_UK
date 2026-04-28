from rest_framework import serializers

from tooli_uk_app.models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = "__all__"
        read_only_fields = ("organization_id", "created_datetime", "updated_datetime")
