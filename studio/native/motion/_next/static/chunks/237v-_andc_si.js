(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,54126,e=>{"use strict";var t=e.i(81107),a=e.i(27076),i=e.i(65654),r=e.i(22558);let s=class e extends i.Shader{constructor(t){super(t={...e.defaultOptions,...t}),this.enabled=!0,this._state=r.State.for2d(),this.blendMode=t.blendMode,this.padding=t.padding,"boolean"==typeof t.antialias?this.antialias=t.antialias?"on":"off":this.antialias=t.antialias,this.resolution=t.resolution,this.blendRequired=t.blendRequired,this.clipToViewport=t.clipToViewport,this.addResource("uTexture",0,1),t.blendRequired&&this.addResource("uBackTexture",0,3)}apply(e,t,a,i){e.applyFilter(this,t,a,i)}get blendMode(){return this._state.blendMode}set blendMode(e){this._state.blendMode=e}static from(i){let r,s,{gpu:n,gl:o,...f}=i;return n&&(r=a.GpuProgram.from(n)),o&&(s=t.GlProgram.from(o)),new e({gpuProgram:r,glProgram:s,...f})}};s.defaultOptions={blendMode:"normal",resolution:1,padding:0,antialias:"off",blendRequired:!1,clipToViewport:!0},e.s(["Filter",0,s])},35066,90532,35656,39391,e=>{"use strict";let t={name:"local-uniform-bit",vertex:{header:`

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `}},a={...t,vertex:{...t.vertex,header:t.vertex.header.replace("group(1)","group(2)")}},i={name:"local-uniform-bit",vertex:{header:`

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `}};e.s(["localUniformBit",0,t,"localUniformBitGl",0,i,"localUniformBitGroup2",0,a],35066);let r={name:"texture-bit",vertex:{header:`

        struct TextureUniforms {
            uTextureMatrix:mat3x3<f32>,
        }

        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
        `,main:`
            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
            @group(2) @binding(0) var uTexture: texture_2d<f32>;
            @group(2) @binding(1) var uSampler: sampler;


        `,main:`
            outColor = textureSample(uTexture, uSampler, vUV);
        `}},s={name:"texture-bit",vertex:{header:`
            uniform mat3 uTextureMatrix;
        `,main:`
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
        uniform sampler2D uTexture;


        `,main:`
            outColor = texture(uTexture, vUV);
        `}};e.s(["textureBit",0,r,"textureBitGl",0,s],90532);var n=e.i(85830),o=e.i(46820);e.s(["ensureAttributes",0,function(e,t){for(let a in e.attributes){let i=e.attributes[a],r=t[a];r?(i.format??(i.format=r.format),i.offset??(i.offset=r.offset),i.instance??(i.instance=r.instance)):(0,n.warn)(`Attribute ${a} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`)}!function(e){let{buffers:t,attributes:a}=e,i={},r={};for(let e in t){let a=t[e];i[a.uid]=0,r[a.uid]=0}for(let e in a){let t=a[e];i[t.buffer.uid]+=(0,o.getAttributeInfoFromFormat)(t.format).stride}for(let e in a){let t=a[e];t.stride??(t.stride=i[t.buffer.uid]),t.start??(t.start=r[t.buffer.uid]),r[t.buffer.uid]+=(0,o.getAttributeInfoFromFormat)(t.format).stride}}(e)}],35656);var f=e.i(96108);let u=[];u[f.STENCIL_MODES.NONE]=void 0,u[f.STENCIL_MODES.DISABLED]={stencilWriteMask:0,stencilReadMask:0},u[f.STENCIL_MODES.RENDERING_MASK_ADD]={stencilFront:{compare:"equal",passOp:"increment-clamp"},stencilBack:{compare:"equal",passOp:"increment-clamp"}},u[f.STENCIL_MODES.RENDERING_MASK_REMOVE]={stencilFront:{compare:"equal",passOp:"decrement-clamp"},stencilBack:{compare:"equal",passOp:"decrement-clamp"}},u[f.STENCIL_MODES.MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"equal",passOp:"keep"},stencilBack:{compare:"equal",passOp:"keep"}},u[f.STENCIL_MODES.INVERSE_MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"not-equal",passOp:"keep"},stencilBack:{compare:"not-equal",passOp:"keep"}},e.s(["GpuStencilModesToPixi",0,u],39391)},41881,69236,e=>{"use strict";var t=e.i(47760),a=e.i(28353);let i={i32:{align:4,size:4},u32:{align:4,size:4},f32:{align:4,size:4},f16:{align:2,size:2},"vec2<i32>":{align:8,size:8},"vec2<u32>":{align:8,size:8},"vec2<f32>":{align:8,size:8},"vec2<f16>":{align:4,size:4},"vec3<i32>":{align:16,size:12},"vec3<u32>":{align:16,size:12},"vec3<f32>":{align:16,size:12},"vec3<f16>":{align:8,size:6},"vec4<i32>":{align:16,size:16},"vec4<u32>":{align:16,size:16},"vec4<f32>":{align:16,size:16},"vec4<f16>":{align:8,size:8},"mat2x2<f32>":{align:8,size:16},"mat2x2<f16>":{align:4,size:8},"mat3x2<f32>":{align:8,size:24},"mat3x2<f16>":{align:4,size:12},"mat4x2<f32>":{align:8,size:32},"mat4x2<f16>":{align:4,size:16},"mat2x3<f32>":{align:16,size:32},"mat2x3<f16>":{align:8,size:16},"mat3x3<f32>":{align:16,size:48},"mat3x3<f16>":{align:8,size:24},"mat4x3<f32>":{align:16,size:64},"mat4x3<f16>":{align:8,size:32},"mat2x4<f32>":{align:16,size:32},"mat2x4<f16>":{align:8,size:16},"mat3x4<f32>":{align:16,size:48},"mat3x4<f16>":{align:8,size:24},"mat4x4<f32>":{align:16,size:64},"mat4x4<f16>":{align:8,size:32}};function r(e){let t=e.map(e=>({data:e,offset:0,size:0})),a=0;for(let e=0;e<t.length;e++){let r=t[e],s=i[r.data.type].size,n=i[r.data.type].align;if(!i[r.data.type])throw Error(`[Pixi.js] WebGPU UniformBuffer: Unknown type ${r.data.type}`);r.data.size>1&&(s=Math.max(s,n)*r.data.size),a=Math.ceil(a/n)*n,r.size=s,r.offset=a,a+=s}return{uboElements:t,size:a=16*Math.ceil(a/16)}}e.s(["WGSL_ALIGN_SIZE_DATA",0,i,"createUboElementsWGSL",0,r],69236);var s=e.i(31873),n=e.i(33156);function o(e,t){let{size:a,align:r}=i[e.data.type],s=(r-a)/4,n=e.data.type.indexOf("i32")>=0?"dataInt32":"data";return`
         v = uv.${e.data.name};
         ${0!==t?`offset += ${t};`:""}

         arrayOffset = offset;

         t = 0;

         for(var i=0; i < ${e.data.size*(a/4)}; i++)
         {
             for(var j = 0; j < ${a/4}; j++)
             {
                 ${n}[arrayOffset++] = v[t++];
             }
             ${0!==s?`arrayOffset += ${s};`:""}
         }
     `}function f(e){return(0,s.createUboSyncFunction)(e,"uboWgsl",o,n.uboSyncFunctionsWGSL)}class u extends a.UboSystem{constructor(){super({createUboElements:r,generateUboSync:f})}}u.extension={type:[t.ExtensionType.WebGPUSystem],name:"ubo"},e.s(["GpuUboSystem",0,u],41881)},28353,92715,31873,33156,87784,e=>{"use strict";var t=e.i(55364),a=e.i(85465),i=e.i(64957);e.s(["UboSystem",0,class{constructor(e){this._syncFunctionHash=Object.create(null),this._adaptor=e,this._systemCheck()}_systemCheck(){if(!(0,t.unsafeEvalSupported)())throw Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}ensureUniformGroup(e){let t=this.getUniformGroupData(e);e.buffer||(e.buffer=new a.Buffer({data:new Float32Array(t.layout.size/4),usage:i.BufferUsage.UNIFORM|i.BufferUsage.COPY_DST}))}getUniformGroupData(e){return this._syncFunctionHash[e._signature]||this._initUniformGroup(e)}_initUniformGroup(e){let t=e._signature,a=this._syncFunctionHash[t];if(!a){let i=Object.keys(e.uniformStructures).map(t=>e.uniformStructures[t]),r=this._adaptor.createUboElements(i),s=this._generateUboSync(r.uboElements);a=this._syncFunctionHash[t]={layout:r,syncFunction:s}}return this._syncFunctionHash[t]}_generateUboSync(e){return this._adaptor.generateUboSync(e)}syncUniformGroup(e,t,r){let s=this.getUniformGroupData(e);e.buffer||(e.buffer=new a.Buffer({data:new Float32Array(s.layout.size/4),usage:i.BufferUsage.UNIFORM|i.BufferUsage.COPY_DST}));let n=null;return t||(t=e.buffer.data,n=e.buffer.dataInt32),r||(r=0),s.syncFunction(e.uniforms,t,n,r),!0}updateUniformGroup(e){if(e.isStatic&&!e._dirtyId)return!1;e._dirtyId=0;let t=this.syncUniformGroup(e);return e.buffer.update(),t}destroy(){this._syncFunctionHash=null}}],28353);let r=[{type:"mat3x3<f32>",test:e=>void 0!==e.value.a,ubo:`
            var matrix = uv[name].toArray(true);
            data[offset] = matrix[0];
            data[offset + 1] = matrix[1];
            data[offset + 2] = matrix[2];
            data[offset + 4] = matrix[3];
            data[offset + 5] = matrix[4];
            data[offset + 6] = matrix[5];
            data[offset + 8] = matrix[6];
            data[offset + 9] = matrix[7];
            data[offset + 10] = matrix[8];
        `,uniform:`
            gl.uniformMatrix3fv(ud[name].location, false, uv[name].toArray(true));
        `},{type:"vec4<f32>",test:e=>"vec4<f32>"===e.type&&1===e.size&&void 0!==e.value.width,ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
            data[offset + 2] = v.width;
            data[offset + 3] = v.height;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {
                cv[0] = v.x;
                cv[1] = v.y;
                cv[2] = v.width;
                cv[3] = v.height;
                gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);
            }
        `},{type:"vec2<f32>",test:e=>"vec2<f32>"===e.type&&1===e.size&&void 0!==e.value.x,ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y) {
                cv[0] = v.x;
                cv[1] = v.y;
                gl.uniform2f(ud[name].location, v.x, v.y);
            }
        `},{type:"vec4<f32>",test:e=>"vec4<f32>"===e.type&&1===e.size&&void 0!==e.value.red,ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
            data[offset + 3] = v.alpha;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                cv[3] = v.alpha;
                gl.uniform4f(ud[name].location, v.red, v.green, v.blue, v.alpha);
            }
        `},{type:"vec3<f32>",test:e=>"vec3<f32>"===e.type&&1===e.size&&void 0!==e.value.red,ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                gl.uniform3f(ud[name].location, v.red, v.green, v.blue);
            }
        `}];function s(e,t){return`
        for (let i = 0; i < ${e*t}; i++) {
            data[offset + (((i / ${e})|0) * 4) + (i % ${e})] = v[i];
        }
    `}e.s(["uniformParsers",0,r],92715),e.s(["createUboSyncFunction",0,function(e,t,a,i){let s=[`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `],n=0;for(let o=0;o<e.length;o++){let f=e[o],u=f.data.name,l=!1,v=0;for(let e=0;e<r.length;e++)if(r[e].test(f.data)){v=f.offset/4,s.push(`name = "${u}";`,`offset += ${v-n};`,r[e][t]||r[e].ubo),l=!0;break}if(!l)if(f.data.size>1)v=f.offset/4,s.push(a(f,v-n));else{let e=i[f.data.type];v=f.offset/4,s.push(`
                    v = uv.${u};
                    offset += ${v-n};
                    ${e};
                `)}n=v}return Function("uv","data","dataInt32","offset",s.join("\n"))}],31873);let n={f32:`
        data[offset] = v;`,i32:`
        dataInt32[offset] = v;`,"vec2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];`,"vec3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];`,"vec4<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];`,"vec2<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];`,"vec3<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];`,"vec4<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];
        dataInt32[offset + 3] = v[3];`,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 4] = v[2];
        data[offset + 5] = v[3];`,"mat3x3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];`,"mat4x4<f32>":`
        for (let i = 0; i < 16; i++) {
            data[offset + i] = v[i];
        }`,"mat3x2<f32>":s(3,2),"mat4x2<f32>":s(4,2),"mat2x3<f32>":s(2,3),"mat4x3<f32>":s(4,3),"mat2x4<f32>":s(2,4),"mat3x4<f32>":s(3,4)},o={...n,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `};e.s(["uboSyncFunctionsSTD40",0,n,"uboSyncFunctionsWGSL",0,o],33156);var f=e.i(95932),u=e.i(24314);class l extends f.default{constructor({buffer:e,offset:t,size:a}){super(),this.uid=(0,u.uid)("buffer"),this._resourceType="bufferResource",this._touched=0,this._resourceId=(0,u.uid)("resource"),this._bufferResource=!0,this.destroyed=!1,this.buffer=e,this.offset=0|t,this.size=a,this.buffer.on("change",this.onBufferChange,this)}onBufferChange(){this._resourceId=(0,u.uid)("resource"),this.emit("change",this)}destroy(e=!1){this.destroyed=!0,e&&this.buffer.destroy(),this.emit("change",this),this.buffer=null,this.removeAllListeners()}}e.s(["BufferResource",0,l],87784)},81735,e=>{"use strict";var t=e.i(27402),a=e.i(61411),i=e.i(48446);let r=new class{constructor(e){this._canvasPool=Object.create(null),this.canvasOptions=e||{},this.enableFullScreen=!1}_createCanvasAndContext(e,a){let i=t.DOMAdapter.get().createCanvas();i.width=e,i.height=a;let r=i.getContext("2d");return{canvas:i,context:r}}getOptimalCanvasAndContext(e,t,i=1){e=Math.ceil(e*i-1e-6),t=Math.ceil(t*i-1e-6),e=(0,a.nextPow2)(e),t=(0,a.nextPow2)(t);let r=(e<<17)+(t<<1);this._canvasPool[r]||(this._canvasPool[r]=[]);let s=this._canvasPool[r].pop();return s||(s=this._createCanvasAndContext(e,t)),s}returnCanvasAndContext(e){let{width:t,height:a}=e.canvas,i=(t<<17)+(a<<1);e.context.resetTransform(),e.context.clearRect(0,0,t,a),this._canvasPool[i].push(e)}clear(){this._canvasPool={}}};i.GlobalResourceRegistry.register(r),e.s(["CanvasPool",0,r])},40766,e=>{"use strict";e.s(["BatchableSprite",0,class{constructor(){this.batcherName="default",this.topology="triangle-list",this.attributeSize=4,this.indexSize=6,this.packAsQuad=!0,this.roundPixels=0,this._attributeStart=0,this._batcher=null,this._batch=null}get blendMode(){return this.renderable.groupBlendMode}get color(){return this.renderable.groupColorAlpha}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.bounds=null}destroy(){this.reset()}}])}]);