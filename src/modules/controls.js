/* IMPORTS */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/* DOM ELEMENT */
const controls = (camera, renderDom) => {
    const control = new OrbitControls(camera, renderDom);

    control.enableRotate = true;
    control.enablePan = true;
    control.enableZoom = false;
    control.enableDamping = true;
    control.dampingFactor = 0.05;

    // SAVE INITIAL CAMERA STATE
    const initialCameraPosition = camera.position.clone();
    const initialControlsTarget = control.target.clone();
    const initialCameraZoom = camera.zoom;

    let isReturningCamera = false;

    // RETURN TO INITIAL CAMERA POSITION WITH EASING
    const returnCameraToInitialView = () => {
        if (isReturningCamera) return;

        isReturningCamera = true;
        control.enabled = false;

        const startPosition = camera.position.clone();
        const startTarget = control.target.clone();
        const startZoom = camera.zoom;

        const duration = 1000;
        const startTime = performance.now();

        // Cute overshoot easing
        const easeOutBack = (t) => {
            const overshoot = 1.4;
            const value = t - 1;
            return (
                1 +
                (overshoot + 1) * value * value * value +
                overshoot * value * value
            );
        };

        const animateReturn = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutBack(progress);

            camera.position.lerpVectors(
                startPosition,
                initialCameraPosition,
                easedProgress
            );

            control.target.lerpVectors(
                startTarget,
                initialControlsTarget,
                easedProgress
            );

            camera.zoom = THREE.MathUtils.lerp(
                startZoom,
                initialCameraZoom,
                easedProgress
            );

            camera.updateProjectionMatrix();
            control.update();

            if (progress < 1) {
                requestAnimationFrame(animateReturn);
            } else {
                // Snap to exact final values
                camera.position.copy(initialCameraPosition);
                control.target.copy(initialControlsTarget);
                camera.zoom = initialCameraZoom;

                camera.updateProjectionMatrix();
                control.update();

                control.enabled = true;
                isReturningCamera = false;
            }
        };

        requestAnimationFrame(animateReturn);
    };

    // TRIGGER RETURN WHEN USER STOPS INTERACTION
    control.addEventListener("end", () => {
        returnCameraToInitialView();
    });

    // OPTIONAL: manual reset method
    control.resetToInitial = returnCameraToInitialView;

    return control;
};

/* EXPORTS */
export { controls };
