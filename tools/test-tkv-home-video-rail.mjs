import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync('tuyen-tho-mo/index.html','utf8');
const block=html.match(/<section class="tkv-video"[\s\S]+?<\/section>/)[0];
const ids=["bWUDKQ1r6xA","9DjYfc6Q1m0","WkSt6eOvlkA","h4zuijHumME","l0MFR1SNey8","XNMQwM_5fyI","Y5skQm8A1ho","0kWCKhpw5B8","7i-hlu2Ol7Y","cpeiTxtJKu4"], hero='6MJLc5mBhsA', playlist='PLhy1BqQ18EgT5sFMEg1aOlHYCAoTDDMgG';
assert.deepEqual([...block.matchAll(/data-tkv-pick="([^"]+)"/g)].map(x=>x[1]),[hero,...ids]);
assert.equal((html.match(/<h1\b/g)||[]).length,1);
assert.ok(block.indexOf('id="tkv-video-title"')<block.indexOf('data-tkv-stage'));
assert.ok(!block.includes('<iframe')&&!block.includes('tkv-video__note'));
assert.ok(block.includes('list='+playlist));
ids.forEach((id,i)=>assert.ok(block.includes('v='+id+'&amp;list='+playlist+'&amp;index='+(i+1))));
const card=(key,i)=>({dataset:{tkvPick:key},offsetLeft:201*i,href:'https://www.youtube.com/watch?v='+key,attrs:new Map(),querySelector:()=>({textContent:'  Video '+key+'  '}),setAttribute(k,v){this.attrs.set(k,v)},removeAttribute(k){this.attrs.delete(k)}});
const cards=ids.map(card),first=card(hero,-1);first.dataset.tkvTitle='Video đầu';
const listeners={},doc={activeElement:first,createElement:n=>({tag:n})};
const stage={children:[first],scrolls:0,contains(x){return this.children.includes(x)},replaceChildren(...args){this.children=args},focus(){doc.activeElement=this},scrollIntoView(){this.scrolls++}};
const rail={querySelectorAll:()=>cards,scrollLeft:0,scrollWidth:2010,clientWidth:1005,scrollTo({left}){this.scrollLeft=left}};
const status={},source={},controls={hidden:true};const button=k=>({addEventListener(_,fn){listeners[k]=fn}});
const fields={'[data-tkv-stage]':stage,'[data-tkv-rail]':rail,'[data-tkv-status]':status,'[data-tkv-source]':source,'[data-tkv-controls]':controls,'[data-tkv-prev]':button('prev'),'[data-tkv-next]':button('next')};
const root={contains:link=>link===first||cards.includes(link),querySelector:s=>fields[s],addEventListener(_,fn){listeners.pick=fn}};
doc.querySelector=()=>root;
vm.runInNewContext(fs.readFileSync('tuyen-tho-mo/assets/home-video-rail/rail.js','utf8'),{URL,document:doc,window:{matchMedia:()=>({matches:true})}});
function click(link,extra={}){let prevented=false;listeners.pick({button:0,detail:1,target:{closest:()=>link},preventDefault(){prevented=true},...extra});return prevented}
function verify(id){
 assert.equal(stage.children.length,1);
 const frame=stage.children[0], u=new URL(frame.src);
 assert.equal(frame.tag,'iframe'); assert.equal(u.pathname,'/embed/'+id);
 assert.equal(u.searchParams.get('autoplay'),'1');assert.equal(u.searchParams.get('playsinline'),'1');
 assert.equal(u.searchParams.get('start'),null);assert.ok(frame.allow.includes('autoplay'));assert.ok(frame.title);
}
assert.equal(controls.hidden,false);
listeners.prev();assert.equal(rail.scrollLeft,1005);listeners.next();assert.equal(rail.scrollLeft,0);
listeners.next();assert.equal(rail.scrollLeft,201);
assert.equal(stage.children[0],first);
assert.equal(click(first,{ctrlKey:true}),false);assert.equal(stage.children[0],first);
assert.ok(click(first,{detail:0})); verify(hero);assert.equal(doc.activeElement,stage);assert.equal(stage.scrolls,0);
for(const [i,link] of cards.entries()){
 doc.activeElement=link;
 assert.ok(click(link,i===0?{detail:0}:{}));verify(ids[i]);assert.equal(source.href,link.href);
 assert.equal(cards.filter(x=>x.attrs.has('aria-current')).length,1);assert.equal(link.attrs.get('aria-current'),'true');
 assert.equal(doc.activeElement,link);assert.equal(stage.scrolls,i);
 assert.ok(status.textContent.includes(ids[i]));
}
console.log('PASS: official playlist order, one player, all 11 selections, stable heading and focus, wrap, desktop-independent fallback links');
