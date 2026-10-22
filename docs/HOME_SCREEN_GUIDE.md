# Home-page editing guide

The home page links to colleges, career roadmaps, community, guidance and account/profile screens. Authentication and profiles are connected to Django. The custom admin is available at /admin/.

## Files to edit

| File | Responsibility |
| --- | --- |
| src/screens/HomeScreen.jsx | Hero, featured colleges, roadmap links and calls to action |
| src/screens/CampusHome.css | Current home layout and colours |
| src/components/landing/LandingShared.css | Shared header and college-image styles |
| src/components/landing/LandingHeader.jsx | Navigation, search, account button and mobile menu |
| src/components/landing/LandingIcon.jsx | SVG icons |
| src/components/landing/CollegeImage.jsx | Campus images and unavailable-image fallback |
| src/App.jsx | Public screen selection and deep-link handling |
| src/api.js | Public catalogue, authentication and profile API helpers |
| public/landing/campus-future.png | Current home hero image |

App owns currentScreen. The header uses onNavigate to select a page. College and career selections also update ?college= and ?career= URLs, which survive refresh. The admin has separate /admin/ routes. Staff account buttons return to admin; student account buttons open their profile.

The public catalogue loads /api/bootstrap/ and /api/roadmaps/. Manage current content through the custom admin. Roadmap JavaScript definitions supply initial content before bootstrap; the published database catalogue replaces them after loading. Shortlisted colleges are stored only in this browser.

After source edits run npm run build, restart Django if needed, and refresh. For live public-frontend editing run npm run dev alongside Django and open http://localhost:3000/static/frontend/. See README.md for local startup and deployment, and REDESIGN_AND_NETWORK_GUIDE.md for hero-art provenance and same-network access.

## Asset provenance

The original student cutout, now reused in career-page artwork, was created with the built-in image-generation tool and saved as public/landing/student-hero.png. The original uploaded website screenshot is used as a visual reference, not as the page background. Icons, cards, badges and text are code-native.

Generation prompt: "Use case: photorealistic-natural. Asset type: transparent cutout hero photo for an Indian college and careers landing page. Create a single photorealistic Indian male university student, age 20-23, thick wavy dark hair, friendly natural smile, looking slightly upward toward the viewer's right. Wearing an open blue denim jacket over a light shirt and black backpack straps on both shoulders, holding a closed silver laptop against his chest with one arm. Frame from waist up with entire head and shoulders intact, subject centered, waist can end at bottom image boundary. Clean professional daylight photography, real skin texture, crisp edges. Genuine transparent background. No text, no labels, no icons, no circles, no buildings, no background, no watermark. This is an asset to be composed in code, not a website screenshot."
