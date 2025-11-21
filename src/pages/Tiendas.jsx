import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function TiendaPage() {
  const { id } = useParams();

  const [tienda, setTienda] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [loadingProductos, setLoadingProductos] = useState(true);

  // Categorías filtros
  const CATEGORIAS_GRUPADAS = {
    Lacteos: ["leche", "yoghurt", "mantequilla", "queso", "yogurt", "nata", "crema pastelera"],
    Legumbres: ["arroz", "fideos", "arvejas", "porotos","poroto", "lentejas", "garbanzos"],
    Conservas: ["atun","atún", "mermelada", "aceitunas","aceituna", "pickles", "chucrut","pepinillos"],
    Pastas: ["spaguetti", "pasta", "anellini", "tallarín", "prepizza"],
    Bebidas: ["cafe", "café", "bebida", "café instantáneo", "café molido"],
    Infusiones: ["té", "té verde", "té negro", "té ceylán", "té manzanilla", "té ocho hierbas", "té mystic", "té emblem", "té polvo"],
    Panaderia: ["pan","molde integral", "huevos","huevo", "sopaipillas", "queque", "donut", "alfajor", "magdalena", "berlín", "medialuna", "muffin"],
    Snacks: ["snack", "cerealbar", "papas fritas", "chips", "barra de proteína", "chocolate", "dulce"],
    Aceites_y_Azucar: ["aceite", "azucar","Azúcar", "sal", "chancaca", "stevia"],
    Carnes: ["pollo", "carne", "vacuno","carnicero", "cerdo", "lomo", "costillar", "chuleta", "posta", "medallón", "pulpa", "salchicha"],
    Embutidos: ["jamon", "salame", "paté", "mortadela", "longaniza", "jamón","costilla","chuletitas","tocino"],
    Aderezos: ["salsas","salsa", "mayonesa", "ketchup", "aderezo", "mostaza"],
    Comida_Preparada: ["empanada","Empanadas", "torta", "kuchen", "pastel", "pie", "brazo de reina"],
    Pasteleria: ["pasteleria", "croissant", "helado"],
    Cereales: ["cereal"],  
    Abarrotes: ["harina", "manteca", "margarina", "chocolate en polvo", "azúcar rubia", "azúcar blanca"]
  };

  // filtros UI
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

  // Formateo seguro de labels
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
        if (
          titulo === item.toLowerCase() ||
          titulo.includes(item.toLowerCase() + " ")
        ) {
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
      } catch {}

      let productosFinales = [];

      try {
        if (tienda.tipo === "acuenta" || tienda.tipo === "centralmayorista") {
          const CONSULTAS_ACUENTA = Object.values(CATEGORIAS_GRUPADAS).flat();
          let acumulado = [];
          const fetches = CONSULTAS_ACUENTA.map((query) =>
            fetch(`/api/search?q=${query}&stores=${tienda.tipo}`)
              .then(res => res.json())
              .then(data => {
                if (Array.isArray(data)) acumulado.push(...data);
              })
              .catch(() => {})
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
      } catch {}

      setProductos(productosFinales);
      setLoadingProductos(false);
    };

    loadProductos();
  }, [tienda]);

  // Categorías para filtro 
  const categorias = useMemo(() => {
    if (!productos || productos.length === 0) return ["Todos"];
    const unicas = new Set(productos.map((p) => detectarCategoria(p)));
    const lista = Array.from(unicas).sort();
    if (!lista.includes("Otros")) lista.push("Otros");
    return ["Todos", ...lista];
  }, [productos, tienda]);

  // Productos filtrados
  const productosFiltrados = useMemo(() => {
    let lista = [...productos].map((p) => ({
      ...p,
      __detectedCategory: detectarCategoria(p),
    }));

    if (filtroCategoria && filtroCategoria !== "Todos") {
      lista = lista.filter((p) => p.__detectedCategory === filtroCategoria);
    }

    if (ordenPrecio === "asc") {
      lista.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (ordenPrecio === "desc") {
      lista.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }

    return lista;
  }, [productos, filtroCategoria, ordenPrecio]);

  if (error) return <p className="error-msg">{error}</p>;
  if (!tienda) return <p className="loading-msg">Cargando tienda…</p>;

  return (
    <main className="tienda-page">
      <div className="tienda-caja">
        <Link to="/mapa" className="tienda-back">⬅ Volver al mapa</Link>

        <h1 className="tienda-title">{tienda.nombre}</h1>
        <p className="tienda-address">{tienda.direccion}</p>

        {/* FILTROS */}
        <div className="filtros-container">
          <label>
            <span>Categoría:</span>
            <select
              className="filtro-select"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
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
              onChange={(e) => setOrdenPrecio(e.target.value)}
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
            }}
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* GRID de productos */}
      <div className="productos-grid">
        {productosFiltrados.map((p, i) => (
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
    </main>
  );
}
