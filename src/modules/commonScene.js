import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTEXT_ANIMATION } from './contextConfig.js';
import { prepareLiquidGlassGeometry } from './liquidGlass.js';
import { attachLampBeam } from './lampLight.js';
import { createUnlitMaterial } from './selectiveLighting.js';
// Preserve the previously exported helper for any existing imports.
export { smoothGlassGeometry } from './liquidGlass.js';

// pageLayout.glb contains ONLY the persistent table + portrait / greeting objects.
// This module preserves their existing scroll choreography, independently of
// changing houses and the three context GLBs.
export function attachCommonSceneAnimations(root, materials) {
    gsap.registerPlugin(ScrollTrigger);
    const REF = CONTEXT_ANIMATION.referenceScroll;
    const maxScroll = () => Math.max(1,
        (document.scrollingElement || document.documentElement).scrollHeight - window.innerHeight
    );
    const currentReferenceScroll = () => window.scrollY / maxScroll() * REF;

    const createTimeline = (start, end, scrub) => gsap.timeline({
        scrollTrigger: {
            trigger: '.main',
            start: () => maxScroll() * start / REF,
            end: () => maxScroll() * end / REF,
            scrub,
            invalidateOnRefresh: true,
            markers: false
        }
    });

    const deskTimeline = createTimeline(1500, 1921, 0.75);
    // LAYOUT_SCROLL_FADES_V2
    const layoutFadeSettings = {
        portraitInStart: 1750,
        portraitInEnd: 1765,
        portraitOutStart: 1837,
        portraitOutEnd: 1921,
        echerInStart: 1837,
        echerInEnd: 1922,
        portraitFadeSeconds: 0.1,
        echerFadeSeconds: 1,
    };
    const portraits = [];
    const portraitMaterials = new Set();
    const portraitFade = { value: 0 };
    // One shared material for all layout meshes with a local gradient attribute.
    const gradientGlass = materials.blurredGlass.clone();
    gradientGlass.vertexColors = true;

    // Independent glass material: never animate the shared layout material.
    const echerGlass = gradientGlass.clone();
    const echerFinalOpacity = 1;
    const echerDepthWrite = echerGlass.depthWrite;
    echerGlass.transparent = true;
    echerGlass.opacity = 0;
    echerGlass.depthWrite = false;
    echerGlass.alphaTest = 0;
    echerGlass.alphaHash = false;
    echerGlass.alphaToCoverage = false;
    echerGlass.needsUpdate = true;
    const echerMeshes = [];
    const echerFade = { value: 0 };
    const belongsTo = (mesh, token) => {
        for (let node = mesh; node && node !== root; node = node.parent) {
            if ((node.name || '').toLowerCase().includes(token)) return true;
        }
        return false;
    };
    const isEcher = mesh => belongsTo(mesh, 'echer');
    const clamp01 = value => Math.max(0, Math.min(1, value));
    const syncPortraitFade = () => {
        const alpha = clamp01(portraitFade.value);
        for (const material of portraitMaterials) material.opacity = alpha;
        for (const mesh of portraits) mesh.visible = alpha > 0.001;
    };
    const syncEcherFade = () => {
        const alpha = Math.max(0, Math.min(1, echerFade.value));
        echerGlass.opacity = alpha * echerFinalOpacity;
        echerGlass.depthWrite = alpha >= 0.999 ? echerDepthWrite : false;
        for (const mesh of echerMeshes) mesh.visible = alpha > 0.001;
    };

    const lampBeam = attachLampBeam(root, materials.lampBeam);

    root.traverse(child => {
        if (!child.isMesh || lampBeam.meshes.has(child)) return;
        const name = child.name.toLowerCase();

        if (belongsTo(child, 'pictureframe')) {
            const material = createUnlitMaterial(child.material);
            if (material) {
                child.material = material;
                const list = Array.isArray(material) ? material : [material];
                for (const mat of list) {
                    if (!mat) continue;
                    mat.transparent = true;
                    mat.opacity = 0;
                    mat.depthWrite = false;
                    // A fixed alpha cutoff/hash would turn an opacity fade into a pop.
                    // Texture alpha is retained through normal alpha blending.
                    mat.alphaTest = 0;
                    mat.alphaHash = false;
                    mat.alphaToCoverage = false;
                    mat.needsUpdate = true;
                    portraitMaterials.add(mat);
                }
            }
            // Preserve the original portrait transform for the named mesh.
            if (name.includes('pictureframe')) {
                child.position.y += 6.5;
                child.scale.set(0.55, 0.55, 0.55);
            }
            portraits.push(child);
            child.visible = false;
            return;
        }

        if (name.includes('deskplane')) {
            const finalZ = child.position.z;
            child.material = createUnlitMaterial(materials.desk);
            child.position.z = finalZ + 200;
            deskTimeline.to(child.position, {
                z: finalZ,
                duration: 1,
                ease: 'sine.inOut'
            }, 0);
            return;
        }

        // Preserve the materials of meshes nested inside the excluded objects.
        let parent = child.parent;
        while (parent && parent !== root) {
            const parentName = parent.name.toLowerCase();
            if (parentName.includes('deskplane')) {
                child.material = createUnlitMaterial(child.material);
                return;
            }
            parent = parent.parent;
        }

        // Smooth across split GLB vertices, without changing the actual bevel.
        prepareLiquidGlassGeometry(child);

        // All other pageLayout meshes share the material defined in materials.js.
        if (isEcher(child)) {
            child.material = echerGlass;
            echerMeshes.push(child);
            child.visible = false;
        } else {
            child.material = gradientGlass;
        }
        child.castShadow = false;
        console.log('[Blurred Glass]', child.name);
    });

    // Calculate desired opacity from scroll, then ease the rendered opacity
    // toward it in real time. Even an instant jump to a keyframe gets a fade.
    const ramp = (position, start, end) => {
        if (end <= start) return position >= end ? 1 : 0;
        return clamp01((position - start) / (end - start));
    };
    const movePortrait = gsap.quickTo(portraitFade, 'value', {
        duration: layoutFadeSettings.portraitFadeSeconds,
        ease: 'sine.out',
        onUpdate: syncPortraitFade,
    });
    const moveEcher = gsap.quickTo(echerFade, 'value', {
        duration: layoutFadeSettings.echerFadeSeconds,
        ease: 'sine.out',
        onUpdate: syncEcherFade,
    });
    let lastPortraitTarget = 0;
    let lastEcherTarget = 0;
    const updateLayoutFades = () => {
        const pos = currentReferenceScroll();
        const portraitTarget = ramp(pos, layoutFadeSettings.portraitInStart, layoutFadeSettings.portraitInEnd)
            * (1 - ramp(pos, layoutFadeSettings.portraitOutStart, layoutFadeSettings.portraitOutEnd));
        const echerTarget = ramp(pos, layoutFadeSettings.echerInStart, layoutFadeSettings.echerInEnd);
        if (portraits.length && portraitTarget !== lastPortraitTarget) {
            lastPortraitTarget = portraitTarget;
            movePortrait(portraitTarget);
        }
        if (echerMeshes.length && echerTarget !== lastEcherTarget) {
            lastEcherTarget = echerTarget;
            moveEcher(echerTarget);
        }
    };

    // No raw scroll-based visible toggle: visibility follows animated alpha only.
    syncPortraitFade();
    syncEcherFade();
    window.addEventListener('scroll', updateLayoutFades, { passive: true });
    window.addEventListener('resize', updateLayoutFades);
    ScrollTrigger.addEventListener('refresh', updateLayoutFades);
    deskTimeline.scrollTrigger?.refresh();
    updateLayoutFades();

    if (!portraits.length) console.warn('[Layout fades] No pictureFrame mesh found in pageLayout.glb');
    if (!echerMeshes.length) console.warn('[Layout fades] No Echer mesh found in pageLayout.glb');

    return () => {
        lampBeam.dispose();
        window.removeEventListener('scroll', updateLayoutFades);
        window.removeEventListener('resize', updateLayoutFades);
        ScrollTrigger.removeEventListener('refresh', updateLayoutFades);
        movePortrait.tween.kill();
        moveEcher.tween.kill();
        deskTimeline.scrollTrigger?.kill();
        deskTimeline.kill();
        echerGlass.dispose();
    };
}
