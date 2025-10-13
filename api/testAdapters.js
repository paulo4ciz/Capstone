import { ADAPTERS } from "./shared/adapters/index.js";

async function testAdapters() {
  const query = "arroz"; // prueba con cualquier producto

  for (const store of Object.keys(ADAPTERS)) {
    try {
      console.log(`\n=== Probando store: ${store} ===`);
      const products = await ADAPTERS[store](query);
      console.log(`Cantidad de productos de ${store}:`, products.length);
      console.log(products.slice(0, 3)); // muestra solo los 3 primeros
    } catch (e) {
      console.error(`Error al consultar ${store}:`, e.message);
    }
  }
}

testAdapters();
