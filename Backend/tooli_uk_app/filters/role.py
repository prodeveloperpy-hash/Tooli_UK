import django_filters

from tooli_uk_app.models.role import Role


class RoleFilter(django_filters.FilterSet):
    class Meta:
        model = Role
        fields = "__all__"
