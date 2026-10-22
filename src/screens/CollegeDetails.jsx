import { useEffect, useRef, useState } from "react";
import { LandingIcon } from "../components/landing/LandingIcon";
import { CollegeImage } from "../components/landing/CollegeImage";
import { connectRequest } from "../api";
import { collegeDetails, readCollegeShortlist } from "../data/collegeDetails";
import "./CollegeDetails.css";

const tabs = [
  "Overview",
  "Courses",
  "Admissions",
  "Placements",
  "Campus Life",
  "Hostel & Facilities",
  "Reviews",
  "Students & Alumni",
  "Community",
];
const courseIcons = ["code", "data", "chart", "palette", "briefcase"];
function Empty({ children }) {
  return <p className="cd-empty">{children}</p>;
}
function Metric({ icon, value, label, tone = 0 }) {
  return (
    <div className="cd-metric">
      <span className={`cd-icon cd-tone-${tone}`}>
        <LandingIcon name={icon} size={22} />
      </span>
      <span>
        <strong>{value || "Not listed"}</strong>
        <small>{label}</small>
      </span>
    </div>
  );
}

export default function CollegeDetails({
  college,
  colleges = [],
  onNavigate,
  user,
}) {
  const details = collegeDetails(college);
  const [tab, setTab] = useState("Overview");
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(() =>
    readCollegeShortlist().includes(college.id),
  );
  const [message, setMessage] = useState("");
  const [threads, setThreads] = useState([]);
  const [communityState, setCommunityState] = useState("loading");
  const [modal, setModal] = useState(null);
  const [compareId, setCompareId] = useState(
    colleges.find((item) => item.id !== college.id)?.id || "",
  );
  const [reviewIndex, setReviewIndex] = useState(0);
  const dialog = useRef(null);
  const tabRefs = useRef([]);
  useEffect(() => {
    let active = true;
    connectRequest("community")
      .then((data) => {
        if (active) {
          setThreads(data.threads);
          setCommunityState("ready");
        }
      })
      .catch(() => {
        if (active) setCommunityState("error");
      });
    return () => {
      active = false;
    };
  }, [college.id]);
  useEffect(() => {
    if (modal && dialog.current && !dialog.current.open)
      dialog.current.showModal();
  }, [modal]);
  function toggleSave() {
    const existing = readCollegeShortlist();
    const next = saved
      ? existing.filter((id) => id !== college.id)
      : [...new Set([...existing, college.id])];
    try {
      localStorage.setItem("campus-college-shortlist", JSON.stringify(next));
      setSaved(!saved);
      setMessage(
        saved
          ? "Removed from your device shortlist."
          : "Saved to your device shortlist.",
      );
    } catch {
      setMessage("Your browser could not save this shortlist.");
    }
  }
  async function share() {
    const url = new URL(window.location.href);
    url.searchParams.set("college", college.id);
    try {
      if (navigator.share)
        await navigator.share({ title: college.name, url: url.toString() });
      else {
        await navigator.clipboard.writeText(url.toString());
        setMessage("College link copied.");
      }
    } catch (error) {
      if (error.name !== "AbortError")
        setMessage("Copy this college link: " + url.toString());
    }
  }
  const show = (section) => tab === "Overview" || tab === section;
  const location = details.address || "Location not listed";
  const name = college.name;
  const review = details.reviews[reviewIndex];
  const other = colleges.find((item) => item.id === compareId);
  const campusThreads = threads
    .filter((thread) =>
      `${thread.title} ${thread.body}`
        .toLowerCase()
        .includes(name.split(" - ")[0].toLowerCase()),
    )
    .slice(0, 3);
  const communityThreads = campusThreads.length
    ? campusThreads
    : threads.slice(0, 3);
  const description =
    details.description ||
    `${name} is listed in the Campus Connect college catalogue${college.location ? ` in ${college.location}` : ""}. ${college.programs ? `Listed programmes include ${college.programs}. ` : ""}Explore the available course, admission and placement details below, and confirm current information with the institution.`;
  const navigation = [
    ["building", "Home", "home-discover"],
    ["building", "Colleges", "colleges-admissions"],
    ["briefcase", "Career Roadmaps", "careers-roadmap"],
    ["people", "Community", "community"],
    ["user", "Mentorship", "mentorship"],
    ["code", "Resources", "explore"],
    ["user", "Profile", user ? "student-dashboard" : "login"],
  ];
  const chooseTab = (value) => {
    setTab(value);
    setMessage("");
  };
  return (
    <div className="cd-page">
      <aside className="cd-sidebar">
        <nav aria-label="College sidebar">
          {navigation.map(([icon, label, screen]) => (
            <button
              key={label}
              className={label === "Colleges" ? "active" : ""}
              onClick={() => onNavigate(screen)}
            >
              <LandingIcon name={icon} size={20} />
              {label}
            </button>
          ))}
          <button onClick={() => setModal({ type: "compare" })}>
            <LandingIcon name="chart" size={20} />
            Compare colleges
          </button>
        </nav>
        <div className="cd-sidebar-promo">
          <h2>
            Find Your
            <br />
            Dream College
          </h2>
          <p>Explore courses, compare colleges and plan your next chapter.</p>
          <img
            src={`${import.meta.env.BASE_URL}landing/student-hero.png`}
            alt=""
          />
          <button onClick={() => onNavigate("colleges-admissions")}>
            Explore Colleges →
          </button>
        </div>
      </aside>
      <div className="cd-workspace">
        <section className="cd-hero" aria-labelledby="cd-college-title">
          <CollegeImage college={college} />
          <div className="cd-hero-shade" />
          <div className="cd-share-actions">
            <button onClick={share}>
              <LandingIcon name="arrow" size={16} />
              Share
            </button>
            <button
              onClick={toggleSave}
              aria-pressed={saved}
              title="Save on this device"
            >
              <LandingIcon name="heart" size={16} />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
          <div className="cd-hero-main">
            <div className="cd-college-mark">
              {college.logo ? (
                <img src={college.logo} alt={`${name} logo`} />
              ) : (
                <>
                  <LandingIcon name="building" size={41} />
                  <span>
                    {name
                      .split(/\s+/)
                      .filter((word) => /^[A-Za-z]/.test(word))
                      .slice(0, 4)
                      .map((word) => word[0])
                      .join("")}
                  </span>
                </>
              )}
            </div>
            <div className="cd-hero-text">
              <h1 id="cd-college-title">{name}</h1>
              <div className="cd-hero-meta">
                <span>
                  <LandingIcon name="pin" size={15} />
                  {college.subLocation ||
                    college.location ||
                    "Location not listed"}
                </span>
                {[college.category, college.naacGrade, college.tagExtra]
                  .filter(Boolean)
                  .map((tag) => (
                    <span className="cd-badge" key={tag}>
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
            <button
              className="cd-primary cd-compare-trigger"
              onClick={() => setModal({ type: "compare" })}
            >
              <LandingIcon name="chart" size={16} />
              Compare
            </button>
          </div>
        </section>
        {message && (
          <p className="cd-message" role="status">
            {message}
          </p>
        )}
        <div className="cd-layout">
          <div className="cd-main-column">
            <div
              className="cd-tabs"
              role="tablist"
              aria-label="College information"
            >
              {tabs.map((label, index) => (
                <button
                  key={label}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={`cd-tab-${index}`}
                  role="tab"
                  aria-selected={tab === label}
                  aria-controls="cd-content"
                  tabIndex={tab === label ? 0 : -1}
                  onClick={() => chooseTab(label)}
                  onKeyDown={(event) => {
                    if (
                      ["ArrowRight", "ArrowLeft", "Home", "End"].includes(
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
                      chooseTab(tabs[next]);
                      tabRefs.current[next]?.focus();
                    }
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="cd-stats">
              <Metric
                icon="target"
                value={
                  college.nirfRank ? `#${college.nirfRank}` : college.naacGrade
                }
                label={college.nirfRank ? "NIRF rank" : "Accreditation"}
                tone={0}
              />
              <Metric
                icon="people"
                value={
                  details.courses.length
                    ? `${details.courses.length} listed`
                    : null
                }
                label="Programmes"
                tone={1}
              />
              <Metric
                icon="shield"
                value={college.placementRate}
                label="Placement rate"
                tone={2}
              />
              <Metric
                icon="briefcase"
                value={college.avgCtc}
                label="Average package"
                tone={3}
              />
              <Metric
                icon="building"
                value={college.annualFee}
                label="Annual fee"
                tone={4}
              />
              <Metric
                icon="code"
                value={college.entranceExam}
                label="Entrance exam"
                tone={5}
              />
            </div>
            <div
              id="cd-content"
              role="tabpanel"
              aria-labelledby={`cd-tab-${tabs.indexOf(tab)}`}
              tabIndex={0}
            >
              {show("Overview") && (
                <div className="cd-overview-row">
                  <section className="cd-card cd-about">
                    <div>
                      <h2>About {name}</h2>
                      <p className={!expanded ? "cd-about-clamped" : ""}>
                        {description}
                      </p>
                      <button
                        className="cd-soft-button"
                        onClick={() => setExpanded(!expanded)}
                      >
                        {expanded ? "Read Less ↑" : "Read More ↓"}
                      </button>
                    </div>
                    <button
                      className="cd-tour"
                      onClick={() => setModal({ type: "photo" })}
                      aria-label={`View campus photo of ${name}`}
                    >
                      <CollegeImage college={college} />
                      <span>
                        <LandingIcon name="search" size={17} />
                        View campus photo
                      </span>
                    </button>
                  </section>
                  <section className="cd-card cd-location">
                    <h2>
                      <LandingIcon name="pin" size={16} />
                      Location
                    </h2>
                    <a
                      className="cd-map"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${location}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Find ${name} on Google Maps`}
                    >
                      <span className="cd-map-road cd-road-a" />
                      <span className="cd-map-road cd-road-b" />
                      <span className="cd-map-pin">
                        <LandingIcon name="pin" size={30} />
                      </span>
                      <small>Open map ↗</small>
                    </a>
                    <strong>{college.location || "Location"}</strong>
                    <p>{location}</p>
                    <a
                      className="cd-text-link"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${location}`)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on Google Maps →
                    </a>
                  </section>
                </div>
              )}
              {show("Courses") && (
                <section className="cd-card cd-courses">
                  <div className="cd-card-heading">
                    <h2>
                      {tab === "Overview"
                        ? "Popular Courses"
                        : "Courses & programmes"}
                    </h2>
                    {tab === "Overview" && (
                      <button onClick={() => chooseTab("Courses")}>
                        View All Courses →
                      </button>
                    )}
                  </div>
                  {details.courses.length ? (
                    <div className="cd-course-grid">
                      {(tab === "Overview"
                        ? details.courses.slice(0, 5)
                        : details.courses
                      ).map((course, index) => (
                        <article
                          className="cd-course"
                          key={`${course.name}-${index}`}
                        >
                          <div>
                            <span className={`cd-icon cd-tone-${index % 6}`}>
                              <LandingIcon
                                name={courseIcons[index % 5]}
                                size={23}
                              />
                            </span>
                            <h3>{course.name}</h3>
                          </div>
                          <p>
                            {course.description ||
                              "View the available programme information."}
                          </p>
                          <dl>
                            <div>
                              <dt>Duration:</dt>
                              <dd>{course.duration || "Not listed"}</dd>
                            </div>
                            <div>
                              <dt>Course fee:</dt>
                              <dd>{course.fee || "Confirm with college"}</dd>
                            </div>
                          </dl>
                          <button
                            onClick={() => setModal({ type: "course", course })}
                          >
                            View Details
                          </button>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <Empty>
                      No course information has been added for this college yet.
                    </Empty>
                  )}
                </section>
              )}
              {tab === "Admissions" && (
                <section className="cd-card">
                  <h2>Admissions & eligibility</h2>
                  <p>
                    {details.admissions ||
                      "An admission schedule and detailed eligibility requirements have not been published in this catalogue. Confirm the current process with the college."}
                  </p>
                  <div className="cd-fact-grid">
                    <Metric
                      icon="code"
                      value={college.entranceExam}
                      label="Entrance examination"
                    />
                    <Metric
                      icon="building"
                      value={college.annualFee}
                      label="College annual fee"
                      tone={1}
                    />
                  </div>
                  {Array.isArray(college.cutoffs) &&
                    college.cutoffs.length > 0 && (
                      <>
                        <h3>Sample course cutoffs</h3>
                        <div className="connect-table-wrap">
                          <table className="connect-cutoffs">
                            <thead>
                              <tr>
                                <th>Course</th>
                                <th>Opening rank</th>
                                <th>Closing rank</th>
                                <th>Seats</th>
                              </tr>
                            </thead>
                            <tbody>
                              {college.cutoffs.map((row, index) => (
                                <tr key={index}>
                                  <td>{row.branch}</td>
                                  <td>{row.openingRank ?? "—"}</td>
                                  <td>{row.closingRank ?? "—"}</td>
                                  <td>{row.seats ?? "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                </section>
              )}
              <div
                className={`cd-bottom-grid ${tab !== "Overview" ? "cd-single-grid" : ""}`}
              >
                {show("Placements") && (
                  <section className="cd-card cd-placements">
                    <div className="cd-card-heading">
                      <h2>Placements</h2>
                      {tab === "Overview" && (
                        <button onClick={() => chooseTab("Placements")}>
                          View Details →
                        </button>
                      )}
                    </div>
                    <div className="cd-placement-facts">
                      {[
                        [college.placementRate, "Placement rate"],
                        [college.avgCtc, "Average package"],
                        [college.highestCtc, "Highest package"],
                      ].map(([value, label]) => (
                        <div key={label}>
                          <strong>{value || "Not listed"}</strong>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                    <h3>Top recruiters</h3>
                    {details.recruiters.length ? (
                      <div className="cd-recruiters">
                        {details.recruiters.map((company) => (
                          <span key={company}>{company}</span>
                        ))}
                      </div>
                    ) : (
                      <Empty>Recruiter details have not been added.</Empty>
                    )}
                  </section>
                )}
                {show("Hostel & Facilities") && (
                  <section className="cd-card">
                    <div className="cd-card-heading">
                      <h2>Campus Facilities</h2>
                      {tab === "Overview" && (
                        <button
                          onClick={() => chooseTab("Hostel & Facilities")}
                        >
                          View All →
                        </button>
                      )}
                    </div>
                    {details.facilities.length ? (
                      <div className="cd-facilities">
                        {details.facilities.map((facility, index) => (
                          <div key={`${facility}-${index}`}>
                            <span className={`cd-icon cd-tone-${index % 6}`}>
                              <LandingIcon
                                name={
                                  [
                                    "building",
                                    "code",
                                    "briefcase",
                                    "data",
                                    "shield",
                                    "people",
                                  ][index % 6]
                                }
                                size={21}
                              />
                            </span>
                            <span>{facility}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Empty>
                        Facility information is awaiting an update from the
                        college.
                      </Empty>
                    )}
                    {tab === "Hostel & Facilities" && (
                      <>
                        <h3>Hostel & accommodation</h3>
                        <p>
                          {details.hostel ||
                            "Hostel availability, fees and policies are not listed. Contact the institution for current details."}
                        </p>
                      </>
                    )}
                  </section>
                )}
                {show("Reviews") && (
                  <section className="cd-card">
                    <div className="cd-card-heading">
                      <h2>Student Reviews</h2>
                      {tab === "Overview" && (
                        <button onClick={() => chooseTab("Reviews")}>
                          View All →
                        </button>
                      )}
                    </div>
                    {review ? (
                      <>
                        <div className="cd-review-author">
                          <span>{review.name[0]}</span>
                          <div>
                            <strong>{review.name}</strong>
                            <small>{review.course || "Student review"}</small>
                            {review.rating && (
                              <small className="cd-review-stars">
                                ★ {review.rating}/5
                              </small>
                            )}
                          </div>
                        </div>
                        <p>{review.body}</p>
                        {details.reviews.length > 1 && (
                          <div className="cd-review-controls">
                            <button
                              onClick={() =>
                                setReviewIndex(
                                  (reviewIndex - 1 + details.reviews.length) %
                                    details.reviews.length,
                                )
                              }
                              aria-label="Previous review"
                            >
                              ‹
                            </button>
                            <span>
                              {reviewIndex + 1} / {details.reviews.length}
                            </span>
                            <button
                              onClick={() =>
                                setReviewIndex(
                                  (reviewIndex + 1) % details.reviews.length,
                                )
                              }
                              aria-label="Next review"
                            >
                              ›
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <Empty>
                          No student reviews have been published for this
                          college.
                        </Empty>
                        <button
                          className="cd-soft-button"
                          onClick={() => onNavigate("community")}
                        >
                          Ask the community →
                        </button>
                      </>
                    )}
                  </section>
                )}
              </div>
              {tab === "Campus Life" && (
                <section className="cd-card">
                  <h2>Campus Life</h2>
                  <p>
                    {details.campusLife ||
                      "Events, clubs and campus-life information have not been added yet. Ask a question in the community to learn what to look for when visiting a campus."}
                  </p>
                  <button
                    className="cd-primary"
                    onClick={() => onNavigate("community")}
                  >
                    Explore student discussions →
                  </button>
                </section>
              )}
              {tab === "Students & Alumni" && (
                <section className="cd-card">
                  <h2>Students & Alumni</h2>
                  <p>
                    A verified student and alumni directory is not available
                    yet. Public discussions are a starting point for college
                    questions; member identities and college affiliations are
                    not independently verified.
                  </p>
                  <button
                    className="cd-primary"
                    onClick={() => onNavigate("community")}
                  >
                    Browse community questions →
                  </button>
                </section>
              )}
              {tab === "Community" && (
                <section className="cd-card">
                  <h2>Student discussions</h2>
                  <p>
                    {campusThreads.length
                      ? "Questions mentioning this college."
                      : "No matching college-specific questions yet. Explore the general Campus Connect community."}
                  </p>
                  {communityThreads.map((thread) => (
                    <article className="cd-inline-thread" key={thread.id}>
                      <h3>{thread.title}</h3>
                      <p>{thread.body}</p>
                      <small>{thread.author}</small>
                    </article>
                  ))}
                  <button
                    className="cd-primary"
                    onClick={() => onNavigate("community")}
                  >
                    Open Community →
                  </button>
                </section>
              )}
            </div>
            <p className="cd-data-note">
              Catalogue information is sample or administrator supplied. Confirm
              current fees, eligibility, accreditation and placement figures
              with the institution.
            </p>
          </div>
          <aside className="cd-right-column">
            <section className="cd-card cd-community-panel">
              <div className="cd-card-heading">
                <div>
                  <h2>Student & Alumni Community</h2>
                  <p>
                    {campusThreads.length
                      ? "Questions mentioning this college"
                      : "Across Campus Connect"}
                  </p>
                </div>
                <button
                  className="cd-outline"
                  onClick={() => onNavigate(user ? "community" : "login")}
                >
                  Join
                </button>
              </div>
              <div className="cd-mini-tabs">
                <strong>Discussions</strong>
                <button onClick={() => chooseTab("Students & Alumni")}>
                  Students & Alumni
                </button>
              </div>
              {communityState === "loading" ? (
                <Empty>Loading discussions…</Empty>
              ) : communityState === "error" ? (
                <Empty>
                  Discussions could not load. Open Community to try again.
                </Empty>
              ) : communityThreads.length ? (
                communityThreads.map((thread, index) => (
                  <button
                    className="cd-discussion"
                    key={thread.id}
                    onClick={() => onNavigate("community")}
                  >
                    <span className={`cd-person cd-tone-${index}`}>
                      {thread.author?.[0] || "S"}
                    </span>
                    <span>
                      <strong>{thread.title}</strong>
                      <small>
                        {thread.author} ·{" "}
                        {new Date(thread.created_at).toLocaleDateString()}
                      </small>
                    </span>
                    <LandingIcon name="people" size={15} />
                  </button>
                ))
              ) : (
                <Empty>Start the first discussion about this college.</Empty>
              )}
              <button
                className="cd-center-link"
                onClick={() => onNavigate("community")}
              >
                View All Discussions →
              </button>
            </section>
            <section className="cd-card">
              <h2>Campus Updates</h2>
              <Empty>
                No college-specific event or campus posts have been published
                yet.
              </Empty>
              <button
                className="cd-center-link"
                onClick={() => onNavigate("community")}
              >
                Explore student conversations →
              </button>
            </section>
            <section className="cd-card">
              <h2>Quick Actions</h2>
              <div className="cd-quick-actions">
                {[
                  ["people", "Ask a Question", "community"],
                  [
                    "user",
                    "Student Profile",
                    user ? "student-dashboard" : "login",
                  ],
                  ["cap", "Get Guidance", "mentorship"],
                  ["code", "Career Paths", "careers-roadmap"],
                ].map(([icon, label, screen], index) => (
                  <button key={label} onClick={() => onNavigate(screen)}>
                    <span className={`cd-icon cd-tone-${index}`}>
                      <LandingIcon name={icon} size={24} />
                    </span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className="cd-card cd-verify">
              <LandingIcon name="shield" size={26} />
              <div>
                <h3>Make an informed choice</h3>
                <p>
                  Visit the campus and verify the latest details before
                  applying.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
      <dialog
        className="cd-dialog"
        ref={dialog}
        onClose={() => setModal(null)}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
        aria-labelledby="cd-dialog-title"
      >
        <div className="cd-dialog-inner">
          <button
            className="cd-dialog-close"
            aria-label="Close details"
            onClick={() => dialog.current.close()}
          >
            <LandingIcon name="close" size={22} />
          </button>
          <h2 id="cd-dialog-title">
            {modal?.type === "compare"
              ? "Compare colleges"
              : modal?.type === "course"
                ? modal.course.name
                : "Campus photo"}
          </h2>
          {modal?.type === "photo" && <CollegeImage college={college} />}{" "}
          {modal?.type === "course" && (
            <>
              <p>
                {modal.course.description ||
                  "Programme listed in the college catalogue."}
              </p>
              <dl className="cd-dialog-facts">
                {[
                  ["Duration", modal.course.duration],
                  ["Course fee", modal.course.fee],
                  ["Eligibility", modal.course.eligibility],
                  ["Entrance examination", college.entranceExam],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value || "Not listed — confirm with the college"}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
          {modal?.type === "compare" && (
            <>
              <label htmlFor="cd-compare-college">Choose another college</label>
              <select
                id="cd-compare-college"
                value={compareId}
                onChange={(event) => setCompareId(event.target.value)}
              >
                <option value="">Select a college</option>
                {colleges
                  .filter((item) => item.id !== college.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
              {other ? (
                <div className="connect-table-wrap">
                  <table className="cd-compare-table">
                    <thead>
                      <tr>
                        <th>Detail</th>
                        <th>{name}</th>
                        <th>{other.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Location", "location"],
                        ["Institution type", "category"],
                        ["Annual fee", "annualFee"],
                        ["Average package", "avgCtc"],
                        ["Placement rate", "placementRate"],
                        ["Entrance exam", "entranceExam"],
                      ].map(([label, key]) => (
                        <tr key={key}>
                          <th>{label}</th>
                          <td>{college[key] || "Not listed"}</td>
                          <td>{other[key] || "Not listed"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty>
                  Select another college from the catalogue to compare available
                  figures.
                </Empty>
              )}
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
