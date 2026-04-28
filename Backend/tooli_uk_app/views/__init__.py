from django.http import JsonResponse

from tooli_uk_app.views.auth import LoginAPIView, SignupAPIView
from tooli_uk_app.views.interval import IntervalViewSet


def health(request):
    return JsonResponse({"status": "ok"})


__all__ = (
    "health",
    "IntervalViewSet",
    "SignupAPIView",
    "LoginAPIView",
)
