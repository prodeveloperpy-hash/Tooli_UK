from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from tooli_uk_app.serializers.auth import LoginSerializer, SignupSerializer


class SignupAPIView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response(
            {
                "message": "Signup successful.",
                "data": result,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        return Response(
            {
                "message": "Login successful.",
                "data": {
                    "user_id": user.user_id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role_id": user.role_id_id,
                },
            },
            status=status.HTTP_200_OK,
        )
