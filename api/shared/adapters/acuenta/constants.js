//api/shared/adapters/acuenta/constants.js
export const INSTALEAP_URL = "https://nextgentheadless.instaleap.io/api/v3";

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