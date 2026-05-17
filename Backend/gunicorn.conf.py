"""Gunicorn config tuned for Cloud Run memory limits."""

import os


def _env_int(name: str, default: int) -> int:
    value = os.getenv(name, "").strip()
    if not value:
        return default
    try:
        parsed = int(value)
    except ValueError:
        return default
    return parsed if parsed > 0 else default


bind = f"0.0.0.0:{os.getenv('PORT', '8080')}"

# Safer default for small Cloud Run memory; override via env if needed.
workers = _env_int("WEB_CONCURRENCY", 1)
threads = _env_int("GUNICORN_THREADS", 2)

timeout = _env_int("GUNICORN_TIMEOUT", 120)
graceful_timeout = _env_int("GUNICORN_GRACEFUL_TIMEOUT", 30)
keepalive = _env_int("GUNICORN_KEEPALIVE", 5)

# Recycle workers periodically to reduce memory growth over time.
max_requests = _env_int("GUNICORN_MAX_REQUESTS", 500)
max_requests_jitter = _env_int("GUNICORN_MAX_REQUESTS_JITTER", 50)

accesslog = "-"
errorlog = "-"
loglevel = os.getenv("GUNICORN_LOG_LEVEL", "info")
