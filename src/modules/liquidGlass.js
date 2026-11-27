import * as THREE from 'three';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Cache smoothed copies so meshes sharing a GLB geometry share the result.
const smoothedGlassGeometries = new WeakMap();
const GLASS_CREASE_ANGLE = Math.PI / 3; // 60 degrees

export function smoothGlassGeometry(mesh) {
    const source = mesh.geometry;
    if (!source?.getAttribute('position')) return;

    let smoothed = smoothedGlassGeometries.get(source);
    if (!smoothed) {
        // Indexed input produces a new geometry. Non-indexed input is modified
        // in place, so clone it first to protect other meshes.
        const input = source.index ? source : source.clone();
        smoothed = toCreasedNormals(input, GLASS_CREASE_ANGLE);
        smoothedGlassGeometries.set(source, smoothed);
        smoothedGlassGeometries.set(smoothed, smoothed);
    }
    mesh.geometry = smoothed;
}

// Normalized diagonal gradient in each individual mesh's local bounds.
// Computed only once, on the smoothed geometry copy, and interpolated by the GPU.
const gradientGeometries = new WeakSet();
function prepareGlassGradient(mesh) {
    const geometry = mesh.geometry;
    if (!geometry || gradientGeometries.has(geometry)) return;
    const position = geometry.getAttribute('position');
    if (!position || position.count === 0) return;
    geometry.computeBoundingBox();
    const { min, max } = geometry.boundingBox;
    const sx = max.x - min.x;
    const sy = max.y - min.y;
    const sz = max.z - min.z;
    const normalized = (n, low, size) => size > 1e-8 ? (n - low) / size : 0.5;
    const values = new Float32Array(position.count * 3);
    for (let i = 0; i < position.count; i++) {
        const x = normalized(position.getX(i), min.x, sx);
        const y = normalized(position.getY(i), min.y, sy);
        const z = normalized(position.getZ(i), min.z, sz);
        const t = 0.30 * (1 - x) + 0.55 * y + 0.15 * z;
        values[i * 3] = t;
        values[i * 3 + 1] = x;
        values[i * 3 + 2] = y;
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(values, 3));
    gradientGeometries.add(geometry);
}

// All meshes that use the liquid-glass shader need the same normalized local
// gradient coordinates. The geometry work is cached; only new GLBs pay its cost.
export function prepareLiquidGlassGeometry(mesh) {
    if (!mesh.geometry?.getAttribute('position')) return false;
    smoothGlassGeometry(mesh);
    prepareGlassGradient(mesh);
    return gradientGeometries.has(mesh.geometry);
}


// Shared screen-space backdrops, one for each overlapping depth layer.
// The first contains only non-glass geometry. Additional layers include
// previously rendered (more distant) glass, never their own glass surfaces.
export const liquidGlassBackdropSettings = {
    blurPixels: 6,       // Gaussian standard deviation, in CSS pixels
    resolutionScale: 0.4,
    maxLayers: 2,         // 1 = original non-glass-only capture; 2–4 = layered
};

export const liquidGlassBackdropUniforms = {
    uLGBackdrop: { value: null },
    uLGBackdrop1: { value: null },
    uLGBackdrop2: { value: null },
    uLGBackdrop3: { value: null },
    uLGReady: { value: 0 },
};

export function createLiquidGlassBackdrop(renderer) {
    const size = new THREE.Vector2();
    const type = renderer.extensions.has('EXT_color_buffer_float')
        ? THREE.HalfFloatType : THREE.UnsignedByteType;
    function makeTarget(name, depthBuffer) {
        const target = new THREE.WebGLRenderTarget(1, 1, {
            type, depthBuffer, stencilBuffer: false,
            minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
            generateMipmaps: false,
        });
        target.texture.name = name;
        return target;
    }
    const capture = makeTarget('LiquidGlass.capture', true);
    const horizontal = makeTarget('LiquidGlass.horizontal', false);
    const blurred = Array.from({ length: 4 }, (_, i) => makeTarget(`LiquidGlass.layer${i}`, false));
    const samplers = [liquidGlassBackdropUniforms.uLGBackdrop,
        liquidGlassBackdropUniforms.uLGBackdrop1,
        liquidGlassBackdropUniforms.uLGBackdrop2,
        liquidGlassBackdropUniforms.uLGBackdrop3];
    blurred.forEach((target, i) => { samplers[i].value = target.texture; });

    const blurMaterial = new THREE.ShaderMaterial({
        uniforms: { tInput: { value: capture.texture }, uStep: { value: new THREE.Vector2() } },
        vertexShader: `
            varying vec2 vUV;
            void main() { vUV = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
        `,
        fragmentShader: `
            varying vec2 vUV;
            uniform sampler2D tInput;
            uniform vec2 uStep;
            void main() {
                // 25-tap separable Gaussian. A denser kernel avoids conspicuous
                // separated samples at the larger CSS-style blur radii.
                vec4 result = vec4(0.0);
                float total = 0.0;
                for (int i = -12; i <= 12; i++) {
                    float x = float(i) / 4.0;
                    float w = exp(-0.5 * x * x);
                    result += texture2D(tInput, vUV + float(i) * uStep) * w;
                    total += w;
                }
                gl_FragColor = result / total;
            }
        `,
        depthTest: false, depthWrite: false, toneMapped: false,
    });
    const blurScene = new THREE.Scene();
    const blurCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMaterial);
    quad.frustumCulled = false;
    blurScene.add(quad);
    const invisibleGlass = new THREE.MeshBasicMaterial({ visible: false });
    const preparedMeshes = new WeakMap();
    const corner = new THREE.Vector3();
    const center = new THREE.Vector3();

    // Per-mesh constant shader attribute, kept on an independent geometry so
    // objects sharing one GLB geometry can belong to different depth layers.
    function prepare(mesh) {
        let state = preparedMeshes.get(mesh);
        if (state?.geometry === mesh.geometry) return state;
        if (!prepareLiquidGlassGeometry(mesh)) return null;
        const geometry = mesh.geometry.clone();
        const attribute = new THREE.Float32BufferAttribute(new Float32Array(geometry.getAttribute('position').count), 1);
        attribute.setUsage(THREE.DynamicDrawUsage);
        geometry.setAttribute('lgBackdropLayer', attribute);
        mesh.geometry = geometry;
        state = { geometry, attribute, layer: 0 };
        preparedMeshes.set(mesh, state);
        return state;
    }

    function bounds(mesh, camera) {
        const box = mesh.geometry.boundingBox;
        if (!box || box.isEmpty()) return null;
        box.getCenter(center).applyMatrix4(mesh.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
        const depth = -center.z;
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        let crossesNear = false;
        for (let i = 0; i < 8; i++) {
            corner.set(i & 1 ? box.max.x : box.min.x,
                i & 2 ? box.max.y : box.min.y,
                i & 4 ? box.max.z : box.min.z);
            corner.applyMatrix4(mesh.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
            if (-corner.z <= camera.near) { crossesNear = true; continue; }
            corner.applyMatrix4(camera.projectionMatrix);
            x0 = Math.min(x0, corner.x); x1 = Math.max(x1, corner.x);
            y0 = Math.min(y0, corner.y); y1 = Math.max(y1, corner.y);
        }
        if (crossesNear) return { depth, x0: -1, y0: -1, x1: 1, y1: 1 };
        return { depth, x0, y0, x1, y1 };
    }

    function blurInto(target) {
        const step = Math.max(0, liquidGlassBackdropSettings.blurPixels) / 4;
        blurMaterial.uniforms.tInput.value = capture.texture;
        blurMaterial.uniforms.uStep.value.set(step / size.x, 0);
        renderer.setRenderTarget(horizontal);
        renderer.render(blurScene, blurCamera);
        blurMaterial.uniforms.tInput.value = horizontal.texture;
        blurMaterial.uniforms.uStep.value.set(0, step / size.y);
        renderer.setRenderTarget(target);
        renderer.render(blurScene, blurCamera);
    }

    function update(scene, camera) {
        renderer.getSize(size);
        if (size.x <= 0 || size.y <= 0) return;
        scene.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);
        const records = [];
        scene.traverseVisible(mesh => {
            if (!mesh.isMesh || !camera.layers.test(mesh.layers)) return;
            const original = mesh.material;
            const list = Array.isArray(original) ? original : [original];
            const isGlass = mat => !!(mat?.visible && mat.userData?.liquidGlassBackdrop);
            const glass = list.filter(isGlass);
            if (!glass.length) return;
            const state = prepare(mesh);
            if (!state) return;
            for (const mat of glass) {
                if (!mat.vertexColors) { mat.vertexColors = true; mat.needsUpdate = true; }
            }
            const rect = bounds(mesh, camera);
            if (!rect) return;
            const hidden = Array.isArray(original) ? list.map(mat => isGlass(mat) ? invisibleGlass : mat) : invisibleGlass;
            records.push({ mesh, original, hidden, state, ...rect, layer: 0 });
        });
        if (!records.length) { liquidGlassBackdropUniforms.uLGReady.value = 0; return; }

        // Back-to-front by camera-space center. Overlapping projected bounds
        // require another layer; non-overlapping glass shares a capture.
        records.sort((a, b) => b.depth - a.depth);
        const maxLayers = THREE.MathUtils.clamp(Math.floor(liquidGlassBackdropSettings.maxLayers), 1, 4);
        const mx = 4 * liquidGlassBackdropSettings.blurPixels / size.x;
        const my = 4 * liquidGlassBackdropSettings.blurPixels / size.y;
        const onscreen = r => r.x1 >= -1 && r.x0 <= 1 && r.y1 >= -1 && r.y0 <= 1;
        const overlaps = (a, b) => onscreen(a) && onscreen(b) &&
            a.x0 <= b.x1 + mx && a.x1 >= b.x0 - mx &&
            a.y0 <= b.y1 + my && a.y1 >= b.y0 - my;
        let layerCount = 1;
        for (let i = 0; i < records.length; i++) {
            const r = records[i];
            for (let j = 0; j < i; j++) {
                if (overlaps(r, records[j])) r.layer = Math.max(r.layer, records[j].layer + 1);
            }
            r.layer = Math.min(r.layer, maxLayers - 1);
            layerCount = Math.max(layerCount, r.layer + 1);
            if (r.state.layer !== r.layer) {
                r.state.attribute.array.fill(r.layer);
                r.state.attribute.needsUpdate = true;
                r.state.layer = r.layer;
            }
        }
        const scale = THREE.MathUtils.clamp(liquidGlassBackdropSettings.resolutionScale, 0.25, 1);
        const width = Math.max(1, Math.round(size.x * scale));
        const height = Math.max(1, Math.round(size.y * scale));
        for (const target of [capture, horizontal, ...blurred.slice(0, layerCount)]) {
            if (target.width !== width || target.height !== height) target.setSize(width, height);
        }
        const oldTarget = renderer.getRenderTarget();
        const oldAutoClear = renderer.autoClear;
        const oldShadowAutoUpdate = renderer.shadowMap.autoUpdate;
        const oldShadowNeedsUpdate = renderer.shadowMap.needsUpdate;
        liquidGlassBackdropUniforms.uLGReady.value = 0;
        try {
            renderer.autoClear = true;
            renderer.shadowMap.autoUpdate = false;
            renderer.shadowMap.needsUpdate = false;
            for (const r of records) r.mesh.material = r.hidden;
            for (let layer = 0; layer < layerCount; layer++) {
                // Only layers with a completed backdrop are restored here.
                // The active layer never samples the texture it is writing.
                if (layer > 0) {
                    for (const r of records) if (r.layer === layer - 1) r.mesh.material = r.original;
                }
                renderer.setRenderTarget(capture);
                renderer.render(scene, camera);
                blurInto(blurred[layer]);
                liquidGlassBackdropUniforms.uLGReady.value = 1;
            }
        } finally {
            for (const r of records) r.mesh.material = r.original;
            renderer.autoClear = oldAutoClear;
            renderer.shadowMap.autoUpdate = oldShadowAutoUpdate;
            renderer.shadowMap.needsUpdate = oldShadowNeedsUpdate;
            renderer.setRenderTarget(oldTarget);
        }
    }

    return { update };
}
