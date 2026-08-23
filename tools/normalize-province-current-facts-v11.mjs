import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const provinceRoot = path.join(site, "viec-lam-nganh-than");
const facts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const review = JSON.parse(fs.readFileSync(path.join(root, "content", "recruitment-review-v10.json"), "utf8"));
const income = facts.after_training.income_commitment;
const support = facts.study_benefits.living_support;
const reviewDate = review.reviewed_at;
const modifiedDate = review.verification_content_modified || reviewDate;
const errors = [];
const changed = [];

if (income !== "20–25 triệu đồng/tháng khi hoàn thành định mức lao động") throw new Error(`Province facts: income canonical sai: ${income}`);
if (support !== "7,5 triệu đồng/tháng trong thời gian học") throw new Error(`Province facts: support canonical sai: ${support}`);

function provinceFiles() {
  if (!fs.existsSync(provinceRoot)) throw new Error("Province facts: thiếu thư mục viec-lam-nganh-than");
  return fs.readdirSync(provinceRoot, {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(provinceRoot, entry.name, "index.html"))
    .filter((file) => fs.existsSync(file));
}

function normalize(html) {
  let next = html
    .replace(/được Thu nhập 20[–-]25 triệu đồng\/tháng khi hoàn thành định mức lao động/giu, `có mức thu nhập ${income}`)
    .replace(/<strong>Cam kết thu nhập<\/strong><p>20[–-]25 triệu đồng\/tháng\.<\/p>/giu,
      `<strong>Thu nhập sau đào tạo</strong><p>${income}.</p>`)
    .replace(/<h3>Rèn tay nghề trong 2[–-]3 tháng<\/h3><p>Học kiến thức, an toàn và kỹ năng thực hành của nghề khai thác mỏ hoặc xây dựng mỏ hầm lò\.<\/p>/giu,
      `<h3>Học 2–3 hoặc 10 tháng theo nghề</h3><p>Khai thác và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng, cùng nội dung an toàn và thực hành theo nghề.</p>`)
    .replace(/<summary>Thời gian học bao lâu\?<\/summary><p>Nghề khai thác mỏ và xây dựng mỏ học 2[–-]3 tháng\. Lịch cụ thể phụ thuộc từng đợt tiếp nhận\.<\/p>/giu,
      `<summary>Thời gian học bao lâu?</summary><p>Khai thác và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng. Lịch cụ thể phụ thuộc từng đợt tiếp nhận.</p>`)
    .replace(/<p>Đào tạo nghề cơ điện mỏ theo kế hoạch tuyển sinh\.<\/p>/giu,
      `<p>Đào tạo 10 tháng theo kế hoạch tuyển sinh.</p>`)
    .replace(/<h3>Kỹ thuật cơ điện mỏ hầm lò<\/h3><p>Đào tạo nghề cơ điện mỏ theo kế hoạch tuyển sinh\.<\/p>/giu,
      `<h3>Kỹ thuật cơ điện mỏ hầm lò</h3><p>Cơ điện mỏ học 10 tháng theo kế hoạch tuyển sinh.</p>`)
    .replace(/<h3>Kỹ thuật cơ điện mỏ hầm lò<\/h3><p>Đào tạo 10 tháng theo kế hoạch tuyển sinh\.<\/p>/giu,
      `<h3>Kỹ thuật cơ điện mỏ hầm lò</h3><p>Cơ điện mỏ học 10 tháng theo kế hoạch tuyển sinh.</p>`)
    .replace(/<strong>Hỗ trợ học nghề<\/strong><p>Miễn học phí, bố trí ăn ở và hỗ trợ trong thời gian học\.<\/p>/giu,
      `<strong>Hỗ trợ học nghề</strong><p>Miễn học phí, bố trí ăn ở và hỗ trợ ${support}.</p>`)
    .replace(/Xem thông tin tháng \d{1,2}\/\d{4} →/giu, "Xem thông tin đang áp dụng →")
    .replace(/học nghề trong 2[–-]3 tháng và chuẩn bị cho công việc tại Quảng Ninh/giu,
      "học nghề 2–3 hoặc 10 tháng theo nghề và chuẩn bị cho công việc tại Quảng Ninh")
    .replace(/7[,.]5 triệu(?!\s*(?:đồng\s*)?\/\s*tháng)(?:\s*đồng)?/giu, "7,5 triệu đồng/tháng");

  if (/"lastReviewed"\s*:\s*"\d{4}-\d{2}-\d{2}"/.test(next)) {
    next = next.replace(/"lastReviewed"\s*:\s*"\d{4}-\d{2}-\d{2}"/g, `"lastReviewed":"${reviewDate}"`);
  } else if (/"dateModified"\s*:\s*"\d{4}-\d{2}-\d{2}"/.test(next)) {
    next = next.replace(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"/, `"dateModified":"$1","lastReviewed":"${reviewDate}"`);
  }
  next = next.replace(/"dateModified"\s*:\s*"\d{4}-\d{2}-\d{2}"/, `"dateModified":"${modifiedDate}"`);
  return next;
}

const files = provinceFiles();
for (const file of files) {
  const relative = path.relative(site, file).split(path.sep).join("/");
  const before = fs.readFileSync(file, "utf8");
  const after = normalize(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed.push(relative);
  }

  const html = after;
  if (/Cam kết thu nhập<\/strong><p>20[–-]25 triệu đồng\/tháng\./iu.test(html)) errors.push(`${relative}: card thu nhập thiếu điều kiện định mức`);
  if (/Thời gian học bao lâu\?<\/summary><p>Nghề khai thác mỏ và xây dựng mỏ học 2[–-]3 tháng\. Lịch cụ thể/iu.test(html)) errors.push(`${relative}: FAQ thời gian học còn thiếu cơ điện 10 tháng`);
  if (/7[,.]5\s*triệu/iu.test(html) && !/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(html)) errors.push(`${relative}: hỗ trợ 7,5 triệu thiếu /tháng`);
  for (const match of html.matchAll(/20\s*[–-]\s*25\s*triệu/giu)) {
    const index = match.index || 0;
    const window = html.slice(Math.max(0, index - 220), Math.min(html.length, index + 340));
    if (!/hoàn thành định mức lao động/iu.test(window)) {
      errors.push(`${relative}: mức 20–25 triệu thiếu điều kiện định mức gần vị trí ${index}`);
      break;
    }
  }
  const hasElectricalDuration = /cơ điện mỏ[^<\n]{0,100}(?:học|đào tạo)[^<\n]{0,40}10 tháng/iu.test(html)
    || /Kỹ thuật cơ điện mỏ hầm lò[\s\S]{0,180}10 tháng/iu.test(html);
  if (!hasElectricalDuration) errors.push(`${relative}: chưa nêu cơ điện mỏ học/đào tạo 10 tháng`);
}

if (files.length !== 34) errors.push(`Province facts: dự kiến 34 landing tỉnh/thành, thực tế ${files.length}`);

if (errors.length) {
  console.error(JSON.stringify({status:"province-current-facts-v11-invalid", canonicalFactsVersion:facts.version, pages:files.length, changed:changed.length, errors}, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({status:"province-current-facts-v11-ready", canonicalFactsVersion:facts.version, pages:files.length, changed:changed.length, support, income}, null, 2));
}
