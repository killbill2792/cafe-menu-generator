const test=require('node:test'),assert=require('node:assert/strict');
const {mask}=require('../studio/photo-cutout.js');
function picture(w,h,color=[255,255,255,255]){const d=new Uint8ClampedArray(w*h*4);for(let i=0;i<w*h;i++)d.set(color,i*4);return d;}
test('edge-connected white background becomes transparent, colored product remains',()=>{
 const w=20,h=20,d=picture(w,h);for(let y=4;y<18;y++)for(let x=6;x<14;x++)d.set([200,128,63,255],(y*w+x)*4);
 const r=mask(d,w,h);assert.equal(r.changed,true);assert(r.removed>200);assert.equal(d[3],0);
 assert.equal(d[(10*w+10)*4+3],255,'product center must stay opaque');
});
test('white foam enclosed by product remains opaque',()=>{
 const w=20,h=20,d=picture(w,h);for(let y=3;y<18;y++)for(let x=4;x<16;x++)d.set([160,90,55,255],(y*w+x)*4);
 d.set([249,245,243,255],(9*w+9)*4);mask(d,w,h);
 assert.equal(d[(9*w+9)*4+3],255);
});
test('no cutout on pure white artwork or non-white background',()=>{
 const white=picture(20,20),dark=picture(20,20,[51,45,40,255]);
 assert.equal(mask(white,20,20).changed,false);
 assert.equal(mask(dark,20,20).changed,false);
 assert.equal(white[3],255);assert.equal(dark[3],255);
});
