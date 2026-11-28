import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv.find(x => x.startsWith('--root='))?.slice(7) || 'tuyen-tho-mo');
const check = process.argv.includes('--check');
const current = import.meta.dirname;
const rules = new Map();
for (const row of fs.readFileSync(path.join(current, 'recruitment-copy.vi.txt'), 'utf8').split(/\r?\n/)) {
  if (!row || row.startsWith('#')) continue;
  const [old, revised, extra] = row.split('\t');
  assert(old && revised !== undefined && extra === undefined && old !== revised && !rules.has(old), row);
  rules.set(old, revised);
}
const skip = new Set(['diaban','nhap-hoc','kenlop9','congtyai','zalo','assets','scripts','data']);
const dynamic = ['application-progressive.js', 'worker-brief.js', 'home-province-reels.js'];
const versionedScript = /(<script\b[^>]*\bsrc=["'][^<"']*?\b(?:application-progressive|worker-brief|home-province-reels)\.js\?v=[-\w]+)(["'])/giu;
const emptyLine = 'EDITORIAL_EMPTY_LINE_05245';
const encode = s => s.replace(/[&<>]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;'})[c]);
const normalize = s => s.replace(/\s+/gu,' ').trim().replace(/&(?:amp|quot|nbsp|apos|#39);/g, c => ({
  '&amp;':'&','&quot;':'"','&nbsp;':' ','&apos;':"'",'&#39;':"'",
})[c]);
const safePattern = /<!--[\s\S]*?-->|<(script|style|textarea|pre|code|blockquote)\b[^>]*>[\s\S]*?<\/\1\s*>|<\/?[a-z][^>]*>|[^<]+|</giu;
const sections = new Map();
let changed = 0;
let replacements = 0;
let pages = 0;
function changeText(text, rel) {
  const key = normalize(text);
  let value = rules.get(key);
  if (value === undefined && rel.startsWith('viec-lam-nganh-than/')) {
    value = key.match(/^(\d+) hồ sơ trong dữ liệu tuyển sinh lịch sử có mã doanh nghiệp tương ứng\.$/u)?.[1];
    if (value !== undefined) value = `${value} hồ sơ từng ghi tên công ty này.`;
    else if (/^Đối chiếu kho bảng lương /u.test(key)) value = key.replace(/^Đối chiếu kho bảng lương /u, 'Xem bảng lương ');
    else {
      const local = key.match(/^Người lao động tại (.+) có thể đăng ký kiểm tra điều kiện trực tuyến\. Đây là địa bàn tuyển nguồn; nơi học nghề và làm việc thực tế là Quảng Ninh\.$/u);
      if (local) value = `Bạn ở ${local[1]} có thể đăng ký từ xa. Nơi học và làm việc là Quảng Ninh.`;
      else if (/^Không\. (?:xã|phường|đặc khu) .+ là địa bàn tuyển nguồn\. Nơi học nghề và làm việc thực tế là Quảng Ninh\.$/u.test(key)) {
        value = 'Không. Bạn có thể đăng ký từ nơi đang ở, nhưng học và làm việc tại Quảng Ninh.';
      }
    }
  }
  if (value === undefined) return text;
  replacements++;
  return value ? text.replace(/\S[\s\S]*\S|\S/u, encode(value)) : emptyLine;
}
function changePage(src, rel) {
  let main = src.replace(safePattern, token => token.startsWith('<') ? token : changeText(token, rel));
  // Remove only markers from the explicit deletion rules. Keep any wired elements.
  main = main.replace(/<(p|span)\b((?:(?!\b(?:id|data-[\w-]+)\s*=)[^>])*)>\s*EDITORIAL_EMPTY_LINE_05245\s*<\/\1>/giu,'').replaceAll(emptyLine,'');
  main = main.replace(versionedScript, (_all, prefix, quote) => prefix.endsWith('-copy1') ? prefix+quote : prefix+'-copy1'+quote);
  return main;
}
const files = walk(root);
for (const file of files) {
  const rel = path.relative(root,file);
  const orig = fs.readFileSync(file,'utf8');
  if (!/<main\b/i.test(orig)) continue;
  pages++;
  const out = changePage(orig,rel);
  const group = rel.includes(path.sep) ? rel.split(path.sep)[0] : '(trang gốc)';
  if (out !== orig) sections.set(group,(sections.get(group)||0)+1);
  save(file,orig,out);
}
for (const name of dynamic) {
  const file = path.join(root,name);
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file,'utf8');
  let out = src;
  for (const [old, revised] of rules) {
    const n = out.split(old).length-1;
    if (n) { out = out.replaceAll(old,revised); replacements += n; }
  }
  save(file,src,out);
}
function save(file,orig,out) {
  if (out !== orig) {
    changed++;
    if (!check) fs.writeFileSync(file,out);
  }
}
function walk(dir) {
  return fs.readdirSync(dir,{withFileTypes:true})
    .filter(x=> dir !== root || !skip.has(x.name))
    .flatMap(x=>x.isDirectory() ? walk(path.join(dir,x.name)) : x.name.endsWith('.html') ? [path.join(dir,x.name)] : []);
}
console.log(JSON.stringify({pages,replacements,changed,sections:Object.fromEntries(sections)}));
if (check) assert.equal(changed,0,'Published text pass must be idempotent');
assert(pages >= 100, 'Expected a full public recruitment build');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(!/home-editor-reading|home-real-reads|home-article-shortcut|6 bài cần biết trước khi đăng ký/.test(home), 'Do not restore the removed homepage article bundle');
assert.equal((home.match(/data-home-pin=/g)||[]).length, 3);
assert(home.includes('Hỗ trợ 7,5 triệu đồng trong thời gian học'));
assert(home.includes('20–25 triệu/tháng') && home.includes('khi hoàn thành định mức lao động'));
assert(home.includes('id="landing-apply-frame"') && home.includes('?nhung=1#dang-ky'));
for (const slug of ['phong-su','tin-nganh-than','cam-nang-nghe-mo','chon-kcn-hay-lam-mo']) {
  assert(fs.existsSync(path.join(root,slug,'index.html')), `Keep the original archive: /${slug}/`);
}

