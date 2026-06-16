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
  attachImageBtn: document.querySelector("#attachImageBtn"),
  visionImageInput: document.querySelector("#visionImageInput"),
  visionPreview: document.querySelector("#visionPreview"),
  modeChatBtn: document.querySelector("#modeChatBtn"),
  modeImageBtn: document.querySelector("#modeImageBtn"),
  composerImageActions: document.querySelector("#composerImageActions"),
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
  comfyNegativePrompt: document.querySelector("#comfyNegativePrompt"),
  comfyWidth: document.querySelector("#comfyWidth"),
  comfyHeight: document.querySelector("#comfyHeight"),
  comfySteps: document.querySelector("#comfySteps"),
  comfySeed: document.querySelector("#comfySeed"),
  useLastAnswerAsPromptBtn: document.querySelector("#useLastAnswerAsPromptBtn"),
  comfyStatus: document.querySelector("#comfyStatus"),
};

const { t, displayChatTitle, isDefaultChatTitle, initUiPreferences, setLanguage, applyTheme } = window.UI_I18N;

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
  lastStatusType: "",
  lastStatusText: "",
};

function defaultChatTitle() {
  return t("newChat");
}

function isTypingContent(content) {
  return content === t("typing") || content === t("generatingImage");
}

function roleLabel(role, message = null) {
  if (role === "user") return t("roleUser");
  if (role === "assistant" && message?.imageUrl) return t("roleGeneratedImage");
  if (role === "assistant") return t("roleAssistant");
  return t("roleSystem");
}

function getComposerMode(chat = getActiveChat()) {
  return chat?.composerMode === "image" ? "image" : "chat";
}

function normalizeChat(chat) {
  if (!chat.composerMode) chat.composerMode = "chat";
  if (!Array.isArray(chat.messages)) chat.messages = [];
  return chat;
}

function refreshUiLanguage() {
  if (state.connected) {
    const total = state.models.length;
    const llms = getChatModels().length;
    const unsupported = state.models.filter(isUnsupportedChatModel).length;
    const loaded = state.models.filter(isLoaded).length;
    setStatus("ok", t("connectedSummary", { total, llms, flux: unsupported, loaded }));
    renderModelSelect();
    renderModelInfo();
  } else {
    setStatus("", t("statusDisconnected"));
  }

  renderHistory();
  renderHeader();
  renderMessages();
  updateComposerUi();
}

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
    return Array.isArray(parsed) ? parsed.map(normalizeChat) : [];
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
      title: defaultChatTitle(),
      messages: [],
      previousResponseId: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modelKey: "",
      composerMode: "chat",
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
    title: defaultChatTitle(),
    messages: [],
    previousResponseId: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modelKey: state.selectedModelKey || "",
    composerMode: "chat",
  };

  state.chats.unshift(chat);
  state.activeChatId = chat.id;
  saveChats();
  renderHistory();
  renderMessages();
  renderHeader();
  updateComposerUi();
}

function deleteChat(chatId) {
  const chat = state.chats.find((item) => item.id === chatId);
  if (!chat) return;

  if (chat.messages.length && !window.confirm(t("deleteChatConfirm"))) {
    return;
  }

  state.chats = state.chats.filter((item) => item.id !== chatId);

  if (state.activeChatId === chatId) {
    state.activeChatId = state.chats[0]?.id || "";
    if (!state.activeChatId) {
      getActiveChat();
    }
  }

  saveChats();
  renderHistory();
  renderMessages();
  renderHeader();
  updateComposerUi();
}

function deleteActiveChat() {
  if (!state.activeChatId) return;
  deleteChat(state.activeChatId);
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
  if (chat.title && !isDefaultChatTitle(chat.title)) return;

  const trimmed = String(text || "").trim().replace(/\s+/g, " ");
  chat.title = trimmed.length > 42 ? `${trimmed.slice(0, 42)}...` : trimmed || defaultChatTitle();
}

function formatDate(value) {
  try {
    const locale = UI_I18N.getLang() === "en" ? "en" : "ru";
    return new Intl.DateTimeFormat(locale, {
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
    els.chatHistory.innerHTML = `<p class="muted">${escapeHtml(t("historyEmpty"))}</p>`;
    return;
  }

  els.chatHistory.innerHTML = "";

  for (const chat of state.chats) {
    const row = document.createElement("div");
    row.className = `historyItemRow ${chat.id === state.activeChatId ? "active" : ""}`.trim();

    const button = document.createElement("button");
    button.type = "button";
    button.className = "historySelect";

    const title = document.createElement("div");
    title.className = "historyTitle";
    title.textContent = displayChatTitle(chat.title);

    const meta = document.createElement("div");
    meta.className = "historyMeta";
    meta.textContent = t("historyMeta", {
      count: chat.messages.length,
      date: formatDate(chat.updatedAt),
    });

    button.appendChild(title);
    button.appendChild(meta);

    button.addEventListener("click", () => {
      state.activeChatId = chat.id;
      localStorage.setItem(STORAGE_KEYS.activeChatId, state.activeChatId);
      renderHistory();
      renderMessages();
      renderHeader();
      updateComposerUi();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "historyDelete";
    deleteBtn.setAttribute("aria-label", t("deleteChatAria"));
    deleteBtn.title = t("deleteChatAria");
    deleteBtn.textContent = "×";
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteChat(chat.id);
    });

    row.appendChild(button);
    row.appendChild(deleteBtn);
    els.chatHistory.appendChild(row);
  }
}

function normalizeBaseUrl(url) {
  return String(url || "").trim().replace(/\/+$/, "");
}

function updateComposerUi() {
  const chat = getActiveChat();
  const mode = getComposerMode(chat);
  const isChatMode = mode === "chat";

  els.modeChatBtn.classList.toggle("active", isChatMode);
  els.modeImageBtn.classList.toggle("active", !isChatMode);
  els.modeChatBtn.setAttribute("aria-pressed", isChatMode ? "true" : "false");
  els.modeImageBtn.setAttribute("aria-pressed", !isChatMode ? "true" : "false");

  els.attachImageBtn.classList.toggle("hidden", !isChatMode);
  els.composerImageActions.classList.toggle("hidden", isChatMode);

  els.userInput.placeholder = isChatMode ? t("userInputPlaceholder") : t("imagePromptPlaceholder");

  els.attachImageBtn.title = t("attachImage");
  els.attachImageBtn.setAttribute("aria-label", t("attachImage"));

  if (!isChatMode) {
    clearVisionImage();
  }

  const canUseChat = state.connected && Boolean(state.selectedModelKey) && !state.busy && !state.comfyBusy;
  const canGenerate = !state.busy && !state.comfyBusy;

  els.userInput.disabled = isChatMode ? !canUseChat : !canGenerate;
  els.sendBtn.disabled = isChatMode ? !canUseChat : !canGenerate;
  els.attachImageBtn.disabled = !isChatMode || !canUseChat;
}

function setComposerMode(mode) {
  const chat = getActiveChat();
  const nextMode = mode === "image" ? "image" : "chat";
  if (getComposerMode(chat) === nextMode) return;

  chat.composerMode = nextMode;
  saveChats();

  const modeLabel = nextMode === "image" ? t("modeImage") : t("modeChat");
  pushMessage("system", t("modeSwitchWarning", { mode: modeLabel }));
  addMessageToDom(chat.messages[chat.messages.length - 1]);

  updateComposerUi();
  renderHeader();
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
  state.lastStatusType = type || "";
  state.lastStatusText = text || "";
  els.statusDot.className = `dot ${type || ""}`.trim();
  els.statusText.textContent = text;
}

function setBusy(isBusy, text = "") {
  state.busy = isBusy;
  els.connectBtn.disabled = isBusy;
  els.refreshBtn.disabled = isBusy;
  els.loadBtn.disabled = isBusy || !state.connected || !state.selectedModelKey;
  els.forgetChatBtn.disabled = isBusy || !state.chats.length;
  updateComposerUi();
  if (text) setStatus("warn", text);
}

function setComfyBusy(isBusy, text = "") {
  state.comfyBusy = isBusy;
  els.testComfyBtn.disabled = isBusy;
  els.saveComfyWorkflowBtn.disabled = isBusy;
  els.useLastAnswerAsPromptBtn.disabled = isBusy;
  updateComposerUi();
  if (text) {
    els.comfyStatus.textContent = text;
    setStatus("warn", text);
  }
}

function formatBytes(bytes) {
  if (!Number.isFinite(Number(bytes))) return t("dash");
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
  if (value === true) return t("yes");
  if (value === false) return t("no");
  return t("dash");
}

function getSelectedModel() {
  return state.models.find((m) => m.key === state.selectedModelKey) || null;
}

function isLoaded(model) {
  return Array.isArray(model?.loaded_instances) && model.loaded_instances.length > 0;
}

function getLoadedInstanceIds(model) {
  if (!Array.isArray(model?.loaded_instances)) return [];
  return model.loaded_instances
    .map((instance) => instance?.id || instance?.instance_id)
    .filter(Boolean);
}

async function refreshModels() {
  const data = await requestJson("/api/v1/models", { method: "GET" });
  state.models = Array.isArray(data?.models) ? data.models : Array.isArray(data) ? data : [];
  return state.models;
}

async function unloadModelInstances(model) {
  const instanceIds = getLoadedInstanceIds(model);
  if (!instanceIds.length) return 0;

  for (const instanceId of instanceIds) {
    await requestJson("/api/v1/models/unload", {
      method: "POST",
      body: JSON.stringify({ instance_id: instanceId }),
    });
  }

  return instanceIds.length;
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
    option.textContent = unsupported.length ? t("noChatModelsFlux") : t("noLlmModels");
    els.modelSelect.appendChild(option);
    els.modelSelect.disabled = true;
    state.selectedModelKey = "";
    localStorage.removeItem(STORAGE_KEYS.selectedModel);
    return;
  }

  for (const model of llms) {
    const option = document.createElement("option");
    option.value = model.key;
    option.textContent = `${model.display_name || model.key}${isLoaded(model) ? t("loadedSuffix") : ""}`;
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
      ? `<p class="hint">${escapeHtml(t("hiddenImageModels", { count: unsupported.length }))}</p>`
      : "";
    els.modelInfo.innerHTML = `<p class="muted">${escapeHtml(t("modelNotSelected"))}</p>${note}`;
    return;
  }

  const q = model.quantization || {};
  const caps = model.capabilities || {};
  const reasoning = caps.reasoning || {};
  const firstInstance = Array.isArray(model.loaded_instances) ? model.loaded_instances[0] : null;
  const config = firstInstance?.config || {};

  const rows = [
    [t("labelStatus"), isLoaded(model) ? t("statusLoaded") : t("statusNotLoaded")],
    [t("labelName"), model.display_name || t("dash")],
    [t("labelKey"), model.key || t("dash")],
    [t("labelPublisher"), model.publisher || t("dash")],
    [t("labelType"), model.type || t("dash")],
    [t("labelArchitecture"), model.architecture || t("dash")],
    [t("labelParams"), model.params_string || t("dash")],
    [t("labelQuantization"), q.name ? `${q.name}${q.bits_per_weight ? ` / ${q.bits_per_weight} ${t("bit")}` : ""}` : t("dash")],
    [t("labelSize"), formatBytes(model.size_bytes)],
    [t("labelFormat"), model.format || t("dash")],
    [t("labelMaxContext"), model.max_context_length ? `${model.max_context_length} ${t("tokens")}` : t("dash")],
    [t("labelLoadedContext"), config.context_length ? `${config.context_length} ${t("tokens")}` : t("dash")],
    [t("labelVision"), yesNo(caps.vision)],
    [t("labelToolUse"), yesNo(caps.trained_for_tool_use)],
    [t("labelReasoning"), reasoning.default || t("dash")],
  ];

  els.modelInfo.innerHTML = rows
    .map(([label, value]) => `<div class="infoRow"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`)
    .join("");

  els.loadBtn.textContent = isLoaded(model) ? t("reloadModel") : t("loadModel");
  renderHeader();
}

function renderHeader() {
  const chat = getActiveChat();
  const model = getSelectedModel();

  els.chatTitle.textContent = displayChatTitle(chat.title);

  if (model) {
    els.chatSubtitle.textContent = `${model.display_name || model.key} · ${state.baseUrl} · ${isLoaded(model) ? t("modelLoaded") : t("modelNotLoadedShort")}`;
  } else {
    els.chatSubtitle.textContent = t("connectThenSelect");
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
        <h3>${escapeHtml(t("emptyChatTitle"))}</h3>
        <p>${escapeHtml(t("emptyChatText"))}</p>
      </div>
    `;
    return;
  }

  for (const message of chat.messages) {
    addMessageToDom(message);
  }

  els.messages.scrollTop = els.messages.scrollHeight;
}

function clearEmptyScreen() {
  const empty = els.messages.querySelector(".empty");
  if (empty) empty.remove();
}

function addMessageToDom(message) {
  clearEmptyScreen();

  const role = message.role;
  const text = message.content || "";
  const extraClass = message.extraClass || "";

  const wrap = document.createElement("div");
  wrap.className = `message ${role} ${extraClass}`.trim();

  if (role === "system") {
    const bubble = document.createElement("div");
    bubble.className = "bubble systemBubble";
    bubble.textContent = text;
    wrap.appendChild(bubble);
    els.messages.appendChild(wrap);
    els.messages.scrollTop = els.messages.scrollHeight;
    return wrap;
  }

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = roleLabel(role, message);

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  if (message.imageUrl) bubble.classList.add("imageBubble");

  const displayText = role === "assistant" && isTypingContent(text)
    ? (text === t("generatingImage") ? t("generatingImage") : t("typing"))
    : text;

  if (role === "assistant" && message.imageUrl) {
    bubble.classList.add("markdownBody");
    if (displayText) {
      const caption = document.createElement("div");
      caption.className = "imageCaption";
      caption.innerHTML = markdownToHtml(displayText);
      bubble.appendChild(caption);
    }
    const img = document.createElement("img");
    img.src = message.imageUrl;
    img.alt = message.imageFilename || t("comfyGeneratedAlt", { index: 1 });
    bubble.appendChild(img);
    if (message.imageUrl) {
      const linkRow = document.createElement("div");
      linkRow.className = "row imageActions";
      const downloadLink = document.createElement("a");
      downloadLink.className = "downloadLink";
      downloadLink.href = message.imageUrl;
      downloadLink.download = message.imageFilename || "generated-image.png";
      downloadLink.textContent = t("download");
      linkRow.appendChild(downloadLink);
      bubble.appendChild(linkRow);
    }
  } else if (role === "assistant") {
    bubble.classList.add("markdownBody");
    bubble.innerHTML = markdownToHtml(displayText);
  } else {
    bubble.textContent = displayText;
  }

  wrap.appendChild(meta);
  wrap.appendChild(bubble);
  els.messages.appendChild(wrap);
  els.messages.scrollTop = els.messages.scrollHeight;

  return bubble;
}

function pushMessage(role, content, extra = {}) {
  const chat = getActiveChat();
  const message = {
    role,
    content,
    extraClass: extra.extraClass || "",
    createdAt: new Date().toISOString(),
    imageUrl: extra.imageUrl || "",
    imageFilename: extra.imageFilename || "",
  };

  chat.messages.push(message);
  touchChat(chat);
  return message;
}

function addMessage(role, text, extraClass = "") {
  const message = pushMessage(role, text, { extraClass });
  addMessageToDom(message);
  return message;
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
    setBusy(true, t("connecting"));

    state.baseUrl = normalizeBaseUrl(els.serverUrl.value);
    state.token = els.apiToken.value.trim();

    if (!state.baseUrl) throw new Error(t("enterLmStudioUrl"));

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

    setStatus("ok", t("connectedSummary", { total, llms, flux: unsupported, loaded }));
    els.forgetChatBtn.disabled = false;
    renderHeader();
    updateComposerUi();
  } catch (error) {
    state.connected = false;
    setStatus("err", `${t("errorPrefix")}: ${error.message}`);
    els.modelInfo.innerHTML = `<p class="muted">${escapeHtml(t("connectFailedInfo"))}</p>`;
    addMessage("assistant", t("connectFailedMessage", { message: error.message }), "error");
  } finally {
    setBusy(false);
  }
}

async function loadSelectedModel() {
  const model = getSelectedModel();
  if (!model) return;

  if (isUnsupportedChatModel(model)) {
    addMessage("assistant", t("fluxModelError"), "error");
    return;
  }

  try {
    setBusy(true, t("loadingModel"));

    await refreshModels();
    const freshModel = getSelectedModel();
    if (!freshModel) throw new Error(t("modelNotSelected"));

    if (isLoaded(freshModel)) {
      setBusy(true, t("unloadingModel"));
      await unloadModelInstances(freshModel);
      await refreshModels();
    }

    setBusy(true, t("loadingModel"));

    const data = await requestJson("/api/v1/models/load", {
      method: "POST",
      body: JSON.stringify({
        model: freshModel.key,
        echo_load_config: true,
      }),
    });

    addMessage("assistant", t("modelLoadedMessage", {
      id: data.instance_id || freshModel.key,
      status: data.status || "loaded",
      time: data.load_time_seconds ?? t("dash"),
    }));
    await connect();
  } catch (error) {
    setStatus("err", `${t("errorPrefix")}: ${error.message}`);
    addMessage("assistant", t("modelLoadFailed", { message: error.message }), "error");
  } finally {
    setBusy(false);
  }
}

async function handleChatFormSubmit(event) {
  event.preventDefault();

  if (getComposerMode() === "image") {
    await generateComfyImageFromComposer();
    return;
  }

  await sendMessage();
}

async function sendMessage() {
  const text = els.userInput.value.trim();
  const model = getSelectedModel();
  const chat = getActiveChat();

  if (!text || !model || state.busy || state.comfyBusy) return;

  els.userInput.value = "";
  setChatTitleFromMessage(chat, text);
  chat.modelKey = model.key;
  addMessage("user", state.visionImageDataUrl ? `${text}\n\n${t("imageAttached", { name: state.visionImageName || "image" })}` : text);
  renderHeader();

  const assistantMessage = pushMessage("assistant", t("typing"));
  const assistantBubble = addMessageToDom(assistantMessage);
  assistantBubble.parentElement.classList.add("loading");

  try {
    setBusy(true, t("generating"));

    if (state.visionImageDataUrl && !modelHasVision(model)) {
      throw new Error(t("visionNotSupported"));
    }

    const input = state.visionImageDataUrl
      ? [
          { type: "text", content: text },
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
    setStatus("ok", t("done"));
  } catch (error) {
    const errorText = t("requestError", { message: error.message });
    assistantMessage.content = errorText;
    assistantMessage.extraClass = "error";
    assistantBubble.innerHTML = markdownToHtml(errorText);
    assistantBubble.parentElement.classList.add("error");

    touchChat(chat);
    setStatus("err", `${t("errorPrefix")}: ${error.message}`);
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
}

function setVisionImage(file) {
  if (!file || getComposerMode() !== "chat") return;

  if (!file.type.startsWith("image/")) {
    setStatus("err", t("pickImageType"));
    return;
  }

  const maxSize = 8 * 1024 * 1024;
  if (file.size > maxSize) {
    setStatus("err", t("imageTooLarge"));
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    state.visionImageDataUrl = String(reader.result || "");
    state.visionImageName = file.name;

    els.visionPreview.innerHTML = `
      <div class="previewRow">
        <img src="${state.visionImageDataUrl}" alt="${escapeHtml(t("imagePreviewAlt"))}">
        <div class="previewMeta">
          <div class="fileMeta">${escapeHtml(file.name)} · ${formatBytes(file.size)}</div>
          <button type="button" class="btn small previewRemoveBtn">${escapeHtml(t("previewRemove"))}</button>
        </div>
      </div>
    `;

    els.visionPreview.querySelector(".previewRemoveBtn")?.addEventListener("click", clearVisionImage);
    els.visionPreview.classList.remove("hidden");
    setStatus("ok", t("imageAttachedNext"));
  };

  reader.onerror = () => {
    setStatus("err", t("imageReadFailed"));
  };

  reader.readAsDataURL(file);
}

function chatToMarkdown(chat) {
  const lines = [];

  lines.push(`# ${displayChatTitle(chat.title)}`);
  lines.push("");
  lines.push(`- Created: ${chat.createdAt || ""}`);
  lines.push(`- Updated: ${chat.updatedAt || ""}`);
  lines.push(`- Model: ${chat.modelKey || state.selectedModelKey || ""}`);
  lines.push("");

  for (const message of chat.messages) {
    if (message.role === "system") {
      lines.push(`> ${message.content || ""}`);
      lines.push("");
      continue;
    }

    const roleLabelText = message.role === "user"
      ? t("exportUser")
      : message.imageUrl
        ? t("roleGeneratedImage")
        : t("exportAssistant");

    lines.push(`## ${roleLabelText}`);
    lines.push("");
    lines.push(message.content || "");
    if (message.imageUrl) {
      lines.push("");
      lines.push(`${t("generatedImageNote")} ${message.imageUrl}`);
    }
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
      if (message.role === "system") {
        return `<section class="msg system"><p>${escapeHtml(message.content || "")}</p></section>`;
      }

      const role = escapeHtml(
        message.role === "user"
          ? t("exportUser")
          : message.imageUrl
            ? t("roleGeneratedImage")
            : t("exportAssistant")
      );

      let body = "";
      if (message.imageUrl) {
        body += `<p><img src="${escapeHtml(message.imageUrl)}" alt="${escapeHtml(message.imageFilename || "generated")}" style="max-width:100%;border-radius:12px"></p>`;
      }
      if (message.role === "assistant") {
        body += markdownToHtml(message.content || "");
      } else {
        body += `<p>${escapeHtml(message.content || "").replace(/\n/g, "<br>")}</p>`;
      }

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

  if (!els.comfyNegativePrompt.value.trim()) {
    els.comfyNegativePrompt.value = FLUX_KLEIN_WORKFLOW["5"].inputs.text;
  }

  saveComfySettings();
  els.comfyStatus.textContent = t("fluxWorkflowLoaded");
  setStatus("ok", t("fluxWorkflowLoaded"));
}

function parseComfyWorkflow() {
  const text = els.comfyWorkflow.value.trim();
  if (!text) {
    throw new Error(t("pasteWorkflowJson"));
  }

  const parsed = JSON.parse(text);
  return parsed?.prompt && typeof parsed.prompt === "object" ? structuredClone(parsed.prompt) : structuredClone(parsed);
}

function setWorkflowPath(workflow, pathValue, value) {
  const path = String(pathValue || "").trim();
  if (!path) return;

  const parts = path.split(".").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) {
    throw new Error(t("invalidWorkflowPath", { path }));
  }

  let target = workflow;
  for (let i = 0; i < parts.length - 1; i++) {
    if (target == null || !(parts[i] in target)) {
      throw new Error(t("workflowPathNotFound", { path }));
    }
    target = target[parts[i]];
  }

  const key = parts[parts.length - 1];
  if (target == null || !(key in target)) {
    throw new Error(t("workflowFieldNotFound", { path }));
  }

  target[key] = value;
}

function getComfySeed() {
  const raw = els.comfySeed.value.trim();
  if (raw) return Math.max(0, Number(raw));
  return Math.floor(Math.random() * 1000000000000000);
}

function buildComfyWorkflow(promptText) {
  const workflow = parseComfyWorkflow();
  const prompt = String(promptText || "").trim();

  if (!prompt) {
    throw new Error(t("enterImagePrompt"));
  }

  if (!els.comfyPromptPath.value.trim()) {
    throw new Error(t("enterPromptPath"));
  }

  setWorkflowPath(workflow, els.comfyPromptPath.value, prompt);
  setWorkflowPath(workflow, els.comfyNegativePath.value, els.comfyNegativePrompt.value.trim());
  setWorkflowPath(workflow, els.comfySeedPath.value, getComfySeed());
  setWorkflowPath(workflow, els.comfyStepsPath.value, Number(els.comfySteps.value || 4));
  setWorkflowPath(workflow, els.comfyWidthPath.value, Number(els.comfyWidth.value || 1024));
  setWorkflowPath(workflow, els.comfyHeightPath.value, Number(els.comfyHeight.value || 1024));

  return workflow;
}

function comfyImageUrl(image) {
  const params = new URLSearchParams({
    filename: image.filename,
    type: image.type || "output",
  });

  if (image.subfolder) params.set("subfolder", image.subfolder);

  return comfyEndpoint(`/view?${params.toString()}`);
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
    setComfyBusy(true, t("checkingComfy"));
    saveComfySettings();

    const data = await requestComfyJson("/system_stats", { method: "GET" });
    const device = data?.devices?.[0];
    const deviceText = device?.name ? ` · ${device.name}` : "";

    els.comfyStatus.textContent = t("comfyAvailable", { device: deviceText });
    setStatus("ok", t("comfyAvailable", { device: deviceText }));
  } catch (error) {
    els.comfyStatus.textContent = t("comfyUnavailable", { message: error.message });
    setStatus("err", t("comfyUnavailable", { message: error.message }));
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
      throw new Error(t("comfyWorkflowError"));
    }

    if (status?.completed === true) {
      throw new Error(t("comfyNoImages"));
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  throw new Error(t("comfyTimeout"));
}

function useLastAnswerAsComfyPrompt() {
  const chat = getActiveChat();
  const lastAssistant = [...chat.messages].reverse().find((message) => (
    message.role === "assistant"
    && !message.extraClass
    && !message.imageUrl
    && !isTypingContent(message.content)
  ));

  if (!lastAssistant?.content) {
    els.comfyStatus.textContent = t("noAssistantForPrompt");
    setStatus("warn", t("noAssistantForPrompt"));
    return;
  }

  els.userInput.value = lastAssistant.content.trim();
  els.comfyStatus.textContent = t("lastAnswerToPrompt");
  setStatus("ok", t("lastAnswerToPrompt"));
  els.userInput.focus();
}

async function generateComfyImageFromComposer() {
  const prompt = els.userInput.value.trim();
  if (!prompt || state.busy || state.comfyBusy) return;

  const chat = getActiveChat();
  els.userInput.value = "";
  setChatTitleFromMessage(chat, prompt);
  addMessage("user", prompt);
  renderHeader();

  const assistantMessage = pushMessage("assistant", t("generatingImage"));
  renderMessages();

  try {
    setComfyBusy(true, t("sendingWorkflow"));
    saveComfySettings();

    const workflow = buildComfyWorkflow(prompt);
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
      throw new Error(t("comfyNoPromptId"));
    }

    els.comfyStatus.textContent = t("queuePrompt", { id: promptId });
    setStatus("warn", t("queuePrompt", { id: promptId }));
    const images = await waitForComfyImages(promptId);
    const image = images[0];
    const filename = image.filename || "generated-image.png";

    assistantMessage.content = "";
    assistantMessage.imageUrl = comfyImageUrl(image);
    assistantMessage.imageFilename = filename;
    touchChat(chat);

    els.comfyStatus.textContent = t("imagesReady", { count: images.length });
    setStatus("ok", t("imagesReady", { count: images.length }));
  } catch (error) {
    assistantMessage.content = t("comfyErrorPrefix", { message: error.message });
    assistantMessage.extraClass = "error";
    touchChat(chat);
    els.comfyStatus.textContent = t("comfyErrorPrefix", { message: error.message });
    setStatus("err", t("comfyErrorPrefix", { message: error.message }));
  } finally {
    setComfyBusy(false);
    renderMessages();
    els.userInput.focus();
  }
}

els.connectBtn.addEventListener("click", connect);
els.refreshBtn.addEventListener("click", connect);
els.loadBtn.addEventListener("click", loadSelectedModel);
els.newChatBtn.addEventListener("click", newChat);
els.forgetChatBtn.addEventListener("click", deleteActiveChat);
els.chatForm.addEventListener("submit", handleChatFormSubmit);

els.attachImageBtn.addEventListener("click", () => els.visionImageInput.click());
els.visionImageInput.addEventListener("change", () => setVisionImage(els.visionImageInput.files?.[0]));
els.modeChatBtn.addEventListener("click", () => setComposerMode("chat"));
els.modeImageBtn.addEventListener("click", () => setComposerMode("image"));
els.exportMdBtn.addEventListener("click", () => exportCurrentChat("md"));
els.exportJsonBtn.addEventListener("click", () => exportCurrentChat("json"));
els.exportHtmlBtn.addEventListener("click", () => exportCurrentChat("html"));
els.testComfyBtn.addEventListener("click", testComfyConnection);
els.saveComfyWorkflowBtn.addEventListener("click", () => {
  saveComfySettings();
  els.comfyStatus.textContent = t("comfySettingsSaved");
  setStatus("ok", t("comfySettingsSaved"));
});
els.loadFluxWorkflowBtn.addEventListener("click", loadFluxKleinWorkflow);
els.useLastAnswerAsPromptBtn.addEventListener("click", useLastAnswerAsComfyPrompt);

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

initUiPreferences({ onLanguageChange: refreshUiLanguage });

document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
  btn.addEventListener("click", () => {
    setLanguage(btn.getAttribute("data-lang-btn"));
  });
});

document.querySelectorAll("[data-theme-btn]").forEach((btn) => {
  btn.addEventListener("click", () => {
    applyTheme(btn.getAttribute("data-theme-btn"));
  });
});

getActiveChat();
renderHistory();
renderMessages();
renderHeader();
updateComposerUi();
setStatus("", t("statusDisconnected"));
