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
      const r = await fetch(
        `/api/me/products/${encodeURIComponent(id)}?userId=${encodeURIComponent(user.id)}`,
        { method: "DELETE" }
      );
      const json = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(json?.error || `HTTP ${r.status}`);
      setItems((arr) => arr.filter((x) => x.id !== id));
    } catch (e) {
      alert(e.message || "No se pudo eliminar");
    }
  };

  // ===== Total acumulado (usa el precio con que se agregó) =====
  const fmtCLP = (v) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(v);

  const getAddedPrice = (p) =>
    Array.isArray(p.priceHistory) && p.priceHistory.length
      ? Number(p.priceHistory[0].price) || 0
      : Number(p.price) || 0;

  const total = items.reduce((sum, p) => sum + getAddedPrice(p), 0);

  return (
    <main className="page-user-history">
      <section className="banner">
        <img src="/banner2.png" alt="Banner del proyecto" />
      </section>

      <section className="historial-header" style={{ textAlign: "center", marginTop: 16 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Mi historial de productos</h1>
        <p style={{ marginTop: 6, opacity: 0.8 }}>Productos agregados para seguimiento de precio.</p>

        {loading && <p>Cargando…</p>}
        {!loading && err && <p style={{ color: "crimson" }}>Error: {err}</p>}
        {!loading && !err && items.length === 0 && <p>No tienes productos aún.</p>}
      </section>

      {/* Resumen de total (arriba de la grilla) */}
      {!loading && !err && items.length > 0 && (
        <section className="history-summary" style={{ display: "flex", justifyContent: "center", margin: "10px 0 22px" }}>
          <div
            className="history-summary__box"
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              background: "#0f172a",
              color: "#fff",
              padding: "12px 18px",
              borderRadius: 14,
              boxShadow: "0 10px 22px rgba(0,0,0,.22)"
            }}
          >
            <span className="history-summary__label" style={{ fontSize: 14, opacity: 0.85 }}>
              Tienes un total de: 
            </span>
            <span
              className="history-summary__amount"
              style={{ fontSize: 32, fontWeight: 800, letterSpacing: ".2px" }}
            >
              {fmtCLP(total)}
            </span>
            <span className="history-summary__count" style={{ fontSize: 12, opacity: 0.75, marginLeft: 6 }}>
              ({items.length} {items.length === 1 ? "producto" : "productos"})
            </span>
          </div>
        </section>
      )}

      {/* Grilla */}
      {!loading && !err && items.length > 0 && (
        <section className="products-container">
          <div className="products-grid">
            {items.map((p) => {
              const addedPrice = getAddedPrice(p);
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
