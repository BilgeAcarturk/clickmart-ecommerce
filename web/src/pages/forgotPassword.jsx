
import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../api/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import "../css/style1.css";

export default function ForgottenPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!location.state?.fromLogin) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset link sent to your email.");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "";
      if (msg.includes("not found")) toast.error("No user found with this email.");
      else toast.error("Failed to send reset email.");
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
          <div className="forgot-container">
            <form className="forgot-form" onSubmit={handleSubmit}>
              <h2 className="form-title">Request Password Reset</h2>

              {!sent ? (
                <>
                  <p className="muted">
                    Enter your email. We will send you a reset link.
                  </p>
                  <div>
                    <label>Email</label>
                    <input
                      type="email"
                      className="text-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-big">
                    Request Password
                  </button>
                </>
              ) : (
                <p className="muted">
                  Reset link sent. Check your inbox.{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSent(false);
                    }}
                  >
                    Send again
                  </a>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      <footer className="footer-summary">
        &copy; {new Date().getFullYear()} ClickMart | Designed by Bilge Acartürk
      </footer>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}
