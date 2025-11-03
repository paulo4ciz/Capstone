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
    <form onSubmit={onSubmit} className={compact ? "w-full flex" : "flex"}>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="¿Donde esta la mano?"
        aria-label="Buscar"
      />
      
    </form>
  );
}
