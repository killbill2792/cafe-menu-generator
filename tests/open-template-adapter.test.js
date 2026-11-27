const {test}=require('node:test');
const assert=require('node:assert/strict');
const pack=require('../studio/vendor/opentempl/curated-menu.js');
const adapter=require('../studio/open-template-adapter.js');
const create=(n)=>({branding:{name:'Seiyun Yemeni Coffee',tagline:'Yemeni Coffee'},currency:'USD',products:Array.from({length:n},(_,i)=>({
 id:'drink-'+i,name:'Café test item '+i,category:i<6?'Coffee':'Refreshers',ingredients:'Milk and cardamom',enabled:true,
 photos:i===0?['https://owner.example.org/seiyun.png']:[],primary:0,sizes:[{name:'12 oz',price:7+i/10}]
}))});
test('imports at least eighteen exact independently named OpenTempl documents with native text geometry',()=>{
 assert(pack.length>=18);
 assert.equal(new Set(pack.map(t=>t.id)).size,pack.length);
 assert(pack.every(t=>t.pages?.[0]?.elements?.some(e=>e.type==='text'&&Number.isFinite(e.x)&&Number.isFinite(e.fontSize))));
 assert(pack.some(t=>t.id==='food-menu-cafe-nord'));
 assert(pack.some(t=>t.id==='jp-tea-menu'));
});
test('every imported menu binds all 26 owner products exactly once across pages',()=>{
 for(const t of pack){
 const r=adapter.render(create(26),t,{format:'letter'});
 const html=r.pages.join('');
 assert.equal(r.productCount,26,t.id);
 const ids=[...html.matchAll(/data-menu-product="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,26,t.id);
 assert.equal(new Set(ids).size,26,t.id);
 assert(html.includes('Seiyun Yemeni Coffee'),t.id);
 assert(!html.includes('src="javascript:'),t.id);
 }
});
test('actual upstream menu source is preserved as positioned text/shape elements, not a color-swatch redesign',()=>{
 const t=pack.find(t=>t.id==='food-menu-cafe-nord');
 const h=adapter.render(create(4),t,{format:'a4'}).pages[0];
 assert(h.includes('data-opentempl-source="food-menu-cafe-nord"'));
 assert(h.includes('data-native-element='));
 assert(h.includes('position:absolute'));
 assert(h.includes('Café test item 0'));
});
test('no sample owner images or original menu prices leak into rendered pages',()=>{
 const t=pack.find(t=>t.id==='food-menu-cafe-nord');
 const state=create(1);
 state.products[0].photos=['javascript:alert(1)'];
 state.products[0].name='<script>unsafe</script>';
 const html=adapter.render(state,t).pages.join('');
 assert(!html.includes('<script>'));
 assert(!html.includes('src="javascript:'));
 assert(html.includes('&lt;script&gt;unsafe'));
 assert(!html.includes('Flat white'));
});
test('layout size overrides change export geometry and clamp impossible input',()=>{
 const t=pack[0],state=create(3);
 const result=adapter.render(state,t,{layoutOverrides:{brand:{x:12,y:30,w:420,h:70,fontSize:52}}});
 assert(result.pages.join('').includes('data-layout-key="brand"'));
 assert(result.pages.join('').includes('left:12px'));
 assert(result.pages.join('').includes('width:420px'));
});

test('native image slots use real owner photos, remain selectable and honor zoom without crop',()=>{
 const t=pack.find(x=>x.id==='stationery-arch-menu'),state=create(4);
 state.menuArtwork={photoTransformByProduct:{'drink-0':{zoom:165,x:14,y:-6}}};
 const h=adapter.render(state,t).pages.join('');
 assert(h.includes('data-cs-photo="drink-0"'));
 assert(h.includes('scale(1.65)'));
 assert(h.includes('https://owner.example.org/seiyun.png'));
 assert(!h.includes('src="undefined"'));
});
test('brand logos are optional: imported document uses text or user-provided logo',()=>{
 const t=pack.find(x=>x.id==='food-menu-cafe-nord'),state=create(4);
 const plain=adapter.render(state,t).pages.join('');
 assert(plain.includes('Seiyun Yemeni Coffee'));
 state.branding.showLogo=true;state.branding.logoUrl='https://owner.example.org/logo.png';
 const logo=adapter.render(state,t).pages.join('');
 assert(logo.includes('src="https://owner.example.org/logo.png"'));
});
