import json

from rest_framework import parsers, status, viewsets
from rest_framework.response import Response

from tooli_uk_app.filters.equipment import EquipmentFilter
from tooli_uk_app.models import Equipment
from tooli_uk_app.pagination import EquipmentPagination
from tooli_uk_app.serializers.equipment import EquipmentMutateSerializer, EquipmentSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = (
        Equipment.objects.prefetch_related(
            "prices__interval_id",
            "locations__location_id",
            "images",
            "availabilities",
        )
        .all()
        .distinct()
    )
    filterset_class = EquipmentFilter
    pagination_class = EquipmentPagination
    parser_classes = [
        parsers.JSONParser,
        parsers.MultiPartParser,
        parsers.FormParser,
    ]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return EquipmentMutateSerializer
        return EquipmentSerializer

    def _read(self, instance, status_code=status.HTTP_200_OK):
        ser = EquipmentSerializer(instance, context=self.get_serializer_context())
        return Response(ser.data, status=status_code)

    def create(self, request, *args, **kwargs):
        if request.content_type and "multipart/form-data" in request.content_type:
            raw = request.data.get("payload")
            if raw is None or raw == "":
                return Response(
                    {
                        "detail": 'Multipart create needs a JSON string field "payload" with '
                        'equipment fields and optional images[]. '
                        'Repeat form field "images" for each file upload.'
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if isinstance(raw, (bytes, bytearray)):
                raw = raw.decode()
            try:
                body = json.loads(raw)
            except json.JSONDecodeError as exc:
                return Response(
                    {"detail": f"Invalid payload JSON: {exc}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            image_files = list(request.FILES.getlist("images"))
            serializer = self.get_serializer(
                data=body,
                context={**self.get_serializer_context(), "image_files": image_files},
            )
        else:
            data = request.data
            serializer = self.get_serializer(
                data=data,
                context=self.get_serializer_context(),
            )
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return self._read(instance, status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        data = request.data
        image_files = []
        if request.content_type and "multipart/form-data" in request.content_type:
            raw = request.data.get("payload")
            if raw is None or raw == "":
                data = {}
            else:
                if isinstance(raw, (bytes, bytearray)):
                    raw = raw.decode()
                try:
                    data = json.loads(raw)
                except json.JSONDecodeError as exc:
                    return Response(
                        {"detail": f"Invalid payload JSON: {exc}"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            image_files = list(request.FILES.getlist("images"))
        serializer = self.get_serializer(
            instance,
            data=data,
            partial=partial,
            context={
                **self.get_serializer_context(),
                "image_files": image_files,
            },
        )
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return self._read(instance)

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)
