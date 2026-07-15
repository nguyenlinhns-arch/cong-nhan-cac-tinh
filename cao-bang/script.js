const videos=[
  {id:'Y5skQm8A1ho',name:'Dương Văn Lực',place:'Cao Bằng · Than Núi Béo',title:'Thu nhập 30 triệu đồng/tháng tại Than Núi Béo',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'Wx2OhVo93yI',name:'Ngô Minh Hải',place:'Hòa An · Cao Bằng',title:'Chàng Phó quản đốc người H’Mông',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'HEbRzOni6eM',name:'Lý A Chí',place:'Cao Bằng',title:'Chàng thợ lò trẻ đến từ Cao Bằng',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'VvpPTEejkAY',name:'Phùng Vần Và',place:'Bảo Lạc · Cao Bằng',title:'Thu nhập cao từ việc chọn đúng ngành nghề',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'zToUqyT8sOo',name:'Những người thợ mỏ Cao Bằng',place:'Cao Bằng · Quảng Ninh',title:'Những người thợ mỏ thu nhập cao đến từ Cao Bằng',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'}
];
const list=document.getElementById('video-list');
function selectVideo(video,button){
  document.getElementById('player').src=`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`;
  document.getElementById('video-title').textContent=video.title;
  document.getElementById('video-detail').textContent=video.detail;
  document.querySelectorAll('.video-card').forEach(item=>item.classList.remove('active'));
  button.classList.add('active');
  document.querySelector('.player-wrap').scrollIntoView({behavior:'smooth',block:'center'});
}
videos.forEach((video,index)=>{
  const button=document.createElement('button');
  button.className=`video-card${index===0?' active':''}`;
  button.type='button';
  button.setAttribute('aria-label',`Xem video ${video.title}`);
  button.innerHTML=`<span class="thumb" style="background-image:url('https://i.ytimg.com/vi/${video.id}/hqdefault.jpg')"></span><span class="card-copy"><small>${video.place}</small><strong>${video.name}</strong><span>${video.detail}</span></span>`;
  button.addEventListener('click',()=>selectVideo(video,button));
  list.appendChild(button);
});

const salaryImages=[
  'https://lh3.googleusercontent.com/pw/AP1GczMI4S_NNfpj8URlVo0z1DnAhJV6HiqtTL6Qvc4McmRG6o6Kgc-IgOdZxHI0eCJExCCPucgWf-yXJ7fdhge1PlxZRz5GTMm2Im1pZjYWhNDlYxe47n8',
  'https://lh3.googleusercontent.com/pw/AP1GczM_ae16LEYu0b0Y4Yh2_aaMQyisEceBID5PMhk9YbBfwZSkzMaKneSlTgGyQzbYUgxCtMyGFrKYaM7bKBgMdJPoNNIQ9u1y7SGMf6NJLuXC-wn0hVA',
  'https://lh3.googleusercontent.com/pw/AP1GczM_lXrh-NFHwIjSuWy9lHXKGbb4Vx0Ys-ZAO0YgZpGO_DCYwvIuamOV-FjTZHKxBBBTYihlQJ6V0zI4TrU3BmBfuZveYnzNHps8bHWiSJ_61AkuLmo',
  'https://lh3.googleusercontent.com/pw/AP1GczNEv7slSLGiAo3FqhSEgUPB1TAg0aWoJiLY8o0I1w2DJQEg4hlpBu3pfzifIkD-R8TB1MUra74ZdeGqxti7t2zT9gTf4GKZwlJvZPZ_EfkO_FutCBs',
  'https://lh3.googleusercontent.com/pw/AP1GczNNhhNVAZidN7Y84lLGHcOMAUFkeWaru5REkl6ke3J4_MBvhc79n6fcel6GwMBrUcy_97hG1J5B7sau2sdKbHSJjcEyDc7SODvconwOC8CZ6G-nvhUO',
  'https://lh3.googleusercontent.com/pw/AP1GczNtfM-s6XwYzc-PaIR7FFLq8JdPU7AhYHVKM5JUGu2r7zLe2c-YrIrDuvpCttIjFqV2eqOXwXxfsvIQM_6hvDdP6gixzoS2nIwB4S6jEyexNToLVcU',
  'https://lh3.googleusercontent.com/pw/AP1GczO3EoX6eavI5RVneQts_HeoxgIKVLY7l0HURKHK136i-WF6smvyDvswldLIRtNhei6MN70WdXZCkJLOp5m-232GeG8KKa9fz1zpUnyn9EqGWObVR3o',
  'https://lh3.googleusercontent.com/pw/AP1GczO6OoAVzugiACRobl_Tf76iUo8wvfjHz2eqdWR6M_NCovPSRMRSG83yVUwTz8HYoJ7c_9fkx1e9xIOHlXP0n7Wp5VEdgnLrCbDPx_gMeyzOzM_zrdY',
  'https://lh3.googleusercontent.com/pw/AP1GczOUkd5GDmt288vYCDmAlk_Uh656YFUcY1PBpcDrTY2-4wDqaFuON8FbOfSZVDVpCYKDD3hrvYaBfCP8dIn884EkTJUFrsFNmoCWR20O5M4tItFsJbw',
  'https://lh3.googleusercontent.com/pw/AP1GczOgXXkhjTIQNl222iL7ayKPtXRUD8k-4Fa-ic_DAZG13neE_eAPDQmNnNZY_NdFx_6GlTsnxbboTw5DUaAv7BilE-8i_tUEKwb0Mxh2xGFjSCgH7h4',
  'https://lh3.googleusercontent.com/pw/AP1GczOt5x7t85c3aC7DFmhwvWQN8YXVqthaMOW_oxE6SrPbY7K2qpwkzOgntCyfBQ3H7Hgrvxqk3M0r2i-tjYZ9AwecU7Ms4vfiKJ_vXJD5DJBMpcS8LNs',
  'https://lh3.googleusercontent.com/pw/AP1GczOxdVGAakhPfNO6L3WRLHPyNlbXV2HcENT24RZCcbTlAatLXdu1JoZpkG2iaNS1YLupDncp_3oyKoVFMS3GLES7DijZbhguyrM5IG4RCmDEsSN3Jv8',
  'https://lh3.googleusercontent.com/pw/AP1GczP2tuLTigmiJNAOJcIvuFnjSz6etIQQLa5hdJ4rkavgmZ1JSxhQMnWtvGqCQs1_WDeAP7YMjkiJfefovzZFuzlN-jAeC8Uca_uRqNwjTGZeuLSUUwo',
  'https://lh3.googleusercontent.com/pw/AP1GczPJONSUeZEzaaZjdEptufRKRW3ax_UYaRMxaeo0pLcWSWvzjDcCWMyWkKQLJj94GK0Ra-4Yl42Hjuybr9zeH5et8E-LKl3g1eB2K_k-xYLB20t8-a8',
  'https://lh3.googleusercontent.com/pw/AP1GczPL641B7BXTSUPNpuicy12U3h4nnHi0bfHxk9jJNTzB5sfbb2JUh1Pz7VgMW4NFyxJQs1KyfCFTQcP0YyTgNo9aIv7Dupa1hhGZ-BL6KFkJaLaU0M8',
  'https://lh3.googleusercontent.com/pw/AP1GczPZwxhzSei2vPPjkgETWZ_iRT__aYzgOCpC5KRDxGo7N9oj_f8Ds0ejDiUUPt38i2rdia5w1_i0yJ3oGy17L8HennD8o7a9RFfWFU8O5jc72F3tGiU',
  'https://lh3.googleusercontent.com/pw/AP1GczPr4aeIcsgOE6DOHPbkkAcDJKQLkBB53eSSYDGZ5UdCqQiKpyYXGo4123Lk40KKvtjdLQYit9f08oz70nz7RMCxYKIi97DCs2SXMaKUyL99kk_PrjM',
  'https://lh3.googleusercontent.com/pw/AP1GczPrax9uMkcOWjKx42-EsWcNUNhMeE6gJR-IqnW09-RqcBgK3ljc4nLvJFTiExtKRZCfKAxj8KZIrE5icHRRh_bovYata_N-Y6WGTQxKRoq0Jocm0KE'
];
const salaryTrack=document.getElementById('salary-track');
const lightbox=document.getElementById('salary-lightbox');
const lightboxImage=document.getElementById('lightbox-image');
const lightboxCaption=document.getElementById('lightbox-caption');
let activeSalary=0;

salaryImages.forEach((source,index)=>{
  const button=document.createElement('button');
  button.className='salary-card';
  button.type='button';
  button.setAttribute('aria-label',`Phóng to bảng lương ${index+1}`);
  button.innerHTML=`<img src="${source}=w900-no" alt="Bảng lương công nhân Cao Bằng ${index+1}" loading="lazy"><span><b>Bảng lương ${String(index+1).padStart(2,'0')}</b><i>Nhấn để phóng to</i></span>`;
  button.addEventListener('click',()=>openSalary(index));
  salaryTrack.appendChild(button);
});
document.getElementById('salary-count').textContent=salaryImages.length;
document.getElementById('salary-prev').addEventListener('click',()=>salaryTrack.scrollBy({left:-salaryTrack.clientWidth*.8,behavior:'smooth'}));
document.getElementById('salary-next').addEventListener('click',()=>salaryTrack.scrollBy({left:salaryTrack.clientWidth*.8,behavior:'smooth'}));

function openSalary(index){
  activeSalary=(index+salaryImages.length)%salaryImages.length;
  lightboxImage.src=`${salaryImages[activeSalary]}=w1800-no`;
  lightboxCaption.textContent=`Bảng lương ${activeSalary+1} / ${salaryImages.length}`;
  lightbox.hidden=false;
  document.body.classList.add('modal-open');
  document.getElementById('lightbox-close').focus();
}
function closeSalary(){lightbox.hidden=true;document.body.classList.remove('modal-open');}
document.getElementById('lightbox-close').addEventListener('click',closeSalary);
document.getElementById('lightbox-prev').addEventListener('click',()=>openSalary(activeSalary-1));
document.getElementById('lightbox-next').addEventListener('click',()=>openSalary(activeSalary+1));
lightbox.addEventListener('click',event=>{if(event.target===lightbox)closeSalary();});
let lightboxTouchStart=0;
lightbox.addEventListener('touchstart',event=>{lightboxTouchStart=event.changedTouches[0].clientX;},{passive:true});
lightbox.addEventListener('touchend',event=>{
  const distance=event.changedTouches[0].clientX-lightboxTouchStart;
  if(Math.abs(distance)>55)openSalary(activeSalary+(distance<0?1:-1));
},{passive:true});
document.addEventListener('keydown',event=>{
  if(lightbox.hidden)return;
  if(event.key==='Escape')closeSalary();
  if(event.key==='ArrowLeft')openSalary(activeSalary-1);
  if(event.key==='ArrowRight')openSalary(activeSalary+1);
});
