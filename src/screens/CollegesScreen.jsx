import { useRef, useState } from "react";
import { CollegeImage } from "../components/landing/CollegeImage";
import { LandingIcon } from "../components/landing/LandingIcon";
import { readCollegeShortlist } from "../data/collegeDetails";
import "./CollegesScreen.css";

const text = (value) =>
  Array.isArray(value) ? value.join(", ") : String(value || "");
const fields = [
  ["location", "Location"],
  ["programs", "Courses / Degrees"],
  ["category", "College Type"],
  ["naacGrade", "Accreditation"],
  ["entranceExam", "Exam Accepted"],
];
function options(colleges, key) {
  return [
    ...new Set(
      colleges.flatMap((c) =>
        text(c[key])
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
      ),
    ),
  ].sort();
}
export function CollegesScreen({
  colleges = [],
  onSelectCollege,
  initialQuery = "",
}) {
  const [query, setQuery] = useState(initialQuery);
  const [applied, setApplied] = useState(initialQuery);
  const [filters, setFilters] = useState({});
  const [fee, setFee] = useState("");
  const [sort, setSort] = useState("relevance");
  const [view, setView] = useState("grid");
  const [saved, setSaved] = useState(readCollegeShortlist);
  const [onlySaved, setOnlySaved] = useState(false);
  const [selected, setSelected] = useState([]);
  const [notice, setNotice] = useState("");
  const dialog = useRef(null);
  function toggleFilter(key, value) {
    setFilters((old) => ({
      ...old,
      [key]: (old[key] || []).includes(value)
        ? old[key].filter((v) => v !== value)
        : [...(old[key] || []), value],
    }));
  }
  function clear() {
    setFilters({});
    setFee("");
    setQuery("");
    setApplied("");
    setOnlySaved(false);
  }
  function save(id) {
    const next = saved.includes(id)
      ? saved.filter((v) => v !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem("campus-college-shortlist", JSON.stringify(next));
    } catch {
      setNotice("Your browser could not save the shortlist on this device.");
    }
  }
  function compare(id) {
    if (selected.includes(id)) setSelected(selected.filter((v) => v !== id));
    else if (selected.length < 5) {
      setSelected([...selected, id]);
      setNotice("");
    } else
      setNotice(
        "You can compare up to five colleges. Remove one to add another.",
      );
  }
  const matches = colleges
    .filter((c) => {
      const haystack = [
        c.name,
        c.location,
        c.subLocation,
        c.programs,
        c.category,
      ]
        .map(text)
        .join(" ")
        .toLowerCase();
      return (
        applied
          .toLowerCase()
          .trim()
          .split(/\s+/)
          .every((word) => haystack.includes(word)) &&
        fields.every(
          ([key]) =>
            !filters[key]?.length ||
            filters[key].some((v) =>
              text(c[key])
                .split(",")
                .map((s) => s.trim())
                .includes(v),
            ),
        ) &&
        (!fee ||
          (Number.isFinite(Number(c.annualFeeNumber)) &&
            (fee === "low"
              ? Number(c.annualFeeNumber) <= 2
              : fee === "mid"
                ? Number(c.annualFeeNumber) > 2 &&
                  Number(c.annualFeeNumber) <= 5
                : Number(c.annualFeeNumber) > 5))) &&
        (!onlySaved || saved.includes(c.id))
      );
    })
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "fee-low"
          ? (Number(a.annualFeeNumber) || 0) - (Number(b.annualFeeNumber) || 0)
          : sort === "fee-high"
            ? (Number(b.annualFeeNumber) || 0) -
              (Number(a.annualFeeNumber) || 0)
            : Number(Boolean(b.image)) - Number(Boolean(a.image)),
    );
  const compared = colleges.filter((c) => selected.includes(c.id));
  const cityCount = options(colleges, "location").length;
  return (
    <section className="ac-page">
      <div className="ac-hero">
        <div>
          <p className="ac-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
          <h1>
            Explore <span>All Colleges</span>
          </h1>
          <p>
            Discover and compare colleges based on location, courses, fees and
            campus life.
          </p>
        </div>
        <img src="/static/frontend/landing/campus-future.png" alt="" />
        <div className="ac-stats">
          <div>
            <LandingIcon name="building" />
            <strong>{colleges.length}</strong>
            <small>Colleges listed</small>
          </div>
          <div>
            <LandingIcon name="pin" />
            <strong>{cityCount}</strong>
            <small>Locations</small>
          </div>
          <div>
            <LandingIcon name="chart" />
            <strong>Compare</strong>
            <small>Up to 5 colleges</small>
          </div>
        </div>
      </div>
      <div className="ac-tools">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setApplied(query);
          }}
        >
          <LandingIcon name="search" size={19} />
          <input
            aria-label="Search colleges"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by college name, location, course, or keyword…"
          />
          <button className="ac-primary">Search</button>
        </form>
        <div className="ac-quick">
          <select
            aria-label="Filter by location"
            value=""
            onChange={(e) => toggleFilter("location", e.target.value)}
          >
            <option value="">Location</option>
            {options(colleges, "location").map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <select
            aria-label="Annual fee range"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          >
            <option value="">Annual fees</option>
            <option value="low">Up to ₹2 lakh</option>
            <option value="mid">₹2–5 lakh</option>
            <option value="high">Above ₹5 lakh</option>
          </select>
          <button
            aria-pressed={onlySaved}
            onClick={() => setOnlySaved(!onlySaved)}
          >
            ♡ Saved (
            {saved.filter((id) => colleges.some((c) => c.id === id)).length})
          </button>
          <button className="ac-link" onClick={clear}>
            Clear All
          </button>
        </div>
      </div>
      <div className="ac-layout">
        <aside className="ac-filters">
          <div className="ac-section-head">
            <h2>Filters</h2>
            <button className="ac-link" onClick={clear}>
              Clear All
            </button>
          </div>
          {fields.map(([key, label]) => (
            <details key={key} open>
              <summary>{label}</summary>
              <div className="ac-filter-options">
                {options(colleges, key).map((v) => (
                  <label key={v}>
                    <input
                      type="checkbox"
                      checked={Boolean(filters[key]?.includes(v))}
                      onChange={() => toggleFilter(key, v)}
                    />
                    <span>{v}</span>
                    <small>
                      {
                        colleges.filter((c) =>
                          text(c[key])
                            .split(",")
                            .map((s) => s.trim())
                            .includes(v),
                        ).length
                      }
                    </small>
                  </label>
                ))}
                {!options(colleges, key).length && <p>No values listed yet.</p>}
              </div>
            </details>
          ))}
        </aside>
        <div className="ac-results">
          <div className="ac-result-bar">
            <h2>
              Showing {matches.length}{" "}
              {matches.length === 1 ? "college" : "colleges"}
            </h2>
            <div>
              <label>
                Sort by:{" "}
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="relevance">Relevance</option>
                  <option value="name">Name A–Z</option>
                  <option value="fee-low">Fees: Low to High</option>
                  <option value="fee-high">Fees: High to Low</option>
                </select>
              </label>
              <button
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
              >
                ▦ Grid
              </button>
              <button
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
              >
                ☷ List
              </button>
            </div>
          </div>
          <div className="ac-chips">
            {fields.flatMap(([key]) =>
              (filters[key] || []).map((v) => (
                <button
                  key={`${key}-${v}`}
                  aria-label={`Remove ${v} filter`}
                  onClick={() => toggleFilter(key, v)}
                >
                  {v} ×
                </button>
              )),
            )}
          </div>
          <div className={`ac-cards ac-${view}`}>
            {matches.map((c) => (
              <article className="ac-card" key={c.id}>
                <div className="ac-photo">
                  <CollegeImage college={c} />
                  <button
                    className="ac-heart"
                    aria-label={`${saved.includes(c.id) ? "Unsave" : "Save"} ${c.name}`}
                    aria-pressed={saved.includes(c.id)}
                    onClick={() => save(c.id)}
                  >
                    <LandingIcon name="heart" size={19} />
                  </button>
                  <div className="ac-badges">
                    {[c.category, c.naacGrade].filter(Boolean).map((v, i) => (
                      <span key={i}>{v}</span>
                    ))}
                  </div>
                </div>
                <div className="ac-card-body">
                  <h3>{c.name}</h3>
                  <p>
                    <LandingIcon name="pin" size={15} />
                    {c.subLocation || c.location || "Location not listed"}
                  </p>
                  <p>
                    <LandingIcon name="cap" size={16} />
                    {text(c.programs) || "Courses not listed"}
                  </p>
                  <p>
                    <LandingIcon name="briefcase" size={15} />
                    {c.annualFee ||
                      (c.annualFeeNumber != null
                        ? `₹${c.annualFeeNumber} lakh / year`
                        : "Fee not listed")}
                  </p>
                  <label className="ac-compare-check">
                    <input
                      type="checkbox"
                      checked={selected.includes(c.id)}
                      onChange={() => compare(c.id)}
                    />{" "}
                    Compare
                  </label>
                  <div className="ac-card-actions">
                    <button
                      className="ac-primary"
                      onClick={() => onSelectCollege(c)}
                    >
                      View Details →
                    </button>
                    <button
                      onClick={() => {
                        if (!selected.includes(c.id)) compare(c.id);
                        dialog.current.showModal();
                      }}
                    >
                      Quick Compare
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!matches.length && (
            <div className="ac-empty">
              <LandingIcon name="building" size={38} />
              <h3>No colleges match these filters</h3>
              <p>Try a different search or clear the filters.</p>
              <button className="ac-primary" onClick={clear}>
                Clear filters
              </button>
            </div>
          )}
          <p className="ac-data-note">
            Catalogue information is sample or administrator supplied. Confirm
            current fees, eligibility and accreditation with each institution.
          </p>
        </div>
        <aside className="ac-right">
          <section className="ac-location-panel">
            <div className="ac-map-art" aria-hidden="true">
              <span>⌖</span>
              <i>EXPLORE YOUR OPTIONS</i>
            </div>
            <h2>Explore by location</h2>
            <p>Open a location in Google Maps to explore the area.</p>
            {[...new Set(matches.map((c) => c.location).filter(Boolean))]
              .slice(0, 4)
              .map((location) => (
                <a
                  key={location}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("colleges in " + location)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LandingIcon name="pin" size={16} />
                  {location}
                  <span>↗</span>
                </a>
              ))}
          </section>
          <section className="ac-picks">
            <h2>Colleges to Explore</h2>
            <p>From your current results</p>
            {matches.slice(0, 5).map((c) => (
              <button key={c.id} onClick={() => onSelectCollege(c)}>
                <CollegeImage college={c} />
                <span>
                  <strong>{c.name}</strong>
                  <small>{c.location}</small>
                </span>
                <span>›</span>
              </button>
            ))}
          </section>
          <section className="ac-promo">
            <LandingIcon name="chart" size={40} />
            <h2>Can't decide which college is right for you?</h2>
            <p>Compare fees, courses and admission information side by side.</p>
            <button
              className="ac-primary"
              onClick={() => dialog.current.showModal()}
            >
              Compare Colleges →
            </button>
          </section>
        </aside>
      </div>
      <div role="status" className="ac-notice">
        {notice}
      </div>
      {selected.length > 0 && (
        <div className="ac-compare-tray">
          <strong>{selected.length} / 5 colleges selected</strong>
          <button onClick={() => setSelected([])}>Clear</button>
          <button
            className="ac-primary"
            onClick={() => dialog.current.showModal()}
          >
            Compare selected →
          </button>
        </div>
      )}
      <dialog
        ref={dialog}
        className="ac-dialog"
        aria-labelledby="ac-compare-title"
      >
        <div className="ac-section-head">
          <h2 id="ac-compare-title">Compare Colleges</h2>
          <button
            aria-label="Close comparison"
            onClick={() => dialog.current.close()}
          >
            ×
          </button>
        </div>
        <p>Select two to five colleges using the Compare checkboxes.</p>
        {compared.length > 0 ? (
          <div className="ac-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Information</th>
                  {compared.map((c) => (
                    <th key={c.id}>
                      {c.name}
                      <button
                        aria-label={`Remove ${c.name} from comparison`}
                        onClick={() => compare(c.id)}
                      >
                        ×
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Location", "location"],
                  ["Type", "category"],
                  ["Courses", "programs"],
                  ["Annual fee", "annualFee"],
                  ["Accreditation", "naacGrade"],
                  ["Entrance exam", "entranceExam"],
                ].map(([label, key]) => (
                  <tr key={key}>
                    <th>{label}</th>
                    {compared.map((c) => (
                      <td key={c.id}>{text(c[key]) || "Not listed"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>
            No colleges selected yet. Close this window and choose colleges from
            the results.
          </p>
        )}
      </dialog>
    </section>
  );
}
