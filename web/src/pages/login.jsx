import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "../css/style1.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isValidEmail(email)) return setErrorMessage("Please enter a valid email address.");
    if (!password) return setErrorMessage("Password is required.");

    try {
      const { data } = await api.post("/auth/login", { email, password });
      const token = data.token;
      const user  = data.user ?? {};
      const role  = (user.role ?? data.role ?? "customer").toLowerCase();

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ ...user, role }));

      if (role === "admin")      navigate("/admin/reports", { replace: true });
      else if (role === "staff") navigate("/staff/products", { replace: true });
      else                       navigate("/user1", { replace: true });
    } catch (err) {
      setErrorMessage(err?.response?.data?.error || "Invalid Email or Password.");
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
          <div className="forgot-container">{/* ortak kutu stili */}
            <form onSubmit={handleSubmit} className="login-form">
              <h2 className="form-title">Login</h2>

              {errorMessage && <p className="error">{errorMessage}</p>}

              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="text-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
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
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="password-options-row">
                  <label className="show-password-wrapper">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    Show Password
                  </label>

                  <button
                    type="button"
                    className="forgot-password-btn"
                    onClick={() => navigate("/forgotPassword", { state: { fromLogin: true } })}
                  >
                    Forgotten Password?
                  </button>
                </div>
              </div>

              <div>
                <button type="submit" className="btn btn-big">Login</button>
              </div>

              <p>
                Or{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/signup");
                  }}
                >
                  Sign Up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      <footer className="footer-summary">
        &copy; {new Date().getFullYear()} ClickMart | Designed by Bilge Acartürk
      </footer>
    </>
  );
}
