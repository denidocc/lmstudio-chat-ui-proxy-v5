(function () {
  const STORAGE = {
    lang: "lm_ui_lang",
    theme: "lm_ui_theme",
  };

  const DEFAULT_CHAT_TITLE = {
    ru: "Новый чат",
    en: "New chat",
  };

  const I18N = {
    ru: {
      pageTitle: "LM Studio LAN Chat",
      brandSubtitle: "UI + proxy + Markdown + файлы",
      langLabel: "Язык",
      themeLabel: "Тема",
      langRu: "RU",
      langEn: "EN",
      themeDark: "Тёмная",
      themeLight: "Светлая",
      lmStudioUrl: "Адрес LM Studio",
      apiToken: "API Token",
      apiTokenHint: "(если включена авторизация)",
      apiTokenPlaceholder: "Оставить пустым, если токен не нужен",
      connect: "Подключиться",
      refresh: "Обновить",
      statusDisconnected: "Не подключено",
      history: "История",
      newChat: "Новый чат",
      historyEmpty: "История пока пустая.",
      historyMeta: "{count} сообщ. · {date}",
      panelModel: "Модель",
      panelToggle: "скрыть / раскрыть",
      selectedModel: "Выбранная модель",
      connectFirst: "Сначала подключитесь",
      loadModel: "Загрузить модель",
      reloadModel: "Перезагрузить модель",
      deleteChat: "Удалить чат",
      modelInfoPlaceholder: "Информация появится после подключения.",
      panelParams: "Параметры",
      panelParamsHint: "system prompt / tokens",
      systemPrompt: "System prompt",
      systemPromptPlaceholder: "Например: Отвечай кратко и по делу.",
      temperature: "Temperature",
      maxTokens: "Max tokens",
      panelVision: "Vision / изображение",
      panelVisionHint: "прикрепить картинку к вопросу",
      visionHint: "Работает только если выбранная модель имеет <b>Vision: Да</b>. Это анализ изображения, не генерация.",
      visionImage: "Изображение для следующего сообщения",
      clearVision: "Убрать изображение",
      panelExport: "Файлы / экспорт",
      panelExportHint: "скачать чат",
      exportHint: "Скачивание работает локально в браузере. Файлы сохраняются на вашем устройстве.",
      exportMd: "Скачать .md",
      exportJson: "Скачать .json",
      exportHtml: "Скачать .html",
      panelComfy: "Настройки ComfyUI",
      panelComfyHint: "FLUX / workflow API",
      comfyUrl: "ComfyUI URL",
      testComfy: "Проверить ComfyUI",
      saveComfyWorkflow: "Сохранить workflow",
      loadFluxWorkflow: "Загрузить FLUX workflow",
      workflowJson: "Workflow API JSON",
      workflowPlaceholder: "Вставьте workflow, экспортированный из ComfyUI в API format",
      promptPath: "Prompt path",
      negativePath: "Negative path",
      seedPath: "Seed path",
      stepsPath: "Steps path",
      widthPath: "Width path",
      heightPath: "Height path",
      prompt: "Prompt",
      useLastAnswer: "Взять последний ответ",
      negativePrompt: "Negative prompt",
      width: "Width",
      height: "Height",
      steps: "Steps",
      seed: "Seed",
      seedPlaceholder: "пусто = случайный",
      generate: "Сгенерировать",
      chatTitle: "Чат",
      chatSubtitleDefault: "Запусти start-файл, затем подключи LM Studio.",
      userInputPlaceholder: "Напишите сообщение...",
      send: "Отправить",
      emptyChatTitle: "Новый чат",
      emptyChatText: "Введите сообщение внизу. История будет сохранена в этом браузере.",
      roleUser: "Вы",
      roleAssistant: "Модель",
      roleSystem: "Система",
      yes: "Да",
      no: "Нет",
      dash: "—",
      loadedSuffix: " — loaded",
      noChatModelsFlux: "Чат-модели не найдены (FLUX скрыт)",
      noLlmModels: "LLM модели не найдены",
      modelNotSelected: "Модель не выбрана.",
      hiddenImageModels: "Скрыто image/diffusion моделей: {count}. FLUX запускается через ComfyUI, не через LM Studio Chat API.",
      statusLoaded: "Загружена",
      statusNotLoaded: "Не загружена",
      labelName: "Название",
      labelKey: "Ключ",
      labelPublisher: "Publisher",
      labelType: "Тип",
      labelArchitecture: "Архитектура",
      labelParams: "Параметры",
      labelQuantization: "Квантизация",
      labelSize: "Размер",
      labelFormat: "Формат",
      labelMaxContext: "Max context",
      labelLoadedContext: "Loaded context",
      labelVision: "Vision",
      labelToolUse: "Tool use",
      labelReasoning: "Reasoning",
      labelStatus: "Статус",
      tokens: "tokens",
      bit: "bit",
      modelLoaded: "модель загружена",
      modelNotLoadedShort: "модель не загружена",
      connectThenSelect: "Подключите LM Studio сервер, затем выберите модель.",
      connecting: "Подключение через proxy...",
      enterLmStudioUrl: "Введите адрес LM Studio сервера.",
      connectedSummary: "Подключено · моделей: {total}, чат: {llms}, image/flux: {flux}, загружено: {loaded}",
      errorPrefix: "Ошибка",
      connectFailedInfo: "Не удалось подключиться. Проверьте адрес, сеть, Firewall и API token.",
      connectFailedMessage: "Не удалось подключиться к LM Studio.\n\n{message}",
      fluxModelError: "Эта модель похожа на FLUX/image/diffusion модель. Её нельзя загрузить через LM Studio Chat API. Используйте блок ComfyUI / изображения.",
      loadingModel: "Загрузка модели...",
      unloadingModel: "Выгрузка предыдущих экземпляров...",
      modelLoadedMessage: "Модель загружена: {id}\nСтатус: {status}\nВремя загрузки: {time}s",
      modelLoadFailed: "Не удалось загрузить модель.\n\n{message}",
      imageAttached: "[Изображение прикреплено: {name}]",
      typing: "Печатает...",
      generating: "Генерация ответа...",
      visionNotSupported: "К выбранной модели нельзя отправить изображение: Vision = Нет.",
      done: "Готово",
      requestError: "Ошибка запроса.\n\n{message}",
      pickImageType: "Выберите PNG/JPEG/WebP изображение.",
      imageTooLarge: "Изображение слишком большое. Максимум 8 MB.",
      imageAttachedNext: "Изображение прикреплено к следующему сообщению.",
      imageReadFailed: "Не удалось прочитать изображение.",
      imagePreviewAlt: "Предпросмотр изображения",
      comfySettingsSaved: "Настройки ComfyUI сохранены.",
      fluxWorkflowLoaded: "FLUX.2 Klein workflow загружен.",
      pasteWorkflowJson: "Вставьте workflow JSON, экспортированный из ComfyUI в API format.",
      invalidWorkflowPath: "Неверный путь workflow: {path}",
      workflowPathNotFound: "Путь не найден в workflow: {path}",
      workflowFieldNotFound: "Поле не найдено в workflow: {path}",
      enterImagePrompt: "Введите prompt для генерации изображения.",
      enterPromptPath: "Укажите Prompt path, например 4.inputs.text.",
      checkingComfy: "Проверка ComfyUI...",
      comfyAvailable: "ComfyUI доступен{device}",
      comfyUnavailable: "ComfyUI недоступен: {message}",
      comfyWorkflowError: "ComfyUI завершил workflow с ошибкой. Проверьте workflow, node paths и консоль ComfyUI.",
      comfyNoImages: "ComfyUI завершил workflow, но не вернул изображения.",
      comfyTimeout: "ComfyUI не вернул изображение за 180 секунд.",
      comfyGeneratedAlt: "Сгенерированное изображение ComfyUI {index}",
      download: "Скачать",
      noAssistantForPrompt: "В текущем чате нет ответа модели для prompt.",
      lastAnswerToPrompt: "Последний ответ модели перенесён в ComfyUI prompt.",
      sendingWorkflow: "Отправка workflow в ComfyUI...",
      comfyNoPromptId: "ComfyUI не вернул prompt_id.",
      queuePrompt: "Генерация в очереди: {id}",
      imagesReady: "Готово: {count} изображ.",
      comfyErrorPrefix: "Ошибка ComfyUI: {message}",
      exportUser: "User",
      exportAssistant: "Assistant",
      modeChat: "Чат",
      modeImage: "Изображение",
      modeSwitchWarning: "Режим изменён: {mode}. LM Studio и ComfyUI используют разные модели и не делят контекст.",
      imagePromptPlaceholder: "Prompt для генерации изображения...",
      attachImage: "Прикрепить изображение",
      deleteChatConfirm: "Удалить этот чат?",
      deleteChatAria: "Удалить чат",
      roleGeneratedImage: "ComfyUI",
      generatedImageNote: "[Сгенерированное изображение]",
      generatingImage: "Генерация изображения...",
      exportSystem: "System",
      previewRemove: "Убрать",
    },
    en: {
      pageTitle: "LM Studio LAN Chat",
      brandSubtitle: "UI + proxy + Markdown + files",
      langLabel: "Language",
      themeLabel: "Theme",
      langRu: "RU",
      langEn: "EN",
      themeDark: "Dark",
      themeLight: "Light",
      lmStudioUrl: "LM Studio address",
      apiToken: "API Token",
      apiTokenHint: "(if authentication is enabled)",
      apiTokenPlaceholder: "Leave empty if no token is required",
      connect: "Connect",
      refresh: "Refresh",
      statusDisconnected: "Not connected",
      history: "History",
      newChat: "New chat",
      historyEmpty: "No chat history yet.",
      historyMeta: "{count} msgs · {date}",
      panelModel: "Model",
      panelToggle: "collapse / expand",
      selectedModel: "Selected model",
      connectFirst: "Connect first",
      loadModel: "Load model",
      reloadModel: "Reload model",
      deleteChat: "Delete chat",
      modelInfoPlaceholder: "Model info will appear after connecting.",
      panelParams: "Parameters",
      panelParamsHint: "system prompt / tokens",
      systemPrompt: "System prompt",
      systemPromptPlaceholder: "Example: Reply briefly and clearly.",
      temperature: "Temperature",
      maxTokens: "Max tokens",
      panelVision: "Vision / image",
      panelVisionHint: "attach an image to your message",
      visionHint: "Works only when the selected model has <b>Vision: Yes</b>. This is image analysis, not generation.",
      visionImage: "Image for the next message",
      clearVision: "Remove image",
      panelExport: "Files / export",
      panelExportHint: "download chat",
      exportHint: "Export runs locally in the browser. Files are saved on your device.",
      exportMd: "Download .md",
      exportJson: "Download .json",
      exportHtml: "Download .html",
      panelComfy: "ComfyUI settings",
      panelComfyHint: "FLUX / workflow API",
      comfyUrl: "ComfyUI URL",
      testComfy: "Test ComfyUI",
      saveComfyWorkflow: "Save workflow",
      loadFluxWorkflow: "Load FLUX workflow",
      workflowJson: "Workflow API JSON",
      workflowPlaceholder: "Paste workflow exported from ComfyUI in API format",
      promptPath: "Prompt path",
      negativePath: "Negative path",
      seedPath: "Seed path",
      stepsPath: "Steps path",
      widthPath: "Width path",
      heightPath: "Height path",
      prompt: "Prompt",
      useLastAnswer: "Use last answer",
      negativePrompt: "Negative prompt",
      width: "Width",
      height: "Height",
      steps: "Steps",
      seed: "Seed",
      seedPlaceholder: "empty = random",
      generate: "Generate",
      chatTitle: "Chat",
      chatSubtitleDefault: "Run the start file, then connect LM Studio.",
      userInputPlaceholder: "Write a message...",
      send: "Send",
      emptyChatTitle: "New chat",
      emptyChatText: "Type a message below. History is saved in this browser.",
      roleUser: "You",
      roleAssistant: "Model",
      roleSystem: "System",
      yes: "Yes",
      no: "No",
      dash: "—",
      loadedSuffix: " — loaded",
      noChatModelsFlux: "No chat models found (FLUX hidden)",
      noLlmModels: "No LLM models found",
      modelNotSelected: "No model selected.",
      hiddenImageModels: "Hidden image/diffusion models: {count}. FLUX runs via ComfyUI, not LM Studio Chat API.",
      statusLoaded: "Loaded",
      statusNotLoaded: "Not loaded",
      labelName: "Name",
      labelKey: "Key",
      labelPublisher: "Publisher",
      labelType: "Type",
      labelArchitecture: "Architecture",
      labelParams: "Parameters",
      labelQuantization: "Quantization",
      labelSize: "Size",
      labelFormat: "Format",
      labelMaxContext: "Max context",
      labelLoadedContext: "Loaded context",
      labelVision: "Vision",
      labelToolUse: "Tool use",
      labelReasoning: "Reasoning",
      labelStatus: "Status",
      tokens: "tokens",
      bit: "bit",
      modelLoaded: "model loaded",
      modelNotLoadedShort: "model not loaded",
      connectThenSelect: "Connect to LM Studio, then select a model.",
      connecting: "Connecting via proxy...",
      enterLmStudioUrl: "Enter the LM Studio server address.",
      connectedSummary: "Connected · models: {total}, chat: {llms}, image/flux: {flux}, loaded: {loaded}",
      errorPrefix: "Error",
      connectFailedInfo: "Could not connect. Check address, network, firewall, and API token.",
      connectFailedMessage: "Could not connect to LM Studio.\n\n{message}",
      fluxModelError: "This model looks like a FLUX/image/diffusion model. It cannot be loaded via LM Studio Chat API. Use the ComfyUI / images panel.",
      loadingModel: "Loading model...",
      unloadingModel: "Unloading previous instances...",
      modelLoadedMessage: "Model loaded: {id}\nStatus: {status}\nLoad time: {time}s",
      modelLoadFailed: "Could not load model.\n\n{message}",
      imageAttached: "[Image attached: {name}]",
      typing: "Typing...",
      generating: "Generating reply...",
      visionNotSupported: "The selected model does not accept images: Vision = No.",
      done: "Done",
      requestError: "Request error.\n\n{message}",
      pickImageType: "Choose a PNG/JPEG/WebP image.",
      imageTooLarge: "Image is too large. Maximum 8 MB.",
      imageAttachedNext: "Image attached to the next message.",
      imageReadFailed: "Could not read the image.",
      imagePreviewAlt: "Attached image preview",
      comfySettingsSaved: "ComfyUI settings saved.",
      fluxWorkflowLoaded: "FLUX.2 Klein workflow loaded.",
      pasteWorkflowJson: "Paste workflow JSON exported from ComfyUI in API format.",
      invalidWorkflowPath: "Invalid workflow path: {path}",
      workflowPathNotFound: "Path not found in workflow: {path}",
      workflowFieldNotFound: "Field not found in workflow: {path}",
      enterImagePrompt: "Enter a prompt for image generation.",
      enterPromptPath: "Set Prompt path, e.g. 4.inputs.text.",
      checkingComfy: "Checking ComfyUI...",
      comfyAvailable: "ComfyUI is available{device}",
      comfyUnavailable: "ComfyUI unavailable: {message}",
      comfyWorkflowError: "ComfyUI finished the workflow with an error. Check workflow, node paths, and ComfyUI console.",
      comfyNoImages: "ComfyUI finished the workflow but returned no images.",
      comfyTimeout: "ComfyUI did not return an image within 180 seconds.",
      comfyGeneratedAlt: "ComfyUI generated image {index}",
      download: "Download",
      noAssistantForPrompt: "No model reply in the current chat to use as prompt.",
      lastAnswerToPrompt: "Last model reply copied to ComfyUI prompt.",
      sendingWorkflow: "Sending workflow to ComfyUI...",
      comfyNoPromptId: "ComfyUI did not return prompt_id.",
      queuePrompt: "Queued: {id}",
      imagesReady: "Done: {count} image(s).",
      comfyErrorPrefix: "ComfyUI error: {message}",
      exportUser: "User",
      exportAssistant: "Assistant",
      modeChat: "Chat",
      modeImage: "Image",
      modeSwitchWarning: "Mode switched: {mode}. LM Studio and ComfyUI use different models and do not share context.",
      imagePromptPlaceholder: "Image generation prompt...",
      attachImage: "Attach image",
      deleteChatConfirm: "Delete this chat?",
      deleteChatAria: "Delete chat",
      roleGeneratedImage: "ComfyUI",
      generatedImageNote: "[Generated image]",
      generatingImage: "Generating image...",
      exportSystem: "System",
      previewRemove: "Remove",
    },
  };

  let currentLang = detectLanguage();
  let currentTheme = localStorage.getItem(STORAGE.theme) === "light" ? "light" : "dark";
  let onLanguageChange = null;

  function detectLanguage() {
    const saved = localStorage.getItem(STORAGE.lang);
    if (saved === "ru" || saved === "en") return saved;

    const browser = (navigator.language || "ru").toLowerCase();
    return browser.startsWith("en") ? "en" : "ru";
  }

  function t(key, params = {}) {
    const dict = I18N[currentLang] || I18N.ru;
    let text = dict[key] ?? I18N.en[key] ?? key;

    for (const [name, value] of Object.entries(params)) {
      text = text.replaceAll(`{${name}}`, String(value ?? ""));
    }

    return text;
  }

  function isDefaultChatTitle(title) {
    return title === DEFAULT_CHAT_TITLE.ru || title === DEFAULT_CHAT_TITLE.en;
  }

  function displayChatTitle(title) {
    if (isDefaultChatTitle(title)) return t("newChat");
    return title || t("newChat");
  }

  function applyStaticTranslations() {
    document.title = t("pageTitle");
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      const value = t(key);
      if (node.hasAttribute("data-i18n-html")) {
        node.innerHTML = value;
      } else {
        node.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      node.placeholder = t(node.getAttribute("data-i18n-placeholder"));
    });

    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang-btn") === currentLang);
      btn.setAttribute("aria-pressed", btn.classList.contains("active") ? "true" : "false");
    });

    document.querySelectorAll("[data-theme-btn]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-theme-btn") === currentTheme);
      btn.setAttribute("aria-pressed", btn.classList.contains("active") ? "true" : "false");
    });
  }

  function applyTheme(theme) {
    currentTheme = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem(STORAGE.theme, currentTheme);
    applyStaticTranslations();
  }

  function setLanguage(lang, notify = true) {
    currentLang = lang === "en" ? "en" : "ru";
    localStorage.setItem(STORAGE.lang, currentLang);
    applyStaticTranslations();
    if (notify && typeof onLanguageChange === "function") {
      onLanguageChange(currentLang);
    }
  }

  function initUiPreferences(options = {}) {
    onLanguageChange = options.onLanguageChange || null;
    currentLang = detectLanguage();
    currentTheme = localStorage.getItem(STORAGE.theme) === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    document.documentElement.lang = currentLang;
    applyStaticTranslations();
  }

  window.UI_I18N = {
    STORAGE,
    DEFAULT_CHAT_TITLE,
    t,
    isDefaultChatTitle,
    displayChatTitle,
    applyStaticTranslations,
    applyTheme,
    setLanguage,
    initUiPreferences,
    getLang: () => currentLang,
    getTheme: () => currentTheme,
  };
})();
