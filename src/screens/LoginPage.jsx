import React, { useState } from "react";
import "./LoginPage.css";

export default function LoginPage({ onBack }) {
  const [isLogin, setIsLogin] = useState(false);
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [message, setMessage] = useState("");

  // UI preview only: no credentials are submitted or stored.
  const handleEmail = (event) => {
    event.preventDefault();
    setMessage(isLogin ? "Sign-in is not connected yet." : "Account creation is not connected yet.");
  };
  const handleGoogle = () => setMessage("Google sign-in is not connected yet.");
  const sendOTP = (event) => {
    event.preventDefault();
    setConfirmation(true);
    setMessage("Preview: no OTP was sent. Phone verification is not connected yet.");
  };
  const verifyOTP = (event) => {
    event.preventDefault();
    setMessage("OTP verification is not connected yet.");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button type="button" className="auth-back" onClick={onBack}>
          &larr; Back to home
        </button>
        <h1>Campus Connect</h1>
        <p>Welcome to your college community</p>

        <div className="auth-tabs">
          <button
            className={isLogin ? "active" : ""}
            type="button"
            aria-pressed={isLogin}
            onClick={() => { setIsLogin(true); setMessage(""); }}
          >
            Sign In
          </button>
          <button
            className={!isLogin ? "active" : ""}
            type="button"
            aria-pressed={!isLogin}
            onClick={() => { setIsLogin(false); setMessage(""); }}
          >
            Sign Up
          </button>
        </div>

        <button type="button" className="google-btn" onClick={handleGoogle}>
          Continue with Google
        </button>

        <div className="divider">OR</div>

        <div className="method-tabs">
          <button type="button" aria-pressed={method === "email"} className={method === "email" ? "active" : ""} onClick={() => { setMethod("email"); setMessage(""); }}>
            Email
          </button>
          <button type="button" aria-pressed={method === "phone"} className={method === "phone" ? "active" : ""} onClick={() => { setMethod("phone"); setMessage(""); }}>
            Phone Number
          </button>
        </div>

        {method === "email" ? (
          <form onSubmit={handleEmail}>
            <input
              type="email"
              aria-label="Email address"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              aria-label="Password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <button type="submit" className="submit-btn">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>
        ) : (
          <form className="phone-form" onSubmit={confirmation ? verifyOTP : sendOTP}>
            <input
              type="tel"
              aria-label="Phone number"
              autoComplete="tel"
              required
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />



            {!confirmation ? (
              <button type="submit">
                Send OTP
              </button>
            ) : (
              <>
                <input
                  placeholder="Enter OTP"
                  aria-label="One-time code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button type="submit">
                  Verify OTP
                </button>
              </>
            )}
          </form>
        )}

        <p className="auth-preview">Preview only. Account creation and sign-in are not connected yet.</p>
        {message && <p className="auth-message" role="status">{message}</p>}
      </div>
    </div>
  );
}
