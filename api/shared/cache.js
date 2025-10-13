//api/shared/cache.js

import { LRUCache } from "lru-cache";

const ttl = 1000 * 60 * 30; // 30 min
export const cache = new LRUCache({ max: 1000, ttl });
export const getCache = (key) => cache.get(key);
export const setCache = (key, value) => cache.set(key, value);
