import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { contextAppearance, createContextLineMaterial } from './materials.js';
import { CONTEXT_ANIMATION } from './contextConfig.js';

// Add a path-space reveal to the existing LineMaterial shader. The extra
// attributes are static; only one scalar uniform changes per draw.
function enableTerrainReveal(material) {
    material.userData.terrainNoBloom = true;
    if (material.uniforms.uTerrainRevealProgress) return true;
    const main = /void\s+main\s*\(\s*\)\s*\{/;
    const output = '#include <tonemapping_fragment>';
    if (!main.test(material.vertexShader) || !main.test(material.fragmentShader) ||
        !material.fragmentShader.includes(output)) {
        console.warn('[Terrain] Unknown LineMaterial shader; using regular fade.');
        return false;
    }
    material.uniforms.uTerrainRevealProgress = { value: 1 };
    material.uniforms.uTerrainRevealFeather = { value: 0.10 };
    material.vertexShader = material.vertexShader.replace(main, match => `
        attribute float instanceRevealStart;
        attribute float instanceRevealEnd;
        varying float vTerrainPathT;
        ${match}
        vTerrainPathT = (position.y < 0.5) ? instanceRevealStart : instanceRevealEnd;
    `);
    material.fragmentShader = material.fragmentShader
        .replace(main, match => `
            varying float vTerrainPathT;
            uniform float uTerrainRevealProgress;
            uniform float uTerrainRevealFeather;
            ${match}
        `)
        .replace(output, `
            if (uTerrainRevealProgress <= 0.0) discard;
            float terrainDistance = abs(vTerrainPathT * 2.0 - 1.0);
            float terrainFeather = max(uTerrainRevealFeather, 0.001);
            float terrainRadius = uTerrainRevealProgress * (1.0 + terrainFeather);
            float terrainMask = 1.0 - smoothstep(terrainRadius - terrainFeather,
                                                terrainRadius, terrainDistance);
            if (terrainMask < 0.001) discard;
            gl_FragColor.a *= terrainMask;
            ${output}
        `);
    material.needsUpdate = true;
    return true;
}

function addRevealAttributes(geometry, path) {
    const distances = new Float64Array(path.length);
    for (let i = 1; i < path.length; i++) {
        distances[i] = distances[i - 1] + path[i - 1].distanceTo(path[i]);
    }
    const length = Math.max(distances[distances.length - 1], 1e-8);
    const start = new Float32Array(path.length - 1);
    const end = new Float32Array(path.length - 1);
    for (let i = 0; i < start.length; i++) {
        start[i] = distances[i] / length;
        end[i] = distances[i + 1] / length;
    }
    geometry.setAttribute('instanceRevealStart', new THREE.InstancedBufferAttribute(start, 1));
    geometry.setAttribute('instanceRevealEnd', new THREE.InstancedBufferAttribute(end, 1));
}

// Reference-scroll coordinates are the same as the existing camera timeline.
function terrainScrollProgress(settings) {
    const scrollRoot = document.scrollingElement || document.documentElement;
    const maxScroll = Math.max(1, scrollRoot.scrollHeight - window.innerHeight);
    const reference = CONTEXT_ANIMATION.referenceScroll ?? 8413;
    const scroll = (window.scrollY / maxScroll) * reference;
    const start = settings.revealStartScroll ?? 1765; // About Me
    const end = Math.max(start + 1, settings.revealEndScroll ?? 1922); // Projects
    return THREE.MathUtils.clamp((scroll - start) / (end - start), 0, 1);
}

function attachRevealAnimation(line, sourceMaterial, legacyMaterial, revealEnabled) {
    const updateViewport = line.onBeforeRender;
    let progress = 0;
    let lastDraw = null;
    line.onBeforeRender = function (...args) {
        const drawMaterial = args[4];
        // Selective bloom may substitute a hidden material. Do not animate it.
        if (drawMaterial !== line.material || !drawMaterial?.isLineMaterial) return;
        if (legacyMaterial) drawMaterial.opacity = sourceMaterial.opacity;
        updateViewport.call(this, ...args);
        if (!revealEnabled) return;

        const settings = contextAppearance.terrainLines;
        const now = performance.now() / 1000;
        const resetAfter = Math.max(0.1, settings.revealResetAfter ?? 1.0);
        const elapsed = lastDraw === null ? 0 : Math.max(0, now - lastDraw);
        if (lastDraw !== null && elapsed > resetAfter) progress = 0;
        lastDraw = now;

        // The target decreases as the user returns toward About Me. Smoothly
        // follow it in either direction, without starting a new tween per frame.
        const target = terrainScrollProgress(settings);
        const forwardDuration = Math.max(0.001, settings.revealDuration ?? 0.95);
        const reverseDuration = Math.max(0.001, settings.revealReverseDuration ?? forwardDuration);
        const duration = target >= progress ? forwardDuration : reverseDuration;
        // Cap large gaps so background-tab pauses do not cause visible jumps.
        const step = Math.min(elapsed, 0.1) / duration;
        if (drawMaterial.opacity <= 0.001) {
            // Context switching can zero opacity. Replay when the context returns.
            progress = 0;
        } else if (target > progress) {
            progress = Math.min(target, progress + step);
        } else {
            progress = Math.max(target, progress - step);
        }
        const eased = progress * progress * (3 - 2 * progress);
        drawMaterial.uniforms.uTerrainRevealProgress.value = eased;
        drawMaterial.uniforms.uTerrainRevealFeather.value = THREE.MathUtils.clamp(
            settings.revealFeather ?? 0.10, 0.001, 1.0);
        // Different lines can share one material, so upload its per-draw value.
        drawMaterial.uniformsNeedUpdate = true;
    };
}

// Blender GLB: convert exported loose edges / LINE_STRIPs to real dashed lines.
// Unlike a face-edge outline, this follows only the explicitly modelled curves.
// Source objects may have generic names; check the exported hierarchy as well.
function isTerrainContour(object) {
    const name = (object.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return /curb[ae]|curbidenivel|nivel|contour|terraindash|terrainline/.test(name);
}

function matchesTerrainHierarchy(object, root, predicate) {
    if (predicate && predicate(object)) return true;
    for (let node = object; node && node !== root; node = node.parent) {
        if (isTerrainContour(node)) return true;
    }
    return false;
}
export function applyDashedTerrain(root, {
    matches = isTerrainContour,
    material = createContextLineMaterial(contextAppearance.terrainLines.opacity),
    precision = 5
} = {}) {
    const sources = [];
    const exportedLines = [];
    const contourMeshes = [];
    root.traverse(object => {
        if (object.userData.terrainDashedGenerated) return;
        if (object.isLineSegments || object.isLine) {
            exportedLines.push(object.name || '(unnamed)');
            if (!object.userData.terrainDashedSource &&
                matchesTerrainHierarchy(object, root, matches)) sources.push(object);
        } else if (object.isMesh && matchesTerrainHierarchy(object, root, null)) {
            contourMeshes.push(object.name || '(unnamed)');
        }
    });
    if (!sources.length) {
        console.warn('[Terrain] No contour lines selected:', root.name, {
            exportedLines, contourMeshes
        });
        return [];
    }

    const sourceMaterial = material;
    const legacyMaterial = !material.isLineMaterial;
    if (legacyMaterial) {
        material = createContextLineMaterial(sourceMaterial.opacity);
    }

    const revealEnabled = enableTerrainReveal(material);
    const result = [];
    const pointKey = v => `${v.x.toFixed(precision)},${v.y.toFixed(precision)},${v.z.toFixed(precision)}`;

    for (const source of sources) {
        const initialResultCount = result.length;
        const positions = source.geometry.getAttribute('position');
        const index = source.geometry.getIndex();
        if (!positions || !source.parent) continue;
        const vertex = i => new THREE.Vector3().fromBufferAttribute(positions, index ? index.getX(i) : i);
        const count = index ? index.count : positions.count;
        const nodes = new Map();
        const edges = [];
        const used = new Set();

        function add(point) {
            const key = pointKey(point);
            if (!nodes.has(key)) nodes.set(key, { point, edges: [] });
            return key;
        }
        function connect(i, j) {
            const a = add(vertex(i));
            const b = add(vertex(j));
            if (a === b) return;
            const edgeIndex = edges.length;
            edges.push([a, b]);
            nodes.get(a).edges.push(edgeIndex);
            nodes.get(b).edges.push(edgeIndex);
        }

        if (source.isLineSegments) {
            for (let i = 0; i + 1 < count; i += 2) connect(i, i + 1);
        } else {
            for (let i = 0; i + 1 < count; i++) connect(i, i + 1);
            if (source.isLineLoop && count > 2) connect(count - 1, 0);
        }

        function trace(start) {
            const path = [nodes.get(start).point.clone()];
            let at = start;
            for (;;) {
                const next = nodes.get(at).edges.find(id => !used.has(id));
                if (next === undefined) break;
                used.add(next);
                const [a, b] = edges[next];
                at = at === a ? b : a;
                path.push(nodes.get(at).point.clone());
            }
            if (path.length < 2) return;
            // Native WebGL lines are usually limited to 1px. Line2 draws a
            // screen-space strip with adjustable thickness and continuous dashes.
            const geometry = new LineGeometry();
            geometry.setPositions(path.flatMap(point => [point.x, point.y, point.z]));
            const line = new Line2(geometry, material);
            line.name = `${source.name}_dashed`;
            line.userData.terrainDashedGenerated = true;
            line.position.copy(source.position);
            line.quaternion.copy(source.quaternion);
            line.scale.copy(source.scale);
            line.computeLineDistances();
            if (revealEnabled) addRevealAttributes(geometry, path);
            attachRevealAnimation(line, sourceMaterial, legacyMaterial, revealEnabled);
            source.parent.add(line);
            result.push(line);
        }
        // Open contour paths, then loops; do not restart dashes at each Blender edge.
        for (const [key, node] of nodes) if (node.edges.length === 1) trace(key);
        for (let i = 0; i < edges.length; i++) if (!used.has(i)) trace(edges[i][0]);
        if (result.length > initialResultCount) {
            source.visible = false;
            source.userData.terrainDashedSource = true;
        }
    }
    console.info('[Terrain] Contours converted:', root.name, {
        sources: sources.map(source => source.name), paths: result.length,
        initialOpacity: material.opacity, exportedLines, contourMeshes
    });
    return result;
}
