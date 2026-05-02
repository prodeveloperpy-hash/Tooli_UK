import json

from rest_framework import parsers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from tooli_uk_app.serializers.equipment_create import CreateEquipmentSerializer


class CreateEquipmentAPIView(APIView):
    parser_classes = [
        parsers.JSONParser,
        parsers.MultiPartParser,
        parsers.FormParser,
    ]

    def post(self, request):
        image_files = []
        if request.content_type and "multipart/form-data" in request.content_type:
            raw_payload = request.data.get("payload")
            if raw_payload is None:
                return Response(
                    {
                        "detail": 'Multipart requests must include a JSON string field "payload" '
                        "(equipment fields including images[] metadata)."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if isinstance(raw_payload, (bytes, bytearray)):
                raw_payload = raw_payload.decode()
            try:
                body = json.loads(raw_payload)
            except json.JSONDecodeError as exc:
                return Response(
                    {"detail": f"Invalid payload JSON: {exc}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            image_files = list(request.FILES.getlist("images"))
            serializer = CreateEquipmentSerializer(
                data=body,
                context={"request": request, "image_files": image_files},
            )
        else:
            serializer = CreateEquipmentSerializer(
                data=request.data,
                context={"request": request},
            )
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response(
            {
                "message": "Equipment created successfully.",
                "data": result,
            },
            status=status.HTTP_201_CREATED,
        )
