import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import ScrollToTopButton from "../components/ScrollToTopButton";

export default function TiendaPage() {
  const { id } = useParams();

  const [tienda, setTienda] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [loadingProductos, setLoadingProductos] = useState(true);

  // Infinite scroll
  const [visibleCount, setVisibleCount] = useState(20);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadRef = useRef(null);

  // Categorías filtros
  const CATEGORIAS_GRUPADAS = {
    Lacteos: ["leche", "yoghurt", "mantequilla", "queso", "yogurt", "nata", "crema pastelera"],
    Legumbres: ["arroz", "fideos", "arvejas", "porotos", "poroto", "lentejas", "garbanzos"],
    Conservas: ["atun", "atún", "mermelada", "aceitunas", "aceituna", "pickles", "chucrut", "pepinillos"],
    Pastas: ["spaguetti", "5 spaghetti", "pasta", "anellini", "tallarín", "prepizza"],
    Bebidas: ["cafe", "café", "bebida", "café instantáneo", "café molido"],
    Infusiones: ["té", "té verde", "té negro", "té ceylán", "té manzanilla", "té ocho hierbas", "té mystic", "té emblem", "té polvo"],
    Panaderia: ["pan", "molde integral", "huevos", "huevo", "sopaipillas", "queque", "donut", "alfajor", "magdalena", "berlín", "medialuna", "muffin"],
    Snacks: ["snack", "brownie", "galleta", "gall", "ramitas", "tortillas sal", "cerealbar", "papas fritas", "chips", "barra de proteína", "chocolate", "dulce"],
    Aceites_y_Azucar: ["aceite", "azucar", "Azúcar", "sal", "chancaca", "stevia"],
    Carnes: ["pollo", "carne", "vacuno", "carnicero", "cerdo", "lomo", "costillar", "chuleta", "posta", "medallón", "pulpa", "salchicha"],
    Embutidos: ["jamon", "salame", "paté", "mortadela", "longaniza", "jamón", "costilla", "chuletitas", "tocino"],
    Aderezos: ["salsas", "salsa", "mayonesa", "ketchup", "aderezo", "mostaza"],
    Comida_Preparada: ["empanada", "Empanadas", "torta", "kuchen", "pastel", "pie", "brazo de reina"],
    Pasteleria: ["pasteleria", "croissant", "helado"],
    Cereales: ["cereal"],
    Abarrotes: ["harina", "ensalada lista", "manteca", "margarina", "chocolate en polvo", "azúcar rubia", "azúcar blanca"]
  };

  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [ordenPrecio, setOrdenPrecio] = useState("ninguno");

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

  const formatLabel = (s) => {
    if (!s) return "Otros";
    const str = s.toString().replace(/_/g, " ").trim();
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  function detectarCategoria(p) {
    if (!p) return "Otros";

    if (p.category && p.category.trim() !== "") {
      const key = Object.keys(CATEGORIAS_GRUPADAS).find((general) =>
        CATEGORIAS_GRUPADAS[general].includes(p.category.toLowerCase())
      );
      return key ? formatLabel(key) : formatLabel(p.category);
    }

    const titulo = String(p.title || "").toLowerCase();
    for (const [general, items] of Object.entries(CATEGORIAS_GRUPADAS)) {
      for (const item of items) {
        if (titulo.includes(item.toLowerCase())) {
          return formatLabel(general);
        }
      }
    }

    return "Otros";
  }

  // Cargar productos
  useEffect(() => {
    if (!tienda) return;

    const loadProductos = async () => {
      setLoadingProductos(true);

      const CACHE_KEY = `productos_${tienda.id}`;
      const CACHE_TTL = 1000 * 60 * 5;

      try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
        if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
          setProductos(cache.items);
          setLoadingProductos(false);
          return;
        }
      } catch { }

      let productosFinales = [];

      try {
        if (tienda.tipo === "acuenta" || tienda.tipo === "centralmayorista") {
          const CONSULTAS = Object.values(CATEGORIAS_GRUPADAS).flat();
          let acumulado = [];

          const fetches = CONSULTAS.map((query) =>
            fetch(`/api/search?q=${query}&stores=${tienda.tipo}`)
              .then((res) => res.json())
              .then((data) => {
                if (Array.isArray(data)) acumulado.push(...data);
              })
          );

          await Promise.all(fetches);

          productosFinales = Object.values(
            acumulado.reduce((acc, p) => {
              acc[p.title] = p;
              return acc;
            }, {})
          );
        } else if (tienda.archivo) {
          const resp = await fetch(`/archivos/${tienda.archivo}`);
          const data = await resp.json();
          productosFinales = Array.isArray(data) ? data : [];
        }
      } catch {
        productosFinales = [];
      }

      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), items: productosFinales })
        );
      } catch { }

      setProductos(productosFinales);
      setLoadingProductos(false);
    };

    loadProductos();
  }, [tienda]);

  // Filtros
  const categorias = useMemo(() => {
    if (!productos || productos.length === 0) return ["Todos"];
    const unicas = new Set(productos.map((p) => detectarCategoria(p)));
    const lista = Array.from(unicas).sort();
    if (!lista.includes("Otros")) lista.push("Otros");
    return ["Todos", ...lista];
  }, [productos, tienda]);

  const productosFiltrados = useMemo(() => {
    let lista = [...productos].map((p) => ({
      ...p,
      __detectedCategory: detectarCategoria(p),
    }));

    if (filtroCategoria !== "Todos")
      lista = lista.filter((p) => p.__detectedCategory === filtroCategoria);

    if (ordenPrecio === "asc")
      lista.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    else if (ordenPrecio === "desc")
      lista.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));

    return lista;
  }, [productos, filtroCategoria, ordenPrecio]);

  const productosVisibles = productosFiltrados.slice(0, visibleCount);

  // Infinite Scroll
  useEffect(() => {
    if (!loadRef.current) return;
    if (visibleCount >= productosFiltrados.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 20);
            setLoadingMore(false);
          }, 600);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadRef.current);

    return () => observer.disconnect();
  }, [visibleCount, productosFiltrados.length, loadingMore]);

  if (error) return <p className="error-msg">{error}</p>;

  return (
    <main className="tienda-page">

      {/* TIENDA-CAJA SIEMPRE VISIBLE */}
      <div className="tienda-caja">
        <Link to="/mapa" className="tienda-back">⬅ Volver al mapa</Link>

        <h1 className="tienda-title">
          {tienda ? tienda.nombre : "Cargando tienda..."}
        </h1>

        <p className="tienda-address">
          {tienda ? tienda.direccion : ""}
        </p>

        {/* FILTROS solo si tienda ya cargó */}
        {tienda && (
          <div className="filtros-container">
            <label>
              <span>Categoría:</span>
              <select
                className="filtro-select"
                value={filtroCategoria}
                onChange={(e) => {
                  setFiltroCategoria(e.target.value);
                  setVisibleCount(20);
                }}
              >
                {categorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Orden:</span>
              <select
                className="filtro-select"
                value={ordenPrecio}
                onChange={(e) => {
                  setOrdenPrecio(e.target.value);
                  setVisibleCount(20);
                }}
              >
                <option value="ninguno">Sin ordenar</option>
                <option value="asc">Precio: menor a mayor</option>
                <option value="desc">Precio: mayor a menor</option>
              </select>
            </label>

            <button
              className="btn-reset-filtros"
              onClick={() => {
                setFiltroCategoria("Todos");
                setOrdenPrecio("ninguno");
                setVisibleCount(20);
              }}
            >
              Limpiar
            </button>
          </div>
        )}
      </div>

      {/* LOADER PRINCIPAL PARA PRODUCTOS */}
      {loadingProductos ? (
        <div className="loader-fullscreen">
          <Loader />
        </div>
      ) : (
        <>
          {/* GRID */}
          <div className="productos-grid">
            {productosVisibles.map((p, i) => (
              <ProductCard
                key={p.id ?? i}
                product={{
                  id: p.id ?? i,
                  title: p.title,
                  price: p.price,
                  imageUrl: p.imageUrl,
                  productUrl: p.productUrl,
                  store: p.__detectedCategory,
                  previousPrice: p.previousPrice,
                  pricePerSubUnit: p.pricePerSubUnit,
                  badge: p.badge,
                }}
                showAddButton={true}
              />
            ))}
          </div>

          {/* LOADER INFINITE SCROLL */}
          {!loadingProductos && visibleCount < productosFiltrados.length && (
            <div ref={loadRef} className="loader-container">
              {loadingMore && <Loader />}
            </div>
          )}
        </>
      )}

      <ScrollToTopButton />
    </main>
  );
}
