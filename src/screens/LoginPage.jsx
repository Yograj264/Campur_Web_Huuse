import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LandingIcon } from "../components/landing/LandingIcon";
import { AuthIcon } from "../components/auth/AuthIcon";
import "./LoginPage.css";
import { authRequest } from "../api";

function Field({ id, label, icon, trailing, ...props }) {
  return (
    <div className="cwa-field">
      <label htmlFor={id}>{label}</label>
      <div className="cwa-input-wrap">
        <AuthIcon name={icon} />
        <input id={id} {...props} />
        {trailing}
      </div>
    </div>
  );
}

export default function LoginPage({
  onBack,
  initialMode = "signup",
  onAuthenticated,
}) {
  const [mode, setMode] = useState(
    initialMode === "login" ? "login" : "signup",
  );
  const [flow, setFlow] = useState("email");
  const [challenge, setChallenge] = useState(null);
  const [busy, setBusy] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [message, setMessage] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({
    login: false,
    signup: false,
  });
  const [panelHeight, setPanelHeight] = useState(600);
  const [policy, setPolicy] = useState(null);
  const panelRefs = useRef({});
  const fieldRef = useRef(null);
  const policyCloseRef = useRef(null);
  const policyReturnRef = useRef(null);

  useLayoutEffect(() => {
    const panel = panelRefs.current[mode];
    if (!panel) return;
    const update = () =>
      setPanelHeight(Math.ceil(panel.getBoundingClientRect().height) + 2);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [mode, flow, otpStep]);

  useEffect(() => {
    if (flow !== "email") fieldRef.current?.focus({ preventScroll: true });
  }, [flow, otpStep]);

  useEffect(() => {
    if (!policy) return;
    policyCloseRef.current?.focus();
    const onEscape = (event) => {
      if (event.key === "Escape") setPolicy(null);
    };
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("keydown", onEscape);
      policyReturnRef.current?.focus();
    };
  }, [policy]);

  function switchMode(nextMode) {
    if (busy) return;
    setMode(nextMode);
    document.getElementById(`cwa-tab-${nextMode}`)?.focus();
    setChallenge(null);
    setFlow("email");
    setOtpStep(false);
    setMessage("");
  }

  function changeFlow(nextFlow) {
    if (busy) return;
    setChallenge(null);
    setFlow(nextFlow);
    setOtpStep(false);
    setMessage("");
  }

  async function submitAuth(event, action) {
    event.preventDefault();
    if (busy) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setMessage("");
    try {
      const result = await authRequest(
        challenge ? "verify" : action,
        challenge ? { ...values, challenge } : values,
      );
      if (result.user) {
        onAuthenticated(result.user);
        return;
      }
      if (result.challenge) {
        setChallenge(result.challenge);
        setOtpStep(true);
      } else if (challenge) {
        setChallenge(null);
        setOtpStep(false);
        setFlow("email");
        setMode("login");
      }
      setMessage(result.message || "Completed.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  function submitEmail(event, panelMode) {
    return submitAuth(event, panelMode === "login" ? "login" : "signup");
  }
  function submitPhone(event) {
    return submitAuth(event, "phone");
  }

  function openPolicy(kind, event) {
    policyReturnRef.current = event.currentTarget;
    setPolicy(kind);
  }

  function passwordField(panelMode) {
    const isVisible = visiblePasswords[panelMode];
    return (
      <Field
        id={`cwa-${panelMode}-password`}
        label={panelMode === "reset" ? "New Password" : "Password"}
        icon="lock"
        name="password"
        type={isVisible ? "text" : "password"}
        placeholder={
          panelMode === "login" ? "Enter your password" : "Create a password"
        }
        autoComplete={
          panelMode === "login" ? "current-password" : "new-password"
        }
        minLength={panelMode === "login" ? undefined : 8}
        required
        trailing={
          <button
            className="cwa-password-toggle"
            type="button"
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            onClick={() =>
              setVisiblePasswords((previous) => ({
                ...previous,
                [panelMode]: !previous[panelMode],
              }))
            }
          >
            <AuthIcon name={isVisible ? "eye" : "eyeOff"} size={19} />
          </button>
        }
      />
    );
  }

  function renderForm(panelMode) {
    const active = mode === panelMode;
    if (active && flow === "forgot")
      return (
        <form
          className="cwa-form cwa-flow-form"
          onSubmit={(event) => submitAuth(event, "reset")}
        >
          <button
            type="button"
            className="cwa-inline-back"
            onClick={() => changeFlow("email")}
          >
            <AuthIcon name="back" size={16} />
            Back to log in
          </button>
          <span className="cwa-flow-symbol">
            <AuthIcon name="lock" size={27} />
          </span>
          <h3>Forgot your password?</h3>
          <p>Enter your account email to receive a password reset code.</p>
          <Field
            id="cwa-reset-email"
            label="Email Address"
            icon="mail"
            name="email"
            type="email"
            placeholder="Enter your email address"
            autoComplete="email"
            required
            ref={fieldRef}
          />
          {challenge && (
            <button
              type="button"
              className="cwa-text-button"
              disabled={busy}
              onClick={() => {
                setChallenge(null);
                setMessage("Request another reset code after 60 seconds.");
              }}
            >
              Request another code
            </button>
          )}
          {challenge && (
            <>
              <Field
                id="reset-code"
                label="Verification Code"
                icon="lock"
                name="otp"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoComplete="one-time-code"
              />
              {passwordField("reset")}
            </>
          )}
          <button type="submit" className="cwa-primary" disabled={busy}>
            {challenge ? "Reset Password" : "Send Reset Code"}{" "}
            <AuthIcon name="arrow" size={19} />
          </button>
        </form>
      );
    if (active && flow === "phone")
      return (
        <form className="cwa-form cwa-flow-form" onSubmit={submitPhone}>
          <button
            type="button"
            className="cwa-inline-back"
            onClick={() => changeFlow("email")}
          >
            <AuthIcon name="back" size={16} />
            Use email instead
          </button>
          <span className="cwa-flow-symbol">
            <AuthIcon name="phone" size={27} />
          </span>
          <h3>
            {otpStep
              ? "Enter your verification code"
              : "Continue with your phone"}
          </h3>
          <p>
            {otpStep
              ? "Enter the six-digit code sent to your phone."
              : "Use your international phone number, including its country code."}
          </p>
          <Field
            id={`cwa-${panelMode}-phone`}
            label="Phone Number"
            icon="phone"
            name="phone"
            type="tel"
            placeholder="+919876543210"
            autoComplete="tel"
            pattern="[+]?[0-9]{8,15}"
            required
            readOnly={Boolean(challenge)}
            ref={!otpStep ? fieldRef : undefined}
          />
          {otpStep && (
            <Field
              id={`cwa-${panelMode}-otp`}
              label="Verification Code"
              icon="lock"
              name="otp"
              type="text"
              className="cwa-code-input"
              placeholder="000000"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              minLength={6}
              required
              ref={fieldRef}
            />
          )}
          <button type="submit" className="cwa-primary" disabled={busy}>
            {otpStep ? "Verify Code" : "Send OTP"}
            <AuthIcon name="arrow" size={19} />
          </button>
          {otpStep && (
            <button
              className="cwa-text-button"
              type="button"
              onClick={() => {
                setChallenge(null);
                setOtpStep(false);
                setMessage(
                  "Wait at least 60 seconds before requesting another code.",
                );
              }}
            >
              Resend code
            </button>
          )}
        </form>
      );
    if (active && challenge)
      return (
        <form
          className="cwa-form cwa-flow-form"
          onSubmit={(event) => submitAuth(event, "signup")}
        >
          <h3>Verify your email</h3>
          <p>
            Enter the six-digit code from your email. It expires in 10 minutes.
          </p>
          <Field
            id="signup-email-code"
            label="Email Verification Code"
            icon="lock"
            name="otp"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoComplete="one-time-code"
          />
          <button className="cwa-primary" disabled={busy}>
            Verify Email
          </button>
          <button
            type="button"
            className="cwa-text-button"
            disabled={busy}
            onClick={() => {
              setChallenge(null);
              setOtpStep(false);
              setMessage(
                "Request another code using the registration form. Please wait 60 seconds between requests.",
              );
            }}
          >
            Start again / request another code
          </button>
        </form>
      );
    return (
      <>
        <div className="cwa-social-options">
          <button
            type="button"
            className="cwa-provider"
            disabled
            title="Google sign-in is not configured. Use email or phone."
          >
            <AuthIcon name="google" size={21} />
            <span>Continue with Google</span>
          </button>
          <div className="cwa-divider">
            <span>or</span>
          </div>
          <button
            type="button"
            className="cwa-provider"
            onClick={() => {
              changeFlow("email");
              document.getElementById(`cwa-${panelMode}-identity`)?.focus();
            }}
          >
            <AuthIcon name="mail" />
            <span>
              {panelMode === "login"
                ? "Continue with Email"
                : "Sign Up with Email"}
            </span>
          </button>
          <button
            type="button"
            className="cwa-provider"
            onClick={() => changeFlow("phone")}
          >
            <AuthIcon name="phone" />
            <span>
              {panelMode === "login"
                ? "Continue with Phone Number"
                : "Sign Up with Phone Number"}
            </span>
          </button>
        </div>
        <div
          className={`cwa-divider cwa-form-divider ${panelMode === "signup" ? "has-label" : ""}`}
        >
          <span>{panelMode === "signup" ? "Or create with Email" : "or"}</span>
        </div>
        <form
          className="cwa-form"
          onSubmit={(event) => submitEmail(event, panelMode)}
        >
          {panelMode === "signup" && (
            <Field
              id="cwa-signup-name"
              label="Full Name"
              icon="user"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              required
            />
          )}
          <Field
            id={`cwa-${panelMode}-identity`}
            label={"Email Address"}
            icon={panelMode === "login" ? "user" : "mail"}
            name="identity"
            type={panelMode === "login" ? "text" : "email"}
            autoComplete={panelMode === "login" ? "username" : "email"}
            placeholder={
              panelMode === "login"
                ? "Enter your email address"
                : "Enter your email address"
            }
            required
          />
          {passwordField(panelMode)}
          {panelMode === "login" ? (
            <button
              type="button"
              className="cwa-forgot"
              onClick={() => changeFlow("forgot")}
            >
              Forgot password?
            </button>
          ) : (
            <label className="cwa-agreement">
              <input type="checkbox" required name="terms" />
              <span>
                I agree to the{" "}
                <button
                  type="button"
                  onClick={(event) => openPolicy("Terms of Service", event)}
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={(event) => openPolicy("Privacy Policy", event)}
                >
                  Privacy Policy
                </button>
              </span>
            </label>
          )}
          {challenge && (
            <Field
              id={`email-code-${panelMode}`}
              label="Email Verification Code"
              icon="lock"
              name="otp"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              autoComplete="one-time-code"
            />
          )}
          <button type="submit" className="cwa-primary" disabled={busy}>
            {challenge
              ? "Verify Email"
              : panelMode === "login"
                ? "Log In"
                : "Create Account"}
            <AuthIcon name="arrow" size={19} />
          </button>
        </form>
        <p className="cwa-switch-copy">
          {panelMode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            type="button"
            onClick={() =>
              switchMode(panelMode === "login" ? "signup" : "login")
            }
          >
            {panelMode === "login" ? "Sign Up" : "Log In"}
          </button>
        </p>
      </>
    );
  }

  return (
    <div className="cwa-page">
      <div className="cwa-artwork" aria-hidden="true" />
      <header
        className="cwa-header"
        inert={Boolean(policy)}
        aria-hidden={policy ? true : undefined}
      >
        <button
          className="cwa-brand"
          onClick={onBack}
          aria-label="Campus Web Connect home"
        >
          <LandingIcon name="cap" size={42} />
          <span>Campus Web Connect</span>
        </button>
        <button className="cwa-back-home" onClick={onBack}>
          Back to Home <AuthIcon name="arrow" size={18} />
        </button>
      </header>
      <main
        className="cwa-layout"
        inert={Boolean(policy)}
        aria-hidden={policy ? true : undefined}
      >
        <section className="cwa-intro" aria-labelledby="cwa-intro-title">
          <span className="cwa-eyebrow">
            Explore <i>·</i> Discover <i>·</i> Plan
          </span>
          <h1 id="cwa-intro-title">
            Your Next <br />
            Chapter <br />
            Starts{" "}
            <span>
              Here
              <svg viewBox="0 0 165 17" fill="none" aria-hidden="true">
                <path
                  d="M4 12C45 2 116 0 161 7"
                  stroke="url(#cwa-underline)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="cwa-underline">
                    <stop stopColor="#096bff" />
                    <stop offset="1" stopColor="#d6a1ff" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>
          <p>
            Explore top colleges and discover technology career roadmaps — all
            in one place. Make informed decisions for a brighter future.
          </p>
          <ul className="cwa-benefits">
            <li>
              <span className="cwa-feature cwa-feature-purple">
                <LandingIcon name="building" size={29} />
              </span>
              <div>
                <h2>Explore Colleges</h2>
                <p>Find the right college for you</p>
              </div>
            </li>
            <li>
              <span className="cwa-feature cwa-feature-blue">
                <LandingIcon name="bulb" size={29} />
              </span>
              <div>
                <h2>Discover Careers</h2>
                <p>Detailed technology roadmaps</p>
              </div>
            </li>
            <li>
              <span className="cwa-feature cwa-feature-green">
                <AuthIcon name="people" size={29} />
              </span>
              <div>
                <h2>Plan Your Future</h2>
                <p>Get the information you need</p>
              </div>
            </li>
          </ul>
          <div className="cwa-mini-careers" aria-hidden="true">
            {[
              { icon: "code", label: "Software Developer", color: "blue" },
              { icon: "chart", label: "Data Scientist", color: "green" },
              { icon: "shield", label: "Cyber Security", color: "orange" },
              { icon: "palette", label: "UI/UX Designer", color: "purple" },
            ].map((item) => (
              <div
                key={item.label}
                className={`cwa-mini-career cwa-mini-${item.color}`}
              >
                <LandingIcon name={item.icon} size={30} />
                <span>{item.label}</span>
                <AuthIcon name="arrow" size={18} />
              </div>
            ))}
          </div>
        </section>
        <section
          className={`cwa-card cwa-mode-${mode}`}
          aria-labelledby="cwa-form-title"
        >
          <span className="cwa-card-spark" aria-hidden="true" />
          <div className="cwa-card-heading">
            <h2 id="cwa-form-title">
              {mode === "login" ? (
                <>
                  Welcome Back <span aria-hidden="true">👋</span>
                </>
              ) : (
                <>
                  Create Your Account <span aria-hidden="true">🚀</span>
                </>
              )}
            </h2>
            <p>
              {mode === "login"
                ? "Log in to continue your journey"
                : "Join Campus Web Connect and explore your future."}
            </p>
          </div>
          <div className="cwa-tabs" role="tablist" aria-label="Account access">
            <span className="cwa-tab-indicator" aria-hidden="true" />
            {["login", "signup"].map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                id={`cwa-tab-${value}`}
                aria-selected={mode === value}
                aria-controls={`cwa-panel-${value}`}
                tabIndex={mode === value ? 0 : -1}
                onClick={() => switchMode(value)}
                onKeyDown={(event) => {
                  if (
                    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                      event.key,
                    )
                  ) {
                    event.preventDefault();
                    const next =
                      event.key === "Home"
                        ? "login"
                        : event.key === "End"
                          ? "signup"
                          : mode === "login"
                            ? "signup"
                            : "login";
                    switchMode(next);
                    document.getElementById(`cwa-tab-${next}`)?.focus();
                  }
                }}
              >
                {value === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>
          <div className="cwa-form-viewport" style={{ height: panelHeight }}>
            <div className="cwa-form-track">
              {["login", "signup"].map((value) => (
                <div
                  key={value}
                  ref={(element) => {
                    panelRefs.current[value] = element;
                  }}
                  className="cwa-form-panel"
                  id={`cwa-panel-${value}`}
                  role="tabpanel"
                  aria-labelledby={`cwa-tab-${value}`}
                  aria-hidden={mode !== value}
                  inert={mode !== value}
                >
                  {renderForm(value)}
                </div>
              ))}
            </div>
          </div>
          {message && (
            <p className="cwa-message" role="status">
              {message}
            </p>
          )}
          <p className="cwa-preview-note">
            {busy ? "Processing…" : "Secure authentication powered by Django"}
          </p>
        </section>
      </main>
      {policy && (
        <div className="cwa-dialog-overlay" onClick={() => setPolicy(null)}>
          <section
            className="cwa-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cwa-policy-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={policyCloseRef}
              type="button"
              className="cwa-dialog-close"
              aria-label="Close policy preview"
              onClick={() => setPolicy(null)}
              onKeyDown={(event) => {
                if (event.key === "Tab") event.preventDefault();
              }}
            >
              <AuthIcon name="close" />
            </button>
            <h2 id="cwa-policy-title">{policy}</h2>
            <p>
              Registration stores your name, email, hashed password and
              verification records to operate your account. Phone verification
              shares your number with the SMS provider. Contact the site
              administrator for account deletion or support. Full institutional
              terms and privacy contact details must be supplied by the website
              owner.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
