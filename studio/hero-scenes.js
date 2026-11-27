/* Deterministic cinematic hero compositions. Same pure drawing path powers preview and MP4/GIF/still.
   All imagery is the owner's own photo; no paid AI/API and no stock image dependencies. */
(function(root){
'use strict';
const MODES=[
{id:'cinematic',name:'Cinematic Reveal',short:'Golden rays · dramatic light'},
{id:'ingredients',name:'Ingredient Motion',short:'Saffron · matcha · spices'},
{id:'spotlight',name:'Product Spotlight',short:'Refined studio highlights'},
{id:'iced',name:'Fresh & Iced',short:'Cooling droplets · sparkle'},
{id:'warm',name:'Warm Café',short:'Steam · gentle ambience'},
{id:'minimal',name:'Modern Minimal',short:'Clean typography · soft waves'}
];
const DEFAULT_LAYERS={hero:{x:.5,y:.475,scale:1},brand:{x:.5,y:.065,scale:1},title:{x:.5,y:.82,scale:1},price:{x:.5,y:.935,scale:1}};
const clamp=(v,lo,hi,d)=>{let x=Number(v);return Number.isFinite(x)?Math.max(lo,Math.min(hi,x)):d};
function layers(cfg={}){
 const r={};for(const [k,def] of Object.entries(DEFAULT_LAYERS)){
 const src=cfg?.layers?.[k]||{};
 r[k]={x:clamp(src.x,.06,.94,def.x),y:clamp(src.y,.04,.97,def.y),scale:clamp(src.scale,.42,2.6,def.scale)};
 }return r;
}
function mood(product={}){
 const s=String((product.name||'')+' '+(product.ingredients||'')).toLowerCase();
 if(/matcha|pistachio|mint/.test(s))return 'matcha';
 if(/saffron|cardamom|cinnamon|baklava/.test(s))return 'saffron';
 if(/strawberry|raspberry|berry|hibiscus/.test(s))return 'berry';
 if(/lemon|citrus|mango|passionfruit|orange/.test(s))return 'citrus';
 if(/ice|iced|cold brew/.test(s))return 'iced';
 return 'coffee';
}
function palette(product,scene){
 const m=mood(product),pal={
 saffron:{base:'#301812',mid:'#91512d',glow:'#e7a454',light:'#fff0cc',accent:'#ffc27e'},
 matcha:{base:'#172b24',mid:'#315e42',glow:'#9dbb62',light:'#f3ffe9',accent:'#c6ef8b'},
 berry:{base:'#3a1327',mid:'#8c2848',glow:'#ea7899',light:'#ffe8ed',accent:'#ffb0bf'},
 citrus:{base:'#3b2816',mid:'#a66b2c',glow:'#f2c96d',light:'#fffae2',accent:'#fef2a0'},
 iced:{base:'#173c42',mid:'#357b87',glow:'#a5e8e9',light:'#f4ffff',accent:'#d2ffff'},
 coffee:{base:'#241712',mid:'#71442d',glow:'#d0985c',light:'#fff1d9',accent:'#f1c08b'}
 }[m];
 if(scene==='spotlight')return {...pal,base:'#ded3c5',mid:'#fbf3e9',light:'#2f241f',accent:'#7b5740',glow:'#bd8b59'};
 if(scene==='minimal')return {...pal,base:'#eeeae0',mid:'#fffdf7',light:'#302b2a',accent:'#5d7563',glow:'#adca9f'};
 if(scene==='iced'&&m==='coffee')return {...pal,base:'#204751',mid:'#337c8d',glow:'#a0efff',light:'#f5ffff',accent:'#b8f4ff'};
 return pal;
}
function gradient(ctx,x,y,r,color){
 const g=ctx.createRadialGradient(x,y,0,x,y,r);
 g.addColorStop(0,color);g.addColorStop(1,'transparent');return g;
}
function circle(ctx,x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
function random(n){const v=Math.sin(n*78.233+3.44)*43758.5453;return v-Math.floor(v);}
function background(ctx,w,h,t,theme,scene,speed){
 ctx.fillStyle=theme.base;ctx.fillRect(0,0,w,h);
 const g=ctx.createLinearGradient(0,0,w*(.8+.18*Math.sin(t*.3)),h);
 g.addColorStop(0,theme.base);g.addColorStop(.55,theme.mid);g.addColorStop(1,theme.base);
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 const motion=t*Math.max(.25,speed);
 ctx.globalCompositeOperation='screen';
 ctx.fillStyle=gradient(ctx,w*(.52+.09*Math.sin(motion*.5)),h*(.34+.06*Math.cos(motion*.33)),w*.75,theme.glow+'8c');
 ctx.fillRect(0,0,w,h);
 ctx.globalCompositeOperation='source-over';
 if(scene==='cinematic'){
  ctx.save();ctx.translate(w*.51,h*.30);ctx.rotate(-.4+Math.sin(motion*.22)*.21);
  for(let i=0;i<9;i++){const angle=(-.82+i*.21),length=h*.76;
   ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,length,angle,angle+.07);ctx.closePath();
   ctx.fillStyle='rgba(255,226,170,'+(i%3===0?.09:.038)+')';ctx.fill();}
  ctx.restore();
 }else if(scene==='spotlight'){
  const x=w*(.2+.65*((Math.sin(motion*.38)+1)/2));
  ctx.fillStyle=gradient(ctx,x,h*.44,w*.75,'rgba(255,255,255,.55)');ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=theme.accent+'55';ctx.lineWidth=w*.002;
  for(let i=1;i<=3;i++){ctx.beginPath();ctx.ellipse(w*.5,h*.52,w*(.3+i*.1),h*(.17+i*.085),0,0,2*Math.PI);ctx.stroke();}
 }else if(scene==='iced'){
  for(let i=0;i<12;i++){let px=w*random(i+12),py=h*((random(i+90)+motion*.019*(1+i%3))%1);circle(ctx,px,py,(3+random(i+50)*7)*w/720,'rgba(245,255,255,.20)');}
  ctx.strokeStyle=theme.accent+'7a';ctx.lineWidth=w*.009;
  for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(w*(.1+i*.16),h*(.42+.1*Math.sin(motion*.43+i)),w*.07,h*.025,Math.sin(motion*.2),0,2*Math.PI);ctx.stroke();}
 }else if(scene==='warm'){
  for(let i=0;i<7;i++){
   const x=w*(.18+i*.11),base=h*(.70+(i%3)*.05);
   ctx.strokeStyle='rgba(255,230,195,'+(.08+.03*Math.sin(motion+i))+')';ctx.lineWidth=w*.008;ctx.beginPath();ctx.moveTo(x,base);
   ctx.bezierCurveTo(x+w*.06*Math.sin(motion+i),base-h*.15,x-w*.04,base-h*.23,x+w*.035*Math.cos(motion*.5+i),base-h*.32);ctx.stroke();
  }
 }else if(scene==='minimal'){
  ctx.strokeStyle=theme.accent+'44';ctx.lineWidth=w*.008;
  for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-w*.2,h*(.32+i*.14));ctx.bezierCurveTo(w*.16,h*(.27+i*.14)+Math.sin(motion*.5+i)*h*.035,w*.75,h*(.44+i*.14),w*1.1,h*(.32+i*.14));ctx.stroke();}
 }
 const vignette=ctx.createRadialGradient(w*.5,h*.48,w*.12,w*.5,h*.48,w*.87);
 vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,scene==='minimal'||scene==='spotlight'?'rgba(75,55,40,.13)':'rgba(0,0,0,.52)');
 ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
}
function ingredientColor(m,theme){return m==='matcha'?'#c6e18c':m==='berry'?'#ffc0d0':m==='iced'?'#e9ffff':theme.accent;}
function ingredientEffects(ctx,w,h,t,theme,product,scene){
 const motion=t*.46,m=mood(product);
 const count=scene==='ingredients'?48:scene==='warm'?16:scene==='cinematic'?26:scene==='iced'?30:8;
 for(let i=0;i<count;i++){
  const r=random(i+21),baseX=random(i+57),baseY=random(i+88),orbit=scene==='ingredients'?.20:.06;
  const x=w*(baseX+.05*Math.sin(motion*(.5+r)+i)*orbit/.2),y=h*((baseY+1-(motion*.02*(r+.25))%1)%1);
  const opacity=(.12+.65*random(i+77))*(scene==='ingredients'?1:.52);
  ctx.save();ctx.globalAlpha=opacity;
  const c=ingredientColor(m,theme);
  if(m==='saffron'&&scene==='ingredients'){
   ctx.strokeStyle=i%2===0?'#f3b44d':'#e58946';ctx.lineWidth=(1.4+random(i+34)*2.7)*w/720;
   ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+w*.014,y-h*.012,x-w*.022,y-h*.035,x+w*.009*Math.sin(t+i),y-h*.050);ctx.stroke();
  }else if(m==='coffee'||m==='saffron'){
   if(i%5===0){ctx.translate(x,y);ctx.rotate(t*.12+i);ctx.fillStyle='#b17a42';ctx.beginPath();ctx.ellipse(0,0,w*.009,h*.006,0,0,2*Math.PI);ctx.fill();ctx.strokeStyle='#d8b182';ctx.beginPath();ctx.moveTo(0,-h*.005);ctx.quadraticCurveTo(w*.003,0,0,h*.005);ctx.stroke();}
   else circle(ctx,x,y,w*(.0018+random(i+12)*.004),c);
  }else if(m==='berry'){
   circle(ctx,x,y,w*(.004+random(i+10)*.011),c);circle(ctx,x-w*.001,y-w*.002,w*.0018,'rgba(255,255,255,.7)');
  }else if(scene==='iced'||m==='iced'){
   ctx.fillStyle=c;ctx.translate(x,y);ctx.rotate(motion*.2+i);ctx.fillRect(-w*.005,-w*.005,w*.01,w*.01);
  }else{circle(ctx,x,y,w*(.001+random(i+66)*.006),c);}
  ctx.restore();
 }
 if(scene==='ingredients'){
  const raw=String(product.ingredients||'').split(/[,·]/).map(x=>x.trim()).filter(Boolean).slice(0,3);
  const labels=raw.length?raw:[m==='matcha'?'Matcha powder':m==='saffron'?'Saffron & cinnamon':'Freshly prepared'];
  ctx.save();ctx.font='700 '+Math.round(w*.018)+'px Arial';ctx.textAlign='center';
  labels.forEach((label,i)=>{const x=w*(i%2?.83:.17),y=h*(.29+i*.18+.008*Math.sin(t*.5+i));
   ctx.fillStyle='rgba(255,255,255,.11)';const ww=Math.min(w*.3,ctx.measureText(label).width+30);ctx.fillRect(x-ww/2,y-14,ww,28);ctx.fillStyle=theme.light;ctx.fillText(label,x,y+3,w*.28);});
  ctx.restore();
 }
}
function wordWrap(ctx,text,maxWidth,maxLines=3){
 const words=String(text||'').split(/\s+/).filter(Boolean),lines=[];let row='';
 for(const w of words){const next=row?row+' '+w:w;if(row&&ctx.measureText(next).width>maxWidth){lines.push(row);row=w;}else row=next;}
 if(row)lines.push(row);return lines.slice(0,maxLines);
}
function draw(ctx,asset,product,brand,cfg,time,opts={}){
 const w=ctx.canvas.width,h=ctx.canvas.height,scene=MODES.some(x=>x.id===cfg.mode)?cfg.mode:'cinematic',theme=palette(product,scene);
 if(cfg.customBackground&&/^#[0-9a-f]{6}$/i.test(String(cfg.background||''))){theme.base=cfg.background;theme.mid=cfg.background;}
 const selectedLayers=layers(cfg);const speed=clamp(cfg.speed,.25,2.5,1);const t=time*speed;
 ctx.save();ctx.clearRect(0,0,w,h);background(ctx,w,h,time,theme,scene,speed);ingredientEffects(ctx,w,h,t,theme,product,scene);
 const boxes={};
 const productLayer=selectedLayers.hero,scale=Math.min(w*.78/(asset?.width||1),h*.60/(asset?.height||1))*productLayer.scale*(1+.022*Math.sin(t*.5));
 const iw=(asset?.width||1)*scale,ih=(asset?.height||1)*scale,px=w*productLayer.x,py=h*productLayer.y+Math.sin(t*.9)*h*.007;
 boxes.hero={x:px-iw/2,y:py-ih/2,w:iw,h:ih};
 if(asset){ctx.save();ctx.shadowColor='rgba(0,0,0,.43)';ctx.shadowBlur=w*.056;ctx.shadowOffsetY=h*.021;
  ctx.drawImage(asset,px-iw/2,py-ih/2,iw,ih);ctx.restore();}
 else{ctx.fillStyle=theme.light;ctx.textAlign='center';ctx.font='700 '+Math.round(w*.04)+'px Georgia';ctx.fillText('Add your product photo',px,py,w*.7);}
 const isDark=scene!=='spotlight'&&scene!=='minimal';
 ctx.textAlign='center';ctx.textBaseline='middle';
 const b=selectedLayers.brand;
 ctx.fillStyle=theme.light;ctx.font='700 '+Math.round(w*.050*b.scale)+'px Georgia,serif';
 const label=String(brand.name||'YOUR CAFÉ');
 ctx.fillText(label,w*b.x,h*b.y,w*.88);
 boxes.brand={x:w*b.x-Math.min(w*.88,ctx.measureText(label).width)/2,y:h*b.y-w*.031*b.scale,w:Math.min(w*.88,ctx.measureText(label).width),h:w*.062*b.scale};
 const l=selectedLayers.title,title=String(cfg.headline||product.name||'Your Drink');
 ctx.font='700 '+Math.round(w*.068*l.scale)+'px Georgia,serif';ctx.fillStyle=theme.light;
 const lines=wordWrap(ctx,title,w*.87,3);const lh=w*.085*l.scale,ty=h*l.y-(lines.length-1)*lh/2;
 lines.forEach((line,i)=>ctx.fillText(line,w*l.x,ty+i*lh,w*.9));
 boxes.title={x:w*l.x-w*.45,y:ty-lh*.55,w:w*.9,h:Math.max(lh,lines.length*lh)};
 const pr=selectedLayers.price,price=product.sizes?.[0]?.price;
 const sym={USD:'$',CAD:'CA$',EUR:'€',GBP:'£',INR:'₹'}[cfg.currency||'USD']||'$';
 const priceText=price===undefined||price===null||!Number.isFinite(Number(price))?'':sym+Number(price).toFixed(2);
 ctx.font='800 '+Math.round(w*.035*pr.scale)+'px Arial,sans-serif';ctx.fillStyle=theme.accent;
 ctx.fillText(priceText,w*pr.x,h*pr.y,w*.80);
 boxes.price={x:w*pr.x-w*.19,y:h*pr.y-w*.028*pr.scale,w:w*.38,h:w*.056*pr.scale};
 if(!opts.export&&opts.selected&&boxes[opts.selected]){
  const box=boxes[opts.selected];ctx.save();ctx.setLineDash([8,6]);ctx.strokeStyle=scene==='minimal'||scene==='spotlight'?'#543422':'#fff3dc';ctx.lineWidth=Math.max(2,w*.003);
  ctx.strokeRect(box.x,box.y,box.w,box.h);ctx.setLineDash([]);
  const hs=w*.017;ctx.fillStyle=theme.accent;ctx.fillRect(box.x+box.w-hs/2,box.y+box.h-hs/2,hs,hs);ctx.restore();
 }
 ctx.restore();
 return boxes;
}
root.SeiyunHeroScenes={MODES,DEFAULT_LAYERS,layers,mood,palette,draw};
})(typeof window!=='undefined'?window:globalThis);
