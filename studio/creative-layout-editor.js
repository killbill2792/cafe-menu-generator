/* WYSIWYG artboard selection and direct manipulation using MIT Daybrush Moveable. */
(function(root,make){const api=make();root.SeiyunLayoutEditor=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
let active=null,moveable=null,handler=null;
const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
const number=(v,d)=>Number.isFinite(Number(v))?Number(v):d;
const layoutCore=()=>window.SeiyunLayoutCore;
function detach(){
 if(handler&&active?.container)active.container.removeEventListener('pointerdown',handler,true);
 handler=null;
 if(moveable){moveable.destroy();moveable=null;}
 if(active?.target)active.target.classList.remove('cs-element-selected');
 active=null;
}
function attach(container,{state,templateId,onCommit,mode='menu'}={}){
 detach();if(!container||!state||!['menu','showcase'].includes(mode))return;
 active={container,state,templateId,onCommit,mode,target:null};
 handler=ev=>{
  const m=active;
  if(!m||m.container!==container)return;
  const selector=mode==='showcase'?'[data-scene-layer]':'[data-layout-key],.mg-brand-name,[data-menu-product]';
  const el=ev.target.closest(selector);
  if(!el||!container.contains(el))return;
  if(ev.target.closest('.moveable-control-box'))return;
  select(el);
 };
 container.addEventListener('pointerdown',handler,true);
}
function getSceneKey(el){return el.dataset.sceneLayer||'';}
function nativeBox(el){const st=getComputedStyle(el),width=number(parseFloat(el.style.width),el.offsetWidth),height=number(parseFloat(el.style.height),el.offsetHeight);
 return {x:number(parseFloat(el.style.left),el.offsetLeft),y:number(parseFloat(el.style.top),el.offsetTop),w:Math.max(24,width),h:Math.max(20,height),fontSize:Math.max(8,number(parseFloat(el.style.fontSize),parseFloat(st.fontSize)||20))};
}
function screenRatio(el){const rect=el.getBoundingClientRect();return el.offsetWidth>0?rect.width/el.offsetWidth:1;}
function select(el){
 if(!active||!el)return;
 const a=active;
 if(a.target===el)return;
 if(a.target)a.target.classList.remove('cs-element-selected');
 a.target=el;el.classList.add('cs-element-selected');
 if(moveable){moveable.destroy();moveable=null;}
 if(typeof window.Moveable!=='function'){
  const s=document.querySelector('#csMessage');if(s)s.textContent='Drag handles are temporarily unavailable. Check the editing library connection.';
  return;
 }
 const stage=a.mode==='showcase'?a.container:(a.container.querySelector('.mg-export-page')||a.container);
 const native={w:stage.clientWidth||816,h:stage.clientHeight||1056};
 const base=nativeBox(el);
 const key=a.mode==='menu'?(el.dataset.layoutKey||(el.closest('[data-menu-product]')?'product:'+el.closest('[data-menu-product]').dataset.menuProduct:'brand')):getSceneKey(el);
 const previewScale=a.mode==='menu'?screenRatio(stage):1;
 let startBox={...base},startLayer=null,dirty=false;
 const scene=window.SeiyunCinematicScenes;
 const product=a.mode==='showcase'?a.state.products?.find(p=>p.id===a.state.showcaseArtwork?.productId)||a.state.products?.[0]:null;
 const readLayer=()=>scene?.resolve(product,a.state.branding||{},a.state.showcaseArtwork||{}).layers[key];
 function saveScene(patch){
  const old=readLayer()||{x:50,y:50,scale:1,fontSize:48};
  const val=layoutCore().saveShowcaseLayer(a.state,key,{...old,...patch});
  if(val){el.style.setProperty('--cs-layer-x',val.x+'%');el.style.setProperty('--cs-layer-y',val.y+'%');
   el.style.setProperty(key==='hero'?'--cs-layer-scale':'--cs-title-scale',val.scale);
   if(key==='title')el.style.setProperty('--cs-title-size',val.fontSize+'px');
   window.SeiyunShowcase?.update?.(a.state,window.SeiyunCreativeCore?.normalizeShowcase(a.state.showcaseArtwork||{},a.state),window.SeiyunCreativeCore);
  }
  return val;
 }
 function saveMenu(box){
  const val=layoutCore().saveMenuLayout(a.state,a.templateId,key,box,native);
  if(val){el.style.position='absolute';el.style.left=val.x+'px';el.style.top=val.y+'px';
   el.style.width=val.w+'px';el.style.height=val.h+'px';if(el.classList.contains('ot-native-text')||el.matches('[data-cs-edit]'))el.style.fontSize=val.fontSize+'px';}
  return val;
 }
 function commit(){
  if(!dirty)return;
  dirty=false;
  if(typeof a.onCommit==='function')a.onCommit({mode:a.mode,key});
 }
 moveable=new window.Moveable(document.body,{target:el,draggable:true,resizable:true,scalable:false,rotatable:false,origin:false,edge:true,keepRatio:false,
   snappable:true,snapThreshold:8,bounds:{left:0,top:0,right:window.innerWidth,bottom:window.innerHeight},
   renderDirections:['nw','ne','sw','se'],className:'cs-moveable-handles'});
 moveable.on('dragStart',()=>{startBox=nativeBox(el);startLayer=readLayer();dirty=false;});
 moveable.on('drag',e=>{
  const dx=number(e.beforeDist?.[0],number(e.dist?.[0],0)),dy=number(e.beforeDist?.[1],number(e.dist?.[1],0));
  if(a.mode==='showcase'){
   if(!['hero','title'].includes(key))return;
   const w=a.container.clientWidth||1,h=a.container.clientHeight||1;
   const next={x:clamp((startLayer?.x??50)+(dx/w*100),0,100),y:clamp((startLayer?.y??50)+(dy/h*100),0,100)};
   saveScene(next);dirty=true;
  }else{
   const ratio=previewScale||1;
   saveMenu({...startBox,x:clamp(startBox.x+dx/ratio,0,native.w),y:clamp(startBox.y+dy/ratio,0,native.h)});
   dirty=true;
  }
  moveable?.updateRect();
 });
 moveable.on('dragEnd',commit);
 moveable.on('resizeStart',()=>{startBox=nativeBox(el);startLayer=readLayer();dirty=false;});
 moveable.on('resize',e=>{
  const factor=number(e.width,startBox.w)/Math.max(1,startBox.w);
  if(a.mode==='showcase'){
   if(!['hero','title'].includes(key))return;
   const prev=startLayer||{scale:1,fontSize:48};
   saveScene({scale:clamp(prev.scale*factor,.4,2.6),fontSize:key==='title'?clamp(prev.fontSize*factor,18,150):prev.fontSize});
   dirty=true;
  }else{
   const ratio=previewScale||1;
   saveMenu({...startBox,w:clamp(number(e.width,startBox.w)/ratio,24,native.w),h:clamp(number(e.height,startBox.h)/ratio,20,native.h),
     fontSize:clamp(startBox.fontSize*factor,8,180)});
   dirty=true;
  }
  moveable?.updateRect();
 });
 moveable.on('resizeEnd',commit);
 return moveable;
}
return {attach,detach,select};
});
