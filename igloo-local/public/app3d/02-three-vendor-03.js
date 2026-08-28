const gM = `varying vec2 vUv;
    uniform mat3 uvTransform;
    void main() {
    	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
    	gl_Position = vec4( position.xy, 1.0, 1.0 );
    }`,
    vM = `uniform sampler2D t2D;
    uniform float backgroundIntensity;
    varying vec2 vUv;
    void main() {
    	vec4 texColor = texture2D( t2D, vUv );
    	#ifdef DECODE_VIDEO_TEXTURE
    		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
    	#endif
    	texColor.rgb *= backgroundIntensity;
    	gl_FragColor = texColor;
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    }`,
    xM = `varying vec3 vWorldDirection;
    #include <common>
    void main() {
    	vWorldDirection = transformDirection( position, modelMatrix );
    	#include <begin_vertex>
    	#include <project_vertex>
    	gl_Position.z = gl_Position.w;
    }`,
    yM = `#ifdef ENVMAP_TYPE_CUBE
    	uniform samplerCube envMap;
    #elif defined( ENVMAP_TYPE_CUBE_UV )
    	uniform sampler2D envMap;
    #endif
    uniform float flipEnvMap;
    uniform float backgroundBlurriness;
    uniform float backgroundIntensity;
    uniform mat3 backgroundRotation;
    varying vec3 vWorldDirection;
    #include <cube_uv_reflection_fragment>
    void main() {
    	#ifdef ENVMAP_TYPE_CUBE
    		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
    	#elif defined( ENVMAP_TYPE_CUBE_UV )
    		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
    	#else
    		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
    	#endif
    	texColor.rgb *= backgroundIntensity;
    	gl_FragColor = texColor;
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    }`,
    _M = `varying vec3 vWorldDirection;
    #include <common>
    void main() {
    	vWorldDirection = transformDirection( position, modelMatrix );
    	#include <begin_vertex>
    	#include <project_vertex>
    	gl_Position.z = gl_Position.w;
    }`,
    wM = `uniform samplerCube tCube;
    uniform float tFlip;
    uniform float opacity;
    varying vec3 vWorldDirection;
    void main() {
    	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
    	gl_FragColor = texColor;
    	gl_FragColor.a *= opacity;
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    }`,
    EM = `#include <common>
    #include <batching_pars_vertex>
    #include <uv_pars_vertex>
    #include <displacementmap_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>
    varying vec2 vHighPrecisionZW;
    void main() {
    	#include <uv_vertex>
    	#include <batching_vertex>
    	#include <skinbase_vertex>
    	#include <morphinstance_vertex>
    	#ifdef USE_DISPLACEMENTMAP
    		#include <beginnormal_vertex>
    		#include <morphnormal_vertex>
    		#include <skinnormal_vertex>
    	#endif
    	#include <begin_vertex>
    	#include <morphtarget_vertex>
    	#include <skinning_vertex>
    	#include <displacementmap_vertex>
    	#include <project_vertex>
    	#include <logdepthbuf_vertex>
    	#include <clipping_planes_vertex>
    	vHighPrecisionZW = gl_Position.zw;
    }`,
    CM = `#if DEPTH_PACKING == 3200
    	uniform float opacity;
    #endif
    #include <common>
    #include <packing>
    #include <uv_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <alphatest_pars_fragment>
    #include <alphahash_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>
    varying vec2 vHighPrecisionZW;
    void main() {
    	vec4 diffuseColor = vec4( 1.0 );
    	#include <clipping_planes_fragment>
    	#if DEPTH_PACKING == 3200
    		diffuseColor.a = opacity;
    	#endif
    	#include <map_fragment>
    	#include <alphamap_fragment>
    	#include <alphatest_fragment>
    	#include <alphahash_fragment>
    	#include <logdepthbuf_fragment>
    	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
    	#if DEPTH_PACKING == 3200
    		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
    	#elif DEPTH_PACKING == 3201
    		gl_FragColor = packDepthToRGBA( fragCoordZ );
    	#endif
    }`,
    SM = `#define DISTANCE
    varying vec3 vWorldPosition;
    #include <common>
    #include <batching_pars_vertex>
    #include <uv_pars_vertex>
    #include <displacementmap_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <clipping_planes_pars_vertex>
    void main() {
    	#include <uv_vertex>
    	#include <batching_vertex>
    	#include <skinbase_vertex>
    	#include <morphinstance_vertex>
    	#ifdef USE_DISPLACEMENTMAP
    		#include <beginnormal_vertex>
    		#include <morphnormal_vertex>
    		#include <skinnormal_vertex>
    	#endif
    	#include <begin_vertex>
    	#include <morphtarget_vertex>
    	#include <skinning_vertex>
    	#include <displacementmap_vertex>
    	#include <project_vertex>
    	#include <worldpos_vertex>
    	#include <clipping_planes_vertex>
    	vWorldPosition = worldPosition.xyz;
    }`,
    MM = `#define DISTANCE
    uniform vec3 referencePosition;
    uniform float nearDistance;
    uniform float farDistance;
    varying vec3 vWorldPosition;
    #include <common>
    #include <packing>
    #include <uv_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <alphatest_pars_fragment>
    #include <alphahash_pars_fragment>
    #include <clipping_planes_pars_fragment>
    void main () {
    	vec4 diffuseColor = vec4( 1.0 );
    	#include <clipping_planes_fragment>
    	#include <map_fragment>
    	#include <alphamap_fragment>
    	#include <alphatest_fragment>
    	#include <alphahash_fragment>
    	float dist = length( vWorldPosition - referencePosition );
    	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
    	dist = saturate( dist );
    	gl_FragColor = packDepthToRGBA( dist );
    }`,
    bM = `varying vec3 vWorldDirection;
    #include <common>
    void main() {
    	vWorldDirection = transformDirection( position, modelMatrix );
    	#include <begin_vertex>
    	#include <project_vertex>
    }`,
    TM = `uniform sampler2D tEquirect;
    varying vec3 vWorldDirection;
    #include <common>
    void main() {
    	vec3 direction = normalize( vWorldDirection );
    	vec2 sampleUV = equirectUv( direction );
    	gl_FragColor = texture2D( tEquirect, sampleUV );
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    }`,
    IM = `uniform float scale;
    attribute float lineDistance;
    varying float vLineDistance;
    #include <common>
    #include <uv_pars_vertex>
    #include <color_pars_vertex>
    #include <fog_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>
    void main() {
    	vLineDistance = scale * lineDistance;
    	#include <uv_vertex>
    	#include <color_vertex>
    	#include <morphinstance_vertex>
    	#include <morphcolor_vertex>
    	#include <begin_vertex>
    	#include <morphtarget_vertex>
    	#include <project_vertex>
    	#include <logdepthbuf_vertex>
    	#include <clipping_planes_vertex>
    	#include <fog_vertex>
    }`,
    BM = `uniform vec3 diffuse;
    uniform float opacity;
    uniform float dashSize;
    uniform float totalSize;
    varying float vLineDistance;
    #include <common>
    #include <color_pars_fragment>
    #include <uv_pars_fragment>
    #include <map_pars_fragment>
    #include <fog_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>
    void main() {
    	vec4 diffuseColor = vec4( diffuse, opacity );
    	#include <clipping_planes_fragment>
    	if ( mod( vLineDistance, totalSize ) > dashSize ) {
    		discard;
    	}
    	vec3 outgoingLight = vec3( 0.0 );
    	#include <logdepthbuf_fragment>
    	#include <map_fragment>
    	#include <color_fragment>
    	outgoingLight = diffuseColor.rgb;
    	#include <opaque_fragment>
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    	#include <fog_fragment>
    	#include <premultiplied_alpha_fragment>
    }`,
    PM = `#include <common>
    #include <batching_pars_vertex>
    #include <uv_pars_vertex>
    #include <envmap_pars_vertex>
    #include <color_pars_vertex>
    #include <fog_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>
    void main() {
    	#include <uv_vertex>
    	#include <color_vertex>
    	#include <morphinstance_vertex>
    	#include <morphcolor_vertex>
    	#include <batching_vertex>
    	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
    		#include <beginnormal_vertex>
    		#include <morphnormal_vertex>
    		#include <skinbase_vertex>
    		#include <skinnormal_vertex>
    		#include <defaultnormal_vertex>
    	#endif
    	#include <begin_vertex>
    	#include <morphtarget_vertex>
    	#include <skinning_vertex>
    	#include <project_vertex>
    	#include <logdepthbuf_vertex>
    	#include <clipping_planes_vertex>
    	#include <worldpos_vertex>
    	#include <envmap_vertex>
    	#include <fog_vertex>
    }`,
    DM = `uniform vec3 diffuse;
    uniform float opacity;
    #ifndef FLAT_SHADED
    	varying vec3 vNormal;
    #endif
    #include <common>
    #include <dithering_pars_fragment>
    #include <color_pars_fragment>
    #include <uv_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <alphatest_pars_fragment>
    #include <alphahash_pars_fragment>
    #include <aomap_pars_fragment>
    #include <lightmap_pars_fragment>
    #include <envmap_common_pars_fragment>
    #include <envmap_pars_fragment>
    #include <fog_pars_fragment>
    #include <specularmap_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>
    void main() {
    	vec4 diffuseColor = vec4( diffuse, opacity );
    	#include <clipping_planes_fragment>
    	#include <logdepthbuf_fragment>
    	#include <map_fragment>
    	#include <color_fragment>
    	#include <alphamap_fragment>
    	#include <alphatest_fragment>
    	#include <alphahash_fragment>
    	#include <specularmap_fragment>
    	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    	#ifdef USE_LIGHTMAP
    		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
    		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
    	#else
    		reflectedLight.indirectDiffuse += vec3( 1.0 );
    	#endif
    	#include <aomap_fragment>
    	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
    	vec3 outgoingLight = reflectedLight.indirectDiffuse;
    	#include <envmap_fragment>
    	#include <opaque_fragment>
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    	#include <fog_fragment>
    	#include <premultiplied_alpha_fragment>
    	#include <dithering_fragment>
    }`,
    RM = `#define LAMBERT
    varying vec3 vViewPosition;
    #include <common>
    #include <batching_pars_vertex>
    #include <uv_pars_vertex>
    #include <displacementmap_pars_vertex>
    #include <envmap_pars_vertex>
    #include <color_pars_vertex>
    #include <fog_pars_vertex>
    #include <normal_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <shadowmap_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>
    void main() {
    	#include <uv_vertex>
    	#include <color_vertex>
    	#include <morphinstance_vertex>
    	#include <morphcolor_vertex>
    	#include <batching_vertex>
    	#include <beginnormal_vertex>
    	#include <morphnormal_vertex>
    	#include <skinbase_vertex>
    	#include <skinnormal_vertex>
    	#include <defaultnormal_vertex>
    	#include <normal_vertex>
    	#include <begin_vertex>
    	#include <morphtarget_vertex>
    	#include <skinning_vertex>
    	#include <displacementmap_vertex>
    	#include <project_vertex>
    	#include <logdepthbuf_vertex>
    	#include <clipping_planes_vertex>
    	vViewPosition = - mvPosition.xyz;
    	#include <worldpos_vertex>
    	#include <envmap_vertex>
    	#include <shadowmap_vertex>
    	#include <fog_vertex>
    }`,
    UM = `#define LAMBERT
    uniform vec3 diffuse;
    uniform vec3 emissive;
    uniform float opacity;
    #include <common>
    #include <packing>
    #include <dithering_pars_fragment>
    #include <color_pars_fragment>
    #include <uv_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <alphatest_pars_fragment>
    #include <alphahash_pars_fragment>
    #include <aomap_pars_fragment>
    #include <lightmap_pars_fragment>
    #include <emissivemap_pars_fragment>
    #include <envmap_common_pars_fragment>
    #include <envmap_pars_fragment>
    #include <fog_pars_fragment>
    #include <bsdfs>
    #include <lights_pars_begin>
    #include <normal_pars_fragment>
    #include <lights_lambert_pars_fragment>
    #include <shadowmap_pars_fragment>
    #include <bumpmap_pars_fragment>
    #include <normalmap_pars_fragment>
    #include <specularmap_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>
    void main() {
    	vec4 diffuseColor = vec4( diffuse, opacity );
    	#include <clipping_planes_fragment>
    	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    	vec3 totalEmissiveRadiance = emissive;
    	#include <logdepthbuf_fragment>
    	#include <map_fragment>
    	#include <color_fragment>
    	#include <alphamap_fragment>
    	#include <alphatest_fragment>
    	#include <alphahash_fragment>
    	#include <specularmap_fragment>
    	#include <normal_fragment_begin>
    	#include <normal_fragment_maps>
    	#include <emissivemap_fragment>
    	#include <lights_lambert_fragment>
    	#include <lights_fragment_begin>
    	#include <lights_fragment_maps>
    	#include <lights_fragment_end>
    	#include <aomap_fragment>
    	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
    	#include <envmap_fragment>
    	#include <opaque_fragment>
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    	#include <fog_fragment>
    	#include <premultiplied_alpha_fragment>
    	#include <dithering_fragment>
    }`,
    LM = `#define MATCAP
    varying vec3 vViewPosition;
    #include <common>
    #include <batching_pars_vertex>
    #include <uv_pars_vertex>
    #include <color_pars_vertex>
    #include <displacementmap_pars_vertex>
    #include <fog_pars_vertex>
    #include <normal_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>
    void main() {
    	#include <uv_vertex>
    	#include <color_vertex>
    	#include <morphinstance_vertex>
    	#include <morphcolor_vertex>
    	#include <batching_vertex>
    	#include <beginnormal_vertex>
    	#include <morphnormal_vertex>
    	#include <skinbase_vertex>
    	#include <skinnormal_vertex>
    	#include <defaultnormal_vertex>
    	#include <normal_vertex>
    	#include <begin_vertex>
    	#include <morphtarget_vertex>
    	#include <skinning_vertex>
    	#include <displacementmap_vertex>
    	#include <project_vertex>
    	#include <logdepthbuf_vertex>
    	#include <clipping_planes_vertex>
    	#include <fog_vertex>
    	vViewPosition = - mvPosition.xyz;
    }`,
    FM = `#define MATCAP
    uniform vec3 diffuse;
    uniform float opacity;
    uniform sampler2D matcap;
    varying vec3 vViewPosition;
    #include <common>
    #include <dithering_pars_fragment>
    #include <color_pars_fragment>
    #include <uv_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <alphatest_pars_fragment>
    #include <alphahash_pars_fragment>
    #include <fog_pars_fragment>
    #include <normal_pars_fragment>
    #include <bumpmap_pars_fragment>
    #include <normalmap_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>
    void main() {
    	vec4 diffuseColor = vec4( diffuse, opacity );
    	#include <clipping_planes_fragment>
    	#include <logdepthbuf_fragment>
    	#include <map_fragment>
    	#include <color_fragment>
    	#include <alphamap_fragment>
    	#include <alphatest_fragment>
    	#include <alphahash_fragment>
    	#include <normal_fragment_begin>
    	#include <normal_fragment_maps>
    	vec3 viewDir = normalize( vViewPosition );
    	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
    	vec3 y = cross( viewDir, x );
    	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
    	#ifdef USE_MATCAP
    		vec4 matcapColor = texture2D( matcap, uv );
    	#else
    		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
    	#endif
    	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
    	#include <opaque_fragment>
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    	#include <fog_fragment>
    	#include <premultiplied_alpha_fragment>
    	#include <dithering_fragment>
    }`,
    NM = `#define NORMAL
    #if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
    	varying vec3 vViewPosition;
    #endif
    #include <common>
    #include <batching_pars_vertex>
    #include <uv_pars_vertex>
    #include <displacementmap_pars_vertex>
    #include <normal_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>
    void main() {
    	#include <uv_vertex>
    	#include <batching_vertex>
    	#include <beginnormal_vertex>
    	#include <morphinstance_vertex>
    	#include <morphnormal_vertex>
    	#include <skinbase_vertex>
    	#include <skinnormal_vertex>
    	#include <defaultnormal_vertex>
    	#include <normal_vertex>
    	#include <begin_vertex>
    	#include <morphtarget_vertex>
    	#include <skinning_vertex>
    	#include <displacementmap_vertex>
    	#include <project_vertex>
    	#include <logdepthbuf_vertex>
    	#include <clipping_planes_vertex>
    #if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
    	vViewPosition = - mvPosition.xyz;
    #endif
    }`,
    OM = `#define NORMAL
    uniform float opacity;
    #if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
    	varying vec3 vViewPosition;
    #endif
    #include <packing>
    #include <uv_pars_fragment>
    #include <normal_pars_fragment>
    #include <bumpmap_pars_fragment>
    #include <normalmap_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>
    void main() {
    	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
    	#include <clipping_planes_fragment>
    	#include <logdepthbuf_fragment>
    	#include <normal_fragment_begin>
    	#include <normal_fragment_maps>
    	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
    	#ifdef OPAQUE
    		gl_FragColor.a = 1.0;
    	#endif
    }`,
    kM = `#define PHONG
    varying vec3 vViewPosition;
    #include <common>
    #include <batching_pars_vertex>
    #include <uv_pars_vertex>
    #include <displacementmap_pars_vertex>
    #include <envmap_pars_vertex>
    #include <color_pars_vertex>
    #include <fog_pars_vertex>
    #include <normal_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <shadowmap_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>
    void main() {
    	#include <uv_vertex>
    	#include <color_vertex>
    	#include <morphcolor_vertex>
    	#include <batching_vertex>
    	#include <beginnormal_vertex>
    	#include <morphinstance_vertex>
    	#include <morphnormal_vertex>
    	#include <skinbase_vertex>
    	#include <skinnormal_vertex>
    	#include <defaultnormal_vertex>
    	#include <normal_vertex>
    	#include <begin_vertex>
    	#include <morphtarget_vertex>
    	#include <skinning_vertex>
    	#include <displacementmap_vertex>
    	#include <project_vertex>
    	#include <logdepthbuf_vertex>
    	#include <clipping_planes_vertex>
    	vViewPosition = - mvPosition.xyz;
    	#include <worldpos_vertex>
    	#include <envmap_vertex>
    	#include <shadowmap_vertex>
    	#include <fog_vertex>
    }`,
    zM = `#define PHONG
    uniform vec3 diffuse;
    uniform vec3 emissive;
    uniform vec3 specular;
    uniform float shininess;
    uniform float opacity;
    #include <common>
    #include <packing>
    #include <dithering_pars_fragment>
    #include <color_pars_fragment>
    #include <uv_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <alphatest_pars_fragment>
    #include <alphahash_pars_fragment>
    #include <aomap_pars_fragment>
    #include <lightmap_pars_fragment>
    #include <emissivemap_pars_fragment>
    #include <envmap_common_pars_fragment>
    #include <envmap_pars_fragment>
    #include <fog_pars_fragment>
    #include <bsdfs>
    #include <lights_pars_begin>
    #include <normal_pars_fragment>
    #include <lights_phong_pars_fragment>
    #include <shadowmap_pars_fragment>
    #include <bumpmap_pars_fragment>
    #include <normalmap_pars_fragment>
    #include <specularmap_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>
    void main() {
    	vec4 diffuseColor = vec4( diffuse, opacity );
    	#include <clipping_planes_fragment>
    	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    	vec3 totalEmissiveRadiance = emissive;
    	#include <logdepthbuf_fragment>
    	#include <map_fragment>
    	#include <color_fragment>
    	#include <alphamap_fragment>
    	#include <alphatest_fragment>
    	#include <alphahash_fragment>
    	#include <specularmap_fragment>
    	#include <normal_fragment_begin>
    	#include <normal_fragment_maps>
    	#include <emissivemap_fragment>
    	#include <lights_phong_fragment>
    	#include <lights_fragment_begin>
    	#include <lights_fragment_maps>
    	#include <lights_fragment_end>
    	#include <aomap_fragment>
    	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
    	#include <envmap_fragment>
    	#include <opaque_fragment>
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    	#include <fog_fragment>
    	#include <premultiplied_alpha_fragment>
    	#include <dithering_fragment>
    }`,
    QM = `#define STANDARD
    varying vec3 vViewPosition;
    #ifdef USE_TRANSMISSION
    	varying vec3 vWorldPosition;
    #endif
    #include <common>
    #include <batching_pars_vertex>
    #include <uv_pars_vertex>
    #include <displacementmap_pars_vertex>
    #include <color_pars_vertex>
    #include <fog_pars_vertex>
    #include <normal_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <shadowmap_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>
    void main() {
    	#include <uv_vertex>
    	#include <color_vertex>
    	#include <morphinstance_vertex>
    	#include <morphcolor_vertex>
    	#include <batching_vertex>
    	#include <beginnormal_vertex>
    	#include <morphnormal_vertex>
    	#include <skinbase_vertex>
    	#include <skinnormal_vertex>
    	#include <defaultnormal_vertex>
    	#include <normal_vertex>
    	#include <begin_vertex>
    	#include <morphtarget_vertex>
    	#include <skinning_vertex>
    	#include <displacementmap_vertex>
    	#include <project_vertex>
    	#include <logdepthbuf_vertex>
    	#include <clipping_planes_vertex>
    	vViewPosition = - mvPosition.xyz;
    	#include <worldpos_vertex>
    	#include <shadowmap_vertex>
    	#include <fog_vertex>
    #ifdef USE_TRANSMISSION
    	vWorldPosition = worldPosition.xyz;
    #endif
    }`,
    GM = `#define STANDARD
    #ifdef PHYSICAL
    	#define IOR
    	#define USE_SPECULAR
    #endif
    uniform vec3 diffuse;
    uniform vec3 emissive;
    uniform float roughness;
    uniform float metalness;
    uniform float opacity;
    #ifdef IOR
    	uniform float ior;
    #endif
    #ifdef USE_SPECULAR
    	uniform float specularIntensity;
    	uniform vec3 specularColor;
    	#ifdef USE_SPECULAR_COLORMAP
    		uniform sampler2D specularColorMap;
    	#endif
    	#ifdef USE_SPECULAR_INTENSITYMAP
    		uniform sampler2D specularIntensityMap;
    	#endif
    #endif
    #ifdef USE_CLEARCOAT
    	uniform float clearcoat;
    	uniform float clearcoatRoughness;
    #endif
    #ifdef USE_DISPERSION
    	uniform float dispersion;
    #endif
    #ifdef USE_IRIDESCENCE
    	uniform float iridescence;
    	uniform float iridescenceIOR;
    	uniform float iridescenceThicknessMinimum;
    	uniform float iridescenceThicknessMaximum;
    #endif
    #ifdef USE_SHEEN
    	uniform vec3 sheenColor;
    	uniform float sheenRoughness;
    	#ifdef USE_SHEEN_COLORMAP
    		uniform sampler2D sheenColorMap;
    	#endif
    	#ifdef USE_SHEEN_ROUGHNESSMAP
    		uniform sampler2D sheenRoughnessMap;
    	#endif
    #endif
    #ifdef USE_ANISOTROPY
    	uniform vec2 anisotropyVector;
    	#ifdef USE_ANISOTROPYMAP
    		uniform sampler2D anisotropyMap;
    	#endif
    #endif
    varying vec3 vViewPosition;
    #include <common>
    #include <packing>
    #include <dithering_pars_fragment>
    #include <color_pars_fragment>
    #include <uv_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <alphatest_pars_fragment>
    #include <alphahash_pars_fragment>
    #include <aomap_pars_fragment>
    #include <lightmap_pars_fragment>
    #include <emissivemap_pars_fragment>
    #include <iridescence_fragment>
    #include <cube_uv_reflection_fragment>
    #include <envmap_common_pars_fragment>
    #include <envmap_physical_pars_fragment>
    #include <fog_pars_fragment>
    #include <lights_pars_begin>
    #include <normal_pars_fragment>
    #include <lights_physical_pars_fragment>
    #include <transmission_pars_fragment>
    #include <shadowmap_pars_fragment>
    #include <bumpmap_pars_fragment>
    #include <normalmap_pars_fragment>
    #include <clearcoat_pars_fragment>
    #include <iridescence_pars_fragment>
    #include <roughnessmap_pars_fragment>
    #include <metalnessmap_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>
    void main() {
    	vec4 diffuseColor = vec4( diffuse, opacity );
    	#include <clipping_planes_fragment>
    	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    	vec3 totalEmissiveRadiance = emissive;
    	#include <logdepthbuf_fragment>
    	#include <map_fragment>
    	#include <color_fragment>
    	#include <alphamap_fragment>
    	#include <alphatest_fragment>
    	#include <alphahash_fragment>
    	#include <roughnessmap_fragment>
    	#include <metalnessmap_fragment>
    	#include <normal_fragment_begin>
    	#include <normal_fragment_maps>
    	#include <clearcoat_normal_fragment_begin>
    	#include <clearcoat_normal_fragment_maps>
    	#include <emissivemap_fragment>
    	#include <lights_physical_fragment>
    	#include <lights_fragment_begin>
    	#include <lights_fragment_maps>
    	#include <lights_fragment_end>
    	#include <aomap_fragment>
    	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
    	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
    	#include <transmission_fragment>
    	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
    	#ifdef USE_SHEEN
    		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
    		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
    	#endif
    	#ifdef USE_CLEARCOAT
    		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
    		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
    		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
    	#endif
    	#include <opaque_fragment>
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    	#include <fog_fragment>
    	#include <premultiplied_alpha_fragment>
    	#include <dithering_fragment>
    }`,
    HM = `#define TOON
    varying vec3 vViewPosition;
    #include <common>
    #include <batching_pars_vertex>
    #include <uv_pars_vertex>
    #include <displacementmap_pars_vertex>
    #include <color_pars_vertex>
    #include <fog_pars_vertex>
    #include <normal_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <shadowmap_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>
    void main() {
    	#include <uv_vertex>
    	#include <color_vertex>
    	#include <morphinstance_vertex>
    	#include <morphcolor_vertex>
    	#include <batching_vertex>
    	#include <beginnormal_vertex>
    	#include <morphnormal_vertex>
    	#include <skinbase_vertex>
    	#include <skinnormal_vertex>
    	#include <defaultnormal_vertex>
    	#include <normal_vertex>
    	#include <begin_vertex>
    	#include <morphtarget_vertex>
    	#include <skinning_vertex>
    	#include <displacementmap_vertex>
    	#include <project_vertex>
    	#include <logdepthbuf_vertex>
    	#include <clipping_planes_vertex>
    	vViewPosition = - mvPosition.xyz;
    	#include <worldpos_vertex>
    	#include <shadowmap_vertex>
    	#include <fog_vertex>
    }`,
    VM = `#define TOON
    uniform vec3 diffuse;
    uniform vec3 emissive;
    uniform float opacity;
    #include <common>
    #include <packing>
    #include <dithering_pars_fragment>
    #include <color_pars_fragment>
    #include <uv_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <alphatest_pars_fragment>
    #include <alphahash_pars_fragment>
    #include <aomap_pars_fragment>
    #include <lightmap_pars_fragment>
    #include <emissivemap_pars_fragment>
    #include <gradientmap_pars_fragment>
    #include <fog_pars_fragment>
    #include <bsdfs>
    #include <lights_pars_begin>
    #include <normal_pars_fragment>
    #include <lights_toon_pars_fragment>
    #include <shadowmap_pars_fragment>
    #include <bumpmap_pars_fragment>
    #include <normalmap_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>
    void main() {
    	vec4 diffuseColor = vec4( diffuse, opacity );
    	#include <clipping_planes_fragment>
    	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    	vec3 totalEmissiveRadiance = emissive;
    	#include <logdepthbuf_fragment>
    	#include <map_fragment>
    	#include <color_fragment>
    	#include <alphamap_fragment>
    	#include <alphatest_fragment>
    	#include <alphahash_fragment>
    	#include <normal_fragment_begin>
    	#include <normal_fragment_maps>
    	#include <emissivemap_fragment>
    	#include <lights_toon_fragment>
    	#include <lights_fragment_begin>
    	#include <lights_fragment_maps>
    	#include <lights_fragment_end>
    	#include <aomap_fragment>
    	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
    	#include <opaque_fragment>
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    	#include <fog_fragment>
    	#include <premultiplied_alpha_fragment>
    	#include <dithering_fragment>
    }`,
    WM = `uniform float size;
    uniform float scale;
    #include <common>
    #include <color_pars_vertex>
    #include <fog_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>
    #ifdef USE_POINTS_UV
    	varying vec2 vUv;
    	uniform mat3 uvTransform;
    #endif
    void main() {
    	#ifdef USE_POINTS_UV
    		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
    	#endif
    	#include <color_vertex>
    	#include <morphinstance_vertex>
    	#include <morphcolor_vertex>
    	#include <begin_vertex>
    	#include <morphtarget_vertex>
    	#include <project_vertex>
    	gl_PointSize = size;
    	#ifdef USE_SIZEATTENUATION
    		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
    		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
    	#endif
    	#include <logdepthbuf_vertex>
    	#include <clipping_planes_vertex>
    	#include <worldpos_vertex>
    	#include <fog_vertex>
    }`,
    YM = `uniform vec3 diffuse;
    uniform float opacity;
    #include <common>
    #include <color_pars_fragment>
    #include <map_particle_pars_fragment>
    #include <alphatest_pars_fragment>
    #include <alphahash_pars_fragment>
    #include <fog_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>
    void main() {
    	vec4 diffuseColor = vec4( diffuse, opacity );
    	#include <clipping_planes_fragment>
    	vec3 outgoingLight = vec3( 0.0 );
    	#include <logdepthbuf_fragment>
    	#include <map_particle_fragment>
    	#include <color_fragment>
    	#include <alphatest_fragment>
    	#include <alphahash_fragment>
    	outgoingLight = diffuseColor.rgb;
    	#include <opaque_fragment>
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    	#include <fog_fragment>
    	#include <premultiplied_alpha_fragment>
    }`,
    qM = `#include <common>
    #include <batching_pars_vertex>
    #include <fog_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <shadowmap_pars_vertex>
    void main() {
    	#include <batching_vertex>
    	#include <beginnormal_vertex>
    	#include <morphinstance_vertex>
    	#include <morphnormal_vertex>
    	#include <skinbase_vertex>
    	#include <skinnormal_vertex>
    	#include <defaultnormal_vertex>
    	#include <begin_vertex>
    	#include <morphtarget_vertex>
    	#include <skinning_vertex>
    	#include <project_vertex>
    	#include <logdepthbuf_vertex>
    	#include <worldpos_vertex>
    	#include <shadowmap_vertex>
    	#include <fog_vertex>
    }`,
    XM = `uniform vec3 color;
    uniform float opacity;
    #include <common>
    #include <packing>
    #include <fog_pars_fragment>
    #include <bsdfs>
    #include <lights_pars_begin>
    #include <logdepthbuf_pars_fragment>
    #include <shadowmap_pars_fragment>
    #include <shadowmask_pars_fragment>
    void main() {
    	#include <logdepthbuf_fragment>
    	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    	#include <fog_fragment>
    }`,
    KM = `uniform float rotation;
    uniform vec2 center;
    #include <common>
    #include <uv_pars_vertex>
    #include <fog_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>
    void main() {
    	#include <uv_vertex>
    	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
    	vec2 scale;
    	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
    	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
    	#ifndef USE_SIZEATTENUATION
    		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
    		if ( isPerspective ) scale *= - mvPosition.z;
    	#endif
    	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
    	vec2 rotatedPosition;
    	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
    	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
    	mvPosition.xy += rotatedPosition;
    	gl_Position = projectionMatrix * mvPosition;
    	#include <logdepthbuf_vertex>
    	#include <clipping_planes_vertex>
    	#include <fog_vertex>
    }`,
    JM = `uniform vec3 diffuse;
    uniform float opacity;
    #include <common>
    #include <uv_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <alphatest_pars_fragment>
    #include <alphahash_pars_fragment>
    #include <fog_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>
    void main() {
    	vec4 diffuseColor = vec4( diffuse, opacity );
    	#include <clipping_planes_fragment>
    	vec3 outgoingLight = vec3( 0.0 );
    	#include <logdepthbuf_fragment>
    	#include <map_fragment>
    	#include <alphamap_fragment>
    	#include <alphatest_fragment>
    	#include <alphahash_fragment>
    	outgoingLight = diffuseColor.rgb;
    	#include <opaque_fragment>
    	#include <tonemapping_fragment>
    	#include <colorspace_fragment>
    	#include <fog_fragment>
    }`,
    rt = {
        alphahash_fragment: v1,
        alphahash_pars_fragment: x1,
        alphamap_fragment: y1,
        alphamap_pars_fragment: _1,
        alphatest_fragment: w1,
        alphatest_pars_fragment: E1,
        aomap_fragment: C1,
        aomap_pars_fragment: S1,
        batching_pars_vertex: M1,
        batching_vertex: b1,
        begin_vertex: T1,
        beginnormal_vertex: I1,
        bsdfs: B1,
        iridescence_fragment: P1,
        bumpmap_pars_fragment: D1,
        clipping_planes_fragment: R1,
        clipping_planes_pars_fragment: U1,
        clipping_planes_pars_vertex: L1,
        clipping_planes_vertex: F1,
        color_fragment: N1,
        color_pars_fragment: O1,
        color_pars_vertex: k1,
        color_vertex: z1,
        common: Q1,
        cube_uv_reflection_fragment: G1,
        defaultnormal_vertex: H1,
        displacementmap_pars_vertex: V1,
        displacementmap_vertex: W1,
        emissivemap_fragment: Y1,
        emissivemap_pars_fragment: q1,
        colorspace_fragment: X1,
        colorspace_pars_fragment: K1,
        envmap_fragment: J1,
        envmap_common_pars_fragment: j1,
        envmap_pars_fragment: Z1,
        envmap_pars_vertex: $1,
        envmap_physical_pars_fragment: hS,
        envmap_vertex: eS,
        fog_vertex: tS,
        fog_pars_vertex: iS,
        fog_fragment: sS,
        fog_pars_fragment: nS,
        gradientmap_pars_fragment: rS,
        lightmap_pars_fragment: aS,
        lights_lambert_fragment: oS,
        lights_lambert_pars_fragment: lS,
        lights_pars_begin: cS,
        lights_toon_fragment: uS,
        lights_toon_pars_fragment: dS,
        lights_phong_fragment: fS,
        lights_phong_pars_fragment: pS,
        lights_physical_fragment: mS,
        lights_physical_pars_fragment: AS,
        lights_fragment_begin: gS,
        lights_fragment_maps: vS,
        lights_fragment_end: xS,
        logdepthbuf_fragment: yS,
        logdepthbuf_pars_fragment: _S,
        logdepthbuf_pars_vertex: wS,
        logdepthbuf_vertex: ES,
        map_fragment: CS,
        map_pars_fragment: SS,
        map_particle_fragment: MS,
        map_particle_pars_fragment: bS,
        metalnessmap_fragment: TS,
        metalnessmap_pars_fragment: IS,
        morphinstance_vertex: BS,
        morphcolor_vertex: PS,
        morphnormal_vertex: DS,
        morphtarget_pars_vertex: RS,
        morphtarget_vertex: US,
        normal_fragment_begin: LS,
        normal_fragment_maps: FS,
        normal_pars_fragment: NS,
        normal_pars_vertex: OS,
        normal_vertex: kS,
        normalmap_pars_fragment: zS,
        clearcoat_normal_fragment_begin: QS,
        clearcoat_normal_fragment_maps: GS,
        clearcoat_pars_fragment: HS,
        iridescence_pars_fragment: VS,
        opaque_fragment: WS,
        packing: YS,
        premultiplied_alpha_fragment: qS,
        project_vertex: XS,
        dithering_fragment: KS,
        dithering_pars_fragment: JS,
        roughnessmap_fragment: jS,
        roughnessmap_pars_fragment: ZS,
        shadowmap_pars_fragment: $S,
        shadowmap_pars_vertex: eM,
        shadowmap_vertex: tM,
        shadowmask_pars_fragment: iM,
        skinbase_vertex: sM,
        skinning_pars_vertex: nM,
        skinning_vertex: rM,
        skinnormal_vertex: aM,
        specularmap_fragment: oM,
        specularmap_pars_fragment: lM,
        tonemapping_fragment: cM,
        tonemapping_pars_fragment: hM,
        transmission_fragment: uM,
        transmission_pars_fragment: dM,
        uv_pars_fragment: fM,
        uv_pars_vertex: pM,
        uv_vertex: mM,
        worldpos_vertex: AM,
        background_vert: gM,
        background_frag: vM,
        backgroundCube_vert: xM,
        backgroundCube_frag: yM,
        cube_vert: _M,
        cube_frag: wM,
        depth_vert: EM,
        depth_frag: CM,
        distanceRGBA_vert: SM,
        distanceRGBA_frag: MM,
        equirect_vert: bM,
        equirect_frag: TM,
        linedashed_vert: IM,
        linedashed_frag: BM,
        meshbasic_vert: PM,
        meshbasic_frag: DM,
        meshlambert_vert: RM,
        meshlambert_frag: UM,
        meshmatcap_vert: LM,
        meshmatcap_frag: FM,
        meshnormal_vert: NM,
        meshnormal_frag: OM,
        meshphong_vert: kM,
        meshphong_frag: zM,
        meshphysical_vert: QM,
        meshphysical_frag: GM,
        meshtoon_vert: HM,
        meshtoon_frag: VM,
        points_vert: WM,
        points_frag: YM,
        shadow_vert: qM,
        shadow_frag: XM,
        sprite_vert: KM,
        sprite_frag: JM
    },
    Se = {
        common: {
            diffuse: {
                value: new Z(16777215)
            },
            opacity: {
                value: 1
            },
            map: {
                value: null
            },
            mapTransform: {
                value: new at
            },
            alphaMap: {
                value: null
            },
            alphaMapTransform: {
                value: new at
            },
            alphaTest: {
                value: 0
            }
        },
        specularmap: {
            specularMap: {
                value: null
            },
            specularMapTransform: {
                value: new at
            }
        },
        envmap: {
            envMap: {
                value: null
            },
            envMapRotation: {
                value: new at
            },
            flipEnvMap: {
                value: -1
            },
            reflectivity: {
                value: 1
            },
            ior: {
                value: 1.5
            },
            refractionRatio: {
                value: .98
            }
        },
        aomap: {
            aoMap: {
                value: null
            },
            aoMapIntensity: {
                value: 1
            },
            aoMapTransform: {
                value: new at
            }
        },
        lightmap: {
            lightMap: {
                value: null
            },
            lightMapIntensity: {
                value: 1
            },
            lightMapTransform: {
                value: new at
            }
        },
        bumpmap: {
            bumpMap: {
                value: null
            },
            bumpMapTransform: {
                value: new at
            },
            bumpScale: {
                value: 1
            }
        },
        normalmap: {
            normalMap: {
                value: null
            },
            normalMapTransform: {
                value: new at
            },
            normalScale: {
                value: new H(1, 1)
            }
        },
        displacementmap: {
            displacementMap: {
                value: null
            },
            displacementMapTransform: {
                value: new at
            },
            displacementScale: {
                value: 1
            },
            displacementBias: {
                value: 0
            }
        },
        emissivemap: {
            emissiveMap: {
                value: null
            },
            emissiveMapTransform: {
                value: new at
            }
        },
        metalnessmap: {
            metalnessMap: {
                value: null
            },
            metalnessMapTransform: {
                value: new at
            }
        },
        roughnessmap: {
            roughnessMap: {
                value: null
            },
            roughnessMapTransform: {
                value: new at
            }
        },
        gradientmap: {
            gradientMap: {
                value: null
            }
        },
        fog: {
            fogDensity: {
                value: 25e-5
            },
            fogNear: {
                value: 1
            },
            fogFar: {
                value: 2e3
            },
            fogColor: {
                value: new Z(16777215)
            }
        },
        lights: {
            ambientLightColor: {
                value: []
            },
            lightProbe: {
                value: []
            },
            directionalLights: {
                value: [],
                properties: {
                    direction: {},
                    color: {}
                }
            },
            directionalLightShadows: {
                value: [],
                properties: {
                    shadowBias: {},
                    shadowNormalBias: {},
                    shadowRadius: {},
                    shadowMapSize: {}
                }
            },
            directionalShadowMap: {
                value: []
            },
            directionalShadowMatrix: {
                value: []
            },
            spotLights: {
                value: [],
                properties: {
                    color: {},
                    position: {},
                    direction: {},
                    distance: {},
                    coneCos: {},
                    penumbraCos: {},
                    decay: {}
                }
            },
            spotLightShadows: {
                value: [],
                properties: {
                    shadowBias: {},
                    shadowNormalBias: {},
                    shadowRadius: {},
                    shadowMapSize: {}
                }
            },
            spotLightMap: {
                value: []
            },
            spotShadowMap: {
                value: []
            },
            spotLightMatrix: {
                value: []
            },
            pointLights: {
                value: [],
                properties: {
                    color: {},
                    position: {},
                    decay: {},
                    distance: {}
                }
            },
            pointLightShadows: {
                value: [],
                properties: {
                    shadowBias: {},
                    shadowNormalBias: {},
                    shadowRadius: {},
                    shadowMapSize: {},
                    shadowCameraNear: {},
                    shadowCameraFar: {}
                }
            },
            pointShadowMap: {
                value: []
            },
            pointShadowMatrix: {
                value: []
            },
            hemisphereLights: {
                value: [],
                properties: {
                    direction: {},
                    skyColor: {},
                    groundColor: {}
                }
            },
            rectAreaLights: {
                value: [],
                properties: {
                    color: {},
                    position: {},
                    width: {},
                    height: {}
                }
            },
            ltc_1: {
                value: null
            },
            ltc_2: {
                value: null
            }
        },
        points: {
            diffuse: {
                value: new Z(16777215)
            },
            opacity: {
                value: 1
            },
            size: {
                value: 1
            },
            scale: {
                value: 1
            },
            map: {
                value: null
            },
            alphaMap: {
                value: null
            },
            alphaMapTransform: {
                value: new at
            },
            alphaTest: {
                value: 0
            },
            uvTransform: {
                value: new at
            }
        },
        sprite: {
            diffuse: {
                value: new Z(16777215)
            },
            opacity: {
                value: 1
            },
            center: {
                value: new H(.5, .5)
            },
            rotation: {
                value: 0
            },
            map: {
                value: null
            },
            mapTransform: {
                value: new at
            },
            alphaMap: {
                value: null
            },
            alphaMapTransform: {
                value: new at
            },
            alphaTest: {
                value: 0
            }
        }
    },
    $s = {
        basic: {
            uniforms: zi([Se.common, Se.specularmap, Se.envmap, Se.aomap, Se.lightmap, Se.fog]),
            vertexShader: rt.meshbasic_vert,
            fragmentShader: rt.meshbasic_frag
        },
        lambert: {
            uniforms: zi([Se.common, Se.specularmap, Se.envmap, Se.aomap, Se.lightmap, Se.emissivemap, Se.bumpmap, Se.normalmap, Se.displacementmap, Se.fog, Se.lights, {
                emissive: {
                    value: new Z(0)
                }
            }]),
            vertexShader: rt.meshlambert_vert,
            fragmentShader: rt.meshlambert_frag
        },
        phong: {
            uniforms: zi([Se.common, Se.specularmap, Se.envmap, Se.aomap, Se.lightmap, Se.emissivemap, Se.bumpmap, Se.normalmap, Se.displacementmap, Se.fog, Se.lights, {
                emissive: {
                    value: new Z(0)
                },
                specular: {
                    value: new Z(1118481)
                },
                shininess: {
                    value: 30
                }
            }]),
            vertexShader: rt.meshphong_vert,
            fragmentShader: rt.meshphong_frag
        },
        standard: {
            uniforms: zi([Se.common, Se.envmap, Se.aomap, Se.lightmap, Se.emissivemap, Se.bumpmap, Se.normalmap, Se.displacementmap, Se.roughnessmap, Se.metalnessmap, Se.fog, Se.lights, {
                emissive: {
                    value: new Z(0)
                },
                roughness: {
                    value: 1
                },
                metalness: {
                    value: 0
                },
                envMapIntensity: {
                    value: 1
                }
            }]),
            vertexShader: rt.meshphysical_vert,
            fragmentShader: rt.meshphysical_frag
        },
        toon: {
            uniforms: zi([Se.common, Se.aomap, Se.lightmap, Se.emissivemap, Se.bumpmap, Se.normalmap, Se.displacementmap, Se.gradientmap, Se.fog, Se.lights, {
                emissive: {
                    value: new Z(0)
                }
            }]),
            vertexShader: rt.meshtoon_vert,
            fragmentShader: rt.meshtoon_frag
        },
        matcap: {
            uniforms: zi([Se.common, Se.bumpmap, Se.normalmap, Se.displacementmap, Se.fog, {
                matcap: {
                    value: null
                }
            }]),
            vertexShader: rt.meshmatcap_vert,
            fragmentShader: rt.meshmatcap_frag
        },
        points: {
            uniforms: zi([Se.points, Se.fog]),
            vertexShader: rt.points_vert,
            fragmentShader: rt.points_frag
        },
        dashed: {
            uniforms: zi([Se.common, Se.fog, {
                scale: {
                    value: 1
                },
                dashSize: {
                    value: 1
                },
                totalSize: {
                    value: 2
                }
            }]),
            vertexShader: rt.linedashed_vert,
            fragmentShader: rt.linedashed_frag
        },
        depth: {
            uniforms: zi([Se.common, Se.displacementmap]),
            vertexShader: rt.depth_vert,
            fragmentShader: rt.depth_frag
        },
        normal: {
            uniforms: zi([Se.common, Se.bumpmap, Se.normalmap, Se.displacementmap, {
                opacity: {
                    value: 1
                }
            }]),
            vertexShader: rt.meshnormal_vert,
            fragmentShader: rt.meshnormal_frag
        },
        sprite: {
            uniforms: zi([Se.sprite, Se.fog]),
            vertexShader: rt.sprite_vert,
            fragmentShader: rt.sprite_frag
        },
        background: {
            uniforms: {
                uvTransform: {
                    value: new at
                },
                t2D: {
                    value: null
                },
                backgroundIntensity: {
                    value: 1
                }
            },
            vertexShader: rt.background_vert,
            fragmentShader: rt.background_frag
        },
        backgroundCube: {
            uniforms: {
                envMap: {
                    value: null
                },
                flipEnvMap: {
                    value: -1
                },
                backgroundBlurriness: {
                    value: 0
                },
                backgroundIntensity: {
                    value: 1
                },
                backgroundRotation: {
                    value: new at
                }
            },
            vertexShader: rt.backgroundCube_vert,
            fragmentShader: rt.backgroundCube_frag
        },
        cube: {
            uniforms: {
                tCube: {
                    value: null
                },
                tFlip: {
                    value: -1
                },
                opacity: {
                    value: 1
                }
            },
            vertexShader: rt.cube_vert,
            fragmentShader: rt.cube_frag
        },
        equirect: {
            uniforms: {
                tEquirect: {
                    value: null
                }
            },
            vertexShader: rt.equirect_vert,
            fragmentShader: rt.equirect_frag
        },
        distanceRGBA: {
            uniforms: zi([Se.common, Se.displacementmap, {
                referencePosition: {
                    value: new b
                },
                nearDistance: {
                    value: 1
                },
                farDistance: {
                    value: 1e3
                }
            }]),
            vertexShader: rt.distanceRGBA_vert,
            fragmentShader: rt.distanceRGBA_frag
        },
        shadow: {
            uniforms: zi([Se.lights, Se.fog, {
                color: {
                    value: new Z(0)
                },
                opacity: {
                    value: 1
                }
            }]),
            vertexShader: rt.shadow_vert,
            fragmentShader: rt.shadow_frag
        }
    };
$s.physical = {
    uniforms: zi([$s.standard.uniforms, {
        clearcoat: {
            value: 0
        },
        clearcoatMap: {
            value: null
        },
        clearcoatMapTransform: {
            value: new at
        },
        clearcoatNormalMap: {
            value: null
        },
        clearcoatNormalMapTransform: {
            value: new at
        },
        clearcoatNormalScale: {
            value: new H(1, 1)
        },
        clearcoatRoughness: {
            value: 0
        },
        clearcoatRoughnessMap: {
            value: null
        },
        clearcoatRoughnessMapTransform: {
            value: new at
        },
        dispersion: {
            value: 0
        },
        iridescence: {
            value: 0
        },
        iridescenceMap: {
            value: null
        },
        iridescenceMapTransform: {
            value: new at
        },
        iridescenceIOR: {
            value: 1.3
        },
        iridescenceThicknessMinimum: {
            value: 100
        },
        iridescenceThicknessMaximum: {
            value: 400
        },
        iridescenceThicknessMap: {
            value: null
        },
        iridescenceThicknessMapTransform: {
            value: new at
        },
        sheen: {
            value: 0
        },
        sheenColor: {
            value: new Z(0)
        },
        sheenColorMap: {
            value: null
        },
        sheenColorMapTransform: {
            value: new at
        },
        sheenRoughness: {
            value: 1
        },
        sheenRoughnessMap: {
            value: null
        },
        sheenRoughnessMapTransform: {
            value: new at
        },
        transmission: {
            value: 0
        },
        transmissionMap: {
            value: null
        },
        transmissionMapTransform: {
            value: new at
        },
        transmissionSamplerSize: {
            value: new H
        },
        transmissionSamplerMap: {
            value: null
        },
        thickness: {
            value: 0
        },
        thicknessMap: {
            value: null
        },
        thicknessMapTransform: {
            value: new at
        },
        attenuationDistance: {
            value: 0
        },
        attenuationColor: {
            value: new Z(0)
        },
        specularColor: {
            value: new Z(1, 1, 1)
        },
        specularColorMap: {
            value: null
        },
        specularColorMapTransform: {
            value: new at
        },
        specularIntensity: {
            value: 1
        },
        specularIntensityMap: {
            value: null
        },
        specularIntensityMapTransform: {
            value: new at
        },
        anisotropyVector: {
            value: new H
        },
        anisotropyMap: {
            value: null
        },
        anisotropyMapTransform: {
            value: new at
        }
    }]),
    vertexShader: rt.meshphysical_vert,
    fragmentShader: rt.meshphysical_frag
};
const rh = {
        r: 0,
        b: 0,
        g: 0
    },
    Pr = new ln,
    jM = new De;
function ZM(i, e, t, s, n, r, a) {
    const o = new Z(0);
    let l = r === !0 ? 0 : 1,
        c,
        h,
        d = null,
        u = 0,
        f = null;
    function p(x) {
        let v = x.isScene === !0 ? x.background : null;
        return v && v.isTexture && (v = (x.backgroundBlurriness > 0 ? t : e).get(v)), v
    }
    function A(x) {
        let v = !1;
        const y = p(x);
        y === null ? g(o, l) : y && y.isColor && (g(y, 1), v = !0);
        const S = i.xr.getEnvironmentBlendMode();
        S === "additive" ? s.buffers.color.setClear(0, 0, 0, 1, a) : S === "alpha-blend" && s.buffers.color.setClear(0, 0, 0, 0, a),
        (i.autoClear || v) && (s.buffers.depth.setTest(!0), s.buffers.depth.setMask(!0), s.buffers.color.setMask(!0), i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil))
    }
    function m(x, v) {
        const y = p(v);
        y && (y.isCubeTexture || y.mapping === _d) ? (h === void 0 && (h = new Ce(new Wo(1, 1, 1), new fe({
            name: "BackgroundCubeMaterial",
            uniforms: Lo($s.backgroundCube.uniforms),
            vertexShader: $s.backgroundCube.vertexShader,
            fragmentShader: $s.backgroundCube.fragmentShader,
            side: ei,
            depthTest: !1,
            depthWrite: !1,
            fog: !1
        })), h.geometry.deleteAttribute("normal"), h.geometry.deleteAttribute("uv"), h.onBeforeRender = function(S, w, C) {
            this.matrixWorld.copyPosition(C.matrixWorld)
        }, Object.defineProperty(h.material, "envMap", {
            get: function() {
                return this.uniforms.envMap.value
            }
        }), n.update(h)), Pr.copy(v.backgroundRotation), Pr.x *= -1, Pr.y *= -1, Pr.z *= -1, y.isCubeTexture && y.isRenderTargetTexture === !1 && (Pr.y *= -1, Pr.z *= -1), h.material.uniforms.envMap.value = y, h.material.uniforms.flipEnvMap.value = y.isCubeTexture && y.isRenderTargetTexture === !1 ? -1 : 1, h.material.uniforms.backgroundBlurriness.value = v.backgroundBlurriness, h.material.uniforms.backgroundIntensity.value = v.backgroundIntensity, h.material.uniforms.backgroundRotation.value.setFromMatrix4(jM.makeRotationFromEuler(Pr)), h.material.toneMapped = mt.getTransfer(y.colorSpace) !== Ft, (d !== y || u !== y.version || f !== i.toneMapping) && (h.material.needsUpdate = !0, d = y, u = y.version, f = i.toneMapping), h.layers.enableAll(), x.unshift(h, h.geometry, h.material, 0, 0, null)) : y && y.isTexture && (c === void 0 && (c = new Ce(new kt(2, 2), new fe({
            name: "BackgroundMaterial",
            uniforms: Lo($s.background.uniforms),
            vertexShader: $s.background.vertexShader,
            fragmentShader: $s.background.fragmentShader,
            side: es,
            depthTest: !1,
            depthWrite: !1,
            fog: !1
        })), c.geometry.deleteAttribute("normal"), Object.defineProperty(c.material, "map", {
            get: function() {
                return this.uniforms.t2D.value
            }
        }), n.update(c)), c.material.uniforms.t2D.value = y, c.material.uniforms.backgroundIntensity.value = v.backgroundIntensity, c.material.toneMapped = mt.getTransfer(y.colorSpace) !== Ft, y.matrixAutoUpdate === !0 && y.updateMatrix(), c.material.uniforms.uvTransform.value.copy(y.matrix), (d !== y || u !== y.version || f !== i.toneMapping) && (c.material.needsUpdate = !0, d = y, u = y.version, f = i.toneMapping), c.layers.enableAll(), x.unshift(c, c.geometry, c.material, 0, 0, null))
    }
    function g(x, v) {
        x.getRGB(rh, Dy(i)),
        s.buffers.color.setClear(rh.r, rh.g, rh.b, v, a)
    }
    return {
        getClearColor: function() {
            return o
        },
        setClearColor: function(x, v=1) {
            o.set(x),
            l = v,
            g(o, l)
        },
        getClearAlpha: function() {
            return l
        },
        setClearAlpha: function(x) {
            l = x,
            g(o, l)
        },
        render: A,
        addToRenderList: m
    }
}
function $M(i, e) {
    const t = i.getParameter(i.MAX_VERTEX_ATTRIBS),
        s = {},
        n = u(null);
    let r = n,
        a = !1;
    function o(_, I, P, D, L) {
        let z = !1;
        const O = d(D, P, I);
        r !== O && (r = O, c(r.object)),
        z = f(_, D, P, L),
        z && p(_, D, P, L),
        L !== null && e.update(L, i.ELEMENT_ARRAY_BUFFER),
        (z || a) && (a = !1, y(_, I, P, D), L !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, e.get(L).buffer))
    }
    function l() {
        return i.createVertexArray()
    }
    function c(_) {
        return i.bindVertexArray(_)
    }
    function h(_) {
        return i.deleteVertexArray(_)
    }
    function d(_, I, P) {
        const D = P.wireframe === !0;
        let L = s[_.id];
        L === void 0 && (L = {}, s[_.id] = L);
        let z = L[I.id];
        z === void 0 && (z = {}, L[I.id] = z);
        let O = z[D];
        return O === void 0 && (O = u(l()), z[D] = O), O
    }
    function u(_) {
        const I = [],
            P = [],
            D = [];
        for (let L = 0; L < t; L++)
            I[L] = 0,
            P[L] = 0,
            D[L] = 0;
        return {
            geometry: null,
            program: null,
            wireframe: !1,
            newAttributes: I,
            enabledAttributes: P,
            attributeDivisors: D,
            object: _,
            attributes: {},
            index: null
        }
    }
    function f(_, I, P, D) {
        const L = r.attributes,
            z = I.attributes;
        let O = 0;
        const K = P.getAttributes();
        for (const V in K)
            if (K[V].location >= 0) {
                const xe = L[V];
                let Ae = z[V];
                if (Ae === void 0 && (V === "instanceMatrix" && _.instanceMatrix && (Ae = _.instanceMatrix), V === "instanceColor" && _.instanceColor && (Ae = _.instanceColor)), xe === void 0 || xe.attribute !== Ae || Ae && xe.data !== Ae.data)
                    return !0;
                O++
            }
        return r.attributesNum !== O || r.index !== D
    }
    function p(_, I, P, D) {
        const L = {},
            z = I.attributes;
        let O = 0;
        const K = P.getAttributes();
        for (const V in K)
            if (K[V].location >= 0) {
                let xe = z[V];
                xe === void 0 && (V === "instanceMatrix" && _.instanceMatrix && (xe = _.instanceMatrix), V === "instanceColor" && _.instanceColor && (xe = _.instanceColor));
                const Ae = {};
                Ae.attribute = xe,
                xe && xe.data && (Ae.data = xe.data),
                L[V] = Ae,
                O++
            }
        r.attributes = L,
        r.attributesNum = O,
        r.index = D
    }
    function A() {
        const _ = r.newAttributes;
        for (let I = 0, P = _.length; I < P; I++)
            _[I] = 0
    }
    function m(_) {
        g(_, 0)
    }
    function g(_, I) {
        const P = r.newAttributes,
            D = r.enabledAttributes,
            L = r.attributeDivisors;
        P[_] = 1,
        D[_] === 0 && (i.enableVertexAttribArray(_), D[_] = 1),
        L[_] !== I && (i.vertexAttribDivisor(_, I), L[_] = I)
    }
    function x() {
        const _ = r.newAttributes,
            I = r.enabledAttributes;
        for (let P = 0, D = I.length; P < D; P++)
            I[P] !== _[P] && (i.disableVertexAttribArray(P), I[P] = 0)
    }
    function v(_, I, P, D, L, z, O) {
        O === !0 ? i.vertexAttribIPointer(_, I, P, L, z) : i.vertexAttribPointer(_, I, P, D, L, z)
    }
    function y(_, I, P, D) {
        A();
        const L = D.attributes,
            z = P.getAttributes(),
            O = I.defaultAttributeValues;
        for (const K in z) {
            const V = z[K];
            if (V.location >= 0) {
                let pe = L[K];
                if (pe === void 0 && (K === "instanceMatrix" && _.instanceMatrix && (pe = _.instanceMatrix), K === "instanceColor" && _.instanceColor && (pe = _.instanceColor)), pe !== void 0) {
                    const xe = pe.normalized,
                        Ae = pe.itemSize,
                        Ye = e.get(pe);
                    if (Ye === void 0)
                        continue;
                    const ke = Ye.buffer,
                        J = Ye.type,
                        ue = Ye.bytesPerElement,
                        Pe = J === i.INT || J === i.UNSIGNED_INT || pe.gpuType === vy;
                    if (pe.isInterleavedBufferAttribute) {
                        const Ee = pe.data,
                            it = Ee.stride,
                            Ze = pe.offset;
                        if (Ee.isInstancedInterleavedBuffer) {
                            for (let Qe = 0; Qe < V.locationSize; Qe++)
                                g(V.location + Qe, Ee.meshPerAttribute);
                            _.isInstancedMesh !== !0 && D._maxInstanceCount === void 0 && (D._maxInstanceCount = Ee.meshPerAttribute * Ee.count)
                        } else
                            for (let Qe = 0; Qe < V.locationSize; Qe++)
                                m(V.location + Qe);
                        i.bindBuffer(i.ARRAY_BUFFER, ke);
                        for (let Qe = 0; Qe < V.locationSize; Qe++)
                            v(V.location + Qe, Ae / V.locationSize, J, xe, it * ue, (Ze + Ae / V.locationSize * Qe) * ue, Pe)
                    } else {
                        if (pe.isInstancedBufferAttribute) {
                            for (let Ee = 0; Ee < V.locationSize; Ee++)
                                g(V.location + Ee, pe.meshPerAttribute);
                            _.isInstancedMesh !== !0 && D._maxInstanceCount === void 0 && (D._maxInstanceCount = pe.meshPerAttribute * pe.count)
                        } else
                            for (let Ee = 0; Ee < V.locationSize; Ee++)
                                m(V.location + Ee);
                        i.bindBuffer(i.ARRAY_BUFFER, ke);
                        for (let Ee = 0; Ee < V.locationSize; Ee++)
                            v(V.location + Ee, Ae / V.locationSize, J, xe, Ae * ue, Ae / V.locationSize * Ee * ue, Pe)
                    }
                } else if (O !== void 0) {
                    const xe = O[K];
                    if (xe !== void 0)
                        switch (xe.length) {
                        case 2:
                            i.vertexAttrib2fv(V.location, xe);
                            break;
                        case 3:
                            i.vertexAttrib3fv(V.location, xe);
                            break;
                        case 4:
                            i.vertexAttrib4fv(V.location, xe);
                            break;
                        default:
                            i.vertexAttrib1fv(V.location, xe)
                        }
                }
            }
        }
        x()
    }
    function S() {
        M();
        for (const _ in s) {
            const I = s[_];
            for (const P in I) {
                const D = I[P];
                for (const L in D)
                    h(D[L].object),
                    delete D[L];
                delete I[P]
            }
            delete s[_]
        }
    }
    function w(_) {
        if (s[_.id] === void 0)
            return;
        const I = s[_.id];
        for (const P in I) {
            const D = I[P];
            for (const L in D)
                h(D[L].object),
                delete D[L];
            delete I[P]
        }
        delete s[_.id]
    }
    function C(_) {
        for (const I in s) {
            const P = s[I];
            if (P[_.id] === void 0)
                continue;
            const D = P[_.id];
            for (const L in D)
                h(D[L].object),
                delete D[L];
            delete P[_.id]
        }
    }
    function M() {
        E(),
        a = !0,
        r !== n && (r = n, c(r.object))
    }
    function E() {
        n.geometry = null,
        n.program = null,
        n.wireframe = !1
    }
    return {
        setup: o,
        reset: M,
        resetDefaultState: E,
        dispose: S,
        releaseStatesOfGeometry: w,
        releaseStatesOfProgram: C,
        initAttributes: A,
        enableAttribute: m,
        disableUnusedAttributes: x
    }
}
function eb(i, e, t) {
    let s;
    function n(c) {
        s = c
    }
    function r(c, h) {
        i.drawArrays(s, c, h),
        t.update(h, s, 1)
    }
    function a(c, h, d) {
        d !== 0 && (i.drawArraysInstanced(s, c, h, d), t.update(h, s, d))
    }
    function o(c, h, d) {
        if (d === 0)
            return;
        const u = e.get("WEBGL_multi_draw");
        if (u === null)
            for (let f = 0; f < d; f++)
                this.render(c[f], h[f]);
        else {
            u.multiDrawArraysWEBGL(s, c, 0, h, 0, d);
            let f = 0;
            for (let p = 0; p < d; p++)
                f += h[p];
            t.update(f, s, 1)
        }
    }
    function l(c, h, d, u) {
        if (d === 0)
            return;
        const f = e.get("WEBGL_multi_draw");
        if (f === null)
            for (let p = 0; p < c.length; p++)
                a(c[p], h[p], u[p]);
        else {
            f.multiDrawArraysInstancedWEBGL(s, c, 0, h, 0, u, 0, d);
            let p = 0;
            for (let A = 0; A < d; A++)
                p += h[A];
            for (let A = 0; A < u.length; A++)
                t.update(p, s, u[A])
        }
    }
    this.setMode = n,
    this.render = r,
    this.renderInstances = a,
    this.renderMultiDraw = o,
    this.renderMultiDrawInstances = l
}
function tb(i, e, t, s) {
    let n;
    function r() {
        if (n !== void 0)
            return n;
        if (e.has("EXT_texture_filter_anisotropic") === !0) {
            const w = e.get("EXT_texture_filter_anisotropic");
            n = i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
        } else
            n = 0;
        return n
    }
    function a(w) {
        return !(w !== wt && s.convert(w) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))
    }
    function o(w) {
        const C = w === Mi && (e.has("EXT_color_buffer_half_float") || e.has("EXT_color_buffer_float"));
        return !(w !== Ct && s.convert(w) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE) && w !== Lt && !C)
    }
    function l(w) {
        if (w === "highp") {
            if (i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision > 0)
                return "highp";
            w = "mediump"
        }
        return w === "mediump" && i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp"
    }
    let c = t.precision !== void 0 ? t.precision : "highp";
    const h = l(c);
    h !== c && (console.warn("THREE.WebGLRenderer:", c, "not supported, using", h, "instead."), c = h);
    const d = t.logarithmicDepthBuffer === !0,
        u = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),
        f = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
        p = i.getParameter(i.MAX_TEXTURE_SIZE),
        A = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),
        m = i.getParameter(i.MAX_VERTEX_ATTRIBS),
        g = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),
        x = i.getParameter(i.MAX_VARYING_VECTORS),
        v = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),
        y = f > 0,
        S = i.getParameter(i.MAX_SAMPLES);
    return {
        isWebGL2: !0,
        getMaxAnisotropy: r,
        getMaxPrecision: l,
        textureFormatReadable: a,
        textureTypeReadable: o,
        precision: c,
        logarithmicDepthBuffer: d,
        maxTextures: u,
        maxVertexTextures: f,
        maxTextureSize: p,
        maxCubemapSize: A,
        maxAttributes: m,
        maxVertexUniforms: g,
        maxVaryings: x,
        maxFragmentUniforms: v,
        vertexTextures: y,
        maxSamples: S
    }
}
function ib(i) {
    const e = this;
    let t = null,
        s = 0,
        n = !1,
        r = !1;
    const a = new Zs,
        o = new at,
        l = {
            value: null,
            needsUpdate: !1
        };
    this.uniform = l,
    this.numPlanes = 0,
    this.numIntersection = 0,
    this.init = function(d, u) {
        const f = d.length !== 0 || u || s !== 0 || n;
        return n = u, s = d.length, f
    },
    this.beginShadows = function() {
        r = !0,
        h(null)
    },
    this.endShadows = function() {
        r = !1
    },
    this.setGlobalState = function(d, u) {
        t = h(d, u, 0)
    },
    this.setState = function(d, u, f) {
        const p = d.clippingPlanes,
            A = d.clipIntersection,
            m = d.clipShadows,
            g = i.get(d);
        if (!n || p === null || p.length === 0 || r && !m)
            r ? h(null) : c();
        else {
            const x = r ? 0 : s,
                v = x * 4;
            let y = g.clippingState || null;
            l.value = y,
            y = h(p, u, v, f);
            for (let S = 0; S !== v; ++S)
                y[S] = t[S];
            g.clippingState = y,
            this.numIntersection = A ? this.numPlanes : 0,
            this.numPlanes += x
        }
    };
    function c() {
        l.value !== t && (l.value = t, l.needsUpdate = s > 0),
        e.numPlanes = s,
        e.numIntersection = 0
    }
    function h(d, u, f, p) {
        const A = d !== null ? d.length : 0;
        let m = null;
        if (A !== 0) {
            if (m = l.value, p !== !0 || m === null) {
                const g = f + A * 4,
                    x = u.matrixWorldInverse;
                o.getNormalMatrix(x),
                (m === null || m.length < g) && (m = new Float32Array(g));
                for (let v = 0, y = f; v !== A; ++v, y += 4)
                    a.copy(d[v]).applyMatrix4(x, o),
                    a.normal.toArray(m, y),
                    m[y + 3] = a.constant
            }
            l.value = m,
            l.needsUpdate = !0
        }
        return e.numPlanes = A, e.numIntersection = 0, m
    }
}
function sb(i) {
    let e = new WeakMap;
    function t(a, o) {
        return o === zu ? a.mapping = la : o === Qu && (a.mapping = Po), a
    }
    function s(a) {
        if (a && a.isTexture) {
            const o = a.mapping;
            if (o === zu || o === Qu)
                if (e.has(a)) {
                    const l = e.get(a).texture;
                    return t(l, a.mapping)
                } else {
                    const l = a.image;
                    if (l && l.height > 0) {
                        const c = new p1(l.height);
                        return c.fromEquirectangularTexture(i, a), e.set(a, c), a.addEventListener("dispose", n), t(c.texture, a.mapping)
                    } else
                        return null
                }
        }
        return a
    }
    function n(a) {
        const o = a.target;
        o.removeEventListener("dispose", n);
        const l = e.get(o);
        l !== void 0 && (e.delete(o), l.dispose())
    }
    function r() {
        e = new WeakMap
    }
    return {
        get: s,
        dispose: r
    }
}
class Ln extends LA {
    constructor(e=-1, t=1, s=1, n=-1, r=.1, a=2e3)
    {
        super(),
        this.isOrthographicCamera = !0,
        this.type = "OrthographicCamera",
        this.zoom = 1,
        this.view = null,
        this.left = e,
        this.right = t,
        this.top = s,
        this.bottom = n,
        this.near = r,
        this.far = a,
        this.updateProjectionMatrix()
    }
    copy(e, t)
    {
        return super.copy(e, t), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = e.view === null ? null : Object.assign({}, e.view), this
    }
    setViewOffset(e, t, s, n, r, a)
    {
        this.view === null && (this.view = {
            enabled: !0,
            fullWidth: 1,
            fullHeight: 1,
            offsetX: 0,
            offsetY: 0,
            width: 1,
            height: 1
        }),
        this.view.enabled = !0,
        this.view.fullWidth = e,
        this.view.fullHeight = t,
        this.view.offsetX = s,
        this.view.offsetY = n,
        this.view.width = r,
        this.view.height = a,
        this.updateProjectionMatrix()
    }
    clearViewOffset()
    {
        this.view !== null && (this.view.enabled = !1),
        this.updateProjectionMatrix()
    }
    updateProjectionMatrix()
    {
        const e = (this.right - this.left) / (2 * this.zoom),
            t = (this.top - this.bottom) / (2 * this.zoom),
            s = (this.right + this.left) / 2,
            n = (this.top + this.bottom) / 2;
        let r = s - e,
            a = s + e,
            o = n + t,
            l = n - t;
        if (this.view !== null && this.view.enabled) {
            const c = (this.right - this.left) / this.view.fullWidth / this.zoom,
                h = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
            r += c * this.view.offsetX,
            a = r + c * this.view.width,
            o -= h * this.view.offsetY,
            l = o - h * this.view.height
        }
        this.projectionMatrix.makeOrthographic(r, a, o, l, this.near, this.far, this.coordinateSystem),
        this.projectionMatrixInverse.copy(this.projectionMatrix).invert()
    }
    toJSON(e)
    {
        const t = super.toJSON(e);
        return t.object.zoom = this.zoom, t.object.left = this.left, t.object.right = this.right, t.object.top = this.top, t.object.bottom = this.bottom, t.object.near = this.near, t.object.far = this.far, this.view !== null && (t.object.view = Object.assign({}, this.view)), t
    }
}
const fo = 4,
    Pv = [.125, .215, .35, .446, .526, .582],
    jr = 20,
    uf = new Ln,
    Dv = new Z;
let df = null,
    ff = 0,
    pf = 0,
    mf = !1;
const Vr = (1 + Math.sqrt(5)) / 2,
    Oa = 1 / Vr,
    Rv = [new b(-Vr, Oa, 0), new b(Vr, Oa, 0), new b(-Oa, 0, Vr), new b(Oa, 0, Vr), new b(0, Vr, -Oa), new b(0, Vr, Oa), new b(-1, 1, -1), new b(1, 1, -1), new b(-1, 1, 1), new b(1, 1, 1)];
class kp {
    constructor(e)
    {
        this._renderer = e,
        this._pingPongRenderTarget = null,
        this._lodMax = 0,
        this._cubeSize = 0,
        this._lodPlanes = [],
        this._sizeLods = [],
        this._sigmas = [],
        this._blurMaterial = null,
        this._cubemapMaterial = null,
        this._equirectMaterial = null,
        this._compileMaterial(this._blurMaterial)
    }
    fromScene(e, t=0, s=.1, n=100)
    {
        df = this._renderer.getRenderTarget(),
        ff = this._renderer.getActiveCubeFace(),
        pf = this._renderer.getActiveMipmapLevel(),
        mf = this._renderer.xr.enabled,
        this._renderer.xr.enabled = !1,
        this._setSize(256);
        const r = this._allocateTargets();
        return r.depthBuffer = !0, this._sceneToCubeUV(e, s, n, r), t > 0 && this._blur(r, 0, 0, t), this._applyPMREM(r), this._cleanup(r), r
    }
    fromEquirectangular(e, t=null)
    {
        return this._fromTexture(e, t)
    }
    fromCubemap(e, t=null)
    {
        return this._fromTexture(e, t)
    }
    compileCubemapShader()
    {
        this._cubemapMaterial === null && (this._cubemapMaterial = Fv(), this._compileMaterial(this._cubemapMaterial))
    }
    compileEquirectangularShader()
    {
        this._equirectMaterial === null && (this._equirectMaterial = Lv(), this._compileMaterial(this._equirectMaterial))
    }
    dispose()
    {
        this._dispose(),
        this._cubemapMaterial !== null && this._cubemapMaterial.dispose(),
        this._equirectMaterial !== null && this._equirectMaterial.dispose()
    }
    _setSize(e)
    {
        this._lodMax = Math.floor(Math.log2(e)),
        this._cubeSize = Math.pow(2, this._lodMax)
    }
    _dispose()
    {
        this._blurMaterial !== null && this._blurMaterial.dispose(),
        this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
        for (let e = 0; e < this._lodPlanes.length; e++)
            this._lodPlanes[e].dispose()
    }
    _cleanup(e)
    {
        this._renderer.setRenderTarget(df, ff, pf),
        this._renderer.xr.enabled = mf,
        e.scissorTest = !1,
        ah(e, 0, 0, e.width, e.height)
    }
    _fromTexture(e, t)
    {
        e.mapping === la || e.mapping === Po ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4),
        df = this._renderer.getRenderTarget(),
        ff = this._renderer.getActiveCubeFace(),
        pf = this._renderer.getActiveMipmapLevel(),
        mf = this._renderer.xr.enabled,
        this._renderer.xr.enabled = !1;
        const s = t || this._allocateTargets();
        return this._textureToCubeUV(e, s), this._applyPMREM(s), this._cleanup(s), s
    }
    _allocateTargets()
    {
        const e = 3 * Math.max(this._cubeSize, 112),
            t = 4 * this._cubeSize,
            s = {
                magFilter: _t,
                minFilter: _t,
                generateMipmaps: !1,
                type: Mi,
                format: wt,
                colorSpace: oi,
                depthBuffer: !1
            },
            n = Uv(e, t, s);
        if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
            this._pingPongRenderTarget !== null && this._dispose(),
            this._pingPongRenderTarget = Uv(e, t, s);
            const {_lodMax: r} = this;
            ({sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas} = nb(r)),
            this._blurMaterial = rb(r, e, t)
        }
        return n
    }
    _compileMaterial(e)
    {
        const t = new Ce(this._lodPlanes[0], e);
        this._renderer.compile(t, uf)
    }
    _sceneToCubeUV(e, t, s, n)
    {
        const o = new gi(90, 1, t, s),
            l = [1, -1, 1, 1, 1, 1],
            c = [1, 1, 1, -1, -1, -1],
            h = this._renderer,
            d = h.autoClear,
            u = h.toneMapping;
        h.getClearColor(Dv),
        h.toneMapping = dr,
        h.autoClear = !1;
        const f = new or({
                name: "PMREM.Background",
                side: ei,
                depthWrite: !1,
                depthTest: !1
            }),
            p = new Ce(new Wo, f);
        let A = !1;
        const m = e.background;
        m ? m.isColor && (f.color.copy(m), e.background = null, A = !0) : (f.color.copy(Dv), A = !0);
        for (let g = 0; g < 6; g++) {
            const x = g % 3;
            x === 0 ? (o.up.set(0, l[g], 0), o.lookAt(c[g], 0, 0)) : x === 1 ? (o.up.set(0, 0, l[g]), o.lookAt(0, c[g], 0)) : (o.up.set(0, l[g], 0), o.lookAt(0, 0, c[g]));
            const v = this._cubeSize;
            ah(n, x * v, g > 2 ? v : 0, v, v),
            h.setRenderTarget(n),
            A && h.render(p, o),
            h.render(e, o)
        }
        p.geometry.dispose(),
        p.material.dispose(),
        h.toneMapping = u,
        h.autoClear = d,
        e.background = m
    }
    _textureToCubeUV(e, t)
    {
        const s = this._renderer,
            n = e.mapping === la || e.mapping === Po;
        n ? (this._cubemapMaterial === null && (this._cubemapMaterial = Fv()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Lv());
        const r = n ? this._cubemapMaterial : this._equirectMaterial,
            a = new Ce(this._lodPlanes[0], r),
            o = r.uniforms;
        o.envMap.value = e;
        const l = this._cubeSize;
        ah(t, 0, 0, 3 * l, 2 * l),
        s.setRenderTarget(t),
        s.render(a, uf)
    }
    _applyPMREM(e)
    {
        const t = this._renderer,
            s = t.autoClear;
        t.autoClear = !1;
        const n = this._lodPlanes.length;
        for (let r = 1; r < n; r++) {
            const a = Math.sqrt(this._sigmas[r] * this._sigmas[r] - this._sigmas[r - 1] * this._sigmas[r - 1]),
                o = Rv[(n - r - 1) % Rv.length];
            this._blur(e, r - 1, r, a, o)
        }
        t.autoClear = s
    }
    _blur(e, t, s, n, r)
    {
        const a = this._pingPongRenderTarget;
        this._halfBlur(e, a, t, s, n, "latitudinal", r),
        this._halfBlur(a, e, s, s, n, "longitudinal", r)
    }
    _halfBlur(e, t, s, n, r, a, o)
    {
        const l = this._renderer,
            c = this._blurMaterial;
        a !== "latitudinal" && a !== "longitudinal" && console.error("blur direction must be either latitudinal or longitudinal!");
        const h = 3,
            d = new Ce(this._lodPlanes[n], c),
            u = c.uniforms,
            f = this._sizeLods[s] - 1,
            p = isFinite(r) ? Math.PI / (2 * f) : 2 * Math.PI / (2 * jr - 1),
            A = r / p,
            m = isFinite(r) ? 1 + Math.floor(h * A) : jr;
        m > jr && console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${jr}`);
        const g = [];
        let x = 0;
        for (let C = 0; C < jr; ++C) {
            const M = C / A,
                E = Math.exp(-M * M / 2);
            g.push(E),
            C === 0 ? x += E : C < m && (x += 2 * E)
        }
        for (let C = 0; C < g.length; C++)
            g[C] = g[C] / x;
        u.envMap.value = e.texture,
        u.samples.value = m,
        u.weights.value = g,
        u.latitudinal.value = a === "latitudinal",
        o && (u.poleAxis.value = o);
        const {_lodMax: v} = this;
        u.dTheta.value = p,
        u.mipInt.value = v - s;
        const y = this._sizeLods[n],
            S = 3 * y * (n > v - fo ? n - v + fo : 0),
            w = 4 * (this._cubeSize - y);
        ah(t, S, w, 3 * y, 2 * y),
        l.setRenderTarget(t),
        l.render(d, uf)
    }
}
function nb(i) {
    const e = [],
        t = [],
        s = [];
    let n = i;
    const r = i - fo + 1 + Pv.length;
    for (let a = 0; a < r; a++) {
        const o = Math.pow(2, n);
        t.push(o);
        let l = 1 / o;
        a > i - fo ? l = Pv[a - i + fo - 1] : a === 0 && (l = 0),
        s.push(l);
        const c = 1 / (o - 2),
            h = -c,
            d = 1 + c,
            u = [h, h, d, h, d, d, h, h, d, d, h, d],
            f = 6,
            p = 6,
            A = 3,
            m = 2,
            g = 1,
            x = new Float32Array(A * p * f),
            v = new Float32Array(m * p * f),
            y = new Float32Array(g * p * f);
        for (let w = 0; w < f; w++) {
            const C = w % 3 * 2 / 3 - 1,
                M = w > 2 ? 0 : -1,
                E = [C, M, 0, C + 2 / 3, M, 0, C + 2 / 3, M + 1, 0, C, M, 0, C + 2 / 3, M + 1, 0, C, M + 1, 0];
            x.set(E, A * p * w),
            v.set(u, m * p * w);
            const _ = [w, w, w, w, w, w];
            y.set(_, g * p * w)
        }
        const S = new ot;
        S.setAttribute("position", new We(x, A)),
        S.setAttribute("uv", new We(v, m)),
        S.setAttribute("faceIndex", new We(y, g)),
        e.push(S),
        n > fo && n--
    }
    return {
        lodPlanes: e,
        sizeLods: t,
        sigmas: s
    }
}
function Uv(i, e, t) {
    const s = new vt(i, e, t);
    return s.texture.mapping = _d, s.texture.name = "PMREM.cubeUv", s.scissorTest = !0, s
}
function ah(i, e, t, s, n) {
    i.viewport.set(e, t, s, n),
    i.scissor.set(e, t, s, n)
}
function rb(i, e, t) {
    const s = new Float32Array(jr),
        n = new b(0, 1, 0);
    return new fe({
        name: "SphericalGaussianBlur",
        defines: {
            n: jr,
            CUBEUV_TEXEL_WIDTH: 1 / e,
            CUBEUV_TEXEL_HEIGHT: 1 / t,
            CUBEUV_MAX_MIP: `${i}.0`
        },
        uniforms: {
            envMap: {
                value: null
            },
            samples: {
                value: 1
            },
            weights: {
                value: s
            },
            latitudinal: {
                value: !1
            },
            dTheta: {
                value: 0
            },
            mipInt: {
                value: 0
            },
            poleAxis: {
                value: n
            }
        },
        vertexShader: FA(),
        fragmentShader: `

        			precision mediump float;
        			precision mediump int;

        			varying vec3 vOutputDirection;

        			uniform sampler2D envMap;
        			uniform int samples;
        			uniform float weights[ n ];
        			uniform bool latitudinal;
        			uniform float dTheta;
        			uniform float mipInt;
        			uniform vec3 poleAxis;

        			#define ENVMAP_TYPE_CUBE_UV
        			#include <cube_uv_reflection_fragment>

        			vec3 getSample( float theta, vec3 axis ) {

        				float cosTheta = cos( theta );
        				// Rodrigues' axis-angle rotation
        				vec3 sampleDirection = vOutputDirection * cosTheta
        					+ cross( axis, vOutputDirection ) * sin( theta )
        					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

        				return bilinearCubeUV( envMap, sampleDirection, mipInt );

        			}

        			void main() {

        				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

        				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

        					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

        				}

        				axis = normalize( axis );

        				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
        				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

        				for ( int i = 1; i < n; i++ ) {

        					if ( i >= samples ) {

        						break;

        					}

        					float theta = dTheta * float( i );
        					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
        					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

        				}

        			}
        		`,
        blending: qt,
        depthTest: !1,
        depthWrite: !1
    })
}
function Lv() {
    return new fe({
        name: "EquirectangularToCubeUV",
        uniforms: {
            envMap: {
                value: null
            }
        },
        vertexShader: FA(),
        fragmentShader: `

        			precision mediump float;
        			precision mediump int;

        			varying vec3 vOutputDirection;

        			uniform sampler2D envMap;

        			#include <common>

        			void main() {

        				vec3 outputDirection = normalize( vOutputDirection );
        				vec2 uv = equirectUv( outputDirection );

        				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

        			}
        		`,
        blending: qt,
        depthTest: !1,
        depthWrite: !1
    })
}
function Fv() {
    return new fe({
        name: "CubemapToCubeUV",
        uniforms: {
            envMap: {
                value: null
            },
            flipEnvMap: {
                value: -1
            }
        },
        vertexShader: FA(),
        fragmentShader: `

        			precision mediump float;
        			precision mediump int;

        			uniform float flipEnvMap;

        			varying vec3 vOutputDirection;

        			uniform samplerCube envMap;

        			void main() {

        				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

        			}
        		`,
        blending: qt,
        depthTest: !1,
        depthWrite: !1
    })
}
function FA() {
    return `

    		precision mediump float;
    		precision mediump int;

    		attribute float faceIndex;

    		varying vec3 vOutputDirection;

    		// RH coordinate system; PMREM face-indexing convention
    		vec3 getDirection( vec2 uv, float face ) {

    			uv = 2.0 * uv - 1.0;

    			vec3 direction = vec3( uv, 1.0 );

    			if ( face == 0.0 ) {

    				direction = direction.zyx; // ( 1, v, u ) pos x

    			} else if ( face == 1.0 ) {

    				direction = direction.xzy;
    				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

    			} else if ( face == 2.0 ) {

    				direction.x *= -1.0; // ( -u, v, 1 ) pos z

    			} else if ( face == 3.0 ) {

    				direction = direction.zyx;
    				direction.xz *= -1.0; // ( -1, v, -u ) neg x

    			} else if ( face == 4.0 ) {

    				direction = direction.xzy;
    				direction.xy *= -1.0; // ( -u, -1, v ) neg y

    			} else if ( face == 5.0 ) {

    				direction.z *= -1.0; // ( u, v, -1 ) neg z

    			}

    			return direction;

    		}

    		void main() {

    			vOutputDirection = getDirection( uv, faceIndex );
    			gl_Position = vec4( position, 1.0 );

    		}
    	`
}
function ab(i) {
    let e = new WeakMap,
        t = null;
    function s(o) {
        if (o && o.isTexture) {
            const l = o.mapping,
                c = l === zu || l === Qu,
                h = l === la || l === Po;
            if (c || h) {
                let d = e.get(o);
                const u = d !== void 0 ? d.texture.pmremVersion : 0;
                if (o.isRenderTargetTexture && o.pmremVersion !== u)
                    return t === null && (t = new kp(i)), d = c ? t.fromEquirectangular(o, d) : t.fromCubemap(o, d), d.texture.pmremVersion = o.pmremVersion, e.set(o, d), d.texture;
                if (d !== void 0)
                    return d.texture;
                {
                    const f = o.image;
                    return c && f && f.height > 0 || h && f && n(f) ? (t === null && (t = new kp(i)), d = c ? t.fromEquirectangular(o) : t.fromCubemap(o), d.texture.pmremVersion = o.pmremVersion, e.set(o, d), o.addEventListener("dispose", r), d.texture) : null
                }
            }
        }
        return o
    }
    function n(o) {
        let l = 0;
        const c = 6;
        for (let h = 0; h < c; h++)
            o[h] !== void 0 && l++;
        return l === c
    }
    function r(o) {
        const l = o.target;
        l.removeEventListener("dispose", r);
        const c = e.get(l);
        c !== void 0 && (e.delete(l), c.dispose())
    }
    function a() {
        e = new WeakMap,
        t !== null && (t.dispose(), t = null)
    }
    return {
        get: s,
        dispose: a
    }
}
function ob(i) {
    const e = {};
    function t(s) {
        if (e[s] !== void 0)
            return e[s];
        let n;
        switch (s) {
        case "WEBGL_depth_texture":
            n = i.getExtension("WEBGL_depth_texture") || i.getExtension("MOZ_WEBGL_depth_texture") || i.getExtension("WEBKIT_WEBGL_depth_texture");
            break;
        case "EXT_texture_filter_anisotropic":
            n = i.getExtension("EXT_texture_filter_anisotropic") || i.getExtension("MOZ_EXT_texture_filter_anisotropic") || i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
            break;
        case "WEBGL_compressed_texture_s3tc":
            n = i.getExtension("WEBGL_compressed_texture_s3tc") || i.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
            break;
        case "WEBGL_compressed_texture_pvrtc":
            n = i.getExtension("WEBGL_compressed_texture_pvrtc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
            break;
        default:
            n = i.getExtension(s)
        }
        return e[s] = n, n
    }
    return {
        has: function(s) {
            return t(s) !== null
        },
        init: function() {
            t("EXT_color_buffer_float"),
            t("WEBGL_clip_cull_distance"),
            t("OES_texture_float_linear"),
            t("EXT_color_buffer_half_float"),
            t("WEBGL_multisampled_render_to_texture"),
            t("WEBGL_render_shared_exponent")
        },
        get: function(s) {
            const n = t(s);
            return n === null && PA("THREE.WebGLRenderer: " + s + " extension not supported."), n
        }
    }
}
function lb(i, e, t, s) {
    const n = {},
        r = new WeakMap;
    function a(d) {
        const u = d.target;
        u.index !== null && e.remove(u.index);
        for (const p in u.attributes)
            e.remove(u.attributes[p]);
        for (const p in u.morphAttributes) {
            const A = u.morphAttributes[p];
            for (let m = 0, g = A.length; m < g; m++)
                e.remove(A[m])
        }
        u.removeEventListener("dispose", a),
        delete n[u.id];
        const f = r.get(u);
        f && (e.remove(f), r.delete(u)),
        s.releaseStatesOfGeometry(u),
        u.isInstancedBufferGeometry === !0 && delete u._maxInstanceCount,
        t.memory.geometries--
    }
    function o(d, u) {
        return n[u.id] === !0 || (u.addEventListener("dispose", a), n[u.id] = !0, t.memory.geometries++), u
    }
    function l(d) {
        const u = d.attributes;
        for (const p in u)
            e.update(u[p], i.ARRAY_BUFFER);
        const f = d.morphAttributes;
        for (const p in f) {
            const A = f[p];
            for (let m = 0, g = A.length; m < g; m++)
                e.update(A[m], i.ARRAY_BUFFER)
        }
    }
    function c(d) {
        const u = [],
            f = d.index,
            p = d.attributes.position;
        let A = 0;
        if (f !== null) {
            const x = f.array;
            A = f.version;
            for (let v = 0, y = x.length; v < y; v += 3) {
                const S = x[v + 0],
                    w = x[v + 1],
                    C = x[v + 2];
                u.push(S, w, w, C, C, S)
            }
        } else if (p !== void 0) {
            const x = p.array;
            A = p.version;
            for (let v = 0, y = x.length / 3 - 1; v < y; v += 3) {
                const S = v + 0,
                    w = v + 1,
                    C = v + 2;
                u.push(S, w, w, C, C, S)
            }
        } else
            return;
        const m = new (My(u) ? Py : By)(u, 1);
        m.version = A;
        const g = r.get(d);
        g && e.remove(g),
        r.set(d, m)
    }
    function h(d) {
        const u = r.get(d);
        if (u) {
            const f = d.index;
            f !== null && u.version < f.version && c(d)
        } else
            c(d);
        return r.get(d)
    }
    return {
        get: o,
        update: l,
        getWireframeAttribute: h
    }
}
function cb(i, e, t) {
    let s;
    function n(u) {
        s = u
    }
    let r,
        a;
    function o(u) {
        r = u.type,
        a = u.bytesPerElement
    }
    function l(u, f) {
        i.drawElements(s, f, r, u * a),
        t.update(f, s, 1)
    }
    function c(u, f, p) {
        p !== 0 && (i.drawElementsInstanced(s, f, r, u * a, p), t.update(f, s, p))
    }
    function h(u, f, p) {
        if (p === 0)
            return;
        const A = e.get("WEBGL_multi_draw");
        if (A === null)
            for (let m = 0; m < p; m++)
                this.render(u[m] / a, f[m]);
        else {
            A.multiDrawElementsWEBGL(s, f, 0, r, u, 0, p);
            let m = 0;
            for (let g = 0; g < p; g++)
                m += f[g];
            t.update(m, s, 1)
        }
    }
    function d(u, f, p, A) {
        if (p === 0)
            return;
        const m = e.get("WEBGL_multi_draw");
        if (m === null)
            for (let g = 0; g < u.length; g++)
                c(u[g] / a, f[g], A[g]);
        else {
            m.multiDrawElementsInstancedWEBGL(s, f, 0, r, u, 0, A, 0, p);
            let g = 0;
            for (let x = 0; x < p; x++)
                g += f[x];
            for (let x = 0; x < A.length; x++)
                t.update(g, s, A[x])
        }
    }
    this.setMode = n,
    this.setIndex = o,
    this.render = l,
    this.renderInstances = c,
    this.renderMultiDraw = h,
    this.renderMultiDrawInstances = d
}
function hb(i) {
    const e = {
            geometries: 0,
            textures: 0
        },
        t = {
            frame: 0,
            calls: 0,
            triangles: 0,
            points: 0,
            lines: 0
        };
    function s(r, a, o) {
        switch (t.calls++, a) {
        case i.TRIANGLES:
            t.triangles += o * (r / 3);
            break;
        case i.LINES:
            t.lines += o * (r / 2);
            break;
        case i.LINE_STRIP:
            t.lines += o * (r - 1);
            break;
        case i.LINE_LOOP:
            t.lines += o * r;
            break;
        case i.POINTS:
            t.points += o * r;
            break;
        default:
            console.error("THREE.WebGLInfo: Unknown draw mode:", a);
            break
        }
    }
    function n() {
        t.calls = 0,
        t.triangles = 0,
        t.points = 0,
        t.lines = 0
    }
    return {
        memory: e,
        render: t,
        programs: null,
        autoReset: !0,
        reset: n,
        update: s
    }
}
function ub(i, e, t) {
    const s = new WeakMap,
        n = new yt;
    function r(a, o, l) {
        const c = a.morphTargetInfluences,
            h = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color,
            d = h !== void 0 ? h.length : 0;
        let u = s.get(o);
        if (u === void 0 || u.count !== d) {
            let E = function() {
                C.dispose(),
                s.delete(o),
                o.removeEventListener("dispose", E)
            };
            u !== void 0 && u.texture.dispose();
            const f = o.morphAttributes.position !== void 0,
                p = o.morphAttributes.normal !== void 0,
                A = o.morphAttributes.color !== void 0,
                m = o.morphAttributes.position || [],
                g = o.morphAttributes.normal || [],
                x = o.morphAttributes.color || [];
            let v = 0;
            f === !0 && (v = 1),
            p === !0 && (v = 2),
            A === !0 && (v = 3);
            let y = o.attributes.position.count * v,
                S = 1;
            y > e.maxTextureSize && (S = Math.ceil(y / e.maxTextureSize), y = e.maxTextureSize);
            const w = new Float32Array(y * S * 4 * d),
                C = new Ty(w, y, S, d);
            C.type = Lt,
            C.needsUpdate = !0;
            const M = v * 4;
            for (let _ = 0; _ < d; _++) {
                const I = m[_],
                    P = g[_],
                    D = x[_],
                    L = y * S * 4 * _;
                for (let z = 0; z < I.count; z++) {
                    const O = z * M;
                    f === !0 && (n.fromBufferAttribute(I, z), w[L + O + 0] = n.x, w[L + O + 1] = n.y, w[L + O + 2] = n.z, w[L + O + 3] = 0),
                    p === !0 && (n.fromBufferAttribute(P, z), w[L + O + 4] = n.x, w[L + O + 5] = n.y, w[L + O + 6] = n.z, w[L + O + 7] = 0),
                    A === !0 && (n.fromBufferAttribute(D, z), w[L + O + 8] = n.x, w[L + O + 9] = n.y, w[L + O + 10] = n.z, w[L + O + 11] = D.itemSize === 4 ? n.w : 1)
                }
            }
            u = {
                count: d,
                texture: C,
                size: new H(y, S)
            },
            s.set(o, u),
            o.addEventListener("dispose", E)
        }
        if (a.isInstancedMesh === !0 && a.morphTexture !== null)
            l.getUniforms().setValue(i, "morphTexture", a.morphTexture, t);
        else {
            let f = 0;
            for (let A = 0; A < c.length; A++)
                f += c[A];
            const p = o.morphTargetsRelative ? 1 : 1 - f;
            l.getUniforms().setValue(i, "morphTargetBaseInfluence", p),
            l.getUniforms().setValue(i, "morphTargetInfluences", c)
        }
        l.getUniforms().setValue(i, "morphTargetsTexture", u.texture, t),
        l.getUniforms().setValue(i, "morphTargetsTextureSize", u.size)
    }
    return {
        update: r
    }
}
function db(i, e, t, s) {
    let n = new WeakMap;
    function r(l) {
        const c = s.render.frame,
            h = l.geometry,
            d = e.get(l, h);
        if (n.get(d) !== c && (e.update(d), n.set(d, c)), l.isInstancedMesh && (l.hasEventListener("dispose", o) === !1 && l.addEventListener("dispose", o), n.get(l) !== c && (t.update(l.instanceMatrix, i.ARRAY_BUFFER), l.instanceColor !== null && t.update(l.instanceColor, i.ARRAY_BUFFER), n.set(l, c))), l.isSkinnedMesh) {
            const u = l.skeleton;
            n.get(u) !== c && (u.update(), n.set(u, c))
        }
        return d
    }
    function a() {
        n = new WeakMap
    }
    function o(l) {
        const c = l.target;
        c.removeEventListener("dispose", o),
        t.remove(c.instanceMatrix),
        c.instanceColor !== null && t.remove(c.instanceColor)
    }
    return {
        update: r,
        dispose: a
    }
}
class Fo extends Rt {
    constructor(e, t, s, n, r, a, o, l, c, h=wo)
    {
        if (h !== wo && h !== ua)
            throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
        s === void 0 && h === wo && (s = ca),
        s === void 0 && h === ua && (s = ha),
        super(null, n, r, a, o, l, h, s, c),
        this.isDepthTexture = !0,
        this.image = {
            width: e,
            height: t
        },
        this.magFilter = o !== void 0 ? o : gt,
        this.minFilter = l !== void 0 ? l : gt,
        this.flipY = !1,
        this.generateMipmaps = !1,
        this.compareFunction = null
    }
    copy(e)
    {
        return super.copy(e), this.compareFunction = e.compareFunction, this
    }
    toJSON(e)
    {
        const t = super.toJSON(e);
        return this.compareFunction !== null && (t.compareFunction = this.compareFunction), t
    }
}
const Ly = new Rt,
    Fy = new Fo(1, 1);
Fy.compareFunction = Sy;
const Ny = new Ty,
    Oy = new DA,
    ky = new Ry,
    Nv = [],
    Ov = [],
    kv = new Float32Array(16),
    zv = new Float32Array(9),
    Qv = new Float32Array(4);
function Yo(i, e, t) {
    const s = i[0];
    if (s <= 0 || s > 0)
        return i;
    const n = e * t;
    let r = Nv[n];
    if (r === void 0 && (r = new Float32Array(n), Nv[n] = r), e !== 0) {
        s.toArray(r, 0);
        for (let a = 1, o = 0; a !== e; ++a)
            o += t,
            i[a].toArray(r, o)
    }
    return r
}
function di(i, e) {
    if (i.length !== e.length)
        return !1;
    for (let t = 0, s = i.length; t < s; t++)
        if (i[t] !== e[t])
            return !1;
    return !0
}
function fi(i, e) {
    for (let t = 0, s = e.length; t < s; t++)
        i[t] = e[t]
}
function Cd(i, e) {
    let t = Ov[e];
    t === void 0 && (t = new Int32Array(e), Ov[e] = t);
    for (let s = 0; s !== e; ++s)
        t[s] = i.allocateTextureUnit();
    return t
}
function fb(i, e) {
    const t = this.cache;
    t[0] !== e && (i.uniform1f(this.addr, e), t[0] = e)
}
function pb(i, e) {
    const t = this.cache;
    if (e.x !== void 0)
        (t[0] !== e.x || t[1] !== e.y) && (i.uniform2f(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
    else {
        if (di(t, e))
            return;
        i.uniform2fv(this.addr, e),
        fi(t, e)
    }
}
function mb(i, e) {
    const t = this.cache;
    if (e.x !== void 0)
        (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (i.uniform3f(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
    else if (e.r !== void 0)
        (t[0] !== e.r || t[1] !== e.g || t[2] !== e.b) && (i.uniform3f(this.addr, e.r, e.g, e.b), t[0] = e.r, t[1] = e.g, t[2] = e.b);
    else {
        if (di(t, e))
            return;
        i.uniform3fv(this.addr, e),
        fi(t, e)
    }
}
function Ab(i, e) {
    const t = this.cache;
    if (e.x !== void 0)
        (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (i.uniform4f(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
    else {
        if (di(t, e))
            return;
        i.uniform4fv(this.addr, e),
        fi(t, e)
    }
}
function gb(i, e) {
    const t = this.cache,
        s = e.elements;
    if (s === void 0) {
        if (di(t, e))
            return;
        i.uniformMatrix2fv(this.addr, !1, e),
        fi(t, e)
    } else {
        if (di(t, s))
            return;
        Qv.set(s),
        i.uniformMatrix2fv(this.addr, !1, Qv),
        fi(t, s)
    }
}
function vb(i, e) {
    const t = this.cache,
        s = e.elements;
    if (s === void 0) {
        if (di(t, e))
            return;
        i.uniformMatrix3fv(this.addr, !1, e),
        fi(t, e)
    } else {
        if (di(t, s))
            return;
        zv.set(s),
        i.uniformMatrix3fv(this.addr, !1, zv),
        fi(t, s)
    }
}
function xb(i, e) {
    const t = this.cache,
        s = e.elements;
    if (s === void 0) {
        if (di(t, e))
            return;
        i.uniformMatrix4fv(this.addr, !1, e),
        fi(t, e)
    } else {
        if (di(t, s))
            return;
        kv.set(s),
        i.uniformMatrix4fv(this.addr, !1, kv),
        fi(t, s)
    }
}
function yb(i, e) {
    const t = this.cache;
    t[0] !== e && (i.uniform1i(this.addr, e), t[0] = e)
}
function _b(i, e) {
    const t = this.cache;
    if (e.x !== void 0)
        (t[0] !== e.x || t[1] !== e.y) && (i.uniform2i(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
    else {
        if (di(t, e))
            return;
        i.uniform2iv(this.addr, e),
        fi(t, e)
    }
}
function wb(i, e) {
    const t = this.cache;
    if (e.x !== void 0)
        (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (i.uniform3i(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
    else {
        if (di(t, e))
            return;
        i.uniform3iv(this.addr, e),
        fi(t, e)
    }
}
function Eb(i, e) {
    const t = this.cache;
    if (e.x !== void 0)
        (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (i.uniform4i(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
    else {
        if (di(t, e))
            return;
        i.uniform4iv(this.addr, e),
        fi(t, e)
    }
}
function Cb(i, e) {
    const t = this.cache;
    t[0] !== e && (i.uniform1ui(this.addr, e), t[0] = e)
}
function Sb(i, e) {
    const t = this.cache;
    if (e.x !== void 0)
        (t[0] !== e.x || t[1] !== e.y) && (i.uniform2ui(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
    else {
        if (di(t, e))
            return;
        i.uniform2uiv(this.addr, e),
        fi(t, e)
    }
}
function Mb(i, e) {
    const t = this.cache;
    if (e.x !== void 0)
        (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (i.uniform3ui(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
    else {
        if (di(t, e))
            return;
        i.uniform3uiv(this.addr, e),
        fi(t, e)
    }
}
function bb(i, e) {
    const t = this.cache;
    if (e.x !== void 0)
        (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (i.uniform4ui(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
    else {
        if (di(t, e))
            return;
        i.uniform4uiv(this.addr, e),
        fi(t, e)
    }
}
function Tb(i, e, t) {
    const s = this.cache,
        n = t.allocateTextureUnit();
    s[0] !== n && (i.uniform1i(this.addr, n), s[0] = n);
    const r = this.type === i.SAMPLER_2D_SHADOW ? Fy : Ly;
    t.setTexture2D(e || r, n)
}
function Ib(i, e, t) {
    const s = this.cache,
        n = t.allocateTextureUnit();
    s[0] !== n && (i.uniform1i(this.addr, n), s[0] = n),
    t.setTexture3D(e || Oy, n)
}
function Bb(i, e, t) {
    const s = this.cache,
        n = t.allocateTextureUnit();
    s[0] !== n && (i.uniform1i(this.addr, n), s[0] = n),
    t.setTextureCube(e || ky, n)
}
function Pb(i, e, t) {
    const s = this.cache,
        n = t.allocateTextureUnit();
    s[0] !== n && (i.uniform1i(this.addr, n), s[0] = n),
    t.setTexture2DArray(e || Ny, n)
}
function Db(i) {
    switch (i) {
    case 5126:
        return fb;
    case 35664:
        return pb;
    case 35665:
        return mb;
    case 35666:
        return Ab;
    case 35674:
        return gb;
    case 35675:
        return vb;
    case 35676:
        return xb;
    case 5124:
    case 35670:
        return yb;
    case 35667:
    case 35671:
        return _b;
    case 35668:
    case 35672:
        return wb;
    case 35669:
    case 35673:
        return Eb;
    case 5125:
        return Cb;
    case 36294:
        return Sb;
    case 36295:
        return Mb;
    case 36296:
        return bb;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
        return Tb;
    case 35679:
    case 36299:
    case 36307:
        return Ib;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
        return Bb;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
        return Pb
    }
}
function Rb(i, e) {
    i.uniform1fv(this.addr, e)
}
function Ub(i, e) {
    const t = Yo(e, this.size, 2);
    i.uniform2fv(this.addr, t)
}
function Lb(i, e) {
    const t = Yo(e, this.size, 3);
    i.uniform3fv(this.addr, t)
}
function Fb(i, e) {
    const t = Yo(e, this.size, 4);
    i.uniform4fv(this.addr, t)
}
function Nb(i, e) {
    const t = Yo(e, this.size, 4);
    i.uniformMatrix2fv(this.addr, !1, t)
}
function Ob(i, e) {
    const t = Yo(e, this.size, 9);
    i.uniformMatrix3fv(this.addr, !1, t)
}
function kb(i, e) {
    const t = Yo(e, this.size, 16);
    i.uniformMatrix4fv(this.addr, !1, t)
}
function zb(i, e) {
    i.uniform1iv(this.addr, e)
}
function Qb(i, e) {
    i.uniform2iv(this.addr, e)
}
function Gb(i, e) {
    i.uniform3iv(this.addr, e)
}
function Hb(i, e) {
    i.uniform4iv(this.addr, e)
}
function Vb(i, e) {
    i.uniform1uiv(this.addr, e)
}
function Wb(i, e) {
    i.uniform2uiv(this.addr, e)
}
function Yb(i, e) {
    i.uniform3uiv(this.addr, e)
}
function qb(i, e) {
    i.uniform4uiv(this.addr, e)
}
function Xb(i, e, t) {
    const s = this.cache,
        n = e.length,
        r = Cd(t, n);
    di(s, r) || (i.uniform1iv(this.addr, r), fi(s, r));
    for (let a = 0; a !== n; ++a)
        t.setTexture2D(e[a] || Ly, r[a])
}
function Kb(i, e, t) {
    const s = this.cache,
        n = e.length,
        r = Cd(t, n);
    di(s, r) || (i.uniform1iv(this.addr, r), fi(s, r));
    for (let a = 0; a !== n; ++a)
        t.setTexture3D(e[a] || Oy, r[a])
}
function Jb(i, e, t) {
    const s = this.cache,
        n = e.length,
        r = Cd(t, n);
    di(s, r) || (i.uniform1iv(this.addr, r), fi(s, r));
    for (let a = 0; a !== n; ++a)
        t.setTextureCube(e[a] || ky, r[a])
}
function jb(i, e, t) {
    const s = this.cache,
        n = e.length,
        r = Cd(t, n);
    di(s, r) || (i.uniform1iv(this.addr, r), fi(s, r));
    for (let a = 0; a !== n; ++a)
        t.setTexture2DArray(e[a] || Ny, r[a])
}
function Zb(i) {
    switch (i) {
    case 5126:
        return Rb;
    case 35664:
        return Ub;
    case 35665:
        return Lb;
    case 35666:
        return Fb;
    case 35674:
        return Nb;
    case 35675:
        return Ob;
    case 35676:
        return kb;
    case 5124:
    case 35670:
        return zb;
    case 35667:
    case 35671:
        return Qb;
    case 35668:
    case 35672:
        return Gb;
    case 35669:
    case 35673:
        return Hb;
    case 5125:
        return Vb;
    case 36294:
        return Wb;
    case 36295:
        return Yb;
    case 36296:
        return qb;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
        return Xb;
    case 35679:
    case 36299:
    case 36307:
        return Kb;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
        return Jb;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
        return jb
    }
}
class $b {
    constructor(e, t, s)
    {
        this.id = e,
        this.addr = s,
        this.cache = [],
        this.type = t.type,
        this.setValue = Db(t.type)
    }
}
class eT {
    constructor(e, t, s)
    {
        this.id = e,
        this.addr = s,
        this.cache = [],
        this.type = t.type,
        this.size = t.size,
        this.setValue = Zb(t.type)
    }
}
class tT {
    constructor(e)
    {
        this.id = e,
        this.seq = [],
        this.map = {}
    }
    setValue(e, t, s)
    {
        const n = this.seq;
        for (let r = 0, a = n.length; r !== a; ++r) {
            const o = n[r];
            o.setValue(e, t[o.id], s)
        }
    }
}
const Af = /(\w+)(\])?(\[|\.)?/g;
function Gv(i, e) {
    i.seq.push(e),
    i.map[e.id] = e
}
function iT(i, e, t) {
    const s = i.name,
        n = s.length;
    for (Af.lastIndex = 0;;) {
        const r = Af.exec(s),
            a = Af.lastIndex;
        let o = r[1];
        const l = r[2] === "]",
            c = r[3];
        if (l && (o = o | 0), c === void 0 || c === "[" && a + 2 === n) {
            Gv(t, c === void 0 ? new $b(o, i, e) : new eT(o, i, e));
            break
        } else {
            let d = t.map[o];
            d === void 0 && (d = new tT(o), Gv(t, d)),
            t = d
        }
    }
}
class Zh {
    constructor(e, t)
    {
        this.seq = [],
        this.map = {};
        const s = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
        for (let n = 0; n < s; ++n) {
            const r = e.getActiveUniform(t, n),
                a = e.getUniformLocation(t, r.name);
            iT(r, a, this)
        }
    }
    setValue(e, t, s, n)
    {
        const r = this.map[t];
        r !== void 0 && r.setValue(e, s, n)
    }
    setOptional(e, t, s)
    {
        const n = t[s];
        n !== void 0 && this.setValue(e, s, n)
    }
    static upload(e, t, s, n)
    {
        for (let r = 0, a = t.length; r !== a; ++r) {
            const o = t[r],
                l = s[o.id];
            l.needsUpdate !== !1 && o.setValue(e, l.value, n)
        }
    }
    static seqWithValue(e, t)
    {
        const s = [];
        for (let n = 0, r = e.length; n !== r; ++n) {
            const a = e[n];
            a.id in t && s.push(a)
        }
        return s
    }
}
function Hv(i, e, t) {
    const s = i.createShader(e);
    return i.shaderSource(s, t), i.compileShader(s), s
}
const sT = 37297;
let nT = 0;
function rT(i, e) {
    const t = i.split(`
        `),
        s = [],
        n = Math.max(e - 6, 0),
        r = Math.min(e + 6, t.length);
    for (let a = n; a < r; a++) {
        const o = a + 1;
        s.push(`${o === e ? ">" : " "} ${o}: ${t[a]}`)
    }
    return s.join(`
    `)
}
function aT(i) {
    const e = mt.getPrimaries(mt.workingColorSpace),
        t = mt.getPrimaries(i);
    let s;
    switch (e === t ? s = "" : e === Yu && t === Wu ? s = "LinearDisplayP3ToLinearSRGB" : e === Wu && t === Yu && (s = "LinearSRGBToLinearDisplayP3"), i) {
    case oi:
    case Mc:
        return [s, "LinearTransferOETF"];
    case Ve:
    case wd:
        return [s, "sRGBTransferOETF"];
    default:
        return console.warn("THREE.WebGLProgram: Unsupported color space:", i), [s, "LinearTransferOETF"]
    }
}
function Vv(i, e, t) {
    const s = i.getShaderParameter(e, i.COMPILE_STATUS),
        n = i.getShaderInfoLog(e).trim();
    if (s && n === "")
        return "";
    const r = /ERROR: 0:(\d+)/.exec(n);
    if (r) {
        const a = parseInt(r[1]);
        return t.toUpperCase() + `

        ` + n + `

        ` + rT(i.getShaderSource(e), a)
    } else
        return n
}
function oT(i, e) {
    const t = aT(e);
    return `vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`
}
function lT(i, e) {
    let t;
    switch (e) {
    case sC:
        t = "Linear";
        break;
    case nC:
        t = "Reinhard";
        break;
    case rC:
        t = "OptimizedCineon";
        break;
    case aC:
        t = "ACESFilmic";
        break;
    case lC:
        t = "AgX";
        break;
    case cC:
        t = "Neutral";
        break;
    case oC:
        t = "Custom";
        break;
    default:
        console.warn("THREE.WebGLProgram: Unsupported toneMapping:", e),
        t = "Linear"
    }
    return "vec3 " + i + "( vec3 color ) { return " + t + "ToneMapping( color ); }"
}
function cT(i) {
    return [i.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "", i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""].filter(Tl).join(`
    `)
}
function hT(i) {
    const e = [];
    for (const t in i) {
        const s = i[t];
        s !== !1 && e.push("#define " + t + " " + s)
    }
    return e.join(`
    `)
}
function uT(i, e) {
    const t = {},
        s = i.getProgramParameter(e, i.ACTIVE_ATTRIBUTES);
    for (let n = 0; n < s; n++) {
        const r = i.getActiveAttrib(e, n),
            a = r.name;
        let o = 1;
        r.type === i.FLOAT_MAT2 && (o = 2),
        r.type === i.FLOAT_MAT3 && (o = 3),
        r.type === i.FLOAT_MAT4 && (o = 4),
        t[a] = {
            type: r.type,
            location: i.getAttribLocation(e, a),
            locationSize: o
        }
    }
    return t
}
function Tl(i) {
    return i !== ""
}
function Wv(i, e) {
    const t = e.numSpotLightShadows + e.numSpotLightMaps - e.numSpotLightShadowsWithMaps;
    return i.replace(/NUM_DIR_LIGHTS/g, e.numDirLights).replace(/NUM_SPOT_LIGHTS/g, e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, t).replace(/NUM_RECT_AREA_LIGHTS/g, e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, e.numPointLights).replace(/NUM_HEMI_LIGHTS/g, e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, e.numPointLightShadows)
}
function Yv(i, e) {
    return i.replace(/NUM_CLIPPING_PLANES/g, e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, e.numClippingPlanes - e.numClipIntersection)
}
const dT = /^[ \t]*#include +<([\w\d./]+)>/gm;
function zp(i) {
    return i.replace(dT, pT)
}
const fT = new Map;
function pT(i, e) {
    let t = rt[e];
    if (t === void 0) {
        const s = fT.get(e);
        if (s !== void 0)
            t = rt[s],
            console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', e, s);
        else
            throw new Error("Can not resolve #include <" + e + ">")
    }
    return zp(t)
}
const mT = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function qv(i) {
    return i.replace(mT, AT)
}
function AT(i, e, t, s) {
    let n = "";
    for (let r = parseInt(e); r < parseInt(t); r++)
        n += s.replace(/\[\s*i\s*\]/g, "[ " + r + " ]").replace(/UNROLLED_LOOP_INDEX/g, r);
    return n
}
function Xv(i) {
    let e = `precision ${i.precision} float;
    	precision ${i.precision} int;
    	precision ${i.precision} sampler2D;
    	precision ${i.precision} samplerCube;
    	precision ${i.precision} sampler3D;
    	precision ${i.precision} sampler2DArray;
    	precision ${i.precision} sampler2DShadow;
    	precision ${i.precision} samplerCubeShadow;
    	precision ${i.precision} sampler2DArrayShadow;
    	precision ${i.precision} isampler2D;
    	precision ${i.precision} isampler3D;
    	precision ${i.precision} isamplerCube;
    	precision ${i.precision} isampler2DArray;
    	precision ${i.precision} usampler2D;
    	precision ${i.precision} usampler3D;
    	precision ${i.precision} usamplerCube;
    	precision ${i.precision} usampler2DArray;
    	`;
    return i.precision === "highp" ? e += `
    #define HIGH_PRECISION` : i.precision === "mediump" ? e += `
    #define MEDIUM_PRECISION` : i.precision === "lowp" && (e += `
    #define LOW_PRECISION`), e
}
function gT(i) {
    let e = "SHADOWMAP_TYPE_BASIC";
    return i.shadowMapType === oy ? e = "SHADOWMAP_TYPE_PCF" : i.shadowMapType === ly ? e = "SHADOWMAP_TYPE_PCF_SOFT" : i.shadowMapType === _n && (e = "SHADOWMAP_TYPE_VSM"), e
}
function vT(i) {
    let e = "ENVMAP_TYPE_CUBE";
    if (i.envMap)
        switch (i.envMapMode) {
        case la:
        case Po:
            e = "ENVMAP_TYPE_CUBE";
            break;
        case _d:
            e = "ENVMAP_TYPE_CUBE_UV";
            break
        }
    return e
}
function xT(i) {
    let e = "ENVMAP_MODE_REFLECTION";
    if (i.envMap)
        switch (i.envMapMode) {
        case Po:
            e = "ENVMAP_MODE_REFRACTION";
            break
        }
    return e
}
function yT(i) {
    let e = "ENVMAP_BLENDING_NONE";
    if (i.envMap)
        switch (i.combine) {
        case my:
            e = "ENVMAP_BLENDING_MULTIPLY";
            break;
        case tC:
            e = "ENVMAP_BLENDING_MIX";
            break;
        case iC:
            e = "ENVMAP_BLENDING_ADD";
            break
        }
    return e
}
function _T(i) {
    const e = i.envMapCubeUVHeight;
    if (e === null)
        return null;
    const t = Math.log2(e) - 2,
        s = 1 / e;
    return {
        texelWidth: 1 / (3 * Math.max(Math.pow(2, t), 7 * 16)),
        texelHeight: s,
        maxMip: t
    }
}
function wT(i, e, t, s) {
    const n = i.getContext(),
        r = t.defines;
    let a = t.vertexShader,
        o = t.fragmentShader;
    const l = gT(t),
        c = vT(t),
        h = xT(t),
        d = yT(t),
        u = _T(t),
        f = cT(t),
        p = hT(r),
        A = n.createProgram();
    let m,
        g,
        x = t.glslVersion ? "#version " + t.glslVersion + `
        ` : "";
    t.isRawShaderMaterial ? (m = ["#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, p].filter(Tl).join(`
    `), m.length > 0 && (m += `
    `), g = ["#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, p].filter(Tl).join(`
    `), g.length > 0 && (g += `
    `)) : (m = [Xv(t), "#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, p, t.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "", t.batching ? "#define USE_BATCHING" : "", t.batchingColor ? "#define USE_BATCHING_COLOR" : "", t.instancing ? "#define USE_INSTANCING" : "", t.instancingColor ? "#define USE_INSTANCING_COLOR" : "", t.instancingMorph ? "#define USE_INSTANCING_MORPH" : "", t.useFog && t.fog ? "#define USE_FOG" : "", t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "", t.map ? "#define USE_MAP" : "", t.envMap ? "#define USE_ENVMAP" : "", t.envMap ? "#define " + h : "", t.lightMap ? "#define USE_LIGHTMAP" : "", t.aoMap ? "#define USE_AOMAP" : "", t.bumpMap ? "#define USE_BUMPMAP" : "", t.normalMap ? "#define USE_NORMALMAP" : "", t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "", t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "", t.displacementMap ? "#define USE_DISPLACEMENTMAP" : "", t.emissiveMap ? "#define USE_EMISSIVEMAP" : "", t.anisotropy ? "#define USE_ANISOTROPY" : "", t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "", t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "", t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "", t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "", t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "", t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "", t.specularMap ? "#define USE_SPECULARMAP" : "", t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "", t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "", t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "", t.metalnessMap ? "#define USE_METALNESSMAP" : "", t.alphaMap ? "#define USE_ALPHAMAP" : "", t.alphaHash ? "#define USE_ALPHAHASH" : "", t.transmission ? "#define USE_TRANSMISSION" : "", t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "", t.thicknessMap ? "#define USE_THICKNESSMAP" : "", t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "", t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "", t.mapUv ? "#define MAP_UV " + t.mapUv : "", t.alphaMapUv ? "#define ALPHAMAP_UV " + t.alphaMapUv : "", t.lightMapUv ? "#define LIGHTMAP_UV " + t.lightMapUv : "", t.aoMapUv ? "#define AOMAP_UV " + t.aoMapUv : "", t.emissiveMapUv ? "#define EMISSIVEMAP_UV " + t.emissiveMapUv : "", t.bumpMapUv ? "#define BUMPMAP_UV " + t.bumpMapUv : "", t.normalMapUv ? "#define NORMALMAP_UV " + t.normalMapUv : "", t.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + t.displacementMapUv : "", t.metalnessMapUv ? "#define METALNESSMAP_UV " + t.metalnessMapUv : "", t.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + t.roughnessMapUv : "", t.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + t.anisotropyMapUv : "", t.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + t.clearcoatMapUv : "", t.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + t.clearcoatNormalMapUv : "", t.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + t.clearcoatRoughnessMapUv : "", t.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + t.iridescenceMapUv : "", t.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + t.iridescenceThicknessMapUv : "", t.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + t.sheenColorMapUv : "", t.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + t.sheenRoughnessMapUv : "", t.specularMapUv ? "#define SPECULARMAP_UV " + t.specularMapUv : "", t.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + t.specularColorMapUv : "", t.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + t.specularIntensityMapUv : "", t.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + t.transmissionMapUv : "", t.thicknessMapUv ? "#define THICKNESSMAP_UV " + t.thicknessMapUv : "", t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "", t.vertexColors ? "#define USE_COLOR" : "", t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "", t.vertexUv1s ? "#define USE_UV1" : "", t.vertexUv2s ? "#define USE_UV2" : "", t.vertexUv3s ? "#define USE_UV3" : "", t.pointsUvs ? "#define USE_POINTS_UV" : "", t.flatShading ? "#define FLAT_SHADED" : "", t.skinning ? "#define USE_SKINNING" : "", t.morphTargets ? "#define USE_MORPHTARGETS" : "", t.morphNormals && t.flatShading === !1 ? "#define USE_MORPHNORMALS" : "", t.morphColors ? "#define USE_MORPHCOLORS" : "", t.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + t.morphTextureStride : "", t.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + t.morphTargetsCount : "", t.doubleSided ? "#define DOUBLE_SIDED" : "", t.flipSided ? "#define FLIP_SIDED" : "", t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", t.shadowMapEnabled ? "#define " + l : "", t.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "", t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "", t.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", "uniform mat4 modelMatrix;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat3 normalMatrix;", "uniform vec3 cameraPosition;", "uniform bool isOrthographic;", "#ifdef USE_INSTANCING", "	attribute mat4 instanceMatrix;", "#endif", "#ifdef USE_INSTANCING_COLOR", "	attribute vec3 instanceColor;", "#endif", "#ifdef USE_INSTANCING_MORPH", "	uniform sampler2D morphTexture;", "#endif", "attribute vec3 position;", "attribute vec3 normal;", "attribute vec2 uv;", "#ifdef USE_UV1", "	attribute vec2 uv1;", "#endif", "#ifdef USE_UV2", "	attribute vec2 uv2;", "#endif", "#ifdef USE_UV3", "	attribute vec2 uv3;", "#endif", "#ifdef USE_TANGENT", "	attribute vec4 tangent;", "#endif", "#if defined( USE_COLOR_ALPHA )", "	attribute vec4 color;", "#elif defined( USE_COLOR )", "	attribute vec3 color;", "#endif", "#ifdef USE_SKINNING", "	attribute vec4 skinIndex;", "	attribute vec4 skinWeight;", "#endif", `
    `].filter(Tl).join(`
    `), g = [Xv(t), "#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, p, t.useFog && t.fog ? "#define USE_FOG" : "", t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "", t.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "", t.map ? "#define USE_MAP" : "", t.matcap ? "#define USE_MATCAP" : "", t.envMap ? "#define USE_ENVMAP" : "", t.envMap ? "#define " + c : "", t.envMap ? "#define " + h : "", t.envMap ? "#define " + d : "", u ? "#define CUBEUV_TEXEL_WIDTH " + u.texelWidth : "", u ? "#define CUBEUV_TEXEL_HEIGHT " + u.texelHeight : "", u ? "#define CUBEUV_MAX_MIP " + u.maxMip + ".0" : "", t.lightMap ? "#define USE_LIGHTMAP" : "", t.aoMap ? "#define USE_AOMAP" : "", t.bumpMap ? "#define USE_BUMPMAP" : "", t.normalMap ? "#define USE_NORMALMAP" : "", t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "", t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "", t.emissiveMap ? "#define USE_EMISSIVEMAP" : "", t.anisotropy ? "#define USE_ANISOTROPY" : "", t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "", t.clearcoat ? "#define USE_CLEARCOAT" : "", t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "", t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "", t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "", t.dispersion ? "#define USE_DISPERSION" : "", t.iridescence ? "#define USE_IRIDESCENCE" : "", t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "", t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "", t.specularMap ? "#define USE_SPECULARMAP" : "", t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "", t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "", t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "", t.metalnessMap ? "#define USE_METALNESSMAP" : "", t.alphaMap ? "#define USE_ALPHAMAP" : "", t.alphaTest ? "#define USE_ALPHATEST" : "", t.alphaHash ? "#define USE_ALPHAHASH" : "", t.sheen ? "#define USE_SHEEN" : "", t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "", t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "", t.transmission ? "#define USE_TRANSMISSION" : "", t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "", t.thicknessMap ? "#define USE_THICKNESSMAP" : "", t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "", t.vertexColors || t.instancingColor || t.batchingColor ? "#define USE_COLOR" : "", t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "", t.vertexUv1s ? "#define USE_UV1" : "", t.vertexUv2s ? "#define USE_UV2" : "", t.vertexUv3s ? "#define USE_UV3" : "", t.pointsUvs ? "#define USE_POINTS_UV" : "", t.gradientMap ? "#define USE_GRADIENTMAP" : "", t.flatShading ? "#define FLAT_SHADED" : "", t.doubleSided ? "#define DOUBLE_SIDED" : "", t.flipSided ? "#define FLIP_SIDED" : "", t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", t.shadowMapEnabled ? "#define " + l : "", t.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "", t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "", t.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "", t.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", "uniform mat4 viewMatrix;", "uniform vec3 cameraPosition;", "uniform bool isOrthographic;", t.toneMapping !== dr ? "#define TONE_MAPPING" : "", t.toneMapping !== dr ? rt.tonemapping_pars_fragment : "", t.toneMapping !== dr ? lT("toneMapping", t.toneMapping) : "", t.dithering ? "#define DITHERING" : "", t.opaque ? "#define OPAQUE" : "", rt.colorspace_pars_fragment, oT("linearToOutputTexel", t.outputColorSpace), t.useDepthPacking ? "#define DEPTH_PACKING " + t.depthPacking : "", `
    `].filter(Tl).join(`
    `)),
    a = zp(a),
    a = Wv(a, t),
    a = Yv(a, t),
    o = zp(o),
    o = Wv(o, t),
    o = Yv(o, t),
    a = qv(a),
    o = qv(o),
    t.isRawShaderMaterial !== !0 && (x = `#version 300 es
    `, m = [f, "#define attribute in", "#define varying out", "#define texture2D texture"].join(`
    `) + `
    ` + m, g = ["#define varying in", t.glslVersion === cv ? "" : "layout(location = 0) out highp vec4 pc_fragColor;", t.glslVersion === cv ? "" : "#define gl_FragColor pc_fragColor", "#define gl_FragDepthEXT gl_FragDepth", "#define texture2D texture", "#define textureCube texture", "#define texture2DProj textureProj", "#define texture2DLodEXT textureLod", "#define texture2DProjLodEXT textureProjLod", "#define textureCubeLodEXT textureLod", "#define texture2DGradEXT textureGrad", "#define texture2DProjGradEXT textureProjGrad", "#define textureCubeGradEXT textureGrad"].join(`
    `) + `
    ` + g);
    const v = x + m + a,
        y = x + g + o,
        S = Hv(n, n.VERTEX_SHADER, v),
        w = Hv(n, n.FRAGMENT_SHADER, y);
    n.attachShader(A, S),
    n.attachShader(A, w),
    t.index0AttributeName !== void 0 ? n.bindAttribLocation(A, 0, t.index0AttributeName) : t.morphTargets === !0 && n.bindAttribLocation(A, 0, "position"),
    n.linkProgram(A);
    function C(I) {
        if (i.debug.checkShaderErrors) {
            const P = n.getProgramInfoLog(A).trim(),
                D = n.getShaderInfoLog(S).trim(),
                L = n.getShaderInfoLog(w).trim();
            let z = !0,
                O = !0;
            if (n.getProgramParameter(A, n.LINK_STATUS) === !1)
                if (z = !1, typeof i.debug.onShaderError == "function")
                    i.debug.onShaderError(n, A, S, w);
                else {
                    const K = Vv(n, S, "vertex"),
                        V = Vv(n, w, "fragment");
                    console.error("THREE.WebGLProgram: Shader Error " + n.getError() + " - VALIDATE_STATUS " + n.getProgramParameter(A, n.VALIDATE_STATUS) + `

                    Material Name: ` + I.name + `
                    Material Type: ` + I.type + `

                    Program Info Log: ` + P + `
                    ` + K + `
                    ` + V)
                }
            else
                P !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", P) : (D === "" || L === "") && (O = !1);
            O && (I.diagnostics = {
                runnable: z,
                programLog: P,
                vertexShader: {
                    log: D,
                    prefix: m
                },
                fragmentShader: {
                    log: L,
                    prefix: g
                }
            })
        }
        n.deleteShader(S),
        n.deleteShader(w),
        M = new Zh(n, A),
        E = uT(n, A)
    }
    let M;
    this.getUniforms = function() {
        return M === void 0 && C(this), M
    };
    let E;
    this.getAttributes = function() {
        return E === void 0 && C(this), E
    };
    let _ = t.rendererExtensionParallelShaderCompile === !1;
    return this.isReady = function() {
        return _ === !1 && (_ = n.getProgramParameter(A, sT)), _
    }, this.destroy = function() {
        s.releaseStatesOfProgram(this),
        n.deleteProgram(A),
        this.program = void 0
    }, this.type = t.shaderType, this.name = t.shaderName, this.id = nT++, this.cacheKey = e, this.usedTimes = 1, this.program = A, this.vertexShader = S, this.fragmentShader = w, this
}
let ET = 0;
class CT {
    constructor()
    {
        this.shaderCache = new Map,
        this.materialCache = new Map
    }
    update(e)
    {
        const t = e.vertexShader,
            s = e.fragmentShader,
            n = this._getShaderStage(t),
            r = this._getShaderStage(s),
            a = this._getShaderCacheForMaterial(e);
        return a.has(n) === !1 && (a.add(n), n.usedTimes++), a.has(r) === !1 && (a.add(r), r.usedTimes++), this
    }
    remove(e)
    {
        const t = this.materialCache.get(e);
        for (const s of t)
            s.usedTimes--,
            s.usedTimes === 0 && this.shaderCache.delete(s.code);
        return this.materialCache.delete(e), this
    }
    getVertexShaderID(e)
    {
        return this._getShaderStage(e.vertexShader).id
    }
    getFragmentShaderID(e)
    {
        return this._getShaderStage(e.fragmentShader).id
    }
    dispose()
    {
        this.shaderCache.clear(),
        this.materialCache.clear()
    }
    _getShaderCacheForMaterial(e)
    {
        const t = this.materialCache;
        let s = t.get(e);
        return s === void 0 && (s = new Set, t.set(e, s)), s
    }
    _getShaderStage(e)
    {
        const t = this.shaderCache;
        let s = t.get(e);
        return s === void 0 && (s = new ST(e), t.set(e, s)), s
    }
}
class ST {
    constructor(e)
    {
        this.id = ET++,
        this.code = e,
        this.usedTimes = 0
    }
}
function MT(i, e, t, s, n, r, a) {
    const o = new RA,
        l = new CT,
        c = new Set,
        h = [],
        d = n.logarithmicDepthBuffer,
        u = n.vertexTextures;
    let f = n.precision;
    const p = {
        MeshDepthMaterial: "depth",
        MeshDistanceMaterial: "distanceRGBA",
        MeshNormalMaterial: "normal",
        MeshBasicMaterial: "basic",
        MeshLambertMaterial: "lambert",
        MeshPhongMaterial: "phong",
        MeshToonMaterial: "toon",
        MeshStandardMaterial: "physical",
        MeshPhysicalMaterial: "physical",
        MeshMatcapMaterial: "matcap",
        LineBasicMaterial: "basic",
        LineDashedMaterial: "dashed",
        PointsMaterial: "points",
        ShadowMaterial: "shadow",
        SpriteMaterial: "sprite"
    };
    function A(E) {
        return c.add(E), E === 0 ? "uv" : `uv${E}`
    }
    function m(E, _, I, P, D) {
        const L = P.fog,
            z = D.geometry,
            O = E.isMeshStandardMaterial ? P.environment : null,
            K = (E.isMeshStandardMaterial ? t : e).get(E.envMap || O),
            V = K && K.mapping === _d ? K.image.height : null,
            pe = p[E.type];
        E.precision !== null && (f = n.getMaxPrecision(E.precision), f !== E.precision && console.warn("THREE.WebGLProgram.getParameters:", E.precision, "not supported, using", f, "instead."));
        const xe = z.morphAttributes.position || z.morphAttributes.normal || z.morphAttributes.color,
            Ae = xe !== void 0 ? xe.length : 0;
        let Ye = 0;
        z.morphAttributes.position !== void 0 && (Ye = 1),
        z.morphAttributes.normal !== void 0 && (Ye = 2),
        z.morphAttributes.color !== void 0 && (Ye = 3);
        let ke,
            J,
            ue,
            Pe;
        if (pe) {
            const Bt = $s[pe];
            ke = Bt.vertexShader,
            J = Bt.fragmentShader
        } else
            ke = E.vertexShader,
            J = E.fragmentShader,
            l.update(E),
            ue = l.getVertexShaderID(E),
            Pe = l.getFragmentShaderID(E);
        const Ee = i.getRenderTarget(),
            it = D.isInstancedMesh === !0,
            Ze = D.isBatchedMesh === !0,
            Qe = !!E.map,
            N = !!E.matcap,
            lt = !!K,
            ht = !!E.aoMap,
            St = !!E.lightMap,
            Ge = !!E.bumpMap,
            dt = !!E.normalMap,
            tt = !!E.displacementMap,
            $e = !!E.emissiveMap,
            Xt = !!E.metalnessMap,
            R = !!E.roughnessMap,
            T = E.anisotropy > 0,
            W = E.clearcoat > 0,
            se = E.dispersion > 0,
            ce = E.iridescence > 0,
            j = E.sheen > 0,
            we = E.transmission > 0,
            $ = T && !!E.anisotropyMap,
            oe = W && !!E.clearcoatMap,
            qe = W && !!E.clearcoatNormalMap,
            de = W && !!E.clearcoatRoughnessMap,
            me = ce && !!E.iridescenceMap,
            ye = ce && !!E.iridescenceThicknessMap,
            Ne = j && !!E.sheenColorMap,
            be = j && !!E.sheenRoughnessMap,
            st = !!E.specularMap,
            ft = !!E.specularColorMap,
            ni = !!E.specularIntensityMap,
            F = we && !!E.transmissionMap,
            Te = we && !!E.thicknessMap,
            ee = !!E.gradientMap,
            ne = !!E.alphaMap,
            _e = E.alphaTest > 0,
            je = !!E.alphaHash,
            xt = !!E.extensions;
        let ri = dr;
        E.toneMapped && (Ee === null || Ee.isXRRenderTarget === !0) && (ri = i.toneMapping);
        const pi = {
            shaderID: pe,
            shaderType: E.type,
            shaderName: E.name,
            vertexShader: ke,
            fragmentShader: J,
            defines: E.defines,
            customVertexShaderID: ue,
            customFragmentShaderID: Pe,
            isRawShaderMaterial: E.isRawShaderMaterial === !0,
            glslVersion: E.glslVersion,
            precision: f,
            batching: Ze,
            batchingColor: Ze && D._colorsTexture !== null,
            instancing: it,
            instancingColor: it && D.instanceColor !== null,
            instancingMorph: it && D.morphTexture !== null,
            supportsVertexTextures: u,
            outputColorSpace: Ee === null ? i.outputColorSpace : Ee.isXRRenderTarget === !0 ? Ee.texture.colorSpace : oi,
            alphaToCoverage: !!E.alphaToCoverage,
            map: Qe,
            matcap: N,
            envMap: lt,
            envMapMode: lt && K.mapping,
            envMapCubeUVHeight: V,
            aoMap: ht,
            lightMap: St,
            bumpMap: Ge,
            normalMap: dt,
            displacementMap: u && tt,
            emissiveMap: $e,
            normalMapObjectSpace: dt && E.normalMapType === _C,
            normalMapTangentSpace: dt && E.normalMapType === IA,
            metalnessMap: Xt,
            roughnessMap: R,
            anisotropy: T,
            anisotropyMap: $,
            clearcoat: W,
            clearcoatMap: oe,
            clearcoatNormalMap: qe,
            clearcoatRoughnessMap: de,
            dispersion: se,
            iridescence: ce,
            iridescenceMap: me,
            iridescenceThicknessMap: ye,
            sheen: j,
            sheenColorMap: Ne,
            sheenRoughnessMap: be,
            specularMap: st,
            specularColorMap: ft,
            specularIntensityMap: ni,
            transmission: we,
            transmissionMap: F,
            thicknessMap: Te,
            gradientMap: ee,
            opaque: E.transparent === !1 && E.blending === _o && E.alphaToCoverage === !1,
            alphaMap: ne,
            alphaTest: _e,
            alphaHash: je,
            combine: E.combine,
            mapUv: Qe && A(E.map.channel),
            aoMapUv: ht && A(E.aoMap.channel),
            lightMapUv: St && A(E.lightMap.channel),
            bumpMapUv: Ge && A(E.bumpMap.channel),
            normalMapUv: dt && A(E.normalMap.channel),
            displacementMapUv: tt && A(E.displacementMap.channel),
            emissiveMapUv: $e && A(E.emissiveMap.channel),
            metalnessMapUv: Xt && A(E.metalnessMap.channel),
            roughnessMapUv: R && A(E.roughnessMap.channel),
            anisotropyMapUv: $ && A(E.anisotropyMap.channel),
            clearcoatMapUv: oe && A(E.clearcoatMap.channel),
            clearcoatNormalMapUv: qe && A(E.clearcoatNormalMap.channel),
            clearcoatRoughnessMapUv: de && A(E.clearcoatRoughnessMap.channel),
            iridescenceMapUv: me && A(E.iridescenceMap.channel),
            iridescenceThicknessMapUv: ye && A(E.iridescenceThicknessMap.channel),
            sheenColorMapUv: Ne && A(E.sheenColorMap.channel),
            sheenRoughnessMapUv: be && A(E.sheenRoughnessMap.channel),
            specularMapUv: st && A(E.specularMap.channel),
            specularColorMapUv: ft && A(E.specularColorMap.channel),
            specularIntensityMapUv: ni && A(E.specularIntensityMap.channel),
            transmissionMapUv: F && A(E.transmissionMap.channel),
            thicknessMapUv: Te && A(E.thicknessMap.channel),
            alphaMapUv: ne && A(E.alphaMap.channel),
            vertexTangents: !!z.attributes.tangent && (dt || T),
            vertexColors: E.vertexColors,
            vertexAlphas: E.vertexColors === !0 && !!z.attributes.color && z.attributes.color.itemSize === 4,
            pointsUvs: D.isPoints === !0 && !!z.attributes.uv && (Qe || ne),
            fog: !!L,
            useFog: E.fog === !0,
            fogExp2: !!L && L.isFogExp2,
            flatShading: E.flatShading === !0,
            sizeAttenuation: E.sizeAttenuation === !0,
            logarithmicDepthBuffer: d,
            skinning: D.isSkinnedMesh === !0,
            morphTargets: z.morphAttributes.position !== void 0,
            morphNormals: z.morphAttributes.normal !== void 0,
            morphColors: z.morphAttributes.color !== void 0,
            morphTargetsCount: Ae,
            morphTextureStride: Ye,
            numDirLights: _.directional.length,
            numPointLights: _.point.length,
            numSpotLights: _.spot.length,
            numSpotLightMaps: _.spotLightMap.length,
            numRectAreaLights: _.rectArea.length,
            numHemiLights: _.hemi.length,
            numDirLightShadows: _.directionalShadowMap.length,
            numPointLightShadows: _.pointShadowMap.length,
            numSpotLightShadows: _.spotShadowMap.length,
            numSpotLightShadowsWithMaps: _.numSpotLightShadowsWithMaps,
            numLightProbes: _.numLightProbes,
            numClippingPlanes: a.numPlanes,
            numClipIntersection: a.numIntersection,
            dithering: E.dithering,
            shadowMapEnabled: i.shadowMap.enabled && I.length > 0,
            shadowMapType: i.shadowMap.type,
            toneMapping: ri,
            decodeVideoTexture: Qe && E.map.isVideoTexture === !0 && mt.getTransfer(E.map.colorSpace) === Ft,
            premultipliedAlpha: E.premultipliedAlpha,
            doubleSided: E.side === xi,
            flipSided: E.side === ei,
            useDepthPacking: E.depthPacking >= 0,
            depthPacking: E.depthPacking || 0,
            index0AttributeName: E.index0AttributeName,
            extensionClipCullDistance: xt && E.extensions.clipCullDistance === !0 && s.has("WEBGL_clip_cull_distance"),
            extensionMultiDraw: xt && E.extensions.multiDraw === !0 && s.has("WEBGL_multi_draw"),
            rendererExtensionParallelShaderCompile: s.has("KHR_parallel_shader_compile"),
            customProgramCacheKey: E.customProgramCacheKey()
        };
        return pi.vertexUv1s = c.has(1), pi.vertexUv2s = c.has(2), pi.vertexUv3s = c.has(3), c.clear(), pi
    }
    function g(E) {
        const _ = [];
        if (E.shaderID ? _.push(E.shaderID) : (_.push(E.customVertexShaderID), _.push(E.customFragmentShaderID)), E.defines !== void 0)
            for (const I in E.defines)
                _.push(I),
                _.push(E.defines[I]);
        return E.isRawShaderMaterial === !1 && (x(_, E), v(_, E), _.push(i.outputColorSpace)), _.push(E.customProgramCacheKey), _.join()
    }
    function x(E, _) {
        E.push(_.precision),
        E.push(_.outputColorSpace),
        E.push(_.envMapMode),
        E.push(_.envMapCubeUVHeight),
        E.push(_.mapUv),
        E.push(_.alphaMapUv),
        E.push(_.lightMapUv),
        E.push(_.aoMapUv),
        E.push(_.bumpMapUv),
        E.push(_.normalMapUv),
        E.push(_.displacementMapUv),
        E.push(_.emissiveMapUv),
        E.push(_.metalnessMapUv),
        E.push(_.roughnessMapUv),
        E.push(_.anisotropyMapUv),
        E.push(_.clearcoatMapUv),
        E.push(_.clearcoatNormalMapUv),
        E.push(_.clearcoatRoughnessMapUv),
        E.push(_.iridescenceMapUv),
        E.push(_.iridescenceThicknessMapUv),
        E.push(_.sheenColorMapUv),
        E.push(_.sheenRoughnessMapUv),
        E.push(_.specularMapUv),
        E.push(_.specularColorMapUv),
        E.push(_.specularIntensityMapUv),
        E.push(_.transmissionMapUv),
        E.push(_.thicknessMapUv),
        E.push(_.combine),
        E.push(_.fogExp2),
        E.push(_.sizeAttenuation),
        E.push(_.morphTargetsCount),
        E.push(_.morphAttributeCount),
        E.push(_.numDirLights),
        E.push(_.numPointLights),
        E.push(_.numSpotLights),
        E.push(_.numSpotLightMaps),
        E.push(_.numHemiLights),
        E.push(_.numRectAreaLights),
        E.push(_.numDirLightShadows),
        E.push(_.numPointLightShadows),
        E.push(_.numSpotLightShadows),
        E.push(_.numSpotLightShadowsWithMaps),
        E.push(_.numLightProbes),
        E.push(_.shadowMapType),
        E.push(_.toneMapping),
        E.push(_.numClippingPlanes),
        E.push(_.numClipIntersection),
        E.push(_.depthPacking)
    }
    function v(E, _) {
        o.disableAll(),
        _.supportsVertexTextures && o.enable(0),
        _.instancing && o.enable(1),
        _.instancingColor && o.enable(2),
        _.instancingMorph && o.enable(3),
        _.matcap && o.enable(4),
        _.envMap && o.enable(5),
        _.normalMapObjectSpace && o.enable(6),
        _.normalMapTangentSpace && o.enable(7),
        _.clearcoat && o.enable(8),
        _.iridescence && o.enable(9),
        _.alphaTest && o.enable(10),
        _.vertexColors && o.enable(11),
        _.vertexAlphas && o.enable(12),
        _.vertexUv1s && o.enable(13),
        _.vertexUv2s && o.enable(14),
        _.vertexUv3s && o.enable(15),
        _.vertexTangents && o.enable(16),
        _.anisotropy && o.enable(17),
        _.alphaHash && o.enable(18),
        _.batching && o.enable(19),
        _.dispersion && o.enable(20),
        _.batchingColor && o.enable(21),
        E.push(o.mask),
        o.disableAll(),
        _.fog && o.enable(0),
        _.useFog && o.enable(1),
        _.flatShading && o.enable(2),
        _.logarithmicDepthBuffer && o.enable(3),
        _.skinning && o.enable(4),
        _.morphTargets && o.enable(5),
        _.morphNormals && o.enable(6),
        _.morphColors && o.enable(7),
        _.premultipliedAlpha && o.enable(8),
        _.shadowMapEnabled && o.enable(9),
        _.doubleSided && o.enable(10),
        _.flipSided && o.enable(11),
        _.useDepthPacking && o.enable(12),
        _.dithering && o.enable(13),
        _.transmission && o.enable(14),
        _.sheen && o.enable(15),
        _.opaque && o.enable(16),
        _.pointsUvs && o.enable(17),
        _.decodeVideoTexture && o.enable(18),
        _.alphaToCoverage && o.enable(19),
        E.push(o.mask)
    }
    function y(E) {
        const _ = p[E.type];
        let I;
        if (_) {
            const P = $s[_];
            I = UA.clone(P.uniforms)
        } else
            I = E.uniforms;
        return I
    }
    function S(E, _) {
        let I;
        for (let P = 0, D = h.length; P < D; P++) {
            const L = h[P];
            if (L.cacheKey === _) {
                I = L,
                ++I.usedTimes;
                break
            }
        }
        return I === void 0 && (I = new wT(i, _, E, r), h.push(I)), I
    }
    function w(E) {
        if (--E.usedTimes === 0) {
            const _ = h.indexOf(E);
            h[_] = h[h.length - 1],
            h.pop(),
            E.destroy()
        }
    }
    function C(E) {
        l.remove(E)
    }
    function M() {
        l.dispose()
    }
    return {
        getParameters: m,
        getProgramCacheKey: g,
        getUniforms: y,
        acquireProgram: S,
        releaseProgram: w,
        releaseShaderCache: C,
        programs: h,
        dispose: M
    }
}
function bT() {
    let i = new WeakMap;
    function e(r) {
        let a = i.get(r);
        return a === void 0 && (a = {}, i.set(r, a)), a
    }
    function t(r) {
        i.delete(r)
    }
    function s(r, a, o) {
        i.get(r)[a] = o
    }
    function n() {
        i = new WeakMap
    }
    return {
        get: e,
        remove: t,
        update: s,
        dispose: n
    }
}
function TT(i, e) {
    return i.groupOrder !== e.groupOrder ? i.groupOrder - e.groupOrder : i.renderOrder !== e.renderOrder ? i.renderOrder - e.renderOrder : i.material.id !== e.material.id ? i.material.id - e.material.id : i.z !== e.z ? i.z - e.z : i.id - e.id
}
function Kv(i, e) {
    return i.groupOrder !== e.groupOrder ? i.groupOrder - e.groupOrder : i.renderOrder !== e.renderOrder ? i.renderOrder - e.renderOrder : i.z !== e.z ? e.z - i.z : i.id - e.id
}
function Jv() {
    const i = [];
    let e = 0;
    const t = [],
        s = [],
        n = [];
    function r() {
        e = 0,
        t.length = 0,
        s.length = 0,
        n.length = 0
    }
    function a(d, u, f, p, A, m) {
        let g = i[e];
        return g === void 0 ? (g = {
            id: d.id,
            object: d,
            geometry: u,
            material: f,
            groupOrder: p,
            renderOrder: d.renderOrder,
            z: A,
            group: m
        }, i[e] = g) : (g.id = d.id, g.object = d, g.geometry = u, g.material = f, g.groupOrder = p, g.renderOrder = d.renderOrder, g.z = A, g.group = m), e++, g
    }
    function o(d, u, f, p, A, m) {
        const g = a(d, u, f, p, A, m);
        f.transmission > 0 ? s.push(g) : f.transparent === !0 ? n.push(g) : t.push(g)
    }
    function l(d, u, f, p, A, m) {
        const g = a(d, u, f, p, A, m);
        f.transmission > 0 ? s.unshift(g) : f.transparent === !0 ? n.unshift(g) : t.unshift(g)
    }
    function c(d, u) {
        t.length > 1 && t.sort(d || TT),
        s.length > 1 && s.sort(u || Kv),
        n.length > 1 && n.sort(u || Kv)
    }
    function h() {
        for (let d = e, u = i.length; d < u; d++) {
            const f = i[d];
            if (f.id === null)
                break;
            f.id = null,
            f.object = null,
            f.geometry = null,
            f.material = null,
            f.group = null
        }
    }
    return {
        opaque: t,
        transmissive: s,
        transparent: n,
        init: r,
        push: o,
        unshift: l,
        finish: h,
        sort: c
    }
}
function IT() {
    let i = new WeakMap;
    function e(s, n) {
        const r = i.get(s);
        let a;
        return r === void 0 ? (a = new Jv, i.set(s, [a])) : n >= r.length ? (a = new Jv, r.push(a)) : a = r[n], a
    }
    function t() {
        i = new WeakMap
    }
    return {
        get: e,
        dispose: t
    }
}
function BT() {
    const i = {};
    return {
        get: function(e) {
            if (i[e.id] !== void 0)
                return i[e.id];
            let t;
            switch (e.type) {
            case "DirectionalLight":
                t = {
                    direction: new b,
                    color: new Z
                };
                break;
            case "SpotLight":
                t = {
                    position: new b,
                    direction: new b,
                    color: new Z,
                    distance: 0,
                    coneCos: 0,
                    penumbraCos: 0,
                    decay: 0
                };
                break;
            case "PointLight":
                t = {
                    position: new b,
                    color: new Z,
                    distance: 0,
                    decay: 0
                };
                break;
            case "HemisphereLight":
                t = {
                    direction: new b,
                    skyColor: new Z,
                    groundColor: new Z
                };
                break;
            case "RectAreaLight":
                t = {
                    color: new Z,
                    position: new b,
                    halfWidth: new b,
                    halfHeight: new b
                };
                break
            }
            return i[e.id] = t, t
        }
    }
}
function PT() {
    const i = {};
    return {
        get: function(e) {
            if (i[e.id] !== void 0)
                return i[e.id];
            let t;
            switch (e.type) {
            case "DirectionalLight":
                t = {
                    shadowBias: 0,
                    shadowNormalBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new H
                };
                break;
            case "SpotLight":
                t = {
                    shadowBias: 0,
                    shadowNormalBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new H
                };
                break;
            case "PointLight":
                t = {
                    shadowBias: 0,
                    shadowNormalBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new H,
                    shadowCameraNear: 1,
                    shadowCameraFar: 1e3
                };
                break
            }
            return i[e.id] = t, t
        }
    }
}
let DT = 0;
function RT(i, e) {
    return (e.castShadow ? 2 : 0) - (i.castShadow ? 2 : 0) + (e.map ? 1 : 0) - (i.map ? 1 : 0)
}
function UT(i) {
    const e = new BT,
        t = PT(),
        s = {
            version: 0,
            hash: {
                directionalLength: -1,
                pointLength: -1,
                spotLength: -1,
                rectAreaLength: -1,
                hemiLength: -1,
                numDirectionalShadows: -1,
                numPointShadows: -1,
                numSpotShadows: -1,
                numSpotMaps: -1,
                numLightProbes: -1
            },
            ambient: [0, 0, 0],
            probe: [],
            directional: [],
            directionalShadow: [],
            directionalShadowMap: [],
            directionalShadowMatrix: [],
            spot: [],
            spotLightMap: [],
            spotShadow: [],
            spotShadowMap: [],
            spotLightMatrix: [],
            rectArea: [],
            rectAreaLTC1: null,
            rectAreaLTC2: null,
            point: [],
            pointShadow: [],
            pointShadowMap: [],
            pointShadowMatrix: [],
            hemi: [],
            numSpotLightShadowsWithMaps: 0,
            numLightProbes: 0
        };
    for (let c = 0; c < 9; c++)
        s.probe.push(new b);
    const n = new b,
        r = new De,
        a = new De;
    function o(c) {
        let h = 0,
            d = 0,
            u = 0;
        for (let E = 0; E < 9; E++)
            s.probe[E].set(0, 0, 0);
        let f = 0,
            p = 0,
            A = 0,
            m = 0,
            g = 0,
            x = 0,
            v = 0,
            y = 0,
            S = 0,
            w = 0,
            C = 0;
        c.sort(RT);
        for (let E = 0, _ = c.length; E < _; E++) {
            const I = c[E],
                P = I.color,
                D = I.intensity,
                L = I.distance,
                z = I.shadow && I.shadow.map ? I.shadow.map.texture : null;
            if (I.isAmbientLight)
                h += P.r * D,
                d += P.g * D,
                u += P.b * D;
            else if (I.isLightProbe) {
                for (let O = 0; O < 9; O++)
                    s.probe[O].addScaledVector(I.sh.coefficients[O], D);
                C++
            } else if (I.isDirectionalLight) {
                const O = e.get(I);
                if (O.color.copy(I.color).multiplyScalar(I.intensity), I.castShadow) {
                    const K = I.shadow,
                        V = t.get(I);
                    V.shadowBias = K.bias,
                    V.shadowNormalBias = K.normalBias,
                    V.shadowRadius = K.radius,
                    V.shadowMapSize = K.mapSize,
                    s.directionalShadow[f] = V,
                    s.directionalShadowMap[f] = z,
                    s.directionalShadowMatrix[f] = I.shadow.matrix,
                    x++
                }
                s.directional[f] = O,
                f++
            } else if (I.isSpotLight) {
                const O = e.get(I);
                O.position.setFromMatrixPosition(I.matrixWorld),
                O.color.copy(P).multiplyScalar(D),
                O.distance = L,
                O.coneCos = Math.cos(I.angle),
                O.penumbraCos = Math.cos(I.angle * (1 - I.penumbra)),
                O.decay = I.decay,
                s.spot[A] = O;
                const K = I.shadow;
                if (I.map && (s.spotLightMap[S] = I.map, S++, K.updateMatrices(I), I.castShadow && w++), s.spotLightMatrix[A] = K.matrix, I.castShadow) {
                    const V = t.get(I);
                    V.shadowBias = K.bias,
                    V.shadowNormalBias = K.normalBias,
                    V.shadowRadius = K.radius,
                    V.shadowMapSize = K.mapSize,
                    s.spotShadow[A] = V,
                    s.spotShadowMap[A] = z,
                    y++
                }
                A++
            } else if (I.isRectAreaLight) {
                const O = e.get(I);
                O.color.copy(P).multiplyScalar(D),
                O.halfWidth.set(I.width * .5, 0, 0),
                O.halfHeight.set(0, I.height * .5, 0),
                s.rectArea[m] = O,
                m++
            } else if (I.isPointLight) {
                const O = e.get(I);
                if (O.color.copy(I.color).multiplyScalar(I.intensity), O.distance = I.distance, O.decay = I.decay, I.castShadow) {
                    const K = I.shadow,
                        V = t.get(I);
                    V.shadowBias = K.bias,
                    V.shadowNormalBias = K.normalBias,
                    V.shadowRadius = K.radius,
                    V.shadowMapSize = K.mapSize,
                    V.shadowCameraNear = K.camera.near,
                    V.shadowCameraFar = K.camera.far,
                    s.pointShadow[p] = V,
                    s.pointShadowMap[p] = z,
                    s.pointShadowMatrix[p] = I.shadow.matrix,
                    v++
                }
                s.point[p] = O,
                p++
            } else if (I.isHemisphereLight) {
                const O = e.get(I);
                O.skyColor.copy(I.color).multiplyScalar(D),
                O.groundColor.copy(I.groundColor).multiplyScalar(D),
                s.hemi[g] = O,
                g++
            }
        }
        m > 0 && (i.has("OES_texture_float_linear") === !0 ? (s.rectAreaLTC1 = Se.LTC_FLOAT_1, s.rectAreaLTC2 = Se.LTC_FLOAT_2) : (s.rectAreaLTC1 = Se.LTC_HALF_1, s.rectAreaLTC2 = Se.LTC_HALF_2)),
        s.ambient[0] = h,
        s.ambient[1] = d,
        s.ambient[2] = u;
        const M = s.hash;
        (M.directionalLength !== f || M.pointLength !== p || M.spotLength !== A || M.rectAreaLength !== m || M.hemiLength !== g || M.numDirectionalShadows !== x || M.numPointShadows !== v || M.numSpotShadows !== y || M.numSpotMaps !== S || M.numLightProbes !== C) && (s.directional.length = f, s.spot.length = A, s.rectArea.length = m, s.point.length = p, s.hemi.length = g, s.directionalShadow.length = x, s.directionalShadowMap.length = x, s.pointShadow.length = v, s.pointShadowMap.length = v, s.spotShadow.length = y, s.spotShadowMap.length = y, s.directionalShadowMatrix.length = x, s.pointShadowMatrix.length = v, s.spotLightMatrix.length = y + S - w, s.spotLightMap.length = S, s.numSpotLightShadowsWithMaps = w, s.numLightProbes = C, M.directionalLength = f, M.pointLength = p, M.spotLength = A, M.rectAreaLength = m, M.hemiLength = g, M.numDirectionalShadows = x, M.numPointShadows = v, M.numSpotShadows = y, M.numSpotMaps = S, M.numLightProbes = C, s.version = DT++)
    }
    function l(c, h) {
        let d = 0,
            u = 0,
            f = 0,
            p = 0,
            A = 0;
        const m = h.matrixWorldInverse;
        for (let g = 0, x = c.length; g < x; g++) {
            const v = c[g];
            if (v.isDirectionalLight) {
                const y = s.directional[d];
                y.direction.setFromMatrixPosition(v.matrixWorld),
                n.setFromMatrixPosition(v.target.matrixWorld),
                y.direction.sub(n),
                y.direction.transformDirection(m),
                d++
            } else if (v.isSpotLight) {
                const y = s.spot[f];
                y.position.setFromMatrixPosition(v.matrixWorld),
                y.position.applyMatrix4(m),
                y.direction.setFromMatrixPosition(v.matrixWorld),
                n.setFromMatrixPosition(v.target.matrixWorld),
                y.direction.sub(n),
                y.direction.transformDirection(m),
                f++
            } else if (v.isRectAreaLight) {
                const y = s.rectArea[p];
                y.position.setFromMatrixPosition(v.matrixWorld),
                y.position.applyMatrix4(m),
                a.identity(),
                r.copy(v.matrixWorld),
                r.premultiply(m),
                a.extractRotation(r),
                y.halfWidth.set(v.width * .5, 0, 0),
                y.halfHeight.set(0, v.height * .5, 0),
                y.halfWidth.applyMatrix4(a),
                y.halfHeight.applyMatrix4(a),
                p++
            } else if (v.isPointLight) {
                const y = s.point[u];
                y.position.setFromMatrixPosition(v.matrixWorld),
                y.position.applyMatrix4(m),
                u++
            } else if (v.isHemisphereLight) {
                const y = s.hemi[A];
                y.direction.setFromMatrixPosition(v.matrixWorld),
                y.direction.transformDirection(m),
                A++
            }
        }
    }
    return {
        setup: o,
        setupView: l,
        state: s
    }
}
function jv(i) {
    const e = new UT(i),
        t = [],
        s = [];
    function n(h) {
        c.camera = h,
        t.length = 0,
        s.length = 0
    }
    function r(h) {
        t.push(h)
    }
    function a(h) {
        s.push(h)
    }
    function o() {
        e.setup(t)
    }
    function l(h) {
        e.setupView(t, h)
    }
    const c = {
        lightsArray: t,
        shadowsArray: s,
        camera: null,
        lights: e,
        transmissionRenderTarget: {}
    };
    return {
        init: n,
        state: c,
        setupLights: o,
        setupLightsView: l,
        pushLight: r,
        pushShadow: a
    }
}
function LT(i) {
    let e = new WeakMap;
    function t(n, r=0) {
        const a = e.get(n);
        let o;
        return a === void 0 ? (o = new jv(i), e.set(n, [o])) : r >= a.length ? (o = new jv(i), a.push(o)) : o = a[r], o
    }
    function s() {
        e = new WeakMap
    }
    return {
        get: t,
        dispose: s
    }
}
class zy extends fs {
    constructor(e)
    {
        super(),
        this.isMeshDepthMaterial = !0,
        this.type = "MeshDepthMaterial",
        this.depthPacking = ms,
        this.map = null,
        this.alphaMap = null,
        this.displacementMap = null,
        this.displacementScale = 1,
        this.displacementBias = 0,
        this.wireframe = !1,
        this.wireframeLinewidth = 1,
        this.setValues(e)
    }
    copy(e)
    {
        return super.copy(e), this.depthPacking = e.depthPacking, this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this
    }
}
class FT extends fs {
    constructor(e)
    {
        super(),
        this.isMeshDistanceMaterial = !0,
        this.type = "MeshDistanceMaterial",
        this.map = null,
        this.alphaMap = null,
        this.displacementMap = null,
        this.displacementScale = 1,
        this.displacementBias = 0,
        this.setValues(e)
    }
    copy(e)
    {
        return super.copy(e), this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this
    }
}
const NT = `void main() {
    	gl_Position = vec4( position, 1.0 );
    }`,
    OT = `uniform sampler2D shadow_pass;
    uniform vec2 resolution;
    uniform float radius;
    #include <packing>
    void main() {
    	const float samples = float( VSM_SAMPLES );
    	float mean = 0.0;
    	float squared_mean = 0.0;
    	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
    	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
    	for ( float i = 0.0; i < samples; i ++ ) {
    		float uvOffset = uvStart + i * uvStride;
    		#ifdef HORIZONTAL_PASS
    			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
    			mean += distribution.x;
    			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
    		#else
    			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
    			mean += depth;
    			squared_mean += depth * depth;
    		#endif
    	}
    	mean = mean / samples;
    	squared_mean = squared_mean / samples;
    	float std_dev = sqrt( squared_mean - mean * mean );
    	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
    }`;
function kT(i, e, t) {
    let s = new Ed;
    const n = new H,
        r = new H,
        a = new yt,
        o = new zy({
            depthPacking: TA
        }),
        l = new FT,
        c = {},
        h = t.maxTextureSize,
        d = {
            [es]: ei,
            [ei]: es,
            [xi]: xi
        },
        u = new fe({
            defines: {
                VSM_SAMPLES: 8
            },
            uniforms: {
                shadow_pass: {
                    value: null
                },
                resolution: {
                    value: new H
                },
                radius: {
                    value: 4
                }
            },
            vertexShader: NT,
            fragmentShader: OT
        }),
        f = u.clone();
    f.defines.HORIZONTAL_PASS = 1;
    const p = new ot;
    p.setAttribute("position", new We(new Float32Array([-1, -1, .5, 3, -1, .5, -1, 3, .5]), 3));
    const A = new Ce(p, u),
        m = this;
    this.enabled = !1,
    this.autoUpdate = !0,
    this.needsUpdate = !1,
    this.type = oy;
    let g = this.type;
    this.render = function(w, C, M) {
        if (m.enabled === !1 || m.autoUpdate === !1 && m.needsUpdate === !1 || w.length === 0)
            return;
        const E = i.getRenderTarget(),
            _ = i.getActiveCubeFace(),
            I = i.getActiveMipmapLevel(),
            P = i.state;
        P.setBlending(qt),
        P.buffers.color.setClear(1, 1, 1, 1),
        P.buffers.depth.setTest(!0),
        P.setScissorTest(!1);
        const D = g !== _n && this.type === _n,
            L = g === _n && this.type !== _n;
        for (let z = 0, O = w.length; z < O; z++) {
            const K = w[z],
                V = K.shadow;
            if (V === void 0) {
                console.warn("THREE.WebGLShadowMap:", K, "has no shadow.");
                continue
            }
            if (V.autoUpdate === !1 && V.needsUpdate === !1)
                continue;
            n.copy(V.mapSize);
            const pe = V.getFrameExtents();
            if (n.multiply(pe), r.copy(V.mapSize), (n.x > h || n.y > h) && (n.x > h && (r.x = Math.floor(h / pe.x), n.x = r.x * pe.x, V.mapSize.x = r.x), n.y > h && (r.y = Math.floor(h / pe.y), n.y = r.y * pe.y, V.mapSize.y = r.y)), V.map === null || D === !0 || L === !0) {
                const Ae = this.type !== _n ? {
                    minFilter: gt,
                    magFilter: gt
                } : {};
                V.map !== null && V.map.dispose(),
                V.map = new vt(n.x, n.y, Ae),
                V.map.texture.name = K.name + ".shadowMap",
                V.camera.updateProjectionMatrix()
            }
            i.setRenderTarget(V.map),
            i.clear();
            const xe = V.getViewportCount();
            for (let Ae = 0; Ae < xe; Ae++) {
                const Ye = V.getViewport(Ae);
                a.set(r.x * Ye.x, r.y * Ye.y, r.x * Ye.z, r.y * Ye.w),
                P.viewport(a),
                V.updateMatrices(K, Ae),
                s = V.getFrustum(),
                y(C, M, V.camera, K, this.type)
            }
            V.isPointLightShadow !== !0 && this.type === _n && x(V, M),
            V.needsUpdate = !1
        }
        g = this.type,
        m.needsUpdate = !1,
        i.setRenderTarget(E, _, I)
    };
    function x(w, C) {
        const M = e.update(A);
        u.defines.VSM_SAMPLES !== w.blurSamples && (u.defines.VSM_SAMPLES = w.blurSamples, f.defines.VSM_SAMPLES = w.blurSamples, u.needsUpdate = !0, f.needsUpdate = !0),
        w.mapPass === null && (w.mapPass = new vt(n.x, n.y)),
        u.uniforms.shadow_pass.value = w.map.texture,
        u.uniforms.resolution.value = w.mapSize,
        u.uniforms.radius.value = w.radius,
        i.setRenderTarget(w.mapPass),
        i.clear(),
        i.renderBufferDirect(C, null, M, u, A, null),
        f.uniforms.shadow_pass.value = w.mapPass.texture,
        f.uniforms.resolution.value = w.mapSize,
        f.uniforms.radius.value = w.radius,
        i.setRenderTarget(w.map),
        i.clear(),
        i.renderBufferDirect(C, null, M, f, A, null)
    }
    function v(w, C, M, E) {
        let _ = null;
        const I = M.isPointLight === !0 ? w.customDistanceMaterial : w.customDepthMaterial;
        if (I !== void 0)
            _ = I;
        else if (_ = M.isPointLight === !0 ? l : o, i.localClippingEnabled && C.clipShadows === !0 && Array.isArray(C.clippingPlanes) && C.clippingPlanes.length !== 0 || C.displacementMap && C.displacementScale !== 0 || C.alphaMap && C.alphaTest > 0 || C.map && C.alphaTest > 0) {
            const P = _.uuid,
                D = C.uuid;
            let L = c[P];
            L === void 0 && (L = {}, c[P] = L);
            let z = L[D];
            z === void 0 && (z = _.clone(), L[D] = z, C.addEventListener("dispose", S)),
            _ = z
        }
        if (_.visible = C.visible, _.wireframe = C.wireframe, E === _n ? _.side = C.shadowSide !== null ? C.shadowSide : C.side : _.side = C.shadowSide !== null ? C.shadowSide : d[C.side], _.alphaMap = C.alphaMap, _.alphaTest = C.alphaTest, _.map = C.map, _.clipShadows = C.clipShadows, _.clippingPlanes = C.clippingPlanes, _.clipIntersection = C.clipIntersection, _.displacementMap = C.displacementMap, _.displacementScale = C.displacementScale, _.displacementBias = C.displacementBias, _.wireframeLinewidth = C.wireframeLinewidth, _.linewidth = C.linewidth, M.isPointLight === !0 && _.isMeshDistanceMaterial === !0) {
            const P = i.properties.get(_);
            P.light = M
        }
        return _
    }
    function y(w, C, M, E, _) {
        if (w.visible === !1)
            return;
        if (w.layers.test(C.layers) && (w.isMesh || w.isLine || w.isPoints) && (w.castShadow || w.receiveShadow && _ === _n) && (!w.frustumCulled || s.intersectsObject(w))) {
            w.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse, w.matrixWorld);
            const D = e.update(w),
                L = w.material;
            if (Array.isArray(L)) {
                const z = D.groups;
                for (let O = 0, K = z.length; O < K; O++) {
                    const V = z[O],
                        pe = L[V.materialIndex];
                    if (pe && pe.visible) {
                        const xe = v(w, pe, E, _);
                        w.onBeforeShadow(i, w, C, M, D, xe, V),
                        i.renderBufferDirect(M, null, D, xe, w, V),
                        w.onAfterShadow(i, w, C, M, D, xe, V)
                    }
                }
            } else if (L.visible) {
                const z = v(w, L, E, _);
                w.onBeforeShadow(i, w, C, M, D, z, null),
                i.renderBufferDirect(M, null, D, z, w, null),
                w.onAfterShadow(i, w, C, M, D, z, null)
            }
        }
        const P = w.children;
        for (let D = 0, L = P.length; D < L; D++)
            y(P[D], C, M, E, _)
    }
    function S(w) {
        w.target.removeEventListener("dispose", S);
        for (const M in c) {
            const E = c[M],
                _ = w.target.uuid;
            _ in E && (E[_].dispose(), delete E[_])
        }
    }
}
function zT(i) {
    function e() {
        let F = !1;
        const Te = new yt;
        let ee = null;
        const ne = new yt(0, 0, 0, 0);
        return {
            setMask: function(_e) {
                ee !== _e && !F && (i.colorMask(_e, _e, _e, _e), ee = _e)
            },
            setLocked: function(_e) {
                F = _e
            },
            setClear: function(_e, je, xt, ri, pi) {
                pi === !0 && (_e *= ri, je *= ri, xt *= ri),
                Te.set(_e, je, xt, ri),
                ne.equals(Te) === !1 && (i.clearColor(_e, je, xt, ri), ne.copy(Te))
            },
            reset: function() {
                F = !1,
                ee = null,
                ne.set(-1, 0, 0, 0)
            }
        }
    }
    function t() {
        let F = !1,
            Te = null,
            ee = null,
            ne = null;
        return {
            setTest: function(_e) {
                _e ? Pe(i.DEPTH_TEST) : Ee(i.DEPTH_TEST)
            },
            setMask: function(_e) {
                Te !== _e && !F && (i.depthMask(_e), Te = _e)
            },
            setFunc: function(_e) {
                if (ee !== _e) {
                    switch (_e) {
                    case uy:
                        i.depthFunc(i.NEVER);
                        break;
                    case dy:
                        i.depthFunc(i.ALWAYS);
                        break;
                    case Pp:
                        i.depthFunc(i.LESS);
                        break;
                    case pc:
                        i.depthFunc(i.LEQUAL);
                        break;
                    case ku:
                        i.depthFunc(i.EQUAL);
                        break;
                    case fy:
                        i.depthFunc(i.GEQUAL);
                        break;
                    case py:
                        i.depthFunc(i.GREATER);
                        break;
                    case bA:
                        i.depthFunc(i.NOTEQUAL);
                        break;
                    default:
                        i.depthFunc(i.LEQUAL)
                    }
                    ee = _e
                }
            },
            setLocked: function(_e) {
                F = _e
            },
            setClear: function(_e) {
                ne !== _e && (i.clearDepth(_e), ne = _e)
            },
            reset: function() {
                F = !1,
                Te = null,
                ee = null,
                ne = null
            }
        }
    }
    function s() {
        let F = !1,
            Te = null,
            ee = null,
            ne = null,
            _e = null,
            je = null,
            xt = null,
            ri = null,
            pi = null;
        return {
            setTest: function(Bt) {
                F || (Bt ? Pe(i.STENCIL_TEST) : Ee(i.STENCIL_TEST))
            },
            setMask: function(Bt) {
                Te !== Bt && !F && (i.stencilMask(Bt), Te = Bt)
            },
            setFunc: function(Bt, qs, Xs) {
                (ee !== Bt || ne !== qs || _e !== Xs) && (i.stencilFunc(Bt, qs, Xs), ee = Bt, ne = qs, _e = Xs)
            },
            setOp: function(Bt, qs, Xs) {
                (je !== Bt || xt !== qs || ri !== Xs) && (i.stencilOp(Bt, qs, Xs), je = Bt, xt = qs, ri = Xs)
            },
            setLocked: function(Bt) {
                F = Bt
            },
            setClear: function(Bt) {
                pi !== Bt && (i.clearStencil(Bt), pi = Bt)
            },
            reset: function() {
                F = !1,
                Te = null,
                ee = null,
                ne = null,
                _e = null,
                je = null,
                xt = null,
                ri = null,
                pi = null
            }
        }
    }
    const n = new e,
        r = new t,
        a = new s,
        o = new WeakMap,
        l = new WeakMap;
    let c = {},
        h = {},
        d = new WeakMap,
        u = [],
        f = null,
        p = !1,
        A = null,
        m = null,
        g = null,
        x = null,
        v = null,
        y = null,
        S = null,
        w = new Z(0, 0, 0),
        C = 0,
        M = !1,
        E = null,
        _ = null,
        I = null,
        P = null,
        D = null;
    const L = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    let z = !1,
        O = 0;
    const K = i.getParameter(i.VERSION);
    K.indexOf("WebGL") !== -1 ? (O = parseFloat(/^WebGL (\d)/.exec(K)[1]), z = O >= 1) : K.indexOf("OpenGL ES") !== -1 && (O = parseFloat(/^OpenGL ES (\d)/.exec(K)[1]), z = O >= 2);
    let V = null,
        pe = {};
    const xe = i.getParameter(i.SCISSOR_BOX),
        Ae = i.getParameter(i.VIEWPORT),
        Ye = new yt().fromArray(xe),
        ke = new yt().fromArray(Ae);
    function J(F, Te, ee, ne) {
        const _e = new Uint8Array(4),
            je = i.createTexture();
        i.bindTexture(F, je),
        i.texParameteri(F, i.TEXTURE_MIN_FILTER, i.NEAREST),
        i.texParameteri(F, i.TEXTURE_MAG_FILTER, i.NEAREST);
        for (let xt = 0; xt < ee; xt++)
            F === i.TEXTURE_3D || F === i.TEXTURE_2D_ARRAY ? i.texImage3D(Te, 0, i.RGBA, 1, 1, ne, 0, i.RGBA, i.UNSIGNED_BYTE, _e) : i.texImage2D(Te + xt, 0, i.RGBA, 1, 1, 0, i.RGBA, i.UNSIGNED_BYTE, _e);
        return je
    }
    const ue = {};
    ue[i.TEXTURE_2D] = J(i.TEXTURE_2D, i.TEXTURE_2D, 1),
    ue[i.TEXTURE_CUBE_MAP] = J(i.TEXTURE_CUBE_MAP, i.TEXTURE_CUBE_MAP_POSITIVE_X, 6),
    ue[i.TEXTURE_2D_ARRAY] = J(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1),
    ue[i.TEXTURE_3D] = J(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1),
    n.setClear(0, 0, 0, 1),
    r.setClear(1),
    a.setClear(0),
    Pe(i.DEPTH_TEST),
    r.setFunc(pc),
    Ge(!1),
    dt(Fg),
    Pe(i.CULL_FACE),
    ht(qt);
    function Pe(F) {
        c[F] !== !0 && (i.enable(F), c[F] = !0)
    }
    function Ee(F) {
        c[F] !== !1 && (i.disable(F), c[F] = !1)
    }
    function it(F, Te) {
        return h[F] !== Te ? (i.bindFramebuffer(F, Te), h[F] = Te, F === i.DRAW_FRAMEBUFFER && (h[i.FRAMEBUFFER] = Te), F === i.FRAMEBUFFER && (h[i.DRAW_FRAMEBUFFER] = Te), !0) : !1
    }
    function Ze(F, Te) {
        let ee = u,
            ne = !1;
        if (F) {
            ee = d.get(Te),
            ee === void 0 && (ee = [], d.set(Te, ee));
            const _e = F.textures;
            if (ee.length !== _e.length || ee[0] !== i.COLOR_ATTACHMENT0) {
                for (let je = 0, xt = _e.length; je < xt; je++)
                    ee[je] = i.COLOR_ATTACHMENT0 + je;
                ee.length = _e.length,
                ne = !0
            }
        } else
            ee[0] !== i.BACK && (ee[0] = i.BACK, ne = !0);
        ne && i.drawBuffers(ee)
    }
    function Qe(F) {
        return f !== F ? (i.useProgram(F), f = F, !0) : !1
    }
    const N = {
        [ar]: i.FUNC_ADD,
        [kE]: i.FUNC_SUBTRACT,
        [zE]: i.FUNC_REVERSE_SUBTRACT
    };
    N[QE] = i.MIN,
    N[GE] = i.MAX;
    const lt = {
        [HE]: i.ZERO,
        [VE]: i.ONE,
        [hy]: i.SRC_COLOR,
        [Ou]: i.SRC_ALPHA,
        [JE]: i.SRC_ALPHA_SATURATE,
        [XE]: i.DST_COLOR,
        [YE]: i.DST_ALPHA,
        [WE]: i.ONE_MINUS_SRC_COLOR,
        [Bp]: i.ONE_MINUS_SRC_ALPHA,
        [KE]: i.ONE_MINUS_DST_COLOR,
        [qE]: i.ONE_MINUS_DST_ALPHA,
        [jE]: i.CONSTANT_COLOR,
        [ZE]: i.ONE_MINUS_CONSTANT_COLOR,
        [$E]: i.CONSTANT_ALPHA,
        [eC]: i.ONE_MINUS_CONSTANT_ALPHA
    };
    function ht(F, Te, ee, ne, _e, je, xt, ri, pi, Bt) {
        if (F === qt) {
            p === !0 && (Ee(i.BLEND), p = !1);
            return
        }
        if (p === !1 && (Pe(i.BLEND), p = !0), F !== cy) {
            if (F !== A || Bt !== M) {
                if ((m !== ar || v !== ar) && (i.blendEquation(i.FUNC_ADD), m = ar, v = ar), Bt)
                    switch (F) {
                    case _o:
                        i.blendFuncSeparate(i.ONE, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
                        break;
                    case pt:
                        i.blendFunc(i.ONE, i.ONE);
                        break;
                    case Ng:
                        i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
                        break;
                    case Og:
                        i.blendFuncSeparate(i.ZERO, i.SRC_COLOR, i.ZERO, i.SRC_ALPHA);
                        break;
                    default:
                        console.error("THREE.WebGLState: Invalid blending: ", F);
                        break
                    }
                else
                    switch (F) {
                    case _o:
                        i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
                        break;
                    case pt:
                        i.blendFunc(i.SRC_ALPHA, i.ONE);
                        break;
                    case Ng:
                        i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
                        break;
                    case Og:
                        i.blendFunc(i.ZERO, i.SRC_COLOR);
                        break;
                    default:
                        console.error("THREE.WebGLState: Invalid blending: ", F);
                        break
                    }
                g = null,
                x = null,
                y = null,
                S = null,
                w.set(0, 0, 0),
                C = 0,
                A = F,
                M = Bt
            }
            return
        }
        _e = _e || Te,
        je = je || ee,
        xt = xt || ne,
        (Te !== m || _e !== v) && (i.blendEquationSeparate(N[Te], N[_e]), m = Te, v = _e),
        (ee !== g || ne !== x || je !== y || xt !== S) && (i.blendFuncSeparate(lt[ee], lt[ne], lt[je], lt[xt]), g = ee, x = ne, y = je, S = xt),
        (ri.equals(w) === !1 || pi !== C) && (i.blendColor(ri.r, ri.g, ri.b, pi), w.copy(ri), C = pi),
        A = F,
        M = !1
    }
    function St(F, Te) {
        F.side === xi ? Ee(i.CULL_FACE) : Pe(i.CULL_FACE);
        let ee = F.side === ei;
        Te && (ee = !ee),
        Ge(ee),
        F.blending === _o && F.transparent === !1 ? ht(qt) : ht(F.blending, F.blendEquation, F.blendSrc, F.blendDst, F.blendEquationAlpha, F.blendSrcAlpha, F.blendDstAlpha, F.blendColor, F.blendAlpha, F.premultipliedAlpha),
        r.setFunc(F.depthFunc),
        r.setTest(F.depthTest),
        r.setMask(F.depthWrite),
        n.setMask(F.colorWrite);
        const ne = F.stencilWrite;
        a.setTest(ne),
        ne && (a.setMask(F.stencilWriteMask), a.setFunc(F.stencilFunc, F.stencilRef, F.stencilFuncMask), a.setOp(F.stencilFail, F.stencilZFail, F.stencilZPass)),
        $e(F.polygonOffset, F.polygonOffsetFactor, F.polygonOffsetUnits),
        F.alphaToCoverage === !0 ? Pe(i.SAMPLE_ALPHA_TO_COVERAGE) : Ee(i.SAMPLE_ALPHA_TO_COVERAGE)
    }
    function Ge(F) {
        E !== F && (F ? i.frontFace(i.CW) : i.frontFace(i.CCW), E = F)
    }
    function dt(F) {
        F !== NE ? (Pe(i.CULL_FACE), F !== _ && (F === Fg ? i.cullFace(i.BACK) : F === OE ? i.cullFace(i.FRONT) : i.cullFace(i.FRONT_AND_BACK))) : Ee(i.CULL_FACE),
        _ = F
    }
    function tt(F) {
        F !== I && (z && i.lineWidth(F), I = F)
    }
    function $e(F, Te, ee) {
        F ? (Pe(i.POLYGON_OFFSET_FILL), (P !== Te || D !== ee) && (i.polygonOffset(Te, ee), P = Te, D = ee)) : Ee(i.POLYGON_OFFSET_FILL)
    }
    function Xt(F) {
        F ? Pe(i.SCISSOR_TEST) : Ee(i.SCISSOR_TEST)
    }
    function R(F) {
        F === void 0 && (F = i.TEXTURE0 + L - 1),
        V !== F && (i.activeTexture(F), V = F)
    }
    function T(F, Te, ee) {
        ee === void 0 && (V === null ? ee = i.TEXTURE0 + L - 1 : ee = V);
        let ne = pe[ee];
        ne === void 0 && (ne = {
            type: void 0,
            texture: void 0
        }, pe[ee] = ne),
        (ne.type !== F || ne.texture !== Te) && (V !== ee && (i.activeTexture(ee), V = ee), i.bindTexture(F, Te || ue[F]), ne.type = F, ne.texture = Te)
    }
    function W() {
        const F = pe[V];
        F !== void 0 && F.type !== void 0 && (i.bindTexture(F.type, null), F.type = void 0, F.texture = void 0)
    }
    function se() {
        try {
            i.compressedTexImage2D.apply(i, arguments)
        } catch (F) {
            console.error("THREE.WebGLState:", F)
        }
    }
    function ce() {
        try {
            i.compressedTexImage3D.apply(i, arguments)
        } catch (F) {
            console.error("THREE.WebGLState:", F)
        }
    }
    function j() {
        try {
            i.texSubImage2D.apply(i, arguments)
        } catch (F) {
            console.error("THREE.WebGLState:", F)
        }
    }
    function we() {
        try {
            i.texSubImage3D.apply(i, arguments)
        } catch (F) {
            console.error("THREE.WebGLState:", F)
        }
    }
    function $() {
        try {
            i.compressedTexSubImage2D.apply(i, arguments)
        } catch (F) {
            console.error("THREE.WebGLState:", F)
        }
    }
    function oe() {
        try {
            i.compressedTexSubImage3D.apply(i, arguments)
        } catch (F) {
            console.error("THREE.WebGLState:", F)
        }
    }
    function qe() {
        try {
            i.texStorage2D.apply(i, arguments)
        } catch (F) {
            console.error("THREE.WebGLState:", F)
        }
    }
    function de() {
        try {
            i.texStorage3D.apply(i, arguments)
        } catch (F) {
            console.error("THREE.WebGLState:", F)
        }
    }
    function me() {
        try {
            i.texImage2D.apply(i, arguments)
        } catch (F) {
            console.error("THREE.WebGLState:", F)
        }
    }
    function ye() {
        try {
            i.texImage3D.apply(i, arguments)
        } catch (F) {
            console.error("THREE.WebGLState:", F)
        }
    }
    function Ne(F) {
        Ye.equals(F) === !1 && (i.scissor(F.x, F.y, F.z, F.w), Ye.copy(F))
    }
    function be(F) {
        ke.equals(F) === !1 && (i.viewport(F.x, F.y, F.z, F.w), ke.copy(F))
    }
    function st(F, Te) {
        let ee = l.get(Te);
        ee === void 0 && (ee = new WeakMap, l.set(Te, ee));
        let ne = ee.get(F);
        ne === void 0 && (ne = i.getUniformBlockIndex(Te, F.name), ee.set(F, ne))
    }
    function ft(F, Te) {
        const ne = l.get(Te).get(F);
        o.get(Te) !== ne && (i.uniformBlockBinding(Te, ne, F.__bindingPointIndex), o.set(Te, ne))
    }
    function ni() {
        i.disable(i.BLEND),
        i.disable(i.CULL_FACE),
        i.disable(i.DEPTH_TEST),
        i.disable(i.POLYGON_OFFSET_FILL),
        i.disable(i.SCISSOR_TEST),
        i.disable(i.STENCIL_TEST),
        i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),
        i.blendEquation(i.FUNC_ADD),
        i.blendFunc(i.ONE, i.ZERO),
        i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO),
        i.blendColor(0, 0, 0, 0),
        i.colorMask(!0, !0, !0, !0),
        i.clearColor(0, 0, 0, 0),
        i.depthMask(!0),
        i.depthFunc(i.LESS),
        i.clearDepth(1),
        i.stencilMask(4294967295),
        i.stencilFunc(i.ALWAYS, 0, 4294967295),
        i.stencilOp(i.KEEP, i.KEEP, i.KEEP),
        i.clearStencil(0),
        i.cullFace(i.BACK),
        i.frontFace(i.CCW),
        i.polygonOffset(0, 0),
        i.activeTexture(i.TEXTURE0),
        i.bindFramebuffer(i.FRAMEBUFFER, null),
        i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null),
        i.bindFramebuffer(i.READ_FRAMEBUFFER, null),
        i.useProgram(null),
        i.lineWidth(1),
        i.scissor(0, 0, i.canvas.width, i.canvas.height),
        i.viewport(0, 0, i.canvas.width, i.canvas.height),
        c = {},
        V = null,
        pe = {},
        h = {},
        d = new WeakMap,
        u = [],
        f = null,
        p = !1,
        A = null,
        m = null,
        g = null,
        x = null,
        v = null,
        y = null,
        S = null,
        w = new Z(0, 0, 0),
        C = 0,
        M = !1,
        E = null,
        _ = null,
        I = null,
        P = null,
        D = null,
        Ye.set(0, 0, i.canvas.width, i.canvas.height),
        ke.set(0, 0, i.canvas.width, i.canvas.height),
        n.reset(),
        r.reset(),
        a.reset()
    }
    return {
        buffers: {
            color: n,
            depth: r,
            stencil: a
        },
        enable: Pe,
        disable: Ee,
        bindFramebuffer: it,
        drawBuffers: Ze,
        useProgram: Qe,
        setBlending: ht,
        setMaterial: St,
        setFlipSided: Ge,
        setCullFace: dt,
        setLineWidth: tt,
        setPolygonOffset: $e,
        setScissorTest: Xt,
        activeTexture: R,
        bindTexture: T,
        unbindTexture: W,
        compressedTexImage2D: se,
        compressedTexImage3D: ce,
        texImage2D: me,
        texImage3D: ye,
        updateUBOMapping: st,
        uniformBlockBinding: ft,
        texStorage2D: qe,
        texStorage3D: de,
        texSubImage2D: j,
        texSubImage3D: we,
        compressedTexSubImage2D: $,
        compressedTexSubImage3D: oe,
        scissor: Ne,
        viewport: be,
        reset: ni
    }
}
