// src/components/Login.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import "./styles/Login.css";

const Login = ({ handleLogin }) => {
  const [data, setData] = useState({ login: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();          // <-- stop default GET submit
    setMsg("");
    handleLogin(data).catch((err) => setMsg(String(err)));
  };

  return (
    <div className="login">
      <Logo title={"CryptoDucks"} />
      <p className="login__welcome">
        This app contains highly sensitive information. Please sign in or register to access CryptoDucks.
      </p>

      <form className="login__form" onSubmit={onSubmit}>
        <label htmlFor="login">Login:</label>
        <input
          id="login"
          name="login"          // matches state key
          type="text"
          value={data.login}
          onChange={handleChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          value={data.password}
          onChange={handleChange}
        />

        {msg && <p className="login__message">{msg}</p>}

        <div className="login__button-container">
          <button type="submit" className="login__link">Log in</button>
        </div>
      </form>

      <div className="login__signup">
        <p>Not a member yet?</p>
        <Link to="/register" className="login__register-link">Sign up here</Link>
      </div>
    </div>
  );
};

export default Login;
