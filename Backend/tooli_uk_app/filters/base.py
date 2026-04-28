import django_filters
from django.db import models


class BasePartialFilterSet(django_filters.FilterSet):
    """Apply partial filtering to all text fields by default."""

    class Meta:
        abstract = True
        filter_overrides = {
            models.CharField: {
                "filter_class": django_filters.CharFilter,
                "extra": lambda _: {"lookup_expr": "icontains"},
            },
            models.TextField: {
                "filter_class": django_filters.CharFilter,
                "extra": lambda _: {"lookup_expr": "icontains"},
            },
        }
