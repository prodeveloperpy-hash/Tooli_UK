# Tooli UK API — cURL reference

Replace `BASE` with your API host, for example:

```text
https://backend-service-961815749151.us-central1.run.app
```

Use `curl.exe` on Windows PowerShell if `curl` is aliased to `Invoke-WebRequest`.

---

## Auth

### Signup (JSON)

```bash
BASE="https://backend-service-961815749151.us-central1.run.app"

curl -sS -X POST "${BASE}/signup/" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Supplier",
    "email": "jane@example.com",
    "password": "SecurePass12",
    "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=256",
    "organization_name": "Acme Hire Ltd",
    "organization_city": "London",
    "organization_country": "United Kingdom"
  }'
```

### Signup (multipart — profile photo file → GCS)

```bash
curl -sS -X POST "${BASE}/signup/" \
  -H "Accept: application/json" \
  -F 'payload={"first_name":"Jane","last_name":"Supplier","email":"jane2@example.com","password":"SecurePass12","organization_name":"Acme Hire 2"}' \
  -F "avatar=@/path/to/profile.jpg"
```

### Login

```bash
curl -sS -X POST "${BASE}/login/" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"jane@example.com","password":"SecurePass12"}'
```

**Response `data` includes:** `user` (full object, `password` never returned), `role_key`, `organization_id`.  
If `avatar_url` is stored in GCS, `user.avatar_url` is an absolute URL to `GET /user/{id}/avatar/`.

### Logout

```bash
curl -sS -X POST "${BASE}/logout/" \
  -H "Accept: application/json"
```

### User avatar (bytes)

```bash
curl -sS -o avatar.bin "${BASE}/user/5/avatar/"
```

---

## Organization

### List / retrieve

```bash
curl -sS "${BASE}/organization/"
curl -sS "${BASE}/organization/3/"
```

### Update logo (JSON — public URL)

```bash
curl -sS -X PATCH "${BASE}/organization/3/" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"logo":"https://cdn.example.com/brands/acme.png","name":"Acme Hire Ltd"}'
```

### Update logo (multipart — file upload to GCS)

```bash
curl -sS -X PATCH "${BASE}/organization/3/" \
  -H "Accept: application/json" \
  -F 'payload={"name":"Acme Hire Ltd","city":"London"}' \
  -F "logo=@/path/to/logo.png"
```

### Organization logo (bytes or redirect)

```bash
curl -sS -o logo.bin "${BASE}/organization/3/logo/"
```

---

## User–organization (composite user + org + link)

**Rules:** use either `user_id` **or** nested `user` (not both). Same for `organization_id` **or** nested `organization`. `role_id` required on create.

### Create (JSON — new user + new org + link)

```bash
curl -sS -X POST "${BASE}/user-organization/" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "role_id": 2,
    "user": {
      "first_name": "Sara",
      "last_name": "Khan",
      "email": "sara@example.com",
      "password": "SecurePass12",
      "organization_id": null
    },
    "organization": {
      "name": "Sara Co",
      "domain": "sara.example",
      "city": "Birmingham",
      "country": "United Kingdom",
      "logo": "https://example.com/org-banner.png"
    }
  }'
```

### Create (multipart — user avatar + org logo files)

```bash
curl -sS -X POST "${BASE}/user-organization/" \
  -H "Accept: application/json" \
  -F 'payload={"role_id":2,"user":{"first_name":"Sara","last_name":"Khan","email":"sara2@example.com","password":"SecurePass12"},"organization":{"name":"Sara Co 2"}}' \
  -F "avatar=@/path/to/user.jpg" \
  -F "organization_logo=@/path/to/org-logo.png"
```

### Link existing user to existing org (JSON)

```bash
curl -sS -X POST "${BASE}/user-organization/" \
  -H "Content-Type: application/json" \
  -d '{"user_id":5,"organization_id":3,"role_id":2,"is_active":true}'
```

### PATCH membership + nested user/org (JSON)

```bash
curl -sS -X PATCH "${BASE}/user-organization/12/" \
  -H "Content-Type: application/json" \
  -d '{
    "role_id": 3,
    "user": {"first_name": "Sara"},
    "organization": {"name": "Sara Hire UK Ltd"}
  }'
```

### PATCH (multipart — only new files; empty `payload` allowed)

```bash
curl -sS -X PATCH "${BASE}/user-organization/12/" \
  -F 'payload={}' \
  -F "avatar=@/path/to/new-avatar.jpg" \
  -F "organization_logo=@/path/to/new-org-logo.png"
```

### DELETE (removes only the membership row)

```bash
curl -sS -X DELETE "${BASE}/user-organization/12/"
```

---

## Equipment

### List (with filters — combine as needed)

```bash
# Category, location, name, dates, availability overlap, etc.
curl -sS -G "${BASE}/equipment/" \
  --data-urlencode "category_key=power" \
  --data-urlencode "location_name=London" \
  --data-urlencode "name_starts_with=drill" \
  --data-urlencode "available_on=2026-06-15" \
  --data-urlencode "availability_overlap_start=2026-06-01T00:00:00Z" \
  --data-urlencode "availability_overlap_end=2026-06-30T23:59:59Z" \
  --data-urlencode "page=1" \
  --data-urlencode "page_size=20"
```

**Useful query parameters:**

| Area | Parameters |
|------|------------|
| **Name** | `name`, `name_starts_with`, `name_exact`, `description` |
| **Category** | `category_id`, `category_name`, `category_key` |
| **Location** | `location_id`, `location_name`, `location_country`, `location_state` |
| **Org** | `organization_id`, `organization_name` |
| **Prices** | `currency`, `interval_id` |
| **Images** | `image_url` |
| **Equipment dates** | `created_datetime_after`, `created_datetime_before`, `updated_datetime_after`, `updated_datetime_before` |
| **Availability** | `availability_from_gte`, `availability_from_lte`, `availability_to_gte`, `availability_to_lte`, `available_on` (date `YYYY-MM-DD`) |
| **Overlap** | `availability_overlap_start` + `availability_overlap_end` (both ISO datetimes) |
| **Pagination** | `page`, `page_size` (max 100) |

List response is paginated: `count`, `next`, `previous`, `results[]`.

### Retrieve one

```bash
curl -sS "${BASE}/equipment/5/"
```

**`prices[]` includes:** `interval` (`interval_id`, `interval_key`, `interval_display_name`), `price_period` (label for UI, e.g. “Per day”), plus `price`, `currency`, `interval_id`.

### Create equipment (JSON + image URLs)

```bash
curl -sS -X POST "${BASE}/equipment/" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Cordless drill",
    "description": "18V kit",
    "organization_id": 1,
    "category_id": 1,
    "images": [
      {"image_url": "https://example.com/a.jpg", "sort_order": 0},
      {"image_url": "https://example.com/b.png", "sort_order": 1}
    ]
  }'
```

### Create equipment (multipart — multiple files)

`images` in JSON must have one object per file (can be `{}` for defaults). Repeat form field `images` for each file.

```bash
curl -sS -X POST "${BASE}/equipment/" \
  -H "Accept: application/json" \
  -F 'payload={"name":"Heavy kit","organization_id":1,"images":[{},{},{}]}' \
  -F "images=@/path/photo1.jpg" \
  -F "images=@/path/photo2.png" \
  -F "images=@/path/photo3.webp"
```

### PATCH equipment — append more images (JSON)

```bash
curl -sS -X PATCH "${BASE}/equipment/5/" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated title","images":[{"image_url":"https://example.com/new.jpg"}]}'
```

### PATCH equipment — append images (multipart)

```bash
curl -sS -X PATCH "${BASE}/equipment/5/" \
  -H "Accept: application/json" \
  -F 'payload={"images":[{"sort_order":10},{"sort_order":11}]}' \
  -F "images=@/path/extra1.jpg" \
  -F "images=@/path/extra2.jpg"
```

**Note:** PATCH/PUT **append** new `EquipmentImage` rows; they do not remove existing images.

---

## Create / update / delete equipment (legacy route `create_equipment`)

Single equipment row with **one** primary `location`, plus optional `prices`, `images`, and `availabilities`. Same JSON shape for **create** and **full replace (PUT)**.

**Responses:** `POST`, `PUT`, and `PATCH` return `{ "message": "...", "data": { ... } }` where `data` is the full **`EquipmentSerializer`** payload (nested `locations`, `prices` with `interval`, `images` with API `image_url`, `availabilities`), same as `GET /equipment/{id}/`.

### Rules

| Method | Path | Behaviour |
|--------|------|-----------|
| **POST** | `/create_equipment/` | Create. **`name`** and **`location`** required. |
| **PUT** | `/create_equipment/{equipment_id}/` | Full update. **`name`** and **`location`** required. If **`prices`**, **`images`**, or **`availabilities`** are omitted, they default to **`[]`** and existing rows for that type are cleared. |
| **PATCH** | `/create_equipment/{equipment_id}/` | Partial update. Only fields in the body change. If **`prices`**, **`images`**, or **`availabilities`** is present, that list **replaces** all existing rows of that type; omit the key to leave them unchanged. |
| **DELETE** | `/create_equipment/{equipment_id}/` | Deletes related images, prices, locations, availabilities, then the equipment. **`204 No Content`**, no body. |

**Multipart:** same as other routes: form field **`payload`** (JSON string) and optional repeated **`images`** files aligned with `images[]` in the JSON.

---

### Create — JSON (POST)

```bash
curl -sS -X POST "${BASE}/create_equipment/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Scaffold tower",
    "organization_id": 1,
    "created_by": 1,
    "updated_by": 1,
    "location": {"location_id": 1},
    "prices": [{"price": "120.00", "currency": "GBP", "interval_id": 2}],
    "images": [{"image_url": "https://example.com/x.jpg"}],
    "availabilities": [{
      "availability_from": "2026-06-01T08:00:00Z",
      "availability_to": "2026-08-31T18:00:00Z"
    }]
  }'
```

### Create — multipart (`payload` + `images` files)

```bash
curl -sS -X POST "${BASE}/create_equipment/" \
  -H "Accept: application/json" \
  -F 'payload={"name":"Kit","organization_id":1,"location":{"location_id":1},"images":[{},{}],"prices":[{"price":"50","currency":"GBP","interval_id":1}]}' \
  -F "images=@/path/a.jpg" \
  -F "images=@/path/b.png"
```

---

### Full replace — JSON (PUT)

```bash
curl -sS -X PUT "${BASE}/create_equipment/5/" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Scaffold tower (revised)",
    "organization_id": 1,
    "location": {"location_id": 2},
    "prices": [{"price": "99.00", "currency": "GBP", "interval_id": 2}],
    "images": [],
    "availabilities": []
  }'
```

### Full replace — multipart (PUT)

```bash
curl -sS -X PUT "${BASE}/create_equipment/5/" \
  -H "Accept: application/json" \
  -F 'payload={"name":"Kit v2","location":{"location_id":1},"images":[{"sort_order":0}],"prices":[{"price":"60","currency":"GBP","interval_id":1}]}' \
  -F "images=@/path/new-hero.jpg"
```

---

### Partial update — JSON (PATCH)

```bash
curl -sS -X PATCH "${BASE}/create_equipment/5/" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name": "Updated title only"}'
```

Replace only prices (other relations unchanged):

```bash
curl -sS -X PATCH "${BASE}/create_equipment/5/" \
  -H "Content-Type: application/json" \
  -d '{"prices":[{"price":"110.00","currency":"GBP","interval_id":2}]}'
```

---

### Delete

```bash
curl -sS -X DELETE "${BASE}/create_equipment/5/" \
  -H "Accept: application/json" \
  -w "\nHTTP %{http_code}\n"
```

Expect **`204`** on success.

---

## Equipment images (private GCS)

DB stores a GCS object path or a public URL. List/detail responses rewrite non-HTTP paths to an API URL.

### Serve image bytes (or redirect for `https://...`)

```bash
curl -sS -o img.bin "${BASE}/equipment-image/42/content/"
```

---

## Roles (for signup / user-org `role_id`)

```bash
curl -sS "${BASE}/roles/"
```

---

## Bootstrap commands (server / CI)

```bash
cd Backend
python manage.py seed_dummy_data          # idempotent reference + dummy equipment
python manage.py seed_dummy_data --reset  # clear dummy markers, then seed
python manage.py create_superadmin       # superadmin@gmail.com / superadmin + SUPERADMIN role
```

---

## Environment

- **GCS file uploads** (signup avatar, user-org files, org logo, equipment images): set `GCS_IMAGE_BUCKET` (default `tooli-uk-images`) and run with a service account that can read/write the bucket (e.g. Cloud Run runtime SA).
- **JSON-only URLs** for logos/avatars/images work without GCS.

### Local development — `DefaultCredentialsError` (Python cannot reach GCS)

Installing the **Cloud SDK** or running **`gcloud auth login`** alone does **not** give the Python libraries “Application Default Credentials”. The Storage client calls `google.auth.default()`, which looks for ADC (e.g. a user ADC file or `GOOGLE_APPLICATION_CREDENTIALS`).

Do **one** of the following, then **restart** the terminal and **`runserver`**:

1. **User ADC (recommended for your laptop)**  
   ```bash
   gcloud auth application-default login
   ```  
   Complete the browser flow. This creates the JSON file that `google.auth.default()` uses.  
   **Note:** `gcloud auth login` ≠ `gcloud auth application-default login` — you need the **second** command for local Python.

2. **Service account key file**  
   Download a JSON key for an account that has access to the bucket, then before starting Django:  
   `set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\key.json` (PowerShell: `$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\key.json"`).

3. **No GCS on this machine** (files under `Backend/media/` only)  
   `GCS_UPLOAD_ENABLED=false`

On **Cloud Run**, the **runtime service account** provides ADC automatically; you normally do not run `gcloud` on the server.

---

## Quick reference — routes

| Method | Path | Notes |
|--------|------|--------|
| POST | `/signup/` | JSON or multipart `payload` + `avatar` |
| POST | `/login/` | Returns `user`, `role_key`, `organization_id` |
| POST | `/logout/` | Clears Django session |
| GET | `/user/{id}/avatar/` | Profile image |
| PATCH | `/user/{id}/` | JSON fields or multipart `avatar` file |
| GET/POST/PATCH/DELETE | `/organization/` | Multipart: `payload` + `logo` |
| GET | `/organization/{id}/logo/` | Org logo |
| GET/POST/PATCH/DELETE | `/user-organization/` | Composite create; multipart `avatar`, `organization_logo` |
| GET/POST/PATCH/DELETE | `/equipment/` | List paginated; mutate with `images`; filters on query string |
| POST | `/create_equipment/` | Full create; response is full equipment object |
| PUT/PATCH | `/create_equipment/{id}/` | Full replace / partial update (same nested shape) |
| DELETE | `/create_equipment/{id}/` | Remove equipment and related prices/images/locations/availabilities |
| GET | `/equipment-image/{id}/content/` | Equipment image bytes |
