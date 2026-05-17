"""Branded HTML + plain-text email bodies for Tooli UK transactional mail."""

from __future__ import annotations

from html import escape

from django.conf import settings

# Match frontend brand (theme.css)
BRAND_PRIMARY = "#e87525"
BRAND_PRIMARY_DARK = "#d1641d"
BRAND_INK = "#030213"
BRAND_MUTED = "#717182"
BRAND_BG = "#f4f6f9"
BRAND_CARD = "#ffffff"
BRAND_BORDER = "#e8eaef"


def _brand_name() -> str:
    return getattr(settings, "EMAIL_BRAND_NAME", "Tooli UK") or "Tooli UK"


def _support_email() -> str:
    return (
        getattr(settings, "EMAIL_SUPPORT_ADDRESS", None)
        or getattr(settings, "DEFAULT_FROM_EMAIL", None)
        or "info@tooli.uk"
    )


def _site_url() -> str:
    return getattr(
        settings,
        "SITE_URL",
        "https://frontend-service-961815749151.us-central1.run.app",
    ).rstrip("/")


def render_tooli_email(
    *,
    preheader: str,
    headline: str,
    greeting: str | None = None,
    intro: str | None = None,
    body_paragraphs: list[str] | None = None,
    detail_rows: list[tuple[str, str]] | None = None,
    cta_label: str | None = None,
    cta_url: str | None = None,
    badge_label: str | None = None,
    badge_tone: str = "warning",
) -> tuple[str, str]:
    """
    Build (html_body, plain_text_body) for multipart emails.
    Uses table layout + inline styles for broad client support.
    """
    brand = _brand_name()
    support = _support_email()
    site = _site_url()
    year = "2026"

    paragraphs = list(body_paragraphs or [])
    if intro:
        paragraphs.insert(0, intro)

    badge_colors = {
        "warning": ("#fff7ed", "#c2410c", "#fed7aa"),
        "success": ("#ecfdf5", "#047857", "#a7f3d0"),
        "info": ("#eff6ff", "#1d4ed8", "#bfdbfe"),
    }
    badge_bg, badge_fg, badge_border = badge_colors.get(badge_tone, badge_colors["info"])

    # --- Plain text ---
    plain_lines: list[str] = [headline, ""]
    if greeting:
        plain_lines.extend([greeting, ""])
    for p in paragraphs:
        plain_lines.extend([p, ""])
    if detail_rows:
        plain_lines.append("Details:")
        for label, value in detail_rows:
            plain_lines.append(f"  {label}: {value}")
        plain_lines.append("")
    if cta_label and cta_url:
        plain_lines.extend([f"{cta_label}: {cta_url}", ""])
    plain_lines.extend(
        [
            f"— {brand}",
            f"Questions? Contact us at {support}",
            site,
        ]
    )
    plain_text = "\n".join(plain_lines).strip()

    # --- HTML fragments ---
    greeting_html = ""
    if greeting:
        greeting_html = (
            f'<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:{BRAND_INK};">'
            f"{escape(greeting)}</p>"
        )

    paragraphs_html = ""
    for p in paragraphs:
        paragraphs_html += (
            f'<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#334155;">'
            f"{escape(p)}</p>"
        )

    badge_html = ""
    if badge_label:
        badge_html = (
            f'<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">'
            f"<tr><td style=\"background:{badge_bg};color:{badge_fg};border:1px solid {badge_border};"
            f'font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;'
            f'padding:8px 14px;border-radius:999px;">{escape(badge_label)}</td></tr></table>'
        )

    details_html = ""
    if detail_rows:
        rows_html = ""
        for label, value in detail_rows:
            rows_html += (
                "<tr>"
                f'<td style="padding:10px 12px;font-size:13px;color:{BRAND_MUTED};'
                f'border-bottom:1px solid {BRAND_BORDER};width:38%;vertical-align:top;">'
                f"{escape(label)}</td>"
                f'<td style="padding:10px 12px;font-size:14px;color:{BRAND_INK};'
                f'border-bottom:1px solid {BRAND_BORDER};font-weight:500;">'
                f"{escape(value)}</td>"
                "</tr>"
            )
        details_html = (
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
            f'style="margin:8px 0 22px;border:1px solid {BRAND_BORDER};border-radius:10px;'
            f'overflow:hidden;background:#fafbfc;">'
            f"<tbody>{rows_html}</tbody></table>"
        )

    cta_html = ""
    if cta_label and cta_url:
        safe_url = escape(cta_url, quote=True)
        cta_html = (
            '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">'
            "<tr><td>"
            f'<a href="{safe_url}" target="_blank" rel="noopener noreferrer" '
            f'style="display:inline-block;background:{BRAND_PRIMARY};color:#ffffff !important;'
            f"font-size:15px;font-weight:600;text-decoration:none;padding:14px 28px;"
            f'border-radius:8px;border:1px solid {BRAND_PRIMARY_DARK};">'
            f"{escape(cta_label)}</a>"
            "</td></tr></table>"
            f'<p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:{BRAND_MUTED};">'
            f"If the button does not work, copy this link:<br>"
            f'<a href="{safe_url}" style="color:{BRAND_PRIMARY};word-break:break-all;">'
            f"{escape(cta_url)}</a></p>"
        )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>{escape(headline)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:{BRAND_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">
    {escape(preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{BRAND_BG};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="padding:0 0 20px;text-align:center;">
              <span style="font-size:22px;font-weight:800;color:{BRAND_INK};letter-spacing:-0.02em;">{escape(brand)}</span>
              <span style="display:inline-block;width:8px;height:8px;background:{BRAND_PRIMARY};border-radius:50%;margin:0 0 3px 6px;vertical-align:middle;"></span>
            </td>
          </tr>
          <tr>
            <td style="background:{BRAND_CARD};border:1px solid {BRAND_BORDER};border-radius:14px;padding:36px 32px;box-shadow:0 4px 24px rgba(3,2,19,0.06);">
              {badge_html}
              <h1 style="margin:0 0 18px;font-size:22px;line-height:1.35;color:{BRAND_INK};font-weight:700;">
                {escape(headline)}
              </h1>
              {greeting_html}
              {paragraphs_html}
              {details_html}
              {cta_html}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 8px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;line-height:1.6;color:{BRAND_MUTED};">
                This is an automated message from {escape(brand)}. Please do not reply to this email.
              </p>
              <p style="margin:0 0 8px;font-size:12px;line-height:1.6;color:{BRAND_MUTED};">
                Need help? <a href="mailto:{escape(support)}" style="color:{BRAND_PRIMARY};text-decoration:none;">{escape(support)}</a>
                &nbsp;·&nbsp;
                <a href="{escape(site)}" style="color:{BRAND_PRIMARY};text-decoration:none;">{escape(site.replace('https://', '').replace('http://', ''))}</a>
              </p>
              <p style="margin:0;font-size:11px;color:#9ca3af;">© {year} {escape(brand)}. Equipment hire marketplace.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    return html, plain_text