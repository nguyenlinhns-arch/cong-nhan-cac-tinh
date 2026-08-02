import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "mobile-ux.js");
let source = fs.readFileSync(target, "utf8");
const beforeBytes = Buffer.byteLength(source);
const beforeSha256 = crypto.createHash("sha256").update(source).digest("hex");
const coreMarkers = [
  "let voiceAssistPromise = null",
  "function loadVoiceAssist()",
  "void loadVoiceAssist();",
];
const currentPath = "/voice-assist.js?v=2";
const legacyPath = "/voice-assist.js?v=1";
const loadCalls = () => (source.match(/void loadVoiceAssist\(\);/g) || []).length;
const hasCore = () => coreMarkers.every((marker) => source.includes(marker)) && loadCalls() === 2;

if (hasCore() && source.includes(currentPath)) {
  console.log(JSON.stringify({ target: "tuyen-tho-mo/mobile-ux.js", status: "already-enhanced", beforeBytes, beforeSha256 }, null, 2));
  process.exit(0);
}

if (hasCore() && source.includes(legacyPath) && !source.includes(currentPath)) {
  source = source.replaceAll(legacyPath, currentPath);
  const afterBytes = Buffer.byteLength(source);
  const afterSha256 = crypto.createHash("sha256").update(source).digest("hex");
  fs.writeFileSync(target, source);
  console.log(JSON.stringify({
    target: "tuyen-tho-mo/mobile-ux.js",
    status: "upgraded-v1-to-v2",
    lazyEntryPoints: loadCalls(),
    beforeBytes,
    afterBytes,
    beforeSha256,
    afterSha256,
  }, null, 2));
  process.exit(0);
}

if ([...coreMarkers, currentPath, legacyPath].some((marker) => source.includes(marker))) {
  throw new Error("Voice assist loader is only partially present");
}
for (const required of [
  "function createWorkerBriefDialog()",
  "function createSearchDialog()",
  "function setupWorkerBrief()",
  "function setupSearch()",
  "function compactMobileConsentBanner()",
]) if (!source.includes(required)) throw new Error(`Voice assist prerequisite is missing: ${required}`);

const loader = `
  let voiceAssistPromise = null;
  function loadVoiceAssist() {
    if (window.ThayLinhVoiceAssist?.init) {
      window.ThayLinhVoiceAssist.init();
      return Promise.resolve(window.ThayLinhVoiceAssist);
    }
    if (!voiceAssistPromise) {
      voiceAssistPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "/voice-assist.js?v=2";
        script.async = true;
        script.onload = () => {
          window.ThayLinhVoiceAssist?.init?.();
          resolve(window.ThayLinhVoiceAssist || null);
        };
        script.onerror = () => resolve(null);
        document.head.append(script);
      });
    }
    return voiceAssistPromise;
  }
`;

const functionMarker = "  function compactMobileConsentBanner() {";
source = source.replace(functionMarker, loader + "\n" + functionMarker);

const briefMarker = "      dialog = createWorkerBriefDialog();\n";
if (!source.includes(briefMarker)) throw new Error("Could not locate worker brief lazy-load point");
source = source.replace(briefMarker, briefMarker + "      void loadVoiceAssist();\n");

const searchMarker = "      dialog = createSearchDialog();\n";
if (!source.includes(searchMarker)) throw new Error("Could not locate search lazy-load point");
source = source.replace(searchMarker, searchMarker + "      void loadVoiceAssist();\n");

for (const marker of [...coreMarkers, currentPath]) if (!source.includes(marker)) throw new Error(`Voice assist loader is missing ${marker}`);
if (loadCalls() !== 2) throw new Error("Voice assist must load from search and 30-second brief only");
const afterBytes = Buffer.byteLength(source);
if (afterBytes > 42_000) throw new Error(`Voice-assisted mobile-ux.js exceeds 42 KB: ${afterBytes}`);
const afterSha256 = crypto.createHash("sha256").update(source).digest("hex");
fs.writeFileSync(target, source);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/mobile-ux.js",
  status: "enhanced",
  lazyEntryPoints: loadCalls(),
  beforeBytes,
  afterBytes,
  beforeSha256,
  afterSha256,
}, null, 2));
