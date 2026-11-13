/* Seiyun owner Studio: both portrait screens remain visible while editing.
   Display URLs and public TV layouts are not changed by this module. */
'use strict';
(() => {
  if (typeof renderProducts!=='function'||typeof tvFrame!=='function') return;
  const nativeRenderProducts=renderProducts;
  const nativeRenderProductForm=renderProductForm;
  const nativeRenderMini=renderEditMiniPreview;
  const nativeTvFrame=tvFrame;
  const nativeVisibleProducts=visibleProducts;
  let activeScreen='menu';
  window.seiyunUploadDestination='menu';

  function featuredPhoto(p) {
    if(!p) return '';
    const images=Array.isArray(p.photos)?p.photos:[];
    const index=Number(p.showcasePrimary);
    return p.showcasePrimary!==undefined && p.showcasePrimary!==null &&
      Number.isInteger(index) && images[index] ? images[index] : primaryPhoto(p);
  }

  // The same product library powers both screens, but Screen 2 can use
  // another photo of the SAME drink. Screen 1 stays on p.primary.
  tvFrame=function(state,screen,idx=0,elapsed=0){
    if(screen?.role!=='showcase')return nativeTvFrame(state,screen,idx,elapsed);
    const showcaseState={...state,products:state.products.map(p=>{
      const images=Array.isArray(p.photos)?p.photos:[];
      const index=Number(p.showcasePrimary);
      if(p.showcasePrimary===undefined||p.showcasePrimary===null ||
          !Number.isInteger(index)||!images[index])return p;
      return {...p,primary:index};
    })};
    return nativeTvFrame(showcaseState,screen,idx,elapsed);
  };

  function showcaseScreen(){
    return draft.screens.find(s=>s.role==='showcase')||
      {id:'showcase',label:'Animated product showcase',role:'showcase',orientation:'portrait',rotation:9,category:''};
  }
  function refreshShowcase(){
    const stage=document.querySelector('#visualShowcaseCanvas');
    if(!stage||tab!=='products')return;
    const p=draft.products.find(x=>x.id===selected);
    // Owner can focus a named drink even before its photo is uploaded.
    const state=p?{...draft,products:[p]}:draft;
    stage.innerHTML=tvFrame(state,showcaseScreen(),0);
    const chooser=document.querySelector('#dualShowcaseProduct');
    if(chooser)chooser.value=p?.id||'';
    document.querySelectorAll('[data-dual-screen-button]').forEach(b=>{
      const isActive=b.dataset.dualScreenButton===activeScreen;
      b.classList.toggle('active',isActive);
      b.setAttribute('aria-pressed',String(isActive));
    });
  }
  function showEditorFor(productId,focus){
    const p=draft.products.find(x=>x.id===productId);
    if(!p)return;
    selected=p.id;
    activeScreen=focus||activeScreen;
    renderProductForm();
    updateSelection();
    refreshShowcase();
  }

  renderProducts=function(){
    nativeRenderProducts();
    const side=document.querySelector('.menu-canvas-side');
    const wrap=side?.querySelector('.menu-stage-wrap');
    const toolbar=side?.querySelector('.menu-workbench-toolbar');
    if(!side||!wrap||!toolbar)return;
    toolbar.querySelector('h2').textContent='Both screens, editable together';
    toolbar.querySelector('p').textContent='Both live designs remain visible. Choose any drink on Screen 1 or in the Screen 2 selector, then edit its photos and details.';
    const grid=document.createElement('div');
    grid.className='dual-screen-preview-grid';
    grid.innerHTML=
      '<section class="dual-screen-panel" aria-label="Screen 1 menu preview">'+
        '<div class="dual-screen-panel-head"><div><strong>SCREEN 1</strong><small>Full visual menu</small></div>'+
        '<button type="button" class="button small active" data-dual-screen-button="menu" aria-pressed="true">Edit Screen 1</button></div>'+
        '<div class="dual-screen-slot" id="dualMenuSlot"></div>'+
        '<p class="dual-screen-help">Click any drink on this screen to edit it.</p></section>'+
      '<section class="dual-screen-panel" aria-label="Screen 2 promotional preview">'+
        '<div class="dual-screen-panel-head"><div><strong>SCREEN 2</strong><small>Individual drink ad</small></div>'+
        '<button type="button" class="button small" data-dual-screen-button="showcase" aria-pressed="false">Edit Screen 2</button></div>'+
        '<label class="dual-showcase-picker-label">Choose drink for Screen 2 preview'+
        '<select id="dualShowcaseProduct"><option value="">Show available photographed drinks</option>'+
        draft.products.filter(p=>p.enabled).map(p=>'<option value="'+h(p.id)+'">'+h(p.name||'New drink')+'</option>').join('')+
        '</select></label>'+
        '<div class="dual-screen-slot dual-showcase-slot"><div class="preview-screen menu-editor-stage" id="visualShowcaseCanvas"></div></div>'+
        '<button type="button" class="button small primary dual-upload" data-dual-upload="showcase">Upload photo for Screen 2</button>'+
        '<p class="dual-screen-help">Upload a different shot of the selected drink, or use its Screen 1 photo.</p></section>';
    wrap.replaceWith(grid);
    grid.querySelector('#dualMenuSlot').append(wrap);
    // Screen 2 never replaces or hides Screen 1 or the inspector.
    refreshShowcase();
  };

  renderProductForm=function(){
    nativeRenderProductForm();
    const p=draft.products.find(x=>x.id===selected);
    const area=document.querySelector('#editPanel .editor-photo-row');
    if(!p||!area)return;
    const title=area.querySelector('.editor-photo-actions strong');
    const hint=area.querySelector('.editor-photo-actions p');
    if(title)title.textContent='Screen 1 · menu photo';
    if(hint)hint.textContent='This is the photo shown on the complete menu.';
    const photos=Array.isArray(p.photos)?p.photos:[];
    const selector=document.createElement('section');
    selector.className='dual-photo-editor';
    const current=p.showcasePrimary===undefined||p.showcasePrimary===null?'':String(p.showcasePrimary);
    selector.innerHTML=
      '<div><strong>Screen 2 · advertisement photo</strong><p>Choose another photo of this drink. Leaving it on “Same as Screen 1” is fine.</p></div>'+
      '<label for="dualFeaturePhoto">Screen 2 image</label>'+
      '<select id="dualFeaturePhoto"><option value="">Same as Screen 1</option>'+
      photos.map((url,index)=>'<option value="'+index+'"'+(current===String(index)?' selected':'')+'>Photo '+(index+1)+'</option>').join('')+
      '</select>'+
      '<button type="button" class="button small primary" data-dual-upload="showcase">Upload photo for Screen 2</button>';
    area.insertAdjacentElement('afterend',selector);
  };

  renderEditMiniPreview=function(){
    nativeRenderMini();
    refreshShowcase();
  };

  // Capture only new controls; native editing/upload handlers remain intact.
  document.addEventListener('click',ev=>{
    const upload=ev.target.closest('[data-dual-upload="showcase"]');
    if(upload){
      ev.preventDefault();ev.stopImmediatePropagation();
      if(!selected){
        const first=draft.products.find(p=>p.enabled);
        if(!first){toasts('Add a drink first.',true);return}
        showEditorFor(first.id,'showcase');
      }
      activeScreen='showcase';
      window.seiyunUploadDestination='showcase';
      refreshShowcase();
      document.querySelector('#productImage')?.click();
      return;
    }
    const switcher=ev.target.closest('[data-dual-screen-button]');
    if(switcher){
      ev.preventDefault();ev.stopImmediatePropagation();
      activeScreen=switcher.dataset.dualScreenButton;
      window.seiyunUploadDestination=activeScreen;
      if(activeScreen==='showcase'&&!selected){
        const first=draft.products.find(p=>p.enabled);
        if(first)showEditorFor(first.id,activeScreen);
      }
      refreshShowcase();
      return;
    }
    const regularUpload=ev.target.closest('#editPanel [data-action="add-photos"]');
    if(regularUpload){activeScreen='menu';window.seiyunUploadDestination='menu';refreshShowcase();}
    const menuProduct=ev.target.closest('#visualMenuCanvas .pf-card');
    if(menuProduct){
      activeScreen='menu';
      // Existing click handler changes selected; update Screen 2 afterward.
      queueMicrotask(refreshShowcase);
    }
    const rail=ev.target.closest('#visualShowcaseCanvas [data-showcase-index]');
    if(rail){
      ev.preventDefault();ev.stopImmediatePropagation();
      const products=nativeVisibleProducts(draft,showcaseScreen());
      const p=products[Number(rail.dataset.showcaseIndex)];
      if(p)showEditorFor(p.id,'showcase');
      return;
    }
    if(ev.target.closest('#visualShowcaseCanvas')){
      ev.preventDefault();ev.stopImmediatePropagation();
      const p=draft.products.find(x=>x.id===selected)||
        nativeVisibleProducts(draft,showcaseScreen())[0]||
        draft.products.find(p=>p.enabled);
      if(p)showEditorFor(p.id,'showcase');
    }
  },true);

  document.addEventListener('change',ev=>{
    if(ev.target.id==='dualShowcaseProduct'){
      ev.stopImmediatePropagation();
      if(ev.target.value)showEditorFor(ev.target.value,'showcase');
      else{selected=null;activeScreen='showcase';renderProductForm();renderEditMiniPreview();}
    }
    if(ev.target.id==='dualFeaturePhoto'){
      ev.stopImmediatePropagation();
      const p=draft.products.find(x=>x.id===selected);
      if(!p)return;
      if(ev.target.value==='')delete p.showcasePrimary;
      else{
        const index=Number(ev.target.value);
        if(!Number.isInteger(index)||!p.photos?.[index])return;
        p.showcasePrimary=index;
      }
      saveSoon();
      renderEditMiniPreview();
    }
  },true);
})();
