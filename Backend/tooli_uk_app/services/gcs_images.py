"""Upload and read equipment images from a private GCS bucket (service account / ADC)."""

from __future__ import annotations

import mimetypes
import uuid
from typing import TYPE_CHECKING

from django.conf import settings

if TYPE_CHECKING:
    from django.core.files.uploadedfile import UploadedFile


def _bucket_name() -> str:
    name = getattr(settings, "GCS_IMAGE_BUCKET", None) or ""
    if not name:
        raise RuntimeError("GCS_IMAGE_BUCKET is not configured.")
    return name


def _client():
    from google.cloud import storage

    return storage.Client()


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


def upload_user_avatar(uploaded_file: UploadedFile, user_id: int) -> str:
    """Upload profile image; return GCS object name stored in ``User.avatar_url``."""
    content_type = getattr(uploaded_file, "content_type", None) or "application/octet-stream"
    ext = _guess_extension(getattr(uploaded_file, "name", None), content_type)
    object_name = f"users/{user_id}/{uuid.uuid4().hex}{ext}"

    bucket = _client().bucket(_bucket_name())
    blob = bucket.blob(object_name)
    data = uploaded_file.read()
    blob.upload_from_string(data, content_type=content_type)
    return object_name


def upload_equipment_image(uploaded_file: UploadedFile, equipment_id: int) -> str:
    """Upload file to GCS; return object name stored in ``EquipmentImage.image_url``."""
    content_type = getattr(uploaded_file, "content_type", None) or "application/octet-stream"
    ext = _guess_extension(getattr(uploaded_file, "name", None), content_type)
    object_name = f"equipment/{equipment_id}/{uuid.uuid4().hex}{ext}"

    bucket = _client().bucket(_bucket_name())
    blob = bucket.blob(object_name)
    data = uploaded_file.read()
    blob.upload_from_string(data, content_type=content_type)
    return object_name


def blob_exists(object_name: str) -> bool:
    bucket = _client().bucket(_bucket_name())
    blob = bucket.blob(object_name)
    return blob.exists()


def download_blob(object_name: str) -> tuple[bytes, str] | None:
    """Download object bytes and content type, or ``None`` if missing."""
    bucket = _client().bucket(_bucket_name())
    blob = bucket.blob(object_name)
    if not blob.exists():
        return None
    blob.reload()
    content_type = blob.content_type or "application/octet-stream"
    return blob.download_as_bytes(), content_type
