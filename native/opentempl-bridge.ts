// Seiyun's limited catalog bridge into the FULL upstream OpenTempl editor.
// All canvas, selection, drag, resize, undo, layers, pagination and export remain upstream.
import { createDesign, openDesign } from '../io/designs';
import { newId } from '../doc/design';
import { prepareImage } from '../io/upload';
import { findTemplate } from '../templates';
import type { Asset, DesignSnapshot, Element, TextElement, ImageElement, Page, Fill } from '../doc/types';
import type { DesignDoc } from '../doc/design';

type OwnerProduct = { id:string; name?:string; category?:string; ingredients?:string; enabled?:boolean; photos?:string[]; primary?:number; sizes?:{name?:string;price?:number}[] };
type OwnerPayload = {
  brand?:{name?:string;tagline?:string;accent?:string;background?:string;text?:string;customColors?:boolean};
  currency?:string; products?:OwnerProduct[]; templateId?:string; selectedPhotoId?:string;
  saved?:{snapshot:DesignSnapshot};
};
const key='seiyun:owner:catalog';
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
function createPages(template:DesignSnapshot,owner:OwnerPayload,images:Map<string,string>):DesignSnapshot {
  const width=Math.max(600,Math.min(1920,template.meta.width||816)),
        height=Math.max(800,Math.min(2560,template.meta.height||1056));
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
    pages[pid]={id:pid,name:'Menu '+(p+1),background:fill,elementIds:ids,notes:'',transition:'none',duration:5};
    order.push(pid);
  }
  return {meta:{...template.meta,id:id(),title:main+' • Menu',width,height,unit:'px',createdAt:Date.now(),updatedAt:Date.now()},pageOrder:order,pages,elements};
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
  const built=templ?await templ.build():undefined;
  const basis=built?.snapshot||{meta:{id:id(),title:'Menu',width:816,height:1056,unit:'px',createdAt:Date.now(),updatedAt:Date.now()},pageOrder:[],pages:{},elements:{}} as DesignSnapshot;
  const {assets,map}=await readOwnerImages(owner);
  if(owner.saved?.snapshot&&owner.saved.snapshot.pageOrder?.length){
    const snap=structuredClone(owner.saved.snapshot);
    // Reattach only catalog photos, and refresh bound factual text without altering native user coordinates.
    for(const el of Object.values(snap.elements)){
      if(el.type==='image'&&el.name?.startsWith('product:')&&el.name.endsWith(':photo')){
        const productId=el.name.slice(8,-6);
        el.assetId=map.get(productId)||null;
      }
      if(el.type==='text'&&el.name?.startsWith('brand:')){
        if(el.name==='brand:name')el.text=owner.brand?.name||el.text;
        if(el.name==='brand:tagline')el.text=owner.brand?.tagline||el.text;
      }
      if(el.type==='text'&&el.name?.startsWith('product:')){
        const [,prodId,field]=el.name.split(':');const p=owner.products?.find(v=>v.id===prodId);
        if(!p)continue;
        if(field==='name')el.text=p.name||'';
        if(field==='ingredients')el.text=p.ingredients||'';
        if(field==='price')el.text=(p.sizes||[]).map(sz=>(sz.name?sz.name+'  ':'')+(owner.currency==='USD'?'$':'')+Number(sz.price||0).toFixed(2)).join('  ·  ');
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
  sessionStorage.setItem(key,JSON.stringify(owner));
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
 return()=>{clearTimeout(saveTimer);doc.ydoc.off('update',handler);flush();};
}
