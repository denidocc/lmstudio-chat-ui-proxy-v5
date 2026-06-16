# ComfyUI integration

[← Documentation index](./README.md)

Image generation through the ComfyUI workflow API. LM Studio handles text; ComfyUI handles images.

---

## Architecture

```text
Browser UI
    ↓
/comfy-proxy/*?base=...
    ↓
Node.js proxy
    ↓
ComfyUI API
    ↓
Workflow API JSON
    ↓
FLUX.2-klein-4B-GGUF
```

The frontend patches workflow parameters and submits the workflow to ComfyUI.

HTTP details: [api.md](./api.md) · Vision vs generation: [images.md](./images.md)

---

## How it actually works

This UI does **not** embed ComfyUI or download model weights. ComfyUI is a **separate application** you start yourself (typically at `http://127.0.0.1:8188`). The chat UI talks to ComfyUI over HTTP through the Node.js proxy when you click **Test ComfyUI** or **Generate** in **Image** mode.

| Responsibility | Where it runs |
|----------------|---------------|
| Text chat, vision (describe an image) | LM Studio — see [lm-studio.md](./lm-studio.md) |
| Image generation from a workflow | ComfyUI (prompt + Generate in chat; settings in sidebar) |

You must install ComfyUI, the **ComfyUI-GGUF** extension, and the `.gguf` / `.safetensors` files **manually** into ComfyUI’s model folders. The UI never fetches those files from the network.

---

## Built-in FLUX workflow source

The default FLUX Klein workflow is **hardcoded in the frontend**, not loaded from disk or the internet.

| | |
|---|---|
| Constant | `FLUX_KLEIN_WORKFLOW` in `public/app.js` |
| Function | `loadFluxKleinWorkflow()` |
| Format | ComfyUI **API** workflow JSON (node id → `{ class_type, inputs }`) |

The workflow references these filenames (you must place the real files in ComfyUI yourself):

- `flux-2-klein-4b-Q4_K_S.gguf` → `ComfyUI/models/unet`
- `flux2-vae.safetensors` → ComfyUI VAE folder
- `qwen_3_4b_fp4_flux2.safetensors` → ComfyUI CLIP folder

---

## What **Load FLUX workflow** does (and does not do)

**Does:**

1. Copies the built-in `FLUX_KLEIN_WORKFLOW` object into the **Workflow JSON** textarea (pretty-printed).
2. Fills default **parameter paths** (`4.inputs.text`, `5.inputs.text`, `7.inputs.seed`, etc.).
3. Sets width / height / steps fields to `512` / `512` / `4` if empty.
4. Fills negative prompt from the template **only if that field is empty**.
5. Calls `saveComfySettings()` — writes workflow JSON, paths, and ComfyUI URL to `localStorage`.

**Does not:**

- Download workflow files or model weights
- Start ComfyUI
- Install the ComfyUI-GGUF extension
- Verify that model files exist on disk
- Submit anything to ComfyUI (no network call)

After loading the template, you still need ComfyUI running with the correct models installed, then use **Test ComfyUI** and **Generate** in Image mode.

**Save workflow** only persists the current textarea and path fields to `localStorage`; it does not upload to ComfyUI.

---

## UI layout (sidebar + chat)

The sidebar **ComfyUI settings** panel holds configuration only:

- ComfyUI URL, Test, Save workflow, Load FLUX workflow
- Workflow JSON and dot paths (prompt / negative / seed / steps / width / height)
- Negative prompt, width, height, steps, seed

The main chat area handles generation:

1. Switch to **Image** mode in the chat header (**Chat | Image**).
2. Enter the positive prompt in the composer (same field as chat messages).
3. Optionally click **Use last answer** to copy the last assistant text into the prompt.
4. Click **Generate**.

Results appear as **assistant messages with images** in the chat feed (not in the sidebar). A system message is inserted when you switch between Chat and Image mode, warning that LM Studio and ComfyUI do not share context.

---

## UI button flow

```text
Load FLUX workflow
    → fill form from FLUX_KLEIN_WORKFLOW + save to localStorage
    → no HTTP request

Save workflow
    → save current JSON + paths + URL to localStorage
    → no HTTP request

Test ComfyUI
    → save settings
    → GET /comfy-proxy/system_stats?base=<comfyUrl>
    → shows GPU/device name if ComfyUI responds

Generate (Image mode, composer)
    → user prompt message + "Generating…" placeholder in chat
    → save settings
    → parse workflow JSON, patch prompt/seed/steps/size via dot paths
    → POST /comfy-proxy/prompt?base=<comfyUrl>  { prompt: workflow }
    → poll GET /history/<prompt_id> every ~1.5s (up to 3 min)
    → replace placeholder with image message via GET /view?filename=...
```

**Use last answer** copies the last assistant message from the active chat into the composer prompt. It does not call LM Studio or ComfyUI.

Generated image URLs are saved on chat messages in `localStorage` as proxy URLs.

---

## ComfyUI URL

Default:

```text
http://127.0.0.1:8188
```

Set in the UI or via `COMFY_URL`. See [configuration.md](./configuration.md).

---

## Target model

Built-in workflow targets:

```text
unsloth/FLUX.2-klein-4B-GGUF
```

UNet file:

```text
flux-2-klein-4b-Q4_K_S.gguf
```

Click **Load FLUX workflow** to paste the built-in template into the form (see [Built-in FLUX workflow source](#built-in-flux-workflow-source)). You still must install the model files yourself.

---

## Required model files

### UNet

| | |
|---|---|
| File | `flux-2-klein-4b-Q4_K_S.gguf` |
| Folder | `ComfyUI/models/unet` |
| Node | Unet Loader (GGUF) |
| Class | `UnetLoaderGGUF` |

### VAE

| | |
|---|---|
| File | `flux2-vae.safetensors` |
| Node | Load VAE |
| Class | `VAELoader` |

### CLIP

| | |
|---|---|
| File | `qwen_3_4b_fp4_flux2.safetensors` |
| Node | Load CLIP |
| Class | `CLIPLoader` |
| Params | `type = flux2`, `device = default` |

---

## Setup steps

1. **Start ComfyUI separately** at `http://127.0.0.1:8188` (the chat UI does not start it).
2. Install the **ComfyUI-GGUF** extension in your ComfyUI install.
3. **Manually** download and place model files in the correct ComfyUI folders (see [Required model files](#required-model-files)).
4. In the chat UI, open **ComfyUI settings** in the sidebar.
5. Click **Load FLUX workflow** (fills the form from `public/app.js`) or paste your own API-format workflow.
6. Click **Test ComfyUI** to verify the proxy can reach ComfyUI.
7. Switch to **Image** mode, enter a prompt, set size/steps in the sidebar if needed, and click **Generate**.

---

## Workflow nodes

### Positive prompt

| | |
|---|---|
| Node | CLIP Text Encode (POS Prompt) |
| Class | `CLIPTextEncode` |
| Example | `A cinematic portrait of a cat wizard, soft light, detailed fantasy art` |

### Negative prompt

| | |
|---|---|
| Node | CLIP Text Encode (NEG Prompt) |
| Example | `low quality, blurry, distorted` |

### Latent image

| | |
|---|---|
| Node | Empty Flux 2 Latent |
| Class | `EmptyFlux2LatentImage` |
| Defaults | `width = 512`, `height = 512`, `batch_size = 1` |

### Sampling

| | |
|---|---|
| Node | KSampler |
| Defaults | `steps = 4`, `cfg = 1`, `sampler_name = euler`, `scheduler = simple`, `denoise = 1` |

### Decode & save

| | |
|---|---|
| Decode | `VAEDecode` — VAE Decode |
| Save | `SaveImage` — prefix `flux2-klein` |

---

## Workflow structure

```text
Load CLIP
      │
      ├────────► CLIP Text Encode (+)
      │
      └────────► CLIP Text Encode (-)

Unet Loader (GGUF)
            │
            ▼
        KSampler
            ▲
            │
Empty Flux 2 Latent
            │
            ▼
       VAE Decode
            │
            ▼
        Save Image
```

---

## Parameter paths

The UI updates workflow fields using dot paths:

| Parameter | Path |
|-----------|------|
| Prompt | `4.inputs.text` |
| Negative prompt | `5.inputs.text` |
| Seed | `7.inputs.seed` |
| Steps | `7.inputs.steps` |
| Width | `6.inputs.width` |
| Height | `6.inputs.height` |

If you use a custom workflow, update these paths to match your exported JSON.

---

## Default parameters

| Parameter | Value |
|-----------|-------|
| Prompt | `A cinematic portrait of a cat wizard, soft light, detailed fantasy art` |
| Negative | `low quality, blurry, distorted` |
| Width | `512` |
| Height | `512` |
| Steps | `4` |
| Seed | random if empty |
| Sampler | `euler` |
| Scheduler | `simple` |
| CFG | `1` |

---

## API flow

```text
Browser
    ↓
/comfy-proxy/prompt?base=...
    ↓
Node.js proxy
    ↓
POST /prompt
    ↓
ComfyUI :8188
    ↓
Workflow API JSON
    ↓
FLUX.2-klein-4B-GGUF
    ↓
Save Image
    ↓
GET /history/<prompt_id>
    ↓
GET /view?filename=...
```

---

## Notes

- `Vision = true` in LM Studio means **image understanding**, not generation. See [images.md](./images.md).
- LM Studio handles LLM chat and vision input only; it is **not** used when you click **Generate** in Image mode.
- ComfyUI handles image generation only; it is **not** used for chat messages.
- Workflow JSON and ComfyUI settings persist in browser `localStorage` (keys `lm_comfy_*`). Model files on disk are your responsibility.
- Chat/Image mode and generated images are stored per chat in `lm_chats_v5`.

---

## Related docs

- [Images & vision](./images.md)
- [API reference](./api.md)
- [Configuration](./configuration.md)
