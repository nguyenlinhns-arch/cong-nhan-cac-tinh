const videos=[
  {id:'h4zuijHumME',name:'Lầu A Súa',place:'Sơn La · Than Hạ Long',title:'Thu nhập 28 triệu đồng/tháng tại Than Hạ Long',detail:'Chia sẻ thực tế về công việc và thu nhập của thợ lò Lầu A Súa.'},
  {id:'Hg_SuunbnDI',name:'Phàn A Chính',place:'Bắc Yên · Sơn La',title:'Chọn ngành Mỏ để mở lối tương lai',detail:'Hành trình lựa chọn nghề nghiệp và xây dựng tương lai của Phàn A Chính.'},
  {id:'FCzojc0oimo',name:'Những thanh niên Sơn La',place:'Sơn La · Quảng Ninh',title:'Lập nghiệp thành công trên vùng đất Mỏ',detail:'Những câu chuyện thực tế về công việc và cuộc sống của thanh niên Sơn La.'},
  {id:'PA_ELy8KxOo',name:'Đảng viên trẻ người Mông',place:'Sơn La',title:'Trưởng thành từ ngành Mỏ',detail:'Câu chuyện về quá trình rèn luyện, phấn đấu và trưởng thành trong ngành Mỏ.'},
  {id:'10qr_Z0WkXM',name:'Vàng A Gơ',place:'Sơn La · Than Hạ Long',title:'Người thợ lò thu nhập cao tại Than Hạ Long',detail:'Chia sẻ chân thực về công việc, thu nhập và sự gắn bó với nghề.'}
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
  'https://lh3.googleusercontent.com/pw/AP1GczM9u0Y0woSlJK7KaZ37LQlKKZwNqQ130WBLW2gZ9grMsqgbUdx5cppfPjXaQrIJLp49MnJ3SQABlE8vlEkM9mPE13F4weDOx_PPAY4gjJOy_rvYkA0',
  'https://lh3.googleusercontent.com/pw/AP1GczMA6yPF84V8gpPdnYxMY9EUaPX5tlVt0uhfDXKJrLVfDF4C3Mf4Ywum__8C1iyblE9JadNofZr0Jk3JAxc8HrhZIszUSm-ocNrBFSbujfnLzN6x-kI',
  'https://lh3.googleusercontent.com/pw/AP1GczMYI5RIwUNl72YpsOUV6fL-5Z_GHOqsDpIIdyhXvpey0EdwJY5AaVckIiJZ4UXYiuZ0I6qUPcklLbMkNR-ar7lYv8ndvpkHGM5oFNgsqCIcEOXiA7ad',
  'https://lh3.googleusercontent.com/pw/AP1GczN6zK9ZOxtXmRRp-2E1iViJooBjA0Oh7M_MZYxKtGqgi8j8G8iX8jTHSuv7eVYkqgObj5AqcpR45v1Yrr8JocISheGfONWbjKJRpT63cJ1BAkw6oOWq',
  'https://lh3.googleusercontent.com/pw/AP1GczNWQFBpUENwT5TcCnPgsbyY1LlGYU-rRYmgCEXjhf2UAvmR7JkiiI1-BUfbOGimVd5rMCs3etbyv0FgufzrqYqIawmpx1DDVTm6WOD7zjDm_MG52nI',
  'https://lh3.googleusercontent.com/pw/AP1GczNoVLWor8jozcm862mpIAVpewIwR8O3ruey-Rcuq6xNlN258o247cEP6vtnga1XaYQSU3dwYTOeQYWmfjxuoPCgeRZKR3irClO_8MHbx6XuwGjRmQU',
  'https://lh3.googleusercontent.com/pw/AP1GczNz2333mUO1kA2Yjenu2lqloRMQPCTY05fcMvlu8qIrBY3RiQSBPKd-BNOWXRzMUCW5ptZ8xzc5dyQ0wuZvZyA_J4nwYn422et3hsgK3qP-Hn6bh7E',
  'https://lh3.googleusercontent.com/pw/AP1GczOGpr0yCjyD8umrHcKWMaZjgPbsum_JY8Lym3OIwmavkr3BS3K3LEZ_hAQ1pqOCdah77xTi9VbkbbG4izVWh3J_aEDDVjX4AYJaC6aU0v1-1_ho-oU',
  'https://lh3.googleusercontent.com/pw/AP1GczOHWEAabztS-nfcxRvJKcn-9G3rmtX8hPvb5Bmc-yBPqs6liEmomufgS0KFbxv2PkzxLX2yhceglaK8RwI1RCiv7ubkMIlKqkM3ym1E4QU93wmhZ0g',
  'https://lh3.googleusercontent.com/pw/AP1GczOhHf7v7kGwDm18TXtuWYZgndrEQ6NhruVl237cec8N53zEV3AarZHjy5T4XyoZ03AMUq-LTaF5DoN7f52ZvrPbKonT-lo7jB0af8-fm5QFQE7LqPQ',
  'https://lh3.googleusercontent.com/pw/AP1GczOl0Q1tWzrO7XicHQzOXuDTL0H80_rMo5nmYAbi5_OA3bFOUN1s46Tnon18h2YmMGk9VuYOiafTdb7s2Cd6lJ5Bdc7kezodDQdfw2T0z3YEbKjnRZk',
  'https://lh3.googleusercontent.com/pw/AP1GczOsiHIkcfCqz6X_X5km_Yb3XDHpiR0HReZr_jX1u52pylpJSvK_u0l5ut7t-rdMEgOhGkWxacQdZrMXkHdFVB0wPoB319JKhmfMiAMPPwVG5bLI8A4',
  'https://lh3.googleusercontent.com/pw/AP1GczOsm0vUEUXlU_5R9qKEfhYgzDc1yZgsyz2UNGaDnZBvTiSZXp_w09F1Z89bLuRXfof74DFU8SSdGCvG0FoRAA7FbOgaQ8qy08mAd7ln6H3bz_sJhYg',
  'https://lh3.googleusercontent.com/pw/AP1GczPFk5CoFphT9jshPRWQH_B6RQHYNPvAY0A-zPoQGbaoQ5uJQa5iqSKEHaVnye3rMtAshNVrHivBZwn3R7SUq-m1_ZSCLH18xPybc7IXdMVb86iIqZU',
  'https://lh3.googleusercontent.com/pw/AP1GczPbYijbZAhh289avZOYpwVXdPHvodv6WJkDiLsB1Yq2T6VOWa7liYAI1BMrRPo_8E3r1cuPhB_VIKEHZeOn9VljlpZkn6n76lVZKkyDkcxS19Xnv8I',
  'https://lh3.googleusercontent.com/pw/AP1GczPo9c97xU1s7job-eYzdKZtxezhBf-By-aGOI6Cun-fyZoMUd9l2FxaBoAN0YNnpHKXkQylmcG-5GxtYaXspjGQMAQ73S4MyDjBjQGlym_612wpzCUX',
  'https://lh3.googleusercontent.com/pw/AP1GczPzYwKqqIvm_Xpq9IVVEdZfnntGb-vEImgyewmRLheVrXmWcS-1gqWCeFaxDcnXGDaSj_yda6ZdkfdQcDAcWOFcS3_ife5xKIBmtNT3Pumo0-T_CT4'
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
  button.innerHTML=`<img src="${source}=w900-no" alt="Bảng lương công nhân Sơn La ${index+1}" loading="lazy"><span><b>Bảng lương ${String(index+1).padStart(2,'0')}</b><i>Nhấn để phóng to</i></span>`;
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
