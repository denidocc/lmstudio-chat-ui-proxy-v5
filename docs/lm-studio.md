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

## How it actually works — UI flow

The browser never calls LM Studio directly. Every LM Studio request goes through this app’s proxy (`/proxy/*?base=<your LM Studio URL>`), which avoids CORS issues and allows LAN clients to use the same UI.

### Connect

When you click **Connect** (or **Refresh**, which runs the same logic):

1. The UI saves **Server URL** and **API token** to `localStorage`.
2. It sends `GET /proxy/api/v1/models?base=...` → LM Studio lists all models.
3. The model dropdown is filled with **LLM models only** — FLUX / diffusion models are filtered out (they belong in ComfyUI; see [images.md](./images.md)).
4. Model metadata is shown in the sidebar. Status line reports total models, chat-capable LLMs, hidden image models, and how many are already loaded in LM Studio.
5. Chat input stays disabled until you **select a model** from the dropdown.

Connect does **not** load a model into GPU memory. It only discovers what LM Studio exposes.

### Select model

Choosing a model from the dropdown:

- Saves `lm_selected_model` to `localStorage`.
- Clears `previousResponseId` on the active chat (switching models starts a fresh conversation chain on the LM Studio side).
- Updates the model info panel.

### Load model

**Load model** calls `POST /api/v1/models/load` with the selected model’s key, then **Connect** runs again to refresh the list. Use this when LM Studio shows the model as available but not loaded into memory.

**Reload model** (same button when the model is already loaded) first unloads every existing instance via `POST /api/v1/models/unload` using each `loaded_instances[].id`, then loads one fresh instance. This prevents duplicate copies such as `model`, `model:2`, `model:3` in LM Studio.

FLUX / diffusion models cannot be loaded for chat — if one somehow appears selected, the UI shows an error instead of calling load.

### Send message (chat)

When you submit a message in **Chat** mode:

1. Your text is appended to the active chat in the UI and saved to `localStorage`.
2. The UI builds `POST /api/v1/chat` with model key, temperature, max tokens, optional system prompt, and `previous_response_id` for continuity.
3. If a vision image is attached in the composer, the payload includes a `data_url` image part (vision models only).
4. LM Studio returns the assistant text; the UI renders it as Markdown.
5. `response_id` from LM Studio is stored on the chat as `previousResponseId` for the next turn.
6. Token/stats from the response may appear in the stats panel.
7. Attached vision image is cleared after a successful reply.

Nothing in this flow touches ComfyUI.

### Chat / Image mode switch

The chat header has a **Chat | Image** toggle. Each chat stores its mode in `composerMode` (`"chat"` or `"image"`).

When you switch modes, a **system message** appears in the feed warning that LM Studio and ComfyUI use different models and do not share context. System messages are local UI only — they are not sent to LM Studio or ComfyUI.

| Mode | Composer | API |
|------|----------|-----|
| Chat | Send + optional vision attach | LM Studio `/api/v1/chat` |
| Image | Generate (prompt only) | ComfyUI `/prompt` |

In **Image** mode, negative prompt, width, height, steps, and seed remain in the sidebar **ComfyUI settings** panel.

### Vision (image input)

Vision is **understanding**, not generation:

1. In **Chat** mode, attach PNG / JPEG / WebP via the 📎 button in the composer (max 8 MB, stored as a data URL in memory).
2. A compact preview appears above the input; remove it before sending if needed.
3. Send a text message as usual.
4. If the selected model does not support vision, the request fails before calling LM Studio.

To **generate** new images, switch to **Image** mode and use **Generate**: [comfyui.md](./comfyui.md).

### LM Studio vs ComfyUI

| Action | Service |
|--------|---------|
| Chat, system prompt, parameters | LM Studio |
| Describe / answer about an attached image | LM Studio (vision LLM) |
| Generate image from workflow | ComfyUI (settings in sidebar, prompt + Generate in chat) |

Both can run at the same time; they are independent. **Use last answer** (Image mode) copies the last assistant text into the composer prompt locally.

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

Vision-capable models accept an image attached in the composer (Chat mode only).

```text
Vision = image understanding (not generation)
```

Image generation is handled separately by ComfyUI in Image mode: [images.md](./images.md), [comfyui.md](./comfyui.md)

---

## Chat history

Chats are stored in browser `localStorage` under key `lm_chats_v5`.

Each chat object:

| Field | Description |
|-------|-------------|
| `id` | Unique chat id |
| `title` | Auto-set from first message or "New chat" |
| `messages` | Role + content (+ optional `imageUrl` for generated images) |
| `previousResponseId` | LM Studio response id for context chaining |
| `composerMode` | `"chat"` or `"image"` |
| `createdAt` | ISO timestamp |
| `updatedAt` | ISO timestamp |
| `modelKey` | Last used model |

Use **New chat**, the history sidebar (click a row to open; **×** to delete any chat), or **Delete chat** in the Model panel to manage sessions.

History is local to the browser — it is not synced to the server or LM Studio.

---

## Browser storage (`localStorage`)

Settings and chat data persist in the browser on this device only. Clearing site data removes them.

| Key | Content |
|-----|---------|
| `lm_base_url` | LM Studio server URL |
| `lm_api_token` | LM Studio API token (if used) |
| `lm_selected_model` | Last selected model key |
| `lm_chats_v5` | JSON array of all chat sessions |
| `lm_active_chat_id_v5` | Id of the currently open chat |
| `lm_comfy_url` | ComfyUI base URL |
| `lm_comfy_workflow_api_json` | Workflow JSON textarea |
| `lm_comfy_prompt_path` | Dot path for positive prompt |
| `lm_comfy_negative_path` | Dot path for negative prompt |
| `lm_comfy_seed_path` | Dot path for seed |
| `lm_comfy_steps_path` | Dot path for steps |
| `lm_comfy_width_path` | Dot path for width |
| `lm_comfy_height_path` | Dot path for height |

ComfyUI keys are written when you click **Load FLUX workflow**, **Save workflow**, or **Test ComfyUI**. Chat keys update on every message and history change.

Generated ComfyUI image URLs are stored on assistant messages in `localStorage` as proxy URLs (`/comfy-proxy/view?...`). They remain valid while ComfyUI still serves those output files.

System prompt, temperature, and max tokens are **not** stored in `localStorage`; they reset when you reload the page unless you re-enter them.

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
