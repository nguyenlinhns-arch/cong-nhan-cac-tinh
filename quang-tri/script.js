const videos=[
  {id:'cpeiTxtJKu4',name:'Hồ Văn Cương',place:'Hướng Hóa · Quảng Trị',title:'Thu nhập bình quân 25–30 triệu đồng/tháng',detail:'Hồ Văn Cương chia sẻ công việc thợ lò tại Công ty Than Vàng Danh.'},
  {id:'fCXQ2TxYl8Q',name:'Nguyễn Quang Thế',place:'Vĩnh Linh · Quảng Trị',title:'Thu nhập cao từ nghề Mỏ',detail:'Câu chuyện lập nghiệp và thu nhập thực tế của công nhân Nguyễn Quang Thế.'}
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
  'https://lh3.googleusercontent.com/pw/AP1GczM8dPrLPhGdcX7XcklL2sukdGvluDLShhHtRPULB0IeUvuvB57uXK32blcwtumNNn7hyQWiUCkfa59NdM9GQQubjUQIObzlYDdOSx-XRRBFv2VuQiM',
  'https://lh3.googleusercontent.com/pw/AP1GczMHfsq0-pVnlStk1yH731E937vWGf-sMHYoS4pBOatgUy9mPUIbQlXpHVPDrnKyQgsr4cOeojIfuDV2bbrdik43nHF-DkVeJoBzQ7_9V0VNx8pmG5E',
  'https://lh3.googleusercontent.com/pw/AP1GczMPMfU0JAlvaUVz_aaGkDmqzQnJv6z6gxJn6-YZHtAYwjus_UVejtY8uCChWi8wHX3YBtdkUVTWzo4hi-sdcj1SPaVJibVN_jXvC11VYtA2mbTe7ZM',
  'https://lh3.googleusercontent.com/pw/AP1GczMdXNsHp2qJ6GB4PXP4gzg0SDqBhkpwE7EPUi8OlskgGp2zmSd3kg6oa1dEDMNJtssKBRvJ05VQiVHkZgkHpli_FMaxAzjjkcDbdIjRHVxtwQBX-PY-',
  'https://lh3.googleusercontent.com/pw/AP1GczN3CMlaKmHwMWLOf9sjrvCPUbqLXurqZLKGmkoCmsJcI-lTW1o5-jlYqMQo0iJAf4uW-wcbFhDY5AQo1x3LfdNcWQPcOFYEFU36J_mo7_DPXFBgmlA',
  'https://lh3.googleusercontent.com/pw/AP1GczNQLoI6j_4wUuPa7X8_dIDZ0z7Q4k6xGzjzfbtSpi3IpkYH4Ku2lHkOGZrRjM1xywobrCWsNLOt64KGTISqbWuSyi7MUVQTgi9Q4GRfMYmOPHcCCeI',
  'https://lh3.googleusercontent.com/pw/AP1GczNbmkTOLmIYTjqX8I80TzQNMZ5p_LsdmW7HN0kOZ0bP0GqsDApU-BwBoHhrAYCkOkwNjjEcKvA5SiVLBjTBM650IBZaPKoKKc8X2J__zjKIFqS-NI8',
  'https://lh3.googleusercontent.com/pw/AP1GczNp5fvB12MF3udRBQMBklyOw299hmmHfhEwakne2qLCtuyAZT7wksDSn9O-Ht6KBQ45X0w0E-q_OvyEeO0CR7lAib8zwkM4ZcfIWNvlXOXjbtJfjMw',
  'https://lh3.googleusercontent.com/pw/AP1GczNwns6vlPfgupFutTt6L7rvP3Ce0L3As0qOO1nB6vwRDBgn88z38v0ldox2IkpvKoseSF2PUShKRZLGfkgb2ilwmnzpVYZ4lEBga704Oq93Ks82tl0',
  'https://lh3.googleusercontent.com/pw/AP1GczO2xjHqfKo4qFfrK-M8nKaJWIPdgM4xl4nE9LuXahHjcdJr6aMH1DTWl9nSQZHjE6EYarfsUByV_encRsIfv1W1waLzlJW-UjbCHGm_ZTjX89baRrLe',
  'https://lh3.googleusercontent.com/pw/AP1GczOR7G0mFyrMyjj0VsYbZSP98t-uP1ZWQe_UubIn7S_zEzsEWfBPaXgVJnUFzXm2EHT62NE5tSf4AlLuwGXSaVVcbsiQS4d5JZi4tykzzbRmykVC0kM',
  'https://lh3.googleusercontent.com/pw/AP1GczOaCKC_hgKuvEgAB9QsN4JXjJlUDZ-VgUHr0gg5muJ0Wvk6UvYlwcBNTpAOhiVPYC3jNtCWreoDC-NRKM2t5xLrXbueGyjdMUL-CTRaAi2OhGh4RlA',
  'https://lh3.googleusercontent.com/pw/AP1GczObUpLvNNfNzur5PXEGbyozrpgIm_69FBixjYt6z2LBQzOn1m3VApsoWLcEcUAmRs0Evr2G10uzwuYPl5kcRYmt6L4XAiQWetwF61w9SJQLRsnWy48',
  'https://lh3.googleusercontent.com/pw/AP1GczPJpNC_EK_MdQ0lJD3D99gRsk419zylqvKG0697gb_TW6-3KEA-apNz7LLuImWhf4HFinQy_Z58pqKfzi_qQqKP7a1bGp1k2RWPPwuMx1TfF7H0Oow',
  'https://lh3.googleusercontent.com/pw/AP1GczP_R3HvNYKVLp9aQTBgH41jTBnE8hWqd1jkiaxfK7hPg-IvphvlD6w44egJLKSEJnA2N4XLlY8jfee1jwO4JQbkCJ2auch3Q1FC8oa55D82PG-X9yU',
  'https://lh3.googleusercontent.com/pw/AP1GczPtK_lnKImfLiVvco7PPDLXzECHA2ez5hDAMbvn8j1r4zNOJz4CF_bshNLr3RmJnOKgeTkROqABi0yvOpc8jiqrLB6IB3aUeFuBG8TsZ8QAuMjwFpY'
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
  button.innerHTML=`<img src="${source}=w900-no" alt="Bảng lương công nhân Quảng Trị ${index+1}" loading="lazy"><span><b>Bảng lương ${String(index+1).padStart(2,'0')}</b><i>Nhấn để phóng to</i></span>`;
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
