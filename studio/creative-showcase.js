/* Product Showcase: one hero drink. Live preview, GIF, video and still share the same
   deterministic cinematic drawing function in hero-scenes.js. No AI requests or sample stock. */
(function(){
'use strict';
const scenes=window.SeiyunHeroScenes;
let generation=0,host=null,canvas=null,context=null,current=null,source=null,photo=null,frameBoxes={},selection='',playing=true,startAt=0,lastTime=0,raf=0,drag=null,notice=null;
const gifModule=()=>import('./vendor/gifenc/index.js');
const slug=v=>String(v||'cafe').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48)||'cafe';
const clamp=(n,a,b)=>Math.min(b,Math.max(a,Number(n)||0));
const product=(state,cfg,core)=>core.chooseProduct(state,cfg.productId);
const save=()=>{if(typeof saveSoon==='function')saveSoon()};
const dims=format=>format==='landscape'?[1280,720]:format==='square'?[900,900]:[720,1280];
function saveFile(blob,name){
 const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),45000);
}
const loadImage=src=>new Promise((resolve,reject)=>{
 const i=new Image();i.crossOrigin='anonymous';i.decoding='async';i.onload=()=>resolve(i);
 i.onerror=()=>reject(Error('Product image could not load for the cinematic export. Check the signed-in photo URL and storage CORS permissions.'));
 i.src=src;
});
function removeWhitePixels(image){
 const max=1500,ratio=Math.min(1,max/Math.max(image.naturalWidth||image.width,image.naturalHeight||image.height));
 const w=Math.max(1,Math.round((image.naturalWidth||image.width)*ratio)),h=Math.max(1,Math.round((image.naturalHeight||image.height)*ratio));
 const cv=document.createElement('canvas');cv.width=w;cv.height=h;const ctx=cv.getContext('2d',{willReadFrequently:true});
 ctx.drawImage(image,0,0,w,h);
 let frame;
 try{frame=ctx.getImageData(0,0,w,h);}catch{return {asset:image,changed:false};}
 const data=frame.data,visited=new Uint8Array(w*h),queue=new Int32Array(w*h);let front=0,end=0;
 const isBg=(p)=>{const off=p*4,a=data[off+3];if(a<180)return false;
 const r=data[off],g=data[off+1],b=data[off+2];return r>234&&g>234&&b>234&&Math.max(r,g,b)-Math.min(r,g,b)<22;};
 function add(p){if(!visited[p]&&isBg(p)){visited[p]=1;queue[end++]=p;}}
 for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
 while(front<end){const p=queue[front++],x=p%w,y=Math.floor(p/w),k=p*4;data[k+3]=0;
 if(x>0)add(p-1);if(x<w-1)add(p+1);if(y>0)add(p-w);if(y<h-1)add(p+w);
 }
 if(end<w*h*.012)return {asset:image,changed:false};
 // Soften the cutout boundary only (does not erase the cup/foam or logos).
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const p=y*w+x;if(visited[p])continue;
 const neighbor=visited[p-1]||visited[p+1]||visited[p-w]||visited[p+w];
 if(neighbor){const k=p*4;data[k+3]=Math.min(data[k+3],224);}}
 ctx.putImageData(frame,0,0);
 return {asset:cv,changed:true};
}
function destroy(){
 generation++;cancelAnimationFrame(raf);raf=0;if(host)host.replaceChildren();host=null;canvas=null;context=null;current=null;source=null;photo=null;selection='';drag=null;startAt=0;lastTime=0;playing=true;
}
function cfgCopy(cfg){return {...cfg,layers:scenes.layers(cfg)}}
function activeCtx(){return current&&photo&&canvas&&context}
function drawAt(seconds,interactive=true){
 if(!activeCtx())return;
 frameBoxes=scenes.draw(context,photo,product(current.state,current.cfg,current.core),current.core.normalizeBrand(current.state.branding||{}),current.cfg,seconds,{export:!interactive,selected:interactive?selection:null});
}
function run(now){
 if(!activeCtx())return;
 if(!startAt)startAt=now;
 if(playing)lastTime+=(Math.min(45,Math.max(0,now-(run.last||now)))/1000);
 run.last=now;
 drawAt(lastTime,true);
 raf=requestAnimationFrame(run);
}
function localCoords(ev){
 const rect=canvas.getBoundingClientRect();
 return {x:(ev.clientX-rect.left)*canvas.width/rect.width,y:(ev.clientY-rect.top)*canvas.height/rect.height};
}
function nearestLayer(p){
 for(const key of ['price','title','brand','hero']){
  const b=frameBoxes[key];if(b&&p.x>=b.x-12&&p.x<=b.x+b.w+12&&p.y>=b.y-12&&p.y<=b.y+b.h+12)return key;
 }
 return '';
}
function updateLayer(key,changes){const c=current.cfg;if(!c.layers)c.layers={};c.layers[key]={...scenes.layers(c)[key],...changes};current.state.showcaseArtwork={...current.state.showcaseArtwork,...c};}
function registerGesture(){
 canvas.style.touchAction='none';canvas.style.cursor='grab';canvas.tabIndex=0;canvas.setAttribute('aria-label','Product advertisement canvas; tap a drink or text to select, drag to move, drag the corner to resize.');
 canvas.addEventListener('pointerdown',ev=>{
  if(!activeCtx())return;
  const p=localCoords(ev),key=nearestLayer(p);if(!key){selection='';drawAt(lastTime);return;}
  selection=key;const box=frameBoxes[key];
  const isResize=p.x>box.x+box.w-42*canvas.width/720&&p.y>box.y+box.h-42*canvas.width/720;
  drag={key,mode:isResize?'resize':'move',x:p.x,y:p.y,base:scenes.layers(current.cfg)[key]};
  canvas.setPointerCapture(ev.pointerId);canvas.style.cursor=isResize?'nwse-resize':'grabbing';ev.preventDefault();
 });
 canvas.addEventListener('pointermove',ev=>{
  if(!drag||!activeCtx())return;const p=localCoords(ev),dx=p.x-drag.x,dy=p.y-drag.y,b=drag.base;
  if(drag.mode==='move')updateLayer(drag.key,{x:clamp(b.x+dx/canvas.width,.06,.94),y:clamp(b.y+dy/canvas.height,.04,.97)});
  else updateLayer(drag.key,{scale:clamp(b.scale+(dx+dy)/(canvas.width*.58),.42,2.6)});
  drawAt(lastTime,true);ev.preventDefault();
 });
 const finish=()=>{if(drag){drag=null;canvas.style.cursor='grab';save();}};
 canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);
 canvas.addEventListener('dblclick',ev=>{const key=nearestLayer(localCoords(ev));if(key==='title'||key==='brand'||key==='price')editText(key);});
 canvas.addEventListener('keydown',ev=>{
  if(!selection)return;
  const value=scenes.layers(current.cfg)[selection],delta=ev.shiftKey?.025:.008,changes={};
  if(ev.key==='ArrowLeft')changes.x=clamp(value.x-delta,.06,.94);
  if(ev.key==='ArrowRight')changes.x=clamp(value.x+delta,.06,.94);
  if(ev.key==='ArrowUp')changes.y=clamp(value.y-delta,.04,.97);
  if(ev.key==='ArrowDown')changes.y=clamp(value.y+delta,.04,.97);
  if(ev.key==='+'||ev.key==='=')changes.scale=clamp(value.scale+.08,.42,2.6);
  if(ev.key==='-')changes.scale=clamp(value.scale-.08,.42,2.6);
  if(ev.key==='Escape'){selection='';drawAt(lastTime);return;}
  if(Object.keys(changes).length){updateLayer(selection,changes);drawAt(lastTime);save();ev.preventDefault();}
 });
}
function editText(key){
 if(!host||!activeCtx())return;
 const rect=frameBoxes[key];if(!rect)return;
 const state=current.state,cfg=current.cfg,p=product(state,cfg,current.core);
 const val=key==='title'?String(cfg.headline||p?.name||''):key==='brand'?String(state.branding?.name||''):String(p?.sizes?.[0]?.price??'');
 const input=document.createElement('input');input.className='cs-hero-inline-input';input.value=val;input.setAttribute('aria-label','Edit selected '+key);
 input.style.left=(rect.x/canvas.width*100)+'%';input.style.top=(rect.y/canvas.height*100)+'%';
 input.style.width=Math.max(28,rect.w/canvas.width*100)+'%';host.append(input);input.focus();input.select();
 const commit=()=>{const text=input.value.trim();input.remove();if(!text)return;
  if(key==='title'){cfg.headline=text.slice(0,110);state.showcaseArtwork={...state.showcaseArtwork,headline:cfg.headline};}
  if(key==='brand'){state.branding={...state.branding,name:text.slice(0,90)};}
  if(key==='price'&&p?.sizes?.[0]){const price=Number(text.replace(/[^\d.]/g,''));if(Number.isFinite(price)&&price>=0&&price<=9999)p.sizes[0].price=price;}
  save();drawAt(lastTime,true);
 };
 input.addEventListener('blur',commit,{once:true});input.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key==='Escape'){e.preventDefault();input.blur();}});
}
async function mount(el,state,cfg,core,notify){
 destroy();if(!el||!scenes)return;host=el;host.classList.add('cs-hero-host');const token=generation;
 current={state,cfg:cfgCopy(cfg),core,notify};
 const [w,h]=dims(current.cfg.format);
 canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;canvas.className='cs-hero-canvas';host.append(canvas);
 context=canvas.getContext('2d',{alpha:false});
 const p=product(state,cfg,core),src=core.selectedShowcasePhoto(p);
 if(!src){context.fillStyle='#35231d';context.fillRect(0,0,w,h);context.fillStyle='#fff3e5';context.textAlign='center';context.font='bold '+Math.floor(w*.05)+'px Georgia';context.fillText('Upload a drink photo to start',w/2,h/2,w*.85);return;}
 try{const img=await loadImage(src);if(token!==generation)return;
  const prepared=current.cfg.autoCutout!==false?removeWhitePixels(img):{asset:img};
  photo=prepared.asset;
  registerGesture();
  lastTime=0;run.last=0;raf=requestAnimationFrame(run);
  previewChoices(state,cfg,core,photo);
 }catch(e){if(token===generation){notify?.(e.message,true);context.fillStyle='#35231d';context.fillRect(0,0,w,h);}}
}
function previewChoices(state,cfg,core,asset){
 const item=product(state,cfg,core),brand=core.normalizeBrand(state.branding||{});
 document.querySelectorAll('[data-cs-scene-thumb]').forEach(el=>{
  try{const id=el.dataset.csSceneThumb,ctx=el.getContext('2d');scenes.draw(ctx,asset,item,brand,{...cfg,mode:id},2.2,{export:true});}catch(e){/* a thumbnail cannot block main preview */ }
 });
}
function toggle(){playing=!playing;return {playing};}
function update(state,cfg,core){if(current){current.cfg=cfgCopy(cfg);current.state=state;current.core=core||current.core;}}
function dimensionsFor(cfg){return dims(cfg.format);}
async function art(state,cfg,core){
 const p=product(state,cfg,core),src=core.selectedShowcasePhoto(p);if(!src||!p)throw Error('Upload or select a drink photo first.');
 if(current&&photo&&p.id===product(current.state,current.cfg,current.core)?.id&&current.cfg.autoCutout===cfg.autoCutout)return {asset:photo,product:p};
 const img=await loadImage(src);return {asset:cfg.autoCutout===false?img:removeWhitePixels(img).asset,product:p};
}
function frame(ctx,asset,p,state,cfg,core,time){
 return scenes.draw(ctx,asset,p,core.normalizeBrand(state.branding||{}),{...cfg,currency:state.currency||'USD'},time,{export:true});
}
async function downloadStill(state,cfg,core){
 const {asset,product:p}=await art(state,cfg,core),[w,h]=dims(cfg.format),cv=document.createElement('canvas');cv.width=w;cv.height=h;
 frame(cv.getContext('2d'),asset,p,state,cfg,core,1.8);
 const blob=await new Promise(resolve=>cv.toBlob(resolve,'image/png'));
 if(!blob)throw Error('PNG export failed; check that the product photo supports canvas capture.');
 saveFile(blob,slug(state.branding?.name)+'-'+slug(p.name)+'-poster.png');return {message:'Downloaded a full-resolution poster with your product and selected scene.'};
}
async function downloadVideo(state,cfg,core){
 if(typeof MediaRecorder!=='function'||!HTMLCanvasElement.prototype.captureStream)throw Error('This browser cannot record native video; use GIF instead.');
 const format=core.recordingFormat(t=>MediaRecorder.isTypeSupported(t));
 if(!format)throw Error('MP4/WebM encoding is not supported here. Try Chrome desktop or download GIF.');
 const {asset,product:p}=await art(state,cfg,core),[w,h]=dims(cfg.format),cv=document.createElement('canvas');cv.width=w;cv.height=h;
 const ctx=cv.getContext('2d',{alpha:false}),duration=clamp(cfg.duration,3,15);
 frame(ctx,asset,p,state,cfg,core,0);
 const stream=cv.captureStream(24),chunks=[];
 let recorder;
 try{recorder=new MediaRecorder(stream,{mimeType:format.mime,videoBitsPerSecond:4800000});}
 catch(e){stream.getTracks().forEach(t=>t.stop());throw Error('Video recorder initialization failed: '+e.message);}
 await new Promise((resolve,reject)=>{
  let zero=0,rafId=0,finished=false;
  recorder.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data)};
  recorder.onerror=e=>{if(!finished){finished=true;cancelAnimationFrame(rafId);reject(Error(e.error?.message||'Encoder failed'));}};
  recorder.onstop=()=>{if(!finished){finished=true;cancelAnimationFrame(rafId);resolve();}};
  recorder.start(300);
  function drawTick(now){
   if(!zero)zero=now;
   const t=Math.min(duration,(now-zero)/1000);
   try{frame(ctx,asset,p,state,cfg,core,t);}catch(e){finished=true;cancelAnimationFrame(rafId);reject(e);try{recorder.stop()}catch(_){}return;}
   if(t>=duration){if(recorder.state!=='inactive')recorder.stop();return;}
   rafId=requestAnimationFrame(drawTick);
  }
  rafId=requestAnimationFrame(drawTick);
 });
 stream.getTracks().forEach(t=>t.stop());
 const result=new Blob(chunks,{type:format.mime});
 if(result.size<1000)throw Error('The video encoder returned an empty file.');
 saveFile(result,slug(state.branding?.name)+'-'+slug(p.name)+'-cinematic.'+format.ext);
 return {message:'Downloaded '+format.ext.toUpperCase()+' using the same scene as the live preview.'};
}
async function downloadGif(state,cfg,core){
 const {asset,product:p}=await art(state,cfg,core);
 const {GIFEncoder,quantize,applyPalette}=await gifModule();
 const [W,H]=dims(cfg.format),ratio=Math.min(360/W,640/H),w=Math.max(200,Math.round(W*ratio)),h=Math.max(200,Math.round(H*ratio));
 const cv=document.createElement('canvas');cv.width=w;cv.height=h;const ctx=cv.getContext('2d',{willReadFrequently:true});
 const count=42,encoder=GIFEncoder(),duration=clamp(cfg.duration,3,15);
 for(let i=0;i<count;i++){
  frame(ctx,asset,p,state,cfg,core,duration*i/count);
  const rgba=ctx.getImageData(0,0,w,h).data,palette=quantize(rgba,128,{format:'rgb565'}),indices=applyPalette(rgba,palette);
  encoder.writeFrame(indices,w,h,{palette,delay:Math.round(duration*1000/count)});
  if(i%4===0)await new Promise(r=>setTimeout(r,0));
 }
 encoder.finish();const bytes=encoder.bytes();
 if(!bytes?.length)throw Error('GIF encoder did not produce frames.');
 saveFile(new Blob([bytes],{type:'image/gif'}),slug(state.branding?.name)+'-'+slug(p.name)+'-cinematic.gif');
 return {message:'Downloaded animated GIF from the same cinematic preview.'};
}
async function removeWhiteBackground(state,cfg,core){
 const p=product(state,cfg,core),src=core.selectedShowcasePhoto(p);
 if(!src)throw Error('Select a product photo before creating a transparent version.');
 if(!window.seiyunCloud?.upload)throw Error('Please sign in to save your transparent product image.');
 const img=await loadImage(src),result=removeWhitePixels(img);if(!result.changed)throw Error('No simple white background detected. This photo may need a more advanced cutout.');
 const image=result.asset,blob=await new Promise(resolve=>image.toBlob(resolve,'image/png'));
 if(!blob||blob.size>6291456)throw Error('Image is too large for upload.');
 const file=new File([blob],slug(p.name)+'-transparent.png',{type:'image/png'}),url=await window.seiyunCloud.upload(file);
 p.photos.push(url);p.showcasePrimary=p.photos.length-1;
 return {updated:true,message:'Saved transparent product cutout without changing your original photo.'};
}
function resetLayers(state){if(!state.showcaseArtwork)state.showcaseArtwork={};state.showcaseArtwork.layers={};save();if(current){current.cfg.layers={};drawAt(lastTime);}}
window.SeiyunShowcase={mount,destroy,toggle,update,downloadVideo,downloadGif,downloadStill,removeWhiteBackground,resetLayers,getBoxes:()=>frameBoxes};
})();
