# Authentication: implementation and setup

## What is connected

The React Sign In/Sign Up page now calls Django APIs. Email registration requires a real code check before a user is created. Email/password login establishes a Django session. Logout clears it. Refresh restores the signed-in header. Forgot Password sends an email code; a valid code and a valid new password change the password. Phone OTP is integrated with Twilio Verify, but needs your provider account and credentials.

Google login remains disabled and is labelled as unconfigured. It requires a separate OAuth/OpenID Connect setup; SMTP email and phone OTP do not enable Google login.

## Technologies used

| Part | Technology and reason |
| --- | --- |
| Interface | React JavaScript, CSS slider transitions, HTML form validation |
| Backend | Django JSON views and built-in User/authenticate/login/logout APIs |
| Passwords | Django password hashing (default PBKDF2-SHA256), password validators; never plaintext in database |
| Login persistence | Database-backed Django sessions, HttpOnly session cookie, SameSite=Lax; Secure cookies when DEBUG=0 |
| Request protection | Django CSRF middleware; React obtains a CSRF token then sends X-CSRFToken with POST requests |
| Email OTP | Python secrets generates six digits; Django hashes the code, records expiry/attempts, and sends with send_mail |
| Email transport | Django console backend for local development; SMTP backend for real delivery |
| Phone OTP | Twilio Verify HTTPS REST API, called server-side with Python standard-library urllib; Twilio generates/sends/checks the SMS code |
| Configuration | python-dotenv loads the project .env without overriding environment variables configured on Render |
| Storage | Existing SQLite database plus three new models and one migration; existing catalogue data is preserved |

There is no JWT or localStorage token. This website uses same-origin cookies. React is not the authority for whether a user is logged in: Django's session is.

## Working flow

### 1. Email registration

1. Home Sign Up opens the existing sliding account screen.
2. Student enters name, email and password, and confirms registration terms.
3. React gets /api/auth/session/ for its CSRF token, then POSTs /api/auth/signup/.
4. Django normalizes the email, validates the password and applies delivery rate limits.
5. Django generates a random six-digit OTP. It stores only its password hash. The pending registration stores a hashed password and name, not a plaintext password. No User is created yet.
6. An email is sent (or printed in the Django terminal with the development console backend).
7. The browser displays the email verification form. Enter the code in the same browser/session.
8. POST /api/auth/verify/ checks the challenge, expiry and attempts. Success creates the User, consumes the challenge, removes its sensitive payload, and logs the user in.
9. The home header shows the account name and Log Out. Refresh keeps the session.

The stored pending password is the one from step 2. To change those details or request a replacement code, use Start again and submit the registration form again after the cooldown.

### 2. Email login and logout

1. Enter email and password and select Log In.
2. Django finds the account by email and uses authenticate() to verify the password hash and active status.
3. login() rotates the browser's session key; the browser receives a session cookie.
4. GET /api/auth/session/ restores the signed-in user on later page loads.
5. Log Out POSTs /api/auth/logout/ and Django clears the session.

Email OTP is required at registration, not at every password login. This is email verification, not two-factor authentication. Public college and career pages remain public; this change does not add a private dashboard.

### 3. Forgot password using email OTP

1. Select Forgot password, enter the account email, then Send Reset Code.
2. A registered active account receives a six-digit email code. Unknown email addresses receive a generic response and no email is sent.
3. Enter the code and a new password in the same browser.
4. Django validates the code and new password, updates the password hash and consumes the challenge.
5. Log in with the new password. Existing login sessions fail Django's password-version check on their next request.

This implementation uses an email OTP, not a reset link. It also records the password version on each reset challenge, so previously issued reset codes cannot be used again after the password changes.

### 4. Phone OTP

1. Select Continue/Sign Up with Phone Number.
2. Enter an international number such as +919876543210 and Send OTP.
3. Django calls Twilio Verify's Verifications endpoint with Channel=sms. Provider credentials stay on Django.
4. Twilio delivers the code; the browser shows code entry only after the send request succeeds.
5. Enter the six-digit code. Django calls VerificationCheck and accepts only status=approved.
6. A verified number signs in its existing PhoneIdentity account, or creates a separate phone-only account with an unusable password.

Phone and email accounts are separate; the app does not silently merge them. Phone-only accounts use SMS login and cannot use email password recovery. Account linking and additional identity proof would need a separate feature. SMS login proves control of the phone number, not two independent factors. Number recycling/SIM takeover are reasons to review SMS-only login before using it for sensitive services.

## Run locally from the beginning

Open PowerShell:

```powershell
cd "D:\College Project\Campus"
& "..\.venv\Scripts\Activate.ps1"
python -m pip install -r requirements.txt
python manage.py migrate
npm ci --include=dev
npm run build
python manage.py runserver
```

If your current virtual environment says `No module named pip`, first run `python -m ensurepip --upgrade`, then repeat the install command. The current project environment already has the added dependency installed.

Open http://127.0.0.1:8000/. Your existing .env is preserved. Add/edit settings in it using .env.example as a reference; do not overwrite an existing secret.

For local code delivery set:

```dotenv
DJANGO_DEBUG=1
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

Register using your own email. Read the six-digit code from the terminal running Django and enter it in the page. This tests the real backend verification/session flow but sends no email. Codes are never returned in an API response. After changing .env, restart Django.

For live frontend editing, keep Django at port 8000 and run `npm run dev` in another terminal. Open the Vite address. Built-in trusted development origins cover localhost:3000 and 127.0.0.1:3000. For another LAN device, add its frontend origin, including http:// and port, to DJANGO_CSRF_TRUSTED_ORIGINS and add the host to DJANGO_ALLOWED_HOSTS.

## Enable real email OTP

1. Obtain SMTP credentials from your email provider. Verify the sending address/domain if the provider requires it.
2. In .env locally, or Environment on Render, set:

```dotenv
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=your-provider-smtp-host
EMAIL_PORT=587
EMAIL_USE_TLS=1
EMAIL_HOST_USER=your-smtp-username
EMAIL_HOST_PASSWORD=your-smtp-password-or-app-password
DEFAULT_FROM_EMAIL=Campus Connect <your-verified-sender@example.com>
```

3. Use your provider's actual values. The example address/host above will not deliver mail. This implementation uses STARTTLS on port 587; choose a provider that supports it.
4. Restart locally or redeploy on Render.
5. Register with an inbox you control, check Inbox/Spam, and enter the code. Test Forgot Password as well.
6. If delivery fails, check SMTP credentials, sender verification, provider logs, and whether the hosting plan permits SMTP egress. A successful SMTP handoff does not guarantee inbox delivery. If your host blocks SMTP, use a supported email API transport as a follow-up integration.

For Gmail-based local testing, Google requires 2-Step Verification for app passwords. Where your Google account supports it, create an app password and use it rather than your normal Google password. Some managed/protected accounts do not offer this option. Follow your provider's current instructions; do not enable obsolete less-secure-app access.

Official references: [Django email backends](https://docs.djangoproject.com/en/5.2/topics/email/), [Google app passwords](https://support.google.com/accounts/answer/185833?hl=en).

## Enable real phone OTP

1. Create/sign in to your Twilio account yourself.
2. In Twilio Console, create a Verify Service with SMS enabled; use a six-digit code length to match this UI.
3. Copy Account SID (AC...), Auth Token, and Verify Service SID (VA...). The Verify Service SID is not a Messaging Service SID.
4. Set these backend environment variables:

```dotenv
TWILIO_ACCOUNT_SID=AC_your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_VERIFY_SERVICE_SID=VA_your_verify_service_sid
```

5. Configure allowed destination countries and provider fraud/rate protections in Twilio. Follow any country-specific sender/registration requirements shown by Twilio. SMS delivery can incur provider charges.
6. On a trial account, verify the recipient number in Twilio before testing; trial delivery is limited to verified recipients.
7. Restart Django/redeploy, enter a number you control with country code, request the SMS, then verify it on the website.
8. If it fails, inspect Twilio Verify logs for destination restrictions, balance/account limits, expired verification, delivery errors or credentials. The site deliberately returns a general provider error rather than exposing secrets.

Do not place these values in React, VITE_ variables, Git, screenshots, or public documentation. The browser talks only to Django, and Django talks to Twilio.

Official references: [Verify quickstarts](https://www.twilio.com/docs/verify/quickstarts), [send verification](https://www.twilio.com/docs/verify/api/verification), [check code](https://www.twilio.com/docs/verify/api/verification-check), [trial testing](https://www.twilio.com/docs/usage/trials/try-out-verify).

## Limits and lifecycle

- App challenges expire after 10 minutes; Twilio's own limits also apply to SMS.
- At most five code checks per challenge. A malformed/wrong code consumes an attempt.
- At most one send per destination per 60 seconds and five per destination per hour.
- At most 10 password login attempts per email per 10 minutes.
- At most 20 verification requests per browser session per 10 minutes.
- A database-backed IP limit allows 60 auth POSTs per 10 minutes. On a reverse proxy the app may see a shared proxy address: this conservative limit can affect multiple users. Configure trusted client-IP handling/edge rate limiting for a larger deployment; do not blindly trust client-supplied forwarding headers.
- Challenges bind to the browser session, purpose and destination, not just the typed OTP. Resending invalidates previous same-session challenges for that destination/purpose.
- A background send queue, CAPTCHA, shared distributed throttling, verified account linking and Google OAuth are not included.
- Run `python manage.py cleanup_auth` regularly (for example daily through your hosting scheduler) to remove expired pending registrations/challenges and old rate records.

## Render checklist

The existing build.sh already installs requirements, builds React and runs migrations. Keep the existing Gunicorn start command. Add DJANGO_DEBUG=0, a long random DJANGO_SECRET_KEY, allowed hostname, SMTP settings, and optional Twilio settings in Render Environment. Render's hostname is added to allowed hosts and trusted HTTPS CSRF origins automatically. HTTPS session/CSRF cookies are enabled with DEBUG=0.

Authentication requires persistent database storage. The default SQLite file on an ephemeral deployment can disappear on redeploy/restart. Configure a persistent disk mounted at /var/data and set DJANGO_DB_PATH=/var/data/db.sqlite3 before relying on accounts. This path starts a different database: migrate and seed it, and migrate/copy existing records deliberately if needed. For multi-instance production deployments, move to a shared database such as PostgreSQL with appropriate configuration and review throttling/concurrency. No hosted database or paid provider account was provisioned by this change.

## Files and API reference

| File | Role |
| --- | --- |
| portal/auth_views.py | Validation, authentication, OTP delivery/checking, throttling, session APIs |
| portal/models.py | AuthChallenge, AuthRate, PhoneIdentity; original models preserved |
| portal/migrations/0002_authchallenge_authrate_phoneidentity.py | Adds authentication tables |
| portal/urls.py | Registers /api/auth/<action>/ |
| campus_project/settings.py | .env, SMTP, Twilio, cookie, origin and database settings |
| src/api.js | CSRF-aware authRequest helper |
| src/screens/LoginPage.jsx | Connected account, code entry and recovery forms |
| src/App.jsx | Session restore, successful login and logout state |
| src/components/landing/LandingHeader.jsx | Signed-in name and Log Out |
| .env.example | Configuration template, containing no real credentials |
| portal/test_auth.py | Automated authentication/security/provider-mock tests |
| portal/management/commands/cleanup_auth.py | Expired authentication record cleanup |

GET /api/auth/session/ returns {user, csrfToken}. POST actions: signup, login, logout, reset, phone, verify. Signup/reset/phone return a challenge identifier; verify takes challenge plus otp (and a new password for reset). User responses expose only id/name/email. OTPs and password hashes are never included in API responses.

Backend tests use in-memory email and mocked Twilio calls, so they do not send paid SMS or real emails. Actual SMTP/SMS delivery remains to be tested after you configure your own credentials.

Django reference: [Built-in authentication](https://docs.djangoproject.com/en/5.2/topics/auth/default/).
