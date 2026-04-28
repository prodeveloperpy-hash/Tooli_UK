import django_filters

from tooli_uk_app.models.user import User


class UserFilter(django_filters.FilterSet):
    class Meta:
        model = User
        fields = "__all__"
