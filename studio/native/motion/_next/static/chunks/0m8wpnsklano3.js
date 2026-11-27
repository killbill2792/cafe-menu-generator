(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,54126,e=>{"use strict";var t=e.i(81107),r=e.i(27076),a=e.i(65654),o=e.i(22558);let i=class e extends a.Shader{constructor(t){super(t={...e.defaultOptions,...t}),this.enabled=!0,this._state=o.State.for2d(),this.blendMode=t.blendMode,this.padding=t.padding,"boolean"==typeof t.antialias?this.antialias=t.antialias?"on":"off":this.antialias=t.antialias,this.resolution=t.resolution,this.blendRequired=t.blendRequired,this.clipToViewport=t.clipToViewport,this.addResource("uTexture",0,1),t.blendRequired&&this.addResource("uBackTexture",0,3)}apply(e,t,r,a){e.applyFilter(this,t,r,a)}get blendMode(){return this._state.blendMode}set blendMode(e){this._state.blendMode=e}static from(a){let o,i,{gpu:n,gl:s,...u}=a;return n&&(o=r.GpuProgram.from(n)),s&&(i=t.GlProgram.from(s)),new e({gpuProgram:o,glProgram:i,...u})}};i.defaultOptions={blendMode:"normal",resolution:1,padding:0,antialias:"off",blendRequired:!1,clipToViewport:!0},e.s(["Filter",0,i])},35066,90532,35656,39391,e=>{"use strict";let t={name:"local-uniform-bit",vertex:{header:`

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
        `}},r={...t,vertex:{...t.vertex,header:t.vertex.header.replace("group(1)","group(2)")}},a={name:"local-uniform-bit",vertex:{header:`

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
        `}};e.s(["localUniformBit",0,t,"localUniformBitGl",0,a,"localUniformBitGroup2",0,r],35066);let o={name:"texture-bit",vertex:{header:`

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
        `}},i={name:"texture-bit",vertex:{header:`
            uniform mat3 uTextureMatrix;
        `,main:`
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
        uniform sampler2D uTexture;


        `,main:`
            outColor = texture(uTexture, vUV);
        `}};e.s(["textureBit",0,o,"textureBitGl",0,i],90532);var n=e.i(85830),s=e.i(46820);e.s(["ensureAttributes",0,function(e,t){for(let r in e.attributes){let a=e.attributes[r],o=t[r];o?(a.format??(a.format=o.format),a.offset??(a.offset=o.offset),a.instance??(a.instance=o.instance)):(0,n.warn)(`Attribute ${r} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`)}!function(e){let{buffers:t,attributes:r}=e,a={},o={};for(let e in t){let r=t[e];a[r.uid]=0,o[r.uid]=0}for(let e in r){let t=r[e];a[t.buffer.uid]+=(0,s.getAttributeInfoFromFormat)(t.format).stride}for(let e in r){let t=r[e];t.stride??(t.stride=a[t.buffer.uid]),t.start??(t.start=o[t.buffer.uid]),o[t.buffer.uid]+=(0,s.getAttributeInfoFromFormat)(t.format).stride}}(e)}],35656);var u=e.i(96108);let f=[];f[u.STENCIL_MODES.NONE]=void 0,f[u.STENCIL_MODES.DISABLED]={stencilWriteMask:0,stencilReadMask:0},f[u.STENCIL_MODES.RENDERING_MASK_ADD]={stencilFront:{compare:"equal",passOp:"increment-clamp"},stencilBack:{compare:"equal",passOp:"increment-clamp"}},f[u.STENCIL_MODES.RENDERING_MASK_REMOVE]={stencilFront:{compare:"equal",passOp:"decrement-clamp"},stencilBack:{compare:"equal",passOp:"decrement-clamp"}},f[u.STENCIL_MODES.MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"equal",passOp:"keep"},stencilBack:{compare:"equal",passOp:"keep"}},f[u.STENCIL_MODES.INVERSE_MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"not-equal",passOp:"keep"},stencilBack:{compare:"not-equal",passOp:"keep"}},e.s(["GpuStencilModesToPixi",0,f],39391)},15433,18771,88564,81768,e=>{"use strict";var t=e.i(47760),r=e.i(28353);let a={f32:4,i32:4,"vec2<f32>":8,"vec3<f32>":12,"vec4<f32>":16,"vec2<i32>":8,"vec3<i32>":12,"vec4<i32>":16,"mat2x2<f32>":32,"mat3x3<f32>":48,"mat4x4<f32>":64};function o(e){let t=e.map(e=>({data:e,offset:0,size:0})),r=0,o=0;for(let e=0;e<t.length;e++){let i=t[e];if(!(r=a[i.data.type]))throw Error(`Unknown type ${i.data.type}`);i.data.size>1&&(r=Math.max(r,16)*i.data.size);let n=12===r?16:r;i.size=r;let s=o%16;s>0&&16-s<n?o+=(16-s)%16:o+=(r-s%r)%r,i.offset=o,o+=r}return{uboElements:t,size:o=16*Math.ceil(o/16)}}e.s(["WGSL_TO_STD40_SIZE",0,a,"createUboElementsSTD40",0,o],18771);var i=e.i(31873),n=e.i(33156);function s(e,t){let r=Math.max(a[e.data.type]/16,1),o=e.data.value.length/e.data.size,i=(4-o%4)%4,n=e.data.type.indexOf("i32")>=0?"dataInt32":"data";return`
        v = uv.${e.data.name};
        offset += ${t};

        arrayOffset = offset;

        t = 0;

        for(var i=0; i < ${e.data.size*r}; i++)
        {
            for(var j = 0; j < ${o}; j++)
            {
                ${n}[arrayOffset++] = v[t++];
            }
            ${0!==i?`arrayOffset += ${i};`:""}
        }
    `}function u(e){return(0,i.createUboSyncFunction)(e,"uboStd40",s,n.uboSyncFunctionsSTD40)}class f extends r.UboSystem{constructor(){super({createUboElements:o,generateUboSync:u})}}f.extension={type:[t.ExtensionType.WebGLSystem],name:"ubo"},e.s(["GlUboSystem",0,f],15433);var c=e.i(87784),v=e.i(32543),l=e.i(95627),m=e.i(85830);class d{constructor(e,t){this.program=e,this.uniformData=t,this.uniformGroups={},this.uniformDirtyGroups={},this.uniformBlockBindings={}}destroy(){this.uniformData=null,this.uniformGroups=null,this.uniformDirtyGroups=null,this.uniformBlockBindings=null,this.program=null}}function h(e,t,r){let a=e.createShader(t);return e.shaderSource(a,r),e.compileShader(a),a}function g(e){let t=Array(e);for(let e=0;e<t.length;e++)t[e]=!1;return t}function p(e,t){switch(e){case"float":case"int":case"uint":case"sampler2D":case"sampler2DArray":return 0;case"vec2":return new Float32Array(2*t);case"vec3":return new Float32Array(3*t);case"vec4":return new Float32Array(4*t);case"ivec2":return new Int32Array(2*t);case"ivec3":return new Int32Array(3*t);case"ivec4":return new Int32Array(4*t);case"uvec2":return new Uint32Array(2*t);case"uvec3":return new Uint32Array(3*t);case"uvec4":return new Uint32Array(4*t);case"bool":return!1;case"bvec2":return g(2*t);case"bvec3":return g(3*t);case"bvec4":return g(4*t);case"mat2":return new Float32Array([1,0,0,1]);case"mat3":return new Float32Array([1,0,0,0,1,0,0,0,1]);case"mat4":return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return null}var _=e.i(46820);let b=null,y={FLOAT:"float",FLOAT_VEC2:"vec2",FLOAT_VEC3:"vec3",FLOAT_VEC4:"vec4",INT:"int",INT_VEC2:"ivec2",INT_VEC3:"ivec3",INT_VEC4:"ivec4",UNSIGNED_INT:"uint",UNSIGNED_INT_VEC2:"uvec2",UNSIGNED_INT_VEC3:"uvec3",UNSIGNED_INT_VEC4:"uvec4",BOOL:"bool",BOOL_VEC2:"bvec2",BOOL_VEC3:"bvec3",BOOL_VEC4:"bvec4",FLOAT_MAT2:"mat2",FLOAT_MAT3:"mat3",FLOAT_MAT4:"mat4",SAMPLER_2D:"sampler2D",INT_SAMPLER_2D:"sampler2D",UNSIGNED_INT_SAMPLER_2D:"sampler2D",SAMPLER_CUBE:"samplerCube",INT_SAMPLER_CUBE:"samplerCube",UNSIGNED_INT_SAMPLER_CUBE:"samplerCube",SAMPLER_2D_ARRAY:"sampler2DArray",INT_SAMPLER_2D_ARRAY:"sampler2DArray",UNSIGNED_INT_SAMPLER_2D_ARRAY:"sampler2DArray"},x={float:"float32",vec2:"float32x2",vec3:"float32x3",vec4:"float32x4",int:"sint32",ivec2:"sint32x2",ivec3:"sint32x3",ivec4:"sint32x4",uint:"uint32",uvec2:"uint32x2",uvec3:"uint32x3",uvec4:"uint32x4",bool:"uint32",bvec2:"uint32x2",bvec3:"uint32x3",bvec4:"uint32x4"};function S(e,t){if(!b){let t=Object.keys(y);b={};for(let r=0;r<t.length;++r){let a=t[r];b[e[a]]=y[a]}}return b[t]}function T(e,t){let r=e.getShaderSource(t);if(null===r)return void console.error("PixiJS Error: Could not retrieve shader source (WebGL context may be lost).");let a=r.split("\n").map((e,t)=>`${t}: ${e}`),o=e.getShaderInfoLog(t)??"",i=o.split("\n"),n={},s=i.map(e=>parseFloat(e.replace(/^ERROR\: 0\:([\d]+)\:.*$/,"$1"))).filter(e=>!!e&&!n[e]&&(n[e]=!0,!0)),u=[""];s.forEach(e=>{a[e-1]=`%c${a[e-1]}%c`,u.push("background: #FF0000; color:#FFFFFF; font-size: 10px","font-size: 10px")});let f=a.join("\n");u[0]=f,console.error(o),console.groupCollapsed("click to view full shader code"),console.warn(...u),console.groupEnd()}let U={textureCount:0,blockIndex:0};class A{constructor(e){this._activeProgram=null,this._programDataHash=Object.create(null),this._shaderSyncFunctions=Object.create(null),this._renderer=e}contextChange(e){this._gl=e,this._programDataHash=Object.create(null),this._shaderSyncFunctions=Object.create(null),this._activeProgram=null}bind(e,t){if(this._setProgram(e.glProgram),t)return;U.textureCount=0,U.blockIndex=0;let r=this._shaderSyncFunctions[e.glProgram._key];r||(r=this._shaderSyncFunctions[e.glProgram._key]=this._generateShaderSync(e,this)),this._renderer.buffer.nextBindBase(!!e.glProgram.transformFeedbackVaryings),r(this._renderer,e,U)}updateUniformGroup(e){this._renderer.uniformGroup.updateUniformGroup(e,this._activeProgram,U)}bindUniformBlock(e,t,r=0){let a=this._renderer.buffer,o=this._getProgramData(this._activeProgram),i=e._bufferResource;i||this._renderer.ubo.updateUniformGroup(e);let n=e.buffer,s=a.updateBuffer(n),u=a.freeLocationForBufferBase(s);if(i){let{offset:t,size:r}=e;0===t&&r===n.data.byteLength?a.bindBufferBase(s,u):a.bindBufferRange(s,u,t)}else a.getLastBindBaseLocation(s)!==u&&a.bindBufferBase(s,u);let f=this._activeProgram._uniformBlockData[t].index;o.uniformBlockBindings[r]!==u&&(o.uniformBlockBindings[r]=u,this._renderer.gl.uniformBlockBinding(o.program,f,u))}_setProgram(e){if(this._activeProgram===e)return;this._activeProgram=e;let t=this._getProgramData(e);this._gl.useProgram(t.program)}_getProgramData(e){return this._programDataHash[e._key]||this._createProgramData(e)}_createProgramData(e){let t=e._key;return this._programDataHash[t]=function(e,t){let r=h(e,e.VERTEX_SHADER,t.vertex),a=h(e,e.FRAGMENT_SHADER,t.fragment),o=e.createProgram();e.attachShader(o,r),e.attachShader(o,a);let i=t.transformFeedbackVaryings;i&&("function"!=typeof e.transformFeedbackVaryings?(0,m.warn)("TransformFeedback is not supported but TransformFeedbackVaryings are given."):e.transformFeedbackVaryings(o,i.names,"separate"===i.bufferMode?e.SEPARATE_ATTRIBS:e.INTERLEAVED_ATTRIBS)),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS)&&(e.getProgramParameter(o,e.LINK_STATUS)||(e.getShaderParameter(r,e.COMPILE_STATUS)||T(e,r),e.getShaderParameter(a,e.COMPILE_STATUS)||T(e,a),console.error("PixiJS Error: Could not initialize shader."),""!==e.getProgramInfoLog(o)&&console.warn("PixiJS Warning: gl.getProgramInfoLog()",e.getProgramInfoLog(o)))),t._attributeData=function(e,t,r=!1){let a={},o=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<o;r++){let o=t.getActiveAttrib(e,r);if(o.name.startsWith("gl_"))continue;let i=x[S(t,o.type)]||"float32";a[o.name]={location:0,format:i,stride:(0,_.getAttributeInfoFromFormat)(i).stride,offset:0,instance:!1,start:0}}let i=Object.keys(a);if(r){i.sort((e,t)=>e>t?1:-1);for(let r=0;r<i.length;r++)a[i[r]].location=r,t.bindAttribLocation(e,r,i[r]);t.linkProgram(e)}else for(let r=0;r<i.length;r++)a[i[r]].location=t.getAttribLocation(e,i[r]);return a}(o,e,!/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(t.vertex)),t._uniformData=function(e,t){let r={},a=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<a;o++){let a=t.getActiveUniform(e,o),i=a.name.replace(/\[.*?\]$/,""),n=!!a.name.match(/\[.*?\]$/),s=S(t,a.type);r[i]={name:i,index:o,type:s,size:a.size,isArray:n,value:p(s,a.size)}}return r}(o,e),t._uniformBlockData=function(e,t){if(!t.ACTIVE_UNIFORM_BLOCKS)return{};let r={},a=t.getProgramParameter(e,t.ACTIVE_UNIFORM_BLOCKS);for(let o=0;o<a;o++){let a=t.getActiveUniformBlockName(e,o),i=t.getUniformBlockIndex(e,a),n=t.getActiveUniformBlockParameter(e,o,t.UNIFORM_BLOCK_DATA_SIZE);r[a]={name:a,index:i,size:n}}return r}(o,e),e.deleteShader(r),e.deleteShader(a);let n={};for(let r in t._uniformData){let a=t._uniformData[r];n[r]={location:e.getUniformLocation(o,r),value:p(a.type,a.size)}}return new d(o,n)}(this._gl,e),this._programDataHash[t]}destroy(){for(let e of Object.keys(this._programDataHash))this._programDataHash[e].destroy();this._programDataHash=null,this._shaderSyncFunctions=null,this._activeProgram=null,this._renderer=null,this._gl=null}_generateShaderSync(e,t){return function(e,t){let r=[],a=[`
        var g = s.groups;
        var sS = r.shader;
        var p = s.glProgram;
        var ugS = r.uniformGroup;
        var resources;
    `],o=!1,i=0,n=t._getProgramData(e.glProgram);for(let s in e.groups){let u=e.groups[s];for(let f in r.push(`
            resources = g[${s}].resources;
        `),u.resources){let m=u.resources[f];if(m instanceof v.UniformGroup)if(m.ubo){let t=e._uniformBindMap[s][Number(f)];r.push(`
                        sS.bindUniformBlock(
                            resources[${f}],
                            '${t}',
                            ${e.glProgram._uniformBlockData[t].index}
                        );
                    `)}else r.push(`
                        ugS.updateUniformGroup(resources[${f}], p, sD);
                    `);else if(m instanceof c.BufferResource){let t=e._uniformBindMap[s][Number(f)];r.push(`
                    sS.bindUniformBlock(
                        resources[${f}],
                        '${t}',
                        ${e.glProgram._uniformBlockData[t].index}
                    );
                `)}else if(m instanceof l.TextureSource){let u=e._uniformBindMap[s][f],c=n.uniformData[u];c&&(o||(o=!0,a.push(`
                        var tS = r.texture;
                        `)),t._gl.uniform1i(c.location,i),r.push(`
                        tS.bind(resources[${f}], ${i});
                    `),i++)}}}return Function("r","s","sD",[...a,...r].join("\n"))}(e,t)}resetState(){this._activeProgram=null}}A.extension={type:[t.ExtensionType.WebGLSystem],name:"shader"},e.s(["GlShaderSystem",0,A],88564);var E=e.i(92715);let I={f32:`if (cv !== v) {
            cu.value = v;
            gl.uniform1f(location, v);
        }`,"vec2<f32>":`if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2f(location, v[0], v[1]);
        }`,"vec3<f32>":`if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3f(location, v[0], v[1], v[2]);
        }`,"vec4<f32>":`if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4f(location, v[0], v[1], v[2], v[3]);
        }`,i32:`if (cv !== v) {
            cu.value = v;
            gl.uniform1i(location, v);
        }`,"vec2<i32>":`if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2i(location, v[0], v[1]);
        }`,"vec3<i32>":`if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3i(location, v[0], v[1], v[2]);
        }`,"vec4<i32>":`if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4i(location, v[0], v[1], v[2], v[3]);
        }`,u32:`if (cv !== v) {
            cu.value = v;
            gl.uniform1ui(location, v);
        }`,"vec2<u32>":`if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2ui(location, v[0], v[1]);
        }`,"vec3<u32>":`if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3ui(location, v[0], v[1], v[2]);
        }`,"vec4<u32>":`if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4ui(location, v[0], v[1], v[2], v[3]);
        }`,bool:`if (cv !== v) {
            cu.value = v;
            gl.uniform1i(location, v);
        }`,"vec2<bool>":`if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2i(location, v[0], v[1]);
        }`,"vec3<bool>":`if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3i(location, v[0], v[1], v[2]);
        }`,"vec4<bool>":`if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4i(location, v[0], v[1], v[2], v[3]);
        }`,"mat2x2<f32>":"gl.uniformMatrix2fv(location, false, v);","mat3x3<f32>":"gl.uniformMatrix3fv(location, false, v);","mat4x4<f32>":"gl.uniformMatrix4fv(location, false, v);"},D={f32:"gl.uniform1fv(location, v);","vec2<f32>":"gl.uniform2fv(location, v);","vec3<f32>":"gl.uniform3fv(location, v);","vec4<f32>":"gl.uniform4fv(location, v);","mat2x2<f32>":"gl.uniformMatrix2fv(location, false, v);","mat3x3<f32>":"gl.uniformMatrix3fv(location, false, v);","mat4x4<f32>":"gl.uniformMatrix4fv(location, false, v);",i32:"gl.uniform1iv(location, v);","vec2<i32>":"gl.uniform2iv(location, v);","vec3<i32>":"gl.uniform3iv(location, v);","vec4<i32>":"gl.uniform4iv(location, v);",u32:"gl.uniform1iv(location, v);","vec2<u32>":"gl.uniform2iv(location, v);","vec3<u32>":"gl.uniform3iv(location, v);","vec4<u32>":"gl.uniform4iv(location, v);",bool:"gl.uniform1iv(location, v);","vec2<bool>":"gl.uniform2iv(location, v);","vec3<bool>":"gl.uniform3iv(location, v);","vec4<bool>":"gl.uniform4iv(location, v);"};class P{constructor(e){this._cache={},this._uniformGroupSyncHash={},this._renderer=e,this.gl=null,this._cache={}}contextChange(e){this.gl=e}updateUniformGroup(e,t,r){let a=this._renderer.shader._getProgramData(t);e.isStatic&&e._dirtyId===a.uniformDirtyGroups[e.uid]||(a.uniformDirtyGroups[e.uid]=e._dirtyId,this._getUniformSyncFunction(e,t)(a.uniformData,e.uniforms,this._renderer,r))}_getUniformSyncFunction(e,t){return this._uniformGroupSyncHash[e._signature]?.[t._key]||this._createUniformSyncFunction(e,t)}_createUniformSyncFunction(e,t){let r=this._uniformGroupSyncHash[e._signature]||(this._uniformGroupSyncHash[e._signature]={}),a=this._getSignature(e,t._uniformData,"u");return this._cache[a]||(this._cache[a]=this._generateUniformsSync(e,t._uniformData)),r[t._key]=this._cache[a],r[t._key]}_generateUniformsSync(e,t){return function(e,t){let r=[`
        var v = null;
        var cv = null;
        var cu = null;
        var t = 0;
        var gl = renderer.gl;
        var name = null;
    `];for(let a in e.uniforms){if(!t[a]){e.uniforms[a]instanceof v.UniformGroup?e.uniforms[a].ubo?r.push(`
                        renderer.shader.bindUniformBlock(uv.${a}, "${a}");
                    `):r.push(`
                        renderer.shader.updateUniformGroup(uv.${a});
                    `):e.uniforms[a]instanceof c.BufferResource&&r.push(`
                        renderer.shader.bindBufferResource(uv.${a}, "${a}");
                    `);continue}let o=e.uniformStructures[a],i=!1;for(let e=0;e<E.uniformParsers.length;e++){let t=E.uniformParsers[e];if(o.type===t.type&&t.test(o)){r.push(`name = "${a}";`,E.uniformParsers[e].uniform),i=!0;break}}if(!i){let e=(1===o.size?I:D)[o.type].replace("location",`ud["${a}"].location`);r.push(`
            cu = ud["${a}"];
            cv = cu.value;
            v = uv["${a}"];
            ${e};`)}}return Function("ud","uv","renderer","syncData",r.join("\n"))}(e,t)}_getSignature(e,t,r){let a=e.uniforms,o=[`${r}-`];for(let e in a)o.push(e),t[e]&&o.push(t[e].type);return o.join("-")}destroy(){this._renderer=null,this._cache=null}}P.extension={type:[t.ExtensionType.WebGLSystem],name:"uniformGroup"},e.s(["GlUniformGroupSystem",0,P],81768)},28353,92715,31873,33156,87784,e=>{"use strict";var t=e.i(55364),r=e.i(85465),a=e.i(64957);e.s(["UboSystem",0,class{constructor(e){this._syncFunctionHash=Object.create(null),this._adaptor=e,this._systemCheck()}_systemCheck(){if(!(0,t.unsafeEvalSupported)())throw Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}ensureUniformGroup(e){let t=this.getUniformGroupData(e);e.buffer||(e.buffer=new r.Buffer({data:new Float32Array(t.layout.size/4),usage:a.BufferUsage.UNIFORM|a.BufferUsage.COPY_DST}))}getUniformGroupData(e){return this._syncFunctionHash[e._signature]||this._initUniformGroup(e)}_initUniformGroup(e){let t=e._signature,r=this._syncFunctionHash[t];if(!r){let a=Object.keys(e.uniformStructures).map(t=>e.uniformStructures[t]),o=this._adaptor.createUboElements(a),i=this._generateUboSync(o.uboElements);r=this._syncFunctionHash[t]={layout:o,syncFunction:i}}return this._syncFunctionHash[t]}_generateUboSync(e){return this._adaptor.generateUboSync(e)}syncUniformGroup(e,t,o){let i=this.getUniformGroupData(e);e.buffer||(e.buffer=new r.Buffer({data:new Float32Array(i.layout.size/4),usage:a.BufferUsage.UNIFORM|a.BufferUsage.COPY_DST}));let n=null;return t||(t=e.buffer.data,n=e.buffer.dataInt32),o||(o=0),i.syncFunction(e.uniforms,t,n,o),!0}updateUniformGroup(e){if(e.isStatic&&!e._dirtyId)return!1;e._dirtyId=0;let t=this.syncUniformGroup(e);return e.buffer.update(),t}destroy(){this._syncFunctionHash=null}}],28353);let o=[{type:"mat3x3<f32>",test:e=>void 0!==e.value.a,ubo:`
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
        `}];function i(e,t){return`
        for (let i = 0; i < ${e*t}; i++) {
            data[offset + (((i / ${e})|0) * 4) + (i % ${e})] = v[i];
        }
    `}e.s(["uniformParsers",0,o],92715),e.s(["createUboSyncFunction",0,function(e,t,r,a){let i=[`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `],n=0;for(let s=0;s<e.length;s++){let u=e[s],f=u.data.name,c=!1,v=0;for(let e=0;e<o.length;e++)if(o[e].test(u.data)){v=u.offset/4,i.push(`name = "${f}";`,`offset += ${v-n};`,o[e][t]||o[e].ubo),c=!0;break}if(!c)if(u.data.size>1)v=u.offset/4,i.push(r(u,v-n));else{let e=a[u.data.type];v=u.offset/4,i.push(`
                    v = uv.${f};
                    offset += ${v-n};
                    ${e};
                `)}n=v}return Function("uv","data","dataInt32","offset",i.join("\n"))}],31873);let n={f32:`
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
        }`,"mat3x2<f32>":i(3,2),"mat4x2<f32>":i(4,2),"mat2x3<f32>":i(2,3),"mat4x3<f32>":i(4,3),"mat2x4<f32>":i(2,4),"mat3x4<f32>":i(3,4)},s={...n,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `};e.s(["uboSyncFunctionsSTD40",0,n,"uboSyncFunctionsWGSL",0,s],33156);var u=e.i(95932),f=e.i(24314);class c extends u.default{constructor({buffer:e,offset:t,size:r}){super(),this.uid=(0,f.uid)("buffer"),this._resourceType="bufferResource",this._touched=0,this._resourceId=(0,f.uid)("resource"),this._bufferResource=!0,this.destroyed=!1,this.buffer=e,this.offset=0|t,this.size=r,this.buffer.on("change",this.onBufferChange,this)}onBufferChange(){this._resourceId=(0,f.uid)("resource"),this.emit("change",this)}destroy(e=!1){this.destroyed=!0,e&&this.buffer.destroy(),this.emit("change",this),this.buffer=null,this.removeAllListeners()}}e.s(["BufferResource",0,c],87784)},40766,e=>{"use strict";e.s(["BatchableSprite",0,class{constructor(){this.batcherName="default",this.topology="triangle-list",this.attributeSize=4,this.indexSize=6,this.packAsQuad=!0,this.roundPixels=0,this._attributeStart=0,this._batcher=null,this._batch=null}get blendMode(){return this.renderable.groupBlendMode}get color(){return this.renderable.groupColorAlpha}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.bounds=null}destroy(){this.reset()}}])}]);