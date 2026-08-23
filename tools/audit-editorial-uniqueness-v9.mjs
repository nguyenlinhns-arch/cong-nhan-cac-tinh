import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const candidates = [];
const sentenceMap = new Map();

function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, output);
    else if (entry.name === "index.html") output.push(target);
  }
  return output;
}

function rel(file) { return path.relative(root, file).split(path.sep).join("/"); }
function origin(html) {
  return html.match(/<meta\b[^>]*name=["']content-origin["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1]
    || html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*name=["']content-origin["'][^>]*>/i)?.[1]
    || "";
}
function visible(html) {
  return String(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ")
    .replace(/<!-- editorial-origin-v9:start -->[\s\S]*?<!-- editorial-origin-v9:end -->/gi," ")
    .replace(/<section\b[^>]*class=["'][^"']*\barticle-(?:apply|share-panel)\b[^"']*["'][^>]*>[\s\S]*?<\/section>/gi," ")
    .replace(/<(section|div)\b[^>]*class=["'][^"']*(?:\bfaq\b|\barticle-related\b|\brelated-|\btopic-links\b)[^"']*["'][^>]*>[\s\S]*?<\/\1>/gi," ")
    .replace(/<p\b[^>]*class=["'][^"']*\barticle-topic-hub\b[^"']*["'][^>]*>[\s\S]*?<\/p>/gi," ")
    .replace(/<details\b[^>]*>[\s\S]*?<\/details>/gi," ")
    .replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi," ")
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi," ")
    .replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi," ")
    .replace(/<div\b[^>]*class=["'][^"']*\barticle-source-footer\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi," ")
    .replace(/<[^>]+>/g," ")
    .replace(/&nbsp;|&#160;/gi," ")
    .replace(/&amp;|&#38;|&#038;/gi,"&")
    .replace(/&quot;/gi,'"')
    .replace(/&#39;|&apos;/gi,"'")
    .replace(/\s+/g," ")
    .trim();
}
function normalize(sentence) {
  return sentence
    .toLocaleLowerCase("vi")
    .normalize("NFC")
    .replace(/[“”„‟"'‘’]/g,"")
    .replace(/\s+/g," ")
    .trim();
}
function words(value) { return value.split(/\s+/u).filter(Boolean).length; }

for (const dir of ["phong-su","tin-nganh-than","bai-viet","giai-dap-nghe-mo"]) {
  for (const file of walk(path.join(root,dir))) {
    const html = fs.readFileSync(file,"utf8");
    const type = origin(html);
    if (!type || !["firsthand","sourced-editorial","expert-explainer","current-explainer"].includes(type)) continue;
    const article = html.match(/<article\b[^>]*>[\s\S]*?<\/article>/i)?.[0] || "";
    if (!article) continue;
    candidates.push(file);
    const text = visible(article);
    const sentences = text.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ỹ0-9“])/u).map((item)=>item.trim()).filter(Boolean);
    for (const sentence of sentences) {
      const count = words(sentence);
      if (count < 14 || count > 80) continue;
      const key = normalize(sentence);
      if (key.length < 80) continue;
      const entries = sentenceMap.get(key) || [];
      entries.push({file:rel(file), sentence, words:count, origin:type});
      sentenceMap.set(key,entries);
    }
  }
}

const repeated = [...sentenceMap.values()]
  .filter((entries)=>new Set(entries.map((entry)=>entry.file)).size >= 2)
  .map((entries)=>({
    copies:new Set(entries.map((entry)=>entry.file)).size,
    sentence:entries[0].sentence,
    words:entries[0].words,
    files:[...new Set(entries.map((entry)=>entry.file))],
    origins:[...new Set(entries.map((entry)=>entry.origin))],
  }))
  .sort((a,b)=>b.copies-a.copies || b.words-a.words);

const severe = repeated.filter((item)=>item.copies >= 3 && item.words >= 16);
console.log(JSON.stringify({
  status:"editorial-uniqueness-v9-audit",
  articles:candidates.length,
  repeatedSentences:repeated.length,
  severeRepeatedSentences:severe.length,
  topRepeated:repeated.slice(0,30),
},null,2));
