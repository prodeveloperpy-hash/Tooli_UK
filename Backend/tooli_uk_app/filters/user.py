import django_filters

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.user import User


class UserFilter(BasePartialFilterSet):
    class Meta:
        model = User
        fields = "__all__"
