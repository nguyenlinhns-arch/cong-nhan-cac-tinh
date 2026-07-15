const videos=[
  {id:'xW92UBKmWok',name:'Mùa A Vàng',place:'Tủa Thàng · Điện Biên',title:'Hành trình đổi đời tại vùng mỏ Quảng Ninh',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'MNgZQRkHUdA',name:'Sùng A Khứ',place:'Điện Biên · Than Hòn Gai',title:'Người thợ lò thu nhập cao của Than Hòn Gai',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'aXXdRBflopk',name:'Những người thợ lò Điện Biên',place:'Điện Biên · Quảng Ninh',title:'Những người thợ lò đổi đời trên đất Mỏ',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'AFMr1_gAybo',name:'Công nhân Điện Biên',place:'Điện Biên · Quảng Ninh',title:'Hành trình an cư, lập nghiệp của người thợ mỏ',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'}
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
  'https://lh3.googleusercontent.com/pw/AP1GczM37_ykNtbl5rCpMs7hGEYq0PwkKV6CWFWR2_a5pt3IYrGMAvnYQ3WU3pH_E-Vp6LcYGCWz8QpHYi9wevxBsLvpoOe72odH3NYIn9a-pkUW4R-NtJQ',
  'https://lh3.googleusercontent.com/pw/AP1GczMdBqpYYGtJE5TZesqZOLqnrtQUsm9M_jGY9zHdmBBukst8ZvuKakfkUmztYjG-xb5jWmWQMJC39RayD1u00OCp_OlPlHPCGhs7WnTC9BPWokHw3Sc',
  'https://lh3.googleusercontent.com/pw/AP1GczMqt8pY2cLSI5h839IFKBGPKZMxzRcnV03BMkvzoO4_Ckoh4OttLUGPDcQHz1ufacNkdTvc8BtVlyUUKFGCReJvqIx0nYgsDiwIU4ncDu0wZ17EpRU',
  'https://lh3.googleusercontent.com/pw/AP1GczNCElpah6RUiFIu9Ca8gpB4p77yg5pxaKLNpHCb3VVcFTybRnbNPTILD7UuX9haepHHjtTIVpXfzl5FmXVdG_3fEje56_c-1dGdOjdrCeTxfXFjHSw',
  'https://lh3.googleusercontent.com/pw/AP1GczNP1Irtm6GiIULYb64HlNhFaUF9L8kwk7j75HAR6F8sZ6tQZBU7GZiF26G5_TzlgoUoByj8ivs0xjiz36HWkK0MsuvZIaMiIeHOQubJ31Jnkg7zaB4',
  'https://lh3.googleusercontent.com/pw/AP1GczNm8PqQmH4T0dxQNaV5QQv2hlGbIjjfV_WkW21GlndLrUE8nS9MajXuIuEKsJ7DeWe4U6-F7FwI5pQAvXbtnwRuPvCEZWs-zSVlGrS_-ZzHisDAURg',
  'https://lh3.googleusercontent.com/pw/AP1GczNp-L-i6JZfTvVRczBCwQIYhE7Jcfs7Ynso8pF4yvse8MhUfcCoPuip9HRgfbvCUaY_vpKDIAA7x6Kqcygjnx1sEESfROPotN9iA5o4twCUNJ_dkrCz',
  'https://lh3.googleusercontent.com/pw/AP1GczO_gXBlrYg8Wge5U2mB38xUmi2i5Az5Zn0iVlt2IAa661evB8HyUB6WtXFdlScu66A_tDJKuYg6XsKxba5zPQsvTJ3PlztuVMuFVaU8gjtdJ28JUNk',
  'https://lh3.googleusercontent.com/pw/AP1GczOd4e7Xfj8opNmBNOlCIicPHFSb9U9Q8Ez5djV5PWwzTFNX3NAmt47vYRwreffQPiuuF0dE90hZFAKFOT3F-0k37i2DwEJNke47Nl9_zpkZBjyOsMk',
  'https://lh3.googleusercontent.com/pw/AP1GczP6IC_9LzAFlRH023-o04aN2e8uAiHuD5bqGRPKPMFGYwYRskwaTWJBC9OmCbWkxAjiG8BZv4FJ3mEJM-Fy9qvwvCZsu7WcmIBoKwT62cPB8m4kMmY'
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
  button.innerHTML=`<img src="${source}=w900-no" alt="Bảng lương công nhân Điện Biên ${index+1}" loading="lazy"><span><b>Bảng lương ${String(index+1).padStart(2,'0')}</b><i>Nhấn để phóng to</i></span>`;
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
