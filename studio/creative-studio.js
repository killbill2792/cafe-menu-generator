/* Owner-facing two-feature Creative Studio; legacy public and screen links remain intact. */
(function(){
'use strict';
if(typeof document==='undefined'||!window.SeiyunCreativeCore)return;
const core=window.SeiyunCreativeCore;
const $=q=>document.querySelector(q);
const esc=v=>String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
let page=0,photoId='',templatesOpen=false,brandOpen=false,search='',renderToken=0;
const isOwnerRoute=()=>!new URLSearchParams(location.search).has('screen');
const config=()=>{if(!draft.menuArtwork)draft.menuArtwork={};return draft.menuArtwork};
const branding=()=>core.normalizeBrand(draft.branding||{});
const showcase=()=>core.normalizeShowcase(draft.showcaseArtwork||{},draft);
const save=()=>{saveSoon();const v=$('#draftStatus');if(v)v.textContent='Saving online…'};
const notify=(m,bad)=>{const v=$('#csMessage');if(v)v.textContent=m;if(bad&&typeof toasts==='function')toasts(m,true)};
function shell(body){
 const links=core.ownerNavigation().map(n=>'<button class="cs-tab '+(tab===n.id?'active':'')+'" data-cs-tab="'+n.id+'">'+(n.id==='menu'?'▦':'▶')+' '+esc(n.label)+'</button>').join('');
 return '<div class="cs-app"><header class="cs-header"><div class="cs-brandmark">✦</div><div class="cs-title"><strong>Creative Studio</strong><small>Create once. Use anywhere.</small></div><nav class="cs-tabs" aria-label="Creative tools">'+links+'</nav><span id="draftStatus" class="cs-save-state">Your draft</span><button class="cs-account" data-cs-action="signout" title="Sign out">Sign out</button></header><main class="cs-main">'+body+'</main><div id="toast" class="toast"></div><input hidden type="file" id="productImage" multiple accept="image/*,.heic,.heif"><input hidden type="file" id="csLogoFile" accept="image/png,image/jpeg,image/webp,image/avif"></div>';
}
function brandPanel(){
 const b=branding();
 if(!brandOpen)return '';
 const fonts=[['fraunces','Fraunces'],['dm-sans','DM Sans'],['serif','Classic Serif'],['system','Modern Sans']];
 return '<div class="cs-floating cs-brand-panel"><div class="cs-panel-head"><strong>Brand styling</strong><button data-cs-action="brand">×</button></div><p>Tap the brand name on your menu to edit it. Logo is optional.</p><div class="cs-brand-grid">'+
 ['accent','background','text'].map(k=>'<label>'+k+'<input type="color" data-cs-brand="'+k+'" value="'+esc(b[k])+'"></label>').join('')+
 '<label>Title font<select data-cs-brand="font">'+fonts.map(([v,n])=>'<option value="'+v+'" '+(b.font===v?'selected':'')+'>'+n+'</option>').join('')+'</select></label></div>'+
 '<label><input type="checkbox" id="csShowLogo" '+(b.showLogo?'checked':'')+'> Use logo instead of text</label><button class="cs-btn" data-cs-action="upload-logo">Upload logo</button></div>';
}
function photoPanel(){
 const p=draft.products.find(x=>x.id===photoId);if(!p)return '';
 const t=core.photoTransform(draft,p.id);
 return '<div class="cs-floating cs-photo-panel"><div class="cs-panel-head"><strong>Photo: '+esc(p.name)+'</strong><button data-cs-action="close-photo">×</button></div>'+
 '<p>Adjust the actual photo—not the size of its box.</p>'+
 '<label>Zoom <output id="csZoomNumber">'+t.zoom+'%</output><input type="range" min="100" max="240" step="5" value="'+t.zoom+'" data-cs-zoom="zoom"></label>'+
 '<label>Move horizontally <input type="range" min="-60" max="60" step="2" value="'+t.x+'" data-cs-zoom="x"></label>'+
 '<label>Move vertically <input type="range" min="-60" max="60" step="2" value="'+t.y+'" data-cs-zoom="y"></label>'+
 '<div class="cs-actions"><button class="cs-btn primary" data-cs-upload="'+esc(p.id)+'">Replace / add photo</button><button class="cs-btn" data-cs-action="reset-photo">Reset</button></div></div>';
}
function templateTiles(){
 const lib=window.SeiyunMenuGallery,settings=config();
 return lib.registry.map(t=>{
  const current=(settings.templateId||lib.defaults.templateId)===t.id;
  const kind=t.source==='opentempl'?'Imported design · '+(t.vibe||'Menu'):'Classic layout · '+t.layout;
  return '<button type="button" class="cs-design '+(current?'selected':'')+'" data-cs-design="'+esc(t.id)+'" aria-pressed="'+current+'">'+
   lib.thumbnailHTML(draft,t)+'<span>'+esc(t.title)+'</span><span class="cs-template-category">'+esc(kind)+'</span></button>';
 }).join('');
}
function menuUI(){
 const lib=window.SeiyunMenuGallery,opts=lib.getSettings(draft),data=lib.renderPages(draft,opts);
 page=Math.max(0,Math.min(data.pageCount-1,page));
 return '<div class="cs-intro"><div><small>MENU GENERATOR</small><h1>Make your menu yours.</h1><p>Your café information is already here. Tap once to select and drag. Double-tap text to change the words. Resize using the corner handles; downloads keep your edits.</p></div><div class="cs-actions"><button class="cs-btn" data-cs-action="designs">Browse '+lib.registry.length+' designs</button><button class="cs-btn" data-cs-action="brand">Customize brand</button></div></div>'+
 (templatesOpen?'<section class="cs-designs"><div class="cs-panel-head"><strong>Choose your menu design</strong><button data-cs-action="designs">×</button></div><input id="csDesignSearch" type="search" placeholder="Search designs" value="'+esc(search)+'"><div class="cs-design-grid">'+templateTiles()+'</div></section>':'')+
 brandPanel()+
 '<section class="cs-workspace"><div class="cs-toolbar"><label>Format <select id="csFormat">'+Object.entries(lib.formats).map(([v,o])=>'<option value="'+v+'" '+(opts.format===v?'selected':'')+'>'+esc(o.label)+'</option>').join('')+'</select></label><span id="csItems">'+data.productCount+' items · '+data.pageCount+' pages</span><div class="cs-actions"><button class="cs-btn" data-cs-action="add-drink">+ Product</button><button class="cs-btn" data-cs-action="pdf">PDF / Print</button><button class="cs-btn primary" data-cs-action="png">Download PNG</button><button class="cs-btn" data-cs-action="jpg">JPG</button></div></div>'+
 '<div class="cs-art-space"><div id="csArtHost" class="cs-art-host"><div id="csArtPage" class="cs-art-page">'+data.pages[page]+'</div></div>'+photoPanel()+'</div>'+
 '<div class="cs-pagination"><button data-cs-action="prev" '+(!page?'disabled':'')+'>← Previous</button><span id="csCounter">Page '+(page+1)+' of '+data.pageCount+'</span><button data-cs-action="next" '+(page===data.pageCount-1?'disabled':'')+'>Next →</button></div>'+
 '<p id="csMessage" class="cs-footnote">Changes save in your draft. Downloads do not require publishing to a TV.</p></section>';
}
function fitPage(){
 const holder=$('#csArtHost'),el=$('#csArtPage'),pageEl=el?.firstElementChild;if(!holder||!pageEl)return;
 const width=parseFloat(pageEl.style.getPropertyValue('--mg-width'))||816;
 const height=parseFloat(pageEl.style.getPropertyValue('--mg-height'))||1056;
 const scale=Math.min(1,Math.max(.1,(holder.clientWidth-20)/width));
 el.style.width=width+'px';el.style.height=height+'px';el.style.transform='scale('+scale+')';
 el.style.transformOrigin='top left';el.style.position='absolute';el.style.left='50%';
 el.style.marginLeft=(-(width*scale)/2)+'px';holder.style.height=Math.ceil(height*scale)+'px';
}
function refreshMenu(){
 const lib=window.SeiyunMenuGallery,host=$('#csArtPage');if(!host)return;
 const data=lib.renderPages(draft,lib.getSettings(draft));
 page=Math.max(0,Math.min(page,data.pageCount-1));host.innerHTML=data.pages[page];
 const c=$('#csCounter');if(c)c.textContent='Page '+(page+1)+' of '+data.pageCount;
 const i=$('#csItems');if(i)i.textContent=data.productCount+' items · '+data.pageCount+' pages';
 const prev=$('[data-cs-action="prev"]'),next=$('[data-cs-action="next"]');if(prev)prev.disabled=page===0;if(next)next.disabled=page===data.pageCount-1;
 fitPage();
 window.SeiyunLayoutEditor?.attach?.($('#csArtPage'),{state:draft,templateId:lib.getSettings(draft).templateId,mode:'menu',onCommit:save});
}
function showcaseUI(){
 const cfg=showcase(),p=core.chooseProduct(draft,cfg.productId),photo=core.selectedShowcasePhoto(p),b=branding();
 const scenes=window.SeiyunCinematicScenes;
 const chosenScene=scenes?.resolve(p,b,{...cfg,background:cfg.background==='#2e1815'?undefined:cfg.background});
 const selected=cfg.sceneId||chosenScene?.id||'cinematic-reveal';
 const products=draft.products.filter(x=>x.enabled!==false);
 return '<div class="cs-intro"><div><small>PRODUCT SHOWCASE</small><h1>One drink. A complete advertisement.</h1><p>Your photograph and brand are ready. Select a cinematic scene, adjust directly, and download.</p></div></div>'+
 '<div class="cs-showcase-grid"><section class="cs-showcase-tools"><label class="cs-field">Featured drink<select id="csProductSelect">'+products.map(x=>'<option value="'+esc(x.id)+'" '+(p?.id===x.id?'selected':'')+'>'+esc(x.name||'New drink')+'</option>').join('')+'</select></label>'+
 '<strong>Choose the hero photo</strong><div class="cs-photo-thumbs">'+(p?.photos?.length?p.photos.map((url,i)=>'<button data-cs-ad-photo="'+i+'" class="'+(photo===url?'selected':'')+'"><img src="'+esc(url)+'" alt="Photo '+(i+1)+'"></button>').join(''):'<p>No photo uploaded yet.</p>')+'</div>'+
 '<button class="cs-btn primary" data-cs-action="ad-upload">+ Add or replace photograph</button>'+
 '<strong>Cinematic scene styles</strong><div class="cs-cinematic-options">'+(scenes?.registry||[]).map(scene=>
 '<button type="button" data-cs-motion="'+esc(scene.id)+'" class="cs-scene-choice '+(selected===scene.id?'selected':'')+'" aria-pressed="'+(selected===scene.id)+'">'+
 '<span class="cs-scene-choice-preview choice-'+esc(scene.id)+'"><span class="cs-scene-choice-glow"></span>'+(photo?'<img class="cs-scene-choice-img" src="'+esc(photo)+'" alt="">':'')+'</span><b>'+esc(scene.name)+'</b><small>'+esc(scene.description)+'</small></button>').join('')+'</div>'+
 '<label class="cs-field">Background <input id="csAdColor" type="color" value="'+esc(chosenScene?.palette.background||cfg.background)+'"></label>'+
 '<label class="cs-field">Motion speed <input id="csAdSpeed" type="range" min="0.25" max="2.5" step="0.25" value="'+cfg.speed+'"></label>'+
 '<label class="cs-field">Duration <select id="csAdDuration">'+[5,7,10,15].map(n=>'<option value="'+n+'" '+(Number(cfg.duration)===n?'selected':'')+'>'+n+' seconds</option>').join('')+'</select></label>'+
 '<p class="cs-footnote">Tap the drink or headline inside the ad to move or resize it. You own every exported file.</p></section>'+
 '<section class="cs-showcase-preview"><div id="csAdStage" class="cs-ad-stage" style="--cs-ad-bg:'+esc(chosenScene?.palette.background||cfg.background)+'"><div id="csMotion" class="cs-motion"></div></div>'+
 '<div class="cs-actions cs-export"><button class="cs-btn" data-cs-action="play">Pause / Play</button><button class="cs-btn primary" data-cs-action="video">Download video</button><button class="cs-btn" data-cs-action="gif">GIF</button><button class="cs-btn" data-cs-action="still">PNG still</button></div>'+
 '<div class="cs-actions"><button class="cs-btn" data-cs-action="cutout">Remove plain white background</button></div>'+
 '<p id="csMessage" class="cs-footnote">'+(photo?'One featured product, with animated environment and real preview.':'Upload a photo to activate the cinematic scene.')+'</p></section></div>';
}
function money(value){try{return new Intl.NumberFormat('en-US',{style:'currency',currency:draft.currency||'USD'}).format(value);}catch{return '$'+Number(value).toFixed(2);}}
function renderCreative(){
 if(!isOwnerRoute()){if(typeof renderTVView==='function')renderTVView();return;}
 if(!draft||!Array.isArray(draft.products))return;
 if(!['menu','showcase'].includes(tab))tab='menu';
 window.SeiyunShowcase?.destroy?.();
 const root=$('#app');root.innerHTML=shell(tab==='menu'?menuUI():showcaseUI());
 const n=++renderToken;
 if(tab==='menu')requestAnimationFrame(()=>{
  if(n!==renderToken)return;
  fitPage();
  window.SeiyunLayoutEditor?.attach?.($('#csArtPage'),{state:draft,templateId:window.SeiyunMenuGallery.getSettings(draft).templateId,mode:'menu',onCommit:save});
 });
 else {
  window.SeiyunShowcase?.mount?.($('#csMotion'),draft,showcase(),core,notify);
  requestAnimationFrame(()=>{
   if(n!==renderToken)return;
   window.SeiyunLayoutEditor?.attach?.($('#csAdStage'),{state:draft,mode:'showcase',onCommit:save});
  });
 }
}
render=renderCreative;
function dataClick(ev){
 const route=ev.target.closest('[data-cs-tab]');if(route){ev.preventDefault();ev.stopImmediatePropagation();tab=route.dataset.csTab;page=0;photoId='';render();return;}
 const tpl=ev.target.closest('[data-cs-design]');if(tpl){ev.preventDefault();ev.stopImmediatePropagation();const t=window.SeiyunMenuGallery.registry.find(x=>x.id===tpl.dataset.csDesign);if(!t)return;config().templateId=t.id;if(t.recommendedFormat)config().format=t.recommendedFormat;page=0;photoId='';templatesOpen=false;save();render();return;}
 const motion=ev.target.closest('[data-cs-motion]');if(motion){ev.preventDefault();ev.stopImmediatePropagation();draft.showcaseArtwork={...showcase(),sceneId:motion.dataset.csMotion};save();render();return;}
 const ph=ev.target.closest('[data-cs-photo]');if(ph&&tab==='menu'){ev.preventDefault();ev.stopImmediatePropagation();photoId=ph.dataset.csPhoto;render();return;}
 const photo=ev.target.closest('[data-cs-ad-photo]');if(photo){ev.preventDefault();ev.stopImmediatePropagation();const p=core.chooseProduct(draft,showcase().productId);if(p){p.showcasePrimary=Number(photo.dataset.csAdPhoto);save();render();}return;}
 const upload=ev.target.closest('[data-cs-upload]');if(upload){ev.preventDefault();ev.stopImmediatePropagation();selected=upload.dataset.csUpload;window.seiyunUploadDestination='menu';$('#productImage')?.click();return;}
 const b=ev.target.closest('[data-cs-action]');if(!b)return;
 ev.preventDefault();ev.stopImmediatePropagation();
 const cmd=b.dataset.csAction;
 if(cmd==='designs'){templatesOpen=!templatesOpen;render();return;}
 if(cmd==='brand'){brandOpen=!brandOpen;render();return;}
 if(cmd==='close-photo'){photoId='';render();return;}
 if(cmd==='prev'||cmd==='next'){page+=cmd==='next'?1:-1;refreshMenu();return;}
 if(cmd==='reset-photo'){core.updatePhotoTransform(draft,photoId,{zoom:100,x:0,y:0});save();render();return;}
 if(cmd==='signout'){Promise.resolve(window.seiyunCloud?.signOut?.()).then(()=>location.reload()).catch(e=>notify('Sign out failed: '+e.message,true));return;}
 if(cmd==='upload-logo'){$('#csLogoFile')?.click();return;}
 if(cmd==='ad-upload'){const p=core.chooseProduct(draft,showcase().productId);if(p){selected=p.id;window.seiyunUploadDestination='showcase';$('#productImage')?.click();}else notify('Add a product before uploading.',true);return;}
 if(cmd==='add-drink'){draft.products.push({id:uid(),name:'New drink',category:'Other',description:'',ingredients:'',photos:[],primary:0,enabled:true,sizes:[{id:uid(),name:'Regular',price:0}]});page=999;save();render();return;}
 if(['pdf','png','jpg'].includes(cmd)){
  b.disabled=true;
  if(cmd==='pdf'){
   try{window.SeiyunMenuGallery.printMenu();notify('Use Save as PDF in the print window.');}
   catch(e){notify('Print failed: '+e.message,true);}
   finally{b.disabled=false;}
   return;
  }
  Promise.resolve(window.SeiyunMenuGallery.exportImages(cmd))
   .then(()=>notify('Artwork download started.'))
   .catch(e=>notify('Export failed: '+e.message,true))
   .finally(()=>b.disabled=false);
  return;
 }
 if(cmd==='play'){window.SeiyunShowcase?.toggle?.();return;}
 if(['video','gif','cutout','still'].includes(cmd)){b.disabled=true;const fn=cmd==='video'?'downloadVideo':cmd==='gif'?'downloadGif':cmd==='still'?'downloadStill':'removeWhiteBackground';Promise.resolve(window.SeiyunShowcase?.[fn]?.(draft,showcase(),core)).then(result=>{if(result?.message)notify(result.message);if(result?.updated){save();render();}}).catch(e=>notify(e.message||String(e),true)).finally(()=>b.disabled=false);}
}
document.addEventListener('click',dataClick,true);
let csLastEditTarget=null,csLastEditTap=0;
document.addEventListener('click',ev=>{
 const el=ev.target.closest('[data-cs-edit]');if(!el||el.isContentEditable||!isOwnerRoute())return;
 ev.preventDefault();ev.stopImmediatePropagation();
 const now=Date.now();
 if(el!==csLastEditTarget||now-csLastEditTap>650){csLastEditTarget=el;csLastEditTap=now;return;}
 csLastEditTarget=null;csLastEditTap=0;
 const original=el.textContent;el.contentEditable='true';el.setAttribute('role','textbox');el.focus();
 el.addEventListener('blur',()=>{
  const field=el.dataset.csEdit,id=el.dataset.csProductId||el.closest('[data-menu-product]')?.dataset.menuProduct||showcase().productId;
  const ok=core.applyInlineEdit(draft,{field:field==='showcase.title'?'name':field,productId:id,value:el.textContent,sizeIndex:Number(el.dataset.csPriceIndex)||0});
  el.removeAttribute('contenteditable');if(ok&&el.textContent!==original)save();if(tab==='menu')refreshMenu();else render();
 },{once:true});
},true);
document.addEventListener('keydown',ev=>{if(ev.target.isContentEditable&&(ev.key==='Enter'||ev.key==='Escape')){ev.preventDefault();ev.target.blur();}});
document.addEventListener('input',ev=>{
 const v=ev.target.dataset?.csZoom;if(v&&photoId){core.updatePhotoTransform(draft,photoId,{[v]:Number(ev.target.value)});if(v==='zoom')$('#csZoomNumber').textContent=ev.target.value+'%';save();refreshMenu();}
 if(ev.target.id==='csDesignSearch'){search=ev.target.value;document.querySelectorAll('[data-cs-design]').forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(search.toLowerCase()));}
});
document.addEventListener('change',async ev=>{
 const el=ev.target;
 if(el.id==='csFormat'){config().format=el.value;page=0;save();refreshMenu();}
 if(el.dataset?.csBrand){draft.branding={...branding(),[el.dataset.csBrand]:el.value};save();render();}
 if(el.id==='csShowLogo'){draft.branding={...branding(),showLogo:el.checked};save();render();}
 if(el.id==='csLogoFile'){const file=el.files?.[0];el.value='';if(!file)return;try{if(!window.seiyunCloud?.upload)throw Error('Online login required for logo upload');const url=await window.seiyunCloud.upload(file);draft.branding={...branding(),logoUrl:url,showLogo:true};save();render();}catch(e){notify('Logo upload failed: '+e.message,true);}}
 if(el.id==='csProductSelect'){draft.showcaseArtwork={...showcase(),productId:el.value};save();render();}
 if(el.id==='csAdColor'){draft.showcaseArtwork={...showcase(),background:el.value};save();render();}
 if(el.id==='csAdSpeed'){draft.showcaseArtwork={...showcase(),speed:Number(el.value)};save();window.SeiyunShowcase?.update?.(draft,showcase(),core);}
 if(el.id==='csAdDuration'){draft.showcaseArtwork={...showcase(),duration:Number(el.value)};save();}
});
window.addEventListener('resize',()=>{if(isOwnerRoute()&&tab==='menu')fitPage();});
const oldMini=typeof renderEditMiniPreview==='function'?renderEditMiniPreview:null;
if(oldMini)renderEditMiniPreview=function(){oldMini();if(isOwnerRoute()&&draft)render();};
window.SeiyunCreative={render:renderCreative,refreshMenu};
})();
