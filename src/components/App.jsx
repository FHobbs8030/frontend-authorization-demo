import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import Ducks from "./Ducks.jsx";
import Profile from "./Profile.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function SignIn({ onSubmit }) {
  return (
    <main className="page">
      <h2>Sign In</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = e.target.email.value;
          onSubmit({ email });
        }}
      >
        <input name="email" type="email" placeholder="email" required />
        <input name="password" type="password" placeholder="password" required />
        <button type="submit">Sign In</button>
      </form>
      <Link to="/signup">Register</Link>
    </main>
  );
}

function SignUp({ onSubmit }) {
  return (
    <main className="page">
      <h2>Sign Up</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = e.target.name.value;
          const email = e.target.email.value;
          onSubmit({ name, email });
        }}
      >
        <input name="name" placeholder="name" required />
        <input name="email" type="email" placeholder="email" required />
        <input name="password" type="password" placeholder="password" required />
        <button type="submit">Create Account</button>
      </form>
      <Link to="/signin">Have an account? Sign In</Link>
    </main>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;
    setLoggedIn(true);
    setUser({ name: "Fred", email: "fred@example.com" });
  }, []);

  const handleSignIn = async ({ email }) => {
    const token = "mock-token";
    localStorage.setItem("jwt", token);
    setLoggedIn(true);
    setUser({ name: "Fred", email });
    navigate("/");
  };

  const handleSignUp = async ({ name, email }) => {
    const token = "mock-token";
    localStorage.setItem("jwt", token);
    setLoggedIn(true);
    setUser({ name, email });
    navigate("/");
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setUser(null);
    navigate("/signin");
  };

  return (
    <div className="page">
      <header className="topbar">
        <nav className="nav">
          <Link to="/">Ducks</Link>
          <Link to="/profile">My Profile</Link>
        </nav>
        {loggedIn && <button onClick={handleSignOut}>Sign Out</button>}
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Ducks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<SignIn onSubmit={handleSignIn} />} />
        <Route path="/signup" element={<SignUp onSubmit={handleSignUp} />} />
        <Route
          path="*"
          element={<Navigate to={loggedIn ? "/" : "/signin"} replace />}
        />
      </Routes>
    </div>
  );
}
