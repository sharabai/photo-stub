import { useState } from "react";
import auth from "./authModule.js";
import PropTypes from "prop-types";
import "./Login.css";

function Login({ getToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log("Logging in with email:", email, "and password:", password);
    auth.login(email, password);
    setTimeout(() => getToken(), 200);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email" className="form-label">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
          className="form-input"
        />

        <label htmlFor="password" className="form-label">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
          className="form-input"
        />

        <button type="submit" className="form-button">
          Login
        </button>
      </form>
    </div>
  );
}

Login.propTypes = {
  getToken: PropTypes.func.isRequired,
};

export default Login;
