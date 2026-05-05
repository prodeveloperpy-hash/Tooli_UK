"""Upload and read images from GCS (private bucket, service account / ADC) or local media."""

from __future__ import annotations

import mimetypes
import uuid
from pathlib import Path
from typing import TYPE_CHECKING
from urllib.parse import unquote, urlparse

from django.conf import settings

try:
    import requests
except ImportError:  # pragma: no cover
    requests = None  # type: ignore[assignment]

if TYPE_CHECKING:
    from django.core.files.uploadedfile import UploadedFile

# Stored in DB; served only through API views that stream bytes (never public bucket URLs).
LOCAL_STORAGE_PREFIX = "local:"


def _gcs_uploads_enabled() -> bool:
    return bool(getattr(settings, "GCS_UPLOAD_ENABLED", True))


def _bucket_name() -> str:
    name = getattr(settings, "GCS_IMAGE_BUCKET", None) or ""
    if not name:
        raise RuntimeError("GCS_IMAGE_BUCKET is not configured.")
    return name


def _gcs_http_timeout_seconds() -> float:
    return float(getattr(settings, "GCS_HTTP_TIMEOUT_SECONDS", 300) or 300)


def _upload_blob_from_bytes(blob, data: bytes, content_type: str) -> None:
    """Upload with configurable timeout; map network timeouts to ``RuntimeError`` for API layers."""
    timeout = _gcs_http_timeout_seconds()
    try:
        blob.upload_from_string(data, content_type=content_type, timeout=timeout)
    except TypeError:
        blob.upload_from_string(data, content_type=content_type)
    except Exception as exc:
        if requests is not None and isinstance(
            exc,
            (
                TimeoutError,
                requests.exceptions.ConnectionError,
                requests.exceptions.Timeout,
                requests.exceptions.ChunkedEncodingError,
            ),
        ):
            raise RuntimeError(
                "Google Cloud Storage upload timed out or the connection dropped. "
                "Try a smaller file, a stable network (or VPN off/on), or increase "
                f"GCS_HTTP_TIMEOUT_SECONDS (seconds; currently {int(timeout)})."
            ) from exc
        raise


def _client():
    """Storage client: optional JSON key file, else Application Default Credentials."""
    from google.cloud import storage
    from google.oauth2 import service_account

    path = getattr(settings, "GCS_SERVICE_ACCOUNT_FILE", None)
    if path:
        p = Path(str(path))
        if p.is_file():
            creds = service_account.Credentials.from_service_account_file(str(p))
            project = getattr(settings, "GCP_PROJECT_ID", None) or creds.project_id
            return storage.Client(project=project, credentials=creds)
    return storage.Client()


def parse_http_gcs_object(url: str, expected_bucket: str | None = None) -> str | None:
    """If ``url`` is a GCS HTTPS URL for ``expected_bucket``, return the object name."""
    bucket = expected_bucket or _bucket_name()
    p = urlparse((url or "").strip())
    if p.scheme.lower() not in ("http", "https"):
        return None
    host = (p.netloc or "").lower()
    path = unquote((p.path or "").lstrip("/"))
    b = bucket.lower()
    if host == "storage.googleapis.com":
        parts = path.split("/", 1)
        if len(parts) == 2 and parts[0].lower() == b:
            return parts[1]
        return None
    if host == "storage.cloud.google.com":
        parts = path.split("/", 1)
        if len(parts) == 2 and parts[0].lower() == b:
            return parts[1]
        return None
    if host == f"{b}.storage.googleapis.com":
        return path or None
    return None


def _storage_key_for_gcs_fetch(raw: str) -> str | None:
    """Map a DB value to a GCS object name for this app's bucket, or None if not in-bucket."""
    s = (raw or "").strip()
    if not s or s.startswith(LOCAL_STORAGE_PREFIX):
        return None
    low = s.lower()
    if low.startswith("gs://"):
        rest = s[5:]
        if "/" not in rest:
            return None
        bucket, _, obj = rest.partition("/")
        if bucket != _bucket_name():
            return None
        return obj
    if low.startswith(("http://", "https://")):
        return parse_http_gcs_object(s)
    return s


def should_use_api_url_in_json(stored: str) -> bool:
    """True when API JSON should expose our proxy URL instead of the raw stored value."""
    s = (stored or "").strip()
    if not s:
        return False
    if s.startswith(LOCAL_STORAGE_PREFIX):
        return True
    low = s.lower()
    if low.startswith("gs://"):
        return _storage_key_for_gcs_fetch(s) is not None
    if low.startswith(("http://", "https://")):
        return parse_http_gcs_object(s) is not None
    return True


def is_external_public_image_url(url: str) -> bool:
    """HTTPS URL that is not this app's GCS object (e.g. CDN / third-party)."""
    u = (url or "").strip()
    low = u.lower()
    if not low.startswith(("http://", "https://")):
        return False
    return parse_http_gcs_object(u) is None


def read_stored_image(stored: str) -> tuple[bytes, str] | None:
    """Streamable image bytes for API responses: local prefix, GCS object, or GCS HTTPS URL."""
    raw = (stored or "").strip()
    if not raw:
        return None
    if raw.startswith(LOCAL_STORAGE_PREFIX):
        return download_blob(raw)
    key = _storage_key_for_gcs_fetch(raw)
    if key is None:
        return None
    return download_blob(key)


def _guess_extension(filename: str | None, content_type: str | None) -> str:
    if filename and "." in filename:
        ext = filename.rsplit(".", 1)[-1].lower()
        if ext in {"jpg", "jpeg", "png", "gif", "webp", "avif", "heic", "bmp"}:
            return f".{ext}"
    if content_type:
        ext = mimetypes.guess_extension(content_type.split(";")[0].strip()) or ""
        if ext == ".jpe":
            ext = ".jpeg"
        if ext:
            return ext
    return ".bin"


def _media_root() -> Path:
    root = getattr(settings, "MEDIA_ROOT", None)
    if root is None:
        return Path(settings.BASE_DIR) / "media"
    return Path(root)


def _safe_local_path(relative_posix: str) -> Path | None:
    """Resolve ``relative_posix`` under MEDIA_ROOT; reject path traversal."""
    root = _media_root().resolve()
    candidate = (root / Path(relative_posix)).resolve()
    try:
        candidate.relative_to(root)
    except ValueError:
        return None
    return candidate


def _save_local_file(relative_posix: str, data: bytes) -> str:
    path = _safe_local_path(relative_posix)
    if path is None:
        raise ValueError("Invalid storage path.")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return f"{LOCAL_STORAGE_PREFIX}{relative_posix}"


def upload_user_avatar(uploaded_file: UploadedFile, user_id: int) -> str:
    """Store profile image; return value for ``User.avatar_url``."""
    content_type = getattr(uploaded_file, "content_type", None) or "application/octet-stream"
    ext = _guess_extension(getattr(uploaded_file, "name", None), content_type)
    relative = f"uploads/users/{user_id}/{uuid.uuid4().hex}{ext}".replace("\\", "/")

    if not _gcs_uploads_enabled():
        data = uploaded_file.read()
        return _save_local_file(relative, data)

    object_name = f"users/{user_id}/{uuid.uuid4().hex}{ext}"
    bucket = _client().bucket(_bucket_name())
    blob = bucket.blob(object_name)
    data = uploaded_file.read()
    _upload_blob_from_bytes(blob, data, content_type)
    return object_name


def upload_organization_logo(uploaded_file: UploadedFile, organization_id: int) -> str:
    """Store org logo; return value for ``Organization.logo``."""
    content_type = getattr(uploaded_file, "content_type", None) or "application/octet-stream"
    ext = _guess_extension(getattr(uploaded_file, "name", None), content_type)
    relative = f"uploads/organizations/{organization_id}/{uuid.uuid4().hex}{ext}".replace(
        "\\", "/"
    )

    if not _gcs_uploads_enabled():
        data = uploaded_file.read()
        return _save_local_file(relative, data)

    object_name = f"organizations/{organization_id}/{uuid.uuid4().hex}{ext}"
    bucket = _client().bucket(_bucket_name())
    blob = bucket.blob(object_name)
    data = uploaded_file.read()
    _upload_blob_from_bytes(blob, data, content_type)
    return object_name


def upload_equipment_image(uploaded_file: UploadedFile, equipment_id: int) -> str:
    """Store equipment image; return value for ``EquipmentImage.image_url``."""
    content_type = getattr(uploaded_file, "content_type", None) or "application/octet-stream"
    ext = _guess_extension(getattr(uploaded_file, "name", None), content_type)
    relative = f"uploads/equipment/{equipment_id}/{uuid.uuid4().hex}{ext}".replace("\\", "/")

    if not _gcs_uploads_enabled():
        data = uploaded_file.read()
        return _save_local_file(relative, data)

    object_name = f"equipment/{equipment_id}/{uuid.uuid4().hex}{ext}"
    bucket = _client().bucket(_bucket_name())
    blob = bucket.blob(object_name)
    data = uploaded_file.read()
    _upload_blob_from_bytes(blob, data, content_type)
    return object_name


def blob_exists(object_name: str) -> bool:
    raw = (object_name or "").strip()
    if raw.startswith(LOCAL_STORAGE_PREFIX):
        rel = raw[len(LOCAL_STORAGE_PREFIX) :]
        path = _safe_local_path(rel)
        return path is not None and path.is_file()
    key = _storage_key_for_gcs_fetch(raw)
    if key is None:
        return False
    bucket = _client().bucket(_bucket_name())
    blob = bucket.blob(key)
    return blob.exists()


def download_blob(object_name: str) -> tuple[bytes, str] | None:
    """Load bytes and content type, or ``None`` if missing."""
    raw = (object_name or "").strip()
    if not raw:
        return None

    if raw.startswith(LOCAL_STORAGE_PREFIX):
        rel = raw[len(LOCAL_STORAGE_PREFIX) :]
        path = _safe_local_path(rel)
        if path is None or not path.is_file():
            return None
        ctype = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        return path.read_bytes(), ctype

    bucket = _client().bucket(_bucket_name())
    blob = bucket.blob(raw)
    if not blob.exists():
        return None
    blob.reload()
    content_type = blob.content_type or "application/octet-stream"
    timeout = _gcs_http_timeout_seconds()
    try:
        body = blob.download_as_bytes(timeout=timeout)
    except TypeError:
        body = blob.download_as_bytes()
    return body, content_type
