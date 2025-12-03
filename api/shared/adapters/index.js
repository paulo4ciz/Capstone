// api/shared/adapters/index.js
import { scrapeACuenta } from "./acuenta/index.js";
import { scrapeCentralMayorista } from "./centralmayorista/index.js";

export const ADAPTERS = {
  acuenta: scrapeACuenta,
  centralmayorista: scrapeCentralMayorista,
};
