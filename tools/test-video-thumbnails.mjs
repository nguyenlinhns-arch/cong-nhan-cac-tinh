import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { reelImage, reelThumbnail } from "./video-thumbnail-assets.mjs";

const file = "tuyen-tho-mo/index.html";
const before = fs.readFileSync(file, "utf8");
assert.ok(before.includes("/home-worker-journey.js?v=20261107-2"), "Invalidate the parent loader cache too");
const records = JSON.parse(fs.readFileSync("content/video-thumbnails.json", "utf8"));
assert.equal(records.length, 3);
let totalBytes = 0;
for (const item of records) {
  assert.equal(reelThumbnail(item.id).sourceUrl, `https://www.facebook.com/reel/${item.id}`);
  assert.match(item.image, /^\/assets\/video-thumbnails\/\d+\.webp$/);
  assert.ok(item.width > 0 && item.height > item.width);
  const bytes = fs.readFileSync(`tuyen-tho-mo${item.image}`);
  assert.equal(bytes.subarray(0, 4).toString(), "RIFF");
  assert.equal(bytes.subarray(8, 12).toString(), "WEBP");
  assert.ok(bytes.length < 65000, `Thumbnail too large: ${item.id}`);
  totalBytes += bytes.length;
  assert.ok(before.includes(reelImage(item.id)), `Missing sized, lazy poster: ${item.id}`);
  assert.equal(before.split(`data-reel-thumbnail="${item.id}"`).length - 1, 1);
  assert.ok(before.includes(`"thumbnailUrl":"https://thaylinhtuyenthomo.vn${item.image}"`));
}
assert.ok(totalBytes < 125000);
assert.doesNotMatch(before, /<iframe\b[^>]*facebook\.com/i);
assert.match(before, /class="home-origin-reel__visual"/);
assert.match(before, /\.home-origin-reel__visual span\{position:relative;z-index:1/);
assert.match(before, /height:auto;aspect-ratio:9\/16/);
assert.throws(() => reelThumbnail("unverified"), /Missing verified/);
for (const script of ["home-kcn-reel-facade-v10.mjs", "add-home-journey-reels.mjs"]) {
  execFileSync(process.execPath, [`tools/${script}`], { stdio: "pipe" });
}
assert.equal(fs.readFileSync(file, "utf8"), before, "Thumbnail generation must be idempotent");
console.log(JSON.stringify({ status: "video-thumbnails-ready", verifiedPosters: records.length, totalBytes, initialFacebookIframes: 0, idempotent: true }, null, 2));

// Exercise runtime-generated province cards, including play from the new image.
const { default: vm } = await import("node:vm");
const appended = [];
let section;
const proof = { insertAdjacentElement(_where, element) { section = element; } };
const document = {
  head: { append(element) { appended.push(element); } },
  querySelector(selector) { return selector === ".home-proof.home-proof--early, .home-proof" ? proof : null; },
  createElement(tag) { return { tag, dataset: {}, attributes: {}, listeners: {}, setAttribute(k, v) { this.attributes[k] = v; }, addEventListener(k, v) { this.listeners[k] = v; } }; },
};
const window = {};
vm.runInNewContext(fs.readFileSync("tuyen-tho-mo/home-province-reels.js", "utf8"), { document, window, location: { hash: "", pathname: "/" } });
assert.equal((section.innerHTML.match(/<img /g) || []).length, 2);
assert.doesNotMatch(section.innerHTML, /<iframe/);
for (const item of records.slice(1)) {
  assert.ok(section.innerHTML.includes(`src="${item.image}"`));
  assert.ok(section.innerHTML.includes(`width="${item.width}" height="${item.height}" loading="lazy"`));
}
const schema = JSON.parse(appended.find(item => item.type === "application/ld+json").textContent);
assert.equal(schema["@graph"].length, 2);
for (const video of schema["@graph"]) assert.ok(video.thumbnailUrl.endsWith(`${video.contentUrl.split('/').pop()}.webp`));
const host = { replaceChildren(frame) { this.frame = frame; } };
const button = { dataset: { provinceReelPlay: "0" }, closest() { return host; } };
section.listeners.click({ target: { closest() { return button; } } });
assert.equal(host.frame.tag, "iframe");
assert.ok(host.frame.src.includes("988978737487363"));
assert.equal(host.frame.loading, "eager");
console.log(JSON.stringify({ runtimeProvincePosters: 2, imageClickLoadsCorrectVideo: true }));
