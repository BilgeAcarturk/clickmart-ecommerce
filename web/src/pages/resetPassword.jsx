import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../api/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import "../css/style1.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const tokenFromUrl = useMemo(() => new URLSearchParams(search).get("token") || "", [search]);

  const [token, setToken] = useState(tokenFromUrl);
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [show, setShow] = useState(false);

  const strong = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.]).{8,}$/;

  const submit = async (e) => {
    e.preventDefault();
    if (!token.trim()) return toast.error("Reset code is required.");
    if (!strong.test(pwd)) return toast.error("Weak password.");
    if (pwd !== pwd2) return toast.error("Passwords do not match.");

    try {
      await api.post("/auth/reset-password", { token, newPassword: pwd });
      toast.success("Password updated. Redirecting to login…");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Reset failed.";
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="auth-page">
        <header>
          <h1 className="logo-text" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            ClickMart
          </h1>
        </header>

        <div className="auth-content">
          <div className="signup-container">
            <form onSubmit={submit}>
              <h2 className="form-title">Set New Password</h2>

              {!tokenFromUrl && (
                <div>
                  <label>Reset Code</label>
                  <input
                    className="text-input"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste the code from your email"
                  />
                </div>
              )}

              <div>
                <label>New Password</label>
                <div className="password-input">
                  <input
                    type={show ? "text" : "password"}
                    className="text-input"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button type="button" className="toggle-btn" onClick={() => setShow(!show)}>
                    {show ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="password-requirements">
                  <p>{/.{8,}/.test(pwd) ? "✔" : "✖"} At least 8 characters</p>
                  <p>{/[A-Z]/.test(pwd) ? "✔" : "✖"} One uppercase letter</p>
                  <p>{/\d/.test(pwd) ? "✔" : "✖"} One number</p>
                  <p>{/[@$!%*?&.]/.test(pwd) ? "✔" : "✖"} One special character</p>
                </div>
              </div>

              <div>
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="text-input"
                  value={pwd2}
                  onChange={(e) => setPwd2(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="btn btn-big">Update Password</button>
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
