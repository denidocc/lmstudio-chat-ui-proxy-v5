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

Click **Load FLUX workflow** in the UI to populate the default workflow JSON and parameter paths.

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

1. Start ComfyUI at `http://127.0.0.1:8188`
2. Install the **ComfyUI-GGUF** extension
3. Place model files in the correct ComfyUI folders
4. In the UI, open **ComfyUI / images**
5. Click **Load FLUX workflow** or paste your own API-format workflow
6. Click **Test ComfyUI** to verify connectivity
7. Set prompt, size, steps, and click **Generate**

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

- `Vision = true` in LM Studio means **image understanding**, not generation.
- LM Studio is used only for LLM inference.
- ComfyUI is used only for image generation.

---

## Related docs

- [Images & vision](./images.md)
- [API reference](./api.md)
- [Configuration](./configuration.md)
