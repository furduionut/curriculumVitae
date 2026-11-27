import * as THREE from "three";
import { liquidGlassBackdropUniforms } from "./liquidGlass.js";
import { styles } from "./styles.js"; // Retained from the original module.

// The main logo palette. One hex change here updates all matching roles.
const logoPurple = new THREE.Color(0x8e93f8);
const logoWhite = new THREE.Color(0xffffff);

// Individual names let you customize each visual role later if you want.
export const logoColors = {
    segmentSurface: logoPurple.clone(),
    segmentGlow: new THREE.Color(0xffffff),
    glassReflection: logoPurple.clone(),
    segmentLit: logoWhite.clone(),
    segmentFallback: new THREE.Color(0xb57cff),
    bulbSurface: logoWhite.clone(),
    bulbGlow: logoWhite.clone(),
};

// Visual settings for the animated logo (not the animation timing).
// The gradient RGB is white; the SpriteMaterial color tints the segment halo purple.
export const logoEffects = {
    bulbGlow: {
        gradient: [
            [0,   "rgba(255,255,255,0.65)"],
            [0.1, "rgba(255,255,255,0.45)"],
            [0.4, "rgba(255,255,255,0.15)"],
            [1,   "rgba(255,255,255,0)"],
        ],
        scaleMultiplier: 3,
        renderOrder: 3,
    },
    segmentGlow: {
        gradient: [
            [0,   "rgba(255,255,255,0.18)"],
            [0.1, "rgba(255,255,255,0.14)"],
            [0.4, "rgba(255,255,255,0.09)"],
            [1,   "rgba(255,255,255,0)"],
        ],
        geometryRenderOrder: 10,
        renderOrder: 6,
        spacingDivisor: 36,
        diameter: 7.5,
        maxSprites: 90,
        opacityMultiplier: 0.6,
        maxOpacity: 0.08,
    },
    reflectionLight: {
        distance: 2.5,
        decay: 2,
        intensityMultiplier: 5,
        maxIntensityRatio: 1.4,
    },
};

const lavenderColor = new THREE.Color(0x6a76a6);
const lightBlueColor = new THREE.Color(0xc9b8ff);

const papper = new THREE.MeshStandardMaterial({
    color: "red",
    roughness: 1,
    envMapIntensity: 0.5,
});

const glass = new THREE.MeshPhysicalMaterial({
    color: "white",
    roughness: 0.1,
    metalness: 0.5,
    transmission: 1,
    thickness: 1.25,
    ior: 1.45,
    envMapIntensity: 2.75,
    transparent: true,
});

const wood = new THREE.MeshStandardMaterial({
    color: lavenderColor,
    roughness: 1,
    envMapIntensity: 0.01,
});

const whiteColor = new THREE.MeshBasicMaterial({
    color: "white",
});

const clearGlass = new THREE.MeshPhysicalMaterial({
    color: 0xe8eeff,
    transparent: true,
    opacity: 0.5,
    transmission: 0.35,
    roughness: 0.1,
    metalness: 0.1,
    clearcoat: 0.45,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.35,
    side: THREE.FrontSide,
    depthWrite: false,
    depthTest: true,
});

const glassPurple = new THREE.MeshBasicMaterial({
    color: logoColors.segmentSurface,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    depthTest: true,
    fog: false,
    toneMapped: false,
});

const glassEmmisive = new THREE.MeshBasicMaterial({
    color: logoColors.bulbSurface,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    depthTest: true,
    fog: false,
    toneMapped: false,
    side: THREE.DoubleSide,
});

// Glow material templates. Animation clones these for each Sprite, so each
// segment can change its opacity independently without affecting the others.
const logoBulbGlow = new THREE.SpriteMaterial({
    color: logoColors.bulbGlow,
    transparent: true,
    opacity: 1,
    blending: THREE.NormalBlending,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
});

const logoSegmentGlow = new THREE.SpriteMaterial({
    color: logoColors.segmentGlow,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
});


/* LIQUID GLASS — PAGE LAYOUT + ARCHITECTURAL CONTEXT */

// The physical layer supplies a restrained HDRI highlight. The screen-space
// shader supplies the actual frosted backdrop, CSS-inspired gradient and rim.
const blurredGlassSettings = {
    color: 0xcbd6ff,
    metalness: 0,
    roughness: 0.72,
    transmission: 0,
    ior: 1.46,
    specularIntensity: 0.35,
    envMapIntensity: 0.65,
    clearcoat: 0,
    flatShading: false,
    transparent: true,
    // 1 displays the already blurred background. Reduce for a subtle mix
    // with the unfiltered scene, or if you want to see more overlapping glass.
    opacity: 1, // Overall glass opacity: 1 = full filtered backdrop; 0 = invisible.
    depthWrite: true,
    depthTest: true,
    side: THREE.FrontSide,
};

export const blurredGlassGradient = {
    light: new THREE.Color(0xe2e8ff),
    middle: new THREE.Color(0xa6b3e4),
    dark: new THREE.Color(0x7889c4),
    saturation: 1.70, // CSS saturate(170%)
    strength: 0.12,   // lavender color tint
    gradientStrength: 1.0, // CSS diagonal white overlay
    sheenStrength: 0.75,   // CSS ::before illumination
    rimStrength: 0.28,     // soft Fresnel edge light
    contourStrength: 0.52, // white gradient contour; 0 disables it
    contourWidth: 0.38,    // wider = softer/broader grazing-angle highlight
    reflectionStrength: 0.12, // retain a small amount of animated HDRI lighting
    fallbackSpan: 2.5,
};

// Subclass so material clones created by commonScene/contextScene retain the shader.
class BlurredGlassMaterial extends THREE.MeshPhysicalMaterial {
    constructor(parameters = blurredGlassSettings) {
        super(parameters);
        this.name = 'BlurredGlass';
        this.userData.liquidGlassBackdrop = true;
    }

    customProgramCacheKey() { return 'liquid-glass-backdrop-v8-layered'; }

    onBeforeCompile(shader) {
        const v = shader.vertexShader;
        const f = shader.fragmentShader;
        if (!v.includes('#include <common>') ||
            !v.includes('#include <project_vertex>') ||
            !f.includes('#include <common>') ||
            !f.includes('#include <color_fragment>') ||
            !f.includes('#include <opaque_fragment>')) {
            console.warn('[LiquidGlass] Unexpected shader layout; using physical fallback.');
            return;
        }
        const g = blurredGlassGradient;
        Object.assign(shader.uniforms, liquidGlassBackdropUniforms, {
            uGlassLight: { value: g.light },
            uGlassMiddle: { value: g.middle },
            uGlassDark: { value: g.dark },
            uGlassSaturation: { value: g.saturation },
            uGlassGradientStrength: { value: g.gradientStrength },
            uGlassTintStrength: { value: g.strength },
            uGlassSheenStrength: { value: g.sheenStrength },
            uGlassRimStrength: { value: g.rimStrength },
            uGlassContourStrength: { value: g.contourStrength },
            uGlassContourWidth: { value: g.contourWidth },
            uGlassReflectionStrength: { value: g.reflectionStrength },
            uGlassGradientSpan: { value: g.fallbackSpan },
        });

        shader.vertexShader = v
            .replace('#include <common>', `#include <common>
                attribute float lgBackdropLayer;
                varying vec4 vGlassClip;
                varying vec3 vGlassRelativeView;
                varying float vLGBackdropLayer;
            `)
            .replace('#include <project_vertex>', `#include <project_vertex>
                vGlassClip = gl_Position;
                vLGBackdropLayer = lgBackdropLayer;
                vGlassRelativeView = (modelViewMatrix * vec4(transformed, 0.0)).xyz;
            `);

        shader.fragmentShader = f
            .replace('#include <common>', `#include <common>
                varying vec4 vGlassClip;
                varying vec3 vGlassRelativeView;
                varying float vLGBackdropLayer;
                uniform sampler2D uLGBackdrop;
                uniform sampler2D uLGBackdrop1, uLGBackdrop2, uLGBackdrop3;
                uniform float uLGReady;
                uniform vec3 uGlassLight, uGlassMiddle, uGlassDark;
                uniform float uGlassSaturation, uGlassGradientStrength;
                uniform float uGlassTintStrength, uGlassSheenStrength;
                uniform float uGlassRimStrength, uGlassReflectionStrength;
                uniform float uGlassContourStrength, uGlassContourWidth;
                uniform float uGlassGradientSpan;

                // Approximate display-space CSS color compositing. Convert the
                // result back to linear before Three.js post-processing.
                vec3 lgDisplay(vec3 c) { return pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2)); }
                vec3 lgLinear(vec3 c) { return pow(clamp(c, 0.0, 1.0), vec3(2.2)); }
                float lgGradient(float t) {
                    if (t < 0.35) return mix(0.30, 0.14, t / 0.35);
                    if (t < 0.80) return mix(0.14, 0.06, (t - 0.35) / 0.45);
                    return mix(0.06, 0.18, (t - 0.80) / 0.20);
                }
            `)
            // Vertex colors on the common scene encode gradient coordinates.
            .replace('#include <color_fragment>', '')
            .replace('#include <opaque_fragment>', `
                if (uLGReady > 0.5) {
                    vec2 lgUV = vGlassClip.xy / max(vGlassClip.w, 0.00001) * 0.5 + 0.5;
                    lgUV = clamp(lgUV, 0.0, 1.0);
                    vec3 lgSample;
                    if (vLGBackdropLayer < 0.5) lgSample = texture2D(uLGBackdrop, lgUV).rgb;
                    else if (vLGBackdropLayer < 1.5) lgSample = texture2D(uLGBackdrop1, lgUV).rgb;
                    else if (vLGBackdropLayer < 2.5) lgSample = texture2D(uLGBackdrop2, lgUV).rgb;
                    else lgSample = texture2D(uLGBackdrop3, lgUV).rgb;
                    vec3 lgBG = lgDisplay(lgSample);
                    float lgLuma = dot(lgBG, vec3(0.2126, 0.7152, 0.0722));
                    lgBG = clamp(mix(vec3(lgLuma), lgBG, uGlassSaturation), 0.0, 1.0);

                    // Context buildings use view-relative coordinates; desk accessories
                    // supply normalized object-local coordinates via their existing attribute.
                    vec2 q = vGlassRelativeView.xy / max(uGlassGradientSpan, 0.001);
                    vec2 panelUV = 0.5 + 0.5 * q / (vec2(1.0) + abs(q));
                    float d = dot(vGlassRelativeView, vec3(-0.45, 0.75, 0.20));
                    float t = 0.5 + 0.5 * d / (abs(d) + max(uGlassGradientSpan, 0.001));
                    #if defined(USE_COLOR) || defined(USE_COLOR_ALPHA)
                        t = vColor.r;
                        panelUV = vColor.gb;
                    #endif
                    t = clamp(t, 0.0, 1.0);
                    panelUV = clamp(panelUV, 0.0, 1.0);

                    vec3 lgTint = mix(uGlassDark, uGlassMiddle, smoothstep(0.0, 0.60, t));
                    lgTint = mix(lgTint, uGlassLight, smoothstep(0.42, 1.0, t));
                    lgBG = mix(lgBG, lgDisplay(lgTint), uGlassTintStrength);
                    // The four stops from --glass-gradient.
                    lgBG = mix(lgBG, vec3(1.0), clamp(lgGradient(1.0 - t) * uGlassGradientStrength, 0.0, 1.0));
                    // The top-left radial sheen and top/bottom wash from .glass::before.
                    float radial = length((panelUV - vec2(0.20, 1.0)) / vec2(1.0, 0.65));
                    float sheen = 0.38 * (1.0 - smoothstep(0.0, 0.75, radial));
                    sheen += 0.24 * smoothstep(0.62, 1.0, panelUV.y);
                    sheen += 0.08 * (1.0 - smoothstep(0.0, 0.15, panelUV.y));
                    lgBG = mix(lgBG, vec3(1.0), clamp(sheen * uGlassSheenStrength, 0.0, 1.0));

                    vec3 lgView = isOrthographic ? vec3(0.0, 0.0, 1.0) : normalize(vViewPosition);
                    float facing = clamp(dot(normalize(normal), lgView), 0.0, 1.0);
                    float rim = pow(1.0 - facing, 2.3);
                    lgBG = mix(lgBG, vec3(1.0), rim * uGlassRimStrength);

                    // Retain a restrained physical lighting contribution, not sharp
                    // overpowering HDRI highlights. The logo uses a different material.
                    outgoingLight = mix(lgLinear(lgBG), clamp(outgoingLight, 0.0, 1.0), uGlassReflectionStrength);

                    // CSS-inspired white edge highlight, fading diagonally and
                    // with the orientation of the surface. No extra line mesh.
                    // A broad smoothstep avoids a hard, uniformly bright outline.
                    float contourWidth = clamp(uGlassContourWidth, 0.02, 0.95);
                    float contourRim = 1.0 - smoothstep(0.0, contourWidth, facing);
                    vec2 screenLight = normalize(vec2(-0.65, 0.85));
                    float lightSide = 0.5 + 0.5 * dot(normalize(normal).xy, screenLight);
                    float directionalFade = smoothstep(0.32, 0.88, lightSide);
                    float positionFade = smoothstep(0.18, 0.85, t);
                    float contour = contourRim * directionalFade * positionFade;
                    vec3 contourColor = lgDisplay(outgoingLight);
                    contourColor = mix(contourColor, vec3(1.0),
                        clamp(contour * uGlassContourStrength, 0.0, 1.0));
                    outgoingLight = lgLinear(contourColor);
                } else {
                    // The original alpha-blended material remains a safe initial fallback.
                    diffuseColor.a *= 0.45;
                }
                #include <opaque_fragment>
            `);
    }
}

const blurredGlass = new BlurredGlassMaterial();

/* LAMP BEAM — a separate, luminous material, not liquid glass. */
const lampBeam = new THREE.ShaderMaterial({
    name: 'LampBeam',
    uniforms: {
        uBeamColor: { value: new THREE.Color(0xe4edff) },
        uBeamPower: { value: 0 },        // controlled by GSAP
        uBeamOpacity: { value: 1.0 },    // maximum alpha at the lamp head
        uBeamIntensity: { value: 2.2 },  // light brightness / existing bloom
        uBeamFalloff: { value: 2.0 },    // 1 = linear; >1 fades faster
        uBeamEdgeSoftness: { value: 0.85 }, // 0 = solid edges; 1 = soft edges
    },
    vertexShader: `
        attribute float lampBeamT;
        varying float vBeamT;
        varying vec3 vBeamNormal;
        varying vec3 vBeamView;
        void main() {
            vBeamT = lampBeamT;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vBeamNormal = normalMatrix * normal;
            vBeamView = -mv.xyz;
            gl_Position = projectionMatrix * mv;
        }
    `,
    fragmentShader: `
        uniform vec3 uBeamColor;
        uniform float uBeamPower, uBeamOpacity, uBeamIntensity;
        uniform float uBeamFalloff, uBeamEdgeSoftness;
        varying float vBeamT;
        varying vec3 vBeamNormal;
        varying vec3 vBeamView;
        void main() {
            float t = clamp(vBeamT, 0.0, 1.0);
            float fade = pow(1.0 - t, max(uBeamFalloff, 0.01));
            // Fade grazing-angle edges to mimic soft light scattering.
            float facing = abs(dot(normalize(vBeamNormal), normalize(vBeamView)));
            float edge = mix(1.0, smoothstep(0.0, 0.72, facing),
                             clamp(uBeamEdgeSoftness, 0.0, 1.0));
            float alpha = clamp(fade * edge * uBeamPower * uBeamOpacity, 0.0, 1.0);
            if (alpha < 0.001) discard;
            gl_FragColor = vec4(uBeamColor * uBeamIntensity, alpha);
            #include <colorspace_fragment>
        }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    forceSinglePass: true,
    toneMapped: false,
});

export const materials = {
    lampBeam, // luminous gradient cone

    // General materials
    cloudDiffuse: whiteColor,
    lightBulbDiffuse: lavenderColor,
    lightBulbGlass: lightBlueColor,
    support: papper,
    model: glass,
    desk: wood,
    tube: clearGlass,

    // Page layout materials
    blurredGlass,

    // Logo materials
    glassPurple,
    glassEmmisive,
    logoBulbGlow,
    logoSegmentGlow,

};

// ARCHITECTURAL CONTEXT MATERIALS
// Neighbours use the same blurred glass preset as the page layout.
// Terrain lines retain their independent appearance settings.
export const contextAppearance = {
    neighbours: blurredGlassSettings,
    terrainLines: {
        color: 0x45536b,
        dashSize: 3.5,            // local GLB units; GLB root is scaled by 0.1
        gapSize: 2.0,
        opacity: 0.85,
        scale: 1
    }
};

export function createContextBuildingMaterial() {
    // Independent instance: context animations/disposal must not affect pageLayout.
    return materials.blurredGlass.clone();
}

export function createContextLineMaterial() {
    return new THREE.LineDashedMaterial({
        ...contextAppearance.terrainLines,
        transparent: true,
        opacity: 0,
        depthTest: true,
        depthWrite: false
    });
}

/* =====================================================
   PAGE LAYOUT — FROSTED GLASS
   ===================================================== */

export const pageLayoutAppearance = {

    glass: blurredGlassSettings,

    excludedObjects: [
        "deskPlane",
        "pictureFrame"
    ]
};


/* CREATE GLASS MATERIAL */

export function createPageLayoutGlassMaterial() {

    return materials.blurredGlass.clone();

}


/* APPLY GLASS TO PAGE LAYOUT */

export function applyPageLayoutMaterials(root) {

    const normalizeName = name =>
        name.toLowerCase().replace(/[^a-z0-9]/g, "");

    const excludedNames =
        pageLayoutAppearance.excludedObjects.map(normalizeName);

    function isExcluded(object) {

        let current = object;

        while (current && current !== root) {

            const name = normalizeName(current.name);

            if (
                excludedNames.some(
                    excluded => name.startsWith(excluded)
                )
            ) {
                return true;
            }

            current = current.parent;

        }

        return false;

    }

    const glass = createPageLayoutGlassMaterial();

    root.traverse(child => {

        if (!child.isMesh) return;
        if (isExcluded(child)) return;

        child.material = glass;

        child.castShadow = false;

        console.log(
            "[PageLayout] Frosted glass applied:",
            child.name
        );

    });

}