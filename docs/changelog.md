# Changelog — v5

[← Documentation index](./README.md)

---

## LM Studio LAN Chat UI — proxy v5

### UI & layout

- Chat area is no longer fixed height — it grows naturally with content
- Removed sticky / right-fixed chat layout
- Sidebar panels use collapsible `<details>` blocks

### Chat

- Markdown rendering for assistant replies
- Vision image attachment for models with `Vision: true`
- Export current chat to `.md`, `.json`, and `.html`

### Models

- FLUX / image / diffusion models hidden from the chat model dropdown
- Model metadata panel (vision, tools, reasoning, context, etc.)

### ComfyUI

- New **ComfyUI / images** panel
- Workflow API JSON editor with parameter path mapping
- Built-in FLUX.2 Klein workflow template
- Image generation via `/comfy-proxy/*`

### Infrastructure

- CORS-free proxy for LM Studio (`/proxy/*`) and ComfyUI (`/comfy-proxy/*`)
- Multi-chat history in `localStorage`
- LAN access on `0.0.0.0`
- Launch scripts for Windows, macOS, and Linux
- `/health` endpoint

---

## Documentation (v5 docs pass)

- English documentation split into topic files under `docs/`
- See [docs/README.md](./README.md) for the full index
