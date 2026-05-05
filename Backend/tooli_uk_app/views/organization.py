import json

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from rest_framework import parsers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from tooli_uk_app.filters.organization import OrganizationFilter
from tooli_uk_app.models import Organization
from tooli_uk_app.serializers.organization import OrganizationSerializer
from tooli_uk_app.services import gcs_images


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    filterset_class = OrganizationFilter
    parser_classes = [
        parsers.JSONParser,
        parsers.MultiPartParser,
        parsers.FormParser,
    ]

    def _parse_body(self, request):
        if request.content_type and "multipart/form-data" in request.content_type:
            raw = request.data.get("payload")
            if raw is None or raw == "":
                return {}
            if isinstance(raw, (bytes, bytearray)):
                raw = raw.decode()
            try:
                return json.loads(raw)
            except json.JSONDecodeError as exc:
                raise ValueError(f"Invalid payload JSON: {exc}") from exc
        return request.data

    def create(self, request, *args, **kwargs):
        try:
            data = self._parse_body(request)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        instance = serializer.instance
        logo_file = request.FILES.get("logo")
        if logo_file:
            try:
                instance.logo = gcs_images.upload_organization_logo(logo_file, instance.pk)
                instance.save(update_fields=["logo", "updated_datetime"])
            except RuntimeError as exc:
                return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        instance.refresh_from_db()
        out = OrganizationSerializer(instance, context={"request": request})
        headers = self.get_success_headers(out.data)
        return Response(out.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        try:
            data = self._parse_body(request)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        instance.refresh_from_db()
        logo_file = request.FILES.get("logo")
        if logo_file:
            try:
                instance.logo = gcs_images.upload_organization_logo(logo_file, instance.pk)
                instance.save(update_fields=["logo", "updated_datetime"])
            except RuntimeError as exc:
                return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        instance.refresh_from_db()
        out = OrganizationSerializer(instance, context={"request": request})
        return Response(out.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    @action(detail=True, methods=["get"], url_path="logo")
    def logo(self, request, pk=None):
        """Serve org logo via API (GCS with SA/ADC or local); redirect only external URLs."""
        org = get_object_or_404(Organization, pk=pk)
        raw = (org.logo or "").strip()
        if not raw:
            return HttpResponse(status=404)
        try:
            payload = gcs_images.read_stored_image(raw)
        except RuntimeError:
            return HttpResponse(
                "Image storage is not configured.",
                status=503,
                content_type="text/plain",
            )
        except Exception as exc:  # e.g. GCS client / credentials
            return HttpResponse(
                f"Image storage error: {exc}",
                status=503,
                content_type="text/plain",
            )
        if payload is not None:
            data, content_type = payload
            response = HttpResponse(data, content_type=content_type)
            response["Cache-Control"] = "private, max-age=3600"
            return response
        if gcs_images.is_external_public_image_url(raw):
            return HttpResponseRedirect(raw)
        return HttpResponse(status=404)
