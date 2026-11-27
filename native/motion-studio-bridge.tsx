'use client';
// Seiyun bridge into the complete upstream Motion Studio Open editor.
// This provides catalog media only; all preset search, tracks, edits, and export stay upstream.
import { useEffect } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { useProjectStore } from '@/store/useProjectStore';
import { getRendererInstance } from '@/lib/rendererInstance';
import { createGradientSpec } from '@/lib/gradient';
type Message={type?:string;nonce?:string;catalog?:any};
const safeUrl=(value:unknown)=>{const s=String(value||'');return /^https:\/\//i.test(s)||/^blob:/i.test(s)||/^data:image\/(?:png|jpeg|webp);base64,/i.test(s)?s:''};
// Static owner-data assets only: the upstream engine owns ALL motion, timing,
// layer transforms and export. Each caption is its own native media track,
// so moving/scaling it never shifts the photo or the background.
async function catalogCaption(c:any,kind:'brand'|'details',aspect:string):Promise<Blob>{
 const cv=document.createElement('canvas');
 [cv.width,cv.height]=aspect==='16:9'?[1920,1080]:aspect==='1:1'?[1080,1080]:[1080,1920];
 const g=cv.getContext('2d')!;const w=cv.width,h=cv.height,p=c.product||{};
 g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff3df';
 g.shadowColor='rgba(21,12,9,.55)';g.shadowBlur=12;g.shadowOffsetY=2;
 const fit=(value:string,y:number,size:number,weight:string,family:string)=>{
  if(!value)return;
  g.font=weight+' '+size+'px '+family;
  const fs=Math.min(size,size*w*.87/Math.max(1,g.measureText(value).width));
  g.font=weight+' '+fs+'px '+family;g.fillText(value,w/2,y,w*.9);
 };
 if(kind==='brand'){
  const label=String(c.brand?.name||'Your Café').slice(0,80);
  fit(label,h*.075,w*.055,'700','Georgia, serif');
  fit(String(c.brand?.tagline||'').slice(0,90),h*.112,w*.017,'600','Arial, sans-serif');
 }else{
  fit(String(p.name||'Selected drink').slice(0,95),h*.825,w*.07,'700','Georgia, serif');
  fit(String(p.ingredients||'').slice(0,130),h*.873,w*.026,'500','Arial, sans-serif');
  const prices=(Array.isArray(p.sizes)?p.sizes:[]).slice(0,4).map((z:any)=>{
   let money='';try{money=new Intl.NumberFormat('en-US',{style:'currency',currency:c.currency||'USD'}).format(Number(z.price||0));}catch{money=String.fromCharCode(36)+Number(z.price||0).toFixed(2);}
   return (z.name?z.name+' ':'')+money;
  }).join('  ·  ');
  fit(prices,h*.924,w*.045,'700','Arial, sans-serif');
 }
 return new Promise((resolve,reject)=>cv.toBlob(b=>b?resolve(b):reject(new Error('Cannot prepare caption graphic')),'image/png'));
}
function sceneGradient(c:any){
 const text=String((c.product?.name||'')+' '+(c.product?.ingredients||'')).toLowerCase();
 const colors=/matcha|pistachio|mint/.test(text)?['#45643a','#14281e']:
 /strawberry|raspberry|berry|hibiscus/.test(text)?['#9a425f','#351927']:
 /saffron|mango|cinnamon|cardamom|baklava/.test(text)?['#c0813b','#35201a']:
 ['#986447','#241813'];
 const spec=createGradientSpec(colors[0],colors[1],'warped-field');
 spec.mode='advanced';spec.softness=.13;spec.center={x:.5,y:.43};
 spec.advanced={...spec.advanced,flow:.23,warp:.48,detail:1,scale:1.35};
 return spec;
}

export default function SeiyunNativeBridge() {
 useEffect(()=>{
   if(window.parent===window)return;
   const nonce=new URL(location.href).searchParams.get('seiyun_nonce');
   if(!nonce||nonce.length>140)return;
   const send=(type:string,other:Record<string,unknown>={})=>window.parent.postMessage({type,editor:'motion-studio',nonce,...other},location.origin);
   let pending=false,readyTimer:ReturnType<typeof setInterval>|undefined,unsubscribe:(()=>void)|undefined;
   const handle=(ev:MessageEvent<Message>)=>{
     if(ev.source!==window.parent||ev.origin!==location.origin)return;
     const data=ev.data;if(!data||data.type!=='SEIYUN_NATIVE_INIT'||data.nonce!==nonce)return;
     if(pending)return;pending=true;
     const c=data.catalog||{},p=c.product||{};
     const url=safeUrl(c.photoUrl);
     if(!url){send('SEIYUN_NATIVE_ERROR',{error:'Select a real drink photograph in your product library before opening the animation editor.'});pending=false;return;}
     let attempts=0;
     const init=async()=>{
       attempts++;
       if(!useProjectStore.getState().booted){if(attempts<50){setTimeout(init,120);return;}send('SEIYUN_NATIVE_ERROR',{error:'Motion Studio did not finish loading its native project.'});pending=false;return;}
       try{
         const scene=useSceneStore.getState();
         const restored=!!(c.savedScene&&typeof c.savedScene==='object');
         if(restored){scene.hydrate(c.savedScene);await scene.rehydrateUploads();}
         else{
           scene.blankScene();
           // clearAssets() restores upstream demo slots rather than emptying
           // them. Use the upstream hydrate contract to start with no samples.
           scene.hydrate({assets:[],tracks:[],activeTrackId:''});
           scene.setAspect(c.aspect==='landscape'?'16:9':c.aspect==='square'?'1:1':'9:16');
           scene.setDuration(7);
         }
         const displayName=String(p.name||'Selected drink').slice(0,95);
         // Stable media slots survive scene restoration. Replacing a confirmed
         // photo preserves track IDs and transforms instead of accumulating copies.
         const ensureAsset=(name:string,item:{url:string;blob?:Blob;kind:'image'})=>{
           const st=useSceneStore.getState();
           const index=st.assets.findIndex(a=>a.name===name);
           if(index>=0){st.replaceAssetAt(index,{...item,name});return useSceneStore.getState().assets[index].id;}
           st.addAssets([{...item,name}]);
           return useSceneStore.getState().assets.find(a=>a.name===name)!.id;
         };
         let photoAsset:string;
         if(url.startsWith('data:')||url.startsWith('blob:')){
           const blob=await fetch(url).then(r=>r.blob());
           photoAsset=ensureAsset('Catalog photo',{url:URL.createObjectURL(blob),blob,kind:'image'});
         }else photoAsset=ensureAsset('Catalog photo',{url,kind:'image'});
         if(!restored||useSceneStore.getState().tracks.length===0){
           const st=useSceneStore.getState();
           st.addTrack('scale-01');
           st.setActiveTemplate('scale-01');
           st.setValue('count',1);
           st.setValue('cardSize',238);
           st.setValue('zoom',10);
           st.setValue('anchor','center');
           st.setValue('spin','off');
           st.setValue('cornerRadius',0);
           const heroId=useSceneStore.getState().activeTrackId;
           st.patchTrack(heroId,{assetIds:[photoAsset],name:displayName+' — product'});
           st.setBackground({gradientSpec:sceneGradient(c)});
           // Two independent native tracks: brand lettering and product details.
           // These are raster media generated from the catalog, not native text.
           for(const [kind,label] of [['brand','Brand lettering'],['details','Product details']] as const){
             const blob=await catalogCaption(c,kind,useSceneStore.getState().aspect);
             const asset=ensureAsset('Catalog '+kind,{url:URL.createObjectURL(blob),blob,kind:'image'});
             st.addTrack('scale-01');st.setActiveTemplate('scale-01');
             st.setValue('count',1);st.setValue('cardSize',340);st.setValue('zoom',0);st.setValue('anchor','center');st.setValue('cornerRadius',0);
             const track=useSceneStore.getState().activeTrackId;
             st.patchTrack(track,{assetIds:[asset],name:label});
           }
           st.setActiveTrack(heroId);
         }else{
           // Catalog-owned graphics are regenerated from factual owner data,
           // but their independent native track geometry remains as the owner saved it.
           for(const kind of ['brand','details'] as const){
             if(useSceneStore.getState().assets.some(a=>a.name==='Catalog '+kind)){
               const blob=await catalogCaption(c,kind,useSceneStore.getState().aspect);
               ensureAsset('Catalog '+kind,{url:URL.createObjectURL(blob),blob,kind:'image'});
             }
           }
         }
         scene.setPlaying(true);
         // Store boot and asset import are NOT proof that the renderer or mobile
         // workspace is ready. Wait for the actual native canvas to mount.
         let rendererReady=false;
         for(let wait=0;wait<150;wait++){
           const renderer=getRendererInstance();
           const stage=document.querySelector<HTMLCanvasElement>('canvas.stage-canvas');
           if(renderer&&stage?.isConnected&&stage.width>0&&stage.height>0&&stage.getBoundingClientRect().width>0){
             try{renderer.renderFrame(useSceneStore.getState().frame);rendererReady=true;break;}catch{}
           }
           await new Promise(resolve=>setTimeout(resolve,200));
         }
         if(!rendererReady)throw new Error('The native motion renderer did not initialize; try another supported browser or reload.');
         send('SEIYUN_NATIVE_LOADED',{presets:'full-upstream-motion-library',layers:useSceneStore.getState().tracks.length,assets:useSceneStore.getState().assets.length,templateId:useSceneStore.getState().activeTemplateId});
         // Persist a serializable scene, not the native editor's functions or original photo blobs.
         let last='',timer:ReturnType<typeof setTimeout>|undefined;
         unsubscribe=useSceneStore.subscribe(s=>{
           if(timer)clearTimeout(timer);
           timer=setTimeout(()=>{
             const safe={tracks:s.tracks,activeTrackId:s.activeTrackId,activeTemplateId:s.activeTemplateId,
               values:s.values,easing:s.easing,aspect:s.aspect,width:s.width,height:s.height,
               duration:s.duration,fps:s.fps,background:s.background,logo:s.logo,sceneCamera:s.sceneCamera,
               effects:s.effects,assets:s.assets.map(a=>({...a,url:a.origin==='upload'?'':a.url})),cardShape:s.cardShape};
             const raw=JSON.stringify(safe);
             if(raw.length>700000||raw===last)return;last=raw;
             send('SEIYUN_NATIVE_SAVE',{scene:safe});
           },1300);
         });
       }catch(e){send('SEIYUN_NATIVE_ERROR',{error:String(e).slice(0,240)});}
     };
     init();
   };
   window.addEventListener('message',handle);
   const hello=()=>send('SEIYUN_NATIVE_READY',{editor:'motion-studio'});
   hello();readyTimer=setInterval(hello,1700);
   return()=>{window.removeEventListener('message',handle);if(readyTimer)clearInterval(readyTimer);unsubscribe?.();};
 },[]);
 return null;
}
