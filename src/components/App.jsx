// src/components/App.jsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import "./styles/App.css";
import * as auth from "../utils/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const storedUser = localStorage.getItem("user");
    if (jwt) setIsLoggedIn(true);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleRegistration = ({ username, email, password, confirmPassword }) => {
    if (password !== confirmPassword) return Promise.reject("Passwords do not match");
    return auth.register(username, password, email).then(() => {
      navigate("/login");
    });
  };

  const handleLogin = ({ login, password }) => {
    return auth.authorize(login, password).then((payload) => {
      const jwt = payload?.jwt;
      const userObj = payload?.user || payload?.data?.user || payload?.userData || null;
      if (!jwt) return Promise.reject("No token returned from server");
      localStorage.setItem("jwt", jwt);
      if (userObj) {
        localStorage.setItem("user", JSON.stringify(userObj));
        setUser(userObj);
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
      setIsLoggedIn(true);
      navigate("/ducks", { replace: true });
    });
  };

  return (
    <Routes>
      <Route
        index
        element={<Navigate to={isLoggedIn ? "/ducks" : "/login"} replace />}
      />
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/ducks" replace />
          ) : (
            <div className="loginContainer">
              <Login handleLogin={handleLogin} />
            </div>
          )
        }
      />
      <Route
        path="/register"
        element={
          isLoggedIn ? (
            <Navigate to="/ducks" replace />
          ) : (
            <div className="registerContainer">
              <Register handleRegistration={handleRegistration} />
            </div>
          )
        }
      />
      <Route
        path="/ducks"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Ducks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-profile"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyProfile user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={isLoggedIn ? <Navigate to="/ducks" replace /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
