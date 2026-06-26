// src/pages/signup.jsx
import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../api/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import "../css/style1.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [errors, setErrors]     = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const e = {};
    const emailRegex    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

    if (!username.trim()) e.username = "Username is required";
    else if (!usernameRegex.test(username)) e.username = "Only letters, numbers, underscores";

    if (!email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(email)) e.email = "Invalid email format";

    if (!password) e.password = "Password is required";
    else if (!passwordRegex.test(password)) e.password = "Min 8 chars, 1 uppercase, 1 number, 1 special";

    if (!passwordConf) e.passwordConf = "Please confirm your password";
    else if (passwordConf !== password) e.passwordConf = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const passwordCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[@$!%*?&.]/.test(password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Backend sözleşmesine göre "name" bekleniyor
      await api.post("/auth/register", { name: username, email, password });
      toast.success("Account created successfully");
      setUsername(""); setEmail(""); setPassword(""); setPasswordConf("");
      setTimeout(() => navigate("/login"), 600);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "";
      if (msg.includes("email") || msg === "email_exists") {
        toast.error("This email is already registered.");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="auth-page">
        <header>
          <h1
            className="logo-text"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            ClickMart
          </h1>
        </header>

        <div className="auth-content">
          <div className="signup-container">
            <form onSubmit={handleSubmit}>
              <h2 className="form-title">Create Account</h2>

              <div>
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  className="text-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
                {errors.username && (
                  <p className="error">
                    <FaExclamationCircle className="error-icon" /> {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="text-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="error">
                    <FaExclamationCircle className="error-icon" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label>Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="text-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="password-requirements">
                  <p>{passwordCriteria.length ? <FaCheckCircle className="valid-icon" /> : <FaTimesCircle className="invalid-icon" />} At least 8 characters</p>
                  <p>{passwordCriteria.uppercase ? <FaCheckCircle className="valid-icon" /> : <FaTimesCircle className="invalid-icon" />} One uppercase letter</p>
                  <p>{passwordCriteria.number ? <FaCheckCircle className="valid-icon" /> : <FaTimesCircle className="invalid-icon" />} One number</p>
                  <p>{passwordCriteria.specialChar ? <FaCheckCircle className="valid-icon" /> : <FaTimesCircle className="invalid-icon" />} One special character</p>
                </div>

                {errors.password && (
                  <p className="error">
                    <FaExclamationCircle className="error-icon" /> {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label>Password Confirmation</label>
                <input
                  type="password"
                  name="passwordConf"
                  className="text-input"
                  value={passwordConf}
                  onChange={(e) => setPasswordConf(e.target.value)}
                  autoComplete="new-password"
                />
                {errors.passwordConf && (
                  <p className="error">
                    <FaExclamationCircle className="error-icon" /> {errors.passwordConf}
                  </p>
                )}
              </div>

              <div>
                <button type="submit" className="btn btn-big">Create Account</button>
              </div>
            </form>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>

      <footer className="footer-summary">
        &copy; {new Date().getFullYear()} ClickMart | Designed by Bilge Acartürk
      </footer>
    </>
  );
}
