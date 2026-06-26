
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "../css/style1.css"; 
export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    district: "",
    postalCode: "",
    paymentMethod: "COD",
  });

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(c);
    if (!c.length) navigate("/cart");
  }, [navigate]);

  const totals = useMemo(() => {
    const sub = cart.reduce((s, i) => s + i.priceCents * i.qty, 0);
    const shippingCents = sub > 30000 ? 0 : 1999;
    return { sub, shippingCents, total: sub + shippingCents };
  }, [cart]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async () => {
    if (!form.fullName || !form.phone || !form.address1 || !form.city || !form.district) {
      alert("Please fill in shipping information"); return;
    }
    setSubmitting(true);
    try {
      const payload = {
        items: cart.map((i) => ({ productId: i.id, qty: i.qty })),
        paymentMethod: form.paymentMethod,
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          address1: form.address1,
          address2: form.address2,
          city: form.city,
          district: form.district,
          postalCode: form.postalCode,
        },
      };
      const { data } = await api.post("/orders", payload);
      localStorage.removeItem("cart");
      navigate(`/order/${data.id}`);
    } catch (err) {
      console.error("ORDER_ERROR:", err?.response || err);
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Unknown error";
        alert(`Order failed: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

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
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-grid">
        <section className="checkout-section">
          <h2 className="section-title">Shipping Address</h2>

          <div className="form-grid">
            <Field label="Full Name">
              <input className="form-input" name="fullName" value={form.fullName} onChange={onChange} />
            </Field>
            <Field label="Phone">
              <input className="form-input" name="phone" value={form.phone} onChange={onChange} />
            </Field>

            <div className="span-2">
              <Field label="Address Line 1">
                <input className="form-input" name="address1" value={form.address1} onChange={onChange} />
              </Field>
            </div>
            <div className="span-2">
              <Field label="Address Line 2">
                <input className="form-input" name="address2" value={form.address2} onChange={onChange} />
              </Field>
            </div>

            <Field label="City">
              <input className="form-input" name="city" value={form.city} onChange={onChange} />
            </Field>
            <Field label="District">
              <input className="form-input" name="district" value={form.district} onChange={onChange} />
            </Field>
            <Field label="Postal Code">
              <input className="form-input" name="postalCode" value={form.postalCode} onChange={onChange} />
            </Field>
          </div>

          <h2 className="section-title" style={{ marginTop: 16 }}>Payment Method</h2>
          <div className="radio-group">
            {["COD", "TRANSFER", "CARD"].map((pm) => (
              <label key={pm} className="radio-chip">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={pm}
                  checked={form.paymentMethod === pm}
                  onChange={onChange}
                />
                <span>
                  {pm === "COD" ? "Cash on Delivery" : pm === "TRANSFER" ? "Bank Transfer" : "Card (coming soon)"}
                </span>
              </label>
            ))}
          </div>
        </section>

        <aside className="summary">
          <h3 className="section-title">Order Summary</h3>

          <div className="line-items">
            {cart.map((i, idx) => (
                <div className="line-item" key={i.id ?? idx}>
                <div className="li-name">{i.name} × {i.qty}</div>
                <div className="li-price">{money(i.priceCents * i.qty)}</div>
                </div>
            ))}
            </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{money(totals.sub)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{money(totals.shippingCents)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{money(totals.total)}</span>
          </div>

          <button className="primary-btn" onClick={placeOrder} disabled={submitting}>
            {submitting ? "Submitting..." : "Place Order"}
          </button>
        </aside>

          <section className="card help-card">
            <h3 className="card-title">Need help?</h3>
            <p className="help-text">
              Questions about delivery or payment. Call <a href="tel:+90850850">05397826654</a> or email bilgeacarturk@stu.khas.edu.tr
            </p>
            <ul className="trust-list">
              <li>14-day returns</li>
              <li>Secure checkout</li>
              <li>Invoice included</li>
            </ul>
          </section>

      </div>
      <footer className="footer-summary">
        &copy; {new Date().getFullYear()} ClickMart | Designed by Bilge Acartürk
      </footer>
    </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label className="form-field">
      <span className="form-label">{label}</span>
      {children}
    </label>
  );
}

function money(cents) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}
