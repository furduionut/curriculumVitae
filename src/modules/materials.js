import * as THREE from "three";
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


/* BLURRED GLASS — PAGE LAYOUT + ARCHITECTURAL CONTEXT */

const blurredGlassSettings = {

    // Surface appearance
    color: 0xf0f2ff,
    metalness: 0.0,
    roughness: 0.35,

    // Optical properties
    transmission: 1.0,
    thickness: 0.8,
    ior: 1.46,

    // Volumetric color absorption
    attenuationColor: 0xd5d9ff,
    attenuationDistance: 4.0,

    // Surface reflections
    specularIntensity: 1.0,
    specularColor: 0xffffff,
    envMapIntensity: 1.8,

    // Polished surface layer
    clearcoat: 1.0,
    clearcoatRoughness: 0.12,

    // Rendering
    transparent: false,
    opacity: 1.0,
    depthWrite: true,
    depthTest: true,
    side: THREE.FrontSide

};

const blurredGlass = new THREE.MeshPhysicalMaterial(blurredGlassSettings);

export const materials = {

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

    glass: {
        color: 0xe2e6ff,

        metalness: 0.0,
        roughness: 0.32,

        transmission: 1.0,
        thickness: 0.5,
        ior: 1.46,

        attenuationColor: 0xc3c9f5,
        attenuationDistance: 5.0,

        clearcoat: 0.65,
        clearcoatRoughness: 0.16,

        envMapIntensity: 1.65,

        specularIntensity: 1.0,
        specularColor: 0xffffff
    },

    excludedObjects: [
        "deskPlane",
        "pictureFrame"
    ]
};


/* CREATE GLASS MATERIAL */

export function createPageLayoutGlassMaterial() {

    return new THREE.MeshPhysicalMaterial({

        ...pageLayoutAppearance.glass,

        transparent: false,
        opacity: 1,

        depthWrite: true,
        depthTest: true,

        side: THREE.FrontSide

    });

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