const {test}=require('node:test');
const assert=require('node:assert/strict');
const core=require('../studio/creative-core.js');
const state=()=>({currency:'USD',products:[
 {id:'coffee',name:'Seiyun Coffee',category:'Coffee',ingredients:'Cardamom',enabled:true,photos:['https://example.org/a.png','https://example.org/b.png'],primary:0,showcasePrimary:1,sizes:[{id:'s1',name:'12 oz',price:7.5}]},
 {id:'tea',name:'Adeni Tea',category:'Tea',ingredients:'Tea',enabled:true,photos:[],primary:0,sizes:[{id:'s2',name:'Regular',price:5}]}
]});
test('owner navigation exposes exactly Menu Generator and Product Showcase',()=>{
 const nav=core.ownerNavigation();
 assert.equal(nav.length,2);
 assert.deepEqual(nav.map(x=>x.id),['menu','showcase']);
 assert(!nav.some(x=>/screen|published/i.test(x.label)));
});
test('menu edits change exact canonical product, not generated preview text',()=>{
 const d=state(); const changed=core.applyInlineEdit(d,{productId:'coffee',field:'name',value:'Seiyun Royal Coffee'});
 assert.equal(changed,true);
 assert.equal(d.products[0].name,'Seiyun Royal Coffee');
 assert.equal(d.products[1].name,'Adeni Tea');
 assert.equal(core.applyInlineEdit(d,{productId:'unknown',field:'name',value:'Bogus'}),false);
});
test('price edit handles visible dollars and rejects invalid price',()=>{
 const d=state();
 assert.equal(core.applyInlineEdit(d,{productId:'coffee',field:'price',sizeIndex:0,value:'$8.75'}),true);
 assert.equal(d.products[0].sizes[0].price,8.75);
 assert.equal(core.applyInlineEdit(d,{productId:'coffee',field:'price',sizeIndex:0,value:'not a price'}),false);
 assert.equal(d.products[0].sizes[0].price,8.75);
});
test('brand is optional logo or text, with allowed CSS colors and fonts',()=>{
 const brand=core.normalizeBrand({name:'My Café',tagline:'Hot Drinks',accent:'#146c88',font:'fraunces',logoUrl:'javascript:alert(1)',background:'bad'});
 assert.equal(brand.name,'My Café');
 assert.equal(brand.logoUrl,'');
 assert.equal(brand.accent,'#146c88');
 assert.notEqual(brand.background,'bad');
 assert.equal(core.applyInlineEdit(state(),{field:'brand.name',value:'A New Cafe'}),true);
});
test('photo selection ignores legacy screen category and respects showcase choice',()=>{
 const d=state();
 d.screens=[{role:'showcase',category:'Refreshers'}];
 assert.equal(core.selectedShowcasePhoto(d.products[0]),'https://example.org/b.png');
 assert.equal(core.selectedShowcasePhoto(d.products[1]),'');
 assert.equal(core.chooseProduct(d,'coffee').id,'coffee');
});
test('real image zoom settings are independent from photo frame width',()=>{
 const d=state();
 core.updatePhotoTransform(d,'coffee',{zoom:165,x:18,y:-12});
 assert.deepEqual(core.photoTransform(d,'coffee'),{zoom:165,x:18,y:-12});
 assert.equal(d.menuArtwork?.imageSpace,undefined);
 const html=core.photoTransformStyle(d,'coffee');
 assert.match(html,/scale\(1\.65\)/);assert.match(html,/translate\(18%, -12%\)/);
});
test('six motion modes are available, defaults safe and no AI path',()=>{
 assert.deepEqual(core.motionModes(),['cinematic','ingredients','spotlight','iced','warm','minimal']);
 const value=core.normalizeShowcase({mode:'invalid',speed:600,duration:-3,background:'not a color'},state());
 assert.equal(value.mode,'cinematic');assert.equal(value.speed,2.5);assert.equal(value.duration,3);
 assert.match(value.background,/^#[0-9a-f]{6}$/i);
});
test('record format is labelled honestly on supported browsers',()=>{
 const best=core.recordingFormat(mime=>mime.includes('video/webm'));
 assert.equal(best.ext,'webm');assert.match(best.mime,/video\/webm/);
 assert.equal(core.recordingFormat(()=>false),null);
});
