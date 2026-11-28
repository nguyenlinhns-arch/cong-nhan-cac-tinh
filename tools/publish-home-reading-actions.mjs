import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('tuyen-tho-mo');
const slugs = ['thu-nhap-an-o-ho-tro','ho-so-nhap-hoc','chon-kcn-hay-lam-mo','phong-su','cau-chuyen-cong-nhan','bang-luong'];
const action = '/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/#dang-ky';
const guard = '<!-- home-reading-actions -->';
const css = '<link rel="stylesheet" href="/reading-registration.css?v=1">';
if (!fs.existsSync(path.join(root,'reading-registration.css'))) throw new Error('Missing action stylesheet');
for (const slug of slugs) {
  const file = path.join(root,slug,'index.html');
  const article = fs.readFileSync(file,'utf8');
  if ((article.match(/<\/main>/g)||[]).length!==1 || !article.includes('</head>')) throw new Error(`Invalid page to link: ${slug}`);
  const block = `${guard}
    <aside class="reading-registration" aria-label="Bước tiếp theo">
      <p>Muốn được tư vấn về nghề học và lịch khám tuyển?</p>
      <div>
        <a class="reading-registration__primary" href="${action}" data-contact="application" data-context="reading-${slug}">Đăng ký ngay <span aria-hidden="true">→</span></a>
        <a href="/#thuc-te">Xem thêm video nghề mỏ</a>
      </div>
    </aside>
    <!-- /home-reading-actions -->`;
  const without = article.replace(/<!-- home-reading-actions -->[\s\S]*?<!-- \/home-reading-actions -->\s*/g,'').replaceAll(css+'\n  ','');
  const expected = without.replace('</head>',css+'\n  </head>').replace('</main>',block+'\n  </main>');
  if ((expected.split(guard).length-1)!==1 || !expected.includes(`href="${action}"`)) throw new Error(`Missing registration action: ${slug}`);
  if (process.argv.includes('--check')) {
    if (article!==expected) throw new Error(`Registration action not deployed or duplicated: ${slug}`);
  } else if (article!==expected) fs.writeFileSync(file,expected);
}
console.log(`Confirmed one registration action and video return link on ${slugs.length} featured reading pages.`);
