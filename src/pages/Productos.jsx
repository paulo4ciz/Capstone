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
          <SearchBar compact stores={stores} />
        </div>
      </section>

      {/* Título + mensajes */}
<section className="products-search py-4">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-12">

        {/* Título */}
        <h1 className="text-center my-3">
          {q
            ? `Resultados para "${q}" — fuente: ${stores}`
            : "Mira estos productos de la canasta básica"}
        </h1>

        {/* Mensajes de estado */}
        <div className="d-flex align-items-center gap-3 mb-3">
          {loading && <p className="text-muted m-0">Cargando…</p>}

          {!loading && err && (
            <p className="text-danger m-0">Error: {err}</p>
          )}

          {/* Si necesitas el botón volver a activarlo */}
          {/* 
          {!loading && !err && !q && (
            <button
              type="button"
              onClick={remezclar}
              className="btn btn-light"
            >
              Actualizar
            </button>
          )} 
          */}
        </div>

        {/* No hay resultados */}
        {!loading && !err && items.length === 0 && (
          <p className="text-muted">No se encontraron productos.</p>
        )}

      </div>
    </div>
  </div>
</section>


      {/* Grid de tarjetas */}
      {!loading && !err && items.length > 0 && (
        <section className="products-container my-4">
          <div className="container">
            <div className="row g-3">
              {items.map((p) => (
                <div key={p.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard {...p} />
                </div>
              ))}
            </div>
          </div>
        </section>

      )}
      <section className="py-5 sections">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-header fw-semibold">
                  ¿Dónde está la mano?
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">Nuestro proyecto</h5>
                  <p className="card-text">
                    Conoce el objetivo, el alcance y cómo “Dónde está la mano” ayuda a la comunidad.
                  </p>
                  <a href="/Proyecto" className="btn btn-outline-dark mt-auto">
                    Ver más
                  </a>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-header fw-semibold">
                  ¿Dónde está la mano?
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">Nuestra visión</h5>
                  <p className="card-text">
                    Principios, transparencia de precios y el impacto que buscamos a largo plazo.
                  </p>
                  <a href="/vision" className="btn btn-outline-dark mt-auto">
                    Ver más
                  </a>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-header fw-semibold">
                  ¿Dónde está la mano?
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">Historial</h5>
                  <p className="card-text">
                    Avances del proyecto, releases, y registro de cambios importantes.
                  </p>
                  <a href="/Historial" className="btn btn-outline-dark mt-auto">
                    Ver más
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
