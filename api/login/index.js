// api/login/index.js
import { CosmosClient } from "@azure/cosmos";
import bcrypt from "bcryptjs";

const client = new CosmosClient(process.env.COSMOS_CONN);
const db = client.database(process.env.COSMOS_DB);
const users = db.container(process.env.COSMOS_USERS_CONTAINER);

function bad(status, msg) {
  return {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: { error: msg }
  };
}
function ok(body) {
  return {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body
  };
}
function isEmail(x = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(x).toLowerCase());
}

export default async function (context, req) {
  try {
    if (req.method !== "POST") {
      context.res = bad(405, "Método no permitido");
      return;
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { email, password } = body;

    if (!isEmail(email) || !password) {
      context.res = bad(400, "Credenciales inválidas");
      return;
    }

    const emailLc = String(email).toLowerCase();

    // Buscar usuario por email
    const { resources } = await users.items
      .query({
        query:
          "SELECT c.id, c.name, c.email, c.passwordHash, c.roles, c.status, c.createdAt FROM c WHERE c.email = @e",
        parameters: [{ name: "@e", value: emailLc }]
      })
      .fetchAll();

    const u = resources[0];
    if (!u || u.status === "blocked") {
      context.res = bad(401, "Correo o contraseña incorrectos");
      return;
    }

    const okPass = await bcrypt.compare(String(password), u.passwordHash || "");
    if (!okPass) {
      context.res = bad(401, "Correo o contraseña incorrectos");
      return;
    }

    // Éxito: no devolver passwordHash
    context.res = ok({
      ok: true,
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        roles: u.roles || ["user"],
        createdAt: u.createdAt
      }
    });
  } catch (err) {
    context.log.error("login error:", err);
    context.res = bad(500, "internal_error");
  }
}
