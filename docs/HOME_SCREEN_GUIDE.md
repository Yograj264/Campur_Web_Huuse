# Home-page editing guide

## Current scope

The website is now limited to the landing page and its direct destinations: colleges, college details, career guides, and frontend-only account UI. The old dashboard, community, assessment, reminders, profile, mentor flows, extra dialogs, and Expo starter have been removed.

## What to edit

| File                                     | Responsibility                                    |
| ---------------------------------------- | ------------------------------------------------- |
| src/screens/HomeScreen.jsx               | Hero text, carousel, section headings and footer  |
| src/screens/HomeScreen.css               | Landing/header CSS and responsive breakpoints     |
| src/components/landing/LandingHeader.jsx | Shared navigation and active tab                  |
| src/components/landing/LandingIcon.jsx   | SVG icon shapes                                   |
| src/components/landing/CollegeImage.jsx  | Image display and fallback                        |
| src/screens/CollegesScreen.jsx           | College search, grid and read-only details        |
| src/screens/CareersScreen.jsx            | Guide list and selected guide                     |
| src/data/roadmaps.js                     | The five career titles, colors and learning steps |
| src/screens/LoginPage.jsx                | Sign In / Sign Up preview                         |
| src/App.jsx                              | React screen selection and catalogue loading      |
| src/index.css                            | Shared reset and simple subpage styles            |
| public/landing/student-hero.png          | Generated transparent student image               |

## Navigation

App owns currentScreen. Header calls onNavigate with home-discover, colleges-admissions, careers-roadmap, login, or account. App renders the matching screen. Clicking a college sets the selected record and opens college-detail. Clicking a career card sets its id and opens that specific guide. Plan Your Future opens the guide list. There is no backend login and no personalized assessment.

The header is the same on all content screens and highlights the current section. Login/Sign Up has its own Back to home control. Navigation is React state; browser URLs do not change.

## College data

App calls GET /api/bootstrap/ through src/api.js. The response contains only a colleges array. Edit colleges in Django admin; portal/demo_data.json contains the sample records used by seed_demo. There is no second frontend copy of the college data.

## Preview and deploy

Keep Django running on port 8000 and run npm run dev in another terminal for automatic updates. Open http://localhost:3000/static/frontend/.

For the Django-served page run npm run build, restart a manually started server if needed, and refresh with Ctrl+Shift+R. For Render, push the current files and redeploy using bash build.sh. The build copies public image assets to Django static output.

## Data preservation

The SQLite file and original migrations are preserved. Legacy backend model declarations remain solely for schema compatibility so this cleanup does not delete stored records. They are not available in the current UI, public API, or admin. Existing output PDFs are historical snapshots.

## Asset provenance

The hero photo was created with the built-in image-generation tool and saved as public/landing/student-hero.png. The original uploaded website screenshot is used as a visual reference, not as the page background. Icons, cards, badges and text are code-native.

Generation prompt: "Use case: photorealistic-natural. Asset type: transparent cutout hero photo for an Indian college and careers landing page. Create a single photorealistic Indian male university student, age 20-23, thick wavy dark hair, friendly natural smile, looking slightly upward toward the viewer's right. Wearing an open blue denim jacket over a light shirt and black backpack straps on both shoulders, holding a closed silver laptop against his chest with one arm. Frame from waist up with entire head and shoulders intact, subject centered, waist can end at bottom image boundary. Clean professional daylight photography, real skin texture, crisp edges. Genuine transparent background. No text, no labels, no icons, no circles, no buildings, no background, no watermark. This is an asset to be composed in code, not a website screenshot."
