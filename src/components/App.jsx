import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import Ducks from "./Ducks.jsx";
import MyProfile from "./MyProfile.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicOnlyRoute from "./PublicOnlyRoute.jsx";
import { authorize, register } from "../utils/auth.js";
import { getUserInfo } from "../utils/api.js";
import { setToken, getToken, clearToken } from "../utils/token.js";

function SignIn({ onSubmit, error, loading }) {
  return (
    <main className="page">
      <h2>Sign In</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            email: e.target.email.value,
            password: e.target.password.value,
          });
        }}
      >
        <input name="email" type="email" placeholder="email" required />
        <input name="password" type="password" placeholder="password" required />
        <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
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
          onSubmit({
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
          });
        }}
      >
        <input name="username" placeholder="username" required />
        <input name="email" type="email" placeholder="email" required />
        <input name="password" type="password" placeholder="password" required />
        <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
      </form>
      {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}
      <Link to="/signin">Have an account? Sign In</Link>
    </main>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const jwt = getToken();
    if (!jwt) return;

    getUserInfo(jwt)
      .then((me) => {
        setUserData({ username: me.name || me.username || "", email: me.email || "" });
        setIsLoggedIn(true);
        const dest = location.state?.from?.pathname || "/ducks";
        navigate(dest, { replace: true });
      })
      .catch(() => {
        clearToken();
        setIsLoggedIn(false);
      });
  }, [navigate, location]);

  const handleLogin = async ({ email, password }) => {
    try {
      setAuthError("");
      setAuthLoading(true);
      const { token } = await authorize(email.trim().toLowerCase(), password.trim());
      setToken(token);
      const me = await getUserInfo(token);
      setUserData({ username: me.name || me.username || "", email: me.email || "" });
      setIsLoggedIn(true);
      const dest = location.state?.from?.pathname || "/ducks";
      navigate(dest, { replace: true });
    } catch (e) {
      setAuthError("Sign-in failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async ({ username, email, password }) => {
    try {
      setAuthError("");
      setAuthLoading(true);
      const { token } = await register(username.trim(), email.trim().toLowerCase(), password.trim());
      setToken(token);
      const me = await getUserInfo(token);
      setUserData({ username: me.name || me.username || "", email: me.email || "" });
      setIsLoggedIn(true);
      navigate("/ducks", { replace: true });
    } catch (e) {
      setAuthError("Sign-up failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    clearToken();
    setIsLoggedIn(false);
    setUserData({ username: "", email: "" });
    navigate("/signin", { replace: true });
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
            <PublicOnlyRoute loggedIn={isLoggedIn}>
              <SignIn onSubmit={handleLogin} error={authError} loading={authLoading} />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute loggedIn={isLoggedIn}>
              <SignUp onSubmit={handleSignUp} error={authError} loading={authLoading} />
            </PublicOnlyRoute>
          }
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/ducks" : "/signin"} replace />} />
      </Routes>
    </div>
  );
}
