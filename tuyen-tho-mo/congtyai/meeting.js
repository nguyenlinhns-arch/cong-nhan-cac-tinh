// Structure only. An authenticated service must establish participants and provenance.
// This completeness result never authorizes or executes a task.
export function meetingGate({jobId,revision,participantSetVerified=false,required=[],opinions=[]}={}){
 if(typeof jobId!=='string'||!jobId.trim()||!Number.isInteger(revision)||revision<1||!Array.isArray(required)||!Array.isArray(opinions)||participantSetVerified!==true||!required.some(name=>typeof name==='string'&&name.trim()&&!['Quyên','Khôi'].includes(name)))return {state:'HOLD',missing:[],reason:'Chưa có công việc và phiên bản được xác minh',mayExecute:false};
 const participants=[...new Set(['Quyên','Khôi',...required.filter(x=>typeof x==='string'&&x.trim())])];
 const idOwners=new Map(),conflicts=new Set();for(const o of opinions){if(o&&typeof o.id==='string'){if(idOwners.has(o.id)&&idOwners.get(o.id)!==o.person)conflicts.add(o.id);else idOwners.set(o.id,o.person);}}
 const received=new Set();for(const opinion of opinions){if(opinion&&!conflicts.has(opinion.id)&&opinion.jobId===jobId&&opinion.revision===revision&&participants.includes(opinion.person)&&opinion.verified===true&&typeof opinion.sourceRef==='string'&&opinion.sourceRef.trim()&&typeof opinion.id==='string'&&opinion.id.trim()&&typeof opinion.comment==='string'&&opinion.comment.trim())received.add(opinion.person);}
 const missing=participants.filter(name=>!received.has(name));return {state:missing.length?'HOLD':'READY_FOR_QUYEN',missing,reason:missing.length?'Thiếu ý kiến đúng phiên bản của thành viên bắt buộc':'Đủ ý kiến để Quyên kiểm tra; chưa phải quyết định CEO',mayExecute:false};
}
