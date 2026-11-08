/* Seiyun public mobile menu, owner QR signs and print-to-PDF tools.
   No paid services; QR creation runs in the owner's browser. */
'use strict';
(() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const appBase = () => location.origin + location.pathname;
  const owner = () => window.seiyunCloud?.ownerId || null;
  const publicMenuUrl = id => `${appBase()}?catalog=1&owner=${encodeURIComponent(id)}`;
  function googleReviewLink(value) {
    if (!value || !String(value).trim()) return '';
    try {
      const url = new URL(String(value).trim());
      const host = url.hostname.toLowerCase();
      if (url.protocol !== 'https:' || !(
        host === 'g.page' || host === 'maps.app.goo.gl' || host === 'goo.gl' ||
        host === 'google.com' || host.endsWith('.google.com') || host.endsWith('.google.co.uk')
      )) return '';
      return url.href;
    } catch { return ''; }
  }
  function qrData(text, size=480) {
    if (!window.QRCode) throw new Error('QR code library is still loading. Please reload the page while connected to the internet.');
    const el=document.createElement('div');
    el.style.cssText='position:fixed;top:-9999px;left:-9999px;';
    document.body.append(el);
    try {
      new QRCode(el,{text,width:size,height:size,colorDark:'#24201e',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});
      const canvas=el.querySelector('canvas');
      if (canvas && canvas.width) return canvas.toDataURL('image/png');
      const img=el.querySelector('img');
      if (img?.src?.startsWith('data:')) return img.src;
      throw new Error('Could not generate the QR code.');
    } finally { el.remove(); }
  }
  function downloadQR(url,filename) {
    const data=qrData(url,640);
    const a=document.createElement('a');
    a.href=data;a.download=filename;a.style.display='none';document.body.append(a);a.click();a.remove();
  }
  function liveMenuUrl() {
    const id=owner();
    return id ? publicMenuUrl(id) : '';
  }
  function qrBox(label,url,kind) {
    const valid=Boolean(url);
    return `<section class="extras-qr-tile"><h3>${esc(label)}</h3>${valid
      ? `<div class="extras-qr-image" data-qr-visual="${kind}" role="img" aria-label="QR code for ${esc(label)}"></div><p class="extras-qr-link">${esc(url)}</p><button class="button warm" type="button" data-extra-action="qr-${kind}">Download QR PNG</button>`
      : `<p class="extras-qr-empty">${kind==='menu'?'Sign in to generate the public menu link.':'Paste the official Google review request link to create this QR code.'}</p>`}</section>`;
  }
  function drawQRs(root=document) {
    const data={menu:liveMenuUrl(),google:googleReviewLink(draft?.reviewUrl || '')};
    for(const kind of ['menu','google']) {
      const area=root.querySelector(`[data-qr-visual="${kind}"]`);
      if(!area || !data[kind])continue;
      try { area.innerHTML=''; new QRCode(area,{text:data[kind],width:174,height:174,colorDark:'#2d211c',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M}); }
      catch { area.textContent='QR preview unavailable. Try reloading.'; }
    }
  }
  function toolsPanel() {
    const url=liveMenuUrl(), review=googleReviewLink(draft?.reviewUrl);
    const area=document.createElement('section');area.className='panel extras-panel';area.innerHTML=`
      <div class="panel-head"><div><h2>Menu PDF & QR codes</h2><p>Print your complete catalog or give customers a QR code to scan.</p></div></div>
      <div class="extras-actions"><button class="button primary" type="button" data-extra-action="print-draft">Print draft / Save as PDF</button>
        <button class="button warm" type="button" data-extra-action="print-published" ${published?'':'disabled'}>Print published menu</button>
        <button class="button" type="button" data-extra-action="print-signs">Print QR signs</button></div>
      <div class="extras-url-input"><label for="reviewLinkInput">Google review request link</label>
        <input id="reviewLinkInput" type="url" placeholder="https://g.page/r/.../review" value="${esc(draft?.reviewUrl||'')}" autocomplete="off">
        <p>Get your official link from Google Business Profile → Read reviews → Get more reviews. Only Google-hosted HTTPS links are accepted.</p>
        <div id="extrasReviewValidation" aria-live="polite">${draft?.reviewUrl&&!review?'Enter a valid Google review link.':''}</div>
      </div>
      <div class="extras-qr-grid">
        ${qrBox('Scan the full menu',url,'menu')}
        ${qrBox('Review us on Google',review,'google')}
      </div>
      <p class="extras-note">Menu QR scans open the <strong>published</strong> mobile menu. A draft does not appear to customers until Publish. QR codes aren't added to the TV layouts.</p>`;
    return area;
  }
  function addPanel(targetSelector) {
    const container=document.querySelector(targetSelector);
    if(container && !container.querySelector('.extras-panel')) {container.append(toolsPanel());drawQRs(container);}
  }
  const originalScreens=renderScreens;
  renderScreens=function(...args){originalScreens(...args);addPanel('.workspace .content');};
  const originalPublished=renderPublishedPage;
  renderPublishedPage=function(...args){originalPublished(...args);addPanel('.workspace .content');};
  document.addEventListener('change',ev=>{
    if(ev.target.id!=='reviewLinkInput')return;
    const raw=String(ev.target.value||'').trim();
    if(raw && !googleReviewLink(raw)){
      const target=document.getElementById('extrasReviewValidation');if(target)target.textContent='Use a valid HTTPS Google Business Profile review link.';
      return;
    }
    draft.reviewUrl=raw;
    saveSoon();
    const panel=document.querySelector('.extras-panel');
    if(panel){panel.replaceWith(toolsPanel());drawQRs(document);}
    if(typeof toasts==='function')toasts(raw?'Google review link saved to your private draft.':'Google review link cleared.');
  });
  document.addEventListener('click',ev=>{
    const el=ev.target.closest('[data-extra-action]');if(!el)return;
    const action=el.dataset.extraAction;
    try {
      switch(action) {
        case 'qr-menu': if(!liveMenuUrl())throw Error('Sign in first.'); downloadQR(liveMenuUrl(),'seiyun-menu-qr.png');break;
        case 'qr-google': if(!googleReviewLink(draft?.reviewUrl))throw Error('Please enter the Google review link first.'); downloadQR(googleReviewLink(draft.reviewUrl),'seiyun-google-reviews-qr.png');break;
        case 'print-draft': printMenu(draft,'draft');break;
        case 'print-published': if(!published)throw Error('Publish your menu before printing the published version.'); printMenu(published,'published');break;
        case 'print-signs': printSigns();break;
      }
    }catch(err){if(typeof toasts==='function')toasts(err.message,true);else alert(err.message);}
  });
  function priceText(product,state){
    const cur=String(state.currency||'USD');
    const fmt=v=>{const n=Number(v);if(!Number.isFinite(n))return String(v); try{return new Intl.NumberFormat('en-US',{style:'currency',currency:cur,maximumFractionDigits:2}).format(n);}catch{return '$'+n.toFixed(2);}};
    return (product.sizes||[]).filter(v=>v.name&&String(v.price).trim()!=='').map(v=>`${v.name}: ${fmt(v.price)}`).join('  ·  ');
  }
  function groupedProducts(state){
    const groups=new Map();
    for(const p of state.products||[])if(p.enabled){const cat=p.category||'Other drinks';if(!groups.has(cat))groups.set(cat,[]);groups.get(cat).push(p);}
    return groups;
  }
  function productFigure(p){const url=primaryPhoto(p);return url?`<img src="${esc(url)}" alt="${esc(p.name)}" loading="lazy">`:`<span aria-hidden="true" class="empty-drink">☕</span>`;}
  function printableContent(state) {
    let body='';
    for(const [cat,items] of groupedProducts(state)){
      body+=`<h2>${esc(cat)}</h2><div class="print-grid">`;
      body+=items.map(p=>`<article class="print-item"><div class="print-picture">${productFigure(p)}</div><div class="print-copy"><strong>${esc(p.name)}</strong><span>${esc(p.ingredients||p.description||'')}</span><b>${esc(priceText(p,state))}</b></div></article>`).join('');
      body+='</div>';
    }
    return body;
  }
  function printPage(title,body){
    const popup=window.open('','_blank');
    if(!popup)throw Error('Pop-ups are blocked. Allow pop-ups for this website to print or save as PDF.');
    const styles=`<style>@page{size:A4;margin:12mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;background:#fff;color:#30231e;margin:0}h1{font-family:Georgia,serif;font-size:28pt;margin:0}header{padding:0 0 8mm;border-bottom:2px solid #432820;margin-bottom:6mm}header p{margin:2mm 0 0;letter-spacing:3px;font-size:9pt}h2{font-size:13pt;color:#63372c;margin:8mm 0 3mm;break-after:avoid}.print-grid{display:grid;grid-template-columns:1fr 1fr;gap:3mm 5mm}.print-item{min-height:33mm;height:auto;display:flex;border:1px solid #e3ddd5;border-radius:3mm;overflow:hidden;break-inside:avoid;page-break-inside:avoid}.print-picture{width:34%;background:#f7f2ed;display:flex;align-items:center;justify-content:center}.print-picture img{max-width:96%;height:32mm;object-fit:contain}.print-copy{flex:1;padding:3mm 2mm;display:flex;flex-direction:column;justify-content:center;gap:1mm;overflow:hidden}.print-copy strong{font-weight:800;font-size:10pt;line-height:1.2}.print-copy span{font-size:8pt;line-height:1.25;color:#675349;overflow-wrap:anywhere}.print-copy b{font-size:8.5pt;color:#603d2d}.empty-drink{font-size:20pt;color:#b9a99d}.qr-footer{display:flex;gap:7mm;justify-content:center;margin-top:9mm;break-inside:avoid}.qr-sign{display:flex;align-items:center;gap:4mm;padding:3mm 5mm;border:1px solid #ddcdc0;border-radius:3mm}.qr-sign img{width:26mm;height:26mm}.qr-sign strong{display:block;font-size:10pt}.qr-sign span{font-size:7pt;color:#777}.sign-board{display:flex;flex-wrap:wrap;justify-content:center;gap:13mm;margin:18mm auto}.large-sign{width:80mm;text-align:center;padding:9mm;border:1px solid #decbb7;border-radius:4mm}.large-sign img{width:58mm;height:58mm}.large-sign h2{margin:5mm 0 2mm}.large-sign p{font-size:9pt;overflow-wrap:anywhere}@media screen{body{max-width:210mm;margin:12mm auto;padding:0 8mm;box-shadow:0 0 15px #0002}}@media print{.no-print{display:none!important}}</style>`;
    popup.document.open();popup.document.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title>${styles}</head><body><header><h1>seiyun</h1><p>YEMENI COFFEE</p></header>${body}<p class="no-print" style="text-align:center;color:#5e4a3f">In the print dialog choose <b>Save as PDF</b> to download or select your printer.</p></body></html>`);popup.document.close();
    popup.focus();
    const images=[...popup.document.images];
    Promise.all(images.map(im=>im.complete?Promise.resolve():new Promise(resolve=>{im.onload=resolve;im.onerror=resolve;}))).then(()=>{setTimeout(()=>{try{popup.focus();popup.print()}catch{}},300)});
  }
  function codeBlock(url,label){if(!url)return '';let image='';try{image=qrData(url,460);}catch{}
    return image?`<div class="qr-sign"><img src="${image}" alt="QR code for ${esc(label)}"><div><strong>${esc(label)}</strong><span>Scan with your phone</span></div></div>`:'';
  }
  function printMenu(state,kind){
    if(!state?.products?.some(x=>x.enabled))throw Error('No active menu products to print.');
    const menuUrl=liveMenuUrl(),google=googleReviewLink(state.reviewUrl||'');
    const qr=`<footer class="qr-footer">${codeBlock(menuUrl,'View menu online')}${codeBlock(google,'Review us on Google')}</footer>`;
    printPage(`Seiyun Full Menu (${kind})`,printableContent(state)+qr);
  }
  function printSigns(){
    const menu=liveMenuUrl(),review=googleReviewLink(draft?.reviewUrl);
    if(!menu&&!review)throw Error('No QR links available.');
    const signs=[[menu,'Explore our menu'],[review,'Leave us a Google review']].filter(x=>x[0]).map(([url,label])=>{
      const img=qrData(url,580);
      return `<section class="large-sign"><h2>${esc(label)}</h2><img src="${img}" alt="QR code"><p>SEIYUN YEMENI COFFEE</p></section>`;
    }).join('');
    printPage('Seiyun QR Signs',`<div class="sign-board">${signs}</div>`);
  }
  function mobileHTML(state){
    const groups=groupedProducts(state);
    if(!groups.size)return `<main class="customer-menu"><h1>seiyun</h1><p>Menu coming soon.</p></main>`;
    let sections='';
    for(const [cat,items] of groups){sections+=`<section class="customer-category"><h2>${esc(cat)}</h2><div class="customer-product-list">${items.map(p=>`<article class="customer-item"><div class="customer-image">${productFigure(p)}</div><div class="customer-info"><h3>${esc(p.name)}</h3><p>${esc(p.ingredients||p.description||'')}</p><div>${esc(priceText(p,state))}</div></div></article>`).join('')}</div></section>`;}
    const review=googleReviewLink(state.reviewUrl||'');
    return `<main class="customer-menu"><header class="customer-head"><h1>seiyun</h1><p>YEMENI COFFEE</p><span>OUR MENU</span></header>${sections}${review?`<footer class="customer-footer"><a href="${esc(review)}" target="_blank" rel="noopener noreferrer">Share your experience on Google</a></footer>`:''}</main>`;
  }
  return window.seiyunExtras={publicMenuUrl,renderPublicCatalog:state=>{document.querySelector('#app').innerHTML=state?mobileHTML(state):'<main class="customer-menu"><header class="customer-head"><h1>seiyun</h1><p>YEMENI COFFEE</p></header><p class="customer-unpublished">The menu is not published yet.</p></main>';},qrData};
})();