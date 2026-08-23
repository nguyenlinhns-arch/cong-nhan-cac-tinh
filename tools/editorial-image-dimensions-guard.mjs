import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const dimensions = JSON.parse(fs.readFileSync(path.resolve(projectRoot, "content", "article-image-dimensions.json"), "utf8"));
const checkOnly = process.argv.includes("--check");
const changed = [];
const unresolved = [];
const discovered = new Map();

function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, output);
    else if (entry.name === "index.html") output.push(target);
  }
  return output;
}

function pageUrl(file) {
  const relative = path.relative(siteRoot, file).split(path.sep).join("/");
  if (relative === "index.html") return `${base}/`;
  return `${base}/${relative.replace(/index\.html$/, "")}`;
}

function absoluteImageUrl(source, file) {
  try { return new URL(String(source).replaceAll("&amp;", "&"), pageUrl(file)).href; }
  catch { return ""; }
}

function uint24le(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function imageSize(buffer, contentType = "") {
  if (!Buffer.isBuffer(buffer) || buffer.length < 10) return null;
  // PNG
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) {
    return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
  }
  // GIF
  if (buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a") {
    return [buffer.readUInt16LE(6), buffer.readUInt16LE(8)];
  }
  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 8 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
      if (offset + 4 > buffer.length) break;
      const length = buffer.readUInt16BE(offset + 2);
      if (length < 2 || offset + 2 + length > buffer.length) break;
      if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
        return [buffer.readUInt16BE(offset + 7), buffer.readUInt16BE(offset + 5)];
      }
      offset += 2 + length;
    }
  }
  // WebP
  if (buffer.length >= 30 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") {
    const chunk = buffer.subarray(12, 16).toString("ascii");
    if (chunk === "VP8X" && buffer.length >= 30) return [uint24le(buffer, 24) + 1, uint24le(buffer, 27) + 1];
    if (chunk === "VP8 " && buffer.length >= 30 && buffer[23] === 0x9d && buffer[24] === 0x01 && buffer[25] === 0x2a) {
      return [buffer.readUInt16LE(26) & 0x3fff, buffer.readUInt16LE(28) & 0x3fff];
    }
    if (chunk === "VP8L" && buffer.length >= 25 && buffer[20] === 0x2f) {
      const bits = buffer.readUInt32LE(21);
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
  }
  // SVG (local or fetched as text)
  if (/svg/i.test(contentType) || buffer.subarray(0, Math.min(buffer.length, 500)).toString("utf8").includes("<svg")) {
    const text = buffer.toString("utf8");
    const width = Number(text.match(/\bwidth=["']([0-9.]+)/i)?.[1] || 0);
    const height = Number(text.match(/\bheight=["']([0-9.]+)/i)?.[1] || 0);
    if (width > 0 && height > 0) return [Math.round(width), Math.round(height)];
    const viewBox = text.match(/\bviewBox=["']\s*[-0-9.]+\s+[-0-9.]+\s+([0-9.]+)\s+([0-9.]+)\s*["']/i);
    if (viewBox) return [Math.round(Number(viewBox[1])), Math.round(Number(viewBox[2]))];
  }
  return null;
}

function localFileForUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.origin !== base) return null;
    const relative = decodeURIComponent(parsed.pathname).replace(/^\/+/, "");
    const file = path.resolve(siteRoot, relative);
    return file.startsWith(siteRoot) && fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
  } catch { return null; }
}

function resolveLocal(url) {
  const file = localFileForUrl(url);
  if (!file) return null;
  try { return imageSize(fs.readFileSync(file), path.extname(file)); }
  catch { return null; }
}

async function resolveRemote(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; ThayLinhSEOImageAudit/1.0; +https://thaylinhtuyenthomo.vn/)",
        "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "range": "bytes=0-262143",
      },
    });
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    return imageSize(buffer, response.headers.get("content-type") || "");
  } catch { return null; }
  finally { clearTimeout(timer); }
}

const directories = ["giai-dap-nghe-mo", "tin-nganh-than", "bai-viet", "chuyen-nguoi-tho"];
const files = directories.flatMap((directory) => walk(path.join(siteRoot, directory)));
const needsResolution = new Map();
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const source = tag.match(/\bsrc=(["'])(.*?)\1/i)?.[2];
    if (!source) continue;
    if (/\bwidth=["']\d+["']/i.test(tag) && /\bheight=["']\d+["']/i.test(tag)) continue;
    const url = absoluteImageUrl(source, file);
    if (!url) continue;
    if (dimensions[url]) continue;
    const local = resolveLocal(url);
    if (local) { discovered.set(url, local); continue; }
    if (!needsResolution.has(url)) needsResolution.set(url, []);
    needsResolution.get(url).push(path.relative(projectRoot, file).split(path.sep).join("/"));
  }
}

const pending = [...needsResolution.keys()];
let cursor = 0;
const workers = Array.from({length: Math.min(6, pending.length)}, async () => {
  while (cursor < pending.length) {
    const index = cursor++;
    const url = pending[index];
    const size = await resolveRemote(url);
    if (size?.[0] > 0 && size?.[1] > 0) discovered.set(url, size);
  }
});
await Promise.all(workers);

function sizeFor(url) { return dimensions[url] || discovered.get(url) || null; }
function addDimensions(html, file) {
  return String(html).replace(/<img\b[^>]*>/gi, (tag) => {
    const source = tag.match(/\bsrc=(["'])(.*?)\1/i)?.[2];
    if (!source) return tag;
    const url = absoluteImageUrl(source, file);
    const size = url ? sizeFor(url) : null;
    const missingWidth = !/\bwidth=["']\d+["']/i.test(tag);
    const missingHeight = !/\bheight=["']\d+["']/i.test(tag);
    if (!missingWidth && !missingHeight) return tag;
    if (!size) {
      unresolved.push({file:path.relative(projectRoot, file).split(path.sep).join("/"), source, url});
      return tag;
    }
    if (checkOnly) return tag;
    const attributes = [];
    if (missingWidth) attributes.push(`width="${size[0]}"`);
    if (missingHeight) attributes.push(`height="${size[1]}"`);
    if (!/\bdecoding=["'](?:async|sync|auto)["']/i.test(tag)) attributes.push('decoding="async"');
    return tag.replace(/>$/, ` ${attributes.join(" ")}>`);
  });
}

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  const after = addDimensions(before, file);
  if (after === before) continue;
  fs.writeFileSync(file, after);
  changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
}

// Re-scan after repair (or directly in --check mode) so unresolved images stay a hard gate.
const stillMissing = [];
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    if (/\bwidth=["']\d+["']/i.test(tag) && /\bheight=["']\d+["']/i.test(tag)) continue;
    const source = tag.match(/\bsrc=(["'])(.*?)\1/i)?.[2] || "";
    stillMissing.push({file:path.relative(projectRoot, file).split(path.sep).join("/"), source});
  }
}

if (process.env.GITHUB_ACTIONS === "true" && changed.length) {
  for (let index = 0; index < changed.length; index += 50) {
    const chunk = changed.slice(index, index + 50);
    try { execFileSync("git", ["update-index", "--assume-unchanged", "--", ...chunk], {cwd: projectRoot, stdio: "ignore"}); }
    catch {}
  }
}

console.log(JSON.stringify({
  status: stillMissing.length ? "editorial-image-dimensions-guard-invalid" : "editorial-image-dimensions-guard-complete",
  checkOnly,
  scannedFiles: files.length,
  discoveredDimensions: discovered.size,
  remoteAttempted: pending.length,
  changedFiles: changed.length,
  unresolved: unresolved.slice(0, 30),
  stillMissing: stillMissing.slice(0, 30),
}, null, 2));
if (stillMissing.length) process.exitCode = 1;
