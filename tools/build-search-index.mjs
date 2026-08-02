import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";

function walk(dir, output = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (entry.name === "index.html") output.push(full);
  }
  return output;
}

function decode(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function strip(value = "") {
  return decode(value.replace(/<[^>]*>/g, " "));
}

function match(html, pattern) {
  return decode(html.match(pattern)?.[1] || "");
}

function removeInterfaceHeadings(html) {
  return html
    .replace(/<section\b[^>]*class=["'][^"']*\barticle-(?:apply|share-panel)\b[^"']*["'][^>]*>[\s\S]*?<\/section>/gi, " ")
    .replace(/<aside\b[^>]*class=["'][^"']*\barticle-aside\b[^"']*["'][^>]*>[\s\S]*?<\/aside>/gi, " ");
}

function classify(url, title, keywords) {
  const haystack = `${url} ${title} ${keywords}`.toLocaleLowerCase("vi");
  if (url === "/") return ["recruitment", "Thông tin tuyển tháng 8/2026"];
  if (url === "/thong-tin-tuyen-tho-mo/") return ["recruitment", "Thông tin đang áp dụng"];
  if (url === "/trung-tam-nghe-mo/") return ["guide", "Trung tâm nghề mỏ"];
  if (url === "/viec-lam-nganh-than/") return ["recruitment", "Việc làm theo tỉnh"];
  if (url === "/cam-nang-nghe-mo/") return ["guide", "Cẩm nang nghề mỏ"];
  if (url === "/chuyen-nguoi-tho/") return ["news", "Chuyện người thợ"];
  if (url === "/chia-se-thong-tin/") return ["guide", "Công cụ chia sẻ"];
  if (url.startsWith("/tac-gia/")) return ["guide", "Người biên soạn"];
  if (url === "/nguyen-tac-bien-tap/") return ["guide", "Nguồn và kiểm chứng"];
  if (url.includes("/viec-lam/")) return ["recruitment", "Tin tuyển dụng"];
  if (url.includes("/viec-lam-nganh-than/") || /việc làm thợ mỏ (thanh hóa|nghệ an|hà tĩnh|quảng trị|quảng ngãi|gia lai|đắk lắk|sơn la|điện biên|lai châu|lào cai|cao bằng|lạng sơn|bắc kạn|thái nguyên)/i.test(haystack)) {
    return ["province", "Việc làm theo tỉnh"];
  }
  if (url.includes("/tin-nganh-than/2026/")) return ["news", "Tin ngành Than"];
  if (/an toàn|công nghệ|cơ giới|tự động|thông gió|vận tải|bảo hộ|chuyển đổi số/.test(haystack)) return ["technology", "An toàn & công nghệ"];
  if (/phúc lợi|bảo hiểm|ký túc|nhà ở|bữa ăn|dinh dưỡng|xe đưa đón|đời sống/.test(haystack)) return ["welfare", "Đời sống & phúc lợi"];
  if (/lương|thu nhập|công việc|thợ khai thác|thợ xây dựng|cơ điện mỏ làm/.test(haystack)) return ["work", "Công việc & lương"];
  if (/học nghề|đào tạo|thực hành|khóa học|2–3 tháng|chọn nghề/.test(haystack)) return ["training", "Học nghề"];
  if (/điều kiện|hồ sơ|đăng ký|sức khỏe|cận thị|chiều cao|cân nặng|bao nhiêu tuổi|nhập học/.test(haystack)) return ["entry", "Điều kiện & hồ sơ"];
  if (url.includes("/tin-nganh-than/")) return ["news", "Tin ngành Than"];
  return ["guide", "Thông tin nghề mỏ"];
}

const directAnswers = [
  {
    url: "/#dieu-kien",
    title: "Điều kiện đăng ký học nghề mỏ là gì?",
    description: "Nam 18–40 tuổi, cao từ 1m53, nặng từ 47kg, sức khỏe tốt; không cận thị, bệnh tim mạch, huyết áp hoặc bệnh về mắt.",
    keywords: ["điều kiện", "bao nhiêu tuổi", "chiều cao", "cân nặng", "sức khỏe", "cận thị"],
    category: "entry",
    categoryLabel: "Điều kiện & hồ sơ",
  },
  {
    url: "/#quyen-loi",
    title: "Thu nhập và quyền lợi của thợ mỏ",
    description: "Cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động; người lao động được đào tạo nghề trước khi bố trí việc làm.",
    keywords: ["thu nhập", "lương", "quyền lợi", "20 25 triệu", "định mức lao động"],
    category: "work",
    categoryLabel: "Công việc & lương",
  },
  {
    url: "/#thoi-gian-hoc",
    title: "Thời gian học nghề mỏ là bao lâu?",
    description: "Nghề khai thác mỏ và xây dựng mỏ được đào tạo khoảng 2–3 tháng; người chưa có kinh nghiệm được học từ nền tảng.",
    keywords: ["thời gian học", "học bao lâu", "2 3 tháng", "đào tạo nghề mỏ"],
    category: "training",
    categoryLabel: "Học nghề",
  },
  {
    url: "/#ho-tro-hoc-nghe",
    title: "Trong thời gian học được hỗ trợ gì?",
    description: "Miễn kinh phí đào tạo, ăn 3 bữa/ngày, ở ký túc xá và hỗ trợ 7,5 triệu đồng trong thời gian học.",
    keywords: ["hỗ trợ", "miễn học phí", "ăn ở", "ký túc xá", "7,5 triệu", "7.5 triệu"],
    category: "welfare",
    categoryLabel: "Đời sống & phúc lợi",
  },
  {
    url: "/#ho-so",
    title: "Hồ sơ nhập học cần những gì?",
    description: "Khi nhập học mang căn cước công dân bản gốc, giấy khai sinh và bằng THCS hoặc THPT nếu có; chưa có bằng vẫn đăng ký được.",
    keywords: ["hồ sơ", "giấy tờ", "căn cước", "CCCD", "giấy khai sinh", "bằng cấp"],
    category: "entry",
    categoryLabel: "Điều kiện & hồ sơ",
  },
  {
    url: "/#dia-diem",
    title: "Địa chỉ nhập học nghề mỏ ở đâu?",
    description: "Khu C – Phân hiệu Đào tạo Cẩm Phả, phường Quang Hanh, tỉnh Quảng Ninh; chỉ đến sau khi được xác nhận lịch tiếp nhận.",
    keywords: ["địa chỉ nhập học", "nơi học", "Quang Hanh", "Khu C", "Phân hiệu Đào tạo Cẩm Phả"],
    category: "entry",
    categoryLabel: "Điều kiện & hồ sơ",
  },
  {
    url: "/#quy-trinh",
    title: "Quy trình đăng ký học nghề mỏ",
    description: "Gửi thông tin, kiểm tra sơ bộ, nhận tư vấn, chuẩn bị hồ sơ sau khi có lịch và đến nhập học tại Quang Hanh.",
    keywords: ["quy trình", "đăng ký thế nào", "các bước", "lịch nhập học"],
    category: "entry",
    categoryLabel: "Điều kiện & hồ sơ",
  },
  {
    url: "/#dang-ky",
    title: "Đăng ký học nghề mỏ ngay",
    description: "Đăng ký ban đầu chưa cần nộp hồ sơ; gửi năm sinh, chiều cao, cân nặng, sức khỏe và tỉnh đang sinh sống để kiểm tra trước.",
    keywords: ["đăng ký", "ứng tuyển", "nộp hồ sơ", "gửi thông tin", "nhắn Zalo"],
    category: "recruitment",
    categoryLabel: "Thông tin đang áp dụng",
  },
].map((item) => ({...item, type: "Trả lời nhanh", priority: 200}));

const pageItems = walk(root)
  .map((file) => {
    const html = fs.readFileSync(file, "utf8");
    if (/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) return null;
    const title = match(html, /<title>([\s\S]*?)<\/title>/i).replace(/\s*[|–-]\s*Thầy Linh.*$/i, "");
    const description = match(html, /<meta\s+name="description"\s+content="([^"]*)"/i)
      || strip(html.match(/<p\b[^>]*class="(?:lead|hero-lead|local-hero__lead)"[^>]*>([\s\S]*?)<\/p>/i)?.[1]);
    const canonical = match(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
    const relative = path.relative(root, file).replaceAll(path.sep, "/").replace(/index\.html$/, "");
    const url = canonical.startsWith(base) ? canonical.slice(base.length) || "/" : `/${relative}`;
    const keywordText = match(html, /<meta\s+name="keywords"\s+content="([^"]+)"/i);
    const searchableHtml = removeInterfaceHeadings(html);
    const headingKeywords = [...searchableHtml.matchAll(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
      .map((heading) => strip(heading[1]))
      .filter(Boolean);
    const keywords = [...new Set([
      ...keywordText.split(",").map((item) => item.trim()).filter(Boolean),
      ...headingKeywords,
    ])].slice(0, 60);
    const [category, categoryLabel] = classify(url, title, `${keywordText} ${headingKeywords.join(" ")}`);
    let priority = 10;
    if (url === "/") priority = 100;
    else if (url === "/thong-tin-tuyen-tho-mo/") priority = 99;
    else if (url === "/trung-tam-nghe-mo/") priority = 99;
    else if (url.includes("/viec-lam/")) priority = 95;
    else if (url === "/viec-lam-nganh-than/") priority = 92;
    else if (url === "/tin-nganh-than/") priority = 90;
    else if (url === "/cam-nang-nghe-mo/") priority = 88;
    else if (url === "/chuyen-nguoi-tho/") priority = 86;
    else if (url === "/chia-se-thong-tin/") priority = 70;
    else if (url === "/nguyen-tac-bien-tap/") priority = 65;
    else if (url.startsWith("/tac-gia/")) priority = 35;
    else if (url.includes("/bai-viet/")) priority = 50;
    else if (url.includes("/viec-lam-nganh-than/")) priority = 45;
    else if (url.includes("/tin-nganh-than/2026/")) priority = 60;
    return {
      url,
      title: title || "Thầy Linh – Tuyển Thợ Mỏ",
      description: description || "Thông tin học nghề mỏ và việc làm ngành Than tại Quảng Ninh.",
      keywords,
      category,
      categoryLabel,
      type: categoryLabel,
      priority,
    };
  })
  .filter(Boolean);

const items = [...directAnswers, ...pageItems]
  .filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index)
  .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title, "vi"));

fs.writeFileSync(path.join(root, "search-index.json"), `${JSON.stringify({ version: 2, items }, null, 2)}\n`);
console.log(`Built search index with ${items.length} pages.`);
