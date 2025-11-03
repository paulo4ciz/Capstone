// api/random/index.js
import { randomProducts } from "../shared/services.js";

export default async function (context, req) {
  try {
    const limit = Number(req.query?.limit ?? 12);
    const kind = String(req.query?.kind ?? "basic");
    const stores = req.query?.stores ?? ""; // "acuenta,centralmayorista"

    // Pasa 'stores' tal cual; services.js ya los parsea
    const data = await randomProducts(limit, stores, kind);

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(data),
    };
  } catch (e) {
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: "internal_error", detail: String(e) }),
    };
  }
}
