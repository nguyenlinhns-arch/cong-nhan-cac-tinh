(()=>{
  'use strict';
  const KEYS=['gclid','gbraid','wbraid','gad_source','gad_campaignid','utm_source','utm_medium','utm_campaign','utm_term','utm_content','tl_campaign','tl_adgroup','tl_creative','tl_matchtype','tl_device','tl_network','tl_intent'];
  const STORAGE_KEY='thaylinh_ads_attribution_v1';
  const CONSENT_KEY='thaylinh_measurement_consent_v1';
  const MAX_AGE=90*24*60*60*1000;
  const now=Date.now();
  const params=new URLSearchParams(location.search);
  const incoming={};
  for(const key of KEYS){const value=params.get(key);if(value)incoming[key]=value.slice(0,500);}

  const INTENTS=Object.freeze({
    tho_mo:{
      title:'Tuyển thợ mỏ Quảng Ninh 2026 | Học nghề, việc làm',
      kicker:'TUYỂN THỢ MỎ QUẢNG NINH · HỌC NGHỀ TỪ ĐẦU',
      h1:'Tuyển thợ mỏ Quảng Ninh: học nghề từ đầu, bố trí việc làm',
      lead:'Dành cho người đang tìm tuyển thợ mỏ hoặc công nhân mỏ tại Quảng Ninh. Người chưa có kinh nghiệm được đào tạo nghề trước khi nhận việc và có thể kiểm tra điều kiện từ xa.'
    },
    tho_lo:{
      title:'Tuyển thợ lò Quảng Ninh 2026 | Đào tạo từ đầu',
      kicker:'TUYỂN THỢ LÒ · VIỆC LÀM HẦM LÒ QUẢNG NINH',
      h1:'Tuyển thợ lò Quảng Ninh: chưa có kinh nghiệm được đào tạo từ đầu',
      lead:'Dành cho người đang tìm việc thợ lò, việc làm hầm lò tại Quảng Ninh. Kiểm tra điều kiện trước trên điện thoại, sau đó mới chuẩn bị hồ sơ và lịch nhập học.'
    },
    nganh_than:{
      title:'Việc làm ngành Than Quảng Ninh 2026 | 3 nghề hầm lò',
      kicker:'VIỆC LÀM NGÀNH THAN · TKV · QUẢNG NINH',
      h1:'Việc làm ngành Than tại Quảng Ninh: 3 nghề hầm lò đang tiếp nhận',
      lead:'Thông tin dành cho người đang tìm việc làm ngành Than, việc làm TKV hoặc công nhân mỏ tại Quảng Ninh. Có 3 hướng nghề hầm lò và lộ trình đào tạo trước khi bố trí việc làm.'
    },
    hoc_nghe:{
      title:'Học nghề mỏ Quảng Ninh 2026 | Học từ đầu, bố trí việc làm',
      kicker:'HỌC NGHỀ MỎ QUẢNG NINH · HỌC TỪ ĐẦU',
      h1:'Học nghề mỏ Quảng Ninh: học từ đầu trước khi bố trí việc làm',
      lead:'Dành cho người muốn học nghề khai thác mỏ, xây dựng mỏ hoặc cơ điện mỏ hầm lò. Có thể kiểm tra điều kiện từ xa trước khi xác nhận lịch nhập học tại Quảng Ninh.'
    },
    khong_kinh_nghiem:{
      title:'Việc làm mỏ không cần kinh nghiệm 2026 | Đào tạo nghề từ đầu',
      kicker:'VIỆC LÀM MỎ KHÔNG CẦN KINH NGHIỆM',
      h1:'Việc làm mỏ không cần kinh nghiệm: được đào tạo nghề từ đầu',
      lead:'Nếu chưa từng làm mỏ, có thể bắt đầu bằng chương trình đào tạo nghề trước khi nhận việc nếu đáp ứng điều kiện tuyển sinh và hoàn thành chương trình theo yêu cầu.'
    }
  });

  const consentGranted=()=>{
    try{return localStorage.getItem(CONSENT_KEY)==='granted';}catch{return false;}
  };
  const readStored=()=>{
    if(!consentGranted())return{};
    try{
      const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
      if(!value.saved_at||now-value.saved_at>MAX_AGE)return{};
      return value;
    }catch{return{};}
  };

  const stored=readStored();
  const attribution={...stored,...incoming,saved_at:now,landing_path:stored.landing_path||location.pathname};
  if(consentGranted()){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(attribution));}catch{}
  }

  const applyIntent=()=>{
    const key=Object.hasOwn(INTENTS,String(attribution.tl_intent||''))?String(attribution.tl_intent):'tho_mo';
    const config=INTENTS[key];
    const kicker=document.querySelector('.ads-kicker');
    const h1=document.querySelector('.ads-hero h1');
    const lead=document.querySelector('.ads-hero__lead');
    if(kicker)kicker.textContent=config.kicker;
    if(h1)h1.textContent=config.h1;
    if(lead)lead.textContent=config.lead;
    document.title=config.title;
    document.documentElement.dataset.adsIntent=key;
    return key;
  };
  const activeIntent=applyIntent();

  const safeAttrs=Object.fromEntries(KEYS.filter(k=>attribution[k]).map(k=>[k,attribution[k]]));
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({event:'ads_landing_view',page_path:location.pathname,landing_intent:activeIntent,...safeAttrs});

  const decorate=(link)=>{
    if(!link?.href||link.origin!==location.origin)return;
    const u=new URL(link.href);
    for(const key of KEYS){if(attribution[key]&&!u.searchParams.has(key))u.searchParams.set(key,attribution[key]);}
    link.href=u.toString();
  };
  document.querySelectorAll('a[data-preserve-attribution]').forEach(decorate);

  document.addEventListener('click',e=>{
    const link=e.target.closest('a[data-track]');
    if(!link)return;
    const eventName=link.dataset.track||'recruitment_cta';
    window.dataLayer.push({
      event:eventName,
      cta_text:(link.textContent||'').trim().slice(0,120),
      cta_href:link.origin===location.origin?`${link.pathname}${link.search}${link.hash}`:link.origin,
      page_path:location.pathname,
      landing_intent:activeIntent,
      ...safeAttrs
    });
  },{passive:true});

  window.addEventListener('storage',event=>{
    if(event.key!==CONSENT_KEY||event.newValue!=='granted')return;
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(attribution));}catch{}
  });
  window.__THAYLINH_ADS_ATTRIBUTION__={get:()=>({...attribution}),decorate,intent:()=>activeIntent,persist:()=>{
    if(!consentGranted())return false;
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(attribution));return true;}catch{return false;}
  }};
})();
