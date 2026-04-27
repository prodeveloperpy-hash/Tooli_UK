"""ASGI config for deployment (e.g. Vercel, uvicorn)."""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tooli_uk.settings")

application = get_asgi_application()
