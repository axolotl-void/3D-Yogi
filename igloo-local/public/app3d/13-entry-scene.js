class oF {
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
        const e = new kt(1, 1);
        e.rotateX(Math.PI * .5),
        e.translate(0, 1.5, 0);
        const t = new fe({
            uniformsGroups: [he.UBO],
            uniforms: {},
            vertexShader: `
                            //- edit
                            ${ae}

                            varying vec2 vUv;


                            vec2 rotate(vec2 v, float a) {
                                float s = sin(a);
                                float c = cos(a);
                                mat2 m = mat2(c, s, -s, c);
                                return m * v;
                            }

                            void main() {
                                vUv = uv;

                                vec3 pos = position;
                                pos.xz = rotate(pos.xz, -time * 0.2);

                                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}

                            varying vec2 vUv;

                            void main() {

                                vec3 color = vec3(2.0);

                                // draw ring
                                float dist = length(vUv - 0.5);
                                float alpha = smoothstep(0.5, 0.3, dist);
                                alpha *= smoothstep(0.3, 0.4, dist);
                                alpha *= smoothstep(0.03, 0.1, abs(vUv.x - 0.5));
                                // alpha *= smoothstep(0.04, 0.09, abs(vUv.y - 0.5));

                                // subtle animation
                                alpha *= mix(1.0, 0.8, sin(time * 2.0 + dist + vUv.x * 2.0 + vUv.y) * 0.5 + 0.5);

                                gl_FragColor = vec4(color, alpha);
                            }
                        `,
            transparent: !0,
            blending: pt
        });
        this.mesh = new Ce(e, t),
        this.mesh.position.y = -10.26,
        this.mesh.scale.setScalar(.57),
        this.mesh.name = "roomring",
        this.mesh.renderOrder = 3,
        this.mesh.updateMatrixWorld(!0),
        this.mesh.receiveShadow = !1,
        this.mesh.castShadow = !1,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
var yd = "mat3 rotateX(float angle){float s=sin(angle);float c=cos(angle);return mat3(1.0,0.0,0.0,0.0,c,s,0.0,-s,c);}mat3 rotateY(float angle){float c=cos(angle);float s=sin(angle);return mat3(c,0.0,-s,0.0,1.0,0.0,s,0.0,c);}mat3 rotateZ(float angle){float c=cos(angle);float s=sin(angle);return mat3(c,s,0.0,-s,c,0.0,0.0,0.0,1.0);}mat4 rotation3D(vec3 axis,float angle){axis=normalize(axis);float s=sin(angle);float c=cos(angle);float oc=1.0-c;return mat4(oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.0,oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.0,oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.0,0.0,0.0,0.0,1.0);}vec3 rotate3D(vec3 v,vec3 axis,float angle){mat4 m=rotation3D(axis,angle);return(m*vec4(v,1.0)).xyz;}vec4 quatNormalize(vec4 q){float len=length(q);if(len==0.0)return vec4(vec3(0.0),1.0);return q/len;}vec4 quatFromAxisAngle(vec3 axis,float angle){float sn=sin(angle*0.5);float cs=cos(angle*0.5);return vec4(axis*sn,cs);}vec4 quatFromUnitVectors(vec3 v1,vec3 v2){float r=dot(v1,v2)+1.0;if(r<1e-6)return quatNormalize(abs(v1.x)>abs(v1.z)? vec4(-v1.y,v1.x,0.0,0.0): vec4(0.0,-v1.z,v1.y,0.0));vec4 q=vec4(cross(v1,v2),r);return q/length(q);}vec3 applyQuat(vec3 vec,vec4 quat){vec3 t=2.0*cross(quat.xyz,vec);return vec+quat.w*t+cross(quat.xyz,t);}";
class lF extends fe {
    constructor()
    {
        super({
            uniformsGroups: [he.UBO],
            uniforms: {
                tMap: {
                    value: null
                },
                tGlow: {
                    value: null
                },
                uAlpha: {
                    value: 1
                },
                uColor1: {
                    value: new Z("#6a6f7d")
                },
                uColor2: {
                    value: new Z("#e1e6f1")
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}
                            ${Nt}
                            ${Ue}
                            ${yd}

                            attribute vec3 centr;
                            attribute vec3 rand;

                            varying vec2 vUv;
                            varying vec3 vPos;
                            varying float vFalloff;
                            varying float vFalloff2;
                            varying float vFade;
                            varying float vGlow;
                            varying float vFirstRingMask;
                            varying vec2 vGlowPos;

                            vec2 rotate(vec2 v, float a) {
                                float s = sin(a);
                                float c = cos(a);
                                mat2 m = mat2(c, s, -s, c);
                                return m * v;
                            }

                            void main() {
                                vUv = uv;
                                vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;

                                vec3 pos = position;
                                vec3 translation = getMatrixTranslation(modelMatrix);
                                float firstRingMask = falloff(translation.y, -1.66, -1.661, 0.01, 0.5);
                                vFirstRingMask = 1.0 - firstRingMask;
                                float camFactor = 1.0 - (1.0 - clamp(-cameraPosition.z * 0.8, 0.0, 1.0));

                                // rotate based on camera distance
                                float dist = distance(cameraPosition, translation);

                                vFalloff = falloffsmooth(dist, 14.0, 2.0, 13.0, 0.75);
                                float glowFalloff = 1.0 - smoothstep(0.2, 0.4, 1.0 - vFalloff);

                                vec3 scaledCentr = centr * 0.3;
                                vec3 axis = normalize(rand * 2.0 - 1.0);
                                float angle = 0.5 * smoothstep(1.5, 12.0, -vPos.z) + firstRingMask * camFactor * 0.5;
                                pos -= scaledCentr;
                                pos = rotate3D(pos, axis, angle);
                                pos += scaledCentr;

                                pos += centr * glowFalloff * mix(0.075, 0.15, rand.z);
                                pos += rand.y * centr * glowFalloff * sin(rand.x * 5.0 + time * 0.5 + (centr.x + centr.y + centr.z) * 15.0) * 0.05;

                                // additional push based on camera coming into view

                                pos += centr * camFactor * 0.15 * firstRingMask;

                                float spinFalloff = falloffsmooth(dist, 8.0, 2.0, 5.0, 0.5);
                                float spinFalloff2 = falloffsmooth(dist, 10.0, 2.0, 8.0, 0.5);

                                float angle1 = spinFalloff * 3.14159 * 0.3;
                                pos.xz = rotate(pos.xz, angle1);

                                float angle2 = spinFalloff2 * 3.14159 * 0.3 + translation.y * 0.25 + 1.5;
                                pos.xy = rotate(pos.xy, angle2);

                                vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                                vGlowPos = rotate(worldPos.xz, -time * 0.5 + translation.y * 2.2);

                                // fade in as camera approaches
                                vFade = falloffsmooth(dist, 2.0, 16.0, 9.0, 0.5);

                                // make first ring fully visible
                                vFade = min(1.0, vFade);

                                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}
                            ${Ue}
                            ${_a}

                            varying vec2 vUv;
                            varying vec3 vPos;
                            varying float vFalloff;
                            varying float vFalloff2;
                            varying float vGlow;
                            varying float vFade;
                            varying float vFirstRingMask;

                            uniform sampler2D tMap;
                            uniform sampler2D tGlow;
                            uniform float uAlpha;
                            uniform vec3 uColor1;
                            uniform vec3 uColor2;

                            void main() {
                                float alpha = 1.0;

                                vec3 color = texture2D(tMap, vUv).rgb;

                                // background gradient
                                vec2 screenUv = gl_FragCoord.xy / resolution;
                                float diagonalGradient = (screenUv.x + screenUv.y) * 0.5;
                                diagonalGradient *= sinenoise1(vec3(screenUv, time * 0.614)) * 0.5 + 0.5;
                                diagonalGradient *= sinenoise1(vec3(screenUv * 2.0, time * 0.17)) * 0.5 + 0.5;
                                vec3 bg = mix(uColor1, uColor2, diagonalGradient);
                                bg *= 1.1;

                                color = mix(bg, color, vFade * 0.95);

                                // darken as camera approaches
                                // color *= vFalloff;

                                // reveal as camera enters igloo entry
                                // color *= vFalloff2;

                                // emissive
                                float falloff = 1.0 - vFalloff;
                                float glowFalloff = smoothstep(0.2, 0.4, falloff);
                                float n1 = sinenoise1(vPos + time * 0.5 + color.r * 5.0) * 0.5 + 0.5;
                                n1 = n1 * 0.5 + 0.5;
                                float camFactor = pow(1.0 - clamp(-cameraPosition.z, 0.0, 1.0), 4.0);
                                color += texture2D(tGlow, vUv).r * vec3(0.5, 0.7, 1.0) * n1 * glowFalloff * 0.8 * camFactor;
                                // vec3 blue = vec3(0.5, 0.7, 1.0) * vFirstRingMask;
                                // float glowModulation = pow(length(vGlowPos - vec2(0.0, 0.5)), 3.0);
                                // color += blue * vGlow * 5.0 * glowFalloff * glowModulation;
                                // color += color * blue * smoothstep(0.9, 1.0, falloff) * glowModulation * 0.5;

                                gl_FragColor = vec4(color, alpha);
                            }
                        `
        })
    }
}
class cF {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.meshes = [],
        this.init()
    }
    async init()
    {
        const e = [{
                name: "shattered_ring2",
                geometry: await zt.load("shattered_ring2.drc")
            }, {
                name: "shattered_ring",
                geometry: await zt.load("shattered_ring.drc")
            }],
            t = 3,
            s = 2.5;
        let n = 1.65;
        for (let r = 0; r < t; r++) {
            const a = e[r % e.length],
                o = a.geometry,
                l = `mesh${r}`;
            this[l] = new Ce(o, new lF),
            this[l].material.uniforms.tMap.value = le.load(`${a.name}_color.ktx2`, "srgb-repeat"),
            this[l].material.uniforms.tGlow.value = le.load(`${a.name}_ao.ktx2`, "srgb-repeat"),
            this[l].name = `ring${r}`,
            this[l].receiveShadow = !1,
            this[l].castShadow = !1,
            this[l].position.y = -n,
            this[l].rotation.x = -3.14159 * .5,
            this[l].updateMatrixWorld(!0),
            this[l].renderOrder = t,
            n += s,
            this.scene.add(this[l]),
            this.meshes.push(this[l])
        }
        this.isReady()
    }
    update()
    {
        const e = this.scene.timelineAdditional.upRotation * .4;
        this.meshes.forEach(t => {
            t.rotation.z = e
        })
    }
}
class hF {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.additionalTime = 0,
        this.init()
    }
    async init()
    {
        const e = await zt.load("floor.drc"),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tMap: {
                        value: le.load("floor_color.ktx2", "srgb")
                    },
                    tPerlin: {
                        value: le.load("perlin-datatexture.ktx2", "colordata-repeat")
                    },
                    tWind: {
                        value: le.load("wind_noise.ktx2", "linear-repeat")
                    },
                    uAlpha: {
                        value: q.devScene ? 1 : 0
                    },
                    uColor1: {
                        value: new Z("#6a6f7d")
                    },
                    uColor2: {
                        value: new Z("#e1e6f1")
                    },
                    uRotationTime: {
                        value: 0
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}
                                ${yd}

                                attribute float animationmask;
                                attribute float iteration;
                                attribute float glow;

                                uniform float uRotationTime;

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vPosOriginal;
                                varying float vGlow;

                                void main() {
                                    vUv = uv;
                                    vGlow = glow;
                                    vPosOriginal = position;

                                    vec3 pos = position;

                                    float t = uRotationTime;


                                    // pos.y -= animationmask * 0.015;

                                    // animate individual pieces
                                    vec3 axis = normalize(vec3(0.0, 0.5, 1.0));
                                    axis = rotate3D(axis, vec3(0.0, 1.0, 0.0), t * 1.25 + iteration * 1.2);
                                    float angle = 0.03 * animationmask;
                                    pos = rotate3D(pos, axis, angle);

                                    pos.y -= sin(iteration - t) * 0.01 * animationmask;
                                    pos.y -= animationmask * 0.04;

                                    // pos.y -= (sin(time + iteration * 0.2) * 0.5 + 0.5) * animationmask * 0.05;
                                    // pos.y -= animationmask * 0.03;

                                    vPos = pos;

                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}
                                ${_a}

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vPosOriginal;
                                varying float vGlow;

                                uniform sampler2D tMap;
                                uniform sampler2D tPerlin;
                                uniform float uAlpha;
                                uniform vec3 uColor1;
                                uniform vec3 uColor2;

                                void main() {
                                    float posLen = length(vPos.xz);
                                    // baked texture
                                    vec3 color = texture2D(tMap, vUv).rgb;
                                    color *= mix(0.65, 1.0, vPos.x * 0.5 + 0.5);
                                    color += (vPos.x + 1.0) * 0.02;

                                    // background gradient
                                    vec2 screenUv = gl_FragCoord.xy / resolution;
                                    float diagonalGradient = (screenUv.x + screenUv.y) * 0.5;
                                    diagonalGradient *= sinenoise1(vec3(screenUv, time * 0.614)) * 0.5 + 0.5;
                                    diagonalGradient *= sinenoise1(vec3(screenUv * 2.0, time * 0.17)) * 0.5 + 0.5;
                                    vec3 bg = mix(uColor1, uColor2, diagonalGradient);

                                    // add a bit of smokeyness to lower part
                                    // float perlin = texture2D(tPerlin, vPos.xz * 18.0 + vec2(-time * 0.4, -time * 0.2)).r * 0.08;
                                    float depth = smoothstep(0.06, -0.2, vPos.y);

                                    // composite final color from baked texture and background gradient
                                    float radialGradient = smoothstep(1.4, 1.6, posLen);
                                    // color = mix(color, bg, clamp(radialGradient, 0.0, 1.0));

                                    // animate alpha on scroll
                                    float alpha = falloffsmooth(posLen * 3.0, 0.0, 6.0, 3.0, uAlpha);

                                    // fade to distance
                                    alpha *= smoothstep(1.99, 1.3, posLen);
                                    // float alpha = 1.0;

                                    // radial alpha
                                    // alpha *= radialGradient;
                                    // alpha *= 1.0 - pow(radialGradient, 2.0);

                                    // fake shadow
                                    float shadow = min(1.0, length(vPos * 1.5 + vec3(1.15, 0.0, -0.55)));
                                    shadow = pow(shadow, 2.0);
                                    shadow += sin(time * 3.3 + vPos.z * 5.0) * 0.1 + 0.1;
                                    shadow += sin(time * 3.1 + vPos.x * 4.0) * 0.1 + 0.1;
                                    shadow = mix(0.5, 1.0, shadow);
                                    color *= mix(vec3(0.5, 0.7, 1.0) * 0.1, vec3(1.0), shadow);

                                    vec3 blue = vec3(0.5, 0.7, 1.0);
                                    blue *= 1.0 - radialGradient;
                                    float glowModulation = smoothstep(0.087, -0.1, vPosOriginal.y);
                                    float animatedGlow = smoothstep(0.087, 0.05, vPosOriginal.y);
                                    animatedGlow *= sin(vPos.z * 5.0 + posLen * 10.0 - time * 0.75) * 0.5 + 0.5;
                                    // glowModulation = pow(glowModulation, 4.0);
                                    color += blue * glowModulation;
                                    color += blue * animatedGlow;




                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0
            });
        this.mesh = new Ce(e, t),
        this.mesh.name = "floor",
        this.mesh.position.y = -10.19,
        this.mesh.scale.setScalar(.73),
        this.mesh.rotation.y = Math.PI,
        this.mesh.renderOrder = 3,
        this.mesh.updateMatrixWorld(!0),
        this.mesh.receiveShadow = !1,
        this.mesh.castShadow = !1,
        this.scene.beforeRenderCbs.push(() => {
            this.mesh.material.uniforms.uRotationTime.value = Fe.time * .5 + this.additionalTime
        }),
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class uF {
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
        const t = new Md(1, 1, 3, 64, 6, !0);
        t.translate(0, 3 * .5, 0);
        const s = new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                uAlpha: {
                    value: 0
                },
                uHeight: {
                    value: 3
                },
                tTriangles: {
                    value: le.load("igloo/triangles_tiling.ktx2", "srgb-repeat")
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}
                            ${Nt}

                            varying vec2 vUv;
                            varying vec3 vPos;
                            varying vec3 vNormal;
                            varying vec3 vEye;

                            void main() {
                                vUv = uv;

                                vec3 pos = position;
                                vPos = (modelMatrix * vec4(position, 1.0)).xyz;

                                // for fresnel
                                vNormal = normalMatrix * normal;
                                vEye = -(modelViewMatrix * vec4(position, 1.0)).xyz;

                                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}
                            ${Ue}
                            ${_a}

                            varying vec2 vUv;
                            varying vec3 vPos;
                            varying vec3 vNormal;
                            varying vec3 vEye;

                            uniform float uAlpha;
                            uniform sampler2D tTriangles;

                            void main() {

                                vec2 uv = vUv;

                                // correct aspect for cylinder
                                uv.x *= 2.0;

                                vec3 pos = vPos;
                                float t = time * 0.5;

                                // animated noise
                                float noise = sinenoise1(pos * 4.0 + vec3(0.0, t * 0.45, -t * 0.13)) * 0.5 + 0.5;
                                noise *= sinenoise1(pos * 2.0 + vec3(t * 0.3, -t * 0.27, t * 0.2)) * 0.5 + 0.5;
                                noise = sin(noise * 15.0 - t * 7.0) * 0.5 + 0.5;
                                noise = pow(noise, 4.0);

                                // triangle texture, distorted with above noise
                                float triangles = texture2D(tTriangles, uv * 6.0 + vec2(noise * 0.05)).r;

                                // fade at top, edges, slight fresnel
                                float fresnel = 1.0 - max(0.0, dot(normalize(vNormal), normalize(vEye)));
                                float softedge = 1.0 - smoothstep(0.65, 0.99, fresnel);
                                fresnel = mix(fresnel, 1.0, 0.25);
                                float fadetop = 1.0 - smoothstep(0.5, 1.0, vUv.y);

                                // composite final alpha
                                float alpha = (noise * triangles * 2.0 + noise * 0.03) * fresnel * softedge * fadetop;

                                // animate on scroll
                                alpha *= uAlpha;

                                vec3 color = vec3(1.0);

                                gl_FragColor = vec4(color, alpha);
                            }
                        `,
            side: xi,
            transparent: !0,
            blending: pt
        });
        this.mesh = new Ce(t, s),
        this.mesh.position.y = -10.13,
        this.mesh.scale.setScalar(.28),
        this.mesh.name = "forcefield",
        this.mesh.renderOrder = 15,
        this.mesh.updateMatrixWorld(!0),
        this.mesh.matrixAutoUpdate = !1,
        this.mesh.receiveShadow = !1,
        this.mesh.castShadow = !1,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class dF {
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
        const e = new bd(100, 32, 32),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    uAlpha: {
                        value: 1
                    },
                    uColor1: {
                        value: new Z("#6a6f7d")
                    },
                    uColor2: {
                        value: new Z("#e1e6f1")
                    },
                    tPerlin: {
                        value: le.load("perlin-datatexture.ktx2", "colordata-repeat")
                    },
                    tDotPattern: {
                        value: le.load("cubes/dot_pattern.ktx2", "srgb-repeat")
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                varying vec2 vUv;
                                varying vec3 vPos;

                                void main() {
                                    vUv = uv;

                                    vec3 pos = position;
                                    vPos = pos;

                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}
                                ${_a}

                                varying vec2 vUv;
                                varying vec3 vPos;

                                uniform sampler2D tDotPattern;
                                uniform float uAlpha;
                                uniform vec3 uColor1;
                                uniform vec3 uColor2;

                                float hash12(vec2 p) {
                                    vec3 p3  = fract(vec3(p.xyx) * .1031);
                                    p3 += dot(p3, p3.yzx + 33.33);
                                    return fract((p3.x + p3.y) * p3.z);
                                }

                                void main() {
                                    // background color gradient
                                    vec2 screenUv = gl_FragCoord.xy / resolution;
                                    float ramp = (screenUv.x + screenUv.y) * 0.5;
                                    ramp *= sinenoise1(vec3(screenUv, time * 0.614)) * 0.5 + 0.5;
                                    ramp *= sinenoise1(vec3(screenUv * 2.0, time * 0.17)) * 0.5 + 0.5;
                                    vec3 color = mix(uColor1, uColor2, ramp);
                                    color *= 1.1;

                                    // dot pattern
                                    vec2 dotUv = vUv * vec2(200.0, 100.0);
                                    float dots = texture2D(tDotPattern, dotUv).r;
                                    float dotid = hash12(floor(dotUv));
                                    float dotfade = 1.0 - abs(fract(dotid + time * 0.1) - 0.5) * 2.0;
                                    color += dots * dotfade * 2.0;

                                    // animate on scroll
                                    // float alpha = falloffsmooth(length(vPos.xz), 0.0, 10.1, 2.0, uAlpha);
                                    // color *= alpha;

                                    gl_FragColor = vec4(color, 1.0);
                                }
                            `,
                side: ei
            });
        this.mesh = new Ce(e, t),
        this.mesh.name = "lightroom",
        this.mesh.renderOrder = 2,
        this.mesh.position.y = -12.15,
        this.mesh.updateMatrixWorld(!0),
        this.mesh.matrixAutoUpdate = !1,
        this.mesh.receiveShadow = !1,
        this.mesh.castShadow = !1,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class fF {
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
        const e = await zt.load("blurrytext_cylinder.drc"),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    uAlpha: {
                        value: 0
                    },
                    tMap: {
                        value: le.load("cubes/blurrytext_atlas.ktx2", "srgb-repeat")
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                attribute float rand;

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vWorldPos;
                                varying float vRand;

                                void main() {
                                    vUv = uv;

                                    vec3 pos = position;

                                    vPos = pos;
                                    vRand = rand;

                                    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;

                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying float vRand;

                                uniform sampler2D tMap;
                                uniform float uAlpha;

                                void main() {

                                    float alpha = texture2D(tMap, vUv).r;

                                    // fade by height
                                    alpha *= clamp(vPos.y * 2.0, 0.0, 1.0);

                                    // animate fade
                                    alpha *= sin(time * 2.0 + vRand * 10.0 + (vPos.x * 2.0 + vPos.z * 2.0)) * 0.5 + 0.5;

                                    // fade in on scroll
                                    float transition = falloffsmooth(length(vPos.xz), 0.0, 10.0, 3.0, uAlpha);
                                    alpha *= transition;
                                    alpha *= 0.7;

                                    alpha *= uAlpha;

                                    vec3 color = vec3(1.0);

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0,
                blending: pt
            });
        this.mesh = new Ce(e, t),
        this.mesh.position.y = -10.33,
        this.mesh.scale.setScalar(1.75),
        this.mesh.name = "textcylinder",
        this.mesh.renderOrder = 1,
        this.mesh.updateMatrixWorld(!0),
        this.mesh.receiveShadow = !1,
        this.mesh.castShadow = !1,
        this.scene.add(this.mesh),
        this.mesh2 = new Ce(e, t),
        this.mesh2.position.y = -10.33,
        this.mesh2.scale.setScalar(3.5),
        this.mesh2.rotation.y = 3.14159 * .5,
        this.mesh2.name = "textcylinder2",
        this.mesh2.renderOrder = 0,
        this.mesh2.updateMatrixWorld(!0),
        this.scene.add(this.mesh2);
        const s = new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                uAlpha: {
                    value: 1
                },
                tMap: {
                    value: le.load("cubes/blurrytext_atlas.ktx2", "srgb-repeat")
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}

                            attribute float rand;

                            varying vec2 vUv;
                            varying vec3 vPos;
                            varying vec3 vWorldPos;
                            varying float vRand;

                            void main() {
                                vUv = uv;

                                vec3 pos = position;

                                vPos = pos;
                                vRand = rand;

                                vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;

                                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}
                            ${Ue}

                            varying vec2 vUv;
                            varying vec3 vPos;
                            varying float vRand;

                            uniform sampler2D tMap;
                            uniform float uAlpha;

                            void main() {

                                float alpha = texture2D(tMap, vUv).r;

                                // animate fade
                                alpha *= sin(time * 2.0 + vRand * 10.0 + (vPos.x * 2.0 + vPos.z * 2.0 + vPos.y)) * 0.5 + 0.5;
                                alpha *= 0.25;

                                alpha *= uAlpha;

                                vec3 color = vec3(1.0);

                                gl_FragColor = vec4(color, alpha);
                            }
                        `,
            transparent: !0,
            blending: pt
        });
        this.mesh3 = new Ce(e, s),
        this.mesh3.position.y = -9.5,
        this.mesh3.scale.set(2, 9, 2),
        this.mesh3.rotation.y = 3.14159,
        this.mesh3.name = "textcylinder3",
        this.mesh3.renderOrder = 0,
        this.scene.add(this.mesh3),
        this.mesh4 = new Ce(e, s),
        this.mesh4.position.y = -9.5,
        this.mesh4.scale.set(3.3, 8, 3.3),
        this.mesh4.name = "textcylinder4",
        this.mesh4.renderOrder = -1,
        this.scene.add(this.mesh4),
        this.isReady()
    }
    update()
    {
        const e = this.scene.timelineAdditional.upRotation * .65;
        this.mesh4.rotation.y = e,
        this.mesh3.rotation.y = e + 2
    }
}
var pF = "float lerpCoefFPS(float t,float dt){return 1.0-exp2(log2(1.0-t)*dt);}float frictionFPS(float t,float dt){return exp2(log2(t)*dt);}float lerpFPS(float x,float y,float t,float dt){return mix(x,y,lerpCoefFPS(t,dt));}",
    mF = "uvec2 _pcg3d16(uvec3 p){uvec3 v=p*1664525u+1013904223u;v.x+=v.y*v.z;v.y+=v.z*v.x;v.z+=v.x*v.y;v.x+=v.y*v.z;v.y+=v.z*v.x;return v.xy;}uvec2 _pcg4d16(uvec4 p){uvec4 v=p*1664525u+1013904223u;v.x+=v.y*v.w;v.y+=v.z*v.x;v.z+=v.x*v.y;v.w+=v.y*v.z;v.x+=v.y*v.w;v.y+=v.z*v.x;return v.xy;}vec3 _gradient3d(uint hash){vec3 g=vec3(uvec3(hash)&uvec3(0x80000,0x40000,0x20000));return g*(1.0/vec3(0x40000,0x20000,0x10000))-1.0;}vec4 _gradient4d(uint hash){vec4 g=vec4(uvec4(hash)&uvec4(0x80000,0x40000,0x20000,0x10000));return g*(1.0/vec4(0x40000,0x20000,0x10000,0x8000))-1.0;}vec3 BitangentNoise3D(vec3 p){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);vec3 i=floor(p+dot(p,C.yyy));vec3 x0=p-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=i+32768.5;uvec2 hash0=_pcg3d16(uvec3(i));uvec2 hash1=_pcg3d16(uvec3(i+i1));uvec2 hash2=_pcg3d16(uvec3(i+i2));uvec2 hash3=_pcg3d16(uvec3(i+1.0));vec3 p00=_gradient3d(hash0.x);vec3 p01=_gradient3d(hash0.y);vec3 p10=_gradient3d(hash1.x);vec3 p11=_gradient3d(hash1.y);vec3 p20=_gradient3d(hash2.x);vec3 p21=_gradient3d(hash2.y);vec3 p30=_gradient3d(hash3.x);vec3 p31=_gradient3d(hash3.y);vec4 m=clamp(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0,1.0);vec4 mt=m*m;vec4 m4=mt*mt;mt=mt*m;vec4 pdotx=vec4(dot(p00,x0),dot(p10,x1),dot(p20,x2),dot(p30,x3));vec4 temp=mt*pdotx;vec3 gradient0=-8.0*(temp.x*x0+temp.y*x1+temp.z*x2+temp.w*x3);gradient0+=m4.x*p00+m4.y*p10+m4.z*p20+m4.w*p30;pdotx=vec4(dot(p01,x0),dot(p11,x1),dot(p21,x2),dot(p31,x3));temp=mt*pdotx;vec3 gradient1=-8.0*(temp.x*x0+temp.y*x1+temp.z*x2+temp.w*x3);gradient1+=m4.x*p01+m4.y*p11+m4.z*p21+m4.w*p31;return cross(gradient0,gradient1)*3918.76;}vec3 BitangentNoise4D(vec4 p){const vec4 F4=vec4(0.309016994374947451);const vec4 C=vec4(0.138196601125011,0.276393202250021,0.414589803375032,-0.447213595499958);vec4 i=floor(p+dot(p,F4));vec4 x0=p-i+dot(i,C.xxxx);vec4 i0;vec3 isX=step(x0.yzw,x0.xxx);vec3 isYZ=step(x0.zww,x0.yyz);i0.x=isX.x+isX.y+isX.z;i0.yzw=1.0-isX;i0.y+=isYZ.x+isYZ.y;i0.zw+=1.0-isYZ.xy;i0.z+=isYZ.z;i0.w+=1.0-isYZ.z;vec4 i3=clamp(i0,0.0,1.0);vec4 i2=clamp(i0-1.0,0.0,1.0);vec4 i1=clamp(i0-2.0,0.0,1.0);vec4 x1=x0-i1+C.xxxx;vec4 x2=x0-i2+C.yyyy;vec4 x3=x0-i3+C.zzzz;vec4 x4=x0+C.wwww;i=i+32768.5;uvec2 hash0=_pcg4d16(uvec4(i));uvec2 hash1=_pcg4d16(uvec4(i+i1));uvec2 hash2=_pcg4d16(uvec4(i+i2));uvec2 hash3=_pcg4d16(uvec4(i+i3));uvec2 hash4=_pcg4d16(uvec4(i+1.0));vec4 p00=_gradient4d(hash0.x);vec4 p01=_gradient4d(hash0.y);vec4 p10=_gradient4d(hash1.x);vec4 p11=_gradient4d(hash1.y);vec4 p20=_gradient4d(hash2.x);vec4 p21=_gradient4d(hash2.y);vec4 p30=_gradient4d(hash3.x);vec4 p31=_gradient4d(hash3.y);vec4 p40=_gradient4d(hash4.x);vec4 p41=_gradient4d(hash4.y);vec3 m0=clamp(0.6-vec3(dot(x0,x0),dot(x1,x1),dot(x2,x2)),0.0,1.0);vec2 m1=clamp(0.6-vec2(dot(x3,x3),dot(x4,x4)),0.0,1.0);vec3 m02=m0*m0;vec3 m03=m02*m0;vec2 m12=m1*m1;vec2 m13=m12*m1;vec3 temp0=m02*vec3(dot(p00,x0),dot(p10,x1),dot(p20,x2));vec2 temp1=m12*vec2(dot(p30,x3),dot(p40,x4));vec4 grad0=-6.0*(temp0.x*x0+temp0.y*x1+temp0.z*x2+temp1.x*x3+temp1.y*x4);grad0+=m03.x*p00+m03.y*p10+m03.z*p20+m13.x*p30+m13.y*p40;temp0=m02*vec3(dot(p01,x0),dot(p11,x1),dot(p21,x2));temp1=m12*vec2(dot(p31,x3),dot(p41,x4));vec4 grad1=-6.0*(temp0.x*x0+temp0.y*x1+temp0.z*x2+temp1.x*x3+temp1.y*x4);grad1+=m03.x*p01+m03.y*p11+m03.z*p21+m13.x*p31+m13.y*p41;return cross(grad0.xyz,grad1.xyz)*81.0;}",
    AF = "float linearstep(float begin,float end,float t){return clamp((t-begin)/(end-begin),0.0,1.0);}";
const Zn = new b;
class gF {
    constructor(e)
    {
        this.parent = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.init()
    }
    init()
    {
        const e = new ot,
            t = [],
            s = .065;
        t.push(...Zn.set(0, 0, 0).toArray(), ...Zn.set(-s, 0, 0).toArray(), ...Zn.set(-s, 0, 0).toArray(), ...Zn.set(-s * .8, s * .2, 0).toArray()),
        t.push(...Zn.set(0, 0, 0).toArray(), ...Zn.set(s, 0, 0).toArray(), ...Zn.set(s, 0, 0).toArray(), ...Zn.set(s * .8, s * .2, 0).toArray()),
        e.setAttribute("position", new nt(t, 3));
        const n = [];
        n.push(-1, -1, -1, -1),
        n.push(1, 1, 1, 1),
        e.setAttribute("side", new nt(n, 1));
        const r = new fe({
            uniforms: {
                uColor: {
                    value: new Z("#ffffff")
                },
                uWidth: {
                    value: .3
                },
                uScale: {
                    value: 1
                },
                uOpacity1: {
                    value: 0
                },
                uOpacity2: {
                    value: 0
                }
            },
            vertexShader: `
                            attribute float side;
                            uniform float uWidth;
                            uniform float uScale;
                            uniform float uOpacity1;
                            uniform float uOpacity2;

                            varying float vOpacity;

                            void main() {
                                vOpacity = mix(uOpacity1, uOpacity2, side * 0.5 + 0.5);
                                vec3 pos = position * uScale + vec3(side, 0.0, 0.0) * uWidth;
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                            }
                        `,
            fragmentShader: `
                            uniform vec3 uColor;
                            varying float vOpacity;
                            void main() {
                                float opacity = vOpacity;
                                if (vOpacity < 1.0) {
                                    opacity = floor(mod(vOpacity * 6.0, 2.0));
                                }

                                gl_FragColor = vec4(uColor * opacity, 1.0);
                            }
                        `,
            blending: pt,
            depthTest: !1,
            transparent: !0
        });
        this.mesh = new yr(e, r),
        this.mesh.name = "arrows",
        this.mesh.renderOrder = 999,
        this.mesh.frustumCulled = !1,
        this.parent.group.add(this.mesh);
        const a = new kt(s, s).rotateY(Math.PI),
            o = a.clone().translate(-s * .5, 0, 0),
            l = a.clone().translate(s * .5, 0, 0);
        this.planeRight = new Ce(o),
        this.planeRight._arrow = "right",
        this.planeRight.visible = !1,
        this.planeLeft = new Ce(l),
        this.planeLeft._arrow = "left",
        this.planeLeft.visible = !1,
        this.planeLeft.frustumCulled = !1,
        this.planeRight.frustumCulled = !1,
        this.interaction = new Er({
            meshes: [this.planeLeft, this.planeRight],
            camera: this.parent.parent.scene.camera,
            hoverCursor: !0,
            onHover: c => {
                c.action === "hover_in" && (this.show(c.interactions[0].object._arrow, .75), Q.emit("webgl_play_audio", "logo"))
            }
        }),
        this.parent.group.add(this.planeLeft),
        this.parent.group.add(this.planeRight),
        this.isReady()
    }
    show(e="both", t=1)
    {
        (e === "right" || e === "both") && re.fromTo(this.mesh.material.uniforms.uOpacity1, {
            value: 0
        }, {
            value: 1,
            duration: .2 * t,
            ease: "none",
            overwrite: !0
        }),
        (e === "left" || e === "both") && re.fromTo(this.mesh.material.uniforms.uOpacity2, {
            value: 0
        }, {
            value: 1,
            duration: .2 * t,
            ease: "none",
            overwrite: !0
        }),
        this.interaction.enable()
    }
    hide(e="both")
    {
        (e === "right" || e === "both") && re.fromTo(this.mesh.material.uniforms.uOpacity1, {
            value: 1
        }, {
            value: 0,
            duration: .1,
            ease: "none",
            overwrite: !0
        }),
        (e === "left" || e === "both") && re.fromTo(this.mesh.material.uniforms.uOpacity2, {
            value: 1
        }, {
            value: 0,
            duration: .1,
            ease: "none",
            overwrite: !0
        }),
        this.interaction.disable()
    }
    update()
    {
        q.screen.w < q.screen.h ? (this.mesh.material.uniforms.uWidth.value = .175, this.mesh.material.uniforms.uScale.value = .75, [this.planeLeft, this.planeRight].forEach((e, t) => e.position.set(.185 * (t === 0 ? 1 : -1), 0, 0))) : (this.mesh.material.uniforms.uWidth.value = .3, this.mesh.material.uniforms.uScale.value = 1, [this.planeLeft, this.planeRight].forEach((e, t) => e.position.set(.3 * (t === 0 ? 1 : -1), 0, 0)))
    }
}
var Lc = "vec2 imagefitUV(vec2 uv,vec2 imageSize,vec2 containerSize,float cover){vec2 st=containerSize/imageSize;float aspect=mix(min(st.x,st.y),max(st.x,st.y),cover);return(uv-0.5)*st*(1.0/aspect)+0.5;}";
class vF {
    constructor(e)
    {
        this.parent = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.group = new Gi,
        this.group.name = "texts",
        this.group.visible = !1,
        this.parent.parent.parent.scene.add(this.group),
        this.init()
    }
    async init()
    {
        await Promise.all(Be.links.map((e, t) => {
            const s = new Ui({
                font: "IBMPlexMono-Medium",
                text: e.title,
                width: 10,
                align: "center",
                lineHeight: 1,
                size: 1,
                baseOffset: -.25
            }, {
                uniformsGroups: [he.UBO],
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
                    },
                    uAlpha: {
                        value: 1
                    },
                    uFadePosition: {
                        value: 100
                    },
                    uFadeMargin: {
                        value: 100
                    }
                },
                vertexShader: `
                                    ${Nt}
                                    ${Ue}

                                    attribute vec3 textWeights;
                                    uniform float uShow1;
                                    uniform float uShow2;
                                    uniform float uAlpha;

                                    varying vec2 vUv;
                                    varying float vAlpha;

                                    void main() {
                                        float tr1 = falloff(textWeights.x, 0.0, 1.0, 0.1, clamp(uShow1, 0.0, 1.0));
                                        float tr2 = falloff(textWeights.x, 0.0, 1.0, 1.0, clamp(uShow2, 0.0, 1.0));

                                        vUv = uv;
                                        vUv.x = mod(uv.x + 0.125 * mod(floor((1.0 - tr2) * 5.753), 8.0), 1.0);
                                        vAlpha = tr1 * uAlpha;

                                        gl_Position = projectionMatrix * viewMatrix * billboardModelMatrix() * vec4(position, 1.0);
                                    }
                                `,
                fragmentShader: `
                                        ${ii}
                                        ${Ht}
                                        ${Ue}
                                        ${ae}

                                        uniform sampler2D tMap;
                                        uniform vec3 uColor;
                                        uniform float uFadePosition;
                                        uniform float uFadeMargin;

                                        varying vec2 vUv;
                                        varying float vAlpha;

                                        void main() {
                                            vec2 uv = vUv;
                                            float alpha = vAlpha;
                                            alpha *= msdf(tMap, uv);

                                            alpha *= smoothstep(resolution.x * 0.5 + uFadePosition + uFadeMargin, resolution.x * 0.5 + uFadePosition, gl_FragCoord.x);
                                            alpha *= smoothstep(resolution.x * 0.5 - uFadePosition - uFadeMargin, resolution.x * 0.5 - uFadePosition, gl_FragCoord.x);

                                            gl_FragColor = vec4(uColor, alpha);
                                        }
                                    `,
                depthWrite: !1,
                depthTest: !1,
                blending: pt
            });
            return s._textIndex = t, s.name = "text", s.frustumCulled = !1, s.renderOrder = 9999, this.group.add(s), s.ready
        })),
        this.isReady()
    }
    show(e="all", t=0, s=1)
    {
        this.group.visible = !0,
        this.group.children.forEach((n, r) => {
            (e === "all" || e === r) && (re.set(n.material.uniforms.uAlpha, {
                value: 1,
                overwrite: !0
            }), re.fromTo(n.material.uniforms.uShow1, {
                value: 0
            }, {
                delay: t,
                value: 1,
                duration: .4 * s,
                ease: "sine.out",
                overwrite: !0
            }), re.fromTo(n.material.uniforms.uShow2, {
                value: 0
            }, {
                delay: t,
                value: 1,
                duration: .75 * s,
                ease: "sine.out",
                overwrite: !0
            }))
        })
    }
    hide(e="all", t=0, s=1)
    {
        this.group.children.forEach((n, r) => {
            (e === "all" || e === r) && (re.to(n.material.uniforms.uShow2, {
                delay: t,
                value: 0,
                duration: .15 * s,
                ease: "none",
                overwrite: !0
            }), re.to(n.material.uniforms.uAlpha, {
                delay: t * 1.5,
                value: 0,
                duration: .15 * s,
                overwrite: !0,
                ease: "power2.out",
                onComplete: () => {
                    this.group.visible = !1
                }
            }))
        })
    }
    update()
    {
        Si.positionUI({
            camera: this.parent.parent.parent.scene.camera,
            mesh: this.group,
            x: q.screen.width * .5,
            y: this.parent.bottomPosition,
            width: 25,
            height: 25
        });
        const e = this.parent.mobile ? 6 : this.parent.small ? 7 : 10,
            t = this.group.children.length,
            s = this.parent.parent.parent.currentLink,
            n = (s + 1) % t,
            r = s - 1 < 0 ? t - 1 : s - 1,
            a = this.parent.mobile ? .75 : this.parent.small ? .8 : 1,
            o = this.parent.mobile ? 50 : this.parent.small ? 70 : 100,
            l = this.parent.mobile ? 110 : this.parent.small ? 140 : 200,
            c = he.uniforms.resolution.value.x * o / he.uniforms.resolutionUI.value.x,
            h = he.uniforms.resolution.value.x * l / he.uniforms.resolutionUI.value.x;
        this.group.children.forEach((d, u) => {
            const f = u === s || u === n || u === r;
            d.visible = f,
            d.scale.setScalar(a),
            u === s ? d.position.set(0, 0, 0) : u === n ? d.position.set(e, 0, 0) : u === r && d.position.set(-e, 0, 0),
            d.material.uniforms.uFadePosition.value = c,
            d.material.uniforms.uFadeMargin.value = h
        })
    }
}
class xF {
    constructor(e)
    {
        this.parent = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.small = !1,
        this.mobile = !1,
        this.meshMarginTop = 0,
        this.bottomPosition = 0,
        this.init()
    }
    async init()
    {
        const e = new kt;
        this.box = new Ce(e, new fe({
            uniforms: {
                tMap: {
                    value: le.load("ui/visit-datatexture.ktx2", "data")
                },
                tBlocks: {
                    value: le.load("scroll-datatexture.ktx2", "data-repeat")
                },
                uColor: {
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

                                // gl_FragColor = vec4(uColor, 1.0);
                            }
                        `,
            depthWrite: !1,
            depthTest: !1,
            transparent: !0,
            blending: pt
        })),
        this.box.name = "box",
        this.box.frustumCulled = !1,
        this.box.renderOrder = 999,
        this.box.visible = !1,
        this.parent.parent.scene.add(this.box),
        this.interaction = new Er({
            meshes: [this.box],
            camera: this.parent.parent.scene.camera,
            hoverCursor: !0,
            onHover: t => {
                t.action === "hover_in" && (this.show(.75, !0), Q.emit("webgl_play_audio", "ui-long"))
            },
            onClick: t => {
                Q.emit("webgl_ui_particles_clicked"),
                window.open(Be.links[this.parent.parent.currentLink].url, "_blank").focus()
            }
        }),
        this.texts = new vF(this),
        await this.texts.ready,
        this.isReady()
    }
    show(e=1, t=!1, s=!0)
    {
        var r;
        s && (this.box.visible = !0, this.box.material.uniforms.uRand.value = Math.random(), re.fromTo(this.box.material.uniforms.uShow, {
            value: 0
        }, {
            value: 1,
            duration: .3 * e,
            ease: "none",
            overwrite: !0
        })),
        this.interaction.enable();
        const n = t ? this.parent.parent.currentLink : "all";
        (r = this.texts) == null || r.show(n, 0, n !== "all" ? .7 : 1)
    }
    hide()
    {
        var e;
        re.fromTo(this.box.material.uniforms.uShow, {
            value: 1
        }, {
            value: 0,
            duration: .15,
            ease: "power2.out",
            overwrite: !0,
            onComplete: () => {
                this.box.visible = !1
            }
        }),
        this.interaction.disable(),
        (e = this.texts) == null || e.hide("all")
    }
    update()
    {
        var s;
        this.small = q.screen.width < Be.breakpointW || q.screen.height < Be.breakpointH,
        this.mobile = q.screen.width < Be.breakPointMobile || q.screen.height < Be.breakPointMobile,
        this.meshMarginTop = this.mobile ? Be.topMarginMobile : this.small ? Be.topMarginLow : Be.topMargin,
        this.bottomPosition = q.screen.height - this.meshMarginTop - (this.mobile ? 80 : 20);
        const e = this.mobile ? 150 : this.small ? 180 : 220,
            t = e / 3.125;
        Si.positionUI({
            camera: this.parent.parent.scene.camera,
            mesh: this.box,
            x: q.screen.width * .5,
            y: this.bottomPosition,
            width: e,
            height: t
        }),
        (s = this.texts) == null || s.update()
    }
}
class yF {
    constructor(e)
    {
        this.parent = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.group = new Gi,
        this.group.name = "ui",
        this.parent.mesh.add(this.group),
        this.preventChangeLink = !1,
        this.enabled = !1,
        this.init()
    }
    async init()
    {
        await Promise.all([this.createArrows(), this.createBottomLink()]),
        Q.on("webgl_ui_particles_clicked", this.onUIClicked, this),
        Q.on("touch_click", this.onClick, this),
        Q.on("touch_end", this.onTouchEnd, this),
        Q.on("keydown", this.onKeyDown, this),
        this.isReady()
    }
    createArrows()
    {
        return this.arrows = new gF(this), this.arrows.ready
    }
    createBottomLink()
    {
        return this.bottom = new xF(this), this.bottom.ready
    }
    onUIClicked(e)
    {
        this.preventChangeLink = !0,
        Promise.resolve().then(() => Promise.resolve()).then(() => {
            this.preventChangeLink = !1
        })
    }
    onClick(e)
    {
        this.enabled && this.changeLink(e.position11.x < 0 ? -1 : 1)
    }
    onTouchEnd(e)
    {
        this.enabled && Math.abs(e.dragged.x) > 100 && Math.abs(e.swipeVelocity.x) > 1e3 && this.changeLink(e.dragged.x < 0 ? -1 : 1)
    }
    onKeyDown(e)
    {
        this.enabled && (e.key === "ArrowRight" ? this.changeLink(1) : e.key === "ArrowLeft" && this.changeLink(-1))
    }
    changeLink(e=1)
    {
        Promise.resolve().then(() => {
            var s,
                n;
            if (this.preventChangeLink)
                return;
            e === -1 ? this.parent.currentLink = this.parent.currentLink === 0 ? this.parent.vdbs.length - 1 : this.parent.currentLink - 1 : this.parent.currentLink = (this.parent.currentLink + 1) % this.parent.vdbs.length,
            re.fromTo(this.parent.mesh.computationMaterial.uniforms.uAdditionalNoise, {
                value: 1
            }, {
                value: 0,
                duration: .5,
                ease: "power2.inOut",
                overwrite: !0
            }),
            this.parent.mesh.computationMaterial.uniforms.tVolume.value = this.parent.vdbs[this.parent.currentLink],
            this.parent.mesh.computationMaterial.uniforms.uVolumeScale.value = this.parent.vdbScales[this.parent.currentLink],
            this.parent.mesh.computationMaterial.uniforms.uRotation.value = Math.PI * 1.5,
            (s = this.arrows) == null || s.show(e === 1 ? "right" : "left", .75),
            (n = this.bottom) == null || n.show(1, !1, !1),
            Q.emit("webgl_play_audio", "ui-long");
            const t = this.parent.scene.floor.additionalTime + 4 * -e;
            re.to(this.parent.scene.floor, {
                additionalTime: t,
                duration: 3,
                ease: "power4.out",
                overwrite: !0
            }),
            this.parent.soundControl.splatTargetVelocity += 1
        })
    }
    update()
    {
        if (this.parent) {
            if (!q.devScene) {
                const e = this.parent.scene.progress;
                e > .64 && e < .9 ? this.enable() : this.disable()
            }
            [this.arrows, this.bottom].forEach(e => e == null ? void 0 : e.update())
        }
    }
    enable()
    {
        var e,
            t;
        this.enabled || (this.enabled = !0, (e = this.arrows) == null || e.show(), (t = this.bottom) == null || t.show(), Q.emit("webgl_play_audio", "ui-long"))
    }
    disable()
    {
        var e,
            t;
        this.enabled && (this.enabled = !1, this.preventChangeLink = !1, (e = this.arrows) == null || e.hide(), (t = this.bottom) == null || t.hide(), this.parent.scene.progress < this.parent.scene.finalScrollAutocenter && Q.emit("webgl_play_audio", "ui-long"))
    }
}
class _F {
    constructor(e)
    {
        this.parent = e,
        this.init()
    }
    init()
    {
        const e = new GA(.27, 0);
        this.mesh = new Ce(e, new qy),
        this.mesh.position.set(0, -9.785, 0),
        this.mesh.updateMatrixWorld(),
        this.interaction = new Er({
            camera: this.parent.scene.camera,
            meshes: [this.mesh],
            onMove: this.onMouseMove,
            onHover: this.onMouseHover,
            ctx: this
        }),
        this.splatPosition = new b,
        this.splatLastPosition = new b,
        this.splatLastMoveTime = 0,
        this.splatLastRenderTime = 0,
        this.splatTargetVelocity = 0,
        this.splatVelocity = 0,
        this.splatHovered = !1
    }
    onMouseMove(e)
    {
        const t = e.interactions[0];
        t && this.splatPosition.copy(t.point)
    }
    onMouseHover(e)
    {
        this.splatHovered = !0
    }
    update(e=0)
    {
        if (e > 0 ? this.interaction.enable() : this.interaction.disable(), Fe.time - this.splatLastRenderTime < .015)
            return;
        this.splatLastRenderTime = Fe.time;
        let t = this.splatPosition.distanceTo(this.splatLastPosition);
        const s = Fe.time - this.splatLastMoveTime;
        t > 0 && (this.splatLastMoveTime = Fe.time),
        (s > .15 || this.splatHovered || t > .3) && (this.splatLastPosition.copy(this.splatPosition), t = 0),
        this.splatHovered = !1,
        this.splatTargetVelocity += t * 4,
        this.splatTargetVelocity *= .97,
        this.splatTargetVelocity = ie.clamp(this.splatTargetVelocity, 0, e),
        this.splatVelocity = ie.lerp(this.splatVelocity, this.splatTargetVelocity, .05),
        this.splatVelocity = ie.clamp(this.splatVelocity, 0, e),
        this.splatLastPosition.copy(this.splatPosition),
        this.parent.scene._particlesVolume = .04 * e + this.splatVelocity * .21
    }
}
class wF {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.cubeSize = .65,
        this.particles = 150 * 1e3,
        this.fluidSim = new $U({
            borders: !1,
            simRes: 128,
            dyeRes: 128,
            curlStrength: 0,
            splatRadius: .22,
            splatForce: 35,
            pressureIterations: 2,
            densityDissipation: .88,
            velocityDissipation: .98,
            pressureDissipation: .86,
            splatRadiusVelocity: !1,
            renderEvent: !1
        }),
        this.fluidSim.disable(),
        this.currentLink = 0,
        this.vdbs = [],
        this.vdbScales = Be.links.map(t => t.scale),
        this.soundControl = new _F(this),
        this.init()
    }
    async init()
    {
        const loadVol = async (vdbName) => {
            if (vdbName.endsWith('.bin')) {
                try {
                    const res = await fetch(`/assets/volumes/${vdbName}`);
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const buf = await res.arrayBuffer();
                    const data = new Float32Array(buf);
                    console.log(`[BIN Loader] Successfully loaded ${vdbName}, size: ${data.length} floats`);
                    const tex = new DA(data, 64, 64, 64);
                    tex.format = wt;
                    tex.type = Lt;
                    tex.minFilter = _t;
                    tex.magFilter = _t;
                    tex.unpackAlignment = 1;
                    tex.needsUpdate = true;
                    return tex;
                } catch (err) {
                    console.error("[BIN Loader Error]", err);
                    return le.load(`volumes/peachesbody_64.ktx2`, "3d-data");
                }
            }
            return le.load(`volumes/${vdbName}.ktx2`, "3d-data");
        };
        const e = await loadVol(Be.links[0].vdb);
        this.vdbs.push(e);
        for (let l = 1; l < Be.links.length; l++)
            this.vdbs.push(await loadVol(Be.links[l].vdb));
        const t = ie.getTextureSizeParticles(this.particles),
            s = new Float32Array(t * t * 4);
        for (let l = 0; l < this.particles; l++)
            s[l * 4 + 0] = ie.fit(Math.random(), 0, 1, -this.cubeSize * .5, this.cubeSize * .5),
            s[l * 4 + 1] = ie.fit(Math.random(), 0, 1, -this.cubeSize * .5, this.cubeSize * .5),
            s[l * 4 + 2] = ie.fit(Math.random(), 0, 1, -this.cubeSize * .5, this.cubeSize * .5),
            s[l * 4 + 3] = Math.random();
        const n = new Hi(s, t, t, wt, Lt);
        n.needsUpdate = !0;
        const r = new Hi(new Float32Array(t * t * 4), t, t, wt, Lt);
        r.needsUpdate = !0;
        const a = new Hi(s.slice(), t, t, wt, Lt);
        a.needsUpdate = !0;
        const o = new b(-.75, 1, -.1);
        this.mesh = new gE({
            count: this.particles,
            geometry: "points",
            material: new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tTexture1: {
                        value: null
                    },
                    tTexture2: {
                        value: null
                    },
                    uColorInitial: {
                        value: new Z("#b5d5ff")
                    },
                    uColorLight: {
                        value: new Z("#bdc6d4")
                    },
                    uColorDark: {
                        value: new Z("#222b42")
                    },
                    uColorFast: {
                        value: new Z("#d7ebfa")
                    },
                    uSize: {
                        value: 10
                    },
                    uLightPos: {
                        value: o
                    },
                    uVisible: {
                        value: 0
                    },
                    uAlpha: {
                        value: 1
                    },
                    uInitialGlow: {
                        value: 0
                    }
                },
                vertexShader: `
                                    ${ae}

                                    attribute vec4 rand;
                                    attribute vec2 texuv;
                                    uniform sampler2D tTexture1;
                                    uniform sampler2D tTexture2;

                                    uniform float uSize;

                                    varying float vShadow;
                                    varying float vVel;
                                    varying float vY;

                                    void main() {
                                        vec4 posData = texture2D(tTexture1, texuv);
                                        vec4 velData = texture2D(tTexture2, texuv);

                                        vec3 pos = posData.xyz;
                                        vec4 vPos = modelViewMatrix * vec4(pos, 1.0);
                                        float size = uSize;

                                        vShadow = posData.w;
                                        vVel = velData.w;
                                        vY = posData.y;

                                        gl_Position = projectionMatrix * vPos;
                                        gl_PointSize = size / length(vPos.xyz) * (resolution.y / 1300.0);
                                    }
                                `,
                fragmentShader: `
                                    ${ae}
                                    ${Zo}
                                    ${Ht}
                                    ${yd}
                                    ${AF}

                                    uniform vec3 uColorLight;
                                    uniform vec3 uColorDark;
                                    uniform vec3 uColorInitial;
                                    uniform vec3 uColorFast;

                                    uniform vec3 uLightPos;

                                    uniform float uVisible;
                                    uniform float uAlpha;
                                    uniform float uInitialGlow;

                                    varying float vShadow;
                                    varying float vVel;
                                    varying float vY;

                                    void main() {
                                        float alpha = step(length(gl_PointCoord.xy - 0.5), 0.5) * uVisible;
                                        if (alpha < 0.001) discard;

                                        // calculate normal
                                        vec2 uv = 2.0 * gl_PointCoord.xy - 1.0;
                                        vec3 n = vec3(uv, sqrt(1.0 - clamp(dot(uv, uv), 0.0, 1.0)));
                                        n.y = 1.0 - n.y;

                                        // calculate light direction
                                        float lightShadow = max(0.0, dot(normalize(rotateY(3.1416) * uLightPos), normalize(n)));
                                        float ramp = lightShadow * vShadow;

                                        // base color
                                        vec3 color = mix(uColorDark, uColorLight, ramp);

                                        // highlight color for velocity
                                        color = mix(color, uColorFast, pow(fit(vVel, 0.003, 0.005, 0.0, 1.0), 2.0));

                                        // poor's man motion blur
                                        alpha *= max(uInitialGlow, pow(fit(vVel, 0.002, 0.007, 1.0, 0.0), 2.0) * 0.5 + 0.5);

                                        // we do a blending trick here. the initial hidden state requires: alpha 0, uInitialGlow 1 and color white
                                        // alpha must be animated first and the color used will be
                                        vec3 fadeInColor = mix(vec3(1.0), uColorInitial, linearstep(0.0, 1.0, uAlpha));
                                        color = mix(color, fadeInColor, uInitialGlow);

                                        gl_FragColor = vec4(clamp(color, 0.0, 1.0), alpha * uAlpha);
                                    }
                                `,
                depthTest: !0,
                depthWrite: !0,
                transparent: !0,
                blending: cy,
                blendEquation: ar,
                blendDst: hy,
                blendSrc: Ou
            })
        }, {
            textures: 2,
            initialTextures: [n, r],
            material: new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tTexture1: {
                        value: null
                    },
                    tTexture2: {
                        value: null
                    },
                    tOrig: {
                        value: a
                    },
                    tVel: this.fluidSim.velUniform,
                    uViewMatrix: {
                        value: new De
                    },
                    uModelMatrix: {
                        value: new De
                    },
                    uProjMatrix: {
                        value: new De
                    },
                    uRotation: {
                        value: 0
                    },
                    uCubeSize: {
                        value: this.cubeSize
                    },
                    tVolume: {
                        value: this.vdbs[this.currentLink]
                    },
                    uVolumeScale: {
                        value: this.vdbScales[0]
                    },
                    uLightPos: {
                        value: o
                    },
                    uInteractForce: {
                        value: 1
                    },
                    uAdditionalNoise: {
                        value: 0
                    },
                    uShowNoise: {
                        value: 0
                    }
                },
                vertexShader: `
                                    attribute vec4 rand;
                                    varying vec4 vRand;
                                    void main() {
                                        vRand = rand;
                                        gl_Position = vec4(position, 1.0);
                                    }
                                `,
                fragmentShader: `

                                    varying vec4 vRand;

                                    #define outPos pc_fragColor
                                    uniform sampler2D tTexture1;

                                    layout(location = 1) out highp vec4 outVel;
                                    uniform sampler2D tTexture2;

                                    uniform sampler2D tOrig;
                                    uniform sampler2D tVel;

                                    uniform mat4 uProjMatrix;
                                    uniform mat4 uViewMatrix;
                                    uniform mat4 uModelMatrix;

                                    uniform float uCubeSize;
                                    uniform vec3 uLightPos;
                                    uniform float uRotation;
                                    uniform float uAdditionalNoise;
                                    uniform float uShowNoise;
                                    uniform float uInteractForce;

                                    #ifdef GL_FRAGMENT_PRECISION_HIGH
                                        precision highp sampler3D;
                                    #else
                                        precision mediump sampler3D;
                                    #endif
                                    uniform sampler3D tVolume;
                                    uniform float uVolumeScale;

                                    ${ae}
                                    ${pF}
                                    ${mF}
                                    ${yd}

                                    void main() {
                                        ivec2 uv = ivec2(gl_FragCoord.xy);
                                        vec4 currentPos = texelFetch(tTexture1, uv, 0);
                                        vec4 currentVel = texelFetch(tTexture2, uv, 0);
                                        float positionLimit = uCubeSize * 0.5;

                                        // constant rotation
                                        mat3 rotMatrix = rotateY(uRotation);

                                        // sample volume
                                        vec3 samplePos = rotMatrix * (currentPos.xyz / uCubeSize) * uVolumeScale + 0.5;

                                        vec4 volData = texture(tVolume, samplePos);
                                        vec3 grad = normalize(volData.rgb * 2.0 - 1.0) * rotMatrix;
                                        float dist = (volData.a * 2.0 - 1.0) * 2.0;

                                        // velocity

                                        // fluid sim interaction
                                        float pushForce = 0.0005;
                                        vec4 wPos = uModelMatrix * vec4(currentPos.xyz, 1.0);
                                        vec4 vPos = uViewMatrix * wPos;
                                        vec4 posProjected = uProjMatrix * vPos;
                                        vec2 uvScreen = (posProjected.xy / posProjected.w + 1.0) * 0.5;
                                        vec3 vel = texture2D(tVel, uvScreen).xyz;
                                        vec3 up = vec3(uViewMatrix[0][1], uViewMatrix[1][1], uViewMatrix[2][1]);
                                        vec3 right = vec3(uViewMatrix[0][0], uViewMatrix[1][0], uViewMatrix[2][0]);
                                        vec3 disp = right * vel.x + up * vel.y;
                                        currentVel.xyz += disp * pushForce * dtRatio * uInteractForce;
                                        float invFluidStrength = 1.0 - length(vel) * 0.65 * uInteractForce;

                                        float additionalNoise = max(uAdditionalNoise, uShowNoise);

                                        // add curl noise
                                        float force1 = 0.0002 * (0.7 + 0.3 * vRand.z) + 0.0004 * additionalNoise;
                                        currentVel.xyz += BitangentNoise4D(vec4((currentPos.xyz) * 7.0, time * (1.0 + 0.7 * vRand.y))) * force1 * dtRatio;

                                        // towards origanl position
                                        vec4 origPos = texelFetch(tOrig, uv, 0);
                                        vec3 toOrig = origPos.xyz - currentPos.xyz;
                                        currentVel.xyz += (origPos.xyz - currentPos.xyz) * 0.001 * dtRatio * invFluidStrength;

                                        // towards the surface
                                        float force2 = 0.0015 * (0.7 + 0.3 * vRand.w);
                                        float signForce = mix(0.0, -0.3, sign(dist) + 1.0);
                                        currentVel.xyz += grad * force2 * signForce * dtRatio * invFluidStrength;

                                        // friction
                                        currentVel.xyz *= frictionFPS(0.9, dtRatio);

                                        // position

                                        // add vel to position
                                        currentPos.xyz += currentVel.xyz * dtRatio;

                                        // clamp position to a cube -> switch to cylinder
                                        currentPos.y = clamp(currentPos.y, -0.34, 0.35);
                                        currentPos.xz = normalize(currentPos.xz) * clamp(length(currentPos.xz), 0.0, 0.275);

                                        // https://developer.nvidia.com/gpugems/gpugems/part-iii-materials/chapter-16-real-time-approximations-subsurface-scattering
                                        vec3 lightPos = normalize(uLightPos);
                                        float wrap = 0.25;
                                        float dp = dot(lightPos, grad);
                                        float wrapDiffuse = max(0.0, (dp + wrap) / (1.0 + wrap));

                                        // bounce
                                        dp = -dp;
                                        wrapDiffuse += max(0.0, dp) * 0.1;

                                        // particles inside the volume are dark
                                        // currentPos.a = lerpFPS(currentPos.a, mix(wrapDiffuse * 0.2, wrapDiffuse, smoothstep(-0.05, -0.001, dist)), 0.2, dtRatio);
                                        float targetShadow = mix(wrapDiffuse * 0.2, wrapDiffuse, smoothstep(-0.05, -0.001, dist));
                                        currentPos.a = mix(targetShadow, currentPos.a, additionalNoise);

                                        // save the length of the velocity interpolated for emissiviness
                                        currentVel.a = lerpFPS(currentVel.a, length(currentVel.xyz), 0.035, dtRatio);

                                        outVel = currentVel;
                                        outPos = currentPos;
                                    }
                                `
            })
        }),
        this.mesh.name = "volume particles",
        this.mesh.position.set(0, -9.785, 0),
        this.mesh.updateMatrixWorld(),
        this.scene.add(this.mesh),
        this.initializeShape(),
        this.UI = new yF(this),
        await this.UI.ready,
        q.devScene && this.UI.enable(),
        this.scene.beforeRenderCbs.push(this.update.bind(this)),
        this.isReady()
    }
    initializeShape()
    {
        let e = 0;
        const t = () => {
            e += Fe.delta,
            this.mesh.compute(void 0, this.scene, this.scene.camera),
            e > 1e3 && (Q.off("webgl_prerender", t), this.mesh.material.uniforms.uVisible.value = 1)
        };
        Q.on("webgl_prerender", t)
    }
    update()
    {
        var e,
            t;
        if (this.fluidSim.points[0].position.copy($t.get(0).position01), this.fluidSim._update(Fe.time, Fe.delta), this.mesh.computationMaterial.uniforms.uRotation.value -= Fe.delta * 75e-5, !q.devScene) {
            const s = ie.smoothstep(.45, .65, this.scene.progress),
                n = 1 - ie.smoothstep(.8, .93, this.scene.progress);
            this.mesh.computationMaterial.uniforms.uInteractForce.value = s * n,
            (e = this.soundControl) == null || e.update(s * n)
        }
        (t = this.UI) == null || t.update()
    }
}
class EF {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.meshes = [],
        this.init()
    }
    async init()
    {
        const e = await zt.load("smoke_trail.drc"),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tWind: {
                        value: le.load("wind_noise.ktx2", "linear-repeat")
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                varying float vFalloff;
                                varying vec2 vUv;
                                varying vec3 vPos;

                                void main() {
                                    vUv = uv;

                                    vec3 pos = position;
                                    vPos = (modelMatrix * vec4(position, 1.0)).xyz;

                                    // fade in as camera enters igloo
                                    float depth = -(modelViewMatrix * vec4(position, 1.0)).z;
                                    vFalloff = 1.0 - smoothstep(2.0, 15.0, depth);
                                    vFalloff *= smoothstep(0.5, 2.0, depth);

                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}

                                varying float vFalloff;
                                varying vec2 vUv;
                                varying vec3 vPos;

                                uniform sampler2D tWind;

                                void main() {
                                    vec2 uv = vUv * vec2(0.25, 0.5);
                                    uv.x += vPos.z * 0.1;
                                    float t = time * 0.15;

                                    // layer to create organic smoke
                                    float value = texture2D(tWind, uv * 3.0 + vec2(-t, t * 0.7)).r;
                                    value *= texture2D(tWind, uv * 4.0 + vec2(-t, t * 0.7)).r;
                                    value *= texture2D(tWind, uv * 6.0 + vec2(-t, t * 0.7)).r;

                                    // fade at inner and outer part of mesh
                                    float fade = 1.0;
                                    fade *= smoothstep(0.0, 0.2, vUv.y);
                                    fade *= smoothstep(1.0, 0.5, vUv.y);
                                    fade *= 1.0 - abs((vUv.x - 0.5) * 2.0);
                                    // fade *= 1.0 - smoothstep(1.0, 0.3, vUv.y);
                                    value *= fade;

                                    // fade by depth
                                    value *= vFalloff;

                                    // convert to linear(ish)
                                    float alpha = value;
                                    alpha *= 2.75;
                                    alpha = pow(alpha, 3.0);
                                    alpha = min(1.0, alpha);

                                    vec3 color = vec3(0.85, 0.9, 1.0);

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0,
                side: xi,
                depthTest: !1,
                depthWrite: !1
            }),
            s = 3,
            n = 2.5;
        let r = 1.6;
        for (let a = 0; a < s; a++) {
            const o = `mesh${a}`;
            this[o] = new Ce(e, t),
            this[o].name = `smoketrail${a}`,
            this[o].receiveShadow = !1,
            this[o].castShadow = !1,
            this[o].position.y = -r,
            this[o].initialRotation = a * 3.14 * 2 * .25,
            this[o].updateMatrixWorld(!0),
            this[o].renderOrder = s - a,
            r += n,
            this.scene.add(this[o]),
            this.meshes.push(this[o])
        }
        this.isReady()
    }
    update()
    {
        const e = this.scene.timelineAdditional.upRotation * .5;
        this.meshes.forEach(t => {
            t.rotation.y = t.initialRotation + e
        })
    }
}
class CF {
    constructor(e)
    {
        this.options = {
            count: 200,
            shape: "box",
            scale: [3, 8, 3],
            center: [0, 0, 0],
            generateRandomBuffer: !0
        },
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.init()
    }
    init()
    {
        const {count: e, scale: t, center: s, generateRandomBuffer: n} = this.options;
        let r = 0;
        const a = [],
            o = [];
        for (r = 0; r < e; r++) {
            const h = Math.random() * t[0] - t[0] * .5 + s[0],
                d = Math.random() * t[1] - t[1] * .5 + s[1],
                u = Math.random() * t[2] - t[2] * .5 + s[2];
            a.push(h, d, u),
            n && o.push(Math.random(), Math.random(), Math.random())
        }
        const l = new ot;
        l.setAttribute("position", new nt(a, 3)),
        n && l.setAttribute("random", new nt(o, 3));
        const c = new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                uAlpha: {
                    value: 1
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}
                            ${Cg}

                            attribute vec3 random;

                            varying vec3 vWorldPos;
                            varying vec3 vMvPos;
                            varying vec3 vRandom;
                            varying float vFalloff;
                            varying float vAngle;
                            varying float vAlpha;

                            uniform sampler2D tNoise;

                            vec2 rotate(vec2 v, float a) {
                                float s = sin(a);
                                float c = cos(a);
                                mat2 m = mat2(c, s, -s, c);
                                return m * v;
                            }

                            void main() {
                                vRandom = random;
                                vAngle = random.y * 3.14 * 2.0 + mix(0.5, 0.2, random.x);
                                vAngle -= time * mix(0.5, 1.0, random.x * 1.3);

                                vec3 pos = position;

                                float t = time;
                                t *= mix(0.2, 1.0, random.x);

                                pos.y -= mix(0.4, 0.7, fract(random.x + random.z + random.y)) * time;

                                float angle = t * 0.5 + pos.y;
                                pos.x += sin(angle) * 0.4;
                                pos.z += cos(angle) * 0.4;
                                pos.xz = rotate(pos.xz, t * 0.5);


                                pos = treadmill(pos, vec3(3.0, 4.0, 3.0));

                                vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;

                                vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
                                vMvPos = mvPos.xyz;

                                // fade at ends
                                vAlpha = 1.0;
                                vAlpha *= smoothstep(8.0, 0.0, -vWorldPos.y);
                                vAlpha *= smoothstep(0.0, 2.0, -vWorldPos.y);

                                // circular gradient fade
                                vAlpha *= 1.0 - min(1.0, length(vWorldPos.xz) * 0.5);

                                // fade near camera
                                vAlpha *= smoothstep(0.5, 1.0, -vMvPos.z);

                                // fade far from camera
                                vAlpha *= smoothstep(0.0, 2.0, -vMvPos.z);

                                vAlpha *= sin(time + random.x + random.z * 13.0) * 0.5 + 0.5;
                                vAlpha *= 0.3;

                                gl_Position = projectionMatrix * mvPos;
                                // gl_PointSize = resolution.y / mix(75.0, 125.0, random.z);
                                float size = 50.0;
                                gl_PointSize = size / length(mvPos.xyz) * (resolution.y / 1300.0);
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}
                            ${Ue}

                            varying vec3 vWorldPos;
                            varying vec3 vNoise;
                            varying vec3 vMvPos;
                            varying vec3 vRandom;
                            varying float vFalloff;
                            varying float vAngle;
                            varying float vAlpha;

                            uniform sampler2D tNumbers;

                            uniform float uProgress;
                            uniform float uAlpha;

                            vec2 rotate(vec2 v, float a) {
                                float s = sin(a);
                                float c = cos(a);
                                mat2 m = mat2(c, s, -s, c);
                                return m * v;
                            }

                            void main() {
                                vec2 uv = gl_PointCoord.xy;

                                vec3 color = vec3(1.0);
                                float alpha = vAlpha;

                                // circle shape
                                float circularGrad = 1.0 - length(uv - 0.5) * 2.0;
                                alpha *= circularGrad;

                                uv -= 0.5;
                                uv = rotate(uv, vAngle);
                                uv += 0.5;

                                float squish = pow(1.0 - abs(uv.x - 0.5), floor(vRandom.y * 3.0 + 2.0));
                                alpha *= squish;
                                alpha = clamp(alpha, 0.0, 1.0);

                                gl_FragColor = vec4(color, alpha);
                            }
                        `,
            transparent: !0,
            blending: pt,
            depthTest: !1,
            depthWrite: !1
        });
        this.mesh = new Fn(l, c),
        this.mesh.name = "particles",
        this.mesh.renderOrder = 1,
        this.mesh.position.y -= 3.5,
        this.mesh.updateMatrixWorld(!0),
        this.mesh.matrixAutoUpdate = !1,
        this.mesh.receiveShadow = !1,
        this.mesh.castShadow = !1,
        this.mesh.frustumCulled = !1,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class SF {
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
        const t = new Md(1.3, 1.3, 9, 64, 32, !0);
        t.translate(0, -9 * .5, 0),
        t.scale(-1, 1, 1);
        const s = new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                tWind: {
                    value: le.load("wind_noise.ktx2", "linear-repeat")
                }
            },
            vertexShader: `
                            //- edit
                            ${ae}

                            varying float vFalloff;
                            varying vec2 vUv;
                            varying vec3 vPos;

                            void main() {
                                vUv = uv;

                                vec3 pos = position;
                                vPos = pos;

                                // fade in as camera enters igloo
                                vFalloff = 1.0 - clamp(cameraPosition.y - 1.0, 0.0, 4.0) / 4.0;
                                vFalloff = smoothstep(0.0, 1.0, vFalloff);

                                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                            }
                        `,
            fragmentShader: `
                            //- edit
                            ${ae}
                            ${Ue}

                            varying float vFalloff;
                            varying vec2 vUv;
                            varying vec3 vPos;

                            uniform sampler2D tWind;

                            void main() {
                                vec2 uv = vUv * vec2(1.0, 0.25);
                                uv.x += uv.y;
                                float t = time * 0.05;

                                // layer to create organic smoke
                                float value = texture2D(tWind, uv * 3.0 + vec2(-t, t * 0.7)).r;
                                value *= texture2D(tWind, uv * 4.0 + vec2(-t, t * 0.7)).r;
                                value *= texture2D(tWind, uv * 6.0 + vec2(-t, t * 0.7)).r;

                                // fade at inner and outer part of mesh
                                float fade = 1.0;
                                fade *= smoothstep(0.0, 0.2, vUv.y);
                                fade *= smoothstep(1.0, 0.9, vUv.y);
                                // fade *= 1.0 - smoothstep(1.0, 0.3, vUv.y);
                                value *= fade;

                                // convert to linear(ish)
                                float alpha = value;
                                alpha = pow(alpha, 3.0);
                                alpha *= 3.0;
                                // alpha *= vFalloff;

                                vec3 color = vec3(0.85, 0.9, 1.0);
                                // color = vec3(1.0, 0.0, 0.0);
                                // alpha = 1.0;

                                gl_FragColor = vec4(color, alpha);
                            }
                        `,
            transparent: !0,
            blending: pt
        });
        this.mesh = new Ce(t, s),
        this.mesh.name = "tunnel",
        this.mesh.renderOrder = 1,
        this.mesh.position.y = 1,
        this.mesh.updateMatrixWorld(!0),
        this.mesh.visible = !1,
        this.mesh.receiveShadow = !1,
        this.mesh.castShadow = !1,
        this.scene.add(this.mesh),
        this.isReady()
    }
    update()
    {
        const e = this.scene.timelineAdditional.upRotation * .65;
        this.mesh.rotation.y = e,
        this.mesh.rotation.y = e
    }
}
class MF {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.meshes = [],
        this.init()
    }
    async init()
    {
        const e = await zt.load("shattered_ring_smoke.drc"),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tWind: {
                        value: le.load("wind_noise.ktx2", "linear-repeat")
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                varying float vFalloff;
                                varying vec2 vUv;
                                varying vec3 vPos;

                                void main() {
                                    vUv = uv;

                                    vec3 pos = position;
                                    vPos = (modelMatrix * vec4(position, 1.0)).xyz;

                                    // fade in as camera enters igloo
                                    float depth = -(modelViewMatrix * vec4(position, 1.0)).z;
                                    vFalloff = 1.0 - smoothstep(2.0, 4.0, depth);
                                    vFalloff *= smoothstep(0.4, 1.0, depth);

                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}

                                varying float vFalloff;
                                varying vec2 vUv;
                                varying vec3 vPos;

                                uniform sampler2D tWind;

                                void main() {
                                    vec2 uv = vUv * vec2(0.25, 0.5);
                                    uv.x += uv.y;
                                    float t = -time * 0.075;

                                    // layer to create organic smoke
                                    float wind = texture2D(tWind, uv * 3.0 + vec2(-t, t * 0.7)).r;
                                    wind *= texture2D(tWind, uv * 4.0 + vec2(-t, t * 0.7)).r;
                                    wind *= texture2D(tWind, uv * 6.0 + vec2(-t, t * 0.7)).r;

                                    float value = wind;

                                    // fade at inner and outer part of mesh
                                    float fade = 1.0;
                                    fade *= smoothstep(0.3, 0.4, vUv.x);
                                    fade *= smoothstep(0.6, 0.5, vUv.x);
                                    value *= fade;

                                    float glowMask = smoothstep(0.3, 0.45, vUv.x) * smoothstep(0.8, 0.4, vUv.x);
                                    value += glowMask * 0.3;
                                    value += pow(glowMask, 2.0) * wind * 0.2;

                                    // fade by depth
                                    value *= vFalloff;

                                    // convert to linear(ish)
                                    float alpha = value;
                                    alpha *= 1.7;
                                    alpha = pow(alpha, 4.0);
                                    alpha = min(1.0, alpha);

                                    // fade in when scene transitions in
                                    float camFactor = pow(1.0 - clamp(-cameraPosition.z, 0.0, 1.0), 4.0);
                                    alpha *= camFactor;

                                    vec3 color = vec3(0.65, 0.8, 1.0);

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0,
                blending: pt,
                side: xi
            }),
            s = 3,
            n = 2.5;
        let r = 1.6;
        for (let a = 0; a < s; a++) {
            const o = `mesh${a}`;
            this[o] = new Ce(e, t),
            this[o].name = `plasma${a}`,
            this[o].receiveShadow = !1,
            this[o].castShadow = !1,
            this[o].position.y = -r,
            this[o].initialRotation = a * 3.14 * 2 * .25,
            this[o].updateMatrixWorld(!0),
            this[o].renderOrder = s - a,
            r += n,
            this.scene.add(this[o]),
            this.meshes.push(this[o])
        }
        this.isReady()
    }
    update()
    {
        const e = this.scene.timelineAdditional.upRotation * .5;
        this.meshes.forEach(t => {
            t.rotation.y = t.initialRotation + e
        })
    }
}
class bF {
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
        const e = new kt(1, 1),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tTriangles: {
                        value: le.load("igloo/triangles_tiling.ktx2", "srgb-repeat")
                    },
                    tNoise: {
                        value: le.load("clouds_noise.ktx2", "srgb-repeat")
                    },
                    uAlpha: {
                        value: 1
                    },
                    uColor1: {
                        value: new Z("#6a6f7d")
                    },
                    uColor2: {
                        value: new Z("#e1e6f1")
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}
                                ${Nt}
                                ${Ue}

                                attribute float glow;

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vWorldPos;
                                varying float vFalloff;
                                varying float vFalloff2;
                                varying float vFade;
                                varying float vGlow;
                                varying float vDist;
                                varying vec2 vGlowPos;

                                vec2 rotate(vec2 v, float a) {
                                    float s = sin(a);
                                    float c = cos(a);
                                    mat2 m = mat2(c, s, -s, c);
                                    return m * v;
                                }

                                void main() {
                                    vUv = uv;
                                    vGlow = glow;
                                    vPos = position;

                                    vec3 pos = position;
                                    vec3 translation = getMatrixTranslation(modelMatrix);

                                    // rotate based on camera distance
                                    float dist = distance(cameraPosition, translation);

                                    float spinFalloff = falloffsmooth(dist, 8.0, 2.0, 5.0, 0.5);
                                    float spinFalloff2 = falloffsmooth(dist, 10.0, 2.0, 8.0, 0.5);

                                    float firstRingMask = falloff(translation.y, -4.5, -4.51, 0.01, 0.5);

                                    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
                                    float depth = -mvPos.z;
                                    vFalloff = smoothstep(3.5, 2.3, depth);


                                    // falloff = smoothstep(0.0, 1.0, falloff);
                                    // falloff = pow(falloff, 2.0);

                                    // idle rotation
                                    // pos.xy = rotate(pos.xy, -time * 0.1);

                                    float angle1 = spinFalloff * 3.14159 * 0.25 * (1.0 - firstRingMask);
                                    pos.xz = rotate(pos.xz, angle1);

                                    float angle2 = spinFalloff2 * 3.14159 * 0.25 + translation.y * 0.5;
                                    pos.xy = rotate(pos.xy, angle2);

                                    // // fade in as camera enters igloo
                                    // vec3 iglooEntrance = vec3(0.0, 0.0, 1.0);
                                    // vFalloff2 = 1.0 - clamp(cameraPosition.y - 1.0, 0.0, 4.0) / 4.0;
                                    // vFalloff2 = smoothstep(0.0, 1.0, vFalloff2);

                                    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                                    vWorldPos = worldPos.xyz;
                                    vGlowPos = rotate(worldPos.xz, -time * 0.5 + translation.y * 2.2);

                                    gl_Position = projectionMatrix * mvPos;
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}
                                ${_a}
                                ${Zo}

                                varying vec2 vUv;
                                varying vec3 vPos;
                                varying vec3 vWorldPos;
                                varying float vFalloff;

                                uniform sampler2D tTriangles;
                                uniform sampler2D tNoise;

                                void main() {
                                    float alpha = 1.0;

                                    float y = length(vUv - 0.5) * 2.0;

                                    float circleMask = 1.0 - step(0.98, y);
                                    float radialMask = smoothstep(0.5, 1.0, y);
                                    float circleEdgeMask = smoothstep(0.9, 0.85, y);

                                    float noise = texture2D(tNoise, vUv * 0.25 + vec2(vWorldPos.y)).r;
                                    noise *= texture2D(tNoise, vUv * 0.8 + vec2(vWorldPos.y)).r;
                                    noise = sin(noise * 13.0 + time - y * 10.0) * 0.5 + 0.5;
                                    float mask = aastep(0.2, noise) * (1.0 - noise * 0.75);

                                    // float n1 = aastep(0.1, noise) * (1.0 - pow(noise, 2.0));
                                    // alpha = max(alpha, n1);

                                    float triangles = texture2D(tTriangles, vUv * 2.0 + noise * 0.04).r * 4.0;

                                    // shape effect
                                    alpha = triangles * mask;
                                    alpha += pow(mask, 5.0) * 0.5;
                                    alpha += radialMask * 0.5;
                                    alpha *= circleMask;
                                    alpha = min(1.0, alpha);

                                    // clip to circle
                                    alpha *= circleEdgeMask;

                                    alpha *= smoothstep(0.45 - vFalloff * 0.25, 0.75 - vFalloff * 0.3, length(vUv - 0.5));
                                    float camFactor = (1.0 - clamp(-cameraPosition.z * 8.0, 0.0, 1.0));
                                    alpha *= camFactor;

                                    // fade as camera appears
                                    // alpha *= 1.0 - pow(vFalloff, 2.0);

                                    vec3 color = vec3(0.7, 0.8, 1.0);

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0,
                blending: pt,
                depthTest: !1,
                depthWrite: !1
            }),
            s = 3,
            n = 2.5;
        let r = 1.5;
        for (let a = 0; a < s; a++) {
            const o = `mesh${a}`;
            this[o] = new Ce(e, t),
            this[o].name = `ringforcefield${a}`,
            this[o].receiveShadow = !1,
            this[o].castShadow = !1,
            this[o].rotation.x = -3.14159 * .5,
            this[o].position.y = -r,
            this[o].scale.setScalar(.65),
            this[o].updateMatrixWorld(!0),
            this[o].matrixAutoUpdate = !1,
            this[o].renderOrder = s - a,
            r += n,
            this.scene.add(this[o])
        }
        this.isReady()
    }
}
class TF {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.meshes = [],
        this.init()
    }
    async init()
    {
        const e = await zt.load("ceilingsmoke.drc"),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tWind: {
                        value: le.load("wind_noise.ktx2", "linear-repeat")
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                varying float vFalloff;
                                varying vec2 vUv;
                                varying vec3 vPos;

                                void main() {
                                    vUv = uv;

                                    vec3 pos = position;
                                    vPos = position;

                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}

                                varying float vFalloff;
                                varying vec2 vUv;
                                varying vec3 vPos;

                                uniform sampler2D tWind;

                                void main() {
                                    vec2 screenUv = gl_FragCoord.xy / resolution;

                                    vec2 uv = vUv * vec2(0.5, 1.0);
                                    uv.x -= uv.y;
                                    float t = -time * 0.075;

                                    // layer to create organic smoke
                                    float wind = texture2D(tWind, uv * 1.0 + vec2(-t, t * 0.7)).r;
                                    wind *= texture2D(tWind, uv * 2.0 + vec2(-t, t * 0.7)).r;
                                    wind *= texture2D(tWind, uv * 3.0 + vec2(-t, t * 0.7)).r;

                                    float value = wind;

                                    // fade at inner and outer part of mesh
                                    float fade = 1.0;
                                    fade *= smoothstep(0.135, 0.25, vUv.x);
                                    fade *= smoothstep(1.0, 0.3, vUv.x);
                                    value *= fade;

                                    float glowMask = smoothstep(0.3, 0.45, vUv.x) * smoothstep(0.8, 0.4, vUv.x);
                                    // value += glowMask * 0.3;
                                    // value += pow(glowMask, 2.0) * wind * 0.2;

                                    // fade by depth
                                    // value *= vFalloff;

                                    // convert to linear(ish)
                                    float alpha = value;
                                    alpha *= 1.8;
                                    alpha = pow(alpha, 2.0);
                                    alpha += pow(screenUv.x, 2.0) * fade * 0.2;

                                    // inner circle
                                    float innerCircle = smoothstep(0.0, 0.1, vUv.x) * smoothstep(0.4, 0.1, vUv.x);
                                    alpha += innerCircle * fade * 0.4 * screenUv.x;
                                    alpha += innerCircle * wind * screenUv.x;

                                    vec3 color = vec3(0.9, 0.95, 1.0);

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0,
                blending: pt
            });
        this.mesh = new Ce(e, t),
        this.mesh.name = "ceilingsmoke",
        this.mesh.receiveShadow = !1,
        this.mesh.castShadow = !1,
        this.mesh.position.y = -9.4,
        this.mesh.scale.set(2, .1, 2),
        this.mesh.updateMatrixWorld(!0),
        this.mesh.matrixAutoUpdate = !1,
        this.mesh.renderOrder = 2,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class IF {
    constructor(e)
    {
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.meshes = [],
        this.init()
    }
    async init()
    {
        const e = await zt.load("shattered_ring_smoke.drc"),
            t = new fe({
                uniformsGroups: [he.UBO],
                uniforms: {
                    tWind: {
                        value: le.load("wind_noise.ktx2", "linear-repeat")
                    },
                    uAlpha: {
                        value: 0
                    }
                },
                vertexShader: `
                                //- edit
                                ${ae}

                                varying float vFalloff;
                                varying vec2 vUv;
                                varying vec3 vPos;

                                void main() {
                                    vUv = uv;

                                    vec3 pos = position;
                                    vPos = position;

                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                                }
                            `,
                fragmentShader: `
                                //- edit
                                ${ae}
                                ${Ue}

                                varying float vFalloff;
                                varying vec2 vUv;
                                varying vec3 vPos;

                                uniform sampler2D tWind;
                                uniform float uAlpha;

                                void main() {
                                    vec2 screenUv = gl_FragCoord.xy / resolution;

                                    vec2 uv = vUv * vec2(0.5, 1.0);
                                    uv.x -= uv.y;
                                    float t = time * 0.05 + 0.5;

                                    // layer to create organic smoke
                                    float wind = texture2D(tWind, uv * 1.0 + vec2(-t, t * 0.7)).r;
                                    wind *= texture2D(tWind, uv * 2.0 + vec2(-t, t * 0.7)).r;
                                    wind *= texture2D(tWind, uv * 3.0 + vec2(-t, t * 0.7)).r;

                                    float value = wind;

                                    // fade at inner and outer part of mesh
                                    float fade = 1.0;
                                    fade *= smoothstep(0.4, 0.5, vUv.x);
                                    fade *= smoothstep(1.0, 0.4, vUv.x);
                                    value *= fade;

                                    float glowMask = smoothstep(0.3, 0.45, vUv.x) * smoothstep(0.8, 0.4, vUv.x);
                                    // value += glowMask * 0.3;
                                    // value += pow(glowMask, 2.0) * wind * 0.2;

                                    // fade by depth
                                    // value *= vFalloff;

                                    // convert to linear(ish)
                                    float alpha = value;
                                    alpha *= 3.0;
                                    alpha = pow(alpha, 3.0);
                                    alpha += pow(screenUv.x, 2.0) * fade * 0.15;

                                    // animation
                                    alpha *= uAlpha;

                                    vec3 color = vec3(0.9, 0.95, 1.0);

                                    gl_FragColor = vec4(color, alpha);
                                }
                            `,
                transparent: !0,
                blending: pt
            });
        this.mesh = new Ce(e, t),
        this.mesh.name = "groundsmoke",
        this.mesh.receiveShadow = !1,
        this.mesh.castShadow = !1,
        this.mesh.position.y = -10.17,
        this.mesh.scale.set(5, .1, 5),
        this.mesh.updateMatrixWorld(!0),
        this.mesh.renderOrder = 0,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
class BF {
    constructor(e)
    {
        this.options = {
            count: 60,
            shape: "box",
            scale: [2.5, .5, 2.5],
            center: [0, 0, 0]
        },
        this.scene = e,
        this.ready = new Promise(t => {
            this.isReady = t
        }),
        this.init()
    }
    init()
    {
        const {count: e, scale: t, center: s} = this.options;
        let n = 0;
        const r = [],
            a = [];
        for (n = 0; n < e; n++) {
            const c = Math.random() * t[0] - t[0] * .5 + s[0],
                h = Math.random() * t[1] - t[1] * .5 + s[1],
                d = Math.random() * t[2] - t[2] * .5 + s[2];
            r.push(c, h, d),
            a.push(Math.random(), Math.random(), Math.random())
        }
        const o = new ot;
        o.setAttribute("position", new nt(r, 3)),
        o.setAttribute("random", new nt(a, 3));
        const l = new fe({
            uniformsGroups: [he.UBO],
            uniforms: {
                uAlpha: {
                    value: 1
                }
            },
            vertexShader: `
                        ${ae}

                        attribute vec3 random;

                        varying vec2 vUv;
                        varying float vLightFalloff;

                        uniform float uRotation;

                        void main() {
                            vUv = uv;
                            float t = time * 0.1;
                            vec3 pos = position;
                            pos.x += sin(t * 0.4 + position.z * 2.5) * 0.75;
                            pos.y += sin(t * 0.2 + position.x * 2.5) * 0.75;
                            pos.z += sin(t * 0.2 + position.y * 2.5) * 0.75;

                            // pos.x = max(0.22, pos.x);
                            // pos.z = max(0.22, pos.z);

                            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

                            // scale larger with screen gradient
                            vec2 ndc = gl_Position.xy / gl_Position.w;
                            float size = mix(7.0, 12.0, random.x);
                            gl_PointSize = size * resolution.y * 0.002;

                            // random flicker
                            vLightFalloff = sin(time * 1.8 + random.y * 22.43) * 0.4 + 0.6;
                            vLightFalloff *= smoothstep(0.2, 0.24, length(pos.xz));
                            vLightFalloff *= 1.25;
                        }
                    `,
            fragmentShader: `
                        ${ae}

                        varying vec2 vUv;
                        varying float vLightFalloff;

                        uniform float uAlpha;

                        void main() {
                            vec2 uv = gl_PointCoord.xy;
                            uv.y = 1.0 - uv.y;

                            float circularGrad = 1.0 - clamp(length(uv - 0.5) * 2.0, 0.0, 1.0);
                            circularGrad *= pow(uv.x, 2.0);
                            circularGrad = pow(circularGrad, 2.0);

                            vec3 color = vec3(1.0);
                            float alpha = circularGrad * vLightFalloff;
                            alpha *= uAlpha;

                            gl_FragColor = vec4(color, alpha);
                        }
                    `,
            transparent: !0,
            blending: pt
        });
        this.mesh = new Fn(o, l),
        this.mesh.name = "ambientparticles",
        this.mesh.renderOrder = 15,
        this.mesh.position.y = -9.61,
        this.mesh.updateMatrixWorld(!0),
        this.mesh.receiveShadow = !1,
        this.mesh.castShadow = !1,
        this.mesh.frustumCulled = !1,
        this.scene.add(this.mesh),
        this.isReady()
    }
}
var PF = "float luma(float color){return color;}float luma(vec3 color){return dot(color,vec3(0.299,0.587,0.114));}float luma(vec4 color){return dot(color.rgb,vec3(0.299,0.587,0.114));}vec3 rgb2hsv(vec3 c){vec4 K=vec4(0.0,-1.0/3.0,2.0/3.0,-1.0);vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));float d=q.x-min(q.w,q.y);float e=1.0e-10;return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x);}vec4 rgb2hsv(vec4 c){return vec4(rgb2hsv(c.rgb),c.a);}vec3 hsv2rgb(vec3 c){vec3 rgb=clamp(abs(mod(c.x*6.+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);return c.z*mix(vec3(1.),rgb,c.y);}vec4 hsv2rgb(vec4 c){return vec4(hsv2rgb(c.rgb),c.a);}vec4 rgbshift(sampler2D tex,vec2 uv,float angle,float amount){vec2 offset=amount*vec2(cos(angle),sin(angle));vec4 cr=texture2D(tex,uv+offset);vec4 cga=texture2D(tex,uv);vec4 cb=texture2D(tex,uv-offset);return vec4(cr.r,cga.g,cb.b,cga.a);}vec3 colorpalette(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(6.28318*(c*t+d));}vec4 colorpalette(float t,vec4 a,vec4 b,vec4 c,vec4 d){return a+b*cos(6.28318*(c*t+d));}float brightnessContrast(float color,float brightness,float contrast){return(color-0.5)*contrast+0.5+brightness;}vec3 brightnessContrast(vec3 color,float brightness,float contrast){return(color-0.5)*contrast+0.5+brightness;}vec4 brightnessContrast(vec4 color,float brightness,float contrast){return vec4(brightnessContrast(color.rgb,brightness,contrast),color.a);}vec3 saturation(vec3 color,float adjustment){const vec3 W=vec3(0.2125,0.7154,0.0721);vec3 intensity=vec3(dot(color,W));return mix(intensity,color,adjustment);}vec4 saturation(vec4 color,float adjustment){return vec4(saturation(color.rgb,adjustment),color.a);}vec3 vibrance(vec3 color,float v){float average=(color.r+color.g+color.b)/3.0;float mx=max(color.r,max(color.g,color.b));float amt=(mx-average)*(-v*3.0);return mix(color.rgb,vec3(mx),amt);}vec4 vibrance(vec4 color,float v){return vec4(vibrance(color.rgb,v),color.a);}";
class DF extends fe {
    constructor()
    {
        super({
            uniformsGroups: [he.UBO],
            uniforms: {
                tDiffuse: {
                    value: null
                },
                tBlue: {
                    value: le.load("noises/blue-8-128-rgb.ktx2", "data-repeat")
                },
                tScroll: {
                    value: le.load("scroll-datatexture.ktx2", "data-repeat")
                },
                uBlueOffset: {
                    value: new H
                },
                uGradientAlpha: {
                    value: 0
                },
                uRingProximity: {
                    value: 0
                },
                uSquareAttr: {
                    value: new b
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
                            ${_a}
                            ${Uc}
                            ${PF}
                            ${Rc}

                            uniform sampler2D tDiffuse;

                            uniform sampler2D tBlue;
                            uniform vec2 uBlueOffset;

                            uniform sampler2D tScroll;
                            uniform float uRingProximity;
                            uniform vec3 uSquareAttr;

                            varying vec2 vUv;

                            void main() {
                                vec2 uv = vUv;
                                vec3 scene;

                                vec3 noise = getNoise(tBlue, gl_FragCoord.xy, uBlueOffset).rgb;

                                if (uRingProximity > 0.0) {

                                    // main distortion
                                    uv -= 0.5;
                                    uv.x *= aspect;
                                    float angle = atan(uv.y, uv.x);
                                    float dist = length(uv);

                                    const float bluramount = 0.3;

                                    float angle1 = angle + bluramount * (noise.r - 0.5) * uRingProximity;
                                    vec2 newUv1 = vec2(cos(angle1), sin(angle1)) * dist;
                                    newUv1.x /= aspect;
                                    newUv1 += 0.5;

                                    // squares
                                    float dispSquares = texture2D(tScroll, newUv1 * 1.5 + uSquareAttr.rg).g * 2.0 - 1.0;
                                    newUv1 += dispSquares * 0.01 * uSquareAttr.b * uRingProximity;

                                    // read color
                                    scene = texture2D(tDiffuse, newUv1).rgb;

                                    // highlight only when not already white
                                    if (length(scene) < length(vec3(1.0))) {
                                        scene = rgb2hsv(scene);
                                        scene.g += 0.05 * uRingProximity;
                                        scene.b += 0.075 * uRingProximity;
                                        scene = hsv2rgb(scene);
                                    }

                                } else {
                                    scene = texture2D(tDiffuse, uv).rgb;
                                }

                                vec3 sceneColor = scene;

                                // glare
                                float diagonalGradient = pow(vUv.x * vUv.y, 2.0);
                                sceneColor += diagonalGradient * (sinenoise1(vec3(vUv.x * aspect, vUv.y, time * 0.5)) * 0.4 + 0.4) * vec3(0.8, 0.9, 1.0) * noise.b * 2.0;

                                gl_FragColor = vec4(clamp(sceneColor, 0.0, 1.0), 1.0);
                            }
                        `
        }),
        Q.on("webgl_render", () => {
            this.uniforms.uBlueOffset.value.set(Math.random() * 46.23, Math.random() * 12.5)
        })
    }
}
function RF(i, e) {
    const t = new Eg(new DF);
    t.isEntryColorCorrectionPass = !0,
    e.addPass(t),
    i.___composerPass = t
}
const $x = new b;
class UF extends Jo {
    constructor(e={})
    {
        super({
            orbit: q.devScene && !q.query.playAnimation
        }),
        this.controller = e.mainController,
        this.progress = 0,
        this.height = 5.5,
        this._isSceneVisible = !1,
        this.initialScrollAutocenter = .2,
        this.finalScrollAutocenter = .76,
        this.timelinePosition = new b,
        this.timelineTarget = new b,
        this.timelineDisplacement = new H,
        this.timelineDisplacementTar = new H,
        this.timelineDisplacementRot = {
            value: 0
        },
        this.timelineAdditional = {
            upRotation: 0,
            upOriginal: 0
        },
        this.lastProgress = 0,
        this.direction = 1,
        this._needsReset = !1,
        this._portalsVolume = 0,
        this._particlesVolume = 0,
        this.composerReady = new Promise(t => {
            this.isComposerReady = t
        }),
        this.init()
    }
    get isSceneVisible()
    {
        return this._isSceneVisible
    }
    set isSceneVisible(e)
    {
        var s,
            n,
            r,
            a;
        const t = this._isSceneVisible !== e;
        this._isSceneVisible = e,
        t && (e ? (this.lastProgress = this.progress, this.direction = 1) : ((n = (s = this.containerparticles) == null ? void 0 : s.UI) == null || n.disable(), (a = (r = this.containerparticles) == null ? void 0 : r.soundControl) == null || a.interaction.disable(), this._portalsVolume = 0, Q.emit("webgl_set_audio_volume", "portals", this._portalsVolume), this._particlesVolume = 0, Q.emit("webgl_set_audio_volume", "particles", this._particlesVolume)))
    }
    async init()
    {
        this.cameraOptions(),
        this.renderOptions(),
        await Promise.all([this.createRoomRing(), this.createRingForcefield(), this.createRings(), this.createContainerParticles(), this.createFloor(), this.createLightRoom(), this.createForceField(), this.createTextCylinder(), this.createSmokeTrail(), this.createSnowParticles(), this.createTunnel(), this.createPlasma(), this.createCeilingSmoke(), this.createGroundSmoke(), this.createAmbientParticles()]),
        await this.createTimeline(),
        this.resize(),
        Q.on("resize", this.resize, this),
        q.devScene ? (this.debug(), this.camera.displacement.position.setScalar(0), this.camera.lerpPosition = 0, this.camera.shake.setScalar(0), q.query.playAnimation && (this.beforeRenderCbs.push(this.update.bind(this)), this.timeline.play(0))) : this.beforeRenderCbs.push(this.update.bind(this)),
        this.isReady()
    }
    cameraOptions()
    {
        this.camera.fov = 25,
        this.camera.updateProjectionMatrix(),
        this.camera.basePosition.set(0, 5.5, 0),
        this.camera.baseTarget.set(0, 0, 0),
        this.camera.displacement.position.set(.07, .025),
        this.camera.lerpPosition = .02,
        this.camera.lerpRotation = .02,
        this.camera.lerpTarget = .015,
        this.camera.shake.setScalar(.02),
        this.camera.shakeSpeed.setScalar(.25)
    }
    renderOptions()
    {
        Promise.resolve().then(() => {
            RF(this, this.composer),
            this.isComposerReady();
            const e = q.devScene ? this.composer : he.composer;
            e.__hasBloomPass || (e.__hasBloomPass = !0, e.addPass(new Fd().addBloom({
                debug: q.devScene,
                levels: 6,
                luminanceThreshold: 0,
                intensity: 1,
                radius: .85
            })))
        })
    }
    async createAmbientParticles()
    {
        this.ambientparticles = new BF(this),
        await this.ambientparticles.ready
    }
    async createRoomRing()
    {
        this.roomring = new oF(this),
        await this.roomring.ready
    }
    async createGroundSmoke()
    {
        this.groundsmoke = new IF(this),
        await this.groundsmoke.ready
    }
    async createCeilingSmoke()
    {
        this.ceilingsmoke = new TF(this),
        await this.ceilingsmoke.ready
    }
    async createRingForcefield()
    {
        this.ringforcefield = new bF(this),
        await this.ringforcefield.ready
    }
    async createPlasma()
    {
        this.plasma = new MF(this),
        await this.plasma.ready
    }
    async createTunnel()
    {
        this.tunnel = new SF(this),
        await this.tunnel.ready
    }
    async createSnowParticles()
    {
        this.snowparticles = new CF(this),
        await this.snowparticles.ready
    }
    async createSmokeTrail()
    {
        this.smoketrail = new EF(this),
        await this.smoketrail.ready
    }
    async createRings()
    {
        this.rings = new cF(this),
        await this.rings.ready
    }
    async createContainerParticles()
    {
        this.containerparticles = new wF(this),
        await this.containerparticles.ready
    }
    async createFloor()
    {
        this.floor = new hF(this),
        await this.floor.ready
    }
    async createForceField()
    {
        this.forcefield = new uF(this),
        await this.forcefield.ready
    }
    async createLightRoom()
    {
        this.lightroom = new dF(this),
        await this.lightroom.ready
    }
    async createTextCylinder()
    {
        this.textcylinder = new fF(this),
        await this.textcylinder.ready
    }
    async createTimeline()
    {
        this.timelinePosition.set(0, 1.5, -2),
        this.timelineTarget.set(0, -2.5, -1),
        await this.composerReady;
        const e = this.___composerPass.material.uniforms;
        let t = this.camera.fov;
        this.timeline = re.timeline({
            paused: !0,
            onUpdate: () => {
                this.camera.fov !== t && (t = this.camera.fov, this.camera.updateProjectionMatrix()),
                this.rings.mesh0.visible = this.progress < .34,
                this.rings.mesh1.visible = this.progress < .43,
                this.rings.mesh2.visible = this.progress < .52,
                this.ringforcefield.mesh0.visible = this.progress > .1 && this.progress < .34,
                this.ringforcefield.mesh1.visible = this.progress > .25 && this.progress < .43,
                this.ringforcefield.mesh2.visible = this.progress > .36 && this.progress < .52,
                this.plasma.mesh0.visible = this.progress > .06 && this.progress < .34,
                this.plasma.mesh1.visible = this.progress > .25 && this.progress < .43,
                this.plasma.mesh2.visible = this.progress > .35 && this.progress < .52,
                this.smoketrail.mesh0.visible = this.progress > 0 && this.progress < .37,
                this.smoketrail.mesh1.visible = this.progress > 0 && this.progress < .47,
                this.smoketrail.mesh2.visible = this.progress > 0 && this.progress < .56,
                this.tunnel.mesh.visible = this.progress < .52,
                this.snowparticles.mesh.visible = this.progress < .52,
                this.roomring.mesh.visible = this.progress > .53;
                let n = 1 / 0;
                [.28, .375, .465].forEach(r => {
                    const a = Math.abs(this.progress - r);
                    n = Math.min(n, a)
                }),
                this._portalsVolume = ie.ease(ie.fit(n, 0, .04, 1, 0), "power2.out") * .9
            }
        }),
        this.timeline.to(this.timelinePosition, {
            z: 0,
            x: 0,
            duration: 2.5,
            ease: "power2.out"
        }, 0),
        this.timeline.to(this.timelineTarget, {
            z: 0,
            x: 0,
            duration: 2.5,
            ease: "power2.out"
        }, 0),
        this.timeline.to(this.timelinePosition, {
            y: -9.83,
            duration: 7,
            ease: "entry_ease_3"
        }, .2),
        this.timeline.to(this.timelineTarget, {
            y: -10,
            duration: 3,
            ease: "power1.inOut"
        }, .2),
        this.timeline.to(this.timelineTarget, {
            y: -9.81,
            duration: 2.5,
            ease: "power1.inOut"
        }, 3.2),
        this.timeline.to(this.timelineAdditional, {
            upRotation: Math.PI,
            duration: 5.25,
            ease: "power3.inOut"
        }, 1),
        this.timeline.to(this.timelineAdditional, {
            upOriginal: 1,
            duration: 3.7,
            ease: "entry_ease"
        }, 3.5),
        this.timeline.to(this.timelinePosition, {
            z: -1.5,
            duration: 3.7,
            ease: "entry_ease"
        }, 3.5),
        this.timeline.to(this.timelinePosition, {
            z: -3,
            duration: 2,
            ease: "entry_ease_2"
        }, 7.2),
        this.timeline.set(this.camera, {
            fov: 22
        }, 0),
        this.timeline.to(this.camera, {
            fov: 30,
            duration: 7.2,
            ease: "power1.inOut"
        }, 0),
        this.timeline.set(this.timelineDisplacement, {
            x: .01,
            y: .005
        }, 0),
        this.timeline.set(this.timelineDisplacementRot, {
            value: 0
        }, 0),
        this.timeline.to(this.timelineDisplacement, {
            x: 0,
            y: 0,
            duration: 1,
            ease: "power2.inOut"
        }, 4),
        this.timeline.to(this.timelineDisplacementTar, {
            x: -.03,
            y: -.01,
            duration: 2,
            ease: "power2.inOut"
        }, 4),
        this.timeline.to(this.timelineDisplacementRot, {
            value: .05,
            duration: 2,
            ease: "power2.inOut"
        }, 4),
        this.timeline.to(this.timelineTarget, {
            y: -10.35,
            duration: 2,
            ease: "power2.in"
        }, 7.2),
        this.timeline.set(this.containerparticles.mesh, {
            visible: !1
        }, 0),
        this.timeline.set(this.containerparticles.mesh, {
            visible: !0
        }, 1.5),
        this.timeline.fromTo(this.containerparticles.mesh.material.uniforms.uAlpha, {
            value: 0
        }, {
            value: 1,
            duration: 2.5,
            ease: "power2.inOut"
        }, 1.5),
        this.timeline.fromTo(this.containerparticles.mesh.material.uniforms.uInitialGlow, {
            value: 1
        }, {
            value: 0,
            duration: 1,
            ease: "power1.inOut"
        }, 3.9),
        this.timeline.fromTo(this.containerparticles.mesh.computationMaterial.uniforms.uShowNoise, {
            value: 1
        }, {
            value: 0,
            duration: 1.5,
            ease: "power1.inOut"
        }, 3.5),
        this.timeline.set(this.floor.mesh, {
            visible: !1
        }, 0),
        this.timeline.set(this.floor.mesh, {
            visible: !0
        }, 3.4),
        this.timeline.fromTo(this.floor.mesh.material.uniforms.uAlpha, {
            value: 0
        }, {
            value: 1,
            duration: 5,
            ease: "power2.out"
        }, 3.4),
        this.timeline.set(this.textcylinder.mesh, {
            visible: !1
        }, 0),
        this.timeline.set(this.textcylinder.mesh, {
            visible: !0
        }, 4.5),
        this.timeline.set(this.textcylinder.mesh2, {
            visible: !1
        }, 0),
        this.timeline.set(this.textcylinder.mesh2, {
            visible: !0
        }, 4.5),
        this.timeline.fromTo(this.textcylinder.mesh.material.uniforms.uAlpha, {
            value: 0
        }, {
            value: 1,
            duration: 2,
            ease: "power2.inOut"
        }, 4.5),
        this.timeline.fromTo(this.textcylinder.mesh2.material.uniforms.uAlpha, {
            value: 0
        }, {
            value: 1,
            duration: 2,
            ease: "power2.inOut"
        }, 4.5),
        this.timeline.set(this.forcefield.mesh, {
            visible: !1
        }, 0),
        this.timeline.set(this.forcefield.mesh, {
            visible: !0
        }, 4),
        this.timeline.fromTo(this.forcefield.mesh.material.uniforms.uAlpha, {
            value: 0
        }, {
            value: 1,
            duration: 2,
            ease: "power2.inOut"
        }, 4),
        this.timeline.set(this.groundsmoke.mesh, {
            visible: !1
        }, 0),
        this.timeline.set(this.ceilingsmoke.mesh, {
            visible: !1
        }, 0),
        this.timeline.set(this.groundsmoke.mesh, {
            visible: !0
        }, 3.4),
        this.timeline.set(this.ceilingsmoke.mesh, {
            visible: !0
        }, 4.5),
        this.timeline.fromTo(this.groundsmoke.mesh.material.uniforms.uAlpha, {
            value: 0
        }, {
            value: 1,
            duration: 3,
            ease: "power2.out"
        }, 4.4),
        this.timeline.set(this.ambientparticles.mesh, {
            visible: !1
        }, 0),
        this.timeline.set(this.ambientparticles.mesh, {
            visible: !0
        }, 3.4),
        this.timeline.fromTo(this.ambientparticles.mesh.material.uniforms.uAlpha, {
            value: 0
        }, {
            value: 1,
            duration: 3,
            ease: "power2.out"
        }, 4.4);
        const s = (n=null, r=null) => {
            const a = r !== null ? r : n === null || this.direction === -1 ? 1 : .5;
            e.uSquareAttr.value.set(Math.random() * 25.424, Math.random() * 64.453, a)
        };
        this.timeline.call(s, null, 2),
        this.timeline.fromTo(e.uRingProximity, {
            value: 0
        }, {
            value: 1,
            duration: .5,
            ease: "power1.in"
        }, 2),
        this.timeline.fromTo(e.uRingProximity, {
            value: 1
        }, {
            value: 0,
            duration: .4,
            ease: "power1.out"
        }, 2.5),
        this.timeline.call(s, null, 2.95),
        this.timeline.fromTo(e.uRingProximity, {
            value: 0
        }, {
            value: 1,
            duration: .5,
            ease: "power1.in"
        }, 2.95),
        this.timeline.fromTo(e.uRingProximity, {
            value: 1
        }, {
            value: 0,
            duration: .4,
            ease: "power1.out"
        }, 3.45),
        this.timeline.call(s, [!0], 3.8),
        this.timeline.fromTo(e.uRingProximity, {
            value: 0
        }, {
            value: 1,
            duration: .5,
            ease: "power1.in"
        }, 3.8),
        this.timeline.fromTo(e.uRingProximity, {
            value: 1
        }, {
            value: 0,
            duration: .6,
            ease: "power1.out"
        }, 4.3),
        this.timeline.call(s, [!1, .5], 4.9),
        this.timeline.progress(1),
        this.timeline.progress(0)
    }
    update()
    {
        this.direction = this.progress > this.lastProgress ? 1 : -1,
        this.lastProgress = this.progress,
        q.devScene || this.timeline.progress(this.progress),
        this.textcylinder.update(),
        this.smoketrail.update(),
        this.rings.update(),
        this.tunnel.update(),
        this.plasma.update(),
        this.camera.basePosition.copy(this.timelinePosition),
        this.camera.baseTarget.copy(this.timelineTarget),
        this.camera.displacement.position.copy(this.timelineDisplacement),
        this.camera.displacement.target.copy(this.timelineDisplacementTar),
        this.camera.displacement.rotation = this.timelineDisplacementRot.value,
        this.camera.baseUp.set(0, 0, -1),
        this.camera.baseUp.applyAxisAngle($x.set(0, 1, 0), this.timelineAdditional.upRotation),
        this.camera.baseUp.lerp($x.set(0, 1, 0), this.timelineAdditional.upOriginal).normalize(),
        this._needsReset = !1,
        Q.emit("webgl_set_audio_volume", "portals", this._portalsVolume),
        Q.emit("webgl_set_audio_volume", "particles", this._particlesVolume)
    }
    autoCenter(e, t)
    {
        if (this.progress > .15) {
            const s = (this.finalScrollAutocenter - this.progress) * (this.height + 1),
                n = ie.clamp(Math.abs(s) * 4, 2, 20);
            e.centerScroll(e.scroll.y + s, n)
        }
    }
    resize()
    {
        this.camera.zoom = Math.min(1, q.screen.aspectRatio * 1.5),
        this.camera.updateProjectionMatrix()
    }
    dispose() {}
}
