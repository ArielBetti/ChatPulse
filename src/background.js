const GOOGLE_TRANSLATE_ENDPOINT = "https://translate.googleapis.com/translate_a/single";
const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";

async function translateWithGooglePublic(text, targetLang) {
  const url = new URL(GOOGLE_TRANSLATE_ENDPOINT);
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "auto");
  url.searchParams.set("tl", targetLang);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Translate HTTP ${response.status}`);
  }

  const data = await response.json();
  const chunks = Array.isArray(data?.[0]) ? data[0] : [];
  const translated = chunks.map((chunk) => chunk?.[0]).filter(Boolean).join("");
  return translated || text;
}

function toMyMemoryCode(language) {
  const normalized = String(language || "").trim();
  if (normalized.toLowerCase() === "pt-br") return "pt";
  return normalized.split("-")[0] || normalized;
}

async function translateWithMyMemory(text, targetLang) {
  const url = new URL(MYMEMORY_ENDPOINT);
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", `pt|${toMyMemoryCode(targetLang)}`);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`MyMemory HTTP ${response.status}`);
  }

  const data = await response.json();
  if (data?.responseStatus && data.responseStatus !== 200) {
    throw new Error(data?.responseDetails || `MyMemory status ${data.responseStatus}`);
  }

  return data?.responseData?.translatedText || text;
}

async function translateText(text, targetLang) {
  try {
    return await translateWithGooglePublic(text, targetLang);
  } catch (_googleError) {
    return translateWithMyMemory(text, targetLang);
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "translate") {
    return false;
  }

  translateText(message.text, message.targetLang)
    .then((text) => sendResponse({ ok: true, text }))
    .catch((error) => sendResponse({ ok: false, error: String(error?.message || error) }));

  return true;
});
