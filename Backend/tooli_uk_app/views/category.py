from rest_framework import viewsets

from tooli_uk_app.filters.category import CategoryFilter
from tooli_uk_app.models import Category
from tooli_uk_app.paginations import CategoryPagination
from tooli_uk_app.serializers.category import CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("order_by")
    serializer_class = CategorySerializer
    filterset_class = CategoryFilter
    pagination_class = CategoryPagination
   