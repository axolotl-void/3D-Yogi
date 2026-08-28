class jo {
    constructor(e=4)
    {
        this.pool = e,
        this.queue = [],
        this.workers = [],
        this.workersResolve = [],
        this.workerStatus = 0
    }
    _initWorker(e)
    {
        if (!this.workers[e]) {
            const t = this.workerCreator();
            t.addEventListener("message", this._onMessage.bind(this, e)),
            this.workers[e] = t
        }
    }
    _getIdleWorker()
    {
        for (let e = 0; e < this.pool; e++)
            if (!(this.workerStatus & 1 << e))
                return e;
        return -1
    }
    _onMessage(e, t)
    {
        const s = this.workersResolve[e];
        if (s && s(t), this.queue.length) {
            const {resolve: n, msg: r, transfer: a} = this.queue.shift();
            this.workersResolve[e] = n,
            this.workers[e].postMessage(r, a)
        } else
            this.workerStatus ^= 1 << e
    }
    setWorkerCreator(e)
    {
        this.workerCreator = e
    }
    setWorkerLimit(e)
    {
        this.pool = e
    }
    postMessage(e, t)
    {
        return new Promise(s => {
            const n = this._getIdleWorker();
            n !== -1 ? (this._initWorker(n), this.workerStatus |= 1 << n, this.workersResolve[n] = s, this.workers[n].postMessage(e, t)) : this.queue.push({
                resolve: s,
                msg: e,
                transfer: t
            })
        })
    }
    dispose()
    {
        this.workers.forEach(e => e.terminate()),
        this.workersResolve.length = 0,
        this.workers.length = 0,
        this.queue.length = 0,
        this.workerStatus = 0
    }
}
function iR() {
    return new Worker("/assets/audioworker-036a09db.js")
}
const mg = new Ts;
mg.setResponseType("arraybuffer");
const Nw = new jo(1);
Nw.setWorkerCreator(() => new iR);
const Ow = {
    _audiobuffersCache: new Map,
    _initLoad(i, e) {
        return this._audiobuffersCache.has(i) || this._audiobuffersCache.set(i, new Promise(e)), this._audiobuffersCache.get(i)
    },
    load(i) {
        return this._initLoad(i, async e => {
            try {
                const t = await mg.loadAsync(i),
                    s = (await Nw.postMessage({
                        buffer: t
                    }, [t])).data;
                if (s.error)
                    throw new Error("audio could not be decoded");
                const n = he.audio.context.createBuffer(s.channelData.length, s.samplesDecoded, s.sampleRate);
                s.channelData.forEach((r, a) => n.getChannelData(a).set(r)),
                e(n)
            } catch (t) {
                console.log(`audio ${i} load error: ${t}`),
                e(!1)
            }
        })
    }
};
function sR() {
    Ow._audiobuffersCache.clear()
}
function nR() {
    mg.setPath(`${q.absolutePath}/assets/audio/`)
}
function rR() {
    let i = null;
    onmessage = function(o) {
        const l = o.data;
        if (l.init) {
            i = new Promise(c => {
                DracoDecoderModule({
                    onModuleLoaded: h => {
                        c({
                            draco: h
                        })
                    },
                    ...l.init
                })
            });
            return
        }
        i.then(c => {
            const h = c.draco,
                d = new h.Decoder;
            try {
                const u = s(h, d, l.buffer),
                    f = u.attributes.map(p => p.array.buffer);
                u.index && f.push(u.index.array.buffer),
                self.postMessage({
                    geometry: u
                }, f)
            } catch (u) {
                console.error(u),
                self.postMessage({
                    error: !0
                })
            } finally {
                h.destroy(d)
            }
        })
    };
    const e = ["Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array"],
        t = new TextDecoder;
    function s(o, l, c) {
        let h = null,
            d = null;
        const u = t.decode(new Uint8Array(c.slice(0, 5))) === "DRACO";
        if (u)
            h = new Int8Array(c);
        else {
            const v = new Uint32Array(c.slice(0, 4))[0];
            d = JSON.parse(t.decode(c.slice(4, 4 + v))),
            h = new Int8Array(c.slice(4 + v))
        }
        let f = null,
            p = null;
        const A = l.GetEncodedGeometryType(h);
        if (A === o.TRIANGULAR_MESH)
            f = new o.Mesh,
            p = l.DecodeArrayToMesh(h, h.byteLength, f);
        else if (A === o.POINT_CLOUD)
            f = new o.PointCloud,
            p = l.DecodeArrayToPointCloud(h, h.byteLength, f);
        else
            throw new Error("THREE.DRACOLoader: Unexpected geometry type.");
        if (!p.ok() || f.ptr === 0)
            throw new Error(`THREE.DRACOLoader: Decoding failed: ${p.error_msg()}`);
        if (u) {
            const v = new o.MetadataQuerier,
                y = l.GetMetadata(f);
            v.HasEntry(y, "info") && (d = JSON.parse(v.GetStringEntry(y, "info"))),
            o.destroy(v)
        }
        const m = {},
            g = {};
        d.attributes.forEach((v, y) => {
            const S = v[0];
            m[S] = y,
            g[S] = e[v[1]]
        });
        const x = {
            index: null,
            attributes: [],
            userData: {}
        };
        d.userData && (x.userData = d.userData);
        for (const v in m) {
            const y = self[g[v]];
            let S = null,
                w = null;
            w = m[v],
            S = l.GetAttributeByUniqueId(f, w);
            const C = r(o, l, f, v, y, S);
            x.attributes.push(C)
        }
        return A === o.TRIANGULAR_MESH && (x.index = n(o, l, f)), o.destroy(f), x
    }
    function n(o, l, c) {
        const h = c.num_faces() * 3,
            d = h * 4,
            u = o._malloc(d);
        l.GetTrianglesUInt32Array(c, d, u);
        const f = new Uint32Array(o.HEAPF32.buffer, u, h).slice();
        return o._free(u), {
            array: f,
            itemSize: 1
        }
    }
    function r(o, l, c, h, d, u) {
        const f = u.num_components(),
            p = c.num_points() * f,
            A = p * d.BYTES_PER_ELEMENT,
            m = a(o, d),
            g = o._malloc(A);
        l.GetAttributeDataArrayForAllPoints(c, u, m, A, g);
        const x = new d(o.HEAPF32.buffer, g, p).slice();
        return o._free(g), {
            name: h,
            array: x,
            itemSize: f
        }
    }
    function a(o, l) {
        switch (l) {
        case Float32Array:
            return o.DT_FLOAT32;
        case Int8Array:
            return o.DT_INT8;
        case Int16Array:
            return o.DT_INT16;
        case Int32Array:
            return o.DT_INT32;
        case Uint8Array:
            return o.DT_UINT8;
        case Uint16Array:
            return o.DT_UINT16;
        case Uint32Array:
            return o.DT_UINT32
        }
    }
}
var Yr,
    yu,
    Ao,
    no,
    go,
    Ll,
    Sh,
    Um,
    kw,
    Lm,
    zw;
class aR {
    constructor()
    {
        te(this, Ll),
        te(this, Um),
        te(this, Lm),
        te(this, Yr, new Map),
        te(this, yu, new Ts().setResponseType("arraybuffer")),
        te(this, Ao, ""),
        te(this, no, null),
        te(this, go, new jo)
    }
    setDecoderPath(e)
    {
        et(this, Ao, e)
    }
    setPath(e)
    {
        U(this, yu).setPath(e)
    }
    setWorkerLimit(e)
    {
        return U(this, go).setWorkerLimit(e), this
    }
    loadAsync(e)
    {
        if (U(this, Yr).has(e))
            return U(this, Yr).get(e);
        const t = new Promise((s, n) => {
            Promise.all([ve(this, Um, kw).call(this), U(this, yu).loadAsync(e)]).then(([r, a]) => U(this, go).postMessage({
                buffer: a
            }, [a])).then(r => {
                r.data.error ? n(new Error(`buffer "${e}" could not be decoded.`)) : s(ve(this, Lm, zw).call(this, r.data.geometry))
            }).catch(r => {
                n(new Error(r))
            })
        });
        return U(this, Yr).set(e, t), t
    }
    dispose()
    {
        U(this, go).dispose(),
        U(this, Yr).forEach(e => e.then(t => t.dispose())),
        U(this, Yr).clear()
    }
}
Yr = new WeakMap,
yu = new WeakMap,
Ao = new WeakMap,
no = new WeakMap,
go = new WeakMap,
Ll = new WeakSet,
Sh = function(i, e) {
    const t = new Ts;
    return t.setResponseType(e), t.loadAsync(i)
},
Um = new WeakSet,
kw = function() {
    if (U(this, no))
        return U(this, no);
    const i = [],
        e = typeof WebAssembly != "object";
    return e ? i.push(ve(this, Ll, Sh).call(this, `${U(this, Ao)}draco_decoder.js`, "text")) : (i.push(ve(this, Ll, Sh).call(this, `${U(this, Ao)}draco_wasm_wrapper.js`, "text")), i.push(ve(this, Ll, Sh).call(this, `${U(this, Ao)}draco_decoder.wasm`, "arraybuffer"))), et(this, no, Promise.all(i).then(t => {
        const s = rR.toString(),
            n = ["/* draco decoder */", t[0], "", "/* worker */", s.substring(s.indexOf("{") + 1, s.lastIndexOf("}"))].join(`
            `),
            r = URL.createObjectURL(new Blob([n])),
            a = e ? {} : {
                wasmBinary: t[1]
            };
        U(this, go).setWorkerCreator(() => {
            const o = new Worker(r);
            return o.postMessage({
                init: a
            }), o
        })
    })), U(this, no)
},
Lm = new WeakSet,
zw = function(i) {
    const e = new ot;
    i.index && e.setIndex(new We(i.index.array, 1));
    for (let t = 0; t < i.attributes.length; t++) {
        const s = i.attributes[t],
            n = s.name,
            r = s.array,
            a = s.itemSize;
        e.setAttribute(n, new We(r, a))
    }
    return i.userData && (e.userData = i.userData), e
};
const yn = new It,
    gx = ["scale", "quaternion", "position"],
    vx = new b,
    xx = new b;
function Qw(i, e) {
    const t = i.clone(),
        s = e.clone(),
        n = new Td;
    n.instanceCount = Object.values(s.attributes)[0].count,
    t.index && n.setIndex(t.index);
    for (const a in t.attributes)
        n.setAttribute(a, t.attributes[a]);
    for (const a in s.attributes) {
        if (gx.includes(a))
            continue;
        const o = s.attributes[a],
            l = new gr(o.array, o.itemSize, o.normalized, 1);
        a === "color" ? n._colors = l : n.setAttribute(a, l)
    }
    const r = [];
    for (let a = 0; a < n.instanceCount; a++)
        yn.scale.setScalar(1),
        yn.quaternion.identity(),
        yn.position.setScalar(0),
        gx.forEach(o => {
            const l = s.attributes[o];
            if (!(!l || o === "color"))
                switch (o) {
                case "scale":
                    l.itemSize === 1 ? yn.scale.setScalar(l.array[a]) : yn.scale.fromArray(l.array, a * 3);
                    break;
                case "quaternion":
                    yn.quaternion.fromArray(l.array, a * 4).normalize();
                    break;
                case "position":
                    yn.position.fromArray(l.array, a * 3);
                    break
                }
        }),
        yn.updateMatrix(),
        r.push(...yn.matrix.toArray());
    return n._matrixArray = new Float32Array(r), i.__vertexAnimationUniforms && (n.__vertexAnimationUniforms = i.__vertexAnimationUniforms), n
}
function oR(i, e, t) {
    const s = Object.keys(e.attributes),
        n = e.attributes.position,
        r = n.count,
        a = Array.from(Array(r).keys()),
        o = [],
        l = [];
    let c = 0;
    const h = [];
    for (; a.length > 0;) {
        o.push(c),
        h.push(c),
        a.splice(a.indexOf(c), 1),
        vx.fromBufferAttribute(n, c);
        let d = null,
            u = 1 / 0,
            f = !1;
        if (a.forEach(p => {
            xx.fromBufferAttribute(n, p);
            const A = xx.distanceToSquared(vx);
            A < u && (d = p, u = A)
        }), d && (c = d, Math.sqrt(u) < t.maxDistance && (f = !0)), h.length > 0 && (h.length === t.maxPerPatch || !f || o.length === r)) {
            const p = new ot;
            s.forEach(A => {
                const m = e.attributes[A],
                    g = new Float32Array(m.itemSize * h.length);
                for (let x = 0; x < h.length; x++) {
                    const v = h[x] * m.itemSize,
                        y = [];
                    for (let S = 0; S < m.itemSize; S++)
                        y.push(m.array[v + S]);
                    g.set(y, x * m.itemSize)
                }
                p.setAttribute(A, new We(g, m.itemSize))
            }),
            l.push(Qw(i, p)),
            h.length = 0
        }
    }
    return l
}
const Yf = "batchId";
function lR(i) {
    if (!i.attributes[Yf] || !i.getIndex())
        return console.warn("Geometry does not have a batchId or an index attribute"), [i];
    const e = i.getIndex(),
        t = new Set,
        s = new Map,
        n = new Map;
    for (let a = 0; a < e.count; a++) {
        const o = e.array[a],
            l = i.attributes[Yf].array[o];
        t.add(l),
        n.has(l) || n.set(l, new Map),
        s.has(l) || s.set(l, []);
        const c = n.get(l),
            h = s.get(l);
        if (c.has(o))
            h.push(c.get(o));
        else {
            const d = c.size;
            c.set(o, d),
            h.push(d)
        }
    }
    const r = [];
    for (const a of t) {
        const o = new ot,
            l = n.get(a),
            c = s.get(a);
        for (const d in i.attributes) {
            if (d === Yf)
                continue;
            const u = i.getAttribute(d),
                {array: f, itemSize: p, normalized: A} = u,
                m = new u.constructor(new f.constructor(l.size * p), p, A);
            o.setAttribute(d, m),
            l.forEach((g, x) => {
                const v = g * p,
                    y = x * p;
                for (let S = 0; S < p; S++)
                    m.array[v + S] = u.array[y + S]
            })
        }
        const h = c.length > 65535 ? Uint32Array : Uint16Array;
        o.setIndex(new We(new h(c), 1)),
        r.push(o)
    }
    return r
}
function cR(i) {
    return i.charAt(0).toUpperCase() + i.slice(1)
}
function hR(i) {
    const e = i.userData,
        t = Object.keys(i.attributes),
        s = t.filter(o => o.slice(-2) === "_1").map(o => o.substring(0, o.length - 2)),
        n = t.filter(o => o.slice(-2) === "_2").map(o => o.substring(0, o.length - 2)),
        r = new ot;
    i.index && r.setIndex(i.index.clone()),
    s.forEach(o => {
        r.setAttribute(o, i.attributes[`${o}_1`].clone())
    });
    const a = {};
    if (n.length > 0) {
        const o = i.attributes[`${n[0]}_1`].count,
            l = o * e.frames,
            c = ie.getTextureSizeParticles(l),
            h = c * c;
        a.uAnimInfo = {
            value: new yt(e.fps, e.frames, o, c),
            ignore: !0
        };
        const d = new Float32Array(o);
        for (let u = 0; u < d.length; u++)
            d[u] = u;
        r.setAttribute("vposition", new We(d, 1)),
        n.forEach(u => {
            const f = new Float32Array(h * 4);
            for (let A = 0; A < e.frames; A++) {
                const m = i.attributes[`${u}_${A + 1}`].array;
                for (let g = 0; g < o; g++) {
                    const x = A * o * 4 + g * 4,
                        v = g * 3;
                    f[x + 0] = m[v + 0],
                    f[x + 1] = m[v + 1],
                    f[x + 2] = m[v + 2],
                    f[x + 3] = 1
                }
            }
            const p = new Hi(f, c, c, wt, Lt);
            p.needsUpdate = !0,
            a[`t${cR(u)}`] = {
                value: p
            }
        })
    }
    return r.__vertexAnimationUniforms = a, r
}
function uR(i, e, t) {
    const s = [];
    return Object.values(i.attributes).forEach(n => {
        const r = n.count,
            a = n.array,
            o = [];
        for (let h = 0; h < r; h++)
            o.push(new b(a[h * 3 + 0], a[h * 3 + 1], a[h * 3 + 2]));
        const l = new TI;
        for (let h = 0; h < o.length - 1; h++)
            l.add(new Yy(o[h], o[h + 1]));
        t && (l.autoClose = !0);
        const c = l.getPoints(Math.round(l.getLength() * 10 * e));
        s.push({
            curve: l,
            geometry: new ot().setFromPoints(c)
        })
    }), s
}
const dR = new qy;
function fR(i, e) {
    const t = [];
    for (let a = 0; a < e.attributes.position.count; a++) {
        const o = new NA;
        o.name = `bone_${a}`,
        o.position.fromArray(e.attributes.position.array, a * 3),
        o.quaternion.fromArray(e.attributes.quaternion.array, a * 4).normalize(),
        o.scale.fromArray(e.attributes.scale.array, a * 3),
        t.push(o)
    }
    const s = [];
    for (let a = 0; a < e.attributes.hierarchy.count; a++) {
        const o = e.attributes.hierarchy.array[a] - 1;
        o === -1 ? s.push(a) : t[o].add(t[a])
    }
    const n = new Sd(t),
        r = new Gy(i, dR);
    return s.forEach(a => r.add(n.bones[a])), r.bind(n), r.normalizeSkinWeights(), r
}
function pR() {
    return new Worker("/assets/msdfworker-ac346fa7.js")
}
const mR = /\s/;
class AR {
    constructor()
    {
        this.jsonLoader = new Ts,
        this.jsonCache = new Map,
        this.workerPool = new jo,
        this.workerPool.setWorkerCreator(() => new pR)
    }
    loadAsync(e)
    {
        return new Promise(async t => {
            if (!e.font)
                throw new Error("You must specify a MSDF font.");
            const s = e.font;
            this.jsonCache.has(s) || this.jsonCache.set(s, new Promise(async a => {
                try {
                    const o = JSON.parse(await this.jsonLoader.loadAsync(`${e.font}.json`)),
                        l = o.glyphs;
                    o.glyphs = {},
                    l.forEach(c => {
                        const h = String.fromCharCode(c.unicode);
                        c.isWhitespace = mR.test(h),
                        o.glyphs[h] = c
                    }),
                    o.placeholderChar = Object.keys(o.glyphs).sort()[0],
                    a(o)
                } catch (o) {
                    console.log("Error loading msdf json:", o),
                    a(!1)
                }
            }));
            const n = new ot,
                r = await this.jsonCache.get(s);
            if (r) {
                const a = (await this.workerPool.postMessage({
                    font: r,
                    options: e
                })).data.buffers;
                n.setIndex(new We(a.index, 1)),
                n.setAttribute("position", new We(a.position, 3)),
                n.setAttribute("uv", new We(a.uv, 2)),
                n.setAttribute("uvMask", new We(a.uvMask, 4)),
                n.setAttribute("textWeights", new We(a.textWeights, 2)),
                n.setAttribute("lineWeights", new We(a.lineWeights, 3)),
                n.setAttribute("centr", new We(a.centr, 3)),
                n._maxLineHeight = a.maxLineHeight,
                n._maxUVDisp = a.maxUVDisp
            } else
                n._maxLineHeight = 0,
                n._maxUVDisp = 0;
            n.computeBoundingBox(),
            t(n)
        })
    }
    setPath(e)
    {
        this.jsonLoader.setPath(e)
    }
    setWorkerLimit(e)
    {
        return this.workerPool.setWorkerLimit(e), this
    }
    dispose()
    {
        this.workerPool.dispose(),
        this.jsonCache.clear()
    }
}
const gR = ["scale", "quaternion", "position"],
    qf = new b,
    Mh = new Vi,
    yx = new Vi,
    dl = new Vi,
    vR = new Vi;
class xR {
    constructor(e)
    {
        const t = e.userData;
        this._frames = t.frames,
        this._fps = t.fps,
        this._duration = this._frames / this._fps,
        this._attribs = e.attributes,
        this._camTargetDistance = 1,
        this._object = null,
        this._animationVar = 0,
        this._animation = re.to(this, {
            _animationVar: 1,
            duration: this._duration,
            ease: "none",
            paused: !0,
            callbackScope: this,
            onUpdate: this._onUpdate
        })
    }
    _onUpdate()
    {
        if (!this._object)
            return;
        const e = this._frames - 1,
            t = ie.clamp(e * this._animationVar, 0, e),
            s = Math.floor(t),
            n = Math.ceil(t),
            r = Math.abs(t - s);
        this._object.isCamera && dl.identity(),
        gR.forEach(a => {
            const o = this._attribs[a];
            if (!(!o || !this._object[a]) && !(this._object.isCamera && a === "scale"))
                switch (a) {
                case "scale":
                    o.itemSize === 1 ? this._object.scale.setScalar(ie.lerp(o.array[s], o.array[n], r)) : this._object.scale.fromArray(o.array, s * 3).lerp(qf.fromArray(o.array, n * 3), r);
                    break;
                case "quaternion":
                    Mh.fromArray(o.array, s * 4).normalize(),
                    yx.fromArray(o.array, n * 4).normalize(),
                    Mh.slerp(yx, r),
                    this._object.isCamera ? dl.copy(Mh) : this._object.quaternion.copy(Mh);
                    break;
                case "position":
                    this._object[this._object.isCamera ? "basePosition" : "position"].fromArray(o.array, s * 3).lerp(qf.fromArray(o.array, n * 3), r);
                    break
                }
        }),
        this._object.isCamera && !dl.equals(vR) && (this._object.baseTarget.set(0, 0, -this._camTargetDistance).applyQuaternion(dl).add(this._object.basePosition), this._object.baseUp.set(0, 1, 0).applyQuaternion(dl))
    }
    use(e, t=!0)
    {
        return this._object = e, this._object.isCamera && t && (this._camTargetDistance = qf.copy(this._object.baseTarget).sub(this._object.basePosition).length()), this.progress(0)
    }
    play()
    {
        return this._animation.play()
    }
    pause()
    {
        return this._animation.pause()
    }
    progress(e=0)
    {
        return this._animation.progress(e)
    }
    restart()
    {
        return this._animation.restart()
    }
    dispose()
    {
        this._animation.kill(),
        this._object = null
    }
}
function yR(i, e) {
    if (!Object.hasOwn(e.userData, "frames") || !Object.hasOwn(e.userData, "fps"))
        return new Gp(i, 0, []);
    const t = e.userData,
        s = t.frames,
        n = e.attributes.position.count / s,
        r = s / t.fps,
        a = r / (s - 1),
        o = new Array(s).fill(0).map((h, d) => d * a),
        l = {};
    ["position", "quaternion", "scale"].forEach(h => {
        const d = e.attributes[h].array,
            u = e.attributes[h].itemSize;
        for (let f = 0; f < n; f++) {
            const p = `bone_${f}.${h}`;
            l[p] = {
                size: u,
                arr: []
            };
            for (let A = 0; A < s; A++) {
                const m = A * n * u;
                for (let g = 0; g < u; g++)
                    l[p].arr.push(d[m + f * u + g])
            }
        }
    });
    const c = [];
    return Object.keys(l).forEach(h => {
        const d = l[h].size === 4 ? da : fa;
        c.push(new d(h, o, l[h].arr, Ro))
    }), new Gp(i, r, c)
}
const Gw = new YI,
    hd = new aR().setWorkerLimit(1),
    Ag = new AR().setWorkerLimit(1),
    _R = new Wo(.5, .5, .5),
    zt = {
        _geometryCache: new Map,
        _initLoad(i, e) {
            return this._geometryCache.has(i) || this._geometryCache.set(i, new Promise(e)), this._geometryCache.get(i)
        },
        load(i, e="default") {
            return this._initLoad(`${i}_<>_${e}`, async t => {
                const s = i.split(".").pop();
                let n = null;
                try {
                    s.startsWith("drc") || s.startsWith("bin") ? n = await hd.loadAsync(i) : n = await Gw.loadAsync(i),
                    n._loadMode = e,
                    t(n)
                } catch (r) {
                    console.log("Geometry loader", r),
                    t(_R)
                }
            })
        },
        instanced(i, e, t="load") {
            return this._initLoad(`instanced_<>_${i}-${e}`, async s => {
                const [n, r] = await Promise.all([this[t](i), this.load(e)]);
                s(Qw(n, r))
            })
        },
        instancedPatches(i, e, {maxPerPatch: t=25, maxDistance: s=50}={}, n="load") {
            return this._initLoad(`instancedPatches_<>_${i}-${e}-${t}-${s}`, async r => {
                const [a, o] = await Promise.all([this[n](i), this.load(e)]);
                r(oR(a, o, {
                    maxPerPatch: t,
                    maxDistance: s,
                    name: e
                }))
            })
        },
        batched(i) {
            return this._initLoad(`batched_<>_${i}`, async e => {
                const t = await this.load(i);
                e(lR(t))
            })
        },
        vertexAnimation(i) {
            return this._initLoad(`vertexanimation_<>_${i}`, async e => {
                const t = await this.load(i);
                e(hR(t))
            })
        },
        curves(i, e=!1, t=1) {
            return this._initLoad(`curves_<>_${i}_${e}_${t}`, async s => {
                const n = await this.load(i);
                s(uR(n, t, e))
            })
        },
        pointAnimation(i) {
            return this._initLoad(`pointAnimation_<>_${i}}`, async e => {
                const t = await this.load(i);
                e(new xR(t))
            })
        },
        skin(i, e) {
            return this._initLoad(`skin_<>_${i}-${e}`, async t => {
                const [s, n] = await Promise.all([this.load(i), this.load(e)]);
                t(fR(s, n))
            })
        },
        skinAnimation(i) {
            return this._initLoad(`skinanimation_<>_${i}`, async e => {
                const t = await this.load(i);
                e(yR(i, t))
            })
        },
        msdf(i) {
            return Ag.loadAsync(i)
        }
    };
function wR() {
    Gw.setPath(`${q.absolutePath}/assets/geometries/`),
    hd.setDecoderPath(`${q.absolutePath}/assets/libs/draco/`),
    hd.setPath(`${q.absolutePath}/assets/geometries/`),
    Ag.setPath(`${q.absolutePath}/assets/fonts/`)
}
function ER() {
    hd.dispose(),
    Ag.dispose(),
    zt._geometryCache.forEach(i => {
        i.then(e => {
            var t,
                s,
                n,
                r,
                a;
            Array.isArray(e) ? e.forEach(o => {
                var l,
                    c,
                    h;
                o.curve ? (c = (l = o.geometry).dispose) == null || c.call(l) : (h = o.dispose) == null || h.call(o)
            }) : e.isSkinnedMesh ? ((s = (t = e.geometry).dispose) == null || s.call(t), (r = (n = e.skeleton) == null ? void 0 : n.dispose) == null || r.call(n)) : (a = e.dispose) == null || a.call(e)
        })
    }),
    zt._geometryCache.clear()
}
const CR = 0,
    _x = 2,
    SR = 1,
    wx = 2,
    MR = 0,
    bR = 1,
    TR = 10,
    IR = 0,
    Hw = 9,
    Vw = 15,
    Ww = 16,
    Yw = 22,
    qw = 37,
    Xw = 43,
    Kw = 76,
    Jw = 83,
    jw = 97,
    Zw = 100,
    $w = 103,
    eE = 109,
    tE = 165,
    iE = 166;
class BR {
    constructor()
    {
        this.vkFormat = 0,
        this.typeSize = 1,
        this.pixelWidth = 0,
        this.pixelHeight = 0,
        this.pixelDepth = 0,
        this.layerCount = 0,
        this.faceCount = 1,
        this.supercompressionScheme = 0,
        this.levels = [],
        this.dataFormatDescriptor = [{
            vendorId: 0,
            descriptorType: 0,
            descriptorBlockSize: 0,
            versionNumber: 2,
            colorModel: 0,
            colorPrimaries: 1,
            transferFunction: 2,
            flags: 0,
            texelBlockDimension: [0, 0, 0, 0],
            bytesPlane: [0, 0, 0, 0, 0, 0, 0, 0],
            samples: []
        }],
        this.keyValue = {},
        this.globalData = null
    }
}
class fl {
    constructor(e, t, s, n)
    {
        this._dataView = new DataView(e.buffer, e.byteOffset + t, s),
        this._littleEndian = n,
        this._offset = 0
    }
    _nextUint8()
    {
        const e = this._dataView.getUint8(this._offset);
        return this._offset += 1, e
    }
    _nextUint16()
    {
        const e = this._dataView.getUint16(this._offset, this._littleEndian);
        return this._offset += 2, e
    }
    _nextUint32()
    {
        const e = this._dataView.getUint32(this._offset, this._littleEndian);
        return this._offset += 4, e
    }
    _nextUint64()
    {
        const e = this._dataView.getUint32(this._offset, this._littleEndian) + 4294967296 * this._dataView.getUint32(this._offset + 4, this._littleEndian);
        return this._offset += 8, e
    }
    _nextInt32()
    {
        const e = this._dataView.getInt32(this._offset, this._littleEndian);
        return this._offset += 4, e
    }
    _skip(e)
    {
        return this._offset += e, this
    }
    _scan(e, t=0)
    {
        const s = this._offset;
        let n = 0;
        for (; this._dataView.getUint8(this._offset) !== t && n < e;)
            n++,
            this._offset++;
        return n < e && this._offset++, new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + s, n)
    }
}
const ki = [171, 75, 84, 88, 32, 50, 48, 187, 13, 10, 26, 10];
function Ex(i) {
    return typeof TextDecoder < "u" ? new TextDecoder().decode(i) : Buffer.from(i).toString("utf8")
}
function PR(i) {
    const e = new Uint8Array(i.buffer, i.byteOffset, ki.length);
    if (e[0] !== ki[0] || e[1] !== ki[1] || e[2] !== ki[2] || e[3] !== ki[3] || e[4] !== ki[4] || e[5] !== ki[5] || e[6] !== ki[6] || e[7] !== ki[7] || e[8] !== ki[8] || e[9] !== ki[9] || e[10] !== ki[10] || e[11] !== ki[11])
        throw new Error("Missing KTX 2.0 identifier.");
    const t = new BR,
        s = 17 * Uint32Array.BYTES_PER_ELEMENT,
        n = new fl(i, ki.length, s, !0);
    t.vkFormat = n._nextUint32(),
    t.typeSize = n._nextUint32(),
    t.pixelWidth = n._nextUint32(),
    t.pixelHeight = n._nextUint32(),
    t.pixelDepth = n._nextUint32(),
    t.layerCount = n._nextUint32(),
    t.faceCount = n._nextUint32();
    const r = n._nextUint32();
    t.supercompressionScheme = n._nextUint32();
    const a = n._nextUint32(),
        o = n._nextUint32(),
        l = n._nextUint32(),
        c = n._nextUint32(),
        h = n._nextUint64(),
        d = n._nextUint64(),
        u = new fl(i, ki.length + s, 3 * r * 8, !0);
    for (let K = 0; K < r; K++)
        t.levels.push({
            levelData: new Uint8Array(i.buffer, i.byteOffset + u._nextUint64(), u._nextUint64()),
            uncompressedByteLength: u._nextUint64()
        });
    const f = new fl(i, a, o, !0),
        p = {
            vendorId: f._skip(4)._nextUint16(),
            descriptorType: f._nextUint16(),
            versionNumber: f._nextUint16(),
            descriptorBlockSize: f._nextUint16(),
            colorModel: f._nextUint8(),
            colorPrimaries: f._nextUint8(),
            transferFunction: f._nextUint8(),
            flags: f._nextUint8(),
            texelBlockDimension: [f._nextUint8(), f._nextUint8(), f._nextUint8(), f._nextUint8()],
            bytesPlane: [f._nextUint8(), f._nextUint8(), f._nextUint8(), f._nextUint8(), f._nextUint8(), f._nextUint8(), f._nextUint8(), f._nextUint8()],
            samples: []
        },
        A = (p.descriptorBlockSize / 4 - 6) / 4;
    for (let K = 0; K < A; K++) {
        const V = {
            bitOffset: f._nextUint16(),
            bitLength: f._nextUint8(),
            channelType: f._nextUint8(),
            samplePosition: [f._nextUint8(), f._nextUint8(), f._nextUint8(), f._nextUint8()],
            sampleLower: -1 / 0,
            sampleUpper: 1 / 0
        };
        64 & V.channelType ? (V.sampleLower = f._nextInt32(), V.sampleUpper = f._nextInt32()) : (V.sampleLower = f._nextUint32(), V.sampleUpper = f._nextUint32()),
        p.samples[K] = V
    }
    t.dataFormatDescriptor.length = 0,
    t.dataFormatDescriptor.push(p);
    const m = new fl(i, l, c, !0);
    for (; m._offset < c;) {
        const K = m._nextUint32(),
            V = m._scan(K),
            pe = Ex(V),
            xe = m._scan(K - V.byteLength);
        t.keyValue[pe] = pe.match(/^ktx/i) ? Ex(xe) : xe,
        m._offset % 4 && m._skip(4 - m._offset % 4)
    }
    if (d <= 0)
        return t;
    const g = new fl(i, h, d, !0),
        x = g._nextUint16(),
        v = g._nextUint16(),
        y = g._nextUint32(),
        S = g._nextUint32(),
        w = g._nextUint32(),
        C = g._nextUint32(),
        M = [];
    for (let K = 0; K < r; K++)
        M.push({
            imageFlags: g._nextUint32(),
            rgbSliceByteOffset: g._nextUint32(),
            rgbSliceByteLength: g._nextUint32(),
            alphaSliceByteOffset: g._nextUint32(),
            alphaSliceByteLength: g._nextUint32()
        });
    const E = h + g._offset,
        _ = E + y,
        I = _ + S,
        P = I + w,
        D = new Uint8Array(i.buffer, i.byteOffset + E, y),
        L = new Uint8Array(i.buffer, i.byteOffset + _, S),
        z = new Uint8Array(i.buffer, i.byteOffset + I, w),
        O = new Uint8Array(i.buffer, i.byteOffset + P, C);
    return t.globalData = {
        endpointCount: x,
        selectorCount: v,
        imageDescs: M,
        endpointsData: D,
        selectorsData: L,
        tablesData: z,
        extendedData: O
    }, t
}
let Xf,
    wn,
    Fm;
const Kf = {
    env: {
        emscripten_notify_memory_growth: function(i) {
            Fm = new Uint8Array(wn.exports.memory.buffer)
        }
    }
};
class DR {
    init()
    {
        return Xf || (Xf = typeof fetch < "u" ? fetch("data:application/wasm;base64," + Cx).then(e => e.arrayBuffer()).then(e => WebAssembly.instantiate(e, Kf)).then(this._init) : WebAssembly.instantiate(Buffer.from(Cx, "base64"), Kf).then(this._init), Xf)
    }
    _init(e)
    {
        wn = e.instance,
        Kf.env.emscripten_notify_memory_growth(0)
    }
    decode(e, t=0)
    {
        if (!wn)
            throw new Error("ZSTDDecoder: Await .init() before decoding.");
        const s = e.byteLength,
            n = wn.exports.malloc(s);
        Fm.set(e, n),
        t = t || Number(wn.exports.ZSTD_findDecompressedSize(n, s));
        const r = wn.exports.malloc(t),
            a = wn.exports.ZSTD_decompress(r, t, n, s),
            o = Fm.slice(r, r + a);
        return wn.exports.free(n), wn.exports.free(r), o
    }
}
const Cx = "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IAMNACAEQQNxBEADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAsMAgsgAkEDTQ0AIAIhBANAIAMgASgCADYCACABQQRqIQEgA0EEaiEDIARBfGoiBEEDSw0ACyACQQNxIQILIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8wICAn8BfgJAIAJFDQAgACACaiIDQX9qIAE6AAAgACABOgAAIAJBA0kNACADQX5qIAE6AAAgACABOgABIANBfWogAToAACAAIAE6AAIgAkEHSQ0AIANBfGogAToAACAAIAE6AAMgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIEayICQSBJDQAgAa0iBUIghiAFhCEFIAMgBGohAQNAIAEgBTcDGCABIAU3AxAgASAFNwMIIAEgBTcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAIajYCACADCy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAFajYCACADCx8AIAAgASACKAIEEAg2AgAgARAEGiAAIAJBCGo2AgQLCAAgAGdBH3MLugUBDX8jAEEQayIKJAACfyAEQQNNBEAgCkEANgIMIApBDGogAyAEEAsaIAAgASACIApBDGpBBBAVIgBBbCAAEAMbIAAgACAESxsMAQsgAEEAIAEoAgBBAXRBAmoQECENQVQgAygAACIGQQ9xIgBBCksNABogAiAAQQVqNgIAIAMgBGoiAkF8aiEMIAJBeWohDiACQXtqIRAgAEEGaiELQQQh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ASIDNgLE4AEgACgCvOABIQQgACABNgK84AEgACABIAJqNgK44AEgACABIAQgA2tqNgLA4AELpgEBAX8gACAAKALs4QEQFjYCyOABIABCADcD+OABIABCADcDuOABIABBwOABakIANwMAIABBqNAAaiIBQYyAgOAANgIAIABBADYCmOIBIABCADcDiOEBIABCAzcDgOEBIABBrNABakHgEikCADcCACAAQbTQAWpB6BIoAgA2AgAgACABNgIMIAAgAEGYIGo2AgggACAAQaAwajYCBCAAIABBEGo2AgALYQEBf0G4fyEDAkAgAUEDSQ0AIAIgABAhIgFBA3YiADYCCCACIAFBAXE2AgQgAiABQQF2QQNxIgM2AgACQCADQX9qIgFBAksNAAJAIAFBAWsOAgEAAgtBbA8LIAAhAwsgAwsMACAAIAEgAkEAEC4LiAQCA38CfiADEBYhBCAAQQBBKBAQIQAgBCACSwRAIAQPCyABRQRAQX8PCwJAAkAgA0EBRg0AIAEoAAAiBkGo6r5pRg0AQXYhAyAGQXBxQdDUtMIBRw0BQQghAyACQQhJDQEgAEEAQSgQECEAIAEoAAQhASAAQQE2AhQgACABrTcDAEEADwsgASACIAMQLyIDIAJLDQAgACADNgIYQXIhAyABIARqIgVBf2otAAAiAkEIcQ0AIAJBIHEiBkUEQEFwIQMgBS0AACIFQacBSw0BIAVBB3GtQgEgBUEDdkEKaq2GIgdCA4h+IAd8IQggBEEBaiEECyACQQZ2IQMgAkECdiEFAkAgAkEDcUF/aiICQQJLBEBBACECDAELAkACQAJAIAJBAWsOAgECAAsgASAEai0AACECIARBAWohBAwCCyABIARqLwAAIQIgBEECaiEEDAELIAEgBGooAAAhAiAEQQRqIQQLIAVBAXEhBQJ+AkACQAJAIANBf2oiA0ECTQRAIANBAWsOAgIDAQtCfyAGRQ0DGiABIARqMQAADAMLIAEgBGovAACtQoACfAwCCyABIARqKAAArQwBCyABIARqKQAACyEHIAAgBTYCICAAIAI2AhwgACAHNwMAQQAhAyAAQQA2AhQgACAHIAggBhsiBzcDCCAAIAdCgIAIIAdCgIAIVBs+AhALIAMLWwEBf0G4fyEDIAIQFiICIAFNBH8gACACakF/ai0AACIAQQNxQQJ0QaAeaigC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C0Egak8NAQsgByAHKQNoNwMQIAcgBykDYDcDCCAEIA0gB0EIaiAHQdwAaiAPIA4gESAQEB4hCwwBCyACIARqIQggBCAKEAcgAkERTwRAIARBEGohAgNAIAIgCkEQaiIKEAcgAkEQaiICIAhJDQALCyAIIAlrIQIgByATNgJcIAkgCCAOa0sEQCAJIAggEWtLBEBBbCELDAILIBAgAiAOayICaiIKIANqIBBNBEAgCCAKIAMQDxoMAgsgCCAKQQAgAmsQDyEIIAcgAiADaiIDNgJkIAggAmshCCAOIQILIAlBEE8EQCADIAhqIQMDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALDAELAkAgCUEHTQRAIAggAi0AADoAACAIIAItAAE6AAEgCCACLQACOgACIAggAi0AAzoAAyAIQQRqIAIgCUECdCIDQcAeaigCAGoiAhAXIAIgA0HgHmooAgBrIQIgBygCZCEDDAELIAggAhAMCyADQQlJDQAgAyAIaiEDIAhBCGoiCCACQQhqIgJrQQ9MBEADQCAIIAIQDCACQQhqIQIgCEEIaiIIIANJDQAMAgALAAsDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALCyAHQRhqEAQaIAsgDCALEAMiAhshDCAEIAQgC2ogAhshBCAFQX9qIgUNAAsgDBADDQFBbCEMIAdBGGoQBEECSQ0BQQAhCANAIAhBA0cEQCAAIAhBAnQiAmpBrNABaiACIAdqKAJENgIAIAhBAWohCAwBCwsgBygCXCEIC0G6fyEMIA8gCGsiACANIARrSw0AIAQEfyAEIAggABALIABqBUEACyABayEMCyAHQfAAaiQAIAwLkRcCFn8FfiMAQdABayIHJAAgByAAKALw4QEiCDYCvAEgASACaiESIAggACgCgOIBaiETAkACQCAFRQRAIAEhAwwBCyAAKALE4AEhESAAKALA4AEhFSAAKAK84AEhDyAAQQE2AozhAUEAIQgDQCAIQQNHBEAgByAIQQJ0IgJqIAAgAmpBrNABaigCADYCVCAIQQFqIQgMAQsLIAcgETYCZCAHIA82AmAgByABIA9rNgJoQWwhECAHQShqIAMgBBAGEAMNASAFQQQgBUEESBshFyAHQTxqIAdBKGogACgCABATIAdBxABqIAdBKGogACgCCBATIAdBzABqIAdB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IAdB0AFqJAAgEAslACAAQgA3AgAgAEEAOwEIIABBADoACyAAIAE2AgwgACACOgAKC7QFAQN/IwBBMGsiBCQAIABB/wFqIgVBfWohBgJAIAMvAQIEQCAEQRhqIAEgAhAGIgIQAw0BIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahASOgAAIAMgBEEIaiAEQRhqEBI6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0FIAEgBEEQaiAEQRhqEBI6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBSABIARBCGogBEEYahASOgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEjoAACABIAJqIABrIQIMAwsgAyAEQRBqIARBGGoQEjoAAiADIARBCGogBEEYahASOgADIANBBGohAwwAAAsACyAEQRhqIAEgAhAGIgIQAw0AIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahAROgAAIAMgBEEIaiAEQRhqEBE6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0EIAEgBEEQaiAEQRhqEBE6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBCABIARBCGogBEEYahAROgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEToAACABIAJqIABrIQIMAgsgAyAEQRBqIARBGGoQEToAAiADIARBCGogBEEYahAROgADIANBBGohAwwAAAsACyAEQTBqJAAgAgtpAQF/An8CQAJAIAJBB00NACABKAAAQbfIwuF+Rw0AIAAgASgABDYCmOIBQWIgAEEQaiABIAIQPiIDEAMNAhogAEKBgICAEDcDiOEBIAAgASADaiACIANrECoMAQsgACABIAIQKgtBAAsLrQMBBn8jAEGAAWsiAyQAQWIhCAJAIAJBCUkNACAAQZjQAGogAUEIaiIEIAJBeGogAEGY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wOABCwutAgIEfwF+IwBBQGoiBCQAAkACQCACQQhJDQAgASgAAEFwcUHQ1LTCAUcNACABIAIQIiEBIABCADcDCCAAQQA2AgQgACABNgIADAELIARBGGogASACEC0iAxADBEAgACADEBoMAQsgAwRAIABBuH8QGgwBCyACIAQoAjAiA2shAiABIANqIQMDQAJAIAAgAyACIARBCGoQLCIFEAMEfyAFBSACIAVBA2oiBU8NAUG4fwsQGgwCCyAGQQFqIQYgAiAFayECIAMgBWohAyAEKAIMRQ0ACyAEKAI4BEAgAkEDTQRAIABBuH8QGgwCCyADQQRqIQMLIAQoAighAiAEKQMYIQcgAEEANgIEIAAgAyABazYCACAAIAIgBmytIAcgB0J/URs3AwgLIARBQGskAAslAQF/IwBBEGsiAiQAIAIgACABEFEgAigCACEAIAJBEGokACAAC30BBH8jAEGQBGsiBCQAIARB/wE2AggCQCAEQRBqIARBCGogBEEMaiABIAIQFSIGEAMEQCAGIQUMAQtBVCEFIAQoAgwiB0EGSw0AIAMgBEEQaiAEKAIIIAcQQSIFEAMNACAAIAEgBmogAiAGayADEDwhBQsgBEGQBGokACAFC4cBAgJ/An5BABAWIQMCQANAIAEgA08EQAJAIAAoAABBcHFB0NS0wgFGBEAgACABECIiAhADRQ0BQn4PCyAAIAEQVSIEQn1WDQMgBCAFfCIFIARUIQJCfiEEIAINAyAAIAEQUiICEAMNAwsgASACayEBIAAgAmohAAwBCwtCfiAFIAEbIQQLIAQLPwIBfwF+IwBBMGsiAiQAAn5CfiACQQhqIAAgARAtDQAaQgAgAigCHEEBRg0AGiACKQMICyEDIAJBMGokACADC40BAQJ/IwBBMGsiASQAAkAgAEUNACAAKAKI4gENACABIABB/OEBaigCADYCKCABIAApAvThATcDICAAEDAgACgCqOIBIQIgASABKAIoNgIYIAEgASkDIDcDECACIAFBEGoQGyAAQQA2AqjiASABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALKgECfyMAQRBrIgAkACAAQQA2AgggAEIANwMAIAAQWCEBIABBEGokACABC4cBAQN/IwBBEGsiAiQAAkAgACgCAEUgACgCBEVzDQAgAiAAKAIINgIIIAIgACkCADcDAAJ/IAIoAgAiAQRAIAIoAghBqOMJIAERBQAMAQtBqOMJECgLIgFFDQAgASAAKQIANwL04QEgAUH84QFqIAAoAgg2AgAgARBZIAEhAwsgAkEQaiQAIAMLywEBAn8jAEEgayIBJAAgAEGBgIDAADYCtOIBIABBADYCiOIBIABBADYC7OEBIABCADcDkOIBIABBADYCpOMJIABBADYC3OIBIABCADcCzOIBIABBADYCvOIBIABBADYCxOABIABCADcCnOIBIABBpOIBakIANwIAIABBrOIBakEANgIAIAFCADcCECABQgA3AhggASABKQMYNwMIIAEgASkDEDcDACABKAIIQQh2QQFxIQIgAEEANgLg4gEgACACNgKM4gEgAUEgaiQAC3YBA38jAEEwayIBJAAgAARAIAEgAEHE0AFqIgIoAgA2AiggASAAKQK80AE3AyAgACgCACEDIAEgAigCADYCGCABIAApArzQATcDECADIAFBEGoQGyABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALzAEBAX8gACABKAK00AE2ApjiASAAIAEoAgQiAjYCwOABIAAgAjYCvOABIAAgAiABKAIIaiICNgK44AEgACACNgLE4AEgASgCuNABBEAgAEKBgICAEDcDiOEBIAAgAUGk0ABqNgIMIAAgAUGUIGo2AgggACABQZwwajYCBCAAIAFBDGo2AgAgAEGs0AFqIAFBqNABaigCADYCACAAQbDQAWogAUGs0AFqKAIANgIAIABBtNABaiABQbDQAWooAgA2AgAPCyAAQgA3A4jhAQs7ACACRQRAQbp/DwsgBEUEQEFsDwsgAiAEEGAEQCAAIAEgAiADIAQgBRBhDwsgACABIAIgAyAEIAUQZQtGAQF/IwBBEGsiBSQAIAVBCGogBBAOAn8gBS0ACQRAIAAgASACIAMgBBAyDAELIAAgASACIAMgBBA0CyEAIAVBEGokACAACzQAIAAgAyAEIAUQNiIFEAMEQCAFDwsgBSAESQR/IAEgAiADIAVqIAQgBWsgABA1BUG4fwsLRgEBfyMAQRBrIgUkACAFQQhqIAQQDgJ/IAUtAAkEQCAAIAEgAiADIAQQYgwBCyAAIAEgAiADIAQQNQshACAFQRBqJAAgAAtZAQF/QQ8hAiABIABJBEAgAUEEdCAAbiECCyAAQQh2IgEgAkEYbCIAQYwIaigCAGwgAEGICGooAgBqIgJBA3YgAmogAEGACGooAgAgAEGECGooAgAgAWxqSQs3ACAAIAMgBCAFQYAQEDMiBRADBEAgBQ8LIAUgBEkEfyABIAIgAyAFaiAEIAVrIAAQMgVBuH8LC78DAQN/IwBBIGsiBSQAIAVBCGogAiADEAYiAhADRQRAIAAgAWoiB0F9aiEGIAUgBBAOIARBBGohAiAFLQACIQMDQEEAIAAgBkkgBUEIahAEGwRAIAAgAiAFQQhqIAMQAkECdGoiBC8BADsAACAFQQhqIAQtAAIQASAAIAQtAANqIgQgAiAFQQhqIAMQAkECdGoiAC8BADsAACAFQQhqIAAtAAIQASAEIAAtAANqIQAMAQUgB0F+aiEEA0AgBUEIahAEIAAgBEtyRQRAIAAgAiAFQQhqIAMQAkECdGoiBi8BADsAACAFQQhqIAYtAAIQASAAIAYtAANqIQAMAQsLA0AgACAES0UEQCAAIAIgBUEIaiADEAJBAnRqIgYvAQA7AAAgBUEIaiAGLQACEAEgACAGLQADaiEADAELCwJAIAAgB08NACAAIAIgBUEIaiADEAIiA0ECdGoiAC0AADoAACAALQADQQFGBEAgBUEIaiAALQACEAEMAQsgBSgCDEEfSw0AIAVBCGogAiADQQJ0ai0AAhABIAUoAgxBIUkNACAFQSA2AgwLIAFBbCAFQQhqEAobIQILCwsgBUEgaiQAIAILkgIBBH8jAEFAaiIJJAAgCSADQTQQCyEDAkAgBEECSA0AIAMgBEECdGooAgAhCSADQTxqIAgQIyADQQE6AD8gAyACOgA+QQAhBCADKAI8IQoDQCAEIAlGDQEgACAEQQJ0aiAKNgEAIARBAWohBAwAAAsAC0EAIQkDQCAGIAlGRQRAIAMgBSAJQQF0aiIKLQABIgtBAnRqIgwoAgAhBCADQTxqIAotAABBCHQgCGpB//8DcRAjIANBAjoAPyADIAcgC2siCiACajoAPiAEQQEgASAKa3RqIQogAygCPCELA0AgACAEQQJ0aiALNgEAIARBAWoiBCAKSQ0ACyAMIAo2AgAgCUEBaiEJDAELCyADQUBrJAALowIBCX8jAEHQAGsiCSQAIAlBEGogBUE0EAsaIAcgBmshDyAHIAFrIRADQAJAIAMgCkcEQEEBIAEgByACIApBAXRqIgYtAAEiDGsiCGsiC3QhDSAGLQAAIQ4gCUEQaiAMQQJ0aiIMKAIAIQYgCyAPTwRAIAAgBkECdGogCyAIIAUgCEE0bGogCCAQaiIIQQEgCEEBShsiCCACIAQgCEECdGooAgAiCEEBdGogAyAIayAHIA4QYyAGIA1qIQgMAgsgCUEMaiAOECMgCUEBOgAPIAkgCDoADiAGIA1qIQggCSgCDCELA0AgBiAITw0CIAAgBkECdGogCzYBACAGQQFqIQYMAAALAAsgCUHQAGokAA8LIAwgCDYCACAKQQFqIQoMAAALAAs0ACAAIAMgBCAFEDYiBRADBEAgBQ8LIAUgBEkEfyABIAIgAyAFaiAEIAVrIAAQNAVBuH8LCyMAIAA/AEEQdGtB//8DakEQdkAAQX9GBEBBAA8LQQAQAEEBCzsBAX8gAgRAA0AgACABIAJBgCAgAkGAIEkbIgMQCyEAIAFBgCBqIQEgAEGAIGohACACIANrIgINAAsLCwYAIAAQAwsLqBUJAEGICAsNAQAAAAEAAAACAAAAAgBBoAgLswYBAAAAAQAAAAIAAAACAAAAJgAAAIIAAAAhBQAASgAAAGcIAAAmAAAAwAEAAIAAAABJBQAASgAAAL4IAAApAAAALAIAAIAAAABJBQAASgAAAL4IAAAvAAAAygIAAIAAAACKBQAASgAAAIQJAAA1AAAAcwMAAIAAAACdBQAASgAAAKAJAAA9AAAAgQMAAIAAAADrBQAASwAAAD4KAABEAAAAngMAAIAAAABNBgAASwAAAKoKAABLAAAAswMAAIAAAADBBgAATQAAAB8NAABNAAAAUwQAAIAAAAAjCAAAUQAAAKYPAABUAAAAmQQAAIAAAABLCQAAVwAAALESAABYAAAA2gQAAIAAAABvCQAAXQAAACMUAABUAAAARQUAAIAAAABUCgAAagAAAIwUAABqAAAArwUAAIAAAAB2CQAAfAAAAE4QAAB8AAAA0gIAAIAAAABjBwAAkQAAAJAHAACSAAAAAAAAAAEAAAABAAAABQAAAA0AAAAdAAAAPQAAAH0AAAD9AAAA/QEAAP0DAAD9BwAA/Q8AAP0fAAD9PwAA/X8AAP3/AAD9/wEA/f8DAP3/BwD9/w8A/f8fAP3/PwD9/38A/f//AP3//wH9//8D/f//B/3//w/9//8f/f//P/3//38AAAAAAQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABEAAAASAAAAEwAAABQAAAAVAAAAFgAAABcAAAAYAAAAGQAAABoAAAAbAAAAHAAAAB0AAAAeAAAAHwAAAAMAAAAEAAAABQAAAAYAAAAHAAAACAAAAAkAAAAKAAAACwAAAAwAAAANAAAADgAAAA8AAAAQAAAAEQAAABIAAAATAAAAFAAAABUAAAAWAAAAFwAAABgAAAAZAAAAGgAAABsAAAAcAAAAHQAAAB4AAAAfAAAAIAAAACEAAAAiAAAAIwAAACUAAAAnAAAAKQAAACsAAAAvAAAAMwAAADsAAABDAAAAUwAAAGMAAACDAAAAAwEAAAMCAAADBAAAAwgAAAMQAAADIAAAA0AAAAOAAAADAAEAQeAPC1EBAAAAAQAAAAEAAAABAAAAAgAAAAIAAAADAAAAAwAAAAQAAAAEAAAABQAAAAcAAAAIAAAACQAAAAoAAAALAAAADAAAAA0AAAAOAAAADwAAABAAQcQQC4sBAQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABIAAAAUAAAAFgAAABgAAAAcAAAAIAAAACgAAAAwAAAAQAAAAIAAAAAAAQAAAAIAAAAEAAAACAAAABAAAAAgAAAAQAAAAIAAAAAAAQBBkBIL5gQBAAAAAQAAAAEAAAABAAAAAgAAAAIAAAADAAAAAwAAAAQAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAAAEAAAAEAAAACAAAAAAAAAABAAEBBgAAAAAAAAQAAAAAEAAABAAAAAAgAAAFAQAAAAAAAAUDAAAAAAAABQQAAAAAAAAFBgAAAAAAAAUHAAAAAAAABQkAAAAAAAAFCgAAAAAAAAUMAAAAAAAABg4AAAAAAAEFEAAAAAAAAQUUAAAAAAABBRYAAAAAAAIFHAAAAAAAAwUgAAAAAAAEBTAAAAAgAAYFQAAAAAAABwWAAAAAAAAIBgABAAAAAAoGAAQAAAAADAYAEAAAIAAABAAAAAAAAAAEAQAAAAAAAAUCAAAAIAAABQQAAAAAAAAFBQAAACAAAAUHAAAAAAAABQgAAAAgAAAFCgAAAAAAAAULAAAAAAAABg0AAAAgAAEFEAAAAAAAAQUSAAAAIAABBRYAAAAAAAIFGAAAACAAAwUgAAAAAAADBSgAAAAAAAYEQAAAABAABgRAAAAAIAAHBYAAAAAAAAkGAAIAAAAACwYACAAAMAAABAAAAAAQAAAEAQAAACAAAAUCAAAAIAAABQMAAAAgAAAFBQAAACAAAAUGAAAAIAAABQgAAAAgAAAFCQAAACAAAAULAAAAIAAABQwAAAAAAAAGDwAAACAAAQUSAAAAIAABBRQAAAAgAAIFGAAAACAAAgUcAAAAIAADBSgAAAAgAAQFMAAAAAAAEAYAAAEAAAAPBgCAAAAAAA4GAEAAAAAADQYAIABBgBcLhwIBAAEBBQAAAAAAAAUAAAAAAAAGBD0AAAAAAAkF/QEAAAAADwX9fwAAAAAVBf3/HwAAAAMFBQAAAAAABwR9AAAAAAAMBf0PAAAAABIF/f8DAAAAFwX9/38AAAAFBR0AAAAAAAgE/QAAAAAADgX9PwAAAAAUBf3/DwAAAAIFAQAAABAABwR9AAAAAAALBf0HAAAAABEF/f8BAAAAFgX9/z8AAAAEBQ0AAAAQAAgE/QAAAAAADQX9HwAAAAATBf3/BwAAAAEFAQAAABAABgQ9AAAAAAAKBf0DAAAAABAF/f8AAAAAHAX9//8PAAAbBf3//wcAABoF/f//AwAAGQX9//8BAAAYBf3//wBBkBkLhgQBAAEBBgAAAAAAAAYDAAAAAAAABAQAAAAgAAAFBQAAAAAAAAUGAAAAAAAABQgAAAAAAAAFCQAAAAAAAAULAAAAAAAABg0AAAAAAAAGEAAAAAAAAAYTAAAAAAAABhYAAAAAAAAGGQAAAAAAAAYcAAAAAAAABh8AAAAAAAAGIgAAAAAAAQYlAAAAAAABBikAAAAAAAIGLwAAAAAAAwY7AAAAAAAEBlMAAAAAAAcGgwAAAAAACQYDAgAAEAAABAQAAAAAAAAEBQAAACAAAAUGAAAAAAAABQcAAAAgAAAFCQAAAAAAAAUKAAAAAAAABgwAAAAAAAAGDwAAAAAAAAYSAAAAAAAABhUAAAAAAAAGGAAAAAAAAAYbAAAAAAAABh4AAAAAAAAGIQAAAAAAAQYjAAAAAAABBicAAAAAAAIGKwAAAAAAAwYzAAAAAAAEBkMAAAAAAAUGYwAAAAAACAYDAQAAIAAABAQAAAAwAAAEBAAAABAAAAQFAAAAIAAABQcAAAAgAAAFCAAAACAAAAUKAAAAIAAABQsAAAAAAAAGDgAAAAAAAAYRAAAAAAAABhQAAAAAAAAGFwAAAAAAAAYaAAAAAAAABh0AAAAAAAAGIAAAAAAAEAYDAAEAAAAPBgOAAAAAAA4GA0AAAAAADQYDIAAAAAAMBgMQAAAAAAsGAwgAAAAACgYDBABBpB0L2QEBAAAAAwAAAAcAAAAPAAAAHwAAAD8AAAB/AAAA/wAAAP8BAAD/AwAA/wcAAP8PAAD/HwAA/z8AAP9/AAD//wAA//8BAP//AwD//wcA//8PAP//HwD//z8A//9/AP///wD///8B////A////wf///8P////H////z////9/AAAAAAEAAAACAAAABAAAAAAAAAACAAAABAAAAAgAAAAAAAAAAQAAAAIAAAABAAAABAAAAAQAAAAEAAAABAAAAAgAAAAIAAAACAAAAAcAAAAIAAAACQAAAAoAAAALAEGgIAsDwBBQ",
    Jf = new WeakMap;
let jf = 0,
    Zf;
class Gs extends Nn {
    constructor(e)
    {
        super(e),
        this.transcoderPath = "",
        this.transcoderBinary = null,
        this.transcoderPending = null,
        this.workerPool = new jo,
        this.workerSourceURL = "",
        this.workerConfig = null,
        typeof MSC_TRANSCODER < "u" && console.warn('THREE.KTX2Loader: Please update to latest "basis_transcoder". "msc_basis_transcoder" is no longer supported in three.js r125+.')
    }
    setTranscoderPath(e)
    {
        return this.transcoderPath = e, this
    }
    setWorkerLimit(e)
    {
        return this.workerPool.setWorkerLimit(e), this
    }
    async detectSupportAsync(e)
    {
        return this.workerConfig = {
            astcSupported: await e.hasFeatureAsync("texture-compression-astc"),
            etc1Supported: await e.hasFeatureAsync("texture-compression-etc1"),
            etc2Supported: await e.hasFeatureAsync("texture-compression-etc2"),
            dxtSupported: await e.hasFeatureAsync("texture-compression-bc"),
            bptcSupported: await e.hasFeatureAsync("texture-compression-bptc"),
            pvrtcSupported: await e.hasFeatureAsync("texture-compression-pvrtc")
        }, this
    }
    detectSupport(e)
    {
        return e.isWebGPURenderer === !0 ? this.workerConfig = {
            astcSupported: e.hasFeature("texture-compression-astc"),
            etc1Supported: e.hasFeature("texture-compression-etc1"),
            etc2Supported: e.hasFeature("texture-compression-etc2"),
            dxtSupported: e.hasFeature("texture-compression-bc"),
            bptcSupported: e.hasFeature("texture-compression-bptc"),
            pvrtcSupported: e.hasFeature("texture-compression-pvrtc")
        } : this.workerConfig = {
            astcSupported: e.extensions.has("WEBGL_compressed_texture_astc"),
            etc1Supported: e.extensions.has("WEBGL_compressed_texture_etc1"),
            etc2Supported: e.extensions.has("WEBGL_compressed_texture_etc"),
            dxtSupported: e.extensions.has("WEBGL_compressed_texture_s3tc"),
            bptcSupported: e.extensions.has("EXT_texture_compression_bptc"),
            pvrtcSupported: e.extensions.has("WEBGL_compressed_texture_pvrtc") || e.extensions.has("WEBKIT_WEBGL_compressed_texture_pvrtc")
        }, this
    }
    init()
    {
        if (!this.transcoderPending) {
            const e = new Ts(this.manager);
            e.setPath(this.transcoderPath),
            e.setWithCredentials(this.withCredentials);
            const t = e.loadAsync("basis_transcoder.js"),
                s = new Ts(this.manager);
            s.setPath(this.transcoderPath),
            s.setResponseType("arraybuffer"),
            s.setWithCredentials(this.withCredentials);
            const n = s.loadAsync("basis_transcoder.wasm");
            this.transcoderPending = Promise.all([t, n]).then(([r, a]) => {
                const o = Gs.BasisWorker.toString(),
                    l = ["/* constants */", "let _EngineFormat = " + JSON.stringify(Gs.EngineFormat), "let _TranscoderFormat = " + JSON.stringify(Gs.TranscoderFormat), "let _BasisFormat = " + JSON.stringify(Gs.BasisFormat), "/* basis_transcoder.js */", r, "/* worker */", o.substring(o.indexOf("{") + 1, o.lastIndexOf("}"))].join(`
                    `);
                this.workerSourceURL = URL.createObjectURL(new Blob([l])),
                this.transcoderBinary = a,
                this.workerPool.setWorkerCreator(() => {
                    const c = new Worker(this.workerSourceURL),
                        h = this.transcoderBinary.slice(0);
                    return c.postMessage({
                        type: "init",
                        config: this.workerConfig,
                        transcoderBinary: h
                    }, [h]), c
                })
            }),
            jf > 0 && console.warn("THREE.KTX2Loader: Multiple active KTX2 loaders may cause performance issues. Use a single KTX2Loader instance, or call .dispose() on old instances."),
            jf++
        }
        return this.transcoderPending
    }
    load(e, t, s, n)
    {
        if (this.workerConfig === null)
            throw new Error("THREE.KTX2Loader: Missing initialization with `.detectSupport( renderer )`.");
        const r = new Ts(this.manager);
        r.setResponseType("arraybuffer"),
        r.setWithCredentials(this.withCredentials),
        r.load(e, a => {
            if (Jf.has(a))
                return Jf.get(a).promise.then(t).catch(n);
            this._createTexture(a).then(o => t ? t(o) : null).catch(n)
        }, s, n)
    }
    _createTextureFrom(e, t)
    {
        const {faces: s, width: n, height: r, format: a, type: o, error: l, dfdFlags: c} = e;
        if (o === "error")
            return Promise.reject(l);
        let h;
        if (t.faceCount === 6)
            h = new Vy(s, a, Ct);
        else {
            const d = s[0].mipmaps;
            h = t.layerCount > 1 ? new dI(d, n, r, t.layerCount, a, Ct) : new bc(d, n, r, a, Ct)
        }
        return h.minFilter = s[0].mipmaps.length === 1 ? _t : Qs, h.magFilter = _t, h.generateMipmaps = !1, h.needsUpdate = !0, h.colorSpace = sE(t), h.premultiplyAlpha = !!(c & SR), h
    }
    async _createTexture(e, t={})
    {
        const s = PR(new Uint8Array(e));
        if (s.vkFormat !== IR)
            return UR(s);
        const n = t,
            r = this.init().then(() => this.workerPool.postMessage({
                type: "transcode",
                buffer: e,
                taskConfig: n
            }, [e])).then(a => this._createTextureFrom(a.data, s));
        return Jf.set(e, {
            promise: r
        }), r
    }
    dispose()
    {
        return this.workerPool.dispose(), this.workerSourceURL && URL.revokeObjectURL(this.workerSourceURL), jf--, this
    }
}
Gs.BasisFormat = {
    ETC1S: 0,
    UASTC_4x4: 1
};
Gs.TranscoderFormat = {
    ETC1: 0,
    ETC2: 1,
    BC1: 2,
    BC3: 3,
    BC4: 4,
    BC5: 5,
    BC7_M6_OPAQUE_ONLY: 6,
    BC7_M5: 7,
    PVRTC1_4_RGB: 8,
    PVRTC1_4_RGBA: 9,
    ASTC_4x4: 10,
    ATC_RGB: 11,
    ATC_RGBA_INTERPOLATED_ALPHA: 12,
    RGBA32: 13,
    RGB565: 14,
    BGR565: 15,
    RGBA4444: 16
};
Gs.EngineFormat = {
    RGBAFormat: wt,
    RGBA_ASTC_4x4_Format: Np,
    RGBA_BPTC_Format: jh,
    RGBA_ETC2_EAC_Format: Fp,
    RGBA_PVRTC_4BPPV1_Format: Rp,
    RGBA_S3TC_DXT5_Format: Jh,
    RGB_ETC1_Format: Up,
    RGB_ETC2_Format: Lp,
    RGB_PVRTC_4BPPV1_Format: Dp,
    RGBA_S3TC_DXT1_Format: Kh
};
Gs.BasisWorker = function() {
    let i,
        e,
        t;
    const s = _EngineFormat,
        n = _TranscoderFormat,
        r = _BasisFormat;
    self.addEventListener("message", function(p) {
        const A = p.data;
        switch (A.type) {
        case "init":
            i = A.config,
            a(A.transcoderBinary);
            break;
        case "transcode":
            e.then(() => {
                try {
                    const {faces: m, buffers: g, width: x, height: v, hasAlpha: y, format: S, dfdFlags: w} = o(A.buffer);
                    self.postMessage({
                        type: "transcode",
                        id: A.id,
                        faces: m,
                        width: x,
                        height: v,
                        hasAlpha: y,
                        format: S,
                        dfdFlags: w
                    }, g)
                } catch (m) {
                    console.error(m),
                    self.postMessage({
                        type: "error",
                        id: A.id,
                        error: m.message
                    })
                }
            });
            break
        }
    });
    function a(p) {
        e = new Promise(A => {
            t = {
                wasmBinary: p,
                onRuntimeInitialized: A
            },
            BASIS(t)
        }).then(() => {
            t.initializeBasis(),
            t.KTX2File === void 0 && console.warn("THREE.KTX2Loader: Please update Basis Universal transcoder.")
        })
    }
    function o(p) {
        const A = new t.KTX2File(new Uint8Array(p));
        function m() {
            A.close(),
            A.delete()
        }
        if (!A.isValid())
            throw m(), new Error("THREE.KTX2Loader:	Invalid or unsupported .ktx2 file");
        const g = A.isUASTC() ? r.UASTC_4x4 : r.ETC1S,
            x = A.getWidth(),
            v = A.getHeight(),
            y = A.getLayers() || 1,
            S = A.getLevels(),
            w = A.getFaces(),
            C = A.getHasAlpha(),
            M = A.getDFDFlags(),
            {transcoderFormat: E, engineFormat: _} = d(g, x, v, C);
        if (!x || !v || !S)
            throw m(), new Error("THREE.KTX2Loader:	Invalid texture");
        if (!A.startTranscoding())
            throw m(), new Error("THREE.KTX2Loader: .startTranscoding failed");
        const I = [],
            P = [];
        for (let D = 0; D < w; D++) {
            const L = [];
            for (let z = 0; z < S; z++) {
                const O = [];
                let K,
                    V;
                for (let xe = 0; xe < y; xe++) {
                    const Ae = A.getImageLevelInfo(z, xe, D);
                    D === 0 && z === 0 && xe === 0 && (Ae.origWidth % 4 !== 0 || Ae.origHeight % 4 !== 0) && console.warn("THREE.KTX2Loader: ETC1S and UASTC textures should use multiple-of-four dimensions."),
                    S > 1 ? (K = Ae.origWidth, V = Ae.origHeight) : (K = Ae.width, V = Ae.height);
                    const Ye = new Uint8Array(A.getImageTranscodedSizeInBytes(z, xe, 0, E));
                    if (!A.transcodeImage(Ye, z, xe, D, E, 0, -1, -1))
                        throw m(), new Error("THREE.KTX2Loader: .transcodeImage failed.");
                    O.push(Ye)
                }
                const pe = f(O);
                L.push({
                    data: pe,
                    width: K,
                    height: V
                }),
                P.push(pe.buffer)
            }
            I.push({
                mipmaps: L,
                width: x,
                height: v,
                format: _
            })
        }
        return m(), {
            faces: I,
            buffers: P,
            width: x,
            height: v,
            hasAlpha: C,
            format: _,
            dfdFlags: M
        }
    }
    const l = [{
            if: "astcSupported",
            basisFormat: [r.UASTC_4x4],
            transcoderFormat: [n.ASTC_4x4, n.ASTC_4x4],
            engineFormat: [s.RGBA_ASTC_4x4_Format, s.RGBA_ASTC_4x4_Format],
            priorityETC1S: 1 / 0,
            priorityUASTC: 1,
            needsPowerOfTwo: !1
        }, {
            if: "bptcSupported",
            basisFormat: [r.ETC1S, r.UASTC_4x4],
            transcoderFormat: [n.BC7_M5, n.BC7_M5],
            engineFormat: [s.RGBA_BPTC_Format, s.RGBA_BPTC_Format],
            priorityETC1S: 3,
            priorityUASTC: 2,
            needsPowerOfTwo: !1
        }, {
            if: "dxtSupported",
            basisFormat: [r.ETC1S, r.UASTC_4x4],
            transcoderFormat: [n.BC1, n.BC3],
            engineFormat: [s.RGBA_S3TC_DXT1_Format, s.RGBA_S3TC_DXT5_Format],
            priorityETC1S: 4,
            priorityUASTC: 5,
            needsPowerOfTwo: !1
        }, {
            if: "etc2Supported",
            basisFormat: [r.ETC1S, r.UASTC_4x4],
            transcoderFormat: [n.ETC1, n.ETC2],
            engineFormat: [s.RGB_ETC2_Format, s.RGBA_ETC2_EAC_Format],
            priorityETC1S: 1,
            priorityUASTC: 3,
            needsPowerOfTwo: !1
        }, {
            if: "etc1Supported",
            basisFormat: [r.ETC1S, r.UASTC_4x4],
            transcoderFormat: [n.ETC1],
            engineFormat: [s.RGB_ETC1_Format],
            priorityETC1S: 2,
            priorityUASTC: 4,
            needsPowerOfTwo: !1
        }, {
            if: "pvrtcSupported",
            basisFormat: [r.ETC1S, r.UASTC_4x4],
            transcoderFormat: [n.PVRTC1_4_RGB, n.PVRTC1_4_RGBA],
            engineFormat: [s.RGB_PVRTC_4BPPV1_Format, s.RGBA_PVRTC_4BPPV1_Format],
            priorityETC1S: 5,
            priorityUASTC: 6,
            needsPowerOfTwo: !0
        }],
        c = l.sort(function(p, A) {
            return p.priorityETC1S - A.priorityETC1S
        }),
        h = l.sort(function(p, A) {
            return p.priorityUASTC - A.priorityUASTC
        });
    function d(p, A, m, g) {
        let x,
            v;
        const y = p === r.ETC1S ? c : h;
        for (let S = 0; S < y.length; S++) {
            const w = y[S];
            if (i[w.if] && w.basisFormat.includes(p) && !(g && w.transcoderFormat.length < 2) && !(w.needsPowerOfTwo && !(u(A) && u(m))))
                return x = w.transcoderFormat[g ? 1 : 0], v = w.engineFormat[g ? 1 : 0], {
                    transcoderFormat: x,
                    engineFormat: v
                }
        }
        return console.warn("THREE.KTX2Loader: No suitable compressed texture format found. Decoding to RGBA32."), x = n.RGBA32, v = s.RGBAFormat, {
            transcoderFormat: x,
            engineFormat: v
        }
    }
    function u(p) {
        return p <= 2 ? !0 : (p & p - 1) === 0 && p !== 0
    }
    function f(p) {
        if (p.length === 1)
            return p[0];
        let A = 0;
        for (let x = 0; x < p.length; x++) {
            const v = p[x];
            A += v.byteLength
        }
        const m = new Uint8Array(A);
        let g = 0;
        for (let x = 0; x < p.length; x++) {
            const v = p[x];
            m.set(v, g),
            g += v.byteLength
        }
        return m
    }
};
const RR = new Set([wt, uo, ta]),
    $f = {
        [eE]: wt,
        [jw]: wt,
        [qw]: wt,
        [Xw]: wt,
        [$w]: uo,
        [Jw]: uo,
        [Ww]: uo,
        [Yw]: uo,
        [Zw]: ta,
        [Kw]: ta,
        [Vw]: ta,
        [Hw]: ta,
        [iE]: Hu,
        [tE]: Hu
    },
    ep = {
        [eE]: Lt,
        [jw]: Mi,
        [qw]: Ct,
        [Xw]: Ct,
        [$w]: Lt,
        [Jw]: Mi,
        [Ww]: Ct,
        [Yw]: Ct,
        [Zw]: Lt,
        [Kw]: Mi,
        [Vw]: Ct,
        [Hw]: Ct,
        [iE]: Ct,
        [tE]: Ct
    };
async function UR(i) {
    const {vkFormat: e} = i;
    if ($f[e] === void 0)
        throw new Error("THREE.KTX2Loader: Unsupported vkFormat.");
    let t;
    i.supercompressionScheme === _x && (Zf || (Zf = new Promise(async r => {
        const a = new DR;
        await a.init(),
        r(a)
    })), t = await Zf);
    const s = [];
    for (let r = 0; r < i.levels.length; r++) {
        const a = Math.max(1, i.pixelWidth >> r),
            o = Math.max(1, i.pixelHeight >> r),
            l = i.pixelDepth ? Math.max(1, i.pixelDepth >> r) : 0,
            c = i.levels[r];
        let h;
        if (i.supercompressionScheme === CR)
            h = c.levelData;
        else if (i.supercompressionScheme === _x)
            h = t.decode(c.levelData, c.uncompressedByteLength);
        else
            throw new Error("THREE.KTX2Loader: Unsupported supercompressionScheme.");
        let d;
        ep[e] === Lt ? d = new Float32Array(h.buffer, h.byteOffset, h.byteLength / Float32Array.BYTES_PER_ELEMENT) : ep[e] === Mi ? d = new Uint16Array(h.buffer, h.byteOffset, h.byteLength / Uint16Array.BYTES_PER_ELEMENT) : d = h,
        s.push({
            data: d,
            width: a,
            height: o,
            depth: l
        })
    }
    let n;
    if (RR.has($f[e]))
        n = i.pixelDepth === 0 ? new Hi(s[0].data, i.pixelWidth, i.pixelHeight) : new DA(s[0].data, i.pixelWidth, i.pixelHeight, i.pixelDepth);
    else {
        if (i.pixelDepth > 0)
            throw new Error("THREE.KTX2Loader: Unsupported pixelDepth.");
        n = new bc(s, i.pixelWidth, i.pixelHeight)
    }
    return n.mipmaps = s, n.type = ep[e], n.format = $f[e], n.colorSpace = sE(i), n.needsUpdate = !0, Promise.resolve(n)
}
function sE(i) {
    const e = i.dataFormatDescriptor[0];
    return e.colorPrimaries === bR ? e.transferFunction === wx ? Ve : oi : e.colorPrimaries === TR ? e.transferFunction === wx ? wd : Mc : (e.colorPrimaries === MR || console.warn(`THREE.KTX2Loader: Unsupported color primaries, "${e.colorPrimaries}"`), _s)
}
function LR() {
    return new Worker("/assets/bitmapworker-046527f8.js")
}
var qr,
    _u,
    ro;
class FR {
    constructor()
    {
        te(this, qr, new Map),
        te(this, _u, ""),
        te(this, ro, new jo),
        U(this, ro).setWorkerCreator(() => new LR)
    }
    loadAsync(e, t=!0)
    {
        const s = `${e}-${t}`;
        if (U(this, qr).has(s))
            return U(this, qr).get(s);
        const n = new Promise(async (r, a) => {
            const o = await U(this, ro).postMessage({
                url: U(this, _u) + e,
                flipY: t
            });
            o.data.error ? a(new Error(`fetch for "${e}" responded with 404: Not Found.`)) : r(new Rt(o.data.bitmap))
        });
        return U(this, qr).set(s, n), n
    }
    setPath(e)
    {
        et(this, _u, e)
    }
    setWorkerLimit(e)
    {
        return U(this, ro).setWorkerLimit(e), this
    }
    dispose()
    {
        U(this, ro).dispose(),
        U(this, qr).forEach(e => e.then(t => {
            var s;
            return (s = t.dispose) == null ? void 0 : s.call(t)
        })),
        U(this, qr).clear()
    }
}
qr = new WeakMap,
_u = new WeakMap,
ro = new WeakMap;
function NR(i, e, t) {
    const s = new Hi(new Float32Array(16), 2, 2, wt, Lt);
    s._curves = [],
    s._url = i,
    s._closed = e,
    s._pointDensity = t;
    let n = null;
    return s._loaded = new Promise(r => {
        n = r
    }), setTimeout(async () => {
        const r = await zt.curves(i, e, t);
        s._curves = r;
        const a = ie.ceilPowerOfTwo(Math.max(2, r.length));
        let o = 2,
            l = 0;
        r.forEach(h => {
            o = Math.max(o, h.geometry.attributes.position.count),
            l = Math.max(l, h.curve.getLength())
        }),
        o = ie.clamp(ie.ceilPowerOfTwo(o), 2, 2048);
        const c = new Float32Array(a * o * 4);
        r.forEach((h, d) => {
            const u = h.curve.getSpacedPoints(o),
                f = o * d * 4,
                p = 1 / (u.length - 1);
            u.forEach((A, m) => {
                const g = m * 4;
                c[f + g + 0] = A.x,
                c[f + g + 1] = A.y,
                c[f + g + 2] = A.z,
                c[f + g + 3] = p * m
            })
        }),
        s.image = {
            data: c,
            width: o,
            height: a
        },
        s.needsUpdate = !0,
        n()
    }, 0), s
}
function OR() {
    return new Worker("/assets/exrworker-41cbee65.js")
}
class kR {
    constructor()
    {
        this.exrTextureCache = new Map,
        this.path = "",
        this.workerPool = new jo,
        this.workerPool.setWorkerCreator(() => new OR)
    }
    loadAsync(e)
    {
        if (this.exrTextureCache.has(e))
            return this.exrTextureCache.get(e);
        const t = new Promise(async (s, n) => {
            const r = await this.workerPool.postMessage({
                url: this.path + e
            });
            if (r.data.error)
                n(new Error(`fetch for "${e}" responded with 404: Not Found.`));
            else {
                const a = new Hi;
                a.image.width = r.data.width,
                a.image.height = r.data.height,
                a.image.data = r.data.data,
                a.colorSpace = r.data.colorSpace,
                a.format = r.data.format,
                a.type = r.data.type,
                a.needsUpdate = !0,
                a.minFilter = _t,
                a.magFilter = _t,
                a.generateMipmaps = !1,
                a.flipY = !1,
                s(a)
            }
        });
        return this.exrTextureCache.set(e, t), t
    }
    setPath(e)
    {
        this.path = e
    }
    setWorkerLimit(e)
    {
        return this.workerPool.setWorkerLimit(e), this
    }
    dispose()
    {
        this.workerPool.dispose(),
        this.exrTextureCache.forEach(e => e.then(t => {
            var s;
            return (s = t.dispose) == null ? void 0 : s.call(t)
        })),
        this.exrTextureCache.clear()
    }
}
class zR {
    constructor()
    {
        this.svgTextureCache = new Map,
        this.path = ""
    }
    loadAsync(e)
    {
        if (this.svgTextureCache.has(e))
            return this.svgTextureCache.get(e);
        const t = new Promise((s, n) => {
            fetch(this.path + e).then(r => r.text()).then(r => {
                const a = document.createElement("div");
                a.innerHTML = r;
                const o = a.querySelector("svg"),
                    l = o.width.baseVal.value,
                    c = o.height.baseVal.value,
                    h = document.createElement("canvas"),
                    d = h.getContext("2d"),
                    u = document.createElement("img");
                u.onload = () => {
                    h.width = l,
                    h.height = c,
                    d.drawImage(u, 0, 0),
                    s(new Rt(h))
                },
                u.setAttribute("src", `data:image/svg+xml;base64,${window.btoa(r)}`)
            }).catch(r => n(new Error(`fetch for "${e}" responded with 404: Not Found.`)))
        });
        return this.svgTextureCache.set(e, t), t
    }
    setPath(e)
    {
        this.path = e
    }
    dispose()
    {
        this.svgTextureCache.forEach(e => e.then(t => {
            var s;
            return (s = t.dispose) == null ? void 0 : s.call(t)
        })),
        this.svgTextureCache.clear()
    }
}
class QR extends uI {
    constructor(e, t=!1)
    {
        const s = document.createElement("video");
        super(s),
        s.loop = !0,
        s.muted = !0,
        s.preload = "auto",
        s.crossOrigin = "anonymous",
        s.playsInline = !0;
        const n = document.createElement("source");
        n.src = e,
        n.type = `video/${e.split(".").pop().startsWith("mp4") ? "mp4" : "webm"}`,
        s.appendChild(n),
        s.load(),
        this._autoplay = t,
        this._videoLoadAsync = new Promise((r, a) => {
            const o = () => {
                    s.removeEventListener("canplaythrough", l),
                    s.removeEventListener("error", c)
                },
                l = () => {
                    o(),
                    r(this)
                },
                c = () => {
                    o(),
                    a(new Error(`fetch for "${e}" responded with 404: Not Found.`))
                };
            s.addEventListener("canplaythrough", l),
            s.addEventListener("error", c),
            s.readyState > 3 && l()
        })
    }
    update()
    {
        this._autoplay && this.image.paused && this.image.play().catch(() => {}),
        super.update()
    }
    dispose()
    {
        this.image.pause(),
        this.image.currentTime = 0,
        super.dispose()
    }
}
const In = new Gs().setWorkerLimit(1),
    ud = new FR().setWorkerLimit(1),
    gg = new kR().setWorkerLimit(1),
    vg = new zR,
    Nm = new jy,
    Di = {
        KTX2: 1,
        BITMAP: 2,
        IMAGE: 3,
        EXR: 4,
        SVG: 5,
        VIDEO: 6
    },
    GR = ["png", "jpg", "jpeg"],
    tp = "uv/uvchecker-srgb.png",
    Sx = "uv/uvchecker-srgb.ktx2",
    le = {
        _texturesCache: new Map,
        load(i=tp, e="default") {
            const t = `${i}_<>_${e}`;
            if (this._texturesCache.has(t))
                return this._texturesCache.get(t);
            const s = i.split(".").pop(),
                n = e.toLowerCase();
            let r = null,
                a = null;
            s.startsWith("ktx2") ? (r = Di.KTX2, n.includes("3d") || n.includes("lut") ? a = new DA : n.includes("cubemap") ? a = new Vy : a = new bc) : s.startsWith("exr") ? (r = Di.EXR, a = new Hi) : s.startsWith("mp4") || s.startsWith("webm") ? (r = Di.VIDEO, a = new QR(`${q.absolutePath}/assets/${i}`, n.includes("autoplay"))) : (s.startsWith("svg") ? r = Di.SVG : q.capabilities.imageBitmap && GR.some(c => s.startsWith(c)) ? r = Di.BITMAP : r = Di.IMAGE, a = new Rt),
            this._texturesCache.set(t, a),
            a._url = i,
            a._loadMode = e;
            let o = null;
            a._loaded = new Promise(c => {
                o = c
            });
            const l = n.includes("srgb") || i === tp ? Ve : a.colorSpace;
            return a.colorSpace = l, setTimeout(async () => {
                let c = null;
                try {
                    r === Di.KTX2 ? c = await In.loadAsync(`${q.absolutePath}/assets/images/${i}`) : r === Di.EXR ? c = await gg.loadAsync(i) : r === Di.SVG ? c = await vg.loadAsync(i) : r === Di.VIDEO ? c = await a._videoLoadAsync : r === Di.BITMAP ? c = await ud.loadAsync(i, !n.includes("noflip")) : c = await Nm.loadAsync(i)
                } catch (h) {
                    console.warn("Texture load:", h),
                    r !== Di.EXR && r !== Di.VIDEO && !a.isData3DTexture && (a.colorSpace = Ve, r === Di.KTX2 ? c = await In.loadAsync(`${q.absolutePath}/assets/images/${Sx}`) : r === Di.BITMAP ? c = await ud.loadAsync(tp) : (r = Di.IMAGE, c = await Nm.loadAsync(Sx)))
                }
                a !== c && a.copy(c),
                n.includes("repeat") && (n.includes("mirror") ? (a.wrapS = Do, a.wrapT = Do) : (a.wrapS = Ar, a.wrapT = Ar)),
                n.includes("data") ? (a.magFilter = _t, a.minFilter = _t) : n.includes("nearest") && (a.magFilter = gt, a.minFilter = gt),
                (n.includes("nearest") || n.includes("data") || n.includes("nomipmaps")) && (a.generateMipmaps = !1),
                n.includes("pmrem") && (n.includes("refraction") ? a.mapping = Qu : a.mapping = zu),
                n.includes("lut") && (n.includes("luttetrahedral") ? (a.magFilter = gt, a.minFilter = gt) : (a.magFilter = _t, a.minFilter = _t)),
                a.colorSpace = l,
                a.needsUpdate = !0,
                o()
            }, 0), a
        },
        loadCurves(i, e=!1, t=1) {
            const s = `curves_${i}_<>_${e}_<>_${t}`;
            if (this._texturesCache.has(s))
                return this._texturesCache.get(s);
            const n = NR(i, e, t);
            return this._texturesCache.set(s, n), n
        },
        loadProgressive(i, e, t="value") {
            return new Promise(async s => {
                await e[t]._loaded;
                const n = this.load(i, e[t]._loadMode);
                await n._loaded,
                e[t] = n,
                s(n)
            })
        }
    };
function HR() {
    In.setTranscoderPath(`${q.absolutePath}/assets/libs/basis/`),
    In.setPath(`${q.absolutePath}/assets/images/`),
    ud.setPath(`${q.absolutePath}/assets/images/`),
    gg.setPath(`${q.absolutePath}/assets/images/`),
    vg.setPath(`${q.absolutePath}/assets/images/`),
    Nm.setPath(`${q.absolutePath}/assets/images/`)
}
function VR() {
    const i = In.workerSourceURL;
    In.workerSourceURL = "",
    In.dispose(),
    In.workerSourceURL = i,
    ud.dispose(),
    gg.dispose(),
    vg.dispose(),
    le._texturesCache.forEach(e => {
        var t;
        return (t = e.dispose) == null ? void 0 : t.call(e)
    }),
    le._texturesCache.clear()
}
const ip = new WeakMap;
class WR extends Nn {
    constructor(e)
    {
        super(e),
        this.decoderPath = "",
        this.decoderConfig = {},
        this.decoderBinary = null,
        this.decoderPending = null,
        this.workerLimit = 4,
        this.workerPool = [],
        this.workerNextTaskID = 1,
        this.workerSourceURL = "",
        this.defaultAttributeIDs = {
            position: "POSITION",
            normal: "NORMAL",
            color: "COLOR",
            uv: "TEX_COORD"
        },
        this.defaultAttributeTypes = {
            position: "Float32Array",
            normal: "Float32Array",
            color: "Float32Array",
            uv: "Float32Array"
        }
    }
    setDecoderPath(e)
    {
        return this.decoderPath = e, this
    }
    setDecoderConfig(e)
    {
        return this.decoderConfig = e, this
    }
    setWorkerLimit(e)
    {
        return this.workerLimit = e, this
    }
    load(e, t, s, n)
    {
        const r = new Ts(this.manager);
        r.setPath(this.path),
        r.setResponseType("arraybuffer"),
        r.setRequestHeader(this.requestHeader),
        r.setWithCredentials(this.withCredentials),
        r.load(e, a => {
            this.parse(a, t, n)
        }, s, n)
    }
    parse(e, t, s=() => {})
    {
        this.decodeDracoFile(e, t, null, null, Ve, s).catch(s)
    }
    decodeDracoFile(e, t, s, n, r=oi, a=() => {})
    {
        const o = {
            attributeIDs: s || this.defaultAttributeIDs,
            attributeTypes: n || this.defaultAttributeTypes,
            useUniqueIDs: !!s,
            vertexColorSpace: r
        };
        return this.decodeGeometry(e, o).then(t).catch(a)
    }
    decodeGeometry(e, t)
    {
        const s = JSON.stringify(t);
        if (ip.has(e)) {
            const l = ip.get(e);
            if (l.key === s)
                return l.promise;
            if (e.byteLength === 0)
                throw new Error("THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred.")
        }
        let n;
        const r = this.workerNextTaskID++,
            a = e.byteLength,
            o = this._getWorker(r, a).then(l => (n = l, new Promise((c, h) => {
                n._callbacks[r] = {
                    resolve: c,
                    reject: h
                },
                n.postMessage({
                    type: "decode",
                    id: r,
                    taskConfig: t,
                    buffer: e
                }, [e])
            }))).then(l => this._createGeometry(l.geometry));
        return o.catch(() => !0).then(() => {
            n && r && this._releaseTask(n, r)
        }), ip.set(e, {
            key: s,
            promise: o
        }), o
    }
    _createGeometry(e)
    {
        const t = new ot;
        e.index && t.setIndex(new We(e.index.array, 1));
        for (let s = 0; s < e.attributes.length; s++) {
            const n = e.attributes[s],
                r = n.name,
                a = n.array,
                o = n.itemSize,
                l = new We(a, o);
            r === "color" && (this._assignVertexColorSpace(l, n.vertexColorSpace), l.normalized = !(a instanceof Float32Array)),
            t.setAttribute(r, l)
        }
        return t
    }
    _assignVertexColorSpace(e, t)
    {
        if (t !== Ve)
            return;
        const s = new Z;
        for (let n = 0, r = e.count; n < r; n++)
            s.fromBufferAttribute(e, n).convertSRGBToLinear(),
            e.setXYZ(n, s.r, s.g, s.b)
    }
    _loadLibrary(e, t)
    {
        const s = new Ts(this.manager);
        return s.setPath(this.decoderPath), s.setResponseType(t), s.setWithCredentials(this.withCredentials), new Promise((n, r) => {
            s.load(e, n, void 0, r)
        })
    }
    preload()
    {
        return this._initDecoder(), this
    }
    _initDecoder()
    {
        if (this.decoderPending)
            return this.decoderPending;
        const e = typeof WebAssembly != "object" || this.decoderConfig.type === "js",
            t = [];
        return e ? t.push(this._loadLibrary("draco_decoder.js", "text")) : (t.push(this._loadLibrary("draco_wasm_wrapper.js", "text")), t.push(this._loadLibrary("draco_decoder.wasm", "arraybuffer"))), this.decoderPending = Promise.all(t).then(s => {
            const n = s[0];
            e || (this.decoderConfig.wasmBinary = s[1]);
            const r = YR.toString(),
                a = ["/* draco decoder */", n, "", "/* worker */", r.substring(r.indexOf("{") + 1, r.lastIndexOf("}"))].join(`
                `);
            this.workerSourceURL = URL.createObjectURL(new Blob([a]))
        }), this.decoderPending
    }
    _getWorker(e, t)
    {
        return this._initDecoder().then(() => {
            if (this.workerPool.length < this.workerLimit) {
                const n = new Worker(this.workerSourceURL);
                n._callbacks = {},
                n._taskCosts = {},
                n._taskLoad = 0,
                n.postMessage({
                    type: "init",
                    decoderConfig: this.decoderConfig
                }),
                n.onmessage = function(r) {
                    const a = r.data;
                    switch (a.type) {
                    case "decode":
                        n._callbacks[a.id].resolve(a);
                        break;
                    case "error":
                        n._callbacks[a.id].reject(a);
                        break;
                    default:
                        console.error('THREE.DRACOLoader: Unexpected message, "' + a.type + '"')
                    }
                },
                this.workerPool.push(n)
            } else
                this.workerPool.sort(function(n, r) {
                    return n._taskLoad > r._taskLoad ? -1 : 1
                });
            const s = this.workerPool[this.workerPool.length - 1];
            return s._taskCosts[e] = t, s._taskLoad += t, s
        })
    }
    _releaseTask(e, t)
    {
        e._taskLoad -= e._taskCosts[t],
        delete e._callbacks[t],
        delete e._taskCosts[t]
    }
    debug()
    {
        console.log("Task load: ", this.workerPool.map(e => e._taskLoad))
    }
    dispose()
    {
        for (let e = 0; e < this.workerPool.length; ++e)
            this.workerPool[e].terminate();
        return this.workerPool.length = 0, this.workerSourceURL !== "" && URL.revokeObjectURL(this.workerSourceURL), this
    }
}
function YR() {
    let i,
        e;
    onmessage = function(a) {
        const o = a.data;
        switch (o.type) {
        case "init":
            i = o.decoderConfig,
            e = new Promise(function(h) {
                i.onModuleLoaded = function(d) {
                    h({
                        draco: d
                    })
                },
                DracoDecoderModule(i)
            });
            break;
        case "decode":
            const l = o.buffer,
                c = o.taskConfig;
            e.then(h => {
                const d = h.draco,
                    u = new d.Decoder;
                try {
                    const f = t(d, u, new Int8Array(l), c),
                        p = f.attributes.map(A => A.array.buffer);
                    f.index && p.push(f.index.array.buffer),
                    self.postMessage({
                        type: "decode",
                        id: o.id,
                        geometry: f
                    }, p)
                } catch (f) {
                    console.error(f),
                    self.postMessage({
                        type: "error",
                        id: o.id,
                        error: f.message
                    })
                } finally {
                    d.destroy(u)
                }
            });
            break
        }
    };
    function t(a, o, l, c) {
        const h = c.attributeIDs,
            d = c.attributeTypes;
        let u,
            f;
        const p = o.GetEncodedGeometryType(l);
        if (p === a.TRIANGULAR_MESH)
            u = new a.Mesh,
            f = o.DecodeArrayToMesh(l, l.byteLength, u);
        else if (p === a.POINT_CLOUD)
            u = new a.PointCloud,
            f = o.DecodeArrayToPointCloud(l, l.byteLength, u);
        else
            throw new Error("THREE.DRACOLoader: Unexpected geometry type.");
        if (!f.ok() || u.ptr === 0)
            throw new Error("THREE.DRACOLoader: Decoding failed: " + f.error_msg());
        const A = {
            index: null,
            attributes: []
        };
        for (const m in h) {
            const g = self[d[m]];
            let x,
                v;
            if (c.useUniqueIDs)
                v = h[m],
                x = o.GetAttributeByUniqueId(u, v);
            else {
                if (v = o.GetAttributeId(u, a[h[m]]), v === -1)
                    continue;
                x = o.GetAttribute(u, v)
            }
            const y = n(a, o, u, m, g, x);
            m === "color" && (y.vertexColorSpace = c.vertexColorSpace),
            A.attributes.push(y)
        }
        return p === a.TRIANGULAR_MESH && (A.index = s(a, o, u)), a.destroy(u), A
    }
    function s(a, o, l) {
        const c = l.num_faces() * 3,
            h = c * 4,
            d = a._malloc(h);
        o.GetTrianglesUInt32Array(l, h, d);
        const u = new Uint32Array(a.HEAPF32.buffer, d, c).slice();
        return a._free(d), {
            array: u,
            itemSize: 1
        }
    }
    function n(a, o, l, c, h, d) {
        const u = d.num_components(),
            f = l.num_points() * u,
            p = f * h.BYTES_PER_ELEMENT,
            A = r(a, h),
            m = a._malloc(p);
        o.GetAttributeDataArrayForAllPoints(l, d, A, p, m);
        const g = new h(a.HEAPF32.buffer, m, f).slice();
        return a._free(m), {
            name: c,
            array: g,
            itemSize: u
        }
    }
    function r(a, o) {
        switch (o) {
        case Float32Array:
            return a.DT_FLOAT32;
        case Int8Array:
            return a.DT_INT8;
        case Int16Array:
            return a.DT_INT16;
        case Int32Array:
            return a.DT_INT32;
        case Uint8Array:
            return a.DT_UINT8;
        case Uint16Array:
            return a.DT_UINT16;
        case Uint32Array:
            return a.DT_UINT32
        }
    }
}
function Mx(i, e) {
    if (e === yC)
        return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), i;
    if (e === Op || e === Cy) {
        let t = i.getIndex();
        if (t === null) {
            const a = [],
                o = i.getAttribute("position");
            if (o !== void 0) {
                for (let l = 0; l < o.count; l++)
                    a.push(l);
                i.setIndex(a),
                t = i.getIndex()
            } else
                return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), i
        }
        const s = t.count - 2,
            n = [];
        if (e === Op)
            for (let a = 1; a <= s; a++)
                n.push(t.getX(0)),
                n.push(t.getX(a)),
                n.push(t.getX(a + 1));
        else
            for (let a = 0; a < s; a++)
                a % 2 === 0 ? (n.push(t.getX(a)), n.push(t.getX(a + 1)), n.push(t.getX(a + 2))) : (n.push(t.getX(a + 2)), n.push(t.getX(a + 1)), n.push(t.getX(a)));
        n.length / 3 !== s && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
        const r = i.clone();
        return r.setIndex(n), r.clearGroups(), r
    } else
        return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", e), i
}
class qR extends Nn {
    constructor(e)
    {
        super(e),
        this.dracoLoader = null,
        this.ktx2Loader = null,
        this.meshoptDecoder = null,
        this.pluginCallbacks = [],
        this.register(function(t) {
            return new ZR(t)
        }),
        this.register(function(t) {
            return new $R(t)
        }),
        this.register(function(t) {
            return new lU(t)
        }),
        this.register(function(t) {
            return new cU(t)
        }),
        this.register(function(t) {
            return new hU(t)
        }),
        this.register(function(t) {
            return new tU(t)
        }),
        this.register(function(t) {
            return new iU(t)
        }),
        this.register(function(t) {
            return new sU(t)
        }),
        this.register(function(t) {
            return new nU(t)
        }),
        this.register(function(t) {
            return new jR(t)
        }),
        this.register(function(t) {
            return new rU(t)
        }),
        this.register(function(t) {
            return new eU(t)
        }),
        this.register(function(t) {
            return new oU(t)
        }),
        this.register(function(t) {
            return new aU(t)
        }),
        this.register(function(t) {
            return new KR(t)
        }),
        this.register(function(t) {
            return new uU(t)
        }),
        this.register(function(t) {
            return new dU(t)
        })
    }
    load(e, t, s, n)
    {
        const r = this;
        let a;
        if (this.resourcePath !== "")
            a = this.resourcePath;
        else if (this.path !== "") {
            const c = Wl.extractUrlBase(e);
            a = Wl.resolveURL(c, this.path)
        } else
            a = Wl.extractUrlBase(e);
        this.manager.itemStart(e);
        const o = function(c) {
                n ? n(c) : console.error(c),
                r.manager.itemError(e),
                r.manager.itemEnd(e)
            },
            l = new Ts(this.manager);
        l.setPath(this.path),
        l.setResponseType("arraybuffer"),
        l.setRequestHeader(this.requestHeader),
        l.setWithCredentials(this.withCredentials),
        l.load(e, function(c) {
            try {
                r.parse(c, a, function(h) {
                    t(h),
                    r.manager.itemEnd(e)
                }, o)
            } catch (h) {
                o(h)
            }
        }, s, o)
    }
    setDRACOLoader(e)
    {
        return this.dracoLoader = e, this
    }
    setDDSLoader()
    {
        throw new Error('THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".')
    }
    setKTX2Loader(e)
    {
        return this.ktx2Loader = e, this
    }
    setMeshoptDecoder(e)
    {
        return this.meshoptDecoder = e, this
    }
    register(e)
    {
        return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this
    }
    unregister(e)
    {
        return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this
    }
    parse(e, t, s, n)
    {
        let r;
        const a = {},
            o = {},
            l = new TextDecoder;
        if (typeof e == "string")
            r = JSON.parse(e);
        else if (e instanceof ArrayBuffer)
            if (l.decode(new Uint8Array(e, 0, 4)) === nE) {
                try {
                    a[ut.KHR_BINARY_GLTF] = new fU(e)
                } catch (h) {
                    n && n(h);
                    return
                }
                r = JSON.parse(a[ut.KHR_BINARY_GLTF].content)
            } else
                r = JSON.parse(l.decode(e));
        else
            r = e;
        if (r.asset === void 0 || r.asset.version[0] < 2) {
            n && n(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
            return
        }
        const c = new MU(r, {
            path: t || this.resourcePath || "",
            crossOrigin: this.crossOrigin,
            requestHeader: this.requestHeader,
            manager: this.manager,
            ktx2Loader: this.ktx2Loader,
            meshoptDecoder: this.meshoptDecoder
        });
        c.fileLoader.setRequestHeader(this.requestHeader);
        for (let h = 0; h < this.pluginCallbacks.length; h++) {
            const d = this.pluginCallbacks[h](c);
            d.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),
            o[d.name] = d,
            a[d.name] = !0
        }
        if (r.extensionsUsed)
            for (let h = 0; h < r.extensionsUsed.length; ++h) {
                const d = r.extensionsUsed[h],
                    u = r.extensionsRequired || [];
                switch (d) {
                case ut.KHR_MATERIALS_UNLIT:
                    a[d] = new JR;
                    break;
                case ut.KHR_DRACO_MESH_COMPRESSION:
                    a[d] = new pU(r, this.dracoLoader);
                    break;
                case ut.KHR_TEXTURE_TRANSFORM:
                    a[d] = new mU;
                    break;
                case ut.KHR_MESH_QUANTIZATION:
                    a[d] = new AU;
                    break;
                default:
                    u.indexOf(d) >= 0 && o[d] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + d + '".')
                }
            }
        c.setExtensions(a),
        c.setPlugins(o),
        c.parse(s, n)
    }
    parseAsync(e, t)
    {
        const s = this;
        return new Promise(function(n, r) {
            s.parse(e, t, n, r)
        })
    }
}
function XR() {
    let i = {};
    return {
        get: function(e) {
            return i[e]
        },
        add: function(e, t) {
            i[e] = t
        },
        remove: function(e) {
            delete i[e]
        },
        removeAll: function() {
            i = {}
        }
    }
}
const ut = {
    KHR_BINARY_GLTF: "KHR_binary_glTF",
    KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
    KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
    KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
    KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
    KHR_MATERIALS_IOR: "KHR_materials_ior",
    KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
    KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
    KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
    KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
    KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
    KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
    KHR_MATERIALS_VOLUME: "KHR_materials_volume",
    KHR_TEXTURE_BASISU: "KHR_texture_basisu",
    KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
    KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
    KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
    EXT_MATERIALS_BUMP: "EXT_materials_bump",
    EXT_TEXTURE_WEBP: "EXT_texture_webp",
    EXT_TEXTURE_AVIF: "EXT_texture_avif",
    EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
    EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
};
class KR {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.KHR_LIGHTS_PUNCTUAL,
        this.cache = {
            refs: {},
            uses: {}
        }
    }
    _markDefs()
    {
        const e = this.parser,
            t = this.parser.json.nodes || [];
        for (let s = 0, n = t.length; s < n; s++) {
            const r = t[s];
            r.extensions && r.extensions[this.name] && r.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, r.extensions[this.name].light)
        }
    }
    _loadLight(e)
    {
        const t = this.parser,
            s = "light:" + e;
        let n = t.cache.get(s);
        if (n)
            return n;
        const r = t.json,
            a = ((r.extensions && r.extensions[this.name] || {}).lights || [])[e];
        let o;
        const l = new Z(16777215);
        a.color !== void 0 && l.setRGB(a.color[0], a.color[1], a.color[2], oi);
        const c = a.range !== void 0 ? a.range : 0;
        switch (a.type) {
        case "directional":
            o = new WI(l),
            o.target.position.set(0, 0, -1),
            o.add(o.target);
            break;
        case "point":
            o = new HI(l),
            o.distance = c;
            break;
        case "spot":
            o = new QI(l),
            o.distance = c,
            a.spot = a.spot || {},
            a.spot.innerConeAngle = a.spot.innerConeAngle !== void 0 ? a.spot.innerConeAngle : 0,
            a.spot.outerConeAngle = a.spot.outerConeAngle !== void 0 ? a.spot.outerConeAngle : Math.PI / 4,
            o.angle = a.spot.outerConeAngle,
            o.penumbra = 1 - a.spot.innerConeAngle / a.spot.outerConeAngle,
            o.target.position.set(0, 0, -1),
            o.add(o.target);
            break;
        default:
            throw new Error("THREE.GLTFLoader: Unexpected light type: " + a.type)
        }
        return o.position.set(0, 0, 0), o.decay = 2, Cn(o, a), a.intensity !== void 0 && (o.intensity = a.intensity), o.name = t.createUniqueName(a.name || "light_" + e), n = Promise.resolve(o), t.cache.add(s, n), n
    }
    getDependency(e, t)
    {
        if (e === "light")
            return this._loadLight(t)
    }
    createNodeAttachment(e)
    {
        const t = this,
            s = this.parser,
            n = s.json.nodes[e],
            r = (n.extensions && n.extensions[this.name] || {}).light;
        return r === void 0 ? null : this._loadLight(r).then(function(a) {
            return s._getNodeRef(t.cache, r, a)
        })
    }
}
class JR {
    constructor()
    {
        this.name = ut.KHR_MATERIALS_UNLIT
    }
    getMaterialType()
    {
        return or
    }
    extendParams(e, t, s)
    {
        const n = [];
        e.color = new Z(1, 1, 1),
        e.opacity = 1;
        const r = t.pbrMetallicRoughness;
        if (r) {
            if (Array.isArray(r.baseColorFactor)) {
                const a = r.baseColorFactor;
                e.color.setRGB(a[0], a[1], a[2], oi),
                e.opacity = a[3]
            }
            r.baseColorTexture !== void 0 && n.push(s.assignTexture(e, "map", r.baseColorTexture, Ve))
        }
        return Promise.all(n)
    }
}
class jR {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.KHR_MATERIALS_EMISSIVE_STRENGTH
    }
    extendMaterialParams(e, t)
    {
        const s = this.parser.json.materials[e];
        if (!s.extensions || !s.extensions[this.name])
            return Promise.resolve();
        const n = s.extensions[this.name].emissiveStrength;
        return n !== void 0 && (t.emissiveIntensity = n), Promise.resolve()
    }
}
class ZR {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.KHR_MATERIALS_CLEARCOAT
    }
    getMaterialType(e)
    {
        const t = this.parser.json.materials[e];
        return !t.extensions || !t.extensions[this.name] ? null : Ys
    }
    extendMaterialParams(e, t)
    {
        const s = this.parser,
            n = s.json.materials[e];
        if (!n.extensions || !n.extensions[this.name])
            return Promise.resolve();
        const r = [],
            a = n.extensions[this.name];
        if (a.clearcoatFactor !== void 0 && (t.clearcoat = a.clearcoatFactor), a.clearcoatTexture !== void 0 && r.push(s.assignTexture(t, "clearcoatMap", a.clearcoatTexture)), a.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = a.clearcoatRoughnessFactor), a.clearcoatRoughnessTexture !== void 0 && r.push(s.assignTexture(t, "clearcoatRoughnessMap", a.clearcoatRoughnessTexture)), a.clearcoatNormalTexture !== void 0 && (r.push(s.assignTexture(t, "clearcoatNormalMap", a.clearcoatNormalTexture)), a.clearcoatNormalTexture.scale !== void 0)) {
            const o = a.clearcoatNormalTexture.scale;
            t.clearcoatNormalScale = new H(o, o)
        }
        return Promise.all(r)
    }
}
class $R {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.KHR_MATERIALS_DISPERSION
    }
    getMaterialType(e)
    {
        const t = this.parser.json.materials[e];
        return !t.extensions || !t.extensions[this.name] ? null : Ys
    }
    extendMaterialParams(e, t)
    {
        const s = this.parser.json.materials[e];
        if (!s.extensions || !s.extensions[this.name])
            return Promise.resolve();
        const n = s.extensions[this.name];
        return t.dispersion = n.dispersion !== void 0 ? n.dispersion : 0, Promise.resolve()
    }
}
class eU {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.KHR_MATERIALS_IRIDESCENCE
    }
    getMaterialType(e)
    {
        const t = this.parser.json.materials[e];
        return !t.extensions || !t.extensions[this.name] ? null : Ys
    }
    extendMaterialParams(e, t)
    {
        const s = this.parser,
            n = s.json.materials[e];
        if (!n.extensions || !n.extensions[this.name])
            return Promise.resolve();
        const r = [],
            a = n.extensions[this.name];
        return a.iridescenceFactor !== void 0 && (t.iridescence = a.iridescenceFactor), a.iridescenceTexture !== void 0 && r.push(s.assignTexture(t, "iridescenceMap", a.iridescenceTexture)), a.iridescenceIor !== void 0 && (t.iridescenceIOR = a.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), a.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = a.iridescenceThicknessMinimum), a.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = a.iridescenceThicknessMaximum), a.iridescenceThicknessTexture !== void 0 && r.push(s.assignTexture(t, "iridescenceThicknessMap", a.iridescenceThicknessTexture)), Promise.all(r)
    }
}
class tU {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.KHR_MATERIALS_SHEEN
    }
    getMaterialType(e)
    {
        const t = this.parser.json.materials[e];
        return !t.extensions || !t.extensions[this.name] ? null : Ys
    }
    extendMaterialParams(e, t)
    {
        const s = this.parser,
            n = s.json.materials[e];
        if (!n.extensions || !n.extensions[this.name])
            return Promise.resolve();
        const r = [];
        t.sheenColor = new Z(0, 0, 0),
        t.sheenRoughness = 0,
        t.sheen = 1;
        const a = n.extensions[this.name];
        if (a.sheenColorFactor !== void 0) {
            const o = a.sheenColorFactor;
            t.sheenColor.setRGB(o[0], o[1], o[2], oi)
        }
        return a.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = a.sheenRoughnessFactor), a.sheenColorTexture !== void 0 && r.push(s.assignTexture(t, "sheenColorMap", a.sheenColorTexture, Ve)), a.sheenRoughnessTexture !== void 0 && r.push(s.assignTexture(t, "sheenRoughnessMap", a.sheenRoughnessTexture)), Promise.all(r)
    }
}
class iU {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.KHR_MATERIALS_TRANSMISSION
    }
    getMaterialType(e)
    {
        const t = this.parser.json.materials[e];
        return !t.extensions || !t.extensions[this.name] ? null : Ys
    }
    extendMaterialParams(e, t)
    {
        const s = this.parser,
            n = s.json.materials[e];
        if (!n.extensions || !n.extensions[this.name])
            return Promise.resolve();
        const r = [],
            a = n.extensions[this.name];
        return a.transmissionFactor !== void 0 && (t.transmission = a.transmissionFactor), a.transmissionTexture !== void 0 && r.push(s.assignTexture(t, "transmissionMap", a.transmissionTexture)), Promise.all(r)
    }
}
class sU {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.KHR_MATERIALS_VOLUME
    }
    getMaterialType(e)
    {
        const t = this.parser.json.materials[e];
        return !t.extensions || !t.extensions[this.name] ? null : Ys
    }
    extendMaterialParams(e, t)
    {
        const s = this.parser,
            n = s.json.materials[e];
        if (!n.extensions || !n.extensions[this.name])
            return Promise.resolve();
        const r = [],
            a = n.extensions[this.name];
        t.thickness = a.thicknessFactor !== void 0 ? a.thicknessFactor : 0,
        a.thicknessTexture !== void 0 && r.push(s.assignTexture(t, "thicknessMap", a.thicknessTexture)),
        t.attenuationDistance = a.attenuationDistance || 1 / 0;
        const o = a.attenuationColor || [1, 1, 1];
        return t.attenuationColor = new Z().setRGB(o[0], o[1], o[2], oi), Promise.all(r)
    }
}
class nU {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.KHR_MATERIALS_IOR
    }
    getMaterialType(e)
    {
        const t = this.parser.json.materials[e];
        return !t.extensions || !t.extensions[this.name] ? null : Ys
    }
    extendMaterialParams(e, t)
    {
        const s = this.parser.json.materials[e];
        if (!s.extensions || !s.extensions[this.name])
            return Promise.resolve();
        const n = s.extensions[this.name];
        return t.ior = n.ior !== void 0 ? n.ior : 1.5, Promise.resolve()
    }
}
class rU {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.KHR_MATERIALS_SPECULAR
    }
    getMaterialType(e)
    {
        const t = this.parser.json.materials[e];
        return !t.extensions || !t.extensions[this.name] ? null : Ys
    }
    extendMaterialParams(e, t)
    {
        const s = this.parser,
            n = s.json.materials[e];
        if (!n.extensions || !n.extensions[this.name])
            return Promise.resolve();
        const r = [],
            a = n.extensions[this.name];
        t.specularIntensity = a.specularFactor !== void 0 ? a.specularFactor : 1,
        a.specularTexture !== void 0 && r.push(s.assignTexture(t, "specularIntensityMap", a.specularTexture));
        const o = a.specularColorFactor || [1, 1, 1];
        return t.specularColor = new Z().setRGB(o[0], o[1], o[2], oi), a.specularColorTexture !== void 0 && r.push(s.assignTexture(t, "specularColorMap", a.specularColorTexture, Ve)), Promise.all(r)
    }
}
class aU {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.EXT_MATERIALS_BUMP
    }
    getMaterialType(e)
    {
        const t = this.parser.json.materials[e];
        return !t.extensions || !t.extensions[this.name] ? null : Ys
    }
    extendMaterialParams(e, t)
    {
        const s = this.parser,
            n = s.json.materials[e];
        if (!n.extensions || !n.extensions[this.name])
            return Promise.resolve();
        const r = [],
            a = n.extensions[this.name];
        return t.bumpScale = a.bumpFactor !== void 0 ? a.bumpFactor : 1, a.bumpTexture !== void 0 && r.push(s.assignTexture(t, "bumpMap", a.bumpTexture)), Promise.all(r)
    }
}
class oU {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.KHR_MATERIALS_ANISOTROPY
    }
    getMaterialType(e)
    {
        const t = this.parser.json.materials[e];
        return !t.extensions || !t.extensions[this.name] ? null : Ys
    }
    extendMaterialParams(e, t)
    {
        const s = this.parser,
            n = s.json.materials[e];
        if (!n.extensions || !n.extensions[this.name])
            return Promise.resolve();
        const r = [],
            a = n.extensions[this.name];
        return a.anisotropyStrength !== void 0 && (t.anisotropy = a.anisotropyStrength), a.anisotropyRotation !== void 0 && (t.anisotropyRotation = a.anisotropyRotation), a.anisotropyTexture !== void 0 && r.push(s.assignTexture(t, "anisotropyMap", a.anisotropyTexture)), Promise.all(r)
    }
}
class lU {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.KHR_TEXTURE_BASISU
    }
    loadTexture(e)
    {
        const t = this.parser,
            s = t.json,
            n = s.textures[e];
        if (!n.extensions || !n.extensions[this.name])
            return null;
        const r = n.extensions[this.name],
            a = t.options.ktx2Loader;
        if (!a) {
            if (s.extensionsRequired && s.extensionsRequired.indexOf(this.name) >= 0)
                throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
            return null
        }
        return t.loadTextureImage(e, r.source, a)
    }
}
class cU {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.EXT_TEXTURE_WEBP,
        this.isSupported = null
    }
    loadTexture(e)
    {
        const t = this.name,
            s = this.parser,
            n = s.json,
            r = n.textures[e];
        if (!r.extensions || !r.extensions[t])
            return null;
        const a = r.extensions[t],
            o = n.images[a.source];
        let l = s.textureLoader;
        if (o.uri) {
            const c = s.options.manager.getHandler(o.uri);
            c !== null && (l = c)
        }
        return this.detectSupport().then(function(c) {
            if (c)
                return s.loadTextureImage(e, a.source, l);
            if (n.extensionsRequired && n.extensionsRequired.indexOf(t) >= 0)
                throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");
            return s.loadTexture(e)
        })
    }
    detectSupport()
    {
        return this.isSupported || (this.isSupported = new Promise(function(e) {
            const t = new Image;
            t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
            t.onload = t.onerror = function() {
                e(t.height === 1)
            }
        })), this.isSupported
    }
}
class hU {
    constructor(e)
    {
        this.parser = e,
        this.name = ut.EXT_TEXTURE_AVIF,
        this.isSupported = null
    }
    loadTexture(e)
    {
        const t = this.name,
            s = this.parser,
            n = s.json,
            r = n.textures[e];
        if (!r.extensions || !r.extensions[t])
            return null;
        const a = r.extensions[t],
            o = n.images[a.source];
        let l = s.textureLoader;
        if (o.uri) {
            const c = s.options.manager.getHandler(o.uri);
            c !== null && (l = c)
        }
        return this.detectSupport().then(function(c) {
            if (c)
                return s.loadTextureImage(e, a.source, l);
            if (n.extensionsRequired && n.extensionsRequired.indexOf(t) >= 0)
                throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");
            return s.loadTexture(e)
        })
    }
    detectSupport()
    {
        return this.isSupported || (this.isSupported = new Promise(function(e) {
            const t = new Image;
            t.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",
            t.onload = t.onerror = function() {
                e(t.height === 1)
            }
        })), this.isSupported
    }
}
class uU {
    constructor(e)
    {
        this.name = ut.EXT_MESHOPT_COMPRESSION,
        this.parser = e
    }
    loadBufferView(e)
    {
        const t = this.parser.json,
            s = t.bufferViews[e];
        if (s.extensions && s.extensions[this.name]) {
            const n = s.extensions[this.name],
                r = this.parser.getDependency("buffer", n.buffer),
                a = this.parser.options.meshoptDecoder;
            if (!a || !a.supported) {
                if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0)
                    throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
                return null
            }
            return r.then(function(o) {
                const l = n.byteOffset || 0,
                    c = n.byteLength || 0,
                    h = n.count,
                    d = n.byteStride,
                    u = new Uint8Array(o, l, c);
                return a.decodeGltfBufferAsync ? a.decodeGltfBufferAsync(h, d, u, n.mode, n.filter).then(function(f) {
                    return f.buffer
                }) : a.ready.then(function() {
                    const f = new ArrayBuffer(h * d);
                    return a.decodeGltfBuffer(new Uint8Array(f), h, d, u, n.mode, n.filter), f
                })
            })
        } else
            return null
    }
}
class dU {
    constructor(e)
    {
        this.name = ut.EXT_MESH_GPU_INSTANCING,
        this.parser = e
    }
    createNodeMesh(e)
    {
        const t = this.parser.json,
            s = t.nodes[e];
        if (!s.extensions || !s.extensions[this.name] || s.mesh === void 0)
            return null;
        const n = t.meshes[s.mesh];
        for (const l of n.primitives)
            if (l.mode !== ys.TRIANGLES && l.mode !== ys.TRIANGLE_STRIP && l.mode !== ys.TRIANGLE_FAN && l.mode !== void 0)
                return null;
        const r = s.extensions[this.name].attributes,
            a = [],
            o = {};
        for (const l in r)
            a.push(this.parser.getDependency("accessor", r[l]).then(c => (o[l] = c, o[l])));
        return a.length < 1 ? null : (a.push(this.parser.createNodeMesh(e)), Promise.all(a).then(l => {
            const c = l.pop(),
                h = c.isGroup ? c.children : [c],
                d = l[0].count,
                u = [];
            for (const f of h) {
                const p = new De,
                    A = new b,
                    m = new Vi,
                    g = new b(1, 1, 1),
                    x = new OA(f.geometry, f.material, d);
                for (let v = 0; v < d; v++)
                    o.TRANSLATION && A.fromBufferAttribute(o.TRANSLATION, v),
                    o.ROTATION && m.fromBufferAttribute(o.ROTATION, v),
                    o.SCALE && g.fromBufferAttribute(o.SCALE, v),
                    x.setMatrixAt(v, p.compose(A, m, g));
                for (const v in o)
                    if (v === "_COLOR_0") {
                        const y = o[v];
                        x.instanceColor = new gr(y.array, y.itemSize, y.normalized)
                    } else
                        v !== "TRANSLATION" && v !== "ROTATION" && v !== "SCALE" && f.geometry.setAttribute(v, o[v]);
                It.prototype.copy.call(x, f),
                this.parser.assignFinalMaterial(x),
                u.push(x)
            }
            return c.isGroup ? (c.clear(), c.add(...u), c) : u[0]
        }))
    }
}
const nE = "glTF",
    pl = 12,
    bx = {
        JSON: 1313821514,
        BIN: 5130562
    };
class fU {
    constructor(e)
    {
        this.name = ut.KHR_BINARY_GLTF,
        this.content = null,
        this.body = null;
        const t = new DataView(e, 0, pl),
            s = new TextDecoder;
        if (this.header = {
            magic: s.decode(new Uint8Array(e.slice(0, 4))),
            version: t.getUint32(4, !0),
            length: t.getUint32(8, !0)
        }, this.header.magic !== nE)
            throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
        if (this.header.version < 2)
            throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
        const n = this.header.length - pl,
            r = new DataView(e, pl);
        let a = 0;
        for (; a < n;) {
            const o = r.getUint32(a, !0);
            a += 4;
            const l = r.getUint32(a, !0);
            if (a += 4, l === bx.JSON) {
                const c = new Uint8Array(e, pl + a, o);
                this.content = s.decode(c)
            } else if (l === bx.BIN) {
                const c = pl + a;
                this.body = e.slice(c, c + o)
            }
            a += o
        }
        if (this.content === null)
            throw new Error("THREE.GLTFLoader: JSON content not found.")
    }
}
class pU {
    constructor(e, t)
    {
        if (!t)
            throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
        this.name = ut.KHR_DRACO_MESH_COMPRESSION,
        this.json = e,
        this.dracoLoader = t,
        this.dracoLoader.preload()
    }
    decodePrimitive(e, t)
    {
        const s = this.json,
            n = this.dracoLoader,
            r = e.extensions[this.name].bufferView,
            a = e.extensions[this.name].attributes,
            o = {},
            l = {},
            c = {};
        for (const h in a) {
            const d = Om[h] || h.toLowerCase();
            o[d] = a[h]
        }
        for (const h in e.attributes) {
            const d = Om[h] || h.toLowerCase();
            if (a[h] !== void 0) {
                const u = s.accessors[e.attributes[h]],
                    f = Io[u.componentType];
                c[d] = f.name,
                l[d] = u.normalized === !0
            }
        }
        return t.getDependency("bufferView", r).then(function(h) {
            return new Promise(function(d, u) {
                n.decodeDracoFile(h, function(f) {
                    for (const p in f.attributes) {
                        const A = f.attributes[p],
                            m = l[p];
                        m !== void 0 && (A.normalized = m)
                    }
                    d(f)
                }, o, c, oi, u)
            })
        })
    }
}
class mU {
    constructor()
    {
        this.name = ut.KHR_TEXTURE_TRANSFORM
    }
    extendTexture(e, t)
    {
        return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = !0), e
    }
}
class AU {
    constructor()
    {
        this.name = ut.KHR_MESH_QUANTIZATION
    }
}
class rE extends Tc {
    constructor(e, t, s, n)
    {
        super(e, t, s, n)
    }
    copySampleValue_(e)
    {
        const t = this.resultBuffer,
            s = this.sampleValues,
            n = this.valueSize,
            r = e * n * 3 + n;
        for (let a = 0; a !== n; a++)
            t[a] = s[r + a];
        return t
    }
    interpolate_(e, t, s, n)
    {
        const r = this.resultBuffer,
            a = this.sampleValues,
            o = this.valueSize,
            l = o * 2,
            c = o * 3,
            h = n - t,
            d = (s - t) / h,
            u = d * d,
            f = u * d,
            p = e * c,
            A = p - c,
            m = -2 * f + 3 * u,
            g = f - u,
            x = 1 - m,
            v = g - u + d;
        for (let y = 0; y !== o; y++) {
            const S = a[A + y + o],
                w = a[A + y + l] * h,
                C = a[p + y + o],
                M = a[p + y] * h;
            r[y] = x * S + v * w + m * C + g * M
        }
        return r
    }
}
const gU = new Vi;
class vU extends rE {
    interpolate_(e, t, s, n)
    {
        const r = super.interpolate_(e, t, s, n);
        return gU.fromArray(r).normalize().toArray(r), r
    }
}
const ys = {
        FLOAT: 5126,
        FLOAT_MAT3: 35675,
        FLOAT_MAT4: 35676,
        FLOAT_VEC2: 35664,
        FLOAT_VEC3: 35665,
        FLOAT_VEC4: 35666,
        LINEAR: 9729,
        REPEAT: 10497,
        SAMPLER_2D: 35678,
        POINTS: 0,
        LINES: 1,
        LINE_LOOP: 2,
        LINE_STRIP: 3,
        TRIANGLES: 4,
        TRIANGLE_STRIP: 5,
        TRIANGLE_FAN: 6,
        UNSIGNED_BYTE: 5121,
        UNSIGNED_SHORT: 5123
    },
    Io = {
        5120: Int8Array,
        5121: Uint8Array,
        5122: Int16Array,
        5123: Uint16Array,
        5125: Uint32Array,
        5126: Float32Array
    },
    Tx = {
        9728: gt,
        9729: _t,
        9984: gy,
        9985: Xh,
        9986: bl,
        9987: Qs
    },
    Ix = {
        33071: zs,
        33648: Do,
        10497: Ar
    },
    sp = {
        SCALAR: 1,
        VEC2: 2,
        VEC3: 3,
        VEC4: 4,
        MAT2: 4,
        MAT3: 9,
        MAT4: 16
    },
    Om = {
        POSITION: "position",
        NORMAL: "normal",
        TANGENT: "tangent",
        TEXCOORD_0: "uv",
        TEXCOORD_1: "uv1",
        TEXCOORD_2: "uv2",
        TEXCOORD_3: "uv3",
        COLOR_0: "color",
        WEIGHTS_0: "skinWeight",
        JOINTS_0: "skinIndex"
    },
    Jn = {
        scale: "scale",
        translation: "position",
        rotation: "quaternion",
        weights: "morphTargetInfluences"
    },
    xU = {
        CUBICSPLINE: void 0,
        LINEAR: Ro,
        STEP: mc
    },
    np = {
        OPAQUE: "OPAQUE",
        MASK: "MASK",
        BLEND: "BLEND"
    };
function yU(i) {
    return i.DefaultMaterial === void 0 && (i.DefaultMaterial = new HA({
        color: 16777215,
        emissive: 0,
        metalness: 1,
        roughness: 1,
        transparent: !1,
        depthTest: !0,
        side: es
    })), i.DefaultMaterial
}
function Hr(i, e, t) {
    for (const s in t.extensions)
        i[s] === void 0 && (e.userData.gltfExtensions = e.userData.gltfExtensions || {}, e.userData.gltfExtensions[s] = t.extensions[s])
}
function Cn(i, e) {
    e.extras !== void 0 && (typeof e.extras == "object" ? Object.assign(i.userData, e.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras))
}
function _U(i, e, t) {
    let s = !1,
        n = !1,
        r = !1;
    for (let c = 0, h = e.length; c < h; c++) {
        const d = e[c];
        if (d.POSITION !== void 0 && (s = !0), d.NORMAL !== void 0 && (n = !0), d.COLOR_0 !== void 0 && (r = !0), s && n && r)
            break
    }
    if (!s && !n && !r)
        return Promise.resolve(i);
    const a = [],
        o = [],
        l = [];
    for (let c = 0, h = e.length; c < h; c++) {
        const d = e[c];
        if (s) {
            const u = d.POSITION !== void 0 ? t.getDependency("accessor", d.POSITION) : i.attributes.position;
            a.push(u)
        }
        if (n) {
            const u = d.NORMAL !== void 0 ? t.getDependency("accessor", d.NORMAL) : i.attributes.normal;
            o.push(u)
        }
        if (r) {
            const u = d.COLOR_0 !== void 0 ? t.getDependency("accessor", d.COLOR_0) : i.attributes.color;
            l.push(u)
        }
    }
    return Promise.all([Promise.all(a), Promise.all(o), Promise.all(l)]).then(function(c) {
        const h = c[0],
            d = c[1],
            u = c[2];
        return s && (i.morphAttributes.position = h), n && (i.morphAttributes.normal = d), r && (i.morphAttributes.color = u), i.morphTargetsRelative = !0, i
    })
}
function wU(i, e) {
    if (i.updateMorphTargets(), e.weights !== void 0)
        for (let t = 0, s = e.weights.length; t < s; t++)
            i.morphTargetInfluences[t] = e.weights[t];
    if (e.extras && Array.isArray(e.extras.targetNames)) {
        const t = e.extras.targetNames;
        if (i.morphTargetInfluences.length === t.length) {
            i.morphTargetDictionary = {};
            for (let s = 0, n = t.length; s < n; s++)
                i.morphTargetDictionary[t[s]] = s
        } else
            console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")
    }
}
function EU(i) {
    let e;
    const t = i.extensions && i.extensions[ut.KHR_DRACO_MESH_COMPRESSION];
    if (t ? e = "draco:" + t.bufferView + ":" + t.indices + ":" + rp(t.attributes) : e = i.indices + ":" + rp(i.attributes) + ":" + i.mode, i.targets !== void 0)
        for (let s = 0, n = i.targets.length; s < n; s++)
            e += ":" + rp(i.targets[s]);
    return e
}
function rp(i) {
    let e = "";
    const t = Object.keys(i).sort();
    for (let s = 0, n = t.length; s < n; s++)
        e += t[s] + ":" + i[t[s]] + ";";
    return e
}
function km(i) {
    switch (i) {
    case Int8Array:
        return 1 / 127;
    case Uint8Array:
        return 1 / 255;
    case Int16Array:
        return 1 / 32767;
    case Uint16Array:
        return 1 / 65535;
    default:
        throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")
    }
}
function CU(i) {
    return i.search(/\.jpe?g($|\?)/i) > 0 || i.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : i.search(/\.webp($|\?)/i) > 0 || i.search(/^data\:image\/webp/) === 0 ? "image/webp" : "image/png"
}
const SU = new De;
class MU {
    constructor(e={}, t={})
    {
        this.json = e,
        this.extensions = {},
        this.plugins = {},
        this.options = t,
        this.cache = new XR,
        this.associations = new Map,
        this.primitiveCache = {},
        this.nodeCache = {},
        this.meshCache = {
            refs: {},
            uses: {}
        },
        this.cameraCache = {
            refs: {},
            uses: {}
        },
        this.lightCache = {
            refs: {},
            uses: {}
        },
        this.sourceCache = {},
        this.textureCache = {},
        this.nodeNamesUsed = {};
        let s = !1,
            n = !1,
            r = -1;
        typeof navigator < "u" && (s = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) === !0, n = navigator.userAgent.indexOf("Firefox") > -1, r = n ? navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1] : -1),
        typeof createImageBitmap > "u" || s || n && r < 98 ? this.textureLoader = new jy(this.options.manager) : this.textureLoader = new qI(this.options.manager),
        this.textureLoader.setCrossOrigin(this.options.crossOrigin),
        this.textureLoader.setRequestHeader(this.options.requestHeader),
        this.fileLoader = new Ts(this.options.manager),
        this.fileLoader.setResponseType("arraybuffer"),
        this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0)
    }
    setExtensions(e)
    {
        this.extensions = e
    }
    setPlugins(e)
    {
        this.plugins = e
    }
    parse(e, t)
    {
        const s = this,
            n = this.json,
            r = this.extensions;
        this.cache.removeAll(),
        this.nodeCache = {},
        this._invokeAll(function(a) {
            return a._markDefs && a._markDefs()
        }),
        Promise.all(this._invokeAll(function(a) {
            return a.beforeRoot && a.beforeRoot()
        })).then(function() {
            return Promise.all([s.getDependencies("scene"), s.getDependencies("animation"), s.getDependencies("camera")])
        }).then(function(a) {
            const o = {
                scene: a[0][n.scene || 0],
                scenes: a[0],
                animations: a[1],
                cameras: a[2],
                asset: n.asset,
                parser: s,
                userData: {}
            };
            return Hr(r, o, n), Cn(o, n), Promise.all(s._invokeAll(function(l) {
                return l.afterRoot && l.afterRoot(o)
            })).then(function() {
                for (const l of o.scenes)
                    l.updateMatrixWorld();
                e(o)
            })
        }).catch(t)
    }
    _markDefs()
    {
        const e = this.json.nodes || [],
            t = this.json.skins || [],
            s = this.json.meshes || [];
        for (let n = 0, r = t.length; n < r; n++) {
            const a = t[n].joints;
            for (let o = 0, l = a.length; o < l; o++)
                e[a[o]].isBone = !0
        }
        for (let n = 0, r = e.length; n < r; n++) {
            const a = e[n];
            a.mesh !== void 0 && (this._addNodeRef(this.meshCache, a.mesh), a.skin !== void 0 && (s[a.mesh].isSkinnedMesh = !0)),
            a.camera !== void 0 && this._addNodeRef(this.cameraCache, a.camera)
        }
    }
    _addNodeRef(e, t)
    {
        t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++)
    }
    _getNodeRef(e, t, s)
    {
        if (e.refs[t] <= 1)
            return s;
        const n = s.clone(),
            r = (a, o) => {
                const l = this.associations.get(a);
                l != null && this.associations.set(o, l);
                for (const [c, h] of a.children.entries())
                    r(h, o.children[c])
            };
        return r(s, n), n.name += "_instance_" + e.uses[t]++, n
    }
    _invokeOne(e)
    {
        const t = Object.values(this.plugins);
        t.push(this);
        for (let s = 0; s < t.length; s++) {
            const n = e(t[s]);
            if (n)
                return n
        }
        return null
    }
    _invokeAll(e)
    {
        const t = Object.values(this.plugins);
        t.unshift(this);
        const s = [];
        for (let n = 0; n < t.length; n++) {
            const r = e(t[n]);
            r && s.push(r)
        }
        return s
    }
    getDependency(e, t)
    {
        const s = e + ":" + t;
        let n = this.cache.get(s);
        if (!n) {
            switch (e) {
            case "scene":
                n = this.loadScene(t);
                break;
            case "node":
                n = this._invokeOne(function(r) {
                    return r.loadNode && r.loadNode(t)
                });
                break;
            case "mesh":
                n = this._invokeOne(function(r) {
                    return r.loadMesh && r.loadMesh(t)
                });
                break;
            case "accessor":
                n = this.loadAccessor(t);
                break;
            case "bufferView":
                n = this._invokeOne(function(r) {
                    return r.loadBufferView && r.loadBufferView(t)
                });
                break;
            case "buffer":
                n = this.loadBuffer(t);
                break;
            case "material":
                n = this._invokeOne(function(r) {
                    return r.loadMaterial && r.loadMaterial(t)
                });
                break;
            case "texture":
                n = this._invokeOne(function(r) {
                    return r.loadTexture && r.loadTexture(t)
                });
                break;
            case "skin":
                n = this.loadSkin(t);
                break;
            case "animation":
                n = this._invokeOne(function(r) {
                    return r.loadAnimation && r.loadAnimation(t)
                });
                break;
            case "camera":
                n = this.loadCamera(t);
                break;
            default:
                if (n = this._invokeOne(function(r) {
                    return r != this && r.getDependency && r.getDependency(e, t)
                }), !n)
                    throw new Error("Unknown type: " + e);
                break
            }
            this.cache.add(s, n)
        }
        return n
    }
    getDependencies(e)
    {
        let t = this.cache.get(e);
        if (!t) {
            const s = this,
                n = this.json[e + (e === "mesh" ? "es" : "s")] || [];
            t = Promise.all(n.map(function(r, a) {
                return s.getDependency(e, a)
            })),
            this.cache.add(e, t)
        }
        return t
    }
    loadBuffer(e)
    {
        const t = this.json.buffers[e],
            s = this.fileLoader;
        if (t.type && t.type !== "arraybuffer")
            throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
        if (t.uri === void 0 && e === 0)
            return Promise.resolve(this.extensions[ut.KHR_BINARY_GLTF].body);
        const n = this.options;
        return new Promise(function(r, a) {
            s.load(Wl.resolveURL(t.uri, n.path), r, void 0, function() {
                a(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'))
            })
        })
    }
    loadBufferView(e)
    {
        const t = this.json.bufferViews[e];
        return this.getDependency("buffer", t.buffer).then(function(s) {
            const n = t.byteLength || 0,
                r = t.byteOffset || 0;
            return s.slice(r, r + n)
        })
    }
    loadAccessor(e)
    {
        const t = this,
            s = this.json,
            n = this.json.accessors[e];
        if (n.bufferView === void 0 && n.sparse === void 0) {
            const a = sp[n.type],
                o = Io[n.componentType],
                l = n.normalized === !0,
                c = new o(n.count * a);
            return Promise.resolve(new We(c, a, l))
        }
        const r = [];
        return n.bufferView !== void 0 ? r.push(this.getDependency("bufferView", n.bufferView)) : r.push(null), n.sparse !== void 0 && (r.push(this.getDependency("bufferView", n.sparse.indices.bufferView)), r.push(this.getDependency("bufferView", n.sparse.values.bufferView))), Promise.all(r).then(function(a) {
            const o = a[0],
                l = sp[n.type],
                c = Io[n.componentType],
                h = c.BYTES_PER_ELEMENT,
                d = h * l,
                u = n.byteOffset || 0,
                f = n.bufferView !== void 0 ? s.bufferViews[n.bufferView].byteStride : void 0,
                p = n.normalized === !0;
            let A,
                m;
            if (f && f !== d) {
                const g = Math.floor(u / f),
                    x = "InterleavedBuffer:" + n.bufferView + ":" + n.componentType + ":" + g + ":" + n.count;
                let v = t.cache.get(x);
                v || (A = new c(o, g * f, n.count * f / h), v = new Qy(A, f / h), t.cache.add(x, v)),
                m = new gc(v, l, u % f / h, p)
            } else
                o === null ? A = new c(n.count * l) : A = new c(o, u, n.count * l),
                m = new We(A, l, p);
            if (n.sparse !== void 0) {
                const g = sp.SCALAR,
                    x = Io[n.sparse.indices.componentType],
                    v = n.sparse.indices.byteOffset || 0,
                    y = n.sparse.values.byteOffset || 0,
                    S = new x(a[1], v, n.sparse.count * g),
                    w = new c(a[2], y, n.sparse.count * l);
                o !== null && (m = new We(m.array.slice(), m.itemSize, m.normalized));
                for (let C = 0, M = S.length; C < M; C++) {
                    const E = S[C];
                    if (m.setX(E, w[C * l]), l >= 2 && m.setY(E, w[C * l + 1]), l >= 3 && m.setZ(E, w[C * l + 2]), l >= 4 && m.setW(E, w[C * l + 3]), l >= 5)
                        throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")
                }
            }
            return m
        })
    }
    loadTexture(e)
    {
        const t = this.json,
            s = this.options,
            n = t.textures[e].source,
            r = t.images[n];
        let a = this.textureLoader;
        if (r.uri) {
            const o = s.manager.getHandler(r.uri);
            o !== null && (a = o)
        }
        return this.loadTextureImage(e, n, a)
    }
    loadTextureImage(e, t, s)
    {
        const n = this,
            r = this.json,
            a = r.textures[e],
            o = r.images[t],
            l = (o.uri || o.bufferView) + ":" + a.sampler;
        if (this.textureCache[l])
            return this.textureCache[l];
        const c = this.loadImageSource(t, s).then(function(h) {
            h.flipY = !1,
            h.name = a.name || o.name || "",
            h.name === "" && typeof o.uri == "string" && o.uri.startsWith("data:image/") === !1 && (h.name = o.uri);
            const d = (r.samplers || {})[a.sampler] || {};
            return h.magFilter = Tx[d.magFilter] || _t, h.minFilter = Tx[d.minFilter] || Qs, h.wrapS = Ix[d.wrapS] || Ar, h.wrapT = Ix[d.wrapT] || Ar, n.associations.set(h, {
                textures: e
            }), h
        }).catch(function() {
            return null
        });
        return this.textureCache[l] = c, c
    }
    loadImageSource(e, t)
    {
        const s = this,
            n = this.json,
            r = this.options;
        if (this.sourceCache[e] !== void 0)
            return this.sourceCache[e].then(d => d.clone());
        const a = n.images[e],
            o = self.URL || self.webkitURL;
        let l = a.uri || "",
            c = !1;
        if (a.bufferView !== void 0)
            l = s.getDependency("bufferView", a.bufferView).then(function(d) {
                c = !0;
                const u = new Blob([d], {
                    type: a.mimeType
                });
                return l = o.createObjectURL(u), l
            });
        else if (a.uri === void 0)
            throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
        const h = Promise.resolve(l).then(function(d) {
            return new Promise(function(u, f) {
                let p = u;
                t.isImageBitmapLoader === !0 && (p = function(A) {
                    const m = new Rt(A);
                    m.needsUpdate = !0,
                    u(m)
                }),
                t.load(Wl.resolveURL(d, r.path), p, void 0, f)
            })
        }).then(function(d) {
            return c === !0 && o.revokeObjectURL(l), Cn(d, a), d.userData.mimeType = a.mimeType || CU(a.uri), d
        }).catch(function(d) {
            throw console.error("THREE.GLTFLoader: Couldn't load texture", l), d
        });
        return this.sourceCache[e] = h, h
    }
    assignTexture(e, t, s, n)
    {
        const r = this;
        return this.getDependency("texture", s.index).then(function(a) {
            if (!a)
                return null;
            if (s.texCoord !== void 0 && s.texCoord > 0 && (a = a.clone(), a.channel = s.texCoord), r.extensions[ut.KHR_TEXTURE_TRANSFORM]) {
                const o = s.extensions !== void 0 ? s.extensions[ut.KHR_TEXTURE_TRANSFORM] : void 0;
                if (o) {
                    const l = r.associations.get(a);
                    a = r.extensions[ut.KHR_TEXTURE_TRANSFORM].extendTexture(a, o),
                    r.associations.set(a, l)
                }
            }
            return n !== void 0 && (a.colorSpace = n), e[t] = a, a
        })
    }
    assignFinalMaterial(e)
    {
        const t = e.geometry;
        let s = e.material;
        const n = t.attributes.tangent === void 0,
            r = t.attributes.color !== void 0,
            a = t.attributes.normal === void 0;
        if (e.isPoints) {
            const o = "PointsMaterial:" + s.uuid;
            let l = this.cache.get(o);
            l || (l = new Hy, fs.prototype.copy.call(l, s), l.color.copy(s.color), l.map = s.map, l.sizeAttenuation = !1, this.cache.add(o, l)),
            s = l
        } else if (e.isLine) {
            const o = "LineBasicMaterial:" + s.uuid;
            let l = this.cache.get(o);
            l || (l = new ga, fs.prototype.copy.call(l, s), l.color.copy(s.color), l.map = s.map, this.cache.add(o, l)),
            s = l
        }
        if (n || r || a) {
            let o = "ClonedMaterial:" + s.uuid + ":";
            n && (o += "derivative-tangents:"),
            r && (o += "vertex-colors:"),
            a && (o += "flat-shading:");
            let l = this.cache.get(o);
            l || (l = s.clone(), r && (l.vertexColors = !0), a && (l.flatShading = !0), n && (l.normalScale && (l.normalScale.y *= -1), l.clearcoatNormalScale && (l.clearcoatNormalScale.y *= -1)), this.cache.add(o, l), this.associations.set(l, this.associations.get(s))),
            s = l
        }
        e.material = s
    }
    getMaterialType()
    {
        return HA
    }
    loadMaterial(e)
    {
        const t = this,
            s = this.json,
            n = this.extensions,
            r = s.materials[e];
        let a;
        const o = {},
            l = r.extensions || {},
            c = [];
        if (l[ut.KHR_MATERIALS_UNLIT]) {
            const d = n[ut.KHR_MATERIALS_UNLIT];
            a = d.getMaterialType(),
            c.push(d.extendParams(o, r, t))
        } else {
            const d = r.pbrMetallicRoughness || {};
            if (o.color = new Z(1, 1, 1), o.opacity = 1, Array.isArray(d.baseColorFactor)) {
                const u = d.baseColorFactor;
                o.color.setRGB(u[0], u[1], u[2], oi),
                o.opacity = u[3]
            }
            d.baseColorTexture !== void 0 && c.push(t.assignTexture(o, "map", d.baseColorTexture, Ve)),
            o.metalness = d.metallicFactor !== void 0 ? d.metallicFactor : 1,
            o.roughness = d.roughnessFactor !== void 0 ? d.roughnessFactor : 1,
            d.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(o, "metalnessMap", d.metallicRoughnessTexture)), c.push(t.assignTexture(o, "roughnessMap", d.metallicRoughnessTexture))),
            a = this._invokeOne(function(u) {
                return u.getMaterialType && u.getMaterialType(e)
            }),
            c.push(Promise.all(this._invokeAll(function(u) {
                return u.extendMaterialParams && u.extendMaterialParams(e, o)
            })))
        }
        r.doubleSided === !0 && (o.side = xi);
        const h = r.alphaMode || np.OPAQUE;
        if (h === np.BLEND ? (o.transparent = !0, o.depthWrite = !1) : (o.transparent = !1, h === np.MASK && (o.alphaTest = r.alphaCutoff !== void 0 ? r.alphaCutoff : .5)), r.normalTexture !== void 0 && a !== or && (c.push(t.assignTexture(o, "normalMap", r.normalTexture)), o.normalScale = new H(1, 1), r.normalTexture.scale !== void 0)) {
            const d = r.normalTexture.scale;
            o.normalScale.set(d, d)
        }
        if (r.occlusionTexture !== void 0 && a !== or && (c.push(t.assignTexture(o, "aoMap", r.occlusionTexture)), r.occlusionTexture.strength !== void 0 && (o.aoMapIntensity = r.occlusionTexture.strength)), r.emissiveFactor !== void 0 && a !== or) {
            const d = r.emissiveFactor;
            o.emissive = new Z().setRGB(d[0], d[1], d[2], oi)
        }
        return r.emissiveTexture !== void 0 && a !== or && c.push(t.assignTexture(o, "emissiveMap", r.emissiveTexture, Ve)), Promise.all(c).then(function() {
            const d = new a(o);
            return r.name && (d.name = r.name), Cn(d, r), t.associations.set(d, {
                materials: e
            }), r.extensions && Hr(n, d, r), d
        })
    }
    createUniqueName(e)
    {
        const t = Tt.sanitizeNodeName(e || "");
        return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t)
    }
    loadGeometries(e)
    {
        const t = this,
            s = this.extensions,
            n = this.primitiveCache;
        function r(o) {
            return s[ut.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o, t).then(function(l) {
                return Bx(l, o, t)
            })
        }
        const a = [];
        for (let o = 0, l = e.length; o < l; o++) {
            const c = e[o],
                h = EU(c),
                d = n[h];
            if (d)
                a.push(d.promise);
            else {
                let u;
                c.extensions && c.extensions[ut.KHR_DRACO_MESH_COMPRESSION] ? u = r(c) : u = Bx(new ot, c, t),
                n[h] = {
                    primitive: c,
                    promise: u
                },
                a.push(u)
            }
        }
        return Promise.all(a)
    }
    loadMesh(e)
    {
        const t = this,
            s = this.json,
            n = this.extensions,
            r = s.meshes[e],
            a = r.primitives,
            o = [];
        for (let l = 0, c = a.length; l < c; l++) {
            const h = a[l].material === void 0 ? yU(this.cache) : this.getDependency("material", a[l].material);
            o.push(h)
        }
        return o.push(t.loadGeometries(a)), Promise.all(o).then(function(l) {
            const c = l.slice(0, l.length - 1),
                h = l[l.length - 1],
                d = [];
            for (let f = 0, p = h.length; f < p; f++) {
                const A = h[f],
                    m = a[f];
                let g;
                const x = c[f];
                if (m.mode === ys.TRIANGLES || m.mode === ys.TRIANGLE_STRIP || m.mode === ys.TRIANGLE_FAN || m.mode === void 0)
                    g = r.isSkinnedMesh === !0 ? new Gy(A, x) : new Ce(A, x),
                    g.isSkinnedMesh === !0 && g.normalizeSkinWeights(),
                    m.mode === ys.TRIANGLE_STRIP ? g.geometry = Mx(g.geometry, Cy) : m.mode === ys.TRIANGLE_FAN && (g.geometry = Mx(g.geometry, Op));
                else if (m.mode === ys.LINES)
                    g = new yr(A, x);
                else if (m.mode === ys.LINE_STRIP)
                    g = new kA(A, x);
                else if (m.mode === ys.LINE_LOOP)
                    g = new hI(A, x);
                else if (m.mode === ys.POINTS)
                    g = new Fn(A, x);
                else
                    throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + m.mode);
                Object.keys(g.geometry.morphAttributes).length > 0 && wU(g, r),
                g.name = t.createUniqueName(r.name || "mesh_" + e),
                Cn(g, r),
                m.extensions && Hr(n, g, m),
                t.assignFinalMaterial(g),
                d.push(g)
            }
            for (let f = 0, p = d.length; f < p; f++)
                t.associations.set(d[f], {
                    meshes: e,
                    primitives: f
                });
            if (d.length === 1)
                return r.extensions && Hr(n, d[0], r), d[0];
            const u = new Gi;
            r.extensions && Hr(n, u, r),
            t.associations.set(u, {
                meshes: e
            });
            for (let f = 0, p = d.length; f < p; f++)
                u.add(d[f]);
            return u
        })
    }
    loadCamera(e)
    {
        let t;
        const s = this.json.cameras[e],
            n = s[s.type];
        if (!n) {
            console.warn("THREE.GLTFLoader: Missing camera parameters.");
            return
        }
        return s.type === "perspective" ? t = new gi(WC.radToDeg(n.yfov), n.aspectRatio || 1, n.znear || 1, n.zfar || 2e6) : s.type === "orthographic" && (t = new Ln(-n.xmag, n.xmag, n.ymag, -n.ymag, n.znear, n.zfar)), s.name && (t.name = this.createUniqueName(s.name)), Cn(t, s), Promise.resolve(t)
    }
    loadSkin(e)
    {
        const t = this.json.skins[e],
            s = [];
        for (let n = 0, r = t.joints.length; n < r; n++)
            s.push(this._loadNodeShallow(t.joints[n]));
        return t.inverseBindMatrices !== void 0 ? s.push(this.getDependency("accessor", t.inverseBindMatrices)) : s.push(null), Promise.all(s).then(function(n) {
            const r = n.pop(),
                a = n,
                o = [],
                l = [];
            for (let c = 0, h = a.length; c < h; c++) {
                const d = a[c];
                if (d) {
                    o.push(d);
                    const u = new De;
                    r !== null && u.fromArray(r.array, c * 16),
                    l.push(u)
                } else
                    console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[c])
            }
            return new Sd(o, l)
        })
    }
    loadAnimation(e)
    {
        const t = this.json,
            s = this,
            n = t.animations[e],
            r = n.name ? n.name : "animation_" + e,
            a = [],
            o = [],
            l = [],
            c = [],
            h = [];
        for (let d = 0, u = n.channels.length; d < u; d++) {
            const f = n.channels[d],
                p = n.samplers[f.sampler],
                A = f.target,
                m = A.node,
                g = n.parameters !== void 0 ? n.parameters[p.input] : p.input,
                x = n.parameters !== void 0 ? n.parameters[p.output] : p.output;
            A.node !== void 0 && (a.push(this.getDependency("node", m)), o.push(this.getDependency("accessor", g)), l.push(this.getDependency("accessor", x)), c.push(p), h.push(A))
        }
        return Promise.all([Promise.all(a), Promise.all(o), Promise.all(l), Promise.all(c), Promise.all(h)]).then(function(d) {
            const u = d[0],
                f = d[1],
                p = d[2],
                A = d[3],
                m = d[4],
                g = [];
            for (let x = 0, v = u.length; x < v; x++) {
                const y = u[x],
                    S = f[x],
                    w = p[x],
                    C = A[x],
                    M = m[x];
                if (y === void 0)
                    continue;
                y.updateMatrix && y.updateMatrix();
                const E = s._createAnimationTracks(y, S, w, C, M);
                if (E)
                    for (let _ = 0; _ < E.length; _++)
                        g.push(E[_])
            }
            return new Gp(r, void 0, g)
        })
    }
    createNodeMesh(e)
    {
        const t = this.json,
            s = this,
            n = t.nodes[e];
        return n.mesh === void 0 ? null : s.getDependency("mesh", n.mesh).then(function(r) {
            const a = s._getNodeRef(s.meshCache, n.mesh, r);
            return n.weights !== void 0 && a.traverse(function(o) {
                if (o.isMesh)
                    for (let l = 0, c = n.weights.length; l < c; l++)
                        o.morphTargetInfluences[l] = n.weights[l]
            }), a
        })
    }
    loadNode(e)
    {
        const t = this.json,
            s = this,
            n = t.nodes[e],
            r = s._loadNodeShallow(e),
            a = [],
            o = n.children || [];
        for (let c = 0, h = o.length; c < h; c++)
            a.push(s.getDependency("node", o[c]));
        const l = n.skin === void 0 ? Promise.resolve(null) : s.getDependency("skin", n.skin);
        return Promise.all([r, Promise.all(a), l]).then(function(c) {
            const h = c[0],
                d = c[1],
                u = c[2];
            u !== null && h.traverse(function(f) {
                f.isSkinnedMesh && f.bind(u, SU)
            });
            for (let f = 0, p = d.length; f < p; f++)
                h.add(d[f]);
            return h
        })
    }
    _loadNodeShallow(e)
    {
        const t = this.json,
            s = this.extensions,
            n = this;
        if (this.nodeCache[e] !== void 0)
            return this.nodeCache[e];
        const r = t.nodes[e],
            a = r.name ? n.createUniqueName(r.name) : "",
            o = [],
            l = n._invokeOne(function(c) {
                return c.createNodeMesh && c.createNodeMesh(e)
            });
        return l && o.push(l), r.camera !== void 0 && o.push(n.getDependency("camera", r.camera).then(function(c) {
            return n._getNodeRef(n.cameraCache, r.camera, c)
        })), n._invokeAll(function(c) {
            return c.createNodeAttachment && c.createNodeAttachment(e)
        }).forEach(function(c) {
            o.push(c)
        }), this.nodeCache[e] = Promise.all(o).then(function(c) {
            let h;
            if (r.isBone === !0 ? h = new NA : c.length > 1 ? h = new Gi : c.length === 1 ? h = c[0] : h = new It, h !== c[0])
                for (let d = 0, u = c.length; d < u; d++)
                    h.add(c[d]);
            if (r.name && (h.userData.name = r.name, h.name = a), Cn(h, r), r.extensions && Hr(s, h, r), r.matrix !== void 0) {
                const d = new De;
                d.fromArray(r.matrix),
                h.applyMatrix4(d)
            } else
                r.translation !== void 0 && h.position.fromArray(r.translation),
                r.rotation !== void 0 && h.quaternion.fromArray(r.rotation),
                r.scale !== void 0 && h.scale.fromArray(r.scale);
            return n.associations.has(h) || n.associations.set(h, {}), n.associations.get(h).nodes = e, h
        }), this.nodeCache[e]
    }
    loadScene(e)
    {
        const t = this.extensions,
            s = this.json.scenes[e],
            n = this,
            r = new Gi;
        s.name && (r.name = n.createUniqueName(s.name)),
        Cn(r, s),
        s.extensions && Hr(t, r, s);
        const a = s.nodes || [],
            o = [];
        for (let l = 0, c = a.length; l < c; l++)
            o.push(n.getDependency("node", a[l]));
        return Promise.all(o).then(function(l) {
            for (let h = 0, d = l.length; h < d; h++)
                r.add(l[h]);
            const c = h => {
                const d = new Map;
                for (const [u, f] of n.associations)
                    (u instanceof fs || u instanceof Rt) && d.set(u, f);
                return h.traverse(u => {
                    const f = n.associations.get(u);
                    f != null && d.set(u, f)
                }), d
            };
            return n.associations = c(r), r
        })
    }
    _createAnimationTracks(e, t, s, n, r)
    {
        const a = [],
            o = e.name ? e.name : e.uuid,
            l = [];
        Jn[r.path] === Jn.weights ? e.traverse(function(u) {
            u.morphTargetInfluences && l.push(u.name ? u.name : u.uuid)
        }) : l.push(o);
        let c;
        switch (Jn[r.path]) {
        case Jn.weights:
            c = Oo;
            break;
        case Jn.rotation:
            c = da;
            break;
        case Jn.position:
        case Jn.scale:
            c = fa;
            break;
        default:
            switch (s.itemSize) {
            case 1:
                c = Oo;
                break;
            case 2:
            case 3:
            default:
                c = fa;
                break
            }
            break
        }
        const h = n.interpolation !== void 0 ? xU[n.interpolation] : Ro,
            d = this._getArrayFromAccessor(s);
        for (let u = 0, f = l.length; u < f; u++) {
            const p = new c(l[u] + "." + Jn[r.path], t.array, d, h);
            n.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(p),
            a.push(p)
        }
        return a
    }
    _getArrayFromAccessor(e)
    {
        let t = e.array;
        if (e.normalized) {
            const s = km(t.constructor),
                n = new Float32Array(t.length);
            for (let r = 0, a = t.length; r < a; r++)
                n[r] = t[r] * s;
            t = n
        }
        return t
    }
    _createCubicSplineTrackInterpolant(e)
    {
        e.createInterpolant = function(t) {
            const s = this instanceof da ? vU : rE;
            return new s(this.times, this.values, this.getValueSize() / 3, t)
        },
        e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0
    }
}
function bU(i, e, t) {
    const s = e.attributes,
        n = new Vt;
    if (s.POSITION !== void 0) {
        const o = t.json.accessors[s.POSITION],
            l = o.min,
            c = o.max;
        if (l !== void 0 && c !== void 0) {
            if (n.set(new b(l[0], l[1], l[2]), new b(c[0], c[1], c[2])), o.normalized) {
                const h = km(Io[o.componentType]);
                n.min.multiplyScalar(h),
                n.max.multiplyScalar(h)
            }
        } else {
            console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
            return
        }
    } else
        return;
    const r = e.targets;
    if (r !== void 0) {
        const o = new b,
            l = new b;
        for (let c = 0, h = r.length; c < h; c++) {
            const d = r[c];
            if (d.POSITION !== void 0) {
                const u = t.json.accessors[d.POSITION],
                    f = u.min,
                    p = u.max;
                if (f !== void 0 && p !== void 0) {
                    if (l.setX(Math.max(Math.abs(f[0]), Math.abs(p[0]))), l.setY(Math.max(Math.abs(f[1]), Math.abs(p[1]))), l.setZ(Math.max(Math.abs(f[2]), Math.abs(p[2]))), u.normalized) {
                        const A = km(Io[u.componentType]);
                        l.multiplyScalar(A)
                    }
                    o.max(l)
                } else
                    console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")
            }
        }
        n.expandByVector(o)
    }
    i.boundingBox = n;
    const a = new bi;
    n.getCenter(a.center),
    a.radius = n.min.distanceTo(n.max) / 2,
    i.boundingSphere = a
}
function Bx(i, e, t) {
    const s = e.attributes,
        n = [];
    function r(a, o) {
        return t.getDependency("accessor", a).then(function(l) {
            i.setAttribute(o, l)
        })
    }
    for (const a in s) {
        const o = Om[a] || a.toLowerCase();
        o in i.attributes || n.push(r(s[a], o))
    }
    if (e.indices !== void 0 && !i.index) {
        const a = t.getDependency("accessor", e.indices).then(function(o) {
            i.setIndex(o)
        });
        n.push(a)
    }
    return mt.workingColorSpace !== oi && "COLOR_0" in s && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${mt.workingColorSpace}" not supported.`), Cn(i, e), bU(i, e, t), Promise.all(n).then(function() {
        return e.targets !== void 0 ? _U(i, e.targets, t) : i
    })
}
const xg = new WR().setWorkerLimit(1),
    yg = new Gs().setWorkerLimit(1),
    _g = new qR;
_g.setDRACOLoader(xg);
_g.setKTX2Loader(yg);
function TU() {
    xg.setDecoderPath(`${q.absolutePath}/assets/libs/draco/`),
    yg.setTranscoderPath(`${q.absolutePath}/assets/libs/basis/`),
    _g.setPath(`${q.absolutePath}/assets/gltf/`)
}
function IU() {
    xg.dispose(),
    yg.dispose()
}
