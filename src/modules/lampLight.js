import * as THREE from 'three';
import { gsap } from 'gsap';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Keep the timing independent of the scroll scrub, just like the Projects buttons.
export const lampLightSettings = {
    objectName: 'Light',
    axis: null, // auto-detect from the cone's flat end caps; override with [x,y,z] in Light's local space
    reverseDirection: false, // true reverses the gradient if needed
    flicker: true,
    ignitionDuration: 0.9,
    exitDuration: 0.18,
};

const controllers = new Set();
let projectsActive = false;

// Called by the existing Projects navigation visibility function. Remember the
// state even if the GLB has not arrived yet (including reloads at Projects).
export function setLampBeamProjectActive(active) {
    active = Boolean(active);
    if (active === projectsActive) return;
    projectsActive = active;
    console.info('[LampBeam] Projects active:', active, '| controllers:', controllers.size);
    for (const controller of controllers) controller.setActive(active);
}

function nameMatches(object) {
    const name = object.name.toLowerCase();
    const key = lampLightSettings.objectName.toLowerCase();
    return name === key || (name.startsWith(key) && /^[._-]?\d+$/.test(name.slice(key.length)));
}

// Find the light axis in the named object's local coordinates, not global Y.
// A capped cone/frustum has parallel flat end planes. The plane-normal with
// the largest extremal planar triangle area is its axis. Determine which end
// is narrower from the radii of the vertices on the two end planes.
function beamGeometry(meshes, owner) {
    owner.updateWorldMatrix(true, true);
    const inverse = owner.matrixWorld.clone().invert();
    const pointSets = new Map();
    const points = [];
    const triangles = [];
    const a = new THREE.Vector3(), b = new THREE.Vector3();
    for (const mesh of meshes) {
        const pos = mesh.geometry.getAttribute('position');
        const matrix = new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld);
        const local = Array.from({ length: pos.count }, (_, i) =>
            new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(matrix));
        for (const point of local) points.push(point);
        pointSets.set(mesh, matrix);
        const index = mesh.geometry.index;
        const count = index ? index.count : pos.count;
        for (let i = 0; i + 2 < count; i += 3) {
            const p = local[index ? index.getX(i) : i];
            const q = local[index ? index.getX(i + 1) : i + 1];
            const r = local[index ? index.getX(i + 2) : i + 2];
            const cross = a.subVectors(q, p).cross(b.subVectors(r, p));
            const area2 = cross.length();
            if (area2 > 1e-12) triangles.push({ p, q, r, area2, normal: cross.clone().divideScalar(area2) });
        }
    }
    if (!points.length) return null;
    const range = axis => {
        let lo = Infinity, hi = -Infinity;
        for (const p of points) { const d = p.dot(axis); lo = Math.min(lo, d); hi = Math.max(hi, d); }
        return { lo, hi, span: hi - lo };
    };
    const candidates = [new THREE.Vector3(1,0,0), new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,1)];
    // Cone meshes are small; cap normals are usually among the largest faces.
    for (const tri of triangles.slice().sort((x,y) => y.area2-x.area2)) {
        if (!candidates.some(n => Math.abs(n.dot(tri.normal)) > 0.99999)) candidates.push(tri.normal);
        if (candidates.length >= 96) break;
    }
    let axis;
    if (Array.isArray(lampLightSettings.axis) && lampLightSettings.axis.length === 3 &&
        lampLightSettings.axis.every(Number.isFinite) && lampLightSettings.axis.some(n => n !== 0)) {
        axis = new THREE.Vector3(...lampLightSettings.axis).normalize();
    } else {
        let score = 0;
        for (const n of candidates) {
            const { lo, hi, span } = range(n);
            if (span < 1e-8) continue;
            const epsilon = Math.max(span * 0.0002, 1e-8);
            let capArea = 0;
            for (const tri of triangles) {
                if (Math.abs(n.dot(tri.normal)) < 0.999) continue;
                const ds = [tri.p.dot(n), tri.q.dot(n), tri.r.dot(n)];
                if (ds.every(d => d - lo < epsilon) || ds.every(d => hi - d < epsilon)) capArea += tri.area2;
            }
            if (capArea > score) { score = capArea; axis = n.clone(); }
        }
        if (!axis) {
            axis = candidates.slice(0,3).sort((x,y) => range(y).span-range(x).span)[0].clone();
            console.warn('[LampBeam] No flat cap detected. Set lampLightSettings.axis if the gradient is misaligned.');
        }
    }
    let { lo, hi, span } = range(axis);
    if (span < 1e-8) return null;
    function endRadius(end) {
        const cap = points.filter(p => Math.abs(p.dot(axis)-end) <= span*0.002 + 1e-8);
        if (!cap.length) return 0;
        const center = new THREE.Vector3();
        for (const p of cap) center.add(p);
        center.divideScalar(cap.length);
        let radius = 0;
        const radial = new THREE.Vector3();
        for (const p of cap) {
            radial.subVectors(p,center);
            radial.addScaledVector(axis,-radial.dot(axis));
            radius = Math.max(radius,radial.length());
        }
        return radius;
    }
    const smallAtHigh = endRadius(hi) < endRadius(lo);
    if (smallAtHigh !== lampLightSettings.reverseDirection) {
        axis.negate();
        ({ lo, hi, span } = range(axis));
    }
    return { axis, lo, span, pointSets };
}

export function attachLampBeam(root, template) {
    const owners = new Map();
    root.traverse(mesh => {
        if (!mesh.isMesh || !mesh.geometry?.getAttribute('position')) return;
        let owner = mesh;
        while (owner && owner !== root && !nameMatches(owner)) owner = owner.parent;
        if (!owner || owner === root) return;
        if (!owners.has(owner)) owners.set(owner, []);
        owners.get(owner).push(mesh);
    });
    const meshes = new Set([...owners.values()].flat());
    if (!meshes.size) { const names = []; root.traverse(object => { if (object.name) names.push(object.name); }); console.warn('[LampBeam] No mesh named Light found in pageLayout.glb. Loaded names:', names); return { meshes, dispose() {} }; }
    if (!template?.uniforms?.uBeamPower) {
        console.warn('[LampBeam] materials.lampBeam is missing.');
        for (const mesh of meshes) mesh.visible = false;
        return { meshes, dispose() {} };
    }
    const material = template.clone();
    const power = material.uniforms.uBeamPower;
    power.value = 0;
    material.visible = false;
    const saved = [];
    const localPoint = new THREE.Vector3();
    for (const [owner, parts] of owners) {
        const data = beamGeometry(parts, owner);
        if (!data) {
            console.warn('[LampBeam] Invalid cone geometry:', owner.name);
            for (const mesh of parts) {
                saved.push({ mesh, visible: mesh.visible }); mesh.visible = false;
            }
            continue;
        }
        for (const mesh of parts) {
            const original = mesh.geometry;
            // Smooth the grazing-angle falloff across the side facets. Keep the
            // original geometry intact for any other GLB meshes sharing it.
            const geometry = toCreasedNormals(original.index ? original : original.clone(), Math.PI/3);
            const pos = geometry.getAttribute('position');
            const values = new Float32Array(pos.count);
            const matrix = data.pointSets.get(mesh);
            for (let i = 0; i < pos.count; i++) {
                localPoint.fromBufferAttribute(pos,i).applyMatrix4(matrix);
                values[i] = THREE.MathUtils.clamp((localPoint.dot(data.axis)-data.lo)/data.span,0,1);
            }
            geometry.setAttribute('lampBeamT', new THREE.Float32BufferAttribute(values,1));
            saved.push({ mesh, geometry: original, material: mesh.material,
                castShadow: mesh.castShadow, receiveShadow: mesh.receiveShadow, renderOrder: mesh.renderOrder });
            mesh.geometry = geometry;
            mesh.material = material;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            // Keep the luminous, non-depth-writing beam after the glass surfaces.
            mesh.renderOrder = Math.max(mesh.renderOrder,20);
        }
        console.info('[LampBeam] Ready:', owner.name, 'local axis:', data.axis.toArray());
    }
    let active = false;
    let animation = null;
    const controller = {
        meshes,
        setActive(next) {
            if (next === active) return;
            active = next;
            animation?.kill();
            if (!next) {
                animation = gsap.to(power, { value: 0, duration: lampLightSettings.exitDuration,
                    ease: 'power2.out', onComplete: () => { if (!active) material.visible = false; } });
                return;
            }
            material.visible = true;
            const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
            if (!lampLightSettings.flicker || reduceMotion) {
                animation = gsap.to(power,{ value:1,duration:lampLightSettings.ignitionDuration,ease:'sine.out' });
                return;
            }
            // Brief irregular startup, not a continuous strobe. The last ramp
            // stays on at full power for the rest of the Projects range.
            const d = Math.max(0.05,lampLightSettings.ignitionDuration);
            animation = gsap.timeline()
                .to(power,{value:0.36,duration:d*0.08,ease:'power1.out'})
                .to(power,{value:0.06,duration:d*0.09,ease:'sine.inOut'})
                .to(power,{value:0.68,duration:d*0.12,ease:'power1.out'})
                .to(power,{value:0.28,duration:d*0.13,ease:'sine.inOut'})
                .to(power,{value:1,duration:d*0.58,ease:'sine.out'});
        },
        dispose() {
            controllers.delete(controller);
            animation?.kill();
            for (const state of saved) {
                const mesh = state.mesh;
                if (!state.geometry) { mesh.visible = state.visible; continue; }
                const processed = mesh.geometry;
                mesh.geometry = state.geometry;
                mesh.material = state.material;
                mesh.castShadow = state.castShadow;
                mesh.receiveShadow = state.receiveShadow;
                mesh.renderOrder = state.renderOrder;
                if (processed !== state.geometry) processed.dispose();
            }
            material.dispose();
        },
    };
    controllers.add(controller);
    controller.setActive(projectsActive);
    return controller;
}
// Manual diagnostic: test the beam without scrolling. Reload to restore normal control.
if (typeof window !== 'undefined') {
    window.lampBeamTest = (active = true) => {
        console.info('[LampBeam] Manual test | controllers:', controllers.size);
        for (const controller of controllers) controller.setActive(Boolean(active));
        return { controllers: controllers.size, requested: Boolean(active) };
    };
}
