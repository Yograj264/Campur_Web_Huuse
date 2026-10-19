import { useState } from "react";
import { CollegeImage } from "../components/landing/CollegeImage";
import { LandingIcon } from "../components/landing/LandingIcon";

export function CollegesScreen({ colleges, onSelectCollege, onNavigate }) {
  const [query, setQuery] = useState("");
  const matches = colleges.filter((college) =>
    `${college.name} ${college.location} ${college.subLocation} ${college.programs}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  return (
    <section className="connect-container connect-subpage">
      <p className="connect-eyebrow">Explore your options</p>
      <h1>Find your college</h1>
      <p className="connect-page-description">
        Browse the catalogue and explore courses, location, and fees. Figures
        are sample data.
      </p>
      <label className="connect-field-label" htmlFor="college-search">
        Search colleges, courses, or locations
      </label>
      <input
        id="college-search"
        className="connect-filter-input"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Try IIT, computer science, or Delhi"
        autoFocus
      />
      <p className="connect-results-count">
        {matches.length} {matches.length === 1 ? "college" : "colleges"}
      </p>
      <div className="connect-catalogue-grid">
        {matches.map((college) => (
          <button
            className="connect-college-card"
            key={college.id}
            onClick={() => onSelectCollege(college)}
          >
            <CollegeImage college={college} />
            <div className="connect-college-content">
              <h3>{college.name}</h3>
              <p>
                <LandingIcon name="pin" size={16} />
                <span>{college.subLocation || college.location}</span>
              </p>
              <p className="connect-card-fee">
                Annual fee:{" "}
                {college.annualFee || `INR ${college.annualFeeNumber} lakh`}
              </p>
            </div>
          </button>
        ))}
      </div>
      {matches.length === 0 && (
        <p className="connect-empty">
          No colleges match your search. Try another name or location.
        </p>
      )}
      <button
        className="connect-text-link"
        onClick={() => onNavigate("home-discover")}
      >
        Back to home <LandingIcon name="arrow" size={18} />
      </button>
    </section>
  );
}

export function CollegeDetails({ college, onNavigate }) {
  return (
    <section className="connect-container connect-subpage">
      <button
        className="connect-text-link"
        onClick={() => onNavigate("colleges-admissions")}
      >
        Back to colleges
      </button>
      <div className="connect-detail-layout">
        <CollegeImage college={college} />
        <div>
          <p className="connect-eyebrow">College overview</p>
          <h1>{college.name}</h1>
          <p className="connect-page-description">
            {college.subLocation || college.location}
          </p>
          <p>{college.programs}</p>
          <dl className="connect-facts">
            <div>
              <dt>Annual fee</dt>
              <dd>
                {college.annualFee || `INR ${college.annualFeeNumber} lakh`}
              </dd>
            </div>
            <div>
              <dt>Average CTC</dt>
              <dd>{college.avgCtc || "Not listed"}</dd>
            </div>
            <div>
              <dt>Entrance examination</dt>
              <dd>{college.entranceExam || "Not listed"}</dd>
            </div>
            <div>
              <dt>Institution type</dt>
              <dd>{college.category || "Not listed"}</dd>
            </div>
          </dl>
        </div>
      </div>
      {!!college.cutoffs?.length && (
        <>
          <h2>Sample course cutoffs</h2>
          <div className="connect-table-wrap">
            <table className="connect-cutoffs">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Opening</th>
                  <th>Closing</th>
                  <th>Seats</th>
                </tr>
              </thead>
              <tbody>
                {college.cutoffs.map((cutoff) => (
                  <tr key={cutoff.branch}>
                    <td>{cutoff.branch}</td>
                    <td>{cutoff.openingRank}</td>
                    <td>{cutoff.closingRank}</td>
                    <td>{cutoff.seats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <p className="connect-data-note">
        This catalogue contains sample information. Confirm current fees,
        eligibility, and cutoffs with the institution before making decisions.
      </p>
    </section>
  );
}
