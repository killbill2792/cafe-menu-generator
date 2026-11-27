const {test}=require('node:test');
const assert=require('node:assert/strict');
const scenes=require('../studio/cinematic-scenes.js');
const photo='https://owner.example.com/iced-coffee.png';
const product=(name,ingredients,category)=>({id:'p1',name,ingredients,category,photos:[photo],primary:0,sizes:[{price:8.5}]});
test('five distinct cinematic single-product scene presets, no gallery modes',()=>{
 const ids=scenes.registry.map(x=>x.id);
 assert.deepEqual(ids,['cinematic-reveal','ingredient-motion','product-spotlight','fresh-energy','warm-cafe']);
 assert(!ids.some(x=>/orbit|tunnel|carousel/i.test(x)));
});
test('Saffron and Matcha receive visibly different ingredient, palette and ambient behavior',()=>{
 const a=scenes.resolve(product('Saffron','saffron syrup · saffron cream top','Coffee'),{name:'Seiyun'});
 const b=scenes.resolve(product('Matcha Latte','matcha powder · oat milk','Matcha'),{name:'Seiyun'});
 assert.notEqual(a.palette.background,b.palette.background);
 assert.notDeepEqual(a.ingredients,b.ingredients);
 assert(a.ingredients.some(x=>/saffron/i.test(x.label)));
 assert(b.ingredients.some(x=>/matcha/i.test(x.label)));
});
test('single product photo remains one hero in HTML with real animated environment',()=>{
 for(const s of scenes.registry){
 const r=scenes.render(product('Saffron','saffron syrup','Coffee'),{name:'Seiyun'},{sceneId:s.id,background:'#422a25'});
 assert.equal((r.match(/class="cs-hero-img"/g)||[]).length,1,s.id);
 assert(r.includes('data-scene="'+s.id+'"'));
 assert(r.includes('data-environment-layer'));
 assert(r.includes('https://owner.example.com/iced-coffee.png'));
 assert(!r.includes('class="scene-card"'));
 }
});
test('timeline reports distinct positions and opacity for different frames; same inputs deterministic',()=>{
 const a=scenes.frameAt(0,'cinematic-reveal',1);
 const b=scenes.frameAt(.5,'cinematic-reveal',1);
 assert.notDeepEqual(a,b);
 assert.deepEqual(a,scenes.frameAt(0,'cinematic-reveal',1));
});
test('scene layer changes are persisted as safe output-only positions',()=>{
 const v=scenes.normalizeLayer({x:22,y:40,scale:1.5,fontSize:72});
 assert.equal(v.x,22);assert.equal(v.scale,1.5);
 assert.equal(scenes.normalizeLayer({x:9999,y:-10,scale:-4}).x,100);
 assert.equal(scenes.normalizeLayer({x:9999,y:-10,scale:-4}).y,0);
});
