import django_filters

from tooli_uk_app.models.category import Category


class CategoryFilter(django_filters.FilterSet):
    class Meta:
        model = Category
        fields = "__all__"
