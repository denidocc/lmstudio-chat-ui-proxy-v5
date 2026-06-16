# Configuration

[← Documentation index](./README.md)

---

## UI server

| Setting | Default |
|---------|---------|
| Host | `0.0.0.0` (all interfaces, LAN-ready) |
| Port | `8080` |

Local URL:

```text
http://localhost:8080
```

Health check:

```text
http://localhost:8080/health
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

---

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `8080` | UI server port |
| `LMSTUDIO_URL` | `http://192.168.10.175:1234` | Fallback LM Studio base URL for `/proxy/*` when the client omits `?base=` |
| `COMFY_URL` | `http://127.0.0.1:8188` | Fallback ComfyUI base URL for `/comfy-proxy/*` when the client omits `?base=` |

Example:

```bash
PORT=8080 LMSTUDIO_URL=http://127.0.0.1:1234 node server.js
```

On Windows (cmd):

```bat
set PORT=8080
set LMSTUDIO_URL=http://127.0.0.1:1234
node server.js
```

The UI also stores LM Studio URL, API token, and ComfyUI settings in browser `localStorage`.

---

## LM Studio URL

Set in the UI sidebar under **LM Studio address**.

Common values:

```text
http://127.0.0.1:1234
http://192.168.x.x:1234
```

Use the address shown in LM Studio → Local Server.

---

## API token

Optional. Required only when LM Studio authentication is enabled.

Enter the token in the UI. The client sends it as:

```text
Authorization: Bearer <token>
```

---

## ComfyUI URL

Set in the **ComfyUI / images** panel.

Default:

```text
http://127.0.0.1:8188
```

See [comfyui.md](./comfyui.md) for workflow setup.

---

## Proxy base URL parameter

The browser does not call LM Studio or ComfyUI directly. It uses the local proxy:

```text
/proxy/<path>?base=<url-encoded-target>
/comfy-proxy/<path>?base=<url-encoded-target>
```

The `base` query parameter overrides server defaults. Details: [api.md](./api.md)

---

## Related docs

- [Getting started](./getting-started.md)
- [API reference](./api.md)
- [LM Studio](./lm-studio.md)
