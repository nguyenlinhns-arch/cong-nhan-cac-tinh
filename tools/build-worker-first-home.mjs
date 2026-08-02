import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const sourceDir = path.resolve("content", "home-worker-first");
const target = path.resolve("tuyen-tho-mo", "index.html");
const expectedParts = Array.from({length: 8}, (_, index) => `part-${String(index).padStart(2, "0")}.b64`);
const actualParts = fs.readdirSync(sourceDir)
  .filter((name) => /^part-\d+\.b64$/.test(name))
  .sort();

if (JSON.stringify(actualParts) !== JSON.stringify(expectedParts)) {
  throw new Error(`Worker-first homepage source is incomplete: ${actualParts.join(", ")}`);
}

const encoded = actualParts
  .map((name) => fs.readFileSync(path.join(sourceDir, name), "utf8").replace(/\s+/g, ""))
  .join("");
const html = Buffer.from(encoded, "base64").toString("utf8");
const bytes = Buffer.byteLength(html);
const sha256 = crypto.createHash("sha256").update(html).digest("hex");

if (!html.startsWith("<!doctype html>")) throw new Error("Worker-first homepage is not valid HTML");
if (!html.includes('id="noi-dung"') || !html.includes('id="dieu-kien"') || !html.includes('id="dang-ky"')) {
  throw new Error("Worker-first homepage is missing required navigation anchors");
}
if (bytes !== 32653 || sha256 !== "915d085bff4a83c44e1c7bfe6ec8d0962b87fe173493f140af05e0b472cd9f84") {
  throw new Error(`Worker-first homepage source checksum mismatch: ${bytes} bytes, ${sha256}`);
}

fs.writeFileSync(target, html);
console.log(JSON.stringify({target: "tuyen-tho-mo/index.html", parts: actualParts.length, bytes, sha256}, null, 2));
