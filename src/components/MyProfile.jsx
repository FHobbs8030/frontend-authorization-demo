// src/components/MyProfile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as auth from "../utils/auth";
import "./styles/MyProfile.css";

export default function MyProfile({ user: userProp }) {
  const [user, setUser] = useState(userProp || null);
  const [loading, setLoading] = useState(!userProp);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userProp) return;
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      navigate("/login", { replace: true });
      return;
    }
    setLoading(true);
    setError("");
    auth
      .getMe(jwt)
      .then((u) => {
        setUser(u);
        try {
          localStorage.setItem("user", JSON.stringify(u));
        } catch (e) {
          console.warn("Failed to persist user to localStorage:", e);
        }
      })
      .catch(() => {
        setError("Unable to load profile");
      })
      .finally(() => setLoading(false));
  }, [userProp, navigate]);

  const username = user?.username ?? "—";
  const email = user?.email ?? "—";

  if (loading) {
    return (
      <div className="profile">
        <h2 className="profile__title">My profile</h2>
        <div className="profile__card">Loading…</div>
      </div>
    );
  }

  return (
    <div className="profile">
      <h2 className="profile__title">My profile</h2>
      <div className="profile__card">
        {error && <p className="profile__error">{error}</p>}
        <div className="profile__row">
          <span>Username:</span>
          <span>{username}</span>
        </div>
        <div className="profile__row">
          <span>Email:</span>
          <span>{email}</span>
        </div>
      </div>
    </div>
  );
}
