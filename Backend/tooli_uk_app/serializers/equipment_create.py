from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from tooli_uk_app.models.category import Category
from tooli_uk_app.models.equipment import Equipment
from tooli_uk_app.models.equipment_availablility import EquipmentAvailability
from tooli_uk_app.models.equipment_image import EquipmentImage
from tooli_uk_app.models.equipment_location import EquipmentLocation
from tooli_uk_app.models.equipment_price import EquipmentPrice
from tooli_uk_app.models.interval import Interval
from tooli_uk_app.models.location import Location
from tooli_uk_app.models.organization import Organization
from tooli_uk_app.models.user import User
from tooli_uk_app.services import gcs_images


class CreateEquipmentLocationSerializer(serializers.Serializer):
    location_id = serializers.IntegerField()
    is_active = serializers.BooleanField(required=False, default=True)

    def validate_location_id(self, value: int) -> int:
        if not Location.objects.filter(location_id=value).exists():
            raise serializers.ValidationError("Invalid location_id.")
        return value


class CreateEquipmentPriceSerializer(serializers.Serializer):
    location_id = serializers.IntegerField(required=False, allow_null=True)
    interval_id = serializers.IntegerField(required=False, allow_null=True)
    is_active = serializers.BooleanField(required=False, default=True)
    price = serializers.DecimalField(max_digits=12, decimal_places=2)
    currency = serializers.CharField(max_length=10)

    def validate_location_id(self, value):
        if value is not None and not Location.objects.filter(location_id=value).exists():
            raise serializers.ValidationError("Invalid location_id.")
        return value

    def validate_interval_id(self, value):
        if value is not None and not Interval.objects.filter(interval_id=value).exists():
            raise serializers.ValidationError("Invalid interval_id.")
        return value


class CreateEquipmentImageSerializer(serializers.Serializer):
    """``image_url`` optional when a file is supplied at the same index (multipart ``images``)."""

    image_url = serializers.CharField(required=False, allow_blank=True, default="")
    is_active = serializers.BooleanField(required=False, default=True)
    sort_order = serializers.IntegerField(required=False, default=0)
    organization_id = serializers.IntegerField(required=False, allow_null=True)

    def validate_organization_id(self, value):
        if value is not None and not Organization.objects.filter(organization_id=value).exists():
            raise serializers.ValidationError("Invalid organization_id.")
        return value


class CreateEquipmentAvailabilitySerializer(serializers.Serializer):
    availability_from = serializers.DateTimeField()
    availability_to = serializers.DateTimeField()
    is_active = serializers.BooleanField(required=False, default=True)

    def validate(self, attrs):
        if attrs["availability_to"] <= attrs["availability_from"]:
            raise serializers.ValidationError(
                {"availability_to": "availability_to must be after availability_from."}
            )
        return attrs


class CreateEquipmentSerializer(serializers.Serializer):
    """Equipment ``organization_id`` is optional; images inherit it unless an image sets its own."""

    name = serializers.CharField(max_length=200)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    is_active = serializers.BooleanField(required=False, default=True)
    category_id = serializers.IntegerField(required=False, allow_null=True)
    organization_id = serializers.IntegerField(required=False, allow_null=True)
    created_by = serializers.IntegerField(required=False, allow_null=True)
    updated_by = serializers.IntegerField(required=False, allow_null=True)

    location = CreateEquipmentLocationSerializer(required=True)
    prices = CreateEquipmentPriceSerializer(many=True, required=False)
    images = CreateEquipmentImageSerializer(many=True, required=False)
    availabilities = CreateEquipmentAvailabilitySerializer(many=True, required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance is not None and self.partial:
            self.fields["name"].required = False
            self.fields["location"].required = False

    def validate_category_id(self, value):
        if value is not None and not Category.objects.filter(category_id=value).exists():
            raise serializers.ValidationError("Invalid category_id.")
        return value

    def validate_organization_id(self, value):
        if value is not None and not Organization.objects.filter(organization_id=value).exists():
            raise serializers.ValidationError("Invalid organization_id.")
        return value

    def validate_created_by(self, value):
        if value is not None and not User.objects.filter(user_id=value).exists():
            raise serializers.ValidationError("Invalid created_by.")
        return value

    def validate_updated_by(self, value):
        if value is not None and not User.objects.filter(user_id=value).exists():
            raise serializers.ValidationError("Invalid updated_by.")
        return value

    def validate(self, attrs):
        if self.instance is None:
            images = attrs.get("images") or []
        elif "images" not in attrs:
            return attrs
        else:
            images = attrs.get("images") or []
        image_files = self.context.get("image_files") or []
        if len(image_files) > len(images):
            raise serializers.ValidationError(
                {"images": "Include one images[] entry for each uploaded file (metadata only is ok)."}
            )
        for i, img in enumerate(images):
            url = (img.get("image_url") or "").strip()
            has_file = i < len(image_files) and bool(image_files[i])
            if not url and not has_file:
                raise serializers.ValidationError(
                    {"images": f"images[{i}] needs image_url or an uploaded file at the same index."}
                )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        now = timezone.now()

        location_data = validated_data.pop("location")
        prices_data = validated_data.pop("prices", [])
        images_data = validated_data.pop("images", [])
        availabilities_data = validated_data.pop("availabilities", [])

        equipment = Equipment.objects.create(
            name=validated_data["name"],
            description=validated_data.get("description"),
            is_active=validated_data.get("is_active", True),
            category_id_id=validated_data.get("category_id"),
            organization_id_id=validated_data.get("organization_id"),
            created_by_id=validated_data.get("created_by"),
            updated_by_id=validated_data.get("updated_by"),
            created_datetime=now,
            updated_datetime=now,
        )

        EquipmentLocation.objects.create(
            equipment_id_id=equipment.equipment_id,
            location_id_id=location_data["location_id"],
            is_active=location_data.get("is_active", True),
            created_datetime=now,
        )

        self._apply_prices(equipment.equipment_id, prices_data, now)
        self._apply_images(equipment, images_data, now)
        self._apply_availabilities(equipment.equipment_id, availabilities_data, now)

        return equipment

    def _apply_prices(self, equipment_id: int, prices_data: list, now) -> None:
        for item in prices_data:
            EquipmentPrice.objects.create(
                equipment_id_id=equipment_id,
                location_id_id=item.get("location_id"),
                interval_id_id=item.get("interval_id"),
                is_active=item.get("is_active", True),
                price=item["price"],
                currency=item["currency"],
                created_datetime=now,
            )

    def _apply_images(self, equipment: Equipment, images_data: list, now) -> None:
        image_files = self.context.get("image_files") or []
        default_image_org_id = equipment.organization_id_id
        for i, item in enumerate(images_data):
            file_obj = image_files[i] if i < len(image_files) else None
            stored_url = (item.get("image_url") or "").strip()
            if file_obj:
                try:
                    stored_url = gcs_images.upload_equipment_image(
                        file_obj, equipment.equipment_id
                    )
                except RuntimeError as exc:
                    raise serializers.ValidationError(
                        {"images": f"Could not store image: {exc}"}
                    ) from exc
            image_org_id = item.get("organization_id")
            if image_org_id is None:
                image_org_id = default_image_org_id
            EquipmentImage.objects.create(
                equipment_id_id=equipment.equipment_id,
                image_url=stored_url,
                is_active=item.get("is_active", True),
                sort_order=item.get("sort_order", 0),
                organization_id=image_org_id,
                created_datetime=now,
            )

    def _apply_availabilities(self, equipment_id: int, availabilities_data: list, now) -> None:
        for item in availabilities_data:
            EquipmentAvailability.objects.create(
                equipment_id_id=equipment_id,
                availability_from=item["availability_from"],
                availability_to=item["availability_to"],
                is_active=item.get("is_active", True),
                created_datetime=now,
            )

    @transaction.atomic
    def update(self, instance: Equipment, validated_data):
        now = timezone.now()
        partial = self.partial

        location_data = validated_data.pop("location", None)
        prices_data = validated_data.pop("prices", None)
        images_data = validated_data.pop("images", None)
        availabilities_data = validated_data.pop("availabilities", None)

        if "name" in validated_data:
            instance.name = validated_data["name"]
        if "description" in validated_data:
            instance.description = validated_data.get("description")
        if "is_active" in validated_data:
            instance.is_active = validated_data.get("is_active")
        if "category_id" in validated_data:
            instance.category_id_id = validated_data.get("category_id")
        if "organization_id" in validated_data:
            instance.organization_id_id = validated_data.get("organization_id")
        if "created_by" in validated_data:
            instance.created_by_id = validated_data.get("created_by")
        if "updated_by" in validated_data:
            instance.updated_by_id = validated_data.get("updated_by")

        if location_data is not None:
            EquipmentLocation.objects.filter(equipment_id_id=instance.equipment_id).delete()
            EquipmentLocation.objects.create(
                equipment_id_id=instance.equipment_id,
                location_id_id=location_data["location_id"],
                is_active=location_data.get("is_active", True),
                created_datetime=now,
            )
        elif not partial:
            raise serializers.ValidationError(
                {"location": "This field is required for full (PUT) updates."}
            )

        if prices_data is not None:
            EquipmentPrice.objects.filter(equipment_id_id=instance.equipment_id).delete()
            self._apply_prices(instance.equipment_id, prices_data, now)

        if images_data is not None:
            EquipmentImage.objects.filter(equipment_id_id=instance.equipment_id).delete()
            self._apply_images(instance, images_data, now)

        if availabilities_data is not None:
            EquipmentAvailability.objects.filter(
                equipment_id_id=instance.equipment_id
            ).delete()
            self._apply_availabilities(instance.equipment_id, availabilities_data, now)

        instance.updated_datetime = now
        instance.save()
        return instance
