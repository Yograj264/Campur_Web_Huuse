import { useState } from "react";
import { LandingIcon } from "../components/landing/LandingIcon";
import { CollegeImage } from "../components/landing/CollegeImage";
import { ROADMAPS } from "../data/roadmaps";
import { readCollegeShortlist } from "../data/collegeDetails";
import "./CampusHome.css";

export function HomeScreen({
  onNavigate,
  onSelectCareer,
  onSelectCollege,
  colleges = [],
  user,
}) {
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState("");
  const [saved, setSaved] = useState(readCollegeShortlist);
  const matches = colleges
    .filter((c) =>
      `${c.name} ${c.location} ${c.subLocation || ""} ${c.programs || ""} ${c.category || ""}`
        .toLowerCase()
        .includes(applied.toLowerCase()),
    )
    .sort(
      (a, b) =>
        Number(Boolean(b.image)) - Number(Boolean(a.image)) ||
        Number(
          `${b.location} ${b.subLocation}`.toLowerCase().includes("pune"),
        ) -
          Number(
            `${a.location} ${a.subLocation}`.toLowerCase().includes("pune"),
          ),
    )
    .slice(0, 4);
  function toggle(id) {
    const next = saved.includes(id)
      ? saved.filter((value) => value !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem("campus-college-shortlist", JSON.stringify(next));
    } catch {
      /* Optional device shortlist does not block browsing. */
    }
  }
  function search(e) {
    e.preventDefault();
    setApplied(query.trim());
  }
  const chips = ["Pune", "Engineering", "MCA", "B.Tech", "Private"];
  return (
    <div className="cc-home">
      <section className="cc-hero" aria-labelledby="cc-hero-title">
        <div className="cc-hero-photo">
          <img
            src={`${import.meta.env.BASE_URL}landing/campus-future.png`}
            alt="Two students with books and a laptop on a university campus"
            fetchPriority="high"
          />
        </div>
        <div className="cc-hero-copy">
          <span className="cc-audience">
            <span aria-hidden="true">✦</span> For your next chapter
          </span>
          <h1 id="cc-hero-title">
            Discover Colleges.
            <br />
            <em>Explore Careers.</em>
            <br />
            Build Your Future.
          </h1>
          <p>
            Get to know your college options, explore technology careers with
            step-by-step roadmaps, and take your next step with confidence.
          </p>
          <div className="cc-hero-actions">
            <button
              className="cc-primary"
              onClick={() => onNavigate("colleges-admissions")}
            >
              Explore Colleges <LandingIcon name="arrow" size={17} />
            </button>
            <button
              className="cc-outline"
              onClick={() => onNavigate("careers-roadmap")}
            >
              <LandingIcon name="code" size={17} />
              Career Roadmaps
            </button>
            <button
              className="cc-outline"
              onClick={() => onNavigate("community")}
            >
              <LandingIcon name="people" size={18} />
              Join Community
            </button>
          </div>
          <div className="cc-stats">
            {[
              ["building", `${colleges.length}`, "Colleges to explore"],
              ["shield", `${ROADMAPS.length}`, "Career roadmaps"],
              ["people", "Your space", "Student profile"],
              ["bulb", "Next step", "Career guidance"],
            ].map(([icon, value, label], i) => (
              <div key={label}>
                <span className={`cc-stat-icon cc-tone-${i}`}>
                  <LandingIcon name={icon} size={23} />
                </span>
                <span>
                  <strong>{value}</strong>
                  <small>{label}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="cc-hero-callouts">
          <button
            className="cc-callout cc-callout-college"
            onClick={() => onNavigate("colleges-admissions")}
          >
            <LandingIcon name="building" size={30} />
            <span>
              <strong>Browse Colleges</strong>
              <small>
                Find the right place
                <br />
                for your future
              </small>
            </span>
          </button>
          <button
            className="cc-callout cc-callout-career"
            onClick={() => onNavigate("careers-roadmap")}
          >
            <LandingIcon name="briefcase" size={30} />
            <span>
              <strong>Explore Careers</strong>
              <small>
                Step-by-step
                <br />
                roadmaps in tech
              </small>
            </span>
          </button>
          <button
            className="cc-callout cc-callout-community"
            onClick={() => onNavigate("community")}
          >
            <LandingIcon name="people" size={30} />
            <span>
              <strong>Find your community</strong>
              <small>
                Make connections
                <br />
                with fellow students
              </small>
            </span>
          </button>
          <button
            className="cc-callout cc-callout-mentor"
            onClick={() => onNavigate("mentorship")}
          >
            <LandingIcon name="user" size={29} />
            <span>
              <strong>Get Guidance</strong>
              <small>
                Plan your questions
                <br />
                and next steps
              </small>
            </span>
          </button>
          <span className="cc-future-note">
            Your future
            <br />
            starts here <span>↙</span>
          </span>
        </div>
      </section>
      <div className="cc-content">
        <div className="cc-feature-grid">
          <section className="cc-panel cc-find">
            <div className="cc-panel-title">
              <span className="cc-feature-icon">
                <LandingIcon name="building" size={30} />
              </span>
              <div>
                <h2>Find Your Perfect College</h2>
                <p>Explore colleges by location, courses, fees and more.</p>
              </div>
              <button
                className="cc-link"
                onClick={() => onNavigate("colleges-admissions")}
              >
                View all →
              </button>
            </div>
            <form className="cc-college-search" onSubmit={search}>
              <LandingIcon name="search" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search featured colleges"
                placeholder="Search by name, location, course…"
              />
              <button className="cc-primary">Search</button>
            </form>
            <div className="cc-chips">
              {chips.map((chip) => (
                <button
                  className={applied === chip ? "selected" : ""}
                  key={chip}
                  onClick={() => {
                    setQuery(applied === chip ? "" : chip);
                    setApplied(applied === chip ? "" : chip);
                  }}
                >
                  {chip}
                  {applied === chip ? " ×" : ""}
                </button>
              ))}
              {applied && (
                <button
                  onClick={() => {
                    setApplied("");
                    setQuery("");
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </section>
          <section className="cc-panel cc-paths">
            <div className="cc-panel-title">
              <span className="cc-feature-icon cc-green">
                <LandingIcon name="shield" size={28} />
              </span>
              <div>
                <h2>Explore Career Paths</h2>
                <p>Find the skills, tools and steps for your next chapter.</p>
              </div>
              <button
                className="cc-link"
                onClick={() => onNavigate("careers-roadmap")}
              >
                View all →
              </button>
            </div>
            <div className="cc-path-list">
              {ROADMAPS.map((roadmap, i) => (
                <button
                  key={roadmap.id}
                  className={`cc-tone-${i}`}
                  onClick={() => onSelectCareer(roadmap.id)}
                >
                  <LandingIcon name={roadmap.icon} size={31} />
                  <span>{roadmap.title}</span>
                </button>
              ))}
            </div>
          </section>
          <section className="cc-panel cc-community">
            <div className="cc-panel-title">
              <span className="cc-feature-icon">
                <LandingIcon name="people" size={28} />
              </span>
              <div>
                <h2>Join the Community</h2>
                <p>A space for curious students and future possibilities.</p>
              </div>
            </div>
            <ul>
              {[
                "Start with your student profile",
                "Share what you want to learn",
                "Discover your next step",
              ].map((text) => (
                <li key={text}>
                  <span>✓</span>
                  {text}
                </li>
              ))}
            </ul>
            <button
              className="cc-primary"
              onClick={() => onNavigate("community")}
            >
              Explore Community →
            </button>
          </section>
        </div>
        <div className="cc-discovery-grid">
          <section className="cc-panel cc-popular">
            <div className="cc-section-head">
              <div>
                <h2>
                  {applied
                    ? `Colleges matching “${applied}”`
                    : "Popular Colleges"}
                </h2>
                <p>Get to know campuses, courses and opportunities.</p>
              </div>
              <button
                className="cc-link"
                onClick={() => onNavigate("colleges-admissions")}
              >
                View all →
              </button>
            </div>
            <div className="cc-colleges-grid">
              {matches.map((college) => (
                <article className="cc-college" key={college.id}>
                  <div className="cc-college-photo">
                    <button
                      className="cc-photo-link"
                      onClick={() => onSelectCollege(college)}
                      aria-label={`View ${college.name}`}
                    >
                      <CollegeImage college={college} />
                    </button>
                    <button
                      className={`cc-save ${saved.includes(college.id) ? "saved" : ""}`}
                      title="Shortlist on this device"
                      aria-label={`${saved.includes(college.id) ? "Unsave" : "Save"} ${college.name} on this device`}
                      aria-pressed={saved.includes(college.id)}
                      onClick={() => toggle(college.id)}
                    >
                      <LandingIcon name="heart" size={17} />
                    </button>
                  </div>
                  <div className="cc-college-info">
                    <h3>{college.name}</h3>
                    <p>
                      <LandingIcon name="pin" size={12} />
                      {college.subLocation || college.location}
                    </p>
                    <div className="cc-college-rank">
                      {college.nirfRank
                        ? `NIRF rank #${college.nirfRank}`
                        : college.category || "Explore college details"}
                    </div>
                    <div className="cc-programs">
                      {String(college.programs || "Courses & admissions")
                        .split(",")
                        .slice(0, 2)
                        .map((program) => (
                          <span key={program}>{program.trim()}</span>
                        ))}
                    </div>
                    <button
                      className="cc-detail-link"
                      onClick={() => onSelectCollege(college)}
                    >
                      View Details →
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {!matches.length && (
              <p className="cc-no-results">
                No matching colleges in the current catalogue. Try another
                search or view all colleges.
              </p>
            )}
          </section>
          <section className="cc-panel cc-trending">
            <div className="cc-section-head">
              <h2>
                <span aria-hidden="true">✦</span> Featured Career Roadmaps
              </h2>
              <button
                className="cc-link"
                onClick={() => onNavigate("careers-roadmap")}
              >
                View all →
              </button>
            </div>
            <ol>
              {ROADMAPS.map((roadmap, i) => (
                <li key={roadmap.id}>
                  <button onClick={() => onSelectCareer(roadmap.id)}>
                    <span className={`cc-rank cc-rank-${i}`}>{i + 1}</span>
                    <span>
                      <strong>{roadmap.title} Roadmap</strong>
                      <small>
                        {roadmap.stages.length} steps · Skills, learning and
                        projects
                      </small>
                    </span>
                    <LandingIcon name="chevron" size={16} />
                  </button>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <div className="cc-banner-grid">
          <section className="cc-banner cc-banner-career">
            <div className="cc-banner-art">
              <LandingIcon name="code" size={75} />
            </div>
            <div>
              <h2>
                Not Sure Which Career
                <br />
                Is Right for You?
              </h2>
              <p>
                Discover different paths and find what sparks your curiosity.
              </p>
              <button
                className="cc-primary"
                onClick={() => onNavigate("careers-roadmap")}
              >
                Explore Career Options →
              </button>
            </div>
            <span className="cc-banner-spark">✦</span>
          </section>
          <section className="cc-banner cc-banner-community">
            <div>
              <h2>
                Your Journey.
                <br />
                Your Student Profile.
              </h2>
              <p>
                Keep your interests, education and future goals in one place.
              </p>
              <button
                className="cc-primary"
                onClick={() =>
                  onNavigate(user ? "student-dashboard" : "account")
                }
              >
                {user ? "Open My Profile" : "Create Your Profile"} →
              </button>
            </div>
            <LandingIcon name="people" size={82} />
          </section>
          <section className="cc-banner cc-banner-mentor">
            <div>
              <h2>
                A Little Guidance.
                <br />A Clearer Next Step.
              </h2>
              <p>Prepare your questions and map out your college journey.</p>
              <button
                className="cc-primary"
                onClick={() => onNavigate("mentorship")}
              >
                Explore Guidance →
              </button>
            </div>
            <LandingIcon name="bulb" size={78} />
          </section>
        </div>
        <footer className="cc-footer">
          <span>© {new Date().getFullYear()} Campus Connect</span>
          <span>Discover your possibilities. Build your future.</span>
          <button
            onClick={() => onNavigate(user ? "student-dashboard" : "account")}
          >
            {user ? "My profile" : "Sign In / Up"} →
          </button>
        </footer>
      </div>
    </div>
  );
}
