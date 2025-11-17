// src/pages/TiendaPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function TiendaPage() {
  const { id } = useParams();

  const [tienda, setTienda] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [loadingProductos, setLoadingProductos] = useState(true);

  const CONSULTAS_ACUENTA = [
    "leche","pan","arroz","fideos","aceite","azucar","bebida","harina",
    "huevos","yogurt","cafe","te","mantequilla","queso","pollo","carne",
    "jamon","atun","arvejas","porotos","lentejas","mermelada","sal",
    "salsas","mayonesa","aceitunas","galletas","cereal"
  ];

  // Cargar tienda
  useEffect(() => {
    fetch("/tiendas.json")
      .then((res) => res.json())
      .then((data) => {
        const encontrada = data.find((t) => t.id === parseInt(id));
        if (!encontrada) throw new Error("Tienda no encontrada");
        setTienda(encontrada);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  // ============================
  // Cargar productos con CACHE
  // ============================
  useEffect(() => {
    if (!tienda) return;

    const loadProductos = async () => {
      setLoadingProductos(true);

      const CACHE_KEY = `productos_${tienda.id}`;
      const CACHE_TTL = 1000 * 60 * 5; // 5 minutos

      // 1) Intentar cargar desde cache
      try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");

        if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
          console.log("Cargando productos desde CACHE:", tienda.nombre);
          setProductos(cache.items);
          setLoadingProductos(false);
          return;
        }
      } catch {}

      // 2) Cargar desde API o JSON
      let productosFinales = [];

      try {
        // --- ACuenta ---
        if (tienda.tipo === "acuenta") {
          let acumulado = [];

          for (const query of CONSULTAS_ACUENTA) {
            try {
              const resp = await fetch(`/api/search?q=${query}&stores=acuenta`);
              const data = await resp.json();
              if (Array.isArray(data)) acumulado.push(...data);
            } catch {}
          }

          // Deduplicar por título
          productosFinales = Object.values(
            acumulado.reduce((acc, p) => {
              acc[p.title] = p;
              return acc;
            }, {})
          );
        }

        // --- Otras tiendas: JSON local ---
        else if (tienda.archivo) {
          const resp = await fetch(`/archivos/${tienda.archivo}`);
          const data = await resp.json();
          productosFinales = Array.isArray(data) ? data : [];
        }
      } catch {
        productosFinales = [];
      }

      // 3) Guardar en cache
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          items: productosFinales,
        })
      );

      setProductos(productosFinales);
      setLoadingProductos(false);
    };

    loadProductos();
  }, [tienda]);

  if (error) return <p className="error-msg">{error}</p>;
  if (!tienda) return <p className="loading-msg">Cargando tienda…</p>;

  // Helper de CLP
  const formatPrice = (v) =>
    Number(v || 0).toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });

  return (
    <main className="tienda-page">

      {/* Volver */}
      <Link to="/mapa" className="tienda-back">
        ⬅ Volver al mapa
      </Link>

      {/* Info tienda */}
      <h1 className="tienda-title">{tienda.nombre}</h1>
      <p className="tienda-address">{tienda.direccion}</p>

      <h2 className="productos-title">Productos disponibles</h2>

      {loadingProductos && <p className="loading-msg">Cargando productos…</p>}

      {!loadingProductos && productos.length === 0 && (
        <p className="no-products-msg">No se encontraron productos.</p>
      )}

      {/* GRID DE PRODUCTOS */}
      <div className="productos-grid">

        {productos.map((p, index) => (
          <div key={index} className="producto-card">

            {/* Imagen */}
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.title} className="producto-img" />
            ) : (
              <div className="producto-img placeholder">Sin imagen</div>
            )}

            {/* Info */}
            <div className="producto-info">
              <h4 className="producto-name">{p.title}</h4>

              <p className="producto-marca">
                Categoría: {p.category || p.title.split(" ")[0]}
              </p>

              <p className="producto-price">{formatPrice(p.price)}</p>
            </div>

            {/* Botones */}
            <div className="producto-buttons">

              {/* VER PRODUCTO */}
              {p.productUrl && (
                <a
                  href={p.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ver-producto"
                >
                  Ver producto
                </a>
              )}

              {/* AGREGAR */}
              <button
                className="btn-agregar-producto"
                onClick={() => alert(`Agregado: ${p.title}`)}
              >
                Agregar
              </button>
            </div>

          </div>
        ))}

      </div>
    </main>
  );
}
