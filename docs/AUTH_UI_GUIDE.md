# Sign In and Sign Up UI

The account screen uses React JavaScript and CSS to follow the supplied campus design. Authentication is connected to Django; read AUTHENTICATION_GUIDE.md for email OTP, password recovery, sessions and optional Twilio phone verification. Google sign-in is not configured.

Sign In and Sign Up use a translated flex track with an animated tab indicator. Keyboard arrows switch tabs, inactive forms are inert, reduced-motion preferences disable movement and small screens use a stacked layout. Show password toggles the input type. Login/signup completion opens the student dashboard; staff are directed to the admin.

Files: src/screens/LoginPage.jsx, LoginPage.css, src/components/auth/AuthIcon.jsx, public/auth/campus-student.png and src/App.jsx. Change appearance in the component/CSS; change validation and authentication in portal/auth_views.py.

After source changes run npm run build and restart Django as needed. The frontend uses CSS directly, without Tailwind or TypeScript.

## Illustration provenance

Asset: `public/auth/campus-student.png`, generated with OpenAI ImageGen for this project. This is separate artwork rather than a crop of the reference UI. The surrounding interface is React and CSS.

Generation prompt: Use case: illustration-story. Asset type: background artwork for a college website login screen, landscape 3:2 composition. Beautiful polished stylized 3D animated-film illustration, an Indian male university student age 19-22, friendly expressive eyes, thick wavy dark hair, navy blue hoodie and backpack, holding cream and blue notebooks against his chest. He stands in the LEFTMOST QUARTER of the image, visible from knees up, looking upward toward the right. Position his head below the image vertical midpoint, so the upper left half remains mostly pale clean sky for code-rendered heading text. Background: warm peach university academic building with arches, lush green campus lawn and a winding paved path, flowers and trees around the lower edge. Soft bright blue and lavender pastel sky throughout most of image, sunlit greenery at far left edge. The entire RIGHT HALF must remain extremely soft, light blue and white low-detail sky and softly blurred distant greenery, as a white form card will cover it. Friendly aspirational campus mood, refined lighting, high detail on student, uncluttered backdrop. NO typography, NO letters, NO text, NO website controls, NO UI cards, NO charts, NO logos, NO watermarks. Artwork only, not a login-page mockup.
