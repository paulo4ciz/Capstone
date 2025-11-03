import { normalizeProduct } from "../../normalize.js";
import { STORE_BASE } from "./constants.js";

export function mapCentralMayoristaProduct(p) {
  const img = Array.isArray(p.photosUrl) ? (p.photosUrl[0] || "") : "";
  const url = p.slug ? `${STORE_BASE}/p/${p.slug}` : STORE_BASE;

  return normalizeProduct({
    title: p.name,
    price: p.price,
    imageUrl: img,
    productUrl: url,
    store: "Central Mayorista",
  });
}
