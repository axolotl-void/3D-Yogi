const ty = {
    igloo: F3,
    cubes: aF,
    entry: UF
};
class jF {
    constructor(e)
    {
        this.options = e,
        this.isFirstNavigation = !0,
        this.currentSection = null,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.scroll = {
            total: 0,
            targetY1: 0,
            targetY2: 0,
            y: 0,
            velocity: 0
        },
        this.autoCenter = {
            needed: !1,
            animating: !1,
            lastTarget: 0,
            lastTime: 0
        },
        this.scrollMultiplier = 75e-5,
        this.scrollBlocked = !1,
        this.detailIndex = 0,
        this.isDetailOpen = !1,
        this.scrollComposers = [],
        this.detailScene = null,
        this.detailComposer = null,
        this.init()
    }
    async init()
    {
        this.initGlobalPlane(),
        await this.createScenes(),
        this.audioController = new u3(this),
        he.renderPass.scene.beforeRenderCbs.push(() => {
            this.render()
        }),
        Q.on("resize", this.resize, this),
        Q.on("webgl_router_request_switch_scene", this.navigateToSection, this),
        this.scrollComposers.forEach(e => e.render()),
        this.isReady()
    }
    round(e)
    {
        return ie.round(e, 2)
    }
    initGlobalPlane()
    {
        const e = Si.triangle;
        this.material = new f3,
        this.materialLoad = new p3,
        this.mainMesh = new Ce(e, this.material),
        this.mainMesh.frustumCulled = !1,
        this.mainMesh.name = "Main triangle mesh",
        he.renderPass.scene.add(this.mainMesh),
        this.mainMesh.material = this.material,
        he.renderPass.scene._upload(),
        this.mainMesh.material = this.materialLoad,
        he.renderPass.scene._upload()
    }
    async createScenes()
    {
        this.uiScene = new GF({
            mainController: this
        }),
        this.uiPass = new h3(this.uiScene, this.uiScene.camera, void 0, !1, !1),
        this.uiPass.clear = !1,
        he.composer.addPass(this.uiPass),
        Object.keys(ty).forEach(e => {
            this.scrollComposers.push(new tA({
                scene: new ty[e]({
                    mainController: this
                })
            }))
        }),
        this.detailScene = new JF({
            mainController: this
        }),
        this.detailComposer = new tA({
            scene: this.detailScene
        }),
        await Promise.all([this.uiScene.uploaded, ...this.scrollComposers.map(e => e.passes[0].scene.uploaded), this.detailComposer.passes[0].scene.uploaded]),
        this.uiScene.projects.setMouseSim(this.detailScene.mouseSim)
    }
    render()
    {
        var u,
            f;
        this.scroll.targetY2 !== this.autoCenter.lastTarget && (this.autoCenter.needed = !0, this.autoCenter.lastTarget = this.scroll.targetY2, this.autoCenter.lastTime = Fe.time);
        const e = this.scroll.y;
        this.scroll.targetY1 = ie.lerpFPSLimited(this.scroll.targetY1, this.scroll.targetY2, .075, 100 * this.scrollMultiplier),
        this.scroll.y = ie.lerpFPS(this.scroll.y, this.scroll.targetY1, .15);
        const t = 750 * this.scrollMultiplier;
        this.scroll.targetY2 = ie.clamp(this.scroll.targetY2, this.scroll.y - t, this.scroll.y + t),
        Math.abs(this.scroll.y - this.scroll.targetY2) < .1 * this.scrollMultiplier && (this.scroll.y = this.scroll.targetY2, this.scroll.targetY1 = this.scroll.targetY2),
        this.scroll.velocity += Math.abs(this.scroll.y - e) * 1,
        this.scroll.velocity *= ie.frictionFPS(.98),
        this.scroll.velocity = ie.clamp(this.scroll.velocity, 0, 1),
        Math.abs(this.scroll.velocity) < .001 && (this.scroll.velocity = 0),
        this.scroll.total = 0,
        this.scrollComposers.forEach(p => {
            const A = p.passes[0].scene;
            A.__top = this.scroll.total,
            A.__bottom = A.__top + A.height,
            this.scroll.total += A.height
        });
        const s = this.scroll.y % this.scroll.total,
            n = this.scroll.y >= 0 ? s : this.scroll.total - Math.abs(s),
            r = n + 1,
            a = r % this.scroll.total;
        let o = null,
            l = null,
            c = 0;
        for (let p = 0; p < this.scrollComposers.length; p++) {
            const A = this.scrollComposers[p].passes[0].scene,
                m = this.round(n),
                g = this.round(a),
                x = m >= A.__top && m < A.__bottom,
                v = g > A.__top && g <= A.__bottom;
            if (x || v) {
                const y = x ? r : a,
                    S = A.__bottom - A.__top;
                A.progress = (y - A.__top) / (S + 1),
                x ? o = p : (l = p, c = a - A.__top),
                A.isSceneVisible = !0
            } else
                A.isSceneVisible = !1
        }
        const h = this.material.uniforms.uDetailProgress.value > 0;
        if (this.material.uniforms.uDetailProgress.value === 1 || (o !== null && (this.scrollComposers[o].render(), this.material.uniforms.tScene1.value = this.scrollComposers[o].readBuffer.texture, this.materialLoad.uniforms.tScene.value = this.scrollComposers[o].readBuffer.texture), l !== null && (this.scrollComposers[l].render(), this.material.uniforms.tScene2.value = this.scrollComposers[l].readBuffer.texture)), this.material.uniforms.uProgress.value = c, this.material.uniforms.uProgressVel.value = this.scroll.velocity, this.autoCenter.needed && !this.autoCenter.animating && Fe.time - this.autoCenter.lastTime > 1.4) {
            this.autoCenter.needed = !1;
            const p = this.scroll.targetY2 % this.scroll.total,
                A = this.scroll.targetY2 >= 0 ? p : this.scroll.total - Math.abs(p),
                m = (A + 1) % this.scroll.total;
            if (c % 1 !== 0) {
                const g = ["Top", "Bottom"];
                let x = 1 / 0,
                    v = 0;
                if ([o, l].forEach(M => {
                    if (M === null)
                        return;
                    const E = {};
                    E.sceneTop = this.scrollComposers[M].passes[0].scene.__top,
                    E.sceneBottom = this.scrollComposers[M].passes[0].scene.__bottom,
                    E.screenTop = A > m ? A - this.scroll.total : A,
                    E.screenBottom = E.screenTop + 1,
                    g.forEach(_ => {
                        g.forEach(I => {
                            const P = E[`scene${_}`] - E[`screen${I}`];
                            Math.abs(P) < x && (x = Math.abs(P), v = P)
                        })
                    })
                }), v === 0)
                    return;
                let y = this.scroll.targetY2 + v,
                    S = 2;
                const w = v < 0 ? o : l,
                    C = this.scrollComposers[w].passes[0].scene;
                if (typeof C.initialScrollAutocenter == "number" && typeof C.finalScrollAutocenter == "number") {
                    const M = 1 / (C.height + 1),
                        _ = ((w === o ? 1 - C.finalScrollAutocenter : C.initialScrollAutocenter) - M) * (C.height + 1);
                    y += _ * Math.sign(v),
                    S += _ * 2
                }
                this.centerScroll(y, S)
            } else
                o !== null && ((f = (u = this.scrollComposers[o].passes[0].scene) == null ? void 0 : u.autoCenter) == null || f.call(u, this, A))
        }
        this.material.uniforms.tCubes.value = this.scrollComposers[1].readBuffer.texture,
        this.material.uniforms.uInCubes.value = o === 1,
        h && (this.detailComposer.render(), this.material.uniforms.tDetail.value = this.detailComposer.readBuffer.texture, this.materialLoad.uniforms.tScene.value = this.detailComposer.readBuffer.texture)
    }
    centerScroll(e, t)
    {
        const s = this.round(e);
        this.autoCenter.animating = !0,
        re.to(this.scroll, {
            y: s,
            duration: t,
            ease: "inOut3",
            overwrite: !0,
            onUpdate: () => {
                this.scroll.targetY1 = this.scroll.y,
                this.scroll.targetY2 = this.scroll.y,
                this.autoCenter.lastTarget = this.scroll.y
            },
            onComplete: () => {
                this.autoCenter.animating = !1
            }
        })
    }
    resize()
    {
        this.stopAutoCenter(),
        this.scroll.targetY2 = this.scroll.y,
        this.scroll.targetY1 = this.scroll.y,
        this.autoCenter.lastTarget = 1 / 0
    }
    centerDetailScene(e=1)
    {
        const t = this.scrollComposers[1].passes[0].scene;
        (!this.scrollComposers[1].passes[0].scene.isSceneVisible || e === 0) && (this.scroll.y = this.scrollComposers[0].passes[0].scene.height, this.resize(), t.progress = 1 / (t.height + 1));
        const n = (t.cubes[this.detailIndex].options.centeredProgress - t.progress) * (t.height + 1),
            r = Math.abs(n);
        let a = 0;
        return e > 0 && (a = ie.ease(ie.fit(r, 0, .2, .05, 1), "expo.out") * 1.5), this.centerScroll(this.scroll.y + n, a), a
    }
    start()
    {
        Q.emit("webgl_render_active", !0),
        Q.emit("webgl_router_start")
    }
    async navigateToSection(e="home", t="/", s={})
    {
        if (this.currentSection !== e) {
            if (Q.emit("webgl_router_block_navigation", !0), e === "home")
                this.isFirstNavigation ? (this.isFirstNavigation = !1, this.mainMesh.material = this.materialLoad, await Promise.all([re.fromTo(this.materialLoad.uniforms.uIntro, {
                    value: 0
                }, {
                    value: 1,
                    duration: 1,
                    ease: "inOut3"
                }), this.scrollComposers[0].passes[0].scene.playInAnimation()]), this.mainMesh.material = this.material, this.enableScroll()) : (this.centerDetailScene(0), this.detailIndex = 0, re.to(this.material.uniforms.uDetailProgress, {
                    overwrite: !0,
                    value: 0,
                    ease: "power2.out",
                    duration: 1.25
                }), re.to(this.material.uniforms.uDetailProgress2, {
                    overwrite: !0,
                    value: 0,
                    ease: "power2.out",
                    duration: .6
                }), this.scrollComposers[1].passes[0].scene.detailAnimationOut(), this.detailScene.playOutAnimation(), Q.emit("webgl_play_audio", "leave-project"), await re.delayedCall(1, () => {
                    this.isDetailOpen = !1,
                    this.enableScroll()
                }));
            else {
                const n = Be.cubes.find(r => r.hash === s.project);
                if (!n || this.isDetailOpen || !this.isFirstNavigation && !this.scrollComposers[1].passes[0].scene.isSceneVisible)
                    return Q.emit("webgl_router_block_navigation", !1), Promise.resolve().then(() => Q.emit("webgl_switch_scene", ""));
                if (this.isDetailOpen = !0, this.detailIndex = Be.cubes.indexOf(n), this.disableScroll(), this.isFirstNavigation)
                    this.isFirstNavigation = !1,
                    this.scrollComposers[0].passes[0].scene.introTL.progress(1),
                    this.centerDetailScene(0),
                    re.set(this.material.uniforms.uDetailProgress, {
                        overwrite: !0,
                        value: 1
                    }),
                    re.set(this.material.uniforms.uDetailProgress2, {
                        overwrite: !0,
                        value: 1
                    }),
                    this.scrollComposers[1].passes[0].scene.detailAnimationIn(0),
                    this.mainMesh.material = this.materialLoad,
                    this.detailScene.playInAnimation(this.detailIndex, 0),
                    await re.fromTo(this.materialLoad.uniforms.uIntro, {
                        value: 0
                    }, {
                        value: 1,
                        duration: 1,
                        ease: "power2.inOut"
                    }),
                    this.material.uniforms.uProgress.value = 0,
                    this.material.uniforms.uInCubes.value = !0,
                    this.mainMesh.material = this.material;
                else {
                    const a = this.centerDetailScene() * .5;
                    re.to(this.material.uniforms.uDetailProgress, {
                        overwrite: !0,
                        value: 1,
                        ease: "power3.in",
                        delay: a,
                        duration: 1.25
                    }),
                    re.to(this.material.uniforms.uDetailProgress2, {
                        overwrite: !0,
                        value: 1,
                        ease: "sine.out",
                        delay: a + .75,
                        duration: 1.25
                    }),
                    this.scrollComposers[1].passes[0].scene.detailAnimationIn(a),
                    this.detailScene.playInAnimation(this.detailIndex, a),
                    Q.emit("webgl_play_audio", "click-project"),
                    re.delayedCall(a, () => {
                        Q.emit("webgl_play_audio", "enter-project")
                    }),
                    await Sc.wait(a + .75 + 1.25)
                }
            }
            this.currentSection = e,
            Q.emit("webgl_router_block_navigation", !1)
        }
    }
    enableScroll()
    {
        Q.on("wheel", this.onScroll, this),
        Q.on("keydown", this.onKeyDown, this),
        Q.on("touch_drag", this.onTouchDrag, this)
    }
    disableScroll()
    {
        Q.off("wheel", this.onScroll, this),
        Q.off("keydown", this.onKeyDown, this),
        Q.off("touch_drag", this.onTouchDrag, this)
    }
    onScroll(e)
    {
        this.scrollBlocked || (this.stopAutoCenter(), this.scroll.targetY2 += e.delta.y * this.scrollMultiplier)
    }
    onKeyDown(e)
    {
        this.scrollBlocked || (this.stopAutoCenter(), e.key === "ArrowDown" && (this.scroll.targetY2 += 150 * this.scrollMultiplier), e.key === "ArrowUp" && (this.scroll.targetY2 -= 150 * this.scrollMultiplier))
    }
    onTouchDrag(e)
    {
        this.scrollBlocked || (this.stopAutoCenter(), this.scroll.targetY2 += e.delta11.y * 1.25)
    }
    stopAutoCenter()
    {
        this.autoCenter.animating && (re.killTweensOf(this.scroll), this.autoCenter.animating = !1)
    }
}
