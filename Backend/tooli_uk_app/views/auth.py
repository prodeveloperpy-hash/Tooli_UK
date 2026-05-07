import json

from django.contrib.auth import logout as django_auth_logout
from rest_framework import parsers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from tooli_uk_app.models import User
from tooli_uk_app.models.user_organization import UserOrganization
from tooli_uk_app.serializers.auth import LoginSerializer, SignupSerializer
from tooli_uk_app.serializers.user import UserSerializer


class SignupAPIView(APIView):
    parser_classes = [
        parsers.JSONParser,
        parsers.MultiPartParser,
        parsers.FormParser,
    ]

    def post(self, request):
        if request.content_type and "multipart/form-data" in request.content_type:
            raw = request.data.get("payload")
            if raw is None:
                return Response(
                    {
                        "detail": 'Multipart signup requires a JSON string field "payload" '
                        '(same fields as JSON signup). Optional file field "avatar".'
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
            avatar_file = request.FILES.get("avatar")
            serializer = SignupSerializer(
                data=body,
                context={"request": request, "avatar_file": avatar_file},
            )
        else:
            serializer = SignupSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        user = User.objects.get(pk=result["user_id"])
        result["user"] = UserSerializer(user, context={"request": request}).data
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

        organization_link = (
            UserOrganization.objects.filter(user_id=user, is_active=True)
            .select_related("organization_id")
            .order_by("user_organization_id")
            .first()
        )
        organization_id = organization_link.organization_id_id if organization_link else None
        organization_name = (
            organization_link.organization_id.name
            if organization_link and organization_link.organization_id_id
            else None
        )
        role_key = user.role_id.role_key if user.role_id_id else None

        return Response(
            {
                "message": "Login successful.",
                "data": {
                    "user": UserSerializer(user, context={"request": request}).data,
                    "role_key": role_key,
                    "organization_id": organization_id,
                    "organization": {
                        "id": organization_id,
                        "name": organization_name,
                    },
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
