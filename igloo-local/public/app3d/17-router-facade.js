function ZF(i) {
    let e;
    return {
        c() {
            e = Tp("div"),
            e.textContent = "Seems like WebGL2 is not supported by your browser 😰 Please update it to access the experience."
        },
        m(t, s) {
            $r(t, e, s)
        },
        p: qh,
        i: qh,
        o: qh,
        d(t) {
            t && ea(e)
        }
    }
}
class $F extends CA {
    constructor(e)
    {
        super(),
        SA(this, e, null, ZF, MA, {})
    }
}
function eN(i) {
    const e = new a3({
        base: "",
        routes: [{
            path: "/",
            data: {
                scene: "home"
            }
        }, {
            path: "/portfolio/:project",
            data: {
                scene: "project"
            }
        }],
        onChange: t => {
            Q.emit("webgl_router_request_switch_scene", t.scene, t.path, t.params)
        }
    });
    return Q.on("webgl_switch_scene", t => e.go(t)), Q.on("webgl_router_block_navigation", t => e.blocked = t), Q.once("webgl_router_start", () => e.start()), []
}
class tN extends CA {
    constructor(e)
    {
        super(),
        SA(this, e, eN, null, MA, {})
    }
}
function iy(i) {
    let e,
        t;
    return e = new $F({}), {
        c() {
            ny(e.$$.fragment)
        },
        m(s, n) {
            ry(e, s, n),
            t = !0
        },
        i(s) {
            t || (ir(e.$$.fragment, s), t = !0)
        },
        o(s) {
            ho(e.$$.fragment, s),
            t = !1
        },
        d(s) {
            ay(e, s)
        }
    }
}
function sy(i) {
    let e,
        t,
        s,
        n,
        r,
        a;
    return r = new tN({}), {
        c() {
            e = Tp("div"),
            t = Ip(),
            s = Tp("style"),
            s.textContent = `/* js */
                    div#webgl {
                        display: block;
                        position: absolute;
                        width: 100%;
                        height: 100%;
                    }`,
            n = Ip(),
            ny(r.$$.fragment),
            UE(e, "id", "webgl")
        },
        m(o, l) {
            $r(o, e, l),
            i[6](e),
            $r(o, t, l),
            $r(o, s, l),
            $r(o, n, l),
            ry(r, o, l),
            a = !0
        },
        p: qh,
        i(o) {
            a || (ir(r.$$.fragment, o), a = !0)
        },
        o(o) {
            ho(r.$$.fragment, o),
            a = !1
        },
        d(o) {
            o && ea(e),
            i[6](null),
            o && ea(t),
            o && ea(s),
            o && ea(n),
            ay(r, o)
        }
    }
}
function iN(i) {
    let e,
        t,
        s,
        n = i[2] && iy(),
        r = i[1] && sy(i);
    return {
        c() {
            n && n.c(),
            e = Ip(),
            r && r.c(),
            t = DE()
        },
        m(a, o) {
            n && n.m(a, o),
            $r(a, e, o),
            r && r.m(a, o),
            $r(a, t, o),
            s = !0
        },
        p(a, [o]) {
            a[2] ? n ? o & 4 && ir(n, 1) : (n = iy(), n.c(), ir(n, 1), n.m(e.parentNode, e)) : n && (Lg(), ho(n, 1, 1, () => {
                n = null
            }), Ug()),
            a[1] ? r ? (r.p(a, o), o & 2 && ir(r, 1)) : (r = sy(a), r.c(), ir(r, 1), r.m(t.parentNode, t)) : r && (Lg(), ho(r, 1, 1, () => {
                r = null
            }), Ug())
        },
        i(a) {
            s || (ir(n), ir(r), s = !0)
        },
        o(a) {
            ho(n),
            ho(r),
            s = !1
        },
        d(a) {
            n && n.d(a),
            a && ea(e),
            r && r.d(a),
            a && ea(t)
        }
    }
}
function sN(i, e, t) {
    let s = null;
    const n = new Promise(u => {
        s = u
    });
    let {interactionNode: r=null} = e,
        {relativePath: a=""} = e,
        o = null,
        l = !1,
        c = !1;
    const h = async () => {};
    RE(async () => {
        if (!q.capabilities.webgl2) {
            s(() => !1),
            t(2, c = !0);
            return
        }
        t(1, l = !0),
        await Promise.all([LE(), h()]),
        Ei.create("inOut5", "M0,0 C0.171,0 0.77,-0.013 0.842,0.272 0.972,0.794 0.972,0.85 1,1"),
        Ei.create("entry_ease", "M0,0 C0.358,0 0.336,0.209 0.442,0.519 0.59,0.952 0.768,0.918 1,1", {
            precision: 2
        }),
        Ei.create("entry_ease_2", "M0,0 C0.388,0.082 0.924,0.862 1,1", {
            precision: 2
        }),
        Ei.create("entry_ease_3", "M0,0 C0.272,0 0.472,0.454 0.496,0.496 0.66,0.79 0.685,1 1,1", {
            precision: 2
        }),
        Ei.create("igloo_ease_1", "M0,0 C0.662,0.073 0.047,1 1,1", {
            precision: 2
        });
        const u = window.devicePixelRatio <= 2 ? Math.min(window.devicePixelRatio, 1.15) : Math.min(window.devicePixelRatio, 1.5);
        await he.init({
            canvasCnt: o,
            interactionNode: r,
            relativePath: a,
            fingers: 2,
            audioContext: !0,
            contextMenu: !1,
            DPR: u || 1,
            adaptiveDPR: !0,
            shadowMap: !0,
            shadowMapType: ly
        });
        {
            const f = new jF;
            await f.ready,
            f.start(),
            s(() => !0)
        }
    });
    function d(u) {
        FE[u ? "unshift" : "push"](() => {
            o = u,
            t(0, o)
        })
    }
    return i.$$set = u => {
        "interactionNode" in u && t(4, r = u.interactionNode),
        "relativePath" in u && t(5, a = u.relativePath)
    }, [o, l, c, n, r, a, d]
}
class uN extends CA {
    constructor(e)
    {
        super(),
        SA(this, e, sN, iN, MA, {
            ready: 3,
            interactionNode: 4,
            relativePath: 5
        })
    }
    get ready()
    {
        return this.$$.ctx[3]
    }
}
export { uN as default };
