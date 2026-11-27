/* Seiyun owner Menu Artifact Generator — existing product data, no stock photographs. */
(function(root){
'use strict';
const FAMILY=[
{id:'photo-left',name:'Photo Left',mode:'rows',capacity:9,source:'menu-pages'},
{id:'photo-right',name:'Photo Right',mode:'rows',capacity:9,source:'menu-pages'},
{id:'photo-cards',name:'Photo Cards',mode:'cards',capacity:9,source:'caresdev'},
{id:'gallery',name:'Gallery Grid',mode:'gallery',capacity:8,source:'themefisher'},
{id:'editorial',name:'Editorial Feature',mode:'editorial',capacity:7,source:'menu-pages'},
{id:'classic',name:'Classic List',mode:'classic',capacity:16,source:'themefisher'},
{id:'split',name:'Feature & List',mode:'split',capacity:8,source:'colorlib'},
{id:'compact',name:'Compact Menu',mode:'compact',capacity:15,source:'caresdev'}
];
const LOOK=[
{id:'warm',name:'Warm Cream',bg:'#fbf4e9',card:'#fffdfa',text:'#35241e',sub:'#755c4d',accent:'#8e4c36',border:'#e4d5c4'},
{id:'dark',name:'Dark Espresso',bg:'#241b19',card:'#342621',text:'#fff5e9',sub:'#dac4b2',accent:'#e5aa72',border:'#5a4337'},
{id:'clean',name:'Modern White',bg:'#f6f8f7',card:'#ffffff',text:'#173b36',sub:'#54716b',accent:'#278575',border:'#d9e8e3'}
];
const SOURCE={
'menu-pages':{label:'Restaurant Menu Pages (MIT-described)',url:'https://github.com/aymalkhalid/restaurant-menu-pages'},
'caresdev':{label:'Caresdev Restaurant Menu (MIT)',url:'https://github.com/caresdev/restaurant-menu'},
'themefisher':{label:'Themefisher Restaurant Bootstrap (MIT code)',url:'https://github.com/themefisher/restaurant-bootstrap'},
'colorlib':{label:'Colorlib Tavola (MIT code)',url:'https://github.com/ColorlibHQ/bootstrap-templates/tree/main/tavola'},
'opentempl':{label:'OpenTempl native menu designs (MIT)',url:'https://github.com/noah-thing/opentempl'}
};
const PACK=Array.isArray(root.SeiyunOpenMenuPack)?root.SeiyunOpenMenuPack:[];
const IMPORTED=PACK.map(t=>Object.freeze({id:'opentempl:'+t.id,title:t.name,layout:'native',tone:'source',source:'opentempl',sourceId:t.id,recommendedFormat:root.SeiyunOpenMenuAdapter?.inferredFormat(t)||'a4',vibe:t.vibe||'Menu'}));
const REGISTRY=Object.freeze([...FAMILY.flatMap(f=>LOOK.map(l=>Object.freeze({id:f.id+'-'+l.id,title:f.name+' · '+l.name,layout:f.id,tone:l.id,source:f.source}))),...IMPORTED]);
const FORMATS=Object.freeze({
letter:{label:'US Letter · portrait',w:816,h:1056,print:'letter'},
a4:{label:'A4 · portrait',w:794,h:1123,print:'A4'},
portrait:{label:'Digital portrait · 1080×1920',w:1080,h:1920,print:'1080px 1920px'},
landscape:{label:'Digital landscape · 1920×1080',w:1920,h:1080,print:'1920px 1080px'},
square:{label:'Square · 1080×1080',w:1080,h:1080,print:'1080px 1080px'}
});
const DEFAULT=Object.freeze({templateId:'photo-left-warm',format:'letter',imageSpace:43,photoSizeByProduct:{}});
function clamp(n,lo,hi){n=Number(n);return Number.isFinite(n)?Math.min(hi,Math.max(lo,n)):lo;}
function esc(v){return String(v===null||v===undefined?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function safePhoto(url){if(!url||!String(url).trim())return '';try{const u=new URL(String(url));if(u.protocol==='https:'||u.protocol==='http:'||u.protocol==='blob:'||u.protocol==='data:'&&u.href.startsWith('data:image/'))return u.href;}catch(e){}return '';}
function getSettings(state){const x=state?.menuArtwork||{};return {
templateId:REGISTRY.find(t=>t.id===x.templateId)?.id||DEFAULT.templateId,
format:FORMATS[x.format]?x.format:DEFAULT.format,
imageSpace:clamp(x.imageSpace===undefined?DEFAULT.imageSpace:x.imageSpace,25,70),
photoSizeByProduct:typeof x.photoSizeByProduct==='object'&&x.photoSizeByProduct!==null&&!Array.isArray(x.photoSizeByProduct)?x.photoSizeByProduct:{},
photoTransformByProduct:typeof x.photoTransformByProduct==='object'&&x.photoTransformByProduct!==null&&!Array.isArray(x.photoTransformByProduct)?x.photoTransformByProduct:{},
layoutOverrides:typeof x.layoutOverrides==='object'&&x.layoutOverrides!==null&&!Array.isArray(x.layoutOverrides)?x.layoutOverrides:{}
};}
function productsOf(state){return (Array.isArray(state?.products)?state.products:[]).filter(p=>p&&p.enabled!==false).map(p=>({
id:String(p.id||''),name:String(p.name||'Untitled product'),category:String(p.category||'Menu'),ingredients:String(p.ingredients||''),
sizes:(Array.isArray(p.sizes)?p.sizes:[]).filter(s=>s&&s.name&&String(s.price??'').trim()!=='').map(s=>({name:String(s.name),price:Number(s.price)})),
photo:safePhoto((Array.isArray(p.photos)?p.photos:[])[Number(p.primary)||0]||(Array.isArray(p.photos)?p.photos[0]:''))
}));}
function currency(v,state){const n=Number(v);const symbol={USD:'$',CAD:'CA$',EUR:'€',GBP:'£',AED:'AED ',SAR:'SAR ',INR:'₹',JPY:'¥'}[state?.currency]||'$';return Number.isFinite(n)?symbol+n.toFixed(state?.currency==='JPY'?0:2):'Price TBD';}
function prices(p,state){if(!p.sizes.length)return '<span class="mg-no-price">Price to add</span>';return p.sizes.map((s,i)=>'<span>'+esc(s.name)+' <b data-cs-edit="price" data-cs-price-index="'+i+'">'+esc(currency(s.price,state))+'</b></span>').join('');}
function capacityFor(state,config){const t=REGISTRY.find(t=>t.id===config.templateId)||REGISTRY[0];const f=FAMILY.find(f=>f.id===t.layout);const fmt=FORMATS[config.format]||FORMATS.letter;const aspect=fmt.h/fmt.w;let factor=aspect<.8?.73:aspect<1.15?.87:aspect>1.6?1.35:1;const maxSpace=Math.max(clamp(config.imageSpace,25,70),...Object.values(config.photoSizeByProduct||{}).map(x=>clamp(x,25,70)));const photoFactor=1+(43-maxSpace)/60;return Math.min(25,Math.max(2,Math.floor(f.capacity*factor*photoFactor)));}
function paginate(items,perPage){const pages=[];for(let i=0;i<items.length;i+=perPage)pages.push(items.slice(i,i+perPage));return pages.length?pages:[[]];}
function thumb(p,space,opts={}){const n=clamp(space,25,70),tr=opts.photoTransformByProduct?.[p.id]||{},zoom=clamp(tr.zoom||100,100,240),x=clamp(tr.x||0,-60,60),y=clamp(tr.y||0,-60,60);
return '<div class="mg-item-photo" data-cs-photo="'+esc(p.id)+'" style="--mg-photo-space:'+n+'%">'+(p.photo?'<img src="'+esc(p.photo)+'" alt="'+esc(p.name)+'" loading="eager" crossorigin="anonymous" style="transform:translate('+x+'%, '+y+'%) scale('+(zoom/100)+');transform-origin:center">':'<span class="mg-photo-empty">PHOTO TO ADD</span>')+'</div>';}
function itemHTML(p,state,opts){const custom=opts.photoSizeByProduct[p.id],space=custom===undefined?opts.imageSpace:clamp(custom,25,70);
return '<article class="mg-item '+(space>55?'mg-item-largephoto':'')+'" data-menu-product="'+esc(p.id)+'" style="--mg-photo-space:'+space+'%">'+thumb(p,space,opts)+'<div class="mg-item-info"><div class="mg-item-name" data-cs-edit="name">'+esc(p.name)+'</div><div class="mg-item-ingredients" data-cs-edit="ingredients">'+esc(p.ingredients)+'</div><div class="mg-item-prices">'+prices(p,state)+'</div></div></article>';}
function pageHTML(state,opts,items,index,count){
const t=REGISTRY.find(t=>t.id===opts.templateId)||REGISTRY[0],family=FAMILY.find(f=>f.id===t.layout),look=LOOK.find(l=>l.id===t.tone)||LOOK[0],size=FORMATS[opts.format];
const hero=items.length&&['editorial','split'].includes(family.id)?items[0]:null;
const cols=family.id==='photo-cards'?3:['gallery','editorial','classic','split','compact'].includes(family.id)?2:1;
const branding=state?.branding||{},color=v=>/^#[0-9a-f]{6}$/i.test(String(v||''))?v:null;
const font=({fraunces:'Fraunces, Georgia, serif','dm-sans':'DM Sans, Arial, sans-serif',serif:'Georgia, serif',system:'Arial, sans-serif'})[branding.font]||'Fraunces, Georgia, serif';
const vars='--mg-display-font:'+font+';--mg-rows:'+Math.max(1,Math.ceil(items.length/cols))+';--mg-bg:'+(color(branding.background)||look.bg)+';--mg-card:'+look.card+';--mg-ink:'+(color(branding.text)||look.text)+';--mg-sub:'+look.sub+';--mg-accent:'+(color(branding.accent)||look.accent)+';--mg-line:'+look.border+';--mg-width:'+size.w+'px;--mg-height:'+size.h+'px;';
return '<section class="mg-export-page mg-layout-'+family.id+' mg-tone-'+look.id+'" style="'+vars+'" data-page="'+(index+1)+'" data-count="'+items.length+'">'+
'<header class="mg-page-header"><div class="mg-brand">'+(branding.showLogo&&safePhoto(branding.logoUrl)?'<img class="mg-brand-logo" src="'+esc(safePhoto(branding.logoUrl))+'" alt="'+esc(branding.name||'Café logo')+'">':'<span class="mg-brand-name" data-cs-edit="brand.name">'+esc(branding.name||'seiyun')+'</span>')+'<small data-cs-edit="brand.tagline">'+esc(branding.tagline??'YEMENI COFFEE')+'</small></div><span>OUR MENU</span></header>'+
(hero?'<div class="mg-hero"><div class="mg-hero-copy"><small>FROM OUR COLLECTION</small><h2>'+esc(hero.name)+'</h2><p>'+esc(hero.ingredients)+'</p><div class="mg-hero-prices">'+prices(hero,state)+'</div></div>'+thumb(hero,opts.imageSpace,opts)+'</div>':'')+
'<div class="mg-page-body">'+(items.length?items.map(p=>itemHTML(p,state,opts)).join(''):'<p class="mg-empty">No products to show yet. Add your menu items to get started.</p>')+'</div>'+
'<footer class="mg-page-footer"><span>'+esc(t.title)+'</span><span>Page '+(index+1)+' of '+count+'</span></footer></section>';
}
function renderPages(state,config){const opts={...getSettings(state),...(config||{})};opts.imageSpace=clamp(opts.imageSpace,25,70);if(!FORMATS[opts.format])opts.format='letter';if(!REGISTRY.find(t=>t.id===opts.templateId))opts.templateId=DEFAULT.templateId;
const currentTemplate=REGISTRY.find(t=>t.id===opts.templateId);
if(currentTemplate?.source==='opentempl'){
 const doc=PACK.find(t=>t.id===currentTemplate.sourceId);
 if(!doc||!root.SeiyunOpenMenuAdapter)throw Error('Imported design renderer is unavailable');
 const r=root.SeiyunOpenMenuAdapter.render(state,doc,{format:opts.format,layoutOverrides:opts.layoutOverrides?.[opts.templateId]||{}});
 return {...r,options:{...opts,format:r.options.format},capacity:r.pageCount};
}
const items=productsOf(state),capacity=capacityFor(state,opts),groups=paginate(items,capacity);
return {pageCount:groups.length,productCount:items.length,capacity,pages:groups.map((g,i)=>pageHTML(state,opts,g,i,groups.length)),options:opts};}
function getDraft(){return typeof draft!=='undefined'?draft:null;}
function ensureDraftConfig(){const state=getDraft();if(!state)return {...DEFAULT,photoSizeByProduct:{}};state.menuArtwork={...getSettings(state)};return state.menuArtwork;}
function thumbnailHTML(state,t){
 const fmt=t.recommendedFormat||getSettings(state).format||'letter';
 const rendered=renderPages(state,{templateId:t.id,format:fmt});
 const markup=rendered.pages[0]||'';
 const w=FORMATS[fmt]?.w||816,h=FORMATS[fmt]?.h||1056;
 const scale=Math.min(156/w,185/h);
 return '<span class="cs-live-thumb" role="img" aria-label="Real preview of '+esc(t.title)+'"><span class="cs-live-thumb-sheet" style="width:'+w+'px;height:'+h+'px;margin-left:'+(-(w*scale/2)).toFixed(2)+'px;transform:scale('+scale.toFixed(5)+')">'+markup+'</span></span>';
}
function galleryCard(t,settings){const l=LOOK.find(x=>x.id===t.tone),f=FAMILY.find(x=>x.id===t.layout);
const sample=productsOf(getDraft()||{}).slice(0,3),sampleP=sample.find(x=>x.photo)||sample[0],miniPhoto=sampleP?.photo?'<img src="'+esc(sampleP.photo)+'" alt="" loading="lazy">':'<span>☕</span>';
return '<button type="button" class="mg-template-card '+(settings.templateId===t.id?'selected':'')+'" data-menu-template="'+esc(t.id)+'" aria-pressed="'+(settings.templateId===t.id)+'">'+
'<span class="mg-template-thumb mg-mini-'+esc(f.id)+'" style="--mg-bg:'+l.bg+';--mg-card:'+l.card+';--mg-ink:'+l.text+';--mg-accent:'+l.accent+'">'+
'<span class="mg-mini-brand">seiyun</span><span class="mg-mini-products">'+[0,1,2].map(()=>'<span class="mg-mini-item"><span class="mg-mini-photo">'+miniPhoto+'</span><span class="mg-mini-lines"><i></i><i></i></span></span>').join('')+'</span></span>'+
'<span class="mg-template-name">'+esc(t.title)+'</span><span class="mg-template-meta">'+esc(f.mode)+' design</span></button>';
}
function renderMenuGallery(){const state=getDraft();if(!state||typeof shell!=='function')return;const settings=ensureDraftConfig(),result=renderPages(state,settings),selection=REGISTRY.find(t=>t.id===settings.templateId);
const box='<div class="mg-library"><div class="mg-library-intro"><div><h2>Choose a menu design</h2><p>Your products, prices, ingredients and photos fill every design automatically. Change designs any time.</p></div><strong>'+REGISTRY.length+' designs</strong></div>'+
'<div class="mg-gallery-grid">'+REGISTRY.map(t=>galleryCard(t,settings)).join('')+'</div>'+
'<div class="mg-builder" id="mgBuilder"><div class="mg-builder-top"><div><h2>Preview your menu</h2><p>'+esc(selection.title)+' · '+result.productCount+' products · <strong id="mgPageCount">'+result.pageCount+' page(s)</strong></p></div><div class="mg-actions"><button class="button small" data-menu-action="print">Print / Save PDF</button><button class="button small primary" data-menu-action="png">Download PNG</button><button class="button small" data-menu-action="jpg">Download JPG</button></div></div>'+
'<div class="mg-controls"><label>Output size<select id="mgFormat">'+Object.entries(FORMATS).map(([id,f])=>'<option value="'+id+'" '+(settings.format===id?'selected':'')+'>'+esc(f.label)+'</option>').join('')+'</select></label>'+
'<label>Photo space <strong id="mgSpaceValue">'+settings.imageSpace+'%</strong><input type="range" min="25" max="70" step="1" id="mgImageSpace" value="'+settings.imageSpace+'"></label>'+
'<label>Adjust one drink <select id="mgPhotoProduct"><option value="">All drinks (default)</option>'+productsOf(state).map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+'</option>').join('')+'</select></label>'+
'<label>Selected drink space <strong id="mgIndividualValue">'+settings.imageSpace+'%</strong><input type="range" id="mgProductImageSpace" min="25" max="70" value="'+settings.imageSpace+'" disabled></label></div>'+
'<p class="mg-photo-explain">Full drink photos are fitted without cropping. Larger pictures can use more pages. Download directly from your draft—publishing to a screen is not required.</p>'+
'<div class="mg-preview-tools"><button class="button small" data-menu-action="prev" id="mgPrevPage">Previous page</button><span id="mgPageLabel">Page 1 of '+result.pageCount+'</span><button class="button small" data-menu-action="next" id="mgNextPage">Next page</button></div>'+
'<div class="mg-preview-shell"><div class="mg-page-holder" id="mgPageHolder">'+result.pages[0]+'</div></div><p class="mg-credit">Design patterns informed by reviewed open-source restaurant menus. No sample photos included. <a href="'+esc(SOURCE[selection.source].url)+'" target="_blank" rel="noopener">View source inspiration</a></p></div></div>';
document.querySelector('#app').innerHTML=shell(box);root.SeiyunMenuGallery.currentPage=0;
if(typeof requestAnimationFrame==='function')requestAnimationFrame(updatePreview);
}
function fitPreview(holder,format){const el=holder.firstElementChild;if(!el)return;const size=FORMATS[format],maxWidth=Math.max(260,holder.clientWidth||650),scale=Math.min(1,maxWidth/size.w);el.style.setProperty('--mg-preview-scale',String(scale));holder.style.height=Math.ceil(size.h*scale)+'px';}
function updatePreview(){const holder=document.querySelector('#mgPageHolder');if(!holder)return;
const r=renderPages(getDraft(),ensureDraftConfig()),page=Math.max(0,Math.min(root.SeiyunMenuGallery.currentPage||0,r.pageCount-1));
root.SeiyunMenuGallery.currentPage=page;holder.innerHTML=r.pages[page];fitPreview(holder,r.options.format);
const l=document.querySelector('#mgPageLabel');if(l)l.textContent='Page '+(page+1)+' of '+r.pageCount;
const c=document.querySelector('#mgPageCount');if(c)c.textContent=r.pageCount+' page(s)';
const prev=document.querySelector('#mgPrevPage'),next=document.querySelector('#mgNextPage');if(prev)prev.disabled=page<=0;if(next)next.disabled=page>=r.pageCount-1;
}
function ownerFilename(state){return String(state?.branding?.name||'cafe').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,45)||'cafe';}
function printMenu(){const opts=ensureDraftConfig(),result=renderPages(getDraft(),opts),format=FORMATS[opts.format];
const head='<meta charset="utf-8"><title>'+esc((getDraft()?.branding?.name||'Cafe')+' Menu')+'</title><link rel="stylesheet" href="'+esc(new URL('menu-gallery.css',document.baseURI).href)+'"><style>@page{size:'+format.print+';margin:0}html,body{margin:0;padding:0;background:white}.mg-print-stage{display:block}.mg-export-page{break-after:page;page-break-after:always;box-shadow:none!important;border-radius:0!important}.mg-export-page:last-child{break-after:auto}</style>';
const popup=root.open('','_blank');if(!popup)throw Error('Please allow pop-ups to print your menu.');
popup.document.write('<!doctype html><html><head>'+head+'</head><body><main class="mg-print-stage">'+result.pages.join('')+'</main></body></html>');popup.document.close();
let hasPrinted=false;
const beginPrint=async()=>{
 if(hasPrinted||popup.closed)return;
 hasPrinted=true;
 const images=[...popup.document.images];
 const wait=images.map(img=>img.complete?Promise.resolve():new Promise(resolve=>{
   img.addEventListener('load',resolve,{once:true});
   img.addEventListener('error',resolve,{once:true});
 }));
 await Promise.race([Promise.all(wait),new Promise(resolve=>setTimeout(resolve,10000))]);
 if(popup.closed)return;
 if(images.some(img=>!img.naturalWidth)){
   const notice=popup.document.createElement('p');
   notice.textContent='Some product photos did not load. Check your connection and reload the menu before printing.';
   notice.style.cssText='color:#8a342a;padding:20px;background:#fff0eb;font:16px Arial';
   popup.document.body.prepend(notice);
   return;
 }
 popup.focus();popup.print();
};
popup.addEventListener('load',beginPrint,{once:true});
setTimeout(beginPrint,3500);
}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);}
async function exportImages(kind){const opts=ensureDraftConfig(),result=renderPages(getDraft(),opts);
if(typeof root.html2canvas!=='function')throw Error('Image export library is unavailable. Check your connection or use Print / Save PDF.');
const container=document.createElement('div');container.className='mg-export-host';container.style.cssText='position:fixed;left:-100000px;top:0;pointer-events:none;z-index:-1;';document.body.append(container);
try{const files=[];
for(let i=0;i<result.pages.length;i++){container.innerHTML=result.pages[i];const el=container.firstElementChild;
await Promise.all([...el.querySelectorAll('img')].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;setTimeout(resolve,4500);})));
if([...el.querySelectorAll('img')].some(img=>!img.naturalWidth))throw Error('A product photo did not load for export. Retry or use Print / Save PDF.');
const canvas=await root.html2canvas(el,{backgroundColor:null,scale:2,useCORS:true,allowTaint:false,logging:false});
const type=kind==='jpg'?'image/jpeg':'image/png',ext=kind==='jpg'?'jpg':'png';
const blob=await new Promise(resolve=>canvas.toBlob(resolve,type,kind==='jpg'?.94:undefined));
if(!blob)throw Error('Browser could not encode your menu image. Try Print / Save PDF.');
files.push({name:ownerFilename(getDraft())+'-menu-page-'+String(i+1).padStart(2,'0')+'.'+ext,blob});}
if(files.length===1){downloadBlob(files[0].blob,files[0].name);return;}
if(typeof root.JSZip!=='function')throw Error('Multi-page export needs ZIP support. Check your connection or use Print / Save PDF.');
const zip=new root.JSZip();files.forEach(f=>zip.file(f.name,f.blob));downloadBlob(await zip.generateAsync({type:'blob'}),ownerFilename(getDraft())+'-menu-'+kind+'-pages.zip');
}finally{container.remove();}}
function updateSettings(fn){const o=ensureDraftConfig();fn(o);if(typeof saveSoon==='function')saveSoon();updatePreview();}
function bindEvents(){if(typeof document==='undefined')return;
document.addEventListener('click',async ev=>{
const template=ev.target.closest('[data-menu-template]');if(template){const id=template.dataset.menuTemplate;if(!REGISTRY.some(t=>t.id===id))return;updateSettings(o=>{o.templateId=id});renderMenuGallery();document.querySelector('#mgBuilder')?.scrollIntoView({block:'start',behavior:'smooth'});return;}
const act=ev.target.closest('[data-menu-action]');if(!act)return;const a=act.dataset.menuAction;
if(a==='prev'||a==='next'){root.SeiyunMenuGallery.currentPage+=a==='next'?1:-1;updatePreview();return;}
try{act.disabled=true;if(a==='print')printMenu();else if(a==='png'||a==='jpg')await exportImages(a);}
catch(e){if(typeof toasts==='function')toasts('Menu export: '+e.message,true);else alert(e.message);}finally{act.disabled=false;}
});
document.addEventListener('input',ev=>{
if(ev.target.id==='mgImageSpace'){const v=clamp(ev.target.value,25,70),l=document.querySelector('#mgSpaceValue');if(l)l.textContent=v+'%';if(getDraft()){ensureDraftConfig().imageSpace=v;updatePreview();}}
if(ev.target.id==='mgProductImageSpace'){const v=clamp(ev.target.value,25,70),l=document.querySelector('#mgIndividualValue');if(l)l.textContent=v+'%';const sel=document.querySelector('#mgPhotoProduct');if(sel?.value){ensureDraftConfig().photoSizeByProduct[sel.value]=v;updatePreview();}}
});
document.addEventListener('change',ev=>{
if(ev.target.id==='mgFormat'){updateSettings(o=>o.format=FORMATS[ev.target.value]?ev.target.value:'letter');}
if(ev.target.id==='mgImageSpace'||ev.target.id==='mgProductImageSpace'){if(typeof saveSoon==='function')saveSoon();updatePreview();}
if(ev.target.id==='mgPhotoProduct'){const inp=document.querySelector('#mgProductImageSpace'),v=document.querySelector('#mgIndividualValue'),o=ensureDraftConfig();
if(inp){inp.disabled=!ev.target.value;inp.value=ev.target.value?(o.photoSizeByProduct[ev.target.value]||o.imageSpace):o.imageSpace;}if(v)v.textContent=inp.value+'%';}
});
}
root.SeiyunMenuGallery={registry:REGISTRY,formats:FORMATS,sources:SOURCE,defaults:DEFAULT,productsOf,renderPages,thumbnailHTML,capacityFor,getSettings,printMenu,exportImages,currentPage:0};
root.renderMenuGallery=renderMenuGallery;
if(typeof document!=='undefined')bindEvents();
})(typeof window!=='undefined'?window:globalThis);
