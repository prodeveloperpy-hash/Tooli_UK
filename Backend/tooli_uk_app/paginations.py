from rest_framework.pagination import PageNumberPagination


class BaseOptionalPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        raw = str(request.query_params.get("skip_pagination", "")).strip().lower()
        if raw in {"1", "true", "yes", "on"}:
            return None
        return super().paginate_queryset(queryset, request, view=view)


class EquipmentPagination(BaseOptionalPagination):
    pass


class UserPagination(BaseOptionalPagination):
    pass


class UserOrganizationPagination(BaseOptionalPagination):
    pass


class CategoryPagination(BaseOptionalPagination):
    pass


class LocationPagination(BaseOptionalPagination):
    pass


class OrganizationPagination(BaseOptionalPagination):
    pass
