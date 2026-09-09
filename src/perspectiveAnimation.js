import * as THREE from "three";


/* ---------------------------------------------------------
   STATE
--------------------------------------------------------- */

let camera = null;

const basePosition =
    new THREE.Vector3();

let currentOffset = 0;

let targetOffset = 0;

let maxMovement = 10;


/*
 * Higher = reacts faster.
 * Lower = more floaty.
 */
const SMOOTHING = 5;


/*
 * How much of the camera distance
 * the camera travels downward.
 */
const MOVEMENT_FACTOR = 0.35;


/* ---------------------------------------------------------
   SCROLL
--------------------------------------------------------- */

function handleScroll() {

    if (!camera) {
        return;
    }


    const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;


    if (maxScroll <= 0) {

        targetOffset = 0;

        return;
    }


    /*
     * 0 = top of document
     * 1 = bottom of document
     */
    const progress =
        THREE.MathUtils.clamp(
            window.scrollY / maxScroll,
            0,
            1
        );


    /*
     * Negative Y = camera moves downward.
     */
    targetOffset =
        -progress * maxMovement;
}


/* ---------------------------------------------------------
   INITIALIZE
--------------------------------------------------------- */

export function initPerspectiveAnimation(
    perspectiveCamera
) {

    camera =
        perspectiveCamera;


    /*
     * At first this is only temporary.
     * perspectiveCanvas.js will later send us
     * the final fitted camera position.
     */
    basePosition.copy(
        camera.position
    );


    maxMovement =
        Math.max(
            camera.position.length() *
            MOVEMENT_FACTOR,
            1
        );


    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );


    handleScroll();
}


/* ---------------------------------------------------------
   SET FINAL CAMERA POSITION
--------------------------------------------------------- */

export function setPerspectiveAnimationBasePosition(
    position
) {

    if (!camera) {
        return;
    }


    basePosition.copy(
        position
    );


    /*
     * Scale movement according to
     * actual fitted camera distance.
     */
    maxMovement =
        Math.max(
            position.length() *
            MOVEMENT_FACTOR,
            1
        );


    /*
     * Recalculate target in case the
     * page is already scrolled.
     */
    handleScroll();


    /*
     * Prevent snapping when model first loads.
     */
    currentOffset =
        targetOffset;
}


/* ---------------------------------------------------------
   UPDATE
--------------------------------------------------------- */

export function updatePerspectiveAnimation(
    deltaTime
) {

    if (!camera) {
        return;
    }


    currentOffset =
        THREE.MathUtils.damp(
            currentOffset,
            targetOffset,
            SMOOTHING,
            deltaTime
        );


    /*
     * IMPORTANT:
     *
     * Only Y changes.
     *
     * X and Z remain exactly where
     * perspectiveCanvas.js fitted them.
     */
    camera.position.set(
        basePosition.x,
        basePosition.y +
            currentOffset,
        basePosition.z
    );
}


/* ---------------------------------------------------------
   DESTROY
--------------------------------------------------------- */

export function destroyPerspectiveAnimation() {

    window.removeEventListener(
        "scroll",
        handleScroll
    );


    camera = null;

    currentOffset = 0;

    targetOffset = 0;

    maxMovement = 10;


    basePosition.set(
        0,
        0,
        0
    );
}