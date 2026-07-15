const videos=[
  {id:'pir7vINRg4I',name:'Nguyễn Trịnh Anh',place:'Hà Tĩnh',title:'Thu nhập bình quân 28 triệu đồng/tháng',detail:'Chia sẻ thực tế về công việc và thu nhập của công nhân Nguyễn Trịnh Anh.'},
  {id:'y4wAbHK6AfM',name:'Thanh niên xứ Nghệ',place:'Hà Tĩnh · Quảng Ninh',title:'Thanh niên xứ Nghệ với tình yêu nghề mỏ',detail:'Câu chuyện về sự lựa chọn, gắn bó và tình yêu dành cho nghề mỏ.'},
  {id:'YssP5Azns10',name:'Những người thợ mỏ Hà Tĩnh',place:'Hà Tĩnh · Quảng Ninh',title:'Hành trình an cư, lập nghiệp của những người thợ mỏ',detail:'Từ Hà Tĩnh đến Quảng Ninh xây dựng công việc và cuộc sống ổn định.'},
  {id:'LubWXpbe0g4',name:'Mai Thanh Hà',place:'Hà Tĩnh · Than Mạo Khê',title:'Tấm gương lao động giỏi tại Công ty Than Mạo Khê',detail:'Câu chuyện về tinh thần trách nhiệm và thành tích trong lao động.'}
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
  'https://lh3.googleusercontent.com/pw/AP1GczMJ0rQGzDj5TkRQuAGUSnltAZNZtDmfYlvahVMwYkmBFcN53Y1r09Gp9AZCd-TbqQgC03MK7kbaS8YhcYAuKNPvSExHIe-DQkIG68zKrqgEMrmnP1Q',
  'https://lh3.googleusercontent.com/pw/AP1GczNGBYDi8ShxYjw6FguYYjivXF4G335BZrUkJhxMtS0PIe-7x_PIHoIvwm6MCpVFMEXxAgYFFpkYMVSj7AkZSsx7o-XWZEde5t-pT3SHXXfhD7-HtDWs',
  'https://lh3.googleusercontent.com/pw/AP1GczNhn0QlYqTU2QCQ3LKfCqAw74l3i_RjvqtbHyc8yCvSiV3hU4G4zqDcLET_IXDr2bAds3-KLO3nglGNGTD4uvlNvBhL9GMidgB0vJr1IVTU38qIPbw',
  'https://lh3.googleusercontent.com/pw/AP1GczOPz85ql3MPpzK42QXGqtdNh7pqwiCck-wSSmuH56pNtuq_2IoilZIpFsUR7HTt-rSJ6GXsRatw4Y4fiFmpvMXbRYe7g8vFZu6-r0tJeexyIAC9ccU',
  'https://lh3.googleusercontent.com/pw/AP1GczOv9uiIfifEw5ImLhJp-dNYo_yATCXlKvaYiqNAY5DeLy7X7moONsVHuwkROLPx1YAcxvNQDDwF5cDsvGu8E1bQnog2w_bUkKvbDNZZkuQNZBhQSt8',
  'https://lh3.googleusercontent.com/pw/AP1GczPLJPoeTHBXgvZskBT2gogeaEonOPxIWbwEyF-g1wt1lhDsIwJrk5IUxxo-7KLsax2Ov2qMYBglpwVIpJDo9QZ6_jSnKjRDVAkz5oDcSfEDyq__dRo'
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
  button.innerHTML=`<img src="${source}=w900-no" alt="Bảng lương công nhân Hà Tĩnh ${index+1}" loading="lazy"><span><b>Bảng lương ${String(index+1).padStart(2,'0')}</b><i>Nhấn để phóng to</i></span>`;
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
