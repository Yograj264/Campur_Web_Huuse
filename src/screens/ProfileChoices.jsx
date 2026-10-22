import { useEffect, useRef, useState } from "react";
import "./ProfileChoices.css";

import { alphabetical } from "../data/profileOptions";
export { CAREER_GOALS, CAREER_FIELDS, SKILLS } from "../data/profileOptions";
export const selectedChoices = (value) => [
  ...new Map(
    String(value || "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .map((v) => [v.toLowerCase(), v]),
  ).values(),
];

export default function ProfileChoices({
  name,
  label,
  value,
  onChange,
  options,
  max,
  searchable = false,
  required = false,
  invalid = false,
}) {
  const [search, setSearch] = useState("");
  const container = useRef(null);
  const dropdown = useRef(null);
  useEffect(() => {
    function closeOutside(event) {
      if (
        container.current &&
        !container.current.contains(event.target) &&
        dropdown.current
      )
        dropdown.current.open = false;
    }
    function closeOnEscape(event) {
      if (event.key === "Escape" && dropdown.current?.open) {
        dropdown.current.open = false;
        dropdown.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);
  const selected = selectedChoices(value);
  const choices = [
    ...new Map(
      [...options, ...selected].map((v) => [v.toLowerCase(), v]),
    ).values(),
  ].sort(alphabetical);
  const matches = choices.filter((option) =>
    option.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const full = max && selected.length >= max;
  function toggle(option) {
    if (selected.includes(option))
      onChange(selected.filter((v) => v !== option).join(", "));
    else if (!full) onChange([...selected, option].join(", "));
  }
  return (
    <div className="student-field profile-choice" ref={container}>
      <span id={`${name}-label`} className="profile-choice-label">
        {label}
        {required && " *"}
      </span>
      <details ref={dropdown}>
        <summary
          aria-labelledby={`${name}-label ${name}-value`}
          aria-describedby={`${name}-hint`}
        >
          <span id={`${name}-value`}>
            {selected.length ? selected.join(", ") : "Select options"}
          </span>
          <span aria-hidden="true">⌄</span>
        </summary>
        <div
          className="profile-choice-menu"
          role="group"
          aria-labelledby={`${name}-label`}
          aria-required={required}
          aria-invalid={invalid}
        >
          {searchable && (
            <input
              type="search"
              aria-label={`Search ${label.toLowerCase()}`}
              placeholder="Search skills…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          <div className="profile-choice-options">
            {matches.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  disabled={Boolean(full && !selected.includes(option))}
                  onChange={() => toggle(option)}
                />
                <span>{option}</span>
              </label>
            ))}
            {!matches.length && <p>No skills match your search.</p>}
          </div>
        </div>
      </details>
      <small id={`${name}-hint`}>
        {max
          ? `${selected.length} / ${max} selected. ${selected.length > max ? "Remove extra selections before saving." : `Choose up to ${max}.`}`
          : `${selected.length} selected. Search and check the skills you are learning.`}
      </small>
    </div>
  );
}
