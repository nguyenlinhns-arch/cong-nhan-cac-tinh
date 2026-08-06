import {execFileSync} from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "tuyen-tho-mo");
const MAX_TITLE_LENGTH = 65;

function decodeHtml(value = "") {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function compactSearchTitle(value) {
  const original = decodeHtml(value).replace(/\s+/gu, " ").trim();
  if (original.length <= MAX_TITLE_LENGTH) return original;
  let candidate = original.replace(/\s*(?:\||–|—|-)\s*Thầy Linh(?:\s*(?:–|—|-)\s*Tuyển Thợ Mỏ)?\s*$/u, "").trim();
  if (candidate.length <= MAX_TITLE_LENGTH) return candidate;
  const available = MAX_TITLE_LENGTH - 1;
  const excerpt = candidate.slice(0, available + 1);
  const boundary = excerpt.lastIndexOf(" ");
  candidate = (boundary >= Math.floor(available * 0.68) ? excerpt.slice(0, boundary) : candidate.slice(0, available))
    .replace(/[,:;–—-]+$/u, "")
    .trim();
  return `${candidate}…`;
}

function transform(html, relativePath) {
  let next = html;
  if (relativePath.startsWith("viec-lam-nganh-than/")) {
    next = next
      .replaceAll("https://thaylinhtuyenthomo.vn/#theo-tinh", "https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/")
      .replace(/href="\.\.\/\.\.\/#theo-tinh"([^>]*)>Xem câu chuyện người thật/gu, 'href="/cau-chuyen-cong-nhan/"$1>Xem câu chuyện người thật')
      .replaceAll('href="../../#theo-tinh"', 'href="/viec-lam-nganh-than/"');
  }
  if (relativePath.startsWith("tin-nganh-than/2026/")) {
    const published = next.match(/<meta\s+property=["']article:published_time["']\s+content=["']([^"']+)["']/i)?.[1];
    if (published) {
      const date = published.slice(0, 10);
      next = next.replace(
        /(<p\s+class=["'][^"']*\beyebrow\b[^"']*["'][^>]*>[^<]*?)(\d{2}\/\d{2}\/\d{4})([^<]*<\/p>)/iu,
        `$1<time datetime="${date}">$2</time>$3`,
      );
    }
  }
  next = next.replace(/<title>([\s\S]*?)<\/title>/i, (full, title) => {
    const compact = compactSearchTitle(title);
    return compact === decodeHtml(title).replace(/\s+/gu, " ").trim() ? full : `<title>${escapeHtml(compact)}</title>`;
  });
  return next;
}

function changedHtmlFiles() {
  const output = execFileSync("git", [
    "diff",
    "--name-only",
    "--diff-filter=M",
    "--",
    "tuyen-tho-mo/**/*.html",
  ], {encoding: "utf8"});
  return output.split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
}

const errors = [];
const changed = changedHtmlFiles();
for (const repositoryPath of changed) {
  const relativePath = path.relative("tuyen-tho-mo", repositoryPath).split(path.sep).join("/");
  const current = fs.readFileSync(path.join(ROOT, repositoryPath), "utf8");
  let committed;
  try {
    committed = execFileSync("git", ["show", `HEAD:${repositoryPath}`], {encoding: "utf8", maxBuffer: 20 * 1024 * 1024});
  } catch (error) {
    errors.push(`${relativePath}: không đọc được bản đã cam kết (${error.message})`);
    continue;
  }
  const expected = transform(committed, relativePath);
  if (current !== expected) errors.push(`${relativePath}: thay đổi HTML vượt ngoài phép chuẩn hóa SEO đã định nghĩa`);
}

console.log(JSON.stringify({
  changedHtml: changed.length,
  verified: changed.length - errors.length,
  errors: errors.length,
  sampleErrors: errors.slice(0, 20),
}, null, 2));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
