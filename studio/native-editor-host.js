/* Full native editor launcher. Do not synthesize canvas controls or fake animation presets.
   Authenticated Supabase draft stays canonical; native designs are separate editable artifacts. */
(function(root){
'use strict';
const e=v=>String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[x]));
const $=s=>document.querySelector(s);
const saved=s=>s.nativeArtworks&&typeof s.nativeArtworks==='object'?s.nativeArtworks:{};
let active=null;
function modeHTML(mode,state,core){
 if(mode==='menu'){
  return '<div class="cs-native-heading"><div><small>MENU GENERATOR · COMPLETE OPEN SOURCE EDITOR</small><h1>Edit your actual menu, directly</h1><p>Native OpenTempl: choose designs, move or resize anything, manage layers, delete/undo and export. Your '+state.products.filter(x=>x.enabled!==false).length+' café products are preloaded.</p></div><div class="cs-native-top-actions"><button class="cs-btn" data-native-action="reset-menu">Start fresh from your café data</button><button class="cs-btn" data-native-action="fullscreen">Full screen editor</button></div></div>'+
  '<div class="cs-native-status" id="nativeStatus">Opening your full menu editor…</div><div class="cs-native-frame"><iframe id="nativeEditorFrame" title="Complete OpenTempl menu design editor" allow="fullscreen; clipboard-write" loading="eager" referrerpolicy="same-origin"></iframe></div>'+
  '<p class="cs-native-legal">The complete OpenTempl editor is self-hosted under this website. Your café product data stays in our existing Supabase catalog; changing decorative elements does not delete a product.</p>';
 }
 const cfg=core.normalizeShowcase(state.showcaseArtwork||{},state),p=core.chooseProduct(state,cfg.productId),
       records=(state.products||[]).filter(p=>p.enabled!==false),choices=p?.photos||[];
 const approved=saved(state).approvedPhotos?.[p?.id||''];
 const chosen=approved&&choices[approved.index]===approved.url?approved:null;
 return '<div class="cs-native-heading"><div><small>PRODUCT SHOWCASE · COMPLETE MOTION WORKSPACE</small><h1>Your actual drink in motion</h1><p>Pick a drink and confirm the exact photograph. Motion Studio Open then gives you its full native motion library, live editing, timeline and video exports—not five substitute effects.</p></div></div>'+
 '<div class="cs-native-product-picker"><label class="cs-field">Featured product<select id="nativeProductSelect">'+records.map(x=>'<option value="'+e(x.id)+'" '+(p?.id===x.id?'selected':'')+'>'+e(x.name||'Unnamed product')+'</option>').join('')+'</select></label>'+
 '<div class="cs-native-photo-area"><strong>Choose the exact photograph shown in the advertisement</strong><div class="cs-native-photos">'+
 choices.map((url,i)=>'<button type="button" class="cs-native-photo '+(chosen?.index===i?'selected':'')+'" data-native-photo="'+i+'" aria-pressed="'+(chosen?.index===i)+'"><img loading="lazy" src="'+e(url)+'" alt="'+e(p?.name||'product')+' photograph '+(i+1)+'"><span>Photo '+(i+1)+'</span></button>').join('')+
 (choices.length?'':'<p>No photo saved for this product.</p>')+'</div><button class="cs-btn" data-cs-action="ad-upload">+ Upload another product photo</button></div></div>'+
 (chosen?'<div class="cs-native-status" id="nativeStatus">Opening the native 224-preset Motion Studio editor for '+e(p?.name)+'…</div><div class="cs-native-frame"><iframe id="nativeEditorFrame" title="Complete Motion Studio Open animation editor" allow="fullscreen; clipboard-write" loading="eager" referrerpolicy="same-origin"></iframe></div>':
 '<section class="cs-native-empty"><strong>Choose a product photograph above</strong><p>We will not guess which image is correct or use a screenshot of the old website as a drink. Your photo selection is saved for this product.</p></section>')+
 '<p class="cs-native-legal">Motion Studio Open is a complete Apache-2.0 native editor with a broad library of general motion effects; not every effect is an existing food commercial. It runs locally in the browser with native MP4/WebM/GIF exports where supported.</p>';
}
function nativeUrl(type,nonce,state){
 const owner=root.seiyunCloud?.ownerId;
 if(!owner)return null;
 const prefix=type==='menu'?'menu':'motion';
 const url=new URL('native/'+prefix+'/index.html',location.href.replace(/[^/]*$/,''));
 url.searchParams.set('seiyun_nonce',nonce);
 // Partition anonymous IndexedDB storage by the current signed-in owner to avoid
 // accidentally exposing a previous café's local designs in the native home screen.
 url.searchParams.set('seiyun_owner',String(owner));
 return url.href;
}
function catalog(type,state,core){
 const brand={...core.normalizeBrand(state.branding||{}),customColors:state.branding?.customColors===true};
 if(type==='menu')return{
  brand,currency:state.currency||'USD',templateId:(()=>{
   const x=window.SeiyunMenuGallery?.getSettings(state)?.templateId||'';
   if(x.startsWith('opentempl:'))return x.slice('opentempl:'.length);
   return 'food-menu-cafe-nord';
  })(),
  products:(state.products||[]).map(p=>({id:p.id,name:p.name,category:p.category,ingredients:p.ingredients,enabled:p.enabled,
   photos:(p.photos||[]).slice(0,8),primary:p.primary,sizes:(p.sizes||[]).map(z=>({name:z.name,price:z.price}))})),
  saved:saved(state).menu?.snapshot?{snapshot:saved(state).menu.snapshot}:null
 };
 const cfg=core.normalizeShowcase(state.showcaseArtwork||{},state),
       product=core.chooseProduct(state,cfg.productId),
       approved=saved(state).approvedPhotos?.[product?.id||''];
 return {product:{id:product?.id,name:product?.name,ingredients:product?.ingredients,sizes:product?.sizes},
  brand,currency:state.currency||'USD',photoUrl:approved?.url,
  aspect:'portrait',savedScene:saved(state).motionByProduct?.[product?.id]?.scene||null};
}
function setStatus(message,bad){
 const target=$('#nativeStatus');if(!target)return;
 target.textContent=message;target.dataset.state=bad?'error':'ready';
}
const nonce=()=>Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b=>b.toString(16).padStart(2,'0')).join('');
function dispose(){if(active){clearTimeout(active.loadTimeout);active=null;root.removeEventListener('message',onMessage);}}
function onMessage(ev){
 const a=active;if(!a||ev.origin!==location.origin||ev.source!==a.frame?.contentWindow)return;
 const d=ev.data;if(!d||d.nonce!==a.nonce||typeof d.type!=='string')return;
 if(d.type==='SEIYUN_NATIVE_READY'){
  if(a.sent)return;a.sent=true;
  a.frame.contentWindow.postMessage({type:'SEIYUN_NATIVE_INIT',nonce:a.nonce,catalog:a.preparedCatalog||catalog(a.type,a.state,a.core)},location.origin);
 }
 if(d.type==='SEIYUN_NATIVE_LOADED'){clearTimeout(a.loadTimeout);setStatus(a.type==='menu'?'Full OpenTempl menu editor ready. Use its native undo, layers and export controls.':'Full Motion Studio editor ready. Choose among its native motion presets.');}
 if(d.type==='SEIYUN_NATIVE_ERROR')setStatus('Native editor: '+String(d.error||'Could not load').slice(0,220),true);
 if(d.type==='SEIYUN_NATIVE_SAVE'){
  const doc=d.snapshot,scene=d.scene;
  if(a.type==='menu'){
   if(!doc||!Array.isArray(doc.pageOrder)||doc.pageOrder.length>75||!doc.elements||!doc.pages)return;
   const size=JSON.stringify(doc).length;if(size>1_200_000)return;
   a.state.nativeArtworks={...saved(a.state),menu:{snapshot:doc,updatedAt:new Date().toISOString()}};
  }else{
   if(!scene||!Array.isArray(scene.tracks))return;
   const size=JSON.stringify(scene).length;if(size>900000)return;
   const productId=a.preparedCatalog?.product?.id;
   if(!productId)return;
   a.state.nativeArtworks={...saved(a.state),motionByProduct:{...(saved(a.state).motionByProduct||{}),[productId]:{scene,updatedAt:new Date().toISOString()}}};
  }
  a.save();
  setStatus('Artwork saved to your private draft. Native undo/redo and downloads are still available.');
 }
}
async function nonDestructiveCutout(url){
 if(!url||!root.SeiyunPhotoCutout?.make)return url;
 return new Promise(resolve=>{
  const image=new Image();image.crossOrigin='anonymous';
  image.onload=()=>{
   try{const result=root.SeiyunPhotoCutout.make(image,1400);
    if(result.changed&&typeof result.asset.toDataURL==='function'){
     resolve(result.asset.toDataURL('image/png'));return;
    }
   }catch{/* CORS denied canvas access: use unchanged approved photograph. */}
   resolve(url);
  };
  image.onerror=()=>resolve(url);image.src=url;
 });
}
async function mount(state,type,core,save){
 dispose();
 const frame=$('#nativeEditorFrame');if(!frame)return;
 const n=nonce(),url=nativeUrl(type,n,state);
 if(!url){setStatus('Please sign in to open this editor.',true);return;}
 active={frame,nonce:n,type,state,core,save,sent:false};
 root.addEventListener('message',onMessage);
 const preparedCatalog=catalog(type,state,core);
 if(type==='motion')preparedCatalog.photoUrl=await nonDestructiveCutout(preparedCatalog.photoUrl);
 if(!active||active.nonce!==n)return;
 active.preparedCatalog=preparedCatalog;
 try{
  const head=await fetch(url,{method:'HEAD',cache:'no-store'});
  if(!active||active.nonce!==n)return;
  if(!head.ok||!String(head.headers.get('content-type')||'').includes('text/html')){
   setStatus('The full native '+(type==='menu'?'OpenTempl':'Motion Studio')+' build is not installed on this deployment. No partial editor will be substituted.',true);
   return;
  }
  frame.src=url;
  active.loadTimeout=setTimeout(()=>{if(active?.nonce===n)setStatus('The full editor did not finish loading. Reload this page; check the browser console or deployment logs if this persists.',true);},60000);
 }catch{setStatus('The native editor could not be reached. Check this deployment and internet connection.',true);}
}
function onClick(ev){
 const btn=ev.target.closest('[data-native-photo],[data-native-action]');if(!btn||!$('#app .cs-app'))return;
 if(btn.dataset.nativePhoto!==undefined){
  const p=active?.state?active.state:null; // may be null before editor is mounted
  const state=p||root.draft||((typeof draft!=='undefined')?draft:null);
  if(!state)return;
  const core=root.SeiyunCreativeCore,cfg=core.normalizeShowcase(state.showcaseArtwork||{},state),
        product=core.chooseProduct(state,cfg.productId),index=Number(btn.dataset.nativePhoto);
  if(!product||!Number.isInteger(index)||index<0||index>=product.photos.length)return;
  state.nativeArtworks={...saved(state),approvedPhotos:{...(saved(state).approvedPhotos||{}),[product.id]:{index,url:product.photos[index]}}};
  if(typeof saveSoon==='function')saveSoon();
  root.SeiyunCreative?.render?.();return;
 }
 if(btn.dataset.nativeAction==='reset-menu'){
  if(!confirm('Start a new native menu design from your current café catalog? This keeps all products but replaces your saved native layout.'))return;
  const state=(typeof draft!=='undefined')?draft:null;if(!state)return;
  const a=saved(state);delete a.menu;state.nativeArtworks=a;if(typeof saveSoon==='function')saveSoon();
  root.SeiyunCreative?.render?.();
 }
 if(btn.dataset.nativeAction==='fullscreen'){
  const stage=$('.cs-native-frame');stage?.requestFullscreen?.().catch(()=>{});
 }
}
function onChange(ev){
 if(ev.target.id!=='nativeProductSelect')return;
 const state=(typeof draft!=='undefined')?draft:null;if(!state)return;
 state.showcaseArtwork={...state.showcaseArtwork,productId:ev.target.value};
 if(typeof saveSoon==='function')saveSoon();
 root.SeiyunCreative?.render?.();
}
document.addEventListener('click',onClick,true);
document.addEventListener('change',onChange,true);
root.SeiyunNativeEditors={content:modeHTML,mount,dispose};
})(window);
