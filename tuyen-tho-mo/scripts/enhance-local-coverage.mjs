import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('tuyen-tho-mo');
const COVERAGE = JSON.parse(fs.readFileSync(path.join(ROOT, 'local-coverage.json'), 'utf8'));
const POLICY = JSON.parse(fs.readFileSync(path.join(ROOT, 'recruitment-current.json'), 'utf8'));
const SOURCE = COVERAGE.source;
const BASE = path.join(ROOT, 'viec-lam-nganh-than');

const esc = (s='') => String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
const text = (s='') => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const policyDate = POLICY.updated_at || new Date().toISOString().slice(0,10);
const eligibility = POLICY.eligibility || {};
const training = POLICY.training || [];
const benefits = POLICY.benefits_during_training || {};
const after = POLICY.after_training || {};

function parseHub(slug) {
  const file = path.join(BASE, slug, 'xa-phuong', 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  return [...html.matchAll(/href="\.\.\/(xã|phường|đặc khu)\/([^/]+)\/">([^<]+)<\/a>/giu)].map(m => ({type:m[1], slug:m[2], label:text(m[3])}));
}

function addHead(html, {title, description, url, province, locality}) {
  const og = [
    `<meta property="og:type" content="website">`,
    `<meta property="og:locale" content="vi_VN">`,
    `<meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta name="twitter:card" content="summary">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    `<meta name="author" content="Nguyễn Tử Linh">`,
    `<meta name="geo.region" content="VN">`,
    `<meta name="geo.placename" content="${esc(locality)}, ${esc(province)}">`,
  ].join('');
  if (!html.includes('property="og:title"')) html = html.replace('</head>', `${og}</head>`);
  return html;
}

function visibleQualityBlock({province, provinceSlug, locality, type, siblings}) {
  const related = siblings.map(x => `<a href="../../${x.type}/${x.slug}/">${esc(x.label)}</a>`).join(' · ');
  const trainingItems = training.map(x => `<li><strong>${esc(x.trade)}</strong>: ${esc(x.duration)}</li>`).join('');
  return `<section class="section local-quality" data-local-quality="2" aria-labelledby="local-guide-title"><h2 id="local-guide-title">Thông tin tuyển thợ mỏ dành cho người ở ${esc(locality)}</h2><p>Trang này giúp người lao động tại ${esc(type)} ${esc(locality)}, ${esc(province)} kiểm tra điều kiện trước khi đi Quảng Ninh. Địa phương này là <strong>nguồn tuyển</strong>, không phải nơi làm việc.</p><div class="overview-grid"><article><h3>Điều kiện cơ bản</h3><p>${esc(eligibility.gender || 'Nam')} ${esc(eligibility.age_min)}–${esc(eligibility.age_max)} tuổi; cao từ ${esc(eligibility.height_min_cm)} cm; nặng từ ${esc(eligibility.weight_min_kg)} kg. ${esc(eligibility.health_note)}</p><p><a href="/kiem-tra-dieu-kien/?province=${encodeURIComponent(province)}&locality=${encodeURIComponent(locality)}">Kiểm tra điều kiện chi tiết →</a></p></article><article><h3>Học nghề trước khi nhận việc</h3><ul>${trainingItems}</ul><p><a href="/hoc-nghe-mo-tai-quang-ninh/">Xem chương trình học nghề →</a></p></article><article><h3>Quyền lợi đang áp dụng</h3><p>${esc(benefits.tuition)}; ${esc(benefits.meals)}; ${esc(benefits.dormitory)}; hỗ trợ ${esc(benefits.living_support)}.</p><p><strong>Thu nhập:</strong> ${esc(after.income_commitment)}.</p></article></div><h2>Câu hỏi thường gặp tại ${esc(locality)}</h2><div class="local-faq"><details><summary>Người ở ${esc(locality)} có phải đến Quảng Ninh ngay để đăng ký không?</summary><p>Không. Có thể kiểm tra điều kiện và tư vấn từ xa trước. Chỉ chuẩn bị di chuyển sau khi đã nắm rõ điều kiện, hồ sơ và lịch tiếp nhận.</p></details><details><summary>Nơi học và làm việc có phải tại ${esc(locality)} không?</summary><p>Không. ${esc(type)} ${esc(locality)} là địa bàn tuyển nguồn. Nơi học nghề và làm việc thực tế là Quảng Ninh.</p></details><details><summary>Đang có những nghề nào?</summary><p>Hiện có các hướng nghề khai thác mỏ hầm lò, xây dựng mỏ hầm lò và cơ điện mỏ hầm lò theo kế hoạch tuyển sinh đang áp dụng.</p></details></div><h2>Địa bàn khác cùng ${esc(province)}</h2><p class="local-related">${related || `<a href="/viec-lam-nganh-than/${provinceSlug}/xa-phuong/">Xem danh sách xã, phường</a>`}</p><p class="local-source"><small>Dữ liệu tên đơn vị hành chính đối chiếu từ <a href="${esc(SOURCE)}" rel="nofollow noopener" target="_blank">Cổng Thông tin điện tử Chính phủ</a>. Chính sách tuyển dụng đối chiếu theo bộ dữ liệu cập nhật ngày ${esc(policyDate)}.</small></p></section>`;
}

function faqSchema({province, locality, type, url}) {
  return {
    '@context':'https://schema.org',
    '@graph':[
      {'@type':'FAQPage','@id':`${url}#faq`,mainEntity:[
        {'@type':'Question',name:`Người ở ${locality} có phải đến Quảng Ninh ngay để đăng ký không?`,acceptedAnswer:{'@type':'Answer',text:'Không. Người lao động có thể kiểm tra điều kiện và tư vấn từ xa trước khi chuẩn bị di chuyển.'}},
        {'@type':'Question',name:`Nơi học và làm việc có phải tại ${locality} không?`,acceptedAnswer:{'@type':'Answer',text:`Không. ${type} ${locality}, ${province} là địa bàn tuyển nguồn; nơi học nghề và làm việc thực tế là Quảng Ninh.`}},
        {'@type':'Question',name:'Đang có những nghề mỏ nào?',acceptedAnswer:{'@type':'Answer',text:'Các hướng nghề hiện có gồm kỹ thuật khai thác mỏ hầm lò, kỹ thuật xây dựng mỏ hầm lò và kỹ thuật cơ điện mỏ hầm lò theo kế hoạch tuyển sinh đang áp dụng.'}}
      ]},
      {'@type':'Organization','@id':'https://thaylinhtuyenthomo.vn/#organization',name:'Thầy Linh – Tuyển Thợ Mỏ',url:'https://thaylinhtuyenthomo.vn/',telephone:POLICY.contact?.phone || '0963048585'},
    ]
  };
}

let enhanced = 0;
for (const provinceSlug of Object.keys(COVERAGE.by_province || {})) {
  const entries = parseHub(provinceSlug);
  for (let i=0;i<entries.length;i++) {
    const entry = entries[i];
    const file = path.join(BASE, provinceSlug, entry.type, entry.slug, 'index.html');
    let html = fs.readFileSync(file, 'utf8');
    const h1 = text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || entry.label);
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    const province = text(html.match(/<nav class="breadcrumb">[\s\S]*?<a href="\/viec-lam-nganh-than\/[^/]+\/">([^<]+)<\/a>/i)?.[1] || provinceSlug);
    const locality = entry.label.replace(/^(xã|phường|đặc khu)\s+/iu,'');
    const description = `${h1}. Kiểm tra điều kiện từ xa, học nghề và làm việc tại Quảng Ninh; thông tin tuyển đang áp dụng và đường dẫn đăng ký trực tiếp.`;
    html = addHead(html,{title:h1,description,url:canonical,province,locality});
    if (!html.includes('data-local-quality="2"')) {
      const prev = entries[(i-1+entries.length)%entries.length];
      const next = entries[(i+1)%entries.length];
      const next2 = entries[(i+2)%entries.length];
      const siblings = [prev,next,next2].filter((v,idx,a)=>v.slug!==entry.slug && a.findIndex(x=>x.type===v.type&&x.slug===v.slug)===idx);
      html = html.replace('</main>', `${visibleQualityBlock({province,provinceSlug,locality,type:entry.type,siblings})}</main>`);
      html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(faqSchema({province,locality,type:entry.type,url:canonical}))}</script></head>`);
    }
    fs.writeFileSync(file, html);
    enhanced++;
  }
}
if (enhanced !== 3321) throw new Error(`Chỉ nâng chất lượng ${enhanced}/3321 trang`);
console.log(JSON.stringify({status:'enhanced',pages:enhanced,policy_updated:policyDate},null,2));
