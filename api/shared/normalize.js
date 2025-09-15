export function normalizeProduct({ title, price, imageUrl, productUrl, store }) {
  const priceNumber = typeof price === "number"
    ? price
    : Number(String(price).replace(/[^\d]/g, ""));
  return {
    id: productUrl || `${store}:${title}:${priceNumber}`,
    title: String(title || "").trim(),
    price: priceNumber,
    currency: "CLP",
    imageUrl: imageUrl || "",
    productUrl: productUrl || "",
    store: store || "desconocido",
    scrapedAt: new Date().toISOString()
  };
}
