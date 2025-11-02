// api/register/index.js  (ESM, Azure Functions v3)
import { CosmosClient } from "@azure/cosmos";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

// Reutiliza cliente entre invocaciones
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
    status: 201,
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

    // En Functions v3 el body viene en req.body (string u objeto)
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { name, email, password } = body;

    // Validaciones mínimas
    if (!name || !String(name).trim()) {
      context.res = bad(400, "Ingresa tu nombre");
      return;
    }
    if (!isEmail(email)) {
      context.res = bad(400, "Correo inválido");
      return;
    }
    if (!password || String(password).length < 6) {
      context.res = bad(400, "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const emailLc = String(email).toLowerCase();

    // Verificar duplicado (además de Unique Key en /email)
    const { resources: exists } = await users.items
      .query({
        query: "SELECT c.id FROM c WHERE c.email = @e",
        parameters: [{ name: "@e", value: emailLc }]
      })
      .fetchAll();

    if (exists.length > 0) {
      context.res = bad(409, "El correo ya está registrado");
      return;
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const doc = {
      id: randomUUID(),
      name: String(name).trim(),
      email: emailLc,
      passwordHash,
      roles: ["user"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active"
    };

    await users.items.create(doc);

    // Nunca regreses el hash
    context.res = ok({
      ok: true,
      user: {
        id: doc.id,
        name: doc.name,
        email: doc.email,
        roles: doc.roles,
        createdAt: doc.createdAt
      }
    });
  } catch (err) {
    if (err.code === 409) {
      context.res = bad(409, "El correo ya está registrado");
      return;
    }
    context.log.error("register error:", err);
    context.res = bad(500, "internal_error");

    
  }

  
}
