// src/pages/MiHistorial.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function MiHistorial() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("auth:user") || "null");
      if (!u?.id) return navigate("/Login");
      setUser(u);
    } catch {
      navigate("/Login");
    }
  }, [navigate]);

  const load = async (uid) => {
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(`/api/me/products?userId=${encodeURIComponent(uid)}&limit=200`, { cache: "no-store" });
      const json = await r.json();
      if (!r.ok) throw new Error(json?.error || `HTTP ${r.status}`);
      setItems(Array.isArray(json.items) ? json.items : []);
    } catch (e) {
      setErr(e.message || "No se pudo cargar tu historial");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) load(user.id);
  }, [user?.id]);

  const removeItem = async (id) => {
    if (!user?.id) return navigate("/Login");
    try {
      const r = await fetch(`/api/me/products/${encodeURIComponent(id)}?userId=${encodeURIComponent(user.id)}`, {
        method: "DELETE"
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(json?.error || `HTTP ${r.status}`);
      setItems((arr) => arr.filter((x) => x.id !== id));
    } catch (e) {
      alert(e.message || "No se pudo eliminar");
    }
  };

  return (
    <main className="page-user-history">
      <section className="banner">
        <img src="/banner2.png" alt="Banner del proyecto" />
      </section>
      <section className="historial-header">
        <h1>Mi historial de productos</h1>
        <p>Productos agregados para seguimiento de precio.</p>
        {loading && <p>Cargando…</p>}
        {!loading && err && <p style={{ color: "crimson" }}>Error: {err}</p>}
        {!loading && !err && items.length === 0 && <p>No tienes productos aún.</p>}
      </section>

      {!loading && !err && items.length > 0 && (
      
      
<section className="products-container">
  <div className="products-grid">
    {items.map((p) => {
      const addedPrice = Array.isArray(p.priceHistory) && p.priceHistory.length
        ? p.priceHistory[0].price
        : p.price;
      return (
        <div key={p.id} className="products-grid__cell">
          <ProductCard
            product={p}
            variant="history"
            addedPrice={addedPrice}
            lastSeenAt={p.lastSeenAt}
            showAddButton={false}
            onDelete={removeItem}
          />
        </div>
      );
    })}
  </div>
</section>

      )}
    </main>
  );
}
