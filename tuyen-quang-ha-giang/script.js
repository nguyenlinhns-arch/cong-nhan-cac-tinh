const videos=[
  {id:'l0MFR1SNey8',name:'Gia đình 4 bố con cùng làm mỏ',place:'Tuyên Quang · Than Khe Chàm',title:'Gia đình 4 bố con cùng làm mỏ, thu nhập 28 triệu đồng/tháng',detail:'Câu chuyện đặc biệt của một gia đình cùng gắn bó với nghề mỏ.'},
  {id:'m3tCzqIg_e0',name:'Triệu Văn Phúc',place:'Quang Bình · Hà Giang cũ',title:'Thu nhập trên 400 triệu đồng/năm',detail:'Chia sẻ thực tế về công việc và mức thu nhập cao từ nghề mỏ.'},
  {id:'TGNBuwkIfYw',name:'Hầu A Sự',place:'Na Hang · Tuyên Quang',title:'Thu nhập 20 triệu đồng/tháng từ ngành Mỏ',detail:'Hành trình làm nghề và xây dựng cuộc sống của thợ lò Hầu A Sự.'},
  {id:'o3v5mRAslUc',name:'Cáo Văn Xanh',place:'Hoàng Su Phì · Hà Giang',title:'Người con Hoàng Su Phì thành công trên đất Mỏ',detail:'Câu chuyện lập nghiệp thành công của Cáo Văn Xanh tại Quảng Ninh.'},
  {id:'61tDy8g30_s',name:'Gia đình 3 người làm thợ mỏ',place:'Tuyên Quang · Hà Giang',title:'Nhà có 3 người làm thợ mỏ ngành Than',detail:'Một gia đình nhiều thành viên cùng lựa chọn và gắn bó với ngành Than.'},
  {id:'NpZ93pycl3E',name:'Những người thợ mỏ',place:'Tuyên Quang · Hà Giang',title:'Những người thợ mỏ với lương tháng nghìn đô',detail:'Góc nhìn thực tế về công việc, năng suất và thu nhập của người thợ mỏ.'}
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
  'https://lh3.googleusercontent.com/pw/AP1GczMTC24bsjWTokhAIAoYMrIoMhMGR1u24ET2zt4OUAn5E9sAkLwMdCvoThNuD6y4zicfYmpFhF2TBvZ-zKNC7QJEpYH0Tpthwn9BeEJ6g2Emm8zqOMk',
  'https://lh3.googleusercontent.com/pw/AP1GczNabEZUlB5WayttzhMPXzkWQ47L-JphIvYABlLyr6vkf6aogteUvT4Cdf9sJ67VFxlokgt-oxmEEVnxcCK9ttSEwe3CHoTbWODg93_82BZ0I-0898U',
  'https://lh3.googleusercontent.com/pw/AP1GczOLVhv-gy7w6WC85H394JHmT0IeGGqQcl0BJHgtq0MjWzZf3NJod6S9vzfzLsIhwTxzye2xdB_Qhb18lHWluVqbM6yWsmY83GptmwAvfXEgp47ic5k',
  'https://lh3.googleusercontent.com/pw/AP1GczOM_k0oHRlv5jSzFLe6IQoSTT5bFY7JE5RxgWsj-DyOKQ0QppgYmRc1FhkNk7R6qZELsvjTKCZURPQRm-msysSJ5PzmkXuYEFfiwJJwkuO8F8ya740',
  'https://lh3.googleusercontent.com/pw/AP1GczP2SP32jFTqAGY_hjc27ZFdmL1sHYchFlbjnVYrCNnUTDmPwJSLl32hCqulu4zxFJd_tl4doY9yoPThR_9diTQonaVvQbTtGSPzN1fVkbkg6Wd0dNA',
  'https://lh3.googleusercontent.com/pw/AP1GczP4518bATuWNM4ced6bhVl9Hxwd1AqI_JU3nj0YAiWCETK7OYz8GyZpkii39XXwtTeraYN_-BYR0v6twNuOLhq4KSzKqnfBT0zCKMjZemTCo1CVWD0',
  'https://lh3.googleusercontent.com/pw/AP1GczPBwaeT2ynZBXcTOwDaYiqcqMYOOsb1X7IRBNRD9dOsRQhktvSeCagdLc6Sj2NPW0SR3X_NFopExoALZuk1Ei75QUYKpPXyp7A_ptp-WxQWgVI_te8',
  'https://lh3.googleusercontent.com/pw/AP1GczPJC450tqYRSP9ETL8qLcl52WTDSlAUWi2Goxd34dqUbvx8K6QZBeyn7nYXKw3MMbe56W_Dqio4m31VYlvsOVNDd9-oPpWihccE4N-hD5SZo5wKHNc4',
  'https://lh3.googleusercontent.com/pw/AP1GczPZaZPtapaA0wqLQzckoG_tlFgWn-lILC88iJILWeCujrDHM0FipeM3ePh1JdJAGfcCjKvqAMOuVwp4Z_17oWWjbjRlRzUt0KG88-vaArejo1RRaD0',
  'https://lh3.googleusercontent.com/pw/AP1GczPc5lcJqltSUzrhd3asaN2RD1Cfon4avWRlvRdXVy_9ESl82IRhNCfB4rLU-uWP4o8g2syLyICNppKEhw9cMwzGDX1GmhPFhazQGzSiobdW4nmzgooG'
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
  button.innerHTML=`<img src="${source}=w900-no" alt="Bảng lương công nhân Tuyên Quang và Hà Giang ${index+1}" loading="lazy"><span><b>Bảng lương ${String(index+1).padStart(2,'0')}</b><i>Nhấn để phóng to</i></span>`;
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
