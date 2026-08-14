(function(){
  const qs = new URLSearchParams(location.search);
  ["utm_source","utm_campaign","utm_content"].forEach(k=>{
    const el=document.getElementById(k); if(el) el.value=qs.get(k)||"";
  });
  const province=qs.get("province");
  if(province){
    const p=document.getElementById("province");
    const map={"quang-ngai":"Quảng Ngãi","gia-lai":"Gia Lai"};
    if(p && map[province]) p.value=map[province];
  }

  function fire(name, params={}){
    try{
      if(window.fbq) window.fbq("trackCustom",name,params);
      if(window.gtag) window.gtag("event",name,params);
    }catch(e){}
  }
  document.querySelectorAll('a[href*="zalo.me"]').forEach(a=>a.addEventListener("click",()=>fire("ContactZalo")));

  const form=document.getElementById("leadForm");
  const msg=document.getElementById("formMsg");
  form.addEventListener("submit", async e=>{
    e.preventDefault();
    const fd=new FormData(form);
    const data=Object.fromEntries(fd.entries());
    const phone=(data.phone||"").replace(/\s+/g,"");
    if(!/^0\d{9,10}$/.test(phone)){
      msg.textContent="Vui lòng kiểm tra lại số điện thoại.";
      return;
    }
    fire("ApplicationStarted",{province:data.province||""});

    const endpoint=(window.RECRUIT_CONFIG||{}).FORM_ENDPOINT||"";
    if(endpoint){
      try{
        const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
        if(!r.ok) throw new Error("submit failed");
        msg.textContent="Đã gửi đăng ký. Chúng tôi sẽ liên hệ sớm.";
        fire("ApplicationSubmitted",{province:data.province||""});
        form.reset();
        return;
      }catch(err){
        msg.textContent="Chưa gửi được tự động. Đang chuyển bạn sang Zalo để gửi thông tin.";
      }
    }

    const body=[
      "ĐĂNG KÝ LAO ĐỘNG THỜI VỤ TUYỂN SINH",
      `Họ tên: ${data.name||""}`,
      `Điện thoại: ${data.phone||""}`,
      `Tỉnh: ${data.province||""}`,
      `Khu vực: ${data.area||""}`,
      `Công việc hiện tại: ${data.job||""}`,
      `Kinh nghiệm: ${data.experience||""}`,
      `Lý do quan tâm: ${data.reason||""}`,
      `Nguồn: ${data.utm_source||""} / ${data.utm_campaign||""} / ${data.utm_content||""}`
    ].join("\n");
    try{ await navigator.clipboard.writeText(body); }catch(e){}
    fire("ApplicationSubmittedFallback",{province:data.province||""});
    msg.textContent="Đã tạo nội dung đăng ký và sao chép. Đang mở Zalo...";
    setTimeout(()=>window.open("https://zalo.me/"+((window.RECRUIT_CONFIG||{}).ZALO_PHONE||"0398696879"),"_blank"),500);
  });
})();
