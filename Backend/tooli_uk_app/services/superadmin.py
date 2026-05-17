from django.contrib.auth.hashers import make_password
from django.utils import timezone

HARDCODED_SUPERADMIN_EMAIL = "info@tooli.uk"
HARDCODED_SUPERADMIN_PASSWORD = "T@@li2468uk"
HARDCODED_SUPERADMIN_FIRST_NAME = "Tooli"
HARDCODED_SUPERADMIN_LAST_NAME = ""
SUPERADMIN_ROLE_KEY = "SUPERADMIN"


def is_hardcoded_superadmin_login(email: str, password: str) -> bool:
    return (
        email.strip().lower() == HARDCODED_SUPERADMIN_EMAIL
        and password == HARDCODED_SUPERADMIN_PASSWORD
    )


def get_or_create_hardcoded_superadmin_user():
    """
    Hardcoded login still uses a real ``user`` row so FKs (equipment.created_by, etc.) work.
    """
    from tooli_uk_app.models.role import Role
    from tooli_uk_app.models.user import User

    role = Role.objects.filter(role_key__iexact=SUPERADMIN_ROLE_KEY).first()
    if role is None:
        raise RuntimeError(
            f"Role '{SUPERADMIN_ROLE_KEY}' was not found. Seed roles before using superadmin login."
        )

    now = timezone.now()
    user = User.objects.filter(email__iexact=HARDCODED_SUPERADMIN_EMAIL).select_related(
        "role_id"
    ).first()

    if user is not None:
        updates = []
        if not user.is_active:
            user.is_active = True
            updates.append("is_active")
        if user.role_id_id != role.role_id:
            user.role_id_id = role.role_id
            updates.append("role_id")
        if updates:
            user.updated_datetime = now
            updates.append("updated_datetime")
            user.save(update_fields=updates)
        return user

    user = User.objects.create(
        first_name=HARDCODED_SUPERADMIN_FIRST_NAME,
        last_name=HARDCODED_SUPERADMIN_LAST_NAME or "Admin",
        email=HARDCODED_SUPERADMIN_EMAIL,
        password=make_password(HARDCODED_SUPERADMIN_PASSWORD),
        role_id_id=role.role_id,
        is_active=True,
        created_datetime=now,
        updated_datetime=now,
    )
    user.created_by_id = user.user_id
    user.updated_by_id = user.user_id
    user.save(update_fields=["created_by", "updated_by"])
    return user


def is_superadmin_user_id(user_id: int | None) -> bool:
    if user_id is None:
        return False
    from tooli_uk_app.models.user import User

    user = (
        User.objects.filter(pk=user_id, is_active=True)
        .select_related("role_id")
        .first()
    )
    if user is None or user.role_id is None:
        return False
    return (user.role_id.role_key or "").upper() == SUPERADMIN_ROLE_KEY


def should_auto_approve_equipment(*, created_by_id: int | None, updated_by_id: int | None = None) -> bool:
    """SUPERADMIN-created equipment is approved immediately (no admin email)."""
    return is_superadmin_user_id(created_by_id) or is_superadmin_user_id(updated_by_id)
