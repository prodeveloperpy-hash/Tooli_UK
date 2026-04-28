from rest_framework import viewsets

from tooli_uk_app.filters.organization import OrganizationFilter
from tooli_uk_app.models import Organization
from tooli_uk_app.serializers.organization import OrganizationSerializer


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    filterset_class = OrganizationFilter
   