// src/pages/Productos.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

export default function Productos() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const stores = params.get("stores") || "acuenta";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");
        const usp = new URLSearchParams({ q, stores });
        const url = q ? `/api/search?${usp.toString()}` : `/api/random?limit=24`;
        const r = await fetch(url);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message || "Error cargando productos");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [q, stores]);

  return (
    <main className="page-products">
      {/* 1) Banner */}
      <section className="banner">
        <img src="/banner2.png" alt="Banner del proyecto" />
      </section>

      {/* 2) Hero del buscador (franja roja full-width + pill centrado) */}
      <section className="searchbar-hero">
        <div className="searchbar-hero__inner">
          <SearchBar compact />
        </div>
      </section>

      {/* 3) Título + mensajes */}
      <section className="products-search">
        <div className="products-search__inner">
          <h1 className="products-search__title">
            {q ? `Resultados para "${q}"` : "Productos para inspirarte"} — fuente: {stores}
          </h1>

          {loading && <p className="products-msg">Cargando…</p>}
          {!loading && err && <p className="products-msg products-msg--error">Error: {err}</p>}
          {!loading && !err && items.length === 0 && (
            <p className="products-msg">No se encontraron productos.</p>
          )}
        </div>
      </section>

      {/* 4) Grid de tarjetas (derecha → izquierda, wrap y separación) */}
      {!loading && !err && items.length > 0 && (
        <section className="products-container">
          <div className="products-grid">
            {items.map((p) => (
              <div key={p.id} className="products-grid__cell">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
