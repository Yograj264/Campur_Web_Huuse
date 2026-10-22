import { useEffect, useRef, useState } from "react";
import { LandingIcon } from "../components/landing/LandingIcon";
import { adminRequest } from "./api";
import AdminEditor from "./AdminEditor";
import "./Admin.css";

const sections = [
  ["dashboard", "Dashboard", "home"],
  ["colleges", "Colleges", "building"],
  ["courses", "Courses & Programs", "briefcase"],
  ["students", "Students", "people"],
  ["roadmaps", "Career Roadmaps", "code"],
  ["plans", "Study Plans", "cap"],
];
const titleOf = (key) =>
  sections.find((v) => v[0] === key)?.[1] || "Page not available";
function currentSection() {
  return window.location.pathname.split("/")[2] || "dashboard";
}
function Logo() {
  return (
    <a className="ad-brand" href="/">
      <LandingIcon name="cap" size={43} />
      <span>
        Campus Connect<small>Admin Panel</small>
      </span>
    </a>
  );
}
function AdminLogin({ onLogin }) {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await adminRequest("login/", "POST", {
        identity,
        password,
        remember,
      });
      setPassword("");
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="ad-login">
      <section className="ad-login-story">
        <Logo />
        <div className="ad-login-copy">
          <span className="ad-pill">Admin Panel</span>
          <h1>
            Manage Today,
            <br />
            <em>Empower Tomorrow.</em>
          </h1>
          <p>
            A dedicated space to manage colleges, students and the learning
            paths that shape their future.
          </p>
          <div className="ad-login-features">
            {[
              [
                "building",
                "Manage Colleges",
                "Keep college and program information up to date",
              ],
              [
                "people",
                "Support Students",
                "Manage student accounts and academic details",
              ],
              [
                "code",
                "Build Career Paths",
                "Create roadmaps and practical study plans",
              ],
              [
                "chart",
                "Track Your Platform",
                "See current database counts and admin activity",
              ],
            ].map(([icon, title, description]) => (
              <div key={title}>
                <span>
                  <LandingIcon name={icon} size={27} />
                </span>
                <div>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="ad-login-photo"
          style={{
            backgroundImage:
              "linear-gradient(180deg,#263975,#26397500 70%),url('/static/frontend/landing/campus-future.png')",
          }}
        />
        <blockquote>
          “Empowering education through better management and real insights.”
          <small>— Campus Connect</small>
        </blockquote>
      </section>
      <section className="ad-login-form-side">
        <a className="ad-back-site" href="/">
          ← Back to Website
        </a>
        <div className="ad-login-card">
          <LandingIcon name="cap" size={65} />
          <h2>Campus Connect</h2>
          <p className="ad-letterspaced">ADMIN PANEL</p>
          <h1>Admin Login</h1>
          <p>Sign in to manage the Campus Connect platform.</p>
          <form onSubmit={submit}>
            <label htmlFor="ad-identity">Email Address or Username</label>
            <input
              id="ad-identity"
              autoComplete="username"
              required
              maxLength={254}
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              placeholder="Your administrator account"
              disabled={busy}
            />
            <label htmlFor="ad-password">Password</label>
            <div className="ad-password">
              <input
                id="ad-password"
                autoComplete="current-password"
                type={show ? "text" : "password"}
                required
                maxLength={256}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={busy}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            <div className="ad-login-options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Keep me signed in
              </label>
              <button
                type="button"
                onClick={() =>
                  setError(
                    "Ask another authorized administrator to reset your password if you cannot sign in.",
                  )
                }
              >
                Forgot password?
              </button>
            </div>
            {error && (
              <p className="ad-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="ad-primary" disabled={busy}>
              {busy ? "Signing in…" : "Sign In →"}
            </button>
          </form>
          <div className="ad-login-restricted">
            <LandingIcon name="shield" size={27} />
            <span>
              This is a restricted area. Only authorized staff accounts can
              access the admin panel.
            </span>
          </div>
        </div>
        <footer>
          © {new Date().getFullYear()} Campus Connect · Administrator access
        </footer>
      </section>
    </div>
  );
}

function Records({ resource, user, onSessionExpired, initialQuery = "" }) {
  const [result, setResult] = useState(null);
  const [query, setQuery] = useState(initialQuery);
  const [search, setSearch] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [editing, setEditing] = useState(null);
  const [options, setOptions] = useState({ colleges: [], roadmaps: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [confirmId, setConfirmId] = useState("");
  const [busy, setBusy] = useState(false);
  const dialog = useRef(null);
  const perms = user.permissions[resource];
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([
      adminRequest(`${resource}/?q=${encodeURIComponent(search)}&page=${page}`),
      adminRequest("options/"),
    ])
      .then(([data, refs]) => {
        if (active) {
          setResult(data);
          setOptions(refs);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
          if (err.status === 401) onSessionExpired();
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [resource, search, page, version]);
  useEffect(() => {
    if (deleting && dialog.current && !dialog.current.open)
      dialog.current.showModal();
  }, [deleting]);
  function closeDelete() {
    if (busy) return;
    dialog.current?.close();
    setDeleting(null);
    setConfirmId("");
  }
  async function remove() {
    if (!deleting || confirmId !== String(deleting.id) || busy) return;
    setBusy(true);
    setError("");
    try {
      await adminRequest(
        `${resource}/${encodeURIComponent(deleting.id)}/`,
        "DELETE",
        { confirm_id: confirmId },
      );
      dialog.current.close();
      setDeleting(null);
      setConfirmId("");
      setVersion((v) => v + 1);
    } catch (err) {
      setError(err.message);
      if (err.status === 401) onSessionExpired();
    } finally {
      setBusy(false);
    }
  }
  if (editing)
    return (
      <AdminEditor
        resource={resource}
        record={editing.id ? editing : null}
        options={options}
        onSaved={() => {
          setEditing(null);
          setVersion((v) => v + 1);
        }}
        onCancel={() => setEditing(null)}
        onSessionExpired={onSessionExpired}
      />
    );
  const columns =
    resource === "colleges"
      ? [
          ["name", "College Name"],
          ["location", "Location"],
          ["category", "Type"],
          ["annual_fee", "Annual Fee (L)"],
        ]
      : resource === "students"
        ? [
            ["full_name", "Student"],
            ["email", "Email"],
            ["institution", "College / School"],
            ["is_active", "Status"],
          ]
        : resource === "courses"
          ? [
              ["name", "Course / Program"],
              ["college_name", "College"],
              ["duration", "Duration"],
              ["published", "Status"],
            ]
          : resource === "plans"
            ? [
                ["name", "Study Plan"],
                ["roadmap_title", "Roadmap"],
                ["duration", "Duration"],
                ["published", "Status"],
              ]
            : [
                ["title", "Roadmap"],
                ["summary", "Summary"],
                ["published", "Status"],
              ];
  return (
    <>
      <section className="ad-panel">
        <div className="ad-panel-head">
          <div>
            <h2>{titleOf(resource)}</h2>
            <p className="ad-muted">
              Manage your current{" "}
              {resource === "plans" ? "learning plans" : resource}.
            </p>
          </div>
          {perms.add && (
            <button className="ad-primary" onClick={() => setEditing({})}>
              + Add{" "}
              {resource === "colleges"
                ? "College"
                : resource === "students"
                  ? "Student"
                  : resource === "courses"
                    ? "Course"
                    : resource === "plans"
                      ? "Plan"
                      : "Roadmap"}
            </button>
          )}
        </div>
        <form
          className="ad-search-form"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(query);
          }}
        >
          <LandingIcon name="search" size={18} />
          <input
            aria-label={`Search ${resource}`}
            placeholder={`Search ${titleOf(resource).toLowerCase()}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button>Search</button>
        </form>
        {error && (
          <p role="alert" className="ad-error">
            {error}
          </p>
        )}
        {loading ? (
          <p role="status" className="ad-muted">
            Loading records…
          </p>
        ) : (
          <>
            <div className="ad-table-scroll">
              <table>
                <thead>
                  <tr>
                    {columns.map(([key, title]) => (
                      <th key={key}>{title}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {result?.records.map((row) => (
                    <tr key={row.id}>
                      {columns.map(([key]) => (
                        <td key={key}>
                          {typeof row[key] === "boolean" ? (
                            <span
                              className={`ad-badge ${row[key] ? "ad-positive" : "ad-draft"}`}
                            >
                              {row[key]
                                ? key === "is_active"
                                  ? "Active"
                                  : "Published"
                                : key === "is_active"
                                  ? "Inactive"
                                  : "Draft"}
                            </span>
                          ) : (
                            String(row[key] ?? "") || "Not listed"
                          )}
                        </td>
                      ))}
                      <td>
                        <div className="ad-row-actions">
                          {perms.change && (
                            <button
                              onClick={() => setEditing(row)}
                              aria-label={`Edit ${row.name || row.title || row.full_name}`}
                            >
                              ✎ Edit
                            </button>
                          )}
                          {resource === "colleges" && (
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={`/?college=${encodeURIComponent(row.id)}`}
                            >
                              View ↗
                            </a>
                          )}
                          {resource === "roadmaps" && row.published && (
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={`/?career=${encodeURIComponent(row.id)}`}
                            >
                              View ↗
                            </a>
                          )}
                          {perms.delete && (
                            <button
                              className="ad-danger"
                              onClick={() => {
                                setError("");
                                setDeleting(row);
                              }}
                            >
                              Delete
                            </button>
                          )}
                          {!perms.change && !perms.delete && (
                            <small>Read only</small>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!result?.records.length && (
              <div className="ad-empty">
                <LandingIcon name="building" size={35} />
                <p>
                  No records found. Try another search or add your first record.
                </p>
              </div>
            )}
            <div className="ad-pagination">
              <span>
                {result?.count || 0} records · Page {result?.page || 1} of{" "}
                {result?.pages || 1}
              </span>
              <div>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Previous
                </button>
                <button
                  disabled={page >= (result?.pages || 1)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </section>
      <dialog
        className="ad-dialog"
        ref={dialog}
        onCancel={(e) => {
          if (busy) e.preventDefault();
          else {
            setDeleting(null);
            setConfirmId("");
          }
        }}
      >
        <h2>
          Delete {deleting?.name || deleting?.title || deleting?.full_name}?
        </h2>
        <p>
          This permanently deletes this record.
          {resource === "colleges"
            ? " Its managed courses will also be deleted."
            : resource === "students"
              ? " Its student profile and related account authentication records will also be deleted."
              : resource === "roadmaps"
                ? " Linked study plans will remain, without a roadmap."
                : ""}
        </p>
        <label>
          Type <strong>{deleting?.id}</strong> to confirm
          <input
            aria-label="Record ID confirmation"
            value={confirmId}
            onChange={(e) => setConfirmId(e.target.value)}
            disabled={busy}
          />
        </label>
        {error && (
          <p className="ad-error" role="alert">
            {error}
          </p>
        )}
        <div className="ad-form-actions">
          <button disabled={busy} onClick={closeDelete}>
            Cancel
          </button>
          <button
            className="ad-delete-confirm"
            disabled={busy || confirmId !== String(deleting?.id)}
            onClick={remove}
          >
            {busy ? "Deleting…" : "Delete permanently"}
          </button>
        </div>
      </dialog>
    </>
  );
}

function Dashboard({ user, onNavigate }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    adminRequest("summary/")
      .then((result) => {
        if (active) {
          setData(result);
          setError("");
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [retry]);
  if (error)
    return (
      <div className="ad-error" role="alert">
        {error} <button onClick={() => setRetry((v) => v + 1)}>Retry</button>
      </div>
    );
  if (!data)
    return (
      <p className="ad-muted" role="status">
        Loading dashboard…
      </p>
    );
  const cards = [
    ["colleges", "Total Colleges", "building"],
    ["users", "Total Users", "people"],
    ["students", "Student Accounts", "people"],
    ["courses", "Courses & Programs", "cap"],
    ["roadmaps", "Career Roadmaps", "code"],
    ["plans", "Study Plans", "briefcase"],
  ];
  const colors = [
    "#7145ff",
    "#398dff",
    "#20bea1",
    "#ffad29",
    "#9da6c4",
    "#e46ba5",
  ];
  const categories = Object.entries(data.categories);
  let offset = 0;
  const total = categories.reduce((n, [, count]) => n + count, 0);
  const gradient = categories
    .map(([, count], i) => {
      const start = offset;
      offset += (count / (total || 1)) * 100;
      return `${colors[i % colors.length]} ${start}% ${offset}%`;
    })
    .join(",");
  const growth = data.growth;
  const high = Math.max(...growth.map((row) => row.count), 1);
  const points = growth
    .map((row, i) => `${40 + i * 76},${155 - (row.count / high) * 120}`)
    .join(" ");
  return (
    <>
      <div className="ad-stat-grid">
        {cards.map(([key, label, icon], i) => (
          <div className={`ad-stat ad-tone-${i}`} key={key}>
            <span>
              <LandingIcon name={icon} size={29} />
            </span>
            <div>
              <strong>{data.counts[key] ?? "—"}</strong>
              <small>{label}</small>
            </div>
            <p>
              {data.counts[key] === null
                ? "Permission required"
                : "Current database total"}
            </p>
          </div>
        ))}
      </div>
      <div className="ad-dashboard-grid">
        <section className="ad-panel ad-growth">
          <div className="ad-panel-head">
            <h2>New User Registrations</h2>
            <span className="ad-chip">Last 6 Months</span>
          </div>
          {growth.length ? (
            <>
              <p className="ad-chart-legend">
                <i />
                All account registrations
              </p>
              <svg
                viewBox="0 0 465 190"
                role="img"
                aria-label={`Monthly new users: ${growth.map((v) => `${v.month}: ${v.count}`).join(", ")}`}
              >
                <defs>
                  <linearGradient id="ad-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#4796ff" stopOpacity=".2" />
                    <stop offset="1" stopColor="#4796ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[35, 75, 115, 155].map((y) => (
                  <line
                    key={y}
                    x1="30"
                    x2="440"
                    y1={y}
                    y2={y}
                    stroke="#e9edf8"
                  />
                ))}
                <polygon
                  points={`40,155 ${points} 420,155`}
                  fill="url(#ad-area)"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke="#388bff"
                  strokeWidth="2.5"
                />
                {growth.map((row, i) => (
                  <g key={row.month}>
                    <circle
                      cx={40 + i * 76}
                      cy={155 - (row.count / high) * 120}
                      r="4"
                      fill="#398bff"
                    />
                    <text
                      x={40 + i * 76}
                      y={Math.max(17, 145 - (row.count / high) * 120)}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#496186"
                    >
                      {row.count}
                    </text>
                    <text
                      x={40 + i * 76}
                      y="181"
                      textAnchor="middle"
                      fontSize="9"
                      fill="#7d82a2"
                    >
                      {row.month}
                    </text>
                  </g>
                ))}
              </svg>
            </>
          ) : (
            <p className="ad-muted">
              User statistics require permission to view users.
            </p>
          )}
        </section>
        <section className="ad-panel ad-types">
          <h2>Colleges by Type</h2>
          {total ? (
            <div className="ad-donut-wrap">
              <div
                className="ad-donut"
                style={{ background: `conic-gradient(${gradient})` }}
              >
                <div>
                  <strong>{total}</strong>
                  <small>Colleges</small>
                </div>
              </div>
              <ul>
                {categories.map(([name, count], i) => (
                  <li key={name}>
                    <i style={{ background: colors[i % colors.length] }} />
                    <span>{name}</span>
                    <strong>{count}</strong>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="ad-muted">No college type data is available.</p>
          )}
        </section>
        <section className="ad-panel ad-activity">
          <div className="ad-panel-head">
            <h2>Recent Admin Activity</h2>
            <span className="ad-chip">Audit log</span>
          </div>
          {data.activity.length ? (
            <ul>
              {data.activity.map((row) => (
                <li key={row.id}>
                  <span>
                    <LandingIcon name="briefcase" size={18} />
                  </span>
                  <div>
                    <strong>
                      {row.action}: {row.object}
                    </strong>
                    <small>
                      {row.actor} · {new Date(row.time).toLocaleString()}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="ad-empty">
              <p>No administrative changes recorded yet.</p>
            </div>
          )}
        </section>
        <section className="ad-panel ad-recent-colleges">
          <div className="ad-panel-head">
            <h2>College Catalogue</h2>
            {user.permissions.colleges.view && (
              <button
                className="ad-link"
                onClick={() => onNavigate("colleges")}
              >
                View all →
              </button>
            )}
          </div>
          <div className="ad-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>College Name</th>
                  <th>Location</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {data.colleges.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <a
                        href={`/?college=${encodeURIComponent(row.id)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {row.name}
                      </a>
                    </td>
                    <td>{row.location}</td>
                    <td>{row.category || "Not listed"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.colleges.length && (
              <p className="ad-muted">No college records available.</p>
            )}
          </div>
        </section>
        <section className="ad-panel ad-recent-students">
          <div className="ad-panel-head">
            <h2>Recent Students</h2>
            {user.permissions.students.view && (
              <button
                className="ad-link"
                onClick={() => onNavigate("students")}
              >
                View all →
              </button>
            )}
          </div>
          <div className="ad-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>College / School</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((row) => (
                  <tr key={row.id}>
                    <td>{row.full_name}</td>
                    <td>{row.institution || "Not added"}</td>
                    <td>
                      <span
                        className={`ad-badge ${row.is_active ? "ad-positive" : "ad-draft"}`}
                      >
                        {row.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.students.length && (
              <p className="ad-muted">No student records available.</p>
            )}
          </div>
        </section>
        <section className="ad-panel ad-quick-actions">
          <h2>Quick Actions</h2>
          <div>
            {sections
              .slice(1)
              .filter(([key]) => user.permissions[key]?.view)
              .map(([key, label, icon]) => (
                <button key={key} onClick={() => onNavigate(key)}>
                  <LandingIcon name={icon} size={22} />
                  {label}
                </button>
              ))}
          </div>
          <div className="ad-system">
            <LandingIcon name="shield" size={20} />
            <span>
              Database connected<small>Dashboard loaded successfully</small>
            </span>
          </div>
        </section>
      </div>
      <p className="ad-footnote">
        Figures come from the current database. Trend charts show registration
        dates; no sample growth percentages are displayed.
      </p>
    </>
  );
}

export default function AdminApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [section, setSection] = useState(currentSection);
  const [search, setSearch] = useState("");
  const [catalogueSearch, setCatalogueSearch] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    adminRequest("session/")
      .then((data) => {
        if (active) {
          setUser(data.user);
          if (data.user && currentSection() === "login") navigate("dashboard");
          setError("");
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retry]);
  useEffect(() => {
    const pop = () => setSection(currentSection());
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  function navigate(next) {
    setSection(next);
    window.history.pushState(
      null,
      "",
      next === "dashboard" ? "/admin/" : `/admin/${next}/`,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function signOut() {
    setLoggingOut(true);
    try {
      await adminRequest("logout/", "POST", {});
      setUser(null);
      navigate("dashboard");
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoggingOut(false);
    }
  }
  if (loading)
    return (
      <div className="ad-loading" role="status">
        Loading administration…
      </div>
    );
  if (error && !user)
    return (
      <div className="ad-loading">
        <p role="alert">{error}</p>
        <button onClick={() => setRetry((v) => v + 1)}>Retry</button>
        <a href="/">Back to website</a>
      </div>
    );
  if (!user)
    return (
      <AdminLogin
        onLogin={(account) => {
          setUser(account);
          navigate("dashboard");
        }}
      />
    );
  const valid =
    section === "dashboard" ||
    sections.some(([key]) => key === section && user.permissions[key]?.view);
  return (
    <div className="ad-shell">
      <aside className="ad-sidebar">
        <Logo />
        <p className="ad-nav-label">WORKSPACE</p>
        <nav aria-label="Admin navigation">
          {sections
            .filter(
              ([key]) => key === "dashboard" || user.permissions[key]?.view,
            )
            .map(([key, label, icon]) => (
              <button
                key={key}
                className={section === key ? "ad-nav-active" : ""}
                aria-current={section === key ? "page" : undefined}
                onClick={() => navigate(key)}
              >
                <LandingIcon name={icon} size={19} />
                {label}
              </button>
            ))}
        </nav>
        <div className="ad-sidebar-bottom">
          <a href="/">↗ Back to Website</a>
          <a href="/django-admin/">Django administration ↗</a>
          <button disabled={loggingOut} onClick={signOut}>
            {loggingOut ? "Signing out…" : "Log Out →"}
          </button>
        </div>
      </aside>
      <div className="ad-workspace">
        <header className="ad-topbar">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (user.permissions.colleges.view) {
                setCatalogueSearch(search);
                navigate("colleges");
              }
            }}
          >
            <LandingIcon name="search" size={18} />
            <input
              aria-label="Search college catalogue"
              placeholder="Search colleges…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button>Search</button>
          </form>
          <div className="ad-admin-identity">
            <span>{user.name.slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{user.name}</strong>
              <small>
                {user.is_superuser ? "Super Admin" : "Staff Administrator"}
              </small>
            </div>
          </div>
        </header>
        <main className="ad-content">
          <div className="ad-page-title">
            <div>
              <p className="ad-eyebrow">CAMPUS CONNECT ADMINISTRATION</p>
              <h1>
                {section === "dashboard"
                  ? `Welcome back, ${user.name}!`
                  : titleOf(section)}
              </h1>
              <p>Manage your catalogue, students and learning opportunities.</p>
            </div>
            <div className="ad-date">
              <LandingIcon name="briefcase" size={20} />
              <span>
                {new Date().toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                <small>
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "long",
                  })}
                </small>
              </span>
            </div>
          </div>
          {error && (
            <p role="alert" className="ad-error">
              {error}
            </p>
          )}
          {valid ? (
            section === "dashboard" ? (
              <Dashboard user={user} onNavigate={navigate} />
            ) : (
              <Records
                key={`${section}-${section === "colleges" ? catalogueSearch : ""}`}
                initialQuery={section === "colleges" ? catalogueSearch : ""}
                resource={section}
                user={user}
                onSessionExpired={() => setUser(null)}
              />
            )
          ) : (
            <section className="ad-panel">
              <h2>This section is not available</h2>
              <p>
                Your account may not have permission, or this page has not been
                added yet.
              </p>
              <button onClick={() => navigate("dashboard")}>
                Return to dashboard
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
