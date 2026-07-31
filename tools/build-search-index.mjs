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

function classify(url, title, keywords) {
  const haystack = `${url} ${title} ${keywords}`.toLocaleLowerCase("vi");
  if (url.includes("/viec-lam-nganh-than/") || /việc làm thợ mỏ (thanh hóa|nghệ an|hà tĩnh|quảng trị|quảng ngãi|gia lai|đắk lắk|sơn la|điện biên|lai châu|lào cai|cao bằng|lạng sơn|bắc kạn|thái nguyên)/i.test(haystack)) {
    return ["province", "Việc làm theo tỉnh"];
  }
  if (url.includes("/tin-nganh-than/2026/")) return ["news", "Tin ngành Than"];
  if (/an toàn|công nghệ|cơ giới|tự động|thông gió|vận tải|bảo hộ|chuyển đổi số/.test(haystack)) return ["technology", "An toàn & công nghệ"];
  if (/phúc lợi|bảo hiểm|ký túc|nhà ở|bữa ăn|dinh dưỡng|xe đưa đón|đời sống/.test(haystack)) return ["welfare", "Đời sống & phúc lợi"];
  if (/lương|thu nhập|công việc|thợ khai thác|thợ xây dựng|cơ điện mỏ làm/.test(haystack)) return ["work", "Công việc & lương"];
  if (/học nghề|đào tạo|thực hành|khóa học|2–3 tháng|10 tháng|chọn nghề/.test(haystack)) return ["training", "Học nghề"];
  if (/điều kiện|hồ sơ|đăng ký|sức khỏe|cận thị|chiều cao|cân nặng|bao nhiêu tuổi|nhập học/.test(haystack)) return ["entry", "Điều kiện & hồ sơ"];
  if (url.includes("/tin-nganh-than/")) return ["news", "Tin ngành Than"];
  return ["guide", "Thông tin nghề mỏ"];
}

const items = walk(root)
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
    const keywords = keywordText.split(",").map((item) => item.trim()).filter(Boolean);
    const [category, categoryLabel] = classify(url, title, keywordText);
    let priority = 10;
    if (url === "/") priority = 100;
    else if (url === "/tin-nganh-than/") priority = 90;
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
  .filter(Boolean)
  .filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index)
  .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title, "vi"));

fs.writeFileSync(path.join(root, "search-index.json"), `${JSON.stringify({ version: 1, items }, null, 2)}\n`);
console.log(`Built search index with ${items.length} pages.`);
