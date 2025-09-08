// src/utils/api.js
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) {
    // try to extract a useful message from JSON or plain text
    try {
      const j = JSON.parse(text);
      const msg =
        j?.message ||
        j?.error ||
        j?.errors?.[0]?.message ||
        j?.errors?.[0] ||
        res.statusText;
      throw new Error(`${res.status} ${msg}`);
    } catch {
      throw new Error(`${res.status} ${text || res.statusText}`);
    }
  }
  return text ? JSON.parse(text) : {};
}

export const signin = (email, password) =>
  request("/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const signup = (name, email, password) =>
  request("/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const getMe = (token) =>
  fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(async (r) => {
    const t = await r.text().catch(() => "");
    if (!r.ok) throw new Error(`${r.status} ${t || r.statusText}`);
    return t ? JSON.parse(t) : {};
  });
