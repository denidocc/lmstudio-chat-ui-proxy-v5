# LM Studio integration

[← Documentation index](./README.md)

---

## Overview

LM Studio acts as the local LLM server. The browser never calls it directly — requests go through the Node.js proxy to avoid CORS issues, including from LAN clients.

```text
Browser UI
    ↓
/proxy/*?base=...
    ↓
Node.js proxy
    ↓
LM Studio API
    ↓
Loaded model
```

Setup: [getting-started.md](./getting-started.md) · HTTP details: [api.md](./api.md)

---

## Default address

Local:

```text
http://127.0.0.1:1234
```

LAN example:

```text
http://192.168.x.x:1234
```

Set the address in the UI or via `LMSTUDIO_URL`. See [configuration.md](./configuration.md).

---

## Endpoints used

| Action | Method | Path |
|--------|--------|------|
| List models | `GET` | `/api/v1/models` |
| Load model | `POST` | `/api/v1/models/load` |
| Chat | `POST` | `/api/v1/chat` |

Request examples: [api.md](./api.md)

---

## Model list

After connecting, the UI loads all models from LM Studio.

**Chat dropdown** shows only LLM models. FLUX, diffusion, and similar image models are filtered out — see [images.md](./images.md).

### Metadata shown in the UI

- name / display name
- key
- publisher
- architecture
- parameters
- quantization
- context length
- loaded context
- vision support
- tool support
- reasoning support

Use **Load model** to load the selected model into memory if it is not already loaded.

---

## Chat

Messages are sent to `POST /api/v1/chat` with:

- selected model key
- user input (text or text + image)
- `temperature`, `max_output_tokens`
- optional `system_prompt`
- `store: true` and `previous_response_id` for conversation continuity

Assistant replies are rendered as Markdown in the chat area.

Parameters are configured in the **Parameters** panel (system prompt, temperature, max tokens).

---

## Vision models

Vision-capable models accept an image attached in the **Vision / image** panel.

```text
Vision = image understanding (not generation)
```

Image generation is handled separately by ComfyUI: [images.md](./images.md), [comfyui.md](./comfyui.md)

---

## Chat history

Chats are stored in browser `localStorage` under key `lm_chats_v5`.

Each chat object:

| Field | Description |
|-------|-------------|
| `id` | Unique chat id |
| `title` | Auto-set from first message or "New chat" |
| `messages` | Role + content pairs |
| `previousResponseId` | LM Studio response id for context chaining |
| `createdAt` | ISO timestamp |
| `updatedAt` | ISO timestamp |
| `modelKey` | Last used model |

Use **New chat**, the history sidebar, or **Delete chat** to manage sessions.

History is local to the browser — it is not synced to the server or LM Studio.

---

## Export

Export the active chat from **Files / export**:

| Format | Description |
|--------|-------------|
| `.md` | Markdown transcript |
| `.json` | Structured JSON |
| `.html` | Standalone HTML page |

Export runs entirely in the browser; files are saved on your device.

---

## Related docs

- [Getting started](./getting-started.md)
- [Configuration](./configuration.md)
- [Images & vision](./images.md)
- [API reference](./api.md)
