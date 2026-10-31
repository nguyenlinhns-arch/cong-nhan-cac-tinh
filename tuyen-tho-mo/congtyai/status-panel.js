import {parsePrivateSnapshot,refreshPrivateSnapshotAge,MAX_SNAPSHOT_BYTES} from './private-snapshot.js';
import {projectStatus,exampleStatus} from './status-model.js';
export function mountStatusPanel(root){
  if(!root)return;
  let projection=projectStatus(), scope='ALL', generation=0;
  const input=root.querySelector('[data-status-import]');
  const rows=root.querySelector('[data-status-rows]'), message=root.querySelector('[data-status-message]');
  function render(){
    root.querySelector('[data-status-mode]').textContent=projection.label;
    const visible=projection.rows.filter(r=>scope==='ALL'||r.scope===scope);
    message.textContent=projection.mode==='DISCONNECTED'?'Chưa kết nối nguồn riêng có xác thực. Không suy ra rằng nhân viên không làm việc.':projection.mode==='PRIVATE_LOCAL_SNAPSHOT'?`Snapshot do người dùng cung cấp, cập nhật ${projection.generatedAt}; nguồn khai báo: ${projection.sourceLabel}. Chưa xác thực độc lập, không LIVE; chỉ ở bộ nhớ tab này.`:'Đang xem tình huống mẫu, không có lệnh PC, tài khoản hoặc nhật ký thật.';
    rows.replaceChildren();
    if(!visible.length){const p=document.createElement('p');p.className='status-empty';p.textContent=projection.mode==='DISCONNECTED'?'Chưa có biên nhận để hiển thị.':'Không có hàng trong nhóm này.';rows.append(p);}
    for(const r of visible){
      const card=document.createElement('article');card.className='status-card';card.dataset.state=r.state;
      const badge=document.createElement('span');badge.className='status-badge';badge.textContent=r.scope+' · '+r.label;card.append(badge);
      if(r.freshness==='STALE'){const s=document.createElement('strong');s.className='status-stale';s.textContent='BẰNG CHỨNG ĐÃ CŨ — cần xác minh lại';card.append(s);}
      const h=document.createElement('h3');h.textContent=r.stage;card.append(h);
      const owner=document.createElement('p');owner.textContent='Phụ trách: '+r.owner;card.append(owner);
      const next=document.createElement('p');next.textContent='Bước tiếp: '+r.next;card.append(next);
      const d=document.createElement('details'), summary=document.createElement('summary');summary.textContent=projection.mode==='PRIVATE_LOCAL_SNAPSHOT'?'Nguồn và thời điểm tự khai báo':'Nguồn và thời điểm minh họa';d.append(summary);
      const dl=document.createElement('dl');for(const [k,v] of [['Sự kiện',r.eventAt],['Quan sát',r.observedAt],['Báo cáo',r.reportedAt],['Biên nhận',r.evidenceRef],['QA',r.qa],['Độ mới',r.freshness]]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v??'Chưa có';dl.append(dt,dd);}d.append(dl);card.append(d);rows.append(card);
    }
    root.querySelector('[data-status-count]').textContent=projection.mode==='SYNTHETIC'?`${visible.length} hàng mẫu`:projection.mode==='PRIVATE_LOCAL_SNAPSHOT'?`${visible.length} hàng snapshot riêng · chưa xác thực`:'Chưa có số liệu thật';
  }
  root.querySelector('[data-status-demo]').addEventListener('click',()=>{generation++;input.value='';projection=projectStatus(exampleStatus());render();});
  root.querySelector('[data-status-clear]').addEventListener('click',()=>{generation++;input.value='';scope='ALL';root.querySelector('[data-status-scope]').value='ALL';projection=projectStatus();render();});
  root.querySelector('[data-status-scope]').addEventListener('change',e=>{scope=e.target.value;render();});
  input.addEventListener('cancel',()=>{input.value='';});
  input.addEventListener('change',async()=>{
    const token=++generation;const file=input.files?.[0];input.value='';
    projection=projectStatus();render();if(!file)return;
    try{if(file.size>MAX_SNAPSHOT_BYTES)throw Error('SNAPSHOT_SIZE_INVALID');const next=parsePrivateSnapshot(await file.text());if(token!==generation)return;projection=next;render();}
    catch{if(token!==generation)return;projection=projectStatus();render();message.textContent='Không nhập được: chỉ nhận JSON snapshot đúng schema, tối đa 256 KB/100 hàng, nguồn và thời điểm hợp lệ. Không giữ dữ liệu của tệp lỗi.';}
  });
  const refreshAge=()=>{if(projection.mode==='PRIVATE_LOCAL_SNAPSHOT'){projection=refreshPrivateSnapshotAge(projection);render();}};
  let ageTimer=setInterval(()=>{if(!document.hidden)refreshAge();},30000);
  document.addEventListener?.('visibilitychange',()=>{if(!document.hidden)refreshAge();});
  window.addEventListener('pageshow',()=>{if(ageTimer===null)ageTimer=setInterval(()=>{if(!document.hidden)refreshAge();},30000);});
  window.addEventListener('pagehide',()=>{generation++;input.value='';projection=projectStatus();render();clearInterval(ageTimer);ageTimer=null;});
  render();
}
