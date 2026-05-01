from rest_framework import viewsets

from tooli_uk_app.filters.user_organization import UserOrganizationFilter
from tooli_uk_app.models import UserOrganization
from tooli_uk_app.serializers.user_organization import UserOrganizationSerializer

class UserOrganizationViewSet(viewsets.ModelViewSet):
    queryset = UserOrganization.objects.all()
    serializer_class = UserOrganizationSerializer
    filterset_class = UserOrganizationFilter
 