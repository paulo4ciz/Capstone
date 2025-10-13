// api/shared/adapters/acuenta/mappers.js
import { normalizeProduct} from "../../normalize.js"

export function mapAcuentaProduct(p) {
  const img = Array.isArray(p.photosUrl) ? (p.photosUrl[0] || "") : "";
  const url = p.slug ? `https://www.acuenta.cl/p/${p.slug}` : "https://www.acuenta.cl";
  return normalizeProduct({
    title: p.name,
    price: p.price,
    imageUrl: img,
    productUrl: url,
    store: "ACuenta",
  });
}
