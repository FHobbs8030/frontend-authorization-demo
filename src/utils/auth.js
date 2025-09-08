export const BASE_URL = "https://api.nomoreparties.co";

export const register = (username, password, email) => {
  return fetch(`${BASE_URL}/auth/local/register`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  }).then((res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)));
};

export const authorize = (identifier, password) => {
  return fetch(`${BASE_URL}/auth/local`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  }).then((res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)));
};

export const getMe = (jwt) => {
  return fetch(`${BASE_URL}/users/me`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${jwt}` },
  }).then((res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)));
};
