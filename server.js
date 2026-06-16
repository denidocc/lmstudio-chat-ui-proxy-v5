const http = require("http");
const https = require("https");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 8080);
const PUBLIC_DIR = path.join(__dirname, "public");
const DEFAULT_LMSTUDIO_URL = process.env.LMSTUDIO_URL || "http://192.168.10.175:1234";
const DEFAULT_COMFY_URL = process.env.COMFY_URL || "http://127.0.0.1:8188";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    ...headers,
  });
  res.end(body);
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data, null, 2));
}

function getLanUrls(port) {
  const interfaces = os.networkInterfaces();
  const urls = [];

  for (const items of Object.values(interfaces)) {
    for (const item of items || []) {
      if (item.family === "IPv4" && !item.internal) {
        urls.push(`http://${item.address}:${port}`);
      }
    }
  }

  return urls;
}

function serveStatic(req, res) {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  if (pathname === "/") pathname = "/index.html";

  const filePath = path.normalize(path.join(PUBLIC_DIR, pathname));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    return send(res, 403, "Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, "Not found");

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
}

function proxyRequest(req, res, prefix, defaultBaseUrl) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    return res.end();
  }

  const incomingUrl = new URL(req.url, `http://${req.headers.host}`);
  const base = incomingUrl.searchParams.get("base") || defaultBaseUrl;

  let baseUrl;
  try {
    baseUrl = new URL(base);
  } catch {
    return send(res, 400, "Invalid proxy base URL");
  }

  if (!["http:", "https:"].includes(baseUrl.protocol)) {
    return send(res, 400, "Only http/https proxy URLs are allowed");
  }

  const targetPath = incomingUrl.pathname.replace(new RegExp(`^${prefix}`), "") || "/";
  incomingUrl.searchParams.delete("base");

  const query = incomingUrl.searchParams.toString();
  const targetUrl = new URL(targetPath + (query ? `?${query}` : ""), baseUrl);

  const client = targetUrl.protocol === "https:" ? https : http;

  const headers = { ...req.headers };
  delete headers.host;
  delete headers.origin;
  delete headers.referer;
  delete headers.connection;
  delete headers["content-length"];

  const proxyReq = client.request(
    targetUrl,
    {
      method: req.method,
      headers,
    },
    (proxyRes) => {
      const responseHeaders = { ...proxyRes.headers };

      delete responseHeaders["transfer-encoding"];
      delete responseHeaders.connection;
      delete responseHeaders["keep-alive"];

      responseHeaders["Access-Control-Allow-Origin"] = "*";

      res.writeHead(proxyRes.statusCode || 500, responseHeaders);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      error: {
        message: `Proxy cannot reach target server: ${err.message}`,
      },
    }));
  });

  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    return sendJson(res, 200, {
      ok: true,
      service: "lmstudio-chat-ui",
      port: PORT,
      defaultLmStudioUrl: DEFAULT_LMSTUDIO_URL,
      defaultComfyUrl: DEFAULT_COMFY_URL,
    });
  }

  if (req.url.startsWith("/proxy/")) {
    return proxyRequest(req, res, "/proxy", DEFAULT_LMSTUDIO_URL);
  }

  if (req.url.startsWith("/comfy-proxy/")) {
    return proxyRequest(req, res, "/comfy-proxy", DEFAULT_COMFY_URL);
  }

  return serveStatic(req, res);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error("");
    console.error(`Port ${PORT} is already in use.`);
    console.error("Another LM Studio Chat UI instance (or another app) is already running on this port.");
    console.error("");
    console.error("Options:");
    console.error("  1. Close the other terminal/window that runs this server");
    console.error(`  2. Or start on another port: set PORT=8081 && node server.js`);
    console.error("");
    process.exit(1);
  }

  throw err;
});

server.listen(PORT, "0.0.0.0", () => {
  const lanUrls = getLanUrls(PORT);

  console.log("");
  console.log("LM Studio Chat UI is running.");
  console.log(`Open on this PC: http://localhost:${PORT}`);
  if (lanUrls.length) {
    console.log("Open from another device on the same LAN:");
    for (const url of lanUrls) {
      console.log(`  ${url}`);
    }
  } else {
    console.log("LAN address was not detected. Check ipconfig for your IPv4 address.");
  }
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Default LM Studio URL: ${DEFAULT_LMSTUDIO_URL}`);
  console.log(`Default ComfyUI URL: ${DEFAULT_COMFY_URL}`);
  console.log("");
});
