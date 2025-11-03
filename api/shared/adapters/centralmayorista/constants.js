export const INSTALEAP_URL = "https://nextgentheadless.instaleap.io/api/v3";

// Dominio base de la tienda (ajusta si difiere)
export const STORE_BASE = "https://www.centralmayorista.cl";

// Query mínima (igual a ACuenta) — solo los campos que usamos en la UI
export const GRAPHQL_QUERY = `
  query SearchProducts($searchProductsInput: SearchProductsInput!) {
    searchProducts(searchProductsInput: $searchProductsInput) {
      products {
        name
        price
        photosUrl
        slug
      }
      pagination { page pages }
    }
  }
`;
