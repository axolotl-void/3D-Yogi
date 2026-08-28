class HF {
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
        this.mesh = new Ce(Si.triangle, new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                uColor1: {
                    value: new Z("#09121f")
                },
                uColor2: {
                    value: new Z("#6b7685")
                },
                tNoise: {
                    value: le.load("wind_noise.ktx2", "colordata-repeat")
                },
                uRotation: {
                    value: -.66
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
                            ${Cr}

                            varying vec2 vUv;

                            uniform sampler2D tNoise;
                            uniform vec3 uColor1;
                            uniform vec3 uColor2;
                            uniform float uRotation;

                            vec3 hash32(vec2 p) {
                                vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
                                p3 += dot(p3, p3.yxz+33.33);
                                return fract((p3.xxy+p3.yzz)*p3.zyx);
                            }

                            float hash12(vec2 p) {
                                vec3 p3  = fract(vec3(p.xyx) * .1031);
                                p3 += dot(p3, p3.yzx + 33.33);
                                return fract((p3.x + p3.y) * p3.z);
                            }

                            void main() {
                                // diagonal gradient
                                vec2 uv = vUv - 0.5;
                                uv.x *= resolution.x / resolution.y;
                                uv *= 0.5;
                                uv += 0.5;
                                uv = rotateUV(uv, uRotation);

                                float gradient = pow(uv.y, 3.0);
                                gradient *= 0.5;

                                // add noise to prevent banding
                                gradient += hash12(vUv * 1000.0 + time) * 0.01;

                                // main color
                                vec3 color = mix(uColor1, uColor2, gradient);

                                gl_FragColor = vec4(color, 1.0);
                            }
                        `,
            depthWrite: !1,
            depthTest: !1,
            transparent: !0,
            blending: pt
        })),
        this.mesh.name = "bg",
        this.mesh.updateMatrixWorld(!0),
        this.mesh.matrixAutoUpdate = !1,
        this.mesh.frustumCulled = !1,
        this.mesh.onBeforeRender = () => {},
        this.mesh.renderOrder = -5,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class VF {
    constructor(e, t)
    {
        this.options = {
            index: 0,
            obj: "pudgy",
            scale: 1,
            rand: Math.random(),
            ...t
        },
        this.scene = e,
        this.ready = new Promise(s => {
            this.isReady = s
        }),
        this.index = this.options.index,
        this.additionalRotationAmount = {
            value: 0
        },
        this.init()
    }
    async init()
    {
        const e = await zt.load(`${this.options.obj}.drc`);
        this.mesh = new Ce(e, new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                tMap: {
                    value: le.load(`${this.options.obj}_dark_color.ktx2`)
                },
                tNoise: {
                    value: le.load("perlin-datatexture.ktx2", "srgb-repeat")
                },
                tCaustics: {
                    value: le.load("caustics.ktx2", "srgb-repeat")
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}

                            varying vec2 vUv;
                            varying vec3 vPos;

                            void main() {
                                vUv = uv;
                                vPos = position;
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}
                            ${Cr}

                            varying vec2 vUv;
                            varying vec3 vPos;

                            uniform sampler2D tMap;
                            uniform sampler2D tNoise;
                            uniform sampler2D tCaustics;

                            void main() {
                                vec3 color = texture2D(tMap, vUv).rgb;
                                float noise = texture2D(tNoise, vPos.xy * 0.4 + vec2(-time * 0.1, time * 0.023)).r;
                                color *= mix(0.025, 0.15, noise);

                                float caustics = texture2D(tCaustics, vPos.xy * 1.5 + vec2(-time * 0.1, time * 0.023)).r;
                                caustics = min(caustics, texture2D(tCaustics, vPos.xy * 2.0 + vec2(time * 0.05, -time * 0.013)).r);
                                color += caustics * color.b * 30.0;

                                gl_FragColor = vec4(color, 1.0);
                            }
                        `
        })),
        this.mesh.name = "object",
        this.mesh.frustumCulled = !1,
        this.mesh.scale.setScalar(this.options.scale),
        q.devScene && (this.mesh.visible = this.index === 0),
        this.mesh.onBeforeRender = () => {
            const s = .035 * this.additionalRotationAmount.value,
                n = Math.sin(Fe.time * .3 + this.options.rand * 12.423) * s * Math.sign(this.options.rand - .5),
                r = Math.sin(Fe.time * .3 + this.options.rand * 42.987) * s * Math.sign(this.options.rand - .5),
                a = Math.sin(Fe.time * .3 + this.options.rand * 2.53) * s * Math.sign(this.options.rand - .5);
            this.mesh.rotation.set(n, r, a)
        },
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class WF {
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
        const e = new ot,
            t = [],
            s = [],
            n = 250;
        for (let r = 0; r < n; r++) {
            const a = Math.random() * 4 - 2,
                o = Math.random() * 4 - 2,
                l = (r / n - .5) * 2;
            t.push(a, o, l),
            s.push(Math.random()),
            s.push(Math.random()),
            s.push(Math.random())
        }
        e.setAttribute("position", new nt(t, 3)),
        e.setAttribute("random", new nt(s, 3)),
        this.mesh = new Fn(e, new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                uRotation: {
                    value: -.66
                }
            },
            vertexShader: `
                            ${ae}
                            ${Cr}

                            attribute vec3 random;

                            varying vec2 vUv;
                            varying float vLightFalloff;

                            uniform float uRotation;

                            void main() {
                                vUv = uv;
                                float t = time * 0.1;
                                vec3 pos = position;
                                pos.x += sin(t * 0.4 + position.y * 2.5);
                                pos.y += sin(t * 0.2 + position.x * 2.5);

                                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

                                // scale larger with screen gradient
                                vec2 ndc = gl_Position.xy / gl_Position.w;
                                float size = 15.0;
                                size *= mix(0.15, 1.0, pow(random.x, 2.0));
                                gl_PointSize = size * (resolution.y * 0.002);

                                // diagonal gradient
                                vec2 uv = ndc;
                                uv.x *= aspect;
                                uv *= 0.5;
                                uv += 0.5;
                                uv = rotateUV(uv, uRotation);
                                vLightFalloff = uv.y;
                                vLightFalloff *= 0.5;

                                // random flicker
                                vLightFalloff *= sin(time * 0.8 + random.y * 12.43) * 0.5 + 0.5;
                                vLightFalloff *= sin(time * 1.73 + random.z * 7.16) * 0.5 + 0.5;
                                vLightFalloff *= mix(0.5, 1.0, random.z);

                            }
                        `,
            fragmentShader: `
                            ${ae}

                            varying vec2 vUv;
                            varying float vLightFalloff;

                            void main() {
                                vec2 uv = gl_PointCoord.xy;
                                uv.y = 1.0 - uv.y;

                                float circularGrad = 1.0 - clamp(length(uv - 0.5) * 2.0, 0.0, 1.0);
                                circularGrad *= pow(uv.x, 2.0);
                                circularGrad = pow(circularGrad, 2.0);

                                vec3 color = vec3(1.0);
                                float alpha = circularGrad * vLightFalloff;
                                gl_FragColor = vec4(color, alpha);
                            }
                        `,
            transparent: !0,
            blending: pt
        })),
        this.mesh.name = "particles",
        this.mesh.renderOrder = 1,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class YF {
    constructor(e, t)
    {
        this.options = {
            ...t
        },
        this.scene = e,
        this.ready = new Promise(s => {
            this.isReady = s
        }),
        this.index = this.options.index,
        this.init()
    }
    init()
    {
        const e = new kt(1, 1);
        this.mesh = new Ce(e, new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                tMap: {
                    value: le.load("perlin-datatexture.png", "srgb-repeat")
                },
                uColor: {
                    value: new Z("#d1e3ff")
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}

                            varying vec2 vUv;

                            void main() {
                                vUv = uv;
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}
                            ${Cr}

                            varying vec2 vUv;

                            uniform sampler2D tMap;
                            uniform vec3 uColor;

                            void main() {
                                float t = time * 0.12;
                                float noise = texture2D(tMap, vUv * vec2(1.0, 0.46) + vec2(t, t * 0.323)).r;
                                noise += texture2D(tMap, vUv * vec2(0.5, 0.25) + vec2(-t * 0.77, -t * 0.414)).r;

                                float circularGradient = 1.0 - clamp(length(vUv - 0.5) * 2.0, 0.0, 1.0);
                                circularGradient = pow(circularGradient, 2.0);

                                vec3 color = uColor;
                                float alpha = circularGradient * noise * 0.07;

                                gl_FragColor = vec4(color, alpha);
                            }
                        `,
            transparent: !0,
            blending: pt
        })),
        this.mesh.name = "lightshaft",
        this.mesh.frustumCulled = !1,
        this.mesh.position.set(1.67, .79, 0),
        this.mesh.scale.set(1.5, 3, 1),
        this.mesh.rotation.z = -40 * 3.14 / 180,
        this.mesh.onBeforeRender = () => {},
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class qF {
    constructor(e, t)
    {
        this.options = {
            ...t
        },
        this.scene = e,
        this.ready = new Promise(s => {
            this.isReady = s
        }),
        this.index = this.options.index,
        this.init()
    }
    init()
    {
        const e = new kt(1, 1);
        this.mesh = new Ce(e, new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                tMap: {
                    value: le.load("perlin-datatexture.png", "srgb-repeat")
                },
                tBokeh: {
                    value: le.load("bokeh.ktx2", "srgb-repeat")
                },
                uColor: {
                    value: new Z("#d1e3ff")
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}

                            varying vec2 vUv;

                            void main() {
                                vUv = uv;
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}
                            ${Cr}

                            varying vec2 vUv;

                            uniform sampler2D tMap;
                            uniform sampler2D tBokeh;
                            uniform vec3 uColor;

                            void main() {
                                float circularGradient = 1.0 - clamp(length(vUv - 0.5) * 2.0, 0.0, 1.0);
                                circularGradient = pow(circularGradient, 2.0);

                                float bokeh = texture2D(tBokeh, vUv * 2.0).r;
                                float noise = texture2D(tMap, vUv * 2.0 + time * 0.15).r;
                                bokeh *= noise;
                                bokeh *= 5.0;

                                vec3 color = uColor;
                                float alpha = (circularGradient + bokeh * circularGradient) * 0.15;
                                // alpha *= 1.0 - vUv.x;

                                gl_FragColor = vec4(color, alpha);
                            }
                        `,
            transparent: !0,
            blending: pt
        })),
        this.mesh.name = "lightplane",
        this.mesh.frustumCulled = !1,
        this.mesh.position.set(-2.05, -.87, 1),
        this.mesh.scale.set(4, 4, 4),
        this.mesh.onBeforeRender = () => {
            this.mesh.position.x = -2.2 + Math.sin(Fe.time * .3) * .2,
            this.mesh.position.y = -.87 + Math.cos(Fe.time * .24) * .2
        },
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class XF {
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
        const e = new ot,
            t = [],
            s = [],
            n = 2,
            r = 1e4;
        for (let a = 0; a < r; a++) {
            const o = Math.random() * n * 2 - n,
                l = Math.random() * n * 2 - n,
                c = (Math.random() * n * 2 - n) * .5;
            t.push(o, l, c),
            s.push(Math.random()),
            s.push(Math.random()),
            s.push(Math.random())
        }
        e.setAttribute("position", new nt(t, 3)),
        e.setAttribute("random", new nt(s, 3)),
        this.mesh = new Fn(e, new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                uRotation: {
                    value: -.66
                },
                uColor: {
                    value: new Z("#2d3133")
                },
                tSim: {
                    value: this.scene.mouseSim.finalRT.texture
                }
            },
            vertexShader: `
                            ${ae}
                            ${Cr}
                            ${Ht}
                            ${Cg}

                            attribute vec3 random;

                            varying float vLightFalloff;
                            varying vec3 vRandom;

                            uniform float uRotation;
                            uniform sampler2D tSim;

                            void main() {
                                vRandom = random;

                                float t = time * 0.05;
                                vec3 pos = position;
                                pos.x += sin(t * 0.4 + position.y * 2.5);
                                pos.y += sin(t * 0.2 + position.x * 2.5);
                                pos.y += time * random.z * 0.2;
                                pos = treadmill(pos, vec3(1.0));
                                // pos.z += sin(t * 0.3 + position.z * 2.5);

                                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

                                vec2 ndc = gl_Position.xy / gl_Position.w;
                                vec2 fluid = texture(tSim, ndc * 0.5 + 0.5).rb;
                                float sim = fit(fluid.y, 1e-8, 0.3, 0.0, 1.0);
                                // sim = 1.;

                                // scale larger with screen gradient
                                float size = mix(3.0, 10.0, random.x * sim);
                                gl_PointSize = size * (resolution.y * 0.002);

                                // random flicker
                                float flick = sin(time * 0.8 + random.y * 12.43) * 0.5 + 0.5;
                                flick *= sin(time * 1.73 + random.z * 7.16) * 0.5 + 0.5;
                                vLightFalloff = mix(0.5, 1.0, flick) * sim;
                            }
                        `,
            fragmentShader: `
                            ${ae}
                            uniform vec3 uColor;

                            varying vec3 vRandom;
                            varying float vLightFalloff;

                            void main() {
                                vec2 uv = gl_PointCoord.xy;
                                float limit = step(length(uv - 0.5), 0.5);

                                if (vLightFalloff < 0.001 || limit < 0.001) discard;

                                float circularGrad = 1.0 - clamp(length(uv - 0.5) * 2.0, 0.0, 1.0);
                                circularGrad *= pow(uv.x, 2.0);
                                // circularGrad = pow(circularGrad, 2.0);

                                gl_FragColor = vec4(uColor, vLightFalloff * circularGrad);
                            }
                        `,
            depthTest: !0,
            depthWrite: !1,
            transparent: !1,
            blending: pt
        })),
        this.mesh.name = "little particles",
        this.mesh.renderOrder = 999,
        this.frustumCulled = !1,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class KF {
    constructor(e)
    {
        this.parent = e;
        const t = new vt(2, 2, {
            type: Mi,
            depthBuffer: !1
        });
        this.rts = [t, t.clone()],
        this.finalRT = t,
        this.renderer = he.renderer.webgl,
        this.splatPosition = new H,
        this.splatLastPosition = new H,
        this.splatLastMoveTime = 0,
        this.splatLastRenderTime = 0,
        this.splatTargetVelocity = 0,
        this.splatVelocity = 0,
        this.fsQuad = new wg(new fe({
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

                            float line(vec2 uv, vec2 point1, vec2 point2) {
                                vec2 pa = uv - point1, ba = point2 - point1;
                                pa.x *= aspect;
                                ba.x *= aspect;
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

                                vec2 invResolution = 1.0 / vec2(textureSize(tBuffer, 0));

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

                                vec4 prev = texture2D(tBuffer, uv);
                                float rim = nextVal - prev.r;

                                float rimLerp = prev.b + rim;
                                rimLerp *= 0.9;

                                gl_FragColor = vec4(nextVal, rim, rimLerp, 1.0);
                            }
                        `,
            depthTest: !1
        })),
        this.fsQuad._originalMaterial = this.fsQuad.material,
        this.resetMaterial = new fe({
            vertexShader: `
                            varying vec2 vUv;
                            void main() {
                                vUv = uv;
                                gl_Position = vec4( position, 1.0 );
                            }
                        `,
            fragmentShader: `
                            void main() {
                                gl_FragColor = vec4(0.0);
                            }
                        `,
            depthTest: !1
        }),
        this.reset(),
        this.update(),
        Q.on("touch_move", this.onTouchMove, this),
        this.resize(),
        Q.on("resize", this.resize, this),
        this.debug = !1,
        this.debug && this._debug()
    }
    onTouchMove(e)
    {
        this.splatPosition.set(e.position01.x, e.position01.y)
    }
    reset()
    {
        const e = this.renderer.getRenderTarget();
        this.fsQuad.material = this.resetMaterial,
        this.renderer.setRenderTarget(this.rts[0]),
        this.fsQuad.render(this.renderer),
        this.renderer.setRenderTarget(this.rts[1]),
        this.fsQuad.render(this.renderer),
        this.fsQuad.material = this.fsQuad._originalMaterial,
        this.renderer.setRenderTarget(e),
        this.splatLastPosition.copy(this.splatPosition),
        this.splatTargetVelocity = 0,
        this.splatVelocity = 0
    }
    update()
    {
        if (Fe.time - this.splatLastRenderTime < .015)
            return;
        this.splatLastRenderTime = Fe.time;
        let e = this.splatPosition.distanceTo(this.splatLastPosition);
        const t = Fe.time - this.splatLastMoveTime;
        e > 0 && (this.splatLastMoveTime = Fe.time),
        (t > .15 || this.splatHovered || e > .3) && (this.splatLastPosition.copy(this.splatPosition), this.splatTargetVelocity = 0, e = 0),
        this.splatTargetVelocity += e * 6,
        this.splatTargetVelocity *= .88,
        this.splatTargetVelocity = ie.clamp(this.splatTargetVelocity, 0, 1),
        this.splatVelocity = ie.lerp(this.splatVelocity, ie.ease(this.splatTargetVelocity, "power4.out"), .1),
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
    _debug()
    {
        const e = new kt(2, 2),
            t = new fe({
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
        this.debugMesh = new Ce(e, t),
        this.debugMesh.renderOrder = 1e3,
        this.debugMesh.frustumCulled = !1,
        this.parent.add(this.debugMesh)
    }
    resize()
    {
        const t = Math.floor(he.uniforms.resolution.value.x / 5),
            s = Math.floor(he.uniforms.resolution.value.y / 5);
        this.rts.forEach(n => {
            n.setSize(t, s)
        })
    }
}
class JF extends Jo {
    constructor(e={})
    {
        super({
            orbit: !1
        }),
        this.objects = [],
        this.controller = e.mainController,
        this.displayUIvar = {
            value: 0
        },
        this.init()
    }
    async init()
    {
        this.cameraOptions(),
        this.renderOptions(),
        this.mouseSim = new KF(this),
        await Promise.all([this.createBg(), this.createParticles(), this.createLittleParticles(), this.createObjects(), this.createLightShaft(), this.createLightPlane()]),
        q.devScene && this.debug(),
        this.beforeRenderCbs.push(this.update.bind(this)),
        this.isReady()
    }
    cameraOptions()
    {
        this.camera.basePosition.set(0, 0, 2.5),
        this.camera.baseTarget.set(0, 0, 0),
        this.camera.displacement.position.set(0, 0),
        this.camera.lerpPosition = .02,
        this.camera.shake.setScalar(.05),
        this.camera.shakeSpeed.setScalar(.05)
    }
    renderOptions() {}
    async createBg()
    {
        this.bg = new HF(this),
        await this.bg.ready
    }
    async createLightShaft()
    {
        this.lightshaft = new YF(this),
        await this.lightshaft.ready
    }
    async createLightPlane()
    {
        this.lightplane = new qF(this),
        await this.lightplane.ready
    }
    async createParticles()
    {
        this.particles = new WF(this),
        await this.particles.ready
    }
    async createLittleParticles()
    {
        this.littleParticles = new XF(this),
        await this.littleParticles.ready
    }
    async createObjects()
    {
        Be.cubes.forEach((e, t) => {
            const s = e.interior.obj,
                n = e.interior.objScale;
            this.objects.push(new VF(this, {
                obj: s,
                index: t,
                scale: n
            }))
        }),
        await Promise.all(this.objects.map(e => e.ready))
    }
    playInAnimation(e, t=0)
    {
        this.objects.forEach(s => {
            s.mesh.visible = s.index === e
        }),
        re.to(this.objects.map(s => s.additionalRotationAmount), {
            overwrite: !0,
            value: 1,
            duration: 1,
            delay: t + 1.5,
            ease: "power1.out"
        }),
        re.fromTo(this.displayUIvar, {
            value: 0
        }, {
            value: 1,
            duration: .7,
            delay: t + .5,
            onComplete: () => {
                this.mouseSim.reset(),
                Q.emit("webgl_project_show", e),
                Q.emit("webgl_play_audio", "project-text")
            }
        }),
        re.fromTo(this.camera.basePosition, {
            z: 4
        }, {
            overwrite: !0,
            z: 2.5,
            duration: 2,
            delay: t + .5,
            ease: "inOut1"
        })
    }
    playOutAnimation()
    {
        re.to(this.camera.basePosition, {
            overwrite: !0,
            z: 4,
            duration: .6,
            delay: 0,
            ease: "none"
        }),
        re.to(this.objects.map(e => e.additionalRotationAmount), {
            overwrite: !0,
            value: 0,
            duration: .6,
            ease: "power1.in"
        }),
        re.killTweensOf(this.displayUIvar),
        Q.emit("webgl_project_hide")
    }
    update()
    {
        this.mouseSim.update(),
        this.littleParticles && (this.littleParticles.mesh.material.uniforms.tSim.value = this.mouseSim.finalRT.texture)
    }
    dispose() {}
}
