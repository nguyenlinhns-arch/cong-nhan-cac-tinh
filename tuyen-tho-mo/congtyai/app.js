// Taskboard-only entry. Historical office modules are not imported or initialized.
import {mountStatusPanel} from './status-panel.js?v=20261031-taskboard-r4';
const board=document.querySelector('#progress');
mountStatusPanel(board);
for(const button of document.querySelectorAll('[data-board-nav]')){
 button.addEventListener('click',()=>{
  const target=button.dataset.boardNav;
  const select=board.querySelector('[data-status-scope]');
  select.value=target==='RESULTS'?'ALL':target;
  select.dispatchEvent(new Event('change',{bubbles:true}));
  const notice=document.querySelector('[data-board-notice]');
  if(target==='RESULTS'){
   const result=board.querySelector('[data-category="completed"]');
   notice.textContent=result?'Kết quả đã nghiệm thu và bàn giao trong snapshot này.':'Chưa có kết quả đã nghiệm thu và bàn giao trong snapshot này.';
   (result||board).scrollIntoView({block:'start'});
  }else{notice.textContent='';board.scrollIntoView({block:'start'});}
 });
}
