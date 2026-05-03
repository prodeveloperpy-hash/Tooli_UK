from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.urls import reverse
from django.utils import timezone
from rest_framework import serializers

from tooli_uk_app.models import Organization, Role, User, UserOrganization
from tooli_uk_app.serializers.user import _is_public_http_url


class UserOrganizationUserDetailSerializer(serializers.Serializer):
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    avatar_url = serializers.SerializerMethodField()
    is_active = serializers.BooleanField(read_only=True)

    def get_avatar_url(self, obj):
        raw = (obj.avatar_url or "").strip() if obj else ""
        if not raw or _is_public_http_url(raw):
            return raw or None
        request = self.context.get("request")
        if request is None:
            return raw
        path = reverse("user-avatar", kwargs={"pk": obj.pk})
        return request.build_absolute_uri(path)


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


def _resolve_user_role_id(role_id: int | None) -> int:
    if role_id is not None:
        if not Role.objects.filter(role_id=role_id).exists():
            raise serializers.ValidationError({"role_id": "Invalid role_id."})
        return role_id
    supplier = Role.objects.filter(role_key__iexact="SUPPLIER").first()
    if not supplier:
        raise serializers.ValidationError(
            {"role_id": "Default role 'SUPPLIER' was not found."}
        )
    return supplier.role_id


class UserOrganizationUserNestedSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100, required=False)
    last_name = serializers.CharField(max_length=100, required=False)
    email = serializers.EmailField(max_length=150, required=False)
    password = serializers.CharField(
        write_only=True, min_length=8, max_length=128, required=False
    )
    role_id = serializers.IntegerField(required=False, allow_null=True)
    avatar_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    is_active = serializers.BooleanField(required=False)


class UserOrganizationOrganizationNestedSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200, required=False)
    domain = serializers.CharField(
        max_length=150, required=False, allow_blank=True, allow_null=True
    )
    logo = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    address1 = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    address2 = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    city = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    state = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    postal_code = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    country = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    is_active = serializers.BooleanField(required=False)


class UserOrganizationMutateSerializer(serializers.Serializer):
    """
    Create or update membership plus optional nested User and Organization rows.

    Create: provide (user_id OR user) and (organization_id OR organization), plus role_id.
    Update: PATCH nested user / organization to merge fields on linked rows; membership fields optional.
    """

    user_id = serializers.IntegerField(required=False, allow_null=True)
    organization_id = serializers.IntegerField(required=False, allow_null=True)
    user = UserOrganizationUserNestedSerializer(required=False)
    organization = UserOrganizationOrganizationNestedSerializer(required=False)
    role_id = serializers.IntegerField(required=False, allow_null=True)
    is_active = serializers.BooleanField(required=False, default=True)
    created_by = serializers.IntegerField(required=False, allow_null=True)
    updated_by = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, attrs):
        if self.instance is None:
            return self._validate_create(attrs)
        return self._validate_update(attrs)

    def _validate_create(self, attrs):
        uid = attrs.get("user_id")
        oid = attrs.get("organization_id")
        user_payload = attrs.get("user") or {}
        org_payload = attrs.get("organization") or {}

        if uid is not None and user_payload:
            raise serializers.ValidationError(
                "Provide either user_id or user, not both."
            )
        if oid is not None and org_payload:
            raise serializers.ValidationError(
                "Provide either organization_id or organization, not both."
            )
        if uid is None and not user_payload:
            raise serializers.ValidationError(
                "Create requires user_id or a user object "
                "(first_name, last_name, email, password)."
            )
        if oid is None and not org_payload:
            raise serializers.ValidationError(
                "Create requires organization_id or an organization object (name required)."
            )

        if user_payload:
            req = ("first_name", "last_name", "email", "password")
            missing = [f for f in req if not user_payload.get(f)]
            if missing:
                raise serializers.ValidationError(
                    {"user": f"Missing required fields: {', '.join(missing)}."}
                )
            email = user_payload["email"]
            if User.objects.filter(email__iexact=email).exists():
                raise serializers.ValidationError(
                    {"user": "A user with this email already exists."}
                )

        if org_payload and not org_payload.get("name"):
            raise serializers.ValidationError(
                {"organization": "organization.name is required when creating an organization."}
            )

        if attrs.get("role_id") is None:
            raise serializers.ValidationError(
                {"role_id": "role_id is required when creating a membership."}
            )
        if not Role.objects.filter(role_id=attrs["role_id"]).exists():
            raise serializers.ValidationError({"role_id": "Invalid role_id."})

        if uid is not None and not User.objects.filter(pk=uid).exists():
            raise serializers.ValidationError({"user_id": "Invalid user_id."})
        if oid is not None and not Organization.objects.filter(pk=oid).exists():
            raise serializers.ValidationError({"organization_id": "Invalid organization_id."})

        return attrs

    def _validate_update(self, attrs):
        if attrs.get("role_id") is not None and not Role.objects.filter(
            role_id=attrs["role_id"]
        ).exists():
            raise serializers.ValidationError({"role_id": "Invalid role_id."})

        user_payload = attrs.get("user") or {}
        if user_payload.get("email"):
            other = (
                User.objects.filter(email__iexact=user_payload["email"])
                .exclude(pk=self.instance.user_id_id)
                .exists()
            )
            if other:
                raise serializers.ValidationError(
                    {"user": "A user with this email already exists."}
                )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        now = timezone.now()
        user_payload = validated_data.pop("user", None) or {}
        org_payload = validated_data.pop("organization", None) or {}
        user_id = validated_data.pop("user_id", None)
        organization_id = validated_data.pop("organization_id", None)
        role_id = validated_data.pop("role_id")
        is_active = validated_data.pop("is_active", True)
        created_by = validated_data.pop("created_by", None)
        updated_by = validated_data.pop("updated_by", None)

        if user_payload:
            role_pk = _resolve_user_role_id(user_payload.get("role_id"))
            user = User.objects.create(
                first_name=user_payload["first_name"],
                last_name=user_payload["last_name"],
                email=user_payload["email"],
                password=make_password(user_payload["password"]),
                avatar_url=user_payload.get("avatar_url"),
                role_id_id=role_pk,
                is_active=user_payload.get("is_active", True),
                created_datetime=now,
                updated_datetime=now,
            )
            user.created_by_id = user.user_id
            user.updated_by_id = user.user_id
            user.save(update_fields=["created_by_id", "updated_by_id"])
            user_id = user.user_id
        actor = created_by or user_id

        if org_payload:
            org = Organization.objects.create(
                name=org_payload["name"],
                domain=org_payload.get("domain"),
                logo=org_payload.get("logo"),
                address1=org_payload.get("address1"),
                address2=org_payload.get("address2"),
                city=org_payload.get("city"),
                state=org_payload.get("state"),
                postal_code=org_payload.get("postal_code"),
                country=org_payload.get("country"),
                is_active=org_payload.get("is_active", True),
                created_datetime=now,
                updated_datetime=now,
                created_by_id=actor,
                updated_by_id=actor,
            )
            organization_id = org.organization_id

        avatar_file = self.context.get("avatar_file")
        if avatar_file and user_id:
            from tooli_uk_app.services import gcs_images

            target_user = User.objects.get(pk=user_id)
            try:
                target_user.avatar_url = gcs_images.upload_user_avatar(
                    avatar_file, user_id
                )
                target_user.updated_datetime = now
                target_user.save(update_fields=["avatar_url", "updated_datetime"])
            except RuntimeError as exc:
                raise serializers.ValidationError({"avatar": str(exc)}) from exc

        if UserOrganization.objects.filter(
            user_id_id=user_id, organization_id_id=organization_id
        ).exists():
            raise serializers.ValidationError(
                "This user is already linked to this organization."
            )

        link = UserOrganization.objects.create(
            user_id_id=user_id,
            organization_id_id=organization_id,
            role_id_id=role_id,
            is_active=is_active,
            created_datetime=now,
            updated_datetime=now,
            created_by_id=created_by or user_id,
            updated_by_id=updated_by or user_id,
        )
        return link

    @transaction.atomic
    def update(self, instance, validated_data):
        now = timezone.now()
        user_payload = validated_data.pop("user", None)
        org_payload = validated_data.pop("organization", None)
        validated_data.pop("user_id", None)
        validated_data.pop("organization_id", None)
        updated_by = validated_data.pop("updated_by", None)
        validated_data.pop("created_by", None)

        if "role_id" in validated_data:
            rid = validated_data.pop("role_id")
            if rid is not None:
                instance.role_id_id = rid
        if "is_active" in validated_data:
            instance.is_active = validated_data.pop("is_active")

        if user_payload:
            u = User.objects.get(pk=instance.user_id_id)
            for field in (
                "first_name",
                "last_name",
                "email",
                "avatar_url",
                "is_active",
            ):
                if field in user_payload and user_payload[field] is not None:
                    setattr(u, field, user_payload[field])
            if user_payload.get("role_id") is not None:
                if not Role.objects.filter(role_id=user_payload["role_id"]).exists():
                    raise serializers.ValidationError({"user": "Invalid role_id."})
                u.role_id_id = user_payload["role_id"]
            if user_payload.get("password"):
                u.password = make_password(user_payload["password"])
            u.updated_datetime = now
            u.save()

        if org_payload:
            o = Organization.objects.get(pk=instance.organization_id_id)
            for field in (
                "name",
                "domain",
                "logo",
                "address1",
                "address2",
                "city",
                "state",
                "postal_code",
                "country",
                "is_active",
            ):
                if field in org_payload and org_payload[field] is not None:
                    setattr(o, field, org_payload[field])
            o.updated_datetime = now
            if updated_by is not None:
                o.updated_by_id = updated_by
            o.save()

        instance.updated_datetime = now
        if updated_by is not None:
            instance.updated_by_id = updated_by
        instance.save()

        avatar_file = self.context.get("avatar_file")
        if avatar_file:
            from tooli_uk_app.services import gcs_images

            u = User.objects.get(pk=instance.user_id_id)
            try:
                u.avatar_url = gcs_images.upload_user_avatar(avatar_file, u.user_id)
                u.updated_datetime = now
                u.save(update_fields=["avatar_url", "updated_datetime"])
            except RuntimeError as exc:
                raise serializers.ValidationError({"avatar": str(exc)}) from exc

        return instance
