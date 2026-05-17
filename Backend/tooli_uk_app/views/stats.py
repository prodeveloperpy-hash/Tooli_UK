from django.db.models import Count
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from tooli_uk_app.models import Category, Equipment, EquipmentLocation, Location, User, UserOrganization


class StatsAPIView(APIView):
    """
    Dashboard stats:
    - total equipment
    - today's equipment
    - total categories
    - total locations
    - total admins
    - total suppliers
    - category-wise equipment totals
    Optional query param:
    - organization_id: scope stats to one organization only
    """

    def get(self, request):
        organization_id_raw = request.query_params.get("organization_id")
        # Backward compatibility for older clients that still send supplier_id.
        if organization_id_raw in (None, ""):
            organization_id_raw = request.query_params.get("supplier_id")
        organization_ids = None
        scope = "global"
        organization_id = None
        if organization_id_raw not in (None, ""):
            try:
                organization_id = int(organization_id_raw)
            except (TypeError, ValueError):
                return Response(
                    {"detail": "organization_id must be an integer."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if not UserOrganization.objects.filter(
                organization_id_id=organization_id,
                is_active=True,
            ).exists():
                return Response(
                    {
                        "detail": "No active organization found for organization_id.",
                        "organization_id": organization_id,
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            organization_ids = [organization_id]
            scope = "organization"

        today = timezone.localdate()

        equipment_qs = Equipment.objects.all()
        if organization_ids is not None:
            equipment_qs = equipment_qs.filter(organization_id_id__in=organization_ids)

        total_equipment = equipment_qs.count()
        today_equipment = equipment_qs.filter(created_datetime__date=today).count()

        if organization_ids is None:
            total_categories = Category.objects.count()
            total_admins = User.objects.filter(
                role_id__role_key__iexact="ADMIN",
                is_active=True,
            ).count()
            total_suppliers = User.objects.filter(
                role_id__role_key__iexact="SUPPLIER",
                is_active=True,
            ).count()
        else:
            total_categories = (
                equipment_qs.exclude(category_id__isnull=True)
                .values("category_id_id")
                .distinct()
                .count()
            )
            org_user_links = UserOrganization.objects.filter(
                organization_id_id__in=organization_ids,
                is_active=True,
            )
            total_admins = (
                org_user_links.filter(role_id__role_key__iexact="ADMIN")
                .values("user_id_id")
                .distinct()
                .count()
            )
            total_suppliers = (
                org_user_links.filter(role_id__role_key__iexact="SUPPLIER")
                .values("user_id_id")
                .distinct()
                .count()
            )

        if organization_ids is None:
            total_locations = Location.objects.filter(is_active=True).count()
        else:
            equipment_ids_subquery = equipment_qs.values("equipment_id")
            total_locations = (
                EquipmentLocation.objects.filter(equipment_id_id__in=equipment_ids_subquery)
                .values("location_id_id")
                .distinct()
                .count()
            )

        category_counts_qs = Category.objects.all()
        if organization_ids is not None:
            category_counts_qs = category_counts_qs.filter(
                equipment_items__organization_id_id__in=organization_ids
            )
        category_counts_qs = (
            category_counts_qs.annotate(equipment_count=Count("equipment_items"))
            .values(
                "category_id",
                "category_key",
                "category_display_name",
                "equipment_count",
            )
            .order_by("category_display_name")
        )
        category_equipment_counts = list(category_counts_qs)

        uncategorized_count = equipment_qs.filter(category_id__isnull=True).count()
        if uncategorized_count:
            category_equipment_counts.append(
                {
                    "category_id": None,
                    "category_key": "UNCATEGORIZED",
                    "category_display_name": "Uncategorized",
                    "equipment_count": uncategorized_count,
                }
            )

        return Response(
            {
                "scope": scope,
                "organization_id": organization_id,
                "organization_ids": organization_ids or [],
                "today": str(today),
                "total_equipment": total_equipment,
                "today_equipment": today_equipment,
                "total_categories": total_categories,
                "total_locations": total_locations,
                "total_admins": total_admins,
                "total_suppliers": total_suppliers,
                "category_equipment_counts": category_equipment_counts,
            }
        )
