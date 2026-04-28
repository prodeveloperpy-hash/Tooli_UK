from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from tooli_uk_app.serializers.equipment_create import CreateEquipmentSerializer


class CreateEquipmentAPIView(APIView):
    def post(self, request):
        serializer = CreateEquipmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response(
            {
                "message": "Equipment created successfully.",
                "data": result,
            },
            status=status.HTTP_201_CREATED,
        )
