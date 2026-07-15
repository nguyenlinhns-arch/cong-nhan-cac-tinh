const videos=[
  {id:'XNMQwM_5fyI',name:'Mùa A Sinh',place:'Mường Kim · Lai Châu',title:'Thu nhập 25–27 triệu đồng/tháng tại Than Thống Nhất',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'LWFm2ZfPvq0',name:'Cứ A Lử',place:'Lai Châu',title:'Chàng trai H’Mông và tình yêu vùng Mỏ',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'HDs7h_EEf-Y',name:'Công nhân Nậm Cuổi',place:'Lai Châu · Quảng Ninh',title:'Hành trình lập nghiệp trên vùng đất Mỏ',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'pumVxfhCFaY',name:'Phàn A Cảnh',place:'Lai Châu',title:'Nghề mỏ – hướng đi tích cực cho thanh niên vùng cao',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'eGX_ToQ4LJ8',name:'Lù A Tinh',place:'Tam Đường · Lai Châu',title:'Người thợ lò xã Sơn Bình ở vùng đất Mỏ',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'}
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
  'https://lh3.googleusercontent.com/pw/AP1GczMO61czRVlUlpLhn8tFw9qJA84evm0SkzjuvQgjfDP3R3f0VJ5PMtQ9idEuJnYiQ-4CXb11dQqnt_GTXJQWJYN--mSnxk8QC6DfvFii5l8PdUhH7M8B',
  'https://lh3.googleusercontent.com/pw/AP1GczMfupRyMt9VqsZEUzaHGO0RvLgl7ca4WQ02k3p1kEWbun79NzKxxXmeoXLIEYdAliz30L55_dZNGsy3k0n4sorcOZoZmdljaIeim-l8cXO3JX0R8C0',
  'https://lh3.googleusercontent.com/pw/AP1GczMtdEKwQvv7AX0ld8_e4wNKc3O7RshI4OVigKzU9hXSYyEHzXp42bXN90ASX3aDGfL1kuc_lsR8w-4R1jlDL3d4kHBALo6M1UDbKi0ZIOCUwXDv2Q0',
  'https://lh3.googleusercontent.com/pw/AP1GczMwKKRWDcPHQfhJIigXG6_yVLDPnvZoSqh3AUTu5LMLhnY-kjuX4E0chdzb1nXlBx6LFEHTZwSO3jnhLnK_7eSOPEzKHGLqyjcWqZoezFIuAj0C-Cc',
  'https://lh3.googleusercontent.com/pw/AP1GczMxUjssneDesmtSwJp0i9kadjrBBlgXJabtijAQNrjoPcIaamZAY4uiBSy7b8OLmoei3rDwY0CEuDQ88oIfFBRP15FjXFNxYL7T0aJjWJXg3TRx1KM',
  'https://lh3.googleusercontent.com/pw/AP1GczMz2bPl2cxiORZUmYUK_Zu9_wgRLYOlR2TtXirV6szTGs3axwLqlNUksY2DrkV9iqdsxL83WThk9LpqPru_fATQWWJxEmLwQ2xf0a_6K3kkPeQk-YU',
  'https://lh3.googleusercontent.com/pw/AP1GczNKqumcC6n2PVIPq1yHNQ2hSZ3B7iDodbl0f4x34PhngAf3qAawvaRcdFAbMmugXFHT2y1oGjvyC46NLkNP62Rsn4hP43-j4nekkzxGL-ZuROglLoQ',
  'https://lh3.googleusercontent.com/pw/AP1GczNmyIXbOjVxvXjkFSrIdbJieI1aHYkup-aMjbsQYlXFTaTnMKHsg910pdksfzDubGr0LTLKW-UPNYe7cV4u64ZAwV2iOBr6aYMyLtQhDxkO__oS30c',
  'https://lh3.googleusercontent.com/pw/AP1GczOEtMUTDvpc6nA1ZC-JGSyi8ULOoZ0BzKjA6L3_qVlWbY_OlHg5QDPK-Etr4mKSCDqmautThs-TSnzgYfN58hLIYrTrXssQVH3yuQsIKvK8hEnGbKg',
  'https://lh3.googleusercontent.com/pw/AP1GczOI-0hh5bfaLgAsMBUHyYLzytHmWiAWXUkeJiIdmJDf0hqyDIs9GgWVgahUvCDHAFYBFAxRNheSMLn-_8l3iTAgGZ2udtQ5DzU14pKDcJIjmIcnDCA',
  'https://lh3.googleusercontent.com/pw/AP1GczOKIK5RordwWYONYAqPc6oI_-v0XvflBgw3V5rhydI3V2csSjg0t0gKtzaZZx66_sp4TXOQBrw21QQOyD78YC6XFdKxURsv3AVyQdSZ_ugRx8y09HVB',
  'https://lh3.googleusercontent.com/pw/AP1GczOlseNkd6nY1dtJLOySt6q95NoNx3JInmVzau7gLIaLNHYXFid4z9rQv9ijU3Q0BUSLPjqc-5tOhsB9coG9-tdBJZ4gsWNbAvr1aNqpMyu0Ngj4_kU',
  'https://lh3.googleusercontent.com/pw/AP1GczOrvDlnE_LISIUwtYwevL8RapQ02PjBPD14EYvlFG9n3mz_r8Z1SqZ8Stm0BINa8-zArnTteAaL6XxqG9nS3DYzc8VMDrxrraaE6LpgeSvsPCxsK9M',
  'https://lh3.googleusercontent.com/pw/AP1GczOvtC9g3Uhy6CR_vsPBunfIIctODDS9z2Bg18PORKiCI_ME1dG9FL27CagKI5Fzu3LlXg9RC34bmUDjnxf4cW0oS23ioouP_u4eHlCvUQmq8dzfWDQ',
  'https://lh3.googleusercontent.com/pw/AP1GczOzVMGq4C3azcG09pWNAQ2fnhC55NVr0NPu5D_fN08i2YMWI88fIjgeLfoRkKNmtCX2Bio6sIQGKdl-8ZcEfj9CVjE_8XSfnz0_tmhpQ8RgOzPYmCw'
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
  button.innerHTML=`<img src="${source}=w900-no" alt="Bảng lương công nhân Lai Châu ${index+1}" loading="lazy"><span><b>Bảng lương ${String(index+1).padStart(2,'0')}</b><i>Nhấn để phóng to</i></span>`;
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
