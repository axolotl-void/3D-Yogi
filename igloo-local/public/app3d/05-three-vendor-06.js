var S2 = class {
        constructor(i, e=2)
        {
            this.weights = null,
            this.offsets = null,
            this.linearWeights = null,
            this.linearOffsets = null,
            this.generate(i, e)
        }
        get steps()
        {
            return this.offsets === null ? 0 : this.offsets.length
        }
        get linearSteps()
        {
            return this.linearOffsets === null ? 0 : this.linearOffsets.length
        }
        generate(i, e)
        {
            if (i < 3 || i > 1020)
                throw new Error("The kernel size must be in the range [3, 1020]");
            const t = i + e * 2,
                s = e > 0 ? b0(t).slice(e, -e) : b0(t),
                n = Math.floor((s.length - 1) / 2),
                r = s.reduce((d, u) => d + u, 0),
                a = s.slice(n),
                o = [...Array(n + 1).keys()],
                l = new Float64Array(Math.floor(o.length / 2)),
                c = new Float64Array(l.length);
            l[0] = a[0] / r;
            for (let d = 1, u = 1, f = o.length - 1; d < f; d += 2, ++u) {
                const p = o[d],
                    A = o[d + 1],
                    m = a[d],
                    g = a[d + 1],
                    x = m + g,
                    v = (p * m + A * g) / x;
                l[u] = x / r,
                c[u] = v
            }
            for (let d = 0, u = a.length, f = 1 / r; d < u; ++d)
                a[d] *= f;
            const h = (l.reduce((d, u) => d + u, 0) - l[0] * .5) * 2;
            if (h !== 0)
                for (let d = 0, u = l.length, f = 1 / h; d < u; ++d)
                    l[d] *= f;
            this.offsets = o,
            this.weights = a,
            this.linearOffsets = c,
            this.linearWeights = l
        }
    }
    ,
    Bf = !1,
    T0 = class {
        constructor(i=null)
        {
            this.originalMaterials = new Map,
            this.material = null,
            this.materials = null,
            this.materialsBackSide = null,
            this.materialsDoubleSide = null,
            this.materialsFlatShaded = null,
            this.materialsFlatShadedBackSide = null,
            this.materialsFlatShadedDoubleSide = null,
            this.setMaterial(i),
            this.meshCount = 0,
            this.replaceMaterial = e => {
                if (e.isMesh) {
                    let t;
                    if (e.material.flatShading)
                        switch (e.material.side) {
                        case xi:
                            t = this.materialsFlatShadedDoubleSide;
                            break;
                        case ei:
                            t = this.materialsFlatShadedBackSide;
                            break;
                        default:
                            t = this.materialsFlatShaded;
                            break
                        }
                    else
                        switch (e.material.side) {
                        case xi:
                            t = this.materialsDoubleSide;
                            break;
                        case ei:
                            t = this.materialsBackSide;
                            break;
                        default:
                            t = this.materials;
                            break
                        }
                    this.originalMaterials.set(e, e.material),
                    e.isSkinnedMesh ? e.material = t[2] : e.isInstancedMesh ? e.material = t[1] : e.material = t[0],
                    ++this.meshCount
                }
            }
        }
        cloneMaterial(i)
        {
            if (!(i instanceof fe))
                return i.clone();
            const e = i.uniforms,
                t = new Map;
            for (const n in e) {
                const r = e[n].value;
                r.isRenderTargetTexture && (e[n].value = null, t.set(n, r))
            }
            const s = i.clone();
            for (const n of t)
                e[n[0]].value = n[1],
                s.uniforms[n[0]].value = n[1];
            return s
        }
        setMaterial(i)
        {
            if (this.disposeMaterials(), this.material = i, i !== null) {
                const e = this.materials = [this.cloneMaterial(i), this.cloneMaterial(i), this.cloneMaterial(i)];
                for (const t of e)
                    t.uniforms = Object.assign({}, i.uniforms),
                    t.side = es;
                e[2].skinning = !0,
                this.materialsBackSide = e.map(t => {
                    const s = this.cloneMaterial(t);
                    return s.uniforms = Object.assign({}, i.uniforms), s.side = ei, s
                }),
                this.materialsDoubleSide = e.map(t => {
                    const s = this.cloneMaterial(t);
                    return s.uniforms = Object.assign({}, i.uniforms), s.side = xi, s
                }),
                this.materialsFlatShaded = e.map(t => {
                    const s = this.cloneMaterial(t);
                    return s.uniforms = Object.assign({}, i.uniforms), s.flatShading = !0, s
                }),
                this.materialsFlatShadedBackSide = e.map(t => {
                    const s = this.cloneMaterial(t);
                    return s.uniforms = Object.assign({}, i.uniforms), s.flatShading = !0, s.side = ei, s
                }),
                this.materialsFlatShadedDoubleSide = e.map(t => {
                    const s = this.cloneMaterial(t);
                    return s.uniforms = Object.assign({}, i.uniforms), s.flatShading = !0, s.side = xi, s
                })
            }
        }
        render(i, e, t)
        {
            const s = i.shadowMap.enabled;
            if (i.shadowMap.enabled = !1, Bf) {
                const n = this.originalMaterials;
                this.meshCount = 0,
                e.traverse(this.replaceMaterial),
                i.render(e, t);
                for (const r of n)
                    r[0].material = r[1];
                this.meshCount !== n.size && n.clear()
            } else {
                const n = e.overrideMaterial;
                e.overrideMaterial = this.material,
                i.render(e, t),
                e.overrideMaterial = n
            }
            i.shadowMap.enabled = s
        }
        disposeMaterials()
        {
            if (this.material !== null) {
                const i = this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);
                for (const e of i)
                    e.dispose()
            }
        }
        dispose()
        {
            this.originalMaterials.clear(),
            this.disposeMaterials()
        }
        static get workaroundEnabled()
        {
            return Bf
        }
        static set workaroundEnabled(i)
        {
            Bf = i
        }
    }
    ,
    qn = -1,
    ti = class  extends hn{
        constructor(i, e=qn, t=qn, s=1)
        {
            super(),
            this.resizable = i,
            this.baseSize = new H(1, 1),
            this.preferredSize = new H(e, t),
            this.target = this.preferredSize,
            this.s = s,
            this.effectiveSize = new H,
            this.addEventListener("change", () => this.updateEffectiveSize()),
            this.updateEffectiveSize()
        }
        updateEffectiveSize()
        {
            const i = this.baseSize,
                e = this.preferredSize,
                t = this.effectiveSize,
                s = this.scale;
            e.width !== qn ? t.width = e.width : e.height !== qn ? t.width = Math.round(e.height * (i.width / Math.max(i.height, 1))) : t.width = Math.round(i.width * s),
            e.height !== qn ? t.height = e.height : e.width !== qn ? t.height = Math.round(e.width / Math.max(i.width / Math.max(i.height, 1), 1)) : t.height = Math.round(i.height * s)
        }
        get width()
        {
            return this.effectiveSize.width
        }
        set width(i)
        {
            this.preferredWidth = i
        }
        get height()
        {
            return this.effectiveSize.height
        }
        set height(i)
        {
            this.preferredHeight = i
        }
        getWidth()
        {
            return this.width
        }
        getHeight()
        {
            return this.height
        }
        get scale()
        {
            return this.s
        }
        set scale(i)
        {
            this.s !== i && (this.s = i, this.preferredSize.setScalar(qn), this.dispatchEvent({
                type: "change"
            }), this.resizable.setSize(this.baseSize.width, this.baseSize.height))
        }
        getScale()
        {
            return this.scale
        }
        setScale(i)
        {
            this.scale = i
        }
        get baseWidth()
        {
            return this.baseSize.width
        }
        set baseWidth(i)
        {
            this.baseSize.width !== i && (this.baseSize.width = i, this.dispatchEvent({
                type: "change"
            }), this.resizable.setSize(this.baseSize.width, this.baseSize.height))
        }
        getBaseWidth()
        {
            return this.baseWidth
        }
        setBaseWidth(i)
        {
            this.baseWidth = i
        }
        get baseHeight()
        {
            return this.baseSize.height
        }
        set baseHeight(i)
        {
            this.baseSize.height !== i && (this.baseSize.height = i, this.dispatchEvent({
                type: "change"
            }), this.resizable.setSize(this.baseSize.width, this.baseSize.height))
        }
        getBaseHeight()
        {
            return this.baseHeight
        }
        setBaseHeight(i)
        {
            this.baseHeight = i
        }
        setBaseSize(i, e)
        {
            (this.baseSize.width !== i || this.baseSize.height !== e) && (this.baseSize.set(i, e), this.dispatchEvent({
                type: "change"
            }), this.resizable.setSize(this.baseSize.width, this.baseSize.height))
        }
        get preferredWidth()
        {
            return this.preferredSize.width
        }
        set preferredWidth(i)
        {
            this.preferredSize.width !== i && (this.preferredSize.width = i, this.dispatchEvent({
                type: "change"
            }), this.resizable.setSize(this.baseSize.width, this.baseSize.height))
        }
        getPreferredWidth()
        {
            return this.preferredWidth
        }
        setPreferredWidth(i)
        {
            this.preferredWidth = i
        }
        get preferredHeight()
        {
            return this.preferredSize.height
        }
        set preferredHeight(i)
        {
            this.preferredSize.height !== i && (this.preferredSize.height = i, this.dispatchEvent({
                type: "change"
            }), this.resizable.setSize(this.baseSize.width, this.baseSize.height))
        }
        getPreferredHeight()
        {
            return this.preferredHeight
        }
        setPreferredHeight(i)
        {
            this.preferredHeight = i
        }
        setPreferredSize(i, e)
        {
            (this.preferredSize.width !== i || this.preferredSize.height !== e) && (this.preferredSize.set(i, e), this.dispatchEvent({
                type: "change"
            }), this.resizable.setSize(this.baseSize.width, this.baseSize.height))
        }
        copy(i)
        {
            this.s = i.scale,
            this.baseSize.set(i.baseWidth, i.baseHeight),
            this.preferredSize.set(i.preferredWidth, i.preferredHeight),
            this.dispatchEvent({
                type: "change"
            }),
            this.resizable.setSize(this.baseSize.width, this.baseSize.height)
        }
        static get AUTO_SIZE()
        {
            return qn
        }
    }
    ,
    M2 = class  extends Set{
        constructor(i, e=10)
        {
            super(),
            this.l = e,
            this.exclusive = !1,
            i !== void 0 && this.set(i)
        }
        get layer()
        {
            return this.l
        }
        set layer(i)
        {
            const e = this.l;
            for (const t of this)
                t.layers.disable(e),
                t.layers.enable(i);
            this.l = i
        }
        getLayer()
        {
            return this.layer
        }
        setLayer(i)
        {
            this.layer = i
        }
        isExclusive()
        {
            return this.exclusive
        }
        setExclusive(i)
        {
            this.exclusive = i
        }
        clear()
        {
            const i = this.layer;
            for (const e of this)
                e.layers.disable(i);
            return super.clear()
        }
        set(i)
        {
            this.clear();
            for (const e of i)
                this.add(e);
            return this
        }
        indexOf(i)
        {
            return this.has(i) ? 0 : -1
        }
        add(i)
        {
            return this.exclusive ? i.layers.set(this.layer) : i.layers.enable(this.layer), super.add(i)
        }
        delete(i)
        {
            return this.has(i) && i.layers.disable(this.layer), super.delete(i)
        }
        toggle(i)
        {
            let e;
            return this.has(i) ? (this.delete(i), e = !1) : (this.add(i), e = !0), e
        }
        setVisible(i)
        {
            for (const e of this)
                i ? e.layers.enable(0) : e.layers.disable(0);
            return this
        }
    }
    ,
    ct = {
        SKIP: 9,
        SET: 30,
        ADD: 0,
        ALPHA: 1,
        AVERAGE: 2,
        COLOR: 3,
        COLOR_BURN: 4,
        COLOR_DODGE: 5,
        DARKEN: 6,
        DIFFERENCE: 7,
        DIVIDE: 8,
        DST: 9,
        EXCLUSION: 10,
        HARD_LIGHT: 11,
        HARD_MIX: 12,
        HUE: 13,
        INVERT: 14,
        INVERT_RGB: 15,
        LIGHTEN: 16,
        LINEAR_BURN: 17,
        LINEAR_DODGE: 18,
        LINEAR_LIGHT: 19,
        LUMINOSITY: 20,
        MULTIPLY: 21,
        NEGATION: 22,
        NORMAL: 23,
        OVERLAY: 24,
        PIN_LIGHT: 25,
        REFLECT: 26,
        SATURATION: 27,
        SCREEN: 28,
        SOFT_LIGHT: 29,
        SRC: 30,
        SUBTRACT: 31,
        VIVID_LIGHT: 32
    },
    b2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x+y,opacity);}",
    T2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y,min(y.a,opacity));}",
    I2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,(x+y)*0.5,opacity);}",
    B2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(yHSL.rg,xHSL.b));return vec4(mix(x.rgb,z,opacity),y.a);}",
    P2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(step(0.0,y)*(1.0-min(vec4(1.0),(1.0-x)/y)),vec4(1.0),step(1.0,x));return mix(x,z,opacity);}",
    D2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=step(0.0,x)*mix(min(vec4(1.0),x/max(1.0-y,1e-9)),vec4(1.0),step(1.0,y));return mix(x,z,opacity);}",
    R2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,min(x,y),opacity);}",
    U2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,abs(x-y),opacity);}",
    L2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x/max(y,1e-12),opacity);}",
    F2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,(x+y-2.0*x*y),opacity);}",
    N2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 a=min(x,1.0),b=min(y,1.0);vec4 z=mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(0.5,y));return mix(x,z,opacity);}",
    O2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,step(1.0,x+y),opacity);}",
    k2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(yHSL.r,xHSL.gb));return vec4(mix(x.rgb,z,opacity),y.a);}",
    z2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,1.0-y,opacity);}",
    Q2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y*(1.0-x),opacity);}",
    G2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,max(x,y),opacity);}",
    H2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,clamp(y+x-1.0,0.0,1.0),opacity);}",
    V2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,min(x+y,1.0),opacity);}",
    W2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,clamp(2.0*y+x-1.0,0.0,1.0),opacity);}",
    Y2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(xHSL.rg,yHSL.b));return vec4(mix(x.rgb,z,opacity),y.a);}",
    q2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x*y,opacity);}",
    X2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,1.0-abs(1.0-x-y),opacity);}",
    K2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y,opacity);}",
    J2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(2.0*y*x,1.0-2.0*(1.0-y)*(1.0-x),step(0.5,x));return mix(x,z,opacity);}",
    j2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 y2=2.0*y;vec4 z=mix(mix(y2,x,step(0.5*x,y)),max(vec4(0.0),y2-1.0),step(x,(y2-1.0)));return mix(x,z,opacity);}",
    Z2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(min(x*x/max(1.0-y,1e-12),1.0),y,step(1.0,y));return mix(x,z,opacity);}",
    $2 = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(xHSL.r,yHSL.g,xHSL.b));return vec4(mix(x.rgb,z,opacity),y.a);}",
    eB = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x+y-min(x*y,1.0),opacity);}",
    tB = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 y2=2.0*y;vec4 w=step(0.5,y);vec4 z=mix(x-(1.0-y2)*x*(1.0-x),mix(x+(y2-1.0)*(sqrt(x)-x),x+(y2-1.0)*x*((16.0*x-12.0)*x+3.0),w*(1.0-step(0.25,x))),w);return mix(x,z,opacity);}",
    iB = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return y;}",
    sB = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,max(x+y-1.0,0.0),opacity);}",
    nB = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(max(1.0-min((1.0-x)/(2.0*y),1.0),0.0),min(x/(2.0*(1.0-y)),1.0),step(0.5,y));return mix(x,z,opacity);}",
    rB = new Map([[ct.ADD, b2], [ct.ALPHA, T2], [ct.AVERAGE, I2], [ct.COLOR, B2], [ct.COLOR_BURN, P2], [ct.COLOR_DODGE, D2], [ct.DARKEN, R2], [ct.DIFFERENCE, U2], [ct.DIVIDE, L2], [ct.DST, null], [ct.EXCLUSION, F2], [ct.HARD_LIGHT, N2], [ct.HARD_MIX, O2], [ct.HUE, k2], [ct.INVERT, z2], [ct.INVERT_RGB, Q2], [ct.LIGHTEN, G2], [ct.LINEAR_BURN, H2], [ct.LINEAR_DODGE, V2], [ct.LINEAR_LIGHT, W2], [ct.LUMINOSITY, Y2], [ct.MULTIPLY, q2], [ct.NEGATION, X2], [ct.NORMAL, K2], [ct.OVERLAY, J2], [ct.PIN_LIGHT, j2], [ct.REFLECT, Z2], [ct.SATURATION, $2], [ct.SCREEN, eB], [ct.SOFT_LIGHT, tB], [ct.SRC, iB], [ct.SUBTRACT, sB], [ct.VIVID_LIGHT, nB]]),
    aB = class  extends hn{
        constructor(i, e=1)
        {
            super(),
            this._blendFunction = i,
            this.opacity = new Me(e)
        }
        getOpacity()
        {
            return this.opacity.value
        }
        setOpacity(i)
        {
            this.opacity.value = i
        }
        get blendFunction()
        {
            return this._blendFunction
        }
        set blendFunction(i)
        {
            this._blendFunction = i,
            this.dispatchEvent({
                type: "change"
            })
        }
        getBlendFunction()
        {
            return this.blendFunction
        }
        setBlendFunction(i)
        {
            this.blendFunction = i
        }
        getShaderCode()
        {
            return rB.get(this.blendFunction)
        }
    }
    ,
    fr = {
        VERY_SMALL: 0,
        SMALL: 1,
        MEDIUM: 2,
        LARGE: 3,
        VERY_LARGE: 4,
        HUGE: 5
    },
    oB = `#ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D inputBuffer;
    #else
    uniform lowp sampler2D inputBuffer;
    #endif
    varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec4 sum=texture2D(inputBuffer,vUv0);sum+=texture2D(inputBuffer,vUv1);sum+=texture2D(inputBuffer,vUv2);sum+=texture2D(inputBuffer,vUv3);gl_FragColor=sum*0.25;
    #include <colorspace_fragment>
    }`,
    lB = "uniform vec4 texelSize;uniform float kernel;uniform float scale;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vec2 dUv=(texelSize.xy*vec2(kernel)+texelSize.zw)*scale;vUv0=vec2(uv.x-dUv.x,uv.y+dUv.y);vUv1=vec2(uv.x+dUv.x,uv.y+dUv.y);vUv2=vec2(uv.x+dUv.x,uv.y-dUv.y);vUv3=vec2(uv.x-dUv.x,uv.y-dUv.y);gl_Position=vec4(position.xy,1.0,1.0);}",
    cB = [new Float32Array([0, 0]), new Float32Array([0, 1, 1]), new Float32Array([0, 1, 1, 2]), new Float32Array([0, 1, 2, 2, 3]), new Float32Array([0, 1, 2, 3, 4, 4, 5]), new Float32Array([0, 1, 2, 3, 4, 5, 7, 8, 9, 10])],
    hB = class  extends fe{
        constructor(i=new yt)
        {
            super({
                name: "KawaseBlurMaterial",
                uniforms: {
                    inputBuffer: new Me(null),
                    texelSize: new Me(new yt),
                    scale: new Me(1),
                    kernel: new Me(0)
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                fragmentShader: oB,
                vertexShader: lB
            }),
            this.fragmentShader = Ko(this.fragmentShader),
            this.setTexelSize(i.x, i.y),
            this.kernelSize = fr.MEDIUM
        }
        set inputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        setInputBuffer(i)
        {
            this.inputBuffer = i
        }
        get kernelSequence()
        {
            return cB[this.kernelSize]
        }
        get scale()
        {
            return this.uniforms.scale.value
        }
        set scale(i)
        {
            this.uniforms.scale.value = i
        }
        getScale()
        {
            return this.uniforms.scale.value
        }
        setScale(i)
        {
            this.uniforms.scale.value = i
        }
        getKernel()
        {
            return null
        }
        get kernel()
        {
            return this.uniforms.kernel.value
        }
        set kernel(i)
        {
            this.uniforms.kernel.value = i
        }
        setKernel(i)
        {
            this.kernel = i
        }
        setTexelSize(i, e)
        {
            this.uniforms.texelSize.value.set(i, e, i * .5, e * .5)
        }
        setSize(i, e)
        {
            const t = 1 / i,
                s = 1 / e;
            this.uniforms.texelSize.value.set(t, s, t * .5, s * .5)
        }
    }
    ,
    Id = class  extends gs{
        constructor({kernelSize: i=fr.MEDIUM, resolutionScale: e=.5, width: t=ti.AUTO_SIZE, height: s=ti.AUTO_SIZE, resolutionX: n=t, resolutionY: r=s}={})
        {
            super("KawaseBlurPass"),
            this.renderTargetA = new vt(1, 1, {
                depthBuffer: !1
            }),
            this.renderTargetA.texture.name = "Blur.Target.A",
            this.renderTargetB = this.renderTargetA.clone(),
            this.renderTargetB.texture.name = "Blur.Target.B";
            const a = this.resolution = new ti(this, n, r, e);
            a.addEventListener("change", o => this.setSize(a.baseWidth, a.baseHeight)),
            this._blurMaterial = new hB,
            this._blurMaterial.kernelSize = i,
            this.copyMaterial = new XA
        }
        getResolution()
        {
            return this.resolution
        }
        get blurMaterial()
        {
            return this._blurMaterial
        }
        set blurMaterial(i)
        {
            this._blurMaterial = i
        }
        get dithering()
        {
            return this.copyMaterial.dithering
        }
        set dithering(i)
        {
            this.copyMaterial.dithering = i
        }
        get kernelSize()
        {
            return this.blurMaterial.kernelSize
        }
        set kernelSize(i)
        {
            this.blurMaterial.kernelSize = i
        }
        get width()
        {
            return this.resolution.width
        }
        set width(i)
        {
            this.resolution.preferredWidth = i
        }
        get height()
        {
            return this.resolution.height
        }
        set height(i)
        {
            this.resolution.preferredHeight = i
        }
        get scale()
        {
            return this.blurMaterial.scale
        }
        set scale(i)
        {
            this.blurMaterial.scale = i
        }
        getScale()
        {
            return this.blurMaterial.scale
        }
        setScale(i)
        {
            this.blurMaterial.scale = i
        }
        getKernelSize()
        {
            return this.kernelSize
        }
        setKernelSize(i)
        {
            this.kernelSize = i
        }
        getResolutionScale()
        {
            return this.resolution.scale
        }
        setResolutionScale(i)
        {
            this.resolution.scale = i
        }
        render(i, e, t, s, n)
        {
            const r = this.scene,
                a = this.camera,
                o = this.renderTargetA,
                l = this.renderTargetB,
                c = this.blurMaterial,
                h = c.kernelSequence;
            let d = e;
            this.fullscreenMaterial = c;
            for (let u = 0, f = h.length; u < f; ++u) {
                const p = u & 1 ? l : o;
                c.kernel = h[u],
                c.inputBuffer = d.texture,
                i.setRenderTarget(p),
                i.render(r, a),
                d = p
            }
            this.fullscreenMaterial = this.copyMaterial,
            this.copyMaterial.inputBuffer = d.texture,
            i.setRenderTarget(this.renderToScreen ? null : t),
            i.render(r, a)
        }
        setSize(i, e)
        {
            const t = this.resolution;
            t.setBaseSize(i, e);
            const s = t.width,
                n = t.height;
            this.renderTargetA.setSize(s, n),
            this.renderTargetB.setSize(s, n),
            this.blurMaterial.setSize(i, e)
        }
        initialize(i, e, t)
        {
            t !== void 0 && (this.renderTargetA.texture.type = t, this.renderTargetB.texture.type = t, t !== Ct ? (this.blurMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1", this.copyMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1") : i !== null && i.outputColorSpace === Ve && (this.renderTargetA.texture.colorSpace = Ve, this.renderTargetB.texture.colorSpace = Ve))
        }
        static get AUTO_SIZE()
        {
            return ti.AUTO_SIZE
        }
    }
    ,
    uB = `#include <common>
    #ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D inputBuffer;
    #else
    uniform lowp sampler2D inputBuffer;
    #endif
    #ifdef RANGE
    uniform vec2 range;
    #elif defined(THRESHOLD)
    uniform float threshold;uniform float smoothing;
    #endif
    varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);float l=luminance(texel.rgb);
    #ifdef RANGE
    float low=step(range.x,l);float high=step(l,range.y);l*=low*high;
    #elif defined(THRESHOLD)
    l=smoothstep(threshold,threshold+smoothing,l)*l;
    #endif
    #ifdef COLOR
    gl_FragColor=vec4(texel.rgb*clamp(l,0.0,1.0),l);
    #else
    gl_FragColor=vec4(l);
    #endif
    }`,
    dB = class  extends fe{
        constructor(i=!1, e=null)
        {
            super({
                name: "LuminanceMaterial",
                defines: {
                    THREE_REVISION: Aa.replace(/\D+/g, "")
                },
                uniforms: {
                    inputBuffer: new Me(null),
                    threshold: new Me(0),
                    smoothing: new Me(1),
                    range: new Me(null)
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                fragmentShader: uB,
                vertexShader: va
            }),
            this.colorOutput = i,
            this.luminanceRange = e
        }
        set inputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        setInputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        get threshold()
        {
            return this.uniforms.threshold.value
        }
        set threshold(i)
        {
            this.smoothing > 0 || i > 0 ? this.defines.THRESHOLD = "1" : delete this.defines.THRESHOLD,
            this.uniforms.threshold.value = i
        }
        getThreshold()
        {
            return this.threshold
        }
        setThreshold(i)
        {
            this.threshold = i
        }
        get smoothing()
        {
            return this.uniforms.smoothing.value
        }
        set smoothing(i)
        {
            this.threshold > 0 || i > 0 ? this.defines.THRESHOLD = "1" : delete this.defines.THRESHOLD,
            this.uniforms.smoothing.value = i
        }
        getSmoothingFactor()
        {
            return this.smoothing
        }
        setSmoothingFactor(i)
        {
            this.smoothing = i
        }
        get useThreshold()
        {
            return this.threshold > 0 || this.smoothing > 0
        }
        set useThreshold(i) {}
        get colorOutput()
        {
            return this.defines.COLOR !== void 0
        }
        set colorOutput(i)
        {
            i ? this.defines.COLOR = "1" : delete this.defines.COLOR,
            this.needsUpdate = !0
        }
        isColorOutputEnabled(i)
        {
            return this.colorOutput
        }
        setColorOutputEnabled(i)
        {
            this.colorOutput = i
        }
        get useRange()
        {
            return this.luminanceRange !== null
        }
        set useRange(i)
        {
            this.luminanceRange = null
        }
        get luminanceRange()
        {
            return this.uniforms.range.value
        }
        set luminanceRange(i)
        {
            i !== null ? this.defines.RANGE = "1" : delete this.defines.RANGE,
            this.uniforms.range.value = i,
            this.needsUpdate = !0
        }
        getLuminanceRange()
        {
            return this.luminanceRange
        }
        setLuminanceRange(i)
        {
            this.luminanceRange = i
        }
    }
    ,
    fB = class  extends gs{
        constructor({renderTarget: i, luminanceRange: e, colorOutput: t, resolutionScale: s=1, width: n=ti.AUTO_SIZE, height: r=ti.AUTO_SIZE, resolutionX: a=n, resolutionY: o=r}={})
        {
            super("LuminancePass"),
            this.fullscreenMaterial = new dB(t, e),
            this.needsSwap = !1,
            this.renderTarget = i,
            this.renderTarget === void 0 && (this.renderTarget = new vt(1, 1, {
                depthBuffer: !1
            }), this.renderTarget.texture.name = "LuminancePass.Target");
            const l = this.resolution = new ti(this, a, o, s);
            l.addEventListener("change", c => this.setSize(l.baseWidth, l.baseHeight))
        }
        get texture()
        {
            return this.renderTarget.texture
        }
        getTexture()
        {
            return this.renderTarget.texture
        }
        getResolution()
        {
            return this.resolution
        }
        render(i, e, t, s, n)
        {
            const r = this.fullscreenMaterial;
            r.inputBuffer = e.texture,
            i.setRenderTarget(this.renderToScreen ? null : this.renderTarget),
            i.render(this.scene, this.camera)
        }
        setSize(i, e)
        {
            const t = this.resolution;
            t.setBaseSize(i, e),
            this.renderTarget.setSize(t.width, t.height)
        }
        initialize(i, e, t)
        {
            t !== void 0 && t !== Ct && (this.renderTarget.texture.type = t, this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1")
        }
    }
    ,
    pB = `#ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D inputBuffer;
    #else
    uniform lowp sampler2D inputBuffer;
    #endif
    #define WEIGHT_INNER 0.125
    #define WEIGHT_OUTER 0.0555555
    varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;float clampToBorder(const in vec2 uv){return float(uv.s>=0.0&&uv.s<=1.0&&uv.t>=0.0&&uv.t<=1.0);}void main(){vec4 c=vec4(0.0);vec4 w=WEIGHT_INNER*vec4(clampToBorder(vUv00),clampToBorder(vUv01),clampToBorder(vUv02),clampToBorder(vUv03));c+=w.x*texture2D(inputBuffer,vUv00);c+=w.y*texture2D(inputBuffer,vUv01);c+=w.z*texture2D(inputBuffer,vUv02);c+=w.w*texture2D(inputBuffer,vUv03);w=WEIGHT_OUTER*vec4(clampToBorder(vUv04),clampToBorder(vUv05),clampToBorder(vUv06),clampToBorder(vUv07));c+=w.x*texture2D(inputBuffer,vUv04);c+=w.y*texture2D(inputBuffer,vUv05);c+=w.z*texture2D(inputBuffer,vUv06);c+=w.w*texture2D(inputBuffer,vUv07);w=WEIGHT_OUTER*vec4(clampToBorder(vUv08),clampToBorder(vUv09),clampToBorder(vUv10),clampToBorder(vUv11));c+=w.x*texture2D(inputBuffer,vUv08);c+=w.y*texture2D(inputBuffer,vUv09);c+=w.z*texture2D(inputBuffer,vUv10);c+=w.w*texture2D(inputBuffer,vUv11);c+=WEIGHT_OUTER*texture2D(inputBuffer,vUv);gl_FragColor=c;
    #include <colorspace_fragment>
    }`,
    mB = "uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;void main(){vUv=position.xy*0.5+0.5;vUv00=vUv+texelSize*vec2(-1.0,1.0);vUv01=vUv+texelSize*vec2(1.0,1.0);vUv02=vUv+texelSize*vec2(-1.0,-1.0);vUv03=vUv+texelSize*vec2(1.0,-1.0);vUv04=vUv+texelSize*vec2(-2.0,2.0);vUv05=vUv+texelSize*vec2(0.0,2.0);vUv06=vUv+texelSize*vec2(2.0,2.0);vUv07=vUv+texelSize*vec2(-2.0,0.0);vUv08=vUv+texelSize*vec2(2.0,0.0);vUv09=vUv+texelSize*vec2(-2.0,-2.0);vUv10=vUv+texelSize*vec2(0.0,-2.0);vUv11=vUv+texelSize*vec2(2.0,-2.0);gl_Position=vec4(position.xy,1.0,1.0);}",
    AB = class  extends fe{
        constructor()
        {
            super({
                name: "DownsamplingMaterial",
                uniforms: {
                    inputBuffer: new Me(null),
                    texelSize: new Me(new H)
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                fragmentShader: pB,
                vertexShader: mB
            }),
            this.fragmentShader = Ko(this.fragmentShader)
        }
        set inputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        setSize(i, e)
        {
            this.uniforms.texelSize.value.set(1 / i, 1 / e)
        }
    }
    ,
    gB = `#ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D inputBuffer;uniform mediump sampler2D supportBuffer;
    #else
    uniform lowp sampler2D inputBuffer;uniform lowp sampler2D supportBuffer;
    #endif
    uniform float radius;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vec4 c=vec4(0.0);c+=texture2D(inputBuffer,vUv0)*0.0625;c+=texture2D(inputBuffer,vUv1)*0.125;c+=texture2D(inputBuffer,vUv2)*0.0625;c+=texture2D(inputBuffer,vUv3)*0.125;c+=texture2D(inputBuffer,vUv)*0.25;c+=texture2D(inputBuffer,vUv4)*0.125;c+=texture2D(inputBuffer,vUv5)*0.0625;c+=texture2D(inputBuffer,vUv6)*0.125;c+=texture2D(inputBuffer,vUv7)*0.0625;vec4 baseColor=texture2D(supportBuffer,vUv);gl_FragColor=mix(baseColor,c,radius);
    #include <colorspace_fragment>
    }`,
    vB = "uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,1.0);vUv1=vUv+texelSize*vec2(0.0,1.0);vUv2=vUv+texelSize*vec2(1.0,1.0);vUv3=vUv+texelSize*vec2(-1.0,0.0);vUv4=vUv+texelSize*vec2(1.0,0.0);vUv5=vUv+texelSize*vec2(-1.0,-1.0);vUv6=vUv+texelSize*vec2(0.0,-1.0);vUv7=vUv+texelSize*vec2(1.0,-1.0);gl_Position=vec4(position.xy,1.0,1.0);}",
    xB = class  extends fe{
        constructor()
        {
            super({
                name: "UpsamplingMaterial",
                uniforms: {
                    inputBuffer: new Me(null),
                    supportBuffer: new Me(null),
                    texelSize: new Me(new H),
                    radius: new Me(.85)
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                fragmentShader: gB,
                vertexShader: vB
            }),
            this.fragmentShader = Ko(this.fragmentShader)
        }
        set inputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        set supportBuffer(i)
        {
            this.uniforms.supportBuffer.value = i
        }
        get radius()
        {
            return this.uniforms.radius.value
        }
        set radius(i)
        {
            this.uniforms.radius.value = i
        }
        setSize(i, e)
        {
            this.uniforms.texelSize.value.set(1 / i, 1 / e)
        }
    }
    ,
    yB = class  extends gs{
        constructor()
        {
            super("MipmapBlurPass"),
            this.needsSwap = !1,
            this.renderTarget = new vt(1, 1, {
                depthBuffer: !1
            }),
            this.renderTarget.texture.name = "Upsampling.Mipmap0",
            this.downsamplingMipmaps = [],
            this.upsamplingMipmaps = [],
            this.downsamplingMaterial = new AB,
            this.upsamplingMaterial = new xB,
            this.resolution = new H
        }
        get texture()
        {
            return this.renderTarget.texture
        }
        get levels()
        {
            return this.downsamplingMipmaps.length
        }
        set levels(i)
        {
            if (this.levels !== i) {
                const e = this.renderTarget;
                this.dispose(),
                this.downsamplingMipmaps = [],
                this.upsamplingMipmaps = [];
                for (let t = 0; t < i; ++t) {
                    const s = e.clone();
                    s.texture.name = "Downsampling.Mipmap" + t,
                    this.downsamplingMipmaps.push(s)
                }
                this.upsamplingMipmaps.push(e);
                for (let t = 1, s = i - 1; t < s; ++t) {
                    const n = e.clone();
                    n.texture.name = "Upsampling.Mipmap" + t,
                    this.upsamplingMipmaps.push(n)
                }
                this.setSize(this.resolution.x, this.resolution.y)
            }
        }
        get radius()
        {
            return this.upsamplingMaterial.radius
        }
        set radius(i)
        {
            this.upsamplingMaterial.radius = i
        }
        render(i, e, t, s, n)
        {
            const {scene: r, camera: a} = this,
                {downsamplingMaterial: o, upsamplingMaterial: l} = this,
                {downsamplingMipmaps: c, upsamplingMipmaps: h} = this;
            let d = e;
            this.fullscreenMaterial = o;
            for (let u = 0, f = c.length; u < f; ++u) {
                const p = c[u];
                o.setSize(d.width, d.height),
                o.inputBuffer = d.texture,
                i.setRenderTarget(p),
                i.render(r, a),
                d = p
            }
            this.fullscreenMaterial = l;
            for (let u = h.length - 1; u >= 0; --u) {
                const f = h[u];
                l.setSize(d.width, d.height),
                l.inputBuffer = d.texture,
                l.supportBuffer = c[u].texture,
                i.setRenderTarget(f),
                i.render(r, a),
                d = f
            }
        }
        setSize(i, e)
        {
            const t = this.resolution;
            t.set(i, e);
            let s = t.width,
                n = t.height;
            for (let r = 0, a = this.downsamplingMipmaps.length; r < a; ++r)
                s = Math.round(s * .5),
                n = Math.round(n * .5),
                this.downsamplingMipmaps[r].setSize(s, n),
                r < this.upsamplingMipmaps.length && this.upsamplingMipmaps[r].setSize(s, n)
        }
        initialize(i, e, t)
        {
            if (t !== void 0) {
                const s = this.downsamplingMipmaps.concat(this.upsamplingMipmaps);
                for (const n of s)
                    n.texture.type = t;
                if (t !== Ct)
                    this.downsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1",
                    this.upsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
                else if (i !== null && i.outputColorSpace === Ve)
                    for (const n of s)
                        n.texture.colorSpace = Ve
            }
        }
        dispose()
        {
            super.dispose();
            for (const i of this.downsamplingMipmaps.concat(this.upsamplingMipmaps))
                i.dispose()
        }
    }
    ,
    Bc = class  extends hn{
        constructor(i, e, {attributes: t=Is.NONE, blendFunction: s=ct.NORMAL, defines: n=new Map, uniforms: r=new Map, extensions: a=null, vertexShader: o=null}={})
        {
            super(),
            this.name = i,
            this.renderer = null,
            this.attributes = t,
            this.fragmentShader = e,
            this.vertexShader = o,
            this.defines = n,
            this.uniforms = r,
            this.extensions = a,
            this.blendMode = new aB(s),
            this.blendMode.addEventListener("change", l => this.setChanged()),
            this._inputColorSpace = oi,
            this._outputColorSpace = _s
        }
        get inputColorSpace()
        {
            return this._inputColorSpace
        }
        set inputColorSpace(i)
        {
            this._inputColorSpace = i,
            this.setChanged()
        }
        get outputColorSpace()
        {
            return this._outputColorSpace
        }
        set outputColorSpace(i)
        {
            this._outputColorSpace = i,
            this.setChanged()
        }
        set mainScene(i) {}
        set mainCamera(i) {}
        getName()
        {
            return this.name
        }
        setRenderer(i)
        {
            this.renderer = i
        }
        getDefines()
        {
            return this.defines
        }
        getUniforms()
        {
            return this.uniforms
        }
        getExtensions()
        {
            return this.extensions
        }
        getBlendMode()
        {
            return this.blendMode
        }
        getAttributes()
        {
            return this.attributes
        }
        setAttributes(i)
        {
            this.attributes = i,
            this.setChanged()
        }
        getFragmentShader()
        {
            return this.fragmentShader
        }
        setFragmentShader(i)
        {
            this.fragmentShader = i,
            this.setChanged()
        }
        getVertexShader()
        {
            return this.vertexShader
        }
        setVertexShader(i)
        {
            this.vertexShader = i,
            this.setChanged()
        }
        setChanged()
        {
            this.dispatchEvent({
                type: "change"
            })
        }
        setDepthTexture(i, e=ms) {}
        update(i, e, t) {}
        setSize(i, e) {}
        initialize(i, e, t) {}
        dispose()
        {
            for (const i of Object.keys(this)) {
                const e = this[i];
                (e instanceof vt || e instanceof fs || e instanceof Rt || e instanceof gs) && this[i].dispose()
            }
        }
    }
    ,
    _B = `#ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D map;
    #else
    uniform lowp sampler2D map;
    #endif
    uniform float intensity;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec4 texel=texture2D(map,uv);outputColor=vec4(texel.rgb*intensity,texel.a);}`,
    n_ = class  extends Bc{
        constructor({blendFunction: i=ct.SCREEN, luminanceThreshold: e=.9, luminanceSmoothing: t=.025, mipmapBlur: s=!1, intensity: n=1, radius: r=.85, levels: a=8, kernelSize: o=fr.LARGE, resolutionScale: l=.5, width: c=ti.AUTO_SIZE, height: h=ti.AUTO_SIZE, resolutionX: d=c, resolutionY: u=h}={})
        {
            super("BloomEffect", _B, {
                blendFunction: i,
                uniforms: new Map([["map", new Me(null)], ["intensity", new Me(n)]])
            }),
            this.renderTarget = new vt(1, 1, {
                depthBuffer: !1
            }),
            this.renderTarget.texture.name = "Bloom.Target",
            this.blurPass = new Id({
                kernelSize: o
            }),
            this.luminancePass = new fB({
                colorOutput: !0
            }),
            this.luminanceMaterial.threshold = e,
            this.luminanceMaterial.smoothing = t,
            this.mipmapBlurPass = new yB,
            this.mipmapBlurPass.enabled = s,
            this.mipmapBlurPass.radius = r,
            this.mipmapBlurPass.levels = a,
            this.uniforms.get("map").value = s ? this.mipmapBlurPass.texture : this.renderTarget.texture;
            const f = this.resolution = new ti(this, d, u, l);
            f.addEventListener("change", p => this.setSize(f.baseWidth, f.baseHeight))
        }
        get texture()
        {
            return this.mipmapBlurPass.enabled ? this.mipmapBlurPass.texture : this.renderTarget.texture
        }
        getTexture()
        {
            return this.texture
        }
        getResolution()
        {
            return this.resolution
        }
        getBlurPass()
        {
            return this.blurPass
        }
        getLuminancePass()
        {
            return this.luminancePass
        }
        get luminanceMaterial()
        {
            return this.luminancePass.fullscreenMaterial
        }
        getLuminanceMaterial()
        {
            return this.luminancePass.fullscreenMaterial
        }
        get width()
        {
            return this.resolution.width
        }
        set width(i)
        {
            this.resolution.preferredWidth = i
        }
        get height()
        {
            return this.resolution.height
        }
        set height(i)
        {
            this.resolution.preferredHeight = i
        }
        get dithering()
        {
            return this.blurPass.dithering
        }
        set dithering(i)
        {
            this.blurPass.dithering = i
        }
        get kernelSize()
        {
            return this.blurPass.kernelSize
        }
        set kernelSize(i)
        {
            this.blurPass.kernelSize = i
        }
        get distinction()
        {
            return console.warn(this.name, "distinction was removed"), 1
        }
        set distinction(i)
        {
            console.warn(this.name, "distinction was removed")
        }
        get intensity()
        {
            return this.uniforms.get("intensity").value
        }
        set intensity(i)
        {
            this.uniforms.get("intensity").value = i
        }
        getIntensity()
        {
            return this.intensity
        }
        setIntensity(i)
        {
            this.intensity = i
        }
        getResolutionScale()
        {
            return this.resolution.scale
        }
        setResolutionScale(i)
        {
            this.resolution.scale = i
        }
        update(i, e, t)
        {
            const s = this.renderTarget,
                n = this.luminancePass;
            n.enabled ? (n.render(i, e), this.mipmapBlurPass.enabled ? this.mipmapBlurPass.render(i, n.renderTarget) : this.blurPass.render(i, n.renderTarget, s)) : this.mipmapBlurPass.enabled ? this.mipmapBlurPass.render(i, e) : this.blurPass.render(i, e, s)
        }
        setSize(i, e)
        {
            const t = this.resolution;
            t.setBaseSize(i, e),
            this.renderTarget.setSize(t.width, t.height),
            this.blurPass.resolution.copy(t),
            this.luminancePass.setSize(i, e),
            this.mipmapBlurPass.setSize(i, e)
        }
        initialize(i, e, t)
        {
            this.blurPass.initialize(i, e, t),
            this.luminancePass.initialize(i, e, t),
            this.mipmapBlurPass.initialize(i, e, t),
            t !== void 0 && (this.renderTarget.texture.type = t, i !== null && i.outputColorSpace === Ve && (this.renderTarget.texture.colorSpace = Ve))
        }
    }
    ,
    r_ = {
        RED: 0,
        GREEN: 1,
        BLUE: 2,
        ALPHA: 3
    },
    a_ = {
        DISCARD: 0,
        MULTIPLY: 1,
        MULTIPLY_RGB_SET_ALPHA: 2,
        MULTIPLY_RGB: 3
    },
    wB = `#ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D inputBuffer;
    #else
    uniform lowp sampler2D inputBuffer;
    #endif
    #if PASS == 1
    uniform vec4 kernel64[32];
    #else
    uniform vec4 kernel16[8];
    #endif
    uniform lowp sampler2D cocBuffer;uniform vec2 texelSize;uniform float scale;varying vec2 vUv;void main(){
    #ifdef FOREGROUND
    vec2 cocNearFar=texture2D(cocBuffer,vUv).rg*scale;float coc=cocNearFar.x;
    #else
    float coc=texture2D(cocBuffer,vUv).g*scale;
    #endif
    if(coc==0.0){gl_FragColor=texture2D(inputBuffer,vUv);}else{
    #ifdef FOREGROUND
    vec2 step=texelSize*max(cocNearFar.x,cocNearFar.y);
    #else
    vec2 step=texelSize*coc;
    #endif
    #if PASS == 1
    vec4 acc=vec4(0.0);for(int i=0;i<32;++i){vec4 kernel=kernel64[i];vec2 uv=step*kernel.xy+vUv;acc+=texture2D(inputBuffer,uv);uv=step*kernel.zw+vUv;acc+=texture2D(inputBuffer,uv);}gl_FragColor=acc/64.0;
    #else
    vec4 maxValue=texture2D(inputBuffer,vUv);for(int i=0;i<8;++i){vec4 kernel=kernel16[i];vec2 uv=step*kernel.xy+vUv;maxValue=max(texture2D(inputBuffer,uv),maxValue);uv=step*kernel.zw+vUv;maxValue=max(texture2D(inputBuffer,uv),maxValue);}gl_FragColor=maxValue;
    #endif
    }}`,
    xh = class  extends fe{
        constructor(i=!1, e=!1)
        {
            super({
                name: "BokehMaterial",
                defines: {
                    PASS: i ? "2" : "1"
                },
                uniforms: {
                    inputBuffer: new Me(null),
                    cocBuffer: new Me(null),
                    texelSize: new Me(new H),
                    kernel64: new Me(null),
                    kernel16: new Me(null),
                    scale: new Me(1)
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                fragmentShader: wB,
                vertexShader: va
            }),
            e && (this.defines.FOREGROUND = "1"),
            this.generateKernel()
        }
        set inputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        setInputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        set cocBuffer(i)
        {
            this.uniforms.cocBuffer.value = i
        }
        setCoCBuffer(i)
        {
            this.uniforms.cocBuffer.value = i
        }
        get scale()
        {
            return this.uniforms.scale.value
        }
        set scale(i)
        {
            this.uniforms.scale.value = i
        }
        getScale(i)
        {
            return this.scale
        }
        setScale(i)
        {
            this.scale = i
        }
        generateKernel()
        {
            const i = 2.39996323,
                e = new Float64Array(128),
                t = new Float64Array(32);
            let s = 0,
                n = 0;
            for (let r = 0, a = Math.sqrt(80); r < 80; ++r) {
                const o = r * i,
                    l = Math.sqrt(r) / a,
                    c = l * Math.cos(o),
                    h = l * Math.sin(o);
                r % 5 === 0 ? (t[n++] = c, t[n++] = h) : (e[s++] = c, e[s++] = h)
            }
            this.uniforms.kernel64.value = e,
            this.uniforms.kernel16.value = t
        }
        setTexelSize(i, e)
        {
            this.uniforms.texelSize.value.set(i, e)
        }
        setSize(i, e)
        {
            this.uniforms.texelSize.value.set(1 / i, 1 / e)
        }
    }
    ;
function I0(i, e, t) {
    return i * (e - t) - e
}
function Wp(i, e, t) {
    return Math.min(Math.max((i + e) / (e - t), 0), 1)
}
var EB = `#include <common>
    #include <packing>
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    uniform highp sampler2D depthBuffer;
    #else
    uniform mediump sampler2D depthBuffer;
    #endif
    uniform float focusDistance;uniform float focusRange;uniform float cameraNear;uniform float cameraFar;varying vec2 vUv;float readDepth(const in vec2 uv){
    #if DEPTH_PACKING == 3201
    float depth=unpackRGBAToDepth(texture2D(depthBuffer,uv));
    #else
    float depth=texture2D(depthBuffer,uv).r;
    #endif
    #ifdef LOG_DEPTH
    float d=pow(2.0,depth*log2(cameraFar+1.0))-1.0;float a=cameraFar/(cameraFar-cameraNear);float b=cameraFar*cameraNear/(cameraNear-cameraFar);depth=a+b/d;
    #endif
    return depth;}void main(){float depth=readDepth(vUv);
    #ifdef PERSPECTIVE_CAMERA
    float viewZ=perspectiveDepthToViewZ(depth,cameraNear,cameraFar);float linearDepth=viewZToOrthographicDepth(viewZ,cameraNear,cameraFar);
    #else
    float linearDepth=depth;
    #endif
    float signedDistance=linearDepth-focusDistance;float magnitude=smoothstep(0.0,focusRange,abs(signedDistance));gl_FragColor.rg=magnitude*vec2(step(signedDistance,0.0),step(0.0,signedDistance));}`,
    CB = class  extends fe{
        constructor(i)
        {
            super({
                name: "CircleOfConfusionMaterial",
                defines: {
                    DEPTH_PACKING: "0"
                },
                uniforms: {
                    depthBuffer: new Me(null),
                    focusDistance: new Me(0),
                    focusRange: new Me(0),
                    cameraNear: new Me(.3),
                    cameraFar: new Me(1e3)
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                fragmentShader: EB,
                vertexShader: va
            }),
            this.uniforms.focalLength = this.uniforms.focusRange,
            this.copyCameraSettings(i)
        }
        get near()
        {
            return this.uniforms.cameraNear.value
        }
        get far()
        {
            return this.uniforms.cameraFar.value
        }
        set depthBuffer(i)
        {
            this.uniforms.depthBuffer.value = i
        }
        set depthPacking(i)
        {
            this.defines.DEPTH_PACKING = i.toFixed(0),
            this.needsUpdate = !0
        }
        setDepthBuffer(i, e=ms)
        {
            this.depthBuffer = i,
            this.depthPacking = e
        }
        get focusDistance()
        {
            return this.uniforms.focusDistance.value
        }
        set focusDistance(i)
        {
            this.uniforms.focusDistance.value = i
        }
        get worldFocusDistance()
        {
            return -I0(this.focusDistance, this.near, this.far)
        }
        set worldFocusDistance(i)
        {
            this.focusDistance = Wp(-i, this.near, this.far)
        }
        getFocusDistance(i)
        {
            this.uniforms.focusDistance.value = i
        }
        setFocusDistance(i)
        {
            this.uniforms.focusDistance.value = i
        }
        get focalLength()
        {
            return this.focusRange
        }
        set focalLength(i)
        {
            this.focusRange = i
        }
        get focusRange()
        {
            return this.uniforms.focusRange.value
        }
        set focusRange(i)
        {
            this.uniforms.focusRange.value = i
        }
        get worldFocusRange()
        {
            return -I0(this.focusRange, this.near, this.far)
        }
        set worldFocusRange(i)
        {
            this.focusRange = Wp(-i, this.near, this.far)
        }
        getFocalLength(i)
        {
            return this.focusRange
        }
        setFocalLength(i)
        {
            this.focusRange = i
        }
        adoptCameraSettings(i)
        {
            this.copyCameraSettings(i)
        }
        copyCameraSettings(i)
        {
            i && (this.uniforms.cameraNear.value = i.near, this.uniforms.cameraFar.value = i.far, i instanceof gi ? this.defines.PERSPECTIVE_CAMERA = "1" : delete this.defines.PERSPECTIVE_CAMERA, this.needsUpdate = !0)
        }
    }
    ,
    SB = `#ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D inputBuffer;
    #else
    uniform lowp sampler2D inputBuffer;
    #endif
    #ifdef MASK_PRECISION_HIGH
    uniform mediump sampler2D maskTexture;
    #else
    uniform lowp sampler2D maskTexture;
    #endif
    #if MASK_FUNCTION != 0
    uniform float strength;
    #endif
    varying vec2 vUv;void main(){
    #if COLOR_CHANNEL == 0
    float mask=texture2D(maskTexture,vUv).r;
    #elif COLOR_CHANNEL == 1
    float mask=texture2D(maskTexture,vUv).g;
    #elif COLOR_CHANNEL == 2
    float mask=texture2D(maskTexture,vUv).b;
    #else
    float mask=texture2D(maskTexture,vUv).a;
    #endif
    #if MASK_FUNCTION == 0
    #ifdef INVERTED
    mask=step(mask,0.0);
    #else
    mask=1.0-step(mask,0.0);
    #endif
    #else
    mask=clamp(mask*strength,0.0,1.0);
    #ifdef INVERTED
    mask=1.0-mask;
    #endif
    #endif
    #if MASK_FUNCTION == 3
    vec4 texel=texture2D(inputBuffer,vUv);gl_FragColor=vec4(mask*texel.rgb,texel.a);
    #elif MASK_FUNCTION == 2
    gl_FragColor=vec4(mask*texture2D(inputBuffer,vUv).rgb,mask);
    #else
    gl_FragColor=mask*texture2D(inputBuffer,vUv);
    #endif
    }`,
    MB = class  extends fe{
        constructor(i=null)
        {
            super({
                name: "MaskMaterial",
                uniforms: {
                    maskTexture: new Me(i),
                    inputBuffer: new Me(null),
                    strength: new Me(1)
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                fragmentShader: SB,
                vertexShader: va
            }),
            this.colorChannel = r_.RED,
            this.maskFunction = a_.DISCARD
        }
        set inputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        setInputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        set maskTexture(i)
        {
            this.uniforms.maskTexture.value = i,
            delete this.defines.MASK_PRECISION_HIGH,
            i.type !== Ct && (this.defines.MASK_PRECISION_HIGH = "1"),
            this.needsUpdate = !0
        }
        setMaskTexture(i)
        {
            this.maskTexture = i
        }
        set colorChannel(i)
        {
            this.defines.COLOR_CHANNEL = i.toFixed(0),
            this.needsUpdate = !0
        }
        setColorChannel(i)
        {
            this.colorChannel = i
        }
        set maskFunction(i)
        {
            this.defines.MASK_FUNCTION = i.toFixed(0),
            this.needsUpdate = !0
        }
        setMaskFunction(i)
        {
            this.maskFunction = i
        }
        get inverted()
        {
            return this.defines.INVERTED !== void 0
        }
        set inverted(i)
        {
            this.inverted && !i ? delete this.defines.INVERTED : i && (this.defines.INVERTED = "1"),
            this.needsUpdate = !0
        }
        isInverted()
        {
            return this.inverted
        }
        setInverted(i)
        {
            this.inverted = i
        }
        get strength()
        {
            return this.uniforms.strength.value
        }
        set strength(i)
        {
            this.uniforms.strength.value = i
        }
        getStrength()
        {
            return this.strength
        }
        setStrength(i)
        {
            this.strength = i
        }
    }
    ,
    Os = class  extends gs{
        constructor(e, t="inputBuffer")
        {
            super("ShaderPass"),
            this.fullscreenMaterial = e,
            this.input = t
        }
        setInput(e)
        {
            this.input = e
        }
        render(e, t, s, n, r)
        {
            const a = this.fullscreenMaterial.uniforms;
            t !== null && a !== void 0 && a[this.input] !== void 0 && (a[this.input].value = t.texture),
            e.setRenderTarget(this.renderToScreen ? null : s),
            e.render(this.scene, this.camera)
        }
        initialize(e, t, s)
        {
            s !== void 0 && s !== Ct && (this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1")
        }
    }
    ,
    bB = `#ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D nearColorBuffer;uniform mediump sampler2D farColorBuffer;
    #else
    uniform lowp sampler2D nearColorBuffer;uniform lowp sampler2D farColorBuffer;
    #endif
    uniform lowp sampler2D nearCoCBuffer;uniform lowp sampler2D farCoCBuffer;uniform float scale;void mainImage(const in vec4 inputColor,const in vec2 uv,const in float depth,out vec4 outputColor){vec4 colorNear=texture2D(nearColorBuffer,uv);vec4 colorFar=texture2D(farColorBuffer,uv);
    #if MASK_FUNCTION == 1
    vec2 cocNearFar=vec2(texture2D(nearCoCBuffer,uv).r,colorFar.a);cocNearFar.x=min(cocNearFar.x*scale,1.0);
    #else
    vec2 cocNearFar=vec2(texture2D(nearCoCBuffer,uv).r,texture2D(farCoCBuffer,uv).g);cocNearFar=min(cocNearFar*scale,1.0);
    #endif
    vec4 result=inputColor*(1.0-cocNearFar.y)+colorFar;result=mix(result,colorNear,cocNearFar.x);outputColor=result;}`,
    TB = class  extends Bc{
        constructor(i, {blendFunction: e, worldFocusDistance: t, worldFocusRange: s, focusDistance: n=0, focalLength: r=.1, focusRange: a=r, bokehScale: o=1, resolutionScale: l=1, width: c=ti.AUTO_SIZE, height: h=ti.AUTO_SIZE, resolutionX: d=c, resolutionY: u=h}={})
        {
            super("DepthOfFieldEffect", bB, {
                blendFunction: e,
                attributes: Is.DEPTH,
                uniforms: new Map([["nearColorBuffer", new Me(null)], ["farColorBuffer", new Me(null)], ["nearCoCBuffer", new Me(null)], ["farCoCBuffer", new Me(null)], ["scale", new Me(1)]])
            }),
            this.camera = i,
            this.renderTarget = new vt(1, 1, {
                depthBuffer: !1
            }),
            this.renderTarget.texture.name = "DoF.Intermediate",
            this.renderTargetMasked = this.renderTarget.clone(),
            this.renderTargetMasked.texture.name = "DoF.Masked.Far",
            this.renderTargetNear = this.renderTarget.clone(),
            this.renderTargetNear.texture.name = "DoF.Bokeh.Near",
            this.uniforms.get("nearColorBuffer").value = this.renderTargetNear.texture,
            this.renderTargetFar = this.renderTarget.clone(),
            this.renderTargetFar.texture.name = "DoF.Bokeh.Far",
            this.uniforms.get("farColorBuffer").value = this.renderTargetFar.texture,
            this.renderTargetCoC = this.renderTarget.clone(),
            this.renderTargetCoC.texture.name = "DoF.CoC",
            this.uniforms.get("farCoCBuffer").value = this.renderTargetCoC.texture,
            this.renderTargetCoCBlurred = this.renderTargetCoC.clone(),
            this.renderTargetCoCBlurred.texture.name = "DoF.CoC.Blurred",
            this.uniforms.get("nearCoCBuffer").value = this.renderTargetCoCBlurred.texture,
            this.cocPass = new Os(new CB(i));
            const f = this.cocMaterial;
            f.focusDistance = n,
            f.focusRange = a,
            t !== void 0 && (f.worldFocusDistance = t),
            s !== void 0 && (f.worldFocusRange = s),
            this.blurPass = new Id({
                resolutionScale: l,
                resolutionX: d,
                resolutionY: u,
                kernelSize: fr.MEDIUM
            }),
            this.maskPass = new Os(new MB(this.renderTargetCoC.texture));
            const p = this.maskPass.fullscreenMaterial;
            p.colorChannel = r_.GREEN,
            this.maskFunction = a_.MULTIPLY_RGB,
            this.bokehNearBasePass = new Os(new xh(!1, !0)),
            this.bokehNearBasePass.fullscreenMaterial.cocBuffer = this.renderTargetCoCBlurred.texture,
            this.bokehNearFillPass = new Os(new xh(!0, !0)),
            this.bokehNearFillPass.fullscreenMaterial.cocBuffer = this.renderTargetCoCBlurred.texture,
            this.bokehFarBasePass = new Os(new xh(!1, !1)),
            this.bokehFarBasePass.fullscreenMaterial.cocBuffer = this.renderTargetCoC.texture,
            this.bokehFarFillPass = new Os(new xh(!0, !1)),
            this.bokehFarFillPass.fullscreenMaterial.cocBuffer = this.renderTargetCoC.texture,
            this.target = null;
            const A = this.resolution = new ti(this, d, u, l);
            A.addEventListener("change", m => this.setSize(A.baseWidth, A.baseHeight)),
            this.bokehScale = o
        }
        set mainCamera(i)
        {
            this.camera = i,
            this.cocMaterial.copyCameraSettings(i)
        }
        get cocTexture()
        {
            return this.renderTargetCoC.texture
        }
        get maskFunction()
        {
            return this.maskPass.fullscreenMaterial.maskFunction
        }
        set maskFunction(i)
        {
            this.maskFunction !== i && (this.defines.set("MASK_FUNCTION", i.toFixed(0)), this.maskPass.fullscreenMaterial.maskFunction = i, this.setChanged())
        }
        get cocMaterial()
        {
            return this.cocPass.fullscreenMaterial
        }
        get circleOfConfusionMaterial()
        {
            return this.cocMaterial
        }
        getCircleOfConfusionMaterial()
        {
            return this.cocMaterial
        }
        getBlurPass()
        {
            return this.blurPass
        }
        getResolution()
        {
            return this.resolution
        }
        get bokehScale()
        {
            return this.uniforms.get("scale").value
        }
        set bokehScale(i)
        {
            this.bokehNearBasePass.fullscreenMaterial.scale = i,
            this.bokehNearFillPass.fullscreenMaterial.scale = i,
            this.bokehFarBasePass.fullscreenMaterial.scale = i,
            this.bokehFarFillPass.fullscreenMaterial.scale = i,
            this.maskPass.fullscreenMaterial.strength = i,
            this.uniforms.get("scale").value = i
        }
        getBokehScale()
        {
            return this.bokehScale
        }
        setBokehScale(i)
        {
            this.bokehScale = i
        }
        getTarget()
        {
            return this.target
        }
        setTarget(i)
        {
            this.target = i
        }
        calculateFocusDistance(i)
        {
            const e = this.camera,
                t = e.position.distanceTo(i);
            return Wp(-t, e.near, e.far)
        }
        setDepthTexture(i, e=ms)
        {
            this.cocMaterial.depthBuffer = i,
            this.cocMaterial.depthPacking = e
        }
        update(i, e, t)
        {
            const s = this.renderTarget,
                n = this.renderTargetCoC,
                r = this.renderTargetCoCBlurred,
                a = this.renderTargetMasked;
            if (this.target !== null) {
                const o = this.calculateFocusDistance(this.target);
                this.cocMaterial.focusDistance = o
            }
            this.cocPass.render(i, null, n),
            this.blurPass.render(i, n, r),
            this.maskPass.render(i, e, a),
            this.bokehFarBasePass.render(i, a, s),
            this.bokehFarFillPass.render(i, s, this.renderTargetFar),
            this.bokehNearBasePass.render(i, e, s),
            this.bokehNearFillPass.render(i, s, this.renderTargetNear)
        }
        setSize(i, e)
        {
            const t = this.resolution;
            t.setBaseSize(i, e);
            const s = t.width,
                n = t.height;
            this.cocPass.setSize(i, e),
            this.blurPass.setSize(i, e),
            this.maskPass.setSize(i, e),
            this.renderTargetFar.setSize(i, e),
            this.renderTargetCoC.setSize(i, e),
            this.renderTargetMasked.setSize(i, e),
            this.renderTarget.setSize(s, n),
            this.renderTargetNear.setSize(s, n),
            this.renderTargetCoCBlurred.setSize(s, n),
            this.bokehNearBasePass.fullscreenMaterial.setSize(i, e),
            this.bokehNearFillPass.fullscreenMaterial.setSize(i, e),
            this.bokehFarBasePass.fullscreenMaterial.setSize(i, e),
            this.bokehFarFillPass.fullscreenMaterial.setSize(i, e)
        }
        initialize(i, e, t)
        {
            this.cocPass.initialize(i, e, t),
            this.maskPass.initialize(i, e, t),
            this.bokehNearBasePass.initialize(i, e, t),
            this.bokehNearFillPass.initialize(i, e, t),
            this.bokehFarBasePass.initialize(i, e, t),
            this.bokehFarFillPass.initialize(i, e, t),
            this.blurPass.initialize(i, e, Ct),
            i.capabilities.logarithmicDepthBuffer && (this.cocPass.fullscreenMaterial.defines.LOG_DEPTH = "1"),
            t !== void 0 && (this.renderTarget.texture.type = t, this.renderTargetNear.texture.type = t, this.renderTargetFar.texture.type = t, this.renderTargetMasked.texture.type = t, i !== null && i.outputColorSpace === Ve && (this.renderTarget.texture.colorSpace = Ve, this.renderTargetNear.texture.colorSpace = Ve, this.renderTargetFar.texture.colorSpace = Ve, this.renderTargetMasked.texture.colorSpace = Ve))
        }
    }
    ,
    IB = `#define QUALITY(q) ((q) < 5 ? 1.0 : ((q) > 5 ? ((q) < 10 ? 2.0 : ((q) < 11 ? 4.0 : 8.0)) : 1.5))
    #define ONE_OVER_TWELVE 0.08333333333333333
    varying vec2 vUvDown;varying vec2 vUvUp;varying vec2 vUvLeft;varying vec2 vUvRight;varying vec2 vUvDownLeft;varying vec2 vUvUpRight;varying vec2 vUvUpLeft;varying vec2 vUvDownRight;vec4 fxaa(const in vec4 inputColor,const in vec2 uv){float lumaCenter=luminance(inputColor.rgb);float lumaDown=luminance(texture2D(inputBuffer,vUvDown).rgb);float lumaUp=luminance(texture2D(inputBuffer,vUvUp).rgb);float lumaLeft=luminance(texture2D(inputBuffer,vUvLeft).rgb);float lumaRight=luminance(texture2D(inputBuffer,vUvRight).rgb);float lumaMin=min(lumaCenter,min(min(lumaDown,lumaUp),min(lumaLeft,lumaRight)));float lumaMax=max(lumaCenter,max(max(lumaDown,lumaUp),max(lumaLeft,lumaRight)));float lumaRange=lumaMax-lumaMin;if(lumaRange<max(EDGE_THRESHOLD_MIN,lumaMax*EDGE_THRESHOLD_MAX)){return inputColor;}float lumaDownLeft=luminance(texture2D(inputBuffer,vUvDownLeft).rgb);float lumaUpRight=luminance(texture2D(inputBuffer,vUvUpRight).rgb);float lumaUpLeft=luminance(texture2D(inputBuffer,vUvUpLeft).rgb);float lumaDownRight=luminance(texture2D(inputBuffer,vUvDownRight).rgb);float lumaDownUp=lumaDown+lumaUp;float lumaLeftRight=lumaLeft+lumaRight;float lumaLeftCorners=lumaDownLeft+lumaUpLeft;float lumaDownCorners=lumaDownLeft+lumaDownRight;float lumaRightCorners=lumaDownRight+lumaUpRight;float lumaUpCorners=lumaUpRight+lumaUpLeft;float edgeHorizontal=(abs(-2.0*lumaLeft+lumaLeftCorners)+abs(-2.0*lumaCenter+lumaDownUp)*2.0+abs(-2.0*lumaRight+lumaRightCorners));float edgeVertical=(abs(-2.0*lumaUp+lumaUpCorners)+abs(-2.0*lumaCenter+lumaLeftRight)*2.0+abs(-2.0*lumaDown+lumaDownCorners));bool isHorizontal=(edgeHorizontal>=edgeVertical);float stepLength=isHorizontal?texelSize.y:texelSize.x;float luma1=isHorizontal?lumaDown:lumaLeft;float luma2=isHorizontal?lumaUp:lumaRight;float gradient1=abs(luma1-lumaCenter);float gradient2=abs(luma2-lumaCenter);bool is1Steepest=gradient1>=gradient2;float gradientScaled=0.25*max(gradient1,gradient2);float lumaLocalAverage=0.0;if(is1Steepest){stepLength=-stepLength;lumaLocalAverage=0.5*(luma1+lumaCenter);}else{lumaLocalAverage=0.5*(luma2+lumaCenter);}vec2 currentUv=uv;if(isHorizontal){currentUv.y+=stepLength*0.5;}else{currentUv.x+=stepLength*0.5;}vec2 offset=isHorizontal?vec2(texelSize.x,0.0):vec2(0.0,texelSize.y);vec2 uv1=currentUv-offset*QUALITY(0);vec2 uv2=currentUv+offset*QUALITY(0);float lumaEnd1=luminance(texture2D(inputBuffer,uv1).rgb);float lumaEnd2=luminance(texture2D(inputBuffer,uv2).rgb);lumaEnd1-=lumaLocalAverage;lumaEnd2-=lumaLocalAverage;bool reached1=abs(lumaEnd1)>=gradientScaled;bool reached2=abs(lumaEnd2)>=gradientScaled;bool reachedBoth=reached1&&reached2;if(!reached1){uv1-=offset*QUALITY(1);}if(!reached2){uv2+=offset*QUALITY(1);}if(!reachedBoth){for(int i=2;i<SAMPLES;++i){if(!reached1){lumaEnd1=luminance(texture2D(inputBuffer,uv1).rgb);lumaEnd1=lumaEnd1-lumaLocalAverage;}if(!reached2){lumaEnd2=luminance(texture2D(inputBuffer,uv2).rgb);lumaEnd2=lumaEnd2-lumaLocalAverage;}reached1=abs(lumaEnd1)>=gradientScaled;reached2=abs(lumaEnd2)>=gradientScaled;reachedBoth=reached1&&reached2;if(!reached1){uv1-=offset*QUALITY(i);}if(!reached2){uv2+=offset*QUALITY(i);}if(reachedBoth){break;}}}float distance1=isHorizontal?(uv.x-uv1.x):(uv.y-uv1.y);float distance2=isHorizontal?(uv2.x-uv.x):(uv2.y-uv.y);bool isDirection1=distance1<distance2;float distanceFinal=min(distance1,distance2);float edgeThickness=(distance1+distance2);bool isLumaCenterSmaller=lumaCenter<lumaLocalAverage;bool correctVariation1=(lumaEnd1<0.0)!=isLumaCenterSmaller;bool correctVariation2=(lumaEnd2<0.0)!=isLumaCenterSmaller;bool correctVariation=isDirection1?correctVariation1:correctVariation2;float pixelOffset=-distanceFinal/edgeThickness+0.5;float finalOffset=correctVariation?pixelOffset:0.0;float lumaAverage=ONE_OVER_TWELVE*(2.0*(lumaDownUp+lumaLeftRight)+lumaLeftCorners+lumaRightCorners);float subPixelOffset1=clamp(abs(lumaAverage-lumaCenter)/lumaRange,0.0,1.0);float subPixelOffset2=(-2.0*subPixelOffset1+3.0)*subPixelOffset1*subPixelOffset1;float subPixelOffsetFinal=subPixelOffset2*subPixelOffset2*SUBPIXEL_QUALITY;finalOffset=max(finalOffset,subPixelOffsetFinal);vec2 finalUv=uv;if(isHorizontal){finalUv.y+=finalOffset*stepLength;}else{finalUv.x+=finalOffset*stepLength;}return texture2D(inputBuffer,finalUv);}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=fxaa(inputColor,uv);}`,
    BB = "varying vec2 vUvDown;varying vec2 vUvUp;varying vec2 vUvLeft;varying vec2 vUvRight;varying vec2 vUvDownLeft;varying vec2 vUvUpRight;varying vec2 vUvUpLeft;varying vec2 vUvDownRight;void mainSupport(const in vec2 uv){vUvDown=uv+vec2(0.0,-1.0)*texelSize;vUvUp=uv+vec2(0.0,1.0)*texelSize;vUvRight=uv+vec2(1.0,0.0)*texelSize;vUvLeft=uv+vec2(-1.0,0.0)*texelSize;vUvDownLeft=uv+vec2(-1.0,-1.0)*texelSize;vUvUpRight=uv+vec2(1.0,1.0)*texelSize;vUvUpLeft=uv+vec2(-1.0,1.0)*texelSize;vUvDownRight=uv+vec2(1.0,-1.0)*texelSize;}",
    PB = class  extends Bc{
        constructor({blendFunction: i=ct.SRC}={})
        {
            super("FXAAEffect", IB, {
                vertexShader: BB,
                blendFunction: i,
                defines: new Map([["EDGE_THRESHOLD_MIN", "0.0312"], ["EDGE_THRESHOLD_MAX", "0.125"], ["SUBPIXEL_QUALITY", "0.75"], ["SAMPLES", "12"]])
            })
        }
        get minEdgeThreshold()
        {
            return Number(this.defines.get("EDGE_THRESHOLD_MIN"))
        }
        set minEdgeThreshold(i)
        {
            this.defines.set("EDGE_THRESHOLD_MIN", i.toFixed(12)),
            this.setChanged()
        }
        get maxEdgeThreshold()
        {
            return Number(this.defines.get("EDGE_THRESHOLD_MAX"))
        }
        set maxEdgeThreshold(i)
        {
            this.defines.set("EDGE_THRESHOLD_MAX", i.toFixed(12)),
            this.setChanged()
        }
        get subpixelQuality()
        {
            return Number(this.defines.get("SUBPIXEL_QUALITY"))
        }
        set subpixelQuality(i)
        {
            this.defines.set("SUBPIXEL_QUALITY", i.toFixed(12)),
            this.setChanged()
        }
        get samples()
        {
            return Number(this.defines.get("SAMPLES"))
        }
        set samples(i)
        {
            this.defines.set("SAMPLES", i.toFixed(0)),
            this.setChanged()
        }
    }
    ,
    ql = {
        DEFAULT: 0,
        KEEP_MAX_DEPTH: 1,
        DISCARD_MAX_DEPTH: 2
    },
    DB = `#include <common>
    #include <packing>
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    uniform highp sampler2D depthBuffer0;uniform highp sampler2D depthBuffer1;
    #else
    uniform mediump sampler2D depthBuffer0;uniform mediump sampler2D depthBuffer1;
    #endif
    uniform sampler2D inputBuffer;uniform vec2 cameraNearFar;float getViewZ(const in float depth){
    #ifdef PERSPECTIVE_CAMERA
    return perspectiveDepthToViewZ(depth,cameraNearFar.x,cameraNearFar.y);
    #else
    return orthographicDepthToViewZ(depth,cameraNearFar.x,cameraNearFar.y);
    #endif
    }varying vec2 vUv;void main(){vec2 depth;
    #if DEPTH_PACKING_0 == 3201
    depth.x=unpackRGBAToDepth(texture2D(depthBuffer0,vUv));
    #else
    depth.x=texture2D(depthBuffer0,vUv).r;
    #ifdef LOG_DEPTH
    float d=pow(2.0,depth.x*log2(cameraNearFar.y+1.0))-1.0;float a=cameraNearFar.y/(cameraNearFar.y-cameraNearFar.x);float b=cameraNearFar.y*cameraNearFar.x/(cameraNearFar.x-cameraNearFar.y);depth.x=a+b/d;
    #endif
    #endif
    #if DEPTH_PACKING_1 == 3201
    depth.y=unpackRGBAToDepth(texture2D(depthBuffer1,vUv));
    #else
    depth.y=texture2D(depthBuffer1,vUv).r;
    #ifdef LOG_DEPTH
    float d=pow(2.0,depth.y*log2(cameraNearFar.y+1.0))-1.0;float a=cameraNearFar.y/(cameraNearFar.y-cameraNearFar.x);float b=cameraNearFar.y*cameraNearFar.x/(cameraNearFar.x-cameraNearFar.y);depth.y=a+b/d;
    #endif
    #endif
    bool isMaxDepth=(depth.x==1.0);
    #ifdef PERSPECTIVE_CAMERA
    depth.x=viewZToOrthographicDepth(getViewZ(depth.x),cameraNearFar.x,cameraNearFar.y);depth.y=viewZToOrthographicDepth(getViewZ(depth.y),cameraNearFar.x,cameraNearFar.y);
    #endif
    #if DEPTH_TEST_STRATEGY == 0
    bool keep=depthTest(depth.x,depth.y);
    #elif DEPTH_TEST_STRATEGY == 1
    bool keep=isMaxDepth||depthTest(depth.x,depth.y);
    #else
    bool keep=!isMaxDepth&&depthTest(depth.x,depth.y);
    #endif
    if(keep){gl_FragColor=texture2D(inputBuffer,vUv);}else{discard;}}`,
    o_ = class  extends fe{
        constructor()
        {
            super({
                name: "DepthMaskMaterial",
                defines: {
                    DEPTH_EPSILON: "0.0001",
                    DEPTH_PACKING_0: "0",
                    DEPTH_PACKING_1: "0",
                    DEPTH_TEST_STRATEGY: ql.KEEP_MAX_DEPTH
                },
                uniforms: {
                    inputBuffer: new Me(null),
                    depthBuffer0: new Me(null),
                    depthBuffer1: new Me(null),
                    cameraNearFar: new Me(new H(1, 1))
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                fragmentShader: DB,
                vertexShader: va
            }),
            this.depthMode = Pp
        }
        set depthBuffer0(i)
        {
            this.uniforms.depthBuffer0.value = i
        }
        set depthPacking0(i)
        {
            this.defines.DEPTH_PACKING_0 = i.toFixed(0),
            this.needsUpdate = !0
        }
        setDepthBuffer0(i, e=ms)
        {
            this.depthBuffer0 = i,
            this.depthPacking0 = e
        }
        set depthBuffer1(i)
        {
            this.uniforms.depthBuffer1.value = i
        }
        set depthPacking1(i)
        {
            this.defines.DEPTH_PACKING_1 = i.toFixed(0),
            this.needsUpdate = !0
        }
        setDepthBuffer1(i, e=ms)
        {
            this.depthBuffer1 = i,
            this.depthPacking1 = e
        }
        get maxDepthStrategy()
        {
            return Number(this.defines.DEPTH_TEST_STRATEGY)
        }
        set maxDepthStrategy(i)
        {
            this.defines.DEPTH_TEST_STRATEGY = i.toFixed(0),
            this.needsUpdate = !0
        }
        get keepFar()
        {
            return this.maxDepthStrategy
        }
        set keepFar(i)
        {
            this.maxDepthStrategy = i ? ql.KEEP_MAX_DEPTH : ql.DISCARD_MAX_DEPTH
        }
        getMaxDepthStrategy()
        {
            return this.maxDepthStrategy
        }
        setMaxDepthStrategy(i)
        {
            this.maxDepthStrategy = i
        }
        get epsilon()
        {
            return Number(this.defines.DEPTH_EPSILON)
        }
        set epsilon(i)
        {
            this.defines.DEPTH_EPSILON = i.toFixed(16),
            this.needsUpdate = !0
        }
        getEpsilon()
        {
            return this.epsilon
        }
        setEpsilon(i)
        {
            this.epsilon = i
        }
        get depthMode()
        {
            return Number(this.defines.DEPTH_MODE)
        }
        set depthMode(i)
        {
            let e;
            switch (i) {
            case uy:
                e = "false";
                break;
            case dy:
                e = "true";
                break;
            case ku:
                e = "abs(d1 - d0) <= DEPTH_EPSILON";
                break;
            case bA:
                e = "abs(d1 - d0) > DEPTH_EPSILON";
                break;
            case Pp:
                e = "d0 > d1";
                break;
            case pc:
                e = "d0 >= d1";
                break;
            case fy:
                e = "d0 <= d1";
                break;
            case py:
            default:
                e = "d0 < d1";
                break
            }
            this.defines.DEPTH_MODE = i.toFixed(0),
            this.defines["depthTest(d0, d1)"] = e,
            this.needsUpdate = !0
        }
        getDepthMode()
        {
            return this.depthMode
        }
        setDepthMode(i)
        {
            this.depthMode = i
        }
        adoptCameraSettings(i)
        {
            this.copyCameraSettings(i)
        }
        copyCameraSettings(i)
        {
            i && (this.uniforms.cameraNearFar.value.set(i.near, i.far), i instanceof gi ? this.defines.PERSPECTIVE_CAMERA = "1" : delete this.defines.PERSPECTIVE_CAMERA, this.needsUpdate = !0)
        }
    }
    ,
    RB = `#include <common>
    #include <dithering_pars_fragment>
    #ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D inputBuffer;
    #else
    uniform lowp sampler2D inputBuffer;
    #endif
    uniform vec2 lightPosition;uniform float exposure;uniform float decay;uniform float density;uniform float weight;uniform float clampMax;varying vec2 vUv;void main(){vec2 coord=vUv;vec2 delta=lightPosition-coord;delta*=1.0/SAMPLES_FLOAT*density;float illuminationDecay=1.0;vec4 color=vec4(0.0);for(int i=0;i<SAMPLES_INT;++i){coord+=delta;vec4 texel=texture2D(inputBuffer,coord);texel*=illuminationDecay*weight;color+=texel;illuminationDecay*=decay;}gl_FragColor=clamp(color*exposure,0.0,clampMax);
    #include <dithering_fragment>
    }`,
    UB = class  extends fe{
        constructor(i)
        {
            super({
                name: "GodRaysMaterial",
                defines: {
                    SAMPLES_INT: "60",
                    SAMPLES_FLOAT: "60.0"
                },
                uniforms: {
                    inputBuffer: new Me(null),
                    lightPosition: new Me(i),
                    density: new Me(1),
                    decay: new Me(1),
                    weight: new Me(1),
                    exposure: new Me(1),
                    clampMax: new Me(1)
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                fragmentShader: RB,
                vertexShader: va
            })
        }
        set inputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        setInputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        get lightPosition()
        {
            return this.uniforms.lightPosition.value
        }
        getLightPosition()
        {
            return this.uniforms.lightPosition.value
        }
        setLightPosition(i)
        {
            this.uniforms.lightPosition.value = i
        }
        get density()
        {
            return this.uniforms.density.value
        }
        set density(i)
        {
            this.uniforms.density.value = i
        }
        getDensity()
        {
            return this.uniforms.density.value
        }
        setDensity(i)
        {
            this.uniforms.density.value = i
        }
        get decay()
        {
            return this.uniforms.decay.value
        }
        set decay(i)
        {
            this.uniforms.decay.value = i
        }
        getDecay()
        {
            return this.uniforms.decay.value
        }
        setDecay(i)
        {
            this.uniforms.decay.value = i
        }
        get weight()
        {
            return this.uniforms.weight.value
        }
        set weight(i)
        {
            this.uniforms.weight.value = i
        }
        getWeight()
        {
            return this.uniforms.weight.value
        }
        setWeight(i)
        {
            this.uniforms.weight.value = i
        }
        get exposure()
        {
            return this.uniforms.exposure.value
        }
        set exposure(i)
        {
            this.uniforms.exposure.value = i
        }
        getExposure()
        {
            return this.uniforms.exposure.value
        }
        setExposure(i)
        {
            this.uniforms.exposure.value = i
        }
        get maxIntensity()
        {
            return this.uniforms.clampMax.value
        }
        set maxIntensity(i)
        {
            this.uniforms.clampMax.value = i
        }
        getMaxIntensity()
        {
            return this.uniforms.clampMax.value
        }
        setMaxIntensity(i)
        {
            this.uniforms.clampMax.value = i
        }
        get samples()
        {
            return Number(this.defines.SAMPLES_INT)
        }
        set samples(i)
        {
            const e = Math.floor(i);
            this.defines.SAMPLES_INT = e.toFixed(0),
            this.defines.SAMPLES_FLOAT = e.toFixed(1),
            this.needsUpdate = !0
        }
        getSamples()
        {
            return this.samples
        }
        setSamples(i)
        {
            this.samples = i
        }
    }
    ,
    l_ = class  extends gs{
        constructor(e, t, s=null)
        {
            super("RenderPass", e, t),
            this.needsSwap = !1,
            this.clearPass = new Ic,
            this.overrideMaterialManager = s === null ? null : new T0(s),
            this.ignoreBackground = !1,
            this.skipShadowMapUpdate = !1,
            this.selection = null
        }
        set mainScene(e)
        {
            this.scene = e
        }
        set mainCamera(e)
        {
            this.camera = e
        }
        get renderToScreen()
        {
            return super.renderToScreen
        }
        set renderToScreen(e)
        {
            super.renderToScreen = e,
            this.clearPass.renderToScreen = e
        }
        get overrideMaterial()
        {
            const e = this.overrideMaterialManager;
            return e !== null ? e.material : null
        }
        set overrideMaterial(e)
        {
            const t = this.overrideMaterialManager;
            e !== null ? t !== null ? t.setMaterial(e) : this.overrideMaterialManager = new T0(e) : t !== null && (t.dispose(), this.overrideMaterialManager = null)
        }
        getOverrideMaterial()
        {
            return this.overrideMaterial
        }
        setOverrideMaterial(e)
        {
            this.overrideMaterial = e
        }
        get clear()
        {
            return this.clearPass.enabled
        }
        set clear(e)
        {
            this.clearPass.enabled = e
        }
        getSelection()
        {
            return this.selection
        }
        setSelection(e)
        {
            this.selection = e
        }
        isBackgroundDisabled()
        {
            return this.ignoreBackground
        }
        setBackgroundDisabled(e)
        {
            this.ignoreBackground = e
        }
        isShadowMapDisabled()
        {
            return this.skipShadowMapUpdate
        }
        setShadowMapDisabled(e)
        {
            this.skipShadowMapUpdate = e
        }
        getClearPass()
        {
            return this.clearPass
        }
        render(e, t, s, n, r)
        {
            const a = this.scene,
                o = this.camera,
                l = this.selection,
                c = o.layers.mask,
                h = a.background,
                d = e.shadowMap.autoUpdate,
                u = this.renderToScreen ? null : t;
            l !== null && o.layers.set(l.getLayer()),
            this.skipShadowMapUpdate && (e.shadowMap.autoUpdate = !1),
            (this.ignoreBackground || this.clearPass.overrideClearColor !== null) && (a.background = null),
            this.clearPass.enabled && this.clearPass.render(e, t),
            e.setRenderTarget(u),
            this.overrideMaterialManager !== null ? this.overrideMaterialManager.render(e, a, o) : e.render(a, o),
            o.layers.mask = c,
            a.background = h,
            e.shadowMap.autoUpdate = d
        }
    }
    ,
    LB = `#ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D map;
    #else
    uniform lowp sampler2D map;
    #endif
    void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=texture2D(map,uv);}`,
    Pf = new b,
    B0 = new De,
    FB = class  extends Bc{
        constructor(i, e, {blendFunction: t=ct.SCREEN, samples: s=60, density: n=.96, decay: r=.9, weight: a=.4, exposure: o=.6, clampMax: l=1, blur: c=!0, kernelSize: h=fr.SMALL, resolutionScale: d=.5, width: u=ti.AUTO_SIZE, height: f=ti.AUTO_SIZE, resolutionX: p=u, resolutionY: A=f}={})
        {
            super("GodRaysEffect", LB, {
                blendFunction: t,
                attributes: Is.DEPTH,
                uniforms: new Map([["map", new Me(null)]])
            }),
            this.camera = i,
            this._lightSource = e,
            this.lightSource = e,
            this.lightScene = new No,
            this.screenPosition = new H,
            this.renderTargetA = new vt(1, 1, {
                depthBuffer: !1
            }),
            this.renderTargetA.texture.name = "GodRays.Target.A",
            this.renderTargetB = this.renderTargetA.clone(),
            this.renderTargetB.texture.name = "GodRays.Target.B",
            this.uniforms.get("map").value = this.renderTargetB.texture,
            this.renderTargetLight = new vt(1, 1),
            this.renderTargetLight.texture.name = "GodRays.Light",
            this.renderTargetLight.depthTexture = new Fo,
            this.renderPassLight = new l_(this.lightScene, i),
            this.renderPassLight.clearPass.overrideClearColor = new Z(0),
            this.clearPass = new Ic(!0, !1, !1),
            this.clearPass.overrideClearColor = new Z(0),
            this.blurPass = new Id({
                kernelSize: h
            }),
            this.blurPass.enabled = c,
            this.depthMaskPass = new Os(new o_);
            const m = this.depthMaskMaterial;
            m.depthBuffer1 = this.renderTargetLight.depthTexture,
            m.copyCameraSettings(i),
            this.godRaysPass = new Os(new UB(this.screenPosition));
            const g = this.godRaysMaterial;
            g.density = n,
            g.decay = r,
            g.weight = a,
            g.exposure = o,
            g.maxIntensity = l,
            g.samples = s;
            const x = this.resolution = new ti(this, p, A, d);
            x.addEventListener("change", v => this.setSize(x.baseWidth, x.baseHeight))
        }
        set mainCamera(i)
        {
            this.camera = i,
            this.renderPassLight.mainCamera = i,
            this.depthMaskMaterial.copyCameraSettings(i)
        }
        get lightSource()
        {
            return this._lightSource
        }
        set lightSource(i)
        {
            this._lightSource = i,
            i !== null && (i.material.depthWrite = !1, i.material.transparent = !0)
        }
        getBlurPass()
        {
            return this.blurPass
        }
        get texture()
        {
            return this.renderTargetB.texture
        }
        getTexture()
        {
            return this.texture
        }
        get depthMaskMaterial()
        {
            return this.depthMaskPass.fullscreenMaterial
        }
        get godRaysMaterial()
        {
            return this.godRaysPass.fullscreenMaterial
        }
        getGodRaysMaterial()
        {
            return this.godRaysMaterial
        }
        getResolution()
        {
            return this.resolution
        }
        get width()
        {
            return this.resolution.width
        }
        set width(i)
        {
            this.resolution.preferredWidth = i
        }
        get height()
        {
            return this.resolution.height
        }
        set height(i)
        {
            this.resolution.preferredHeight = i
        }
        get dithering()
        {
            return this.godRaysMaterial.dithering
        }
        set dithering(i)
        {
            const e = this.godRaysMaterial;
            e.dithering = i,
            e.needsUpdate = !0
        }
        get blur()
        {
            return this.blurPass.enabled
        }
        set blur(i)
        {
            this.blurPass.enabled = i
        }
        get kernelSize()
        {
            return this.blurPass.kernelSize
        }
        set kernelSize(i)
        {
            this.blurPass.kernelSize = i
        }
        getResolutionScale()
        {
            return this.resolution.scale
        }
        setResolutionScale(i)
        {
            this.resolution.scale = i
        }
        get samples()
        {
            return this.godRaysMaterial.samples
        }
        set samples(i)
        {
            this.godRaysMaterial.samples = i
        }
        setDepthTexture(i, e=ms)
        {
            this.depthMaskPass.fullscreenMaterial.depthBuffer0 = i,
            this.depthMaskPass.fullscreenMaterial.depthPacking0 = e
        }
        update(i, e, t)
        {
            const s = this.lightSource,
                n = s.parent,
                r = s.matrixAutoUpdate,
                a = this.renderTargetA,
                o = this.renderTargetLight;
            s.material.depthWrite = !0,
            s.matrixAutoUpdate = !1,
            s.updateWorldMatrix(!0, !1),
            n !== null && (r || B0.copy(s.matrix), s.matrix.copy(s.matrixWorld)),
            this.lightScene.add(s),
            this.renderPassLight.render(i, o),
            this.clearPass.render(i, a),
            this.depthMaskPass.render(i, o, a),
            s.material.depthWrite = !1,
            s.matrixAutoUpdate = r,
            n !== null && (r || s.matrix.copy(B0), n.add(s)),
            Pf.setFromMatrixPosition(s.matrixWorld).project(this.camera),
            this.screenPosition.set(Math.min(Math.max((Pf.x + 1) * .5, -1), 2), Math.min(Math.max((Pf.y + 1) * .5, -1), 2)),
            this.blurPass.enabled && this.blurPass.render(i, a, a),
            this.godRaysPass.render(i, a, this.renderTargetB)
        }
        setSize(i, e)
        {
            const t = this.resolution;
            t.setBaseSize(i, e);
            const s = t.width,
                n = t.height;
            this.renderTargetA.setSize(s, n),
            this.renderTargetB.setSize(s, n),
            this.renderTargetLight.setSize(s, n),
            this.blurPass.resolution.copy(t)
        }
        initialize(i, e, t)
        {
            this.blurPass.initialize(i, e, t),
            this.renderPassLight.initialize(i, e, t),
            this.depthMaskPass.initialize(i, e, t),
            this.godRaysPass.initialize(i, e, t),
            t !== void 0 && (this.renderTargetA.texture.type = t, this.renderTargetB.texture.type = t, this.renderTargetLight.texture.type = t, i !== null && i.outputColorSpace === Ve && (this.renderTargetA.texture.colorSpace = Ve, this.renderTargetB.texture.colorSpace = Ve, this.renderTargetLight.texture.colorSpace = Ve))
        }
    }
    ,
    c_ = {
        DEPTH: 0,
        LUMA: 1,
        COLOR: 2
    },
    NB = {
        DISABLED: 0,
        DEPTH: 1,
        CUSTOM: 2
    },
    so = {
        LOW: 0,
        MEDIUM: 1,
        HIGH: 2,
        ULTRA: 3
    },
    OB = class  extends gs{
        constructor(i, e, {renderTarget: t, resolutionScale: s=1, width: n=ti.AUTO_SIZE, height: r=ti.AUTO_SIZE, resolutionX: a=n, resolutionY: o=r}={})
        {
            super("DepthPass"),
            this.needsSwap = !1,
            this.renderPass = new l_(i, e, new zy({
                depthPacking: TA
            }));
            const l = this.renderPass;
            l.skipShadowMapUpdate = !0,
            l.ignoreBackground = !0;
            const c = l.clearPass;
            c.overrideClearColor = new Z(16777215),
            c.overrideClearAlpha = 1,
            this.renderTarget = t,
            this.renderTarget === void 0 && (this.renderTarget = new vt(1, 1, {
                minFilter: gt,
                magFilter: gt
            }), this.renderTarget.texture.name = "DepthPass.Target");
            const h = this.resolution = new ti(this, a, o, s);
            h.addEventListener("change", d => this.setSize(h.baseWidth, h.baseHeight))
        }
        set mainScene(i)
        {
            this.renderPass.mainScene = i
        }
        set mainCamera(i)
        {
            this.renderPass.mainCamera = i
        }
        get texture()
        {
            return this.renderTarget.texture
        }
        getTexture()
        {
            return this.renderTarget.texture
        }
        getResolution()
        {
            return this.resolution
        }
        getResolutionScale()
        {
            return this.resolution.scale
        }
        setResolutionScale(i)
        {
            this.resolution.scale = i
        }
        render(i, e, t, s, n)
        {
            const r = this.renderToScreen ? null : this.renderTarget;
            this.renderPass.render(i, r)
        }
        setSize(i, e)
        {
            const t = this.resolution;
            t.setBaseSize(i, e),
            this.renderTarget.setSize(t.width, t.height)
        }
    }
    ,
    kB = class  extends n_{
        constructor(i, e, t)
        {
            super(t),
            this.setAttributes(this.getAttributes() | Is.DEPTH),
            this.camera = e,
            this.depthPass = new OB(i, e),
            this.clearPass = new Ic(!0, !1, !1),
            this.clearPass.overrideClearColor = new Z(0),
            this.depthMaskPass = new Os(new o_);
            const s = this.depthMaskMaterial;
            s.copyCameraSettings(e),
            s.depthBuffer1 = this.depthPass.texture,
            s.depthPacking1 = TA,
            s.depthMode = ku,
            this.renderTargetMasked = new vt(1, 1, {
                depthBuffer: !1
            }),
            this.renderTargetMasked.texture.name = "Bloom.Masked",
            this.selection = new M2,
            this.selection.layer = 11,
            this._inverted = !1,
            this._ignoreBackground = !1
        }
        set mainScene(i)
        {
            this.depthPass.mainScene = i
        }
        set mainCamera(i)
        {
            this.camera = i,
            this.depthPass.mainCamera = i,
            this.depthMaskMaterial.copyCameraSettings(i)
        }
        getSelection()
        {
            return this.selection
        }
        get depthMaskMaterial()
        {
            return this.depthMaskPass.fullscreenMaterial
        }
        get inverted()
        {
            return this._inverted
        }
        set inverted(i)
        {
            this._inverted = i,
            this.depthMaskMaterial.depthMode = i ? bA : ku
        }
        isInverted()
        {
            return this.inverted
        }
        setInverted(i)
        {
            this.inverted = i
        }
        get ignoreBackground()
        {
            return this._ignoreBackground
        }
        set ignoreBackground(i)
        {
            this._ignoreBackground = i,
            this.depthMaskMaterial.maxDepthStrategy = i ? ql.DISCARD_MAX_DEPTH : ql.KEEP_MAX_DEPTH
        }
        isBackgroundDisabled()
        {
            return this.ignoreBackground
        }
        setBackgroundDisabled(i)
        {
            this.ignoreBackground = i
        }
        setDepthTexture(i, e=ms)
        {
            this.depthMaskMaterial.depthBuffer0 = i,
            this.depthMaskMaterial.depthPacking0 = e
        }
        update(i, e, t)
        {
            const s = this.camera,
                n = this.selection,
                r = this.inverted;
            let a = e;
            if (this.ignoreBackground || !r || n.size > 0) {
                const o = s.layers.mask;
                s.layers.set(n.layer),
                this.depthPass.render(i),
                s.layers.mask = o,
                a = this.renderTargetMasked,
                this.clearPass.render(i, a),
                this.depthMaskPass.render(i, e, a)
            }
            super.update(i, a, t)
        }
        setSize(i, e)
        {
            super.setSize(i, e),
            this.renderTargetMasked.setSize(i, e),
            this.depthPass.setSize(i, e)
        }
        initialize(i, e, t)
        {
            super.initialize(i, e, t),
            this.clearPass.initialize(i, e, t),
            this.depthPass.initialize(i, e, t),
            this.depthMaskPass.initialize(i, e, t),
            i !== null && i.capabilities.logarithmicDepthBuffer && (this.depthMaskPass.fullscreenMaterial.defines.LOG_DEPTH = "1"),
            t !== void 0 && (this.renderTargetMasked.texture.type = t, i !== null && i.outputColorSpace === Ve && (this.renderTargetMasked.texture.colorSpace = Ve))
        }
    }
    ,
    zB = `varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;
    #if EDGE_DETECTION_MODE != 0
    varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;
    #endif
    #if EDGE_DETECTION_MODE == 1
    #include <common>
    #endif
    #if EDGE_DETECTION_MODE == 0 || PREDICATION_MODE == 1
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    uniform highp sampler2D depthBuffer;
    #else
    uniform mediump sampler2D depthBuffer;
    #endif
    float readDepth(const in vec2 uv){
    #if DEPTH_PACKING == 3201
    return unpackRGBAToDepth(texture2D(depthBuffer,uv));
    #else
    return texture2D(depthBuffer,uv).r;
    #endif
    }vec3 gatherNeighbors(){float p=readDepth(vUv);float pLeft=readDepth(vUv0);float pTop=readDepth(vUv1);return vec3(p,pLeft,pTop);}
    #elif PREDICATION_MODE == 2
    uniform sampler2D predicationBuffer;vec3 gatherNeighbors(){float p=texture2D(predicationBuffer,vUv).r;float pLeft=texture2D(predicationBuffer,vUv0).r;float pTop=texture2D(predicationBuffer,vUv1).r;return vec3(p,pLeft,pTop);}
    #endif
    #if PREDICATION_MODE != 0
    vec2 calculatePredicatedThreshold(){vec3 neighbours=gatherNeighbors();vec2 delta=abs(neighbours.xx-neighbours.yz);vec2 edges=step(PREDICATION_THRESHOLD,delta);return PREDICATION_SCALE*EDGE_THRESHOLD*(1.0-PREDICATION_STRENGTH*edges);}
    #endif
    #if EDGE_DETECTION_MODE != 0
    uniform sampler2D inputBuffer;
    #endif
    void main(){
    #if EDGE_DETECTION_MODE == 0
    const vec2 threshold=vec2(DEPTH_THRESHOLD);
    #elif PREDICATION_MODE != 0
    vec2 threshold=calculatePredicatedThreshold();
    #else
    const vec2 threshold=vec2(EDGE_THRESHOLD);
    #endif
    #if EDGE_DETECTION_MODE == 0
    vec3 neighbors=gatherNeighbors();vec2 delta=abs(neighbors.xx-vec2(neighbors.y,neighbors.z));vec2 edges=step(threshold,delta);if(dot(edges,vec2(1.0))==0.0){discard;}gl_FragColor=vec4(edges,0.0,1.0);
    #elif EDGE_DETECTION_MODE == 1
    float l=luminance(texture2D(inputBuffer,vUv).rgb);float lLeft=luminance(texture2D(inputBuffer,vUv0).rgb);float lTop=luminance(texture2D(inputBuffer,vUv1).rgb);vec4 delta;delta.xy=abs(l-vec2(lLeft,lTop));vec2 edges=step(threshold,delta.xy);if(dot(edges,vec2(1.0))==0.0){discard;}float lRight=luminance(texture2D(inputBuffer,vUv2).rgb);float lBottom=luminance(texture2D(inputBuffer,vUv3).rgb);delta.zw=abs(l-vec2(lRight,lBottom));vec2 maxDelta=max(delta.xy,delta.zw);float lLeftLeft=luminance(texture2D(inputBuffer,vUv4).rgb);float lTopTop=luminance(texture2D(inputBuffer,vUv5).rgb);delta.zw=abs(vec2(lLeft,lTop)-vec2(lLeftLeft,lTopTop));maxDelta=max(maxDelta.xy,delta.zw);float finalDelta=max(maxDelta.x,maxDelta.y);edges.xy*=step(finalDelta,LOCAL_CONTRAST_ADAPTATION_FACTOR*delta.xy);gl_FragColor=vec4(edges,0.0,1.0);
    #elif EDGE_DETECTION_MODE == 2
    vec4 delta;vec3 c=texture2D(inputBuffer,vUv).rgb;vec3 cLeft=texture2D(inputBuffer,vUv0).rgb;vec3 t=abs(c-cLeft);delta.x=max(max(t.r,t.g),t.b);vec3 cTop=texture2D(inputBuffer,vUv1).rgb;t=abs(c-cTop);delta.y=max(max(t.r,t.g),t.b);vec2 edges=step(threshold,delta.xy);if(dot(edges,vec2(1.0))==0.0){discard;}vec3 cRight=texture2D(inputBuffer,vUv2).rgb;t=abs(c-cRight);delta.z=max(max(t.r,t.g),t.b);vec3 cBottom=texture2D(inputBuffer,vUv3).rgb;t=abs(c-cBottom);delta.w=max(max(t.r,t.g),t.b);vec2 maxDelta=max(delta.xy,delta.zw);vec3 cLeftLeft=texture2D(inputBuffer,vUv4).rgb;t=abs(c-cLeftLeft);delta.z=max(max(t.r,t.g),t.b);vec3 cTopTop=texture2D(inputBuffer,vUv5).rgb;t=abs(c-cTopTop);delta.w=max(max(t.r,t.g),t.b);maxDelta=max(maxDelta.xy,delta.zw);float finalDelta=max(maxDelta.x,maxDelta.y);edges*=step(finalDelta,LOCAL_CONTRAST_ADAPTATION_FACTOR*delta.xy);gl_FragColor=vec4(edges,0.0,1.0);
    #endif
    }`,
    QB = `uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;
    #if EDGE_DETECTION_MODE != 0
    varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;
    #endif
    void main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,0.0);vUv1=vUv+texelSize*vec2(0.0,-1.0);
    #if EDGE_DETECTION_MODE != 0
    vUv2=vUv+texelSize*vec2(1.0,0.0);vUv3=vUv+texelSize*vec2(0.0,1.0);vUv4=vUv+texelSize*vec2(-2.0,0.0);vUv5=vUv+texelSize*vec2(0.0,-2.0);
    #endif
    gl_Position=vec4(position.xy,1.0,1.0);}`,
    GB = class  extends fe{
        constructor(i=new H, e=c_.COLOR)
        {
            super({
                name: "EdgeDetectionMaterial",
                defines: {
                    THREE_REVISION: Aa.replace(/\D+/g, ""),
                    LOCAL_CONTRAST_ADAPTATION_FACTOR: "2.0",
                    EDGE_THRESHOLD: "0.1",
                    DEPTH_THRESHOLD: "0.01",
                    PREDICATION_MODE: "0",
                    PREDICATION_THRESHOLD: "0.01",
                    PREDICATION_SCALE: "2.0",
                    PREDICATION_STRENGTH: "1.0",
                    DEPTH_PACKING: "0"
                },
                uniforms: {
                    inputBuffer: new Me(null),
                    depthBuffer: new Me(null),
                    predicationBuffer: new Me(null),
                    texelSize: new Me(i)
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                fragmentShader: zB,
                vertexShader: QB
            }),
            this.edgeDetectionMode = e
        }
        set depthBuffer(i)
        {
            this.uniforms.depthBuffer.value = i
        }
        set depthPacking(i)
        {
            this.defines.DEPTH_PACKING = i.toFixed(0),
            this.needsUpdate = !0
        }
        setDepthBuffer(i, e=ms)
        {
            this.depthBuffer = i,
            this.depthPacking = e
        }
        get edgeDetectionMode()
        {
            return Number(this.defines.EDGE_DETECTION_MODE)
        }
        set edgeDetectionMode(i)
        {
            this.defines.EDGE_DETECTION_MODE = i.toFixed(0),
            this.needsUpdate = !0
        }
        getEdgeDetectionMode()
        {
            return this.edgeDetectionMode
        }
        setEdgeDetectionMode(i)
        {
            this.edgeDetectionMode = i
        }
        get localContrastAdaptationFactor()
        {
            return Number(this.defines.LOCAL_CONTRAST_ADAPTATION_FACTOR)
        }
        set localContrastAdaptationFactor(i)
        {
            this.defines.LOCAL_CONTRAST_ADAPTATION_FACTOR = i.toFixed("6"),
            this.needsUpdate = !0
        }
        getLocalContrastAdaptationFactor()
        {
            return this.localContrastAdaptationFactor
        }
        setLocalContrastAdaptationFactor(i)
        {
            this.localContrastAdaptationFactor = i
        }
        get edgeDetectionThreshold()
        {
            return Number(this.defines.EDGE_THRESHOLD)
        }
        set edgeDetectionThreshold(i)
        {
            this.defines.EDGE_THRESHOLD = i.toFixed("6"),
            this.defines.DEPTH_THRESHOLD = (i * .1).toFixed("6"),
            this.needsUpdate = !0
        }
        getEdgeDetectionThreshold()
        {
            return this.edgeDetectionThreshold
        }
        setEdgeDetectionThreshold(i)
        {
            this.edgeDetectionThreshold = i
        }
        get predicationMode()
        {
            return Number(this.defines.PREDICATION_MODE)
        }
        set predicationMode(i)
        {
            this.defines.PREDICATION_MODE = i.toFixed(0),
            this.needsUpdate = !0
        }
        getPredicationMode()
        {
            return this.predicationMode
        }
        setPredicationMode(i)
        {
            this.predicationMode = i
        }
        set predicationBuffer(i)
        {
            this.uniforms.predicationBuffer.value = i
        }
        setPredicationBuffer(i)
        {
            this.uniforms.predicationBuffer.value = i
        }
        get predicationThreshold()
        {
            return Number(this.defines.PREDICATION_THRESHOLD)
        }
        set predicationThreshold(i)
        {
            this.defines.PREDICATION_THRESHOLD = i.toFixed("6"),
            this.needsUpdate = !0
        }
        getPredicationThreshold()
        {
            return this.predicationThreshold
        }
        setPredicationThreshold(i)
        {
            this.predicationThreshold = i
        }
        get predicationScale()
        {
            return Number(this.defines.PREDICATION_SCALE)
        }
        set predicationScale(i)
        {
            this.defines.PREDICATION_SCALE = i.toFixed("6"),
            this.needsUpdate = !0
        }
        getPredicationScale()
        {
            return this.predicationScale
        }
        setPredicationScale(i)
        {
            this.predicationScale = i
        }
        get predicationStrength()
        {
            return Number(this.defines.PREDICATION_STRENGTH)
        }
        set predicationStrength(i)
        {
            this.defines.PREDICATION_STRENGTH = i.toFixed("6"),
            this.needsUpdate = !0
        }
        getPredicationStrength()
        {
            return this.predicationStrength
        }
        setPredicationStrength(i)
        {
            this.predicationStrength = i
        }
        setSize(i, e)
        {
            this.uniforms.texelSize.value.set(1 / i, 1 / e)
        }
    }
    ,
    HB = `#define sampleLevelZeroOffset(t, coord, offset) texture2D(t, coord + offset * texelSize)
    #if __VERSION__ < 300
    #define round(v) floor(v + 0.5)
    #endif
    #ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D inputBuffer;
    #else
    uniform lowp sampler2D inputBuffer;
    #endif
    uniform lowp sampler2D areaTexture;uniform lowp sampler2D searchTexture;uniform vec2 texelSize;uniform vec2 resolution;varying vec2 vUv;varying vec4 vOffset[3];varying vec2 vPixCoord;void movec(const in bvec2 c,inout vec2 variable,const in vec2 value){if(c.x){variable.x=value.x;}if(c.y){variable.y=value.y;}}void movec(const in bvec4 c,inout vec4 variable,const in vec4 value){movec(c.xy,variable.xy,value.xy);movec(c.zw,variable.zw,value.zw);}vec2 decodeDiagBilinearAccess(in vec2 e){e.r=e.r*abs(5.0*e.r-5.0*0.75);return round(e);}vec4 decodeDiagBilinearAccess(in vec4 e){e.rb=e.rb*abs(5.0*e.rb-5.0*0.75);return round(e);}vec2 searchDiag1(const in vec2 texCoord,const in vec2 dir,out vec2 e){vec4 coord=vec4(texCoord,-1.0,1.0);vec3 t=vec3(texelSize,1.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(coord.z<float(MAX_SEARCH_STEPS_DIAG_INT-1)&&coord.w>0.9)){break;}coord.xyz=t*vec3(dir,1.0)+coord.xyz;e=texture2D(inputBuffer,coord.xy).rg;coord.w=dot(e,vec2(0.5));}return coord.zw;}vec2 searchDiag2(const in vec2 texCoord,const in vec2 dir,out vec2 e){vec4 coord=vec4(texCoord,-1.0,1.0);coord.x+=0.25*texelSize.x;vec3 t=vec3(texelSize,1.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(coord.z<float(MAX_SEARCH_STEPS_DIAG_INT-1)&&coord.w>0.9)){break;}coord.xyz=t*vec3(dir,1.0)+coord.xyz;e=texture2D(inputBuffer,coord.xy).rg;e=decodeDiagBilinearAccess(e);coord.w=dot(e,vec2(0.5));}return coord.zw;}vec2 areaDiag(const in vec2 dist,const in vec2 e,const in float offset){vec2 texCoord=vec2(AREATEX_MAX_DISTANCE_DIAG,AREATEX_MAX_DISTANCE_DIAG)*e+dist;texCoord=AREATEX_PIXEL_SIZE*texCoord+0.5*AREATEX_PIXEL_SIZE;texCoord.x+=0.5;texCoord.y+=AREATEX_SUBTEX_SIZE*offset;return texture2D(areaTexture,texCoord).rg;}vec2 calculateDiagWeights(const in vec2 texCoord,const in vec2 e,const in vec4 subsampleIndices){vec2 weights=vec2(0.0);vec4 d;vec2 end;if(e.r>0.0){d.xz=searchDiag1(texCoord,vec2(-1.0,1.0),end);d.x+=float(end.y>0.9);}else{d.xz=vec2(0.0);}d.yw=searchDiag1(texCoord,vec2(1.0,-1.0),end);if(d.x+d.y>2.0){vec4 coords=vec4(-d.x+0.25,d.x,d.y,-d.y-0.25)*texelSize.xyxy+texCoord.xyxy;vec4 c;c.xy=sampleLevelZeroOffset(inputBuffer,coords.xy,vec2(-1,0)).rg;c.zw=sampleLevelZeroOffset(inputBuffer,coords.zw,vec2(1,0)).rg;c.yxwz=decodeDiagBilinearAccess(c.xyzw);vec2 cc=vec2(2.0)*c.xz+c.yw;movec(bvec2(step(0.9,d.zw)),cc,vec2(0.0));weights+=areaDiag(d.xy,cc,subsampleIndices.z);}d.xz=searchDiag2(texCoord,vec2(-1.0,-1.0),end);if(sampleLevelZeroOffset(inputBuffer,texCoord,vec2(1,0)).r>0.0){d.yw=searchDiag2(texCoord,vec2(1.0),end);d.y+=float(end.y>0.9);}else{d.yw=vec2(0.0);}if(d.x+d.y>2.0){vec4 coords=vec4(-d.x,-d.x,d.y,d.y)*texelSize.xyxy+texCoord.xyxy;vec4 c;c.x=sampleLevelZeroOffset(inputBuffer,coords.xy,vec2(-1,0)).g;c.y=sampleLevelZeroOffset(inputBuffer,coords.xy,vec2(0,-1)).r;c.zw=sampleLevelZeroOffset(inputBuffer,coords.zw,vec2(1,0)).gr;vec2 cc=vec2(2.0)*c.xz+c.yw;movec(bvec2(step(0.9,d.zw)),cc,vec2(0.0));weights+=areaDiag(d.xy,cc,subsampleIndices.w).gr;}return weights;}float searchLength(const in vec2 e,const in float offset){vec2 scale=SEARCHTEX_SIZE*vec2(0.5,-1.0);vec2 bias=SEARCHTEX_SIZE*vec2(offset,1.0);scale+=vec2(-1.0,1.0);bias+=vec2(0.5,-0.5);scale*=1.0/SEARCHTEX_PACKED_SIZE;bias*=1.0/SEARCHTEX_PACKED_SIZE;return texture2D(searchTexture,scale*e+bias).r;}float searchXLeft(in vec2 texCoord,const in float end){vec2 e=vec2(0.0,1.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(texCoord.x>end&&e.g>0.8281&&e.r==0.0)){break;}e=texture2D(inputBuffer,texCoord).rg;texCoord=vec2(-2.0,0.0)*texelSize+texCoord;}float offset=-(255.0/127.0)*searchLength(e,0.0)+3.25;return texelSize.x*offset+texCoord.x;}float searchXRight(vec2 texCoord,const in float end){vec2 e=vec2(0.0,1.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(texCoord.x<end&&e.g>0.8281&&e.r==0.0)){break;}e=texture2D(inputBuffer,texCoord).rg;texCoord=vec2(2.0,0.0)*texelSize.xy+texCoord;}float offset=-(255.0/127.0)*searchLength(e,0.5)+3.25;return-texelSize.x*offset+texCoord.x;}float searchYUp(vec2 texCoord,const in float end){vec2 e=vec2(1.0,0.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(texCoord.y>end&&e.r>0.8281&&e.g==0.0)){break;}e=texture2D(inputBuffer,texCoord).rg;texCoord=-vec2(0.0,2.0)*texelSize.xy+texCoord;}float offset=-(255.0/127.0)*searchLength(e.gr,0.0)+3.25;return texelSize.y*offset+texCoord.y;}float searchYDown(vec2 texCoord,const in float end){vec2 e=vec2(1.0,0.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;i++){if(!(texCoord.y<end&&e.r>0.8281&&e.g==0.0)){break;}e=texture2D(inputBuffer,texCoord).rg;texCoord=vec2(0.0,2.0)*texelSize.xy+texCoord;}float offset=-(255.0/127.0)*searchLength(e.gr,0.5)+3.25;return-texelSize.y*offset+texCoord.y;}vec2 area(const in vec2 dist,const in float e1,const in float e2,const in float offset){vec2 texCoord=vec2(AREATEX_MAX_DISTANCE)*round(4.0*vec2(e1,e2))+dist;texCoord=AREATEX_PIXEL_SIZE*texCoord+0.5*AREATEX_PIXEL_SIZE;texCoord.y=AREATEX_SUBTEX_SIZE*offset+texCoord.y;return texture2D(areaTexture,texCoord).rg;}void detectHorizontalCornerPattern(inout vec2 weights,const in vec4 texCoord,const in vec2 d){
    #if !defined(DISABLE_CORNER_DETECTION)
    vec2 leftRight=step(d.xy,d.yx);vec2 rounding=(1.0-CORNER_ROUNDING_NORM)*leftRight;rounding/=leftRight.x+leftRight.y;vec2 factor=vec2(1.0);factor.x-=rounding.x*sampleLevelZeroOffset(inputBuffer,texCoord.xy,vec2(0,1)).r;factor.x-=rounding.y*sampleLevelZeroOffset(inputBuffer,texCoord.zw,vec2(1,1)).r;factor.y-=rounding.x*sampleLevelZeroOffset(inputBuffer,texCoord.xy,vec2(0,-2)).r;factor.y-=rounding.y*sampleLevelZeroOffset(inputBuffer,texCoord.zw,vec2(1,-2)).r;weights*=clamp(factor,0.0,1.0);
    #endif
    }void detectVerticalCornerPattern(inout vec2 weights,const in vec4 texCoord,const in vec2 d){
    #if !defined(DISABLE_CORNER_DETECTION)
    vec2 leftRight=step(d.xy,d.yx);vec2 rounding=(1.0-CORNER_ROUNDING_NORM)*leftRight;rounding/=leftRight.x+leftRight.y;vec2 factor=vec2(1.0);factor.x-=rounding.x*sampleLevelZeroOffset(inputBuffer,texCoord.xy,vec2(1,0)).g;factor.x-=rounding.y*sampleLevelZeroOffset(inputBuffer,texCoord.zw,vec2(1,1)).g;factor.y-=rounding.x*sampleLevelZeroOffset(inputBuffer,texCoord.xy,vec2(-2,0)).g;factor.y-=rounding.y*sampleLevelZeroOffset(inputBuffer,texCoord.zw,vec2(-2,1)).g;weights*=clamp(factor,0.0,1.0);
    #endif
    }void main(){vec4 weights=vec4(0.0);vec4 subsampleIndices=vec4(0.0);vec2 e=texture2D(inputBuffer,vUv).rg;if(e.g>0.0){
    #if !defined(DISABLE_DIAG_DETECTION)
    weights.rg=calculateDiagWeights(vUv,e,subsampleIndices);if(weights.r==-weights.g){
    #endif
    vec2 d;vec3 coords;coords.x=searchXLeft(vOffset[0].xy,vOffset[2].x);coords.y=vOffset[1].y;d.x=coords.x;float e1=texture2D(inputBuffer,coords.xy).r;coords.z=searchXRight(vOffset[0].zw,vOffset[2].y);d.y=coords.z;d=round(resolution.xx*d+-vPixCoord.xx);vec2 sqrtD=sqrt(abs(d));float e2=sampleLevelZeroOffset(inputBuffer,coords.zy,vec2(1,0)).r;weights.rg=area(sqrtD,e1,e2,subsampleIndices.y);coords.y=vUv.y;detectHorizontalCornerPattern(weights.rg,coords.xyzy,d);
    #if !defined(DISABLE_DIAG_DETECTION)
    }else{e.r=0.0;}
    #endif
    }if(e.r>0.0){vec2 d;vec3 coords;coords.y=searchYUp(vOffset[1].xy,vOffset[2].z);coords.x=vOffset[0].x;d.x=coords.y;float e1=texture2D(inputBuffer,coords.xy).g;coords.z=searchYDown(vOffset[1].zw,vOffset[2].w);d.y=coords.z;d=round(resolution.yy*d-vPixCoord.yy);vec2 sqrtD=sqrt(abs(d));float e2=sampleLevelZeroOffset(inputBuffer,coords.xz,vec2(0,1)).g;weights.ba=area(sqrtD,e1,e2,subsampleIndices.x);coords.x=vUv.x;detectVerticalCornerPattern(weights.ba,coords.xyxz,d);}gl_FragColor=weights;}`,
    VB = "uniform vec2 texelSize;uniform vec2 resolution;varying vec2 vUv;varying vec4 vOffset[3];varying vec2 vPixCoord;void main(){vUv=position.xy*0.5+0.5;vPixCoord=vUv*resolution;vOffset[0]=vUv.xyxy+texelSize.xyxy*vec4(-0.25,-0.125,1.25,-0.125);vOffset[1]=vUv.xyxy+texelSize.xyxy*vec4(-0.125,-0.25,-0.125,1.25);vOffset[2]=vec4(vOffset[0].xz,vOffset[1].yw)+vec4(-2.0,2.0,-2.0,2.0)*texelSize.xxyy*MAX_SEARCH_STEPS_FLOAT;gl_Position=vec4(position.xy,1.0,1.0);}",
    WB = class  extends fe{
        constructor(i=new H, e=new H)
        {
            super({
                name: "SMAAWeightsMaterial",
                defines: {
                    MAX_SEARCH_STEPS_INT: "16",
                    MAX_SEARCH_STEPS_FLOAT: "16.0",
                    MAX_SEARCH_STEPS_DIAG_INT: "8",
                    MAX_SEARCH_STEPS_DIAG_FLOAT: "8.0",
                    CORNER_ROUNDING: "25",
                    CORNER_ROUNDING_NORM: "0.25",
                    AREATEX_MAX_DISTANCE: "16.0",
                    AREATEX_MAX_DISTANCE_DIAG: "20.0",
                    AREATEX_PIXEL_SIZE: "(1.0 / vec2(160.0, 560.0))",
                    AREATEX_SUBTEX_SIZE: "(1.0 / 7.0)",
                    SEARCHTEX_SIZE: "vec2(66.0, 33.0)",
                    SEARCHTEX_PACKED_SIZE: "vec2(64.0, 16.0)"
                },
                uniforms: {
                    inputBuffer: new Me(null),
                    searchTexture: new Me(null),
                    areaTexture: new Me(null),
                    resolution: new Me(e),
                    texelSize: new Me(i)
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                fragmentShader: HB,
                vertexShader: VB
            })
        }
        set inputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        setInputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        get searchTexture()
        {
            return this.uniforms.searchTexture.value
        }
        set searchTexture(i)
        {
            this.uniforms.searchTexture.value = i
        }
        get areaTexture()
        {
            return this.uniforms.areaTexture.value
        }
        set areaTexture(i)
        {
            this.uniforms.areaTexture.value = i
        }
        setLookupTextures(i, e)
        {
            this.searchTexture = i,
            this.areaTexture = e
        }
        get orthogonalSearchSteps()
        {
            return Number(this.defines.MAX_SEARCH_STEPS_INT)
        }
        set orthogonalSearchSteps(i)
        {
            const e = Math.min(Math.max(i, 0), 112);
            this.defines.MAX_SEARCH_STEPS_INT = e.toFixed("0"),
            this.defines.MAX_SEARCH_STEPS_FLOAT = e.toFixed("1"),
            this.needsUpdate = !0
        }
        setOrthogonalSearchSteps(i)
        {
            this.orthogonalSearchSteps = i
        }
        get diagonalSearchSteps()
        {
            return Number(this.defines.MAX_SEARCH_STEPS_DIAG_INT)
        }
        set diagonalSearchSteps(i)
        {
            const e = Math.min(Math.max(i, 0), 20);
            this.defines.MAX_SEARCH_STEPS_DIAG_INT = e.toFixed("0"),
            this.defines.MAX_SEARCH_STEPS_DIAG_FLOAT = e.toFixed("1"),
            this.needsUpdate = !0
        }
        setDiagonalSearchSteps(i)
        {
            this.diagonalSearchSteps = i
        }
        get diagonalDetection()
        {
            return this.defines.DISABLE_DIAG_DETECTION === void 0
        }
        set diagonalDetection(i)
        {
            i ? delete this.defines.DISABLE_DIAG_DETECTION : this.defines.DISABLE_DIAG_DETECTION = "1",
            this.needsUpdate = !0
        }
        isDiagonalDetectionEnabled()
        {
            return this.diagonalDetection
        }
        setDiagonalDetectionEnabled(i)
        {
            this.diagonalDetection = i
        }
        get cornerRounding()
        {
            return Number(this.defines.CORNER_ROUNDING)
        }
        set cornerRounding(i)
        {
            const e = Math.min(Math.max(i, 0), 100);
            this.defines.CORNER_ROUNDING = e.toFixed("4"),
            this.defines.CORNER_ROUNDING_NORM = (e / 100).toFixed("4"),
            this.needsUpdate = !0
        }
        setCornerRounding(i)
        {
            this.cornerRounding = i
        }
        get cornerDetection()
        {
            return this.defines.DISABLE_CORNER_DETECTION === void 0
        }
        set cornerDetection(i)
        {
            i ? delete this.defines.DISABLE_CORNER_DETECTION : this.defines.DISABLE_CORNER_DETECTION = "1",
            this.needsUpdate = !0
        }
        isCornerRoundingEnabled()
        {
            return this.cornerDetection
        }
        setCornerRoundingEnabled(i)
        {
            this.cornerDetection = i
        }
        setSize(i, e)
        {
            const t = this.uniforms;
            t.texelSize.value.set(1 / i, 1 / e),
            t.resolution.value.set(i, e)
        }
    }
    ,
    P0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAYAAACm53kpAAAAeElEQVRYR+2XSwqAMAxEJ168ePEqwRSKhIIiuHjJqiU0gWE+1CQdApcVAMUAuARaMGCX1MIL/Ow13++9lW2s3mW9MWvsnWc/2fvGygwPAN4E8QzAA4CXAB6AHjG4JTHYI1ey3pcx6FHnEfhLDOIBKAmUBK6/ANUDTlROXAHd9EC1AAAAAElFTkSuQmCC",
    D0 = "data:image/png;base64,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",
    YB = "uniform sampler2D weightMap;varying vec2 vOffset0;varying vec2 vOffset1;void movec(const in bvec2 c,inout vec2 variable,const in vec2 value){if(c.x){variable.x=value.x;}if(c.y){variable.y=value.y;}}void movec(const in bvec4 c,inout vec4 variable,const in vec4 value){movec(c.xy,variable.xy,value.xy);movec(c.zw,variable.zw,value.zw);}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec4 a;a.x=texture2D(weightMap,vOffset0).a;a.y=texture2D(weightMap,vOffset1).g;a.wz=texture2D(weightMap,uv).rb;vec4 color=inputColor;if(dot(a,vec4(1.0))>=1e-5){bool h=max(a.x,a.z)>max(a.y,a.w);vec4 blendingOffset=vec4(0.0,a.y,0.0,a.w);vec2 blendingWeight=a.yw;movec(bvec4(h),blendingOffset,vec4(a.x,0.0,a.z,0.0));movec(bvec2(h),blendingWeight,a.xz);blendingWeight/=dot(blendingWeight,vec2(1.0));vec4 blendingCoord=blendingOffset*vec4(texelSize,-texelSize)+uv.xyxy;color=blendingWeight.x*texture2D(inputBuffer,blendingCoord.xy);color+=blendingWeight.y*texture2D(inputBuffer,blendingCoord.zw);}outputColor=color;}",
    qB = "varying vec2 vOffset0;varying vec2 vOffset1;void mainSupport(const in vec2 uv){vOffset0=uv+texelSize*vec2(1.0,0.0);vOffset1=uv+texelSize*vec2(0.0,1.0);}",
    XB = class  extends Bc{
        constructor({blendFunction: i=ct.SRC, preset: e=so.MEDIUM, edgeDetectionMode: t=c_.COLOR, predicationMode: s=NB.DISABLED}={})
        {
            super("SMAAEffect", YB, {
                vertexShader: qB,
                blendFunction: i,
                attributes: Is.CONVOLUTION | Is.DEPTH,
                uniforms: new Map([["weightMap", new Me(null)]])
            });
            let n,
                r;
            arguments.length > 1 && (n = arguments[0], r = arguments[1], arguments.length > 2 && (e = arguments[2]), arguments.length > 3 && (t = arguments[3])),
            this.renderTargetEdges = new vt(1, 1, {
                depthBuffer: !1
            }),
            this.renderTargetEdges.texture.name = "SMAA.Edges",
            this.renderTargetWeights = this.renderTargetEdges.clone(),
            this.renderTargetWeights.texture.name = "SMAA.Weights",
            this.uniforms.get("weightMap").value = this.renderTargetWeights.texture,
            this.clearPass = new Ic(!0, !1, !1),
            this.clearPass.overrideClearColor = new Z(0),
            this.clearPass.overrideClearAlpha = 1,
            this.edgeDetectionPass = new Os(new GB),
            this.edgeDetectionMaterial.edgeDetectionMode = t,
            this.edgeDetectionMaterial.predicationMode = s,
            this.weightsPass = new Os(new WB);
            const a = new Jy;
            a.onLoad = () => {
                const o = new Rt(n);
                o.name = "SMAA.Search",
                o.magFilter = gt,
                o.minFilter = gt,
                o.generateMipmaps = !1,
                o.needsUpdate = !0,
                o.flipY = !0,
                this.weightsMaterial.searchTexture = o;
                const l = new Rt(r);
                l.name = "SMAA.Area",
                l.magFilter = _t,
                l.minFilter = _t,
                l.generateMipmaps = !1,
                l.needsUpdate = !0,
                l.flipY = !1,
                this.weightsMaterial.areaTexture = l,
                this.dispatchEvent({
                    type: "load"
                })
            },
            a.itemStart("search"),
            a.itemStart("area"),
            n !== void 0 && r !== void 0 ? (a.itemEnd("search"), a.itemEnd("area")) : typeof Image < "u" && (n = new Image, r = new Image, n.addEventListener("load", () => a.itemEnd("search")), r.addEventListener("load", () => a.itemEnd("area")), n.src = P0, r.src = D0),
            this.applyPreset(e)
        }
        get edgesTexture()
        {
            return this.renderTargetEdges.texture
        }
        getEdgesTexture()
        {
            return this.edgesTexture
        }
        get weightsTexture()
        {
            return this.renderTargetWeights.texture
        }
        getWeightsTexture()
        {
            return this.weightsTexture
        }
        get edgeDetectionMaterial()
        {
            return this.edgeDetectionPass.fullscreenMaterial
        }
        get colorEdgesMaterial()
        {
            return this.edgeDetectionMaterial
        }
        getEdgeDetectionMaterial()
        {
            return this.edgeDetectionMaterial
        }
        get weightsMaterial()
        {
            return this.weightsPass.fullscreenMaterial
        }
        getWeightsMaterial()
        {
            return this.weightsMaterial
        }
        setEdgeDetectionThreshold(i)
        {
            this.edgeDetectionMaterial.edgeDetectionThreshold = i
        }
        setOrthogonalSearchSteps(i)
        {
            this.weightsMaterial.orthogonalSearchSteps = i
        }
        applyPreset(i)
        {
            const e = this.edgeDetectionMaterial,
                t = this.weightsMaterial;
            switch (i) {
            case so.LOW:
                e.edgeDetectionThreshold = .15,
                t.orthogonalSearchSteps = 4,
                t.diagonalDetection = !1,
                t.cornerDetection = !1;
                break;
            case so.MEDIUM:
                e.edgeDetectionThreshold = .1,
                t.orthogonalSearchSteps = 8,
                t.diagonalDetection = !1,
                t.cornerDetection = !1;
                break;
            case so.HIGH:
                e.edgeDetectionThreshold = .1,
                t.orthogonalSearchSteps = 16,
                t.diagonalSearchSteps = 8,
                t.cornerRounding = 25,
                t.diagonalDetection = !0,
                t.cornerDetection = !0;
                break;
            case so.ULTRA:
                e.edgeDetectionThreshold = .05,
                t.orthogonalSearchSteps = 32,
                t.diagonalSearchSteps = 16,
                t.cornerRounding = 25,
                t.diagonalDetection = !0,
                t.cornerDetection = !0;
                break
            }
        }
        setDepthTexture(i, e=ms)
        {
            this.edgeDetectionMaterial.depthBuffer = i,
            this.edgeDetectionMaterial.depthPacking = e
        }
        update(i, e, t)
        {
            this.clearPass.render(i, this.renderTargetEdges),
            this.edgeDetectionPass.render(i, e, this.renderTargetEdges),
            this.weightsPass.render(i, this.renderTargetEdges, this.renderTargetWeights)
        }
        setSize(i, e)
        {
            this.edgeDetectionMaterial.setSize(i, e),
            this.weightsMaterial.setSize(i, e),
            this.renderTargetEdges.setSize(i, e),
            this.renderTargetWeights.setSize(i, e)
        }
        dispose()
        {
            const {searchTexture: i, areaTexture: e} = this.weightsMaterial;
            i !== null && e !== null && (i.dispose(), e.dispose()),
            super.dispose()
        }
        static get searchImageDataURL()
        {
            return P0
        }
        static get areaImageDataURL()
        {
            return D0
        }
    }
    ,
    KB = `#include <common>
    #include <packing>
    #include <dithering_pars_fragment>
    #define packFloatToRGBA(v) packDepthToRGBA(v)
    #define unpackRGBAToFloat(v) unpackRGBAToDepth(v)
    #ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D inputBuffer;
    #else
    uniform lowp sampler2D inputBuffer;
    #endif
    #if DEPTH_PACKING == 3201
    uniform lowp sampler2D depthBuffer;
    #elif defined(GL_FRAGMENT_PRECISION_HIGH)
    uniform highp sampler2D depthBuffer;
    #else
    uniform mediump sampler2D depthBuffer;
    #endif
    uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;
    #if THREE_REVISION < 143
    #define luminance(v) linearToRelativeLuminance(v)
    #endif
    #if THREE_REVISION >= 137
    vec4 sRGBToLinear(const in vec4 value){return vec4(mix(pow(value.rgb*0.9478672986+vec3(0.0521327014),vec3(2.4)),value.rgb*0.0773993808,vec3(lessThanEqual(value.rgb,vec3(0.04045)))),value.a);}
    #endif
    float readDepth(const in vec2 uv){
    #if DEPTH_PACKING == 3201
    return unpackRGBAToDepth(texture2D(depthBuffer,uv));
    #else
    return texture2D(depthBuffer,uv).r;
    #endif
    }float getViewZ(const in float depth){
    #ifdef PERSPECTIVE_CAMERA
    return perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
    #else
    return orthographicDepthToViewZ(depth,cameraNear,cameraFar);
    #endif
    }vec3 RGBToHCV(const in vec3 RGB){vec4 P=mix(vec4(RGB.bg,-1.0,2.0/3.0),vec4(RGB.gb,0.0,-1.0/3.0),step(RGB.b,RGB.g));vec4 Q=mix(vec4(P.xyw,RGB.r),vec4(RGB.r,P.yzx),step(P.x,RGB.r));float C=Q.x-min(Q.w,Q.y);float H=abs((Q.w-Q.y)/(6.0*C+EPSILON)+Q.z);return vec3(H,C,Q.x);}vec3 RGBToHSL(const in vec3 RGB){vec3 HCV=RGBToHCV(RGB);float L=HCV.z-HCV.y*0.5;float S=HCV.y/(1.0-abs(L*2.0-1.0)+EPSILON);return vec3(HCV.x,S,L);}vec3 HueToRGB(const in float H){float R=abs(H*6.0-3.0)-1.0;float G=2.0-abs(H*6.0-2.0);float B=2.0-abs(H*6.0-4.0);return clamp(vec3(R,G,B),0.0,1.0);}vec3 HSLToRGB(const in vec3 HSL){vec3 RGB=HueToRGB(HSL.x);float C=(1.0-abs(2.0*HSL.z-1.0))*HSL.y;return(RGB-0.5)*C+HSL.z;}FRAGMENT_HEAD void main(){FRAGMENT_MAIN_UV vec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGE color0.a=clamp(color0.a,0.0,1.0);gl_FragColor=color0;
    #ifdef ENCODE_OUTPUT
    #include <colorspace_fragment>
    #endif
    #include <dithering_fragment>
    }`,
    JB = "uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}",
    jB = class  extends fe{
        constructor(i, e, t, s, n=!1)
        {
            super({
                name: "EffectMaterial",
                defines: {
                    THREE_REVISION: Aa.replace(/\D+/g, ""),
                    DEPTH_PACKING: "0",
                    ENCODE_OUTPUT: "1"
                },
                uniforms: {
                    inputBuffer: new Me(null),
                    depthBuffer: new Me(null),
                    resolution: new Me(new H),
                    texelSize: new Me(new H),
                    cameraNear: new Me(.3),
                    cameraFar: new Me(1e3),
                    aspect: new Me(1),
                    time: new Me(0)
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                dithering: n
            }),
            i && this.setShaderParts(i),
            e && this.setDefines(e),
            t && this.setUniforms(t),
            this.copyCameraSettings(s)
        }
        set inputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        setInputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        get depthBuffer()
        {
            return this.uniforms.depthBuffer.value
        }
        set depthBuffer(i)
        {
            this.uniforms.depthBuffer.value = i
        }
        get depthPacking()
        {
            return Number(this.defines.DEPTH_PACKING)
        }
        set depthPacking(i)
        {
            this.defines.DEPTH_PACKING = i.toFixed(0),
            this.needsUpdate = !0
        }
        setDepthBuffer(i, e=ms)
        {
            this.depthBuffer = i,
            this.depthPacking = e
        }
        setShaderData(i)
        {
            this.setShaderParts(i.shaderParts),
            this.setDefines(i.defines),
            this.setUniforms(i.uniforms),
            this.setExtensions(i.extensions)
        }
        setShaderParts(i)
        {
            return this.fragmentShader = KB.replace(At.FRAGMENT_HEAD, i.get(At.FRAGMENT_HEAD) || "").replace(At.FRAGMENT_MAIN_UV, i.get(At.FRAGMENT_MAIN_UV) || "").replace(At.FRAGMENT_MAIN_IMAGE, i.get(At.FRAGMENT_MAIN_IMAGE) || ""), this.vertexShader = JB.replace(At.VERTEX_HEAD, i.get(At.VERTEX_HEAD) || "").replace(At.VERTEX_MAIN_SUPPORT, i.get(At.VERTEX_MAIN_SUPPORT) || ""), this.fragmentShader = Ko(this.fragmentShader), this.needsUpdate = !0, this
        }
        setDefines(i)
        {
            for (const e of i.entries())
                this.defines[e[0]] = e[1];
            return this.needsUpdate = !0, this
        }
        setUniforms(i)
        {
            for (const e of i.entries())
                this.uniforms[e[0]] = e[1];
            return this
        }
        setExtensions(i)
        {
            this.extensions = {};
            for (const e of i)
                this.extensions[e] = !0;
            return this
        }
        get encodeOutput()
        {
            return this.defines.ENCODE_OUTPUT !== void 0
        }
        set encodeOutput(i)
        {
            this.encodeOutput !== i && (i ? this.defines.ENCODE_OUTPUT = "1" : delete this.defines.ENCODE_OUTPUT, this.needsUpdate = !0)
        }
        isOutputEncodingEnabled(i)
        {
            return this.encodeOutput
        }
        setOutputEncodingEnabled(i)
        {
            this.encodeOutput = i
        }
        get time()
        {
            return this.uniforms.time.value
        }
        set time(i)
        {
            this.uniforms.time.value = i
        }
        setDeltaTime(i)
        {
            this.uniforms.time.value += i
        }
        adoptCameraSettings(i)
        {
            this.copyCameraSettings(i)
        }
        copyCameraSettings(i)
        {
            i && (this.uniforms.cameraNear.value = i.near, this.uniforms.cameraFar.value = i.far, i instanceof gi ? this.defines.PERSPECTIVE_CAMERA = "1" : delete this.defines.PERSPECTIVE_CAMERA, this.needsUpdate = !0)
        }
        setSize(i, e)
        {
            const t = this.uniforms;
            t.resolution.value.set(i, e),
            t.texelSize.value.set(1 / i, 1 / e),
            t.aspect.value = i / e
        }
        static get Section()
        {
            return At
        }
    }
    ,
    ZB = `#ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D inputBuffer;
    #else
    uniform lowp sampler2D inputBuffer;
    #endif
    uniform vec2 kernel[STEPS];varying vec2 vOffset;varying vec2 vUv;void main(){vec4 result=texture2D(inputBuffer,vUv)*kernel[0].y;for(int i=1;i<STEPS;++i){vec2 offset=kernel[i].x*vOffset;vec4 c0=texture2D(inputBuffer,vUv+offset);vec4 c1=texture2D(inputBuffer,vUv-offset);result+=(c0+c1)*kernel[i].y;}gl_FragColor=result;
    #include <colorspace_fragment>
    }`,
    $B = "uniform vec2 texelSize;uniform vec2 direction;uniform float scale;varying vec2 vOffset;varying vec2 vUv;void main(){vOffset=direction*texelSize*scale;vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}",
    eP = class  extends fe{
        constructor({kernelSize: i=35}={})
        {
            super({
                name: "GaussianBlurMaterial",
                uniforms: {
                    inputBuffer: new Me(null),
                    texelSize: new Me(new H),
                    direction: new Me(new H),
                    kernel: new Me(null),
                    scale: new Me(1)
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                fragmentShader: ZB,
                vertexShader: $B
            }),
            this.fragmentShader = Ko(this.fragmentShader),
            this._kernelSize = 0,
            this.kernelSize = i
        }
        set inputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        get kernelSize()
        {
            return this._kernelSize
        }
        set kernelSize(i)
        {
            this._kernelSize = i,
            this.generateKernel(i)
        }
        get direction()
        {
            return this.uniforms.direction.value
        }
        get scale()
        {
            return this.uniforms.scale.value
        }
        set scale(i)
        {
            this.uniforms.scale.value = i
        }
        generateKernel(i)
        {
            const e = new S2(i),
                t = e.linearSteps,
                s = new Float64Array(t * 2);
            for (let n = 0, r = 0; n < t; ++n)
                s[r++] = e.linearOffsets[n],
                s[r++] = e.linearWeights[n];
            this.uniforms.kernel.value = s,
            this.defines.STEPS = t.toFixed(0),
            this.needsUpdate = !0
        }
        setSize(i, e)
        {
            this.uniforms.texelSize.value.set(1 / i, 1 / e)
        }
    }
    ;
function R0(i, e, t) {
    for (const s of e) {
        const n = "$1" + i + s.charAt(0).toUpperCase() + s.slice(1),
            r = new RegExp("([^\\.])(\\b" + s + "\\b)", "g");
        for (const a of t.entries())
            a[1] !== null && t.set(a[0], a[1].replace(r, n))
    }
}
function tP(i, e, t) {
    let s = e.getFragmentShader(),
        n = e.getVertexShader();
    const r = s !== void 0 && /mainImage/.test(s),
        a = s !== void 0 && /mainUv/.test(s);
    if (t.attributes |= e.getAttributes(), s === void 0)
        throw new Error(`Missing fragment shader (${e.name})`);
    if (a && t.attributes & Is.CONVOLUTION)
        throw new Error(`Effects that transform UVs are incompatible with convolution effects (${e.name})`);
    if (!r && !a)
        throw new Error(`Could not find mainImage or mainUv function (${e.name})`);
    {
        const o = /\w+\s+(\w+)\([\w\s,]*\)\s*{/g,
            l = t.shaderParts;
        let c = l.get(At.FRAGMENT_HEAD) || "",
            h = l.get(At.FRAGMENT_MAIN_UV) || "",
            d = l.get(At.FRAGMENT_MAIN_IMAGE) || "",
            u = l.get(At.VERTEX_HEAD) || "",
            f = l.get(At.VERTEX_MAIN_SUPPORT) || "";
        const p = new Set,
            A = new Set;
        if (a && (h += `	${i}MainUv(UV);
        `, t.uvTransformation = !0), n !== null && /mainSupport/.test(n)) {
            const x = /mainSupport *\([\w\s]*?uv\s*?\)/.test(n);
            f += `	${i}MainSupport(`,
            f += x ? `vUv);
            ` : `);
            `;
            for (const v of n.matchAll(/(?:varying\s+\w+\s+([\S\s]*?);)/g))
                for (const y of v[1].split(/\s*,\s*/))
                    t.varyings.add(y),
                    p.add(y),
                    A.add(y);
            for (const v of n.matchAll(o))
                A.add(v[1])
        }
        for (const x of s.matchAll(o))
            A.add(x[1]);
        for (const x of e.defines.keys())
            A.add(x.replace(/\([\w\s,]*\)/g, ""));
        for (const x of e.uniforms.keys())
            A.add(x);
        A.delete("while"),
        A.delete("for"),
        A.delete("if"),
        e.uniforms.forEach((x, v) => t.uniforms.set(i + v.charAt(0).toUpperCase() + v.slice(1), x)),
        e.defines.forEach((x, v) => t.defines.set(i + v.charAt(0).toUpperCase() + v.slice(1), x));
        const m = new Map([["fragment", s], ["vertex", n]]);
        R0(i, A, t.defines),
        R0(i, A, m),
        s = m.get("fragment"),
        n = m.get("vertex");
        const g = e.blendMode;
        if (t.blendModes.set(g.blendFunction, g), r) {
            e.inputColorSpace !== null && e.inputColorSpace !== t.colorSpace && (d += e.inputColorSpace === Ve ? `color0 = LinearTosRGB(color0);
            	` : `color0 = sRGBToLinear(color0);
            	`),
            e.outputColorSpace !== _s ? t.colorSpace = e.outputColorSpace : e.inputColorSpace !== null && (t.colorSpace = e.inputColorSpace);
            const x = /MainImage *\([\w\s,]*?depth[\w\s,]*?\)/;
            d += `${i}MainImage(color0, UV, `,
            t.attributes & Is.DEPTH && x.test(s) && (d += "depth, ", t.readDepth = !0),
            d += `color1);
            	`;
            const v = i + "BlendOpacity";
            t.uniforms.set(v, g.opacity),
            d += `color0 = blend${g.blendFunction}(color0, color1, ${v});

            	`,
            c += `uniform float ${v};

            `
        }
        if (c += s + `
        `, n !== null && (u += n + `
        `), l.set(At.FRAGMENT_HEAD, c), l.set(At.FRAGMENT_MAIN_UV, h), l.set(At.FRAGMENT_MAIN_IMAGE, d), l.set(At.VERTEX_HEAD, u), l.set(At.VERTEX_MAIN_SUPPORT, f), e.extensions !== null)
            for (const x of e.extensions)
                t.extensions.add(x)
    }
}
var Or = class  extends gs{
        constructor(i, ...e)
        {
            super("EffectPass"),
            this.fullscreenMaterial = new jB(null, null, null, i),
            this.listener = t => this.handleEvent(t),
            this.effects = [],
            this.setEffects(e),
            this.skipRendering = !1,
            this.minTime = 1,
            this.maxTime = Number.POSITIVE_INFINITY,
            this.timeScale = 1
        }
        set mainScene(i)
        {
            for (const e of this.effects)
                e.mainScene = i
        }
        set mainCamera(i)
        {
            this.fullscreenMaterial.copyCameraSettings(i);
            for (const e of this.effects)
                e.mainCamera = i
        }
        get encodeOutput()
        {
            return this.fullscreenMaterial.encodeOutput
        }
        set encodeOutput(i)
        {
            this.fullscreenMaterial.encodeOutput = i
        }
        get dithering()
        {
            return this.fullscreenMaterial.dithering
        }
        set dithering(i)
        {
            const e = this.fullscreenMaterial;
            e.dithering = i,
            e.needsUpdate = !0
        }
        setEffects(i)
        {
            for (const e of this.effects)
                e.removeEventListener("change", this.listener);
            this.effects = i.sort((e, t) => t.attributes - e.attributes);
            for (const e of this.effects)
                e.addEventListener("change", this.listener)
        }
        updateMaterial()
        {
            const i = new C2;
            let e = 0;
            for (const a of this.effects)
                if (a.blendMode.blendFunction === ct.DST)
                    i.attributes |= a.getAttributes() & Is.DEPTH;
                else {
                    if (i.attributes & a.getAttributes() & Is.CONVOLUTION)
                        throw new Error(`Convolution effects cannot be merged (${a.name})`);
                    tP("e" + e++, a, i)
                }
            let t = i.shaderParts.get(At.FRAGMENT_HEAD),
                s = i.shaderParts.get(At.FRAGMENT_MAIN_IMAGE),
                n = i.shaderParts.get(At.FRAGMENT_MAIN_UV);
            const r = /\bblend\b/g;
            for (const a of i.blendModes.values())
                t += a.getShaderCode().replace(r, `blend${a.blendFunction}`) + `
                `;
            i.attributes & Is.DEPTH ? (i.readDepth && (s = `float depth = readDepth(UV);

            	` + s), this.needsDepthTexture = this.getDepthTexture() === null) : this.needsDepthTexture = !1,
            i.colorSpace === Ve && (s += `color0 = sRGBToLinear(color0);
            	`),
            i.uvTransformation ? (n = `vec2 transformedUv = vUv;
            ` + n, i.defines.set("UV", "transformedUv")) : i.defines.set("UV", "vUv"),
            i.shaderParts.set(At.FRAGMENT_HEAD, t),
            i.shaderParts.set(At.FRAGMENT_MAIN_IMAGE, s),
            i.shaderParts.set(At.FRAGMENT_MAIN_UV, n);
            for (const [a, o] of i.shaderParts)
                o !== null && i.shaderParts.set(a, o.trim().replace(/^#/, `
                #`));
            this.skipRendering = e === 0,
            this.needsSwap = !this.skipRendering,
            this.fullscreenMaterial.setShaderData(i)
        }
        recompile()
        {
            this.updateMaterial()
        }
        getDepthTexture()
        {
            return this.fullscreenMaterial.depthBuffer
        }
        setDepthTexture(i, e=ms)
        {
            this.fullscreenMaterial.depthBuffer = i,
            this.fullscreenMaterial.depthPacking = e;
            for (const t of this.effects)
                t.setDepthTexture(i, e)
        }
        render(i, e, t, s, n)
        {
            for (const r of this.effects)
                r.update(i, e, s);
            if (!this.skipRendering || this.renderToScreen) {
                const r = this.fullscreenMaterial;
                r.inputBuffer = e.texture,
                r.time += s * this.timeScale,
                i.setRenderTarget(this.renderToScreen ? null : t),
                i.render(this.scene, this.camera)
            }
        }
        setSize(i, e)
        {
            this.fullscreenMaterial.setSize(i, e);
            for (const t of this.effects)
                t.setSize(i, e)
        }
        initialize(i, e, t)
        {
            this.renderer = i;
            for (const s of this.effects)
                s.initialize(i, e, t);
            this.updateMaterial(),
            t !== void 0 && t !== Ct && (this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1")
        }
        dispose()
        {
            super.dispose();
            for (const i of this.effects)
                i.removeEventListener("change", this.listener),
                i.dispose()
        }
        handleEvent(i)
        {
            switch (i.type) {
            case "change":
                this.recompile();
                break
            }
        }
    }
    ,
    iP = class  extends gs{
        constructor({kernelSize: i=35, iterations: e=1, resolutionScale: t=1, resolutionX: s=ti.AUTO_SIZE, resolutionY: n=ti.AUTO_SIZE}={})
        {
            super("GaussianBlurPass"),
            this.renderTargetA = new vt(1, 1, {
                depthBuffer: !1
            }),
            this.renderTargetA.texture.name = "Blur.Target.A",
            this.renderTargetB = this.renderTargetA.clone(),
            this.renderTargetB.texture.name = "Blur.Target.B",
            this.blurMaterial = new eP({
                kernelSize: i
            }),
            this.copyMaterial = new XA,
            this.copyMaterial.inputBuffer = this.renderTargetB.texture;
            const r = this.resolution = new ti(this, s, n, t);
            r.addEventListener("change", a => this.setSize(r.baseWidth, r.baseHeight)),
            this.iterations = e
        }
        render(i, e, t, s, n)
        {
            const r = this.scene,
                a = this.camera,
                o = this.renderTargetA,
                l = this.renderTargetB,
                c = this.blurMaterial;
            this.fullscreenMaterial = c;
            let h = e;
            for (let d = 0, u = Math.max(this.iterations, 1); d < u; ++d)
                c.direction.set(1, 0),
                c.inputBuffer = h.texture,
                i.setRenderTarget(o),
                i.render(r, a),
                c.direction.set(0, 1),
                c.inputBuffer = o.texture,
                i.setRenderTarget(l),
                i.render(r, a),
                d === 0 && u > 1 && (h = l);
            this.fullscreenMaterial = this.copyMaterial,
            i.setRenderTarget(this.renderToScreen ? null : t),
            i.render(r, a)
        }
        setSize(i, e)
        {
            const t = this.resolution;
            t.setBaseSize(i, e);
            const s = t.width,
                n = t.height;
            this.renderTargetA.setSize(s, n),
            this.renderTargetB.setSize(s, n),
            this.blurMaterial.setSize(i, e)
        }
        initialize(i, e, t)
        {
            t !== void 0 && (this.renderTargetA.texture.type = t, this.renderTargetB.texture.type = t, t !== Ct ? (this.blurMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1", this.copyMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1") : i !== null && i.outputColorSpace === Ve && (this.renderTargetA.texture.colorSpace = Ve, this.renderTargetB.texture.colorSpace = Ve))
        }
    }
    ,
    h_ = "float parabola(float x,float k){return pow(4.0*x*(1.0-x),k);}float pcurve(float x,float a,float b){float k=pow(a+b,a+b)/(pow(a,a)*pow(b,b));return k*pow(x,a)*pow(1.0-x,b);}",
    ae = "uniform Global{vec2 resolution;vec2 resolutionUI;float aspect;float time;float dtRatio;};",
    ii = "float median(sampler2D tMap,vec2 uv){vec3 tex=texture2D(tMap,uv).rgb;return max(min(tex.r,tex.g),min(max(tex.r,tex.g),tex.b))-0.5;}float msdf(sampler2D tMap,vec2 uv){float signedDist=median(tMap,uv);float d=fwidth(signedDist);return smoothstep(-d,d,signedDist);}float msdfOpaque(sampler2D tMap,vec2 uv){return step(0.0,median(tMap,uv));}float msdf(sampler2D tMap,vec2 uv,float outlineWidth){float signedDist=median(tMap,uv);float d=max(10e-6,fwidth(signedDist));return smoothstep(-d-outlineWidth,d-outlineWidth,signedDist)*smoothstep(outlineWidth+d,outlineWidth-d,signedDist);}float msdfOpaque(sampler2D tMap,vec2 uv,float outlineWidth){float signedDist=median(tMap,uv);return step(-outlineWidth,signedDist)*step(signedDist,outlineWidth);}",
    Ue = "float _linstep(float begin,float end,float t){return clamp((t-begin)/(end-begin),0.0,1.0);}float _pl(vec2 _input,vec2 start,vec2 end,float margin,float progress){vec2 v=end-start;float dist=length(v);vec2 dir=v/dist;return dot(dir,_input-start-dir*(dist+margin)*progress);}float _pl(vec3 _input,vec3 start,vec3 end,float margin,float progress){vec3 v=end-start;float dist=length(v);vec3 dir=v/dist;return dot(dir,_input-start-dir*(dist+margin)*progress);}float falloff(float _input,float start,float end,float margin,float progress){float m=margin*sign(end-start);float p=mix(start-m,end,progress);return _linstep(p+m,p,_input);}float falloffsmooth(float _input,float start,float end,float margin,float progress){float m=margin*sign(end-start);float p=mix(start-m,end,progress);return smoothstep(p+m,p,_input);}float falloff(vec2 _input,vec2 start,vec2 end,float margin,float progress){return _linstep(0.0,-margin,_pl(_input,start,end,margin,progress));}float falloffsmooth(vec2 _input,vec2 start,vec2 end,float margin,float progress){return smoothstep(0.0,-margin,_pl(_input,start,end,margin,progress));}float falloff(vec3 _input,vec3 start,vec3 end,float margin,float progress){return _linstep(0.0,-margin,_pl(_input,start,end,margin,progress));}float falloffsmooth(vec3 _input,vec3 start,vec3 end,float margin,float progress){return smoothstep(0.0,-margin,_pl(_input,start,end,margin,progress));}";
function sP(i, e) {
    if (i instanceof RegExp)
        return {
            keys: !1,
            pattern: i
        };
    var t,
        s,
        n,
        r,
        a = [],
        o = "",
        l = i.split("/");
    for (l[0] || l.shift(); n = l.shift();)
        t = n[0],
        t === "*" ? (a.push("wild"), o += "/(.*)") : t === ":" ? (s = n.indexOf("?", 1), r = n.indexOf(".", 1), a.push(n.substring(1, ~s ? s : ~r ? r : n.length)), o += ~s && !~r ? "(?:/([^/]+?))?" : "/([^/]+?)", ~r && (o += (~s ? "?" : "") + "\\" + n.substring(r))) : o += "/" + n;
    return {
        keys: a,
        pattern: new RegExp("^" + o + (e ? "(?=$|/)" : "/?$"), "i")
    }
}
function nP(i, e) {
    var t,
        s,
        n = [],
        r = {},
        a = r.format = function(o) {
            return o && (o = "/" + o.replace(/^\/|\/$/g, ""), t.test(o) && o.replace(t, "/"))
        };
    return i = "/" + (i || "").replace(/^\/|\/$/g, ""), t = i == "/" ? /^\/+/ : new RegExp("^\\" + i + "(?=\\/|$)\\/?", "i"), r.route = function(o, l) {
        o[0] == "/" && !t.test(o) && (o = i + o),
        history[(o === s || l ? "replace" : "push") + "State"](o, null, o)
    }, r.on = function(o, l) {
        return (o = sP(o)).fn = l, n.push(o), r
    }, r.run = function(o) {
        var l = 0,
            c = {},
            h,
            d;
        if (o = a(o || location.pathname)) {
            for (o = o.match(/[^\?#]*/)[0], s = o; l < n.length; l++)
                if (h = (d = n[l]).pattern.exec(o)) {
                    for (l = 0; l < d.keys.length;)
                        c[d.keys[l]] = h[++l] || null;
                    return d.fn(c), r
                }
            e && e(o)
        }
        return r
    }, r.listen = function(o) {
        U0("push"),
        U0("replace");
        function l(h) {
            r.run()
        }
        function c(h) {
            var d = h.target.closest("a"),
                u = d && d.getAttribute("href");
            h.ctrlKey || h.metaKey || h.altKey || h.shiftKey || h.button || h.defaultPrevented || !u || d.target || d.host !== location.host || u[0] == "#" || (u[0] != "/" || t.test(u)) && (h.preventDefault(), r.route(u))
        }
        return addEventListener("popstate", l), addEventListener("replacestate", l), addEventListener("pushstate", l), addEventListener("click", c), r.unlisten = function() {
            removeEventListener("popstate", l),
            removeEventListener("replacestate", l),
            removeEventListener("pushstate", l),
            removeEventListener("click", c)
        }, r.run(o)
    }, r
}
function U0(i, e) {
    history[i] || (history[i] = i, e = history[i += "State"], history[i] = function(t) {
        var s = new Event(i.toLowerCase());
        return s.uri = t, e.apply(this, arguments), dispatchEvent(s)
    })
}
var rP = Object.defineProperty,
    aP = (i, e, t) => e in i ? rP(i, e, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t
    }) : i[e] = t,
    Oe = (i, e, t) => (aP(i, typeof e != "symbol" ? e + "" : e, t), t),
    KA = (i, e, t) => {
        if (!e.has(i))
            throw TypeError("Cannot " + t)
    },
    U = (i, e, t) => (KA(i, e, "read from private field"), t ? t.call(i) : e.get(i)),
    te = (i, e, t) => {
        if (e.has(i))
            throw TypeError("Cannot add the same private member more than once");
        e instanceof WeakSet ? e.add(i) : e.set(i, t)
    },
    et = (i, e, t, s) => (KA(i, e, "write to private field"), s ? s.call(i, t) : e.set(i, t), t),
    L0 = (i, e, t, s) => ({
        set _(n) {
            et(i, e, n, t)
        },
        get _() {
            return U(i, e, s)
        }
    }),
    ve = (i, e, t) => (KA(i, e, "access private method"), t),
    Yp,
    eu,
    u_;
class oP {
    constructor()
    {
        te(this, Yp, null),
        te(this, eu, null),
        te(this, u_, !1)
    }
    async init() {}
    addToGui(e, t, s)
    {
        var n;
        (n = U(this, Yp)) == null || n.add(e, t, s)
    }
    showRenderInfo(e)
    {
        var t;
        (t = U(this, eu)) == null || t.add(e)
    }
    hideRenderInfo()
    {
        var e;
        (e = U(this, eu)) == null || e.remove()
    }
}
Yp = new WeakMap,
eu = new WeakMap,
u_ = new WeakMap;
const tu = new oP; /*!
 * GSAP 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/







let ps = {
        autoSleep: 120,
        force3D: "auto",
        nullTargetWarn: 1,
        units: {
            lineHeight: ""
        }
    },
    ko = {
        duration: .5,
        overwrite: !1,
        delay: 0
    },
    JA,
    Li,
    Gt,
    ws = 1e8,
    Ut = 1 / ws,
    qp = Math.PI * 2,
    lP = qp / 4,
    cP = 0,
    d_ = Math.sqrt,
    hP = Math.cos,
    uP = Math.sin,
    yi = i => typeof i == "string",
    si = i => typeof i == "function",
    Pn = i => typeof i == "number",
    jA = i => typeof i > "u",
    cn = i => typeof i == "object",
    Ji = i => i !== !1,
    ZA = () => typeof window < "u",
    yh = i => si(i) || yi(i),
    f_ = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {},
    Fi = Array.isArray,
    Xp = /(?:-?\.?\d|\.)+/gi,
    p_ = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
    po = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
    Df = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
    m_ = /[+-]=-?[.\d]+/,
    A_ = /[^,'"\[\]\s]+/gi,
    dP = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
    Wt,
    Js,
    Kp,
    $A,
    As = {},
    ju = {},
    g_,
    v_ = i => (ju = pa(i, As)) && ts,
    eg = (i, e) => console.warn("Invalid property", i, "set to", e, "Missing plugin? gsap.registerPlugin()"),
    vc = (i, e) => !e && console.warn(i),
    x_ = (i, e) => i && (As[i] = e) && ju && (ju[i] = e) || As,
    xc = () => 0,
    fP = {
        suppressEvents: !0,
        isStart: !0,
        kill: !1
    },
    iu = {
        suppressEvents: !0,
        kill: !1
    },
    pP = {
        suppressEvents: !0
    },
    tg = {},
    pr = [],
    Jp = {},
    y_,
    cs = {},
    Rf = {},
    F0 = 30,
    su = [],
    ig = "",
    sg = i => {
        let e = i[0],
            t,
            s;
        if (cn(e) || si(e) || (i = [i]), !(t = (e._gsap || {}).harness)) {
            for (s = su.length; s-- && !su[s].targetTest(e);)
                ;
            t = su[s]
        }
        for (s = i.length; s--;)
            i[s] && (i[s]._gsap || (i[s]._gsap = new X_(i[s], t))) || i.splice(s, 1);
        return i
    },
    na = i => i._gsap || sg(Es(i))[0]._gsap,
    __ = (i, e, t) => (t = i[e]) && si(t) ? i[e]() : jA(t) && i.getAttribute && i.getAttribute(e) || t,
    ji = (i, e) => (i = i.split(",")).forEach(e) || i,
    ai = i => Math.round(i * 1e5) / 1e5 || 0,
    vi = i => Math.round(i * 1e7) / 1e7 || 0,
    Co = (i, e) => {
        let t = e.charAt(0),
            s = parseFloat(e.substr(2));
        return i = parseFloat(i), t === "+" ? i + s : t === "-" ? i - s : t === "*" ? i * s : i / s
    },
    mP = (i, e) => {
        let t = e.length,
            s = 0;
        for (; i.indexOf(e[s]) < 0 && ++s < t;)
            ;
        return s < t
    },
    Zu = () => {
        let i = pr.length,
            e = pr.slice(0),
            t,
            s;
        for (Jp = {}, pr.length = 0, t = 0; t < i; t++)
            s = e[t],
            s && s._lazy && (s.render(s._lazy[0], s._lazy[1], !0)._lazy = 0)
    },
    w_ = (i, e, t, s) => {
        pr.length && !Li && Zu(),
        i.render(e, t, s || Li && e < 0 && (i._initted || i._startAt)),
        pr.length && !Li && Zu()
    },
    E_ = i => {
        let e = parseFloat(i);
        return (e || e === 0) && (i + "").match(A_).length < 2 ? e : yi(i) ? i.trim() : i
    },
    C_ = i => i,
    Bs = (i, e) => {
        for (let t in e)
            t in i || (i[t] = e[t]);
        return i
    },
    AP = i => (e, t) => {
        for (let s in t)
            s in e || s === "duration" && i || s === "ease" || (e[s] = t[s])
    },
    pa = (i, e) => {
        for (let t in e)
            i[t] = e[t];
        return i
    },
    jp = (i, e) => {
        for (let t in e)
            t !== "__proto__" && t !== "constructor" && t !== "prototype" && (i[t] = cn(e[t]) ? jp(i[t] || (i[t] = {}), e[t]) : e[t]);
        return i
    },
    $u = (i, e) => {
        let t = {},
            s;
        for (s in i)
            s in e || (t[s] = i[s]);
        return t
    },
    Xl = i => {
        let e = i.parent || Wt,
            t = i.keyframes ? AP(Fi(i.keyframes)) : Bs;
        if (Ji(i.inherit))
            for (; e;)
                t(i, e.vars.defaults),
                e = e.parent || e._dp;
        return i
    },
    gP = (i, e) => {
        let t = i.length,
            s = t === e.length;
        for (; s && t-- && i[t] === e[t];)
            ;
        return t < 0
    },
    S_ = (i, e, t="_first", s="_last", n) => {
        let r = i[s],
            a;
        if (n)
            for (a = e[n]; r && r[n] > a;)
                r = r._prev;
        return r ? (e._next = r._next, r._next = e) : (e._next = i[t], i[t] = e), e._next ? e._next._prev = e : i[s] = e, e._prev = r, e.parent = e._dp = i, e
    },
    Bd = (i, e, t="_first", s="_last") => {
        let n = e._prev,
            r = e._next;
        n ? n._next = r : i[t] === e && (i[t] = r),
        r ? r._prev = n : i[s] === e && (i[s] = n),
        e._next = e._prev = e.parent = null
    },
    vr = (i, e) => {
        i.parent && (!e || i.parent.autoRemoveChildren) && i.parent.remove && i.parent.remove(i),
        i._act = 0
    },
    ra = (i, e) => {
        if (i && (!e || e._end > i._dur || e._start < 0)) {
            let t = i;
            for (; t;)
                t._dirty = 1,
                t = t.parent
        }
        return i
    },
    vP = i => {
        let e = i.parent;
        for (; e && e.parent;)
            e._dirty = 1,
            e.totalDuration(),
            e = e.parent;
        return i
    },
    Zp = (i, e, t, s) => i._startAt && (Li ? i._startAt.revert(iu) : i.vars.immediateRender && !i.vars.autoRevert || i._startAt.render(e, !0, s)),
    M_ = i => !i || i._ts && M_(i.parent),
    N0 = i => i._repeat ? zo(i._tTime, i = i.duration() + i._rDelay) * i : 0,
    zo = (i, e) => {
        let t = Math.floor(i /= e);
        return i && t === i ? t - 1 : t
    },
    ed = (i, e) => (i - e._start) * e._ts + (e._ts >= 0 ? 0 : e._dirty ? e.totalDuration() : e._tDur),
    Pd = i => i._end = vi(i._start + (i._tDur / Math.abs(i._ts || i._rts || Ut) || 0)),
    Dd = (i, e) => {
        let t = i._dp;
        return t && t.smoothChildTiming && i._ts && (i._start = vi(t._time - (i._ts > 0 ? e / i._ts : ((i._dirty ? i.totalDuration() : i._tDur) - e) / -i._ts)), Pd(i), t._dirty || ra(t, i)), i
    },
    b_ = (i, e) => {
        let t;
        if ((e._time || !e._dur && e._initted || e._start < i._time && (e._dur || !e.add)) && (t = ed(i.rawTime(), e), (!e._dur || Pc(0, e.totalDuration(), t) - e._tTime > Ut) && e.render(t, !0)), ra(i, e)._dp && i._initted && i._time >= i._dur && i._ts) {
            if (i._dur < i.duration())
                for (t = i; t._dp;)
                    t.rawTime() >= 0 && t.totalTime(t._tTime),
                    t = t._dp;
            i._zTime = -Ut
        }
    },
    tn = (i, e, t, s) => (e.parent && vr(e), e._start = vi((Pn(t) ? t : t || i !== Wt ? os(i, t, e) : i._time) + e._delay), e._end = vi(e._start + (e.totalDuration() / Math.abs(e.timeScale()) || 0)), S_(i, e, "_first", "_last", i._sort ? "_start" : 0), $p(e) || (i._recent = e), s || b_(i, e), i._ts < 0 && Dd(i, i._tTime), i),
    T_ = (i, e) => (As.ScrollTrigger || eg("scrollTrigger", e)) && As.ScrollTrigger.create(e, i),
    I_ = (i, e, t, s, n) => {
        if (Rd(i, e, n), !i._initted)
            return 1;
        if (!t && i._pt && !Li && (i._dur && i.vars.lazy !== !1 || !i._dur && i.vars.lazy) && y_ !== hs.frame)
            return pr.push(i), i._lazy = [n, s], 1
    },
    B_ = ({parent: i}) => i && i._ts && i._initted && !i._lock && (i.rawTime() < 0 || B_(i)),
    $p = ({data: i}) => i === "isFromStart" || i === "isStart",
    xP = (i, e, t, s) => {
        let n = i.ratio,
            r = e < 0 || !e && (!i._start && B_(i) && !(!i._initted && $p(i)) || (i._ts < 0 || i._dp._ts < 0) && !$p(i)) ? 0 : 1,
            a = i._rDelay,
            o = 0,
            l,
            c,
            h;
        if (a && i._repeat && (o = Pc(0, i._tDur, e), c = zo(o, a), i._yoyo && c & 1 && (r = 1 - r), c !== zo(i._tTime, a) && (n = 1 - r, i.vars.repeatRefresh && i._initted && i.invalidate())), r !== n || Li || s || i._zTime === Ut || !e && i._zTime) {
            if (!i._initted && I_(i, e, s, t, o))
                return;
            for (h = i._zTime, i._zTime = e || (t ? Ut : 0), t || (t = e && !h), i.ratio = r, i._from && (r = 1 - r), i._time = 0, i._tTime = o, l = i._pt; l;)
                l.r(r, l.d),
                l = l._next;
            e < 0 && Zp(i, e, t, !0),
            i._onUpdate && !t && us(i, "onUpdate"),
            o && i._repeat && !t && i.parent && us(i, "onRepeat"),
            (e >= i._tDur || e < 0) && i.ratio === r && (r && vr(i, 1), !t && !Li && (us(i, r ? "onComplete" : "onReverseComplete", !0), i._prom && i._prom()))
        } else
            i._zTime || (i._zTime = e)
    },
    yP = (i, e, t) => {
        let s;
        if (t > e)
            for (s = i._first; s && s._start <= t;) {
                if (s.data === "isPause" && s._start > e)
                    return s;
                s = s._next
            }
        else
            for (s = i._last; s && s._start >= t;) {
                if (s.data === "isPause" && s._start < e)
                    return s;
                s = s._prev
            }
    },
    Qo = (i, e, t, s) => {
        let n = i._repeat,
            r = vi(e) || 0,
            a = i._tTime / i._tDur;
        return a && !s && (i._time *= r / i._dur), i._dur = r, i._tDur = n ? n < 0 ? 1e10 : vi(r * (n + 1) + i._rDelay * n) : r, a > 0 && !s && Dd(i, i._tTime = i._tDur * a), i.parent && Pd(i), t || ra(i.parent, i), i
    },
    O0 = i => i instanceof Qi ? ra(i) : Qo(i, i._dur),
    _P = {
        _start: 0,
        endTime: xc,
        totalDuration: xc
    },
    os = (i, e, t) => {
        let s = i.labels,
            n = i._recent || _P,
            r = i.duration() >= ws ? n.endTime(!1) : i._dur,
            a,
            o,
            l;
        return yi(e) && (isNaN(e) || e in s) ? (o = e.charAt(0), l = e.substr(-1) === "%", a = e.indexOf("="), o === "<" || o === ">" ? (a >= 0 && (e = e.replace(/=/, "")), (o === "<" ? n._start : n.endTime(n._repeat >= 0)) + (parseFloat(e.substr(1)) || 0) * (l ? (a < 0 ? n : t).totalDuration() / 100 : 1)) : a < 0 ? (e in s || (s[e] = r), s[e]) : (o = parseFloat(e.charAt(a - 1) + e.substr(a + 1)), l && t && (o = o / 100 * (Fi(t) ? t[0] : t).totalDuration()), a > 1 ? os(i, e.substr(0, a - 1), t) + o : r + o)) : e == null ? r : +e
    },
    Kl = (i, e, t) => {
        let s = Pn(e[1]),
            n = (s ? 2 : 1) + (i < 2 ? 0 : 1),
            r = e[n],
            a,
            o;
        if (s && (r.duration = e[1]), r.parent = t, i) {
            for (a = r, o = t; o && !("immediateRender" in a);)
                a = o.vars.defaults || {},
                o = Ji(o.vars.inherit) && o.parent;
            r.immediateRender = Ji(a.immediateRender),
            i < 2 ? r.runBackwards = 1 : r.startAt = e[n - 1]
        }
        return new Qt(e[0], r, e[n + 1])
    },
    wr = (i, e) => i || i === 0 ? e(i) : e,
    Pc = (i, e, t) => t < i ? i : t > e ? e : t,
    Ri = (i, e) => !yi(i) || !(e = dP.exec(i)) ? "" : e[1],
    wP = (i, e, t) => wr(t, s => Pc(i, e, s)),
    em = [].slice,
    P_ = (i, e) => i && cn(i) && "length" in i && (!e && !i.length || i.length - 1 in i && cn(i[0])) && !i.nodeType && i !== Js,
    EP = (i, e, t=[]) => i.forEach(s => yi(s) && !e || P_(s, 1) ? t.push(...Es(s)) : t.push(s)) || t,
    Es = (i, e, t) => Gt && !e && Gt.selector ? Gt.selector(i) : yi(i) && !t && (Kp || !Go()) ? em.call((e || $A).querySelectorAll(i), 0) : Fi(i) ? EP(i, t) : P_(i) ? em.call(i, 0) : i ? [i] : [],
    tm = i => (i = Es(i)[0] || vc("Invalid scope") || {}, e => {
        let t = i.current || i.nativeElement || i;
        return Es(e, t.querySelectorAll ? t : t === i ? vc("Invalid scope") || $A.createElement("div") : i)
    }),
    D_ = i => i.sort(() => .5 - Math.random()),
    R_ = i => {
        if (si(i))
            return i;
        let e = cn(i) ? i : {
                each: i
            },
            t = aa(e.ease),
            s = e.from || 0,
            n = parseFloat(e.base) || 0,
            r = {},
            a = s > 0 && s < 1,
            o = isNaN(s) || a,
            l = e.axis,
            c = s,
            h = s;
        return yi(s) ? c = h = {
            center: .5,
            edges: .5,
            end: 1
        }[s] || 0 : !a && o && (c = s[0], h = s[1]), (d, u, f) => {
            let p = (f || e).length,
                A = r[p],
                m,
                g,
                x,
                v,
                y,
                S,
                w,
                C,
                M;
            if (!A) {
                if (M = e.grid === "auto" ? 0 : (e.grid || [1, ws])[1], !M) {
                    for (w = -ws; w < (w = f[M++].getBoundingClientRect().left) && M < p;)
                        ;
                    M < p && M--
                }
                for (A = r[p] = [], m = o ? Math.min(M, p) * c - .5 : s % M, g = M === ws ? 0 : o ? p * h / M - .5 : s / M | 0, w = 0, C = ws, S = 0; S < p; S++)
                    x = S % M - m,
                    v = g - (S / M | 0),
                    A[S] = y = l ? Math.abs(l === "y" ? v : x) : d_(x * x + v * v),
                    y > w && (w = y),
                    y < C && (C = y);
                s === "random" && D_(A),
                A.max = w - C,
                A.min = C,
                A.v = p = (parseFloat(e.amount) || parseFloat(e.each) * (M > p ? p - 1 : l ? l === "y" ? p / M : M : Math.max(M, p / M)) || 0) * (s === "edges" ? -1 : 1),
                A.b = p < 0 ? n - p : n,
                A.u = Ri(e.amount || e.each) || 0,
                t = t && p < 0 ? Y_(t) : t
            }
            return p = (A[d] - A.min) / A.max || 0, vi(A.b + (t ? t(p) : p) * A.v) + A.u
        }
    },
    im = i => {
        let e = Math.pow(10, ((i + "").split(".")[1] || "").length);
        return t => {
            let s = vi(Math.round(parseFloat(t) / i) * i * e);
            return (s - s % 1) / e + (Pn(t) ? 0 : Ri(t))
        }
    },
    U_ = (i, e) => {
        let t = Fi(i),
            s,
            n;
        return !t && cn(i) && (s = t = i.radius || ws, i.values ? (i = Es(i.values), (n = !Pn(i[0])) && (s *= s)) : i = im(i.increment)), wr(e, t ? si(i) ? r => (n = i(r), Math.abs(n - r) <= s ? n : r) : r => {
            let a = parseFloat(n ? r.x : r),
                o = parseFloat(n ? r.y : 0),
                l = ws,
                c = 0,
                h = i.length,
                d,
                u;
            for (; h--;)
                n ? (d = i[h].x - a, u = i[h].y - o, d = d * d + u * u) : d = Math.abs(i[h] - a),
                d < l && (l = d, c = h);
            return c = !s || l <= s ? i[c] : r, n || c === r || Pn(r) ? c : c + Ri(r)
        } : im(i))
    },
    L_ = (i, e, t, s) => wr(Fi(i) ? !e : t === !0 ? !!(t = 0) : !s, () => Fi(i) ? i[~~(Math.random() * i.length)] : (t = t || 1e-5) && (s = t < 1 ? 10 ** ((t + "").length - 2) : 1) && Math.floor(Math.round((i - t / 2 + Math.random() * (e - i + t * .99)) / t) * t * s) / s),
    CP = (...i) => e => i.reduce((t, s) => s(t), e),
    SP = (i, e) => t => i(parseFloat(t)) + (e || Ri(t)),
    MP = (i, e, t) => k_(i, e, 0, 1, t),
    F_ = (i, e, t) => wr(t, s => i[~~e(s)]),
    N_ = function(i, e, t) {
        let s = e - i;
        return Fi(i) ? F_(i, N_(0, i.length), e) : wr(t, n => (s + (n - i) % s) % s + i)
    },
    O_ = (i, e, t) => {
        let s = e - i,
            n = s * 2;
        return Fi(i) ? F_(i, O_(0, i.length - 1), e) : wr(t, r => (r = (n + (r - i) % n) % n || 0, i + (r > s ? n - r : r)))
    },
    yc = i => {
        let e = 0,
            t = "",
            s,
            n,
            r,
            a;
        for (; ~(s = i.indexOf("random(", e));)
            r = i.indexOf(")", s),
            a = i.charAt(s + 7) === "[",
            n = i.substr(s + 7, r - s - 7).match(a ? A_ : Xp),
            t += i.substr(e, s - e) + L_(a ? n : +n[0], a ? 0 : +n[1], +n[2] || 1e-5),
            e = r + 1;
        return t + i.substr(e, i.length - e)
    },
    k_ = (i, e, t, s, n) => {
        let r = e - i,
            a = s - t;
        return wr(n, o => t + ((o - i) / r * a || 0))
    },
    z_ = (i, e, t, s) => {
        let n = isNaN(i + e) ? 0 : r => (1 - r) * i + r * e;
        if (!n) {
            let r = yi(i),
                a = {},
                o,
                l,
                c,
                h,
                d;
            if (t === !0 && (s = 1) && (t = null), r)
                i = {
                    p: i
                },
                e = {
                    p: e
                };
            else if (Fi(i) && !Fi(e)) {
                for (c = [], h = i.length, d = h - 2, l = 1; l < h; l++)
                    c.push(z_(i[l - 1], i[l]));
                h--,
                n = u => {
                    u *= h;
                    let f = Math.min(d, ~~u);
                    return c[f](u - f)
                },
                t = e
            } else
                s || (i = pa(Fi(i) ? [] : {}, i));
            if (!c) {
                for (o in e)
                    ng.call(a, i, o, "get", e[o]);
                n = u => og(u, a) || (r ? i.p : i)
            }
        }
        return wr(t, n)
    },
    k0 = (i, e, t) => {
        let s = i.labels,
            n = ws,
            r,
            a,
            o;
        for (r in s)
            a = s[r] - e,
            a < 0 == !!t && a && n > (a = Math.abs(a)) && (o = r, n = a);
        return o
    },
    us = (i, e, t) => {
        let s = i.vars,
            n = s[e],
            r = Gt,
            a = i._ctx,
            o,
            l,
            c;
        if (n)
            return o = s[e + "Params"], l = s.callbackScope || i, t && pr.length && Zu(), a && (Gt = a), c = o ? n.apply(l, o) : n.call(l), Gt = r, c
    },
    Il = i => (vr(i), i.scrollTrigger && i.scrollTrigger.kill(!!Li), i.progress() < 1 && us(i, "onInterrupt"), i),
    mo,
    Q_ = [],
    G_ = i => {
        if (i)
            if (i = !i.name && i.default || i, ZA() || i.headless) {
                let e = i.name,
                    t = si(i),
                    s = e && !t && i.init ? function() {
                        this._props = []
                    } : i,
                    n = {
                        init: xc,
                        render: og,
                        add: ng,
                        kill: GP,
                        modifier: QP,
                        rawVars: 0
                    },
                    r = {
                        targetTest: 0,
                        get: 0,
                        getSetter: ag,
                        aliases: {},
                        register: 0
                    };
                if (Go(), i !== s) {
                    if (cs[e])
                        return;
                    Bs(s, Bs($u(i, n), r)),
                    pa(s.prototype, pa(n, $u(i, r))),
                    cs[s.prop = e] = s,
                    i.targetTest && (su.push(s), tg[e] = 1),
                    e = (e === "css" ? "CSS" : e.charAt(0).toUpperCase() + e.substr(1)) + "Plugin"
                }
                x_(e, s),
                i.register && i.register(ts, s, Zi)
            } else
                Q_.push(i)
    },
    Dt = 255,
    Bl = {
        aqua: [0, Dt, Dt],
        lime: [0, Dt, 0],
        silver: [192, 192, 192],
        black: [0, 0, 0],
        maroon: [128, 0, 0],
        teal: [0, 128, 128],
        blue: [0, 0, Dt],
        navy: [0, 0, 128],
        white: [Dt, Dt, Dt],
        olive: [128, 128, 0],
        yellow: [Dt, Dt, 0],
        orange: [Dt, 165, 0],
        gray: [128, 128, 128],
        purple: [128, 0, 128],
        green: [0, 128, 0],
        red: [Dt, 0, 0],
        pink: [Dt, 192, 203],
        cyan: [0, Dt, Dt],
        transparent: [Dt, Dt, Dt, 0]
    },
    Uf = (i, e, t) => (i += i < 0 ? 1 : i > 1 ? -1 : 0, (i * 6 < 1 ? e + (t - e) * i * 6 : i < .5 ? t : i * 3 < 2 ? e + (t - e) * (2 / 3 - i) * 6 : e) * Dt + .5 | 0),
    H_ = (i, e, t) => {
        let s = i ? Pn(i) ? [i >> 16, i >> 8 & Dt, i & Dt] : 0 : Bl.black,
            n,
            r,
            a,
            o,
            l,
            c,
            h,
            d,
            u,
            f;
        if (!s) {
            if (i.substr(-1) === "," && (i = i.substr(0, i.length - 1)), Bl[i])
                s = Bl[i];
            else if (i.charAt(0) === "#") {
                if (i.length < 6 && (n = i.charAt(1), r = i.charAt(2), a = i.charAt(3), i = "#" + n + n + r + r + a + a + (i.length === 5 ? i.charAt(4) + i.charAt(4) : "")), i.length === 9)
                    return s = parseInt(i.substr(1, 6), 16), [s >> 16, s >> 8 & Dt, s & Dt, parseInt(i.substr(7), 16) / 255];
                i = parseInt(i.substr(1), 16),
                s = [i >> 16, i >> 8 & Dt, i & Dt]
            } else if (i.substr(0, 3) === "hsl") {
                if (s = f = i.match(Xp), !e)
                    o = +s[0] % 360 / 360,
                    l = +s[1] / 100,
                    c = +s[2] / 100,
                    r = c <= .5 ? c * (l + 1) : c + l - c * l,
                    n = c * 2 - r,
                    s.length > 3 && (s[3] *= 1),
                    s[0] = Uf(o + 1 / 3, n, r),
                    s[1] = Uf(o, n, r),
                    s[2] = Uf(o - 1 / 3, n, r);
                else if (~i.indexOf("="))
                    return s = i.match(p_), t && s.length < 4 && (s[3] = 1), s
            } else
                s = i.match(Xp) || Bl.transparent;
            s = s.map(Number)
        }
        return e && !f && (n = s[0] / Dt, r = s[1] / Dt, a = s[2] / Dt, h = Math.max(n, r, a), d = Math.min(n, r, a), c = (h + d) / 2, h === d ? o = l = 0 : (u = h - d, l = c > .5 ? u / (2 - h - d) : u / (h + d), o = h === n ? (r - a) / u + (r < a ? 6 : 0) : h === r ? (a - n) / u + 2 : (n - r) / u + 4, o *= 60), s[0] = ~~(o + .5), s[1] = ~~(l * 100 + .5), s[2] = ~~(c * 100 + .5)), t && s.length < 4 && (s[3] = 1), s
    },
    V_ = i => {
        let e = [],
            t = [],
            s = -1;
        return i.split(mr).forEach(n => {
            let r = n.match(po) || [];
            e.push(...r),
            t.push(s += r.length + 1)
        }), e.c = t, e
    },
    z0 = (i, e, t) => {
        let s = "",
            n = (i + s).match(mr),
            r = e ? "hsla(" : "rgba(",
            a = 0,
            o,
            l,
            c,
            h;
        if (!n)
            return i;
        if (n = n.map(d => (d = H_(d, e, 1)) && r + (e ? d[0] + "," + d[1] + "%," + d[2] + "%," + d[3] : d.join(",")) + ")"), t && (c = V_(i), o = t.c, o.join(s) !== c.c.join(s)))
            for (l = i.replace(mr, "1").split(po), h = l.length - 1; a < h; a++)
                s += l[a] + (~o.indexOf(a) ? n.shift() || r + "0,0,0,0)" : (c.length ? c : n.length ? n : t).shift());
        if (!l)
            for (l = i.split(mr), h = l.length - 1; a < h; a++)
                s += l[a] + n[a];
        return s + l[h]
    },
    mr = function() {
        let i = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",
            e;
        for (e in Bl)
            i += "|" + e + "\\b";
        return new RegExp(i + ")", "gi")
    }(),
    bP = /hsl[a]?\(/,
    W_ = i => {
        let e = i.join(" "),
            t;
        if (mr.lastIndex = 0, mr.test(e))
            return t = bP.test(e), i[1] = z0(i[1], t), i[0] = z0(i[0], t, V_(i[1])), !0
    },
    _c,
    hs = function() {
        let i = Date.now,
            e = 500,
            t = 33,
            s = i(),
            n = s,
            r = 1e3 / 240,
            a = r,
            o = [],
            l,
            c,
            h,
            d,
            u,
            f,
            p = A => {
                let m = i() - n,
                    g = A === !0,
                    x,
                    v,
                    y,
                    S;
                if ((m > e || m < 0) && (s += m - t), n += m, y = n - s, x = y - a, (x > 0 || g) && (S = ++d.frame, u = y - d.time * 1e3, d.time = y = y / 1e3, a += x + (x >= r ? 4 : r - x), v = 1), g || (l = c(p)), v)
                    for (f = 0; f < o.length; f++)
                        o[f](y, u, S, A)
            };
        return d = {
            time: 0,
            frame: 0,
            tick() {
                p(!0)
            },
            deltaRatio(A) {
                return u / (1e3 / (A || 60))
            },
            wake() {
                g_ && (!Kp && ZA() && (Js = Kp = window, $A = Js.document || {}, As.gsap = ts, (Js.gsapVersions || (Js.gsapVersions = [])).push(ts.version), v_(ju || Js.GreenSockGlobals || !Js.gsap && Js || {}), Q_.forEach(G_)), h = typeof requestAnimationFrame < "u" && requestAnimationFrame, l && d.sleep(), c = h || (A => setTimeout(A, a - d.time * 1e3 + 1 | 0)), _c = 1, p(2))
            },
            sleep() {
                (h ? cancelAnimationFrame : clearTimeout)(l),
                _c = 0,
                c = xc
            },
            lagSmoothing(A, m) {
                e = A || 1 / 0,
                t = Math.min(m || 33, e)
            },
            fps(A) {
                r = 1e3 / (A || 240),
                a = d.time * 1e3 + r
            },
            add(A, m, g) {
                let x = m ? (v, y, S, w) => {
                    A(v, y, S, w),
                    d.remove(x)
                } : A;
                return d.remove(A), o[g ? "unshift" : "push"](x), Go(), x
            },
            remove(A, m) {
                ~(m = o.indexOf(A)) && o.splice(m, 1) && f >= m && f--
            },
            _listeners: o
        }, d
    }(),
    Go = () => !_c && hs.wake(),
    Ci = {},
    TP = /^[\d.\-M][\d.\-,\s]/,
    IP = /["']/g,
    BP = i => {
        let e = {},
            t = i.substr(1, i.length - 3).split(":"),
            s = t[0],
            n = 1,
            r = t.length,
            a,
            o,
            l;
        for (; n < r; n++)
            o = t[n],
            a = n !== r - 1 ? o.lastIndexOf(",") : o.length,
            l = o.substr(0, a),
            e[s] = isNaN(l) ? l.replace(IP, "").trim() : +l,
            s = o.substr(a + 1).trim();
        return e
    },
    PP = i => {
        let e = i.indexOf("(") + 1,
            t = i.indexOf(")"),
            s = i.indexOf("(", e);
        return i.substring(e, ~s && s < t ? i.indexOf(")", t + 1) : t)
    },
    DP = i => {
        let e = (i + "").split("("),
            t = Ci[e[0]];
        return t && e.length > 1 && t.config ? t.config.apply(null, ~i.indexOf("{") ? [BP(e[1])] : PP(i).split(",").map(E_)) : Ci._CE && TP.test(i) ? Ci._CE("", i) : t
    },
    Y_ = i => e => 1 - i(1 - e),
    td = (i, e) => {
        let t = i._first,
            s;
        for (; t;)
            t instanceof Qi ? td(t, e) : t.vars.yoyoEase && (!t._yoyo || !t._repeat) && t._yoyo !== e && (t.timeline ? td(t.timeline, e) : (s = t._ease, t._ease = t._yEase, t._yEase = s, t._yoyo = e)),
            t = t._next
    },
    aa = (i, e) => i && (si(i) ? i : Ci[i] || DP(i)) || e,
    xa = (i, e, t=n => 1 - e(1 - n), s=n => n < .5 ? e(n * 2) / 2 : 1 - e((1 - n) * 2) / 2) => {
        let n = {
                easeIn: e,
                easeOut: t,
                easeInOut: s
            },
            r;
        return ji(i, a => {
            Ci[a] = As[a] = n,
            Ci[r = a.toLowerCase()] = t;
            for (let o in n)
                Ci[r + (o === "easeIn" ? ".in" : o === "easeOut" ? ".out" : ".inOut")] = Ci[a + "." + o] = n[o]
        }), n
    },
    q_ = i => e => e < .5 ? (1 - i(1 - e * 2)) / 2 : .5 + i((e - .5) * 2) / 2,
    nu = (i, e, t) => {
        let s = e >= 1 ? e : 1,
            n = (t || (i ? .3 : .45)) / (e < 1 ? e : 1),
            r = n / qp * (Math.asin(1 / s) || 0),
            a = l => l === 1 ? 1 : s * 2 ** (-10 * l) * uP((l - r) * n) + 1,
            o = i === "out" ? a : i === "in" ? l => 1 - a(1 - l) : q_(a);
        return n = qp / n, o.config = (l, c) => nu(i, l, c), o
    },
    ru = (i, e=1.70158) => {
        let t = n => n ? --n * n * ((e + 1) * n + e) + 1 : 0,
            s = i === "out" ? t : i === "in" ? n => 1 - t(1 - n) : q_(t);
        return s.config = n => ru(i, n), s
    };
ji("Linear,Quad,Cubic,Quart,Quint,Strong", (i, e) => {
    let t = e < 5 ? e + 1 : e;
    xa(i + ",Power" + (t - 1), e ? s => s ** t : s => s, s => 1 - (1 - s) ** t, s => s < .5 ? (s * 2) ** t / 2 : 1 - ((1 - s) * 2) ** t / 2)
});
Ci.Linear.easeNone = Ci.none = Ci.Linear.easeIn;
xa("Elastic", nu("in"), nu("out"), nu());
((i, e) => {
    let t = 1 / e,
        s = 2 * t,
        n = 2.5 * t,
        r = a => a < t ? i * a * a : a < s ? i * (a - 1.5 / e) ** 2 + .75 : a < n ? i * (a -= 2.25 / e) * a + .9375 : i * (a - 2.625 / e) ** 2 + .984375;
    xa("Bounce", a => 1 - r(1 - a), r)
})(7.5625, 2.75);
xa("Expo", i => i ? 2 ** (10 * (i - 1)) : 0);
xa("Circ", i => -(d_(1 - i * i) - 1));
xa("Sine", i => i === 1 ? 1 : -hP(i * lP) + 1);
xa("Back", ru("in"), ru("out"), ru());
Ci.SteppedEase = Ci.steps = As.SteppedEase = {
    config(i=1, e) {
        let t = 1 / i,
            s = i + (e ? 0 : 1),
            n = e ? 1 : 0,
            r = 1 - Ut;
        return a => ((s * Pc(0, r, a) | 0) + n) * t
    }
};
ko.ease = Ci["quad.out"];
ji("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", i => ig += i + "," + i + "Params,");
class X_ {
    constructor(e, t)
    {
        this.id = cP++,
        e._gsap = this,
        this.target = e,
        this.harness = t,
        this.get = t ? t.get : __,
        this.set = t ? t.getSetter : ag
    }
}
class wc {
    constructor(e)
    {
        this.vars = e,
        this._delay = +e.delay || 0,
        (this._repeat = e.repeat === 1 / 0 ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase),
        this._ts = 1,
        Qo(this, +e.duration, 1, 1),
        this.data = e.data,
        Gt && (this._ctx = Gt, Gt.data.push(this)),
        _c || hs.wake()
    }
    delay(e)
    {
        return e || e === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + e - this._delay), this._delay = e, this) : this._delay
    }
    duration(e)
    {
        return arguments.length ? this.totalDuration(this._repeat > 0 ? e + (e + this._rDelay) * this._repeat : e) : this.totalDuration() && this._dur
    }
    totalDuration(e)
    {
        return arguments.length ? (this._dirty = 0, Qo(this, this._repeat < 0 ? e : (e - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur
    }
    totalTime(e, t)
    {
        if (Go(), !arguments.length)
            return this._tTime;
        let s = this._dp;
        if (s && s.smoothChildTiming && this._ts) {
            for (Dd(this, e), !s._dp || s.parent || b_(s, this); s && s.parent;)
                s.parent._time !== s._start + (s._ts >= 0 ? s._tTime / s._ts : (s.totalDuration() - s._tTime) / -s._ts) && s.totalTime(s._tTime, !0),
                s = s.parent;
            !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && e < this._tDur || this._ts < 0 && e > 0 || !this._tDur && !e) && tn(this._dp, this, this._start - this._delay)
        }
        return (this._tTime !== e || !this._dur && !t || this._initted && Math.abs(this._zTime) === Ut || !e && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = e), w_(this, e, t)), this
    }
    time(e, t)
    {
        return arguments.length ? this.totalTime(Math.min(this.totalDuration(), e + N0(this)) % (this._dur + this._rDelay) || (e ? this._dur : 0), t) : this._time
    }
    totalProgress(e, t)
    {
        return arguments.length ? this.totalTime(this.totalDuration() * e, t) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0
    }
    progress(e, t)
    {
        return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - e : e) + N0(this), t) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0
    }
    iteration(e, t)
    {
        let s = this.duration() + this._rDelay;
        return arguments.length ? this.totalTime(this._time + (e - 1) * s, t) : this._repeat ? zo(this._tTime, s) + 1 : 1
    }
    timeScale(e, t)
    {
        if (!arguments.length)
            return this._rts === -Ut ? 0 : this._rts;
        if (this._rts === e)
            return this;
        let s = this.parent && this._ts ? ed(this.parent._time, this) : this._tTime;
        return this._rts = +e || 0, this._ts = this._ps || e === -Ut ? 0 : this._rts, this.totalTime(Pc(-Math.abs(this._delay), this._tDur, s), t !== !1), Pd(this), vP(this)
    }
    paused(e)
    {
        return arguments.length ? (this._ps !== e && (this._ps = e, e ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Go(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== Ut && (this._tTime -= Ut)))), this) : this._ps
    }
    startTime(e)
    {
        if (arguments.length) {
            this._start = e;
            let t = this.parent || this._dp;
            return t && (t._sort || !this.parent) && tn(t, this, e - this._delay), this
        }
        return this._start
    }
    endTime(e)
    {
        return this._start + (Ji(e) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1)
    }
    rawTime(e)
    {
        let t = this.parent || this._dp;
        return t ? e && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? ed(t.rawTime(e), this) : this._tTime : this._tTime
    }
    revert(e=pP)
    {
        let t = Li;
        return Li = e, (this._initted || this._startAt) && (this.timeline && this.timeline.revert(e), this.totalTime(-.01, e.suppressEvents)), this.data !== "nested" && e.kill !== !1 && this.kill(), Li = t, this
    }
    globalTime(e)
    {
        let t = this,
            s = arguments.length ? e : t.rawTime();
        for (; t;)
            s = t._start + s / (Math.abs(t._ts) || 1),
            t = t._dp;
        return !this.parent && this._sat ? this._sat.globalTime(e) : s
    }
    repeat(e)
    {
        return arguments.length ? (this._repeat = e === 1 / 0 ? -2 : e, O0(this)) : this._repeat === -2 ? 1 / 0 : this._repeat
    }
    repeatDelay(e)
    {
        if (arguments.length) {
            let t = this._time;
            return this._rDelay = e, O0(this), t ? this.time(t) : this
        }
        return this._rDelay
    }
    yoyo(e)
    {
        return arguments.length ? (this._yoyo = e, this) : this._yoyo
    }
    seek(e, t)
    {
        return this.totalTime(os(this, e), Ji(t))
    }
    restart(e, t)
    {
        return this.play().totalTime(e ? -this._delay : 0, Ji(t))
    }
    play(e, t)
    {
        return e != null && this.seek(e, t), this.reversed(!1).paused(!1)
    }
    reverse(e, t)
    {
        return e != null && this.seek(e || this.totalDuration(), t), this.reversed(!0).paused(!1)
    }
    pause(e, t)
    {
        return e != null && this.seek(e, t), this.paused(!0)
    }
    resume()
    {
        return this.paused(!1)
    }
    reversed(e)
    {
        return arguments.length ? (!!e !== this.reversed() && this.timeScale(-this._rts || (e ? -Ut : 0)), this) : this._rts < 0
    }
    invalidate()
    {
        return this._initted = this._act = 0, this._zTime = -Ut, this
    }
    isActive()
    {
        let e = this.parent || this._dp,
            t = this._start,
            s;
        return !!(!e || this._ts && this._initted && e.isActive() && (s = e.rawTime(!0)) >= t && s < this.endTime(!0) - Ut)
    }
    eventCallback(e, t, s)
    {
        let n = this.vars;
        return arguments.length > 1 ? (t ? (n[e] = t, s && (n[e + "Params"] = s), e === "onUpdate" && (this._onUpdate = t)) : delete n[e], this) : n[e]
    }
    then(e)
    {
        let t = this;
        return new Promise(s => {
            let n = si(e) ? e : C_,
                r = () => {
                    let a = t.then;
                    t.then = null,
                    si(n) && (n = n(t)) && (n.then || n === t) && (t.then = a),
                    s(n),
                    t.then = a
                };
            t._initted && t.totalProgress() === 1 && t._ts >= 0 || !t._tTime && t._ts < 0 ? r() : t._prom = r
        })
    }
    kill()
    {
        Il(this)
    }
}
Bs(wc.prototype, {
    _time: 0,
    _start: 0,
    _end: 0,
    _tTime: 0,
    _tDur: 0,
    _dirty: 0,
    _repeat: 0,
    _yoyo: !1,
    parent: null,
    _initted: !1,
    _rDelay: 0,
    _ts: 1,
    _dp: 0,
    ratio: 0,
    _zTime: -Ut,
    _prom: 0,
    _ps: !1,
    _rts: 1
});
class Qi extends wc {
    constructor(e={}, t)
    {
        super(e),
        this.labels = {},
        this.smoothChildTiming = !!e.smoothChildTiming,
        this.autoRemoveChildren = !!e.autoRemoveChildren,
        this._sort = Ji(e.sortChildren),
        Wt && tn(e.parent || Wt, this, t),
        e.reversed && this.reverse(),
        e.paused && this.paused(!0),
        e.scrollTrigger && T_(this, e.scrollTrigger)
    }
    to(e, t, s)
    {
        return Kl(0, arguments, this), this
    }
    from(e, t, s)
    {
        return Kl(1, arguments, this), this
    }
    fromTo(e, t, s, n)
    {
        return Kl(2, arguments, this), this
    }
    set(e, t, s)
    {
        return t.duration = 0, t.parent = this, Xl(t).repeatDelay || (t.repeat = 0), t.immediateRender = !!t.immediateRender, new Qt(e, t, os(this, s), 1), this
    }
    call(e, t, s)
    {
        return tn(this, Qt.delayedCall(0, e, t), s)
    }
    staggerTo(e, t, s, n, r, a, o)
    {
        return s.duration = t, s.stagger = s.stagger || n, s.onComplete = a, s.onCompleteParams = o, s.parent = this, new Qt(e, s, os(this, r)), this
    }
    staggerFrom(e, t, s, n, r, a, o)
    {
        return s.runBackwards = 1, Xl(s).immediateRender = Ji(s.immediateRender), this.staggerTo(e, t, s, n, r, a, o)
    }
    staggerFromTo(e, t, s, n, r, a, o, l)
    {
        return n.startAt = s, Xl(n).immediateRender = Ji(n.immediateRender), this.staggerTo(e, t, n, r, a, o, l)
    }
    render(e, t, s)
    {
        let n = this._time,
            r = this._dirty ? this.totalDuration() : this._tDur,
            a = this._dur,
            o = e <= 0 ? 0 : vi(e),
            l = this._zTime < 0 != e < 0 && (this._initted || !a),
            c,
            h,
            d,
            u,
            f,
            p,
            A,
            m,
            g,
            x,
            v,
            y;
        if (this !== Wt && o > r && e >= 0 && (o = r), o !== this._tTime || s || l) {
            if (n !== this._time && a && (o += this._time - n, e += this._time - n), c = o, g = this._start, m = this._ts, p = !m, l && (a || (n = this._zTime), (e || !t) && (this._zTime = e)), this._repeat) {
                if (v = this._yoyo, f = a + this._rDelay, this._repeat < -1 && e < 0)
                    return this.totalTime(f * 100 + e, t, s);
                if (c = vi(o % f), o === r ? (u = this._repeat, c = a) : (u = ~~(o / f), u && u === o / f && (c = a, u--), c > a && (c = a)), x = zo(this._tTime, f), !n && this._tTime && x !== u && this._tTime - x * f - this._dur <= 0 && (x = u), v && u & 1 && (c = a - c, y = 1), u !== x && !this._lock) {
                    let S = v && x & 1,
                        w = S === (v && u & 1);
                    if (u < x && (S = !S), n = S ? 0 : o % a ? a : o, this._lock = 1, this.render(n || (y ? 0 : vi(u * f)), t, !a)._lock = 0, this._tTime = o, !t && this.parent && us(this, "onRepeat"), this.vars.repeatRefresh && !y && (this.invalidate()._lock = 1), n && n !== this._time || p !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
                        return this;
                    if (a = this._dur, r = this._tDur, w && (this._lock = 2, n = S ? a : -1e-4, this.render(n, !0), this.vars.repeatRefresh && !y && this.invalidate()), this._lock = 0, !this._ts && !p)
                        return this;
                    td(this, y)
                }
            }
            if (this._hasPause && !this._forcing && this._lock < 2 && (A = yP(this, vi(n), vi(c)), A && (o -= c - (c = A._start))), this._tTime = o, this._time = c, this._act = !m, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = e, n = 0), !n && c && !t && !u && (us(this, "onStart"), this._tTime !== o))
                return this;
            if (c >= n && e >= 0)
                for (h = this._first; h;) {
                    if (d = h._next, (h._act || c >= h._start) && h._ts && A !== h) {
                        if (h.parent !== this)
                            return this.render(e, t, s);
                        if (h.render(h._ts > 0 ? (c - h._start) * h._ts : (h._dirty ? h.totalDuration() : h._tDur) + (c - h._start) * h._ts, t, s), c !== this._time || !this._ts && !p) {
                            A = 0,
                            d && (o += this._zTime = -Ut);
                            break
                        }
                    }
                    h = d
                }
            else {
                h = this._last;
                let S = e < 0 ? e : c;
                for (; h;) {
                    if (d = h._prev, (h._act || S <= h._end) && h._ts && A !== h) {
                        if (h.parent !== this)
                            return this.render(e, t, s);
                        if (h.render(h._ts > 0 ? (S - h._start) * h._ts : (h._dirty ? h.totalDuration() : h._tDur) + (S - h._start) * h._ts, t, s || Li && (h._initted || h._startAt)), c !== this._time || !this._ts && !p) {
                            A = 0,
                            d && (o += this._zTime = S ? -Ut : Ut);
                            break
                        }
                    }
                    h = d
                }
            }
            if (A && !t && (this.pause(), A.render(c >= n ? 0 : -Ut)._zTime = c >= n ? 1 : -1, this._ts))
                return this._start = g, Pd(this), this.render(e, t, s);
            this._onUpdate && !t && us(this, "onUpdate", !0),
            (o === r && this._tTime >= this.totalDuration() || !o && n) && (g === this._start || Math.abs(m) !== Math.abs(this._ts)) && (this._lock || ((e || !a) && (o === r && this._ts > 0 || !o && this._ts < 0) && vr(this, 1), !t && !(e < 0 && !n) && (o || n || !r) && (us(this, o === r && e >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(o < r && this.timeScale() > 0) && this._prom())))
        }
        return this
    }
    add(e, t)
    {
        if (Pn(t) || (t = os(this, t, e)), !(e instanceof wc)) {
            if (Fi(e))
                return e.forEach(s => this.add(s, t)), this;
            if (yi(e))
                return this.addLabel(e, t);
            if (si(e))
                e = Qt.delayedCall(0, e);
            else
                return this
        }
        return this !== e ? tn(this, e, t) : this
    }
    getChildren(e=!0, t=!0, s=!0, n=-ws)
    {
        let r = [],
            a = this._first;
        for (; a;)
            a._start >= n && (a instanceof Qt ? t && r.push(a) : (s && r.push(a), e && r.push(...a.getChildren(!0, t, s)))),
            a = a._next;
        return r
    }
    getById(e)
    {
        let t = this.getChildren(1, 1, 1),
            s = t.length;
        for (; s--;)
            if (t[s].vars.id === e)
                return t[s]
    }
    remove(e)
    {
        return yi(e) ? this.removeLabel(e) : si(e) ? this.killTweensOf(e) : (Bd(this, e), e === this._recent && (this._recent = this._last), ra(this))
    }
    totalTime(e, t)
    {
        return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = vi(hs.time - (this._ts > 0 ? e / this._ts : (this.totalDuration() - e) / -this._ts))), super.totalTime(e, t), this._forcing = 0, this) : this._tTime
    }
    addLabel(e, t)
    {
        return this.labels[e] = os(this, t), this
    }
    removeLabel(e)
    {
        return delete this.labels[e], this
    }
    addPause(e, t, s)
    {
        let n = Qt.delayedCall(0, t || xc, s);
        return n.data = "isPause", this._hasPause = 1, tn(this, n, os(this, e))
    }
    removePause(e)
    {
        let t = this._first;
        for (e = os(this, e); t;)
            t._start === e && t.data === "isPause" && vr(t),
            t = t._next
    }
    killTweensOf(e, t, s)
    {
        let n = this.getTweensOf(e, s),
            r = n.length;
        for (; r--;)
            lr !== n[r] && n[r].kill(e, t);
        return this
    }
    getTweensOf(e, t)
    {
        let s = [],
            n = Es(e),
            r = this._first,
            a = Pn(t),
            o;
        for (; r;)
            r instanceof Qt ? mP(r._targets, n) && (a ? (!lr || r._initted && r._ts) && r.globalTime(0) <= t && r.globalTime(r.totalDuration()) > t : !t || r.isActive()) && s.push(r) : (o = r.getTweensOf(n, t)).length && s.push(...o),
            r = r._next;
        return s
    }
    tweenTo(e, t)
    {
        t = t || {};
        let s = this,
            n = os(s, e),
            {startAt: r, onStart: a, onStartParams: o, immediateRender: l} = t,
            c,
            h = Qt.to(s, Bs({
                ease: t.ease || "none",
                lazy: !1,
                immediateRender: !1,
                time: n,
                overwrite: "auto",
                duration: t.duration || Math.abs((n - (r && "time" in r ? r.time : s._time)) / s.timeScale()) || Ut,
                onStart: () => {
                    if (s.pause(), !c) {
                        let d = t.duration || Math.abs((n - (r && "time" in r ? r.time : s._time)) / s.timeScale());
                        h._dur !== d && Qo(h, d, 0, 1).render(h._time, !0, !0),
                        c = 1
                    }
                    a && a.apply(h, o || [])
                }
            }, t));
        return l ? h.render(0) : h
    }
    tweenFromTo(e, t, s)
    {
        return this.tweenTo(t, Bs({
            startAt: {
                time: os(this, e)
            }
        }, s))
    }
    recent()
    {
        return this._recent
    }
    nextLabel(e=this._time)
    {
        return k0(this, os(this, e))
    }
    previousLabel(e=this._time)
    {
        return k0(this, os(this, e), 1)
    }
    currentLabel(e)
    {
        return arguments.length ? this.seek(e, !0) : this.previousLabel(this._time + Ut)
    }
    shiftChildren(e, t, s=0)
    {
        let n = this._first,
            r = this.labels,
            a;
        for (; n;)
            n._start >= s && (n._start += e, n._end += e),
            n = n._next;
        if (t)
            for (a in r)
                r[a] >= s && (r[a] += e);
        return ra(this)
    }
    invalidate(e)
    {
        let t = this._first;
        for (this._lock = 0; t;)
            t.invalidate(e),
            t = t._next;
        return super.invalidate(e)
    }
    clear(e=!0)
    {
        let t = this._first,
            s;
        for (; t;)
            s = t._next,
            this.remove(t),
            t = s;
        return this._dp && (this._time = this._tTime = this._pTime = 0), e && (this.labels = {}), ra(this)
    }
    totalDuration(e)
    {
        let t = 0,
            s = this,
            n = s._last,
            r = ws,
            a,
            o,
            l;
        if (arguments.length)
            return s.timeScale((s._repeat < 0 ? s.duration() : s.totalDuration()) / (s.reversed() ? -e : e));
        if (s._dirty) {
            for (l = s.parent; n;)
                a = n._prev,
                n._dirty && n.totalDuration(),
                o = n._start,
                o > r && s._sort && n._ts && !s._lock ? (s._lock = 1, tn(s, n, o - n._delay, 1)._lock = 0) : r = o,
                o < 0 && n._ts && (t -= o, (!l && !s._dp || l && l.smoothChildTiming) && (s._start += o / s._ts, s._time -= o, s._tTime -= o), s.shiftChildren(-o, !1, -1 / 0), r = 0),
                n._end > t && n._ts && (t = n._end),
                n = a;
            Qo(s, s === Wt && s._time > t ? s._time : t, 1, 1),
            s._dirty = 0
        }
        return s._tDur
    }
    static updateRoot(e)
    {
        if (Wt._ts && (w_(Wt, ed(e, Wt)), y_ = hs.frame), hs.frame >= F0) {
            F0 += ps.autoSleep || 120;
            let t = Wt._first;
            if ((!t || !t._ts) && ps.autoSleep && hs._listeners.length < 2) {
                for (; t && !t._ts;)
                    t = t._next;
                t || hs.sleep()
            }
        }
    }
}
Bs(Qi.prototype, {
    _lock: 0,
    _hasPause: 0,
    _forcing: 0
});
let RP = function(i, e, t, s, n, r, a) {
        let o = new Zi(this._pt, i, e, 0, 1, ew, null, n),
            l = 0,
            c = 0,
            h,
            d,
            u,
            f,
            p,
            A,
            m,
            g;
        for (o.b = t, o.e = s, t += "", s += "", (m = ~s.indexOf("random(")) && (s = yc(s)), r && (g = [t, s], r(g, i, e), t = g[0], s = g[1]), d = t.match(Df) || []; h = Df.exec(s);)
            f = h[0],
            p = s.substring(l, h.index),
            u ? u = (u + 1) % 5 : p.substr(-5) === "rgba(" && (u = 1),
            f !== d[c++] && (A = parseFloat(d[c - 1]) || 0, o._pt = {
                _next: o._pt,
                p: p || c === 1 ? p : ",",
                s: A,
                c: f.charAt(1) === "=" ? Co(A, f) - A : parseFloat(f) - A,
                m: u && u < 4 ? Math.round : 0
            }, l = Df.lastIndex);
        return o.c = l < s.length ? s.substring(l, s.length) : "", o.fp = a, (m_.test(s) || m) && (o.e = 0), this._pt = o, o
    },
    ng = function(i, e, t, s, n, r, a, o, l, c) {
        si(s) && (s = s(n || 0, i, r));
        let h = i[e],
            d = t !== "get" ? t : si(h) ? l ? i[e.indexOf("set") || !si(i["get" + e.substr(3)]) ? e : "get" + e.substr(3)](l) : i[e]() : h,
            u = si(h) ? l ? OP : Z_ : rg,
            f;
        if (yi(s) && (~s.indexOf("random(") && (s = yc(s)), s.charAt(1) === "=" && (f = Co(d, s) + (Ri(d) || 0), (f || f === 0) && (s = f))), !c || d !== s || sm)
            return !isNaN(d * s) && s !== "" ? (f = new Zi(this._pt, i, e, +d || 0, s - (d || 0), typeof h == "boolean" ? zP : $_, 0, u), l && (f.fp = l), a && f.modifier(a, this, i), this._pt = f) : (!h && !(e in i) && eg(e, s), RP.call(this, i, e, d, s, u, o || ps.stringFilter, l))
    },
    UP = (i, e, t, s, n) => {
        if (si(i) && (i = Jl(i, n, e, t, s)), !cn(i) || i.style && i.nodeType || Fi(i) || f_(i))
            return yi(i) ? Jl(i, n, e, t, s) : i;
        let r = {},
            a;
        for (a in i)
            r[a] = Jl(i[a], n, e, t, s);
        return r
    },
    K_ = (i, e, t, s, n, r) => {
        let a,
            o,
            l,
            c;
        if (cs[i] && (a = new cs[i]).init(n, a.rawVars ? e[i] : UP(e[i], s, n, r, t), t, s, r) !== !1 && (t._pt = o = new Zi(t._pt, n, i, 0, 1, a.render, a, 0, a.priority), t !== mo))
            for (l = t._ptLookup[t._targets.indexOf(n)], c = a._props.length; c--;)
                l[a._props[c]] = o;
        return a
    },
    lr,
    sm,
    Rd = (i, e, t) => {
        let s = i.vars,
            {ease: n, startAt: r, immediateRender: a, lazy: o, onUpdate: l, runBackwards: c, yoyoEase: h, keyframes: d, autoRevert: u} = s,
            f = i._dur,
            p = i._startAt,
            A = i._targets,
            m = i.parent,
            g = m && m.data === "nested" ? m.vars.targets : A,
            x = i._overwrite === "auto" && !JA,
            v = i.timeline,
            y,
            S,
            w,
            C,
            M,
            E,
            _,
            I,
            P,
            D,
            L,
            z,
            O;
        if (v && (!d || !n) && (n = "none"), i._ease = aa(n, ko.ease), i._yEase = h ? Y_(aa(h === !0 ? n : h, ko.ease)) : 0, h && i._yoyo && !i._repeat && (h = i._yEase, i._yEase = i._ease, i._ease = h), i._from = !v && !!s.runBackwards, !v || d && !s.stagger) {
            if (I = A[0] ? na(A[0]).harness : 0, z = I && s[I.prop], y = $u(s, tg), p && (p._zTime < 0 && p.progress(1), e < 0 && c && a && !u ? p.render(-1, !0) : p.revert(c && f ? iu : fP), p._lazy = 0), r) {
                if (vr(i._startAt = Qt.set(A, Bs({
                    data: "isStart",
                    overwrite: !1,
                    parent: m,
                    immediateRender: !0,
                    lazy: !p && Ji(o),
                    startAt: null,
                    delay: 0,
                    onUpdate: l && (() => us(i, "onUpdate")),
                    stagger: 0
                }, r))), i._startAt._dp = 0, i._startAt._sat = i, e < 0 && (Li || !a && !u) && i._startAt.revert(iu), a && f && e <= 0 && t <= 0) {
                    e && (i._zTime = e);
                    return
                }
            } else if (c && f && !p) {
                if (e && (a = !1), w = Bs({
                    overwrite: !1,
                    data: "isFromStart",
                    lazy: a && !p && Ji(o),
                    immediateRender: a,
                    stagger: 0,
                    parent: m
                }, y), z && (w[I.prop] = z), vr(i._startAt = Qt.set(A, w)), i._startAt._dp = 0, i._startAt._sat = i, e < 0 && (Li ? i._startAt.revert(iu) : i._startAt.render(-1, !0)), i._zTime = e, !a)
                    Rd(i._startAt, Ut, Ut);
                else if (!e)
                    return
            }
            for (i._pt = i._ptCache = 0, o = f && Ji(o) || o && !f, S = 0; S < A.length; S++) {
                if (M = A[S], _ = M._gsap || sg(A)[S]._gsap, i._ptLookup[S] = D = {}, Jp[_.id] && pr.length && Zu(), L = g === A ? S : g.indexOf(M), I && (P = new I).init(M, z || y, i, L, g) !== !1 && (i._pt = C = new Zi(i._pt, M, P.name, 0, 1, P.render, P, 0, P.priority), P._props.forEach(K => {
                    D[K] = C
                }), P.priority && (E = 1)), !I || z)
                    for (w in y)
                        cs[w] && (P = K_(w, y, i, L, M, g)) ? P.priority && (E = 1) : D[w] = C = ng.call(i, M, w, "get", y[w], L, g, 0, s.stringFilter);
                i._op && i._op[S] && i.kill(M, i._op[S]),
                x && i._pt && (lr = i, Wt.killTweensOf(M, D, i.globalTime(e)), O = !i.parent, lr = 0),
                i._pt && o && (Jp[_.id] = 1)
            }
            E && tw(i),
            i._onInit && i._onInit(i)
        }
        i._onUpdate = l,
        i._initted = (!i._op || i._pt) && !O,
        d && e <= 0 && v.render(ws, !0, !0)
    },
    LP = (i, e, t, s, n, r, a, o) => {
        let l = (i._pt && i._ptCache || (i._ptCache = {}))[e],
            c,
            h,
            d,
            u;
        if (!l)
            for (l = i._ptCache[e] = [], d = i._ptLookup, u = i._targets.length; u--;) {
                if (c = d[u][e], c && c.d && c.d._pt)
                    for (c = c.d._pt; c && c.p !== e && c.fp !== e;)
                        c = c._next;
                if (!c)
                    return sm = 1, i.vars[e] = "+=0", Rd(i, a), sm = 0, o ? vc(e + " not eligible for reset") : 1;
                l.push(c)
            }
        for (u = l.length; u--;)
            h = l[u],
            c = h._pt || h,
            c.s = (s || s === 0) && !n ? s : c.s + (s || 0) + r * c.c,
            c.c = t - c.s,
            h.e && (h.e = ai(t) + Ri(h.e)),
            h.b && (h.b = c.s + Ri(h.b))
    },
    FP = (i, e) => {
        let t = i[0] ? na(i[0]).harness : 0,
            s = t && t.aliases,
            n,
            r,
            a,
            o;
        if (!s)
            return e;
        n = pa({}, e);
        for (r in s)
            if (r in n)
                for (o = s[r].split(","), a = o.length; a--;)
                    n[o[a]] = n[r];
        return n
    },
    NP = (i, e, t, s) => {
        let n = e.ease || s || "power1.inOut",
            r,
            a;
        if (Fi(e))
            a = t[i] || (t[i] = []),
            e.forEach((o, l) => a.push({
                t: l / (e.length - 1) * 100,
                v: o,
                e: n
            }));
        else
            for (r in e)
                a = t[r] || (t[r] = []),
                r === "ease" || a.push({
                    t: parseFloat(i),
                    v: e[r],
                    e: n
                })
    },
    Jl = (i, e, t, s, n) => si(i) ? i.call(e, t, s, n) : yi(i) && ~i.indexOf("random(") ? yc(i) : i,
    J_ = ig + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
    j_ = {};
ji(J_ + ",id,stagger,delay,duration,paused,scrollTrigger", i => j_[i] = 1);
class Qt extends wc {
    constructor(e, t, s, n)
    {
        typeof t == "number" && (s.duration = t, t = s, s = null),
        super(n ? t : Xl(t));
        let {duration: r, delay: a, immediateRender: o, stagger: l, overwrite: c, keyframes: h, defaults: d, scrollTrigger: u, yoyoEase: f} = this.vars,
            p = t.parent || Wt,
            A = (Fi(e) || f_(e) ? Pn(e[0]) : "length" in t) ? [e] : Es(e),
            m,
            g,
            x,
            v,
            y,
            S,
            w,
            C;
        if (this._targets = A.length ? sg(A) : vc("GSAP target " + e + " not found. https://gsap.com", !ps.nullTargetWarn) || [], this._ptLookup = [], this._overwrite = c, h || l || yh(r) || yh(a)) {
            if (t = this.vars, m = this.timeline = new Qi({
                data: "nested",
                defaults: d || {},
                targets: p && p.data === "nested" ? p.vars.targets : A
            }), m.kill(), m.parent = m._dp = this, m._start = 0, l || yh(r) || yh(a)) {
                if (v = A.length, w = l && R_(l), cn(l))
                    for (y in l)
                        ~J_.indexOf(y) && (C || (C = {}), C[y] = l[y]);
                for (g = 0; g < v; g++)
                    x = $u(t, j_),
                    x.stagger = 0,
                    f && (x.yoyoEase = f),
                    C && pa(x, C),
                    S = A[g],
                    x.duration = +Jl(r, this, g, S, A),
                    x.delay = (+Jl(a, this, g, S, A) || 0) - this._delay,
                    !l && v === 1 && x.delay && (this._delay = a = x.delay, this._start += a, x.delay = 0),
                    m.to(S, x, w ? w(g, S, A) : 0),
                    m._ease = Ci.none;
                m.duration() ? r = a = 0 : this.timeline = 0
            } else if (h) {
                Xl(Bs(m.vars.defaults, {
                    ease: "none"
                })),
                m._ease = aa(h.ease || t.ease || "none");
                let M = 0,
                    E,
                    _,
                    I;
                if (Fi(h))
                    h.forEach(P => m.to(A, P, ">")),
                    m.duration();
                else {
                    x = {};
                    for (y in h)
                        y === "ease" || y === "easeEach" || NP(y, h[y], x, h.easeEach);
                    for (y in x)
                        for (E = x[y].sort((P, D) => P.t - D.t), M = 0, g = 0; g < E.length; g++)
                            _ = E[g],
                            I = {
                                ease: _.e,
                                duration: (_.t - (g ? E[g - 1].t : 0)) / 100 * r
                            },
                            I[y] = _.v,
                            m.to(A, I, M),
                            M += I.duration;
                    m.duration() < r && m.to({}, {
                        duration: r - m.duration()
                    })
                }
            }
            r || this.duration(r = m.duration())
        } else
            this.timeline = 0;
        c === !0 && !JA && (lr = this, Wt.killTweensOf(A), lr = 0),
        tn(p, this, s),
        t.reversed && this.reverse(),
        t.paused && this.paused(!0),
        (o || !r && !h && this._start === vi(p._time) && Ji(o) && M_(this) && p.data !== "nested") && (this._tTime = -Ut, this.render(Math.max(0, -a) || 0)),
        u && T_(this, u)
    }
    render(e, t, s)
    {
        let n = this._time,
            r = this._tDur,
            a = this._dur,
            o = e < 0,
            l = e > r - Ut && !o ? r : e < Ut ? 0 : e,
            c,
            h,
            d,
            u,
            f,
            p,
            A,
            m,
            g;
        if (!a)
            xP(this, e, t, s);
        else if (l !== this._tTime || !e || s || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== o) {
            if (c = l, m = this.timeline, this._repeat) {
                if (u = a + this._rDelay, this._repeat < -1 && o)
                    return this.totalTime(u * 100 + e, t, s);
                if (c = vi(l % u), l === r ? (d = this._repeat, c = a) : (d = ~~(l / u), d && d === vi(l / u) && (c = a, d--), c > a && (c = a)), p = this._yoyo && d & 1, p && (g = this._yEase, c = a - c), f = zo(this._tTime, u), c === n && !s && this._initted && d === f)
                    return this._tTime = l, this;
                d !== f && (m && this._yEase && td(m, p), this.vars.repeatRefresh && !p && !this._lock && this._time !== u && this._initted && (this._lock = s = 1, this.render(vi(u * d), !0).invalidate()._lock = 0))
            }
            if (!this._initted) {
                if (I_(this, o ? e : c, s, t, l))
                    return this._tTime = 0, this;
                if (n !== this._time && !(s && this.vars.repeatRefresh && d !== f))
                    return this;
                if (a !== this._dur)
                    return this.render(e, t, s)
            }
            if (this._tTime = l, this._time = c, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = A = (g || this._ease)(c / a), this._from && (this.ratio = A = 1 - A), c && !n && !t && !d && (us(this, "onStart"), this._tTime !== l))
                return this;
            for (h = this._pt; h;)
                h.r(A, h.d),
                h = h._next;
            m && m.render(e < 0 ? e : m._dur * m._ease(c / this._dur), t, s) || this._startAt && (this._zTime = e),
            this._onUpdate && !t && (o && Zp(this, e, t, s), us(this, "onUpdate")),
            this._repeat && d !== f && this.vars.onRepeat && !t && this.parent && us(this, "onRepeat"),
            (l === this._tDur || !l) && this._tTime === l && (o && !this._onUpdate && Zp(this, e, !0, !0), (e || !a) && (l === this._tDur && this._ts > 0 || !l && this._ts < 0) && vr(this, 1), !t && !(o && !n) && (l || n || p) && (us(this, l === r ? "onComplete" : "onReverseComplete", !0), this._prom && !(l < r && this.timeScale() > 0) && this._prom()))
        }
        return this
    }
    targets()
    {
        return this._targets
    }
    invalidate(e)
    {
        return (!e || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(e), super.invalidate(e)
    }
    resetTo(e, t, s, n, r)
    {
        _c || hs.wake(),
        this._ts || this.play();
        let a = Math.min(this._dur, (this._dp._time - this._start) * this._ts),
            o;
        return this._initted || Rd(this, a), o = this._ease(a / this._dur), LP(this, e, t, s, n, o, a, r) ? this.resetTo(e, t, s, n, 1) : (Dd(this, 0), this.parent || S_(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0))
    }
    kill(e, t="all")
    {
        if (!e && (!t || t === "all"))
            return this._lazy = this._pt = 0, this.parent ? Il(this) : this;
        if (this.timeline) {
            let p = this.timeline.totalDuration();
            return this.timeline.killTweensOf(e, t, lr && lr.vars.overwrite !== !0)._first || Il(this), this.parent && p !== this.timeline.totalDuration() && Qo(this, this._dur * this.timeline._tDur / p, 0, 1), this
        }
        let s = this._targets,
            n = e ? Es(e) : s,
            r = this._ptLookup,
            a = this._pt,
            o,
            l,
            c,
            h,
            d,
            u,
            f;
        if ((!t || t === "all") && gP(s, n))
            return t === "all" && (this._pt = 0), Il(this);
        for (o = this._op = this._op || [], t !== "all" && (yi(t) && (d = {}, ji(t, p => d[p] = 1), t = d), t = FP(s, t)), f = s.length; f--;)
            if (~n.indexOf(s[f])) {
                l = r[f],
                t === "all" ? (o[f] = t, h = l, c = {}) : (c = o[f] = o[f] || {}, h = t);
                for (d in h)
                    u = l && l[d],
                    u && ((!("kill" in u.d) || u.d.kill(d) === !0) && Bd(this, u, "_pt"), delete l[d]),
                    c !== "all" && (c[d] = 1)
            }
        return this._initted && !this._pt && a && Il(this), this
    }
    static to(e, t)
    {
        return new Qt(e, t, arguments[2])
    }
    static from(e, t)
    {
        return Kl(1, arguments)
    }
    static delayedCall(e, t, s, n)
    {
        return new Qt(t, 0, {
            immediateRender: !1,
            lazy: !1,
            overwrite: !1,
            delay: e,
            onComplete: t,
            onReverseComplete: t,
            onCompleteParams: s,
            onReverseCompleteParams: s,
            callbackScope: n
        })
    }
    static fromTo(e, t, s)
    {
        return Kl(2, arguments)
    }
    static set(e, t)
    {
        return t.duration = 0, t.repeatDelay || (t.repeat = 0), new Qt(e, t)
    }
    static killTweensOf(e, t, s)
    {
        return Wt.killTweensOf(e, t, s)
    }
}
Bs(Qt.prototype, {
    _targets: [],
    _lazy: 0,
    _startAt: 0,
    _op: 0,
    _onInit: 0
});
ji("staggerTo,staggerFrom,staggerFromTo", i => {
    Qt[i] = function() {
        let e = new Qi,
            t = em.call(arguments, 0);
        return t.splice(i === "staggerFromTo" ? 5 : 4, 0, 0), e[i].apply(e, t)
    }
});
let rg = (i, e, t) => i[e] = t,
    Z_ = (i, e, t) => i[e](t),
    OP = (i, e, t, s) => i[e](s.fp, t),
    kP = (i, e, t) => i.setAttribute(e, t),
    ag = (i, e) => si(i[e]) ? Z_ : jA(i[e]) && i.setAttribute ? kP : rg,
    $_ = (i, e) => e.set(e.t, e.p, Math.round((e.s + e.c * i) * 1e6) / 1e6, e),
    zP = (i, e) => e.set(e.t, e.p, !!(e.s + e.c * i), e),
    ew = function(i, e) {
        let t = e._pt,
            s = "";
        if (!i && e.b)
            s = e.b;
        else if (i === 1 && e.e)
            s = e.e;
        else {
            for (; t;)
                s = t.p + (t.m ? t.m(t.s + t.c * i) : Math.round((t.s + t.c * i) * 1e4) / 1e4) + s,
                t = t._next;
            s += e.c
        }
        e.set(e.t, e.p, s, e)
    },
    og = function(i, e) {
        let t = e._pt;
        for (; t;)
            t.r(i, t.d),
            t = t._next
    },
    QP = function(i, e, t, s) {
        let n = this._pt,
            r;
        for (; n;)
            r = n._next,
            n.p === s && n.modifier(i, e, t),
            n = r
    },
    GP = function(i) {
        let e = this._pt,
            t,
            s;
        for (; e;)
            s = e._next,
            e.p === i && !e.op || e.op === i ? Bd(this, e, "_pt") : e.dep || (t = 1),
            e = s;
        return !t
    },
    HP = (i, e, t, s) => {
        s.mSet(i, e, s.m.call(s.tween, t, s.mt), s)
    },
    tw = i => {
        let e = i._pt,
            t,
            s,
            n,
            r;
        for (; e;) {
            for (t = e._next, s = n; s && s.pr > e.pr;)
                s = s._next;
            (e._prev = s ? s._prev : r) ? e._prev._next = e : n = e,
            (e._next = s) ? s._prev = e : r = e,
            e = t
        }
        i._pt = n
    };
class Zi {
    constructor(e, t, s, n, r, a, o, l, c)
    {
        this.t = t,
        this.s = n,
        this.c = r,
        this.p = s,
        this.r = a || $_,
        this.d = o || this,
        this.set = l || rg,
        this.pr = c || 0,
        this._next = e,
        e && (e._prev = this)
    }
    modifier(e, t, s)
    {
        this.mSet = this.mSet || this.set,
        this.set = HP,
        this.m = e,
        this.mt = s,
        this.tween = t
    }
}
ji(ig + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", i => tg[i] = 1);
As.TweenMax = As.TweenLite = Qt;
As.TimelineLite = As.TimelineMax = Qi;
Wt = new Qi({
    sortChildren: !1,
    defaults: ko,
    autoRemoveChildren: !0,
    id: "root",
    smoothChildTiming: !0
});
ps.stringFilter = W_;
let oa = [],
    au = {},
    VP = [],
    Q0 = 0,
    WP = 0,
    Lf = i => (au[i] || VP).map(e => e()),
    nm = () => {
        let i = Date.now(),
            e = [];
        i - Q0 > 2 && (Lf("matchMediaInit"), oa.forEach(t => {
            let s = t.queries,
                n = t.conditions,
                r,
                a,
                o,
                l;
            for (a in s)
                r = Js.matchMedia(s[a]).matches,
                r && (o = 1),
                r !== n[a] && (n[a] = r, l = 1);
            l && (t.revert(), o && e.push(t))
        }), Lf("matchMediaRevert"), e.forEach(t => t.onMatch(t, s => t.add(null, s))), Q0 = i, Lf("matchMedia"))
    };
class Ud {
    constructor(e, t)
    {
        this.selector = t && tm(t),
        this.data = [],
        this._r = [],
        this.isReverted = !1,
        this.id = WP++,
        e && this.add(e)
    }
    add(e, t, s)
    {
        si(e) && (s = t, t = e, e = si);
        let n = this,
            r = function() {
                let a = Gt,
                    o = n.selector,
                    l;
                return a && a !== n && a.data.push(n), s && (n.selector = tm(s)), Gt = n, l = t.apply(n, arguments), si(l) && n._r.push(l), Gt = a, n.selector = o, n.isReverted = !1, l
            };
        return n.last = r, e === si ? r(n, a => n.add(null, a)) : e ? n[e] = r : r
    }
    ignore(e)
    {
        let t = Gt;
        Gt = null,
        e(this),
        Gt = t
    }
    getTweens()
    {
        let e = [];
        return this.data.forEach(t => t instanceof Ud ? e.push(...t.getTweens()) : t instanceof Qt && !(t.parent && t.parent.data === "nested") && e.push(t)), e
    }
    clear()
    {
        this._r.length = this.data.length = 0
    }
    kill(e, t)
    {
        if (e) {
            let s = this.getTweens(),
                n = this.data.length,
                r;
            for (; n--;)
                r = this.data[n],
                r.data === "isFlip" && (r.revert(), r.getChildren(!0, !0, !1).forEach(a => s.splice(s.indexOf(a), 1)));
            for (s.map(a => ({
                g: a._dur || a._delay || a._sat && !a._sat.vars.immediateRender ? a.globalTime(0) : -1 / 0,
                t: a
            })).sort((a, o) => o.g - a.g || -1 / 0).forEach(a => a.t.revert(e)), n = this.data.length; n--;)
                r = this.data[n],
                r instanceof Qi ? r.data !== "nested" && (r.scrollTrigger && r.scrollTrigger.revert(), r.kill()) : !(r instanceof Qt) && r.revert && r.revert(e);
            this._r.forEach(a => a(e, this)),
            this.isReverted = !0
        } else
            this.data.forEach(s => s.kill && s.kill());
        if (this.clear(), t) {
            let s = oa.length;
            for (; s--;)
                oa[s].id === this.id && oa.splice(s, 1)
        }
    }
    revert(e)
    {
        this.kill(e || {})
    }
}
class YP {
    constructor(e)
    {
        this.contexts = [],
        this.scope = e,
        Gt && Gt.data.push(this)
    }
    add(e, t, s)
    {
        cn(e) || (e = {
            matches: e
        });
        let n = new Ud(0, s || this.scope),
            r = n.conditions = {},
            a,
            o,
            l;
        Gt && !n.selector && (n.selector = Gt.selector),
        this.contexts.push(n),
        t = n.add("onMatch", t),
        n.queries = e;
        for (o in e)
            o === "all" ? l = 1 : (a = Js.matchMedia(e[o]), a && (oa.indexOf(n) < 0 && oa.push(n), (r[o] = a.matches) && (l = 1), a.addListener ? a.addListener(nm) : a.addEventListener("change", nm)));
        return l && t(n, c => n.add(null, c)), this
    }
    revert(e)
    {
        this.kill(e || {})
    }
    kill(e)
    {
        this.contexts.forEach(t => t.kill(e, !0))
    }
}
const id = {
    registerPlugin(...i) {
        i.forEach(e => G_(e))
    },
    timeline(i) {
        return new Qi(i)
    },
    getTweensOf(i, e) {
        return Wt.getTweensOf(i, e)
    },
    getProperty(i, e, t, s) {
        yi(i) && (i = Es(i)[0]);
        let n = na(i || {}).get,
            r = t ? C_ : E_;
        return t === "native" && (t = ""), i && (e ? r((cs[e] && cs[e].get || n)(i, e, t, s)) : (a, o, l) => r((cs[a] && cs[a].get || n)(i, a, o, l)))
    },
    quickSetter(i, e, t) {
        if (i = Es(i), i.length > 1) {
            let o = i.map(c => ts.quickSetter(c, e, t)),
                l = o.length;
            return c => {
                let h = l;
                for (; h--;)
                    o[h](c)
            }
        }
        i = i[0] || {};
        let s = cs[e],
            n = na(i),
            r = n.harness && (n.harness.aliases || {})[e] || e,
            a = s ? o => {
                let l = new s;
                mo._pt = 0,
                l.init(i, t ? o + t : o, mo, 0, [i]),
                l.render(1, l),
                mo._pt && og(1, mo)
            } : n.set(i, r);
        return s ? a : o => a(i, r, t ? o + t : o, n, 1)
    },
    quickTo(i, e, t) {
        let s = ts.to(i, pa({
                [e]: "+=0.1",
                paused: !0
            }, t || {})),
            n = (r, a, o) => s.resetTo(e, r, a, o);
        return n.tween = s, n
    },
    isTweening(i) {
        return Wt.getTweensOf(i, !0).length > 0
    },
    defaults(i) {
        return i && i.ease && (i.ease = aa(i.ease, ko.ease)), jp(ko, i || {})
    },
    config(i) {
        return jp(ps, i || {})
    },
    registerEffect({name: i, effect: e, plugins: t, defaults: s, extendTimeline: n}) {
        (t || "").split(",").forEach(r => r && !cs[r] && !As[r] && vc(i + " effect requires " + r + " plugin.")),
        Rf[i] = (r, a, o) => e(Es(r), Bs(a || {}, s), o),
        n && (Qi.prototype[i] = function(r, a, o) {
            return this.add(Rf[i](r, cn(a) ? a : (o = a) && {}, this), o)
        })
    },
    registerEase(i, e) {
        Ci[i] = aa(e)
    },
    parseEase(i, e) {
        return arguments.length ? aa(i, e) : Ci
    },
    getById(i) {
        return Wt.getById(i)
    },
    exportRoot(i={}, e) {
        let t = new Qi(i),
            s,
            n;
        for (t.smoothChildTiming = Ji(i.smoothChildTiming), Wt.remove(t), t._dp = 0, t._time = t._tTime = Wt._time, s = Wt._first; s;)
            n = s._next,
            (e || !(!s._dur && s instanceof Qt && s.vars.onComplete === s._targets[0])) && tn(t, s, s._start - s._delay),
            s = n;
        return tn(Wt, t, 0), t
    },
    context: (i, e) => i ? new Ud(i, e) : Gt,
    matchMedia: i => new YP(i),
    matchMediaRefresh: () => oa.forEach(i => {
        let e = i.conditions,
            t,
            s;
        for (s in e)
            e[s] && (e[s] = !1, t = 1);
        t && i.revert()
    }) || nm(),
    addEventListener(i, e) {
        let t = au[i] || (au[i] = []);
        ~t.indexOf(e) || t.push(e)
    },
    removeEventListener(i, e) {
        let t = au[i],
            s = t && t.indexOf(e);
        s >= 0 && t.splice(s, 1)
    },
    utils: {
        wrap: N_,
        wrapYoyo: O_,
        distribute: R_,
        random: L_,
        snap: U_,
        normalize: MP,
        getUnit: Ri,
        clamp: wP,
        splitColor: H_,
        toArray: Es,
        selector: tm,
        mapRange: k_,
        pipe: CP,
        unitize: SP,
        interpolate: z_,
        shuffle: D_
    },
    install: v_,
    effects: Rf,
    ticker: hs,
    updateRoot: Qi.updateRoot,
    plugins: cs,
    globalTimeline: Wt,
    core: {
        PropTween: Zi,
        globals: x_,
        Tween: Qt,
        Timeline: Qi,
        Animation: wc,
        getCache: na,
        _removeLinkedListItem: Bd,
        reverting: () => Li,
        context: i => (i && Gt && (Gt.data.push(i), i._ctx = Gt), Gt),
        suppressOverwrites: i => JA = i
    }
};
ji("to,from,fromTo,delayedCall,set,killTweensOf", i => id[i] = Qt[i]);
hs.add(Qi.updateRoot);
mo = id.to({}, {
    duration: 0
});
let qP = (i, e) => {
        let t = i._pt;
        for (; t && t.p !== e && t.op !== e && t.fp !== e;)
            t = t._next;
        return t
    },
    XP = (i, e) => {
        let t = i._targets,
            s,
            n,
            r;
        for (s in e)
            for (n = t.length; n--;)
                r = i._ptLookup[n][s],
                r && (r = r.d) && (r._pt && (r = qP(r, s)), r && r.modifier && r.modifier(e[s], i, t[n], s))
    },
    Ff = (i, e) => ({
        name: i,
        rawVars: 1,
        init(t, s, n) {
            n._onInit = r => {
                let a,
                    o;
                if (yi(s) && (a = {}, ji(s, l => a[l] = 1), s = a), e) {
                    a = {};
                    for (o in s)
                        a[o] = e(s[o]);
                    s = a
                }
                XP(r, s)
            }
        }
    });
const ts = id.registerPlugin({
    name: "attr",
    init(i, e, t, s, n) {
        let r,
            a,
            o;
        this.tween = t;
        for (r in e)
            o = i.getAttribute(r) || "",
            a = this.add(i, "setAttribute", (o || 0) + "", e[r], s, n, 0, 0, r),
            a.op = r,
            a.b = o,
            this._props.push(r)
    },
    render(i, e) {
        let t = e._pt;
        for (; t;)
            Li ? t.set(t.t, t.p, t.b, t) : t.r(i, t.d),
            t = t._next
    }
}, {
    name: "endArray",
    init(i, e) {
        let t = e.length;
        for (; t--;)
            this.add(i, t, i[t] || 0, e[t], 0, 0, 0, 0, 0, 1)
    }
}, Ff("roundProps", im), Ff("modifiers"), Ff("snap", U_)) || id;
Qt.version = Qi.version = ts.version = "3.12.5";
g_ = 1;
ZA() && Go(); /*!
