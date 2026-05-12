import logging

from django.core.mail import send_mail
from django.conf import settings

from tooli_uk_app.models import User
from tooli_uk_app.services.superadmin import HARDCODED_SUPERADMIN_EMAIL

logger = logging.getLogger(__name__)


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


def _superadmin_recipients() -> list[str]:
    db_emails = list(
        User.objects.filter(
            role_id__role_key__iexact="SUPERADMIN",
            is_active=True,
        )
        .exclude(email__isnull=True)
        .exclude(email__exact="")
        .values_list("email", flat=True)
    )
    deduped = {HARDCODED_SUPERADMIN_EMAIL.lower()}
    recipients = [HARDCODED_SUPERADMIN_EMAIL]
    for email in db_emails:
        lowered = email.lower()
        if lowered in deduped:
            continue
        deduped.add(lowered)
        recipients.append(email)
    return recipients


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
    _send_email_with_status(
        subject=subject,
        message=message,
        recipients=recipients,
        log_context="new_supplier_for_superadmin_approval",
    )


def notify_supplier_approved(
    supplier_name: str,
    supplier_email: str,
    organization_name: str,
) -> None:
    subject = "Your supplier account is approved"
    message = (
        f"Hi {supplier_name},\n\n"
        "Your supplier account has been approved by admin.\n"
        f"Organization: {organization_name}\n\n"
        "You can now log in to your account."
    )
    _send_email_with_status(
        subject=subject,
        message=message,
        recipients=[supplier_email],
        log_context="supplier_approved_notification",
    )
