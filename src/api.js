/** Same-origin college and session authentication APIs. */
export async function loadColleges(signal) {
  const response = await fetch("/api/bootstrap/", { signal });
  if (!response.ok)
    throw new Error(
      `Unable to load colleges (${response.status}). Please try again.`,
    );
  const data = await response.json();
  if (!Array.isArray(data.colleges))
    throw new Error("The server returned an invalid college catalogue.");
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
