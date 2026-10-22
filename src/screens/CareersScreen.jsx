import { useEffect, useRef, useState } from "react";
import { ROADMAPS } from "../data/roadmaps";
import { careerDetails } from "../data/careerDetails";
import { LandingIcon } from "../components/landing/LandingIcon";
import "./CareersScreen.css";

const tabs = [
  "Overview",
  "Career Path",
  "Colleges & Degrees",
  "Skills & Tools",
  "Projects",
  "Job Preparation",
  "Resources",
  "Community",
];
const timelineIcons = ["cap", "building", "code", "briefcase", "shield"];
const norm = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
function loadSaved() {
  try {
    const data = JSON.parse(
      localStorage.getItem("campus-saved-careers") || "[]",
    );
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function CareersScreen({
  selectedCareer,
  onSelectCareer,
  onNavigate,
  colleges = [],
  onSelectCollege,
  user,
}) {
  const roadmap = ROADMAPS.find((item) => item.id === selectedCareer);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("Overview");
  const [view, setView] = useState("timeline");
  const [pace, setPace] = useState("Flexible");
  const [degreeFilter, setDegreeFilter] = useState("All");
  const [resourceFilter, setResourceFilter] = useState("All");
  const [saved, setSaved] = useState(loadSaved);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(null);
  const dialog = useRef(null);
  const tabRefs = useRef([]);
  const details = careerDetails(roadmap?.id);
  useEffect(() => {
    if (modal && dialog.current && !dialog.current.open)
      dialog.current.showModal();
  }, [modal]);
  function toggleSave() {
    const next = saved.includes(roadmap.id)
      ? saved.filter((id) => id !== roadmap.id)
      : [...saved, roadmap.id];
    try {
      localStorage.setItem("campus-saved-careers", JSON.stringify(next));
      setSaved(next);
      setMessage(
        next.includes(roadmap.id)
          ? "Roadmap saved on this device."
          : "Roadmap removed from your saved list.",
      );
    } catch {
      setMessage("Your browser could not save the roadmap.");
    }
  }
  async function share() {
    const url = new URL(window.location.href);
    url.searchParams.delete("college");
    url.searchParams.set("career", roadmap.id);
    try {
      if (navigator.share)
        await navigator.share({
          title: details.role + " Roadmap",
          url: url.toString(),
        });
      else {
        await navigator.clipboard.writeText(url.toString());
        setMessage("Roadmap link copied.");
      }
    } catch (error) {
      if (error.name !== "AbortError")
        setMessage("Copy this roadmap link: " + url.toString());
    }
  }
  const sidebar = (
    <aside className="cr-sidebar">
      <nav aria-label="Career sidebar">
        {[
          ["building", "Home", "home-discover"],
          ["building", "Colleges", "colleges-admissions"],
          ["briefcase", "Career Roadmaps", "careers-roadmap"],
          ["people", "Community", "community"],
          ["code", "Resources", "explore"],
          ["user", "Mentorship", "mentorship"],
          ["user", "My Profile", user ? "student-dashboard" : "login"],
        ].map(([icon, label, screen]) => (
          <button
            key={label}
            className={label === "Career Roadmaps" ? "active" : ""}
            onClick={() => onNavigate(screen)}
          >
            <LandingIcon name={icon} size={20} />
            {label}
          </button>
        ))}
      </nav>
      <div className="cr-promo">
        <h2>
          Not sure
          <br />
          which career
          <br />
          is right for you?
        </h2>
        <p>
          Explore the paths, compare what you’ll learn and follow your
          curiosity.
        </p>
        <img
          src={`${import.meta.env.BASE_URL}landing/student-hero.png`}
          alt=""
        />
        <button onClick={() => onSelectCareer(null)}>Explore Careers →</button>
      </div>
    </aside>
  );
  if (!roadmap)
    return (
      <div className="cr-page">
        {sidebar}
        <section className="cr-directory">
          <p className="cr-eyebrow">FIND YOUR NEXT CHAPTER</p>
          <h1>
            Small steps.
            <br />
            <span>Big possibilities.</span>
          </h1>
          <p>
            Choose a career and explore a practical path from curiosity to your
            first projects. These are general learning guides, not personalized
            assessments.
          </p>
          <label className="cr-directory-search">
            <LandingIcon name="search" size={20} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a career, skill or interest…"
              aria-label="Search career roadmaps"
            />
          </label>
          <div className="cr-directory-grid">
            {ROADMAPS.filter((item) =>
              `${item.title} ${careerDetails(item.id).role} ${careerDetails(item.id).skills.join(" ")}`
                .toLowerCase()
                .includes(query.trim().toLowerCase()),
            ).map((item, index) => (
              <button
                className={`cr-directory-card cr-tint-${index % 5}`}
                key={item.id}
                onClick={() => onSelectCareer(item.id)}
              >
                <span className="cr-directory-icon">
                  <LandingIcon name={item.icon} size={35} />
                </span>
                <span className="cr-card-label">CAREER ROADMAP</span>
                <h2>{careerDetails(item.id).role}</h2>
                <p>{item.summary}</p>
                <div>
                  {careerDetails(item.id)
                    .skills.slice(0, 3)
                    .map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                </div>
                <strong>
                  Explore this path <LandingIcon name="arrow" size={18} />
                </strong>
              </button>
            ))}
          </div>
          {!ROADMAPS.some((item) =>
            `${item.title} ${careerDetails(item.id).role} ${careerDetails(item.id).skills.join(" ")}`
              .toLowerCase()
              .includes(query.trim().toLowerCase()),
          ) && (
            <p className="cr-notice">
              No matching roadmaps. Try another career or skill.
            </p>
          )}
        </section>
      </div>
    );
  const periods =
    pace === "6 months"
      ? ["Week 1", "Weeks 2–3", "Months 1–3", "Months 3–5", "Month 6"]
      : pace === "12 months"
        ? [
            "Weeks 1–2",
            "Weeks 3–4",
            "Months 2–6",
            "Months 6–10",
            "Months 10–12",
          ]
        : [
            "Start here",
            "Choose your route",
            "Build foundations",
            "Apply your skills",
            "Prepare your next step",
          ];
  const milestones = [
    {
      title: "Explore Your Interests",
      items: details.focus,
      action: "Know More",
      tab: "Career Path",
    },
    {
      title: "Choose Your Learning Route",
      items: [
        "Compare degree and learning options",
        "Check eligibility and curriculum",
        "Consider your budget and location",
      ],
      action: "View College Options",
      tab: "Colleges & Degrees",
    },
    {
      title: "Learn Core Skills",
      items: details.core,
      action: "View Skill Plan",
      tab: "Skills & Tools",
    },
    {
      title: "Build Real Projects",
      items: details.projects,
      action: "Project Ideas",
      tab: "Projects",
    },
    {
      title: "Prepare for Opportunities",
      items: [
        "Document your portfolio and learning",
        "Practise role-relevant interviews",
        "Explore internships or further study",
      ],
      action: "Preparation Guide",
      tab: "Job Preparation",
    },
  ];
  const show = (value) => tab === "Overview" || tab === value;
  const filteredDegrees = details.degrees.filter(
    (degree) => degreeFilter === "All" || degree.id === degreeFilter,
  );
  const skillsStages = [
    { title: "Beginner", items: details.core.slice(0, 2) },
    {
      title: "Intermediate",
      items: details.core.slice(2).length
        ? details.core.slice(2)
        : details.skills.slice(2, 4),
    },
    {
      title: "Applied",
      items: [details.projects[0], "Document your decisions & results"],
    },
    {
      title: "Opportunity Ready",
      items: [
        "Portfolio & communication",
        "Interview practice",
        "Internship / application preparation",
      ],
    },
  ];
  const compareDegree = (degree) => {
    const matches = colleges.filter((college) =>
      norm(college.programs).includes(norm(degree.id)),
    );
    setModal({ type: "degree", degree, matches });
  };
  return (
    <div className="cr-page">
      {sidebar}
      <div className="cr-workspace">
        <div className="cr-breadcrumb">
          <button onClick={() => onSelectCareer(null)}>
            ‹ Career Roadmaps
          </button>
          <LandingIcon name="chevron" size={12} />
          <span>{details.role}</span>
          <div>
            <button
              onClick={toggleSave}
              aria-pressed={saved.includes(roadmap.id)}
            >
              <LandingIcon name="heart" size={16} />
              {saved.includes(roadmap.id) ? "Saved" : "Save"}
            </button>
            <button className="cr-primary" onClick={share}>
              <LandingIcon name="arrow" size={15} />
              Share
            </button>
          </div>
        </div>
        {message && (
          <p role="status" className="cr-notice">
            {message}
          </p>
        )}
        <div className="cr-layout">
          <div className="cr-main">
            <section className="cr-hero">
              <div className="cr-hero-symbol">
                <LandingIcon name={roadmap.icon} size={58} />
              </div>
              <div className="cr-hero-copy">
                <h1>{details.role}</h1>
                <h2>{details.tagline}</h2>
                <p>{details.about}</p>
                <div className="cr-hero-tags">
                  {[
                    "Project focused",
                    "Build your portfolio",
                    "Explore your options",
                  ].map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <img
                className="cr-hero-art"
                src={`${import.meta.env.BASE_URL}landing/career-student.png`}
                alt="Student learning with a laptop"
              />
            </section>
            <div
              className="cr-tabs"
              role="tablist"
              aria-label="Roadmap information"
            >
              {tabs.map((label, index) => (
                <button
                  key={label}
                  id={`cr-tab-${index}`}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  role="tab"
                  aria-selected={tab === label}
                  aria-controls="cr-content"
                  tabIndex={tab === label ? 0 : -1}
                  onClick={() => setTab(label)}
                  onKeyDown={(event) => {
                    if (
                      ["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                        event.key,
                      )
                    ) {
                      event.preventDefault();
                      const next =
                        event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? tabs.length - 1
                            : (index +
                                (event.key === "ArrowRight" ? 1 : -1) +
                                tabs.length) %
                              tabs.length;
                      setTab(tabs[next]);
                      tabRefs.current[next]?.focus();
                    }
                  }}
                >
                  <LandingIcon
                    name={
                      [
                        "briefcase",
                        "cap",
                        "building",
                        "code",
                        "shield",
                        "briefcase",
                        "data",
                        "people",
                      ][index]
                    }
                    size={16}
                  />
                  {label}
                </button>
              ))}
            </div>
            <div
              id="cr-content"
              role="tabpanel"
              aria-labelledby={`cr-tab-${tabs.indexOf(tab)}`}
            >
              {show("Career Path") && (
                <section className="cr-panel cr-path">
                  <div className="cr-panel-heading">
                    <div>
                      <h2>Career Path Roadmap</h2>
                      <p>
                        A suggested sequence from exploring your options to
                        building your portfolio.
                      </p>
                    </div>
                    <div className="cr-path-controls">
                      <div
                        className="cr-segment"
                        role="group"
                        aria-label="Roadmap view"
                      >
                        <button
                          aria-pressed={view === "timeline"}
                          onClick={() => setView("timeline")}
                        >
                          Timeline
                        </button>
                        <button
                          aria-pressed={view === "list"}
                          onClick={() => setView("list")}
                        >
                          List View
                        </button>
                      </div>
                      <label className="cr-pace">
                        <span className="cc-sr-only">Learning pace</span>
                        <select
                          value={pace}
                          onChange={(event) => setPace(event.target.value)}
                        >
                          <option value="Flexible">Flexible pace</option>
                          <option value="6 months">6-month study plan</option>
                          <option value="12 months">12-month study plan</option>
                        </select>
                      </label>
                    </div>
                  </div>
                  <ol
                    className={`cr-timeline ${view === "list" ? "cr-list-view" : ""}`}
                  >
                    {milestones.map((milestone, index) => (
                      <li
                        key={milestone.title}
                        className={`cr-step cr-tint-${index}`}
                      >
                        <span className="cr-step-number">{index + 1}</span>
                        <div className="cr-step-heading">
                          <span className="cr-step-icon">
                            <LandingIcon
                              name={timelineIcons[index]}
                              size={31}
                            />
                          </span>
                          <h3>{milestone.title}</h3>
                          <small>{periods[index]}</small>
                        </div>
                        <ul>
                          {milestone.items.map((item) => (
                            <li key={item}>
                              <span>✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                        <button onClick={() => setTab(milestone.tab)}>
                          {milestone.action} →
                        </button>
                      </li>
                    ))}
                  </ol>
                  <p className="cr-plan-note">
                    Suggested self-study pacing only. Degree requirements,
                    admission timelines and individual learning time vary.
                  </p>
                </section>
              )}
              {show("Career Path") &&
                (roadmap.stages?.length > 0 || details.plans?.length > 0) && (
                  <section className="cr-panel">
                    <div className="cr-panel-heading">
                      <div>
                        <h2>Learning Stages & Study Plans</h2>
                        <p>
                          Explore the published learning sequence and suggested
                          plans.
                        </p>
                      </div>
                    </div>
                    {roadmap.stages?.length > 0 && (
                      <ol className="cr-managed-stages">
                        {roadmap.stages.map((stage, index) => (
                          <li key={index}>{stage}</li>
                        ))}
                      </ol>
                    )}
                    <div className="cr-managed-plans">
                      {details.plans?.map((plan) => (
                        <article key={plan.id}>
                          <h3>{plan.name}</h3>
                          {plan.duration && <small>{plan.duration}</small>}
                          <p>{plan.description}</p>
                          <ol>
                            {plan.steps.filter(Boolean).map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              {show("Colleges & Degrees") && (
                <section className="cr-panel">
                  <div className="cr-panel-heading">
                    <div>
                      <h2>Colleges & Degree Options</h2>
                      <p>
                        Explore possible education routes. Check each
                        institution’s eligibility and course details.
                      </p>
                    </div>
                    <div
                      className="cr-degree-filters"
                      role="group"
                      aria-label="Degree filters"
                    >
                      {[
                        "All",
                        ...details.degrees.map((degree) => degree.id),
                      ].map((filter) => (
                        <button
                          key={filter}
                          aria-pressed={degreeFilter === filter}
                          onClick={() => setDegreeFilter(filter)}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                    <button
                      className="cr-link"
                      onClick={() => onNavigate("colleges-admissions")}
                    >
                      View All Colleges →
                    </button>
                  </div>
                  <div className="cr-degrees">
                    {filteredDegrees.map((degree, index) => (
                      <article key={degree.id}>
                        <div>
                          <span className={`cr-small-icon cr-tint-${index}`}>
                            <LandingIcon
                              name={timelineIcons[index % 5]}
                              size={22}
                            />
                          </span>
                          <h3>{degree.title}</h3>
                        </div>
                        <p>{degree.description}</p>
                        <dl>
                          <div>
                            <dt>Route</dt>
                            <dd>{degree.kind}</dd>
                          </div>
                          <div>
                            <dt>Eligibility & duration</dt>
                            <dd>Confirm with institution</dd>
                          </div>
                        </dl>
                        <button onClick={() => compareDegree(degree)}>
                          View College Options →
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              )}
              <div className="cr-learning-grid">
                {show("Skills & Tools") && (
                  <section className="cr-panel">
                    <div className="cr-panel-heading">
                      <div>
                        <h2>Key Skills Roadmap</h2>
                        <p>Build a foundation, practise and keep improving.</p>
                      </div>
                    </div>
                    <div className="cr-skills-stages">
                      {skillsStages.map((stage, index) => (
                        <article
                          key={stage.title}
                          className={`cr-tint-${index}`}
                        >
                          <h3>{stage.title}</h3>
                          <ul>
                            {stage.items.map((item) => (
                              <li key={item}>
                                <span>✓</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </article>
                      ))}
                    </div>
                    <div className="cr-tools">
                      <strong>Tools to explore</strong>
                      {details.tools.map((tool) => (
                        <span key={tool}>{tool}</span>
                      ))}
                    </div>
                  </section>
                )}
                {show("Resources") && (
                  <section className="cr-panel cr-resources">
                    <div className="cr-panel-heading">
                      <div>
                        <h2>Learning Resources</h2>
                        <p>Start with these official learning materials.</p>
                      </div>
                    </div>
                    <div
                      className="cr-resource-filters"
                      role="group"
                      aria-label="Resource filters"
                    >
                      {[
                        "All",
                        ...new Set(
                          details.resources.map((resource) => resource.type),
                        ),
                      ].map((filter) => (
                        <button
                          key={filter}
                          aria-pressed={resourceFilter === filter}
                          onClick={() => setResourceFilter(filter)}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                    {details.resources
                      .filter(
                        (resource) =>
                          resourceFilter === "All" ||
                          resource.type === resourceFilter,
                      )
                      .map((resource) => (
                        <a
                          key={resource.url}
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="cr-resource-icon">
                            <LandingIcon name="code" size={18} />
                          </span>
                          <span>
                            <strong>{resource.name}</strong>
                            <small>{resource.description}</small>
                          </span>
                          <span className="cr-visit">Visit ↗</span>
                        </a>
                      ))}
                  </section>
                )}
              </div>
              {tab === "Projects" && (
                <section className="cr-panel">
                  <h2>Build a portfolio you can explain</h2>
                  <p>
                    Start small, document your choices and improve your work
                    through feedback.
                  </p>
                  <div className="cr-projects">
                    {details.projects.map((project, index) => (
                      <article key={project} className={`cr-tint-${index}`}>
                        <span>PROJECT {index + 1}</span>
                        <h3>{project}</h3>
                        <p>
                          Describe the problem, your approach, what you tested
                          and what you would improve.
                        </p>
                        <button onClick={() => setTab("Resources")}>
                          Find learning resources →
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              )}
              {tab === "Job Preparation" && (
                <section className="cr-panel">
                  <h2>Prepare for your next opportunity</h2>
                  <div className="cr-preparation">
                    {[
                      "Write a clear resume with evidence of your work",
                      "Create a portfolio with project context and outcomes",
                      "Practise explaining your decisions and tradeoffs",
                      "Prepare role-specific questions and interview exercises",
                      "Research internships, employers and further-study options",
                    ].map((item, index) => (
                      <div key={item}>
                        <span>{index + 1}</span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    className="cr-primary"
                    onClick={() => onNavigate("mentorship")}
                  >
                    Save your guidance questions →
                  </button>
                </section>
              )}
              {tab === "Community" && (
                <section className="cr-panel">
                  <h2>Learn with other students</h2>
                  <p>
                    Ask questions about learning paths, projects and college
                    choices in the public Campus Connect community. A verified
                    career-specific alumni directory is not available yet.
                  </p>
                  <button
                    className="cr-primary"
                    onClick={() => onNavigate("community")}
                  >
                    Explore Community →
                  </button>
                </section>
              )}
            </div>
            <p className="cr-page-note">
              General educational guidance. This roadmap does not guarantee
              admission, employment, salary or a fixed completion time.
            </p>
          </div>
          <aside className="cr-right">
            <section className="cr-panel cr-quick">
              <h2>Quick Overview</h2>
              <dl>
                {[
                  ["briefcase", "Salary", "Varies by role & experience"],
                  ["chart", "Job outlook", "Research current opportunities"],
                  ["building", "Work type", "Depends on role & employer"],
                  [
                    "cap",
                    "Education routes",
                    details.degrees.map((degree) => degree.id).join(" / "),
                  ],
                  ["code", "Key skills", details.skills.join(", ")],
                  ["shield", "Best for", details.bestFor],
                ].map(([icon, label, value]) => (
                  <div key={label}>
                    <dt>
                      <LandingIcon name={icon} size={14} />
                      {label}
                    </dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="cr-panel cr-related">
              <div className="cr-panel-heading">
                <h2>Related Careers</h2>
                <button
                  className="cr-link"
                  onClick={() => onSelectCareer(null)}
                >
                  View all →
                </button>
              </div>
              {ROADMAPS.filter((item) => item.id !== roadmap.id).map(
                (item, index) => (
                  <button key={item.id} onClick={() => onSelectCareer(item.id)}>
                    <span className={`cr-small-icon cr-tint-${index}`}>
                      <LandingIcon name={item.icon} size={23} />
                    </span>
                    <span>
                      <strong>{careerDetails(item.id).role}</strong>
                      <small>{item.summary}</small>
                    </span>
                    <LandingIcon name="chevron" size={15} />
                  </button>
                ),
              )}
            </section>
            <section className="cr-panel cr-people">
              <div className="cr-panel-heading">
                <h2>Students & Alumni</h2>
                <button
                  className="cr-link"
                  onClick={() => onNavigate("community")}
                >
                  Community →
                </button>
              </div>
              <div className="cr-community-art">
                <LandingIcon name="people" size={40} />
              </div>
              <h3>Your next conversation starts here</h3>
              <p>
                Share learning questions and explore student discussions.
                Verified member matching is not available yet.
              </p>
              <button
                className="cr-soft"
                onClick={() => onNavigate("community")}
              >
                Join the conversation →
              </button>
            </section>
            <section className="cr-panel cr-goal">
              <LandingIcon name="target" size={27} />
              <h3>Make this path your own</h3>
              <p>
                Keep your education, interests and career goal together in your
                profile.
              </p>
              <button
                className="cr-link"
                onClick={() => onNavigate(user ? "student-dashboard" : "login")}
              >
                Open my profile →
              </button>
            </section>
          </aside>
        </div>
      </div>
      <dialog
        className="cr-dialog"
        ref={dialog}
        aria-labelledby="cr-dialog-title"
        onClose={() => setModal(null)}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div>
          <button
            className="cr-dialog-close"
            aria-label="Close college options"
            onClick={() => dialog.current.close()}
          >
            <LandingIcon name="close" size={21} />
          </button>
          <h2 id="cr-dialog-title">{modal?.degree?.title}</h2>
          <p>
            Matches from the current college catalogue. Confirm programme
            availability, entry requirements and duration with each institution.
          </p>
          {modal?.matches?.length ? (
            <ul>
              {modal.matches.map((college) => (
                <li key={college.id}>
                  <button onClick={() => onSelectCollege(college)}>
                    <span>
                      <strong>{college.name}</strong>
                      <small>
                        {college.location} · {college.annualFee}
                      </small>
                    </span>
                    <LandingIcon name="chevron" size={18} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="cr-notice">
              No matching programme is listed in the current catalogue yet.
            </p>
          )}
          <button
            className="cr-primary"
            onClick={() => onNavigate("colleges-admissions")}
          >
            Browse all colleges →
          </button>
        </div>
      </dialog>
    </div>
  );
}
