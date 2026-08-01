import {execFileSync} from "node:child_process";

const host = "thaylinhtuyenthomo.vn";
const base = `https://${host}`;
const key = "bf1717c52d36ed87c6b5f5cd57ffcb81";
const keyLocation = `${base}/${key}.txt`;

function urlForChangedFile(file) {
  const prefix = "tuyen-tho-mo/";
  if (!file.startsWith(prefix) || !file.endsWith(".html")) return "";
  const relative = file.slice(prefix.length);
  if (relative === "index.html") return `${base}/`;
  if (relative.endsWith("/index.html")) return `${base}/${relative.slice(0, -"index.html".length)}`;
  return `${base}/${relative}`;
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
const urls = new Set(files.map(urlForChangedFile).filter(Boolean));
if (!urls.size) {
  console.log(JSON.stringify({status: "skipped", reason: "No changed public HTML URLs", changedFiles: files.length}));
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
