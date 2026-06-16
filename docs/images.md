# Images & vision

[← Documentation index](./README.md)

---

## Two different features

This project handles images in two separate ways:

| Task | Where it runs | UI panel |
|------|---------------|----------|
| **Analyze** an image (vision input) | LM Studio + vision LLM | Vision / image |
| **Generate** an image | ComfyUI + workflow API | ComfyUI / images |

Do not mix them up.

For step-by-step behavior when you click buttons in the UI, see:

- **Connect / chat / vision / Load model** — [lm-studio.md — How it actually works](./lm-studio.md#how-it-actually-works--ui-flow)
- **Load FLUX workflow / Test ComfyUI / Generate** — [comfyui.md — How it actually works](./comfyui.md#how-it-actually-works)

---

## Vision input (LM Studio)

An LM Studio model with **Vision: true** can accept an image as input and describe or answer questions about it.

```text
Vision = image understanding
```

Steps:

1. Connect to LM Studio and select a vision-capable model.
2. Open **Vision / image** in the sidebar.
3. Attach a PNG, JPEG, or WebP file.
4. Send your message.

The image is sent as a `data_url` in the chat request. See [api.md](./api.md) for the request shape.

**Vision does not generate images.** Image creation uses ComfyUI only — the **Load FLUX workflow** button fills the form from a hardcoded template in `public/app.js`; it does not download models or talk to ComfyUI. Details: [comfyui.md — Built-in FLUX workflow source](./comfyui.md#built-in-flux-workflow-source).

## Image generation (ComfyUI)

To create new images, use ComfyUI with a workflow exported in API format.

FLUX GGUF models such as `unsloth/FLUX.2-klein-4B-GGUF` are **not** loaded through the LM Studio Chat API. They require:

- ComfyUI
- ComfyUI-GGUF extension
- Model files in the ComfyUI folders

Full setup: [comfyui.md](./comfyui.md)

---

## FLUX models in the model list

FLUX, diffusion, and similar image models are **hidden** from the chat model dropdown because they cannot be used for text chat through LM Studio.

Use the ComfyUI panel instead.

---

## Quick ComfyUI checklist

1. Start ComfyUI at `http://127.0.0.1:8188`
2. Install `ComfyUI-GGUF`
3. Place the FLUX `.gguf` file in `ComfyUI/models/unet`
4. In the UI, click **Load FLUX workflow** (copies built-in JSON from `public/app.js` into the form) or paste your own API-format workflow
5. Confirm parameter paths (built-in FLUX Klein workflow):

```text
4.inputs.text       ← prompt
5.inputs.text       ← negative prompt
7.inputs.seed
7.inputs.steps
6.inputs.width
6.inputs.height
```

---

## Related docs

- [LM Studio — vision models](./lm-studio.md#vision-models)
- [ComfyUI integration](./comfyui.md)
- [API reference — chat & ComfyUI](./api.md)
