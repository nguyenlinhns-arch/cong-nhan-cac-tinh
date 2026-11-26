import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const home=fs.readFileSync('tuyen-tho-mo/index.html','utf8');
const begin=home.indexOf('<section class="tkv-video"');
const end=home.indexOf('</section>',begin);
const section=home.slice(begin,end);
assert.ok(begin>home.indexOf('id="noi-dung"')&&begin<home.indexOf('<h1'));
assert.equal((home.match(/<h1\b/g)||[]).length,1);
assert.equal((home.match(/<section class="tkv-video"/g)||[]).length,1);
assert.ok(!section.includes('<iframe'));
const keys=['all','80','450','630','1130'];
const card=(key,index)=>({dataset:{tkvPick:key},offsetLeft:190*index,href:'https://www.youtube.com/watch?v=6MJLc5mBhsA'+(key==='all'?'':'&t='+key+'s'),attrs:new Map(),querySelector:()=>({textContent:key}),setAttribute(k,v){this.attrs.set(k,v)},removeAttribute(k){this.attrs.delete(k)}});
const cards=keys.map(card);
for(const k of keys.slice(1)) {
 assert.ok(section.includes('data-tkv-pick="'+k+'"'));
 assert.ok(fs.existsSync('tuyen-tho-mo/assets/home-video-rail/moc-'+k+'.jpg'));
}
const stage={children:[],replaceChildren(...args){this.children=args},scrollIntoView(){}}, rail={querySelectorAll:()=>cards,scrollLeft:0}, status={},source={};
const listeners={};
const button=k=>({addEventListener(_,fn){listeners[k]=fn}});
const fields={'[data-tkv-stage]':stage,'[data-tkv-rail]':rail,'[data-tkv-status]':status,'[data-tkv-source]':source,'[data-tkv-controls]':{},'[data-tkv-prev]':button('prev'),'[data-tkv-next]':button('next')};
const root={querySelector:s=>fields[s],addEventListener(_,fn){listeners.pick=fn}};
vm.runInNewContext(fs.readFileSync('tuyen-tho-mo/assets/home-video-rail/rail.js','utf8'),{URL,document:{querySelector:()=>root,createElement:()=>({})},window:{matchMedia:()=>({matches:false})}});
assert.equal(stage.children.length,0);
listeners.prev();assert.equal(rail.scrollLeft,760);listeners.next();assert.equal(rail.scrollLeft,0);assert.equal(stage.children.length,0);
for (const [i,c] of cards.entries()){
 let prevented=false;
 listeners.pick({button:0,target:{closest:()=>c},preventDefault(){prevented=true}});
 assert.ok(prevented);assert.equal(stage.children.length,1);
 const u=new URL(stage.children[0].src);
 assert.equal(u.pathname,'/embed/6MJLc5mBhsA');
 assert.equal(u.searchParams.get('start'),i?keys[i]:null);
 assert.equal(u.searchParams.get('autoplay'),'1');
 assert.equal(cards.filter(x=>x.attrs.has('aria-current')).length,1);
 assert.equal(source.href,c.href);
}
console.log('PASS: one player, 5 correct sources, rail wraps, no initial iframe, non-JS source links.');
