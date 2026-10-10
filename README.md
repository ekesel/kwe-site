# KWE Advisors — website + CMS

A React/Vite marketing site whose content is managed in a Django admin (styled with
django-unfold) and served from PostgreSQL. One `docker compose up` runs everything.

```
┌──────────────┐   /            ┌───────────────────────┐
│   Browser    │ ─────────────▶ │  web  (nginx)         │  SPA build (frontend/dist)
└──────────────┘                │   /api/ /admin/       │──┐  /media/ served from shared volume
                                │   /static/  ──▶ proxy │  │
                                └───────────────────────┘  ▼
                                                   ┌────────────────────┐     ┌──────────────┐
                                                   │ backend (gunicorn) │────▶│ db (postgres)│
                                                   │ Django 5 + DRF     │     └──────────────┘
                                                   │ /admin/ CMS        │
                                                   │ GET /api/content/  │
                                                   └────────────────────┘
```

* **frontend/** — Vite 6, React 19, TypeScript, Tailwind v4, react-router 7. On load it fetches
  `GET /api/content/` once and renders from that object (`useContent()`); the public site is
  otherwise unchanged from the static version.
* **backend/** — Django 5.2, DRF, PostgreSQL 16, django-unfold admin, django-solo (page
  singletons), django-simple-history (per-record history + revert). The admin **is** the CMS.
* `/api/content/` returns `{ "data": <exactly the shape of frontend/src/data.json>, "updated_at" }`.
  It is public, read-only and cached in-process per gunicorn worker. A `ContentVersion` row in the database is
  bumped by model signals on every save/delete and checked on each request, so a change saved by one worker is
  picked up by all of them immediately.

## Quick start (fresh VPS)

```bash
git clone … kwe-site && cd kwe-site
cp .env.example .env            # edit SECRET_KEY, POSTGRES_PASSWORD, ADMIN_PASSWORD, ALLOWED_HOSTS, CSRF_TRUSTED_ORIGINS
make up                         # builds images, starts db → backend → web
```

* Site: `http://<host>/`
* CMS: `http://<host>/admin/` — log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `.env`.

On first boot the backend runs migrations, creates the admin user, imports
`backend/seed/data.json` (only when the database is empty), collects static files and
starts gunicorn. Subsequent boots never overwrite content.

### TLS with Caddy

Put Caddy in front of the `web` container (change `WEB_PORT=8080` in `.env` so port 80 is free):

```caddyfile
kweadvisors.com {
    reverse_proxy 127.0.0.1:8080
}
```

Then set in `.env`: `ALLOWED_HOSTS=kweadvisors.com`, `CSRF_TRUSTED_ORIGINS=https://kweadvisors.com`,
`SESSION_COOKIE_SECURE=True`, `CSRF_COOKIE_SECURE=True` and `make up` again.

## Make targets

| Target | What it does |
| --- | --- |
| `make up` | build + start the production stack in the background |
| `make dev` | dev stack: Django `runserver` on :8000 and Vite on :5173 with bind mounts |
| `make logs` / `make down` / `make ps` | the usual |
| `make backup-db` | `pg_dump` → `backups/kwe-<timestamp>.sql.gz` |
| `make restore-db FILE=backups/kwe-….sql.gz` | restore a dump (stops backend during restore) |
| `make backup-media` | tarball of uploaded files → `backups/media-<timestamp>.tar.gz` |
| `make sync-seed` | copy `frontend/src/data.json` → `backend/seed/data.json` |
| `make test` | backend `pytest` + frontend `tsc --noEmit` + `vite build` |
| `make export-content` | print the live content JSON (same shape as data.json) |
| `make createsuperuser` | add another admin user |

## Local development (without Docker)

```bash
# backend
cd backend
python3.12 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py import_content          # loads seed/data.json
.venv/bin/python manage.py createsuperuser
.venv/bin/python manage.py runserver               # :8000 (SQLite by default; set DATABASE_URL for Postgres)

# frontend (second terminal)
cd frontend && npm install && npm run dev          # :5173 — proxies /api, /media, /admin, /static → :8000
```

Open `http://localhost:5173/` for the site and `http://localhost:5173/admin/` for the CMS.

Tests: `cd backend && .venv/bin/python -m pytest` (62 tests: round-trip contract, API, cache
invalidation across worker processes, every admin page, history revert, `import_content --force`, and a check that
the seed fits Postgres column lengths — SQLite does not enforce them) and `cd frontend && npx tsc --noEmit && npm run build`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `SECRET_KEY` | Django secret. Long random string. |
| `DEBUG` | `False` in production. |
| `ALLOWED_HOSTS` | Comma-separated hostnames. |
| `CSRF_TRUSTED_ORIGINS` | Comma-separated origins with scheme (`https://example.com`). Required for admin login behind TLS. |
| `SITE_URL` | Public site URL for the admin “View site”/“Preview” buttons. `/` means same host. |
| `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE` | Set `True` once served over HTTPS. |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Database; compose builds `DATABASE_URL` from these. |
| `DATABASE_URL` | Used directly when running outside compose (defaults to SQLite). |
| `MEDIA_ROOT` | `/data/media` in Docker (shared volume, served by nginx at `/media/`). |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL` | Initial superuser, created only if missing. |
| `WEB_PORT` | Host port for nginx (default 80). |
| `USE_S3` + `AWS_*` | Optional S3-compatible media storage (django-storages). Off by default. |

## How content is modelled

Every top-level key of `data.json` is either a **page singleton** (one row, edited on one
screen with tabs per section) or a **list model**:

| data.json | Admin |
| --- | --- |
| `site` (incl. `heroVideo` — the one hero video used on every page), `nav.cta`, `footer.email` / `linkedinLabel` / `copyright`, `cta` (the CTA block at the top of the footer), `notFound` | Site → **Site settings** |
| `nav.links[]` | Site → **Navigation** |
| `footer.columns[]` (+ links) | Site → **Footer** |
| `home`, `story`, `process`, `contact`, `legal` | Pages → Home / Story / Process / Contact / Legal |
| `home.hero.subtitle`, `home.team.subtitle` | Pages → Home → Hero / Team teaser |
| `home.stats.items[]` (`figure`, `label`, `tone`, `image`) | Pages → Home → “Stats — tiles” |
| `home.who.groups[]` (`label`, `tiles[]` with `label`, `tone`, `image`) | Pages → Home → “Who we work with — tiles” (tile `group` = group label) |
| `home.comparison` (`title`, `traditionalLabel`, `kweLabel`, `traditionalImage`, `kweImage`, `rows[]` with `label` / `traditional` / `kwe`) | Pages → Home → “Traditional vs KWE” + “Traditional vs KWE — rows” |
| `home.whatWeDo.cards[].image`, `home.testimonials.items[].image` | Pages → Home → card inlines |
| `home.testimonials.logos[]` (`name`, `icon` — placeholder glyphs until real logos) | Pages → Home → “Trusted by — logos” |
| `story.hero.kicker` | Pages → Story → Hero (stored, not shown in the hero) |
| `team.hero.subtitle`, `solutions.whyKwe` (`title`, `body`), `insights.hero.subtitle` | Pages → … page settings → Hero / List |
| `insights.article.metaLabels[]`, `insights.article.outline` | Pages → Insights page settings → Article page labels |
| `legal.draftNote`, `legal.documents[]` (`slug`, `eyebrow`, `title`, `updated`, `intro`, `sections[]`, `disclaimer`, `complianceNote`) — served at `/legal/<slug>` | Pages → Legal (draft note) and Pages → **Legal documents** |
| `team.*`, `solutions.*`, `caseStudies.*`, `insights.*` (page copy, labels, page size) | Pages → … page settings |
| `team.members[]` (incl. `credential`) | Content → **Team members** |
| `solutions.items[]` (+ deliverables, expectations) | Content → **Solutions** |
| `caseStudies.items[]` (`meta[]` = Service / Client / Duration; `challenge`, `approach`, `results` each with a `heading` + rich-text `body`; approach `steps[]`) | Content → **Case studies** |
| `insights.items[]` (`body` = the whole article as rich text; its `##` / `###` headings build the outline) | Content → **Insights** |
| `team.filters[]`, `caseStudies.hero.filters[]` (rendered above the grid, not in the hero), `*.controls.categoriesOptions`, `insights.controls.filterOptions` | Filters → **Filter groups** |

**Rich text** (legal sections, case-study bodies, insight bodies) is plain text: a blank line starts a new
paragraph, lines starting with `- ` are bullets, `## ` / `### ` start a heading, `**text**` is bold.

Nested lists are inline tables with drag-and-drop ordering. Short string lists (title
lines, bullets, address lines, bios) are “one item per line” text boxes. Images and videos are
an upload **plus** an optional external URL; the upload wins when both are set. A URL field may also hold a
site path for a file shipped with the frontend build: `frontend/public/media/hero.mp4` is served at `/media/hero.mp4`
(nginx tries the CMS upload volume first, then the bundled file).

`backend/content/assemble.py::build_content()` rebuilds the JSON; `content/importer.py`
is its inverse. `content/tests/test_roundtrip.py` imports the seed and asserts deep equality —
that test is the contract that keeps the frontend's data access unchanged.

## Editing guide for staff

1. Go to `/admin/` and log in.
2. The **Dashboard** shows quick links to every page and when each section was last changed.
3. **Pages** (left sidebar) are single screens with a tab per section — e.g. Home → Hero, Intro,
   Stats… Lists that belong to a section (stat tiles, cards, steps) are their own tabs.
4. **Content** holds the things that have their own URLs: team members, solutions, case studies,
   insights. “Add” creates a new one; the slug (URL) is filled in from the name/title.
5. Drag the handle on the left of a row to reorder. Press **Save** — the site updates immediately
   (reload the page in your browser).
6. **Preview page** / **View site** buttons (top right of every edit screen) open the live page.
7. **History** (top right) lists every change with who/when. Open an entry and press
   **Revert** to restore that version.
8. **Filters**: dropdown options on the Team / Case studies / Insights pages. An item is only
   filterable when its value (e.g. a case study's Region) matches an option exactly.
9. **Media library**: upload a file and copy its URL into any “external URL” field if you want to
   reuse the same image in several places.

Validation: slugs are unique, hero titles are required, images are limited to 10 MB and videos
to 100 MB, and only web image/video file types are accepted.

## Operations

* **Change the admin password**: `/admin/password_change/` while logged in, or
  `docker compose exec backend python manage.py changepassword admin`.
* **Backups**: `make backup-db` and `make backup-media`; keep `backups/` off-box.
* **Restore**: `make restore-db FILE=…` then `docker compose exec backend tar xzf - -C /data < backups/media-….tar.gz`.
* **Re-seed from the JSON** (overwrites all content):
  `make sync-seed && docker compose exec backend python manage.py import_content --force` (optionally `path/to/data.json`).
  `--force` first empties every content table (singleton pages included) so nothing stale survives a schema change;
  wipe and import run in one transaction, so a failed import leaves the existing content untouched.
* **Export the live content** to update the committed seed/type source:
  `make export-content > frontend/src/data.json && make sync-seed`.
* **Logs**: `make logs`. Health checks: backend hits `/api/content/`, web hits `/`.
* **Upgrades**: `git pull && make up` (images rebuild; migrations run on boot).

## Repository layout

```
frontend/   Vite project (Dockerfile → nginx image, nginx.conf)
backend/    Django project: kwe/ (settings, urls), content/ (models, admin, assemble, importer,
            api, tests, management commands), seed/data.json, Dockerfile, entrypoint.sh
docker-compose.yml  docker-compose.dev.yml  .env.example  Makefile
```
