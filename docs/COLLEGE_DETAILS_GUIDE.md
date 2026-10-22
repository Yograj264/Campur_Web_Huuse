# College details redesign

The individual college page now follows the supplied reference: left navigation, a campus banner with an institution mark, location/accreditation badges, Share/Save/Compare controls, a scrollable tab row, a facts strip, overview/location panels, course cards, placements, facilities, reviews and a community sidebar. The layout stacks on smaller screens. The existing header/account photo and student dashboard remain connected.

## Working controls

- All nine information tabs work, including keyboard arrows/Home/End.
- Course View Details opens a native accessible dialog.
- Compare selects another real college and displays its available catalogue values side by side.
- Save uses the existing device-local college shortlist shared with the home page.
- Share uses the browser share sheet where supported, or clipboard copy; on browsers without clipboard access it displays the link to copy manually.
- A URL such as /?college=iit-delhi opens that college directly and survives refresh. Navigation away clears the college parameter.
- The campus photo opens in a larger dialog. It is not labelled as a video tour.
- Location opens a Google Maps search. The small map illustration is a navigation preview, not a geocoded campus map.
- Community questions are loaded from the real community API. College-name matches are preferred; otherwise the panel explicitly says Across Campus Connect.

## Data and empty states

Existing name, image, location, category, accreditation, entrance exam, fees, package, placement rate, programmes and cutoff records are preserved. No fabricated membership counts, student counts, ratings, posts, videos or verified alumni profiles were added. Missing information is labelled as unavailable.

The existing College.data JSON field can optionally contain the following additional keys. Add verified information through Django Admin → Colleges → select a college → Data. Preserve existing keys when editing.

- description: text for About.
- logo: an image URL for the institution logo. Without it an icon and initials are shown.
- address: the campus address.
- courses: an array of objects containing name, description, duration, annualFee and eligibility. Without this, programme names are derived from the existing programmes field; fees/durations are not guessed.
- highestCtc: a display string for the highest placement package.
- recruiters: a list of company names.
- facilities: a list of facility names.
- admissions: text describing the current admission process.
- hostel: accommodation information.
- campusLife: campus-life information.
- reviews: a list with name, body, optional course, and an optional rating between 1 and 5. These are administrator-published reviews, not a newly added review-submission system.

Existing figures remain sample/admin-managed data. Confirm them with the institution before use. Campus-specific event feeds, verified alumni directories and video tours have not been implemented.

## Files

- src/screens/CollegeDetails.jsx: page content, tabs, dialogs, comparison and actions.
- src/screens/CollegeDetails.css: reference layout and responsive styling.
- src/data/collegeDetails.js: optional-data normalization and shortlist access.
- src/screens/CollegesScreen.jsx: college directory, with the old details component removed.
- src/App.jsx: selected college and shareable college URL handling.
- scripts/test-college-details.mjs: data/shortlist regression checks.

Use npm run dev for live frontend editing. Use npm run build and restart Django for the built application. Push/redeploy to update Render. This redesign does not require a database migration.
