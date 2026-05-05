from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from tooli_uk_app.models import Equipment
from tooli_uk_app.models.equipment_image import EquipmentImage
from tooli_uk_app.serializers.equipment_availablility import EquipmentAvailabilitySerializer
from tooli_uk_app.serializers.equipment_create import CreateEquipmentImageSerializer
from tooli_uk_app.serializers.equipment_image import EquipmentImageSerializer
from tooli_uk_app.serializers.equipment_location import EquipmentLocationSerializer
from tooli_uk_app.serializers.equipment_price import EquipmentPriceSerializer
from tooli_uk_app.services import gcs_images


class EquipmentSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(
        source="organization_id.name",
        read_only=True,
    )
    locations = EquipmentLocationSerializer(many=True, read_only=True)
    prices = EquipmentPriceSerializer(many=True, read_only=True)
    images = EquipmentImageSerializer(many=True, read_only=True)
    availabilities = EquipmentAvailabilitySerializer(many=True, read_only=True)

    class Meta:
        model = Equipment
        fields = "__all__"


class EquipmentMutateSerializer(serializers.ModelSerializer):
    """Create/update equipment with optional ``images`` (URLs and/or multipart file list ``images``)."""

    images = CreateEquipmentImageSerializer(many=True, required=False, write_only=True)

    class Meta:
        model = Equipment
        fields = (
            "equipment_id",
            "name",
            "description",
            "is_active",
            "category_id",
            "organization_id",
            "created_by",
            "updated_by",
            "created_datetime",
            "updated_datetime",
            "images",
        )
        read_only_fields = ("equipment_id", "created_datetime", "updated_datetime")

    def validate(self, attrs):
        attrs = super().validate(attrs)
        image_files = self.context.get("image_files") or []
        images = attrs.get("images")
        if images is None:
            images = []
        if len(image_files) > len(images):
            raise serializers.ValidationError(
                {
                    "images": "Include one images[] entry for each uploaded file (metadata only is ok)."
                }
            )
        for i, img in enumerate(images):
            url = (img.get("image_url") or "").strip()
            has_file = i < len(image_files) and bool(image_files[i])
            if not url and not has_file:
                raise serializers.ValidationError(
                    {
                        "images": f"images[{i}] needs image_url or an uploaded file at the same index."
                    }
                )
        attrs["images"] = images
        return attrs

    def _save_images(self, equipment: Equipment, images_data: list, image_files: list) -> None:
        now = timezone.now()
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

    @transaction.atomic
    def create(self, validated_data):
        now = timezone.now()
        images_data = list(validated_data.pop("images", []) or [])
        image_files = self.context.get("image_files") or []
        equipment = super().create(validated_data)
        if not equipment.created_datetime:
            equipment.created_datetime = now
        equipment.updated_datetime = now
        equipment.save(update_fields=["created_datetime", "updated_datetime"])
        if images_data or image_files:
            self._save_images(equipment, images_data, image_files)
        return equipment

    @transaction.atomic
    def update(self, instance, validated_data):
        images_data = list(validated_data.pop("images", []) or [])
        image_files = self.context.get("image_files") or []
        equipment = super().update(instance, validated_data)
        now = timezone.now()
        equipment.updated_datetime = now
        equipment.save(update_fields=["updated_datetime"])
        if images_data or image_files:
            self._save_images(equipment, images_data, image_files)
        return equipment
