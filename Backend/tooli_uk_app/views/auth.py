from django.contrib.auth import logout as django_auth_logout
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from tooli_uk_app.models.user_organization import UserOrganization
from tooli_uk_app.serializers.auth import LoginSerializer, SignupSerializer
from tooli_uk_app.serializers.user import UserSerializer


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

        organization_id = (
            UserOrganization.objects.filter(user_id=user, is_active=True)
            .order_by("user_organization_id")
            .values_list("organization_id", flat=True)
            .first()
        )
        role_key = user.role_id.role_key if user.role_id_id else None

        return Response(
            {
                "message": "Login successful.",
                "data": {
                    "user": UserSerializer(user).data,
                    "role_key": role_key,
                    "organization_id": organization_id,
                },
            },
            status=status.HTTP_200_OK,
        )


class LogoutAPIView(APIView):
    """Clear the server session; clients should also drop stored auth (e.g. localStorage)."""

    def post(self, request):
        django_auth_logout(request)
        return Response(
            {
                "message": "Logout successful.",
                "data": {},
            },
            status=status.HTTP_200_OK,
        )
