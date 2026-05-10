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
