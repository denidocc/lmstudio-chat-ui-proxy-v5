# LM Studio LAN Chat UI — proxy v5

A minimal web chat for LM Studio with a built-in CORS proxy, Markdown replies, vision input, chat export, and optional image generation through ComfyUI.

One Node.js server serves the UI and proxies requests to LM Studio and ComfyUI. No npm dependencies required.

---

## Features

- Chat with LM Studio via `/api/v1/chat`
- Model selection and loading
- Multiple chats stored in `localStorage`
- Markdown rendering for assistant replies
- Image attachment for vision models
- Export current chat to `.md`, `.json`, or `.html`
- Image generation through ComfyUI workflow API
- FLUX / image / diffusion models hidden from the chat model list
- LAN access from other devices on the same network

---

## Quick start

**Requirements:** Node.js LTS, LM Studio with Local Server enabled. ComfyUI is optional and only needed for image generation.

| Platform | Command |
|----------|---------|
| Windows | Double-click `start-windows.bat` |
| macOS | `./start-macos.command` or `npm start` |
| Linux | `./start-linux-macos.sh` or `node server.js` |

Open:

```text
http://localhost:8080
```

From another device on the LAN:

```text
http://your-ipv4-address:8080
```

---

## Documentation

Full docs live in [`docs/`](docs/README.md):

| Doc | For |
|-----|-----|
| [Getting started](docs/getting-started.md) | First-time setup on Windows, macOS, Linux |
| [Configuration](docs/configuration.md) | URLs, env vars, health check |
| [Images & vision](docs/images.md) | Vision input vs image generation |
| [LM Studio](docs/lm-studio.md) | Models, chat, history, export |
| [ComfyUI / FLUX](docs/comfyui.md) | Workflow setup and parameter paths |
| [API reference](docs/api.md) | UI server, proxy, endpoints |
| [Architecture](docs/architecture.md) | Project structure and components |
| [Changelog v5](docs/changelog.md) | What changed in this version |

---

## What's new in v5

See [docs/changelog.md](docs/changelog.md) for the full list.
