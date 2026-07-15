const videos=[
  {id:'F5LkoBtqkII',name:'Hoàng Văn Lực',place:'Chi Lăng · Lạng Sơn',title:'Thu nhập bình quân 26–30 triệu đồng/tháng',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'V8ZX4W6eQ_c',name:'Lý Xuân Đàm',place:'Lạng Sơn',title:'Đổi đời từ nghề Mỏ',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'keCBAgoR9l0',name:'Những người thợ mỏ xứ Lạng',place:'Lạng Sơn · Quảng Ninh',title:'Những người thợ mỏ tiêu biểu đến từ xứ Lạng',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'dv-oxeNiciw',name:'Hoàng Văn Tâm',place:'Lạng Sơn',title:'Người thợ trẻ lao động giỏi, thu nhập cao',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'}
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
  'https://lh3.googleusercontent.com/pw/AP1GczM1DWAIzs7rpk9CwGZPDH0kLAlS_XZv5eAeLwniVF7Wjgg_oeQaaKvi1uDSy-TuFMk6C9-_f43eedEt4tTcB8cgQGUuOXR_pXiMV4empuVIBDr2ghs',
  'https://lh3.googleusercontent.com/pw/AP1GczM9XgMiafGEeTx7ZTtfpgFmlUqYPqv2NBxHDk9erKx_fytpvFNqemnicNzxWJaPNdkXEbplvr5t8Y9nDu1bBbomyBkqYcUZC4w9VIfpv-uvXN4KRSc',
  'https://lh3.googleusercontent.com/pw/AP1GczMPYmF9sByOq5QxUopGiH1tfxDbQQdlb3jWrMQvE1xkWNb0GZQs7v26SwD0PBXCDI9oRq-EpE12-UWLSd4pqyLUCCylySV0spJ4ch_L5yvoSwRViR0',
  'https://lh3.googleusercontent.com/pw/AP1GczMcGoDOAnHmL4WwZLRc-BItLEobJrEmY56jLDqSSRUPyv3jCbdA4JHNdVmQoj8YBRCe7lIE-Ozx9o9iolm7eOuSkIgu9TGMttMU-1MD8oI4Dmc3_gs',
  'https://lh3.googleusercontent.com/pw/AP1GczN6ph9WEj-Pv5hvRt7PGMU0wDjgUB7Pb-7eXIBW7i5XSMQ4h_fy5ym6MDUXTSU2rZUK-g-sFotjlur--8EBGb7aOporiU5bK3juoAvv89s5dSHEWzc',
  'https://lh3.googleusercontent.com/pw/AP1GczNC4LjMMMhB5UV-h0J25Wn2hv74MEOoGFHK6bMGLr3Nt3jwuHGQOEX3a--167NhVYwdJh3mP7azIq9GpxhdfkHLFhOV5YRk-R9w5nBnIGneMC2hM34',
  'https://lh3.googleusercontent.com/pw/AP1GczNY-7Ny-hhynOyH2B6_Xu6qf4cDo9De1yj6h_LsfJTTeZEnNioK2E4J0vzSbzEa9gPMexRSEk1bzlai90P1PkmLgawfiPZMU3ayWMLi9ZefXwYjB0k',
  'https://lh3.googleusercontent.com/pw/AP1GczNgIuTAlp8KA2YschJyyqaDPMcxPnD59wdHb5jPl6tMSJBaMRI-o-13o2E9dEL8m3v_SmGofqb1XMJNCkdCg7ackN-_oQZ7MXo5A2DU3ebhywyf1Tc',
  'https://lh3.googleusercontent.com/pw/AP1GczNh-0axXTYr_t9xACGD7tRPXZ-sWOGTjRQO0OkR2xe4F0QKkMu1QSxRHo-RGQGZeifVnrGnN_hjp_wRERe3PoENOuIFlz79KNMI-0cNCpBpT2NDArM',
  'https://lh3.googleusercontent.com/pw/AP1GczNvx9eQIoNgfqCVtrQefVr3oyvo2Z9jvBTc3flTEHvGW5Swcrp5vZShkUCOMq0vldkbc8uDFcQNt8T4gwAyZmaOooQm6hqUNxuaT0nuzkqlRp4prcI',
  'https://lh3.googleusercontent.com/pw/AP1GczOLAFWluzZDr89p7Rno1PMEH-7q3Ad2iD_qLV46nP9y67monuEtsbcuv3LIADwumsdwLlDTKqRKHh1L2ytYkkyoDL_oNmJsT4Ni-lGjRBPjFJOPwHs',
  'https://lh3.googleusercontent.com/pw/AP1GczOV0IUFUfMAgvES9tBBg0RtBFYwqiSBLcTwq-SUTKOUvuAX4fj_tqgOuhdQG-7MsldSvd59OEMYn9r_1jni3DFLzmIWZZeKagz6vqtark9O4eok5Mo',
  'https://lh3.googleusercontent.com/pw/AP1GczOZYD5MsozAwD4cVAHC8yw1sAiz87j520j_JqZIQEryQYdSqBMNnjx2nXbsd9xDL6UWhkHYibWMcdJ6vpPO3twD0CC7D1g3HHY_ikKLh6wSiCs8ELw',
  'https://lh3.googleusercontent.com/pw/AP1GczOgdnpLmykYAWqM7SEMS0sZuQKgAbfx5wp5xD3UkzKCsWz3QNntdm4jR-Ov9DzZ1jw1SDn57q1Kk5IOW9E1XtAjqOGmf7rQL2JYLjrzW2czMPg35rw',
  'https://lh3.googleusercontent.com/pw/AP1GczOqXRV46lyBV9o1lKZTHyZaH-LxHyKTHGBx9xcSyQ-CzdQJnNIZTdy7gINGPAUh01zyYjFKKEbTDYXVEQe_Nu80Sdso_dQ0aEed2Vgi8RD9_FJoW1k',
  'https://lh3.googleusercontent.com/pw/AP1GczOsa9AgnrmHWHguYIrhnZvHq-ML3V2R82cmVYhl_XZMZF0RrdXDxQU3j1zqPyz2bDifbpF0qgvNzaUC0H9cc2ecRSldcbAC_uRpZJEs7wNGgS6ssPgh',
  'https://lh3.googleusercontent.com/pw/AP1GczPHNb89u1YFTYwBJMNCr8-9i4xg1mSJttxxOGvQVAdZo7nvfCdt5uy_R8L4KiKQN-LLf6B-ceBGkdfiHRI-YQgerFHnFzeDneFOXlYKZvE1zHp-4t8',
  'https://lh3.googleusercontent.com/pw/AP1GczPVlmLfw58R93Vv5FcB55kpVJ-tmpfQw16_HKol7QLHg86zdyf78nqzvdKRZ_6CrJMVJ7w8wjPJLA_Oxg6ARjWbV5-ZqlY3_6JpQR1A9fGXrursLrs'
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
  button.innerHTML=`<img src="${source}=w900-no" alt="Bảng lương công nhân Lạng Sơn ${index+1}" loading="lazy"><span><b>Bảng lương ${String(index+1).padStart(2,'0')}</b><i>Nhấn để phóng to</i></span>`;
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
