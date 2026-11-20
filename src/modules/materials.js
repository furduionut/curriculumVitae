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

export const materials = {
    // Original keys retained for loaders.js and the other scenes.
    cloudDiffuse: whiteColor,
    lightBulbDiffuse: lavenderColor,
    lightBulbGlass: lightBlueColor,
    support: papper,
    model: glass,
    desk: wood,
    tube: clearGlass,
    glassPurple,
    glassEmmisive, // Existing spelling retained for compatibility.

    // New glow templates used by animations.js.
    logoBulbGlow,
    logoSegmentGlow,
};
