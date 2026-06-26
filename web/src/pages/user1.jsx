
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";
import api from "../api/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import "../css/style1.css";

const normalize = (p) => ({
  id: String(p.id),
  name: p.name,
  price: Number(p.price),
  image: p.imageUrl || p.image || "",
});

export default function UserPage() {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.get("/products", { params: { active: "true", page: 1, take: 24 } })
      .then((r) => {
        if (!mounted) return;
        const arr = Array.isArray(r.data?.items) ? r.data.items : [];
        setProducts(arr);
      })
      .catch(() => setProducts([]));
    return () => { mounted = false; };
  }, []);

  const count = useMemo(() => Object.values(cart).reduce((s, i) => s + i.qty, 0), [cart]);
  const total = useMemo(
    () => Object.values(cart).reduce((s, i) => s + i.product.price * i.qty, 0).toFixed(2),
    [cart]
  );

  const add = (raw) => {
    const product = normalize(raw);
    setCart((c) => {
      const cur = c[product.id]?.qty || 0;
      return { ...c, [product.id]: { product, qty: cur + 1 } };
    });
  };

  const dec = (id) => setCart((c) => {
    const item = c[id]; if (!item) return c;
    const q = item.qty - 1; const n = { ...c };
    if (q <= 0) delete n[id]; else n[id] = { ...item, qty: q };
    return n;
  });

  const inc = (id) => setCart((c) => {
    const item = c[id]; if (!item) return c;
    return { ...c, [id]: { ...item, qty: item.qty + 1 } };
  });

  const removeItem = (id) => setCart((c) => { const n = { ...c }; delete n[id]; return n; });

  const toCheckoutArray = (cartObj) =>
  Object.values(cartObj).map(({ product, qty }) => ({
    id: product.id,
    name: product.name,
    priceCents: Math.round(Number(product.price) * 100),
    qty,
    imageUrl: product.image || ""
  }));

  const checkout = () => {
  if (count === 0) return toast.warn("Cart is empty.");
  const payload = toCheckoutArray(cart);
  localStorage.setItem("cart", JSON.stringify(payload));
  setCartOpen(false);
  navigate("/checkout");
};

  return (
    <>
      <div className="auth-page user-page">
        <header className="user-header">
          <h1 className="logo-text" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            ClickMart
          </h1>

          {!cartOpen && (
            <div className="header-actions">
              <button className="cart-btn" onClick={() => setCartOpen(true)}>
                <FaShoppingCart className="cart-icon" />
                {count > 0 && <span className="cart-count">{count}</span>}
              </button>
              <button
                className="logout-btn"
                onClick={() => {
                  sessionStorage.clear();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <div className="auth-content">
          <section className="products-grid">
            {products.length === 0 ? (
              <p className="muted" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                No products yet.
              </p>
            ) : (
              products.map((p) => (
                <article key={String(p.id)} className="product-card">
                  <div className="product-thumb">
                    <img src={p.imageUrl || ""} alt={p.name} />
                  </div>
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-price">${Number(p.price).toFixed(2)}</p>
                  <button className="btn add-btn" onClick={() => add(p)}>
                    Add to cart
                  </button>
                </article>
              ))
            )}
          </section>
        </div>
      </div>

      <footer className="footer-summary">
        &copy; {new Date().getFullYear()} ClickMart | Designed by Bilge Acartürk
      </footer>

      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div className="cart-head">
          <h4>My Cart</h4>
          <button className="icon-btn" onClick={() => setCartOpen(false)}>×</button>
        </div>

        <div className="cart-body">
          {count === 0 ? (
            <p className="muted">No items yet.</p>
          ) : (
            Object.values(cart).map(({ product, qty }) => (
              <div key={product.id} className="cart-row">
                <div className="cart-info">
                  <div className="thumb-sm">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div>
                    <div className="cart-name">{product.name}</div>
                    <div className="cart-price">${product.price.toFixed(2)}</div>
                  </div>
                </div>

                <div className="qty-controls">
                  <button className="icon-btn" onClick={() => dec(product.id)}>–</button>
                  <span className="qty">{qty}</span>
                  <button className="icon-btn" onClick={() => inc(product.id)}>+</button>
                </div>

                <button className="remove-btn" onClick={() => removeItem(product.id)} title="Remove">
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-foot">
          <div className="total">
            <span>Total</span>
            <strong>${total}</strong>
          </div>
          <button className="btn btn-big" onClick={checkout}>Checkout</button>
        </div>
      </aside>

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)} />}

      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}
