import * as THREE from 'three';
import { gsap } from 'gsap';
import { CONTEXT_FILES, DEFAULT_CONTEXT_KEY, CONTEXT_ANIMATION, contextKeyFromProjectPath } from './contextConfig.js';
import { createContextBuildingMaterial, createContextLineMaterial, contextAppearance } from './materials.js';
import { applyDashedTerrain } from './terrainDashed.js';

const clamp01 = value => Math.max(0, Math.min(1, value));
const smoothstep = value => {
    const t = clamp01(value);
    return t * t * (3 - 2 * t);
};

function hasAncestorMatching(node, root, matcher) {
    for (let at = node; at && at !== root; at = at.parent) {
        if (matcher(at.name.toLowerCase())) return true;
    }
    return false;
}

const isCurvesName = name => name.includes('curbe') || name.includes('contour') || name.includes('terrain_dash');
const isNeighborName = name => name.includes('neighbo') || name.includes('neighbor') || name.includes('vecin');

// All context GLBs load once, and remain cached. Only one house is selected.
// Initial build-up is scroll-driven; Next/Previous runs its own real-time tween.
export class ContextSceneManager {
    constructor(scene, gltfLoader) {
        this.scene = scene;
        this.gltfLoader = gltfLoader;
        this.contexts = new Map();
        this.activeKey = DEFAULT_CONTEXT_KEY; // Bacau is buildingsList[0]; overridden by project path when needed
        this.mode = 'scroll'; // 'scroll' while browsing, 'switch' while using project arrows
        this.progress = 0;
        this.lastFrame = null;
        this.switchTimeline = null;
        this.version = 0;
        this._onTick = this._onTick.bind(this);
        this._onScroll = this._onScroll.bind(this);
        window.addEventListener('scroll', this._onScroll, { passive: true });
        gsap.ticker.add(this._onTick);
    }

    referenceScroll() {
        const max = Math.max(1,
            (document.scrollingElement || document.documentElement).scrollHeight - window.innerHeight
        );
        return window.scrollY / max * CONTEXT_ANIMATION.referenceScroll;
    }

    targetProgress() {
        const { popStart, popEnd } = CONTEXT_ANIMATION;
        return smoothstep((this.referenceScroll() - popStart) / (popEnd - popStart));
    }

    preload() {
        return Promise.allSettled(Object.entries(CONTEXT_FILES).map(([key, url]) =>
            new Promise((resolve, reject) => {
                this.gltfLoader.load(url, gltf => {
                    const slot = this._register(key, gltf.scene);
                    this.contexts.set(key, slot);
                    // Finish initial selection even when the asset loads after scripts.js.
                    if (this.activeKey === key) {
                        this._hideAllExcept(key);
                        this.progress = this.targetProgress();
                        this._setProgress(slot, this.progress);
                        slot.root.visible = true;
                    } else {
                        slot.root.visible = false;
                    }
                    resolve(slot);
                }, undefined, error => {
                    console.error(`[ContextScene] Missing/unreadable GLB: ${url}. Export it into public/assets/meshes/mainScene/ with EXACT file name; also verify the Network tab for a 404.`, error);
                    reject(error);
                });
            })
        ));
    }

    _register(key, root) {
        root.name = `context_${key}`;
        // Preserve the GLB scene transform. Exported object coordinates and parents
        // must not be reset just because the assets are now in separate files.
        root.scale.multiplyScalar(CONTEXT_ANIMATION.sceneScale);
        root.updateMatrixWorld(true);
        const sourceBounds = new THREE.Box3().setFromObject(root);
        this.scene.add(root);
        const neighbourMaterial = createContextBuildingMaterial();
        const lineMaterial = createContextLineMaterial();
        const buildingMeshes = [];
        const allMeshes = [];

        // The GLB contains only one context. Prefer the Blender group names;
        // if no groups survived export, use every non-curve mesh as context.
        root.traverse(child => {
            if (!child.isMesh) return;
            if (hasAncestorMatching(child, root, isCurvesName)) return;
            allMeshes.push(child);
            if (hasAncestorMatching(child, root, isNeighborName)) buildingMeshes.push(child);
        });
        const candidates = buildingMeshes.length ? buildingMeshes : allMeshes;
        const buildings = candidates.map(mesh => {
            const fullScale = mesh.scale.clone();
            mesh.material = neighbourMaterial;
            mesh.scale.set(0, 0, 0);
            return { mesh, fullScale };
        });

        // Curve groups can contain LineSegments with Blender-generated names.
        // Matching their *ancestors* works even when glTF renames the children.
        const lines = applyDashedTerrain(root, {
            matches: child => hasAncestorMatching(child, root, isCurvesName),
            material: lineMaterial
        });
        lineMaterial.opacity = 0;
        if (!buildings.length) console.warn(`[ContextScene] context_${key} has NO neighbour meshes. Check Blender export selection / mesh geometry.`);
        else {
            const size = sourceBounds.isEmpty() ? 'empty' : sourceBounds.getSize(new THREE.Vector3()).toArray().map(n => n.toFixed(2)).join(' x ');
            const center = sourceBounds.isEmpty() ? 'empty' : sourceBounds.getCenter(new THREE.Vector3()).toArray().map(n => n.toFixed(2)).join(', ');
            console.info(`[ContextScene] context_${key} loaded: ${buildings.length} building mesh(es), ${lines.length} dashed lines; original bounds ${size}, center ${center}; root scale ${root.scale.x}.`);
        }
        if (!lines.length) console.warn(`[ContextScene] No loose-edge terrain curves in context_${key}. Enable Loose Edges when exporting GLB.`);
        return { root, buildings, lines, lineMaterial, neighbourMaterial };
    }

    _setProgress(slot, progress) {
        const p = clamp01(progress);
        for (const { mesh, fullScale } of slot.buildings) {
            mesh.scale.set(fullScale.x * p, fullScale.y * p, fullScale.z * p);
        }
        // Curves begin fading shortly after the massing appears.
        slot.lineMaterial.opacity = contextAppearance.terrainLines.opacity * smoothstep((p - 0.12) / 0.88);
    }

    _hideAllExcept(key) {
        for (const [otherKey, slot] of this.contexts) {
            if (otherKey !== key) slot.root.visible = false;
        }
    }

    selectFromProjectPath(path) {
        const key = contextKeyFromProjectPath(path);
        if (!key) {
            console.warn('[ContextScene] Unrecognized project GLB path:', path,
                `Keeping current context ${this.activeKey}. Update contextConfig.js matchers if needed.`);
            return;
        }
        if (key === this.activeKey) return; // model variant changes don't replay the context
        const previous = this.activeKey;
        this.activeKey = key;
        this.version++;
        this.switchTimeline?.kill();
        this.switchTimeline = null;

        // Cancel old tweens and hide stale contexts after rapid Next/Previous clicks.
        for (const slot of this.contexts.values()) {
            slot.buildings.forEach(({ mesh }) => gsap.killTweensOf(mesh.scale));
            gsap.killTweensOf(slot.lineMaterial);
            slot.root.visible = false;
        }

        const next = this.contexts.get(key);
        if (!next) {
            this.mode = 'scroll'; // pending download; preload() reveals it later
            return;
        }
        next.root.visible = true;
        const ref = this.referenceScroll();
        const shouldAnimateSwitch = Boolean(previous) && ref >= CONTEXT_ANIMATION.popStart;
        if (!shouldAnimateSwitch) {
            this.mode = 'scroll';
            this.progress = this.targetProgress();
            this._setProgress(next, this.progress);
            return;
        }

        this.mode = 'switch';
        this._setProgress(next, 0);
        const version = this.version;
        const tl = gsap.timeline({
            onComplete: () => {
                if (version !== this.version) return;
                this.switchTimeline = null;
            }
        });
        const { switchDuration, switchStagger, curveFadeSeconds } = CONTEXT_ANIMATION;
        next.buildings.forEach(({ mesh, fullScale }, index) => {
            tl.to(mesh.scale, {
                x: fullScale.x, y: fullScale.y, z: fullScale.z,
                duration: switchDuration,
                ease: 'sine.inOut'
            }, index * switchStagger);
        });
        tl.to(next.lineMaterial, {
            opacity: contextAppearance.terrainLines.opacity,
            duration: curveFadeSeconds,
            ease: 'power2.out'
        }, 0.20);
        this.switchTimeline = tl;
    }

    _onScroll() {
        if (this.mode !== 'switch') return;
        if (this.referenceScroll() < CONTEXT_ANIMATION.popEnd - 2) {
            // Returning to About Me: hand control back to reversible scroll buildup.
            this.switchTimeline?.kill();
            this.switchTimeline = null;
            this.mode = 'scroll';
            this.progress = 1;
        }
    }

    _onTick() {
        if (this.mode !== 'scroll' || !this.activeKey) return;
        const slot = this.contexts.get(this.activeKey);
        if (!slot) return;
        const now = performance.now();
        const delta = this.lastFrame === null ? 1 / 60 : Math.min(0.05, (now - this.lastFrame) / 1000);
        this.lastFrame = now;
        const target = this.targetProgress();
        const alpha = 1 - Math.exp(-delta / CONTEXT_ANIMATION.smoothSeconds);
        if (Math.abs(target - this.progress) <= 0.0005) this.progress = target;
        else this.progress += (target - this.progress) * alpha;
        this._setProgress(slot, this.progress);
        slot.root.visible = true;
    }

    dispose() {
        this.switchTimeline?.kill();
        window.removeEventListener('scroll', this._onScroll);
        gsap.ticker.remove(this._onTick);
        for (const slot of this.contexts.values()) {
            this.scene.remove(slot.root);
            slot.lines.forEach(line => line.geometry.dispose());
            slot.neighbourMaterial.dispose();
            slot.lineMaterial.dispose();
        }
        this.contexts.clear();
    }
}
