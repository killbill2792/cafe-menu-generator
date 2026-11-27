// Seiyun's limited catalog bridge into the FULL upstream OpenTempl editor.
// All canvas, selection, drag, resize, undo, layers, pagination and export remain upstream.
import { createDesign, openDesign } from '../io/designs';
import { newId, DesignDoc } from '../doc/design';
import * as Y from 'yjs';
import { thumbnail } from '../export/render';
import { prepareImage } from '../io/upload';
import { findTemplate, type Template } from '../templates';
import type { Asset, DesignSnapshot, Element, TextElement, ImageElement, Page, Fill } from '../doc/types';

type OwnerProduct = { id:string; name?:string; category?:string; ingredients?:string; enabled?:boolean; photos?:string[]; primary?:number; sizes?:{name?:string;price?:number}[] };
type OwnerPayload = {
  brand?:{name?:string;tagline?:string;accent?:string;background?:string;text?:string;customColors?:boolean};
  currency?:string; products?:OwnerProduct[]; templateId?:string; selectedPhotoId?:string;
  saved?:{snapshot:DesignSnapshot};
};
const ownerScope=new URL(location.href).searchParams.get('seiyun_owner')||'unscoped';
const key='seiyun:owner:catalog:'+ownerScope;
const MAX_PRODUCTS=180;
const text=(v:unknown,max=160)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,max);
const palette=v=>/^#[a-f0-9]{6}$/i.test(String(v||''))?String(v):'';
const looksLikeImageURL=(s:string)=>/^https:\/\/|^blob:|^data:image\/(?:png|jpeg|webp);base64,/i.test(s);
function ownerFromStorage(): OwnerPayload|null {
  try{const obj=JSON.parse(sessionStorage.getItem(key)||'null');return obj&&typeof obj==='object'?obj:null;}catch{return null;}
}
function send(type:string,body:Record<string,unknown>={}) {
  if(window.parent===window)return;
  const nonce=new URL(location.href).searchParams.get('seiyun_nonce');
  if(!nonce)return;
  window.parent.postMessage({type,nonce,...body},location.origin);
}
function safeOwner(input:unknown): OwnerPayload {
  const p=(input&&typeof input==='object'?input:{}) as OwnerPayload;
  return {
    brand:{name:text(p.brand?.name||'Your Café',75),tagline:text(p.brand?.tagline,95),
      accent:palette(p.brand?.accent),background:palette(p.brand?.background),text:palette(p.brand?.text),customColors:p.brand?.customColors===true},
    currency:text(p.currency||'USD',4),
    templateId:text(p.templateId||'food-menu-cafe-nord',90),
    products:(Array.isArray(p.products)?p.products:[]).slice(0,MAX_PRODUCTS).filter(x=>x&&typeof x==='object'&&x.enabled!==false).map(x=>({
      id:text(x.id,95),name:text(x.name||'New product',95),category:text(x.category,90),
      ingredients:text(x.ingredients,180),
      photos:Array.isArray(x.photos)?x.photos.filter(u=>typeof u==='string'&&looksLikeImageURL(u)).slice(0,8):[],
      primary:Number.isInteger(x.primary)?x.primary:0,
      sizes:Array.isArray(x.sizes)?x.sizes.slice(0,5).map(z=>({name:text(z.name,35),price:Number.isFinite(Number(z.price))?Math.max(0,Math.min(9999,Number(z.price))):0})):[]
    })),
    saved:p.saved&&typeof p.saved==='object'&&p.saved.snapshot?.pageOrder?.length?p.saved:undefined
  };
}
const id=()=>newId();
function textElement(template: Partial<TextElement>|undefined, name:string, content:string, x:number,y:number,w:number,h:number,size:number,color:string,weight=700):TextElement {
  return {
    id:id(), name, type:'text',x,y,w,h,rotation:0,opacity:1,locked:false,
    text:content,fontFamily:template?.fontFamily||'Arial',fontSize:size,fontWeight:weight,
    italic:false,underline:false,strike:false,color:color||template?.color||'#27201b',
    align:'left',lineHeight:1.06,letterSpacing:0,uppercase:false,list:'none',
    effect:{kind:'none',color:'#000000',amount:0,offset:0,direction:0},curve:0
  };
}
function imageElement(productId:string,assetId:string,x:number,y:number,w:number,h:number):ImageElement {
  return {id:id(), name:'product:'+productId+':photo',type:'image',
    x,y,w,h,rotation:0,opacity:1,locked:false,assetId,
    crop:{x:0,y:0,w:1,h:1},
    filters:{brightness:0,contrast:0,saturation:0,temperature:0,tint:0,blur:0,vignette:0,grain:0,preset:'none',duotone:null},
    radius:8,mask:null,border:null};
}
let imageCache:Promise<{assets:Asset[];map:Map<string,string>}>|null=null;
function cachedOwnerImages(owner:OwnerPayload){
 return imageCache||(imageCache=readOwnerImages(owner));
}
async function readOwnerImages(owner:OwnerPayload):Promise<{assets:Asset[]; map:Map<string,string>}> {
  const assets:Asset[]=[],map=new Map<string,string>();
  const prods=owner.products||[];
  // Sequential and bounded: large product photographs on iPhones must not exhaust memory.
  for(const p of prods){
    const url=p.photos?.[Math.max(0,Math.min((p.photos?.length||1)-1,p.primary||0))];
    if(!url)continue;
    try{
      const res=await fetch(url,{mode:'cors',credentials:'omit'});
      if(!res.ok)continue;
      const blob=await res.blob();
      if(!/^image\/(png|jpeg|webp)$/i.test(blob.type)||blob.size>8*1024*1024)continue;
      const item=await prepareImage(blob,p.name||'product');
      item.id='seiyun-photo:'+p.id;
      assets.push(item);map.set(p.id,item.id);
    }catch{/* A restricted/expired Storage URL leaves the photo slot empty, never breaks the editor. */}
  }
  return {assets,map};
}
function cleanDecorations(snapshot:DesignSnapshot,width:number,height:number):Element[]{
  const p=snapshot.pages[snapshot.pageOrder[0]];
  if(!p)return[];
  return p.elementIds.map(v=>snapshot.elements[v]).filter((el):el is Element=>!!el)
    .filter(el=>['shape','line','svg'].includes(el.type))
    .slice(0,64).map(el=>({...structuredClone(el),id:id(),locked:false}));
}
// Bind the actual editable source document, not a CSS or generic-card
// reconstruction. Text/line/shape positions, page dimensions and native
// typography come from the selected upstream menu. Only sample assets and
// sample restaurant content are replaced. Repeat the original content page
// when more products are present than the native design's own row capacity.
type MenuSlot={name:TextElement;price:TextElement|null;desc:TextElement|null};
const isPrice=(t:string)=>/^\s*\+?(?:[$€£]\s*)?\d{1,4}(?:[.,]\d{1,2})?(?:\s*\/\s*\d{1,4}(?:[.,]\d{1,2})?)?\s*$/.test(t);
function sourceSlots(page:Page,doc:DesignSnapshot,templateId:string):MenuSlot[]{
 const all=page.elementIds.map(x=>doc.elements[x]).filter((e):e is TextElement=>e?.type==='text');
 if(templateId==='food-menu-special-story'){
  const name=all.find(e=>e.text.startsWith('Soup of')),price=all.find(e=>e.text.trim()==='89'),desc=all.find(e=>e.text.startsWith('Roast tomato'));
  if(name)return [{name,price:price||null,desc:desc||null}];
 }
 if(templateId==='food-menu-lunch-week'){
  return all.filter(e=>e.x>=250&&e.y>=475&&e.fontSize>=35&&e.fontSize<=40).map(name=>({name,price:null,desc:all.find(e=>e.x===name.x&&e.y>name.y&&e.y<name.y+85&&e.fontSize<name.fontSize)||null}));
 }
 const slots:MenuSlot[]=[],used=new Set<string>();
 for(const price of all.filter(e=>isPrice(e.text)&&e.fontSize>=10&&e.fontSize<97)){
  // Wine-list year columns and standalone section numbers are not prices.
  if(/^\s*(?:19|20)\d{2}\s*$/.test(price.text))continue;
  const matches=all.filter(e=>e.id!==price.id&&!isPrice(e.text)&&!e.text.includes('\n')&&e.text.length<90&&e.x<price.x&&e.fontSize>=Math.max(10,price.fontSize*.4)&&e.fontSize<=Math.max(55,price.fontSize*1.65)&&Math.abs(e.y-price.y)<Math.max(17,e.fontSize*.42));
  matches.sort((a,b)=>Math.abs(a.y-price.y)*5+Math.abs(price.x-a.x-a.w)*.07-a.fontWeight/500-(Math.abs(b.y-price.y)*5+Math.abs(price.x-b.x-b.w)*.07-b.fontWeight/500));
  const name=matches[0];if(!name||used.has(name.id))continue;
  used.add(name.id);slots.push({name,price,desc:null});
 }
 slots.sort((a,b)=>a.name.y-b.name.y||a.name.x-b.name.x);
 for(const s of slots){
  const n=s.name;
  s.desc=all.filter(e=>!slots.some(a=>a.name.id===e.id||a.price?.id===e.id)&&!isPrice(e.text)&&e.y>=n.y+Math.min(n.h,24)*.62&&e.y<n.y+Math.max(55,n.h+35)&&Math.abs(e.x-n.x)<20&&e.fontSize<n.fontSize&&e.fontWeight<=500).sort((a,b)=>a.y-b.y)[0]||null;
 }
 return slots;
}
function formatPrices(p:OwnerProduct,currency:string){
 return (p.sizes||[]).map(z=>{let amount=Number(z.price||0).toFixed(2);try{amount=new Intl.NumberFormat('en-US',{style:'currency',currency:currency||'USD'}).format(Number(z.price||0));}catch{}return (z.name?z.name+' ':'')+amount;}).join(' · ');
}
function sourceText(base:TextElement,name:string,value:string):TextElement{
 const el:TextElement={...structuredClone(base),id:id(),name,text:value,locked:false,groupId:undefined,runs:undefined};
 // Fit new words without changing original position, rotation, alignment or font.
 const chars=Math.max(...value.split('\n').map(x=>x.length),1);
 el.fontSize=Math.min(el.fontSize,Math.max(6,el.w/(chars*.56)));
 return el;
}
function createSourcePages(template:DesignSnapshot,owner:OwnerPayload,images:Map<string,string>):DesignSnapshot|null{
 const w=template.meta.width,h=template.meta.height,templateId=owner.templateId||'';
 const sourcePages=template.pageOrder.map(pid=>template.pages[pid]).filter(Boolean).map(page=>({page,slots:sourceSlots(page,template,templateId)})).filter(p=>p.slots.length>0);
 if(!sourcePages.length)return null;
 const products=owner.products||[],pages:Record<string,Page>={},elements:Record<string,Element>={},order:string[]=[];
 const brand=owner.brand?.name||'Your Café';
 let cursor=0,round=0;
 do{
  const basis=sourcePages[round++%sourcePages.length],{page,slots}=basis,pid=id(),ids:string[]=[];
  const add=(el:Element)=>{elements[el.id]=el;ids.push(el.id)};
  const sourceEls=page.elementIds.map(x=>template.elements[x]).filter(Boolean);
  const fieldIds=new Set(slots.flatMap(x=>[x.name.id,x.price?.id,x.desc?.id]).filter(Boolean));
  const headings=sourceEls.filter((e):e is TextElement=>e.type==='text'&&!fieldIds.has(e.id)&&!isPrice(e.text)&&e.text.length>1);
  const header=headings.slice().sort((a,b)=>b.fontSize-a.fontSize)[0];
  const categories=[...new Set(products.map(p=>p.category||'Menu'))];
  const batch=products.slice(cursor,cursor+slots.length);cursor+=batch.length;
  // Keep non-photo decorative layers exactly in native source coordinates.
  // Upstream demo photographs are intentionally not imported.
  for(const e of sourceEls){
   if(e.type==='shape'&&e.fill.type==='image')continue;
   if(e.type==='shape'||e.type==='svg'||e.type==='line'){
    const copy={...structuredClone(e),id:id(),locked:false,groupId:undefined};
    if(copy.type==='line'){delete copy.from;delete copy.to}
    add(copy);
   }
  }
  if(header)add(sourceText(header,'brand:name',brand));
  else add(textElement(undefined,'brand:name',brand,w*.05,h*.018,w*.9,h*.045,w*.033,'#37231b',800));
  let section=0;
  for(const el of headings){
   if(el===header)continue;
   if(/^(?:hot|cold|coffee|tea|extras|small plates|burgers|drinks|cocktails|sea|land|garden|broths|dry|sparkling|white|orange|red|by the glass|other|food)$/i.test(el.text.trim())){
    const group=slots.map((slot,i)=>({slot,product:batch[i]})).filter(x=>x.product&&x.slot.name.y>=el.y&&Math.abs(x.slot.name.x-el.x)<Math.max(25,el.w*.2));
    const sectionCats=[...new Set(group.slice(0,4).map(x=>x.product.category||'Menu'))];
    add(sourceText(el,'section:'+section++,sectionCats.length===1?sectionCats[0]:'MENU'));
   }else if(/^(?:menu|our menu|the menu)$/i.test(el.text.trim()))add(sourceText(el,'page:heading','OUR MENU'));
  }
  slots.forEach((slot,index)=>{
   const p=batch[index];if(!p)return;
   let n=sourceText(slot.name,'product:'+p.id+':name',p.name||'');
   let description=slot.desc?sourceText(slot.desc,'product:'+p.id+':ingredients',p.ingredients||''):null;
   let price=slot.price?sourceText(slot.price,'product:'+p.id+':price',formatPrices(p,owner.currency||'USD')):null;
   const asset=images.get(p.id);
   if(templateId==='food-menu-special-story'){
    // The source uses an oversized background photo. Replace it with a whole
    // product portrait, above the original large headline, not stock footage.
    if(asset)add(imageElement(p.id,asset,w*.24,h*.17,w*.52,h*.44));
    n.fontSize=Math.min(n.fontSize,w*.085);
    if(price){price.x=w*.70;price.y=h*.87;price.w=w*.25;price.h=h*.07;price.fontSize=Math.min(w*.048,price.w/Math.max(1,price.text.length)*1.55);}
   }else if(asset){
    // Text-first source layouts do not contain product image frames. Make
    // room in that exact row without changing the surrounding template.
    const rowH=Math.max(n.h,description?description.y+description.h-n.y:n.h);
    const ph=Math.min(rowH*.95,Math.max(18,n.w*.19)),pw=ph*2/3;
    if(n.w>pw+28){add(imageElement(p.id,asset,n.x,n.y,pw,ph));n.x+=pw+5;n.w-=pw+5;
     if(description){description.x+=pw+5;description.w=Math.max(12,description.w-pw-5);}
    }
   }
   // If a text-only template has no dedicated price/description boxes, retain
   // its native text row and create native text fields inside that row.
   if(!price){
    const px=n.x+n.w*.69,pw=n.w*.31;
    price=textElement(n,'product:'+p.id+':price',formatPrices(p,owner.currency||'USD'),px,n.y,pw,n.h,Math.min(n.fontSize*.75,pw/Math.max(1,formatPrices(p,owner.currency||'USD').length)*1.5),n.color,700);
    n.w*=.66;
   }
   if(!description&&p.ingredients){
    const rowNext=slots.slice(index+1).map(v=>v.name).find(v=>Math.abs(v.x-slot.name.x)<30&&v.y>slot.name.y);
    const remaining=(rowNext?.y||Math.min(h,n.y+n.h+25))-n.y-n.h;
    if(remaining>=10)description=textElement(n,'product:'+p.id+':ingredients',p.ingredients,n.x,n.y+n.h,n.w,remaining,Math.min(n.fontSize*.72,remaining*.75),n.color,400);
   }
   n=sourceText(n,n.name||'',n.text);
   add(n);
   if(description)add(sourceText(description,description.name||'',description.text));
   if(price)add(sourceText(price,price.name||'',price.text));
  });
  const background:Fill=owner.brand?.customColors&&owner.brand.background?{type:'solid',color:owner.brand.background}:page.background?.type==='image'?{type:'solid',color:'#f7eee3'}:structuredClone(page.background);
  pages[pid]={...structuredClone(page),id:pid,name:'Menu '+(order.length+1),background,elementIds:ids,notes:'Source-native menu: '+templateId};
  order.push(pid);
 }while(cursor<products.length);
 return {meta:{...template.meta,id:id(),title:brand+' · '+templateId,createdAt:Date.now(),updatedAt:Date.now()},pageOrder:order,pages,elements};
}

function createPages(template:DesignSnapshot,owner:OwnerPayload,images:Map<string,string>):DesignSnapshot {
  const source=createSourcePages(template,owner,images);if(source)return source;
  const width=Math.max(600,Math.min(1920,template.meta.width||816)),
        height=Math.max(600,Math.min(2560,template.meta.height||1056));
  const font=(Object.values(template.elements).find(e=>e.type==='text')||{}) as TextElement;
  const ownerBrand=owner.brand||{},main=ownerBrand.name||'Your Café';
  const custom=ownerBrand.customColors===true;
  const tint=(custom&&ownerBrand.accent)||font.color||'#8b5534';
  const ink=(custom&&ownerBrand.text)||font.color||'#2f251f';
  const pg=template.pages[template.pageOrder[0]];
  const fill:Fill=(custom&&ownerBrand.background)?{type:'solid',color:ownerBrand.background}:pg?.background?.type==='solid'?pg.background:{type:'solid',color:'#fbf2e7'};
  const items=owner.products||[];
  const templateId=owner.templateId||'';
  // Native source documents provide fundamentally different page structures.
  // Keep product photos/text in predictable editable frames, no CSS grid reflow.
  const variant=/special-story|special-of-the-day/i.test(templateId)?'poster':
    /wine-list|receipt|weekly|lunch-week|cafe-nord/i.test(templateId)?'list':
    /board-slide|digital|colour-cards/i.test(templateId)?'board':'cards';
  const columns=variant==='list'||variant==='poster'?1:variant==='board'?3:2;
  const rows=variant==='poster'?1:variant==='list'?6:variant==='board'?3:4;
  const perPage=columns*rows;
  const count=Math.max(1,Math.ceil(items.length/perPage));
  const pages:Record<string,Page>={},elements:Record<string,Element>={},order:string[]=[];
  for(let p=0;p<count;p++){
    const pid=id(),ids:string[]=[];
    const add=(el:Element)=>{elements[el.id]=el;ids.push(el.id);};
    cleanDecorations(template,width,height).forEach(add);
    add(textElement(font,'brand:name',main,width*.055,height*.035,width*.9,height*.065,width*.061,ink,800));
    add(textElement(font,'brand:tagline',ownerBrand.tagline||'FRESHLY PREPARED',width*.057,height*.105,width*.75,height*.032,width*.017,tint,700));
    add(textElement(font,'page:label','OUR MENU',width*.77,height*.103,width*.18,height*.03,width*.017,tint,700));
    const bodyTop=height*.18,bodyHeight=height*.72,margin=width*.053,gutter=width*.020;
    const cardW=(width-margin*2-gutter*(columns-1))/columns,cardH=bodyHeight/rows-height*.012;
    for(let n=0;n<perPage;n++){
      const prod=items[p*perPage+n];if(!prod)continue;
      const col=n%columns,row=Math.floor(n/columns),x=margin+col*(cardW+gutter),y=bodyTop+row*bodyHeight/rows;
      const isDark=fill.type==='solid'&&/^#(?:1[0-9a-f]{5}|2[0-9a-f]{5}|3[0-9a-f]{5})$/i.test(fill.color);
      const surface=isDark?'#362b2b':'#fffdf7';
      add({id:id(),type:'shape',name:'product:'+prod.id+':card',shape:'rect',x,y,w:cardW,h:cardH,
       rotation:0,opacity:.9,locked:false,fill:{type:'solid',color:surface},
       stroke:{color:tint,width:1,dash:'solid'},radius:12});
      // Each field is a separate upstream-native element. The source product is never deleted when the owner deletes its design layer.
      const imageId=images.get(prod.id);
      if(imageId)add(imageElement(prod.id,imageId,x+cardW*.025,y+cardH*.035,cardW*.355,cardH*.87));
      const tx=x+cardW*.405,tW=cardW*.575;
      add(textElement(font,'product:'+prod.id+':name',prod.name||'',tx,y+cardH*.10,tW,cardH*.21,width*.026,ink,800));
      add(textElement(font,'product:'+prod.id+':ingredients',prod.ingredients||'',tx,y+cardH*.36,tW,cardH*.26,width*.015,ink,400));
      const prices=(prod.sizes||[]).map(sz=>(sz.name?sz.name+'  ':'')+((owner.currency||'USD')==='USD'?'$':'')+Number(sz.price||0).toFixed(2)).join('  ·  ');
      add(textElement(font,'product:'+prod.id+':price',prices,tx,y+cardH*.73,tW,cardH*.15,width*.017,tint,800));
    }
    add(textElement(font,'page:count',String(p+1)+' / '+count,width*.86,height*.955,width*.10,height*.025,width*.016,ink,500));
    pages[pid]={id:pid,name:'Adapted menu '+(p+1),background:fill,elementIds:ids,notes:'Catalog-fit adaptation; this source does not have recognizable menu price rows.',transition:'none',duration:5};
    order.push(pid);
  }
  return {meta:{...template.meta,id:id(),title:main+' • Menu',width,height,unit:'px',createdAt:Date.now(),updatedAt:Date.now()},pageOrder:order,pages,elements};
}
// The template's plain source definition is sufficient for owner binding.
// Do not fetch the upstream demonstration photographs just to discard them.
function sourceBasis(templ:Template):DesignSnapshot{
 const pageOrder:string[]=[],pages:Record<string,Page>={},elements:Record<string,Element>={};
 for(const p of templ.pages){
  const pid=id(),ids:string[]=[];
  for(const el of p.elements){const eid=id();elements[eid]={...structuredClone(el),id:eid};ids.push(eid);}
  pages[pid]={id:pid,name:p.name||'',background:p.background,elementIds:ids,notes:p.notes||'',transition:p.transition||'none',duration:5};pageOrder.push(pid);
 }
 return {meta:{id:id(),title:templ.name,width:templ.width,height:templ.height,unit:'px',formatId:templ.formatId,createdAt:Date.now(),updatedAt:Date.now()},pageOrder,pages,elements};
}
// Preview the identical native design model used by the editor and export.
// No persisted throwaway documents, no fake color swatches, no demo imagery.
// Serialize thumbnail work: a 337-template browser must not decode hundreds
// of large photos or create hundreds of canvases at once.
let previewQueue:Promise<unknown>=Promise.resolve();
const previewCache=new Map<string,Promise<{blob:Blob;adapted:boolean}|null>>();
export function renderSeiyunTemplateThumb(templateId:string):Promise<{blob:Blob;adapted:boolean}|null>{
 const owner=ownerFromStorage();if(!owner)return Promise.resolve(null);
 const cached=previewCache.get(templateId);if(cached)return cached;
 const next=previewQueue.then(async()=>{
  const templ=await findTemplate(templateId);if(!templ)return null;
  const {assets,map}=await cachedOwnerImages(owner);
  const snapshot=createPages(sourceBasis(templ),{...owner,templateId,saved:undefined},map);
  const pageId=snapshot.pageOrder[0],page=snapshot.pages[pageId];
  if(!page)return null;
  const first={meta:snapshot.meta,pageOrder:[pageId],pages:{[pageId]:page},elements:Object.fromEntries(page.elementIds.map(eid=>[eid,snapshot.elements[eid]]))};
  const used=new Set(Object.values(first.elements).filter((el):el is ImageElement=>el.type==='image').map(el=>el.assetId));
  const doc=new DesignDoc(new Y.Doc());
  try{
   doc.load(first,assets.filter(a=>used.has(a.id)));
   const blob=await thumbnail(doc,first,pageId,320);
   return {blob,adapted:page.notes.startsWith('Catalog-fit')};
  }finally{doc.destroy();}
 }).catch(()=>null);
 previewQueue=next;
 previewCache.set(templateId,next);
 return next;
}
export async function createSeiyunOwnerDesign(templateId:string):Promise<string|null>{
 const owner=ownerFromStorage();
 if(!owner)return null;
 // Choosing a different native template re-populates the entire catalog instead
 // of opening the upstream example restaurant's stock text and photo.
 return buildOwnerDesign({...owner,templateId,saved:undefined});
}
async function buildOwnerDesign(owner:OwnerPayload) {
  const templ=await findTemplate(owner.templateId||'food-menu-cafe-nord');
  const basis=templ?sourceBasis(templ):{meta:{id:id(),title:'Menu',width:816,height:1056,unit:'px',createdAt:Date.now(),updatedAt:Date.now()},pageOrder:[],pages:{},elements:{}} as DesignSnapshot;
  const {assets,map}=await cachedOwnerImages(owner);
  if(owner.saved?.snapshot&&owner.saved.snapshot.pageOrder?.length){
    const snap=structuredClone(owner.saved.snapshot);
    // Reopen the upstream native document on this owner/device when it is
    // current. Its Yjs IndexedDB contains history and any native uploads, not
    // just the serialized Supabase geometry. This avoids cloning every reload.
    const nativeId=snap.meta.id;
    if(typeof nativeId==='string'&&/^[a-z0-9_-]{1,100}$/i.test(nativeId)){
      try{
        const local=await openDesign(nativeId);
        if(local){
          const localSnapshot=local.doc.toSnapshot();
          const current=localSnapshot.meta.updatedAt>=snap.meta.updatedAt&&localSnapshot.pageOrder.length>0;
          await local.close();
          if(current)return nativeId;
        }
      }catch{/* A new browser can fall back to the private saved snapshot. */}
    }
    // A design is not the product catalog. Preserve the owner's edited
    // typography, exact wording, deletion, positions and sizes on reload.
    // Starting a fresh template is the explicit way to rebind catalog facts.
    // Only remap the source catalog image IDs, which are local media handles.
    for(const el of Object.values(snap.elements)){
      if(el.type==='image'&&el.name?.startsWith('product:')&&el.name.endsWith(':photo')){
        const productId=el.name.slice(8,-6);
        el.assetId=map.get(productId)||null;
      }
    }
    return createDesign({snapshot:snap,assets});
  }
  return createDesign({snapshot:createPages(basis,owner,map),assets});
}
let installed=false,saveTimer:ReturnType<typeof setTimeout>|undefined;
export function installSeiyunBridge() {
 if(installed||window.parent===window)return;
 const nonce=new URL(location.href).searchParams.get('seiyun_nonce');if(!nonce||nonce.length>140)return;
 installed=true;
 window.addEventListener('message',async ev=>{
  if(ev.origin!==location.origin||ev.source!==window.parent)return;
  const data=ev.data;if(!data||data.type!=='SEIYUN_NATIVE_INIT'||data.nonce!==nonce)return;
  const owner=safeOwner(data.catalog);
  imageCache=null;previewCache.clear();
  try{sessionStorage.setItem(key,JSON.stringify(owner));}catch{send('SEIYUN_NATIVE_ERROR',{error:'The owner catalog exceeds this browser’s session storage quota.'});return;}
  try{const docId=await buildOwnerDesign(owner);send('SEIYUN_NATIVE_LOADED',{docId});location.hash='/d/'+docId;}
  catch(e){send('SEIYUN_NATIVE_ERROR',{error:String(e).slice(0,240)});}
 });
 const ready=()=>send('SEIYUN_NATIVE_READY',{editor:'opentempl'});
 ready();window.addEventListener('load',ready,{once:true});
}
export function watchSeiyunDoc(doc:DesignDoc) {
 if(window.parent===window||!ownerFromStorage())return()=>{};
 const flush=()=>{try{
  const snapshot=doc.toSnapshot();
  // Reject pathological document sizes rather than filling a Supabase JSON draft.
  const raw=JSON.stringify(snapshot);
  if(raw.length<1_200_000)send('SEIYUN_NATIVE_SAVE',{snapshot});
 }catch{/* Native IndexedDB always remains the local fallback. */}};
 const handler=()=>{clearTimeout(saveTimer);saveTimer=setTimeout(flush,1100);};
 doc.ydoc.on('update',handler);
 // A newly chosen native template is already a meaningful new design: save its
 // initial document even if the owner has not dragged a single object yet.
 saveTimer=setTimeout(flush,500);
 return()=>{clearTimeout(saveTimer);doc.ydoc.off('update',handler);flush();};
}
