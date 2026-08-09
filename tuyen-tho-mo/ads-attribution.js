(()=>{
  'use strict';
  const KEYS=['gclid','gbraid','wbraid','gad_source','gad_campaignid','utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
  const STORAGE_KEY='thaylinh_ads_attribution_v1';
  const now=Date.now();
  const maxAge=90*24*60*60*1000;
  const params=new URLSearchParams(location.search);
  const incoming={};
  for(const key of KEYS){const value=params.get(key);if(value)incoming[key]=value.slice(0,500);}
  let stored={};
  try{stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');}catch{}
  if(!stored.saved_at||now-stored.saved_at>maxAge)stored={};
  const attribution={...stored,...incoming,saved_at:now,landing_path:stored.landing_path||location.pathname};
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(attribution));sessionStorage.setItem(STORAGE_KEY,JSON.stringify(attribution));}catch{}
  window.dataLayer=window.dataLayer||[];
  const safeAttrs=Object.fromEntries(KEYS.filter(k=>attribution[k]).map(k=>[k,attribution[k]]));
  window.dataLayer.push({event:'ads_landing_view',page_path:location.pathname,...safeAttrs});
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
    window.dataLayer.push({event:eventName,cta_text:(link.textContent||'').trim().slice(0,120),cta_href:link.href,page_path:location.pathname,...safeAttrs});
  },{passive:true});
  window.__THAYLINH_ADS_ATTRIBUTION__={get:()=>({...attribution}),decorate};
})();
