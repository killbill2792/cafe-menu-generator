/* Owner-facing two-feature Creative Studio; legacy public and screen links remain intact. */
(function(){
'use strict';
if(typeof document==='undefined'||!window.SeiyunCreativeCore)return;
const core=window.SeiyunCreativeCore;
const $=q=>document.querySelector(q);
const esc=v=>String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
let page=0,photoId='',templatesOpen=false,brandOpen=false,search='',gallerySource='all',renderToken=0;
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
 const lib=window.SeiyunMenuGallery,settings=lib.getSettings(draft),templates=lib.registry.filter(t=>gallerySource==='all'||(gallerySource==='source'?t.kind==='source-menu':t.kind!=='source-menu'));
 return templates.map(t=>{
   const formatted=(t.layout==='source-digital')?'landscape':'letter',sz=lib.formats[formatted],scale=Math.min(0.235,185/sz.w,240/sz.h);
   const art=lib.renderPages(draft,{...settings,format:formatted,templateId:t.id}),page=art.pages[0].replace(/loading="eager"/g,'loading="lazy"');
   const left=-(sz.w*scale)/2;
   const badge=t.kind==='source-menu'?'OpenTempl · MIT':'Seiyun layout · original';
   return '<button type="button" class="cs-design '+(settings.templateId===t.id?'selected':'')+'" data-cs-design="'+esc(t.id)+'" aria-pressed="'+(settings.templateId===t.id)+'" data-source="'+(t.kind==='source-menu'?'imported':'built-in')+'">'+
     '<span class="cs-design-preview" aria-hidden="true"><span class="cs-design-sheet" style="width:'+sz.w+'px;height:'+sz.h+'px;left:50%;margin-left:'+left.toFixed(2)+'px;transform:scale('+scale.toFixed(4)+')">'+page+'</span></span>'+
     '<span class="cs-design-caption"><strong>'+esc(t.title)+'</strong><small>'+badge+'</small><small>'+art.pageCount+' page'+(art.pageCount===1?'':'s')+' with your products</small></span></button>';
 }).join('');
}
function menuUI(){
 const lib=window.SeiyunMenuGallery,opts=lib.getSettings(draft),data=lib.renderPages(draft,opts);
 page=Math.max(0,Math.min(data.pageCount-1,page));
 return '<div class="cs-intro"><div><small>MENU GENERATOR</small><h1>Make your menu yours.</h1><p>Your café information is already here. Click text or a photo on the finished menu to edit.</p></div><div class="cs-actions"><button class="cs-btn" data-cs-action="designs">Browse '+lib.registry.length+' designs</button><button class="cs-btn" data-cs-action="brand">Customize brand</button></div></div>'+
 (templatesOpen?'<section class="cs-designs"><div class="cs-panel-head"><strong>Choose your menu design</strong><button data-cs-action="designs">×</button></div><div class="cs-gallery-filters"><button data-cs-gallery-filter="all" class="'+(gallerySource==='all'?'active':'')+'">All designs</button><button data-cs-gallery-filter="source" class="'+(gallerySource==='source'?'active':'')+'">Imported open source</button><button data-cs-gallery-filter="built-in" class="'+(gallerySource==='built-in'?'active':'')+'">Existing layouts</button></div><input id="csDesignSearch" type="search" placeholder="Search designs" value="'+esc(search)+'"><p class="cs-gallery-note">These are previews of your actual menu—not illustrative color swatches. Imported templates retain original MIT source attribution.</p><div class="cs-design-grid">'+templateTiles()+'</div></section>':'')+
 brandPanel()+
 '<section class="cs-workspace"><div class="cs-toolbar"><label>Format <select id="csFormat">'+Object.entries(lib.formats).map(([v,o])=>'<option value="'+v+'" '+(opts.format===v?'selected':'')+'>'+esc(o.label)+'</option>').join('')+'</select></label><label>Layout density <select id="csDensity"><option value="balanced" '+(opts.density==='balanced'?'selected':'')+'>Balanced</option><option value="compact" '+(opts.density==='compact'?'selected':'')+'>Compact · more products</option><option value="spacious" '+(opts.density==='spacious'?'selected':'')+'>Spacious · larger photos</option></select></label><span id="csItems">'+data.productCount+' items · '+data.pageCount+' pages</span><div class="cs-actions"><button class="cs-btn" data-cs-action="add-drink">+ Product</button><button class="cs-btn" data-cs-action="pdf">PDF / Print</button><button class="cs-btn primary" data-cs-action="png">Download PNG</button><button class="cs-btn" data-cs-action="jpg">JPG</button></div></div>'+
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
}
function showcaseUI(){
 const cfg=showcase(),p=core.chooseProduct(draft,cfg.productId),photo=core.selectedShowcasePhoto(p);
 const products=draft.products.filter(x=>x.enabled!==false),scenes=window.SeiyunHeroScenes?.MODES||[];
 return '<div class="cs-intro"><div><small>PRODUCT SHOWCASE</small><h1>One drink. An unforgettable impression.</h1><p>Choose your drink, preview real cinematic motion, move the cup or text directly on the artwork, then download.</p></div></div>'+
 '<div class="cs-showcase-grid"><section class="cs-showcase-tools"><label class="cs-field">Your product<select id="csProductSelect">'+products.map(x=>'<option value="'+esc(x.id)+'" '+(p?.id===x.id?'selected':'')+'>'+esc(x.name||'New drink')+'</option>').join('')+'</select></label>'+
 '<div class="cs-choose-photos"><strong>Product photograph</strong><div class="cs-photo-thumbs">'+(p?.photos?.length?p.photos.map((url,i)=>'<button data-cs-ad-photo="'+i+'" class="'+(photo===url?'selected':'')+'"><img src="'+esc(url)+'" alt="Photo '+(i+1)+'"></button>').join(''):'<p>Upload a real drink photograph to begin.</p>')+'</div><button class="cs-btn" data-cs-action="ad-upload">+ Upload photo</button></div>'+
 '<strong>Choose an advertising scene</strong><div class="cs-scene-gallery">'+scenes.map(m=>'<button type="button" class="cs-scene-option '+(cfg.mode===m.id?'selected':'')+'" data-cs-motion="'+m.id+'"><canvas width="180" height="280" data-cs-scene-thumb="'+m.id+'" aria-hidden="true"></canvas><span><b>'+esc(m.name)+'</b><small>'+esc(m.short)+'</small></span></button>').join('')+'</div>'+
 '<details class="cs-ad-customize"><summary>Background & export options</summary><div class="cs-ad-fields"><label class="cs-field">Output size<select id="csAdFormat">'+[['portrait','Portrait 9:16'],['landscape','Landscape 16:9'],['square','Square 1:1']].map(([v,n])=>'<option value="'+v+'" '+(cfg.format===v?'selected':'')+'>'+n+'</option>').join('')+'</select></label>'+
 '<label class="cs-field">Custom background <input id="csAdColor" type="color" value="'+(cfg.customBackground?cfg.background:'#6b3928')+'"></label>'+
 '<label class="cs-field">Animation speed<input id="csAdSpeed" type="range" min=".25" max="2.5" step=".25" value="'+cfg.speed+'"></label>'+
 '<label class="cs-field">Length<select id="csAdDuration">'+[5,7,10,15].map(n=>'<option value="'+n+'" '+(Number(cfg.duration)===n?'selected':'')+'>'+n+' seconds</option>').join('')+'</select></label>'+
 '<label class="cs-check"><input id="csAutoCutout" type="checkbox" '+(cfg.autoCutout?'checked':'')+'> Automatically remove simple white photo backgrounds</label></div></details></section>'+
 '<section class="cs-showcase-preview"><div class="cs-preview-topline"><span>LIVE PRODUCT AD</span><span>'+esc(cfg.mode)+' · '+esc(cfg.format)+'</span></div>'+
 '<div id="csAdStage" class="cs-ad-stage cs-stage-'+cfg.format+'"><div id="csMotion" class="cs-motion"></div></div>'+
 '<p class="cs-artwork-help">Tap the drink or any text to select it. Drag to reposition; drag its corner to resize. Double-tap text to edit.</p>'+
 '<div class="cs-actions cs-export"><button class="cs-btn" data-cs-action="play">Pause / Play</button><button class="cs-btn" data-cs-action="reset-layers">Reset positions</button></div>'+
 '<div class="cs-actions cs-export"><button class="cs-btn primary" data-cs-action="video">Download MP4 / WebM</button><button class="cs-btn" data-cs-action="gif">GIF</button><button class="cs-btn" data-cs-action="poster">Still PNG</button></div>'+
 '<div class="cs-actions"><button class="cs-btn" data-cs-action="cutout">Save transparent photo copy</button></div>'+
 '<p id="csMessage" class="cs-footnote">'+(photo?'Your selected product is ready. Live preview and downloads share the exact same scene.':'Upload a photo to see the single-product cinematic advertisement.')+'</p></section></div>';
}
function money(value){try{return new Intl.NumberFormat('en-US',{style:'currency',currency:draft.currency||'USD'}).format(value);}catch{return '$'+Number(value).toFixed(2);}}
function renderCreative(){
 if(!isOwnerRoute()){if(typeof renderTVView==='function')renderTVView();return;}
 if(!draft||!Array.isArray(draft.products))return;
 if(!['menu','showcase'].includes(tab))tab='menu';
 window.SeiyunShowcase?.destroy?.();
 const root=$('#app');root.innerHTML=shell(tab==='menu'?menuUI():showcaseUI());
 const n=++renderToken;
 if(tab==='menu')requestAnimationFrame(()=>{if(n===renderToken)fitPage();});
 else window.SeiyunShowcase?.mount?.($('#csMotion'),draft,showcase(),core,notify);
}
render=renderCreative;
function dataClick(ev){
 const route=ev.target.closest('[data-cs-tab]');if(route){ev.preventDefault();ev.stopImmediatePropagation();tab=route.dataset.csTab;page=0;photoId='';render();return;}
 const filter=ev.target.closest('[data-cs-gallery-filter]');if(filter){ev.preventDefault();ev.stopImmediatePropagation();gallerySource=filter.dataset.csGalleryFilter;search='';render();return;}
 const tpl=ev.target.closest('[data-cs-design]');if(tpl){ev.preventDefault();ev.stopImmediatePropagation();config().templateId=tpl.dataset.csDesign;const entry=window.SeiyunMenuGallery.registry.find(t=>t.id===tpl.dataset.csDesign);if(entry?.layout==='source-digital')config().format='landscape';page=0;save();render();return;}
 const motion=ev.target.closest('[data-cs-motion]');if(motion){ev.preventDefault();ev.stopImmediatePropagation();draft.showcaseArtwork={...showcase(),mode:motion.dataset.csMotion};save();render();return;}
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
 if(['pdf','png','jpg'].includes(cmd)){b.disabled=true;Promise.resolve().then(()=>cmd==='pdf'?window.SeiyunMenuGallery.printMenu():window.SeiyunMenuGallery.exportImages(cmd)).then(()=>notify(cmd==='pdf'?'Use Save as PDF in the print window.':'Artwork download started.')).catch(e=>notify('Export failed: '+e.message,true)).finally(()=>b.disabled=false);return;}
 if(cmd==='play'){window.SeiyunShowcase?.toggle?.();return;}
 if(cmd==='reset-layers'){window.SeiyunShowcase?.resetLayers?.(draft);notify('Product and text positions reset.');return;}
 if(['video','gif','cutout','poster'].includes(cmd)){b.disabled=true;const fn=cmd==='video'?'downloadVideo':cmd==='gif'?'downloadGif':cmd==='poster'?'downloadStill':'removeWhiteBackground';Promise.resolve(window.SeiyunShowcase?.[fn]?.(draft,showcase(),core)).then(result=>{if(result?.message)notify(result.message);if(result?.updated){save();render();}}).catch(e=>notify(e.message||String(e),true)).finally(()=>b.disabled=false);}
}
document.addEventListener('click',dataClick,true);
document.addEventListener('click',ev=>{
 const el=ev.target.closest('[data-cs-edit]');if(!el||el.isContentEditable||!isOwnerRoute())return;
 ev.preventDefault();ev.stopImmediatePropagation();
 const original=el.textContent;el.contentEditable='true';el.setAttribute('role','textbox');el.focus();
 el.addEventListener('blur',()=>{
  const field=el.dataset.csEdit,id=el.closest('[data-menu-product]')?.dataset.menuProduct||showcase().productId;
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
 if(el.id==='csDensity'){config().density=el.value;page=0;save();render();}
 if(el.dataset?.csBrand){draft.branding={...branding(),customColors:true,[el.dataset.csBrand]:el.value};save();render();}
 if(el.id==='csShowLogo'){draft.branding={...branding(),showLogo:el.checked};save();render();}
 if(el.id==='csLogoFile'){const file=el.files?.[0];el.value='';if(!file)return;try{if(!window.seiyunCloud?.upload)throw Error('Online login required for logo upload');const url=await window.seiyunCloud.upload(file);draft.branding={...branding(),logoUrl:url,showLogo:true};save();render();}catch(e){notify('Logo upload failed: '+e.message,true);}}
 if(el.id==='csProductSelect'){draft.showcaseArtwork={...showcase(),productId:el.value};save();render();}
 if(el.id==='csAdColor'){draft.showcaseArtwork={...showcase(),background:el.value,customBackground:true};save();render();}
 if(el.id==='csAdFormat'){draft.showcaseArtwork={...showcase(),format:el.value};save();render();}
 if(el.id==='csAutoCutout'){draft.showcaseArtwork={...showcase(),autoCutout:el.checked};save();render();}
 if(el.id==='csAdSpeed'){draft.showcaseArtwork={...showcase(),speed:Number(el.value)};save();window.SeiyunShowcase?.update?.(draft,showcase(),core);}
 if(el.id==='csAdDuration'){draft.showcaseArtwork={...showcase(),duration:Number(el.value)};save();}
});
window.addEventListener('resize',()=>{if(isOwnerRoute()&&tab==='menu')fitPage();});
const oldMini=typeof renderEditMiniPreview==='function'?renderEditMiniPreview:null;
if(oldMini)renderEditMiniPreview=function(){oldMini();if(isOwnerRoute()&&draft)render();};
window.SeiyunCreative={render:renderCreative,refreshMenu};
})();
