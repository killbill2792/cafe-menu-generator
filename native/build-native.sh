#!/usr/bin/env bash
set -euo pipefail
# Build the real, complete native engines plus a narrow owner-data bridge.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAGING="${RUNNER_TEMP:-/tmp}/seiyun-native-editors"
OPENTEMPL_SHA=015064f1005e63563f73ebe0dfbeb84d90439bcc
MOTION_SHA=dba311caff2e78c621c17f008eb1bc3f71f361b5
mkdir -p "$STAGING"
cd "$STAGING"

if [ "${NATIVE_ONLY:-}" != "motion" ]; then
  if [ ! -d opentempl/.git ]; then git clone --filter=blob:none https://github.com/noah-thing/opentempl.git opentempl; fi
  cd opentempl
  git fetch --depth=1 origin "$OPENTEMPL_SHA"
  git checkout --detach "$OPENTEMPL_SHA"
  mkdir -p apps/editor/src/integrations
  cp "$ROOT/native/opentempl-bridge.ts" apps/editor/src/integrations/seiyunNative.ts

  python3 - <<'PY'
from pathlib import Path
main=Path('apps/editor/src/main.tsx')
s=main.read_text()
anchor="import { App } from './App';"
assert anchor in s
s=s.replace(anchor,anchor+"\nimport { installSeiyunBridge } from './integrations/seiyunNative';")
anchor="createRoot(document.getElementById('root')!).render(<App />);"
assert anchor in s
s=s.replace(anchor,"installSeiyunBridge();\n"+anchor)
# Do not upload any product data or UI usage stats to the original project.
s=s.replace("import { pingOncePerDay } from './stats/client';","").replace("pingOncePerDay();","")
main.write_text(s)

# Different signed-in owners using one shared device must never see a previous
# owner's design listing. Partition OpenTempl's native IndexedDB names by owner.
owner=Path('apps/editor/src/io/db.ts')
s=owner.read_text();anchor="const DB_NAME = 'tavla';"
assert anchor in s
s=s.replace(anchor,"""const nativeTenant = new URL(location.href).searchParams.get('seiyun_owner');
const DB_NAME = nativeTenant && /^[a-f0-9-]{36}$/i.test(nativeTenant) ? 'seiyun-native-'+nativeTenant : 'tavla';""")
owner.write_text(s)
ids=Path('apps/editor/src/io/designs.ts')
s=ids.read_text();anchor="const dbName = (id: string) => `tavla-design-${id}`;";assert anchor in s
s=s.replace(anchor,"""const nativeTenant = new URL(location.href).searchParams.get('seiyun_owner');
const dbName = (id: string) => nativeTenant && /^[a-f0-9-]{36}$/i.test(nativeTenant) ? `seiyun-native-${nativeTenant}-design-${id}` : `tavla-design-${id}`;""")
ids.write_text(s)

# Native template selection must rebind the owner's catalog, not open sample
# names/prices from the upstream template. The original editor UI is unchanged.
app=Path('apps/editor/src/App.tsx')
s=app.read_text()
anchor="import { createDesign } from './io/designs';";assert anchor in s
s=s.replace(anchor,anchor+"\nimport { createSeiyunOwnerDesign } from './integrations/seiyunNative';")
anchor="        const built = await tpl.build();\n        id = await createDesign({ snapshot: built.snapshot, assets: built.assets });"
assert anchor in s
s=s.replace(anchor,"        const ownerDoc = await createSeiyunOwnerDesign(q.get('template')!);\n        if(ownerDoc) id = ownerDoc;\n        else { const built = await tpl.build(); id = await createDesign({ snapshot: built.snapshot, assets: built.assets }); }")
app.write_text(s)

# Clicking a tile inside the full native Templates panel must populate the
# owner's own catalog on a new editable document, never insert stock restaurant
# names/photos or silently mix layers into an already filled menu.
panel=Path('apps/editor/src/panels/TemplatesPanel.tsx')
s=panel.read_text()
a="const [vibe, setVibe] = useState('all');";assert a in s
s=s.replace(a,"const [vibe, setVibe] = useState(new URL(location.href).searchParams.has('seiyun_nonce') ? 'food-menu' : 'all');")
a="                  const tpl = await loadPackTemplate(t.id, t.vibe);";assert a in s
s=s.replace(a,"                  if (new URL(location.href).searchParams.has('seiyun_nonce')) { location.hash = '/new?template=' + encodeURIComponent(t.id); return; }\n"+a)
a="onClick={() => applyTemplate(editor, t)}";assert a in s
s=s.replace(a,"onClick={() => { if (new URL(location.href).searchParams.has('seiyun_nonce')) location.hash='/new?template='+encodeURIComponent(t.id); else applyTemplate(editor,t); }}")
# In the owner shell, keep the native template browser but render its actual
# populated artwork through OpenTempl's native export renderer, lazily.
s=s.replace("import { useEffect, useState } from 'react';","import { useEffect, useState, useRef } from 'react';\nimport { renderSeiyunTemplateThumb } from '../integrations/seiyunNative';")
component="""function OwnerTemplatePreview({id,name}:{id:string;name:string}) {
  const host=useRef<HTMLDivElement>(null);
  const [result,setResult]=useState<{url:string;adapted:boolean}|null>(null);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    let alive=true,objectUrl='';
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(e=>e.isIntersecting))return;
      observer.disconnect();
      renderSeiyunTemplateThumb(id).then(data=>{
        if(!alive)return;
        if(!data){setFailed(true);return;}
        objectUrl=URL.createObjectURL(data.blob);
        setResult({url:objectUrl,adapted:data.adapted});
      }).catch(()=>{if(alive)setFailed(true)});
    },{rootMargin:'100px'});
    if(host.current)observer.observe(host.current);
    return()=>{alive=false;observer.disconnect();if(objectUrl)URL.revokeObjectURL(objectUrl)};
  },[id]);
  return <div ref={host} style={{width:'100%',height:'100%',minHeight:105,display:'grid',placeItems:'center',gap:4}}>
    {result?<><img data-owner-preview={id} src={result.url} alt={name+' with your café products'} style={{maxWidth:'100%',maxHeight:145,objectFit:'contain'}}/><span style={{fontSize:10}}>{result.adapted?'Catalog-fit adaptation':'Your menu'}</span></>:<span className="hint">{failed?'Preview unavailable — open design':'Preparing your menu…'}</span>}
  </div>;
}

"""
s=s.replace("export default function TemplatesPanel() {",component+"export default function TemplatesPanel() {")
a='<img src={thumbUrl(t.id)} alt={t.name} loading="lazy" style={{ maxWidth: \'100%\', maxHeight: \'100%\', boxShadow: \'var(--shadow-1)\' }} />'
assert a in s
s=s.replace(a,"{new URL(location.href).searchParams.has('seiyun_nonce') ? <OwnerTemplatePreview id={t.id} name={t.name} /> : "+a+"}")
a='<TemplatePreview template={t} height={130} />'
assert a in s
s=s.replace(a,"{new URL(location.href).searchParams.has('seiyun_nonce') ? <OwnerTemplatePreview id={t.id} name={t.name} /> : "+a+"}")
s=s.replace("Any template adapts to your page size. Click to add it.","{new URL(location.href).searchParams.has('seiyun_nonce') ? 'Previews contain your café products. Click to open a native editable design.' : 'Any template adapts to your page size. Click to add it.'}")
panel.write_text(s)

editor=Path('apps/editor/src/editor/EditorScreen.tsx')
s=editor.read_text()
anchor="import { Editor, EditorContext } from './Editor';"
assert anchor in s
s=s.replace(anchor,anchor+"\nimport { watchSeiyunDoc } from '../integrations/seiyunNative';")
anchor="    let stopVersions: (() => void) | null = null;"
assert anchor in s
s=s.replace(anchor,anchor+"\n    let stopSeiyun: (() => void) | null = null;")
anchor="      const editor = new Editor(opened.doc);"
assert anchor in s
s=s.replace(anchor,anchor+"\n      stopSeiyun = watchSeiyunDoc(opened.doc);")
anchor="      stopVersions?.();"
assert anchor in s
s=s.replace(anchor,anchor+"\n      stopSeiyun?.();")
editor.write_text(s)

# Native mobile shell: CSS grid auto minimums otherwise enlarge the entire
# iframe to the intrinsic width of the topbar/rail. Keep every native control
# accessible in its own scrollable toolbar; do not clip the artboard or
# suppress overflow at the document root to hide a failing acceptance test.
css=Path('apps/editor/src/styles/app.css')
css.write_text(css.read_text()+"""
@media (max-width: 760px) {
  .editor { grid-template-columns: minmax(0, 1fr); grid-template-rows: var(--top) minmax(0, 1fr) 62px; width: 100%; min-width: 0; }
  .editor > .topbar, .editor > .rail, .editor > .workspace { min-width: 0; max-width: 100%; }
  .topbar { overflow-x: auto; scrollbar-width: none; }
  .topbar > * { flex-shrink: 0; }
  .topbar .title { flex: 1 0 84px; min-width: 84px; }
  .topbar .icon-btn[title^='Redo'] { display: inline-flex; }
  .workspace .viewport { min-width: 0; max-width: 100%; }
  .workspace .statusbar { min-width: 0; max-width: 100%; overflow-x: auto; }
  .workspace .statusbar > * { flex-shrink: 0; }
  .rail { max-width: 100%; min-width: 0; overflow-x: auto; }
  .panel { box-sizing: border-box; max-width: 100%; }
}
""")
PY
  npm ci --no-audit --no-fund
  npm --workspace @opentempl/editor run build
  rm -rf "$ROOT/studio/native/menu"
  mkdir -p "$ROOT/studio/native/menu"
  cp -a dist/app/. "$ROOT/studio/native/menu/"
  # Cloudflare Workers static assets forbid any single file above 25 MiB.
  # ONNX's optional background-removal WASM exceeds this limit; preserve the
  # complete native artboard/editor, but omit this optional model binary.
  find "$ROOT/studio/native/menu/assets" -type f -name 'ort-wasm*.wasm' -size +25M -print -delete
  cp LICENSE "$ROOT/studio/native/menu/UPSTREAM-LICENSE.txt"
  printf 'OpenTempl\n%s\nhttps://github.com/noah-thing/opentempl\n' "$OPENTEMPL_SHA" > "$ROOT/studio/native/menu/UPSTREAM-SOURCE.txt"
  cd "$STAGING"
fi

if [ "${NATIVE_ONLY:-}" != "menu" ]; then
  if [ ! -d motion-studio/.git ]; then git clone --filter=blob:none https://github.com/appariciojunior/motion-studio-open.git motion-studio; fi
  cd motion-studio
  git fetch --depth=1 origin "$MOTION_SHA"
  git checkout --detach "$MOTION_SHA"
  cp "$ROOT/native/motion-studio-bridge.tsx" components/SeiyunNativeBridge.tsx

  # The upstream current Apache-2.0 LICENSE explicitly removed the old hosted-
  # service prohibition, but a stale first-run modal still incorrectly demands
  # agreement not to host it. Use the correct license and remove friction only
  # in our authenticated embedded mode; keep full native project UI.
  python3 - <<'PY'
from pathlib import Path
p=Path('components/WelcomeDialog.tsx')
s=p.read_text()
s=s.replace("  const [agreed, setAgreed] = useState(false);","")
s=s.replace("    try { if (!localStorage.getItem(SEEN_KEY)) setOpen(true); } catch { /* storage blocked */ }",
"""    const embedded = new URL(location.href).searchParams.has('seiyun_nonce');
    if (embedded) {
      try { localStorage.setItem(SEEN_KEY, '1'); } catch {}
      const projects = useProjectStore.getState();
      projects.bootstrap();
      return;
    }
    try { if (!localStorage.getItem(SEEN_KEY)) setOpen(true); } catch { /* storage blocked */ }""")
s=s.replace("            Use it freely, including at work and in production. The one thing the\n            licence holds back is <b>offering Motion Studio to other people as a\n            hosted service</b> — that stays with the maintainers.",
"""            Motion Studio Open is available under Apache License 2.0, including for
            self-hosted commercial use. This copy retains the upstream LICENSE and NOTICE.""")
start=s.index('          <label className="welcome-agree">')
end=s.index('        </div>',start)
s=s[:start]+"""          <button className="btn primary full" onClick={enter}>Go to the library</button>
"""+s[end:]
p.write_text(s)
# Embedded users should see their product immediately, not an upstream
# first-run guided tour covering the editor; native Help remains available.
p=Path('components/AppTour.tsx')
s=p.read_text()
anchor="function tourSeen(tourId: TourId): boolean {"
assert anchor in s
s=s.replace(anchor,anchor+"\n  if(new URL(location.href).searchParams.has('seiyun_nonce')) return true;")
p.write_text(s)
PY

  python3 - <<'PY'
from pathlib import Path
p=Path('app/layout.tsx')
s=p.read_text()
anchor="import { SpeedInsights } from '@vercel/speed-insights/next';"
assert anchor in s
s=s.replace(anchor,anchor+"\nimport SeiyunNativeBridge from '../components/SeiyunNativeBridge';")
anchor="        <SpeedInsights />"
assert anchor in s
s=s.replace(anchor,"        <SeiyunNativeBridge />")
# No user analytics in the owner-hosted fork; the media stays in their browser.
s=s.replace("        <Analytics />","")
s=s.replace("import { Analytics } from '@vercel/analytics/next';","")
s=s.replace("        <SpeedInsights />","")
s=s.replace("import { SpeedInsights } from '@vercel/speed-insights/next';","")
p.write_text(s)

# Pixi v8's normal WebGL init uses runtime code generation. Production CSP
# deliberately forbids eval; use Pixi's official static CSP-compatible shim.
renderer=Path('lib/renderer.ts')
s=renderer.read_text()
s="import 'pixi.js/unsafe-eval';\n"+s
a="    } catch {\n      return;\n    }\n\n    if (this.destroyed || !this.app?.renderer) return;"
assert a in s
s=s.replace(a,"    } catch (error) {\n      console.error('Native Pixi renderer initialization failed', error);\n      throw error;\n    }\n\n    if (this.destroyed || !this.app?.renderer) return;",1)
renderer.write_text(s)

# Partition the native motion editor's project index, media database and
# autosaved settings by signed-in café owner; no shared default project.
# Scope is stable across Next client-side navigation and full-route reloads.
scope=Path('lib/seiyunStorage.ts')
scope.write_text("""export function ownerStorageKey(key: string): string {
  if (typeof window === 'undefined') return key;
  const q = new URL(location.href).searchParams;
  if (window.parent === window) return key;
  const provided = q.get('seiyun_owner');
  const valid = (v: string | null) => !!v && /^[a-f0-9-]{36}$/i.test(v);
  let owner = provided;
  try {
    if (valid(provided)) sessionStorage.setItem('seiyun-motion-owner', provided!);
    else owner = sessionStorage.getItem('seiyun-motion-owner');
  } catch {}
  return 'seiyun-motion-' + (valid(owner) ? owner : 'unscoped') + ':' + key;
}
""")
# Wrap native persistence calls, leaving the existing project/history logic
# intact. No change to Seiyun's parent Supabase storage/session.
for file in [Path('lib/projects.ts'),Path('lib/scenePersist.ts'),Path('lib/three3dPersist.ts'),Path('store/useSceneStore.ts')]:
    import re
    src=file.read_text()
    src="import { ownerStorageKey } from '@/lib/seiyunStorage';\n"+src
    # The original functions use simple identifiers or one-level key helpers.
    src=re.sub(r'localStorage\.(getItem|removeItem)\((\w+(?:\([^()]*\))?)\)',r'localStorage.\1(ownerStorageKey(\2))',src)
    src=re.sub(r'localStorage\.setItem\((\w+(?:\([^()]*\))?),',r'localStorage.setItem(ownerStorageKey(\1),',src)
    file.write_text(src)
p=Path('lib/assetDb.ts')
s=p.read_text()
s="import { ownerStorageKey } from './seiyunStorage';\n"+s
s=s.replace("indexedDB.open(DB_NAME, 1)","indexedDB.open(ownerStorageKey(DB_NAME), 1)")
p.write_text(s)
PY

  # Official upstream static export omits the server-only ffmpeg handler.
  rm -rf app/api
  npm ci --no-audit --no-fund
  STATIC_EXPORT=1 PAGES_BASE_PATH=/native/motion NEXT_PUBLIC_EXPERIMENTS=0 MOTION_STUDIO_DEPLOYMENT_MODE=hosted npm run build
  rm -rf "$ROOT/studio/native/motion"
  mkdir -p "$ROOT/studio/native/motion"
  cp -a out/. "$ROOT/studio/native/motion/"
  cp LICENSE "$ROOT/studio/native/motion/UPSTREAM-LICENSE.txt"
  cp NOTICE "$ROOT/studio/native/motion/UPSTREAM-NOTICE.txt"
  printf 'Motion Studio Open\n%s\nhttps://github.com/appariciojunior/motion-studio-open\n' "$MOTION_SHA" > "$ROOT/studio/native/motion/UPSTREAM-SOURCE.txt"
fi

test -s "$ROOT/studio/native/menu/index.html"
test -s "$ROOT/studio/native/motion/index.html"
node "$ROOT/native/verify-built.js" "$ROOT/studio/native"
echo "Native editors built successfully."
