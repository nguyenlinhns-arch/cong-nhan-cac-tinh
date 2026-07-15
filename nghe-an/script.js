const videos=[
  {id:'uPLUcoFN1cU',name:'Nguyễn Văn Thái',place:'Anh Sơn · Nghệ An',title:'Thợ lò Anh Sơn thu nhập bình quân 28 triệu đồng/tháng',detail:'Nguyễn Văn Thái chia sẻ công việc tại Công ty Than Hòn Gai.'},
  {id:'hO1oZWlUB3M',name:'Lê Văn Bình',place:'Bình Minh · Nghệ An',title:'Lập nghiệp thành công trên vùng đất Mỏ',detail:'Hành trình xây dựng công việc và cuộc sống ổn định tại Quảng Ninh.'},
  {id:'uuaVHEbDFtA',name:'Nguyễn Thiện Nam',place:'Nghệ An · Than Dương Huy',title:'Người thợ lò gương mẫu tại Than Dương Huy',detail:'Chia sẻ chân thực về tinh thần làm việc và sự gắn bó với nghề mỏ.'},
  {id:'pDJXUAIy2Is',name:'Những người thợ lò xứ Nghệ',place:'Nghệ An · Quảng Ninh',title:'Chuyện về những người thợ lò xứ Nghệ',detail:'Những câu chuyện thực tế về công việc, thu nhập và cuộc sống.'},
  {id:'Llb-PeTVhuY',name:'Trương Công Đông',place:'Nghệ An',title:'Người thợ lò của những sáng kiến',detail:'Câu chuyện về tinh thần cải tiến và sáng tạo trong lao động.'}
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
  'https://lh3.googleusercontent.com/pw/AP1GczM63HYWZ7YcOorBXOZxZmXbOHHlzNJMilbrV9e5Q8cAg1F68aaHTdS0mhH2vrcTQgyl03FjeEGPtFuJOZIWBVrbIpoupXIDAVjaPG5GH7mEPXs6FOg',
  'https://lh3.googleusercontent.com/pw/AP1GczM9AS-AmNRKKSm_3SwjgdbHakLvuAHNRrnld7afDojPXUk1Ghl4TsF5siigkK4fJsauVOKuPZmePTWsLrL7rLp-9-caikT6Nqhkt_hbD8xZaiAbA4Q',
  'https://lh3.googleusercontent.com/pw/AP1GczMOTixs1E0i-FEexm07bLQIV6UH0y02ibkSWWsUpJ-0Xd_pCScf15Z2KIdh9P3l0BFQe3s5Jy2H4SepHKtzKR_RiumpCL5fPo25y7TqBl5p7CQbyH0',
  'https://lh3.googleusercontent.com/pw/AP1GczMQMEgsKB4H8Np6Gh67syaVuCHEfLOBWab0oqbQLBcwBvVQ56cWv2PB4FXvHOAMHrHcdOELjRvopz0rMMRk91hEnorX1gP3P8DZeGrjyqFEy8i3aU0',
  'https://lh3.googleusercontent.com/pw/AP1GczMZZW1x_OFVMQPUom2x6glImH46SC_ZCSjw3SbloQPe0VA8pkZrMesF-1GRSCnX72ukA7kAvcn8FOQnN-X6FzAZC4ckIKzSfmVLHfLzghW-wZ_CkXw',
  'https://lh3.googleusercontent.com/pw/AP1GczMd6KRqlWAccPNEoWKplAbDjaC5OeTX98xi8jVGH6Kcfu4W0cGmfeuhQEOjubqDiQaLr0riGnp-bI5iMjXg2a7eE2oWkLNtbW6f3dDQL1O6zw00bqc',
  'https://lh3.googleusercontent.com/pw/AP1GczMtaz7Nv84fKepWlGh6W-pz70DsnvA48YoBwqT-wz1-S9VRvr4bzFzZAOCIKD0brD8xsA5TGtj_mJbyCf0qn5Xq9clzEu1WYIoLj-oO_z7kZg0sVqTy',
  'https://lh3.googleusercontent.com/pw/AP1GczNC8XoePkDULL4eYCgPP-Z51UuiOu3mt7rfKRclZqGPnY8_4MmKyU4-MYeUqJ0Px64E1-0QUSRnzmy5UoSnvQP8VO1ztf4SNpbnoKP-2gzhH8BIwzc',
  'https://lh3.googleusercontent.com/pw/AP1GczNFJx6EkEvuJMu_-EQpvQAVq3OLOCThPcnG-uBnYAfBM-5GydbhPyYZ6G-01P40d5L56fS9PKFIePO3lCDyunbLUjjbmZOp7rnhTi0PLj2u2moje1Q',
  'https://lh3.googleusercontent.com/pw/AP1GczNdTORMriyRG8rA-URoCx34AK6a0VQVWWePT5bZ8xpy21-4fnWDePlzv859wKV-QHp5Y-uE70nV3llICCjQwftXH93uQFBemdC7K6G8562DUK_pQvQ',
  'https://lh3.googleusercontent.com/pw/AP1GczNmcfB2k16SFUnspliVRQ84Hqcasr7uUzQqQjpzdY3JxHNNFtdrogoBis4FnD1L0hP8GTBg_RWU7XA4FWRlRJS2j__3TlPbmLKktuM2xtKj-RUrV00',
  'https://lh3.googleusercontent.com/pw/AP1GczNw_h162Z3BLv_W56xBxdaazX3w9WG7s2yBI674_H5lJW2z95OxvO6bG0i9rxoGoEixAAw6I-Z_H80shFREdViaSsi_wQLdQh4f7J5TuN9QiElR-ldu',
  'https://lh3.googleusercontent.com/pw/AP1GczO8gg8fpfu5st7k3i5rc_HIXiX0O-W_TLLcdQ2_6lXVt6tM3ZxrzbJWj53qGsQZCJTtHXaoOvM4VV1CSQh2RvSIuZfNiZDS8fDrHRzJL6RUCWHgv38',
  'https://lh3.googleusercontent.com/pw/AP1GczOZadwszzAbA9_uPGSZSuZJlYyIJ3rLXiGRvewJtZXSAm2TFfAh5IkOdMTcVL3hi-u94b6Jv3BmXg2Ga5kNjQesfJLDeNwM00hjBMbDiaKFbfKHRd0',
  'https://lh3.googleusercontent.com/pw/AP1GczOm1J9ErphhjQxcBHaIQ-9X5h7FI5_JOLsB1aDjGxddR4NbIGGERkJHFaUDXKunEMCgG7adP1WC-HQlUpKuXIGkYKR5NkcnhXGQrZRk-ub97tYSX6A',
  'https://lh3.googleusercontent.com/pw/AP1GczP1-P2SG-4KsFTlVK1VGwT2qj37vN6RCFz6VIdxWtlILl-hKABGjVPE-JNCb6eTfmElclBGofANybs004U70xTOocb4OBdbBcGF3ntKV_Kg3sf79Ec',
  'https://lh3.googleusercontent.com/pw/AP1GczPBsof6WnPGlAnuj2EVH62n6OhHV-I2ATW6JsYscQjGjKciA_hoVdUWpgWa83GlqSBF9vkEmF4mKVkAQXpY25KXAhvR0eldzFGIMaH1CTrXVq3u-i0',
  'https://lh3.googleusercontent.com/pw/AP1GczPcIg59UhHgKtxtYHfhJ7gm7mMdjVlxhiStvcFAFeNwc-EXcbQMAmPu20Zq2eLjOxUDnX9MaWLfQDR1gAWzKTC0k2uu3Z2g6rcOkRYVj0G6iyB7aBo'
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
  button.innerHTML=`<img src="${source}=w900-no" alt="Bảng lương công nhân Nghệ An ${index+1}" loading="lazy"><span><b>Bảng lương ${String(index+1).padStart(2,'0')}</b><i>Nhấn để phóng to</i></span>`;
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
