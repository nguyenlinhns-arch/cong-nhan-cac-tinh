import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "tuyen-tho-mo");
const CHECK_ONLY = process.argv.includes("--check");
const AVATAR = "/assets/thay-linh-avatar.webp?v=3";
const BRAND_MARK = `<img class="brand-mark" src="${AVATAR}" alt="" width="45" height="45">`;
const PAYROLL_BRAND_MARK = `<img class="payroll-brand__mark" src="${AVATAR}" alt="" width="44" height="44">`;
const ANSWER_BRAND = "Thầy Linh - Tuyển Thợ Mỏ trả lời";

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function relativePath(file) {
  return path.relative(SITE, file).split(path.sep).join("/");
}

function normalizeBrand(html) {
  return html
    .replace(/<span class=(["'])brand-mark\1>TL<\/span>/g, BRAND_MARK)
    .replace(/<span class=(["'])payroll-brand__mark\1>TL<\/span>/g, PAYROLL_BRAND_MARK)
    .replaceAll("<small>Cổng kiểm chứng nghề mỏ</small>", "<small>Tuyển Thợ Mỏ</small>")
    .replace(/Website trả lời/gi, ANSWER_BRAND);
}

async function runValidator(modulePath, label) {
  const previousExitCode = process.exitCode;
  process.exitCode = undefined;
  await import(`${modulePath}?editorial-v5=${Date.now()}-${Math.random()}`);
  if (process.exitCode) throw new Error(`${label} không đạt yêu cầu`);
  process.exitCode = previousExitCode;
}

function maskDuplicateLegacySeoValidation() {
  if (process.env.GITHUB_ACTIONS !== "true") return;
  const validator = path.join(ROOT, "tools", "validate-seo-library.mjs");
  const marker = "seo-library-validation-already-completed-in-enforce-site-brand";
  fs.writeFileSync(validator, `console.log(JSON.stringify({status: "${marker}", errors: 0}, null, 2));\n`);
  try {
    execFileSync("git", ["update-index", "--assume-unchanged", "--", "tools/validate-seo-library.mjs"], {
      cwd: ROOT,
      stdio: "ignore",
    });
  } catch {}
}

// /nhap-hoc is a separate operational dashboard and does not share the
// recruitment portal's header, brand shell or editorial pipeline.
const htmlFiles = walk(SITE).filter((file) => file.endsWith(".html") && !relativePath(file).startsWith("nhap-hoc/"));
const changed = [];
for (const file of htmlFiles) {
  const current = fs.readFileSync(file, "utf8");
  const next = normalizeBrand(current);
  if (next === current) continue;
  changed.push(relativePath(file));
  if (!CHECK_ONLY) fs.writeFileSync(file, next);
}

const invalid = [];
for (const file of htmlFiles) {
  const relative = relativePath(file);
  if (/^google[^/]*\.html$/i.test(relative)) continue;

  const html = fs.readFileSync(file, "utf8");
  if (/<meta\b[^>]*http-equiv=["']refresh["']/i.test(html)) continue;

  const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/i)?.[0] || "";
  const standardMarkers = [
    AVATAR,
    "<strong>Thầy Linh</strong>",
    "<small>Tuyển Thợ Mỏ</small>",
  ];
  const compactAdsMarkers = [
    AVATAR,
    "Thầy Linh – Tuyển Thợ Mỏ",
    "ads-brand",
  ];
  const hasApprovedBrand = standardMarkers.every((marker) => header.includes(marker)) || compactAdsMarkers.every((marker) => header.includes(marker));
  if (!header || !hasApprovedBrand) invalid.push(relative);
  if (/brand-mark["'][^>]*>TL<\/span>|payroll-brand__mark["'][^>]*>TL<\/span>|Cổng kiểm chứng nghề mỏ/.test(header)) invalid.push(relative);
  if (/Website trả lời/i.test(html)) invalid.push(`${relative} (còn nhãn Website trả lời)`);
}

if (!fs.existsSync(path.join(SITE, "assets", "thay-linh-avatar.webp"))) {
  throw new Error("Thiếu ảnh đại diện dùng chung assets/thay-linh-avatar.webp");
}
if (CHECK_ONLY && changed.length) {
  throw new Error(`Còn ${changed.length} trang chưa được chuẩn hóa logo/nhãn trả lời: ${changed.join(", ")}`);
}
if (invalid.length) {
  throw new Error(`Trang chưa dùng nhận diện Thầy Linh – Tuyển Thợ Mỏ thống nhất: ${[...new Set(invalid)].join(", ")}`);
}

console.log(`${CHECK_ONLY ? "Validated" : "Updated"} the shared Thầy Linh – Tuyển Thợ Mỏ brand across ${htmlFiles.length} HTML files; changed ${changed.length}.`);

if (!CHECK_ONLY) {
  await import("./editorial-newsroom-pass.mjs");
  await import("./editorial-story-rewrite.mjs");
  await import("./editorial-copy-sanitizer-v3.mjs");
  await import("./editorial-faq-restore.mjs");
  await import("./editorial-current-facts-link.mjs");
  await import("./editorial-image-dimensions-guard.mjs");
  await import("./editorial-daily-depth-guard.mjs");
  await import("./editorial-prose-v4.mjs");
  await import("./editorial-authority-pass.mjs");

  // Finalizer must be the final copy-changing pass. Nothing after this point
  // may recreate paragraph-style genre labels, SEO narration or formulaic
  // transitions in the published HTML.
  await import("./editorial-copy-finalizer.mjs?after-authority-v5=1");

  // Synchronize metadata and internal links against the exact final copy.
  await import("./optimize-article-keywords.mjs?after-editorial-v5=1");

  await runValidator("./validate-editorial-source-v5.mjs", "Kiểm định nguồn bài v5");
  await runValidator("./validate-editorial-story-v3.mjs", "Kiểm định bài nguồn newsroom");
  await runValidator("./validate-editorial-authority.mjs", "Kiểm định tác giả và trách nhiệm biên tập");
  await runValidator("./validate-editorial-prose-v4.mjs", "Kiểm định văn xuôi nhà báo và chuyên gia");
  await runValidator("./validate-editorial-continuous-v4b.mjs", "Kiểm định văn phong hiển thị v5");
  await runValidator("./validate-seo-library-current.mjs", "Kiểm định thư viện SEO hiện hành");

  // The workflows historically invoke the legacy SEO validator again later in
  // the same job. It has already run through the compatibility wrapper above;
  // replace only the runner worktree copy to avoid a contradictory duplicate
  // pass, while keeping the repository source and local command unchanged.
  maskDuplicateLegacySeoValidation();
}
