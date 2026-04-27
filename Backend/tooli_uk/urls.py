"""Site URLs. Interval API only via DefaultRouter → /api/interval/ …"""

from django.contrib import admin
from django.urls import include, path
from django.views.generic.base import RedirectView
from rest_framework.routers import DefaultRouter

from tooli_uk_app.views import health
from tooli_uk_app.views.interval import IntervalViewSet

router = DefaultRouter()
router.register("", IntervalViewSet)

urlpatterns = [
    path("interval/", include(router.urls)),
]