var ap,
    op,
    ao,
    Xr,
    dd,
    fd,
    wu,
    zm,
    aE,
    Eu,
    Qm;
const Fl = class {
    constructor()
    {
        te(this, zm),
        te(this, Eu),
        te(this, ao, new H),
        te(this, Xr, null),
        te(this, dd, !0),
        te(this, fd, !1),
        te(this, wu, new H),
        Oe(this, "boundWheel", ve(this, zm, aE).bind(this)),
        Oe(this, "position", new H),
        Oe(this, "delta", new H),
        Oe(this, "velocity", new H),
        Oe(this, "isPinching", !1)
    }
    init({element: e=window}={})
    {
        et(this, Xr, e),
        et(this, dd, U(this, Xr) instanceof HTMLCanvasElement),
        et(this, fd, q.browser.name === "firefox"),
        U(this, Xr).addEventListener("wheel", this.boundWheel, {
            passive: !1
        }),
        Q.on("webgl_prerender", ve(this, Eu, Qm), this)
    }
    dispose()
    {
        U(this, Xr).removeEventListener("wheel", this.boundWheel),
        Q.off("webgl_prerender", ve(this, Eu, Qm), this),
        et(this, Xr, null)
    }
}
;
ap = new WeakMap,
op = new WeakMap,
ao = new WeakMap,
Xr = new WeakMap,
dd = new WeakMap,
fd = new WeakMap,
wu = new WeakMap,
zm = new WeakSet,
aE = function(i) {
    U(this, dd) && (i.preventDefault(), i.stopPropagation()),
    this.isPinching = i.ctrlKey,
    U(this, ao).set(i.deltaX, i.deltaY),
    U(this, fd) && i.deltaMode === 1 && U(this, ao).multiplyScalar(U(Fl, ap)),
    this.position.add(U(this, ao)),
    this.delta.copy(this.position).sub(U(this, wu)),
    U(this, wu).copy(this.position),
    this.velocity.add(U(this, ao).copy(this.delta).multiplyScalar(.1)),
    Q.emit("wheel", this)
},
Eu = new WeakSet,
Qm = function() {
    this.velocity.multiplyScalar(ie.frictionFPS(U(Fl, op))),
    this.velocity.clampScalar(-1, 1),
    this.velocity.length() < .001 && this.velocity.setScalar(0)
},
te(Fl, ap, 33),
te(Fl, op, .97);
let BU = Fl;
const Px = new BU;
var Gm,
    oE,
    Hm,
    lE;
class PU {
    constructor()
    {
        te(this, Gm),
        te(this, Hm),
        Oe(this, "boundKeyDown", ve(this, Gm, oE).bind(this)),
        Oe(this, "boundKeyUp", ve(this, Hm, lE).bind(this))
    }
    init()
    {
        window.addEventListener("keydown", this.boundKeyDown),
        window.addEventListener("keyup", this.boundKeyUp)
    }
    dispose()
    {
        window.removeEventListener("keydown", this.boundKeyDown),
        window.removeEventListener("keyup", this.boundKeyUp)
    }
}
Gm = new WeakSet,
oE = function(i) {
    Q.emit("keydown", i)
},
Hm = new WeakSet,
lE = function(i) {
    Q.emit("keyup", i)
};
const Dx = new PU,
    _i = {
        resolution: {
            value: new H(2, 2),
            global: !0
        },
        resolutionUI: {
            value: new H(2, 2),
            global: !0
        },
        aspect: {
            value: 1,
            global: !0
        },
        time: {
            value: 0,
            global: !0
        },
        dtRatio: {
            value: 1,
            global: !0
        }
    },
    ya = new l2;
ya.setName("Global");
ya.add(_i.resolution);
ya.add(_i.resolutionUI);
ya.add(_i.aspect);
ya.add(_i.time);
ya.add(_i.dtRatio);
var vo,
    rc,
    $n,
    Vm,
    cE,
    pd,
    Wm,
    Ym,
    hE,
    Cu,
    qm;
class DU {
    constructor()
    {
        te(this, Vm),
        te(this, pd),
        te(this, Ym),
        te(this, Cu),
        te(this, vo, null),
        te(this, rc, null),
        te(this, $n, ve(this, Ym, hE).bind(this)),
        Oe(this, "context", $h.getContext()),
        Oe(this, "contextReady", null),
        Oe(this, "contextStarted", !1),
        Oe(this, "preventSuspend", !1),
        Oe(this, "preventResume", !1),
        this.contextReady = new Promise((e, t) => {
            et(this, vo, {
                resolve: e,
                reject: t
            })
        })
    }
    init()
    {
        this.context = $h.getContext(),
        ve(this, Vm, cE).call(this),
        Q.on("visibility_change", ve(this, Cu, qm), this)
    }
    suspend()
    {
        if (this.context.state === "running" && !this.preventSuspend)
            return this.context.suspend()
    }
    resume()
    {
        if (this.contextStarted && this.context.state === "suspended" && !this.preventResume)
            return this.context.resume()
    }
    dispose()
    {
        ve(this, pd, Wm).call(this),
        clearTimeout(U(this, rc)),
        Q.off("visibility_change", ve(this, Cu, qm), this),
        U(this, vo).reject(),
        this.contextReady = new Promise((e, t) => {
            et(this, vo, {
                resolve: e,
                reject: t
            })
        }),
        this.context.close(),
        this.contextStarted = !1,
        $h.setContext(void 0),
        this.preventSuspend = !1,
        this.preventResume = !1
    }
}
vo = new WeakMap,
rc = new WeakMap,
$n = new WeakMap,
Vm = new WeakSet,
cE = function() {
    $t.allowTouchStart = !0,
    document.body.addEventListener("click", U(this, $n)),
    Q.on("touch_end", U(this, $n)),
    Q.on("keydown", U(this, $n))
},
pd = new WeakSet,
Wm = function() {
    $t.allowTouchStart = !1,
    document.body.removeEventListener("click", U(this, $n)),
    Q.off("touch_end", U(this, $n)),
    Q.off("keydown", U(this, $n))
},
Ym = new WeakSet,
hE = async function() {
    try {
        if (await this.context.resume(), this.contextStarted)
            return;
        this.contextStarted = !0,
        ve(this, pd, Wm).call(this),
        U(this, vo).resolve()
    } catch (i) {
        console.log("audio context error:", i)
    }
},
Cu = new WeakSet,
qm = function(i) {
    this.contextStarted && q.os.name === "ios" && (i ? et(this, rc, setTimeout(() => this.resume(), 500)) : (clearTimeout(U(this, rc)), this.suspend()))
};
const RU = new DU;
var ac,
    Xm,
    oc,
    Km,
    Jm,
    jm,
    Zm,
    Su,
    Mu,
    $m,
    sr,
    oo,
    Nl,
    Ns,
    Bo,
    bu,
    eA;
class UU {
    constructor(e)
    {
        te(this, bu),
        te(this, ac, null),
        te(this, Xm, 2),
        te(this, oc, 0),
        te(this, Km, 4),
        te(this, Jm, 5),
        te(this, jm, 30),
        te(this, Zm, 60),
        te(this, Su, .1),
        te(this, Mu, .6),
        te(this, $m, 4),
        te(this, sr, []),
        te(this, oo, 0),
        te(this, Nl, 0),
        te(this, Ns, 1),
        te(this, Bo, 0),
        et(this, ac, e)
    }
    get hasRun()
    {
        return U(this, Bo) !== 0
    }
    get multiplier()
    {
        return U(this, Ns)
    }
    start()
    {
        this.stop(),
        et(this, oc, Fe.time + U(this, Xm)),
        et(this, Bo, U(this, oc)),
        Q.on("webgl_average_fps_update", ve(this, bu, eA), this)
    }
    stop()
    {
        U(this, sr).length = 0,
        Q.off("webgl_average_fps_update", ve(this, bu, eA), this)
    }
}
ac = new WeakMap,
Xm = new WeakMap,
oc = new WeakMap,
Km = new WeakMap,
Jm = new WeakMap,
jm = new WeakMap,
Zm = new WeakMap,
Su = new WeakMap,
Mu = new WeakMap,
$m = new WeakMap,
sr = new WeakMap,
oo = new WeakMap,
Nl = new WeakMap,
Ns = new WeakMap,
Bo = new WeakMap,
bu = new WeakSet,
eA = function(i) {
    if (!(Fe.time < U(this, oc)) && q.visible && (U(this, sr).push(i), Fe.time - U(this, Bo) >= U(this, Km) && U(this, sr).length >= U(this, Jm))) {
        const e = U(this, sr).reduce((t, s) => t + s, 0) / U(this, sr).length;
        e < U(this, jm) && U(this, Ns) > U(this, Mu) ? (et(this, Ns, Math.max(U(this, Mu), U(this, Ns) - U(this, Su))), U(this, ac).setDPRMultiplier(U(this, Ns)), U(this, oo) === 1 && L0(this, Nl)._++, et(this, oo, -1)) : e >= U(this, Zm) && U(this, Ns) < 1 && (et(this, Ns, Math.min(1, U(this, Ns) + U(this, Su))), U(this, ac).setDPRMultiplier(U(this, Ns)), U(this, oo) === -1 && L0(this, Nl)._++, et(this, oo, 1)),
        U(this, sr).length = 0,
        et(this, Bo, Fe.time),
        U(this, Nl) >= U(this, $m) && (console.warn("Adaptive DPR stopped."), this.stop())
    }
};
class Dc {
    constructor()
    {
        this.isPass = !0,
        this.enabled = !0,
        this.needsSwap = !0,
        this.clear = !1,
        this.renderToScreen = !1
    }
    setSize() {}
    render()
    {
        console.error("THREE.Pass: .render() must be implemented in derived pass.")
    }
    dispose() {}
}
const LU = new Ln(-1, 1, 1, -1, 0, 1);
class FU extends ot {
    constructor()
    {
        super(),
        this.setAttribute("position", new nt([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)),
        this.setAttribute("uv", new nt([0, 2, 0, 0, 2, 0], 2))
    }
}
const NU = new FU;
class uE {
    constructor(e)
    {
        this._mesh = new Ce(NU, e)
    }
    dispose()
    {
        this._mesh.geometry.dispose()
    }
    render(e)
    {
        e.render(this._mesh, LU)
    }
    get material()
    {
        return this._mesh.material
    }
    set material(e)
    {
        this._mesh.material = e
    }
}
class dE extends Dc {
    constructor(e, t, s=null, n=null, r=null)
    {
        super(),
        this.scene = e,
        this.camera = t,
        this.overrideMaterial = s,
        this.clearColor = n,
        this.clearAlpha = r,
        this.clear = !0,
        this.clearDepth = !1,
        this.needsSwap = !1,
        this._oldClearColor = new Z
    }
    render(e, t, s)
    {
        const n = e.autoClear;
        e.autoClear = !1;
        let r,
            a;
        this.overrideMaterial !== null && (a = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial),
        this.clearColor !== null && (e.getClearColor(this._oldClearColor), e.setClearColor(this.clearColor, e.getClearAlpha())),
        this.clearAlpha !== null && (r = e.getClearAlpha(), e.setClearAlpha(this.clearAlpha)),
        this.clearDepth == !0 && e.clearDepth(),
        e.setRenderTarget(this.renderToScreen ? null : s),
        this.clear === !0 && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil),
        e.render(this.scene, this.camera),
        this.clearColor !== null && e.setClearColor(this._oldClearColor),
        this.clearAlpha !== null && e.setClearAlpha(r),
        this.overrideMaterial !== null && (this.scene.overrideMaterial = a),
        e.autoClear = n
    }
}
const OU = {
    name: "CopyShader",
    uniforms: {
        tDiffuse: {
            value: null
        },
        opacity: {
            value: 1
        }
    },
    vertexShader: `

    		varying vec2 vUv;

    		void main() {

    			vUv = uv;
    			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    		}`,
    fragmentShader: `

    		uniform float opacity;

    		uniform sampler2D tDiffuse;

    		varying vec2 vUv;

    		void main() {

    			vec4 texel = texture2D( tDiffuse, vUv );
    			gl_FragColor = opacity * texel;


    		}`
};
class kU extends Dc {
    constructor(e, t)
    {
        super(),
        this.textureID = t !== void 0 ? t : "tDiffuse",
        e instanceof fe ? (this.uniforms = e.uniforms, this.material = e) : e && (this.uniforms = UA.clone(e.uniforms), this.material = new fe({
            name: e.name !== void 0 ? e.name : "unspecified",
            defines: Object.assign({}, e.defines),
            uniforms: this.uniforms,
            vertexShader: e.vertexShader,
            fragmentShader: e.fragmentShader
        })),
        this.fsQuad = new uE(this.material)
    }
    render(e, t, s)
    {
        this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = s.texture),
        this.fsQuad.material = this.material,
        this.renderToScreen ? (e.setRenderTarget(null), this.fsQuad.render(e)) : (e.setRenderTarget(t), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this.fsQuad.render(e))
    }
    dispose()
    {
        this.material.dispose(),
        this.fsQuad.dispose()
    }
}
class Rx extends Dc {
    constructor(e, t)
    {
        super(),
        this.scene = e,
        this.camera = t,
        this.clear = !0,
        this.needsSwap = !1,
        this.inverse = !1
    }
    render(e, t, s)
    {
        const n = e.getContext(),
            r = e.state;
        r.buffers.color.setMask(!1),
        r.buffers.depth.setMask(!1),
        r.buffers.color.setLocked(!0),
        r.buffers.depth.setLocked(!0);
        let a,
            o;
        this.inverse ? (a = 0, o = 1) : (a = 1, o = 0),
        r.buffers.stencil.setTest(!0),
        r.buffers.stencil.setOp(n.REPLACE, n.REPLACE, n.REPLACE),
        r.buffers.stencil.setFunc(n.ALWAYS, a, 4294967295),
        r.buffers.stencil.setClear(o),
        r.buffers.stencil.setLocked(!0),
        e.setRenderTarget(s),
        this.clear && e.clear(),
        e.render(this.scene, this.camera),
        e.setRenderTarget(t),
        this.clear && e.clear(),
        e.render(this.scene, this.camera),
        r.buffers.color.setLocked(!1),
        r.buffers.depth.setLocked(!1),
        r.buffers.color.setMask(!0),
        r.buffers.depth.setMask(!0),
        r.buffers.stencil.setLocked(!1),
        r.buffers.stencil.setFunc(n.EQUAL, 1, 4294967295),
        r.buffers.stencil.setOp(n.KEEP, n.KEEP, n.KEEP),
        r.buffers.stencil.setLocked(!0)
    }
}
class zU extends Dc {
    constructor()
    {
        super(),
        this.needsSwap = !1
    }
    render(e)
    {
        e.state.buffers.stencil.setLocked(!1),
        e.state.buffers.stencil.setTest(!1)
    }
}
class QU {
    constructor(e, t)
    {
        if (this.renderer = e, this._pixelRatio = e.getPixelRatio(), t === void 0) {
            const s = e.getSize(new H);
            this._width = s.width,
            this._height = s.height,
            t = new vt(this._width * this._pixelRatio, this._height * this._pixelRatio, {
                type: Mi
            }),
            t.texture.name = "EffectComposer.rt1"
        } else
            this._width = t.width,
            this._height = t.height;
        this.renderTarget1 = t,
        this.renderTarget2 = t.clone(),
        this.renderTarget2.texture.name = "EffectComposer.rt2",
        this.writeBuffer = this.renderTarget1,
        this.readBuffer = this.renderTarget2,
        this.renderToScreen = !0,
        this.passes = [],
        this.copyPass = new kU(OU),
        this.copyPass.material.blending = qt,
        this.clock = new Zy
    }
    swapBuffers()
    {
        const e = this.readBuffer;
        this.readBuffer = this.writeBuffer,
        this.writeBuffer = e
    }
    addPass(e)
    {
        this.passes.push(e),
        e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio)
    }
    insertPass(e, t)
    {
        this.passes.splice(t, 0, e),
        e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio)
    }
    removePass(e)
    {
        const t = this.passes.indexOf(e);
        t !== -1 && this.passes.splice(t, 1)
    }
    isLastEnabledPass(e)
    {
        for (let t = e + 1; t < this.passes.length; t++)
            if (this.passes[t].enabled)
                return !1;
        return !0
    }
    render(e)
    {
        e === void 0 && (e = this.clock.getDelta());
        const t = this.renderer.getRenderTarget();
        let s = !1;
        for (let n = 0, r = this.passes.length; n < r; n++) {
            const a = this.passes[n];
            if (a.enabled !== !1) {
                if (a.renderToScreen = this.renderToScreen && this.isLastEnabledPass(n), a.render(this.renderer, this.writeBuffer, this.readBuffer, e, s), a.needsSwap) {
                    if (s) {
                        const o = this.renderer.getContext(),
                            l = this.renderer.state.buffers.stencil;
                        l.setFunc(o.NOTEQUAL, 1, 4294967295),
                        this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, e),
                        l.setFunc(o.EQUAL, 1, 4294967295)
                    }
                    this.swapBuffers()
                }
                Rx !== void 0 && (a instanceof Rx ? s = !0 : a instanceof zU && (s = !1))
            }
        }
        this.renderer.setRenderTarget(t)
    }
    reset(e)
    {
        if (e === void 0) {
            const t = this.renderer.getSize(new H);
            this._pixelRatio = this.renderer.getPixelRatio(),
            this._width = t.width,
            this._height = t.height,
            e = this.renderTarget1.clone(),
            e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio)
        }
        this.renderTarget1.dispose(),
        this.renderTarget2.dispose(),
        this.renderTarget1 = e,
        this.renderTarget2 = e.clone(),
        this.writeBuffer = this.renderTarget1,
        this.readBuffer = this.renderTarget2
    }
    setSize(e, t)
    {
        this._width = e,
        this._height = t;
        const s = this._width * this._pixelRatio,
            n = this._height * this._pixelRatio;
        this.renderTarget1.setSize(s, n),
        this.renderTarget2.setSize(s, n);
        for (let r = 0; r < this.passes.length; r++)
            this.passes[r].setSize(s, n)
    }
    setPixelRatio(e)
    {
        this._pixelRatio = e,
        this.setSize(this._width, this._height)
    }
    dispose()
    {
        this.renderTarget1.dispose(),
        this.renderTarget2.dispose(),
        this.copyPass.dispose()
    }
}
class tA extends QU {
    constructor({renderer: e=Je.webgl, renderTarget: t=void 0, autoResize: s=!0, renderToScreen: n=!1, depthTexture: r=!1, scene: a=null}={})
    {
        super(e, t),
        this.renderToScreen = n,
        r && (this.writeBuffer.depthTexture = new Fo, this.readBuffer.depthTexture = new Fo),
        s && (this._autoResize(), Q.on("resize", this._autoResize, this)),
        a != null && a.camera && (this.addPass(new dE(a, a.camera)), a.composer = this)
    }
    _autoResize()
    {
        this.setSize(_i.resolution.value.x, _i.resolution.value.y)
    }
    addPass(e)
    {
        var t;
        super.addPass(e),
        (t = e.scene) != null && t.camera && (e.scene.composer = this),
        this.passes.sort((s, n) => {
            const r = [s, n].map(a => a.isGammaCorrectionPass ? 1 : 0);
            return r[0] - r[1]
        })
    }
    dispose()
    {
        Q.off("resize", this._autoResize, this),
        this.passes.forEach(e => {
            var t,
                s,
                n;
            (s = (t = e.scene) == null ? void 0 : t.dispose) == null || s.call(t),
            (n = e.dispose) == null || n.call(e)
        }),
        this.passes = [],
        super.dispose()
    }
}
const ml = new Ln(-1, 1, 1, -1, 0, 1),
    Ux = Si.createDummyRT();
class Fd extends Dc {
    constructor()
    {
        super(),
        this.isPostprocessingPass = !0,
        this._effectComposer = new E2(Je.webgl, {
            frameBufferType: Mi
        }),
        this._effectComposer.inputBuffer.dispose(),
        this._effectComposer.outputBuffer.dispose(),
        this._effectComposer.inputBuffer = Ux,
        this._effectComposer.outputBuffer = Ux,
        this._effectComposer.autoRenderToScreen = !1
    }
    setSize(e, t)
    {
        for (const s of this._effectComposer.passes)
            s.setSize(e, t)
    }
    render(e, t, s, n)
    {
        this._effectComposer.inputBuffer = s,
        this._effectComposer.outputBuffer = t,
        this._effectComposer.render(n)
    }
    addGammaCorrection()
    {
        const e = new Or(ml);
        return e.renderToScreen = !0, e.fullscreenMaterial.encodeOutput = !0, this._effectComposer.addPass(e), this
    }
    addFXAA()
    {
        const e = new Or(ml, new PB);
        return e.renderToScreen = !0, e.fullscreenMaterial.encodeOutput = !0, this._effectComposer.addPass(e), this
    }
    addSMAA(e={})
    {
        var t;
        const s = new Or(ml, new XB({
            preset: so[((t = e.quality) == null ? void 0 : t.toUpperCase()) || "HIGH"]
        }));
        return s.renderToScreen = !0, s.fullscreenMaterial.encodeOutput = !0, this._effectComposer.addPass(s), this
    }
    addKawaseBlur(e={})
    {
        const t = new Id(e);
        return t.blurMaterial.kernelSize = typeof e.kernelSize == "number" ? e.kernelSize : fr.MEDIUM, this._effectComposer.addPass(t), this
    }
    addGaussianBlur(e={})
    {
        const t = new iP(e);
        return this._effectComposer.addPass(t), this
    }
    addBloom(e={})
    {
        const t = new Or(ml, new n_({
            ...e,
            mipmapBlur: !0
        }));
        return t.fullscreenMaterial.encodeOutput = !1, this._effectComposer.addPass(t), this
    }
    addSelectiveBloom({scene: e, objects: t, sceneDepthTexture: s, options: n={}}={})
    {
        if (!e || !t || !s)
            throw new Error("Selective Bloom requires scene, objects and depth texture.");
        const r = new kB(e, e.camera, {
            ...n,
            mipmapBlur: !0
        });
        r.selection.set(t.length ? t : [t]);
        const a = new Or(ml, r);
        return a.needsDepthTexture = !1, a.setDepthTexture(s), a.fullscreenMaterial.encodeOutput = !1, this._effectComposer.addPass(a), this
    }
    addGodRays({camera: e, lightSource: t, sceneDepthTexture: s, options: n={}}={})
    {
        if (!e || !t || !s)
            throw new Error("Godrays requires scene camera, light source and depth texture.");
        const r = new Or(e, new FB(e, t, {
            kernelSize: fr.SMALL,
            ...n
        }));
        return r.needsDepthTexture = !1, r.setDepthTexture(s), r.effects[0].blurPass.kernelSize = n.kernelSize || fr.SMALL, r.fullscreenMaterial.encodeOutput = !1, this._effectComposer.addPass(r), this
    }
    addDOF(e, t, s={})
    {
        if (!e || !t)
            throw new Error("DOF requires scene camera and depth texture.");
        const n = new Or(e, new TB(e, {
            resolutionScale: .5,
            worldFocusDistance: 4,
            worldFocusRange: 10,
            bokehScale: 5,
            ...s
        }));
        return s.cameraTarget && (n.effects[0].target = e.target), n.needsDepthTexture = !1, n.setDepthTexture(t), n.fullscreenMaterial.encodeOutput = !1, this._effectComposer.addPass(n), this
    }
    dispose()
    {
        const e = {
            depthTexture: null,
            dispose: () => {}
        };
        this._effectComposer.inputBuffer = e,
        this._effectComposer.outputBuffer = e,
        this._effectComposer.dispose()
    }
}
nn.enabled = !0;
var iA,
    fE,
    sA,
    pE,
    nA,
    mE,
    lc,
    Tu,
    md,
    rA,
    Ad,
    aA,
    cc,
    gd,
    oA,
    AE;
class GU {
    constructor()
    {
        te(this, iA),
        te(this, sA),
        te(this, nA),
        te(this, lc),
        te(this, md),
        te(this, Ad),
        te(this, cc),
        te(this, oA),
        Oe(this, "canvasCnt", null),
        Oe(this, "canvasNode", null),
        Oe(this, "interactionNode", null),
        Oe(this, "fingers", 1),
        Oe(this, "active", !1),
        Oe(this, "renderer", Je),
        Oe(this, "audio", RU),
        Oe(this, "initialDPR", 1),
        Oe(this, "currentDPR", 1),
        Oe(this, "adaptiveDPR", null),
        Oe(this, "uniforms", _i),
        Oe(this, "UBO", ya),
        Oe(this, "composer", null),
        Oe(this, "renderPass", null)
    }
    async init({canvasCnt: e, shadowMap: t, relativePath: s, shadowMapType: n, interactionNode: r, fingers: a=1, contextMenu: o=!1, DPR: l=1, audioContext: c=!1, adaptiveDPR: h=!0}={})
    {
        await tu.init(),
        ve(this, iA, fE).call(this, s),
        this.canvasCnt = e,
        ve(this, sA, pE).call(this, {
            shadowMap: t,
            shadowMapType: n
        }),
        q.query.renderinfo !== null && tu.showRenderInfo(this.canvasCnt),
        ve(this, nA, mE).call(this),
        this.initialDPR = l,
        this.adaptiveDPR = h ? new UU(this) : null,
        this.setDPRMultiplier(),
        this.fingers = a,
        this.interactionNode = r || this.renderer.domElement,
        $t.init({
            element: this.interactionNode,
            fingers: this.fingers,
            contextMenu: o
        }),
        Px.init({
            element: this.interactionNode
        }),
        Dx.init(),
        c && this.audio.init(),
        ve(this, oA, AE).call(this)
    }
    setDPRMultiplier(e=1)
    {
        this.currentDPR = this.initialDPR * e,
        Q.emit("resize", q.screen.w, q.screen.h)
    }
    setDevScene(e)
    {
        this.setRenderScene(e),
        ve(this, cc, gd).call(this, !0)
    }
    setRenderScene(e)
    {
        this.renderPass.scene = e,
        this.renderPass.camera = e.camera,
        e.composer = this.composer
    }
    dispose({audios: e=!0, geometries: t=!0, textures: s=!0, gltf: n=!0, threeCache: r=!0, renderer: a=!1, input: o=!1, audioContext: l=!1}={})
    {
        var c;
        e && sR(),
        t && ER(),
        s && VR(),
        n && IU(),
        r && nn.clear(),
        a && (tu.hideRenderInfo(), this.active = !1, (c = this.adaptiveDPR) == null || c.stop(), Q.off("resize", ve(this, lc, Tu), this), Q.off("webgl_prerender", ve(this, md, rA), this), Q.off("webgl_render", ve(this, Ad, aA), this), Q.off("webgl_render_active", ve(this, cc, gd), this), this.composer.dispose(), this.composer = null, this.renderPass = null, this.canvasCnt.removeChild(this.canvasNode), this.canvasCnt = null, this.canvasNode = null, this.renderer.dispose()),
        o && ($t.dispose(), Px.dispose(), Dx.dispose(), this.interactionNode = null),
        l && this.audio.dispose()
    }
}
iA = new WeakSet,
fE = function(i) {
    q.setRelativePath(i || ""),
    nR(),
    wR(),
    HR(),
    TU()
},
sA = new WeakSet,
pE = function({shadowMap: i, shadowMapType: e}={}) {
    this.renderer.init({
        shadowMap: i,
        shadowMapType: e
    }),
    this.renderer.info.autoReset = !1;
    {
        const t = document.createElement("div");
        t.attachShadow({
            mode: "closed"
        }).append(this.renderer.domElement),
        this.canvasNode = t
    }
    this.canvasCnt.prepend(this.canvasNode),
    In.detectSupport(this.renderer.webgl)
},
nA = new WeakSet,
mE = function() {
    ve(this, lc, Tu).call(this, q.screen.w, q.screen.h),
    Q.on("resize", ve(this, lc, Tu), this),
    Q.on("webgl_prerender", ve(this, md, rA), this),
    Q.on("webgl_render", ve(this, Ad, aA), this),
    Q.on("webgl_render_active", ve(this, cc, gd), this)
},
lc = new WeakSet,
Tu = function(i, e) {
    _i.resolution.value.set(i, e).multiplyScalar(this.currentDPR).floor(),
    _i.aspect.value = _i.resolution.value.x / _i.resolution.value.y,
    _i.resolutionUI.value.set(i, e),
    this.renderer.webgl.setSize(_i.resolution.value.x, _i.resolution.value.y, !1),
    this.renderer.domElement.style.width = `${i}px`,
    this.renderer.domElement.style.height = `${e}px`
},
md = new WeakSet,
rA = function(i) {
    _i.time.value = i,
    _i.dtRatio.value = ie.deltaRatio()
},
Ad = new WeakSet,
aA = function(i, e) {
    var t,
        s;
    this.active && ((t = this.renderer.info) == null || t.reset(), (s = this.composer) == null || s.render(e))
},
cc = new WeakSet,
gd = function(i) {
    var e;
    i && !((e = this.adaptiveDPR) != null && e.hasRun) && this.adaptiveDPR.start(),
    this.active = i
},
oA = new WeakSet,
AE = function() {
    this.composer = new tA({
        renderToScreen: !0
    });
    const i = new Jo;
    this.renderPass = new dE(i, i.camera, void 0, this.renderer.clearColor, this.renderer.clearAlpha),
    this.composer.addPass(this.renderPass);
    const e = new Fd().addSMAA({
        quality: "high"
    });
    e.isGammaCorrectionPass = !0,
    this.composer.addPass(e)
};
const he = new GU;
var Kr,
    sn,
    xo,
    en,
    er,
    js,
    bn,
    lA,
    Iu,
    hc,
    uc,
    Bu,
    Mn,
    nr,
    Pu,
    cA,
    Du,
    hA,
    Ru,
    uA,
    Uu,
    dA,
    Lu,
    fA;
class HU {
    constructor({camera: e=null, volume: t=1, muted: s=!0}={})
    {
        te(this, uc),
        te(this, Mn),
        te(this, Pu),
        te(this, Du),
        te(this, Ru),
        te(this, Uu),
        te(this, Lu),
        te(this, Kr, null),
        te(this, sn, 1),
        te(this, xo, 0),
        te(this, en, !0),
        te(this, er, q.visible),
        te(this, js, new KI),
        te(this, bn, new Map),
        te(this, lA, .1),
        te(this, Iu, 0),
        te(this, hc, !1),
        et(this, Kr, e),
        U(this, Kr) && U(this, Kr).add(U(this, js)),
        et(this, sn, t),
        et(this, en, s),
        U(this, js).setMasterVolume(U(this, xo)),
        Q.on("visibility_change", ve(this, Pu, cA), this),
        Q.on("webgl_audio_mute_toggle", ve(this, Du, hA), this),
        Q.on("webgl_audio_global_volume", ve(this, Ru, uA), this),
        Q.on("webgl_prerender", ve(this, Uu, dA), this),
        he.audio.contextReady.then(() => {
            U(this, en) && Q.emit("webgl_audio_mute_toggle"),
            ve(this, Mn, nr).call(this, U(this, sn))
        }).catch(() => {
            console.warn("audio failed to set volume")
        })
    }
    get muted()
    {
        return U(this, en)
    }
    addAudio({name: e="default", url: t, volume: s=1, autoPlay: n=!1, loop: r=!1, playbackRate: a=1, offset: o=0, sync: l=!1, syncOffset: c=0, minTimeBetweenPlays: h=0}={})
    {
        return ve(this, Lu, fA).call(this, {
            name: e,
            url: t,
            volume: s,
            autoPlay: n,
            loop: r,
            playbackRate: a,
            offset: o,
            sync: l,
            syncOffset: c,
            minTimeBetweenPlays: h
        })
    }
    addPositionalAudio({name: e="default", url: t, volume: s=1, autoPlay: n=!0, loop: r=!0, playbackRate: a=1, offset: o=0, sync: l=!1, syncOffset: c=0, minTimeBetweenPlays: h=0, refDistance: d=1, rolloffFactor: u=1, distanceModel: f="inverse", maxDistance: p=1e4, directionalCone: A=[360, 0, 0]}={})
    {
        return ve(this, Lu, fA).call(this, {
            name: e,
            url: t,
            volume: s,
            autoPlay: n,
            loop: r,
            playbackRate: a,
            offset: o,
            sync: l,
            syncOffset: c,
            minTimeBetweenPlays: h,
            positional: {
                refDistance: d,
                rolloffFactor: u,
                distanceModel: f,
                maxDistance: p,
                directionalCone: A
            }
        })
    }
    playAudio(e="default", t=0)
    {
        const s = U(this, bn).get(e);
        !s || !ve(this, uc, Bu).call(this) || Fe.time - s._timeLastPlayed > s._minTimeBetweenPlays && (s._timeLastPlayed = Fe.time, s.stop().play(t))
    }
    setAudioVolume(e="default", t=1)
    {
        const s = U(this, bn).get(e);
        s && (s.individualVolume = t, s.setVolume(s.individualVolume))
    }
    async dispose({delay: e=0, duration: t=.35}={})
    {
        Q.off("webgl_audio_global_volume", ve(this, Ru, uA), this),
        e > 0 && await Sc.wait(e),
        et(this, sn, 0),
        ve(this, Mn, nr).call(this, U(this, sn)),
        t > 0 && await Sc.wait(t),
        Q.off("visibility_change", ve(this, Pu, cA), this),
        Q.off("webgl_audio_mute_toggle", ve(this, Du, hA), this),
        Q.off("webgl_prerender", ve(this, Uu, dA), this),
        U(this, js) && (U(this, Kr) && U(this, Kr).remove(U(this, js)), U(this, js).gain.disconnect(he.audio.context.destination)),
        et(this, js, null),
        U(this, bn).clear(),
        et(this, hc, !0)
    }
}
Kr = new WeakMap,
sn = new WeakMap,
xo = new WeakMap,
en = new WeakMap,
er = new WeakMap,
js = new WeakMap,
bn = new WeakMap,
lA = new WeakMap,
Iu = new WeakMap,
hc = new WeakMap,
uc = new WeakSet,
Bu = function() {
    return he.audio.context.state === "running"
},
Mn = new WeakSet,
nr = function(i=1) {
    let e = i;
    (!U(this, er) || U(this, en)) && (e = 0),
    e !== U(this, xo) && (et(this, xo, e), U(this, js).gain.gain.setTargetAtTime(U(this, xo), Math.max(.1, he.audio.context.currentTime), .35))
},
Pu = new WeakSet,
cA = function(i) {
    i ? U(this, er) || (et(this, er, !0), ve(this, Mn, nr).call(this, U(this, sn))) : U(this, er) && (et(this, er, !1), ve(this, Mn, nr).call(this, 0))
},
Du = new WeakSet,
hA = function() {
    et(this, en, !U(this, en)),
    U(this, en) ? ve(this, Mn, nr).call(this, 0) : ve(this, Mn, nr).call(this, U(this, sn)),
    Q.emit("webgl_audio_update_mute", U(this, en))
},
Ru = new WeakSet,
uA = function(i=1) {
    et(this, sn, i),
    ve(this, Mn, nr).call(this, U(this, sn))
},
Uu = new WeakSet,
dA = function() {
    if (!U(this, er) || !ve(this, uc, Bu).call(this))
        return;
    const i = Fe.time - he.audio.context.currentTime,
        e = Math.abs(i - U(this, Iu)) > U(this, lA);
    U(this, bn).forEach(t => {
        t && e && t._animationSync && (t.pause(), t._progress = (Fe.time + t._animationSyncOffset) * t.playbackRate % (t.duration || t.buffer.duration), t.play())
    }),
    e && et(this, Iu, i)
},
Lu = new WeakSet,
fA = async function({name: i, url: e, volume: t, autoPlay: s, loop: n, playbackRate: r, offset: a, sync: o, syncOffset: l, minTimeBetweenPlays: c, positional: h=null}={}) {
    if (U(this, bn).has(i))
        throw new Error(`audio ${i} already exists`);
    U(this, bn).set(i, null);
    try {
        const d = await Ow.load(e);
        if (!d || U(this, hc))
            return;
        const u = new (h ? jI : $y)(U(this, js));
        return u.setBuffer(d), u.setLoop(n), u.setPlaybackRate(r), u.offset = a, u._animationSync = o, u._animationSyncOffset = l, u._minTimeBetweenPlays = c, u._timeLastPlayed = 0, h && (u.setRefDistance(h.refDistance), u.setRolloffFactor(h.rolloffFactor), u.setDistanceModel(h.distanceModel), u.setMaxDistance(h.maxDistance), u.setDirectionalCone(...h.directionalCone)), u.individualVolume = t, u.setVolume(u.individualVolume), s && he.audio.contextReady.then(() => {
            ve(this, uc, Bu).call(this) && !U(this, hc) && u.play()
        }).catch(() => {
            console.warn(`audio ${i} failed to play`)
        }), U(this, bn).set(i, u), u
    } catch (d) {
        console.log(d)
    }
};
class VU extends _r {
    constructor(e={})
    {
        super({
            name: "FLUID_CLEAR",
            uniforms: {
                texelSize: {
                    value: new H
                },
                uTexture: {
                    value: null
                },
                value: {
                    value: e.pressureDissipation
                }
            },
            vertexShader: `
                            precision ${e.highPrecision} float;

                            attribute vec3 position;
                            attribute vec2 uv;

                            varying vec2 vUv;

                            void main () {
                                vUv = uv;
                                gl_Position = vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            precision ${e.mediumPrecision} float;
                            precision ${e.mediumPrecision} sampler2D;

                            uniform sampler2D uTexture;
                            uniform float value;

                            varying highp vec2 vUv;

                            void main () {
                                gl_FragColor.rgb = value * texture2D(uTexture, vUv).rgb;
                                gl_FragColor.a = 1.0;
                            }
                        `,
            depthTest: !1,
            depthWrite: !1
        })
    }
}
class WU extends _r {
    constructor(e={})
    {
        super({
            name: "FLUID_SPLAT",
            uniforms: {
                texelSize: {
                    value: new H
                },
                uTarget: {
                    value: null
                },
                aspectRatio: {
                    value: 1
                },
                color: {
                    value: new b
                },
                point: {
                    value: new H
                },
                prevPoint: {
                    value: new H
                },
                radius: {
                    value: 1
                },
                isDye: {
                    value: !1
                }
            },
            vertexShader: `
                            precision ${e.highPrecision} float;

                            attribute vec3 position;
                            attribute vec2 uv;

                            varying vec2 vUv;

                            void main () {
                                vUv = uv;
                                gl_Position = vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            precision ${e.highPrecision} float;
                            precision ${e.highPrecision} sampler2D;

                            ${e.splatMode === 1 ? "#define SPLAT_DOT" : ""}

                            uniform sampler2D uTarget;
                            uniform float aspectRatio;
                            uniform vec3 color;
                            uniform vec2 point;
                            uniform vec2 prevPoint;
                            uniform float radius;
                            uniform bool isDye;

                            varying vec2 vUv;

                            float line(vec2 uv, vec2 point1, vec2 point2) {
                                vec2 pa = uv - point1, ba = point2 - point1;
                                pa.x *= aspectRatio;
                                ba.x *= aspectRatio;
                                float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                                return length(pa - ba * h);
                            }

                            float cubicIn(float t) {
                                return t * t * t;
                            }

                            void main () {
                                #ifdef SPLAT_DOT
                                    vec2 p = vUv - point.xy;
                                    p.x *= aspectRatio;
                                    vec3 splat = exp(-dot(p, p) / (radius / 50.0)) * color; // vec3 splat = exp(-dot(p, p) / radius) * color;
                                #else
                                    vec3 splat = cubicIn(clamp(1.0 - line(vUv, prevPoint.xy, point.xy) / radius, 0.0, 1.0)) * color;
                                #endif

                                vec3 base = texture2D(uTarget, vUv).xyz;
                                vec3 result = base + splat;
                                if (isDye) result = clamp(result, vec3(0.0), vec3(1.0));

                                gl_FragColor = vec4(result, 1.0);
                            }
                        `,
            depthTest: !1,
            depthWrite: !1
        })
    }
}
class YU extends _r {
    constructor(e={})
    {
        super({
            name: "FLUID_CURL",
            uniforms: {
                texelSize: {
                    value: new H
                },
                uVelocity: {
                    value: null
                }
            },
            vertexShader: `
                            precision ${e.highPrecision} float;

                            attribute vec3 position;
                            attribute vec2 uv;

                            uniform vec2 texelSize;

                            varying vec2 vL;
                            varying vec2 vR;
                            varying vec2 vT;
                            varying vec2 vB;

                            void main () {
                                vL = uv - vec2(texelSize.x, 0.0);
                                vR = uv + vec2(texelSize.x, 0.0);
                                vT = uv + vec2(0.0, texelSize.y);
                                vB = uv - vec2(0.0, texelSize.y);
                                gl_Position = vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            precision ${e.mediumPrecision} float;
                            precision ${e.mediumPrecision} sampler2D;

                            uniform sampler2D uVelocity;

                            varying highp vec2 vL;
                            varying highp vec2 vR;
                            varying highp vec2 vT;
                            varying highp vec2 vB;

                            void main () {
                                float L = texture2D(uVelocity, vL).y;
                                float R = texture2D(uVelocity, vR).y;
                                float T = texture2D(uVelocity, vT).x;
                                float B = texture2D(uVelocity, vB).x;
                                float vorticity = R - L - T + B;
                                gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
                            }
                        `,
            depthTest: !1,
            depthWrite: !1
        })
    }
}
class qU extends _r {
    constructor(e={})
    {
        super({
            name: "FLUID_VORTICITY",
            uniforms: {
                texelSize: {
                    value: new H
                },
                uVelocity: {
                    value: null
                },
                uCurl: {
                    value: null
                },
                curl: {
                    value: e.curlStrength
                },
                dt: {
                    value: 1 / 60
                }
            },
            vertexShader: `
                            precision ${e.highPrecision} float;

                            attribute vec3 position;
                            attribute vec2 uv;

                            uniform vec2 texelSize;

                            varying vec2 vUv;
                            varying vec2 vL;
                            varying vec2 vR;
                            varying vec2 vT;
                            varying vec2 vB;

                            void main () {
                                vUv = uv;
                                vL = vUv - vec2(texelSize.x, 0.0);
                                vR = vUv + vec2(texelSize.x, 0.0);
                                vT = vUv + vec2(0.0, texelSize.y);
                                vB = vUv - vec2(0.0, texelSize.y);
                                gl_Position = vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            precision ${e.highPrecision} float;
                            precision ${e.highPrecision} sampler2D;

                            uniform sampler2D uVelocity;
                            uniform sampler2D uCurl;
                            uniform float curl;
                            uniform float dt;

                            varying vec2 vUv;
                            varying vec2 vL;
                            varying vec2 vR;
                            varying vec2 vT;
                            varying vec2 vB;

                            void main () {
                                float L = texture2D(uCurl, vL).x;
                                float R = texture2D(uCurl, vR).x;
                                float T = texture2D(uCurl, vT).x;
                                float B = texture2D(uCurl, vB).x;
                                float C = texture2D(uCurl, vUv).x;
                                vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
                                force /= length(force) + 0.0001;
                                force *= curl * C;
                                force.y *= -1.0;
                                vec2 vel = texture2D(uVelocity, vUv).xy;
                                gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
                            }
                        `,
            depthTest: !1,
            depthWrite: !1
        })
    }
}
class XU extends _r {
    constructor(e={})
    {
        super({
            name: "FLUID_DIVERGENCE",
            uniforms: {
                texelSize: {
                    value: new H
                },
                uVelocity: {
                    value: null
                }
            },
            vertexShader: `
                            precision ${e.highPrecision} float;

                            attribute vec3 position;
                            attribute vec2 uv;

                            uniform vec2 texelSize;

                            varying vec2 vUv;
                            varying vec2 vL;
                            varying vec2 vR;
                            varying vec2 vT;
                            varying vec2 vB;

                            void main () {
                                vUv = uv;
                                vL = vUv - vec2(texelSize.x, 0.0);
                                vR = vUv + vec2(texelSize.x, 0.0);
                                vT = vUv + vec2(0.0, texelSize.y);
                                vB = vUv - vec2(0.0, texelSize.y);
                                gl_Position = vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            precision ${e.mediumPrecision} float;
                            precision ${e.mediumPrecision} sampler2D;
                            ${e.borders ? "#define LIMIT_BORDERS" : ""}

                            uniform sampler2D uVelocity;

                            varying highp vec2 vUv;
                            varying highp vec2 vL;
                            varying highp vec2 vR;
                            varying highp vec2 vT;
                            varying highp vec2 vB;

                            void main () {
                                float L = texture2D(uVelocity, vL).x;
                                float R = texture2D(uVelocity, vR).x;
                                float T = texture2D(uVelocity, vT).y;
                                float B = texture2D(uVelocity, vB).y;
                                vec2 C = texture2D(uVelocity, vUv).xy;

                                #ifdef LIMIT_BORDERS
                                    if (vL.x < 0.0) { L = -C.x; }
                                    if (vR.x > 1.0) { R = -C.x; }
                                    if (vT.y > 1.0) { T = -C.y; }
                                    if (vB.y < 0.0) { B = -C.y; }
                                #endif

                                float div = 0.5 * (R - L + T - B);
                                gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
                            }
                        `,
            depthTest: !1,
            depthWrite: !1
        })
    }
}
class KU extends _r {
    constructor(e={})
    {
        super({
            name: "FLUID_PRESSURE",
            uniforms: {
                texelSize: {
                    value: new H
                },
                uPressure: {
                    value: null
                },
                uDivergence: {
                    value: null
                }
            },
            vertexShader: `
                            precision ${e.highPrecision} float;

                            attribute vec3 position;
                            attribute vec2 uv;

                            uniform vec2 texelSize;

                            varying vec2 vUv;
                            varying vec2 vL;
                            varying vec2 vR;
                            varying vec2 vT;
                            varying vec2 vB;

                            void main () {
                                vUv = uv;
                                vL = vUv - vec2(texelSize.x, 0.0);
                                vR = vUv + vec2(texelSize.x, 0.0);
                                vT = vUv + vec2(0.0, texelSize.y);
                                vB = vUv - vec2(0.0, texelSize.y);
                                gl_Position = vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            precision ${e.mediumPrecision} float;
                            precision ${e.mediumPrecision} sampler2D;

                            uniform sampler2D uPressure;
                            uniform sampler2D uDivergence;

                            varying highp vec2 vUv;
                            varying highp vec2 vL;
                            varying highp vec2 vR;
                            varying highp vec2 vT;
                            varying highp vec2 vB;

                            void main () {
                                float L = texture2D(uPressure, vL).x;
                                float R = texture2D(uPressure, vR).x;
                                float T = texture2D(uPressure, vT).x;
                                float B = texture2D(uPressure, vB).x;
                                float C = texture2D(uPressure, vUv).x;
                                float divergence = texture2D(uDivergence, vUv).x;
                                float pressure = (L + R + B + T - divergence) * 0.25;
                                gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
                            }
                        `,
            depthTest: !1,
            depthWrite: !1
        })
    }
}
class JU extends _r {
    constructor(e={})
    {
        super({
            name: "FLUID_GRADIENT_SUBSTRACT",
            uniforms: {
                texelSize: {
                    value: new H
                },
                uPressure: {
                    value: null
                },
                uVelocity: {
                    value: null
                }
            },
            vertexShader: `
                            precision ${e.highPrecision} float;

                            attribute vec3 position;
                            attribute vec2 uv;

                            uniform vec2 texelSize;

                            varying vec2 vUv;
                            varying vec2 vL;
                            varying vec2 vR;
                            varying vec2 vT;
                            varying vec2 vB;

                            void main () {
                                vUv = uv;
                                vL = vUv - vec2(texelSize.x, 0.0);
                                vR = vUv + vec2(texelSize.x, 0.0);
                                vT = vUv + vec2(0.0, texelSize.y);
                                vB = vUv - vec2(0.0, texelSize.y);
                                gl_Position = vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            precision ${e.mediumPrecision} float;
                            precision ${e.mediumPrecision} sampler2D;

                            uniform sampler2D uPressure;
                            uniform sampler2D uVelocity;

                            varying highp vec2 vUv;
                            varying highp vec2 vL;
                            varying highp vec2 vR;
                            varying highp vec2 vT;
                            varying highp vec2 vB;

                            void main () {
                                float L = texture2D(uPressure, vL).x;
                                float R = texture2D(uPressure, vR).x;
                                float T = texture2D(uPressure, vT).x;
                                float B = texture2D(uPressure, vB).x;
                                vec2 velocity = texture2D(uVelocity, vUv).xy;
                                velocity.xy -= vec2(R - L, T - B);
                                gl_FragColor = vec4(velocity, 0.0, 1.0);
                            }
                        `,
            depthTest: !1,
            depthWrite: !1
        })
    }
}
class jU extends _r {
    constructor(e={})
    {
        super({
            name: "FLUID_ADVECTION",
            uniforms: {
                texelSize: {
                    value: new H
                },
                dyeTexelSize: {
                    value: new H().setScalar(1 / e.dyeRes)
                },
                uVelocity: {
                    value: null
                },
                uSource: {
                    value: null
                },
                dt: {
                    value: 1 / 60
                },
                dissipation: {
                    value: 1
                }
            },
            vertexShader: `
                            precision ${e.highPrecision} float;

                            attribute vec3 position;
                            attribute vec2 uv;

                            varying vec2 vUv;

                            void main () {
                                vUv = uv;
                                gl_Position = vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            precision ${e.highPrecision} float;
                            precision ${e.highPrecision} sampler2D;
                            ${e.linearFilteringSupported ? "" : "#define MANUAL_FILTERING"}

                            uniform sampler2D uVelocity;
                            uniform sampler2D uSource;
                            uniform vec2 texelSize;
                            uniform vec2 dyeTexelSize;
                            uniform float dt;
                            uniform float dissipation;

                            varying vec2 vUv;

                            vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
                                vec2 st = uv / tsize - 0.5;
                                vec2 iuv = floor(st);
                                vec2 fuv = fract(st);
                                vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
                                vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
                                vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
                                vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
                                return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
                            }

                            void main () {
                                vec4 result;

                                #ifdef MANUAL_FILTERING
                                    vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                                    result = bilerp(uSource, coord, dyeTexelSize);
                                #else
                                    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                                    result = texture2D(uSource, coord);
                                #endif

                                gl_FragColor.rgb = result.rgb * dissipation;
                                gl_FragColor.a = 1.0;
                            }
                        `,
            depthTest: !1,
            depthWrite: !1
        })
    }
}
const Us = {
        SIMULATION_RESOLUTION: 128,
        DYE_RESOLUTION: 512,
        DENSITY_DISSIPATION: .97,
        VELOCITY_DISSIPATION: .98,
        PRESSURE_DISSIPATION: .8,
        PRESSURE_ITERATIONS: 3,
        CURL_STRENGTH: 10,
        SPLAT_RADIUS: .12,
        SPLAT_RADIUS_VELOCITY: !0,
        SPLAT_FORCE: 50,
        BORDERS: !1
    },
    Al = {
        SCREEN: 1,
        CUSTOM: 2
    },
    ZU = {
        DOT: 1,
        LINE: 2
    },
    bh = new H;
function lp(i, e, t) {
    const s = new vt(i, i, {
            format: e,
            type: Mi,
            magFilter: t,
            minFilter: t,
            depthBuffer: !1
        }),
        n = s.clone(),
        r = {
            read: s,
            write: n,
            swap: () => {
                const a = r.read;
                r.read = r.write,
                r.write = a
            }
        };
    return r
}
class $U {
    constructor({simRes: e=Us.SIMULATION_RESOLUTION, dyeRes: t=Us.DYE_RESOLUTION, pressureIteration: s=Us.PRESSURE_ITERATIONS, densityDissipation: n=Us.DENSITY_DISSIPATION, velocityDissipation: r=Us.VELOCITY_DISSIPATION, pressureDissipation: a=Us.PRESSURE_DISSIPATION, curlStrength: o=Us.CURL_STRENGTH, splatRadius: l=Us.SPLAT_RADIUS, splatRadiusVelocity: c=Us.SPLAT_RADIUS_VELOCITY, splatForce: h=Us.SPLAT_FORCE, splatMode: d="line", borders: u=Us.BORDERS, mode: f="screen", fingers: p=he.fingers}={})
    {
        this.isFluid = !0,
        this._linearFilteringSupported = Je.webgl.capabilities.floatLinearFiltering,
        this._simRes = e,
        this._dyeRes = t,
        this._simTexelSize = 1 / this._simRes,
        this._dyeTexelSize = 1 / this._dyeRes,
        this._pressureIterations = s,
        this._densityDissipation = n,
        this._velocityDissipation = r,
        this._pressureDissipation = a,
        this._curlStrength = o,
        this._splatRadius = l,
        this._splatRadiusVelocity = c,
        this._splatForce = h,
        this._splatMode = ZU[d.toUpperCase()],
        this._borders = u,
        this._mode = Al[f.toUpperCase()],
        this._aspect = 1,
        this._fingers = Math.min(p, this._mode === Al.SCREEN ? he.fingers : 1 / 0),
        this._enabled = !1,
        this.points = Array.from(Array(this._fingers), () => ({
            position: new H(.5, .5),
            prevPosition: new H(.5, .5),
            lastUpdate: 0,
            lastSplat: 0,
            velocity: 0
        })),
        this._createRTs(),
        this._createMaterials(),
        this._createScene(),
        this.dyeUniform = {
            value: null
        },
        this.velUniform = {
            value: null
        },
        this.enable()
    }
    _createRTs()
    {
        this._density = lp(this._dyeRes, wt, this._linearFilteringSupported ? _t : gt),
        this._velocity = lp(this._simRes, wt, this._linearFilteringSupported ? _t : gt),
        this._pressure = lp(this._simRes, wt, gt);
        const e = {
            type: Mi,
            magFilter: gt,
            minFilter: gt,
            depthBuffer: !1
        };
        this._divergence = new vt(this._simRes, this._simRes, e),
        this._curl = new vt(this._simRes, this._simRes, e)
    }
    _createMaterials()
    {
        const e = Je.webgl.capabilities,
            t = e.getMaxPrecision("highp"),
            s = e.getMaxPrecision("mediump");
        this._materialClear = new VU({
            highPrecision: t,
            mediumPrecision: s,
            pressureDissipation: this._pressureDissipation
        }),
        this._materialSplat = new WU({
            highPrecision: t,
            mediumPrecision: s,
            splatMode: this._splatMode
        }),
        this._materialCurl = new YU({
            highPrecision: t,
            mediumPrecision: s
        }),
        this._materialVorticity = new qU({
            highPrecision: t,
            mediumPrecision: s,
            curlStrength: this._curlStrength
        }),
        this._materialDivergence = new XU({
            highPrecision: t,
            mediumPrecision: s,
            borders: this._borders
        }),
        this._materialPressure = new KU({
            highPrecision: t,
            mediumPrecision: s
        }),
        this._materialGradientSubstract = new JU({
            highPrecision: t,
            mediumPrecision: s
        }),
        this._materialAdvection = new jU({
            highPrecision: t,
            mediumPrecision: s,
            dyeRes: this._dyeRes,
            linearFilteringSupported: this._linearFilteringSupported
        })
    }
    _createScene()
    {
        this._scene = new No,
        this._camera = new Ln(-1, 1, 1, -1, 0, 1),
        this._mesh = new Ce(Si.triangle, this._materialClear),
        this._mesh.frustumCulled = !1,
        this._scene.add(this._mesh)
    }
    _update(e, t)
    {
        this._mode === Al.SCREEN && (this._aspect = he.uniforms.resolution.value.x / he.uniforms.resolution.value.y);
        const s = Je.webgl.autoClear,
            n = Je.webgl.getRenderTarget();
        Je.webgl.autoClear = !1,
        this.points.forEach(a => {
            if (e - a.lastUpdate < .016)
                return;
            bh.subVectors(a.position, a.prevPosition);
            const o = bh.length();
            if (a.velocity += o * 2, o > 0) {
                const l = e - a.lastSplat > .15;
                this._mesh.material = this._materialSplat,
                this._materialSplat.uniforms.isDye.value = !1,
                this._materialSplat.uniforms.uTarget.value = this._velocity.read.texture,
                this._materialSplat.uniforms.aspectRatio.value = this._aspect,
                this._materialSplat.uniforms.point.value.copy(a.position),
                this._materialSplat.uniforms.prevPoint.value.copy(l ? a.position : a.prevPosition),
                this._materialSplat.uniforms.color.value.set(bh.x * this._aspect, bh.y, 0).multiplyScalar(this._splatForce).multiplyScalar(l ? 0 : 1),
                this._materialSplat.uniforms.radius.value = this._splatRadius * (this._splatRadiusVelocity ? a.velocity : 1),
                Je.webgl.setRenderTarget(this._velocity.write),
                Je.webgl.render(this._scene, this._camera),
                this._velocity.swap(),
                this._materialSplat.uniforms.isDye.value = !0,
                this._materialSplat.uniforms.uTarget.value = this._density.read.texture,
                this._materialSplat.uniforms.color.value.setScalar(1),
                Je.webgl.setRenderTarget(this._density.write),
                Je.webgl.render(this._scene, this._camera),
                this._density.swap(),
                a.lastSplat = e
            }
            a.lastUpdate = e,
            a.prevPosition.copy(a.position),
            a.velocity *= .9,
            a.velocity = Math.min(1, a.velocity)
        });
        const r = ie.deltaRatio();
        this._mesh.material = this._materialCurl,
        this._materialCurl.uniforms.texelSize.value.setScalar(this._simTexelSize),
        this._materialCurl.uniforms.uVelocity.value = this._velocity.read.texture,
        Je.webgl.setRenderTarget(this._curl),
        Je.webgl.render(this._scene, this._camera),
        this._mesh.material = this._materialVorticity,
        this._materialVorticity.uniforms.texelSize.value.setScalar(this._simTexelSize),
        this._materialVorticity.uniforms.uVelocity.value = this._velocity.read.texture,
        this._materialVorticity.uniforms.uCurl.value = this._curl.texture,
        this._materialVorticity.uniforms.curl.value = this._curlStrength,
        this._materialVorticity.uniforms.dt.value = r,
        Je.webgl.setRenderTarget(this._velocity.write),
        Je.webgl.render(this._scene, this._camera),
        this._velocity.swap(),
        this._mesh.material = this._materialDivergence,
        this._materialDivergence.uniforms.texelSize.value.setScalar(this._simTexelSize),
        this._materialDivergence.uniforms.uVelocity.value = this._velocity.read.texture,
        Je.webgl.setRenderTarget(this._divergence),
        Je.webgl.render(this._scene, this._camera),
        this._mesh.material = this._materialClear,
        this._materialClear.uniforms.uTexture.value = this._pressure.read.texture,
        this._materialClear.uniforms.value.value = ie.frictionFPS(this._pressureDissipation),
        Je.webgl.setRenderTarget(this._pressure.write),
        Je.webgl.render(this._scene, this._camera),
        this._pressure.swap(),
        this._mesh.material = this._materialPressure,
        this._materialPressure.uniforms.texelSize.value.setScalar(this._simTexelSize),
        this._materialPressure.uniforms.uDivergence.value = this._divergence.texture;
        for (let a = 0; a < this._pressureIterations; a++)
            this._materialPressure.uniforms.uPressure.value = this._pressure.read.texture,
            Je.webgl.setRenderTarget(this._pressure.write),
            Je.webgl.render(this._scene, this._camera),
            this._pressure.swap();
        this._mesh.material = this._materialGradientSubstract,
        this._materialGradientSubstract.uniforms.texelSize.value.setScalar(this._simTexelSize),
        this._materialGradientSubstract.uniforms.uPressure.value = this._pressure.read.texture,
        this._materialGradientSubstract.uniforms.uVelocity.value = this._velocity.read.texture,
        Je.webgl.setRenderTarget(this._velocity.write),
        Je.webgl.render(this._scene, this._camera),
        this._velocity.swap(),
        this._mesh.material = this._materialAdvection,
        this._materialAdvection.uniforms.texelSize.value.setScalar(this._simTexelSize),
        this._materialAdvection.uniforms.dyeTexelSize.value.setScalar(this._simTexelSize),
        this._materialAdvection.uniforms.uVelocity.value = this._velocity.read.texture,
        this._materialAdvection.uniforms.uSource.value = this._velocity.read.texture,
        this._materialAdvection.uniforms.dt.value = r,
        this._materialAdvection.uniforms.dissipation.value = ie.frictionFPS(this._velocityDissipation),
        Je.webgl.setRenderTarget(this._velocity.write),
        Je.webgl.render(this._scene, this._camera),
        this._velocity.swap(),
        this._materialAdvection.uniforms.dyeTexelSize.value.setScalar(this._dyeTexelSize),
        this._materialAdvection.uniforms.uVelocity.value = this._velocity.read.texture,
        this._materialAdvection.uniforms.uSource.value = this._density.read.texture,
        this._materialAdvection.uniforms.dissipation.value = ie.frictionFPS(this._densityDissipation),
        Je.webgl.setRenderTarget(this._density.write),
        Je.webgl.render(this._scene, this._camera),
        this._density.swap(),
        Je.webgl.autoClear = s,
        Je.webgl.setRenderTarget(n),
        this.dyeUniform.value = this._density.read.texture,
        this.velUniform.value = this._velocity.read.texture
    }
    _moveFinger(e)
    {
        this.points[e.finger].position.copy(e.position01)
    }
    enable()
    {
        if (!this._enabled && (this._enabled = !0, Q.on("webgl_prerender", this._update, this), this._mode === Al.SCREEN))
            for (let e = 0; e < this._fingers; e++)
                Q.on(`touch${e === 0 ? "" : e + 1}_start`, this._moveFinger, this),
                Q.on(`touch${e === 0 ? "" : e + 1}_move`, this._moveFinger, this)
    }
    disable()
    {
        if (this._enabled && (this._enabled = !1, Q.off("webgl_prerender", this._update, this), this._mode === Al.SCREEN))
            for (let e = 0; e < this._fingers; e++)
                Q.off(`touch${e === 0 ? "" : e + 1}_start`, this._moveFinger, this),
                Q.off(`touch${e === 0 ? "" : e + 1}_move`, this._moveFinger, this)
    }
    debug() {}
    dispose()
    {
        this.disable(),
        this._materialClear.dispose(),
        this._materialSplat.dispose(),
        this._materialCurl.dispose(),
        this._materialVorticity.dispose(),
        this._materialDivergence.dispose(),
        this._materialPressure.dispose(),
        this._materialGradientSubstract.dispose(),
        this._materialAdvection.dispose(),
        [this._density, this._velocity, this._pressure].forEach(e => e.read.dispose() && e.write.dispose()),
        this._divergence.dispose(),
        this._curl.dipose()
    }
}
const e3 = new bi,
    t3 = new Vt;
var as,
    vd;
const pA = class qi {
    constructor({meshes: e=[], camera: t=null, onHover: s=null, onTouch: n=null, onMove: r=null, onDrag: a=null, onClick: o=null, ctx: l=null, performant: c=!1, performantMode: h="bounding_sphere", finger: d=0, interactWhileTouching: u=!1, hoverCursor: f=!1, grabCursor: p=!1}={})
    {
        if (!t)
            throw new Error("mesh interaction needs a camera");
        this._meshes = Array.isArray(e) ? e : [e],
        this._camera = t,
        this._onHover = s,
        this._onTouch = n,
        this._onMove = r,
        this._onDrag = a,
        this._onClick = o,
        this._ctx = l,
        this._performant = c,
        this._performantMode = U(qi, vd)[h.toUpperCase()],
        this._finger = d,
        this._eventsID = this._finger === 0 ? "touch" : `touch${this._finger + 1}`,
        this._interactWhileTouching = u,
        this._touchPressed = !1,
        this._hoverCursor = f,
        this._grabCursor = p && !f,
        this._raycaster = new e_,
        this._enabled = !1,
        this.hovering = !1,
        this.hoveringElement = -1,
        this.hoveringInstance = -1,
        this.touching = !1,
        this.touchingElement = -1,
        this.touchingInstance = -1,
        this.dragging = !1
    }
    _castRay(e, t)
    {
        if (this._raycaster.setFromCamera(e.position11, this._camera), !this._performant)
            return this._checkIntersections(t, this._raycaster.intersectObjects(this._meshes, !1));
        const s = [],
            n = this._performantMode === U(qi, vd).BOUNDING_SPHERE,
            r = n ? e3 : t3,
            a = n ? "Sphere" : "Box",
            o = `bounding${a}`,
            l = `computeBounding${a}`,
            c = `intersects${a}`;
        this._meshes.forEach(h => {
            if (!h.isMesh && !h.isSpecialCaseemptyMesh || !h.layers.test(this._raycaster.layers))
                return;
            const d = h[o] !== void 0 ? h : h.geometry;
            d[o] === null && d[l](),
            this._raycaster.ray[c](r.copy(d[o]).applyMatrix4(h.matrixWorld)) && s.push({
                object: h
            })
        }),
        this._checkIntersections(t, s)
    }
    _performHover(e=[], t="hover_out", s=null, n=-1)
    {
        this.hovering = t === "hover_in",
        this.hoveringElement = s,
        this.hoveringInstance = n,
        this._callBack(this._onHover, t, e),
        this._hoverCursor && (he.interactionNode.style.cursor = this.hovering ? "pointer" : ""),
        this._grabCursor && !this.dragging && (he.interactionNode.style.cursor = this.hovering ? "grab" : "")
    }
    _performTouch(e=[], t="touch_end", s=null, n=-1)
    {
        this.touching = t === "touch_start",
        this.touchingElement = s,
        this.touchingInstance = n,
        this._callBack(this._onTouch, t, e),
        this._grabCursor && (he.interactionNode.style.cursor = this.touching ? "grabbing" : this.hovering ? "grab" : "")
    }
    _checkIntersections(e, t)
    {
        if (t.length > 0)
            if (e === U(qi, as).TOUCH_START || e === U(qi, as).TOUCH_MOVE) {
                const s = this._meshes.indexOf(t[0].object),
                    n = typeof t[0].instanceId == "number" ? t[0].instanceId : -1;
                this.hovering && (this.hoveringElement !== s || this.hoveringInstance !== n) && this._performHover(),
                !this.hovering && (this._interactWhileTouching || !this._touchPressed) && this._performHover(t, "hover_in", s, n),
                e === U(qi, as).TOUCH_START ? (this.touching && (this.touchingElement !== s || this.touchingInstance !== n) && this._performTouch(), !this.touching && (this._interactWhileTouching || !this._touchPressed) && (this._performTouch(t, "touch_start", s, n), this.dragging = !0)) : this._callBack(this._onMove, "move", t)
            } else
                e === U(qi, as).CLICK && this._callBack(this._onClick, "click", t);
        else
            this.hovering && this._performHover();
        e === U(qi, as).TOUCH_END && (this.hovering && $t.get(this._finger).currentInput === "touch" && this._performHover(), this.touching && this._performTouch(), this.dragging = !1),
        e === U(qi, as).TOUCH_MOVE && this.dragging && this._callBack(this._onDrag, "drag", t)
    }
    _callBack(e, t, s)
    {
        e && e.call(this._ctx, {
            action: t,
            finger: this._finger,
            interactions: s,
            event: $t.get(this._finger)
        })
    }
    _onTouchStart(e)
    {
        this._castRay(e, U(qi, as).TOUCH_START),
        this._touchPressed = !0
    }
    _onTouchMove(e)
    {
        this._castRay(e, U(qi, as).TOUCH_MOVE)
    }
    _onTouchEnd(e)
    {
        this._touchPressed = !1,
        this._castRay(e, U(qi, as).TOUCH_END)
    }
    _onTouchClick(e)
    {
        this._castRay(e, U(qi, as).CLICK)
    }
    enable()
    {
        this._enabled || (this._enabled = !0, (this._onTouch || this._onHover || this._onDrag) && Q.on(`${this._eventsID}_start`, this._onTouchStart, this), (this._onHover || this._onMove || this._onDrag) && Q.on(`${this._eventsID}_move`, this._onTouchMove, this), (this._onTouch || this._onHover || this._onDrag) && Q.on(`${this._eventsID}_end`, this._onTouchEnd, this), this._onClick && Q.on(`${this._eventsID}_click`, this._onTouchClick, this), this._onTouchMove($t.get(this._finger)))
    }
    disable()
    {
        this._enabled && (this._enabled = !1, this._touchPressed = !1, Q.off(`${this._eventsID}_start`, this._onTouchStart, this), Q.off(`${this._eventsID}_move`, this._onTouchMove, this), Q.off(`${this._eventsID}_end`, this._onTouchEnd, this), Q.off(`${this._eventsID}_click`, this._onTouchClick, this), this._checkIntersections(U(qi, as).TOUCH_END, []))
    }
    dispose()
    {
        this.disable()
    }
}
;
as = new WeakMap,
vd = new WeakMap,
te(pA, as, {
    TOUCH_START: 1,
    TOUCH_MOVE: 2,
    TOUCH_END: 3,
    CLICK: 4
}),
te(pA, vd, {
    BOUNDING_SPHERE: 1,
    BOUNDING_BOX: 2
});
let Er = pA;
new b;
new b;
new De;
new De;
new Z;
new Z("#000000");
function i3(i, e) {
    return new fe({
        ...e,
        depthWrite: typeof e.depthWrite < "u" ? e.depthWrite : !1,
        transparent: typeof e.transparent < "u" ? e.transparent : !0,
        defines: {
            OUTLINE: e.defines && e.defines.OUTLINE || !1,
            ANIMATION_MASK: e.defines && e.defines.ANIMATION_MASK || !1,
            ANIMATION_TRANSLATE: e.defines && e.defines.ANIMATION_TRANSLATE || !1
        },
        uniforms: {
            tMap: {
                value: le.load(`../fonts/${i}-datatexture.ktx2`, "data")
            },
            uColor: {
                value: new Z("#ffffff")
            },
            uAlpha: {
                value: 1
            },
            uOutlineWidth: {
                value: .05
            },
            uAnimationOrder: {
                value: 0
            },
            uAnimationDirection: {
                value: new H(0, e.defines && e.defines.ANIMATION_TRANSLATE ? -1 : 1)
            },
            uAnimationAmount: {
                value: 1
            },
            uAnimationMargin: {
                value: e.animationMargin || .5
            },
            uAnimationProgress: {
                value: 0
            },
            ...e.uniforms
        },
        vertexShader: e.vertexShader || `
                    //- edit

                    varying vec2 vUv;

                    #ifdef ANIMATION_TRANSLATE
                        attribute vec2 textWeights;
                        attribute vec3 lineWeights;
                        uniform vec2 uAnimationDirection;
                        uniform float uAnimationAmount;
                        uniform float uAnimationOrder;
                        uniform float uAnimationMargin;
                        uniform float uAnimationProgress;
                        varying float vAlpha;
                        ${Ue}
                    #endif

                    #ifdef ANIMATION_MASK
                        attribute vec2 textWeights;
                        attribute vec3 lineWeights;
                        attribute vec4 uvMask;
                        varying vec2 vTextWeights;
                        varying vec3 vLineWeights;
                        varying vec4 vUVMask;
                    #endif

                    void main() {
                        vUv = uv;
                        vec3 pos = position;

                        #ifdef ANIMATION_TRANSLATE
                            float weight = 0.0;

                            #if ANIMATION_TRANSLATE == 1
                                weight = textWeights.x;
                            #elif ANIMATION_TRANSLATE == 2
                                weight = textWeights.y;
                            #elif ANIMATION_TRANSLATE == 3
                                weight = lineWeights.x;
                            #elif ANIMATION_TRANSLATE == 4
                                weight = lineWeights.y;
                            #elif ANIMATION_TRANSLATE == 5
                                weight = lineWeights.z;
                            #endif

                            vAlpha = falloffsmooth(abs(uAnimationOrder - weight), 0.0, 1.0, uAnimationMargin, clamp(uAnimationProgress, 0.0, 1.0));
                            pos += vec3(uAnimationDirection, 0.0) * uAnimationAmount * (1.0 - vAlpha);
                        #endif

                        #ifdef ANIMATION_MASK
                            vTextWeights = textWeights;
                            vLineWeights = lineWeights;
                            vUVMask = uvMask;
                        #endif

                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
        fragmentShader: e.fragmentShader || `
                    //- edit

                    ${ii}

                    uniform sampler2D tMap;
                    uniform vec3 uColor;
                    uniform float uAlpha;

                    varying vec2 vUv;

                    #ifdef OUTLINE
                        uniform float uOutlineWidth;
                    #endif

                    #ifdef ANIMATION_TRANSLATE
                        varying float vAlpha;
                    #endif

                    #ifdef ANIMATION_MASK
                        uniform vec2 uAnimationDirection;
                        uniform float uAnimationAmount;
                        uniform float uAnimationOrder;
                        uniform float uAnimationMargin;
                        uniform float uAnimationProgress;
                        varying vec2 vTextWeights;
                        varying vec3 vLineWeights;
                        varying vec4 vUVMask;
                        ${Ue}
                    #endif

                    void main() {
                        vec2 uv = vUv;
                        float alpha = uAlpha;

                        #ifdef ANIMATION_MASK
                            float weight = 0.0;

                            #if ANIMATION_MASK == 1
                                weight = vTextWeights.x;
                            #elif ANIMATION_MASK == 2
                                weight = vTextWeights.y;
                            #elif ANIMATION_MASK == 3
                                weight = vLineWeights.x;
                            #elif ANIMATION_MASK == 4
                                weight = vLineWeights.y;
                            #elif ANIMATION_MASK == 5
                                weight = vLineWeights.z;
                            #endif

                            float a = falloffsmooth(abs(uAnimationOrder - weight), 0.0, 1.0, uAnimationMargin, clamp(uAnimationProgress, 0.0, 1.0));
                            uv += uAnimationDirection * uAnimationAmount * (1.0 - a);
                            uv = clamp(uv, vec2(vUVMask.x, vUVMask.z), vec2(vUVMask.y, vUVMask.w));
                        #endif

                        #ifdef ANIMATION_TRANSLATE
                            alpha *= vAlpha;
                        #endif

                        #ifdef OUTLINE
                            alpha *= msdf(tMap, uv, uOutlineWidth);
                        #else
                            alpha *= msdf(tMap, uv);
                        #endif

                        gl_FragColor = vec4(uColor, alpha);
                    }
                `
    })
}
class Ui extends Ce {
    constructor(e={}, t={})
    {
        if (!e.font)
            throw new Error("You must specify a MSDF font.");
        super(),
        this._options = e,
        this.name = "Text (MSDF)",
        this.size = new H,
        this.ready = new Promise(s => {
            this.isReady = s
        }),
        this.update().then(() => {
            this.material = i3(e.font, t),
            this.isReady()
        })
    }
    _updateSize()
    {
        var e,
            t,
            s,
            n;
        this.geometry.boundingBox || this.geometry.computeBoundingBox(),
        this.size.x = Math.abs(this.geometry.boundingBox.min.x) + Math.abs(this.geometry.boundingBox.max.x),
        this.size.y = Math.abs(this.geometry.boundingBox.min.y) + Math.abs(this.geometry.boundingBox.max.y),
        (t = (e = this.material) == null ? void 0 : e.defines) != null && t.ANIMATION_TRANSLATE ? this.material.uniforms.uAnimationAmount.value = this.geometry._maxLineHeight : (n = (s = this.material) == null ? void 0 : s.defines) != null && n.ANIMATION_MASK && (this.material.uniforms.uAnimationAmount.value = this.geometry._maxUVDisp)
    }
    async update(e={})
    {
        try {
            const t = this.geometry;
            this.geometry = await zt.msdf({
                ...this._options,
                ...e
            }),
            this._updateSize(),
            t.dispose()
        } catch (t) {
            console.log("Error updating meshText geometry:", t)
        }
    }
}
const Lx = new Z,
    s3 = new Z("#000000");
function n3(i, e) {
    const t = i === "points";
    let s = null;
    if (t)
        s = new ot,
        s.setAttribute("position", new We(new Float32Array(e * 3), 3));
    else {
        const c = i.clone();
        s = new Td,
        s.instanceCount = e,
        c.index && s.setIndex(c.index);
        for (const h in c.attributes)
            s.setAttribute(h, c.attributes[h])
    }
    const n = [],
        r = [],
        a = ie.getTextureSizeParticles(e),
        o = 1 / a * .5;
    for (let c = 0; c < e; c++) {
        n.push(Math.random(), Math.random(), Math.random(), Math.random());
        const h = c % a / a + o,
            d = Math.floor(c / a) / a + o;
        r.push(h, d)
    }
    const l = t ? We : gr;
    return s.setAttribute("rand", new l(new Float32Array(n), 4)), s.setAttribute("texuv", new l(new Float32Array(r), 2)), s
}
function r3(i) {
    const e = i === "points" ? Fn : OA;
    return class  extends e{
        constructor(t={}, s={})
        {
            super(t.geometry, t.material, t.count),
            this.isParticlesGPU = !0,
            this.name = "GPU Particles",
            this.particlesCount = t.count,
            this.frustumCulled = !1;
            const n = Je.webgl.capabilities.floatRenderTarget ? Lt : Mi,
                r = ie.getTextureSizeParticles(this.particlesCount);
            if (this.rt1 = new vt(r, r, {
                count: s.textures || 1,
                wrapS: zs,
                wrapT: zs,
                minFilter: gt,
                magFilter: gt,
                format: wt,
                type: n,
                depthBuffer: !1
            }), this.rt2 = this.rt1.clone(), this.rtCurrent = 0, this.fsQuad = new uE(null), s.initialTextures && s.initialTextures.length > 0) {
                const a = {};
                s.initialTextures.forEach((d, u) => {
                    a[`tTexture${u + 1}`] = {
                        value: d
                    }
                });
                const o = () => {
                        let d = `varying vec2 vUv;
                        `;
                        return Object.keys(a).forEach((u, f) => {
                            f === 0 ? d += `#define outTex1 pc_fragColor
                            ` : d += `layout(location = ${f}) out highp vec4 outTex${f + 1};
                            `,
                            d += `uniform sampler2D ${u};
                            `
                        }), d += `void main() {
                        `, Object.keys(a).forEach((u, f) => {
                            d += `outTex${f + 1} = texture2D(${u}, vUv);
                            `
                        }), d += "}", d
                    },
                    l = new fe({
                        uniforms: a,
                        vertexShader: `
                                                varying vec2 vUv;
                                                void main() {
                                                    vUv = uv;
                                                    gl_Position = vec4(position, 1.0);
                                                }
                                            `,
                        fragmentShader: o()
                    });
                this.fsQuad.material = l;
                const c = Je.webgl.autoClear,
                    h = Je.webgl.getRenderTarget();
                Je.webgl.autoClear = !1,
                Je.webgl.setRenderTarget(this.rt1),
                this.fsQuad.render(Je.webgl),
                Je.webgl.setRenderTarget(this.rt2),
                this.fsQuad.render(Je.webgl),
                Je.webgl.autoClear = c,
                Je.webgl.setRenderTarget(h),
                l.dispose()
            }
            this.computationMaterial = s.material,
            this.fsQuad.material = this.computationMaterial,
            s.afterCompute && (this.afterCompute = s.afterCompute),
            s.autoCompute !== !1 && (this.onBeforeRender = this.compute.bind(this))
        }
        compute(t=Je.webgl, s, n)
        {
            const r = this.computationMaterial.uniforms.uModelMatrix,
                a = this.computationMaterial.uniforms.uViewMatrix,
                o = this.computationMaterial.uniforms.uProjMatrix;
            r && r.value.copy(this.matrixWorld),
            a && a.value.copy(n.matrixWorldInverse),
            o && o.value.copy(n.projectionMatrix);
            const l = this.rtCurrent === 0 ? this.rt1 : this.rt2,
                c = this.rtCurrent === 0 ? this.rt2 : this.rt1;
            this.rtCurrent = (this.rtCurrent + 1) % 2;
            for (let f = 0; f < c.textures.length; f++) {
                const p = this.computationMaterial.uniforms[`tTexture${f + 1}`];
                p && (p.value = c.textures[f])
            }
            const h = t.autoClear;
            t.autoClear = !1;
            const d = t.getRenderTarget();
            t.setRenderTarget(l),
            t.getClearColor(Lx);
            const u = t.getClearAlpha();
            t.setClearColor(s3, 0),
            t.clear(!0, !1, !1),
            this.fsQuad.render(t),
            t.autoClear = h,
            t.setRenderTarget(d),
            t.setClearColor(Lx, u);
            for (let f = 0; f < l.textures.length; f++) {
                const p = this.material.uniforms[`tTexture${f + 1}`];
                p && (p.value = l.textures[f]);
                const A = this.material.uniforms[`tTexture${f + 1}Prev`];
                A && (A.value = c.textures[f])
            }
            this.afterCompute && this.afterCompute(t, s, n)
        }
        dispose()
        {
            var t;
            this.fsQuad.dispose(),
            this.computationMaterial.dispose(),
            this.rt1.dispose(),
            this.rt2.dispose(),
            (t = super.dispose) == null || t.call(this)
        }
    }
}
function gE(i={}, e={}) {
    const t = i.geometry,
        s = i.material,
        n = i.count || 1024,
        r = n3(t, n),
        a = r3(t);
    return new a({
        geometry: r,
        material: s,
        count: n
    }, e)
}
var lo,
    co,
    tr,
    Jr,
    Ol,
    Fu,
    kl;
class a3 {
    constructor({base: e="", onChange: t=() => {}, routes: s=[{}], autoStart: n=!1}={})
    {
        te(this, lo, !1),
        te(this, co, !1),
        te(this, tr, null),
        te(this, Jr, () => !U(this, co) && U(this, tr).run()),
        te(this, Ol, r => U(this, tr).format(r === "" ? "/" : r)),
        te(this, Fu, () => {}),
        te(this, kl, []),
        et(this, Fu, t),
        et(this, kl, s.map(r => {
            const a = r.path || "/",
                o = {
                    path: a,
                    ...r.data || {}
                };
            return {
                path: a,
                data: o,
                cb: l => U(this, Fu).call(this, {
                    params: l,
                    ...o
                })
            }
        })),
        et(this, tr, new nP(e, () => this.redirect(U(this, kl)[0].path))),
        U(this, kl).forEach(({path: r, cb: a}) => U(this, tr).on(U(this, Ol).call(this, r), a)),
        n && this.start()
    }
    get blocked()
    {
        return U(this, co)
    }
    set blocked(e)
    {
        et(this, co, !!e)
    }
    start()
    {
        U(this, lo) || (et(this, lo, !0), window.addEventListener("popstate", U(this, Jr)), U(this, Jr).call(this))
    }
    stop()
    {
        U(this, lo) && (et(this, lo, !1), window.removeEventListener("popstate", U(this, Jr)))
    }
    go(e="/")
    {
        U(this, tr).route(U(this, Ol).call(this, e), !1),
        U(this, Jr).call(this)
    }
    redirect(e="/")
    {
        U(this, tr).route(U(this, Ol).call(this, e), !0),
        U(this, Jr).call(this)
    }
    dispose()
    {
        this.stop(),
        et(this, co, !1)
    }
}
lo = new WeakMap,
co = new WeakMap,
tr = new WeakMap,
Jr = new WeakMap,
Ol = new WeakMap,
Fu = new WeakMap,
kl = new WeakMap;
console.log("🧊 by https://abeto.co");
class vE {
    constructor()
    {
        this.isPass = !0,
        this.enabled = !0,
        this.needsSwap = !0,
        this.clear = !1,
        this.renderToScreen = !1
    }
    setSize() {}
    render()
    {
        console.error("THREE.Pass: .render() must be implemented in derived pass.")
    }
    dispose() {}
}
const o3 = new Ln(-1, 1, 1, -1, 0, 1);
class l3 extends ot {
    constructor()
    {
        super(),
        this.setAttribute("position", new nt([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)),
        this.setAttribute("uv", new nt([0, 2, 0, 0, 2, 0], 2))
    }
}
const c3 = new l3;
class wg {
    constructor(e)
    {
        this._mesh = new Ce(c3, e)
    }
    dispose()
    {
        this._mesh.geometry.dispose()
    }
    render(e)
    {
        e.render(this._mesh, o3)
    }
    get material()
    {
        return this._mesh.material
    }
    set material(e)
    {
        this._mesh.material = e
    }
}
class h3 extends vE {
    constructor(e, t, s=null, n=null, r=null)
    {
        super(),
        this.scene = e,
        this.camera = t,
        this.overrideMaterial = s,
        this.clearColor = n,
        this.clearAlpha = r,
        this.clear = !0,
        this.clearDepth = !1,
        this.needsSwap = !1,
        this._oldClearColor = new Z
    }
    render(e, t, s)
    {
        const n = e.autoClear;
        e.autoClear = !1;
        let r,
            a;
        this.overrideMaterial !== null && (a = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial),
        this.clearColor !== null && (e.getClearColor(this._oldClearColor), e.setClearColor(this.clearColor, e.getClearAlpha())),
        this.clearAlpha !== null && (r = e.getClearAlpha(), e.setClearAlpha(this.clearAlpha)),
        this.clearDepth == !0 && e.clearDepth(),
        e.setRenderTarget(this.renderToScreen ? null : s),
        this.clear === !0 && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil),
        e.render(this.scene, this.camera),
        this.clearColor !== null && e.setClearColor(this._oldClearColor),
        this.clearAlpha !== null && e.setClearAlpha(r),
        this.overrideMaterial !== null && (this.scene.overrideMaterial = a),
        e.autoClear = n
    }
}
