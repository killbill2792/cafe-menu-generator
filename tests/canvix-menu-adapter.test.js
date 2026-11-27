const {test}=require('node:test');
const assert=require('node:assert/strict');
const pack=require('../studio/vendor/canvix/curated-menu.js');
require('../studio/vendor/opentempl/curated-menu.js');
require('../studio/open-template-adapter.js');
require('../studio/menu-gallery.js');
const adapter=globalThis.SeiyunOpenMenuAdapter,gallery=globalThis.SeiyunMenuGallery;
const state={branding:{name:'Seiyun Yemeni Coffee'},currency:'USD',products:Array.from({length:26},(_,i)=>({id:'drink-'+i,name:'Drink '+i,enabled:true,category:'Coffee',ingredients:'Milk and cardamom',photos:[],sizes:[{price:7+i/10}]}))};
test('Canvix offers its two original complete cafe menu layouts—not 366 unrelated general designs',()=>{
 assert.equal(pack.length,2);
 assert.deepEqual(pack.map(x=>x.id).sort(),['artisan-menu','cafe-menu']);
 assert(pack.every(x=>x.source==='canvix' && x.pages[0].elements.some(e=>e.type==='text'&&e.text&&e.fontSize>20)));
 assert(pack.some(x=>x.pages[0].elements.some(e=>e.type==='shape')));
});
test('Canvix menu documents retain their exact source dimensions, typography and decorative page elements',()=>{
 const artisan=pack.find(x=>x.id==='artisan-menu');
 const board=pack.find(x=>x.id==='cafe-menu');
 assert.equal(artisan.width,1240);assert.equal(artisan.height,1754);
 assert.equal(board.width,1080);assert.equal(board.height,1350);
 assert(artisan.pages[0].elements.some(e=>e.type==='text'&&e.text==='THE DAILY'&&e.fontSize===96));
 assert(board.pages[0].elements.some(e=>e.type==='text'&&e.text==='GROUND & CO'&&e.fontSize===72));
});
test('both Canvix menu designs bind every owner product once with no original sample prices/names',()=>{
 for(const d of pack){
  const r=adapter.render(state,d,{format:'a4'});
  const html=r.pages.join('');
  const ids=[...html.matchAll(/data-menu-product="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,26,d.id);assert.equal(new Set(ids).size,26,d.id);
  assert(html.includes('Seiyun Yemeni Coffee'),d.id);
  assert(!html.includes('GROUND &amp; CO'),d.id);
  assert(!html.includes('Pumpkin Cortado'),d.id);
 }
});
test('45 existing choices remain alongside two real Canvix designs and their true previews',()=>{
 const ts=gallery.registry.filter(x=>x.source==='canvix');
 assert.equal(ts.length,2);
 assert.equal(gallery.registry.length,47);
 const t=ts.find(x=>x.id==='canvix:cafe-menu');
 assert(t);
 const h=gallery.thumbnailHTML(state,t);
 assert(h.includes('data-opentempl-source="cafe-menu"'));
 assert(h.includes('Seiyun Yemeni Coffee'));
});
