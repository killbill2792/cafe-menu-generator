/* Source-template font fidelity: only public font names; never send owner catalog data. */
(function(root,make){const api=make();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.SeiyunTemplateFonts=api})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const allowed=new Set([
 'Abril Fatface','Alfa Slab One','Anton','Archivo','Archivo Black','Bowlby One',
 'Bricolage Grotesque','Caprasimo','Caveat','Cormorant Garamond','Courier Prime',
 'DM Mono','DM Sans','DM Serif Display','Figtree','Fraunces','Gloock',
 'Gochi Hand','IBM Plex Mono','Inter','Josefin Sans','Jost','Lora',
 'Noto Sans JP','Pixelify Sans','Playfair Display','Reenie Beanie',
 'Space Grotesk','Space Mono'
]);
function collectFamilies(docs){
 const names=new Set();
 for(const doc of Array.isArray(docs)?docs:[]){
  for(const pg of doc?.pages||[]){
   for(const el of pg?.elements||[]){
    if(el.type==='text'&&allowed.has(el.fontFamily))names.add(el.fontFamily);
   }
  }
 }
 return [...names].sort();
}
function fontsHref(families){
 const chosen=[...new Set((families||[]).filter(x=>allowed.has(x)))].sort();
 const params=new URLSearchParams();
 for(const family of chosen)params.append('family',family);
 params.append('display','swap');
 return 'https://fonts.googleapis.com/css2?'+params.toString();
}
function loadFonts(doc,templates){
 if(!doc?.createElement||!doc.head||!templates?.length)return false;
 const newFamilies=collectFamilies(templates);
 if(!newFamilies.length)return false;
 const links=[...(doc.querySelectorAll?.('link[data-seiyun-fonts]')||[])];
 const existing=links[0];
 const prior=existing?.dataset?.families?.split('|')||[];
 const all=[...new Set([...prior,...newFamilies])].filter(x=>allowed.has(x)).sort();
 const href=fontsHref(all);
 if(existing&&existing.href===href)return false;
 const link=existing||doc.createElement('link');
 link.rel='stylesheet';link.href=href;
 if(link.dataset)link.dataset.families=all.join('|');
 else{link.dataset={families:all.join('|')};}
 if(!existing){link.setAttribute?.('data-seiyun-fonts','');doc.head.appendChild(link);}
 return true;
}
return {collectFamilies,fontsHref,loadFonts};
});
