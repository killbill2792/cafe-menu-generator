const {test}=require('node:test');const assert=require('node:assert/strict');
const api=require('../studio/creative-layout-core.js');
const state=()=>({menuArtwork:{templateId:'opentempl:food-menu-cafe-nord'},showcaseArtwork:{productId:'drink'},products:[{id:'drink',name:'Saffron',sizes:[{price:8.5}]}]});
test('menu coordinates are relative to the actual page even when preview is zoomed',()=>{
 assert.equal(api.toArtboardDelta(45,816,408),90);
 assert.equal(api.toArtboardDelta(-25,816,408),-50);
});
test('dragging brand writes only design-position override, preserving product catalog',()=>{
 const s=state();const p=api.saveMenuLayout(s,'opentempl:food-menu-cafe-nord','brand',{x:12,y:30,w:420,h:75,fontSize:52});
 assert.equal(p.x,12);assert.equal(p.w,420);
 assert.equal(s.menuArtwork.layoutOverrides['opentempl:food-menu-cafe-nord'].brand.x,12);
 assert.equal(s.products[0].sizes[0].price,8.5);
});
test('unsafe geometry and template keys are rejected or clamped',()=>{
 const s=state(),x=api.saveMenuLayout(s,'opentempl:food-menu-cafe-nord','product:drink',{x:999999,y:-1000,w:12000,h:-1,fontSize:1000},{width:816,height:1056});
 assert(x.x<=816);assert(x.y>=0);assert(x.w<=816);assert(x.h>=20);assert(x.fontSize<=180);
 assert.equal(api.saveMenuLayout(s,'x','__proto__',{x:0}),null);
});
test('showcase draggable hero and title persist design-only percentage positions, scale and text size',()=>{
 const s=state();
 const a=api.saveShowcaseLayer(s,'hero',{x:72,y:47,scale:1.62,fontSize:60});
 const b=api.saveShowcaseLayer(s,'title',{x:28,y:83,scale:1.35,fontSize:74});
 assert.equal(a.x,72);assert.equal(a.scale,1.62);
 assert.equal(b.x,28);assert.equal(b.fontSize,74);
 assert.equal(s.products[0].name,'Saffron');
});
test('can position source element with drag updates for export without modifying product',()=>{
 const s=state();api.saveMenuLayout(s,'opentempl:food-menu-cafe-nord','brand',{x:33,y:44,w:390,h:66,fontSize:60});
 const pack=require('../studio/vendor/opentempl/curated-menu.js');
 const adapter=require('../studio/open-template-adapter.js');
 const r=adapter.render(s,pack.find(x=>x.id==='food-menu-cafe-nord'),{layoutOverrides:s.menuArtwork.layoutOverrides['opentempl:food-menu-cafe-nord']});
 assert(r.pages[0].includes('data-layout-key="brand"'));
 assert(r.pages[0].includes('left:33px'));
});
