import { useEffect, useState } from "react";
import { profileRequest } from "../api";
import "./StudentDashboard.css";
import ProfileOverview from "./ProfileOverview";
import ProfileChoices, {
  CAREER_GOALS,
  CAREER_FIELDS,
  SKILLS,
  selectedChoices,
} from "./ProfileChoices";

const educationLabels = {
  school: "School student",
  college: "College student",
  graduate: "Graduate",
};
const blank = {
  full_name: "",
  education: "",
  institution: "",
  course: "",
  graduation_year: "",
  city: "",
  interests: "",
  career_goal: "",
  bio: "",
  headline: "",
  skills: "",
  preferred_fields: "",
  goals: "",
  linkedin_url: "",
  github_url: "",
  qualification: "",
  school_completion_year: "",
  quote: "",
  available_for_mentorship: false,
};

export default function StudentDashboard({
  user,
  colleges = [],
  onSelectCollege,
  onSelectCareer,
  onUserUpdate,
  onLogout,
  onNavigate,
  onSessionExpired,
}) {
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(blank);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [preview, setPreview] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    profileRequest()
      .then(({ profile: record }) => {
        if (!active) return;
        setProfile(record);
        setDraft({ ...blank, ...record });
        setEditing(!record.is_complete);
        setMessage("");
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401) onSessionExpired();
        else setMessage(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user.id, retry]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function choosePhoto(event) {
    const chosen = event.target.files[0];
    if (!chosen) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(chosen.type) ||
      chosen.size > 2 * 1024 * 1024
    ) {
      setErrors((previous) => ({
        ...previous,
        photo_upload: [
          { message: "Choose a JPEG, PNG or WebP image smaller than 2 MB." },
        ],
      }));
      event.target.value = "";
      return;
    }
    setErrors((previous) => ({ ...previous, photo_upload: [] }));
    setFile(chosen);
    setRemovePhoto(false);
  }

  async function save(event) {
    event.preventDefault();
    if (saving) return;
    const selectionErrors = {};
    const goalCount = selectedChoices(draft.career_goal).length;
    if (!goalCount || goalCount > 3)
      selectionErrors.career_goal = [
        { message: "Choose between one and three career goals." },
      ];
    if (selectedChoices(draft.preferred_fields).length > 3)
      selectionErrors.preferred_fields = [
        { message: "Choose no more than three career fields." },
      ];
    if (Object.keys(selectionErrors).length) {
      setErrors(selectionErrors);
      setMessage("Please check the highlighted selections.");
      return;
    }
    setSaving(true);
    setErrors({});
    setMessage("");
    const values = new FormData();
    Object.keys(blank).forEach((key) =>
      values.append(
        key,
        typeof draft[key] === "boolean"
          ? draft[key]
            ? "on"
            : ""
          : (draft[key] ?? ""),
      ),
    );
    if (file) values.append("photo_upload", file);
    if (coverFile) values.append("cover_upload", coverFile);
    if (removeCover) values.append("remove_cover", "on");
    if (removePhoto) values.append("remove_photo", "on");
    try {
      const result = await profileRequest(values);
      setProfile(result.profile);
      setDraft({ ...blank, ...result.profile });
      setEditing(false);
      setFile(null);
      setCoverFile(null);
      setRemoveCover(false);
      setRemovePhoto(false);
      setMessage(result.message);
      onUserUpdate({
        ...user,
        name: result.profile.full_name,
        profile_complete: result.profile.is_complete,
        photo_url: result.profile.photo_url,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (error.status === 401) onSessionExpired();
      else {
        setErrors(error.fields || {});
        setMessage(error.message);
      }
    } finally {
      setSaving(false);
    }
  }

  function field(
    name,
    label,
    { required = false, type = "text", placeholder = "", maxLength } = {},
  ) {
    return (
      <div className="student-field">
        <label htmlFor={`student-${name}`}>
          {label}
          {required && " *"}
        </label>
        <input
          id={`student-${name}`}
          name={name}
          type={type}
          required={required}
          maxLength={maxLength}
          placeholder={placeholder}
          min={type === "number" ? 1950 : undefined}
          max={type === "number" ? 2100 : undefined}
          value={draft[name] ?? ""}
          onChange={(e) => setDraft({ ...draft, [name]: e.target.value })}
          aria-invalid={Boolean(errors[name]?.length)}
          aria-describedby={errors[name]?.length ? `error-${name}` : undefined}
        />
        {errorFor(name)}
      </div>
    );
  }
  function errorFor(name) {
    return errors[name]?.length ? (
      <span id={`error-${name}`} className="student-error">
        {errors[name].map((item) => item.message).join(" ")}
      </span>
    ) : null;
  }
  if (loading)
    return (
      <div className="student-shell" role="status">
        Loading your dashboard…
      </div>
    );
  if (!profile)
    return (
      <div className="student-shell">
        <p role="alert">{message}</p>
        <button onClick={() => setRetry((value) => value + 1)}>Retry</button>
      </div>
    );
  const avatar = preview || (!removePhoto && profile.photo_url);
  const completed = [
    "full_name",
    "education",
    "institution",
    "city",
    "career_goal",
  ].filter((key) => Boolean(profile[key])).length;
  if (!editing)
    return (
      <ProfileOverview
        profile={profile}
        user={user}
        colleges={colleges}
        onSelectCollege={onSelectCollege}
        onSelectCareer={onSelectCareer}
        onNavigate={onNavigate}
        onLogout={onLogout}
        message={message}
        onEdit={() => {
          setEditing(true);
          setMessage("");
        }}
      />
    );
  return (
    <div className="student-shell">
      <div className="student-page-heading">
        <div>
          <p className="student-eyebrow">YOUR CAMPUS SPACE</p>
          <h1>
            {profile.is_complete ? "Edit your profile" : "Let’s get to know you"}
          </h1>
          <p>
            Tell us about your studies and the future you’re working towards.
          </p>
        </div>
      </div>
      {message && (
        <p className="student-notice" role="status">
          {message}
        </p>
      )}
      <div className="student-layout">
        <aside className="student-profile-card">
          <div className="student-avatar">
            {avatar ? (
              <img src={avatar} alt="Your profile" />
            ) : (
              <span>
                {(draft.full_name || user.name || "S")
                  .slice(0, 1)
                  .toUpperCase()}
              </span>
            )}
          </div>
          <h2>{profile.full_name || user.name}</h2>
          <p>{educationLabels[profile.education] || "Student"}</p>
          {profile.city && (
            <span className="student-location">{profile.city}</span>
          )}
          <div className="student-completion">
            <div>
              <span>Profile essentials</span>
              <strong>{completed}/5</strong>
            </div>
            <progress
              max="5"
              value={completed}
              aria-label="Profile essentials completed"
            />
            <p>
              {profile.is_complete
                ? "Your profile is ready. Keep it up to date as you grow."
                : "Complete the five required details to set up your dashboard."}
            </p>
          </div>
          <p className="student-private">
            Your profile and photo are visible only to your signed-in account
            and site administrators.
          </p>
          <button
            type="button"
            className="student-logout"
            onClick={onLogout}
            disabled={saving}
          >
            Log Out
          </button>
        </aside>
        <form className="student-panel student-edit" onSubmit={save}>
          <h2>
            {profile.is_complete
              ? "Personal & academic details"
              : "Set up your student profile"}
          </h2>
          <p className="student-muted">
            Fields marked * are required. A photo is optional.
          </p>
          <fieldset disabled={saving}>
            <legend className="student-sr-only">Student information</legend>
            <div className="student-photo-control">
              <label htmlFor="student-photo">Profile photo</label>
              <input
                id="student-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={choosePhoto}
              />
              <small>
                JPEG, PNG or WebP · up to 2 MB · below 10 megapixels
              </small>
              {errorFor("photo_upload")}
              {(profile.photo_url || file) && (
                <button
                  className="student-link"
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setRemovePhoto(true);
                  }}
                >
                  Remove photo
                </button>
              )}
            </div>
            <div className="student-photo-control">
              <label htmlFor="student-cover">Cover image</label>
              {profile.cover_url && !removeCover && (
                <img
                  src={profile.cover_url}
                  alt="Current cover"
                  style={{
                    width: "100%",
                    maxHeight: 120,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
              )}
              <input
                id="student-cover"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const chosen = e.target.files[0];
                  if (
                    chosen &&
                    (!["image/jpeg", "image/png", "image/webp"].includes(
                      chosen.type,
                    ) ||
                      chosen.size > 2 * 1024 * 1024)
                  ) {
                    setErrors((old) => ({
                      ...old,
                      cover_upload: [
                        {
                          message:
                            "Choose a JPEG, PNG or WebP smaller than 2 MB.",
                        },
                      ],
                    }));
                    e.target.value = "";
                    return;
                  }
                  setCoverFile(chosen || null);
                  setRemoveCover(false);
                  setErrors((old) => ({ ...old, cover_upload: [] }));
                }}
              />
              <small>
                JPEG, PNG or WebP · up to 2 MB · landscape images work best.
                Saved as a 1600 × 400 cover.
              </small>
              {coverFile && <small>Selected: {coverFile.name}</small>}
              {errorFor("cover_upload")}
              {(profile.cover_url || coverFile) && (
                <button
                  type="button"
                  className="student-link"
                  onClick={() => {
                    setCoverFile(null);
                    setRemoveCover(true);
                  }}
                >
                  Remove cover
                </button>
              )}
            </div>
            <div className="student-form-grid">
              {field("full_name", "Full name", {
                required: true,
                maxLength: 150,
                placeholder: "Your full name",
              })}
              <div className="student-field">
                <label htmlFor="student-education">Education stage *</label>
                <select
                  id="student-education"
                  required
                  value={draft.education}
                  onChange={(e) =>
                    setDraft({ ...draft, education: e.target.value })
                  }
                  aria-invalid={Boolean(errors.education?.length)}
                >
                  <option value="">Select your stage</option>
                  {Object.entries(educationLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                {errorFor("education")}
              </div>
              {field("institution", "School / college", {
                required: true,
                maxLength: 200,
              })}
              {field("course", "Course / stream", {
                maxLength: 150,
                placeholder: "e.g. Computer Science",
              })}
              {field("graduation_year", "Graduation year", {
                type: "number",
              })}
              {field("city", "City", { required: true, maxLength: 100 })}
              <div>
                <ProfileChoices
                  name="career_goal"
                  label="Career goals"
                  value={draft.career_goal}
                  options={CAREER_GOALS}
                  max={3}
                  required
                  invalid={Boolean(errors.career_goal?.length)}
                  onChange={(value) =>
                    setDraft({ ...draft, career_goal: value })
                  }
                />
                {errorFor("career_goal")}
              </div>
              {field("headline", "Profile headline", {
                maxLength: 200,
                placeholder: "e.g. Aspiring full stack developer",
              })}
              {field("qualification", "School qualification", {
                maxLength: 150,
                placeholder: "e.g. 12th Pass / Science",
              })}
              {field("school_completion_year", "School completion year", {
                type: "number",
              })}
              <div>
                <ProfileChoices
                  name="skills"
                  label="Skills I am learning"
                  value={draft.skills}
                  options={SKILLS}
                  searchable
                  invalid={Boolean(errors.skills?.length)}
                  onChange={(value) => setDraft({ ...draft, skills: value })}
                />
                {errorFor("skills")}
              </div>
              <div>
                <ProfileChoices
                  name="preferred_fields"
                  label="Preferred career fields"
                  value={draft.preferred_fields}
                  options={CAREER_FIELDS}
                  max={3}
                  invalid={Boolean(errors.preferred_fields?.length)}
                  onChange={(value) =>
                    setDraft({ ...draft, preferred_fields: value })
                  }
                />
                {errorFor("preferred_fields")}
              </div>
              {field("linkedin_url", "LinkedIn URL", {
                type: "url",
                maxLength: 300,
                placeholder: "https://www.linkedin.com/in/your-profile",
              })}
              {field("github_url", "GitHub URL", {
                type: "url",
                maxLength: 300,
                placeholder: "https://github.com/your-name",
              })}
              {field("quote", "Personal quote", {
                maxLength: 250,
                placeholder: "Your inspiration for the journey ahead",
              })}
              {field("interests", "Interests", {
                maxLength: 250,
                placeholder: "e.g. Python, design, robotics",
              })}
            </div>
            <div className="student-field">
              <label htmlFor="student-bio">About you</label>
              <textarea
                id="student-bio"
                rows="4"
                maxLength={1000}
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                placeholder="A little about what you enjoy learning…"
              />
              {errorFor("bio")}
            </div>
            <div className="student-field">
              <label htmlFor="student-goals">
                Current goals (one per line)
              </label>
              <textarea
                id="student-goals"
                rows="5"
                maxLength={1500}
                value={draft.goals}
                onChange={(e) => setDraft({ ...draft, goals: e.target.value })}
                placeholder="Build my portfolio&#10;Find an internship"
              />
              {errorFor("goals")}
            </div>
            <label className="student-mentorship">
              <input
                type="checkbox"
                checked={Boolean(draft.available_for_mentorship)}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    available_for_mentorship: e.target.checked,
                  })
                }
              />{" "}
              I am interested in participating in mentorship
            </label>
            <p className="student-muted">
              This records your preference. It does not book a mentor or publish
              your profile.
            </p>
            <div className="student-form-actions">
              <button className="student-button" type="submit">
                {saving ? "Saving…" : "Save & open dashboard"}
              </button>
              {profile.is_complete && (
                <button
                  type="button"
                  className="student-link"
                  onClick={() => {
                    setDraft({ ...blank, ...profile });
                    setFile(null);
                    setRemovePhoto(false);
                    setCoverFile(null);
                    setRemoveCover(false);
                    setErrors({});
                    setMessage("");
                    setEditing(false);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
