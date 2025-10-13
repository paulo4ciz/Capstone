// src/components/ProductCard.jsx
export default function ProductCard({ product, className = "" }) {
  if (!product) return null;

  const {
    title = "",
    price = 0,
    imageUrl = "",
    productUrl = "#",
    store = "",
    // opcionales si algún adapter los trae:
    previousPrice,
    pricePerSubUnit,
    badge, // ej. "Precio Barato"
  } = product;

  const fmtCLP = (v) =>
    typeof v === "number"
      ? v.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })
      : `$${String(v).replace(/[^\d]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

  return (
    <a
      className={`product-card ${className}`}
      href={productUrl}
      target="_blank"
      rel="noreferrer"
      title={title}
    >
      <div className="product-card__img">
        {imageUrl ? (
          <img src={imageUrl} alt={title} loading="lazy" />
        ) : (
          <div className="product-card__img--placeholder">Sin imagen</div>
        )}
      </div>

      <div className="product-card__body">
        {/* Chip / badge opcional */}
        {badge ? <span className="product-card__chip">{badge}</span> : null}

        {/* Precio grande y, si existe, precio tachado */}
        <div className="product-card__priceRow">
          <span className="product-card__price">{fmtCLP(price)}</span>
          {previousPrice ? (
            <span className="product-card__pricePrev">{fmtCLP(previousPrice)}</span>
          ) : null}
        </div>

        {/* Título a 2 líneas */}
        <div className="product-card__title">{title}</div>

        {/* Precio por unidad (opcional) */}
        {pricePerSubUnit ? (
          <div className="product-card__unit">{fmtCLP(pricePerSubUnit)}/un</div>
        ) : null}

        {/* Tienda (pequeño) */}
        {store ? <div className="product-card__store">{store}</div> : null}
      </div>
    </a>
  );
}
