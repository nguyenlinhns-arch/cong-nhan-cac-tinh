(()=>{
  'use strict';
  const KEYS=['gclid','gbraid','wbraid','gad_source','gad_campaignid','utm_source','utm_medium','utm_campaign','utm_term','utm_content','tl_campaign','tl_adgroup','tl_creative','tl_matchtype','tl_device','tl_network'];
  const STORAGE_KEY='thaylinh_ads_attribution_v1';
  const CONSENT_KEY='thaylinh_measurement_consent_v1';
  const MAX_AGE=90*24*60*60*1000;
  const now=Date.now();
  const params=new URLSearchParams(location.search);
  const incoming={};
  for(const key of KEYS){const value=params.get(key);if(value)incoming[key]=value.slice(0,500);}

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

  const safeAttrs=Object.fromEntries(KEYS.filter(k=>attribution[k]).map(k=>[k,attribution[k]]));
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({event:'ads_landing_view',page_path:location.pathname,landing_intent:'tuyen_tho_mo_quang_ninh',...safeAttrs});

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
      landing_intent:'tuyen_tho_mo_quang_ninh',
      ...safeAttrs
    });
  },{passive:true});

  window.addEventListener('storage',event=>{
    if(event.key!==CONSENT_KEY||event.newValue!=='granted')return;
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(attribution));}catch{}
  });
  window.__THAYLINH_ADS_ATTRIBUTION__={get:()=>({...attribution}),decorate,persist:()=>{
    if(!consentGranted())return false;
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(attribution));return true;}catch{return false;}
  }};
})();
