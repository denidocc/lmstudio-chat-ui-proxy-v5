# API reference

[← Documentation index](./README.md)

HTTP endpoints for the UI server, proxy layer, and upstream APIs used by the application.

---

## UI server

The Node.js server listens on `0.0.0.0:8080` and serves static files from `public/`.

### Health check

```http
GET /health
```

Example response:

```json
{
  "ok": true,
  "service": "lmstudio-chat-ui",
  "port": 8080,
  "defaultLmStudioUrl": "http://192.168.10.175:1234",
  "defaultComfyUrl": "http://127.0.0.1:8188"
}
```

Use this to verify the UI server is running.

### Static files

```text
GET /
GET /index.html
GET /app.js
GET /style.css
```

---

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | UI server port |
| `LMSTUDIO_URL` | `http://192.168.10.175:1234` | Default LM Studio base for `/proxy/*` when `?base=` is omitted |
| `COMFY_URL` | `http://127.0.0.1:8188` | Default ComfyUI base for `/comfy-proxy/*` when `?base=` is omitted |

Example:

```bash
PORT=8080 LMSTUDIO_URL=http://127.0.0.1:1234 node server.js
```

See also: [configuration.md](./configuration.md)

---

## Node.js proxy

The proxy lets the browser reach LM Studio and ComfyUI without CORS errors, including from LAN devices.

### Format

```text
/proxy/<path>?base=<encoded-base-url>
/comfy-proxy/<path>?base=<encoded-base-url>
```

| Part | Meaning |
|------|---------|
| `<path>` | Target API path, e.g. `/api/v1/models` or `/prompt` |
| `base` | Full target server URL, URL-encoded |
| (fallback) | If `base` is omitted, env var or server default is used |

Examples:

```text
/proxy/api/v1/models?base=http%3A%2F%2F192.168.10.175%3A1234
/comfy-proxy/prompt?base=http%3A%2F%2F127.0.0.1%3A8188
/comfy-proxy/system_stats?base=http%3A%2F%2F127.0.0.1%3A8188
```

Supported methods: `GET`, `POST`, `OPTIONS`. Request body and headers are forwarded. Responses include `Access-Control-Allow-Origin: *`.

On target unreachable, the proxy returns `502`:

```json
{
  "error": {
    "message": "Proxy cannot reach target server: ..."
  }
}
```

### LM Studio proxy

```text
/proxy/*
```

Target: LM Studio, typically `http://127.0.0.1:1234` or `http://192.168.x.x:1234`.

### ComfyUI proxy

```text
/comfy-proxy/*
```

Target: ComfyUI, typically `http://127.0.0.1:8188`.

---

## LM Studio API

The browser calls these paths through `/proxy/...`. Paths below are on the LM Studio server.

Guide: [lm-studio.md](./lm-studio.md)

### List models

```http
GET /api/v1/models
```

Optional header: `Authorization: Bearer <token>`

### Load model

```http
POST /api/v1/models/load
Content-Type: application/json
```

Example body:

```json
{
  "model": "model-key-from-list",
  "echo_load_config": true
}
```

### Chat

```http
POST /api/v1/chat
Content-Type: application/json
```

Text message example:

```json
{
  "model": "model-key-from-list",
  "input": "Hello!",
  "stream": false,
  "store": true,
  "temperature": 0.7,
  "max_output_tokens": 1024,
  "system_prompt": "Reply briefly and clearly."
}
```

Vision message example:

```json
{
  "model": "vision-model-key",
  "input": [
    { "type": "message", "content": "What is in this image?" },
    { "type": "image", "data_url": "data:image/png;base64,..." }
  ],
  "stream": false,
  "store": true,
  "temperature": 0.7,
  "max_output_tokens": 1024
}
```

Continue a conversation:

```json
{
  "previous_response_id": "response-id-from-previous-answer"
}
```

---

## ComfyUI API

The browser calls these paths through `/comfy-proxy/...`. Paths below are on the ComfyUI server.

Guide: [comfyui.md](./comfyui.md)

Default URL:

```text
http://127.0.0.1:8188
```

### System stats

```http
GET /system_stats
```

Used by the **Test ComfyUI** button.

### Submit workflow

```http
POST /prompt
Content-Type: application/json
```

Example body:

```json
{
  "prompt": { "...": "workflow API JSON" },
  "client_id": "client-id"
}
```

### Queue

```http
GET /queue
```

### History

```http
GET /history/<prompt_id>
```

The UI polls history until the workflow completes.

### View image

```http
GET /view?filename=<name>&subfolder=<folder>&type=output
```

---

## Related docs

- [Architecture](./architecture.md)
- [Configuration](./configuration.md)
- [LM Studio](./lm-studio.md)
- [ComfyUI](./comfyui.md)
