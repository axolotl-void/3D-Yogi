class ot extends hn {
    constructor()
    {
        super(),
        this.isBufferGeometry = !0,
        Object.defineProperty(this, "id", {
            value: l1++
        }),
        this.uuid = Hs(),
        this.name = "",
        this.type = "BufferGeometry",
        this.index = null,
        this.attributes = {},
        this.morphAttributes = {},
        this.morphTargetsRelative = !1,
        this.groups = [],
        this.boundingBox = null,
        this.boundingSphere = null,
        this.drawRange = {
            start: 0,
            count: 1 / 0
        },
        this.userData = {}
    }
    getIndex()
    {
        return this.index
    }
    setIndex(e)
    {
        return Array.isArray(e) ? this.index = new (My(e) ? Py : By)(e, 1) : this.index = e, this
    }
    getAttribute(e)
    {
        return this.attributes[e]
    }
    setAttribute(e, t)
    {
        return this.attributes[e] = t, this
    }
    deleteAttribute(e)
    {
        return delete this.attributes[e], this
    }
    hasAttribute(e)
    {
        return this.attributes[e] !== void 0
    }
    addGroup(e, t, s=0)
    {
        this.groups.push({
            start: e,
            count: t,
            materialIndex: s
        })
    }
    clearGroups()
    {
        this.groups = []
    }
    setDrawRange(e, t)
    {
        this.drawRange.start = e,
        this.drawRange.count = t
    }
    applyMatrix4(e)
    {
        const t = this.attributes.position;
        t !== void 0 && (t.applyMatrix4(e), t.needsUpdate = !0);
        const s = this.attributes.normal;
        if (s !== void 0) {
            const r = new at().getNormalMatrix(e);
            s.applyNormalMatrix(r),
            s.needsUpdate = !0
        }
        const n = this.attributes.tangent;
        return n !== void 0 && (n.transformDirection(e), n.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this
    }
    applyQuaternion(e)
    {
        return xs.makeRotationFromQuaternion(e), this.applyMatrix4(xs), this
    }
    rotateX(e)
    {
        return xs.makeRotationX(e), this.applyMatrix4(xs), this
    }
    rotateY(e)
    {
        return xs.makeRotationY(e), this.applyMatrix4(xs), this
    }
    rotateZ(e)
    {
        return xs.makeRotationZ(e), this.applyMatrix4(xs), this
    }
    translate(e, t, s)
    {
        return xs.makeTranslation(e, t, s), this.applyMatrix4(xs), this
    }
    scale(e, t, s)
    {
        return xs.makeScale(e, t, s), this.applyMatrix4(xs), this
    }
    lookAt(e)
    {
        return lf.lookAt(e), lf.updateMatrix(), this.applyMatrix4(lf.matrix), this
    }
    center()
    {
        return this.computeBoundingBox(), this.boundingBox.getCenter(Da).negate(), this.translate(Da.x, Da.y, Da.z), this
    }
    setFromPoints(e)
    {
        const t = [];
        for (let s = 0, n = e.length; s < n; s++) {
            const r = e[s];
            t.push(r.x, r.y, r.z || 0)
        }
        return this.setAttribute("position", new nt(t, 3)), this
    }
    computeBoundingBox()
    {
        this.boundingBox === null && (this.boundingBox = new Vt);
        const e = this.attributes.position,
            t = this.morphAttributes.position;
        if (e && e.isGLBufferAttribute) {
            console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this),
            this.boundingBox.set(new b(-1 / 0, -1 / 0, -1 / 0), new b(1 / 0, 1 / 0, 1 / 0));
            return
        }
        if (e !== void 0) {
            if (this.boundingBox.setFromBufferAttribute(e), t)
                for (let s = 0, n = t.length; s < n; s++) {
                    const r = t[s];
                    ns.setFromBufferAttribute(r),
                    this.morphTargetsRelative ? (Ai.addVectors(this.boundingBox.min, ns.min), this.boundingBox.expandByPoint(Ai), Ai.addVectors(this.boundingBox.max, ns.max), this.boundingBox.expandByPoint(Ai)) : (this.boundingBox.expandByPoint(ns.min), this.boundingBox.expandByPoint(ns.max))
                }
        } else
            this.boundingBox.makeEmpty();
        (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this)
    }
    computeBoundingSphere()
    {
        this.boundingSphere === null && (this.boundingSphere = new bi);
        const e = this.attributes.position,
            t = this.morphAttributes.position;
        if (e && e.isGLBufferAttribute) {
            console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this),
            this.boundingSphere.set(new b, 1 / 0);
            return
        }
        if (e) {
            const s = this.boundingSphere.center;
            if (ns.setFromBufferAttribute(e), t)
                for (let r = 0, a = t.length; r < a; r++) {
                    const o = t[r];
                    sl.setFromBufferAttribute(o),
                    this.morphTargetsRelative ? (Ai.addVectors(ns.min, sl.min), ns.expandByPoint(Ai), Ai.addVectors(ns.max, sl.max), ns.expandByPoint(Ai)) : (ns.expandByPoint(sl.min), ns.expandByPoint(sl.max))
                }
            ns.getCenter(s);
            let n = 0;
            for (let r = 0, a = e.count; r < a; r++)
                Ai.fromBufferAttribute(e, r),
                n = Math.max(n, s.distanceToSquared(Ai));
            if (t)
                for (let r = 0, a = t.length; r < a; r++) {
                    const o = t[r],
                        l = this.morphTargetsRelative;
                    for (let c = 0, h = o.count; c < h; c++)
                        Ai.fromBufferAttribute(o, c),
                        l && (Da.fromBufferAttribute(e, c), Ai.add(Da)),
                        n = Math.max(n, s.distanceToSquared(Ai))
                }
            this.boundingSphere.radius = Math.sqrt(n),
            isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this)
        }
    }
    computeTangents()
    {
        const e = this.index,
            t = this.attributes;
        if (e === null || t.position === void 0 || t.normal === void 0 || t.uv === void 0) {
            console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
            return
        }
        const s = t.position,
            n = t.normal,
            r = t.uv;
        this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new We(new Float32Array(4 * s.count), 4));
        const a = this.getAttribute("tangent"),
            o = [],
            l = [];
        for (let M = 0; M < s.count; M++)
            o[M] = new b,
            l[M] = new b;
        const c = new b,
            h = new b,
            d = new b,
            u = new H,
            f = new H,
            p = new H,
            A = new b,
            m = new b;
        function g(M, E, _) {
            c.fromBufferAttribute(s, M),
            h.fromBufferAttribute(s, E),
            d.fromBufferAttribute(s, _),
            u.fromBufferAttribute(r, M),
            f.fromBufferAttribute(r, E),
            p.fromBufferAttribute(r, _),
            h.sub(c),
            d.sub(c),
            f.sub(u),
            p.sub(u);
            const I = 1 / (f.x * p.y - p.x * f.y);
            isFinite(I) && (A.copy(h).multiplyScalar(p.y).addScaledVector(d, -f.y).multiplyScalar(I), m.copy(d).multiplyScalar(f.x).addScaledVector(h, -p.x).multiplyScalar(I), o[M].add(A), o[E].add(A), o[_].add(A), l[M].add(m), l[E].add(m), l[_].add(m))
        }
        let x = this.groups;
        x.length === 0 && (x = [{
            start: 0,
            count: e.count
        }]);
        for (let M = 0, E = x.length; M < E; ++M) {
            const _ = x[M],
                I = _.start,
                P = _.count;
            for (let D = I, L = I + P; D < L; D += 3)
                g(e.getX(D + 0), e.getX(D + 1), e.getX(D + 2))
        }
        const v = new b,
            y = new b,
            S = new b,
            w = new b;
        function C(M) {
            S.fromBufferAttribute(n, M),
            w.copy(S);
            const E = o[M];
            v.copy(E),
            v.sub(S.multiplyScalar(S.dot(E))).normalize(),
            y.crossVectors(w, E);
            const I = y.dot(l[M]) < 0 ? -1 : 1;
            a.setXYZW(M, v.x, v.y, v.z, I)
        }
        for (let M = 0, E = x.length; M < E; ++M) {
            const _ = x[M],
                I = _.start,
                P = _.count;
            for (let D = I, L = I + P; D < L; D += 3)
                C(e.getX(D + 0)),
                C(e.getX(D + 1)),
                C(e.getX(D + 2))
        }
    }
    computeVertexNormals()
    {
        const e = this.index,
            t = this.getAttribute("position");
        if (t !== void 0) {
            let s = this.getAttribute("normal");
            if (s === void 0)
                s = new We(new Float32Array(t.count * 3), 3),
                this.setAttribute("normal", s);
            else
                for (let u = 0, f = s.count; u < f; u++)
                    s.setXYZ(u, 0, 0, 0);
            const n = new b,
                r = new b,
                a = new b,
                o = new b,
                l = new b,
                c = new b,
                h = new b,
                d = new b;
            if (e)
                for (let u = 0, f = e.count; u < f; u += 3) {
                    const p = e.getX(u + 0),
                        A = e.getX(u + 1),
                        m = e.getX(u + 2);
                    n.fromBufferAttribute(t, p),
                    r.fromBufferAttribute(t, A),
                    a.fromBufferAttribute(t, m),
                    h.subVectors(a, r),
                    d.subVectors(n, r),
                    h.cross(d),
                    o.fromBufferAttribute(s, p),
                    l.fromBufferAttribute(s, A),
                    c.fromBufferAttribute(s, m),
                    o.add(h),
                    l.add(h),
                    c.add(h),
                    s.setXYZ(p, o.x, o.y, o.z),
                    s.setXYZ(A, l.x, l.y, l.z),
                    s.setXYZ(m, c.x, c.y, c.z)
                }
            else
                for (let u = 0, f = t.count; u < f; u += 3)
                    n.fromBufferAttribute(t, u + 0),
                    r.fromBufferAttribute(t, u + 1),
                    a.fromBufferAttribute(t, u + 2),
                    h.subVectors(a, r),
                    d.subVectors(n, r),
                    h.cross(d),
                    s.setXYZ(u + 0, h.x, h.y, h.z),
                    s.setXYZ(u + 1, h.x, h.y, h.z),
                    s.setXYZ(u + 2, h.x, h.y, h.z);
            this.normalizeNormals(),
            s.needsUpdate = !0
        }
    }
    normalizeNormals()
    {
        const e = this.attributes.normal;
        for (let t = 0, s = e.count; t < s; t++)
            Ai.fromBufferAttribute(e, t),
            Ai.normalize(),
            e.setXYZ(t, Ai.x, Ai.y, Ai.z)
    }
    toNonIndexed()
    {
        function e(o, l) {
            const c = o.array,
                h = o.itemSize,
                d = o.normalized,
                u = new c.constructor(l.length * h);
            let f = 0,
                p = 0;
            for (let A = 0, m = l.length; A < m; A++) {
                o.isInterleavedBufferAttribute ? f = l[A] * o.data.stride + o.offset : f = l[A] * h;
                for (let g = 0; g < h; g++)
                    u[p++] = c[f++]
            }
            return new We(u, h, d)
        }
        if (this.index === null)
            return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
        const t = new ot,
            s = this.index.array,
            n = this.attributes;
        for (const o in n) {
            const l = n[o],
                c = e(l, s);
            t.setAttribute(o, c)
        }
        const r = this.morphAttributes;
        for (const o in r) {
            const l = [],
                c = r[o];
            for (let h = 0, d = c.length; h < d; h++) {
                const u = c[h],
                    f = e(u, s);
                l.push(f)
            }
            t.morphAttributes[o] = l
        }
        t.morphTargetsRelative = this.morphTargetsRelative;
        const a = this.groups;
        for (let o = 0, l = a.length; o < l; o++) {
            const c = a[o];
            t.addGroup(c.start, c.count, c.materialIndex)
        }
        return t
    }
    toJSON()
    {
        const e = {
            metadata: {
                version: 4.6,
                type: "BufferGeometry",
                generator: "BufferGeometry.toJSON"
            }
        };
        if (e.uuid = this.uuid, e.type = this.type, this.name !== "" && (e.name = this.name), Object.keys(this.userData).length > 0 && (e.userData = this.userData), this.parameters !== void 0) {
            const l = this.parameters;
            for (const c in l)
                l[c] !== void 0 && (e[c] = l[c]);
            return e
        }
        e.data = {
            attributes: {}
        };
        const t = this.index;
        t !== null && (e.data.index = {
            type: t.array.constructor.name,
            array: Array.prototype.slice.call(t.array)
        });
        const s = this.attributes;
        for (const l in s) {
            const c = s[l];
            e.data.attributes[l] = c.toJSON(e.data)
        }
        const n = {};
        let r = !1;
        for (const l in this.morphAttributes) {
            const c = this.morphAttributes[l],
                h = [];
            for (let d = 0, u = c.length; d < u; d++) {
                const f = c[d];
                h.push(f.toJSON(e.data))
            }
            h.length > 0 && (n[l] = h, r = !0)
        }
        r && (e.data.morphAttributes = n, e.data.morphTargetsRelative = this.morphTargetsRelative);
        const a = this.groups;
        a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
        const o = this.boundingSphere;
        return o !== null && (e.data.boundingSphere = {
            center: o.center.toArray(),
            radius: o.radius
        }), e
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
    copy(e)
    {
        this.index = null,
        this.attributes = {},
        this.morphAttributes = {},
        this.groups = [],
        this.boundingBox = null,
        this.boundingSphere = null;
        const t = {};
        this.name = e.name;
        const s = e.index;
        s !== null && this.setIndex(s.clone(t));
        const n = e.attributes;
        for (const c in n) {
            const h = n[c];
            this.setAttribute(c, h.clone(t))
        }
        const r = e.morphAttributes;
        for (const c in r) {
            const h = [],
                d = r[c];
            for (let u = 0, f = d.length; u < f; u++)
                h.push(d[u].clone(t));
            this.morphAttributes[c] = h
        }
        this.morphTargetsRelative = e.morphTargetsRelative;
        const a = e.groups;
        for (let c = 0, h = a.length; c < h; c++) {
            const d = a[c];
            this.addGroup(d.start, d.count, d.materialIndex)
        }
        const o = e.boundingBox;
        o !== null && (this.boundingBox = o.clone());
        const l = e.boundingSphere;
        return l !== null && (this.boundingSphere = l.clone()), this.drawRange.start = e.drawRange.start, this.drawRange.count = e.drawRange.count, this.userData = e.userData, this
    }
    dispose()
    {
        this.dispatchEvent({
            type: "dispose"
        })
    }
}
const Cv = new De,
    Ir = new Vo,
    Jc = new bi,
    Sv = new b,
    Ra = new b,
    Ua = new b,
    La = new b,
    cf = new b,
    jc = new b,
    Zc = new H,
    $c = new H,
    eh = new H,
    Mv = new b,
    bv = new b,
    Tv = new b,
    th = new b,
    ih = new b;
class Ce extends It {
    constructor(e=new ot, t=new or)
    {
        super(),
        this.isMesh = !0,
        this.type = "Mesh",
        this.geometry = e,
        this.material = t,
        this.updateMorphTargets()
    }
    copy(e, t)
    {
        return super.copy(e, t), e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this
    }
    updateMorphTargets()
    {
        const t = this.geometry.morphAttributes,
            s = Object.keys(t);
        if (s.length > 0) {
            const n = t[s[0]];
            if (n !== void 0) {
                this.morphTargetInfluences = [],
                this.morphTargetDictionary = {};
                for (let r = 0, a = n.length; r < a; r++) {
                    const o = n[r].name || String(r);
                    this.morphTargetInfluences.push(0),
                    this.morphTargetDictionary[o] = r
                }
            }
        }
    }
    getVertexPosition(e, t)
    {
        const s = this.geometry,
            n = s.attributes.position,
            r = s.morphAttributes.position,
            a = s.morphTargetsRelative;
        t.fromBufferAttribute(n, e);
        const o = this.morphTargetInfluences;
        if (r && o) {
            jc.set(0, 0, 0);
            for (let l = 0, c = r.length; l < c; l++) {
                const h = o[l],
                    d = r[l];
                h !== 0 && (cf.fromBufferAttribute(d, e), a ? jc.addScaledVector(cf, h) : jc.addScaledVector(cf.sub(t), h))
            }
            t.add(jc)
        }
        return t
    }
    raycast(e, t)
    {
        const s = this.geometry,
            n = this.material,
            r = this.matrixWorld;
        n !== void 0 && (s.boundingSphere === null && s.computeBoundingSphere(), Jc.copy(s.boundingSphere), Jc.applyMatrix4(r), Ir.copy(e.ray).recast(e.near), !(Jc.containsPoint(Ir.origin) === !1 && (Ir.intersectSphere(Jc, Sv) === null || Ir.origin.distanceToSquared(Sv) > (e.far - e.near) ** 2)) && (Cv.copy(r).invert(), Ir.copy(e.ray).applyMatrix4(Cv), !(s.boundingBox !== null && Ir.intersectsBox(s.boundingBox) === !1) && this._computeIntersections(e, t, Ir)))
    }
    _computeIntersections(e, t, s)
    {
        let n;
        const r = this.geometry,
            a = this.material,
            o = r.index,
            l = r.attributes.position,
            c = r.attributes.uv,
            h = r.attributes.uv1,
            d = r.attributes.normal,
            u = r.groups,
            f = r.drawRange;
        if (o !== null)
            if (Array.isArray(a))
                for (let p = 0, A = u.length; p < A; p++) {
                    const m = u[p],
                        g = a[m.materialIndex],
                        x = Math.max(m.start, f.start),
                        v = Math.min(o.count, Math.min(m.start + m.count, f.start + f.count));
                    for (let y = x, S = v; y < S; y += 3) {
                        const w = o.getX(y),
                            C = o.getX(y + 1),
                            M = o.getX(y + 2);
                        n = sh(this, g, e, s, c, h, d, w, C, M),
                        n && (n.faceIndex = Math.floor(y / 3), n.face.materialIndex = m.materialIndex, t.push(n))
                    }
                }
            else {
                const p = Math.max(0, f.start),
                    A = Math.min(o.count, f.start + f.count);
                for (let m = p, g = A; m < g; m += 3) {
                    const x = o.getX(m),
                        v = o.getX(m + 1),
                        y = o.getX(m + 2);
                    n = sh(this, a, e, s, c, h, d, x, v, y),
                    n && (n.faceIndex = Math.floor(m / 3), t.push(n))
                }
            }
        else if (l !== void 0)
            if (Array.isArray(a))
                for (let p = 0, A = u.length; p < A; p++) {
                    const m = u[p],
                        g = a[m.materialIndex],
                        x = Math.max(m.start, f.start),
                        v = Math.min(l.count, Math.min(m.start + m.count, f.start + f.count));
                    for (let y = x, S = v; y < S; y += 3) {
                        const w = y,
                            C = y + 1,
                            M = y + 2;
                        n = sh(this, g, e, s, c, h, d, w, C, M),
                        n && (n.faceIndex = Math.floor(y / 3), n.face.materialIndex = m.materialIndex, t.push(n))
                    }
                }
            else {
                const p = Math.max(0, f.start),
                    A = Math.min(l.count, f.start + f.count);
                for (let m = p, g = A; m < g; m += 3) {
                    const x = m,
                        v = m + 1,
                        y = m + 2;
                    n = sh(this, a, e, s, c, h, d, x, v, y),
                    n && (n.faceIndex = Math.floor(m / 3), t.push(n))
                }
            }
    }
}
function c1(i, e, t, s, n, r, a, o) {
    let l;
    if (e.side === ei ? l = s.intersectTriangle(a, r, n, !0, o) : l = s.intersectTriangle(n, r, a, e.side === es, o), l === null)
        return null;
    ih.copy(o),
    ih.applyMatrix4(i.matrixWorld);
    const c = t.ray.origin.distanceTo(ih);
    return c < t.near || c > t.far ? null : {
        distance: c,
        point: ih.clone(),
        object: i
    }
}
function sh(i, e, t, s, n, r, a, o, l, c) {
    i.getVertexPosition(o, Ra),
    i.getVertexPosition(l, Ua),
    i.getVertexPosition(c, La);
    const h = c1(i, e, t, s, Ra, Ua, La, th);
    if (h) {
        n && (Zc.fromBufferAttribute(n, o), $c.fromBufferAttribute(n, l), eh.fromBufferAttribute(n, c), h.uv = wi.getInterpolation(th, Ra, Ua, La, Zc, $c, eh, new H)),
        r && (Zc.fromBufferAttribute(r, o), $c.fromBufferAttribute(r, l), eh.fromBufferAttribute(r, c), h.uv1 = wi.getInterpolation(th, Ra, Ua, La, Zc, $c, eh, new H)),
        a && (Mv.fromBufferAttribute(a, o), bv.fromBufferAttribute(a, l), Tv.fromBufferAttribute(a, c), h.normal = wi.getInterpolation(th, Ra, Ua, La, Mv, bv, Tv, new b), h.normal.dot(s.direction) > 0 && h.normal.multiplyScalar(-1));
        const d = {
            a: o,
            b: l,
            c,
            normal: new b,
            materialIndex: 0
        };
        wi.getNormal(Ra, Ua, La, d.normal),
        h.face = d
    }
    return h
}
class Wo extends ot {
    constructor(e=1, t=1, s=1, n=1, r=1, a=1)
    {
        super(),
        this.type = "BoxGeometry",
        this.parameters = {
            width: e,
            height: t,
            depth: s,
            widthSegments: n,
            heightSegments: r,
            depthSegments: a
        };
        const o = this;
        n = Math.floor(n),
        r = Math.floor(r),
        a = Math.floor(a);
        const l = [],
            c = [],
            h = [],
            d = [];
        let u = 0,
            f = 0;
        p("z", "y", "x", -1, -1, s, t, e, a, r, 0),
        p("z", "y", "x", 1, -1, s, t, -e, a, r, 1),
        p("x", "z", "y", 1, 1, e, s, t, n, a, 2),
        p("x", "z", "y", 1, -1, e, s, -t, n, a, 3),
        p("x", "y", "z", 1, -1, e, t, s, n, r, 4),
        p("x", "y", "z", -1, -1, e, t, -s, n, r, 5),
        this.setIndex(l),
        this.setAttribute("position", new nt(c, 3)),
        this.setAttribute("normal", new nt(h, 3)),
        this.setAttribute("uv", new nt(d, 2));
        function p(A, m, g, x, v, y, S, w, C, M, E) {
            const _ = y / C,
                I = S / M,
                P = y / 2,
                D = S / 2,
                L = w / 2,
                z = C + 1,
                O = M + 1;
            let K = 0,
                V = 0;
            const pe = new b;
            for (let xe = 0; xe < O; xe++) {
                const Ae = xe * I - D;
                for (let Ye = 0; Ye < z; Ye++) {
                    const ke = Ye * _ - P;
                    pe[A] = ke * x,
                    pe[m] = Ae * v,
                    pe[g] = L,
                    c.push(pe.x, pe.y, pe.z),
                    pe[A] = 0,
                    pe[m] = 0,
                    pe[g] = w > 0 ? 1 : -1,
                    h.push(pe.x, pe.y, pe.z),
                    d.push(Ye / C),
                    d.push(1 - xe / M),
                    K += 1
                }
            }
            for (let xe = 0; xe < M; xe++)
                for (let Ae = 0; Ae < C; Ae++) {
                    const Ye = u + Ae + z * xe,
                        ke = u + Ae + z * (xe + 1),
                        J = u + (Ae + 1) + z * (xe + 1),
                        ue = u + (Ae + 1) + z * xe;
                    l.push(Ye, ke, ue),
                    l.push(ke, J, ue),
                    V += 6
                }
            o.addGroup(f, V, E),
            f += V,
            u += K
        }
    }
    copy(e)
    {
        return super.copy(e), this.parameters = Object.assign({}, e.parameters), this
    }
    static fromJSON(e)
    {
        return new Wo(e.width, e.height, e.depth, e.widthSegments, e.heightSegments, e.depthSegments)
    }
}
function Lo(i) {
    const e = {};
    for (const t in i) {
        e[t] = {};
        for (const s in i[t]) {
            const n = i[t][s];
            n && (n.isColor || n.isMatrix3 || n.isMatrix4 || n.isVector2 || n.isVector3 || n.isVector4 || n.isTexture || n.isQuaternion) ? n.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), e[t][s] = null) : e[t][s] = n.clone() : Array.isArray(n) ? e[t][s] = n.slice() : e[t][s] = n
        }
    }
    return e
}
function zi(i) {
    const e = {};
    for (let t = 0; t < i.length; t++) {
        const s = Lo(i[t]);
        for (const n in s)
            e[n] = s[n]
    }
    return e
}
function h1(i) {
    const e = [];
    for (let t = 0; t < i.length; t++)
        e.push(i[t].clone());
    return e
}
function Dy(i) {
    const e = i.getRenderTarget();
    return e === null ? i.outputColorSpace : e.isXRRenderTarget === !0 ? e.texture.colorSpace : mt.workingColorSpace
}
const UA = {
    clone: Lo,
    merge: zi
};
var u1 = `void main() {
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
    d1 = `void main() {
    	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
    }`;
class fe extends fs {
    constructor(e)
    {
        super(),
        this.isShaderMaterial = !0,
        this.type = "ShaderMaterial",
        this.defines = {},
        this.uniforms = {},
        this.uniformsGroups = [],
        this.vertexShader = u1,
        this.fragmentShader = d1,
        this.linewidth = 1,
        this.wireframe = !1,
        this.wireframeLinewidth = 1,
        this.fog = !1,
        this.lights = !1,
        this.clipping = !1,
        this.forceSinglePass = !0,
        this.extensions = {
            clipCullDistance: !1,
            multiDraw: !1
        },
        this.defaultAttributeValues = {
            color: [1, 1, 1],
            uv: [0, 0],
            uv1: [0, 0]
        },
        this.index0AttributeName = void 0,
        this.uniformsNeedUpdate = !1,
        this.glslVersion = null,
        e !== void 0 && this.setValues(e)
    }
    copy(e)
    {
        return super.copy(e), this.fragmentShader = e.fragmentShader, this.vertexShader = e.vertexShader, this.uniforms = Lo(e.uniforms), this.uniformsGroups = h1(e.uniformsGroups), this.defines = Object.assign({}, e.defines), this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.fog = e.fog, this.lights = e.lights, this.clipping = e.clipping, this.extensions = Object.assign({}, e.extensions), this.glslVersion = e.glslVersion, this
    }
    toJSON(e)
    {
        const t = super.toJSON(e);
        t.glslVersion = this.glslVersion,
        t.uniforms = {};
        for (const n in this.uniforms) {
            const a = this.uniforms[n].value;
            a && a.isTexture ? t.uniforms[n] = {
                type: "t",
                value: a.toJSON(e).uuid
            } : a && a.isColor ? t.uniforms[n] = {
                type: "c",
                value: a.getHex()
            } : a && a.isVector2 ? t.uniforms[n] = {
                type: "v2",
                value: a.toArray()
            } : a && a.isVector3 ? t.uniforms[n] = {
                type: "v3",
                value: a.toArray()
            } : a && a.isVector4 ? t.uniforms[n] = {
                type: "v4",
                value: a.toArray()
            } : a && a.isMatrix3 ? t.uniforms[n] = {
                type: "m3",
                value: a.toArray()
            } : a && a.isMatrix4 ? t.uniforms[n] = {
                type: "m4",
                value: a.toArray()
            } : t.uniforms[n] = {
                value: a
            }
        }
        Object.keys(this.defines).length > 0 && (t.defines = this.defines),
        t.vertexShader = this.vertexShader,
        t.fragmentShader = this.fragmentShader,
        t.lights = this.lights,
        t.clipping = this.clipping;
        const s = {};
        for (const n in this.extensions)
            this.extensions[n] === !0 && (s[n] = !0);
        return Object.keys(s).length > 0 && (t.extensions = s), t
    }
}
class LA extends It {
    constructor()
    {
        super(),
        this.isCamera = !0,
        this.type = "Camera",
        this.matrixWorldInverse = new De,
        this.projectionMatrix = new De,
        this.projectionMatrixInverse = new De,
        this.coordinateSystem = Tn
    }
    copy(e, t)
    {
        return super.copy(e, t), this.matrixWorldInverse.copy(e.matrixWorldInverse), this.projectionMatrix.copy(e.projectionMatrix), this.projectionMatrixInverse.copy(e.projectionMatrixInverse), this.coordinateSystem = e.coordinateSystem, this
    }
    getWorldDirection(e)
    {
        return super.getWorldDirection(e).negate()
    }
    updateMatrixWorld(e)
    {
        super.updateMatrixWorld(e),
        this.matrixWorldInverse.copy(this.matrixWorld).invert()
    }
    updateWorldMatrix(e, t)
    {
        super.updateWorldMatrix(e, t),
        this.matrixWorldInverse.copy(this.matrixWorld).invert()
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
}
const Vn = new b,
    Iv = new H,
    Bv = new H;
class gi extends LA {
    constructor(e=50, t=1, s=.1, n=2e3)
    {
        super(),
        this.isPerspectiveCamera = !0,
        this.type = "PerspectiveCamera",
        this.fov = e,
        this.zoom = 1,
        this.near = s,
        this.far = n,
        this.focus = 10,
        this.aspect = t,
        this.view = null,
        this.filmGauge = 35,
        this.filmOffset = 0,
        this.updateProjectionMatrix()
    }
    copy(e, t)
    {
        return super.copy(e, t), this.fov = e.fov, this.zoom = e.zoom, this.near = e.near, this.far = e.far, this.focus = e.focus, this.aspect = e.aspect, this.view = e.view === null ? null : Object.assign({}, e.view), this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this
    }
    setFocalLength(e)
    {
        const t = .5 * this.getFilmHeight() / e;
        this.fov = Uo * 2 * Math.atan(t),
        this.updateProjectionMatrix()
    }
    getFocalLength()
    {
        const e = Math.tan(Ql * .5 * this.fov);
        return .5 * this.getFilmHeight() / e
    }
    getEffectiveFOV()
    {
        return Uo * 2 * Math.atan(Math.tan(Ql * .5 * this.fov) / this.zoom)
    }
    getFilmWidth()
    {
        return this.filmGauge * Math.min(this.aspect, 1)
    }
    getFilmHeight()
    {
        return this.filmGauge / Math.max(this.aspect, 1)
    }
    getViewBounds(e, t, s)
    {
        Vn.set(-1, -1, .5).applyMatrix4(this.projectionMatrixInverse),
        t.set(Vn.x, Vn.y).multiplyScalar(-e / Vn.z),
        Vn.set(1, 1, .5).applyMatrix4(this.projectionMatrixInverse),
        s.set(Vn.x, Vn.y).multiplyScalar(-e / Vn.z)
    }
    getViewSize(e, t)
    {
        return this.getViewBounds(e, Iv, Bv), t.subVectors(Bv, Iv)
    }
    setViewOffset(e, t, s, n, r, a)
    {
        this.aspect = e / t,
        this.view === null && (this.view = {
            enabled: !0,
            fullWidth: 1,
            fullHeight: 1,
            offsetX: 0,
            offsetY: 0,
            width: 1,
            height: 1
        }),
        this.view.enabled = !0,
        this.view.fullWidth = e,
        this.view.fullHeight = t,
        this.view.offsetX = s,
        this.view.offsetY = n,
        this.view.width = r,
        this.view.height = a,
        this.updateProjectionMatrix()
    }
    clearViewOffset()
    {
        this.view !== null && (this.view.enabled = !1),
        this.updateProjectionMatrix()
    }
    updateProjectionMatrix()
    {
        const e = this.near;
        let t = e * Math.tan(Ql * .5 * this.fov) / this.zoom,
            s = 2 * t,
            n = this.aspect * s,
            r = -.5 * n;
        const a = this.view;
        if (this.view !== null && this.view.enabled) {
            const l = a.fullWidth,
                c = a.fullHeight;
            r += a.offsetX * n / l,
            t -= a.offsetY * s / c,
            n *= a.width / l,
            s *= a.height / c
        }
        const o = this.filmOffset;
        o !== 0 && (r += e * o / this.getFilmWidth()),
        this.projectionMatrix.makePerspective(r, r + n, t, t - s, e, this.far, this.coordinateSystem),
        this.projectionMatrixInverse.copy(this.projectionMatrix).invert()
    }
    toJSON(e)
    {
        const t = super.toJSON(e);
        return t.object.fov = this.fov, t.object.zoom = this.zoom, t.object.near = this.near, t.object.far = this.far, t.object.focus = this.focus, t.object.aspect = this.aspect, this.view !== null && (t.object.view = Object.assign({}, this.view)), t.object.filmGauge = this.filmGauge, t.object.filmOffset = this.filmOffset, t
    }
}
const Fa = -90,
    Na = 1;
class f1 extends It {
    constructor(e, t, s)
    {
        super(),
        this.type = "CubeCamera",
        this.renderTarget = s,
        this.coordinateSystem = null,
        this.activeMipmapLevel = 0;
        const n = new gi(Fa, Na, e, t);
        n.layers = this.layers,
        this.add(n);
        const r = new gi(Fa, Na, e, t);
        r.layers = this.layers,
        this.add(r);
        const a = new gi(Fa, Na, e, t);
        a.layers = this.layers,
        this.add(a);
        const o = new gi(Fa, Na, e, t);
        o.layers = this.layers,
        this.add(o);
        const l = new gi(Fa, Na, e, t);
        l.layers = this.layers,
        this.add(l);
        const c = new gi(Fa, Na, e, t);
        c.layers = this.layers,
        this.add(c)
    }
    updateCoordinateSystem()
    {
        const e = this.coordinateSystem,
            t = this.children.concat(),
            [s, n, r, a, o, l] = t;
        for (const c of t)
            this.remove(c);
        if (e === Tn)
            s.up.set(0, 1, 0),
            s.lookAt(1, 0, 0),
            n.up.set(0, 1, 0),
            n.lookAt(-1, 0, 0),
            r.up.set(0, 0, -1),
            r.lookAt(0, 1, 0),
            a.up.set(0, 0, 1),
            a.lookAt(0, -1, 0),
            o.up.set(0, 1, 0),
            o.lookAt(0, 0, 1),
            l.up.set(0, 1, 0),
            l.lookAt(0, 0, -1);
        else if (e === Xu)
            s.up.set(0, -1, 0),
            s.lookAt(-1, 0, 0),
            n.up.set(0, -1, 0),
            n.lookAt(1, 0, 0),
            r.up.set(0, 0, 1),
            r.lookAt(0, 1, 0),
            a.up.set(0, 0, -1),
            a.lookAt(0, -1, 0),
            o.up.set(0, -1, 0),
            o.lookAt(0, 0, 1),
            l.up.set(0, -1, 0),
            l.lookAt(0, 0, -1);
        else
            throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
        for (const c of t)
            this.add(c),
            c.updateMatrixWorld()
    }
    update(e, t)
    {
        this.parent === null && this.updateMatrixWorld();
        const {renderTarget: s, activeMipmapLevel: n} = this;
        this.coordinateSystem !== e.coordinateSystem && (this.coordinateSystem = e.coordinateSystem, this.updateCoordinateSystem());
        const [r, a, o, l, c, h] = this.children,
            d = e.getRenderTarget(),
            u = e.getActiveCubeFace(),
            f = e.getActiveMipmapLevel(),
            p = e.xr.enabled;
        e.xr.enabled = !1;
        const A = s.texture.generateMipmaps;
        s.texture.generateMipmaps = !1,
        e.setRenderTarget(s, 0, n),
        e.render(t, r),
        e.setRenderTarget(s, 1, n),
        e.render(t, a),
        e.setRenderTarget(s, 2, n),
        e.render(t, o),
        e.setRenderTarget(s, 3, n),
        e.render(t, l),
        e.setRenderTarget(s, 4, n),
        e.render(t, c),
        s.texture.generateMipmaps = A,
        e.setRenderTarget(s, 5, n),
        e.render(t, h),
        e.setRenderTarget(d, u, f),
        e.xr.enabled = p,
        s.texture.needsPMREMUpdate = !0
    }
}
class Ry extends Rt {
    constructor(e, t, s, n, r, a, o, l, c, h)
    {
        e = e !== void 0 ? e : [],
        t = t !== void 0 ? t : la,
        super(e, t, s, n, r, a, o, l, c, h),
        this.isCubeTexture = !0,
        this.flipY = !1
    }
    get images()
    {
        return this.image
    }
    set images(e)
    {
        this.image = e
    }
}
class p1 extends vt {
    constructor(e=1, t={})
    {
        super(e, e, t),
        this.isWebGLCubeRenderTarget = !0;
        const s = {
                width: e,
                height: e,
                depth: 1
            },
            n = [s, s, s, s, s, s];
        this.texture = new Ry(n, t.mapping, t.wrapS, t.wrapT, t.magFilter, t.minFilter, t.format, t.type, t.anisotropy, t.colorSpace),
        this.texture.isRenderTargetTexture = !0,
        this.texture.generateMipmaps = t.generateMipmaps !== void 0 ? t.generateMipmaps : !1,
        this.texture.minFilter = t.minFilter !== void 0 ? t.minFilter : _t
    }
    fromEquirectangularTexture(e, t)
    {
        this.texture.type = t.type,
        this.texture.colorSpace = t.colorSpace,
        this.texture.generateMipmaps = t.generateMipmaps,
        this.texture.minFilter = t.minFilter,
        this.texture.magFilter = t.magFilter;
        const s = {
                uniforms: {
                    tEquirect: {
                        value: null
                    }
                },
                vertexShader: `

                				varying vec3 vWorldDirection;

                				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

                					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

                				}

                				void main() {

                					vWorldDirection = transformDirection( position, modelMatrix );

                					#include <begin_vertex>
                					#include <project_vertex>

                				}
                			`,
                fragmentShader: `

                				uniform sampler2D tEquirect;

                				varying vec3 vWorldDirection;

                				#include <common>

                				void main() {

                					vec3 direction = normalize( vWorldDirection );

                					vec2 sampleUV = equirectUv( direction );

                					gl_FragColor = texture2D( tEquirect, sampleUV );

                				}
                			`
            },
            n = new Wo(5, 5, 5),
            r = new fe({
                name: "CubemapFromEquirect",
                uniforms: Lo(s.uniforms),
                vertexShader: s.vertexShader,
                fragmentShader: s.fragmentShader,
                side: ei,
                blending: qt
            });
        r.uniforms.tEquirect.value = t;
        const a = new Ce(n, r),
            o = t.minFilter;
        return t.minFilter === Qs && (t.minFilter = _t), new f1(1, 10, this).update(e, a), t.minFilter = o, a.geometry.dispose(), a.material.dispose(), this
    }
    clear(e, t, s, n)
    {
        const r = e.getRenderTarget();
        for (let a = 0; a < 6; a++)
            e.setRenderTarget(this, a),
            e.clear(t, s, n);
        e.setRenderTarget(r)
    }
}
const hf = new b,
    m1 = new b,
    A1 = new at;
class Zs {
    constructor(e=new b(1, 0, 0), t=0)
    {
        this.isPlane = !0,
        this.normal = e,
        this.constant = t
    }
    set(e, t)
    {
        return this.normal.copy(e), this.constant = t, this
    }
    setComponents(e, t, s, n)
    {
        return this.normal.set(e, t, s), this.constant = n, this
    }
    setFromNormalAndCoplanarPoint(e, t)
    {
        return this.normal.copy(e), this.constant = -t.dot(this.normal), this
    }
    setFromCoplanarPoints(e, t, s)
    {
        const n = hf.subVectors(s, t).cross(m1.subVectors(e, t)).normalize();
        return this.setFromNormalAndCoplanarPoint(n, e), this
    }
    copy(e)
    {
        return this.normal.copy(e.normal), this.constant = e.constant, this
    }
    normalize()
    {
        const e = 1 / this.normal.length();
        return this.normal.multiplyScalar(e), this.constant *= e, this
    }
    negate()
    {
        return this.constant *= -1, this.normal.negate(), this
    }
    distanceToPoint(e)
    {
        return this.normal.dot(e) + this.constant
    }
    distanceToSphere(e)
    {
        return this.distanceToPoint(e.center) - e.radius
    }
    projectPoint(e, t)
    {
        return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e))
    }
    intersectLine(e, t)
    {
        const s = e.delta(hf),
            n = this.normal.dot(s);
        if (n === 0)
            return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
        const r = -(e.start.dot(this.normal) + this.constant) / n;
        return r < 0 || r > 1 ? null : t.copy(e.start).addScaledVector(s, r)
    }
    intersectsLine(e)
    {
        const t = this.distanceToPoint(e.start),
            s = this.distanceToPoint(e.end);
        return t < 0 && s > 0 || s < 0 && t > 0
    }
    intersectsBox(e)
    {
        return e.intersectsPlane(this)
    }
    intersectsSphere(e)
    {
        return e.intersectsPlane(this)
    }
    coplanarPoint(e)
    {
        return e.copy(this.normal).multiplyScalar(-this.constant)
    }
    applyMatrix4(e, t)
    {
        const s = t || A1.getNormalMatrix(e),
            n = this.coplanarPoint(hf).applyMatrix4(e),
            r = this.normal.applyMatrix3(s).normalize();
        return this.constant = -n.dot(r), this
    }
    translate(e)
    {
        return this.constant -= e.dot(this.normal), this
    }
    equals(e)
    {
        return e.normal.equals(this.normal) && e.constant === this.constant
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
}
const Br = new bi,
    nh = new b;
class Ed {
    constructor(e=new Zs, t=new Zs, s=new Zs, n=new Zs, r=new Zs, a=new Zs)
    {
        this.planes = [e, t, s, n, r, a]
    }
    set(e, t, s, n, r, a)
    {
        const o = this.planes;
        return o[0].copy(e), o[1].copy(t), o[2].copy(s), o[3].copy(n), o[4].copy(r), o[5].copy(a), this
    }
    copy(e)
    {
        const t = this.planes;
        for (let s = 0; s < 6; s++)
            t[s].copy(e.planes[s]);
        return this
    }
    setFromProjectionMatrix(e, t=Tn)
    {
        const s = this.planes,
            n = e.elements,
            r = n[0],
            a = n[1],
            o = n[2],
            l = n[3],
            c = n[4],
            h = n[5],
            d = n[6],
            u = n[7],
            f = n[8],
            p = n[9],
            A = n[10],
            m = n[11],
            g = n[12],
            x = n[13],
            v = n[14],
            y = n[15];
        if (s[0].setComponents(l - r, u - c, m - f, y - g).normalize(), s[1].setComponents(l + r, u + c, m + f, y + g).normalize(), s[2].setComponents(l + a, u + h, m + p, y + x).normalize(), s[3].setComponents(l - a, u - h, m - p, y - x).normalize(), s[4].setComponents(l - o, u - d, m - A, y - v).normalize(), t === Tn)
            s[5].setComponents(l + o, u + d, m + A, y + v).normalize();
        else if (t === Xu)
            s[5].setComponents(o, d, A, v).normalize();
        else
            throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + t);
        return this
    }
    intersectsObject(e)
    {
        if (e.boundingSphere !== void 0)
            e.boundingSphere === null && e.computeBoundingSphere(),
            Br.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);
        else {
            const t = e.geometry;
            t.boundingSphere === null && t.computeBoundingSphere(),
            Br.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)
        }
        return this.intersectsSphere(Br)
    }
    intersectsSprite(e)
    {
        return Br.center.set(0, 0, 0), Br.radius = .7071067811865476, Br.applyMatrix4(e.matrixWorld), this.intersectsSphere(Br)
    }
    intersectsSphere(e)
    {
        const t = this.planes,
            s = e.center,
            n = -e.radius;
        for (let r = 0; r < 6; r++)
            if (t[r].distanceToPoint(s) < n)
                return !1;
        return !0
    }
    intersectsBox(e)
    {
        const t = this.planes;
        for (let s = 0; s < 6; s++) {
            const n = t[s];
            if (nh.x = n.normal.x > 0 ? e.max.x : e.min.x, nh.y = n.normal.y > 0 ? e.max.y : e.min.y, nh.z = n.normal.z > 0 ? e.max.z : e.min.z, n.distanceToPoint(nh) < 0)
                return !1
        }
        return !0
    }
    containsPoint(e)
    {
        const t = this.planes;
        for (let s = 0; s < 6; s++)
            if (t[s].distanceToPoint(e) < 0)
                return !1;
        return !0
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
}
function Uy() {
    let i = null,
        e = !1,
        t = null,
        s = null;
    function n(r, a) {
        t(r, a),
        s = i.requestAnimationFrame(n)
    }
    return {
        start: function() {
            e !== !0 && t !== null && (s = i.requestAnimationFrame(n), e = !0)
        },
        stop: function() {
            i.cancelAnimationFrame(s),
            e = !1
        },
        setAnimationLoop: function(r) {
            t = r
        },
        setContext: function(r) {
            i = r
        }
    }
}
function g1(i) {
    const e = new WeakMap;
    function t(o, l) {
        const c = o.array,
            h = o.usage,
            d = c.byteLength,
            u = i.createBuffer();
        i.bindBuffer(l, u),
        i.bufferData(l, c, h),
        o.onUploadCallback();
        let f;
        if (c instanceof Float32Array)
            f = i.FLOAT;
        else if (c instanceof Uint16Array)
            o.isFloat16BufferAttribute ? f = i.HALF_FLOAT : f = i.UNSIGNED_SHORT;
        else if (c instanceof Int16Array)
            f = i.SHORT;
        else if (c instanceof Uint32Array)
            f = i.UNSIGNED_INT;
        else if (c instanceof Int32Array)
            f = i.INT;
        else if (c instanceof Int8Array)
            f = i.BYTE;
        else if (c instanceof Uint8Array)
            f = i.UNSIGNED_BYTE;
        else if (c instanceof Uint8ClampedArray)
            f = i.UNSIGNED_BYTE;
        else
            throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + c);
        return {
            buffer: u,
            type: f,
            bytesPerElement: c.BYTES_PER_ELEMENT,
            version: o.version,
            size: d
        }
    }
    function s(o, l, c) {
        const h = l.array,
            d = l._updateRange,
            u = l.updateRanges;
        if (i.bindBuffer(c, o), d.count === -1 && u.length === 0 && i.bufferSubData(c, 0, h), u.length !== 0) {
            for (let f = 0, p = u.length; f < p; f++) {
                const A = u[f];
                i.bufferSubData(c, A.start * h.BYTES_PER_ELEMENT, h, A.start, A.count)
            }
            l.clearUpdateRanges()
        }
        d.count !== -1 && (i.bufferSubData(c, d.offset * h.BYTES_PER_ELEMENT, h, d.offset, d.count), d.count = -1),
        l.onUploadCallback()
    }
    function n(o) {
        return o.isInterleavedBufferAttribute && (o = o.data), e.get(o)
    }
    function r(o) {
        o.isInterleavedBufferAttribute && (o = o.data);
        const l = e.get(o);
        l && (i.deleteBuffer(l.buffer), e.delete(o))
    }
    function a(o, l) {
        if (o.isGLBufferAttribute) {
            const h = e.get(o);
            (!h || h.version < o.version) && e.set(o, {
                buffer: o.buffer,
                type: o.type,
                bytesPerElement: o.elementSize,
                version: o.version
            });
            return
        }
        o.isInterleavedBufferAttribute && (o = o.data);
        const c = e.get(o);
        if (c === void 0)
            e.set(o, t(o, l));
        else if (c.version < o.version) {
            if (c.size !== o.array.byteLength)
                throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
            s(c.buffer, o, l),
            c.version = o.version
        }
    }
    return {
        get: n,
        remove: r,
        update: a
    }
}
class kt extends ot {
    constructor(e=1, t=1, s=1, n=1)
    {
        super(),
        this.type = "PlaneGeometry",
        this.parameters = {
            width: e,
            height: t,
            widthSegments: s,
            heightSegments: n
        };
        const r = e / 2,
            a = t / 2,
            o = Math.floor(s),
            l = Math.floor(n),
            c = o + 1,
            h = l + 1,
            d = e / o,
            u = t / l,
            f = [],
            p = [],
            A = [],
            m = [];
        for (let g = 0; g < h; g++) {
            const x = g * u - a;
            for (let v = 0; v < c; v++) {
                const y = v * d - r;
                p.push(y, -x, 0),
                A.push(0, 0, 1),
                m.push(v / o),
                m.push(1 - g / l)
            }
        }
        for (let g = 0; g < l; g++)
            for (let x = 0; x < o; x++) {
                const v = x + c * g,
                    y = x + c * (g + 1),
                    S = x + 1 + c * (g + 1),
                    w = x + 1 + c * g;
                f.push(v, y, w),
                f.push(y, S, w)
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
        return new kt(e.width, e.height, e.widthSegments, e.heightSegments)
    }
}
var v1 = `#ifdef USE_ALPHAHASH
    	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
    #endif`,
    x1 = `#ifdef USE_ALPHAHASH
    	const float ALPHA_HASH_SCALE = 0.05;
    	float hash2D( vec2 value ) {
    		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
    	}
    	float hash3D( vec3 value ) {
    		return hash2D( vec2( hash2D( value.xy ), value.z ) );
    	}
    	float getAlphaHashThreshold( vec3 position ) {
    		float maxDeriv = max(
    			length( dFdx( position.xyz ) ),
    			length( dFdy( position.xyz ) )
    		);
    		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
    		vec2 pixScales = vec2(
    			exp2( floor( log2( pixScale ) ) ),
    			exp2( ceil( log2( pixScale ) ) )
    		);
    		vec2 alpha = vec2(
    			hash3D( floor( pixScales.x * position.xyz ) ),
    			hash3D( floor( pixScales.y * position.xyz ) )
    		);
    		float lerpFactor = fract( log2( pixScale ) );
    		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
    		float a = min( lerpFactor, 1.0 - lerpFactor );
    		vec3 cases = vec3(
    			x * x / ( 2.0 * a * ( 1.0 - a ) ),
    			( x - 0.5 * a ) / ( 1.0 - a ),
    			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
    		);
    		float threshold = ( x < ( 1.0 - a ) )
    			? ( ( x < a ) ? cases.x : cases.y )
    			: cases.z;
    		return clamp( threshold , 1.0e-6, 1.0 );
    	}
    #endif`,
    y1 = `#ifdef USE_ALPHAMAP
    	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
    #endif`,
    _1 = `#ifdef USE_ALPHAMAP
    	uniform sampler2D alphaMap;
    #endif`,
    w1 = `#ifdef USE_ALPHATEST
    	#ifdef ALPHA_TO_COVERAGE
    	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
    	if ( diffuseColor.a == 0.0 ) discard;
    	#else
    	if ( diffuseColor.a < alphaTest ) discard;
    	#endif
    #endif`,
    E1 = `#ifdef USE_ALPHATEST
    	uniform float alphaTest;
    #endif`,
    C1 = `#ifdef USE_AOMAP
    	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
    	reflectedLight.indirectDiffuse *= ambientOcclusion;
    	#if defined( USE_CLEARCOAT ) 
    		clearcoatSpecularIndirect *= ambientOcclusion;
    	#endif
    	#if defined( USE_SHEEN ) 
    		sheenSpecularIndirect *= ambientOcclusion;
    	#endif
    	#if defined( USE_ENVMAP ) && defined( STANDARD )
    		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
    		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
    	#endif
    #endif`,
    S1 = `#ifdef USE_AOMAP
    	uniform sampler2D aoMap;
    	uniform float aoMapIntensity;
    #endif`,
    M1 = `#ifdef USE_BATCHING
    	attribute float batchId;
    	uniform highp sampler2D batchingTexture;
    	mat4 getBatchingMatrix( const in float i ) {
    		int size = textureSize( batchingTexture, 0 ).x;
    		int j = int( i ) * 4;
    		int x = j % size;
    		int y = j / size;
    		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
    		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
    		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
    		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
    		return mat4( v1, v2, v3, v4 );
    	}
    #endif
    #ifdef USE_BATCHING_COLOR
    	uniform sampler2D batchingColorTexture;
    	vec3 getBatchingColor( const in float i ) {
    		int size = textureSize( batchingColorTexture, 0 ).x;
    		int j = int( i );
    		int x = j % size;
    		int y = j / size;
    		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
    	}
    #endif`,
    b1 = `#ifdef USE_BATCHING
    	mat4 batchingMatrix = getBatchingMatrix( batchId );
    #endif`,
    T1 = `vec3 transformed = vec3( position );
    #ifdef USE_ALPHAHASH
    	vPosition = vec3( position );
    #endif`,
    I1 = `vec3 objectNormal = vec3( normal );
    #ifdef USE_TANGENT
    	vec3 objectTangent = vec3( tangent.xyz );
    #endif`,
    B1 = `float G_BlinnPhong_Implicit( ) {
    	return 0.25;
    }
    float D_BlinnPhong( const in float shininess, const in float dotNH ) {
    	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
    }
    vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
    	vec3 halfDir = normalize( lightDir + viewDir );
    	float dotNH = saturate( dot( normal, halfDir ) );
    	float dotVH = saturate( dot( viewDir, halfDir ) );
    	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
    	float G = G_BlinnPhong_Implicit( );
    	float D = D_BlinnPhong( shininess, dotNH );
    	return F * ( G * D );
    } // validated`,
    P1 = `#ifdef USE_IRIDESCENCE
    	const mat3 XYZ_TO_REC709 = mat3(
    		 3.2404542, -0.9692660,  0.0556434,
    		-1.5371385,  1.8760108, -0.2040259,
    		-0.4985314,  0.0415560,  1.0572252
    	);
    	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
    		vec3 sqrtF0 = sqrt( fresnel0 );
    		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
    	}
    	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
    		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
    	}
    	float IorToFresnel0( float transmittedIor, float incidentIor ) {
    		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
    	}
    	vec3 evalSensitivity( float OPD, vec3 shift ) {
    		float phase = 2.0 * PI * OPD * 1.0e-9;
    		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
    		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
    		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
    		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
    		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
    		xyz /= 1.0685e-7;
    		vec3 rgb = XYZ_TO_REC709 * xyz;
    		return rgb;
    	}
    	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
    		vec3 I;
    		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
    		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
    		float cosTheta2Sq = 1.0 - sinTheta2Sq;
    		if ( cosTheta2Sq < 0.0 ) {
    			return vec3( 1.0 );
    		}
    		float cosTheta2 = sqrt( cosTheta2Sq );
    		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
    		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
    		float T121 = 1.0 - R12;
    		float phi12 = 0.0;
    		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
    		float phi21 = PI - phi12;
    		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
    		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
    		vec3 phi23 = vec3( 0.0 );
    		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
    		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
    		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
    		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
    		vec3 phi = vec3( phi21 ) + phi23;
    		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
    		vec3 r123 = sqrt( R123 );
    		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
    		vec3 C0 = R12 + Rs;
    		I = C0;
    		vec3 Cm = Rs - T121;
    		for ( int m = 1; m <= 2; ++ m ) {
    			Cm *= r123;
    			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
    			I += Cm * Sm;
    		}
    		return max( I, vec3( 0.0 ) );
    	}
    #endif`,
    D1 = `#ifdef USE_BUMPMAP
    	uniform sampler2D bumpMap;
    	uniform float bumpScale;
    	vec2 dHdxy_fwd() {
    		vec2 dSTdx = dFdx( vBumpMapUv );
    		vec2 dSTdy = dFdy( vBumpMapUv );
    		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
    		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
    		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
    		return vec2( dBx, dBy );
    	}
    	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
    		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
    		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
    		vec3 vN = surf_norm;
    		vec3 R1 = cross( vSigmaY, vN );
    		vec3 R2 = cross( vN, vSigmaX );
    		float fDet = dot( vSigmaX, R1 ) * faceDirection;
    		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
    		return normalize( abs( fDet ) * surf_norm - vGrad );
    	}
    #endif`,
    R1 = `#if NUM_CLIPPING_PLANES > 0
    	vec4 plane;
    	#ifdef ALPHA_TO_COVERAGE
    		float distanceToPlane, distanceGradient;
    		float clipOpacity = 1.0;
    		#pragma unroll_loop_start
    		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
    			plane = clippingPlanes[ i ];
    			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
    			distanceGradient = fwidth( distanceToPlane ) / 2.0;
    			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
    			if ( clipOpacity == 0.0 ) discard;
    		}
    		#pragma unroll_loop_end
    		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
    			float unionClipOpacity = 1.0;
    			#pragma unroll_loop_start
    			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
    				plane = clippingPlanes[ i ];
    				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
    				distanceGradient = fwidth( distanceToPlane ) / 2.0;
    				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
    			}
    			#pragma unroll_loop_end
    			clipOpacity *= 1.0 - unionClipOpacity;
    		#endif
    		diffuseColor.a *= clipOpacity;
    		if ( diffuseColor.a == 0.0 ) discard;
    	#else
    		#pragma unroll_loop_start
    		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
    			plane = clippingPlanes[ i ];
    			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
    		}
    		#pragma unroll_loop_end
    		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
    			bool clipped = true;
    			#pragma unroll_loop_start
    			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
    				plane = clippingPlanes[ i ];
    				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
    			}
    			#pragma unroll_loop_end
    			if ( clipped ) discard;
    		#endif
    	#endif
    #endif`,
    U1 = `#if NUM_CLIPPING_PLANES > 0
    	varying vec3 vClipPosition;
    	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
    #endif`,
    L1 = `#if NUM_CLIPPING_PLANES > 0
    	varying vec3 vClipPosition;
    #endif`,
    F1 = `#if NUM_CLIPPING_PLANES > 0
    	vClipPosition = - mvPosition.xyz;
    #endif`,
    N1 = `#if defined( USE_COLOR_ALPHA )
    	diffuseColor *= vColor;
    #elif defined( USE_COLOR )
    	diffuseColor.rgb *= vColor;
    #endif`,
    O1 = `#if defined( USE_COLOR_ALPHA )
    	varying vec4 vColor;
    #elif defined( USE_COLOR )
    	varying vec3 vColor;
    #endif`,
    k1 = `#if defined( USE_COLOR_ALPHA )
    	varying vec4 vColor;
    #elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
    	varying vec3 vColor;
    #endif`,
    z1 = `#if defined( USE_COLOR_ALPHA )
    	vColor = vec4( 1.0 );
    #elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
    	vColor = vec3( 1.0 );
    #endif
    #ifdef USE_COLOR
    	vColor *= color;
    #endif
    #ifdef USE_INSTANCING_COLOR
    	vColor.xyz *= instanceColor.xyz;
    #endif
    #ifdef USE_BATCHING_COLOR
    	vec3 batchingColor = getBatchingColor( batchId );
    	vColor.xyz *= batchingColor.xyz;
    #endif`,
    Q1 = `#define PI 3.141592653589793
    #define PI2 6.283185307179586
    #define PI_HALF 1.5707963267948966
    #define RECIPROCAL_PI 0.3183098861837907
    #define RECIPROCAL_PI2 0.15915494309189535
    #define EPSILON 1e-6
    #ifndef saturate
    #define saturate( a ) clamp( a, 0.0, 1.0 )
    #endif
    #define whiteComplement( a ) ( 1.0 - saturate( a ) )
    float pow2( const in float x ) { return x*x; }
    vec3 pow2( const in vec3 x ) { return x*x; }
    float pow3( const in float x ) { return x*x*x; }
    float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
    float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
    float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
    highp float rand( const in vec2 uv ) {
    	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
    	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
    	return fract( sin( sn ) * c );
    }
    #ifdef HIGH_PRECISION
    	float precisionSafeLength( vec3 v ) { return length( v ); }
    #else
    	float precisionSafeLength( vec3 v ) {
    		float maxComponent = max3( abs( v ) );
    		return length( v / maxComponent ) * maxComponent;
    	}
    #endif
    struct IncidentLight {
    	vec3 color;
    	vec3 direction;
    	bool visible;
    };
    struct ReflectedLight {
    	vec3 directDiffuse;
    	vec3 directSpecular;
    	vec3 indirectDiffuse;
    	vec3 indirectSpecular;
    };
    #ifdef USE_ALPHAHASH
    	varying vec3 vPosition;
    #endif
    vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
    	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
    }
    vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
    	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
    }
    mat3 transposeMat3( const in mat3 m ) {
    	mat3 tmp;
    	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
    	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
    	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
    	return tmp;
    }
    float luminance( const in vec3 rgb ) {
    	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
    	return dot( weights, rgb );
    }
    bool isPerspectiveMatrix( mat4 m ) {
    	return m[ 2 ][ 3 ] == - 1.0;
    }
    vec2 equirectUv( in vec3 dir ) {
    	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
    	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
    	return vec2( u, v );
    }
    vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
    	return RECIPROCAL_PI * diffuseColor;
    }
    vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
    	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
    	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
    }
    float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
    	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
    	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
    } // validated`,
    G1 = `#ifdef ENVMAP_TYPE_CUBE_UV
    	#define cubeUV_minMipLevel 4.0
    	#define cubeUV_minTileSize 16.0
    	float getFace( vec3 direction ) {
    		vec3 absDirection = abs( direction );
    		float face = - 1.0;
    		if ( absDirection.x > absDirection.z ) {
    			if ( absDirection.x > absDirection.y )
    				face = direction.x > 0.0 ? 0.0 : 3.0;
    			else
    				face = direction.y > 0.0 ? 1.0 : 4.0;
    		} else {
    			if ( absDirection.z > absDirection.y )
    				face = direction.z > 0.0 ? 2.0 : 5.0;
    			else
    				face = direction.y > 0.0 ? 1.0 : 4.0;
    		}
    		return face;
    	}
    	vec2 getUV( vec3 direction, float face ) {
    		vec2 uv;
    		if ( face == 0.0 ) {
    			uv = vec2( direction.z, direction.y ) / abs( direction.x );
    		} else if ( face == 1.0 ) {
    			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
    		} else if ( face == 2.0 ) {
    			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
    		} else if ( face == 3.0 ) {
    			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
    		} else if ( face == 4.0 ) {
    			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
    		} else {
    			uv = vec2( direction.x, direction.y ) / abs( direction.z );
    		}
    		return 0.5 * ( uv + 1.0 );
    	}
    	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
    		float face = getFace( direction );
    		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
    		mipInt = max( mipInt, cubeUV_minMipLevel );
    		float faceSize = exp2( mipInt );
    		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
    		if ( face > 2.0 ) {
    			uv.y += faceSize;
    			face -= 3.0;
    		}
    		uv.x += face * faceSize;
    		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
    		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
    		uv.x *= CUBEUV_TEXEL_WIDTH;
    		uv.y *= CUBEUV_TEXEL_HEIGHT;
    		#ifdef texture2DGradEXT
    			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
    		#else
    			return texture2D( envMap, uv ).rgb;
    		#endif
    	}
    	#define cubeUV_r0 1.0
    	#define cubeUV_m0 - 2.0
    	#define cubeUV_r1 0.8
    	#define cubeUV_m1 - 1.0
    	#define cubeUV_r4 0.4
    	#define cubeUV_m4 2.0
    	#define cubeUV_r5 0.305
    	#define cubeUV_m5 3.0
    	#define cubeUV_r6 0.21
    	#define cubeUV_m6 4.0
    	float roughnessToMip( float roughness ) {
    		float mip = 0.0;
    		if ( roughness >= cubeUV_r1 ) {
    			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
    		} else if ( roughness >= cubeUV_r4 ) {
    			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
    		} else if ( roughness >= cubeUV_r5 ) {
    			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
    		} else if ( roughness >= cubeUV_r6 ) {
    			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
    		} else {
    			mip = - 2.0 * log2( 1.16 * roughness );		}
    		return mip;
    	}
    	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
    		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
    		float mipF = fract( mip );
    		float mipInt = floor( mip );
    		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
    		if ( mipF == 0.0 ) {
    			return vec4( color0, 1.0 );
    		} else {
    			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
    			return vec4( mix( color0, color1, mipF ), 1.0 );
    		}
    	}
    #endif`,
    H1 = `vec3 transformedNormal = objectNormal;
    #ifdef USE_TANGENT
    	vec3 transformedTangent = objectTangent;
    #endif
    #ifdef USE_BATCHING
    	mat3 bm = mat3( batchingMatrix );
    	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
    	transformedNormal = bm * transformedNormal;
    	#ifdef USE_TANGENT
    		transformedTangent = bm * transformedTangent;
    	#endif
    #endif
    #ifdef USE_INSTANCING
    	mat3 im = mat3( instanceMatrix );
    	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
    	transformedNormal = im * transformedNormal;
    	#ifdef USE_TANGENT
    		transformedTangent = im * transformedTangent;
    	#endif
    #endif
    transformedNormal = normalMatrix * transformedNormal;
    #ifdef FLIP_SIDED
    	transformedNormal = - transformedNormal;
    #endif
    #ifdef USE_TANGENT
    	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
    	#ifdef FLIP_SIDED
    		transformedTangent = - transformedTangent;
    	#endif
    #endif`,
    V1 = `#ifdef USE_DISPLACEMENTMAP
    	uniform sampler2D displacementMap;
    	uniform float displacementScale;
    	uniform float displacementBias;
    #endif`,
    W1 = `#ifdef USE_DISPLACEMENTMAP
    	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
    #endif`,
    Y1 = `#ifdef USE_EMISSIVEMAP
    	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
    	totalEmissiveRadiance *= emissiveColor.rgb;
    #endif`,
    q1 = `#ifdef USE_EMISSIVEMAP
    	uniform sampler2D emissiveMap;
    #endif`,
    X1 = "gl_FragColor = linearToOutputTexel( gl_FragColor );",
    K1 = `
    const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
    	vec3( 0.8224621, 0.177538, 0.0 ),
    	vec3( 0.0331941, 0.9668058, 0.0 ),
    	vec3( 0.0170827, 0.0723974, 0.9105199 )
    );
    const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
    	vec3( 1.2249401, - 0.2249404, 0.0 ),
    	vec3( - 0.0420569, 1.0420571, 0.0 ),
    	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
    );
    vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
    	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
    }
    vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
    	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
    }
    vec4 LinearTransferOETF( in vec4 value ) {
    	return value;
    }
    vec4 sRGBTransferOETF( in vec4 value ) {
    	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
    }
    vec4 LinearToLinear( in vec4 value ) {
    	return value;
    }
    vec4 LinearTosRGB( in vec4 value ) {
    	return sRGBTransferOETF( value );
    }`,
    J1 = `#ifdef USE_ENVMAP
    	#ifdef ENV_WORLDPOS
    		vec3 cameraToFrag;
    		if ( isOrthographic ) {
    			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
    		} else {
    			cameraToFrag = normalize( vWorldPosition - cameraPosition );
    		}
    		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
    		#ifdef ENVMAP_MODE_REFLECTION
    			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
    		#else
    			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
    		#endif
    	#else
    		vec3 reflectVec = vReflect;
    	#endif
    	#ifdef ENVMAP_TYPE_CUBE
    		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
    	#else
    		vec4 envColor = vec4( 0.0 );
    	#endif
    	#ifdef ENVMAP_BLENDING_MULTIPLY
    		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
    	#elif defined( ENVMAP_BLENDING_MIX )
    		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
    	#elif defined( ENVMAP_BLENDING_ADD )
    		outgoingLight += envColor.xyz * specularStrength * reflectivity;
    	#endif
    #endif`,
    j1 = `#ifdef USE_ENVMAP
    	uniform float envMapIntensity;
    	uniform float flipEnvMap;
    	uniform mat3 envMapRotation;
    	#ifdef ENVMAP_TYPE_CUBE
    		uniform samplerCube envMap;
    	#else
    		uniform sampler2D envMap;
    	#endif
    	
    #endif`,
    Z1 = `#ifdef USE_ENVMAP
    	uniform float reflectivity;
    	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
    		#define ENV_WORLDPOS
    	#endif
    	#ifdef ENV_WORLDPOS
    		varying vec3 vWorldPosition;
    		uniform float refractionRatio;
    	#else
    		varying vec3 vReflect;
    	#endif
    #endif`,
    $1 = `#ifdef USE_ENVMAP
    	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
    		#define ENV_WORLDPOS
    	#endif
    	#ifdef ENV_WORLDPOS
    		
    		varying vec3 vWorldPosition;
    	#else
    		varying vec3 vReflect;
    		uniform float refractionRatio;
    	#endif
    #endif`,
    eS = `#ifdef USE_ENVMAP
    	#ifdef ENV_WORLDPOS
    		vWorldPosition = worldPosition.xyz;
    	#else
    		vec3 cameraToVertex;
    		if ( isOrthographic ) {
    			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
    		} else {
    			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
    		}
    		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
    		#ifdef ENVMAP_MODE_REFLECTION
    			vReflect = reflect( cameraToVertex, worldNormal );
    		#else
    			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
    		#endif
    	#endif
    #endif`,
    tS = `#ifdef USE_FOG
    	vFogDepth = - mvPosition.z;
    #endif`,
    iS = `#ifdef USE_FOG
    	varying float vFogDepth;
    #endif`,
    sS = `#ifdef USE_FOG
    	#ifdef FOG_EXP2
    		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
    	#else
    		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
    	#endif
    	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
    #endif`,
    nS = `#ifdef USE_FOG
    	uniform vec3 fogColor;
    	varying float vFogDepth;
    	#ifdef FOG_EXP2
    		uniform float fogDensity;
    	#else
    		uniform float fogNear;
    		uniform float fogFar;
    	#endif
    #endif`,
    rS = `#ifdef USE_GRADIENTMAP
    	uniform sampler2D gradientMap;
    #endif
    vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
    	float dotNL = dot( normal, lightDirection );
    	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
    	#ifdef USE_GRADIENTMAP
    		return vec3( texture2D( gradientMap, coord ).r );
    	#else
    		vec2 fw = fwidth( coord ) * 0.5;
    		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
    	#endif
    }`,
    aS = `#ifdef USE_LIGHTMAP
    	uniform sampler2D lightMap;
    	uniform float lightMapIntensity;
    #endif`,
    oS = `LambertMaterial material;
    material.diffuseColor = diffuseColor.rgb;
    material.specularStrength = specularStrength;`,
    lS = `varying vec3 vViewPosition;
    struct LambertMaterial {
    	vec3 diffuseColor;
    	float specularStrength;
    };
    void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
    	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
    	vec3 irradiance = dotNL * directLight.color;
    	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
    }
    void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
    	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
    }
    #define RE_Direct				RE_Direct_Lambert
    #define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,
    cS = `uniform bool receiveShadow;
    uniform vec3 ambientLightColor;
    #if defined( USE_LIGHT_PROBES )
    	uniform vec3 lightProbe[ 9 ];
    #endif
    vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
    	float x = normal.x, y = normal.y, z = normal.z;
    	vec3 result = shCoefficients[ 0 ] * 0.886227;
    	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
    	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
    	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
    	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
    	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
    	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
    	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
    	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
    	return result;
    }
    vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
    	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
    	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
    	return irradiance;
    }
    vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
    	vec3 irradiance = ambientLightColor;
    	return irradiance;
    }
    float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
    	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
    	if ( cutoffDistance > 0.0 ) {
    		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
    	}
    	return distanceFalloff;
    }
    float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
    	return smoothstep( coneCosine, penumbraCosine, angleCosine );
    }
    #if NUM_DIR_LIGHTS > 0
    	struct DirectionalLight {
    		vec3 direction;
    		vec3 color;
    	};
    	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
    	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
    		light.color = directionalLight.color;
    		light.direction = directionalLight.direction;
    		light.visible = true;
    	}
    #endif
    #if NUM_POINT_LIGHTS > 0
    	struct PointLight {
    		vec3 position;
    		vec3 color;
    		float distance;
    		float decay;
    	};
    	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
    	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
    		vec3 lVector = pointLight.position - geometryPosition;
    		light.direction = normalize( lVector );
    		float lightDistance = length( lVector );
    		light.color = pointLight.color;
    		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
    		light.visible = ( light.color != vec3( 0.0 ) );
    	}
    #endif
    #if NUM_SPOT_LIGHTS > 0
    	struct SpotLight {
    		vec3 position;
    		vec3 direction;
    		vec3 color;
    		float distance;
    		float decay;
    		float coneCos;
    		float penumbraCos;
    	};
    	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
    	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
    		vec3 lVector = spotLight.position - geometryPosition;
    		light.direction = normalize( lVector );
    		float angleCos = dot( light.direction, spotLight.direction );
    		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
    		if ( spotAttenuation > 0.0 ) {
    			float lightDistance = length( lVector );
    			light.color = spotLight.color * spotAttenuation;
    			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
    			light.visible = ( light.color != vec3( 0.0 ) );
    		} else {
    			light.color = vec3( 0.0 );
    			light.visible = false;
    		}
    	}
    #endif
    #if NUM_RECT_AREA_LIGHTS > 0
    	struct RectAreaLight {
    		vec3 color;
    		vec3 position;
    		vec3 halfWidth;
    		vec3 halfHeight;
    	};
    	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
    	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
    #endif
    #if NUM_HEMI_LIGHTS > 0
    	struct HemisphereLight {
    		vec3 direction;
    		vec3 skyColor;
    		vec3 groundColor;
    	};
    	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
    	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
    		float dotNL = dot( normal, hemiLight.direction );
    		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
    		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
    		return irradiance;
    	}
    #endif`,
    hS = `#ifdef USE_ENVMAP
    	vec3 getIBLIrradiance( const in vec3 normal ) {
    		#ifdef ENVMAP_TYPE_CUBE_UV
    			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
    			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
    			return PI * envMapColor.rgb * envMapIntensity;
    		#else
    			return vec3( 0.0 );
    		#endif
    	}
    	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
    		#ifdef ENVMAP_TYPE_CUBE_UV
    			vec3 reflectVec = reflect( - viewDir, normal );
    			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
    			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
    			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
    			return envMapColor.rgb * envMapIntensity;
    		#else
    			return vec3( 0.0 );
    		#endif
    	}
    	#ifdef USE_ANISOTROPY
    		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
    			#ifdef ENVMAP_TYPE_CUBE_UV
    				vec3 bentNormal = cross( bitangent, viewDir );
    				bentNormal = normalize( cross( bentNormal, bitangent ) );
    				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
    				return getIBLRadiance( viewDir, bentNormal, roughness );
    			#else
    				return vec3( 0.0 );
    			#endif
    		}
    	#endif
    #endif`,
    uS = `ToonMaterial material;
    material.diffuseColor = diffuseColor.rgb;`,
    dS = `varying vec3 vViewPosition;
    struct ToonMaterial {
    	vec3 diffuseColor;
    };
    void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
    	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
    	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
    }
    void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
    	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
    }
    #define RE_Direct				RE_Direct_Toon
    #define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,
    fS = `BlinnPhongMaterial material;
    material.diffuseColor = diffuseColor.rgb;
    material.specularColor = specular;
    material.specularShininess = shininess;
    material.specularStrength = specularStrength;`,
    pS = `varying vec3 vViewPosition;
    struct BlinnPhongMaterial {
    	vec3 diffuseColor;
    	vec3 specularColor;
    	float specularShininess;
    	float specularStrength;
    };
    void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
    	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
    	vec3 irradiance = dotNL * directLight.color;
    	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
    	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
    }
    void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
    	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
    }
    #define RE_Direct				RE_Direct_BlinnPhong
    #define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,
    mS = `PhysicalMaterial material;
    material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
    vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
    float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
    material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
    material.roughness = min( material.roughness, 1.0 );
    #ifdef IOR
    	material.ior = ior;
    	#ifdef USE_SPECULAR
    		float specularIntensityFactor = specularIntensity;
    		vec3 specularColorFactor = specularColor;
    		#ifdef USE_SPECULAR_COLORMAP
    			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
    		#endif
    		#ifdef USE_SPECULAR_INTENSITYMAP
    			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
    		#endif
    		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
    	#else
    		float specularIntensityFactor = 1.0;
    		vec3 specularColorFactor = vec3( 1.0 );
    		material.specularF90 = 1.0;
    	#endif
    	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
    #else
    	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
    	material.specularF90 = 1.0;
    #endif
    #ifdef USE_CLEARCOAT
    	material.clearcoat = clearcoat;
    	material.clearcoatRoughness = clearcoatRoughness;
    	material.clearcoatF0 = vec3( 0.04 );
    	material.clearcoatF90 = 1.0;
    	#ifdef USE_CLEARCOATMAP
    		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
    	#endif
    	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
    		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
    	#endif
    	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
    	material.clearcoatRoughness += geometryRoughness;
    	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
    #endif
    #ifdef USE_DISPERSION
    	material.dispersion = dispersion;
    #endif
    #ifdef USE_IRIDESCENCE
    	material.iridescence = iridescence;
    	material.iridescenceIOR = iridescenceIOR;
    	#ifdef USE_IRIDESCENCEMAP
    		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
    	#endif
    	#ifdef USE_IRIDESCENCE_THICKNESSMAP
    		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
    	#else
    		material.iridescenceThickness = iridescenceThicknessMaximum;
    	#endif
    #endif
    #ifdef USE_SHEEN
    	material.sheenColor = sheenColor;
    	#ifdef USE_SHEEN_COLORMAP
    		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
    	#endif
    	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
    	#ifdef USE_SHEEN_ROUGHNESSMAP
    		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
    	#endif
    #endif
    #ifdef USE_ANISOTROPY
    	#ifdef USE_ANISOTROPYMAP
    		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
    		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
    		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
    	#else
    		vec2 anisotropyV = anisotropyVector;
    	#endif
    	material.anisotropy = length( anisotropyV );
    	if( material.anisotropy == 0.0 ) {
    		anisotropyV = vec2( 1.0, 0.0 );
    	} else {
    		anisotropyV /= material.anisotropy;
    		material.anisotropy = saturate( material.anisotropy );
    	}
    	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
    	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
    	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
    #endif`,
    AS = `struct PhysicalMaterial {
    	vec3 diffuseColor;
    	float roughness;
    	vec3 specularColor;
    	float specularF90;
    	float dispersion;
    	#ifdef USE_CLEARCOAT
    		float clearcoat;
    		float clearcoatRoughness;
    		vec3 clearcoatF0;
    		float clearcoatF90;
    	#endif
    	#ifdef USE_IRIDESCENCE
    		float iridescence;
    		float iridescenceIOR;
    		float iridescenceThickness;
    		vec3 iridescenceFresnel;
    		vec3 iridescenceF0;
    	#endif
    	#ifdef USE_SHEEN
    		vec3 sheenColor;
    		float sheenRoughness;
    	#endif
    	#ifdef IOR
    		float ior;
    	#endif
    	#ifdef USE_TRANSMISSION
    		float transmission;
    		float transmissionAlpha;
    		float thickness;
    		float attenuationDistance;
    		vec3 attenuationColor;
    	#endif
    	#ifdef USE_ANISOTROPY
    		float anisotropy;
    		float alphaT;
    		vec3 anisotropyT;
    		vec3 anisotropyB;
    	#endif
    };
    vec3 clearcoatSpecularDirect = vec3( 0.0 );
    vec3 clearcoatSpecularIndirect = vec3( 0.0 );
    vec3 sheenSpecularDirect = vec3( 0.0 );
    vec3 sheenSpecularIndirect = vec3(0.0 );
    vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
        float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
        float x2 = x * x;
        float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
        return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
    }
    float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
    	float a2 = pow2( alpha );
    	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
    	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
    	return 0.5 / max( gv + gl, EPSILON );
    }
    float D_GGX( const in float alpha, const in float dotNH ) {
    	float a2 = pow2( alpha );
    	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
    	return RECIPROCAL_PI * a2 / pow2( denom );
    }
    #ifdef USE_ANISOTROPY
    	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
    		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
    		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
    		float v = 0.5 / ( gv + gl );
    		return saturate(v);
    	}
    	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
    		float a2 = alphaT * alphaB;
    		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
    		highp float v2 = dot( v, v );
    		float w2 = a2 / v2;
    		return RECIPROCAL_PI * a2 * pow2 ( w2 );
    	}
    #endif
    #ifdef USE_CLEARCOAT
    	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
    		vec3 f0 = material.clearcoatF0;
    		float f90 = material.clearcoatF90;
    		float roughness = material.clearcoatRoughness;
    		float alpha = pow2( roughness );
    		vec3 halfDir = normalize( lightDir + viewDir );
    		float dotNL = saturate( dot( normal, lightDir ) );
    		float dotNV = saturate( dot( normal, viewDir ) );
    		float dotNH = saturate( dot( normal, halfDir ) );
    		float dotVH = saturate( dot( viewDir, halfDir ) );
    		vec3 F = F_Schlick( f0, f90, dotVH );
    		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
    		float D = D_GGX( alpha, dotNH );
    		return F * ( V * D );
    	}
    #endif
    vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
    	vec3 f0 = material.specularColor;
    	float f90 = material.specularF90;
    	float roughness = material.roughness;
    	float alpha = pow2( roughness );
    	vec3 halfDir = normalize( lightDir + viewDir );
    	float dotNL = saturate( dot( normal, lightDir ) );
    	float dotNV = saturate( dot( normal, viewDir ) );
    	float dotNH = saturate( dot( normal, halfDir ) );
    	float dotVH = saturate( dot( viewDir, halfDir ) );
    	vec3 F = F_Schlick( f0, f90, dotVH );
    	#ifdef USE_IRIDESCENCE
    		F = mix( F, material.iridescenceFresnel, material.iridescence );
    	#endif
    	#ifdef USE_ANISOTROPY
    		float dotTL = dot( material.anisotropyT, lightDir );
    		float dotTV = dot( material.anisotropyT, viewDir );
    		float dotTH = dot( material.anisotropyT, halfDir );
    		float dotBL = dot( material.anisotropyB, lightDir );
    		float dotBV = dot( material.anisotropyB, viewDir );
    		float dotBH = dot( material.anisotropyB, halfDir );
    		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
    		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
    	#else
    		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
    		float D = D_GGX( alpha, dotNH );
    	#endif
    	return F * ( V * D );
    }
    vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
    	const float LUT_SIZE = 64.0;
    	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
    	const float LUT_BIAS = 0.5 / LUT_SIZE;
    	float dotNV = saturate( dot( N, V ) );
    	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
    	uv = uv * LUT_SCALE + LUT_BIAS;
    	return uv;
    }
    float LTC_ClippedSphereFormFactor( const in vec3 f ) {
    	float l = length( f );
    	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
    }
    vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
    	float x = dot( v1, v2 );
    	float y = abs( x );
    	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
    	float b = 3.4175940 + ( 4.1616724 + y ) * y;
    	float v = a / b;
    	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
    	return cross( v1, v2 ) * theta_sintheta;
    }
    vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
    	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
    	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
    	vec3 lightNormal = cross( v1, v2 );
    	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
    	vec3 T1, T2;
    	T1 = normalize( V - N * dot( V, N ) );
    	T2 = - cross( N, T1 );
    	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
    	vec3 coords[ 4 ];
    	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
    	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
    	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
    	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
    	coords[ 0 ] = normalize( coords[ 0 ] );
    	coords[ 1 ] = normalize( coords[ 1 ] );
    	coords[ 2 ] = normalize( coords[ 2 ] );
    	coords[ 3 ] = normalize( coords[ 3 ] );
    	vec3 vectorFormFactor = vec3( 0.0 );
    	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
    	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
    	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
    	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
    	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
    	return vec3( result );
    }
    #if defined( USE_SHEEN )
    float D_Charlie( float roughness, float dotNH ) {
    	float alpha = pow2( roughness );
    	float invAlpha = 1.0 / alpha;
    	float cos2h = dotNH * dotNH;
    	float sin2h = max( 1.0 - cos2h, 0.0078125 );
    	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
    }
    float V_Neubelt( float dotNV, float dotNL ) {
    	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
    }
    vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
    	vec3 halfDir = normalize( lightDir + viewDir );
    	float dotNL = saturate( dot( normal, lightDir ) );
    	float dotNV = saturate( dot( normal, viewDir ) );
    	float dotNH = saturate( dot( normal, halfDir ) );
    	float D = D_Charlie( sheenRoughness, dotNH );
    	float V = V_Neubelt( dotNV, dotNL );
    	return sheenColor * ( D * V );
    }
    #endif
    float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
    	float dotNV = saturate( dot( normal, viewDir ) );
    	float r2 = roughness * roughness;
    	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
    	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
    	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
    	return saturate( DG * RECIPROCAL_PI );
    }
    vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
    	float dotNV = saturate( dot( normal, viewDir ) );
    	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
    	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
    	vec4 r = roughness * c0 + c1;
    	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
    	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
    	return fab;
    }
    vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
    	vec2 fab = DFGApprox( normal, viewDir, roughness );
    	return specularColor * fab.x + specularF90 * fab.y;
    }
    #ifdef USE_IRIDESCENCE
    void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
    #else
    void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
    #endif
    	vec2 fab = DFGApprox( normal, viewDir, roughness );
    	#ifdef USE_IRIDESCENCE
    		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
    	#else
    		vec3 Fr = specularColor;
    	#endif
    	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
    	float Ess = fab.x + fab.y;
    	float Ems = 1.0 - Ess;
    	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
    	singleScatter += FssEss;
    	multiScatter += Fms * Ems;
    }
    #if NUM_RECT_AREA_LIGHTS > 0
    	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
    		vec3 normal = geometryNormal;
    		vec3 viewDir = geometryViewDir;
    		vec3 position = geometryPosition;
    		vec3 lightPos = rectAreaLight.position;
    		vec3 halfWidth = rectAreaLight.halfWidth;
    		vec3 halfHeight = rectAreaLight.halfHeight;
    		vec3 lightColor = rectAreaLight.color;
    		float roughness = material.roughness;
    		vec3 rectCoords[ 4 ];
    		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
    		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
    		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
    		vec2 uv = LTC_Uv( normal, viewDir, roughness );
    		vec4 t1 = texture2D( ltc_1, uv );
    		vec4 t2 = texture2D( ltc_2, uv );
    		mat3 mInv = mat3(
    			vec3( t1.x, 0, t1.y ),
    			vec3(    0, 1,    0 ),
    			vec3( t1.z, 0, t1.w )
    		);
    		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
    		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
    		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
    	}
    #endif
    void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
    	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
    	vec3 irradiance = dotNL * directLight.color;
    	#ifdef USE_CLEARCOAT
    		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
    		vec3 ccIrradiance = dotNLcc * directLight.color;
    		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
    	#endif
    	#ifdef USE_SHEEN
    		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
    	#endif
    	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
    	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
    }
    void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
    	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
    }
    void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
    	#ifdef USE_CLEARCOAT
    		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
    	#endif
    	#ifdef USE_SHEEN
    		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
    	#endif
    	vec3 singleScattering = vec3( 0.0 );
    	vec3 multiScattering = vec3( 0.0 );
    	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
    	#ifdef USE_IRIDESCENCE
    		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
    	#else
    		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
    	#endif
    	vec3 totalScattering = singleScattering + multiScattering;
    	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
    	reflectedLight.indirectSpecular += radiance * singleScattering;
    	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
    	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
    }
    #define RE_Direct				RE_Direct_Physical
    #define RE_Direct_RectArea		RE_Direct_RectArea_Physical
    #define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
    #define RE_IndirectSpecular		RE_IndirectSpecular_Physical
    float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
    	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
    }`,
    gS = `
    vec3 geometryPosition = - vViewPosition;
    vec3 geometryNormal = normal;
    vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
    vec3 geometryClearcoatNormal = vec3( 0.0 );
    #ifdef USE_CLEARCOAT
    	geometryClearcoatNormal = clearcoatNormal;
    #endif
    #ifdef USE_IRIDESCENCE
    	float dotNVi = saturate( dot( normal, geometryViewDir ) );
    	if ( material.iridescenceThickness == 0.0 ) {
    		material.iridescence = 0.0;
    	} else {
    		material.iridescence = saturate( material.iridescence );
    	}
    	if ( material.iridescence > 0.0 ) {
    		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
    		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
    	}
    #endif
    IncidentLight directLight;
    #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
    	PointLight pointLight;
    	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
    	PointLightShadow pointLightShadow;
    	#endif
    	#pragma unroll_loop_start
    	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
    		pointLight = pointLights[ i ];
    		getPointLightInfo( pointLight, geometryPosition, directLight );
    		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
    		pointLightShadow = pointLightShadows[ i ];
    		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
    		#endif
    		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
    	}
    	#pragma unroll_loop_end
    #endif
    #if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
    	SpotLight spotLight;
    	vec4 spotColor;
    	vec3 spotLightCoord;
    	bool inSpotLightMap;
    	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
    	SpotLightShadow spotLightShadow;
    	#endif
    	#pragma unroll_loop_start
    	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
    		spotLight = spotLights[ i ];
    		getSpotLightInfo( spotLight, geometryPosition, directLight );
    		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
    		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
    		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
    		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
    		#else
    		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
    		#endif
    		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
    			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
    			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
    			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
    			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
    		#endif
    		#undef SPOT_LIGHT_MAP_INDEX
    		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
    		spotLightShadow = spotLightShadows[ i ];
    		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
    		#endif
    		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
    	}
    	#pragma unroll_loop_end
    #endif
    #if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
    	DirectionalLight directionalLight;
    	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
    	DirectionalLightShadow directionalLightShadow;
    	#endif
    	#pragma unroll_loop_start
    	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
    		directionalLight = directionalLights[ i ];
    		getDirectionalLightInfo( directionalLight, directLight );
    		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
    		directionalLightShadow = directionalLightShadows[ i ];
    		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
    		#endif
    		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
    	}
    	#pragma unroll_loop_end
    #endif
    #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
    	RectAreaLight rectAreaLight;
    	#pragma unroll_loop_start
    	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
    		rectAreaLight = rectAreaLights[ i ];
    		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
    	}
    	#pragma unroll_loop_end
    #endif
    #if defined( RE_IndirectDiffuse )
    	vec3 iblIrradiance = vec3( 0.0 );
    	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
    	#if defined( USE_LIGHT_PROBES )
    		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
    	#endif
    	#if ( NUM_HEMI_LIGHTS > 0 )
    		#pragma unroll_loop_start
    		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
    			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
    		}
    		#pragma unroll_loop_end
    	#endif
    #endif
    #if defined( RE_IndirectSpecular )
    	vec3 radiance = vec3( 0.0 );
    	vec3 clearcoatRadiance = vec3( 0.0 );
    #endif`,
    vS = `#if defined( RE_IndirectDiffuse )
    	#ifdef USE_LIGHTMAP
    		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
    		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
    		irradiance += lightMapIrradiance;
    	#endif
    	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
    		iblIrradiance += getIBLIrradiance( geometryNormal );
    	#endif
    #endif
    #if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
    	#ifdef USE_ANISOTROPY
    		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
    	#else
    		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
    	#endif
    	#ifdef USE_CLEARCOAT
    		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
    	#endif
    #endif`,
    xS = `#if defined( RE_IndirectDiffuse )
    	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
    #endif
    #if defined( RE_IndirectSpecular )
    	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
    #endif`,
    yS = `#if defined( USE_LOGDEPTHBUF )
    	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
    #endif`,
    _S = `#if defined( USE_LOGDEPTHBUF )
    	uniform float logDepthBufFC;
    	varying float vFragDepth;
    	varying float vIsPerspective;
    #endif`,
    wS = `#ifdef USE_LOGDEPTHBUF
    	varying float vFragDepth;
    	varying float vIsPerspective;
    #endif`,
    ES = `#ifdef USE_LOGDEPTHBUF
    	vFragDepth = 1.0 + gl_Position.w;
    	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
    #endif`,
    CS = `#ifdef USE_MAP
    	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
    	#ifdef DECODE_VIDEO_TEXTURE
    		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
    	
    	#endif
    	diffuseColor *= sampledDiffuseColor;
    #endif`,
    SS = `#ifdef USE_MAP
    	uniform sampler2D map;
    #endif`,
    MS = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
    	#if defined( USE_POINTS_UV )
    		vec2 uv = vUv;
    	#else
    		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
    	#endif
    #endif
    #ifdef USE_MAP
    	diffuseColor *= texture2D( map, uv );
    #endif
    #ifdef USE_ALPHAMAP
    	diffuseColor.a *= texture2D( alphaMap, uv ).g;
    #endif`,
    bS = `#if defined( USE_POINTS_UV )
    	varying vec2 vUv;
    #else
    	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
    		uniform mat3 uvTransform;
    	#endif
    #endif
    #ifdef USE_MAP
    	uniform sampler2D map;
    #endif
    #ifdef USE_ALPHAMAP
    	uniform sampler2D alphaMap;
    #endif`,
    TS = `float metalnessFactor = metalness;
    #ifdef USE_METALNESSMAP
    	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
    	metalnessFactor *= texelMetalness.b;
    #endif`,
    IS = `#ifdef USE_METALNESSMAP
    	uniform sampler2D metalnessMap;
    #endif`,
    BS = `#ifdef USE_INSTANCING_MORPH
    	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
    	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
    	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
    		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
    	}
    #endif`,
    PS = `#if defined( USE_MORPHCOLORS )
    	vColor *= morphTargetBaseInfluence;
    	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
    		#if defined( USE_COLOR_ALPHA )
    			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
    		#elif defined( USE_COLOR )
    			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
    		#endif
    	}
    #endif`,
    DS = `#ifdef USE_MORPHNORMALS
    	objectNormal *= morphTargetBaseInfluence;
    	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
    		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
    	}
    #endif`,
    RS = `#ifdef USE_MORPHTARGETS
    	#ifndef USE_INSTANCING_MORPH
    		uniform float morphTargetBaseInfluence;
    		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
    	#endif
    	uniform sampler2DArray morphTargetsTexture;
    	uniform ivec2 morphTargetsTextureSize;
    	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
    		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
    		int y = texelIndex / morphTargetsTextureSize.x;
    		int x = texelIndex - y * morphTargetsTextureSize.x;
    		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
    		return texelFetch( morphTargetsTexture, morphUV, 0 );
    	}
    #endif`,
    US = `#ifdef USE_MORPHTARGETS
    	transformed *= morphTargetBaseInfluence;
    	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
    		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
    	}
    #endif`,
    LS = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
    #ifdef FLAT_SHADED
    	vec3 fdx = dFdx( vViewPosition );
    	vec3 fdy = dFdy( vViewPosition );
    	vec3 normal = normalize( cross( fdx, fdy ) );
    #else
    	vec3 normal = normalize( vNormal );
    	#ifdef DOUBLE_SIDED
    		normal *= faceDirection;
    	#endif
    #endif
    #if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
    	#ifdef USE_TANGENT
    		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
    	#else
    		mat3 tbn = getTangentFrame( - vViewPosition, normal,
    		#if defined( USE_NORMALMAP )
    			vNormalMapUv
    		#elif defined( USE_CLEARCOAT_NORMALMAP )
    			vClearcoatNormalMapUv
    		#else
    			vUv
    		#endif
    		);
    	#endif
    	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
    		tbn[0] *= faceDirection;
    		tbn[1] *= faceDirection;
    	#endif
    #endif
    #ifdef USE_CLEARCOAT_NORMALMAP
    	#ifdef USE_TANGENT
    		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
    	#else
    		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
    	#endif
    	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
    		tbn2[0] *= faceDirection;
    		tbn2[1] *= faceDirection;
    	#endif
    #endif
    vec3 nonPerturbedNormal = normal;`,
    FS = `#ifdef USE_NORMALMAP_OBJECTSPACE
    	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
    	#ifdef FLIP_SIDED
    		normal = - normal;
    	#endif
    	#ifdef DOUBLE_SIDED
    		normal = normal * faceDirection;
    	#endif
    	normal = normalize( normalMatrix * normal );
    #elif defined( USE_NORMALMAP_TANGENTSPACE )
    	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
    	mapN.xy *= normalScale;
    	normal = normalize( tbn * mapN );
    #elif defined( USE_BUMPMAP )
    	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
    #endif`,
    NS = `#ifndef FLAT_SHADED
    	varying vec3 vNormal;
    	#ifdef USE_TANGENT
    		varying vec3 vTangent;
    		varying vec3 vBitangent;
    	#endif
    #endif`,
    OS = `#ifndef FLAT_SHADED
    	varying vec3 vNormal;
    	#ifdef USE_TANGENT
    		varying vec3 vTangent;
    		varying vec3 vBitangent;
    	#endif
    #endif`,
    kS = `#ifndef FLAT_SHADED
    	vNormal = normalize( transformedNormal );
    	#ifdef USE_TANGENT
    		vTangent = normalize( transformedTangent );
    		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
    	#endif
    #endif`,
    zS = `#ifdef USE_NORMALMAP
    	uniform sampler2D normalMap;
    	uniform vec2 normalScale;
    #endif
    #ifdef USE_NORMALMAP_OBJECTSPACE
    	uniform mat3 normalMatrix;
    #endif
    #if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
    	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
    		vec3 q0 = dFdx( eye_pos.xyz );
    		vec3 q1 = dFdy( eye_pos.xyz );
    		vec2 st0 = dFdx( uv.st );
    		vec2 st1 = dFdy( uv.st );
    		vec3 N = surf_norm;
    		vec3 q1perp = cross( q1, N );
    		vec3 q0perp = cross( N, q0 );
    		vec3 T = q1perp * st0.x + q0perp * st1.x;
    		vec3 B = q1perp * st0.y + q0perp * st1.y;
    		float det = max( dot( T, T ), dot( B, B ) );
    		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
    		return mat3( T * scale, B * scale, N );
    	}
    #endif`,
    QS = `#ifdef USE_CLEARCOAT
    	vec3 clearcoatNormal = nonPerturbedNormal;
    #endif`,
    GS = `#ifdef USE_CLEARCOAT_NORMALMAP
    	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
    	clearcoatMapN.xy *= clearcoatNormalScale;
    	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
    #endif`,
    HS = `#ifdef USE_CLEARCOATMAP
    	uniform sampler2D clearcoatMap;
    #endif
    #ifdef USE_CLEARCOAT_NORMALMAP
    	uniform sampler2D clearcoatNormalMap;
    	uniform vec2 clearcoatNormalScale;
    #endif
    #ifdef USE_CLEARCOAT_ROUGHNESSMAP
    	uniform sampler2D clearcoatRoughnessMap;
    #endif`,
    VS = `#ifdef USE_IRIDESCENCEMAP
    	uniform sampler2D iridescenceMap;
    #endif
    #ifdef USE_IRIDESCENCE_THICKNESSMAP
    	uniform sampler2D iridescenceThicknessMap;
    #endif`,
    WS = `#ifdef OPAQUE
    diffuseColor.a = 1.0;
    #endif
    #ifdef USE_TRANSMISSION
    diffuseColor.a *= material.transmissionAlpha;
    #endif
    gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
    YS = `vec3 packNormalToRGB( const in vec3 normal ) {
    	return normalize( normal ) * 0.5 + 0.5;
    }
    vec3 unpackRGBToNormal( const in vec3 rgb ) {
    	return 2.0 * rgb.xyz - 1.0;
    }
    const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
    const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
    const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
    const float ShiftRight8 = 1. / 256.;
    vec4 packDepthToRGBA( const in float v ) {
    	vec4 r = vec4( fract( v * PackFactors ), v );
    	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
    }
    float unpackRGBAToDepth( const in vec4 v ) {
    	return dot( v, UnpackFactors );
    }
    vec2 packDepthToRG( in highp float v ) {
    	return packDepthToRGBA( v ).yx;
    }
    float unpackRGToDepth( const in highp vec2 v ) {
    	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
    }
    vec4 pack2HalfToRGBA( vec2 v ) {
    	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
    	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
    }
    vec2 unpackRGBATo2Half( vec4 v ) {
    	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
    }
    float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
    	return ( viewZ + near ) / ( near - far );
    }
    float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
    	return depth * ( near - far ) - near;
    }
    float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
    	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
    }
    float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
    	return ( near * far ) / ( ( far - near ) * depth - far );
    }`,
    qS = `#ifdef PREMULTIPLIED_ALPHA
    	gl_FragColor.rgb *= gl_FragColor.a;
    #endif`,
    XS = `vec4 mvPosition = vec4( transformed, 1.0 );
    #ifdef USE_BATCHING
    	mvPosition = batchingMatrix * mvPosition;
    #endif
    #ifdef USE_INSTANCING
    	mvPosition = instanceMatrix * mvPosition;
    #endif
    mvPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * mvPosition;`,
    KS = `#ifdef DITHERING
    	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
    #endif`,
    JS = `#ifdef DITHERING
    	vec3 dithering( vec3 color ) {
    		float grid_position = rand( gl_FragCoord.xy );
    		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
    		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
    		return color + dither_shift_RGB;
    	}
    #endif`,
    jS = `float roughnessFactor = roughness;
    #ifdef USE_ROUGHNESSMAP
    	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
    	roughnessFactor *= texelRoughness.g;
    #endif`,
    ZS = `#ifdef USE_ROUGHNESSMAP
    	uniform sampler2D roughnessMap;
    #endif`,
    $S = `#if NUM_SPOT_LIGHT_COORDS > 0
    	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
    #endif
    #if NUM_SPOT_LIGHT_MAPS > 0
    	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
    #endif
    #ifdef USE_SHADOWMAP
    	#if NUM_DIR_LIGHT_SHADOWS > 0
    		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
    		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
    		struct DirectionalLightShadow {
    			float shadowBias;
    			float shadowNormalBias;
    			float shadowRadius;
    			vec2 shadowMapSize;
    		};
    		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
    	#endif
    	#if NUM_SPOT_LIGHT_SHADOWS > 0
    		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
    		struct SpotLightShadow {
    			float shadowBias;
    			float shadowNormalBias;
    			float shadowRadius;
    			vec2 shadowMapSize;
    		};
    		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
    	#endif
    	#if NUM_POINT_LIGHT_SHADOWS > 0
    		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
    		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
    		struct PointLightShadow {
    			float shadowBias;
    			float shadowNormalBias;
    			float shadowRadius;
    			vec2 shadowMapSize;
    			float shadowCameraNear;
    			float shadowCameraFar;
    		};
    		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
    	#endif
    	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
    		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
    	}
    	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
    		return unpackRGBATo2Half( texture2D( shadow, uv ) );
    	}
    	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
    		float occlusion = 1.0;
    		vec2 distribution = texture2DDistribution( shadow, uv );
    		float hard_shadow = step( compare , distribution.x );
    		if (hard_shadow != 1.0 ) {
    			float distance = compare - distribution.x ;
    			float variance = max( 0.00000, distribution.y * distribution.y );
    			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
    		}
    		return occlusion;
    	}
    	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
    		float shadow = 1.0;
    		shadowCoord.xyz /= shadowCoord.w;
    		shadowCoord.z += shadowBias;
    		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
    		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
    		if ( frustumTest ) {
    		#if defined( SHADOWMAP_TYPE_PCF )
    			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
    			float dx0 = - texelSize.x * shadowRadius;
    			float dy0 = - texelSize.y * shadowRadius;
    			float dx1 = + texelSize.x * shadowRadius;
    			float dy1 = + texelSize.y * shadowRadius;
    			float dx2 = dx0 / 2.0;
    			float dy2 = dy0 / 2.0;
    			float dx3 = dx1 / 2.0;
    			float dy3 = dy1 / 2.0;
    			shadow = (
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
    			) * ( 1.0 / 17.0 );
    		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
    			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
    			float dx = texelSize.x;
    			float dy = texelSize.y;
    			vec2 uv = shadowCoord.xy;
    			vec2 f = fract( uv * shadowMapSize + 0.5 );
    			uv -= f * texelSize;
    			shadow = (
    				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
    				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
    				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
    				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
    					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
    					 f.x ) +
    				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
    					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
    					 f.x ) +
    				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
    					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
    					 f.y ) +
    				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
    					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
    					 f.y ) +
    				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
    						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
    						  f.x ),
    					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
    						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
    						  f.x ),
    					 f.y )
    			) * ( 1.0 / 9.0 );
    		#elif defined( SHADOWMAP_TYPE_VSM )
    			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
    		#else
    			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
    		#endif
    		}
    		return shadow;
    	}
    	vec2 cubeToUV( vec3 v, float texelSizeY ) {
    		vec3 absV = abs( v );
    		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
    		absV *= scaleToCube;
    		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
    		vec2 planar = v.xy;
    		float almostATexel = 1.5 * texelSizeY;
    		float almostOne = 1.0 - almostATexel;
    		if ( absV.z >= almostOne ) {
    			if ( v.z > 0.0 )
    				planar.x = 4.0 - v.x;
    		} else if ( absV.x >= almostOne ) {
    			float signX = sign( v.x );
    			planar.x = v.z * signX + 2.0 * signX;
    		} else if ( absV.y >= almostOne ) {
    			float signY = sign( v.y );
    			planar.x = v.x + 2.0 * signY + 2.0;
    			planar.y = v.z * signY - 2.0;
    		}
    		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
    	}
    	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
    		float shadow = 1.0;
    		vec3 lightToPosition = shadowCoord.xyz;
    		
    		float lightToPositionLength = length( lightToPosition );
    		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
    			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
    			vec3 bd3D = normalize( lightToPosition );
    			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
    			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
    				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
    				shadow = (
    					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
    					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
    					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
    					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
    					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
    					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
    					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
    					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
    					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
    				) * ( 1.0 / 9.0 );
    			#else
    				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
    			#endif
    		}
    		return shadow;
    	}
    #endif`,
    eM = `#if NUM_SPOT_LIGHT_COORDS > 0
    	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
    	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
    #endif
    #ifdef USE_SHADOWMAP
    	#if NUM_DIR_LIGHT_SHADOWS > 0
    		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
    		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
    		struct DirectionalLightShadow {
    			float shadowBias;
    			float shadowNormalBias;
    			float shadowRadius;
    			vec2 shadowMapSize;
    		};
    		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
    	#endif
    	#if NUM_SPOT_LIGHT_SHADOWS > 0
    		struct SpotLightShadow {
    			float shadowBias;
    			float shadowNormalBias;
    			float shadowRadius;
    			vec2 shadowMapSize;
    		};
    		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
    	#endif
    	#if NUM_POINT_LIGHT_SHADOWS > 0
    		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
    		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
    		struct PointLightShadow {
    			float shadowBias;
    			float shadowNormalBias;
    			float shadowRadius;
    			vec2 shadowMapSize;
    			float shadowCameraNear;
    			float shadowCameraFar;
    		};
    		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
    	#endif
    #endif`,
    tM = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
    	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
    	vec4 shadowWorldPosition;
    #endif
    #if defined( USE_SHADOWMAP )
    	#if NUM_DIR_LIGHT_SHADOWS > 0
    		#pragma unroll_loop_start
    		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
    			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
    			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
    		}
    		#pragma unroll_loop_end
    	#endif
    	#if NUM_POINT_LIGHT_SHADOWS > 0
    		#pragma unroll_loop_start
    		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
    			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
    			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
    		}
    		#pragma unroll_loop_end
    	#endif
    #endif
    #if NUM_SPOT_LIGHT_COORDS > 0
    	#pragma unroll_loop_start
    	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
    		shadowWorldPosition = worldPosition;
    		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
    			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
    		#endif
    		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
    	}
    	#pragma unroll_loop_end
    #endif`,
    iM = `float getShadowMask() {
    	float shadow = 1.0;
    	#ifdef USE_SHADOWMAP
    	#if NUM_DIR_LIGHT_SHADOWS > 0
    	DirectionalLightShadow directionalLight;
    	#pragma unroll_loop_start
    	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
    		directionalLight = directionalLightShadows[ i ];
    		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
    	}
    	#pragma unroll_loop_end
    	#endif
    	#if NUM_SPOT_LIGHT_SHADOWS > 0
    	SpotLightShadow spotLight;
    	#pragma unroll_loop_start
    	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
    		spotLight = spotLightShadows[ i ];
    		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
    	}
    	#pragma unroll_loop_end
    	#endif
    	#if NUM_POINT_LIGHT_SHADOWS > 0
    	PointLightShadow pointLight;
    	#pragma unroll_loop_start
    	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
    		pointLight = pointLightShadows[ i ];
    		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
    	}
    	#pragma unroll_loop_end
    	#endif
    	#endif
    	return shadow;
    }`,
    sM = `#ifdef USE_SKINNING
    	mat4 boneMatX = getBoneMatrix( skinIndex.x );
    	mat4 boneMatY = getBoneMatrix( skinIndex.y );
    	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
    	mat4 boneMatW = getBoneMatrix( skinIndex.w );
    #endif`,
    nM = `#ifdef USE_SKINNING
    	uniform mat4 bindMatrix;
    	uniform mat4 bindMatrixInverse;
    	uniform highp sampler2D boneTexture;
    	mat4 getBoneMatrix( const in float i ) {
    		int size = textureSize( boneTexture, 0 ).x;
    		int j = int( i ) * 4;
    		int x = j % size;
    		int y = j / size;
    		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
    		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
    		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
    		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
    		return mat4( v1, v2, v3, v4 );
    	}
    #endif`,
    rM = `#ifdef USE_SKINNING
    	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
    	vec4 skinned = vec4( 0.0 );
    	skinned += boneMatX * skinVertex * skinWeight.x;
    	skinned += boneMatY * skinVertex * skinWeight.y;
    	skinned += boneMatZ * skinVertex * skinWeight.z;
    	skinned += boneMatW * skinVertex * skinWeight.w;
    	transformed = ( bindMatrixInverse * skinned ).xyz;
    #endif`,
    aM = `#ifdef USE_SKINNING
    	mat4 skinMatrix = mat4( 0.0 );
    	skinMatrix += skinWeight.x * boneMatX;
    	skinMatrix += skinWeight.y * boneMatY;
    	skinMatrix += skinWeight.z * boneMatZ;
    	skinMatrix += skinWeight.w * boneMatW;
    	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
    	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
    	#ifdef USE_TANGENT
    		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
    	#endif
    #endif`,
    oM = `float specularStrength;
    #ifdef USE_SPECULARMAP
    	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
    	specularStrength = texelSpecular.r;
    #else
    	specularStrength = 1.0;
    #endif`,
    lM = `#ifdef USE_SPECULARMAP
    	uniform sampler2D specularMap;
    #endif`,
    cM = `#if defined( TONE_MAPPING )
    	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
    #endif`,
    hM = `#ifndef saturate
    #define saturate( a ) clamp( a, 0.0, 1.0 )
    #endif
    uniform float toneMappingExposure;
    vec3 LinearToneMapping( vec3 color ) {
    	return saturate( toneMappingExposure * color );
    }
    vec3 ReinhardToneMapping( vec3 color ) {
    	color *= toneMappingExposure;
    	return saturate( color / ( vec3( 1.0 ) + color ) );
    }
    vec3 OptimizedCineonToneMapping( vec3 color ) {
    	color *= toneMappingExposure;
    	color = max( vec3( 0.0 ), color - 0.004 );
    	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
    }
    vec3 RRTAndODTFit( vec3 v ) {
    	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
    	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
    	return a / b;
    }
    vec3 ACESFilmicToneMapping( vec3 color ) {
    	const mat3 ACESInputMat = mat3(
    		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
    		vec3( 0.04823, 0.01566, 0.83777 )
    	);
    	const mat3 ACESOutputMat = mat3(
    		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
    		vec3( -0.07367, -0.00605,  1.07602 )
    	);
    	color *= toneMappingExposure / 0.6;
    	color = ACESInputMat * color;
    	color = RRTAndODTFit( color );
    	color = ACESOutputMat * color;
    	return saturate( color );
    }
    const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
    	vec3( 1.6605, - 0.1246, - 0.0182 ),
    	vec3( - 0.5876, 1.1329, - 0.1006 ),
    	vec3( - 0.0728, - 0.0083, 1.1187 )
    );
    const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
    	vec3( 0.6274, 0.0691, 0.0164 ),
    	vec3( 0.3293, 0.9195, 0.0880 ),
    	vec3( 0.0433, 0.0113, 0.8956 )
    );
    vec3 agxDefaultContrastApprox( vec3 x ) {
    	vec3 x2 = x * x;
    	vec3 x4 = x2 * x2;
    	return + 15.5 * x4 * x2
    		- 40.14 * x4 * x
    		+ 31.96 * x4
    		- 6.868 * x2 * x
    		+ 0.4298 * x2
    		+ 0.1191 * x
    		- 0.00232;
    }
    vec3 AgXToneMapping( vec3 color ) {
    	const mat3 AgXInsetMatrix = mat3(
    		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
    		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
    		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
    	);
    	const mat3 AgXOutsetMatrix = mat3(
    		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
    		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
    		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
    	);
    	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
    	color *= toneMappingExposure;
    	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
    	color = AgXInsetMatrix * color;
    	color = max( color, 1e-10 );	color = log2( color );
    	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
    	color = clamp( color, 0.0, 1.0 );
    	color = agxDefaultContrastApprox( color );
    	color = AgXOutsetMatrix * color;
    	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
    	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
    	color = clamp( color, 0.0, 1.0 );
    	return color;
    }
    vec3 NeutralToneMapping( vec3 color ) {
    	const float StartCompression = 0.8 - 0.04;
    	const float Desaturation = 0.15;
    	color *= toneMappingExposure;
    	float x = min( color.r, min( color.g, color.b ) );
    	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
    	color -= offset;
    	float peak = max( color.r, max( color.g, color.b ) );
    	if ( peak < StartCompression ) return color;
    	float d = 1. - StartCompression;
    	float newPeak = 1. - d * d / ( peak + d - StartCompression );
    	color *= newPeak / peak;
    	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
    	return mix( color, vec3( newPeak ), g );
    }
    vec3 CustomToneMapping( vec3 color ) { return color; }`,
    uM = `#ifdef USE_TRANSMISSION
    	material.transmission = transmission;
    	material.transmissionAlpha = 1.0;
    	material.thickness = thickness;
    	material.attenuationDistance = attenuationDistance;
    	material.attenuationColor = attenuationColor;
    	#ifdef USE_TRANSMISSIONMAP
    		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
    	#endif
    	#ifdef USE_THICKNESSMAP
    		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
    	#endif
    	vec3 pos = vWorldPosition;
    	vec3 v = normalize( cameraPosition - pos );
    	vec3 n = inverseTransformDirection( normal, viewMatrix );
    	vec4 transmitted = getIBLVolumeRefraction(
    		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
    		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
    		material.attenuationColor, material.attenuationDistance );
    	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
    	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
    #endif`,
    dM = `#ifdef USE_TRANSMISSION
    	uniform float transmission;
    	uniform float thickness;
    	uniform float attenuationDistance;
    	uniform vec3 attenuationColor;
    	#ifdef USE_TRANSMISSIONMAP
    		uniform sampler2D transmissionMap;
    	#endif
    	#ifdef USE_THICKNESSMAP
    		uniform sampler2D thicknessMap;
    	#endif
    	uniform vec2 transmissionSamplerSize;
    	uniform sampler2D transmissionSamplerMap;
    	uniform mat4 modelMatrix;
    	uniform mat4 projectionMatrix;
    	varying vec3 vWorldPosition;
    	float w0( float a ) {
    		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
    	}
    	float w1( float a ) {
    		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
    	}
    	float w2( float a ){
    		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
    	}
    	float w3( float a ) {
    		return ( 1.0 / 6.0 ) * ( a * a * a );
    	}
    	float g0( float a ) {
    		return w0( a ) + w1( a );
    	}
    	float g1( float a ) {
    		return w2( a ) + w3( a );
    	}
    	float h0( float a ) {
    		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
    	}
    	float h1( float a ) {
    		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
    	}
    	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
    		uv = uv * texelSize.zw + 0.5;
    		vec2 iuv = floor( uv );
    		vec2 fuv = fract( uv );
    		float g0x = g0( fuv.x );
    		float g1x = g1( fuv.x );
    		float h0x = h0( fuv.x );
    		float h1x = h1( fuv.x );
    		float h0y = h0( fuv.y );
    		float h1y = h1( fuv.y );
    		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
    		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
    		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
    		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
    		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
    			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
    	}
    	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
    		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
    		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
    		vec2 fLodSizeInv = 1.0 / fLodSize;
    		vec2 cLodSizeInv = 1.0 / cLodSize;
    		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
    		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
    		return mix( fSample, cSample, fract( lod ) );
    	}
    	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
    		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
    		vec3 modelScale;
    		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
    		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
    		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
    		return normalize( refractionVector ) * thickness * modelScale;
    	}
    	float applyIorToRoughness( const in float roughness, const in float ior ) {
    		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
    	}
    	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
    		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
    		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
    	}
    	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
    		if ( isinf( attenuationDistance ) ) {
    			return vec3( 1.0 );
    		} else {
    			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
    			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
    		}
    	}
    	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
    		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
    		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
    		const in vec3 attenuationColor, const in float attenuationDistance ) {
    		vec4 transmittedLight;
    		vec3 transmittance;
    		#ifdef USE_DISPERSION
    			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
    			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
    			for ( int i = 0; i < 3; i ++ ) {
    				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
    				vec3 refractedRayExit = position + transmissionRay;
    		
    				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
    				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
    				refractionCoords += 1.0;
    				refractionCoords /= 2.0;
    		
    				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
    				transmittedLight[ i ] = transmissionSample[ i ];
    				transmittedLight.a += transmissionSample.a;
    				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
    			}
    			transmittedLight.a /= 3.0;
    		
    		#else
    		
    			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
    			vec3 refractedRayExit = position + transmissionRay;
    			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
    			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
    			refractionCoords += 1.0;
    			refractionCoords /= 2.0;
    			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
    			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
    		
    		#endif
    		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
    		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
    		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
    		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
    	}
    #endif`,
    fM = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
    	varying vec2 vUv;
    #endif
    #ifdef USE_MAP
    	varying vec2 vMapUv;
    #endif
    #ifdef USE_ALPHAMAP
    	varying vec2 vAlphaMapUv;
    #endif
    #ifdef USE_LIGHTMAP
    	varying vec2 vLightMapUv;
    #endif
    #ifdef USE_AOMAP
    	varying vec2 vAoMapUv;
    #endif
    #ifdef USE_BUMPMAP
    	varying vec2 vBumpMapUv;
    #endif
    #ifdef USE_NORMALMAP
    	varying vec2 vNormalMapUv;
    #endif
    #ifdef USE_EMISSIVEMAP
    	varying vec2 vEmissiveMapUv;
    #endif
    #ifdef USE_METALNESSMAP
    	varying vec2 vMetalnessMapUv;
    #endif
    #ifdef USE_ROUGHNESSMAP
    	varying vec2 vRoughnessMapUv;
    #endif
    #ifdef USE_ANISOTROPYMAP
    	varying vec2 vAnisotropyMapUv;
    #endif
    #ifdef USE_CLEARCOATMAP
    	varying vec2 vClearcoatMapUv;
    #endif
    #ifdef USE_CLEARCOAT_NORMALMAP
    	varying vec2 vClearcoatNormalMapUv;
    #endif
    #ifdef USE_CLEARCOAT_ROUGHNESSMAP
    	varying vec2 vClearcoatRoughnessMapUv;
    #endif
    #ifdef USE_IRIDESCENCEMAP
    	varying vec2 vIridescenceMapUv;
    #endif
    #ifdef USE_IRIDESCENCE_THICKNESSMAP
    	varying vec2 vIridescenceThicknessMapUv;
    #endif
    #ifdef USE_SHEEN_COLORMAP
    	varying vec2 vSheenColorMapUv;
    #endif
    #ifdef USE_SHEEN_ROUGHNESSMAP
    	varying vec2 vSheenRoughnessMapUv;
    #endif
    #ifdef USE_SPECULARMAP
    	varying vec2 vSpecularMapUv;
    #endif
    #ifdef USE_SPECULAR_COLORMAP
    	varying vec2 vSpecularColorMapUv;
    #endif
    #ifdef USE_SPECULAR_INTENSITYMAP
    	varying vec2 vSpecularIntensityMapUv;
    #endif
    #ifdef USE_TRANSMISSIONMAP
    	uniform mat3 transmissionMapTransform;
    	varying vec2 vTransmissionMapUv;
    #endif
    #ifdef USE_THICKNESSMAP
    	uniform mat3 thicknessMapTransform;
    	varying vec2 vThicknessMapUv;
    #endif`,
    pM = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
    	varying vec2 vUv;
    #endif
    #ifdef USE_MAP
    	uniform mat3 mapTransform;
    	varying vec2 vMapUv;
    #endif
    #ifdef USE_ALPHAMAP
    	uniform mat3 alphaMapTransform;
    	varying vec2 vAlphaMapUv;
    #endif
    #ifdef USE_LIGHTMAP
    	uniform mat3 lightMapTransform;
    	varying vec2 vLightMapUv;
    #endif
    #ifdef USE_AOMAP
    	uniform mat3 aoMapTransform;
    	varying vec2 vAoMapUv;
    #endif
    #ifdef USE_BUMPMAP
    	uniform mat3 bumpMapTransform;
    	varying vec2 vBumpMapUv;
    #endif
    #ifdef USE_NORMALMAP
    	uniform mat3 normalMapTransform;
    	varying vec2 vNormalMapUv;
    #endif
    #ifdef USE_DISPLACEMENTMAP
    	uniform mat3 displacementMapTransform;
    	varying vec2 vDisplacementMapUv;
    #endif
    #ifdef USE_EMISSIVEMAP
    	uniform mat3 emissiveMapTransform;
    	varying vec2 vEmissiveMapUv;
    #endif
    #ifdef USE_METALNESSMAP
    	uniform mat3 metalnessMapTransform;
    	varying vec2 vMetalnessMapUv;
    #endif
    #ifdef USE_ROUGHNESSMAP
    	uniform mat3 roughnessMapTransform;
    	varying vec2 vRoughnessMapUv;
    #endif
    #ifdef USE_ANISOTROPYMAP
    	uniform mat3 anisotropyMapTransform;
    	varying vec2 vAnisotropyMapUv;
    #endif
    #ifdef USE_CLEARCOATMAP
    	uniform mat3 clearcoatMapTransform;
    	varying vec2 vClearcoatMapUv;
    #endif
    #ifdef USE_CLEARCOAT_NORMALMAP
    	uniform mat3 clearcoatNormalMapTransform;
    	varying vec2 vClearcoatNormalMapUv;
    #endif
    #ifdef USE_CLEARCOAT_ROUGHNESSMAP
    	uniform mat3 clearcoatRoughnessMapTransform;
    	varying vec2 vClearcoatRoughnessMapUv;
    #endif
    #ifdef USE_SHEEN_COLORMAP
    	uniform mat3 sheenColorMapTransform;
    	varying vec2 vSheenColorMapUv;
    #endif
    #ifdef USE_SHEEN_ROUGHNESSMAP
    	uniform mat3 sheenRoughnessMapTransform;
    	varying vec2 vSheenRoughnessMapUv;
    #endif
    #ifdef USE_IRIDESCENCEMAP
    	uniform mat3 iridescenceMapTransform;
    	varying vec2 vIridescenceMapUv;
    #endif
    #ifdef USE_IRIDESCENCE_THICKNESSMAP
    	uniform mat3 iridescenceThicknessMapTransform;
    	varying vec2 vIridescenceThicknessMapUv;
    #endif
    #ifdef USE_SPECULARMAP
    	uniform mat3 specularMapTransform;
    	varying vec2 vSpecularMapUv;
    #endif
    #ifdef USE_SPECULAR_COLORMAP
    	uniform mat3 specularColorMapTransform;
    	varying vec2 vSpecularColorMapUv;
    #endif
    #ifdef USE_SPECULAR_INTENSITYMAP
    	uniform mat3 specularIntensityMapTransform;
    	varying vec2 vSpecularIntensityMapUv;
    #endif
    #ifdef USE_TRANSMISSIONMAP
    	uniform mat3 transmissionMapTransform;
    	varying vec2 vTransmissionMapUv;
    #endif
    #ifdef USE_THICKNESSMAP
    	uniform mat3 thicknessMapTransform;
    	varying vec2 vThicknessMapUv;
    #endif`,
    mM = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
    	vUv = vec3( uv, 1 ).xy;
    #endif
    #ifdef USE_MAP
    	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_ALPHAMAP
    	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_LIGHTMAP
    	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_AOMAP
    	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_BUMPMAP
    	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_NORMALMAP
    	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_DISPLACEMENTMAP
    	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_EMISSIVEMAP
    	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_METALNESSMAP
    	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_ROUGHNESSMAP
    	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_ANISOTROPYMAP
    	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_CLEARCOATMAP
    	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_CLEARCOAT_NORMALMAP
    	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_CLEARCOAT_ROUGHNESSMAP
    	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_IRIDESCENCEMAP
    	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_IRIDESCENCE_THICKNESSMAP
    	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_SHEEN_COLORMAP
    	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_SHEEN_ROUGHNESSMAP
    	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_SPECULARMAP
    	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_SPECULAR_COLORMAP
    	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_SPECULAR_INTENSITYMAP
    	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_TRANSMISSIONMAP
    	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
    #endif
    #ifdef USE_THICKNESSMAP
    	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
    #endif`,
    AM = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
    	vec4 worldPosition = vec4( transformed, 1.0 );
    	#ifdef USE_BATCHING
    		worldPosition = batchingMatrix * worldPosition;
    	#endif
    	#ifdef USE_INSTANCING
    		worldPosition = instanceMatrix * worldPosition;
    	#endif
    	worldPosition = modelMatrix * worldPosition;
    #endif`;
