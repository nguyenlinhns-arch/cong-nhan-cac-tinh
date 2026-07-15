const videos=[
  {id:'DafkstceRgk',name:'Vàng A Chinh',place:'Lào Cai · Than Vàng Danh',title:'Thu nhập 20–22 triệu đồng/tháng',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'gJ5E1JkUS8c',name:'Hoàng Trọng Khiêm',place:'Nghĩa Đô · Lào Cai',title:'Hiện thực hóa ước mơ an cư lạc nghiệp',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'H9sdBcb3rzc',name:'Hoàng Văn Toan',place:'Lào Cai',title:'Thoát nghèo nhờ theo nghề mỏ',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'},
  {id:'p4ZCzuIiXYo',name:'Thanh niên Lào Cai',place:'Lào Cai · Quảng Ninh',title:'Thanh niên Lào Cai với tình yêu nghề mỏ',detail:'Câu chuyện thực tế về công việc, thu nhập và hành trình lập nghiệp.'}
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
  'https://lh3.googleusercontent.com/pw/AP1GczMYGl4Ib1loWt5hloK0NwEAoVF_nCOqOeZlekQa2Q0Wf8VD2o1FXBw-i74t05wh4arAKNa-rM-ybY3X_Hx-OiiksGw7VBaExnBpahMLk1BfD_zs2HM',
  'https://lh3.googleusercontent.com/pw/AP1GczMYbzLYv2dZj5emUL_PJJXNUHYsgQGW_retF5OHuDshhHsOYSVseVmwF5jkH3QFcVDAQ2yDdIYbD2fHqz7OoZO_s_YRU01zDtiXoMUaRMYnoJYS574',
  'https://lh3.googleusercontent.com/pw/AP1GczMYi3H0ezgGbFf-_PNHscbIPNOJQ34w-bcZZgj6DPYF9lO21VRpRN9pxrgLVDTJW2shXasfhvM-ST7bCgdqLrhxkzzUPuDD8-nUfWr4BG1O7FFc7Tw',
  'https://lh3.googleusercontent.com/pw/AP1GczMhBZBx5-176-EGYAfWtSjjXpUjxUoLzl5EBkMKsrjj-CRPp19ByYwc4FX0gTfrApOwTm8R8ArqdGcbh5smlpNfmphV6lfCiglf24Q6hElXihKG8Lc',
  'https://lh3.googleusercontent.com/pw/AP1GczND3rdewy9pyQPE7SWJXZecwv8SCxpwKHOeCrB62343XVt1GR2HI4Tzs37IqevfFRgiQ1ylrTkehuvruvc-iZG7i-FB4rKVNfeilbO-TQpNqljmZlA',
  'https://lh3.googleusercontent.com/pw/AP1GczNMp5hZojkBfZujUD1TVQGc2oHnsL1INxHt-PBb-95Y-eftuOytw37o5g6CvHhQrQ1w-vV1kqi_TPsZUUZzt8TGmD6PUUNmBbgZrc-uuyn0_9JgZEY',
  'https://lh3.googleusercontent.com/pw/AP1GczNrjq5ciUMj-LJoJr76dXINa7R6dVCEc42ao1P8v2x9E-5rLaILDUbQAnhNWqmFOZG76HTTosLv0HTKWTj-khYayReCfaGgVMJt_TY4tscztp-M1_k',
  'https://lh3.googleusercontent.com/pw/AP1GczNuO_mQo72sEDLm6o_n13y0l16Nl0VG-eRMlCjj4ic2HKcJGt_CrK7gmkD2sPWUwfNAP8A8WDscvmcB9uGIZmI5t1tkkbRmx0YO92SfL0QYPfnZTeU',
  'https://lh3.googleusercontent.com/pw/AP1GczNyketOkSWZ7MSzTsFubtb-C1gJ6gItr_xqaZNjx-Gvy7ajiFrpQ4KSu2tXhlseeFPDENRSPISiZWQ99XIy7_Ro7C14wdRvp2vd90B5zq0-QGvO-lM',
  'https://lh3.googleusercontent.com/pw/AP1GczO2PGQ4mywZCRei7OPyA1siS6wifwtC6hmhkLkkA83OiqutbU5hxJ0YMlgadrMprFdSztSPtA4QVGhjOnPU3LP2GTTr2gZq5LJbWjv9-CKi_WJZje8',
  'https://lh3.googleusercontent.com/pw/AP1GczO8wxAzYMaB_e0m_ueej52IoeJSjESlHz2k-QZ_7usZ1V3NzMDr3cQE_Xjw-5pzBCKk3OzbYIYyeIWRybK6L5KjOS0H-MKgsERXrw171oTHtqrdfjw',
  'https://lh3.googleusercontent.com/pw/AP1GczOMTIsrIQ48BuML6E5yQ1k71SNf2BRURtptayaN2RXaYizqwWsgODDt77LRvDK1syAV3sjysqmIweoSG2iJ5NHbfLIZamCNAx-VMg_ak_xB880xpS0',
  'https://lh3.googleusercontent.com/pw/AP1GczONoDQOyyJAg0di5iNcnhKl2hvfSEJqOsqOGJMh7FGezkiPUF6cObl-Cpvr9PlkqrPn1j-Vz0FvSrJp6T_GPebosbP_glwkmtnR0yw6DSjcKnotDb4',
  'https://lh3.googleusercontent.com/pw/AP1GczOi4_ZgdLnqfEUoJRHDshju9mb5h9G3yH32L8NHyGd9CQMPm65tWEWiKquVj9RinCWSMZDlQ2wwdlLuT7cwkfiIy1t7gVLU2nNVHVawGNcWtwxKCLQ',
  'https://lh3.googleusercontent.com/pw/AP1GczOkjWeT4qi01-_3ijEdA5fdyALlA2F9-h4DjWiD6LjToUxjtp8hWVOXrwoL_tDSHtsbmwmanC1qNeD1iAf70a0WyfitHq7fs23r7-u64TU1smQnI-ii',
  'https://lh3.googleusercontent.com/pw/AP1GczOo5XAiTxDsQwdHVIpLPQcfvHHVAZ7i7MLSZL_htjL-G5O8bO4FvskXt4JRVJ0RoEZDuVChNmYU55N4gpLWxdm07F3Uu5dWdjm-5JuH11_vSraM78vv',
  'https://lh3.googleusercontent.com/pw/AP1GczOvlpNRQyeg6webkDVEfGZto44XQKGSHhnW5iBwRVSD5ay7tFsRGnXTa375BFjAO1BZCCOBrHxaerYElZdVUjAY81DMMpyb3j90YapnP3TsgP4zCNM',
  'https://lh3.googleusercontent.com/pw/AP1GczPiGb0b41BGlnWuUfoeMbOtbXfxlVTjqlAvZyejIRn9wVoiG0BCkXX75BHcJisYlWTdVI1qX0FyKITAKQPtq4f5o_WYKmXOyMvGCAaKB0ynZlkBGjg',
  'https://lh3.googleusercontent.com/pw/AP1GczPvmGOYv6JMcPlByiUiT5R2TLAGrwCxscSKl4xmnEAyNIzNt58uE5s_HhX--dVqx6u_8BtDXeaoEcvcWUuAsEp54GJQnV66JB1V0ZQn7vSQItXFQxw'
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
  button.innerHTML=`<img src="${source}=w900-no" alt="Bảng lương công nhân Lào Cai ${index+1}" loading="lazy"><span><b>Bảng lương ${String(index+1).padStart(2,'0')}</b><i>Nhấn để phóng to</i></span>`;
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
