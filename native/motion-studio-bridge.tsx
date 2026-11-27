'use client';
// Seiyun bridge into the complete upstream Motion Studio Open editor.
// This provides catalog media only; all preset search, tracks, edits, and export stay upstream.
import { useEffect } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { useProjectStore } from '@/store/useProjectStore';
type Message={type?:string;nonce?:string;catalog?:any};
const safeUrl=(value:unknown)=>{const s=String(value||'');return /^https:\/\//i.test(s)||/^blob:/i.test(s)||/^data:image\/(?:png|jpeg|webp);base64,/i.test(s)?s:''};
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
     const init=()=>{
       attempts++;
       if(!useProjectStore.getState().booted){if(attempts<50){setTimeout(init,120);return;}send('SEIYUN_NATIVE_ERROR',{error:'Motion Studio did not finish loading its native project.'});pending=false;return;}
       try{
         const scene=useSceneStore.getState();
         if(c.savedScene&&typeof c.savedScene==='object'){scene.hydrate(c.savedScene);}
         else{
           scene.clearAssets();
           scene.setAspect(c.aspect==='landscape'?'16:9':c.aspect==='square'?'1:1':'9:16');
           scene.setDuration(7);
         }
         // A product asset comes ONLY from the owner's explicit photo selection.
         // Never fetch the prior UI screenshot or substitute sample assets.
         scene.addAssets([{url,name:String(p.name||'Selected drink').slice(0,95),kind:'image'}]);
         // A brand-new upstream project intentionally has ZERO layers.
         // A photo in the media library does not appear until we create a real
         // native motion track. Start on an actual one-hero Spotlight preset.
         if(useSceneStore.getState().tracks.length===0){
           useSceneStore.getState().addTrack('stories-01');
           useSceneStore.getState().setActiveTemplate('stories-01');
           useSceneStore.getState().setValue('count',1);
         }
         if(c.brand?.accent&&/^#[0-9a-f]{6}$/i.test(c.brand.accent))
           scene.setBackground({color:c.brand.accent,source:'color',userSet:true});
         scene.setPlaying(true);
         send('SEIYUN_NATIVE_LOADED',{presets:'full-upstream-motion-library'});
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
