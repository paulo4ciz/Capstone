// src/components/ProductCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard(props) {
  // Soporta ambas firmas:
  // - <ProductCard product={p} />
  // - <ProductCard {...p} />
  const {
    product: productProp,
    className = "",
    showAddButton = true,   // en historial será false
    onDelete = null,        // en historial viene una función
    variant = "default",    // "default" | "history"
    addedPrice = null,      // precio al momento de agregar (historial)
    lastSeenAt = null,      // timestamp "visto por última vez" (historial)
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

  // Normaliza precio (número o string)
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
    <a
  className={`text-decoration-none d-block border rounded-3  h-100 ${className}`}
  href={productUrl || "#"}
  target="_blank"
  rel="noreferrer"
  title={title}
  aria-label={title}
>
  {/* Imagen */}
  <div className="header-card">
    {imageUrl && !imgBroken ? (
      <img
        src={imageUrl}
        alt={title}
        className="img-fluid rounded"
        loading="lazy"
        onError={() => setImgBroken(true)}
        style={{ maxHeight: "180px", objectFit: "contain" }}
      />
    ) : (
      <div className="bg-light border rounded d-flex align-items-center justify-content-center" style={{ height: "180px" }}>
        Sin imagen
      </div>
    )}
  </div>

  {/* Body */}
  <div className="d-flex flex-column p-3">

    {/* Badge */}
    {badge && (
      <span className="badge bg-warning text-dark mb-2">{badge}</span>
    )}

    {/* Precios */}
    <div className="d-flex align-items-baseline gap-2 mb-2">
      <span className="fw-bold fs-5 text-dark">{fmtCLP(displayPrice)}</span>

      {variant !== "history" && previousPrice && (
        <span className="text-decoration-line-through text-muted small">
          {fmtCLP(previousPrice)}
        </span>
      )}
    </div>

    {/* Título */}
    <div className="fw-semibold text-dark mb-1 title-product">
      {title}
    </div>

    {/* Precio por unidad */}
    {pricePerSubUnit && (
      <div className="text-muted small mb-2">
        {fmtCLP(pricePerSubUnit)}/un
      </div>
    )}

    {/* Store */}
    {store && (
      <div className=" small mb-3 store">{store}</div>
    )}

    {/* Última vez visto */}
    {variant === "history" && (
      <small className="text-muted mb-2">
        Visto por última vez:{" "}
        {lastSeenAt ? new Date(lastSeenAt).toLocaleString("es-CL") : "-"}
      </small>
    )}

    {/* Botones */}
    <div className="mt-auto d-flex flex-wrap gap-2">

      <button type="button" className="btn btn-view" onClick={openProduct}>
        Ver
      </button>

      {showAddButton && (
        <button
          type="button"
          onClick={addToHistory}
          disabled={loading || added}
          className="btn btn-outline-dark mt-auto btn-add"
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

    {err && (
      <small className="text-danger mt-2 d-block">{err}</small>
    )}
  </div>
</a>

  );
}
