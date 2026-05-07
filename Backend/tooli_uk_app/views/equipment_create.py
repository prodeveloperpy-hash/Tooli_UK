import json

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import parsers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from tooli_uk_app.models import Equipment
from tooli_uk_app.models.equipment_availablility import EquipmentAvailability
from tooli_uk_app.models.equipment_image import EquipmentImage
from tooli_uk_app.models.equipment_location import EquipmentLocation
from tooli_uk_app.models.equipment_price import EquipmentPrice
from tooli_uk_app.serializers.equipment import EquipmentSerializer
from tooli_uk_app.serializers.equipment_create import CreateEquipmentSerializer


def _prefetched_equipment(pk: int) -> Equipment:
    return Equipment.objects.prefetch_related(
        "prices__interval_id",
        "locations__location_id",
        "images",
        "availabilities",
    ).get(pk=pk)


def _equipment_success_response(request, equipment: Equipment, message: str, http_status: int):
    equipment = _prefetched_equipment(equipment.equipment_id)
    payload = EquipmentSerializer(equipment, context={"request": request}).data
    return Response(
        {"message": message, "data": payload},
        status=http_status,
    )


def _parse_equipment_payload(request):
    """Return (body_dict, image_files, used_multipart)."""
    if request.content_type and "multipart/form-data" in request.content_type:
        raw_payload = request.data.get("payload")
        if raw_payload is None:
            return None, [], True
        if isinstance(raw_payload, (bytes, bytearray)):
            raw_payload = raw_payload.decode()
        try:
            body = json.loads(raw_payload)
        except json.JSONDecodeError as exc:
            raise ValueError(str(exc)) from exc
        image_files = list(request.FILES.getlist("images"))
        return body, image_files, True
    return request.data, [], False


def _apply_put_list_defaults(body: dict) -> None:
    body.setdefault("prices", [])
    body.setdefault("images", [])
    body.setdefault("availabilities", [])
    body.setdefault("locations", [])


class CreateEquipmentAPIView(APIView):
    parser_classes = [
        parsers.JSONParser,
        parsers.MultiPartParser,
        parsers.FormParser,
    ]

    def post(self, request):
        try:
            body, image_files, multipart = _parse_equipment_payload(request)
        except ValueError as exc:
            return Response(
                {"detail": f"Invalid payload JSON: {exc}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if multipart and body is None:
            return Response(
                {
                    "detail": 'Multipart requests must include a JSON string field "payload" '
                    "(equipment fields including images[] metadata)."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = CreateEquipmentSerializer(
            data=body,
            context={"request": request, "image_files": image_files},
        )
        serializer.is_valid(raise_exception=True)
        equipment = serializer.save()
        return _equipment_success_response(
            request,
            equipment,
            "Equipment created successfully.",
            status.HTTP_201_CREATED,
        )


class CreateEquipmentDetailAPIView(APIView):
    """PUT/PATCH/DELETE same nested shape as POST ``create_equipment/``."""

    parser_classes = [
        parsers.JSONParser,
        parsers.MultiPartParser,
        parsers.FormParser,
    ]

    def put(self, request, equipment_id: int):
        return self._update(request, equipment_id, partial=False)

    def patch(self, request, equipment_id: int):
        return self._update(request, equipment_id, partial=True)

    def _update(self, request, equipment_id: int, *, partial: bool):
        equipment = get_object_or_404(Equipment, pk=equipment_id)
        try:
            body, image_files, multipart = _parse_equipment_payload(request)
        except ValueError as exc:
            return Response(
                {"detail": f"Invalid payload JSON: {exc}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if multipart and body is None:
            return Response(
                {
                    "detail": 'Multipart requests must include a JSON string field "payload".'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not isinstance(body, dict):
            return Response(
                {"detail": "Payload must be a JSON object."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        body = dict(body)
        if not partial:
            _apply_put_list_defaults(body)
        serializer = CreateEquipmentSerializer(
            instance=equipment,
            data=body,
            partial=partial,
            context={"request": request, "image_files": image_files},
        )
        serializer.is_valid(raise_exception=True)
        equipment = serializer.save()
        verb = "updated" if partial else "replaced"
        return _equipment_success_response(
            request,
            equipment,
            f"Equipment {verb} successfully.",
            status.HTTP_200_OK,
        )

    @transaction.atomic
    def delete(self, request, equipment_id: int):
        equipment = get_object_or_404(Equipment, pk=equipment_id)
        eid = equipment.equipment_id
        EquipmentImage.objects.filter(equipment_id_id=eid).delete()
        EquipmentPrice.objects.filter(equipment_id_id=eid).delete()
        EquipmentLocation.objects.filter(equipment_id_id=eid).delete()
        EquipmentAvailability.objects.filter(equipment_id_id=eid).delete()
        equipment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
