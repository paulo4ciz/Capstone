// src/components/ProductCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard(props) {
  const {
    product: productProp,
    className = "",
    showAddButton = true,
    onDelete = null,
    variant = "default",
    addedPrice = null,
    lastSeenAt = null,
  } = props;

  const product = productProp ?? props;
  if (!product) return null;

  const navigate = useNavigate();
  const {
    id,
    title = "",
    price: priceRaw = 0,
    imageUrl = "",
    productUrl = "",
    store = "",
    previousPrice,
    pricePerSubUnit,
    badge,
  } = product;

  const price =
    typeof priceRaw === "number"
      ? priceRaw
      : Number(String(priceRaw).replace(/[^\d]/g, "")) || 0;

  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [err, setErr] = useState("");
  const [imgBroken, setImgBroken] = useState(false);

  const fmtCLP = (v) =>
    typeof v === "number"
      ? v.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
          maximumFractionDigits: 0,
        })
      : `$${String(v ?? "")
          .replace(/[^\d]/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

  const displayPrice = variant === "history" ? (addedPrice ?? price) : price;

  const openProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (productUrl) window.open(productUrl, "_blank", "noopener,noreferrer");
  };

  const addToHistory = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setErr("");

    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("auth:user") || "null");
    } catch {}

    if (!user?.id) {
      navigate("/Login");
      return;
    }

    try {
      setLoading(true);
      const r = await fetch("/api/me/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productUrl,
          title,
          imageUrl,
          store,
          currency: "CLP",
          price,
        }),
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(json?.error || `Error ${r.status}`);
        return;
      }
      setAdded(true);
      window.dispatchEvent(new Event("historial:changed"));
    } catch {
      setErr("No se pudo agregar. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (e) => {
    if (!onDelete) return;
    e.preventDefault();
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div
      className={`producto-card ${className}`}
      title={title}
      aria-label={title}
    >
      {/* Imagen */}
      <div className="producto-img-container">
        {imageUrl && !imgBroken ? (
          <img
            src={imageUrl}
            alt={title}
            className="producto-img"
            loading="lazy"
            onError={() => setImgBroken(true)}
          />
        ) : (
          <div className="producto-img placeholder">
            Sin imagen
          </div>
        )}
      </div>

      {/* Info */}
      <div className="producto-info">
        {badge && (
          <span className="badge bg-warning text-dark mb-2">{badge}</span>
        )}

        {/* Precios */}
        <div className="d-flex align-items-baseline gap-2 mb-2">
          <span className="producto-price">{fmtCLP(displayPrice)}</span>
          {variant !== "history" && previousPrice && (
            <span className="text-decoration-line-through text-muted small">
              {fmtCLP(previousPrice)}
            </span>
          )}
        </div>

        {/* Título */}
        <div className="producto-name mb-1">{title}</div>

        {/* Precio por unidad */}
        {pricePerSubUnit && (
          <div className="text-muted small mb-2">{fmtCLP(pricePerSubUnit)}/un</div>
        )}

        {/* Store */}
        {store && <div className="producto-marca mb-3">{store}</div>}

        {/* Última vez visto */}
        {variant === "history" && (
          <small className="text-muted mb-2">
            Visto por última vez:{" "}
            {lastSeenAt ? new Date(lastSeenAt).toLocaleString("es-CL") : "-"}
          </small>
        )}

        {/* Botones */}
        <div className="producto-buttons">
          <button type="button" className="btn-ver-producto" onClick={openProduct}>
            Ver
          </button>

          {showAddButton && (
            <button
              type="button"
              onClick={addToHistory}
              disabled={loading || added}
              className="btn-agregar-producto"
            >
              {added ? "Agregado" : loading ? "Agregando…" : "Agregar"}
            </button>
          )}

          {!!onDelete && (
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Eliminar
            </button>
          )}
        </div>

        {err && <small className="text-danger mt-2 d-block">{err}</small>}
      </div>
    </div>
  );
}
