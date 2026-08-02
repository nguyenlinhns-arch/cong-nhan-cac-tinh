import "./enhance-v5-growth.mjs";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "mobile-ux.js");
let source = fs.readFileSync(target, "utf8");
const beforeBytes = Buffer.byteLength(source);
const beforeSha256 = crypto.createHash("sha256").update(source).digest("hex");
const markers = [
  'const PHONE_URL = "tel:+84963048585"',
  "const PHONE_ICON =",
  'class="tl-mobile-contact__call"',
  'data-worker-brief-action="phone"',
  'data-worker-shortcut="empty_phone"',
  'answer.href === "/#dang-ky"',
];

if (markers.every((marker) => source.includes(marker))) {
  const phoneReferences = (source.match(/PHONE_URL/g) || []).length;
  if (phoneReferences < 5) throw new Error(`Direct-call help expected at least 5 phone references, got ${phoneReferences}`);
  console.log(JSON.stringify({ target: "tuyen-tho-mo/mobile-ux.js", status: "already-enhanced", phoneReferences, beforeBytes, beforeSha256 }, null, 2));
  process.exit(0);
}
if (markers.some((marker) => source.includes(marker))) throw new Error("Direct-call help is only partially present");

for (const required of [
  'const MESSENGER_URL = "https://m.me/thaylinhtuyenthomo"',
  "const MESSENGER_ICON =",
  "function createContactButtons()",
  "function createWorkerBriefDialog()",
  "function appendSearchAnswer(grid, answer)",
  'data-context="search-empty"',
]) if (!source.includes(required)) throw new Error(`Direct-call prerequisite is missing: ${required}`);

function replaceOnce(text, marker, replacement, label) {
  const count = text.split(marker).length - 1;
  if (count !== 1) throw new Error(`${label}: expected one marker, got ${count}`);
  return text.replace(marker, replacement);
}

source = replaceOnce(
  source,
  '  const MESSENGER_URL = "https://m.me/thaylinhtuyenthomo";\n',
  '  const PHONE_URL = "tel:+84963048585";\n',
  "Phone URL",
);

const iconPattern = /  const MESSENGER_ICON = '[^\n]+';\n/;
const iconMatches = source.match(new RegExp(iconPattern.source, "g")) || [];
if (iconMatches.length !== 1) throw new Error(`Phone icon: expected one Messenger icon, got ${iconMatches.length}`);
source = source.replace(iconPattern, '  const PHONE_ICON = \'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M6.7 2.8 9.3 2a1.3 1.3 0 0 1 1.5.7l1.2 2.8a1.3 1.3 0 0 1-.3 1.4L10.2 8.4a14.7 14.7 0 0 0 5.4 5.4l1.5-1.5a1.3 1.3 0 0 1 1.4-.3l2.8 1.2a1.3 1.3 0 0 1 .7 1.5l-.8 2.6a3.2 3.2 0 0 1-3.1 2.3C10.5 19.6 4.4 13.5 4.4 5.9a3.2 3.2 0 0 1 2.3-3.1Z"></path></svg>\';\n');

const oldMobileContact = `      <a class="tl-mobile-contact__messenger" href="\${MESSENGER_URL}" target="_blank" rel="noopener noreferrer" aria-label="Nhắn Messenger cho Thầy Linh" data-contact="messenger" data-context="mobile-floating">
        \${MESSENGER_ICON}<span>Messenger</span>
      </a>`;
const newMobileContact = `      <a class="tl-mobile-contact__call" href="\${PHONE_URL}" style="background:linear-gradient(145deg,#0b7a55,#075b66)" aria-label="Gọi Thầy Linh theo số 096 304 8585" data-contact="phone" data-context="mobile-floating">
        \${PHONE_ICON}<span>Gọi</span>
      </a>`;
source = replaceOnce(source, oldMobileContact, newMobileContact, "Mobile call action");

const briefZalo = '            <a href="${ZALO_URL}" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="worker-brief" data-worker-brief-action="zalo">Hỏi qua Zalo</a>';
source = replaceOnce(
  source,
  briefZalo,
  `${briefZalo}\n            <a href="\${PHONE_URL}" data-contact="phone" data-context="worker-brief" data-worker-brief-action="phone">Gọi tư vấn</a>`,
  "Brief call action",
);

const emptyZalo = '<a href="${ZALO_URL}" target="_blank" rel="noopener" data-contact="zalo" data-context="search-empty" data-worker-shortcut="empty_zalo">Hỏi qua Zalo</a></div>';
source = replaceOnce(
  source,
  emptyZalo,
  '<a href="${ZALO_URL}" target="_blank" rel="noopener" data-contact="zalo" data-context="search-empty" data-worker-shortcut="empty_zalo">Hỏi qua Zalo</a><a href="${PHONE_URL}" data-contact="phone" data-context="search-empty" data-worker-shortcut="empty_phone">Gọi tư vấn</a></div>',
  "Empty-search call action",
);

const primaryMarker = "    actions.append(primary);\n\n    if (answer.secondaryHref) {";
const contactCall = `    actions.append(primary);

    if (answer.href === "/#dang-ky") {
      const phone = document.createElement("a");
      phone.href = PHONE_URL;
      phone.textContent = "Gọi 096 304 8585";
      phone.dataset.contact = "phone";
      phone.dataset.context = "search-answer";
      phone.dataset.workerShortcut = "answer_phone";
      actions.append(phone);
    }

    if (answer.secondaryHref) {`;
source = replaceOnce(source, primaryMarker, contactCall, "Contact-answer call action");

for (const marker of markers) if (!source.includes(marker)) throw new Error(`Direct-call help is missing ${marker}`);
for (const obsolete of ["MESSENGER_URL", "MESSENGER_ICON", "tl-mobile-contact__messenger", ">Messenger<"]) {
  if (source.includes(obsolete)) throw new Error(`Direct-call help still contains ${obsolete}`);
}

const phoneReferences = (source.match(/PHONE_URL/g) || []).length;
if (phoneReferences < 5) throw new Error(`Direct-call help expected at least 5 phone references, got ${phoneReferences}`);
const afterBytes = Buffer.byteLength(source);
if (afterBytes > 42_000) throw new Error(`Direct-call mobile-ux.js exceeds 42 KB: ${afterBytes}`);
const afterSha256 = crypto.createHash("sha256").update(source).digest("hex");
fs.writeFileSync(target, source);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/mobile-ux.js",
  status: "enhanced",
  phoneReferences,
  beforeBytes,
  afterBytes,
  beforeSha256,
  afterSha256,
}, null, 2));