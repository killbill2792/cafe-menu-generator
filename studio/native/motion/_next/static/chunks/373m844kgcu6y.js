(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,41303,e=>{"use strict";var t=e.i(47760);let r=[];async function i(e){if(!e)for(let e=0;e<r.length;e++){let t=r[e];if(t.value.test())return void await t.value.load()}}t.extensions.handleByNamedList(t.ExtensionType.Environment,r),e.s(["loadEnvironmentExtensions",0,i])},87323,37024,18102,96108,60728,28028,45284,e=>{"use strict";var t,r=e.i(24314);class i{constructor(e){"number"==typeof e?this.rawBinaryData=new ArrayBuffer(e):e instanceof Uint8Array?this.rawBinaryData=e.buffer:this.rawBinaryData=e,this.uint32View=new Uint32Array(this.rawBinaryData),this.float32View=new Float32Array(this.rawBinaryData),this.size=this.rawBinaryData.byteLength}get int8View(){return this._int8View||(this._int8View=new Int8Array(this.rawBinaryData)),this._int8View}get uint8View(){return this._uint8View||(this._uint8View=new Uint8Array(this.rawBinaryData)),this._uint8View}get int16View(){return this._int16View||(this._int16View=new Int16Array(this.rawBinaryData)),this._int16View}get int32View(){return this._int32View||(this._int32View=new Int32Array(this.rawBinaryData)),this._int32View}get float64View(){return this._float64Array||(this._float64Array=new Float64Array(this.rawBinaryData)),this._float64Array}get bigUint64View(){return this._bigUint64Array||(this._bigUint64Array=new BigUint64Array(this.rawBinaryData)),this._bigUint64Array}view(e){return this[`${e}View`]}destroy(){this.rawBinaryData=null,this.uint32View=null,this.float32View=null,this.uint16View=null,this._int8View=null,this._uint8View=null,this._int16View=null,this._int32View=null,this._float64Array=null,this._bigUint64Array=null}static sizeOf(e){switch(e){case"int8":case"uint8":return 1;case"int16":case"uint16":return 2;case"int32":case"uint32":case"float32":return 4;default:throw Error(`${e} isn't a valid view type`)}}}e.s(["ViewableBuffer",0,i],37024);var a=e.i(49864),n=e.i(48446);function s(e,t,r,i){if(r??(r=0),i??(i=Math.min(e.byteLength-r,t.byteLength)),7&r||7&i)if(3&r||3&i)new Uint8Array(t).set(new Uint8Array(e,r,i));else{let a=i/4;new Float32Array(t,0,a).set(new Float32Array(e,r,a))}else{let a=i/8;new Float64Array(t,0,a).set(new Float64Array(e,r,a))}}e.s(["fastCopy",0,s],18102);let o={normal:"normal-npm",add:"add-npm",screen:"screen-npm"};var u=((t=u||{})[t.DISABLED=0]="DISABLED",t[t.RENDERING_MASK_ADD=1]="RENDERING_MASK_ADD",t[t.MASK_ACTIVE=2]="MASK_ACTIVE",t[t.INVERSE_MASK_ACTIVE=3]="INVERSE_MASK_ACTIVE",t[t.RENDERING_MASK_REMOVE=4]="RENDERING_MASK_REMOVE",t[t.NONE=5]="NONE",t);function l(e,t){return"no-premultiply-alpha"===t.alphaMode&&o[e]||e}e.s(["BLEND_TO_NPM",0,o,"STENCIL_MODES",0,u],96108),e.s(["getAdjustedBlendModeBlend",0,l],60728);var f=e.i(29281);function h(e,t){if(0===e)throw Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");let r=t.createShader(t.FRAGMENT_SHADER);try{for(;;){let i="precision mediump float;\nvoid main(void){\nfloat test = 0.1;\n%forloop%\ngl_FragColor = vec4(0.0);\n}".replace(/%forloop%/gi,function(e){let t="";for(let r=0;r<e;++r)r>0&&(t+="\nelse "),r<e-1&&(t+=`if(test == ${r}.0){}`);return t}(e));if(t.shaderSource(r,i),t.compileShader(r),t.getShaderParameter(r,t.COMPILE_STATUS))break;e=e/2|0}}finally{t.deleteShader(r)}return e}e.s(["checkMaxIfStatementsInShader",0,h],28028);let d=null;class c{constructor(){this.ids=Object.create(null),this.textures=[],this.count=0}clear(){for(let e=0;e<this.count;e++){let t=this.textures[e];this.textures[e]=null,this.ids[t.uid]=null}this.count=0}}class v{constructor(){this.renderPipeId="batch",this.action="startBatch",this.start=0,this.size=0,this.textures=new c,this.blendMode="normal",this.topology="triangle-strip",this.canBundle=!0}destroy(){this.textures=null,this.gpuBindGroup=null,this.bindGroup=null,this.batcher=null,this.elements=null}}let m=[],x=0;function p(){return x>0?m[--x]:new v}function b(e){e.elements=null,m[x++]=e}n.GlobalResourceRegistry.register({clear:()=>{if(m.length>0)for(let e of m)e&&e.destroy();m.length=0,x=0}});let g=0,_=class e{constructor(t){this.uid=(0,r.uid)("batcher"),this.dirty=!0,this.batchIndex=0,this.batches=[],this._elements=[],(t={...e.defaultOptions,...t}).maxTextures||((0,a.deprecation)("v8.8.0","maxTextures is a required option for Batcher now, please pass it in the options"),t.maxTextures=function(){if(d)return d;let e=(0,f.getTestContext)();return d=h(d=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),e),e.getExtension("WEBGL_lose_context")?.loseContext(),d}());const{maxTextures:n,attributesInitialSize:s,indicesInitialSize:o}=t;this.attributeBuffer=new i(4*s),this.indexBuffer=new Uint16Array(o),this.maxTextures=n}begin(){this.elementSize=0,this.elementStart=0,this.indexSize=0,this.attributeSize=0;for(let e=0;e<this.batchIndex;e++)b(this.batches[e]);this.batchIndex=0,this._batchIndexStart=0,this._batchIndexSize=0,this.dirty=!0}add(e){this._elements[this.elementSize++]=e,e._indexStart=this.indexSize,e._attributeStart=this.attributeSize,e._batcher=this,this.indexSize+=e.indexSize,this.attributeSize+=e.attributeSize*this.vertexSize}checkAndUpdateTexture(e,t){let r=e._batch.textures.ids[t._source.uid];return(!!r||0===r)&&(e._textureId=r,e.texture=t,!0)}updateElement(e){this.dirty=!0;let t=this.attributeBuffer;e.packAsQuad?this.packQuadAttributes(e,t.float32View,t.uint32View,e._attributeStart,e._textureId):this.packAttributes(e,t.float32View,t.uint32View,e._attributeStart,e._textureId)}break(e){let t=this._elements;if(!t[this.elementStart])return;let r=p(),i=r.textures;i.clear();let a=t[this.elementStart],n=l(a.blendMode,a.texture._source),s=a.topology;4*this.attributeSize>this.attributeBuffer.size&&this._resizeAttributeBuffer(4*this.attributeSize),this.indexSize>this.indexBuffer.length&&this._resizeIndexBuffer(this.indexSize);let o=this.attributeBuffer.float32View,u=this.attributeBuffer.uint32View,f=this.indexBuffer,h=this._batchIndexSize,d=this._batchIndexStart,c="startBatch",v=[],m=this.maxTextures;for(let a=this.elementStart;a<this.elementSize;++a){let x=t[a];t[a]=null;let b=x.texture._source,_=l(x.blendMode,b),y=n!==_||s!==x.topology;if(b._batchTick===g&&!y){x._textureId=b._textureBindLocation,h+=x.indexSize,x.packAsQuad?(this.packQuadAttributes(x,o,u,x._attributeStart,x._textureId),this.packQuadIndex(f,x._indexStart,x._attributeStart/this.vertexSize)):(this.packAttributes(x,o,u,x._attributeStart,x._textureId),this.packIndex(x,f,x._indexStart,x._attributeStart/this.vertexSize)),x._batch=r,v.push(x);continue}b._batchTick=g,(i.count>=m||y)&&(this._finishBatch(r,d,h-d,i,n,s,e,c,v),c="renderBatch",d=h,n=_,s=x.topology,(i=(r=p()).textures).clear(),v=[],++g),x._textureId=b._textureBindLocation=i.count,i.ids[b.uid]=i.count,i.textures[i.count++]=b,x._batch=r,v.push(x),h+=x.indexSize,x.packAsQuad?(this.packQuadAttributes(x,o,u,x._attributeStart,x._textureId),this.packQuadIndex(f,x._indexStart,x._attributeStart/this.vertexSize)):(this.packAttributes(x,o,u,x._attributeStart,x._textureId),this.packIndex(x,f,x._indexStart,x._attributeStart/this.vertexSize))}i.count>0&&(this._finishBatch(r,d,h-d,i,n,s,e,c,v),d=h,++g),this.elementStart=this.elementSize,this._batchIndexStart=d,this._batchIndexSize=h}_finishBatch(e,t,r,i,a,n,s,o,u){e.gpuBindGroup=null,e.bindGroup=null,e.action=o,e.batcher=this,e.textures=i,e.blendMode=a,e.topology=n,e.start=t,e.size=r,e.elements=u,++g,this.batches[this.batchIndex++]=e,s.add(e)}finish(e){this.break(e)}ensureAttributeBuffer(e){4*e<=this.attributeBuffer.size||this._resizeAttributeBuffer(4*e)}ensureIndexBuffer(e){e<=this.indexBuffer.length||this._resizeIndexBuffer(e)}_resizeAttributeBuffer(e){let t=new i(Math.max(e,2*this.attributeBuffer.size));s(this.attributeBuffer.rawBinaryData,t.rawBinaryData),this.attributeBuffer=t}_resizeIndexBuffer(e){let t=this.indexBuffer,r=Math.max(e,1.5*t.length);r+=r%2;let i=r>65535?new Uint32Array(r):new Uint16Array(r);if(i.BYTES_PER_ELEMENT!==t.BYTES_PER_ELEMENT)for(let e=0;e<t.length;e++)i[e]=t[e];else s(t.buffer,i.buffer);this.indexBuffer=i}packQuadIndex(e,t,r){e[t]=r+0,e[t+1]=r+1,e[t+2]=r+2,e[t+3]=r+0,e[t+4]=r+2,e[t+5]=r+3}packIndex(e,t,r,i){let a=e.indices,n=e.indexSize,s=e.indexOffset,o=e.attributeOffset;for(let e=0;e<n;e++)t[r++]=i+a[e+s]-o}destroy(e={}){if(null!==this.batches){for(let e=0;e<this.batchIndex;e++)b(this.batches[e]);this.batches=null,this.geometry.destroy(!0),this.geometry=null,e.shader&&(this.shader?.destroy(),this.shader=null);for(let e=0;e<this._elements.length;e++)this._elements[e]&&(this._elements[e]._batch=null);this._elements=null,this.indexBuffer=null,this.attributeBuffer.destroy(),this.attributeBuffer=null}}};_.defaultOptions={maxTextures:null,attributesInitialSize:4,indicesInitialSize:6},e.s(["Batcher",0,_],87323);var y=e.i(85465),S=e.i(64957),w=e.i(60406);let I=new Float32Array(1),B=new Uint32Array(1);class T extends w.Geometry{constructor(){const e=new y.Buffer({data:I,label:"attribute-batch-buffer",usage:S.BufferUsage.VERTEX|S.BufferUsage.COPY_DST,shrinkToFit:!1});super({attributes:{aPosition:{buffer:e,format:"float32x2",stride:24,offset:0},aUV:{buffer:e,format:"float32x2",stride:24,offset:8},aColor:{buffer:e,format:"unorm8x4",stride:24,offset:16},aTextureIdAndRound:{buffer:e,format:"uint16x2",stride:24,offset:20}},indexBuffer:new y.Buffer({data:B,label:"index-batch-buffer",usage:S.BufferUsage.INDEX|S.BufferUsage.COPY_DST,shrinkToFit:!1})})}}e.s(["BatchGeometry",0,T],45284)},97828,e=>{"use strict";var t=e.i(47760),r=e.i(87323),i=e.i(45284),a=e.i(81491),n=e.i(68372),s=e.i(94111),o=e.i(55443),u=e.i(77953),l=e.i(65654);class f extends l.Shader{constructor(e){super({glProgram:(0,a.compileHighShaderGlProgram)({name:"batch",bits:[n.colorBitGl,(0,s.generateTextureBatchBitGl)(e),o.roundPixelsBitGl]}),gpuProgram:(0,a.compileHighShaderGpuProgram)({name:"batch",bits:[n.colorBit,(0,s.generateTextureBatchBit)(e),o.roundPixelsBit]}),resources:{batchSamplers:(0,u.getBatchSamplersUniformGroup)(e)}}),this.maxTextures=e}}let h=null,d=class e extends r.Batcher{constructor(t){super(t),this.geometry=new i.BatchGeometry,this.name=e.extension.name,this.vertexSize=6,h??(h=new f(t.maxTextures)),this.shader=h}packAttributes(e,t,r,i,a){let n=a<<16|65535&e.roundPixels,s=e.transform,o=s.a,u=s.b,l=s.c,f=s.d,h=s.tx,d=s.ty,{positions:c,uvs:v}=e,m=e.color,x=e.attributeOffset,p=x+e.attributeSize;for(let e=x;e<p;e++){let a=2*e,s=c[a],x=c[a+1];t[i++]=o*s+l*x+h,t[i++]=f*x+u*s+d,t[i++]=v[a],t[i++]=v[a+1],r[i++]=m,r[i++]=n}}packQuadAttributes(e,t,r,i,a){let n=e.texture,s=e.transform,o=s.a,u=s.b,l=s.c,f=s.d,h=s.tx,d=s.ty,c=e.bounds,v=c.maxX,m=c.minX,x=c.maxY,p=c.minY,b=n.uvs,g=e.color,_=a<<16|65535&e.roundPixels;t[i+0]=o*m+l*p+h,t[i+1]=f*p+u*m+d,t[i+2]=b.x0,t[i+3]=b.y0,r[i+4]=g,r[i+5]=_,t[i+6]=o*v+l*p+h,t[i+7]=f*p+u*v+d,t[i+8]=b.x1,t[i+9]=b.y1,r[i+10]=g,r[i+11]=_,t[i+12]=o*v+l*x+h,t[i+13]=f*x+u*v+d,t[i+14]=b.x2,t[i+15]=b.y2,r[i+16]=g,r[i+17]=_,t[i+18]=o*m+l*x+h,t[i+19]=f*x+u*m+d,t[i+20]=b.x3,t[i+21]=b.y3,r[i+22]=g,r[i+23]=_}_updateMaxTextures(e){this.shader.maxTextures!==e&&(h=new f(e),this.shader=h)}destroy(){this.shader=null,super.destroy()}};d.extension={type:[t.ExtensionType.Batcher],name:"default"},e.s(["DefaultBatcher",0,d],97828)},81491,68372,94111,55443,e=>{"use strict";var t=e.i(81107),r=e.i(27076),i=e.i(85830);function a(e,t,r){if(e)for(let a in e){let n=t[a.toLocaleLowerCase()];if(n){let t=e[a];"header"===a&&(t=t.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),r&&n.push(`//----${r}----//`),n.push(t)}else(0,i.warn)(`${a} placement hook does not exist in shader`)}}let n=/\{\{(.*?)\}\}/g;function s(e){let t={};return(e.match(n)?.map(e=>e.replace(/[{()}]/g,""))??[]).forEach(e=>{t[e]=[]}),t}function o(e,t){let r,i=/@in\s+([^;]+);/g;for(;null!==(r=i.exec(e));)t.push(r[1])}function u(e,t,r=!1){let i=[];o(t,i),e.forEach(e=>{e.header&&o(e.header,i)}),r&&i.sort();let a=i.map((e,t)=>`       @location(${t}) ${e},`).join("\n"),n=t.replace(/@in\s+[^;]+;\s*/g,"");return n.replace("{{in}}",`
${a}
`)}function l(e,t){let r,i=/@out\s+([^;]+);/g;for(;null!==(r=i.exec(e));)t.push(r[1])}function f(e,t){let r=e;for(let e in t){let i=t[e];r=i.join("\n").length?r.replace(`{{${e}}}`,`//-----${e} START-----//
${i.join("\n")}
//----${e} FINISH----//`):r.replace(`{{${e}}}`,"")}return r}let h=Object.create(null),d=new Map,c=0;function v(e,t){return t.map(e=>(d.has(e)||d.set(e,c++),d.get(e))).sort((e,t)=>e-t).join("-")+e.vertex+e.fragment}function m(e,t,r){let i=s(e),n=s(t);return r.forEach(e=>{a(e.vertex,i,e.name),a(e.fragment,n,e.name)}),{vertex:f(e,i),fragment:f(t,n)}}let x=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}

        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);

        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,p=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;

    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {

        {{start}}

        var outColor:vec4<f32>;

        {{main}}

        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`,b=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;

        {{start}}

        vColor = vec4(1.);

        {{main}}

        vUV = uv;

        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,g=`

    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {

        {{start}}

        vec4 outColor;

        {{main}}

        finalColor = outColor * vColor;

        {{end}}
    }
`,_={name:"global-uniforms-bit",vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}},y={name:"global-uniforms-bit",vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}};e.s(["compileHighShaderGlProgram",0,function({bits:e,name:r}){return new t.GlProgram({name:r,...function({template:e,bits:t}){let r=v(e,t);return h[r]||(h[r]=m(e.vertex,e.fragment,t)),h[r]}({template:{vertex:b,fragment:g},bits:[y,...e]})})},"compileHighShaderGpuProgram",0,function({bits:e,name:t}){let i=function({template:e,bits:t}){let r=v(e,t);if(h[r])return h[r];let{vertex:i,fragment:a}=function(e,t){var r;let i,a,n,s,o,f=t.map(e=>e.vertex).filter(e=>!!e),h=t.map(e=>e.fragment).filter(e=>!!e),d=u(f,e.vertex,!0);return i=[],l(r=d,i),f.forEach(e=>{e.header&&l(e.header,i)}),a=0,n=i.sort().map(e=>e.indexOf("builtin")>-1?e:`@location(${a++}) ${e}`).join(",\n"),s=i.sort().map(e=>`       var ${e.replace(/@.*?\s+/g,"")};`).join("\n"),o=`return VSOutput(
            ${i.sort().map(e=>{let t;return` ${(t=/\b(\w+)\s*:/g.exec(e))?t[1]:""}`}).join(",\n")});`,{vertex:d=r.replace(/@out\s+[^;]+;\s*/g,"").replace("{{struct}}",`
${n}
`).replace("{{start}}",`
${s}
`).replace("{{return}}",`
${o}
`),fragment:u(h,e.fragment,!0)}}(e,t);return h[r]=m(i,a,t),h[r]}({template:{fragment:p,vertex:x},bits:[_,...e]});return r.GpuProgram.from({name:t,vertex:{source:i.vertex,entryPoint:"main"},fragment:{source:i.fragment,entryPoint:"main"}})}],81491);let S={name:"color-bit",vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},w={name:"color-bit",vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}};e.s(["colorBit",0,S,"colorBitGl",0,w],68372);let I={},B={};e.s(["generateTextureBatchBit",0,function(e){return I[e]||(I[e]={name:"texture-batch-bit",vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;

                ${function(e){let t=[];if(1===e)t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"),t.push("@group(1) @binding(1) var textureSampler1: sampler;");else{let r=0;for(let i=0;i<e;i++)t.push(`@group(1) @binding(${r++}) var textureSource${i+1}: texture_2d<f32>;`),t.push(`@group(1) @binding(${r++}) var textureSampler${i+1}: sampler;`)}return t.join("\n")}(e)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${function(e){let t=[];if(1===e)t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");else{t.push("switch vTextureId {");for(let r=0;r<e;r++)r===e-1?t.push("  default:{"):t.push(`  case ${r}:{`),t.push(`      outColor = textureSampleGrad(textureSource${r+1}, textureSampler${r+1}, vUV, uvDx, uvDy);`),t.push("      break;}");t.push("}")}return t.join("\n")}(e)}
            `}}),I[e]},"generateTextureBatchBitGl",0,function(e){return B[e]||(B[e]={name:"texture-batch-bit",vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;

                uniform sampler2D uTextures[${e}];

            `,main:`

                ${function(e){let t=[];for(let r=0;r<e;r++)r>0&&t.push("else"),r<e-1&&t.push(`if(vTextureId < ${r}.5)`),t.push("{"),t.push(`	outColor = texture(uTextures[${r}], vUV);`),t.push("}");return t.join("\n")}(e)}
            `}}),B[e]}],94111);let T={name:"round-pixels-bit",vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},A={name:"round-pixels-bit",vertex:{header:`
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}};e.s(["roundPixelsBit",0,T,"roundPixelsBitGl",0,A],55443)},77953,e=>{"use strict";var t=e.i(32543);let r={};e.s(["getBatchSamplersUniformGroup",0,function(e){let i=r[e];if(i)return i;let a=new Int32Array(e);for(let t=0;t<e;t++)a[t]=t;return r[e]=new t.UniformGroup({uTextures:{value:a,type:"i32",size:e}},{isStatic:!0})}])},28353,92715,31873,33156,87784,e=>{"use strict";var t=e.i(55364),r=e.i(85465),i=e.i(64957);e.s(["UboSystem",0,class{constructor(e){this._syncFunctionHash=Object.create(null),this._adaptor=e,this._systemCheck()}_systemCheck(){if(!(0,t.unsafeEvalSupported)())throw Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}ensureUniformGroup(e){let t=this.getUniformGroupData(e);e.buffer||(e.buffer=new r.Buffer({data:new Float32Array(t.layout.size/4),usage:i.BufferUsage.UNIFORM|i.BufferUsage.COPY_DST}))}getUniformGroupData(e){return this._syncFunctionHash[e._signature]||this._initUniformGroup(e)}_initUniformGroup(e){let t=e._signature,r=this._syncFunctionHash[t];if(!r){let i=Object.keys(e.uniformStructures).map(t=>e.uniformStructures[t]),a=this._adaptor.createUboElements(i),n=this._generateUboSync(a.uboElements);r=this._syncFunctionHash[t]={layout:a,syncFunction:n}}return this._syncFunctionHash[t]}_generateUboSync(e){return this._adaptor.generateUboSync(e)}syncUniformGroup(e,t,a){let n=this.getUniformGroupData(e);e.buffer||(e.buffer=new r.Buffer({data:new Float32Array(n.layout.size/4),usage:i.BufferUsage.UNIFORM|i.BufferUsage.COPY_DST}));let s=null;return t||(t=e.buffer.data,s=e.buffer.dataInt32),a||(a=0),n.syncFunction(e.uniforms,t,s,a),!0}updateUniformGroup(e){if(e.isStatic&&!e._dirtyId)return!1;e._dirtyId=0;let t=this.syncUniformGroup(e);return e.buffer.update(),t}destroy(){this._syncFunctionHash=null}}],28353);let a=[{type:"mat3x3<f32>",test:e=>void 0!==e.value.a,ubo:`
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
        `}];function n(e,t){return`
        for (let i = 0; i < ${e*t}; i++) {
            data[offset + (((i / ${e})|0) * 4) + (i % ${e})] = v[i];
        }
    `}e.s(["uniformParsers",0,a],92715),e.s(["createUboSyncFunction",0,function(e,t,r,i){let n=[`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `],s=0;for(let o=0;o<e.length;o++){let u=e[o],l=u.data.name,f=!1,h=0;for(let e=0;e<a.length;e++)if(a[e].test(u.data)){h=u.offset/4,n.push(`name = "${l}";`,`offset += ${h-s};`,a[e][t]||a[e].ubo),f=!0;break}if(!f)if(u.data.size>1)h=u.offset/4,n.push(r(u,h-s));else{let e=i[u.data.type];h=u.offset/4,n.push(`
                    v = uv.${l};
                    offset += ${h-s};
                    ${e};
                `)}s=h}return Function("uv","data","dataInt32","offset",n.join("\n"))}],31873);let s={f32:`
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
        }`,"mat3x2<f32>":n(3,2),"mat4x2<f32>":n(4,2),"mat2x3<f32>":n(2,3),"mat4x3<f32>":n(4,3),"mat2x4<f32>":n(2,4),"mat3x4<f32>":n(3,4)},o={...s,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `};e.s(["uboSyncFunctionsSTD40",0,s,"uboSyncFunctionsWGSL",0,o],33156);var u=e.i(95932),l=e.i(24314);class f extends u.default{constructor({buffer:e,offset:t,size:r}){super(),this.uid=(0,l.uid)("buffer"),this._resourceType="bufferResource",this._touched=0,this._resourceId=(0,l.uid)("resource"),this._bufferResource=!0,this.destroyed=!1,this.buffer=e,this.offset=0|t,this.size=r,this.buffer.on("change",this.onBufferChange,this)}onBufferChange(){this._resourceId=(0,l.uid)("resource"),this.emit("change",this)}destroy(e=!1){this.destroyed=!0,e&&this.buffer.destroy(),this.emit("change",this),this.buffer=null,this.removeAllListeners()}}e.s(["BufferResource",0,f],87784)},2351,69510,3197,e=>{"use strict";var t,r=e.i(57471),i=e.i(41303),a=e.i(50147),n=e.i(55364),s=e.i(24314),o=e.i(49864),u=e.i(48446),l=((t=l||{})[t.NONE=0]="NONE",t[t.COLOR=16384]="COLOR",t[t.STENCIL=1024]="STENCIL",t[t.DEPTH=256]="DEPTH",t[t.COLOR_DEPTH=16640]="COLOR_DEPTH",t[t.COLOR_STENCIL=17408]="COLOR_STENCIL",t[t.DEPTH_STENCIL=1280]="DEPTH_STENCIL",t[t.ALL=17664]="ALL",t);e.s(["CLEAR",0,l],69510);class f{constructor(e){this.items=[],this._name=e}emit(e,t,r,i,a,n,s,o){let{name:u,items:l}=this;for(let f=0,h=l.length;f<h;f++)l[f][u](e,t,r,i,a,n,s,o);return this}add(e){return e[this._name]&&(this.remove(e),this.items.push(e)),this}remove(e){let t=this.items.indexOf(e);return -1!==t&&this.items.splice(t,1),this}contains(e){return -1!==this.items.indexOf(e)}removeAll(){return this.items.length=0,this}destroy(){this.removeAll(),this.items=null,this._name=null}get empty(){return 0===this.items.length}get name(){return this._name}}e.s(["SystemRunner",0,f],3197);var h=e.i(95932);let d=["init","destroy","contextChange","resolutionChange","resetState","renderEnd","renderStart","render","update","postrender","prerender"],c=class e extends h.default{constructor(e){super(),this.tick=0,this.uid=(0,s.uid)("renderer"),this.runners=Object.create(null),this.renderPipes=Object.create(null),this._initOptions={},this._systemsHash=Object.create(null),this.type=e.type,this.name=e.name,this.config=e;const t=[...d,...this.config.runners??[]];this._addRunners(...t),this._unsafeEvalCheck()}async init(t={}){let r=!0===t.skipExtensionImports||!1===t.manageImports;for(let e in await (0,i.loadEnvironmentExtensions)(r),this._addSystems(this.config.systems),this._addPipes(this.config.renderPipes,this.config.renderPipeAdaptors),this._systemsHash)t={...this._systemsHash[e].constructor.defaultOptions,...t};t={...e.defaultOptions,...t},this._roundPixels=+!!t.roundPixels;for(let e=0;e<this.runners.init.items.length;e++)await this.runners.init.items[e].init(t);this._initOptions=t}render(e,t){this.tick++;let i=e;if(i instanceof a.Container&&(i={container:i},t&&((0,o.deprecation)(o.v8_0_0,"passing a second argument is deprecated, please use render options instead"),i.target=t.renderTexture)),i.target||(i.target=this.view.renderTarget),i.target===this.view.renderTarget&&(this._lastObjectRendered=i.container,i.clearColor??(i.clearColor=this.background.colorRgba),i.clear??(i.clear=this.background.clearBeforeRender)),i.clearColor){let e=Array.isArray(i.clearColor)&&4===i.clearColor.length;i.clearColor=e?i.clearColor:r.Color.shared.setValue(i.clearColor).toArray()}i.transform||(i.container.updateLocalTransform(),i.transform=i.container.localTransform),i.container.visible&&(i.container.enableRenderGroup(),this.runners.prerender.emit(i),this.runners.renderStart.emit(i),this.runners.render.emit(i),this.runners.renderEnd.emit(i),this.runners.postrender.emit(i))}resize(e,t,r){let i=this.view.resolution;this.view.resize(e,t,r),this.emit("resize",this.view.screen.width,this.view.screen.height,this.view.resolution),void 0!==r&&r!==i&&this.runners.resolutionChange.emit(r)}clear(e={}){e.target||(e.target=this.renderTarget.renderTarget),e.clearColor||(e.clearColor=this.background.colorRgba),e.clear??(e.clear=l.ALL);let{clear:t,clearColor:i,target:a,mipLevel:n,layer:s}=e;r.Color.shared.setValue(i??this.background.colorRgba),this.renderTarget.clear(a,t,r.Color.shared.toArray(),n??0,s??0)}get resolution(){return this.view.resolution}set resolution(e){this.view.resolution=e,this.runners.resolutionChange.emit(e)}get width(){return this.view.texture.frame.width}get height(){return this.view.texture.frame.height}get canvas(){return this.view.canvas}get lastObjectRendered(){return this._lastObjectRendered}get renderingToScreen(){return this.renderTarget.renderingToScreen}get screen(){return this.view.screen}_addRunners(...e){e.forEach(e=>{this.runners[e]=new f(e)})}_addSystems(e){let t;for(t in e){let r=e[t];this._addSystem(r.value,r.name)}}_addSystem(e,t){let r=new e(this);if(this[t])throw Error(`Whoops! The name "${t}" is already in use`);for(let e in this[t]=r,this._systemsHash[t]=r,this.runners)this.runners[e].add(r);return this}_addPipes(e,t){let r=t.reduce((e,t)=>(e[t.name]=t.value,e),{});e.forEach(e=>{let t=e.value,i=e.name,a=r[i];this.renderPipes[i]=new t(this,a?new a:null),this.runners.destroy.add(this.renderPipes[i])})}destroy(e=!1){this.runners.destroy.items.reverse(),this.runners.destroy.emit(e),(!0===e||"object"==typeof e&&e.releaseGlobalResources)&&u.GlobalResourceRegistry.release(),Object.values(this.runners).forEach(e=>{e.destroy()}),this._systemsHash=null,this.renderPipes=null,this.removeAllListeners()}generateTexture(e){return this.textureGenerator.generateTexture(e)}get roundPixels(){return!!this._roundPixels}_unsafeEvalCheck(){if(!(0,n.unsafeEvalSupported)())throw Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}resetState(){this.runners.resetState.emit()}};c.defaultOptions={resolution:1,failIfMajorPerformanceCaveat:!1,roundPixels:!1},e.s(["AbstractRenderer",0,c],2351)},89506,e=>{"use strict";e.s(["color32BitToUniform",0,function(e,t,r){let i=(e>>24&255)/255;t[r++]=(255&e)/255*i,t[r++]=(e>>8&255)/255*i,t[r++]=(e>>16&255)/255*i,t[r++]=i}])},40766,e=>{"use strict";e.s(["BatchableSprite",0,class{constructor(){this.batcherName="default",this.topology="triangle-list",this.attributeSize=4,this.indexSize=6,this.packAsQuad=!0,this.roundPixels=0,this._attributeStart=0,this._batcher=null,this._batch=null}get blendMode(){return this.renderable.groupBlendMode}get color(){return this.renderable.groupColorAlpha}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.bounds=null}destroy(){this.reset()}}])},55364,e=>{"use strict";let t;e.s(["unsafeEvalSupported",0,function(){if("boolean"==typeof t)return t;try{let e=Function("param1","param2","param3","return param1[param2] === param3;");t=!0===e({a:"b"},"a","b")}catch(e){t=!1}return t}])},33219,e=>{"use strict";e.s(["GCManagedHash",0,class{constructor(e){this.items=Object.create(null);const{renderer:t,type:r,onUnload:i,priority:a,name:n}=e;this._renderer=t,t.gc.addResourceHash(this,"items",r,a??0),this._onUnload=i,this.name=n}add(e){return!this.items[e.uid]&&(this.items[e.uid]=e,e.once("unload",this.remove,this),e._gcLastUsed=this._renderer.gc.now,!0)}remove(e,...t){if(!this.items[e.uid])return;let r=e._gpuData[this._renderer.uid];r&&(this._onUnload?.(e,...t),r.destroy(),e._gpuData[this._renderer.uid]=null,this.items[e.uid]=null)}removeAll(...e){Object.values(this.items).forEach(t=>t&&this.remove(t,...e))}destroy(...e){this.removeAll(...e),this.items=Object.create(null),this._renderer=null,this._onUnload=null}}])},81834,76789,e=>{"use strict";var t=e.i(47760);e.i(95932);let r="8.19.0";e.s(["VERSION",0,r],76789);class i{static init(){globalThis.__PIXI_APP_INIT__?.(this,r)}static destroy(){}}i.extension=t.ExtensionType.Application;class a{constructor(e){this._renderer=e}init(){globalThis.__PIXI_RENDERER_INIT__?.(this._renderer,r)}destroy(){this._renderer=null}}a.extension={type:[t.ExtensionType.WebGLSystem,t.ExtensionType.WebGPUSystem],name:"initHook",priority:-10},e.s(["ApplicationInitHook",0,i,"RendererInitHook",0,a],81834)}]);