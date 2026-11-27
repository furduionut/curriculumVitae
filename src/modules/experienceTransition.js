import { gsap } from 'gsap';

// Experience category transition. All durations are in seconds.
export const experienceTransitionSettings = {
    fadeOut: 0.35,
    resizeDuration: 1.20,
    fadeIn: 1.5,
    revealDelay: 0.14,
    stagger: 0.18,
    slideY: 16,
    resizeEase: 'sine.inOut',
};

// Keep the panel in normal document flow; do not touch camera or scroll.
export function createExperienceTransition({ panel, render, select }) {
    let busy = false;
    let pending = null;
    let activeType = null;

    const children = () => Array.from(panel.children);
    const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function request(button, type) {
        if (busy) {
            pending = { button, type }; // newest request wins
            return;
        }
        if (type === activeType) return;
        busy = true;
        select(button);

        if (prefersReducedMotion()) {
            render(button, type);
            activeType = type;
            busy = false;
            return;
        }

        const cfg = experienceTransitionSettings;
        const original = {
            height: panel.style.height,
            flexWrap: panel.style.flexWrap,
            overflow: panel.style.overflow,
            pointerEvents: panel.style.pointerEvents,
        };
        // Use the CSS height, which respects the panel's box-sizing setting.
        const measureHeight = () => {
            const h = parseFloat(getComputedStyle(panel).height);
            return Number.isFinite(h) ? h : panel.getBoundingClientRect().height;
        };
        const oldHeight = measureHeight();
        const oldChildren = children();
        const oldShrink = oldChildren.map(el => el.style.flexShrink);

        panel.style.height = `${oldHeight}px`;
        panel.style.flexWrap = 'nowrap'; // prevent a new flex column while height is constrained
        panel.style.overflow = 'hidden';
        panel.style.pointerEvents = 'none';
        oldChildren.forEach(el => { el.style.flexShrink = '0'; });

        function next() {
            activeType = type;
            busy = false;
            const nextRequest = pending;
            pending = null;
            if (nextRequest && nextRequest.type !== activeType) {
                request(nextRequest.button, nextRequest.type);
            }
        }

        function restorePanel() {
            Object.assign(panel.style, original);
        }

        function swap() {
            // Reuse the site's existing loader and description hover/click setup.
            try {
                render(button, type);
            } catch (error) {
                oldChildren.forEach((el, i) => { el.style.flexShrink = oldShrink[i]; });
                gsap.set(oldChildren, { clearProps: 'opacity' });
                restorePanel();
                busy = false;
                pending = null;
                throw error;
            }
            const incoming = children();
            const shrink = incoming.map(el => el.style.flexShrink);
            const cards = incoming.filter(el => !el.classList.contains('timeline'));
            const timeline = incoming.filter(el => el.classList.contains('timeline'));

            // Measure natural content height synchronously, then restore the old
            // height before the browser paints. The glass panel itself stays visible.
            panel.style.height = 'auto';
            panel.style.flexWrap = original.flexWrap;
            const newHeight = measureHeight();
            panel.style.flexWrap = 'nowrap';
            panel.style.height = `${oldHeight}px`;
            incoming.forEach(el => { el.style.flexShrink = '0'; });
            gsap.set(cards, { opacity: 0, y: -cfg.slideY });
            gsap.set(timeline, { opacity: 0 });

            const tl = gsap.timeline({
                onComplete() {
                    incoming.forEach((el, i) => { el.style.flexShrink = shrink[i]; });
                    if (cards.length) gsap.set(cards, { clearProps: 'opacity,transform' });
                    if (timeline.length) gsap.set(timeline, { clearProps: 'opacity' });
                    restorePanel();
                    next();
                },
            });
            tl.to(panel, { height: newHeight, duration: cfg.resizeDuration, ease: cfg.resizeEase }, 0);
            if (cards.length) tl.to(cards, {
                opacity: 1, y: 0, duration: cfg.fadeIn, ease: 'power2.out',
                stagger: { amount: cfg.stagger, from: 'start' },
            }, cfg.revealDelay);
            if (timeline.length) tl.to(timeline, { opacity: 1, duration: cfg.fadeIn, ease: 'sine.out' }, cfg.revealDelay);
        }

        if (oldChildren.length) {
            gsap.to(oldChildren, { opacity: 0, duration: cfg.fadeOut, ease: 'sine.inOut', onComplete: swap });
        } else {
            swap();
        }
    }

    return request;
}
