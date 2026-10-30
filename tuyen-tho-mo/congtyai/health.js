// Public display contract only. No monitoring client or operational authority.
// Future authenticated adapter must verify source evidence before setting verified.
// 60 seconds is a proposed display freshness threshold, not a monitoring SLA.
export function officeHealth(evidence=null,now=Date.now()){
 const unknown={state:'UNKNOWN',label:'Chưa kết nối dữ liệu PC',detail:'Chưa có nguồn giám sát được xác thực. Lần thấy cuối: chưa có dữ liệu.',allowOperationalAnimation:false,ageMs:null};
 if(!evidence||evidence.verified!==true||!['pc-agent','network-monitor','auth-gateway'].includes(evidence.source)||!Number.isFinite(evidence.observedAt)||evidence.observedAt>now)return unknown;
 const ageMs=now-evidence.observedAt;if(ageMs>60000)return {...unknown,label:evidence.previouslyConnected===true?'Văn phòng mất kết nối, đang xác minh':'Chưa kết nối dữ liệu PC',detail:'Bằng chứng đã cũ; đang xác minh lại. Lần thấy cuối cách đây '+Math.floor(ageMs/1000)+' giây.',ageMs};
 const base={ageMs,allowOperationalAnimation:false,detail:'Nguồn: '+evidence.source+' · quan sát cách đây '+Math.floor(ageMs/1000)+' giây.'};
 if(evidence.source==='auth-gateway'&&['DENIED','CSRF_REJECTED',401,403].includes(evidence.status))return {...base,state:'CONTROL_BLOCKED',label:'Điều khiển bị chặn — cần xác minh quyền',detail:base.detail+' Không kết luận mất mạng hoặc mất điện.'};
 if(evidence.source==='pc-agent'&&evidence.status==='POWER_OFF_CONFIRMED')return {...base,state:'POWER_OFF',label:'Văn phòng mất điện',detail:base.detail+' PC được xác nhận đã tắt; tên cảnh báo là ẩn dụ văn phòng, không kết luận mất điện lưới.'};
 if(evidence.source==='network-monitor'&&evidence.status==='OFFLINE_CONFIRMED')return {...base,state:'NETWORK_LOST',label:'Văn phòng mất mạng'};
 if(evidence.source==='network-monitor'&&evidence.status==='DEGRADED_CONFIRMED')return {...base,state:'NETWORK_DEGRADED',label:'Văn phòng mất mạng',detail:base.detail+' Kết nối suy giảm; không khẳng định mất toàn bộ mạng.'};
 if(evidence.source==='pc-agent'&&evidence.status==='READY_CONFIRMED')return {...base,state:'READY',label:'Văn phòng có kết nối đã xác minh',allowOperationalAnimation:true};
 return unknown;
}
