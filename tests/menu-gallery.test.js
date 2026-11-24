const {test}=require('node:test');
const assert=require('node:assert/strict');
require('../studio/menu-gallery.js');
const lib=globalThis.SeiyunMenuGallery;
const item=(i,photo)=>({id:'p'+i,name:'Seiyun <Coffee> '+i,enabled:true,category:'Coffee & Tea',ingredients:'Spice & Milk',photos:photo?[photo]:[],primary:0,sizes:[{name:'12 oz',price:7},{name:'16 oz',price:9.5}]});
const state={currency:'USD',products:Array.from({length:23},(_,i)=>item(i,i===0?'https://example.com/owner/p0.png':null))};
test('24 unique designs across 8 genuinely different compositions',()=>{
 assert.equal(lib.registry.length,24);assert.equal(new Set(lib.registry.map(x=>x.id)).size,24);assert.equal(new Set(lib.registry.map(x=>x.layout)).size,8);
});
test('no product dropped or duplicated across pages for any template',()=>{
 for(const template of lib.registry){const r=lib.renderPages(state,{templateId:template.id,format:'letter'}),html=r.pages.join('');
 assert.equal((html.match(/data-menu-product=/g)||[]).length,23,template.id);
 assert.equal(r.productCount,23);assert.ok(r.pageCount>1);}
});
test('owner photos only; missing photos get placeholders, not stock',()=>{
 const html=lib.renderPages(state).pages.join('');
 assert.ok(html.includes('https://example.com/owner/p0.png'));
 assert.equal((html.match(/<img /g)||[]).length,1);
 assert.equal((html.match(/PHOTO TO ADD/g)||[]).length,22);
});
test('unsafe image URLs and HTML are rejected or escaped',()=>{
 const bad={products:[{...item(0,'javascript:alert(1)'),name:'<script>alert(1)</script>'}]};
 const html=lib.renderPages(bad).pages.join('');
 assert.ok(!html.includes('<script>'));assert.ok(!html.includes('src="javascript:'));assert.ok(html.includes('&lt;script&gt;'));
});
test('photo-space override per item and global size clamped',()=>{
 const r=lib.renderPages(state,{imageSpace:999,photoSizeByProduct:{p0:57}}),html=r.pages.join('');
 assert.equal(r.options.imageSpace,70);
 assert.ok(html.includes('style="--mg-photo-space:57%"'));
 assert.ok(html.includes('style="--mg-photo-space:70%"'));
});
test('all five formats allow unknown design fallback without dropping items',()=>{
 for(const format of Object.keys(lib.formats)){const r=lib.renderPages(state,{templateId:'bad',format});
 assert.equal((r.pages.join('').match(/data-menu-product=/g)||[]).length,23);assert.equal(r.options.templateId,'photo-left-warm');}
});
test('disabled products filtered and free products priced correctly',()=>{
 const r=lib.renderPages({currency:'USD',products:[item(0),{...item(1),enabled:false},{...item(2),sizes:[{name:'Promo',price:0}]}]});
 assert.equal(r.productCount,2);assert.ok(r.pages[0].includes('$0.00'));
});
