// api/shared/adapters/acuenta/queries.js

export function buildVariables(q) {
  return {
    searchProductsInput: {
      clientId: "SUPER_BODEGA",
      storeReference: "580",
      currentPage: 1,
      minScore: 1,
      pageSize: 24,
      filters: {},
      googleAnalyticsSessionId: "",
      search: [{ query: q }],
    },
  };
}
