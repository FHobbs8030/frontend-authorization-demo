// src/components/App.jsx
import { useState } from "react";
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
  const navigate = useNavigate();

  const handleRegistration = ({ username, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      return Promise.reject("Passwords do not match");
    }
    return auth.register(username, password, email).then(() => {
      navigate("/login");
    });
  };

  const handleLogin = ({ login, password }) => {
    return auth.authorize(login, password).then(({ jwt }) => {
      localStorage.setItem("jwt", jwt);
      setIsLoggedIn(true);
      navigate("/ducks", { replace: true });
    });
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login handleLogin={handleLogin} />
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="registerContainer">
            <Register handleRegistration={handleRegistration} />
          </div>
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
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          isLoggedIn ? <Navigate to="/ducks" replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
