import { CosmosClient } from "@azure/cosmos";

export default async function (context, req) {
  try {
    const envs = ["COSMOS_CONN","COSMOS_DB","COSMOS_USERS_CONTAINER","COSMOS_USER_PRODUCTS_CONTAINER"];
    const vars = Object.fromEntries(envs.map(k => [k, !!process.env[k]]));

    let ping = null, dbOk = false, contUsersOk = false, contUPOk = false;

    if (process.env.COSMOS_CONN) {
      const client = new CosmosClient(process.env.COSMOS_CONN);

      // lee DB y contenedores para validar nombres
      const db = client.database(process.env.COSMOS_DB);
      await db.read(); dbOk = true;

      const users = db.container(process.env.COSMOS_USERS_CONTAINER);
      await users.read(); contUsersOk = true;

      const up = db.container(process.env.COSMOS_USER_PRODUCTS_CONTAINER);
      await up.read(); contUPOk = true;

      ping = { ok: true };
    }

    context.res = { status: 200, body: { ok: true, vars, dbOk, contUsersOk, contUPOk, ping } };
  } catch (err) {
    context.log.error("diag error:", err);
    context.res = { status: 500, body: { ok: false, error: err?.message || String(err) } };
  }
}
