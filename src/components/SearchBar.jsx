// src/components/SearchBar.jsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function SearchBar({ compact = false, stores: storesProp = "" }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // leer q inicial desde la URL (si existe)
  const [q, setQ] = useState(() => params.get("q") || "");

  const storesFromUrl = params.get("stores") || "";
  const stores = storesProp || storesFromUrl || "acuenta"; // deja solo acuenta si no tienes más tiendas

  const onSubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;

    const usp = new URLSearchParams();
    usp.set("q", query);
    if (stores) usp.set("stores", stores);

    navigate(`/productos?${usp.toString()}`);
  };

  return (
    <div className={`searchbar-1 ${compact ? "searchbar-compact" : ""}`}>
      <form onSubmit={onSubmit} className="w-full d-flex align-items-center" role="search">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="search"
            className="form-control search-input"
            placeholder="¿Dónde está la mano?"
            aria-label="Buscar"
            value={q}                          // 👈 ahora ligado al estado
            onChange={(e) => setQ(e.target.value)} // 👈 actualiza q
          />
        </div>
      </form>
    </div>
  );
}