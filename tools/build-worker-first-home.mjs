import fs from "node:fs";
import path from "node:path";
import {dailyCommunityArticles} from "./daily-community-articles.mjs";

await import("./build-worker-first-home-base.mjs");

const article = [...dailyCommunityArticles].sort((a, b) => new Date(b.published) - new Date(a.published))[0];
const homepagePath = path.resolve("tuyen-tho-mo", "index.html");
let html = fs.readFileSync(homepagePath, "utf8");
const card = `<a class="home-proof__story" href="/${article.urlPath}/">
            <img src="${article.image}" alt="${article.imageAlt}" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="800" height="532">
            <span><small>BÀI MỚI NHẤT</small><strong>${article.title}</strong><b>Đọc bài viết →</b></span>
          </a>`;
html = html.replace(/<a class="home-proof__story"[\s\S]*?<\/a>/, card);
fs.writeFileSync(homepagePath, html);
