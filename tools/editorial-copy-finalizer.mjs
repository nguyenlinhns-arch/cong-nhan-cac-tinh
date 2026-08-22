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

function mapOutsideScripts(html, transform) {
  return String(html).split(/(<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>)/gi)
    .map((part) => /^<(?:script|style)\b/i.test(part) ? part : transform(part))
    .join("");
}

function finishCopy(html) {
  let output = String(html)
    .replace(/\s+data-editorial-style="newsroom"/gi, "")
    .replace(/<strong>Nguồn\s+tư\s+liệu:<\/strong>/gi, "<strong>Nguồn:</strong>")
    .replace(/<p\b([^>]*)class="([^"]*\barticle-genre-label\b[^"]*)"([^>]*)>([\s\S]*?)<\/p>/gi, '<div$1class="$2"$3 role="note">$4</div>')
    .replace(/Bài\s+được\s+Nguyễn\s+Tử\s+Linh\s*·\s*Biên\s+tập\s+và\s+chịu\s+trách\s+nhiệm\s+nội\s+dung\s+dựa\s+trên/gi, "Bài do Nguyễn Tử Linh biên tập dựa trên")
    .replace(/Bài\s+được\s+Nguyễn\s+Tử\s+Linh\s*·\s*Biên\s+tập\s+và\s+chịu\s+trách\s+nhiệm\s+nội\s+dung\s+từ/gi, "Bài do Nguyễn Tử Linh biên tập từ")
    .replace(/Bài\s+do\s+Nguyễn\s+Tử\s+Linh\s*·\s*Biên\s+tập\s+và\s+chịu\s+trách\s+nhiệm\s+nội\s+dung\s+dựa\s+trên/gi, "Bài do Nguyễn Tử Linh biên tập dựa trên")
    .replace(/Bài\s+do\s+Nguyễn\s+Tử\s+Linh\s*·\s*Biên\s+tập\s+và\s+chịu\s+trách\s+nhiệm\s+nội\s+dung\s+từ/gi, "Bài do Nguyễn Tử Linh biên tập từ")
    .replace(/Bài\s+được\s+Nguyễn\s+Tử\s+Linh\s*·\s*Biên\s+tập\s+và\s+chịu\s+trách\s+nhiệm\s+nội\s+dung/gi, "Bài do Nguyễn Tử Linh biên tập")
    .replace(/Bài\s+do\s+Nguyễn\s+Tử\s+Linh\s*·\s*Biên\s+tập\s+và\s+chịu\s+trách\s+nhiệm\s+nội\s+dung/gi, "Bài do Nguyễn Tử Linh biên tập")
    .replace(/<p\b[^>]*class="[^"]*(?:article-seo-line|keyword-summary|article-editor-note)[^"]*"[^>]*>[\s\S]*?<\/p>/gi, "")
    .replace(/LAN\s+TỎA\s+THÔNG\s+TIN\s+ĐÚNG\s+NGUỒN/gi, "CHIA SẺ BÀI VIẾT");

  output = mapOutsideScripts(output, (part) => part
    .replace(/\bBài\s+viết\s+này\s+được\s+biên\s+soạn\b/gi, "Bài viết được biên tập")
    .replace(/\bNội\s+dung\s+được\s+tổng\s+hợp\s+lại\b/gi, "Nội dung được biên tập lại")
    .replace(/\bTheo\s+nguồn,?\s*/giu, "")
    .replace(/\bNguồn\s+cho\s+biết(?:\s+rằng)?\s*/giu, "")
    .replace(/\bĐiểm\s+đáng\s+chú\s+ý\s+của\s+cuộc\s+làm\s+việc\s+là\s+cách\s+đưa\s+thông\s+tin\s+trở\s+lại\s+cấp\s+xã,\s*thôn\s+thay\s+vì\s+dừng\s+ở\s+một\s+hội\s+nghị\s+tập\s+trung\.?/giu, "Cuộc làm việc hướng hoạt động tư vấn trở lại cấp xã, thôn để thông tin tiếp tục đến đúng địa bàn sau hội nghị tập trung.")
    .replace(/\bTrọng\s+tâm\s+không\s+chỉ\s+là\s+tăng\s+số\s+người\s+vào\s+học\.?/giu, "Cuộc làm việc đặt tuyển sinh trong toàn bộ lộ trình từ tiếp cận người học đến đào tạo và thực tập.")
    .replace(/\bĐiều\s+được\s+truyền\s+lại\s+không\s+chỉ\s+là\s+công\s+việc,\s*mà\s+còn\s+là\s+kỷ\s+luật,\s*lòng\s+tự\s+trọng\s+và\s+trách\s+nhiệm\s+với\s+gia\s+đình\.?/giu, "Gia đình truyền lại cả công việc, kỷ luật, lòng tự trọng và trách nhiệm với nhau.")
    .replace(/\bĐây\s+không\s+chỉ\s+là\s+một\s+tin\s+tuyển\.?/giu, "Thông tin tuyển sinh mô tả một lộ trình cụ thể.")
    .replace(/\bPhúc\s+lợi\s+không\s+chỉ\s+là\s+khoản\s+hỗ\s+trợ\s+sau\s+khó\s+khăn\.?/giu, "Phúc lợi bao gồm cả hỗ trợ sau khó khăn và những điều kiện giúp người lao động duy trì sức khỏe, ngày công và khả năng gắn bó.")
    .replace(/\bĐáng\s+chú\s+ý(?:\s+là)?[,;:]?\s*/giu, "")
    .replace(/\bnhằm\s+góp\s+phần\b/giu, "để")
    .replace(/\bqua\s+đó\s+góp\s+phần\b/giu, "qua đó")
    .replace(/\s{2,}/g, " "));
  return output;
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

console.log(JSON.stringify({status: "editorial-copy-finalized-v5d", changedFiles: changed.length}, null, 2));