
(function(root,make){
  const api=make();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.SeiyunOpenMenuAdapter=api;
})(typeof window!=="undefined"?window:globalThis,function(){
"use strict";
const escape=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const N=(v,d=0,min=-10000,max=10000)=>{const n=Number(v);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):d};
const C=(v,f="#342a24")=>/^#[0-9a-f]{3,8}$/i.test(String(v||""))?v:f;
const safePhoto=v=>{try{const u=new URL(String(v));return ["https:","http:","blob:"].includes(u.protocol)||u.protocol==="data:"&&/^data:image\/(png|jpeg|webp|avif);/i.test(String(v))?u.href:""}catch{return ""}};
const namesOf=state=>(state?.products||[]).filter(p=>p&&p.enabled!==false);
const brand=state=>String(state?.branding?.name||"Your Café").slice(0,100);
const tagline=state=>String(state?.branding?.tagline||"OUR MENU").slice(0,90);
const price=(p,state)=>{const x=Number(p?.sizes?.[0]?.price);if(!Number.isFinite(x))return "";try{return new Intl.NumberFormat("en-US",{style:"currency",currency:state.currency||"USD"}).format(x)}catch{return "$"+x.toFixed(2)}};
const numeric=t=>/^\s*\+?(?:[$€£]\s*)?\d{1,4}(?:[.,]\d{1,2})?(?:\s*\/\s*\d{1,4}(?:[.,]\d{1,2})?)?\s*$/.test(String(t||""));
const formatted=(page)=>page.elements.map((e,i)=>({e,i})).filter(t=>t.e.type==="text");
const font=e=>N(e.fontSize,16,1,1200);
function brandIndex(page,doc){
 const c=formatted(page).filter(t=>!numeric(t.e.text)&&String(t.e.text||"").length>1&&String(t.e.text).length<60&&font(t.e)>22);
 c.sort((a,b)=>font(b.e)*(b.e.y<doc.height*.32?1.3:1)-font(a.e)*(a.e.y<doc.height*.32?1.3:1));
 return c[0]?.i??-1;
}
function slotPlan(page,doc){
 const elems=page.elements,txt=formatted(page),used=new Set(),slots=[];
 const prices=txt.filter(t=>numeric(t.e.text)&&font(t.e)>=10&&font(t.e)<97);
 for(const p of prices){
  const matches=txt.filter(t=>t.i!==p.i&&!used.has(t.i)&&!numeric(t.e.text)&&
   !String(t.e.text).includes("\n")&&String(t.e.text).length<90&&t.e.x<p.e.x&&
   N(t.e.fontWeight,500)>=350&&font(t.e)>=Math.max(10,font(p.e)*.4)&&
   font(t.e)<=Math.max(55,font(p.e)*1.65)&&Math.abs(t.e.y-p.e.y)<Math.max(17,font(t.e)*.42));
  matches.sort((a,b)=>Math.abs(a.e.y-p.e.y)*5+Math.abs(p.e.x-(a.e.x+a.e.w))*.07-(N(a.e.fontWeight,500)/500));
  const name=matches[0];if(!name)continue;
  used.add(name.i);slots.push({name:name.i,price:p.i,desc:-1,y:name.e.y,x:name.e.x});
 }
 if(!slots.length){
  const head=brandIndex(page,doc);
  let options=txt.filter(t=>t.i!==head&&!numeric(t.e.text)&&font(t.e)>=24&&font(t.e)<=75&&
   t.e.x>doc.width*.14&&t.e.y>doc.height*.16&&String(t.e.text).length>4&&
   !/^(?:special|mon|tue|wed|thu|fri|sat|sun|menu|lunch|week\s*\d+)\b/i.test(String(t.e.text).trim()));
  if(!options.length&&/special-story|onigiri-label/.test(doc.id))
   options=txt.filter(t=>t.i!==head&&!numeric(t.e.text)&&font(t.e)>=60&&t.e.y>doc.height*.3);
  if(/lunch-week/.test(doc.id)){
   options=options.filter(t=>font(t.e)>=27&&N(t.e.fontWeight,400)>=650);
  }
  options.slice(0,12).forEach(t=>slots.push({name:t.i,price:-1,desc:-1,y:t.e.y,x:t.e.x}));
 }
 slots.sort((a,b)=>a.y-b.y||a.x-b.x);
 for(const slot of slots){
  const name=elems[slot.name];
  const matches=txt.filter(t=>t.i!==slot.name&&!slots.some(z=>z.name===t.i||z.price===t.i)&&
   !numeric(t.e.text)&&t.e.y>=name.y+Math.min(name.h,24)*.62&&
   t.e.y<name.y+Math.max(55,name.h+35)&&Math.abs(t.e.x-name.x)<20&&
   font(t.e)<font(name)&&N(t.e.fontWeight,400)<=500);
  matches.sort((a,b)=>a.e.y-b.e.y);
  if(matches[0])slot.desc=matches[0].i;
 }
 return slots;
}
const formats={a4:{w:794,h:1123},letter:{w:816,h:1056},portrait:{w:1080,h:1920},landscape:{w:1920,h:1080},square:{w:1080,h:1080}};
function inferredFormat(doc){
 const a=doc.width/doc.height;
 return a>1.45?"landscape":a<.65?"portrait":a>.8?"square":"a4";
}
function boundedOverride(over,base,w,h){
 if(!over||typeof over!=="object")return base;
 return {...base,x:N(over.x,base.x,-w,w*2),y:N(over.y,base.y,-h,h*2),
  w:N(over.w,base.w,24,w*2),h:N(over.h,base.h,12,h*2),
  fontSize:N(over.fontSize,base.fontSize||16,8,350)};
}
function sourcePage(state,doc,page,selected,format,overrides,pageIndex){
 const target=formats[format]||formats.a4,w=target.w,h=target.h;
 const sx=doc.width||794,sy=doc.height||1123,scale=Math.min(w/sx,h/sy);
 const dx=(w-sx*scale)/2,dy=(h-sy*scale)/2;
 const bg=C(page.background?.color,"#f5eee3");
 const first=page.elements.find(e=>e.type==="text"&&e.color),ink=C(first?.color);
 const slots=slotPlan(page,doc),nameIndex=brandIndex(page,doc),mapped={};
 slots.forEach((t,i)=>{
  mapped[t.name]={kind:"name",product:selected[i]};
  if(t.price>=0)mapped[t.price]={kind:"price",product:selected[i]};
  if(t.desc>=0)mapped[t.desc]={kind:"desc",product:selected[i]};
 });
 if(!mapped[nameIndex]&&nameIndex>=0)mapped[nameIndex]={kind:"brand"};
 const categories=[...new Set(namesOf(state).map(p=>p.category||"Menu"))];
 let catNo=0,photoIndex=0;
 const shapes=page.elements.map((e,i)=>{
  if(!["text","shape","line","image"].includes(e.type))return "";
  const m=mapped[i],key=m?.kind==="brand"?"brand":m?.product?"product:"+m.product.id+(m.kind==="name"?"":m.kind==="desc"?":ingredients":":price"):"source:"+i;
  const geom=boundedOverride(overrides?.[key],{x:N(e.x)*scale+dx,y:N(e.y)*scale+dy,w:N(e.w)*scale,h:N(e.h)*scale,fontSize:font(e)*scale},w,h);
  const css="position:absolute;left:"+Number(geom.x.toFixed(2))+"px;top:"+Number(geom.y.toFixed(2))+"px;width:"+Number(geom.w.toFixed(2))+"px;height:"+Number(geom.h.toFixed(2))+"px;opacity:"+N(e.opacity,1,0,1)+";transform:rotate("+N(e.rotation,0,-360,360)+"deg);";
  const attr='data-native-element="'+i+'" data-layout-key="'+escape(key)+'"';
  if(e.type==="shape")return '<div '+attr+' aria-hidden="true" style="'+css+'box-sizing:border-box;background:'+C(e.fill?.color,"transparent")+';'+(e.stroke?.color?'border:'+N(e.stroke.width,1,0,25)*scale+'px solid '+C(e.stroke.color,ink)+';':'')+'border-radius:'+N(e.radius)*scale+'px"></div>';
  if(e.type==="line")return '<div '+attr+' aria-hidden="true" style="'+css+'border-top:'+N(e.width,1,0,30)*scale+'px '+(e.dash==="dashed"?"dashed":"solid")+' '+C(e.color,ink)+'"></div>';
  if(e.type==="image"){
   if(/texture|paper/i.test(e.kind||"")||N(e.w)*N(e.h)>doc.width*doc.height*.68)return "";
   const owner=selected.filter(p=>p?.photos?.some(safePhoto))[photoIndex++];
   const url=safePhoto(owner?.photos?.[N(owner?.primary)||0]||owner?.photos?.[0]);
   if(!url)return "";
   const tr=state?.menuArtwork?.photoTransformByProduct?.[owner.id]||{};
   const zoom=N(tr.zoom,100,100,240)/100,px=N(tr.x,0,-60,60),py=N(tr.y,0,-60,60);
   return '<div '+attr+' data-cs-photo="'+escape(owner.id)+'" class="ot-owner-image" style="'+css+'"><img src="'+escape(url)+'" alt="'+escape(owner.name)+'" loading="eager" crossorigin="anonymous" style="transform:translate('+px+'%, '+py+'%) scale('+zoom+')"></div>';
  }
  let value="",edit="",productAttr="";
  if(m?.kind==="brand"){value=brand(state);edit='data-cs-edit="brand.name"';}
  else if(m?.product){
   if(m.kind==="name"){value=m.product.name||"Untitled";productAttr='data-menu-product="'+escape(m.product.id)+'"';edit='data-cs-edit="name"';}
   if(m.kind==="price"){value=price(m.product,state);edit='data-cs-edit="price" data-cs-price-index="0"';}
   if(m.kind==="desc"){value=m.product.ingredients||m.product.description||"";edit='data-cs-edit="ingredients"';}
  }else if(!m){
   const t=String(e.text||"").trim();
   if(e.role==="decorative"&&t.length<=5)value=t;
   else if(/^(menu|our menu|drinks|special|coffee|tea|food|hot|cold|extras|lunch|bakery|prices|price list|espresso bar|seasonal|from the oven)$/i.test(t))
    value=/^(menu|drinks|prices)/i.test(t)?"OUR MENU":categories[catNo++%Math.max(1,categories.length)]||"MENU";
   else if(font(e)>55&&i!==nameIndex&&!numeric(t))value="OUR MENU";
  }
  if(m?.kind==="brand"&&state?.branding?.showLogo&&safePhoto(state.branding.logoUrl)){
   return '<div '+attr+' class="ot-owner-image ot-brand-image" style="'+css+'"><img src="'+escape(safePhoto(state.branding.logoUrl))+'" alt="'+escape(brand(state))+' logo" crossorigin="anonymous"></div>';
  }
  if(!value)return "";
  const fs=Math.max(7,Math.min(geom.fontSize||font(e)*scale,Math.max(9,geom.w/(Math.max(1,String(value).length)*.55))));
  const ff=String(e.fontFamily||"Georgia").replace(/[^a-zA-Z0-9 ,\-]/g,"").slice(0,70)||"Georgia";
  const style=css+"font-family:'"+ff+"',Georgia,serif;font-size:"+fs.toFixed(2)+"px;font-weight:"+N(e.fontWeight,500,100,900)+";color:"+C(e.color,ink)+";line-height:"+N(e.lineHeight,1.2,.7,2.4)+";text-align:"+(['left','right','center'].includes(e.align)?e.align:"left")+";white-space:pre-wrap;overflow:hidden;overflow-wrap:anywhere;";
  return '<div '+attr+' '+productAttr+' '+(m?.product?'data-cs-product-id="'+escape(m.product.id)+'"':'')+' '+edit+' class="ot-native-text" style="'+style+'">'+escape(value)+'</div>';
 }).join("");
 return {html:'<section class="mg-export-page ot-source-page" data-opentempl-source="'+escape(doc.id)+'" data-page="'+(pageIndex+1)+'" data-count="'+selected.length+'" style="--mg-width:'+w+'px;--mg-height:'+h+'px;width:'+w+'px;height:'+h+'px;background:'+bg+';color:'+ink+'"><div class="ot-source-layer">'+shapes+'</div></section>',
  bg,ink,slotCount:slots.length};
}
function companionPage(state,doc,items,format,index,bg,ink){
 const {w,h}=formats[format]||formats.a4;
 const cards=items.map(p=>{
  const image=safePhoto(p.photos?.[N(p.primary)||0]||p.photos?.[0]);
  return '<article class="ot-list-item" data-menu-product="'+escape(p.id)+'" data-layout-key="product:'+escape(p.id)+'"><div class="ot-list-photo">'+(image?'<img src="'+escape(image)+'" alt="'+escape(p.name)+'" crossorigin="anonymous">':'')+'</div><div class="ot-list-info"><strong data-cs-edit="name">'+escape(p.name||"Untitled")+'</strong><p data-cs-edit="ingredients">'+escape(p.ingredients||p.description||"")+'</p><b data-cs-edit="price" data-cs-price-index="0">'+escape(price(p,state))+'</b></div></article>';
 }).join("");
 return '<section class="mg-export-page ot-companion-page" data-opentempl-source="'+escape(doc.id)+'" data-page="'+(index+1)+'" data-count="'+items.length+'" style="--mg-width:'+w+'px;--mg-height:'+h+'px;width:'+w+'px;height:'+h+'px;background:'+bg+';color:'+ink+';--ot-accent:'+ink+'"><header class="ot-list-head"><div><small>'+escape(tagline(state))+'</small><h2 data-cs-edit="brand.name" data-layout-key="brand">'+escape(brand(state))+'</h2></div><span>OUR MENU</span></header><div class="ot-list-grid">'+cards+'</div><footer>Menu · Page '+(index+1)+'</footer></section>';
}
function render(state,doc,options={}){
 if(!doc?.pages?.length)throw Error("A reviewed native menu document is required.");
 const format=formats[options.format]?options.format:inferredFormat(doc);
 const all=namesOf(state),pages=[],overrides=options.layoutOverrides||{};
 let cursor=0,bg="#f5eee3",ink="#342a24";
 for(const originalPage of doc.pages){
  const n=slotPlan(originalPage,doc).length;
  // A decorative source cover is not a usable menu thumbnail or default print page.
  if(n===0&&all.length>0)continue;
  const page=sourcePage(state,doc,originalPage,all.slice(cursor,cursor+n),format,overrides,pages.length);
  pages.push(page.html);cursor+=Math.min(n,all.length-cursor);bg=page.bg;ink=page.ink;
 }
 const limit=N(options.companionCapacity,formats[format].h/formats[format].w>1.5?12:18,4,24);
 while(cursor<all.length){
  const chunk=all.slice(cursor,cursor+limit);
  pages.push(companionPage(state,doc,chunk,format,pages.length,bg,ink));
  cursor+=chunk.length;
 }
 return {pages,productCount:all.length,pageCount:pages.length,options:{...options,format},sourceId:doc.id};
}
return {render,slotPlan,inferredFormat,safePhoto};
});
