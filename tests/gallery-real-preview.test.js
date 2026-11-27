const {test}=require('node:test');
const assert=require('node:assert/strict');
require('../studio/vendor/opentempl/curated-menu.js');
require('../studio/open-template-adapter.js');
require('../studio/menu-gallery.js');
const lib=globalThis.SeiyunMenuGallery;
const state={currency:'USD',branding:{name:'Seiyun Coffee',tagline:'Yemeni Coffee'},products:Array.from({length:26},(_,i)=>({id:'d'+i,name:i?'Seiyun Drink '+i:'Seiyun Coffee',enabled:true,category:'Coffee',ingredients:'Milk and cardamom',photos:i===0?['https://owner.test/coffee.png']:[],primary:0,sizes:[{name:'Regular',price:7+i/10}]}))};
test('gallery combines 24 current designs with 21 actual MIT OpenTempl designs',()=>{
 assert.equal(lib.registry.filter(x=>x.source==='opentempl').length,21);
 assert(lib.registry.length>=45);
 assert(lib.registry.some(x=>x.id==='opentempl:food-menu-cafe-nord'));
});
test('selecting native template renders actual source coordinates and all products',()=>{
 const r=lib.renderPages(state,{templateId:'opentempl:food-menu-cafe-nord',format:'a4'});
 assert(r.pages[0].includes('data-opentempl-source="food-menu-cafe-nord"'));
 assert(r.pages[0].includes('data-native-element'));
 assert.equal((r.pages.join('').match(/data-menu-product=/g)||[]).length,26);
});
test('thumbnail uses real first page and populated owner data rather than color-card sketch',()=>{
 const t=lib.registry.find(x=>x.id==='opentempl:food-menu-cafe-nord');
 const html=lib.thumbnailHTML(state,t);
 assert(html.includes('data-opentempl-source="food-menu-cafe-nord"'));
 assert(html.includes('Seiyun Coffee'));
 assert(html.includes('mg-export-page'));
 assert(!html.includes('cs-design-art'));
});
test('compact card menus page efficiently without dropping items',()=>{
 const r=lib.renderPages(state,{templateId:'photo-cards-clean',format:'letter',imageSpace:30});
 assert(r.pageCount<=4);
 assert.equal((r.pages.join('').match(/data-menu-product=/g)||[]).length,26);
});

test('gallery differentiates 31 actual compositions from 47 color and typography combinations',()=>{
 const choices=lib.distinctLayouts();
 assert.equal(choices.length,31);
 const classic=choices.filter(t=>t.source!=='opentempl'&&t.source!=='canvix');
 assert.equal(classic.length,8);
 assert(classic.every(t=>t.looks.length===3));
 assert.equal(choices.filter(t=>['opentempl','canvix'].includes(t.source)).length,23);
});
