/* Real-browser end-to-end checks for the two owner-facing Creative Studio features. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const root=path.resolve(__dirname,'../studio');
fs.mkdirSync(path.resolve(__dirname,'../artifacts'),{recursive:true});
const type={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.json':'application/json'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const full=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!full.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 fs.readFile(full,(err,body)=>{if(err){res.writeHead(404);res.end('missing');return;}res.writeHead(200,{'content-type':type[path.extname(full)]||'text/plain'});res.end(body)});
});
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==';
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url='http://127.0.0.1:'+server.address().port+'/';
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1365,height:900},acceptDownloads:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/cloud.js',route=>route.fulfill({contentType:'application/javascript',body:'window.SEIYUN_CONFIG={};window.seiyunCloud=null;'}));
 await page.route('**/cloud-bridge.js',route=>route.fulfill({contentType:'application/javascript',body:''}));
 await page.route(/^https:\/\//,route=>{
   const url=route.request().url();
   if(url.includes('html2canvas@1.4.1/dist/html2canvas.min.js'))
     return route.fulfill({contentType:'application/javascript',body:fs.readFileSync(path.resolve(__dirname,'../node_modules/html2canvas/dist/html2canvas.min.js'))});
   if(url.includes('jszip@3.10.1/dist/jszip.min.js'))
     return route.fulfill({contentType:'application/javascript',body:fs.readFileSync(path.resolve(__dirname,'../node_modules/jszip/dist/jszip.min.js'))});
   return route.abort();
 });
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>{draft=starter();render();});
 assert.equal(await page.locator('.cs-tab').count(),2,'exactly two top-level features');
 // Full native editor replacement: the old grid/Moveable assertions below are
 // valid only for legacy public artifacts. The new owner shell has its own
 // native-app integration test in native/test-native.browser.js (both real apps).
 if(await page.evaluate(()=>!!window.SeiyunNativeEditors)){
  assert.equal(await page.locator('.cs-native-heading').count(),1,'native menu editor is the main owner view');
  assert.equal(await page.locator('#nativeEditorFrame').count(),1,'a real full-sized native editor mount exists');
  assert.equal(await page.locator('.cs-art-page').count(),0,'the broken custom HTML artboard is absent');
  await page.screenshot({path:'artifacts/native-menu-shell.png',fullPage:true});
  await page.locator('[data-cs-tab="showcase"]').click();
  assert.equal(await page.locator('.cs-native-product-picker').count(),1,'explicit product/photo chooser is shown');
  assert.equal(await page.locator('.cs-native-empty').count(),1,'no potentially wrong photo is auto-used');
  await page.evaluate(src=>{draft.products[0].photos=[src];draft.products[0].primary=0;draft.showcaseArtwork={...draft.showcaseArtwork,productId:draft.products[0].id};render();},png);
  assert.equal(await page.locator('[data-native-photo]').count(),1,'uploaded photo can be inspected');
  await page.locator('[data-native-photo="0"]').click();
  assert.equal(await page.locator('#nativeEditorFrame').count(),1,'native motion app is available after explicit photo approval');
  assert.equal(await page.evaluate(()=>draft.nativeArtworks.approvedPhotos[draft.products[0].id].index),0,'approved photo is linked to the selected product ID');
  await page.screenshot({path:'artifacts/native-motion-shell.png',fullPage:true});
  assert.equal(errors.length,0,'no uncaught browser errors in the native shell');
  console.log('NATIVE_OWNER_SHELL_BROWSER_PASSED: two native editors, explicit photo consent, no old artboard');
  await browser.close();server.close();
  return;
 }
 assert.equal(await page.locator('.cs-design').count(),0,'template gallery hidden until chosen');
 await page.screenshot({path:'artifacts/menu-generator-desktop.png',fullPage:true});
 assert(await page.locator('.cs-art-page .mg-item').count()>0,'menu artboard visible immediately');
 assert.equal(await page.locator('.cs-tab').allInnerTexts().then(s=>s.join(',')),'▦ Menu Generator,▶ Product Showcase');
 const first=page.locator('.mg-brand-name').first();await first.dblclick();await page.keyboard.press('Control+A');await page.keyboard.insertText('Seiyun Studio Cafe');await page.locator('.cs-intro h1').click();
 assert.equal(await page.evaluate(()=>draft.branding.name),'Seiyun Studio Cafe','inline brand edit reaches canonical draft');
 await page.evaluate(src=>{draft.products[0].photos=[src];draft.products[0].primary=0;render();},png);
 await page.locator('[data-cs-photo="ref-01"]').first().click();
 await page.locator('[data-cs-zoom="zoom"]').evaluate(el=>{el.value='165';el.dispatchEvent(new Event('input',{bubbles:true}));});
 assert.match(await page.locator('[data-menu-product="ref-01"] img').first().getAttribute('style'),/scale\(1\.65\)/,'real photo is zoomed without changing its box');
 await page.locator('[data-cs-action="designs"]').click();
 assert.equal(await page.locator('.cs-design').count(),31,'gallery displays 31 genuinely different layouts, not duplicate palette cards');
 assert.equal(await page.locator('[data-cs-variant]').count(),24,'all 24 legacy color treatments remain available as swatches');
 await page.screenshot({path:'artifacts/real-menu-design-gallery.png',fullPage:true});
 await page.locator('#csDesignSearch').fill('canvix');
 assert.equal(await page.locator('.cs-design-entry:visible').count(),2,'search finds two actual Canvix café menus, not 366 unrelated designs');
 await page.locator('#csDesignSearch').fill('');
 await page.locator('[data-cs-filter="imported"]').click();
 assert.equal(await page.locator('.cs-design-entry:visible').count(),23,'source library filter exposes 21 OpenTempl and two Canvix originals');
 await page.locator('[data-cs-filter="all"]').click();
 await page.locator('[data-cs-design="canvix:cafe-menu"]').click();
 assert.equal(await page.locator('#csArtPage [data-opentempl-source="cafe-menu"]').count(),1,'genuine Canvix café board opens as live menu');
 await page.locator('[data-cs-action="designs"]').first().click();
 assert((await page.locator('[data-cs-design="opentempl:food-menu-checker-diner"] .mg-export-page').count())===1,'imported template thumbnail is real rendered art');
 await page.locator('[data-cs-design="opentempl:food-menu-checker-diner"]').click();
 assert((await page.locator('#csArtPage [data-opentempl-source="food-menu-checker-diner"]').count())===1,'real imported design chosen');
 await page.locator('#csArtPage [data-layout-key="brand"]').first().click();
 await page.locator('.moveable-control-box').first().waitFor({timeout:6000});
 assert.equal(await page.evaluate(()=>typeof Moveable),'function','locally vendored MIT drag engine is available');
 await page.screenshot({path:'artifacts/real-menu-design-editor.png',fullPage:true});
 const brandBox=await page.locator('#csArtPage [data-layout-key="brand"]').first().boundingBox();
 assert(brandBox,'source title visible');
 await page.mouse.move(brandBox.x+brandBox.width/2,brandBox.y+brandBox.height/2);
 await page.mouse.down();
 await page.mouse.move(brandBox.x+brandBox.width/2+32,brandBox.y+brandBox.height/2+24,{steps:5});
 await page.mouse.up();
 const savedBrand=await page.evaluate(()=>draft.menuArtwork.layoutOverrides?.['opentempl:food-menu-checker-diner']?.brand);
 if(!savedBrand)console.log('moveable brand diagnostics',await page.evaluate(()=>({drag:SeiyunLayoutEditor.diagnostics,editable:document.querySelector('#csArtPage [data-layout-key="brand"]')?.isContentEditable,scale:document.querySelector('#csArtPage')?.style.transform})));
 assert(savedBrand&&Number.isFinite(savedBrand.x),'dragging title persists actual source layout coordinates');
 await page.locator('#csArtPage [data-layout-key="brand"]').first().click();
 const beforeSize=await page.evaluate(()=>draft.menuArtwork.layoutOverrides['opentempl:food-menu-checker-diner'].brand.w);
 const resizeHandle=page.locator('.moveable-control-box .moveable-se').first();
 const resizeBox=await resizeHandle.boundingBox();
 assert(resizeBox,'selection exposes a south-east resize corner');
 console.log('resize handle',await resizeHandle.evaluate(el=>{
   const r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
   return {element:el.outerHTML.slice(0,500),hit:hit?.outerHTML.slice(0,500),rect:{x:r.x,y:r.y,w:r.width,h:r.height}};
 }));
 await page.mouse.move(resizeBox.x+resizeBox.width/2,resizeBox.y+resizeBox.height/2);
 await page.mouse.down();
 await page.mouse.move(resizeBox.x+resizeBox.width/2+24,resizeBox.y+resizeBox.height/2+12,{steps:6});
 await page.mouse.up();
 const afterSize=await page.evaluate(()=>draft.menuArtwork.layoutOverrides?.['opentempl:food-menu-checker-diner']?.brand?.w);
 if(!(afterSize>beforeSize))console.log('resize diagnostics',await page.evaluate(()=>({d:SeiyunLayoutEditor.diagnostics,size:draft.menuArtwork.layoutOverrides?.['opentempl:food-menu-checker-diner']?.brand,markup:document.querySelector('#csArtPage [data-layout-key="brand"]')?.outerHTML?.slice(0,500)})));
 assert(afterSize>beforeSize,'pulling the corner enlarges the actual saved brand title');
 await page.locator('[data-cs-action="designs"]').click();
 await page.locator('[data-cs-variant="photo-cards-dark"]').click();
 assert((await page.locator('#csArtPage').innerHTML()).includes('mg-layout-photo-cards'),'template switch updates actual page');
 await page.locator('[data-cs-tab="showcase"]').click();
 await page.locator('.cs-hero-img').waitFor({timeout:12000});
 assert.equal(await page.locator('.cs-hero-img').count(),1,'one featured drink, never a collection of moving copies');
 assert.equal(await page.locator('.scene-card').count(),0,'no old Motion Lab photo gallery');
 assert((await page.locator('[data-environment-layer]').count())>=3,'actual layered environment exists');
 const beamBefore=await page.locator('.cs-cinematic-beam').evaluate(el=>getComputedStyle(el).transform);
 await page.waitForTimeout(550);
 const beamAfter=await page.locator('.cs-cinematic-beam').evaluate(el=>getComputedStyle(el).transform);
 assert.notEqual(beamBefore,beamAfter,'hero light visibly moves under the shared cinematic timeline');
 await page.locator('[data-cs-motion="ingredient-motion"]').click();
 await page.locator('[data-scene="ingredient-motion"]').waitFor({timeout:12000});
 assert.equal(await page.locator('.cs-hero-img').count(),1,'scene change keeps one hero drink');
 await page.locator('.cs-hero-product').click({force:true}); // continuously animated: ordinary Playwright click waits for static layout
 await page.locator('.moveable-control-box').first().waitFor({timeout:6000});
 assert.equal(await page.locator('[data-scene-layer="hero"]').count(),1,'hero layer is independently selectable for drag/resize');
 const heroBox=await page.locator('.cs-hero-product').boundingBox();
 assert(heroBox,'hero artwork visible');
 await page.mouse.move(heroBox.x+heroBox.width/2,heroBox.y+heroBox.height/2);
 await page.mouse.down();await page.mouse.move(heroBox.x+heroBox.width/2+40,heroBox.y+heroBox.height/2-20,{steps:5});await page.mouse.up();
 const heroPlacement=await page.evaluate(()=>draft.showcaseArtwork.layerOverrides?.hero);
 assert(heroPlacement&&heroPlacement.x!==50,'moving the featured drink persists a design-only hero position');
 await page.screenshot({path:'artifacts/product-showcase-desktop.png',fullPage:true});
 // GIF export uses the real vendored encoder, not a mocked output.
 const dl=page.waitForEvent('download',{timeout:65000});
 await page.locator('[data-cs-action="gif"]').click();
 const download=await dl;
 const data=fs.readFileSync(await download.path());
 assert.equal(data.subarray(0,6).toString(),'GIF89a','download is a valid GIF');
 assert(data.byteLength>2048,'GIF contains frames and image data');
 let videoBytes=0,videoType='';
 const supports=await page.evaluate(()=>typeof MediaRecorder==='function'&&!!HTMLCanvasElement.prototype.captureStream&&!!SeiyunCreativeCore.recordingFormat(mime=>MediaRecorder.isTypeSupported(mime)));
 if(supports){
   const videoDownload=page.waitForEvent('download',{timeout:45000});
   await page.locator('[data-cs-action="video"]').click();
   const v=await videoDownload;
   const bytes=fs.readFileSync(await v.path());
   videoBytes=bytes.length;videoType=v.suggestedFilename();
   assert(bytes.length>1000,'video contains actual encoded frames');
   assert(/\.(mp4|webm)$/.test(videoType),'native video extension is accurate');
 }
 
 // Verify that plain white product-photo backgrounds disappear automatically
 // in the actual DOM preview, without uploading or mutating the original image.
 const whitePhoto=await page.evaluate(()=>{
   const c=document.createElement('canvas');c.width=120;c.height=180;const ctx=c.getContext('2d');
   ctx.fillStyle='#ffffff';ctx.fillRect(0,0,120,180);
   ctx.fillStyle='#bf814b';ctx.fillRect(30,38,60,113);
   ctx.fillStyle='#ead4af';ctx.fillRect(30,38,60,30);
   return c.toDataURL('image/png');
 });
 await page.evaluate(src=>{draft.products[0].photos=[src];draft.products[0].primary=0;draft.products[0].showcasePrimary=0;render();},whitePhoto);
 await page.locator('.cs-hero-img').waitFor({timeout:12000});
 await page.waitForFunction(original=>{const img=document.querySelector('.cs-hero-img');return img?.complete&&img.src!==original;},whitePhoto,{timeout:12000});
 const cornerAlpha=await page.evaluate(()=>{
  const img=document.querySelector('.cs-hero-img'),c=document.createElement('canvas');c.width=120;c.height=180;
  const ctx=c.getContext('2d');ctx.drawImage(img,0,0,120,180);return ctx.getImageData(0,0,1,1).data[3];
 });
 assert.equal(cornerAlpha,0,'auto cutout removes the photo white rectangle in the visible live preview');
 await page.screenshot({path:'artifacts/cinematic-auto-cutout.png',fullPage:true});
 console.log(JSON.stringify({passed:['two features','direct brand edit','real photo zoom','31 distinct layouts and 47 looks','template switch','single cinematic hero','animated environment','scene selection','GIF download',...(supports?['native video export']:[])],gifBytes:data.byteLength,videoBytes,videoType,pageErrors:errors}));
 // The original image/PDF features must still work with an imported native menu.
 await page.locator('[data-cs-tab="menu"]').click();
 await page.evaluate(src=>{
   draft.products=draft.products.slice(0,2);
   draft.products[0].photos=[src];draft.products[0].primary=0;
   draft.menuArtwork.templateId='opentempl:food-menu-checker-diner';draft.menuArtwork.format='a4';
   render();
 },png);
 const rasterDownload=page.waitForEvent('download',{timeout:90000});
 await page.locator('[data-cs-action="png"]').click();
 const raster=await rasterDownload, rasterData=fs.readFileSync(await raster.path());
 assert(rasterData.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'real html2canvas export contains PNG bytes');
 const width=rasterData.readUInt32BE(16),height=rasterData.readUInt32BE(20);
 assert(width>=794&&height>=1123,'PNG is rendered at full print resolution');
 console.log(JSON.stringify({rasterBytes:rasterData.length,rasterWidth:width,rasterHeight:height}));
 const popupWait=page.waitForEvent('popup',{timeout:12000});
 await page.locator('[data-cs-action="pdf"]').click();
 const popup=await popupWait;
 await popup.waitForLoadState('domcontentloaded');
 assert.equal(await popup.locator('[data-opentempl-source]').count(),1,'PDF/Print popup preserves imported template');
 assert.equal(await popup.locator('[data-menu-product]').count(),2,'PDF/Print popup uses owner product data');
 const pdfBytes=await popup.pdf({printBackground:true,preferCSSPageSize:true});
 assert(pdfBytes.subarray(0,4).toString()==='%PDF','print document is an actual readable PDF, not only a popup');
 assert(pdfBytes.length>5000,'PDF contains rendered source menu objects');
 await popup.close();
 // A complete multi-page menu must download every page in the same source style.
 await page.evaluate(()=>{
  draft.products=starter().products;
  draft.menuArtwork={...draft.menuArtwork,templateId:'opentempl:food-menu-cafe-nord',format:'a4'};
  render();
 });
 const full=await page.evaluate(()=>SeiyunMenuGallery.renderPages(draft,SeiyunMenuGallery.getSettings(draft)));
 assert(full.pageCount>1,'full owner catalog spans multiple native menu pages');
 assert(full.pages.every(x=>x.includes('ot-source-page')),'all full-menu pages retain selected source design');
 const fullZip=page.waitForEvent('download',{timeout:90000});
 await page.locator('[data-cs-action="png"]').click();
 const zipDownload=await fullZip,zipRaw=fs.readFileSync(await zipDownload.path());
 assert(zipRaw.subarray(0,4).equals(Buffer.from([80,75,3,4])),'multi-page raster export downloads a ZIP');
 const archive=await require('jszip').loadAsync(zipRaw);
 const allPngs=Object.keys(archive.files).filter(x=>x.endsWith('.png'));
 assert.equal(allPngs.length,full.pageCount,'raster ZIP contains every native menu page');
 for(const item of allPngs){const bytes=await archive.files[item].async('nodebuffer');assert(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));}
 await page.locator('[data-cs-action="next"]').click();
 await page.screenshot({path:'artifacts/native-menu-overflow-page.png',fullPage:true});
 assert(await page.locator('#csArtPage .ot-source-page').count()===1,'second page remains an authentic chosen template');
 assert.deepEqual(errors,[],'no uncaught browser exceptions');
 const mobile=await browser.newPage({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 await mobile.route('**/cloud.js',route=>route.fulfill({contentType:'application/javascript',body:'window.SEIYUN_CONFIG={};window.seiyunCloud=null;'}));
 await mobile.route('**/cloud-bridge.js',route=>route.fulfill({contentType:'application/javascript',body:''}));
 await mobile.route(/^https:\/\//,route=>route.abort());
 await mobile.goto(url,{waitUntil:'domcontentloaded'});
 await mobile.evaluate(()=>{draft=starter();render();});
 const overflow=await mobile.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 await mobile.screenshot({path:'artifacts/menu-generator-mobile.png',fullPage:true});
 assert(overflow<=5,'mobile interface should not horizontally overflow: '+overflow);
 console.log('Mobile horizontal overflow:',overflow);
 await mobile.locator('[data-cs-action="designs"]').first().click();
 await mobile.locator('[data-cs-design="opentempl:food-menu-checker-diner"]').click();
 const title=mobile.locator('#csArtPage [data-layout-key="brand"]').first();
 await title.tap();
 const handle=mobile.locator('.moveable-control-box .moveable-se').first();
 await handle.scrollIntoViewIfNeeded();
 const beforeMobile=await title.evaluate(el=>Number.parseFloat(el.style.width));
 const hb=await handle.boundingBox();
 assert(hb&&hb.width>0,'touch resize corner visible on a 390px display');
 const touch=await mobile.context().newCDPSession(mobile);
 const tx=hb.x+hb.width/2,ty=hb.y+hb.height/2;
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:tx,y:ty,id:0}]});
 for(let step=1;step<=6;step++)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:tx+step*2,y:ty+step*1,id:0}]});
 await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const mobileBrand=await mobile.evaluate(()=>draft.menuArtwork.layoutOverrides?.['opentempl:food-menu-checker-diner']?.brand);
 assert(mobileBrand&&mobileBrand.w>beforeMobile,'real touch corner gesture resizes the exported title');
 assert(mobileBrand.x+mobileBrand.w<=816&&mobileBrand.y+mobileBrand.h<=1056,'touch sizing cannot push artwork outside page');
 await browser.close();await new Promise(resolve=>server.close(resolve));
})().catch(e=>{console.error(e);server.close();setTimeout(()=>process.exit(1),2000);});
