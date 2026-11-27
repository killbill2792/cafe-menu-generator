/* MIT-compatible local helper: detects only edge-connected near-white backgrounds.
   Produces a preview/export derivative; never mutates or uploads the owner's original image. */
(function(root,factory){
const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.SeiyunPhotoCutout=api;
})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
function mask(image,w,h){
 if(!image||!w||!h||image.length<w*h*4)return {changed:false,removed:0};
 const seen=new Uint8Array(w*h),queue=new Int32Array(w*h);
 const background=p=>{const k=p*4;if(image[k+3]<200)return false;
  const r=image[k],g=image[k+1],b=image[k+2];return r>=237&&g>=237&&b>=237&&Math.max(r,g,b)-Math.min(r,g,b)<=19;};
 let head=0,tail=0;
 const add=p=>{if(!seen[p]&&background(p)){seen[p]=1;queue[tail++]=p;}};
 let edgeCorners=0;for(const p of [0,w-1,(h-1)*w,(h-1)*w+w-1])if(background(p))edgeCorners++;
 // Avoid erasing deliberately light or white product photographs that aren't studio cutouts.
 if(edgeCorners<2)return {changed:false,removed:0};
 for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}
 for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
 while(head<tail){const p=queue[head++],x=p%w,y=Math.floor(p/w);
  if(x>0)add(p-1);if(x<w-1)add(p+1);if(y>0)add(p-w);if(y<h-1)add(p+w);}
 const coverage=tail/(w*h);
 if(coverage<.015||coverage>.92)return {changed:false,removed:tail};
 // Remove background connected to canvas edges; keep closed white shapes (foam / cup label).
 for(let i=0;i<tail;i++)image[queue[i]*4+3]=0;
 // A one-pixel translucent transition removes crunchy halos without blurring the cup.
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
  const p=y*w+x;if(seen[p])continue;
  if(seen[p-1]||seen[p+1]||seen[p-w]||seen[p+w])image[p*4+3]=Math.min(225,image[p*4+3]);
 }
 return {changed:true,removed:tail};
}
function make(image,maxDimension=1400){
 const w0=image.naturalWidth||image.width,h0=image.naturalHeight||image.height;
 if(!w0||!h0||typeof document==='undefined')return {asset:image,changed:false};
 const scale=Math.min(1,Math.max(200,maxDimension)/Math.max(w0,h0));
 const w=Math.max(1,Math.round(w0*scale)),h=Math.max(1,Math.round(h0*scale));
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,w,h);
 try{const pixels=ctx.getImageData(0,0,w,h),result=mask(pixels.data,w,h);
  if(!result.changed)return {asset:image,changed:false};
  ctx.putImageData(pixels,0,0);return {asset:canvas,changed:true};
 }catch(e){return {asset:image,changed:false,reason:'Cannot access pixels: remote image CORS or canvas restrictions'};}
}
return {mask,make};
});
