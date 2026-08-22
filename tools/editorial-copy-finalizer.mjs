import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
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

function finishCopy(html) {
  return String(html)
    .replace(/\s+data-editorial-style="newsroom"/gi, "")
    .replace(/Bài được Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung dựa trên/gi, "Bài do Nguyễn Tử Linh biên tập dựa trên")
    .replace(/Bài được Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung từ/gi, "Bài do Nguyễn Tử Linh biên tập từ")
    .replace(/Bài do Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung dựa trên/gi, "Bài do Nguyễn Tử Linh biên tập dựa trên")
    .replace(/Bài do Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung từ/gi, "Bài do Nguyễn Tử Linh biên tập từ")
    .replace(/Bài được Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung/gi, "Bài do Nguyễn Tử Linh biên tập")
    .replace(/Bài do Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung/gi, "Bài do Nguyễn Tử Linh biên tập")
    .replace(/\bBài viết này được biên soạn\b/gi, "Bài viết được biên tập")
    .replace(/\bNội dung được tổng hợp lại\b/gi, "Nội dung được biên tập lại")
    .replace(/<p\s+class="article-seo-line">[\s\S]*?<\/p>/gi, "")
    .replace(/<p\s+class="keyword-summary">[\s\S]*?<\/p>/gi, "")
    .replace(/LAN TỎA THÔNG TIN ĐÚNG NGUỒN/gi, "CHIA SẺ BÀI VIẾT");
}

for (const directory of ["tin-nganh-than", "bai-viet", "chuyen-nguoi-tho"]) {
  for (const file of walk(path.join(siteRoot, directory))) {
    const before = fs.readFileSync(file, "utf8");
    if (!/"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(before)) continue;
    const after = finishCopy(before);
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

console.log(JSON.stringify({status: "editorial-copy-finalized", changedFiles: changed.length}, null, 2));
