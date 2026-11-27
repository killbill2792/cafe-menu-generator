/* Seiyun Creative Studio — pure data-binding rules shared by both owner experiences. */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.SeiyunCreativeCore=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const MODES=Object.freeze(['portal','orbit','cascade','tunnel','carousel','marquee']);
 const NAV=Object.freeze([{id:'menu',label:'Menu Generator'},{id:'showcase',label:'Product Showcase'}]);
 const BRAND=Object.freeze({name:'seiyun',tagline:'YEMENI COFFEE',logoUrl:'',showLogo:false,accent:'#a96a44',background:'#faf2e8',text:'#34231b',font:'fraunces'});
 const FONTS=Object.freeze(['fraunces','dm-sans','serif','system']);
 const numeric=(v,min,max,def)=>{const n=Number(v);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):def;};
 const hex=(v,def)=>/^#[0-9a-f]{6}$/i.test(String(v||''))?String(v):def;
 const text=(v,limit=120)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,limit);
 const safeUrl=url=>{const s=String(url||'').trim();if(!s)return '';try{const u=new URL(s);return (u.protocol==='https:'||u.protocol==='http:'||u.protocol==='blob:'||u.protocol==='data:'&&/^data:image\/(png|jpeg|webp|avif);/i.test(s))?s:'';}catch{return ''}};
 function ownerNavigation(){return NAV.map(n=>({...n}));}
 function normalizeBrand(input={}){
  return {name:text(input.name||BRAND.name,90),tagline:text(input.tagline??BRAND.tagline,110),logoUrl:safeUrl(input.logoUrl),showLogo:!!input.showLogo,accent:hex(input.accent,BRAND.accent),background:hex(input.background,BRAND.background),text:hex(input.text,BRAND.text),font:FONTS.includes(input.font)?input.font:BRAND.font};
 }
 function applyInlineEdit(state,{productId,field,value,sizeIndex=0}={}){
  if(!state||typeof state!=='object')return false;
  if(field==='brand.name'||field==='brand.tagline'){
   const b=normalizeBrand(state.branding);b[field.slice(6)]=text(value,field==='brand.name'?90:110);
   if(field==='brand.name'&&!b.name)return false;
   state.branding=b;return true;
  }
  const p=Array.isArray(state.products)?state.products.find(p=>p.id===productId):null;
  if(!p)return false;
  if(field==='price'){
   const size=Array.isArray(p.sizes)?p.sizes[Number(sizeIndex)]:null;
   const raw=String(value||'').trim().replace(/^[^\d-]*/,'').replace(/,/g,'');
   if(!size||! /^\d{1,4}(\.\d{0,2})?$/.test(raw))return false;
   const price=Number(raw);if(!Number.isFinite(price)||price>9999.99)return false;
   size.price=price;return true;
  }
  if(!['name','description','ingredients','category'].includes(field))return false;
  const clean=text(value,field==='name'?110:450);
  if((field==='name'||field==='category')&&!clean)return false;
  p[field]=clean;return true;
 }
 function selectedShowcasePhoto(p){if(!p)return '';const photos=Array.isArray(p.photos)?p.photos:[],chosen=Number(p.showcasePrimary),main=Number(p.primary);
  return safeUrl(photos[p.showcasePrimary!==null&&p.showcasePrimary!==undefined&&Number.isInteger(chosen)?chosen:main]||photos[Number.isInteger(main)?main:0]||photos[0]);
 }
 function chooseProduct(state,id){const enabled=(state?.products||[]).filter(p=>p.enabled!==false);return enabled.find(p=>p.id===id)||enabled.find(p=>selectedShowcasePhoto(p))||enabled[0]||null;}
 function photoTransform(state,id){
  const t=state?.menuArtwork?.photoTransformByProduct?.[id]||{};
  return {zoom:numeric(t.zoom,100,240,100),x:numeric(t.x,-60,60,0),y:numeric(t.y,-60,60,0)};
 }
 function updatePhotoTransform(state,id,patch){if(!state||!id)return false;
  if(!state.menuArtwork||typeof state.menuArtwork!=='object')state.menuArtwork={};
  if(!state.menuArtwork.photoTransformByProduct||typeof state.menuArtwork.photoTransformByProduct!=='object')state.menuArtwork.photoTransformByProduct={};
  state.menuArtwork.photoTransformByProduct[id]={...photoTransform(state,id),...patch};
  state.menuArtwork.photoTransformByProduct[id]=photoTransform(state,id);
  return true;
 }
 function photoTransformStyle(state,id){const t=photoTransform(state,id);return 'transform: translate('+t.x+'%, '+t.y+'%) scale('+(t.zoom/100)+'); transform-origin: center center;';}
 function motionModes(){return [...MODES];}
 function normalizeShowcase(value={},state=null){const chosen=chooseProduct(state,value.productId);return {
  productId:chosen?.id||'',mode:MODES.includes(value.mode)?value.mode:'portal',
  sceneId:['cinematic-reveal','ingredient-motion','product-spotlight','fresh-energy','warm-cafe'].includes(value.sceneId)?value.sceneId:'',
  speed:numeric(value.speed,.25,2.5,1),duration:numeric(value.duration,3,15,7),
  background:hex(value.background,'#2e1815'),
  autoCutout:value.autoCutout!==false,
  layerOverrides:typeof value.layerOverrides==='object'&&value.layerOverrides&&!Array.isArray(value.layerOverrides)?value.layerOverrides:{}
 };}
 function recordingFormat(supported){if(typeof supported!=='function')return null;
  for(const [mime,ext] of [['video/mp4;codecs=avc1.42E01E','mp4'],['video/mp4','mp4'],['video/webm;codecs=vp9','webm'],['video/webm;codecs=vp8','webm'],['video/webm','webm']]){
   if(supported(mime))return {mime,ext};}
  return null;
 }
 return {ownerNavigation,normalizeBrand,applyInlineEdit,selectedShowcasePhoto,chooseProduct,photoTransform,photoTransformStyle,updatePhotoTransform,motionModes,normalizeShowcase,recordingFormat,safeUrl};
});
