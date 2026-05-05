"""Django settings for Tooli UK backend."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django.request": {
            "handlers": ["console"],
            "level": "ERROR",
            "propagate": False,
        },
    },
}

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "replace-this-with-a-strong-static-secret-key",
)

DEBUG = False

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "django_filters",
    "corsheaders",
    "tooli_uk_app",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "tooli_uk.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "tooli_uk.wsgi.application"

# Cloud Run: attach Cloud SQL in the service, then use the Unix socket (not the public IP).
# https://cloud.google.com/sql/docs/postgres/connect-run
_CLOUD_SQL_CONN = "project-ad3f785e-ea3f-4bb9-927:us-central1:tooli-db"
_use_cloud_sql_socket = os.environ.get("K_SERVICE") is not None

if _use_cloud_sql_socket:
    _db_host = f"/cloudsql/{_CLOUD_SQL_CONN}"
    _db_options = {"options": "-c search_path=portal"}
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": "tooli_db",
            "USER": "app_user",
            "PASSWORD": "P@ncake2026",
            "HOST": _db_host,
            "OPTIONS": _db_options,
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": "tooli_db",
            "USER": "app_user",
            "PASSWORD": "P@ncake2026",
            "HOST": "35.239.103.53",
            "PORT": "5432",
            "OPTIONS": {
                "options": "-c search_path=portal",
                "connect_timeout": 50,
            },
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-gb"
TIME_ZONE = "Europe/London"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Local uploads (when GCS uploads are disabled) — e.g. Windows dev without ADC.
MEDIA_ROOT = BASE_DIR / "media"
MEDIA_URL = "/media/"

# Private GCS bucket for images; Cloud Run should use the runtime service account (ADC).
GCS_IMAGE_BUCKET = os.environ.get("GCS_IMAGE_BUCKET", "tooli-uk-images")

# Optional path to a service account JSON key. If unset, ``google.cloud.storage.Client``
# uses Application Default Credentials (recommended on Cloud Run with the deploy SA).
_gcs_sa = os.environ.get("GCS_SERVICE_ACCOUNT_FILE") or os.environ.get(
    "GOOGLE_APPLICATION_CREDENTIALS", ""
)
GCS_SERVICE_ACCOUNT_FILE = _gcs_sa.strip() or None
GCP_PROJECT_ID = os.environ.get("GCP_PROJECT_ID", "").strip() or None

# When False, multipart uploads go to MEDIA_ROOT (offline dev only). Default: always GCS.
# Set GCS_UPLOAD_ENABLED=false only if you run locally without GCP credentials.
GCS_UPLOAD_ENABLED = os.environ.get("GCS_UPLOAD_ENABLED", "true").lower() in (
    "1",
    "true",
    "yes",
)

# API supports JSON and DRF Browsable API form testing.
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
}

CORS_ALLOWED_ORIGINS = [
    "https://frontend-service-961815749151.us-central1.run.app",
    "http://localhost:5173",
]

CSRF_TRUSTED_ORIGINS = [
    "https://frontend-service-961815749151.us-central1.run.app",
    "http://localhost:5173",
]
