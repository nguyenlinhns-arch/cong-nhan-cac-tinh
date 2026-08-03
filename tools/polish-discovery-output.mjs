import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const llmsPath = path.join(root, "llms.txt");
const manifestPath = path.join(root, "search-index.json");

if (!fs.existsSync(llmsPath)) throw new Error("Discovery polish: missing llms.txt");
if (!fs.existsSync(manifestPath)) throw new Error("Discovery polish: missing search-index.json");

let llms = fs.readFileSync(llmsPath, "utf8");
llms = llms
  .replace(
    "[Thông tin tuyển đang áp dụng](https://thaylinhtuyenthomo.vn/thong-tin-tuyen-tho-mo/): điều kiện, học nghề, hồ sơ, địa chỉ và thu nhập tháng 8/2026.",
    "[Thông tin tuyển đang áp dụng](https://thaylinhtuyenthomo.vn/thong-tin-tuyen-tho-mo/): điều kiện, học nghề, hồ sơ, địa chỉ và thu nhập hiện hành; ngày cập nhật được công bố ngay trong trang.",
  )
  .replace(
    "[Tuyển thợ mỏ tháng 8/2026: 15 câu hỏi](https://thaylinhtuyenthomo.vn/thong-tin-tuyen-tho-mo/): trang chuẩn để đối chiếu điều kiện, thời gian học, chế độ, hồ sơ, địa chỉ và thu nhập đang áp dụng.",
    "[Thông tin tuyển thợ mỏ đang áp dụng: 15 câu hỏi](https://thaylinhtuyenthomo.vn/thong-tin-tuyen-tho-mo/): trang chuẩn để đối chiếu điều kiện, thời gian học, chế độ, hồ sơ, địa chỉ và thu nhập; dữ kiện có ngày hiệu lực và dấu vết kiểm chứng.",
  );

const machineSection = `## Dữ liệu máy đọc và nguồn cập nhật\n\n- [Sitemap chính](${base}/sitemap.xml): danh sách URL được phép lập chỉ mục.\n- [Sitemap tin tức](${base}/news-sitemap.xml): bài tin ngành Than mới trong cửa sổ Google News.\n- [RSS](${base}/feed.xml) và [JSON Feed](${base}/feed.json): nguồn bài viết mới.\n- [Nguồn việc làm JSON](${base}/jobs.json) và [Nguồn việc làm XML](${base}/jobs.xml): các vị trí JobPosting đang mở.\n- [Robots](${base}/robots.txt): quy tắc truy cập cho công cụ tìm kiếm và trợ lý AI.\n\n`;
if (!llms.includes("## Dữ liệu máy đọc và nguồn cập nhật")) {
  const marker = "## Trang thông tin hiện hành";
  if (!llms.includes(marker)) throw new Error("Discovery polish: llms.txt is missing the current-information section");
  llms = llms.replace(marker, `${machineSection}${marker}`);
}

const llmsIntro = llms.slice(0, llms.indexOf("## Trả lời trực tiếp theo câu hỏi"));
if (llmsIntro.includes("thu nhập tháng 8/2026")) {
  throw new Error("Discovery polish: llms.txt opening still presents month-specific information as evergreen");
}
fs.writeFileSync(llmsPath, llms);

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
manifest.discovery = {
  canonicalFacts: "/thong-tin-tuyen-tho-mo/",
  editorialPolicy: "/nguyen-tac-bien-tap/",
  author: "/tac-gia/nguyen-tu-linh/",
  llms: "/llms.txt",
  robots: "/robots.txt",
  sitemap: "/sitemap.xml",
  newsSitemap: "/news-sitemap.xml",
  rss: "/feed.xml",
  jsonFeed: "/feed.json",
  jobsJson: "/jobs.json",
};
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(JSON.stringify({
  status: "polished",
  llms: path.relative(process.cwd(), llmsPath),
  manifest: path.relative(process.cwd(), manifestPath),
  discoveryEndpoints: Object.keys(manifest.discovery).length,
}, null, 2));
