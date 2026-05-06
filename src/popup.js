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

const SUPPORTED_MESSAGE_LANGUAGES = [
  "pt-BR", "en", "es", "fr", "de", "it", "ja", "ko", "zh-CN", "ru",
  "tr", "id", "ar", "hi", "nl", "pl", "sv", "vi", "th", "tl"
];

const INTERVAL_PRESETS = [
  { id: "low", minMinutes: 4, maxMinutes: 7 },
  { id: "balanced", minMinutes: 2, maxMinutes: 4 },
  { id: "active", minMinutes: 1, maxMinutes: 2 }
];

const THEME_PRESETS = [
  { id: "auto", topic: "" },
  { id: "chat", topic: "chat" },
  { id: "gameplay", topic: "gameplay" },
  { id: "hype", topic: "hype" },
  { id: "food", topic: "bacon" },
  { id: "clutch", topic: "clutch" }
];

const UI_TRANSLATIONS = {
  "pt-BR": {
    platformDetecting: "Detectando plataforma...",
    unsupportedPage: "Abra uma live suportada para usar.",
    active: "Ativo nesta aba.",
    paused: "Pausado.",
    waitingPage: "Aguardando pagina suportada.",
    sent: "Mensagem enviada.",
    commandSent: "Comando enviado para a pagina.",
    activeTabMissing: "Aba ativa nao encontrada.",
    platform: "Plataforma: {platform}",
    uiLanguage: "Idioma da interface",
    autoLanguage: "Automatico",
    topic: "Tema",
    closedChoices: "escolhas seguras",
    themeAuto: "Auto",
    themeAutoHelp: "varia sozinho",
    themeChat: "Chat",
    themeChatHelp: "comunidade",
    themeGameplay: "Gameplay",
    themeGameplayHelp: "jogadas",
    themeHype: "Hype",
    themeHypeHelp: "energia alta",
    themeFood: "Food",
    themeFoodHelp: "bacon mode",
    themeClutch: "Clutch",
    themeClutchHelp: "momentos tensos",
    interval: "Intervalo",
    antiSpam: "anti-spam",
    intervalLow: "leve",
    intervalBalanced: "normal",
    intervalActive: "ativo",
    messageLanguages: "Idiomas das mensagens",
    pickAtLeastOne: "min. 1",
    translation: "Traducao",
    translationHelp: "Para idiomas sem pacote nativo",
    sendButton: "Botao de envio",
    sendButtonHelp: "Usa enter como fallback",
    sendNow: "Enviar agora",
    save: "Salvar"
  },
  en: {
    platformDetecting: "Detecting platform...",
    unsupportedPage: "Open a supported live stream to use.",
    active: "Active in this tab.",
    paused: "Paused.",
    waitingPage: "Waiting for a supported page.",
    sent: "Message sent.",
    commandSent: "Command sent to the page.",
    activeTabMissing: "Active tab not found.",
    platform: "Platform: {platform}",
    uiLanguage: "Interface language",
    autoLanguage: "Automatic",
    topic: "Topic",
    closedChoices: "safe choices",
    themeAuto: "Auto",
    themeAutoHelp: "varies itself",
    themeChat: "Chat",
    themeChatHelp: "community",
    themeGameplay: "Gameplay",
    themeGameplayHelp: "plays",
    themeHype: "Hype",
    themeHypeHelp: "high energy",
    themeFood: "Food",
    themeFoodHelp: "bacon mode",
    themeClutch: "Clutch",
    themeClutchHelp: "tense moments",
    interval: "Interval",
    antiSpam: "anti-spam",
    intervalLow: "light",
    intervalBalanced: "normal",
    intervalActive: "active",
    messageLanguages: "Message languages",
    pickAtLeastOne: "min. 1",
    translation: "Translation",
    translationHelp: "For languages without a native pack",
    sendButton: "Send button",
    sendButtonHelp: "Uses enter as fallback",
    sendNow: "Send now",
    save: "Save"
  },
  es: {
    platformDetecting: "Detectando plataforma...",
    unsupportedPage: "Abre un directo compatible para usar.",
    active: "Activo en esta pestana.",
    paused: "Pausado.",
    waitingPage: "Esperando una pagina compatible.",
    sent: "Mensaje enviado.",
    commandSent: "Comando enviado a la pagina.",
    activeTabMissing: "Pestana activa no encontrada.",
    platform: "Plataforma: {platform}",
    uiLanguage: "Idioma de la interfaz",
    autoLanguage: "Automatico",
    topic: "Tema",
    topicPlaceholder: "bacon, gameplay, chat",
    minMinutes: "Min.",
    maxMinutes: "Max.",
    messageLanguages: "Idiomas de mensajes",
    autoMix: "mezcla automatica",
    customCodes: "Otros codigos",
    customCodesPlaceholder: "uk, ro, da",
    translation: "Traduccion",
    translationHelp: "Para idiomas sin paquete nativo",
    sendButton: "Boton de envio",
    sendButtonHelp: "Usa enter como respaldo",
    sendNow: "Enviar ahora",
    save: "Guardar"
  },
  fr: {
    platformDetecting: "Detection de la plateforme...",
    unsupportedPage: "Ouvrez un live compatible.",
    active: "Actif dans cet onglet.",
    paused: "En pause.",
    waitingPage: "En attente d'une page compatible.",
    sent: "Message envoye.",
    commandSent: "Commande envoyee a la page.",
    activeTabMissing: "Onglet actif introuvable.",
    platform: "Plateforme: {platform}",
    uiLanguage: "Langue de l'interface",
    autoLanguage: "Automatique",
    topic: "Sujet",
    topicPlaceholder: "bacon, gameplay, chat",
    minMinutes: "Min.",
    maxMinutes: "Max.",
    messageLanguages: "Langues des messages",
    autoMix: "mix automatique",
    customCodes: "Autres codes",
    customCodesPlaceholder: "uk, ro, da",
    translation: "Traduction",
    translationHelp: "Pour les langues sans pack natif",
    sendButton: "Bouton d'envoi",
    sendButtonHelp: "Utilise entree en secours",
    sendNow: "Envoyer",
    save: "Enregistrer"
  },
  de: {
    platformDetecting: "Plattform wird erkannt...",
    unsupportedPage: "Offne einen unterstutzten Livestream.",
    active: "In diesem Tab aktiv.",
    paused: "Pausiert.",
    waitingPage: "Warte auf unterstutzte Seite.",
    sent: "Nachricht gesendet.",
    commandSent: "Befehl an die Seite gesendet.",
    activeTabMissing: "Aktiver Tab nicht gefunden.",
    platform: "Plattform: {platform}",
    uiLanguage: "Sprache der Oberflache",
    autoLanguage: "Automatisch",
    topic: "Thema",
    topicPlaceholder: "bacon, gameplay, chat",
    minMinutes: "Min.",
    maxMinutes: "Max.",
    messageLanguages: "Nachrichtensprachen",
    autoMix: "automatischer Mix",
    customCodes: "Andere Codes",
    customCodesPlaceholder: "uk, ro, da",
    translation: "Ubersetzung",
    translationHelp: "Fur Sprachen ohne natives Paket",
    sendButton: "Senden-Button",
    sendButtonHelp: "Enter als Fallback",
    sendNow: "Jetzt senden",
    save: "Speichern"
  },
  it: {
    platformDetecting: "Rilevamento piattaforma...",
    unsupportedPage: "Apri una live supportata.",
    active: "Attivo in questa scheda.",
    paused: "In pausa.",
    waitingPage: "In attesa di una pagina supportata.",
    sent: "Messaggio inviato.",
    commandSent: "Comando inviato alla pagina.",
    activeTabMissing: "Scheda attiva non trovata.",
    platform: "Piattaforma: {platform}",
    uiLanguage: "Lingua interfaccia",
    autoLanguage: "Automatico",
    topic: "Tema",
    topicPlaceholder: "bacon, gameplay, chat",
    minMinutes: "Min.",
    maxMinutes: "Max.",
    messageLanguages: "Lingue messaggi",
    autoMix: "mix automatico",
    customCodes: "Altri codici",
    customCodesPlaceholder: "uk, ro, da",
    translation: "Traduzione",
    translationHelp: "Per lingue senza pacchetto nativo",
    sendButton: "Pulsante invio",
    sendButtonHelp: "Usa invio come fallback",
    sendNow: "Invia ora",
    save: "Salva"
  }
};

UI_TRANSLATIONS.ja = {
  platformDetecting: "プラットフォームを検出中...",
  unsupportedPage: "対応しているライブ配信を開いてください。",
  active: "このタブで有効です。",
  paused: "一時停止中です。",
  waitingPage: "対応ページを待機中です。",
  sent: "メッセージを送信しました。",
  commandSent: "ページにコマンドを送信しました。",
  activeTabMissing: "アクティブなタブが見つかりません。",
  platform: "プラットフォーム: {platform}",
  uiLanguage: "インターフェース言語",
  autoLanguage: "自動",
  topic: "トピック",
  topicPlaceholder: "bacon, gameplay, chat",
  minMinutes: "最小",
  maxMinutes: "最大",
  messageLanguages: "メッセージ言語",
  autoMix: "自動ミックス",
  customCodes: "その他のコード",
  customCodesPlaceholder: "uk, ro, da",
  translation: "翻訳",
  translationHelp: "ネイティブパックがない言語用",
  sendButton: "送信ボタン",
  sendButtonHelp: "Enter をフォールバックに使用",
  sendNow: "今すぐ送信",
  save: "保存"
};

UI_TRANSLATIONS.ko = {
  platformDetecting: "플랫폼 감지 중...",
  unsupportedPage: "지원되는 라이브 페이지를 여세요.",
  active: "이 탭에서 활성화됨.",
  paused: "일시 중지됨.",
  waitingPage: "지원되는 페이지를 기다리는 중.",
  sent: "메시지를 보냈습니다.",
  commandSent: "페이지에 명령을 보냈습니다.",
  activeTabMissing: "활성 탭을 찾을 수 없습니다.",
  platform: "플랫폼: {platform}",
  uiLanguage: "인터페이스 언어",
  autoLanguage: "자동",
  topic: "주제",
  topicPlaceholder: "bacon, gameplay, chat",
  minMinutes: "최소",
  maxMinutes: "최대",
  messageLanguages: "메시지 언어",
  autoMix: "자동 믹스",
  customCodes: "기타 코드",
  customCodesPlaceholder: "uk, ro, da",
  translation: "번역",
  translationHelp: "네이티브 팩이 없는 언어용",
  sendButton: "전송 버튼",
  sendButtonHelp: "Enter를 대체 방식으로 사용",
  sendNow: "지금 보내기",
  save: "저장"
};

UI_TRANSLATIONS["zh-CN"] = {
  platformDetecting: "正在检测平台...",
  unsupportedPage: "请打开支持的直播页面。",
  active: "已在此标签页启用。",
  paused: "已暂停。",
  waitingPage: "正在等待支持的页面。",
  sent: "消息已发送。",
  commandSent: "命令已发送到页面。",
  activeTabMissing: "找不到当前活动标签页。",
  platform: "平台: {platform}",
  uiLanguage: "界面语言",
  autoLanguage: "自动",
  topic: "主题",
  topicPlaceholder: "bacon, gameplay, chat",
  minMinutes: "最小",
  maxMinutes: "最大",
  messageLanguages: "消息语言",
  autoMix: "自动混合",
  customCodes: "其他代码",
  customCodesPlaceholder: "uk, ro, da",
  translation: "翻译",
  translationHelp: "用于没有原生短语包的语言",
  sendButton: "发送按钮",
  sendButtonHelp: "使用 Enter 作为备用",
  sendNow: "立即发送",
  save: "保存"
};

const els = {
  enabled: document.getElementById("enabled"),
  platform: document.getElementById("platform"),
  uiLanguage: document.getElementById("uiLanguage"),
  useTranslation: document.getElementById("useTranslation"),
  sendWithButton: document.getElementById("sendWithButton"),
  save: document.getElementById("save"),
  sendNow: document.getElementById("sendNow"),
  status: document.getElementById("status")
};

let activeMessages = UI_TRANSLATIONS["pt-BR"];
let platformState = { type: "detecting", platform: "" };

function normalizeUiLanguage(language) {
  if (!language || language === "auto") {
    const browserLanguage = (navigator.language || "pt-BR").toLowerCase();
    if (browserLanguage.startsWith("pt")) return "pt-BR";
    if (browserLanguage.startsWith("zh")) return "zh-CN";
    const short = browserLanguage.split("-")[0];
    return UI_TRANSLATIONS[short] ? short : "en";
  }
  return UI_TRANSLATIONS[language] ? language : "en";
}

function t(key, values = {}) {
  const template = activeMessages[key] || UI_TRANSLATIONS.en[key] || UI_TRANSLATIONS["pt-BR"][key] || key;
  return Object.entries(values).reduce((text, [name, value]) => {
    return text.replaceAll(`{${name}}`, value);
  }, template);
}

function applyTranslations(language) {
  const normalized = normalizeUiLanguage(language);
  activeMessages = UI_TRANSLATIONS[normalized];
  document.documentElement.lang = normalized;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  renderPlatform();
}

function renderPlatform() {
  if (platformState.type === "ready") {
    els.platform.textContent = t("platform", { platform: platformState.platform || "unknown" });
    return;
  }

  if (platformState.type === "unsupported") {
    els.platform.textContent = t("unsupportedPage");
    return;
  }

  els.platform.textContent = t("platformDetecting");
}

function setPlatformReady(platform) {
  platformState = { type: "ready", platform };
  renderPlatform();
}

function setPlatformUnsupported() {
  platformState = { type: "unsupported", platform: "" };
  renderPlatform();
}

function setStatus(text, tone = "neutral") {
  els.status.textContent = text;
  els.status.dataset.tone = tone;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function selectedLanguages() {
  let checked = [...document.querySelectorAll('input[name="language"]:checked')].map((input) => input.value);
  if (!checked.length) {
    const fallback = document.querySelector('input[name="language"][value="pt-BR"]');
    if (fallback) fallback.checked = true;
    checked = [...DEFAULT_SETTINGS.languages];
  }
  return [...new Set(checked)];
}

function selectedThemeTopic() {
  const selected = document.querySelector('input[name="theme"]:checked');
  return selected?.dataset.topic || "";
}

function selectedInterval() {
  const selected = document.querySelector('input[name="interval"]:checked');
  const min = Number(selected?.dataset.min);
  const max = Number(selected?.dataset.max);
  return {
    minMinutes: Number.isFinite(min) ? min : DEFAULT_SETTINGS.minMinutes,
    maxMinutes: Number.isFinite(max) ? max : DEFAULT_SETTINGS.maxMinutes
  };
}

function checkRadio(name, value) {
  const fallback = document.querySelector(`input[name="${name}"]`);
  const selected = document.querySelector(`input[name="${name}"][value="${value}"]`) || fallback;
  if (selected) selected.checked = true;
}

function themeIdFromTopic(topic) {
  return THEME_PRESETS.find((preset) => preset.topic === (topic || ""))?.id || "auto";
}

function intervalIdFromSettings(settings) {
  return INTERVAL_PRESETS.find((preset) => {
    return preset.minMinutes === Number(settings.minMinutes) && preset.maxMinutes === Number(settings.maxMinutes);
  })?.id || "balanced";
}

function readSettings() {
  const interval = selectedInterval();
  return {
    enabled: els.enabled.checked,
    minMinutes: interval.minMinutes,
    maxMinutes: interval.maxMinutes,
    languages: selectedLanguages().length ? selectedLanguages() : DEFAULT_SETTINGS.languages,
    customTopic: selectedThemeTopic(),
    uiLanguage: els.uiLanguage.value,
    useTranslation: els.useTranslation.checked,
    sendWithButton: els.sendWithButton.checked
  };
}

function applySettings(settings) {
  els.enabled.checked = settings.enabled;
  document.body.dataset.enabled = settings.enabled ? "true" : "false";
  els.uiLanguage.value = settings.uiLanguage || DEFAULT_SETTINGS.uiLanguage;
  applyTranslations(els.uiLanguage.value);
  checkRadio("theme", themeIdFromTopic(settings.customTopic));
  checkRadio("interval", intervalIdFromSettings(settings));
  els.useTranslation.checked = settings.useTranslation;
  els.sendWithButton.checked = settings.sendWithButton;

  const languages = new Set(settings.languages || DEFAULT_SETTINGS.languages);
  document.querySelectorAll('input[name="language"]').forEach((input) => {
    input.checked = languages.has(input.value);
  });
}

async function sendToActiveTab(message) {
  const tab = await getActiveTab();
  if (!tab?.id) {
    throw new Error(t("activeTabMissing"));
  }
  return chrome.tabs.sendMessage(tab.id, message);
}

async function saveSettings() {
  const settings = readSettings();

  await chrome.storage.local.set({ [STORAGE_KEY]: settings });
  try {
    await sendToActiveTab({ type: "saveSettings", settings });
  } catch (_error) {
    // Storage sync still reaches content scripts in supported pages.
  }
  setStatus(settings.enabled ? t("active") : t("paused"), settings.enabled ? "success" : "neutral");
}

async function init() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const settings = { ...DEFAULT_SETTINGS, ...(stored[STORAGE_KEY] || {}) };
  applySettings(settings);

  try {
    const status = await sendToActiveTab({ type: "getStatus" });
    setPlatformReady(status.platform || "unknown");
    if (status.settings) {
      applySettings({ ...settings, ...status.settings });
      setPlatformReady(status.platform || "unknown");
    }
  } catch (_error) {
    setPlatformUnsupported();
    els.sendNow.disabled = true;
    setStatus(t("waitingPage"), "warning");
  }
}

els.save.addEventListener("click", () => {
  saveSettings().catch((error) => setStatus(error.message, "danger"));
});

els.enabled.addEventListener("change", () => {
  saveSettings().catch((error) => setStatus(error.message, "danger"));
});

els.uiLanguage.addEventListener("change", () => {
  applyTranslations(els.uiLanguage.value);
  saveSettings().catch((error) => setStatus(error.message, "danger"));
});

document.querySelectorAll('input[name="language"]').forEach((input) => {
  input.addEventListener("change", () => {
    if (!document.querySelectorAll('input[name="language"]:checked').length) {
      input.checked = true;
      setStatus(t("pickAtLeastOne"), "warning");
    }
  });
});

els.sendNow.addEventListener("click", async () => {
  try {
    await saveSettings();
    const response = await sendToActiveTab({ type: "sendNow" }).catch(() => null);
    if (response?.ok) {
      setStatus(t("sent"), "success");
      return;
    }

    await chrome.storage.local.set({
      [COMMAND_KEY]: {
        type: "sendNow",
        id: Date.now()
      }
    });
    setStatus(t("commandSent"), "success");
  } catch (error) {
    setStatus(error.message, "danger");
  }
});

init().catch((error) => setStatus(error.message, "danger"));
