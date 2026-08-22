import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const file = path.resolve(
  projectRoot,
  "tuyen-tho-mo",
  "tin-nganh-than",
  "2026",
  "08",
  "01",
  "viec-lam-nganh-than-thang-8-2026",
  "index.html",
);
const canonicalFactsPath = "/thong-tin-tuyen-tho-mo/";
const marker = "<!-- editorial-current-facts:start -->";
const block = `${marker}
<div class="article-current-facts">
  <a href="${canonicalFactsPath}">Đối chiếu điều kiện, thời gian học, hồ sơ và quyền lợi đang áp dụng →</a>
</div>
<!-- editorial-current-facts:end -->`;

if (!fs.existsSync(file)) {
  throw new Error("Không tìm thấy bài tuyển thợ mỏ tháng 8/2026 để gắn đường đối chiếu thông tin hiện hành");
}

const before = fs.readFileSync(file, "utf8");
let after = before.replace(
  /<!-- editorial-current-facts:start -->[\s\S]*?<!-- editorial-current-facts:end -->/i,
  block,
);

if (!after.includes(canonicalFactsPath)) {
  if (after.includes("<!-- editorial-faq-v3:start -->")) {
    after = after.replace("<!-- editorial-faq-v3:start -->", `${block}\n<!-- editorial-faq-v3:start -->`);
  } else if (/<nav\b[^>]*class=["'][^"']*\barticle-nav\b/i.test(after)) {
    after = after.replace(/(<nav\b[^>]*class=["'][^"']*\barticle-nav\b)/i, `${block}\n$1`);
  } else if (/<section\b[^>]*class=["'][^"']*\barticle-apply\b/i.test(after)) {
    after = after.replace(/(<section\b[^>]*class=["'][^"']*\barticle-apply\b)/i, `${block}\n$1`);
  } else {
    after = after.replace(/<\/article>/i, `${block}\n</article>`);
  }
}

if (!after.includes(`href="${canonicalFactsPath}"`)) {
  throw new Error("Không thể gắn liên kết tới trang thông tin tuyển đang áp dụng");
}

if (after !== before) {
  fs.writeFileSync(file, after);
  if (process.env.GITHUB_ACTIONS === "true") {
    const relative = path.relative(projectRoot, file).split(path.sep).join("/");
    try {
      execFileSync("git", ["update-index", "--assume-unchanged", "--", relative], {
        cwd: projectRoot,
        stdio: "ignore",
      });
    } catch {}
  }
}

console.log(JSON.stringify({
  status: "editorial-current-facts-link-ready",
  changed: after !== before,
  path: canonicalFactsPath,
}, null, 2));
