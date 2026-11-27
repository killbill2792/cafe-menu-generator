/* Smoke test of full pinned native editors and their exact-origin owner data bridge. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('fs'),http=require('http'),path=require('path');
const root=path.resolve(__dirname,'../studio');
const img='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGM83urOgA0wYRUdtBIAP0kBo91cRVwAAAAASUVORK5CYII=';
const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.wasm':'application/wasm','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.glb':'model/gltf-binary'};
const harness=['<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><header id="status">Starting…</header>',
 '<iframe id="native" style="width:100%;height:90vh"></iframe><script>',
 'const mode=new URLSearchParams(location.search).get("mode")||"menu",nonce="test-"+mode;',
 'const frame=document.querySelector("iframe");let sent=false;',
 'frame.src="/native/"+mode+"/index.html?seiyun_nonce="+nonce+"&seiyun_owner=11111111-1111-4111-8111-111111111111";',
 'const photo='+JSON.stringify(img)+';',
 'const prods=Array.from({length:26},(_,i)=>({id:"p"+i,name:"Seiyun Coffee "+i,ingredients:"cinnamon, milk, cardamom",enabled:true,category:"Coffee",photos:[photo],primary:0,sizes:[{name:"12 oz",price:7+i/10}]}));',
 'window.addEventListener("message",evt=>{if(evt.origin!==location.origin||evt.source!==frame.contentWindow||evt.data.nonce!==nonce)return;',
 'const msg=evt.data;if(msg.type==="SEIYUN_NATIVE_READY"&&!sent){sent=true;frame.contentWindow.postMessage({type:"SEIYUN_NATIVE_INIT",nonce,catalog:mode==="menu"?{brand:{name:"Seiyun Yemeni Coffee",tagline:"Yemeni Coffee"},products:prods,currency:"USD",templateId:"food-menu-cafe-nord"}:{brand:{name:"Seiyun Yemeni Coffee",accent:"#9b5837"},product:prods[0],photoUrl:photo,aspect:"portrait"}},location.origin);}',
 'if(msg.type==="SEIYUN_NATIVE_LOADED"){document.querySelector("#status").textContent="LOADED";document.querySelector("#status").dataset.layers=String(msg.layers??0);document.querySelector("#status").dataset.assets=String(msg.assets??0);}',
 'if(msg.type==="SEIYUN_NATIVE_ERROR")document.querySelector("#status").textContent="ERROR "+msg.error;',
 'if(msg.type==="SEIYUN_NATIVE_SAVE")document.querySelector("#status").dataset.saved=msg.snapshot?"menu":"motion";',
 '});</script></body></html>'].join('\n');
// Mirror the production Cloudflare _headers matching rules for this integration
// test, including the native-specific override; a permissive test server would
// otherwise miss a broken iframe CSP or inline Next hydration.
const rules=fs.readFileSync(path.join(root,'_headers'),'utf8').split(/\r?\n/);
function securityHeaders(pathname){
 const headers={};let matched=false;
 for(const line of rules){
  if(!line.trim()||line.trim().startsWith('#'))continue;
  if(!/^\s/.test(line)){const pattern=line.trim();matched=pattern.endsWith('*')?pathname.startsWith(pattern.slice(0,-1)):pattern===pathname;continue;}
  if(!matched)continue;
  const v=line.trim();if(v.startsWith('! ')){delete headers[v.slice(2).toLowerCase()];continue;}
  const i=v.indexOf(':');if(i<0)continue;const k=v.slice(0,i).toLowerCase(),value=v.slice(i+1).trim();
  headers[k]=headers[k]?headers[k]+', '+value:value;
 }
 return headers;
}
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(pathname==='/native-harness'){res.writeHead(200,{'content-type':'text/html'});res.end(harness);return;}
 const filepath=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!filepath.startsWith(root+path.sep)){res.writeHead(403);res.end('forbidden');return;}
 fs.readFile(filepath,(err,data)=>{
  if(err){res.writeHead(404);res.end('not found');return;}
  res.writeHead(200,{...securityHeaders(pathname),'content-type':type[path.extname(filepath)]||'application/octet-stream','access-control-allow-origin':'*'});res.end(data);
 });
});
let browserInstance;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});browserInstance=browser;
 const shots=path.resolve(__dirname,'../artifacts');fs.mkdirSync(shots,{recursive:true});
 for(const mode of ['menu','motion']){
  const context=await browser.newContext({viewport:{width:1366,height:820}});
  const page=await context.newPage();page.setDefaultTimeout(12000);const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/native-harness?mode='+mode);
  await page.waitForFunction(()=>document.querySelector('#status').textContent==='LOADED',{timeout:60000});
  await page.waitForTimeout(800);
  const frame=page.frameLocator('#native');
  const fullText=await frame.locator('body').innerText();
  assert(fullText.length>100,mode+' native editor should be a complete app, not a blank shell');
  if(mode==='menu'){
   assert(/Seiyun Yemeni Coffee/.test(fullText),'OpenTempl must include current owner branding');
   assert(/Seiyun Coffee 0/.test(fullText),'OpenTempl must bind real product names');
   const item=frame.locator('svg g[data-id]').filter({hasText:'Seiyun Coffee 0'}).first();
   await item.waitFor({timeout:15000});
   await item.click({force:true});
   await page.keyboard.press('Delete');
   await page.waitForTimeout(180);
   assert.equal(await frame.locator('svg g[data-id]').filter({hasText:'Seiyun Coffee 0'}).count(),0,
     'delete must remove an actual native object, not just move it off the page');
   await page.keyboard.press('Control+z');
   await frame.locator('svg g[data-id]').filter({hasText:'Seiyun Coffee 0'}).first().waitFor({timeout:10000});
   await page.waitForTimeout(1350);
   assert.equal(await page.locator('#status').getAttribute('data-saved'),'menu',
     'native Yjs editor changes must reach the private artwork draft bridge');
  }
  if(mode==='motion'){
   assert(/Library|Presets|Templates/i.test(fullText),'Native motion editor includes a real browsable library');
   const layers=Number(await page.locator('#status').getAttribute('data-layers'));
   const assets=Number(await page.locator('#status').getAttribute('data-assets'));
   assert(layers>=1,'The selected drink must have at least one actual upstream native timeline layer; a blank media library is not acceptable');
   assert(assets>=1,'The owner-approved product photo must be imported as an upstream native media asset');
   assert(!/NaN/.test(fullText),'Native motion controls cannot show NaN after media import');
  }
  await page.screenshot({path:path.join(shots,'native-'+mode+'-desktop.png'),fullPage:true});
  assert(!errors.some(s=>/Cannot read properties of undefined|Hydration failed|Uncaught TypeError/i.test(s)),mode+' critical JS errors: '+errors.slice(0,3));
  await context.close();
 }
 // Mobile layouts use the upstream editors' own touch UI, not our CSS-grid canvas.
 for(const mode of ['menu','motion']){
   const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
   const page=await context.newPage();page.setDefaultTimeout(12000);
   console.log('NATIVE_MOBILE_TEST_START',mode);
   await page.goto(origin+'/native-harness?mode='+mode);
   await page.waitForFunction(()=>document.querySelector('#status').textContent==='LOADED',{timeout:60000});
   const frame=page.frameLocator('#native');
   const overflow=await frame.locator('body').evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
   await page.screenshot({path:path.join(shots,'native-'+mode+'-mobile.png'),fullPage:false});
   if(overflow>=30) console.log('NATIVE_OVERFLOW',await frame.locator('body').evaluate(()=>Array.from(document.querySelectorAll('*')).filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+10&&r.width>50;}).slice(0,20).map(e=>({tag:e.tagName,cls:String(e.className).slice(0,150),width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right}))));
   assert(overflow<30,mode+' native touch viewport should not overflow horizontally: '+overflow);
   if(mode==='menu'){
     const item=frame.locator('svg g[data-id]').filter({hasText:'Seiyun Coffee 0'}).first();
     await item.waitFor({timeout:12000});
     await item.tap({force:true,timeout:8000});
   }
   await page.screenshot({path:path.join(shots,'native-'+mode+'-mobile.png'),fullPage:false});
   await context.close();
 }
 await browser.close();server.close();
 console.log('NATIVE_REAL_EDITORS_BROWSER_PASSED: owner catalog and full native motion library loaded');
})().catch(async e=>{console.error('NATIVE_BROWSER_ACCEPTANCE_FAILURE',e);try{await browserInstance?.close()}catch{}server.close();process.exit(1);});
