from rest_framework import serializers

from tooli_uk_app.models import UserOrganization


class UserOrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOrganization
        fields = "__all__"
        read_only_fields = ("user_organization_id", "created_datetime", "updated_datetime")
