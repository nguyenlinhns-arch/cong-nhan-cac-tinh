import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const master = JSON.parse(fs.readFileSync(path.resolve("operations/job-posting-master-2026.json"), "utf8"));
const feed = JSON.parse(fs.readFileSync(path.join(root, "jobs.json"), "utf8"));
const errors = [];
const roles = [
  ["ky-thuat-khai-thac-mo-ham-lo-quang-ninh", "Kỹ thuật khai thác mỏ hầm lò"],
  ["ky-thuat-xay-dung-mo-ham-lo-quang-ninh", "Kỹ thuật xây dựng mỏ hầm lò"],
];
const dossierDocuments = master.dossier?.admission_documents || [];

if (master.version < 4) errors.push("Recruitment master must use Google Jobs compatible schema v4");
if (dossierDocuments.length !== 3) errors.push(`Recruitment master must define exactly three admission documents, found ${dossierDocuments.length}`);
for (const field of ["address", "admission_address"]) {
  if (!master.contact?.[field]) errors.push(`Recruitment master is missing contact.${field}`);
}
for (const field of ["locality", "region", "postal_code", "country"]) {
  if (!master.job_location?.[field]) errors.push(`Recruitment master is missing job_location.${field}`);
}

const visibleText = html => html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

function jobPostingFrom(html, slug) {
  const postings = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1]);
      const nodes = Array.isArray(parsed["@graph"]) ? parsed["@graph"] : [parsed];
      postings.push(...nodes.filter(node => node?.["@type"] === "JobPosting"));
    } catch (error) {
      errors.push(`${slug}: invalid JSON-LD (${error.message})`);
    }
  }
  if (postings.length !== 1) errors.push(`${slug}: expected exactly one JobPosting, found ${postings.length}`);
  return postings[0];
}

for (const [slug, expectedTitle] of roles) {
  const file = path.join(root, "viec-lam", slug, "index.html");
  const html = fs.readFileSync(file, "utf8");
  const visible = visibleText(html);
  const job = jobPostingFrom(html, slug);
  if (!job) continue;

  for (const property of ["title", "description", "datePosted", "validThrough", "employmentType", "hiringOrganization", "jobLocation"]) {
    if (!job[property]) errors.push(`${slug}: missing required ${property}`);
  }
  if (job.title !== expectedTitle) errors.push(`${slug}: title does not describe the single visible role`);
  if (job.hiringOrganization?.name !== master.hiring_organization) errors.push(`${slug}: wrong hiring organization`);
  if (job.jobLocation?.address?.addressRegion !== master.job_location.region) errors.push(`${slug}: work location must be Quảng Ninh`);
  if (job.jobLocation?.address?.addressLocality !== master.job_location.locality) errors.push(`${slug}: wrong work locality`);
  if (job.jobLocation?.address?.postalCode !== master.job_location.postal_code) errors.push(`${slug}: missing or wrong work postalCode`);
  if (job.jobLocation?.address?.addressCountry !== master.job_location.country) errors.push(`${slug}: wrong work country`);
  if (job.jobLocation?.address?.streetAddress) errors.push(`${slug}: recruitment office address cannot be used as the worksite`);
  if (job.directApply !== true) errors.push(`${slug}: directApply must be true`);
  if (job.experienceRequirements?.["@type"] !== "OccupationalExperienceRequirements" || job.experienceRequirements?.monthsOfExperience !== 0) {
    errors.push(`${slug}: experienceRequirements must declare zero months as a typed object`);
  }
  if (Object.hasOwn(job, "educationRequirements")) errors.push(`${slug}: educationRequirements must be omitted when no formal credential is compulsory`);
  if (job.responsibilities !== (expectedTitle.startsWith("Kỹ thuật khai thác")
    ? "Vận hành theo quy trình khai thác, phối hợp thiết bị và tổ đội trong dây chuyền sản xuất hầm lò sau khi hoàn thành chương trình đào tạo."
    : "Tham gia đào, chống giữ, gia cố và duy trì đường lò phục vụ sản xuất sau khi hoàn thành chương trình đào tạo.")) errors.push(`${slug}: responsibilities are missing or inconsistent`);
  if (job.baseSalary) errors.push(`${slug}: baseSalary is not allowed because the 20–25 million commitment depends on completing the labor norm and is not a fixed base salary`);
  if (new Date(job.validThrough).getTime() <= Date.now()) errors.push(`${slug}: validThrough is not in the future`);
  if (!html.includes("data-application-form") || !html.includes("data-application-submit")) errors.push(`${slug}: direct application form is missing`);

  for (const phrase of [expectedTitle, "18–40", "1m53", "47 kg", "2–3 tháng", "7,5 triệu", master.income_commitment, ...dossierDocuments, master.contact.address, master.contact.admission_address]) {
    if (!visible.includes(phrase)) errors.push(`${slug}: visible page is missing ${phrase}`);
  }
  for (const phrase of ["18–40", "1m53", "47 kg", "2–3 tháng", "7,5 triệu", master.income_commitment, ...dossierDocuments, master.contact.address, master.contact.admission_address]) {
    if (!job.description.toLocaleLowerCase("vi").includes(phrase.toLocaleLowerCase("vi"))) errors.push(`${slug}: JobPosting description is missing ${phrase}`);
  }

  const canonical = `https://thaylinhtuyenthomo.vn/viec-lam/${slug}/`;
  const feedJob = feed.jobs?.find(item => item.url === canonical);
  if (!feedJob || feedJob.title !== expectedTitle || feedJob.status !== "open" || feedJob.application?.direct_apply !== true) {
    errors.push(`${slug}: jobs.json is not synchronized with the page`);
  }
  if (feedJob?.application?.contact_address !== master.contact.address) errors.push(`${slug}: jobs.json has the wrong contact address`);
  if (feedJob?.application?.admission_address !== master.contact.admission_address) errors.push(`${slug}: jobs.json has the wrong admission address`);
  if (JSON.stringify(feedJob?.dossier) !== JSON.stringify(master.dossier)) errors.push(`${slug}: jobs.json dossier is not synchronized with the master`);
  if (feedJob?.location?.postal_code !== master.job_location.postal_code) errors.push(`${slug}: jobs.json is missing the synchronized postal code`);
}

if (feed.version !== "4.0") errors.push(`jobs.json must use schema version 4.0, found ${feed.version}`);

const campaign = fs.readFileSync(path.join(root, "viec-lam", "cong-nhan-mo-ham-lo-quang-ninh", "index.html"), "utf8");
if (/"@type"\s*:\s*"JobPosting"/.test(campaign)) errors.push("Recruitment list page must not contain JobPosting markup");
const campaignVisible = visibleText(campaign);
const campaignNormalized = `${campaign}\n${campaignVisible}`.toLocaleLowerCase("vi");
for (const phrase of [master.income_commitment, ...dossierDocuments, master.dossier.missing_diploma, master.contact.address, master.contact.admission_address]) {
  if (!campaignNormalized.includes(phrase.toLocaleLowerCase("vi"))) errors.push(`Recruitment list page is missing ${phrase}`);
}
for (const forbidden of ["Chỉ cần căn cước công dân gốc", "Hồ sơ dự tuyển gồm 2 bộ", "Thu nhập phổ biến từ 20 đến 25 triệu đồng"]) {
  if (campaign.includes(forbidden)) errors.push(`Recruitment list page contains outdated wording: ${forbidden}`);
}

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
const homeNormalized = home.toLocaleLowerCase("vi");
for (const phrase of [master.income_commitment, ...dossierDocuments, master.dossier.missing_diploma, master.contact.address, master.contact.admission_address]) {
  if (!homeNormalized.includes(phrase.toLocaleLowerCase("vi"))) errors.push(`Homepage is missing synchronized recruitment phrase: ${phrase}`);
}
for (const forbidden of ["Hồ sơ dự tuyển gồm 2 bộ", "Thu nhập phổ biến từ 20 đến 25 triệu đồng", "Thu nhập thực tế phụ thuộc"]) {
  if (home.includes(forbidden)) errors.push(`Homepage contains outdated wording: ${forbidden}`);
}

console.log(JSON.stringify({ jobPages: roles.length, errors: errors.length, sampleErrors: errors.slice(0, 20) }, null, 2));
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
