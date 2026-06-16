# Getting started

[← Documentation index](./README.md)

---

## Requirements

- **Node.js LTS**
- **LM Studio** with Local Server enabled
- **ComfyUI** — optional, only for image generation

No `npm install` is required. The server uses only Node.js built-in modules.

---

## Run on Windows

Double-click:

```text
start-windows.bat
```

The browser opens:

```text
http://localhost:8080
```

---

## Run on macOS

Option 1 — launcher script:

```bash
cd path/to/lmstudio-chat-ui-proxy-v5
chmod +x start-macos.command
./start-macos.command
```

Option 2 — npm:

```bash
cd path/to/lmstudio-chat-ui-proxy-v5
npm start
```

---

## Run on Linux

```bash
cd path/to/lmstudio-chat-ui-proxy-v5
chmod +x start-linux-macos.sh
./start-linux-macos.sh
```

Or directly:

```bash
node server.js
```

---

## Open the UI

On the machine running the server:

```text
http://localhost:8080
```

From another device on the same LAN:

```text
http://your-ipv4-address:8080
```

Example:

```text
http://192.168.10.175:8080
```

The terminal prints detected LAN URLs when the server starts.

---

## Connect to LM Studio

1. Start LM Studio and enable **Local Server**.
2. Open the UI and enter the LM Studio address, for example:

```text
http://127.0.0.1:1234
```

or a LAN address:

```text
http://192.168.10.175:1234
```

3. Click **Connect**.
4. Select a model and start chatting.

If LM Studio authentication is enabled, enter your API token in the UI.

More details: [configuration.md](./configuration.md), [lm-studio.md](./lm-studio.md)

---

## Verify the server

```text
http://localhost:8080/health
```

Should return JSON with `"ok": true`.

---

## Next steps

- [Configuration](./configuration.md) — env vars and defaults
- [Images & vision](./images.md) — when to use LM Studio vs ComfyUI
- [ComfyUI / FLUX](./comfyui.md) — image generation setup
