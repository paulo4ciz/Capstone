export function buildVariables(q) {
  return {
    searchProductsInput: {
      clientId: "CENTRAL_MAYORISTA",
      storeReference: "159",
      currentPage: 1,
      minScore: 1,
      pageSize: 24,            // puedes subir a 100 si quieres más resultados
      filters: {},
      googleAnalyticsSessionId: "",
      search: [{ query: q }],
    },
  };
}
