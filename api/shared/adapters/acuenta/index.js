// api/shared/adapters/acuenta/index.js
import { UA } from "../../utils.js";
import { GRAPHQL_QUERY, INSTALEAP_URL } from "./constants.js";
import { buildVariables } from "./queries.js";
import { mapAcuentaProduct } from "./mappers.js";

export async function scrapeACuenta(q) {
  const payload = {
    operationName: "SearchProducts",
    query: GRAPHQL_QUERY,
    variables: buildVariables(q),
  };

  const headers = {
    ...UA,
    "content-type": "application/json",
    "apollographql-client-name": "Ecommerce SSR",
    "apollographql-client-version": "0.11.0",
    "origin": "https://www.acuenta.cl",
    "referer": "https://www.acuenta.cl/",
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
