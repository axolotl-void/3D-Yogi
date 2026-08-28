class QA extends ot {
    constructor(e=[], t=[], s=1, n=0)
    {
        super(),
        this.type = "PolyhedronGeometry",
        this.parameters = {
            vertices: e,
            indices: t,
            radius: s,
            detail: n
        };
        const r = [],
            a = [];
        o(n),
        c(s),
        h(),
        this.setAttribute("position", new nt(r, 3)),
        this.setAttribute("normal", new nt(r.slice(), 3)),
        this.setAttribute("uv", new nt(a, 2)),
        n === 0 ? this.computeVertexNormals() : this.normalizeNormals();
        function o(x) {
            const v = new b,
                y = new b,
                S = new b;
            for (let w = 0; w < t.length; w += 3)
                f(t[w + 0], v),
                f(t[w + 1], y),
                f(t[w + 2], S),
                l(v, y, S, x)
        }
        function l(x, v, y, S) {
            const w = S + 1,
                C = [];
            for (let M = 0; M <= w; M++) {
                C[M] = [];
                const E = x.clone().lerp(y, M / w),
                    _ = v.clone().lerp(y, M / w),
                    I = w - M;
                for (let P = 0; P <= I; P++)
                    P === 0 && M === w ? C[M][P] = E : C[M][P] = E.clone().lerp(_, P / I)
            }
            for (let M = 0; M < w; M++)
                for (let E = 0; E < 2 * (w - M) - 1; E++) {
                    const _ = Math.floor(E / 2);
                    E % 2 === 0 ? (u(C[M][_ + 1]), u(C[M + 1][_]), u(C[M][_])) : (u(C[M][_ + 1]), u(C[M + 1][_ + 1]), u(C[M + 1][_]))
                }
        }
        function c(x) {
            const v = new b;
            for (let y = 0; y < r.length; y += 3)
                v.x = r[y + 0],
                v.y = r[y + 1],
                v.z = r[y + 2],
                v.normalize().multiplyScalar(x),
                r[y + 0] = v.x,
                r[y + 1] = v.y,
                r[y + 2] = v.z
        }
        function h() {
            const x = new b;
            for (let v = 0; v < r.length; v += 3) {
                x.x = r[v + 0],
                x.y = r[v + 1],
                x.z = r[v + 2];
                const y = m(x) / 2 / Math.PI + .5,
                    S = g(x) / Math.PI + .5;
                a.push(y, 1 - S)
            }
            p(),
            d()
        }
        function d() {
            for (let x = 0; x < a.length; x += 6) {
                const v = a[x + 0],
                    y = a[x + 2],
                    S = a[x + 4],
                    w = Math.max(v, y, S),
                    C = Math.min(v, y, S);
                w > .9 && C < .1 && (v < .2 && (a[x + 0] += 1), y < .2 && (a[x + 2] += 1), S < .2 && (a[x + 4] += 1))
            }
        }
        function u(x) {
            r.push(x.x, x.y, x.z)
        }
        function f(x, v) {
            const y = x * 3;
            v.x = e[y + 0],
            v.y = e[y + 1],
            v.z = e[y + 2]
        }
        function p() {
            const x = new b,
                v = new b,
                y = new b,
                S = new b,
                w = new H,
                C = new H,
                M = new H;
            for (let E = 0, _ = 0; E < r.length; E += 9, _ += 6) {
                x.set(r[E + 0], r[E + 1], r[E + 2]),
                v.set(r[E + 3], r[E + 4], r[E + 5]),
                y.set(r[E + 6], r[E + 7], r[E + 8]),
                w.set(a[_ + 0], a[_ + 1]),
                C.set(a[_ + 2], a[_ + 3]),
                M.set(a[_ + 4], a[_ + 5]),
                S.copy(x).add(v).add(y).divideScalar(3);
                const I = m(S);
                A(w, _ + 0, x, I),
                A(C, _ + 2, v, I),
                A(M, _ + 4, y, I)
            }
        }
        function A(x, v, y, S) {
            S < 0 && x.x === 1 && (a[v] = x.x - 1),
            y.x === 0 && y.z === 0 && (a[v] = S / 2 / Math.PI + .5)
        }
        function m(x) {
            return Math.atan2(x.z, -x.x)
        }
        function g(x) {
            return Math.atan2(-x.y, Math.sqrt(x.x * x.x + x.z * x.z))
        }
    }
    copy(e)
    {
        return super.copy(e), this.parameters = Object.assign({}, e.parameters), this
    }
    static fromJSON(e)
    {
        return new QA(e.vertices, e.indices, e.radius, e.details)
    }
}
class GA extends QA {
    constructor(e=1, t=0)
    {
        const s = (1 + Math.sqrt(5)) / 2,
            n = [-1, s, 0, 1, s, 0, -1, -s, 0, 1, -s, 0, 0, -1, s, 0, 1, s, 0, -1, -s, 0, 1, -s, s, 0, -1, s, 0, 1, -s, 0, -1, -s, 0, 1],
            r = [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1];
        super(n, r, e, t),
        this.type = "IcosahedronGeometry",
        this.parameters = {
            radius: e,
            detail: t
        }
    }
    static fromJSON(e)
    {
        return new GA(e.radius, e.detail)
    }
}
class bd extends ot {
    constructor(e=1, t=32, s=16, n=0, r=Math.PI * 2, a=0, o=Math.PI)
    {
        super(),
        this.type = "SphereGeometry",
        this.parameters = {
            radius: e,
            widthSegments: t,
            heightSegments: s,
            phiStart: n,
            phiLength: r,
            thetaStart: a,
            thetaLength: o
        },
        t = Math.max(3, Math.floor(t)),
        s = Math.max(2, Math.floor(s));
        const l = Math.min(a + o, Math.PI);
        let c = 0;
        const h = [],
            d = new b,
            u = new b,
            f = [],
            p = [],
            A = [],
            m = [];
        for (let g = 0; g <= s; g++) {
            const x = [],
                v = g / s;
            let y = 0;
            g === 0 && a === 0 ? y = .5 / t : g === s && l === Math.PI && (y = -.5 / t);
            for (let S = 0; S <= t; S++) {
                const w = S / t;
                d.x = -e * Math.cos(n + w * r) * Math.sin(a + v * o),
                d.y = e * Math.cos(a + v * o),
                d.z = e * Math.sin(n + w * r) * Math.sin(a + v * o),
                p.push(d.x, d.y, d.z),
                u.copy(d).normalize(),
                A.push(u.x, u.y, u.z),
                m.push(w + y, 1 - v),
                x.push(c++)
            }
            h.push(x)
        }
        for (let g = 0; g < s; g++)
            for (let x = 0; x < t; x++) {
                const v = h[g][x + 1],
                    y = h[g][x],
                    S = h[g + 1][x],
                    w = h[g + 1][x + 1];
                (g !== 0 || a > 0) && f.push(v, y, w),
                (g !== s - 1 || l < Math.PI) && f.push(y, S, w)
            }
        this.setIndex(f),
        this.setAttribute("position", new nt(p, 3)),
        this.setAttribute("normal", new nt(A, 3)),
        this.setAttribute("uv", new nt(m, 2))
    }
    copy(e)
    {
        return super.copy(e), this.parameters = Object.assign({}, e.parameters), this
    }
    static fromJSON(e)
    {
        return new bd(e.radius, e.widthSegments, e.heightSegments, e.phiStart, e.phiLength, e.thetaStart, e.thetaLength)
    }
}
class _r extends fe {
    constructor(e)
    {
        super(e),
        this.isRawShaderMaterial = !0,
        this.type = "RawShaderMaterial"
    }
}
class HA extends fs {
    constructor(e)
    {
        super(),
        this.isMeshStandardMaterial = !0,
        this.defines = {
            STANDARD: ""
        },
        this.type = "MeshStandardMaterial",
        this.color = new Z(16777215),
        this.roughness = 1,
        this.metalness = 0,
        this.map = null,
        this.lightMap = null,
        this.lightMapIntensity = 1,
        this.aoMap = null,
        this.aoMapIntensity = 1,
        this.emissive = new Z(0),
        this.emissiveIntensity = 1,
        this.emissiveMap = null,
        this.bumpMap = null,
        this.bumpScale = 1,
        this.normalMap = null,
        this.normalMapType = IA,
        this.normalScale = new H(1, 1),
        this.displacementMap = null,
        this.displacementScale = 1,
        this.displacementBias = 0,
        this.roughnessMap = null,
        this.metalnessMap = null,
        this.alphaMap = null,
        this.envMap = null,
        this.envMapRotation = new ln,
        this.envMapIntensity = 1,
        this.wireframe = !1,
        this.wireframeLinewidth = 1,
        this.wireframeLinecap = "round",
        this.wireframeLinejoin = "round",
        this.flatShading = !1,
        this.fog = !0,
        this.setValues(e)
    }
    copy(e)
    {
        return super.copy(e), this.defines = {
            STANDARD: ""
        }, this.color.copy(e.color), this.roughness = e.roughness, this.metalness = e.metalness, this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.roughnessMap = e.roughnessMap, this.metalnessMap = e.metalnessMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.envMapIntensity = e.envMapIntensity, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this
    }
}
class Ys extends HA {
    constructor(e)
    {
        super(),
        this.isMeshPhysicalMaterial = !0,
        this.defines = {
            STANDARD: "",
            PHYSICAL: ""
        },
        this.type = "MeshPhysicalMaterial",
        this.anisotropyRotation = 0,
        this.anisotropyMap = null,
        this.clearcoatMap = null,
        this.clearcoatRoughness = 0,
        this.clearcoatRoughnessMap = null,
        this.clearcoatNormalScale = new H(1, 1),
        this.clearcoatNormalMap = null,
        this.ior = 1.5,
        Object.defineProperty(this, "reflectivity", {
            get: function() {
                return hi(2.5 * (this.ior - 1) / (this.ior + 1), 0, 1)
            },
            set: function(t) {
                this.ior = (1 + .4 * t) / (1 - .4 * t)
            }
        }),
        this.iridescenceMap = null,
        this.iridescenceIOR = 1.3,
        this.iridescenceThicknessRange = [100, 400],
        this.iridescenceThicknessMap = null,
        this.sheenColor = new Z(0),
        this.sheenColorMap = null,
        this.sheenRoughness = 1,
        this.sheenRoughnessMap = null,
        this.transmissionMap = null,
        this.thickness = 0,
        this.thicknessMap = null,
        this.attenuationDistance = 1 / 0,
        this.attenuationColor = new Z(1, 1, 1),
        this.specularIntensity = 1,
        this.specularIntensityMap = null,
        this.specularColor = new Z(1, 1, 1),
        this.specularColorMap = null,
        this._anisotropy = 0,
        this._clearcoat = 0,
        this._dispersion = 0,
        this._iridescence = 0,
        this._sheen = 0,
        this._transmission = 0,
        this.setValues(e)
    }
    get anisotropy()
    {
        return this._anisotropy
    }
    set anisotropy(e)
    {
        this._anisotropy > 0 != e > 0 && this.version++,
        this._anisotropy = e
    }
    get clearcoat()
    {
        return this._clearcoat
    }
    set clearcoat(e)
    {
        this._clearcoat > 0 != e > 0 && this.version++,
        this._clearcoat = e
    }
    get iridescence()
    {
        return this._iridescence
    }
    set iridescence(e)
    {
        this._iridescence > 0 != e > 0 && this.version++,
        this._iridescence = e
    }
    get dispersion()
    {
        return this._dispersion
    }
    set dispersion(e)
    {
        this._dispersion > 0 != e > 0 && this.version++,
        this._dispersion = e
    }
    get sheen()
    {
        return this._sheen
    }
    set sheen(e)
    {
        this._sheen > 0 != e > 0 && this.version++,
        this._sheen = e
    }
    get transmission()
    {
        return this._transmission
    }
    set transmission(e)
    {
        this._transmission > 0 != e > 0 && this.version++,
        this._transmission = e
    }
    copy(e)
    {
        return super.copy(e), this.defines = {
            STANDARD: "",
            PHYSICAL: ""
        }, this.anisotropy = e.anisotropy, this.anisotropyRotation = e.anisotropyRotation, this.anisotropyMap = e.anisotropyMap, this.clearcoat = e.clearcoat, this.clearcoatMap = e.clearcoatMap, this.clearcoatRoughness = e.clearcoatRoughness, this.clearcoatRoughnessMap = e.clearcoatRoughnessMap, this.clearcoatNormalMap = e.clearcoatNormalMap, this.clearcoatNormalScale.copy(e.clearcoatNormalScale), this.dispersion = e.dispersion, this.ior = e.ior, this.iridescence = e.iridescence, this.iridescenceMap = e.iridescenceMap, this.iridescenceIOR = e.iridescenceIOR, this.iridescenceThicknessRange = [...e.iridescenceThicknessRange], this.iridescenceThicknessMap = e.iridescenceThicknessMap, this.sheen = e.sheen, this.sheenColor.copy(e.sheenColor), this.sheenColorMap = e.sheenColorMap, this.sheenRoughness = e.sheenRoughness, this.sheenRoughnessMap = e.sheenRoughnessMap, this.transmission = e.transmission, this.transmissionMap = e.transmissionMap, this.thickness = e.thickness, this.thicknessMap = e.thicknessMap, this.attenuationDistance = e.attenuationDistance, this.attenuationColor.copy(e.attenuationColor), this.specularIntensity = e.specularIntensity, this.specularIntensityMap = e.specularIntensityMap, this.specularColor.copy(e.specularColor), this.specularColorMap = e.specularColorMap, this
    }
}
class qy extends fs {
    constructor(e)
    {
        super(),
        this.isMeshNormalMaterial = !0,
        this.type = "MeshNormalMaterial",
        this.bumpMap = null,
        this.bumpScale = 1,
        this.normalMap = null,
        this.normalMapType = IA,
        this.normalScale = new H(1, 1),
        this.displacementMap = null,
        this.displacementScale = 1,
        this.displacementBias = 0,
        this.wireframe = !1,
        this.wireframeLinewidth = 1,
        this.flatShading = !1,
        this.setValues(e)
    }
    copy(e)
    {
        return super.copy(e), this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.flatShading = e.flatShading, this
    }
}
function Ah(i, e, t) {
    return !i || !t && i.constructor === e ? i : typeof e.BYTES_PER_ELEMENT == "number" ? new e(i) : Array.prototype.slice.call(i)
}
function II(i) {
    return ArrayBuffer.isView(i) && !(i instanceof DataView)
}
function BI(i) {
    function e(n, r) {
        return i[n] - i[r]
    }
    const t = i.length,
        s = new Array(t);
    for (let n = 0; n !== t; ++n)
        s[n] = n;
    return s.sort(e), s
}
function A0(i, e, t) {
    const s = i.length,
        n = new i.constructor(s);
    for (let r = 0, a = 0; a !== s; ++r) {
        const o = t[r] * e;
        for (let l = 0; l !== e; ++l)
            n[a++] = i[o + l]
    }
    return n
}
function Xy(i, e, t, s) {
    let n = 1,
        r = i[0];
    for (; r !== void 0 && r[s] === void 0;)
        r = i[n++];
    if (r === void 0)
        return;
    let a = r[s];
    if (a !== void 0)
        if (Array.isArray(a))
            do a = r[s],
            a !== void 0 && (e.push(r.time), t.push.apply(t, a)),
            r = i[n++];
            while (r !== void 0);
        else if (a.toArray !== void 0)
            do a = r[s],
            a !== void 0 && (e.push(r.time), a.toArray(t, t.length)),
            r = i[n++];
            while (r !== void 0);
        else
            do a = r[s],
            a !== void 0 && (e.push(r.time), t.push(a)),
            r = i[n++];
            while (r !== void 0)
}
class Tc {
    constructor(e, t, s, n)
    {
        this.parameterPositions = e,
        this._cachedIndex = 0,
        this.resultBuffer = n !== void 0 ? n : new t.constructor(s),
        this.sampleValues = t,
        this.valueSize = s,
        this.settings = null,
        this.DefaultSettings_ = {}
    }
    evaluate(e)
    {
        const t = this.parameterPositions;
        let s = this._cachedIndex,
            n = t[s],
            r = t[s - 1];
        i:
        {
            e:
            {
                let a;
                t:
                {
                    s:
                    if (!(e < n)) {
                        for (let o = s + 2; ;) {
                            if (n === void 0) {
                                if (e < r)
                                    break s;
                                return s = t.length, this._cachedIndex = s, this.copySampleValue_(s - 1)
                            }
                            if (s === o)
                                break;
                            if (r = n, n = t[++s], e < n)
                                break e
                        }
                        a = t.length;
                        break t
                    }
                    if (!(e >= r)) {
                        const o = t[1];
                        e < o && (s = 2, r = o);
                        for (let l = s - 2; ;) {
                            if (r === void 0)
                                return this._cachedIndex = 0, this.copySampleValue_(0);
                            if (s === l)
                                break;
                            if (n = r, r = t[--s - 1], e >= r)
                                break e
                        }
                        a = s,
                        s = 0;
                        break t
                    }
                    break i
                }for (; s < a;) {
                    const o = s + a >>> 1;
                    e < t[o] ? a = o : s = o + 1
                }
                if (n = t[s], r = t[s - 1], r === void 0)
                    return this._cachedIndex = 0, this.copySampleValue_(0);
                if (n === void 0)
                    return s = t.length, this._cachedIndex = s, this.copySampleValue_(s - 1)
            }this._cachedIndex = s,
            this.intervalChanged_(s, r, n)
        }return this.interpolate_(s, r, e, n)
    }
    getSettings_()
    {
        return this.settings || this.DefaultSettings_
    }
    copySampleValue_(e)
    {
        const t = this.resultBuffer,
            s = this.sampleValues,
            n = this.valueSize,
            r = e * n;
        for (let a = 0; a !== n; ++a)
            t[a] = s[r + a];
        return t
    }
    interpolate_()
    {
        throw new Error("call to abstract method")
    }
    intervalChanged_() {}
}
class PI extends Tc {
    constructor(e, t, s, n)
    {
        super(e, t, s, n),
        this._weightPrev = -0,
        this._offsetPrev = -0,
        this._weightNext = -0,
        this._offsetNext = -0,
        this.DefaultSettings_ = {
            endingStart: rv,
            endingEnd: rv
        }
    }
    intervalChanged_(e, t, s)
    {
        const n = this.parameterPositions;
        let r = e - 2,
            a = e + 1,
            o = n[r],
            l = n[a];
        if (o === void 0)
            switch (this.getSettings_().endingStart) {
            case av:
                r = e,
                o = 2 * t - s;
                break;
            case ov:
                r = n.length - 2,
                o = t + n[r] - n[r + 1];
                break;
            default:
                r = e,
                o = s
            }
        if (l === void 0)
            switch (this.getSettings_().endingEnd) {
            case av:
                a = e,
                l = 2 * s - t;
                break;
            case ov:
                a = 1,
                l = s + n[1] - n[0];
                break;
            default:
                a = e - 1,
                l = t
            }
        const c = (s - t) * .5,
            h = this.valueSize;
        this._weightPrev = c / (t - o),
        this._weightNext = c / (l - s),
        this._offsetPrev = r * h,
        this._offsetNext = a * h
    }
    interpolate_(e, t, s, n)
    {
        const r = this.resultBuffer,
            a = this.sampleValues,
            o = this.valueSize,
            l = e * o,
            c = l - o,
            h = this._offsetPrev,
            d = this._offsetNext,
            u = this._weightPrev,
            f = this._weightNext,
            p = (s - t) / (n - t),
            A = p * p,
            m = A * p,
            g = -u * m + 2 * u * A - u * p,
            x = (1 + u) * m + (-1.5 - 2 * u) * A + (-.5 + u) * p + 1,
            v = (-1 - f) * m + (1.5 + f) * A + .5 * p,
            y = f * m - f * A;
        for (let S = 0; S !== o; ++S)
            r[S] = g * a[h + S] + x * a[c + S] + v * a[l + S] + y * a[d + S];
        return r
    }
}
class DI extends Tc {
    constructor(e, t, s, n)
    {
        super(e, t, s, n)
    }
    interpolate_(e, t, s, n)
    {
        const r = this.resultBuffer,
            a = this.sampleValues,
            o = this.valueSize,
            l = e * o,
            c = l - o,
            h = (s - t) / (n - t),
            d = 1 - h;
        for (let u = 0; u !== o; ++u)
            r[u] = a[c + u] * d + a[l + u] * h;
        return r
    }
}
class RI extends Tc {
    constructor(e, t, s, n)
    {
        super(e, t, s, n)
    }
    interpolate_(e)
    {
        return this.copySampleValue_(e - 1)
    }
}
class dn {
    constructor(e, t, s, n)
    {
        if (e === void 0)
            throw new Error("THREE.KeyframeTrack: track name is undefined");
        if (t === void 0 || t.length === 0)
            throw new Error("THREE.KeyframeTrack: no keyframes in track named " + e);
        this.name = e,
        this.times = Ah(t, this.TimeBufferType),
        this.values = Ah(s, this.ValueBufferType),
        this.setInterpolation(n || this.DefaultInterpolation)
    }
    static toJSON(e)
    {
        const t = e.constructor;
        let s;
        if (t.toJSON !== this.toJSON)
            s = t.toJSON(e);
        else {
            s = {
                name: e.name,
                times: Ah(e.times, Array),
                values: Ah(e.values, Array)
            };
            const n = e.getInterpolation();
            n !== e.DefaultInterpolation && (s.interpolation = n)
        }
        return s.type = e.ValueTypeName, s
    }
    InterpolantFactoryMethodDiscrete(e)
    {
        return new RI(this.times, this.values, this.getValueSize(), e)
    }
    InterpolantFactoryMethodLinear(e)
    {
        return new DI(this.times, this.values, this.getValueSize(), e)
    }
    InterpolantFactoryMethodSmooth(e)
    {
        return new PI(this.times, this.values, this.getValueSize(), e)
    }
    setInterpolation(e)
    {
        let t;
        switch (e) {
        case mc:
            t = this.InterpolantFactoryMethodDiscrete;
            break;
        case Ro:
            t = this.InterpolantFactoryMethodLinear;
            break;
        case Wd:
            t = this.InterpolantFactoryMethodSmooth;
            break
        }
        if (t === void 0) {
            const s = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
            if (this.createInterpolant === void 0)
                if (e !== this.DefaultInterpolation)
                    this.setInterpolation(this.DefaultInterpolation);
                else
                    throw new Error(s);
            return console.warn("THREE.KeyframeTrack:", s), this
        }
        return this.createInterpolant = t, this
    }
    getInterpolation()
    {
        switch (this.createInterpolant) {
        case this.InterpolantFactoryMethodDiscrete:
            return mc;
        case this.InterpolantFactoryMethodLinear:
            return Ro;
        case this.InterpolantFactoryMethodSmooth:
            return Wd
        }
    }
    getValueSize()
    {
        return this.values.length / this.times.length
    }
    shift(e)
    {
        if (e !== 0) {
            const t = this.times;
            for (let s = 0, n = t.length; s !== n; ++s)
                t[s] += e
        }
        return this
    }
    scale(e)
    {
        if (e !== 1) {
            const t = this.times;
            for (let s = 0, n = t.length; s !== n; ++s)
                t[s] *= e
        }
        return this
    }
    trim(e, t)
    {
        const s = this.times,
            n = s.length;
        let r = 0,
            a = n - 1;
        for (; r !== n && s[r] < e;)
            ++r;
        for (; a !== -1 && s[a] > t;)
            --a;
        if (++a, r !== 0 || a !== n) {
            r >= a && (a = Math.max(a, 1), r = a - 1);
            const o = this.getValueSize();
            this.times = s.slice(r, a),
            this.values = this.values.slice(r * o, a * o)
        }
        return this
    }
    validate()
    {
        let e = !0;
        const t = this.getValueSize();
        t - Math.floor(t) !== 0 && (console.error("THREE.KeyframeTrack: Invalid value size in track.", this), e = !1);
        const s = this.times,
            n = this.values,
            r = s.length;
        r === 0 && (console.error("THREE.KeyframeTrack: Track is empty.", this), e = !1);
        let a = null;
        for (let o = 0; o !== r; o++) {
            const l = s[o];
            if (typeof l == "number" && isNaN(l)) {
                console.error("THREE.KeyframeTrack: Time is not a valid number.", this, o, l),
                e = !1;
                break
            }
            if (a !== null && a > l) {
                console.error("THREE.KeyframeTrack: Out of order keys.", this, o, l, a),
                e = !1;
                break
            }
            a = l
        }
        if (n !== void 0 && II(n))
            for (let o = 0, l = n.length; o !== l; ++o) {
                const c = n[o];
                if (isNaN(c)) {
                    console.error("THREE.KeyframeTrack: Value is not a valid number.", this, o, c),
                    e = !1;
                    break
                }
            }
        return e
    }
    optimize()
    {
        const e = this.times.slice(),
            t = this.values.slice(),
            s = this.getValueSize(),
            n = this.getInterpolation() === Wd,
            r = e.length - 1;
        let a = 1;
        for (let o = 1; o < r; ++o) {
            let l = !1;
            const c = e[o],
                h = e[o + 1];
            if (c !== h && (o !== 1 || c !== e[0]))
                if (n)
                    l = !0;
                else {
                    const d = o * s,
                        u = d - s,
                        f = d + s;
                    for (let p = 0; p !== s; ++p) {
                        const A = t[d + p];
                        if (A !== t[u + p] || A !== t[f + p]) {
                            l = !0;
                            break
                        }
                    }
                }
            if (l) {
                if (o !== a) {
                    e[a] = e[o];
                    const d = o * s,
                        u = a * s;
                    for (let f = 0; f !== s; ++f)
                        t[u + f] = t[d + f]
                }
                ++a
            }
        }
        if (r > 0) {
            e[a] = e[r];
            for (let o = r * s, l = a * s, c = 0; c !== s; ++c)
                t[l + c] = t[o + c];
            ++a
        }
        return a !== e.length ? (this.times = e.slice(0, a), this.values = t.slice(0, a * s)) : (this.times = e, this.values = t), this
    }
    clone()
    {
        const e = this.times.slice(),
            t = this.values.slice(),
            s = this.constructor,
            n = new s(this.name, e, t);
        return n.createInterpolant = this.createInterpolant, n
    }
}
dn.prototype.TimeBufferType = Float32Array;
dn.prototype.ValueBufferType = Float32Array;
dn.prototype.DefaultInterpolation = Ro;
class qo extends dn {
    constructor(e, t, s)
    {
        super(e, t, s)
    }
}
qo.prototype.ValueTypeName = "bool";
qo.prototype.ValueBufferType = Array;
qo.prototype.DefaultInterpolation = mc;
qo.prototype.InterpolantFactoryMethodLinear = void 0;
qo.prototype.InterpolantFactoryMethodSmooth = void 0;
class Ky extends dn {}
Ky.prototype.ValueTypeName = "color";
class Oo extends dn {}
Oo.prototype.ValueTypeName = "number";
class UI extends Tc {
    constructor(e, t, s, n)
    {
        super(e, t, s, n)
    }
    interpolate_(e, t, s, n)
    {
        const r = this.resultBuffer,
            a = this.sampleValues,
            o = this.valueSize,
            l = (s - t) / (n - t);
        let c = e * o;
        for (let h = c + o; c !== h; c += 4)
            Vi.slerpFlat(r, 0, a, c - o, a, c, l);
        return r
    }
}
class da extends dn {
    InterpolantFactoryMethodLinear(e)
    {
        return new UI(this.times, this.values, this.getValueSize(), e)
    }
}
da.prototype.ValueTypeName = "quaternion";
da.prototype.InterpolantFactoryMethodSmooth = void 0;
class Xo extends dn {
    constructor(e, t, s)
    {
        super(e, t, s)
    }
}
Xo.prototype.ValueTypeName = "string";
Xo.prototype.ValueBufferType = Array;
Xo.prototype.DefaultInterpolation = mc;
Xo.prototype.InterpolantFactoryMethodLinear = void 0;
Xo.prototype.InterpolantFactoryMethodSmooth = void 0;
class fa extends dn {}
fa.prototype.ValueTypeName = "vector";
class Gp {
    constructor(e="", t=-1, s=[], n=xC)
    {
        this.name = e,
        this.tracks = s,
        this.duration = t,
        this.blendMode = n,
        this.uuid = Hs(),
        this.duration < 0 && this.resetDuration()
    }
    static parse(e)
    {
        const t = [],
            s = e.tracks,
            n = 1 / (e.fps || 1);
        for (let a = 0, o = s.length; a !== o; ++a)
            t.push(FI(s[a]).scale(n));
        const r = new this(e.name, e.duration, t, e.blendMode);
        return r.uuid = e.uuid, r
    }
    static toJSON(e)
    {
        const t = [],
            s = e.tracks,
            n = {
                name: e.name,
                duration: e.duration,
                tracks: t,
                uuid: e.uuid,
                blendMode: e.blendMode
            };
        for (let r = 0, a = s.length; r !== a; ++r)
            t.push(dn.toJSON(s[r]));
        return n
    }
    static CreateFromMorphTargetSequence(e, t, s, n)
    {
        const r = t.length,
            a = [];
        for (let o = 0; o < r; o++) {
            let l = [],
                c = [];
            l.push((o + r - 1) % r, o, (o + 1) % r),
            c.push(0, 1, 0);
            const h = BI(l);
            l = A0(l, 1, h),
            c = A0(c, 1, h),
            !n && l[0] === 0 && (l.push(r), c.push(c[0])),
            a.push(new Oo(".morphTargetInfluences[" + t[o].name + "]", l, c).scale(1 / s))
        }
        return new this(e, -1, a)
    }
    static findByName(e, t)
    {
        let s = e;
        if (!Array.isArray(e)) {
            const n = e;
            s = n.geometry && n.geometry.animations || n.animations
        }
        for (let n = 0; n < s.length; n++)
            if (s[n].name === t)
                return s[n];
        return null
    }
    static CreateClipsFromMorphTargetSequences(e, t, s)
    {
        const n = {},
            r = /^([\w-]*?)([\d]+)$/;
        for (let o = 0, l = e.length; o < l; o++) {
            const c = e[o],
                h = c.name.match(r);
            if (h && h.length > 1) {
                const d = h[1];
                let u = n[d];
                u || (n[d] = u = []),
                u.push(c)
            }
        }
        const a = [];
        for (const o in n)
            a.push(this.CreateFromMorphTargetSequence(o, n[o], t, s));
        return a
    }
    static parseAnimation(e, t)
    {
        if (!e)
            return console.error("THREE.AnimationClip: No animation in JSONLoader data."), null;
        const s = function(d, u, f, p, A) {
                if (f.length !== 0) {
                    const m = [],
                        g = [];
                    Xy(f, m, g, p),
                    m.length !== 0 && A.push(new d(u, m, g))
                }
            },
            n = [],
            r = e.name || "default",
            a = e.fps || 30,
            o = e.blendMode;
        let l = e.length || -1;
        const c = e.hierarchy || [];
        for (let d = 0; d < c.length; d++) {
            const u = c[d].keys;
            if (!(!u || u.length === 0))
                if (u[0].morphTargets) {
                    const f = {};
                    let p;
                    for (p = 0; p < u.length; p++)
                        if (u[p].morphTargets)
                            for (let A = 0; A < u[p].morphTargets.length; A++)
                                f[u[p].morphTargets[A]] = -1;
                    for (const A in f) {
                        const m = [],
                            g = [];
                        for (let x = 0; x !== u[p].morphTargets.length; ++x) {
                            const v = u[p];
                            m.push(v.time),
                            g.push(v.morphTarget === A ? 1 : 0)
                        }
                        n.push(new Oo(".morphTargetInfluence[" + A + "]", m, g))
                    }
                    l = f.length * a
                } else {
                    const f = ".bones[" + t[d].name + "]";
                    s(fa, f + ".position", u, "pos", n),
                    s(da, f + ".quaternion", u, "rot", n),
                    s(fa, f + ".scale", u, "scl", n)
                }
        }
        return n.length === 0 ? null : new this(r, l, n, o)
    }
    resetDuration()
    {
        const e = this.tracks;
        let t = 0;
        for (let s = 0, n = e.length; s !== n; ++s) {
            const r = this.tracks[s];
            t = Math.max(t, r.times[r.times.length - 1])
        }
        return this.duration = t, this
    }
    trim()
    {
        for (let e = 0; e < this.tracks.length; e++)
            this.tracks[e].trim(0, this.duration);
        return this
    }
    validate()
    {
        let e = !0;
        for (let t = 0; t < this.tracks.length; t++)
            e = e && this.tracks[t].validate();
        return e
    }
    optimize()
    {
        for (let e = 0; e < this.tracks.length; e++)
            this.tracks[e].optimize();
        return this
    }
    clone()
    {
        const e = [];
        for (let t = 0; t < this.tracks.length; t++)
            e.push(this.tracks[t].clone());
        return new this.constructor(this.name, this.duration, e, this.blendMode)
    }
    toJSON()
    {
        return this.constructor.toJSON(this)
    }
}
function LI(i) {
    switch (i.toLowerCase()) {
    case "scalar":
    case "double":
    case "float":
    case "number":
    case "integer":
        return Oo;
    case "vector":
    case "vector2":
    case "vector3":
    case "vector4":
        return fa;
    case "color":
        return Ky;
    case "quaternion":
        return da;
    case "bool":
    case "boolean":
        return qo;
    case "string":
        return Xo
    }
    throw new Error("THREE.KeyframeTrack: Unsupported typeName: " + i)
}
function FI(i) {
    if (i.type === void 0)
        throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");
    const e = LI(i.type);
    if (i.times === void 0) {
        const t = [],
            s = [];
        Xy(i.keys, t, s, "value"),
        i.times = t,
        i.values = s
    }
    return e.parse !== void 0 ? e.parse(i) : new e(i.name, i.times, i.values, i.interpolation)
}
const nn = {
    enabled: !1,
    files: {},
    add: function(i, e) {
        this.enabled !== !1 && (this.files[i] = e)
    },
    get: function(i) {
        if (this.enabled !== !1)
            return this.files[i]
    },
    remove: function(i) {
        delete this.files[i]
    },
    clear: function() {
        this.files = {}
    }
};
class Jy {
    constructor(e, t, s)
    {
        const n = this;
        let r = !1,
            a = 0,
            o = 0,
            l;
        const c = [];
        this.onStart = void 0,
        this.onLoad = e,
        this.onProgress = t,
        this.onError = s,
        this.itemStart = function(h) {
            o++,
            r === !1 && n.onStart !== void 0 && n.onStart(h, a, o),
            r = !0
        },
        this.itemEnd = function(h) {
            a++,
            n.onProgress !== void 0 && n.onProgress(h, a, o),
            a === o && (r = !1, n.onLoad !== void 0 && n.onLoad())
        },
        this.itemError = function(h) {
            n.onError !== void 0 && n.onError(h)
        },
        this.resolveURL = function(h) {
            return l ? l(h) : h
        },
        this.setURLModifier = function(h) {
            return l = h, this
        },
        this.addHandler = function(h, d) {
            return c.push(h, d), this
        },
        this.removeHandler = function(h) {
            const d = c.indexOf(h);
            return d !== -1 && c.splice(d, 2), this
        },
        this.getHandler = function(h) {
            for (let d = 0, u = c.length; d < u; d += 2) {
                const f = c[d],
                    p = c[d + 1];
                if (f.global && (f.lastIndex = 0), f.test(h))
                    return p
            }
            return null
        }
    }
}
const NI = new Jy;
class Nn {
    constructor(e)
    {
        this.manager = e !== void 0 ? e : NI,
        this.crossOrigin = "anonymous",
        this.withCredentials = !1,
        this.path = "",
        this.resourcePath = "",
        this.requestHeader = {}
    }
    load() {}
    loadAsync(e, t)
    {
        const s = this;
        return new Promise(function(n, r) {
            s.load(e, n, t, r)
        })
    }
    parse() {}
    setCrossOrigin(e)
    {
        return this.crossOrigin = e, this
    }
    setWithCredentials(e)
    {
        return this.withCredentials = e, this
    }
    setPath(e)
    {
        return this.path = e, this
    }
    setResourcePath(e)
    {
        return this.resourcePath = e, this
    }
    setRequestHeader(e)
    {
        return this.requestHeader = e, this
    }
}
Nn.DEFAULT_MATERIAL_NAME = "__DEFAULT";
const xn = {};
class OI extends Error {
    constructor(e, t)
    {
        super(e),
        this.response = t
    }
}
class Ts extends Nn {
    constructor(e)
    {
        super(e)
    }
    load(e, t, s, n)
    {
        e === void 0 && (e = ""),
        this.path !== void 0 && (e = this.path + e),
        e = this.manager.resolveURL(e);
        const r = nn.get(e);
        if (r !== void 0)
            return this.manager.itemStart(e), setTimeout(() => {
                t && t(r),
                this.manager.itemEnd(e)
            }, 0), r;
        if (xn[e] !== void 0) {
            xn[e].push({
                onLoad: t,
                onProgress: s,
                onError: n
            });
            return
        }
        xn[e] = [],
        xn[e].push({
            onLoad: t,
            onProgress: s,
            onError: n
        });
        const a = new Request(e, {
                headers: new Headers(this.requestHeader),
                credentials: this.withCredentials ? "include" : "same-origin"
            }),
            o = this.mimeType,
            l = this.responseType;
        fetch(a).then(c => {
            if (c.status === 200 || c.status === 0) {
                if (c.status === 0 && console.warn("THREE.FileLoader: HTTP Status 0 received."), typeof ReadableStream > "u" || c.body === void 0 || c.body.getReader === void 0)
                    return c;
                const h = xn[e],
                    d = c.body.getReader(),
                    u = c.headers.get("X-File-Size") || c.headers.get("Content-Length"),
                    f = u ? parseInt(u) : 0,
                    p = f !== 0;
                let A = 0;
                const m = new ReadableStream({
                    start(g) {
                        x();
                        function x() {
                            d.read().then(({done: v, value: y}) => {
                                if (v)
                                    g.close();
                                else {
                                    A += y.byteLength;
                                    const S = new ProgressEvent("progress", {
                                        lengthComputable: p,
                                        loaded: A,
                                        total: f
                                    });
                                    for (let w = 0, C = h.length; w < C; w++) {
                                        const M = h[w];
                                        M.onProgress && M.onProgress(S)
                                    }
                                    g.enqueue(y),
                                    x()
                                }
                            }, v => {
                                g.error(v)
                            })
                        }
                    }
                });
                return new Response(m)
            } else
                throw new OI(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`, c)
        }).then(c => {
            switch (l) {
            case "arraybuffer":
                return c.arrayBuffer();
            case "blob":
                return c.blob();
            case "document":
                return c.text().then(h => new DOMParser().parseFromString(h, o));
            case "json":
                return c.json();
            default:
                if (o === void 0)
                    return c.text();
                {
                    const d = /charset="?([^;"\s]*)"?/i.exec(o),
                        u = d && d[1] ? d[1].toLowerCase() : void 0,
                        f = new TextDecoder(u);
                    return c.arrayBuffer().then(p => f.decode(p))
                }
            }
        }).then(c => {
            nn.add(e, c);
            const h = xn[e];
            delete xn[e];
            for (let d = 0, u = h.length; d < u; d++) {
                const f = h[d];
                f.onLoad && f.onLoad(c)
            }
        }).catch(c => {
            const h = xn[e];
            if (h === void 0)
                throw this.manager.itemError(e), c;
            delete xn[e];
            for (let d = 0, u = h.length; d < u; d++) {
                const f = h[d];
                f.onError && f.onError(c)
            }
            this.manager.itemError(e)
        }).finally(() => {
            this.manager.itemEnd(e)
        }),
        this.manager.itemStart(e)
    }
    setResponseType(e)
    {
        return this.responseType = e, this
    }
    setMimeType(e)
    {
        return this.mimeType = e, this
    }
}
class kI extends Nn {
    constructor(e)
    {
        super(e)
    }
    load(e, t, s, n)
    {
        this.path !== void 0 && (e = this.path + e),
        e = this.manager.resolveURL(e);
        const r = this,
            a = nn.get(e);
        if (a !== void 0)
            return r.manager.itemStart(e), setTimeout(function() {
                t && t(a),
                r.manager.itemEnd(e)
            }, 0), a;
        const o = Ac("img");
        function l() {
            h(),
            nn.add(e, this),
            t && t(this),
            r.manager.itemEnd(e)
        }
        function c(d) {
            h(),
            n && n(d),
            r.manager.itemError(e),
            r.manager.itemEnd(e)
        }
        function h() {
            o.removeEventListener("load", l, !1),
            o.removeEventListener("error", c, !1)
        }
        return o.addEventListener("load", l, !1), o.addEventListener("error", c, !1), e.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (o.crossOrigin = this.crossOrigin), r.manager.itemStart(e), o.src = e, o
    }
}
class jy extends Nn {
    constructor(e)
    {
        super(e)
    }
    load(e, t, s, n)
    {
        const r = new Rt,
            a = new kI(this.manager);
        return a.setCrossOrigin(this.crossOrigin), a.setPath(this.path), a.load(e, function(o) {
            r.image = o,
            r.needsUpdate = !0,
            t !== void 0 && t(r)
        }, s, n), r
    }
}
class VA extends It {
    constructor(e, t=1)
    {
        super(),
        this.isLight = !0,
        this.type = "Light",
        this.color = new Z(e),
        this.intensity = t
    }
    dispose() {}
    copy(e, t)
    {
        return super.copy(e, t), this.color.copy(e.color), this.intensity = e.intensity, this
    }
    toJSON(e)
    {
        const t = super.toJSON(e);
        return t.object.color = this.color.getHex(), t.object.intensity = this.intensity, this.groundColor !== void 0 && (t.object.groundColor = this.groundColor.getHex()), this.distance !== void 0 && (t.object.distance = this.distance), this.angle !== void 0 && (t.object.angle = this.angle), this.decay !== void 0 && (t.object.decay = this.decay), this.penumbra !== void 0 && (t.object.penumbra = this.penumbra), this.shadow !== void 0 && (t.object.shadow = this.shadow.toJSON()), t
    }
}
const bf = new De,
    g0 = new b,
    v0 = new b;
class WA {
    constructor(e)
    {
        this.camera = e,
        this.bias = 0,
        this.normalBias = 0,
        this.radius = 1,
        this.blurSamples = 8,
        this.mapSize = new H(512, 512),
        this.map = null,
        this.mapPass = null,
        this.matrix = new De,
        this.autoUpdate = !0,
        this.needsUpdate = !1,
        this._frustum = new Ed,
        this._frameExtents = new H(1, 1),
        this._viewportCount = 1,
        this._viewports = [new yt(0, 0, 1, 1)]
    }
    getViewportCount()
    {
        return this._viewportCount
    }
    getFrustum()
    {
        return this._frustum
    }
    updateMatrices(e)
    {
        const t = this.camera,
            s = this.matrix;
        g0.setFromMatrixPosition(e.matrixWorld),
        t.position.copy(g0),
        v0.setFromMatrixPosition(e.target.matrixWorld),
        t.lookAt(v0),
        t.updateMatrixWorld(),
        bf.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse),
        this._frustum.setFromProjectionMatrix(bf),
        s.set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1),
        s.multiply(bf)
    }
    getViewport(e)
    {
        return this._viewports[e]
    }
    getFrameExtents()
    {
        return this._frameExtents
    }
    dispose()
    {
        this.map && this.map.dispose(),
        this.mapPass && this.mapPass.dispose()
    }
    copy(e)
    {
        return this.camera = e.camera.clone(), this.bias = e.bias, this.radius = e.radius, this.mapSize.copy(e.mapSize), this
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
    toJSON()
    {
        const e = {};
        return this.bias !== 0 && (e.bias = this.bias), this.normalBias !== 0 && (e.normalBias = this.normalBias), this.radius !== 1 && (e.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (e.mapSize = this.mapSize.toArray()), e.camera = this.camera.toJSON(!1).object, delete e.camera.matrix, e
    }
}
class zI extends WA {
    constructor()
    {
        super(new gi(50, 1, .5, 500)),
        this.isSpotLightShadow = !0,
        this.focus = 1
    }
    updateMatrices(e)
    {
        const t = this.camera,
            s = Uo * 2 * e.angle * this.focus,
            n = this.mapSize.width / this.mapSize.height,
            r = e.distance || t.far;
        (s !== t.fov || n !== t.aspect || r !== t.far) && (t.fov = s, t.aspect = n, t.far = r, t.updateProjectionMatrix()),
        super.updateMatrices(e)
    }
    copy(e)
    {
        return super.copy(e), this.focus = e.focus, this
    }
}
class QI extends VA {
    constructor(e, t, s=0, n=Math.PI / 3, r=0, a=2)
    {
        super(e, t),
        this.isSpotLight = !0,
        this.type = "SpotLight",
        this.position.copy(It.DEFAULT_UP),
        this.updateMatrix(),
        this.target = new It,
        this.distance = s,
        this.angle = n,
        this.penumbra = r,
        this.decay = a,
        this.map = null,
        this.shadow = new zI
    }
    get power()
    {
        return this.intensity * Math.PI
    }
    set power(e)
    {
        this.intensity = e / Math.PI
    }
    dispose()
    {
        this.shadow.dispose()
    }
    copy(e, t)
    {
        return super.copy(e, t), this.distance = e.distance, this.angle = e.angle, this.penumbra = e.penumbra, this.decay = e.decay, this.target = e.target.clone(), this.shadow = e.shadow.clone(), this
    }
}
const x0 = new De,
    ll = new b,
    Tf = new b;
class GI extends WA {
    constructor()
    {
        super(new gi(90, 1, .5, 500)),
        this.isPointLightShadow = !0,
        this._frameExtents = new H(4, 2),
        this._viewportCount = 6,
        this._viewports = [new yt(2, 1, 1, 1), new yt(0, 1, 1, 1), new yt(3, 1, 1, 1), new yt(1, 1, 1, 1), new yt(3, 0, 1, 1), new yt(1, 0, 1, 1)],
        this._cubeDirections = [new b(1, 0, 0), new b(-1, 0, 0), new b(0, 0, 1), new b(0, 0, -1), new b(0, 1, 0), new b(0, -1, 0)],
        this._cubeUps = [new b(0, 1, 0), new b(0, 1, 0), new b(0, 1, 0), new b(0, 1, 0), new b(0, 0, 1), new b(0, 0, -1)]
    }
    updateMatrices(e, t=0)
    {
        const s = this.camera,
            n = this.matrix,
            r = e.distance || s.far;
        r !== s.far && (s.far = r, s.updateProjectionMatrix()),
        ll.setFromMatrixPosition(e.matrixWorld),
        s.position.copy(ll),
        Tf.copy(s.position),
        Tf.add(this._cubeDirections[t]),
        s.up.copy(this._cubeUps[t]),
        s.lookAt(Tf),
        s.updateMatrixWorld(),
        n.makeTranslation(-ll.x, -ll.y, -ll.z),
        x0.multiplyMatrices(s.projectionMatrix, s.matrixWorldInverse),
        this._frustum.setFromProjectionMatrix(x0)
    }
}
class HI extends VA {
    constructor(e, t, s=0, n=2)
    {
        super(e, t),
        this.isPointLight = !0,
        this.type = "PointLight",
        this.distance = s,
        this.decay = n,
        this.shadow = new GI
    }
    get power()
    {
        return this.intensity * 4 * Math.PI
    }
    set power(e)
    {
        this.intensity = e / (4 * Math.PI)
    }
    dispose()
    {
        this.shadow.dispose()
    }
    copy(e, t)
    {
        return super.copy(e, t), this.distance = e.distance, this.decay = e.decay, this.shadow = e.shadow.clone(), this
    }
}
class VI extends WA {
    constructor()
    {
        super(new Ln(-5, 5, 5, -5, .5, 500)),
        this.isDirectionalLightShadow = !0
    }
}
class WI extends VA {
    constructor(e, t)
    {
        super(e, t),
        this.isDirectionalLight = !0,
        this.type = "DirectionalLight",
        this.position.copy(It.DEFAULT_UP),
        this.updateMatrix(),
        this.target = new It,
        this.shadow = new VI
    }
    dispose()
    {
        this.shadow.dispose()
    }
    copy(e)
    {
        return super.copy(e), this.target = e.target.clone(), this.shadow = e.shadow.clone(), this
    }
}
class Wl {
    static decodeText(e)
    {
        if (console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."), typeof TextDecoder < "u")
            return new TextDecoder().decode(e);
        let t = "";
        for (let s = 0, n = e.length; s < n; s++)
            t += String.fromCharCode(e[s]);
        try {
            return decodeURIComponent(escape(t))
        } catch {
            return t
        }
    }
    static extractUrlBase(e)
    {
        const t = e.lastIndexOf("/");
        return t === -1 ? "./" : e.slice(0, t + 1)
    }
    static resolveURL(e, t)
    {
        return typeof e != "string" || e === "" ? "" : (/^https?:\/\//i.test(t) && /^\//.test(e) && (t = t.replace(/(^https?:\/\/[^\/]+).*/i, "$1")), /^(https?:)?\/\//i.test(e) || /^data:.*,.*$/i.test(e) || /^blob:.*$/i.test(e) ? e : t + e)
    }
}
class Td extends ot {
    constructor()
    {
        super(),
        this.isInstancedBufferGeometry = !0,
        this.type = "InstancedBufferGeometry",
        this.instanceCount = 1 / 0
    }
    copy(e)
    {
        return super.copy(e), this.instanceCount = e.instanceCount, this
    }
    toJSON()
    {
        const e = super.toJSON();
        return e.instanceCount = this.instanceCount, e.isInstancedBufferGeometry = !0, e
    }
}
class YI extends Nn {
    constructor(e)
    {
        super(e)
    }
    load(e, t, s, n)
    {
        const r = this,
            a = new Ts(r.manager);
        a.setPath(r.path),
        a.setRequestHeader(r.requestHeader),
        a.setWithCredentials(r.withCredentials),
        a.load(e, function(o) {
            try {
                t(r.parse(JSON.parse(o)))
            } catch (l) {
                n ? n(l) : console.error(l),
                r.manager.itemError(e)
            }
        }, s, n)
    }
    parse(e)
    {
        const t = {},
            s = {};
        function n(f, p) {
            if (t[p] !== void 0)
                return t[p];
            const m = f.interleavedBuffers[p],
                g = r(f, m.buffer),
                x = kc(m.type, g),
                v = new Qy(x, m.stride);
            return v.uuid = m.uuid, t[p] = v, v
        }
        function r(f, p) {
            if (s[p] !== void 0)
                return s[p];
            const m = f.arrayBuffers[p],
                g = new Uint32Array(m).buffer;
            return s[p] = g, g
        }
        const a = e.isInstancedBufferGeometry ? new Td : new ot,
            o = e.data.index;
        if (o !== void 0) {
            const f = kc(o.type, o.array);
            a.setIndex(new We(f, 1))
        }
        const l = e.data.attributes;
        for (const f in l) {
            const p = l[f];
            let A;
            if (p.isInterleavedBufferAttribute) {
                const m = n(e.data, p.data);
                A = new gc(m, p.itemSize, p.offset, p.normalized)
            } else {
                const m = kc(p.type, p.array),
                    g = p.isInstancedBufferAttribute ? gr : We;
                A = new g(m, p.itemSize, p.normalized)
            }
            p.name !== void 0 && (A.name = p.name),
            p.usage !== void 0 && A.setUsage(p.usage),
            a.setAttribute(f, A)
        }
        const c = e.data.morphAttributes;
        if (c)
            for (const f in c) {
                const p = c[f],
                    A = [];
                for (let m = 0, g = p.length; m < g; m++) {
                    const x = p[m];
                    let v;
                    if (x.isInterleavedBufferAttribute) {
                        const y = n(e.data, x.data);
                        v = new gc(y, x.itemSize, x.offset, x.normalized)
                    } else {
                        const y = kc(x.type, x.array);
                        v = new We(y, x.itemSize, x.normalized)
                    }
                    x.name !== void 0 && (v.name = x.name),
                    A.push(v)
                }
                a.morphAttributes[f] = A
            }
        e.data.morphTargetsRelative && (a.morphTargetsRelative = !0);
        const d = e.data.groups || e.data.drawcalls || e.data.offsets;
        if (d !== void 0)
            for (let f = 0, p = d.length; f !== p; ++f) {
                const A = d[f];
                a.addGroup(A.start, A.count, A.materialIndex)
            }
        const u = e.data.boundingSphere;
        if (u !== void 0) {
            const f = new b;
            u.center !== void 0 && f.fromArray(u.center),
            a.boundingSphere = new bi(f, u.radius)
        }
        return e.name && (a.name = e.name), e.userData && (a.userData = e.userData), a
    }
}
class qI extends Nn {
    constructor(e)
    {
        super(e),
        this.isImageBitmapLoader = !0,
        typeof createImageBitmap > "u" && console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),
        typeof fetch > "u" && console.warn("THREE.ImageBitmapLoader: fetch() not supported."),
        this.options = {
            premultiplyAlpha: "none"
        }
    }
    setOptions(e)
    {
        return this.options = e, this
    }
    load(e, t, s, n)
    {
        e === void 0 && (e = ""),
        this.path !== void 0 && (e = this.path + e),
        e = this.manager.resolveURL(e);
        const r = this,
            a = nn.get(e);
        if (a !== void 0) {
            if (r.manager.itemStart(e), a.then) {
                a.then(c => {
                    t && t(c),
                    r.manager.itemEnd(e)
                }).catch(c => {
                    n && n(c)
                });
                return
            }
            return setTimeout(function() {
                t && t(a),
                r.manager.itemEnd(e)
            }, 0), a
        }
        const o = {};
        o.credentials = this.crossOrigin === "anonymous" ? "same-origin" : "include",
        o.headers = this.requestHeader;
        const l = fetch(e, o).then(function(c) {
            return c.blob()
        }).then(function(c) {
            return createImageBitmap(c, Object.assign(r.options, {
                colorSpaceConversion: "none"
            }))
        }).then(function(c) {
            return nn.add(e, c), t && t(c), r.manager.itemEnd(e), c
        }).catch(function(c) {
            n && n(c),
            nn.remove(e),
            r.manager.itemError(e),
            r.manager.itemEnd(e)
        });
        nn.add(e, l),
        r.manager.itemStart(e)
    }
}
let gh;
class $h {
    static getContext()
    {
        return gh === void 0 && (gh = new (window.AudioContext || window.webkitAudioContext)), gh
    }
    static setContext(e)
    {
        gh = e
    }
}
class Zy {
    constructor(e=!0)
    {
        this.autoStart = e,
        this.startTime = 0,
        this.oldTime = 0,
        this.elapsedTime = 0,
        this.running = !1
    }
    start()
    {
        this.startTime = y0(),
        this.oldTime = this.startTime,
        this.elapsedTime = 0,
        this.running = !0
    }
    stop()
    {
        this.getElapsedTime(),
        this.running = !1,
        this.autoStart = !1
    }
    getElapsedTime()
    {
        return this.getDelta(), this.elapsedTime
    }
    getDelta()
    {
        let e = 0;
        if (this.autoStart && !this.running)
            return this.start(), 0;
        if (this.running) {
            const t = y0();
            e = (t - this.oldTime) / 1e3,
            this.oldTime = t,
            this.elapsedTime += e
        }
        return e
    }
}
function y0() {
    return (typeof performance > "u" ? Date : performance).now()
}
const Ur = new b,
    _0 = new Vi,
    XI = new b,
    Lr = new b;
class KI extends It {
    constructor()
    {
        super(),
        this.type = "AudioListener",
        this.context = $h.getContext(),
        this.gain = this.context.createGain(),
        this.gain.connect(this.context.destination),
        this.filter = null,
        this.timeDelta = 0,
        this._clock = new Zy
    }
    getInput()
    {
        return this.gain
    }
    removeFilter()
    {
        return this.filter !== null && (this.gain.disconnect(this.filter), this.filter.disconnect(this.context.destination), this.gain.connect(this.context.destination), this.filter = null), this
    }
    getFilter()
    {
        return this.filter
    }
    setFilter(e)
    {
        return this.filter !== null ? (this.gain.disconnect(this.filter), this.filter.disconnect(this.context.destination)) : this.gain.disconnect(this.context.destination), this.filter = e, this.gain.connect(this.filter), this.filter.connect(this.context.destination), this
    }
    getMasterVolume()
    {
        return this.gain.gain.value
    }
    setMasterVolume(e)
    {
        return this.gain.gain.setTargetAtTime(e, this.context.currentTime, .01), this
    }
    updateMatrixWorld(e)
    {
        super.updateMatrixWorld(e);
        const t = this.context.listener,
            s = this.up;
        if (this.timeDelta = this._clock.getDelta(), this.matrixWorld.decompose(Ur, _0, XI), Lr.set(0, 0, -1).applyQuaternion(_0), t.positionX) {
            const n = this.context.currentTime + this.timeDelta;
            t.positionX.linearRampToValueAtTime(Ur.x, n),
            t.positionY.linearRampToValueAtTime(Ur.y, n),
            t.positionZ.linearRampToValueAtTime(Ur.z, n),
            t.forwardX.linearRampToValueAtTime(Lr.x, n),
            t.forwardY.linearRampToValueAtTime(Lr.y, n),
            t.forwardZ.linearRampToValueAtTime(Lr.z, n),
            t.upX.linearRampToValueAtTime(s.x, n),
            t.upY.linearRampToValueAtTime(s.y, n),
            t.upZ.linearRampToValueAtTime(s.z, n)
        } else
            t.setPosition(Ur.x, Ur.y, Ur.z),
            t.setOrientation(Lr.x, Lr.y, Lr.z, s.x, s.y, s.z)
    }
}
class $y extends It {
    constructor(e)
    {
        super(),
        this.type = "Audio",
        this.listener = e,
        this.context = e.context,
        this.gain = this.context.createGain(),
        this.gain.connect(e.getInput()),
        this.autoplay = !1,
        this.buffer = null,
        this.detune = 0,
        this.loop = !1,
        this.loopStart = 0,
        this.loopEnd = 0,
        this.offset = 0,
        this.duration = void 0,
        this.playbackRate = 1,
        this.isPlaying = !1,
        this.hasPlaybackControl = !0,
        this.source = null,
        this.sourceType = "empty",
        this._startedAt = 0,
        this._progress = 0,
        this._connected = !1,
        this.filters = []
    }
    getOutput()
    {
        return this.gain
    }
    setNodeSource(e)
    {
        return this.hasPlaybackControl = !1, this.sourceType = "audioNode", this.source = e, this.connect(), this
    }
    setMediaElementSource(e)
    {
        return this.hasPlaybackControl = !1, this.sourceType = "mediaNode", this.source = this.context.createMediaElementSource(e), this.connect(), this
    }
    setMediaStreamSource(e)
    {
        return this.hasPlaybackControl = !1, this.sourceType = "mediaStreamNode", this.source = this.context.createMediaStreamSource(e), this.connect(), this
    }
    setBuffer(e)
    {
        return this.buffer = e, this.sourceType = "buffer", this.autoplay && this.play(), this
    }
    play(e=0)
    {
        if (this.isPlaying === !0) {
            console.warn("THREE.Audio: Audio is already playing.");
            return
        }
        if (this.hasPlaybackControl === !1) {
            console.warn("THREE.Audio: this Audio has no playback control.");
            return
        }
        this._startedAt = this.context.currentTime + e;
        const t = this.context.createBufferSource();
        return t.buffer = this.buffer, t.loop = this.loop, t.loopStart = this.loopStart, t.loopEnd = this.loopEnd, t.onended = this.onEnded.bind(this), t.start(this._startedAt, this._progress + this.offset, this.duration), this.isPlaying = !0, this.source = t, this.setDetune(this.detune), this.setPlaybackRate(this.playbackRate), this.connect()
    }
    pause()
    {
        if (this.hasPlaybackControl === !1) {
            console.warn("THREE.Audio: this Audio has no playback control.");
            return
        }
        return this.isPlaying === !0 && (this._progress += Math.max(this.context.currentTime - this._startedAt, 0) * this.playbackRate, this.loop === !0 && (this._progress = this._progress % (this.duration || this.buffer.duration)), this.source.stop(), this.source.onended = null, this.isPlaying = !1), this
    }
    stop()
    {
        if (this.hasPlaybackControl === !1) {
            console.warn("THREE.Audio: this Audio has no playback control.");
            return
        }
        return this._progress = 0, this.source !== null && (this.source.stop(), this.source.onended = null), this.isPlaying = !1, this
    }
    connect()
    {
        if (this.filters.length > 0) {
            this.source.connect(this.filters[0]);
            for (let e = 1, t = this.filters.length; e < t; e++)
                this.filters[e - 1].connect(this.filters[e]);
            this.filters[this.filters.length - 1].connect(this.getOutput())
        } else
            this.source.connect(this.getOutput());
        return this._connected = !0, this
    }
    disconnect()
    {
        if (this._connected !== !1) {
            if (this.filters.length > 0) {
                this.source.disconnect(this.filters[0]);
                for (let e = 1, t = this.filters.length; e < t; e++)
                    this.filters[e - 1].disconnect(this.filters[e]);
                this.filters[this.filters.length - 1].disconnect(this.getOutput())
            } else
                this.source.disconnect(this.getOutput());
            return this._connected = !1, this
        }
    }
    getFilters()
    {
        return this.filters
    }
    setFilters(e)
    {
        return e || (e = []), this._connected === !0 ? (this.disconnect(), this.filters = e.slice(), this.connect()) : this.filters = e.slice(), this
    }
    setDetune(e)
    {
        return this.detune = e, this.isPlaying === !0 && this.source.detune !== void 0 && this.source.detune.setTargetAtTime(this.detune, this.context.currentTime, .01), this
    }
    getDetune()
    {
        return this.detune
    }
    getFilter()
    {
        return this.getFilters()[0]
    }
    setFilter(e)
    {
        return this.setFilters(e ? [e] : [])
    }
    setPlaybackRate(e)
    {
        if (this.hasPlaybackControl === !1) {
            console.warn("THREE.Audio: this Audio has no playback control.");
            return
        }
        return this.playbackRate = e, this.isPlaying === !0 && this.source.playbackRate.setTargetAtTime(this.playbackRate, this.context.currentTime, .01), this
    }
    getPlaybackRate()
    {
        return this.playbackRate
    }
    onEnded()
    {
        this.isPlaying = !1
    }
    getLoop()
    {
        return this.hasPlaybackControl === !1 ? (console.warn("THREE.Audio: this Audio has no playback control."), !1) : this.loop
    }
    setLoop(e)
    {
        if (this.hasPlaybackControl === !1) {
            console.warn("THREE.Audio: this Audio has no playback control.");
            return
        }
        return this.loop = e, this.isPlaying === !0 && (this.source.loop = this.loop), this
    }
    setLoopStart(e)
    {
        return this.loopStart = e, this
    }
    setLoopEnd(e)
    {
        return this.loopEnd = e, this
    }
    getVolume()
    {
        return this.gain.gain.value
    }
    setVolume(e)
    {
        return this.gain.gain.setTargetAtTime(e, this.context.currentTime, .01), this
    }
}
const Fr = new b,
    w0 = new Vi,
    JI = new b,
    Nr = new b;
class jI extends $y {
    constructor(e)
    {
        super(e),
        this.panner = this.context.createPanner(),
        this.panner.panningModel = "HRTF",
        this.panner.connect(this.gain)
    }
    connect()
    {
        super.connect(),
        this.panner.connect(this.gain)
    }
    disconnect()
    {
        super.disconnect(),
        this.panner.disconnect(this.gain)
    }
    getOutput()
    {
        return this.panner
    }
    getRefDistance()
    {
        return this.panner.refDistance
    }
    setRefDistance(e)
    {
        return this.panner.refDistance = e, this
    }
    getRolloffFactor()
    {
        return this.panner.rolloffFactor
    }
    setRolloffFactor(e)
    {
        return this.panner.rolloffFactor = e, this
    }
    getDistanceModel()
    {
        return this.panner.distanceModel
    }
    setDistanceModel(e)
    {
        return this.panner.distanceModel = e, this
    }
    getMaxDistance()
    {
        return this.panner.maxDistance
    }
    setMaxDistance(e)
    {
        return this.panner.maxDistance = e, this
    }
    setDirectionalCone(e, t, s)
    {
        return this.panner.coneInnerAngle = e, this.panner.coneOuterAngle = t, this.panner.coneOuterGain = s, this
    }
    updateMatrixWorld(e)
    {
        if (super.updateMatrixWorld(e), this.hasPlaybackControl === !0 && this.isPlaying === !1)
            return;
        this.matrixWorld.decompose(Fr, w0, JI),
        Nr.set(0, 0, 1).applyQuaternion(w0);
        const t = this.panner;
        if (t.positionX) {
            const s = this.context.currentTime + this.listener.timeDelta;
            t.positionX.linearRampToValueAtTime(Fr.x, s),
            t.positionY.linearRampToValueAtTime(Fr.y, s),
            t.positionZ.linearRampToValueAtTime(Fr.z, s),
            t.orientationX.linearRampToValueAtTime(Nr.x, s),
            t.orientationY.linearRampToValueAtTime(Nr.y, s),
            t.orientationZ.linearRampToValueAtTime(Nr.z, s)
        } else
            t.setPosition(Fr.x, Fr.y, Fr.z),
            t.setOrientation(Nr.x, Nr.y, Nr.z)
    }
}
const YA = "\\[\\]\\.:\\/",
    ZI = new RegExp("[" + YA + "]", "g"),
    qA = "[^" + YA + "]",
    $I = "[^" + YA.replace("\\.", "") + "]",
    e2 = /((?:WC+[\/:])*)/.source.replace("WC", qA),
    t2 = /(WCOD+)?/.source.replace("WCOD", $I),
    i2 = /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", qA),
    s2 = /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", qA),
    n2 = new RegExp("^" + e2 + t2 + i2 + s2 + "$"),
    r2 = ["material", "materials", "bones", "map"];
class a2 {
    constructor(e, t, s)
    {
        const n = s || Tt.parseTrackName(t);
        this._targetGroup = e,
        this._bindings = e.subscribe_(t, n)
    }
    getValue(e, t)
    {
        this.bind();
        const s = this._targetGroup.nCachedObjects_,
            n = this._bindings[s];
        n !== void 0 && n.getValue(e, t)
    }
    setValue(e, t)
    {
        const s = this._bindings;
        for (let n = this._targetGroup.nCachedObjects_, r = s.length; n !== r; ++n)
            s[n].setValue(e, t)
    }
    bind()
    {
        const e = this._bindings;
        for (let t = this._targetGroup.nCachedObjects_, s = e.length; t !== s; ++t)
            e[t].bind()
    }
    unbind()
    {
        const e = this._bindings;
        for (let t = this._targetGroup.nCachedObjects_, s = e.length; t !== s; ++t)
            e[t].unbind()
    }
}
class Tt {
    constructor(e, t, s)
    {
        this.path = t,
        this.parsedPath = s || Tt.parseTrackName(t),
        this.node = Tt.findNode(e, this.parsedPath.nodeName),
        this.rootNode = e,
        this.getValue = this._getValue_unbound,
        this.setValue = this._setValue_unbound
    }
    static create(e, t, s)
    {
        return e && e.isAnimationObjectGroup ? new Tt.Composite(e, t, s) : new Tt(e, t, s)
    }
    static sanitizeNodeName(e)
    {
        return e.replace(/\s/g, "_").replace(ZI, "")
    }
    static parseTrackName(e)
    {
        const t = n2.exec(e);
        if (t === null)
            throw new Error("PropertyBinding: Cannot parse trackName: " + e);
        const s = {
                nodeName: t[2],
                objectName: t[3],
                objectIndex: t[4],
                propertyName: t[5],
                propertyIndex: t[6]
            },
            n = s.nodeName && s.nodeName.lastIndexOf(".");
        if (n !== void 0 && n !== -1) {
            const r = s.nodeName.substring(n + 1);
            r2.indexOf(r) !== -1 && (s.nodeName = s.nodeName.substring(0, n), s.objectName = r)
        }
        if (s.propertyName === null || s.propertyName.length === 0)
            throw new Error("PropertyBinding: can not parse propertyName from trackName: " + e);
        return s
    }
    static findNode(e, t)
    {
        if (t === void 0 || t === "" || t === "." || t === -1 || t === e.name || t === e.uuid)
            return e;
        if (e.skeleton) {
            const s = e.skeleton.getBoneByName(t);
            if (s !== void 0)
                return s
        }
        if (e.children) {
            const s = function(r) {
                    for (let a = 0; a < r.length; a++) {
                        const o = r[a];
                        if (o.name === t || o.uuid === t)
                            return o;
                        const l = s(o.children);
                        if (l)
                            return l
                    }
                    return null
                },
                n = s(e.children);
            if (n)
                return n
        }
        return null
    }
    _getValue_unavailable() {}
    _setValue_unavailable() {}
    _getValue_direct(e, t)
    {
        e[t] = this.targetObject[this.propertyName]
    }
    _getValue_array(e, t)
    {
        const s = this.resolvedProperty;
        for (let n = 0, r = s.length; n !== r; ++n)
            e[t++] = s[n]
    }
    _getValue_arrayElement(e, t)
    {
        e[t] = this.resolvedProperty[this.propertyIndex]
    }
    _getValue_toArray(e, t)
    {
        this.resolvedProperty.toArray(e, t)
    }
    _setValue_direct(e, t)
    {
        this.targetObject[this.propertyName] = e[t]
    }
    _setValue_direct_setNeedsUpdate(e, t)
    {
        this.targetObject[this.propertyName] = e[t],
        this.targetObject.needsUpdate = !0
    }
    _setValue_direct_setMatrixWorldNeedsUpdate(e, t)
    {
        this.targetObject[this.propertyName] = e[t],
        this.targetObject.matrixWorldNeedsUpdate = !0
    }
    _setValue_array(e, t)
    {
        const s = this.resolvedProperty;
        for (let n = 0, r = s.length; n !== r; ++n)
            s[n] = e[t++]
    }
    _setValue_array_setNeedsUpdate(e, t)
    {
        const s = this.resolvedProperty;
        for (let n = 0, r = s.length; n !== r; ++n)
            s[n] = e[t++];
        this.targetObject.needsUpdate = !0
    }
    _setValue_array_setMatrixWorldNeedsUpdate(e, t)
    {
        const s = this.resolvedProperty;
        for (let n = 0, r = s.length; n !== r; ++n)
            s[n] = e[t++];
        this.targetObject.matrixWorldNeedsUpdate = !0
    }
    _setValue_arrayElement(e, t)
    {
        this.resolvedProperty[this.propertyIndex] = e[t]
    }
    _setValue_arrayElement_setNeedsUpdate(e, t)
    {
        this.resolvedProperty[this.propertyIndex] = e[t],
        this.targetObject.needsUpdate = !0
    }
    _setValue_arrayElement_setMatrixWorldNeedsUpdate(e, t)
    {
        this.resolvedProperty[this.propertyIndex] = e[t],
        this.targetObject.matrixWorldNeedsUpdate = !0
    }
    _setValue_fromArray(e, t)
    {
        this.resolvedProperty.fromArray(e, t)
    }
    _setValue_fromArray_setNeedsUpdate(e, t)
    {
        this.resolvedProperty.fromArray(e, t),
        this.targetObject.needsUpdate = !0
    }
    _setValue_fromArray_setMatrixWorldNeedsUpdate(e, t)
    {
        this.resolvedProperty.fromArray(e, t),
        this.targetObject.matrixWorldNeedsUpdate = !0
    }
    _getValue_unbound(e, t)
    {
        this.bind(),
        this.getValue(e, t)
    }
    _setValue_unbound(e, t)
    {
        this.bind(),
        this.setValue(e, t)
    }
    bind()
    {
        let e = this.node;
        const t = this.parsedPath,
            s = t.objectName,
            n = t.propertyName;
        let r = t.propertyIndex;
        if (e || (e = Tt.findNode(this.rootNode, t.nodeName), this.node = e), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !e) {
            console.warn("THREE.PropertyBinding: No target node found for track: " + this.path + ".");
            return
        }
        if (s) {
            let c = t.objectIndex;
            switch (s) {
            case "materials":
                if (!e.material) {
                    console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
                    return
                }
                if (!e.material.materials) {
                    console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.", this);
                    return
                }
                e = e.material.materials;
                break;
            case "bones":
                if (!e.skeleton) {
                    console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
                    return
                }
                e = e.skeleton.bones;
                for (let h = 0; h < e.length; h++)
                    if (e[h].name === c) {
                        c = h;
                        break
                    }
                break;
            case "map":
                if ("map" in e) {
                    e = e.map;
                    break
                }
                if (!e.material) {
                    console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
                    return
                }
                if (!e.material.map) {
                    console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.", this);
                    return
                }
                e = e.material.map;
                break;
            default:
                if (e[s] === void 0) {
                    console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.", this);
                    return
                }
                e = e[s]
            }
            if (c !== void 0) {
                if (e[c] === void 0) {
                    console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, e);
                    return
                }
                e = e[c]
            }
        }
        const a = e[n];
        if (a === void 0) {
            const c = t.nodeName;
            console.error("THREE.PropertyBinding: Trying to update property for track: " + c + "." + n + " but it wasn't found.", e);
            return
        }
        let o = this.Versioning.None;
        this.targetObject = e,
        e.needsUpdate !== void 0 ? o = this.Versioning.NeedsUpdate : e.matrixWorldNeedsUpdate !== void 0 && (o = this.Versioning.MatrixWorldNeedsUpdate);
        let l = this.BindingType.Direct;
        if (r !== void 0) {
            if (n === "morphTargetInfluences") {
                if (!e.geometry) {
                    console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
                    return
                }
                if (!e.geometry.morphAttributes) {
                    console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.", this);
                    return
                }
                e.morphTargetDictionary[r] !== void 0 && (r = e.morphTargetDictionary[r])
            }
            l = this.BindingType.ArrayElement,
            this.resolvedProperty = a,
            this.propertyIndex = r
        } else
            a.fromArray !== void 0 && a.toArray !== void 0 ? (l = this.BindingType.HasFromToArray, this.resolvedProperty = a) : Array.isArray(a) ? (l = this.BindingType.EntireArray, this.resolvedProperty = a) : this.propertyName = n;
        this.getValue = this.GetterByBindingType[l],
        this.setValue = this.SetterByBindingTypeAndVersioning[l][o]
    }
    unbind()
    {
        this.node = null,
        this.getValue = this._getValue_unbound,
        this.setValue = this._setValue_unbound
    }
}
Tt.Composite = a2;
Tt.prototype.BindingType = {
    Direct: 0,
    EntireArray: 1,
    ArrayElement: 2,
    HasFromToArray: 3
};
Tt.prototype.Versioning = {
    None: 0,
    NeedsUpdate: 1,
    MatrixWorldNeedsUpdate: 2
};
Tt.prototype.GetterByBindingType = [Tt.prototype._getValue_direct, Tt.prototype._getValue_array, Tt.prototype._getValue_arrayElement, Tt.prototype._getValue_toArray];
Tt.prototype.SetterByBindingTypeAndVersioning = [[Tt.prototype._setValue_direct, Tt.prototype._setValue_direct_setNeedsUpdate, Tt.prototype._setValue_direct_setMatrixWorldNeedsUpdate], [Tt.prototype._setValue_array, Tt.prototype._setValue_array_setNeedsUpdate, Tt.prototype._setValue_array_setMatrixWorldNeedsUpdate], [Tt.prototype._setValue_arrayElement, Tt.prototype._setValue_arrayElement_setNeedsUpdate, Tt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate], [Tt.prototype._setValue_fromArray, Tt.prototype._setValue_fromArray_setNeedsUpdate, Tt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];
class Me {
    constructor(e)
    {
        this.value = e
    }
    clone()
    {
        return new Me(this.value.clone === void 0 ? this.value : this.value.clone())
    }
}
let o2 = 0;
class l2 extends hn {
    constructor()
    {
        super(),
        this.isUniformsGroup = !0,
        Object.defineProperty(this, "id", {
            value: o2++
        }),
        this.name = "",
        this.usage = qu,
        this.uniforms = []
    }
    add(e)
    {
        return this.uniforms.push(e), this
    }
    remove(e)
    {
        const t = this.uniforms.indexOf(e);
        return t !== -1 && this.uniforms.splice(t, 1), this
    }
    setName(e)
    {
        return this.name = e, this
    }
    setUsage(e)
    {
        return this.usage = e, this
    }
    dispose()
    {
        return this.dispatchEvent({
            type: "dispose"
        }), this
    }
    copy(e)
    {
        this.name = e.name,
        this.usage = e.usage;
        const t = e.uniforms;
        this.uniforms.length = 0;
        for (let s = 0, n = t.length; s < n; s++) {
            const r = Array.isArray(t[s]) ? t[s] : [t[s]];
            for (let a = 0; a < r.length; a++)
                this.uniforms.push(r[a].clone())
        }
        return this
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
}
const E0 = new De;
class e_ {
    constructor(e, t, s=0, n=1 / 0)
    {
        this.ray = new Vo(e, t),
        this.near = s,
        this.far = n,
        this.camera = null,
        this.layers = new RA,
        this.params = {
            Mesh: {},
            Line: {
                threshold: 1
            },
            LOD: {},
            Points: {
                threshold: 1
            },
            Sprite: {}
        }
    }
    set(e, t)
    {
        this.ray.set(e, t)
    }
    setFromCamera(e, t)
    {
        t.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(t.matrixWorld), this.ray.direction.set(e.x, e.y, .5).unproject(t).sub(this.ray.origin).normalize(), this.camera = t) : t.isOrthographicCamera ? (this.ray.origin.set(e.x, e.y, (t.near + t.far) / (t.near - t.far)).unproject(t), this.ray.direction.set(0, 0, -1).transformDirection(t.matrixWorld), this.camera = t) : console.error("THREE.Raycaster: Unsupported camera type: " + t.type)
    }
    setFromXRController(e)
    {
        return E0.identity().extractRotation(e.matrixWorld), this.ray.origin.setFromMatrixPosition(e.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(E0), this
    }
    intersectObject(e, t=!0, s=[])
    {
        return Hp(e, this, s, t), s.sort(C0), s
    }
    intersectObjects(e, t=!0, s=[])
    {
        for (let n = 0, r = e.length; n < r; n++)
            Hp(e[n], this, s, t);
        return s.sort(C0), s
    }
}
function C0(i, e) {
    return i.distance - e.distance
}
function Hp(i, e, t, s) {
    let n = !0;
    if (i.layers.test(e.layers) && i.raycast(e, t) === !1 && (n = !1), n === !0 && s === !0) {
        const r = i.children;
        for (let a = 0, o = r.length; a < o; a++)
            Hp(r[a], e, t, !0)
    }
}
class Yl {
    constructor(e=1, t=0, s=0)
    {
        return this.radius = e, this.phi = t, this.theta = s, this
    }
    set(e, t, s)
    {
        return this.radius = e, this.phi = t, this.theta = s, this
    }
    copy(e)
    {
        return this.radius = e.radius, this.phi = e.phi, this.theta = e.theta, this
    }
    makeSafe()
    {
        return this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi)), this
    }
    setFromVector3(e)
    {
        return this.setFromCartesianCoords(e.x, e.y, e.z)
    }
    setFromCartesianCoords(e, t, s)
    {
        return this.radius = Math.sqrt(e * e + t * t + s * s), this.radius === 0 ? (this.theta = 0, this.phi = 0) : (this.theta = Math.atan2(e, s), this.phi = Math.acos(hi(t / this.radius, -1, 1))), this
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
}
const S0 = new b,
    vh = new b;
class Bn {
    constructor(e=new b, t=new b)
    {
        this.start = e,
        this.end = t
    }
    set(e, t)
    {
        return this.start.copy(e), this.end.copy(t), this
    }
    copy(e)
    {
        return this.start.copy(e.start), this.end.copy(e.end), this
    }
    getCenter(e)
    {
        return e.addVectors(this.start, this.end).multiplyScalar(.5)
    }
    delta(e)
    {
        return e.subVectors(this.end, this.start)
    }
    distanceSq()
    {
        return this.start.distanceToSquared(this.end)
    }
    distance()
    {
        return this.start.distanceTo(this.end)
    }
    at(e, t)
    {
        return this.delta(t).multiplyScalar(e).add(this.start)
    }
    closestPointToPointParameter(e, t)
    {
        S0.subVectors(e, this.start),
        vh.subVectors(this.end, this.start);
        const s = vh.dot(vh);
        let r = vh.dot(S0) / s;
        return t && (r = hi(r, 0, 1)), r
    }
    closestPointToPoint(e, t, s)
    {
        const n = this.closestPointToPointParameter(e, t);
        return this.delta(s).multiplyScalar(n).add(this.start)
    }
    applyMatrix4(e)
    {
        return this.start.applyMatrix4(e), this.end.applyMatrix4(e), this
    }
    equals(e)
    {
        return e.start.equals(this.start) && e.end.equals(this.end)
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", {
    detail: {
        revision: Aa
    }
}));
typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = Aa);
var c2 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function t_(i) {
    return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i
}
var i_ = {
    exports: {}
};
(function(i) {
    var e = Object.prototype.hasOwnProperty,
        t = "~";
    function s() {}
    Object.create && (s.prototype = Object.create(null), new s().__proto__ || (t = !1));
    function n(l, c, h) {
        this.fn = l,
        this.context = c,
        this.once = h || !1
    }
    function r(l, c, h, d, u) {
        if (typeof h != "function")
            throw new TypeError("The listener must be a function");
        var f = new n(h, d || l, u),
            p = t ? t + c : c;
        return l._events[p] ? l._events[p].fn ? l._events[p] = [l._events[p], f] : l._events[p].push(f) : (l._events[p] = f, l._eventsCount++), l
    }
    function a(l, c) {
        --l._eventsCount === 0 ? l._events = new s : delete l._events[c]
    }
    function o() {
        this._events = new s,
        this._eventsCount = 0
    }
    o.prototype.eventNames = function() {
        var c = [],
            h,
            d;
        if (this._eventsCount === 0)
            return c;
        for (d in h = this._events)
            e.call(h, d) && c.push(t ? d.slice(1) : d);
        return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(h)) : c
    },
    o.prototype.listeners = function(c) {
        var h = t ? t + c : c,
            d = this._events[h];
        if (!d)
            return [];
        if (d.fn)
            return [d.fn];
        for (var u = 0, f = d.length, p = new Array(f); u < f; u++)
            p[u] = d[u].fn;
        return p
    },
    o.prototype.listenerCount = function(c) {
        var h = t ? t + c : c,
            d = this._events[h];
        return d ? d.fn ? 1 : d.length : 0
    },
    o.prototype.emit = function(c, h, d, u, f, p) {
        var A = t ? t + c : c;
        if (!this._events[A])
            return !1;
        var m = this._events[A],
            g = arguments.length,
            x,
            v;
        if (m.fn) {
            switch (m.once && this.removeListener(c, m.fn, void 0, !0), g) {
            case 1:
                return m.fn.call(m.context), !0;
            case 2:
                return m.fn.call(m.context, h), !0;
            case 3:
                return m.fn.call(m.context, h, d), !0;
            case 4:
                return m.fn.call(m.context, h, d, u), !0;
            case 5:
                return m.fn.call(m.context, h, d, u, f), !0;
            case 6:
                return m.fn.call(m.context, h, d, u, f, p), !0
            }
            for (v = 1, x = new Array(g - 1); v < g; v++)
                x[v - 1] = arguments[v];
            m.fn.apply(m.context, x)
        } else {
            var y = m.length,
                S;
            for (v = 0; v < y; v++)
                switch (m[v].once && this.removeListener(c, m[v].fn, void 0, !0), g) {
                case 1:
                    m[v].fn.call(m[v].context);
                    break;
                case 2:
                    m[v].fn.call(m[v].context, h);
                    break;
                case 3:
                    m[v].fn.call(m[v].context, h, d);
                    break;
                case 4:
                    m[v].fn.call(m[v].context, h, d, u);
                    break;
                default:
                    if (!x)
                        for (S = 1, x = new Array(g - 1); S < g; S++)
                            x[S - 1] = arguments[S];
                    m[v].fn.apply(m[v].context, x)
                }
        }
        return !0
    },
    o.prototype.on = function(c, h, d) {
        return r(this, c, h, d, !1)
    },
    o.prototype.once = function(c, h, d) {
        return r(this, c, h, d, !0)
    },
    o.prototype.removeListener = function(c, h, d, u) {
        var f = t ? t + c : c;
        if (!this._events[f])
            return this;
        if (!h)
            return a(this, f), this;
        var p = this._events[f];
        if (p.fn)
            p.fn === h && (!u || p.once) && (!d || p.context === d) && a(this, f);
        else {
            for (var A = 0, m = [], g = p.length; A < g; A++)
                (p[A].fn !== h || u && !p[A].once || d && p[A].context !== d) && m.push(p[A]);
            m.length ? this._events[f] = m.length === 1 ? m[0] : m : a(this, f)
        }
        return this
    },
    o.prototype.removeAllListeners = function(c) {
        var h;
        return c ? (h = t ? t + c : c, this._events[h] && a(this, h)) : (this._events = new s, this._eventsCount = 0), this
    },
    o.prototype.off = o.prototype.removeListener,
    o.prototype.addListener = o.prototype.on,
    o.prefixed = t,
    o.EventEmitter = o,
    i.exports = o
})(i_);
var h2 = i_.exports;
const u2 = t_(h2);
var Vp = {
    exports: {}
};
(function(i, e) {
    (function(t, s) {
        var n = "1.0.38",
            r = "",
            a = "?",
            o = "function",
            l = "undefined",
            c = "object",
            h = "string",
            d = "major",
            u = "model",
            f = "name",
            p = "type",
            A = "vendor",
            m = "version",
            g = "architecture",
            x = "console",
            v = "mobile",
            y = "tablet",
            S = "smarttv",
            w = "wearable",
            C = "embedded",
            M = 500,
            E = "Amazon",
            _ = "Apple",
            I = "ASUS",
            P = "BlackBerry",
            D = "Browser",
            L = "Chrome",
            z = "Edge",
            O = "Firefox",
            K = "Google",
            V = "Huawei",
            pe = "LG",
            xe = "Microsoft",
            Ae = "Motorola",
            Ye = "Opera",
            ke = "Samsung",
            J = "Sharp",
            ue = "Sony",
            Pe = "Xiaomi",
            Ee = "Zebra",
            it = "Facebook",
            Ze = "Chromium OS",
            Qe = "Mac OS",
            N = function(j, we) {
                var $ = {};
                for (var oe in j)
                    we[oe] && we[oe].length % 2 === 0 ? $[oe] = we[oe].concat(j[oe]) : $[oe] = j[oe];
                return $
            },
            lt = function(j) {
                for (var we = {}, $ = 0; $ < j.length; $++)
                    we[j[$].toUpperCase()] = j[$];
                return we
            },
            ht = function(j, we) {
                return typeof j === h ? St(we).indexOf(St(j)) !== -1 : !1
            },
            St = function(j) {
                return j.toLowerCase()
            },
            Ge = function(j) {
                return typeof j === h ? j.replace(/[^\d\.]/g, r).split(".")[0] : s
            },
            dt = function(j, we) {
                if (typeof j === h)
                    return j = j.replace(/^\s\s*/, r), typeof we === l ? j : j.substring(0, M)
            },
            tt = function(j, we) {
                for (var $ = 0, oe, qe, de, me, ye, Ne; $ < we.length && !ye;) {
                    var be = we[$],
                        st = we[$ + 1];
                    for (oe = qe = 0; oe < be.length && !ye && be[oe];)
                        if (ye = be[oe++].exec(j), ye)
                            for (de = 0; de < st.length; de++)
                                Ne = ye[++qe],
                                me = st[de],
                                typeof me === c && me.length > 0 ? me.length === 2 ? typeof me[1] == o ? this[me[0]] = me[1].call(this, Ne) : this[me[0]] = me[1] : me.length === 3 ? typeof me[1] === o && !(me[1].exec && me[1].test) ? this[me[0]] = Ne ? me[1].call(this, Ne, me[2]) : s : this[me[0]] = Ne ? Ne.replace(me[1], me[2]) : s : me.length === 4 && (this[me[0]] = Ne ? me[3].call(this, Ne.replace(me[1], me[2])) : s) : this[me] = Ne || s;
                    $ += 2
                }
            },
            $e = function(j, we) {
                for (var $ in we)
                    if (typeof we[$] === c && we[$].length > 0) {
                        for (var oe = 0; oe < we[$].length; oe++)
                            if (ht(we[$][oe], j))
                                return $ === a ? s : $
                    } else if (ht(we[$], j))
                        return $ === a ? s : $;
                return j
            },
            Xt = {
                "1.0": "/8",
                "1.2": "/1",
                "1.3": "/3",
                "2.0": "/412",
                "2.0.2": "/416",
                "2.0.3": "/417",
                "2.0.4": "/419",
                "?": "/"
            },
            R = {
                ME: "4.90",
                "NT 3.11": "NT3.51",
                "NT 4.0": "NT4.0",
                2e3: "NT 5.0",
                XP: ["NT 5.1", "NT 5.2"],
                Vista: "NT 6.0",
                7: "NT 6.1",
                8: "NT 6.2",
                "8.1": "NT 6.3",
                10: ["NT 6.4", "NT 10.0"],
                RT: "ARM"
            },
            T = {
                browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [m, [f, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [m, [f, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [f, m], [/opios[\/ ]+([\w\.]+)/i], [m, [f, Ye + " Mini"]], [/\bop(?:rg)?x\/([\w\.]+)/i], [m, [f, Ye + " GX"]], [/\bopr\/([\w\.]+)/i], [m, [f, Ye]], [/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i], [m, [f, "Baidu"]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [f, m], [/\bddg\/([\w\.]+)/i], [m, [f, "DuckDuckGo"]], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [m, [f, "UC" + D]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i, /micromessenger\/([\w\.]+)/i], [m, [f, "WeChat"]], [/konqueror\/([\w\.]+)/i], [m, [f, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [m, [f, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [m, [f, "Yandex"]], [/slbrowser\/([\w\.]+)/i], [m, [f, "Smart Lenovo " + D]], [/(avast|avg)\/([\w\.]+)/i], [[f, /(.+)/, "$1 Secure " + D], m], [/\bfocus\/([\w\.]+)/i], [m, [f, O + " Focus"]], [/\bopt\/([\w\.]+)/i], [m, [f, Ye + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [m, [f, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [m, [f, "Dolphin"]], [/coast\/([\w\.]+)/i], [m, [f, Ye + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [m, [f, "MIUI " + D]], [/fxios\/([-\w\.]+)/i], [m, [f, O]], [/\bqihu|(qi?ho?o?|360)browser/i], [[f, "360 " + D]], [/(oculus|sailfish|huawei|vivo)browser\/([\w\.]+)/i], [[f, /(.+)/, "$1 " + D], m], [/samsungbrowser\/([\w\.]+)/i], [m, [f, ke + " Internet"]], [/(comodo_dragon)\/([\w\.]+)/i], [[f, /_/g, " "], m], [/metasr[\/ ]?([\d\.]+)/i], [m, [f, "Sogou Explorer"]], [/(sogou)mo\w+\/([\d\.]+)/i], [[f, "Sogou Mobile"], m], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i], [f, m], [/(lbbrowser)/i, /\[(linkedin)app\]/i], [f], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[f, it], m], [/(Klarna)\/([\w\.]+)/i, /(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(alipay)client\/([\w\.]+)/i, /(twitter)(?:and| f.+e\/([\w\.]+))/i, /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i], [f, m], [/\bgsa\/([\w\.]+) .*safari\//i], [m, [f, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [m, [f, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [m, [f, L + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[f, L + " WebView"], m], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [m, [f, "Android " + D]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [f, m], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [m, [f, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [m, f], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [f, [m, $e, Xt]], [/(webkit|khtml)\/([\w\.]+)/i], [f, m], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[f, "Netscape"], m], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [m, [f, O + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [f, m], [/(cobalt)\/([\w\.]+)/i], [f, [m, /master.|lts./, ""]]],
                cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[g, "amd64"]], [/(ia32(?=;))/i], [[g, St]], [/((?:i[346]|x)86)[;\)]/i], [[g, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[g, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[g, "armhf"]], [/windows (ce|mobile); ppc;/i], [[g, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[g, /ower/, r, St]], [/(sun4\w)[;\)]/i], [[g, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[g, St]]],
                device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [u, [A, ke], [p, y]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [u, [A, ke], [p, v]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [u, [A, _], [p, v]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [u, [A, _], [p, y]], [/(macintosh);/i], [u, [A, _]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [u, [A, J], [p, v]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [u, [A, V], [p, y]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [u, [A, V], [p, v]], [/\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[u, /_/g, " "], [A, Pe], [p, v]], [/oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i, /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[u, /_/g, " "], [A, Pe], [p, y]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [u, [A, "OPPO"], [p, v]], [/\b(opd2\d{3}a?) bui/i], [u, [A, "OPPO"], [p, y]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [u, [A, "Vivo"], [p, v]], [/\b(rmx[1-3]\d{3})(?: bui|;|\))/i], [u, [A, "Realme"], [p, v]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [u, [A, Ae], [p, v]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [u, [A, Ae], [p, y]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [u, [A, pe], [p, y]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [u, [A, pe], [p, v]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [u, [A, "Lenovo"], [p, y]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[u, /_/g, " "], [A, "Nokia"], [p, v]], [/(pixel c)\b/i], [u, [A, K], [p, y]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [u, [A, K], [p, v]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [u, [A, ue], [p, v]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[u, "Xperia Tablet"], [A, ue], [p, y]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [u, [A, "OnePlus"], [p, v]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [u, [A, E], [p, y]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[u, /(.+)/g, "Fire Phone $1"], [A, E], [p, v]], [/(playbook);[-\w\),; ]+(rim)/i], [u, A, [p, y]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [u, [A, P], [p, v]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [u, [A, I], [p, y]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [u, [A, I], [p, v]], [/(nexus 9)/i], [u, [A, "HTC"], [p, y]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [A, [u, /_/g, " "], [p, v]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [u, [A, "Acer"], [p, y]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [u, [A, "Meizu"], [p, v]], [/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i], [u, [A, "Ulefone"], [p, v]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [A, u, [p, v]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [A, u, [p, y]], [/(surface duo)/i], [u, [A, xe], [p, y]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [u, [A, "Fairphone"], [p, v]], [/(u304aa)/i], [u, [A, "AT&T"], [p, v]], [/\bsie-(\w*)/i], [u, [A, "Siemens"], [p, v]], [/\b(rct\w+) b/i], [u, [A, "RCA"], [p, y]], [/\b(venue[\d ]{2,7}) b/i], [u, [A, "Dell"], [p, y]], [/\b(q(?:mv|ta)\w+) b/i], [u, [A, "Verizon"], [p, y]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [u, [A, "Barnes & Noble"], [p, y]], [/\b(tm\d{3}\w+) b/i], [u, [A, "NuVision"], [p, y]], [/\b(k88) b/i], [u, [A, "ZTE"], [p, y]], [/\b(nx\d{3}j) b/i], [u, [A, "ZTE"], [p, v]], [/\b(gen\d{3}) b.+49h/i], [u, [A, "Swiss"], [p, v]], [/\b(zur\d{3}) b/i], [u, [A, "Swiss"], [p, y]], [/\b((zeki)?tb.*\b) b/i], [u, [A, "Zeki"], [p, y]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[A, "Dragon Touch"], u, [p, y]], [/\b(ns-?\w{0,9}) b/i], [u, [A, "Insignia"], [p, y]], [/\b((nxa|next)-?\w{0,9}) b/i], [u, [A, "NextBook"], [p, y]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[A, "Voice"], u, [p, v]], [/\b(lvtel\-)?(v1[12]) b/i], [[A, "LvTel"], u, [p, v]], [/\b(ph-1) /i], [u, [A, "Essential"], [p, v]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [u, [A, "Envizen"], [p, y]], [/\b(trio[-\w\. ]+) b/i], [u, [A, "MachSpeed"], [p, y]], [/\btu_(1491) b/i], [u, [A, "Rotor"], [p, y]], [/(shield[\w ]+) b/i], [u, [A, "Nvidia"], [p, y]], [/(sprint) (\w+)/i], [A, u, [p, v]], [/(kin\.[onetw]{3})/i], [[u, /\./g, " "], [A, xe], [p, v]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [u, [A, Ee], [p, y]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [u, [A, Ee], [p, v]], [/smart-tv.+(samsung)/i], [A, [p, S]], [/hbbtv.+maple;(\d+)/i], [[u, /^/, "SmartTV"], [A, ke], [p, S]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[A, pe], [p, S]], [/(apple) ?tv/i], [A, [u, _ + " TV"], [p, S]], [/crkey/i], [[u, L + "cast"], [A, K], [p, S]], [/droid.+aft(\w+)( bui|\))/i], [u, [A, E], [p, S]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [u, [A, J], [p, S]], [/(bravia[\w ]+)( bui|\))/i], [u, [A, ue], [p, S]], [/(mitv-\w{5}) bui/i], [u, [A, Pe], [p, S]], [/Hbbtv.*(technisat) (.*);/i], [A, u, [p, S]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[A, dt], [u, dt], [p, S]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[p, S]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [A, u, [p, x]], [/droid.+; (shield) bui/i], [u, [A, "Nvidia"], [p, x]], [/(playstation [345portablevi]+)/i], [u, [A, ue], [p, x]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [u, [A, xe], [p, x]], [/((pebble))app/i], [A, u, [p, w]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [u, [A, _], [p, w]], [/droid.+; (glass) \d/i], [u, [A, K], [p, w]], [/droid.+; (wt63?0{2,3})\)/i], [u, [A, Ee], [p, w]], [/(quest( \d| pro)?)/i], [u, [A, it], [p, w]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [A, [p, C]], [/(aeobc)\b/i], [u, [A, E], [p, C]], [/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i], [u, [p, v]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [u, [p, y]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[p, y]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[p, v]], [/(android[-\w\. ]{0,9});.+buil/i], [u, [A, "Generic"]]],
                engine: [[/windows.+ edge\/([\w\.]+)/i], [m, [f, z + "HTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [m, [f, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [f, m], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [m, f]],
                os: [[/microsoft (windows) (vista|xp)/i], [f, m], [/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i], [f, [m, $e, R]], [/windows nt 6\.2; (arm)/i, /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i, /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[m, $e, R], [f, "Windows"]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[m, /_/g, "."], [f, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[f, Qe], [m, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [m, f], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [f, m], [/\(bb(10);/i], [m, [f, P]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [m, [f, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [m, [f, O + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [m, [f, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [m, [f, "watchOS"]], [/crkey\/([\d\.]+)/i], [m, [f, L + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[f, Ze], m], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [f, m], [/(sunos) ?([\w\.\d]*)/i], [[f, "Solaris"], m], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [f, m]]
            },
            W = function(j, we) {
                if (typeof j === c && (we = j, j = s), !(this instanceof W))
                    return new W(j, we).getResult();
                var $ = typeof t !== l && t.navigator ? t.navigator : s,
                    oe = j || ($ && $.userAgent ? $.userAgent : r),
                    qe = $ && $.userAgentData ? $.userAgentData : s,
                    de = we ? N(T, we) : T,
                    me = $ && $.userAgent == oe;
                return this.getBrowser = function() {
                    var ye = {};
                    return ye[f] = s, ye[m] = s, tt.call(ye, oe, de.browser), ye[d] = Ge(ye[m]), me && $ && $.brave && typeof $.brave.isBrave == o && (ye[f] = "Brave"), ye
                }, this.getCPU = function() {
                    var ye = {};
                    return ye[g] = s, tt.call(ye, oe, de.cpu), ye
                }, this.getDevice = function() {
                    var ye = {};
                    return ye[A] = s, ye[u] = s, ye[p] = s, tt.call(ye, oe, de.device), me && !ye[p] && qe && qe.mobile && (ye[p] = v), me && ye[u] == "Macintosh" && $ && typeof $.standalone !== l && $.maxTouchPoints && $.maxTouchPoints > 2 && (ye[u] = "iPad", ye[p] = y), ye
                }, this.getEngine = function() {
                    var ye = {};
                    return ye[f] = s, ye[m] = s, tt.call(ye, oe, de.engine), ye
                }, this.getOS = function() {
                    var ye = {};
                    return ye[f] = s, ye[m] = s, tt.call(ye, oe, de.os), me && !ye[f] && qe && qe.platform && qe.platform != "Unknown" && (ye[f] = qe.platform.replace(/chrome os/i, Ze).replace(/macos/i, Qe)), ye
                }, this.getResult = function() {
                    return {
                        ua: this.getUA(),
                        browser: this.getBrowser(),
                        engine: this.getEngine(),
                        os: this.getOS(),
                        device: this.getDevice(),
                        cpu: this.getCPU()
                    }
                }, this.getUA = function() {
                    return oe
                }, this.setUA = function(ye) {
                    return oe = typeof ye === h && ye.length > M ? dt(ye, M) : ye, this
                }, this.setUA(oe), this
            };
        W.VERSION = n,
        W.BROWSER = lt([f, m, d]),
        W.CPU = lt([g]),
        W.DEVICE = lt([u, A, p, x, v, S, y, w, C]),
        W.ENGINE = W.OS = lt([f, m]),
        i.exports && (e = i.exports = W),
        e.UAParser = W;
        var se = typeof t !== l && (t.jQuery || t.Zepto);
        if (se && !se.ua) {
            var ce = new W;
            se.ua = ce.getResult(),
            se.ua.get = function() {
                return ce.getUA()
            },
            se.ua.set = function(j) {
                ce.setUA(j);
                var we = ce.getResult();
                for (var $ in we)
                    se.ua[$] = we[$]
            }
        }
    })(typeof window == "object" ? window : c2)
})(Vp, Vp.exports);
var d2 = Vp.exports;
const f2 = t_(d2); /**
 * postprocessing v6.35.5 build Sat Jun 01 2024
 * https://github.com/pmndrs/postprocessing
 * Copyright 2015-2024 Raoul van Rüschen
 * @license Zlib
 */




var If = 1 / 1e3,
    p2 = 1e3,
    m2 = class {
        constructor()
        {
            this.startTime = performance.now(),
            this.previousTime = 0,
            this.currentTime = 0,
            this._delta = 0,
            this._elapsed = 0,
            this._fixedDelta = 1e3 / 60,
            this.timescale = 1,
            this.useFixedDelta = !1,
            this._autoReset = !1
        }
        get autoReset()
        {
            return this._autoReset
        }
        set autoReset(i)
        {
            typeof document < "u" && document.hidden !== void 0 && (i ? document.addEventListener("visibilitychange", this) : document.removeEventListener("visibilitychange", this), this._autoReset = i)
        }
        get delta()
        {
            return this._delta * If
        }
        get fixedDelta()
        {
            return this._fixedDelta * If
        }
        set fixedDelta(i)
        {
            this._fixedDelta = i * p2
        }
        get elapsed()
        {
            return this._elapsed * If
        }
        update(i)
        {
            this.useFixedDelta ? this._delta = this.fixedDelta : (this.previousTime = this.currentTime, this.currentTime = (i !== void 0 ? i : performance.now()) - this.startTime, this._delta = this.currentTime - this.previousTime),
            this._delta *= this.timescale,
            this._elapsed += this._delta
        }
        reset()
        {
            this._delta = 0,
            this._elapsed = 0,
            this.currentTime = performance.now() - this.startTime
        }
        getDelta()
        {
            return this.delta
        }
        getElapsed()
        {
            return this.elapsed
        }
        handleEvent(i)
        {
            document.hidden || (this.currentTime = performance.now() - this.startTime)
        }
        dispose()
        {
            this.autoReset = !1
        }
    }
    ,
    A2 = new LA,
    Yn = null;
function g2() {
    if (Yn === null) {
        const i = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
            e = new Float32Array([0, 0, 2, 0, 0, 2]);
        Yn = new ot,
        Yn.setAttribute !== void 0 ? (Yn.setAttribute("position", new We(i, 3)), Yn.setAttribute("uv", new We(e, 2))) : (Yn.addAttribute("position", new We(i, 3)), Yn.addAttribute("uv", new We(e, 2)))
    }
    return Yn
}
var gs = class s_ {
        constructor(e="Pass", t=new No, s=A2)
        {
            this.name = e,
            this.renderer = null,
            this.scene = t,
            this.camera = s,
            this.screen = null,
            this.rtt = !0,
            this.needsSwap = !0,
            this.needsDepthTexture = !1,
            this.enabled = !0
        }
        get renderToScreen()
        {
            return !this.rtt
        }
        set renderToScreen(e)
        {
            if (this.rtt === e) {
                const t = this.fullscreenMaterial;
                t !== null && (t.needsUpdate = !0),
                this.rtt = !e
            }
        }
        set mainScene(e) {}
        set mainCamera(e) {}
        setRenderer(e)
        {
            this.renderer = e
        }
        isEnabled()
        {
            return this.enabled
        }
        setEnabled(e)
        {
            this.enabled = e
        }
        get fullscreenMaterial()
        {
            return this.screen !== null ? this.screen.material : null
        }
        set fullscreenMaterial(e)
        {
            let t = this.screen;
            t !== null ? t.material = e : (t = new Ce(g2(), e), t.frustumCulled = !1, this.scene === null && (this.scene = new No), this.scene.add(t), this.screen = t)
        }
        getFullscreenMaterial()
        {
            return this.fullscreenMaterial
        }
        setFullscreenMaterial(e)
        {
            this.fullscreenMaterial = e
        }
        getDepthTexture()
        {
            return null
        }
        setDepthTexture(e, t=ms) {}
        render(e, t, s, n, r)
        {
            throw new Error("Render method not implemented!")
        }
        setSize(e, t) {}
        initialize(e, t, s) {}
        dispose()
        {
            for (const e of Object.keys(this)) {
                const t = this[e];
                (t instanceof vt || t instanceof fs || t instanceof Rt || t instanceof s_) && this[e].dispose()
            }
        }
    }
    ,
    v2 = class  extends gs{
        constructor()
        {
            super("ClearMaskPass", null, null),
            this.needsSwap = !1
        }
        render(i, e, t, s, n)
        {
            const r = i.state.buffers.stencil;
            r.setLocked(!1),
            r.setTest(!1)
        }
    }
    ,
    x2 = Number(Aa.replace(/\D+/g, ""));
function Ko(i) {
    return x2 < 154 ? i.replace("colorspace_fragment", "encodings_fragment") : i
}
var y2 = `#include <common>
    #include <dithering_pars_fragment>
    #ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D inputBuffer;
    #else
    uniform lowp sampler2D inputBuffer;
    #endif
    uniform float opacity;varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);gl_FragColor=opacity*texel;
    #include <colorspace_fragment>
    #include <dithering_fragment>
    }`,
    va = "varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}",
    XA = class  extends fe{
        constructor()
        {
            super({
                name: "CopyMaterial",
                uniforms: {
                    inputBuffer: new Me(null),
                    opacity: new Me(1)
                },
                blending: qt,
                toneMapped: !1,
                depthWrite: !1,
                depthTest: !1,
                fragmentShader: y2,
                vertexShader: va
            }),
            this.fragmentShader = Ko(this.fragmentShader)
        }
        set inputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        setInputBuffer(i)
        {
            this.uniforms.inputBuffer.value = i
        }
        getOpacity(i)
        {
            return this.uniforms.opacity.value
        }
        setOpacity(i)
        {
            this.uniforms.opacity.value = i
        }
    }
    ,
    _2 = class  extends gs{
        constructor(i, e=!0)
        {
            super("CopyPass"),
            this.fullscreenMaterial = new XA,
            this.needsSwap = !1,
            this.renderTarget = i,
            i === void 0 && (this.renderTarget = new vt(1, 1, {
                minFilter: _t,
                magFilter: _t,
                stencilBuffer: !1,
                depthBuffer: !1
            }), this.renderTarget.texture.name = "CopyPass.Target"),
            this.autoResize = e
        }
        get resize()
        {
            return this.autoResize
        }
        set resize(i)
        {
            this.autoResize = i
        }
        get texture()
        {
            return this.renderTarget.texture
        }
        getTexture()
        {
            return this.renderTarget.texture
        }
        setAutoResizeEnabled(i)
        {
            this.autoResize = i
        }
        render(i, e, t, s, n)
        {
            this.fullscreenMaterial.inputBuffer = e.texture,
            i.setRenderTarget(this.renderToScreen ? null : this.renderTarget),
            i.render(this.scene, this.camera)
        }
        setSize(i, e)
        {
            this.autoResize && this.renderTarget.setSize(i, e)
        }
        initialize(i, e, t)
        {
            t !== void 0 && (this.renderTarget.texture.type = t, t !== Ct ? this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1" : i !== null && i.outputColorSpace === Ve && (this.renderTarget.texture.colorSpace = Ve))
        }
    }
    ,
    M0 = new Z,
    Ic = class  extends gs{
        constructor(i=!0, e=!0, t=!1)
        {
            super("ClearPass", null, null),
            this.needsSwap = !1,
            this.color = i,
            this.depth = e,
            this.stencil = t,
            this.overrideClearColor = null,
            this.overrideClearAlpha = -1
        }
        setClearFlags(i, e, t)
        {
            this.color = i,
            this.depth = e,
            this.stencil = t
        }
        getOverrideClearColor()
        {
            return this.overrideClearColor
        }
        setOverrideClearColor(i)
        {
            this.overrideClearColor = i
        }
        getOverrideClearAlpha()
        {
            return this.overrideClearAlpha
        }
        setOverrideClearAlpha(i)
        {
            this.overrideClearAlpha = i
        }
        render(i, e, t, s, n)
        {
            const r = this.overrideClearColor,
                a = this.overrideClearAlpha,
                o = i.getClearAlpha(),
                l = r !== null,
                c = a >= 0;
            l ? (i.getClearColor(M0), i.setClearColor(r, c ? a : o)) : c && i.setClearAlpha(a),
            i.setRenderTarget(this.renderToScreen ? null : e),
            i.clear(this.color, this.depth, this.stencil),
            l ? i.setClearColor(M0, o) : c && i.setClearAlpha(o)
        }
    }
    ,
    w2 = class  extends gs{
        constructor(i, e)
        {
            super("MaskPass", i, e),
            this.needsSwap = !1,
            this.clearPass = new Ic(!1, !1, !0),
            this.inverse = !1
        }
        set mainScene(i)
        {
            this.scene = i
        }
        set mainCamera(i)
        {
            this.camera = i
        }
        get inverted()
        {
            return this.inverse
        }
        set inverted(i)
        {
            this.inverse = i
        }
        get clear()
        {
            return this.clearPass.enabled
        }
        set clear(i)
        {
            this.clearPass.enabled = i
        }
        getClearPass()
        {
            return this.clearPass
        }
        isInverted()
        {
            return this.inverted
        }
        setInverted(i)
        {
            this.inverted = i
        }
        render(i, e, t, s, n)
        {
            const r = i.getContext(),
                a = i.state.buffers,
                o = this.scene,
                l = this.camera,
                c = this.clearPass,
                h = this.inverted ? 0 : 1,
                d = 1 - h;
            a.color.setMask(!1),
            a.depth.setMask(!1),
            a.color.setLocked(!0),
            a.depth.setLocked(!0),
            a.stencil.setTest(!0),
            a.stencil.setOp(r.REPLACE, r.REPLACE, r.REPLACE),
            a.stencil.setFunc(r.ALWAYS, h, 4294967295),
            a.stencil.setClear(d),
            a.stencil.setLocked(!0),
            this.clearPass.enabled && (this.renderToScreen ? c.render(i, null) : (c.render(i, e), c.render(i, t))),
            this.renderToScreen ? (i.setRenderTarget(null), i.render(o, l)) : (i.setRenderTarget(e), i.render(o, l), i.setRenderTarget(t), i.render(o, l)),
            a.color.setLocked(!1),
            a.depth.setLocked(!1),
            a.stencil.setLocked(!1),
            a.stencil.setFunc(r.EQUAL, 1, 4294967295),
            a.stencil.setOp(r.KEEP, r.KEEP, r.KEEP),
            a.stencil.setLocked(!0)
        }
    }
    ,
    E2 = class {
        constructor(i=null, {depthBuffer: e=!0, stencilBuffer: t=!1, multisampling: s=0, frameBufferType: n}={})
        {
            this.renderer = null,
            this.inputBuffer = this.createBuffer(e, t, n, s),
            this.outputBuffer = this.inputBuffer.clone(),
            this.copyPass = new _2,
            this.depthTexture = null,
            this.passes = [],
            this.timer = new m2,
            this.autoRenderToScreen = !0,
            this.setRenderer(i)
        }
        get multisampling()
        {
            return this.inputBuffer.samples || 0
        }
        set multisampling(i)
        {
            const e = this.inputBuffer,
                t = this.multisampling;
            t > 0 && i > 0 ? (this.inputBuffer.samples = i, this.outputBuffer.samples = i, this.inputBuffer.dispose(), this.outputBuffer.dispose()) : t !== i && (this.inputBuffer.dispose(), this.outputBuffer.dispose(), this.inputBuffer = this.createBuffer(e.depthBuffer, e.stencilBuffer, e.texture.type, i), this.inputBuffer.depthTexture = this.depthTexture, this.outputBuffer = this.inputBuffer.clone())
        }
        getTimer()
        {
            return this.timer
        }
        getRenderer()
        {
            return this.renderer
        }
        setRenderer(i)
        {
            if (this.renderer = i, i !== null) {
                const e = i.getSize(new H),
                    t = i.getContext().getContextAttributes().alpha,
                    s = this.inputBuffer.texture.type;
                s === Ct && i.outputColorSpace === Ve && (this.inputBuffer.texture.colorSpace = Ve, this.outputBuffer.texture.colorSpace = Ve, this.inputBuffer.dispose(), this.outputBuffer.dispose()),
                i.autoClear = !1,
                this.setSize(e.width, e.height);
                for (const n of this.passes)
                    n.initialize(i, t, s)
            }
        }
        replaceRenderer(i, e=!0)
        {
            const t = this.renderer,
                s = t.domElement.parentNode;
            return this.setRenderer(i), e && s !== null && (s.removeChild(t.domElement), s.appendChild(i.domElement)), t
        }
        createDepthTexture()
        {
            const i = this.depthTexture = new Fo;
            return this.inputBuffer.depthTexture = i, this.inputBuffer.dispose(), this.inputBuffer.stencilBuffer ? (i.format = ua, i.type = ha) : i.type = ca, i
        }
        deleteDepthTexture()
        {
            if (this.depthTexture !== null) {
                this.depthTexture.dispose(),
                this.depthTexture = null,
                this.inputBuffer.depthTexture = null,
                this.inputBuffer.dispose();
                for (const i of this.passes)
                    i.setDepthTexture(null)
            }
        }
        createBuffer(i, e, t, s)
        {
            const n = this.renderer,
                r = n === null ? new H : n.getDrawingBufferSize(new H),
                a = {
                    minFilter: _t,
                    magFilter: _t,
                    stencilBuffer: e,
                    depthBuffer: i,
                    type: t
                },
                o = new vt(r.width, r.height, a);
            return s > 0 && (o.ignoreDepthForMultisampleCopy = !1, o.samples = s), t === Ct && n !== null && n.outputColorSpace === Ve && (o.texture.colorSpace = Ve), o.texture.name = "EffectComposer.Buffer", o.texture.generateMipmaps = !1, o
        }
        setMainScene(i)
        {
            for (const e of this.passes)
                e.mainScene = i
        }
        setMainCamera(i)
        {
            for (const e of this.passes)
                e.mainCamera = i
        }
        addPass(i, e)
        {
            const t = this.passes,
                s = this.renderer,
                n = s.getDrawingBufferSize(new H),
                r = s.getContext().getContextAttributes().alpha,
                a = this.inputBuffer.texture.type;
            if (i.setRenderer(s), i.setSize(n.width, n.height), i.initialize(s, r, a), this.autoRenderToScreen && (t.length > 0 && (t[t.length - 1].renderToScreen = !1), i.renderToScreen && (this.autoRenderToScreen = !1)), e !== void 0 ? t.splice(e, 0, i) : t.push(i), this.autoRenderToScreen && (t[t.length - 1].renderToScreen = !0), i.needsDepthTexture || this.depthTexture !== null)
                if (this.depthTexture === null) {
                    const o = this.createDepthTexture();
                    for (i of t)
                        i.setDepthTexture(o)
                } else
                    i.setDepthTexture(this.depthTexture)
        }
        removePass(i)
        {
            const e = this.passes,
                t = e.indexOf(i);
            if (t !== -1 && e.splice(t, 1).length > 0) {
                if (this.depthTexture !== null) {
                    const r = (o, l) => o || l.needsDepthTexture;
                    e.reduce(r, !1) || (i.getDepthTexture() === this.depthTexture && i.setDepthTexture(null), this.deleteDepthTexture())
                }
                this.autoRenderToScreen && t === e.length && (i.renderToScreen = !1, e.length > 0 && (e[e.length - 1].renderToScreen = !0))
            }
        }
        removeAllPasses()
        {
            const i = this.passes;
            this.deleteDepthTexture(),
            i.length > 0 && (this.autoRenderToScreen && (i[i.length - 1].renderToScreen = !1), this.passes = [])
        }
        render(i)
        {
            const e = this.renderer,
                t = this.copyPass;
            let s = this.inputBuffer,
                n = this.outputBuffer,
                r = !1,
                a,
                o,
                l;
            i === void 0 && (this.timer.update(), i = this.timer.getDelta());
            for (const c of this.passes)
                c.enabled && (c.render(e, s, n, i, r), c.needsSwap && (r && (t.renderToScreen = c.renderToScreen, a = e.getContext(), o = e.state.buffers.stencil, o.setFunc(a.NOTEQUAL, 1, 4294967295), t.render(e, s, n, i, r), o.setFunc(a.EQUAL, 1, 4294967295)), l = s, s = n, n = l), c instanceof w2 ? r = !0 : c instanceof v2 && (r = !1))
        }
        setSize(i, e, t)
        {
            const s = this.renderer,
                n = s.getSize(new H);
            (i === void 0 || e === void 0) && (i = n.width, e = n.height),
            (n.width !== i || n.height !== e) && s.setSize(i, e, t);
            const r = s.getDrawingBufferSize(new H);
            this.inputBuffer.setSize(r.width, r.height),
            this.outputBuffer.setSize(r.width, r.height);
            for (const a of this.passes)
                a.setSize(r.width, r.height)
        }
        reset()
        {
            this.dispose(),
            this.autoRenderToScreen = !0
        }
        dispose()
        {
            for (const i of this.passes)
                i.dispose();
            this.passes = [],
            this.inputBuffer !== null && this.inputBuffer.dispose(),
            this.outputBuffer !== null && this.outputBuffer.dispose(),
            this.deleteDepthTexture(),
            this.copyPass.dispose(),
            this.timer.dispose()
        }
    }
    ,
    Is = {
        NONE: 0,
        DEPTH: 1,
        CONVOLUTION: 2
    },
    At = {
        FRAGMENT_HEAD: "FRAGMENT_HEAD",
        FRAGMENT_MAIN_UV: "FRAGMENT_MAIN_UV",
        FRAGMENT_MAIN_IMAGE: "FRAGMENT_MAIN_IMAGE",
        VERTEX_HEAD: "VERTEX_HEAD",
        VERTEX_MAIN_SUPPORT: "VERTEX_MAIN_SUPPORT"
    },
    C2 = class {
        constructor()
        {
            this.shaderParts = new Map([[At.FRAGMENT_HEAD, null], [At.FRAGMENT_MAIN_UV, null], [At.FRAGMENT_MAIN_IMAGE, null], [At.VERTEX_HEAD, null], [At.VERTEX_MAIN_SUPPORT, null]]),
            this.defines = new Map,
            this.uniforms = new Map,
            this.blendModes = new Map,
            this.extensions = new Set,
            this.attributes = Is.NONE,
            this.varyings = new Set,
            this.uvTransformation = !1,
            this.readDepth = !1,
            this.colorSpace = oi
        }
    }
    ;
function b0(i) {
    let e;
    if (i === 0)
        e = new Float64Array(0);
    else if (i === 1)
        e = new Float64Array([1]);
    else if (i > 1) {
        let t = new Float64Array(i),
            s = new Float64Array(i);
        for (let n = 1; n <= i; ++n) {
            for (let r = 0; r < n; ++r)
                s[r] = r === 0 || r === n - 1 ? 1 : t[r - 1] + t[r];
            e = s,
            s = t,
            t = e
        }
    }
    return e
}
