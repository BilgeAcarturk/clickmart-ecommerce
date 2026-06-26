// src/pages/adminReports.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../api/axiosInstance";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, ResponsiveContainer
} from "recharts";
import "../css/style1.css";
import { useNavigate } from "react-router-dom";

const money = (c) => (Number(c || 0) / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
const iso = (d) => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

// 👇 Rolü güvenli şekilde oku (role/Role/roleName fallback)
function getRoleFromStorage() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    return String(u.role ?? u.Role ?? u.roleName ?? "customer").toLowerCase();
  } catch { return "customer"; }
}

export default function AdminReports() {
  const navigate = useNavigate();
  const role = getRoleFromStorage();
  const isAdmin = role === "admin";

  const [rev, setRev] = useState([]);
  const [tops, setTops] = useState([]);
  const [from, setFrom] = useState(() => new Date(Date.now() - 30 * 864e5));
  const [to, setTo] = useState(() => new Date());
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const toPlus1 = iso(addDays(to, 1));
      const [r1, r2] = await Promise.all([
        api.get("/reports/revenue", { params: { granularity: "day", from: iso(from), to: toPlus1 } }),
        api.get("/reports/top-products", { params: { from: iso(from), to: toPlus1, limit: 10 } }),
      ]);
      setRev(Array.isArray(r1.data) ? r1.data : []);
      setTops(Array.isArray(r2.data) ? r2.data : []);
    } catch (e) {
      console.error("REPORTS_LOAD_ERROR", e?.response || e);
      setRev([]); setTops([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const total = useMemo(() => rev.reduce((s, x) => s + (x.revenueCents || 0), 0), [rev]);

  return (
    <>
      <header className="user-header">
        <h1 className="logo-text" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>ClickMart</h1>
        <button
          className="logout-btn"
          onClick={() => { localStorage.clear(); sessionStorage.clear(); navigate("/login"); }}
        >
          Logout
        </button>
      </header>

      <div className="order-detail report-page">
        <h1 className="title">Reports</h1>

        <div className="reports-toolbar">
            <label>From{" "}
                <input type="date" className="form-input" value={iso(from)} onChange={(e) => setFrom(new Date(e.target.value))} />
            </label>
            <label>To{" "}
                <input type="date" className="form-input" value={iso(to)} onChange={(e) => setTo(new Date(e.target.value))} />
            </label>
            <button className="btn ghost" onClick={load}>Refresh</button>
            <span className="muted">Total: <b>{money(total)}</b></span>

            <div style={{ flex: 1 }} /> {/* sağa itici spacer */}
            <button className="btn" onClick={() => navigate("/admin/users")}>
                Manage Users
            </button>
            </div>


        {loading ? (
          <p className="muted">Loading…</p>
        ) : (
          <>
            {rev.length === 0 && <p className="muted" style={{ margin: "8px 0" }}>No paid orders in range.</p>}

            <div className="chart-card">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rev} margin={{ top: 8, right: 12, left: 0, bottom: 24 }}>
                  <CartesianGrid strokeOpacity={0.2} />
                  <XAxis dataKey="bucket" />
                  <YAxis tickFormatter={(v) => money(v).replace("$", "")} />
                  <Tooltip formatter={(v) => money(v)} />
                  <Line type="monotone" dataKey="revenueCents" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tops} margin={{ top: 8, right: 12, left: 0, bottom: 24 }} barCategoryGap="45%">
                  <CartesianGrid strokeOpacity={0.2} />
                  <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis tickFormatter={(v) => money(v).replace("$", "")} />
                  <Tooltip formatter={(v) => money(v)} />
                  <Bar dataKey="revenueCents" maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="orders-list" style={{ marginTop: 16 }}>
              {tops.map((p) => (
                <div className="order-row" key={p.productId}>
                  <div className="order-info">
                    <div className="order-id">{p.name}</div>
                    <div className="order-badges"><span className="badge">Units: {p.units}</span></div>
                  </div>
                  <div className="order-actions">
                    <div className="order-total">{money(p.revenueCents)}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <footer className="footer-summary">
          &copy; {new Date().getFullYear()} ClickMart | Designed by Bilge Acartürk
        </footer>
      </div>
    </>
  );
}
