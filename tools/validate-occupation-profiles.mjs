import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const master = JSON.parse(fs.readFileSync(path.resolve("operations/job-posting-master-2026.json"), "utf8"));
const publicData = JSON.parse(fs.readFileSync(path.join(root, "occupations.json"), "utf8"));
const page = fs.readFileSync(path.join(root, "nghe-mo-ham-lo", "index.html"), "utf8");
const jobsCss = fs.readFileSync(path.join(root, "jobs.css"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const llms = fs.readFileSync(path.join(root, "llms.txt"), "utf8");
const errors = [];
const expectedTitles = [
  "Kỹ thuật khai thác mỏ hầm lò",
  "Kỹ thuật xây dựng mỏ hầm lò",
  "Kỹ thuật cơ điện mỏ hầm lò",
];

const source = master.source_documents?.find((item) => item.id === "554-HD-CDTKV");
const profiles = master.occupation_profiles || [];

if (!source) errors.push("Thiếu nguồn Hướng dẫn 554");
if (source?.number !== "554/HD-CĐTKV") errors.push("Sai số văn bản Hướng dẫn 554");
if (profiles.length !== 3) errors.push(`Nguồn dữ liệu nghề phải có 3 nghề, hiện có ${profiles.length}`);
if (profiles.filter((profile) => profile.active_intake).length !== 3) errors.push("Phải công bố đủ ba nghề khai thác, xây dựng và cơ điện mỏ đang tiếp nhận");

for (const title of expectedTitles) {
  const profile = profiles.find((item) => item.title === title);
  if (!profile) {
    errors.push(`Thiếu hồ sơ nghề ${title}`);
    continue;
  }
  for (const field of ["summary", "work_context", "training_duration_current"]) {
    if (!profile[field]) errors.push(`${title}: thiếu ${field}`);
  }
  if (!Array.isArray(profile.responsibilities) || profile.responsibilities.length < 5) errors.push(`${title}: mô tả công việc chưa đủ chi tiết`);
  if (!Array.isArray(profile.equipment) || profile.equipment.length < 3) errors.push(`${title}: danh sách thiết bị chưa đủ`);
  for (const phrase of [title, profile.summary, ...profile.responsibilities, ...profile.equipment, profile.work_context]) {
    if (!page.includes(phrase)) errors.push(`Trang nghề chưa hiển thị: ${phrase.slice(0, 100)}`);
  }
}

if (publicData.source?.id !== source?.id) errors.push("occupations.json chưa đồng bộ nguồn Hướng dẫn 554");
if (JSON.stringify(publicData.profiles) !== JSON.stringify(profiles)) errors.push("occupations.json chưa đồng bộ hồ sơ nghề trung tâm");
if (publicData.current_income !== master.income_commitment) errors.push("occupations.json chưa đồng bộ mức thu nhập 20–25 triệu đồng/tháng");
if (!page.includes('<link rel="canonical" href="https://thaylinhtuyenthomo.vn/nghe-mo-ham-lo/">')) errors.push("Trang nghề thiếu canonical chuẩn");
if (!page.includes("Nghề mỏ hầm lò gồm những nghề gì?")) errors.push("Trang nghề thiếu câu hỏi tìm kiếm chính");
if (!page.includes(master.income_commitment)) errors.push("Trang nghề thiếu mức thu nhập hiện hành");
if (!page.includes('class="worker-question-page occupation-text-only"')) errors.push("Trang tổng hợp nghề chưa bật chế độ chỉ dùng nội dung chữ");
const occupationMain = page.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || "";
if (/<(?:img|picture|figure)\b/i.test(occupationMain)) errors.push("Trang tổng hợp nghề còn ảnh minh họa trong nội dung chính");
if ((page.match(/"@type":"Occupation"/g) || []).length !== 3) errors.push("Trang nghề phải có ba thực thể Occupation trong dữ liệu có cấu trúc");
if (!sitemap.includes("<loc>https://thaylinhtuyenthomo.vn/nghe-mo-ham-lo/</loc>")) errors.push("Trang nghề chưa có trong sitemap");
if (!llms.includes("https://thaylinhtuyenthomo.vn/nghe-mo-ham-lo/")) errors.push("llms.txt chưa định tuyến tới trang nghề");
if (!llms.includes("https://thaylinhtuyenthomo.vn/occupations.json")) errors.push("llms.txt chưa công bố dữ liệu nghề cho hệ thống AI");

for (const profile of profiles.filter((item) => item.active_intake)) {
  const jobPage = fs.readFileSync(path.join(root, "viec-lam", profile.slug, "index.html"), "utf8");
  if (!jobPage.includes('class="occupation-job-page occupation-text-only"')) errors.push(`${profile.title}: chưa bật chế độ chỉ dùng nội dung chữ`);
  const jobMain = jobPage.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || "";
  if (/<(?:img|picture|figure)\b/i.test(jobMain)) errors.push(`${profile.title}: còn ảnh minh họa trong nội dung chính`);
  for (const task of profile.responsibilities) {
    if (!jobPage.includes(task)) errors.push(`${profile.title}: trang tuyển dụng thiếu công việc “${task}”`);
  }
  const jobs = JSON.parse(fs.readFileSync(path.join(root, "jobs.json"), "utf8"));
  const job = jobs.jobs.find((item) => item.id === profile.id);
  if (JSON.stringify(job?.responsibilities) !== JSON.stringify(profile.responsibilities)) errors.push(`${profile.title}: jobs.json chưa đồng bộ mô tả công việc`);
}

if (!jobsCss.includes(".dossier-board ol>li{")) errors.push("CSS mô tả nghề chưa giới hạn kiểu thẻ vào danh sách công việc");
if (!jobsCss.includes(".dossier-board aside li{")) errors.push("CSS mô tả nghề thiếu danh sách thiết bị dạng chữ gọn");
if (jobsCss.includes(".dossier-board li{min-height")) errors.push("CSS mô tả nghề còn áp nhầm thẻ lớn cho danh sách thiết bị");

const allowedTextExtensions = new Set([".html", ".json", ".xml", ".txt", ".js", ".css"]);
function publicTextFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return publicTextFiles(file);
    return allowedTextExtensions.has(path.extname(entry.name)) ? [file] : [];
  });
}

const seoQuestionExceptions = new Map([
  ["giai-dap-nghe-mo/lam-tho-lo-co-nguy-hiem-khong/index.html", new Set(["nguy hiểm"])],
]);

for (const file of publicTextFiles(root)) {
  const content = fs.readFileSync(file, "utf8").toLocaleLowerCase("vi");
  const relative = path.relative(root, file).replaceAll("\\", "/");
  for (const phrase of master.editorial_exclusions || []) {
    if (seoQuestionExceptions.get(relative)?.has(phrase)) continue;
    if (content.includes(phrase.toLocaleLowerCase("vi"))) errors.push(`${relative} còn cụm từ cần loại bỏ: ${phrase}`);
  }
}

console.log(JSON.stringify({ profiles: profiles.length, publicFilesChecked: publicTextFiles(root).length, seoQuestionExceptions: seoQuestionExceptions.size, errors: errors.length, sampleErrors: errors.slice(0, 30) }, null, 2));
if (errors.length) process.exitCode = 1;
