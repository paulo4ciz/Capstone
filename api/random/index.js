// api/random/index.js
import { randomProducts } from "../shared/services.js";

export default async function (context, req) {
  const limit = Number(req.query.limit || 24);

  const data = await randomProducts(limit);

  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: data,
  };
}
