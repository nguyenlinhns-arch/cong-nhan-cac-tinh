import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "mobile-ux.js");
let source = fs.readFileSync(target, "utf8");
const beforeBytes = Buffer.byteLength(source);
const beforeSha256 = crypto.createHash("sha256").update(source).digest("hex");
const markers = [
  "function applicationContext()",
  "Object.entries(applicationContext())",
];

if (markers.every((marker) => source.includes(marker))) {
  console.log(JSON.stringify({target: "tuyen-tho-mo/mobile-ux.js", status: "already-enhanced", beforeBytes, beforeSha256}, null, 2));
  process.exit(0);
}
if (markers.some((marker) => source.includes(marker))) throw new Error("Application context preservation is only partially present");

const oldFunction = `  function trackedApplicationUrl(campaign, content) {
    const url = new URL(APPLICATION_URL, ROOT);
    url.searchParams.set("utm_source", "website");
    url.searchParams.set("utm_medium", "internal");
    url.searchParams.set("utm_campaign", campaign);
    url.searchParams.set("utm_content", content);
    return \`\${url.pathname}\${url.search}\${url.hash}\`;
  }
`;

const newFunction = `  function applicationContext() {
    const values = {}, read = (href) => {
      try {
        const url = new URL(href, location.href);
        for (const key of ["province", "trade"]) values[key] ||= url.searchParams.get(key)?.slice(0, 80);
      } catch (_) {}
    };
    read(location.href);
    const path = new URL(APPLICATION_URL, ROOT).pathname;
    document.querySelectorAll?.(\`a[href*=\"\${path}\"]\`)?.forEach((link) => read(link.href));
    return values;
  }

  function trackedApplicationUrl(campaign, content) {
    const url = new URL(APPLICATION_URL, ROOT);
    for (const [key, value] of Object.entries(applicationContext())) if (value) url.searchParams.set(key, value);
    url.searchParams.set("utm_source", "website");
    url.searchParams.set("utm_medium", "internal");
    url.searchParams.set("utm_campaign", campaign);
    url.searchParams.set("utm_content", content);
    return \`\${url.pathname}\${url.search}\${url.hash}\`;
  }
`;

if (!source.includes(oldFunction)) throw new Error("Could not locate trackedApplicationUrl");
source = source.replace(oldFunction, newFunction);
for (const marker of markers) if (!source.includes(marker)) throw new Error(`Application context preservation is missing ${marker}`);
const afterBytes = Buffer.byteLength(source);
if (afterBytes > 42_000) throw new Error(`Province-aware mobile-ux.js exceeds 42 KB: ${afterBytes}`);
const afterSha256 = crypto.createHash("sha256").update(source).digest("hex");
fs.writeFileSync(target, source);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/mobile-ux.js",
  status: "enhanced",
  preservedFields: ["province", "trade"],
  beforeBytes,
  afterBytes,
  beforeSha256,
  afterSha256,
}, null, 2));
