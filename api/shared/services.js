// api/shared/services.js
import pRetry from "p-retry";
import { ADAPTERS } from "./adapters/index.js";
import { getCache, setCache } from "./cache.js";

// Catálogo dinámico de tiendas (evita staleness si cambias ADAPTERS)
const availableStores = () => Object.keys(ADAPTERS);
const DEFAULT_STORES = () => {
  const keys = availableStores();
  return keys.length ? [...keys] : ["acuenta"];
};

async function withRetry(fn) {
  return pRetry(fn, { retries: 2, factor: 2, minTimeout: 300 });
}

function normalizeSlug(s) {
  return String(s || "").trim().toLowerCase();
}

function parseStores(stores) {
  const valid = new Set(availableStores());
  if (!stores) return DEFAULT_STORES();

  if (Array.isArray(stores)) {
    const list = stores.map(normalizeSlug).filter((s) => valid.has(s));
    return Array.from(new Set(list)); // dedup
  }

  // CSV -> array filtrado por stores válidas
  const list = String(stores)
    .split(",")
    .map(normalizeSlug)
    .filter((s) => valid.has(s));

  return Array.from(new Set(list)); // dedup
}

export async function searchAllStores(q, stores = []) {
  const list = parseStores(stores);
  const storesKey = list.slice().sort().join(",") || "none";
  const cacheKey = `search:${storesKey}:${(q || "").toLowerCase()}`;

  const cached = getCache(cacheKey);
  if (cached) return cached;

  const settled = await Promise.allSettled(
    list.map((s) => withRetry(() => ADAPTERS[s](q)))
  );

  const data = settled.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  setCache(cacheKey, data);
  return data;
}

// -----------------------------
// CANASTA BÁSICA (12 productos)
// -----------------------------
const CANASTA_SEEDS = [
  "arroz",
  "fideos",
  "aceite",
  "leche",
  "huevos",
  "pan",
  "azúcar",
  "sal",
  "harina",
  "porotos",
  "lentejas",
  "atun",
];

function uniqueBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    const k = keyFn(it);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(it);
    }
  }
  return out;
}

function shuffle(arr) {
  // Fisher–Yates
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * randomProducts: variedad real (completamente al azar)
 * - Consulta TODAS las seeds en paralelo
 * - Junta, mezcla, deduplica y devuelve 'limit' items
 * - Respeta 'stores' si lo pasas (?stores=acuenta,otra)
 * - 'kind' queda reservado por si luego agregamos otras colecciones
 */
export async function randomProducts(limit = 12, stores = [], kind = "basic") {
  const list = parseStores(stores);

  // 1) pedir en paralelo todas las seeds de la canasta
  const settled = await Promise.allSettled(
    CANASTA_SEEDS.map((q) => searchAllStores(q, list))
  );

  // 2) juntar todos los resultados que salieron bien
  let all = settled.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

  // 3) si no hay nada, devolver fallback para la UI
  if (!all.length) {
    return [
      {
        id: "mock1",
        title: "Arroz (demo)",
        price: 1190,
        currency: "CLP",
        imageUrl: "/hand.png",
        productUrl: "#",
        store: "Mock",
        scrapedAt: new Date().toISOString(),
      },
      {
        id: "mock2",
        title: "Aceite (demo)",
        price: 2290,
        currency: "CLP",
        imageUrl: "/hand.png",
        productUrl: "#",
        store: "Mock",
        scrapedAt: new Date().toISOString(),
      },
    ].slice(0, limit);
  }

  // 4) mezclar y deduplicar
  all = shuffle(all);
  const dedup = uniqueBy(all, (p) => p.productUrl || `${p.store}:${p.title}`);

  // 5) cortar al límite y devolver
  return dedup.slice(0, limit);
}
