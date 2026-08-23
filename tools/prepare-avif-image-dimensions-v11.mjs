import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const dimensionsPath = path.resolve(projectRoot, "content", "article-image-dimensions.json");
const dimensions = JSON.parse(fs.readFileSync(dimensionsPath, "utf8"));
const targets = new Set();

function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, output);
    else if (entry.name === "index.html") output.push(target);
  }
  return output;
}

for (const directory of ["giai-dap-nghe-mo", "tin-nganh-than", "bai-viet", "chuyen-nguoi-tho"]) {
  for (const file of walk(path.join(siteRoot, directory))) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/<img\b[^>]*\bsrc=(["'])(https?:\/\/[^"']+?\.avif(?:\?[^"']*)?)\1[^>]*>/giu)) {
      const url = match[2].replaceAll("&amp;", "&");
      if (!dimensions[url]) targets.add(url);
    }
  }
}

function parseIspe(buffer) {
  const needle = Buffer.from("ispe", "ascii");
  const candidates = [];
  let offset = 0;
  while (offset >= 0 && offset < buffer.length - 16) {
    const index = buffer.indexOf(needle, offset);
    if (index < 0) break;
    if (index >= 4 && index + 16 <= buffer.length) {
      const boxSize = buffer.readUInt32BE(index - 4);
      const width = buffer.readUInt32BE(index + 8);
      const height = buffer.readUInt32BE(index + 12);
      if (boxSize >= 20 && width > 0 && height > 0 && width <= 20000 && height <= 20000) candidates.push([width, height]);
    }
    offset = index + 4;
  }
  if (!candidates.length) return null;
  return candidates.sort((a, b) => (b[0] * b[1]) - (a[0] * a[1]))[0];
}

async function fetchAvifSize(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; ThayLinhSEOImageAudit/1.0; +https://thaylinhtuyenthomo.vn/)",
        "accept": "image/avif,image/webp,image/*,*/*;q=0.8",
        "range": "bytes=0-1048575",
      },
    });
    if (!response.ok) return null;
    return parseIspe(Buffer.from(await response.arrayBuffer()));
  } catch { return null; }
  finally { clearTimeout(timer); }
}

const urls = [...targets];
const resolved = [];
const unresolved = [];
let cursor = 0;
const workers = Array.from({length: Math.min(6, urls.length)}, async () => {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    const size = await fetchAvifSize(url);
    if (size) {
      dimensions[url] = size;
      resolved.push({url, width:size[0], height:size[1]});
    } else unresolved.push(url);
  }
});
await Promise.all(workers);

if (resolved.length) {
  fs.writeFileSync(dimensionsPath, `${JSON.stringify(dimensions, null, 2)}\n`);
  if (process.env.GITHUB_ACTIONS === "true") {
    try { execFileSync("git", ["update-index", "--assume-unchanged", "--", "content/article-image-dimensions.json"], {cwd: projectRoot, stdio:"ignore"}); }
    catch {}
  }
}

console.log(JSON.stringify({
  status: unresolved.length ? "avif-dimensions-partial" : "avif-dimensions-ready",
  targets: urls.length,
  resolved: resolved.length,
  unresolved,
  sample: resolved.slice(0, 12),
}, null, 2));
