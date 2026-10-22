# Campus Connect

React JavaScript frontend with a Django backend, student profiles and a custom administration panel.

## Current features

- College discovery, search/filtering, grid/list views, details and browser-local comparison/shortlists.
- Database-backed career roadmaps, learning resources and published study plans.
- Django session authentication, email signup/recovery OTP and optional Twilio phone OTP.
- Private student profiles with avatar/cover uploads, interests, goals and searchable skills.
- Public community questions and a private guidance-question planner.
- Custom staff admin at `/admin/` for colleges, students, courses, plans and roadmaps. Original Django administration remains at `/django-admin/`.

Live mentor matching, bookings, notifications, Google sign-in and subscription billing are not implemented.

## Run locally (PowerShell)

From the project directory, activate the existing environment once per terminal:

```powershell
cd "D:\College Project\Campus"
& "..\.venv\Scripts\Activate.ps1"
python manage.py runserver 0.0.0.0:8000
```

Open [Website](http://127.0.0.1:8000/) or [Admin](http://127.0.0.1:8000/admin/). Admin requires an existing active staff/superuser account.

For a fresh setup, install dependencies and prepare the application before starting Django:

```powershell
python -m pip install -r requirements.txt
npm ci --include=dev
python manage.py migrate
python manage.py seed_demo
npm run build
```

`.env.example` lists configuration keys without credentials. Copy it to `.env` only if you do not already have one; preserve existing values. Create a staff account with `python manage.py createsuperuser` if necessary.

For frontend development, keep Django running, run `npm run dev` in a second terminal and open http://localhost:3000/static/frontend/. The custom admin is served by Django at port 8000. After source edits, run `npm run build` to update Django's frontend, then restart Django and refresh.

## Folder layout

| Path | Purpose |
| --- | --- |
| `src/admin/` | Custom admin login, dashboard, forms and API helper |
| `src/screens/` | Home, college, roadmap, login and student screens |
| `src/components/landing/` | Shared header, icons, images and shared CSS |
| `src/components/auth/` | Authentication icons |
| `src/data/` | Frontend helpers, profile choices and initial roadmap definitions |
| `portal/` | Models, validated forms, public/admin APIs and tests |
| `portal/migrations/` | Required database history; do not delete |
| `portal/management/commands/` | Seeding and expired-auth-record cleanup |
| `campus_project/` | Django settings, URLs, WSGI/ASGI and network configuration |
| `public/` | Source images copied during the frontend build |
| `static/frontend/` | Current generated frontend served by Django; keep this to run without rebuilding |
| `templates/index.html` | Generated Django frontend entry point |
| `scripts/` | Build/check scripts and Windows cleanup/LAN helpers |
| `docs/` | Current editing, authentication, deployment and usage guides |
| `output/` | Preserved project-review PDFs, diagrams and earlier document deliverables |
| `backups/` | Private local database snapshots, excluded from Git |

`dist/`, Python caches and collected `staticfiles/` are generated outputs. `node_modules/` contains installed dependencies. These directories are excluded from Git. The source `index.html` and generated `templates/index.html` serve different build/runtime purposes and both are required. Public images and their built copies are also intentional.

## Checks and cleanup

```powershell
npm run lint
npm run test:data
npm run build
python manage.py check
python manage.py test
npm run clean
```

`lint` checks JavaScript/JSX syntax and import resolution. `test:data` checks college/roadmap helpers. `build` creates Vite output and updates the Django template/static assets.

`clean` removes disposable `dist/` output and Python bytecode caches. It preserves source, environment variables, databases, backups, documents, installed dependencies and current Django frontend assets. To remove the separately generated collected-static directory too, run:

```powershell
npm run clean -- -IncludeCollectedStatic
```

Use that option only when collected static files are not serving a deployed site. Regenerate them with `python manage.py collectstatic --noinput` before production use.

The cleanup removed temporary sample preview servers/data, an unreferenced header, superseded screenshots and obsolete CSS. Source formatting is consistent, and duplicate shortlist parsing was replaced with the shared helper. No schema or user-data deletion is part of cleanup.

## Data and deployment

The current database is SQLite (`db.sqlite3`). Uploaded profile images are stored privately in that database. Existing migrations and legacy tables remain to preserve data. Normal `seed_demo` adds missing sample colleges without overwriting edits; `--refresh` intentionally replaces matching sample records.

Render build command: `bash build.sh`

Render start command: `gunicorn campus_project.wsgi:application --bind 0.0.0.0:$PORT`

Set `DJANGO_DEBUG=0`, a long random `DJANGO_SECRET_KEY`, and the Render hostname in `DJANGO_ALLOWED_HOSTS`. The build installs dependencies, builds React, collects static files, migrates and seeds missing sample colleges. Render and local databases are separate. Ordinary Render filesystem storage is ephemeral; use persistent storage/database configuration to retain production records.

## Guides

- [Custom admin](docs/CUSTOM_ADMIN_GUIDE.md)
- [Authentication](docs/AUTHENTICATION_GUIDE.md) and [login UI](docs/AUTH_UI_GUIDE.md)
- [Student profiles](docs/STUDENT_PROFILE_GUIDE.md)
- [Home editing](docs/HOME_SCREEN_GUIDE.md)
- [College directory](docs/ALL_COLLEGES_GUIDE.md) and [college details](docs/COLLEGE_DETAILS_GUIDE.md)
- [Career roadmaps](docs/CAREER_ROADMAP_GUIDE.md)
- [Local-network setup](docs/REDESIGN_AND_NETWORK_GUIDE.md)
