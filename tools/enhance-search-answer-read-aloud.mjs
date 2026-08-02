import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "voice-assist.js");
let source = fs.readFileSync(target, "utf8");
const beforeBytes = Buffer.byteLength(source);
const beforeSha256 = crypto.createHash("sha256").update(source).digest("hex");
const markers = [
  "function answerSpeechText(panel)",
  "function setupSearchAnswerReadAloud(dialog)",
  "data-answer-read-aloud",
  "🔊 Nghe câu trả lời",
  "new MutationObserver(attach)",
];

if (markers.every((marker) => source.includes(marker))) {
  console.log(JSON.stringify({ target: "tuyen-tho-mo/voice-assist.js", status: "already-enhanced", beforeBytes, beforeSha256 }, null, 2));
  process.exit(0);
}
if (markers.some((marker) => source.includes(marker))) throw new Error("Search-answer read-aloud is only partially present");
for (const required of [
  "function injectStyles()",
  "function setButtonState(button, active, label)",
  "function setupVoiceSearch(dialog)",
  "function briefSpeechText(dialog)",
  "function setupBriefReadAloud(dialog)",
  "window.ThayLinhVoiceAssist = Object.freeze({ init })",
]) if (!source.includes(required)) throw new Error(`Voice assist prerequisite is missing: ${required}`);

const oldReadStyle = "      .tl-voice-read-wrap{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:0 24px 12px}";
const newReadStyle = oldReadStyle + "\n      .tl-voice-answer-wrap{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:12px;padding-top:11px;border-top:1px solid var(--tl-line,#dbe7e5)}";
if (!source.includes(oldReadStyle)) throw new Error("Could not locate voice read style");
source = source.replace(oldReadStyle, newReadStyle);

const oldMobileStyle = "@media(max-width:520px){.tl-voice-controls,.tl-voice-read-wrap{align-items:stretch}.tl-voice-search-button,.tl-voice-read-button{width:100%}.tl-voice-status{min-width:0;text-align:center}}";
const newMobileStyle = "@media(max-width:520px){.tl-voice-controls,.tl-voice-read-wrap,.tl-voice-answer-wrap{align-items:stretch}.tl-voice-search-button,.tl-voice-read-button{width:100%}.tl-voice-status{min-width:0;text-align:center}}";
if (!source.includes(oldMobileStyle)) throw new Error("Could not locate mobile voice style");
source = source.replace(oldMobileStyle, newMobileStyle);

const answerFunctions = `
  function answerSpeechText(panel) {
    const title = panel.querySelector("strong")?.textContent?.trim() || "";
    const text = [...panel.children].find((element) => element.tagName === "SPAN")?.textContent?.trim() || "";
    return [title, text].filter(Boolean).join(". ");
  }

  function setupSearchAnswerReadAloud(dialog) {
    if (dialog.dataset.searchAnswerReadAloudReady) return;
    const synth = window.speechSynthesis;
    const Utterance = window.SpeechSynthesisUtterance;
    const grid = dialog.querySelector(".tl-search-results__grid");
    if (!synth || typeof Utterance !== "function" || !grid) {
      dialog.dataset.searchAnswerReadAloudReady = "unsupported";
      return;
    }

    injectStyles();
    dialog.dataset.searchAnswerReadAloudReady = "true";
    let activeButton = null;
    let activeLive = null;

    const reset = (message = "Có thể nghe câu trả lời mà không cần đọc.") => {
      if (activeButton) setButtonState(activeButton, false, "🔊 Nghe câu trả lời");
      if (activeLive) activeLive.textContent = message;
      activeButton = null;
      activeLive = null;
      activeSpeech = null;
    };

    const stop = (message = "Đã dừng giọng đọc.") => {
      synth.cancel();
      reset(message);
    };

    const attach = () => {
      if (activeButton && !activeButton.isConnected) stop("Câu trả lời đã thay đổi.");
      grid.querySelectorAll("[data-search-answer]").forEach((panel) => {
        if (panel.querySelector("[data-answer-read-aloud]")) return;
        const wrap = document.createElement("div");
        wrap.className = "tl-voice-answer-wrap";
        const button = document.createElement("button");
        button.type = "button";
        button.className = "tl-voice-read-button";
        button.dataset.answerReadAloud = "true";
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-label", "Nghe câu trả lời đang hiển thị");
        button.textContent = "🔊 Nghe câu trả lời";
        const live = document.createElement("span");
        live.className = "tl-voice-status";
        live.setAttribute("role", "status");
        live.setAttribute("aria-live", "polite");
        live.textContent = "Có thể nghe câu trả lời mà không cần đọc.";
        wrap.append(button, live);
        const actions = panel.querySelector(".tl-search-empty__actions");
        panel.insertBefore(wrap, actions || null);

        button.addEventListener("click", () => {
          if (button.getAttribute("aria-pressed") === "true") {
            stop();
            return;
          }
          synth.cancel();
          reset();
          const text = answerSpeechText(panel);
          if (!text) {
            live.textContent = "Chưa có câu trả lời để đọc.";
            return;
          }
          const utterance = new Utterance(text);
          utterance.lang = VOICE_LANG;
          utterance.rate = 0.94;
          utterance.pitch = 1;
          const vietnameseVoice = synth.getVoices().find((voice) => String(voice.lang || "").toLowerCase().startsWith("vi"));
          if (vietnameseVoice) utterance.voice = vietnameseVoice;
          activeButton = button;
          activeLive = live;
          activeSpeech = utterance;
          utterance.onstart = () => {
            if (activeSpeech !== utterance) return;
            setButtonState(button, true, "■ Dừng nghe");
            live.textContent = "Đang đọc câu trả lời…";
          };
          utterance.onend = () => { if (activeSpeech === utterance) reset("Đã đọc xong câu trả lời."); };
          utterance.onerror = () => { if (activeSpeech === utterance) reset("Thiết bị chưa phát được giọng đọc. Câu trả lời vẫn hiển thị phía trên."); };
          synth.speak(utterance);
        });
      });
    };

    attach();
    new MutationObserver(attach).observe(grid, { childList: true, subtree: true });
    dialog.addEventListener("close", () => {
      if (activeButton) stop();
    });
  }

`;
const briefMarker = "  function setupBriefReadAloud(dialog) {";
if (!source.includes(briefMarker)) throw new Error("Could not locate answer read-aloud insertion point");
source = source.replace(briefMarker, answerFunctions + briefMarker);

const oldInit = '      if (dialog.classList.contains("tl-worker-brief-dialog")) setupBriefReadAloud(dialog);\n      else setupVoiceSearch(dialog);';
const newInit = '      if (dialog.classList.contains("tl-worker-brief-dialog")) setupBriefReadAloud(dialog);\n      else {\n        setupVoiceSearch(dialog);\n        setupSearchAnswerReadAloud(dialog);\n      }';
if (!source.includes(oldInit)) throw new Error("Could not locate voice init branch");
source = source.replace(oldInit, newInit);

for (const marker of markers) if (!source.includes(marker)) throw new Error(`Search-answer read-aloud is missing ${marker}`);
const afterBytes = Buffer.byteLength(source);
if (afterBytes > 14_000) throw new Error(`Voice assist with answer reading exceeds 14 KB: ${afterBytes}`);
const afterSha256 = crypto.createHash("sha256").update(source).digest("hex");
fs.writeFileSync(target, source);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/voice-assist.js",
  status: "enhanced",
  beforeBytes,
  afterBytes,
  beforeSha256,
  afterSha256,
}, null, 2));
