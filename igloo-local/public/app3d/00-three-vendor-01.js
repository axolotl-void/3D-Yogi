import { S as CA, i as SA, s as MA, e as Tp, a as $r, n as qh, d as ea, b as Ip, c as DE, t as ir, f as ho, g as Ug, o as RE, h as ny, m as ry, j as ay, k as UE, l as Lg, p as LE, q as FE } from "./index-2eb69c09.js"; /**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */



const Aa = "165",
    NE = 0,
    Fg = 1,
    OE = 2,
    oy = 1,
    ly = 2,
    _n = 3,
    es = 0,
    ei = 1,
    xi = 2,
    qt = 0,
    _o = 1,
    pt = 2,
    Ng = 3,
    Og = 4,
    cy = 5,
    ar = 100,
    kE = 101,
    zE = 102,
    QE = 103,
    GE = 104,
    HE = 200,
    VE = 201,
    hy = 202,
    WE = 203,
    Ou = 204,
    Bp = 205,
    YE = 206,
    qE = 207,
    XE = 208,
    KE = 209,
    JE = 210,
    jE = 211,
    ZE = 212,
    $E = 213,
    eC = 214,
    uy = 0,
    dy = 1,
    Pp = 2,
    pc = 3,
    ku = 4,
    fy = 5,
    py = 6,
    bA = 7,
    my = 0,
    tC = 1,
    iC = 2,
    dr = 0,
    sC = 1,
    nC = 2,
    rC = 3,
    aC = 4,
    oC = 5,
    lC = 6,
    cC = 7,
    kg = "attached",
    hC = "detached",
    Ay = 300,
    la = 301,
    Po = 302,
    zu = 303,
    Qu = 304,
    _d = 306,
    Ar = 1e3,
    zs = 1001,
    Do = 1002,
    gt = 1003,
    gy = 1004,
    bl = 1005,
    _t = 1006,
    Xh = 1007,
    Qs = 1008,
    Ct = 1009,
    uC = 1010,
    dC = 1011,
    Gu = 1012,
    vy = 1013,
    ca = 1014,
    Lt = 1015,
    Mi = 1016,
    xy = 1017,
    yy = 1018,
    ha = 1020,
    fC = 35902,
    pC = 1021,
    mC = 1022,
    wt = 1023,
    AC = 1024,
    gC = 1025,
    wo = 1026,
    ua = 1027,
    ta = 1028,
    _y = 1029,
    uo = 1030,
    wy = 1031,
    Ey = 1033,
    Hd = 33776,
    Kh = 33777,
    Vd = 33778,
    Jh = 33779,
    Dp = 35840,
    zg = 35841,
    Rp = 35842,
    Qg = 35843,
    Up = 36196,
    Lp = 37492,
    Fp = 37496,
    Np = 37808,
    Gg = 37809,
    Hg = 37810,
    Vg = 37811,
    Hu = 37812,
    Wg = 37813,
    Yg = 37814,
    qg = 37815,
    Xg = 37816,
    Kg = 37817,
    Jg = 37818,
    jg = 37819,
    Zg = 37820,
    $g = 37821,
    jh = 36492,
    ev = 36494,
    tv = 36495,
    vC = 36283,
    iv = 36284,
    sv = 36285,
    nv = 36286,
    mc = 2300,
    Ro = 2301,
    Wd = 2302,
    rv = 2400,
    av = 2401,
    ov = 2402,
    xC = 2500,
    yC = 0,
    Cy = 1,
    Op = 2,
    ms = 3200,
    TA = 3201,
    IA = 0,
    _C = 1,
    _s = "",
    Ve = "srgb",
    oi = "srgb-linear",
    wd = "display-p3",
    Mc = "display-p3-linear",
    Vu = "linear",
    Ft = "srgb",
    Wu = "rec709",
    Yu = "p3",
    wa = 7680,
    lv = 519,
    wC = 512,
    EC = 513,
    CC = 514,
    Sy = 515,
    SC = 516,
    MC = 517,
    bC = 518,
    TC = 519,
    qu = 35044,
    cv = "300 es",
    Tn = 2e3,
    Xu = 2001;
class hn {
    addEventListener(e, t)
    {
        this._listeners === void 0 && (this._listeners = {});
        const s = this._listeners;
        s[e] === void 0 && (s[e] = []),
        s[e].indexOf(t) === -1 && s[e].push(t)
    }
    hasEventListener(e, t)
    {
        if (this._listeners === void 0)
            return !1;
        const s = this._listeners;
        return s[e] !== void 0 && s[e].indexOf(t) !== -1
    }
    removeEventListener(e, t)
    {
        if (this._listeners === void 0)
            return;
        const n = this._listeners[e];
        if (n !== void 0) {
            const r = n.indexOf(t);
            r !== -1 && n.splice(r, 1)
        }
    }
    dispatchEvent(e)
    {
        if (this._listeners === void 0)
            return;
        const s = this._listeners[e.type];
        if (s !== void 0) {
            e.target = this;
            const n = s.slice(0);
            for (let r = 0, a = n.length; r < a; r++)
                n[r].call(this, e);
            e.target = null
        }
    }
}
const Ti = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
let hv = 1234567;
const Ql = Math.PI / 180,
    Uo = 180 / Math.PI;
function Hs() {
    const i = Math.random() * 4294967295 | 0,
        e = Math.random() * 4294967295 | 0,
        t = Math.random() * 4294967295 | 0,
        s = Math.random() * 4294967295 | 0;
    return (Ti[i & 255] + Ti[i >> 8 & 255] + Ti[i >> 16 & 255] + Ti[i >> 24 & 255] + "-" + Ti[e & 255] + Ti[e >> 8 & 255] + "-" + Ti[e >> 16 & 15 | 64] + Ti[e >> 24 & 255] + "-" + Ti[t & 63 | 128] + Ti[t >> 8 & 255] + "-" + Ti[t >> 16 & 255] + Ti[t >> 24 & 255] + Ti[s & 255] + Ti[s >> 8 & 255] + Ti[s >> 16 & 255] + Ti[s >> 24 & 255]).toLowerCase()
}
function hi(i, e, t) {
    return Math.max(e, Math.min(t, i))
}
function BA(i, e) {
    return (i % e + e) % e
}
function IC(i, e, t, s, n) {
    return s + (i - e) * (n - s) / (t - e)
}
function BC(i, e, t) {
    return i !== e ? (t - i) / (e - i) : 0
}
function Gl(i, e, t) {
    return (1 - t) * i + t * e
}
function PC(i, e, t, s) {
    return Gl(i, e, 1 - Math.exp(-t * s))
}
function DC(i, e=1) {
    return e - Math.abs(BA(i, e * 2) - e)
}
function RC(i, e, t) {
    return i <= e ? 0 : i >= t ? 1 : (i = (i - e) / (t - e), i * i * (3 - 2 * i))
}
function UC(i, e, t) {
    return i <= e ? 0 : i >= t ? 1 : (i = (i - e) / (t - e), i * i * i * (i * (i * 6 - 15) + 10))
}
function LC(i, e) {
    return i + Math.floor(Math.random() * (e - i + 1))
}
function FC(i, e) {
    return i + Math.random() * (e - i)
}
function NC(i) {
    return i * (.5 - Math.random())
}
function OC(i) {
    i !== void 0 && (hv = i);
    let e = hv += 1831565813;
    return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296
}
function kC(i) {
    return i * Ql
}
function zC(i) {
    return i * Uo
}
function QC(i) {
    return (i & i - 1) === 0 && i !== 0
}
function GC(i) {
    return Math.pow(2, Math.ceil(Math.log(i) / Math.LN2))
}
function HC(i) {
    return Math.pow(2, Math.floor(Math.log(i) / Math.LN2))
}
function VC(i, e, t, s, n) {
    const r = Math.cos,
        a = Math.sin,
        o = r(t / 2),
        l = a(t / 2),
        c = r((e + s) / 2),
        h = a((e + s) / 2),
        d = r((e - s) / 2),
        u = a((e - s) / 2),
        f = r((s - e) / 2),
        p = a((s - e) / 2);
    switch (n) {
    case "XYX":
        i.set(o * h, l * d, l * u, o * c);
        break;
    case "YZY":
        i.set(l * u, o * h, l * d, o * c);
        break;
    case "ZXZ":
        i.set(l * d, l * u, o * h, o * c);
        break;
    case "XZX":
        i.set(o * h, l * p, l * f, o * c);
        break;
    case "YXY":
        i.set(l * f, o * h, l * p, o * c);
        break;
    case "ZYZ":
        i.set(l * p, l * f, o * h, o * c);
        break;
    default:
        console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + n)
    }
}
function ks(i, e) {
    switch (e.constructor) {
    case Float32Array:
        return i;
    case Uint32Array:
        return i / 4294967295;
    case Uint16Array:
        return i / 65535;
    case Uint8Array:
        return i / 255;
    case Int32Array:
        return Math.max(i / 2147483647, -1);
    case Int16Array:
        return Math.max(i / 32767, -1);
    case Int8Array:
        return Math.max(i / 127, -1);
    default:
        throw new Error("Invalid component type.")
    }
}
function bt(i, e) {
    switch (e.constructor) {
    case Float32Array:
        return i;
    case Uint32Array:
        return Math.round(i * 4294967295);
    case Uint16Array:
        return Math.round(i * 65535);
    case Uint8Array:
        return Math.round(i * 255);
    case Int32Array:
        return Math.round(i * 2147483647);
    case Int16Array:
        return Math.round(i * 32767);
    case Int8Array:
        return Math.round(i * 127);
    default:
        throw new Error("Invalid component type.")
    }
}
const WC = {
    DEG2RAD: Ql,
    RAD2DEG: Uo,
    generateUUID: Hs,
    clamp: hi,
    euclideanModulo: BA,
    mapLinear: IC,
    inverseLerp: BC,
    lerp: Gl,
    damp: PC,
    pingpong: DC,
    smoothstep: RC,
    smootherstep: UC,
    randInt: LC,
    randFloat: FC,
    randFloatSpread: NC,
    seededRandom: OC,
    degToRad: kC,
    radToDeg: zC,
    isPowerOfTwo: QC,
    ceilPowerOfTwo: GC,
    floorPowerOfTwo: HC,
    setQuaternionFromProperEuler: VC,
    normalize: bt,
    denormalize: ks
};
class H {
    constructor(e=0, t=0)
    {
        H.prototype.isVector2 = !0,
        this.x = e,
        this.y = t
    }
    get width()
    {
        return this.x
    }
    set width(e)
    {
        this.x = e
    }
    get height()
    {
        return this.y
    }
    set height(e)
    {
        this.y = e
    }
    set(e, t)
    {
        return this.x = e, this.y = t, this
    }
    setScalar(e)
    {
        return this.x = e, this.y = e, this
    }
    setX(e)
    {
        return this.x = e, this
    }
    setY(e)
    {
        return this.y = e, this
    }
    setComponent(e, t)
    {
        switch (e) {
        case 0:
            this.x = t;
            break;
        case 1:
            this.y = t;
            break;
        default:
            throw new Error("index is out of range: " + e)
        }
        return this
    }
    getComponent(e)
    {
        switch (e) {
        case 0:
            return this.x;
        case 1:
            return this.y;
        default:
            throw new Error("index is out of range: " + e)
        }
    }
    clone()
    {
        return new this.constructor(this.x, this.y)
    }
    copy(e)
    {
        return this.x = e.x, this.y = e.y, this
    }
    add(e)
    {
        return this.x += e.x, this.y += e.y, this
    }
    addScalar(e)
    {
        return this.x += e, this.y += e, this
    }
    addVectors(e, t)
    {
        return this.x = e.x + t.x, this.y = e.y + t.y, this
    }
    addScaledVector(e, t)
    {
        return this.x += e.x * t, this.y += e.y * t, this
    }
    sub(e)
    {
        return this.x -= e.x, this.y -= e.y, this
    }
    subScalar(e)
    {
        return this.x -= e, this.y -= e, this
    }
    subVectors(e, t)
    {
        return this.x = e.x - t.x, this.y = e.y - t.y, this
    }
    multiply(e)
    {
        return this.x *= e.x, this.y *= e.y, this
    }
    multiplyScalar(e)
    {
        return this.x *= e, this.y *= e, this
    }
    divide(e)
    {
        return this.x /= e.x, this.y /= e.y, this
    }
    divideScalar(e)
    {
        return this.multiplyScalar(1 / e)
    }
    applyMatrix3(e)
    {
        const t = this.x,
            s = this.y,
            n = e.elements;
        return this.x = n[0] * t + n[3] * s + n[6], this.y = n[1] * t + n[4] * s + n[7], this
    }
    min(e)
    {
        return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this
    }
    max(e)
    {
        return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this
    }
    clamp(e, t)
    {
        return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this
    }
    clampScalar(e, t)
    {
        return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this
    }
    clampLength(e, t)
    {
        const s = this.length();
        return this.divideScalar(s || 1).multiplyScalar(Math.max(e, Math.min(t, s)))
    }
    floor()
    {
        return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this
    }
    ceil()
    {
        return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this
    }
    round()
    {
        return this.x = Math.round(this.x), this.y = Math.round(this.y), this
    }
    roundToZero()
    {
        return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this
    }
    negate()
    {
        return this.x = -this.x, this.y = -this.y, this
    }
    dot(e)
    {
        return this.x * e.x + this.y * e.y
    }
    cross(e)
    {
        return this.x * e.y - this.y * e.x
    }
    lengthSq()
    {
        return this.x * this.x + this.y * this.y
    }
    length()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    manhattanLength()
    {
        return Math.abs(this.x) + Math.abs(this.y)
    }
    normalize()
    {
        return this.divideScalar(this.length() || 1)
    }
    angle()
    {
        return Math.atan2(-this.y, -this.x) + Math.PI
    }
    angleTo(e)
    {
        const t = Math.sqrt(this.lengthSq() * e.lengthSq());
        if (t === 0)
            return Math.PI / 2;
        const s = this.dot(e) / t;
        return Math.acos(hi(s, -1, 1))
    }
    distanceTo(e)
    {
        return Math.sqrt(this.distanceToSquared(e))
    }
    distanceToSquared(e)
    {
        const t = this.x - e.x,
            s = this.y - e.y;
        return t * t + s * s
    }
    manhattanDistanceTo(e)
    {
        return Math.abs(this.x - e.x) + Math.abs(this.y - e.y)
    }
    setLength(e)
    {
        return this.normalize().multiplyScalar(e)
    }
    lerp(e, t)
    {
        return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this
    }
    lerpVectors(e, t, s)
    {
        return this.x = e.x + (t.x - e.x) * s, this.y = e.y + (t.y - e.y) * s, this
    }
    equals(e)
    {
        return e.x === this.x && e.y === this.y
    }
    fromArray(e, t=0)
    {
        return this.x = e[t], this.y = e[t + 1], this
    }
    toArray(e=[], t=0)
    {
        return e[t] = this.x, e[t + 1] = this.y, e
    }
    fromBufferAttribute(e, t)
    {
        return this.x = e.getX(t), this.y = e.getY(t), this
    }
    rotateAround(e, t)
    {
        const s = Math.cos(t),
            n = Math.sin(t),
            r = this.x - e.x,
            a = this.y - e.y;
        return this.x = r * s - a * n + e.x, this.y = r * n + a * s + e.y, this
    }
    random()
    {
        return this.x = Math.random(), this.y = Math.random(), this
    }
    *[Symbol.iterator]()
    {
        yield this.x,
        yield this.y
    }
}
class at {
    constructor(e, t, s, n, r, a, o, l, c)
    {
        at.prototype.isMatrix3 = !0,
        this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1],
        e !== void 0 && this.set(e, t, s, n, r, a, o, l, c)
    }
    set(e, t, s, n, r, a, o, l, c)
    {
        const h = this.elements;
        return h[0] = e, h[1] = n, h[2] = o, h[3] = t, h[4] = r, h[5] = l, h[6] = s, h[7] = a, h[8] = c, this
    }
    identity()
    {
        return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this
    }
    copy(e)
    {
        const t = this.elements,
            s = e.elements;
        return t[0] = s[0], t[1] = s[1], t[2] = s[2], t[3] = s[3], t[4] = s[4], t[5] = s[5], t[6] = s[6], t[7] = s[7], t[8] = s[8], this
    }
    extractBasis(e, t, s)
    {
        return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), s.setFromMatrix3Column(this, 2), this
    }
    setFromMatrix4(e)
    {
        const t = e.elements;
        return this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]), this
    }
    multiply(e)
    {
        return this.multiplyMatrices(this, e)
    }
    premultiply(e)
    {
        return this.multiplyMatrices(e, this)
    }
    multiplyMatrices(e, t)
    {
        const s = e.elements,
            n = t.elements,
            r = this.elements,
            a = s[0],
            o = s[3],
            l = s[6],
            c = s[1],
            h = s[4],
            d = s[7],
            u = s[2],
            f = s[5],
            p = s[8],
            A = n[0],
            m = n[3],
            g = n[6],
            x = n[1],
            v = n[4],
            y = n[7],
            S = n[2],
            w = n[5],
            C = n[8];
        return r[0] = a * A + o * x + l * S, r[3] = a * m + o * v + l * w, r[6] = a * g + o * y + l * C, r[1] = c * A + h * x + d * S, r[4] = c * m + h * v + d * w, r[7] = c * g + h * y + d * C, r[2] = u * A + f * x + p * S, r[5] = u * m + f * v + p * w, r[8] = u * g + f * y + p * C, this
    }
    multiplyScalar(e)
    {
        const t = this.elements;
        return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this
    }
    determinant()
    {
        const e = this.elements,
            t = e[0],
            s = e[1],
            n = e[2],
            r = e[3],
            a = e[4],
            o = e[5],
            l = e[6],
            c = e[7],
            h = e[8];
        return t * a * h - t * o * c - s * r * h + s * o * l + n * r * c - n * a * l
    }
    invert()
    {
        const e = this.elements,
            t = e[0],
            s = e[1],
            n = e[2],
            r = e[3],
            a = e[4],
            o = e[5],
            l = e[6],
            c = e[7],
            h = e[8],
            d = h * a - o * c,
            u = o * l - h * r,
            f = c * r - a * l,
            p = t * d + s * u + n * f;
        if (p === 0)
            return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        const A = 1 / p;
        return e[0] = d * A, e[1] = (n * c - h * s) * A, e[2] = (o * s - n * a) * A, e[3] = u * A, e[4] = (h * t - n * l) * A, e[5] = (n * r - o * t) * A, e[6] = f * A, e[7] = (s * l - c * t) * A, e[8] = (a * t - s * r) * A, this
    }
    transpose()
    {
        let e;
        const t = this.elements;
        return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this
    }
    getNormalMatrix(e)
    {
        return this.setFromMatrix4(e).invert().transpose()
    }
    transposeIntoArray(e)
    {
        const t = this.elements;
        return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this
    }
    setUvTransform(e, t, s, n, r, a, o)
    {
        const l = Math.cos(r),
            c = Math.sin(r);
        return this.set(s * l, s * c, -s * (l * a + c * o) + a + e, -n * c, n * l, -n * (-c * a + l * o) + o + t, 0, 0, 1), this
    }
    scale(e, t)
    {
        return this.premultiply(Yd.makeScale(e, t)), this
    }
    rotate(e)
    {
        return this.premultiply(Yd.makeRotation(-e)), this
    }
    translate(e, t)
    {
        return this.premultiply(Yd.makeTranslation(e, t)), this
    }
    makeTranslation(e, t)
    {
        return e.isVector2 ? this.set(1, 0, e.x, 0, 1, e.y, 0, 0, 1) : this.set(1, 0, e, 0, 1, t, 0, 0, 1), this
    }
    makeRotation(e)
    {
        const t = Math.cos(e),
            s = Math.sin(e);
        return this.set(t, -s, 0, s, t, 0, 0, 0, 1), this
    }
    makeScale(e, t)
    {
        return this.set(e, 0, 0, 0, t, 0, 0, 0, 1), this
    }
    equals(e)
    {
        const t = this.elements,
            s = e.elements;
        for (let n = 0; n < 9; n++)
            if (t[n] !== s[n])
                return !1;
        return !0
    }
    fromArray(e, t=0)
    {
        for (let s = 0; s < 9; s++)
            this.elements[s] = e[s + t];
        return this
    }
    toArray(e=[], t=0)
    {
        const s = this.elements;
        return e[t] = s[0], e[t + 1] = s[1], e[t + 2] = s[2], e[t + 3] = s[3], e[t + 4] = s[4], e[t + 5] = s[5], e[t + 6] = s[6], e[t + 7] = s[7], e[t + 8] = s[8], e
    }
    clone()
    {
        return new this.constructor().fromArray(this.elements)
    }
}
const Yd = new at;
function My(i) {
    for (let e = i.length - 1; e >= 0; --e)
        if (i[e] >= 65535)
            return !0;
    return !1
}
const YC = {
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array
};
function kc(i, e) {
    return new YC[i](e)
}
function Ac(i) {
    return document.createElementNS("http://www.w3.org/1999/xhtml", i)
}
function qC() {
    const i = Ac("canvas");
    return i.style.display = "block", i
}
const uv = {};
function PA(i) {
    i in uv || (uv[i] = !0, console.warn(i))
}
function XC(i, e, t) {
    return new Promise(function(s, n) {
        function r() {
            switch (i.clientWaitSync(e, i.SYNC_FLUSH_COMMANDS_BIT, 0)) {
            case i.WAIT_FAILED:
                n();
                break;
            case i.TIMEOUT_EXPIRED:
                setTimeout(r, t);
                break;
            default:
                s()
            }
        }
        setTimeout(r, t)
    })
}
const dv = new at().set(.8224621, .177538, 0, .0331941, .9668058, 0, .0170827, .0723974, .9105199),
    fv = new at().set(1.2249401, -.2249404, 0, -.0420569, 1.0420571, 0, -.0196376, -.0786361, 1.0982735),
    zc = {
        [oi]: {
            transfer: Vu,
            primaries: Wu,
            toReference: i => i,
            fromReference: i => i
        },
        [Ve]: {
            transfer: Ft,
            primaries: Wu,
            toReference: i => i.convertSRGBToLinear(),
            fromReference: i => i.convertLinearToSRGB()
        },
        [Mc]: {
            transfer: Vu,
            primaries: Yu,
            toReference: i => i.applyMatrix3(fv),
            fromReference: i => i.applyMatrix3(dv)
        },
        [wd]: {
            transfer: Ft,
            primaries: Yu,
            toReference: i => i.convertSRGBToLinear().applyMatrix3(fv),
            fromReference: i => i.applyMatrix3(dv).convertLinearToSRGB()
        }
    },
    KC = new Set([oi, Mc]),
    mt = {
        enabled: !0,
        _workingColorSpace: oi,
        get workingColorSpace() {
            return this._workingColorSpace
        },
        set workingColorSpace(i) {
            if (!KC.has(i))
                throw new Error(`Unsupported working color space, "${i}".`);
            this._workingColorSpace = i
        },
        convert: function(i, e, t) {
            if (this.enabled === !1 || e === t || !e || !t)
                return i;
            const s = zc[e].toReference,
                n = zc[t].fromReference;
            return n(s(i))
        },
        fromWorkingColorSpace: function(i, e) {
            return this.convert(i, this._workingColorSpace, e)
        },
        toWorkingColorSpace: function(i, e) {
            return this.convert(i, e, this._workingColorSpace)
        },
        getPrimaries: function(i) {
            return zc[i].primaries
        },
        getTransfer: function(i) {
            return i === _s ? Vu : zc[i].transfer
        }
    };
function Eo(i) {
    return i < .04045 ? i * .0773993808 : Math.pow(i * .9478672986 + .0521327014, 2.4)
}
function qd(i) {
    return i < .0031308 ? i * 12.92 : 1.055 * Math.pow(i, .41666) - .055
}
let Ea;
class JC {
    static getDataURL(e)
    {
        if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u")
            return e.src;
        let t;
        if (e instanceof HTMLCanvasElement)
            t = e;
        else {
            Ea === void 0 && (Ea = Ac("canvas")),
            Ea.width = e.width,
            Ea.height = e.height;
            const s = Ea.getContext("2d");
            e instanceof ImageData ? s.putImageData(e, 0, 0) : s.drawImage(e, 0, 0, e.width, e.height),
            t = Ea
        }
        return t.width > 2048 || t.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", e), t.toDataURL("image/jpeg", .6)) : t.toDataURL("image/png")
    }
    static sRGBToLinear(e)
    {
        if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
            const t = Ac("canvas");
            t.width = e.width,
            t.height = e.height;
            const s = t.getContext("2d");
            s.drawImage(e, 0, 0, e.width, e.height);
            const n = s.getImageData(0, 0, e.width, e.height),
                r = n.data;
            for (let a = 0; a < r.length; a++)
                r[a] = Eo(r[a] / 255) * 255;
            return s.putImageData(n, 0, 0), t
        } else if (e.data) {
            const t = e.data.slice(0);
            for (let s = 0; s < t.length; s++)
                t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[s] = Math.floor(Eo(t[s] / 255) * 255) : t[s] = Eo(t[s]);
            return {
                data: t,
                width: e.width,
                height: e.height
            }
        } else
            return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e
    }
}
let jC = 0;
class by {
    constructor(e=null)
    {
        this.isSource = !0,
        Object.defineProperty(this, "id", {
            value: jC++
        }),
        this.uuid = Hs(),
        this.data = e,
        this.dataReady = !0,
        this.version = 0
    }
    set needsUpdate(e)
    {
        e === !0 && this.version++
    }
    toJSON(e)
    {
        const t = e === void 0 || typeof e == "string";
        if (!t && e.images[this.uuid] !== void 0)
            return e.images[this.uuid];
        const s = {
                uuid: this.uuid,
                url: ""
            },
            n = this.data;
        if (n !== null) {
            let r;
            if (Array.isArray(n)) {
                r = [];
                for (let a = 0, o = n.length; a < o; a++)
                    n[a].isDataTexture ? r.push(Xd(n[a].image)) : r.push(Xd(n[a]))
            } else
                r = Xd(n);
            s.url = r
        }
        return t || (e.images[this.uuid] = s), s
    }
}
function Xd(i) {
    return typeof HTMLImageElement < "u" && i instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && i instanceof ImageBitmap ? JC.getDataURL(i) : i.data ? {
        data: Array.from(i.data),
        width: i.width,
        height: i.height,
        type: i.data.constructor.name
    } : (console.warn("THREE.Texture: Unable to serialize Texture."), {})
}
let ZC = 0;
class Rt extends hn {
    constructor(e=Rt.DEFAULT_IMAGE, t=Rt.DEFAULT_MAPPING, s=zs, n=zs, r=_t, a=Qs, o=wt, l=Ct, c=Rt.DEFAULT_ANISOTROPY, h=_s)
    {
        super(),
        this.isTexture = !0,
        Object.defineProperty(this, "id", {
            value: ZC++
        }),
        this.uuid = Hs(),
        this.name = "",
        this.source = new by(e),
        this.mipmaps = [],
        this.mapping = t,
        this.channel = 0,
        this.wrapS = s,
        this.wrapT = n,
        this.magFilter = r,
        this.minFilter = a,
        this.anisotropy = c,
        this.format = o,
        this.internalFormat = null,
        this.type = l,
        this.offset = new H(0, 0),
        this.repeat = new H(1, 1),
        this.center = new H(0, 0),
        this.rotation = 0,
        this.matrixAutoUpdate = !0,
        this.matrix = new at,
        this.generateMipmaps = !0,
        this.premultiplyAlpha = !1,
        this.flipY = !0,
        this.unpackAlignment = 4,
        this.colorSpace = h,
        this.userData = {},
        this.version = 0,
        this.onUpdate = null,
        this.isRenderTargetTexture = !1,
        this.pmremVersion = 0
    }
    get image()
    {
        return this.source.data
    }
    set image(e=null)
    {
        this.source.data = e
    }
    updateMatrix()
    {
        this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y)
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
    copy(e)
    {
        return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = !0, this
    }
    toJSON(e)
    {
        const t = e === void 0 || typeof e == "string";
        if (!t && e.textures[this.uuid] !== void 0)
            return e.textures[this.uuid];
        const s = {
            metadata: {
                version: 4.6,
                type: "Texture",
                generator: "Texture.toJSON"
            },
            uuid: this.uuid,
            name: this.name,
            image: this.source.toJSON(e).uuid,
            mapping: this.mapping,
            channel: this.channel,
            repeat: [this.repeat.x, this.repeat.y],
            offset: [this.offset.x, this.offset.y],
            center: [this.center.x, this.center.y],
            rotation: this.rotation,
            wrap: [this.wrapS, this.wrapT],
            format: this.format,
            internalFormat: this.internalFormat,
            type: this.type,
            colorSpace: this.colorSpace,
            minFilter: this.minFilter,
            magFilter: this.magFilter,
            anisotropy: this.anisotropy,
            flipY: this.flipY,
            generateMipmaps: this.generateMipmaps,
            premultiplyAlpha: this.premultiplyAlpha,
            unpackAlignment: this.unpackAlignment
        };
        return Object.keys(this.userData).length > 0 && (s.userData = this.userData), t || (e.textures[this.uuid] = s), s
    }
    dispose()
    {
        this.dispatchEvent({
            type: "dispose"
        })
    }
    transformUv(e)
    {
        if (this.mapping !== Ay)
            return e;
        if (e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1)
            switch (this.wrapS) {
            case Ar:
                e.x = e.x - Math.floor(e.x);
                break;
            case zs:
                e.x = e.x < 0 ? 0 : 1;
                break;
            case Do:
                Math.abs(Math.floor(e.x) % 2) === 1 ? e.x = Math.ceil(e.x) - e.x : e.x = e.x - Math.floor(e.x);
                break
            }
        if (e.y < 0 || e.y > 1)
            switch (this.wrapT) {
            case Ar:
                e.y = e.y - Math.floor(e.y);
                break;
            case zs:
                e.y = e.y < 0 ? 0 : 1;
                break;
            case Do:
                Math.abs(Math.floor(e.y) % 2) === 1 ? e.y = Math.ceil(e.y) - e.y : e.y = e.y - Math.floor(e.y);
                break
            }
        return this.flipY && (e.y = 1 - e.y), e
    }
    set needsUpdate(e)
    {
        e === !0 && (this.version++, this.source.needsUpdate = !0)
    }
    set needsPMREMUpdate(e)
    {
        e === !0 && this.pmremVersion++
    }
}
Rt.DEFAULT_IMAGE = null;
Rt.DEFAULT_MAPPING = Ay;
Rt.DEFAULT_ANISOTROPY = 1;
class yt {
    constructor(e=0, t=0, s=0, n=1)
    {
        yt.prototype.isVector4 = !0,
        this.x = e,
        this.y = t,
        this.z = s,
        this.w = n
    }
    get width()
    {
        return this.z
    }
    set width(e)
    {
        this.z = e
    }
    get height()
    {
        return this.w
    }
    set height(e)
    {
        this.w = e
    }
    set(e, t, s, n)
    {
        return this.x = e, this.y = t, this.z = s, this.w = n, this
    }
    setScalar(e)
    {
        return this.x = e, this.y = e, this.z = e, this.w = e, this
    }
    setX(e)
    {
        return this.x = e, this
    }
    setY(e)
    {
        return this.y = e, this
    }
    setZ(e)
    {
        return this.z = e, this
    }
    setW(e)
    {
        return this.w = e, this
    }
    setComponent(e, t)
    {
        switch (e) {
        case 0:
            this.x = t;
            break;
        case 1:
            this.y = t;
            break;
        case 2:
            this.z = t;
            break;
        case 3:
            this.w = t;
            break;
        default:
            throw new Error("index is out of range: " + e)
        }
        return this
    }
    getComponent(e)
    {
        switch (e) {
        case 0:
            return this.x;
        case 1:
            return this.y;
        case 2:
            return this.z;
        case 3:
            return this.w;
        default:
            throw new Error("index is out of range: " + e)
        }
    }
    clone()
    {
        return new this.constructor(this.x, this.y, this.z, this.w)
    }
    copy(e)
    {
        return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w !== void 0 ? e.w : 1, this
    }
    add(e)
    {
        return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this
    }
    addScalar(e)
    {
        return this.x += e, this.y += e, this.z += e, this.w += e, this
    }
    addVectors(e, t)
    {
        return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this
    }
    addScaledVector(e, t)
    {
        return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this
    }
    sub(e)
    {
        return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this
    }
    subScalar(e)
    {
        return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this
    }
    subVectors(e, t)
    {
        return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this
    }
    multiply(e)
    {
        return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this
    }
    multiplyScalar(e)
    {
        return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this
    }
    applyMatrix4(e)
    {
        const t = this.x,
            s = this.y,
            n = this.z,
            r = this.w,
            a = e.elements;
        return this.x = a[0] * t + a[4] * s + a[8] * n + a[12] * r, this.y = a[1] * t + a[5] * s + a[9] * n + a[13] * r, this.z = a[2] * t + a[6] * s + a[10] * n + a[14] * r, this.w = a[3] * t + a[7] * s + a[11] * n + a[15] * r, this
    }
    divideScalar(e)
    {
        return this.multiplyScalar(1 / e)
    }
    setAxisAngleFromQuaternion(e)
    {
        this.w = 2 * Math.acos(e.w);
        const t = Math.sqrt(1 - e.w * e.w);
        return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this
    }
    setAxisAngleFromRotationMatrix(e)
    {
        let t,
            s,
            n,
            r;
        const l = e.elements,
            c = l[0],
            h = l[4],
            d = l[8],
            u = l[1],
            f = l[5],
            p = l[9],
            A = l[2],
            m = l[6],
            g = l[10];
        if (Math.abs(h - u) < .01 && Math.abs(d - A) < .01 && Math.abs(p - m) < .01) {
            if (Math.abs(h + u) < .1 && Math.abs(d + A) < .1 && Math.abs(p + m) < .1 && Math.abs(c + f + g - 3) < .1)
                return this.set(1, 0, 0, 0), this;
            t = Math.PI;
            const v = (c + 1) / 2,
                y = (f + 1) / 2,
                S = (g + 1) / 2,
                w = (h + u) / 4,
                C = (d + A) / 4,
                M = (p + m) / 4;
            return v > y && v > S ? v < .01 ? (s = 0, n = .707106781, r = .707106781) : (s = Math.sqrt(v), n = w / s, r = C / s) : y > S ? y < .01 ? (s = .707106781, n = 0, r = .707106781) : (n = Math.sqrt(y), s = w / n, r = M / n) : S < .01 ? (s = .707106781, n = .707106781, r = 0) : (r = Math.sqrt(S), s = C / r, n = M / r), this.set(s, n, r, t), this
        }
        let x = Math.sqrt((m - p) * (m - p) + (d - A) * (d - A) + (u - h) * (u - h));
        return Math.abs(x) < .001 && (x = 1), this.x = (m - p) / x, this.y = (d - A) / x, this.z = (u - h) / x, this.w = Math.acos((c + f + g - 1) / 2), this
    }
    min(e)
    {
        return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this
    }
    max(e)
    {
        return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this
    }
    clamp(e, t)
    {
        return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this.z = Math.max(e.z, Math.min(t.z, this.z)), this.w = Math.max(e.w, Math.min(t.w, this.w)), this
    }
    clampScalar(e, t)
    {
        return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this.z = Math.max(e, Math.min(t, this.z)), this.w = Math.max(e, Math.min(t, this.w)), this
    }
    clampLength(e, t)
    {
        const s = this.length();
        return this.divideScalar(s || 1).multiplyScalar(Math.max(e, Math.min(t, s)))
    }
    floor()
    {
        return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this
    }
    ceil()
    {
        return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this
    }
    round()
    {
        return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this
    }
    roundToZero()
    {
        return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this
    }
    negate()
    {
        return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this
    }
    dot(e)
    {
        return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w
    }
    lengthSq()
    {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    }
    length()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
    }
    manhattanLength()
    {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w)
    }
    normalize()
    {
        return this.divideScalar(this.length() || 1)
    }
    setLength(e)
    {
        return this.normalize().multiplyScalar(e)
    }
    lerp(e, t)
    {
        return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this
    }
    lerpVectors(e, t, s)
    {
        return this.x = e.x + (t.x - e.x) * s, this.y = e.y + (t.y - e.y) * s, this.z = e.z + (t.z - e.z) * s, this.w = e.w + (t.w - e.w) * s, this
    }
    equals(e)
    {
        return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w
    }
    fromArray(e, t=0)
    {
        return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this
    }
    toArray(e=[], t=0)
    {
        return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e
    }
    fromBufferAttribute(e, t)
    {
        return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this
    }
    random()
    {
        return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this
    }
    *[Symbol.iterator]()
    {
        yield this.x,
        yield this.y,
        yield this.z,
        yield this.w
    }
}
class $C extends hn {
    constructor(e=1, t=1, s={})
    {
        super(),
        this.isRenderTarget = !0,
        this.width = e,
        this.height = t,
        this.depth = 1,
        this.scissor = new yt(0, 0, e, t),
        this.scissorTest = !1,
        this.viewport = new yt(0, 0, e, t);
        const n = {
            width: e,
            height: t,
            depth: 1
        };
        s = Object.assign({
            generateMipmaps: !1,
            internalFormat: null,
            minFilter: _t,
            depthBuffer: !0,
            stencilBuffer: !1,
            resolveDepthBuffer: !0,
            resolveStencilBuffer: !0,
            depthTexture: null,
            samples: 0,
            count: 1
        }, s);
        const r = new Rt(n, s.mapping, s.wrapS, s.wrapT, s.magFilter, s.minFilter, s.format, s.type, s.anisotropy, s.colorSpace);
        r.flipY = !1,
        r.generateMipmaps = s.generateMipmaps,
        r.internalFormat = s.internalFormat,
        this.textures = [];
        const a = s.count;
        for (let o = 0; o < a; o++)
            this.textures[o] = r.clone(),
            this.textures[o].isRenderTargetTexture = !0;
        this.depthBuffer = s.depthBuffer,
        this.stencilBuffer = s.stencilBuffer,
        this.resolveDepthBuffer = s.resolveDepthBuffer,
        this.resolveStencilBuffer = s.resolveStencilBuffer,
        this.depthTexture = s.depthTexture,
        this.samples = s.samples
    }
    get texture()
    {
        return this.textures[0]
    }
    set texture(e)
    {
        this.textures[0] = e
    }
    setSize(e, t, s=1)
    {
        if (this.width !== e || this.height !== t || this.depth !== s) {
            this.width = e,
            this.height = t,
            this.depth = s;
            for (let n = 0, r = this.textures.length; n < r; n++)
                this.textures[n].image.width = e,
                this.textures[n].image.height = t,
                this.textures[n].image.depth = s;
            this.dispose()
        }
        this.viewport.set(0, 0, e, t),
        this.scissor.set(0, 0, e, t)
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
    copy(e)
    {
        this.width = e.width,
        this.height = e.height,
        this.depth = e.depth,
        this.scissor.copy(e.scissor),
        this.scissorTest = e.scissorTest,
        this.viewport.copy(e.viewport),
        this.textures.length = 0;
        for (let s = 0, n = e.textures.length; s < n; s++)
            this.textures[s] = e.textures[s].clone(),
            this.textures[s].isRenderTargetTexture = !0;
        const t = Object.assign({}, e.texture.image);
        return this.texture.source = new by(t), this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, this.resolveDepthBuffer = e.resolveDepthBuffer, this.resolveStencilBuffer = e.resolveStencilBuffer, e.depthTexture !== null && (this.depthTexture = e.depthTexture.clone()), this.samples = e.samples, this
    }
    dispose()
    {
        this.dispatchEvent({
            type: "dispose"
        })
    }
}
class vt extends $C {
    constructor(e=1, t=1, s={})
    {
        super(e, t, s),
        this.isWebGLRenderTarget = !0
    }
}
class Ty extends Rt {
    constructor(e=null, t=1, s=1, n=1)
    {
        super(null),
        this.isDataArrayTexture = !0,
        this.image = {
            data: e,
            width: t,
            height: s,
            depth: n
        },
        this.magFilter = gt,
        this.minFilter = gt,
        this.wrapR = zs,
        this.generateMipmaps = !1,
        this.flipY = !1,
        this.unpackAlignment = 1,
        this.layerUpdates = new Set
    }
    addLayerUpdate(e)
    {
        this.layerUpdates.add(e)
    }
    clearLayerUpdates()
    {
        this.layerUpdates.clear()
    }
}
class DA extends Rt {
    constructor(e=null, t=1, s=1, n=1)
    {
        super(null),
        this.isData3DTexture = !0,
        this.image = {
            data: e,
            width: t,
            height: s,
            depth: n
        },
        this.magFilter = gt,
        this.minFilter = gt,
        this.wrapR = zs,
        this.generateMipmaps = !1,
        this.flipY = !1,
        this.unpackAlignment = 1
    }
}
class Vi {
    constructor(e=0, t=0, s=0, n=1)
    {
        this.isQuaternion = !0,
        this._x = e,
        this._y = t,
        this._z = s,
        this._w = n
    }
    static slerpFlat(e, t, s, n, r, a, o)
    {
        let l = s[n + 0],
            c = s[n + 1],
            h = s[n + 2],
            d = s[n + 3];
        const u = r[a + 0],
            f = r[a + 1],
            p = r[a + 2],
            A = r[a + 3];
        if (o === 0) {
            e[t + 0] = l,
            e[t + 1] = c,
            e[t + 2] = h,
            e[t + 3] = d;
            return
        }
        if (o === 1) {
            e[t + 0] = u,
            e[t + 1] = f,
            e[t + 2] = p,
            e[t + 3] = A;
            return
        }
        if (d !== A || l !== u || c !== f || h !== p) {
            let m = 1 - o;
            const g = l * u + c * f + h * p + d * A,
                x = g >= 0 ? 1 : -1,
                v = 1 - g * g;
            if (v > Number.EPSILON) {
                const S = Math.sqrt(v),
                    w = Math.atan2(S, g * x);
                m = Math.sin(m * w) / S,
                o = Math.sin(o * w) / S
            }
            const y = o * x;
            if (l = l * m + u * y, c = c * m + f * y, h = h * m + p * y, d = d * m + A * y, m === 1 - o) {
                const S = 1 / Math.sqrt(l * l + c * c + h * h + d * d);
                l *= S,
                c *= S,
                h *= S,
                d *= S
            }
        }
        e[t] = l,
        e[t + 1] = c,
        e[t + 2] = h,
        e[t + 3] = d
    }
    static multiplyQuaternionsFlat(e, t, s, n, r, a)
    {
        const o = s[n],
            l = s[n + 1],
            c = s[n + 2],
            h = s[n + 3],
            d = r[a],
            u = r[a + 1],
            f = r[a + 2],
            p = r[a + 3];
        return e[t] = o * p + h * d + l * f - c * u, e[t + 1] = l * p + h * u + c * d - o * f, e[t + 2] = c * p + h * f + o * u - l * d, e[t + 3] = h * p - o * d - l * u - c * f, e
    }
    get x()
    {
        return this._x
    }
    set x(e)
    {
        this._x = e,
        this._onChangeCallback()
    }
    get y()
    {
        return this._y
    }
    set y(e)
    {
        this._y = e,
        this._onChangeCallback()
    }
    get z()
    {
        return this._z
    }
    set z(e)
    {
        this._z = e,
        this._onChangeCallback()
    }
    get w()
    {
        return this._w
    }
    set w(e)
    {
        this._w = e,
        this._onChangeCallback()
    }
    set(e, t, s, n)
    {
        return this._x = e, this._y = t, this._z = s, this._w = n, this._onChangeCallback(), this
    }
    clone()
    {
        return new this.constructor(this._x, this._y, this._z, this._w)
    }
    copy(e)
    {
        return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this
    }
    setFromEuler(e, t=!0)
    {
        const s = e._x,
            n = e._y,
            r = e._z,
            a = e._order,
            o = Math.cos,
            l = Math.sin,
            c = o(s / 2),
            h = o(n / 2),
            d = o(r / 2),
            u = l(s / 2),
            f = l(n / 2),
            p = l(r / 2);
        switch (a) {
        case "XYZ":
            this._x = u * h * d + c * f * p,
            this._y = c * f * d - u * h * p,
            this._z = c * h * p + u * f * d,
            this._w = c * h * d - u * f * p;
            break;
        case "YXZ":
            this._x = u * h * d + c * f * p,
            this._y = c * f * d - u * h * p,
            this._z = c * h * p - u * f * d,
            this._w = c * h * d + u * f * p;
            break;
        case "ZXY":
            this._x = u * h * d - c * f * p,
            this._y = c * f * d + u * h * p,
            this._z = c * h * p + u * f * d,
            this._w = c * h * d - u * f * p;
            break;
        case "ZYX":
            this._x = u * h * d - c * f * p,
            this._y = c * f * d + u * h * p,
            this._z = c * h * p - u * f * d,
            this._w = c * h * d + u * f * p;
            break;
        case "YZX":
            this._x = u * h * d + c * f * p,
            this._y = c * f * d + u * h * p,
            this._z = c * h * p - u * f * d,
            this._w = c * h * d - u * f * p;
            break;
        case "XZY":
            this._x = u * h * d - c * f * p,
            this._y = c * f * d - u * h * p,
            this._z = c * h * p + u * f * d,
            this._w = c * h * d + u * f * p;
            break;
        default:
            console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + a)
        }
        return t === !0 && this._onChangeCallback(), this
    }
    setFromAxisAngle(e, t)
    {
        const s = t / 2,
            n = Math.sin(s);
        return this._x = e.x * n, this._y = e.y * n, this._z = e.z * n, this._w = Math.cos(s), this._onChangeCallback(), this
    }
    setFromRotationMatrix(e)
    {
        const t = e.elements,
            s = t[0],
            n = t[4],
            r = t[8],
            a = t[1],
            o = t[5],
            l = t[9],
            c = t[2],
            h = t[6],
            d = t[10],
            u = s + o + d;
        if (u > 0) {
            const f = .5 / Math.sqrt(u + 1);
            this._w = .25 / f,
            this._x = (h - l) * f,
            this._y = (r - c) * f,
            this._z = (a - n) * f
        } else if (s > o && s > d) {
            const f = 2 * Math.sqrt(1 + s - o - d);
            this._w = (h - l) / f,
            this._x = .25 * f,
            this._y = (n + a) / f,
            this._z = (r + c) / f
        } else if (o > d) {
            const f = 2 * Math.sqrt(1 + o - s - d);
            this._w = (r - c) / f,
            this._x = (n + a) / f,
            this._y = .25 * f,
            this._z = (l + h) / f
        } else {
            const f = 2 * Math.sqrt(1 + d - s - o);
            this._w = (a - n) / f,
            this._x = (r + c) / f,
            this._y = (l + h) / f,
            this._z = .25 * f
        }
        return this._onChangeCallback(), this
    }
    setFromUnitVectors(e, t)
    {
        let s = e.dot(t) + 1;
        return s < Number.EPSILON ? (s = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = s) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = s)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = s), this.normalize()
    }
    angleTo(e)
    {
        return 2 * Math.acos(Math.abs(hi(this.dot(e), -1, 1)))
    }
    rotateTowards(e, t)
    {
        const s = this.angleTo(e);
        if (s === 0)
            return this;
        const n = Math.min(1, t / s);
        return this.slerp(e, n), this
    }
    identity()
    {
        return this.set(0, 0, 0, 1)
    }
    invert()
    {
        return this.conjugate()
    }
    conjugate()
    {
        return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this
    }
    dot(e)
    {
        return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w
    }
    lengthSq()
    {
        return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w
    }
    length()
    {
        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w)
    }
    normalize()
    {
        let e = this.length();
        return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x = this._x * e, this._y = this._y * e, this._z = this._z * e, this._w = this._w * e), this._onChangeCallback(), this
    }
    multiply(e)
    {
        return this.multiplyQuaternions(this, e)
    }
    premultiply(e)
    {
        return this.multiplyQuaternions(e, this)
    }
    multiplyQuaternions(e, t)
    {
        const s = e._x,
            n = e._y,
            r = e._z,
            a = e._w,
            o = t._x,
            l = t._y,
            c = t._z,
            h = t._w;
        return this._x = s * h + a * o + n * c - r * l, this._y = n * h + a * l + r * o - s * c, this._z = r * h + a * c + s * l - n * o, this._w = a * h - s * o - n * l - r * c, this._onChangeCallback(), this
    }
    slerp(e, t)
    {
        if (t === 0)
            return this;
        if (t === 1)
            return this.copy(e);
        const s = this._x,
            n = this._y,
            r = this._z,
            a = this._w;
        let o = a * e._w + s * e._x + n * e._y + r * e._z;
        if (o < 0 ? (this._w = -e._w, this._x = -e._x, this._y = -e._y, this._z = -e._z, o = -o) : this.copy(e), o >= 1)
            return this._w = a, this._x = s, this._y = n, this._z = r, this;
        const l = 1 - o * o;
        if (l <= Number.EPSILON) {
            const f = 1 - t;
            return this._w = f * a + t * this._w, this._x = f * s + t * this._x, this._y = f * n + t * this._y, this._z = f * r + t * this._z, this.normalize(), this
        }
        const c = Math.sqrt(l),
            h = Math.atan2(c, o),
            d = Math.sin((1 - t) * h) / c,
            u = Math.sin(t * h) / c;
        return this._w = a * d + this._w * u, this._x = s * d + this._x * u, this._y = n * d + this._y * u, this._z = r * d + this._z * u, this._onChangeCallback(), this
    }
    slerpQuaternions(e, t, s)
    {
        return this.copy(e).slerp(t, s)
    }
    random()
    {
        const e = 2 * Math.PI * Math.random(),
            t = 2 * Math.PI * Math.random(),
            s = Math.random(),
            n = Math.sqrt(1 - s),
            r = Math.sqrt(s);
        return this.set(n * Math.sin(e), n * Math.cos(e), r * Math.sin(t), r * Math.cos(t))
    }
    equals(e)
    {
        return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w
    }
    fromArray(e, t=0)
    {
        return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this
    }
    toArray(e=[], t=0)
    {
        return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e
    }
    fromBufferAttribute(e, t)
    {
        return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this
    }
    toJSON()
    {
        return this.toArray()
    }
    _onChange(e)
    {
        return this._onChangeCallback = e, this
    }
    _onChangeCallback() {}
    *[Symbol.iterator]()
    {
        yield this._x,
        yield this._y,
        yield this._z,
        yield this._w
    }
}
class b {
    constructor(e=0, t=0, s=0)
    {
        b.prototype.isVector3 = !0,
        this.x = e,
        this.y = t,
        this.z = s
    }
    set(e, t, s)
    {
        return s === void 0 && (s = this.z), this.x = e, this.y = t, this.z = s, this
    }
    setScalar(e)
    {
        return this.x = e, this.y = e, this.z = e, this
    }
    setX(e)
    {
        return this.x = e, this
    }
    setY(e)
    {
        return this.y = e, this
    }
    setZ(e)
    {
        return this.z = e, this
    }
    setComponent(e, t)
    {
        switch (e) {
        case 0:
            this.x = t;
            break;
        case 1:
            this.y = t;
            break;
        case 2:
            this.z = t;
            break;
        default:
            throw new Error("index is out of range: " + e)
        }
        return this
    }
    getComponent(e)
    {
        switch (e) {
        case 0:
            return this.x;
        case 1:
            return this.y;
        case 2:
            return this.z;
        default:
            throw new Error("index is out of range: " + e)
        }
    }
    clone()
    {
        return new this.constructor(this.x, this.y, this.z)
    }
    copy(e)
    {
        return this.x = e.x, this.y = e.y, this.z = e.z, this
    }
    add(e)
    {
        return this.x += e.x, this.y += e.y, this.z += e.z, this
    }
    addScalar(e)
    {
        return this.x += e, this.y += e, this.z += e, this
    }
    addVectors(e, t)
    {
        return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this
    }
    addScaledVector(e, t)
    {
        return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this
    }
    sub(e)
    {
        return this.x -= e.x, this.y -= e.y, this.z -= e.z, this
    }
    subScalar(e)
    {
        return this.x -= e, this.y -= e, this.z -= e, this
    }
    subVectors(e, t)
    {
        return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this
    }
    multiply(e)
    {
        return this.x *= e.x, this.y *= e.y, this.z *= e.z, this
    }
    multiplyScalar(e)
    {
        return this.x *= e, this.y *= e, this.z *= e, this
    }
    multiplyVectors(e, t)
    {
        return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this
    }
    applyEuler(e)
    {
        return this.applyQuaternion(pv.setFromEuler(e))
    }
    applyAxisAngle(e, t)
    {
        return this.applyQuaternion(pv.setFromAxisAngle(e, t))
    }
    applyMatrix3(e)
    {
        const t = this.x,
            s = this.y,
            n = this.z,
            r = e.elements;
        return this.x = r[0] * t + r[3] * s + r[6] * n, this.y = r[1] * t + r[4] * s + r[7] * n, this.z = r[2] * t + r[5] * s + r[8] * n, this
    }
    applyNormalMatrix(e)
    {
        return this.applyMatrix3(e).normalize()
    }
    applyMatrix4(e)
    {
        const t = this.x,
            s = this.y,
            n = this.z,
            r = e.elements,
            a = 1 / (r[3] * t + r[7] * s + r[11] * n + r[15]);
        return this.x = (r[0] * t + r[4] * s + r[8] * n + r[12]) * a, this.y = (r[1] * t + r[5] * s + r[9] * n + r[13]) * a, this.z = (r[2] * t + r[6] * s + r[10] * n + r[14]) * a, this
    }
    applyQuaternion(e)
    {
        const t = this.x,
            s = this.y,
            n = this.z,
            r = e.x,
            a = e.y,
            o = e.z,
            l = e.w,
            c = 2 * (a * n - o * s),
            h = 2 * (o * t - r * n),
            d = 2 * (r * s - a * t);
        return this.x = t + l * c + a * d - o * h, this.y = s + l * h + o * c - r * d, this.z = n + l * d + r * h - a * c, this
    }
    project(e)
    {
        return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)
    }
    unproject(e)
    {
        return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)
    }
    transformDirection(e)
    {
        const t = this.x,
            s = this.y,
            n = this.z,
            r = e.elements;
        return this.x = r[0] * t + r[4] * s + r[8] * n, this.y = r[1] * t + r[5] * s + r[9] * n, this.z = r[2] * t + r[6] * s + r[10] * n, this.normalize()
    }
    divide(e)
    {
        return this.x /= e.x, this.y /= e.y, this.z /= e.z, this
    }
    divideScalar(e)
    {
        return this.multiplyScalar(1 / e)
    }
    min(e)
    {
        return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this
    }
    max(e)
    {
        return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this
    }
    clamp(e, t)
    {
        return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this.z = Math.max(e.z, Math.min(t.z, this.z)), this
    }
    clampScalar(e, t)
    {
        return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this.z = Math.max(e, Math.min(t, this.z)), this
    }
    clampLength(e, t)
    {
        const s = this.length();
        return this.divideScalar(s || 1).multiplyScalar(Math.max(e, Math.min(t, s)))
    }
    floor()
    {
        return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this
    }
    ceil()
    {
        return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this
    }
    round()
    {
        return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this
    }
    roundToZero()
    {
        return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this
    }
    negate()
    {
        return this.x = -this.x, this.y = -this.y, this.z = -this.z, this
    }
    dot(e)
    {
        return this.x * e.x + this.y * e.y + this.z * e.z
    }
    lengthSq()
    {
        return this.x * this.x + this.y * this.y + this.z * this.z
    }
    length()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }
    manhattanLength()
    {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z)
    }
    normalize()
    {
        return this.divideScalar(this.length() || 1)
    }
    setLength(e)
    {
        return this.normalize().multiplyScalar(e)
    }
    lerp(e, t)
    {
        return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this
    }
    lerpVectors(e, t, s)
    {
        return this.x = e.x + (t.x - e.x) * s, this.y = e.y + (t.y - e.y) * s, this.z = e.z + (t.z - e.z) * s, this
    }
    cross(e)
    {
        return this.crossVectors(this, e)
    }
    crossVectors(e, t)
    {
        const s = e.x,
            n = e.y,
            r = e.z,
            a = t.x,
            o = t.y,
            l = t.z;
        return this.x = n * l - r * o, this.y = r * a - s * l, this.z = s * o - n * a, this
    }
    projectOnVector(e)
    {
        const t = e.lengthSq();
        if (t === 0)
            return this.set(0, 0, 0);
        const s = e.dot(this) / t;
        return this.copy(e).multiplyScalar(s)
    }
    projectOnPlane(e)
    {
        return Kd.copy(this).projectOnVector(e), this.sub(Kd)
    }
    reflect(e)
    {
        return this.sub(Kd.copy(e).multiplyScalar(2 * this.dot(e)))
    }
    angleTo(e)
    {
        const t = Math.sqrt(this.lengthSq() * e.lengthSq());
        if (t === 0)
            return Math.PI / 2;
        const s = this.dot(e) / t;
        return Math.acos(hi(s, -1, 1))
    }
    distanceTo(e)
    {
        return Math.sqrt(this.distanceToSquared(e))
    }
    distanceToSquared(e)
    {
        const t = this.x - e.x,
            s = this.y - e.y,
            n = this.z - e.z;
        return t * t + s * s + n * n
    }
    manhattanDistanceTo(e)
    {
        return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z)
    }
    setFromSpherical(e)
    {
        return this.setFromSphericalCoords(e.radius, e.phi, e.theta)
    }
    setFromSphericalCoords(e, t, s)
    {
        const n = Math.sin(t) * e;
        return this.x = n * Math.sin(s), this.y = Math.cos(t) * e, this.z = n * Math.cos(s), this
    }
    setFromCylindrical(e)
    {
        return this.setFromCylindricalCoords(e.radius, e.theta, e.y)
    }
    setFromCylindricalCoords(e, t, s)
    {
        return this.x = e * Math.sin(t), this.y = s, this.z = e * Math.cos(t), this
    }
    setFromMatrixPosition(e)
    {
        const t = e.elements;
        return this.x = t[12], this.y = t[13], this.z = t[14], this
    }
    setFromMatrixScale(e)
    {
        const t = this.setFromMatrixColumn(e, 0).length(),
            s = this.setFromMatrixColumn(e, 1).length(),
            n = this.setFromMatrixColumn(e, 2).length();
        return this.x = t, this.y = s, this.z = n, this
    }
    setFromMatrixColumn(e, t)
    {
        return this.fromArray(e.elements, t * 4)
    }
    setFromMatrix3Column(e, t)
    {
        return this.fromArray(e.elements, t * 3)
    }
    setFromEuler(e)
    {
        return this.x = e._x, this.y = e._y, this.z = e._z, this
    }
    setFromColor(e)
    {
        return this.x = e.r, this.y = e.g, this.z = e.b, this
    }
    equals(e)
    {
        return e.x === this.x && e.y === this.y && e.z === this.z
    }
    fromArray(e, t=0)
    {
        return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this
    }
    toArray(e=[], t=0)
    {
        return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e
    }
    fromBufferAttribute(e, t)
    {
        return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this
    }
    random()
    {
        return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this
    }
    randomDirection()
    {
        const e = Math.random() * Math.PI * 2,
            t = Math.random() * 2 - 1,
            s = Math.sqrt(1 - t * t);
        return this.x = s * Math.cos(e), this.y = t, this.z = s * Math.sin(e), this
    }
    *[Symbol.iterator]()
    {
        yield this.x,
        yield this.y,
        yield this.z
    }
}
const Kd = new b,
    pv = new Vi;
class Vt {
    constructor(e=new b(1 / 0, 1 / 0, 1 / 0), t=new b(-1 / 0, -1 / 0, -1 / 0))
    {
        this.isBox3 = !0,
        this.min = e,
        this.max = t
    }
    set(e, t)
    {
        return this.min.copy(e), this.max.copy(t), this
    }
    setFromArray(e)
    {
        this.makeEmpty();
        for (let t = 0, s = e.length; t < s; t += 3)
            this.expandByPoint(Ps.fromArray(e, t));
        return this
    }
    setFromBufferAttribute(e)
    {
        this.makeEmpty();
        for (let t = 0, s = e.count; t < s; t++)
            this.expandByPoint(Ps.fromBufferAttribute(e, t));
        return this
    }
    setFromPoints(e)
    {
        this.makeEmpty();
        for (let t = 0, s = e.length; t < s; t++)
            this.expandByPoint(e[t]);
        return this
    }
    setFromCenterAndSize(e, t)
    {
        const s = Ps.copy(t).multiplyScalar(.5);
        return this.min.copy(e).sub(s), this.max.copy(e).add(s), this
    }
    setFromObject(e, t=!1)
    {
        return this.makeEmpty(), this.expandByObject(e, t)
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
    copy(e)
    {
        return this.min.copy(e.min), this.max.copy(e.max), this
    }
    makeEmpty()
    {
        return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this
    }
    isEmpty()
    {
        return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z
    }
    getCenter(e)
    {
        return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(.5)
    }
    getSize(e)
    {
        return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min)
    }
    expandByPoint(e)
    {
        return this.min.min(e), this.max.max(e), this
    }
    expandByVector(e)
    {
        return this.min.sub(e), this.max.add(e), this
    }
    expandByScalar(e)
    {
        return this.min.addScalar(-e), this.max.addScalar(e), this
    }
    expandByObject(e, t=!1)
    {
        e.updateWorldMatrix(!1, !1);
        const s = e.geometry;
        if (s !== void 0) {
            const r = s.getAttribute("position");
            if (t === !0 && r !== void 0 && e.isInstancedMesh !== !0)
                for (let a = 0, o = r.count; a < o; a++)
                    e.isMesh === !0 ? e.getVertexPosition(a, Ps) : Ps.fromBufferAttribute(r, a),
                    Ps.applyMatrix4(e.matrixWorld),
                    this.expandByPoint(Ps);
            else
                e.boundingBox !== void 0 ? (e.boundingBox === null && e.computeBoundingBox(), Qc.copy(e.boundingBox)) : (s.boundingBox === null && s.computeBoundingBox(), Qc.copy(s.boundingBox)),
                Qc.applyMatrix4(e.matrixWorld),
                this.union(Qc)
        }
        const n = e.children;
        for (let r = 0, a = n.length; r < a; r++)
            this.expandByObject(n[r], t);
        return this
    }
    containsPoint(e)
    {
        return !(e.x < this.min.x || e.x > this.max.x || e.y < this.min.y || e.y > this.max.y || e.z < this.min.z || e.z > this.max.z)
    }
    containsBox(e)
    {
        return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z
    }
    getParameter(e, t)
    {
        return t.set((e.x - this.min.x) / (this.max.x - this.min.x), (e.y - this.min.y) / (this.max.y - this.min.y), (e.z - this.min.z) / (this.max.z - this.min.z))
    }
    intersectsBox(e)
    {
        return !(e.max.x < this.min.x || e.min.x > this.max.x || e.max.y < this.min.y || e.min.y > this.max.y || e.max.z < this.min.z || e.min.z > this.max.z)
    }
    intersectsSphere(e)
    {
        return this.clampPoint(e.center, Ps), Ps.distanceToSquared(e.center) <= e.radius * e.radius
    }
    intersectsPlane(e)
    {
        let t,
            s;
        return e.normal.x > 0 ? (t = e.normal.x * this.min.x, s = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, s = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, s += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, s += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, s += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, s += e.normal.z * this.min.z), t <= -e.constant && s >= -e.constant
    }
    intersectsTriangle(e)
    {
        if (this.isEmpty())
            return !1;
        this.getCenter(el),
        Gc.subVectors(this.max, el),
        Ca.subVectors(e.a, el),
        Sa.subVectors(e.b, el),
        Ma.subVectors(e.c, el),
        kn.subVectors(Sa, Ca),
        zn.subVectors(Ma, Sa),
        br.subVectors(Ca, Ma);
        let t = [0, -kn.z, kn.y, 0, -zn.z, zn.y, 0, -br.z, br.y, kn.z, 0, -kn.x, zn.z, 0, -zn.x, br.z, 0, -br.x, -kn.y, kn.x, 0, -zn.y, zn.x, 0, -br.y, br.x, 0];
        return !Jd(t, Ca, Sa, Ma, Gc) || (t = [1, 0, 0, 0, 1, 0, 0, 0, 1], !Jd(t, Ca, Sa, Ma, Gc)) ? !1 : (Hc.crossVectors(kn, zn), t = [Hc.x, Hc.y, Hc.z], Jd(t, Ca, Sa, Ma, Gc))
    }
    clampPoint(e, t)
    {
        return t.copy(e).clamp(this.min, this.max)
    }
    distanceToPoint(e)
    {
        return this.clampPoint(e, Ps).distanceTo(e)
    }
    getBoundingSphere(e)
    {
        return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(Ps).length() * .5), e
    }
    intersect(e)
    {
        return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this
    }
    union(e)
    {
        return this.min.min(e.min), this.max.max(e.max), this
    }
    applyMatrix4(e)
    {
        return this.isEmpty() ? this : (pn[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), pn[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), pn[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), pn[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), pn[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), pn[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), pn[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), pn[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(pn), this)
    }
    translate(e)
    {
        return this.min.add(e), this.max.add(e), this
    }
    equals(e)
    {
        return e.min.equals(this.min) && e.max.equals(this.max)
    }
}
const pn = [new b, new b, new b, new b, new b, new b, new b, new b],
    Ps = new b,
    Qc = new Vt,
    Ca = new b,
    Sa = new b,
    Ma = new b,
    kn = new b,
    zn = new b,
    br = new b,
    el = new b,
    Gc = new b,
    Hc = new b,
    Tr = new b;
function Jd(i, e, t, s, n) {
    for (let r = 0, a = i.length - 3; r <= a; r += 3) {
        Tr.fromArray(i, r);
        const o = n.x * Math.abs(Tr.x) + n.y * Math.abs(Tr.y) + n.z * Math.abs(Tr.z),
            l = e.dot(Tr),
            c = t.dot(Tr),
            h = s.dot(Tr);
        if (Math.max(-Math.max(l, c, h), Math.min(l, c, h)) > o)
            return !1
    }
    return !0
}
const e1 = new Vt,
    tl = new b,
    jd = new b;
class bi {
    constructor(e=new b, t=-1)
    {
        this.isSphere = !0,
        this.center = e,
        this.radius = t
    }
    set(e, t)
    {
        return this.center.copy(e), this.radius = t, this
    }
    setFromPoints(e, t)
    {
        const s = this.center;
        t !== void 0 ? s.copy(t) : e1.setFromPoints(e).getCenter(s);
        let n = 0;
        for (let r = 0, a = e.length; r < a; r++)
            n = Math.max(n, s.distanceToSquared(e[r]));
        return this.radius = Math.sqrt(n), this
    }
    copy(e)
    {
        return this.center.copy(e.center), this.radius = e.radius, this
    }
    isEmpty()
    {
        return this.radius < 0
    }
    makeEmpty()
    {
        return this.center.set(0, 0, 0), this.radius = -1, this
    }
    containsPoint(e)
    {
        return e.distanceToSquared(this.center) <= this.radius * this.radius
    }
    distanceToPoint(e)
    {
        return e.distanceTo(this.center) - this.radius
    }
    intersectsSphere(e)
    {
        const t = this.radius + e.radius;
        return e.center.distanceToSquared(this.center) <= t * t
    }
    intersectsBox(e)
    {
        return e.intersectsSphere(this)
    }
    intersectsPlane(e)
    {
        return Math.abs(e.distanceToPoint(this.center)) <= this.radius
    }
    clampPoint(e, t)
    {
        const s = this.center.distanceToSquared(e);
        return t.copy(e), s > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t
    }
    getBoundingBox(e)
    {
        return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e)
    }
    applyMatrix4(e)
    {
        return this.center.applyMatrix4(e), this.radius = this.radius * e.getMaxScaleOnAxis(), this
    }
    translate(e)
    {
        return this.center.add(e), this
    }
    expandByPoint(e)
    {
        if (this.isEmpty())
            return this.center.copy(e), this.radius = 0, this;
        tl.subVectors(e, this.center);
        const t = tl.lengthSq();
        if (t > this.radius * this.radius) {
            const s = Math.sqrt(t),
                n = (s - this.radius) * .5;
            this.center.addScaledVector(tl, n / s),
            this.radius += n
        }
        return this
    }
    union(e)
    {
        return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === !0 ? this.radius = Math.max(this.radius, e.radius) : (jd.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(tl.copy(e.center).add(jd)), this.expandByPoint(tl.copy(e.center).sub(jd))), this)
    }
    equals(e)
    {
        return e.center.equals(this.center) && e.radius === this.radius
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
}
const mn = new b,
    Zd = new b,
    Vc = new b,
    Qn = new b,
    $d = new b,
    Wc = new b,
    ef = new b;
class Vo {
    constructor(e=new b, t=new b(0, 0, -1))
    {
        this.origin = e,
        this.direction = t
    }
    set(e, t)
    {
        return this.origin.copy(e), this.direction.copy(t), this
    }
    copy(e)
    {
        return this.origin.copy(e.origin), this.direction.copy(e.direction), this
    }
    at(e, t)
    {
        return t.copy(this.origin).addScaledVector(this.direction, e)
    }
    lookAt(e)
    {
        return this.direction.copy(e).sub(this.origin).normalize(), this
    }
    recast(e)
    {
        return this.origin.copy(this.at(e, mn)), this
    }
    closestPointToPoint(e, t)
    {
        t.subVectors(e, this.origin);
        const s = t.dot(this.direction);
        return s < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, s)
    }
    distanceToPoint(e)
    {
        return Math.sqrt(this.distanceSqToPoint(e))
    }
    distanceSqToPoint(e)
    {
        const t = mn.subVectors(e, this.origin).dot(this.direction);
        return t < 0 ? this.origin.distanceToSquared(e) : (mn.copy(this.origin).addScaledVector(this.direction, t), mn.distanceToSquared(e))
    }
    distanceSqToSegment(e, t, s, n)
    {
        Zd.copy(e).add(t).multiplyScalar(.5),
        Vc.copy(t).sub(e).normalize(),
        Qn.copy(this.origin).sub(Zd);
        const r = e.distanceTo(t) * .5,
            a = -this.direction.dot(Vc),
            o = Qn.dot(this.direction),
            l = -Qn.dot(Vc),
            c = Qn.lengthSq(),
            h = Math.abs(1 - a * a);
        let d,
            u,
            f,
            p;
        if (h > 0)
            if (d = a * l - o, u = a * o - l, p = r * h, d >= 0)
                if (u >= -p)
                    if (u <= p) {
                        const A = 1 / h;
                        d *= A,
                        u *= A,
                        f = d * (d + a * u + 2 * o) + u * (a * d + u + 2 * l) + c
                    } else
                        u = r,
                        d = Math.max(0, -(a * u + o)),
                        f = -d * d + u * (u + 2 * l) + c;
                else
                    u = -r,
                    d = Math.max(0, -(a * u + o)),
                    f = -d * d + u * (u + 2 * l) + c;
            else
                u <= -p ? (d = Math.max(0, -(-a * r + o)), u = d > 0 ? -r : Math.min(Math.max(-r, -l), r), f = -d * d + u * (u + 2 * l) + c) : u <= p ? (d = 0, u = Math.min(Math.max(-r, -l), r), f = u * (u + 2 * l) + c) : (d = Math.max(0, -(a * r + o)), u = d > 0 ? r : Math.min(Math.max(-r, -l), r), f = -d * d + u * (u + 2 * l) + c);
        else
            u = a > 0 ? -r : r,
            d = Math.max(0, -(a * u + o)),
            f = -d * d + u * (u + 2 * l) + c;
        return s && s.copy(this.origin).addScaledVector(this.direction, d), n && n.copy(Zd).addScaledVector(Vc, u), f
    }
    intersectSphere(e, t)
    {
        mn.subVectors(e.center, this.origin);
        const s = mn.dot(this.direction),
            n = mn.dot(mn) - s * s,
            r = e.radius * e.radius;
        if (n > r)
            return null;
        const a = Math.sqrt(r - n),
            o = s - a,
            l = s + a;
        return l < 0 ? null : o < 0 ? this.at(l, t) : this.at(o, t)
    }
    intersectsSphere(e)
    {
        return this.distanceSqToPoint(e.center) <= e.radius * e.radius
    }
    distanceToPlane(e)
    {
        const t = e.normal.dot(this.direction);
        if (t === 0)
            return e.distanceToPoint(this.origin) === 0 ? 0 : null;
        const s = -(this.origin.dot(e.normal) + e.constant) / t;
        return s >= 0 ? s : null
    }
    intersectPlane(e, t)
    {
        const s = this.distanceToPlane(e);
        return s === null ? null : this.at(s, t)
    }
    intersectsPlane(e)
    {
        const t = e.distanceToPoint(this.origin);
        return t === 0 || e.normal.dot(this.direction) * t < 0
    }
    intersectBox(e, t)
    {
        let s,
            n,
            r,
            a,
            o,
            l;
        const c = 1 / this.direction.x,
            h = 1 / this.direction.y,
            d = 1 / this.direction.z,
            u = this.origin;
        return c >= 0 ? (s = (e.min.x - u.x) * c, n = (e.max.x - u.x) * c) : (s = (e.max.x - u.x) * c, n = (e.min.x - u.x) * c), h >= 0 ? (r = (e.min.y - u.y) * h, a = (e.max.y - u.y) * h) : (r = (e.max.y - u.y) * h, a = (e.min.y - u.y) * h), s > a || r > n || ((r > s || isNaN(s)) && (s = r), (a < n || isNaN(n)) && (n = a), d >= 0 ? (o = (e.min.z - u.z) * d, l = (e.max.z - u.z) * d) : (o = (e.max.z - u.z) * d, l = (e.min.z - u.z) * d), s > l || o > n) || ((o > s || s !== s) && (s = o), (l < n || n !== n) && (n = l), n < 0) ? null : this.at(s >= 0 ? s : n, t)
    }
    intersectsBox(e)
    {
        return this.intersectBox(e, mn) !== null
    }
    intersectTriangle(e, t, s, n, r)
    {
        $d.subVectors(t, e),
        Wc.subVectors(s, e),
        ef.crossVectors($d, Wc);
        let a = this.direction.dot(ef),
            o;
        if (a > 0) {
            if (n)
                return null;
            o = 1
        } else if (a < 0)
            o = -1,
            a = -a;
        else
            return null;
        Qn.subVectors(this.origin, e);
        const l = o * this.direction.dot(Wc.crossVectors(Qn, Wc));
        if (l < 0)
            return null;
        const c = o * this.direction.dot($d.cross(Qn));
        if (c < 0 || l + c > a)
            return null;
        const h = -o * Qn.dot(ef);
        return h < 0 ? null : this.at(h / a, r)
    }
    applyMatrix4(e)
    {
        return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this
    }
    equals(e)
    {
        return e.origin.equals(this.origin) && e.direction.equals(this.direction)
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
}
class De {
    constructor(e, t, s, n, r, a, o, l, c, h, d, u, f, p, A, m)
    {
        De.prototype.isMatrix4 = !0,
        this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        e !== void 0 && this.set(e, t, s, n, r, a, o, l, c, h, d, u, f, p, A, m)
    }
    set(e, t, s, n, r, a, o, l, c, h, d, u, f, p, A, m)
    {
        const g = this.elements;
        return g[0] = e, g[4] = t, g[8] = s, g[12] = n, g[1] = r, g[5] = a, g[9] = o, g[13] = l, g[2] = c, g[6] = h, g[10] = d, g[14] = u, g[3] = f, g[7] = p, g[11] = A, g[15] = m, this
    }
    identity()
    {
        return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this
    }
    clone()
    {
        return new De().fromArray(this.elements)
    }
    copy(e)
    {
        const t = this.elements,
            s = e.elements;
        return t[0] = s[0], t[1] = s[1], t[2] = s[2], t[3] = s[3], t[4] = s[4], t[5] = s[5], t[6] = s[6], t[7] = s[7], t[8] = s[8], t[9] = s[9], t[10] = s[10], t[11] = s[11], t[12] = s[12], t[13] = s[13], t[14] = s[14], t[15] = s[15], this
    }
    copyPosition(e)
    {
        const t = this.elements,
            s = e.elements;
        return t[12] = s[12], t[13] = s[13], t[14] = s[14], this
    }
    setFromMatrix3(e)
    {
        const t = e.elements;
        return this.set(t[0], t[3], t[6], 0, t[1], t[4], t[7], 0, t[2], t[5], t[8], 0, 0, 0, 0, 1), this
    }
    extractBasis(e, t, s)
    {
        return e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), s.setFromMatrixColumn(this, 2), this
    }
    makeBasis(e, t, s)
    {
        return this.set(e.x, t.x, s.x, 0, e.y, t.y, s.y, 0, e.z, t.z, s.z, 0, 0, 0, 0, 1), this
    }
    extractRotation(e)
    {
        const t = this.elements,
            s = e.elements,
            n = 1 / ba.setFromMatrixColumn(e, 0).length(),
            r = 1 / ba.setFromMatrixColumn(e, 1).length(),
            a = 1 / ba.setFromMatrixColumn(e, 2).length();
        return t[0] = s[0] * n, t[1] = s[1] * n, t[2] = s[2] * n, t[3] = 0, t[4] = s[4] * r, t[5] = s[5] * r, t[6] = s[6] * r, t[7] = 0, t[8] = s[8] * a, t[9] = s[9] * a, t[10] = s[10] * a, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this
    }
    makeRotationFromEuler(e)
    {
        const t = this.elements,
            s = e.x,
            n = e.y,
            r = e.z,
            a = Math.cos(s),
            o = Math.sin(s),
            l = Math.cos(n),
            c = Math.sin(n),
            h = Math.cos(r),
            d = Math.sin(r);
        if (e.order === "XYZ") {
            const u = a * h,
                f = a * d,
                p = o * h,
                A = o * d;
            t[0] = l * h,
            t[4] = -l * d,
            t[8] = c,
            t[1] = f + p * c,
            t[5] = u - A * c,
            t[9] = -o * l,
            t[2] = A - u * c,
            t[6] = p + f * c,
            t[10] = a * l
        } else if (e.order === "YXZ") {
            const u = l * h,
                f = l * d,
                p = c * h,
                A = c * d;
            t[0] = u + A * o,
            t[4] = p * o - f,
            t[8] = a * c,
            t[1] = a * d,
            t[5] = a * h,
            t[9] = -o,
            t[2] = f * o - p,
            t[6] = A + u * o,
            t[10] = a * l
        } else if (e.order === "ZXY") {
            const u = l * h,
                f = l * d,
                p = c * h,
                A = c * d;
            t[0] = u - A * o,
            t[4] = -a * d,
            t[8] = p + f * o,
            t[1] = f + p * o,
            t[5] = a * h,
            t[9] = A - u * o,
            t[2] = -a * c,
            t[6] = o,
            t[10] = a * l
        } else if (e.order === "ZYX") {
            const u = a * h,
                f = a * d,
                p = o * h,
                A = o * d;
            t[0] = l * h,
            t[4] = p * c - f,
            t[8] = u * c + A,
            t[1] = l * d,
            t[5] = A * c + u,
            t[9] = f * c - p,
            t[2] = -c,
            t[6] = o * l,
            t[10] = a * l
        } else if (e.order === "YZX") {
            const u = a * l,
                f = a * c,
                p = o * l,
                A = o * c;
            t[0] = l * h,
            t[4] = A - u * d,
            t[8] = p * d + f,
            t[1] = d,
            t[5] = a * h,
            t[9] = -o * h,
            t[2] = -c * h,
            t[6] = f * d + p,
            t[10] = u - A * d
        } else if (e.order === "XZY") {
            const u = a * l,
                f = a * c,
                p = o * l,
                A = o * c;
            t[0] = l * h,
            t[4] = -d,
            t[8] = c * h,
            t[1] = u * d + A,
            t[5] = a * h,
            t[9] = f * d - p,
            t[2] = p * d - f,
            t[6] = o * h,
            t[10] = A * d + u
        }
        return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this
    }
    makeRotationFromQuaternion(e)
    {
        return this.compose(t1, e, i1)
    }
    lookAt(e, t, s)
    {
        const n = this.elements;
        return ss.subVectors(e, t), ss.lengthSq() === 0 && (ss.z = 1), ss.normalize(), Gn.crossVectors(s, ss), Gn.lengthSq() === 0 && (Math.abs(s.z) === 1 ? ss.x += 1e-4 : ss.z += 1e-4, ss.normalize(), Gn.crossVectors(s, ss)), Gn.normalize(), Yc.crossVectors(ss, Gn), n[0] = Gn.x, n[4] = Yc.x, n[8] = ss.x, n[1] = Gn.y, n[5] = Yc.y, n[9] = ss.y, n[2] = Gn.z, n[6] = Yc.z, n[10] = ss.z, this
    }
    multiply(e)
    {
        return this.multiplyMatrices(this, e)
    }
    premultiply(e)
    {
        return this.multiplyMatrices(e, this)
    }
    multiplyMatrices(e, t)
    {
        const s = e.elements,
            n = t.elements,
            r = this.elements,
            a = s[0],
            o = s[4],
            l = s[8],
            c = s[12],
            h = s[1],
            d = s[5],
            u = s[9],
            f = s[13],
            p = s[2],
            A = s[6],
            m = s[10],
            g = s[14],
            x = s[3],
            v = s[7],
            y = s[11],
            S = s[15],
            w = n[0],
            C = n[4],
            M = n[8],
            E = n[12],
            _ = n[1],
            I = n[5],
            P = n[9],
            D = n[13],
            L = n[2],
            z = n[6],
            O = n[10],
            K = n[14],
            V = n[3],
            pe = n[7],
            xe = n[11],
            Ae = n[15];
        return r[0] = a * w + o * _ + l * L + c * V, r[4] = a * C + o * I + l * z + c * pe, r[8] = a * M + o * P + l * O + c * xe, r[12] = a * E + o * D + l * K + c * Ae, r[1] = h * w + d * _ + u * L + f * V, r[5] = h * C + d * I + u * z + f * pe, r[9] = h * M + d * P + u * O + f * xe, r[13] = h * E + d * D + u * K + f * Ae, r[2] = p * w + A * _ + m * L + g * V, r[6] = p * C + A * I + m * z + g * pe, r[10] = p * M + A * P + m * O + g * xe, r[14] = p * E + A * D + m * K + g * Ae, r[3] = x * w + v * _ + y * L + S * V, r[7] = x * C + v * I + y * z + S * pe, r[11] = x * M + v * P + y * O + S * xe, r[15] = x * E + v * D + y * K + S * Ae, this
    }
    multiplyScalar(e)
    {
        const t = this.elements;
        return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this
    }
    determinant()
    {
        const e = this.elements,
            t = e[0],
            s = e[4],
            n = e[8],
            r = e[12],
            a = e[1],
            o = e[5],
            l = e[9],
            c = e[13],
            h = e[2],
            d = e[6],
            u = e[10],
            f = e[14],
            p = e[3],
            A = e[7],
            m = e[11],
            g = e[15];
        return p * (+r * l * d - n * c * d - r * o * u + s * c * u + n * o * f - s * l * f) + A * (+t * l * f - t * c * u + r * a * u - n * a * f + n * c * h - r * l * h) + m * (+t * c * d - t * o * f - r * a * d + s * a * f + r * o * h - s * c * h) + g * (-n * o * h - t * l * d + t * o * u + n * a * d - s * a * u + s * l * h)
    }
    transpose()
    {
        const e = this.elements;
        let t;
        return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this
    }
    setPosition(e, t, s)
    {
        const n = this.elements;
        return e.isVector3 ? (n[12] = e.x, n[13] = e.y, n[14] = e.z) : (n[12] = e, n[13] = t, n[14] = s), this
    }
    invert()
    {
        const e = this.elements,
            t = e[0],
            s = e[1],
            n = e[2],
            r = e[3],
            a = e[4],
            o = e[5],
            l = e[6],
            c = e[7],
            h = e[8],
            d = e[9],
            u = e[10],
            f = e[11],
            p = e[12],
            A = e[13],
            m = e[14],
            g = e[15],
            x = d * m * c - A * u * c + A * l * f - o * m * f - d * l * g + o * u * g,
            v = p * u * c - h * m * c - p * l * f + a * m * f + h * l * g - a * u * g,
            y = h * A * c - p * d * c + p * o * f - a * A * f - h * o * g + a * d * g,
            S = p * d * l - h * A * l - p * o * u + a * A * u + h * o * m - a * d * m,
            w = t * x + s * v + n * y + r * S;
        if (w === 0)
            return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        const C = 1 / w;
        return e[0] = x * C, e[1] = (A * u * r - d * m * r - A * n * f + s * m * f + d * n * g - s * u * g) * C, e[2] = (o * m * r - A * l * r + A * n * c - s * m * c - o * n * g + s * l * g) * C, e[3] = (d * l * r - o * u * r - d * n * c + s * u * c + o * n * f - s * l * f) * C, e[4] = v * C, e[5] = (h * m * r - p * u * r + p * n * f - t * m * f - h * n * g + t * u * g) * C, e[6] = (p * l * r - a * m * r - p * n * c + t * m * c + a * n * g - t * l * g) * C, e[7] = (a * u * r - h * l * r + h * n * c - t * u * c - a * n * f + t * l * f) * C, e[8] = y * C, e[9] = (p * d * r - h * A * r - p * s * f + t * A * f + h * s * g - t * d * g) * C, e[10] = (a * A * r - p * o * r + p * s * c - t * A * c - a * s * g + t * o * g) * C, e[11] = (h * o * r - a * d * r - h * s * c + t * d * c + a * s * f - t * o * f) * C, e[12] = S * C, e[13] = (h * A * n - p * d * n + p * s * u - t * A * u - h * s * m + t * d * m) * C, e[14] = (p * o * n - a * A * n - p * s * l + t * A * l + a * s * m - t * o * m) * C, e[15] = (a * d * n - h * o * n + h * s * l - t * d * l - a * s * u + t * o * u) * C, this
    }
    scale(e)
    {
        const t = this.elements,
            s = e.x,
            n = e.y,
            r = e.z;
        return t[0] *= s, t[4] *= n, t[8] *= r, t[1] *= s, t[5] *= n, t[9] *= r, t[2] *= s, t[6] *= n, t[10] *= r, t[3] *= s, t[7] *= n, t[11] *= r, this
    }
    getMaxScaleOnAxis()
    {
        const e = this.elements,
            t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2],
            s = e[4] * e[4] + e[5] * e[5] + e[6] * e[6],
            n = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
        return Math.sqrt(Math.max(t, s, n))
    }
    makeTranslation(e, t, s)
    {
        return e.isVector3 ? this.set(1, 0, 0, e.x, 0, 1, 0, e.y, 0, 0, 1, e.z, 0, 0, 0, 1) : this.set(1, 0, 0, e, 0, 1, 0, t, 0, 0, 1, s, 0, 0, 0, 1), this
    }
    makeRotationX(e)
    {
        const t = Math.cos(e),
            s = Math.sin(e);
        return this.set(1, 0, 0, 0, 0, t, -s, 0, 0, s, t, 0, 0, 0, 0, 1), this
    }
    makeRotationY(e)
    {
        const t = Math.cos(e),
            s = Math.sin(e);
        return this.set(t, 0, s, 0, 0, 1, 0, 0, -s, 0, t, 0, 0, 0, 0, 1), this
    }
    makeRotationZ(e)
    {
        const t = Math.cos(e),
            s = Math.sin(e);
        return this.set(t, -s, 0, 0, s, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this
    }
    makeRotationAxis(e, t)
    {
        const s = Math.cos(t),
            n = Math.sin(t),
            r = 1 - s,
            a = e.x,
            o = e.y,
            l = e.z,
            c = r * a,
            h = r * o;
        return this.set(c * a + s, c * o - n * l, c * l + n * o, 0, c * o + n * l, h * o + s, h * l - n * a, 0, c * l - n * o, h * l + n * a, r * l * l + s, 0, 0, 0, 0, 1), this
    }
    makeScale(e, t, s)
    {
        return this.set(e, 0, 0, 0, 0, t, 0, 0, 0, 0, s, 0, 0, 0, 0, 1), this
    }
    makeShear(e, t, s, n, r, a)
    {
        return this.set(1, s, r, 0, e, 1, a, 0, t, n, 1, 0, 0, 0, 0, 1), this
    }
    compose(e, t, s)
    {
        const n = this.elements,
            r = t._x,
            a = t._y,
            o = t._z,
            l = t._w,
            c = r + r,
            h = a + a,
            d = o + o,
            u = r * c,
            f = r * h,
            p = r * d,
            A = a * h,
            m = a * d,
            g = o * d,
            x = l * c,
            v = l * h,
            y = l * d,
            S = s.x,
            w = s.y,
            C = s.z;
        return n[0] = (1 - (A + g)) * S, n[1] = (f + y) * S, n[2] = (p - v) * S, n[3] = 0, n[4] = (f - y) * w, n[5] = (1 - (u + g)) * w, n[6] = (m + x) * w, n[7] = 0, n[8] = (p + v) * C, n[9] = (m - x) * C, n[10] = (1 - (u + A)) * C, n[11] = 0, n[12] = e.x, n[13] = e.y, n[14] = e.z, n[15] = 1, this
    }
    decompose(e, t, s)
    {
        const n = this.elements;
        let r = ba.set(n[0], n[1], n[2]).length();
        const a = ba.set(n[4], n[5], n[6]).length(),
            o = ba.set(n[8], n[9], n[10]).length();
        this.determinant() < 0 && (r = -r),
        e.x = n[12],
        e.y = n[13],
        e.z = n[14],
        Ds.copy(this);
        const c = 1 / r,
            h = 1 / a,
            d = 1 / o;
        return Ds.elements[0] *= c, Ds.elements[1] *= c, Ds.elements[2] *= c, Ds.elements[4] *= h, Ds.elements[5] *= h, Ds.elements[6] *= h, Ds.elements[8] *= d, Ds.elements[9] *= d, Ds.elements[10] *= d, t.setFromRotationMatrix(Ds), s.x = r, s.y = a, s.z = o, this
    }
    makePerspective(e, t, s, n, r, a, o=Tn)
    {
        const l = this.elements,
            c = 2 * r / (t - e),
            h = 2 * r / (s - n),
            d = (t + e) / (t - e),
            u = (s + n) / (s - n);
        let f,
            p;
        if (o === Tn)
            f = -(a + r) / (a - r),
            p = -2 * a * r / (a - r);
        else if (o === Xu)
            f = -a / (a - r),
            p = -a * r / (a - r);
        else
            throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
        return l[0] = c, l[4] = 0, l[8] = d, l[12] = 0, l[1] = 0, l[5] = h, l[9] = u, l[13] = 0, l[2] = 0, l[6] = 0, l[10] = f, l[14] = p, l[3] = 0, l[7] = 0, l[11] = -1, l[15] = 0, this
    }
    makeOrthographic(e, t, s, n, r, a, o=Tn)
    {
        const l = this.elements,
            c = 1 / (t - e),
            h = 1 / (s - n),
            d = 1 / (a - r),
            u = (t + e) * c,
            f = (s + n) * h;
        let p,
            A;
        if (o === Tn)
            p = (a + r) * d,
            A = -2 * d;
        else if (o === Xu)
            p = r * d,
            A = -1 * d;
        else
            throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
        return l[0] = 2 * c, l[4] = 0, l[8] = 0, l[12] = -u, l[1] = 0, l[5] = 2 * h, l[9] = 0, l[13] = -f, l[2] = 0, l[6] = 0, l[10] = A, l[14] = -p, l[3] = 0, l[7] = 0, l[11] = 0, l[15] = 1, this
    }
    equals(e)
    {
        const t = this.elements,
            s = e.elements;
        for (let n = 0; n < 16; n++)
            if (t[n] !== s[n])
                return !1;
        return !0
    }
    fromArray(e, t=0)
    {
        for (let s = 0; s < 16; s++)
            this.elements[s] = e[s + t];
        return this
    }
    toArray(e=[], t=0)
    {
        const s = this.elements;
        return e[t] = s[0], e[t + 1] = s[1], e[t + 2] = s[2], e[t + 3] = s[3], e[t + 4] = s[4], e[t + 5] = s[5], e[t + 6] = s[6], e[t + 7] = s[7], e[t + 8] = s[8], e[t + 9] = s[9], e[t + 10] = s[10], e[t + 11] = s[11], e[t + 12] = s[12], e[t + 13] = s[13], e[t + 14] = s[14], e[t + 15] = s[15], e
    }
}
const ba = new b,
    Ds = new De,
    t1 = new b(0, 0, 0),
    i1 = new b(1, 1, 1),
    Gn = new b,
    Yc = new b,
    ss = new b,
    mv = new De,
    Av = new Vi;
class ln {
    constructor(e=0, t=0, s=0, n=ln.DEFAULT_ORDER)
    {
        this.isEuler = !0,
        this._x = e,
        this._y = t,
        this._z = s,
        this._order = n
    }
    get x()
    {
        return this._x
    }
    set x(e)
    {
        this._x = e,
        this._onChangeCallback()
    }
    get y()
    {
        return this._y
    }
    set y(e)
    {
        this._y = e,
        this._onChangeCallback()
    }
    get z()
    {
        return this._z
    }
    set z(e)
    {
        this._z = e,
        this._onChangeCallback()
    }
    get order()
    {
        return this._order
    }
    set order(e)
    {
        this._order = e,
        this._onChangeCallback()
    }
    set(e, t, s, n=this._order)
    {
        return this._x = e, this._y = t, this._z = s, this._order = n, this._onChangeCallback(), this
    }
    clone()
    {
        return new this.constructor(this._x, this._y, this._z, this._order)
    }
    copy(e)
    {
        return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this
    }
    setFromRotationMatrix(e, t=this._order, s=!0)
    {
        const n = e.elements,
            r = n[0],
            a = n[4],
            o = n[8],
            l = n[1],
            c = n[5],
            h = n[9],
            d = n[2],
            u = n[6],
            f = n[10];
        switch (t) {
        case "XYZ":
            this._y = Math.asin(hi(o, -1, 1)),
            Math.abs(o) < .9999999 ? (this._x = Math.atan2(-h, f), this._z = Math.atan2(-a, r)) : (this._x = Math.atan2(u, c), this._z = 0);
            break;
        case "YXZ":
            this._x = Math.asin(-hi(h, -1, 1)),
            Math.abs(h) < .9999999 ? (this._y = Math.atan2(o, f), this._z = Math.atan2(l, c)) : (this._y = Math.atan2(-d, r), this._z = 0);
            break;
        case "ZXY":
            this._x = Math.asin(hi(u, -1, 1)),
            Math.abs(u) < .9999999 ? (this._y = Math.atan2(-d, f), this._z = Math.atan2(-a, c)) : (this._y = 0, this._z = Math.atan2(l, r));
            break;
        case "ZYX":
            this._y = Math.asin(-hi(d, -1, 1)),
            Math.abs(d) < .9999999 ? (this._x = Math.atan2(u, f), this._z = Math.atan2(l, r)) : (this._x = 0, this._z = Math.atan2(-a, c));
            break;
        case "YZX":
            this._z = Math.asin(hi(l, -1, 1)),
            Math.abs(l) < .9999999 ? (this._x = Math.atan2(-h, c), this._y = Math.atan2(-d, r)) : (this._x = 0, this._y = Math.atan2(o, f));
            break;
        case "XZY":
            this._z = Math.asin(-hi(a, -1, 1)),
            Math.abs(a) < .9999999 ? (this._x = Math.atan2(u, c), this._y = Math.atan2(o, r)) : (this._x = Math.atan2(-h, f), this._y = 0);
            break;
        default:
            console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + t)
        }
        return this._order = t, s === !0 && this._onChangeCallback(), this
    }
    setFromQuaternion(e, t, s)
    {
        return mv.makeRotationFromQuaternion(e), this.setFromRotationMatrix(mv, t, s)
    }
    setFromVector3(e, t=this._order)
    {
        return this.set(e.x, e.y, e.z, t)
    }
    reorder(e)
    {
        return Av.setFromEuler(this), this.setFromQuaternion(Av, e)
    }
    equals(e)
    {
        return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order
    }
    fromArray(e)
    {
        return this._x = e[0], this._y = e[1], this._z = e[2], e[3] !== void 0 && (this._order = e[3]), this._onChangeCallback(), this
    }
    toArray(e=[], t=0)
    {
        return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e
    }
    _onChange(e)
    {
        return this._onChangeCallback = e, this
    }
    _onChangeCallback() {}
    *[Symbol.iterator]()
    {
        yield this._x,
        yield this._y,
        yield this._z,
        yield this._order
    }
}
ln.DEFAULT_ORDER = "XYZ";
class RA {
    constructor()
    {
        this.mask = 1
    }
    set(e)
    {
        this.mask = (1 << e | 0) >>> 0
    }
    enable(e)
    {
        this.mask |= 1 << e | 0
    }
    enableAll()
    {
        this.mask = -1
    }
    toggle(e)
    {
        this.mask ^= 1 << e | 0
    }
    disable(e)
    {
        this.mask &= ~(1 << e | 0)
    }
    disableAll()
    {
        this.mask = 0
    }
    test(e)
    {
        return (this.mask & e.mask) !== 0
    }
    isEnabled(e)
    {
        return (this.mask & (1 << e | 0)) !== 0
    }
}
let s1 = 0;
const gv = new b,
    Ta = new Vi,
    An = new De,
    qc = new b,
    il = new b,
    n1 = new b,
    r1 = new Vi,
    vv = new b(1, 0, 0),
    xv = new b(0, 1, 0),
    yv = new b(0, 0, 1),
    _v = {
        type: "added"
    },
    a1 = {
        type: "removed"
    },
    Ia = {
        type: "childadded",
        child: null
    },
    tf = {
        type: "childremoved",
        child: null
    };
class It extends hn {
    constructor()
    {
        super(),
        this.isObject3D = !0,
        Object.defineProperty(this, "id", {
            value: s1++
        }),
        this.uuid = Hs(),
        this.name = "",
        this.type = "Object3D",
        this.parent = null,
        this.children = [],
        this.up = It.DEFAULT_UP.clone();
        const e = new b,
            t = new ln,
            s = new Vi,
            n = new b(1, 1, 1);
        function r() {
            s.setFromEuler(t, !1)
        }
        function a() {
            t.setFromQuaternion(s, void 0, !1)
        }
        t._onChange(r),
        s._onChange(a),
        Object.defineProperties(this, {
            position: {
                configurable: !0,
                enumerable: !0,
                value: e
            },
            rotation: {
                configurable: !0,
                enumerable: !0,
                value: t
            },
            quaternion: {
                configurable: !0,
                enumerable: !0,
                value: s
            },
            scale: {
                configurable: !0,
                enumerable: !0,
                value: n
            },
            modelViewMatrix: {
                value: new De
            },
            normalMatrix: {
                value: new at
            }
        }),
        this.matrix = new De,
        this.matrixWorld = new De,
        this.matrixAutoUpdate = It.DEFAULT_MATRIX_AUTO_UPDATE,
        this.matrixWorldAutoUpdate = It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,
        this.matrixWorldNeedsUpdate = !1,
        this.layers = new RA,
        this.visible = !0,
        this.castShadow = !1,
        this.receiveShadow = !1,
        this.frustumCulled = !0,
        this.renderOrder = 0,
        this.animations = [],
        this.userData = {}
    }
    onBeforeShadow() {}
    onAfterShadow() {}
    onBeforeRender() {}
    onAfterRender() {}
    applyMatrix4(e)
    {
        this.matrixAutoUpdate && this.updateMatrix(),
        this.matrix.premultiply(e),
        this.matrix.decompose(this.position, this.quaternion, this.scale)
    }
    applyQuaternion(e)
    {
        return this.quaternion.premultiply(e), this
    }
    setRotationFromAxisAngle(e, t)
    {
        this.quaternion.setFromAxisAngle(e, t)
    }
    setRotationFromEuler(e)
    {
        this.quaternion.setFromEuler(e, !0)
    }
    setRotationFromMatrix(e)
    {
        this.quaternion.setFromRotationMatrix(e)
    }
    setRotationFromQuaternion(e)
    {
        this.quaternion.copy(e)
    }
    rotateOnAxis(e, t)
    {
        return Ta.setFromAxisAngle(e, t), this.quaternion.multiply(Ta), this
    }
    rotateOnWorldAxis(e, t)
    {
        return Ta.setFromAxisAngle(e, t), this.quaternion.premultiply(Ta), this
    }
    rotateX(e)
    {
        return this.rotateOnAxis(vv, e)
    }
    rotateY(e)
    {
        return this.rotateOnAxis(xv, e)
    }
    rotateZ(e)
    {
        return this.rotateOnAxis(yv, e)
    }
    translateOnAxis(e, t)
    {
        return gv.copy(e).applyQuaternion(this.quaternion), this.position.add(gv.multiplyScalar(t)), this
    }
    translateX(e)
    {
        return this.translateOnAxis(vv, e)
    }
    translateY(e)
    {
        return this.translateOnAxis(xv, e)
    }
    translateZ(e)
    {
        return this.translateOnAxis(yv, e)
    }
    localToWorld(e)
    {
        return this.updateWorldMatrix(!0, !1), e.applyMatrix4(this.matrixWorld)
    }
    worldToLocal(e)
    {
        return this.updateWorldMatrix(!0, !1), e.applyMatrix4(An.copy(this.matrixWorld).invert())
    }
    lookAt(e, t, s)
    {
        e.isVector3 ? qc.copy(e) : qc.set(e, t, s);
        const n = this.parent;
        this.updateWorldMatrix(!0, !1),
        il.setFromMatrixPosition(this.matrixWorld),
        this.isCamera || this.isLight ? An.lookAt(il, qc, this.up) : An.lookAt(qc, il, this.up),
        this.quaternion.setFromRotationMatrix(An),
        n && (An.extractRotation(n.matrixWorld), Ta.setFromRotationMatrix(An), this.quaternion.premultiply(Ta.invert()))
    }
    add(e)
    {
        if (arguments.length > 1) {
            for (let t = 0; t < arguments.length; t++)
                this.add(arguments[t]);
            return this
        }
        return e === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (e.removeFromParent(), e.parent = this, this.children.push(e), e.dispatchEvent(_v), Ia.child = e, this.dispatchEvent(Ia), Ia.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", e), this)
    }
    remove(e)
    {
        if (arguments.length > 1) {
            for (let s = 0; s < arguments.length; s++)
                this.remove(arguments[s]);
            return this
        }
        const t = this.children.indexOf(e);
        return t !== -1 && (e.parent = null, this.children.splice(t, 1), e.dispatchEvent(a1), tf.child = e, this.dispatchEvent(tf), tf.child = null), this
    }
    removeFromParent()
    {
        const e = this.parent;
        return e !== null && e.remove(this), this
    }
    clear()
    {
        return this.remove(...this.children)
    }
    attach(e)
    {
        return this.updateWorldMatrix(!0, !1), An.copy(this.matrixWorld).invert(), e.parent !== null && (e.parent.updateWorldMatrix(!0, !1), An.multiply(e.parent.matrixWorld)), e.applyMatrix4(An), e.removeFromParent(), e.parent = this, this.children.push(e), e.updateWorldMatrix(!1, !0), e.dispatchEvent(_v), Ia.child = e, this.dispatchEvent(Ia), Ia.child = null, this
    }
    getObjectById(e)
    {
        return this.getObjectByProperty("id", e)
    }
    getObjectByName(e)
    {
        return this.getObjectByProperty("name", e)
    }
    getObjectByProperty(e, t)
    {
        if (this[e] === t)
            return this;
        for (let s = 0, n = this.children.length; s < n; s++) {
            const a = this.children[s].getObjectByProperty(e, t);
            if (a !== void 0)
                return a
        }
    }
    getObjectsByProperty(e, t, s=[])
    {
        this[e] === t && s.push(this);
        const n = this.children;
        for (let r = 0, a = n.length; r < a; r++)
            n[r].getObjectsByProperty(e, t, s);
        return s
    }
    getWorldPosition(e)
    {
        return this.updateWorldMatrix(!0, !1), e.setFromMatrixPosition(this.matrixWorld)
    }
    getWorldQuaternion(e)
    {
        return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(il, e, n1), e
    }
    getWorldScale(e)
    {
        return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(il, r1, e), e
    }
    getWorldDirection(e)
    {
        this.updateWorldMatrix(!0, !1);
        const t = this.matrixWorld.elements;
        return e.set(t[8], t[9], t[10]).normalize()
    }
    raycast() {}
    traverse(e)
    {
        e(this);
        const t = this.children;
        for (let s = 0, n = t.length; s < n; s++)
            t[s].traverse(e)
    }
    traverseVisible(e)
    {
        if (this.visible === !1)
            return;
        e(this);
        const t = this.children;
        for (let s = 0, n = t.length; s < n; s++)
            t[s].traverseVisible(e)
    }
    traverseAncestors(e)
    {
        const t = this.parent;
        t !== null && (e(t), t.traverseAncestors(e))
    }
    updateMatrix()
    {
        this.matrix.compose(this.position, this.quaternion, this.scale),
        this.matrixWorldNeedsUpdate = !0
    }
    updateMatrixWorld(e)
    {
        this.matrixAutoUpdate && this.updateMatrix(),
        (this.matrixWorldNeedsUpdate || e) && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), this.matrixWorldNeedsUpdate = !1, e = !0);
        const t = this.children;
        for (let s = 0, n = t.length; s < n; s++) {
            const r = t[s];
            (r.matrixWorldAutoUpdate === !0 || e === !0) && r.updateMatrixWorld(e)
        }
    }
    updateWorldMatrix(e, t)
    {
        const s = this.parent;
        if (e === !0 && s !== null && s.matrixWorldAutoUpdate === !0 && s.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), t === !0) {
            const n = this.children;
            for (let r = 0, a = n.length; r < a; r++) {
                const o = n[r];
                o.matrixWorldAutoUpdate === !0 && o.updateWorldMatrix(!1, !0)
            }
        }
    }
    toJSON(e)
    {
        const t = e === void 0 || typeof e == "string",
            s = {};
        t && (e = {
            geometries: {},
            materials: {},
            textures: {},
            images: {},
            shapes: {},
            skeletons: {},
            animations: {},
            nodes: {}
        }, s.metadata = {
            version: 4.6,
            type: "Object",
            generator: "Object3D.toJSON"
        });
        const n = {};
        n.uuid = this.uuid,
        n.type = this.type,
        this.name !== "" && (n.name = this.name),
        this.castShadow === !0 && (n.castShadow = !0),
        this.receiveShadow === !0 && (n.receiveShadow = !0),
        this.visible === !1 && (n.visible = !1),
        this.frustumCulled === !1 && (n.frustumCulled = !1),
        this.renderOrder !== 0 && (n.renderOrder = this.renderOrder),
        Object.keys(this.userData).length > 0 && (n.userData = this.userData),
        n.layers = this.layers.mask,
        n.matrix = this.matrix.toArray(),
        n.up = this.up.toArray(),
        this.matrixAutoUpdate === !1 && (n.matrixAutoUpdate = !1),
        this.isInstancedMesh && (n.type = "InstancedMesh", n.count = this.count, n.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (n.instanceColor = this.instanceColor.toJSON())),
        this.isBatchedMesh && (n.type = "BatchedMesh", n.perObjectFrustumCulled = this.perObjectFrustumCulled, n.sortObjects = this.sortObjects, n.drawRanges = this._drawRanges, n.reservedRanges = this._reservedRanges, n.visibility = this._visibility, n.active = this._active, n.bounds = this._bounds.map(o => ({
            boxInitialized: o.boxInitialized,
            boxMin: o.box.min.toArray(),
            boxMax: o.box.max.toArray(),
            sphereInitialized: o.sphereInitialized,
            sphereRadius: o.sphere.radius,
            sphereCenter: o.sphere.center.toArray()
        })), n.maxGeometryCount = this._maxGeometryCount, n.maxVertexCount = this._maxVertexCount, n.maxIndexCount = this._maxIndexCount, n.geometryInitialized = this._geometryInitialized, n.geometryCount = this._geometryCount, n.matricesTexture = this._matricesTexture.toJSON(e), this._colorsTexture !== null && (n.colorsTexture = this._colorsTexture.toJSON(e)), this.boundingSphere !== null && (n.boundingSphere = {
            center: n.boundingSphere.center.toArray(),
            radius: n.boundingSphere.radius
        }), this.boundingBox !== null && (n.boundingBox = {
            min: n.boundingBox.min.toArray(),
            max: n.boundingBox.max.toArray()
        }));
        function r(o, l) {
            return o[l.uuid] === void 0 && (o[l.uuid] = l.toJSON(e)), l.uuid
        }
        if (this.isScene)
            this.background && (this.background.isColor ? n.background = this.background.toJSON() : this.background.isTexture && (n.background = this.background.toJSON(e).uuid)),
            this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (n.environment = this.environment.toJSON(e).uuid);
        else if (this.isMesh || this.isLine || this.isPoints) {
            n.geometry = r(e.geometries, this.geometry);
            const o = this.geometry.parameters;
            if (o !== void 0 && o.shapes !== void 0) {
                const l = o.shapes;
                if (Array.isArray(l))
                    for (let c = 0, h = l.length; c < h; c++) {
                        const d = l[c];
                        r(e.shapes, d)
                    }
                else
                    r(e.shapes, l)
            }
        }
        if (this.isSkinnedMesh && (n.bindMode = this.bindMode, n.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (r(e.skeletons, this.skeleton), n.skeleton = this.skeleton.uuid)), this.material !== void 0)
            if (Array.isArray(this.material)) {
                const o = [];
                for (let l = 0, c = this.material.length; l < c; l++)
                    o.push(r(e.materials, this.material[l]));
                n.material = o
            } else
                n.material = r(e.materials, this.material);
        if (this.children.length > 0) {
            n.children = [];
            for (let o = 0; o < this.children.length; o++)
                n.children.push(this.children[o].toJSON(e).object)
        }
        if (this.animations.length > 0) {
            n.animations = [];
            for (let o = 0; o < this.animations.length; o++) {
                const l = this.animations[o];
                n.animations.push(r(e.animations, l))
            }
        }
        if (t) {
            const o = a(e.geometries),
                l = a(e.materials),
                c = a(e.textures),
                h = a(e.images),
                d = a(e.shapes),
                u = a(e.skeletons),
                f = a(e.animations),
                p = a(e.nodes);
            o.length > 0 && (s.geometries = o),
            l.length > 0 && (s.materials = l),
            c.length > 0 && (s.textures = c),
            h.length > 0 && (s.images = h),
            d.length > 0 && (s.shapes = d),
            u.length > 0 && (s.skeletons = u),
            f.length > 0 && (s.animations = f),
            p.length > 0 && (s.nodes = p)
        }
        return s.object = n, s;
        function a(o) {
            const l = [];
            for (const c in o) {
                const h = o[c];
                delete h.metadata,
                l.push(h)
            }
            return l
        }
    }
    clone(e)
    {
        return new this.constructor().copy(this, e)
    }
    copy(e, t=!0)
    {
        if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), t === !0)
            for (let s = 0; s < e.children.length; s++) {
                const n = e.children[s];
                this.add(n.clone())
            }
        return this
    }
}
It.DEFAULT_UP = new b(0, 1, 0);
It.DEFAULT_MATRIX_AUTO_UPDATE = !0;
It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
const Rs = new b,
    gn = new b,
    sf = new b,
    vn = new b,
    Ba = new b,
    Pa = new b,
    wv = new b,
    nf = new b,
    rf = new b,
    af = new b;
class wi {
    constructor(e=new b, t=new b, s=new b)
    {
        this.a = e,
        this.b = t,
        this.c = s
    }
    static getNormal(e, t, s, n)
    {
        n.subVectors(s, t),
        Rs.subVectors(e, t),
        n.cross(Rs);
        const r = n.lengthSq();
        return r > 0 ? n.multiplyScalar(1 / Math.sqrt(r)) : n.set(0, 0, 0)
    }
    static getBarycoord(e, t, s, n, r)
    {
        Rs.subVectors(n, t),
        gn.subVectors(s, t),
        sf.subVectors(e, t);
        const a = Rs.dot(Rs),
            o = Rs.dot(gn),
            l = Rs.dot(sf),
            c = gn.dot(gn),
            h = gn.dot(sf),
            d = a * c - o * o;
        if (d === 0)
            return r.set(0, 0, 0), null;
        const u = 1 / d,
            f = (c * l - o * h) * u,
            p = (a * h - o * l) * u;
        return r.set(1 - f - p, p, f)
    }
    static containsPoint(e, t, s, n)
    {
        return this.getBarycoord(e, t, s, n, vn) === null ? !1 : vn.x >= 0 && vn.y >= 0 && vn.x + vn.y <= 1
    }
    static getInterpolation(e, t, s, n, r, a, o, l)
    {
        return this.getBarycoord(e, t, s, n, vn) === null ? (l.x = 0, l.y = 0, "z" in l && (l.z = 0), "w" in l && (l.w = 0), null) : (l.setScalar(0), l.addScaledVector(r, vn.x), l.addScaledVector(a, vn.y), l.addScaledVector(o, vn.z), l)
    }
    static isFrontFacing(e, t, s, n)
    {
        return Rs.subVectors(s, t), gn.subVectors(e, t), Rs.cross(gn).dot(n) < 0
    }
    set(e, t, s)
    {
        return this.a.copy(e), this.b.copy(t), this.c.copy(s), this
    }
    setFromPointsAndIndices(e, t, s, n)
    {
        return this.a.copy(e[t]), this.b.copy(e[s]), this.c.copy(e[n]), this
    }
    setFromAttributeAndIndices(e, t, s, n)
    {
        return this.a.fromBufferAttribute(e, t), this.b.fromBufferAttribute(e, s), this.c.fromBufferAttribute(e, n), this
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
    copy(e)
    {
        return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this
    }
    getArea()
    {
        return Rs.subVectors(this.c, this.b), gn.subVectors(this.a, this.b), Rs.cross(gn).length() * .5
    }
    getMidpoint(e)
    {
        return e.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3)
    }
    getNormal(e)
    {
        return wi.getNormal(this.a, this.b, this.c, e)
    }
    getPlane(e)
    {
        return e.setFromCoplanarPoints(this.a, this.b, this.c)
    }
    getBarycoord(e, t)
    {
        return wi.getBarycoord(e, this.a, this.b, this.c, t)
    }
    getInterpolation(e, t, s, n, r)
    {
        return wi.getInterpolation(e, this.a, this.b, this.c, t, s, n, r)
    }
    containsPoint(e)
    {
        return wi.containsPoint(e, this.a, this.b, this.c)
    }
    isFrontFacing(e)
    {
        return wi.isFrontFacing(this.a, this.b, this.c, e)
    }
    intersectsBox(e)
    {
        return e.intersectsTriangle(this)
    }
    closestPointToPoint(e, t)
    {
        const s = this.a,
            n = this.b,
            r = this.c;
        let a,
            o;
        Ba.subVectors(n, s),
        Pa.subVectors(r, s),
        nf.subVectors(e, s);
        const l = Ba.dot(nf),
            c = Pa.dot(nf);
        if (l <= 0 && c <= 0)
            return t.copy(s);
        rf.subVectors(e, n);
        const h = Ba.dot(rf),
            d = Pa.dot(rf);
        if (h >= 0 && d <= h)
            return t.copy(n);
        const u = l * d - h * c;
        if (u <= 0 && l >= 0 && h <= 0)
            return a = l / (l - h), t.copy(s).addScaledVector(Ba, a);
        af.subVectors(e, r);
        const f = Ba.dot(af),
            p = Pa.dot(af);
        if (p >= 0 && f <= p)
            return t.copy(r);
        const A = f * c - l * p;
        if (A <= 0 && c >= 0 && p <= 0)
            return o = c / (c - p), t.copy(s).addScaledVector(Pa, o);
        const m = h * p - f * d;
        if (m <= 0 && d - h >= 0 && f - p >= 0)
            return wv.subVectors(r, n), o = (d - h) / (d - h + (f - p)), t.copy(n).addScaledVector(wv, o);
        const g = 1 / (m + A + u);
        return a = A * g, o = u * g, t.copy(s).addScaledVector(Ba, a).addScaledVector(Pa, o)
    }
    equals(e)
    {
        return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c)
    }
}
const Iy = {
        aliceblue: 15792383,
        antiquewhite: 16444375,
        aqua: 65535,
        aquamarine: 8388564,
        azure: 15794175,
        beige: 16119260,
        bisque: 16770244,
        black: 0,
        blanchedalmond: 16772045,
        blue: 255,
        blueviolet: 9055202,
        brown: 10824234,
        burlywood: 14596231,
        cadetblue: 6266528,
        chartreuse: 8388352,
        chocolate: 13789470,
        coral: 16744272,
        cornflowerblue: 6591981,
        cornsilk: 16775388,
        crimson: 14423100,
        cyan: 65535,
        darkblue: 139,
        darkcyan: 35723,
        darkgoldenrod: 12092939,
        darkgray: 11119017,
        darkgreen: 25600,
        darkgrey: 11119017,
        darkkhaki: 12433259,
        darkmagenta: 9109643,
        darkolivegreen: 5597999,
        darkorange: 16747520,
        darkorchid: 10040012,
        darkred: 9109504,
        darksalmon: 15308410,
        darkseagreen: 9419919,
        darkslateblue: 4734347,
        darkslategray: 3100495,
        darkslategrey: 3100495,
        darkturquoise: 52945,
        darkviolet: 9699539,
        deeppink: 16716947,
        deepskyblue: 49151,
        dimgray: 6908265,
        dimgrey: 6908265,
        dodgerblue: 2003199,
        firebrick: 11674146,
        floralwhite: 16775920,
        forestgreen: 2263842,
        fuchsia: 16711935,
        gainsboro: 14474460,
        ghostwhite: 16316671,
        gold: 16766720,
        goldenrod: 14329120,
        gray: 8421504,
        green: 32768,
        greenyellow: 11403055,
        grey: 8421504,
        honeydew: 15794160,
        hotpink: 16738740,
        indianred: 13458524,
        indigo: 4915330,
        ivory: 16777200,
        khaki: 15787660,
        lavender: 15132410,
        lavenderblush: 16773365,
        lawngreen: 8190976,
        lemonchiffon: 16775885,
        lightblue: 11393254,
        lightcoral: 15761536,
        lightcyan: 14745599,
        lightgoldenrodyellow: 16448210,
        lightgray: 13882323,
        lightgreen: 9498256,
        lightgrey: 13882323,
        lightpink: 16758465,
        lightsalmon: 16752762,
        lightseagreen: 2142890,
        lightskyblue: 8900346,
        lightslategray: 7833753,
        lightslategrey: 7833753,
        lightsteelblue: 11584734,
        lightyellow: 16777184,
        lime: 65280,
        limegreen: 3329330,
        linen: 16445670,
        magenta: 16711935,
        maroon: 8388608,
        mediumaquamarine: 6737322,
        mediumblue: 205,
        mediumorchid: 12211667,
        mediumpurple: 9662683,
        mediumseagreen: 3978097,
        mediumslateblue: 8087790,
        mediumspringgreen: 64154,
        mediumturquoise: 4772300,
        mediumvioletred: 13047173,
        midnightblue: 1644912,
        mintcream: 16121850,
        mistyrose: 16770273,
        moccasin: 16770229,
        navajowhite: 16768685,
        navy: 128,
        oldlace: 16643558,
        olive: 8421376,
        olivedrab: 7048739,
        orange: 16753920,
        orangered: 16729344,
        orchid: 14315734,
        palegoldenrod: 15657130,
        palegreen: 10025880,
        paleturquoise: 11529966,
        palevioletred: 14381203,
        papayawhip: 16773077,
        peachpuff: 16767673,
        peru: 13468991,
        pink: 16761035,
        plum: 14524637,
        powderblue: 11591910,
        purple: 8388736,
        rebeccapurple: 6697881,
        red: 16711680,
        rosybrown: 12357519,
        royalblue: 4286945,
        saddlebrown: 9127187,
        salmon: 16416882,
        sandybrown: 16032864,
        seagreen: 3050327,
        seashell: 16774638,
        sienna: 10506797,
        silver: 12632256,
        skyblue: 8900331,
        slateblue: 6970061,
        slategray: 7372944,
        slategrey: 7372944,
        snow: 16775930,
        springgreen: 65407,
        steelblue: 4620980,
        tan: 13808780,
        teal: 32896,
        thistle: 14204888,
        tomato: 16737095,
        turquoise: 4251856,
        violet: 15631086,
        wheat: 16113331,
        white: 16777215,
        whitesmoke: 16119285,
        yellow: 16776960,
        yellowgreen: 10145074
    },
    Hn = {
        h: 0,
        s: 0,
        l: 0
    },
    Xc = {
        h: 0,
        s: 0,
        l: 0
    };
function of(i, e, t) {
    return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? i + (e - i) * 6 * t : t < 1 / 2 ? e : t < 2 / 3 ? i + (e - i) * 6 * (2 / 3 - t) : i
}
class Z {
    constructor(e, t, s)
    {
        return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, s)
    }
    set(e, t, s)
    {
        if (t === void 0 && s === void 0) {
            const n = e;
            n && n.isColor ? this.copy(n) : typeof n == "number" ? this.setHex(n) : typeof n == "string" && this.setStyle(n)
        } else
            this.setRGB(e, t, s);
        return this
    }
    setScalar(e)
    {
        return this.r = e, this.g = e, this.b = e, this
    }
    setHex(e, t=Ve)
    {
        return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, mt.toWorkingColorSpace(this, t), this
    }
    setRGB(e, t, s, n=mt.workingColorSpace)
    {
        return this.r = e, this.g = t, this.b = s, mt.toWorkingColorSpace(this, n), this
    }
    setHSL(e, t, s, n=mt.workingColorSpace)
    {
        if (e = BA(e, 1), t = hi(t, 0, 1), s = hi(s, 0, 1), t === 0)
            this.r = this.g = this.b = s;
        else {
            const r = s <= .5 ? s * (1 + t) : s + t - s * t,
                a = 2 * s - r;
            this.r = of(a, r, e + 1 / 3),
            this.g = of(a, r, e),
            this.b = of(a, r, e - 1 / 3)
        }
        return mt.toWorkingColorSpace(this, n), this
    }
    setStyle(e, t=Ve)
    {
        function s(r) {
            r !== void 0 && parseFloat(r) < 1 && console.warn("THREE.Color: Alpha component of " + e + " will be ignored.")
        }
        let n;
        if (n = /^(\w+)\(([^\)]*)\)/.exec(e)) {
            let r;
            const a = n[1],
                o = n[2];
            switch (a) {
            case "rgb":
            case "rgba":
                if (r = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
                    return s(r[4]), this.setRGB(Math.min(255, parseInt(r[1], 10)) / 255, Math.min(255, parseInt(r[2], 10)) / 255, Math.min(255, parseInt(r[3], 10)) / 255, t);
                if (r = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
                    return s(r[4]), this.setRGB(Math.min(100, parseInt(r[1], 10)) / 100, Math.min(100, parseInt(r[2], 10)) / 100, Math.min(100, parseInt(r[3], 10)) / 100, t);
                break;
            case "hsl":
            case "hsla":
                if (r = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
                    return s(r[4]), this.setHSL(parseFloat(r[1]) / 360, parseFloat(r[2]) / 100, parseFloat(r[3]) / 100, t);
                break;
            default:
                console.warn("THREE.Color: Unknown color model " + e)
            }
        } else if (n = /^\#([A-Fa-f\d]+)$/.exec(e)) {
            const r = n[1],
                a = r.length;
            if (a === 3)
                return this.setRGB(parseInt(r.charAt(0), 16) / 15, parseInt(r.charAt(1), 16) / 15, parseInt(r.charAt(2), 16) / 15, t);
            if (a === 6)
                return this.setHex(parseInt(r, 16), t);
            console.warn("THREE.Color: Invalid hex color " + e)
        } else if (e && e.length > 0)
            return this.setColorName(e, t);
        return this
    }
    setColorName(e, t=Ve)
    {
        const s = Iy[e.toLowerCase()];
        return s !== void 0 ? this.setHex(s, t) : console.warn("THREE.Color: Unknown color " + e), this
    }
    clone()
    {
        return new this.constructor(this.r, this.g, this.b)
    }
    copy(e)
    {
        return this.r = e.r, this.g = e.g, this.b = e.b, this
    }
    copySRGBToLinear(e)
    {
        return this.r = Eo(e.r), this.g = Eo(e.g), this.b = Eo(e.b), this
    }
    copyLinearToSRGB(e)
    {
        return this.r = qd(e.r), this.g = qd(e.g), this.b = qd(e.b), this
    }
    convertSRGBToLinear()
    {
        return this.copySRGBToLinear(this), this
    }
    convertLinearToSRGB()
    {
        return this.copyLinearToSRGB(this), this
    }
    getHex(e=Ve)
    {
        return mt.fromWorkingColorSpace(Ii.copy(this), e), Math.round(hi(Ii.r * 255, 0, 255)) * 65536 + Math.round(hi(Ii.g * 255, 0, 255)) * 256 + Math.round(hi(Ii.b * 255, 0, 255))
    }
    getHexString(e=Ve)
    {
        return ("000000" + this.getHex(e).toString(16)).slice(-6)
    }
    getHSL(e, t=mt.workingColorSpace)
    {
        mt.fromWorkingColorSpace(Ii.copy(this), t);
        const s = Ii.r,
            n = Ii.g,
            r = Ii.b,
            a = Math.max(s, n, r),
            o = Math.min(s, n, r);
        let l,
            c;
        const h = (o + a) / 2;
        if (o === a)
            l = 0,
            c = 0;
        else {
            const d = a - o;
            switch (c = h <= .5 ? d / (a + o) : d / (2 - a - o), a) {
            case s:
                l = (n - r) / d + (n < r ? 6 : 0);
                break;
            case n:
                l = (r - s) / d + 2;
                break;
            case r:
                l = (s - n) / d + 4;
                break
            }
            l /= 6
        }
        return e.h = l, e.s = c, e.l = h, e
    }
    getRGB(e, t=mt.workingColorSpace)
    {
        return mt.fromWorkingColorSpace(Ii.copy(this), t), e.r = Ii.r, e.g = Ii.g, e.b = Ii.b, e
    }
    getStyle(e=Ve)
    {
        mt.fromWorkingColorSpace(Ii.copy(this), e);
        const t = Ii.r,
            s = Ii.g,
            n = Ii.b;
        return e !== Ve ? `color(${e} ${t.toFixed(3)} ${s.toFixed(3)} ${n.toFixed(3)})` : `rgb(${Math.round(t * 255)},${Math.round(s * 255)},${Math.round(n * 255)})`
    }
    offsetHSL(e, t, s)
    {
        return this.getHSL(Hn), this.setHSL(Hn.h + e, Hn.s + t, Hn.l + s)
    }
    add(e)
    {
        return this.r += e.r, this.g += e.g, this.b += e.b, this
    }
    addColors(e, t)
    {
        return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this
    }
    addScalar(e)
    {
        return this.r += e, this.g += e, this.b += e, this
    }
    sub(e)
    {
        return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this
    }
    multiply(e)
    {
        return this.r *= e.r, this.g *= e.g, this.b *= e.b, this
    }
    multiplyScalar(e)
    {
        return this.r *= e, this.g *= e, this.b *= e, this
    }
    lerp(e, t)
    {
        return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this
    }
    lerpColors(e, t, s)
    {
        return this.r = e.r + (t.r - e.r) * s, this.g = e.g + (t.g - e.g) * s, this.b = e.b + (t.b - e.b) * s, this
    }
    lerpHSL(e, t)
    {
        this.getHSL(Hn),
        e.getHSL(Xc);
        const s = Gl(Hn.h, Xc.h, t),
            n = Gl(Hn.s, Xc.s, t),
            r = Gl(Hn.l, Xc.l, t);
        return this.setHSL(s, n, r), this
    }
    setFromVector3(e)
    {
        return this.r = e.x, this.g = e.y, this.b = e.z, this
    }
    applyMatrix3(e)
    {
        const t = this.r,
            s = this.g,
            n = this.b,
            r = e.elements;
        return this.r = r[0] * t + r[3] * s + r[6] * n, this.g = r[1] * t + r[4] * s + r[7] * n, this.b = r[2] * t + r[5] * s + r[8] * n, this
    }
    equals(e)
    {
        return e.r === this.r && e.g === this.g && e.b === this.b
    }
    fromArray(e, t=0)
    {
        return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this
    }
    toArray(e=[], t=0)
    {
        return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e
    }
    fromBufferAttribute(e, t)
    {
        return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this
    }
    toJSON()
    {
        return this.getHex()
    }
    *[Symbol.iterator]()
    {
        yield this.r,
        yield this.g,
        yield this.b
    }
}
const Ii = new Z;
Z.NAMES = Iy;
let o1 = 0;
class fs extends hn {
    constructor()
    {
        super(),
        this.isMaterial = !0,
        Object.defineProperty(this, "id", {
            value: o1++
        }),
        this.uuid = Hs(),
        this.name = "",
        this.type = "Material",
        this.blending = _o,
        this.side = es,
        this.vertexColors = !1,
        this.opacity = 1,
        this.transparent = !1,
        this.alphaHash = !1,
        this.blendSrc = Ou,
        this.blendDst = Bp,
        this.blendEquation = ar,
        this.blendSrcAlpha = null,
        this.blendDstAlpha = null,
        this.blendEquationAlpha = null,
        this.blendColor = new Z(0, 0, 0),
        this.blendAlpha = 0,
        this.depthFunc = pc,
        this.depthTest = !0,
        this.depthWrite = !0,
        this.stencilWriteMask = 255,
        this.stencilFunc = lv,
        this.stencilRef = 0,
        this.stencilFuncMask = 255,
        this.stencilFail = wa,
        this.stencilZFail = wa,
        this.stencilZPass = wa,
        this.stencilWrite = !1,
        this.clippingPlanes = null,
        this.clipIntersection = !1,
        this.clipShadows = !1,
        this.shadowSide = null,
        this.colorWrite = !0,
        this.precision = null,
        this.polygonOffset = !1,
        this.polygonOffsetFactor = 0,
        this.polygonOffsetUnits = 0,
        this.dithering = !1,
        this.alphaToCoverage = !1,
        this.premultipliedAlpha = !1,
        this.forceSinglePass = !1,
        this.visible = !0,
        this.toneMapped = !0,
        this.userData = {},
        this.version = 0,
        this._alphaTest = 0
    }
    get alphaTest()
    {
        return this._alphaTest
    }
    set alphaTest(e)
    {
        this._alphaTest > 0 != e > 0 && this.version++,
        this._alphaTest = e
    }
    onBuild() {}
    onBeforeRender() {}
    onBeforeCompile() {}
    customProgramCacheKey()
    {
        return this.onBeforeCompile.toString()
    }
    setValues(e)
    {
        if (e !== void 0)
            for (const t in e) {
                const s = e[t];
                if (s === void 0) {
                    console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);
                    continue
                }
                const n = this[t];
                if (n === void 0) {
                    console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);
                    continue
                }
                n && n.isColor ? n.set(s) : n && n.isVector3 && s && s.isVector3 ? n.copy(s) : this[t] = s
            }
    }
    toJSON(e)
    {
        const t = e === void 0 || typeof e == "string";
        t && (e = {
            textures: {},
            images: {}
        });
        const s = {
            metadata: {
                version: 4.6,
                type: "Material",
                generator: "Material.toJSON"
            }
        };
        s.uuid = this.uuid,
        s.type = this.type,
        this.name !== "" && (s.name = this.name),
        this.color && this.color.isColor && (s.color = this.color.getHex()),
        this.roughness !== void 0 && (s.roughness = this.roughness),
        this.metalness !== void 0 && (s.metalness = this.metalness),
        this.sheen !== void 0 && (s.sheen = this.sheen),
        this.sheenColor && this.sheenColor.isColor && (s.sheenColor = this.sheenColor.getHex()),
        this.sheenRoughness !== void 0 && (s.sheenRoughness = this.sheenRoughness),
        this.emissive && this.emissive.isColor && (s.emissive = this.emissive.getHex()),
        this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (s.emissiveIntensity = this.emissiveIntensity),
        this.specular && this.specular.isColor && (s.specular = this.specular.getHex()),
        this.specularIntensity !== void 0 && (s.specularIntensity = this.specularIntensity),
        this.specularColor && this.specularColor.isColor && (s.specularColor = this.specularColor.getHex()),
        this.shininess !== void 0 && (s.shininess = this.shininess),
        this.clearcoat !== void 0 && (s.clearcoat = this.clearcoat),
        this.clearcoatRoughness !== void 0 && (s.clearcoatRoughness = this.clearcoatRoughness),
        this.clearcoatMap && this.clearcoatMap.isTexture && (s.clearcoatMap = this.clearcoatMap.toJSON(e).uuid),
        this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (s.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid),
        this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (s.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, s.clearcoatNormalScale = this.clearcoatNormalScale.toArray()),
        this.dispersion !== void 0 && (s.dispersion = this.dispersion),
        this.iridescence !== void 0 && (s.iridescence = this.iridescence),
        this.iridescenceIOR !== void 0 && (s.iridescenceIOR = this.iridescenceIOR),
        this.iridescenceThicknessRange !== void 0 && (s.iridescenceThicknessRange = this.iridescenceThicknessRange),
        this.iridescenceMap && this.iridescenceMap.isTexture && (s.iridescenceMap = this.iridescenceMap.toJSON(e).uuid),
        this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (s.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid),
        this.anisotropy !== void 0 && (s.anisotropy = this.anisotropy),
        this.anisotropyRotation !== void 0 && (s.anisotropyRotation = this.anisotropyRotation),
        this.anisotropyMap && this.anisotropyMap.isTexture && (s.anisotropyMap = this.anisotropyMap.toJSON(e).uuid),
        this.map && this.map.isTexture && (s.map = this.map.toJSON(e).uuid),
        this.matcap && this.matcap.isTexture && (s.matcap = this.matcap.toJSON(e).uuid),
        this.alphaMap && this.alphaMap.isTexture && (s.alphaMap = this.alphaMap.toJSON(e).uuid),
        this.lightMap && this.lightMap.isTexture && (s.lightMap = this.lightMap.toJSON(e).uuid, s.lightMapIntensity = this.lightMapIntensity),
        this.aoMap && this.aoMap.isTexture && (s.aoMap = this.aoMap.toJSON(e).uuid, s.aoMapIntensity = this.aoMapIntensity),
        this.bumpMap && this.bumpMap.isTexture && (s.bumpMap = this.bumpMap.toJSON(e).uuid, s.bumpScale = this.bumpScale),
        this.normalMap && this.normalMap.isTexture && (s.normalMap = this.normalMap.toJSON(e).uuid, s.normalMapType = this.normalMapType, s.normalScale = this.normalScale.toArray()),
        this.displacementMap && this.displacementMap.isTexture && (s.displacementMap = this.displacementMap.toJSON(e).uuid, s.displacementScale = this.displacementScale, s.displacementBias = this.displacementBias),
        this.roughnessMap && this.roughnessMap.isTexture && (s.roughnessMap = this.roughnessMap.toJSON(e).uuid),
        this.metalnessMap && this.metalnessMap.isTexture && (s.metalnessMap = this.metalnessMap.toJSON(e).uuid),
        this.emissiveMap && this.emissiveMap.isTexture && (s.emissiveMap = this.emissiveMap.toJSON(e).uuid),
        this.specularMap && this.specularMap.isTexture && (s.specularMap = this.specularMap.toJSON(e).uuid),
        this.specularIntensityMap && this.specularIntensityMap.isTexture && (s.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid),
        this.specularColorMap && this.specularColorMap.isTexture && (s.specularColorMap = this.specularColorMap.toJSON(e).uuid),
        this.envMap && this.envMap.isTexture && (s.envMap = this.envMap.toJSON(e).uuid, this.combine !== void 0 && (s.combine = this.combine)),
        this.envMapRotation !== void 0 && (s.envMapRotation = this.envMapRotation.toArray()),
        this.envMapIntensity !== void 0 && (s.envMapIntensity = this.envMapIntensity),
        this.reflectivity !== void 0 && (s.reflectivity = this.reflectivity),
        this.refractionRatio !== void 0 && (s.refractionRatio = this.refractionRatio),
        this.gradientMap && this.gradientMap.isTexture && (s.gradientMap = this.gradientMap.toJSON(e).uuid),
        this.transmission !== void 0 && (s.transmission = this.transmission),
        this.transmissionMap && this.transmissionMap.isTexture && (s.transmissionMap = this.transmissionMap.toJSON(e).uuid),
        this.thickness !== void 0 && (s.thickness = this.thickness),
        this.thicknessMap && this.thicknessMap.isTexture && (s.thicknessMap = this.thicknessMap.toJSON(e).uuid),
        this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (s.attenuationDistance = this.attenuationDistance),
        this.attenuationColor !== void 0 && (s.attenuationColor = this.attenuationColor.getHex()),
        this.size !== void 0 && (s.size = this.size),
        this.shadowSide !== null && (s.shadowSide = this.shadowSide),
        this.sizeAttenuation !== void 0 && (s.sizeAttenuation = this.sizeAttenuation),
        this.blending !== _o && (s.blending = this.blending),
        this.side !== es && (s.side = this.side),
        this.vertexColors === !0 && (s.vertexColors = !0),
        this.opacity < 1 && (s.opacity = this.opacity),
        this.transparent === !0 && (s.transparent = !0),
        this.blendSrc !== Ou && (s.blendSrc = this.blendSrc),
        this.blendDst !== Bp && (s.blendDst = this.blendDst),
        this.blendEquation !== ar && (s.blendEquation = this.blendEquation),
        this.blendSrcAlpha !== null && (s.blendSrcAlpha = this.blendSrcAlpha),
        this.blendDstAlpha !== null && (s.blendDstAlpha = this.blendDstAlpha),
        this.blendEquationAlpha !== null && (s.blendEquationAlpha = this.blendEquationAlpha),
        this.blendColor && this.blendColor.isColor && (s.blendColor = this.blendColor.getHex()),
        this.blendAlpha !== 0 && (s.blendAlpha = this.blendAlpha),
        this.depthFunc !== pc && (s.depthFunc = this.depthFunc),
        this.depthTest === !1 && (s.depthTest = this.depthTest),
        this.depthWrite === !1 && (s.depthWrite = this.depthWrite),
        this.colorWrite === !1 && (s.colorWrite = this.colorWrite),
        this.stencilWriteMask !== 255 && (s.stencilWriteMask = this.stencilWriteMask),
        this.stencilFunc !== lv && (s.stencilFunc = this.stencilFunc),
        this.stencilRef !== 0 && (s.stencilRef = this.stencilRef),
        this.stencilFuncMask !== 255 && (s.stencilFuncMask = this.stencilFuncMask),
        this.stencilFail !== wa && (s.stencilFail = this.stencilFail),
        this.stencilZFail !== wa && (s.stencilZFail = this.stencilZFail),
        this.stencilZPass !== wa && (s.stencilZPass = this.stencilZPass),
        this.stencilWrite === !0 && (s.stencilWrite = this.stencilWrite),
        this.rotation !== void 0 && this.rotation !== 0 && (s.rotation = this.rotation),
        this.polygonOffset === !0 && (s.polygonOffset = !0),
        this.polygonOffsetFactor !== 0 && (s.polygonOffsetFactor = this.polygonOffsetFactor),
        this.polygonOffsetUnits !== 0 && (s.polygonOffsetUnits = this.polygonOffsetUnits),
        this.linewidth !== void 0 && this.linewidth !== 1 && (s.linewidth = this.linewidth),
        this.dashSize !== void 0 && (s.dashSize = this.dashSize),
        this.gapSize !== void 0 && (s.gapSize = this.gapSize),
        this.scale !== void 0 && (s.scale = this.scale),
        this.dithering === !0 && (s.dithering = !0),
        this.alphaTest > 0 && (s.alphaTest = this.alphaTest),
        this.alphaHash === !0 && (s.alphaHash = !0),
        this.alphaToCoverage === !0 && (s.alphaToCoverage = !0),
        this.premultipliedAlpha === !0 && (s.premultipliedAlpha = !0),
        this.forceSinglePass === !0 && (s.forceSinglePass = !0),
        this.wireframe === !0 && (s.wireframe = !0),
        this.wireframeLinewidth > 1 && (s.wireframeLinewidth = this.wireframeLinewidth),
        this.wireframeLinecap !== "round" && (s.wireframeLinecap = this.wireframeLinecap),
        this.wireframeLinejoin !== "round" && (s.wireframeLinejoin = this.wireframeLinejoin),
        this.flatShading === !0 && (s.flatShading = !0),
        this.visible === !1 && (s.visible = !1),
        this.toneMapped === !1 && (s.toneMapped = !1),
        this.fog === !1 && (s.fog = !1),
        Object.keys(this.userData).length > 0 && (s.userData = this.userData);
        function n(r) {
            const a = [];
            for (const o in r) {
                const l = r[o];
                delete l.metadata,
                a.push(l)
            }
            return a
        }
        if (t) {
            const r = n(e.textures),
                a = n(e.images);
            r.length > 0 && (s.textures = r),
            a.length > 0 && (s.images = a)
        }
        return s
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
    copy(e)
    {
        this.name = e.name,
        this.blending = e.blending,
        this.side = e.side,
        this.vertexColors = e.vertexColors,
        this.opacity = e.opacity,
        this.transparent = e.transparent,
        this.blendSrc = e.blendSrc,
        this.blendDst = e.blendDst,
        this.blendEquation = e.blendEquation,
        this.blendSrcAlpha = e.blendSrcAlpha,
        this.blendDstAlpha = e.blendDstAlpha,
        this.blendEquationAlpha = e.blendEquationAlpha,
        this.blendColor.copy(e.blendColor),
        this.blendAlpha = e.blendAlpha,
        this.depthFunc = e.depthFunc,
        this.depthTest = e.depthTest,
        this.depthWrite = e.depthWrite,
        this.stencilWriteMask = e.stencilWriteMask,
        this.stencilFunc = e.stencilFunc,
        this.stencilRef = e.stencilRef,
        this.stencilFuncMask = e.stencilFuncMask,
        this.stencilFail = e.stencilFail,
        this.stencilZFail = e.stencilZFail,
        this.stencilZPass = e.stencilZPass,
        this.stencilWrite = e.stencilWrite;
        const t = e.clippingPlanes;
        let s = null;
        if (t !== null) {
            const n = t.length;
            s = new Array(n);
            for (let r = 0; r !== n; ++r)
                s[r] = t[r].clone()
        }
        return this.clippingPlanes = s, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this
    }
    dispose()
    {
        this.dispatchEvent({
            type: "dispose"
        })
    }
    set needsUpdate(e)
    {
        e === !0 && this.version++
    }
}
class or extends fs {
    constructor(e)
    {
        super(),
        this.isMeshBasicMaterial = !0,
        this.type = "MeshBasicMaterial",
        this.color = new Z(16777215),
        this.map = null,
        this.lightMap = null,
        this.lightMapIntensity = 1,
        this.aoMap = null,
        this.aoMapIntensity = 1,
        this.specularMap = null,
        this.alphaMap = null,
        this.envMap = null,
        this.envMapRotation = new ln,
        this.combine = my,
        this.reflectivity = 1,
        this.refractionRatio = .98,
        this.wireframe = !1,
        this.wireframeLinewidth = 1,
        this.wireframeLinecap = "round",
        this.wireframeLinejoin = "round",
        this.fog = !0,
        this.setValues(e)
    }
    copy(e)
    {
        return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this
    }
}
const li = new b,
    Kc = new H;
class We {
    constructor(e, t, s=!1)
    {
        if (Array.isArray(e))
            throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
        this.isBufferAttribute = !0,
        this.name = "",
        this.array = e,
        this.itemSize = t,
        this.count = e !== void 0 ? e.length / t : 0,
        this.normalized = s,
        this.usage = qu,
        this._updateRange = {
            offset: 0,
            count: -1
        },
        this.updateRanges = [],
        this.gpuType = Lt,
        this.version = 0
    }
    onUploadCallback() {}
    set needsUpdate(e)
    {
        e === !0 && this.version++
    }
    get updateRange()
    {
        return PA("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."), this._updateRange
    }
    setUsage(e)
    {
        return this.usage = e, this
    }
    addUpdateRange(e, t)
    {
        this.updateRanges.push({
            start: e,
            count: t
        })
    }
    clearUpdateRanges()
    {
        this.updateRanges.length = 0
    }
    copy(e)
    {
        return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this
    }
    copyAt(e, t, s)
    {
        e *= this.itemSize,
        s *= t.itemSize;
        for (let n = 0, r = this.itemSize; n < r; n++)
            this.array[e + n] = t.array[s + n];
        return this
    }
    copyArray(e)
    {
        return this.array.set(e), this
    }
    applyMatrix3(e)
    {
        if (this.itemSize === 2)
            for (let t = 0, s = this.count; t < s; t++)
                Kc.fromBufferAttribute(this, t),
                Kc.applyMatrix3(e),
                this.setXY(t, Kc.x, Kc.y);
        else if (this.itemSize === 3)
            for (let t = 0, s = this.count; t < s; t++)
                li.fromBufferAttribute(this, t),
                li.applyMatrix3(e),
                this.setXYZ(t, li.x, li.y, li.z);
        return this
    }
    applyMatrix4(e)
    {
        for (let t = 0, s = this.count; t < s; t++)
            li.fromBufferAttribute(this, t),
            li.applyMatrix4(e),
            this.setXYZ(t, li.x, li.y, li.z);
        return this
    }
    applyNormalMatrix(e)
    {
        for (let t = 0, s = this.count; t < s; t++)
            li.fromBufferAttribute(this, t),
            li.applyNormalMatrix(e),
            this.setXYZ(t, li.x, li.y, li.z);
        return this
    }
    transformDirection(e)
    {
        for (let t = 0, s = this.count; t < s; t++)
            li.fromBufferAttribute(this, t),
            li.transformDirection(e),
            this.setXYZ(t, li.x, li.y, li.z);
        return this
    }
    set(e, t=0)
    {
        return this.array.set(e, t), this
    }
    getComponent(e, t)
    {
        let s = this.array[e * this.itemSize + t];
        return this.normalized && (s = ks(s, this.array)), s
    }
    setComponent(e, t, s)
    {
        return this.normalized && (s = bt(s, this.array)), this.array[e * this.itemSize + t] = s, this
    }
    getX(e)
    {
        let t = this.array[e * this.itemSize];
        return this.normalized && (t = ks(t, this.array)), t
    }
    setX(e, t)
    {
        return this.normalized && (t = bt(t, this.array)), this.array[e * this.itemSize] = t, this
    }
    getY(e)
    {
        let t = this.array[e * this.itemSize + 1];
        return this.normalized && (t = ks(t, this.array)), t
    }
    setY(e, t)
    {
        return this.normalized && (t = bt(t, this.array)), this.array[e * this.itemSize + 1] = t, this
    }
    getZ(e)
    {
        let t = this.array[e * this.itemSize + 2];
        return this.normalized && (t = ks(t, this.array)), t
    }
    setZ(e, t)
    {
        return this.normalized && (t = bt(t, this.array)), this.array[e * this.itemSize + 2] = t, this
    }
    getW(e)
    {
        let t = this.array[e * this.itemSize + 3];
        return this.normalized && (t = ks(t, this.array)), t
    }
    setW(e, t)
    {
        return this.normalized && (t = bt(t, this.array)), this.array[e * this.itemSize + 3] = t, this
    }
    setXY(e, t, s)
    {
        return e *= this.itemSize, this.normalized && (t = bt(t, this.array), s = bt(s, this.array)), this.array[e + 0] = t, this.array[e + 1] = s, this
    }
    setXYZ(e, t, s, n)
    {
        return e *= this.itemSize, this.normalized && (t = bt(t, this.array), s = bt(s, this.array), n = bt(n, this.array)), this.array[e + 0] = t, this.array[e + 1] = s, this.array[e + 2] = n, this
    }
    setXYZW(e, t, s, n, r)
    {
        return e *= this.itemSize, this.normalized && (t = bt(t, this.array), s = bt(s, this.array), n = bt(n, this.array), r = bt(r, this.array)), this.array[e + 0] = t, this.array[e + 1] = s, this.array[e + 2] = n, this.array[e + 3] = r, this
    }
    onUpload(e)
    {
        return this.onUploadCallback = e, this
    }
    clone()
    {
        return new this.constructor(this.array, this.itemSize).copy(this)
    }
    toJSON()
    {
        const e = {
            itemSize: this.itemSize,
            type: this.array.constructor.name,
            array: Array.from(this.array),
            normalized: this.normalized
        };
        return this.name !== "" && (e.name = this.name), this.usage !== qu && (e.usage = this.usage), e
    }
}
class By extends We {
    constructor(e, t, s)
    {
        super(new Uint16Array(e), t, s)
    }
}
class Ev extends We {
    constructor(e, t, s)
    {
        super(new Int32Array(e), t, s)
    }
}
class Py extends We {
    constructor(e, t, s)
    {
        super(new Uint32Array(e), t, s)
    }
}
class nt extends We {
    constructor(e, t, s)
    {
        super(new Float32Array(e), t, s)
    }
}
let l1 = 0;
const xs = new De,
    lf = new It,
    Da = new b,
    ns = new Vt,
    sl = new Vt,
    Ai = new b;
