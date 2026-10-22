# Custom Campus Connect admin

## Open and sign in

Open http://127.0.0.1:8000/admin/ and sign in using an existing active Django staff/superuser account. Either the username or a uniquely matching email address is accepted. Passwords are unchanged. This feature does not create a new real administrator or promote student accounts.

The original Django administration is preserved at /django-admin/. Use it for staff accounts, groups, permissions and any existing model fields not yet exposed in the custom forms. The new URL /admin/login/ shows the same custom login shell. Authenticated staff visiting it return to the dashboard. Public website account buttons take staff back to /admin/; staff returning to the website see the normal landing page.

The custom login follows the supplied navy/purple design. It uses existing Django sessions and CSRF, not Firebase. Google admin sign-in is not configured, so no fake Google login button is included. Forgot password gives guidance to contact another authorized administrator; it does not claim to send an email. Keep me signed in selects a seven-day session; otherwise the session expires on browser close. The image reuses public/landing/campus-future.png.

## Available management sections

| Section | Working operations |
| --- | --- |
| Dashboard | Current database totals, six-month registration counts, college-type chart, recent students, catalogue links, administrative audit log and quick navigation |
| Colleges | Search, paginate, create, edit, view on website and delete with typed confirmation |
| Students | Search, create, edit academic/account details, change a password, activate/deactivate and delete with confirmation |
| Courses & Programs | Associate with a college; edit duration, description, eligibility and optional annual fee; publish/unpublish and delete |
| Career Roadmaps | Edit title, summary, stages, role, tagline, description, skills, tools, project ideas, first steps, core topics, degree routes and HTTPS resource links; publish/unpublish and delete |
| Study Plans | Create a learning plan, optionally link a career roadmap, enter suggested duration and steps, publish/unpublish and delete |

Plans are educational study plans, not subscriptions or payment plans. Other navigation sections from the reference (events, reports, faculty, etc.) have not been added.

### Add a college and its courses

1. Choose Colleges, then Add College.
2. Enter its name, location and annual fee in lakh INR. Add optional type, accreditation, entrance examination, description and HTTPS campus image URL.
3. Save, then choose Courses & Programs and Add Course.
4. Select the college, enter its course name and details, enable publication and save.
5. Open the college's public page or refresh the catalogue to see the change.

College and course fees are annual amounts in lakh INR, not full-course totals. Do not enter rupee amounts directly into these fields.

### Add a student

Choose Students, then Add Student. Enter a name, unique email and strong initial password. Set the account active if the student should be able to sign in. Academic fields are optional; the student can complete their own profile afterward. Editing an existing student with the password field blank preserves their password. Password hashes are never returned by the API.

The Students screen excludes staff and superusers. Its requests cannot set is_staff, is_superuser or permissions. Use the original Django admin to manage authorized staff access.

### Publish a roadmap and study plan

Choose Career Roadmaps, then add or edit a roadmap. Enter one learning stage per line. The detailed content section provides normal text fields and repeatable degree/resource forms. Resource URLs must use HTTPS. Save with Published enabled.

Choose Study Plans to add a plan, select a roadmap and enter its steps, one per line. Published plans linked to a published roadmap appear under Learning Stages & Study Plans on that career page. A draft roadmap and its plans are excluded from the public roadmap API. Unassigned plans remain manageable in admin but do not appear on a public career page.

Saved changes are read from the database on the next public page refresh; content edits do not need npm run build. Changes to React/CSS source still need a build.

## Access control and validation

Every management API checks an authenticated, active staff account and the appropriate Django model permission for the requested view/add/change/delete action. A staff flag alone does not grant all operations. Student management additionally requires the corresponding auth.User and portal.StudentProfile permissions. Superusers already have these permissions. Navigation is filtered for the user's view permissions; action buttons follow their add/change/delete permissions. Backend checks remain authoritative.

CSRF protection applies to login, logout and mutations. Login attempts are rate limited. Requests and fields have size/length limits, fees cannot be negative, resource URLs are validated, and student email duplication is rejected. Deletes require a matching confirm_id and a typed confirmation in the UI. Deleting a college cascades to its managed courses; deleting a student cascades to their profile and linked authentication records; deleting a roadmap leaves study plans unassigned.

Create/update/delete actions are recorded in Django LogEntry. Superusers see recent administrative activity; other staff see their own log entries. Statistics, type charts and registration counts come from actual records. No sample approval statuses, mentor totals or monthly growth percentages are presented as real.

## Backend and frontend files

- src/admin/AdminApp.jsx: login, navigation, dashboard and management tables.
- src/admin/AdminEditor.jsx: validated create/edit forms.
- src/admin/Admin.css: reference styling and responsive layout.
- src/admin/api.js: session/CSRF-aware requests.
- src/main.jsx: chooses the admin UI for /admin/ URLs.
- portal/management_views.py: staff authentication, permissions, CRUD, summaries, audit and reference options.
- portal/management_forms.py: validated management inputs.
- portal/models.py: existing College/StudentProfile plus Course, CareerRoadmap and StudyPlan.
- portal/views.py: published catalogue/course/roadmap/plan data.
- campus_project/urls.py and portal/urls.py: page and API routes.
- portal/migrations/0005_careerroadmap_course_studyplan.py and 0006_seed_management_content.py: additive tables and import of the five existing roadmaps/course information.
- portal/management/commands/seed_demo.py: fresh installs also import sample programmes into course management without recreating deliberately deleted managed courses.

Existing college metadata, accounts and student profiles are retained. The original JavaScript roadmap content remains as a source snapshot/fallback, but after bootstrap the public interface uses the published database roadmaps. New roadmap IDs are generated once and stay stable when titles change.

API routes: /api/admin/session/, login/, logout/, summary/, options/, and colleges/, students/, courses/, roadmaps/, plans/ with optional record IDs. Public roadmaps are returned by /api/roadmaps/. Existing /api/bootstrap/ remains a colleges response.

## Deployment and checks

A local SQLite backup was created before migration: backups/before-custom-admin-20261022.sqlite3 (Git-ignored). Local migrations 0005 and 0006 were applied. At implementation the database contained 9 colleges, 28 course/program records, 5 roadmaps and 0 study plans. No real test records or administrator accounts were inserted by browser checks.

For another database/deployment, install the existing requirements, run npm run build, python manage.py migrate and python manage.py seed_demo, then restart Django. The existing Render build already includes these steps. Deploy the code to Render to update its separate application/database; a local migration does not update Render automatically.

Validation: 55 Django tests passed, including 10 new management tests. Relevant management/catalogue/asset tests were rerun after follow-up edits. JavaScript/import checks, the production build, migration consistency and existing career/college data checks passed. Browser checks covered the real login URL, the public database-backed roadmap page, dashboard layout and a college creation flow against an isolated in-memory preview. Roadmap degree/resource edit controls were inspected in that preview.

Screenshots: docs/admin-login-preview.png (real login shell), docs/admin-dashboard-preview.png (synthetic sample dashboard). Temporary preview-server scripts and fixtures were removed during project cleanup.
