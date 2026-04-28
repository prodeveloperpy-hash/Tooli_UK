import django_filters

from tooli_uk_app.models.organization import Organization


class OrganizationFilter(django_filters.FilterSet):
    class Meta:
        model = Organization
        fields = "__all__"
