# Architecture

[← Documentation index](./README.md)

---

## Overview

```text
                Browser
                    │
                    ▼
            HTML + CSS + JS  (public/)
                    │
                    ▼
              Node.js server  (server.js)
              ├──────────────► LM Studio  (/proxy/*)
              │
              └──────────────► ComfyUI    (/comfy-proxy/*)
```

---

## Repository layout

```text
lmstudio-chat-ui-proxy-v5/
├── server.js              Node.js HTTP server + proxy
├── package.json
├── README.md
├── start-windows.bat
├── start-macos.command
├── start-linux-macos.sh
├── public/
│   ├── index.html         UI layout
│   ├── app.js             Client logic (~1400 lines)
│   └── style.css          Dark theme, responsive grid
└── docs/                  Documentation
```

---

## Technologies

| Layer | Stack |
|-------|-------|
| Frontend | HTML, CSS, vanilla JavaScript |
| Backend | Node.js (`http`, `https`, `fs`, `path`, `os`, `url`) |
| Dependencies | None — no npm packages |

---

## Design goals

- lightweight
- no npm packages
- no frontend frameworks
- cross-platform (Windows, macOS, Linux)
- LAN access from phones and other PCs
- local-first (chat history in `localStorage`)

---

## Server (`server.js`)

Responsibilities:

- serve static files from `public/`
- expose `/health`
- proxy LM Studio at `/proxy/*`
- proxy ComfyUI at `/comfy-proxy/*`
- listen on `0.0.0.0` for LAN access
- print LAN URLs on startup

---

## Client (`public/app.js`)

Single-file vanilla JS application. Main areas:

### Chat

- send prompts to LM Studio
- render Markdown replies
- chain context via `previous_response_id`

### Models

- fetch model list
- load models
- show metadata
- filter out FLUX / diffusion models from chat list

### History

- create, switch, and delete chats
- persist in `localStorage`

### Vision

- file upload and preview
- attach image to next message

### Image generation

- ComfyUI workflow editing
- parameter path mapping
- poll history until images are ready

### Export

- download active chat as Markdown, JSON, or HTML

---

## Data flow — chat message

```text
User types message
    → app.js builds POST /api/v1/chat body
    → fetch(/proxy/api/v1/chat?base=...)
    → server.js proxies to LM Studio
    → response parsed, Markdown rendered
    → message + previousResponseId saved to localStorage
```

---

## Data flow — image generation

```text
User clicks Generate
    → app.js patches workflow JSON by parameter paths
    → POST /comfy-proxy/prompt?base=...
    → ComfyUI queues workflow
    → app.js polls GET /history/<prompt_id>
    → images loaded via GET /view
    → displayed in ComfyUI panel
```

Details: [comfyui.md](./comfyui.md), [api.md](./api.md)

---

## Related docs

- [API reference](./api.md)
- [LM Studio integration](./lm-studio.md)
- [ComfyUI integration](./comfyui.md)
