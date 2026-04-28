import django_filters

from tooli_uk_app.filters.base import BasePartialFilterSet
from tooli_uk_app.models.category import Category


class CategoryFilter(BasePartialFilterSet):
    class Meta:
        model = Category
        fields = "__all__"
