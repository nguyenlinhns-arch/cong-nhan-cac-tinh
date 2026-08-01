import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const errors = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([^\s=/>]+)\s*=\s*(["'])(.*?)\2/gis)]
    .map((match) => [match[1].toLowerCase(), match[3]]));
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((match) => attributes(match[0]));
}

function classList(value = "") {
  return String(value).split(/\s+/).filter(Boolean);
}

const htmlFiles = walk(root)
  .filter((file) => file.endsWith(".html"))
  .filter((file) => !/^google[a-z0-9_-]+\.html$/i.test(path.basename(file)));

let bypassLinks = 0;
let imagesChecked = 0;
let ariaReferences = 0;

for (const file of htmlFiles) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  const html = fs.readFileSync(file, "utf8");
  const ids = [...html.matchAll(/<[^>]+\sid=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  const mainTags = tags(html, "main");
  const h1Count = (html.match(/<h1\b/gi) || []).length;

  if (!/<html\b[^>]*\blang=["']vi["']/i.test(html)) errors.push(`${relative}: html lang must be vi`);
  if (h1Count !== 1) errors.push(`${relative}: expected one h1, got ${h1Count}`);
  if (mainTags.length !== 1 || !mainTags[0].id) errors.push(`${relative}: main landmark needs one stable id`);
  if (duplicateIds.length) errors.push(`${relative}: duplicate ids ${duplicateIds.join(", ")}`);

  const bypass = tags(html, "a").find((item) => {
    const classes = classList(item.class);
    return classes.includes("skip-link") || classes.includes("network-skip");
  });
  if (!bypass) {
    errors.push(`${relative}: missing keyboard bypass link`);
  } else {
    bypassLinks += 1;
    const target = String(bypass.href || "").replace(/^#/, "");
    if (!target || !ids.includes(target)) errors.push(`${relative}: bypass link target is missing`);
  }

  for (const image of tags(html, "img")) {
    imagesChecked += 1;
    if (!("alt" in image)) errors.push(`${relative}: image is missing alt text`);
  }

  for (const link of tags(html, "a")) {
    if (link.target === "_blank" && !classList(link.rel).includes("noopener")) {
      errors.push(`${relative}: target=_blank link is missing rel=noopener`);
    }
  }

  for (const frame of tags(html, "iframe")) {
    if (!String(frame.title || "").trim()) errors.push(`${relative}: iframe is missing a title`);
  }

  for (const tag of html.match(/<[^!/][^>]*>/g) || []) {
    const item = attributes(tag);
    for (const attribute of ["aria-labelledby", "aria-describedby"]) {
      if (!item[attribute]) continue;
      for (const id of item[attribute].split(/\s+/).filter(Boolean)) {
        ariaReferences += 1;
        if (!ids.includes(id)) errors.push(`${relative}: ${attribute} points to missing #${id}`);
      }
    }
  }
}

const applicationPages = [
  "viec-lam/cong-nhan-mo-ham-lo-quang-ninh/index.html",
  "viec-lam/ky-thuat-khai-thac-mo-ham-lo-quang-ninh/index.html",
  "viec-lam/ky-thuat-xay-dung-mo-ham-lo-quang-ninh/index.html",
];

for (const relative of applicationPages) {
  const html = fs.readFileSync(path.join(root, relative), "utf8");
  const required = [
    "<noscript>",
    "application-birth-help",
    "application-height-help",
    "application-weight-help",
    "application-health-help",
    "data-application-draft-status",
    'autocomplete="address-level1"',
    'role="region" aria-labelledby="application-result-title" tabindex="-1"',
    'data-application-delivery role="status" aria-live="polite" aria-atomic="true"',
    "job-application.js?v=9",
  ];
  for (const marker of required) if (!html.includes(marker)) errors.push(`${relative}: missing ${marker}`);
  if (/data-application-result[^>]*aria-live=/i.test(html)) errors.push(`${relative}: long result region must not be a live region`);
}

const applicationScript = fs.readFileSync(path.join(root, "job-application.js"), "utf8");
for (const marker of [
  "submissionFingerprint",
  "previousAttempt?.application.code",
  'action: previousAttempt ? "application_retry" : "application_submitted"',
  'deliveryOutput.dataset.state = "pending"',
  "prefers-reduced-motion: reduce",
  'form.setAttribute("aria-busy", "true")',
  "attempt.leadTracked",
  "Thử gửi lại cùng mã",
  "restoreDraft",
  "DRAFT_TTL_MS",
  "ApplicationDraftRestore",
]) if (!applicationScript.includes(marker)) errors.push(`job-application.js: missing ${marker}`);

console.log(JSON.stringify({
  html: htmlFiles.length,
  bypassLinks,
  imagesChecked,
  ariaReferences,
  applicationPages: applicationPages.length,
  errors: errors.length,
  sampleErrors: errors.slice(0, 30),
}, null, 2));

if (errors.length) process.exitCode = 1;
