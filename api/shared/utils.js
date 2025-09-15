export function okJson(res, data) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).end(JSON.stringify(data));
}
export function badRequest(res, msg="Bad Request") {
  res.status(400).end(JSON.stringify({ error: msg }));
}
export function serverError(res, msg="Internal Server Error") {
  res.status(500).end(JSON.stringify({ error: msg }));
}

export const UA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "es-CL,es;q=0.9,en;q=0.8",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
  "Upgrade-Insecure-Requests": "1",
  "Referer": "https://www.lider.cl/",
};
