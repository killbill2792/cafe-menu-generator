/* Seiyun showcase — genuine MIT Motion Lab preview; browser-local video and GIF. */
(function(){
'use strict';
let scene=null,sceneToken=0,engine=null,paused=false;
const motionModule=()=>import('./vendor/motion-lab/motion.js');
const gifModule=()=>import('./vendor/gifenc/index.js');
const slug=value=>String(value||'cafe').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,45)||'cafe';
const saveFile=(blob,name)=>{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);};
const productFor=(state,cfg,core)=>core.chooseProduct(state,cfg.productId);
const photosFor=(p,core)=>Array.isArray(p?.photos)?p.photos.map(u=>core.safeUrl(u)).filter(Boolean):[];
function destroy(){sceneToken++;if(scene){scene.destroy();scene=null;}paused=false;}
async function mount(host,state,cfg,core,notify){
 destroy();if(!host)return;
 const p=productFor(state,cfg,core),photos=photosFor(p,core);
 if(!p||!photos.length){host.innerHTML='<div class="cs-no-motion">Upload a drink photo to see real motion.</div>';return;}
 const token=sceneToken;
 try{
  const mod=await motionModule();if(token!==sceneToken||!host.isConnected)return;
  engine=mod;
  const distinct=photos.map(src=>({src,title:p.name,category:p.category||'Drink'}));
  const chosen=core.selectedShowcasePhoto(p);
  distinct.sort((a,b)=>Number(b.src===chosen)-Number(a.src===chosen));
  scene=new mod.MotionScene(host,distinct,{mode:cfg.mode,collection:'objects',format:'full',frame:'none',center:false,count:6,size:235,depth:.8,speed:cfg.speed,tilt:19,direction:1});
  paused=false;
 }catch(e){if(token===sceneToken){host.innerHTML='<div class="cs-no-motion">Motion engine could not load: '+String(e.message||e).replace(/[<>]/g,'')+'</div>';notify?.('Motion preview failed: '+e.message,true);}}
}
function toggle(){if(!scene)return;paused=!paused;scene.setPlaying(!paused);}
function update(state,cfg,core){if(scene){scene.update({...scene.config,mode:cfg.mode,speed:cfg.speed});}}
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Product photograph could not load with export permission. Check Storage access/CORS or upload a PNG directly.'));img.src=src;});}
async function assets(state,cfg,core){const p=productFor(state,cfg,core),src=core.selectedShowcasePhoto(p);if(!p||!src)throw Error('Upload or select a product photograph first.');
const photo=await loadImage(src);return {photo,product:p};}
function renderFrame(ctx,photo,p,brand,cfg,mod,progress,w,h,state){
 // This is a video composition using the vendored Motion Lab frameAt trajectory.
 ctx.clearRect(0,0,w,h);
 const bg=cfg.background||'#2e1815';
 ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 const gl=ctx.createRadialGradient(w*.63,h*.43,10,w*.56,h*.47,h*.7);
 gl.addColorStop(0,'rgba(255,183,126,.42)');gl.addColorStop(1,'rgba(255,183,126,0)');
 ctx.fillStyle=gl;ctx.fillRect(0,0,w,h);
 const config=mod.normalize({mode:cfg.mode,collection:'objects',format:'full',size:200,depth:.6,tilt:18,count:6,speed:cfg.speed});
 const p0=(progress*cfg.speed/1.1)%1;
 const fr=mod.frameAt(p0,0,config,w*.75,h*.57);
 const floatY=fr.y*.42,moveX=fr.x*.26,depthScale=Math.max(.6,Math.min(1.14,1+fr.z/3200));
 const maxW=w*.76,maxH=h*.53,scale=Math.min(maxW/photo.width,maxH/photo.height)*depthScale;
 const iw=photo.width*scale,ih=photo.height*scale;
 ctx.save();ctx.globalAlpha=Math.max(.5,fr.opacity);
 ctx.translate(w*.5+moveX,h*.44+floatY);
 ctx.rotate(fr.rotateZ*Math.PI/180*.24);
 ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=25;ctx.shadowOffsetY=22;
 ctx.drawImage(photo,-iw/2,-ih/2,iw,ih);ctx.restore();
 ctx.fillStyle='#fff1df';ctx.textAlign='center';
 ctx.font='bold '+Math.round(w*.048)+'px Georgia,serif';ctx.fillText(brand.name||'Café',w/2,h*.085,w*.86);
 ctx.fillStyle='#e7ba8d';ctx.font='bold '+Math.round(w*.020)+'px Arial';ctx.fillText('CRAFTED TO BE SAVORED',w/2,h*.80,w*.86);
 const title=String(p.name||'Your drink');ctx.fillStyle='#fff8ec';ctx.font='bold '+Math.round(w*.06)+'px Georgia,serif';
 // Wrap long titles without allowing them to run off the output frame.
 const words=title.split(/\s+/),lines=[];let row='';
 for(const word of words){const combined=(row?row+' ':'')+word;if(ctx.measureText(combined).width>w*.8&&row){lines.push(row);row=word;}else row=combined;}if(row)lines.push(row);
 lines.slice(0,3).forEach((line,i)=>ctx.fillText(line,w/2,h*.855+i*h*.046,w*.87));
 const price=p.sizes?.[0]?.price;
 if(price!==undefined&&price!==null&&String(price)!==''){ctx.font='bold '+Math.round(w*.036)+'px Arial';ctx.fillText('$'+Number(price).toFixed(2),w/2,h*.96,w*.88);}
}
async function downloadVideo(state,cfg,core){
 if(typeof MediaRecorder==='undefined'||!HTMLCanvasElement.prototype.captureStream)throw Error('Video recording is unsupported in this browser. Try Chrome desktop or download a GIF.');
 const fmt=core.recordingFormat(t=>MediaRecorder.isTypeSupported(t));
 if(!fmt)throw Error('This browser does not support native video recording. Download a GIF instead.');
 const {photo,product}=await assets(state,cfg,core);
 const mod=engine||await motionModule();const canvas=document.createElement('canvas');canvas.width=720;canvas.height=1280;
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
 const mod=engine||await motionModule();
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
window.SeiyunShowcase={mount,destroy,toggle,update,downloadVideo,downloadGif,removeWhiteBackground};
})();
