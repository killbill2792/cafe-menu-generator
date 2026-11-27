(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,35066,90532,35656,39391,e=>{"use strict";let t={name:"local-uniform-bit",vertex:{header:`

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
        `}},r={...t,vertex:{...t.vertex,header:t.vertex.header.replace("group(1)","group(2)")}},o={name:"local-uniform-bit",vertex:{header:`

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
        `}};e.s(["localUniformBit",0,t,"localUniformBitGl",0,o,"localUniformBitGroup2",0,r],35066);let i={name:"texture-bit",vertex:{header:`

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
        `}},a={name:"texture-bit",vertex:{header:`
            uniform mat3 uTextureMatrix;
        `,main:`
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
        uniform sampler2D uTexture;


        `,main:`
            outColor = texture(uTexture, vUV);
        `}};e.s(["textureBit",0,i,"textureBitGl",0,a],90532);var n=e.i(85830),u=e.i(46820);e.s(["ensureAttributes",0,function(e,t){for(let r in e.attributes){let o=e.attributes[r],i=t[r];i?(o.format??(o.format=i.format),o.offset??(o.offset=i.offset),o.instance??(o.instance=i.instance)):(0,n.warn)(`Attribute ${r} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`)}!function(e){let{buffers:t,attributes:r}=e,o={},i={};for(let e in t){let r=t[e];o[r.uid]=0,i[r.uid]=0}for(let e in r){let t=r[e];o[t.buffer.uid]+=(0,u.getAttributeInfoFromFormat)(t.format).stride}for(let e in r){let t=r[e];t.stride??(t.stride=o[t.buffer.uid]),t.start??(t.start=i[t.buffer.uid]),i[t.buffer.uid]+=(0,u.getAttributeInfoFromFormat)(t.format).stride}}(e)}],35656);var s=e.i(96108);let l=[];l[s.STENCIL_MODES.NONE]=void 0,l[s.STENCIL_MODES.DISABLED]={stencilWriteMask:0,stencilReadMask:0},l[s.STENCIL_MODES.RENDERING_MASK_ADD]={stencilFront:{compare:"equal",passOp:"increment-clamp"},stencilBack:{compare:"equal",passOp:"increment-clamp"}},l[s.STENCIL_MODES.RENDERING_MASK_REMOVE]={stencilFront:{compare:"equal",passOp:"decrement-clamp"},stencilBack:{compare:"equal",passOp:"decrement-clamp"}},l[s.STENCIL_MODES.MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"equal",passOp:"keep"},stencilBack:{compare:"equal",passOp:"keep"}},l[s.STENCIL_MODES.INVERSE_MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"not-equal",passOp:"keep"},stencilBack:{compare:"not-equal",passOp:"keep"}},e.s(["GpuStencilModesToPixi",0,l],39391)}]);