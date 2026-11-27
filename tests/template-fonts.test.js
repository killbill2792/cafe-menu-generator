const {test}=require('node:test');const assert=require('node:assert/strict');
const api=require('../studio/template-fonts.js');
const open=require('../studio/vendor/opentempl/curated-menu.js');
const can=require('../studio/vendor/canvix/curated-menu.js');
test('every imported actual menu font is collected without needing a duplicate editor',()=>{
 const names=api.collectFamilies([...open,...can]);
 assert(names.includes('Bricolage Grotesque'));
 assert(names.includes('Alfa Slab One'));
 assert(names.includes('Cormorant Garamond'));
 assert(names.includes('Archivo'));
 assert(names.length>=20);
});
test('Google Fonts URL carries only font family identifiers, no product names or private photos',()=>{
 const u=api.fontsHref(['Bricolage Grotesque','Alfa Slab One','Cookie <script>']);
 assert(u.startsWith('https://fonts.googleapis.com/css2?'));
 assert(u.includes('family=Alfa+Slab+One'));
 assert(u.includes('family=Bricolage+Grotesque'));
 assert(!u.includes('script'));assert(!u.includes('Cookie'));
});
test('font loader can request selected source families without redundant link creation',()=>{
 const doc={head:{appendChild(n){this.children.push(n)},children:[]},createElement(){return {}},querySelectorAll(){return this.head.children}};
 const selected=[open.find(x=>x.id==='food-menu-checker-diner')];
 assert.equal(api.loadFonts(doc,selected),true);
 assert.equal(doc.head.children.length,1);
 assert.equal(api.loadFonts(doc,selected),false);
 assert.equal(doc.head.children.length,1);
});
