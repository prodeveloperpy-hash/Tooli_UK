from django.contrib.auth.hashers import check_password, make_password
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from tooli_uk_app.models.organization import Organization
from tooli_uk_app.models.role import Role
from tooli_uk_app.models.user import User
from tooli_uk_app.models.user_organization import UserOrganization
from tooli_uk_app.services.notifications import notify_new_supplier_for_approval
from tooli_uk_app.services.superadmin import (
    is_hardcoded_superadmin_login,
)


class SignupSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8, max_length=128)
    # Signup is supplier-only. Role is forced to SUPPLIER in backend.
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

    # Signup is supplier-only. Membership role is forced to SUPPLIER in backend.
    user_organization_role_id = serializers.IntegerField(required=False, allow_null=True)


    def validate_email(self, value: str) -> str:
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "This email is already registered. Please use a different email or log in."
            )
        return value

    def _resolve_supplier_role_id(self) -> int:
        supplier_role = Role.objects.filter(role_key__iexact="SUPPLIER").first()
        if not supplier_role:
            raise serializers.ValidationError(
                {"role_id": "Default role 'SUPPLIER' was not found."}
            )
        return supplier_role.role_id

    @transaction.atomic
    def create(self, validated_data):
        now = timezone.now()
        # Force supplier-only signup regardless of any role fields sent by client.
        resolved_role_id = self._resolve_supplier_role_id()

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

        avatar_file = self.context.get("avatar_file")
        if avatar_file:
            from tooli_uk_app.services import gcs_images

            user.avatar_url = gcs_images.upload_user_avatar(avatar_file, user.user_id)
            user.save(update_fields=["avatar_url", "updated_datetime"])

        membership_role_id = resolved_role_id
        UserOrganization.objects.create(
            user_id_id=user.user_id,
            organization_id_id=organization.organization_id,
            role_id_id=membership_role_id,
            is_active=True,
            # Supplier signups are always pending admin approval.
            is_approved=False,
            created_datetime=now,
            updated_datetime=now,
            created_by_id=user.user_id,
            updated_by_id=user.user_id,
        )

        full_name = f"{user.first_name} {user.last_name}".strip()
        transaction.on_commit(
            lambda: notify_new_supplier_for_approval(
                supplier_name=full_name or user.email,
                supplier_email=user.email,
                organization_name=organization.name,
            )
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

        if is_hardcoded_superadmin_login(email=email, password=password):
            attrs["is_hardcoded_superadmin"] = True
            return attrs

        user = (
            User.objects.select_related("role_id")
            .filter(email__iexact=email, is_active=True)
            .first()
        )
        if not user or not check_password(password, user.password):
            raise serializers.ValidationError(
                "Invalid email or password. Please check your credentials and try again."
            )

        role_key = (user.role_id.role_key or "").upper() if user.role_id else ""
        if role_key == "SUPPLIER":
            supplier_link = (
                UserOrganization.objects.filter(
                    user_id=user.user_id,
                    is_active=True,
                )
                .order_by("-user_organization_id")
                .first()
            )
            if not supplier_link:
                raise serializers.ValidationError(
                    "No active organisation found for your account. Please contact support."
                )
            if not supplier_link.is_approved:
                raise serializers.ValidationError(
                    "Your account is pending approval by the admin. "
                    "You will receive an email once your account is approved."
                )

        attrs["is_hardcoded_superadmin"] = False
        attrs["user"] = user
        return attrs
