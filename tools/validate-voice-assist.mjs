import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const mobilePath = path.join(root, "mobile-ux.js");
const voicePath = path.join(root, "voice-assist.js");
const mobile = fs.readFileSync(mobilePath, "utf8");
const voice = fs.readFileSync(voicePath, "utf8");
const errors = [];

for (const marker of [
  "let voiceAssistPromise = null",
  "function loadVoiceAssist()",
  'script.src = "/voice-assist.js?v=2"',
  "window.ThayLinhVoiceAssist?.init?.()",
]) if (!mobile.includes(marker)) errors.push(`mobile-ux.js thiếu ${marker}`);

if ((mobile.match(/void loadVoiceAssist\(\);/g) || []).length !== 2) {
  errors.push("Voice assist phải chỉ tải khi mở tìm kiếm hoặc tóm tắt 30 giây");
}
if (Buffer.byteLength(mobile) > 42_000) errors.push(`mobile-ux.js vượt 42 KB: ${Buffer.byteLength(mobile)}`);

for (const marker of [
  "window.SpeechRecognition || window.webkitSpeechRecognition",
  'recognition.lang = VOICE_LANG',
  'input.dispatchEvent(new Event("input", { bubbles: true }))',
  "function setupVoiceSearch(dialog)",
  "function briefSpeechText(dialog)",
  "function setupBriefReadAloud(dialog)",
  "function answerSpeechText(panel)",
  "function setupSearchAnswerReadAloud(dialog)",
  "setupSearchAnswerReadAloud(dialog);",
  "new MutationObserver(attach)",
  "[data-answer-read-aloud]",
  "window.SpeechSynthesisUtterance",
  'utterance.lang = VOICE_LANG',
  "🎙 Nói để tìm",
  "🔊 Nghe tóm tắt",
  "🔊 Nghe câu trả lời",
  "Trình duyệt xử lý giọng nói; website không lưu âm thanh hay câu hỏi.",
  "window.ThayLinhVoiceAssist = Object.freeze({ init })",
]) if (!voice.includes(marker)) errors.push(`voice-assist.js thiếu ${marker}`);

for (const forbidden of [
  "localStorage",
  "sessionStorage",
  "document.cookie",
  "navigator.sendBeacon",
  "FormData",
  "XMLHttpRequest",
  "fetch(",
  "dataLayer",
  "trackUi(",
]) if (voice.includes(forbidden)) errors.push(`Voice assist không được dùng ${forbidden}`);

const voiceBytes = Buffer.byteLength(voice);
if (voiceBytes > 14_000) errors.push(`voice-assist.js vượt 14 KB: ${voiceBytes}`);

try {
  new vm.Script(voice, { filename: "voice-assist.js" });
  const window = {};
  vm.runInNewContext(voice, { window, Object }, { filename: "voice-assist.js" });
  if (typeof window.ThayLinhVoiceAssist?.init !== "function") errors.push("Voice assist không xuất hàm init");
} catch (error) {
  errors.push(`voice-assist.js lỗi cú pháp hoặc khởi tạo: ${error.message}`);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
const htmlFiles = walk(root).filter((file) => file.endsWith(".html"));
const staticLoads = htmlFiles.filter((file) => fs.readFileSync(file, "utf8").includes("/voice-assist.js"));
if (staticLoads.length) errors.push(`Voice assist phải tải theo yêu cầu, không nạp tĩnh trên ${staticLoads.length} trang`);

console.log(JSON.stringify({
  lazy_entry_points: (mobile.match(/void loadVoiceAssist\(\);/g) || []).length,
  html_pages_checked: htmlFiles.length,
  static_loads: staticLoads.length,
  mobile_js_bytes: Buffer.byteLength(mobile),
  voice_js_bytes: voiceBytes,
  recognition_fallback: voice.includes('dialog.dataset.voiceSearchReady = "unsupported"'),
  brief_read_aloud_fallback: voice.includes('dialog.dataset.briefReadAloudReady = "unsupported"'),
  answer_read_aloud_fallback: voice.includes('dialog.dataset.searchAnswerReadAloudReady = "unsupported"'),
  errors,
}, null, 2));

if (errors.length) process.exit(1);
