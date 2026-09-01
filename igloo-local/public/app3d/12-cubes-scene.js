class k3 {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.init()
    }
    init()
    {
        const e = new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                uProgress: {
                    value: 0
                },
                uColor1: {
                    value: new Z("#c9d0df")
                },
                uColor2: {
                    value: new Z("#545b6b")
                },
                tPerlin: {
                    value: le.load("perlin-datatexture.ktx2", "colordata-repeat")
                },
                tDotPattern: {
                    value: le.load("cubes/dot_pattern.ktx2", "srgb-repeat")
                },
                tBlue: {
                    value: le.load("noises/blue-8-128-rgb.ktx2", "colordata-repeat")
                },
                uBlueOffset: {
                    value: new H
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}

                            varying vec2 vUv;

                            void main() {
                                vUv = uv;
                                gl_Position = vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}
                            ${Uc}

                            varying vec2 vUv;

                            uniform float uProgress;
                            uniform vec3 uColor1;
                            uniform vec3 uColor2;
                            uniform sampler2D tPerlin;
                            uniform sampler2D tDotPattern;
                            uniform sampler2D tBlue;
                            uniform vec2 uBlueOffset;

                            float hash12(vec2 p) {
                                vec3 p3  = fract(vec3(p.xyx) * .1031);
                                p3 += dot(p3, p3.yzx + 33.33);
                                return fract((p3.x + p3.y) * p3.z);
                            }

                            float quadraticInOut(float t) {
                                float p = 2.0 * t * t;
                                return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
                            }

                            void main() {
                                vec2 screenUv = vUv;
                                screenUv.x *= aspect;
                                screenUv *= 0.3;

                                float t = time * 0.075;

                                vec2 offset1 = vec2(-t, t * 0.25);
                                vec2 offset2 = vec2(t, -t * 0.5);

                                // match scroll
                                offset1.y -= uProgress * 0.25;
                                offset1.y -= uProgress * 0.4;

                                // perlin noise
                                float perlin = texture2D(tPerlin, screenUv + offset1).r;
                                perlin += texture2D(tPerlin, screenUv * 0.5 + offset2).r;
                                perlin *= 0.5;
                                vec3 color = mix(uColor1, uColor2, perlin);

                                // dot pattern
                                vec2 dotUv = screenUv * 45.0;
                                dotUv += vec2(0.0, -uProgress * 10.0);
                                float dots = texture2D(tDotPattern, dotUv).r;
                                float dotid = hash12(floor(dotUv));
                                float dotfade = 1.0 - abs(fract(dotid + time * 0.1) - 0.5) * 2.0;
                                color += dots * dotfade;

                                // blue noise to prevent banding
                                vec4 noise = getNoise(tBlue, gl_FragCoord.xy, uBlueOffset);
                                color += noise.rgb * 0.05;

                                gl_FragColor = vec4(color, 1.0);
                            }
                        `,
            depthTest: !1,
            depthWrite: !1
        });
        this.mesh = new Ce(Si.triangle, e),
        this.mesh.name = "bg",
        this.mesh.frustumCulled = !1,
        this.mesh.renderOrder = -99,
        this.mesh.updateMatrixWorld(!0),
        this.mesh.matrixAutoUpdate = !1,
        this.scene.add(this.mesh),
        this.isReady()
    }
    update(e)
    {
        this.mesh.material.uniforms.uBlueOffset.value.set(Math.random(), Math.random()),
        this.mesh.material.uniforms.uProgress.value = e
    }
}
class z3 {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.init()
    }
    async init()
    {
        const e = await zt.load("blurrytext.drc"),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    uProgress: {
                        value: 0
                    },
                    uColor1: {
                        value: new Z("#c9d0df")
                    },
                    tMap: {
                        value: le.load("cubes/blurrytext_atlas.ktx2", "srgb-repeat")
                    },
                    tPerlin: {
                        value: le.load("perlin-datatexture.png", "srgb-repeat")
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                attribute vec3 centr;

                                varying vec2 vUv;
                                varying float vAlpha;

                                uniform float uProgress;
                                uniform sampler2D tPerlin;

                                void main() {
                                    // text animated in screen space, not world space
                                    vec3 localpos = position - centr;
                                    vec3 offset = centr;
                                    offset.x /= aspect;

                                    float depth = offset.z * 0.5 + 0.5;

                                    // scale
                                    localpos.x /= aspect;
                                    localpos *= 2.5;
                                    localpos *= mix(1.0, 2.0, depth);

                                    // match scroll
                                    offset.y = fract((offset.y * 0.5 + 0.5) + uProgress * 1.25 * depth) * 2.0 - 1.0;

                                    // spread apart
                                    offset *= 1.7;

                                    vec3 pos = localpos + offset;

                                    // fade
                                    vAlpha = texture2D(tPerlin, pos.xz * 3.0 + time * 0.075 + offset.z * 10.0).r;
                                    vAlpha = smoothstep(0.1, 0.6, vAlpha);

                                    vUv = uv;
                                    gl_Position = vec4(pos, 1.0);
                                    // gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Uc}

                                varying vec2 vUv;
                                varying float vAlpha;

                                uniform float uProgress;
                                uniform vec3 uColor1;
                                uniform sampler2D tMap;

                                float hash12(vec2 p) {
                                    vec3 p3  = fract(vec3(p.xyx) * .1031);
                                    p3 += dot(p3, p3.yzx + 33.33);
                                    return fract((p3.x + p3.y) * p3.z);
                                }

                                void main() {
                                    vec2 uv = vUv;

                                    float alpha = texture2D(tMap, uv).r * vAlpha * 1.2;
                                    vec3 color = vec3(1.0);

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                depthTest: !1,
                transparent: !0
            });
        this.mesh = new Ce(e, t),
        this.mesh.name = "blurrytext",
        this.mesh.frustumCulled = !1,
        this.mesh.renderOrder = 5,
        this.mesh.updateMatrixWorld(!0),
        this.mesh.matrixAutoUpdate = !1,
        this.scene.add(this.mesh),
        this.isReady()
    }
    update(e)
    {
        this.mesh.material.uniforms.uProgress.value = e
    }
}
const _E = 0,
    Q3 = 1,
    G3 = 2,
    Nx = 2,
    hp = 1.25,
    Ox = 1,
    dc = 6 * 4 + 4 + 4,
    Nd = 65535,
    H3 = Math.pow(2, -24),
    up = Symbol("SKIP_GENERATION");
function V3(i) {
    return i.index ? i.index.count : i.attributes.position.count
}
function $o(i) {
    return V3(i) / 3
}
function W3(i, e=ArrayBuffer) {
    return i > 65535 ? new Uint32Array(new e(4 * i)) : new Uint16Array(new e(2 * i))
}
function Y3(i, e) {
    if (!i.index) {
        const t = i.attributes.position.count,
            s = e.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer,
            n = W3(t, s);
        i.setIndex(new We(n, 1));
        for (let r = 0; r < t; r++)
            n[r] = r
    }
}
function wE(i) {
    const e = $o(i),
        t = i.drawRange,
        s = t.start / 3,
        n = (t.start + t.count) / 3,
        r = Math.max(0, s),
        a = Math.min(e, n) - r;
    return [{
        offset: Math.floor(r),
        count: Math.floor(a)
    }]
}
function EE(i) {
    if (!i.groups || !i.groups.length)
        return wE(i);
    const e = [],
        t = new Set,
        s = i.drawRange,
        n = s.start / 3,
        r = (s.start + s.count) / 3;
    for (const o of i.groups) {
        const l = o.start / 3,
            c = (o.start + o.count) / 3;
        t.add(Math.max(n, l)),
        t.add(Math.min(r, c))
    }
    const a = Array.from(t.values()).sort((o, l) => o - l);
    for (let o = 0; o < a.length - 1; o++) {
        const l = a[o],
            c = a[o + 1];
        e.push({
            offset: Math.floor(l),
            count: Math.floor(c - l)
        })
    }
    return e
}
function q3(i) {
    if (i.groups.length === 0)
        return !1;
    const e = $o(i),
        t = EE(i).sort((r, a) => r.offset - a.offset),
        s = t[t.length - 1];
    s.count = Math.min(e - s.offset, s.count);
    let n = 0;
    return t.forEach(({count: r}) => n += r), e !== n
}
function dp(i, e, t, s, n) {
    let r = 1 / 0,
        a = 1 / 0,
        o = 1 / 0,
        l = -1 / 0,
        c = -1 / 0,
        h = -1 / 0,
        d = 1 / 0,
        u = 1 / 0,
        f = 1 / 0,
        p = -1 / 0,
        A = -1 / 0,
        m = -1 / 0;
    for (let g = e * 6, x = (e + t) * 6; g < x; g += 6) {
        const v = i[g + 0],
            y = i[g + 1],
            S = v - y,
            w = v + y;
        S < r && (r = S),
        w > l && (l = w),
        v < d && (d = v),
        v > p && (p = v);
        const C = i[g + 2],
            M = i[g + 3],
            E = C - M,
            _ = C + M;
        E < a && (a = E),
        _ > c && (c = _),
        C < u && (u = C),
        C > A && (A = C);
        const I = i[g + 4],
            P = i[g + 5],
            D = I - P,
            L = I + P;
        D < o && (o = D),
        L > h && (h = L),
        I < f && (f = I),
        I > m && (m = I)
    }
    s[0] = r,
    s[1] = a,
    s[2] = o,
    s[3] = l,
    s[4] = c,
    s[5] = h,
    n[0] = d,
    n[1] = u,
    n[2] = f,
    n[3] = p,
    n[4] = A,
    n[5] = m
}
function X3(i, e=null, t=null, s=null) {
    const n = i.attributes.position,
        r = i.index ? i.index.array : null,
        a = $o(i),
        o = n.normalized;
    let l;
    e === null ? (l = new Float32Array(a * 6 * 4), t = 0, s = a) : (l = e, t = t || 0, s = s || a);
    const c = n.array,
        h = n.offset || 0;
    let d = 3;
    n.isInterleavedBufferAttribute && (d = n.data.stride);
    const u = ["getX", "getY", "getZ"];
    for (let f = t; f < t + s; f++) {
        const p = f * 3,
            A = f * 6;
        let m = p + 0,
            g = p + 1,
            x = p + 2;
        r && (m = r[m], g = r[g], x = r[x]),
        o || (m = m * d + h, g = g * d + h, x = x * d + h);
        for (let v = 0; v < 3; v++) {
            let y,
                S,
                w;
            o ? (y = n[u[v]](m), S = n[u[v]](g), w = n[u[v]](x)) : (y = c[m + v], S = c[g + v], w = c[x + v]);
            let C = y;
            S < C && (C = S),
            w < C && (C = w);
            let M = y;
            S > M && (M = S),
            w > M && (M = w);
            const E = (M - C) / 2,
                _ = v * 2;
            l[A + _ + 0] = C + E,
            l[A + _ + 1] = E + (Math.abs(C) + E) * H3
        }
    }
    return l
}
function Zt(i, e, t) {
    return t.min.x = e[i], t.min.y = e[i + 1], t.min.z = e[i + 2], t.max.x = e[i + 3], t.max.y = e[i + 4], t.max.z = e[i + 5], t
}
function kx(i) {
    let e = -1,
        t = -1 / 0;
    for (let s = 0; s < 3; s++) {
        const n = i[s + 3] - i[s];
        n > t && (t = n, e = s)
    }
    return e
}
function zx(i, e) {
    e.set(i)
}
function Qx(i, e, t) {
    let s,
        n;
    for (let r = 0; r < 3; r++) {
        const a = r + 3;
        s = i[r],
        n = e[r],
        t[r] = s < n ? s : n,
        s = i[a],
        n = e[a],
        t[a] = s > n ? s : n
    }
}
function Ph(i, e, t) {
    for (let s = 0; s < 3; s++) {
        const n = e[i + 2 * s],
            r = e[i + 2 * s + 1],
            a = n - r,
            o = n + r;
        a < t[s] && (t[s] = a),
        o > t[s + 3] && (t[s + 3] = o)
    }
}
function gl(i) {
    const e = i[3] - i[0],
        t = i[4] - i[1],
        s = i[5] - i[2];
    return 2 * (e * t + t * s + s * e)
}
const En = 32,
    K3 = (i, e) => i.candidate - e.candidate,
    jn = new Array(En).fill().map(() => ({
        count: 0,
        bounds: new Float32Array(6),
        rightCacheBounds: new Float32Array(6),
        leftCacheBounds: new Float32Array(6),
        candidate: 0
    })),
    Dh = new Float32Array(6);
function J3(i, e, t, s, n, r) {
    let a = -1,
        o = 0;
    if (r === _E)
        a = kx(e),
        a !== -1 && (o = (e[a] + e[a + 3]) / 2);
    else if (r === Q3)
        a = kx(i),
        a !== -1 && (o = j3(t, s, n, a));
    else if (r === G3) {
        const l = gl(i);
        let c = hp * n;
        const h = s * 6,
            d = (s + n) * 6;
        for (let u = 0; u < 3; u++) {
            const f = e[u],
                m = (e[u + 3] - f) / En;
            if (n < En / 4) {
                const g = [...jn];
                g.length = n;
                let x = 0;
                for (let y = h; y < d; y += 6, x++) {
                    const S = g[x];
                    S.candidate = t[y + 2 * u],
                    S.count = 0;
                    const {bounds: w, leftCacheBounds: C, rightCacheBounds: M} = S;
                    for (let E = 0; E < 3; E++)
                        M[E] = 1 / 0,
                        M[E + 3] = -1 / 0,
                        C[E] = 1 / 0,
                        C[E + 3] = -1 / 0,
                        w[E] = 1 / 0,
                        w[E + 3] = -1 / 0;
                    Ph(y, t, w)
                }
                g.sort(K3);
                let v = n;
                for (let y = 0; y < v; y++) {
                    const S = g[y];
                    for (; y + 1 < v && g[y + 1].candidate === S.candidate;)
                        g.splice(y + 1, 1),
                        v--
                }
                for (let y = h; y < d; y += 6) {
                    const S = t[y + 2 * u];
                    for (let w = 0; w < v; w++) {
                        const C = g[w];
                        S >= C.candidate ? Ph(y, t, C.rightCacheBounds) : (Ph(y, t, C.leftCacheBounds), C.count++)
                    }
                }
                for (let y = 0; y < v; y++) {
                    const S = g[y],
                        w = S.count,
                        C = n - S.count,
                        M = S.leftCacheBounds,
                        E = S.rightCacheBounds;
                    let _ = 0;
                    w !== 0 && (_ = gl(M) / l);
                    let I = 0;
                    C !== 0 && (I = gl(E) / l);
                    const P = Ox + hp * (_ * w + I * C);
                    P < c && (a = u, c = P, o = S.candidate)
                }
            } else {
                for (let v = 0; v < En; v++) {
                    const y = jn[v];
                    y.count = 0,
                    y.candidate = f + m + v * m;
                    const S = y.bounds;
                    for (let w = 0; w < 3; w++)
                        S[w] = 1 / 0,
                        S[w + 3] = -1 / 0
                }
                for (let v = h; v < d; v += 6) {
                    let w = ~~((t[v + 2 * u] - f) / m);
                    w >= En && (w = En - 1);
                    const C = jn[w];
                    C.count++,
                    Ph(v, t, C.bounds)
                }
                const g = jn[En - 1];
                zx(g.bounds, g.rightCacheBounds);
                for (let v = En - 2; v >= 0; v--) {
                    const y = jn[v],
                        S = jn[v + 1];
                    Qx(y.bounds, S.rightCacheBounds, y.rightCacheBounds)
                }
                let x = 0;
                for (let v = 0; v < En - 1; v++) {
                    const y = jn[v],
                        S = y.count,
                        w = y.bounds,
                        M = jn[v + 1].rightCacheBounds;
                    S !== 0 && (x === 0 ? zx(w, Dh) : Qx(w, Dh, Dh)),
                    x += S;
                    let E = 0,
                        _ = 0;
                    x !== 0 && (E = gl(Dh) / l);
                    const I = n - x;
                    I !== 0 && (_ = gl(M) / l);
                    const P = Ox + hp * (E * x + _ * I);
                    P < c && (a = u, c = P, o = y.candidate)
                }
            }
        }
    } else
        console.warn(`MeshBVH: Invalid build strategy value ${r} used.`);
    return {
        axis: a,
        pos: o
    }
}
function j3(i, e, t, s) {
    let n = 0;
    for (let r = e, a = e + t; r < a; r++)
        n += i[r * 6 + s * 2];
    return n / t
}
class fp {
    constructor()
    {
        this.boundingData = new Float32Array(6)
    }
}
function Z3(i, e, t, s, n, r) {
    let a = s,
        o = s + n - 1;
    const l = r.pos,
        c = r.axis * 2;
    for (;;) {
        for (; a <= o && t[a * 6 + c] < l;)
            a++;
        for (; a <= o && t[o * 6 + c] >= l;)
            o--;
        if (a < o) {
            for (let h = 0; h < 3; h++) {
                let d = e[a * 3 + h];
                e[a * 3 + h] = e[o * 3 + h],
                e[o * 3 + h] = d
            }
            for (let h = 0; h < 6; h++) {
                let d = t[a * 6 + h];
                t[a * 6 + h] = t[o * 6 + h],
                t[o * 6 + h] = d
            }
            a++,
            o--
        } else
            return a
    }
}
function $3(i, e, t, s, n, r) {
    let a = s,
        o = s + n - 1;
    const l = r.pos,
        c = r.axis * 2;
    for (;;) {
        for (; a <= o && t[a * 6 + c] < l;)
            a++;
        for (; a <= o && t[o * 6 + c] >= l;)
            o--;
        if (a < o) {
            let h = i[a];
            i[a] = i[o],
            i[o] = h;
            for (let d = 0; d < 6; d++) {
                let u = t[a * 6 + d];
                t[a * 6 + d] = t[o * 6 + d],
                t[o * 6 + d] = u
            }
            a++,
            o--
        } else
            return a
    }
}
function Ki(i, e) {
    return e[i + 15] === 65535
}
function ds(i, e) {
    return e[i + 6]
}
function Cs(i, e) {
    return e[i + 14]
}
function Ss(i) {
    return i + 8
}
function Ms(i, e) {
    return e[i + 6]
}
function CE(i, e) {
    return e[i + 7]
}
let SE,
    zl,
    Nu,
    ME;
const eL = Math.pow(2, 32);
function mA(i) {
    return "count" in i ? 1 : 1 + mA(i.left) + mA(i.right)
}
function tL(i, e, t) {
    return SE = new Float32Array(t), zl = new Uint32Array(t), Nu = new Uint16Array(t), ME = new Uint8Array(t), AA(i, e)
}
function AA(i, e) {
    const t = i / 4,
        s = i / 2,
        n = "count" in e,
        r = e.boundingData;
    for (let a = 0; a < 6; a++)
        SE[t + a] = r[a];
    if (n)
        if (e.buffer) {
            const a = e.buffer;
            ME.set(new Uint8Array(a), i);
            for (let o = i, l = i + a.byteLength; o < l; o += dc) {
                const c = o / 2;
                Ki(c, Nu) || (zl[o / 4 + 6] += t)
            }
            return i + a.byteLength
        } else {
            const a = e.offset,
                o = e.count;
            return zl[t + 6] = a, Nu[s + 14] = o, Nu[s + 15] = Nd, i + dc
        }
    else {
        const a = e.left,
            o = e.right,
            l = e.splitAxis;
        let c;
        if (c = AA(i + dc, a), c / 4 > eL)
            throw new Error("MeshBVH: Cannot store child pointer greater than 32 bits.");
        return zl[t + 6] = c / 4, c = AA(c, o), zl[t + 7] = l, c
    }
}
function iL(i, e) {
    const t = (i.index ? i.index.count : i.attributes.position.count) / 3,
        s = t > 2 ** 16,
        n = s ? 4 : 2,
        r = e ? new SharedArrayBuffer(t * n) : new ArrayBuffer(t * n),
        a = s ? new Uint32Array(r) : new Uint16Array(r);
    for (let o = 0, l = a.length; o < l; o++)
        a[o] = o;
    return a
}
function sL(i, e, t, s, n) {
    const {maxDepth: r, verbose: a, maxLeafTris: o, strategy: l, onProgress: c, indirect: h} = n,
        d = i._indirectBuffer,
        u = i.geometry,
        f = u.index ? u.index.array : null,
        p = h ? $3 : Z3,
        A = $o(u),
        m = new Float32Array(6);
    let g = !1;
    const x = new fp;
    return dp(e, t, s, x.boundingData, m), y(x, t, s, m), x;
    function v(S) {
        c && c(S / A)
    }
    function y(S, w, C, M=null, E=0) {
        if (!g && E >= r && (g = !0, a && (console.warn(`MeshBVH: Max depth of ${r} reached when generating BVH. Consider increasing maxDepth.`), console.warn(u))), C <= o || E >= r)
            return v(w + C), S.offset = w, S.count = C, S;
        const _ = J3(S.boundingData, M, e, w, C, l);
        if (_.axis === -1)
            return v(w + C), S.offset = w, S.count = C, S;
        const I = p(d, f, e, w, C, _);
        if (I === w || I === w + C)
            v(w + C),
            S.offset = w,
            S.count = C;
        else {
            S.splitAxis = _.axis;
            const P = new fp,
                D = w,
                L = I - w;
            S.left = P,
            dp(e, D, L, P.boundingData, m),
            y(P, D, L, m, E + 1);
            const z = new fp,
                O = I,
                K = C - L;
            S.right = z,
            dp(e, O, K, z.boundingData, m),
            y(z, O, K, m, E + 1)
        }
        return S
    }
}
function nL(i, e) {
    const t = i.geometry;
    e.indirect && (i._indirectBuffer = iL(t, e.useSharedArrayBuffer), q3(t) && !e.verbose && console.warn('MeshBVH: Provided geometry contains groups that do not fully span the vertex contents while using the "indirect" option. BVH may incorrectly report intersections on unrendered portions of the geometry.')),
    i._indirectBuffer || Y3(t, e);
    const s = e.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer,
        n = X3(t),
        r = e.indirect ? wE(t) : EE(t);
    i._roots = r.map(a => {
        const o = sL(i, n, a.offset, a.count, e),
            l = mA(o),
            c = new s(dc * l);
        return tL(0, o, c), c
    })
}
class Un {
    constructor()
    {
        this.min = 1 / 0,
        this.max = -1 / 0
    }
    setFromPointsField(e, t)
    {
        let s = 1 / 0,
            n = -1 / 0;
        for (let r = 0, a = e.length; r < a; r++) {
            const l = e[r][t];
            s = l < s ? l : s,
            n = l > n ? l : n
        }
        this.min = s,
        this.max = n
    }
    setFromPoints(e, t)
    {
        let s = 1 / 0,
            n = -1 / 0;
        for (let r = 0, a = t.length; r < a; r++) {
            const o = t[r],
                l = e.dot(o);
            s = l < s ? l : s,
            n = l > n ? l : n
        }
        this.min = s,
        this.max = n
    }
    isSeparated(e)
    {
        return this.min > e.max || e.min > this.max
    }
}
Un.prototype.setFromBox = function() {
    const i = new b;
    return function(t, s) {
        const n = s.min,
            r = s.max;
        let a = 1 / 0,
            o = -1 / 0;
        for (let l = 0; l <= 1; l++)
            for (let c = 0; c <= 1; c++)
                for (let h = 0; h <= 1; h++) {
                    i.x = n.x * l + r.x * (1 - l),
                    i.y = n.y * c + r.y * (1 - c),
                    i.z = n.z * h + r.z * (1 - h);
                    const d = t.dot(i);
                    a = Math.min(d, a),
                    o = Math.max(d, o)
                }
        this.min = a,
        this.max = o
    }
}();
const rL = function() {
        const i = new b,
            e = new b,
            t = new b;
        return function(n, r, a) {
            const o = n.start,
                l = i,
                c = r.start,
                h = e;
            t.subVectors(o, c),
            i.subVectors(n.end, n.start),
            e.subVectors(r.end, r.start);
            const d = t.dot(h),
                u = h.dot(l),
                f = h.dot(h),
                p = t.dot(l),
                m = l.dot(l) * f - u * u;
            let g,
                x;
            m !== 0 ? g = (d * u - p * f) / m : g = 0,
            x = (d + g * u) / f,
            a.x = g,
            a.y = x
        }
    }(),
    Sg = function() {
        const i = new H,
            e = new b,
            t = new b;
        return function(n, r, a, o) {
            rL(n, r, i);
            let l = i.x,
                c = i.y;
            if (l >= 0 && l <= 1 && c >= 0 && c <= 1) {
                n.at(l, a),
                r.at(c, o);
                return
            } else if (l >= 0 && l <= 1) {
                c < 0 ? r.at(0, o) : r.at(1, o),
                n.closestPointToPoint(o, !0, a);
                return
            } else if (c >= 0 && c <= 1) {
                l < 0 ? n.at(0, a) : n.at(1, a),
                r.closestPointToPoint(a, !0, o);
                return
            } else {
                let h;
                l < 0 ? h = n.start : h = n.end;
                let d;
                c < 0 ? d = r.start : d = r.end;
                const u = e,
                    f = t;
                if (n.closestPointToPoint(d, !0, e), r.closestPointToPoint(h, !0, t), u.distanceToSquared(d) <= f.distanceToSquared(h)) {
                    a.copy(u),
                    o.copy(d);
                    return
                } else {
                    a.copy(h),
                    o.copy(f);
                    return
                }
            }
        }
    }(),
    aL = function() {
        const i = new b,
            e = new b,
            t = new Zs,
            s = new Bn;
        return function(r, a) {
            const {radius: o, center: l} = r,
                {a: c, b: h, c: d} = a;
            if (s.start = c, s.end = h, s.closestPointToPoint(l, !0, i).distanceTo(l) <= o || (s.start = c, s.end = d, s.closestPointToPoint(l, !0, i).distanceTo(l) <= o) || (s.start = h, s.end = d, s.closestPointToPoint(l, !0, i).distanceTo(l) <= o))
                return !0;
            const A = a.getPlane(t);
            if (Math.abs(A.distanceToPoint(l)) <= o) {
                const g = A.projectPoint(l, e);
                if (a.containsPoint(g))
                    return !0
            }
            return !1
        }
    }(),
    oL = 1e-15;
function pp(i) {
    return Math.abs(i) < oL
}
class Ws extends wi {
    constructor(...e)
    {
        super(...e),
        this.isExtendedTriangle = !0,
        this.satAxes = new Array(4).fill().map(() => new b),
        this.satBounds = new Array(4).fill().map(() => new Un),
        this.points = [this.a, this.b, this.c],
        this.sphere = new bi,
        this.plane = new Zs,
        this.needsUpdate = !0
    }
    intersectsSphere(e)
    {
        return aL(e, this)
    }
    update()
    {
        const e = this.a,
            t = this.b,
            s = this.c,
            n = this.points,
            r = this.satAxes,
            a = this.satBounds,
            o = r[0],
            l = a[0];
        this.getNormal(o),
        l.setFromPoints(o, n);
        const c = r[1],
            h = a[1];
        c.subVectors(e, t),
        h.setFromPoints(c, n);
        const d = r[2],
            u = a[2];
        d.subVectors(t, s),
        u.setFromPoints(d, n);
        const f = r[3],
            p = a[3];
        f.subVectors(s, e),
        p.setFromPoints(f, n),
        this.sphere.setFromPoints(this.points),
        this.plane.setFromNormalAndCoplanarPoint(o, e),
        this.needsUpdate = !1
    }
}
Ws.prototype.closestPointToSegment = function() {
    const i = new b,
        e = new b,
        t = new Bn;
    return function(n, r=null, a=null) {
        const {start: o, end: l} = n,
            c = this.points;
        let h,
            d = 1 / 0;
        for (let u = 0; u < 3; u++) {
            const f = (u + 1) % 3;
            t.start.copy(c[u]),
            t.end.copy(c[f]),
            Sg(t, n, i, e),
            h = i.distanceToSquared(e),
            h < d && (d = h, r && r.copy(i), a && a.copy(e))
        }
        return this.closestPointToPoint(o, i), h = o.distanceToSquared(i), h < d && (d = h, r && r.copy(i), a && a.copy(o)), this.closestPointToPoint(l, i), h = l.distanceToSquared(i), h < d && (d = h, r && r.copy(i), a && a.copy(l)), Math.sqrt(d)
    }
}();
Ws.prototype.intersectsTriangle = function() {
    const i = new Ws,
        e = new Array(3),
        t = new Array(3),
        s = new Un,
        n = new Un,
        r = new b,
        a = new b,
        o = new b,
        l = new b,
        c = new b,
        h = new Bn,
        d = new Bn,
        u = new Bn,
        f = new b;
    function p(A, m, g) {
        const x = A.points;
        let v = 0,
            y = -1;
        for (let S = 0; S < 3; S++) {
            const {start: w, end: C} = h;
            w.copy(x[S]),
            C.copy(x[(S + 1) % 3]),
            h.delta(a);
            const M = pp(m.distanceToPoint(w));
            if (pp(m.normal.dot(a)) && M) {
                g.copy(h),
                v = 2;
                break
            }
            const E = m.intersectLine(h, f);
            if (!E && M && f.copy(w), (E || M) && !pp(f.distanceTo(C))) {
                if (v <= 1)
                    (v === 1 ? g.start : g.end).copy(f),
                    M && (y = v);
                else if (v >= 2) {
                    (y === 1 ? g.start : g.end).copy(f),
                    v = 2;
                    break
                }
                if (v++, v === 2 && y === -1)
                    break
            }
        }
        return v
    }
    return function(m, g=null, x=!1) {
        this.needsUpdate && this.update(),
        m.isExtendedTriangle ? m.needsUpdate && m.update() : (i.copy(m), i.update(), m = i);
        const v = this.plane,
            y = m.plane;
        if (Math.abs(v.normal.dot(y.normal)) > 1 - 1e-10) {
            const S = this.satBounds,
                w = this.satAxes;
            t[0] = m.a,
            t[1] = m.b,
            t[2] = m.c;
            for (let E = 0; E < 4; E++) {
                const _ = S[E],
                    I = w[E];
                if (s.setFromPoints(I, t), _.isSeparated(s))
                    return !1
            }
            const C = m.satBounds,
                M = m.satAxes;
            e[0] = this.a,
            e[1] = this.b,
            e[2] = this.c;
            for (let E = 0; E < 4; E++) {
                const _ = C[E],
                    I = M[E];
                if (s.setFromPoints(I, e), _.isSeparated(s))
                    return !1
            }
            for (let E = 0; E < 4; E++) {
                const _ = w[E];
                for (let I = 0; I < 4; I++) {
                    const P = M[I];
                    if (r.crossVectors(_, P), s.setFromPoints(r, e), n.setFromPoints(r, t), s.isSeparated(n))
                        return !1
                }
            }
            return g && (x || console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."), g.start.set(0, 0, 0), g.end.set(0, 0, 0)), !0
        } else {
            const S = p(this, y, d);
            if (S === 1 && m.containsPoint(d.end))
                return g && (g.start.copy(d.end), g.end.copy(d.end)), !0;
            if (S !== 2)
                return !1;
            const w = p(m, v, u);
            if (w === 1 && this.containsPoint(u.end))
                return g && (g.start.copy(u.end), g.end.copy(u.end)), !0;
            if (w !== 2)
                return !1;
            if (d.delta(o), u.delta(l), o.dot(l) < 0) {
                let D = u.start;
                u.start = u.end,
                u.end = D
            }
            const C = d.start.dot(o),
                M = d.end.dot(o),
                E = u.start.dot(o),
                _ = u.end.dot(o),
                I = M < E,
                P = C < _;
            return C !== _ && E !== M && I === P ? !1 : (g && (c.subVectors(d.start, u.start), c.dot(o) > 0 ? g.start.copy(d.start) : g.start.copy(u.start), c.subVectors(d.end, u.end), c.dot(o) < 0 ? g.end.copy(d.end) : g.end.copy(u.end)), !0)
        }
    }
}();
Ws.prototype.distanceToPoint = function() {
    const i = new b;
    return function(t) {
        return this.closestPointToPoint(t, i), t.distanceTo(i)
    }
}();
Ws.prototype.distanceToTriangle = function() {
    const i = new b,
        e = new b,
        t = ["a", "b", "c"],
        s = new Bn,
        n = new Bn;
    return function(a, o=null, l=null) {
        const c = o || l ? s : null;
        if (this.intersectsTriangle(a, c))
            return (o || l) && (o && c.getCenter(o), l && c.getCenter(l)), 0;
        let h = 1 / 0;
        for (let d = 0; d < 3; d++) {
            let u;
            const f = t[d],
                p = a[f];
            this.closestPointToPoint(p, i),
            u = p.distanceToSquared(i),
            u < h && (h = u, o && o.copy(i), l && l.copy(p));
            const A = this[f];
            a.closestPointToPoint(A, i),
            u = A.distanceToSquared(i),
            u < h && (h = u, o && o.copy(A), l && l.copy(i))
        }
        for (let d = 0; d < 3; d++) {
            const u = t[d],
                f = t[(d + 1) % 3];
            s.set(this[u], this[f]);
            for (let p = 0; p < 3; p++) {
                const A = t[p],
                    m = t[(p + 1) % 3];
                n.set(a[A], a[m]),
                Sg(s, n, i, e);
                const g = i.distanceToSquared(e);
                g < h && (h = g, o && o.copy(i), l && l.copy(e))
            }
        }
        return Math.sqrt(h)
    }
}();
class Wi {
    constructor(e, t, s)
    {
        this.isOrientedBox = !0,
        this.min = new b,
        this.max = new b,
        this.matrix = new De,
        this.invMatrix = new De,
        this.points = new Array(8).fill().map(() => new b),
        this.satAxes = new Array(3).fill().map(() => new b),
        this.satBounds = new Array(3).fill().map(() => new Un),
        this.alignedSatBounds = new Array(3).fill().map(() => new Un),
        this.needsUpdate = !1,
        e && this.min.copy(e),
        t && this.max.copy(t),
        s && this.matrix.copy(s)
    }
    set(e, t, s)
    {
        this.min.copy(e),
        this.max.copy(t),
        this.matrix.copy(s),
        this.needsUpdate = !0
    }
    copy(e)
    {
        this.min.copy(e.min),
        this.max.copy(e.max),
        this.matrix.copy(e.matrix),
        this.needsUpdate = !0
    }
}
Wi.prototype.update = function() {
    return function() {
        const e = this.matrix,
            t = this.min,
            s = this.max,
            n = this.points;
        for (let c = 0; c <= 1; c++)
            for (let h = 0; h <= 1; h++)
                for (let d = 0; d <= 1; d++) {
                    const u = 1 * c | 2 * h | 4 * d,
                        f = n[u];
                    f.x = c ? s.x : t.x,
                    f.y = h ? s.y : t.y,
                    f.z = d ? s.z : t.z,
                    f.applyMatrix4(e)
                }
        const r = this.satBounds,
            a = this.satAxes,
            o = n[0];
        for (let c = 0; c < 3; c++) {
            const h = a[c],
                d = r[c],
                u = 1 << c,
                f = n[u];
            h.subVectors(o, f),
            d.setFromPoints(h, n)
        }
        const l = this.alignedSatBounds;
        l[0].setFromPointsField(n, "x"),
        l[1].setFromPointsField(n, "y"),
        l[2].setFromPointsField(n, "z"),
        this.invMatrix.copy(this.matrix).invert(),
        this.needsUpdate = !1
    }
}();
Wi.prototype.intersectsBox = function() {
    const i = new Un;
    return function(t) {
        this.needsUpdate && this.update();
        const s = t.min,
            n = t.max,
            r = this.satBounds,
            a = this.satAxes,
            o = this.alignedSatBounds;
        if (i.min = s.x, i.max = n.x, o[0].isSeparated(i) || (i.min = s.y, i.max = n.y, o[1].isSeparated(i)) || (i.min = s.z, i.max = n.z, o[2].isSeparated(i)))
            return !1;
        for (let l = 0; l < 3; l++) {
            const c = a[l],
                h = r[l];
            if (i.setFromBox(c, t), h.isSeparated(i))
                return !1
        }
        return !0
    }
}();
Wi.prototype.intersectsTriangle = function() {
    const i = new Ws,
        e = new Array(3),
        t = new Un,
        s = new Un,
        n = new b;
    return function(a) {
        this.needsUpdate && this.update(),
        a.isExtendedTriangle ? a.needsUpdate && a.update() : (i.copy(a), i.update(), a = i);
        const o = this.satBounds,
            l = this.satAxes;
        e[0] = a.a,
        e[1] = a.b,
        e[2] = a.c;
        for (let u = 0; u < 3; u++) {
            const f = o[u],
                p = l[u];
            if (t.setFromPoints(p, e), f.isSeparated(t))
                return !1
        }
        const c = a.satBounds,
            h = a.satAxes,
            d = this.points;
        for (let u = 0; u < 3; u++) {
            const f = c[u],
                p = h[u];
            if (t.setFromPoints(p, d), f.isSeparated(t))
                return !1
        }
        for (let u = 0; u < 3; u++) {
            const f = l[u];
            for (let p = 0; p < 4; p++) {
                const A = h[p];
                if (n.crossVectors(f, A), t.setFromPoints(n, e), s.setFromPoints(n, d), t.isSeparated(s))
                    return !1
            }
        }
        return !0
    }
}();
Wi.prototype.closestPointToPoint = function() {
    return function(e, t) {
        return this.needsUpdate && this.update(), t.copy(e).applyMatrix4(this.invMatrix).clamp(this.min, this.max).applyMatrix4(this.matrix), t
    }
}();
Wi.prototype.distanceToPoint = function() {
    const i = new b;
    return function(t) {
        return this.closestPointToPoint(t, i), t.distanceTo(i)
    }
}();
Wi.prototype.distanceToBox = function() {
    const i = ["x", "y", "z"],
        e = new Array(12).fill().map(() => new Bn),
        t = new Array(12).fill().map(() => new Bn),
        s = new b,
        n = new b;
    return function(a, o=0, l=null, c=null) {
        if (this.needsUpdate && this.update(), this.intersectsBox(a))
            return (l || c) && (a.getCenter(n), this.closestPointToPoint(n, s), a.closestPointToPoint(s, n), l && l.copy(s), c && c.copy(n)), 0;
        const h = o * o,
            d = a.min,
            u = a.max,
            f = this.points;
        let p = 1 / 0;
        for (let m = 0; m < 8; m++) {
            const g = f[m];
            n.copy(g).clamp(d, u);
            const x = g.distanceToSquared(n);
            if (x < p && (p = x, l && l.copy(g), c && c.copy(n), x < h))
                return Math.sqrt(x)
        }
        let A = 0;
        for (let m = 0; m < 3; m++)
            for (let g = 0; g <= 1; g++)
                for (let x = 0; x <= 1; x++) {
                    const v = (m + 1) % 3,
                        y = (m + 2) % 3,
                        S = g << v | x << y,
                        w = 1 << m | g << v | x << y,
                        C = f[S],
                        M = f[w];
                    e[A].set(C, M);
                    const _ = i[m],
                        I = i[v],
                        P = i[y],
                        D = t[A],
                        L = D.start,
                        z = D.end;
                    L[_] = d[_],
                    L[I] = g ? d[I] : u[I],
                    L[P] = x ? d[P] : u[I],
                    z[_] = u[_],
                    z[I] = g ? d[I] : u[I],
                    z[P] = x ? d[P] : u[I],
                    A++
                }
        for (let m = 0; m <= 1; m++)
            for (let g = 0; g <= 1; g++)
                for (let x = 0; x <= 1; x++) {
                    n.x = m ? u.x : d.x,
                    n.y = g ? u.y : d.y,
                    n.z = x ? u.z : d.z,
                    this.closestPointToPoint(n, s);
                    const v = n.distanceToSquared(s);
                    if (v < p && (p = v, l && l.copy(s), c && c.copy(n), v < h))
                        return Math.sqrt(v)
                }
        for (let m = 0; m < 12; m++) {
            const g = e[m];
            for (let x = 0; x < 12; x++) {
                const v = t[x];
                Sg(g, v, s, n);
                const y = s.distanceToSquared(n);
                if (y < p && (p = y, l && l.copy(s), c && c.copy(n), y < h))
                    return Math.sqrt(y)
            }
        }
        return Math.sqrt(p)
    }
}();
class Mg {
    constructor(e)
    {
        this._getNewPrimitive = e,
        this._primitives = []
    }
    getPrimitive()
    {
        const e = this._primitives;
        return e.length === 0 ? this._getNewPrimitive() : e.pop()
    }
    releasePrimitive(e)
    {
        this._primitives.push(e)
    }
}
class lL extends Mg {
    constructor()
    {
        super(() => new Ws)
    }
}
const bs = new lL;
class cL {
    constructor()
    {
        this.float32Array = null,
        this.uint16Array = null,
        this.uint32Array = null;
        const e = [];
        let t = null;
        this.setBuffer = s => {
            t && e.push(t),
            t = s,
            this.float32Array = new Float32Array(s),
            this.uint16Array = new Uint16Array(s),
            this.uint32Array = new Uint32Array(s)
        },
        this.clearBuffer = () => {
            t = null,
            this.float32Array = null,
            this.uint16Array = null,
            this.uint32Array = null,
            e.length !== 0 && this.setBuffer(e.pop())
        }
    }
}
const Ot = new cL;
let ur,
    yo;
const qa = [],
    Rh = new Mg(() => new Vt);
function hL(i, e, t, s, n, r) {
    ur = Rh.getPrimitive(),
    yo = Rh.getPrimitive(),
    qa.push(ur, yo),
    Ot.setBuffer(i._roots[e]);
    const a = gA(0, i.geometry, t, s, n, r);
    Ot.clearBuffer(),
    Rh.releasePrimitive(ur),
    Rh.releasePrimitive(yo),
    qa.pop(),
    qa.pop();
    const o = qa.length;
    return o > 0 && (yo = qa[o - 1], ur = qa[o - 2]), a
}
function gA(i, e, t, s, n=null, r=0, a=0) {
    const {float32Array: o, uint16Array: l, uint32Array: c} = Ot;
    let h = i * 2;
    if (Ki(h, l)) {
        const u = ds(i, c),
            f = Cs(h, l);
        return Zt(i, o, ur), s(u, f, !1, a, r + i, ur)
    } else {
        let _ = function(P) {
                const {uint16Array: D, uint32Array: L} = Ot;
                let z = P * 2;
                for (; !Ki(z, D);)
                    P = Ss(P),
                    z = P * 2;
                return ds(P, L)
            },
            I = function(P) {
                const {uint16Array: D, uint32Array: L} = Ot;
                let z = P * 2;
                for (; !Ki(z, D);)
                    P = Ms(P, L),
                    z = P * 2;
                return ds(P, L) + Cs(z, D)
            };
        const u = Ss(i),
            f = Ms(i, c);
        let p = u,
            A = f,
            m,
            g,
            x,
            v;
        if (n && (x = ur, v = yo, Zt(p, o, x), Zt(A, o, v), m = n(x), g = n(v), g < m)) {
            p = f,
            A = u;
            const P = m;
            m = g,
            g = P,
            x = v
        }
        x || (x = ur, Zt(p, o, x));
        const y = Ki(p * 2, l),
            S = t(x, y, m, a + 1, r + p);
        let w;
        if (S === Nx) {
            const P = _(p),
                L = I(p) - P;
            w = s(P, L, !0, a + 1, r + p, x)
        } else
            w = S && gA(p, e, t, s, n, r, a + 1);
        if (w)
            return !0;
        v = yo,
        Zt(A, o, v);
        const C = Ki(A * 2, l),
            M = t(v, C, g, a + 1, r + A);
        let E;
        if (M === Nx) {
            const P = _(A),
                L = I(A) - P;
            E = s(P, L, !0, a + 1, r + A, v)
        } else
            E = M && gA(A, e, t, s, n, r, a + 1);
        return !!E
    }
}
const vl = new b,
    mp = new b;
function uL(i, e, t={}, s=0, n=1 / 0) {
    const r = s * s,
        a = n * n;
    let o = 1 / 0,
        l = null;
    if (i.shapecast({
        boundsTraverseOrder: h => (vl.copy(e).clamp(h.min, h.max), vl.distanceToSquared(e)),
        intersectsBounds: (h, d, u) => u < o && u < a,
        intersectsTriangle: (h, d) => {
            h.closestPointToPoint(e, vl);
            const u = e.distanceToSquared(vl);
            return u < o && (mp.copy(vl), o = u, l = d), u < r
        }
    }), o === 1 / 0)
        return null;
    const c = Math.sqrt(o);
    return t.point ? t.point.copy(mp) : t.point = mp.clone(), t.distance = c, t.faceIndex = l, t
}
const Xa = new b,
    Ka = new b,
    Ja = new b,
    Uh = new H,
    Lh = new H,
    Fh = new H,
    Gx = new b,
    Hx = new b,
    Vx = new b,
    Nh = new b;
function dL(i, e, t, s, n, r) {
    let a;
    return r === ei ? a = i.intersectTriangle(s, t, e, !0, n) : a = i.intersectTriangle(e, t, s, r !== xi, n), a === null ? null : {
        distance: i.origin.distanceTo(n),
        point: n.clone()
    }
}
function fL(i, e, t, s, n, r, a, o, l) {
    Xa.fromBufferAttribute(e, r),
    Ka.fromBufferAttribute(e, a),
    Ja.fromBufferAttribute(e, o);
    const c = dL(i, Xa, Ka, Ja, Nh, l);
    if (c) {
        s && (Uh.fromBufferAttribute(s, r), Lh.fromBufferAttribute(s, a), Fh.fromBufferAttribute(s, o), c.uv = wi.getInterpolation(Nh, Xa, Ka, Ja, Uh, Lh, Fh, new H)),
        n && (Uh.fromBufferAttribute(n, r), Lh.fromBufferAttribute(n, a), Fh.fromBufferAttribute(n, o), c.uv1 = wi.getInterpolation(Nh, Xa, Ka, Ja, Uh, Lh, Fh, new H)),
        t && (Gx.fromBufferAttribute(t, r), Hx.fromBufferAttribute(t, a), Vx.fromBufferAttribute(t, o), c.normal = wi.getInterpolation(Nh, Xa, Ka, Ja, Gx, Hx, Vx, new b), c.normal.dot(i.direction) > 0 && c.normal.multiplyScalar(-1));
        const h = {
            a: r,
            b: a,
            c: o,
            normal: new b,
            materialIndex: 0
        };
        wi.getNormal(Xa, Ka, Ja, h.normal),
        c.face = h,
        c.faceIndex = r
    }
    return c
}
function Od(i, e, t, s, n) {
    const r = s * 3;
    let a = r + 0,
        o = r + 1,
        l = r + 2;
    const c = i.index;
    i.index && (a = c.getX(a), o = c.getX(o), l = c.getX(l));
    const {position: h, normal: d, uv: u, uv1: f} = i.attributes,
        p = fL(t, h, d, u, f, a, o, l, e);
    return p ? (p.faceIndex = s, n && n.push(p), p) : null
}
function ui(i, e, t, s) {
    const n = i.a,
        r = i.b,
        a = i.c;
    let o = e,
        l = e + 1,
        c = e + 2;
    t && (o = t.getX(o), l = t.getX(l), c = t.getX(c)),
    n.x = s.getX(o),
    n.y = s.getY(o),
    n.z = s.getZ(o),
    r.x = s.getX(l),
    r.y = s.getY(l),
    r.z = s.getZ(l),
    a.x = s.getX(c),
    a.y = s.getY(c),
    a.z = s.getZ(c)
}
function pL(i, e, t, s, n, r) {
    const {geometry: a, _indirectBuffer: o} = i;
    for (let l = s, c = s + n; l < c; l++)
        Od(a, e, t, l, r)
}
function mL(i, e, t, s, n) {
    const {geometry: r, _indirectBuffer: a} = i;
    let o = 1 / 0,
        l = null;
    for (let c = s, h = s + n; c < h; c++) {
        let d;
        d = Od(r, e, t, c),
        d && d.distance < o && (l = d, o = d.distance)
    }
    return l
}
function AL(i, e, t, s, n, r, a) {
    const {geometry: o} = t,
        {index: l} = o,
        c = o.attributes.position;
    for (let h = i, d = e + i; h < d; h++) {
        let u;
        if (u = h, ui(a, u * 3, l, c), a.needsUpdate = !0, s(a, u, n, r))
            return !0
    }
    return !1
}
function gL(i, e=null) {
    e && Array.isArray(e) && (e = new Set(e));
    const t = i.geometry,
        s = t.index ? t.index.array : null,
        n = t.attributes.position;
    let r,
        a,
        o,
        l,
        c = 0;
    const h = i._roots;
    for (let u = 0, f = h.length; u < f; u++)
        r = h[u],
        a = new Uint32Array(r),
        o = new Uint16Array(r),
        l = new Float32Array(r),
        d(0, c),
        c += r.byteLength;
    function d(u, f, p=!1) {
        const A = u * 2;
        if (o[A + 15] === Nd) {
            const g = a[u + 6],
                x = o[A + 14];
            let v = 1 / 0,
                y = 1 / 0,
                S = 1 / 0,
                w = -1 / 0,
                C = -1 / 0,
                M = -1 / 0;
            for (let E = 3 * g, _ = 3 * (g + x); E < _; E++) {
                let I = s[E];
                const P = n.getX(I),
                    D = n.getY(I),
                    L = n.getZ(I);
                P < v && (v = P),
                P > w && (w = P),
                D < y && (y = D),
                D > C && (C = D),
                L < S && (S = L),
                L > M && (M = L)
            }
            return l[u + 0] !== v || l[u + 1] !== y || l[u + 2] !== S || l[u + 3] !== w || l[u + 4] !== C || l[u + 5] !== M ? (l[u + 0] = v, l[u + 1] = y, l[u + 2] = S, l[u + 3] = w, l[u + 4] = C, l[u + 5] = M, !0) : !1
        } else {
            const g = u + 8,
                x = a[u + 6],
                v = g + f,
                y = x + f;
            let S = p,
                w = !1,
                C = !1;
            e ? S || (w = e.has(v), C = e.has(y), S = !w && !C) : (w = !0, C = !0);
            const M = S || w,
                E = S || C;
            let _ = !1;
            M && (_ = d(g, f, S));
            let I = !1;
            E && (I = d(x, f, S));
            const P = _ || I;
            if (P)
                for (let D = 0; D < 3; D++) {
                    const L = g + D,
                        z = x + D,
                        O = l[L],
                        K = l[L + 3],
                        V = l[z],
                        pe = l[z + 3];
                    l[u + D] = O < V ? O : V,
                    l[u + D + 3] = K > pe ? K : pe
                }
            return P
        }
    }
}
function xr(i, e, t) {
    let s,
        n,
        r,
        a,
        o,
        l;
    const c = 1 / t.direction.x,
        h = 1 / t.direction.y,
        d = 1 / t.direction.z,
        u = t.origin.x,
        f = t.origin.y,
        p = t.origin.z;
    let A = e[i],
        m = e[i + 3],
        g = e[i + 1],
        x = e[i + 3 + 1],
        v = e[i + 2],
        y = e[i + 3 + 2];
    return c >= 0 ? (s = (A - u) * c, n = (m - u) * c) : (s = (m - u) * c, n = (A - u) * c), h >= 0 ? (r = (g - f) * h, a = (x - f) * h) : (r = (x - f) * h, a = (g - f) * h), !(s > a || r > n || ((r > s || isNaN(s)) && (s = r), (a < n || isNaN(n)) && (n = a), d >= 0 ? (o = (v - p) * d, l = (y - p) * d) : (o = (y - p) * d, l = (v - p) * d), s > l || o > n) || ((l < n || n !== n) && (n = l), n < 0))
}
function vL(i, e, t, s, n, r) {
    const {geometry: a, _indirectBuffer: o} = i;
    for (let l = s, c = s + n; l < c; l++) {
        let h = o ? o[l] : l;
        Od(a, e, t, h, r)
    }
}
function xL(i, e, t, s, n) {
    const {geometry: r, _indirectBuffer: a} = i;
    let o = 1 / 0,
        l = null;
    for (let c = s, h = s + n; c < h; c++) {
        let d;
        d = Od(r, e, t, a ? a[c] : c),
        d && d.distance < o && (l = d, o = d.distance)
    }
    return l
}
function yL(i, e, t, s, n, r, a) {
    const {geometry: o} = t,
        {index: l} = o,
        c = o.attributes.position;
    for (let h = i, d = e + i; h < d; h++) {
        let u;
        if (u = t.resolveTriangleIndex(h), ui(a, u * 3, l, c), a.needsUpdate = !0, s(a, u, n, r))
            return !0
    }
    return !1
}
function _L(i, e, t, s, n) {
    Ot.setBuffer(i._roots[e]),
    vA(0, i, t, s, n),
    Ot.clearBuffer()
}
function vA(i, e, t, s, n) {
    const {float32Array: r, uint16Array: a, uint32Array: o} = Ot,
        l = i * 2;
    if (Ki(l, a)) {
        const h = ds(i, o),
            d = Cs(l, a);
        pL(e, t, s, h, d, n)
    } else {
        const h = Ss(i);
        xr(h, r, s) && vA(h, e, t, s, n);
        const d = Ms(i, o);
        xr(d, r, s) && vA(d, e, t, s, n)
    }
}
const wL = ["x", "y", "z"];
function EL(i, e, t, s) {
    Ot.setBuffer(i._roots[e]);
    const n = xA(0, i, t, s);
    return Ot.clearBuffer(), n
}
function xA(i, e, t, s) {
    const {float32Array: n, uint16Array: r, uint32Array: a} = Ot;
    let o = i * 2;
    if (Ki(o, r)) {
        const c = ds(i, a),
            h = Cs(o, r);
        return mL(e, t, s, c, h)
    } else {
        const c = CE(i, a),
            h = wL[c],
            u = s.direction[h] >= 0;
        let f,
            p;
        u ? (f = Ss(i), p = Ms(i, a)) : (f = Ms(i, a), p = Ss(i));
        const m = xr(f, n, s) ? xA(f, e, t, s) : null;
        if (m) {
            const v = m.point[h];
            if (u ? v <= n[p + c] : v >= n[p + c + 3])
                return m
        }
        const x = xr(p, n, s) ? xA(p, e, t, s) : null;
        return m && x ? m.distance <= x.distance ? m : x : m || x || null
    }
}
const Oh = new Vt,
    ja = new Ws,
    Za = new Ws,
    xl = new De,
    Wx = new Wi,
    kh = new Wi;
function CL(i, e, t, s) {
    Ot.setBuffer(i._roots[e]);
    const n = yA(0, i, t, s);
    return Ot.clearBuffer(), n
}
function yA(i, e, t, s, n=null) {
    const {float32Array: r, uint16Array: a, uint32Array: o} = Ot;
    let l = i * 2;
    if (n === null && (t.boundingBox || t.computeBoundingBox(), Wx.set(t.boundingBox.min, t.boundingBox.max, s), n = Wx), Ki(l, a)) {
        const h = e.geometry,
            d = h.index,
            u = h.attributes.position,
            f = t.index,
            p = t.attributes.position,
            A = ds(i, o),
            m = Cs(l, a);
        if (xl.copy(s).invert(), t.boundsTree)
            return Zt(i, r, kh), kh.matrix.copy(xl), kh.needsUpdate = !0, t.boundsTree.shapecast({
                intersectsBounds: x => kh.intersectsBox(x),
                intersectsTriangle: x => {
                    x.a.applyMatrix4(s),
                    x.b.applyMatrix4(s),
                    x.c.applyMatrix4(s),
                    x.needsUpdate = !0;
                    for (let v = A * 3, y = (m + A) * 3; v < y; v += 3)
                        if (ui(Za, v, d, u), Za.needsUpdate = !0, x.intersectsTriangle(Za))
                            return !0;
                    return !1
                }
            });
        for (let g = A * 3, x = (m + A) * 3; g < x; g += 3) {
            ui(ja, g, d, u),
            ja.a.applyMatrix4(xl),
            ja.b.applyMatrix4(xl),
            ja.c.applyMatrix4(xl),
            ja.needsUpdate = !0;
            for (let v = 0, y = f.count; v < y; v += 3)
                if (ui(Za, v, f, p), Za.needsUpdate = !0, ja.intersectsTriangle(Za))
                    return !0
        }
    } else {
        const h = i + 8,
            d = o[i + 6];
        return Zt(h, r, Oh), !!(n.intersectsBox(Oh) && yA(h, e, t, s, n) || (Zt(d, r, Oh), n.intersectsBox(Oh) && yA(d, e, t, s, n)))
    }
}
const zh = new De,
    Ap = new Wi,
    yl = new Wi,
    SL = new b,
    ML = new b,
    bL = new b,
    TL = new b;
function IL(i, e, t, s={}, n={}, r=0, a=1 / 0) {
    e.boundingBox || e.computeBoundingBox(),
    Ap.set(e.boundingBox.min, e.boundingBox.max, t),
    Ap.needsUpdate = !0;
    const o = i.geometry,
        l = o.attributes.position,
        c = o.index,
        h = e.attributes.position,
        d = e.index,
        u = bs.getPrimitive(),
        f = bs.getPrimitive();
    let p = SL,
        A = ML,
        m = null,
        g = null;
    n && (m = bL, g = TL);
    let x = 1 / 0,
        v = null,
        y = null;
    return zh.copy(t).invert(), yl.matrix.copy(zh), i.shapecast({
        boundsTraverseOrder: S => Ap.distanceToBox(S),
        intersectsBounds: (S, w, C) => C < x && C < a ? (w && (yl.min.copy(S.min), yl.max.copy(S.max), yl.needsUpdate = !0), !0) : !1,
        intersectsRange: (S, w) => {
            if (e.boundsTree)
                return e.boundsTree.shapecast({
                    boundsTraverseOrder: M => yl.distanceToBox(M),
                    intersectsBounds: (M, E, _) => _ < x && _ < a,
                    intersectsRange: (M, E) => {
                        for (let _ = M, I = M + E; _ < I; _++) {
                            ui(f, 3 * _, d, h),
                            f.a.applyMatrix4(t),
                            f.b.applyMatrix4(t),
                            f.c.applyMatrix4(t),
                            f.needsUpdate = !0;
                            for (let P = S, D = S + w; P < D; P++) {
                                ui(u, 3 * P, c, l),
                                u.needsUpdate = !0;
                                const L = u.distanceToTriangle(f, p, m);
                                if (L < x && (A.copy(p), g && g.copy(m), x = L, v = P, y = _), L < r)
                                    return !0
                            }
                        }
                    }
                });
            {
                const C = $o(e);
                for (let M = 0, E = C; M < E; M++) {
                    ui(f, 3 * M, d, h),
                    f.a.applyMatrix4(t),
                    f.b.applyMatrix4(t),
                    f.c.applyMatrix4(t),
                    f.needsUpdate = !0;
                    for (let _ = S, I = S + w; _ < I; _++) {
                        ui(u, 3 * _, c, l),
                        u.needsUpdate = !0;
                        const P = u.distanceToTriangle(f, p, m);
                        if (P < x && (A.copy(p), g && g.copy(m), x = P, v = _, y = M), P < r)
                            return !0
                    }
                }
            }
        }
    }), bs.releasePrimitive(u), bs.releasePrimitive(f), x === 1 / 0 ? null : (s.point ? s.point.copy(A) : s.point = A.clone(), s.distance = x, s.faceIndex = v, n && (n.point ? n.point.copy(g) : n.point = g.clone(), n.point.applyMatrix4(zh), A.applyMatrix4(zh), n.distance = A.sub(n.point).length(), n.faceIndex = y), s)
}
function BL(i, e=null) {
    e && Array.isArray(e) && (e = new Set(e));
    const t = i.geometry,
        s = t.index ? t.index.array : null,
        n = t.attributes.position;
    let r,
        a,
        o,
        l,
        c = 0;
    const h = i._roots;
    for (let u = 0, f = h.length; u < f; u++)
        r = h[u],
        a = new Uint32Array(r),
        o = new Uint16Array(r),
        l = new Float32Array(r),
        d(0, c),
        c += r.byteLength;
    function d(u, f, p=!1) {
        const A = u * 2;
        if (o[A + 15] === Nd) {
            const g = a[u + 6],
                x = o[A + 14];
            let v = 1 / 0,
                y = 1 / 0,
                S = 1 / 0,
                w = -1 / 0,
                C = -1 / 0,
                M = -1 / 0;
            for (let E = g, _ = g + x; E < _; E++) {
                const I = 3 * i.resolveTriangleIndex(E);
                for (let P = 0; P < 3; P++) {
                    let D = I + P;
                    D = s ? s[D] : D;
                    const L = n.getX(D),
                        z = n.getY(D),
                        O = n.getZ(D);
                    L < v && (v = L),
                    L > w && (w = L),
                    z < y && (y = z),
                    z > C && (C = z),
                    O < S && (S = O),
                    O > M && (M = O)
                }
            }
            return l[u + 0] !== v || l[u + 1] !== y || l[u + 2] !== S || l[u + 3] !== w || l[u + 4] !== C || l[u + 5] !== M ? (l[u + 0] = v, l[u + 1] = y, l[u + 2] = S, l[u + 3] = w, l[u + 4] = C, l[u + 5] = M, !0) : !1
        } else {
            const g = u + 8,
                x = a[u + 6],
                v = g + f,
                y = x + f;
            let S = p,
                w = !1,
                C = !1;
            e ? S || (w = e.has(v), C = e.has(y), S = !w && !C) : (w = !0, C = !0);
            const M = S || w,
                E = S || C;
            let _ = !1;
            M && (_ = d(g, f, S));
            let I = !1;
            E && (I = d(x, f, S));
            const P = _ || I;
            if (P)
                for (let D = 0; D < 3; D++) {
                    const L = g + D,
                        z = x + D,
                        O = l[L],
                        K = l[L + 3],
                        V = l[z],
                        pe = l[z + 3];
                    l[u + D] = O < V ? O : V,
                    l[u + D + 3] = K > pe ? K : pe
                }
            return P
        }
    }
}
function PL(i, e, t, s, n) {
    Ot.setBuffer(i._roots[e]),
    _A(0, i, t, s, n),
    Ot.clearBuffer()
}
function _A(i, e, t, s, n) {
    const {float32Array: r, uint16Array: a, uint32Array: o} = Ot,
        l = i * 2;
    if (Ki(l, a)) {
        const h = ds(i, o),
            d = Cs(l, a);
        vL(e, t, s, h, d, n)
    } else {
        const h = Ss(i);
        xr(h, r, s) && _A(h, e, t, s, n);
        const d = Ms(i, o);
        xr(d, r, s) && _A(d, e, t, s, n)
    }
}
const DL = ["x", "y", "z"];
function RL(i, e, t, s) {
    Ot.setBuffer(i._roots[e]);
    const n = wA(0, i, t, s);
    return Ot.clearBuffer(), n
}
function wA(i, e, t, s) {
    const {float32Array: n, uint16Array: r, uint32Array: a} = Ot;
    let o = i * 2;
    if (Ki(o, r)) {
        const c = ds(i, a),
            h = Cs(o, r);
        return xL(e, t, s, c, h)
    } else {
        const c = CE(i, a),
            h = DL[c],
            u = s.direction[h] >= 0;
        let f,
            p;
        u ? (f = Ss(i), p = Ms(i, a)) : (f = Ms(i, a), p = Ss(i));
        const m = xr(f, n, s) ? wA(f, e, t, s) : null;
        if (m) {
            const v = m.point[h];
            if (u ? v <= n[p + c] : v >= n[p + c + 3])
                return m
        }
        const x = xr(p, n, s) ? wA(p, e, t, s) : null;
        return m && x ? m.distance <= x.distance ? m : x : m || x || null
    }
}
const Qh = new Vt,
    $a = new Ws,
    eo = new Ws,
    _l = new De,
    Yx = new Wi,
    Gh = new Wi;
function UL(i, e, t, s) {
    Ot.setBuffer(i._roots[e]);
    const n = EA(0, i, t, s);
    return Ot.clearBuffer(), n
}
function EA(i, e, t, s, n=null) {
    const {float32Array: r, uint16Array: a, uint32Array: o} = Ot;
    let l = i * 2;
    if (n === null && (t.boundingBox || t.computeBoundingBox(), Yx.set(t.boundingBox.min, t.boundingBox.max, s), n = Yx), Ki(l, a)) {
        const h = e.geometry,
            d = h.index,
            u = h.attributes.position,
            f = t.index,
            p = t.attributes.position,
            A = ds(i, o),
            m = Cs(l, a);
        if (_l.copy(s).invert(), t.boundsTree)
            return Zt(i, r, Gh), Gh.matrix.copy(_l), Gh.needsUpdate = !0, t.boundsTree.shapecast({
                intersectsBounds: x => Gh.intersectsBox(x),
                intersectsTriangle: x => {
                    x.a.applyMatrix4(s),
                    x.b.applyMatrix4(s),
                    x.c.applyMatrix4(s),
                    x.needsUpdate = !0;
                    for (let v = A, y = m + A; v < y; v++)
                        if (ui(eo, 3 * e.resolveTriangleIndex(v), d, u), eo.needsUpdate = !0, x.intersectsTriangle(eo))
                            return !0;
                    return !1
                }
            });
        for (let g = A, x = m + A; g < x; g++) {
            const v = e.resolveTriangleIndex(g);
            ui($a, 3 * v, d, u),
            $a.a.applyMatrix4(_l),
            $a.b.applyMatrix4(_l),
            $a.c.applyMatrix4(_l),
            $a.needsUpdate = !0;
            for (let y = 0, S = f.count; y < S; y += 3)
                if (ui(eo, y, f, p), eo.needsUpdate = !0, $a.intersectsTriangle(eo))
                    return !0
        }
    } else {
        const h = i + 8,
            d = o[i + 6];
        return Zt(h, r, Qh), !!(n.intersectsBox(Qh) && EA(h, e, t, s, n) || (Zt(d, r, Qh), n.intersectsBox(Qh) && EA(d, e, t, s, n)))
    }
}
const Hh = new De,
    gp = new Wi,
    wl = new Wi,
    LL = new b,
    FL = new b,
    NL = new b,
    OL = new b;
function kL(i, e, t, s={}, n={}, r=0, a=1 / 0) {
    e.boundingBox || e.computeBoundingBox(),
    gp.set(e.boundingBox.min, e.boundingBox.max, t),
    gp.needsUpdate = !0;
    const o = i.geometry,
        l = o.attributes.position,
        c = o.index,
        h = e.attributes.position,
        d = e.index,
        u = bs.getPrimitive(),
        f = bs.getPrimitive();
    let p = LL,
        A = FL,
        m = null,
        g = null;
    n && (m = NL, g = OL);
    let x = 1 / 0,
        v = null,
        y = null;
    return Hh.copy(t).invert(), wl.matrix.copy(Hh), i.shapecast({
        boundsTraverseOrder: S => gp.distanceToBox(S),
        intersectsBounds: (S, w, C) => C < x && C < a ? (w && (wl.min.copy(S.min), wl.max.copy(S.max), wl.needsUpdate = !0), !0) : !1,
        intersectsRange: (S, w) => {
            if (e.boundsTree) {
                const C = e.boundsTree;
                return C.shapecast({
                    boundsTraverseOrder: M => wl.distanceToBox(M),
                    intersectsBounds: (M, E, _) => _ < x && _ < a,
                    intersectsRange: (M, E) => {
                        for (let _ = M, I = M + E; _ < I; _++) {
                            const P = C.resolveTriangleIndex(_);
                            ui(f, 3 * P, d, h),
                            f.a.applyMatrix4(t),
                            f.b.applyMatrix4(t),
                            f.c.applyMatrix4(t),
                            f.needsUpdate = !0;
                            for (let D = S, L = S + w; D < L; D++) {
                                const z = i.resolveTriangleIndex(D);
                                ui(u, 3 * z, c, l),
                                u.needsUpdate = !0;
                                const O = u.distanceToTriangle(f, p, m);
                                if (O < x && (A.copy(p), g && g.copy(m), x = O, v = D, y = _), O < r)
                                    return !0
                            }
                        }
                    }
                })
            } else {
                const C = $o(e);
                for (let M = 0, E = C; M < E; M++) {
                    ui(f, 3 * M, d, h),
                    f.a.applyMatrix4(t),
                    f.b.applyMatrix4(t),
                    f.c.applyMatrix4(t),
                    f.needsUpdate = !0;
                    for (let _ = S, I = S + w; _ < I; _++) {
                        const P = i.resolveTriangleIndex(_);
                        ui(u, 3 * P, c, l),
                        u.needsUpdate = !0;
                        const D = u.distanceToTriangle(f, p, m);
                        if (D < x && (A.copy(p), g && g.copy(m), x = D, v = _, y = M), D < r)
                            return !0
                    }
                }
            }
        }
    }), bs.releasePrimitive(u), bs.releasePrimitive(f), x === 1 / 0 ? null : (s.point ? s.point.copy(A) : s.point = A.clone(), s.distance = x, s.faceIndex = v, n && (n.point ? n.point.copy(g) : n.point = g.clone(), n.point.applyMatrix4(Hh), A.applyMatrix4(Hh), n.distance = A.sub(n.point).length(), n.faceIndex = y), s)
}
function zL() {
    return typeof SharedArrayBuffer < "u"
}
const fc = new Ot.constructor,
    xd = new Ot.constructor,
    rr = new Mg(() => new Vt),
    to = new Vt,
    io = new Vt,
    vp = new Vt,
    xp = new Vt;
let yp = !1;
function QL(i, e, t, s) {
    if (yp)
        throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");
    yp = !0;
    const n = i._roots,
        r = e._roots;
    let a,
        o = 0,
        l = 0;
    const c = new De().copy(t).invert();
    for (let h = 0, d = n.length; h < d; h++) {
        fc.setBuffer(n[h]),
        l = 0;
        const u = rr.getPrimitive();
        Zt(0, fc.float32Array, u),
        u.applyMatrix4(c);
        for (let f = 0, p = r.length; f < p && (xd.setBuffer(r[h]), a = Fs(0, 0, t, c, s, o, l, 0, 0, u), xd.clearBuffer(), l += r[f].length, !a); f++)
            ;
        if (rr.releasePrimitive(u), fc.clearBuffer(), o += n[h].length, a)
            break
    }
    return yp = !1, a
}
function Fs(i, e, t, s, n, r=0, a=0, o=0, l=0, c=null, h=!1) {
    let d,
        u;
    h ? (d = xd, u = fc) : (d = fc, u = xd);
    const f = d.float32Array,
        p = d.uint32Array,
        A = d.uint16Array,
        m = u.float32Array,
        g = u.uint32Array,
        x = u.uint16Array,
        v = i * 2,
        y = e * 2,
        S = Ki(v, A),
        w = Ki(y, x);
    let C = !1;
    if (w && S)
        h ? C = n(ds(e, g), Cs(e * 2, x), ds(i, p), Cs(i * 2, A), l, a + e, o, r + i) : C = n(ds(i, p), Cs(i * 2, A), ds(e, g), Cs(e * 2, x), o, r + i, l, a + e);
    else if (w) {
        const M = rr.getPrimitive();
        Zt(e, m, M),
        M.applyMatrix4(t);
        const E = Ss(i),
            _ = Ms(i, p);
        Zt(E, f, to),
        Zt(_, f, io);
        const I = M.intersectsBox(to),
            P = M.intersectsBox(io);
        C = I && Fs(e, E, s, t, n, a, r, l, o + 1, M, !h) || P && Fs(e, _, s, t, n, a, r, l, o + 1, M, !h),
        rr.releasePrimitive(M)
    } else {
        const M = Ss(e),
            E = Ms(e, g);
        Zt(M, m, vp),
        Zt(E, m, xp);
        const _ = c.intersectsBox(vp),
            I = c.intersectsBox(xp);
        if (_ && I)
            C = Fs(i, M, t, s, n, r, a, o, l + 1, c, h) || Fs(i, E, t, s, n, r, a, o, l + 1, c, h);
        else if (_)
            if (S)
                C = Fs(i, M, t, s, n, r, a, o, l + 1, c, h);
            else {
                const P = rr.getPrimitive();
                P.copy(vp).applyMatrix4(t);
                const D = Ss(i),
                    L = Ms(i, p);
                Zt(D, f, to),
                Zt(L, f, io);
                const z = P.intersectsBox(to),
                    O = P.intersectsBox(io);
                C = z && Fs(M, D, s, t, n, a, r, l, o + 1, P, !h) || O && Fs(M, L, s, t, n, a, r, l, o + 1, P, !h),
                rr.releasePrimitive(P)
            }
        else if (I)
            if (S)
                C = Fs(i, E, t, s, n, r, a, o, l + 1, c, h);
            else {
                const P = rr.getPrimitive();
                P.copy(xp).applyMatrix4(t);
                const D = Ss(i),
                    L = Ms(i, p);
                Zt(D, f, to),
                Zt(L, f, io);
                const z = P.intersectsBox(to),
                    O = P.intersectsBox(io);
                C = z && Fs(E, D, s, t, n, a, r, l, o + 1, P, !h) || O && Fs(E, L, s, t, n, a, r, l, o + 1, P, !h),
                rr.releasePrimitive(P)
            }
    }
    return C
}
const Vh = new Wi,
    qx = new Vt,
    GL = {
        strategy: _E,
        maxDepth: 40,
        maxLeafTris: 10,
        useSharedArrayBuffer: !1,
        setBoundingBox: !0,
        onProgress: null,
        indirect: !1,
        verbose: !0
    };
class bg {
    static serialize(e, t={})
    {
        t = {
            cloneBuffers: !0,
            ...t
        };
        const s = e.geometry,
            n = e._roots,
            r = e._indirectBuffer,
            a = s.getIndex();
        let o;
        return t.cloneBuffers ? o = {
            roots: n.map(l => l.slice()),
            index: a ? a.array.slice() : null,
            indirectBuffer: r ? r.slice() : null
        } : o = {
            roots: n,
            index: a ? a.array : null,
            indirectBuffer: r
        }, o
    }
    static deserialize(e, t, s={})
    {
        s = {
            setIndex: !0,
            indirect: !!e.indirectBuffer,
            ...s
        };
        const {index: n, roots: r, indirectBuffer: a} = e,
            o = new bg(t, {
                ...s,
                [up]: !0
            });
        if (o._roots = r, o._indirectBuffer = a || null, s.setIndex) {
            const l = t.getIndex();
            if (l === null) {
                const c = new We(e.index, 1, !1);
                t.setIndex(c)
            } else
                l.array !== n && (l.array.set(n), l.needsUpdate = !0)
        }
        return o
    }
    get indirect()
    {
        return !!this._indirectBuffer
    }
    constructor(e, t={})
    {
        if (e.isBufferGeometry) {
            if (e.index && e.index.isInterleavedBufferAttribute)
                throw new Error("MeshBVH: InterleavedBufferAttribute is not supported for the index attribute.")
        } else
            throw new Error("MeshBVH: Only BufferGeometries are supported.");
        if (t = Object.assign({
            ...GL,
            [up]: !1
        }, t), t.useSharedArrayBuffer && !zL())
            throw new Error("MeshBVH: SharedArrayBuffer is not available.");
        this.geometry = e,
        this._roots = null,
        this._indirectBuffer = null,
        t[up] || (nL(this, t), !e.boundingBox && t.setBoundingBox && (e.boundingBox = this.getBoundingBox(new Vt)));
        const {_indirectBuffer: s} = this;
        this.resolveTriangleIndex = t.indirect ? n => s[n] : n => n
    }
    refit(e=null)
    {
        return (this.indirect ? BL : gL)(this, e)
    }
    traverse(e, t=0)
    {
        const s = this._roots[t],
            n = new Uint32Array(s),
            r = new Uint16Array(s);
        a(0);
        function a(o, l=0) {
            const c = o * 2,
                h = r[c + 15] === Nd;
            if (h) {
                const d = n[o + 6],
                    u = r[c + 14];
                e(l, h, new Float32Array(s, o * 4, 6), d, u)
            } else {
                const d = o + dc / 4,
                    u = n[o + 6],
                    f = n[o + 7];
                e(l, h, new Float32Array(s, o * 4, 6), f) || (a(d, l + 1), a(u, l + 1))
            }
        }
    }
    raycast(e, t=es)
    {
        const s = this._roots,
            n = this.geometry,
            r = [],
            a = t.isMaterial,
            o = Array.isArray(t),
            l = n.groups,
            c = a ? t.side : t,
            h = this.indirect ? PL : _L;
        for (let d = 0, u = s.length; d < u; d++) {
            const f = o ? t[l[d].materialIndex].side : c,
                p = r.length;
            if (h(this, d, f, e, r), o) {
                const A = l[d].materialIndex;
                for (let m = p, g = r.length; m < g; m++)
                    r[m].face.materialIndex = A
            }
        }
        return r
    }
    raycastFirst(e, t=es)
    {
        const s = this._roots,
            n = this.geometry,
            r = t.isMaterial,
            a = Array.isArray(t);
        let o = null;
        const l = n.groups,
            c = r ? t.side : t,
            h = this.indirect ? RL : EL;
        for (let d = 0, u = s.length; d < u; d++) {
            const f = a ? t[l[d].materialIndex].side : c,
                p = h(this, d, f, e);
            p != null && (o == null || p.distance < o.distance) && (o = p, a && (p.face.materialIndex = l[d].materialIndex))
        }
        return o
    }
    intersectsGeometry(e, t)
    {
        let s = !1;
        const n = this._roots,
            r = this.indirect ? UL : CL;
        for (let a = 0, o = n.length; a < o && (s = r(this, a, e, t), !s); a++)
            ;
        return s
    }
    shapecast(e)
    {
        const t = bs.getPrimitive(),
            s = this.indirect ? yL : AL;
        let {boundsTraverseOrder: n, intersectsBounds: r, intersectsRange: a, intersectsTriangle: o} = e;
        if (a && o) {
            const d = a;
            a = (u, f, p, A, m) => d(u, f, p, A, m) ? !0 : s(u, f, this, o, p, A, t)
        } else
            a || (o ? a = (d, u, f, p) => s(d, u, this, o, f, p, t) : a = (d, u, f) => f);
        let l = !1,
            c = 0;
        const h = this._roots;
        for (let d = 0, u = h.length; d < u; d++) {
            const f = h[d];
            if (l = hL(this, d, r, a, n, c), l)
                break;
            c += f.byteLength
        }
        return bs.releasePrimitive(t), l
    }
    bvhcast(e, t, s)
    {
        let {intersectsRanges: n, intersectsTriangles: r} = s;
        const a = bs.getPrimitive(),
            o = this.geometry.index,
            l = this.geometry.attributes.position,
            c = this.indirect ? p => {
                const A = this.resolveTriangleIndex(p);
                ui(a, A * 3, o, l)
            } : p => {
                ui(a, p * 3, o, l)
            },
            h = bs.getPrimitive(),
            d = e.geometry.index,
            u = e.geometry.attributes.position,
            f = e.indirect ? p => {
                const A = e.resolveTriangleIndex(p);
                ui(h, A * 3, d, u)
            } : p => {
                ui(h, p * 3, d, u)
            };
        if (r) {
            const p = (A, m, g, x, v, y, S, w) => {
                for (let C = g, M = g + x; C < M; C++) {
                    f(C),
                    h.a.applyMatrix4(t),
                    h.b.applyMatrix4(t),
                    h.c.applyMatrix4(t),
                    h.needsUpdate = !0;
                    for (let E = A, _ = A + m; E < _; E++)
                        if (c(E), a.needsUpdate = !0, r(a, h, E, C, v, y, S, w))
                            return !0
                }
                return !1
            };
            if (n) {
                const A = n;
                n = function(m, g, x, v, y, S, w, C) {
                    return A(m, g, x, v, y, S, w, C) ? !0 : p(m, g, x, v, y, S, w, C)
                }
            } else
                n = p
        }
        return QL(this, e, t, n)
    }
    intersectsBox(e, t)
    {
        return Vh.set(e.min, e.max, t), Vh.needsUpdate = !0, this.shapecast({
            intersectsBounds: s => Vh.intersectsBox(s),
            intersectsTriangle: s => Vh.intersectsTriangle(s)
        })
    }
    intersectsSphere(e)
    {
        return this.shapecast({
            intersectsBounds: t => e.intersectsBox(t),
            intersectsTriangle: t => t.intersectsSphere(e)
        })
    }
    closestPointToGeometry(e, t, s={}, n={}, r=0, a=1 / 0)
    {
        return (this.indirect ? kL : IL)(this, e, t, s, n, r, a)
    }
    closestPointToPoint(e, t={}, s=0, n=1 / 0)
    {
        return uL(this, e, t, s, n)
    }
    getBoundingBox(e)
    {
        return e.makeEmpty(), this._roots.forEach(s => {
            Zt(0, new Float32Array(s), qx),
            e.union(qx)
        }), e
    }
}
function Xx(i, e, t) {
    return i === null || (i.point.applyMatrix4(e.matrixWorld), i.distance = i.point.distanceTo(t.ray.origin), i.object = e, i.distance < t.near || i.distance > t.far) ? null : i
}
const _p = new Vo,
    Kx = new De,
    HL = Ce.prototype.raycast;
function VL(i, e) {
    if (this.geometry.boundsTree) {
        if (this.material === void 0)
            return;
        Kx.copy(this.matrixWorld).invert(),
        _p.copy(i.ray).applyMatrix4(Kx);
        const t = this.geometry.boundsTree;
        if (i.firstHitOnly === !0) {
            const s = Xx(t.raycastFirst(_p, this.material), this, i);
            s && e.push(s)
        } else {
            const s = t.raycast(_p, this.material);
            for (let n = 0, r = s.length; n < r; n++) {
                const a = Xx(s[n], this, i);
                a && e.push(a)
            }
        }
    } else
        HL.call(this, i, e)
}
class WL extends Ys {
    constructor(e=5)
    {
        super(),
        this.defines.AWESOME_SAMPLES = e,
        this.uniforms = {
            tTriangles: {
                value: le.load("igloo/triangles_tiling.ktx2", "srgb-repeat")
            },
            tBlue: {
                value: le.load("noises/blue-8-128-rgb.ktx2", "colordata-repeat")
            },
            uBlueOffset: {
                value: new H
            },
            tMouseFrost: {
                value: null
            },
            uColorFrost: {
                value: new Z("#83a1c5")
            },
            uChromaticAberration: {
                value: .1
            },
            uTransmission: {
                value: 1
            },
            uThickness: {
                value: 2
            },
            uAttenuationDistance: {
                value: 0
            },
            uAttenuationColor: {
                value: new Z("#ffffff")
            },
            uTransmissionSamplerSize: {
                value: new H
            },
            tTransmissionSamplerMap: {
                value: null
            },
            uResolution: {
                value: new H(1, 1)
            }
        },
        this.onBeforeCompile = t => {
            t.uniforms = {
                ...t.uniforms,
                ...this.uniforms
            },
            t.fragmentShader = `
                            uniform float uChromaticAberration;
                            uniform sampler2D tBlue;
                            uniform vec2 uBlueOffset;
                            uniform vec2 uResolution;

                            uniform float uTransmission;
                            uniform float uThickness;
                            uniform float uAttenuationDistance;
                            uniform vec3 uAttenuationColor;

                            ${Uc}
                            ${t.fragmentShader}
                        `,
            t.fragmentShader = t.fragmentShader.replace("#include <transmission_pars_fragment>", `

                                uniform vec2 uTransmissionSamplerSize;
                                uniform sampler2D tTransmissionSamplerMap;

                                uniform mat4 modelMatrix;
                                uniform mat4 projectionMatrix;

                                varying vec3 vWorldPosition;

                                // Mipped Bicubic Texture Filtering by N8
                                // https://www.shadertoy.com/view/Dl2SDW

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

                                // g0 and g1 are the two amplitude functions
                                float g0( float a ) {

                                    return w0( a ) + w1( a );

                                }

                                float g1( float a ) {

                                    return w2( a ) + w3( a );

                                }

                                // h0 and h1 are the two offset functions
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

                                    // Direction of refracted light.
                                    vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );

                                    // Compute rotation-independant scaling of the model matrix.
                                    vec3 modelScale;
                                    modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
                                    modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
                                    modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );

                                    // The thickness is specified in local space.
                                    return normalize( refractionVector ) * thickness * modelScale;

                                }

                                float applyIorToRoughness( const in float roughness, const in float ior ) {

                                    // Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
                                    // an IOR of 1.5 results in the default amount of microfacet refraction.
                                    return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );

                                }

                                vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {

                                    float lod = log2( uTransmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
                                    return textureBicubic( tTransmissionSamplerMap, fragCoord.xy, lod );

                                }

                                vec4 getTransmissionSampleCheap( const in vec2 fragCoord, const in float roughness, const in float ior ) {
                                    float lod = log2( uTransmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
                                    return textureLod( tTransmissionSamplerMap, fragCoord.xy, lod );
                                }

                                vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {

                                    return vec3( 1.0 ); // fix

                                    /*
                                    if ( isinf( attenuationDistance ) ) {

                                        // Attenuation distance is +∞, i.e. the transmitted color is not attenuated at all.
                                        return vec3( 1.0 );

                                    } else {

                                        // Compute light attenuation using Beer's law.
                                        vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
                                        vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law
                                        return transmittance;

                                    }
                                    */
                                }

                            vec4 getIBLVolumeRefraction2( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor, const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix, const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness, const in vec3 attenuationColor, const in float attenuationDistance ) {
                                vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
                                vec3 refractedRayExit = position + transmissionRay;
                                vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
                                vec2 refractionCoords = ndcPos.xy / ndcPos.w;
                                refractionCoords += 1.0;
                                refractionCoords /= 2.0;

                                vec4 transmittedLight = getTransmissionSampleCheap( refractionCoords, roughness, ior );
                                vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
                                vec3 attenuatedColor = transmittance * transmittedLight.rgb;
                                vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
                                float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
                                return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
                            }
                        `),
            t.fragmentShader = t.fragmentShader.replace("#include <transmission_fragment>", `

                                /*
                                material.transmission = transmission;
                                material.transmissionAlpha = 1.0;
                                material.thickness = thickness;
                                material.attenuationDistance = attenuationDistance;
                                material.attenuationColor = attenuationColor;
                                */

                                vec3 pos = vWorldPosition;
                                vec3 v = normalize( cameraPosition - pos );
                                vec3 n = inverseTransformDirection( normal, viewMatrix );

                                vec4 transmitted = vec4(0.0);

                                // custom chromatic aberration / threejs default refraction

                                if (uChromaticAberration > 0.0) {

                                    float transmissionR, transmissionB, transmissionG;
                                    float thickness_smear = uThickness * pow(roughnessFactor, 0.33);
                                    vec4 noise = getNoise(tBlue, gl_FragCoord.xy, uBlueOffset);
                                    vec4 noise2 = getNoise(tBlue, gl_FragCoord.xy + vec2(8.4, 9.6), uBlueOffset * + vec2(1.34, 34.32));

                                    vec3 distortionNormal = roughnessFactor * roughnessFactor * 2.0 * normalize(noise2.xyz) + mousefrost * 0.025;
                                    vec3 sampleNorm = normalize(n + distortionNormal);
                                    float totalSamples = ${e}.0;

                                    for (float i = 0.0; i < ${e}.0; i ++) {
                                        transmissionR = getIBLVolumeRefraction2(
                                            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
                                            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, uThickness + thickness_smear * (i + noise.g) / totalSamples,
                                            uAttenuationColor, uAttenuationDistance
                                        ).r;
                                        transmissionG = getIBLVolumeRefraction2(
                                            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
                                            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior  * (1.0 + uChromaticAberration * (i + noise.r) / totalSamples), uThickness + thickness_smear * (i + noise.r) / totalSamples,
                                            uAttenuationColor, uAttenuationDistance
                                        ).g;
                                        transmissionB = getIBLVolumeRefraction2(
                                            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
                                            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior * (1.0 + 2.0 * uChromaticAberration * (i + noise.b) / totalSamples), uThickness + thickness_smear * (i + noise.b) / totalSamples,
                                            uAttenuationColor, uAttenuationDistance
                                        ).b;

                                        transmitted.r += transmissionR;
                                        transmitted.g += transmissionG;
                                        transmitted.b += transmissionB;
                                    }

                                    transmitted /= ${e}.0;
                                    transmitted.a = 1.0;
                                } else {

                                    // three's default
                                    transmitted = getIBLVolumeRefraction2(
                                        n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
                                        pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, uThickness,
                                        uAttenuationColor, uAttenuationDistance
                                    );
                                }

                                // material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
                                // totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
                                totalDiffuse = transmitted.rgb; // fix
                                totalDiffuse = clamp(totalDiffuse, vec3(0.0), vec3(1.0)); // fix
                        `),
            t.vertexShader = t.vertexShader.replace("#include <uv_pars_vertex>", `attribute vec2 uv1; 
             varying vec2 vUv1; 
             varying vec3 vWorldPosition; 
             #include <uv_pars_vertex>`),
            t.vertexShader = t.vertexShader.replace("#include <uv_vertex>", `vUv1 = uv1; 
            #include <uv_vertex>`),
            t.vertexShader = t.vertexShader.replace("#include <fog_vertex>", `#include <fog_vertex> 
             vWorldPosition = worldPosition.xyz;`),
            t.fragmentShader = t.fragmentShader.replace("#include <uv_pars_fragment>", `
                            ${Ht}
                            ${h_}
                            varying vec2 vUv1;
                            uniform sampler2D tMouseFrost;
                            uniform sampler2D tTriangles;
                            uniform vec3 uColorFrost;
                            #include <uv_pars_fragment>
                        `),
            t.fragmentShader = t.fragmentShader.replace("#include <clipping_planes_fragment>", `
                            vec2 mousefrostdata = texture2D(tMouseFrost, vUv1).rg;
                            float mousefrost = mousefrostdata.r;
                            float mousefrostrim = mousefrostdata.g;
                            #include <clipping_planes_fragment>
                        `),
            t.fragmentShader = t.fragmentShader.replace("#include <roughnessmap_fragment>", `
                            float roughnessFactor = roughness;
                            roughnessFactor *= 1.0 - mousefrost; // new line

                            #ifdef USE_ROUGHNESSMAP
                                vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
                                roughnessFactor *= texelRoughness.g;
                            #endif
                        `),
            t.fragmentShader = t.fragmentShader.replace("#include <normal_fragment_maps>", `
                            #ifdef USE_NORMALMAP_OBJECTSPACE
                                normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals
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
                                mapN.xy *= 1.0 - mousefrost; // new line
                                normal = normalize( tbn * mapN );
                            #elif defined( USE_BUMPMAP )
                                normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
                            #endif
                        `),
            t.fragmentShader = t.fragmentShader.replace("vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;", `
                            totalEmissiveRadiance += mousefrostrim * uColorFrost;
                            float triangles = texture2D(tTriangles, vNormalMapUv * (9.0 * min(1.0, uResolution.y / 1300.0))).r;
                            totalEmissiveRadiance += triangles * mousefrostrim * 10.0;
                            totalEmissiveRadiance += triangles * pow(mousefrost, 2.0);
                            vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
                            outgoingLight = clamp(outgoingLight, vec3(0.0), vec3(1.0));
                        `)
        }
    }
}
const El = new b,
    wp = new b,
    Ep = new b,
    Wh = new b,
    Jx = new b;
class YL {
    constructor(e)
    {
        this.parent = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.animationProgress = {
            value: 0
        },
        this.isHiding = !1,
        this.init()
    }
    async init()
    {
        const e = new ot,
            t = new ga({
                color: "#ffffff",
                opacity: 1,
                transparent: !0
            });
        t.depthTest = !1,
        t.depthWrite = !1,
        t.blending = pt,
        this.lineMesh = new yr(e, t),
        this.lineMesh.frustumCulled = !1,
        this.lineMesh.visible = !1,
        this.lineMesh.name = "title lines",
        this.lineMesh.renderOrder = 999,
        this.parent.scene.textsGroup.add(this.lineMesh),
        this.text = new Ui({
            font: "IBMPlexMono-Medium",
            text: this.parent.options.title.toUpperCase(),
            width: 1,
            align: "left",
            lineHeight: .8,
            size: .13
        }, {
            uniforms: {
                tMap: {
                    value: le.load("../fonts/IBMPlexMono-Medium-datatexture.ktx2", "data")
                },
                uColor: {
                    value: new Z("#ffffff")
                },
                uShow1: {
                    value: 0
                },
                uShow2: {
                    value: 0
                }
            },
            vertexShader: `
                            ${Nt}
                            ${Ue}

                            attribute vec3 textWeights;
                            uniform float uShow1;
                            uniform float uShow2;

                            varying vec2 vUv;
                            varying float vAlpha;

                            void main() {

                                float tr1 = falloff(textWeights.x, 0.0, 1.0, 0.1, clamp(uShow1, 0.0, 1.0));
                                float tr2 = falloff(textWeights.x, 0.0, 1.0, 1.0, clamp(uShow2, 0.0, 1.0));

                                vUv = uv;
                                vUv.x = mod(uv.x + 0.125 * mod(floor((1.0 - tr2) * 5.753), 8.0), 1.0);
                                vAlpha = tr1;

                                gl_Position = projectionMatrix * viewMatrix * billboardModelMatrix() * vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            ${ii}
                            ${Ht}
                            ${Ue}

                            uniform sampler2D tMap;
                            uniform vec3 uColor;

                            varying vec2 vUv;
                            varying float vAlpha;

                            void main() {
                                vec2 uv = vUv;
                                float alpha = vAlpha;
                                alpha *= msdf(tMap, uv);
                                gl_FragColor = vec4(uColor, alpha);
                            }
                        `,
            depthWrite: !1,
            depthTest: !1,
            blending: pt
        }),
        this.text.name = "title text",
        this.text.frustumCulled = !1,
        this.text.visible = !1,
        this.text.renderOrder = 999,
        this.parent.scene.textsGroup.add(this.text),
        await this.text.ready,
        this.isReady()
    }
    update(e, t)
    {
        if (1 - Math.abs(ie.fit(t, -1.6, .5, -1, 1)) === 0 ? this.lineMesh.visible && !this.isHiding && (this.isHiding = !0, re.to(this.animationProgress, {
            value: 0,
            duration: .2,
            ease: "none",
            overwrite: !0,
            onComplete: () => {
                this.lineMesh.visible = !1,
                this.isHiding = !1
            }
        }), re.to(this.text.material.uniforms.uShow1, {
            value: 0,
            duration: .2,
            ease: "none",
            overwrite: !0,
            onComplete: () => {
                this.text.visible = !1
            }
        })) : this.lineMesh.visible || (this.lineMesh.visible = !0, this.text.visible = !0, this.isHiding = !1, re.to(this.animationProgress, {
            value: 1,
            duration: .2,
            ease: "none",
            overwrite: !0
        }), re.to(this.text.material.uniforms.uShow1, {
            value: 1,
            duration: .4,
            ease: "none",
            overwrite: !0
        }), re.fromTo(this.text.material.uniforms.uShow2, {
            value: 0
        }, {
            value: 1,
            duration: .75,
            ease: "none",
            overwrite: !0
        }), this.parent.texts.playBeep()), !this.lineMesh.visible)
            return;
        const n = this.parent.mesh.geometry.boundingBox;
        El.set(ie.mix(n.min.x, n.max.x, .35), ie.mix(n.max.y, n.min.y, .15), ie.mix(n.min.z, n.max.z, .93)),
        El.applyMatrix4(this.parent.mesh.matrixWorld);
        const r = this.parent.scene._LEFT,
            a = this.parent.scene._UP;
        wp.copy(El).addScaledVector(r, -.3).addScaledVector(a, .3),
        Ep.copy(wp).addScaledVector(r, -.5),
        Wh.copy(El).lerp(wp, ie.fit(this.animationProgress.value, 0, .5, 0, 1)),
        Jx.copy(Wh).lerp(Ep, ie.fit(this.animationProgress.value, .5, 1, 0, 1)),
        this.lineMesh.geometry.setAttribute("position", new nt([...El, ...Wh, ...Wh, ...Jx], 3)),
        this.lineMesh.geometry.needsUpdate = !0,
        this.text.scale.setScalar(Math.min(.8, .5 / (q.screen.h / 1300))),
        this.text.position.copy(Ep).addScaledVector(a, this.text.size.y * .5 * this.text.scale.y + .05)
    }
}
const Cl = new b,
    Cp = new b,
    jx = new b;
class qL {
    constructor(e)
    {
        this.parent = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.animationProgress = {
            value: 0
        },
        this.animating = !1,
        this.init()
    }
    async init()
    {
        const e = new ot,
            t = new ga({
                color: "#ffffff",
                opacity: 1,
                transparent: !0
            });
        t.depthTest = !1,
        t.depthWrite = !1,
        t.blending = pt,
        this.lineMesh = new yr(e, t),
        this.lineMesh.frustumCulled = !1,
        this.lineMesh.visible = !1,
        this.lineMesh.name = "title lines",
        this.lineMesh.renderOrder = 999,
        this.parent.scene.textsGroup.add(this.lineMesh);
        const s = this.parent.options.interior.enabled;
        this.text = new Ui({
            font: "IBMPlexMono-Medium",
            text: `D ${this.parent.options.date.replaceAll("/", ".")}
            ${(s ? Be.click : Be.clickDisabled).toUpperCase()}`,
            width: 1,
            align: "right",
            lineHeight: .8,
            size: .115
        }, {
            uniforms: {
                tMap: {
                    value: le.load("../fonts/IBMPlexMono-Medium-datatexture.ktx2", "data")
                },
                uColor: {
                    value: new Z("#ffffff")
                },
                uShow1: {
                    value: 0
                },
                uShow2: {
                    value: 0
                }
            },
            vertexShader: `
                            ${Nt}
                            ${Ue}

                            attribute vec3 textWeights;
                            uniform float uShow1;
                            uniform float uShow2;

                            varying vec2 vUv;
                            varying float vAlpha;

                            void main() {

                                float tr1 = falloff(textWeights.x, 0.0, 1.0, 0.1, clamp(uShow1, 0.0, 1.0));
                                float tr2 = falloff(textWeights.x, 0.0, 1.0, 1.0, clamp(uShow2, 0.0, 1.0));

                                vUv = uv;
                                vUv.x = mod(uv.x + 0.125 * mod(floor((1.0 - tr2) * 5.753), 8.0), 1.0);
                                vAlpha = tr1;

                                gl_Position = projectionMatrix * viewMatrix * billboardModelMatrix() * vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            ${ii}
                            ${Ht}
                            ${Ue}

                            uniform sampler2D tMap;
                            uniform vec3 uColor;

                            varying vec2 vUv;
                            varying float vAlpha;

                            void main() {
                                vec2 uv = vUv;
                                float alpha = vAlpha;
                                alpha *= msdf(tMap, uv);
                                gl_FragColor = vec4(uColor, alpha);
                            }
                        `,
            depthWrite: !1,
            depthTest: !1,
            blending: pt
        }),
        this.text.name = "title text",
        this.text.frustumCulled = !1,
        this.text.visible = !1,
        this.text.renderOrder = 999,
        this.parent.scene.textsGroup.add(this.text),
        await this.text.ready,
        this.isReady()
    }
    update(e, t)
    {
        if (1 - Math.abs(ie.fit(t, -.6, 1.25, -1, 1)) === 0 ? this.lineMesh.visible && !this.isHiding && (this.isHiding = !0, re.to(this.animationProgress, {
            value: 0,
            duration: .2,
            ease: "none",
            overwrite: !0,
            onComplete: () => {
                this.lineMesh.visible = !1,
                this.isHiding = !1
            }
        }), re.to(this.text.material.uniforms.uShow1, {
            value: 0,
            duration: .2,
            ease: "none",
            overwrite: !0,
            onComplete: () => {
                this.text.visible = !1
            }
        })) : this.lineMesh.visible || (this.lineMesh.visible = !0, this.text.visible = !0, this.isHiding = !1, re.to(this.animationProgress, {
            value: 1,
            duration: .2,
            ease: "none",
            overwrite: !0
        }), re.to(this.text.material.uniforms.uShow1, {
            value: 1,
            duration: .4,
            ease: "none",
            overwrite: !0
        }), re.fromTo(this.text.material.uniforms.uShow2, {
            value: 0
        }, {
            value: 1,
            duration: .75,
            ease: "none",
            overwrite: !0
        }), this.parent.texts.playBeep()), !this.lineMesh.visible)
            return;
        const n = this.parent.mesh.geometry.boundingBox;
        Cl.set(ie.mix(n.min.x, n.max.x, .7), ie.mix(n.max.y, n.min.y, .75), ie.mix(n.min.z, n.max.z, .95)),
        Cl.applyMatrix4(this.parent.mesh.matrixWorld);
        const r = this.parent.scene._LEFT,
            a = this.parent.scene._UP;
        Cp.copy(Cl).addScaledVector(r, .7),
        jx.copy(Cl).lerp(Cp, ie.fit(this.animationProgress.value, 0, .5, 0, 1)),
        this.lineMesh.geometry.setAttribute("position", new nt([...Cl, ...jx], 3)),
        this.lineMesh.geometry.needsUpdate = !0,
        this.text.scale.setScalar(Math.min(.8, .5 / (q.screen.h / 1300))),
        this.text.position.copy(Cp).addScaledVector(a, this.text.size.y * .5 * this.text.scale.y + .05)
    }
}
const Sp = new b,
    Zx = new b;
class XL {
    constructor(e)
    {
        this.parent = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.isHiding = !1,
        this.targetTemp = e.options.temp,
        this.temp = this.targetTemp,
        this.random1 = Math.random(),
        this.random2 = Math.random(),
        this.init()
    }
    async init()
    {
        const e = new Ui({
                font: "IBMPlexMono-Medium",
                text: "TEMP",
                width: .75,
                align: "left",
                lineHeight: .8,
                size: .1
            }),
            t = new Ui({
                font: "IBMPlexMono-Medium",
                text: ".",
                width: .75,
                align: "left",
                lineHeight: .8,
                size: .1
            });
        await Promise.all([e.ready, t.ready]);
        const s = e.geometry.clone(),
            n = t.geometry.clone();
        [s, n].forEach(f => {
            f.deleteAttribute("centr"),
            f.deleteAttribute("lineWeights"),
            f.deleteAttribute("textWeights"),
            f.deleteAttribute("uvMask"),
            f.setAttribute("isNum", new Ev(new Int32Array(new Array(f.attributes.position.count).fill(-1)), 1))
        });
        const r = [s],
            a = .045,
            o = new kt(.06, .06);
        o.deleteAttribute("normal"),
        o.setAttribute("isNum", new Ev(new Int32Array(new Array(o.attributes.position.count).fill(1)), 1)),
        o.scale(.77777, 1, 1);
        let l = .3,
            c = 0;
        for (let f = 0; f < 8; f++) {
            const p = o.clone();
            if (l += a, p.translate(l, .024 + c, 0), r.push(p), f === 1 || f === 5) {
                l += .025;
                const A = n.clone();
                A.translate(l, c, 0),
                r.push(A),
                l += .025
            }
            if (f === 3) {
                c = -.1,
                l = .3;
                const A = o.clone();
                A.attributes.isNum.array.fill(-2),
                A.translate(l - .015, .024 + c, 0),
                r.push(A)
            }
        }
        const h = yE(r),
            d = [];
        for (let f = 0; f < h.attributes.position.count; f += 4) {
            const p = f / (h.attributes.position.count - 1);
            d.push(p, p, p, p)
        }
        h.setAttribute("textWeight", new nt(d, 1));
        const u = new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                tNums: {
                    value: le.load("numbers-datatexture.ktx2", "data")
                },
                tMap: {
                    value: le.load("../fonts/IBMPlexMono-Medium-datatexture.ktx2", "data")
                },
                uColor: {
                    value: new Z("#ffffff")
                },
                uShow1: {
                    value: 0
                },
                uShow2: {
                    value: 0
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}
                            ${Nt}
                            ${Ue}

                            attribute int isNum;
                            attribute float textWeight;

                            uniform float uShow1;
                            uniform float uShow2;

                            varying vec2 vUv;
                            flat varying int vIsNum;
                            varying float vAlpha;
                            varying float vAlpha2;

                            void main() {
                                vIsNum = isNum;

                                float tr1 = falloff(textWeight, 0.0, 1.0, 0.1, clamp(uShow1, 0.0, 1.0));
                                float tr2 = falloff(textWeight, 0.0, 1.0, 1.0, clamp(uShow2, 0.0, 1.0));

                                vUv = uv;
                                if (isNum == -1) { // letters
                                    vUv.x = mod(uv.x + 0.125 * mod(floor((1.0 - tr2) * 5.753), 8.0), 1.0);
                                }

                                vAlpha = tr1;
                                vAlpha2 = tr2;

                                gl_Position = projectionMatrix * viewMatrix * billboardModelMatrix() * vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}
                            ${ii}
                            ${Zo}

                            uniform sampler2D tNums;
                            uniform sampler2D tMap;
                            uniform vec3 uColor;

                            flat varying int vIsNum;
                            varying vec2 vUv;
                            varying float vAlpha;
                            varying float vAlpha2;

                            void main() {
                                vec2 uv = vUv;

                                float alpha = vAlpha;

                                if (vIsNum == -1) { // letters
                                    alpha *= msdf(tMap, uv);
                                } else if (vIsNum < -1) { // sign
                                    // -2 negative, -3 positive,
                                    vec2 signUV = abs(uv * 2.0 - 1.0);
                                    alpha = aastep(signUV.y, 0.18) * aastep(signUV.x, 0.8);
                                    if (vIsNum == -3) alpha = max(alpha, aastep(signUV.x, 0.2) * aastep(signUV.y, 0.7));
                                    alpha *= step(0.99, vAlpha);
                                } else { // numbers
                                    float numStep = 1.0 / 10.0;
                                    uv = vec2(numStep * vUv.x + float(vIsNum) * numStep, vUv.y);
                                    uv.x = uv.x + numStep * mod(floor((1.0 - vAlpha2) * 5.753), 8.0);
                                    alpha *= msdf(tNums, uv);
                                }

                                gl_FragColor = vec4(uColor, alpha);
                            }
                        `,
            transparent: !0,
            depthWrite: !1,
            depthTest: !1,
            blending: pt
        });
        this.mesh = new Ce(h, u),
        this.mesh.name = "temp numbers",
        this.mesh.frustumCulled = !1,
        this.mesh.renderOrder = 999,
        this.mesh.visible = !1,
        this.parent.scene.textsGroup.add(this.mesh),
        this.isReady()
    }
    update(e, t)
    {
        if (1 - Math.abs(ie.fit(t, -1.2, .5, -1, 1)) === 0 ? this.mesh.visible && !this.isHiding && (this.isHiding = !0, re.to(this.mesh.material.uniforms.uShow1, {
            value: 0,
            duration: .2,
            ease: "none",
            overwrite: !0,
            onComplete: () => {
                this.mesh.visible = !1
            }
        })) : this.mesh.visible || (this.mesh.visible = !0, this.isHiding = !1, re.to(this.mesh.material.uniforms.uShow1, {
            value: 1,
            duration: .4,
            ease: "none",
            overwrite: !0
        }), re.fromTo(this.mesh.material.uniforms.uShow2, {
            value: 0
        }, {
            value: 1,
            duration: .75,
            ease: "none",
            overwrite: !0
        }), this.parent.texts.playBeep()), !this.mesh.visible)
            return;
        const n = this.parent.mesh.geometry.boundingBox;
        Sp.set(ie.mix(n.min.x, n.max.x, .7), ie.mix(n.max.y, n.min.y, .15), ie.mix(n.min.z, n.max.z, .93)),
        Sp.applyMatrix4(this.parent.mesh.matrixWorld);
        const r = this.parent.scene._LEFT;
        Zx.copy(Sp).addScaledVector(r, .3),
        this.mesh.scale.setScalar(Math.min(.8, .5 / (q.screen.h / 1300))),
        this.mesh.position.copy(Zx),
        this.temp = this.targetTemp + Math.sin(Fe.time * .05 + this.random1) * 2;
        const a = this.temp.toFixed(2).split(".");
        this.temp >= 0 && (a[0] = `+${a[0]}`),
        a[0].length === 2 && (a[0] = `${a[0][0]}0${a[0][1]}`);
        const o = [...a[0], ...a[1]],
            c = (this.temp * 1.8 + 32).toFixed(2).split(".");
        c[0].length === 1 && (a[0] = `0${c[0]}`);
        const h = [...c[0], ...c[1]],
            d = this.mesh.geometry.attributes.isNum.array;
        [4, 5, 7, 8].forEach((u, f) => {
            const p = Number(h[f]);
            for (let A = 0; A < 4; A++)
                d[u * 4 + A] = p
        }),
        [10, 11, 13, 14].forEach((u, f) => {
            const p = Number(o[f + 1]);
            for (let A = 0; A < 4; A++)
                d[u * 4 + A] = p
        }),
        [9].forEach((u, f) => {
            const p = this.temp < 0 ? -2 : -3;
            for (let A = 0; A < 4; A++)
                d[u * 4 + A] = p
        }),
        this.mesh.geometry.attributes.isNum.needsUpdate = !0
    }
}
class KL {
    constructor(e)
    {
        this.parent = e,
        this.lastBeepPlayed = 0,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.init()
    }
    async init()
    {
        await Promise.all([this.titleLine(), this.typeDate(), this.temp()]),
        this.isReady()
    }
    titleLine()
    {
        return this.title = new YL(this.parent), this.title.ready
    }
    typeDate()
    {
        return this.typedate = new qL(this.parent), this.typedate.ready
    }
    temp()
    {
        return this.temp = new XL(this.parent), this.temp.ready
    }
    playBeep()
    {
        if (!(Fe.time - this.lastBeepPlayed < .4))
            switch (this.lastBeepPlayed = Fe.time, Math.floor(Math.random() * 3)) {
            case 0:
                Q.emit("webgl_play_audio", "beeps");
                break;
            case 1:
                Q.emit("webgl_play_audio", "beeps2");
                break;
            case 2:
                Q.emit("webgl_play_audio", "beeps3");
                break
            }
    }
    update(e, t, s)
    {
        [this.title, this.typedate, this.temp].forEach(n => n.update(t, s))
    }
}
class JL extends fe {
    constructor()
    {
        super({
            uniformsGroups: [he.UBO],
            uniforms: {
                tBuffer: {
                    value: null
                },
                tAdvect: {
                    value: le.load("cubes/advect.png", "colordata-repeat")
                },
                uSplatCoords: {
                    value: new H
                },
                uSplatPrevCoords: {
                    value: new H
                },
                uSplatRadius: {
                    value: 0
                }
            },
            vertexShader: `
                            ${ae}

                            varying vec2 vUv;

                            void main() {
                                vUv = uv;
                                gl_Position = vec4( position, 1.0 );
                            }
                        `,
            fragmentShader: `
                            ${ae}
                            ${Ht}

                            const float aspectRatio = 1.0;
                            float line(vec2 uv, vec2 point1, vec2 point2) {
                                vec2 pa = uv - point1, ba = point2 - point1;
                                pa.x *= aspectRatio;
                                ba.x *= aspectRatio;
                                float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                                return length(pa - ba * h);
                            }

                            float cubicIn(float t) { return t * t * t; }

                            varying vec2 vUv;

                            uniform sampler2D tBuffer;
                            uniform sampler2D tAdvect;
                            uniform vec2 uSplatCoords;
                            uniform vec2 uSplatPrevCoords;
                            uniform float uSplatRadius;

                            void main() {
                                vec2 uv = vUv;

                                float resolution = float(textureSize(tBuffer, 0));
                                vec2 invResolution = 1.0 / vec2(resolution);

                                // advect by noise
                                vec2 noiseUv = vUv;
                                vec2 advect = (texture2D(tAdvect, noiseUv * 3.0).xy * 2.0 - 1.0) * 1.0;
                                uv += advect * invResolution;

                                // wave propagation
                                float wavespeed = 1.0;
                                vec2 offset = invResolution * wavespeed;
                                float l = texture2D(tBuffer, uv - vec2(offset.x, 0.0)).r;
                                float r = texture2D(tBuffer, uv + vec2(offset.x, 0.0)).r;
                                float t = texture2D(tBuffer, uv + vec2(0.0, offset.y)).r;
                                float b = texture2D(tBuffer, uv - vec2(0.0, offset.y)).r;
                                float nextVal = max(max(max(l, r), t), b);

                                // mouse line splat
                                float radius = 0.05 * smoothstep(0.1, 1.0, uSplatRadius);
                                float splat = cubicIn(clamp(1.0 - line(vUv, uSplatPrevCoords.xy, uSplatCoords.xy) / radius, 0.0, 1.0));
                                nextVal += splat;

                                // damping and clamp
                                nextVal *= 0.985;
                                nextVal = min(nextVal, 1.0);

                                float rim = nextVal - texture2D(tBuffer, uv).r;

                                gl_FragColor = vec4(nextVal, rim, 0.0, 1.0);
                            }
                        `,
            depthTest: !1
        })
    }
}
class jL {
    constructor(e, t={})
    {
        this.parent = e,
        this.options = {
            width: 512,
            height: 512,
            ...t
        };
        const s = new vt(this.options.width, this.options.height, {
            type: Mi,
            depthBuffer: !1
        });
        if (this.rts = [s, s.clone()], this.finalRT = s, this.fsQuad = new wg(new JL), this.renderer = he.renderer.webgl, this.interaction = new Er({
            camera: this.parent.scene.camera,
            meshes: [this.parent.mesh],
            onMove: this.onMouseMove,
            onHover: this.onMouseHover,
            onClick: this.onMouseClick,
            hoverCursor: !0,
            ctx: this
        }), !!this.parent.options.interior.enabled || (this.interaction.enable = () => {}, this.interaction.disable = () => {}), this.interaction._raycaster.firstHitOnly = !0, this.splatPosition = new H, this.splatLastPosition = new H, this.splatLastMoveTime = 0, this.splatLastRenderTime = 0, this.splatTargetVelocity = 0, this.splatVelocity = 0, this.splatHovered = !1, this.soundVelocity = 0, this.update(), this.debug = !1, this.debug && !e.__debugAdded) {
            e.__debugAdded = !0;
            const r = new kt(2, 2),
                a = new fe({
                    uniforms: {
                        tBuffer: {
                            value: null
                        }
                    },
                    vertexShader: `
                                    varying vec2 vUv;

                                    void main() {
                                        vUv = uv;
                                        vec3 pos = position * 0.25 - 0.75;
                                        gl_Position = vec4(pos, 1.0);
                                    }
                                `,
                    fragmentShader: `
                                    varying vec2 vUv;

                                    uniform sampler2D tBuffer;
                                    void main() {
                                        vec3 color = texture2D(tBuffer, vUv).rgb;
                                        gl_FragColor = vec4(color, 1.0);
                                    }
                                `,
                    depthTest: !1,
                    transparent: !0
                });
            this.debugMesh = new Ce(r, a),
            this.debugMesh.renderOrder = 1e3,
            this.debugMesh.frustumCulled = !1,
            this.parent.scene.add(this.debugMesh)
        }
    }
    onMouseMove(e)
    {
        const t = e.interactions[0];
        if (!t)
            return;
        const s = t.uv1;
        this.splatPosition.copy(s)
    }
    onMouseHover(e)
    {
        this.splatHovered = !0
    }
    onMouseClick(e)
    {
        q.devScene || (this.interaction.disable(), Q.emit("webgl_switch_scene", `portfolio/${this.parent.options.hash}`))
    }
    update()
    {
        if (Fe.time - this.splatLastRenderTime < .015)
            return;
        this.splatLastRenderTime = Fe.time;
        let e = this.splatPosition.distanceTo(this.splatLastPosition);
        const t = Fe.time - this.splatLastMoveTime;
        e > 0 && (this.splatLastMoveTime = Fe.time),
        (t > .15 || this.splatHovered || e > .3) && (this.splatLastPosition.copy(this.splatPosition), this.splatTargetVelocity = 0, this.soundVelocity = 0, e = 0),
        this.splatHovered = !1,
        this.splatTargetVelocity += e * 6,
        this.splatTargetVelocity *= .88,
        this.splatTargetVelocity = ie.clamp(this.splatTargetVelocity, 0, 1),
        this.splatVelocity = ie.lerp(this.splatVelocity, ie.ease(this.splatTargetVelocity, "power4.out"), .1),
        this.soundVelocity += e * 4,
        this.soundVelocity *= .98,
        this.soundVelocity = ie.clamp(this.soundVelocity, 0, 1),
        this.fsQuad.material.uniforms.uSplatCoords.value.copy(this.splatPosition),
        this.fsQuad.material.uniforms.uSplatPrevCoords.value.copy(this.splatLastPosition),
        this.fsQuad.material.uniforms.uSplatRadius.value = this.splatVelocity,
        this.splatLastPosition.copy(this.splatPosition);
        const s = this.renderer.getRenderTarget();
        this.fsQuad.material.uniforms.tBuffer.value = this.finalRT.texture,
        this.finalRT = this.finalRT === this.rts[0] ? this.rts[1] : this.rts[0],
        this.renderer.setRenderTarget(this.finalRT),
        this.fsQuad.render(this.renderer),
        this.renderer.setRenderTarget(s),
        this.debug && (this.debugMesh.material.uniforms.tBuffer.value = this.finalRT.texture)
    }
}
const Mp = new b;
class ZL {
    constructor(e)
    {
        this.parent = e,
        this.scene = this.parent.scene,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.init()
    }
    init()
    {
        const e = new ot;
        e.setAttribute("position", new nt(new Float32Array(this.parent.maxPlexusPoints * 3), 3)),
        e.setAttribute("progress", new nt(new Float32Array(this.parent.maxPlexusPoints), 1));
        const t = new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                uColor: {
                    value: new Z("#666666")
                },
                uSize: {
                    value: 50
                },
                uHover: {
                    value: 0
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}
                            ${Rc}

                            attribute float progress;
                            uniform float uSize;
                            uniform float uHover;

                            flat varying float vProgress;
                            varying vec3 wPos;

                            void main() {
                                vProgress = progress;

                                vec3 pos = position;
                                wPos = pos;

                                float size = uSize * progress * uHover;
                                vec4 viewPos = modelViewMatrix * vec4(pos, 1.0);

                                gl_Position = projectionMatrix * viewPos;
                                gl_PointSize = size / length(viewPos.xyz) * (resolution.y / 1300.0);
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}
                            ${Zo}
                            ${Cr}

                            uniform vec3 uColor;

                            flat varying float vProgress;
                            varying vec3 wPos;

                            void main() {
                                if (vProgress < 0.001) discard;
                                vec2 uv = rotateUV(gl_PointCoord.xy, mix(1.3, 0.0, vProgress));
                                uv = uv * 2.0 - 1.0;

                                const float size = 0.1;
                                float shape = 1.0 - aastep(size, abs(uv.x)) * aastep(size, abs(uv.y));
                                if (shape < 0.001) discard;

                                vec3 col = mix(vec3(0.0), uColor, smoothstep(0.75, 1.5, length(wPos)));
                                gl_FragColor = vec4(col, 1.0);
                            }
                        `,
            depthWrite: !1,
            depthTest: !0,
            transparent: !1,
            blending: pt
        });
        this.mesh = new Fn(e, t),
        this.mesh.frustumCulled = !1,
        this.mesh.name = "plexus points",
        this.mesh.renderOrder = 20,
        this.parent.group.add(this.mesh),
        this.hoverTimeline = re.timeline({
            paused: !0
        }),
        this.hoverTimeline.fromTo(t.uniforms.uHover, {
            value: 1
        }, {
            value: 0,
            duration: .35
        }),
        this.isReady()
    }
    update()
    {
        let e = 0;
        for (let t = 0; t < this.mesh.geometry.attributes.position.count; t++) {
            const s = this.parent.currentPoints[t];
            Mp.set(0, 0, 0);
            let n = 0;
            s && (Mp.copy(s.position), n = s._displayVar),
            this.mesh.geometry.attributes.position.set(Mp.toArray(), t * 3),
            this.mesh.geometry.attributes.progress.array[t] = n,
            e = Math.max(e, n)
        }
        e > 0 ? (this.mesh.visible = !0, ["position", "progress"].forEach(t => {
            this.mesh.geometry.attributes[t].needsUpdate = !0
        })) : this.mesh.visible = !1
    }
    click()
    {
        this.hoverTimeline.play(0)
    }
    resetClick()
    {
        this.hoverTimeline.pause().progress(0)
    }
}
var _a = `#define sinlayer(frX, frY, frZ) val += sin(dot(p, vec3(frX, frY, frZ)));
float sinenoise1(vec3 p){float val=0.0;sinlayer(1.5,3.4598,1.234);sinlayer(3.12,-3.234,4.221);sinlayer(0.355,2.3,-1.375);sinlayer(-0.156,-3.34,-0.4566);sinlayer(-4.1235,-0.485,-1.45);sinlayer(2.54,-0.879,-2.123);return val/6.0;}`;
const Sl = new b,
    Ml = new b;
class $L {
    constructor(e)
    {
        this.parent = e,
        this.scene = this.parent.scene,
        this.maxLines = this.parent.maxPlexusPoints * this.parent.maxConnectionsPerPoint,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.init()
    }
    init()
    {
        const e = new ot;
        e.setAttribute("position", new nt(new Float32Array(this.maxLines * 2 * 3), 3));
        const t = new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                uColor: {
                    value: new Z("#7f7f7f")
                },
                uHoverAnimation: {
                    value: !1
                },
                uHoverMix: {
                    value: 0
                }
            },
            vertexShader: `
                            varying vec3 wPos;

                            void main() {
                                vec3 pos = position;
                                wPos = pos;
                                vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                                gl_Position = projectionMatrix * viewMatrix * worldPos;
                            }
                        `,
            fragmentShader: `
                            uniform vec3 uColor;
                            uniform bool uHoverAnimation;
                            uniform float uHoverMix;

                            varying vec3 wPos;

                            ${ae}
                            ${Ue}
                            ${h_}
                            ${_a}

                            void main() {
                                vec3 col = mix(vec3(0.0), uColor, smoothstep(0.75, 1.5, length(wPos)));

                                float n1 = sinenoise1(wPos * 10.1 + vec3(0.0, 0.0, 0.0)) * 0.5 + 0.5;

                                if (uHoverAnimation) {
                                    // hovermix goes from -1 to 0
                                    col = mix(col, vec3(uHoverMix < 0.0 ? 0.0 : 0.3), abs(uHoverMix));
                                }

                                col = mix(vec3(0.0), col, smoothstep(0.4, 0.5, n1));

                                gl_FragColor = vec4(col, 1.0);
                            }
                        `,
            depthWrite: !1,
            depthTest: !0,
            blending: pt
        });
        this.mesh = new yr(e, t),
        this.mesh.frustumCulled = !1,
        this.mesh.name = "plexus lines",
        this.mesh.renderOrder = 20,
        this.parent.group.add(this.mesh),
        this.hoverTimeline = re.timeline({
            paused: !0
        }),
        this.hoverTimeline.fromTo(t.uniforms.uHoverMix, {
            value: 0
        }, {
            value: 1,
            duration: .075,
            ease: "none"
        }),
        this.hoverTimeline.fromTo(t.uniforms.uHoverMix, {
            value: -1
        }, {
            value: 1,
            duration: .075,
            ease: "none"
        }),
        this.hoverTimeline.fromTo(t.uniforms.uHoverMix, {
            value: -1
        }, {
            value: 1,
            duration: .075,
            ease: "none"
        }),
        this.hoverTimeline.fromTo(t.uniforms.uHoverMix, {
            value: 1
        }, {
            value: -1,
            duration: .25,
            ease: "power2.out"
        }),
        this.isReady()
    }
    update()
    {
        let e = 0;
        for (let t = 0; t < this.maxLines; t++) {
            Sl.set(0, 0, 0),
            Ml.set(0, 0, 0);
            const s = this.parent.connections[t];
            s && (Sl.copy(s.pt1.position), Ml.lerpVectors(s.pt1.position, s.pt2.position, s.progress), e = Math.max(e, s.progress)),
            this.mesh.geometry.attributes.position.setXYZ(t * 2, Sl.x, Sl.y, Sl.z),
            this.mesh.geometry.attributes.position.setXYZ(t * 2 + 1, Ml.x, Ml.y, Ml.z)
        }
        e > 0 ? (this.mesh.visible = !0, this.mesh.geometry.attributes.position.needsUpdate = !0) : this.mesh.visible = !1
    }
    click()
    {
        this.mesh.material.uniforms.uHoverAnimation.value = !0,
        this.hoverTimeline.play(0)
    }
    resetClick()
    {
        this.mesh.material.uniforms.uHoverAnimation.value = !1
    }
}
const eF = i => i - Math.floor(i),
    tF = (i, e) => eF((i + e) / (2 * e)) * 2 * e - e;
function iF(i) {
    for (let e = i.length - 1; e > 0; e--) {
        const t = Math.floor(Math.random() * (e + 1));
        [i[e], i[t]] = [i[t], i[e]]
    }
}
class sF {
    constructor(e)
    {
        this.parent = e,
        this.scene = this.parent.scene,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.group = new Gi,
        this.group.name = "plexus",
        this.group.position.y = this.parent.position.y,
        this.scene.add(this.group),
        this.totalPlexusPoints = 18,
        this.maxPlexusPoints = this.totalPlexusPoints,
        this.maxConnectionsPerPoint = 3,
        this.radius = this.parent.mesh.geometry.boundingSphere.radius * .9,
        this.treadmillDist = 3,
        this.plexusPoints = [],
        this.currentPoints = [],
        this.connections = [],
        this.connectTime = .35,
        this.init()
    }
    async init()
    {
        for (let e = 0; e < this.totalPlexusPoints; e++) {
            const t = new It,
                s = Math.random() * ie.TWO_PI,
                n = ie.fit(Math.random(), 0, 1, .8, 1) * this.radius;
            t.position.set(Math.cos(s) * n, Math.random() * this.treadmillDist, Math.sin(s) * n),
            t.originalAngle = s,
            t.originalRadius = n,
            t.originalPosition = t.position.clone(),
            t._hasTreadmilled = !1,
            t._pieceIndex = e,
            t.__rand = Math.random(),
            t._displayVar = 0,
            t._shown = !1,
            t._canConnect = !1,
            t._connections = new Set,
            this.plexusPoints.push(t)
        }
        this.pointMesh = new ZL(this),
        this.linesMesh = new $L(this),
        await Promise.all([this.pointMesh.ready, this.linesMesh.ready]),
        this.isReady()
    }
    update(e, t, s)
    {
        const n = Math.abs(s) < 1.25,
            r = this.treadmillDist * .5,
            a = this.treadmillDist * .5 * .75;
        this.plexusPoints.forEach(o => {
            const l = o.originalAngle + (o.__rand - .5) * .5 * Fe.time,
                c = o.position.y;
            o.position.set(Math.cos(l) * o.originalRadius + .1 * Math.sin(Fe.time * .5 + o.__rand * 2.324), tF(o.originalPosition.y + o.__rand * Fe.time * .25, r), Math.sin(l) * o.originalRadius + .1 * Math.sin(Fe.time * .5 + o.__rand * 9.564));
            const h = Math.abs(c - o.position.y) > r;
            o._canConnect = n && Math.abs(o.position.y) < a && !h
        }),
        this.plexusPoints.forEach((o, l) => {
            !o._canConnect && o._connections.size > 0 && this.connections.filter(h => (h.pt1 === o || h.pt2 === o) && !h.removing).forEach(h => {
                h.removing = !0,
                re.to(h, {
                    progress: 0,
                    overwrite: !0,
                    ease: "none",
                    duration: this.connectTime,
                    onComplete: () => {
                        this.connections.splice(this.connections.indexOf(h), 1),
                        h.pt1._connections.delete(h.pt2),
                        h.pt2._connections.delete(h.pt1)
                    }
                })
            })
        }),
        this.currentPoints.forEach(o => {
            if (this.connections.filter(l => (l.pt1 === o || l.pt2 === o) && !l.removing).length > 0) {
                if (o._shown)
                    return;
                o._shown = !0,
                re.to(o, {
                    _displayVar: 1,
                    overwrite: !0,
                    ease: "none",
                    duration: this.connectTime
                })
            } else {
                if (!o._shown)
                    return;
                o._shown = !1,
                re.to(o, {
                    _displayVar: 0,
                    ease: "none",
                    duration: this.connectTime,
                    overwrite: !0,
                    onComplete: () => {
                        this.connections.filter(l => (l.pt1 === o || l.pt2 === o) && !l.removing).length === 0 && this.currentPoints.splice(this.currentPoints.indexOf(o), 1)
                    }
                })
            }
        });
        for (let o = 0; o < this.plexusPoints.length; o++) {
            const l = this.plexusPoints[o];
            if (!l._canConnect || l._connections.size === this.maxConnectionsPerPoint)
                continue;
            const c = [];
            for (let h = 0; h < this.plexusPoints.length; h++) {
                const d = this.plexusPoints[h];
                if (d === l || !d._canConnect || d._connections.size === this.maxConnectionsPerPoint || l._connections.has(d))
                    continue;
                const u = l.position.distanceTo(d.position);
                u < this.treadmillDist && c.push({
                    distance: u,
                    pt: d
                })
            }
            for (iF(c); c.length > 0 && l._connections.size < this.maxConnectionsPerPoint;) {
                const h = c.shift(),
                    d = !this.currentPoints.includes(l),
                    u = !this.currentPoints.includes(h.pt),
                    f = (d ? 1 : 0) + (u ? 1 : 0);
                if (this.currentPoints.length + f > this.maxPlexusPoints)
                    continue;
                d && this.currentPoints.push(l),
                u && this.currentPoints.push(h.pt);
                const p = {
                    pt1: l,
                    pt2: h.pt,
                    progress: 0,
                    removing: !1
                };
                re.to(p, {
                    progress: 1,
                    ease: "none",
                    duration: this.connectTime
                }),
                this.connections.push(p),
                l._connections.add(h.pt),
                h.pt._connections.add(l)
            }
            if (this.currentPoints.length === this.maxPlexusPoints)
                break
        }
        this.pointMesh.update(),
        this.linesMesh.update(),
        this.group.rotation.copy(this.parent.rotation)
    }
    click()
    {
        this.linesMesh.click(),
        this.pointMesh.click()
    }
    resetClick()
    {
        this.linesMesh.resetClick(),
        this.pointMesh.resetClick()
    }
}
class bE extends Ce {}
bE.prototype.raycast = VL;
class nF extends Gi {
    constructor(e, t)
    {
        super(),
        this.scene = e,
        this.options = {
            index: 0,
            obj: "cube3",
            innerobject: "pudgy",
            centeredProgress: 0,
            scrollPosition: 0,
            rand: Math.random(),
            ...t
        },
        this.name = `group${this.options.index} `,
        this.position.y = this.options.scrollPosition,
        this.additionalRotationAmount = {
            value: 1
        },
        this.ready = new Promise(s => {
            this.isReady = s
        }),
        this.init()
    }
    async init()
    {
        const e = await zt.load(`cubes/${this.options.obj}.drc`);
        const t = this.options.innerobject ? await zt.load(`${this.options.innerobject}.drc`) : null;
        this.mesh = new bE(e, new WL(3)),
        this.mesh.name = `cube${this.options.index} `,
        this.mesh.renderOrder = 3,
        this.mesh.geometry.computeBoundingBox(),
        this.mesh.geometry.computeBoundingSphere(),
        this.mesh.geometry.boundsTree = new bg(this.mesh.geometry),
        this.add(this.mesh),
        [this.mesh].forEach(s => {
            s.material.color.setStyle("#e0e8ef"),
            s.material.roughnessMap = le.load(`cubes/${this.options.obj}_roughness.ktx2`),
            s.material.roughness = .65,
            s.material.envMap = this.scene.envmap,
            s.material.envMapIntensity = .91,
            s.material.envMapRotation.y = Math.PI,
            s.material.normalMap = le.load(`cubes/${this.options.obj}_normal.ktx2`),
            s.material.normalScale.set(1, 1),
            s.material.ior = 1.18,
            s.material.reflectivity = .3,
            s.material.transmission = 0
        }),
        this.mouseFrost = new jL(this, {}),
        this.options.innerobject && (this.mesh3 = new Ce(t, new or({
            map: le.load(`cubes/${this.options.innerobject}_color.ktx2`)
        })), this.mesh3.name = `${this.options.innerobject + this.options.index} `, this.mesh3.renderOrder = 10, this.add(this.mesh3)),
        this.mesh.onBeforeRender = () => {
            this.mesh.material.side === es && (this.mouseFrost.update(), this.mesh.material.uniforms.tMouseFrost.value = this.mouseFrost.finalRT.texture)
        },
        this.mesh2 = new Ce(new kt(2.5, 3.5), new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                tTexture1: {
                    value: le.load("wind_noise.ktx2", "srgb-repeat")
                },
                uColor1: {
                    value: new Z("#886a3d")
                },
                uProgress: {
                    value: 100
                }
            },
            vertexShader: `
                            ${Nt}

                            uniform sampler2D tTexture1;
                            varying vec2 vUv;

                            void main() {
                                vUv = uv;
                                vec3 pos = position;
                                gl_Position = projectionMatrix * viewMatrix * (billboardModelMatrix() * vec4(position, 1.0));
                            }
                        `,
            fragmentShader: `
                            layout(location = 1) out highp vec4 gInfo;

                            ${ae}

                            varying vec2 vUv;

                            uniform sampler2D tTexture1;
                            uniform float uProgress;

                            void main() {
                                vec2 uv = vUv;
                                vec2 st = uv;
                                st.y *= 0.75;
                                st *= 1.5;
                                float t = time * 0.075;
                                vec2 offset = vec2(0.0, t);
                                float noise = texture2D(tTexture1, st + offset).r;
                                noise *= texture2D(tTexture1, st * 0.5 + offset).r;
                                float grad = 1.0 - clamp(length(vUv - 0.5) * 2.0, 0.0, 1.0);
                                noise *= grad;
                                noise *= length(vUv - 0.5);
                                noise = noise * 6.5;

                                // fade by scroll distance
                                float scrollDist = clamp(1.0 - abs(uProgress) * 20.0, 0.0, 1.0);
                                noise *= scrollDist;

                                vec3 color = vec3(1.0);
                                float alpha = noise;
                                gl_FragColor = vec4(color, alpha);
                            }
                        `,
            transparent: !0,
            depthTest: !1,
            depthWrite: !1
        })),
        this.mesh2.name = `smoke${this.options.index}`,
        this.mesh2.renderOrder = 15,
        this.mesh2.position.y = -.35,
        this.add(this.mesh2),
        this.plexus = new sF(this),
        this.texts = new KL(this),
        await Promise.all([this.texts.ready, this.plexus.ready]),
        this.scene.add(this),
        this.isReady()
    }
    update(e, t, s)
    {
        var w;
        this.mesh.material.uniforms.uBlueOffset.value.set(Math.random(), Math.random()),
        this.mesh.material.uniforms.uResolution.value.copy(he.uniforms.resolution.value);
        const n = this.options.centeredProgress - e,
            r = this.options.scrollPosition - t,
            a = n,
            o = (s + this.scene.cubes[0].options.rand) * 242.45353 % 1 < .5 ? -1 : 1,
            l = o,
            c = -o,
            h = o,
            d = ie.fit(this.options.rand * 12.3423 % 1, 0, 1, .1, .2),
            u = ie.fit(this.options.rand * 123.5343 % 1, 0, 1, .1, .3),
            f = ie.fit(this.options.rand * 54.654 % 1, 0, 1, .1, .25),
            p = 11 * l * (1 - d),
            A = 14 * c * (1 - u),
            m = 6 * h * (1 - f),
            g = .3,
            x = .1 * this.additionalRotationAmount.value,
            v = Math.sin(Fe.time * g + this.options.rand * 12.423) * x * Math.sign(this.options.rand - .5),
            y = Math.sin(Fe.time * g + this.options.rand * 42.987) * x * Math.sign(this.options.rand - .5),
            S = Math.sin(Fe.time * g + this.options.rand * 2.53) * x * Math.sign(this.options.rand - .5);
        this.rotation.y = p * a + v,
        this.rotation.x = A * a + y,
        this.rotation.z = m * a + S,
        this.mesh2.material.uniforms.uProgress.value = a,
        this.texts.update(s, n, r),
        this.plexus.update(s, n, r),
        (w = this.scene.controller) != null && w.isDetailOpen ? this.mouseFrost.interaction.disable() : Math.abs(r) < 2 ? this.mouseFrost.interaction.enable() : this.mouseFrost.interaction.disable()
    }
}
class rF {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.init()
    }
    async init()
    {
        const e = await zt.load("cubes/background_shapes.drc"),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tMap: {
                        value: le.load("shapes_blurred.ktx2", "srgb")
                    },
                    uProgress: {
                        value: .5
                    },
                    uAlpha: {
                        value: 1
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                attribute vec3 color;
                                attribute vec3 centr;
                                attribute float primrand;

                                varying vec2 vUv;
                                varying vec3 vPos;

                                uniform sampler2D tNoise;
                                uniform float uProgress;

                                mat4 rotation3D(vec3 axis, float angle) {
                                    axis = normalize(axis);
                                    float s = sin(angle);
                                    float c = cos(angle);
                                    float oc = 1.0 - c;

                                    return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                                                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s,  0.0,
                                                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,  0.0,
                                                0.0, 0.0, 0.0, 1.0);
                                }

                                void main() {
                                    vUv = uv;
                                    vPos = position;

                                    // construct a static viewMatrix, to ignore camera position
                                    mat4 viewMatrixCopy = viewMatrix;
                                    viewMatrixCopy[0] = vec4(1.0, 0.0, 0.0, 0.0);
                                    viewMatrixCopy[1] = vec4(0.0, 1.0, 0.0, 0.0);
                                    viewMatrixCopy[2] = vec4(0.0, 0.0, 1.0, 0.0);
                                    viewMatrixCopy[3] = vec4(0.0, 0.0, -5.0, 1.0);

                                    // rotate with scroll
                                    vec3 customPos = position;
                                    customPos -= centr;
                                    customPos = (rotation3D(vec3(0.0, 0.0, 1.0), uProgress * 5.0 * mix(0.1, 0.5, primrand) + time * 0.2 * primrand) * vec4(customPos, 1.0)).xyz;
                                    // responsive x offset
                                    vec3 offset = centr * vec3(clamp(aspect * 0.5, 0.65, 1.0), 1.0, 1.0);
                                    offset.y -= 5.0;
                                    customPos += offset;

                                    // translate with scroll
                                    customPos.y += uProgress * 10.0;

                                    gl_Position = projectionMatrix * viewMatrixCopy * modelMatrix * vec4(customPos, 1.0);

                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}

                                varying vec2 vUv;
                                varying vec3 vPos;

                                uniform sampler2D tMap;

                                uniform float uProgress;
                                uniform float uAlpha;

                                void main() {
                                    vec3 color = vec3(1.0);
                                    float alpha = texture2D(tMap, vUv).r;

                                    // idle animation
                                    float idleAnimation = sin((vPos.x + vPos.y) * 5.0 + time * 3.0) * 0.5 + 0.5;
                                    idleAnimation *= cos(vPos.y * 10.0 + alpha * 3.0 + time * 2.0) * 0.5 + 0.5;
                                    idleAnimation *= sin(vPos.y * 2.0 + time * 2.0) * 0.5 + 0.5;
                                    alpha = idleAnimation * 0.9 * alpha + 0.1 * alpha;
                                    alpha *= 0.65;

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0,
                blending: pt
            });
        this.mesh = new Ce(e, t),
        this.mesh.name = "background_shapes",
        this.mesh.renderOrder = 9,
        this.mesh.frustumCulled = !1,
        this.mesh.matrixAutoUpdate = !1,
        this.mesh.receiveShadow = !1,
        this.scene.add(this.mesh),
        this.isReady()
    }
    update(e)
    {
        this.mesh.material.uniforms.uProgress.value = e
    }
}
const bp = new b;
class aF extends Jo {
    constructor(e={})
    {
        super({
            orbit: !1
        }),
        this.options = {
            cubes: Be.cubes,
            verticalOffset: -5.75
        },
        q.devScene && (this.options.cubes = this.options.cubes.slice(0, 1), this.options.verticalOffset = 0),
        this.controller = e.mainController,
        this.progress = 0,
        this.height = this.options.cubes.length,
        this._isSceneVisible = !1,
        this._bgTex = le.load("cubes/bg.png", "srgb"),
        this._transmissionRT = new vt(2, 2, {
            generateMipmaps: !0,
            type: Mi,
            minFilter: Qs,
            samples: 0
        }),
        this.cubes = [],
        this._UP = new b,
        this._LEFT = new b,
        this.cameraZoom = {
            value: 0
        },
        this._shardVolume = 0,
        this.init()
    }
    get isSceneVisible()
    {
        return this._isSceneVisible
    }
    set isSceneVisible(e)
    {
        const t = this._isSceneVisible !== e;
        this._isSceneVisible = e,
        t && (e ? this.cubes.forEach(s => {
            s.options.rand = Math.random()
        }) : (this._shardVolume = 0, Q.emit("webgl_set_audio_volume", "shard", this._shardVolume)))
    }
    async init()
    {
        this.cameraOptions(),
        this.renderOptions(),
        await Promise.all([this.createEnvironmentMap(), this.createBg(), this.createBlurryText(), this.createBackgroundShapes()]),
        this.textsGroup = new Gi,
        this.textsGroup.name = "texts",
        this.add(this.textsGroup),
        await Promise.all(this.options.cubes.map((e, t) => this.createCube(e, t))),
        this.resize(),
        Q.on("resize", this.resize, this),
        this.beforeRenderCbs.push(this.update.bind(this)),
        q.devScene && this.debug(),
        this.isReady()
    }
    cameraOptions()
    {
        this.camera.basePosition.set(0, 0, 5),
        this.camera.baseTarget.set(0, 0, 0),
        this.camera.displacement.position.set(.1, .05),
        this.camera.shake.setScalar(.02),
        this.camera.shakeSpeed.setScalar(.1),
        this.camera.initialPosition = this.camera.basePosition.clone(),
        this.camera.initialTarget = this.camera.baseTarget.clone()
    }
    renderOptions()
    {
        Promise.resolve().then(() => {
            O3(this, this.composer);
            const e = q.devScene ? this.composer : he.composer;
            e.__hasBloomPass || (e.__hasBloomPass = !0, e.addPass(new Fd().addBloom({
                debug: q.devScene,
                levels: 6,
                luminanceThreshold: .2,
                intensity: 1,
                radius: .85
            })))
        })
    }
    async createBg()
    {
        this.bg = new k3(this),
        await this.bg.ready
    }
    async createBackgroundShapes()
    {
        this.backgroundshapes = new rF(this),
        await this.backgroundshapes.ready
    }
    async createBlurryText()
    {
        this.blurrytext = new z3(this),
        await this.blurrytext.ready
    }
    createCube(e={}, t)
    {
        const s = this.options.verticalOffset * (this.options.cubes.length + 1),
            n = q.devScene ? 0 : (1 + t) * this.options.verticalOffset,
            r = q.devScene ? 0 : n / s,
            a = new nF(this, {
                index: t,
                scrollPosition: n,
                centeredProgress: r,
                ...e
            });
        return this.cubes.push(a), a.ready
    }
    async createEnvironmentMap()
    {
        const e = le.load("cubes_env.exr"),
            t = new kp(he.renderer.webgl);
        await e._loaded,
        this.envmap = t.fromEquirectangular(e).texture,
        t.dispose()
    }
    async playInAnimation() {}
    update()
    {
        const e = (this.options.cubes.length + 1) * this.options.verticalOffset * this.progress;
        this.camera.basePosition.y = this.camera.initialPosition.y + e,
        this.camera.baseTarget.y = this.camera.initialTarget.y + e,
        this.camera.basePosition.z = this.camera.initialPosition.z + this.cameraZoom.value,
        bp.subVectors(this.camera.position, this.camera.target).normalize(),
        this._LEFT.crossVectors(this.camera.up, bp),
        this._UP.crossVectors(bp, this._LEFT),
        this.cubes.forEach((r, a) => r.update(this.progress, this.camera.basePosition.y, a)),
        this.bg.update(this.progress),
        this.blurrytext.update(this.progress),
        this.backgroundshapes.update(this.progress),
        this.cubes.forEach(r => {
            r.mesh.material.side = ei,
            r.mesh.material.needsUpdate = !0,
            r.mesh.material.uniforms.tTransmissionSamplerMap.value = this._bgTex,
            r.mesh.material.uniforms.uTransmissionSamplerSize.value.set(4, 4),
            r.mesh3 && (r.mesh3.visible = !0),
            r.mesh2.visible = !1,
            r.plexus.group.visible = !1
        }),
        this.textsGroup.visible = !1,
        this.blurrytext.mesh.visible = !1,
        this.backgroundshapes.mesh.visible = !1;
        const t = he.renderer.webgl.getRenderTarget();
        he.renderer.webgl.setRenderTarget(this._transmissionRT),
        he.renderer.webgl.clear(!0, !0, !0),
        he.renderer.webgl.render(this, this.camera),
        he.renderer.webgl.setRenderTarget(t),
        this.cubes.forEach(r => {
            r.mesh.material.side = es,
            r.mesh.material.needsUpdate = !0,
            r.mesh.material.uniforms.tTransmissionSamplerMap.value = this._transmissionRT.texture,
            r.mesh.material.uniforms.uTransmissionSamplerSize.value.set(this._transmissionRT.width, this._transmissionRT.height),
            r.mesh3 && (r.mesh3.visible = !1),
            r.mesh2.visible = !0,
            r.plexus.group.visible = !0
        }),
        this.textsGroup.visible = !0,
        this.blurrytext.mesh.visible = !0,
        this.backgroundshapes.mesh.visible = !0,
        this.controller && (this.camera.fov = 45 - 5 * Math.abs(this.controller.scroll.velocity), this.camera.updateProjectionMatrix());
        let s = 1 / 0,
            n = 0;
        if (this.cubes.forEach((r, a) => {
            const o = r.options.centeredProgress - this.progress,
                l = Math.abs(o);
            l < s && (s = l, n = a)
        }), this.cubes[n].mouseFrost) {
            const r = this.cubes[n].mouseFrost.soundVelocity > this._shardVolume ? .2 : .05;
            this._shardVolume = ie.lerpFPS(this._shardVolume, this.cubes[n].mouseFrost.soundVelocity, r)
        }
        Q.emit("webgl_set_audio_volume", "shard", this._shardVolume * .5)
    }
    autoCenter(e, t)
    {
        let s = 1 / 0,
            n = 1 / 0;
        this.cubes.forEach((o, l) => {
            const c = o.options.centeredProgress - this.progress,
                h = Math.abs(c);
            h < s && (s = h, n = c)
        });
        const r = n * (this.height + 1),
            a = ie.clamp(Math.abs(r) * 6, 1.6, 2.4);
        e.centerScroll(e.scroll.y + r, a)
    }
    detailAnimationIn(e=0)
    {
        re.to(this.cameraZoom, {
            overwrite: !0,
            value: -3.5,
            duration: 1.25 + e,
            ease: "power3.in"
        }),
        re.to(this.cubes.map(t => t.additionalRotationAmount), {
            overwrite: !0,
            value: 0,
            duration: 1 + e,
            ease: "power1.in"
        }),
        re.to(this.camera, {
            touchAmount: 0,
            overwrite: !0,
            duration: 1.25 + e
        }),
        this.cubes.forEach(t => t.plexus.click())
    }
    detailAnimationOut()
    {
        re.to(this.cameraZoom, {
            overwrite: !0,
            value: 0,
            duration: 1.45,
            ease: "power3.out",
            onComplete: () => {
                this._shardVolume = 0,
                Q.emit("webgl_set_audio_volume", "shard", this._shardVolume)
            }
        }),
        re.to(this.cubes.map(e => e.additionalRotationAmount), {
            overwrite: !0,
            value: 1,
            duration: 1.45,
            ease: "power2.out"
        }),
        re.to(this.camera, {
            touchAmount: 1,
            overwrite: !0,
            duration: 1.45
        }),
        this.cubes.forEach(e => e.plexus.resetClick())
    }
    resize()
    {
        this.camera.zoom = Math.min(1, q.screen.aspectRatio * 1.25),
        this.camera.updateProjectionMatrix(),
        this._transmissionRT.setSize(he.uniforms.resolution.value.x, he.uniforms.resolution.value.y)
    }
    dispose() {}
}
