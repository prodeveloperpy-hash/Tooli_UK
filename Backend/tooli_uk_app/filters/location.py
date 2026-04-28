import django_filters

from tooli_uk_app.models.location import Location


class LocationFilter(django_filters.FilterSet):
    class Meta:
        model = Location
        fields = "__all__"
