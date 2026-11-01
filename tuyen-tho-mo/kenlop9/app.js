'use strict';
/* ken-revision-app-v1. All bank text is rendered through textContent. */
const C=globalThis.KenCore;
const GROUPS=[['Ngữ văn',['Ngữ văn']],['Toán',['Toán']],['Tiếng Anh',['Tiếng Anh']],['Lịch sử và Địa lí',['Lịch sử','Địa lí']],['Khoa học tự nhiên',['KHTN - Vật lí','KHTN - Hóa học','KHTN - Sinh học']],['Tin học',['Tin học']],['Công nghệ',['Công nghệ']],['GDCD',['GDCD']]];
const $=id=>document.getElementById(id);
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
let bank=[],version='',session=null,saved=null,group='',storage=null;
try{storage=window.localStorage;}catch{}
function notice(text){$('notice').textContent=text;}
function persist(){saved=session;if(!storage||!C.save(storage,version,session))notice('Không lưu được trên trình duyệt này. Bạn vẫn có thể làm bài; tải lại trang sẽ mất tiến độ.');}
function filtered(){const parts=GROUPS.find(g=>g[0]===group)?.[1];return bank.filter(q=>(!parts||parts.includes(q.subject))&&(!$('component').value||q.subject===$('component').value)&&(!$('topic').value||q.topic===$('topic').value));}
function fillSelect(node,values,placeholder){node.replaceChildren();const all=el('option',placeholder);all.value='';node.append(all);for(const v of values){const o=el('option',v);o.value=v;node.append(o);}}
function topics(){const parts=GROUPS.find(g=>g[0]===group)?.[1];fillSelect($('topic'),[...new Set(bank.filter(q=>(!parts||parts.includes(q.subject))&&(!$('component').value||q.subject===$('component').value)).map(q=>q.topic))],'Tất cả chủ đề');selection();}
function selection(){$('selection-count').textContent=filtered().length+' câu phù hợp';$('start').disabled=!filtered().length;}
function chooseGroup(name){group=name;for(const button of $('subjects').children)button.setAttribute('aria-pressed',String(button.dataset.group===group));const parts=GROUPS.find(g=>g[0]===group)?.[1];fillSelect($('component'),[...new Set(bank.filter(q=>!parts||parts.includes(q.subject)).map(q=>q.subject))],'Tất cả phân môn');topics();}
function home(){if(session)persist();$('setup').hidden=false;$('quiz').hidden=true;$('results').hidden=true;$('resume').hidden=!saved;$('setup-title').focus();}
function start(questions,options){if(!questions.length){notice('Phần này chưa có câu hỏi. Hãy chọn nội dung khác.');return;}session=C.makeSession(questions,options);persist();renderQuiz();$('quiz-title').focus();}
function updateProgress(){const answered=Object.keys(session.answers).length;$('progress').textContent=answered+'/'+session.items.length+' câu đã trả lời';$('progress-bar').max=session.items.length;$('progress-bar').value=answered;}
function explanation(q,item,container){container.replaceChildren();const a=session.answers[q.id];const status=a===undefined?'Bỏ trống':a===q.answerIndex?'Chính xác':'Chưa chính xác';container.append(el('strong',status+' · Đáp án đúng: '+String.fromCharCode(65+item.order.indexOf(q.answerIndex))));container.append(el('p',q.explanation));container.hidden=false;}
function renderQuiz(){
 $('setup').hidden=true;$('quiz').hidden=false;$('results').hidden=true;$('questions').replaceChildren();$('quiz-title').textContent=session.mode==='exam'?'Tự kiểm tra':'Luyện tập';
 const byId=new Map(bank.map(q=>[q.id,q]));
 session.items.forEach((item,n)=>{const q=byId.get(item.id),card=el('fieldset',undefined,'question');card.append(el('legend',(n+1)+'. '+q.stem));card.append(el('p',q.subject+' / '+q.topic,'topic-label'));const feedback=el('div',undefined,'feedback');feedback.hidden=true;
 item.order.forEach((original,j)=>{const label=el('label',undefined,'option'),input=el('input');input.type='radio';input.name='question-'+n;input.value=String(original);input.checked=session.answers[q.id]===original;input.disabled=session.submitted;label.append(input,el('span',String.fromCharCode(65+j)+'. '+q.options[original]));input.addEventListener('change',()=>{if(session.submitted)return;session.answers[q.id]=original;persist();updateProgress();if(session.mode==='practice')explanation(q,item,feedback);});card.append(label);});
 if(!session.submitted){const clear=el('button','Bỏ chọn câu này','clear-answer');clear.type='button';clear.addEventListener('click',()=>{delete session.answers[q.id];for(const input of card.querySelectorAll('input'))input.checked=false;feedback.hidden=true;persist();updateProgress();});card.append(clear);}
 card.append(feedback);if(session.submitted||(session.mode==='practice'&&session.answers[q.id]!==undefined))explanation(q,item,feedback);$('questions').append(card);
 });$('submit').hidden=session.submitted;updateProgress();if(session.submitted)renderResults();
}
function renderResults(){const result=C.score(session,bank);$('results').hidden=false;$('score').replaceChildren();$('score').append(el('div',result.points.toLocaleString('vi-VN')+' / 10','score-number'),el('p',result.correct+' đúng · '+result.wrong+' sai · '+result.blank+' bỏ trống / '+result.total+' câu. Mỗi câu có trọng số bằng nhau; câu sai hoặc bỏ trống được 0 điểm.'));
 $('breakdown').replaceChildren();const table=el('table'),caption=el('caption','Kết quả theo phân môn');table.append(caption);const head=el('tr');for(const text of ['Phân môn','Đúng','Sai','Bỏ trống']){const th=el('th',text);th.scope='col';head.append(th);}const thead=el('thead');thead.append(head);table.append(thead);const body=el('tbody');for(const [subject,s]of Object.entries(result.bySubject)){const row=el('tr');const th=el('th',subject);th.scope='row';row.append(th);for(const value of [s.correct,s.wrong,s.blank])row.append(el('td',String(value)));body.append(row);}table.append(body);$('breakdown').append(table);$('retry').disabled=!result.retryIds.length;
}
$('start').addEventListener('click',()=>{if(saved&&!saved.submitted&&!window.confirm('Bắt đầu bài mới sẽ thay bài đang lưu. Tiếp tục?'))return;start(filtered(),{mode:$('mode').value,shuffleItems:$('shuffle').checked,limit:Number($('limit').value)});});
$('component').addEventListener('change',topics);$('topic').addEventListener('change',selection);$('home').addEventListener('click',home);$('restart').addEventListener('click',home);
$('resume').addEventListener('click',()=>{session=saved;renderQuiz();$('quiz-title').focus();});
$('submit').addEventListener('click',()=>{if(!session||session.submitted)return;const blank=C.score(session,bank).blank;if(!window.confirm(blank?'Còn '+blank+' câu bỏ trống (0 điểm). Bạn muốn nộp bài?':'Nộp bài và khóa đáp án?'))return;session.submitted=true;persist();renderQuiz();$('results').focus();});
$('retry').addEventListener('click',()=>{if(!session?.submitted)return;const ids=new Set(C.score(session,bank).retryIds);start(bank.filter(q=>ids.has(q.id)),{mode:'practice',shuffleItems:$('shuffle').checked});$('quiz-title').scrollIntoView();});
$('reset').addEventListener('click',()=>{if(!window.confirm('Xóa toàn bộ bài làm và kết quả đã lưu của đề cương trên thiết bị này? Không thể hoàn tác.'))return;if(storage&&!C.reset(storage,true)){notice('Không xóa được dữ liệu lưu. Hãy kiểm tra cài đặt trình duyệt.');return;}saved=null;session=null;home();notice('Đã xóa bài làm đã lưu trên thiết bị này.');});
async function init(){try{const response=await fetch('./questions.json',{cache:'no-cache'});if(!response.ok)throw Error('Không tải được dữ liệu.');bank=C.validateBank(await response.json());version=C.fingerprint(bank);if(!bank.length){notice('Ngân hàng câu hỏi đang được cập nhật. Chưa có bài để chấm điểm.');return;}
 for(const q of bank)if(!GROUPS.some(g=>g[1].includes(q.subject)))throw Error('Phân môn chưa được nhận diện: '+q.subject);
 $('bank-count').textContent=bank.length+' câu / '+GROUPS.filter(g=>bank.some(q=>g[1].includes(q.subject))).length+' môn';
 for(const [name,parts]of [['Tất cả môn',null],...GROUPS]){const count=bank.filter(q=>!parts||parts.includes(q.subject)).length;const b=el('button',name+' · '+count);b.dataset.group=parts?name:'';b.type='button';b.disabled=!count;b.addEventListener('click',()=>chooseGroup(parts?name:''));$('subjects').append(b);}
 let raw=null;try{raw=storage?.getItem(C.STORAGE_KEY);}catch{}
 saved=raw?C.restore(raw,version,bank):null;
 notice(raw&&!saved?'Đề cương đã đổi phiên bản hoặc bài lưu không còn hợp lệ. Hãy bắt đầu bài mới.':'Chọn nội dung để bắt đầu. Đáp án và lời giải có sẵn để tự học.');
 $('setup').hidden=false;$('resume').hidden=!saved;chooseGroup('');
 }catch(error){notice('Chưa thể mở đề cương: '+error.message+' Hãy tải lại trang.');}}
init();
