import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "../css/style1.css";

export default function AdminUsers() {
  const navigate = useNavigate();
  const me = JSON.parse(localStorage.getItem("user") || "{}");

  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page:1, pageSize:10, total:0, pageCount:1 });
  const [loading, setLoading] = useState(true);

  const load = async (page=1) => {
    setLoading(true);
    try {
      const { data } = await api.get("/users", { params: { q, page, pageSize: 10 } });
      setRows(Array.isArray(data?.data) ? data.data : []);
      setMeta(data?.meta || { page, pageSize:10, total:0, pageCount:1 });
    } finally { setLoading(false); }
  };
  useEffect(() => { load(1); }, []);

  const saveRole = async (id, role) => {
    await api.patch(`/users/${id}/role`, { role });
    load(meta.page);
  };
  const del = async (id) => {
    if (id === me.id) return alert("Cannot delete self");
    if (!confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`);
    load(meta.page);
  };

  return (
    <>
      <header className="user-header">
        <h1 className="logo-text" style={{cursor:"pointer"}} onClick={() => navigate("/admin/reports")}>ClickMart</h1>
        <button className="logout-btn" onClick={() => { localStorage.clear(); sessionStorage.clear(); navigate("/login"); }}>Logout</button>
      </header>

      <div className="order-detail users-page">
        <h1 className="title">User Management</h1>

        <div className="users-page searchbar">
          <div className="searchbox">
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              className="search-input"
              placeholder="Search name or email"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              onKeyDown={(e)=> e.key==="Enter" && load(1)}
            />
          </div>
          <button className="search-btn" onClick={()=>load(1)}>Search</button>
        </div>

        {loading ? <p className="muted">Loading…</p> :
        rows.length===0 ? <p className="muted">No users found.</p> :
        <>
          <div className="orders-list">
            {rows.map(u=>(
              <div className="order-row" key={u.id}>
                <div className="order-info">
                  <div className="order-id">{u.name} <span className="muted">({u.role})</span></div>
                  <div className="order-date">{u.email}</div>
                </div>
                <div className="order-actions" style={{gap:8}}>
                  <select
                    className="form-input"
                    value={u.role}
                    onChange={(e)=>saveRole(u.id, e.target.value)}
                    disabled={u.id===me.id}
                    style={{width:140, padding:"8px 10px"}}
                  >
                    <option value="customer">customer</option>
                    <option value="staff">staff</option>
                    <option value="admin">admin</option>
                  </select>
                  {u.id!==me.id && (
                    <button className="btn danger" onClick={()=>del(u.id)}>Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button className="btn ghost" disabled={meta.page<=1} onClick={()=>load(meta.page-1)}>Prev</button>
            <span className="muted">Page {meta.page} / {meta.pageCount}</span>
            <button className="btn ghost" disabled={meta.page>=meta.pageCount} onClick={()=>load(meta.page+1)}>Next</button>
          </div>
        </>}
        <footer className="footer-summary">
          &copy; {new Date().getFullYear()} ClickMart | Designed by Bilge Acartürk
        </footer>
      </div>
    </>
  );
}
