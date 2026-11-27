/* Pure, owner-scoped design-only placement rules shared by artboards and exports. */
(function(root,make){const api=make();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.SeiyunLayoutCore=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const clamp=(v,lo,hi,d=lo)=>{const n=Number(v);return Number.isFinite(n)?Math.max(lo,Math.min(hi,n)):d;};
function toArtboardDelta(clientDelta,nativeSize,displayedSize){
 const a=Number(nativeSize),b=Number(displayedSize),d=Number(clientDelta);
 if(!Number.isFinite(d)||!Number.isFinite(a)||!Number.isFinite(b)||b<=0)return 0;
 return d*a/b;
}
function keySafe(k){return typeof k==='string'&&k!=='__proto__'&&k!=='prototype'&&k!=='constructor'&&/^(brand|product:[A-Za-z0-9_\-]{1,100}(?::(?:name|ingredients|price))?|source:[0-9]{1,6})$/.test(k);}
function templateSafe(k){return typeof k==='string'&&k.length<160&&/^[a-z0-9:_-]+$/i.test(k)&&!['__proto__','prototype','constructor'].includes(k);}
function cleanRect(rect={},bounds={}){
 const w=clamp(bounds.width,250,4000,816),h=clamp(bounds.height,250,4000,1056);
 return {x:clamp(rect.x,0,w,0),y:clamp(rect.y,0,h,0),
  w:clamp(rect.w,24,w,160),h:clamp(rect.h,20,h,60),
  fontSize:clamp(rect.fontSize,8,180,24)};
}
function saveMenuLayout(state,templateId,key,rect={},bounds={}){
 if(!state||typeof state!=='object'||!templateSafe(templateId)||!keySafe(key))return null;
 if(!state.menuArtwork||typeof state.menuArtwork!=='object')state.menuArtwork={};
 if(!state.menuArtwork.layoutOverrides||typeof state.menuArtwork.layoutOverrides!=='object')state.menuArtwork.layoutOverrides={};
 if(!Object.prototype.hasOwnProperty.call(state.menuArtwork.layoutOverrides,templateId))state.menuArtwork.layoutOverrides[templateId]={};
 const val=cleanRect(rect,bounds);
 state.menuArtwork.layoutOverrides[templateId][key]=val;
 return val;
}
function saveShowcaseLayer(state,layer,rect={}){
 if(!state||typeof state!=='object'||!['hero','title'].includes(layer))return null;
 if(!state.showcaseArtwork||typeof state.showcaseArtwork!=='object')state.showcaseArtwork={};
 if(!state.showcaseArtwork.layerOverrides||typeof state.showcaseArtwork.layerOverrides!=='object')state.showcaseArtwork.layerOverrides={};
 const val={x:clamp(rect.x,0,100,50),y:clamp(rect.y,0,100,50),scale:clamp(rect.scale,.4,2.6,1),
  fontSize:clamp(rect.fontSize,18,150,48)};
 state.showcaseArtwork.layerOverrides[layer]=val;
 return val;
}
return {toArtboardDelta,saveMenuLayout,saveShowcaseLayer,cleanRect};
});
