import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "mobile-ux.js");
const source = fs.readFileSync(target, "utf8");
const markers = [
  "const SEARCH_STOP_WORDS = new Set([",
  "const SEARCH_INTENTS = [",
  "function meaningfulQueryTerms(value)",
  "function queryIntentScores(value)",
  "function provinceAliases(item)",
  "function oneEditApart(left, right)",
  "function scoreItem(item, rawQuery)",
  "TL_SEARCH_TEST_ONLY",
  "Gõ cả câu, ví dụ: lương bao nhiêu?",
];
const missing = markers.filter((marker) => !source.includes(marker));

if (missing.length) {
  throw new Error(`Tìm kiếm tự nhiên chưa được tích hợp đầy đủ vào mobile-ux.js: ${missing.join(", ")}`);
}
if (source.includes("search-test=1") || source.includes("window.thayLinhSearchTest")) {
  throw new Error("Không được bật lõi kiểm thử tìm kiếm bằng tham số URL công khai");
}

console.log(JSON.stringify({
  target: "tuyen-tho-mo/mobile-ux.js",
  status: "source-integrated",
  bytes: Buffer.byteLength(source),
  sha256: crypto.createHash("sha256").update(source).digest("hex"),
}, null, 2));
