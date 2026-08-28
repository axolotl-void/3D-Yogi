 * CSSPlugin 3.12.5
 * https://gsap.com
 *
 * Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/







let G0,
    cr,
    So,
    lg,
    ia,
    H0,
    cg,
    KP = () => typeof window < "u",
    Dn = {},
    Wr = 180 / Math.PI,
    Mo = Math.PI / 180,
    Qa = Math.atan2,
    V0 = 1e8,
    hg = /([A-Z])/g,
    JP = /(left|right|width|margin|padding|x)/i,
    jP = /[\s,\(]\S/,
    rn = {
        autoAlpha: "opacity,visibility",
        scale: "scaleX,scaleY",
        alpha: "opacity"
    },
    rm = (i, e) => e.set(e.t, e.p, Math.round((e.s + e.c * i) * 1e4) / 1e4 + e.u, e),
    ZP = (i, e) => e.set(e.t, e.p, i === 1 ? e.e : Math.round((e.s + e.c * i) * 1e4) / 1e4 + e.u, e),
    $P = (i, e) => e.set(e.t, e.p, i ? Math.round((e.s + e.c * i) * 1e4) / 1e4 + e.u : e.b, e),
    eD = (i, e) => {
        let t = e.s + e.c * i;
        e.set(e.t, e.p, ~~(t + (t < 0 ? -.5 : .5)) + e.u, e)
    },
    iw = (i, e) => e.set(e.t, e.p, i ? e.e : e.b, e),
    sw = (i, e) => e.set(e.t, e.p, i !== 1 ? e.b : e.e, e),
    tD = (i, e, t) => i.style[e] = t,
    iD = (i, e, t) => i.style.setProperty(e, t),
    sD = (i, e, t) => i._gsap[e] = t,
    nD = (i, e, t) => i._gsap.scaleX = i._gsap.scaleY = t,
    rD = (i, e, t, s, n) => {
        let r = i._gsap;
        r.scaleX = r.scaleY = t,
        r.renderTransform(n, r)
    },
    aD = (i, e, t, s, n) => {
        let r = i._gsap;
        r[e] = t,
        r.renderTransform(n, r)
    },
    Yt = "transform",
    $i = Yt + "Origin",
    nw = function(i, e) {
        let t = this.target,
            s = t.style,
            n = t._gsap;
        if (i in Dn && s) {
            if (this.tfm = this.tfm || {}, i !== "transform")
                i = rn[i] || i,
                ~i.indexOf(",") ? i.split(",").forEach(r => this.tfm[r] = Sn(t, r)) : this.tfm[i] = n.x ? n[i] : Sn(t, i),
                i === $i && (this.tfm.zOrigin = n.zOrigin);
            else
                return rn.transform.split(",").forEach(r => nw.call(this, r, e));
            if (this.props.indexOf(Yt) >= 0)
                return;
            n.svg && (this.svgo = t.getAttribute("data-svg-origin"), this.props.push($i, e, "")),
            i = Yt
        }
        (s || e) && this.props.push(i, e, s[i])
    },
    rw = i => {
        i.translate && (i.removeProperty("translate"), i.removeProperty("scale"), i.removeProperty("rotate"))
    },
    oD = function() {
        let i = this.props,
            e = this.target,
            t = e.style,
            s = e._gsap,
            n,
            r;
        for (n = 0; n < i.length; n += 3)
            i[n + 1] ? e[i[n]] = i[n + 2] : i[n + 2] ? t[i[n]] = i[n + 2] : t.removeProperty(i[n].substr(0, 2) === "--" ? i[n] : i[n].replace(hg, "-$1").toLowerCase());
        if (this.tfm) {
            for (r in this.tfm)
                s[r] = this.tfm[r];
            s.svg && (s.renderTransform(), e.setAttribute("data-svg-origin", this.svgo || "")),
            n = cg(),
            (!n || !n.isStart) && !t[Yt] && (rw(t), s.zOrigin && t[$i] && (t[$i] += " " + s.zOrigin + "px", s.zOrigin = 0, s.renderTransform()), s.uncache = 1)
        }
    },
    aw = (i, e) => {
        let t = {
            target: i,
            props: [],
            revert: oD,
            save: nw
        };
        return i._gsap || ts.core.getCache(i), e && e.split(",").forEach(s => t.save(s)), t
    },
    ow,
    am = (i, e) => {
        let t = cr.createElementNS ? cr.createElementNS((e || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), i) : cr.createElement(i);
        return t && t.style ? t : cr.createElement(i)
    },
    Vs = (i, e, t) => {
        let s = getComputedStyle(i);
        return s[e] || s.getPropertyValue(e.replace(hg, "-$1").toLowerCase()) || s.getPropertyValue(e) || !t && Vs(i, Ho(e) || e, 1) || ""
    },
    W0 = "O,Moz,ms,Ms,Webkit".split(","),
    Ho = (i, e, t) => {
        let s = e || ia,
            n = s.style,
            r = 5;
        if (i in n && !t)
            return i;
        for (i = i.charAt(0).toUpperCase() + i.substr(1); r-- && !(W0[r] + i in n);)
            ;
        return r < 0 ? null : (r === 3 ? "ms" : r >= 0 ? W0[r] : "") + i
    },
    om = () => {
        KP() && window.document && (G0 = window, cr = G0.document, So = cr.documentElement, ia = am("div") || {
            style: {}
        }, am("div"), Yt = Ho(Yt), $i = Yt + "Origin", ia.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", ow = !!Ho("perspective"), cg = ts.core.reverting, lg = 1)
    },
    ou = function(i) {
        let e = am("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
            t = this.parentNode,
            s = this.nextSibling,
            n = this.style.cssText,
            r;
        if (So.appendChild(e), e.appendChild(this), this.style.display = "block", i)
            try {
                r = this.getBBox(),
                this._gsapBBox = this.getBBox,
                this.getBBox = ou
            } catch {}
        else
            this._gsapBBox && (r = this._gsapBBox());
        return t && (s ? t.insertBefore(this, s) : t.appendChild(this)), So.removeChild(e), this.style.cssText = n, r
    },
    Y0 = (i, e) => {
        let t = e.length;
        for (; t--;)
            if (i.hasAttribute(e[t]))
                return i.getAttribute(e[t])
    },
    lw = i => {
        let e;
        try {
            e = i.getBBox()
        } catch {
            e = ou.call(i, !0)
        }
        return e && (e.width || e.height) || i.getBBox === ou || (e = ou.call(i, !0)), e && !e.width && !e.x && !e.y ? {
            x: +Y0(i, ["x", "cx", "x1"]) || 0,
            y: +Y0(i, ["y", "cy", "y1"]) || 0,
            width: 0,
            height: 0
        } : e
    },
    cw = i => !!(i.getCTM && (!i.parentNode || i.ownerSVGElement) && lw(i)),
    ma = (i, e) => {
        if (e) {
            let t = i.style,
                s;
            e in Dn && e !== $i && (e = Yt),
            t.removeProperty ? (s = e.substr(0, 2), (s === "ms" || e.substr(0, 6) === "webkit") && (e = "-" + e), t.removeProperty(s === "--" ? e : e.replace(hg, "-$1").toLowerCase())) : t.removeAttribute(e)
        }
    },
    hr = (i, e, t, s, n, r) => {
        let a = new Zi(i._pt, e, t, 0, 1, r ? sw : iw);
        return i._pt = a, a.b = s, a.e = n, i._props.push(t), a
    },
    q0 = {
        deg: 1,
        rad: 1,
        turn: 1
    },
    lD = {
        grid: 1,
        flex: 1
    },
    Rn = (i, e, t, s) => {
        let n = parseFloat(t) || 0,
            r = (t + "").trim().substr((n + "").length) || "px",
            a = ia.style,
            o = JP.test(e),
            l = i.tagName.toLowerCase() === "svg",
            c = (l ? "client" : "offset") + (o ? "Width" : "Height"),
            h = 100,
            d = s === "px",
            u = s === "%",
            f,
            p,
            A,
            m;
        if (s === r || !n || q0[s] || q0[r])
            return n;
        if (r !== "px" && !d && (n = Rn(i, e, t, "px")), m = i.getCTM && cw(i), (u || r === "%") && (Dn[e] || ~e.indexOf("adius")))
            return f = m ? i.getBBox()[o ? "width" : "height"] : i[c], ai(u ? n / f * h : n / 100 * f);
        if (a[o ? "width" : "height"] = h + (d ? r : s), p = ~e.indexOf("adius") || s === "em" && i.appendChild && !l ? i : i.parentNode, m && (p = (i.ownerSVGElement || {}).parentNode), (!p || p === cr || !p.appendChild) && (p = cr.body), A = p._gsap, A && u && A.width && o && A.time === hs.time && !A.uncache)
            return ai(n / A.width * h);
        if (u && (e === "height" || e === "width")) {
            let g = i.style[e];
            i.style[e] = h + s,
            f = i[c],
            g ? i.style[e] = g : ma(i, e)
        } else
            (u || r === "%") && !lD[Vs(p, "display")] && (a.position = Vs(i, "position")),
            p === i && (a.position = "static"),
            p.appendChild(ia),
            f = ia[c],
            p.removeChild(ia),
            a.position = "absolute";
        return o && u && (A = na(p), A.time = hs.time, A.width = p[c]), ai(d ? f * n / h : f && n ? h / f * n : 0)
    },
    Sn = (i, e, t, s) => {
        let n;
        return lg || om(), e in rn && e !== "transform" && (e = rn[e], ~e.indexOf(",") && (e = e.split(",")[0])), Dn[e] && e !== "transform" ? (n = Cc(i, s), n = e !== "transformOrigin" ? n[e] : n.svg ? n.origin : nd(Vs(i, $i)) + " " + n.zOrigin + "px") : (n = i.style[e], (!n || n === "auto" || s || ~(n + "").indexOf("calc(")) && (n = sd[e] && sd[e](i, e, t) || Vs(i, e) || __(i, e) || (e === "opacity" ? 1 : 0))), t && !~(n + "").trim().indexOf(" ") ? Rn(i, e, n, t) + t : n
    },
    cD = function(i, e, t, s) {
        if (!t || t === "none") {
            let v = Ho(e, i, 1),
                y = v && Vs(i, v, 1);
            y && y !== t ? (e = v, t = y) : e === "borderColor" && (t = Vs(i, "borderTopColor"))
        }
        let n = new Zi(this._pt, i.style, e, 0, 1, ew),
            r = 0,
            a = 0,
            o,
            l,
            c,
            h,
            d,
            u,
            f,
            p,
            A,
            m,
            g,
            x;
        if (n.b = t, n.e = s, t += "", s += "", s === "auto" && (u = i.style[e], i.style[e] = s, s = Vs(i, e) || s, u ? i.style[e] = u : ma(i, e)), o = [t, s], W_(o), t = o[0], s = o[1], c = t.match(po) || [], x = s.match(po) || [], x.length) {
            for (; l = po.exec(s);)
                f = l[0],
                A = s.substring(r, l.index),
                d ? d = (d + 1) % 5 : (A.substr(-5) === "rgba(" || A.substr(-5) === "hsla(") && (d = 1),
                f !== (u = c[a++] || "") && (h = parseFloat(u) || 0, g = u.substr((h + "").length), f.charAt(1) === "=" && (f = Co(h, f) + g), p = parseFloat(f), m = f.substr((p + "").length), r = po.lastIndex - m.length, m || (m = m || ps.units[e] || g, r === s.length && (s += m, n.e += m)), g !== m && (h = Rn(i, e, u, m) || 0), n._pt = {
                    _next: n._pt,
                    p: A || a === 1 ? A : ",",
                    s: h,
                    c: p - h,
                    m: d && d < 4 || e === "zIndex" ? Math.round : 0
                });
            n.c = r < s.length ? s.substring(r, s.length) : ""
        } else
            n.r = e === "display" && s === "none" ? sw : iw;
        return m_.test(s) && (n.e = 0), this._pt = n, n
    },
    X0 = {
        top: "0%",
        bottom: "100%",
        left: "0%",
        right: "100%",
        center: "50%"
    },
    hD = i => {
        let e = i.split(" "),
            t = e[0],
            s = e[1] || "50%";
        return (t === "top" || t === "bottom" || s === "left" || s === "right") && (i = t, t = s, s = i), e[0] = X0[t] || t, e[1] = X0[s] || s, e.join(" ")
    },
    uD = (i, e) => {
        if (e.tween && e.tween._time === e.tween._dur) {
            let t = e.t,
                s = t.style,
                n = e.u,
                r = t._gsap,
                a,
                o,
                l;
            if (n === "all" || n === !0)
                s.cssText = "",
                o = 1;
            else
                for (n = n.split(","), l = n.length; --l > -1;)
                    a = n[l],
                    Dn[a] && (o = 1, a = a === "transformOrigin" ? $i : Yt),
                    ma(t, a);
            o && (ma(t, Yt), r && (r.svg && t.removeAttribute("transform"), Cc(t, 1), r.uncache = 1, rw(s)))
        }
    },
    sd = {
        clearProps(i, e, t, s, n) {
            if (n.data !== "isFromStart") {
                let r = i._pt = new Zi(i._pt, e, t, 0, 0, uD);
                return r.u = s, r.pr = -10, r.tween = n, i._props.push(t), 1
            }
        }
    },
    Ec = [1, 0, 0, 1, 0, 0],
    hw = {},
    uw = i => i === "matrix(1, 0, 0, 1, 0, 0)" || i === "none" || !i,
    K0 = i => {
        let e = Vs(i, Yt);
        return uw(e) ? Ec : e.substr(7).match(p_).map(ai)
    },
    ug = (i, e) => {
        let t = i._gsap || na(i),
            s = i.style,
            n = K0(i),
            r,
            a,
            o,
            l;
        return t.svg && i.getAttribute("transform") ? (o = i.transform.baseVal.consolidate().matrix, n = [o.a, o.b, o.c, o.d, o.e, o.f], n.join(",") === "1,0,0,1,0,0" ? Ec : n) : (n === Ec && !i.offsetParent && i !== So && !t.svg && (o = s.display, s.display = "block", r = i.parentNode, (!r || !i.offsetParent) && (l = 1, a = i.nextElementSibling, So.appendChild(i)), n = K0(i), o ? s.display = o : ma(i, "display"), l && (a ? r.insertBefore(i, a) : r ? r.appendChild(i) : So.removeChild(i))), e && n.length > 6 ? [n[0], n[1], n[4], n[5], n[12], n[13]] : n)
    },
    lm = (i, e, t, s, n, r) => {
        let a = i._gsap,
            o = n || ug(i, !0),
            l = a.xOrigin || 0,
            c = a.yOrigin || 0,
            h = a.xOffset || 0,
            d = a.yOffset || 0,
            [u, f, p, A, m, g] = o,
            x = e.split(" "),
            v = parseFloat(x[0]) || 0,
            y = parseFloat(x[1]) || 0,
            S,
            w,
            C,
            M;
        t ? o !== Ec && (w = u * A - f * p) && (C = v * (A / w) + y * (-p / w) + (p * g - A * m) / w, M = v * (-f / w) + y * (u / w) - (u * g - f * m) / w, v = C, y = M) : (S = lw(i), v = S.x + (~x[0].indexOf("%") ? v / 100 * S.width : v), y = S.y + (~(x[1] || x[0]).indexOf("%") ? y / 100 * S.height : y)),
        s || s !== !1 && a.smooth ? (m = v - l, g = y - c, a.xOffset = h + (m * u + g * p) - m, a.yOffset = d + (m * f + g * A) - g) : a.xOffset = a.yOffset = 0,
        a.xOrigin = v,
        a.yOrigin = y,
        a.smooth = !!s,
        a.origin = e,
        a.originIsAbsolute = !!t,
        i.style[$i] = "0px 0px",
        r && (hr(r, a, "xOrigin", l, v), hr(r, a, "yOrigin", c, y), hr(r, a, "xOffset", h, a.xOffset), hr(r, a, "yOffset", d, a.yOffset)),
        i.setAttribute("data-svg-origin", v + " " + y)
    },
    Cc = (i, e) => {
        let t = i._gsap || new X_(i);
        if ("x" in t && !e && !t.uncache)
            return t;
        let s = i.style,
            n = t.scaleX < 0,
            r = "px",
            a = "deg",
            o = getComputedStyle(i),
            l = Vs(i, $i) || "0",
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
            O,
            K,
            V,
            pe,
            xe,
            Ae,
            Ye,
            ke,
            J;
        return c = h = d = p = A = m = g = x = v = 0, u = f = 1, t.svg = !!(i.getCTM && cw(i)), o.translate && ((o.translate !== "none" || o.scale !== "none" || o.rotate !== "none") && (s[Yt] = (o.translate !== "none" ? "translate3d(" + (o.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (o.rotate !== "none" ? "rotate(" + o.rotate + ") " : "") + (o.scale !== "none" ? "scale(" + o.scale.split(" ").join(",") + ") " : "") + (o[Yt] !== "none" ? o[Yt] : "")), s.scale = s.rotate = s.translate = "none"), w = ug(i, t.svg), t.svg && (t.uncache ? (K = i.getBBox(), l = t.xOrigin - K.x + "px " + (t.yOrigin - K.y) + "px", O = "") : O = !e && i.getAttribute("data-svg-origin"), lm(i, O || l, !!O || t.originIsAbsolute, t.smooth !== !1, w)), y = t.xOrigin || 0, S = t.yOrigin || 0, w !== Ec && (_ = w[0], I = w[1], P = w[2], D = w[3], c = L = w[4], h = z = w[5], w.length === 6 ? (u = Math.sqrt(_ * _ + I * I), f = Math.sqrt(D * D + P * P), p = _ || I ? Qa(I, _) * Wr : 0, g = P || D ? Qa(P, D) * Wr + p : 0, g && (f *= Math.abs(Math.cos(g * Mo))), t.svg && (c -= y - (y * _ + S * P), h -= S - (y * I + S * D))) : (J = w[6], Ye = w[7], pe = w[8], xe = w[9], Ae = w[10], ke = w[11], c = w[12], h = w[13], d = w[14], C = Qa(J, Ae), A = C * Wr, C && (M = Math.cos(-C), E = Math.sin(-C), O = L * M + pe * E, K = z * M + xe * E, V = J * M + Ae * E, pe = L * -E + pe * M, xe = z * -E + xe * M, Ae = J * -E + Ae * M, ke = Ye * -E + ke * M, L = O, z = K, J = V), C = Qa(-P, Ae), m = C * Wr, C && (M = Math.cos(-C), E = Math.sin(-C), O = _ * M - pe * E, K = I * M - xe * E, V = P * M - Ae * E, ke = D * E + ke * M, _ = O, I = K, P = V), C = Qa(I, _), p = C * Wr, C && (M = Math.cos(C), E = Math.sin(C), O = _ * M + I * E, K = L * M + z * E, I = I * M - _ * E, z = z * M - L * E, _ = O, L = K), A && Math.abs(A) + Math.abs(p) > 359.9 && (A = p = 0, m = 180 - m), u = ai(Math.sqrt(_ * _ + I * I + P * P)), f = ai(Math.sqrt(z * z + J * J)), C = Qa(L, z), g = Math.abs(C) > 2e-4 ? C * Wr : 0, v = ke ? 1 / (ke < 0 ? -ke : ke) : 0), t.svg && (O = i.getAttribute("transform"), t.forceCSS = i.setAttribute("transform", "") || !uw(Vs(i, Yt)), O && i.setAttribute("transform", O))), Math.abs(g) > 90 && Math.abs(g) < 270 && (n ? (u *= -1, g += p <= 0 ? 180 : -180, p += p <= 0 ? 180 : -180) : (f *= -1, g += g <= 0 ? 180 : -180)), e = e || t.uncache, t.x = c - ((t.xPercent = c && (!e && t.xPercent || (Math.round(i.offsetWidth / 2) === Math.round(-c) ? -50 : 0))) ? i.offsetWidth * t.xPercent / 100 : 0) + r, t.y = h - ((t.yPercent = h && (!e && t.yPercent || (Math.round(i.offsetHeight / 2) === Math.round(-h) ? -50 : 0))) ? i.offsetHeight * t.yPercent / 100 : 0) + r, t.z = d + r, t.scaleX = ai(u), t.scaleY = ai(f), t.rotation = ai(p) + a, t.rotationX = ai(A) + a, t.rotationY = ai(m) + a, t.skewX = g + a, t.skewY = x + a, t.transformPerspective = v + r, (t.zOrigin = parseFloat(l.split(" ")[2]) || !e && t.zOrigin || 0) && (s[$i] = nd(l)), t.xOffset = t.yOffset = 0, t.force3D = ps.force3D, t.renderTransform = t.svg ? fD : ow ? dw : dD, t.uncache = 0, t
    },
    nd = i => (i = i.split(" "))[0] + " " + i[1],
    Nf = (i, e, t) => {
        let s = Ri(e);
        return ai(parseFloat(e) + parseFloat(Rn(i, "x", t + "px", s))) + s
    },
    dD = (i, e) => {
        e.z = "0px",
        e.rotationY = e.rotationX = "0deg",
        e.force3D = 0,
        dw(i, e)
    },
    kr = "0deg",
    cl = "0px",
    zr = ") ",
    dw = function(i, e) {
        let {xPercent: t, yPercent: s, x: n, y: r, z: a, rotation: o, rotationY: l, rotationX: c, skewX: h, skewY: d, scaleX: u, scaleY: f, transformPerspective: p, force3D: A, target: m, zOrigin: g} = e || this,
            x = "",
            v = A === "auto" && i && i !== 1 || A === !0;
        if (g && (c !== kr || l !== kr)) {
            let y = parseFloat(l) * Mo,
                S = Math.sin(y),
                w = Math.cos(y),
                C;
            y = parseFloat(c) * Mo,
            C = Math.cos(y),
            n = Nf(m, n, S * C * -g),
            r = Nf(m, r, -Math.sin(y) * -g),
            a = Nf(m, a, w * C * -g + g)
        }
        p !== cl && (x += "perspective(" + p + zr),
        (t || s) && (x += "translate(" + t + "%, " + s + "%) "),
        (v || n !== cl || r !== cl || a !== cl) && (x += a !== cl || v ? "translate3d(" + n + ", " + r + ", " + a + ") " : "translate(" + n + ", " + r + zr),
        o !== kr && (x += "rotate(" + o + zr),
        l !== kr && (x += "rotateY(" + l + zr),
        c !== kr && (x += "rotateX(" + c + zr),
        (h !== kr || d !== kr) && (x += "skew(" + h + ", " + d + zr),
        (u !== 1 || f !== 1) && (x += "scale(" + u + ", " + f + zr),
        m.style[Yt] = x || "translate(0, 0)"
    },
    fD = function(i, e) {
        let {xPercent: t, yPercent: s, x: n, y: r, rotation: a, skewX: o, skewY: l, scaleX: c, scaleY: h, target: d, xOrigin: u, yOrigin: f, xOffset: p, yOffset: A, forceCSS: m} = e || this,
            g = parseFloat(n),
            x = parseFloat(r),
            v,
            y,
            S,
            w,
            C;
        a = parseFloat(a),
        o = parseFloat(o),
        l = parseFloat(l),
        l && (l = parseFloat(l), o += l, a += l),
        a || o ? (a *= Mo, o *= Mo, v = Math.cos(a) * c, y = Math.sin(a) * c, S = Math.sin(a - o) * -h, w = Math.cos(a - o) * h, o && (l *= Mo, C = Math.tan(o - l), C = Math.sqrt(1 + C * C), S *= C, w *= C, l && (C = Math.tan(l), C = Math.sqrt(1 + C * C), v *= C, y *= C)), v = ai(v), y = ai(y), S = ai(S), w = ai(w)) : (v = c, w = h, y = S = 0),
        (g && !~(n + "").indexOf("px") || x && !~(r + "").indexOf("px")) && (g = Rn(d, "x", n, "px"), x = Rn(d, "y", r, "px")),
        (u || f || p || A) && (g = ai(g + u - (u * v + f * S) + p), x = ai(x + f - (u * y + f * w) + A)),
        (t || s) && (C = d.getBBox(), g = ai(g + t / 100 * C.width), x = ai(x + s / 100 * C.height)),
        C = "matrix(" + v + "," + y + "," + S + "," + w + "," + g + "," + x + ")",
        d.setAttribute("transform", C),
        m && (d.style[Yt] = C)
    },
    pD = function(i, e, t, s, n) {
        let r = 360,
            a = yi(n),
            o = parseFloat(n) * (a && ~n.indexOf("rad") ? Wr : 1),
            l = o - s,
            c = s + l + "deg",
            h,
            d;
        return a && (h = n.split("_")[1], h === "short" && (l %= r, l !== l % (r / 2) && (l += l < 0 ? r : -r)), h === "cw" && l < 0 ? l = (l + r * V0) % r - ~~(l / r) * r : h === "ccw" && l > 0 && (l = (l - r * V0) % r - ~~(l / r) * r)), i._pt = d = new Zi(i._pt, e, t, s, l, ZP), d.e = c, d.u = "deg", i._props.push(t), d
    },
    J0 = (i, e) => {
        for (let t in e)
            i[t] = e[t];
        return i
    },
    mD = (i, e, t) => {
        let s = J0({}, t._gsap),
            n = "perspective,force3D,transformOrigin,svgOrigin",
            r = t.style,
            a,
            o,
            l,
            c,
            h,
            d,
            u,
            f;
        s.svg ? (l = t.getAttribute("transform"), t.setAttribute("transform", ""), r[Yt] = e, a = Cc(t, 1), ma(t, Yt), t.setAttribute("transform", l)) : (l = getComputedStyle(t)[Yt], r[Yt] = e, a = Cc(t, 1), r[Yt] = l);
        for (o in Dn)
            l = s[o],
            c = a[o],
            l !== c && n.indexOf(o) < 0 && (u = Ri(l), f = Ri(c), h = u !== f ? Rn(t, o, l, f) : parseFloat(l), d = parseFloat(c), i._pt = new Zi(i._pt, a, o, h, d - h, rm), i._pt.u = f || 0, i._props.push(o));
        J0(a, s)
    };
ji("padding,margin,Width,Radius", (i, e) => {
    let t = "Top",
        s = "Right",
        n = "Bottom",
        r = "Left",
        a = (e < 3 ? [t, s, n, r] : [t + r, t + s, n + s, n + r]).map(o => e < 2 ? i + o : "border" + o + i);
    sd[e > 1 ? "border" + i : i] = function(o, l, c, h, d) {
        let u,
            f;
        if (arguments.length < 4)
            return u = a.map(p => Sn(o, p, c)), f = u.join(" "), f.split(u[0]).length === 5 ? u[0] : f;
        u = (h + "").split(" "),
        f = {},
        a.forEach((p, A) => f[p] = u[A] = u[A] || u[(A - 1) / 2 | 0]),
        o.init(l, f, d)
    }
});
const fw = {
    name: "css",
    register: om,
    targetTest(i) {
        return i.style && i.nodeType
    },
    init(i, e, t, s, n) {
        let r = this._props,
            a = i.style,
            o = t.vars.startAt,
            l,
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
            y,
            S,
            w,
            C;
        lg || om(),
        this.styles = this.styles || aw(i),
        C = this.styles.props,
        this.tween = t;
        for (p in e)
            if (p !== "autoRound" && (c = e[p], !(cs[p] && K_(p, e, t, s, i, n)))) {
                if (u = typeof c, f = sd[p], u === "function" && (c = c.call(t, s, i, n), u = typeof c), u === "string" && ~c.indexOf("random(") && (c = yc(c)), f)
                    f(this, i, p, c, t) && (w = 1);
                else if (p.substr(0, 2) === "--")
                    l = (getComputedStyle(i).getPropertyValue(p) + "").trim(),
                    c += "",
                    mr.lastIndex = 0,
                    mr.test(l) || (A = Ri(l), m = Ri(c)),
                    m ? A !== m && (l = Rn(i, p, l, m) + m) : A && (c += A),
                    this.add(a, "setProperty", l, c, s, n, 0, 0, p),
                    r.push(p),
                    C.push(p, 0, a[p]);
                else if (u !== "undefined") {
                    if (o && p in o ? (l = typeof o[p] == "function" ? o[p].call(t, s, i, n) : o[p], yi(l) && ~l.indexOf("random(") && (l = yc(l)), Ri(l + "") || l === "auto" || (l += ps.units[p] || Ri(Sn(i, p)) || ""), (l + "").charAt(1) === "=" && (l = Sn(i, p))) : l = Sn(i, p), d = parseFloat(l), g = u === "string" && c.charAt(1) === "=" && c.substr(0, 2), g && (c = c.substr(2)), h = parseFloat(c), p in rn && (p === "autoAlpha" && (d === 1 && Sn(i, "visibility") === "hidden" && h && (d = 0), C.push("visibility", 0, a.visibility), hr(this, a, "visibility", d ? "inherit" : "hidden", h ? "inherit" : "hidden", !h)), p !== "scale" && p !== "transform" && (p = rn[p], ~p.indexOf(",") && (p = p.split(",")[0]))), x = p in Dn, x) {
                        if (this.styles.save(p), v || (y = i._gsap, y.renderTransform && !e.parseTransform || Cc(i, e.parseTransform), S = e.smoothOrigin !== !1 && y.smooth, v = this._pt = new Zi(this._pt, a, Yt, 0, 1, y.renderTransform, y, 0, -1), v.dep = 1), p === "scale")
                            this._pt = new Zi(this._pt, y, "scaleY", y.scaleY, (g ? Co(y.scaleY, g + h) : h) - y.scaleY || 0, rm),
                            this._pt.u = 0,
                            r.push("scaleY", p),
                            p += "X";
                        else if (p === "transformOrigin") {
                            C.push($i, 0, a[$i]),
                            c = hD(c),
                            y.svg ? lm(i, c, 0, S, 0, this) : (m = parseFloat(c.split(" ")[2]) || 0, m !== y.zOrigin && hr(this, y, "zOrigin", y.zOrigin, m), hr(this, a, p, nd(l), nd(c)));
                            continue
                        } else if (p === "svgOrigin") {
                            lm(i, c, 1, S, 0, this);
                            continue
                        } else if (p in hw) {
                            pD(this, y, p, d, g ? Co(d, g + c) : c);
                            continue
                        } else if (p === "smoothOrigin") {
                            hr(this, y, "smooth", y.smooth, c);
                            continue
                        } else if (p === "force3D") {
                            y[p] = c;
                            continue
                        } else if (p === "transform") {
                            mD(this, c, i);
                            continue
                        }
                    } else
                        p in a || (p = Ho(p) || p);
                    if (x || (h || h === 0) && (d || d === 0) && !jP.test(c) && p in a)
                        A = (l + "").substr((d + "").length),
                        h || (h = 0),
                        m = Ri(c) || (p in ps.units ? ps.units[p] : A),
                        A !== m && (d = Rn(i, p, l, m)),
                        this._pt = new Zi(this._pt, x ? y : a, p, d, (g ? Co(d, g + h) : h) - d, !x && (m === "px" || p === "zIndex") && e.autoRound !== !1 ? eD : rm),
                        this._pt.u = m || 0,
                        A !== m && m !== "%" && (this._pt.b = l, this._pt.r = $P);
                    else if (p in a)
                        cD.call(this, i, p, l, g ? g + c : c);
                    else if (p in i)
                        this.add(i, p, l || i[p], g ? g + c : c, s, n);
                    else if (p !== "parseTransform") {
                        eg(p, c);
                        continue
                    }
                    x || (p in a ? C.push(p, 0, a[p]) : C.push(p, 1, l || i[p])),
                    r.push(p)
                }
            }
        w && tw(this)
    },
    render(i, e) {
        if (e.tween._time || !cg()) {
            let t = e._pt;
            for (; t;)
                t.r(i, t.d),
                t = t._next
        } else
            e.styles.revert()
    },
    get: Sn,
    aliases: rn,
    getSetter(i, e, t) {
        let s = rn[e];
        return s && s.indexOf(",") < 0 && (e = s), e in Dn && e !== $i && (i._gsap.x || Sn(i, "x")) ? t && H0 === t ? e === "scale" ? nD : sD : (H0 = t || {}) && (e === "scale" ? rD : aD) : i.style && !jA(i.style[e]) ? tD : ~e.indexOf("-") ? iD : ag(i, e)
    },
    core: {
        _removeProperty: ma,
        _getMatrix: ug
    }
};
ts.utils.checkPrefix = Ho;
ts.core.getStyleSaver = aw;
(function(i, e, t, s) {
    let n = ji(i + "," + e + "," + t, r => {
        Dn[r] = 1
    });
    ji(e, r => {
        ps.units[r] = "deg",
        hw[r] = 1
    }),
    rn[n[13]] = i + "," + e,
    ji(s, r => {
        let a = r.split(":");
        rn[a[1]] = n[a[0]]
    })
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
ji("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", i => {
    ps.units[i] = "px"
});
ts.registerPlugin(fw);
const re = ts.registerPlugin(fw) || ts;
re.core.Tween; /*!
 * paths 3.12.5
 * https://gsap.com
 *
 * Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/







let AD = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
    gD = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/ig,
    vD = Math.PI / 180,
    _h = Math.sin,
    wh = Math.cos,
    jl = Math.abs,
    hl = Math.sqrt,
    xD = i => typeof i == "number",
    j0 = 1e5,
    Xn = i => Math.round(i * j0) / j0 || 0;
function yD(i, e, t, s, n, r, a) {
    let o = i.length,
        l,
        c,
        h,
        d,
        u;
    for (; --o > -1;)
        for (l = i[o], c = l.length, h = 0; h < c; h += 2)
            d = l[h],
            u = l[h + 1],
            l[h] = d * e + u * s + r,
            l[h + 1] = d * t + u * n + a;
    return i._dirty = 1, i
}
function _D(i, e, t, s, n, r, a, o, l) {
    if (i === o && e === l)
        return;
    t = jl(t),
    s = jl(s);
    let c = n % 360 * vD,
        h = wh(c),
        d = _h(c),
        u = Math.PI,
        f = u * 2,
        p = (i - o) / 2,
        A = (e - l) / 2,
        m = h * p + d * A,
        g = -d * p + h * A,
        x = m * m,
        v = g * g,
        y = x / (t * t) + v / (s * s);
    y > 1 && (t = hl(y) * t, s = hl(y) * s);
    let S = t * t,
        w = s * s,
        C = (S * w - S * v - w * x) / (S * v + w * x);
    C < 0 && (C = 0);
    let M = (r === a ? -1 : 1) * hl(C),
        E = M * (t * g / s),
        _ = M * -(s * m / t),
        I = (i + o) / 2,
        P = (e + l) / 2,
        D = I + (h * E - d * _),
        L = P + (d * E + h * _),
        z = (m - E) / t,
        O = (g - _) / s,
        K = (-m - E) / t,
        V = (-g - _) / s,
        pe = z * z + O * O,
        xe = (O < 0 ? -1 : 1) * Math.acos(z / hl(pe)),
        Ae = (z * V - O * K < 0 ? -1 : 1) * Math.acos((z * K + O * V) / hl(pe * (K * K + V * V)));
    isNaN(Ae) && (Ae = u),
    !a && Ae > 0 ? Ae -= f : a && Ae < 0 && (Ae += f),
    xe %= f,
    Ae %= f;
    let Ye = Math.ceil(jl(Ae) / (f / 4)),
        ke = [],
        J = Ae / Ye,
        ue = 4 / 3 * _h(J / 2) / (1 + wh(J / 2)),
        Pe = h * t,
        Ee = d * t,
        it = d * -s,
        Ze = h * s,
        Qe;
    for (Qe = 0; Qe < Ye; Qe++)
        n = xe + Qe * J,
        m = wh(n),
        g = _h(n),
        z = wh(n += J),
        O = _h(n),
        ke.push(m - ue * g, g + ue * m, z + ue * O, O - ue * z, z, O);
    for (Qe = 0; Qe < ke.length; Qe += 2)
        m = ke[Qe],
        g = ke[Qe + 1],
        ke[Qe] = m * Pe + g * it + D,
        ke[Qe + 1] = m * Ee + g * Ze + L;
    return ke[Qe - 2] = o, ke[Qe - 1] = l, ke
}
function wD(i) {
    let e = (i + "").replace(gD, E => {
            let _ = +E;
            return _ < 1e-4 && _ > -1e-4 ? 0 : _
        }).match(AD) || [],
        t = [],
        s = 0,
        n = 0,
        r = 2 / 3,
        a = e.length,
        o = 0,
        l = "ERROR: malformed path: " + i,
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
        y,
        S,
        w,
        C,
        M = function(E, _, I, P) {
            x = (I - E) / 3,
            v = (P - _) / 3,
            A.push(E + x, _ + v, I - x, P - v, I, P)
        };
    if (!i || !isNaN(e[0]) || isNaN(e[1]))
        return console.log(l), t;
    for (c = 0; c < a; c++)
        if (S = f, isNaN(e[c]) ? (f = e[c].toUpperCase(), p = f !== e[c]) : c--, d = +e[c + 1], u = +e[c + 2], p && (d += s, u += n), c || (m = d, g = u), f === "M")
            A && (A.length < 8 ? t.length -= 1 : o += A.length),
            s = m = d,
            n = g = u,
            A = [d, u],
            t.push(A),
            c += 2,
            f = "L";
        else if (f === "C")
            A || (A = [0, 0]),
            p || (s = n = 0),
            A.push(d, u, s + e[c + 3] * 1, n + e[c + 4] * 1, s += e[c + 5] * 1, n += e[c + 6] * 1),
            c += 6;
        else if (f === "S")
            x = s,
            v = n,
            (S === "C" || S === "S") && (x += s - A[A.length - 4], v += n - A[A.length - 3]),
            p || (s = n = 0),
            A.push(x, v, d, u, s += e[c + 3] * 1, n += e[c + 4] * 1),
            c += 4;
        else if (f === "Q")
            x = s + (d - s) * r,
            v = n + (u - n) * r,
            p || (s = n = 0),
            s += e[c + 3] * 1,
            n += e[c + 4] * 1,
            A.push(x, v, s + (d - s) * r, n + (u - n) * r, s, n),
            c += 4;
        else if (f === "T")
            x = s - A[A.length - 4],
            v = n - A[A.length - 3],
            A.push(s + x, n + v, d + (s + x * 1.5 - d) * r, u + (n + v * 1.5 - u) * r, s = d, n = u),
            c += 2;
        else if (f === "H")
            M(s, n, s = d, n),
            c += 1;
        else if (f === "V")
            M(s, n, s, n = d + (p ? n - s : 0)),
            c += 1;
        else if (f === "L" || f === "Z")
            f === "Z" && (d = m, u = g, A.closed = !0),
            (f === "L" || jl(s - d) > .5 || jl(n - u) > .5) && (M(s, n, d, u), f === "L" && (c += 2)),
            s = d,
            n = u;
        else if (f === "A") {
            if (w = e[c + 4], C = e[c + 5], x = e[c + 6], v = e[c + 7], h = 7, w.length > 1 && (w.length < 3 ? (v = x, x = C, h--) : (v = C, x = w.substr(2), h -= 2), C = w.charAt(1), w = w.charAt(0)), y = _D(s, n, +e[c + 1], +e[c + 2], +e[c + 3], +w, +C, (p ? s : 0) + x * 1, (p ? n : 0) + v * 1), c += h, y)
                for (h = 0; h < y.length; h++)
                    A.push(y[h]);
            s = A[A.length - 2],
            n = A[A.length - 1]
        } else
            console.log(l);
    return c = A.length, c < 6 ? (t.pop(), c = 0) : A[0] === A[c - 2] && A[1] === A[c - 1] && (A.closed = !0), t.totalPoints = o + c, t
}
function ED(i) {
    xD(i[0]) && (i = [i]);
    let e = "",
        t = i.length,
        s,
        n,
        r,
        a;
    for (n = 0; n < t; n++) {
        for (a = i[n], e += "M" + Xn(a[0]) + "," + Xn(a[1]) + " C", s = a.length, r = 2; r < s; r++)
            e += Xn(a[r++]) + "," + Xn(a[r++]) + " " + Xn(a[r++]) + "," + Xn(a[r++]) + " " + Xn(a[r++]) + "," + Xn(a[r]) + " ";
        a.closed && (e += "z")
    }
    return e
} /*!
 * CustomEase 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/







let Xi,
    pw,
    mw = () => Xi || typeof window < "u" && (Xi = window.gsap) && Xi.registerPlugin && Xi,
    Z0 = () => {
        Xi = mw(),
        Xi ? (Xi.registerEase("_CE", Ei.create), pw = 1) : console.warn("Please gsap.registerPlugin(CustomEase)")
    },
    CD = 1e20,
    Eh = i => ~~(i * 1e3 + (i < 0 ? -.5 : .5)) / 1e3,
    SD = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/gi,
    MD = /[cLlsSaAhHvVtTqQ]/g,
    bD = i => {
        let e = i.length,
            t = CD,
            s;
        for (s = 1; s < e; s += 6)
            +i[s] < t && (t = +i[s]);
        return t
    },
    TD = (i, e, t) => {
        !t && t !== 0 && (t = Math.max(+i[i.length - 1], +i[1]));
        let s = +i[0] * -1,
            n = -t,
            r = i.length,
            a = 1 / (+i[r - 2] + s),
            o = -e || (Math.abs(+i[r - 1] - +i[1]) < .01 * (+i[r - 2] - +i[0]) ? bD(i) + n : +i[r - 1] + n),
            l;
        for (o ? o = 1 / o : o = -a, l = 0; l < r; l += 2)
            i[l] = (+i[l] + s) * a,
            i[l + 1] = (+i[l + 1] + n) * o
    },
    cm = function(i, e, t, s, n, r, a, o, l, c, h) {
        let d = (i + t) / 2,
            u = (e + s) / 2,
            f = (t + n) / 2,
            p = (s + r) / 2,
            A = (n + a) / 2,
            m = (r + o) / 2,
            g = (d + f) / 2,
            x = (u + p) / 2,
            v = (f + A) / 2,
            y = (p + m) / 2,
            S = (g + v) / 2,
            w = (x + y) / 2,
            C = a - i,
            M = o - e,
            E = Math.abs((t - a) * M - (s - o) * C),
            _ = Math.abs((n - a) * M - (r - o) * C),
            I;
        return c || (c = [{
            x: i,
            y: e
        }, {
            x: a,
            y: o
        }], h = 1), c.splice(h || c.length - 1, 0, {
            x: S,
            y: w
        }), (E + _) * (E + _) > l * (C * C + M * M) && (I = c.length, cm(i, e, d, u, g, x, S, w, l, c, h), cm(S, w, v, y, A, m, a, o, l, c, h + 1 + (c.length - I))), c
    };
class Ei {
    constructor(e, t, s)
    {
        pw || Z0(),
        this.id = e,
        this.setData(t, s)
    }
    setData(e, t)
    {
        t = t || {},
        e = e || "0,0,1,1";
        let s = e.match(SD),
            n = 1,
            r = [],
            a = [],
            o = t.precision || 1,
            l = o <= 1,
            c,
            h,
            d,
            u,
            f,
            p,
            A,
            m,
            g;
        if (this.data = e, (MD.test(e) || ~e.indexOf("M") && e.indexOf("C") < 0) && (s = wD(e)[0]), c = s.length, c === 4)
            s.unshift(0, 0),
            s.push(1, 1),
            c = 8;
        else if ((c - 2) % 6)
            throw "Invalid CustomEase";
        for ((+s[0] != 0 || +s[c - 2] != 1) && TD(s, t.height, t.originY), this.segment = s, u = 2; u < c; u += 6)
            h = {
                x: +s[u - 2],
                y: +s[u - 1]
            },
            d = {
                x: +s[u + 4],
                y: +s[u + 5]
            },
            r.push(h, d),
            cm(h.x, h.y, +s[u], +s[u + 1], +s[u + 2], +s[u + 3], d.x, d.y, 1 / (o * 2e5), r, r.length - 1);
        for (c = r.length, u = 0; u < c; u++)
            A = r[u],
            m = r[u - 1] || A,
            (A.x > m.x || m.y !== A.y && m.x === A.x || A === m) && A.x <= 1 ? (m.cx = A.x - m.x, m.cy = A.y - m.y, m.n = A, m.nx = A.x, l && u > 1 && Math.abs(m.cy / m.cx - r[u - 2].cy / r[u - 2].cx) > 2 && (l = 0), m.cx < n && (m.cx ? n = m.cx : (m.cx = .001, u === c - 1 && (m.x -= .001, n = Math.min(n, .001), l = 0)))) : (r.splice(u--, 1), c--);
        if (c = 1 / n + 1 | 0, f = 1 / c, p = 0, A = r[0], l) {
            for (u = 0; u < c; u++)
                g = u * f,
                A.nx < g && (A = r[++p]),
                h = A.y + (g - A.x) / A.cx * A.cy,
                a[u] = {
                    x: g,
                    cx: f,
                    y: h,
                    cy: 0,
                    nx: 9
                },
                u && (a[u - 1].cy = h - a[u - 1].y);
            a[c - 1].cy = r[r.length - 1].y - h
        } else {
            for (u = 0; u < c; u++)
                A.nx < u * f && (A = r[++p]),
                a[u] = A;
            p < r.length - 1 && (a[u - 1] = r[r.length - 2])
        }
        return this.ease = x => {
            let v = a[x * c | 0] || a[c - 1];
            return v.nx < x && (v = v.n), v.y + (x - v.x) / v.cx * v.cy
        }, this.ease.custom = this, this.id && Xi && Xi.registerEase(this.id, this.ease), this
    }
    getSVGData(e)
    {
        return Ei.getSVGData(this, e)
    }
    static create(e, t, s)
    {
        return new Ei(e, t, s).ease
    }
    static register(e)
    {
        Xi = e,
        Z0()
    }
    static get(e)
    {
        return Xi.parseEase(e)
    }
    static getSVGData(e, t)
    {
        t = t || {};
        let s = t.width || 100,
            n = t.height || 100,
            r = t.x || 0,
            a = (t.y || 0) + n,
            o = Xi.utils.toArray(t.path)[0],
            l,
            c,
            h,
            d,
            u,
            f,
            p,
            A,
            m,
            g;
        if (t.invert && (n = -n, a = 0), typeof e == "string" && (e = Xi.parseEase(e)), e.custom && (e = e.custom), e instanceof Ei)
            l = ED(yD([e.segment], s, 0, 0, -n, r, a));
        else {
            for (l = [r, a], p = Math.max(5, (t.precision || 1) * 200), d = 1 / p, p += 2, A = 5 / p, m = Eh(r + d * s), g = Eh(a + e(d) * -n), c = (g - a) / (m - r), h = 2; h < p; h++)
                u = Eh(r + h * d * s),
                f = Eh(a + e(h * d) * -n),
                (Math.abs((f - g) / (u - m) - c) > A || h === p - 1) && (l.push(m, g), c = (f - g) / (u - m)),
                m = u,
                g = f;
            l = "M" + l.join(",")
        }
        return o && o.setAttribute("d", l), l
    }
}
mw() && Xi.registerPlugin(Ei);
Ei.version = "3.12.5"; /*!
 * CustomWiggle 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/







let an,
    hm,
    Zl,
    Aw = () => an || typeof window < "u" && (an = window.gsap) && an.registerPlugin && an,
    bo = {
        easeOut: "M0,1,C0.7,1,0.6,0,1,0",
        easeInOut: "M0,0,C0.1,0,0.24,1,0.444,1,0.644,1,0.6,0,1,0",
        anticipate: "M0,0,C0,0.222,0.024,0.386,0,0.4,0.18,0.455,0.65,0.646,0.7,0.67,0.9,0.76,1,0.846,1,1",
        uniform: "M0,0,C0,0.95,0,1,0,1,0,1,1,1,1,1,1,1,1,0,1,0"
    },
    ID = i => i,
    gw = i => {
        if (!hm)
            if (an = Aw(), Zl = an && an.parseEase("_CE"), Zl) {
                for (let e in bo)
                    bo[e] = Zl("", bo[e]);
                hm = 1,
                $l("wiggle").config = e => typeof e == "object" ? $l("", e) : $l("wiggle(" + e + ")", {
                    wiggles: +e
                })
            } else
                i && console.warn("Please gsap.registerPlugin(CustomEase, CustomWiggle)")
    },
    $0 = (i, e) => (typeof i != "function" && (i = an.parseEase(i) || Zl("", i)), i.custom || !e ? i : t => 1 - i(t)),
    $l = (i, e) => {
        hm || gw(1),
        e = e || {};
        let t = (e.wiggles || 10) | 0,
            s = 1 / t,
            n = s / 2,
            r = e.type === "anticipate",
            a = bo[e.type] || bo.easeOut,
            o = ID,
            l = 1e3,
            c,
            h,
            d,
            u,
            f,
            p,
            A,
            m,
            g;
        {
            if (r && (o = a, a = bo.easeOut), e.timingEase && (o = $0(e.timingEase)), e.amplitudeEase && (a = $0(e.amplitudeEase, !0)), p = o(n), A = r ? -a(n) : a(n), m = [0, 0, p / 4, 0, p / 2, A, p, A], e.type === "random") {
                for (m.length = 4, c = o(s), h = Math.random() * 2 - 1, g = 2; g < t; g++)
                    n = c,
                    A = h,
                    c = o(s * g),
                    h = Math.random() * 2 - 1,
                    d = Math.atan2(h - m[m.length - 3], c - m[m.length - 4]),
                    u = Math.cos(d) * s,
                    f = Math.sin(d) * s,
                    m.push(n - u, A - f, n, A, n + u, A + f);
                m.push(c, 0, 1, 0)
            } else {
                for (g = 1; g < t; g++)
                    m.push(o(n + s / 2), A),
                    n += s,
                    A = (A > 0 ? -1 : 1) * a(g * s),
                    p = o(n),
                    m.push(o(n - s / 2), A, p, A);
                m.push(o(n + s / 4), A, o(n + s / 4), 0, 1, 0)
            }
            for (g = m.length; --g > -1;)
                m[g] = ~~(m[g] * l) / l;
            return m[2] = "C" + m[2], Zl(i, "M" + m.join(","))
        }
    };
class dg {
    constructor(e, t)
    {
        this.ease = $l(e, t)
    }
    static create(e, t)
    {
        return $l(e, t)
    }
    static register(e)
    {
        an = e,
        gw()
    }
}
Aw() && an.registerPlugin(dg);
dg.version = "3.12.5"; /*!
 * CustomBounce 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/







let on,
    vw,
    rd,
    xw = () => on || typeof window < "u" && (on = window.gsap) && on.registerPlugin && on,
    yw = i => {
        on = xw(),
        rd = on && on.parseEase("_CE"),
        rd ? (vw = 1, on.parseEase("bounce").config = e => typeof e == "object" ? ad("", e) : ad("bounce(" + e + ")", {
            strength: +e
        })) : i && console.warn("Please gsap.registerPlugin(CustomEase, CustomBounce)")
    },
    ex = i => {
        let e = i.length,
            t = 1 / i[e - 2],
            s = 1e3,
            n;
        for (n = 2; n < e; n += 2)
            i[n] = ~~(i[n] * t * s) / s;
        i[e - 2] = 1
    },
    ad = (i, e) => {
        vw || yw(1),
        e = e || {};
        {
            let t = .999,
                s = Math.min(t, e.strength || .7),
                n = s,
                r = (e.squash || 0) / 100,
                a = r,
                o = 1 / .03,
                l = .2,
                c = 1,
                h = .1,
                d = [0, 0, .07, 0, .1, 1, .1, 1],
                u = [0, 0, 0, 0, .1, 0, .1, 0],
                f,
                p,
                A,
                m,
                g,
                x,
                v;
            for (g = 0; g < 200 && (l *= n * ((n + 1) / 2), c *= s * s, x = h + l, A = h + l * .49, m = 1 - c, f = h + c / o, p = A + (A - f) * .8, r && (h += r, f += r, A += r, p += r, x += r, v = r / a, u.push(h - r, 0, h - r, v, h - r / 2, v, h, v, h, 0, h, 0, h, v * -.6, h + (x - h) / 6, 0, x, 0), d.push(h - r, 1, h, 1, h, 1), r *= s * s), d.push(h, 1, f, m, A, m, p, m, x, 1, x, 1), s *= .95, o = c / (x - p), h = x, !(m > t)); g++)
                ;
            if (e.endAtStart && e.endAtStart !== "false") {
                if (A = -.1, d.unshift(A, 1, A, 1, -.07, 0), a)
                    for (r = a * 2.5, A -= r, d.unshift(A, 1, A, 1, A, 1), u.splice(0, 6), u.unshift(A, 0, A, 0, A, 1, A + r / 2, 1, A + r, 1, A + r, 0, A + r, 0, A + r, -.6, A + r + .033, 0), g = 0; g < u.length; g += 2)
                        u[g] -= A;
                for (g = 0; g < d.length; g += 2)
                    d[g] -= A,
                    d[g + 1] = 1 - d[g + 1]
            }
            return r && (ex(u), u[2] = "C" + u[2], rd(e.squashID || i + "-squash", "M" + u.join(","))), ex(d), d[2] = "C" + d[2], rd(i, "M" + d.join(","))
        }
    };
class fg {
    constructor(e, t)
    {
        this.ease = ad(e, t)
    }
    static create(e, t)
    {
        return ad(e, t)
    }
    static register(e)
    {
        on = e,
        yw()
    }
}
xw() && on.registerPlugin(fg);
fg.version = "3.12.5";
