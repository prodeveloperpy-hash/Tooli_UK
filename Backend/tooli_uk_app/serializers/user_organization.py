from rest_framework import serializers

from tooli_uk_app.models import UserOrganization
class UserOrganizationUserDetailSerializer(serializers.Serializer):
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    avatar_url = serializers.CharField(read_only=True, allow_null=True)
    is_active = serializers.BooleanField(read_only=True)


class UserOrganizationOrganizationDetailSerializer(serializers.Serializer):
    name = serializers.CharField(read_only=True)
    domain = serializers.CharField(read_only=True, allow_null=True)
    city = serializers.CharField(read_only=True, allow_null=True)
    state = serializers.CharField(read_only=True, allow_null=True)
    country = serializers.CharField(read_only=True, allow_null=True)
    is_active = serializers.BooleanField(read_only=True)


class UserOrganizationRoleDetailSerializer(serializers.Serializer):
    role_key = serializers.CharField(read_only=True)
    role_display_name = serializers.CharField(read_only=True)


class UserOrganizationSerializer(serializers.ModelSerializer):
    user_details = UserOrganizationUserDetailSerializer(source="user_id", read_only=True)
    organization_details = UserOrganizationOrganizationDetailSerializer(
        source="organization_id",
        read_only=True,
    )
    role_details = UserOrganizationRoleDetailSerializer(source="role_id", read_only=True)

    class Meta:
        model = UserOrganization
        fields = "__all__"
        read_only_fields = ("user_organization_id", "created_datetime", "updated_datetime")
