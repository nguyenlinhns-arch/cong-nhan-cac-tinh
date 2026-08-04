import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "content", "daily-seo-articles.json"), "utf8"));
const today = process.env.SEO_DAILY_DATE || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const files = data.articles
  .filter((article) => article.publish_on === today)
  .map((article) => `tuyen-tho-mo/giai-dap-nghe-mo/${article.slug}/index.html`);

process.stdout.write(files.join("\n"));
