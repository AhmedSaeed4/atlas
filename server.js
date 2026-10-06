import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, stat } from "node:fs/promises";

const publicRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "public");
const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
]);
const server = http.createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method || "")) {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url || "/", "http://127.0.0.1").pathname);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }
  const relative = path.normalize(pathname.replace(/^[/\\]+/, ""));
  let target = path.resolve(publicRoot, relative || "index.html");
  if (target !== publicRoot && !target.startsWith(publicRoot + path.sep)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    let details = await stat(target);
    if (details.isDirectory()) {
      target = path.join(target, "index.html");
      details = await stat(target);
    }
    if (!details.isFile()) throw new Error("Not a file");
    const body = request.method === "HEAD" ? null : await readFile(target);
    response.writeHead(200, {
      "Content-Type": mimeTypes.get(path.extname(target).toLowerCase()) || "application/octet-stream",
      "Content-Length": details.size,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    });
    if (body) response.end(body);
    else response.end();
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
});
const port = Number(process.env.PORT || 4173);
server.listen(port, "127.0.0.1", () => {
  process.stdout.write("Project Atlas ready at http://127.0.0.1:" + port + "\n");
});
