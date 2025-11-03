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
      className={`product-card ${className}`}
      href={productUrl || "#"}
      target="_blank"
      rel="noreferrer"
      title={title}
      aria-label={title}
    >
      <div className="product-card__img">
        {imageUrl && !imgBroken ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            onError={() => setImgBroken(true)}
          />
        ) : (
          <div className="product-card__img--placeholder">Sin imagen</div>
        )}
      </div>

      <div className="product-card__body">
        {badge ? <span className="product-card__chip">{badge}</span> : null}

        <div className="product-card__priceRow">
          <span className="product-card__price">{fmtCLP(displayPrice)}</span>
          {variant !== "history" && previousPrice ? (
            <span className="product-card__pricePrev">
              {fmtCLP(previousPrice)}
            </span>
          ) : null}
        </div>

        <div className="product-card__title">{title}</div>
        {pricePerSubUnit ? (
          <div className="product-card__unit">{fmtCLP(pricePerSubUnit)}/un</div>
        ) : null}
        {store ? <div className="product-card__store">{store}</div> : null}

        {variant === "history" && (
          <small className="product-card__lastSeen">
            Visto por última vez:{" "}
            {lastSeenAt ? new Date(lastSeenAt).toLocaleString("es-CL") : "-"}
          </small>
        )}

        <div className="product-card__actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={openProduct}
          >
            Ver
          </button>

          {showAddButton && (
            <button
              type="button"
              onClick={addToHistory}
              disabled={loading || added}
              className="btn btn-dark"
            >
              {added ? "Agregado" : loading ? "Agregando…" : "Agregar"}
            </button>
          )}

          {!!onDelete && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Eliminar
            </button>
          )}

          {err ? (
            <small
              className="product-card__msg-error"
              style={{ color: "crimson", display: "block" }}
            >
              {err}
            </small>
          ) : null}
        </div>
      </div>
    </a>
  );
}
