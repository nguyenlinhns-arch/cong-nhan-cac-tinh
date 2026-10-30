// Explicit sample fixtures only. No real task identifiers, live records or receipts.
export const demoRoute=['Đào','Quyên','Kiên','Ngọc Lan','Khuê','Quyên','Đào'];
export function createDemoLedger(session='demo-1'){
 const events=[],ids=new Set();
 return {events,append(event){
  if(!event||typeof event!=='object')throw new Error('Missing demo event');
  if(ids.has(event.id))return false;
  const i=events.length;
  if(i>=demoRoute.length-1||event.id!==`${session}-${i+1}`||event.from!==demoRoute[i]||event.to!==demoRoute[i+1]||event.job!=='DEMO-001')throw new Error('Invalid demo handoff sequence');
  const expected=makeDemoEvent(session,i);
  if(Object.keys(event).sort().join(',')!==Object.keys(expected).sort().join(',')||Object.keys(expected).some(k=>event[k]!==expected[k]))throw new Error('Demo fixture fields cannot become live data');
  ids.add(event.id);events.push(Object.freeze({...event}));return true;
 }};
}
export function makeDemoEvent(session,index){return {id:`${session}-${index+1}`,job:'DEMO-001',from:demoRoute[index],to:demoRoute[index+1],stage:['Giao đề bài mẫu','Kiểm quy trình mẫu','Bàn giao công đoạn mẫu','Nộp bản mẫu để kiểm định','Chuyển kết quả kiểm mẫu','Trình CEO mẫu'][index],evidence:'Tham chiếu minh họa, không có tệp công việc thật',qa:index<4?'Chưa kiểm định · DEMO':'Kết quả kiểm giả lập · DEMO',mode:'DEMO_ONLY'};}
