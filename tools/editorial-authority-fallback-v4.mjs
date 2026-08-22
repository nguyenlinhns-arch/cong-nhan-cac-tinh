import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const roots = ["tin-nganh-than", "bai-viet", "chuyen-nguoi-tho", "giai-dap-nghe-mo"];
const changed = [];
const stats = {checked: 0, bylines: 0, genres: 0, responsibility: 0, bodyClasses: 0};

function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, output);
    else if (entry.name === "index.html") output.push(target);
  }
  return output;
}

function genre(relative) {
  if (relative.startsWith("giai-dap-nghe-mo/")) return "Giải đáp chuyên môn";
  if (relative.startsWith("chuyen-nguoi-tho/")) return "Phóng sự - nhân vật";
  if (relative.startsWith("bai-viet/")) return "Phân tích - hướng dẫn";
  return "Tin tức chuyên ngành";
}

function ensureBodyClass(html) {
  return html.replace(/<body\b([^>]*)>/i, (tag, attrs) => {
    if (/\beditorial-authority-page\b/.test(tag)) return tag;
    const classMatch = attrs.match(/class=(['"])([^'"]*)\1/i);
    stats.bodyClasses += 1;
    if (classMatch) {
      const next = `${classMatch[2]} editorial-authority-page`.trim();
      return `<body${attrs.replace(classMatch[0], `class=${classMatch[1]}${next}${classMatch[1]}`)}>`;
    }
    return `<body${attrs} class="editorial-authority-page">`;
  });
}

function ensureGenre(html, relative) {
  if (/class=(['"])[^'"]*\barticle-genre-label\b/i.test(html)) return html;
  const label = `<p class="article-genre-label">${genre(relative)}</p>`;
  const pattern = /(<article\b[^>]*class=(['"])[^'"]*\barticle-body\b[^>]*>)/i;
  if (!pattern.test(html)) return html;
  stats.genres += 1;
  return html.replace(pattern, `$1\n${label}`);
}

function ensureByline(html) {
  if (/class=(['"])[^'"]*\barticle-byline\b/i.test(html)) return html;
  const byline = '<p class="article-byline"><a href="/lien-he/">Nguyễn Tử Linh</a><span>Biên tập, kiểm chứng nguồn và chịu trách nhiệm nội dung</span></p>';
  const hero = /(<section\b[^>]*class=(['"])[^'"]*\barticle-hero\b[^>]*>[\s\S]*?<h1\b[^>]*>[\s\S]*?<\/h1>)/i;
  if (hero.test(html)) {
    stats.bylines += 1;
    return html.replace(hero, `$1\n${byline}`);
  }
  if (/<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(html)) {
    stats.bylines += 1;
    return html.replace(/(<h1\b[^>]*>[\s\S]*?<\/h1>)/i, `$1\n${byline}`);
  }
  return html;
}

function ensureResponsibility(html) {
  if (/class=(['"])[^'"]*\barticle-source-responsibility\b/i.test(html)) return html;
  const note = '<p class="article-source-responsibility">Dữ kiện được đối chiếu theo nguồn ghi trong bài; phần phân tích và cách diễn giải do Nguyễn Tử Linh chịu trách nhiệm biên tập.</p>';
  const anchors = [
    /(<p\b[^>]*class=(['"])[^'"]*\barticle-source-note\b)/i,
    /(<div\b[^>]*class=(['"])[^'"]*\barticle-source-footer\b)/i,
    /(<section\b[^>]*class=(['"])[^'"]*\bprofessional-news-faq\b)/i,
    /(<section\b[^>]*class=(['"])[^'"]*\barticle-apply\b)/i,
    /(<nav\b[^>]*class=(['"])[^'"]*\barticle-nav\b)/i,
  ];
  for (const pattern of anchors) {
    if (!pattern.test(html)) continue;
    stats.responsibility += 1;
    return html.replace(pattern, `${note}\n$1`);
  }
  if (/<\/article>/i.test(html)) {
    stats.responsibility += 1;
    return html.replace(/<\/article>/i, `${note}\n</article>`);
  }
  return html;
}

for (const root of roots) {
  for (const file of walk(path.join(siteRoot, root))) {
    const before = fs.readFileSync(file, "utf8");
    if (!/"@type":"(?:NewsArticle|Article|BlogPosting|FAQPage)"/.test(before)) continue;
    stats.checked += 1;
    const relative = path.relative(siteRoot, file).split(path.sep).join("/");
    let after = ensureBodyClass(before);
    after = ensureGenre(after, relative);
    after = ensureByline(after);
    after = ensureResponsibility(after);
    if (after === before) continue;
    fs.writeFileSync(file, after);
    changed.push(relative);
  }
}

console.log(JSON.stringify({
  status: "editorial-authority-fallback-v4-complete",
  ...stats,
  changed: changed.length,
  sample: changed.slice(0, 20),
}, null, 2));
