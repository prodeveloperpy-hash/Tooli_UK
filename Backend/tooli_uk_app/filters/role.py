import django_filters

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.role import Role


class RoleFilter(BasePartialFilterSet):
    class Meta:
        model = Role
        fields = "__all__"
