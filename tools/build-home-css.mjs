import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const bundles = {
  "home-critical.css": ["fonts.css", "home-shell-critical.css", "homepage-redesign-critical.css"],
  "home-content.css": ["landing-recruitment.css", "mobile-core.css", "publication-polish.css", "worker-info-finder.css", "home-rich-media.css", "journey-optimizer.css", "v5-growth.css", "site-shell-20260803.css", "homepage-redesign.css", "contact-authority.css", "worker-questions.css", "daily-seo.css"],
};

for (const [target, sources] of Object.entries(bundles)) {
  const content = sources.map((source) => {
    const file = path.join(root, source);
    if (!fs.existsSync(file)) throw new Error(`Missing homepage CSS source: ${source}`);
    return `/* ${source} */\n${fs.readFileSync(file, "utf8").trim()}`;
  }).join("\n");
  fs.writeFileSync(path.join(root, target), `${content}\n`);
}

console.log(JSON.stringify(Object.fromEntries(Object.entries(bundles).map(([target, sources]) => [target, {
  sources,
  bytes: fs.statSync(path.join(root, target)).size,
}])) , null, 2));
