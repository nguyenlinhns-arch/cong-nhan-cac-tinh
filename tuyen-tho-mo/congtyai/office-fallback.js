// Accessible, static 2.5D illustration. No activity or live-worker assertions.
export function mountOfficeFallback(host, roles, personas) {
 host.replaceChildren();
 const note=document.createElement('p'); note.className='fallback-caption';
 note.textContent='Văn phòng 2.5D · Mô hình tĩnh tương thích · Chọn nhân vật để xem vai trò';host.append(note);
 const controls=document.createElement('div');controls.className='fallback-controls';
 const gesture=document.createElement('button');gesture.type='button';gesture.textContent='Xem cử chỉ minh họa · 8 giây';
 const feedback=document.createElement('span');feedback.setAttribute('role','status');feedback.textContent='Không biểu thị tiến độ hoặc thao tác thật.';
 controls.append(gesture,feedback);host.append(controls);
 const floor=document.createElement('div');floor.className='fallback-floor';host.append(floor);
 let timer;
 gesture.onclick=()=>{clearTimeout(timer);floor.classList.remove('illustrative-gesture');if(document.body.classList.contains('reduced-motion')||matchMedia('(prefers-reduced-motion: reduce)').matches){feedback.textContent='Đã bật giảm chuyển động: giữ minh họa tĩnh.';return;}floor.classList.add('illustrative-gesture');gesture.disabled=true;feedback.textContent='Cử chỉ hoạt họa minh họa, không phải nhân viên đang làm việc.';timer=setTimeout(()=>{floor.classList.remove('illustrative-gesture');gesture.disabled=false;feedback.textContent='Đã kết thúc cử chỉ minh họa. Không tạo công việc hay biên nhận.';},8000);};
 const groups=[...new Set(roles.map(r=>r.group))];
 for(const group of groups){
  const room=document.createElement('section');room.className='fallback-room';
  const label=document.createElement('h3');label.textContent=group;room.append(label);
  const people=document.createElement('div');people.className='fallback-people';room.append(people);floor.append(room);
  for(const role of roles.filter(r=>r.group===group)){
   const rank=role.title.startsWith('CEO')?['#c49a3a','◆','CEO']:role.title.includes('Phó Tổng')?['#895db2','◇','Phó Tổng']:(role.group==='Giám đốc'||role.title.startsWith('Trưởng'))?['#3f80b9','■','Quản lý']:['#328775','●','Chuyên môn'];
   const female=personas[role.name]?.presentation==='female';
   const b=document.createElement('button');b.type='button';b.className='fallback-person';b.setAttribute('aria-label',`Xem vai trò ${role.name} · ${rank[2]}`);b.style.setProperty('--rank',rank[0]);
   // All SVG values are fixed geometry or internally declared persona/rank metadata.
   b.innerHTML=`<svg viewBox="0 0 120 150" aria-hidden="true"><ellipse cx="60" cy="137" rx="35" ry="8" fill="#233d5430"/><path d="M17 100 61 88 105 102 59 116Z" fill="#d0a66f"/><path d="M17 100v8l42 16 46-14v-8l-46 14Z" fill="#a87e51"/><path d="M22 107v27m76-26v26" stroke="#365466" stroke-width="5"/><path d="M38 82V57q0-24 22-24t22 24v25" fill="#3a3035"/><path d="M45 101v28m30-28v28" stroke="${female?'#dfb58f':rank[0]}" stroke-width="10" stroke-linecap="round"/><path d="M40 130h12m16 0h13" stroke="#273c4a" stroke-width="6" stroke-linecap="round"/>${female?`<path d="M45 82h30l14 31H31Z" fill="${rank[0]}"/>`:''}<path d="M42 65q18-10 36 0l3 31H39Z" fill="${female?rank[0]:'#fffdf7'}" stroke="#ffffff70"/><path d="M41 69 32 91m47-22 9 22" stroke="${female?rank[0]:'#fffdf7'}" stroke-width="10" stroke-linecap="round"/><circle cx="60" cy="48" r="17" fill="#e9c39f"/><path d="M43 45q0-23 18-22 20 1 17 25-7-1-12-14-9 13-23 11" fill="#3a3035"/><path d="M54 51h1m10 0h1" stroke="#483e3d" stroke-width="3" stroke-linecap="round"/><path d="M56 59q4 3 8 0" fill="none" stroke="#a86f64" stroke-width="2"/>${female?'':`<path d="m60 66-4 8 4 17 4-17Z" fill="${rank[0]}"/>`}<path d="m22 95 21-6 17 6-21 7Z" fill="#edf6fa"/><path d="M26 91V74l23 6v17Z" fill="#355c75"/><path d="M29 89V79l17 4v10Z" fill="#a9d9de"/></svg><span class="fallback-rank" aria-hidden="true">${rank[1]}</span>`;
   b.onclick=()=>{const panel=document.querySelector('#roleInspector');panel.hidden=false;panel.querySelector('h3').textContent=role.name+' · '+role.title;panel.querySelector('p').textContent=role.task;panel.querySelector('small').textContent='Persona của mô hình công khai; không chứng minh người này đang có worker hoặc đang làm việc.';panel.scrollIntoView({block:'nearest',behavior:'auto'});};people.append(b);
  }
 }
}
