from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from tooli_uk_app.filters.user import UserFilter
from tooli_uk_app.models import User
from tooli_uk_app.serializers.user import UserSerializer, _is_public_http_url
from tooli_uk_app.services import gcs_images


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filterset_class = UserFilter

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.FILES.get("avatar"):
            try:
                instance.avatar_url = gcs_images.upload_user_avatar(
                    request.FILES["avatar"], instance.pk
                )
                instance.save(update_fields=["avatar_url", "updated_datetime"])
            except RuntimeError as exc:
                return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        kwargs["partial"] = True
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=["get"], url_path="avatar")
    def avatar(self, request, pk=None):
        """Serve profile image from GCS or redirect for external ``avatar_url``."""
        user = get_object_or_404(User, pk=pk)
        raw = (user.avatar_url or "").strip()
        if not raw:
            return HttpResponse(status=404)
        if _is_public_http_url(raw):
            return HttpResponseRedirect(raw)
        try:
            payload = gcs_images.download_blob(raw)
        except RuntimeError:
            return HttpResponse(
                "Image storage is not configured.",
                status=503,
                content_type="text/plain",
            )
        if payload is None:
            return HttpResponse(status=404)
        data, content_type = payload
        response = HttpResponse(data, content_type=content_type)
        response["Cache-Control"] = "private, max-age=3600"
        return response
