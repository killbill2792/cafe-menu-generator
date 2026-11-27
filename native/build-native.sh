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
PY
  npm ci --no-audit --no-fund
  npm --workspace @opentempl/editor run build
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
PY

  # Official upstream static export omits the server-only ffmpeg handler.
  rm -rf app/api
  npm ci --no-audit --no-fund
  STATIC_EXPORT=1 PAGES_BASE_PATH=/native/motion NEXT_PUBLIC_EXPERIMENTS=0 MOTION_STUDIO_DEPLOYMENT_MODE=hosted npm run build
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
