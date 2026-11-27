// Single source of truth for the three per-house context GLBs.
// These files live in public/assets/meshes/mainScene/ (Vite serves public/ at /).
export const CONTEXT_FILES = Object.freeze({
    C: './assets/meshes/mainScene/context_C.glb', // Casa Clim
    B: './assets/meshes/mainScene/context_B.glb', // Casa Bacau
    S: './assets/meshes/mainScene/context_S.glb'  // Casa Stolnicu
});

// projects.js lists the houses in this order: Bacau, Clim, Stolnicu.
// The first context is visible even if the primary house GLB finishes loading later.
export const DEFAULT_CONTEXT_KEY = 'B';

// Keep these in the same 0..8413 REFERENCE_SCROLL units as scripts.js.
export const CONTEXT_ANIMATION = Object.freeze({
    referenceScroll: 8413,
    popStart: 1837,
    popEnd: 1900,
    smoothSeconds: 0.70,
    switchDuration: 1.20,
    switchStagger: 0.045,
    curveFadeSeconds: 0.90,
    exitSeconds: 0.30,
    sceneScale: 0.1 // same as the original pageLayout.glb
});

// Resolve the context WITHOUT depending on the order of objects.buildingsList.
// Configure this list only if your building paths don't contain these folder names.
const projectPathMatchers = [
    { key: 'C', patterns: [/casaclim/i, /casa[_-]?c(?:\.|\/|_)/i, /clim/i] },
    { key: 'B', patterns: [/casabacau/i, /casa[_-]?b(?:\.|\/|_)/i, /bacau/i, /bacău/i] },
    { key: 'S', patterns: [/casastolnicu/i, /casa[_-]?s(?:\.|\/|_)/i, /stolnicu/i] }
];

export function contextKeyFromProjectPath(path) {
    if (typeof path !== 'string') return null;
    const normalized = path.toLowerCase();
    return projectPathMatchers.find(({ patterns }) => patterns.some(re => re.test(normalized)))?.key ?? null;
}
