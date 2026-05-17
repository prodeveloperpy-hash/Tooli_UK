import logging
import os
import threading

from django.core.mail import send_mail
from django.conf import settings

from django.db.models import Q

from tooli_uk_app.models import Equipment, User
from tooli_uk_app.services.superadmin import HARDCODED_SUPERADMIN_EMAIL

logger = logging.getLogger(__name__)


def _env_bool(name: str, default: bool) -> bool:
    value = os.getenv(name, "").strip().lower()
    if not value:
        return default
    return value in {"1", "true", "yes", "on"}


def _send_email_with_status(
    *,
    subject: str,
    message: str,
    recipients: list[str],
    log_context: str,
) -> bool:
    if not recipients:
        logger.warning("Email not sent (%s): recipient list is empty.", log_context)
        return False

    try:
        sent_count = send_mail(
            subject=subject,
            message=message,
            from_email=None,
            recipient_list=recipients,
            fail_silently=False,
        )
        if sent_count:
            logger.info(
                "Email sent (%s): recipients=%s subject=%s",
                log_context,
                ", ".join(recipients),
                subject,
            )
            return True
        logger.warning(
            "Email not sent (%s): recipients=%s subject=%s",
            log_context,
            ", ".join(recipients),
            subject,
        )
        return False
    except Exception:
        logger.exception("Email failed (%s).", log_context)
        return False


def _send_email_with_status_async(
    *,
    subject: str,
    message: str,
    recipients: list[str],
    log_context: str,
) -> None:
    threading.Thread(
        target=_send_email_with_status,
        kwargs={
            "subject": subject,
            "message": message,
            "recipients": recipients,
            "log_context": log_context,
        },
        daemon=True,
    ).start()


def _recipients_for_roles(
    *role_keys: str,
    always_include_hardcoded_superadmin: bool = False,
) -> list[str]:
    role_filter = Q()
    for role_key in role_keys:
        role_filter |= Q(role_id__role_key__iexact=role_key)

    db_emails: list[str] = []
    if role_filter:
        db_emails = list(
            User.objects.filter(role_filter, is_active=True)
            .exclude(email__isnull=True)
            .exclude(email__exact="")
            .values_list("email", flat=True)
        )

    deduped: set[str] = set()
    recipients: list[str] = []
    if always_include_hardcoded_superadmin:
        deduped.add(HARDCODED_SUPERADMIN_EMAIL.lower())
        recipients.append(HARDCODED_SUPERADMIN_EMAIL)

    for email in db_emails:
        lowered = email.lower()
        if lowered in deduped:
            continue
        deduped.add(lowered)
        recipients.append(email)
    return recipients


def _superadmin_recipients() -> list[str]:
    return _recipients_for_roles(
        "SUPERADMIN",
        always_include_hardcoded_superadmin=True,
    )


def _equipment_approval_recipients() -> list[str]:
    """SUPERADMIN + ADMIN users in DB, plus hardcoded superadmin email."""
    return _recipients_for_roles(
        "SUPERADMIN",
        "ADMIN",
        always_include_hardcoded_superadmin=True,
    )


def notify_new_supplier_for_approval(supplier_name: str, supplier_email: str, organization_name: str) -> None:
    recipients = _superadmin_recipients()
    supplier_approval_url = getattr(
        settings,
        "SUPPLIER_APPROVAL_URL",
        "https://frontend-service-961815749151.us-central1.run.app/dashboard",
    )
    subject = f"New supplier request for approval: {supplier_name}"
    message = (
        "A new supplier signup request is waiting for approval.\n\n"
        f"Supplier name: {supplier_name}\n"
        f"Supplier email: {supplier_email}\n"
        f"Organization: {organization_name}\n\n"
        "Please review and approve this supplier request.\n"
        f"Approval page: {supplier_approval_url}"
    )
    if _env_bool("EMAIL_SEND_ASYNC", True):
        _send_email_with_status_async(
            subject=subject,
            message=message,
            recipients=recipients,
            log_context="new_supplier_for_superadmin_approval",
        )
    else:
        _send_email_with_status(
            subject=subject,
            message=message,
            recipients=recipients,
            log_context="new_supplier_for_superadmin_approval",
        )


def notify_new_equipment_for_approval(
    *,
    equipment_id: int,
    equipment_name: str,
    organization_name: str = "",
    supplier_name: str = "",
    supplier_email: str = "",
) -> None:
    recipients = _equipment_approval_recipients()
    approval_url = getattr(
        settings,
        "EQUIPMENT_APPROVAL_URL",
        getattr(
            settings,
            "SUPPLIER_APPROVAL_URL",
            "https://frontend-service-961815749151.us-central1.run.app/dashboard",
        ),
    )
    subject = f"New equipment pending approval: {equipment_name}"
    message = (
        "New equipment has been submitted and is waiting for approval.\n\n"
        f"Equipment ID: {equipment_id}\n"
        f"Equipment name: {equipment_name}\n"
        f"Organization: {organization_name or '—'}\n"
        f"Submitted by: {supplier_name or '—'}\n"
        f"Supplier email: {supplier_email or '—'}\n\n"
        "Please review and approve this equipment listing.\n"
        f"Approval page: {approval_url}"
    )
    if _env_bool("EMAIL_SEND_ASYNC", True):
        _send_email_with_status_async(
            subject=subject,
            message=message,
            recipients=recipients,
            log_context="new_equipment_for_admin_approval",
        )
    else:
        _send_email_with_status(
            subject=subject,
            message=message,
            recipients=recipients,
            log_context="new_equipment_for_admin_approval",
        )


def schedule_notify_new_equipment_for_approval(equipment_id: int) -> None:
    """Enqueue approval email after the surrounding DB transaction commits."""

    def _on_commit() -> None:
        equipment = (
            Equipment.objects.select_related("organization_id", "created_by")
            .filter(pk=equipment_id)
            .first()
        )
        if equipment is None:
            logger.warning(
                "Equipment approval email skipped: equipment_id=%s not found.",
                equipment_id,
            )
            return

        creator = equipment.created_by
        supplier_name = ""
        supplier_email = ""
        if creator is not None:
            supplier_name = f"{creator.first_name} {creator.last_name}".strip()
            supplier_email = creator.email or ""

        org_name = ""
        if equipment.organization_id is not None:
            org_name = equipment.organization_id.name or ""

        notify_new_equipment_for_approval(
            equipment_id=equipment.equipment_id,
            equipment_name=equipment.name,
            organization_name=org_name,
            supplier_name=supplier_name,
            supplier_email=supplier_email,
        )

    from django.db import transaction

    transaction.on_commit(_on_commit)


def _equipment_supplier_recipient_emails(equipment: Equipment) -> list[str]:
    """Supplier contact(s) for an equipment listing (creator + org members)."""
    from tooli_uk_app.models.user_organization import UserOrganization

    deduped: set[str] = set()
    recipients: list[str] = []

    creator = equipment.created_by
    if creator and creator.email:
        email = creator.email.strip()
        if email:
            deduped.add(email.lower())
            recipients.append(email)

    if equipment.organization_id_id:
        links = (
            UserOrganization.objects.filter(
                organization_id_id=equipment.organization_id_id,
                is_active=True,
                role_id__role_key__iexact="SUPPLIER",
            )
            .select_related("user_id")
        )
        for link in links:
            user = link.user_id
            if not user or not user.email:
                continue
            email = user.email.strip()
            if not email:
                continue
            lowered = email.lower()
            if lowered in deduped:
                continue
            deduped.add(lowered)
            recipients.append(email)

    return recipients


def notify_equipment_approved(
    *,
    equipment_id: int,
    equipment_name: str,
    organization_name: str,
    recipient_emails: list[str],
) -> None:
    if not recipient_emails:
        logger.warning(
            "Equipment approved email skipped: no supplier email for equipment_id=%s.",
            equipment_id,
        )
        return

    dashboard_url = getattr(
        settings,
        "SUPPLIER_DASHBOARD_URL",
        getattr(
            settings,
            "SUPPLIER_APPROVAL_URL",
            "https://frontend-service-961815749151.us-central1.run.app/dashboard",
        ),
    )
    subject = f"Your equipment listing is approved: {equipment_name}"
    message = (
        "Good news — your equipment listing has been approved and is now live on Tooli UK.\n\n"
        f"Equipment: {equipment_name}\n"
        f"Equipment ID: {equipment_id}\n"
        f"Organization: {organization_name or '—'}\n\n"
        "You can sign in to manage your listings, update prices, and availability.\n"
        f"Supplier dashboard: {dashboard_url}\n\n"
        "Thank you for listing with Tooli UK."
    )
    if _env_bool("EMAIL_SEND_ASYNC", True):
        _send_email_with_status_async(
            subject=subject,
            message=message,
            recipients=recipient_emails,
            log_context="equipment_approved_supplier_notification",
        )
    else:
        _send_email_with_status(
            subject=subject,
            message=message,
            recipients=recipient_emails,
            log_context="equipment_approved_supplier_notification",
        )


def schedule_notify_equipment_approved(equipment_id: int) -> None:
    """Email supplier(s) after admin/superadmin sets is_approved=true."""

    def _on_commit() -> None:
        equipment = (
            Equipment.objects.select_related("organization_id", "created_by")
            .filter(pk=equipment_id)
            .first()
        )
        if equipment is None:
            logger.warning(
                "Equipment approved email skipped: equipment_id=%s not found.",
                equipment_id,
            )
            return

        recipients = _equipment_supplier_recipient_emails(equipment)
        org_name = ""
        if equipment.organization_id is not None:
            org_name = equipment.organization_id.name or ""

        notify_equipment_approved(
            equipment_id=equipment.equipment_id,
            equipment_name=equipment.name,
            organization_name=org_name,
            recipient_emails=recipients,
        )

    from django.db import transaction

    transaction.on_commit(_on_commit)


def notify_supplier_approved(
    supplier_name: str,
    supplier_email: str,
    organization_name: str,
) -> None:
    subject = "Your supplier account is approved"
    message = (
        f"Hi {supplier_name},\n\n"
        "Your supplier account has been created/approved by admin.\n"
        f"Organization: {organization_name}\n\n"
        "You can now log in to your account."
    )
    if _env_bool("EMAIL_SEND_ASYNC", True):
        _send_email_with_status_async(
            subject=subject,
            message=message,
            recipients=[supplier_email],
            log_context="supplier_approved_notification",
        )
    else:
        _send_email_with_status(
            subject=subject,
            message=message,
            recipients=[supplier_email],
            log_context="supplier_approved_notification",
        )
