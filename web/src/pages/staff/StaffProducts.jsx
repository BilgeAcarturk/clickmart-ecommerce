
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

export default function StaffProducts() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, take: 10 });
  const [active, setActive] = useState("all"); // all|true|false
  const navigate = useNavigate();
  const take = 10;

  const load = async () => {
    const res = await api.get("/products", {
      params: { search: q, page, take, active: active === "all" ? undefined : active },
    });
    setData(res.data);
  };
  useEffect(() => { load(); }, [q, page, active]);

  const del = async (id) => { await api.delete(`/products/${id}`); load(); };
  const toggle = async (id) => { await api.patch(`/products/${id}/toggle`); load(); };

  return (
    <>
    <header className="user-header">
            <h1 className="logo-text" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            ClickMart
            </h1>
            <button
                className="logout-btn"
                onClick={() => { localStorage.clear(); sessionStorage.clear(); navigate("/login"); }}
              >
                Logout
              </button>
        </header>
    <div className="staff-page">
      <div className="staff-card staff-toolbar">
        <input
          className="text-input"
          value={q}
          onChange={(e) => { setPage(1); setQ(e.target.value); }}
          placeholder="Search Product..."
        />

        <select
          value={active}
          onChange={(e) => { setPage(1); setActive(e.target.value); }}
          className="text-input"
        >
          <option value="all">All</option>
          <option value="true">Active</option>
          <option value="false">Passive</option>
        </select>

        <Link to="/staff/products/new" className="btn btn-primary" style={{ textAlign: "center" }}>
          Yeni Ürün
        </Link>
      </div>

      <div className="staff-card">
        <h3 className="card-title">Products</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th><th>Ad</th><th>Fiyat</th><th>Stok</th><th>Durum</th><th></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{Number(p.price).toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`badge ${p.isActive ? "active" : "passive"}`}>
                      {p.isActive ? "Active" : "Passive"}
                    </span>
                  </td>
                  <td className="actions">
                    <Link to={`/staff/products/${p.id}`} className="btn btn-secondary">Edit</Link>
                    <button onClick={() => toggle(p.id)} className="btn btn-ghost">Active/Passive</button>
                    <button onClick={() => del(p.id)} className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 16, textAlign: "center" }}>No reccord</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="page" disabled={page === 1} onClick={() => setPage(page - 1)}>Önceki</button>
          <span>{page}</span>
          <button
            className="page"
            disabled={data.items.length < data.take}
            onClick={() => setPage(page + 1)}
          >
            Sonraki
          </button>
        </div>
      </div>

    <footer className="footer-summary">
        &copy; {new Date().getFullYear()} ClickMart | Designed by Bilge Acartürk
      </footer>

    </div>
    </>
  );
}
