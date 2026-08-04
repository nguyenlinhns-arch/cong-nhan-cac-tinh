import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "tuyen-tho-mo");
const CHECK_ONLY = process.argv.includes("--check");
const AVATAR = "/assets/thay-linh-avatar.webp?v=3";
const BRAND_MARK = `<img class="brand-mark" src="${AVATAR}" alt="" width="45" height="45">`;
const PAYROLL_BRAND_MARK = `<img class="payroll-brand__mark" src="${AVATAR}" alt="" width="44" height="44">`;

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function normalizeBrand(html) {
  return html
    .replace(/<span class=(["'])brand-mark\1>TL<\/span>/g, BRAND_MARK)
    .replace(/<span class=(["'])payroll-brand__mark\1>TL<\/span>/g, PAYROLL_BRAND_MARK)
    .replaceAll("<small>Cổng kiểm chứng nghề mỏ</small>", "<small>Tuyển Thợ Mỏ</small>");
}

const htmlFiles = walk(SITE).filter((file) => file.endsWith(".html"));
const changed = [];
for (const file of htmlFiles) {
  const current = fs.readFileSync(file, "utf8");
  const next = normalizeBrand(current);
  if (next === current) continue;
  changed.push(path.relative(SITE, file).split(path.sep).join("/"));
  if (!CHECK_ONLY) fs.writeFileSync(file, next);
}

const invalid = [];
for (const file of htmlFiles) {
  const relative = path.relative(SITE, file).split(path.sep).join("/");
  if (/^google[^/]*\.html$/i.test(relative)) continue;

  const html = fs.readFileSync(file, "utf8");
  if (/<meta\b[^>]*http-equiv=["']refresh["']/i.test(html)) continue;

  const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/i)?.[0] || "";
  const markers = [
    AVATAR,
    "<strong>Thầy Linh</strong>",
    "<small>Tuyển Thợ Mỏ</small>",
  ];
  if (!header || !markers.every((marker) => header.includes(marker))) invalid.push(relative);
  if (/brand-mark["'][^>]*>TL<\/span>|payroll-brand__mark["'][^>]*>TL<\/span>|Cổng kiểm chứng nghề mỏ/.test(header)) invalid.push(relative);
}

if (!fs.existsSync(path.join(SITE, "assets", "thay-linh-avatar.webp"))) {
  throw new Error("Thiếu ảnh đại diện dùng chung assets/thay-linh-avatar.webp");
}
if (CHECK_ONLY && changed.length) {
  throw new Error(`Còn ${changed.length} trang chưa được chuẩn hóa logo: ${changed.join(", ")}`);
}
if (invalid.length) {
  throw new Error(`Trang chưa dùng logo Thầy Linh – Tuyển Thợ Mỏ thống nhất: ${[...new Set(invalid)].join(", ")}`);
}

console.log(`${CHECK_ONLY ? "Validated" : "Updated"} the shared Thầy Linh – Tuyển Thợ Mỏ brand across ${htmlFiles.length} HTML files; changed ${changed.length}.`);
