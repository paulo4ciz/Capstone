// api/search/index.js
import { searchAllStores } from "../shared/services.js";

export default async function (context, req) {
  const q = String(req.query.q || "").trim();
  const stores = String(req.query.stores || "")
    .split(",")
    .filter(Boolean);

  if (!q) {
    context.res = {
      status: 400,
      body: { error: "q requerido" },
    };
    return;
  }

  const data = await searchAllStores(q, stores);
  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: data,
  };
}
