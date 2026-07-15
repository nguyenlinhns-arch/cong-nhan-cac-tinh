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
