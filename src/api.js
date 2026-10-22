/** Same-origin college and session authentication APIs. */
import { ROADMAPS } from "./data/roadmaps";
import { CAREER_DETAILS } from "./data/careerDetails";

export async function loadColleges(signal) {
  const response = await fetch("/api/bootstrap/", { signal });
  if (!response.ok)
    throw new Error(
      `Unable to load colleges (${response.status}). Please try again.`,
    );
  const data = await response.json();
  if (!Array.isArray(data.colleges))
    throw new Error("The server returned an invalid college catalogue.");
  const roadmapResponse = await fetch("/api/roadmaps/", { signal });
  if (!roadmapResponse.ok)
    throw new Error("Unable to load career roadmaps. Please try again.");
  const catalogue = await roadmapResponse.json();
  if (!Array.isArray(catalogue.roadmaps))
    throw new Error("The server returned an invalid roadmap catalogue.");
  ROADMAPS.splice(0, ROADMAPS.length, ...catalogue.roadmaps);
  catalogue.roadmaps.forEach((row) => {
    CAREER_DETAILS[row.id] = row.details;
  });
  return data.colleges;
}

export async function authRequest(action, values) {
  const sessionResponse = await fetch("/api/auth/session/", {
    credentials: "same-origin",
  });
  if (!sessionResponse.ok)
    throw new Error("Unable to connect to authentication.");
  const session = await sessionResponse.json();
  if (action === "session") return session;
  const response = await fetch(`/api/auth/${action}/`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": session.csrfToken,
    },
    body: JSON.stringify(values || {}),
  });
  const data = await response
    .json()
    .catch(() => ({ error: "The server could not process your request." }));
  if (!response.ok) throw new Error(data.error || "Authentication failed.");
  return data;
}

export async function profileRequest(values) {
  const headers = {};
  if (values) {
    const session = await authRequest("session");
    headers["X-CSRFToken"] = session.csrfToken;
  }
  const response = await fetch("/api/profile/", {
    method: values ? "POST" : "GET",
    credentials: "same-origin",
    headers,
    ...(values ? { body: values } : {}),
  });
  const data = await response
    .json()
    .catch(() => ({ error: "Unable to load your profile. Please try again." }));
  if (!response.ok) {
    const error = new Error(data.error || "Unable to save your profile.");
    error.fields = data.fields || {};
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function connectRequest(section, values) {
  const headers = {};
  if (values) {
    const session = await authRequest("session");
    headers["Content-Type"] = "application/json";
    headers["X-CSRFToken"] = session.csrfToken;
  }
  const response = await fetch(`/api/${section}/`, {
    method: values ? "POST" : "GET",
    credentials: "same-origin",
    headers,
    ...(values ? { body: JSON.stringify(values) } : {}),
  });
  const data = await response
    .json()
    .catch(() => ({ error: "Unable to connect. Please try again." }));
  if (!response.ok)
    throw new Error(data.error || "The request could not be completed.");
  return data;
}
