import json

from rest_framework import status, viewsets
from rest_framework.response import Response

from tooli_uk_app.filters.user_organization import UserOrganizationFilter
from tooli_uk_app.models import UserOrganization
from tooli_uk_app.serializers.user_organization import (
    UserOrganizationMutateSerializer,
    UserOrganizationSerializer,
)


class UserOrganizationViewSet(viewsets.ModelViewSet):
    queryset = UserOrganization.objects.select_related(
        "user_id", "organization_id", "role_id"
    ).all()
    filterset_class = UserOrganizationFilter

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return UserOrganizationMutateSerializer
        return UserOrganizationSerializer

    def _read(self, instance, status_code=status.HTTP_200_OK):
        ser = UserOrganizationSerializer(instance, context=self.get_serializer_context())
        return Response(ser.data, status=status_code)

    def create(self, request, *args, **kwargs):
        if request.content_type and "multipart/form-data" in request.content_type:
            raw = request.data.get("payload")
            if raw is None or raw == "":
                return Response(
                    {
                        "detail": 'Multipart create needs a JSON string field "payload". '
                        'Optional files: "avatar" (user), "organization_logo" (org).'
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
            org_logo_file = request.FILES.get("organization_logo")
            serializer = self.get_serializer(
                data=body,
                context={
                    **self.get_serializer_context(),
                    "avatar_file": avatar_file,
                    "organization_logo": org_logo_file,
                },
            )
        else:
            data = request.data
            # Handle cases where JSON might be wrapped in a "payload" key (matching multipart pattern)
            if isinstance(data, dict) and "payload" in data and len(data) == 1:
                data = data["payload"]
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
        avatar_file = None
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
            avatar_file = request.FILES.get("avatar")
            org_logo_file = request.FILES.get("organization_logo")
        else:
            # Handle cases where JSON might be wrapped in a "payload" key
            if isinstance(data, dict) and "payload" in data and len(data) == 1:
                data = data["payload"]
            avatar_file = None
            org_logo_file = None
        serializer = self.get_serializer(
            instance,
            data=data,
            partial=partial,
            context={
                **self.get_serializer_context(),
                "avatar_file": avatar_file,
                "organization_logo": org_logo_file,
            },
        )
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return self._read(instance)
