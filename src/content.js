(() => {
  const STORAGE_KEY = "streamingAutoMessageSettings";
  const COMMAND_KEY = "streamingAutoMessageCommand";

  const DEFAULT_SETTINGS = {
    enabled: false,
    minMinutes: 2,
    maxMinutes: 4,
    languages: ["pt-BR"],
    customTopic: "",
    uiLanguage: "auto",
    useTranslation: true,
    sendWithButton: true
  };

  const state = {
    timer: null,
    running: false,
    settings: { ...DEFAULT_SETTINGS }
  };

  const phrasePacks = {
    "pt-BR": {
      subjects: ["salame", "bacon", "tender", "lance", "momento", "chat"],
      adjectives: ["crispy", "absurdo", "pesado", "nervoso", "insano", "forte", "diferenciado"],
      extras: [
        "hoje ta diferente",
        "veio forte",
        "ta outro nivel",
        "nao tem como tankar",
        "papo reto",
        "isso aqui ta fino"
      ],
      templates: [
        "{subject} {adjective}, {extra}",
        "{extra}, {subject} ta {adjective}",
        "{subject} ta {adjective} hoje",
        "{subject}? ta {adjective} demais",
        "{extra}. {subject} veio {adjective}",
        "o {subject} ficou {adjective}, papo reto"
      ]
    },
    en: {
      subjects: ["chat", "moment", "play", "stream", "move", "round"],
      adjectives: ["wild", "clean", "heavy", "sharp", "insane", "next level"],
      extras: ["that hit different", "came in strong", "no way", "for real", "this is too good"],
      templates: [
        "{subject} is {adjective}, {extra}",
        "{extra}, that {subject} was {adjective}",
        "{subject}? absolutely {adjective}",
        "this {subject} is {adjective} today",
        "{extra}. {subject} went {adjective}"
      ]
    },
    es: {
      subjects: ["chat", "momento", "jugada", "stream", "ronda", "movimiento"],
      adjectives: ["brutal", "limpio", "pesado", "fuerte", "insano", "de otro nivel"],
      extras: ["hoy esta diferente", "vino fuerte", "no puede ser", "de verdad", "esto esta demasiado bueno"],
      templates: [
        "{subject} {adjective}, {extra}",
        "{extra}, ese {subject} estuvo {adjective}",
        "{subject}? totalmente {adjective}",
        "este {subject} esta {adjective} hoy",
        "{extra}. {subject} vino {adjective}"
      ]
    }
  };

  const platforms = {
    kick: {
      hosts: ["kick.com"],
      inputSelectors: [
        '[data-testid="chat-input"][contenteditable="true"]',
        '[contenteditable="true"][data-testid*="chat"]',
        '[contenteditable="true"][role="textbox"]'
      ],
      sendSelectors: [
        '[data-testid="send-chat-message-button"]',
        'button[type="submit"]',
        'button[aria-label*="Send" i]',
        'button[aria-label*="Enviar" i]'
      ]
    },
    twitch: {
      hosts: ["twitch.tv"],
      inputSelectors: [
        'textarea[data-a-target="chat-input"]',
        '[data-a-target="chat-input"] textarea',
        'textarea[aria-label*="chat" i]',
        '[contenteditable="true"][role="textbox"]'
      ],
      sendSelectors: [
        '[data-a-target="chat-send-button"]',
        'button[data-a-target*="send" i]',
        'button[aria-label*="Chat" i]'
      ]
    },
    youtube: {
      hosts: ["youtube.com"],
      inputSelectors: [
        '#input.yt-live-chat-text-input-field-renderer[contenteditable="true"]',
        'yt-live-chat-text-input-field-renderer #input[contenteditable="true"]',
        '[contenteditable="true"][aria-label*="chat" i]',
        '[contenteditable="true"][role="textbox"]'
      ],
      sendSelectors: [
        '#send-button button',
        'yt-live-chat-message-input-renderer #button',
        'button[aria-label*="Send" i]',
        'button[aria-label*="Enviar" i]'
      ]
    },
    tiktok: {
      hosts: ["tiktok.com"],
      inputSelectors: [
        '[contenteditable="true"][data-e2e*="comment" i]',
        '[contenteditable="true"][class*="editor" i]',
        '[contenteditable="true"][role="textbox"]',
        'textarea[placeholder*="chat" i]'
      ],
      sendSelectors: [
        'button[data-e2e*="send" i]',
        'button[aria-label*="Send" i]',
        'button[aria-label*="Enviar" i]',
        'button[type="submit"]'
      ]
    }
  };

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function detectPlatform() {
    const host = window.location.hostname.replace(/^www\./, "");
    return Object.entries(platforms).find(([, platform]) => {
      return platform.hosts.some((platformHost) => host === platformHost || host.endsWith(`.${platformHost}`));
    })?.[0] || "unknown";
  }

  function getPlatform() {
    return platforms[detectPlatform()] || null;
  }

  function findFirst(selectors) {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
    return null;
  }

  function normalizeLanguage(language) {
    return String(language || "").trim();
  }

  function getLanguages(settings) {
    const values = Array.isArray(settings.languages) ? settings.languages : DEFAULT_SETTINGS.languages;
    const normalized = values.map(normalizeLanguage).filter(Boolean);
    return normalized.length ? normalized : DEFAULT_SETTINGS.languages;
  }

  function applyTemplate(pack, topic) {
    const subject = topic || pick(pack.subjects);
    return pick(pack.templates)
      .replaceAll("{subject}", subject)
      .replaceAll("{adjective}", pick(pack.adjectives))
      .replaceAll("{extra}", pick(pack.extras));
  }

  async function translate(text, targetLang) {
    if (!state.settings.useTranslation || targetLang === "pt-BR") {
      return text;
    }

    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: "translate", text, targetLang }, (response) => {
        if (chrome.runtime.lastError || !response?.ok) {
          resolve(text);
          return;
        }
        resolve(response.text || text);
      });
    });
  }

  async function generatePhrase() {
    const language = pick(getLanguages(state.settings));
    const topic = String(state.settings.customTopic || "").trim();
    const nativePack = phrasePacks[language];

    if (nativePack) {
      return applyTemplate(nativePack, topic);
    }

    const source = applyTemplate(phrasePacks["pt-BR"], topic);
    return translate(source, language);
  }

  function setNativeValue(element, text) {
    const prototype = element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
    descriptor?.set?.call(element, text);
  }

  function setInputText(input, text) {
    input.focus();

    if (input.isContentEditable) {
      input.textContent = text;
      const range = document.createRange();
      range.selectNodeContents(input);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } else if ("value" in input) {
      setNativeValue(input, text);
    } else {
      return false;
    }

    input.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      data: text,
      inputType: "insertText"
    }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function pressEnter(input) {
    for (const type of ["keydown", "keypress", "keyup"]) {
      input.dispatchEvent(new KeyboardEvent(type, {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      }));
    }
  }

  function clickSend(platform) {
    if (!state.settings.sendWithButton) {
      return false;
    }

    const button = findFirst(platform.sendSelectors);
    if (!button || button.disabled || button.getAttribute("aria-disabled") === "true") {
      return false;
    }

    button.click();
    return true;
  }

  async function sendMessage() {
    const platform = getPlatform();
    if (!platform) {
      console.warn("[SAM] plataforma nao suportada:", window.location.hostname);
      return false;
    }

    const input = findFirst(platform.inputSelectors);
    if (!input) {
      console.warn("[SAM] input de chat nao encontrado");
      return false;
    }

    const text = await generatePhrase();
    if (!setInputText(input, text)) {
      return false;
    }

    window.setTimeout(() => {
      if (!clickSend(platform)) {
        pressEnter(input);
      }
    }, 200 + Math.random() * 300);

    console.info("[SAM] mensagem:", text);
    return true;
  }

  function getIntervalMs(settings) {
    const min = Math.max(0.25, Number(settings.minMinutes) || DEFAULT_SETTINGS.minMinutes);
    const max = Math.max(min, Number(settings.maxMinutes) || DEFAULT_SETTINGS.maxMinutes);
    return (min + Math.random() * (max - min)) * 60 * 1000;
  }

  function stopLoop() {
    state.running = false;
    if (state.timer) {
      clearTimeout(state.timer);
      state.timer = null;
    }
  }

  function scheduleNext() {
    if (!state.running) return;
    state.timer = window.setTimeout(async () => {
      await sendMessage();
      scheduleNext();
    }, getIntervalMs(state.settings));
  }

  function startLoop() {
    stopLoop();
    state.running = true;
    scheduleNext();
  }

  async function saveSettings(settings) {
    state.settings = { ...DEFAULT_SETTINGS, ...settings };
    await chrome.storage.local.set({ [STORAGE_KEY]: state.settings });
    if (state.settings.enabled) {
      startLoop();
    } else {
      stopLoop();
    }
  }

  async function loadSettings() {
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    state.settings = { ...DEFAULT_SETTINGS, ...(stored[STORAGE_KEY] || {}) };
    if (state.settings.enabled) {
      startLoop();
    }
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;

    if (changes[STORAGE_KEY]?.newValue) {
      state.settings = { ...DEFAULT_SETTINGS, ...changes[STORAGE_KEY].newValue };
      if (state.settings.enabled) {
        startLoop();
      } else {
        stopLoop();
      }
    }

    if (changes[COMMAND_KEY]?.newValue?.type === "sendNow") {
      sendMessage();
    }
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "getStatus") {
      sendResponse({
        ok: true,
        platform: detectPlatform(),
        running: state.running,
        settings: state.settings
      });
      return false;
    }

    if (message?.type === "saveSettings") {
      saveSettings(message.settings).then(() => sendResponse({ ok: true }));
      return true;
    }

    if (message?.type === "sendNow") {
      sendMessage().then((ok) => sendResponse({ ok }));
      return true;
    }

    return false;
  });

  loadSettings();
})();
