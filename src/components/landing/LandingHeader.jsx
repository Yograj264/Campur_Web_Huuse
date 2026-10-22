import { useState } from "react";
import { LandingIcon } from "./LandingIcon";
import "./LandingShared.css";
import "../../screens/CampusHome.css";

export function LandingHeader({ currentScreen, onNavigate, user, onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [failedPhoto, setFailedPhoto] = useState(null);
  const [query, setQuery] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(false);
  const go = (screen) => {
    setMenuOpen(false);
    setNoticeOpen(false);
    onNavigate(screen);
  };
  const items = [
    ["Home", "home-discover"],
    ["Colleges", "colleges-admissions"],
    ["Career Roadmaps", "careers-roadmap"],
    ["Community", "community"],
    ["Mentorship", "mentorship"],
    ["Explore", "explore"],
  ];
  return (
    <header className="connect-header cc-header">
      <div className="connect-header-inner">
        <button
          className="connect-brand"
          onClick={() => go("home-discover")}
          aria-label="Campus Connect home"
        >
          <LandingIcon name="cap" size={39} />
          <span>Campus Connect</span>
        </button>
        <nav
          className={`connect-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          {items.map(([label, screen]) => (
            <button
              key={screen}
              className={
                currentScreen === screen ||
                (screen === "colleges-admissions" &&
                  currentScreen === "college-detail")
                  ? "is-active"
                  : ""
              }
              aria-current={currentScreen === screen ? "page" : undefined}
              onClick={() => go(screen)}
            >
              {label}
            </button>
          ))}
        </nav>
        <form
          className="cc-global-search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            onSearch?.(query);
          }}
        >
          <LandingIcon name="search" size={17} />
          <input
            aria-label="Search colleges and career roadmaps"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search colleges, careers, skills…"
          />
          <button className="cc-sr-only" type="submit">
            Search
          </button>
        </form>
        <div className="connect-header-actions">
          <div className="cc-notifications">
            <button
              className="cc-bell"
              aria-label="Notifications"
              aria-expanded={noticeOpen}
              onClick={() => setNoticeOpen(!noticeOpen)}
            >
              <LandingIcon name="bell" size={22} />
            </button>
            {noticeOpen && (
              <div className="cc-notice" role="status">
                <strong>You're all caught up</strong>
                <p>
                  No new notifications. Visit your profile to keep your details
                  up to date.
                </p>
                <button
                  onClick={() => go(user ? "student-dashboard" : "login")}
                >
                  Open my profile →
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className="connect-account"
            aria-label={user ? "Open my dashboard" : "Sign In or Sign Up"}
            title={
              user
                ? `${user.name} - ${user.is_staff ? "Admin dashboard" : "My profile"}`
                : "Sign In / Sign Up"
            }
            onClick={() => go(user ? "student-dashboard" : "login")}
          >
            <span className="connect-account-avatar" aria-hidden="true">
              {user?.photo_url && failedPhoto !== user.photo_url ? (
                <img
                  src={user.photo_url}
                  alt=""
                  onError={() => setFailedPhoto(user.photo_url)}
                />
              ) : (
                <LandingIcon name="user" size={21} />
              )}
            </span>
            <span className="connect-account-label">
              {user ? user.name : "Sign In / Up"}
            </span>
          </button>
          <button
            className="connect-menu"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <LandingIcon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}
