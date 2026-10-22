# Student profiles and dashboard

Students complete their profile after email/password login, verified email signup or optional phone OTP login. The account button reopens the dashboard. Existing staff accounts use the separate admin panel.

## Information collected

Required: full name, education stage, school/college, city and at least one career goal.

Optional: course/stream, graduation year, school qualification and completion year, headline, interests, skills, preferred career fields, personal goals, biography, quote, LinkedIn/GitHub links, mentorship interest, avatar and cover.

- Career goals: dropdown checklist, one to three selections.
- Preferred career fields: optional dropdown checklist, maximum three.
- Skills: searchable, alphabetically sorted checkbox list with 176 suggestions. Existing custom values are retained. The stored field supports up to 500 characters.
- Selection lists stay open while checking options; outside clicks, focus moving outside and Escape close them.
- Current Goals: a separate personal task list, one goal per line; it is not the career-goal checklist.
- School/graduation years: 1950–2100. Social links: HTTPS URLs.

Profile completion uses the five required essentials; optional photos do not block setup. Edit Profile, Change Cover and the avatar edit button open the editing form. Save persists the details; Cancel discards unsaved changes. Account email is displayed but cannot be changed by this student form.

## Dashboard

The cover fills the profile container as a horizontal banner. The header shows the avatar, name, academic information, headline, location and quote. There is no left navigation panel.

Tabs: Overview, My Interests, Saved, My Sessions, My Posts, Notifications and Settings. Account Settings and Log Out appear only in Settings. Overview shows About Me, skills, goals, preferred fields, shortlisted colleges, guidance links and the mentor empty state.

Summary counts reflect the saved profile and this browser's actual shortlists. Colleges and roadmaps are saved locally in the browser, not synced between accounts/devices. Saved cards open their public pages and can be removed. Live mentor matching/booking, personal post history and notifications are not implemented; their tabs explain this instead of showing invented activity. Community and guidance links open the existing working pages.

## Storage and access

StudentProfile is linked one-to-one to Django User. Existing accounts receive a profile on the next session/profile lookup. Saving a full name updates the header name. All profile/image requests require authentication, updates require CSRF, and the backend always selects request.user. Another user ID cannot be supplied to fetch or modify someone else's profile. Responses are not cached.

JPEG, PNG and WebP uploads are limited to 2 MB and 10 megapixels. Pillow validates actual content, applies EXIF orientation and re-encodes JPEG without passing through source metadata. Avatar size is 512 × 512; cover size is 1600 × 400. Both images are private database binary fields. SVG/fake/oversized images are rejected, and source filenames are not used as storage paths. Images can be replaced or removed.

These images persist only as long as the database persists. Ephemeral SQLite storage on Render is not durable; configure persistent database/storage for production. Social links do not connect OAuth accounts. Mentorship interest is a preference, not a booking or a public listing.

## API

- GET /api/profile/: own details, completion and private image URLs.
- POST /api/profile/: multipart profile fields plus optional photo_upload/remove_photo and cover_upload/remove_cover.
- GET /api/profile/photo/ and /api/profile/cover/: own normalized JPEG; anonymous requests return 401, missing images return 404.
- GET /api/auth/session/: identity, staff status, completion and avatar metadata.

## Files

- src/screens/StudentDashboard.jsx and .css: setup/editing, uploads, validation and saving.
- src/screens/ProfileOverview.jsx and .css: current dashboard and tabs.
- src/screens/ProfileChoices.jsx and .css: dropdown/search/checkbox interaction.
- src/data/profileOptions.js: suggested goals, fields and alphabetically sorted skills.
- src/App.jsx and src/api.js: navigation, session restore and CSRF-aware requests.
- portal/models.py, profile_forms.py and profile_views.py: storage, validation and private endpoints.
- portal/test_profile.py: persistence, access control, uploads and selection-limit tests.
- portal/migrations/0003_studentprofile.py and 0004_studentprofile_available_for_mentorship_and_more.py: required profile schema history.

Run python manage.py migrate after deploying model changes, then npm run build after frontend edits and restart Django as needed. Selection controls reuse the existing text fields and do not require another migration. The existing Render build already handles migrations and frontend builds. Local changes do not update Render until deployment.

Previews: docs/profile-wide-cover-preview.png and docs/profile-expanded-skills-preview.png. Database backups are retained under the Git-ignored backups/ directory. Temporary development preview servers and fixtures were removed during cleanup.
