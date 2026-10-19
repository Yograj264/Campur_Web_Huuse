# Campus Web Connect

A small React JavaScript website with a Django college catalogue. The current scope follows the landing page only.

## Included

- Landing page, hero, college carousel, and five career cards.
- College directory with search and read-only college details.
- Five simple editorial career guides, selected from the landing cards.
- Django session authentication with email OTP registration, email/password login, logout, password recovery and optional Twilio phone OTP. See [Authentication setup and working flow](docs/AUTHENTICATION_GUIDE.md).
- A consistent responsive header across home, colleges, and careers.
- Django admin for editing colleges and one read-only catalogue endpoint.

Dashboard, community discussions, mentor requests, profile progress, notifications, reminders, assessment, ROI, comparison dialogs, and the unfinished Expo starter have been removed from the active application. Plan Your Future now opens the career guides.

## Run on this computer

```powershell
cd "D:\College Project\Campus"
& "..\.venv\Scripts\python.exe" manage.py runserver
```

Open http://127.0.0.1:8000/. For automatic frontend updates, keep Django running, open another terminal in Campus, run `npm run dev`, and open http://localhost:3000/static/frontend/.

## Source layout

```text
src/
  App.jsx                         Screen selection and college loading
  api.js                          Read-only API helper
  main.jsx / index.css            Entry point and shared basics
  screens/
    HomeScreen.jsx / .css         Landing-page content and styling
    CollegesScreen.jsx            Directory and college detail view
    CareersScreen.jsx             Roadmap list and selected guide
    LoginPage.jsx / .css          Connected account forms and sliding panels
  components/landing/
    LandingHeader.jsx             Header and responsive menu
    LandingIcon.jsx               SVG icons
    CollegeImage.jsx              College image and fallback
  data/roadmaps.js                 Five editorial guide definitions
portal/
  views.py / urls.py              College catalogue and authentication routes
  models.py / admin.py            Catalogue model and admin
  demo_data.json                  Sample colleges for seeding
  management/commands/seed_demo.py
  migrations/                     Existing schema history
```

## Data and compatibility

Your existing db.sqlite3 is preserved. Only College is exposed through the active API and admin. Legacy models and their original migration are intentionally retained to avoid dropping stored discussion, answer, preference, or mentor-question records. They have no public routes or application features. Retire those tables later only through a deliberate data-retention decision.

```powershell
& "..\.venv\Scripts\python.exe" manage.py migrate
& "..\.venv\Scripts\python.exe" manage.py seed_demo
& "..\.venv\Scripts\python.exe" manage.py createsuperuser
```

Normal seeding inserts missing sample colleges and preserves existing edits. `seed_demo --refresh` intentionally replaces matching sample college records. Add or edit current records in /admin/. All supplied college facts are sample information, not live verified admissions data.

## Check and build

```powershell
npm run lint
npm run build
& "..\.venv\Scripts\python.exe" manage.py check
& "..\.venv\Scripts\python.exe" manage.py test portal
```

`npm run lint` checks JavaScript/JSX syntax and resolves the application imports with esbuild. `npm run build` builds Vite, replaces compiled assets, copies public images, and updates the Django template. If a manually started Django server still references old assets after rebuilding, restart it and hard-refresh the browser. `npm run clean` removes dist and source Python caches, preserving the database and current frontend assets.

The frontend uses ordinary CSS; TypeScript and Tailwind are no longer needed. Historical PDFs under output are retained as documents about earlier project versions, not descriptions of this simplified version.

## Render

Build Command: `bash build.sh`

Start Command: `gunicorn campus_project.wsgi:application --bind 0.0.0.0:$PORT`

Set `DJANGO_DEBUG=0`, a generated `DJANGO_SECRET_KEY`, and your hostname in `DJANGO_ALLOWED_HOSTS`. The build installs dependencies, builds React, collects static files for WhiteNoise, applies migrations, and imports missing sample colleges. The current database is still SQLite; ordinary Render filesystem storage is ephemeral. Configure durable database storage before retaining real production data.

More editing instructions: [docs/HOME_SCREEN_GUIDE.md](docs/HOME_SCREEN_GUIDE.md).
