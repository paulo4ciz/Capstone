// src/components/SearchBar.jsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SearchBar({ compact = false, stores: storesProp = "" }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");

  const storesFromUrl = params.get("stores") || "";
  const stores = storesProp || storesFromUrl || "acuenta,centralmayorista"; // 👈 default

  useEffect(() => {
    setQ(params.get("q") || "");
  }, [params]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;

    const usp = new URLSearchParams();
    usp.set("q", q.trim());
    if (stores) usp.set("stores", stores);

    navigate(`/productos?${usp.toString()}`);
  };

  return (
   
 <div class="searchbar-1">
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
      />
    </div>
  </form>
</div>

  );
}
