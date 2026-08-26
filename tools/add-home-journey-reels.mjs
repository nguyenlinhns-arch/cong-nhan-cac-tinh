import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('tuyen-tho-mo', 'index.html');
if (!fs.existsSync(file)) throw new Error(`Missing homepage: ${file}`);

let html = fs.readFileSync(file, 'utf8');

const reels = [
  {
    id: '988978737487363',
    slug: 'gia-lai',
    kicker: 'GIA LAI → QUẢNG NINH',
    title: 'Từ Ia RDeh đến vùng mỏ Quảng Ninh',
    description: 'Hành trình tư vấn, kết nối học nghề và mở lối việc làm ngành Than cho lao động Gia Lai.'
  },
  {
    id: '1015675787556708',
    slug: 'quang-ngai',
    kicker: 'QUẢNG NGÃI → VÙNG THAN',
    title: 'Hành trình từ Quảng Ngãi đến vùng than',
    description: 'Câu chuyện người lao động từ Quảng Ngãi ra Quảng Ninh học nghề, chuẩn bị tay nghề và bước vào công việc mới.'
  }
];

const section = `
    <section class="home-origin-reels" id="hanh-trinh-tu-que" aria-labelledby="home-origin-reels-title">
      <style id="home-origin-reels-style">
        .home-origin-reels{padding:58px 0;background:#f5f9f8;border-top:1px solid #dbe8e5}.home-origin-reels .container{width:min(1120px,calc(100% - 32px));margin:auto}.home-origin-reels__head{max-width:760px;margin-bottom:22px}.home-origin-reels__head small{display:block;color:#0a6770;font-weight:900;letter-spacing:.08em;font-size:11px;margin-bottom:7px}.home-origin-reels__head h2{margin:0 0 9px;color:#123c44;font-size:clamp(25px,4vw,38px);line-height:1.15}.home-origin-reels__head p{margin:0;color:#526c71;line-height:1.65}.home-origin-reels__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.home-origin-reel{display:grid;grid-template-columns:145px minmax(0,1fr);min-height:190px;background:#fff;border:1px solid #d9e6e3;border-radius:18px;overflow:hidden;text-decoration:none;color:#173f46;box-shadow:0 10px 28px rgba(7,54,62,.07)}.home-origin-reel__visual{display:grid;place-items:center;background:linear-gradient(145deg,#063c46,#0b6671);color:#fff;position:relative}.home-origin-reel__visual span{display:grid;width:58px;height:58px;place-items:center;border-radius:50%;background:#fff;color:#0a5a65;font-size:22px;box-shadow:0 8px 24px rgba(0,0,0,.18)}.home-origin-reel__copy{padding:20px;align-self:center}.home-origin-reel__copy small{display:block;color:#d36716;font-weight:900;font-size:10px;letter-spacing:.08em;margin-bottom:8px}.home-origin-reel__copy strong{display:block;font-size:19px;line-height:1.28;margin-bottom:8px}.home-origin-reel__copy p{margin:0 0 12px;color:#587076;font-size:14px;line-height:1.55}.home-origin-reel__copy b{color:#075d68;font-size:13px}.home-origin-reel:hover,.home-origin-reel:focus-visible{border-color:#0b6c76;transform:translateY(-1px)}@media(max-width:760px){.home-origin-reels{padding:42px 0}.home-origin-reels .container{width:min(100% - 20px,1120px)}.home-origin-reels__grid{grid-template-columns:1fr;gap:12px}.home-origin-reel{grid-template-columns:96px minmax(0,1fr);min-height:158px;border-radius:15px}.home-origin-reel__visual span{width:46px;height:46px;font-size:18px}.home-origin-reel__copy{padding:15px}.home-origin-reel__copy strong{font-size:16px}.home-origin-reel__copy p{font-size:12.5px;line-height:1.45;margin-bottom:8px}}
      </style>
      <div class="container">
        <div class="home-origin-reels__head">
          <small>HÀNH TRÌNH TỪ QUÊ ĐẾN VÙNG MỎ</small>
          <h2 id="home-origin-reels-title">Người thật, chuyến đi thật, con đường việc làm thật</h2>
          <p>Hai hành trình thực tế giúp người lao động ở tỉnh xa hình dung rõ hơn từ lúc được tư vấn tại quê nhà đến khi học nghề và kết nối việc làm tại Quảng Ninh.</p>
        </div>
        <div class="home-origin-reels__grid">
          ${reels.map((r) => `<a class="home-origin-reel" href="https://www.facebook.com/reel/${r.id}" target="_blank" rel="noopener noreferrer" data-context="home-origin-${r.slug}"><span class="home-origin-reel__visual" aria-hidden="true"><span>▶</span></span><span class="home-origin-reel__copy"><small>${r.kicker}</small><strong>${r.title}</strong><p>${r.description}</p><b>Xem video thực tế →</b></span></a>`).join('\n          ')}
        </div>
      </div>
    </section>
`;

const sectionPattern = /\n\s*<section class="home-origin-reels"[\s\S]*?<\/section>\n/i;
if (sectionPattern.test(html)) {
  html = html.replace(sectionPattern, `\n${section}\n`);
} else {
  const marker = '<section class="home-journey"';
  const pos = html.indexOf(marker);
  if (pos < 0) throw new Error('Homepage journey marker not found.');
  html = html.slice(0, pos) + section + '\n    ' + html.slice(pos);
}

const schemaId = 'home-origin-reels-schema';
const schema = `<script type="application/ld+json" id="${schemaId}">${JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': reels.map((r) => ({
    '@type': 'VideoObject',
    '@id': `https://thaylinhtuyenthomo.vn/#journey-${r.slug}`,
    name: r.title,
    description: r.description,
    contentUrl: `https://www.facebook.com/reel/${r.id}`,
    inLanguage: 'vi-VN',
    author: {'@id': 'https://thaylinhtuyenthomo.vn/tac-gia/nguyen-tu-linh/#person'}
  }))
})}</script>`;
const schemaPattern = new RegExp(`<script[^>]+id=["']${schemaId}["'][^>]*>[\\s\\S]*?<\\/script>`, 'i');
html = schemaPattern.test(html) ? html.replace(schemaPattern, schema) : html.replace('</head>', `  ${schema}\n</head>`);

for (const reel of reels) {
  if (!html.includes(`facebook.com/reel/${reel.id}`)) throw new Error(`Missing reel ${reel.id}`);
}

fs.writeFileSync(file, html);
console.log(JSON.stringify({status:'ok', reels: reels.map((r) => r.id)}, null, 2));
