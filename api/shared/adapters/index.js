// api/shared/adapters/index.js
import { scrapeACuenta } from "./acuenta/index.js";
//import { scrapeLider } from "./lider/index.js";
//import { scrapeJumbo } from "./jumbo/index.js";

export const ADAPTERS = {
  acuenta: scrapeACuenta,
  //lider: scrapeLider,
  //jumbo: scrapeJumbo
};
