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
  
    //  LOCK INTERACTION WHEN SCROLLING
    let isInteractionLocked = false;
    let returnFrameId = null;




        // TRACK ACTIVE POINTERS (MOUSE / TOUCH)
        const activePointers = new Map();

        renderDom.addEventListener("pointerdown", (event) => {
            if (!isInteractionLocked) {
                activePointers.set(event.pointerId, event.pointerType);
            }
        }, true);

        const removeActivePointer = (event) => {
            activePointers.delete(event.pointerId);
        };

        renderDom.ownerDocument.addEventListener(
            "pointerup",
            removeActivePointer,
            true
        );

        renderDom.ownerDocument.addEventListener(
            "pointercancel",
            removeActivePointer,
            true
        );






    control.setInteractionLocked = (locked) => {
        locked = Boolean(locked);

        if (isInteractionLocked === locked) return;

        isInteractionLocked = locked;

        if (locked) {

                // Immediately block further camera interaction
                control.enabled = false;

                // Force-end any drag still active at the keyframe
                for (const [pointerId, pointerType] of [...activePointers]) {
                    renderDom.dispatchEvent(
                        new PointerEvent("pointercancel", {
                            bubbles: true,
                            pointerId,
                            pointerType
                        })
                    );
                }

                activePointers.clear();


            
            // Cancel any unfinished camera reset
            if (returnFrameId !== null) {
                cancelAnimationFrame(returnFrameId);
                returnFrameId = null;
            }

            isReturningCamera = false;

            // // Disable mouse interaction
            // control.enabled = false;
            // control.enableDamping = false;

            // // Reset any user-created pan offset
            // control.target.copy(initialControlsTarget);
            // control.update();

            // Disable mouse interaction
            control.enabled = false;
            control.enableDamping = false;

            // Clear the previous OrbitControls rotation and pan state
            control.reset();

            // Restore the intended plan-view camera position
            camera.position.set(
                0,
                initialCameraPosition.y,
                0.0001
            );

            // Restore the original camera target
            control.target.copy(initialControlsTarget);

            // Recalculate the camera orientation
            control.update();


        } else {
            // Restore interaction when scrolling back
            control.enableDamping = true;
            control.enabled = true; 
        }
    };



    // RETURN TO INITIAL CAMERA POSITION WITH EASING
    const returnCameraToInitialView = () => {
        if (isReturningCamera || isInteractionLocked) return;

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
