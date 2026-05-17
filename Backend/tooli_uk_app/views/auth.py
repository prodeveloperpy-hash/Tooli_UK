import json

from django.contrib.auth import logout as django_auth_logout
from rest_framework import parsers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from tooli_uk_app.models import Organization, User
from tooli_uk_app.models.user_organization import UserOrganization
from tooli_uk_app.serializers.auth import LoginSerializer, SignupSerializer
from tooli_uk_app.serializers.organization import OrganizationSerializer
from tooli_uk_app.serializers.user import UserSerializer
from tooli_uk_app.services.superadmin import (
    HARDCODED_SUPERADMIN_EMAIL,
    HARDCODED_SUPERADMIN_FIRST_NAME,
    HARDCODED_SUPERADMIN_LAST_NAME,
    SUPERADMIN_ROLE_KEY,
)


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
                        '(same fields as JSON signup). Optional file fields: '
                        '"avatar" (profile photo), "organization_logo" (company logo).'
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
            avatar_file = request.FILES.get("avatar") or request.FILES.get("avatar_url")
            org_logo_file = request.FILES.get("organization_logo") or request.FILES.get(
                "logo"
            )
            serializer = SignupSerializer(
                data=body,
                context={
                    "request": request,
                    "avatar_file": avatar_file,
                    "organization_logo_file": org_logo_file,
                },
            )
        else:
            serializer = SignupSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        user = User.objects.get(pk=result["user_id"])
        organization = Organization.objects.get(pk=result["organization_id"])
        result["user"] = UserSerializer(user, context={"request": request}).data
        result["organization"] = OrganizationSerializer(
            organization, context={"request": request}
        ).data
        return Response(
            {
                "message": "Signup successful.",
                "data": result,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(APIView):
    @staticmethod
    def _organization_payload(request, organization):
        if organization is None:
            return {
                "id": None,
                "name": None,
                "logo": None,
            }
        org_data = OrganizationSerializer(organization, context={"request": request}).data
        return {
            "id": org_data.get("organization_id"),
            "name": org_data.get("name"),
            "logo": org_data.get("logo"),
        }

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.validated_data.get("is_hardcoded_superadmin"):
            return Response(
                {
                    "message": "Login successful.",
                    "data": {
                        "user": {
                            "user_id": None,
                            "first_name": HARDCODED_SUPERADMIN_FIRST_NAME,
                            "last_name": HARDCODED_SUPERADMIN_LAST_NAME,
                            "email": HARDCODED_SUPERADMIN_EMAIL,
                            "avatar_url": None,
                            "role_id": None,
                            "created_datetime": None,
                            "updated_datetime": None,
                            "created_by": None,
                            "updated_by": None,
                            "is_active": True,
                        },
                        "role_key": SUPERADMIN_ROLE_KEY,
                        "organization_id": None,
                        "organization": self._organization_payload(request, None),
                    },
                },
                status=status.HTTP_200_OK,
            )

        user = serializer.validated_data["user"]

        organization_link = (
            UserOrganization.objects.filter(user_id=user, is_active=True)
            .select_related("organization_id")
            .order_by("-user_organization_id")
            .first()
        )
        organization_id = organization_link.organization_id_id if organization_link else None
        organization_obj = (
            organization_link.organization_id
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
                    "organization": self._organization_payload(request, organization_obj),
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
