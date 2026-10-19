# Historical UI design notes

Authentication is now connected. For current functionality, configuration and security details, read [Authentication guide](AUTHENTICATION_GUIDE.md). The preview-only status descriptions below describe the earlier UI milestone.

# Sign In and Sign Up screen

## What changed

The account screen follows the supplied Campus Connect reference: blue/pastel campus artwork, student illustration, introduction, benefit rows, career tiles and a white form card. The existing home header Log In and Sign Up buttons open the appropriate tab; Back to Home returns to the landing page.

Sign In and Sign Up sit in a horizontal flex track. React changes the selected mode and CSS transform translates the track, with a sliding tab indicator and smoothly changing card height. Keyboard arrow keys select tabs; inactive forms are inert. Reduced-motion preferences disable animation. Small screens use a stacked layout.

## Files to edit

- `src/screens/LoginPage.jsx`: headings, labels, tabs, forms, preview handlers and state.
- `src/screens/LoginPage.css`: layout, colors, responsive rules and animation.
- `src/components/auth/AuthIcon.jsx`: SVG form icons.
- `public/auth/campus-student.png`: generated campus/student illustration.
- `src/App.jsx`: existing account/login screen navigation.

After editing, use `npm run dev` for live frontend updates, or `npm run build` then restart Django to view the built website. On Render, commit/push these changes and redeploy with the existing build command.

## Authentication technology: actual status

| Feature | Current implementation | For a working backend later |
| --- | --- | --- |
| Email login and account creation | React JavaScript forms and browser validation; preview message only | Django authentication, password hashing, sessions and CSRF protection |
| Google button | Preview message only; no Google connection | Google OAuth/OpenID Connect integration |
| Phone OTP | Phone and six-digit code screens; no SMS or verification | SMS provider such as Twilio Verify with server-side send/check endpoints |
| Forgot password | Email form and preview message; no reset email | Django password-reset token views and an SMTP email provider |
| Show password | React toggles the input type | Already functional UI |

No credentials, phone numbers or codes are sent or stored by this page. No account is created and no login session is established. No OTP/SMS, Google OAuth, email provider, JWT library or authentication backend was added. The existing Django admin authentication is separate from this public UI. Terms and Privacy buttons display clearly labelled policy placeholders; replace them with real published policies before enabling registration.

Official references for a future implementation:
- Django authentication: https://docs.djangoproject.com/en/5.2/topics/auth/default/
- Django password reset: https://docs.djangoproject.com/en/5.2/topics/auth/default/#django.contrib.auth.views.PasswordResetView
- Twilio Verify: https://www.twilio.com/docs/verify/api

## Illustration provenance

Asset: `public/auth/campus-student.png`, generated with OpenAI ImageGen for this project. This is separate artwork rather than a crop of the reference UI. The surrounding interface is React and CSS.

Generation prompt: Use case: illustration-story. Asset type: background artwork for a college website login screen, landscape 3:2 composition. Beautiful polished stylized 3D animated-film illustration, an Indian male university student age 19-22, friendly expressive eyes, thick wavy dark hair, navy blue hoodie and backpack, holding cream and blue notebooks against his chest. He stands in the LEFTMOST QUARTER of the image, visible from knees up, looking upward toward the right. Position his head below the image vertical midpoint, so the upper left half remains mostly pale clean sky for code-rendered heading text. Background: warm peach university academic building with arches, lush green campus lawn and a winding paved path, flowers and trees around the lower edge. Soft bright blue and lavender pastel sky throughout most of image, sunlit greenery at far left edge. The entire RIGHT HALF must remain extremely soft, light blue and white low-detail sky and softly blurred distant greenery, as a white form card will cover it. Friendly aspirational campus mood, refined lighting, high detail on student, uncluttered backdrop. NO typography, NO letters, NO text, NO website controls, NO UI cards, NO charts, NO logos, NO watermarks. Artwork only, not a login-page mockup.
