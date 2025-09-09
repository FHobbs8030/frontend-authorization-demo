const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function req(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
}

export function authorize(email, password) {
  return req("/signin", { method: "POST", body: { email, password } });
}

export function register(name, email, password) {
  return req("/signup", { method: "POST", body: { name, email, password } });
}
