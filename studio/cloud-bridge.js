/* Hosted owner/TV bridge. Keeps the approved visual editor unchanged.
   Only a publishable Supabase key is present; RLS/RPC enforce authorization. */
'use strict';
(() => {
  const cloud=window.seiyunCloud;
  if(!window.SEIYUN_CONFIG)return;
  const ui=()=>document.querySelector('#app');
  const ownerFromURL=new URLSearchParams(location.search).get('owner');
  const publicMenuMode=new URLSearchParams(location.search).get('catalog')==='1';
  let ownerId=ownerFromURL,saveQueue=Promise.resolve(),pollTimer=null,authBound=false,editorBound=false;
  const oldRenderPublished=renderPublishedPage;
  const oldNav=nav;
  nav=function(){return oldNav().replace('Both displays update from the same product catalog. Drafts are local until you publish. No AI credits required.', 'Your menu drafts are private. Changes reach both TVs only after Publish.').replace('Local-first working version', 'Connected online').replace('</aside>', '<button class="button small" style="margin:12px;color:#fff" data-action="logout-cloud">Sign out</button></aside>');};
  renderPublishedPage=function(){oldRenderPublished();const p=document.querySelector('.published-state p');if(p&&published)p.innerHTML=`${published.products.filter(x=>x.enabled).length} products · ${published.screens.length} displays<br><strong>Published online.</strong> Open each screen URL on the café TV. Both screens refresh automatically after you publish.`;};
  dlink=function(s,mode='draft'){const url=new URL(location.href);url.searchParams.set('screen',s.id);url.searchParams.set('mode',mode);if(ownerId)url.searchParams.set('owner',ownerId);return url.toString();};
  getDB=async function(key){if(key==='draft')return cloud.getDraft();if(key==='published')return cloud.getPublished(ownerId);if(key==='history')return cloud.getHistory();throw Error('Unknown record');};
  setDB=async function(key,value){if(key!=='draft')throw Error('Only a secure Publish action may change the live menu.');return cloud.saveDraft(value);};
  const flush=async()=>{clearTimeout(saveTimer);await saveQueue.catch(()=>{});const next=deep(draft);saveQueue=saveQueue.catch(()=>{}).then(()=>cloud.saveDraft(next));await saveQueue;};
  saveSoon=function(){const status=document.querySelector('#draftStatus');if(status)status.textContent='Saving online…';clearTimeout(saveTimer);saveTimer=setTimeout(async()=>{const snapshot=deep(draft);saveQueue=saveQueue.catch(()=>{}).then(()=>cloud.saveDraft(snapshot));try{await saveQueue;const st=document.querySelector('#draftStatus');if(st)st.textContent='Draft saved online.';}catch(e){toasts('Online save failed: '+e.message,true);}},650);};
  publish=async function(){const issues=errors();if(issues.length){tab='products';selected=draft.products.find(p=>!status(p)&&p.enabled)?.id||selected;render();toasts('Fix before publishing: '+issues.slice(0,2).join('; '),true);return;}
    if(!confirm(`Publish ${draft.products.filter(p=>p.enabled).length} drinks to ${draft.screens.length} live displays? All connected TVs will update.`))return;
    try{await flush();const rev=await cloud.publish();published=await cloud.getPublished(ownerId);history=await cloud.getHistory();tab='published';render();toasts(`Published revision ${rev} online. TVs update shortly.`);}catch(e){toasts('Not published. Current live menu was preserved: '+e.message,true);}
  };
  rollback=async function(){if(!history.length)return;const previous=history[history.length-1];if(!confirm(`Restore published revision ${previous.revision} to every TV?`))return;
    try{await cloud.rollback(previous.revision);published=await cloud.getPublished(ownerId);history=await cloud.getHistory();render();toasts('Published an earlier version as the latest revision.');}catch(e){toasts('Rollback failed: '+e.message,true);}
  };
  addPhotos=async function(files){const product=draft.products.find(x=>x.id===selected);if(!product)return;let added=0;try{for(const file of files){const url=await fileAsImage(file);const blob=await(await fetch(url)).blob();const path=await cloud.upload(new File([blob],'product.webp',{type:'image/webp'}));product.photos.push(path);added++;}
      if(product.photos.length===added)product.primary=0;saveSoon();renderProductForm();renderEditMiniPreview();toasts(`${added} full-sized drink photo(s) stored online.`);
    }catch(e){toasts('Upload did not finish: '+e.message,true);}
  };
  const oldRestore=restore;
  restore=async function(file){if(!file)return;try{const data=JSON.parse(await file.text());if(data.format!=='seiyun-studio-v1'||!Array.isArray(data.draft?.products)||!Array.isArray(data.draft?.screens))throw Error('Not a valid backup');if(!confirm('Restore this backup as a PRIVATE DRAFT? The live menu will not change until you Publish.'))return;draft=data.draft;await flush();selected=null;tab='products';render();toasts('Draft restored online. Review before publishing.');}catch(e){toasts('Restore failed: '+e.message,true);}};
  function loginScreen(message=''){
    ui().innerHTML=`<main class="signin-page"><form id="cloudLoginForm" class="signin-card"><div class="signin-brand">seiyun<small>YEMENI COFFEE · OWNER STUDIO</small></div><h1>Your café menu</h1><p>Click a drink to edit its photo, ingredients and prices. Preview, then Publish to both TVs.</p>${message?`<div class="notice">${h(message)}</div>`:''}<label>Email<input name="email" type="email" autocomplete="username" required></label><label>Password<input name="password" type="password" autocomplete="current-password" minlength="6" required></label><button class="button primary signin-submit" type="submit">Sign in</button><button class="signin-create" type="button" id="createOwnerAccount">Create owner account</button><p class="signin-small">Drafts are private. TV views can only read what you've published.</p></form></main>`;
  }
  function authEvents(){if(authBound)return;authBound=true;
    document.addEventListener('submit',async ev=>{if(ev.target.id!=='cloudLoginForm')return;ev.preventDefault();const form=ev.target;const data=new FormData(form);const b=form.querySelector('button[type=submit]');b.disabled=true;b.textContent='Signing in…';try{await cloud.signIn(String(data.get('email')).trim(),String(data.get('password')));await cloudMain();}catch(e){loginScreen('Sign-in failed: '+e.message);}});
    document.addEventListener('click',async ev=>{if(ev.target.closest?.('[data-action="logout-cloud"]')){try{await cloud.signOut();location.assign(location.pathname)}catch(e){toasts(e.message,true)}return;}
      if(ev.target.id!=='createOwnerAccount')return;const d=new FormData(document.querySelector('#cloudLoginForm'));const email=String(d.get('email')||'').trim(),password=String(d.get('password')||'');if(!email||password.length<6){loginScreen('Enter your email and password (minimum 6 characters) before creating an account.');return;}try{const result=await cloud.signUp(email,password);if(result.needsConfirmation)loginScreen('Check your email and confirm the new account, then sign in.');else await cloudMain();}catch(e){loginScreen('Account creation failed: '+e.message)}});
  }
  renderTVView=async function(){cleanupPreview();const app=ui(),state=screenMode==='draft'?draft:published,screen=state?.screens?.find(x=>x.id===screenQuery);
    if(!state||!screen){app.innerHTML=`<div class="tv-view-mode"><div class="tv-empty"><strong>${screenMode==='draft'?'Private preview unavailable':'Menu not published yet'}</strong><span>Sign in to the owner editor, verify the menu, then Publish.</span></div></div>`;return;}
    let idx=0;
    const refresh=()=>{app.innerHTML=`<div class="tv-view-mode cloud-live-screen"><div class="preview-screen ${screen.orientation==='landscape'?'landscape':''}" id="tvStage">${tvFrame(state,screen,idx)}</div></div>`;const stage=document.querySelector('#tvStage');stage.addEventListener('click',ev=>{const b=ev.target.closest('[data-showcase-index]');if(b){idx=Number(b.dataset.showcaseIndex);stage.innerHTML=tvFrame(state,screen,idx);syncRail(stage);}});syncRail(stage);};
    refresh();clearInterval(displayTimer);
    if(screen.role!=='menu')displayTimer=setInterval(()=>{idx++;const stage=document.querySelector('#tvStage');if(stage){stage.innerHTML=tvFrame(state,screen,idx);syncRail(stage)}},Math.max(5,Math.min(120,Number(screen.rotation)||9))*1000);
  };
  async function cloudMain(){if(!cloud){ui().innerHTML='<main class="signin-page"><div class="signin-card">Online library is unavailable. Check your internet connection and reload.</div></main>';return;}
    try{
      if(publicMenuMode){
        if(!ownerId){ui().textContent='Missing menu link.';return;}
        const refresh=async()=>{
          try{const next=await cloud.getPublished(ownerId);if(next){published=next;try{localStorage.setItem('seiyun:last-good:'+ownerId,JSON.stringify(next));}catch{}}}
          catch(e){if(!published)try{published=JSON.parse(localStorage.getItem('seiyun:last-good:'+ownerId)||'null');}catch{published=null;}}
          window.seiyunExtras.renderPublicCatalog(published);
        };
        await refresh();
        if(!pollTimer)pollTimer=setInterval(refresh,window.SEIYUN_CONFIG.refreshMs||30000);
        return;
      }
      if(screenQuery){if(!ownerId){ui().textContent='No screen owner specified.';return;}
        if(screenMode==='draft'){const u=await cloud.getUser();if(!u||u.id!==ownerId){authEvents();loginScreen('Please sign in as the owner to preview this private draft.');return;}draft=await cloud.getDraft();}
        else {try{published=await cloud.getPublished(ownerId);if(published)try{localStorage.setItem('seiyun:last-good:'+ownerId,JSON.stringify(published));}catch{}}catch(e){try{published=JSON.parse(localStorage.getItem('seiyun:last-good:'+ownerId)||'null')}catch(_){published=null}}}
        await renderTVView();
        if(screenMode==='published'&&!pollTimer)pollTimer=setInterval(async()=>{try{const next=await cloud.getPublished(ownerId);if(next){try{localStorage.setItem('seiyun:last-good:'+ownerId,JSON.stringify(next));}catch{}if(next.revision!==published?.revision){published=next;await renderTVView();}}}catch(e){/* Keep last successfully loaded published menu visible. */}},window.SEIYUN_CONFIG.refreshMs||30000);
        return;}
      authEvents();const u=await cloud.getUser();if(!u){loginScreen();return;}
      ownerId=u.id;draft=await cloud.getDraft();published=await cloud.getPublished(ownerId);history=await cloud.getHistory();if(!draft){draft=starter();await cloud.saveDraft(draft);}if(!Array.isArray(draft.products)||!Array.isArray(draft.screens))throw Error('Online menu data is invalid.');selected=null;
      if(!editorBound){attachEvents();editorBound=true;}render();
    }catch(e){ui().innerHTML=`<main class="signin-page"><div class="signin-card">Could not connect to the menu: ${h(e.message)}<p>Check your connection and reload. The live menu is unchanged.</p><button type="button" class="button" onclick="location.reload()">Retry</button></div></main>`;}
  }
  cloudMain();
})();