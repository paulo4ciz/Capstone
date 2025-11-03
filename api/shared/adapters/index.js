// api/shared/adapters/index.js
import { scrapeACuenta } from "./acuenta/index.js";
import { scrapeCentralMayorista } from "./centralmayorista/index.js";
//import { scrapeLider } from "./lider/index.js";
//import { scrapeJumbo } from "./jumbo/index.js";

export const ADAPTERS = {
  acuenta: scrapeACuenta,
  centralmayorista: scrapeCentralMayorista,
  //lider: scrapeLider,
  //jumbo: scrapeJumbo
};
