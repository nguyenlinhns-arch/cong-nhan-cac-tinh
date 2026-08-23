import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const provinceRoot = path.join(site, "viec-lam-nganh-than");
const errors = [];
let changedFiles = 0;
let changedAttributes = 0;

function normalizeRelativeTarget(raw) {
  if (!raw || raw.startsWith("#") || raw.startsWith("/") || /^(?:https?:|mailto:|tel:|sms:|javascript:|data:|\/\/)/iu.test(raw)) return raw;
  if (!/^(?:(?:\.\.\/)|(?:\.\/))+/u.test(raw)) return raw;
  const stripped = raw.replace(/^(?:(?:\.\.\/)|(?:\.\/))+/u, "");
  if (!stripped) return "/";
  if (stripped === "#theo-tinh") return "/viec-lam-nganh-than/";
  return `/${stripped}`;
}

for (const entry of fs.readdirSync(provinceRoot, {withFileTypes: true}).sort((a, b) => a.name.localeCompare(b.name, "vi"))) {
  if (!entry.isDirectory()) continue;
  const file = path.join(provinceRoot, entry.name, "index.html");
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  let fileChanges = 0;
  let after = before.replace(/\b(href|src|action)=(["'])([^"']*)\2/giu, (full, attribute, quote, target) => {
    const normalized = normalizeRelativeTarget(target);
    if (normalized === target) return full;
    fileChanges += 1;
    changedAttributes += 1;
    return `${attribute}=${quote}${normalized}${quote}`;
  });

  // These historical anchors used to point back to a homepage section. The
  // current local-information hub has its own canonical route.
  after = after
    .replace(/href=(["'])\/#theo-tinh\1/giu, 'href="/viec-lam-nganh-than/"')
    .replace(/href=(["'])\.\/\.\/([^"']*)\1/giu, (full, quote, rest) => {
      fileChanges += 1;
      changedAttributes += 1;
      return `href=${quote}/${rest}${quote}`;
    });

  if (fileChanges) {
    fs.writeFileSync(file, after);
    changedFiles += 1;
  }

  const finalHtml = fileChanges ? after : before;
  for (const match of finalHtml.matchAll(/\b(href|src|action)=(["'])([^"']*)\2/giu)) {
    const target = match[3];
    if (/^(?:(?:\.\.\/)|(?:\.\/))+/u.test(target)) errors.push(`${entry.name}: còn đường dẫn tương đối ${match[1]}=${target}`);
    if (/^\.\/\.\//u.test(target)) errors.push(`${entry.name}: còn đường dẫn lỗi ././ ${target}`);
  }
}

const pageCount = fs.readdirSync(provinceRoot, {withFileTypes: true})
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(provinceRoot, entry.name, "index.html"))).length;
if (pageCount !== 34) errors.push(`Dự kiến 34 landing tỉnh/thành, thực tế ${pageCount}`);

console.log(JSON.stringify({
  status: errors.length ? "province-internal-links-v11-invalid" : "province-internal-links-v11-ready",
  pages: pageCount,
  changedFiles,
  changedAttributes,
  errors,
}, null, 2));
if (errors.length) process.exitCode = 1;
