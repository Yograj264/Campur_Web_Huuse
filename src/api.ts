export async function api(action?: Record<string, unknown>) {
  const token = document.cookie.split('; ').find(v => v.startsWith('csrftoken='))?.split('=')[1] || '';
  const response = await fetch(action ? '/api/action/' : '/api/bootstrap/', {
    method: action ? 'POST' : 'GET', credentials: 'same-origin',
    headers: action ? {'Content-Type':'application/json','X-CSRFToken':decodeURIComponent(token)} : {},
    body: action ? JSON.stringify(action) : undefined,
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${response.status}). Please try again.`);
  }
  return response.json();
}
