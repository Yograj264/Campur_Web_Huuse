import { useRef } from "react";
import { LandingIcon } from "../components/landing/LandingIcon";
import { CollegeImage } from "../components/landing/CollegeImage";
import { ROADMAPS } from "../data/roadmaps";
import "./HomeScreen.css";

const COLLEGE_ORDER = [
  "iit-bombay",
  "iit-delhi",
  "iiit-hyderabad",
  "vit-vellore",
  "bits-pilani",
];
const DISPLAY_NAMES = {
  "iit-bombay": "IIT Bombay",
  "iit-delhi": "IIT Delhi",
  "iiit-hyderabad": "IIIT Hyderabad",
  "vit-vellore": "VIT Vellore",
  "bits-pilani": "BITS Pilani",
};

export function HomeScreen({
  onNavigate,
  onSelectCareer,
  onSelectCollege,
  colleges = [],
}) {
  const collegeRow = useRef(null);
  const popular = [...colleges].sort((a, b) => {
    const ai = COLLEGE_ORDER.indexOf(a.id),
      bi = COLLEGE_ORDER.indexOf(b.id);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
  });
  return (
    <div className="connect-home">
      <section className="connect-hero" aria-labelledby="connect-title">
        <div className="connect-container connect-hero-inner">
          <div className="connect-hero-copy">
            <p className="connect-eyebrow">
              Explore <span>·</span> Compare <span>·</span> Plan your career
            </p>
            <h1 id="connect-title">
              Find the Right College
              <br />
              Build Your <span>Career Path</span>
            </h1>
            <p className="connect-hero-description">
              Explore colleges and discover detailed career roadmaps
              <br className="connect-desktop-break" /> to make informed
              decisions for your future.
            </p>
          </div>
          <div className="connect-hero-art">
            <div className="connect-hero-circle" />
            <img
              className="connect-student"
              src={`${import.meta.env.BASE_URL}landing/student-hero.png`}
              alt="College student holding a laptop and looking toward the future"
              fetchPriority="high"
            />
            <svg
              className="connect-hero-arrows"
              viewBox="0 0 680 300"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="connect-arrow-head"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path d="m1 1 5 3-5 3" stroke="#0878bd" strokeWidth="1.4" />
                </marker>
              </defs>
              <path
                d="M160 110c40-8 72 6 84 34M165 160c0 30 26 45 52 56M480 175c42-20 69-43 73-68M570 214l-50 13"
                stroke="#0878bd"
                strokeWidth="1.8"
                strokeDasharray="6 5"
                markerEnd="url(#connect-arrow-head)"
              />
            </svg>
            <button
              className="connect-float connect-float-colleges"
              onClick={() => onNavigate("colleges-admissions")}
            >
              <LandingIcon name="building" size={38} />
              <span>
                Explore
                <br />
                Colleges
              </span>
            </button>
            <button
              className="connect-float connect-float-careers"
              onClick={() => onNavigate("careers-roadmap")}
            >
              <LandingIcon name="chart" size={39} />
              <span>
                Discover
                <br />
                Career Paths
              </span>
            </button>
            <button
              className="connect-float connect-float-future"
              onClick={() => onNavigate("careers-roadmap")}
            >
              <LandingIcon name="target" size={39} />
              <span>
                Plan
                <br />
                Your Future
              </span>
            </button>
            <i className="connect-spark connect-spark-one" />
            <i className="connect-spark connect-spark-two" />
          </div>
        </div>
      </section>

      <section
        className="connect-colleges"
        aria-labelledby="connect-colleges-title"
      >
        <div className="connect-container">
          <div className="connect-section-heading">
            <div className="connect-heading-main">
              <span className="connect-section-icon connect-icon-blue">
                <LandingIcon name="building" size={32} />
              </span>
              <div>
                <h2 id="connect-colleges-title">Popular Colleges</h2>
                <p>
                  Explore top colleges with key information to help you decide.
                </p>
              </div>
            </div>
            <button
              className="connect-text-link"
              onClick={() => onNavigate("colleges-admissions")}
            >
              View All Colleges <LandingIcon name="arrow" size={20} />
            </button>
          </div>
          <div className="connect-college-carousel">
            <div className="connect-college-row" ref={collegeRow}>
              {popular.map((college) => (
                <button
                  className="connect-college-card"
                  key={college.id}
                  onClick={() => onSelectCollege(college)}
                  aria-label={`View details for ${college.name}`}
                >
                  <CollegeImage college={college} />
                  <div className="connect-college-content">
                    <h3>{DISPLAY_NAMES[college.id] || college.name}</h3>
                    <p>
                      <LandingIcon name="pin" size={16} />
                      <span>{college.subLocation || college.location}</span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {popular.length > 5 && (
              <button
                className="connect-carousel-next"
                aria-label="Show more colleges"
                onClick={() => {
                  const row = collegeRow.current;
                  if (!row) return;
                  const atEnd =
                    row.scrollLeft + row.clientWidth >= row.scrollWidth - 8;
                  row.scrollTo({
                    left: atEnd ? 0 : row.scrollLeft + row.clientWidth * 0.65,
                    behavior: "smooth",
                  });
                }}
              >
                <LandingIcon name="chevron" size={26} />
              </button>
            )}
          </div>
          {popular.length === 0 && (
            <p className="connect-empty">
              No colleges are available yet. Add records in Django admin or run
              the demo-data import.
            </p>
          )}
        </div>
      </section>

      <section
        className="connect-roadmaps"
        aria-labelledby="connect-roadmaps-title"
      >
        <div className="connect-container">
          <div className="connect-section-heading">
            <div className="connect-heading-main">
              <span className="connect-section-icon connect-icon-purple">
                <LandingIcon name="chart" size={34} />
              </span>
              <div>
                <h2 id="connect-roadmaps-title">Career Roadmaps</h2>
                <p>Explore step-by-step guides for different career paths.</p>
              </div>
            </div>
            <button
              className="connect-text-link"
              onClick={() => onNavigate("careers-roadmap")}
            >
              View All Roadmaps <LandingIcon name="arrow" size={20} />
            </button>
          </div>
          <div className="connect-roadmap-grid">
            {ROADMAPS.map((roadmap) => (
              <button
                className={`connect-roadmap-card connect-theme-${roadmap.theme}`}
                key={roadmap.id}
                onClick={() => onSelectCareer(roadmap.id)}
                aria-label={`Explore ${roadmap.title} career roadmaps`}
              >
                <div className="connect-roadmap-art">
                  <LandingIcon name={roadmap.icon} size={59} />
                </div>
                <h3>{roadmap.title}</h3>
                <div className="connect-roadmap-bottom">
                  <p>Skills, tools, roles and a step-by-step roadmap.</p>
                  <span className="connect-roadmap-arrow">
                    <LandingIcon name="arrow" size={22} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      <footer className="connect-footer">
        <div className="connect-container">
          <span>© {new Date().getFullYear()} Campus Web Connect</span>
          <button onClick={() => onNavigate("account")}>
            Create your free account <LandingIcon name="arrow" size={17} />
          </button>
        </div>
      </footer>
    </div>
  );
}
