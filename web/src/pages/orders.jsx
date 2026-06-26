import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const money = (cents) =>
  (Number(cents || 0) / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0, pageCount: 1 });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async (page = 1, statusFilter = "") => {
    try {
      setLoading(true);
      const { data } = await api.get("/orders", {
        params: { page, pageSize: meta.pageSize, status: statusFilter || undefined },
      });

      // Backend iki ihtimal: {data, meta} veya direkt dizi
      if (Array.isArray(data)) {
        setOrders(data);
        setMeta((m) => ({ ...m, page, pageCount: 1, total: data.length }));
      } else {
        setOrders(data.data || []);
        setMeta(data.meta || { page: 1, pageSize: 10, total: 0, pageCount: 1 });
      }
    } catch (err) {
      console.error("FETCH_ORDERS_ERROR", err?.response || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1, status); }, []); // ilk yükleme

  const onChangeStatus = (e) => {
    const val = e.target.value;
    setStatus(val);
    load(1, val);
  };

  const prev = () => meta.page > 1 && load(meta.page - 1, status);
  const next = () => meta.page < meta.pageCount && load(meta.page + 1, status);

  if (loading) return <div className="order-detail"><p className="muted">Loading...</p></div>;

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

      <div className="order-detail">
        <h1 className="title">My Orders</h1>

        {/* Filtre + sayfalama kontrolü */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "8px 0 12px" }}>
          <select
            value={status}
            onChange={onChangeStatus}
            className="form-input"
            style={{ maxWidth: 220, padding: "8px 10px" }}
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELED">Canceled</option>
          </select>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <button className="btn ghost" disabled={meta.page <= 1} onClick={prev}>Prev</button>
            <span className="muted">Page {meta.page}/{meta.pageCount} • {meta.total} orders</span>
            <button className="btn ghost" disabled={meta.page >= meta.pageCount} onClick={next}>Next</button>
          </div>
        </div>

        {orders.length === 0 && <p className="muted">Henüz siparişiniz yok.</p>}

        <div className="orders-list">
          {orders.map((o) => (
            <div className="order-row" key={o.id}>
              <div className="order-info">
                <div className="order-id">Order #{o.id}</div>
                <div className="order-date">{new Date(o.createdAt).toLocaleDateString()}</div>
                <div className="order-badges">
                  <span className={`badge status-${o.status}`}>{o.status}</span>
                  <span className={`badge pay-${o.paymentStatus}`}>{o.paymentStatus}</span>
                </div>
              </div>

              <div className="order-actions">
                <div className="order-total">{money(o.totalCents)}</div>
                <button className="btn ghost" onClick={() => navigate(`/order/${o.id}`)}>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="footer-summary">
          &copy; {new Date().getFullYear()} ClickMart | Designed by Bilge Acartürk
        </footer>
      </div>
    </>
  );
}
