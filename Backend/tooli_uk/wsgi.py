"""WSGI config for traditional servers (e.g. Gunicorn)."""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tooli_uk.settings")

application = get_wsgi_application()
