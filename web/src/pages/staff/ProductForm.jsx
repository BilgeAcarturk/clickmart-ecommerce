import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [f, setF] = useState({
    name: "",
    price: "",
    imageUrl: "",
    stock: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!id) return;
    api.get(`/products?search=${id}`).then((r) => {
      const p = r.data.items.find((x) => x.id == id);
      if (p) setF(p);
    });
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    if (id) await api.put(`/products/${id}`, f);
    else await api.post("/products", f);
    navigate("/staff/products");
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
    <div className="product-form-container">
      <h2 className="form-title">{id ? "Update Product" : "Add New Product"}</h2>

      <form onSubmit={save}>
        <div>
          <label>Name</label>
          <input
            className="text-input"
            placeholder="Product name"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Price</label>
          <input
            className="text-input"
            placeholder="Price"
            type="number"
            step="0.01"
            value={f.price}
            onChange={(e) => setF({ ...f, price: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Image URL</label>
          <input
            className="text-input"
            placeholder="Image URL"
            value={f.imageUrl}
            onChange={(e) => setF({ ...f, imageUrl: e.target.value })}
          />
        </div>

        <div>
          <label>Stock</label>
          <input
            className="text-input"
            placeholder="Stock"
            type="number"
            value={f.stock}
            onChange={(e) => setF({ ...f, stock: +e.target.value })}
          />
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={f.isActive}
            onChange={(e) => setF({ ...f, isActive: e.target.checked })}
          />
          Active
        </label>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/staff/products")}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {id ? "Update" : "Add"}
          </button>
        </div>
      </form>

      <footer className="footer-summary">
        &copy; {new Date().getFullYear()} ClickMart | Designed by Bilge Acartürk
      </footer>
    </div>
    </>
  );
}
