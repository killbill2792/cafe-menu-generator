const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../studio');
const context={URL,location:{origin:'http://localhost'}};context.window=context;context.globalThis=context;
for(const file of ['vendor/opentempl/menu-documents.js','source-menu-adapter.js','menu-gallery.js']){
 vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
}
const lib=context.SeiyunMenuGallery;
const data=()=>({currency:'USD',branding:{name:'Seiyun Test Café',tagline:'Yemeni Coffee'},products:Array.from({length:26},(_,i)=>({id:'p'+i,enabled:true,name:'Seiyun Drink '+i,category:'Drinks',ingredients:'milk · cardamom',sizes:[{name:'12 oz',price:6+i/10}],photos:i===0?['https://example.com/test.png']:[],primary:0}))});
test('registry contains source documents, not just color variations',()=>{
 assert.equal(lib.registry.length,33);
 assert.equal(lib.registry.filter(t=>t.kind==='source-menu').length,9);
 assert.equal(lib.registry.filter(t=>t.kind==='seiyun-composition').length,24);
});
test('all nine original upstream MIT Menu documents are in read-only source library',()=>{
 const docs=context.SeiyunOpenTemplDocs;
 assert.equal(docs.length,9);for(const d of docs){assert.equal(d.category,'Menu');assert(d.pages[0].elements.length>0);}
});
test('every template includes each enabled product once across all pages',()=>{
 const state=data();
 for(const template of lib.registry){
  const format=template.layout==='source-digital'?'landscape':'letter';
  const result=lib.renderPages(state,{templateId:template.id,format});
  const html=result.pages.join('');
  assert.equal(result.productCount,26,template.id);
  assert.equal((html.match(/data-menu-product=/g)||[]).length,26,template.id);
  for(let i=0;i<26;i++)assert(html.includes('data-menu-product="p'+i+'"'),template.id+' missing p'+i);
 }
});
test('source layouts preserve decorative shape geometry and replace demo names with owner data',()=>{
 const state=data();
 const sample=lib.renderPages(state,{templateId:'opentempl:food-menu-checker-diner'});
 assert(sample.pages[0].includes('mg-source-decorations'));
 assert(sample.pages[0].includes('Seiyun Test Café'));
 assert(!sample.pages[0].includes('Tucker’s'),'original restaurant brand must be removed');
 assert(sample.pages[0].includes('Seiyun Drink 0'));
 assert(sample.pages[0].includes('6.00'));
});
test('compact density can reduce pages without dropping menu products',()=>{
 const st=data(),a=lib.renderPages(st,{templateId:'opentempl:food-menu-cafe-nord',density:'spacious'}),b=lib.renderPages(st,{templateId:'opentempl:food-menu-cafe-nord',density:'compact'});
 assert(b.pageCount<=a.pageCount);
 assert.equal((b.pages.join('').match(/data-menu-product=/g)||[]).length,26);
});
test('source design preview uses the owner photograph rather than example image',()=>{
 const p=lib.renderPages(data(),{templateId:'opentempl:food-menu-cafe-nord'}).pages.join('');
 assert(p.includes('https://example.com/test.png'));
 assert(!p.includes('https://images.unsplash.com'));
});
