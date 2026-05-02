from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action

from tooli_uk_app.filters.equipment_image import EquipmentImageFilter
from tooli_uk_app.models import EquipmentImage
from tooli_uk_app.serializers.equipment_image import EquipmentImageSerializer
from tooli_uk_app.services import gcs_images


def _is_public_http_url(value: str) -> bool:
    v = (value or "").strip().lower()
    return v.startswith("http://") or v.startswith("https://")


class EquipmentImageViewSet(viewsets.ModelViewSet):
    queryset = EquipmentImage.objects.all()
    serializer_class = EquipmentImageSerializer
    filterset_class = EquipmentImageFilter

    @action(detail=True, methods=["get"], url_path="content")
    def content(self, request, pk=None):
        """Serve bytes from GCS (private bucket) or redirect for legacy public URLs."""
        obj = get_object_or_404(EquipmentImage, pk=pk)
        raw = (obj.image_url or "").strip()
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
