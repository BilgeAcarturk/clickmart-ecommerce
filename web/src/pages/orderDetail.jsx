
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../api/axiosInstance";

const money = (cents) =>
  (Number(cents || 0) / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error("FETCH_ORDER_ERROR", err?.response || err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const subTotalCents = useMemo(
    () => order?.orderitem?.reduce((s, it) => s + it.unitPriceCents * it.qty, 0) ?? 0,
    [order]
  );

  if (loading) return <div className="order-detail"><p className="muted">Loading...</p></div>;
  if (!order) return null;

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
      <h1 className="title">Order #{order.id}</h1>

      <div className="grid">
        {/* LEFT */}
        <section className="od-card">
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:10}}>
            <span className={`badge status-${order.status}`}>Status: {order.status}</span>
            <span className={`badge pay-${order.paymentStatus}`}>Payment: {order.paymentStatus}</span>
            <span className="badge">Method: {order.paymentMethod}</span>
          </div>

          <h2 className="section-title">Items</h2>
          <div className="items">
            {order.orderitem.map((oi, idx) => (
              <div className="item" key={oi.id ?? `${oi.productId}-${idx}`}>
                <div className="item-name">
                  {(oi.product?.name || `Product #${oi.productId}`)} × {oi.qty}
                </div>
                <div className="item-price">{money(oi.unitPriceCents * oi.qty)}</div>
              </div>
            ))}
          </div>

          <hr className="hr" />

          <h2 className="section-title">Shipping Address</h2>
          <div className="address">
            <div><span className="label">Full Name: </span>{order.shippingAddress?.fullName}</div>
            <div><span className="label">Phone: </span>{order.shippingAddress?.phone}</div>
            <div><span className="label">Address: </span>{order.shippingAddress?.address1}</div>
            {order.shippingAddress?.address2 && <div>{order.shippingAddress.address2}</div>}
            <div>
              <span className="label">City/District: </span>
              {order.shippingAddress?.city} / {order.shippingAddress?.district}
            </div>
            <div><span className="label">Postal Code: </span>{order.shippingAddress?.postalCode}</div>
          </div>
        </section>

        {/* RIGHT */}
        <aside className="od-card sticky">
          <h2 className="section-title">Summary</h2>
          <div className="row">
            <span className="muted">Subtotal</span>
            <span>{money(subTotalCents)}</span>
          </div>
          <div className="row">
            <span className="muted">Shipping</span>
            <span>{money(order.totalCents - subTotalCents)}</span>
          </div>
          <div className="row total">
            <span>Total</span>
            <span>{money(order.totalCents)}</span>
          </div>

          <hr className="hr" />

          <div style={{display:"flex",gap:10}}>
            <button className="btn" onClick={() => navigate("/user1")}>Continue Shopping</button>
            <button className="btn ghost" onClick={() => navigate("/orders")}>My Orders</button>
          </div>
        </aside>
      </div>
      <footer className="footer-summary">
        &copy; {new Date().getFullYear()} ClickMart | Designed by Bilge Acartürk
      </footer>
    </div>
    </>
  );
}
