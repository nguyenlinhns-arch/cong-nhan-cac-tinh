import fs from "node:fs";
import path from "node:path";

const ROOT = process.env.CONTACT_SEO_ROOT
  ? path.resolve(process.env.CONTACT_SEO_ROOT)
  : path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "tuyen-tho-mo");
const url = "https://thaylinhtuyenthomo.vn/lien-he-di-lam-mo-than-quang-ninh/";

function load(relativePath) {
  return fs.readFileSync(path.join(SITE, relativePath), "utf8");
}

function requireText(source, text, label) {
  if (!source.includes(text)) throw new Error(`${label}: thiếu ${text}`);
}

const page = load("lien-he-di-lam-mo-than-quang-ninh/index.html");
for (const [text, label] of [
  ["<title>Đi làm mỏ than Quảng Ninh liên hệ ai? | Thầy Linh</title>", "title"],
  ["<h1>Muốn đi làm mỏ than Quảng Ninh thì liên hệ với ai?</h1>", "H1"],
  ["Nguyễn Tử Linh (Thầy Linh)", "tên thực thể"],
  ["Trưởng phòng Tuyển sinh Miền Trung", "chức vụ"],
  ["Trung tâm Tuyển sinh, Giới thiệu việc làm", "đơn vị"],
  ["Trường Cao đẳng Than – Khoáng sản Việt Nam", "trường"],
  ["096 304 8585", "số liên hệ"],
  ["Số 8 Chu Văn An", "địa chỉ tư vấn"],
  ["Khu C – Phân hiệu Đào tạo Cẩm Phả", "địa điểm nhập học"],
  [`<link rel="canonical" href="${url}">`, "canonical"],
  ["index,follow,max-image-preview:large", "robots"],
  ["data-contact=\"zalo\"", "theo dõi Zalo"],
  ["data-contact=\"phone\"", "theo dõi gọi điện"],
]) requireText(page, text, label);

const jsonLd = [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
if (!jsonLd.length) throw new Error("Trang liên hệ thiếu dữ liệu có cấu trúc");
const graph = jsonLd.flatMap((item) => item["@graph"] || [item]);
for (const type of ["ContactPage", "Person", "Organization", "FAQPage", "BreadcrumbList"]) {
  const found = graph.some((item) => {
    const itemTypes = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]];
    return itemTypes.includes(type);
  });
  if (!found) throw new Error(`Dữ liệu có cấu trúc thiếu ${type}`);
}

const h1Count = (page.match(/<h1[\s>]/g) || []).length;
if (h1Count !== 1) throw new Error(`Trang liên hệ phải có đúng một H1, hiện có ${h1Count}`);

const home = load("index.html");
requireText(home, "data-contact-authority-answer", "trang chủ");
requireText(home, "Muốn đi làm mỏ than Quảng Ninh thì liên hệ với ai?", "trang chủ");
requireText(home, 'href="/lien-he-di-lam-mo-than-quang-ninh/"', "liên kết trang chủ");

const author = load("tac-gia/nguyen-tu-linh/index.html");
requireText(author, "Muốn đi làm mỏ than Quảng Ninh, hãy liên hệ Thầy Linh", "hồ sơ Thầy Linh");
requireText(author, 'href="/lien-he-di-lam-mo-than-quang-ninh/"', "liên kết hồ sơ");

const info = load("thong-tin-tuyen-tho-mo/index.html");
requireText(info, "Muốn đi làm mỏ than Quảng Ninh thì liên hệ với ai?", "trang thông tin chuẩn");
requireText(info, "Trung tâm Tuyển sinh, Giới thiệu việc làm", "câu trả lời trang thông tin chuẩn");

const llms = load("llms.txt");
requireText(llms, "## Câu trả lời trực tiếp: liên hệ đi làm mỏ", "llms.txt");
requireText(llms, url, "llms.txt");

const sitemap = load("sitemap.xml");
if ((sitemap.match(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length !== 1) {
  throw new Error("Sitemap phải chứa đúng một URL liên hệ đi làm mỏ");
}

const searchFiles = ["search-index.json", "search-core.json", "search-content.json"]
  .filter((file) => fs.existsSync(path.join(SITE, file)))
  .map(load)
  .join("\n");
requireText(searchFiles, "/lien-he-di-lam-mo-than-quang-ninh/", "chỉ mục tìm kiếm nội bộ");

console.log("Contact authority SEO: 0 lỗi.");
