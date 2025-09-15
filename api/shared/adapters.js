// api/shared/adapters.js
// ESM activado porque en api/package.json tienes "type": "module"

import { UA } from "./utils.js";
import { normalizeProduct } from "./normalize.js";

// =============================
// ACuenta vía GraphQL (Instaleap)
// =============================
const INSTALEAP_URL = "https://nextgentheadless.instaleap.io/api/v3";

/**
 * Query mínima necesaria (mantiene operationName = SearchProducts).
 * Está reducida a los campos que necesitamos para el listado.
 */
const GRAPHQL_QUERY = `
  query SearchProducts($searchProductsInput: SearchProductsInput!) {
    searchProducts(searchProductsInput: $searchProductsInput) {
      products {
        name
        price
        photosUrl
        slug
      }
      pagination { page pages }
    }
  }
`;

/**
 * Variables según el payload real que viste en Network.
 * - clientId: "SUPER_BODEGA"
 * - storeReference: "580"
 * - currentPage: 1
 * - pageSize: 24 (puedes subir a 100 si quieres más resultados)
 * - search: [{ query: q }]
 */
function buildVariables(q) {
  return {
    searchProductsInput: {
      clientId: "SUPER_BODEGA",
      storeReference: "580",
      currentPage: 1,
      minScore: 1,
      pageSize: 24,
      filters: {},
      googleAnalyticsSessionId: "",
      search: [{ query: q }]
    }
  };
}

/**
 * Mapeo de un producto del GQL al formato de tu UI
 */
function mapAcuentaProduct(p) {
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

/**
 * Scraper principal (sin Playwright, solo JSON)
 */
export async function scrapeACuenta(q) {
  const payload = {
    operationName: "SearchProducts",
    query: GRAPHQL_QUERY,
    variables: buildVariables(q),
  };

  const headers = {
    ...UA,
    "content-type": "application/json",
    // Headers que viste en Network; estos ayudan a que el backend acepte la request.
    "apollographql-client-name": "Ecommerce SSR",
    "apollographql-client-version": "0.11.0",
    "origin": "https://www.acuenta.cl",
    "referer": "https://www.acuenta.cl/",
    // Si en tu request original venía un header `token` con valor, agrégalo aquí:
    // "token": "<TU_TOKEN>",
  };

  const r = await fetch(INSTALEAP_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(`ACuenta GQL ${r.status}: ${txt.slice(0,200)}`);
  }

  const json = await r.json();
  const items = json?.data?.searchProducts?.products || [];
  return items.map(mapAcuentaProduct).filter(x => x.title && x.price);
}

/**
 * Catálogo de adapters habilitados
 */
export const ADAPTERS = {
  acuenta: scrapeACuenta,
};
