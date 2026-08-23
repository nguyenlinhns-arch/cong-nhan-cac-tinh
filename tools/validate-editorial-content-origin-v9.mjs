import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const errors = [];
const stats = {checked:0, firsthand:0, sourcedEditorial:0, expertExplainer:0, currentExplainer:0, corePolicy:0, localContext:0, jobPolicy:0, networkNav:0};
const policyLink = "/nguyen-tac-bien-tap/#phan-loai-nguon";
const releaseDate = new Intl.DateTimeFormat("en-CA", {timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const daily = JSON.parse(fs.readFileSync(path.join(root, "daily-seo-articles.json"), "utf8"));

function dailySlugFromRegistryItem(item) {
  try {
    const pathname = new URL(String(item?.canonical_url || "")).pathname.replace(/\/+$/g, "");
    return pathname.match(/\/giai-dap-nghe-mo\/([^/]+)$/i)?.[1] || "";
  } catch {
    return "";
  }
}

const releasedDailySlugs = new Set((daily.articles || [])
  .filter((item) => {
    const effective = String(item?.publish_on || item?.date_published || "").slice(0,10);
    return !effective || effective <= releaseDate;
  })
  .map(dailySlugFromRegistryItem)
  .filter(Boolean));

function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, output);
    else if (entry.name === "index.html") output.push(target);
  }
  return output;
}

function rel(file) { return path.relative(root, file).split(path.sep).join("/"); }
function meta(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.match(new RegExp(`<meta\\b[^>]*name=["']${escaped}["'][^>]*content=["']([^"']+)["'][^>]*>`, "i"))?.[1]
    || html.match(new RegExp(`<meta\\b[^>]*content=["']([^"']+)["'][^>]*name=["']${escaped}["'][^>]*>`, "i"))?.[1]
    || "";
}
function indexable(html) {
  return !/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)
    && !/<meta\b[^>]*http-equiv=["']refresh["']/i.test(html);
}
function dailySlug(relative) {
  return relative.match(/^giai-dap-nghe-mo\/([^/]+)\/index\.html$/i)?.[1] || "";
}
function expectedOrigin(relative) {
  if (/^phong-su\/[^/]+\/index\.html$/i.test(relative)) return "firsthand";
  if (/^tin-nganh-than\/20\d{2}\//i.test(relative)) return "sourced-editorial";
  if (/^bai-viet\/[^/]+\/index\.html$/i.test(relative)) return "expert-explainer";
  const slug = dailySlug(relative);
  if (slug && releasedDailySlugs.has(slug)) return "current-explainer";
  return "";
}

const articleFiles = [
  ...walk(path.join(root, "phong-su")),
  ...walk(path.join(root, "tin-nganh-than")),
  ...walk(path.join(root, "bai-viet")),
  ...walk(path.join(root, "giai-dap-nghe-mo")),
].filter((file) => {
  const relative = rel(file);
  if (!expectedOrigin(relative)) return false;
  const html = fs.readFileSync(file, "utf8");
  return indexable(html);
});

for (const file of articleFiles) {
  stats.checked += 1;
  const relative = rel(file);
  const html = fs.readFileSync(file, "utf8");
  const expected = expectedOrigin(relative);
  const declared = meta(html, "content-origin");
  if (declared !== expected) errors.push(`${relative}: content-origin ${declared || "missing"} phải là ${expected}`);
  if (!html.includes(`data-content-origin="${expected}"`)) errors.push(`${relative}: <html> thiếu data-content-origin=${expected}`);
  if (!html.includes('/editorial-content-origin-v9.css?v=1')) errors.push(`${relative}: thiếu CSS nguồn v9`);
  if (!html.includes(`data-content-origin-note="${expected}"`)) errors.push(`${relative}: thiếu nhãn nguồn hiển thị ${expected}`);
  if (!html.includes(policyLink)) errors.push(`${relative}: nhãn nguồn thiếu liên kết nguyên tắc kiểm chứng`);
  const labels = (html.match(/data-content-origin-note=/g) || []).length;
  if (labels !== 1) errors.push(`${relative}: cần đúng 1 nhãn nguồn, hiện ${labels}`);

  if (expected === "firsthand") {
    stats.firsthand += 1;
    if (!html.includes("Tư liệu trực tiếp") || !html.includes("Không dựng lời nhân vật")) errors.push(`${relative}: nhãn tư liệu trực tiếp chưa đủ minh bạch`);
    if (!html.includes('data-editorial-original="field-report-v8"')) errors.push(`${relative}: tư liệu trực tiếp thiếu dấu field-report-v8`);
  } else if (expected === "sourced-editorial") {
    stats.sourcedEditorial += 1;
    if (!html.includes("Biên tập từ nguồn")) errors.push(`${relative}: thiếu nhãn biên tập từ nguồn`);
    if (!html.includes("Nguồn tư liệu:") && !html.includes('class="article-source-note"') && !html.includes('<strong>Nguồn:</strong>')) errors.push(`${relative}: bài nguồn thiếu attribution cuối bài`);
  } else if (expected === "expert-explainer") {
    stats.expertExplainer += 1;
    if (!html.includes("Giải thích chuyên môn")) errors.push(`${relative}: thiếu nhãn giải thích chuyên môn`);
    if (!html.includes('<strong>Nguồn:</strong>')) errors.push(`${relative}: bài chuyên môn thiếu nguồn cuối bài`);
  } else if (expected === "current-explainer") {
    stats.currentExplainer += 1;
    if (!html.includes("Giải đáp hiện hành")) errors.push(`${relative}: thiếu nhãn giải đáp hiện hành`);
    if (!/thông-tin-tuyen-tho-mo|Thông tin tuyển|dữ kiện tuyển sinh/iu.test(html)) errors.push(`${relative}: giải đáp hiện hành chưa nối về nguồn tuyển sinh`);
  }
}

for (const file of walk(path.join(root, "giai-dap-nghe-mo"))) {
  const relative = rel(file);
  const slug = dailySlug(relative);
  if (!slug || releasedDailySlugs.has(slug)) continue;
  const html = fs.readFileSync(file, "utf8");
  if (meta(html, "content-origin") === "current-explainer" || html.includes('data-content-origin-note="current-explainer"')) {
    errors.push(`${relative}: trang ngoài registry phát hành không được gắn nhãn giải đáp hiện hành`);
  }
}

const core = [
  ["index.html","current-recruitment-policy"],
  ["thong-tin-tuyen-tho-mo/index.html","current-recruitment-policy"],
  ["kiem-tra-dieu-kien/index.html","current-recruitment-policy"],
  ["hoc-nghe-mo-tai-quang-ninh/index.html","current-recruitment-policy"],
  ["ho-so-nhap-hoc/index.html","current-recruitment-policy"],
  ["thu-nhap-an-o-ho-tro/index.html","current-recruitment-policy"],
  ["nghe-mo-ham-lo/index.html","current-recruitment-policy"],
  ["viec-lam-nganh-than/index.html","current-recruitment-policy"],
];
for (const [relative, expected] of core) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) { errors.push(`${relative}: thiếu trang lõi`); continue; }
  const html = fs.readFileSync(file, "utf8");
  if (meta(html, "content-origin") !== expected) errors.push(`${relative}: thiếu content-origin=${expected}`);
  if (!html.includes(`data-content-origin="${expected}"`)) errors.push(`${relative}: thiếu data-content-origin=${expected}`);
  stats.corePolicy += 1;
}

for (const file of walk(path.join(root, "viec-lam-nganh-than"))) {
  const relative = rel(file);
  if (relative === "viec-lam-nganh-than/index.html") continue;
  const html = fs.readFileSync(file, "utf8");
  if (!indexable(html)) continue;
  if (meta(html, "content-origin") !== "current-recruitment-context") errors.push(`${relative}: thiếu content-origin=current-recruitment-context`);
  if (!html.includes('data-content-origin="current-recruitment-context"')) errors.push(`${relative}: thiếu data-content-origin=current-recruitment-context`);
  stats.localContext += 1;
}

for (const file of walk(path.join(root, "viec-lam"))) {
  const html = fs.readFileSync(file, "utf8");
  if (!indexable(html)) continue;
  const relative = rel(file);
  if (meta(html, "content-origin") !== "current-recruitment-policy") errors.push(`${relative}: thiếu content-origin=current-recruitment-policy`);
  if (!html.includes('data-content-origin="current-recruitment-policy"')) errors.push(`${relative}: thiếu data-content-origin=current-recruitment-policy`);
  stats.jobPolicy += 1;
}

const networkPages = [
  "trung-tam-nghe-mo/index.html",
  "thong-tin-tuyen-tho-mo/index.html",
  "viec-lam-nganh-than/index.html",
  "cam-nang-nghe-mo/index.html",
  "chuyen-nguoi-tho/index.html",
  "chia-se-thong-tin/index.html",
  "tac-gia/nguyen-tu-linh/index.html",
  "nguyen-tac-bien-tap/index.html",
];
for (const relative of networkPages) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  if (html.includes("network-nav")) {
    if (!/<a\b[^>]*href=["']\/phong-su\/["'][^>]*>Phóng sự<\/a>/i.test(html)) errors.push(`${relative}: network-nav chưa có Phóng sự`);
    else stats.networkNav += 1;
  }
}

const feed = JSON.parse(fs.readFileSync(path.join(root, "feed.json"), "utf8"));
const sourcedExpected = (feed.items || []).filter((item) => String(item.url || "").includes("/tin-nganh-than/")).length;
const dailyExpected = releasedDailySlugs.size;
const localities = JSON.parse(fs.readFileSync(path.join(root, "localities.json"), "utf8"));

if (stats.firsthand !== 2) errors.push(`Phóng sự nguyên bản: cần 2, nhận ${stats.firsthand}`);
if (stats.sourcedEditorial !== sourcedExpected) errors.push(`Bài nguồn: cần ${sourcedExpected}, nhận ${stats.sourcedEditorial}`);
if (stats.expertExplainer !== 10) errors.push(`Bài chuyên môn: cần 10, nhận ${stats.expertExplainer}`);
if (stats.currentExplainer !== dailyExpected) errors.push(`Giải đáp hiện hành: cần ${dailyExpected}, nhận ${stats.currentExplainer}`);
if (stats.localContext < Number(localities.total || 0)) errors.push(`Mạng địa phương có ${stats.localContext} trang gắn nguồn, thấp hơn ${localities.total || 0} địa bàn`);
if (stats.jobPolicy < 1) errors.push("Không có trang việc làm indexable nào được gắn nguồn chính sách hiện hành");

console.log(JSON.stringify({...stats,sourcedExpected,dailyExpected,localityMinimum:Number(localities.total || 0),releaseDate,errors:errors.length,sampleErrors:errors.slice(0,60)}, null, 2));
if (errors.length) process.exitCode = 1;
