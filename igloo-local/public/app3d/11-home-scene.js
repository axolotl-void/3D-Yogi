class g3 {
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
        const e = new bd(800, 12, 12),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    uColor1: {
                        value: new Z("#d1d6e3")
                    },
                    uColor2: {
                        value: new Z("#afb6c7")
                    },
                    uIntroColor: {
                        value: new Z("#b3bac9")
                    },
                    uProgress: {
                        value: 0
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
                                    vec3 pos = position;
                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}

                                varying vec2 vUv;
                                varying vec3 vPos;

                                uniform vec3 uColor1;
                                uniform vec3 uColor2;
                                uniform vec3 uIntroColor;
                                uniform float uProgress;

                                void main() {

                                    // light to dark gradient
                                    vec2 screenUv = gl_FragCoord.xy / resolution;
                                    float grad = (screenUv.x + screenUv.y) * 0.5;
                                    grad = pow(grad, 2.0);
                                    vec3 color1 = uColor1;
                                    vec3 color2 = uColor2;
                                    vec3 color = mix(color2, color1, grad);

                                    // intro animation
                                    color = mix(uIntroColor, color, uProgress);

                                    gl_FragColor = vec4(color, 1.0);
                                }
                            `,
                side: ei
            });
        this.mesh = new Ce(e, t),
        this.mesh.name = "sky",
        this.mesh.scale.x = -1,
        this.mesh.rotation.x = 16 * 3.14 / 180,
        this.mesh.rotation.z = -16 * 3.14 / 180,
        this.mesh.updateMatrixWorld(!0),
        this.mesh.matrixAutoUpdate = !1,
        this.mesh.receiveShadow = !1,
        this.mesh.castShadow = !1,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class v3 {
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
        const e = new kt(20, 5),
            t = le.load("wind_noise.ktx2", "srgb-repeat"),
            s = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tWind: {
                        value: t
                    },
                    uAlpha: {
                        value: 1
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vWorldPos;

                                void main() {
                                    vUv = uv;
                                    vPos = position;
                                    vec3 pos = position;
                                    vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vWorldPos;
                                varying vec3 vNormal;

                                uniform sampler2D tWind;
                                uniform float uAlpha;

                                void main() {
                                    vec2 uv = vUv;
                                    uv.x *= 2.0;

                                    // wind
                                    float t = time * 0.15;

                                    if (vWorldPos.x > 6.0) {
                                        t += 0.914;
                                    }
                                    float wind = texture2D(tWind, uv + vec2(-t, t * 0.4)).r;
                                    wind *= texture2D(tWind, uv * 1.25 + vec2(-t, 0.75)).r;
                                    wind *= texture2D(tWind, uv * 0.5 + vec2(-t, -t * 0.35)).r;
                                    wind *= 8.0;

                                    vec3 color = vec3(1.0);

                                    float alpha = wind;
                                    alpha *= 1.0 - vUv.y;
                                    alpha *= smoothstep(0.0, 0.1, vUv.y);
                                    alpha *= smoothstep(0.0, 0.5, vUv.x);
                                    alpha *= smoothstep(1.0, 0.8, vUv.x);
                                    alpha *= uAlpha;

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0
            });
        this.mesh1 = new Ce(e, s),
        this.mesh1.name = "smoke1",
        this.mesh1.position.set(-5, 1.25, -10),
        this.mesh1.renderOrder = 2,
        this.mesh2 = new Ce(e, s),
        this.mesh2.name = "smoke2",
        this.mesh2.position.set(13.45, 3, -4),
        this.mesh2.rotation.y = -10 * 3.14 / 180,
        this.mesh2.renderOrder = 2,
        this.mesh1.updateMatrixWorld(!0),
        this.mesh2.updateMatrixWorld(!0),
        this.mesh1.matrixAutoUpdate = !1,
        this.mesh2.matrixAutoUpdate = !1,
        this.mesh1.receiveShadow = !1,
        this.mesh1.castShadow = !1,
        this.mesh2.receiveShadow = !1,
        this.mesh2.castShadow = !1,
        this.scene.add(this.mesh1),
        this.scene.add(this.mesh2),
        this.isReady()
    }
}
const x3 = new b;
class y3 {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.mousePosition = new b,
        this.init()
    }
    async init()
    {
        const e = await zt.load("ground.drc"),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tMap: {
                        value: le.load("igloo/ground_color.ktx2", "srgb")
                    },
                    tGroundGlow: {
                        value: le.load("igloo/ground_glow.ktx2", "srgb")
                    },
                    tWind: {
                        value: le.load("wind_noise.ktx2", "srgb-repeat")
                    },
                    tTriangles: {
                        value: le.load("igloo/triangles_tiling.ktx2", "srgb-repeat")
                    },
                    tNoise: {
                        value: le.load("mosaic.ktx2", "srgb-repeat-nearest")
                    },
                    uMousePos: {
                        value: this.mousePosition
                    },
                    uProgress: {
                        value: q.devScene ? 1 : 0
                    },
                    uProgress2: {
                        value: q.devScene ? 1 : 0
                    },
                    uTriangleAlpha: {
                        value: 1
                    },
                    uAlpha: {
                        value: 1
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vWorldPos;
                                varying vec3 vMouseGlow;

                                uniform vec3 uMousePos;
                                uniform float uProgress;
                                uniform float uProgress2;
                                uniform sampler2D tNoise;

                                void main() {
                                    vUv = uv;
                                    vPos = position;
                                    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;

                                    vec3 pos = position;

                                    // approximate light glow based on igloo interaction
                                    vMouseGlow = (1.0 - clamp(distance(uMousePos, vWorldPos.xyz * vec3(1.0, 0.0, 1.0)), 0.0, 5.0) / 5.0) * vec3(0.5, 0.7, 1.0) * smoothstep(-0.5, 2.0, uMousePos.y);
                                    vMouseGlow *= 1.0 - clamp(length(vWorldPos.xyz), 0.0, 9.0) / 9.0;
                                    vMouseGlow *= 2.0;

                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vWorldPos;
                                varying vec3 vMouseGlow;
                                varying vec3 vNormal;

                                uniform sampler2D tMap;
                                uniform sampler2D tWind;
                                uniform sampler2D tGroundGlow;
                                uniform sampler2D tTriangles;
                                uniform sampler2D tNoise;

                                uniform vec3 uMousePos;
                                uniform float uProgress;
                                uniform float uProgress2;
                                uniform float uTriangleAlpha;
                                uniform float uAlpha;

                                void main() {
                                    float alpha = 1.0;

                                    vec3 terrainColor = texture2D(tMap, vUv).rgb;

                                    // ground glow based on mouse position
                                    vec3 glow = texture2D(tGroundGlow, vUv).rgb;
                                    float glowStrength = (sin(vPos.x - time * 1.0 + 3.2) * 0.5 + 0.5);
                                    terrainColor += glow * glowStrength * terrainColor.r;
                                    terrainColor += vMouseGlow * terrainColor.r;

                                    // wind
                                    float t = time;
                                    float radialGrad = 1.0 - smoothstep(1.0, 0.8, length(vPos) * 0.2);
                                    float verticalGrad = (1.0 - clamp(vPos.y * 0.3 + 1.1, 0.0, 1.0));
                                    float wind = texture2D(tWind, vWorldPos.xz * 0.15 + vUv * 0.1 + vec2(-t * 0.15, -t * 0.15)).r;
                                    wind *= texture2D(tWind, vWorldPos.xz * 0.17 + vUv * 0.1 + vec2(-t * 0.15, -t * 0.15)).r;
                                    wind *= verticalGrad;
                                    terrainColor = mix(terrainColor, vec3(1.0), wind * 4.0);

                                    vec3 color = terrainColor;

                                    // intro animation
                                    if (uProgress2 < 1.0) {
                                        // reduce alpha to zero so we can composite layers onto it
                                        alpha *= 0.0;

                                        // create input textures and values
                                        float noise = texture2D(tNoise, vWorldPos.xz * 0.07).r;
                                        float triangles = texture2D(tTriangles, vWorldPos.xz * 0.25).r;
                                        vec3 blue = vec3(0.3, 0.45, 1.0);
                                        float inputGradient = length(vWorldPos.xz);
                                        inputGradient += noise * 3.5;

                                        // terrain layer
                                        vec3 terrainShockwaveColor = vec3(0.0);
                                        float terrainShockwaveAlpha = 0.0;
                                        float terrainFalloff = 1.0 - falloffsmooth(inputGradient, 0.0, 32.0, 8.0, uProgress2);
                                        float terrainFalloff2 = 1.0 - falloffsmooth(inputGradient, 0.0, 32.0, 3.0, uProgress2);
                                        terrainShockwaveColor += terrainFalloff * triangles * blue * 3.0;
                                        terrainShockwaveColor += terrainFalloff2 * blue;
                                        terrainShockwaveAlpha += falloff(inputGradient, -0.1, 31.9, 0.1, uProgress2);

                                        // triangle layer
                                        vec3 triangleShockwaveColor = vec3(0.0);
                                        float triangleShockwaveAlpha = 0.0;
                                        float triangleFalloff = 1.0 - falloffsmooth(inputGradient, 0.0, 32.0, 10.0, uProgress);
                                        triangleShockwaveColor += blue;
                                        triangleShockwaveAlpha += falloff(inputGradient, 1.0, 33.0, 0.1, uProgress);
                                        triangleShockwaveAlpha *= triangleFalloff;
                                        triangleShockwaveAlpha *= triangles;

                                        // composite layers
                                        color += terrainShockwaveColor;
                                        alpha += terrainShockwaveAlpha;

                                        color += triangleShockwaveColor * (1.0 - terrainShockwaveAlpha);
                                        alpha += triangleShockwaveAlpha * (1.0 - terrainShockwaveAlpha);
                                    }

                                    // fade at edges
                                    alpha *= 1.0 - smoothstep(0.8, 1.0, length(vPos.xz) * 0.1085);

                                    // color safety
                                    alpha = clamp(alpha, 0.0, 1.0);
                                    color = clamp(color, vec3(0.0), vec3(1.0));

                                    // global fade
                                    alpha *= uAlpha;

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0
            });
        this.mesh = new Ce(e, t),
        this.mesh.name = "igloobase",
        this.mesh.renderOrder = 2,
        this.mesh.updateMatrixWorld(!0),
        this.mesh.matrixAutoUpdate = !1,
        this.mesh.receiveShadow = !1,
        this.mesh.castShadow = !1,
        this.scene.add(this.mesh),
        this.scene.beforeRenderCbs.push(() => {
            Si.planeInteraction.setCamera(this.scene.camera);
            const s = Si.planeInteraction.unprojectDistance(19.25);
            x3.copy(s),
            this.mousePosition.lerp(s, ie.lerpCoefFPS(.03))
        }),
        this.isReady()
    }
}
let _3 = class  extends ga{
    constructor()
    {
        super(),
        this.uniforms = {
            uniformsGroups: [he.UBO],
            uProgress: {
                value: 1
            },
            uAlpha: {
                value: .185
            }
        },
        this.onBeforeCompile = e => {
            e.uniforms = {
                ...e.uniforms,
                ...this.uniforms
            },
            e.vertexShader = `
                            attribute vec3 color;
                            attribute vec3 centr;

                            varying vec3 vColor;
                            varying vec3 vWorldPos;
                            varying vec3 vCentr;

                            ${e.vertexShader}
                        `,
            e.vertexShader = e.vertexShader.replace("#include <skinning_vertex>", `
                            vColor = color;
                            vCentr = centr;
                            vWorldPos = (modelMatrix * vec4(centr, 1.0)).xyz;
                        `),
            e.fragmentShader = `
                            ${ae}
                            ${Ue}

                            varying vec3 vColor;
                            varying vec3 vCentr;
                            varying vec3 vWorldPos;

                            uniform float uProgress;
                            uniform float uAlpha;

                            ${e.fragmentShader}
                        `,
            e.fragmentShader = e.fragmentShader.replace("#include <dithering_fragment>", `
                                float intro_gradientInput = length(vWorldPos);
                                float intro_shockwave = falloff(intro_gradientInput, 0.0, 20.0, 5.0, uProgress);

                                float alpha = uAlpha;
                                alpha *= intro_shockwave;

                                float idleAnimation = sin(vColor.r * 13.0 + time * 6.0) * 0.5 + 0.5;
                                alpha *= idleAnimation;

                                gl_FragColor.a = alpha;
                        `)
        }
    }
}
;
class w3 {
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
        const e = await zt.load("igloo/igloo_cage.drc"),
            t = new _3({
                color: "#a7b2d6",
                opacity: .3,
                transparent: !0
            });
        t.depthTest = !1,
        t.depthWrite = !1,
        t.blending = pt,
        t.transparent = !0,
        this.mesh = new yr(e, t),
        this.mesh.frustumCulled = !1,
        this.mesh.visible = !q.devScene,
        this.mesh.name = "igloo_cage",
        this.mesh.renderOrder = 999,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class E3 extends ga {
    constructor()
    {
        super(),
        this.uniforms = {
            uniformsGroups: [he.UBO],
            uProgress: {
                value: 1
            },
            uAlpha: {
                value: 1
            },
            uScrollAlpha: {
                value: 0
            },
            uIntroMaterialize: {
                value: 0
            }
        },
        this.onBeforeCompile = e => {
            e.uniforms = {
                ...e.uniforms,
                ...this.uniforms
            },
            e.vertexShader = `
                            attribute vec3 color;
                            attribute vec3 centr;

                            varying vec3 vColor;
                            varying vec3 vWorldPos;
                            varying vec3 vCentr;

                            ${e.vertexShader}
                        `,
            e.vertexShader = e.vertexShader.replace("#include <skinning_vertex>", `
                            vColor = color;
                            vCentr = centr;
                            vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
                        `),
            e.fragmentShader = `
                            ${ae}
                            ${Ue}

                            varying vec3 vColor;
                            varying vec3 vCentr;
                            varying vec3 vWorldPos;

                            uniform float uProgress;
                            uniform float uAlpha;
                            uniform float uScrollAlpha;
                            uniform float uIntroMaterialize;

                            ${e.fragmentShader}
                        `,
            e.fragmentShader = e.fragmentShader.replace("#include <dithering_fragment>", `
                                // intro materialize effect

                                float alpha = mix(uAlpha, 1.0, uScrollAlpha);
                                float idleAnimation = sin(vWorldPos.y * 6.0 + time * 5.0) * 0.5 + 0.5;
                                idleAnimation *= cos(vWorldPos.z * 6.0 + time * 5.0) * 0.5 + 0.5;
                                idleAnimation *= sin(vWorldPos.x * 6.0 + time * 5.0) * 0.5 + 0.5;
                                idleAnimation = idleAnimation * 0.8 + 0.2;
                                alpha *= idleAnimation;

                                // materialize effect
                                alpha *= falloffsmooth(vWorldPos.y, 3.5, 0.1, 2.0, uIntroMaterialize);

                                gl_FragColor.a = alpha;
                        `)
        }
    }
}
class C3 {
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
        const e = await zt.load("igloo/igloo_outline.drc"),
            t = new E3({
                color: "#a7b2d6",
                opacity: .3,
                transparent: !0
            });
        t.depthTest = !1,
        t.depthWrite = !1,
        t.blending = pt,
        t.transparent = !0,
        this.mesh = new yr(e, t),
        this.mesh.frustumCulled = !1,
        this.mesh.visible = !0,
        this.mesh.name = "igloo_outline",
        this.mesh.renderOrder = 999,
        this.scene.add(this.mesh),
        this.mesh.onBeforeRender = () => {
            const s = ie.ease(ie.fit(this.scene.progress, 0, .35, 1, 0), "sine.in") * 2;
            this.mesh.material.uniforms.uScrollAlpha.value = s
        },
        this.isReady()
    }
}
class S3 {
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
        const e = await zt.load("mountain.drc"),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    uColor1: {
                        value: new Z("#d1d6e3")
                    },
                    uColor2: {
                        value: new Z("#afb6c7")
                    },
                    tMap: {
                        value: le.load("igloo/mountain_color.ktx2", "srgb")
                    },
                    tTriangles: {
                        value: le.load("igloo/triangles_tiling.ktx2", "srgb-repeat")
                    },
                    tNoise: {
                        value: le.load("mosaic.ktx2", "srgb-repeat-nearest")
                    },
                    uProgress: {
                        value: 1
                    },
                    uProgress2: {
                        value: 1
                    },
                    uTriangleAlpha: {
                        value: 1
                    },
                    uAlpha: {
                        value: 1
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vWorldPos;
                                varying vec4 vMvPos;

                                uniform float uProgress;
                                uniform float uProgress2;

                                void main() {
                                    vUv = uv;
                                    vPos = position;
                                    vMvPos = modelViewMatrix * vec4(position, 1.0);
                                    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;

                                    vec3 pos = position;

                                    // intro displacement
                                    float maxDist = 32.0;
                                    float worldLen01 = clamp(length(vWorldPos.xz), 0.0, maxDist) / maxDist;
                                    float wave2 = smoothstep(0.0 + uProgress, 0.5 + uProgress, worldLen01);
                                    wave2 = pow(wave2, 20.0);
                                    // pos.y += wave2;

                                    gl_Position = projectionMatrix * vMvPos;
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec4 vMvPos;
                                varying vec3 vWorldPos;

                                uniform vec3 uColor1;
                                uniform vec3 uColor2;
                                uniform sampler2D tMap;
                                uniform sampler2D tTriangles;
                                uniform sampler2D tNoise;

                                uniform float uProgress;
                                uniform float uProgress2;
                                uniform float uTriangleAlpha;
                                uniform float uAlpha;

                                void main() {
                                    // fog gradient
                                    vec2 screenUv = gl_FragCoord.xy / resolution;
                                    float grad = (screenUv.x + screenUv.y) * 0.5;
                                    grad = pow(grad, 2.0);
                                    vec3 color1 = uColor1;
                                    vec3 color2 = uColor2;
                                    vec3 fogColor = mix(color2, color1, grad);

                                    vec3 color = texture2D(tMap, vUv).rgb;
                                    float alpha = 1.0;

                                    float distanceFog = clamp(-vMvPos.z * 0.005, 0.0, 1.0);
                                    float fog = clamp(1.0 - vWorldPos.y * 0.05 - 0.5, 0.0, 1.0);
                                    fog += distanceFog * 0.75;

                                    // intro animation
                                    if (uProgress2 < 1.0) {
                                        vec3 originalColor = color;

                                        // create input textures and values
                                        float noise = texture2D(tNoise, vWorldPos.xz * 0.07).r;
                                        float triangles = texture2D(tTriangles, vWorldPos.xz * 0.25).r;
                                        vec3 blue = vec3(0.3, 0.45, 1.0);
                                        float inputGradient = length(vWorldPos.xz);
                                        inputGradient += noise * 3.5;

                                        // mask background mountains from effects, so they're always visible
                                        float backgroundMountainsMask = smoothstep(32.0, 36.0, inputGradient);
                                        float invBackgroundMountainsMask = 1.0 - backgroundMountainsMask;

                                        // reduce alpha to zero so we can composite layers onto it
                                        alpha = backgroundMountainsMask * uAlpha;

                                        // terrain layer
                                        vec3 terrainShockwaveColor = vec3(0.0);
                                        float terrainShockwaveAlpha = 0.0;
                                        float terrainFalloff = 1.0 - falloffsmooth(inputGradient, 0.0, 32.0, 8.0, uProgress2);
                                        float terrainFalloff2 = 1.0 - falloffsmooth(inputGradient, 0.0, 32.0, 3.0, uProgress2);
                                        terrainShockwaveColor += terrainFalloff * triangles * blue * 3.0;
                                        terrainShockwaveColor += terrainFalloff2 * blue;
                                        terrainShockwaveAlpha += falloff(inputGradient, -0.1, 31.9, 0.1, uProgress2);

                                        // triangle layer
                                        vec3 triangleShockwaveColor = vec3(0.0);
                                        float triangleShockwaveAlpha = 0.0;
                                        float triangleFalloff = 1.0 - falloffsmooth(inputGradient, 0.0, 32.0, 10.0, uProgress);
                                        triangleShockwaveColor += blue;
                                        triangleShockwaveAlpha += falloff(inputGradient, 1.0, 33.0, 0.1, uProgress);
                                        triangleShockwaveAlpha *= triangleFalloff;
                                        triangleShockwaveAlpha *= triangles;

                                        // composite layers
                                        color += terrainShockwaveColor * invBackgroundMountainsMask;
                                        alpha += terrainShockwaveAlpha * invBackgroundMountainsMask;

                                        color += triangleShockwaveColor * (1.0 - terrainShockwaveAlpha) * invBackgroundMountainsMask;
                                        alpha += triangleShockwaveAlpha * (1.0 - terrainShockwaveAlpha) * invBackgroundMountainsMask;

                                        // prevent snapping color at end of animation
                                        float endmix = smoothstep(0.8, 1.0, uProgress2);
                                        color = mix(color, originalColor, endmix);
                                    }

                                    // fade at edges
                                    alpha = clamp(alpha, 0.0, 1.0);
                                    alpha *= 1.0 - smoothstep(0.7, 0.9, length(vPos.xz) * 0.1085);

                                    color = clamp(color, vec3(0.0), vec3(1.0));

                                    // fog
                                    color = mix(color, fogColor * 1.1 + smoothstep(0.5, 1.0, color.r), fog);

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0
            });
        this.mesh1 = new Ce(e, t),
        this.mesh1.position.set(59.53, -1, -11.84),
        this.mesh1.scale.x = 4,
        this.mesh1.scale.y = 3.14,
        this.mesh1.scale.z = 4,
        this.mesh1.rotation.x = 4.1 * 3.14 / 180,
        this.mesh1.rotation.y = -42.8 * 3.14 / 180,
        this.mesh1.rotation.z = 5 * 3.14 / 180,
        this.mesh1.name = "mountain1",
        this.mesh1.renderOrder = 1,
        this.mesh2 = new Ce(e, t),
        this.mesh2.position.set(1, -2.21, -23),
        this.mesh2.rotation.x = 3.5 * 3.14 / 180,
        this.mesh2.rotation.y = 30 * 3.14 / 180,
        this.mesh2.rotation.z = 0 * 3.14 / 180,
        this.mesh2.scale.setScalar(2),
        this.mesh2.name = "mountain2",
        this.mesh2.renderOrder = 1,
        this.mesh3 = new Ce(e, t),
        this.mesh3.position.x = 75,
        this.mesh3.position.y = 0,
        this.mesh3.position.z = -90,
        this.mesh3.scale.x = 8,
        this.mesh3.scale.y = 8,
        this.mesh3.scale.z = 8,
        this.mesh3.rotation.x = 3.2 * 3.14 / 180,
        this.mesh3.rotation.y = -16.7 * 3.14 / 180,
        this.mesh3.rotation.z = -2.6 * 3.14 / 180,
        this.mesh3.name = "mountain3",
        this.mesh3.renderOrder = 1,
        this.mesh4 = new Ce(e, t),
        this.mesh4.position.x = 250,
        this.mesh4.position.y = 11.33,
        this.mesh4.position.z = -133,
        this.mesh4.scale.x = 10,
        this.mesh4.scale.y = 10,
        this.mesh4.scale.z = 10,
        this.mesh4.rotation.x = 13.2 * 3.14 / 180,
        this.mesh4.rotation.y = 20 * 3.14 / 180,
        this.mesh4.rotation.z = 5 * 3.14 / 180,
        this.mesh4.name = "mountain4",
        this.mesh4.renderOrder = 1,
        this.mesh5 = new Ce(e, t),
        this.mesh5.position.set(-25.22, -1.59, -53.05),
        this.mesh5.rotation.x = 3.5 * 3.14 / 180,
        this.mesh5.rotation.y = 25 * 3.14 / 180,
        this.mesh5.rotation.z = 0 * 3.14 / 180,
        this.mesh5.scale.setScalar(2.5),
        this.mesh5.name = "mountain5",
        this.mesh5.renderOrder = 1,
        this.mesh1.updateMatrixWorld(!0),
        this.mesh2.updateMatrixWorld(!0),
        this.mesh3.updateMatrixWorld(!0),
        this.mesh4.updateMatrixWorld(!0),
        this.mesh5.updateMatrixWorld(!0),
        this.mesh1.matrixAutoUpdate = !1,
        this.mesh2.matrixAutoUpdate = !1,
        this.mesh3.matrixAutoUpdate = !1,
        this.mesh4.matrixAutoUpdate = !1,
        this.mesh5.matrixAutoUpdate = !1,
        this.mesh1.receiveShadow = !1,
        this.mesh2.receiveShadow = !1,
        this.mesh3.receiveShadow = !1,
        this.mesh4.receiveShadow = !1,
        this.mesh5.receiveShadow = !1,
        this.mesh1.castShadow = !1,
        this.mesh2.castShadow = !1,
        this.mesh3.castShadow = !1,
        this.mesh4.castShadow = !1,
        this.mesh5.castShadow = !1,
        this.scene.add(this.mesh1),
        this.scene.add(this.mesh2),
        this.scene.add(this.mesh3),
        this.scene.add(this.mesh4),
        this.scene.add(this.mesh5),
        this.isReady()
    }
}
class M3 {
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
        const e = await zt.load("ground.drc"),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tMap: {
                        value: le.load("igloo/ground_sansigloo_color.ktx2", "srgb")
                    },
                    tWind: {
                        value: le.load("wind_noise.ktx2", "srgb-repeat")
                    },
                    tTriangles: {
                        value: le.load("igloo/triangles_tiling.ktx2", "srgb-repeat")
                    },
                    tNoise: {
                        value: le.load("mosaic.ktx2", "srgb-repeat-nearest")
                    },
                    uProgress: {
                        value: q.devScene ? 1 : 0
                    },
                    uProgress2: {
                        value: q.devScene ? 1 : 0
                    },
                    uTriangleAlpha: {
                        value: 1
                    },
                    uAlpha: {
                        value: 1
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vWorldPos;

                                uniform float uProgress;
                                uniform float uProgress2;
                                uniform sampler2D tNoise;

                                void main() {
                                    vUv = uv;
                                    vPos = position;
                                    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;

                                    vec3 pos = position;

                                    // intro displacement
                                    // float maxDist = 32.0;
                                    // float noise = texture2D(tNoise, vWorldPos.xz * 0.07).r;
                                    // float worldLen01 = clamp(length(vWorldPos.xz), 0.0, maxDist) / maxDist;
                                    // worldLen01 += noise * 0.1;
                                    // float wave2 = smoothstep(0.0 + uProgress, 0.5 + uProgress, worldLen01);
                                    // wave2 = pow(wave2, 35.0);
                                    // pos.y += wave2 * smoothstep(0.1, 0.15, worldLen01) * 0.5;

                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vWorldPos;

                                uniform sampler2D tMap;
                                uniform sampler2D tWind;
                                uniform sampler2D tTriangles;
                                uniform sampler2D tNoise;

                                uniform float uProgress;
                                uniform float uProgress2;
                                uniform float uTriangleAlpha;
                                uniform float uAlpha;

                                float hash12(vec2 p) {
                                    vec3 p3  = fract(vec3(p.xyx) * .1031);
                                    p3 += dot(p3, p3.yzx + 33.33);
                                    return fract((p3.x + p3.y) * p3.z);
                                }

                                void main() {
                                    vec3 color = texture2D(tMap, vUv).rgb;
                                    float alpha = 1.0;

                                    // wind
                                    float t = time;
                                    float wind = texture2D(tWind, vWorldPos.xz * 0.1 + vWorldPos.xy * 0.1 + vec2(-t * 0.25, -t * 0.3)).r;
                                    float verticalGrad = (1.0 - clamp(vPos.y * 0.5 + 0.75, 0.0, 1.0));
                                    wind *= texture2D(tWind, vWorldPos.xz * 0.15 + vWorldPos.xy * 0.15 + vec2(-t * 0.18, -t * 0.225)).r;
                                    wind *= verticalGrad;
                                    wind *= color.r;
                                    wind *= 2.0;
                                    color += wind;

                                    // intro animation
                                    if (uProgress2 < 1.0) {
                                        // reduce alpha to zero so we can composite layers onto it
                                        alpha *= 0.0;

                                        // create input textures and values
                                        float noise = texture2D(tNoise, vWorldPos.xz * 0.07).r;
                                        float triangles = texture2D(tTriangles, vWorldPos.xz * 0.25).r;
                                        vec3 blue = vec3(0.3, 0.45, 1.0);
                                        float inputGradient = length(vWorldPos.xz);
                                        inputGradient += noise * 3.5;

                                        // terrain layer
                                        vec3 terrainShockwaveColor = vec3(0.0);
                                        float terrainShockwaveAlpha = 0.0;
                                        float terrainFalloff = 1.0 - falloffsmooth(inputGradient, 0.0, 32.0, 8.0, uProgress2);
                                        float terrainFalloff2 = 1.0 - falloffsmooth(inputGradient, 0.0, 32.0, 3.0, uProgress2);
                                        terrainShockwaveColor += terrainFalloff * triangles * blue * 3.0;
                                        terrainShockwaveColor += terrainFalloff2 * blue;
                                        terrainShockwaveAlpha += falloff(inputGradient, -0.1, 31.9, 0.1, uProgress2);

                                        // triangle layer
                                        vec3 triangleShockwaveColor = vec3(0.0);
                                        float triangleShockwaveAlpha = 0.0;
                                        float triangleFalloff = 1.0 - falloffsmooth(inputGradient, 0.0, 32.0, 10.0, uProgress);
                                        triangleShockwaveColor += blue;
                                        triangleShockwaveAlpha += falloff(inputGradient, 1.0, 33.0, 0.1, uProgress);
                                        triangleShockwaveAlpha *= triangleFalloff;
                                        triangleShockwaveAlpha *= triangles;

                                        // composite layers
                                        color += terrainShockwaveColor;
                                        alpha += terrainShockwaveAlpha;

                                        color += triangleShockwaveColor * (1.0 - terrainShockwaveAlpha);
                                        alpha += triangleShockwaveAlpha * (1.0 - terrainShockwaveAlpha);
                                    }

                                    // fade at edges
                                    alpha = clamp(alpha, 0.0, 1.0);
                                    alpha *= 1.0 - smoothstep(0.85, 1.0, length(vPos.xz) * 0.1085);

                                    alpha *= uAlpha;

                                    color = clamp(color, vec3(0.0), vec3(1.0));

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0
            });
        this.mesh1 = new Ce(e, t),
        this.mesh1.position.set(-3.76, -.58, 12.5),
        this.mesh1.scale.set(.6, .6, .6),
        this.mesh1.rotation.x = -5.1 * 3.14 / 180,
        this.mesh1.rotation.y = 0 * 3.14 / 180,
        this.mesh1.rotation.z = 0 * 3.14 / 180,
        this.mesh1.name = "terrain1",
        this.mesh1.renderOrder = 1,
        this.mesh2 = new Ce(e, t),
        this.mesh2.position.set(-17.63, -.01, 2),
        this.mesh2.rotation.x = 2.7 * 3.14 / 180,
        this.mesh2.rotation.y = .8 * 3.14 / 180,
        this.mesh2.rotation.z = 0 * 3.14 / 180,
        this.mesh2.scale.set(1, 1, 1),
        this.mesh2.name = "terrain2",
        this.mesh2.renderOrder = 3,
        this.mesh3 = new Ce(e, t),
        this.mesh3.position.set(3.12, -.75, -1.02),
        this.mesh3.scale.set(1.5, .66, 1.5),
        this.mesh3.rotation.x = 0 * 3.14 / 180,
        this.mesh3.rotation.y = 0,
        this.mesh3.rotation.z = 0,
        this.mesh3.name = "terrain3",
        this.mesh3.renderOrder = 1,
        this.mesh4 = new Ce(e, t),
        this.mesh4.position.set(6, .16, 15.78),
        this.mesh4.scale.setScalar(1, 1, 1),
        this.mesh4.rotation.x = 1.1 * 3.14 / 180,
        this.mesh4.rotation.y = 0 * 3.14 / 180,
        this.mesh4.rotation.z = 7 * 3.14 / 180,
        this.mesh4.name = "terrain4",
        this.mesh4.renderOrder = 2,
        this.mesh5 = new Ce(e, t),
        this.mesh5.position.set(16.06, .34, 4),
        this.mesh5.scale.x = 1,
        this.mesh5.scale.y = 1,
        this.mesh5.scale.z = 1,
        this.mesh5.rotation.x = 0,
        this.mesh5.rotation.y = 0,
        this.mesh5.rotation.z = 0,
        this.mesh5.name = "terrain5",
        this.mesh5.renderOrder = 2,
        this.mesh1.updateMatrixWorld(!0),
        this.mesh2.updateMatrixWorld(!0),
        this.mesh3.updateMatrixWorld(!0),
        this.mesh4.updateMatrixWorld(!0),
        this.mesh5.updateMatrixWorld(!0),
        this.mesh1.matrixAutoUpdate = !1,
        this.mesh2.matrixAutoUpdate = !1,
        this.mesh3.matrixAutoUpdate = !1,
        this.mesh4.matrixAutoUpdate = !1,
        this.mesh5.matrixAutoUpdate = !1,
        this.mesh1.receiveShadow = !1,
        this.mesh2.receiveShadow = !1,
        this.mesh3.receiveShadow = !1,
        this.mesh4.receiveShadow = !1,
        this.mesh5.receiveShadow = !1,
        this.mesh1.castShadow = !1,
        this.mesh2.castShadow = !1,
        this.mesh3.castShadow = !1,
        this.mesh4.castShadow = !1,
        this.mesh5.castShadow = !1,
        this.scene.add(this.mesh1),
        this.scene.add(this.mesh2),
        this.scene.add(this.mesh3),
        this.scene.add(this.mesh4),
        this.scene.add(this.mesh5),
        this.isReady()
    }
}
class b3 {
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
        const e = await zt.load("igloo/patch.drc"),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tMap: {
                        value: le.load("igloo/ground_sansigloo_color.ktx2", "srgb")
                    },
                    tWind: {
                        value: le.load("wind_noise.ktx2", "srgb-repeat")
                    },
                    tTriangles: {
                        value: le.load("igloo/triangles_tiling.ktx2", "srgb-repeat")
                    },
                    tNoise: {
                        value: le.load("mosaic.ktx2", "srgb-repeat-nearest")
                    },
                    uProgress: {
                        value: 0
                    },
                    uProgress2: {
                        value: 0
                    },
                    uTriangleAlpha: {
                        value: 1
                    },
                    uAlpha: {
                        value: 1
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vWorldPos;

                                uniform float uProgress;
                                uniform float uProgress2;
                                uniform sampler2D tNoise;

                                void main() {
                                    vUv = uv;
                                    vPos = position;
                                    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;

                                    vec3 pos = position;

                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vWorldPos;

                                uniform sampler2D tMap;
                                uniform sampler2D tWind;
                                uniform sampler2D tTriangles;
                                uniform sampler2D tNoise;

                                uniform float uProgress;
                                uniform float uProgress2;
                                uniform float uTriangleAlpha;
                                uniform float uAlpha;

                                float hash12(vec2 p) {
                                    vec3 p3  = fract(vec3(p.xyx) * .1031);
                                    p3 += dot(p3, p3.yzx + 33.33);
                                    return fract((p3.x + p3.y) * p3.z);
                                }

                                void main() {
                                    vec3 color = texture2D(tMap, vUv).rgb;
                                    float alpha = 1.0;

                                    // wind
                                    float t = time;
                                    float wind = texture2D(tWind, vWorldPos.xz * 0.1 + vWorldPos.xy * 0.1 + vec2(-t * 0.25, -t * 0.3)).r;
                                    float verticalGrad = (1.0 - clamp(vPos.y * 0.5 + 0.75, 0.0, 1.0));
                                    wind *= texture2D(tWind, vWorldPos.xz * 0.15 + vWorldPos.xy * 0.15 + vec2(-t * 0.18, -t * 0.225)).r;
                                    wind *= verticalGrad;
                                    wind *= color.r;
                                    wind *= 2.0;
                                    color += wind;

                                    // intro animation
                                    if (uProgress2 < 1.0) {
                                        // reduce alpha to zero so we can composite layers onto it
                                        alpha *= 0.0;

                                        // create input textures and values
                                        float noise = texture2D(tNoise, vWorldPos.xz * 0.07).r;
                                        float triangles = texture2D(tTriangles, vWorldPos.xz * 0.25).r;
                                        vec3 blue = vec3(0.3, 0.45, 1.0);
                                        float inputGradient = length(vWorldPos.xz);
                                        inputGradient += noise * 3.5;

                                        // terrain layer
                                        vec3 terrainShockwaveColor = vec3(0.0);
                                        float terrainShockwaveAlpha = 0.0;
                                        float terrainFalloff = 1.0 - falloffsmooth(inputGradient, 0.0, 32.0, 8.0, uProgress2);
                                        float terrainFalloff2 = 1.0 - falloffsmooth(inputGradient, 0.0, 32.0, 3.0, uProgress2);
                                        terrainShockwaveColor += terrainFalloff * triangles * blue * 3.0;
                                        terrainShockwaveColor += terrainFalloff2 * blue;
                                        terrainShockwaveAlpha += falloff(inputGradient, -0.1, 31.9, 0.1, uProgress2);

                                        // triangle layer
                                        vec3 triangleShockwaveColor = vec3(0.0);
                                        float triangleShockwaveAlpha = 0.0;
                                        float triangleFalloff = 1.0 - falloffsmooth(inputGradient, 0.0, 32.0, 10.0, uProgress);
                                        triangleShockwaveColor += blue;
                                        triangleShockwaveAlpha += falloff(inputGradient, 1.0, 33.0, 0.1, uProgress);
                                        triangleShockwaveAlpha *= triangleFalloff;
                                        triangleShockwaveAlpha *= triangles;

                                        // composite layers
                                        color += terrainShockwaveColor;
                                        alpha += terrainShockwaveAlpha;

                                        color += triangleShockwaveColor * (1.0 - terrainShockwaveAlpha);
                                        alpha += triangleShockwaveAlpha * (1.0 - terrainShockwaveAlpha);
                                    }

                                    // fade at edges
                                    alpha = clamp(alpha, 0.0, 1.0);
                                    alpha *= 1.0 - smoothstep(0.3, 0.48, length(vPos.xz));

                                    alpha *= uAlpha;

                                    color = clamp(color, vec3(0.0), vec3(1.0));

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0
            });
        this.mesh1 = new Ce(e, t),
        this.mesh1.position.set(-9.34, -1.77, 6.96),
        this.mesh1.scale.set(7, 7, 7),
        this.mesh1.rotation.x = 0 * 3.14 / 180,
        this.mesh1.rotation.y = 0 * 3.14 / 180,
        this.mesh1.rotation.z = 0 * 3.14 / 180,
        this.mesh1.name = "terrainpatch1",
        this.mesh1.renderOrder = 0,
        this.mesh2 = new Ce(e, t),
        this.mesh2.position.set(-8.82, -1.35, 11.69),
        this.mesh2.scale.set(8, 8, 8),
        this.mesh2.rotation.x = -5.5 * 3.14 / 180,
        this.mesh2.rotation.y = -25.6 * 3.14 / 180,
        this.mesh2.rotation.z = 0 * 3.14 / 180,
        this.mesh2.name = "terrainpatch2",
        this.mesh2.renderOrder = 0,
        this.mesh1.updateMatrixWorld(!0),
        this.mesh2.updateMatrixWorld(!0),
        this.mesh1.matrixAutoUpdate = !1,
        this.mesh2.matrixAutoUpdate = !1,
        this.mesh1.receiveShadow = !1,
        this.mesh1.castShadow = !1,
        this.scene.add(this.mesh1),
        this.scene.add(this.mesh2),
        this.isReady()
    }
}
class T3 {
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
        const e = await zt.load("intro_particles.drc"),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tNumbers: {
                        value: le.load("igloo/numbers.ktx2", "srgb-repeat")
                    },
                    uProgress: {
                        value: 0
                    },
                    uAlpha: {
                        value: 1
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                attribute vec3 color;

                                varying vec3 vWorldPos;

                                uniform sampler2D tNoise;

                                void main() {
                                    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;

                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                                    gl_PointSize = resolution.y / 100.0;

                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}

                                varying vec3 vWorldPos;

                                uniform sampler2D tNumbers;

                                uniform float uProgress;
                                uniform float uAlpha;

                                void main() {
                                    // scale uvs to match a single character of the spritesheet
                                    vec2 uv = gl_PointCoord.xy;
                                    uv.y = 1.0 - uv.y;
                                    uv.y /= 32.0;
                                    uv.y += 1.0 / 32.0;

                                    // animate spritesheet character offset
                                    float offset = length(vWorldPos);
                                    float progress = uProgress * 4.0;
                                    progress = floor(progress * 12.0 - offset) / 32.0;
                                    progress = clamp(progress, 0.0, 1.0);
                                    uv.y += progress;

                                    // sample numbers texture with offset uvs
                                    float numbers = texture2D(tNumbers, uv).r;
                                    float alpha = 1.0;

                                    // intro animation
                                    float gradientInput = length(vWorldPos);
                                    float shockwave = falloff(gradientInput, 0.0, 20.0, 5.0, uProgress);
                                    alpha *= shockwave;

                                    vec3 color = vec3(numbers);
                                    alpha *= 0.5;

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0,
                blending: pt,
                depthTest: !1,
                depthWrite: !1
            });
        this.mesh = new Fn(e, t),
        this.mesh.name = "intro_particles",
        this.mesh.renderOrder = 1e3,
        this.mesh.matrixAutoUpdate = !1,
        this.mesh.receiveShadow = !1,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
var Zo = "float aastep(float threshold,float value){float afwidth=length(vec2(dFdx(value),dFdy(value)))*0.70710678118654757;return smoothstep(threshold-afwidth,threshold+afwidth,value);}",
    I3 = "vec2 encodeNormal(vec3 n){n/=(abs(n.x)+abs(n.y)+abs(n.z));return(n.z>=0.0)? n.xy :(1.0-abs(n.yx))*sign(n.xy);}vec3 decodeNormal(vec2 f){vec3 n=vec3(f,1.0-abs(f.x)-abs(f.y));float t=max(-n.z,0.0);n.x+=(n.x>0.0)?-t : t;n.y+=(n.y>0.0)?-t : t;return normalize(n);}vec2 encodeNormalUint8(vec3 n){return encodeNormal(n)*0.5+0.5;}vec3 deodeNormalUint8(vec2 n){return decodeNormal(n*2.0-1.0);}vec2 encodeNormalSpheremap(vec3 n){float f=sqrt(8.0*n.z+8.0);return n.xy/f*2.0;}vec3 decodeNormalSpheremap(vec2 n){vec4 nn=vec4(n.xy,1.0,-1.0);float l=dot(nn.xyz,-nn.xyw);nn.z=l;nn.xy*=sqrt(l);return nn.xyz*2.0+vec3(0.0,0.0,-1.0);}vec2 encodeNormalSpheremapUint8(vec3 n){return encodeNormalSpheremap(n)*0.5+0.5;}vec3 deodeNormalSimpleUint8(vec2 n){return decodeNormalSpheremap(n*2.0-1.0);}",
    Cg = "float treadmill(float p,float margin){float n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin;}vec2 treadmill(vec2 p,vec2 margin){vec2 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin;}vec3 treadmill(vec3 p,vec3 margin){vec3 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin;}vec4 treadmill(vec4 p,vec4 margin){vec4 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin;}";
class B3 {
    constructor(e, t)
    {
        this.scene = e,
        this.ready = new Promise(s => {
            this.isReady = s
        }),
        this.options = {
            count: 1200,
            ...t
        },
        this.mousePosition = new b,
        this.init()
    }
    init()
    {
        const e = new kt(.075, .15),
            t = this.options.count,
            s = ie.getTextureSizeParticles(t),
            n = new Float32Array(s * s * 4);
        for (let o = 0; o < t; o++)
            n[o * 4 + 0] = Math.random() * 50 - 25,
            n[o * 4 + 1] = Math.random() * 20 - 10,
            n[o * 4 + 2] = Math.random() * 50 - 25,
            n[o * 4 + 3] = Math.random();
        const r = new Hi(n, s, s, wt, Lt);
        r.needsUpdate = !0;
        const a = new Hi(new Float32Array(s * s * 4), s, s, wt, Lt);
        a.needsUpdate = !0,
        this.mesh = new gE({
            count: t,
            geometry: e,
            material: new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tTexture1: {
                        value: null
                    },
                    tTexture2: {
                        value: a
                    },
                    uCount: {
                        value: t
                    },
                    uColor1: {
                        value: new Z("#cda05e")
                    },
                    uColor2: {
                        value: new Z("#ab8349")
                    },
                    uMousePos: {
                        value: this.mousePosition
                    },
                    uOutlineColor: {
                        value: new Z("#904619")
                    },
                    uAlpha: {
                        value: 0
                    }
                },
                vertexShader: `
                                    ${ae}

                                    uniform float uCount;

                                    attribute vec4 rand;
                                    attribute vec2 texuv;
                                    uniform sampler2D tTexture1;
                                    uniform sampler2D tTexture2;
                                    uniform vec3 uMousePos;

                                    varying vec2 vUv;
                                    varying vec3 vNormal;
                                    varying vec4 vRandom;
                                    varying vec3 vPos;
                                    varying vec4 vMvPos;
                                    varying float vAlpha;
                                    flat varying float vIndex;

                                    mat2 rotateAngle(float a) {
                                        float s = sin(a);
                                        float c = cos(a);
                                        mat2 m = mat2(c, s, -s, c);
                                        return m;
                                    }

                                    const float PI = 3.14159;
                                    const float HALF_PI = PI * 0.5;
                                    const float TWO_PI = PI * 2.0;

                                    void main() {
                                        float index = float(gl_InstanceID);
                                        vIndex = index;

                                        vUv = uv;
                                        vRandom = rand;

                                        vec3 pos = position;
                                        pos *= mix(0.85, 1.15, step(rand.x, 0.5));

                                        // rotation value from fluid sim
                                        // float interactionRotation = texture2D(tTexture2, texuv).a * 5.0;

                                        // curl upwards
                                        // mat2 rot = rotateAngle(0.25 * sin(uv.y * 3.5 + time + rand.z * 12.0 + rand.y + rand.x + interactionRotation * 3.0) + 0.2 * (1.0 - pow(1.0 - position.z, 2.0)));
                                        // pos.yz = rot * pos.yz;

                                        // random rotation angle
                                        mat2 rot0 = rotateAngle(time * mix(0.75, 1.25, rand.z) + rand.z * 3.14 * 2.0);
                                        mat2 rot1 = rotateAngle((rand.y + rand.z + rand.x) * 3.14 * 2.0);
                                        mat2 rot2 = rotateAngle(rand.x * 3.14 * 2.0);
                                        pos.xy = rot0 * pos.xy;
                                        pos.zx = rot1 * pos.zx;
                                        pos.yz = rot2 * pos.yz;

                                        // vec3 norm = normal;
                                        // norm.xy = rot0 * norm.xy;
                                        // norm.zx = rot1 * norm.zx;
                                        // norm.yz = rot2 * norm.yz;
                                        // vNormal = normalize(normalMatrix * norm);

                                        vec3 offset = texture2D(tTexture1, texuv).xyz;

                                        pos += offset;

                                        vPos = pos;
                                        vMvPos = modelViewMatrix * vec4(pos, 1.0);

                                        vAlpha = sin(time + pos.z * 0.25) * 0.5 + 0.5;

                                        gl_Position = projectionMatrix * vMvPos;
                                    }
                                `,
                fragmentShader: `
                                    ${ae}
                                    ${Zo}
                                    ${I3}
                                    ${Ue}

                                    uniform float uAlpha;

                                    varying vec2 vUv;
                                    varying vec3 vPos;
                                    varying vec4 vMvPos;
                                    varying float vAlpha;

                                    void main() {
                                        float value = 1.0 - min(10.0, length(vPos)) / 10.0;
                                        vec3 color = vec3(mix(0.75, 1.0, value));
                                        float alpha = 1.0;

                                        // fade near bounds
                                        vec3 bounds = vec3(25.0, 10.0, 25.0);
                                        alpha *= 1.0 - min(bounds.x, abs(vPos.x)) / bounds.x;
                                        alpha *= 1.0 - min(bounds.y, abs(vPos.y)) / bounds.y;
                                        alpha *= 1.0 - min(bounds.z, abs(vPos.z)) / bounds.z;

                                        // fade near camera
                                        alpha *= smoothstep(length(vMvPos), 0.5, 1.0);

                                        // fade near ground
                                        alpha *= smoothstep(0.0, 2.0, vPos.y);

                                        // fade near igloo
                                        alpha *= smoothstep(0.5, 1.0, min(6.0, length(vPos)) / 6.0);

                                        // shape
                                        float circularGrad = 1.0 - length(vUv - 0.5) * 2.0;
                                        alpha *= circularGrad;

                                        alpha *= uAlpha;
                                        alpha = clamp(alpha, 0.0, 1.0);

                                        gl_FragColor = vec4(color, alpha);
                                    }
                                `,
                depthWrite: !1,
                transparent: !0
            })
        }, {
            textures: 2,
            initialTextures: [r, a],
            material: new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tTexture1: {
                        value: null
                    },
                    tTexture2: {
                        value: null
                    },
                    tVel: {
                        value: null
                    },
                    uViewMatrix: {
                        value: new De
                    },
                    uModelMatrix: {
                        value: new De
                    },
                    uProjMatrix: {
                        value: new De
                    }
                },
                vertexShader: `
                                    varying vec2 vUv;

                                    void main() {
                                        vUv = uv;
                                        gl_Position = vec4(position, 1.0);
                                    }
                                `,
                fragmentShader: `
                                    #define outPos pc_fragColor
                                    uniform sampler2D tTexture1;

                                    layout(location = 1) out highp vec4 outVel;
                                    uniform sampler2D tTexture2;

                                    uniform mat4 uProjMatrix;
                                    uniform mat4 uViewMatrix;
                                    uniform mat4 uModelMatrix;
                                    uniform sampler2D tVel;

                                    varying vec2 vUv;

                                    ${ae}
                                    ${Cg}

                                    void main() {
                                        ivec2 uv = ivec2(gl_FragCoord.xy);
                                        vec4 currentPos = texelFetch(tTexture1, uv, 0);
                                        vec4 currentVel = texelFetch(tTexture2, uv, 0);

                                        // add some velocity so leaves fall
                                        currentVel.x += (sin(time * 0.2 + currentPos.w * 15.6547) + sign(currentPos.w - 0.5) * 2.0) * 0.00075 * dtRatio;
                                        currentVel.x += 0.0025 * dtRatio;
                                        currentVel.y -= 0.004 * mix(0.5, 0.8, fract(currentPos.w * 31.342)) * dtRatio;
                                        currentVel.z += 0.0025 * dtRatio;

                                        // add fluid sim interaction
                                        // const float pushForce = 0.0035;
                                        // vec4 wPos = uModelMatrix * vec4(currentPos.xyz, 1.0);
                                        // vec4 vPos = uViewMatrix * wPos;
                                        // vec4 posProjected = uProjMatrix * vPos;
                                        // vec2 uvScreen = (posProjected.xy / posProjected.w + 1.0) * 0.5;
                                        // vec2 vel = texture2D(tVel, uvScreen).xy;

                                        /*
                                        // since the camera is on -z, there's no need to calculate up and right vectors of camera
                                        vec3 up = vec3(uViewMatrix[0][1], uViewMatrix[1][1], uViewMatrix[2][1]);
                                        vec3 right = vec3(uViewMatrix[0][0], uViewMatrix[1][0], uViewMatrix[2][0]);
                                        vec3 disp = (right * vel.x + up * vel.y);
                                        */
                                        // currentVel.xy += vel * pushForce * dtRatio;

                                        // store rotation in alpha
                                        // currentVel.a += length(vel) * pushForce * 1.75 * dtRatio;

                                        // friction
                                        currentVel.xyz *= exp2(log2(0.9) * dtRatio);

                                        // add vel to position
                                        currentPos.xyz += currentVel.xyz * dtRatio;

                                        // treadmill position
                                        currentPos.xyz = treadmill(currentPos.xyz, vec3(25.0, 10.0, 25.0));

                                        outVel = currentVel;
                                        outPos = currentPos;
                                    }
                                `
            })
        }),
        this.mesh.name = "snowparticles",
        this.mesh.renderOrder = 5,
        this.mesh.updateMatrixWorld(),
        this.mesh.matrixAutoUpdate = !1,
        this.mesh.frustumCulled = !1,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
var Cr = "vec2 rotateUV(vec2 uv,float rotation,vec2 mid){float c=cos(rotation);float s=sin(rotation);return vec2(c*(uv.x-mid.x)+s*(uv.y-mid.y)+mid.x,c*(uv.y-mid.y)-s*(uv.x-mid.x)+mid.y);}vec2 rotateUV(vec2 uv,float rotation,float mid){return rotateUV(uv,rotation,vec2(mid));}vec2 rotateUV(vec2 uv,float rotation){return rotateUV(uv,rotation,vec2(0.5));}vec2 scaleUV(vec2 uv,float scale,vec2 mid){uv-=mid;uv*=1.0/scale;uv+=mid;return uv;}vec2 scaleUV(vec2 uv,float scale,float mid){return scaleUV(uv,scale,vec2(mid));}vec2 scaleUV(vec2 uv,float scale){return scaleUV(uv,scale,vec2(0.5));}";
class P3 {
    constructor({scene: e, parent: t}={})
    {
        this.scene = e,
        this.parent = t,
        this.ready = new Promise(s => {
            this.isReady = s
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
                    value: new Z("#ffffff")
                },
                uSize: {
                    value: 200
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}
                            ${Rc}

                            attribute float progress;
                            uniform float uSize;

                            flat varying float vProgress;

                            void main() {
                                vProgress = progress;
                                vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
                                float size = uSize * progress;

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

                            void main() {
                                if (vProgress < 0.001) discard;
                                vec2 uv = rotateUV(gl_PointCoord.xy, mix(1.3, 0.0, vProgress));
                                uv = uv * 2.0 - 1.0;

                                const float size = 0.125;
                                float shape = 1.0 - aastep(size, abs(uv.x)) * aastep(size, abs(uv.y));

                                gl_FragColor = vec4(uColor, shape * 0.5);
                            }
                        `,
            depthWrite: !1,
            depthTest: !1,
            transparent: !0,
            blending: pt
        });
        this.mesh = new Fn(e, t),
        this.mesh.frustumCulled = !1,
        this.mesh.name = "plexus points",
        this.mesh.renderOrder = this.parent.lineMesh.renderOrder + 1,
        this.scene.add(this.mesh),
        this.isReady()
    }
    update()
    {
        const e = this.mesh.geometry.attributes.position.count,
            t = this.parent.closest;
        for (let s = 0; s < e; s++)
            t[s] ? (this.mesh.geometry.attributes.position.array[s * 3 + 0] = t[s].__UIPos[0], this.mesh.geometry.attributes.position.array[s * 3 + 1] = t[s].__UIPos[1], this.mesh.geometry.attributes.position.array[s * 3 + 2] = t[s].__UIPos[2], this.mesh.geometry.attributes.progress.array[s] = t[s].__plexusAnimation.value) : (this.mesh.geometry.attributes.position.array[s * 3 + 0] = 0, this.mesh.geometry.attributes.position.array[s * 3 + 1] = 0, this.mesh.geometry.attributes.position.array[s * 3 + 2] = 0, this.mesh.geometry.attributes.progress.array[s] = 0);
        this.mesh.geometry.attributes.position.needsUpdate = !0,
        this.mesh.geometry.attributes.progress.needsUpdate = !0
    }
}
function yE(i, e=!1) {
    const t = i[0].index !== null,
        s = new Set(Object.keys(i[0].attributes)),
        n = new Set(Object.keys(i[0].morphAttributes)),
        r = {},
        a = {},
        o = i[0].morphTargetsRelative,
        l = new ot;
    let c = 0;
    for (let h = 0; h < i.length; ++h) {
        const d = i[h];
        let u = 0;
        if (t !== (d.index !== null))
            return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + h + ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."), null;
        for (const f in d.attributes) {
            if (!s.has(f))
                return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + h + '. All geometries must have compatible attributes; make sure "' + f + '" attribute exists among all geometries, or in none of them.'), null;
            r[f] === void 0 && (r[f] = []),
            r[f].push(d.attributes[f]),
            u++
        }
        if (u !== s.size)
            return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + h + ". Make sure all geometries have the same number of attributes."), null;
        if (o !== d.morphTargetsRelative)
            return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + h + ". .morphTargetsRelative must be consistent throughout all geometries."), null;
        for (const f in d.morphAttributes) {
            if (!n.has(f))
                return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + h + ".  .morphAttributes must be consistent throughout all geometries."), null;
            a[f] === void 0 && (a[f] = []),
            a[f].push(d.morphAttributes[f])
        }
        if (e) {
            let f;
            if (t)
                f = d.index.count;
            else if (d.attributes.position !== void 0)
                f = d.attributes.position.count;
            else
                return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + h + ". The geometry must have either an index or a position attribute"), null;
            l.addGroup(c, f, h),
            c += f
        }
    }
    if (t) {
        let h = 0;
        const d = [];
        for (let u = 0; u < i.length; ++u) {
            const f = i[u].index;
            for (let p = 0; p < f.count; ++p)
                d.push(f.getX(p) + h);
            h += i[u].attributes.position.count
        }
        l.setIndex(d)
    }
    for (const h in r) {
        const d = Fx(r[h]);
        if (!d)
            return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + h + " attribute."), null;
        l.setAttribute(h, d)
    }
    for (const h in a) {
        const d = a[h][0].length;
        if (d === 0)
            break;
        l.morphAttributes = l.morphAttributes || {},
        l.morphAttributes[h] = [];
        for (let u = 0; u < d; ++u) {
            const f = [];
            for (let A = 0; A < a[h].length; ++A)
                f.push(a[h][A][u]);
            const p = Fx(f);
            if (!p)
                return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + h + " morphAttribute."), null;
            l.morphAttributes[h].push(p)
        }
    }
    return l
}
function Fx(i) {
    let e,
        t,
        s,
        n = -1,
        r = 0;
    for (let c = 0; c < i.length; ++c) {
        const h = i[c];
        if (e === void 0 && (e = h.array.constructor), e !== h.array.constructor)
            return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."), null;
        if (t === void 0 && (t = h.itemSize), t !== h.itemSize)
            return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."), null;
        if (s === void 0 && (s = h.normalized), s !== h.normalized)
            return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."), null;
        if (n === -1 && (n = h.gpuType), n !== h.gpuType)
            return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."), null;
        r += h.count * t
    }
    const a = new e(r),
        o = new We(a, t, s);
    let l = 0;
    for (let c = 0; c < i.length; ++c) {
        const h = i[c];
        if (h.isInterleavedBufferAttribute) {
            const d = l / t;
            for (let u = 0, f = h.count; u < f; u++)
                for (let p = 0; p < t; p++) {
                    const A = h.getComponent(u, p);
                    o.setComponent(u + d, p, A)
                }
        } else
            a.set(h.array, l);
        l += h.count * t
    }
    return n !== void 0 && (o.gpuType = n), o
}
var Nt = "vec3 getMatrixTranslation(mat4 mat){return vec3(mat[3]);}void setMatrixTranslation(inout mat4 mat,vec3 translation){mat[3].xyz=translation;}vec3 getMatrixScale(mat4 mat){vec3 scale=vec3(length(mat[0].xyz),length(mat[1].xyz),length(mat[2].xyz));return determinant(mat)<0.0 ? vec3(-scale.x,scale.yz): scale;}void setMatrixScale(inout mat4 mat,vec3 scale){vec3 invScale=1.0/getMatrixScale(mat);mat[0]*=invScale.x*scale.x;mat[1]*=invScale.y*scale.y;mat[2]*=invScale.z*scale.z;}mat4 getMatrixRotation(mat4 mat){mat4 m=mat4(1.0);vec3 scale=getMatrixScale(mat);m[0]=mat[0]/scale.x;m[1]=mat[1]/scale.y;m[2]=mat[2]/scale.z;return m;}void setMatrixRotation(inout mat4 mat,vec3 rotation){vec3 scale=getMatrixScale(mat);float x=rotation.x,y=rotation.y,z=rotation.z;float a=cos(x),b=sin(x);float c=cos(y),d=sin(y);float e=cos(z),f=sin(z);float ae=a*e,af=a*f,be=b*e,bf=b*f;mat[0].xyz=vec3(c*e,-c*f,d)*scale.x;mat[1].xyz=vec3(af+be*d,ae-bf*d,-b*c)*scale.y;mat[2].xyz=vec3(bf-ae*d,be+af*d,a*c)*scale.z;}void matrixCompose(inout mat4 mat,vec3 translation,vec4 quaternion,vec3 scale){float x=quaternion.x;float y=quaternion.y;float z=quaternion.z;float w=quaternion.w;float x2=x+x;float y2=y+y;float z2=z+z;float xx=x*x2;float xy=x*y2;float xz=x*z2;float yy=y*y2;float yz=y*z2;float zz=z*z2;float wx=w*x2;float wy=w*y2;float wz=w*z2;float sx=scale.x;float sy=scale.y;float sz=scale.z;mat[0]=vec4((1.0-(yy+zz))*sx,(xy+wz)*sx,(xz-wy)*sx,0.0);mat[1]=vec4((xy-wz)*sy,(1.0-(xx+zz))*sy,(yz+wx)*sy,0.0);mat[2]=vec4((xz+wy)*sz,(yz-wx)*sz,(1.0-(xx+yy))*sz,0.0);mat[3]=vec4(translation.xyz,1.0);}vec3 getViewRight(){return vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]);}vec3 getViewLeft(){return-getViewRight();}vec3 getViewUp(){return vec3(viewMatrix[0][1],viewMatrix[1][1],viewMatrix[2][1]);}vec3 getViewDown(){return-getViewUp();}vec3 getViewBack(){return vec3(viewMatrix[0][2],viewMatrix[1][2],viewMatrix[2][2]);}vec3 getViewForward(){return-getViewBack();}mat4 billBoardMatrix(mat4 mat){mat4 m=mat4(1.0);vec3 scale=getMatrixScale(mat);m[0].xyz=getViewRight()*scale.x;m[1].xyz=getViewUp()*scale.y;m[2].xyz=getViewBack()*scale.z;m[3].xyz=getMatrixTranslation(mat);return m;}mat4 billboardModelMatrix(vec3 offset){mat4 m=billBoardMatrix(modelMatrix);setMatrixTranslation(m,offset);return m;}mat4 billboardModelMatrix(){return billBoardMatrix(modelMatrix);}";
const Th = new It;
class D3 {
    constructor({scene: e, parent: t}={})
    {
        this.scene = e,
        this.parent = t,
        this.ready = new Promise(s => {
            this.isReady = s
        }),
        this.init()
    }
    init()
    {
        const t = new kt;
        t.scale(.77777, 1, 1),
        t.translate(-.5 - -.1, 0, 0),
        t.setAttribute("side", new We(new Int32Array([-1, -1, -1, -1]), 1));
        const s = new kt;
        s.scale(.77777, 1, 1),
        s.translate(.5 + -.1, 0, 0),
        s.setAttribute("side", new We(new Int32Array([1, 1, 1, 1]), 1));
        const n = yE([t, s]),
            r = new Td;
        r.instanceCount = this.parent.maxPlexusPoints;
        for (const o in n.attributes)
            r.setAttribute(o, n.attributes[o]);
        r.setIndex(n.index),
        r.setAttribute("progress", new gr(new Float32Array(this.parent.maxPlexusPoints), 1)),
        r.setAttribute("nums", new gr(new Int32Array(this.parent.maxPlexusPoints * 2), 2));
        const a = new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                tNums: {
                    value: le.load("numbers-datatexture.ktx2", "data")
                },
                uColor: {
                    value: new Z("#ffffff")
                },
                uSize: {
                    value: 1
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}
                            ${Nt}
                            ${Rc}

                            attribute float progress;
                            attribute ivec2 nums;
                            attribute int side;
                            flat varying ivec2 vNums;
                            flat varying float vProgress;
                            flat varying int vSide;

                            uniform float uSize;
                            varying vec2 vUv;

                            void main() {
                                vUv = uv;
                                vSide = side;
                                vProgress = progress;
                                vNums = nums;

                                vec3 left = getViewLeft();
                                vec3 up = getViewUp();

                                float size = uSize;
                                vec4 pos = instanceMatrix * billboardModelMatrix() * vec4(position * size * power1In(progress), 1.0);

                                // detect side
                                vec4 projPos = projectionMatrix * viewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
                                float screenSide = -sign(projPos.x / projPos.w);

                                pos.xyz += left * screenSide * uSize * 1.75;
                                pos.xyz += up * 1.0 * uSize;

                                gl_Position = projectionMatrix * viewMatrix * pos;
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}
                            ${ii}

                            flat varying float vProgress;
                            flat varying int vSide;
                            flat varying ivec2 vNums;

                            uniform sampler2D tNums;
                            uniform vec3 uColor;
                            varying vec2 vUv;

                            void main() {

                                float numStep = 1.0 / 10.0;
                                float num = float(vSide < 0 ? vNums.x : vNums.y);

                                vec2 uv = vec2(numStep * vUv.x + num * numStep, vUv.y);
                                float a = msdf(tNums, uv);

                                gl_FragColor = vec4(uColor, a);
                            }
                        `,
            transparent: !0,
            depthWrite: !1,
            depthTest: !1,
            blending: pt
        });
        this.mesh = new OA(r, a, this.parent.maxPlexusPoints),
        this.mesh.name = "plexus numbers",
        this.mesh.frustumCulled = !1,
        this.mesh.renderOrder = this.parent.lineMesh.renderOrder + 2,
        this.scene.add(this.mesh),
        this.isReady()
    }
    update()
    {
        const e = this.parent.closest;
        this.mesh.count = e.length;
        for (let t = 0; t < e.length; t++) {
            if (e[t]) {
                Th.position.fromArray(e[t].__UIPos),
                this.mesh.geometry.attributes.progress.array[t] = e[t].__plexusAnimation.value;
                const s = e[t].centroid.distanceTo(e[t].position);
                let n = `${Math.floor(s * 50)}`.slice(-2);
                n.length < 2 && (n = `0${n}`),
                this.mesh.geometry.attributes.nums.array[t * 2] = n[0],
                this.mesh.geometry.attributes.nums.array[t * 2 + 1] = n[1]
            } else
                Th.position.set(0, 0, 0),
                this.mesh.geometry.attributes.progress.array[t] = 0,
                this.mesh.geometry.attributes.nums.array[t * 2] = 0,
                this.mesh.geometry.attributes.nums.array[t * 2 + 1] = 0;
            Th.updateMatrix(),
            this.mesh.setMatrixAt(t, Th.matrix)
        }
        this.mesh.material.uniforms.uSize.value = Math.min(.1, .08 / (q.screen.h / 1300)),
        this.mesh.geometry.attributes.progress.needsUpdate = !0,
        this.mesh.geometry.attributes.nums.needsUpdate = !0,
        this.mesh.instanceMatrix.needsUpdate = !0
    }
}
const Ih = new b,
    Ya = new b;
class R3 {
    constructor({scene: e, parent: t}={})
    {
        this.scene = e,
        this.parent = t,
        this.ready = new Promise(s => {
            this.isReady = s
        }),
        this.closest = [],
        this.lastMousePosition = new b,
        this.maxPlexusPoints = 5,
        this.maxPlexusConnections = 2,
        this.animateLineInTime = .1,
        this.animateLineOutTime = .06,
        this.isPlexusTransitioning = !1,
        this.init()
    }
    init()
    {
        const e = new ot;
        e.setAttribute("position", new nt(new Float32Array(this.maxPlexusPoints * this.maxPlexusConnections * 2 * 3), 3));
        const t = new ga({
            color: "#ffffff",
            opacity: .25,
            transparent: !0
        });
        t.depthTest = !1,
        t.depthWrite = !1,
        t.blending = pt,
        this.lineMesh = new yr(e, t),
        this.lineMesh.frustumCulled = !1,
        this.lineMesh.visible = !1,
        this.lineMesh.name = "plexus lines",
        this.lineMesh.renderOrder = 999,
        this.scene.add(this.lineMesh),
        this.points = new P3({
            scene: this.scene,
            parent: this
        }),
        this.numbers = new D3({
            scene: this.scene,
            parent: this
        }),
        this.isReady()
    }
    _removeConnections(e)
    {
        if (e.__plexusConnections.forEach(t => {
            t.__plexusConnections = t.__plexusConnections.filter(s => s !== e)
        }), e.__plexusConnections = [], this.closest.forEach(t => {
            t.__plexusConnections = t.__plexusConnections.filter(s => this.closest.includes(s))
        }), !(this.closest.length < 2))
            for (let t = 0; t < this.closest.length; t++) {
                const s = this.closest[t];
                if (s.__plexusConnections.length === 0) {
                    let n = this.closest.slice();
                    n = n.filter(r => r !== s),
                    n.forEach(r => {
                        r.__plexusDistPoint = r.position.distanceTo(s.position)
                    }),
                    n.sort((r, a) => r.__plexusDistPoint - a.__plexusDistPoint),
                    s.__plexusConnections.push(n[0]),
                    n[0].__plexusConnections.push(s),
                    re.to(s.__plexusAnimation, {
                        value: 1,
                        ease: "none",
                        duration: this.animateLineInTime,
                        overwrite: !0
                    })
                }
            }
    }
    _makeConnections(e)
    {
        this._removeConnections(e);
        let t = this.closest.slice();
        t = t.filter(n => n !== e),
        t.forEach(n => {
            n.__plexusDistPoint = n.position.distanceTo(e.position)
        }),
        t.sort((n, r) => n.__plexusDistPoint - r.__plexusDistPoint);
        let s = 0;
        for (; s < t.length && e.__plexusConnections.length < this.maxPlexusConnections;) {
            const n = t[s];
            n.__plexusConnections.length < this.maxPlexusConnections && !n.__plexusConnections.includes(e) && !e.__plexusConnections.includes(n) && (e.__plexusConnections.push(n), n.__plexusConnections.push(e)),
            s++
        }
        e.__plexusConnections.length === 0 && t.length > 0 && (e.__plexusConnections.push(t[0]), t[0].__plexusConnections.push(e))
    }
    update()
    {
        var h,
            d;
        Ih.copy(this.parent.scene.camera.position).sub(this.parent.mousePosition).normalize(),
        Ya.copy(this.parent.mousePosition).addScaledVector(Ih, 1);
        const s = this.lastMousePosition.distanceTo(Ya) > .05;
        s && this.lastMousePosition.copy(Ya);
        let n = this.parent._objects.map(u => (u.__plexusDistance = u.position.distanceToSquared(Ya), u.__plexusDistReal = !1, u.__plexusConnections || (u.__plexusConnections = []), u.__plexusAnimation === void 0 && (u.__plexusAnimation = {
            value: 0
        }), u));
        n.sort((u, f) => u.__plexusDistance - f.__plexusDistance),
        n = n.filter(u => u.displacement > .1),
        n = n.slice(0, this.maxPlexusPoints);
        const r = u => {
            u.__plexusDistReal || (u.__plexusDistReal = !0, u.__plexusDistance = Math.sqrt(u.__plexusDistance))
        };
        if (n.forEach(r), this.closest.forEach(r), n = n.filter(u => u.__plexusDistance < 2), this.closest.sort((u, f) => u.__plexusDistance - f.__plexusDistance), !this.isPlexusTransitioning && s)
            for (let u = this.closest.length - 1; u > -1; u--) {
                const f = this.closest[u];
                if (!n.includes(f)) {
                    this.isPlexusTransitioning = !0,
                    re.to(f.__plexusAnimation, {
                        value: 0,
                        ease: "none",
                        duration: this.animateLineOutTime,
                        overwrite: !0,
                        onComplete: () => {
                            this.closest.splice(u, 1),
                            this._removeConnections(f),
                            this.isPlexusTransitioning = !1
                        }
                    });
                    break
                }
            }
        if (!this.isPlexusTransitioning && this.closest.length < this.maxPlexusPoints)
            for (let u = 0; u < n.length; u++) {
                const f = n[u];
                if (!this.closest.includes(f)) {
                    this.isPlexusTransitioning = !0,
                    this.closest.push(f),
                    this._makeConnections(f),
                    re.to(f.__plexusAnimation, {
                        value: 1,
                        ease: "none",
                        duration: this.animateLineInTime,
                        overwrite: !0,
                        onComplete: () => {
                            this.isPlexusTransitioning = !1
                        }
                    });
                    break
                }
            }
        this.closest.forEach((u, f) => {
            u.__UIPos = Ih.copy(u.position).addScaledVector(Ya.copy(u.centroid).normalize(), .2).toArray()
        });
        const a = [],
            o = [];
        for (let u = 0; u < this.closest.length; u++) {
            const f = this.closest[u];
            for (let p = 0; p < f.__plexusConnections.length; p++) {
                const A = f.__plexusConnections[p];
                if ((h = o[f._pieceIndex]) != null && h.includes(A._pieceIndex) || (d = o[A._pieceIndex]) != null && d.includes(f._pieceIndex))
                    continue;
                o[f._pieceIndex] || (o[f._pieceIndex] = []),
                o[A._pieceIndex] || (o[A._pieceIndex] = []),
                o[f._pieceIndex].push(A._pieceIndex),
                o[A._pieceIndex].push(f._pieceIndex);
                const m = f.__plexusAnimation.value >= A.__plexusAnimation.value ? f : A,
                    g = m === f ? A : f,
                    x = m.__UIPos,
                    v = Ih.fromArray(x).lerp(Ya.fromArray(g.__UIPos), g.__plexusAnimation.value).toArray();
                a.push(...x, ...v)
            }
        }
        const l = this.maxPlexusPoints * this.maxPlexusConnections * 2 * 3;
        for (; a.length < l;)
            a.push(0, 0, 0, 0, 0, 0);
        this.lineMesh.geometry.attributes.position.set(a),
        this.lineMesh.geometry.attributes.position.needsUpdate = !0,
        this.lineMesh.visible = a.length > 0,
        this.points.update(),
        this.numbers.update();
        const c = (n.length > 0 ? 1 : 0) * this.scene._windVolume;
        this.scene._iglooVolume = ie.lerpFPS(this.scene._iglooVolume, c, .1)
    }
}
const Ls = new b,
    cp = new Vi,
    Bh = new b;
class U3 {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.mousePosition = new b,
        this.mouseVelocity = 0,
        this.introDisplacementModulator = {
            value: q.devScene ? 1 : 0
        },
        this.init()
    }
    async init()
    {
        const e = await zt.batched("igloo.drc"),
            t = le.load("igloo/igloo_color.ktx2", "srgb"),
            s = le.load("igloo/igloo_exploded_color.ktx2", "srgb");
        let n = Math.sqrt(e.length);
        n = Math.ceil(n / 4) * 4,
        n = Math.max(n, 4);
        const r = new Float32Array(n * n * 4);
        this.optionsTexture = new Hi(r, n, n, wt, Lt);
        const a = new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                tMap: {
                    value: t
                },
                tMapExploded: {
                    value: s
                },
                tTriangles: {
                    value: le.load("igloo/triangles_tiling.ktx2", "srgb-repeat")
                },
                tNoise: {
                    value: le.load("perlin-datatexture.ktx2", "srgb-repeat")
                },
                tOptions: {
                    value: this.optionsTexture
                },
                uProgress: {
                    value: 0
                },
                uIntroGlow: {
                    value: 1
                },
                uIntroMaterialize: {
                    value: q.devScene ? 1 : 0
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}

                            /* BATCHING */
                            attribute float batchId;
                            uniform sampler2D batchingTexture;
                            mat4 getBatchingMatrix(const in float i) {
                                int size = textureSize(batchingTexture, 0).x;
                                int j = int(i) * 4;
                                int x = j % size;
                                int y = j / size;
                                vec4 v1 = texelFetch(batchingTexture, ivec2(x, y), 0);
                                vec4 v2 = texelFetch(batchingTexture, ivec2(x + 1, y), 0);
                                vec4 v3 = texelFetch(batchingTexture, ivec2(x + 2, y), 0);
                                vec4 v4 = texelFetch(batchingTexture, ivec2(x + 3, y), 0);
                                return mat4(v1, v2, v3, v4);
                            }

                            uniform sampler2D tOptions;
                            vec4 getOptions(const in float i) {
                                int size = textureSize(tOptions, 0).x;
                                int x = int(i) % size;
                                int y = int(i) / size;
                                return texelFetch(tOptions, ivec2(x, y), 0);
                            }

                            // attribute vec3 rand;
                            attribute float emission;

                            varying vec2 vUv;
                            varying vec3 vPos;
                            varying float vDisplacement;
                            varying float vBounce;
                            varying float vEmission;

                            vec2 rotate(vec2 v, float a) {
                                float s = sin(a);
                                float c = cos(a);
                                mat2 m = mat2(c, s, -s, c);
                                return m * v;
                            }

                            void main() {
                                vUv = uv;
                                vEmission = emission;

                                mat4 batchingMatrix = getBatchingMatrix(batchId);
                                vec3 pos = (getBatchingMatrix(batchId) * vec4(position, 1.0)).xyz;
                                vPos = pos;

                                vec4 options = getOptions(batchId);
                                vDisplacement = options.r;
                                vBounce = options.g;

                                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}
                            ${Ue}

                            varying vec2 vUv;
                            varying vec3 vPos;
                            varying float vDisplacement;
                            varying float vEmission;
                            varying float vBounce;

                            uniform sampler2D tMap;
                            uniform sampler2D tMapExploded;
                            uniform sampler2D tTriangles;
                            uniform sampler2D tNoise;

                            uniform float uProgress;
                            uniform float uIntroMaterialize;

                            void main() {
                                vec3 color = texture2D(tMap, vUv).rgb;
                                vec3 exploded = texture2D(tMapExploded, vUv).rgb + 0.05;
                                vec3 blue = vec3(0.5, 0.7, 1.0);

                                // fade between 'together' lightmap and 'exploded' lightmap, based on displacement
                                float textureMix = clamp(5.0 * vDisplacement, 0.0, 1.0);
                                color = mix(color, exploded, textureMix);

                                // intro animation
                                if (uIntroMaterialize < 1.0) {
                                    float introEmissive = 1.0 - falloffsmooth(vPos.y, 3.95, -0.4, 1.5, uIntroMaterialize);
                                    if (introEmissive > 0.9999) discard;

                                    float triangles = texture2D(tTriangles, vUv * 5.0).r;
                                    introEmissive += clamp(introEmissive * triangles * 13.0, 0.0, 1.0);

                                    color += introEmissive * blue;
                                }

                                // add emission based on displacement
                                color += pow(vEmission, 2.0) * clamp(1.0 * vDisplacement, 0.0, 1.0) * blue;

                                // add idle emission;
                                vec3 powEmission = pow(vEmission, 8.0) * blue * 0.5;
                                color += powEmission * (sin(vPos.x - time * 1.0 + 3.2) * 0.5 + 0.5);

                                // make inside of igloo glow, on faces furthest from camera
                                color += max(0.0, smoothstep(0.0, 2.0, vPos.x * 0.5 - vPos.z * 0.5)) * powEmission;

                                // add fake sss from sunlight (just a sideways gradient, but kept dark near the ground)
                                color += (vPos.x * 0.1 + 0.4) * 0.3 * min(vPos.y + 0.5, 1.0) * 0.5;

                                // color safety
                                color = clamp(color, vec3(0.0), vec3(1.0));

                                // add ground bounce
                                float verticalGrad = (1.0 - smoothstep(-1.5, 1.0, vPos.y));
                                color += (1.0 - smoothstep(-1.5, 1.0, vPos.y)) * vBounce * vec3(0.8, 0.9, 1.0) * 0.25;

                                gl_FragColor = vec4(color, 1.0);
                            }
                        `
        });
        this._objects = [],
        e.forEach((h, d) => {
            Bh.fromArray(h.attributes.centr.array, 0);
            const u = new It;
            u.targetDisplacement1 = 0,
            u.targetDisplacement2 = 0,
            u.targetBounce1 = 0,
            u.targetBounce2 = 0,
            u.displacement = 0,
            u.scrollDisplacement1 = 0,
            u.scrollDisplacement2 = 0,
            u.bounce = 0,
            u.centroid = Bh.clone(),
            u.rand = Ls.fromArray(h.attributes.rand.array, 0).clone(),
            u.position.copy(Bh),
            u._pieceIndex = d,
            this._objects.push(u),
            h.deleteAttribute("centr"),
            h.deleteAttribute("rand"),
            h.deleteAttribute("batchId");
            const f = h.attributes.position.count;
            for (let p = 0; p < f; p++)
                Ls.fromArray(h.attributes.position.array, p * 3),
                Ls.sub(Bh).toArray(h.attributes.position.array, p * 3)
        });
        const o = e.length,
            l = e.reduce((h, d) => h + d.attributes.position.count, 0),
            c = e.reduce((h, d) => h + d.index.count, 0);
        this.mesh = new cI(o, l, c, a),
        e.forEach((h, d) => {
            this.mesh.addGeometry(h)
        }),
        this.scene.beforeRenderCbs.push(this.update.bind(this)),
        this.mesh.name = "igloo",
        this.mesh.sortObjects = !1,
        this.mesh.matrixAutoUpdate = !1,
        this.mesh.receiveShadow = !1,
        this.mesh.castShadow = !1,
        this.mesh.frustumCulled = !1,
        this.plexus = new R3({
            scene: this.scene,
            parent: this
        }),
        await this.plexus.ready,
        this.scene.add(this.mesh),
        this.isReady()
    }
    update()
    {
        var r;
        Si.planeInteraction.setCamera(this.scene.camera),
        Si.planeInteraction.setPlaneFromCameraTargetAndDistance(19.25),
        Ls.copy($t.get(0).position11);
        const e = Si.planeInteraction.getPointPositionOnPlane(Ls);
        Ls.copy(e),
        this.mousePosition.lerp(e, ie.lerpCoefFPS(.05)),
        this.mouseVelocity += Ls.sub(this.mousePosition).length() * .01,
        this.mouseVelocity *= ie.frictionFPS(.98),
        this.mouseVelocity = ie.clamp(this.mouseVelocity, 0, 1);
        let t = ie.fit(this.scene.progress, 0, this.scene.initialScrollAutocenter, 0, 1),
            s = ie.ease(ie.fit(this.scene.progress, 0, .4, 1, 0), "sine.in"),
            n = this.scene._needsReset ? 1 : .075;
        q.devScene && (t = 1, s = 0, n = 1),
        this._objects.forEach((a, o) => {
            let l = .4;
            l *= Math.sin(-Fe.time * 2 + a.centroid.x) * .5 + .5,
            l *= Math.cos(-Fe.time) * .5 + .5,
            l *= ie.mix(.5, 2, a.rand.z),
            l *= .5,
            l *= this.introDisplacementModulator.value;
            const c = Math.sin(Fe.time + a.rand.x * 12.342) * a.rand.y,
                h = ie.fit(ie.smoothstep(1, 3, Ls.copy(a.centroid).sub(this.mousePosition).length()), 0, 1, .5 + .3 * c, 0);
            l = Math.max(l, h * t),
            a.targetBounce1 = l,
            a.targetBounce2 = ie.lerpFPS(a.targetBounce2, a.targetBounce1, .05),
            a.bounce = ie.lerpFPS(a.bounce, a.targetBounce2, .05);
            const d = ie.smoothstep(.45, .7, a.centroid.y);
            l *= d,
            l = Math.max(0, l),
            a.targetDisplacement1 = l,
            a.targetDisplacement2 = ie.lerpFPS(a.targetDisplacement2, a.targetDisplacement1, .06),
            a.displacement = ie.lerpFPS(a.displacement, a.targetDisplacement2, .06),
            this.optionsTexture.image.data[o * 4 + 0] = a.displacement,
            this.optionsTexture.image.data[o * 4 + 1] = a.bounce,
            a.position.copy(a.centroid).addScaledVector(a.centroid, a.displacement);
            const u = ie.smoothstep(.3, 1, a.centroid.y),
                f = ie.fit(a.rand.x, .4, 1, 0, 1) * 2,
                p = s * u * f;
            a.scrollDisplacement1 = ie.lerp(a.scrollDisplacement1, p, n),
            a.scrollDisplacement2 = ie.lerpFPS(a.scrollDisplacement2, a.scrollDisplacement1, n),
            a.position.addScaledVector(a.centroid, a.scrollDisplacement2);
            const A = a.scrollDisplacement2 * a.rand.x * -1.5,
                m = a.scrollDisplacement2 * a.rand.y * -1.5,
                g = a.scrollDisplacement2 * a.rand.z * -1.5;
            a.quaternion.identity(),
            a.quaternion.multiply(cp.setFromAxisAngle(Ls.set(0, 1, 0), Math.cos(a.displacement * 2 + a.rand.z * 30) * a.displacement * .5 + A)),
            a.quaternion.multiply(cp.setFromAxisAngle(Ls.set(0, 0, 1), Math.cos(a.displacement * 2 + a.rand.x * 30) * a.displacement * .5 + m)),
            a.quaternion.multiply(cp.setFromAxisAngle(Ls.set(1, 0, 0), Math.cos(a.displacement * 2 + a.rand.y * 30) * a.displacement * .5 + g)),
            a.updateMatrix(),
            this.mesh.setMatrixAt(o, a.matrix)
        }),
        this.optionsTexture.needsUpdate = !0,
        this.introDisplacementModulator.value === 1 && ((r = this.plexus) == null || r.update())
    }
}
class L3 {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.options = {
            manifestoWidth: .75,
            copyrightWidth: .9,
            align: "right",
            lineHeight: .8,
            size: .09
        },
        this.canBeShown = !1,
        this.visible = !1,
        this.hasBeenShownOnce = !1,
        this.init()
    }
    async init()
    {
        this.title = new Ui({
            font: "IBMPlexMono-Medium",
            text: Be.manifesto.title,
            width: this.options.manifestoWidth,
            align: this.options.align,
            lineHeight: this.options.lineHeight,
            size: this.options.size
        }, {
            uniforms: {
                tMap: {
                    value: le.load("../fonts/IBMPlexMono-Medium-datatexture.ktx2", "data")
                },
                uColor: {
                    value: new Z(Be.colorTitle)
                },
                uShow1: {
                    value: 0
                },
                uShow2: {
                    value: 0
                },
                uBlink: {
                    value: 1
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
                                uniform float uBlink;

                                varying vec2 vUv;
                                varying float vAlpha;

                                void main() {
                                    vec2 uv = vUv;
                                    float alpha = vAlpha;

                                    if (uBlink < 1.0) alpha *= 0.6 + 0.4 * mod(floor(uBlink * 5.0), 2.0);

                                    alpha *= msdf(tMap, uv);
                                    gl_FragColor = vec4(uColor, alpha);
                                }
                            `,
            depthWrite: !1,
            depthTest: !1
        }),
        this.title.name = "title",
        this.title.frustumCulled = !1,
        this.title.renderOrder = 999,
        this.scene.add(this.title),
        this.text = new Ui({
            font: "IBMPlexMono-Medium",
            text: Be.manifesto.text,
            width: this.options.manifestoWidth,
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
                    value: 0
                },
                uShow2: {
                    value: 0
                },
                uBlink: {
                    value: 1
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
                                uniform float uBlink;

                                varying vec2 vUv;
                                varying float vAlpha;

                                void main() {
                                    vec2 uv = vUv;
                                    float alpha = vAlpha;

                                    if (uBlink < 1.0) alpha *= 0.6 + 0.4 * mod(floor(uBlink * 5.0), 2.0);

                                    alpha *= msdf(tMap, uv);
                                    gl_FragColor = vec4(uColor, alpha);
                                }
                            `,
            depthWrite: !1,
            depthTest: !1
        }),
        this.text.name = "title",
        this.text.frustumCulled = !1,
        this.text.renderOrder = 999,
        this.scene.add(this.text),
        this.copyright = new Ui({
            font: "IBMPlexMono-Medium",
            text: Be.copyright,
            width: this.options.copyrightWidth,
            align: "left",
            lineHeight: this.options.lineHeight,
            size: this.options.size
        }, {
            uniforms: {
                tMap: {
                    value: le.load("../fonts/IBMPlexMono-Medium-datatexture.ktx2", "data")
                },
                uColor: {
                    value: new Z(Be.colorTitle)
                },
                uShow1: {
                    value: 0
                },
                uShow2: {
                    value: 0
                },
                uBlink: {
                    value: 1
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
                            uniform float uBlink;

                            varying vec2 vUv;
                            varying float vAlpha;

                            void main() {
                                vec2 uv = vUv;
                                float alpha = vAlpha;

                                if (uBlink < 1.0) alpha *= 0.3 + 0.7 * mod(floor(uBlink * 5.0), 2.0);

                                alpha *= msdf(tMap, uv);
                                gl_FragColor = vec4(uColor, alpha);
                            }
                        `,
            depthWrite: !1,
            depthTest: !1
        }),
        this.copyright.name = "copyright",
        this.copyright.frustumCulled = !1,
        this.copyright.renderOrder = 999,
        this.scene.add(this.copyright),
        this.rights = new Ui({
            font: "IBMPlexMono-Medium",
            text: Be.rights,
            width: this.options.copyrightWidth,
            align: "left",
            lineHeight: this.options.lineHeight + .15,
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
                    value: 0
                },
                uShow2: {
                    value: 0
                },
                uBlink: {
                    value: 1
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
                            uniform float uBlink;

                            varying vec2 vUv;
                            varying float vAlpha;

                            void main() {
                                vec2 uv = vUv;
                                float alpha = vAlpha;

                                if (uBlink < 1.0) alpha *= 0.6 + 0.4 * mod(floor(uBlink * 5.0), 2.0);

                                alpha *= msdf(tMap, uv);
                                gl_FragColor = vec4(uColor, alpha);
                            }
                        `,
            depthWrite: !1,
            depthTest: !1
        }),
        this.rights.name = "rights",
        this.rights.frustumCulled = !1,
        this.rights.renderOrder = 999,
        this.scene.add(this.rights),
        await Promise.all([this.title.ready, this.text.ready, this.copyright.ready, this.rights.ready]),
        Q.on("webgl_hover_logo", this.blinkAnimation, this),
        Q.once("webgl_show_ui_intro", () => {
            this.canBeShown = !0
        }),
        this.scene.beforeRenderCbs.push(this.render.bind(this)),
        this.isReady()
    }
    render()
    {
        const e = q.screen.width < Be.breakpointW || q.screen.height < Be.breakpointH,
            t = q.screen.width < Be.breakPointMobile || q.screen.height < Be.breakPointMobile,
            s = t ? 175 : e ? 200 : 250,
            n = s,
            r = t ? Be.gridSizeMobile : e ? Be.gridSizeLow : Be.gridSize,
            a = t ? Be.topMarginMobile : e ? Be.topMarginLow : Be.topMargin;
        Si.positionUI({
            camera: this.scene.camera,
            mesh: this.title,
            x: q.screen.width - r,
            y: a + this.title.size.y * .75 * n,
            width: s,
            height: n
        }),
        Si.positionUI({
            camera: this.scene.camera,
            mesh: this.text,
            x: q.screen.width - r,
            y: a + this.title.size.y * 2.25 * n,
            width: s,
            height: n
        });
        const l = (e ? 160 : 200) * .21,
            c = a + l + this.copyright.size.y * 1.25 * s;
        Si.positionUI({
            camera: this.scene.camera,
            mesh: this.copyright,
            x: r,
            y: c,
            width: s,
            height: s
        }),
        Si.positionUI({
            camera: this.scene.camera,
            mesh: this.rights,
            x: r,
            y: c + this.copyright.size.y * 1.5 * s,
            width: s,
            height: s
        })
    }
    hide()
    {
        this.visible && (this.visible = !1, [this.title, this.text, this.copyright, this.rights].forEach(e => {
            re.set(e.material.uniforms.uShow1, {
                value: 0,
                overwrite: !0
            }),
            re.set(e.material.uniforms.uShow2, {
                value: 0,
                overwrite: !0
            })
        }))
    }
    show()
    {
        this.visible || (this.visible = !0, [this.copyright, this.rights, this.title, this.text].forEach((e, t) => {
            let s = 0;
            this.hasBeenShownOnce ? s = t * .15 : s = t < 2 ? .75 + t * .2 : (t - 1) * .2;
            const n = t > 0 ? 1.75 : 1;
            re.fromTo(e.material.uniforms.uShow1, {
                value: 0
            }, {
                delay: s,
                value: 1,
                duration: .4 * n,
                ease: "sine.out",
                overwrite: !0,
                onStart: () => {
                    t % 2 === 0 && Q.emit("webgl_play_audio", "manifesto")
                }
            }),
            re.fromTo(e.material.uniforms.uShow2, {
                value: 0
            }, {
                delay: s,
                value: 1,
                duration: .75 * n,
                ease: "sine.out",
                overwrite: !0
            })
        }), this.hasBeenShownOnce = !0)
    }
    blinkAnimation()
    {
        [this.copyright, this.rights].forEach((e, t) => {
            re.fromTo(e.material.uniforms.uBlink, {
                value: 0
            }, {
                value: 1,
                delay: t * .1,
                duration: .1,
                ease: "none",
                overwrite: !0
            })
        })
    }
    update(e, t)
    {
        (t || e < .15) && this.hide(),
        this.canBeShown && e > .25 && e < .8 && this.show()
    }
}
class F3 extends Jo {
    constructor(e={})
    {
        super({
            orbit: !1
        }),
        this.controller = e.mainController,
        this.progress = 0,
        this.height = 2.35,
        this._isSceneVisible = !1,
        this.introPosition = new b,
        this.introTarget = new b,
        this.introWeight = {
            value: 0
        },
        this.timelinePosition = new b,
        this.timelineTarget = new b,
        this._needsReset = !1,
        this.initialScrollAutocenter = .495,
        this.finalScrollAutocenter = .495,
        this._windVolume = 0,
        this._iglooVolume = 0,
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
        t && (e ? this._needsReset = !0 : (this._windVolume = 0, this._iglooVolume = 0, Q.emit("webgl_set_audio_volume", "wind", this._windVolume), Q.emit("webgl_set_audio_volume", "igloo", this._iglooVolume)))
    }
    async init()
    {
        this.cameraOptions(),
        this.renderOptions(),
        this.createTimeline(),
        await Promise.all([this.createMountains(), this.createSmoke(), this.createIglooBase(), this.createIglooCage(), this.createIglooOutline(), this.createIgloo(), this.createTerrain(), this.createTerrainPatches(), this.createSky(), this.createManifesto(), this.createIntroParticles(), this.createSnowParticles()]),
        this.createIntroTimeline(),
        this.resize(),
        Q.on("resize", this.resize, this),
        q.devScene ? (this.debug(), window._camera = this.camera) : this.beforeRenderCbs.push(this.update.bind(this)),
        this.isReady()
    }
    cameraOptions()
    {
        this.camera.fov = 30,
        this.camera.updateProjectionMatrix(),
        this.camera.basePosition.set(-14, 4, 14),
        this.camera.baseTarget.set(0, 1, 0),
        this.camera.displacement.position.set(.07, .025),
        this.camera.shake.setScalar(.01),
        this.camera.shakeSpeed.setScalar(.5)
    }
    renderOptions()
    {
        Promise.resolve().then(() => {
            A3(this, this.composer);
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
    async createSky()
    {
        this.sky = new g3(this),
        await this.sky.ready
    }
    async createSmoke()
    {
        this.smoke = new v3(this),
        await this.smoke.ready
    }
    async createSnowParticles()
    {
        this.snowparticles = new B3(this),
        await this.snowparticles.ready
    }
    async createIntroParticles()
    {
        this.introparticles = new T3(this),
        await this.introparticles.ready
    }
    async createIglooBase()
    {
        this.igloobase = new y3(this),
        await this.igloobase.ready
    }
    async createIglooCage()
    {
        this.igloocage = new w3(this),
        await this.igloocage.ready
    }
    async createIglooOutline()
    {
        this.igloooutline = new C3(this),
        await this.igloooutline.ready
    }
    async createMountains()
    {
        this.mountains = new S3(this),
        await this.mountains.ready
    }
    async createTerrain()
    {
        this.terrain = new M3(this),
        await this.terrain.ready
    }
    async createTerrainPatches()
    {
        this.terrainpatches = new b3(this),
        await this.terrainpatches.ready
    }
    async createIgloo()
    {
        this.igloo = new U3(this),
        await this.igloo.ready
    }
    async createManifesto()
    {
        this.manifesto = new L3(this),
        await this.manifesto.ready
    }
    createIntroTimeline()
    {
        this.introTL = re.timeline({
            paused: !0,
            onStart: () => {
                var D;
                const I = 1 / (this.height + 1),
                    P = (this.initialScrollAutocenter - I) * (this.height + 1);
                (D = this.controller) == null || D.centerScroll(P, 0),
                this.introPosition.set(-14, 21, 14),
                this.introTarget.set(0, .5, 0)
            }
        });
        let e = null;
        he.composer.passes.forEach(I => {
            var P,
                D;
            (D = (P = I._effectComposer) == null ? void 0 : P.passes) == null || D.forEach(L => {
                L.effects.forEach(z => {
                    z.name === "BloomEffect" && (e = z.uniforms.get("intensity"))
                })
            })
        });
        let t = null;
        this.composer.passes.forEach(I => {
            I.isIglooColorCorrectionPass && (t = I.material.uniforms.uGradientAlpha)
        });
        const s = this.snowparticles.mesh.material.uniforms.uAlpha,
            n = this.igloooutline.mesh.material.uniforms.uIntroMaterialize,
            r = this.igloooutline.mesh.material.uniforms.uAlpha,
            a = this.igloo.mesh.material.uniforms.uIntroMaterialize,
            o = this.igloo.introDisplacementModulator,
            l = this.igloobase.mesh.material.uniforms.uAlpha,
            c = this.terrain.mesh1.material.uniforms.uAlpha,
            h = this.terrainpatches.mesh1.material.uniforms.uAlpha,
            d = this.mountains.mesh1.material.uniforms.uAlpha,
            u = this.igloobase.mesh.material.uniforms.uProgress,
            f = this.mountains.mesh1.material.uniforms.uProgress,
            p = this.terrain.mesh1.material.uniforms.uProgress,
            A = this.terrainpatches.mesh1.material.uniforms.uProgress,
            m = this.igloobase.mesh.material.uniforms.uProgress2,
            g = this.mountains.mesh1.material.uniforms.uProgress2,
            x = this.terrain.mesh1.material.uniforms.uProgress2,
            v = this.terrainpatches.mesh1.material.uniforms.uProgress2,
            y = this.introparticles.mesh.material.uniforms.uProgress,
            S = this.introparticles.mesh.material.uniforms.uAlpha,
            w = this.igloocage.mesh.material.uniforms.uProgress,
            C = this.igloocage.mesh.material.uniforms.uAlpha,
            M = this.smoke.mesh1.material.uniforms.uAlpha,
            E = this.sky.mesh.material.uniforms.uProgress,
            _ = this.igloo.mesh.material.uniforms.uProgress;
        this.introTL.fromTo(this.camera, {
            touchAmount: 0
        }, {
            touchAmount: 1,
            duration: 5
        }, 2),
        this.introTL.fromTo(n, {
            value: 0
        }, {
            value: 1,
            duration: 2.5,
            ease: "power3.inOut"
        }, 0),
        this.introTL.fromTo(r, {
            value: 1
        }, {
            value: 0,
            duration: 3,
            ease: "inOut4"
        }, 2),
        this.introTL.fromTo(w, {
            value: 0
        }, {
            value: 1,
            duration: 4,
            ease: "sine.inOut"
        }, 0),
        this.introTL.fromTo(C, {
            value: 0
        }, {
            value: .4,
            duration: .1,
            ease: "power2.inOut"
        }, 0),
        this.introTL.fromTo(C, {
            value: .4
        }, {
            value: 0,
            duration: 3,
            ease: "power2.inOut"
        }, 2.1),
        this.introTL.set(this.igloocage.mesh, {
            visible: !0
        }, 0),
        this.introTL.set(this.igloocage.mesh, {
            visible: !1
        }, 2.1 + 3),
        this.introTL.fromTo(a, {
            value: 0
        }, {
            value: 1,
            duration: 2.25,
            ease: "igloo_ease_1"
        }, 1.1),
        this.introTL.set(this.igloo.mesh, {
            visible: !1
        }, 0),
        this.introTL.set(this.igloo.mesh, {
            visible: !0
        }, 1.1),
        this.introTL.fromTo(o, {
            value: 0
        }, {
            value: 1,
            duration: 2,
            ease: "linear"
        }, 2),
        this.introTL.set(l, {
            value: 0
        }, 0),
        this.introTL.set(l, {
            value: 1
        }, 2.1),
        this.introTL.set(c, {
            value: 0
        }, 0),
        this.introTL.set(c, {
            value: 1
        }, 2.1),
        this.introTL.set(h, {
            value: 0
        }, 0),
        this.introTL.set(h, {
            value: 1
        }, 2.1),
        this.introTL.fromTo(d, {
            value: 0
        }, {
            value: 1,
            duration: 3
        }, .7),
        this.introTL.fromTo(u, {
            value: 0
        }, {
            value: 1,
            duration: 7.5,
            ease: "inOut1"
        }, .7),
        this.introTL.fromTo(p, {
            value: 0
        }, {
            value: 1,
            duration: 7.5,
            ease: "inOut1"
        }, .7),
        this.introTL.fromTo(A, {
            value: 0
        }, {
            value: 1,
            duration: 7.5,
            ease: "inOut1"
        }, .7),
        this.introTL.fromTo(f, {
            value: 0
        }, {
            value: 1,
            duration: 7.5,
            ease: "inOut1"
        }, .7),
        this.introTL.fromTo(m, {
            value: 0
        }, {
            value: 1,
            duration: 7.5,
            ease: "inOut3"
        }, .7),
        this.introTL.fromTo(x, {
            value: 0
        }, {
            value: 1,
            duration: 7.5,
            ease: "inOut3"
        }, .7),
        this.introTL.fromTo(v, {
            value: 0
        }, {
            value: 1,
            duration: 7.5,
            ease: "inOut3"
        }, .7),
        this.introTL.fromTo(g, {
            value: 0
        }, {
            value: 1,
            duration: 7.5,
            ease: "inOut3"
        }, .7),
        this.introTL.fromTo(y, {
            value: 0
        }, {
            value: 1,
            duration: 4,
            ease: "sine.out"
        }, .5),
        this.introTL.fromTo(S, {
            value: 1
        }, {
            value: 0,
            duration: 2,
            ease: "linear"
        }, 1.75),
        this.introTL.set(this.introparticles.mesh, {
            visible: !0
        }, 0),
        this.introTL.set(this.introparticles.mesh, {
            visible: !1
        }, 1.75 + 2),
        this.introTL.fromTo(M, {
            value: 0
        }, {
            value: 1,
            duration: 3,
            ease: "power2.inOut"
        }, 2),
        this.introTL.fromTo(s, {
            value: 0
        }, {
            value: 1,
            duration: 4,
            ease: "power2.inOut"
        }, 2),
        this.introTL.fromTo(E, {
            value: 0
        }, {
            value: 1,
            duration: 3,
            ease: "power2.inOut"
        }, 1.5),
        this.introTL.fromTo(_, {
            value: 0
        }, {
            value: 1,
            duration: 1,
            ease: "power2.inOut"
        }, 1),
        this.introTL.fromTo(e, {
            value: 1.5
        }, {
            value: 1,
            duration: 2,
            ease: "sine.inOut"
        }, 2.5),
        this.introTL.fromTo(t, {
            value: 0
        }, {
            value: 1,
            duration: 4,
            ease: "sine.inOut"
        }, 1),
        this.introTL.call(() => {
            Q.emit("webgl_show_ui_intro")
        }, null, 4.5),
        this.introTL.fromTo(this.introWeight, {
            value: 0
        }, {
            value: 1,
            duration: 5.5,
            ease: "inOut1"
        }, 2)
    }
    async playInAnimation()
    {
        this.introTL.play(0),
        await re.delayedCall(5, () => {})
    }
    createTimeline()
    {
        this.timelinePosition.set(-13.25, 2.5, 13.25),
        this.timelineTarget.set(0, 1, 0);
        const e = this.timelinePosition.toArray(),
            t = this.timelineTarget.toArray();
        this.timeline = re.timeline({
            paused: !0
        }),
        this.timeline.fromTo(this.timelinePosition, {
            y: e[1] + 9
        }, {
            y: e[1],
            duration: 14,
            ease: "power2.out"
        }, 0),
        this.timeline.fromTo(this.timelineTarget, {
            y: t[1] + 14
        }, {
            y: t[1],
            duration: 14,
            ease: "power2.out"
        }, 0),
        this.timeline.fromTo(this.timelinePosition, {
            x: e[0],
            z: e[2]
        }, {
            x: e[0] - 2,
            z: e[2] + 10,
            duration: 14,
            ease: "power1.inOut"
        }, 7),
        this.timeline.progress(1),
        this.timeline.progress(0)
    }
    update()
    {
        var e;
        this.timeline.progress(this.progress),
        this.camera.basePosition.lerpVectors(this.introPosition, this.timelinePosition, this.introWeight.value),
        this.camera.baseTarget.lerpVectors(this.introTarget, this.timelineTarget, this.introWeight.value),
        (e = this.manifesto) == null || e.update(this.progress, this._needsReset),
        this._windVolume = ie.fit(this.progress, .05, .2, 0, 1) * ie.fit(this.progress, .75, .95, 1, 0),
        Q.emit("webgl_set_audio_volume", "wind", this._windVolume * .4),
        Q.emit("webgl_set_audio_volume", "igloo", this._iglooVolume * .5),
        this._needsReset = !1
    }
    resize()
    {
        this.camera.zoom = Math.min(1, q.screen.aspectRatio * 1.25),
        this.camera.updateProjectionMatrix()
    }
    dispose() {}
}
let N3 = class  extends fe{
    constructor()
    {
        super({
            uniformsGroups: [he.UBO],
            uniforms: {
                tDiffuse: {
                    value: null
                },
                tLUT: {
                    value: le.load("cubes/cube_scene.ktx2", "luttetrahedral")
                },
                uLUTSize: {
                    value: 1
                },
                uLUTIntensity: {
                    value: 1
                }
            },
            vertexShader: `
                            ${ae}

                            varying vec2 vUv;

                            void main() {
                                vUv = uv;
                                gl_Position = vec4(position, 1.0);
                            }
                        `,
            fragmentShader: `
                            ${ae}

                            uniform sampler2D tDiffuse;

                            varying vec2 vUv;

                            ${xE}

                            uniform sampler3D tLUT;
                            uniform float uLUTSize;
                            uniform float uLUTIntensity;

                            vec3 hash32(vec2 p) {
                                vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
                                p3 += dot(p3, p3.yxz+33.33);
                                return fract((p3.xxy+p3.yzz)*p3.zyx);
                            }

                            void main() {
                                vec2 uv = vUv;

                                // get scene applying color correction
                                vec4 scene = texture2D(tDiffuse, uv);
                                vec3 sceneColor = apply3DLUTTetrahedral(scene.rgb, tLUT, uLUTSize, uLUTIntensity);

                                gl_FragColor = vec4(sceneColor, 1.0);
                            }
                        `
        }),
        setTimeout(async () => {
            const e = this.uniforms.tLUT.value;
            await e._loaded,
            this.uniforms.uLUTSize.value = e.image.width
        }, 0)
    }
}
;
async function O3(i, e) {
    const t = new Eg(new N3);
    e.addPass(t),
    await t.material.uniforms.tLUT.value._loaded
}
