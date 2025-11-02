import { CosmosClient } from "@azure/cosmos";

function maskConn(conn) {
  if (!conn) return null;
  // Extrae solo el host del endpoint (no incluye la key):
  const m = conn.match(/AccountEndpoint=([^;]+)/i);
  const endpoint = m?.[1] || null;
  let endpointHost = null;
  try { endpointHost = endpoint ? new URL(endpoint).host : null; } catch {}
  return { endpointHost };
}

export default async function (context, req) {
  try {
    const present = {
      COSMOS_CONN: !!process.env.COSMOS_CONN,
      COSMOS_DB: !!process.env.COSMOS_DB,
      COSMOS_USERS_CONTAINER: !!process.env.COSMOS_USERS_CONTAINER,
      COSMOS_USER_PRODUCTS_CONTAINER: !!process.env.COSMOS_USER_PRODUCTS_CONTAINER
    };

    // No devolvemos la key; solo el host del endpoint
    const masked = maskConn(process.env.COSMOS_CONN);

    // Prueba real de conexión y lectura de metadatos
    let dbOk = false, usersOk = false, upOk = false;
    if (process.env.COSMOS_CONN) {
      const client = new CosmosClient(process.env.COSMOS_CONN);
      const db = client.database(process.env.COSMOS_DB);
      await db.read(); dbOk = true;

      const users = db.container(process.env.COSMOS_USERS_CONTAINER);
      await users.read(); usersOk = true;

      const up = db.container(process.env.COSMOS_USER_PRODUCTS_CONTAINER);
      await up.read(); upOk = true;
    }

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: { ok: true, present, cosmos: masked, dbOk, usersOk, userProductsOk: upOk }
    };
  } catch (err) {
    context.log.error("diag error:", err);
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: { ok: false, error: err?.message || String(err) }
    };
  }
}
