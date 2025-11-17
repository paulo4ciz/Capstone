import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";


export default function Productos() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const stores = params.get("stores") || "acuenta,centralmayorista";

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
      <section className="banner-hero">
        <img src="/banner2.png" alt="Banner del proyecto" />
      </section>



      {/* Barra de búsqueda (hero) */}
      <section className="searchbar-hero">
        <div className="searchbar-hero__inner">
          <SearchBar compact stores={stores} />
        </div>
      </section>

      {/* Título + mensajes */}
      <section className="products-search">
        <div className="products-search__inner container">
          <div className="row">
            <div className="col-12 my-5">
              <h1 className="products-search__title text-center">
                {q
                  ? `Resultados para "${q}" — fuente: ${stores}`
                  : "Mira estos productos de la canasta básica"}
              </h1>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {loading && <p className="products-msg">Cargando…</p>}
              {!loading && err && (
                <p className="products-msg products-msg--error">Error: {err}</p>
              )}
              {/*{!loading && !err && !q && (
              <button type="button" onClick={remezclar} className="btn btn-light">
                Actualizar
              </button>
            )}*/}
            </div>

            {!loading && !err && items.length === 0 && (
              <p className="products-msg">No se encontraron productos.</p>
            )}
          </div>
        </div>
      </section>

      {/* Grid de tarjetas + banners laterales */}
      {!loading && !err && items.length > 0 && (
        <section class="products-with-banners py-4">
          <div class="container">
            <div class="row">


              <div class="col-12 col-md-2 d-none d-lg-block">
                <aside class="side-banner side-banner--left text-center">
                  <a href="#" aria-label="Banner izquierdo">
                    <img src="/bannerIzq.gif" alt="Promoción izquierda" class="img-fluid" />
                  </a>product-card 
                </aside>
              </div>


              <div class="col-12 col-lg-8">
                <section class="products-container">
                  <div className="row g-3">
                    {items.map((p) => (
                      <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-6 col-xxl-4">
                        <div className="products-grid__cell">
                          <ProductCard product={p} />
                        </div>
                      </div>
                    ))}
                  </div>

                </section>
              </div>


              <div class="col-12 col-md-2 d-none d-lg-block">
                <aside class="side-banner side-banner--right text-center">
                  <a href="#" aria-label="Banner derecho">
                    <img src="/bannerDer2.gif" alt="Promoción derecha" class="img-fluid" />
                  </a>
                </aside>
              </div>

            </div>
          </div>
        </section>

      )}


      {/* Secciones (igual) */}
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
