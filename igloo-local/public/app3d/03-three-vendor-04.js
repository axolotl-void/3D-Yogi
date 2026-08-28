function QT(i, e, t, s, n, r, a) {
    const o = e.has("WEBGL_multisampled_render_to_texture") ? e.get("WEBGL_multisampled_render_to_texture") : null,
        l = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent),
        c = new H,
        h = new WeakMap;
    let d;
    const u = new WeakMap;
    let f = !1;
    try {
        f = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null
    } catch {}
    function p(R, T) {
        return f ? new OffscreenCanvas(R, T) : Ac("canvas")
    }
    function A(R, T, W) {
        let se = 1;
        const ce = Xt(R);
        if ((ce.width > W || ce.height > W) && (se = W / Math.max(ce.width, ce.height)), se < 1)
            if (typeof HTMLImageElement < "u" && R instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && R instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && R instanceof ImageBitmap || typeof VideoFrame < "u" && R instanceof VideoFrame) {
                const j = Math.floor(se * ce.width),
                    we = Math.floor(se * ce.height);
                d === void 0 && (d = p(j, we));
                const $ = T ? p(j, we) : d;
                return $.width = j, $.height = we, $.getContext("2d").drawImage(R, 0, 0, j, we), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + ce.width + "x" + ce.height + ") to (" + j + "x" + we + ")."), $
            } else
                return "data" in R && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + ce.width + "x" + ce.height + ")."), R;
        return R
    }
    function m(R) {
        return R.generateMipmaps && R.minFilter !== gt && R.minFilter !== _t
    }
    function g(R) {
        i.generateMipmap(R)
    }
    function x(R, T, W, se, ce=!1) {
        if (R !== null) {
            if (i[R] !== void 0)
                return i[R];
            console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + R + "'")
        }
        let j = T;
        if (T === i.RED && (W === i.FLOAT && (j = i.R32F), W === i.HALF_FLOAT && (j = i.R16F), W === i.UNSIGNED_BYTE && (j = i.R8)), T === i.RED_INTEGER && (W === i.UNSIGNED_BYTE && (j = i.R8UI), W === i.UNSIGNED_SHORT && (j = i.R16UI), W === i.UNSIGNED_INT && (j = i.R32UI), W === i.BYTE && (j = i.R8I), W === i.SHORT && (j = i.R16I), W === i.INT && (j = i.R32I)), T === i.RG && (W === i.FLOAT && (j = i.RG32F), W === i.HALF_FLOAT && (j = i.RG16F), W === i.UNSIGNED_BYTE && (j = i.RG8)), T === i.RG_INTEGER && (W === i.UNSIGNED_BYTE && (j = i.RG8UI), W === i.UNSIGNED_SHORT && (j = i.RG16UI), W === i.UNSIGNED_INT && (j = i.RG32UI), W === i.BYTE && (j = i.RG8I), W === i.SHORT && (j = i.RG16I), W === i.INT && (j = i.RG32I)), T === i.RGB && W === i.UNSIGNED_INT_5_9_9_9_REV && (j = i.RGB9_E5), T === i.RGBA) {
            const we = ce ? Vu : mt.getTransfer(se);
            W === i.FLOAT && (j = i.RGBA32F),
            W === i.HALF_FLOAT && (j = i.RGBA16F),
            W === i.UNSIGNED_BYTE && (j = we === Ft ? i.SRGB8_ALPHA8 : i.RGBA8),
            W === i.UNSIGNED_SHORT_4_4_4_4 && (j = i.RGBA4),
            W === i.UNSIGNED_SHORT_5_5_5_1 && (j = i.RGB5_A1)
        }
        return (j === i.R16F || j === i.R32F || j === i.RG16F || j === i.RG32F || j === i.RGBA16F || j === i.RGBA32F) && e.get("EXT_color_buffer_float"), j
    }
    function v(R, T) {
        let W;
        return R ? T === null || T === ca || T === ha ? W = i.DEPTH24_STENCIL8 : T === Lt ? W = i.DEPTH32F_STENCIL8 : T === Gu && (W = i.DEPTH24_STENCIL8, console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : T === null || T === ca || T === ha ? W = i.DEPTH_COMPONENT24 : T === Lt ? W = i.DEPTH_COMPONENT32F : T === Gu && (W = i.DEPTH_COMPONENT16), W
    }
    function y(R, T) {
        return m(R) === !0 || R.isFramebufferTexture && R.minFilter !== gt && R.minFilter !== _t ? Math.log2(Math.max(T.width, T.height)) + 1 : R.mipmaps !== void 0 && R.mipmaps.length > 0 ? R.mipmaps.length : R.isCompressedTexture && Array.isArray(R.image) ? T.mipmaps.length : 1
    }
    function S(R) {
        const T = R.target;
        T.removeEventListener("dispose", S),
        C(T),
        T.isVideoTexture && h.delete(T)
    }
    function w(R) {
        const T = R.target;
        T.removeEventListener("dispose", w),
        E(T)
    }
    function C(R) {
        const T = s.get(R);
        if (T.__webglInit === void 0)
            return;
        const W = R.source,
            se = u.get(W);
        if (se) {
            const ce = se[T.__cacheKey];
            ce.usedTimes--,
            ce.usedTimes === 0 && M(R),
            Object.keys(se).length === 0 && u.delete(W)
        }
        s.remove(R)
    }
    function M(R) {
        const T = s.get(R);
        i.deleteTexture(T.__webglTexture);
        const W = R.source,
            se = u.get(W);
        delete se[T.__cacheKey],
        a.memory.textures--
    }
    function E(R) {
        const T = s.get(R);
        if (R.depthTexture && R.depthTexture.dispose(), R.isWebGLCubeRenderTarget)
            for (let se = 0; se < 6; se++) {
                if (Array.isArray(T.__webglFramebuffer[se]))
                    for (let ce = 0; ce < T.__webglFramebuffer[se].length; ce++)
                        i.deleteFramebuffer(T.__webglFramebuffer[se][ce]);
                else
                    i.deleteFramebuffer(T.__webglFramebuffer[se]);
                T.__webglDepthbuffer && i.deleteRenderbuffer(T.__webglDepthbuffer[se])
            }
        else {
            if (Array.isArray(T.__webglFramebuffer))
                for (let se = 0; se < T.__webglFramebuffer.length; se++)
                    i.deleteFramebuffer(T.__webglFramebuffer[se]);
            else
                i.deleteFramebuffer(T.__webglFramebuffer);
            if (T.__webglDepthbuffer && i.deleteRenderbuffer(T.__webglDepthbuffer), T.__webglMultisampledFramebuffer && i.deleteFramebuffer(T.__webglMultisampledFramebuffer), T.__webglColorRenderbuffer)
                for (let se = 0; se < T.__webglColorRenderbuffer.length; se++)
                    T.__webglColorRenderbuffer[se] && i.deleteRenderbuffer(T.__webglColorRenderbuffer[se]);
            T.__webglDepthRenderbuffer && i.deleteRenderbuffer(T.__webglDepthRenderbuffer)
        }
        const W = R.textures;
        for (let se = 0, ce = W.length; se < ce; se++) {
            const j = s.get(W[se]);
            j.__webglTexture && (i.deleteTexture(j.__webglTexture), a.memory.textures--),
            s.remove(W[se])
        }
        s.remove(R)
    }
    let _ = 0;
    function I() {
        _ = 0
    }
    function P() {
        const R = _;
        return R >= n.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + R + " texture units while this GPU supports only " + n.maxTextures), _ += 1, R
    }
    function D(R) {
        const T = [];
        return T.push(R.wrapS), T.push(R.wrapT), T.push(R.wrapR || 0), T.push(R.magFilter), T.push(R.minFilter), T.push(R.anisotropy), T.push(R.internalFormat), T.push(R.format), T.push(R.type), T.push(R.generateMipmaps), T.push(R.premultiplyAlpha), T.push(R.flipY), T.push(R.unpackAlignment), T.push(R.colorSpace), T.join()
    }
    function L(R, T) {
        const W = s.get(R);
        if (R.isVideoTexture && tt(R), R.isRenderTargetTexture === !1 && R.version > 0 && W.__version !== R.version) {
            const se = R.image;
            if (se === null)
                console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
            else if (se.complete === !1)
                console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
            else {
                ke(W, R, T);
                return
            }
        }
        t.bindTexture(i.TEXTURE_2D, W.__webglTexture, i.TEXTURE0 + T)
    }
    function z(R, T) {
        const W = s.get(R);
        if (R.version > 0 && W.__version !== R.version) {
            ke(W, R, T);
            return
        }
        t.bindTexture(i.TEXTURE_2D_ARRAY, W.__webglTexture, i.TEXTURE0 + T)
    }
    function O(R, T) {
        const W = s.get(R);
        if (R.version > 0 && W.__version !== R.version) {
            ke(W, R, T);
            return
        }
        t.bindTexture(i.TEXTURE_3D, W.__webglTexture, i.TEXTURE0 + T)
    }
    function K(R, T) {
        const W = s.get(R);
        if (R.version > 0 && W.__version !== R.version) {
            J(W, R, T);
            return
        }
        t.bindTexture(i.TEXTURE_CUBE_MAP, W.__webglTexture, i.TEXTURE0 + T)
    }
    const V = {
            [Ar]: i.REPEAT,
            [zs]: i.CLAMP_TO_EDGE,
            [Do]: i.MIRRORED_REPEAT
        },
        pe = {
            [gt]: i.NEAREST,
            [gy]: i.NEAREST_MIPMAP_NEAREST,
            [bl]: i.NEAREST_MIPMAP_LINEAR,
            [_t]: i.LINEAR,
            [Xh]: i.LINEAR_MIPMAP_NEAREST,
            [Qs]: i.LINEAR_MIPMAP_LINEAR
        },
        xe = {
            [wC]: i.NEVER,
            [TC]: i.ALWAYS,
            [EC]: i.LESS,
            [Sy]: i.LEQUAL,
            [CC]: i.EQUAL,
            [bC]: i.GEQUAL,
            [SC]: i.GREATER,
            [MC]: i.NOTEQUAL
        };
    function Ae(R, T) {
        if (T.type === Lt && e.has("OES_texture_float_linear") === !1 && (T.magFilter === _t || T.magFilter === Xh || T.magFilter === bl || T.magFilter === Qs || T.minFilter === _t || T.minFilter === Xh || T.minFilter === bl || T.minFilter === Qs) && console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), i.texParameteri(R, i.TEXTURE_WRAP_S, V[T.wrapS]), i.texParameteri(R, i.TEXTURE_WRAP_T, V[T.wrapT]), (R === i.TEXTURE_3D || R === i.TEXTURE_2D_ARRAY) && i.texParameteri(R, i.TEXTURE_WRAP_R, V[T.wrapR]), i.texParameteri(R, i.TEXTURE_MAG_FILTER, pe[T.magFilter]), i.texParameteri(R, i.TEXTURE_MIN_FILTER, pe[T.minFilter]), T.compareFunction && (i.texParameteri(R, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE), i.texParameteri(R, i.TEXTURE_COMPARE_FUNC, xe[T.compareFunction])), e.has("EXT_texture_filter_anisotropic") === !0) {
            if (T.magFilter === gt || T.minFilter !== bl && T.minFilter !== Qs || T.type === Lt && e.has("OES_texture_float_linear") === !1)
                return;
            if (T.anisotropy > 1 || s.get(T).__currentAnisotropy) {
                const W = e.get("EXT_texture_filter_anisotropic");
                i.texParameterf(R, W.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(T.anisotropy, n.getMaxAnisotropy())),
                s.get(T).__currentAnisotropy = T.anisotropy
            }
        }
    }
    function Ye(R, T) {
        let W = !1;
        R.__webglInit === void 0 && (R.__webglInit = !0, T.addEventListener("dispose", S));
        const se = T.source;
        let ce = u.get(se);
        ce === void 0 && (ce = {}, u.set(se, ce));
        const j = D(T);
        if (j !== R.__cacheKey) {
            ce[j] === void 0 && (ce[j] = {
                texture: i.createTexture(),
                usedTimes: 0
            }, a.memory.textures++, W = !0),
            ce[j].usedTimes++;
            const we = ce[R.__cacheKey];
            we !== void 0 && (ce[R.__cacheKey].usedTimes--, we.usedTimes === 0 && M(T)),
            R.__cacheKey = j,
            R.__webglTexture = ce[j].texture
        }
        return W
    }
    function ke(R, T, W) {
        let se = i.TEXTURE_2D;
        (T.isDataArrayTexture || T.isCompressedArrayTexture) && (se = i.TEXTURE_2D_ARRAY),
        T.isData3DTexture && (se = i.TEXTURE_3D);
        const ce = Ye(R, T),
            j = T.source;
        t.bindTexture(se, R.__webglTexture, i.TEXTURE0 + W);
        const we = s.get(j);
        if (j.version !== we.__version || ce === !0) {
            t.activeTexture(i.TEXTURE0 + W);
            const $ = mt.getPrimaries(mt.workingColorSpace),
                oe = T.colorSpace === _s ? null : mt.getPrimaries(T.colorSpace),
                qe = T.colorSpace === _s || $ === oe ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
            i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, T.flipY),
            i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, T.premultiplyAlpha),
            i.pixelStorei(i.UNPACK_ALIGNMENT, T.unpackAlignment),
            i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, qe);
            let de = A(T.image, !1, n.maxTextureSize);
            de = $e(T, de);
            const me = r.convert(T.format, T.colorSpace),
                ye = r.convert(T.type);
            let Ne = x(T.internalFormat, me, ye, T.colorSpace, T.isVideoTexture);
            Ae(se, T);
            let be;
            const st = T.mipmaps,
                ft = T.isVideoTexture !== !0,
                ni = we.__version === void 0 || ce === !0,
                F = j.dataReady,
                Te = y(T, de);
            if (T.isDepthTexture)
                Ne = v(T.format === ua, T.type),
                ni && (ft ? t.texStorage2D(i.TEXTURE_2D, 1, Ne, de.width, de.height) : t.texImage2D(i.TEXTURE_2D, 0, Ne, de.width, de.height, 0, me, ye, null));
            else if (T.isDataTexture)
                if (st.length > 0) {
                    ft && ni && t.texStorage2D(i.TEXTURE_2D, Te, Ne, st[0].width, st[0].height);
                    for (let ee = 0, ne = st.length; ee < ne; ee++)
                        be = st[ee],
                        ft ? F && t.texSubImage2D(i.TEXTURE_2D, ee, 0, 0, be.width, be.height, me, ye, be.data) : t.texImage2D(i.TEXTURE_2D, ee, Ne, be.width, be.height, 0, me, ye, be.data);
                    T.generateMipmaps = !1
                } else
                    ft ? (ni && t.texStorage2D(i.TEXTURE_2D, Te, Ne, de.width, de.height), F && t.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, de.width, de.height, me, ye, de.data)) : t.texImage2D(i.TEXTURE_2D, 0, Ne, de.width, de.height, 0, me, ye, de.data);
            else if (T.isCompressedTexture)
                if (T.isCompressedArrayTexture) {
                    ft && ni && t.texStorage3D(i.TEXTURE_2D_ARRAY, Te, Ne, st[0].width, st[0].height, de.depth);
                    for (let ee = 0, ne = st.length; ee < ne; ee++)
                        if (be = st[ee], T.format !== wt)
                            if (me !== null)
                                if (ft) {
                                    if (F)
                                        if (T.layerUpdates.size > 0) {
                                            for (const _e of T.layerUpdates) {
                                                const je = be.width * be.height;
                                                t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, ee, 0, 0, _e, be.width, be.height, 1, me, be.data.slice(je * _e, je * (_e + 1)), 0, 0)
                                            }
                                            T.clearLayerUpdates()
                                        } else
                                            t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, ee, 0, 0, 0, be.width, be.height, de.depth, me, be.data, 0, 0)
                                } else
                                    t.compressedTexImage3D(i.TEXTURE_2D_ARRAY, ee, Ne, be.width, be.height, de.depth, 0, be.data, 0, 0);
                            else
                                console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
                        else
                            ft ? F && t.texSubImage3D(i.TEXTURE_2D_ARRAY, ee, 0, 0, 0, be.width, be.height, de.depth, me, ye, be.data) : t.texImage3D(i.TEXTURE_2D_ARRAY, ee, Ne, be.width, be.height, de.depth, 0, me, ye, be.data)
                } else {
                    ft && ni && t.texStorage2D(i.TEXTURE_2D, Te, Ne, st[0].width, st[0].height);
                    for (let ee = 0, ne = st.length; ee < ne; ee++)
                        be = st[ee],
                        T.format !== wt ? me !== null ? ft ? F && t.compressedTexSubImage2D(i.TEXTURE_2D, ee, 0, 0, be.width, be.height, me, be.data) : t.compressedTexImage2D(i.TEXTURE_2D, ee, Ne, be.width, be.height, 0, be.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : ft ? F && t.texSubImage2D(i.TEXTURE_2D, ee, 0, 0, be.width, be.height, me, ye, be.data) : t.texImage2D(i.TEXTURE_2D, ee, Ne, be.width, be.height, 0, me, ye, be.data)
                }
            else if (T.isDataArrayTexture)
                if (ft) {
                    if (ni && t.texStorage3D(i.TEXTURE_2D_ARRAY, Te, Ne, de.width, de.height, de.depth), F)
                        if (T.layerUpdates.size > 0) {
                            let ee;
                            switch (ye) {
                            case i.UNSIGNED_BYTE:
                                switch (me) {
                                case i.ALPHA:
                                    ee = 1;
                                    break;
                                case i.LUMINANCE:
                                    ee = 1;
                                    break;
                                case i.LUMINANCE_ALPHA:
                                    ee = 2;
                                    break;
                                case i.RGB:
                                    ee = 3;
                                    break;
                                case i.RGBA:
                                    ee = 4;
                                    break;
                                default:
                                    throw new Error(`Unknown texel size for format ${me}.`)
                                }
                                break;
                            case i.UNSIGNED_SHORT_4_4_4_4:
                            case i.UNSIGNED_SHORT_5_5_5_1:
                            case i.UNSIGNED_SHORT_5_6_5:
                                ee = 1;
                                break;
                            default:
                                throw new Error(`Unknown texel size for type ${ye}.`)
                            }
                            const ne = de.width * de.height * ee;
                            for (const _e of T.layerUpdates)
                                t.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, _e, de.width, de.height, 1, me, ye, de.data.slice(ne * _e, ne * (_e + 1)));
                            T.clearLayerUpdates()
                        } else
                            t.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, 0, de.width, de.height, de.depth, me, ye, de.data)
                } else
                    t.texImage3D(i.TEXTURE_2D_ARRAY, 0, Ne, de.width, de.height, de.depth, 0, me, ye, de.data);
            else if (T.isData3DTexture)
                ft ? (ni && t.texStorage3D(i.TEXTURE_3D, Te, Ne, de.width, de.height, de.depth), F && t.texSubImage3D(i.TEXTURE_3D, 0, 0, 0, 0, de.width, de.height, de.depth, me, ye, de.data)) : t.texImage3D(i.TEXTURE_3D, 0, Ne, de.width, de.height, de.depth, 0, me, ye, de.data);
            else if (T.isFramebufferTexture) {
                if (ni)
                    if (ft)
                        t.texStorage2D(i.TEXTURE_2D, Te, Ne, de.width, de.height);
                    else {
                        let ee = de.width,
                            ne = de.height;
                        for (let _e = 0; _e < Te; _e++)
                            t.texImage2D(i.TEXTURE_2D, _e, Ne, ee, ne, 0, me, ye, null),
                            ee >>= 1,
                            ne >>= 1
                    }
            } else if (st.length > 0) {
                if (ft && ni) {
                    const ee = Xt(st[0]);
                    t.texStorage2D(i.TEXTURE_2D, Te, Ne, ee.width, ee.height)
                }
                for (let ee = 0, ne = st.length; ee < ne; ee++)
                    be = st[ee],
                    ft ? F && t.texSubImage2D(i.TEXTURE_2D, ee, 0, 0, me, ye, be) : t.texImage2D(i.TEXTURE_2D, ee, Ne, me, ye, be);
                T.generateMipmaps = !1
            } else if (ft) {
                if (ni) {
                    const ee = Xt(de);
                    t.texStorage2D(i.TEXTURE_2D, Te, Ne, ee.width, ee.height)
                }
                F && t.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, me, ye, de)
            } else
                t.texImage2D(i.TEXTURE_2D, 0, Ne, me, ye, de);
            m(T) && g(se),
            we.__version = j.version,
            T.onUpdate && T.onUpdate(T)
        }
        R.__version = T.version
    }
    function J(R, T, W) {
        if (T.image.length !== 6)
            return;
        const se = Ye(R, T),
            ce = T.source;
        t.bindTexture(i.TEXTURE_CUBE_MAP, R.__webglTexture, i.TEXTURE0 + W);
        const j = s.get(ce);
        if (ce.version !== j.__version || se === !0) {
            t.activeTexture(i.TEXTURE0 + W);
            const we = mt.getPrimaries(mt.workingColorSpace),
                $ = T.colorSpace === _s ? null : mt.getPrimaries(T.colorSpace),
                oe = T.colorSpace === _s || we === $ ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
            i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, T.flipY),
            i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, T.premultiplyAlpha),
            i.pixelStorei(i.UNPACK_ALIGNMENT, T.unpackAlignment),
            i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, oe);
            const qe = T.isCompressedTexture || T.image[0].isCompressedTexture,
                de = T.image[0] && T.image[0].isDataTexture,
                me = [];
            for (let ne = 0; ne < 6; ne++)
                !qe && !de ? me[ne] = A(T.image[ne], !0, n.maxCubemapSize) : me[ne] = de ? T.image[ne].image : T.image[ne],
                me[ne] = $e(T, me[ne]);
            const ye = me[0],
                Ne = r.convert(T.format, T.colorSpace),
                be = r.convert(T.type),
                st = x(T.internalFormat, Ne, be, T.colorSpace),
                ft = T.isVideoTexture !== !0,
                ni = j.__version === void 0 || se === !0,
                F = ce.dataReady;
            let Te = y(T, ye);
            Ae(i.TEXTURE_CUBE_MAP, T);
            let ee;
            if (qe) {
                ft && ni && t.texStorage2D(i.TEXTURE_CUBE_MAP, Te, st, ye.width, ye.height);
                for (let ne = 0; ne < 6; ne++) {
                    ee = me[ne].mipmaps;
                    for (let _e = 0; _e < ee.length; _e++) {
                        const je = ee[_e];
                        T.format !== wt ? Ne !== null ? ft ? F && t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + ne, _e, 0, 0, je.width, je.height, Ne, je.data) : t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + ne, _e, st, je.width, je.height, 0, je.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : ft ? F && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + ne, _e, 0, 0, je.width, je.height, Ne, be, je.data) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + ne, _e, st, je.width, je.height, 0, Ne, be, je.data)
                    }
                }
            } else {
                if (ee = T.mipmaps, ft && ni) {
                    ee.length > 0 && Te++;
                    const ne = Xt(me[0]);
                    t.texStorage2D(i.TEXTURE_CUBE_MAP, Te, st, ne.width, ne.height)
                }
                for (let ne = 0; ne < 6; ne++)
                    if (de) {
                        ft ? F && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + ne, 0, 0, 0, me[ne].width, me[ne].height, Ne, be, me[ne].data) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + ne, 0, st, me[ne].width, me[ne].height, 0, Ne, be, me[ne].data);
                        for (let _e = 0; _e < ee.length; _e++) {
                            const xt = ee[_e].image[ne].image;
                            ft ? F && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + ne, _e + 1, 0, 0, xt.width, xt.height, Ne, be, xt.data) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + ne, _e + 1, st, xt.width, xt.height, 0, Ne, be, xt.data)
                        }
                    } else {
                        ft ? F && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + ne, 0, 0, 0, Ne, be, me[ne]) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + ne, 0, st, Ne, be, me[ne]);
                        for (let _e = 0; _e < ee.length; _e++) {
                            const je = ee[_e];
                            ft ? F && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + ne, _e + 1, 0, 0, Ne, be, je.image[ne]) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + ne, _e + 1, st, Ne, be, je.image[ne])
                        }
                    }
            }
            m(T) && g(i.TEXTURE_CUBE_MAP),
            j.__version = ce.version,
            T.onUpdate && T.onUpdate(T)
        }
        R.__version = T.version
    }
    function ue(R, T, W, se, ce, j) {
        const we = r.convert(W.format, W.colorSpace),
            $ = r.convert(W.type),
            oe = x(W.internalFormat, we, $, W.colorSpace);
        if (!s.get(T).__hasExternalTextures) {
            const de = Math.max(1, T.width >> j),
                me = Math.max(1, T.height >> j);
            ce === i.TEXTURE_3D || ce === i.TEXTURE_2D_ARRAY ? t.texImage3D(ce, j, oe, de, me, T.depth, 0, we, $, null) : t.texImage2D(ce, j, oe, de, me, 0, we, $, null)
        }
        t.bindFramebuffer(i.FRAMEBUFFER, R),
        dt(T) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, se, ce, s.get(W).__webglTexture, 0, Ge(T)) : (ce === i.TEXTURE_2D || ce >= i.TEXTURE_CUBE_MAP_POSITIVE_X && ce <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z) && i.framebufferTexture2D(i.FRAMEBUFFER, se, ce, s.get(W).__webglTexture, j),
        t.bindFramebuffer(i.FRAMEBUFFER, null)
    }
    function Pe(R, T, W) {
        if (i.bindRenderbuffer(i.RENDERBUFFER, R), T.depthBuffer) {
            const se = T.depthTexture,
                ce = se && se.isDepthTexture ? se.type : null,
                j = v(T.stencilBuffer, ce),
                we = T.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT,
                $ = Ge(T);
            dt(T) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, $, j, T.width, T.height) : W ? i.renderbufferStorageMultisample(i.RENDERBUFFER, $, j, T.width, T.height) : i.renderbufferStorage(i.RENDERBUFFER, j, T.width, T.height),
            i.framebufferRenderbuffer(i.FRAMEBUFFER, we, i.RENDERBUFFER, R)
        } else {
            const se = T.textures;
            for (let ce = 0; ce < se.length; ce++) {
                const j = se[ce],
                    we = r.convert(j.format, j.colorSpace),
                    $ = r.convert(j.type),
                    oe = x(j.internalFormat, we, $, j.colorSpace),
                    qe = Ge(T);
                W && dt(T) === !1 ? i.renderbufferStorageMultisample(i.RENDERBUFFER, qe, oe, T.width, T.height) : dt(T) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, qe, oe, T.width, T.height) : i.renderbufferStorage(i.RENDERBUFFER, oe, T.width, T.height)
            }
        }
        i.bindRenderbuffer(i.RENDERBUFFER, null)
    }
    function Ee(R, T) {
        if (T && T.isWebGLCubeRenderTarget)
            throw new Error("Depth Texture with cube render targets is not supported");
        if (t.bindFramebuffer(i.FRAMEBUFFER, R), !(T.depthTexture && T.depthTexture.isDepthTexture))
            throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
        (!s.get(T.depthTexture).__webglTexture || T.depthTexture.image.width !== T.width || T.depthTexture.image.height !== T.height) && (T.depthTexture.image.width = T.width, T.depthTexture.image.height = T.height, T.depthTexture.needsUpdate = !0),
        L(T.depthTexture, 0);
        const se = s.get(T.depthTexture).__webglTexture,
            ce = Ge(T);
        if (T.depthTexture.format === wo)
            dt(T) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, se, 0, ce) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, se, 0);
        else if (T.depthTexture.format === ua)
            dt(T) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, se, 0, ce) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, se, 0);
        else
            throw new Error("Unknown depthTexture format")
    }
    function it(R) {
        const T = s.get(R),
            W = R.isWebGLCubeRenderTarget === !0;
        if (R.depthTexture && !T.__autoAllocateDepthBuffer) {
            if (W)
                throw new Error("target.depthTexture not supported in Cube render targets");
            Ee(T.__webglFramebuffer, R)
        } else if (W) {
            T.__webglDepthbuffer = [];
            for (let se = 0; se < 6; se++)
                t.bindFramebuffer(i.FRAMEBUFFER, T.__webglFramebuffer[se]),
                T.__webglDepthbuffer[se] = i.createRenderbuffer(),
                Pe(T.__webglDepthbuffer[se], R, !1)
        } else
            t.bindFramebuffer(i.FRAMEBUFFER, T.__webglFramebuffer),
            T.__webglDepthbuffer = i.createRenderbuffer(),
            Pe(T.__webglDepthbuffer, R, !1);
        t.bindFramebuffer(i.FRAMEBUFFER, null)
    }
    function Ze(R, T, W) {
        const se = s.get(R);
        T !== void 0 && ue(se.__webglFramebuffer, R, R.texture, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, 0),
        W !== void 0 && it(R)
    }
    function Qe(R) {
        const T = R.texture,
            W = s.get(R),
            se = s.get(T);
        R.addEventListener("dispose", w);
        const ce = R.textures,
            j = R.isWebGLCubeRenderTarget === !0,
            we = ce.length > 1;
        if (we || (se.__webglTexture === void 0 && (se.__webglTexture = i.createTexture()), se.__version = T.version, a.memory.textures++), j) {
            W.__webglFramebuffer = [];
            for (let $ = 0; $ < 6; $++)
                if (T.mipmaps && T.mipmaps.length > 0) {
                    W.__webglFramebuffer[$] = [];
                    for (let oe = 0; oe < T.mipmaps.length; oe++)
                        W.__webglFramebuffer[$][oe] = i.createFramebuffer()
                } else
                    W.__webglFramebuffer[$] = i.createFramebuffer()
        } else {
            if (T.mipmaps && T.mipmaps.length > 0) {
                W.__webglFramebuffer = [];
                for (let $ = 0; $ < T.mipmaps.length; $++)
                    W.__webglFramebuffer[$] = i.createFramebuffer()
            } else
                W.__webglFramebuffer = i.createFramebuffer();
            if (we)
                for (let $ = 0, oe = ce.length; $ < oe; $++) {
                    const qe = s.get(ce[$]);
                    qe.__webglTexture === void 0 && (qe.__webglTexture = i.createTexture(), a.memory.textures++)
                }
            if (R.samples > 0 && dt(R) === !1) {
                W.__webglMultisampledFramebuffer = i.createFramebuffer(),
                W.__webglColorRenderbuffer = [],
                t.bindFramebuffer(i.FRAMEBUFFER, W.__webglMultisampledFramebuffer);
                for (let $ = 0; $ < ce.length; $++) {
                    const oe = ce[$];
                    W.__webglColorRenderbuffer[$] = i.createRenderbuffer(),
                    i.bindRenderbuffer(i.RENDERBUFFER, W.__webglColorRenderbuffer[$]);
                    const qe = r.convert(oe.format, oe.colorSpace),
                        de = r.convert(oe.type),
                        me = x(oe.internalFormat, qe, de, oe.colorSpace, R.isXRRenderTarget === !0),
                        ye = Ge(R);
                    i.renderbufferStorageMultisample(i.RENDERBUFFER, ye, me, R.width, R.height),
                    i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + $, i.RENDERBUFFER, W.__webglColorRenderbuffer[$])
                }
                i.bindRenderbuffer(i.RENDERBUFFER, null),
                R.depthBuffer && (W.__webglDepthRenderbuffer = i.createRenderbuffer(), Pe(W.__webglDepthRenderbuffer, R, !0)),
                t.bindFramebuffer(i.FRAMEBUFFER, null)
            }
        }
        if (j) {
            t.bindTexture(i.TEXTURE_CUBE_MAP, se.__webglTexture),
            Ae(i.TEXTURE_CUBE_MAP, T);
            for (let $ = 0; $ < 6; $++)
                if (T.mipmaps && T.mipmaps.length > 0)
                    for (let oe = 0; oe < T.mipmaps.length; oe++)
                        ue(W.__webglFramebuffer[$][oe], R, T, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + $, oe);
                else
                    ue(W.__webglFramebuffer[$], R, T, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + $, 0);
            m(T) && g(i.TEXTURE_CUBE_MAP),
            t.unbindTexture()
        } else if (we) {
            for (let $ = 0, oe = ce.length; $ < oe; $++) {
                const qe = ce[$],
                    de = s.get(qe);
                t.bindTexture(i.TEXTURE_2D, de.__webglTexture),
                Ae(i.TEXTURE_2D, qe),
                ue(W.__webglFramebuffer, R, qe, i.COLOR_ATTACHMENT0 + $, i.TEXTURE_2D, 0),
                m(qe) && g(i.TEXTURE_2D)
            }
            t.unbindTexture()
        } else {
            let $ = i.TEXTURE_2D;
            if ((R.isWebGL3DRenderTarget || R.isWebGLArrayRenderTarget) && ($ = R.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY), t.bindTexture($, se.__webglTexture), Ae($, T), T.mipmaps && T.mipmaps.length > 0)
                for (let oe = 0; oe < T.mipmaps.length; oe++)
                    ue(W.__webglFramebuffer[oe], R, T, i.COLOR_ATTACHMENT0, $, oe);
            else
                ue(W.__webglFramebuffer, R, T, i.COLOR_ATTACHMENT0, $, 0);
            m(T) && g($),
            t.unbindTexture()
        }
        R.depthBuffer && it(R)
    }
    function N(R) {
        const T = R.textures;
        for (let W = 0, se = T.length; W < se; W++) {
            const ce = T[W];
            if (m(ce)) {
                const j = R.isWebGLCubeRenderTarget ? i.TEXTURE_CUBE_MAP : i.TEXTURE_2D,
                    we = s.get(ce).__webglTexture;
                t.bindTexture(j, we),
                g(j),
                t.unbindTexture()
            }
        }
    }
    const lt = [],
        ht = [];
    function St(R) {
        if (R.samples > 0) {
            if (dt(R) === !1) {
                const T = R.textures,
                    W = R.width,
                    se = R.height;
                let ce = i.COLOR_BUFFER_BIT;
                const j = R.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT,
                    we = s.get(R),
                    $ = T.length > 1;
                if ($)
                    for (let oe = 0; oe < T.length; oe++)
                        t.bindFramebuffer(i.FRAMEBUFFER, we.__webglMultisampledFramebuffer),
                        i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + oe, i.RENDERBUFFER, null),
                        t.bindFramebuffer(i.FRAMEBUFFER, we.__webglFramebuffer),
                        i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + oe, i.TEXTURE_2D, null, 0);
                t.bindFramebuffer(i.READ_FRAMEBUFFER, we.__webglMultisampledFramebuffer),
                t.bindFramebuffer(i.DRAW_FRAMEBUFFER, we.__webglFramebuffer);
                for (let oe = 0; oe < T.length; oe++) {
                    if (R.resolveDepthBuffer && (R.depthBuffer && (ce |= i.DEPTH_BUFFER_BIT), R.stencilBuffer && R.resolveStencilBuffer && (ce |= i.STENCIL_BUFFER_BIT)), $) {
                        i.framebufferRenderbuffer(i.READ_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.RENDERBUFFER, we.__webglColorRenderbuffer[oe]);
                        const qe = s.get(T[oe]).__webglTexture;
                        i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, qe, 0)
                    }
                    i.blitFramebuffer(0, 0, W, se, 0, 0, W, se, ce, i.NEAREST),
                    l === !0 && (lt.length = 0, ht.length = 0, lt.push(i.COLOR_ATTACHMENT0 + oe), R.depthBuffer && R.resolveDepthBuffer === !1 && (lt.push(j), ht.push(j), i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, ht)), i.invalidateFramebuffer(i.READ_FRAMEBUFFER, lt))
                }
                if (t.bindFramebuffer(i.READ_FRAMEBUFFER, null), t.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), $)
                    for (let oe = 0; oe < T.length; oe++) {
                        t.bindFramebuffer(i.FRAMEBUFFER, we.__webglMultisampledFramebuffer),
                        i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + oe, i.RENDERBUFFER, we.__webglColorRenderbuffer[oe]);
                        const qe = s.get(T[oe]).__webglTexture;
                        t.bindFramebuffer(i.FRAMEBUFFER, we.__webglFramebuffer),
                        i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + oe, i.TEXTURE_2D, qe, 0)
                    }
                t.bindFramebuffer(i.DRAW_FRAMEBUFFER, we.__webglMultisampledFramebuffer)
            } else if (R.depthBuffer && R.resolveDepthBuffer === !1 && l) {
                const T = R.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
                i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [T])
            }
        }
    }
    function Ge(R) {
        return Math.min(n.maxSamples, R.samples)
    }
    function dt(R) {
        const T = s.get(R);
        return R.samples > 0 && e.has("WEBGL_multisampled_render_to_texture") === !0 && T.__useRenderToTexture !== !1
    }
    function tt(R) {
        const T = a.render.frame;
        h.get(R) !== T && (h.set(R, T), R.update())
    }
    function $e(R, T) {
        const W = R.colorSpace,
            se = R.format,
            ce = R.type;
        return R.isCompressedTexture === !0 || R.isVideoTexture === !0 || W !== oi && W !== _s && (mt.getTransfer(W) === Ft ? (se !== wt || ce !== Ct) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", W)), T
    }
    function Xt(R) {
        return typeof HTMLImageElement < "u" && R instanceof HTMLImageElement ? (c.width = R.naturalWidth || R.width, c.height = R.naturalHeight || R.height) : typeof VideoFrame < "u" && R instanceof VideoFrame ? (c.width = R.displayWidth, c.height = R.displayHeight) : (c.width = R.width, c.height = R.height), c
    }
    this.allocateTextureUnit = P,
    this.resetTextureUnits = I,
    this.setTexture2D = L,
    this.setTexture2DArray = z,
    this.setTexture3D = O,
    this.setTextureCube = K,
    this.rebindTextures = Ze,
    this.setupRenderTarget = Qe,
    this.updateRenderTargetMipmap = N,
    this.updateMultisampleRenderTarget = St,
    this.setupDepthRenderbuffer = it,
    this.setupFrameBufferTexture = ue,
    this.useMultisampledRTT = dt
}
function GT(i, e) {
    function t(s, n=_s) {
        let r;
        const a = mt.getTransfer(n);
        if (s === Ct)
            return i.UNSIGNED_BYTE;
        if (s === xy)
            return i.UNSIGNED_SHORT_4_4_4_4;
        if (s === yy)
            return i.UNSIGNED_SHORT_5_5_5_1;
        if (s === fC)
            return i.UNSIGNED_INT_5_9_9_9_REV;
        if (s === uC)
            return i.BYTE;
        if (s === dC)
            return i.SHORT;
        if (s === Gu)
            return i.UNSIGNED_SHORT;
        if (s === vy)
            return i.INT;
        if (s === ca)
            return i.UNSIGNED_INT;
        if (s === Lt)
            return i.FLOAT;
        if (s === Mi)
            return i.HALF_FLOAT;
        if (s === pC)
            return i.ALPHA;
        if (s === mC)
            return i.RGB;
        if (s === wt)
            return i.RGBA;
        if (s === AC)
            return i.LUMINANCE;
        if (s === gC)
            return i.LUMINANCE_ALPHA;
        if (s === wo)
            return i.DEPTH_COMPONENT;
        if (s === ua)
            return i.DEPTH_STENCIL;
        if (s === ta)
            return i.RED;
        if (s === _y)
            return i.RED_INTEGER;
        if (s === uo)
            return i.RG;
        if (s === wy)
            return i.RG_INTEGER;
        if (s === Ey)
            return i.RGBA_INTEGER;
        if (s === Hd || s === Kh || s === Vd || s === Jh)
            if (a === Ft)
                if (r = e.get("WEBGL_compressed_texture_s3tc_srgb"), r !== null) {
                    if (s === Hd)
                        return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;
                    if (s === Kh)
                        return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
                    if (s === Vd)
                        return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
                    if (s === Jh)
                        return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT
                } else
                    return null;
            else if (r = e.get("WEBGL_compressed_texture_s3tc"), r !== null) {
                if (s === Hd)
                    return r.COMPRESSED_RGB_S3TC_DXT1_EXT;
                if (s === Kh)
                    return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;
                if (s === Vd)
                    return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;
                if (s === Jh)
                    return r.COMPRESSED_RGBA_S3TC_DXT5_EXT
            } else
                return null;
        if (s === Dp || s === zg || s === Rp || s === Qg)
            if (r = e.get("WEBGL_compressed_texture_pvrtc"), r !== null) {
                if (s === Dp)
                    return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                if (s === zg)
                    return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                if (s === Rp)
                    return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                if (s === Qg)
                    return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
            } else
                return null;
        if (s === Up || s === Lp || s === Fp)
            if (r = e.get("WEBGL_compressed_texture_etc"), r !== null) {
                if (s === Up || s === Lp)
                    return a === Ft ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2;
                if (s === Fp)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : r.COMPRESSED_RGBA8_ETC2_EAC
            } else
                return null;
        if (s === Np || s === Gg || s === Hg || s === Vg || s === Hu || s === Wg || s === Yg || s === qg || s === Xg || s === Kg || s === Jg || s === jg || s === Zg || s === $g)
            if (r = e.get("WEBGL_compressed_texture_astc"), r !== null) {
                if (s === Np)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : r.COMPRESSED_RGBA_ASTC_4x4_KHR;
                if (s === Gg)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : r.COMPRESSED_RGBA_ASTC_5x4_KHR;
                if (s === Hg)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : r.COMPRESSED_RGBA_ASTC_5x5_KHR;
                if (s === Vg)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : r.COMPRESSED_RGBA_ASTC_6x5_KHR;
                if (s === Hu)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : r.COMPRESSED_RGBA_ASTC_6x6_KHR;
                if (s === Wg)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : r.COMPRESSED_RGBA_ASTC_8x5_KHR;
                if (s === Yg)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : r.COMPRESSED_RGBA_ASTC_8x6_KHR;
                if (s === qg)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : r.COMPRESSED_RGBA_ASTC_8x8_KHR;
                if (s === Xg)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : r.COMPRESSED_RGBA_ASTC_10x5_KHR;
                if (s === Kg)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : r.COMPRESSED_RGBA_ASTC_10x6_KHR;
                if (s === Jg)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : r.COMPRESSED_RGBA_ASTC_10x8_KHR;
                if (s === jg)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : r.COMPRESSED_RGBA_ASTC_10x10_KHR;
                if (s === Zg)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : r.COMPRESSED_RGBA_ASTC_12x10_KHR;
                if (s === $g)
                    return a === Ft ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : r.COMPRESSED_RGBA_ASTC_12x12_KHR
            } else
                return null;
        if (s === jh || s === ev || s === tv)
            if (r = e.get("EXT_texture_compression_bptc"), r !== null) {
                if (s === jh)
                    return a === Ft ? r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : r.COMPRESSED_RGBA_BPTC_UNORM_EXT;
                if (s === ev)
                    return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
                if (s === tv)
                    return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT
            } else
                return null;
        if (s === vC || s === iv || s === sv || s === nv)
            if (r = e.get("EXT_texture_compression_rgtc"), r !== null) {
                if (s === jh)
                    return r.COMPRESSED_RED_RGTC1_EXT;
                if (s === iv)
                    return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;
                if (s === sv)
                    return r.COMPRESSED_RED_GREEN_RGTC2_EXT;
                if (s === nv)
                    return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT
            } else
                return null;
        return s === ha ? i.UNSIGNED_INT_24_8 : i[s] !== void 0 ? i[s] : null
    }
    return {
        convert: t
    }
}
class HT extends gi {
    constructor(e=[])
    {
        super(),
        this.isArrayCamera = !0,
        this.cameras = e
    }
}
class Gi extends It {
    constructor()
    {
        super(),
        this.isGroup = !0,
        this.type = "Group"
    }
}
const VT = {
    type: "move"
};
class gf {
    constructor()
    {
        this._targetRay = null,
        this._grip = null,
        this._hand = null
    }
    getHandSpace()
    {
        return this._hand === null && (this._hand = new Gi, this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = {
            pinching: !1
        }), this._hand
    }
    getTargetRaySpace()
    {
        return this._targetRay === null && (this._targetRay = new Gi, this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new b, this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new b), this._targetRay
    }
    getGripSpace()
    {
        return this._grip === null && (this._grip = new Gi, this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new b, this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new b), this._grip
    }
    dispatchEvent(e)
    {
        return this._targetRay !== null && this._targetRay.dispatchEvent(e), this._grip !== null && this._grip.dispatchEvent(e), this._hand !== null && this._hand.dispatchEvent(e), this
    }
    connect(e)
    {
        if (e && e.hand) {
            const t = this._hand;
            if (t)
                for (const s of e.hand.values())
                    this._getHandJoint(t, s)
        }
        return this.dispatchEvent({
            type: "connected",
            data: e
        }), this
    }
    disconnect(e)
    {
        return this.dispatchEvent({
            type: "disconnected",
            data: e
        }), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this
    }
    update(e, t, s)
    {
        let n = null,
            r = null,
            a = null;
        const o = this._targetRay,
            l = this._grip,
            c = this._hand;
        if (e && t.session.visibilityState !== "visible-blurred") {
            if (c && e.hand) {
                a = !0;
                for (const A of e.hand.values()) {
                    const m = t.getJointPose(A, s),
                        g = this._getHandJoint(c, A);
                    m !== null && (g.matrix.fromArray(m.transform.matrix), g.matrix.decompose(g.position, g.rotation, g.scale), g.matrixWorldNeedsUpdate = !0, g.jointRadius = m.radius),
                    g.visible = m !== null
                }
                const h = c.joints["index-finger-tip"],
                    d = c.joints["thumb-tip"],
                    u = h.position.distanceTo(d.position),
                    f = .02,
                    p = .005;
                c.inputState.pinching && u > f + p ? (c.inputState.pinching = !1, this.dispatchEvent({
                    type: "pinchend",
                    handedness: e.handedness,
                    target: this
                })) : !c.inputState.pinching && u <= f - p && (c.inputState.pinching = !0, this.dispatchEvent({
                    type: "pinchstart",
                    handedness: e.handedness,
                    target: this
                }))
            } else
                l !== null && e.gripSpace && (r = t.getPose(e.gripSpace, s), r !== null && (l.matrix.fromArray(r.transform.matrix), l.matrix.decompose(l.position, l.rotation, l.scale), l.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (l.hasLinearVelocity = !0, l.linearVelocity.copy(r.linearVelocity)) : l.hasLinearVelocity = !1, r.angularVelocity ? (l.hasAngularVelocity = !0, l.angularVelocity.copy(r.angularVelocity)) : l.hasAngularVelocity = !1));
            o !== null && (n = t.getPose(e.targetRaySpace, s), n === null && r !== null && (n = r), n !== null && (o.matrix.fromArray(n.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = !0, n.linearVelocity ? (o.hasLinearVelocity = !0, o.linearVelocity.copy(n.linearVelocity)) : o.hasLinearVelocity = !1, n.angularVelocity ? (o.hasAngularVelocity = !0, o.angularVelocity.copy(n.angularVelocity)) : o.hasAngularVelocity = !1, this.dispatchEvent(VT)))
        }
        return o !== null && (o.visible = n !== null), l !== null && (l.visible = r !== null), c !== null && (c.visible = a !== null), this
    }
    _getHandJoint(e, t)
    {
        if (e.joints[t.jointName] === void 0) {
            const s = new Gi;
            s.matrixAutoUpdate = !1,
            s.visible = !1,
            e.joints[t.jointName] = s,
            e.add(s)
        }
        return e.joints[t.jointName]
    }
}
const WT = `
    void main() {

    	gl_Position = vec4( position, 1.0 );

    }`,
    YT = `
    uniform sampler2DArray depthColor;
    uniform float depthWidth;
    uniform float depthHeight;

    void main() {

    	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

    	if ( coord.x >= 1.0 ) {

    		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

    	} else {

    		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

    	}

    }`;
class qT {
    constructor()
    {
        this.texture = null,
        this.mesh = null,
        this.depthNear = 0,
        this.depthFar = 0
    }
    init(e, t, s)
    {
        if (this.texture === null) {
            const n = new Rt,
                r = e.properties.get(n);
            r.__webglTexture = t.texture,
            (t.depthNear != s.depthNear || t.depthFar != s.depthFar) && (this.depthNear = t.depthNear, this.depthFar = t.depthFar),
            this.texture = n
        }
    }
    getMesh(e)
    {
        if (this.texture !== null && this.mesh === null) {
            const t = e.cameras[0].viewport,
                s = new fe({
                    vertexShader: WT,
                    fragmentShader: YT,
                    uniforms: {
                        depthColor: {
                            value: this.texture
                        },
                        depthWidth: {
                            value: t.z
                        },
                        depthHeight: {
                            value: t.w
                        }
                    }
                });
            this.mesh = new Ce(new kt(20, 20), s)
        }
        return this.mesh
    }
    reset()
    {
        this.texture = null,
        this.mesh = null
    }
}
class XT extends hn {
    constructor(e, t)
    {
        super();
        const s = this;
        let n = null,
            r = 1,
            a = null,
            o = "local-floor",
            l = 1,
            c = null,
            h = null,
            d = null,
            u = null,
            f = null,
            p = null;
        const A = new qT,
            m = t.getContextAttributes();
        let g = null,
            x = null;
        const v = [],
            y = [],
            S = new H;
        let w = null;
        const C = new gi;
        C.layers.enable(1),
        C.viewport = new yt;
        const M = new gi;
        M.layers.enable(2),
        M.viewport = new yt;
        const E = [C, M],
            _ = new HT;
        _.layers.enable(1),
        _.layers.enable(2);
        let I = null,
            P = null;
        this.cameraAutoUpdate = !0,
        this.enabled = !1,
        this.isPresenting = !1,
        this.getController = function(J) {
            let ue = v[J];
            return ue === void 0 && (ue = new gf, v[J] = ue), ue.getTargetRaySpace()
        },
        this.getControllerGrip = function(J) {
            let ue = v[J];
            return ue === void 0 && (ue = new gf, v[J] = ue), ue.getGripSpace()
        },
        this.getHand = function(J) {
            let ue = v[J];
            return ue === void 0 && (ue = new gf, v[J] = ue), ue.getHandSpace()
        };
        function D(J) {
            const ue = y.indexOf(J.inputSource);
            if (ue === -1)
                return;
            const Pe = v[ue];
            Pe !== void 0 && (Pe.update(J.inputSource, J.frame, c || a), Pe.dispatchEvent({
                type: J.type,
                data: J.inputSource
            }))
        }
        function L() {
            n.removeEventListener("select", D),
            n.removeEventListener("selectstart", D),
            n.removeEventListener("selectend", D),
            n.removeEventListener("squeeze", D),
            n.removeEventListener("squeezestart", D),
            n.removeEventListener("squeezeend", D),
            n.removeEventListener("end", L),
            n.removeEventListener("inputsourceschange", z);
            for (let J = 0; J < v.length; J++) {
                const ue = y[J];
                ue !== null && (y[J] = null, v[J].disconnect(ue))
            }
            I = null,
            P = null,
            A.reset(),
            e.setRenderTarget(g),
            f = null,
            u = null,
            d = null,
            n = null,
            x = null,
            ke.stop(),
            s.isPresenting = !1,
            e.setPixelRatio(w),
            e.setSize(S.width, S.height, !1),
            s.dispatchEvent({
                type: "sessionend"
            })
        }
        this.setFramebufferScaleFactor = function(J) {
            r = J,
            s.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")
        },
        this.setReferenceSpaceType = function(J) {
            o = J,
            s.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")
        },
        this.getReferenceSpace = function() {
            return c || a
        },
        this.setReferenceSpace = function(J) {
            c = J
        },
        this.getBaseLayer = function() {
            return u !== null ? u : f
        },
        this.getBinding = function() {
            return d
        },
        this.getFrame = function() {
            return p
        },
        this.getSession = function() {
            return n
        },
        this.setSession = async function(J) {
            if (n = J, n !== null) {
                if (g = e.getRenderTarget(), n.addEventListener("select", D), n.addEventListener("selectstart", D), n.addEventListener("selectend", D), n.addEventListener("squeeze", D), n.addEventListener("squeezestart", D), n.addEventListener("squeezeend", D), n.addEventListener("end", L), n.addEventListener("inputsourceschange", z), m.xrCompatible !== !0 && await t.makeXRCompatible(), w = e.getPixelRatio(), e.getSize(S), n.renderState.layers === void 0) {
                    const ue = {
                        antialias: m.antialias,
                        alpha: !0,
                        depth: m.depth,
                        stencil: m.stencil,
                        framebufferScaleFactor: r
                    };
                    f = new XRWebGLLayer(n, t, ue),
                    n.updateRenderState({
                        baseLayer: f
                    }),
                    e.setPixelRatio(1),
                    e.setSize(f.framebufferWidth, f.framebufferHeight, !1),
                    x = new vt(f.framebufferWidth, f.framebufferHeight, {
                        format: wt,
                        type: Ct,
                        colorSpace: e.outputColorSpace,
                        stencilBuffer: m.stencil
                    })
                } else {
                    let ue = null,
                        Pe = null,
                        Ee = null;
                    m.depth && (Ee = m.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, ue = m.stencil ? ua : wo, Pe = m.stencil ? ha : ca);
                    const it = {
                        colorFormat: t.RGBA8,
                        depthFormat: Ee,
                        scaleFactor: r
                    };
                    d = new XRWebGLBinding(n, t),
                    u = d.createProjectionLayer(it),
                    n.updateRenderState({
                        layers: [u]
                    }),
                    e.setPixelRatio(1),
                    e.setSize(u.textureWidth, u.textureHeight, !1),
                    x = new vt(u.textureWidth, u.textureHeight, {
                        format: wt,
                        type: Ct,
                        depthTexture: new Fo(u.textureWidth, u.textureHeight, Pe, void 0, void 0, void 0, void 0, void 0, void 0, ue),
                        stencilBuffer: m.stencil,
                        colorSpace: e.outputColorSpace,
                        samples: m.antialias ? 4 : 0,
                        resolveDepthBuffer: u.ignoreDepthValues === !1
                    })
                }
                x.isXRRenderTarget = !0,
                this.setFoveation(l),
                c = null,
                a = await n.requestReferenceSpace(o),
                ke.setContext(n),
                ke.start(),
                s.isPresenting = !0,
                s.dispatchEvent({
                    type: "sessionstart"
                })
            }
        },
        this.getEnvironmentBlendMode = function() {
            if (n !== null)
                return n.environmentBlendMode
        };
        function z(J) {
            for (let ue = 0; ue < J.removed.length; ue++) {
                const Pe = J.removed[ue],
                    Ee = y.indexOf(Pe);
                Ee >= 0 && (y[Ee] = null, v[Ee].disconnect(Pe))
            }
            for (let ue = 0; ue < J.added.length; ue++) {
                const Pe = J.added[ue];
                let Ee = y.indexOf(Pe);
                if (Ee === -1) {
                    for (let Ze = 0; Ze < v.length; Ze++)
                        if (Ze >= y.length) {
                            y.push(Pe),
                            Ee = Ze;
                            break
                        } else if (y[Ze] === null) {
                            y[Ze] = Pe,
                            Ee = Ze;
                            break
                        }
                    if (Ee === -1)
                        break
                }
                const it = v[Ee];
                it && it.connect(Pe)
            }
        }
        const O = new b,
            K = new b;
        function V(J, ue, Pe) {
            O.setFromMatrixPosition(ue.matrixWorld),
            K.setFromMatrixPosition(Pe.matrixWorld);
            const Ee = O.distanceTo(K),
                it = ue.projectionMatrix.elements,
                Ze = Pe.projectionMatrix.elements,
                Qe = it[14] / (it[10] - 1),
                N = it[14] / (it[10] + 1),
                lt = (it[9] + 1) / it[5],
                ht = (it[9] - 1) / it[5],
                St = (it[8] - 1) / it[0],
                Ge = (Ze[8] + 1) / Ze[0],
                dt = Qe * St,
                tt = Qe * Ge,
                $e = Ee / (-St + Ge),
                Xt = $e * -St;
            ue.matrixWorld.decompose(J.position, J.quaternion, J.scale),
            J.translateX(Xt),
            J.translateZ($e),
            J.matrixWorld.compose(J.position, J.quaternion, J.scale),
            J.matrixWorldInverse.copy(J.matrixWorld).invert();
            const R = Qe + $e,
                T = N + $e,
                W = dt - Xt,
                se = tt + (Ee - Xt),
                ce = lt * N / T * R,
                j = ht * N / T * R;
            J.projectionMatrix.makePerspective(W, se, ce, j, R, T),
            J.projectionMatrixInverse.copy(J.projectionMatrix).invert()
        }
        function pe(J, ue) {
            ue === null ? J.matrixWorld.copy(J.matrix) : J.matrixWorld.multiplyMatrices(ue.matrixWorld, J.matrix),
            J.matrixWorldInverse.copy(J.matrixWorld).invert()
        }
        this.updateCamera = function(J) {
            if (n === null)
                return;
            A.texture !== null && (J.near = A.depthNear, J.far = A.depthFar),
            _.near = M.near = C.near = J.near,
            _.far = M.far = C.far = J.far,
            (I !== _.near || P !== _.far) && (n.updateRenderState({
                depthNear: _.near,
                depthFar: _.far
            }), I = _.near, P = _.far, C.near = I, C.far = P, M.near = I, M.far = P, C.updateProjectionMatrix(), M.updateProjectionMatrix(), J.updateProjectionMatrix());
            const ue = J.parent,
                Pe = _.cameras;
            pe(_, ue);
            for (let Ee = 0; Ee < Pe.length; Ee++)
                pe(Pe[Ee], ue);
            Pe.length === 2 ? V(_, C, M) : _.projectionMatrix.copy(C.projectionMatrix),
            xe(J, _, ue)
        };
        function xe(J, ue, Pe) {
            Pe === null ? J.matrix.copy(ue.matrixWorld) : (J.matrix.copy(Pe.matrixWorld), J.matrix.invert(), J.matrix.multiply(ue.matrixWorld)),
            J.matrix.decompose(J.position, J.quaternion, J.scale),
            J.updateMatrixWorld(!0),
            J.projectionMatrix.copy(ue.projectionMatrix),
            J.projectionMatrixInverse.copy(ue.projectionMatrixInverse),
            J.isPerspectiveCamera && (J.fov = Uo * 2 * Math.atan(1 / J.projectionMatrix.elements[5]), J.zoom = 1)
        }
        this.getCamera = function() {
            return _
        },
        this.getFoveation = function() {
            if (!(u === null && f === null))
                return l
        },
        this.setFoveation = function(J) {
            l = J,
            u !== null && (u.fixedFoveation = J),
            f !== null && f.fixedFoveation !== void 0 && (f.fixedFoveation = J)
        },
        this.hasDepthSensing = function() {
            return A.texture !== null
        },
        this.getDepthSensingMesh = function() {
            return A.getMesh(_)
        };
        let Ae = null;
        function Ye(J, ue) {
            if (h = ue.getViewerPose(c || a), p = ue, h !== null) {
                const Pe = h.views;
                f !== null && (e.setRenderTargetFramebuffer(x, f.framebuffer), e.setRenderTarget(x));
                let Ee = !1;
                Pe.length !== _.cameras.length && (_.cameras.length = 0, Ee = !0);
                for (let Ze = 0; Ze < Pe.length; Ze++) {
                    const Qe = Pe[Ze];
                    let N = null;
                    if (f !== null)
                        N = f.getViewport(Qe);
                    else {
                        const ht = d.getViewSubImage(u, Qe);
                        N = ht.viewport,
                        Ze === 0 && (e.setRenderTargetTextures(x, ht.colorTexture, u.ignoreDepthValues ? void 0 : ht.depthStencilTexture), e.setRenderTarget(x))
                    }
                    let lt = E[Ze];
                    lt === void 0 && (lt = new gi, lt.layers.enable(Ze), lt.viewport = new yt, E[Ze] = lt),
                    lt.matrix.fromArray(Qe.transform.matrix),
                    lt.matrix.decompose(lt.position, lt.quaternion, lt.scale),
                    lt.projectionMatrix.fromArray(Qe.projectionMatrix),
                    lt.projectionMatrixInverse.copy(lt.projectionMatrix).invert(),
                    lt.viewport.set(N.x, N.y, N.width, N.height),
                    Ze === 0 && (_.matrix.copy(lt.matrix), _.matrix.decompose(_.position, _.quaternion, _.scale)),
                    Ee === !0 && _.cameras.push(lt)
                }
                const it = n.enabledFeatures;
                if (it && it.includes("depth-sensing")) {
                    const Ze = d.getDepthInformation(Pe[0]);
                    Ze && Ze.isValid && Ze.texture && A.init(e, Ze, n.renderState)
                }
            }
            for (let Pe = 0; Pe < v.length; Pe++) {
                const Ee = y[Pe],
                    it = v[Pe];
                Ee !== null && it !== void 0 && it.update(Ee, ue, c || a)
            }
            Ae && Ae(J, ue),
            ue.detectedPlanes && s.dispatchEvent({
                type: "planesdetected",
                data: ue
            }),
            p = null
        }
        const ke = new Uy;
        ke.setAnimationLoop(Ye),
        this.setAnimationLoop = function(J) {
            Ae = J
        },
        this.dispose = function() {}
    }
}
const Dr = new ln,
    KT = new De;
function JT(i, e) {
    function t(m, g) {
        m.matrixAutoUpdate === !0 && m.updateMatrix(),
        g.value.copy(m.matrix)
    }
    function s(m, g) {
        g.color.getRGB(m.fogColor.value, Dy(i)),
        g.isFog ? (m.fogNear.value = g.near, m.fogFar.value = g.far) : g.isFogExp2 && (m.fogDensity.value = g.density)
    }
    function n(m, g, x, v, y) {
        g.isMeshBasicMaterial || g.isMeshLambertMaterial ? r(m, g) : g.isMeshToonMaterial ? (r(m, g), d(m, g)) : g.isMeshPhongMaterial ? (r(m, g), h(m, g)) : g.isMeshStandardMaterial ? (r(m, g), u(m, g), g.isMeshPhysicalMaterial && f(m, g, y)) : g.isMeshMatcapMaterial ? (r(m, g), p(m, g)) : g.isMeshDepthMaterial ? r(m, g) : g.isMeshDistanceMaterial ? (r(m, g), A(m, g)) : g.isMeshNormalMaterial ? r(m, g) : g.isLineBasicMaterial ? (a(m, g), g.isLineDashedMaterial && o(m, g)) : g.isPointsMaterial ? l(m, g, x, v) : g.isSpriteMaterial ? c(m, g) : g.isShadowMaterial ? (m.color.value.copy(g.color), m.opacity.value = g.opacity) : g.isShaderMaterial && (g.uniformsNeedUpdate = !1)
    }
    function r(m, g) {
        m.opacity.value = g.opacity,
        g.color && m.diffuse.value.copy(g.color),
        g.emissive && m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),
        g.map && (m.map.value = g.map, t(g.map, m.mapTransform)),
        g.alphaMap && (m.alphaMap.value = g.alphaMap, t(g.alphaMap, m.alphaMapTransform)),
        g.bumpMap && (m.bumpMap.value = g.bumpMap, t(g.bumpMap, m.bumpMapTransform), m.bumpScale.value = g.bumpScale, g.side === ei && (m.bumpScale.value *= -1)),
        g.normalMap && (m.normalMap.value = g.normalMap, t(g.normalMap, m.normalMapTransform), m.normalScale.value.copy(g.normalScale), g.side === ei && m.normalScale.value.negate()),
        g.displacementMap && (m.displacementMap.value = g.displacementMap, t(g.displacementMap, m.displacementMapTransform), m.displacementScale.value = g.displacementScale, m.displacementBias.value = g.displacementBias),
        g.emissiveMap && (m.emissiveMap.value = g.emissiveMap, t(g.emissiveMap, m.emissiveMapTransform)),
        g.specularMap && (m.specularMap.value = g.specularMap, t(g.specularMap, m.specularMapTransform)),
        g.alphaTest > 0 && (m.alphaTest.value = g.alphaTest);
        const x = e.get(g),
            v = x.envMap,
            y = x.envMapRotation;
        v && (m.envMap.value = v, Dr.copy(y), Dr.x *= -1, Dr.y *= -1, Dr.z *= -1, v.isCubeTexture && v.isRenderTargetTexture === !1 && (Dr.y *= -1, Dr.z *= -1), m.envMapRotation.value.setFromMatrix4(KT.makeRotationFromEuler(Dr)), m.flipEnvMap.value = v.isCubeTexture && v.isRenderTargetTexture === !1 ? -1 : 1, m.reflectivity.value = g.reflectivity, m.ior.value = g.ior, m.refractionRatio.value = g.refractionRatio),
        g.lightMap && (m.lightMap.value = g.lightMap, m.lightMapIntensity.value = g.lightMapIntensity, t(g.lightMap, m.lightMapTransform)),
        g.aoMap && (m.aoMap.value = g.aoMap, m.aoMapIntensity.value = g.aoMapIntensity, t(g.aoMap, m.aoMapTransform))
    }
    function a(m, g) {
        m.diffuse.value.copy(g.color),
        m.opacity.value = g.opacity,
        g.map && (m.map.value = g.map, t(g.map, m.mapTransform))
    }
    function o(m, g) {
        m.dashSize.value = g.dashSize,
        m.totalSize.value = g.dashSize + g.gapSize,
        m.scale.value = g.scale
    }
    function l(m, g, x, v) {
        m.diffuse.value.copy(g.color),
        m.opacity.value = g.opacity,
        m.size.value = g.size * x,
        m.scale.value = v * .5,
        g.map && (m.map.value = g.map, t(g.map, m.uvTransform)),
        g.alphaMap && (m.alphaMap.value = g.alphaMap, t(g.alphaMap, m.alphaMapTransform)),
        g.alphaTest > 0 && (m.alphaTest.value = g.alphaTest)
    }
    function c(m, g) {
        m.diffuse.value.copy(g.color),
        m.opacity.value = g.opacity,
        m.rotation.value = g.rotation,
        g.map && (m.map.value = g.map, t(g.map, m.mapTransform)),
        g.alphaMap && (m.alphaMap.value = g.alphaMap, t(g.alphaMap, m.alphaMapTransform)),
        g.alphaTest > 0 && (m.alphaTest.value = g.alphaTest)
    }
    function h(m, g) {
        m.specular.value.copy(g.specular),
        m.shininess.value = Math.max(g.shininess, 1e-4)
    }
    function d(m, g) {
        g.gradientMap && (m.gradientMap.value = g.gradientMap)
    }
    function u(m, g) {
        m.metalness.value = g.metalness,
        g.metalnessMap && (m.metalnessMap.value = g.metalnessMap, t(g.metalnessMap, m.metalnessMapTransform)),
        m.roughness.value = g.roughness,
        g.roughnessMap && (m.roughnessMap.value = g.roughnessMap, t(g.roughnessMap, m.roughnessMapTransform)),
        g.envMap && (m.envMapIntensity.value = g.envMapIntensity)
    }
    function f(m, g, x) {
        m.ior.value = g.ior,
        g.sheen > 0 && (m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen), m.sheenRoughness.value = g.sheenRoughness, g.sheenColorMap && (m.sheenColorMap.value = g.sheenColorMap, t(g.sheenColorMap, m.sheenColorMapTransform)), g.sheenRoughnessMap && (m.sheenRoughnessMap.value = g.sheenRoughnessMap, t(g.sheenRoughnessMap, m.sheenRoughnessMapTransform))),
        g.clearcoat > 0 && (m.clearcoat.value = g.clearcoat, m.clearcoatRoughness.value = g.clearcoatRoughness, g.clearcoatMap && (m.clearcoatMap.value = g.clearcoatMap, t(g.clearcoatMap, m.clearcoatMapTransform)), g.clearcoatRoughnessMap && (m.clearcoatRoughnessMap.value = g.clearcoatRoughnessMap, t(g.clearcoatRoughnessMap, m.clearcoatRoughnessMapTransform)), g.clearcoatNormalMap && (m.clearcoatNormalMap.value = g.clearcoatNormalMap, t(g.clearcoatNormalMap, m.clearcoatNormalMapTransform), m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale), g.side === ei && m.clearcoatNormalScale.value.negate())),
        g.dispersion > 0 && (m.dispersion.value = g.dispersion),
        g.iridescence > 0 && (m.iridescence.value = g.iridescence, m.iridescenceIOR.value = g.iridescenceIOR, m.iridescenceThicknessMinimum.value = g.iridescenceThicknessRange[0], m.iridescenceThicknessMaximum.value = g.iridescenceThicknessRange[1], g.iridescenceMap && (m.iridescenceMap.value = g.iridescenceMap, t(g.iridescenceMap, m.iridescenceMapTransform)), g.iridescenceThicknessMap && (m.iridescenceThicknessMap.value = g.iridescenceThicknessMap, t(g.iridescenceThicknessMap, m.iridescenceThicknessMapTransform))),
        g.transmission > 0 && (m.transmission.value = g.transmission, m.transmissionSamplerMap.value = x.texture, m.transmissionSamplerSize.value.set(x.width, x.height), g.transmissionMap && (m.transmissionMap.value = g.transmissionMap, t(g.transmissionMap, m.transmissionMapTransform)), m.thickness.value = g.thickness, g.thicknessMap && (m.thicknessMap.value = g.thicknessMap, t(g.thicknessMap, m.thicknessMapTransform)), m.attenuationDistance.value = g.attenuationDistance, m.attenuationColor.value.copy(g.attenuationColor)),
        g.anisotropy > 0 && (m.anisotropyVector.value.set(g.anisotropy * Math.cos(g.anisotropyRotation), g.anisotropy * Math.sin(g.anisotropyRotation)), g.anisotropyMap && (m.anisotropyMap.value = g.anisotropyMap, t(g.anisotropyMap, m.anisotropyMapTransform))),
        m.specularIntensity.value = g.specularIntensity,
        m.specularColor.value.copy(g.specularColor),
        g.specularColorMap && (m.specularColorMap.value = g.specularColorMap, t(g.specularColorMap, m.specularColorMapTransform)),
        g.specularIntensityMap && (m.specularIntensityMap.value = g.specularIntensityMap, t(g.specularIntensityMap, m.specularIntensityMapTransform))
    }
    function p(m, g) {
        g.matcap && (m.matcap.value = g.matcap)
    }
    function A(m, g) {
        const x = e.get(g).light;
        m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),
        m.nearDistance.value = x.shadow.camera.near,
        m.farDistance.value = x.shadow.camera.far
    }
    return {
        refreshFogUniforms: s,
        refreshMaterialUniforms: n
    }
}
function jT(i, e, t, s) {
    let n = {},
        r = {},
        a = [];
    const o = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);
    function l(x, v) {
        const y = v.program;
        s.uniformBlockBinding(x, y)
    }
    function c(x, v) {
        let y = n[x.id];
        y === void 0 && (p(x), y = h(x), n[x.id] = y, x.addEventListener("dispose", m));
        const S = v.program;
        s.updateUBOMapping(x, S);
        const w = e.render.frame;
        r[x.id] !== w && (u(x), r[x.id] = w)
    }
    function h(x) {
        const v = d();
        x.__bindingPointIndex = v;
        const y = i.createBuffer(),
            S = x.__size,
            w = x.usage;
        return i.bindBuffer(i.UNIFORM_BUFFER, y), i.bufferData(i.UNIFORM_BUFFER, S, w), i.bindBuffer(i.UNIFORM_BUFFER, null), i.bindBufferBase(i.UNIFORM_BUFFER, v, y), y
    }
    function d() {
        for (let x = 0; x < o; x++)
            if (a.indexOf(x) === -1)
                return a.push(x), x;
        return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0
    }
    function u(x) {
        const v = n[x.id],
            y = x.uniforms,
            S = x.__cache;
        i.bindBuffer(i.UNIFORM_BUFFER, v);
        for (let w = 0, C = y.length; w < C; w++) {
            const M = Array.isArray(y[w]) ? y[w] : [y[w]];
            for (let E = 0, _ = M.length; E < _; E++) {
                const I = M[E];
                if (f(I, w, E, S) === !0) {
                    const P = I.__offset,
                        D = Array.isArray(I.value) ? I.value : [I.value];
                    let L = 0;
                    for (let z = 0; z < D.length; z++) {
                        const O = D[z],
                            K = A(O);
                        typeof O == "number" || typeof O == "boolean" ? (I.__data[0] = O, i.bufferSubData(i.UNIFORM_BUFFER, P + L, I.__data)) : O.isMatrix3 ? (I.__data[0] = O.elements[0], I.__data[1] = O.elements[1], I.__data[2] = O.elements[2], I.__data[3] = 0, I.__data[4] = O.elements[3], I.__data[5] = O.elements[4], I.__data[6] = O.elements[5], I.__data[7] = 0, I.__data[8] = O.elements[6], I.__data[9] = O.elements[7], I.__data[10] = O.elements[8], I.__data[11] = 0) : (O.toArray(I.__data, L), L += K.storage / Float32Array.BYTES_PER_ELEMENT)
                    }
                    i.bufferSubData(i.UNIFORM_BUFFER, P, I.__data)
                }
            }
        }
        i.bindBuffer(i.UNIFORM_BUFFER, null)
    }
    function f(x, v, y, S) {
        const w = x.value,
            C = v + "_" + y;
        if (S[C] === void 0)
            return typeof w == "number" || typeof w == "boolean" ? S[C] = w : S[C] = w.clone(), !0;
        {
            const M = S[C];
            if (typeof w == "number" || typeof w == "boolean") {
                if (M !== w)
                    return S[C] = w, !0
            } else if (M.equals(w) === !1)
                return M.copy(w), !0
        }
        return !1
    }
    function p(x) {
        const v = x.uniforms;
        let y = 0;
        const S = 16;
        for (let C = 0, M = v.length; C < M; C++) {
            const E = Array.isArray(v[C]) ? v[C] : [v[C]];
            for (let _ = 0, I = E.length; _ < I; _++) {
                const P = E[_],
                    D = Array.isArray(P.value) ? P.value : [P.value];
                for (let L = 0, z = D.length; L < z; L++) {
                    const O = D[L],
                        K = A(O),
                        V = y % S;
                    V !== 0 && S - V < K.boundary && (y += S - V),
                    P.__data = new Float32Array(K.storage / Float32Array.BYTES_PER_ELEMENT),
                    P.__offset = y,
                    y += K.storage
                }
            }
        }
        const w = y % S;
        return w > 0 && (y += S - w), x.__size = y, x.__cache = {}, this
    }
    function A(x) {
        const v = {
            boundary: 0,
            storage: 0
        };
        return typeof x == "number" || typeof x == "boolean" ? (v.boundary = 4, v.storage = 4) : x.isVector2 ? (v.boundary = 8, v.storage = 8) : x.isVector3 || x.isColor ? (v.boundary = 16, v.storage = 12) : x.isVector4 ? (v.boundary = 16, v.storage = 16) : x.isMatrix3 ? (v.boundary = 48, v.storage = 48) : x.isMatrix4 ? (v.boundary = 64, v.storage = 64) : x.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", x), v
    }
    function m(x) {
        const v = x.target;
        v.removeEventListener("dispose", m);
        const y = a.indexOf(v.__bindingPointIndex);
        a.splice(y, 1),
        i.deleteBuffer(n[v.id]),
        delete n[v.id],
        delete r[v.id]
    }
    function g() {
        for (const x in n)
            i.deleteBuffer(n[x]);
        a = [],
        n = {},
        r = {}
    }
    return {
        bind: l,
        update: c,
        dispose: g
    }
}
class ZT {
    constructor(e={})
    {
        const {canvas: t=qC(), context: s=null, depth: n=!0, stencil: r=!1, alpha: a=!1, antialias: o=!1, premultipliedAlpha: l=!0, preserveDrawingBuffer: c=!1, powerPreference: h="default", failIfMajorPerformanceCaveat: d=!1} = e;
        this.isWebGLRenderer = !0;
        let u;
        if (s !== null) {
            if (typeof WebGLRenderingContext < "u" && s instanceof WebGLRenderingContext)
                throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
            u = s.getContextAttributes().alpha
        } else
            u = a;
        const f = new Uint32Array(4),
            p = new Int32Array(4);
        let A = null,
            m = null;
        const g = [],
            x = [];
        this.domElement = t,
        this.debug = {
            checkShaderErrors: !0,
            onShaderError: null
        },
        this.autoClear = !0,
        this.autoClearColor = !0,
        this.autoClearDepth = !0,
        this.autoClearStencil = !0,
        this.sortObjects = !0,
        this.clippingPlanes = [],
        this.localClippingEnabled = !1,
        this._outputColorSpace = Ve,
        this.toneMapping = dr,
        this.toneMappingExposure = 1;
        const v = this;
        let y = !1,
            S = 0,
            w = 0,
            C = null,
            M = -1,
            E = null;
        const _ = new yt,
            I = new yt;
        let P = null;
        const D = new Z(0);
        let L = 0,
            z = t.width,
            O = t.height,
            K = 1,
            V = null,
            pe = null;
        const xe = new yt(0, 0, z, O),
            Ae = new yt(0, 0, z, O);
        let Ye = !1;
        const ke = new Ed;
        let J = !1,
            ue = !1;
        const Pe = new De,
            Ee = new b,
            it = {
                background: null,
                fog: null,
                environment: null,
                overrideMaterial: null,
                isScene: !0
            };
        let Ze = !1;
        function Qe() {
            return C === null ? K : 1
        }
        let N = s;
        function lt(B, k) {
            return t.getContext(B, k)
        }
        try {
            const B = {
                alpha: !0,
                depth: n,
                stencil: r,
                antialias: o,
                premultipliedAlpha: l,
                preserveDrawingBuffer: c,
                powerPreference: h,
                failIfMajorPerformanceCaveat: d
            };
            if ("setAttribute" in t && t.setAttribute("data-engine", `three.js r${Aa}`), t.addEventListener("webglcontextlost", Te, !1), t.addEventListener("webglcontextrestored", ee, !1), t.addEventListener("webglcontextcreationerror", ne, !1), N === null) {
                const k = "webgl2";
                if (N = lt(k, B), N === null)
                    throw lt(k) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.")
            }
        } catch (B) {
            throw console.error("THREE.WebGLRenderer: " + B.message), B
        }
        let ht,
            St,
            Ge,
            dt,
            tt,
            $e,
            Xt,
            R,
            T,
            W,
            se,
            ce,
            j,
            we,
            $,
            oe,
            qe,
            de,
            me,
            ye,
            Ne,
            be,
            st,
            ft;
        function ni() {
            ht = new ob(N),
            ht.init(),
            be = new GT(N, ht),
            St = new tb(N, ht, e, be),
            Ge = new zT(N),
            dt = new hb(N),
            tt = new bT,
            $e = new QT(N, ht, Ge, tt, St, be, dt),
            Xt = new sb(v),
            R = new ab(v),
            T = new g1(N),
            st = new $M(N, T),
            W = new lb(N, T, dt, st),
            se = new db(N, W, T, dt),
            me = new ub(N, St, $e),
            oe = new ib(tt),
            ce = new MT(v, Xt, R, ht, St, st, oe),
            j = new JT(v, tt),
            we = new IT,
            $ = new LT(ht),
            de = new ZM(v, Xt, R, Ge, se, u, l),
            qe = new kT(v, se, St),
            ft = new jT(N, dt, St, Ge),
            ye = new eb(N, ht, dt),
            Ne = new cb(N, ht, dt),
            dt.programs = ce.programs,
            v.capabilities = St,
            v.extensions = ht,
            v.properties = tt,
            v.renderLists = we,
            v.shadowMap = qe,
            v.state = Ge,
            v.info = dt
        }
        ni();
        const F = new XT(v, N);
        this.xr = F,
        this.getContext = function() {
            return N
        },
        this.getContextAttributes = function() {
            return N.getContextAttributes()
        },
        this.forceContextLoss = function() {
            const B = ht.get("WEBGL_lose_context");
            B && B.loseContext()
        },
        this.forceContextRestore = function() {
            const B = ht.get("WEBGL_lose_context");
            B && B.restoreContext()
        },
        this.getPixelRatio = function() {
            return K
        },
        this.setPixelRatio = function(B) {
            B !== void 0 && (K = B, this.setSize(z, O, !1))
        },
        this.getSize = function(B) {
            return B.set(z, O)
        },
        this.setSize = function(B, k, Y=!0) {
            if (F.isPresenting) {
                console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
                return
            }
            z = B,
            O = k,
            t.width = Math.floor(B * K),
            t.height = Math.floor(k * K),
            Y === !0 && (t.style.width = B + "px", t.style.height = k + "px"),
            this.setViewport(0, 0, B, k)
        },
        this.getDrawingBufferSize = function(B) {
            return B.set(z * K, O * K).floor()
        },
        this.setDrawingBufferSize = function(B, k, Y) {
            z = B,
            O = k,
            K = Y,
            t.width = Math.floor(B * Y),
            t.height = Math.floor(k * Y),
            this.setViewport(0, 0, B, k)
        },
        this.getCurrentViewport = function(B) {
            return B.copy(_)
        },
        this.getViewport = function(B) {
            return B.copy(xe)
        },
        this.setViewport = function(B, k, Y, X) {
            B.isVector4 ? xe.set(B.x, B.y, B.z, B.w) : xe.set(B, k, Y, X),
            Ge.viewport(_.copy(xe).multiplyScalar(K).round())
        },
        this.getScissor = function(B) {
            return B.copy(Ae)
        },
        this.setScissor = function(B, k, Y, X) {
            B.isVector4 ? Ae.set(B.x, B.y, B.z, B.w) : Ae.set(B, k, Y, X),
            Ge.scissor(I.copy(Ae).multiplyScalar(K).round())
        },
        this.getScissorTest = function() {
            return Ye
        },
        this.setScissorTest = function(B) {
            Ge.setScissorTest(Ye = B)
        },
        this.setOpaqueSort = function(B) {
            V = B
        },
        this.setTransparentSort = function(B) {
            pe = B
        },
        this.getClearColor = function(B) {
            return B.copy(de.getClearColor())
        },
        this.setClearColor = function() {
            de.setClearColor.apply(de, arguments)
        },
        this.getClearAlpha = function() {
            return de.getClearAlpha()
        },
        this.setClearAlpha = function() {
            de.setClearAlpha.apply(de, arguments)
        },
        this.clear = function(B=!0, k=!0, Y=!0) {
            let X = 0;
            if (B) {
                let G = !1;
                if (C !== null) {
                    const ge = C.texture.format;
                    G = ge === Ey || ge === wy || ge === _y
                }
                if (G) {
                    const ge = C.texture.type,
                        Ie = ge === Ct || ge === ca || ge === Gu || ge === ha || ge === xy || ge === yy,
                        Re = de.getClearColor(),
                        Le = de.getClearAlpha(),
                        Xe = Re.r,
                        Ke = Re.g,
                        He = Re.b;
                    Ie ? (f[0] = Xe, f[1] = Ke, f[2] = He, f[3] = Le, N.clearBufferuiv(N.COLOR, 0, f)) : (p[0] = Xe, p[1] = Ke, p[2] = He, p[3] = Le, N.clearBufferiv(N.COLOR, 0, p))
                } else
                    X |= N.COLOR_BUFFER_BIT
            }
            k && (X |= N.DEPTH_BUFFER_BIT),
            Y && (X |= N.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)),
            N.clear(X)
        },
        this.clearColor = function() {
            this.clear(!0, !1, !1)
        },
        this.clearDepth = function() {
            this.clear(!1, !0, !1)
        },
        this.clearStencil = function() {
            this.clear(!1, !1, !0)
        },
        this.dispose = function() {
            t.removeEventListener("webglcontextlost", Te, !1),
            t.removeEventListener("webglcontextrestored", ee, !1),
            t.removeEventListener("webglcontextcreationerror", ne, !1),
            we.dispose(),
            $.dispose(),
            tt.dispose(),
            Xt.dispose(),
            R.dispose(),
            se.dispose(),
            st.dispose(),
            ft.dispose(),
            ce.dispose(),
            F.dispose(),
            F.removeEventListener("sessionstart", qs),
            F.removeEventListener("sessionend", Xs),
            Sr.stop()
        };
        function Te(B) {
            B.preventDefault(),
            console.log("THREE.WebGLRenderer: Context Lost."),
            y = !0
        }
        function ee() {
            console.log("THREE.WebGLRenderer: Context Restored."),
            y = !1;
            const B = dt.autoReset,
                k = qe.enabled,
                Y = qe.autoUpdate,
                X = qe.needsUpdate,
                G = qe.type;
            ni(),
            dt.autoReset = B,
            qe.enabled = k,
            qe.autoUpdate = Y,
            qe.needsUpdate = X,
            qe.type = G
        }
        function ne(B) {
            console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", B.statusMessage)
        }
        function _e(B) {
            const k = B.target;
            k.removeEventListener("dispose", _e),
            je(k)
        }
        function je(B) {
            xt(B),
            tt.remove(B)
        }
        function xt(B) {
            const k = tt.get(B).programs;
            k !== void 0 && (k.forEach(function(Y) {
                ce.releaseProgram(Y)
            }), B.isShaderMaterial && ce.releaseShaderCache(B))
        }
        this.renderBufferDirect = function(B, k, Y, X, G, ge) {
            k === null && (k = it);
            const Ie = G.isMesh && G.matrixWorld.determinant() < 0,
                Re = TE(B, k, Y, X, G);
            Ge.setMaterial(X, Ie);
            let Le = Y.index,
                Xe = 1;
            if (X.wireframe === !0) {
                if (Le = W.getWireframeAttribute(Y), Le === void 0)
                    return;
                Xe = 2
            }
            const Ke = Y.drawRange,
                He = Y.attributes.position;
            let Et = Ke.start * Xe,
                Kt = (Ke.start + Ke.count) * Xe;
            ge !== null && (Et = Math.max(Et, ge.start * Xe), Kt = Math.min(Kt, (ge.start + ge.count) * Xe)),
            Le !== null ? (Et = Math.max(Et, 0), Kt = Math.min(Kt, Le.count)) : He != null && (Et = Math.max(Et, 0), Kt = Math.min(Kt, He.count));
            const Jt = Kt - Et;
            if (Jt < 0 || Jt === 1 / 0)
                return;
            st.setup(G, X, Re, Y, Le);
            let is,
                Mt = ye;
            if (Le !== null && (is = T.get(Le), Mt = Ne, Mt.setIndex(is)), G.isMesh)
                X.wireframe === !0 ? (Ge.setLineWidth(X.wireframeLinewidth * Qe()), Mt.setMode(N.LINES)) : Mt.setMode(N.TRIANGLES);
            else if (G.isLine) {
                let ze = X.linewidth;
                ze === void 0 && (ze = 1),
                Ge.setLineWidth(ze * Qe()),
                G.isLineSegments ? Mt.setMode(N.LINES) : G.isLineLoop ? Mt.setMode(N.LINE_LOOP) : Mt.setMode(N.LINE_STRIP)
            } else
                G.isPoints ? Mt.setMode(N.POINTS) : G.isSprite && Mt.setMode(N.TRIANGLES);
            if (G.isBatchedMesh)
                G._multiDrawInstances !== null ? Mt.renderMultiDrawInstances(G._multiDrawStarts, G._multiDrawCounts, G._multiDrawCount, G._multiDrawInstances) : Mt.renderMultiDraw(G._multiDrawStarts, G._multiDrawCounts, G._multiDrawCount);
            else if (G.isInstancedMesh)
                Mt.renderInstances(Et, Jt, G.count);
            else if (Y.isInstancedBufferGeometry) {
                const ze = Y._maxInstanceCount !== void 0 ? Y._maxInstanceCount : 1 / 0,
                    Ni = Math.min(Y.instanceCount, ze);
                Mt.renderInstances(Et, Jt, Ni)
            } else
                Mt.render(Et, Jt)
        };
        function ri(B, k, Y) {
            B.transparent === !0 && B.side === xi && B.forceSinglePass === !1 ? (B.side = ei, B.needsUpdate = !0, Nc(B, k, Y), B.side = es, B.needsUpdate = !0, Nc(B, k, Y), B.side = xi) : Nc(B, k, Y)
        }
        this.compile = function(B, k, Y=null) {
            Y === null && (Y = B),
            m = $.get(Y),
            m.init(k),
            x.push(m),
            Y.traverseVisible(function(G) {
                G.isLight && G.layers.test(k.layers) && (m.pushLight(G), G.castShadow && m.pushShadow(G))
            }),
            B !== Y && B.traverseVisible(function(G) {
                G.isLight && G.layers.test(k.layers) && (m.pushLight(G), G.castShadow && m.pushShadow(G))
            }),
            m.setupLights();
            const X = new Set;
            return B.traverse(function(G) {
                const ge = G.material;
                if (ge)
                    if (Array.isArray(ge))
                        for (let Ie = 0; Ie < ge.length; Ie++) {
                            const Re = ge[Ie];
                            ri(Re, Y, G),
                            X.add(Re)
                        }
                    else
                        ri(ge, Y, G),
                        X.add(ge)
            }), x.pop(), m = null, X
        },
        this.compileAsync = function(B, k, Y=null) {
            const X = this.compile(B, k, Y);
            return new Promise(G => {
                function ge() {
                    if (X.forEach(function(Ie) {
                        tt.get(Ie).currentProgram.isReady() && X.delete(Ie)
                    }), X.size === 0) {
                        G(B);
                        return
                    }
                    setTimeout(ge, 10)
                }
                ht.get("KHR_parallel_shader_compile") !== null ? ge() : setTimeout(ge, 10)
            })
        };
        let pi = null;
        function Bt(B) {
            pi && pi(B)
        }
        function qs() {
            Sr.stop()
        }
        function Xs() {
            Sr.start()
        }
        const Sr = new Uy;
        Sr.setAnimationLoop(Bt),
        typeof self < "u" && Sr.setContext(self),
        this.setAnimationLoop = function(B) {
            pi = B,
            F.setAnimationLoop(B),
            B === null ? Sr.stop() : Sr.start()
        },
        F.addEventListener("sessionstart", qs),
        F.addEventListener("sessionend", Xs),
        this.render = function(B, k) {
            if (k !== void 0 && k.isCamera !== !0) {
                console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
                return
            }
            if (y === !0)
                return;
            if (B.matrixWorldAutoUpdate === !0 && B.updateMatrixWorld(), k.parent === null && k.matrixWorldAutoUpdate === !0 && k.updateMatrixWorld(), F.enabled === !0 && F.isPresenting === !0 && (F.cameraAutoUpdate === !0 && F.updateCamera(k), k = F.getCamera()), B.isScene === !0 && B.onBeforeRender(v, B, k, C), m = $.get(B, x.length), m.init(k), x.push(m), Pe.multiplyMatrices(k.projectionMatrix, k.matrixWorldInverse), ke.setFromProjectionMatrix(Pe), ue = this.localClippingEnabled, J = oe.init(this.clippingPlanes, ue), A = we.get(B, g.length), A.init(), g.push(A), F.enabled === !0 && F.isPresenting === !0) {
                const ge = v.xr.getDepthSensingMesh();
                ge !== null && kd(ge, k, -1 / 0, v.sortObjects)
            }
            kd(B, k, 0, v.sortObjects),
            A.finish(),
            v.sortObjects === !0 && A.sort(V, pe),
            Ze = F.enabled === !1 || F.isPresenting === !1 || F.hasDepthSensing() === !1,
            Ze && de.addToRenderList(A, B),
            this.info.render.frame++,
            J === !0 && oe.beginShadows();
            const Y = m.state.shadowsArray;
            qe.render(Y, B, k),
            J === !0 && oe.endShadows(),
            this.info.autoReset === !0 && this.info.reset();
            const X = A.opaque,
                G = A.transmissive;
            if (m.setupLights(), k.isArrayCamera) {
                const ge = k.cameras;
                if (G.length > 0)
                    for (let Ie = 0, Re = ge.length; Ie < Re; Ie++) {
                        const Le = ge[Ie];
                        Ig(X, G, B, Le)
                    }
                Ze && de.render(B);
                for (let Ie = 0, Re = ge.length; Ie < Re; Ie++) {
                    const Le = ge[Ie];
                    Tg(A, B, Le, Le.viewport)
                }
            } else
                G.length > 0 && Ig(X, G, B, k),
                Ze && de.render(B),
                Tg(A, B, k);
            C !== null && ($e.updateMultisampleRenderTarget(C), $e.updateRenderTargetMipmap(C)),
            B.isScene === !0 && B.onAfterRender(v, B, k),
            st.resetDefaultState(),
            M = -1,
            E = null,
            x.pop(),
            x.length > 0 ? (m = x[x.length - 1], J === !0 && oe.setGlobalState(v.clippingPlanes, m.state.camera)) : m = null,
            g.pop(),
            g.length > 0 ? A = g[g.length - 1] : A = null
        };
        function kd(B, k, Y, X) {
            if (B.visible === !1)
                return;
            if (B.layers.test(k.layers)) {
                if (B.isGroup)
                    Y = B.renderOrder;
                else if (B.isLOD)
                    B.autoUpdate === !0 && B.update(k);
                else if (B.isLight)
                    m.pushLight(B),
                    B.castShadow && m.pushShadow(B);
                else if (B.isSprite) {
                    if (!B.frustumCulled || ke.intersectsSprite(B)) {
                        X && Ee.setFromMatrixPosition(B.matrixWorld).applyMatrix4(Pe);
                        const Ie = se.update(B),
                            Re = B.material;
                        Re.visible && A.push(B, Ie, Re, Y, Ee.z, null)
                    }
                } else if ((B.isMesh || B.isLine || B.isPoints) && (!B.frustumCulled || ke.intersectsObject(B))) {
                    const Ie = se.update(B),
                        Re = B.material;
                    if (X && (B.boundingSphere !== void 0 ? (B.boundingSphere === null && B.computeBoundingSphere(), Ee.copy(B.boundingSphere.center)) : (Ie.boundingSphere === null && Ie.computeBoundingSphere(), Ee.copy(Ie.boundingSphere.center)), Ee.applyMatrix4(B.matrixWorld).applyMatrix4(Pe)), Array.isArray(Re)) {
                        const Le = Ie.groups;
                        for (let Xe = 0, Ke = Le.length; Xe < Ke; Xe++) {
                            const He = Le[Xe],
                                Et = Re[He.materialIndex];
                            Et && Et.visible && A.push(B, Ie, Et, Y, Ee.z, He)
                        }
                    } else
                        Re.visible && A.push(B, Ie, Re, Y, Ee.z, null)
                }
            }
            const ge = B.children;
            for (let Ie = 0, Re = ge.length; Ie < Re; Ie++)
                kd(ge[Ie], k, Y, X)
        }
        function Tg(B, k, Y, X) {
            const G = B.opaque,
                ge = B.transmissive,
                Ie = B.transparent;
            m.setupLightsView(Y),
            J === !0 && oe.setGlobalState(v.clippingPlanes, Y),
            X && Ge.viewport(_.copy(X)),
            G.length > 0 && Fc(G, k, Y),
            ge.length > 0 && Fc(ge, k, Y),
            Ie.length > 0 && Fc(Ie, k, Y),
            Ge.buffers.depth.setTest(!0),
            Ge.buffers.depth.setMask(!0),
            Ge.buffers.color.setMask(!0),
            Ge.setPolygonOffset(!1)
        }
        function Ig(B, k, Y, X) {
            if ((Y.isScene === !0 ? Y.overrideMaterial : null) !== null)
                return;
            m.state.transmissionRenderTarget[X.id] === void 0 && (m.state.transmissionRenderTarget[X.id] = new vt(1, 1, {
                generateMipmaps: !0,
                type: ht.has("EXT_color_buffer_half_float") || ht.has("EXT_color_buffer_float") ? Mi : Ct,
                minFilter: Qs,
                samples: 4,
                stencilBuffer: r,
                resolveDepthBuffer: !1,
                resolveStencilBuffer: !1,
                colorSpace: mt.workingColorSpace
            }));
            const ge = m.state.transmissionRenderTarget[X.id],
                Ie = X.viewport || _;
            ge.setSize(Ie.z, Ie.w);
            const Re = v.getRenderTarget();
            v.setRenderTarget(ge),
            v.getClearColor(D),
            L = v.getClearAlpha(),
            L < 1 && v.setClearColor(16777215, .5),
            Ze ? de.render(Y) : v.clear();
            const Le = v.toneMapping;
            v.toneMapping = dr;
            const Xe = X.viewport;
            if (X.viewport !== void 0 && (X.viewport = void 0), m.setupLightsView(X), J === !0 && oe.setGlobalState(v.clippingPlanes, X), Fc(B, Y, X), $e.updateMultisampleRenderTarget(ge), $e.updateRenderTargetMipmap(ge), ht.has("WEBGL_multisampled_render_to_texture") === !1) {
                let Ke = !1;
                for (let He = 0, Et = k.length; He < Et; He++) {
                    const Kt = k[He],
                        Jt = Kt.object,
                        is = Kt.geometry,
                        Mt = Kt.material,
                        ze = Kt.group;
                    if (Mt.side === xi && Jt.layers.test(X.layers)) {
                        const Ni = Mt.side;
                        Mt.side = ei,
                        Mt.needsUpdate = !0,
                        Bg(Jt, Y, X, is, Mt, ze),
                        Mt.side = Ni,
                        Mt.needsUpdate = !0,
                        Ke = !0
                    }
                }
                Ke === !0 && ($e.updateMultisampleRenderTarget(ge), $e.updateRenderTargetMipmap(ge))
            }
            v.setRenderTarget(Re),
            v.setClearColor(D, L),
            Xe !== void 0 && (X.viewport = Xe),
            v.toneMapping = Le
        }
        function Fc(B, k, Y) {
            const X = k.isScene === !0 ? k.overrideMaterial : null;
            for (let G = 0, ge = B.length; G < ge; G++) {
                const Ie = B[G],
                    Re = Ie.object,
                    Le = Ie.geometry,
                    Xe = X === null ? Ie.material : X,
                    Ke = Ie.group;
                Re.layers.test(Y.layers) && Bg(Re, k, Y, Le, Xe, Ke)
            }
        }
        function Bg(B, k, Y, X, G, ge) {
            B.onBeforeRender(v, k, Y, X, G, ge),
            B.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse, B.matrixWorld),
            B.normalMatrix.getNormalMatrix(B.modelViewMatrix),
            G.onBeforeRender(v, k, Y, X, B, ge),
            G.transparent === !0 && G.side === xi && G.forceSinglePass === !1 ? (G.side = ei, G.needsUpdate = !0, v.renderBufferDirect(Y, k, X, G, B, ge), G.side = es, G.needsUpdate = !0, v.renderBufferDirect(Y, k, X, G, B, ge), G.side = xi) : v.renderBufferDirect(Y, k, X, G, B, ge),
            B.onAfterRender(v, k, Y, X, G, ge)
        }
        function Nc(B, k, Y) {
            k.isScene !== !0 && (k = it);
            const X = tt.get(B),
                G = m.state.lights,
                ge = m.state.shadowsArray,
                Ie = G.state.version,
                Re = ce.getParameters(B, G.state, ge, k, Y),
                Le = ce.getProgramCacheKey(Re);
            let Xe = X.programs;
            X.environment = B.isMeshStandardMaterial ? k.environment : null,
            X.fog = k.fog,
            X.envMap = (B.isMeshStandardMaterial ? R : Xt).get(B.envMap || X.environment),
            X.envMapRotation = X.environment !== null && B.envMap === null ? k.environmentRotation : B.envMapRotation,
            Xe === void 0 && (B.addEventListener("dispose", _e), Xe = new Map, X.programs = Xe);
            let Ke = Xe.get(Le);
            if (Ke !== void 0) {
                if (X.currentProgram === Ke && X.lightsStateVersion === Ie)
                    return Dg(B, Re), Ke
            } else
                Re.uniforms = ce.getUniforms(B),
                B.onBuild(Y, Re, v),
                B.onBeforeCompile(Re, v),
                Ke = ce.acquireProgram(Re, Le),
                Xe.set(Le, Ke),
                X.uniforms = Re.uniforms;
            const He = X.uniforms;
            return (!B.isShaderMaterial && !B.isRawShaderMaterial || B.clipping === !0) && (He.clippingPlanes = oe.uniform), Dg(B, Re), X.needsLights = BE(B), X.lightsStateVersion = Ie, X.needsLights && (He.ambientLightColor.value = G.state.ambient, He.lightProbe.value = G.state.probe, He.directionalLights.value = G.state.directional, He.directionalLightShadows.value = G.state.directionalShadow, He.spotLights.value = G.state.spot, He.spotLightShadows.value = G.state.spotShadow, He.rectAreaLights.value = G.state.rectArea, He.ltc_1.value = G.state.rectAreaLTC1, He.ltc_2.value = G.state.rectAreaLTC2, He.pointLights.value = G.state.point, He.pointLightShadows.value = G.state.pointShadow, He.hemisphereLights.value = G.state.hemi, He.directionalShadowMap.value = G.state.directionalShadowMap, He.directionalShadowMatrix.value = G.state.directionalShadowMatrix, He.spotShadowMap.value = G.state.spotShadowMap, He.spotLightMatrix.value = G.state.spotLightMatrix, He.spotLightMap.value = G.state.spotLightMap, He.pointShadowMap.value = G.state.pointShadowMap, He.pointShadowMatrix.value = G.state.pointShadowMatrix), X.currentProgram = Ke, X.uniformsList = null, Ke
        }
        function Pg(B) {
            if (B.uniformsList === null) {
                const k = B.currentProgram.getUniforms();
                B.uniformsList = Zh.seqWithValue(k.seq, B.uniforms)
            }
            return B.uniformsList
        }
        function Dg(B, k) {
            const Y = tt.get(B);
            Y.outputColorSpace = k.outputColorSpace,
            Y.batching = k.batching,
            Y.batchingColor = k.batchingColor,
            Y.instancing = k.instancing,
            Y.instancingColor = k.instancingColor,
            Y.instancingMorph = k.instancingMorph,
            Y.skinning = k.skinning,
            Y.morphTargets = k.morphTargets,
            Y.morphNormals = k.morphNormals,
            Y.morphColors = k.morphColors,
            Y.morphTargetsCount = k.morphTargetsCount,
            Y.numClippingPlanes = k.numClippingPlanes,
            Y.numIntersection = k.numClipIntersection,
            Y.vertexAlphas = k.vertexAlphas,
            Y.vertexTangents = k.vertexTangents,
            Y.toneMapping = k.toneMapping
        }
        function TE(B, k, Y, X, G) {
            k.isScene !== !0 && (k = it),
            $e.resetTextureUnits();
            const ge = k.fog,
                Ie = X.isMeshStandardMaterial ? k.environment : null,
                Re = C === null ? v.outputColorSpace : C.isXRRenderTarget === !0 ? C.texture.colorSpace : oi,
                Le = (X.isMeshStandardMaterial ? R : Xt).get(X.envMap || Ie),
                Xe = X.vertexColors === !0 && !!Y.attributes.color && Y.attributes.color.itemSize === 4,
                Ke = !!Y.attributes.tangent && (!!X.normalMap || X.anisotropy > 0),
                He = !!Y.morphAttributes.position,
                Et = !!Y.morphAttributes.normal,
                Kt = !!Y.morphAttributes.color;
            let Jt = dr;
            X.toneMapped && (C === null || C.isXRRenderTarget === !0) && (Jt = v.toneMapping);
            const is = Y.morphAttributes.position || Y.morphAttributes.normal || Y.morphAttributes.color,
                Mt = is !== void 0 ? is.length : 0,
                ze = tt.get(X),
                Ni = m.state.lights;
            if (J === !0 && (ue === !0 || B !== E)) {
                const vs = B === E && X.id === M;
                oe.setState(X, B, vs)
            }
            let Pt = !1;
            X.version === ze.__version ? (ze.needsLights && ze.lightsStateVersion !== Ni.state.version || ze.outputColorSpace !== Re || G.isBatchedMesh && ze.batching === !1 || !G.isBatchedMesh && ze.batching === !0 || G.isBatchedMesh && ze.batchingColor === !0 && G.colorTexture === null || G.isBatchedMesh && ze.batchingColor === !1 && G.colorTexture !== null || G.isInstancedMesh && ze.instancing === !1 || !G.isInstancedMesh && ze.instancing === !0 || G.isSkinnedMesh && ze.skinning === !1 || !G.isSkinnedMesh && ze.skinning === !0 || G.isInstancedMesh && ze.instancingColor === !0 && G.instanceColor === null || G.isInstancedMesh && ze.instancingColor === !1 && G.instanceColor !== null || G.isInstancedMesh && ze.instancingMorph === !0 && G.morphTexture === null || G.isInstancedMesh && ze.instancingMorph === !1 && G.morphTexture !== null || ze.envMap !== Le || X.fog === !0 && ze.fog !== ge || ze.numClippingPlanes !== void 0 && (ze.numClippingPlanes !== oe.numPlanes || ze.numIntersection !== oe.numIntersection) || ze.vertexAlphas !== Xe || ze.vertexTangents !== Ke || ze.morphTargets !== He || ze.morphNormals !== Et || ze.morphColors !== Kt || ze.toneMapping !== Jt || ze.morphTargetsCount !== Mt) && (Pt = !0) : (Pt = !0, ze.__version = X.version);
            let fn = ze.currentProgram;
            Pt === !0 && (fn = Nc(X, k, G));
            let Oc = !1,
                Mr = !1,
                zd = !1;
            const mi = fn.getUniforms(),
                On = ze.uniforms;
            if (Ge.useProgram(fn.program) && (Oc = !0, Mr = !0, zd = !0), X.id !== M && (M = X.id, Mr = !0), Oc || E !== B) {
                mi.setValue(N, "projectionMatrix", B.projectionMatrix),
                mi.setValue(N, "viewMatrix", B.matrixWorldInverse);
                const vs = mi.map.cameraPosition;
                vs !== void 0 && vs.setValue(N, Ee.setFromMatrixPosition(B.matrixWorld)),
                St.logarithmicDepthBuffer && mi.setValue(N, "logDepthBufFC", 2 / (Math.log(B.far + 1) / Math.LN2)),
                (X.isMeshPhongMaterial || X.isMeshToonMaterial || X.isMeshLambertMaterial || X.isMeshBasicMaterial || X.isMeshStandardMaterial || X.isShaderMaterial) && mi.setValue(N, "isOrthographic", B.isOrthographicCamera === !0),
                E !== B && (E = B, Mr = !0, zd = !0)
            }
            if (G.isSkinnedMesh) {
                mi.setOptional(N, G, "bindMatrix"),
                mi.setOptional(N, G, "bindMatrixInverse");
                const vs = G.skeleton;
                vs && (vs.boneTexture === null && vs.computeBoneTexture(), mi.setValue(N, "boneTexture", vs.boneTexture, $e))
            }
            G.isBatchedMesh && (mi.setOptional(N, G, "batchingTexture"), mi.setValue(N, "batchingTexture", G._matricesTexture, $e), mi.setOptional(N, G, "batchingColorTexture"), G._colorsTexture !== null && mi.setValue(N, "batchingColorTexture", G._colorsTexture, $e));
            const Qd = Y.morphAttributes;
            if ((Qd.position !== void 0 || Qd.normal !== void 0 || Qd.color !== void 0) && me.update(G, Y, fn), (Mr || ze.receiveShadow !== G.receiveShadow) && (ze.receiveShadow = G.receiveShadow, mi.setValue(N, "receiveShadow", G.receiveShadow)), X.isMeshGouraudMaterial && X.envMap !== null && (On.envMap.value = Le, On.flipEnvMap.value = Le.isCubeTexture && Le.isRenderTargetTexture === !1 ? -1 : 1), X.isMeshStandardMaterial && X.envMap === null && k.environment !== null && (On.envMapIntensity.value = k.environmentIntensity), Mr && (mi.setValue(N, "toneMappingExposure", v.toneMappingExposure), ze.needsLights && IE(On, zd), ge && X.fog === !0 && j.refreshFogUniforms(On, ge), j.refreshMaterialUniforms(On, X, K, O, m.state.transmissionRenderTarget[B.id]), Zh.upload(N, Pg(ze), On, $e)), X.isShaderMaterial && X.uniformsNeedUpdate === !0 && (Zh.upload(N, Pg(ze), On, $e), X.uniformsNeedUpdate = !1), X.isSpriteMaterial && mi.setValue(N, "center", G.center), mi.setValue(N, "modelViewMatrix", G.modelViewMatrix), mi.setValue(N, "normalMatrix", G.normalMatrix), mi.setValue(N, "modelMatrix", G.matrixWorld), X.isShaderMaterial || X.isRawShaderMaterial) {
                const vs = X.uniformsGroups;
                for (let Gd = 0, PE = vs.length; Gd < PE; Gd++) {
                    const Rg = vs[Gd];
                    ft.update(Rg, fn),
                    ft.bind(Rg, fn)
                }
            }
            return fn
        }
        function IE(B, k) {
            B.ambientLightColor.needsUpdate = k,
            B.lightProbe.needsUpdate = k,
            B.directionalLights.needsUpdate = k,
            B.directionalLightShadows.needsUpdate = k,
            B.pointLights.needsUpdate = k,
            B.pointLightShadows.needsUpdate = k,
            B.spotLights.needsUpdate = k,
            B.spotLightShadows.needsUpdate = k,
            B.rectAreaLights.needsUpdate = k,
            B.hemisphereLights.needsUpdate = k
        }
        function BE(B) {
            return B.isMeshLambertMaterial || B.isMeshToonMaterial || B.isMeshPhongMaterial || B.isMeshStandardMaterial || B.isShadowMaterial || B.isShaderMaterial && B.lights === !0
        }
        this.getActiveCubeFace = function() {
            return S
        },
        this.getActiveMipmapLevel = function() {
            return w
        },
        this.getRenderTarget = function() {
            return C
        },
        this.setRenderTargetTextures = function(B, k, Y) {
            tt.get(B.texture).__webglTexture = k,
            tt.get(B.depthTexture).__webglTexture = Y;
            const X = tt.get(B);
            X.__hasExternalTextures = !0,
            X.__autoAllocateDepthBuffer = Y === void 0,
            X.__autoAllocateDepthBuffer || ht.has("WEBGL_multisampled_render_to_texture") === !0 && (console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"), X.__useRenderToTexture = !1)
        },
        this.setRenderTargetFramebuffer = function(B, k) {
            const Y = tt.get(B);
            Y.__webglFramebuffer = k,
            Y.__useDefaultFramebuffer = k === void 0
        },
        this.setRenderTarget = function(B, k=0, Y=0) {
            C = B,
            S = k,
            w = Y;
            let X = !0,
                G = null,
                ge = !1,
                Ie = !1;
            if (B) {
                const Le = tt.get(B);
                Le.__useDefaultFramebuffer !== void 0 ? (Ge.bindFramebuffer(N.FRAMEBUFFER, null), X = !1) : Le.__webglFramebuffer === void 0 ? $e.setupRenderTarget(B) : Le.__hasExternalTextures && $e.rebindTextures(B, tt.get(B.texture).__webglTexture, tt.get(B.depthTexture).__webglTexture);
                const Xe = B.texture;
                (Xe.isData3DTexture || Xe.isDataArrayTexture || Xe.isCompressedArrayTexture) && (Ie = !0);
                const Ke = tt.get(B).__webglFramebuffer;
                B.isWebGLCubeRenderTarget ? (Array.isArray(Ke[k]) ? G = Ke[k][Y] : G = Ke[k], ge = !0) : B.samples > 0 && $e.useMultisampledRTT(B) === !1 ? G = tt.get(B).__webglMultisampledFramebuffer : Array.isArray(Ke) ? G = Ke[Y] : G = Ke,
                _.copy(B.viewport),
                I.copy(B.scissor),
                P = B.scissorTest
            } else
                _.copy(xe).multiplyScalar(K).floor(),
                I.copy(Ae).multiplyScalar(K).floor(),
                P = Ye;
            if (Ge.bindFramebuffer(N.FRAMEBUFFER, G) && X && Ge.drawBuffers(B, G), Ge.viewport(_), Ge.scissor(I), Ge.setScissorTest(P), ge) {
                const Le = tt.get(B.texture);
                N.framebufferTexture2D(N.FRAMEBUFFER, N.COLOR_ATTACHMENT0, N.TEXTURE_CUBE_MAP_POSITIVE_X + k, Le.__webglTexture, Y)
            } else if (Ie) {
                const Le = tt.get(B.texture),
                    Xe = k || 0;
                N.framebufferTextureLayer(N.FRAMEBUFFER, N.COLOR_ATTACHMENT0, Le.__webglTexture, Y || 0, Xe)
            }
            M = -1
        },
        this.readRenderTargetPixels = function(B, k, Y, X, G, ge, Ie) {
            if (!(B && B.isWebGLRenderTarget)) {
                console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
                return
            }
            let Re = tt.get(B).__webglFramebuffer;
            if (B.isWebGLCubeRenderTarget && Ie !== void 0 && (Re = Re[Ie]), Re) {
                Ge.bindFramebuffer(N.FRAMEBUFFER, Re);
                try {
                    const Le = B.texture,
                        Xe = Le.format,
                        Ke = Le.type;
                    if (!St.textureFormatReadable(Xe)) {
                        console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
                        return
                    }
                    if (!St.textureTypeReadable(Ke)) {
                        console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
                        return
                    }
                    k >= 0 && k <= B.width - X && Y >= 0 && Y <= B.height - G && N.readPixels(k, Y, X, G, be.convert(Xe), be.convert(Ke), ge)
                } finally {
                    const Le = C !== null ? tt.get(C).__webglFramebuffer : null;
                    Ge.bindFramebuffer(N.FRAMEBUFFER, Le)
                }
            }
        },
        this.readRenderTargetPixelsAsync = async function(B, k, Y, X, G, ge, Ie) {
            if (!(B && B.isWebGLRenderTarget))
                throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
            let Re = tt.get(B).__webglFramebuffer;
            if (B.isWebGLCubeRenderTarget && Ie !== void 0 && (Re = Re[Ie]), Re) {
                Ge.bindFramebuffer(N.FRAMEBUFFER, Re);
                try {
                    const Le = B.texture,
                        Xe = Le.format,
                        Ke = Le.type;
                    if (!St.textureFormatReadable(Xe))
                        throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
                    if (!St.textureTypeReadable(Ke))
                        throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
                    if (k >= 0 && k <= B.width - X && Y >= 0 && Y <= B.height - G) {
                        const He = N.createBuffer();
                        N.bindBuffer(N.PIXEL_PACK_BUFFER, He),
                        N.bufferData(N.PIXEL_PACK_BUFFER, ge.byteLength, N.STREAM_READ),
                        N.readPixels(k, Y, X, G, be.convert(Xe), be.convert(Ke), 0),
                        N.flush();
                        const Et = N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE, 0);
                        await XC(N, Et, 4);
                        try {
                            N.bindBuffer(N.PIXEL_PACK_BUFFER, He),
                            N.getBufferSubData(N.PIXEL_PACK_BUFFER, 0, ge)
                        } finally {
                            N.deleteBuffer(He),
                            N.deleteSync(Et)
                        }
                        return ge
                    }
                } finally {
                    const Le = C !== null ? tt.get(C).__webglFramebuffer : null;
                    Ge.bindFramebuffer(N.FRAMEBUFFER, Le)
                }
            }
        },
        this.copyFramebufferToTexture = function(B, k=null, Y=0) {
            B.isTexture !== !0 && (console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."), k = arguments[0] || null, B = arguments[1]);
            const X = Math.pow(2, -Y),
                G = Math.floor(B.image.width * X),
                ge = Math.floor(B.image.height * X),
                Ie = k !== null ? k.x : 0,
                Re = k !== null ? k.y : 0;
            $e.setTexture2D(B, 0),
            N.copyTexSubImage2D(N.TEXTURE_2D, Y, 0, 0, Ie, Re, G, ge),
            Ge.unbindTexture()
        },
        this.copyTextureToTexture = function(B, k, Y=null, X=null, G=0) {
            B.isTexture !== !0 && (console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."), X = arguments[0] || null, B = arguments[1], k = arguments[2], G = arguments[3] || 0, Y = null);
            let ge,
                Ie,
                Re,
                Le,
                Xe,
                Ke;
            Y !== null ? (ge = Y.max.x - Y.min.x, Ie = Y.max.y - Y.min.y, Re = Y.min.x, Le = Y.min.y) : (ge = B.image.width, Ie = B.image.height, Re = 0, Le = 0),
            X !== null ? (Xe = X.x, Ke = X.y) : (Xe = 0, Ke = 0);
            const He = be.convert(k.format),
                Et = be.convert(k.type);
            $e.setTexture2D(k, 0),
            N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL, k.flipY),
            N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL, k.premultiplyAlpha),
            N.pixelStorei(N.UNPACK_ALIGNMENT, k.unpackAlignment);
            const Kt = N.getParameter(N.UNPACK_ROW_LENGTH),
                Jt = N.getParameter(N.UNPACK_IMAGE_HEIGHT),
                is = N.getParameter(N.UNPACK_SKIP_PIXELS),
                Mt = N.getParameter(N.UNPACK_SKIP_ROWS),
                ze = N.getParameter(N.UNPACK_SKIP_IMAGES),
                Ni = B.isCompressedTexture ? B.mipmaps[G] : B.image;
            N.pixelStorei(N.UNPACK_ROW_LENGTH, Ni.width),
            N.pixelStorei(N.UNPACK_IMAGE_HEIGHT, Ni.height),
            N.pixelStorei(N.UNPACK_SKIP_PIXELS, Re),
            N.pixelStorei(N.UNPACK_SKIP_ROWS, Le),
            B.isDataTexture ? N.texSubImage2D(N.TEXTURE_2D, G, Xe, Ke, ge, Ie, He, Et, Ni.data) : B.isCompressedTexture ? N.compressedTexSubImage2D(N.TEXTURE_2D, G, Xe, Ke, Ni.width, Ni.height, He, Ni.data) : N.texSubImage2D(N.TEXTURE_2D, G, Xe, Ke, He, Et, Ni),
            N.pixelStorei(N.UNPACK_ROW_LENGTH, Kt),
            N.pixelStorei(N.UNPACK_IMAGE_HEIGHT, Jt),
            N.pixelStorei(N.UNPACK_SKIP_PIXELS, is),
            N.pixelStorei(N.UNPACK_SKIP_ROWS, Mt),
            N.pixelStorei(N.UNPACK_SKIP_IMAGES, ze),
            G === 0 && k.generateMipmaps && N.generateMipmap(N.TEXTURE_2D),
            Ge.unbindTexture()
        },
        this.copyTextureToTexture3D = function(B, k, Y=null, X=null, G=0) {
            B.isTexture !== !0 && (console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."), Y = arguments[0] || null, X = arguments[1] || null, B = arguments[2], k = arguments[3], G = arguments[4] || 0);
            let ge,
                Ie,
                Re,
                Le,
                Xe,
                Ke,
                He,
                Et,
                Kt;
            const Jt = B.isCompressedTexture ? B.mipmaps[G] : B.image;
            Y !== null ? (ge = Y.max.x - Y.min.x, Ie = Y.max.y - Y.min.y, Re = Y.max.z - Y.min.z, Le = Y.min.x, Xe = Y.min.y, Ke = Y.min.z) : (ge = Jt.width, Ie = Jt.height, Re = Jt.depth, Le = 0, Xe = 0, Ke = 0),
            X !== null ? (He = X.x, Et = X.y, Kt = X.z) : (He = 0, Et = 0, Kt = 0);
            const is = be.convert(k.format),
                Mt = be.convert(k.type);
            let ze;
            if (k.isData3DTexture)
                $e.setTexture3D(k, 0),
                ze = N.TEXTURE_3D;
            else if (k.isDataArrayTexture || k.isCompressedArrayTexture)
                $e.setTexture2DArray(k, 0),
                ze = N.TEXTURE_2D_ARRAY;
            else {
                console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");
                return
            }
            N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL, k.flipY),
            N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL, k.premultiplyAlpha),
            N.pixelStorei(N.UNPACK_ALIGNMENT, k.unpackAlignment);
            const Ni = N.getParameter(N.UNPACK_ROW_LENGTH),
                Pt = N.getParameter(N.UNPACK_IMAGE_HEIGHT),
                fn = N.getParameter(N.UNPACK_SKIP_PIXELS),
                Oc = N.getParameter(N.UNPACK_SKIP_ROWS),
                Mr = N.getParameter(N.UNPACK_SKIP_IMAGES);
            N.pixelStorei(N.UNPACK_ROW_LENGTH, Jt.width),
            N.pixelStorei(N.UNPACK_IMAGE_HEIGHT, Jt.height),
            N.pixelStorei(N.UNPACK_SKIP_PIXELS, Le),
            N.pixelStorei(N.UNPACK_SKIP_ROWS, Xe),
            N.pixelStorei(N.UNPACK_SKIP_IMAGES, Ke),
            B.isDataTexture || B.isData3DTexture ? N.texSubImage3D(ze, G, He, Et, Kt, ge, Ie, Re, is, Mt, Jt.data) : k.isCompressedArrayTexture ? N.compressedTexSubImage3D(ze, G, He, Et, Kt, ge, Ie, Re, is, Jt.data) : N.texSubImage3D(ze, G, He, Et, Kt, ge, Ie, Re, is, Mt, Jt),
            N.pixelStorei(N.UNPACK_ROW_LENGTH, Ni),
            N.pixelStorei(N.UNPACK_IMAGE_HEIGHT, Pt),
            N.pixelStorei(N.UNPACK_SKIP_PIXELS, fn),
            N.pixelStorei(N.UNPACK_SKIP_ROWS, Oc),
            N.pixelStorei(N.UNPACK_SKIP_IMAGES, Mr),
            G === 0 && k.generateMipmaps && N.generateMipmap(ze),
            Ge.unbindTexture()
        },
        this.initRenderTarget = function(B) {
            tt.get(B).__webglFramebuffer === void 0 && $e.setupRenderTarget(B)
        },
        this.initTexture = function(B) {
            B.isCubeTexture ? $e.setTextureCube(B, 0) : B.isData3DTexture ? $e.setTexture3D(B, 0) : B.isDataArrayTexture || B.isCompressedArrayTexture ? $e.setTexture2DArray(B, 0) : $e.setTexture2D(B, 0),
            Ge.unbindTexture()
        },
        this.resetState = function() {
            S = 0,
            w = 0,
            C = null,
            Ge.reset(),
            st.reset()
        },
        typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", {
            detail: this
        }))
    }
    get coordinateSystem()
    {
        return Tn
    }
    get outputColorSpace()
    {
        return this._outputColorSpace
    }
    set outputColorSpace(e)
    {
        this._outputColorSpace = e;
        const t = this.getContext();
        t.drawingBufferColorSpace = e === wd ? "display-p3" : "srgb",
        t.unpackColorSpace = mt.workingColorSpace === Mc ? "display-p3" : "srgb"
    }
}
class No extends It {
    constructor()
    {
        super(),
        this.isScene = !0,
        this.type = "Scene",
        this.background = null,
        this.environment = null,
        this.fog = null,
        this.backgroundBlurriness = 0,
        this.backgroundIntensity = 1,
        this.backgroundRotation = new ln,
        this.environmentIntensity = 1,
        this.environmentRotation = new ln,
        this.overrideMaterial = null,
        typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", {
            detail: this
        }))
    }
    copy(e, t)
    {
        return super.copy(e, t), e.background !== null && (this.background = e.background.clone()), e.environment !== null && (this.environment = e.environment.clone()), e.fog !== null && (this.fog = e.fog.clone()), this.backgroundBlurriness = e.backgroundBlurriness, this.backgroundIntensity = e.backgroundIntensity, this.backgroundRotation.copy(e.backgroundRotation), this.environmentIntensity = e.environmentIntensity, this.environmentRotation.copy(e.environmentRotation), e.overrideMaterial !== null && (this.overrideMaterial = e.overrideMaterial.clone()), this.matrixAutoUpdate = e.matrixAutoUpdate, this
    }
    toJSON(e)
    {
        const t = super.toJSON(e);
        return this.fog !== null && (t.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (t.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (t.object.backgroundIntensity = this.backgroundIntensity), t.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (t.object.environmentIntensity = this.environmentIntensity), t.object.environmentRotation = this.environmentRotation.toArray(), t
    }
}
class Qy {
    constructor(e, t)
    {
        this.isInterleavedBuffer = !0,
        this.array = e,
        this.stride = t,
        this.count = e !== void 0 ? e.length / t : 0,
        this.usage = qu,
        this._updateRange = {
            offset: 0,
            count: -1
        },
        this.updateRanges = [],
        this.version = 0,
        this.uuid = Hs()
    }
    onUploadCallback() {}
    set needsUpdate(e)
    {
        e === !0 && this.version++
    }
    get updateRange()
    {
        return PA("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."), this._updateRange
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
        return this.array = new e.array.constructor(e.array), this.count = e.count, this.stride = e.stride, this.usage = e.usage, this
    }
    copyAt(e, t, s)
    {
        e *= this.stride,
        s *= t.stride;
        for (let n = 0, r = this.stride; n < r; n++)
            this.array[e + n] = t.array[s + n];
        return this
    }
    set(e, t=0)
    {
        return this.array.set(e, t), this
    }
    clone(e)
    {
        e.arrayBuffers === void 0 && (e.arrayBuffers = {}),
        this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = Hs()),
        e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
        const t = new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),
            s = new this.constructor(t, this.stride);
        return s.setUsage(this.usage), s
    }
    onUpload(e)
    {
        return this.onUploadCallback = e, this
    }
    toJSON(e)
    {
        return e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = Hs()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))), {
            uuid: this.uuid,
            buffer: this.array.buffer._uuid,
            type: this.array.constructor.name,
            stride: this.stride
        }
    }
}
const Oi = new b;
class gc {
    constructor(e, t, s, n=!1)
    {
        this.isInterleavedBufferAttribute = !0,
        this.name = "",
        this.data = e,
        this.itemSize = t,
        this.offset = s,
        this.normalized = n
    }
    get count()
    {
        return this.data.count
    }
    get array()
    {
        return this.data.array
    }
    set needsUpdate(e)
    {
        this.data.needsUpdate = e
    }
    applyMatrix4(e)
    {
        for (let t = 0, s = this.data.count; t < s; t++)
            Oi.fromBufferAttribute(this, t),
            Oi.applyMatrix4(e),
            this.setXYZ(t, Oi.x, Oi.y, Oi.z);
        return this
    }
    applyNormalMatrix(e)
    {
        for (let t = 0, s = this.count; t < s; t++)
            Oi.fromBufferAttribute(this, t),
            Oi.applyNormalMatrix(e),
            this.setXYZ(t, Oi.x, Oi.y, Oi.z);
        return this
    }
    transformDirection(e)
    {
        for (let t = 0, s = this.count; t < s; t++)
            Oi.fromBufferAttribute(this, t),
            Oi.transformDirection(e),
            this.setXYZ(t, Oi.x, Oi.y, Oi.z);
        return this
    }
    getComponent(e, t)
    {
        let s = this.array[e * this.data.stride + this.offset + t];
        return this.normalized && (s = ks(s, this.array)), s
    }
    setComponent(e, t, s)
    {
        return this.normalized && (s = bt(s, this.array)), this.data.array[e * this.data.stride + this.offset + t] = s, this
    }
    setX(e, t)
    {
        return this.normalized && (t = bt(t, this.array)), this.data.array[e * this.data.stride + this.offset] = t, this
    }
    setY(e, t)
    {
        return this.normalized && (t = bt(t, this.array)), this.data.array[e * this.data.stride + this.offset + 1] = t, this
    }
    setZ(e, t)
    {
        return this.normalized && (t = bt(t, this.array)), this.data.array[e * this.data.stride + this.offset + 2] = t, this
    }
    setW(e, t)
    {
        return this.normalized && (t = bt(t, this.array)), this.data.array[e * this.data.stride + this.offset + 3] = t, this
    }
    getX(e)
    {
        let t = this.data.array[e * this.data.stride + this.offset];
        return this.normalized && (t = ks(t, this.array)), t
    }
    getY(e)
    {
        let t = this.data.array[e * this.data.stride + this.offset + 1];
        return this.normalized && (t = ks(t, this.array)), t
    }
    getZ(e)
    {
        let t = this.data.array[e * this.data.stride + this.offset + 2];
        return this.normalized && (t = ks(t, this.array)), t
    }
    getW(e)
    {
        let t = this.data.array[e * this.data.stride + this.offset + 3];
        return this.normalized && (t = ks(t, this.array)), t
    }
    setXY(e, t, s)
    {
        return e = e * this.data.stride + this.offset, this.normalized && (t = bt(t, this.array), s = bt(s, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = s, this
    }
    setXYZ(e, t, s, n)
    {
        return e = e * this.data.stride + this.offset, this.normalized && (t = bt(t, this.array), s = bt(s, this.array), n = bt(n, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = s, this.data.array[e + 2] = n, this
    }
    setXYZW(e, t, s, n, r)
    {
        return e = e * this.data.stride + this.offset, this.normalized && (t = bt(t, this.array), s = bt(s, this.array), n = bt(n, this.array), r = bt(r, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = s, this.data.array[e + 2] = n, this.data.array[e + 3] = r, this
    }
    clone(e)
    {
        if (e === void 0) {
            console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
            const t = [];
            for (let s = 0; s < this.count; s++) {
                const n = s * this.data.stride + this.offset;
                for (let r = 0; r < this.itemSize; r++)
                    t.push(this.data.array[n + r])
            }
            return new We(new this.array.constructor(t), this.itemSize, this.normalized)
        } else
            return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.clone(e)), new gc(e.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized)
    }
    toJSON(e)
    {
        if (e === void 0) {
            console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
            const t = [];
            for (let s = 0; s < this.count; s++) {
                const n = s * this.data.stride + this.offset;
                for (let r = 0; r < this.itemSize; r++)
                    t.push(this.data.array[n + r])
            }
            return {
                itemSize: this.itemSize,
                type: this.array.constructor.name,
                array: t,
                normalized: this.normalized
            }
        } else
            return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.toJSON(e)), {
                isInterleavedBufferAttribute: !0,
                itemSize: this.itemSize,
                data: this.data.uuid,
                offset: this.offset,
                normalized: this.normalized
            }
    }
}
const Zv = new b,
    $v = new yt,
    e0 = new yt,
    $T = new b,
    t0 = new De,
    oh = new b,
    vf = new bi,
    i0 = new De,
    xf = new Vo;
class Gy extends Ce {
    constructor(e, t)
    {
        super(e, t),
        this.isSkinnedMesh = !0,
        this.type = "SkinnedMesh",
        this.bindMode = kg,
        this.bindMatrix = new De,
        this.bindMatrixInverse = new De,
        this.boundingBox = null,
        this.boundingSphere = null
    }
    computeBoundingBox()
    {
        const e = this.geometry;
        this.boundingBox === null && (this.boundingBox = new Vt),
        this.boundingBox.makeEmpty();
        const t = e.getAttribute("position");
        for (let s = 0; s < t.count; s++)
            this.getVertexPosition(s, oh),
            this.boundingBox.expandByPoint(oh)
    }
    computeBoundingSphere()
    {
        const e = this.geometry;
        this.boundingSphere === null && (this.boundingSphere = new bi),
        this.boundingSphere.makeEmpty();
        const t = e.getAttribute("position");
        for (let s = 0; s < t.count; s++)
            this.getVertexPosition(s, oh),
            this.boundingSphere.expandByPoint(oh)
    }
    copy(e, t)
    {
        return super.copy(e, t), this.bindMode = e.bindMode, this.bindMatrix.copy(e.bindMatrix), this.bindMatrixInverse.copy(e.bindMatrixInverse), this.skeleton = e.skeleton, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this
    }
    raycast(e, t)
    {
        const s = this.material,
            n = this.matrixWorld;
        s !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), vf.copy(this.boundingSphere), vf.applyMatrix4(n), e.ray.intersectsSphere(vf) !== !1 && (i0.copy(n).invert(), xf.copy(e.ray).applyMatrix4(i0), !(this.boundingBox !== null && xf.intersectsBox(this.boundingBox) === !1) && this._computeIntersections(e, t, xf)))
    }
    getVertexPosition(e, t)
    {
        return super.getVertexPosition(e, t), this.applyBoneTransform(e, t), t
    }
    bind(e, t)
    {
        this.skeleton = e,
        t === void 0 && (this.updateMatrixWorld(!0), this.skeleton.calculateInverses(), t = this.matrixWorld),
        this.bindMatrix.copy(t),
        this.bindMatrixInverse.copy(t).invert()
    }
    pose()
    {
        this.skeleton.pose()
    }
    normalizeSkinWeights()
    {
        const e = new yt,
            t = this.geometry.attributes.skinWeight;
        for (let s = 0, n = t.count; s < n; s++) {
            e.fromBufferAttribute(t, s);
            const r = 1 / e.manhattanLength();
            r !== 1 / 0 ? e.multiplyScalar(r) : e.set(1, 0, 0, 0),
            t.setXYZW(s, e.x, e.y, e.z, e.w)
        }
    }
    updateMatrixWorld(e)
    {
        super.updateMatrixWorld(e),
        this.bindMode === kg ? this.bindMatrixInverse.copy(this.matrixWorld).invert() : this.bindMode === hC ? this.bindMatrixInverse.copy(this.bindMatrix).invert() : console.warn("THREE.SkinnedMesh: Unrecognized bindMode: " + this.bindMode)
    }
    applyBoneTransform(e, t)
    {
        const s = this.skeleton,
            n = this.geometry;
        $v.fromBufferAttribute(n.attributes.skinIndex, e),
        e0.fromBufferAttribute(n.attributes.skinWeight, e),
        Zv.copy(t).applyMatrix4(this.bindMatrix),
        t.set(0, 0, 0);
        for (let r = 0; r < 4; r++) {
            const a = e0.getComponent(r);
            if (a !== 0) {
                const o = $v.getComponent(r);
                t0.multiplyMatrices(s.bones[o].matrixWorld, s.boneInverses[o]),
                t.addScaledVector($T.copy(Zv).applyMatrix4(t0), a)
            }
        }
        return t.applyMatrix4(this.bindMatrixInverse)
    }
}
class NA extends It {
    constructor()
    {
        super(),
        this.isBone = !0,
        this.type = "Bone"
    }
}
class Hi extends Rt {
    constructor(e=null, t=1, s=1, n, r, a, o, l, c=gt, h=gt, d, u)
    {
        super(null, a, o, l, c, h, n, r, d, u),
        this.isDataTexture = !0,
        this.image = {
            data: e,
            width: t,
            height: s
        },
        this.generateMipmaps = !1,
        this.flipY = !1,
        this.unpackAlignment = 1
    }
}
const s0 = new De,
    eI = new De;
class Sd {
    constructor(e=[], t=[])
    {
        this.uuid = Hs(),
        this.bones = e.slice(0),
        this.boneInverses = t,
        this.boneMatrices = null,
        this.boneTexture = null,
        this.init()
    }
    init()
    {
        const e = this.bones,
            t = this.boneInverses;
        if (this.boneMatrices = new Float32Array(e.length * 16), t.length === 0)
            this.calculateInverses();
        else if (e.length !== t.length) {
            console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),
            this.boneInverses = [];
            for (let s = 0, n = this.bones.length; s < n; s++)
                this.boneInverses.push(new De)
        }
    }
    calculateInverses()
    {
        this.boneInverses.length = 0;
        for (let e = 0, t = this.bones.length; e < t; e++) {
            const s = new De;
            this.bones[e] && s.copy(this.bones[e].matrixWorld).invert(),
            this.boneInverses.push(s)
        }
    }
    pose()
    {
        for (let e = 0, t = this.bones.length; e < t; e++) {
            const s = this.bones[e];
            s && s.matrixWorld.copy(this.boneInverses[e]).invert()
        }
        for (let e = 0, t = this.bones.length; e < t; e++) {
            const s = this.bones[e];
            s && (s.parent && s.parent.isBone ? (s.matrix.copy(s.parent.matrixWorld).invert(), s.matrix.multiply(s.matrixWorld)) : s.matrix.copy(s.matrixWorld), s.matrix.decompose(s.position, s.quaternion, s.scale))
        }
    }
    update()
    {
        const e = this.bones,
            t = this.boneInverses,
            s = this.boneMatrices,
            n = this.boneTexture;
        for (let r = 0, a = e.length; r < a; r++) {
            const o = e[r] ? e[r].matrixWorld : eI;
            s0.multiplyMatrices(o, t[r]),
            s0.toArray(s, r * 16)
        }
        n !== null && (n.needsUpdate = !0)
    }
    clone()
    {
        return new Sd(this.bones, this.boneInverses)
    }
    computeBoneTexture()
    {
        let e = Math.sqrt(this.bones.length * 4);
        e = Math.ceil(e / 4) * 4,
        e = Math.max(e, 4);
        const t = new Float32Array(e * e * 4);
        t.set(this.boneMatrices);
        const s = new Hi(t, e, e, wt, Lt);
        return s.needsUpdate = !0, this.boneMatrices = t, this.boneTexture = s, this
    }
    getBoneByName(e)
    {
        for (let t = 0, s = this.bones.length; t < s; t++) {
            const n = this.bones[t];
            if (n.name === e)
                return n
        }
    }
    dispose()
    {
        this.boneTexture !== null && (this.boneTexture.dispose(), this.boneTexture = null)
    }
    fromJSON(e, t)
    {
        this.uuid = e.uuid;
        for (let s = 0, n = e.bones.length; s < n; s++) {
            const r = e.bones[s];
            let a = t[r];
            a === void 0 && (console.warn("THREE.Skeleton: No bone found with UUID:", r), a = new NA),
            this.bones.push(a),
            this.boneInverses.push(new De().fromArray(e.boneInverses[s]))
        }
        return this.init(), this
    }
    toJSON()
    {
        const e = {
            metadata: {
                version: 4.6,
                type: "Skeleton",
                generator: "Skeleton.toJSON"
            },
            bones: [],
            boneInverses: []
        };
        e.uuid = this.uuid;
        const t = this.bones,
            s = this.boneInverses;
        for (let n = 0, r = t.length; n < r; n++) {
            const a = t[n];
            e.bones.push(a.uuid);
            const o = s[n];
            e.boneInverses.push(o.toArray())
        }
        return e
    }
}
class gr extends We {
    constructor(e, t, s, n=1)
    {
        super(e, t, s),
        this.isInstancedBufferAttribute = !0,
        this.meshPerAttribute = n
    }
    copy(e)
    {
        return super.copy(e), this.meshPerAttribute = e.meshPerAttribute, this
    }
    toJSON()
    {
        const e = super.toJSON();
        return e.meshPerAttribute = this.meshPerAttribute, e.isInstancedBufferAttribute = !0, e
    }
}
const ka = new De,
    n0 = new De,
    lh = [],
    r0 = new Vt,
    tI = new De,
    nl = new Ce,
    rl = new bi;
class OA extends Ce {
    constructor(e, t, s)
    {
        super(e, t),
        this.isInstancedMesh = !0,
        this.instanceMatrix = new gr(new Float32Array(s * 16), 16),
        this.instanceColor = null,
        this.morphTexture = null,
        this.count = s,
        this.boundingBox = null,
        this.boundingSphere = null;
        for (let n = 0; n < s; n++)
            this.setMatrixAt(n, tI)
    }
    computeBoundingBox()
    {
        const e = this.geometry,
            t = this.count;
        this.boundingBox === null && (this.boundingBox = new Vt),
        e.boundingBox === null && e.computeBoundingBox(),
        this.boundingBox.makeEmpty();
        for (let s = 0; s < t; s++)
            this.getMatrixAt(s, ka),
            r0.copy(e.boundingBox).applyMatrix4(ka),
            this.boundingBox.union(r0)
    }
    computeBoundingSphere()
    {
        const e = this.geometry,
            t = this.count;
        this.boundingSphere === null && (this.boundingSphere = new bi),
        e.boundingSphere === null && e.computeBoundingSphere(),
        this.boundingSphere.makeEmpty();
        for (let s = 0; s < t; s++)
            this.getMatrixAt(s, ka),
            rl.copy(e.boundingSphere).applyMatrix4(ka),
            this.boundingSphere.union(rl)
    }
    copy(e, t)
    {
        return super.copy(e, t), this.instanceMatrix.copy(e.instanceMatrix), e.morphTexture !== null && (this.morphTexture = e.morphTexture.clone()), e.instanceColor !== null && (this.instanceColor = e.instanceColor.clone()), this.count = e.count, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this
    }
    getColorAt(e, t)
    {
        t.fromArray(this.instanceColor.array, e * 3)
    }
    getMatrixAt(e, t)
    {
        t.fromArray(this.instanceMatrix.array, e * 16)
    }
    getMorphAt(e, t)
    {
        const s = t.morphTargetInfluences,
            n = this.morphTexture.source.data.data,
            r = s.length + 1,
            a = e * r + 1;
        for (let o = 0; o < s.length; o++)
            s[o] = n[a + o]
    }
    raycast(e, t)
    {
        const s = this.matrixWorld,
            n = this.count;
        if (nl.geometry = this.geometry, nl.material = this.material, nl.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), rl.copy(this.boundingSphere), rl.applyMatrix4(s), e.ray.intersectsSphere(rl) !== !1))
            for (let r = 0; r < n; r++) {
                this.getMatrixAt(r, ka),
                n0.multiplyMatrices(s, ka),
                nl.matrixWorld = n0,
                nl.raycast(e, lh);
                for (let a = 0, o = lh.length; a < o; a++) {
                    const l = lh[a];
                    l.instanceId = r,
                    l.object = this,
                    t.push(l)
                }
                lh.length = 0
            }
    }
    setColorAt(e, t)
    {
        this.instanceColor === null && (this.instanceColor = new gr(new Float32Array(this.instanceMatrix.count * 3), 3)),
        t.toArray(this.instanceColor.array, e * 3)
    }
    setMatrixAt(e, t)
    {
        t.toArray(this.instanceMatrix.array, e * 16)
    }
    setMorphAt(e, t)
    {
        const s = t.morphTargetInfluences,
            n = s.length + 1;
        this.morphTexture === null && (this.morphTexture = new Hi(new Float32Array(n * this.count), n, this.count, ta, Lt));
        const r = this.morphTexture.source.data.data;
        let a = 0;
        for (let c = 0; c < s.length; c++)
            a += s[c];
        const o = this.geometry.morphTargetsRelative ? 1 : 1 - a,
            l = n * e;
        r[l] = o,
        r.set(s, l + 1)
    }
    updateMorphTargets() {}
    dispose()
    {
        return this.dispatchEvent({
            type: "dispose"
        }), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null), this
    }
}
function iI(i, e) {
    return i.z - e.z
}
function sI(i, e) {
    return e.z - i.z
}
class nI {
    constructor()
    {
        this.index = 0,
        this.pool = [],
        this.list = []
    }
    push(e, t)
    {
        const s = this.pool,
            n = this.list;
        this.index >= s.length && s.push({
            start: -1,
            count: -1,
            z: -1
        });
        const r = s[this.index];
        n.push(r),
        this.index++,
        r.start = e.start,
        r.count = e.count,
        r.z = t
    }
    reset()
    {
        this.list.length = 0,
        this.index = 0
    }
}
const za = "batchId",
    Wn = new De,
    yf = new De,
    rI = new De,
    aI = new Z(1, 1, 1),
    a0 = new De,
    _f = new Ed,
    ch = new Vt,
    Rr = new bi,
    al = new b,
    o0 = new b,
    oI = new b,
    wf = new nI,
    Bi = new Ce,
    hh = [];
function lI(i, e, t=0) {
    const s = e.itemSize;
    if (i.isInterleavedBufferAttribute || i.array.constructor !== e.array.constructor) {
        const n = i.count;
        for (let r = 0; r < n; r++)
            for (let a = 0; a < s; a++)
                e.setComponent(r + t, a, i.getComponent(r, a))
    } else
        e.array.set(i.array, t * s);
    e.needsUpdate = !0
}
class cI extends Ce {
    get maxGeometryCount()
    {
        return this._maxGeometryCount
    }
    constructor(e, t, s=t * 2, n)
    {
        super(new ot, n),
        this.isBatchedMesh = !0,
        this.perObjectFrustumCulled = !0,
        this.sortObjects = !0,
        this.boundingBox = null,
        this.boundingSphere = null,
        this.customSort = null,
        this._drawRanges = [],
        this._reservedRanges = [],
        this._visibility = [],
        this._active = [],
        this._bounds = [],
        this._maxGeometryCount = e,
        this._maxVertexCount = t,
        this._maxIndexCount = s,
        this._geometryInitialized = !1,
        this._geometryCount = 0,
        this._multiDrawCounts = new Int32Array(e),
        this._multiDrawStarts = new Int32Array(e),
        this._multiDrawCount = 0,
        this._multiDrawInstances = null,
        this._visibilityChanged = !0,
        this._matricesTexture = null,
        this._initMatricesTexture(),
        this._colorsTexture = null
    }
    _initMatricesTexture()
    {
        let e = Math.sqrt(this._maxGeometryCount * 4);
        e = Math.ceil(e / 4) * 4,
        e = Math.max(e, 4);
        const t = new Float32Array(e * e * 4),
            s = new Hi(t, e, e, wt, Lt);
        this._matricesTexture = s
    }
    _initColorsTexture()
    {
        let e = Math.sqrt(this._maxGeometryCount);
        e = Math.ceil(e);
        const t = new Float32Array(e * e * 4).fill(1),
            s = new Hi(t, e, e, wt, Lt);
        s.colorSpace = mt.workingColorSpace,
        this._colorsTexture = s
    }
    _initializeGeometry(e)
    {
        const t = this.geometry,
            s = this._maxVertexCount,
            n = this._maxGeometryCount,
            r = this._maxIndexCount;
        if (this._geometryInitialized === !1) {
            for (const o in e.attributes) {
                const l = e.getAttribute(o),
                    {array: c, itemSize: h, normalized: d} = l,
                    u = new c.constructor(s * h),
                    f = new We(u, h, d);
                t.setAttribute(o, f)
            }
            if (e.getIndex() !== null) {
                const o = s > 65536 ? new Uint32Array(r) : new Uint16Array(r);
                t.setIndex(new We(o, 1))
            }
            const a = n > 65536 ? new Uint32Array(s) : new Uint16Array(s);
            t.setAttribute(za, new We(a, 1)),
            this._geometryInitialized = !0
        }
    }
    _validateGeometry(e)
    {
        if (e.getAttribute(za))
            throw new Error(`BatchedMesh: Geometry cannot use attribute "${za}"`);
        const t = this.geometry;
        if (!!e.getIndex() != !!t.getIndex())
            throw new Error('BatchedMesh: All geometries must consistently have "index".');
        for (const s in t.attributes) {
            if (s === za)
                continue;
            if (!e.hasAttribute(s))
                throw new Error(`BatchedMesh: Added geometry missing "${s}". All geometries must have consistent attributes.`);
            const n = e.getAttribute(s),
                r = t.getAttribute(s);
            if (n.itemSize !== r.itemSize || n.normalized !== r.normalized)
                throw new Error("BatchedMesh: All attributes must have a consistent itemSize and normalized value.")
        }
    }
    setCustomSort(e)
    {
        return this.customSort = e, this
    }
    computeBoundingBox()
    {
        this.boundingBox === null && (this.boundingBox = new Vt);
        const e = this._geometryCount,
            t = this.boundingBox,
            s = this._active;
        t.makeEmpty();
        for (let n = 0; n < e; n++)
            s[n] !== !1 && (this.getMatrixAt(n, Wn), this.getBoundingBoxAt(n, ch).applyMatrix4(Wn), t.union(ch))
    }
    computeBoundingSphere()
    {
        this.boundingSphere === null && (this.boundingSphere = new bi);
        const e = this._geometryCount,
            t = this.boundingSphere,
            s = this._active;
        t.makeEmpty();
        for (let n = 0; n < e; n++)
            s[n] !== !1 && (this.getMatrixAt(n, Wn), this.getBoundingSphereAt(n, Rr).applyMatrix4(Wn), t.union(Rr))
    }
    addGeometry(e, t=-1, s=-1)
    {
        if (this._initializeGeometry(e), this._validateGeometry(e), this._geometryCount >= this._maxGeometryCount)
            throw new Error("BatchedMesh: Maximum geometry count reached.");
        const n = {
            vertexStart: -1,
            vertexCount: -1,
            indexStart: -1,
            indexCount: -1
        };
        let r = null;
        const a = this._reservedRanges,
            o = this._drawRanges,
            l = this._bounds;
        this._geometryCount !== 0 && (r = a[a.length - 1]),
        t === -1 ? n.vertexCount = e.getAttribute("position").count : n.vertexCount = t,
        r === null ? n.vertexStart = 0 : n.vertexStart = r.vertexStart + r.vertexCount;
        const c = e.getIndex(),
            h = c !== null;
        if (h && (s === -1 ? n.indexCount = c.count : n.indexCount = s, r === null ? n.indexStart = 0 : n.indexStart = r.indexStart + r.indexCount), n.indexStart !== -1 && n.indexStart + n.indexCount > this._maxIndexCount || n.vertexStart + n.vertexCount > this._maxVertexCount)
            throw new Error("BatchedMesh: Reserved space request exceeds the maximum buffer size.");
        const d = this._visibility,
            u = this._active,
            f = this._matricesTexture,
            p = this._matricesTexture.image.data,
            A = this._colorsTexture;
        d.push(!0),
        u.push(!0);
        const m = this._geometryCount;
        this._geometryCount++,
        rI.toArray(p, m * 16),
        f.needsUpdate = !0,
        A !== null && (aI.toArray(A.image.data, m * 4), A.needsUpdate = !0),
        a.push(n),
        o.push({
            start: h ? n.indexStart : n.vertexStart,
            count: -1
        }),
        l.push({
            boxInitialized: !1,
            box: new Vt,
            sphereInitialized: !1,
            sphere: new bi
        });
        const g = this.geometry.getAttribute(za);
        for (let x = 0; x < n.vertexCount; x++)
            g.setX(n.vertexStart + x, m);
        return g.needsUpdate = !0, this.setGeometryAt(m, e), m
    }
    setGeometryAt(e, t)
    {
        if (e >= this._geometryCount)
            throw new Error("BatchedMesh: Maximum geometry count reached.");
        this._validateGeometry(t);
        const s = this.geometry,
            n = s.getIndex() !== null,
            r = s.getIndex(),
            a = t.getIndex(),
            o = this._reservedRanges[e];
        if (n && a.count > o.indexCount || t.attributes.position.count > o.vertexCount)
            throw new Error("BatchedMesh: Reserved space not large enough for provided geometry.");
        const l = o.vertexStart,
            c = o.vertexCount;
        for (const f in s.attributes) {
            if (f === za)
                continue;
            const p = t.getAttribute(f),
                A = s.getAttribute(f);
            lI(p, A, l);
            const m = p.itemSize;
            for (let g = p.count, x = c; g < x; g++) {
                const v = l + g;
                for (let y = 0; y < m; y++)
                    A.setComponent(v, y, 0)
            }
            A.needsUpdate = !0,
            A.addUpdateRange(l * m, c * m)
        }
        if (n) {
            const f = o.indexStart;
            for (let p = 0; p < a.count; p++)
                r.setX(f + p, l + a.getX(p));
            for (let p = a.count, A = o.indexCount; p < A; p++)
                r.setX(f + p, l);
            r.needsUpdate = !0,
            r.addUpdateRange(f, o.indexCount)
        }
        const h = this._bounds[e];
        t.boundingBox !== null ? (h.box.copy(t.boundingBox), h.boxInitialized = !0) : h.boxInitialized = !1,
        t.boundingSphere !== null ? (h.sphere.copy(t.boundingSphere), h.sphereInitialized = !0) : h.sphereInitialized = !1;
        const d = this._drawRanges[e],
            u = t.getAttribute("position");
        return d.count = n ? a.count : u.count, this._visibilityChanged = !0, e
    }
    deleteGeometry(e)
    {
        const t = this._active;
        return e >= t.length || t[e] === !1 ? this : (t[e] = !1, this._visibilityChanged = !0, this)
    }
    getInstanceCountAt(e)
    {
        return this._multiDrawInstances === null ? null : this._multiDrawInstances[e]
    }
    setInstanceCountAt(e, t)
    {
        return this._multiDrawInstances === null && (this._multiDrawInstances = new Int32Array(this._maxGeometryCount).fill(1)), this._multiDrawInstances[e] = t, e
    }
    getBoundingBoxAt(e, t)
    {
        if (this._active[e] === !1)
            return null;
        const n = this._bounds[e],
            r = n.box,
            a = this.geometry;
        if (n.boxInitialized === !1) {
            r.makeEmpty();
            const o = a.index,
                l = a.attributes.position,
                c = this._drawRanges[e];
            for (let h = c.start, d = c.start + c.count; h < d; h++) {
                let u = h;
                o && (u = o.getX(u)),
                r.expandByPoint(al.fromBufferAttribute(l, u))
            }
            n.boxInitialized = !0
        }
        return t.copy(r), t
    }
    getBoundingSphereAt(e, t)
    {
        if (this._active[e] === !1)
            return null;
        const n = this._bounds[e],
            r = n.sphere,
            a = this.geometry;
        if (n.sphereInitialized === !1) {
            r.makeEmpty(),
            this.getBoundingBoxAt(e, ch),
            ch.getCenter(r.center);
            const o = a.index,
                l = a.attributes.position,
                c = this._drawRanges[e];
            let h = 0;
            for (let d = c.start, u = c.start + c.count; d < u; d++) {
                let f = d;
                o && (f = o.getX(f)),
                al.fromBufferAttribute(l, f),
                h = Math.max(h, r.center.distanceToSquared(al))
            }
            r.radius = Math.sqrt(h),
            n.sphereInitialized = !0
        }
        return t.copy(r), t
    }
    setMatrixAt(e, t)
    {
        const s = this._active,
            n = this._matricesTexture,
            r = this._matricesTexture.image.data,
            a = this._geometryCount;
        return e >= a || s[e] === !1 ? this : (t.toArray(r, e * 16), n.needsUpdate = !0, this)
    }
    getMatrixAt(e, t)
    {
        const s = this._active,
            n = this._matricesTexture.image.data,
            r = this._geometryCount;
        return e >= r || s[e] === !1 ? null : t.fromArray(n, e * 16)
    }
    setColorAt(e, t)
    {
        this._colorsTexture === null && this._initColorsTexture();
        const s = this._active,
            n = this._colorsTexture,
            r = this._colorsTexture.image.data,
            a = this._geometryCount;
        return e >= a || s[e] === !1 ? this : (t.toArray(r, e * 4), n.needsUpdate = !0, this)
    }
    getColorAt(e, t)
    {
        const s = this._active,
            n = this._colorsTexture.image.data,
            r = this._geometryCount;
        return e >= r || s[e] === !1 ? null : t.fromArray(n, e * 4)
    }
    setVisibleAt(e, t)
    {
        const s = this._visibility,
            n = this._active,
            r = this._geometryCount;
        return e >= r || n[e] === !1 || s[e] === t ? this : (s[e] = t, this._visibilityChanged = !0, this)
    }
    getVisibleAt(e)
    {
        const t = this._visibility,
            s = this._active,
            n = this._geometryCount;
        return e >= n || s[e] === !1 ? !1 : t[e]
    }
    raycast(e, t)
    {
        const s = this._visibility,
            n = this._active,
            r = this._drawRanges,
            a = this._geometryCount,
            o = this.matrixWorld,
            l = this.geometry;
        Bi.material = this.material,
        Bi.geometry.index = l.index,
        Bi.geometry.attributes = l.attributes,
        Bi.geometry.boundingBox === null && (Bi.geometry.boundingBox = new Vt),
        Bi.geometry.boundingSphere === null && (Bi.geometry.boundingSphere = new bi);
        for (let c = 0; c < a; c++) {
            if (!s[c] || !n[c])
                continue;
            const h = r[c];
            Bi.geometry.setDrawRange(h.start, h.count),
            this.getMatrixAt(c, Bi.matrixWorld).premultiply(o),
            this.getBoundingBoxAt(c, Bi.geometry.boundingBox),
            this.getBoundingSphereAt(c, Bi.geometry.boundingSphere),
            Bi.raycast(e, hh);
            for (let d = 0, u = hh.length; d < u; d++) {
                const f = hh[d];
                f.object = this,
                f.batchId = c,
                t.push(f)
            }
            hh.length = 0
        }
        Bi.material = null,
        Bi.geometry.index = null,
        Bi.geometry.attributes = {},
        Bi.geometry.setDrawRange(0, 1 / 0)
    }
    copy(e)
    {
        return super.copy(e), this.geometry = e.geometry.clone(), this.perObjectFrustumCulled = e.perObjectFrustumCulled, this.sortObjects = e.sortObjects, this.boundingBox = e.boundingBox !== null ? e.boundingBox.clone() : null, this.boundingSphere = e.boundingSphere !== null ? e.boundingSphere.clone() : null, this._drawRanges = e._drawRanges.map(t => ({
            ...t
        })), this._reservedRanges = e._reservedRanges.map(t => ({
            ...t
        })), this._visibility = e._visibility.slice(), this._active = e._active.slice(), this._bounds = e._bounds.map(t => ({
            boxInitialized: t.boxInitialized,
            box: t.box.clone(),
            sphereInitialized: t.sphereInitialized,
            sphere: t.sphere.clone()
        })), this._maxGeometryCount = e._maxGeometryCount, this._maxVertexCount = e._maxVertexCount, this._maxIndexCount = e._maxIndexCount, this._geometryInitialized = e._geometryInitialized, this._geometryCount = e._geometryCount, this._multiDrawCounts = e._multiDrawCounts.slice(), this._multiDrawStarts = e._multiDrawStarts.slice(), this._matricesTexture = e._matricesTexture.clone(), this._matricesTexture.image.data = this._matricesTexture.image.slice(), this._colorsTexture !== null && (this._colorsTexture = e._colorsTexture.clone(), this._colorsTexture.image.data = this._colorsTexture.image.slice()), this
    }
    dispose()
    {
        return this.geometry.dispose(), this._matricesTexture.dispose(), this._matricesTexture = null, this._colorsTexture !== null && (this._colorsTexture.dispose(), this._colorsTexture = null), this
    }
    onBeforeRender(e, t, s, n, r)
    {
        if (!this._visibilityChanged && !this.perObjectFrustumCulled && !this.sortObjects)
            return;
        const a = n.getIndex(),
            o = a === null ? 1 : a.array.BYTES_PER_ELEMENT,
            l = this._active,
            c = this._visibility,
            h = this._multiDrawStarts,
            d = this._multiDrawCounts,
            u = this._drawRanges,
            f = this.perObjectFrustumCulled;
        f && (a0.multiplyMatrices(s.projectionMatrix, s.matrixWorldInverse).multiply(this.matrixWorld), _f.setFromProjectionMatrix(a0, e.coordinateSystem));
        let p = 0;
        if (this.sortObjects) {
            yf.copy(this.matrixWorld).invert(),
            al.setFromMatrixPosition(s.matrixWorld).applyMatrix4(yf),
            o0.set(0, 0, -1).transformDirection(s.matrixWorld).transformDirection(yf);
            for (let g = 0, x = c.length; g < x; g++)
                if (c[g] && l[g]) {
                    this.getMatrixAt(g, Wn),
                    this.getBoundingSphereAt(g, Rr).applyMatrix4(Wn);
                    let v = !1;
                    if (f && (v = !_f.intersectsSphere(Rr)), !v) {
                        const y = oI.subVectors(Rr.center, al).dot(o0);
                        wf.push(u[g], y)
                    }
                }
            const A = wf.list,
                m = this.customSort;
            m === null ? A.sort(r.transparent ? sI : iI) : m.call(this, A, s);
            for (let g = 0, x = A.length; g < x; g++) {
                const v = A[g];
                h[p] = v.start * o,
                d[p] = v.count,
                p++
            }
            wf.reset()
        } else
            for (let A = 0, m = c.length; A < m; A++)
                if (c[A] && l[A]) {
                    let g = !1;
                    if (f && (this.getMatrixAt(A, Wn), this.getBoundingSphereAt(A, Rr).applyMatrix4(Wn), g = !_f.intersectsSphere(Rr)), !g) {
                        const x = u[A];
                        h[p] = x.start * o,
                        d[p] = x.count,
                        p++
                    }
                }
        this._multiDrawCount = p,
        this._visibilityChanged = !1
    }
    onBeforeShadow(e, t, s, n, r, a)
    {
        this.onBeforeRender(e, null, n, r, a)
    }
}
class ga extends fs {
    constructor(e)
    {
        super(),
        this.isLineBasicMaterial = !0,
        this.type = "LineBasicMaterial",
        this.color = new Z(16777215),
        this.map = null,
        this.linewidth = 1,
        this.linecap = "round",
        this.linejoin = "round",
        this.fog = !0,
        this.setValues(e)
    }
    copy(e)
    {
        return super.copy(e), this.color.copy(e.color), this.map = e.map, this.linewidth = e.linewidth, this.linecap = e.linecap, this.linejoin = e.linejoin, this.fog = e.fog, this
    }
}
const Ku = new b,
    Ju = new b,
    l0 = new De,
    ol = new Vo,
    uh = new bi,
    Ef = new b,
    c0 = new b;
class kA extends It {
    constructor(e=new ot, t=new ga)
    {
        super(),
        this.isLine = !0,
        this.type = "Line",
        this.geometry = e,
        this.material = t,
        this.updateMorphTargets()
    }
    copy(e, t)
    {
        return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this
    }
    computeLineDistances()
    {
        const e = this.geometry;
        if (e.index === null) {
            const t = e.attributes.position,
                s = [0];
            for (let n = 1, r = t.count; n < r; n++)
                Ku.fromBufferAttribute(t, n - 1),
                Ju.fromBufferAttribute(t, n),
                s[n] = s[n - 1],
                s[n] += Ku.distanceTo(Ju);
            e.setAttribute("lineDistance", new nt(s, 1))
        } else
            console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
        return this
    }
    raycast(e, t)
    {
        const s = this.geometry,
            n = this.matrixWorld,
            r = e.params.Line.threshold,
            a = s.drawRange;
        if (s.boundingSphere === null && s.computeBoundingSphere(), uh.copy(s.boundingSphere), uh.applyMatrix4(n), uh.radius += r, e.ray.intersectsSphere(uh) === !1)
            return;
        l0.copy(n).invert(),
        ol.copy(e.ray).applyMatrix4(l0);
        const o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3),
            l = o * o,
            c = this.isLineSegments ? 2 : 1,
            h = s.index,
            u = s.attributes.position;
        if (h !== null) {
            const f = Math.max(0, a.start),
                p = Math.min(h.count, a.start + a.count);
            for (let A = f, m = p - 1; A < m; A += c) {
                const g = h.getX(A),
                    x = h.getX(A + 1),
                    v = dh(this, e, ol, l, g, x);
                v && t.push(v)
            }
            if (this.isLineLoop) {
                const A = h.getX(p - 1),
                    m = h.getX(f),
                    g = dh(this, e, ol, l, A, m);
                g && t.push(g)
            }
        } else {
            const f = Math.max(0, a.start),
                p = Math.min(u.count, a.start + a.count);
            for (let A = f, m = p - 1; A < m; A += c) {
                const g = dh(this, e, ol, l, A, A + 1);
                g && t.push(g)
            }
            if (this.isLineLoop) {
                const A = dh(this, e, ol, l, p - 1, f);
                A && t.push(A)
            }
        }
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
}
function dh(i, e, t, s, n, r) {
    const a = i.geometry.attributes.position;
    if (Ku.fromBufferAttribute(a, n), Ju.fromBufferAttribute(a, r), t.distanceSqToSegment(Ku, Ju, Ef, c0) > s)
        return;
    Ef.applyMatrix4(i.matrixWorld);
    const l = e.ray.origin.distanceTo(Ef);
    if (!(l < e.near || l > e.far))
        return {
            distance: l,
            point: c0.clone().applyMatrix4(i.matrixWorld),
            index: n,
            face: null,
            faceIndex: null,
            object: i
        }
}
const h0 = new b,
    u0 = new b;
class yr extends kA {
    constructor(e, t)
    {
        super(e, t),
        this.isLineSegments = !0,
        this.type = "LineSegments"
    }
    computeLineDistances()
    {
        const e = this.geometry;
        if (e.index === null) {
            const t = e.attributes.position,
                s = [];
            for (let n = 0, r = t.count; n < r; n += 2)
                h0.fromBufferAttribute(t, n),
                u0.fromBufferAttribute(t, n + 1),
                s[n] = n === 0 ? 0 : s[n - 1],
                s[n + 1] = s[n] + h0.distanceTo(u0);
            e.setAttribute("lineDistance", new nt(s, 1))
        } else
            console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
        return this
    }
}
class hI extends kA {
    constructor(e, t)
    {
        super(e, t),
        this.isLineLoop = !0,
        this.type = "LineLoop"
    }
}
class Hy extends fs {
    constructor(e)
    {
        super(),
        this.isPointsMaterial = !0,
        this.type = "PointsMaterial",
        this.color = new Z(16777215),
        this.map = null,
        this.alphaMap = null,
        this.size = 1,
        this.sizeAttenuation = !0,
        this.fog = !0,
        this.setValues(e)
    }
    copy(e)
    {
        return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.size = e.size, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this
    }
}
const d0 = new De,
    Qp = new Vo,
    fh = new bi,
    ph = new b;
class Fn extends It {
    constructor(e=new ot, t=new Hy)
    {
        super(),
        this.isPoints = !0,
        this.type = "Points",
        this.geometry = e,
        this.material = t,
        this.updateMorphTargets()
    }
    copy(e, t)
    {
        return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this
    }
    raycast(e, t)
    {
        const s = this.geometry,
            n = this.matrixWorld,
            r = e.params.Points.threshold,
            a = s.drawRange;
        if (s.boundingSphere === null && s.computeBoundingSphere(), fh.copy(s.boundingSphere), fh.applyMatrix4(n), fh.radius += r, e.ray.intersectsSphere(fh) === !1)
            return;
        d0.copy(n).invert(),
        Qp.copy(e.ray).applyMatrix4(d0);
        const o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3),
            l = o * o,
            c = s.index,
            d = s.attributes.position;
        if (c !== null) {
            const u = Math.max(0, a.start),
                f = Math.min(c.count, a.start + a.count);
            for (let p = u, A = f; p < A; p++) {
                const m = c.getX(p);
                ph.fromBufferAttribute(d, m),
                f0(ph, m, l, n, e, t, this)
            }
        } else {
            const u = Math.max(0, a.start),
                f = Math.min(d.count, a.start + a.count);
            for (let p = u, A = f; p < A; p++)
                ph.fromBufferAttribute(d, p),
                f0(ph, p, l, n, e, t, this)
        }
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
}
function f0(i, e, t, s, n, r, a) {
    const o = Qp.distanceSqToPoint(i);
    if (o < t) {
        const l = new b;
        Qp.closestPointToPoint(i, l),
        l.applyMatrix4(s);
        const c = n.ray.origin.distanceTo(l);
        if (c < n.near || c > n.far)
            return;
        r.push({
            distance: c,
            distanceToRay: Math.sqrt(o),
            point: l,
            index: e,
            face: null,
            object: a
        })
    }
}
class uI extends Rt {
    constructor(e, t, s, n, r, a, o, l, c)
    {
        super(e, t, s, n, r, a, o, l, c),
        this.isVideoTexture = !0,
        this.minFilter = a !== void 0 ? a : _t,
        this.magFilter = r !== void 0 ? r : _t,
        this.generateMipmaps = !1;
        const h = this;
        function d() {
            h.needsUpdate = !0,
            e.requestVideoFrameCallback(d)
        }
        "requestVideoFrameCallback" in e && e.requestVideoFrameCallback(d)
    }
    clone()
    {
        return new this.constructor(this.image).copy(this)
    }
    update()
    {
        const e = this.image;
        "requestVideoFrameCallback" in e === !1 && e.readyState >= e.HAVE_CURRENT_DATA && (this.needsUpdate = !0)
    }
}
class bc extends Rt {
    constructor(e, t, s, n, r, a, o, l, c, h, d, u)
    {
        super(null, a, o, l, c, h, n, r, d, u),
        this.isCompressedTexture = !0,
        this.image = {
            width: t,
            height: s
        },
        this.mipmaps = e,
        this.flipY = !1,
        this.generateMipmaps = !1
    }
}
class dI extends bc {
    constructor(e, t, s, n, r, a)
    {
        super(e, t, s, r, a),
        this.isCompressedArrayTexture = !0,
        this.image.depth = n,
        this.wrapR = zs,
        this.layerUpdates = new Set
    }
    addLayerUpdates(e)
    {
        this.layerUpdates.add(e)
    }
    clearLayerUpdates()
    {
        this.layerUpdates.clear()
    }
}
class Vy extends bc {
    constructor(e, t, s)
    {
        super(void 0, e[0].width, e[0].height, t, s, la),
        this.isCompressedCubeTexture = !0,
        this.isCubeTexture = !0,
        this.image = e
    }
}
class un {
    constructor()
    {
        this.type = "Curve",
        this.arcLengthDivisions = 200
    }
    getPoint()
    {
        return console.warn("THREE.Curve: .getPoint() not implemented."), null
    }
    getPointAt(e, t)
    {
        const s = this.getUtoTmapping(e);
        return this.getPoint(s, t)
    }
    getPoints(e=5)
    {
        const t = [];
        for (let s = 0; s <= e; s++)
            t.push(this.getPoint(s / e));
        return t
    }
    getSpacedPoints(e=5)
    {
        const t = [];
        for (let s = 0; s <= e; s++)
            t.push(this.getPointAt(s / e));
        return t
    }
    getLength()
    {
        const e = this.getLengths();
        return e[e.length - 1]
    }
    getLengths(e=this.arcLengthDivisions)
    {
        if (this.cacheArcLengths && this.cacheArcLengths.length === e + 1 && !this.needsUpdate)
            return this.cacheArcLengths;
        this.needsUpdate = !1;
        const t = [];
        let s,
            n = this.getPoint(0),
            r = 0;
        t.push(0);
        for (let a = 1; a <= e; a++)
            s = this.getPoint(a / e),
            r += s.distanceTo(n),
            t.push(r),
            n = s;
        return this.cacheArcLengths = t, t
    }
    updateArcLengths()
    {
        this.needsUpdate = !0,
        this.getLengths()
    }
    getUtoTmapping(e, t)
    {
        const s = this.getLengths();
        let n = 0;
        const r = s.length;
        let a;
        t ? a = t : a = e * s[r - 1];
        let o = 0,
            l = r - 1,
            c;
        for (; o <= l;)
            if (n = Math.floor(o + (l - o) / 2), c = s[n] - a, c < 0)
                o = n + 1;
            else if (c > 0)
                l = n - 1;
            else {
                l = n;
                break
            }
        if (n = l, s[n] === a)
            return n / (r - 1);
        const h = s[n],
            u = s[n + 1] - h,
            f = (a - h) / u;
        return (n + f) / (r - 1)
    }
    getTangent(e, t)
    {
        let n = e - 1e-4,
            r = e + 1e-4;
        n < 0 && (n = 0),
        r > 1 && (r = 1);
        const a = this.getPoint(n),
            o = this.getPoint(r),
            l = t || (a.isVector2 ? new H : new b);
        return l.copy(o).sub(a).normalize(), l
    }
    getTangentAt(e, t)
    {
        const s = this.getUtoTmapping(e);
        return this.getTangent(s, t)
    }
    computeFrenetFrames(e, t)
    {
        const s = new b,
            n = [],
            r = [],
            a = [],
            o = new b,
            l = new De;
        for (let f = 0; f <= e; f++) {
            const p = f / e;
            n[f] = this.getTangentAt(p, new b)
        }
        r[0] = new b,
        a[0] = new b;
        let c = Number.MAX_VALUE;
        const h = Math.abs(n[0].x),
            d = Math.abs(n[0].y),
            u = Math.abs(n[0].z);
        h <= c && (c = h, s.set(1, 0, 0)),
        d <= c && (c = d, s.set(0, 1, 0)),
        u <= c && s.set(0, 0, 1),
        o.crossVectors(n[0], s).normalize(),
        r[0].crossVectors(n[0], o),
        a[0].crossVectors(n[0], r[0]);
        for (let f = 1; f <= e; f++) {
            if (r[f] = r[f - 1].clone(), a[f] = a[f - 1].clone(), o.crossVectors(n[f - 1], n[f]), o.length() > Number.EPSILON) {
                o.normalize();
                const p = Math.acos(hi(n[f - 1].dot(n[f]), -1, 1));
                r[f].applyMatrix4(l.makeRotationAxis(o, p))
            }
            a[f].crossVectors(n[f], r[f])
        }
        if (t === !0) {
            let f = Math.acos(hi(r[0].dot(r[e]), -1, 1));
            f /= e,
            n[0].dot(o.crossVectors(r[0], r[e])) > 0 && (f = -f);
            for (let p = 1; p <= e; p++)
                r[p].applyMatrix4(l.makeRotationAxis(n[p], f * p)),
                a[p].crossVectors(n[p], r[p])
        }
        return {
            tangents: n,
            normals: r,
            binormals: a
        }
    }
    clone()
    {
        return new this.constructor().copy(this)
    }
    copy(e)
    {
        return this.arcLengthDivisions = e.arcLengthDivisions, this
    }
    toJSON()
    {
        const e = {
            metadata: {
                version: 4.6,
                type: "Curve",
                generator: "Curve.toJSON"
            }
        };
        return e.arcLengthDivisions = this.arcLengthDivisions, e.type = this.type, e
    }
    fromJSON(e)
    {
        return this.arcLengthDivisions = e.arcLengthDivisions, this
    }
}
class Wy extends un {
    constructor(e=0, t=0, s=1, n=1, r=0, a=Math.PI * 2, o=!1, l=0)
    {
        super(),
        this.isEllipseCurve = !0,
        this.type = "EllipseCurve",
        this.aX = e,
        this.aY = t,
        this.xRadius = s,
        this.yRadius = n,
        this.aStartAngle = r,
        this.aEndAngle = a,
        this.aClockwise = o,
        this.aRotation = l
    }
    getPoint(e, t=new H)
    {
        const s = t,
            n = Math.PI * 2;
        let r = this.aEndAngle - this.aStartAngle;
        const a = Math.abs(r) < Number.EPSILON;
        for (; r < 0;)
            r += n;
        for (; r > n;)
            r -= n;
        r < Number.EPSILON && (a ? r = 0 : r = n),
        this.aClockwise === !0 && !a && (r === n ? r = -n : r = r - n);
        const o = this.aStartAngle + e * r;
        let l = this.aX + this.xRadius * Math.cos(o),
            c = this.aY + this.yRadius * Math.sin(o);
        if (this.aRotation !== 0) {
            const h = Math.cos(this.aRotation),
                d = Math.sin(this.aRotation),
                u = l - this.aX,
                f = c - this.aY;
            l = u * h - f * d + this.aX,
            c = u * d + f * h + this.aY
        }
        return s.set(l, c)
    }
    copy(e)
    {
        return super.copy(e), this.aX = e.aX, this.aY = e.aY, this.xRadius = e.xRadius, this.yRadius = e.yRadius, this.aStartAngle = e.aStartAngle, this.aEndAngle = e.aEndAngle, this.aClockwise = e.aClockwise, this.aRotation = e.aRotation, this
    }
    toJSON()
    {
        const e = super.toJSON();
        return e.aX = this.aX, e.aY = this.aY, e.xRadius = this.xRadius, e.yRadius = this.yRadius, e.aStartAngle = this.aStartAngle, e.aEndAngle = this.aEndAngle, e.aClockwise = this.aClockwise, e.aRotation = this.aRotation, e
    }
    fromJSON(e)
    {
        return super.fromJSON(e), this.aX = e.aX, this.aY = e.aY, this.xRadius = e.xRadius, this.yRadius = e.yRadius, this.aStartAngle = e.aStartAngle, this.aEndAngle = e.aEndAngle, this.aClockwise = e.aClockwise, this.aRotation = e.aRotation, this
    }
}
class fI extends Wy {
    constructor(e, t, s, n, r, a)
    {
        super(e, t, s, s, n, r, a),
        this.isArcCurve = !0,
        this.type = "ArcCurve"
    }
}
function zA() {
    let i = 0,
        e = 0,
        t = 0,
        s = 0;
    function n(r, a, o, l) {
        i = r,
        e = o,
        t = -3 * r + 3 * a - 2 * o - l,
        s = 2 * r - 2 * a + o + l
    }
    return {
        initCatmullRom: function(r, a, o, l, c) {
            n(a, o, c * (o - r), c * (l - a))
        },
        initNonuniformCatmullRom: function(r, a, o, l, c, h, d) {
            let u = (a - r) / c - (o - r) / (c + h) + (o - a) / h,
                f = (o - a) / h - (l - a) / (h + d) + (l - o) / d;
            u *= h,
            f *= h,
            n(a, o, u, f)
        },
        calc: function(r) {
            const a = r * r,
                o = a * r;
            return i + e * r + t * a + s * o
        }
    }
}
const mh = new b,
    Cf = new zA,
    Sf = new zA,
    Mf = new zA;
class pI extends un {
    constructor(e=[], t=!1, s="centripetal", n=.5)
    {
        super(),
        this.isCatmullRomCurve3 = !0,
        this.type = "CatmullRomCurve3",
        this.points = e,
        this.closed = t,
        this.curveType = s,
        this.tension = n
    }
    getPoint(e, t=new b)
    {
        const s = t,
            n = this.points,
            r = n.length,
            a = (r - (this.closed ? 0 : 1)) * e;
        let o = Math.floor(a),
            l = a - o;
        this.closed ? o += o > 0 ? 0 : (Math.floor(Math.abs(o) / r) + 1) * r : l === 0 && o === r - 1 && (o = r - 2, l = 1);
        let c,
            h;
        this.closed || o > 0 ? c = n[(o - 1) % r] : (mh.subVectors(n[0], n[1]).add(n[0]), c = mh);
        const d = n[o % r],
            u = n[(o + 1) % r];
        if (this.closed || o + 2 < r ? h = n[(o + 2) % r] : (mh.subVectors(n[r - 1], n[r - 2]).add(n[r - 1]), h = mh), this.curveType === "centripetal" || this.curveType === "chordal") {
            const f = this.curveType === "chordal" ? .5 : .25;
            let p = Math.pow(c.distanceToSquared(d), f),
                A = Math.pow(d.distanceToSquared(u), f),
                m = Math.pow(u.distanceToSquared(h), f);
            A < 1e-4 && (A = 1),
            p < 1e-4 && (p = A),
            m < 1e-4 && (m = A),
            Cf.initNonuniformCatmullRom(c.x, d.x, u.x, h.x, p, A, m),
            Sf.initNonuniformCatmullRom(c.y, d.y, u.y, h.y, p, A, m),
            Mf.initNonuniformCatmullRom(c.z, d.z, u.z, h.z, p, A, m)
        } else
            this.curveType === "catmullrom" && (Cf.initCatmullRom(c.x, d.x, u.x, h.x, this.tension), Sf.initCatmullRom(c.y, d.y, u.y, h.y, this.tension), Mf.initCatmullRom(c.z, d.z, u.z, h.z, this.tension));
        return s.set(Cf.calc(l), Sf.calc(l), Mf.calc(l)), s
    }
    copy(e)
    {
        super.copy(e),
        this.points = [];
        for (let t = 0, s = e.points.length; t < s; t++) {
            const n = e.points[t];
            this.points.push(n.clone())
        }
        return this.closed = e.closed, this.curveType = e.curveType, this.tension = e.tension, this
    }
    toJSON()
    {
        const e = super.toJSON();
        e.points = [];
        for (let t = 0, s = this.points.length; t < s; t++) {
            const n = this.points[t];
            e.points.push(n.toArray())
        }
        return e.closed = this.closed, e.curveType = this.curveType, e.tension = this.tension, e
    }
    fromJSON(e)
    {
        super.fromJSON(e),
        this.points = [];
        for (let t = 0, s = e.points.length; t < s; t++) {
            const n = e.points[t];
            this.points.push(new b().fromArray(n))
        }
        return this.closed = e.closed, this.curveType = e.curveType, this.tension = e.tension, this
    }
}
function p0(i, e, t, s, n) {
    const r = (s - e) * .5,
        a = (n - t) * .5,
        o = i * i,
        l = i * o;
    return (2 * t - 2 * s + r + a) * l + (-3 * t + 3 * s - 2 * r - a) * o + r * i + t
}
function mI(i, e) {
    const t = 1 - i;
    return t * t * e
}
function AI(i, e) {
    return 2 * (1 - i) * i * e
}
function gI(i, e) {
    return i * i * e
}
function Hl(i, e, t, s) {
    return mI(i, e) + AI(i, t) + gI(i, s)
}
function vI(i, e) {
    const t = 1 - i;
    return t * t * t * e
}
function xI(i, e) {
    const t = 1 - i;
    return 3 * t * t * i * e
}
function yI(i, e) {
    return 3 * (1 - i) * i * i * e
}
function _I(i, e) {
    return i * i * i * e
}
function Vl(i, e, t, s, n) {
    return vI(i, e) + xI(i, t) + yI(i, s) + _I(i, n)
}
class wI extends un {
    constructor(e=new H, t=new H, s=new H, n=new H)
    {
        super(),
        this.isCubicBezierCurve = !0,
        this.type = "CubicBezierCurve",
        this.v0 = e,
        this.v1 = t,
        this.v2 = s,
        this.v3 = n
    }
    getPoint(e, t=new H)
    {
        const s = t,
            n = this.v0,
            r = this.v1,
            a = this.v2,
            o = this.v3;
        return s.set(Vl(e, n.x, r.x, a.x, o.x), Vl(e, n.y, r.y, a.y, o.y)), s
    }
    copy(e)
    {
        return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this.v3.copy(e.v3), this
    }
    toJSON()
    {
        const e = super.toJSON();
        return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e.v3 = this.v3.toArray(), e
    }
    fromJSON(e)
    {
        return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this.v3.fromArray(e.v3), this
    }
}
class EI extends un {
    constructor(e=new b, t=new b, s=new b, n=new b)
    {
        super(),
        this.isCubicBezierCurve3 = !0,
        this.type = "CubicBezierCurve3",
        this.v0 = e,
        this.v1 = t,
        this.v2 = s,
        this.v3 = n
    }
    getPoint(e, t=new b)
    {
        const s = t,
            n = this.v0,
            r = this.v1,
            a = this.v2,
            o = this.v3;
        return s.set(Vl(e, n.x, r.x, a.x, o.x), Vl(e, n.y, r.y, a.y, o.y), Vl(e, n.z, r.z, a.z, o.z)), s
    }
    copy(e)
    {
        return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this.v3.copy(e.v3), this
    }
    toJSON()
    {
        const e = super.toJSON();
        return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e.v3 = this.v3.toArray(), e
    }
    fromJSON(e)
    {
        return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this.v3.fromArray(e.v3), this
    }
}
class CI extends un {
    constructor(e=new H, t=new H)
    {
        super(),
        this.isLineCurve = !0,
        this.type = "LineCurve",
        this.v1 = e,
        this.v2 = t
    }
    getPoint(e, t=new H)
    {
        const s = t;
        return e === 1 ? s.copy(this.v2) : (s.copy(this.v2).sub(this.v1), s.multiplyScalar(e).add(this.v1)), s
    }
    getPointAt(e, t)
    {
        return this.getPoint(e, t)
    }
    getTangent(e, t=new H)
    {
        return t.subVectors(this.v2, this.v1).normalize()
    }
    getTangentAt(e, t)
    {
        return this.getTangent(e, t)
    }
    copy(e)
    {
        return super.copy(e), this.v1.copy(e.v1), this.v2.copy(e.v2), this
    }
    toJSON()
    {
        const e = super.toJSON();
        return e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e
    }
    fromJSON(e)
    {
        return super.fromJSON(e), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this
    }
}
class Yy extends un {
    constructor(e=new b, t=new b)
    {
        super(),
        this.isLineCurve3 = !0,
        this.type = "LineCurve3",
        this.v1 = e,
        this.v2 = t
    }
    getPoint(e, t=new b)
    {
        const s = t;
        return e === 1 ? s.copy(this.v2) : (s.copy(this.v2).sub(this.v1), s.multiplyScalar(e).add(this.v1)), s
    }
    getPointAt(e, t)
    {
        return this.getPoint(e, t)
    }
    getTangent(e, t=new b)
    {
        return t.subVectors(this.v2, this.v1).normalize()
    }
    getTangentAt(e, t)
    {
        return this.getTangent(e, t)
    }
    copy(e)
    {
        return super.copy(e), this.v1.copy(e.v1), this.v2.copy(e.v2), this
    }
    toJSON()
    {
        const e = super.toJSON();
        return e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e
    }
    fromJSON(e)
    {
        return super.fromJSON(e), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this
    }
}
class SI extends un {
    constructor(e=new H, t=new H, s=new H)
    {
        super(),
        this.isQuadraticBezierCurve = !0,
        this.type = "QuadraticBezierCurve",
        this.v0 = e,
        this.v1 = t,
        this.v2 = s
    }
    getPoint(e, t=new H)
    {
        const s = t,
            n = this.v0,
            r = this.v1,
            a = this.v2;
        return s.set(Hl(e, n.x, r.x, a.x), Hl(e, n.y, r.y, a.y)), s
    }
    copy(e)
    {
        return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this
    }
    toJSON()
    {
        const e = super.toJSON();
        return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e
    }
    fromJSON(e)
    {
        return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this
    }
}
class MI extends un {
    constructor(e=new b, t=new b, s=new b)
    {
        super(),
        this.isQuadraticBezierCurve3 = !0,
        this.type = "QuadraticBezierCurve3",
        this.v0 = e,
        this.v1 = t,
        this.v2 = s
    }
    getPoint(e, t=new b)
    {
        const s = t,
            n = this.v0,
            r = this.v1,
            a = this.v2;
        return s.set(Hl(e, n.x, r.x, a.x), Hl(e, n.y, r.y, a.y), Hl(e, n.z, r.z, a.z)), s
    }
    copy(e)
    {
        return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this
    }
    toJSON()
    {
        const e = super.toJSON();
        return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e
    }
    fromJSON(e)
    {
        return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this
    }
}
class bI extends un {
    constructor(e=[])
    {
        super(),
        this.isSplineCurve = !0,
        this.type = "SplineCurve",
        this.points = e
    }
    getPoint(e, t=new H)
    {
        const s = t,
            n = this.points,
            r = (n.length - 1) * e,
            a = Math.floor(r),
            o = r - a,
            l = n[a === 0 ? a : a - 1],
            c = n[a],
            h = n[a > n.length - 2 ? n.length - 1 : a + 1],
            d = n[a > n.length - 3 ? n.length - 1 : a + 2];
        return s.set(p0(o, l.x, c.x, h.x, d.x), p0(o, l.y, c.y, h.y, d.y)), s
    }
    copy(e)
    {
        super.copy(e),
        this.points = [];
        for (let t = 0, s = e.points.length; t < s; t++) {
            const n = e.points[t];
            this.points.push(n.clone())
        }
        return this
    }
    toJSON()
    {
        const e = super.toJSON();
        e.points = [];
        for (let t = 0, s = this.points.length; t < s; t++) {
            const n = this.points[t];
            e.points.push(n.toArray())
        }
        return e
    }
    fromJSON(e)
    {
        super.fromJSON(e),
        this.points = [];
        for (let t = 0, s = e.points.length; t < s; t++) {
            const n = e.points[t];
            this.points.push(new H().fromArray(n))
        }
        return this
    }
}
var m0 = Object.freeze({
    __proto__: null,
    ArcCurve: fI,
    CatmullRomCurve3: pI,
    CubicBezierCurve: wI,
    CubicBezierCurve3: EI,
    EllipseCurve: Wy,
    LineCurve: CI,
    LineCurve3: Yy,
    QuadraticBezierCurve: SI,
    QuadraticBezierCurve3: MI,
    SplineCurve: bI
});
class TI extends un {
    constructor()
    {
        super(),
        this.type = "CurvePath",
        this.curves = [],
        this.autoClose = !1
    }
    add(e)
    {
        this.curves.push(e)
    }
    closePath()
    {
        const e = this.curves[0].getPoint(0),
            t = this.curves[this.curves.length - 1].getPoint(1);
        if (!e.equals(t)) {
            const s = e.isVector2 === !0 ? "LineCurve" : "LineCurve3";
            this.curves.push(new m0[s](t, e))
        }
        return this
    }
    getPoint(e, t)
    {
        const s = e * this.getLength(),
            n = this.getCurveLengths();
        let r = 0;
        for (; r < n.length;) {
            if (n[r] >= s) {
                const a = n[r] - s,
                    o = this.curves[r],
                    l = o.getLength(),
                    c = l === 0 ? 0 : 1 - a / l;
                return o.getPointAt(c, t)
            }
            r++
        }
        return null
    }
    getLength()
    {
        const e = this.getCurveLengths();
        return e[e.length - 1]
    }
    updateArcLengths()
    {
        this.needsUpdate = !0,
        this.cacheLengths = null,
        this.getCurveLengths()
    }
    getCurveLengths()
    {
        if (this.cacheLengths && this.cacheLengths.length === this.curves.length)
            return this.cacheLengths;
        const e = [];
        let t = 0;
        for (let s = 0, n = this.curves.length; s < n; s++)
            t += this.curves[s].getLength(),
            e.push(t);
        return this.cacheLengths = e, e
    }
    getSpacedPoints(e=40)
    {
        const t = [];
        for (let s = 0; s <= e; s++)
            t.push(this.getPoint(s / e));
        return this.autoClose && t.push(t[0]), t
    }
    getPoints(e=12)
    {
        const t = [];
        let s;
        for (let n = 0, r = this.curves; n < r.length; n++) {
            const a = r[n],
                o = a.isEllipseCurve ? e * 2 : a.isLineCurve || a.isLineCurve3 ? 1 : a.isSplineCurve ? e * a.points.length : e,
                l = a.getPoints(o);
            for (let c = 0; c < l.length; c++) {
                const h = l[c];
                s && s.equals(h) || (t.push(h), s = h)
            }
        }
        return this.autoClose && t.length > 1 && !t[t.length - 1].equals(t[0]) && t.push(t[0]), t
    }
    copy(e)
    {
        super.copy(e),
        this.curves = [];
        for (let t = 0, s = e.curves.length; t < s; t++) {
            const n = e.curves[t];
            this.curves.push(n.clone())
        }
        return this.autoClose = e.autoClose, this
    }
    toJSON()
    {
        const e = super.toJSON();
        e.autoClose = this.autoClose,
        e.curves = [];
        for (let t = 0, s = this.curves.length; t < s; t++) {
            const n = this.curves[t];
            e.curves.push(n.toJSON())
        }
        return e
    }
    fromJSON(e)
    {
        super.fromJSON(e),
        this.autoClose = e.autoClose,
        this.curves = [];
        for (let t = 0, s = e.curves.length; t < s; t++) {
            const n = e.curves[t];
            this.curves.push(new m0[n.type]().fromJSON(n))
        }
        return this
    }
}
class Md extends ot {
    constructor(e=1, t=1, s=1, n=32, r=1, a=!1, o=0, l=Math.PI * 2)
    {
        super(),
        this.type = "CylinderGeometry",
        this.parameters = {
            radiusTop: e,
            radiusBottom: t,
            height: s,
            radialSegments: n,
            heightSegments: r,
            openEnded: a,
            thetaStart: o,
            thetaLength: l
        };
        const c = this;
        n = Math.floor(n),
        r = Math.floor(r);
        const h = [],
            d = [],
            u = [],
            f = [];
        let p = 0;
        const A = [],
            m = s / 2;
        let g = 0;
        x(),
        a === !1 && (e > 0 && v(!0), t > 0 && v(!1)),
        this.setIndex(h),
        this.setAttribute("position", new nt(d, 3)),
        this.setAttribute("normal", new nt(u, 3)),
        this.setAttribute("uv", new nt(f, 2));
        function x() {
            const y = new b,
                S = new b;
            let w = 0;
            const C = (t - e) / s;
            for (let M = 0; M <= r; M++) {
                const E = [],
                    _ = M / r,
                    I = _ * (t - e) + e;
                for (let P = 0; P <= n; P++) {
                    const D = P / n,
                        L = D * l + o,
                        z = Math.sin(L),
                        O = Math.cos(L);
                    S.x = I * z,
                    S.y = -_ * s + m,
                    S.z = I * O,
                    d.push(S.x, S.y, S.z),
                    y.set(z, C, O).normalize(),
                    u.push(y.x, y.y, y.z),
                    f.push(D, 1 - _),
                    E.push(p++)
                }
                A.push(E)
            }
            for (let M = 0; M < n; M++)
                for (let E = 0; E < r; E++) {
                    const _ = A[E][M],
                        I = A[E + 1][M],
                        P = A[E + 1][M + 1],
                        D = A[E][M + 1];
                    h.push(_, I, D),
                    h.push(I, P, D),
                    w += 6
                }
            c.addGroup(g, w, 0),
            g += w
        }
        function v(y) {
            const S = p,
                w = new H,
                C = new b;
            let M = 0;
            const E = y === !0 ? e : t,
                _ = y === !0 ? 1 : -1;
            for (let P = 1; P <= n; P++)
                d.push(0, m * _, 0),
                u.push(0, _, 0),
                f.push(.5, .5),
                p++;
            const I = p;
            for (let P = 0; P <= n; P++) {
                const L = P / n * l + o,
                    z = Math.cos(L),
                    O = Math.sin(L);
                C.x = E * O,
                C.y = m * _,
                C.z = E * z,
                d.push(C.x, C.y, C.z),
                u.push(0, _, 0),
                w.x = z * .5 + .5,
                w.y = O * .5 * _ + .5,
                f.push(w.x, w.y),
                p++
            }
            for (let P = 0; P < n; P++) {
                const D = S + P,
                    L = I + P;
                y === !0 ? h.push(L, L + 1, D) : h.push(L + 1, L, D),
                M += 3
            }
            c.addGroup(g, M, y === !0 ? 1 : 2),
            g += M
        }
    }
    copy(e)
    {
        return super.copy(e), this.parameters = Object.assign({}, e.parameters), this
    }
    static fromJSON(e)
    {
        return new Md(e.radiusTop, e.radiusBottom, e.height, e.radialSegments, e.heightSegments, e.openEnded, e.thetaStart, e.thetaLength)
    }
}
