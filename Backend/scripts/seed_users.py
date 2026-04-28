"""Bulk-create users via the Django REST endpoint.

Usage:
    python scripts/seed_users.py --base-url http://127.0.0.1:8000
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request


# Update this list with the users you want to create.
# role_id must exist in your database before posting users.
USERS = [
    {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "password": "TempPass123!",
        "avatar_url": None,
        "role_id": 1,
        "created_by": None,
        "updated_by": None,
        "is_active": True,
    },
    {
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com",
        "password": "TempPass123!",
        "avatar_url": "https://example.com/avatars/jane.png",
        "role_id": 1,
        "created_by": None,
        "updated_by": None,
        "is_active": True,
    },
]


def post_json(url: str, payload: dict) -> tuple[int, str]:
    request = urllib.request.Request(
        url=url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            body = response.read().decode("utf-8")
            return response.status, body
    except urllib.error.HTTPError as error:
        error_body = error.read().decode("utf-8")
        return error.code, error_body


def main() -> int:
    parser = argparse.ArgumentParser(description="Bulk-create users with POST /users/.")
    parser.add_argument(
        "--base-url",
        default="http://127.0.0.1:8000",
        help="API base URL, e.g. http://127.0.0.1:8000",
    )
    parser.add_argument(
        "--endpoint",
        default="/users/",
        help="User endpoint path (default: /users/)",
    )
    args = parser.parse_args()

    endpoint = args.endpoint if args.endpoint.startswith("/") else f"/{args.endpoint}"
    if not endpoint.endswith("/"):
        endpoint = f"{endpoint}/"
    url = f"{args.base_url.rstrip('/')}{endpoint}"

    success_count = 0
    for index, user_payload in enumerate(USERS, start=1):
        status_code, response_body = post_json(url, user_payload)
        if 200 <= status_code < 300:
            success_count += 1
            print(f"[{index}] Created user ({status_code}): {user_payload['email']}")
        else:
            print(f"[{index}] Failed ({status_code}) for {user_payload['email']}")
            print(f"    Response: {response_body}")

    print(f"\nDone. Created {success_count}/{len(USERS)} users.")
    return 0 if success_count == len(USERS) else 1


if __name__ == "__main__":
    sys.exit(main())
