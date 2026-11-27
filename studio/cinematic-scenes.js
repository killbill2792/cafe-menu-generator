
(function(root,make){
 const api=make();
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 root.SeiyunCinematicScenes=api;
})(typeof window!=="undefined"?window:globalThis,function(){
"use strict";
const registry=Object.freeze([
 {id:"cinematic-reveal",name:"Cinematic Reveal",description:"Dramatic golden reveal"},
 {id:"ingredient-motion",name:"Ingredient Motion",description:"Drifting flavor notes and light"},
 {id:"product-spotlight",name:"Product Spotlight",description:"Sculptural studio spotlight"},
 {id:"fresh-energy",name:"Fresh Energy",description:"Bright waves and sparks"},
 {id:"warm-cafe",name:"Warm Café",description:"Soft steam and warm bokeh"}
]);
const cues=[
 {name:"saffron",keys:["saffron"],background:"#442219",accent:"#efb468",scene:"ingredient-motion"},
 {name:"matcha",keys:["matcha","green tea"],background:"#213b2e",accent:"#b1d877",scene:"fresh-energy"},
 {name:"strawberry",keys:["strawberry","hibiscus","berry"],background:"#5c293d",accent:"#ff8fa5",scene:"fresh-energy"},
 {name:"citrus",keys:["lemon","lime","orange","yuzu"],background:"#4d3521",accent:"#ffcf7a",scene:"fresh-energy"},
 {name:"cardamom",keys:["cardamom"],background:"#38291c",accent:"#f2ca91",scene:"warm-cafe"},
 {name:"cinnamon",keys:["cinnamon"],background:"#40251c",accent:"#f2ad7a",scene:"warm-cafe"},
 {name:"pistachio",keys:["pistachio"],background:"#303e2b",accent:"#d0e5ad",scene:"fresh-energy"},
 {name:"chocolate",keys:["chocolate","cocoa","mocha"],background:"#2c1c20",accent:"#e9bc91",scene:"cinematic-reveal"},
 {name:"coffee",keys:["coffee","espresso","latte"],background:"#31221c",accent:"#f0bc87",scene:"cinematic-reveal"},
 {name:"vanilla",keys:["vanilla"],background:"#403528",accent:"#f4dfb3",scene:"product-spotlight"},
 {name:"mango",keys:["mango","coconut"],background:"#533522",accent:"#ffca69",scene:"fresh-energy"}
];
const safe=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const hex=(v,f)=>/^#[0-9a-f]{6}$/i.test(String(v||""))?String(v):f;
const clamp=(v,min,max,defaultValue)=>{const n=Number(v);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):defaultValue};
function normalizeLayer(v={},defaults={x:50,y:50,scale:1,fontSize:48}){
 return {x:clamp(v.x,0,100,defaults.x),y:clamp(v.y,0,100,defaults.y),
 scale:clamp(v.scale,.4,2.6,defaults.scale),fontSize:clamp(v.fontSize,18,150,defaults.fontSize)};
}
function photoUrl(p){
 const a=Array.isArray(p?.photos)?p.photos:[],raw=a[Number(p?.showcasePrimary??p?.primary??0)]||a[0];
 try{const u=new URL(raw);return ["http:","https:","blob:"].includes(u.protocol)||u.protocol==="data:"&&/^data:image\/(png|jpeg|webp|avif);/i.test(raw)?u.href:""}catch{return ""};
}
function resolve(p,brand={},opts={}){
 const description=String([p?.name,p?.ingredients,p?.description,p?.category].join(" ")).toLowerCase();
 const matched=cues.filter(x=>x.keys.some(k=>description.includes(k))),major=matched[0]||cues[8];
 const scene=registry.find(x=>x.id===opts.sceneId)||registry.find(x=>x.id===major.scene)||registry[0];
 return {id:scene.id,name:scene.name,description:scene.description,
 palette:{background:hex(opts.background,major.background),accent:hex(opts.accent,major.accent)},
 ingredients:matched.slice(0,3).map(x=>({label:x.name,accent:x.accent})),
 duration:clamp(opts.duration,3,15,7),speed:clamp(opts.speed,.3,2.5,1),
 layers:{hero:normalizeLayer(opts.layerOverrides?.hero,{x:50,y:46,scale:1,fontSize:64}),
 title:normalizeLayer(opts.layerOverrides?.title,{x:50,y:83,scale:1,fontSize:53})}};
}
function frameAt(progress,id,speed=1){
 const t=(((Number(progress)||0)*clamp(speed,.3,2.5,1))%1+1)%1;
 const phase=Math.sin(t*2*Math.PI),rise=1-Math.pow(1-Math.min(1,t*3),3);
 const base={heroScale:.86+.13*rise,heroY:12*(1-rise),lightX:50+22*phase,glow:.5+.35*rise,ringRotation:50*t,particles:.8,headlineOpacity:rise};
 if(id==="ingredient-motion")return {...base,heroScale:.94+.06*rise,heroY:5*(1-rise)+phase*1.4,ringRotation:360*t,particles:1};
 if(id==="product-spotlight")return {...base,heroScale:.96+.045*rise,heroY:3*(1-rise),lightX:20+60*t,particles:.25};
 if(id==="fresh-energy")return {...base,heroScale:.93+.1*rise,heroY:6*(1-rise)+phase*1.2,lightX:50+27*phase,particles:1};
 if(id==="warm-cafe")return {...base,heroScale:.96+.05*rise,heroY:3*(1-rise)+phase*.7,lightX:47+13*phase,particles:.6};
 return base;
}
function render(p,brand={},opts={}){
 const c=resolve(p,brand,opts),image=photoUrl(p),h=c.layers.hero,t=c.layers.title;
 return '<div class="cs-cinematic-scene" data-scene="'+c.id+'" style="--cs-scene-bg:'+c.palette.background+';--cs-scene-accent:'+c.palette.accent+'">'+
  '<div class="cs-cinematic-background" data-environment-layer="gradient"></div>'+
  '<div class="cs-cinematic-beam" data-environment-layer="spotlight"></div>'+
  '<div class="cs-cinematic-ring" data-environment-layer="halo"></div>'+
  '<div class="cs-cinematic-particles" data-environment-layer="particles">'+Array.from({length:16},(_,i)=>'<i style="--j:'+i+'"></i>').join("")+'</div>'+
  '<div class="cs-scene-ingredients" data-environment-layer="ingredients">'+c.ingredients.map((x,i)=>'<span class="cs-scene-ingredient cs-ing-'+i+'">'+safe(x.label)+'</span>').join("")+'</div>'+
  '<div class="cs-hero-product" data-scene-layer="hero" style="--cs-layer-x:'+h.x+'%;--cs-layer-y:'+h.y+'%;--cs-layer-scale:'+h.scale+'">'+
  (image?'<img class="cs-hero-img" src="'+safe(image)+'" alt="'+safe(p?.name||'Drink')+'" crossorigin="anonymous" loading="eager">':'<div class="cs-no-hero">Upload a drink photo</div>')+'</div>'+
  '<div class="cs-cinematic-brand">'+safe(brand.name||"Your Café")+'</div>'+
  '<div class="cs-cinematic-copy" data-scene-layer="title" style="--cs-layer-x:'+t.x+'%;--cs-layer-y:'+t.y+'%;--cs-title-scale:'+t.scale+';--cs-title-size:'+t.fontSize+'px">'+
  '<small>CRAFTED TO BE SAVORED</small><h2 data-cs-edit="showcase.title">'+safe(p?.name||"Choose a drink")+'</h2>'+
  '<p>'+safe(p?.ingredients||p?.description||"")+'</p><strong>'+safe(p?.sizes?.[0]?.price!==undefined?"$"+Number(p.sizes[0].price).toFixed(2):"")+'</strong></div></div>';
}
function drawFrame(ctx,img,p,brand,opts,progress,w,h){
 const c=resolve(p,brand,opts),f=frameAt(progress,c.id,c.speed),acc=c.palette.accent;
 ctx.clearRect(0,0,w,h);ctx.fillStyle=c.palette.background;ctx.fillRect(0,0,w,h);
 const g=ctx.createRadialGradient(w*f.lightX/100,h*.44,1,w*f.lightX/100,h*.44,h*.68);
 g.addColorStop(0,acc+"90");g.addColorStop(1,acc+"00");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 ctx.save();ctx.translate(w/2,h*.46);ctx.rotate(f.ringRotation*Math.PI/180);ctx.lineWidth=w*.003;ctx.strokeStyle=acc+"50";
 for(let k=.28;k<=.46;k+=.09){ctx.beginPath();ctx.ellipse(0,0,w*k,h*k*.63,0,0,2*Math.PI);ctx.stroke()}ctx.restore();
 for(let i=0;i<19;i++){const ph=progress*Math.PI*2+i*2.399,
  px=w*(.12+.76*((i*37%97)/97)),py=h*(.18+.56*((i*53%89)/89))+Math.sin(ph)*h*.013;
  ctx.fillStyle=acc+Math.round(65+100*Math.abs(Math.sin(ph))).toString(16).padStart(2,"0");
  ctx.beginPath();ctx.arc(px,py,w*(.002+(i%4)*.0012),0,2*Math.PI);ctx.fill();}
 ctx.textAlign="center";ctx.fillStyle="#fff8ec";ctx.font="bold "+Math.round(w*.052)+"px Georgia,serif";
 ctx.fillText(String(brand.name||"Your Café"),w/2,h*.085,w*.86);
 if(img?.width){
  const lay=c.layers.hero,k=Math.min(w*.76/img.width,h*.54/img.height)*lay.scale*f.heroScale;
  ctx.save();ctx.translate(w*lay.x/100,h*lay.y/100+h*f.heroY/100);
  ctx.shadowColor="rgba(0,0,0,.45)";ctx.shadowBlur=32;ctx.shadowOffsetY=20;
  ctx.drawImage(img,-img.width*k/2,-img.height*k/2,img.width*k,img.height*k);ctx.restore();
 }
 const lay=c.layers.title;
 ctx.fillStyle=acc;ctx.font="bold "+Math.round(w*.022*lay.scale)+"px Arial";
 ctx.fillText("CRAFTED TO BE SAVORED",w*lay.x/100,h*(lay.y-8)/100,w*.86);
 ctx.fillStyle="#fff9ec";ctx.font="bold "+Math.round(w*lay.fontSize/1080*lay.scale)+"px Georgia,serif";
 let rows=[],line="";
 for(const word of String(p?.name||"Your drink").split(/\s+/)){
  const test=(line?line+" ":"")+word;
  if(ctx.measureText(test).width>w*.86&&line){rows.push(line);line=word}else line=test;
 }if(line)rows.push(line);
 rows.slice(0,2).forEach((v,i)=>ctx.fillText(v,w*lay.x/100,h*(lay.y+i*4)/100,w*.86));
 ctx.fillStyle="#eddbc9";ctx.font=Math.round(w*.023)+"px Arial";
 ctx.fillText(String(p?.ingredients||"").slice(0,85),w*lay.x/100,h*(lay.y+7)/100,w*.83);
 if(p?.sizes?.[0]?.price!==undefined){ctx.fillStyle="#fff";ctx.font="bold "+Math.round(w*.038)+"px Arial";
 ctx.fillText("$"+Number(p.sizes[0].price).toFixed(2),w*lay.x/100,h*(lay.y+12)/100,w*.86)}
}
return {registry,resolve,normalizeLayer,frameAt,render,drawFrame,photoUrl};
});
