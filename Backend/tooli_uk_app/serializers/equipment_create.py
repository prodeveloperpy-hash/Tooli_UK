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
    image_url = serializers.CharField()
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

        equipment_location = EquipmentLocation.objects.create(
            equipment_id_id=equipment.equipment_id,
            location_id_id=location_data["location_id"],
            is_active=location_data.get("is_active", True),
            created_datetime=now,
        )

        created_prices = []
        for item in prices_data:
            created_prices.append(
                EquipmentPrice.objects.create(
                    equipment_id_id=equipment.equipment_id,
                    location_id_id=item.get("location_id"),
                    interval_id_id=item.get("interval_id"),
                    is_active=item.get("is_active", True),
                    price=item["price"],
                    currency=item["currency"],
                    created_datetime=now,
                )
            )

        created_images = []
        for item in images_data:
            created_images.append(
                EquipmentImage.objects.create(
                    equipment_id_id=equipment.equipment_id,
                    image_url=item["image_url"],
                    is_active=item.get("is_active", True),
                    sort_order=item.get("sort_order", 0),
                    organization_id=item.get("organization_id"),
                    created_datetime=now,
                )
            )

        created_availabilities = []
        for item in availabilities_data:
            created_availabilities.append(
                EquipmentAvailability.objects.create(
                    equipment_id_id=equipment.equipment_id,
                    availability_from=item["availability_from"],
                    availability_to=item["availability_to"],
                    is_active=item.get("is_active", True),
                    created_datetime=now,
                )
            )

        return {
            "equipment_id": equipment.equipment_id,
            "equipment_location_id": equipment_location.equipment_location_id,
            "price_ids": [price.equipment_price_id for price in created_prices],
            "image_ids": [image.equipment_image_id for image in created_images],
            "availability_ids": [
                availability.equipment_availability_id
                for availability in created_availabilities
            ],
        }
