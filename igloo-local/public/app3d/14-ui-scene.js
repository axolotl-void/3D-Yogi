class LF {
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
        this.mesh = new Ui({
            font: "IBMPlexMono-Medium",
            text: "YOGI",
            width: 1,
            align: "left",
            lineHeight: .8,
            size: .13
        }, {
            uniforms: {
                uColor: {
                    value: new Z(Be.colorLogo)
                },
                uWeight: {
                    value: .025
                },
                uShow: {
                    value: q.devScene ? 1 : 0
                }
            },
            vertexShader: `
                            ${Nt}
                            ${Ue}

                            attribute vec3 textWeights;
                            uniform float uShow;

                            varying vec2 vUv;
                            varying float vAlpha;

                            void main() {
                                float show = clamp(uShow, 0.0, 1.0);
                                vUv = uv;
                                vAlpha = falloff(textWeights.x, 0.0, 1.0, 0.1, show);
                                gl_Position = projectionMatrix * viewMatrix * billboardModelMatrix() * vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            ${ii}
                            ${Ht}
                            ${Ue}

                            uniform sampler2D tMap;
                            uniform vec3 uColor;
                            uniform float uWeight;

                            varying vec2 vUv;
                            varying float vAlpha;

                            void main() {
                                float signedDist = median(tMap, vUv);
                                float edge = fwidth(signedDist);
                                float alpha = vAlpha * smoothstep(-edge - uWeight, edge - uWeight, signedDist);
                                gl_FragColor = vec4(uColor, alpha);
                            }
                        `,
            depthWrite: !1,
            depthTest: !1,
            transparent: !0
        }),
        await this.mesh.ready,
        this.mesh.geometry.boundingBox || this.mesh.geometry.computeBoundingBox();
        const t = this.mesh.geometry.boundingBox;
        this.mesh.geometry.translate(-t.min.x, -t.max.y, 0),
        this.mesh.name = "logo",
        this.mesh.frustumCulled = !1,
        this.mesh.renderOrder = 10,
        this.scene.add(this.mesh),
        this.interaction = new Er({
            meshes: [this.mesh],
            camera: this.scene.camera,
            onHover: t => {
                t.action === "hover_in" && (this.show(.25, 0), Q.emit("webgl_hover_logo"), Q.emit("webgl_play_audio", "logo"))
            }
        }),
        Q.once("webgl_show_ui_intro", () => {
            this.interaction.enable(),
            this.show(),
            Q.emit("webgl_play_audio", "logo")
        }),
        q.devScene && this.interaction.enable(),
        this.isReady()
    }
    show(e=.5, t=.75)
    {
        re.fromTo(this.mesh.material.uniforms.uShow, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: e,
            ease: "none",
            overwrite: !0
        })
    }
    resize()
    {
        const e = this.scene.mobile ? 140 : this.scene.small ? 160 : 200,
            t = e * .27,
            s = this.mesh.size.x || 1,
            n = this.mesh.size.y || 1,
            r = Math.min(e / s, t / n);
        this.mesh.scale.set(r, r, 1),
        this.mesh.position.set(this.scene.meshMarginLeft, -this.scene.meshMarginTop, 0)
    }
}
class FF {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.options = {
            width: .6,
            align: "left",
            lineHeight: .8,
            size: .09
        },
        this.init()
    }
    async init()
    {
        this.message = new Ui({
            font: "IBMPlexMono-Medium",
            text: Be.scroll,
            width: this.options.width,
            align: this.options.align,
            lineHeight: this.options.lineHeight,
            size: this.options.size
        }, {
            uniforms: {
                tMap: {
                    value: le.load("../fonts/IBMPlexMono-Medium-datatexture.ktx2", "data")
                },
                uColor: {
                    value: new Z(Be.colorText)
                },
                uShow1: {
                    value: q.devScene ? 1 : 0
                },
                uShow2: {
                    value: q.devScene ? 1 : 0
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
            depthTest: !1
        }),
        this.message.name = "message",
        this.message.frustumCulled = !1,
        this.message.renderOrder = 999,
        this.scene.add(this.message),
        await Promise.all([this.message.ready]),
        Q.once("webgl_show_ui_intro", () => {
            this.show()
        }),
        this.isReady()
    }
    show(e=.5, t=1)
    {
        re.fromTo(this.message.material.uniforms.uShow1, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: .4,
            ease: "sine.out",
            overwrite: !0
        }),
        re.fromTo(this.message.material.uniforms.uShow2, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: .75,
            ease: "sine.out",
            overwrite: !0
        })
    }
    hide()
    {
        re.to(this.message.material.uniforms.uShow1, {
            value: 0,
            duration: .5,
            ease: "sine.out",
            overwrite: !0,
            onComplete: () => {
                this.message.visible = !1
            }
        }),
        re.to(this.message.material.uniforms.uShow2, {
            value: 1
        }, {
            value: 0,
            duration: .4,
            ease: "sine.out",
            overwrite: !0
        }),
        this.message.material.uniforms.uShow1.value > 0 && Q.emit("webgl_play_audio", "ui-short")
    }
    resize()
    {
        const e = this.scene.small ? 180 : 230,
            t = e;
        this.message.scale.set(e, t, 1),
        this.message.position.set(this.scene.meshMarginLeft, -q.screen.height + this.scene.meshMarginTop + this.message.size.y * 1.75 * t, 0)
    }
}
class NF {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.options = {
            width: 1,
            align: "left",
            lineHeight: .8,
            size: .09
        },
        this.init()
    }
    async init()
    {
        this.sound = new Ui({
            font: "IBMPlexMono-Medium",
            text: "Sound:",
            width: this.options.width,
            align: this.options.align,
            lineHeight: this.options.lineHeight,
            size: this.options.size
        }, {
            uniforms: {
                tMap: {
                    value: le.load("../fonts/IBMPlexMono-Medium-datatexture.ktx2", "data")
                },
                uColor: {
                    value: new Z(Be.colorText)
                },
                uShow1: {
                    value: q.devScene ? 1 : 0
                },
                uShow2: {
                    value: q.devScene ? 1 : 0
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
            depthTest: !1
        }),
        this.sound.name = "sound",
        this.sound.frustumCulled = !1,
        this.sound.renderOrder = 999,
        this.scene.add(this.sound),
        this.on = new Ui({
            font: "IBMPlexMono-Medium",
            text: "On",
            width: this.options.width,
            align: this.options.align,
            lineHeight: this.options.lineHeight,
            size: this.options.size
        }, {
            uniforms: {
                tMap: {
                    value: le.load("../fonts/IBMPlexMono-Medium-datatexture.ktx2", "data")
                },
                uColor: {
                    value: new Z(Be.colorText)
                },
                uShow1: {
                    value: q.devScene ? 1 : 0
                },
                uShow2: {
                    value: q.devScene ? 1 : 0
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
            depthTest: !1
        }),
        this.on.name = "on",
        this.on.frustumCulled = !1,
        this.on.renderOrder = 999,
        this.on.visible = !1,
        this.scene.add(this.on),
        this.off = new Ui({
            font: "IBMPlexMono-Medium",
            text: "Off",
            width: this.options.width,
            align: this.options.align,
            lineHeight: this.options.lineHeight,
            size: this.options.size
        }, {
            uniforms: {
                tMap: {
                    value: le.load("../fonts/IBMPlexMono-Medium-datatexture.ktx2", "data")
                },
                uColor: {
                    value: new Z(Be.colorText)
                },
                uShow1: {
                    value: q.devScene ? 1 : 0
                },
                uShow2: {
                    value: q.devScene ? 1 : 0
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
            depthTest: !1
        }),
        this.off.name = "off",
        this.off.frustumCulled = !1,
        this.off.renderOrder = 999,
        this.scene.add(this.off);
        const e = new kt;
        e.translate(.5, 0, 0),
        this.icon = new Ce(e, new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                tMap: {
                    value: le.load("ui/sound-datatexture.ktx2", "datatexture-repeat")
                },
                uColor: {
                    value: new Z(Be.colorText)
                },
                uShow: {
                    value: q.devScene ? 1 : 0
                },
                uActive: {
                    value: 0
                },
                uRand: {
                    value: Math.random()
                }
            },
            vertexShader: `
                            ${Nt}

                            varying vec2 vUv;
                            flat varying vec2 vScale;

                            void main() {
                                vUv = uv;
                                vScale = getMatrixScale(modelMatrix).xy;
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            ${ae}
                            ${ii}
                            ${Lc}

                            uniform sampler2D tMap;
                            uniform vec3 uColor;
                            uniform float uShow;
                            uniform float uRand;
                            uniform float uActive;

                            varying vec2 vUv;
                            flat varying vec2 vScale;

                            void main() {
                                vec2 uv = vUv * vec2(1.0, 0.5) + vec2(0.0, uActive * 0.5);
                                float a = 1.0;

                                if (uShow < 1.0) {
                                    a *= sin(uShow * 30.0 + uRand * 12.4242) * 0.4 + 0.6;
                                    a *= step(0.01, uShow);
                                }

                                a *= msdf(tMap, uv);

                                gl_FragColor = vec4(uColor, a);
                            }
                        `,
            depthWrite: !1,
            depthTest: !1,
            transparent: !0
        })),
        this.icon.name = "soundIcon",
        this.icon.frustumCulled = !1,
        this.icon.renderOrder = 999,
        this.scene.add(this.icon);
        const t = new kt;
        t.translate(.5, 0, 0),
        this.interactionGeo = new Ce(t),
        this.interactionGeo.name = "soundInteraction",
        await Promise.all([this.sound.ready, this.on.ready, this.off.ready]),
        this.interaction = new Er({
            meshes: [this.interactionGeo],
            camera: this.scene.camera,
            hoverCursor: !0,
            onHover: s => {
                s.action === "hover_in" && (this.show(.5, 0), Q.emit("webgl_play_audio", "ui-long"))
            },
            onClick: s => {
                Q.emit("webgl_ui_particles_clicked"),
                Q.emit("webgl_audio_mute_toggle"),
                this.show(.2, 0)
            }
        }),
        Q.once("webgl_show_ui_intro", () => {
            this.show(),
            this.interaction.enable()
        }),
        Q.on("webgl_audio_mute_toggle", this.onMute, this),
        this.onMute(),
        this.isReady()
    }
    show(e=1, t=1)
    {
        re.fromTo(this.sound.material.uniforms.uShow1, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: .4 * e,
            ease: "sine.out",
            overwrite: !0
        }),
        re.fromTo(this.sound.material.uniforms.uShow2, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: .75 * e,
            ease: "sine.out",
            overwrite: !0
        }),
        re.fromTo(this.on.material.uniforms.uShow1, {
            value: 0
        }, {
            delay: t + .1,
            value: 1,
            duration: .4 * e,
            ease: "sine.out",
            overwrite: !0
        }),
        re.fromTo(this.on.material.uniforms.uShow2, {
            value: 0
        }, {
            delay: t + .1,
            value: 1,
            duration: .75 * e,
            ease: "sine.out",
            overwrite: !0
        }),
        re.fromTo(this.off.material.uniforms.uShow1, {
            value: 0
        }, {
            delay: t + .1,
            value: 1,
            duration: .4 * e,
            ease: "sine.out",
            overwrite: !0
        }),
        re.fromTo(this.off.material.uniforms.uShow2, {
            value: 0
        }, {
            delay: t + .1,
            value: 1,
            duration: .75 * e,
            ease: "sine.out",
            overwrite: !0
        }),
        this.icon.material.uniforms.uRand.value = Math.random(),
        re.fromTo(this.icon.material.uniforms.uShow, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: .5 * e,
            ease: "none",
            overwrite: !0
        })
    }
    onMute(e)
    {
        var t;
        (t = this.scene.controller) != null && t.audioController && Promise.resolve().then(() => {
            this.scene.controller.audioController._controller.muted ? (this.on.visible = !1, this.off.visible = !0, this.icon.material.uniforms.uActive.value = 0) : (this.on.visible = !0, this.off.visible = !1, this.icon.material.uniforms.uActive.value = 1)
        })
    }
    resize()
    {
        const e = this.scene.small ? 18 : 22;
        this.icon.scale.set(e, e, 1),
        this.icon.position.set(this.scene.meshMarginLeft, -q.screen.height + this.scene.meshMarginTop + e * .7, 0);
        const t = this.scene.small ? 180 : 230,
            s = t;
        this.sound.scale.set(t, s, 1),
        this.sound.position.set(this.scene.meshMarginLeft + e * 1.4, -q.screen.height + this.scene.meshMarginTop + this.sound.size.y * .45 * s, 0),
        this.on.scale.set(t, s, 1),
        this.on.position.set(this.scene.meshMarginLeft + e * 1.4 + this.sound.size.y * t * 2.6, -q.screen.height + this.scene.meshMarginTop + this.sound.size.y * .45 * s, 0),
        this.off.scale.set(t, s, 1),
        this.off.position.set(this.scene.meshMarginLeft + e * 1.4 + this.sound.size.y * t * 2.6, -q.screen.height + this.scene.meshMarginTop + this.sound.size.y * .45 * s, 0),
        this.interactionGeo.scale.set(t * this.options.size * 7.1, s * this.options.size * 1.7, 1),
        this.interactionGeo.position.set(this.scene.meshMarginLeft - t * .025, -q.screen.height + this.scene.meshMarginTop + e * .7, 0),
        this.interactionGeo.updateMatrixWorld()
    }
}
class OF {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.options = {
            width: 1,
            align: "center",
            lineHeight: .8,
            size: .09
        },
        this.init()
    }
    async init()
    {
        const e = new kt;
        e.translate(-.5, -.5, 0),
        this.mesh = new Ce(e, new fe({
            uniforms: {
                tMap: {
                    value: le.load("ui/close-datatexture.ktx2", "datatexture")
                },
                tBlocks: {
                    value: le.load("scroll-datatexture.ktx2", "datatexture-repeat")
                },
                uColor: {
                    value: new Z(Be.colorLogo)
                },
                uColor2: {
                    value: new Z("#ffffff")
                },
                uShow: {
                    value: 1
                },
                uRand: {
                    value: Math.random()
                }
            },
            vertexShader: `
                            ${Nt}

                            varying vec2 vUv;
                            flat varying vec2 vScale;

                            void main() {
                                vUv = uv;
                                vScale = getMatrixScale(modelMatrix).xy;
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            ${ii}
                            ${Lc}

                            uniform sampler2D tMap;
                            uniform sampler2D tBlocks;
                            uniform vec3 uColor;
                            uniform vec3 uColor2;
                            uniform float uShow;
                            uniform float uRand;

                            varying vec2 vUv;
                            flat varying vec2 vScale;

                            vec2 hash21(float p) {
                                vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
                                p3 += dot(p3, p3.yzx + 33.33);
                                return fract((p3.xx+p3.yz)*p3.zy);
                            }

                            void main() {
                                vec2 uv = imagefitUV(vUv, vec2(textureSize(tMap, 0)), vScale, 1.0);
                                float a = 1.0;

                                if (uShow < 1.0) {
                                    // squared displacement
                                    float steps = 3.0;
                                    vec2 hash = hash21(floor(uShow * steps) / steps + uRand * 3.342);
                                    vec2 offset = hash * 2.0 - 1.0;
                                    vec2 scale = vec2(0.1, 0.15);
                                    vec2 blocksUV = uv * scale + uRand * 12.4242 + offset * uRand * 4.543;
                                    float blocks1 = texture2D(tBlocks, blocksUV).g * 2.0 - 1.0;
                                    float displacement = 0.025;
                                    uv += vec2(blocks1, 0.0) * displacement;

                                    // make it blink
                                    a *= sin(uShow * 30.0 + uRand * 12.4242) * 0.15 + 0.85;
                                    a *= step(0.01, uShow);

                                }

                                a *= msdf(tMap, uv);

                                gl_FragColor = vec4(uColor, a);
                            }
                        `,
            depthWrite: !1,
            depthTest: !1,
            transparent: !0
        })),
        this.mesh.name = "close",
        this.mesh.frustumCulled = !1,
        this.mesh.renderOrder = 10,
        this.mesh.visible = !1,
        this.scene.add(this.mesh),
        this.message = new Ui({
            font: "IBMPlexMono-Medium",
            text: Be.close,
            width: this.options.width,
            align: this.options.align,
            lineHeight: this.options.lineHeight,
            size: this.options.size
        }, {
            uniforms: {
                tMap: {
                    value: le.load("../fonts/IBMPlexMono-Medium-datatexture.ktx2", "data")
                },
                uColor: {
                    value: new Z(Be.colorText)
                },
                uShow1: {
                    value: q.devScene ? 1 : 0
                },
                uShow2: {
                    value: q.devScene ? 1 : 0
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
            depthTest: !1
        }),
        this.message.name = "close message",
        this.message.frustumCulled = !1,
        this.message.renderOrder = 999,
        this.message.visible = !1,
        this.scene.add(this.message),
        await Promise.all([this.message.ready]),
        this.interaction = new Er({
            meshes: [this.mesh],
            camera: this.scene.camera,
            hoverCursor: !0,
            onHover: t => {
                t.action === "hover_in" && (this.show(.25, 0), Q.emit("webgl_play_audio", "ui-long"))
            },
            onClick: () => {
                Q.emit("webgl_switch_scene", "")
            }
        }),
        Q.on("webgl_project_show", this.enable, this),
        Q.on("webgl_project_hide", this.disable, this),
        q.devScene && this.enable(),
        this.isReady()
    }
    show(e=.5, t=.2)
    {
        this.mesh.visible = !0,
        this.mesh.material.uniforms.uRand.value = Math.random(),
        re.fromTo(this.mesh.material.uniforms.uShow, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: e,
            ease: "none",
            overwrite: !0
        }),
        this.message.visible = !0,
        re.fromTo(this.message.material.uniforms.uShow1, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: .2,
            ease: "sine.out",
            overwrite: !0
        }),
        re.fromTo(this.message.material.uniforms.uShow2, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: .4,
            ease: "sine.out",
            overwrite: !0
        })
    }
    enable()
    {
        this.show(),
        this.interaction.enable(),
        Q.on("keyup", this.onKey, this)
    }
    disable()
    {
        this.mesh.visible = !1,
        this.message.visible = !1,
        this.interaction.disable(),
        Q.off("keyup", this.onKey, this)
    }
    onKey(e)
    {
        e.key === "Escape" && Q.emit("webgl_switch_scene", "")
    }
    resize()
    {
        const e = this.scene.mobile ? 85 : this.scene.small ? 95 : 120,
            t = e * .45;
        this.mesh.scale.set(e, t, 1),
        this.mesh.position.set(q.screen.width - this.scene.meshMarginLeft, -this.scene.meshMarginTop + t * .12, 0),
        this.message.scale.set(e * 2.15, e * 2.15, 1),
        this.message.position.set(this.mesh.position.x - e * .5, this.mesh.position.y - t * .5 - this.message.size.y * .21 * this.message.scale.y, 0)
    }
}
class Yh {
    constructor({parent: e=null, text: t="", options: s={}}={})
    {
        this.parent = e,
        this.text = t,
        this.options = s,
        this.ready = new Promise(n => {
            this.isReady = n
        }),
        this.init()
    }
    async init()
    {
        this.mesh = new Ui({
            text: this.text,
            ...this.options
        }, {
            uniformsGroups: [he.UBO],
            uniforms: {
                tMap: {
                    value: le.load("../fonts/IBMPlexMono-Medium-datatexture.ktx2", "data")
                },
                uColor: {
                    value: new Z(this.options.color)
                },
                uShow1: {
                    value: 0
                },
                uShow2: {
                    value: 0
                },
                uOpacity: {
                    value: 0
                },
                uFadeMargin: {
                    value: this.parent.scrollMargin
                },
                uHighlights: {
                    value: !0
                },
                tSim: {
                    value: null
                }
            },
            vertexShader: `
                            ${Nt}
                            ${Ue}
                            ${ae}
                            ${Ht}

                            attribute vec3 textWeights;
                            attribute vec3 centr;
                            uniform float uShow1;
                            uniform float uShow2;
                            uniform sampler2D tSim;
                            uniform bool uHighlights;

                            varying vec2 vUv;
                            varying float wPosY;
                            varying float vAlpha;
                            flat varying float illum;

                            void main() {
                                float tr1 = falloff(textWeights.x, 0.0, 1.0, 0.1, clamp(uShow1, 0.0, 1.0));
                                float tr2 = falloff(textWeights.x, 0.0, 1.0, 1.0, clamp(uShow2, 0.0, 1.0));

                                float tr = 0.0;
                                illum = 0.0;

                                if (uHighlights) {
                                    vec4 ppos = modelMatrix * vec4(centr, 1.0);
                                    vec2 uvScreen = abs(ppos.xy) / resolutionUI;
                                    vec2 val = texture2D(tSim, vec2(uvScreen.x, 1.0 - uvScreen.y)).xy;
                                    tr = fit(val.g, 0.01, 1.0, 0.0, 5.0);
                                    illum = val.r;
                                }

                                vUv = uv;
                                vUv.x = mod(uv.x + 0.125 * mod(floor((1.0 - tr2 + tr) * 5.654), 8.0), 1.0);
                                vAlpha = tr1;

                                vec4 wPos = modelMatrix * vec4(position, 1.0);
                                wPosY = wPos.y;

                                gl_Position = projectionMatrix * viewMatrix * wPos;
                            }
                        `,
            fragmentShader: `
                                ${ii}
                                ${Ht}
                                ${Ue}
                                ${ae}

                                uniform sampler2D tMap;
                                uniform vec3 uColor;
                                uniform float uOpacity;
                                uniform float uFadeMargin;

                                varying vec2 vUv;
                                varying float vAlpha;
                                varying float wPosY;
                                flat varying float illum;

                                void main() {
                                    vec2 uv = vUv;
                                    float alpha = vAlpha;
                                    alpha *= msdf(tMap, uv);
                                    alpha *= uOpacity;

                                    // mobile fade
                                    alpha *= smoothstep(-uFadeMargin, -uFadeMargin * 3.0, wPosY);
                                    alpha *= smoothstep(-resolutionUI.y + uFadeMargin, -resolutionUI.y + uFadeMargin * 3.0, wPosY);

                                    gl_FragColor = vec4(mix(uColor, vec3(0.8), fit(illum, 0.6, 0.8, 0.0, 1.0)), alpha);
                                }
                            `,
            depthWrite: !1,
            depthTest: !1
        }),
        await this.mesh.ready,
        this.isReady()
    }
    hide()
    {
        return re.to(this.mesh.material.uniforms.uOpacity, {
            value: 0,
            duration: .15,
            ease: "power2.out",
            overwrite: !0
        })
    }
    show(e=0, t=0)
    {
        return re.fromTo(this.mesh.material.uniforms.uOpacity, {
            value: 0
        }, {
            value: 1,
            delay: t,
            duration: 0,
            overwrite: !0
        }), re.fromTo(this.mesh.material.uniforms.uShow1, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: e,
            ease: "sine.out",
            overwrite: !0
        }), re.fromTo(this.mesh.material.uniforms.uShow2, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: e + .1,
            ease: "sine.out",
            overwrite: !0
        })
    }
    resize(e={})
    {
        return this.mesh.update(e)
    }
}
class kF {
    constructor(e={}, t=null, s=0)
    {
        this.data = e,
        this.parent = t,
        this.index = s,
        this.ready = new Promise(n => {
            this.isReady = n
        }),
        this.init()
    }
    async init()
    {
        this.mesh = new Ui({
            text: `[${this.data.name}]`,
            ...this.parent.options
        }, {
            uniformsGroups: [he.UBO],
            uniforms: {
                tMap: {
                    value: le.load("../fonts/IBMPlexMono-Medium-datatexture.ktx2", "data")
                },
                uColor: {
                    value: new Z(this.parent.options.color)
                },
                uShow1: {
                    value: 0
                },
                uShow2: {
                    value: 0
                },
                uOpacity: {
                    value: 0
                },
                uFadeMargin: {
                    value: this.parent.parent.scrollMargin
                },
                uHighlights: {
                    value: !0
                },
                tSim: {
                    value: null
                }
            },
            vertexShader: `
                            ${Nt}
                            ${Ue}
                            ${ae}
                            ${Ht}

                            attribute vec3 textWeights;
                            attribute vec3 centr;
                            uniform float uShow1;
                            uniform float uShow2;
                            uniform sampler2D tSim;
                            uniform bool uHighlights;

                            varying vec2 vUv;
                            varying float wPosY;
                            varying float vAlpha;
                            flat varying float illum;

                            void main() {

                                float tr1 = falloff(textWeights.x, 0.0, 1.0, 0.1, clamp(uShow1, 0.0, 1.0));
                                float tr2 = falloff(textWeights.x, 0.0, 1.0, 1.0, clamp(uShow2, 0.0, 1.0));

                                float tr = 0.0;
                                illum = 0.0;

                                if (uHighlights) {
                                    vec4 ppos = modelMatrix * vec4(centr, 1.0);
                                    vec2 uvScreen = abs(ppos.xy) / resolutionUI;
                                    vec2 val = texture2D(tSim, vec2(uvScreen.x, 1.0 - uvScreen.y)).xy;
                                    tr = fit(val.g, 0.01, 1.0, 0.0, 5.0);
                                    illum = val.r;
                                }

                                vUv = uv;
                                vUv.x = mod(uv.x + 0.125 * mod(floor((1.0 - tr2 + tr) * 5.654), 8.0), 1.0);
                                vAlpha = tr1;

                                vec4 wPos = modelMatrix * vec4(position, 1.0);
                                wPosY = wPos.y;

                                gl_Position = projectionMatrix * viewMatrix * wPos;
                            }
                        `,
            fragmentShader: `
                                ${ii}
                                ${Ht}
                                ${Ue}
                                ${ae}

                                uniform sampler2D tMap;
                                uniform vec3 uColor;
                                uniform float uOpacity;
                                uniform float uFadeMargin;

                                varying vec2 vUv;
                                varying float vAlpha;
                                varying float wPosY;
                                flat varying float illum;

                                void main() {
                                    vec2 uv = vUv;
                                    float alpha = vAlpha;
                                    alpha *= msdf(tMap, uv);
                                    alpha *= uOpacity;

                                    // mobile fade
                                    alpha *= smoothstep(-uFadeMargin, -uFadeMargin * 3.0, wPosY);
                                    alpha *= smoothstep(-resolutionUI.y + uFadeMargin, -resolutionUI.y + uFadeMargin * 3.0, wPosY);

                                    gl_FragColor = vec4(mix(uColor, vec3(0.8), fit(illum, 0.6, 0.8, 0.0, 1.0)), alpha);
                                }
                            `,
            depthWrite: !1,
            depthTest: !1
        }),
        this.parent.mesh.add(this.mesh);
        const e = new kt;
        e.translate(.5, -.5, 0),
        this.icon = new Ce(e, new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                tMap: {
                    value: le.load("ui/arrow-datatexture.ktx2", "datatexture-repeat")
                },
                uColor: {
                    value: new Z(this.parent.options.color)
                },
                uShow: {
                    value: 0
                },
                uRand: {
                    value: Math.random()
                },
                uOpacity: {
                    value: 1
                },
                uFadeMargin: {
                    value: this.parent.parent.scrollMargin
                },
                uHighlights: {
                    value: !0
                },
                tSim: {
                    value: null
                }
            },
            vertexShader: `
                            ${Nt}
                            ${Ue}
                            ${ae}
                            ${Ht}

                            uniform sampler2D tSim;
                            uniform bool uHighlights;

                            varying vec2 vUv;
                            varying float wPosY;
                            flat varying vec2 vScale;
                            flat varying vec2 illum;

                            void main() {
                                illum = vec2(0.0);

                                if (uHighlights) {
                                    vec4 ppos = modelMatrix * vec4(vec3(0.0), 1.0);
                                    vec2 uvScreen = abs(ppos.xy) / resolutionUI;
                                    vec2 val = texture2D(tSim, vec2(uvScreen.x, 1.0 - uvScreen.y)).xy;
                                    illum.x = fit(val.g, 0.01, 1.0, 0.0, 5.0);
                                    illum.y = val.r;
                                }

                                vUv = uv;
                                vScale = getMatrixScale(modelMatrix).xy;

                                vec4 wPos = modelMatrix * vec4(position, 1.0);
                                wPosY = wPos.y;
                                gl_Position = projectionMatrix * viewMatrix * wPos;
                            }
                        `,
            fragmentShader: `
                            ${ae}
                            ${ii}
                            ${Lc}
                            ${Ht}

                            uniform sampler2D tMap;
                            uniform vec3 uColor;
                            uniform float uShow;
                            uniform float uRand;
                            uniform float uOpacity;
                            uniform float uFadeMargin;

                            varying vec2 vUv;
                            varying float wPosY;
                            flat varying vec2 vScale;
                            flat varying vec2 illum;

                            void main() {
                                vec2 uv = imagefitUV(vUv, vec2(textureSize(tMap, 0)), vScale, 1.0);
                                float a = 1.0;

                                if (uShow < 1.0) {
                                    a *= sin(uShow * 30.0 + uRand * 12.4242) * 0.4 + 0.6;
                                    a *= step(0.01, uShow);
                                }

                                a *= msdf(tMap, uv);
                                a *= uOpacity * (1.0 - floor(mod(illum.x * 5.34234, 2.0)));

                                // mobile fade
                                a *= smoothstep(-uFadeMargin, -uFadeMargin * 3.0, wPosY);
                                a *= smoothstep(-resolutionUI.y + uFadeMargin, -resolutionUI.y + uFadeMargin * 3.0, wPosY);

                                gl_FragColor = vec4(mix(uColor, vec3(0.8), fit(illum.y, 0.6, 0.8, 0.0, 1.0)), a);
                            }
                        `,
            depthWrite: !1,
            depthTest: !1,
            transparent: !0
        })),
        this.icon.name = "arrow",
        this.mesh.add(this.icon);
        const t = new kt;
        t.translate(.5, -.25, 0),
        this.interactionMesh = new Ce(t),
        this.interactionMesh.name = "icon interaction",
        this.interactionMesh._index = this.index,
        await this.mesh.ready,
        this.isReady()
    }
    show(e=1, t=0)
    {
        return this.icon.material.uniforms.uRand.value = Math.random(), re.fromTo(this.icon.material.uniforms.uOpacity, {
            value: 0
        }, {
            value: 1,
            delay: t,
            duration: 0,
            overwrite: !0
        }), re.fromTo(this.icon.material.uniforms.uShow, {
            value: 0
        }, {
            delay: t * 1.25,
            value: 1,
            duration: .5 * e,
            ease: "none",
            overwrite: !0
        }), re.fromTo(this.mesh.material.uniforms.uOpacity, {
            value: 0
        }, {
            value: 1,
            delay: t,
            duration: 0,
            overwrite: !0
        }), re.fromTo(this.mesh.material.uniforms.uShow1, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: .4 * e,
            ease: "sine.out",
            overwrite: !0
        }), re.fromTo(this.mesh.material.uniforms.uShow2, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: .75 * e,
            ease: "sine.out",
            overwrite: !0
        })
    }
    hide()
    {
        return re.to(this.icon.material.uniforms.uOpacity, {
            value: 0,
            duration: .15,
            ease: "power2.out",
            overwrite: !0
        }), re.to(this.mesh.material.uniforms.uOpacity, {
            value: 0,
            duration: .15,
            ease: "power2.out",
            overwrite: !0
        })
    }
    resize(e={})
    {
        return this.mesh.update(e)
    }
}
class ey {
    constructor({parent: e=null, links: t={}, options: s={}}={})
    {
        this.parent = e,
        this.links = t,
        this.options = s,
        this.ready = new Promise(n => {
            this.isReady = n
        }),
        this.els = [],
        this.mesh = new Gi,
        this.mesh.name = "links",
        this.mesh.size = new H,
        this.init()
    }
    async init()
    {
        this.els = this.links.map((e, t) => new kF(e, this, t)),
        await Promise.all(this.els.map(e => e.ready)),
        this.mesh.add(...this.els.map(e => e.mesh)),
        this.resize(),
        this.interaction = new Er({
            meshes: this.els.map(e => e.interactionMesh),
            camera: this.parent.scene.camera,
            hoverCursor: !0,
            onHover: e => {
                if (e.action === "hover_in") {
                    const t = e.interactions[0].object._index;
                    this.els[t].show(.5, 0),
                    Q.emit("webgl_play_audio", "ui-short")
                }
            },
            onClick: e => {
                const t = e.interactions[0].object._index;
                window.open(this.els[t].data.link, "_blank").focus()
            }
        }),
        this.isReady()
    }
    hide()
    {
        return Promise.all(this.els.map(e => e.hide()))
    }
    show(e=1, t=0)
    {
        return Promise.all(this.els.map((s, n) => s.show(.5, t + n * .1)))
    }
    resize(e={})
    {
        return this.ready.then(() => Promise.all(this.els.map(t => t.resize(e))).then(() => {
            let t = 0,
                s = 0;
            this.mesh.size.set(0, 0),
            this.els.forEach((n, r) => {
                const a = this.parent.scene.small ? 12 : 18,
                    o = n.mesh.size.x + a,
                    l = n.mesh.size.y;
                t + o > this.parent.width && (t = 0, s -= l + 10),
                n.mesh.position.set(t, s, 0),
                n.icon.scale.set(a, a, 1),
                n.icon.position.set(n.mesh.size.x - a + 5, 0, 0),
                this.mesh.size.x = Math.max(this.mesh.size.x, t + o),
                this.mesh.size.y = Math.max(this.mesh.size.y, Math.abs(s) + l),
                t += o + 15
            })
        }))
    }
    update()
    {
        this.els.forEach((e, t) => {
            e.interactionMesh.scale.set(e.mesh.size.x + e.icon.scale.x * .5, e.mesh.size.y * 1.25, 1),
            e.interactionMesh.position.copy(e.mesh.position).add(this.mesh.position).add(this.parent.group.position),
            e.interactionMesh.updateMatrixWorld()
        })
    }
}
class zF {
    constructor({parent: e, index: t}={})
    {
        this.parent = e,
        this.scene = this.parent.scene,
        this.index = t,
        this.group = new Gi,
        this.group.name = `project-${this.index}`,
        this.group.visible = !1,
        this.parent.group.add(this.group),
        this.elements = [],
        this.width = 500,
        this.scrollMargin = 65,
        this.scrollMax = 0,
        this.scrollY = 0,
        this.scrollTargetY = 0,
        this.ready = new Promise(s => {
            this.isReady = s
        }),
        this.init()
    }
    async init()
    {
        const e = Be.cubes[this.index].interior,
            t = {
                font: "IBMPlexMono-Medium",
                color: "#ffffff",
                width: 4,
                align: "left",
                lineHeight: 1,
                size: 14,
                baseOffset: -.65
            };
        this.elements.push(new Yh({
            parent: this,
            text: e.title,
            options: {
                ...t,
                color: Be.colorProjectTitle
            }
        })),
        e.skills && this.elements.push(new SK({
            parent: this,
            skills: e.skills,
            options: {
                ...t,
                color: Be.colorProjectText
            }
        })),
        e.technicalSkills && this.elements.push(new Yh({
            parent: this,
            text: "Skill teknis:",
            options: {
                ...t,
                color: Be.colorProjectTitle
            }
        }), new SK({
            parent: this,
            skills: e.technicalSkills,
            options: {
                ...t,
                color: Be.colorProjectText
            }
        })),
        this.elements.push(new Yh({
            parent: this,
            text: e.content,
            options: {
                ...t,
                color: Be.colorProjectText
            }
        }), new Yh({
            parent: this,
            text: e.socialTitle,
            options: {
                ...t,
                color: Be.colorProjectTitle
            }
        }), new ey({
            parent: this,
            links: e.social,
            options: {
                ...t,
                color: Be.colorProjectText
            }
        }), new Yh({
            parent: this,
            text: e.linkTitle,
            options: {
                ...t,
                color: Be.colorProjectTitle
            }
        }), new ey({
            parent: this,
            links: e.links,
            options: {
                ...t,
                color: Be.colorProjectText
            }
        })),
        this.group.add(...this.elements.map(s => s.mesh)),
        await Promise.all(this.elements.map(s => s.ready)),
        this.resize(),
        this.isReady()
    }
    show()
    {
        this.group.visible = !0,
        this.scrollY = 0,
        this.scrollTargetY = 0;
        let e = 0;
        this.elements.forEach((t, s) => {
            var a;
            const n = !!t.text,
                r = n ? t.text.length > 100 ? .75 : .25 : .3;
            t.show(r, e),
            e += n && t.text.length > 100 ? .3 : .1,
            (a = t.interaction) == null || a.enable()
        })
    }
    hide()
    {
        Promise.all(this.elements.map((e, t) => {
            var s;
            return (s = e.interaction) == null || s.disable(), e.hide()
        })).then(() => {
            this.group.visible = !1
        })
    }
    update()
    {
        this.group.visible && (this.scrollTargetY = ie.clamp(this.scrollTargetY, 0, this.scrollMax), this.scrollY = ie.lerpFPS(this.scrollY, this.scrollTargetY, .1), this.group.position.y = this.scrollY, this.elements.forEach((e, t) => {
            var s;
            (s = e.update) == null || s.call(e)
        }))
    }
    resize()
    {
        const e = this.scene.small ? 18 : 24,
            t = 500,
            s = 20;
        this.width = Math.min(q.screen.width - s * 2, t);
        const n = 25,
            r = Math.max(s, (q.screen.width - this.width) * .5);
        this.ready.then(() => Promise.all(this.elements.map(a => a.resize({
            size: e,
            width: this.width
        }))).then(() => {
            const a = this.elements.reduce((c, h) => c + h.mesh.size.y, 0) + n * (this.elements.length - 1);
            let o = 0;
            if (this.scrollMax = Math.max(0, a - (q.screen.height - this.scrollMargin * 4)), this.scrollMax > 0) {
                o = this.scrollMargin * 2;
                const c = this.scrollMax === 0 ? 0 : this.scrollY / this.scrollMax;
                this.scrollY = c * this.scrollMax,
                this.scrollTargetY = this.scrollY
            } else
                o = (q.screen.height - a) * .5,
                this.scrollY = 0,
                this.scrollTargetY = 0;
            let l = o;
            this.elements.forEach(c => {
                c.mesh.position.set(r, -l, 0),
                l += c.mesh.size.y + n
            })
        }))
    }
    setMouseSim(e)
    {
        this.elements.forEach(t => {
            t.els ? t.els.forEach(s => {
                s.mesh.material.uniforms.tSim.value = e.finalRT.texture,
                s.icon && (s.icon.material.uniforms.tSim.value = e.finalRT.texture)
            }) : t.mesh.material.uniforms.tSim.value = e.finalRT.texture
        })
    }
}
class QF {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.group = new Gi,
        this.group.name = "projects",
        this.scene.add(this.group),
        this.options = {
            width: .6,
            align: "left",
            lineHeight: .8,
            size: .09
        },
        this.projects = [],
        this.projectID = -1,
        this.mouseSim = null,
        this.scrollMultiplier = 1,
        this.init()
    }
    async init()
    {
        await Promise.all(Be.cubes.map((e, t) => {
            const s = new zF({
                parent: this,
                index: t
            });
            return this.projects.push(s), s.ready
        })),
        Q.on("webgl_project_show", this.show, this),
        Q.on("webgl_project_hide", this.hide, this),
        Q.on("wheel", this.onScroll, this),
        Q.on("keydown", this.onKeyDown, this),
        Q.on("touch_drag", this.onTouchDrag, this),
        this.isReady()
    }
    show(e)
    {
        this.projectID === -1 && (this.projectID = e, this.projects[e].show())
    }
    hide()
    {
        this.projectID !== -1 && (this.projects[this.projectID].hide(), this.projectID = -1)
    }
    update()
    {
        this.projectID !== -1 && (this.projects[this.projectID].update(), this.mouseSim && this.projects.forEach(e => {
            e.setMouseSim(this.mouseSim)
        }))
    }
    onScroll(e)
    {
        this.projectID !== -1 && (this.projects[this.projectID].scrollTargetY += e.delta.y * this.scrollMultiplier)
    }
    onKeyDown(e)
    {
        this.projectID !== -1 && (e.key === "ArrowDown" && (this.projects[this.projectID].scrollTargetY += 150 * this.scrollMultiplier), e.key === "ArrowUp" && (this.projects[this.projectID].scrollTargetY -= 150 * this.scrollMultiplier))
    }
    onTouchDrag(e)
    {
        this.projectID !== -1 && (this.projects[this.projectID].scrollTargetY -= e.delta.y)
    }
    setMouseSim(e)
    {
        this.mouseSim = e
    }
    resize()
    {
        this.projects.forEach((e, t) => {
            e.resize(t)
        })
    }
}
class GF extends Jo {
    constructor(e={})
    {
        super({
            cameraType: "orthographic"
        }),
        this.controller = e.mainController,
        this.small = !1,
        this.mobile = !1,
        this.meshMarginLeft = 0,
        this.meshMarginTop = 0,
        this.scrollVisible = !0,
        this.init()
    }
    async init()
    {
        this.cameraOptions(),
        await Promise.all([this.createLogo(), this.createScroll(), this.createSound(), this.createClose(), this.createProjects()]),
        this.resize(),
        Q.on("resize", this.resize, this),
        this.beforeRenderCbs.push(this.update.bind(this)),
        q.devScene && (this.debug(), console.log("REMOVE AFTER PROJECTS ARE COMPLETED"), Q.emit("webgl_project_show", 0)),
        this.isReady()
    }
    cameraOptions()
    {
        this.camera.lerpPosition = 0,
        this.camera.lerpTarget = 0,
        this.camera.lerpRotation = 0
    }
    async createLogo()
    {
        this.logo = new LF(this),
        await this.logo.ready
    }
    async createScroll()
    {
        this.scroll = new FF(this),
        await this.scroll.ready
    }
    async createSound()
    {
        this.sound = new NF(this),
        await this.sound.ready
    }
    async createClose()
    {
        this.close = new OF(this),
        await this.close.ready
    }
    async createProjects()
    {
        this.projects = new QF(this),
        await this.projects.ready
    }
    update()
    {
        var e;
        if (this.scrollVisible && this.controller) {
            const t = this.controller.scrollComposers[0].passes[0].scene,
                s = Math.abs(this.controller.scroll.y - this.controller.round(t.initialScrollAutocenter));
            this.controller.scroll.y !== 0 && s > t.height * .25 && (this.scrollVisible = !1, this.scroll.hide())
        }
        (e = this.projects) == null || e.update()
    }
    resize()
    {
        this.camera.basePosition.set(q.screen.w * .5, -q.screen.h * .5, this.camera.basePosition.z),
        this.camera.baseTarget.set(this.camera.basePosition.x, this.camera.basePosition.y, 0),
        this.camera.updateProjectionMatrix(),
        this.small = q.screen.width < Be.breakpointW || q.screen.height < Be.breakpointH,
        this.mobile = q.screen.width < Be.breakPointMobile || q.screen.height < Be.breakPointMobile,
        this.meshMarginLeft = this.mobile ? Be.gridSizeMobile : this.small ? Be.gridSizeLow : Be.gridSize,
        this.meshMarginTop = this.mobile ? Be.topMarginMobile : this.small ? Be.topMarginLow : Be.topMargin,
        [this.logo, this.scroll, this.sound, this.close, this.projects].forEach(e => {
            e.resize()
        })
    }
}
class yK {
    constructor(e={}, t=null, s=0)
    {
        this.data = e,
        this.parent = t,
        this.index = s,
        this.icon = null,
        this.ready = new Promise(n => {
            this.isReady = n
        }),
        this.init()
    }
    async init()
    {
        this.text = new Yh({
            parent: this.parent.parent,
            text: this.data.name,
            options: this.parent.options
        }),
        await this.text.ready,
        this.mesh = this.text.mesh,
        this.mesh.name = "skill";
        if (this.data.icon) {
            const e = new kt;
            e.translate(.5, -.5, 0),
            this.icon = new Ce(e, new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tMap: {
                        value: le.load(`ui/skills/${this.data.icon}.png`, "srgb")
                    },
                    uColor: {
                        value: new Z(this.parent.options.color)
                    },
                    uShow: {
                        value: 0
                    },
                    uRand: {
                        value: Math.random()
                    },
                    uOpacity: {
                        value: 1
                    },
                    uFadeMargin: {
                        value: this.parent.parent.scrollMargin
                    },
                    uHighlights: {
                        value: !0
                    },
                    tSim: {
                        value: null
                    }
                },
                vertexShader: `
                            ${Nt}
                            ${Ue}
                            ${ae}
                            ${Ht}

                            uniform sampler2D tSim;
                            uniform bool uHighlights;

                            varying vec2 vUv;
                            varying float wPosY;
                            flat varying vec2 vScale;
                            flat varying vec2 illum;

                            void main() {
                                illum = vec2(0.0);

                                if (uHighlights) {
                                    vec4 ppos = modelMatrix * vec4(vec3(0.0), 1.0);
                                    vec2 uvScreen = abs(ppos.xy) / resolutionUI;
                                    vec2 val = texture2D(tSim, vec2(uvScreen.x, 1.0 - uvScreen.y)).xy;
                                    illum.x = fit(val.g, 0.01, 1.0, 0.0, 5.0);
                                    illum.y = val.r;
                                }

                                vUv = uv;
                                vScale = getMatrixScale(modelMatrix).xy;

                                vec4 wPos = modelMatrix * vec4(position, 1.0);
                                wPosY = wPos.y;
                                gl_Position = projectionMatrix * viewMatrix * wPos;
                            }
                        `,
                fragmentShader: `
                            ${ae}
                            ${ii}
                            ${Lc}
                            ${Ht}

                            uniform sampler2D tMap;
                            uniform vec3 uColor;
                            uniform float uShow;
                            uniform float uRand;
                            uniform float uOpacity;
                            uniform float uFadeMargin;

                            varying vec2 vUv;
                            varying float wPosY;
                            flat varying vec2 vScale;
                            flat varying vec2 illum;

                            void main() {
                                vec2 uv = imagefitUV(vUv, vec2(textureSize(tMap, 0)), vScale, 1.0);
                                float a = 1.0;

                                if (uShow < 1.0) {
                                    a *= sin(uShow * 30.0 + uRand * 12.4242) * 0.4 + 0.6;
                                    a *= step(0.01, uShow);
                                }

                                a *= texture2D(tMap, uv).a;
                                a *= uOpacity * (1.0 - floor(mod(illum.x * 5.34234, 2.0)));

                                // mobile fade
                                a *= smoothstep(-uFadeMargin, -uFadeMargin * 3.0, wPosY);
                                a *= smoothstep(-resolutionUI.y + uFadeMargin, -resolutionUI.y + uFadeMargin * 3.0, wPosY);

                                gl_FragColor = vec4(mix(uColor, vec3(0.8), fit(illum.y, 0.6, 0.8, 0.0, 1.0)), a);
                            }
                        `,
                depthWrite: !1,
                depthTest: !1,
                transparent: !0
            })),
            this.icon.name = "skill-icon",
            this.mesh.add(this.icon)
        }
        this.isReady()
    }
    show(e=1, t=0)
    {
        this.icon && (this.icon.material.uniforms.uRand.value = Math.random(), re.fromTo(this.icon.material.uniforms.uOpacity, {
            value: 0
        }, {
            value: 1,
            delay: t,
            duration: 0,
            overwrite: !0
        }), re.fromTo(this.icon.material.uniforms.uShow, {
            value: 0
        }, {
            delay: t,
            value: 1,
            duration: .5 * e,
            ease: "none",
            overwrite: !0
        })),
        this.text.show(e, t)
    }
    hide()
    {
        return this.icon && re.to(this.icon.material.uniforms.uOpacity, {
            value: 0,
            duration: .15,
            ease: "power2.out",
            overwrite: !0
        }), this.text.hide()
    }
    resize(e={})
    {
        return this.text.resize(e)
    }
}
class SK {
    constructor({parent: e=null, skills: t=[], options: s={}}={})
    {
        this.parent = e,
        this.skills = t,
        this.options = s,
        this.ready = new Promise(n => {
            this.isReady = n
        }),
        this.els = [],
        this.mesh = new Gi,
        this.mesh.name = "skills",
        this.mesh.size = new H,
        this.init()
    }
    async init()
    {
        this.els = this.skills.map((e, t) => new yK(e, this, t)),
        await Promise.all(this.els.map(e => e.ready)),
        this.mesh.add(...this.els.map(e => e.mesh)),
        await this.resize(),
        this.isReady()
    }
    hide()
    {
        return Promise.all(this.els.map(e => e.hide()))
    }
    show(e=1, t=0)
    {
        return Promise.all(this.els.map(s => s.show(e, t)))
    }
    resize(e={})
    {
        return Promise.all(this.els.map(t => t.resize(e))).then(() => {
            let y = 0,
                x = 0;
            const a = this.parent.scene.small ? 12 : 18;
            this.mesh.size.set(0, 0),
            this.els.forEach(n => {
                const r = n.mesh.size.y;
                n.icon ? (n.icon.scale.set(a, a, 1), n.icon.position.set(-a - 8, 0, 0), n.mesh.position.set(a + 8, -y, 0), x = Math.max(x, a + 8 + n.mesh.size.x)) : (n.mesh.position.set(0, -y, 0), x = Math.max(x, n.mesh.size.x)),
                y += r + 10
            }),
            this.mesh.size.set(x, Math.max(0, y - 10))
        })
    }
    update() {}
}
