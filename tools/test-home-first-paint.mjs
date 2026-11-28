import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const read = name => fs.readFileSync(path.join(root, 'tuyen-tho-mo', name), 'utf8');
const html = read('index.html');
const head = html.split('</head>')[0];
const critical = read('home-critical.css');
const content = read('home-content.css');
const cssLinks = [...head.matchAll(/<link\b[^>]*>/g)].map(match => match[0]);
for (const file of ['home-critical.css', 'home-content.css']) {
  const links = cssLinks.filter(link => link.includes(`/${file}?v=${file === "home-content.css" ? 4 : 3}`));
  assert.equal(links.length, 1, `${file} must be declared once in the head`);
  assert.match(links[0], /rel="stylesheet"/);
  assert.doesNotMatch(links[0], /\bonload=|\bmedia=|\bas="style"/);
}
assert(!head.includes('data-home-content-loader'), 'No JS-dependent layout CSS');
assert(head.indexOf('/home-critical.css') < head.indexOf('/home-content.css'), 'Preserve cascade order');
assert.equal((critical.match(/font-display:optional/g) || []).length, 6, 'No late homepage font swap');
assert.equal((read('fonts.css').match(/font-display:swap/g) || []).length, 6, 'Other pages retain their font policy');
const preloads = cssLinks.filter(link => link.includes('data-home-font-preload'));
assert.equal(preloads.length, 6);
const fontUrls = preloads.map(link => {
  assert.match(link, /rel="preload"/);
  assert.match(link, /as="font"/);
  assert.match(link, /type="font\/woff2"/);
  assert.match(link, /\bcrossorigin(?:\s|>)/);
  const url = link.match(/href="([^"]+)"/)[1];
  assert(critical.includes(`url("${url}")`), `Preload must match a declared face: ${url}`);
  return url;
});
assert.equal(new Set(fontUrls).size, 6);
assert(critical.includes('.home-v6-hero__visual img'), 'Keep reserved hero image geometry');
assert(content.includes('.site-header .header-inner'), 'Full responsive header rules are present');
assert(Buffer.byteLength(critical) <= 18000, 'Keep existing critical CSS budget');

const editorial = read('recruitment-home.css');
assert(html.includes('/recruitment-home.css?v=13'), 'Homepage editorial surface must invalidate older overrides');
assert.match(html, /<div class="home-v6-income"><small>[^<]+<\/small><strong>20–25 triệu\/tháng <span>khi hoàn thành định mức lao động<\/span><\/strong><\/div>/, 'Keep the income amount and its qualification visible together');
const homepageOrder = ['nghe-dang-tuyen','tu-kiem-tra','thuc-te','thong-tin','tu-van','kho-noi-dung'].map(id => html.indexOf(`id="${id}"`));
assert(homepageOrder.every((at,index) => at >= 0 && (index === 0 || at > homepageOrder[index-1])), 'Order careers, eligibility, proof, process, registration, and reference');
assert.match(html, /<details class="home-media-more">[\s\S]*?<section class="tkv-video"[\s\S]*?<\/details>/, 'Keep the secondary playlist available on demand');
assert.match(editorial, /html:root \.home-v6\{background:var\(--d-bg\)!important;color:var\(--d-ink\)!important\}/, 'The dark canvas must back transparent sections');
assert.match(editorial, /\.home-province-reels__intro\{color:var\(--d-sub\)!important\}/, 'Style the late-mounted province story introduction alongside the heading');

// Rebuilding and upgrading a legacy async-loader homepage must be deterministic.
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'home-first-paint-'));
try {
  fs.mkdirSync(path.join(temp, 'tools'));
  fs.mkdirSync(path.join(temp, 'tuyen-tho-mo'));
  for (const name of fs.readdirSync(path.join(root, 'tuyen-tho-mo'))) {
    if (name === 'index.html' || name.endsWith('.css')) {
      fs.copyFileSync(path.join(root, 'tuyen-tho-mo', name), path.join(temp, 'tuyen-tho-mo', name));
    }
  }
  for (const name of ['build-worker-first-home.mjs', 'build-home-css.mjs']) {
    fs.copyFileSync(path.join(root, 'tools', name), path.join(temp, 'tools', name));
  }
  const file = path.join(temp, 'tuyen-tho-mo/index.html');
  const legacy = html.replace(/\s*<link\b[^>]+data-home-font-preload[^>]*>/g, '')
    .replace('/home-critical.css?v=3', '/home-critical.css?v=2')
    .replace('<link rel="stylesheet" href="/home-content.css?v=4">', '<script data-home-content-loader>(()=>{const link=document.createElement("link");link.rel="stylesheet";link.href="/home-content.css?v=4";document.head.append(link)})()</script>\n  <noscript><link rel="stylesheet" href="/home-content.css?v=4"></noscript>');
  fs.writeFileSync(file, legacy);
  const build = () => {
    const result = spawnSync(process.execPath, ['tools/build-worker-first-home.mjs'], {cwd: temp, encoding: 'utf8'});
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return fs.readFileSync(file, 'utf8');
  };
  const once = build();
  assert.equal(build(), once, 'Homepage rebuild must be idempotent');
  assert.equal(once.split('</head>')[1], html.split('</head>')[1], 'Do not alter body content or interactions');
  assert.equal(fs.readFileSync(path.join(temp, 'tuyen-tho-mo/home-content.css'), 'utf8'), content, 'Do not change existing design rules');
} finally {
  fs.rmSync(temp, {recursive: true, force: true});
}
console.log(JSON.stringify({status: 'home-first-paint-pass', blockingLayoutBundles: 2, preloadedFonts: 6, lateFontSwap: false, idempotentBuild: true}, null, 2));
