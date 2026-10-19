import { useState } from "react";
import { LandingIcon } from "./LandingIcon";
import "../../screens/HomeScreen.css";

export function LandingHeader({ currentScreen, onNavigate, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (screen) => {
    setMenuOpen(false);
    onNavigate(screen);
  };
  return (
    <header className="connect-header">
      <div className="connect-header-inner">
        <button
          className="connect-brand"
          onClick={() => go("home-discover")}
          aria-label="Campus Web Connect home"
        >
          <LandingIcon name="cap" size={44} />
          <span>Campus Web Connect</span>
        </button>
        <nav
          className={`connect-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          <button
            className={currentScreen === "home-discover" ? "is-active" : ""}
            onClick={() => go("home-discover")}
            aria-current={
              currentScreen === "home-discover" ? "page" : undefined
            }
          >
            Home
          </button>
          <button
            className={
              ["colleges-admissions", "college-detail"].includes(currentScreen)
                ? "is-active"
                : ""
            }
            aria-current={
              ["colleges-admissions", "college-detail"].includes(currentScreen)
                ? "page"
                : undefined
            }
            onClick={() => go("colleges-admissions")}
          >
            Colleges
          </button>
          <button
            className={currentScreen === "careers-roadmap" ? "is-active" : ""}
            aria-current={
              currentScreen === "careers-roadmap" ? "page" : undefined
            }
            onClick={() => go("careers-roadmap")}
          >
            Career Roadmaps
          </button>
        </nav>
        <div className="connect-header-actions">
          <button
            className="connect-search"
            aria-label="Search colleges"
            onClick={() => go("colleges-admissions")}
          >
            <LandingIcon name="search" size={22} />
          </button>
          {user ? (
            <>
              <span aria-label="Signed in account">{user.name}</span>
              <button className="connect-login" onClick={onLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <button className="connect-login" onClick={() => go("login")}>
                Log In
              </button>
              <button className="connect-signup" onClick={() => go("account")}>
                Sign Up
              </button>
            </>
          )}
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
