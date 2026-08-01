import fs from "node:fs";
import path from "node:path";

const [apiUrl, outputPath] = process.argv.slice(2);

if (!apiUrl || !outputPath) {
  throw new Error("Usage: node tools/recover-embedded-source-image.mjs <wordpress-api-url> <output-file>");
}

let response;
for (let attempt = 1; attempt <= 3; attempt += 1) {
  response = await fetch(apiUrl, {
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0 (compatible; ThayLinhSourceRecovery/1.0)",
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (response.ok) break;
  await response.body?.cancel();
}

if (!response?.ok) {
  throw new Error(`Could not read source article: HTTP ${response?.status || "unknown"}`);
}

const payload = await response.json();
const rendered = payload?.content?.rendered || "";
const match = rendered.match(/src=["']data:(image\/(?:png|jpe?g|webp));base64,([^"']+)["']/i);

if (!match) {
  throw new Error("The source article does not contain an embedded base64 image.");
}

const mimeType = match[1].toLowerCase();
const extension = path.extname(outputPath).toLowerCase();
const expectedExtensions = mimeType === "image/png" ? [".png"]
  : mimeType === "image/webp" ? [".webp"]
    : [".jpg", ".jpeg"];

if (!expectedExtensions.includes(extension)) {
  throw new Error(`Output extension ${extension || "(none)"} does not match ${mimeType}.`);
}

const bytes = Buffer.from(match[2].replace(/\s+/g, ""), "base64");
if (bytes.length < 1_000) {
  throw new Error(`Recovered image is unexpectedly small (${bytes.length} bytes).`);
}

fs.mkdirSync(path.dirname(outputPath), {recursive: true});
fs.writeFileSync(outputPath, bytes);
console.log(`Recovered ${bytes.length} bytes (${mimeType}) to ${outputPath}`);
