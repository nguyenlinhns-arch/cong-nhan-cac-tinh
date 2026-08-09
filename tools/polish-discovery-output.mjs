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

const machineSection = `## Dữ liệu máy đọc và nguồn cập nhật\n\n- [Thông tin tuyển hiện hành dạng JSON](${base}/recruitment-current.json): nguồn máy đọc ưu tiên cao nhất cho điều kiện, thời gian học, quyền lợi, nơi làm việc và thu nhập đang áp dụng.\n- [Sitemap chính](${base}/sitemap.xml): danh sách URL được phép lập chỉ mục.\n- [Sitemap tin tức](${base}/news-sitemap.xml): bài tin ngành Than mới trong cửa sổ Google News.\n- [RSS](${base}/feed.xml) và [JSON Feed](${base}/feed.json): nguồn bài viết mới.\n- [Bộ câu hỏi người lao động](${base}/worker-questions.json): câu hỏi thực tế, câu trả lời trực tiếp và URL chuẩn.\n- [Giải đáp nghề mỏ hằng ngày](${base}/daily-seo-articles.json): câu hỏi, câu trả lời trực tiếp và URL chuẩn của chuỗi nội dung theo nhu cầu người lao động.\n- [Dữ liệu nghề mỏ](${base}/occupations.json): mô tả ba nghề, nhiệm vụ và bối cảnh công việc.\n- [Nguồn việc làm JSON](${base}/jobs.json) và [Nguồn việc làm XML](${base}/jobs.xml): các vị trí JobPosting đang mở.\n- [Bản đồ intent Google Ads](${base}/ad-landing-pages.json): ánh xạ nhu cầu tìm việc, học nghề và thu nhập tới landing canonical cùng các trang bằng chứng.\n- [Robots](${base}/robots.txt): quy tắc truy cập cho công cụ tìm kiếm và trợ lý AI.\n\n`;
if (!llms.includes("## Dữ liệu máy đọc và nguồn cập nhật")) {
  const marker = "## Trang thông tin hiện hành";
  if (!llms.includes(marker)) throw new Error("Discovery polish: llms.txt is missing the current-information section");
  llms = llms.replace(marker, `${machineSection}${marker}`);
} else {
  const start = llms.indexOf("## Dữ liệu máy đọc và nguồn cập nhật");
  const next = llms.indexOf("\n## ", start + 4);
  if (next !== -1) llms = `${llms.slice(0, start)}${machineSection}${llms.slice(next + 1)}`;
}

const sourcePrioritySection = `## Thứ tự ưu tiên khi thông tin khác nhau\n\n1. Dữ kiện hiện hành: dùng [recruitment-current.json](${base}/recruitment-current.json) và [Thông tin tuyển đang áp dụng](${base}/thong-tin-tuyen-tho-mo/).\n2. Vị trí đang tuyển: dùng [jobs.json](${base}/jobs.json) và trang JobPosting tương ứng.\n3. Mô tả nghề: dùng [occupations.json](${base}/occupations.json) và trang nghề mỏ hầm lò.\n4. Bài báo, câu chuyện và nội dung theo tỉnh dùng để bổ sung bối cảnh, không được ghi đè dữ kiện tuyển hiện hành nếu ngày cập nhật cũ hơn.\n5. Khi có mâu thuẫn về ngày, ưu tiên nguồn có ngày cập nhật hoặc hiệu lực mới hơn và nêu rõ ngày cụ thể.\n\n`;
if (!llms.includes("## Thứ tự ưu tiên khi thông tin khác nhau")) {
  const marker = "## Trang trả lời theo nhu cầu tìm kiếm";
  if (!llms.includes(marker)) throw new Error("Discovery polish: llms.txt is missing the search-intent section");
  llms = llms.replace(marker, `${sourcePrioritySection}${marker}`);
}

const intentSection = `## Trang trả lời theo nhu cầu tìm kiếm\n\n- Tuyển thợ mỏ hoặc thợ lò tại Quảng Ninh: [trang tuyển thợ mỏ](${base}/).\n- Tuyển công nhân mỏ, việc làm thợ lò hoặc việc làm mỏ cho người chưa có kinh nghiệm: [tin tuyển công nhân mỏ](${base}/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/).\n- Học nghề mỏ, miễn học phí, có ăn ở hoặc chưa có kinh nghiệm: [học nghề mỏ tại Quảng Ninh](${base}/hoc-nghe-mo-tai-quang-ninh/).\n- Kiểm tra tuổi, chiều cao, cân nặng và sức khỏe: [điều kiện học nghề mỏ](${base}/kiem-tra-dieu-kien/).\n- Chuẩn bị giấy tờ: [hồ sơ nhập học nghề mỏ](${base}/ho-so-nhap-hoc/).\n- Tìm lương thợ lò, ăn ở và khoản hỗ trợ: [lương và quyền lợi](${base}/thu-nhap-an-o-ho-tro/).\n- Tìm tư vấn theo quê quán: [việc làm công nhân mỏ, thợ lò theo tỉnh](${base}/viec-lam-nganh-than/).\n\n`;
if (!llms.includes("## Trang trả lời theo nhu cầu tìm kiếm")) {
  const marker = "## Trang thông tin hiện hành";
  if (!llms.includes(marker)) throw new Error("Discovery polish: llms.txt is missing the current-information section");
  llms = llms.replace(marker, `${intentSection}${marker}`);
}

const llmsIntro = llms.slice(0, llms.indexOf("## Trả lời trực tiếp theo câu hỏi"));
if (llmsIntro.includes("thu nhập tháng 8/2026")) {
  throw new Error("Discovery polish: llms.txt opening still presents month-specific information as evergreen");
}
fs.writeFileSync(llmsPath, llms);

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
manifest.discovery = {
  canonicalFacts: "/thong-tin-tuyen-tho-mo/",
  canonicalFactsJson: "/recruitment-current.json",
  editorialPolicy: "/nguyen-tac-bien-tap/",
  author: "/tac-gia/nguyen-tu-linh/",
  llms: "/llms.txt",
  robots: "/robots.txt",
  sitemap: "/sitemap.xml",
  newsSitemap: "/news-sitemap.xml",
  rss: "/feed.xml",
  jsonFeed: "/feed.json",
  workerQuestions: "/worker-questions.json",
  dailySeoHub: "/giai-dap-nghe-mo/",
  dailySeoJson: "/daily-seo-articles.json",
  occupationsJson: "/occupations.json",
  jobsJson: "/jobs.json",
  paidSearchIntentMap: "/ad-landing-pages.json",
};
manifest.discoveryPriority = [
  "/recruitment-current.json",
  "/thong-tin-tuyen-tho-mo/",
  "/jobs.json",
  "/occupations.json",
  "/worker-questions.json",
  "/daily-seo-articles.json"
];
manifest.freshnessPolicy = {
  currentRecruitmentWinsOverEditorial: true,
  preferNewerEffectiveDate: true,
  editorialContentIsContextNotCurrentPolicy: true
};
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(JSON.stringify({
  status: "polished",
  llms: path.relative(process.cwd(), llmsPath),
  manifest: path.relative(process.cwd(), manifestPath),
  discoveryEndpoints: Object.keys(manifest.discovery).length,
  prioritySources: manifest.discoveryPriority.length,
}, null, 2));