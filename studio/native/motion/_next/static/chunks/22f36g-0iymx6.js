(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,70173,e=>{"use strict";var a=e.i(43476),t=e.i(71645),o=e.i(41372);let r=1.16,i=-.0800000000000001,n=Array.from({length:17},(e,a)=>6.25*a);e.s(["default",0,function({spec:e,onChange:s}){let l=(0,t.useRef)(null),u=(0,t.useRef)(null),d=(0,o.easingBezier)(e),c=(0,o.resolveEasing)(e),m=e=>{try{e.currentTarget.setPointerCapture(e.pointerId)}catch{}},f=(0,t.useMemo)(()=>n.flatMap(e=>n.map(t=>(0,a.jsx)("rect",{className:"ez-grid-dot",x:e-.625,y:t-.625,width:1.25,height:1.25},`${e}-${t}`))),[]),h=(d?.[0]??0)*100,p=(1-(d?.[1]??0))*100,x=(d?.[2]??1)*100,v=(1-(d?.[3]??1))*100;return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:"ez-editor",onPointerMove:e=>{null!==u.current&&((e,a,t)=>{let o,n,u,c,m,f,h=(d??[.25,.25,.75,.75]).slice(),[p,x]=(n=Math.min((o=l.current.getBoundingClientRect()).width/132,o.height/132),u=o.left+(o.width-132*n)/2,c=o.top+(o.height-132*n)/2,m=Math.max(0,Math.min(1,(-16+(a-u)/n)/100)),f=Math.max(i,Math.min(r,1-(-20+(t-c)/n)/100)),[Number(m.toFixed(3)),Number(f.toFixed(3))]);0===e?(h[0]=p,h[1]=x):(h[2]=p,h[3]=x),s({id:"custom",bezier:h})})(u.current,e.clientX,e.clientY)},onPointerUp:()=>{u.current=null},onPointerCancel:()=>{u.current=null},onLostPointerCapture:()=>{u.current=null},children:(0,a.jsxs)("svg",{ref:l,className:"ez-svg",viewBox:"-16 -20 132 132",preserveAspectRatio:"xMidYMid meet",children:[(0,a.jsx)("g",{className:"ez-grid",children:f}),(0,a.jsx)("path",{className:"ez-curve",d:function(e,a=48){return(0,o.sampleEasing)(e,a).map(([e,a],t)=>`${0===t?"M":"L"} ${(100*e).toFixed(2)} ${((1-a)*100).toFixed(2)}`).join(" ")}(c)}),d&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("line",{className:"ez-guide",x1:0,y1:100,x2:h,y2:p}),(0,a.jsx)("line",{className:"ez-guide",x1:100,y1:0,x2:x,y2:v}),(0,a.jsx)("circle",{className:"ez-handle",cx:h,cy:p,r:3.1}),(0,a.jsx)("circle",{className:"ez-handle",cx:x,cy:v,r:3.1}),(0,a.jsx)("circle",{className:"ez-grab",cx:h,cy:p,r:7,onPointerDown:e=>{e.stopPropagation(),u.current=0,m(e)}}),(0,a.jsx)("circle",{className:"ez-grab",cx:x,cy:v,r:7,onPointerDown:e=>{e.stopPropagation(),u.current=1,m(e)}})]})]})}),(0,a.jsx)("div",{className:"ez-nums",children:[0,1,2,3].map(e=>(0,a.jsx)("input",{className:"ez-num",type:"number",step:.01,value:d?d[e].toFixed(2):"",placeholder:"—",disabled:!d,onChange:a=>((e,a)=>{let t=Number(a);if(Number.isNaN(t))return;let o=(d??[.25,.25,.75,.75]).slice();o[e]=e%2==0?Math.max(0,Math.min(1,t)):t,s({id:"custom",bezier:o})})(e,a.target.value)},e))})]})}])},32109,e=>{"use strict";var a=e.i(43476),t=e.i(71645);function o({size:e=20,...a}){return{width:e,height:e,viewBox:"0 0 20 20",fill:"none",stroke:"currentColor",strokeWidth:1.5,strokeLinejoin:"miter",strokeLinecap:"butt","aria-hidden":!0,focusable:!1,...a}}function r({size:e=20,...a}){return{width:e,height:e,viewBox:"0 0 20 20",fill:"currentColor",stroke:"none","aria-hidden":!0,focusable:!1,...a}}let i="M3 17V4h5.5l2 2H17v11Z",n="M3 6h14v11H3Z";e.s(["AddIcon",0,function(e){return(0,a.jsx)("svg",{...o(e),children:(0,a.jsx)("path",{d:"M10 3v14M3 10h14"})})},"AdjustIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M7 3.5h2v3H7ZM12 8.5h2v3h-2ZM5.5 13.5h2v3h-2Z"}),(0,a.jsx)("path",{d:"M3 5h4M9 5h8M3 10h9M14 10h3M3 15h2.5M7.5 15H17",opacity:".5"})]})},"AlertIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M17 10A7 7 0 1 1 3 10A7 7 0 1 1 17 10Z"}),(0,a.jsx)("path",{d:"M10 6v5",opacity:".5"}),(0,a.jsx)("path",{d:"M9.4 12.6h1.2v1.2h-1.2Z",fill:"currentColor",stroke:"none",opacity:".5"})]})},"BackIcon",0,function(e){return(0,a.jsx)("svg",{...o(e),children:(0,a.jsx)("path",{d:"M13 3l-6 7 6 7"})})},"BoardIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M3 3h8v7H3Z"}),(0,a.jsx)("path",{d:"M13 3h4v14h-4ZM3 12h8v5H3Z",opacity:".5"})]})},"CanvasIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M3 3h14v14H3Z"}),(0,a.jsx)("path",{d:"M7.5 3v14M12.5 3v14M3 7.5h14M3 12.5h14",opacity:".5"})]})},"ChevronDownIcon",0,function(e){return(0,a.jsx)("svg",{...o(e),children:(0,a.jsx)("path",{d:"M3 7l7 6 7-6"})})},"ChevronRightIcon",0,function(e){return(0,a.jsx)("svg",{...o(e),children:(0,a.jsx)("path",{d:"M7 3l6 7-6 7"})})},"ChevronUpIcon",0,function(e){return(0,a.jsx)("svg",{...o(e),children:(0,a.jsx)("path",{d:"M3 13l7-6 7 6"})})},"CloseIcon",0,function(e){return(0,a.jsx)("svg",{...o(e),children:(0,a.jsx)("path",{d:"M3 3l14 14M17 3L3 17"})})},"CropIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M6.5 3v10.5H17"}),(0,a.jsx)("path",{d:"M3 6.5h10.5V17",opacity:".5"})]})},"DocsIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M4.5 3h11v14h-11Z"}),(0,a.jsx)("path",{d:"M7 7h6M7 10h6M7 13h3.5",opacity:".5"})]})},"DuplicateIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M7 7h10v10H7Z"}),(0,a.jsx)("path",{d:"M3 3h10v10H3Z",opacity:".5"})]})},"ExportIcon",0,function(e){return(0,a.jsxs)("svg",{...o({size:14,...e}),children:[(0,a.jsx)("path",{d:"M10 3v9M6.5 8.5L10 12l3.5-3.5"}),(0,a.jsx)("path",{d:"M3 17h14",opacity:".5"})]})},"EyeIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M3 10A8 8 0 0 1 17 10A8 8 0 0 1 3 10Z"}),(0,a.jsx)("path",{d:"M12 10A2 2 0 0 1 8 10A2 2 0 0 1 12 10Z",opacity:".5"})]})},"EyeOffIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M3.5 16.5L16.5 3.5"}),(0,a.jsx)("path",{d:"M3 10A8 8 0 0 1 17 10A8 8 0 0 1 3 10ZM12 10A2 2 0 0 1 8 10A2 2 0 0 1 12 10Z",opacity:".5"})]})},"FullscreenIcon",0,function(e){return(0,a.jsx)("svg",{...o(e),children:(0,a.jsx)("path",{d:"M3 7V3h4M17 7V3h-4M3 13v4h4M17 13v4h-4"})})},"GithubIcon",0,function(e){return(0,a.jsx)("svg",{...r(e),viewBox:"0 0 16 16",children:(0,a.jsx)("path",{d:"M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656"})})},"GripIcon",0,function(e){return(0,a.jsxs)("svg",{...r(e),children:[(0,a.jsx)("circle",{cx:"7",cy:"5",r:"1.1"}),(0,a.jsx)("circle",{cx:"13",cy:"5",r:"1.1"}),(0,a.jsx)("circle",{cx:"7",cy:"10",r:"1.1"}),(0,a.jsx)("circle",{cx:"13",cy:"10",r:"1.1"}),(0,a.jsx)("circle",{cx:"7",cy:"15",r:"1.1"}),(0,a.jsx)("circle",{cx:"13",cy:"15",r:"1.1"})]})},"HeartIcon",0,function(e){return(0,a.jsx)("svg",{...o(e),children:(0,a.jsx)("path",{d:"M10 16.5C10 16.5 3 12 3 7.5A3.5 3.5 0 0 1 10 6A3.5 3.5 0 0 1 17 7.5C17 12 10 16.5 10 16.5Z"})})},"InfoIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M17 10A7 7 0 1 1 3 10A7 7 0 1 1 17 10Z"}),(0,a.jsx)("path",{d:"M9.4 6.2h1.2v1.2h-1.2Z",fill:"currentColor",stroke:"none",opacity:".5"}),(0,a.jsx)("path",{d:"M10 9V14",opacity:".5"})]})},"LayersIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M10 4.5L17 8L10 11.5L3 8Z"}),(0,a.jsx)("path",{d:"M3 12L10 15.5L17 12"})]})},"LibraryIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M10 3h7v14h-7Z"}),(0,a.jsx)("path",{d:"M6.5 4.5h1.5v11H6.5ZM3 6h1.5v8H3Z",opacity:".5"})]})},"MediaIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M3 3h14v14H3Z"}),(0,a.jsx)("path",{d:"M3 13.5l4-4 3.5 3.5L14 9.5l3 3",opacity:".5"})]})},"MockupIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M3 3h14v10H3Z"}),(0,a.jsx)("path",{d:"M10 13v4M6 17h8",opacity:".5"})]})},"MoonIcon",0,function(e){return(0,a.jsx)("svg",{...o(e),children:(0,a.jsx)("path",{d:"M16.1 12.8A8 8 0 0 1 7.2 3.9A6.55 6.55 0 1 0 16.1 12.8Z"})})},"PauseIcon",0,function(e){return(0,a.jsx)("svg",{...r({size:14,...e}),children:(0,a.jsx)("path",{d:"M3.5 3.5h5v13h-5ZM11.5 3.5h5v13h-5Z"})})},"PencilIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M12.5 3.5l4 4L7 17H3v-4L12.5 3.5Z"}),(0,a.jsx)("path",{d:"M10.5 5.5l4 4",opacity:".5"})]})},"PlayIcon",0,function(e){return(0,a.jsx)("svg",{...r({size:14,...e}),children:(0,a.jsx)("path",{d:"M5 3.5L17 10L5 16.5Z"})})},"ProjectsIcon",0,function({size:e=20,...r}){let s=(0,t.useId)(),l=`folder-lip-${s}`,u=`folder-cover-${s}`,d=`folder-cover-clip-${s}`;return(0,a.jsxs)("svg",{...o({size:e,...r}),className:"folder-glyph",children:[(0,a.jsxs)("defs",{children:[(0,a.jsxs)("mask",{id:l,maskUnits:"userSpaceOnUse",x:"0",y:"0",width:"20",height:"20",children:[(0,a.jsx)("rect",{x:"0",y:"0",width:"20",height:"20",fill:"#fff"}),(0,a.jsx)("rect",{x:"3.2",y:"3.2",width:"7.3",height:"5.3",fill:"#000"})]}),(0,a.jsx)("clipPath",{id:d,clipPathUnits:"userSpaceOnUse",children:(0,a.jsx)("rect",{x:"0",y:"6",width:"20",height:"14"})}),(0,a.jsxs)("mask",{id:u,maskUnits:"userSpaceOnUse",x:"0",y:"0",width:"20",height:"20",children:[(0,a.jsx)("rect",{x:"0",y:"0",width:"20",height:"20",fill:"#fff"}),(0,a.jsx)("path",{className:"folder-front",d:n,fill:"#000",stroke:"#000",strokeMiterlimit:1.5,clipPath:`url(#${d})`})]})]}),(0,a.jsx)("path",{className:"folder-back-plain",d:i}),(0,a.jsx)("g",{className:"folder-back-masked",mask:`url(#${u})`,children:(0,a.jsx)("path",{d:i})}),(0,a.jsx)("g",{mask:`url(#${l})`,children:(0,a.jsx)("path",{className:"folder-front",d:n,strokeMiterlimit:1.5})})]})},"RedoIcon",0,function(e){return(0,a.jsxs)("svg",{...o({size:15,...e}),children:[(0,a.jsx)("path",{d:"M13.5 3.5L17 7l-3.5 3.5"}),(0,a.jsx)("path",{d:"M17 7H8a4.5 4.5 0 0 0 0 9h5",opacity:".5"})]})},"ResetIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M3 10A7 7 0 1 1 5.05 14.95"}),(0,a.jsx)("path",{d:"M3 10V6.5M3 10H6.5",opacity:".5"})]})},"SearchIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M13.5 8.5A5 5 0 1 1 3.5 8.5A5 5 0 1 1 13.5 8.5Z"}),(0,a.jsx)("path",{d:"M12.5 12.5L17 17",opacity:".5"})]})},"SunIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M14 10A4 4 0 0 1 6 10A4 4 0 0 1 14 10Z"}),(0,a.jsx)("path",{d:"M10 3.8V1.5M10 16.2V18.5M3.8 10H1.5M16.2 10H18.5M14.4 5.6l1.1-1.1M14.4 14.4l1.1 1.1M5.6 14.4l-1.1 1.1M5.6 5.6l-1.1-1.1",opacity:".5"})]})},"ThemeGlyph",0,function(e){let r=(0,t.useId)(),i=`theme-cut-${r}`,n=`theme-in-${r}`;return(0,a.jsxs)("svg",{...o(e),className:"theme-glyph",children:[(0,a.jsxs)("defs",{children:[(0,a.jsxs)("mask",{id:i,maskUnits:"userSpaceOnUse",x:"-14",y:"-14",width:"48",height:"48",children:[(0,a.jsx)("rect",{x:"-14",y:"-14",width:"48",height:"48",fill:"#fff"}),(0,a.jsx)("circle",{className:"bite",cx:"15.3",cy:"4.7",r:"6.5",fill:"#000"})]}),(0,a.jsx)("mask",{id:n,maskUnits:"userSpaceOnUse",x:"-14",y:"-14",width:"48",height:"48",children:(0,a.jsx)("circle",{className:"disc",cx:"10",cy:"10",r:"4",fill:"#fff"})})]}),(0,a.jsx)("g",{mask:`url(#${i})`,children:(0,a.jsx)("circle",{className:"disc",cx:"10",cy:"10",r:"4"})}),(0,a.jsx)("g",{mask:`url(#${n})`,children:(0,a.jsx)("circle",{className:"bite",cx:"15.3",cy:"4.7",r:"6.5"})}),(0,a.jsx)("g",{className:"rays",opacity:".5",children:(0,a.jsx)("path",{d:"M10 3.8V1.5M10 16.2V18.5M3.8 10H1.5M16.2 10H18.5M14.4 5.6l1.1-1.1M14.4 14.4l1.1 1.1M5.6 14.4l-1.1 1.1M5.6 5.6l-1.1-1.1"})})]})},"ThreeDIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M10 3l7 3.5v7L10 17l-7-3.5v-7Z"}),(0,a.jsx)("path",{d:"M3 6.5L10 10l7-3.5M10 10v7",opacity:".5"})]})},"TrashIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M3 6h14M5 6l1 11h8l1-11"}),(0,a.jsx)("path",{d:"M8 6V3.5h4V6",opacity:".5"})]})},"UndoIcon",0,function(e){return(0,a.jsxs)("svg",{...o({size:15,...e}),children:[(0,a.jsx)("path",{d:"M6.5 3.5L3 7l3.5 3.5"}),(0,a.jsx)("path",{d:"M3 7h9a4.5 4.5 0 0 1 0 9H7",opacity:".5"})]})},"WebIcon",0,function(e){return(0,a.jsxs)("svg",{...o(e),children:[(0,a.jsx)("path",{d:"M7 6l-4 4 4 4M13 6l4 4-4 4"}),(0,a.jsx)("path",{d:"M11.5 3l-3 14",opacity:".5"})]})}])},45194,e=>{"use strict";var a=e.i(43476),t=e.i(71645),o=e.i(94195),r=e.i(41372),i=e.i(70703);function n(){return(0,a.jsx)("div",{className:"tpl-thumb","aria-hidden":"true",children:(0,a.jsx)("div",{className:"tpl-thumb-skeleton"})})}let s=(0,i.default)(()=>e.A(36757),{loadableGenerated:{modules:[17004]},ssr:!1,loading:()=>(0,a.jsx)(n,{})}),l=(0,i.default)(()=>e.A(94179),{loadableGenerated:{modules:[6924]},ssr:!1,loading:()=>(0,a.jsx)(n,{})}),u={fps:30,width:810,height:1080,duration:8,totalFrames:240};function d({template:e,autoPreview:i=!1}){let n=(0,t.useRef)(null),[s,l]=(0,t.useState)(40),[c,m]=(0,t.useState)(!1);(0,t.useEffect)(()=>{let e=n.current,a=e?.closest(".tpl-card");if(!a)return;let t=0,o=!1,r=0,s=-1,d=!1,c=!1,f=!1,h=window.matchMedia("(prefers-reduced-motion: reduce)"),p=e=>{if(!o)return;let a=Math.floor((e-r)/1e3*15)%u.totalFrames;a!==s&&(s=a,l(a)),t=requestAnimationFrame(p)},x=()=>{i&&f||d||c?o||h.matches||(o=!0,r=performance.now(),s=-1,m(!0),t=requestAnimationFrame(p)):o&&(o=!1,cancelAnimationFrame(t),m(!1),l(40))},v=()=>{d=!0,x()},g=()=>{d=!1,x()},b=()=>{c=!0,x()},y=e=>{a.contains(e.relatedTarget)||(c=!1,x())};a.addEventListener("pointerenter",v),a.addEventListener("pointerleave",g),a.addEventListener("focusin",b),a.addEventListener("focusout",y);let M=null;return i&&("IntersectionObserver"in window?(M=new IntersectionObserver(([e])=>{f=e.isIntersecting,x()},{threshold:.05})).observe(a):(f=!0,x())),()=>{o=!1,cancelAnimationFrame(t),M?.disconnect(),a.removeEventListener("pointerenter",v),a.removeEventListener("pointerleave",g),a.removeEventListener("focusin",b),a.removeEventListener("focusout",y)}},[i]);let f=(0,t.useMemo)(()=>{let a=(0,o.defaultsFor)(e.meta.id),t="canvas"===e.meta.cardAspect?u.width/u.height:e.meta.cardAspect??.8,i=600*Math.min(1,t),n=600*Math.min(1,1/t),l=(0,o.layerCountFor)(e.meta.id,a,{width:u.width,height:u.height,cardAspect:t}),d=(0,r.resolveEasing)((0,o.easingFor)(e.meta.id)),c={...u,ease:d,easedPhase:e=>{let a=Math.floor(e);return a+d(e-a)},cardAspect:t},m=[];for(let t=0;t<l;t++){let o=e.transform(s,t,l,a,c),r=.5666666666666667*i*o.scale,u=.5666666666666667*n*o.scale,d=o.scaleX??1,f=o.scaleY??1,h=o.rotation+(o.skewY??0),p=o.rotation-(o.skewX??0),x=Math.cos(h)*d,v=Math.sin(h)*d,g=-Math.sin(p)*f,b=Math.cos(p)*f;m.push({x:o.x,y:o.y,w:r,h:u,a:x,b:v,c:g,d:b,ex:(Math.abs(x)*r+Math.abs(g)*u)/2,ey:(Math.abs(v)*r+Math.abs(b)*u)/2,alpha:o.alpha,dim:Math.max(0,Math.min(1,o.dim??0)),clipPath:function(e){if(!e||e.x0<=0&&e.y0<=0&&e.x1>=1&&e.y1>=1)return;let a=e=>`${(100*Math.max(0,Math.min(1,e))).toFixed(2)}%`;return`inset(${a(e.y0)} ${a(1-e.x1)} ${a(1-e.y1)} ${a(e.x0)})`}(o.clip),z:Math.round(1e3*o.depth+t),r:Math.min(r,u)/2*Math.max(0,Math.min(1,(a.cornerRadius??0)/100))})}if(m.length<=28)return m;let f=u.width/2,h=u.height/2;return m.map((e,a)=>({p:e,i:a,invisible:+(e.alpha<.02),off:+!!(Math.abs(e.x)-e.ex>f||Math.abs(e.y)-e.ey>h),d:Math.hypot(e.x,e.y)})).sort((e,a)=>e.invisible-a.invisible||e.off-a.off||e.d-a.d).slice(0,28).sort((e,a)=>e.i-a.i).map(e=>e.p)},[s,e]);return(0,a.jsx)("div",{ref:n,className:`tpl-thumb ${c?"is-previewing":""}`,"aria-hidden":"true",children:f.map((e,t)=>(0,a.jsx)("div",{className:"tpl-thumb-el",style:{width:`${e.w/u.width*100}%`,aspectRatio:`${Math.max(.001,e.w)} / ${Math.max(.001,e.h)}`,left:`${50+e.x/u.width*100}%`,top:`${50+e.y/u.height*100}%`,transform:`translate(-50%, -50%) matrix(${e.a.toFixed(5)}, ${e.b.toFixed(5)}, ${e.c.toFixed(5)}, ${e.d.toFixed(5)}, 0, 0)`,opacity:e.alpha,filter:e.dim>0?`brightness(${(1-e.dim).toFixed(3)})`:void 0,clipPath:e.clipPath,zIndex:e.z,borderRadius:`${Math.max(1,e.r/e.w*100)}%`}},t))})}e.s(["default",0,function({template:e,autoPreview:o=!1}){let[r,i]=(0,t.useState)(!1),[n,u]=(0,t.useState)(!1);return"webgl"===e.meta.engine&&e.transform3d&&!r?(0,a.jsx)(s,{template:e,autoPreview:o,onUnavailable:()=>i(!0)}):n?(0,a.jsx)(d,{template:e,autoPreview:o}):(0,a.jsx)(l,{template:e,autoPreview:o,onUnavailable:()=>u(!0)})}])},76217,e=>{"use strict";let a={"Full frame":0,Edges:1,Corners:2},t=["Corners","Edges","Full frame"],o=[{key:"area",label:"Applies at",type:"pills",options:t,default:"Edges"},{key:"reach",label:"Reach",type:"slider",min:2,max:100,step:1,default:35,unit:"%",visibleWhen:{key:"area",not:"Full frame"}}],r=e=>({uArea:a[String(e.area??"Edges")]??1,uBand:Math.max(0,Math.min(1,Number(e.reach??35)/100))}),i={uArea:"float",uBand:"float"},n={meta:{id:"bloom",name:"Bloom",defaultScope:"artwork"},controls:[{key:"threshold",label:"Threshold",type:"slider",min:0,max:100,step:1,default:65,unit:"%"},{key:"radius",label:"Radius",type:"slider",min:1,max:60,step:1,default:22,unit:"px"},{key:"intensity",label:"Intensity",type:"slider",min:0,max:200,step:1,default:70,unit:"%"},...o],shader:{uniformTypes:{uThreshold:"float",uRadius:"float",uIntensity:"float",...i},uniforms:e=>({uThreshold:Math.max(0,Math.min(1,Number(e.threshold??65)/100)),uRadius:Math.max(1,Number(e.radius??22)),uIntensity:Math.max(0,Number(e.intensity??70)/100),...r(e)}),fragment:`
// O que passa do limiar, e SO o excedente: subtrair o limiar em vez de deixar
// passar o pixel inteiro e o que evita o degrau visivel na borda do brilho.
vec3 fx_excedente(vec3 c) {
  float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float acima = max(0.0, luma - uThreshold);
  // divide pelo que sobra da escala, para o limiar em 0 nao virar identidade
  float k = acima / max(0.0001, 1.0 - uThreshold);
  return c * k;
}

vec4 fxMain(vec2 p) {
  vec4 base = fxSample(p);
  vec3 brilho = vec3(0.0);
  float peso = 0.0;
  for (int anel = 1; anel <= 4; anel++) {
    float r = (float(anel) / float(4)) * uRadius;
    // peso gaussiano pelo raio do anel, como num blur de verdade
    float sigma = max(0.0001, uRadius * 0.5);
    float w = exp(-(r * r) / (2.0 * sigma * sigma));
    for (int dir = 0; dir < 8; dir++) {
      // Meio passo de rotacao por anel, para os aneis nao alinharem as amostras
      // no mesmo raio e desenharem uma estrela.
      float a = (float(dir) + float(anel) * 0.5) * (6.2831853 / float(8));
      vec2 off = vec2(cos(a), sin(a)) * r;
      brilho += fx_excedente(fxSample(p + off).rgb) * w;
      peso += w;
    }
  }
  brilho /= max(0.0001, peso);
  // A area modula a INTENSIDADE, nao o raio: o bloom segue colhendo luz de todo
  // vizinho claro — inclusive dos cards no meio — e so a DEPOSITA onde a
  // mascara deixa. Modular o raio faria o brilho encolher em vez de recuar, o
  // que le como bloom fraco e nao como bloom nas bordas.
  float area = fx_areaMask(p, uArea, uBand);
  // Aditivo, nao mistura: bloom SOMA luz. Misturar apagaria a imagem embaixo.
  return vec4(base.rgb + brilho * uIntensity * area, base.a);
}`}},s=`
vec4 fxMain(vec2 p) {
  // O raio e MODULADO pela area. No meio do quadro a mascara vale 0, a funcao
  // devolve o pixel intacto e nem entra no laco — e o que separa "desfocar as
  // bordas" de "desfocar tudo". Aplicado ao quadro inteiro, o blur come os
  // cards, que sao justamente o assunto da cena.
  float raio = uRadius * fx_areaMask(p, uArea, uBand);
  if (raio < 0.5) return fxSample(p);
  vec4 soma = fxSample(p);
  float peso = 1.0;
  float sigma = max(0.0001, raio * 0.5);
  for (int i = 1; i <= 6; i++) {
    float d = (float(i) / float(6)) * raio;
    float w = exp(-(d * d) / (2.0 * sigma * sigma));
    soma += fxSample(p + uDir * d) * w;
    soma += fxSample(p - uDir * d) * w;
    peso += 2.0 * w;
  }
  return soma / peso;
}`;function l(e){return{uniformTypes:{uRadius:"float",uDir:"vec2",...i},uniforms:a=>({uRadius:Math.max(0,Number(a.radius??8)),uDir:e,...r(a)}),fixedUniforms:["uDir"],fragment:s}}let u={meta:{id:"blur",name:"Blur",defaultScope:"artwork"},controls:[{key:"radius",label:"Radius",type:"slider",min:0,max:40,step:1,default:8,unit:"px"},...o],shader:l([1,0]),passes:[l([0,1])]},d={meta:{id:"grain",name:"Grain"},controls:[{key:"amount",label:"Amount",type:"slider",min:0,max:100,step:1,default:35,unit:"%"},{key:"size",label:"Grain Size",type:"slider",min:1,max:12,step:1,default:2,unit:"px"},{key:"animate",label:"Animate",type:"toggle",options:["Off","On"],default:"On"}],shader:{uniformTypes:{uAmount:"float",uSize:"float",uSeed:"float"},uniforms:(e,a)=>{let t="On"===e.animate||!0===e.animate;return{uAmount:Math.max(0,Math.min(100,Number(e.amount??35)))/100,uSize:Math.max(1,Number(e.size??2)),uSeed:t?Math.floor((a.time??0)*24):-1}},fragment:`
float fx_hash(vec2 c) {
  return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453);
}

vec4 fxMain(vec2 p) {
  vec4 col = fxSample(p);
  // Quantize to the grain cell so the noise has a size, then offset the seed by
  // a large stride per step — a small stride correlates consecutive frames and
  // the grain appears to crawl.
  vec2 cell = floor(p / uSize);
  float n = fx_hash(cell + uSeed * 37.13);
  // Signed and centred, so grain lightens as often as it darkens instead of
  // dragging the whole image one way.
  float g = (n - 0.5) * uAmount;
  return vec4(clamp(col.rgb + g, 0.0, 1.0), col.a);
}`}},c={meta:{id:"halftone",name:"Halftone",defaultScope:"artwork"},controls:[{key:"dotSize",label:"Dot Size",type:"slider",min:2,max:40,step:1,default:8,unit:"px"},{key:"angle",label:"Screen Angle",type:"slider",min:0,max:90,step:1,default:45,unit:"°"},{key:"mono",label:"Colour",type:"toggle",options:["Mono","CMY"],default:"Mono"}],shader:{uniformTypes:{uCell:"float",uRot:"vec2",uMono:"float"},uniforms:e=>{let a=Number(e.angle??45)*Math.PI/180;return{uCell:Math.max(2,Number(e.dotSize??8)),uRot:[Math.cos(a),Math.sin(a)],uMono:+((e.mono??"Mono")==="Mono")}},fragment:`
// Coverage of one dot: 1 at the cell centre, 0 past its radius.
// A tone of 0 wants a full dot and 1 wants none, so the radius follows (1 - tone).
float fx_dot(vec2 gridPos, float tone) {
  vec2 cellCentre = floor(gridPos) + 0.5;
  float d = length(gridPos - cellCentre);
  // sqrt(0.5) is the half-diagonal of the cell: the radius at which a dot just
  // touches its neighbours diagonally, which is full coverage.
  float r = (1.0 - tone) * 0.7071;
  // One pixel of ramp, in cell units — constant softness on screen.
  float soft = 1.0 / uCell;
  return 1.0 - smoothstep(r - soft, r + soft, d);
}

vec4 fxMain(vec2 p) {
  vec4 col = fxSample(p);
  // Into the rotated screen's own grid, in cells.
  vec2 rot = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 gridPos = rot / uCell;

  if (uMono > 0.5) {
    // Rec.709 luma: a green-heavy image screened on a flat average comes out
    // far darker than the eye expects.
    float tone = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));
    float ink = fx_dot(gridPos, tone);
    return vec4(vec3(1.0 - ink), col.a);
  }

  // Colour: each channel gets its own screen, offset in angle the way process
  // printing separates them so the dots interleave instead of stacking.
  float c = fx_dot(gridPos, col.r);
  float m = fx_dot(gridPos + vec2(0.33, 0.66), col.g);
  float y = fx_dot(gridPos + vec2(0.66, 0.33), col.b);
  return vec4(1.0 - c, 1.0 - m, 1.0 - y, col.a);
}`}},m={meta:{id:"liquid-glass",name:"Liquid Glass",defaultScope:"artwork"},controls:[{key:"area",label:"Applies at",type:"pills",options:["Corners","Edges","Lens"],default:"Edges"},{key:"reach",label:"Reach",type:"slider",min:2,max:100,step:1,default:22,unit:"%",visibleWhen:{key:"area",not:"Lens"}},{key:"position",label:"Position",type:"xypad",max:540,default:{x:0,y:0},visibleWhen:{key:"area",equals:"Lens"}},{key:"size",label:"Size",type:"slider",min:4,max:80,step:1,default:26,unit:"%",visibleWhen:{key:"area",equals:"Lens"}},{key:"shape",label:"Shape",type:"pills",options:["Circle","Square"],default:"Circle",visibleWhen:{key:"area",equals:"Lens"}},{key:"rounding",label:"Rounding",type:"slider",min:0,max:100,step:1,default:30,unit:"%",visibleWhen:{key:"shape",equals:"Square"}},{key:"refraction",label:"Refraction",type:"slider",min:0,max:100,step:1,default:45,unit:"%"},{key:"dispersion",label:"Dispersion",type:"slider",min:0,max:100,step:1,default:30,unit:"%"},{key:"ripple",label:"Ripple",type:"slider",min:0,max:100,step:1,default:18,unit:"%"},{key:"glow",label:"Glow",type:"slider",min:0,max:100,step:1,default:35,unit:"%"},{key:"ring",label:"Ring",type:"slider",min:0,max:100,step:1,default:22,unit:"%"},{key:"ringColor",label:"Ring colour",type:"color",default:"#009dff"},{key:"shimmer",label:"Shimmer",type:"slider",min:0,max:100,step:1,default:25,unit:"%",advanced:!0},{key:"edgeBlur",label:"Edge blur",type:"slider",min:0,max:40,step:1,default:6,unit:"px",advanced:!0},{key:"rotation",label:"Rotation",type:"slider",min:-180,max:180,step:1,default:0,unit:"°",advanced:!0}],shader:{uniformTypes:{uCenter:"vec2",uHalf:"vec2",uZoom:"float",uDispersion:"float",uRipple:"float",uGlow:"float",uRing:"float",uRingColor:"vec3",uShimmer:"float",uBlur:"float",uRotation:"float",uShape:"float",uRound:"float",uSamples:"float",...i},uniforms:(e,t)=>{let o=e.position??{x:0,y:0},r=Math.max(4,Number(e.size??26))/100*t.height*.5,i=String(e.ringColor??"#009dff").replace("#",""),n=parseInt(3===i.length?i.split("").map(e=>e+e).join(""):i,16)||40447;return{uCenter:[t.width/2+Number(o.x??0),t.height/2+Number(o.y??0)],uHalf:[r,r],uZoom:Math.max(0,Number(e.refraction??45))/100,uDispersion:Math.max(0,Number(e.dispersion??30))/100,uRipple:Math.max(0,Number(e.ripple??18))/100,uGlow:Math.max(0,Number(e.glow??35))/100,uRing:Math.max(0,Number(e.ring??22))/100,uRingColor:[(n>>16&255)/255,(n>>8&255)/255,(255&n)/255],uShimmer:Math.max(0,Number(e.shimmer??25))/100,uBlur:Math.max(0,Number(e.edgeBlur??6)),uRotation:Number(e.rotation??0)*Math.PI/180,uShape:+("Square"===e.shape),uRound:Math.max(0,Math.min(1,Number(e.rounding??30)/100)),uSamples:16,uArea:"Lens"===String(e.area??"Edges")?0:a[String(e.area??"Edges")]??1,uBand:Math.max(0,Math.min(1,Number(e.reach??22)/100))}},fixedUniforms:["uSamples"],fragment:`
const int LG_MAX = 16;

// distancia assinada de caixa arredondada (negativa dentro)
float lg_sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

vec4 fxMain(vec2 p) {
  vec4 base = fxSample(p);

  // DOIS modos, e a diferenca entre eles e so como 'rad' e 'rPix' nascem.
  //
  //   Lens (uArea 0)    um disco que se posiciona: 'rad' sai da elipse
  //   Edges / Corners   o vidro vive na FAIXA DA BORDA: 'rad' e a mascara de
  //                     area, e nao ha o que posicionar
  //
  // O modo de borda existe porque o disco, aplicado por cima da cena, cobre os
  // cards — e vidro em cima do assunto e o assunto que se perde. Na borda o
  // vidro emoldura, o meio fica limpo, e nao ha pad nem tamanho para acertar:
  // o alcance e o unico numero.
  bool lente = uArea < 0.5;

  vec2 centro = lente ? uCenter : uResolution * 0.5;
  vec2 d = p - centro;
  float ca = cos(uRotation), sa = sin(uRotation);
  vec2 q = mat2(ca, -sa, sa, ca) * d;

  float rad;
  float shapeND;
  float rPix;
  if (lente) {
    // 0 no centro .. 1 na borda
    float nd = length(q / uHalf);
    float maskND = nd;
    if (uShape > 0.5) {
      float corner = min(uHalf.x, uHalf.y) * uRound;
      maskND = 1.0 + lg_sdRoundBox(q, uHalf, corner) / min(uHalf.x, uHalf.y);
    }
    // Fora da lente o quadro passa intacto — inclusive o alpha.
    if (maskND > 1.0) return base;
    shapeND = clamp(maskND, 0.0, 1.0);
    rad = clamp(nd, 0.0, 1.0);
    rPix = (uHalf.x + uHalf.y) * 0.5;
  } else {
    // A mascara JA e "0 no limpo .. 1 na borda", que e a mesma orientacao do
    // 'rad' do disco — entao todo o resto do shader vale sem mudanca.
    rad = fx_areaMask(p, uArea, uBand);
    if (rad <= 0.001) return base;
    shapeND = rad;
    // O raio caracteristico e a LARGURA DA FAIXA, nao o do quadro: e ele que
    // dita a escala da ondulacao e da dispersao, e usar meio quadro faria uma
    // faixa fina ondular com a amplitude de uma lente gigante.
    rPix = uBand * min(uResolution.x, uResolution.y) * 0.5;
  }
  vec2 radialDir = normalize(d + vec2(1e-6));
  vec2 tangentDir = vec2(-radialDir.y, radialDir.x);
  float angle = atan(q.y, q.x);

  // Puxada para dentro (a refracao) mais a ondulacao no aro. A ondulacao e duas
  // senoides de frequencias diferentes: uma so daria um aro poligonal regular,
  // que le como falha de geometria e nao como liquido.
  float pull = uZoom * 0.30 * (rad * rad);
  float rimStrength = smoothstep(0.578, 1.0, rad);
  // Frequencias 2 e 1, como no original. Eu havia posto 3 e 7, que da um aro
  // ocupado — bonito de perto e nervoso em movimento; duas ondas lentas
  // desencontradas e o que le como liquido.
  float fluid = sin(angle * 2.0) * 0.55 + sin(angle * 1.0) * 0.25;
  // As constantes abaixo sao FRACAO DO RAIO da lente, nao pixels absolutos.
  // O original mede tudo em UV de altura de tela, entao converter so as
  // coordenadas e manter os fatores deixou a ondulacao vinte vezes fraca. Em
  // fracao do raio o efeito tambem fica igual em qualquer resolucao.
  vec2 rimOff = tangentDir * fluid * rimStrength * rPix * uRipple * 1.8;
  vec2 baseP = uCenter + d * (1.0 - pull) + rimOff;

  // Dispersao cromatica: amostra ao longo de um pequeno deslocamento e pesa as
  // amostras de vermelho a azul. O peso e normalizado POR CANAL — sem isso o
  // aro clareia, porque a soma dos pesos nao e 1.
  float rimMask = smoothstep(0.55, 1.0, rad);
  // Tambem em fracao do raio: no original o desvio no aro vale ~5,6% do raio da
  // lente, e 0.19 * 0.30 (o default) reproduz isso.
  vec2 dispDir = radialDir * uDispersion * rPix * 0.19 * rimMask;
  int N = int(uSamples);
  if (N < 2) N = 2;
  if (N > LG_MAX) N = LG_MAX;
  vec3 col = vec3(0.0);
  vec3 wsum = vec3(0.0);
  for (int i = 0; i < LG_MAX; i++) {
    if (i >= N) break;
    float t = float(i) / float(N - 1);
    vec3 s = fxSample(baseP + dispDir * (t - 0.5)).rgb;
    vec3 w = vec3(
      exp(-pow((t - 0.00) / 0.38, 2.0)),
      exp(-pow((t - 0.50) / 0.38, 2.0)),
      exp(-pow((t - 1.00) / 0.38, 2.0))
    );
    col += s * w;
    wsum += w;
  }
  col /= max(wsum, vec3(0.001));

  // Desfoque suave perto do aro, que e onde o vidro real perde definicao.
  float blurFade = 1.0 - smoothstep(0.72, 0.98, rad);
  if (uBlur > 0.01 && blurFade > 0.01) {
    vec2 blurRad = vec2(uBlur) * blurFade;
    vec3 bcol = vec3(0.0);
    float btw = 0.0;
    for (int a = 0; a < 6; a++) {
      float ang = float(a) * 1.0471975;
      for (int rr = 0; rr < 3; rr++) {
        float k = 0.4 + float(rr) * 0.3;
        vec2 o = vec2(cos(ang), sin(ang)) * blurRad * k;
        float w = 1.0 - k * 0.38;
        bcol += fxSample(baseP + o).rgb * w;
        btw += w;
      }
    }
    col = mix(bcol / btw, col, rimMask);
  }

  // A LUZ do vidro sai proporcional ao que existe embaixo.
  //
  // Sem isto, num escopo de arte (onde o fundo nao entra e os pixels vazios tem
  // alpha 0) o anel, a nova e a linha de reflexo saem com rgb > 0 e alpha 0 —
  // e nessa convencao pre-multiplicada isso NAO e invisivel, e luz aditiva:
  // compoe sobre o fundo da cena e desenha a moldura colorida exatamente onde
  // se pediu que ela nao fosse. Medido: 14% dos pixels de fundo mudavam, contra
  // 0,8% do Bloom, que sangra so o halo na beirada do card.
  //
  // Fisicamente tambem e o certo: vidro reflete e refrata a luz que existe.
  // Sem card, sem luz. E em escopo de cena o fundo e opaco, entao base.a vale
  // 1 e isto nao muda nada — uma linha serve os dois casos.
  float luz = base.a;

  // Vidro escurece um pouco para o centro.
  col *= mix(0.91, 1.0, smoothstep(0.0, 0.38, shapeND));

  // Nova branca no centro, duas gaussianas: a estreita da o nucleo, a larga o
  // halo. Uma so vira bolinha dura.
  // Os fatores aqui saem das formulas do original com os defaults dele
  // (glow 4.2, whiteGlow 0.24, novaSize 12): o nucleo soma 0,08 no centro, nao
  // 0,5. A minha primeira versao somava 0,47 e estourava o meio da lente de
  // branco — eu havia normalizado os controles para 0..1 sem refazer as
  // constantes que dependiam da escala antiga.
  // So no modo lente: uma nova precisa de um CENTRO, e uma faixa de borda nao
  // tem um. Somada ali, ela viraria um clarao ao longo de toda a moldura.
  if (lente) {
    float r2 = shapeND * shapeND * 0.25;
    float gs = max(uGlow * 0.43, 0.004);
    float nova = (exp(-r2 / gs) + exp(-r2 / (gs * 7.0)) * 0.18) * uGlow * 0.23;
    col += vec3(nova) * luz;
  }

  // Anel colorido mais a aura em volta dele. O anel fica quase na borda
  // (0.49 de 0.5) e e fino: mais para dentro ele le como bolha, nao como aro.
  float dC = shapeND * 0.5;
  float tR = 0.49;
  float rW = 0.014;
  float ring = exp(-pow((dC - tR) / rW, 2.0)) * uRing * 6.7;
  // O cintilar anda com uTime, que vem do FRAME: o mesmo frame cintila igual em
  // todo render, e o ciclo fecha no loop.
  if (uShimmer > 0.001) {
    ring *= sin(angle * 12.0 + uTime * uShimmer * 6.2831853) * 0.12 + 0.88;
  }
  float aura = exp(-pow((dC - tR) / (rW * 6.0), 2.0)) * 0.28 * uRing * 2.5;
  // Mesma razao da linha de reflexo: num circulo curto o anel e um brilho de
  // vidro, correndo pelo quadro inteiro ele SATURA e vira tubo de neon. Medido
  // no default antigo, o pico somava 1,62 em ciano — acima de 1,0, ou seja
  // estourado. O fator devolve o anel para a faixa visivel.
  float ganhoAnel = lente ? 1.0 : 0.3;
  col += uRingColor * (ring + aura) * ganhoAnel * luz;

  // Linha clara na borda, o reflexo do canto do vidro. No disco ela e um fio
  // curto num circulo; numa moldura ela corre pelo quadro inteiro e soma com a
  // aura do anel ao longo de tudo — no default aquilo virava letreiro de neon.
  // Um terco da intensidade no modo de borda devolve o reflexo sem o anuncio.
  col += vec3(exp(-pow((dC - 0.488) / 0.003, 2.0)) * uRing * (lente ? 3.5 : 1.2) * luz);

  // Quanto do vidro entra. No disco e 1 dentro com uma queda de 7% no aro, para
  // nao serrilhar; na faixa a propria mascara ja e a rampa, entao ela e a
  // opacidade — o vidro nasce do nada na borda interna e fecha na externa.
  float a = lente ? smoothstep(1.0, 0.93, shapeND) : rad;
  return vec4(mix(base.rgb, col, a), base.a);
}`}},f={meta:{id:"pixelate",name:"Pixelate",defaultScope:"artwork"},controls:[{key:"size",label:"Pixel Size",type:"slider",min:1,max:64,step:1,default:8}],shader:{uniformTypes:{uSize:"vec2"},uniforms:e=>{let a=Math.max(1,Number(e.size??8));return{uSize:[a,a]}},fragment:`
vec4 fxMain(vec2 p) {
  vec2 size = max(uSize, vec2(1.0));
  return fxSample(floor(p / size) * size);
}`}},h={meta:{id:"posterize",name:"Posterize",defaultScope:"artwork"},controls:[{key:"levels",label:"Levels",type:"slider",min:2,max:16,step:1,default:5},{key:"mix",label:"Mix",type:"slider",min:0,max:100,step:1,default:100,unit:"%"}],shader:{uniformTypes:{uSteps:"float",uMix:"float"},uniforms:e=>({uSteps:Math.max(1,Math.round(Number(e.levels??5))-1),uMix:Math.max(0,Math.min(1,Number(e.mix??100)/100))}),fragment:`
vec4 fxMain(vec2 p) {
  vec4 col = fxSample(p);
  // +0.5 rounds to the nearest level; without it every pixel falls to the level
  // below and the image darkens by half a step.
  vec3 q = floor(col.rgb * uSteps + 0.5) / uSteps;
  // Blends against the ORIGINAL sample, so Mix at 0 is exact identity and the
  // separation the levels threw away comes back proportionally.
  return vec4(mix(col.rgb, q, uMix), col.a);
}`}},p={meta:{id:"rgb-split",name:"RGB Split",defaultScope:"artwork"},controls:[{key:"offset",label:"Offset",type:"slider",min:0,max:40,step:.5,default:4,unit:"px"},{key:"angle",label:"Angle",type:"slider",min:0,max:360,step:1,default:0,unit:"°"}],shader:{uniformTypes:{uShift:"vec2"},uniforms:e=>{let a=Math.max(0,Number(e.offset??4)),t=Number(e.angle??0)*Math.PI/180;return{uShift:[Math.cos(t)*a,Math.sin(t)*a]}},fragment:`
vec4 fxMain(vec2 p) {
  vec4 r = fxSample(p + uShift);
  vec4 g = fxSample(p);
  vec4 b = fxSample(p - uShift);
  // Alpha follows the unshifted sample: taking it from a shifted channel would
  // drag the card's edge sideways and leave a fringe outside its own silhouette.
  return vec4(r.r, g.g, b.b, g.a);
}`}},x={meta:{id:"scanlines",name:"Scanlines"},controls:[{key:"spacing",label:"Spacing",type:"slider",min:2,max:24,step:1,default:3,unit:"px"},{key:"strength",label:"Strength",type:"slider",min:0,max:100,step:1,default:40,unit:"%"},{key:"curvature",label:"Curvature",type:"slider",min:0,max:100,step:1,default:0,unit:"%"}],shader:{uniformTypes:{uSpacing:"float",uStrength:"float",uCurve:"float"},uniforms:e=>({uSpacing:Math.max(2,Number(e.spacing??3)),uStrength:Math.max(0,Math.min(100,Number(e.strength??40)))/100,uCurve:Math.max(0,Math.min(100,Number(e.curvature??0)))/100*.35}),fragment:`
vec4 fxMain(vec2 p) {
  vec2 src = p;

  if (uCurve > 0.0001) {
    // Centred, normalized to -1..1 on both axes so the bow is symmetric
    // regardless of the canvas aspect.
    vec2 c = (p / uResolution) * 2.0 - 1.0;
    float r2 = dot(c, c);
    c *= 1.0 + uCurve * r2;
    // Outside the tube there is nothing, so do not clamp — clamping smears the
    // edge pixel into a border streak.
    if (abs(c.x) > 1.0 || abs(c.y) > 1.0) return vec4(0.0, 0.0, 0.0, 1.0);
    src = (c * 0.5 + 0.5) * uResolution;
  }

  vec4 col = fxSample(src);
  // Cosine rather than a modulo: the period is intrinsic, so the line stays
  // soft at every spacing instead of beating against the pixel grid.
  float line = 0.5 + 0.5 * cos(src.y * 6.28318 / uSpacing);
  return vec4(col.rgb * (1.0 - uStrength * line), col.a);
}`}},v=`
// A faixa horizontal: 0 dentro dela, subindo para fora. E o modo 'Band', o
// tilt-shift classico — plano de foco paralelo ao chao.
float ts_faixa(vec2 p) {
  float centro = uFocus * uResolution.y;
  float meia = max(1.0, uBandY * uResolution.y * 0.5);
  float d = abs(p.y - centro) - meia;
  if (d <= 0.0) return 0.0;
  float rampa = max(1.0, uFeather * uResolution.y);
  return smoothstep(0.0, rampa, d);
}

vec4 fxMain(vec2 p) {
  // Faixa (codigo 3) usa a mascara propria; bordas e cantos usam a
  // compartilhada. A faixa deixa o meio nitido e borra TOPO E BASE, o que numa
  // cena de cards deitados ainda come metade deles — por isso ela deixou de ser
  // o unico modo, e nao e mais o default.
  float mascara = (uArea > 2.5) ? ts_faixa(p) : fx_areaMask(p, uArea, uBand);
  float raio = uRadius * mascara;
  if (raio < 0.5) return fxSample(p);
  vec4 soma = fxSample(p);
  float peso = 1.0;
  float sigma = max(0.0001, raio * 0.5);
  for (int i = 1; i <= 6; i++) {
    float d = (float(i) / float(6)) * raio;
    float w = exp(-(d * d) / (2.0 * sigma * sigma));
    soma += fxSample(p + uDir * d) * w;
    soma += fxSample(p - uDir * d) * w;
    peso += 2.0 * w;
  }
  return soma / peso;
}`;function g(e){return{uniformTypes:{uRadius:"float",uFocus:"float",uBandY:"float",uFeather:"float",uDir:"vec2",...i},uniforms:a=>({uRadius:Math.max(0,Number(a.radius??14)),uFocus:Math.max(0,Math.min(1,Number(a.focus??50)/100)),uBandY:Math.max(0,Math.min(1,Number(a.band??25)/100)),uFeather:Math.max(.001,Number(a.feather??12)/100),uDir:e,...r(a),uArea:"Band"===String(a.area??"Edges")?3:r(a).uArea}),fixedUniforms:["uDir"],fragment:v}}let b={meta:{id:"tilt-shift",name:"Tilt-shift",defaultScope:"artwork"},controls:[{key:"radius",label:"Radius",type:"slider",min:0,max:40,step:1,default:14,unit:"px"},{key:"area",label:"Applies at",type:"pills",options:[...t,"Band"],default:"Edges"},{key:"reach",label:"Reach",type:"slider",min:2,max:100,step:1,default:35,unit:"%",visibleWhen:{key:"area",not:"Full frame"}},{key:"focus",label:"Focus",type:"slider",min:0,max:100,step:1,default:50,unit:"%",visibleWhen:{key:"area",equals:"Band"}},{key:"band",label:"Band",type:"slider",min:0,max:100,step:1,default:25,unit:"%",visibleWhen:{key:"area",equals:"Band"}},{key:"feather",label:"Feather",type:"slider",min:0,max:60,step:1,default:12,unit:"%",visibleWhen:{key:"area",equals:"Band"}}],shader:g([1,0]),passes:[g([0,1])]},y={meta:{id:"vignette",name:"Vignette"},controls:[{key:"amount",label:"Amount",type:"slider",min:0,max:100,step:1,default:45,unit:"%"},{key:"radius",label:"Radius",type:"slider",min:10,max:100,step:1,default:70,unit:"%"},{key:"softness",label:"Softness",type:"slider",min:1,max:100,step:1,default:45,unit:"%"}],shader:{uniformTypes:{uAmount:"float",uRadius:"float",uSoftness:"float"},uniforms:e=>({uAmount:Math.max(0,Math.min(100,Number(e.amount??45)))/100,uRadius:Math.max(10,Math.min(100,Number(e.radius??70)))/100,uSoftness:Math.max(.01,Math.min(100,Number(e.softness??45))/100)}),fragment:`
vec4 fxMain(vec2 p) {
  vec4 col = fxSample(p);
  // Each axis by its own half-extent: distance 1.0 is the edge of the inscribed
  // ellipse regardless of the canvas aspect.
  vec2 d = (p - uResolution * 0.5) / (uResolution * 0.5);
  float r = length(d);
  // Fully lit inside uRadius, falling to uAmount over uSoftness beyond it.
  float shade = 1.0 - uAmount * smoothstep(uRadius, uRadius + uSoftness, r);
  return vec4(col.rgb * shade, col.a);
}`}},M={meta:{id:"wave",name:"Wave",defaultScope:"artwork"},controls:[{key:"amount",label:"Amount",type:"slider",min:0,max:120,step:1,default:18,unit:"px"},{key:"freq",label:"Frequency",type:"slider",min:1,max:20,step:1,default:3},{key:"speed",label:"Speed",type:"slider",min:0,max:8,step:.5,default:1}],shader:{uniformTypes:{uAmount:"float",uFreq:"float",uSpeed:"float"},uniforms:e=>({uAmount:Math.max(0,Number(e.amount??18)),uFreq:Math.max(1,Math.round(Number(e.freq??3))),uSpeed:Math.max(0,Number(e.speed??1))}),fragment:`
vec4 fxMain(vec2 p) {
  // Y normalized so the frequency means whole waves across the frame height, not
  // per pixel — the same slider value then reads the same in any canvas size.
  float y = p.y / uResolution.y;
  // uTime is frame-derived, so the phase at a given frame is identical on every
  // render of the same clip.
  float offset = sin(y * uFreq * 6.28318 + uTime * uSpeed * 6.28318) * uAmount;
  vec2 src = vec2(p.x + offset, p.y);
  // Past the edge there is no image. Clamping would streak the border pixel.
  if (src.x < 0.0 || src.x > uResolution.x) return vec4(0.0);
  return fxSample(src);
}`}},j={[d.meta.id]:d,[y.meta.id]:y,[u.meta.id]:u,[n.meta.id]:n,[b.meta.id]:b,[m.meta.id]:m,[c.meta.id]:c,[h.meta.id]:h,[x.meta.id]:x,[f.meta.id]:f,[p.meta.id]:p,[M.meta.id]:M},k=Object.values(j);function w(e){return j[e]}e.s(["effectDefaults",0,function(e){let a=w(e);if(!a)return{};let t={};for(let e of a.controls)t[e.key]="object"==typeof e.default&&null!==e.default?{...e.default}:e.default;return t},"effectList",0,k,"getEffect",0,w],76217)},90581,e=>{"use strict";let a=e=>Math.max(0,Math.min(1,e));function t(e){return{x:Number.isFinite(e?.x)?a(e.x):.5,y:Number.isFinite(e?.y)?a(e.y):.5,zoom:Number.isFinite(e?.zoom)?Math.max(1,Math.min(5,e.zoom)):1}}let o={"1:1":1,"4:5":.8,"3:4":3/4,"4:3":4/3,"9:16":9/16,"16:9":16/9},r=/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/;function i(e){if(!e)return null;let a=r.exec(e.trim());if(!a)return null;let t=Number(a[1]),o=Number(a[2]);if(!Number.isFinite(t)||!Number.isFinite(o)||t<=0||o<=0)return null;let i=t/o;return i<.1||i>10?null:i}function n(e,o,r,i){let n=t(i),s=e,l=e/r;return l>o&&(l=o,s=o*r),s/=n.zoom,l/=n.zoom,{fx:(e-s)*a(n.x),fy:(o-l)*a(n.y),fw:s,fh:l}}e.s(["CARD_SHAPES",0,o,"cardAspectFor",0,function(e,a,t,r){if("canvas"===e.cardAspect)return a/Math.max(1,t);if(r&&o[r])return o[r];let n=i(r);return null!==n?n:"number"==typeof e.cardAspect?e.cardAspect:.8},"coverCrop",0,n,"cropFromRect",0,function(e,a,o,r,i,s){let l=n(e,a,o),u=Math.max(1,Math.min(5,l.fw/Math.max(Number.EPSILON,s))),d=l.fw/u,c=l.fh/u;return t({x:e>d?r/(e-d):.5,y:a>c?i/(a-c):.5,zoom:u})},"cropKey",0,function(e,a,o){let r=t(o);return`${e}|${a.toFixed(4)}|${r.x}|${r.y}|${r.zoom}`},"normalizeCrop",0,t,"parseCardShape",0,i])},5385,e=>{"use strict";let a=/\.(mp4|webm|ogv|ogg|mov|m4v)(?:[?#]|$)/i,t=new WeakMap;function o(e,a,r="loop"){return new Promise(o=>{let i,n,s;if(!e.duration||!isFinite(e.duration)||e.duration<=0)return void o();e.pause();let l="hold"===r?Math.min(a,Math.max(0,e.duration-.034)):a%e.duration;if(.001>Math.abs(e.currentTime-l)&&e.readyState>=2)return void o();let u=!1,d=!1,c=!1,m=()=>{u||(u=!0,e.removeEventListener("seeked",h),void 0!==i&&(e.cancelVideoFrameCallback?.(i),i=void 0),n&&clearTimeout(n),s&&clearTimeout(s),o())},f=()=>{if(d){if(c){t.set(e,0),m();return}if((t.get(e)??0)>=3)return void m();void 0===s&&(s=setTimeout(()=>{t.set(e,(t.get(e)??0)+1),m()},40))}},h=()=>{d=!0,e.requestVideoFrameCallback?f():setTimeout(m,0)};e.addEventListener("seeked",h,{once:!0}),n=setTimeout(m,3e3);try{let a=e.fastSeek;"1"===e.dataset.motionIntraProxy&&a?a.call(e,l):e.currentTime=l,e.requestVideoFrameCallback&&(i=e.requestVideoFrameCallback.call(e,()=>{i=void 0,c=!0,f()}))}catch{m()}})}let r=new WeakMap;function i(e){return new Promise(a=>{let t;e.pause(),e.loop=!1;try{e.currentTime=0}catch{a();return}if(!e.requestVideoFrameCallback)return void o(e,0).then(a);let r=!1,i=0,n=setTimeout(s,1500);function s(){r||(r=!0,clearTimeout(n),void 0!==t&&e.cancelVideoFrameCallback?.(t),e.pause(),a())}let l=(a,o)=>{t=void 0,++i>=2&&o.mediaTime<=Math.min(.25,e.duration/4)?s():t=e.requestVideoFrameCallback(l)};t=e.requestVideoFrameCallback(l),e.play().catch(s)})}async function n(e){r.delete(e),await i(e),r.set(e,0)}let s=new Map;async function l(e,a){let t=s.get(e);if(t)return t;try{let t=await (await fetch(e)).blob(),o=await fetch(`${a}/api/export`,{method:"PUT",body:t});if(!o.ok)return null;let{url:r}=await o.json();if("string"!=typeof r)return null;return s.set(e,a+r),a+r}catch{return null}}async function u(e,a){let t=[];return await Promise.all([...e.entries()].map(async([e,o])=>{let r=await l(e,a);r&&(t.push({v:o,original:e}),o.pause(),o.dataset.motionIntraProxy="1",o.src=r,await d(o).catch(()=>{}))})),()=>{for(let{v:e,original:a}of t)delete e.dataset.motionIntraProxy,e.src=a,e.load()}}function d(e){return new Promise((a,t)=>{if(e.readyState>=2&&e.videoWidth)return a(e);let o=()=>{i(),a(e)},r=()=>{i(),t(Error("video load failed"))},i=()=>{e.removeEventListener("loadeddata",o),e.removeEventListener("error",r)};e.addEventListener("loadeddata",o,{once:!0}),e.addEventListener("error",r,{once:!0})})}e.s(["advanceVideoForExport",0,function(e,a,t,n="loop"){if(!e.duration||!isFinite(e.duration)||e.duration<=0)return Promise.resolve();let s="hold"===n?Math.min(a,Math.max(0,e.duration-.034)):a%e.duration;if("1"===e.dataset.motionIntraProxy)return r.set(e,s),o(e,s,n);let l=r.get(e)??0,u=.5/Math.max(1,t);return s+u<l?(r.set(e,s),i(e)):(r.set(e,s),e.loop=!1,e.currentTime+u>=s)?Promise.resolve():new Promise(a=>{let t,r,i=!1,l=(l=!1)=>{i||(i=!0,clearTimeout(r),void 0!==t&&e.cancelVideoFrameCallback?.(t),e.pause(),l?o(e,s,n).then(a):a())};r=setTimeout(()=>l(!0),1500);let d=(a,o)=>{t=void 0,o.mediaTime+u>=s?l():e.requestVideoFrameCallback?t=e.requestVideoFrameCallback(d):l(!0)};e.requestVideoFrameCallback?(t=e.requestVideoFrameCallback(d),e.play().catch(()=>l(!0))):l(!0)})},"createCardVideo",0,function(e){let a=document.createElement("video");return a.crossOrigin="anonymous",a.loop=!0,a.muted=!0,a.defaultMuted=!0,a.playsInline=!0,a.autoplay=!0,a.preload="auto",a.src=e,a},"isVideoSource",0,function(e,t){return"video"===t||a.test(e)},"prepareVideoForSequentialExport",0,n,"seekVideoToTime",0,o,"useVideoProxies",0,u,"whenVideoReady",0,d])}]);