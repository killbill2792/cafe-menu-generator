/* Source-backed OpenTempl menu document adapter, MIT document data. See vendor/opentempl/LICENSE.
   No external example assets are loaded. Only allowlisted visual primitives are interpreted. */
(function(root){
'use strict';
const docs=(root.SeiyunOpenTemplDocs||[]).filter(d=>d&&d.category==='Menu'&&Array.isArray(d.pages));
const META={
 'food-menu-cafe-nord':{capacity:9,kind:'vertical',label:'Nordic Café · Photo & Prices'},
 'food-menu-checker-diner':{capacity:12,kind:'diner',label:'Retro Diner · Bold Cards'},
 'food-menu-noodle-bar':{capacity:11,kind:'editorial',label:'Noodle Bar · Editorial'},
 'food-menu-colour-cards':{capacity:16,kind:'colour',label:'Colour Blocks · Illustrated'},
 'food-menu-special-story':{capacity:1,kind:'poster',label:'Feature Poster · Full Product'},
 'food-menu-wine-list':{capacity:13,kind:'elegant',label:'Wine List · Minimal Type'},
 'food-menu-drinks-blocks':{capacity:15,kind:'blocks',label:'Drinks Blocks · Geometric'},
 'food-menu-lunch-week':{capacity:7,kind:'weekly',label:'Weekly Board · Wide Cards'},
 'food-menu-board-slide':{capacity:16,kind:'digital',label:'Digital Board · Landscape'}
};
const registry=Object.freeze(docs.filter(d=>META[d.id]).map(d=>Object.freeze({
 id:'opentempl:'+d.id,title:META[d.id].label,layout:'source-'+META[d.id].kind,kind:'source-menu',tone:'original',source:'opentempl',docId:d.id,pages:d.pages.length
})));
const escape=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[ch]));
const cssColor=(v,fallback)=>/^#[0-9a-f]{3,8}$/i.test(String(v||''))?v:fallback;
const safePhoto=v=>{try{const u=new URL(String(v||''));return /^(https?:|blob:)$/.test(u.protocol)||u.protocol==='data:'&&/^data:image\/(png|jpeg|webp);/i.test(v)?u.href:'';}catch{return ''}};
const sourceDoc=id=>docs.find(d=>d.id===id.replace(/^opentempl:/,''));
function capacity(templateId,format,density='balanced'){
 const d=sourceDoc(templateId),m=META[d?.id];if(!m)return 8;
 let cap=m.capacity;
 const dimensions={letter:[816,1056],a4:[794,1123],portrait:[1080,1920],landscape:[1920,1080],square:[1080,1080]};
 const [w,h]=dimensions[format]||dimensions.letter;
 if(m.kind==='poster')return 1;
 if(h/w<.85)cap=Math.floor(cap*.80);
 if(h/w>1.5)cap=Math.ceil(cap*1.15);
 if(density==='compact')cap=Math.ceil(cap*1.25);
 if(density==='spacious')cap=Math.max(2,Math.floor(cap*.80));
 return Math.min(24,Math.max(2,cap));
}
function groupBalanced(items,count){
 const pages=Math.max(1,Math.ceil(items.length/count)),sizes=Array(pages).fill(Math.floor(items.length/pages));
 for(let i=0;i<items.length%pages;i++)sizes[i]++;
 let start=0;return sizes.map(n=>{const value=items.slice(start,start+n);start+=n;return value;});
}
function documentPalette(doc){
 const bg=cssColor(doc.pages?.[0]?.background?.color,'#f9f1e3');
 const all=(doc.pages||[]).flatMap(p=>p.elements||[]),texts=all.filter(e=>e.type==='text');
 const dark=/^#(?:000|111|1[0-9a-f]{5}|2[0-9a-f]{5})$/i.test(bg);
 const color=cssColor(texts.find(t=>t.fontSize>40)?.color,dark?'#fff5e9':'#241c16');
 const accent=cssColor(all.find(e=>e.type==='shape'&&e.fill?.color&&e.fill.color.toLowerCase()!==bg.toLowerCase())?.fill?.color,dark?'#f6bc79':'#9d5c3c');
 return {bg,color,accent,dark};
}
function decorations(doc,firstPage,sourceFormat){
 // Preserve geometries/colors from the original author; draw only safe SVG-like rectangles and lines.
 const page=doc.pages?.[firstPage%doc.pages.length]||doc.pages?.[0],elements=page?.elements||[];
 const w=doc.width||794,h=doc.height||1123;
 return elements.filter(e=>e&&((e.type==='shape'&&e.shape==='rect')||e.type==='line')).map(e=>{
  const x=(e.x/w*100),y=(e.y/h*100),ew=(e.w/w*100),eh=(e.h/h*100);
  if(![x,y,ew,eh].every(Number.isFinite)||ew<0||eh<0)return '';
  const style='left:'+x.toFixed(3)+'%;top:'+y.toFixed(3)+'%;width:'+ew.toFixed(3)+'%;height:'+Math.max(.15,eh).toFixed(3)+'%;opacity:'+Math.min(1,Math.max(0,Number(e.opacity??1)))+';';
  if(e.type==='shape')return '<span class="mg-source-decoration" aria-hidden="true" style="'+style+'background:'+cssColor(e.fill?.color,'transparent')+';border-radius:'+Math.max(0,Number(e.radius||0))+'px"></span>';
  return '<span class="mg-source-decoration mg-source-line" aria-hidden="true" style="'+style+'border-top:'+Math.min(6,Math.max(.4,Number(e.width||1)))+'px solid '+cssColor(e.color,'#382b20')+'"></span>';
 }).join('');
}
function priceMarkup(p,state){
 const symbol={USD:'$',CAD:'CA$',EUR:'€',GBP:'£',AED:'AED ',SAR:'SAR ',INR:'₹'}[state?.currency]||'$';
 return (p.sizes||[]).map((s,i)=>'<span class="mg-source-size">'+escape(s.name)+' <b data-cs-edit="price" data-cs-price-index="'+i+'">'+symbol+(Number(s.price)||0).toFixed(2)+'</b></span>').join(' ')||'<span>Ask for price</span>';
}
function photoMarkup(p,config){
 const t=config.photoTransformByProduct?.[p.id]||{},zoom=Math.min(240,Math.max(100,Number(t.zoom)||100)),x=Math.min(60,Math.max(-60,Number(t.x)||0)),y=Math.min(60,Math.max(-60,Number(t.y)||0));
 const src=safePhoto(p.photo);
 return '<div class="mg-source-photo mg-item-photo" data-cs-photo="'+escape(p.id)+'">'+(src?'<img alt="'+escape(p.name)+'" src="'+escape(src)+'" loading="eager" crossorigin="anonymous" style="transform:translate('+x+'%,'+y+'%) scale('+(zoom/100)+');transform-origin:center">':'<span class="mg-source-missing">Add a product photo</span>')+'</div>';
}
function article(p,state,opts,idx,meta){
 return '<article class="mg-item mg-source-item" data-menu-product="'+escape(p.id)+'" data-source-index="'+idx+'">'+photoMarkup(p,opts)+'<div class="mg-source-info mg-item-info"><div class="mg-item-name" data-cs-edit="name">'+escape(p.name)+'</div><div class="mg-item-ingredients" data-cs-edit="ingredients">'+escape(p.ingredients||'')+'</div><div class="mg-item-prices">'+priceMarkup(p,state)+'</div></div></article>';
}
function pageHTML(doc,meta,state,opts,items,index,count,formats){
 const format=formats[opts.format]||formats.letter,palette=documentPalette(doc);
 const brand=state?.branding||{},name=String(brand.name||'Your Café'),tagline=String(brand.tagline??'FRESHLY MADE');
 const accent=cssColor(brand.accent,palette.accent),bg=cssColor(brand.background,palette.bg),ink=cssColor(brand.text,palette.color);
 const outFormat=opts.format==='landscape'?'landscape':'portrait';
 const logo=brand.showLogo&&safePhoto(brand.logoUrl);
 const props='--mg-width:'+format.w+'px;--mg-height:'+format.h+'px;--mg-bg:'+bg+';--mg-ink:'+ink+';--mg-accent:'+accent+';--mg-card:'+(palette.dark?'#3a322f':'#fffefc')+';--mg-sub:'+(palette.dark?'#ead4bc':'#67574e')+';--mg-line:'+accent+';';
 let header='<header class="mg-source-header"><div class="mg-source-brand">'+(logo?'<img class="mg-brand-logo" src="'+escape(logo)+'" alt="'+escape(name)+'">':'<span class="mg-brand-name" data-cs-edit="brand.name">'+escape(name)+'</span>')+'<small data-cs-edit="brand.tagline">'+escape(tagline)+'</small></div><span class="mg-source-headnote">'+escape(doc.name.replace(/menu|poster|block|board|grid/gi,'').trim()||'YOUR MENU')+'</span></header>';
 let content='<div class="mg-source-items">'+items.map((p,i)=>article(p,state,opts,i,meta)).join('')+'</div>';
 return '<section class="mg-export-page mg-source-page mg-source-'+meta.kind+' mg-source-format-'+outFormat+'" style="'+props+'" data-page="'+(index+1)+'" data-count="'+items.length+'" data-original-source="'+escape(doc.id)+'">'+
 '<div class="mg-source-decorations">'+decorations(doc,index,opts.format)+'</div>'+
 '<div class="mg-source-main">'+header+content+'<footer class="mg-source-footer">Original layout: OpenTempl · Adapted to your café <span>Page '+(index+1)+' of '+count+'</span></footer></div></section>';
}
function renderPages(state,opts,products,formats){
 const doc=sourceDoc(opts.templateId);if(!doc)throw Error('Imported design not found');
 const meta=META[doc.id],cap=capacity(opts.templateId,opts.format,opts.density),pages=groupBalanced(products,cap);
 return {pageCount:pages.length,productCount:products.length,capacity:cap,options:opts,pages:pages.map((items,i)=>pageHTML(doc,meta,state,opts,items,i,pages.length,formats))};
}
root.SeiyunSourceMenus={registry,sourceDoc,capacity,renderPages,documentPalette};
})(typeof window!=='undefined'?window:globalThis);
