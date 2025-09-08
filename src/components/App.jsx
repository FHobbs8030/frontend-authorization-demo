import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import Ducks from "./Ducks.jsx";
import MyProfile from "./MyProfile.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { authorize, register, getMe } from "../utils/auth.js";

function SignIn({ onSubmit, error, loading }) {
  return (
    <main className="page">
      <h2>Sign In</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = e.target.email.value;
          const password = e.target.password.value;
          onSubmit({ email, password });
        }}
      >
        <input name="email" type="email" placeholder="email" required />
        <input name="password" type="password" placeholder="password" required />
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}
      <Link to="/signup">Register</Link>
    </main>
  );
}

function SignUp({ onSubmit, error, loading }) {
  return (
    <main className="page">
      <h2>Sign Up</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const username = e.target.username.value;
          const email = e.target.email.value;
          const password = e.target.password.value;
          onSubmit({ username, email, password });
        }}
      >
        <input name="username" placeholder="username" required />
        <input name="email" type="email" placeholder="email" required />
        <input name="password" type="password" placeholder="password" required />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
      {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}
      <Link to="/signin">Have an account? Sign In</Link>
    </main>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;
    getMe(token)
      .then((me) => {
        setUserData({ username: me.name || me.username || "", email: me.email || "" });
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        setUserData({ username: "", email: "" });
        navigate("/signin");
      });
  }, [navigate]);

  const handleLogin = async ({ email, password }) => {
    try {
      setAuthError("");
      setAuthLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      const { token } = await authorize(cleanEmail, cleanPassword);
      localStorage.setItem("jwt", token);
      const me = await getMe(token);
      setUserData({ username: me.name || me.username || "", email: me.email || "" });
      setIsLoggedIn(true);
      navigate("/ducks");
    } catch (e) {
      setAuthError(e.message || "Sign-in failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async ({ username, email, password }) => {
    try {
      setAuthError("");
      setAuthLoading(true);
      const cleanName = username.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      const { token } = await register(cleanName, cleanEmail, cleanPassword);
      localStorage.setItem("jwt", token);
      const me = await getMe(token);
      setUserData({ username: me.name || me.username || "", email: me.email || "" });
      setIsLoggedIn(true);
      navigate("/ducks");
    } catch (e) {
      setAuthError(e.message || "Sign-up failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setUserData({ username: "", email: "" });
    navigate("/signin");
  };

  return (
    <div className="page">
      <header className="topbar">
        <nav className="nav">
          <Link to="/ducks">Ducks</Link>
          <Link to="/my-profile">My Profile</Link>
        </nav>
        {isLoggedIn && <button onClick={handleSignOut}>Sign Out</button>}
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/ducks" replace />} />
        <Route
          path="/ducks"
          element={
            <ProtectedRoute loggedIn={isLoggedIn}>
              <Ducks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute loggedIn={isLoggedIn}>
              <MyProfile userData={userData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <SignIn onSubmit={handleLogin} error={authError} loading={authLoading} />
          }
        />
        <Route
          path="/signup"
          element={
            <SignUp onSubmit={handleSignUp} error={authError} loading={authLoading} />
          }
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/ducks" : "/signin"} replace />}
        />
      </Routes>
    </div>
  );
}
