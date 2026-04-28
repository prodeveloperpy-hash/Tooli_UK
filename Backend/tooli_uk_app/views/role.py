from rest_framework import viewsets

from tooli_uk_app.filters.role import RoleFilter
from tooli_uk_app.models import Role
from tooli_uk_app.serializers.role import RoleSerializer


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    filterset_class = RoleFilter
     