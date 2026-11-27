/* Seiyun showcase — genuine MIT Motion Lab preview; browser-local video and GIF. */
(function(){
'use strict';
let scene=null,sceneToken=0,paused=false;
const gifModule=()=>import('./vendor/gifenc/index.js');
const slug=value=>String(value||'cafe').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,45)||'cafe';
const saveFile=(blob,name)=>{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);};
const productFor=(state,cfg,core)=>core.chooseProduct(state,cfg.productId);
const photosFor=(p,core)=>Array.isArray(p?.photos)?p.photos.map(u=>core.safeUrl(u)).filter(Boolean):[];
function destroy(){
 sceneToken++;
 if(scene?.raf)cancelAnimationFrame(scene.raf);
 scene=null;paused=false;
}
async function mount(host,state,cfg,core,notify){
 destroy();if(!host)return;
 const p=productFor(state,cfg,core);
 if(!p||!core.selectedShowcasePhoto(p)){host.innerHTML='<div class="cs-no-motion">Upload one drink photo to begin your advertisement.</div>';return;}
 const scenes=window.SeiyunCinematicScenes;
 if(!scenes){host.textContent='Cinematic scene engine is unavailable.';notify?.('Cinematic scene engine could not load',true);return;}
 host.innerHTML=scenes.render(p,core.normalizeBrand(state.branding||{}),cfg);
 const root=host.querySelector('.cs-cinematic-scene'),hero=root?.querySelector('.cs-hero-product'),beam=root?.querySelector('.cs-cinematic-beam'),ring=root?.querySelector('.cs-cinematic-ring');
 if(!root||!hero)return;
 const token=sceneToken;
 scene={host,root,hero,beam,ring,raf:0,elapsed:0,last:0,cfg,product:p,token};
 // Studio white-background photographs become a transparent preview derivative in memory.
 // No storage mutation, no AI call, no need to upload a second photo.
 const raw=core.selectedShowcasePhoto(p);
 if(cfg.autoCutout!==false&&raw&&window.SeiyunPhotoCutout){
  loadImage(raw).then(image=>window.SeiyunPhotoCutout.make(image)).then(result=>{
   if(token!==sceneToken||!host.isConnected||!result.changed)return;
   const clean=result.asset.toDataURL('image/png');
   const image=hero.querySelector('img');if(image)image.src=clean;
   document.querySelectorAll('.cs-scene-choice-img').forEach(img=>{
    if(img.getAttribute('src')===raw)img.src=clean;
   });
  }).catch(()=>{/* Original stays visible when storage CORS prevents local pixel access. */});
 }
 function advance(now){
  if(!scene||token!==sceneToken||!host.isConnected)return;
  if(scene.last&&!paused)scene.elapsed+=Math.min(100,now-scene.last);
  scene.last=now;
  const own=scene.cfg,choice=scenes.resolve(p,core.normalizeBrand(state.branding||{}),own);
  const percent=(scene.elapsed/((own.duration||7)*1000))%1;
  const f=scenes.frameAt(percent,choice.id,own.speed);
  const scale=choice.layers.hero.scale*f.heroScale;
  hero.style.animation='none';
  hero.style.transform='translate(-50%,-50%) translateY('+f.heroY+'%) scale('+scale+')';
  if(beam){beam.style.animation='none';beam.style.transform='translateX('+(f.lightX-50)*1.25+'%) rotate(-12deg)';}
  if(ring){ring.style.animation='none';ring.style.transform='translate(-50%,-50%) rotate('+f.ringRotation+'deg) scale('+(0.93+f.glow*.08)+')';}
  scene.raf=requestAnimationFrame(advance);
 }
 scene.raf=requestAnimationFrame(advance);
}
function toggle(){if(!scene)return;paused=!paused;}
function pauseForEdit(){if(scene)paused=true;}
function update(state,cfg,core){if(scene){scene.cfg=cfg;}}
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Product photograph could not load with export permission. Check Storage access/CORS or upload a PNG directly.'));img.src=src;});}
async function assets(state,cfg,core){const p=productFor(state,cfg,core),src=core.selectedShowcasePhoto(p);if(!p||!src)throw Error('Upload or select a product photograph first.');
const image=await loadImage(src),photo=cfg.autoCutout===false?image:(window.SeiyunPhotoCutout?.make(image).asset||image);return {photo,product:p};}
function renderFrame(ctx,photo,p,brand,cfg,mod,progress,w,h,state){
 if(!window.SeiyunCinematicScenes)throw Error('Cinematic scene renderer is unavailable');
 window.SeiyunCinematicScenes.drawFrame(ctx,photo,p,brand,cfg,progress,w,h);
}
async function downloadVideo(state,cfg,core){
 if(typeof MediaRecorder==='undefined'||!HTMLCanvasElement.prototype.captureStream)throw Error('Video recording is unsupported in this browser. Try Chrome desktop or download a GIF.');
 const fmt=core.recordingFormat(t=>MediaRecorder.isTypeSupported(t));
 if(!fmt)throw Error('This browser does not support native video recording. Download a GIF instead.');
 const {photo,product}=await assets(state,cfg,core);
 const mod=null;const canvas=document.createElement('canvas');canvas.width=720;canvas.height=1280;
 const ctx=canvas.getContext('2d',{alpha:false});renderFrame(ctx,photo,product,core.normalizeBrand(state.branding||{}),cfg,mod,0,720,1280,state);
 const stream=canvas.captureStream(24),chunks=[];
 let recorder;
 try{recorder=new MediaRecorder(stream,{mimeType:fmt.mime,videoBitsPerSecond:3500000});}
 catch(e){stream.getTracks().forEach(t=>t.stop());throw Error('Your browser could not initialize the video encoder: '+e.message);}
 const seconds=cfg.duration||7;
 await new Promise((resolve,reject)=>{
  let startedAt=0,raf=0,done=false;
  recorder.ondataavailable=ev=>{if(ev.data?.size)chunks.push(ev.data);};
  recorder.onerror=ev=>{if(!done){done=true;cancelAnimationFrame(raf);reject(Error('Video export failed: '+(ev.error?.message||'encoder error')));}};
  recorder.onstop=()=>{if(!done){done=true;cancelAnimationFrame(raf);resolve();}};
  recorder.start(250);
  function step(now){if(!startedAt)startedAt=now;const progress=Math.min(1,(now-startedAt)/(seconds*1000));
   try{renderFrame(ctx,photo,product,core.normalizeBrand(state.branding||{}),cfg,mod,progress,720,1280,state);}
   catch(e){if(!done){done=true;reject(e);}try{recorder.stop();}catch(_){}return;}
   if(progress>=1){if(recorder.state!=='inactive')recorder.stop();return;}
   raf=requestAnimationFrame(step);
  }
  raf=requestAnimationFrame(step);
 });
 stream.getTracks().forEach(t=>t.stop());
 const blob=new Blob(chunks,{type:fmt.mime});if(blob.size<1000)throw Error('Encoder returned an empty video. Please retry or use GIF.');
 saveFile(blob,slug(core.normalizeBrand(state.branding||{}).name)+'-'+slug(product.name)+'.'+fmt.ext);
 return {message:'Downloaded '+fmt.ext.toUpperCase()+' video. The file is yours to use anywhere.'};
}
async function downloadGif(state,cfg,core){
 const {photo,product}=await assets(state,cfg,core);
 const mod=null;
 const {GIFEncoder,quantize,applyPalette}=await gifModule();
 const gif=GIFEncoder(),w=360,h=640,cn=document.createElement('canvas');cn.width=w;cn.height=h;const ctx=cn.getContext('2d',{willReadFrequently:true});
 const count=36;
 for(let i=0;i<count;i++){
  renderFrame(ctx,photo,product,core.normalizeBrand(state.branding||{}),cfg,mod,i/count,w,h,state);
  const rgba=ctx.getImageData(0,0,w,h).data;
  const pal=quantize(rgba,128,{format:'rgb565'}),indexed=applyPalette(rgba,pal);
  gif.writeFrame(indexed,w,h,{palette:pal,delay:Math.round(((cfg.duration||7)*1000)/count)});
  if(i%5===0)await new Promise(resolve=>setTimeout(resolve,0));
 }
 gif.finish();
 const bytes=gif.bytes();if(!bytes.length)throw Error('GIF export failed to produce frames.');
 saveFile(new Blob([bytes],{type:'image/gif'}),slug(core.normalizeBrand(state.branding||{}).name)+'-'+slug(product.name)+'.gif');
 return {message:'Animated GIF downloaded (36 frames).'};
}
async function downloadStill(state,cfg,core){
 const {photo,product}=await assets(state,cfg,core);
 const canvas=document.createElement('canvas');canvas.width=720;canvas.height=1280;
 const ctx=canvas.getContext('2d',{alpha:false});
 renderFrame(ctx,photo,product,core.normalizeBrand(state.branding||{}),cfg,null,.5,720,1280,state);
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
 if(!blob)throw Error('Unable to generate still image');
 saveFile(blob,slug(core.normalizeBrand(state.branding||{}).name)+'-'+slug(product.name)+'-poster.png');
 return {message:'Downloaded a full-size promotional poster.'};
}
async function removeWhiteBackground(state,cfg,core){
 const p=productFor(state,cfg,core),src=core.selectedShowcasePhoto(p);
 if(!src)throw Error('Select a product photo first.');
 if(!window.seiyunCloud?.upload)throw Error('Sign in to save a transparent product image.');
 const img=await loadImage(src),cn=document.createElement('canvas');
 const scale=Math.min(1,1200/Math.max(img.width,img.height));cn.width=Math.max(1,Math.round(img.width*scale));cn.height=Math.max(1,Math.round(img.height*scale));
 const ctx=cn.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,cn.width,cn.height);
 const frame=ctx.getImageData(0,0,cn.width,cn.height),d=frame.data,w=cn.width,h=cn.height,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);
 const isWhite=k=>{const i=k*4;return d[i]>236&&d[i+1]>236&&d[i+2]>236&&Math.max(d[i],d[i+1],d[i+2])-Math.min(d[i],d[i+1],d[i+2])<17;};
 let head=0,tail=0;
 const push=k=>{if(!seen[k]&&isWhite(k)){seen[k]=1;queue[tail++]=k;}};
 for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}
 for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
 while(head<tail){const i=queue[head++],x=i%w,y=Math.floor(i/w),off=i*4;d[off+3]=0;
  if(x>0)push(i-1);if(x+1<w)push(i+1);if(y>0)push(i-w);if(y+1<h)push(i+w);
 }
 if(tail<w*h*.015)throw Error('No plain white background was detected. This automatic cutout works only on near-white backgrounds.');
 ctx.putImageData(frame,0,0);
 const blob=await new Promise(resolve=>cn.toBlob(resolve,'image/png'));
 if(!blob||blob.size>6291456)throw Error('Processed cutout is too large to upload.');
 const file=new File([blob],'product-transparent.png',{type:'image/png'});
 const url=await window.seiyunCloud.upload(file);
 p.photos.push(url);p.showcasePrimary=p.photos.length-1;
 return {updated:true,message:'Saved a transparent copy. The original photograph is unchanged.'};
}
window.SeiyunShowcase={mount,destroy,toggle,pauseForEdit,update,downloadVideo,downloadGif,downloadStill,removeWhiteBackground};
})();
