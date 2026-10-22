import { useState } from "react";
import { LandingIcon } from "../components/landing/LandingIcon";
import { CollegeImage } from "../components/landing/CollegeImage";
import { readCollegeShortlist } from "../data/collegeDetails";
import { ROADMAPS } from "../data/roadmaps";
import "./ProfileOverview.css";

const split = (value, separator = ",") =>
  String(value || "")
    .split(separator)
    .map((v) => v.trim())
    .filter(Boolean);
const tabs = [
  "Overview",
  "My Interests",
  "Saved",
  "My Sessions",
  "My Posts",
  "Notifications",
  "Settings",
];
const tabIcons = [
  "people",
  "target",
  "heart",
  "briefcase",
  "code",
  "bell",
  "settings",
];
const labels = {
  school: "School student",
  college: "College student",
  graduate: "Graduate",
};
function savedCareers() {
  try {
    const ids = JSON.parse(
      localStorage.getItem("campus-saved-careers") || "[]",
    );
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}
export default function ProfileOverview({
  profile: p,
  user,
  colleges,
  onSelectCollege,
  onSelectCareer,
  onNavigate,
  onEdit,
  onLogout,
  message,
}) {
  const [tab, setTab] = useState("Overview");
  const [saved, setSaved] = useState(readCollegeShortlist);
  const [careerIds, setCareerIds] = useState(savedCareers);
  const shortlisted = colleges.filter((c) => saved.includes(c.id));
  const roadmaps = ROADMAPS.filter((c) => careerIds.includes(c.id));
  const goals = split(p.goals, "\n");
  const skills = split(p.skills);
  const interests = split(p.interests);
  const preferred = split(p.preferred_fields);
  const completed = [
    p.full_name,
    p.education,
    p.institution,
    p.city,
    p.career_goal,
  ].filter(Boolean).length;
  const [notice, setNotice] = useState("");
  function removeSaved(id, career = false) {
    const next = (career ? careerIds : saved).filter((v) => v !== id);
    try {
      localStorage.setItem(
        career ? "campus-saved-careers" : "campus-college-shortlist",
        JSON.stringify(next),
      );
      if (career) setCareerIds(next);
      else setSaved(next);
    } catch {
      setNotice("Your browser could not update the saved list.");
    }
  }
  function Panel({ title, children, edit = false, className = "" }) {
    return (
      <section className={`pd-panel ${className}`}>
        <div className="pd-panel-head">
          <h2>{title}</h2>
          {edit && (
            <button className="pd-small" onClick={onEdit}>
              ✎ Edit
            </button>
          )}
        </div>
        {children}
      </section>
    );
  }
  const chips = (items, empty) =>
    items.length ? (
      <div className="pd-tags">
        {items.map((v, i) => (
          <span key={i}>{v}</span>
        ))}
      </div>
    ) : (
      <p className="pd-muted">{empty}</p>
    );
  const collegeCards = (all = false) =>
    shortlisted.length ? (
      <div className="pd-colleges">
        {(all ? shortlisted : shortlisted.slice(0, 4)).map((c) => (
          <div key={c.id}>
            <button className="pd-college" onClick={() => onSelectCollege(c)}>
              <CollegeImage college={c} />
              <strong>{c.name}</strong>
              <small>{c.location}</small>
            </button>
            {all && (
              <button className="pd-small" onClick={() => removeSaved(c.id)}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="pd-empty">
        <p>No colleges shortlisted yet.</p>
        <button onClick={() => onNavigate("colleges-admissions")}>
          Explore colleges →
        </button>
      </div>
    );
  const about = (
    <Panel title="About Me" edit>
      <p className="pd-bio">
        {p.bio ||
          "Add a little about yourself, what you enjoy learning and where you want to go."}
      </p>
      <dl className="pd-details">
        {[
          ["people", "Full Name", p.full_name],
          ["building", "College / School", p.institution],
          ["cap", "Program", p.course],
          ["pin", "Location", p.city],
          ["cap", "Graduation", p.graduation_year],
          ["target", "Career Goal", p.career_goal],
        ].map(([icon, label, value]) => (
          <div key={label}>
            <dt>
              <LandingIcon name={icon} size={16} />
              {label}
            </dt>
            <dd>{value || "Not added yet"}</dd>
          </div>
        ))}
        <div>
          <dt>
            <LandingIcon name="target" size={16} />
            Interests
          </dt>
          <dd>{chips(interests, "Add your interests")}</dd>
        </div>
      </dl>
      <div className="pd-socials">
        {[
          ["LinkedIn", p.linkedin_url],
          ["GitHub", p.github_url],
        ].map(([label, url]) => (
          <div key={label}>
            <strong>{label}</strong>
            {url ? (
              <a href={url} target="_blank" rel="noreferrer">
                {url.replace(/^https:\/\//, "")} ↗
              </a>
            ) : (
              <button onClick={onEdit}>Add {label} ↗</button>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
  const goalPanel = (
    <Panel title="Current Goals" edit>
      {goals.length ? (
        <ol className="pd-goals">
          {goals.map((goal, i) => (
            <li key={i}>
              <span>{i + 1}</span>
              <div>
                <strong>{goal}</strong>
                <small>Your personal learning goal</small>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="pd-empty">
          <p>What would you like to achieve next?</p>
          <button onClick={onEdit}>Add your goals →</button>
        </div>
      )}
    </Panel>
  );
  const preferencePanel = (
    <Panel title="My Preferred Career Fields" edit>
      {preferred.length ? (
        <div className="pd-fields">
          {preferred.map((name, i) => (
            <div key={i}>
              <LandingIcon
                name={["code", "building", "shield", "data"][i % 4]}
                size={25}
              />
              <span>{name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="pd-empty">
          <p>Add the fields you want to explore.</p>
          <button onClick={onEdit}>Choose your fields →</button>
        </div>
      )}
    </Panel>
  );
  const settings = (
    <Panel title="Account Settings">
      <div className="pd-settings">
        <button onClick={onEdit}>
          <LandingIcon name="people" />{" "}
          <span>
            <strong>Edit Profile</strong>
            <small>Update your personal and academic information</small>
          </span>
          ›
        </button>
        <div>
          <LandingIcon name="shield" />
          <span>
            <strong>Private profile</strong>
            <small>
              Your details and images are visible to your account and site
              administrators.
            </small>
          </span>
        </div>
        <div>
          <LandingIcon name="heart" />
          <span>
            <strong>Saved items</strong>
            <small>
              Shortlisted colleges and roadmaps are stored in this browser, not
              synchronised across devices.
            </small>
          </span>
        </div>
        <div>
          <LandingIcon name="people" />
          <span>
            <strong>Account email</strong>
            <small>{p.email || "Phone account"}</small>
          </span>
        </div>
        <button className="pd-logout" onClick={onLogout}>
          <LandingIcon name="arrow" />
          <span>
            <strong>Log Out</strong>
            <small>End your current session</small>
          </span>
          ↗
        </button>
      </div>
    </Panel>
  );
  return (
    <div className="pd-shell">
      <div className="pd-main">
        <header className="pd-profile">
          <div className={`pd-cover ${p.cover_url ? "pd-has-cover" : ""}`}>
            {p.cover_url && <img src={p.cover_url} alt="Your profile cover" />}
            <button onClick={onEdit}>
              <LandingIcon name="camera" size={16} />
              Change Cover
            </button>
          </div>
          <div className="pd-identity">
            <div className="pd-avatar">
              {p.photo_url ? (
                <img src={p.photo_url} alt="Your profile" />
              ) : (
                <span>{(p.full_name || user.name || "S").slice(0, 1)}</span>
              )}
              <button aria-label="Change profile photo" onClick={onEdit}>
                ✎
              </button>
            </div>
            <div className="pd-intro">
              <h1>{p.full_name || user.name}</h1>
              <p>
                {[labels[p.education], p.course, p.institution]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="pd-headline">
                {p.headline || p.career_goal || "Your journey starts here."}
              </p>
              <div className="pd-meta">
                <span>
                  <LandingIcon name="pin" size={14} />
                  {p.city || "Add your location"}
                </span>
                {p.qualification && (
                  <span>
                    <LandingIcon name="cap" size={15} />
                    {p.qualification}
                    {p.school_completion_year
                      ? ` (${p.school_completion_year})`
                      : ""}
                  </span>
                )}
                {p.available_for_mentorship && (
                  <span>
                    <LandingIcon name="people" size={15} />
                    Interested in mentorship
                  </span>
                )}
              </div>
            </div>
            <button className="pd-primary pd-edit" onClick={onEdit}>
              ✎ Edit Profile
            </button>
            <blockquote>
              <b>“</b>
              {p.quote || "Your next chapter is yours to build."}
            </blockquote>
          </div>
        </header>
        {(message || notice) && (
          <p className="pd-notice" role="status">
            {notice || message}
          </p>
        )}
        <div className="pd-tabs" role="tablist" aria-label="Profile sections">
          {tabs.map((name, i) => (
            <button
              key={name}
              id={`pd-tab-${i}`}
              role="tab"
              aria-selected={tab === name}
              aria-controls="pd-content"
              tabIndex={tab === name ? 0 : -1}
              onClick={() => setTab(name)}
              onKeyDown={(e) => {
                let next;
                if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
                else if (e.key === "ArrowLeft")
                  next = (i + tabs.length - 1) % tabs.length;
                else if (e.key === "Home") next = 0;
                else if (e.key === "End") next = tabs.length - 1;
                else return;
                e.preventDefault();
                setTab(tabs[next]);
                e.currentTarget.parentElement.children[next].focus();
              }}
            >
              <LandingIcon name={tabIcons[i]} size={17} />
              {name}
            </button>
          ))}
        </div>
        <div className="pd-stats">
          {[
            ["cap", shortlisted.length, "Colleges Shortlisted"],
            ["code", roadmaps.length, "Saved Roadmaps"],
            ["target", goals.length, "Current Goals"],
            ["data", skills.length, "Skills I’m Learning"],
            ["people", `${completed}/5`, "Profile Essentials"],
          ].map(([icon, count, label], i) => (
            <div key={label} className={`pd-stat pd-tone-${i}`}>
              <span>
                <LandingIcon name={icon} size={27} />
              </span>
              <div>
                <strong>{count}</strong>
                <small>{label}</small>
              </div>
            </div>
          ))}
        </div>
        <div
          id="pd-content"
          role="tabpanel"
          aria-labelledby={`pd-tab-${tabs.indexOf(tab)}`}
        >
          {tab === "Overview" && (
            <div className="pd-columns">
              <div>
                {about}
                <Panel title="Skills I'm Learning" edit>
                  {chips(
                    skills,
                    "Add skills you are learning, such as Python, Django or design.",
                  )}
                </Panel>
              </div>
              <div>
                {goalPanel}
                <Panel title="Your Next Steps">
                  <div className="pd-next">
                    <button onClick={() => onNavigate("careers-roadmap")}>
                      <LandingIcon name="code" />
                      <span>
                        <strong>Explore a career roadmap</strong>
                        <small>
                          Find skills, projects and learning resources
                        </small>
                      </span>
                      →
                    </button>
                    <button onClick={() => onNavigate("community")}>
                      <LandingIcon name="people" />
                      <span>
                        <strong>Ask the community</strong>
                        <small>Share a question with other students</small>
                      </span>
                      →
                    </button>
                    <button onClick={() => onNavigate("mentorship")}>
                      <LandingIcon name="briefcase" />
                      <span>
                        <strong>Plan your guidance questions</strong>
                        <small>Prepare what you want to learn next</small>
                      </span>
                      →
                    </button>
                  </div>
                </Panel>
              </div>
              <div>
                {preferencePanel}
                <Panel title="Shortlisted Colleges">
                  {collegeCards()}
                  <button className="pd-link" onClick={() => setTab("Saved")}>
                    View all saved →
                  </button>
                </Panel>
                <Panel title="Connected Mentors">
                  <div className="pd-empty">
                    <LandingIcon name="people" size={27} />
                    <p>
                      No mentor connections yet. Live mentor matching and
                      session booking are not available.
                    </p>
                    <button onClick={() => onNavigate("mentorship")}>
                      Open guidance planner →
                    </button>
                  </div>
                </Panel>
              </div>
            </div>
          )}
          {tab === "My Interests" && (
            <div className="pd-interest-layout">
              <div>
                {preferencePanel}
                <Panel title="My Interests" edit>
                  {chips(
                    interests,
                    "Add the subjects and activities that interest you.",
                  )}
                </Panel>
                <Panel title="Skills I'm Learning" edit>
                  {chips(
                    skills,
                    "Add your skills to personalise your profile.",
                  )}
                </Panel>
              </div>
              {goalPanel}
            </div>
          )}
          {tab === "Saved" && (
            <>
              <p className="pd-muted">
                Saved on this browser. These lists do not sync between devices.
              </p>
              <Panel title="Shortlisted Colleges">{collegeCards(true)}</Panel>
              <Panel title="Saved Career Roadmaps">
                {roadmaps.length ? (
                  <div className="pd-saved-roadmaps">
                    {roadmaps.map((r) => (
                      <div key={r.id}>
                        <LandingIcon name={r.icon} />
                        <button onClick={() => onSelectCareer(r.id)}>
                          {r.title} →
                        </button>
                        <button
                          className="pd-small"
                          onClick={() => removeSaved(r.id, true)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pd-empty">
                    <p>No roadmaps saved yet.</p>
                    <button onClick={() => onNavigate("careers-roadmap")}>
                      Explore roadmaps →
                    </button>
                  </div>
                )}
              </Panel>
            </>
          )}
          {tab === "My Sessions" && (
            <Panel title="My Sessions">
              <div className="pd-empty">
                <LandingIcon name="briefcase" size={40} />
                <h3>Your mentorship journey</h3>
                <p>
                  Live sessions and bookings are not available yet. You can save
                  private questions in your guidance planner.
                </p>
                <button
                  className="pd-primary"
                  onClick={() => onNavigate("mentorship")}
                >
                  Open guidance planner →
                </button>
              </div>
            </Panel>
          )}
          {tab === "My Posts" && (
            <Panel title="Community Posts">
              <div className="pd-empty">
                <p>
                  Open the community to read discussions and post a question. A
                  personal post history is not available in this dashboard yet.
                </p>
                <button
                  className="pd-primary"
                  onClick={() => onNavigate("community")}
                >
                  Open community →
                </button>
              </div>
            </Panel>
          )}
          {tab === "Notifications" && (
            <Panel title="Notifications">
              <div className="pd-empty">
                <LandingIcon name="bell" size={35} />
                <p>No notification feed is available yet.</p>
              </div>
            </Panel>
          )}
          {tab === "Settings" && settings}
        </div>
      </div>
    </div>
  );
}
