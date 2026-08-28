const Q = new u2;
re.registerPlugin(Ei, dg, fg);
re.config({
    force3D: !0
});
re.defaults({
    ease: "power2.inOut",
    duration: .6,
    overwrite: "auto"
});
Ei.create("inOut1", "M0,0 C0.5,0 0.1,1 1,1", {
    precision: 2
});
Ei.create("inOut2", "M0,0 C0.56,0 0,1 1,1", {
    precision: 2
});
Ei.create("inOut3", "M0,0 C0.6,0 0,1 1,1", {
    precision: 2
});
Ei.create("inOut4", "M0,0 C0.4,0 -0.06,1 1,1", {
    precision: 2
});
const tx = re.parseEase(),
    pg = 60,
    BD = .2,
    PD = pg * BD;
let DD = pg / PD,
    um = 0,
    dm = 16,
    _w = 0,
    fm = 60,
    pm = 0;
const Fe = {
    get time() {
        return um
    },
    get delta() {
        return dm
    },
    get frame() {
        return _w
    },
    get averageFPS() {
        return fm
    },
    get maxFPS() {
        return pm
    },
    get ratio() {
        return Math.min(DD, dm / (1e3 / pg))
    }
};
let ix = 0;
const RD = .5,
    UD = 5,
    ul = [],
    LD = ["webgl_prerender", "webgl_render", "webgl_postrender"];
re.ticker.add((i, e, t) => {
    const s = Math.round((i - um) * 1e3);
    {
        if (ul.push(s), i - ix >= RD && ul.length >= UD) {
            const n = Math.round(1e3 / (ul.reduce((r, a) => r + a, 0) / ul.length));
            pm = Math.max(pm, n),
            fm = n,
            ul.length = 0,
            ix = i,
            Q.emit("webgl_average_fps_update", fm)
        }
        um = i,
        dm = s,
        _w++,
        LD.forEach(n => Q.emit(n, i, s))
    }
});
class FD {
    static isWebGLAvailable()
    {
        try {
            const e = document.createElement("canvas");
            return !!(window.WebGLRenderingContext && (e.getContext("webgl") || e.getContext("experimental-webgl")))
        } catch {
            return !1
        }
    }
    static isWebGL2Available()
    {
        try {
            const e = document.createElement("canvas");
            return !!(window.WebGL2RenderingContext && e.getContext("webgl2"))
        } catch {
            return !1
        }
    }
    static isColorSpaceAvailable(e)
    {
        try {
            const t = document.createElement("canvas"),
                s = window.WebGL2RenderingContext && t.getContext("webgl2");
            return s.drawingBufferColorSpace = e, s.drawingBufferColorSpace === e
        } catch {
            return !1
        }
    }
    static getWebGLErrorMessage()
    {
        return this.getErrorMessage(1)
    }
    static getWebGL2ErrorMessage()
    {
        return this.getErrorMessage(2)
    }
    static getErrorMessage(e)
    {
        const t = {
                1: "WebGL",
                2: "WebGL 2"
            },
            s = {
                1: window.WebGLRenderingContext,
                2: window.WebGL2RenderingContext
            };
        let n = 'Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>';
        const r = document.createElement("div");
        return r.id = "webglmessage", r.style.fontFamily = "monospace", r.style.fontSize = "13px", r.style.fontWeight = "normal", r.style.textAlign = "center", r.style.background = "#fff", r.style.color = "#000", r.style.padding = "1.5em", r.style.width = "400px", r.style.margin = "5em auto 0", s[e] ? n = n.replace("$0", "graphics card") : n = n.replace("$0", "browser"), n = n.replace("$1", t[e]), r.innerHTML = n, r
    }
}
const ND = FD;
window.requestIdleCallback || (window.requestIdleCallback = function(i) {
    return setTimeout(() => {
        const e = Date.now();
        i({
            didTimeout: !1,
            timeRemaining: () => Math.max(0, 5 - (Date.now() - e))
        })
    }, 16)
}, window.cancelIdleCallback = function(i) {
    clearTimeout(i)
});
let od = null;
const To = [],
    ww = i => {
        To.length > 0 ? od = requestIdleCallback(ww) : od = null;
        for (let e = To.length - 1; e > -1 && i.timeRemaining() > 0; e--)
            To[e](i)
    };
function sx(i) {
    To.push(i),
    od === null && (od = requestIdleCallback(ww))
}
function nx(i) {
    const e = To.indexOf(i);
    e > -1 && To.splice(e, 1)
}
const Sc = {
    debounce(i, e) {
        let t = null;
        return () => {
            clearTimeout(t),
            t = setTimeout(i, e)
        }
    },
    wait(i, e=!1) {
        return new Promise(t => {
            const s = "webgl_prerender";
            if (typeof i == "number")
                if (e === !0) {
                    const n = Fe.frame,
                        r = () => {
                            Fe.frame - n >= i && (Q.off(s, r), t())
                        };
                    Q.on(s, r)
                } else
                    re.delayedCall(i, t);
            else if (i && typeof e == "string") {
                const n = () => {
                    i[e] !== void 0 && (Q.off(s, n), t())
                };
                Q.on(s, n)
            } else
                console.warn("invalid wait"),
                t()
        })
    },
    nextFrame(i) {
        return new Promise(e => {
            re.delayedCall(0, () => {
                e(i == null ? void 0 : i())
            })
        })
    },
    nextIdle(i) {
        return new Promise(e => {
            const t = () => {
                nx(t),
                e(i == null ? void 0 : i())
            };
            sx(t)
        })
    },
    taskIdle(i, e=2, t=10) {
        return new Promise(s => {
            const n = Date.now();
            let r = !1;
            const a = () => {
                    nx(o),
                    r = !0,
                    s()
                },
                o = l => {
                    const c = Date.now();
                    let h = c,
                        d = -1;
                    for (; !r && d < e && l.timeRemaining() > 0;)
                        i == null || i(a),
                        h = Date.now(),
                        d = h - c;
                    !r && h - n > t * 1e3 && (console.warn("An idle task took too long to complete, aborting."), a())
                };
            sx(o)
        })
    },
    hasRunThisFrame(i) {
        if (!i)
            throw new Error("hasRunThisFrame requires an object");
        const e = i.___lastTimeFired;
        return i.___lastTimeFired = Fe.time, e ? e === Fe.time : !1
    },
    loadJson(i) {
        return fetch(i).then(e => e.json()).catch(() => console.log(`Load of ${i} failed.`))
    },
    preload(i=[], e) {
        if (!(i && i.length))
            return e == null || e(1), Promise.resolve();
        const t = [...new Set(i)],
            s = t.length;
        let n = 0;
        const r = async a => {
            try {
                const l = await fetch(a);
                l.ok && await l.blob()
            } catch (l) {
                console.warn(`${l} ${a}`)
            }
            const o = ++n / s;
            e == null || e(o)
        };
        return Promise.all(t.map(a => r(a)))
    }
};
var ld,
    mm,
    Am,
    Ew,
    gm,
    Zr,
    ec,
    lu,
    vm,
    cu,
    xm,
    hu,
    ym;
const _m = class uu {
    constructor()
    {
        te(this, lu),
        te(this, cu),
        te(this, hu),
        te(this, gm, new f2),
        te(this, Zr, document.querySelector("html")),
        te(this, ec, !1),
        Oe(this, "boundDebouncedResize", null),
        Oe(this, "boundVisibilityChange", ve(this, cu, xm).bind(this)),
        Oe(this, "boundFocusChange", ve(this, hu, ym).bind(this)),
        Oe(this, "relativePath", ""),
        Oe(this, "absolutePath", window.location.origin),
        Oe(this, "UAInfo", U(this, gm).getResult()),
        Oe(this, "query", new Proxy(new URLSearchParams(window.location.search), {
            get: (a, o) => a.get(o)
        })),
        Oe(this, "language", (navigator.language || navigator.userLanguage).substr(0, 2)),
        Oe(this, "device", "desktop"),
        Oe(this, "visible", !0),
        Oe(this, "focused", !0),
        Oe(this, "electron", this.UAInfo.ua.toLowerCase().indexOf(" electron/") > -1),
        Oe(this, "oldIphone", !1),
        Oe(this, "devScene", !1),
        Oe(this, "os", {
            name: "unknown",
            fullVersion: "0",
            version: 0
        }),
        Oe(this, "browser", {
            name: "unknown",
            fullVersion: "0",
            version: 0
        }),
        Oe(this, "screen", {
            dpr: window.devicePixelRatio || 1,
            aspectRatio: 1,
            width: 0,
            height: 0,
            w: 0,
            h: 0
        }),
        Oe(this, "capabilities", {
            webgl2: ND.isWebGL2Available(),
            touch: "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0,
            offscreenCanvas: !!HTMLCanvasElement.prototype.transferControlToOffscreen,
            userMedia: !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia),
            fullScreen: document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled,
            geo: typeof navigator.geolocation < "u",
            imageBitmap: !0
        });
        var e,
            t;
        const s = (this.UAInfo.device.type || "").toLowerCase();
        switch (s) {
        case "mobile":
        case "tablet":
            this.device = s;
            break
        }
        const n = (this.UAInfo.os.name || "").toLowerCase().replace(/(mobile|phone)+/g, "").trim();
        switch (n) {
        case "mac os":
        case "ios":
        case "windows":
        case "android":
            this.os.name = n === "mac os" ? "mac" : n,
            this.os.fullVersion = this.UAInfo.os.version || this.os.fullVersion,
            this.os.version = ve(e = uu, ld, mm).call(e, this.os.fullVersion);
            break;
        case "linux":
        case "mint":
        case "ubuntu":
        case "debian":
        case "suse":
        case "fedora":
            this.os.name = "linux";
            break
        }
        this.os.name === "mac" && this.capabilities.touch && (this.device = "tablet", this.os.name = "ios"),
        this.device === "mobile" && this.os.name === "ios" && window.devicePixelRatio < 3 && (this.oldIphone = !0);
        const r = (this.UAInfo.browser.name || "").toLowerCase().replace(/(mobile|phone)+/g, "").trim();
        switch (r) {
        case "chrome":
        case "firefox":
        case "safari":
        case "edge":
        case "opera":
        case "ie":
        case "facebook":
            this.browser.name = r,
            this.browser.fullVersion = this.UAInfo.browser.version || this.browser.fullVersion,
            this.browser.version = ve(t = uu, ld, mm).call(t, this.browser.fullVersion);
            break
        }
        (this.browser.name === "safari" && this.browser.version < 17.5 || this.browser.name === "firefox" && this.browser.version < 100 || this.os.name === "ios" && this.browser.name !== "safari") && (this.capabilities.imageBitmap = !1),
        U(this, Zr).classList.add(this.language),
        U(this, Zr).classList.add(this.device),
        this.os.name !== "unknown" && U(this, Zr).classList.add(this.os.name),
        this.browser.name !== "unknown" && U(this, Zr).classList.add(this.browser.name),
        et(this, ec, this.os.name === "ios"),
        this.boundDebouncedResize = Sc.debounce(ve(this, lu, vm).bind(this), U(this, ec) ? 500 : 50),
        this.init()
    }
    init()
    {
        window.addEventListener("resize", this.boundDebouncedResize),
        window.addEventListener("orientationchange", this.boundDebouncedResize),
        ve(this, lu, vm).call(this),
        this.boundDebouncedResize(),
        document.addEventListener("visibilitychange", this.boundVisibilityChange),
        window.addEventListener("focus", this.boundFocusChange),
        window.addEventListener("blur", this.boundFocusChange),
        ve(this, cu, xm).call(this),
        ve(this, hu, ym).call(this)
    }
    setRelativePath(e)
    {
        var t;
        this.relativePath = ve(t = uu, Am, Ew).call(t, e),
        this.absolutePath = `${window.location.origin}${this.relativePath !== "" ? `/${this.relativePath}` : ""}`
    }
    dispose()
    {
        window.removeEventListener("resize", this.boundDebouncedResize),
        window.removeEventListener("orientationchange", this.boundDebouncedResize),
        document.removeEventListener("visibilitychange", this.boundVisibilityChange),
        window.removeEventListener("focus", this.boundFocusChange),
        window.removeEventListener("blur", this.boundFocusChange)
    }
}
;
ld = new WeakSet,
mm = function(i) {
    const e = i.split(".");
    return +`${e[0]}.${e[1] || ""}`
},
Am = new WeakSet,
Ew = function(i) {
    return i.replace(/^\/+|\/+$/g, "")
},
gm = new WeakMap,
Zr = new WeakMap,
ec = new WeakMap,
lu = new WeakSet,
vm = function() {
    const i = window.innerWidth,
        e = window.innerHeight;
    this.screen.width = i,
    this.screen.height = e,
    this.screen.w = i,
    this.screen.h = e,
    this.screen.aspectRatio = i / e,
    U(this, ec) && Math.min(window.screen.width, window.screen.height) !== e && (U(this, Zr).scrollTop = -1),
    Q.emit("resize", i, e)
},
cu = new WeakSet,
xm = function() {
    this.visible = document.visibilityState === "visible",
    Q.emit("visibility_change", this.visible)
},
hu = new WeakSet,
ym = function() {
    this.focused = document.hasFocus(),
    Q.emit("focus_change", this.focused)
},
te(_m, ld),
te(_m, Am);
let OD = _m;
const q = new OD,
    ie = {
        TWO_PI: Math.PI * 2,
        HALF_PI: Math.PI * .5,
        DEG2RAD: Math.PI / 180,
        RAD2DEG: 180 / Math.PI,
        degrees(i) {
            return i * this.RAD2DEG
        },
        radians(i) {
            return i * this.DEG2RAD
        },
        clamp(i, e=0, t=1) {
            return Math.max(e, Math.min(t, i))
        },
        lerp(i, e, t) {
            return (1 - t) * i + t * e
        },
        mix(i, e, t) {
            return this.lerp(i, e, t)
        },
        deltaRatio() {
            return Fe.ratio
        },
        lerpCoefFPS(i) {
            return this.damp(i, Fe.ratio)
        },
        lerpFPS(i, e, t) {
            return this.lerp(i, e, this.lerpCoefFPS(t))
        },
        lerpFPSLimited(i, e, t, s=1 / 0) {
            const n = this.lerpFPS(i, e, t),
                r = s * Fe.ratio,
                a = this.clamp(n - i, -r, r);
            return i + a
        },
        damp(i, e) {
            return 1 - Math.exp(Math.log(1 - i) * e)
        },
        frictionFPS(i) {
            return this.friction(i, Fe.ratio)
        },
        friction(i, e) {
            return Math.exp(Math.log(i) * e)
        },
        efit(i, e, t, s, n) {
            return s + (i - e) * (n - s) / (t - e)
        },
        fit(i, e, t, s, n) {
            return this.efit(this.clamp(i, Math.min(e, t), Math.max(e, t)), e, t, s, n)
        },
        fit01(i, e, t) {
            return this.fit(i, 0, 1, e, t)
        },
        fit10(i, e, t) {
            return this.fit(i, 1, 0, e, t)
        },
        fit11(i, e, t) {
            return this.fit(i, -1, 1, e, t)
        },
        step(i, e) {
            return e < i ? 0 : 1
        },
        linearstep(i, e, t) {
            return this.clamp((t - i) / (e - i), 0, 1)
        },
        smoothstep(i, e, t) {
            const s = this.linearstep(i, e, t);
            return s * s * (3 - 2 * s)
        },
        smootherstep(i, e, t) {
            const s = this.linearstep(i, e, t);
            return s * s * s * (s * (s * 6 - 15) + 10)
        },
        parabola(i, e) {
            return Math.pow(4 * i * (1 - i), e)
        },
        pcurve(i, e, t) {
            return Math.pow(e + t, e + t) / (Math.pow(e, e) * Math.pow(t, t)) * Math.pow(i, e) * Math.pow(1 - i, t)
        },
        falloff(i, e, t, s, n) {
            const r = s * Math.sign(t - e),
                a = this.mix(e - r, t, n);
            return this.linearstep(a + r, a, i)
        },
        falloffsmooth(i, e, t, s, n) {
            const r = s * Math.sign(t - e),
                a = this.mix(e - r, t, n);
            return this.smoothstep(a + r, a, i)
        },
        ease(i, e="linear") {
            return (tx[e] || tx.none)(i)
        },
        round(i, e=0) {
            const t = Math.pow(10, e);
            return Math.round(i * t) / t
        },
        isPowerOfTwo(i) {
            return (i & i - 1) === 0 && i !== 0
        },
        ceilPowerOfTwo(i) {
            return Math.pow(2, Math.ceil(Math.log(i) / Math.LN2))
        },
        floorPowerOfTwo(i) {
            return Math.pow(2, Math.floor(Math.log(i) / Math.LN2))
        },
        makeAnglePositive(i) {
            const e = i % this.TWO_PI;
            return e < 0 ? this.TWO_PI + e : e
        },
        getShortestRotationAngle(i, e) {
            const t = this.makeAnglePositive(i);
            let s = this.makeAnglePositive(e);
            return Math.abs(s - t) > Math.PI && (s > t ? s -= this.TWO_PI : s += this.TWO_PI), i + s - t
        },
        latLonTo3D(i, e, t) {
            const s = this.HALF_PI - this.radians(i),
                n = this.radians(e);
            return {
                x: t * Math.sin(s) * Math.sin(n),
                y: t * Math.cos(s),
                z: t * Math.sin(s) * Math.cos(n)
            }
        },
        getTextureSizeParticles(i=4, e=1) {
            return Math.max(Math.ceil(Math.sqrt(i * e) / 4) * 4, 4)
        },
        uidAlphabet: "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict",
        uid(i=21) {
            let e = "",
                t = i;
            for (; t--;)
                e += this.uidAlphabet[Math.random() * 64 | 0];
            return e
        }
    },
    Qr = new b,
    Ga = new b;
function kD(i, e, t) {
    Qr.set(i, e, t);
    let s = 0;
    return s += Math.sin(Qr.dot(Ga.set(1.5, 3.4598, 1.234))), s += Math.sin(Qr.dot(Ga.set(3.12, -3.234, 4.221))), s += Math.sin(Qr.dot(Ga.set(.355, 2.3, -1.375))), s += Math.sin(Qr.dot(Ga.set(-.156, -3.34, -.4566))), s += Math.sin(Qr.dot(Ga.set(-4.1235, -.485, -1.45))), s += Math.sin(Qr.dot(Ga.set(2.54, -.879, -2.123))), s / 6
}
const Of = {
    sineNoise1: kD
};
var wm,
    Em,
    kf,
    du,
    tc,
    ic,
    sc,
    nc,
    fu,
    Pl,
    pu,
    cd,
    Cm,
    Dl,
    mu,
    Sm,
    Cw,
    Rl,
    Au,
    gu,
    Mm;
const Ul = class bm {
    constructor(e=0)
    {
        te(this, Pl),
        te(this, cd),
        te(this, Dl),
        te(this, Sm),
        te(this, Rl),
        te(this, gu),
        te(this, du, new H),
        te(this, tc, new H),
        te(this, ic, new H),
        te(this, sc, new H),
        te(this, nc, new H),
        te(this, fu, 0),
        this.finger = e,
        this.touchID = !1,
        this.eventID = this.finger === 0 ? "touch" : `touch${this.finger + 1}`,
        this.currentInput = this.finger === 0 ? "mouse" : "touch",
        this.button = 0,
        this.touching = !1,
        this.position = new H(q.screen.w * .5, q.screen.h * .5),
        this.position01 = new H(.5, .5),
        this.position11 = new H,
        this.delta = new H,
        this.delta11 = new H,
        this.dragged = new H,
        this.dragged11 = new H,
        this.velocity = new H,
        this.swipeVelocity = new H,
        U(this, tc).copy(this.position),
        U(this, ic).copy(this.position01),
        U(this, sc).copy(this.position),
        U(this, nc).copy(this.position01),
        Q.on("webgl_prerender", ve(this, gu, Mm), this)
    }
    onTouchStart(e)
    {
        this.touching = !0,
        et(this, fu, Fe.time),
        ve(this, Pl, pu).call(this, e),
        ve(this, cd, Cm).call(this),
        ve(this, Dl, mu).call(this),
        ve(this, Sm, Cw).call(this),
        ve(this, Rl, Au).call(this),
        Q.emit(`${this.eventID}_start`, this)
    }
    onTouchMove(e)
    {
        ve(this, Pl, pu).call(this, e),
        ve(this, Dl, mu).call(this),
        Q.emit(`${this.eventID}_move`, this),
        this.touching && (ve(this, Rl, Au).call(this), Q.emit(`${this.eventID}_drag`, this))
    }
    onTouchEnd(e)
    {
        ve(this, Pl, pu).call(this, e),
        ve(this, Dl, mu).call(this),
        ve(this, Rl, Au).call(this);
        const t = this.touching;
        if (this.touching = !1, !t)
            return;
        const s = Math.max(.001, Fe.time - U(this, fu));
        this.swipeVelocity.copy(this.dragged).divideScalar(s),
        Q.emit(`${this.eventID}_end`, this),
        this.dragged.length() < U(bm, wm) && s < U(bm, Em) && e.type !== "pointerout" && Q.emit(`${this.eventID}_click`, this)
    }
    dispose()
    {
        Q.off("webgl_prerender", ve(this, gu, Mm), this)
    }
}
;
wm = new WeakMap,
Em = new WeakMap,
kf = new WeakMap,
du = new WeakMap,
tc = new WeakMap,
ic = new WeakMap,
sc = new WeakMap,
nc = new WeakMap,
fu = new WeakMap,
Pl = new WeakSet,
pu = function(i) {
    const e = i,
        t = e.clientX,
        s = e.clientY;
    this.position.set(t, s),
    this.position01.set(t / q.screen.w, 1 - s / q.screen.h),
    this.position11.copy(this.position01).multiplyScalar(2).subScalar(1),
    this.currentInput = i.pointerType === "mouse" ? "mouse" : "touch",
    this.button = i.button
},
cd = new WeakSet,
Cm = function() {
    U(this, sc).copy(this.position),
    U(this, nc).copy(this.position01)
},
Dl = new WeakSet,
mu = function() {
    this.delta.copy(this.position).sub(U(this, sc)),
    this.delta11.copy(this.position01).sub(U(this, nc)),
    ve(this, cd, Cm).call(this),
    U(this, du).copy(this.delta11).multiplyScalar(2),
    this.velocity.add(U(this, du))
},
Sm = new WeakSet,
Cw = function() {
    U(this, tc).copy(this.position),
    U(this, ic).copy(this.position01)
},
Rl = new WeakSet,
Au = function() {
    this.dragged.copy(this.position).sub(U(this, tc)),
    this.dragged11.copy(this.position01).sub(U(this, ic))
},
gu = new WeakSet,
Mm = function() {
    this.velocity.multiplyScalar(ie.frictionFPS(U(Ul, kf))),
    this.velocity.clampScalar(-1, 1),
    this.velocity.length() < .001 && this.velocity.setScalar(0)
},
te(Ul, wm, 15),
te(Ul, Em, .5),
te(Ul, kf, .95);
let zD = Ul;
var ls,
    ci,
    sa,
    Tm,
    rx,
    vu,
    zf,
    Im,
    Sw,
    Bm,
    Mw,
    Pm,
    bw,
    Dm,
    Tw,
    Rm,
    Iw;
class QD {
    constructor()
    {
        te(this, Tm),
        te(this, vu),
        te(this, Im),
        te(this, Bm),
        te(this, Pm),
        te(this, Dm),
        te(this, Rm),
        te(this, ls, []),
        te(this, ci, null),
        te(this, sa, !0),
        Oe(this, "allowTouchStart", !1),
        Oe(this, "boundTouchesStart", ve(this, Im, Sw).bind(this)),
        Oe(this, "boundTouchesMove", ve(this, Bm, Mw).bind(this)),
        Oe(this, "boundTouchesEnd", ve(this, Pm, bw).bind(this)),
        Oe(this, "boundPreventTouchesStart", ve(this, Dm, Tw).bind(this)),
        Oe(this, "boundPreventDefault", ve(this, Rm, Iw).bind(this))
    }
    get(e)
    {
        return U(this, ls)[e]
    }
    getActive()
    {
        return U(this, ls).filter(e => e.touching)
    }
    init({element: e=window, fingers: t=2, contextMenu: s=!1}={})
    {
        et(this, ci, e),
        et(this, sa, U(this, ci) instanceof HTMLCanvasElement);
        for (let n = 0; n < t; n++)
            U(this, ls).push(new zD(n, U(this, ls)));
        e.style.touchAction = "none",
        U(this, sa) && (e.style.userSelect = "none"),
        U(this, ci).addEventListener("pointerdown", this.boundTouchesStart),
        U(this, ci).addEventListener("pointermove", this.boundTouchesMove),
        U(this, ci).addEventListener("pointerup", this.boundTouchesEnd),
        U(this, ci).addEventListener("pointerout", this.boundTouchesEnd),
        U(this, ci).addEventListener("pointercancel", this.boundTouchesEnd),
        s || U(this, ci).addEventListener("contextmenu", this.boundPreventDefault),
        e.addEventListener("touchstart", this.boundPreventTouchesStart, {
            passive: !1
        }),
        document.addEventListener("dblclick", this.boundPreventDefault)
    }
    dispose()
    {
        U(this, ci).removeEventListener("pointerdown", this.boundTouchesStart),
        U(this, ci).removeEventListener("pointermove", this.boundTouchesMove),
        U(this, ci).removeEventListener("pointerup", this.boundTouchesEnd),
        U(this, ci).removeEventListener("pointerout", this.boundTouchesEnd),
        U(this, ci).removeEventListener("pointercancel", this.boundTouchesEnd),
        U(this, ci).removeEventListener("contextmenu", this.boundPreventDefault),
        U(this, ci).removeEventListener("touchstart", this.boundPreventTouchStart),
        document.removeEventListener("dblclick", this.boundPreventDefault),
        U(this, ls).forEach(e => {
            U(this, ls).indexOf(e) > -1 && U(this, ls).splice(U(this, ls).indexOf(e), 1),
            e.dispose()
        }),
        et(this, ci, null),
        et(this, sa, !0)
    }
}
ls = new WeakMap,
ci = new WeakMap,
sa = new WeakMap,
Tm = new WeakSet,
rx = function() {
    return U(this, ls).find(i => i.touchID === !1)
},
vu = new WeakSet,
zf = function(i) {
    return U(this, ls).find(e => e.touchID === i.pointerId)
},
Im = new WeakSet,
Sw = function(i) {
    const e = ve(this, Tm, rx).call(this);
    e && (U(this, sa) && this.getActive().length === 0 && U(this, ci).setPointerCapture(i.pointerId), e.touchID = i.pointerId, e.onTouchStart(i))
},
Bm = new WeakSet,
Mw = function(i) {
    const e = ve(this, vu, zf).call(this, i);
    e ? e.onTouchMove(i) : i.pointerType === "mouse" && this.getActive().length === 0 && U(this, ls)[0].onTouchMove(i)
},
Pm = new WeakSet,
bw = function(i) {
    const e = ve(this, vu, zf).call(this, i);
    e && (e.onTouchEnd(i), e.touchID = !1, U(this, sa) && this.getActive().length === 0 && U(this, ci).releasePointerCapture(i.pointerId))
},
Dm = new WeakSet,
Tw = function(i) {
    this.allowTouchStart || i.preventDefault()
},
Rm = new WeakSet,
Iw = function(i) {
    i.preventDefault()
};
const $t = new QD,
    Ks = new b,
    Gr = new b,
    Qf = new b,
    Kn = new b,
    GD = new De,
    Ch = Math.PI * .5,
    ax = new H,
    Gf = {
        PERSPECTIVE: 1,
        ORTHOGRAPHIC: 2
    },
    Hf = {
        SCREEN: 1,
        CUSTOM: 2
    },
    ox = .1,
    lx = 1e3,
    HD = 6;
function Bw(i) {
    const e = Gf[i.toUpperCase()],
        t = e === Gf.PERSPECTIVE ? gi : Ln;
    return class  extends t{
        constructor()
        {
            e === Gf.PERSPECTIVE ? super(45, q.screen.w / q.screen.h, ox, lx) : super(q.screen.w * -.5, q.screen.w * .5, q.screen.h * .5, q.screen.h * -.5, ox, lx),
            this.isBaseCamera = !0,
            this._sizing = Hf.SCREEN,
            this._size = new H(q.screen.w, q.screen.h),
            this._firstUpdate = !0,
            this._prevSize = this._size.clone(),
            this._prevPosition = new b,
            this._prevTarget = new b,
            this._prevUp = new b,
            this._additionalSphericalPosition = new Yl,
            this._additionalSphericalTarget = new Yl,
            this._additionalRotationUp = 0,
            this.target = new b,
            this.basePosition = new b(0, 0, HD),
            this.baseTarget = new b,
            this.baseUp = new b(0, 1, 0),
            this.displacement = {
                position: new H,
                target: new H,
                rotation: 0
            },
            this.lerpPosition = .035,
            this.lerpTarget = .035,
            this.lerpRotation = .035,
            this.shake = new b,
            this.shakeSpeed = new b(1, 1, 1),
            this.touchAmount = 1,
            this.resetOnTouch = !0
        }
        _update()
        {
            this._firstUpdate && (this._firstUpdate = !1);
            const s = this.resetOnTouch && $t.get(0).currentInput === "touch" && !$t.get(0).touching,
                n = s ? .5 : 1,
                r = ie.fit(s ? 0 : $t.get(0).position11.x, -1, 1, -Ch, Ch) * this.touchAmount,
                a = ie.fit(s ? 0 : $t.get(0).position11.y, 1, -1, -Ch, Ch) * this.touchAmount;
            if (Ks.subVectors(this.basePosition, this.baseTarget), Ks.lengthSq() === 0 && (Ks.z = 1), Ks.normalize(), Gr.crossVectors(this.baseUp, Ks), Gr.lengthSq() === 0 && (Math.abs(this.baseUp.z) === 1 ? Ks.x += 1e-4 : Ks.z += 1e-4, Ks.normalize(), Gr.crossVectors(this.baseUp, Ks)), Gr.normalize(), Qf.crossVectors(Ks, Gr), this.displacement.position.equals(ax) ? (this.position.copy(this.basePosition), this._additionalSphericalPosition.set(1, 0, 0)) : (this._additionalSphericalPosition.theta = ie.lerpFPS(this._additionalSphericalPosition.theta, r * this.displacement.position.x, this.lerpPosition * n), this._additionalSphericalPosition.phi = ie.lerpFPS(this._additionalSphericalPosition.phi, a * this.displacement.position.y, this.lerpPosition * n), Kn.subVectors(this.basePosition, this.baseTarget), Kn.applyAxisAngle(Gr, this._additionalSphericalPosition.phi).applyAxisAngle(Qf, this._additionalSphericalPosition.theta), this.position.copy(this.baseTarget).add(Kn)), this.displacement.target.equals(ax) && this.shake.x === 0 && this.shake.y === 0)
                this.target.copy(this.baseTarget),
                this._additionalSphericalTarget.set(1, 0, 0);
            else {
                this._additionalSphericalTarget.theta = ie.lerpFPS(this._additionalSphericalTarget.theta, r * this.displacement.target.x, this.lerpTarget * n),
                this._additionalSphericalTarget.phi = ie.lerpFPS(this._additionalSphericalTarget.phi, a * this.displacement.target.y, this.lerpTarget * n);
                const o = this.shake.x === 0 ? 0 : Of.sineNoise1(12.23, 3.44, -3.234 + Fe.time * this.shakeSpeed.x) * this.shake.x * this.touchAmount,
                    l = this.shake.y === 0 ? 0 : Of.sineNoise1(-2.45, 4.789, 7.343 + Fe.time * this.shakeSpeed.y) * this.shake.y * this.touchAmount;
                Kn.subVectors(this.baseTarget, this.basePosition),
                Kn.applyAxisAngle(Gr, this._additionalSphericalTarget.phi + l).applyAxisAngle(Qf, this._additionalSphericalTarget.theta + o),
                this.target.copy(this.basePosition).add(Kn)
            }
            if (this.displacement.rotation === 0 && this.shake.z === 0)
                this.up.copy(this.baseUp),
                this._additionalRotationUp = 0;
            else {
                this._additionalRotationUp = ie.lerpFPS(this._additionalRotationUp, $t.get(0).velocity.x * this.displacement.rotation * this.touchAmount, this.lerpRotation * n);
                const o = this.shake.z === 0 ? 0 : Of.sineNoise1(23.434, -1.565, 8.454 + Fe.time * this.shakeSpeed.z) * this.shake.z * this.touchAmount;
                Kn.subVectors(this.position, this.target).normalize(),
                this.up.copy(this.baseUp).applyAxisAngle(Kn, this._additionalRotationUp + o)
            }
            (!this.position.equals(this._prevPosition) || !this.target.equals(this._prevTarget) || !this.up.equals(this._prevUp)) && (this._prevPosition.copy(this.position), this._prevTarget.copy(this.target), this._prevUp.copy(this.up), this.quaternion.setFromRotationMatrix(GD.lookAt(this.position, this.target, this.up)))
        }
        _resize()
        {
            if (this._sizing === Hf.SCREEN && this._size.set(q.screen.w, q.screen.h), !this._prevSize.equals(this._size)) {
                if (this._prevSize.copy(this._size), this.isPerspectiveCamera)
                    this.aspect = this._size.x / this._size.y;
                else {
                    const s = this._size.x * .5,
                        n = this._size.y * .5;
                    this.left = -s,
                    this.right = s,
                    this.top = n,
                    this.bottom = -n
                }
                this.updateProjectionMatrix()
            }
        }
        setCustomSize(s, n)
        {
            this._sizing = Hf.CUSTOM,
            this._size.set(s, n)
        }
    }
}
function VD(i="perspective") {
    const e = Bw(i);
    return new e
}
const cx = 0,
    hx = new e_,
    Pi = new b,
    ux = new b;
class Pw {
    constructor({camera: e=null, normal: t=new b(0, 0, -1), constant: s=cx}={})
    {
        this._camera = e,
        this._plane = new Zs(t, s)
    }
    _unproject(e)
    {
        return hx.setFromCamera(e, this._camera), hx.ray.intersectPlane(this._plane, Pi), Pi
    }
    getTouchPositionOnPlane(e=0)
    {
        return this._unproject($t.get(e).position11)
    }
    getPointPositionOnPlane(e)
    {
        return this._unproject(e)
    }
    getPointPositionOnScreen(e)
    {
        return Pi.copy(e), Pi.project(this._camera), Pi.set((Pi.x + 1) / 2 * q.screen.w, -(Pi.y - 1) / 2 * q.screen.h, Pi.z), Pi
    }
    setPlaneFromPoint(e)
    {
        return Pi.copy(this._camera.position).sub(e).normalize(), this._plane.setFromNormalAndCoplanarPoint(Pi, e), this
    }
    setPlaneFromCameraTarget()
    {
        return this.setPlaneFromPoint(this._camera.target)
    }
    setPlaneFromCameraTargetAndDistance(e)
    {
        return Pi.copy(this._camera.position).sub(this._camera.target).normalize(), ux.copy(Pi).negate().multiplyScalar(e).add(this._camera.position), this._plane.setFromNormalAndCoplanarPoint(Pi, ux), this
    }
    setPlaneFromDirectionAndPoint(e, t)
    {
        return Pi.copy(e).normalize(), this._plane.setFromNormalAndCoplanarPoint(Pi, t), this
    }
    setDefaultPlane()
    {
        return this._plane.normal.set(0, 0, -1), this._plane.constant = cx, this
    }
    setCamera(e)
    {
        return this._camera = e, this
    }
    unprojectFinger(e=0)
    {
        return this.setPlaneFromCameraTarget().getTouchPositionOnPlane(e)
    }
    unprojectPoint(e)
    {
        return this.setPlaneFromCameraTarget().getPointPositionOnPlane(e)
    }
    unprojectDistance(e, t=0)
    {
        return this.setPlaneFromCameraTargetAndDistance(e).getTouchPositionOnPlane(t)
    }
    project(e)
    {
        return this.getPointPositionOnScreen(e)
    }
}
const jt = {
        NONE: -1,
        ROTATE: 0,
        ZOOM: 1,
        PAN: 2,
        ZOOM_PAN: 3,
        ZOOM_ROTATE: 4
    },
    Ha = {
        NONE: -1,
        ROTATE: 0,
        PAN: 1,
        ZOOM_PAN: 2,
        ZOOM_ROTATE: 3
    },
    dx = .02,
    fx = 1e-6,
    Yi = new H,
    Vf = new H,
    rs = new b,
    WD = new Pw;
function YD(i) {
    return class  extends i{
        constructor()
        {
            super(),
            this.isOrbitCamera = !0,
            this.displacement.position.setScalar(0),
            this.displacement.target.setScalar(0),
            this.displacement.rotation = 0,
            this.lerpPosition = 1,
            this.lerpTarget = 1,
            this.lerpRotation = 1,
            this.buttons = {
                ROTATE: 0,
                ZOOM: 1,
                PAN: 2
            },
            this.touches = {
                ONE: Ha.ROTATE,
                TWO: Ha.ZOOM_PAN
            },
            this.lerpRotate = .075,
            this.lerpZoom = .1,
            this.lerpPan = .1,
            this.enableRotate = !0,
            this.rotateSpeed = 1,
            this.enableZoom = !0,
            this.enableMouseZoom = !1,
            this.zoomToCursor = !1,
            this.zoomSpeed = 1,
            this.zoomSpeedWheel = .25,
            this.enablePan = !0,
            this.panSpeed = 1,
            this.autoRotate = !1,
            this.autoRotateSpeed = 1,
            this.touchResetPan = !1,
            this.minDistance = 0,
            this.maxDistance = 1 / 0,
            this.minZoom = 0,
            this.maxZoom = 1 / 0,
            this.minPolarAngle = 0,
            this.maxPolarAngle = Math.PI,
            this.minAzimuthAngle = -1 / 0,
            this.maxAzimuthAngle = 1 / 0,
            this.minPanPosition = new b().setScalar(-1 / 0),
            this.maxPanPosition = new b().setScalar(1 / 0),
            this._spherical = new Yl,
            this._sphericalDelta = new Yl,
            this._sphericalTarget = new Yl,
            this._panDelta = new b,
            this._panTarget = new b,
            this._multiTouchDistance = 0,
            this._multiTouchPosition = new H,
            this._zoomCursorPosition = new H,
            this._zoomDelta = 1,
            this._zoomTarget = 1,
            this._zoomPrev = 1,
            this._state = jt.NONE,
            this._enabled = !1,
            this.enable()
        }
        _update()
        {
            if (this._firstUpdate && this.snap(), this.autoRotate && (this._sphericalDelta.theta -= 2 * Math.PI / 60 / 60 * this.autoRotateSpeed * ie.deltaRatio()), this.zoomToCursor) {
                const e = this.isOrthographicCamera ? this._zoomDelta - 1 : 1 - this._sphericalDelta.radius;
                e !== 0 && (Yi.set(this._zoomCursorPosition.x / q.screen.w, 1 - this._zoomCursorPosition.y / q.screen.h).multiplyScalar(2).subScalar(1), this._panDelta.add(rs.subVectors(WD.setCamera(this).unprojectPoint(Yi), this._panTarget).multiplyScalar(e)))
            }
            this._sphericalTarget.theta += this._sphericalDelta.theta,
            this._sphericalTarget.phi += this._sphericalDelta.phi,
            this._sphericalTarget.radius *= this._sphericalDelta.radius,
            this._panTarget.add(this._panDelta),
            this._sphericalDelta.set(1, 0, 0),
            this._panDelta.setScalar(0),
            this._sphericalTarget.theta = ie.clamp(this._sphericalTarget.theta, this.minAzimuthAngle, this.maxAzimuthAngle),
            this._sphericalTarget.phi = ie.clamp(this._sphericalTarget.phi, this.minPolarAngle, this.maxPolarAngle),
            this._sphericalTarget.phi = ie.clamp(this._sphericalTarget.phi, fx, Math.PI - fx),
            this._sphericalTarget.radius = ie.clamp(this._sphericalTarget.radius, this.minDistance, this.maxDistance),
            this._panTarget.clamp(this.minPanPosition, this.maxPanPosition),
            this._spherical.theta = ie.lerpFPS(this._spherical.theta, this._sphericalTarget.theta, this.lerpRotate),
            this._spherical.phi = ie.lerpFPS(this._spherical.phi, this._sphericalTarget.phi, this.lerpRotate),
            this._spherical.radius = ie.lerpFPS(this._spherical.radius, this._sphericalTarget.radius, this.lerpZoom),
            this.baseTarget.lerp(this._panTarget, ie.lerpCoefFPS(this.lerpPan)),
            rs.setFromSpherical(this._spherical),
            this.basePosition.copy(this.baseTarget).add(rs),
            this.isOrthographicCamera && (this._zoomTarget *= this._zoomDelta, this._zoomDelta = 1, this._zoomTarget = ie.clamp(this._zoomTarget, this.minZoom, this.maxZoom), this.zoom = ie.lerpFPS(this.zoom, this._zoomTarget, this.lerpZoom), this.zoom !== this._zoomPrev && (this._zoomPrev = this.zoom, this.updateProjectionMatrix())),
            super._update()
        }
        _handleRotateMove(e)
        {
            Yi.copy(e.delta).multiplyScalar(this.rotateSpeed),
            this._sphericalDelta.theta -= 2 * Math.PI * Yi.x / q.screen.h,
            this._sphericalDelta.phi -= 2 * Math.PI * Yi.y / q.screen.h
        }
        _handleZoomMove(e)
        {
            const t = e.isPinching !== void 0;
            this._zoomCursorPosition.copy(e.isMultiTouchZoom ? this._multiTouchPosition : $t.get(0).position);
            let s = e.delta.y;
            t ? s *= dx * this.zoomSpeedWheel * (e.isPinching ? 10 : 1) : s /= dx * q.screen.h;
            const n = Math.pow(.95, this.zoomSpeed * Math.abs(s));
            this.isPerspectiveCamera ? s < 0 ? this._sphericalDelta.radius *= n : s > 0 && (this._sphericalDelta.radius /= n) : s < 0 ? this._zoomDelta /= n : s > 0 && (this._zoomDelta *= n)
        }
        _handlePanMove(e)
        {
            if (Yi.copy(e.delta).multiplyScalar(this.panSpeed), this.isPerspectiveCamera) {
                rs.copy(this.basePosition).sub(this.baseTarget);
                let t = rs.length();
                t *= Math.tan(this.fov / 2 * Math.PI / 180),
                this._panLeft(2 * Yi.x * t / q.screen.h, this.matrix),
                this._panUp(2 * Yi.y * t / q.screen.h, this.matrix)
            } else
                this._panLeft(Yi.x * (this.right - this.left) / this.zoom / q.screen.w, this.matrix),
                this._panUp(Yi.y * (this.top - this.bottom) / this.zoom / q.screen.h, this.matrix)
        }
        _panLeft(e, t)
        {
            rs.setFromMatrixColumn(t, 0),
            rs.multiplyScalar(-e),
            this._panDelta.add(rs)
        }
        _panUp(e, t)
        {
            rs.setFromMatrixColumn(t, 1),
            rs.multiplyScalar(e),
            this._panDelta.add(rs)
        }
        _getTouchesDistance()
        {
            return Yi.subVectors($t.get(0).position, $t.get(1).position).length()
        }
        _getTouchesMiddle()
        {
            return Yi.addVectors($t.get(0).position, $t.get(1).position).multiplyScalar(.5)
        }
        _handleMultitouchMove()
        {
            if (!($t.getActive().length < 2)) {
                if (Vf.copy(this._multiTouchPosition), this._multiTouchPosition.copy(this._getTouchesMiddle()), this.enableZoom) {
                    const e = this._multiTouchDistance;
                    this._multiTouchDistance = this._getTouchesDistance(),
                    this._handleZoomMove({
                        delta: {
                            y: e - this._multiTouchDistance
                        },
                        isMultiTouchZoom: !0
                    })
                }
                this.enablePan && this._state === jt.ZOOM_PAN ? this._handlePanMove({
                    delta: Yi.subVectors(this._multiTouchPosition, Vf)
                }) : this.enableRotate && this._state === jt.ZOOM_ROTATE && this._handleRotateMove({
                    delta: Yi.subVectors(this._multiTouchPosition, Vf)
                })
            }
        }
        _wheel(e)
        {
            this.enableZoom && (this._state !== jt.NONE && this._state !== jt.ROTATE || this._handleZoomMove(e))
        }
        _touchStart(e)
        {
            if (e.currentInput === "mouse")
                switch (e.button) {
                case this.buttons.ROTATE:
                    if (!this.enableRotate)
                        return;
                    this._state = jt.ROTATE;
                    break;
                case this.buttons.ZOOM:
                case this.buttons.PAN:
                    if (!this.enablePan)
                        return;
                    this._state = jt.PAN;
                    break
                }
            else
                switch ($t.getActive().length) {
                case 1:
                    switch (this.touches.ONE) {
                    case Ha.ROTATE:
                        if (!this.enableRotate)
                            return;
                        this._state = jt.ROTATE;
                        break;
                    case Ha.PAN:
                        if (!this.enablePan)
                            return;
                        this._state = jt.PAN;
                        break;
                    default:
                        this._state = jt.NONE
                    }
                    break;
                case 2:
                    switch (this.touches.TWO) {
                    case Ha.ZOOM_PAN:
                        if (!this.enableZoom && !this.enablePan)
                            return;
                        this._state = jt.ZOOM_PAN,
                        this._multiTouchDistance = this._getTouchesDistance(),
                        this._multiTouchPosition.copy(this._getTouchesMiddle());
                        break;
                    case Ha.ZOOM_ROTATE:
                        if (!this.enableZoom && !this.enableRotate)
                            return;
                        this._state = jt.ZOOM_ROTATE,
                        this._multiTouchDistance = this._getTouchesDistance(),
                        this._multiTouchPosition.copy(this._getTouchesMiddle());
                        break;
                    default:
                        this._state = jt.NONE
                    }
                    break;
                default:
                    this._state = jt.NONE
                }
        }
        _touchDrag(e)
        {
            switch (this._state) {
            case jt.ROTATE:
                if (!this.enableRotate)
                    return;
                this._handleRotateMove(e);
                break;
            case jt.ZOOM:
                if (!this.enableZoom)
                    return;
                this._handleZoomMove(e);
                break;
            case jt.PAN:
                if (!this.enablePan)
                    return;
                this._handlePanMove(e);
                break;
            case jt.ZOOM_PAN:
                if (!this.enableZoom && !this.enablePan)
                    return;
                this._handleMultitouchMove();
                break;
            case jt.ZOOM_ROTATE:
                if (!this.enableZoom && !this.enableRotate)
                    return;
                this._handleMultitouchMove();
                break
            }
        }
        _touchEnd(e)
        {
            this.touchResetPan ? this._state = jt.NONE : e.currentInput === "mouse" ? this._state = jt.NONE : this._touchStart(e)
        }
        snap()
        {
            rs.copy(this.basePosition).sub(this.baseTarget),
            this._spherical.setFromVector3(rs),
            this._sphericalTarget.copy(this._spherical),
            this._sphericalDelta.set(1, 0, 0),
            this._panTarget.copy(this.baseTarget),
            this._panDelta.setScalar(0),
            this._zoomTarget = this.zoom,
            this._zoomDelta = 1
        }
        enable()
        {
            this._enabled || (this._enabled = !0, Q.on("touch_start", this._touchStart, this), Q.on("touch_drag", this._touchDrag, this), Q.on("touch_end", this._touchEnd, this), Q.on("touch2_start", this._touchStart, this), Q.on("touch2_drag", this._touchDrag, this), Q.on("touch2_end", this._touchEnd, this), Q.on("wheel", this._wheel, this))
        }
        disable()
        {
            this._enabled && (this._enabled = !1, this._state = jt.NONE, Q.off("touch_start", this._touchStart, this), Q.off("touch_drag", this._touchDrag, this), Q.off("touch_end", this._touchEnd, this), Q.off("touch2_start", this._touchStart, this), Q.off("touch2_drag", this._touchDrag, this), Q.off("touch2_end", this._touchEnd, this), Q.off("wheel", this._wheel, this))
        }
        dispose()
        {
            this.disable()
        }
    }
}
function qD(i="perspective") {
    const e = Bw(i),
        t = YD(e);
    return new t
}
const XD = new kt,
    Ld = new ot;
Ld.setAttribute("position", new We(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
Ld.setAttribute("uv", new We(new Float32Array([0, 0, 2, 0, 0, 2]), 2));
class KD {
    constructor()
    {
        Oe(this, "webgl", null),
        Oe(this, "domElement", null),
        Oe(this, "info", null),
        Oe(this, "clearColor", new Z("#000000")),
        Oe(this, "clearAlpha", 1)
    }
    init({shadowMap: e, shadowMapType: t}={})
    {
        this.webgl = new ZT({
            alpha: !1,
            antialias: !1,
            stencil: !1,
            depth: !1
        }),
        this.webgl.setClearColor(this.clearColor, this.clearAlpha),
        e === !0 && (this.webgl.shadowMap.enabled = !0, t && (this.webgl.shadowMap.type = t)),
        this.domElement = this.webgl.domElement,
        this.domElement.style.display = "block",
        this.domElement.style.position = "absolute",
        this.domElement.style.top = "0",
        this.domElement.style.left = "0",
        this.info = this.webgl.info,
        this.webgl.debug.checkShaderErrors = !1,
        this.webgl.capabilities.floatLinearFiltering = this.webgl.extensions.has("OES_texture_float_linear"),
        this.webgl.capabilities.floatRenderTarget = this.checkFloatRenderTarget()
    }
    checkFloatRenderTarget()
    {
        const e = new vt(1, 1, {
                minFilter: gt,
                magFilter: gt,
                type: Lt
            }),
            t = new No,
            s = new fe({
                vertexShader: " void main() { gl_Position = vec4(position, 1.0); } ",
                fragmentShader: " void main() { gl_FragColor.rgb = vec3(0.0, 1.0 / 10.0, 1.0 / 20.0); gl_FragColor.a = 1.0; } "
            });
        t.add(new Ce(Ld, s));
        const n = this.webgl.getRenderTarget();
        this.webgl.setRenderTarget(e),
        this.webgl.render(t, new Ln(-1, 1, 1, -1, 0, 1));
        const r = new Float32Array(4);
        return this.webgl.readRenderTargetPixels(e, 0, 0, 1, 1, r), this.webgl.setRenderTarget(n), e.dispose(), s.dispose(), !(r[0] !== 0 || r[1] < .1 || r[2] < .05 || r[3] < 1)
    }
    dispose()
    {
        this.webgl.dispose(),
        this.webgl = null,
        this.domElement = null,
        this.info = null
    }
}
const Je = new KD,
    Wf = new b,
    px = new b,
    Va = new wi,
    Dw = new b,
    Rw = new b,
    Uw = new b,
    Lw = new wi,
    JD = new H,
    jD = new b,
    ZD = new yt;
function Fw(i, e, t={
    point: Dw,
    triangle: Lw,
    triangleIndex: 0,
    triangleNormal: Rw,
    triangleBarycoord: Uw,
    nearestPointIndex: 0
}) {
    let s = 1 / 0;
    for (let r = 0; r < e.geometry.index.count; r += 3) {
        Va.setFromAttributeAndIndices(e.geometry.attributes.position, e.geometry.index.array[r], e.geometry.index.array[r + 1], e.geometry.index.array[r + 2]),
        Va.a.applyMatrix4(e.matrixWorld),
        Va.b.applyMatrix4(e.matrixWorld),
        Va.c.applyMatrix4(e.matrixWorld),
        Va.closestPointToPoint(i, Wf);
        const a = i.distanceToSquared(Wf);
        a < s && (s = a, t.triangleIndex = r, t.point.copy(Wf), t.triangle.copy(Va))
    }
    t.triangle.getNormal(t.triangleNormal),
    t.triangle.getBarycoord(t.point, t.triangleBarycoord);
    let n = 0;
    return t.triangleBarycoord.y > t.triangleBarycoord.x && t.triangleBarycoord.y > t.triangleBarycoord.z && (n = 1), t.triangleBarycoord.z > t.triangleBarycoord.x && t.triangleBarycoord.z > t.triangleBarycoord.y && (n = 2), t.nearestPointIndex = e.geometry.index.array[t.triangleIndex + n], t
}
function $D(i, e="uv", t, s="uv1") {
    if (!i.geometry.attributes[e])
        throw new Error(`The source geometry doesn't have the ${e} attribute.`);
    const n = t.geometry.attributes.position,
        r = n.count,
        a = i.geometry.attributes[e].itemSize;
    t.geometry.attributes[s] || t.geometry.setAttribute(s, new We(new Float32Array(r * a), a));
    const o = t.geometry.attributes[s].array;
    i.updateMatrixWorld(),
    t.updateMatrixWorld();
    let l = JD;
    a === 3 ? l = jD : a === 4 && (l = ZD);
    const c = l.clone(),
        h = {
            point: Dw,
            triangle: Lw,
            triangleIndex: 0,
            triangleNormal: Rw,
            triangleBarycoord: Uw,
            nearestPointIndex: 0
        };
    for (let d = 0; d < r; d++) {
        px.fromBufferAttribute(n, d).applyMatrix4(t.matrixWorld),
        Fw(px, i, h);
        const u = i.geometry.index.array[h.triangleIndex],
            f = i.geometry.index.array[h.triangleIndex + 1],
            p = i.geometry.index.array[h.triangleIndex + 2];
        if (a === 1) {
            const A = i.geometry.attributes[e].array[u],
                m = i.geometry.attributes[e].array[f],
                g = i.geometry.attributes[e].array[p];
            o[d] = A * h.triangleBarycoord.x + m * h.triangleBarycoord.y + g * h.triangleBarycoord.z
        } else
            l.setScalar(0),
            l.addScaledVector(c.fromBufferAttribute(i.geometry.attributes[e], u), h.triangleBarycoord.x),
            l.addScaledVector(c.fromBufferAttribute(i.geometry.attributes[e], f), h.triangleBarycoord.y),
            l.addScaledVector(c.fromBufferAttribute(i.geometry.attributes[e], p), h.triangleBarycoord.z),
            o.set(l.toArray(), d * a)
    }
    t.geometry.attributes[s].needsUpdate = !0
}
const xu = new b;
class eR extends b {
    constructor(e, t, s)
    {
        super(e, t, s),
        this.acceleration = new b,
        this.velocity = new b,
        this.restPosition = new b(e, t, s),
        this.restStrength = 0,
        this.locked = !1
    }
    update(e=.97)
    {
        if (this.locked) {
            this.acceleration.setScalar(0),
            this.velocity.setScalar(0),
            this.copy(this.restPosition);
            return
        }
        const t = ie.deltaRatio();
        this.velocity.add(xu.copy(this.acceleration).multiplyScalar(t)),
        this.add(xu.copy(this.velocity).multiplyScalar(t));
        const s = ie.frictionFPS(e);
        if (this.velocity.multiplyScalar(s), this.acceleration.setScalar(0), this.restStrength > 0) {
            const n = xu.copy(this.restPosition).sub(this).multiplyScalar(this.restStrength);
            this.acceleration.add(n)
        }
    }
    copy(e)
    {
        super.copy(e),
        this.acceleration.copy(e.acceleration),
        this.velocity.copy(e.velocity),
        this.restPosition.copy(e.restPosition),
        this.restStrength = e.restStrength,
        this.locked = e.locked
    }
}
class tR {
    constructor(e, t)
    {
        this.a = e,
        this.b = t,
        this.strength = .05,
        this.restLength = this.a.distanceTo(this.b),
        this.fixedLength = !1
    }
    update(e=.999)
    {
        const t = xu.copy(this.b).sub(this.a),
            s = t.length() - this.restLength;
        if (this.fixedLength)
            t.normalize().multiplyScalar(this.restLength),
            this.b.locked || (this.b.copy(this.a).add(t), this.a.acceleration.setScalar(0), this.a.velocity.setScalar(0), this.b.acceleration.setScalar(0), this.b.velocity.setScalar(0));
        else {
            const n = ie.frictionFPS(e),
                r = t.normalize().multiplyScalar(s * this.strength * n);
            this.a.locked || this.a.acceleration.add(r),
            this.b.locked || this.b.acceleration.sub(r)
        }
    }
    copy(e)
    {
        this.a.copy(e.a),
        this.b.copy(e.b),
        this.strength = e.strength,
        this.restLength = e.restLength,
        this.fixedLength = e.fixedLength
    }
}
const Wa = new H,
    mx = new b,
    Si = {
        plane: XD,
        triangle: Ld,
        planeInteraction: new Pw,
        createDummyRT() {
            const i = new vt(2, 2, {
                type: Mi
            });
            return i.setSize = () => {}, i.dispose = () => {}, i
        },
        attribTransfer: $D,
        closestPointInfo: Fw,
        positionUI({camera: i, mesh: e, x: t=0, y: s=0, width: n=1, height: r=1, distance: a=null, billboardCamera: o=!0}={}) {
            const l = a || mx.subVectors(i.position, i.target).length();
            i.getViewSize(l, Wa);
            const c = Wa.y / q.screen.height;
            e.scale.set(n * c, r * c, 1);
            const h = t / q.screen.width,
                d = s / q.screen.height;
            e.position.copy(i.position).add(mx.set(Wa.x * -.5 + Wa.x * h, Wa.y * .5 - Wa.y * d, -l).applyQuaternion(i.quaternion)),
            o && e.quaternion.copy(i.quaternion),
            e.updateMatrixWorld()
        },
        point: eR,
        spring: tR
    },
    Ax = Si.createDummyRT();
class Jo extends No {
    constructor({orbit: e=!1, follow: t=!1, cameraType: s="perspective"}={})
    {
        super();
        const n = e ? qD : VD;
        this.camera = n(s),
        this.camera.matrixWorldAutoUpdate = !1,
        this.composer = null,
        this.matrixWorldAutoUpdate = !0,
        this.matrixAutoUpdate = !1,
        this.beforeRenderCbs = [],
        this._textures = new Set,
        this.customUploadRT = null,
        this.uploaded = new Promise(r => {
            this._isUploaded = r
        }),
        this.ready = new Promise(r => {
            this.isReady = r
        }).then(() => {
            this._upload()
        })
    }
    async _upload()
    {
        this.traverse(t => {
            var s,
                n,
                r,
                a;
            (s = t.material) != null && s.isMaterial ? (t.frustumCulled && (t.boundingSphere === null ? t.computeBoundingSphere() : ((n = t.geometry) == null ? void 0 : n.boundingSphere) === null && t.geometry.computeBoundingSphere()), t.material.uniforms && Object.entries(t.material.uniforms).forEach(([o, l]) => {
                var c;
                (c = l.value) != null && c.isTexture && l.value._loaded && this._textures.add(l.value)
            }), Object.entries(t.material).forEach(([o, l]) => {
                l != null && l.isTexture && l._loaded && this._textures.add(l)
            }), t.__uploadVars = {
                cull: t.frustumCulled,
                visible: t.visible,
                materialVisible: t.material.visible,
                customDepthMaterialVisible: (r = t.customDepthMaterial) == null ? void 0 : r.visible,
                customDistanceMaterialVisible: (a = t.customDistanceMaterial) == null ? void 0 : a.visible
            }, t.frustumCulled = !1, t.visible = !0, t.material.visible = !0, t.customDepthMaterial && (t.customDepthMaterial.visible = !0), t.customDistanceMaterial && (t.customDistanceMaterial.visible = !0)) : t.isLOD && (t.__uploadVars = {
                autoUpdate: t.autoUpdate
            }, t.autoUpdate = !1)
        });
        const e = [];
        Je.webgl.setRenderTarget(this.customUploadRT || Ax),
        e.push(Je.webgl.compileAsync(this, this.camera)),
        this._textures.size > 0 && e.push(...Array.from(this._textures).map(t => t._loaded.then(() => Je.webgl.initTexture(t)))),
        await Promise.all(e),
        Je.webgl.setRenderTarget(this.customUploadRT || Ax),
        Je.webgl.render(this, this.camera),
        this.traverse(t => {
            var s;
            t.__uploadVars && ((s = t.material) != null && s.isMaterial ? (t.frustumCulled = t.__uploadVars.cull, t.visible = t.__uploadVars.visible, t.material.visible = t.__uploadVars.materialVisible, t.customDepthMaterial && (t.customDepthMaterial.visible = t.__uploadVars.depthMaterialVisible), t.customDistanceMaterial && (t.customDistanceMaterial.visible = t.__uploadVars.distanceMaterialVisible)) : t.isLOD && (t.autoUpdate = t.__uploadVars.autoUpdate), delete t.__uploadVars)
        }),
        this._isUploaded()
    }
    debug()
    {
        tu.addToGui(this)
    }
    updateMatrixWorld(e)
    {
        super.updateMatrixWorld(e),
        !Sc.hasRunThisFrame(this) && (this.camera._resize(), this.camera._update(), this.camera.updateMatrixWorld(), this.beforeRenderCbs.forEach(t => t()))
    }
    dispose()
    {
        var e,
            t,
            s,
            n;
        (t = (e = this.camera).dispose) == null || t.call(e),
        this.beforeRenderCbs = [],
        (n = (s = this.customUploadRT) == null ? void 0 : s.dispose) == null || n.call(s),
        this._textures.forEach(r => {
            var a;
            return (a = r.dispose) == null ? void 0 : a.call(r)
        }),
        this._textures.clear(),
        this.traverse(r => {
            var a,
                o,
                l,
                c,
                h,
                d;
            (o = (a = r.geometry) == null ? void 0 : a.dispose) == null || o.call(a),
            (l = r.material) != null && l.isMaterial && (r.material.uniforms ? Object.entries(r.material.uniforms).forEach(([u, f]) => {
                var p,
                    A,
                    m;
                (p = f.value) != null && p.isTexture && ((m = (A = f.value).dispose) == null || m.call(A))
            }) : Object.entries(r.material).forEach(([u, f]) => {
                var p;
                f != null && f.isTexture && ((p = f.dispose) == null || p.call(f))
            }), (h = (c = r.material).dispose) == null || h.call(c)),
            r !== this && ((d = r.dispose) == null || d.call(r))
        }),
        this.clear()
    }
}
