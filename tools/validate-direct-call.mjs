import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const mobilePath = path.resolve("tuyen-tho-mo", "mobile-ux.js");
const mobile = fs.readFileSync(mobilePath, "utf8");
const errors = [];

for (const marker of [
  'const PHONE_URL = "tel:+84963048585"',
  "const PHONE_ICON =",
  'class="tl-mobile-contact__call"',
  'aria-label="Gọi Thầy Linh theo số 096 304 8585"',
  'data-contact="phone" data-context="mobile-floating"',
  'data-contact="phone" data-context="worker-brief" data-worker-brief-action="phone"',
  'data-contact="phone" data-context="search-empty" data-worker-shortcut="empty_phone"',
  'phone.dataset.context = "search-answer"',
  'phone.textContent = "Gọi 096 304 8585"',
]) if (!mobile.includes(marker)) errors.push(`mobile-ux.js thiếu ${marker}`);

for (const obsolete of [
  "MESSENGER_URL",
  "MESSENGER_ICON",
  "tl-mobile-contact__messenger",
  'data-contact="messenger" data-context="mobile-floating"',
  ">Messenger<",
]) if (mobile.includes(obsolete)) errors.push(`Thanh liên hệ vẫn còn ${obsolete}`);

const phoneReferences = (mobile.match(/PHONE_URL/g) || []).length;
if (phoneReferences < 5) errors.push(`Cần ít nhất 5 tham chiếu gọi điện, nhận ${phoneReferences}`);
const phoneContactMarkers = (mobile.match(/data-contact=\\?"phone\\?"/g) || []).length;
if (phoneContactMarkers < 4) errors.push(`Cần ít nhất 4 nút gọi được gắn nguồn, nhận ${phoneContactMarkers}`);

const mobileStart = mobile.indexOf('nav.className = "tl-mobile-contact"');
const mobileEnd = mobile.indexOf("document.body.append(nav);", mobileStart);
const mobileBlock = mobileStart >= 0 && mobileEnd > mobileStart ? mobile.slice(mobileStart, mobileEnd) : "";
if (!mobileBlock) errors.push("Không tìm thấy khối liên hệ cố định trên điện thoại");
else {
  const linkCount = (mobileBlock.match(/<a\b/g) || []).length;
  if (linkCount !== 3) errors.push(`Thanh liên hệ điện thoại phải có đúng 3 hành động, nhận ${linkCount}`);
  for (const label of [">Ứng tuyển<", ">Zalo<", ">Gọi<"]) if (!mobileBlock.includes(label)) errors.push(`Thanh liên hệ thiếu ${label}`);
  if (/tl-mobile-contact__call[^>]*target=/i.test(mobileBlock)) errors.push("Nút gọi điện không được mở tab mới");
}

const briefStart = mobile.indexOf('data-worker-brief-action="self_check"');
const briefEnd = mobile.indexOf("</div>", briefStart);
const briefActions = briefStart >= 0 && briefEnd > briefStart ? mobile.slice(briefStart, briefEnd) : "";
if (!briefActions.includes('data-worker-brief-action="phone"')) errors.push("Tóm tắt 30 giây thiếu nút gọi tư vấn");

const emptySearchIndex = mobile.indexOf('data-worker-shortcut="empty_phone"');
if (emptySearchIndex < 0) errors.push("Kết quả tìm kiếm trống thiếu lối gọi tư vấn");
if (!mobile.includes('if (answer.href === "/#dang-ky")')) errors.push("Câu trả lời liên hệ chưa hiển thị nút gọi trực tiếp");

const bytes = Buffer.byteLength(mobile);
if (bytes > 42_000) errors.push(`mobile-ux.js vượt 42 KB: ${bytes}`);
try {
  new vm.Script(mobile, { filename: "mobile-ux.js" });
} catch (error) {
  errors.push(`mobile-ux.js lỗi cú pháp: ${error.message}`);
}

console.log(JSON.stringify({
  phone_references: phoneReferences,
  phone_contact_markers: phoneContactMarkers,
  mobile_actions: (mobileBlock.match(/<a\b/g) || []).length,
  brief_call: briefActions.includes('data-worker-brief-action="phone"'),
  search_empty_call: emptySearchIndex >= 0,
  contact_answer_call: mobile.includes('if (answer.href === "/#dang-ky")'),
  js_bytes: bytes,
  errors,
}, null, 2));

if (errors.length) process.exit(1);
