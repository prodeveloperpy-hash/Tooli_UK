from django.contrib.auth.hashers import check_password, make_password
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from tooli_uk_app.models.organization import Organization
from tooli_uk_app.models.role import Role
from tooli_uk_app.models.user import User
from tooli_uk_app.models.user_organization import UserOrganization


class SignupSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8, max_length=128)
    role_id = serializers.IntegerField(required=False, allow_null=True)
    avatar_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    is_active = serializers.BooleanField(required=False, default=True)

    organization_name = serializers.CharField(max_length=200)
    organization_domain = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=150)
    organization_logo = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    organization_address1 = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=255)
    organization_address2 = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=255)
    organization_city = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=150)
    organization_state = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=150)
    organization_postal_code = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=50)
    organization_country = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100)
    organization_is_active = serializers.BooleanField(required=False, default=True)

    user_organization_role_id = serializers.IntegerField(required=False, allow_null=True)
    def validate_user_organization_role_id(self, value):
        if value is not None and not Role.objects.filter(role_id=value).exists():
            raise serializers.ValidationError("Invalid user_organization_role_id.")
        return value


    def validate_email(self, value: str) -> str:
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email is already registered.")
        return value

    def _resolve_role_id(self, role_id: int | None) -> int:
        if role_id is not None:
            if not Role.objects.filter(role_id=role_id).exists():
                raise serializers.ValidationError({"role_id": "Invalid role_id."})
            return role_id

        supplier_role = Role.objects.filter(role_key__iexact="SUPPLIER").first()
        if not supplier_role:
            raise serializers.ValidationError(
                {"role_id": "Default role 'SUPPLIER' was not found."}
            )
        return supplier_role.role_id

    @transaction.atomic
    def create(self, validated_data):
        now = timezone.now()
        resolved_role_id = self._resolve_role_id(validated_data.get("role_id"))

        organization = Organization.objects.create(
            name=validated_data["organization_name"],
            domain=validated_data.get("organization_domain"),
            logo=validated_data.get("organization_logo"),
            address1=validated_data.get("organization_address1"),
            address2=validated_data.get("organization_address2"),
            city=validated_data.get("organization_city"),
            state=validated_data.get("organization_state"),
            postal_code=validated_data.get("organization_postal_code"),
            country=validated_data.get("organization_country"),
            is_active=validated_data.get("organization_is_active", True),
            created_datetime=now,
            updated_datetime=now,
        )

        user = User.objects.create(
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            password=make_password(validated_data["password"]),
            avatar_url=validated_data.get("avatar_url"),
            role_id_id=resolved_role_id,
            is_active=validated_data.get("is_active", True),
            created_datetime=now,
            updated_datetime=now,
        )

        # Backfill audit links after user exists.
        organization.created_by_id = user.user_id
        organization.updated_by_id = user.user_id
        organization.save(update_fields=["created_by", "updated_by"])

        user.created_by_id = user.user_id
        user.updated_by_id = user.user_id
        user.save(update_fields=["created_by", "updated_by"])

        user_org_role = validated_data.get("user_organization_role_id")
        UserOrganization.objects.create(
            user_id_id=user.user_id,
            organization_id_id=organization.organization_id,
            role_id_id=user_org_role if user_org_role is not None else resolved_role_id,
            is_active=True,
            created_datetime=now,
            updated_datetime=now,
            created_by_id=user.user_id,
            updated_by_id=user.user_id,
        )

        return {
            "user_id": user.user_id,
            "email": user.email,
            "organization_id": organization.organization_id,
        }


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=150)
    password = serializers.CharField(write_only=True, max_length=128)

    def validate(self, attrs):
        email = attrs["email"]
        password = attrs["password"]

        user = (
            User.objects.select_related("role_id")
            .filter(email__iexact=email, is_active=True)
            .first()
        )
        if not user or not check_password(password, user.password):
            raise serializers.ValidationError("Invalid email or password.")

        attrs["user"] = user
        return attrs
