# Campus Web House — Django project

Campus is now served by Python Django 5.2, with SQLite persistence and Django admin. The existing React/JavaScript UI is retained to preserve all screens, styling, mobile navigation, modals, comparison tools, and ROI calculator. This is a Django backend with a React frontend, rather than a rewrite into server-rendered pages.

## Start the prepared project on this computer

Open PowerShell in `D:\College Project\Campus` and run:

```powershell
& '..\.venv\Scripts\python.exe' manage.py runserver
```

Open http://127.0.0.1:8000/. The database has already been migrated and seeded, and the frontend assets are already built. Node.js is only required when editing/rebuilding the frontend.

## Set up on another computer

Requires Python 3.10+ and Node.js 20.19+ or 22.12+ for frontend builds.

```powershell
cd Campus
python -m venv .venv
& '.\.venv\Scripts\python.exe' -m pip install -r requirements.txt
npm ci
npm run build
& '.\.venv\Scripts\python.exe' manage.py migrate
& '.\.venv\Scripts\python.exe' manage.py seed_demo
& '.\.venv\Scripts\python.exe' manage.py runserver
```

## Manage content

Use the same Python executable as above:

```powershell
& '..\.venv\Scripts\python.exe' manage.py createsuperuser
```

Visit http://127.0.0.1:8000/admin/ to edit colleges, discussions, answers, and review saved mentor questions. On another computer use `.\.venv\Scripts\python.exe` instead.

## Features and persistence

- Colleges, discussions, and answers are stored in SQLite through Django models.
- Bookmarks, discussion/answer votes, helpful flags, deadline reminders, profile score, notification read state, and selected career track persist per browser session.
- New discussions and answers appear in the database; new threads start with their own answer list.
- Mentor questions are stored for review in Django admin. There is no email delivery or automatic mentor reply service.
- College searching, sorting, drawer filters, comparison, ROI calculator, career roadmaps, and assessment remain in the original frontend.
- The existing student profile is a demo profile. Student login/registration has not been introduced; admin uses Django authentication. Browser state follows Django session expiry (two weeks by default).
- Original admissions figures, deadlines, mentor identities, assessment results, and resources are sample content, not live verified feeds. Notification content, roadmap tasks, report dialogs, and several original toast-only controls remain demo interactions.

## Development and checks

After editing frontend files, run `npm run build` to update the Django HTML template and static assets. For hot reload, run Django and `npm run dev` together, and use the Vite URL printed by the terminal; `/api/` is proxied to Django.

```powershell
npm run lint
npm run build
& '..\.venv\Scripts\python.exe' manage.py check
& '..\.venv\Scripts\python.exe' manage.py test
```

`npm run seed:export` updates `portal/demo_data.json` from the original sample data. `seed_demo` is idempotent and preserves existing records. Its optional `--refresh` flag replaces bundled sample records; use it deliberately when updating sample content.

## Project cleanup

`npm run clean` removes the generated `dist/` build and Python bytecode caches within the Django source folders. It preserves the database, virtual environment, dependencies, and Django's current frontend assets. `npm run build` replaces those frontend assets with the latest build, so old hashed JavaScript and CSS files do not accumulate.

The unused Vite starter screens, images, duplicate configuration, AI Studio metadata, and unused Node packages have been removed. React and React DOM remain runtime dependencies; build and JavaScript-checking tools are development dependencies.

## Layout

- `manage.py`, `campus_project/`: Django configuration and entry points.
- `portal/`: models, admin, JSON views, migrations, tests, and sample data command.
- `templates/index.html`, `static/frontend/`: built frontend served by Django.
- `src/`: preserved frontend with Django API integration.
- `db.sqlite3`: local database, excluded from version control.

## Production settings

Set `DJANGO_DEBUG=0`, a strong `DJANGO_SECRET_KEY`, and `DJANGO_ALLOWED_HOSTS` in the process environment. `.env.example` documents the variables but is not loaded automatically. Run `manage.py collectstatic`, serve `staticfiles/` through a web server, and use a production WSGI/ASGI server with HTTPS. Production cookies require HTTPS. External fonts and original remote images need internet access.

The integration follows Django's [static files guidance](https://docs.djangoproject.com/en/5.2/howto/static-files/) and [CSRF guidance](https://docs.djangoproject.com/en/5.2/howto/csrf/).

## JavaScript source

React components now use `.jsx`; API and data modules use `.js`. The Vite configuration is `vite.config.js`. `npm run lint` checks JavaScript/JSX syntax and resolves the web application imports using esbuild; it is not a TypeScript or ESLint run. The unfinished Expo starter in `mobile/` also uses JavaScript and has not been converted into the full mobile application. Existing PDF review documents are historical snapshots and may still mention TypeScript.

## Render deployment

Create a Python web service with the root directory containing manage.py. Set Build Command to `bash build.sh` and Start Command to `gunicorn campus_project.wsgi:application --bind 0.0.0.0:$PORT`.

Set `DJANGO_DEBUG=0`, a generated `DJANGO_SECRET_KEY`, and `DJANGO_ALLOWED_HOSTS=campus-web-house.onrender.com` (or your actual hostname). Render's `RENDER_EXTERNAL_HOSTNAME` is also accepted automatically. Do not put a scheme or path in allowed hosts.

The build installs Python/Node dependencies, builds the React UI, collects static files, applies migrations, and imports missing demo records. WhiteNoise serves the collected JavaScript and CSS with DEBUG disabled. Vite already provides hashed filenames; compressed static storage preserves those paths.

This version still uses SQLite. Its file on an ordinary Render ephemeral filesystem is not durable across deployments/replacement instances. Use a properly configured persistent database before retaining real submissions. Setting DATABASE_URL alone does not configure this project's database. The build's seed command initializes demo content, not a backup of existing user data.

After pushing these changes and redeploying, check `/`, the script/CSS paths in its HTML, and `/api/bootstrap/`. If the API still returns 500, inspect Render's runtime logs for the traceback instead of enabling public DEBUG pages.
