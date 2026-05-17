import logging
import os
import threading

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.db.models import Q

from tooli_uk_app.models import Equipment, User
from tooli_uk_app.services.email_templates import render_tooli_email
from tooli_uk_app.services.superadmin import HARDCODED_SUPERADMIN_EMAIL

logger = logging.getLogger(__name__)


def _env_bool(name: str, default: bool) -> bool:
    value = os.getenv(name, "").strip().lower()
    if not value:
        return default
    return value in {"1", "true", "yes", "on"}


def _from_email() -> str:
    display = getattr(settings, "EMAIL_FROM_NAME", "Tooli UK") or "Tooli UK"
    address = getattr(settings, "DEFAULT_FROM_EMAIL", None) or "info@tooli.uk"
    if "<" in address:
        return address
    return f"{display} <{address}>"


def _reply_to() -> list[str]:
    support = getattr(settings, "EMAIL_SUPPORT_ADDRESS", None) or getattr(
        settings, "DEFAULT_FROM_EMAIL", None
    )
    return [support] if support else []


def _send_email_with_status(
    *,
    subject: str,
    plain_message: str,
    html_message: str,
    recipients: list[str],
    log_context: str,
) -> bool:
    if not recipients:
        logger.warning("Email not sent (%s): recipient list is empty.", log_context)
        return False

    try:
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=_from_email(),
            to=recipients,
            reply_to=_reply_to(),
        )
        email.attach_alternative(html_message, "text/html")
        sent_count = email.send(fail_silently=False)
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
    plain_message: str,
    html_message: str,
    recipients: list[str],
    log_context: str,
) -> None:
    threading.Thread(
        target=_send_email_with_status,
        kwargs={
            "subject": subject,
            "plain_message": plain_message,
            "html_message": html_message,
            "recipients": recipients,
            "log_context": log_context,
        },
        daemon=True,
    ).start()


def _dispatch_email(
    *,
    subject: str,
    plain_message: str,
    html_message: str,
    recipients: list[str],
    log_context: str,
) -> None:
    if _env_bool("EMAIL_SEND_ASYNC", True):
        _send_email_with_status_async(
            subject=subject,
            plain_message=plain_message,
            html_message=html_message,
            recipients=recipients,
            log_context=log_context,
        )
    else:
        _send_email_with_status(
            subject=subject,
            plain_message=plain_message,
            html_message=html_message,
            recipients=recipients,
            log_context=log_context,
        )


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
    return _recipients_for_roles(
        "SUPERADMIN",
        "ADMIN",
        always_include_hardcoded_superadmin=True,
    )


def notify_new_supplier_for_approval(
    supplier_name: str, supplier_email: str, organization_name: str
) -> None:
    recipients = _superadmin_recipients()
    approval_url = getattr(
        settings,
        "SUPPLIER_APPROVAL_URL",
        "https://frontend-service-961815749151.us-central1.run.app/dashboard",
    )
    subject = f"New supplier request — {supplier_name}"
    html, plain = render_tooli_email(
        preheader=f"New supplier signup: {organization_name} is waiting for your review.",
        headline="New supplier awaiting approval",
        intro="A new supplier has registered on Tooli UK and is waiting for admin approval.",
        detail_rows=[
            ("Supplier name", supplier_name),
            ("Email", supplier_email),
            ("Organization", organization_name),
        ],
        body_paragraphs=[
            "Please review their details and approve or reject the account from your dashboard.",
        ],
        cta_label="Review supplier request",
        cta_url=approval_url,
        badge_label="Action required",
        badge_tone="warning",
    )
    _dispatch_email(
        subject=subject,
        plain_message=plain,
        html_message=html,
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
    subject = f"New equipment listing — {equipment_name}"
    html, plain = render_tooli_email(
        preheader=f"Equipment #{equipment_id} ({equipment_name}) needs approval.",
        headline="New equipment pending approval",
        intro="A supplier has submitted a new equipment listing that requires your review.",
        detail_rows=[
            ("Equipment ID", str(equipment_id)),
            ("Equipment name", equipment_name),
            ("Organization", organization_name or "—"),
            ("Submitted by", supplier_name or "—"),
            ("Supplier email", supplier_email or "—"),
        ],
        body_paragraphs=[
            "Approve the listing to make it visible to customers on the marketplace.",
        ],
        cta_label="Review equipment listing",
        cta_url=approval_url,
        badge_label="Pending review",
        badge_tone="warning",
    )
    _dispatch_email(
        subject=subject,
        plain_message=plain,
        html_message=html,
        recipients=recipients,
        log_context="new_equipment_for_admin_approval",
    )


def schedule_notify_new_equipment_for_approval(equipment_id: int) -> None:
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
        links = UserOrganization.objects.filter(
            organization_id_id=equipment.organization_id_id,
            is_active=True,
            role_id__role_key__iexact="SUPPLIER",
        ).select_related("user_id")
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
    subject = f"Your equipment is approved — {equipment_name}"
    html, plain = render_tooli_email(
        preheader=f"Great news: {equipment_name} is now live on Tooli UK.",
        headline="Equipment listing approved",
        greeting="Hello,",
        body_paragraphs=[
            "Your equipment listing has been reviewed and approved. "
            "It is now visible to customers on the Tooli UK marketplace.",
            "You can sign in at any time to update prices, photos, and availability.",
        ],
        detail_rows=[
            ("Equipment", equipment_name),
            ("Equipment ID", str(equipment_id)),
            ("Organization", organization_name or "—"),
        ],
        cta_label="Open supplier dashboard",
        cta_url=dashboard_url,
        badge_label="Approved",
        badge_tone="success",
    )
    _dispatch_email(
        subject=subject,
        plain_message=plain,
        html_message=html,
        recipients=recipient_emails,
        log_context="equipment_approved_supplier_notification",
    )


def schedule_notify_equipment_approved(equipment_id: int) -> None:
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
    if not supplier_email:
        logger.warning("Supplier approved email skipped: empty supplier_email.")
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
    greeting_name = supplier_name.strip() or "there"
    subject = "Your Tooli UK supplier account is approved"
    html, plain = render_tooli_email(
        preheader="You can now log in and list equipment on Tooli UK.",
        headline="Welcome — your account is approved",
        greeting=f"Hi {greeting_name},",
        body_paragraphs=[
            "Your supplier account has been approved by our team. "
            "You can now log in, add equipment listings, and manage your organization profile.",
        ],
        detail_rows=[
            ("Organization", organization_name),
            ("Account email", supplier_email),
        ],
        cta_label="Go to dashboard",
        cta_url=dashboard_url,
        badge_label="Account active",
        badge_tone="success",
    )
    _dispatch_email(
        subject=subject,
        plain_message=plain,
        html_message=html,
        recipients=[supplier_email],
        log_context="supplier_approved_notification",
    )
