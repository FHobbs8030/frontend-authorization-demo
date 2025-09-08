export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${text || res.statusText}`);
  }
  return res.json();
}

export const signin = (identifier, password) =>
  request("/signin", { method: "POST", body: JSON.stringify({ identifier, password }) });

export const signup = (username, email, password) =>
  request("/signup", { method: "POST", body: JSON.stringify({ username, email, password }) });

export const getMe = (token) =>
  fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => {
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  });
