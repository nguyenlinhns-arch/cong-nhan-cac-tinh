const videos=[
  {id:'ts41cqu7r9c',name:'Hà Văn Phú',place:'Pù Nhi · Mường Lát',title:'Chàng trai Mường Lát có thu nhập trên 300 triệu đồng/năm',detail:'Câu chuyện lập nghiệp của công nhân Hà Văn Phú, xã Pù Nhi.'},
  {id:'TIDiY-Nuo_4',name:'Lê Đình Dương',place:'Cẩm Vân · Thanh Hóa',title:'Hành trình an cư, lập nghiệp tại vùng đất Mỏ',detail:'Từ quê nhà Thanh Hóa đến cuộc sống ổn định tại Quảng Ninh.'},
  {id:'ZynHtWJvyUs',name:'Lê Xuân Huấn',place:'Lang Chánh · Thanh Hóa',title:'Gắn bó với ngành Than là một quyết định đúng đắn',detail:'Những chia sẻ chân thực sau thời gian làm việc trong ngành Than.'},
  {id:'zViKdr-D1aw',name:'Những người thợ lò Thanh Hóa',place:'Thanh Hóa',title:'Những người thợ lò có thu nhập 300 triệu đồng/năm',detail:'Góc nhìn thực tế về công việc, thu nhập và cuộc sống người thợ mỏ.'},
  {id:'t7ekLxtWRLE',name:'Công nhân Thanh Hóa',place:'Thanh Hóa · Quảng Ninh',title:'An cư, lập nghiệp cùng ngành Than',detail:'Hành trình xây dựng cuộc sống của những người con xứ Thanh.'}
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
  'https://lh3.googleusercontent.com/pw/AP1GczM-prI57BJCqkhQ3dNofLU1jx8x2u-yeyAGlvcUaDdn2-VJ4c5h3f6m_MdnDwcxMcPK8eTTa-GG2sxPa2mQcmdyvHLBKJqyeXfSyViKGhgxZsgeYOE',
  'https://lh3.googleusercontent.com/pw/AP1GczMDNZHf3LoOhn9h8rJg9ktSDxAN8ztmliY1ML-KWSip2cm47DyMuKhPWY1PJPik3-FYN1XJvUsVj2YpKmWYRcdAVJy1rJZIsAs28qzSwKwsFWhtCTE',
  'https://lh3.googleusercontent.com/pw/AP1GczMKHaQ5G4DC4Gy0rcAZWto9l5B9m1fdngA8YE9h-UmUtgbJZ6YbdadyWApLqpK7EgUxNrdlizGESQ6ZFCFCX_kflH6vAwjxmxeMRCT_BhLWxE3dhwQ',
  'https://lh3.googleusercontent.com/pw/AP1GczMKN9MAXpfZSJ63Bp3teKMw1yjv4rppT_bF8IzeUvxzDJDwcOUhWymXoUZznkAizJlTmJpHQRFwL5ad-LnFJtskEBh-woWljJ7We5WvAeYfiarj0KQ',
  'https://lh3.googleusercontent.com/pw/AP1GczMWJ1LS6d8Sn4zUGOd-miLpg1Oh_TwDdZvDagynafG1l1evmKz_yJ0oAxdxGjBLDVX6Lm8rsLAjAx7WWcTNSz8UvzMQEtquuSNCZGRPtILZ_A_b4yk',
  'https://lh3.googleusercontent.com/pw/AP1GczMkynOxFIzBRF1UfIbY0HfoXtb9cYBLEghFF84Hl_lgLpaxNVPjlFI4ZuyWcJr1sZonmB3yH_Q0wZQxwk-s0JRgzqHh_y8g-jxMP43nS_ZTvdstuP-W',
  'https://lh3.googleusercontent.com/pw/AP1GczMvVnr77HAFDXrO80g4I-9X3HMeph_hyHJWR9uPaWf1sgQpRwayL3KQUq2haClb9m2YXfL8sNADWcYieDzTkF__z6R5hZmGUOr1KrpcF6xiYoKKXJ0',
  'https://lh3.googleusercontent.com/pw/AP1GczN36a8IkaI6zCMeS_B2ulwn3aHDwt7rx-Ttg_BFqiRAh5OE23XX2efMvgG92s98QgOijUloiBwz8URwnbbK5jKWfiBHQVKgqNfLCFZHvtxPu_eacAo',
  'https://lh3.googleusercontent.com/pw/AP1GczN6bnVhfqqzdejKdo4k-uyFOnS08vqtvxP5hknb3yzfTGTT95VxN0KQb8zLBybsO3UCk23RsWQfCEVut-mFtJnnYTJLFjnmWpvZzNg1WMphcssy490',
  'https://lh3.googleusercontent.com/pw/AP1GczNHeAbv0Huiez1UcS7Fvl8IVcxs8nzJqSQPvobdCn82KLry1hPY4zmUWIblrDLdZB09bkYjXwy8UD_rRhsYRRiVswmjkQJrE4ArpwVnhGrBUCTBnJ0',
  'https://lh3.googleusercontent.com/pw/AP1GczNVbZFhIu1t_sawfZheeDFtkRbKCXeHktxYQHLwqh57sHfV6E3BAI23X1SWbNxqnfckSbRnInYzQBUQktO0XIW_80dCtQxHGPoLTPaooduVOOKH32M',
  'https://lh3.googleusercontent.com/pw/AP1GczNasY3HbNxgv9nzvdt0MopkZhPb7-X9OMqMGdmzDHK5_z6_6R0dAAKanGelEzplg18gI-0iYaWg8MnAis6vNs9-YBGRx6fAte6m_xjYOKv8xyfjfng',
  'https://lh3.googleusercontent.com/pw/AP1GczNvoecUKERmul-_Q2OCiheAnsLMCaWDTeJZm7jC4pigTf4KlZZIF7rdbyrgF8qzg0dNS5fW15beHbhbiFEFRNT8wfbOPl31ghky_RMClgXhRhSqT3Y',
  'https://lh3.googleusercontent.com/pw/AP1GczOAssh5XOcajtkHvKti0a00Ql9xw_PU0jca03JYN35u74L_n2jBB4PMVS0ZPQ1Q7T9ISRwVS5fZvhE_t8fEN1UDc8sOKKwahAL5G4dw3InGQKRFUD4',
  'https://lh3.googleusercontent.com/pw/AP1GczODW2AkvFCX-H07bUk5xhglYy_6Hel67-6S_wXX14Qr8gs3OVmfiKJTUJxy42j_jCchXdyb4O94j5qaAmeWe227kAVH268brNuii9xRhlTb6bgGoBc',
  'https://lh3.googleusercontent.com/pw/AP1GczOPvSbkqwIHrT3kGvkoSPfxCJn5o1DgiokdyCl4tUOnrkPI0i88Vn4lNUpnPHZ8HBAirX1Hna_tfbWJhUgs8na8TqcpqJ1P7VeI2mgsT5JC661rZtk',
  'https://lh3.googleusercontent.com/pw/AP1GczOT2xFVPdpKDRwUI-2_EmxroAIw2moM5Y9pH1rLFiWOXX6NA8MGXW4dNSSNuE6zVgUMzas_tvxuS93QpvZrubWdCSvjOQ1Ak2gYElHBOOiRPVW-A_E',
  'https://lh3.googleusercontent.com/pw/AP1GczPeB3vXCMnu58cCuCITJsM9pSYNdLmwlvW-45Onoowa5abAOjuiRRzQ80L2kEEBLXVeQy914Um713oZvgm_Jvuc3cEJX8LACM1baEPcVH1pvxhVwcw',
  'https://lh3.googleusercontent.com/pw/AP1GczPu6iiVdtjiS17-Mp3DwZ_2yRdfqg3KfKDAN96XfTDj_pnYxOvXcOHR9HEJaD72Lpb7WAh2Pd5kn4lUOsyHBobw9lOR9aWjV26IqPT_r5T9qMbkQk8',
  'https://lh3.googleusercontent.com/pw/AP1GczPwRVP7xk5PgjUCtWtC5dlaUgYaxHxVxEP5mmvtuJMATf1YH2tuMiwttGH53UW64CUdBiLUXyQze_k5UprHr_n_uNHzge1_JxYOOF1iAuv3qSllLWg',
  'https://lh3.googleusercontent.com/pw/AP1GczPy14uAFFzVePSYRYilXWeFi_Oqroz2t6b2oKRKG4VD-YJgHFpFpvfHgpPVJbpJYi3bpTFMdyz97GPW-DPUnNH4TVqIU4dpRe72MKxfoNlSiFW16R-I'
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
  button.innerHTML=`<img src="${source}=w900-no" alt="Bảng lương công nhân Thanh Hóa ${index+1}" loading="lazy"><span><b>Bảng lương ${String(index+1).padStart(2,'0')}</b><i>Nhấn để phóng to</i></span>`;
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
document.addEventListener('keydown',event=>{
  if(lightbox.hidden)return;
  if(event.key==='Escape')closeSalary();
  if(event.key==='ArrowLeft')openSalary(activeSalary-1);
  if(event.key==='ArrowRight')openSalary(activeSalary+1);
});
