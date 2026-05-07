"""Root URL configuration for Tooli UK API."""

from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from tooli_uk_app.views import health
from tooli_uk_app.views.category import CategoryViewSet
from tooli_uk_app.views.equipment import EquipmentViewSet
from tooli_uk_app.views.equipment_availablility import EquipmentAvailabilityViewSet
from tooli_uk_app.views.equipment_image import EquipmentImageViewSet
from tooli_uk_app.views.equipment_location import EquipmentLocationViewSet
from tooli_uk_app.views.equipment_price import EquipmentPriceViewSet
from tooli_uk_app.views.equipment_create import (
    CreateEquipmentAPIView,
    CreateEquipmentDetailAPIView,
)
from tooli_uk_app.views.interval import IntervalViewSet
from tooli_uk_app.views.location import LocationViewSet
from tooli_uk_app.views.organization import OrganizationViewSet
from tooli_uk_app.views.role import RoleViewSet
from tooli_uk_app.views.auth import LoginAPIView, LogoutAPIView, SignupAPIView
from tooli_uk_app.views.user import UserViewSet
from tooli_uk_app.views.user_organization import UserOrganizationViewSet

router = DefaultRouter()
router.register("category", CategoryViewSet, basename="category")
router.register("interval", IntervalViewSet, basename="interval")
router.register("location", LocationViewSet, basename="location")
router.register("organization", OrganizationViewSet, basename="organization")
router.register("roles", RoleViewSet, basename="role")
router.register("user", UserViewSet, basename="user")
router.register("user-organization", UserOrganizationViewSet, basename="user-organization")
router.register("equipment", EquipmentViewSet, basename="equipment")
router.register("equipment-availability", EquipmentAvailabilityViewSet, basename="equipment-availability")
router.register("equipment-image", EquipmentImageViewSet, basename="equipment-image")
router.register("equipment-location", EquipmentLocationViewSet, basename="equipment-location")
router.register("equipment-price", EquipmentPriceViewSet, basename="equipment-price")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health, name="health"),
    path("signup/", SignupAPIView.as_view(), name="signup"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("create-equipment/", CreateEquipmentAPIView.as_view(), name="create_equipment"),
    path(
        "create_equipment/<int:equipment_id>/",
        CreateEquipmentDetailAPIView.as_view(),
        name="create_equipment_detail",
    ),
    path(
        "create-equipment/<int:equipment_id>/",
        CreateEquipmentDetailAPIView.as_view(),
        name="create_equipment_detail_hyphen",
    ),
    path("", include(router.urls)),
]
