// api/shared/services.js
import pRetry from "p-retry";
import { ADAPTERS } from "./adapters.js";
import { getCache, setCache } from "./cache.js";

// 👉 ahora solo tenemos mimarket
const DEFAULT_STORES = ["mimarket"];

async function withRetry(fn) {
  return pRetry(fn, { retries: 2, factor: 2, minTimeout: 300 });
}

export async function searchAllStores(q, stores = []) {
  const list = stores.length ? stores : DEFAULT_STORES;
  const cacheKey = `search:${list.sort().join(",")}:${(q || "").toLowerCase()}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const settled = await Promise.allSettled(
    list.map((s) => withRetry(() => ADAPTERS[s](q)))
  );
  const data = settled.flatMap((r) =>
    r.status === "fulfilled" ? r.value : []
  );

  setCache(cacheKey, data);
  return data;
}

export async function randomProducts(limit = 24) {
  const seeds = ["leche", "pan", "arroz", "aceite", "huevo", "fideos", "yogur", "azucar"];
  const q = seeds[Math.floor(Math.random() * seeds.length)];
  const data = await searchAllStores(q);
  return data.sort(() => 0.5 - Math.random()).slice(0, limit);
}
