// api/me-products/index.js
import { CosmosClient } from "@azure/cosmos";
import { randomUUID } from "node:crypto";

const client = new CosmosClient(process.env.COSMOS_CONN);
const db = client.database(process.env.COSMOS_DB);
const userProducts = db.container(process.env.COSMOS_USER_PRODUCTS_CONTAINER || "user_products");

function bad(status, msg) {
  return {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: { error: msg }
  };
}
function ok(status, body) {
  return {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body
  };
}

export default async function (context, req) {
  try {
    // =========================
    // GET /api/me/products?userId=...&limit=100
    // =========================
    if (req.method === "GET") {
      const userId = (req.query?.userId || "").trim();
      const limit = Math.max(1, Math.min(500, Number(req.query?.limit || 100)));

      if (!userId) {
        context.res = bad(400, "userId es obligatorio");
        return;
      }

      const { resources } = await userProducts.items.query({
        query: "SELECT * FROM c WHERE c.userId = @u ORDER BY c.lastSeenAt DESC",
        parameters: [{ name: "@u", value: userId }]
      }).fetchAll();

      context.res = ok(200, { ok: true, items: resources.slice(0, limit) });
      return;
    }

    // =========================
    // POST /api/me/products
    // =========================
    if (req.method !== "POST") {
      context.res = bad(405, "Método no permitido");
      return;
    }

    // Parse body (Functions v3/4 no tienen req.json())
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const {
      userId,          // obligatorio
      productUrl,      // obligatorio
      title = "",
      imageUrl = "",
      store = "",
      currency = "CLP",
      price            // número o string con $
    } = body;

    if (!userId || !productUrl) {
      context.res = bad(400, "userId y productUrl son obligatorios");
      return;
    }

    const now = new Date().toISOString();
    const priceNum = typeof price === "number"
      ? price
      : Number(String(price || "").replace(/[^\d]/g, "") || 0);

    // Intento 1: crear (aprovecha la Unique Key (/userId, /productUrl))
    const doc = {
      id: randomUUID(),
      userId,
      productUrl,
      title: String(title),
      imageUrl: String(imageUrl),
      store: String(store),
      currency: String(currency || "CLP"),
      price: Number.isFinite(priceNum) ? priceNum : null,
      addedAt: now,
      lastSeenAt: now,
      priceHistory: Number.isFinite(priceNum) ? [{ price: priceNum, ts: now }] : []
    };

    try {
      await userProducts.items.create(doc);
      context.res = ok(201, { ok: true, item: doc, created: true });
      return;
    } catch (e) {
      // Si choca con Unique Key (duplicado), hacemos upsert manual
      if (e.code !== 409) throw e;
    }

    // Buscar existente por userId + productUrl
    const { resources } = await userProducts.items.query({
      query: "SELECT * FROM c WHERE c.userId = @u AND c.productUrl = @p",
      parameters: [
        { name: "@u", value: userId },
        { name: "@p", value: productUrl }
      ]
    }).fetchAll();

    const existing = resources[0];
    if (!existing) {
      // condición de carrera rara → reintentar create
      await userProducts.items.create(doc);
      context.res = ok(201, { ok: true, item: doc, created: true });
      return;
    }

    // Actualizar campos + historial de precios
    let change = "same";
    if (Number.isFinite(priceNum) && typeof existing.price === "number") {
      change = priceNum > existing.price ? "up" : priceNum < existing.price ? "down" : "same";
    }
    existing.lastSeenAt = now;

    if (Number.isFinite(priceNum)) {
      if (!Array.isArray(existing.priceHistory)) existing.priceHistory = [];
      existing.priceHistory.push({ price: priceNum, ts: now });
      existing.previousPrice = existing.price ?? priceNum;
      existing.price = priceNum;
    }

    existing.title = String(title || existing.title || "");
    existing.imageUrl = String(imageUrl || existing.imageUrl || "");
    existing.store = String(store || existing.store || "");
    existing.currency = String(currency || existing.currency || "CLP");

    // Reemplazar (usar PK = /userId)
    const { resource: updated } = await userProducts.item(existing.id, existing.userId).replace(existing);

    context.res = ok(200, { ok: true, item: updated, created: false, change });
  } catch (err) {
    context.log.error("me/products error:", err);
    context.res = bad(500, "internal_error");
  }
}
