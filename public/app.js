const els = {
  serverUrl: document.querySelector("#serverUrl"),
  apiToken: document.querySelector("#apiToken"),
  connectBtn: document.querySelector("#connectBtn"),
  refreshBtn: document.querySelector("#refreshBtn"),
  statusDot: document.querySelector("#statusDot"),
  statusText: document.querySelector("#statusText"),
  modelSelect: document.querySelector("#modelSelect"),
  loadBtn: document.querySelector("#loadBtn"),
  forgetChatBtn: document.querySelector("#forgetChatBtn"),
  newChatBtn: document.querySelector("#newChatBtn"),
  chatHistory: document.querySelector("#chatHistory"),
  modelInfo: document.querySelector("#modelInfo"),
  systemPrompt: document.querySelector("#systemPrompt"),
  temperature: document.querySelector("#temperature"),
  maxTokens: document.querySelector("#maxTokens"),
  chatTitle: document.querySelector("#chatTitle"),
  chatSubtitle: document.querySelector("#chatSubtitle"),
  statsBox: document.querySelector("#statsBox"),
  messages: document.querySelector("#messages"),
  chatForm: document.querySelector("#chatForm"),
  userInput: document.querySelector("#userInput"),
  sendBtn: document.querySelector("#sendBtn"),
  visionImageInput: document.querySelector("#visionImageInput"),
  visionPreview: document.querySelector("#visionPreview"),
  clearVisionBtn: document.querySelector("#clearVisionBtn"),
  exportMdBtn: document.querySelector("#exportMdBtn"),
  exportJsonBtn: document.querySelector("#exportJsonBtn"),
  exportHtmlBtn: document.querySelector("#exportHtmlBtn"),
  comfyUrl: document.querySelector("#comfyUrl"),
  testComfyBtn: document.querySelector("#testComfyBtn"),
  saveComfyWorkflowBtn: document.querySelector("#saveComfyWorkflowBtn"),
  loadFluxWorkflowBtn: document.querySelector("#loadFluxWorkflowBtn"),
  comfyWorkflow: document.querySelector("#comfyWorkflow"),
  comfyPromptPath: document.querySelector("#comfyPromptPath"),
  comfyNegativePath: document.querySelector("#comfyNegativePath"),
  comfySeedPath: document.querySelector("#comfySeedPath"),
  comfyStepsPath: document.querySelector("#comfyStepsPath"),
  comfyWidthPath: document.querySelector("#comfyWidthPath"),
  comfyHeightPath: document.querySelector("#comfyHeightPath"),
  comfyPrompt: document.querySelector("#comfyPrompt"),
  comfyNegativePrompt: document.querySelector("#comfyNegativePrompt"),
  comfyWidth: document.querySelector("#comfyWidth"),
  comfyHeight: document.querySelector("#comfyHeight"),
  comfySteps: document.querySelector("#comfySteps"),
  comfySeed: document.querySelector("#comfySeed"),
  useLastAnswerAsPromptBtn: document.querySelector("#useLastAnswerAsPromptBtn"),
  generateComfyBtn: document.querySelector("#generateComfyBtn"),
  comfyStatus: document.querySelector("#comfyStatus"),
  comfyImages: document.querySelector("#comfyImages"),
};

const STORAGE_KEYS = {
  baseUrl: "lm_base_url",
  token: "lm_api_token",
  selectedModel: "lm_selected_model",
  chats: "lm_chats_v5",
  activeChatId: "lm_active_chat_id_v5",
  comfyUrl: "lm_comfy_url",
  comfyWorkflow: "lm_comfy_workflow_api_json",
  comfyPromptPath: "lm_comfy_prompt_path",
  comfyNegativePath: "lm_comfy_negative_path",
  comfySeedPath: "lm_comfy_seed_path",
  comfyStepsPath: "lm_comfy_steps_path",
  comfyWidthPath: "lm_comfy_width_path",
  comfyHeightPath: "lm_comfy_height_path",
};

const FLUX_KLEIN_WORKFLOW = {
  "1": {
    inputs: {
      unet_name: "flux-2-klein-4b-Q4_K_S.gguf",
    },
    class_type: "UnetLoaderGGUF",
    _meta: {
      title: "Unet Loader (GGUF)",
    },
  },
  "2": {
    inputs: {
      vae_name: "flux2-vae.safetensors",
    },
    class_type: "VAELoader",
    _meta: {
      title: "Load VAE",
    },
  },
  "3": {
    inputs: {
      clip_name: "qwen_3_4b_fp4_flux2.safetensors",
      type: "flux2",
      device: "default",
    },
    class_type: "CLIPLoader",
    _meta: {
      title: "Load CLIP",
    },
  },
  "4": {
    inputs: {
      text: "A cinematic portrait of a cat wizard, soft light, detailed fantasy art",
      clip: ["3", 0],
    },
    class_type: "CLIPTextEncode",
    _meta: {
      title: "CLIP Text Encode (POS Prompt)",
    },
  },
  "5": {
    inputs: {
      text: "low quality, blurry, distorted",
      clip: ["3", 0],
    },
    class_type: "CLIPTextEncode",
    _meta: {
      title: "CLIP Text Encode (NEG Prompt)",
    },
  },
  "6": {
    inputs: {
      width: 512,
      height: 512,
      batch_size: 1,
    },
    class_type: "EmptyFlux2LatentImage",
    _meta: {
      title: "Empty Flux 2 Latent",
    },
  },
  "7": {
    inputs: {
      seed: 12345,
      steps: 4,
      cfg: 1,
      sampler_name: "euler",
      scheduler: "simple",
      denoise: 1,
      model: ["1", 0],
      positive: ["4", 0],
      negative: ["5", 0],
      latent_image: ["6", 0],
    },
    class_type: "KSampler",
    _meta: {
      title: "KSampler",
    },
  },
  "8": {
    inputs: {
      samples: ["7", 0],
      vae: ["2", 0],
    },
    class_type: "VAEDecode",
    _meta: {
      title: "VAE Decode",
    },
  },
  "9": {
    inputs: {
      filename_prefix: "flux2-klein",
      images: ["8", 0],
    },
    class_type: "SaveImage",
    _meta: {
      title: "Save Image",
    },
  },
};

const state = {
  baseUrl: localStorage.getItem(STORAGE_KEYS.baseUrl) || "http://192.168.10.175:1234",
  token: localStorage.getItem(STORAGE_KEYS.token) || "",
  models: [],
  selectedModelKey: localStorage.getItem(STORAGE_KEYS.selectedModel) || "",
  chats: loadChats(),
  activeChatId: localStorage.getItem(STORAGE_KEYS.activeChatId) || "",
  connected: false,
  busy: false,
  comfyBusy: false,
  visionImageDataUrl: "",
  visionImageName: "",
  comfyUrl: localStorage.getItem(STORAGE_KEYS.comfyUrl) || "http://127.0.0.1:8188",
};

els.serverUrl.value = state.baseUrl;
els.apiToken.value = state.token;
els.comfyUrl.value = state.comfyUrl;
els.comfyWorkflow.value = localStorage.getItem(STORAGE_KEYS.comfyWorkflow) || "";
els.comfyPromptPath.value = localStorage.getItem(STORAGE_KEYS.comfyPromptPath) || "";
els.comfyNegativePath.value = localStorage.getItem(STORAGE_KEYS.comfyNegativePath) || "";
els.comfySeedPath.value = localStorage.getItem(STORAGE_KEYS.comfySeedPath) || "";
els.comfyStepsPath.value = localStorage.getItem(STORAGE_KEYS.comfyStepsPath) || "";
els.comfyWidthPath.value = localStorage.getItem(STORAGE_KEYS.comfyWidthPath) || "";
els.comfyHeightPath.value = localStorage.getItem(STORAGE_KEYS.comfyHeightPath) || "";

function createId() {
  return `chat_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function loadChats() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.chats) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveChats() {
  localStorage.setItem(STORAGE_KEYS.chats, JSON.stringify(state.chats));
  localStorage.setItem(STORAGE_KEYS.activeChatId, state.activeChatId);
}

function getActiveChat() {
  let chat = state.chats.find((item) => item.id === state.activeChatId);

  if (!chat) {
    chat = {
      id: createId(),
      title: "Новый чат",
      messages: [],
      previousResponseId: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modelKey: "",
    };

    state.chats.unshift(chat);
    state.activeChatId = chat.id;
    saveChats();
  }

  return chat;
}

function newChat() {
  const chat = {
    id: createId(),
    title: "Новый чат",
    messages: [],
    previousResponseId: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modelKey: state.selectedModelKey || "",
  };

  state.chats.unshift(chat);
  state.activeChatId = chat.id;
  saveChats();
  renderHistory();
  renderMessages();
  renderHeader();
}

function deleteActiveChat() {
  if (!state.chats.length) return;

  state.chats = state.chats.filter((chat) => chat.id !== state.activeChatId);
  state.activeChatId = state.chats[0]?.id || "";
  saveChats();

  if (!state.activeChatId) {
    getActiveChat();
  }

  renderHistory();
  renderMessages();
  renderHeader();
}

function touchChat(chat) {
  chat.updatedAt = new Date().toISOString();

  const index = state.chats.findIndex((item) => item.id === chat.id);
  if (index > 0) {
    state.chats.splice(index, 1);
    state.chats.unshift(chat);
  }

  saveChats();
  renderHistory();
}

function setChatTitleFromMessage(chat, text) {
  if (chat.title && chat.title !== "Новый чат") return;

  const trimmed = String(text || "").trim().replace(/\s+/g, " ");
  chat.title = trimmed.length > 42 ? `${trimmed.slice(0, 42)}...` : trimmed || "Новый чат";
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("ru", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function renderHistory() {
  if (!state.chats.length) {
    els.chatHistory.innerHTML = `<p class="muted">История пока пустая.</p>`;
    return;
  }

  els.chatHistory.innerHTML = "";

  for (const chat of state.chats) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `historyItem ${chat.id === state.activeChatId ? "active" : ""}`.trim();

    const title = document.createElement("div");
    title.className = "historyTitle";
    title.textContent = chat.title || "Новый чат";

    const meta = document.createElement("div");
    meta.className = "historyMeta";
    meta.textContent = `${chat.messages.length} сообщ. · ${formatDate(chat.updatedAt)}`;

    button.appendChild(title);
    button.appendChild(meta);

    button.addEventListener("click", () => {
      state.activeChatId = chat.id;
      localStorage.setItem(STORAGE_KEYS.activeChatId, state.activeChatId);
      renderHistory();
      renderMessages();
      renderHeader();
    });

    els.chatHistory.appendChild(button);
  }
}

function normalizeBaseUrl(url) {
  return String(url || "").trim().replace(/\/+$/, "");
}

function apiHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = els.apiToken.value.trim();
  if (token) headers.Authorization = token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`;
  return headers;
}

function endpoint(path) {
  const base = encodeURIComponent(state.baseUrl);
  return `/proxy${path}?base=${base}`;
}

function comfyEndpoint(path) {
  const base = encodeURIComponent(state.comfyUrl);
  return `/comfy-proxy${path}${path.includes("?") ? "&" : "?"}base=${base}`;
}

function setStatus(type, text) {
  els.statusDot.className = `dot ${type || ""}`.trim();
  els.statusText.textContent = text;
}

function setBusy(isBusy, text = "") {
  state.busy = isBusy;
  els.connectBtn.disabled = isBusy;
  els.refreshBtn.disabled = isBusy;
  els.loadBtn.disabled = isBusy || !state.connected || !state.selectedModelKey;
  els.sendBtn.disabled = isBusy || !state.connected || !state.selectedModelKey;
  els.userInput.disabled = isBusy || !state.connected || !state.selectedModelKey;
  els.forgetChatBtn.disabled = isBusy || !state.chats.length;
  if (text) setStatus("warn", text);
}

function setComfyBusy(isBusy, text = "") {
  state.comfyBusy = isBusy;
  els.testComfyBtn.disabled = isBusy;
  els.saveComfyWorkflowBtn.disabled = isBusy;
  els.useLastAnswerAsPromptBtn.disabled = isBusy;
  els.generateComfyBtn.disabled = isBusy;
  if (text) {
    els.comfyStatus.textContent = text;
    setStatus("warn", text);
  }
}

function formatBytes(bytes) {
  if (!Number.isFinite(Number(bytes))) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = Number(bytes);
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

function safeFileName(value, fallback = "chat") {
  return String(value || fallback)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_-]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || fallback;
}

function downloadBlob(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 0);
}

function yesNo(value) {
  if (value === true) return "Да";
  if (value === false) return "Нет";
  return "—";
}

function getSelectedModel() {
  return state.models.find((m) => m.key === state.selectedModelKey) || null;
}

function isLoaded(model) {
  return Array.isArray(model?.loaded_instances) && model.loaded_instances.length > 0;
}

function modelHasVision(model) {
  return model?.capabilities?.vision === true;
}

function isUnsupportedChatModel(model) {
  const architecture = String(model?.architecture || "").toLowerCase();
  const key = String(model?.key || "").toLowerCase();
  const name = String(model?.display_name || "").toLowerCase();

  return (
    architecture === "flux" ||
    architecture.includes("diffusion") ||
    key.includes("flux") ||
    name.includes("flux")
  );
}

function getChatModels() {
  return state.models.filter((m) => m.type === "llm" && !isUnsupportedChatModel(m));
}

function renderModelSelect() {
  const llms = getChatModels();
  const unsupported = state.models.filter(isUnsupportedChatModel);
  els.modelSelect.innerHTML = "";

  if (!llms.length) {
    const option = document.createElement("option");
    option.textContent = unsupported.length ? "Чат-модели не найдены (FLUX скрыт)" : "LLM модели не найдены";
    els.modelSelect.appendChild(option);
    els.modelSelect.disabled = true;
    state.selectedModelKey = "";
    localStorage.removeItem(STORAGE_KEYS.selectedModel);
    return;
  }

  for (const model of llms) {
    const option = document.createElement("option");
    option.value = model.key;
    option.textContent = `${model.display_name || model.key}${isLoaded(model) ? " — loaded" : ""}`;
    els.modelSelect.appendChild(option);
  }

  const activeChat = getActiveChat();
  const chatModel = llms.find((m) => m.key === activeChat.modelKey);
  const saved = llms.find((m) => m.key === state.selectedModelKey);
  const loaded = llms.find(isLoaded);

  state.selectedModelKey = chatModel?.key || saved?.key || loaded?.key || llms[0].key;
  els.modelSelect.value = state.selectedModelKey;
  els.modelSelect.disabled = false;

  activeChat.modelKey = state.selectedModelKey;
  saveChats();
  localStorage.setItem(STORAGE_KEYS.selectedModel, state.selectedModelKey);
}

function renderModelInfo() {
  const model = getSelectedModel();

  if (!model) {
    const unsupported = state.models.filter(isUnsupportedChatModel);
    const note = unsupported.length
      ? `<p class="hint">Скрыто image/diffusion моделей: ${unsupported.length}. FLUX запускается через ComfyUI, не через LM Studio Chat API.</p>`
      : "";
    els.modelInfo.innerHTML = `<p class="muted">Модель не выбрана.</p>${note}`;
    return;
  }

  const q = model.quantization || {};
  const caps = model.capabilities || {};
  const reasoning = caps.reasoning || {};
  const firstInstance = Array.isArray(model.loaded_instances) ? model.loaded_instances[0] : null;
  const config = firstInstance?.config || {};

  const rows = [
    ["Статус", isLoaded(model) ? "Загружена" : "Не загружена"],
    ["Название", model.display_name || "—"],
    ["Ключ", model.key || "—"],
    ["Publisher", model.publisher || "—"],
    ["Тип", model.type || "—"],
    ["Архитектура", model.architecture || "—"],
    ["Параметры", model.params_string || "—"],
    ["Квантизация", q.name ? `${q.name}${q.bits_per_weight ? ` / ${q.bits_per_weight} bit` : ""}` : "—"],
    ["Размер", formatBytes(model.size_bytes)],
    ["Формат", model.format || "—"],
    ["Max context", model.max_context_length ? `${model.max_context_length} tokens` : "—"],
    ["Loaded context", config.context_length ? `${config.context_length} tokens` : "—"],
    ["Vision", yesNo(caps.vision)],
    ["Tool use", yesNo(caps.trained_for_tool_use)],
    ["Reasoning", reasoning.default || "—"],
  ];

  els.modelInfo.innerHTML = rows
    .map(([label, value]) => `<div class="infoRow"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`)
    .join("");

  els.loadBtn.textContent = isLoaded(model) ? "Перезагрузить модель" : "Загрузить модель";
  renderHeader();
}

function renderHeader() {
  const chat = getActiveChat();
  const model = getSelectedModel();

  els.chatTitle.textContent = chat.title || "Новый чат";

  if (model) {
    els.chatSubtitle.textContent = `${model.display_name || model.key} · ${state.baseUrl} · ${isLoaded(model) ? "модель загружена" : "модель не загружена"}`;
  } else {
    els.chatSubtitle.textContent = "Подключите LM Studio сервер, затем выберите модель.";
  }
}

function renderStats(stats = null) {
  if (!stats) {
    els.statsBox.textContent = "";
    return;
  }

  const parts = [];
  if (stats.input_tokens != null) parts.push(`Input: ${stats.input_tokens}`);
  if (stats.total_output_tokens != null) parts.push(`Output: ${stats.total_output_tokens}`);
  if (stats.tokens_per_second != null) parts.push(`${Number(stats.tokens_per_second).toFixed(2)} tok/s`);
  if (stats.time_to_first_token_seconds != null) parts.push(`TTFT: ${Number(stats.time_to_first_token_seconds).toFixed(2)}s`);

  els.statsBox.textContent = parts.join(" · ");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderInlineMarkdown(text) {
  let html = escapeHtml(text);

  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  html = html.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  return html;
}

function isTableDivider(line) {
  const trimmed = line.trim();
  if (!trimmed.includes("|")) return false;
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(trimmed);
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderMarkdownTable(lines, startIndex) {
  const headerLine = lines[startIndex];
  const dividerLine = lines[startIndex + 1];

  if (!dividerLine || !isTableDivider(dividerLine)) {
    return null;
  }

  const headers = splitTableRow(headerLine);
  const rows = [];
  let index = startIndex + 2;

  while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
    rows.push(splitTableRow(lines[index]));
    index++;
  }

  const thead = `<thead><tr>${headers.map((h) => `<th>${renderInlineMarkdown(h)}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${renderInlineMarkdown(cell)}</td>`).join("")}</tr>`).join("")}</tbody>`;

  return {
    html: `<div class="mdTableWrap"><table>${thead}${tbody}</table></div>`,
    nextIndex: index,
  };
}

function markdownToHtml(markdown) {
  const codeBlocks = [];
  let text = String(markdown || "").replace(/\r\n/g, "\n");

  text = text.replace(/```([a-zA-Z0-9_-]+)?\n?([\s\S]*?)```/g, (_, lang, code) => {
    const token = `@@CODE_BLOCK_${codeBlocks.length}@@`;
    const language = lang ? `<div class="codeLang">${escapeHtml(lang)}</div>` : "";
    codeBlocks.push({
      token,
      html: `<pre class="mdCode">${language}<code>${escapeHtml(code.trimEnd())}</code></pre>`,
    });
    return token;
  });

  const lines = text.split("\n");
  const htmlParts = [];

  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (/^@@CODE_BLOCK_\d+@@$/.test(trimmed)) {
      htmlParts.push(trimmed);
      i++;
      continue;
    }

    if (line.includes("|") && i + 1 < lines.length) {
      const table = renderMarkdownTable(lines, i);
      if (table) {
        htmlParts.push(table.html);
        i = table.nextIndex;
        continue;
      }
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      htmlParts.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      htmlParts.push("<hr>");
      i++;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      htmlParts.push(`<blockquote>${quoteLines.map(renderInlineMarkdown).join("<br>")}</blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      htmlParts.push(`<ul>${items.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      htmlParts.push(`<ol>${items.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</ol>`);
      continue;
    }

    const paragraph = [line];
    i++;

    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^@@CODE_BLOCK_\d+@@$/.test(lines[i].trim()) &&
      !/^(#{1,6})\s+/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^>\s?/.test(lines[i].trim()) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      if (lines[i].includes("|") && i + 1 < lines.length && isTableDivider(lines[i + 1])) break;
      paragraph.push(lines[i]);
      i++;
    }

    htmlParts.push(`<p>${renderInlineMarkdown(paragraph.join("\n")).replace(/\n/g, "<br>")}</p>`);
  }

  let html = htmlParts.join("\n");

  for (const block of codeBlocks) {
    html = html.replace(block.token, block.html);
  }

  return html;
}

function renderMessages() {
  const chat = getActiveChat();
  els.messages.innerHTML = "";

  if (!chat.messages.length) {
    els.messages.innerHTML = `
      <div class="empty">
        <h3>Новый чат</h3>
        <p>Введите сообщение внизу. История будет сохранена в этом браузере.</p>
      </div>
    `;
    return;
  }

  for (const message of chat.messages) {
    addMessageToDom(message.role, message.content, message.extraClass || "");
  }

  els.messages.scrollTop = els.messages.scrollHeight;
}

function clearEmptyScreen() {
  const empty = els.messages.querySelector(".empty");
  if (empty) empty.remove();
}

function addMessageToDom(role, text, extraClass = "") {
  clearEmptyScreen();

  const wrap = document.createElement("div");
  wrap.className = `message ${role} ${extraClass}`.trim();

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = role === "user" ? "Вы" : role === "assistant" ? "Модель" : "Система";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  if (role === "assistant") {
    bubble.classList.add("markdownBody");
    bubble.innerHTML = markdownToHtml(text);
  } else {
    bubble.textContent = text;
  }

  wrap.appendChild(meta);
  wrap.appendChild(bubble);
  els.messages.appendChild(wrap);
  els.messages.scrollTop = els.messages.scrollHeight;

  return bubble;
}

function pushMessage(role, content, extraClass = "") {
  const chat = getActiveChat();
  const message = {
    role,
    content,
    extraClass,
    createdAt: new Date().toISOString(),
  };

  chat.messages.push(message);
  touchChat(chat);
  return message;
}

function addMessage(role, text, extraClass = "") {
  pushMessage(role, text, extraClass);
  return addMessageToDom(role, text, extraClass);
}

function extractAssistantText(data) {
  if (typeof data?.content === "string") return data.content;
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.response === "string") return data.response;

  const output = Array.isArray(data?.output) ? data.output : [];
  const messageParts = output
    .filter((item) => item && item.type === "message" && typeof item.content === "string")
    .map((item) => item.content);

  if (messageParts.length) return messageParts.join("\n\n");

  return JSON.stringify(data, null, 2);
}

async function requestJson(path, options = {}) {
  const response = await fetch(endpoint(path), {
    ...options,
    headers: {
      ...apiHeaders(),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = data?.error?.message || data?.message || data?.raw || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

async function connect() {
  try {
    setBusy(true, "Подключение через proxy...");

    state.baseUrl = normalizeBaseUrl(els.serverUrl.value);
    state.token = els.apiToken.value.trim();

    if (!state.baseUrl) throw new Error("Введите адрес LM Studio сервера.");

    localStorage.setItem(STORAGE_KEYS.baseUrl, state.baseUrl);
    localStorage.setItem(STORAGE_KEYS.token, state.token);

    const data = await requestJson("/api/v1/models", { method: "GET" });
    state.models = Array.isArray(data?.models) ? data.models : Array.isArray(data) ? data : [];

    state.connected = true;
    renderModelSelect();
    renderModelInfo();

    const total = state.models.length;
    const llms = getChatModels().length;
    const unsupported = state.models.filter(isUnsupportedChatModel).length;
    const loaded = state.models.filter(isLoaded).length;
    const canChat = Boolean(state.selectedModelKey);

    setStatus("ok", `Подключено · моделей: ${total}, чат: ${llms}, image/flux: ${unsupported}, загружено: ${loaded}`);
    els.userInput.disabled = !canChat;
    els.sendBtn.disabled = !canChat;
    els.loadBtn.disabled = !canChat;
    els.forgetChatBtn.disabled = false;
    renderHeader();
  } catch (error) {
    state.connected = false;
    setStatus("err", `Ошибка: ${error.message}`);
    els.modelInfo.innerHTML = `<p class="muted">Не удалось подключиться. Проверьте адрес, сеть, Firewall и API token.</p>`;
    addMessage("assistant", `Не удалось подключиться к LM Studio.\n\n${error.message}`, "error");
  } finally {
    setBusy(false);
  }
}

async function loadSelectedModel() {
  const model = getSelectedModel();
  if (!model) return;

  if (isUnsupportedChatModel(model)) {
    addMessage("assistant", "Эта модель похожа на FLUX/image/diffusion модель. Её нельзя загрузить через LM Studio Chat API. Используйте блок ComfyUI / изображения.", "error");
    return;
  }

  try {
    setBusy(true, "Загрузка модели...");

    const data = await requestJson("/api/v1/models/load", {
      method: "POST",
      body: JSON.stringify({
        model: model.key,
        echo_load_config: true,
      }),
    });

    addMessage("assistant", `Модель загружена: ${data.instance_id || model.key}\nСтатус: ${data.status || "loaded"}\nВремя загрузки: ${data.load_time_seconds ?? "—"}s`);
    await connect();
  } catch (error) {
    setStatus("err", `Ошибка загрузки: ${error.message}`);
    addMessage("assistant", `Не удалось загрузить модель.\n\n${error.message}`, "error");
  } finally {
    setBusy(false);
  }
}

async function sendMessage(event) {
  event.preventDefault();

  const text = els.userInput.value.trim();
  const model = getSelectedModel();
  const chat = getActiveChat();

  if (!text || !model || state.busy) return;

  els.userInput.value = "";
  setChatTitleFromMessage(chat, text);
  chat.modelKey = model.key;
  addMessage("user", state.visionImageDataUrl ? `${text}\n\n[Изображение прикреплено: ${state.visionImageName || "image"}]` : text);
  renderHeader();

  const assistantMessage = pushMessage("assistant", "Печатает...");
  const assistantBubble = addMessageToDom("assistant", "Печатает...");
  assistantBubble.parentElement.classList.add("loading");

  try {
    setBusy(true, "Генерация ответа...");

    if (state.visionImageDataUrl && !modelHasVision(model)) {
      throw new Error("К выбранной модели нельзя отправить изображение: Vision = Нет.");
    }

    const input = state.visionImageDataUrl
      ? [
          { type: "message", content: text },
          { type: "image", data_url: state.visionImageDataUrl },
        ]
      : text;

    const body = {
      model: model.key,
      input,
      stream: false,
      store: true,
      temperature: Number(els.temperature.value || 0.7),
      max_output_tokens: Number(els.maxTokens.value || 1024),
    };

    const systemPrompt = els.systemPrompt.value.trim();
    if (systemPrompt) body.system_prompt = systemPrompt;
    if (chat.previousResponseId) body.previous_response_id = chat.previousResponseId;

    const data = await requestJson("/api/v1/chat", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const answer = extractAssistantText(data);

    chat.previousResponseId = data?.response_id || chat.previousResponseId || "";
    assistantMessage.content = answer;
    assistantBubble.innerHTML = markdownToHtml(answer);

    touchChat(chat);
    renderStats(data?.stats || null);
    clearVisionImage();
    setStatus("ok", "Готово");
  } catch (error) {
    const errorText = `Ошибка запроса.\n\n${error.message}`;
    assistantMessage.content = errorText;
    assistantMessage.extraClass = "error";
    assistantBubble.innerHTML = markdownToHtml(errorText);
    assistantBubble.parentElement.classList.add("error");

    touchChat(chat);
    setStatus("err", `Ошибка: ${error.message}`);
  } finally {
    assistantBubble.parentElement.classList.remove("loading");
    setBusy(false);
    els.userInput.focus();
  }
}


function clearVisionImage() {
  state.visionImageDataUrl = "";
  state.visionImageName = "";

  els.visionImageInput.value = "";
  els.visionPreview.classList.add("hidden");
  els.visionPreview.innerHTML = "";
  els.clearVisionBtn.disabled = true;
}

function setVisionImage(file) {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setStatus("err", "Выберите PNG/JPEG/WebP изображение.");
    return;
  }

  const maxSize = 8 * 1024 * 1024;
  if (file.size > maxSize) {
    setStatus("err", "Изображение слишком большое. Максимум 8 MB.");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    state.visionImageDataUrl = String(reader.result || "");
    state.visionImageName = file.name;

    els.visionPreview.innerHTML = `
      <img src="${state.visionImageDataUrl}" alt="Attached image preview">
      <div class="fileMeta">${escapeHtml(file.name)} · ${formatBytes(file.size)}</div>
    `;

    els.visionPreview.classList.remove("hidden");
    els.clearVisionBtn.disabled = false;
    setStatus("ok", "Изображение прикреплено к следующему сообщению.");
  };

  reader.onerror = () => {
    setStatus("err", "Не удалось прочитать изображение.");
  };

  reader.readAsDataURL(file);
}

function chatToMarkdown(chat) {
  const lines = [];

  lines.push(`# ${chat.title || "Новый чат"}`);
  lines.push("");
  lines.push(`- Created: ${chat.createdAt || ""}`);
  lines.push(`- Updated: ${chat.updatedAt || ""}`);
  lines.push(`- Model: ${chat.modelKey || state.selectedModelKey || ""}`);
  lines.push("");

  for (const message of chat.messages) {
    lines.push(`## ${message.role === "user" ? "User" : "Assistant"}`);
    lines.push("");
    lines.push(message.content || "");
    lines.push("");
  }

  return lines.join("\n");
}

function exportCurrentChat(format) {
  const chat = getActiveChat();
  const name = safeFileName(chat.title || "chat");

  if (format === "md") {
    downloadBlob(`${name}.md`, chatToMarkdown(chat), "text/markdown;charset=utf-8");
    return;
  }

  if (format === "json") {
    downloadBlob(`${name}.json`, JSON.stringify(chat, null, 2), "application/json;charset=utf-8");
    return;
  }

  if (format === "html") {
    const messagesHtml = chat.messages.map((message) => {
      const role = escapeHtml(message.role === "user" ? "User" : "Assistant");
      const body = message.role === "assistant"
        ? markdownToHtml(message.content || "")
        : `<p>${escapeHtml(message.content || "").replace(/\n/g, "<br>")}</p>`;

      return `<section class="msg"><h2>${role}</h2>${body}</section>`;
    }).join("\n");

    const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(chat.title || "Chat")}</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;line-height:1.55;max-width:920px;margin:40px auto;padding:0 20px;color:#111827}
    .msg{border-top:1px solid #e5e7eb;padding:18px 0}
    pre{background:#111827;color:#e5e7eb;padding:14px;border-radius:10px;overflow:auto}
    code{background:#f3f4f6;padding:2px 5px;border-radius:5px}
    pre code{background:transparent;padding:0}
    blockquote{border-left:4px solid #8b5cf6;margin-left:0;padding-left:14px;color:#4b5563}
    table{border-collapse:collapse;width:100%}td,th{border:1px solid #e5e7eb;padding:8px;text-align:left}
  </style>
</head>
<body>
  <h1>${escapeHtml(chat.title || "Chat")}</h1>
  <p>Model: ${escapeHtml(chat.modelKey || state.selectedModelKey || "")}</p>
  ${messagesHtml}
</body>
</html>`;

    downloadBlob(`${name}.html`, html, "text/html;charset=utf-8");
  }
}

function saveComfySettings() {
  state.comfyUrl = normalizeBaseUrl(els.comfyUrl.value || "http://127.0.0.1:8188");
  els.comfyUrl.value = state.comfyUrl;

  localStorage.setItem(STORAGE_KEYS.comfyUrl, state.comfyUrl);
  localStorage.setItem(STORAGE_KEYS.comfyWorkflow, els.comfyWorkflow.value.trim());
  localStorage.setItem(STORAGE_KEYS.comfyPromptPath, els.comfyPromptPath.value.trim());
  localStorage.setItem(STORAGE_KEYS.comfyNegativePath, els.comfyNegativePath.value.trim());
  localStorage.setItem(STORAGE_KEYS.comfySeedPath, els.comfySeedPath.value.trim());
  localStorage.setItem(STORAGE_KEYS.comfyStepsPath, els.comfyStepsPath.value.trim());
  localStorage.setItem(STORAGE_KEYS.comfyWidthPath, els.comfyWidthPath.value.trim());
  localStorage.setItem(STORAGE_KEYS.comfyHeightPath, els.comfyHeightPath.value.trim());
}

function loadFluxKleinWorkflow() {
  els.comfyWorkflow.value = JSON.stringify(FLUX_KLEIN_WORKFLOW, null, 2);
  els.comfyPromptPath.value = "4.inputs.text";
  els.comfyNegativePath.value = "5.inputs.text";
  els.comfySeedPath.value = "7.inputs.seed";
  els.comfyStepsPath.value = "7.inputs.steps";
  els.comfyWidthPath.value = "6.inputs.width";
  els.comfyHeightPath.value = "6.inputs.height";
  els.comfyWidth.value = 512;
  els.comfyHeight.value = 512;
  els.comfySteps.value = 4;

  if (!els.comfyPrompt.value.trim()) {
    els.comfyPrompt.value = FLUX_KLEIN_WORKFLOW["4"].inputs.text;
  }

  if (!els.comfyNegativePrompt.value.trim()) {
    els.comfyNegativePrompt.value = FLUX_KLEIN_WORKFLOW["5"].inputs.text;
  }

  saveComfySettings();
  els.comfyStatus.textContent = "FLUX.2 Klein workflow загружен.";
  setStatus("ok", "FLUX.2 Klein workflow загружен.");
}

function parseComfyWorkflow() {
  const text = els.comfyWorkflow.value.trim();
  if (!text) {
    throw new Error("Вставьте workflow JSON, экспортированный из ComfyUI в API format.");
  }

  const parsed = JSON.parse(text);
  return parsed?.prompt && typeof parsed.prompt === "object" ? structuredClone(parsed.prompt) : structuredClone(parsed);
}

function setWorkflowPath(workflow, pathValue, value) {
  const path = String(pathValue || "").trim();
  if (!path) return;

  const parts = path.split(".").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) {
    throw new Error(`Неверный путь workflow: ${path}`);
  }

  let target = workflow;
  for (let i = 0; i < parts.length - 1; i++) {
    if (target == null || !(parts[i] in target)) {
      throw new Error(`Путь не найден в workflow: ${path}`);
    }
    target = target[parts[i]];
  }

  const key = parts[parts.length - 1];
  if (target == null || !(key in target)) {
    throw new Error(`Поле не найдено в workflow: ${path}`);
  }

  target[key] = value;
}

function getComfySeed() {
  const raw = els.comfySeed.value.trim();
  if (raw) return Math.max(0, Number(raw));
  return Math.floor(Math.random() * 1000000000000000);
}

function buildComfyWorkflow() {
  const workflow = parseComfyWorkflow();
  const prompt = els.comfyPrompt.value.trim();

  if (!prompt) {
    throw new Error("Введите prompt для генерации изображения.");
  }

  if (!els.comfyPromptPath.value.trim()) {
    throw new Error("Укажите Prompt path, например 4.inputs.text.");
  }

  setWorkflowPath(workflow, els.comfyPromptPath.value, prompt);
  setWorkflowPath(workflow, els.comfyNegativePath.value, els.comfyNegativePrompt.value.trim());
  setWorkflowPath(workflow, els.comfySeedPath.value, getComfySeed());
  setWorkflowPath(workflow, els.comfyStepsPath.value, Number(els.comfySteps.value || 4));
  setWorkflowPath(workflow, els.comfyWidthPath.value, Number(els.comfyWidth.value || 1024));
  setWorkflowPath(workflow, els.comfyHeightPath.value, Number(els.comfyHeight.value || 1024));

  return workflow;
}

async function requestComfyJson(path, options = {}) {
  const response = await fetch(comfyEndpoint(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(data?.error?.message || data?.error || data?.message || data?.raw || `HTTP ${response.status}`);
  }

  return data;
}

async function testComfyConnection() {
  try {
    setComfyBusy(true, "Проверка ComfyUI...");
    saveComfySettings();

    const data = await requestComfyJson("/system_stats", { method: "GET" });
    const device = data?.devices?.[0];
    const deviceText = device?.name ? ` · ${device.name}` : "";

    els.comfyStatus.textContent = `ComfyUI доступен${deviceText}`;
    setStatus("ok", `ComfyUI доступен${deviceText}`);
  } catch (error) {
    els.comfyStatus.textContent = `ComfyUI недоступен: ${error.message}`;
    setStatus("err", `ComfyUI недоступен: ${error.message}`);
  } finally {
    setComfyBusy(false);
  }
}

function extractComfyImages(historyItem) {
  const outputs = historyItem?.outputs || {};
  const images = [];

  for (const output of Object.values(outputs)) {
    for (const image of output?.images || []) {
      if (image?.filename) images.push(image);
    }
  }

  return images;
}

async function waitForComfyImages(promptId) {
  const startedAt = Date.now();
  const timeoutMs = 180000;

  while (Date.now() - startedAt < timeoutMs) {
    const history = await requestComfyJson(`/history/${encodeURIComponent(promptId)}`, { method: "GET" });
    const item = history?.[promptId];
    const images = extractComfyImages(item);

    if (images.length) {
      return images;
    }

    const status = item?.status;
    const statusText = String(status?.status_str || "").toLowerCase();

    if (statusText.includes("error")) {
      throw new Error("ComfyUI завершил workflow с ошибкой. Проверьте workflow, node paths и консоль ComfyUI.");
    }

    if (status?.completed === true) {
      throw new Error("ComfyUI завершил workflow, но не вернул изображения.");
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  throw new Error("ComfyUI не вернул изображение за 180 секунд.");
}

function renderComfyImages(images) {
  els.comfyImages.innerHTML = "";

  images.forEach((image, index) => {
    const params = new URLSearchParams({
      filename: image.filename,
      type: image.type || "output",
    });

    if (image.subfolder) params.set("subfolder", image.subfolder);

    const src = comfyEndpoint(`/view?${params.toString()}`);
    const filename = image.filename || `comfy-output-${index + 1}.png`;

    const card = document.createElement("div");
    card.className = "generatedImageCard";
    card.innerHTML = `
      <img src="${escapeHtml(src)}" alt="ComfyUI generated image ${index + 1}">
      <div class="row">
        <a class="downloadLink" href="${escapeHtml(src)}" download="${escapeHtml(filename)}">Скачать</a>
      </div>
    `;

    els.comfyImages.appendChild(card);
  });
}

function useLastAnswerAsComfyPrompt() {
  const chat = getActiveChat();
  const lastAssistant = [...chat.messages].reverse().find((message) => message.role === "assistant" && !message.extraClass);

  if (!lastAssistant?.content) {
    els.comfyStatus.textContent = "В текущем чате нет ответа модели для prompt.";
    setStatus("warn", "В текущем чате нет ответа модели для prompt.");
    return;
  }

  els.comfyPrompt.value = lastAssistant.content.trim();
  els.comfyStatus.textContent = "Последний ответ модели перенесён в ComfyUI prompt.";
  setStatus("ok", "Последний ответ модели перенесён в ComfyUI prompt.");
}

async function generateComfyImage() {
  try {
    setComfyBusy(true, "Отправка workflow в ComfyUI...");
    saveComfySettings();

    const workflow = buildComfyWorkflow();
    const clientId = createId();
    const data = await requestComfyJson("/prompt", {
      method: "POST",
      body: JSON.stringify({
        prompt: workflow,
        client_id: clientId,
      }),
    });

    const promptId = data?.prompt_id;
    if (!promptId) {
      throw new Error("ComfyUI не вернул prompt_id.");
    }

    els.comfyStatus.textContent = `Генерация в очереди: ${promptId}`;
    setStatus("warn", `Генерация в очереди: ${promptId}`);
    const images = await waitForComfyImages(promptId);

    renderComfyImages(images);
    els.comfyStatus.textContent = `Готово: ${images.length} изображ.`;
    setStatus("ok", `Готово: ${images.length} изображ.`);
  } catch (error) {
    els.comfyStatus.textContent = `Ошибка ComfyUI: ${error.message}`;
    setStatus("err", `Ошибка ComfyUI: ${error.message}`);
  } finally {
    setComfyBusy(false);
  }
}

els.connectBtn.addEventListener("click", connect);
els.refreshBtn.addEventListener("click", connect);
els.loadBtn.addEventListener("click", loadSelectedModel);
els.newChatBtn.addEventListener("click", newChat);
els.forgetChatBtn.addEventListener("click", deleteActiveChat);
els.chatForm.addEventListener("submit", sendMessage);

els.visionImageInput.addEventListener("change", () => setVisionImage(els.visionImageInput.files?.[0]));
els.clearVisionBtn.addEventListener("click", clearVisionImage);
els.exportMdBtn.addEventListener("click", () => exportCurrentChat("md"));
els.exportJsonBtn.addEventListener("click", () => exportCurrentChat("json"));
els.exportHtmlBtn.addEventListener("click", () => exportCurrentChat("html"));
els.testComfyBtn.addEventListener("click", testComfyConnection);
els.saveComfyWorkflowBtn.addEventListener("click", () => {
  saveComfySettings();
  els.comfyStatus.textContent = "Настройки ComfyUI сохранены.";
  setStatus("ok", "Настройки ComfyUI сохранены.");
});
els.loadFluxWorkflowBtn.addEventListener("click", loadFluxKleinWorkflow);
els.useLastAnswerAsPromptBtn.addEventListener("click", useLastAnswerAsComfyPrompt);
els.generateComfyBtn.addEventListener("click", generateComfyImage);

els.modelSelect.addEventListener("change", () => {
  const chat = getActiveChat();

  state.selectedModelKey = els.modelSelect.value;
  chat.modelKey = state.selectedModelKey;
  chat.previousResponseId = "";

  localStorage.setItem(STORAGE_KEYS.selectedModel, state.selectedModelKey);
  saveChats();
  renderStats(null);
  renderModelInfo();
});

els.userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    els.chatForm.requestSubmit();
  }
});

getActiveChat();
renderHistory();
renderMessages();
renderHeader();
setStatus("", "Не подключено");
