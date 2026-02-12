/**
 * Dynamic test server that serves govform-lab HTML files on both GET and POST.
 * This lets browsy follow form submissions through multi-page flows.
 */

import { createServer, type Server, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// test/fixtures/ → ../.. = project root → .. = C:\Users\Cade\projects
const GOVFORM_DIR =
  process.env.GOVFORM_DIR ?? join(__dirname, "../../../agentbrowser/benchmark/govform-lab");

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
};

/**
 * Create a govform-lab server that handles both GET and POST.
 * POST requests serve the same file as GET (simulating form submission → next page).
 */
export function createGovformServer(port = 0) {
  let server: Server;

  server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url ?? "/", `http://localhost`);
    let path = url.pathname;

    // Default to index.html
    if (path === "/") path = "/index.html";

    // Resolve to file on disk
    const filePath = join(GOVFORM_DIR, path);
    const ext = extname(filePath);
    const contentType = MIME[ext] ?? "text/html";

    try {
      const content = await readFile(filePath, "utf-8");
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(`Not found: ${path}`);
    }
  });

  return {
    server,
    start(): Promise<number> {
      return new Promise((resolve) => {
        server.listen(port, "127.0.0.1", () => {
          const addr = server.address();
          const actualPort = typeof addr === "object" && addr ? addr.port : port;
          resolve(actualPort);
        });
      });
    },
    stop(): Promise<void> {
      return new Promise((resolve) => {
        server.close(() => resolve());
      });
    },
  };
}
