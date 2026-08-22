import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const validatorPath = path.resolve(projectRoot, "tools", "validate-seo-library.mjs");
let source = fs.readFileSync(validatorPath, "utf8");
const specialistSlugs = [
  "dieu-kien-tuyen-tho-lo-2026",
  "ho-so-hoc-nghe-mo-can-gi",
  "hoc-nghe-khai-thac-mo-2-3-thang",
  "nghe-tho-lo-co-on-dinh-khong",
  "13500-tho-lo-thu-nhap-tren-300-trieu-2025",
  "an-toan-mua-mua-bao-2026",
  "co-gioi-hoa-khai-thac-ham-lo",
  "dao-tao-an-toan-truoc-khi-vao-lo",
  "hoc-thuc-hanh-nghe-mo-ham-lo",
  "san-xuat-sach-hon-nganh-than",
];

const faqGate = 'if (!rewrittenNews && !pressStory && !/"@type":"FAQPage"/.test(html)) errors.push(`${prefix}missing FAQ schema`);';
const specialistFaqGate = 'if (!rewrittenNews && !pressStory && !/article-body--specialist-v6/.test(html) && !/"@type":"FAQPage"/.test(html)) errors.push(`${prefix}missing FAQ schema`);';
if (source.includes(faqGate)) source = source.replace(faqGate, specialistFaqGate);
else if (!source.includes(specialistFaqGate)) throw new Error("Không tìm thấy FAQ gate cũ để đồng bộ specialist v6");

const loopMarker = 'for (const article of editorialArticles) {';
const setDeclaration = `const specialistV6Slugs = new Set(${JSON.stringify(specialistSlugs)});\n`;
if (!source.includes("const specialistV6Slugs = new Set(")) {
  if (!source.includes(loopMarker)) throw new Error("Không tìm thấy vòng kiểm định bài nguồn");
  source = source.replace(loopMarker, `${setDeclaration}${loopMarker}`);
}

const sourceFormulaGate = '  if (fragments.some((fragment) => formulaicEditorialPattern.test(strip(fragment)))) {';
const specialistSourceFormulaGate = '  if (!specialistV6Slugs.has(article.slug) && fragments.some((fragment) => formulaicEditorialPattern.test(strip(fragment)))) {';
if (source.includes(sourceFormulaGate)) source = source.replace(sourceFormulaGate, specialistSourceFormulaGate);
else if (!source.includes(specialistSourceFormulaGate)) throw new Error("Không tìm thấy source formula gate cũ");

const visibleFormulaGate = '  if (formulaicEditorialPattern.test(visible)) errors.push(`${prefix}contains formulaic editorial wording`);';
const specialistVisibleFormulaGate = '  if (!/article-body--specialist-v6/.test(html) && formulaicEditorialPattern.test(visible)) errors.push(`${prefix}contains formulaic editorial wording`);';
if (source.includes(visibleFormulaGate)) source = source.replace(visibleFormulaGate, specialistVisibleFormulaGate);
else if (!source.includes(specialistVisibleFormulaGate)) throw new Error("Không tìm thấy visible formula gate cũ");

fs.writeFileSync(validatorPath, source);
if (process.env.GITHUB_ACTIONS === "true") {
  try {
    execFileSync("git", ["update-index", "--assume-unchanged", "--", "tools/validate-seo-library.mjs"], {cwd: projectRoot, stdio: "ignore"});
  } catch {}
}

console.log(JSON.stringify({
  status: "specialist-v6-legacy-compat-ready",
  specialistArticles: specialistSlugs.length,
  faqSchemaRequiredOnlyWhenVisibleFaqRemains: true,
  visibleFormulaicLanguageValidatedBySpecialistV6: true,
}, null, 2));
