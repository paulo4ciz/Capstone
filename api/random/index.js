// api/random/index.js
import { randomProducts } from "../shared/services.js";

export default async function (context, req) {
  try {
    const limit = Number(req.query.limit || 12);   // 👈 por defecto 12
    const stores = req.query.stores || "";         // CSV opcional (ej: "acuenta")
    const kind = req.query.kind || "basic";        // 👈 colección "canasta básica"

    const data = await randomProducts(limit, stores, kind);

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: data
    };
  } catch (e) {
    context.log.error("random error:", e);
    context.res = { status: 500, body: { error: "internal_error" } };
  }
}
