// api/me-products-delete/index.js
import { CosmosClient } from "@azure/cosmos";

const client = new CosmosClient(process.env.COSMOS_CONN);
const db = client.database(process.env.COSMOS_DB);
const userProducts = db.container(process.env.COSMOS_USER_PRODUCTS_CONTAINER || "user_products");

function res(status, body) {
  return {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body
  };
}

export default async function (context, req) {
  try {
    if (req.method !== "DELETE") {
      context.res = res(405, { error: "Método no permitido" });
      return;
    }

    const id = req.params?.id;
    const userId = (req.query?.userId || "").trim(); // PK

    if (!id || !userId) {
      context.res = res(400, { error: "id y userId son obligatorios" });
      return;
    }

    // Borrado por id + PK (/userId)
    await userProducts.item(id, userId).delete();

    context.res = res(200, { ok: true, id });
  } catch (err) {
    // Si no existe, responde 404
    if (err.code === 404 || err.code === "NotFound") {
      context.res = res(404, { error: "No encontrado" });
      return;
    }
    context.log.error("me-products-delete error:", err);
    context.res = res(500, { error: "internal_error" });
  }
}
