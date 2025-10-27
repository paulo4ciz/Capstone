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
  const [refreshKey, setRefreshKey] = useState(0); // para remezclar cuando NO hay q

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        let url = "";
        if (q) {
          const usp = new URLSearchParams({ q, stores, _: Date.now() });
          url = `/api/search?${usp.toString()}`;
        } else {
          // Canasta básica por defecto (12) -> aleatoria
          url = `/api/random?limit=12&kind=basic&stores=${encodeURIComponent(
            stores
          )}&_=${Date.now()}`;
        }

        const r = await fetch(url, { cache: "no-store" });
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
    // Si hay q: se actualiza por q/stores; si no hay q: también cambia con refreshKey
    run();
  }, [q, stores, refreshKey]);

  const remezclar = () => {
    if (!q) setRefreshKey((k) => k + 1);
  };

  return (
    <main className="page-products">
      {/* Banner */}
      <section className="banner">
        <img src="/banner2.png" alt="Banner del proyecto" />
      </section>

      {/* Barra de búsqueda (hero) */}
      <section className="searchbar-hero">
        <div className="searchbar-hero__inner">
          <SearchBar compact />
        </div>
      </section>

      {/* Título + mensajes */}
      <section className="products-search">
        <div className="products-search__inner">
          <h1 className="products-search__title">
            {q
              ? `Resultados para "${q}" — fuente: ${stores}`
              : "Mira estos productos de la canasta básica"}
          </h1>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {loading && <p className="products-msg">Cargando…</p>}
            {!loading && err && (
              <p className="products-msg products-msg--error">Error: {err}</p>
            )}
           {/*  {!loading && !err && !q && (
              <button type="button" onClick={remezclar} className="btn btn-light">
                Actualizar
              </button>
            )}*/}
          </div>

          {!loading && !err && items.length === 0 && (
            <p className="products-msg">No se encontraron productos.</p>
          )}
        </div>
      </section>

      {/* Grid de tarjetas */}
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
      <section className="sections">
        <div className="sections__bar">
          <h2> SECCIONES</h2>
        </div>

        <div className="sections__grid">
          <article className="card c1">
            <div className="card__inner">
              <div className="card__num">01</div>
              <h3 className="card__title">Nuestro proyecto</h3>
              <p className="card__desc">Conoce el objetivo, el alcance y cómo “Dónde está la mano” ayuda a la comunidad.</p>
              <a className="card__btn" href="/Proyecto">Ver más</a>
            </div>
          </article>

          <article className="card c2">
            <div className="card__inner">
              <div className="card__num">02</div>
              <h3 className="card__title">Nuestra visión</h3>
              <p className="card__desc">Principios, transparencia de precios y el impacto que buscamos a largo plazo.</p>
              <a className="card__btn" href="/vision">Ver más</a>
            </div>
          </article>

          <article className="card c3">
            <div className="card__inner">
              <div className="card__num">03</div>
              <h3 className="card__title">Historial</h3>
              <p className="card__desc">Avances del proyecto, releases, y registro de cambios importantes.</p>
              <a className="card__btn" href="/Historial">Ver más</a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
