export const personas = {
  "Đào": {
    "presentation": "female",
    "hair": "wave",
    "color": "#203e5a",
    "prop": "flower",
    "room": "ceo"
  },
  "Quyên": {
    "presentation": "female",
    "hair": "bob",
    "color": "#76556e",
    "prop": "check",
    "room": "vp-process"
  },
  "Khôi": {
    "presentation": "male",
    "hair": "part",
    "color": "#4f718a",
    "prop": "tool",
    "room": "vp-repair"
  },
  "Kiên": {
    "presentation": "male",
    "hair": "wave",
    "color": "#40586a",
    "prop": "cursor",
    "room": "infra"
  },
  "Sơn Hà": {
    "presentation": "male",
    "hair": "part",
    "color": "#75836f",
    "prop": "disk",
    "room": "infra"
  },
  "Tuệ": {
    "presentation": "female",
    "hair": "tail",
    "color": "#3f8c87",
    "prop": "clock",
    "room": "oversight"
  },
  "Khuê": {
    "presentation": "female",
    "hair": "bob",
    "color": "#d6c3a3",
    "prop": "search",
    "room": "oversight"
  },
  "Ngọc Lan": {
    "presentation": "female",
    "hair": "bun",
    "color": "#b5a4c6",
    "prop": "document",
    "room": "documents"
  },
  "Hải Đường": {
    "presentation": "female",
    "hair": "wave",
    "color": "#bc745e",
    "prop": "film",
    "room": "studio"
  },
  "Hạ Vy": {
    "presentation": "female",
    "hair": "tail",
    "color": "#4d72a5",
    "prop": "network",
    "room": "social"
  },
  "Trúc": {
    "presentation": "female",
    "hair": "bob",
    "color": "#60a394",
    "prop": "chat",
    "room": "care"
  },
  "Tường Vy": {
    "presentation": "female",
    "hair": "long",
    "color": "#bd8490",
    "prop": "mail",
    "room": "care"
  },
  "Châu": {
    "presentation": "female",
    "hair": "wave",
    "color": "#576a9a",
    "prop": "case",
    "room": "recruitment"
  },
  "Mộc Lan": {
    "presentation": "female",
    "hair": "long",
    "color": "#7e9c73",
    "prop": "facebook",
    "room": "social"
  },
  "Thùy Dung": {
    "presentation": "female",
    "hair": "pixie",
    "color": "#cc8a7a",
    "prop": "music",
    "room": "social"
  },
  "Hải Âu": {
    "presentation": "male",
    "hair": "wave",
    "color": "#698ca5",
    "prop": "video",
    "room": "social"
  },
  "Ngân": {
    "presentation": "female",
    "hair": "pixie",
    "color": "#b59b58",
    "prop": "chart",
    "room": "growth"
  },
  "Diệu": {
    "presentation": "female",
    "hair": "wave",
    "color": "#a58ab9",
    "prop": "palette",
    "room": "growth"
  }
,
  "An": {"presentation":"male","hair":"wave","color":"#537681","prop":"web","room":"growth"}
};
const symbols={flower:'✿',check:'✓',tool:'⌁',cursor:'↖',disk:'▤',clock:'◷',search:'⌕',document:'▧',film:'▥',network:'⌘',chat:'◌',mail:'✉',case:'▣',facebook:'f',music:'♪',video:'▶',chart:'▥',palette:'✦',web:'▣'};
export function portrait(name,kind='portrait'){
const p=personas[name],i=Object.keys(personas).indexOf(name),female=p.presentation==='female';
const skin=['#e9b893','#edc3a4','#d9a987','#e9bd9b'][i%4],hair=['#302b31','#493337','#382b27','#3b3336'][i%4];
const back=female&&['wave','long','tail'].includes(p.hair)?`<path d="M63 112C44 71 57 28 112 27c57-4 78 43 65 91l9 65H54Z" fill="${hair}"/>`:p.hair==='bob'?`<path d="M62 109C46 67 61 28 117 28c49 0 68 34 59 82l-6 45-33-16-56 12Z" fill="${hair}"/>`:'';
const extra=p.hair==='tail'?`<path d="M165 49q39-29 37 25-5 41-28 68l-11-49Z" fill="${hair}"/>`:p.hair==='bun'?`<circle cx="163" cy="65" r="24" fill="${hair}"/>`:'';
const front=p.hair==='pixie'?`<path d="M66 83Q49 46 89 28q44-20 77 18l10 34-26-9-16-27-21 33-44 21Z" fill="${hair}"/>`:p.hair==='bob'?`<path d="M65 93Q50 36 111 27q67-2 63 67l-12-29-32-17q-16 23-60 31Z" fill="${hair}"/>`:p.hair==='wave'?`<path d="M65 88Q42 41 99 28q53-16 72 23l3 40-18-27q-28 5-44-20-17 31-48 44Z" fill="${hair}"/>`:`<path d="M65 87Q50 37 107 28q57-7 66 48l-12 16-4-29q-28 8-44-20-17 30-45 34Z" fill="${hair}"/>`;
const glasses=name==='Tuệ'?'<g fill="none" stroke="#806b51" stroke-width="2"><circle cx="96" cy="94" r="13"/><circle cx="143" cy="94" r="13"/><path d="M109 93h21M78 91h5m73 0h8"/></g>':(name==='Sơn Hà'||name==='An')?'<g fill="none" stroke="#4d5a62" stroke-width="2.4"><rect x="80" y="83" width="31" height="21" rx="5"/><rect x="130" y="83" width="31" height="21" rx="5"/><path d="M111 92h19"/></g>':'';
return `<svg width="240" height="280" viewBox="0 0 240 280" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="coat-${i}-${kind}" x2=".8" y2="1"><stop stop-color="${p.color}"/><stop offset="1" stop-color="#253c50"/></linearGradient><linearGradient id="face-${i}-${kind}" x2=".8" y2="1"><stop stop-color="#f5d6bc"/><stop offset="1" stop-color="${skin}"/></linearGradient></defs><ellipse cx="120" cy="260" rx="78" ry="11" fill="#253e4420"/>${extra}${back}<path d="M94 126v30l26 19 28-19v-31" fill="${skin}"/><path d="M96 133q24 17 50-2v13q-26 16-50-1" fill="#aa71581e"/><path d="M36 254l8-61q2-35 51-40l25 19 26-20q48 7 51 42l7 60Z" fill="url(#coat-${i}-${kind})"/><path d="M98 151l22 21 25-21-4 103H102Z" fill="#f5eee2"/><path d="M94 151l26 21-20 31-20-38Zm53 0-27 21 22 31 20-39Z" fill="${p.color}"/><path d="m101 197-12 57m52-55 10 55" fill="none" stroke="#ffffff45" stroke-width="1.5"/>${!female?'<path d="m115 175 6-3 6 4-3 12 9 51-12 13-11-14 9-51Z" fill="#547b89"/>':''}<ellipse cx="67" cy="97" rx="8" ry="13" fill="${skin}"/><ellipse cx="173" cy="97" rx="8" ry="13" fill="${skin}"/><path d="M68 77Q68 40 121 40q50 2 50 38l-7 41q-9 28-43 30-33-2-45-28Z" fill="url(#face-${i}-${kind})"/>${front}<path d="M84 82q12-6 23-1m25 0q11-5 22 2" fill="none" stroke="${hair}" stroke-width="2.4" stroke-linecap="round"/><path d="M85 94q11-8 22 0m25 0q11-8 22 0" fill="none" stroke="#664a46" stroke-width="2" stroke-linecap="round"/><ellipse cx="97" cy="95" rx="3.5" ry="4.5" fill="#332c32"/><ellipse cx="143" cy="95" rx="3.5" ry="4.5" fill="#332c32"/><circle cx="98" cy="93" r="1.2" fill="white"/><circle cx="144" cy="93" r="1.2" fill="white"/>${female?'<path d="m85 94-4-3m73 3 4-3" stroke="#664a46" stroke-width="1.7"/><ellipse cx="86" cy="112" rx="9" ry="4" fill="#d5807728"/><ellipse cx="154" cy="112" rx="9" ry="4" fill="#d5807728"/>':''}<path d="m120 99-3 12 6 1" fill="none" stroke="#bc8c70" stroke-width="1.5" stroke-linecap="round"/><path d="M107 123q13 11 27-1" fill="${female?'#b66b68':'#a6685c'}"/><path d="M110 123q10 4 21 0" fill="none" stroke="#f9e1d4" stroke-width="2" stroke-linecap="round"/>${glasses}${female?'<circle cx="73" cy="118" r="3" fill="#d4b574"/><circle cx="165" cy="118" r="3" fill="#d4b574"/>':''}<path d="M49 210q21-4 34 15l26 13-7 13-31-10-30-7" fill="${skin}"/><path d="M188 212q-16-2-27 13l-26 13 6 13 28-9 28-9" fill="${skin}"/><rect x="94" y="211" width="53" height="40" rx="6" fill="#e9d7b0" transform="rotate(-5 120 230)"/><path d="M104 222h31m-31 8h22" stroke="#b99a68" stroke-width="2"/><circle cx="162" cy="182" r="13" fill="#f5e8c8"/>${p.prop==='web'?'<g fill="none" stroke="#43616c" stroke-width="1.5"><rect x="154" y="176" width="16" height="11" rx="1.5"/><path d="M162 187v3m-5 0h10m-13-10h16"/></g>':p.prop==='mail'?'<g fill="none" stroke="#43616c" stroke-width="1.6" stroke-linejoin="round"><rect x="154" y="177" width="16" height="11" rx="1.5"/><path d="m154 178 8 6 8-6"/></g>':`<text x="162" y="187" font-size="16" text-anchor="middle" fill="#43616c" font-family="system-ui,sans-serif">${symbols[p.prop]}</text>`}<path d="M43 251h156" stroke="#1c3b4c20" stroke-width="2"/></svg>`;
}


// Explicitly designed fictional presentations, not name-based inference.
Object.assign(personas,{
  "Mai Chi": {
    "presentation": "female",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "bob",
    "color": "#328775",
    "prop": "document",
    "room": "social"
  },
  "Yến Nhi": {
    "presentation": "female",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "bob",
    "color": "#328775",
    "prop": "document",
    "room": "social"
  },
  "Bình An": {
    "presentation": "male",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "part",
    "color": "#328775",
    "prop": "document",
    "room": "social"
  },
  "Nguyệt Anh": {
    "presentation": "female",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "bob",
    "color": "#328775",
    "prop": "document",
    "room": "planning"
  },
  "Tuần Anh": {
    "presentation": "male",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "part",
    "color": "#328775",
    "prop": "document",
    "room": "planning"
  },
  "Gia Hân": {
    "presentation": "female",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "bob",
    "color": "#328775",
    "prop": "document",
    "room": "planning"
  },
  "Bảo An": {
    "presentation": "male",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "part",
    "color": "#328775",
    "prop": "document",
    "room": "planning"
  },
  "Học Minh": {
    "presentation": "male",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "part",
    "color": "#328775",
    "prop": "document",
    "room": "data"
  },
  "Công Thành": {
    "presentation": "male",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "part",
    "color": "#328775",
    "prop": "document",
    "room": "data"
  },
  "Minh Chính": {
    "presentation": "male",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "part",
    "color": "#328775",
    "prop": "document",
    "room": "documents"
  },
  "Pháp Minh": {
    "presentation": "male",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "part",
    "color": "#328775",
    "prop": "document",
    "room": "documents"
  },
  "Nhã Văn": {
    "presentation": "female",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "bob",
    "color": "#328775",
    "prop": "document",
    "room": "documents"
  },
  "Vân Anh": {
    "presentation": "female",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "bob",
    "color": "#328775",
    "prop": "document",
    "room": "cloud"
  },
  "Minh Tiến": {
    "presentation": "male",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "part",
    "color": "#328775",
    "prop": "document",
    "room": "oversight"
  },
  "Vân Tiến": {
    "presentation": "male",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "part",
    "color": "#328775",
    "prop": "document",
    "room": "oversight"
  },
  "Văn Tiến": {
    "presentation": "male",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "part",
    "color": "#328775",
    "prop": "document",
    "room": "oversight"
  },
  "Kết Minh": {
    "presentation": "male",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "part",
    "color": "#328775",
    "prop": "document",
    "room": "agy"
  },
  "Ngân Hà": {
    "presentation": "female",
    "appearanceSource": "Explicit fictional design for this illustration; not inferred human gender",
    "hair": "bob",
    "color": "#328775",
    "prop": "document",
    "room": "infra"
  }
});
