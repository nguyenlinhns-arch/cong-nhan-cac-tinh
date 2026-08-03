import {execFileSync} from "node:child_process";

const host = "thaylinhtuyenthomo.vn";
const base = `https://${host}`;
const key = "bf1717c52d36ed87c6b5f5cd57ffcb81";
const keyLocation = `${base}/${key}.txt`;
const homepageSources = [
  "content/home-worker-first/",
  "tools/build-worker-first-home.mjs",
  "tuyen-tho-mo/home-worker-journey.css",
  "tuyen-tho-mo/mobile-core.js",
  "tuyen-tho-mo/mobile-polish-20260803.css",
  "tuyen-tho-mo/site-shell-20260803.js",
  "tuyen-tho-mo/search-index.json",
  "tuyen-tho-mo/worker-info-finder.css",
  "tuyen-tho-mo/worker-info-finder.js",
];
const discoverySources = [
  "tools/polish-discovery-output.mjs",
  "tuyen-tho-mo/robots.txt",
  "tuyen-tho-mo/llms.txt",
  "tuyen-tho-mo/sitemap.xml",
  "tuyen-tho-mo/news-sitemap.xml",
];

function matchesSource(file, source) {
  return source.endsWith("/") ? file.startsWith(source) : file === source;
}

function urlsForChangedFile(file) {
  const urls = [];
  if (homepageSources.some((source) => matchesSource(file, source))) {
    urls.push(`${base}/`);
  }
  if (discoverySources.some((source) => matchesSource(file, source))) {
    urls.push(`${base}/`, `${base}/thong-tin-tuyen-tho-mo/`);
  }
  const prefix = "tuyen-tho-mo/";
  if (!file.startsWith(prefix) || !file.endsWith(".html")) return urls;
  const relative = file.slice(prefix.length);
  if (relative === "index.html") urls.push(`${base}/`);
  else if (relative.endsWith("/index.html")) urls.push(`${base}/${relative.slice(0, -"index.html".length)}`);
  else urls.push(`${base}/${relative}`);
  return urls;
}

function changedFiles() {
  if (process.env.INDEXNOW_CHANGED_FILES) {
    return process.env.INDEXNOW_CHANGED_FILES.split(/\r?\n|,/).map((value) => value.trim()).filter(Boolean);
  }
  try {
    return execFileSync("git", ["diff", "--name-only", "HEAD^", "HEAD"], {encoding: "utf8"})
      .split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
  } catch (error) {
    throw new Error(`Cannot determine changed URLs for IndexNow: ${error.message}`);
  }
}

const files = changedFiles();
const urls = new Set(files.flatMap(urlsForChangedFile));
if (!urls.size) {
  console.log(JSON.stringify({status: "skipped", reason: "No changed public or discovery URLs", changedFiles: files.length}));
  process.exit(0);
}
if (process.env.INDEXNOW_DRY_RUN === "1") {
  console.log(JSON.stringify({status: "dry-run", changedFiles: files.length, urls: [...urls]}, null, 2));
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList: [...urls] }),
});

const responseBody = await response.text();
console.log(JSON.stringify({ status: response.status, changedFiles: files.length, submitted: urls.size, response: responseBody || null }));
if (![200, 202].includes(response.status)) process.exit(1);
