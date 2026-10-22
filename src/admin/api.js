export async function adminRequest(path, method = "GET", values) {
  const headers = {};
  if (method !== "GET") {
    const session = await fetch("/api/admin/session/", {
      credentials: "same-origin",
    });
    if (!session.ok) throw new Error("Unable to connect to the admin session.");
    headers["X-CSRFToken"] = (await session.json()).csrfToken;
    headers["Content-Type"] = "application/json";
  }
  const response = await fetch(`/api/admin/${path}`, {
    method,
    headers,
    credentials: "same-origin",
    ...(values !== undefined ? { body: JSON.stringify(values) } : {}),
  });
  const result = await response
    .json()
    .catch(() => ({
      error:
        "The server could not process this request. Please refresh and try again.",
    }));
  if (!response.ok) {
    const error = new Error(result.error || "The request failed.");
    error.fields = result.fields || {};
    error.status = response.status;
    throw error;
  }
  return result;
}
