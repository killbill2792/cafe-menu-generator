'use strict';
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=process.argv[2]||path.join(__dirname,'../studio/native');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)])}
const a=path.join(root,'menu'),b=path.join(root,'motion');
const html=fs.readFileSync(path.join(a,'index.html'),'utf8');
const motion=fs.readFileSync(path.join(b,'index.html'),'utf8');
const files=walk(root);
const scripts=files.filter(p=>/\.(js|mjs)$/.test(p));
assert(files.length>=10,'native complete build must contain actual application assets');
assert(files.length<20000,'Cloudflare Workers free static file count cap');
assert(/<script|type="module"/.test(html),'OpenTempl native HTML must load compiled scripts');
assert(/_next|next/.test(motion),'Motion Studio Open native HTML must load compiled Next client');
assert(scripts.some(s=>s.includes(path.join('menu','assets'))),'OpenTempl JS chunks missing');
assert(scripts.some(s=>s.includes(path.join('motion','_next'))),'Motion Studio JS chunks missing');
assert(files.some(s=>s.endsWith('/menu/UPSTREAM-LICENSE.txt')),'OpenTempl license missing');
assert(files.some(s=>s.endsWith('/motion/UPSTREAM-LICENSE.txt')),'Motion license missing');
assert(files.some(s=>s.endsWith('/motion/UPSTREAM-NOTICE.txt')),'Apache notice missing');
for(const file of files){const n=fs.statSync(file).size;assert(n<=25*1024*1024,'Cloudflare per-file asset max exceeded: '+file)}
const allScripts=scripts.map(s=>fs.readFileSync(s,'utf8')).join('\n');
for(const t of ['SEIYUN_NATIVE_READY','SEIYUN_NATIVE_SAVE','SEIYUN_NATIVE_INIT'])
 assert(allScripts.includes(t),'Owner data bridge not linked into native compiled app: '+t);
console.log(JSON.stringify({verified:'both full native source applications with compiled bridge',files:files.length,scriptFiles:scripts.length,totalMegabytes:Math.round(files.reduce((s,f)=>s+fs.statSync(f).size,0)/1e6)}));
