/* Smoke test of full pinned native editors and their exact-origin owner data bridge. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('fs'),http=require('http'),path=require('path');
const root=path.resolve(__dirname,'../studio');
const img='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGM83urOgA0wYRUdtBIAP0kBo91cRVwAAAAASUVORK5CYII=';
const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.wasm':'application/wasm','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.glb':'model/gltf-binary'};
const harness=['<!doctype html><html><head><meta charset="utf-8"></head><body><header id="status">Starting…</header>',
 '<iframe id="native" style="width:100%;height:90vh"></iframe><script>',
 'const mode=new URLSearchParams(location.search).get("mode")||"menu",nonce="test-"+mode;',
 'const frame=document.querySelector("iframe");let sent=false;',
 'frame.src="/native/"+mode+"/index.html?seiyun_nonce="+nonce+"&seiyun_owner=11111111-1111-4111-8111-111111111111";',
 'const photo='+JSON.stringify(img)+';',
 'const prods=Array.from({length:26},(_,i)=>({id:"p"+i,name:"Seiyun Coffee "+i,ingredients:"cinnamon, milk, cardamom",enabled:true,category:"Coffee",photos:[photo],primary:0,sizes:[{name:"12 oz",price:7+i/10}]}));',
 'window.addEventListener("message",evt=>{if(evt.origin!==location.origin||evt.source!==frame.contentWindow||evt.data.nonce!==nonce)return;',
 'const msg=evt.data;if(msg.type==="SEIYUN_NATIVE_READY"&&!sent){sent=true;frame.contentWindow.postMessage({type:"SEIYUN_NATIVE_INIT",nonce,catalog:mode==="menu"?{brand:{name:"Seiyun Yemeni Coffee",tagline:"Yemeni Coffee"},products:prods,currency:"USD",templateId:"food-menu-cafe-nord"}:{brand:{name:"Seiyun Yemeni Coffee",accent:"#9b5837"},product:prods[0],photoUrl:photo,aspect:"portrait"}},location.origin);}',
 'if(msg.type==="SEIYUN_NATIVE_LOADED")document.querySelector("#status").textContent="LOADED";',
 'if(msg.type==="SEIYUN_NATIVE_ERROR")document.querySelector("#status").textContent="ERROR "+msg.error;',
 'if(msg.type==="SEIYUN_NATIVE_SAVE")document.querySelector("#status").dataset.saved=msg.snapshot?"menu":"motion";',
 '});</script></body></html>'].join('\n');
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(pathname==='/native-harness'){res.writeHead(200,{'content-type':'text/html'});res.end(harness);return;}
 const filepath=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!filepath.startsWith(root+path.sep)){res.writeHead(403);res.end('forbidden');return;}
 fs.readFile(filepath,(err,data)=>{
  if(err){res.writeHead(404);res.end('not found');return;}
  res.writeHead(200,{'content-type':type[path.extname(filepath)]||'application/octet-stream','access-control-allow-origin':'*'});res.end(data);
 });
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const shots=path.resolve(__dirname,'../artifacts');fs.mkdirSync(shots,{recursive:true});
 for(const mode of ['menu','motion']){
  const context=await browser.newContext({viewport:{width:1366,height:820}});
  const page=await context.newPage();const errors=[];
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
  }
  if(mode==='motion')assert(/Library|Presets|Templates/i.test(fullText),'Native motion editor includes a real browsable library');
  await page.screenshot({path:path.join(shots,'native-'+mode+'-desktop.png'),fullPage:true});
  assert(!errors.some(s=>/Cannot read properties of undefined|Hydration failed|Uncaught TypeError/i.test(s)),mode+' critical JS errors: '+errors.slice(0,3));
  await context.close();
 }
 await browser.close();server.close();
 console.log('NATIVE_REAL_EDITORS_BROWSER_PASSED: owner catalog and full native motion library loaded');
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
