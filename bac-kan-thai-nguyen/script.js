const videos=[
  {id:'RIbTaxJpcW8',name:'Triệu Văn Hào',place:'Thái Nguyên',title:'Người thợ lò tiêu biểu đến từ Thái Nguyên',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'3niMyQ6c0vw',name:'Thợ lò Thái Nguyên',place:'Thái Nguyên · Quảng Ninh',title:'Làm giàu trên đất Mỏ',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'KJz_6MbaaW0',name:'Thợ lò 9x',place:'Thái Nguyên',title:'Câu chuyện thợ lò 9x ở Thái Nguyên',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'BN7NHpHFE40',name:'Lao động trẻ Bắc Kạn',place:'Bắc Kạn',title:'Làm giàu từ nghề Mỏ',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'rRpEtbOaCQs',name:'Lý Văn Kính',place:'Bắc Kạn',title:'Chàng thợ lò nhiều hoài bão',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'}
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
  'https://lh3.googleusercontent.com/pw/AP1GczMFsqn5TtrXQy3ryPbPtR4iiFy3l6hZ_x02ffg7l2d8pXmFzCNasyyAI7e28OwFWYJqd68vWmuw2CsnOf3c3v0d0yAZUKrMNVMhCaehC1Yhjrvhuac',
  'https://lh3.googleusercontent.com/pw/AP1GczMXZ7_we9DvNgqcPTqD_V_G10We3DQgIOJS5DqtFcwY3x32eQt9VSZPZFuWYSjmQh74tvwRh-u8ACwF6g6OXHV3FXbYe9NZYEM0MPxFsLKhV78zPZc',
  'https://lh3.googleusercontent.com/pw/AP1GczNQJ3E08HJsFgXpj6ecwCDaMgoWXyjIUYo0phbdQoWMN_tuEfV1kU4akuQZWxSplMHyanHH8dnHzCnAy1tFghFHeb48-MLtZUHU4u96zcEIEWmQ20I',
  'https://lh3.googleusercontent.com/pw/AP1GczNaebrJBB_8Z25eOIU5PCsTJo94XbIDU8wI9i-nl1gtIcdzxoGOIYM8VLFfMu_ngZV_qDfooVp_AcXhbl_i7xRhst43k4GywtPnBcolnhuVWMY7OyI',
  'https://lh3.googleusercontent.com/pw/AP1GczNeItTZIX60uLzydcHGGszE6GH1Luhaq44jFdy8TEpmMZXyh8ViX9kMrN2E0Md7U7vsuzWDYU_yKaxhbPKYCXoJfqYiZ1ylzVEJLJJQWUL1097NQF8',
  'https://lh3.googleusercontent.com/pw/AP1GczOg2lmk_jbM30bqRIDkQghGPjqAfL3SrHgsBQK_B5_nUVg1iIPsjg07fId4yPYXKWqo-9HgfqGJ5Odl-40Psc13epgkIYtMwnWT0bGeQmuLd6AEORNV',
  'https://lh3.googleusercontent.com/pw/AP1GczOzBs6fA4J8H9aMp55MQ4V8ZlFTh62Ps_trOWUZphZoo0XncgJxSkVhW4M7HqrWg5PkXvFK409Nw7R_LnZvNVQ2Shh2HleLHmQfj-0x5tPGyOtLDa0',
  'https://lh3.googleusercontent.com/pw/AP1GczPjjJtrJ9UGtFHMMESDJUOTlnU5goOJb2Rvn8Tmr9400aOCHNr9Wy2tAW-q7x9IGuwNV9BIYP8OoBWWwSuf9ZIfeviVcM94hBh3AoHHOoM1JjCs6cQ',
  'https://lh3.googleusercontent.com/pw/AP1GczPk0x83g09fOHusFpovHkqbMkV-XViPDMc5RYzK109wDJ06l5LXdiQH7JpriXsMefeku9_aiw1XibHq6XiRT94IQ_ZeGQ8RyFehyXuTbLYBnx48wpY',
  'https://lh3.googleusercontent.com/pw/AP1GczMJuokhYTibNi7Ecgk8KiUnVpYLedNG0KI1I5o83e46ACWiJ2hFPwFT_MCRqwFvW_6Hpbm2-13Bm11niOfMjXpZFVfRx5E1Vl7WceC19BS376YG3FA',
  'https://lh3.googleusercontent.com/pw/AP1GczMpEaCZ7ii1KG-KcbhnOgd_o88-vdvPXvfA-acQKXn-IynBr4iG5l23fyZvkp8uzuQJOwGcx9g02wqt5yMAPpo6J9olqRDFaiA5HOZLjfLmXL3NQGU',
  'https://lh3.googleusercontent.com/pw/AP1GczNOv5GJoI5ykMpAdwAYJ8jLgmlsRMmrrxdX0D6saSYbGZahxTpPdO1vJiGOF8j2jjxVcn-ASqEz2IVIV3rkacj-c18LpJ_T_pAs1rUNYQrBD6bld64',
  'https://lh3.googleusercontent.com/pw/AP1GczNUqkNARTc4GpA0lwJMKodGJYt4efpBKV1XYGClgIVTsDHnlX840iElri_9QCit_Wh_ts1zeyWfRVexD-ammGvi0E8cD3GR1L_z1KpLeLewws-VABQ',
  'https://lh3.googleusercontent.com/pw/AP1GczOXO-7e57mrj4NB1i1-vg-bWrJbJHhZRrUF0ywbn8Edxff42WNBCBnI0d-DWenCuuhqpIn7W-3DSONqYJEc-ZJPkG3BsLQSbHlBzwhxparaxFzT6U8',
  'https://lh3.googleusercontent.com/pw/AP1GczP3YYGjpae0dVBzsQ_ustNb5UywU7St-gpSOUssSDbppQkVY9nDNQg5ihKzf6_0sIPzBO76kMYbVHG9DKAk6V6wRfoVym-3Y9S7f1iIvY8OOCD2nwM',
  'https://lh3.googleusercontent.com/pw/AP1GczP6Vw-5ejO7yJMVLLyluUYW8Inojse2iF90eBTBH8AC9yCqYmzAF89y4xMAVX0oXwXvqWQt5FSPlfAn6waAe7jFItGUZfBmixSeIEaQn6GQgpeKuRk',
  'https://lh3.googleusercontent.com/pw/AP1GczPqz8I2XgQ3nwQkCy_opXUA7xGgATgZ1_OIZ2fcwkxzpWIpfggcGhDnkIYx3eS87bTecGrPZ-i3aeYqb7Kra34V_UVO4iXAAHwIOD908xCs9idC0Nw'
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
  button.innerHTML=`<img src="${source}=w900-no" alt="Bảng lương công nhân Bắc Kạn · Thái Nguyên ${index+1}" loading="lazy"><span><b>Bảng lương ${String(index+1).padStart(2,'0')}</b><i>Nhấn để phóng to</i></span>`;
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
