import { useState } from "react";
import { adminRequest } from "./api";

const lines = (value) =>
  Array.isArray(value) ? value.join("\n") : value || "";
const list = (value) =>
  String(value || "")
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
const emptyDetails = {
  role: "",
  tagline: "",
  about: "",
  bestFor: "",
  skills: [],
  tools: [],
  projects: [],
  focus: [],
  core: [],
  degrees: [],
  resources: [],
};
const defaults = {
  colleges: {
    name: "",
    location: "",
    annual_fee: "0",
    category: "",
    subLocation: "",
    image: "",
    description: "",
    naacGrade: "",
    entranceExam: "",
  },
  students: {
    full_name: "",
    email: "",
    password: "",
    is_active: true,
    education: "",
    institution: "",
    course: "",
    city: "",
    career_goal: "",
  },
  courses: {
    name: "",
    college: "",
    duration: "",
    annual_fee: "",
    description: "",
    eligibility: "",
    published: true,
  },
  plans: {
    name: "",
    roadmap: "",
    duration: "",
    description: "",
    steps: "",
    published: true,
  },
  roadmaps: {
    title: "",
    summary: "",
    icon: "code",
    theme: "blue",
    stages: [],
    details: emptyDetails,
    published: true,
  },
};
const fieldSets = {
  colleges: [
    ["name", "College name", "text", true],
    ["location", "City / State", "text", true],
    ["annual_fee", "Annual fee (lakh INR)", "number", true],
    ["category", "Institution type"],
    ["subLocation", "Full location"],
    ["image", "Campus image URL (HTTPS)", "url"],
    ["description", "About the college", "textarea"],
    ["naacGrade", "Accreditation"],
    ["entranceExam", "Entrance examination"],
  ],
  students: [
    ["full_name", "Full name", "text", true],
    ["email", "Email address", "email", true],
    ["password", "Password", "password"],
    ["education", "Education stage", "education"],
    ["institution", "School / College"],
    ["course", "Course / Stream"],
    ["city", "City"],
    ["career_goal", "Career goals (up to 3, comma separated)"],
    ["is_active", "Account active", "checkbox"],
  ],
  courses: [
    ["college", "College", "college", true],
    ["name", "Course / Program name", "text", true],
    ["duration", "Duration"],
    ["annual_fee", "Annual fee (lakh INR)", "number"],
    ["description", "Description", "textarea"],
    ["eligibility", "Eligibility"],
    ["published", "Visible on college page", "checkbox"],
  ],
  plans: [
    ["name", "Plan name", "text", true],
    ["roadmap", "Career roadmap", "roadmap"],
    ["duration", "Suggested study duration"],
    ["description", "Description", "textarea"],
    ["steps", "Learning steps (one per line)", "textarea", true],
    ["published", "Published", "checkbox"],
  ],
  roadmaps: [
    ["title", "Roadmap title", "text", true],
    ["summary", "Summary", "textarea", true],
    ["icon", "Icon", "icon", true],
    ["theme", "Colour theme", "theme", true],
    ["stages", "Learning stages (one per line)", "stages", true],
    ["published", "Published", "checkbox"],
  ],
};
const selectOptions = {
  education: [
    ["", "Not added"],
    ["school", "School student"],
    ["college", "College student"],
    ["graduate", "Graduate"],
  ],
  icon: [
    "code",
    "data",
    "shield",
    "bulb",
    "palette",
    "briefcase",
    "cap",
    "building",
    "chart",
    "target",
  ].map((v) => [v, v]),
  theme: ["blue", "green", "orange", "purple", "pink"].map((v) => [v, v]),
};
export default function AdminEditor({
  resource,
  record,
  options,
  onSaved,
  onCancel,
  onSessionExpired,
}) {
  const [draft, setDraft] = useState(() => ({
    ...defaults[resource],
    ...record,
    password: "",
    details: { ...emptyDetails, ...record?.details },
  }));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (key, value) => setDraft((old) => ({ ...old, [key]: value }));
  function detail(key, value) {
    setDraft((old) => ({ ...old, details: { ...old.details, [key]: value } }));
  }
  function error(key) {
    return errors[key]?.length ? (
      <small className="ad-field-error">
        {errors[key].map((v) => v.message).join(" ")}
      </small>
    ) : null;
  }
  async function save(e) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setErrors({});
    setMessage("");
    try {
      const values = { ...draft };
      if (resource === "roadmaps") {
        values.stages = Array.isArray(draft.stages)
          ? draft.stages
          : list(draft.stages);
        values.details = { ...draft.details };
        for (const key of ["skills", "tools", "projects", "focus", "core"])
          values.details[key] = Array.isArray(draft.details[key])
            ? draft.details[key]
            : list(draft.details[key]);
      }
      if (values.annual_fee === "") values.annual_fee = null;
      if (resource === "plans" && !values.roadmap) values.roadmap = "";
      await adminRequest(
        `${resource}/${record ? encodeURIComponent(record.id) + "/" : ""}`,
        record ? "PUT" : "POST",
        values,
      );
      onSaved();
    } catch (err) {
      if (err.status === 401) onSessionExpired();
      else {
        setMessage(err.message);
        setErrors(err.fields);
      }
    } finally {
      setSaving(false);
    }
  }
  function field([key, label, type = "text", required = false]) {
    let choices = selectOptions[type];
    if (type === "college")
      choices = (options.colleges || []).map((v) => [v.id, v.name]);
    if (type === "roadmap")
      choices = (options.roadmaps || []).map((v) => [v.id, v.title]);
    return (
      <div
        className={`ad-field ${type === "textarea" || type === "stages" ? "ad-wide" : ""}`}
        key={key}
      >
        <label htmlFor={`ad-${key}`}>
          {label}
          {required ? " *" : ""}
        </label>
        {choices ? (
          <select
            id={`ad-${key}`}
            value={draft[key] ?? ""}
            required={required}
            onChange={(e) => set(key, e.target.value)}
          >
            <option value="">
              {required ? "Choose an option" : "Not assigned"}
            </option>
            {choices.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        ) : type === "checkbox" ? (
          <label className="ad-checkbox">
            <input
              id={`ad-${key}`}
              type="checkbox"
              checked={Boolean(draft[key])}
              onChange={(e) => set(key, e.target.checked)}
            />
            Enabled
          </label>
        ) : type === "textarea" || type === "stages" ? (
          <textarea
            id={`ad-${key}`}
            rows={4}
            required={required}
            maxLength={type === "stages" ? 10000 : 5000}
            value={type === "stages" ? lines(draft[key]) : (draft[key] ?? "")}
            onChange={(e) => set(key, e.target.value)}
          />
        ) : (
          <input
            id={`ad-${key}`}
            type={type}
            autoComplete={type === "password" ? "new-password" : "off"}
            min={type === "number" ? 0 : undefined}
            step={type === "number" ? "0.01" : undefined}
            required={
              required ||
              (resource === "students" && key === "password" && !record)
            }
            value={draft[key] ?? ""}
            onChange={(e) => set(key, e.target.value)}
            maxLength={type === "password" ? 128 : undefined}
          />
        )}
        {key === "password" && (
          <small>
            {record
              ? "Leave blank to keep the current password."
              : "Set a strong initial password; share it privately with the student."}
          </small>
        )}
        {error(key)}
      </div>
    );
  }
  function entries(key, fields) {
    return (
      <section className="ad-nested ad-wide">
        <div className="ad-panel-head">
          <h3>
            {key === "degrees" ? "Education routes" : "Learning resources"}
          </h3>
          <button
            type="button"
            onClick={() =>
              detail(key, [
                ...(draft.details[key] || []),
                Object.fromEntries(
                  fields.map(([name]) => [
                    name,
                    name === "type" ? "Documentation" : "",
                  ]),
                ),
              ])
            }
          >
            + Add
          </button>
        </div>
        {(draft.details[key] || []).map((item, index) => (
          <div className="ad-nested-row" key={index}>
            {fields.map(([name, label]) => (
              <label key={name}>
                {label}
                {name === "type" ? (
                  <select
                    value={item[name]}
                    onChange={(e) =>
                      detail(
                        key,
                        draft.details[key].map((v, i) =>
                          i === index ? { ...v, [name]: e.target.value } : v,
                        ),
                      )
                    }
                  >
                    {["Documentation", "Practice", "Guide"].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={name === "url" ? "url" : "text"}
                    required={
                      name === "id" ||
                      name === "title" ||
                      name === "url" ||
                      name === "name"
                    }
                    value={item[name] || ""}
                    onChange={(e) =>
                      detail(
                        key,
                        draft.details[key].map((v, i) =>
                          i === index ? { ...v, [name]: e.target.value } : v,
                        ),
                      )
                    }
                  />
                )}
              </label>
            ))}
            <button
              className="ad-danger"
              type="button"
              onClick={() =>
                detail(
                  key,
                  draft.details[key].filter((_, i) => i !== index),
                )
              }
            >
              Remove
            </button>
          </div>
        ))}
      </section>
    );
  }
  return (
    <section className="ad-panel ad-editor">
      <div className="ad-panel-head">
        <div>
          <p className="ad-eyebrow">
            {record ? "UPDATE RECORD" : "NEW RECORD"}
          </p>
          <h2>
            {record ? "Edit" : "Add"}{" "}
            {resource === "students"
              ? "Student"
              : resource === "roadmaps"
                ? "Career Roadmap"
                : resource === "plans"
                  ? "Study Plan"
                  : resource === "courses"
                    ? "Course / Program"
                    : "College"}
          </h2>
        </div>
        <button onClick={onCancel} disabled={saving}>
          ← Back to list
        </button>
      </div>
      <p className="ad-muted">
        Fields marked * are required.
        {resource === "plans"
          ? " Published plans linked to a roadmap appear on its career path page."
          : ""}
      </p>
      {message && (
        <p className="ad-error" role="alert">
          {message}
        </p>
      )}
      <form onSubmit={save}>
        <fieldset disabled={saving}>
          <legend className="ad-sr-only">Management form</legend>
          <div className="ad-form-grid">
            {fieldSets[resource].map(field)}
            {resource === "roadmaps" && (
              <>
                <h3 className="ad-wide">Roadmap content</h3>
                {[
                  ["role", "Career role"],
                  ["tagline", "Tagline"],
                  ["about", "About this career"],
                  ["bestFor", "Who this suits"],
                ].map(([key, label]) => (
                  <label className="ad-field" key={key}>
                    {label}
                    <textarea
                      rows={3}
                      value={draft.details[key] || ""}
                      onChange={(e) => detail(key, e.target.value)}
                    />
                  </label>
                ))}
                {[
                  ["skills", "Key skills"],
                  ["tools", "Tools"],
                  ["projects", "Project ideas"],
                  ["focus", "First steps"],
                  ["core", "Core learning topics"],
                ].map(([key, label]) => (
                  <label className="ad-field" key={key}>
                    {label} (one per line)
                    <textarea
                      rows={4}
                      value={lines(draft.details[key])}
                      onChange={(e) => detail(key, e.target.value)}
                    />
                  </label>
                ))}
                {entries("degrees", [
                  ["id", "Degree code"],
                  ["title", "Title"],
                  ["description", "Description"],
                  ["kind", "Level"],
                ])}
                {entries("resources", [
                  ["name", "Name"],
                  ["url", "HTTPS URL"],
                  ["type", "Type"],
                  ["description", "Description"],
                ])}
                {error("details")}
              </>
            )}
          </div>
          <div className="ad-form-actions">
            <button className="ad-primary" type="submit">
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
