# Career roadmap redesign

The career directory and all five career detail pages now follow the supplied reference: left navigation, an illustrated lavender hero, tab navigation, a five-step roadmap, degree cards, skill stages, learning resources and a right-hand overview. The layout adapts to smaller screens.

## Files to edit

- `src/screens/CareersScreen.jsx`: directory, page layout and interactive controls.
- `src/screens/CareersScreen.css`: colours, spacing, cards and responsive layouts.
- `src/data/careerDetails.js`: role descriptions, skills, tools, projects, education routes and resource links.
- `src/data/roadmaps.js`: existing career IDs and directory summaries.
- `src/App.jsx`: navigation and shareable career URLs.
- `public/landing/career-student.png`: hero illustration.

## Working controls

- Eight tabs switch between overview, career path, colleges/degrees, skills/tools, projects, job preparation, resources and community. Arrow keys, Home and End work in the tab row.
- Timeline and List View change the roadmap layout. Flexible, six-month and twelve-month options change suggested self-study pacing; these are not degree durations or employment promises.
- Degree filters narrow the education cards. View College Options opens matching programmes from the actual college catalogue; choosing a college opens its details. Missing matches show an empty state.
- Resource filters show official documentation, practice materials or guides. Resource links open the provider's website.
- Related Careers opens another career. A URL such as `http://127.0.0.1:8000/?career=software-development` can be shared and refreshed.
- Save stores career IDs in this browser's local storage under `campus-saved-careers`. It does not sync between devices or accounts.
- Share uses the browser share sheet where available, then clipboard or a manually copyable link.
- Community and profile buttons connect to the existing application pages. Verified alumni matching is not implemented; no fictional members are shown.

## Content and data

The five paths are Software Developer, Data Scientist, Cybersecurity Analyst, Product Manager and UI/UX Designer. Editorial content is separate from the layout. Salary, job growth, placement claims and student counts from the reference image are not invented. Education eligibility and duration must be confirmed with the institution.

Learning resources link to primary providers: [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development), [Python](https://docs.python.org/3/tutorial/), [GitHub Skills](https://skills.github.com/), [scikit-learn](https://scikit-learn.org/stable/user_guide.html), [OWASP](https://owasp.org/www-project-web-security-testing-guide/), [Scrum Guide](https://www.scrumguides.org/scrum-guide.html), [W3C](https://www.w3.org/WAI/tutorials/) and [Figma](https://help.figma.com/hc/en-us/categories/360002042553).

This change uses React JavaScript, CSS, native HTML dialogs and the existing Django-served frontend. It does not change authentication or database models, so no migration is required.

## Illustration provenance

`public/landing/career-student.png` was generated with the built-in image generation tool for this page. It is decorative artwork, not a real student photograph. Original output: `C:\Users\YOGRAJ BISTA\.codex\generated_images\01a12aae-6b80-7a81-ad4e-f889bef25602\exec-d70ee5e2-567b-4f50-99da-0ad9721d4572.png`.

Prompt: “Use case: illustration-story. Asset type: wide decorative illustration for a student career roadmap website hero. Friendly polished 3D editorial illustration of a young Indian university student in a lavender hoodie sitting at a desk using a dark laptop, green leafy plant at right, softly floating blank code panels and tiny programming symbols, pale lilac and blue background. Subject on RIGHT HALF, left half mostly empty pale lavender for code-rendered text overlay. Clean modern educational illustration, soft lighting, rounded forms, tasteful detail, landscape 3:2. No words, text, labels, logos, watermarks or interface controls. Artwork only.”

## Verification

Passed `node scripts/test-career-details.mjs`, `npm run lint`, `npm run build` and Django's `portal.tests.ProductionAssetsTests`. Browser checks covered timeline/list switching, pace selection, degree filtering, actual catalogue matches, resource filtering, related-career navigation and direct URLs. Preview: `docs/career-roadmap-preview.png`.

After future frontend edits, run `npm run build` to update the Django-served frontend. Restart a Django server launched with `--noreload`, then refresh the browser.
