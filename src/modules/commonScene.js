import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTEXT_ANIMATION } from './contextConfig.js';

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

    const deskTimeline = createTimeline(1600, 1921, 0.75);
    const portraitTimeline = createTimeline(0, 1921, true);
    const portraits = [];

    root.traverse(child => {
        if (!child.isMesh) return;
        const name = child.name.toLowerCase();

        if (name.includes('pictureframe')) {
            const material = child.material?.clone?.();
            if (material) {
                child.material = material;
                material.transparent = true;
                material.opacity = 0;
                material.depthWrite = false;
            }
            child.position.y += 6.5;
            child.scale.set(0.55, 0.55, 0.55);
            portraits.push(child);
            // Fade in at 650..1300, fade out at 1837..1921.
            if (material) {
                portraitTimeline.fromTo(material,
                    { opacity: 0 },
                    { opacity: 1, duration: (1300 - 650) / 1921, ease: 'sine.out', immediateRender: false },
                    650 / 1921);
                portraitTimeline.to(material,
                    { opacity: 0, duration: (1921 - 1837) / 1921, ease: 'sine.inOut' },
                    1837 / 1921);
            }
            return;
        }

        if (name.includes('desk')) {
            const finalZ = child.position.z;
            child.material = materials.desk;
            child.position.z = finalZ + 200;
            deskTimeline.to(child.position, {
                z: finalZ,
                duration: 1,
                ease: 'sine.inOut'
            }, 0);
            return;
        }

        if (name.includes('greetingbox')) {
            child.material = materials.model.clone();
        }
    });

    const updatePortraitAtCamD = () => {
        const visible = currentReferenceScroll() < 1921;
        portraits.forEach(mesh => { mesh.visible = visible; });
    };
    window.addEventListener('scroll', updatePortraitAtCamD, { passive: true });
    updatePortraitAtCamD();
    deskTimeline.scrollTrigger?.refresh();
    portraitTimeline.scrollTrigger?.refresh();

    return () => {
        window.removeEventListener('scroll', updatePortraitAtCamD);
        deskTimeline.scrollTrigger?.kill();
        portraitTimeline.scrollTrigger?.kill();
        deskTimeline.kill();
        portraitTimeline.kill();
    };
}
