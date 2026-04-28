import django_filters

from tooli_uk_app.models.user_organization import UserOrganization


class UserOrganizationFilter(django_filters.FilterSet):
    class Meta:
        model = UserOrganization
        fields = "__all__"
