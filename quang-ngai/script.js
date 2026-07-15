const videos=[
  {id:'W6Nx2oLgpA4',name:'Đinh Văn Dũ',place:'Sơn Kỳ · Quảng Ngãi',title:'Chàng trai xứ Quảng và hành trình xa quê lập nghiệp',detail:'Câu chuyện lập nghiệp nơi đất Mỏ của công nhân Đinh Văn Dũ.'},
  {id:'0kWCKhpw5B8',name:'Đinh Văn Ne',place:'Quảng Ngãi · Than Dương Huy',title:'Thu nhập 23–25 triệu đồng/tháng tại Than Dương Huy',detail:'Chia sẻ thực tế về công việc và thu nhập của công nhân Đinh Văn Ne.'}
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
  'https://lh3.googleusercontent.com/pw/AP1GczM3TnwENaP4JLhQU9V_39Nx2D12Vb-sGGOmJ4dk0bw0KBnbRc5cbj8VnFrskGpL7o6aIFjRC7WjJXSYyf6UBJrWCbNLdc6uFh4xpHz_bCkSJbfMvKU',
  'https://lh3.googleusercontent.com/pw/AP1GczM9dxo6DRrSBzU3-in9exOUYq5L5aYn-iXtaEHaCHo1QcLCAMeN5IKQWdai83thK0rya7T_gJ6kiULMfGo9ZKaUHgIq3oz0OO1gN_YxE-UYr2Sz468',
  'https://lh3.googleusercontent.com/pw/AP1GczMG9ntVUA_fbpQcg_bItXdUI9r5sx4cILW1XtPLxXuCNXjcUrH0jzS4Co1YOVmyp-4A9i7jPBLmRUpmOb9uOE6zN12mIbEDiWlMT1jR9ZCrjH6FroM',
  'https://lh3.googleusercontent.com/pw/AP1GczMYkTGz84-kN_uajEUXEbWc5GVbkYY3GvY7EyJYljbemsn44XhYgTFRoEArfUx_dvkSPCN3OZW0xe04nKeQszeseptD0BQ3lErDBJN80Rs_aXmJh22x',
  'https://lh3.googleusercontent.com/pw/AP1GczNFuww6Cb5pjLltsQy3OnFzh-FBSce1eHJvP1d5lvZiZ3EA4veQB_1Liw92QuONG2UvNXDm5FTaIs56ivgeHTOWoiHU5jVYgh2XBsGrcgRlfVAaQ8tE',
  'https://lh3.googleusercontent.com/pw/AP1GczNG3i3PHcSHfhFzdNL9T6avV2X71VCaW4UPqD-QheL9CxFhO4Nk-t301JPP5Tkmkyi69kM_w8Jr8KUxYpQYEdib6jfKfyJgAFRXbMg6SOMpQBC5EtQ',
  'https://lh3.googleusercontent.com/pw/AP1GczNu6XZm_635ZkMX-_V5DvCRPbyRJXnm61pCI1Gr552NoipgSYBESv7zcis1gzaJlyPz7CVOsx2Al1iqHHSaWroDePSpD6mIytXtO7YyHohGVDwTKKs',
  'https://lh3.googleusercontent.com/pw/AP1GczO06yG-q7byzEFoYAcZFIOzRIGdwqMBRw5htD3vkQYgcMFKmVyLSNWkvo6jVTYW3QukPazVJzdNxABGZ32KNRZ-cw2pCHYFM0uSouAHSr_U97tW-OE',
  'https://lh3.googleusercontent.com/pw/AP1GczOV1h1JeRe_ExYnnC60TK-VQJes2LFy3oQakjWHmN2u_R_AN8jNZsaYZVSX9xeKPP_sWrFjdVVkZb2Iu18XmxGDUSJpYkHvx3MTWB1AApBn8YP-cb4',
  'https://lh3.googleusercontent.com/pw/AP1GczOaKJf-Yt6DIGnAaIG2VkEw4Scte-vrYAGsqKLW02U_JFtHJRBNUPlBKumjwrJ9Z_BPDyrSaOJiSpBRqO2jyE9NtGHA91NnV3IRJhQ1sufSyuHIE5w',
  'https://lh3.googleusercontent.com/pw/AP1GczOi4tSwG7fqKiQfZoqK7WToslh1CRjjtn7AqZAxKzJF5in6VteCv0hGoZDI3GeC1neuuiVbTe8a-STwUiNVJ2zKma4HiaM7MYipmpU4J4hJS78Ds_Q',
  'https://lh3.googleusercontent.com/pw/AP1GczOu7xJkxoxp9qL5i6ncRc5zqbc6ZfBWGDYI-NFwND4IYCCmXVE56wXFhsURrQXm_NVRX1xaAQaUcjcToJZKPssgYIwELl1v2LigzrcS6omo0FRd4fs',
  'https://lh3.googleusercontent.com/pw/AP1GczOxLVH3odPc4ZDATXgBAelDOxV9AtYQgSwJvoiPHrP3PFHWCGkRjKSj0MZnG0fe0UW2InC2CTo3JWysot6MmRXnZCFp397dIavwQGS-c8Rx0pjPjUk',
  'https://lh3.googleusercontent.com/pw/AP1GczP1h1Aiuheeuvd5W5-KJpBorKaBev2VRTgDQ6paeA5PUkOCSjhFFds405ywV-9zfVFotTX9aRo4Qep1dezwZHLNzWUqNLrGjbYvQYXDt_Vvrww3C5w',
  'https://lh3.googleusercontent.com/pw/AP1GczP2pJL6rweni1wzUqNSTNUyOdEQkS9EfrSmY1369ZwDaQhaJvfYNuHOK_x6M1-mImP2XzAkWfBpCf9kw30VGcYe3j9Rcn9rxkv_x_KkFQXnY-dyaxg',
  'https://lh3.googleusercontent.com/pw/AP1GczPOysEVdaUi2Pqe06qqqjeGvKFl--VYdZtq7Ek34IdHpbmv-pExAIvRW_VKZ1xPAUERtOSUDeRKdEZps7NsIpa-SsFvX5tLmuhUcZgdCR-VZeiTcDI',
  'https://lh3.googleusercontent.com/pw/AP1GczPYt6LhpiO44YGQnmc_L6BZ_P66Oki5BPBrpv-1d3N9gG7n4_ffsHNfJYSINCdLyFrtBDQgn1YxoclCaCscMhGy5O-ggjOuI_AZiRHoNCdtzZ1alMQ',
  'https://lh3.googleusercontent.com/pw/AP1GczPZLvxXoAbX0T3VVbswJWPJDXWcLvUch5MPnDgIRDucNvR6gqy2Hr4Mv6C2VaLVuMRRRp-ejznIlEpI-_eJnFKA2bWbv21P5xc73mK8X0jro4t1yEnh',
  'https://lh3.googleusercontent.com/pw/AP1GczPbzBS0F83of66az_DZ8xEINKVGyxvDe8i1ggoDRKBf6wdzrN6juwfpsGmLiaVetfHTTSojZipyPguFbkKUUENAZAV88skp03HHgHy5ZnOWvEPjd_M',
  'https://lh3.googleusercontent.com/pw/AP1GczPfw9-MhJfY0Iwq287wWbnOjlM52jSbM7LhpKuE2LUjohVBny8GIZMIZT62bWg8QJEoaKTm798c2Rl-_Ci00LfH18c68kAEIb6Ta0G0swnmCssUNcM',
  'https://lh3.googleusercontent.com/pw/AP1GczPnUGYRhRQw5y7PQlCYXUInFlZeBCfegTGnorLWyYK1LKKRuDwppJ82n9oH-vkrvAbOm93Oda-aBfV2sadTWYUiW9nOX5KZhZhcohuldo-eE4H1Zzk'
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
  button.innerHTML=`<img src="${source}=w900-no" alt="Bảng lương công nhân Quảng Ngãi ${index+1}" loading="lazy"><span><b>Bảng lương ${String(index+1).padStart(2,'0')}</b><i>Nhấn để phóng to</i></span>`;
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
