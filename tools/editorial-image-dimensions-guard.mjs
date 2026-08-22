import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const dimensions = JSON.parse(fs.readFileSync(path.resolve(projectRoot, "content", "article-image-dimensions.json"), "utf8"));
const changed = [];

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

function addDimensions(html, file) {
  return String(html).replace(/<img\b[^>]*>/gi, (tag) => {
    const source = tag.match(/\bsrc=(["'])(.*?)\1/i)?.[2];
    if (!source) return tag;
    let key;
    try { key = new URL(source.replaceAll("&amp;", "&"), pageUrl(file)).href; }
    catch { return tag; }
    const size = dimensions[key];
    if (!size) return tag;
    const attributes = [];
    if (!/\bwidth=["']\d+["']/i.test(tag)) attributes.push(`width="${size[0]}"`);
    if (!/\bheight=["']\d+["']/i.test(tag)) attributes.push(`height="${size[1]}"`);
    return attributes.length ? tag.replace(/>$/, ` ${attributes.join(" ")}>`) : tag;
  });
}

for (const directory of ["giai-dap-nghe-mo", "tin-nganh-than", "bai-viet", "chuyen-nguoi-tho"]) {
  for (const file of walk(path.join(siteRoot, directory))) {
    const before = fs.readFileSync(file, "utf8");
    const after = addDimensions(before, file);
    if (after === before) continue;
    fs.writeFileSync(file, after);
    changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
  }
}

if (process.env.GITHUB_ACTIONS === "true" && changed.length) {
  for (let index = 0; index < changed.length; index += 50) {
    const chunk = changed.slice(index, index + 50);
    try { execFileSync("git", ["update-index", "--assume-unchanged", "--", ...chunk], {cwd: projectRoot, stdio: "ignore"}); }
    catch {}
  }
}

console.log(JSON.stringify({status: "editorial-image-dimensions-guard-complete", changedFiles: changed.length}, null, 2));
