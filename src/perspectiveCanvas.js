import * as THREE from "three";

import {
    GLTFLoader,
    DRACOLoader
} from "three/examples/jsm/Addons.js";

import {
    RGBELoader
} from "three/examples/jsm/loaders/RGBELoader.js";

import {
    initPerspectiveAnimation,
    updatePerspectiveAnimation,
    setPerspectiveAnimationBasePosition,
    destroyPerspectiveAnimation
} from "./perspectiveAnimation.js";


/* ---------------------------------------------------------
   MODEL
--------------------------------------------------------- */

const PERSPECTIVE_MODEL_URL =
    `${import.meta.env.BASE_URL}perspective.glb`;


/* ---------------------------------------------------------
   GLOBAL VARIABLES
--------------------------------------------------------- */

let host = null;

let layer = null;

let scene = null;

let camera = null;

let renderer = null;

let currentModel = null;

let animationFrameId = null;

let gltfLoader = null;

let hdriTexture = null;


/*
 * Separate clock exclusively for
 * perspective animation.
 */
const perspectiveClock =
    new THREE.Clock();


/* ---------------------------------------------------------
   CAMERA SETTINGS
--------------------------------------------------------- */

/*
 * Determines viewing direction.
 *
 * Distance gets calculated automatically
 * according to model dimensions.
 */
const CAMERA_DIRECTION =
    new THREE.Vector3(
        1,
        0.55,
        1
    ).normalize();


/* ---------------------------------------------------------
   RESIZE
--------------------------------------------------------- */

function resizePerspectiveCanvas() {

    if (
        !host ||
        !camera ||
        !renderer
    ) {
        return;
    }


    const width =
        host.clientWidth;


    const height =
        host.clientHeight;


    if (
        width <= 0 ||
        height <= 0
    ) {
        return;
    }


    camera.aspect =
        width / height;


    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height,
        false
    );


    /*
     * Refit model to updated aspect ratio.
     */
    if (currentModel) {

        fitCameraToModel(
            currentModel,
            false
        );

    }
}


/* ---------------------------------------------------------
   RENDER LOOP
--------------------------------------------------------- */

function renderPerspectiveCanvas() {

    animationFrameId =
        requestAnimationFrame(
            renderPerspectiveCanvas
        );


    if (
        !renderer ||
        !scene ||
        !camera
    ) {
        return;
    }


    /*
     * Delta time used for smooth damping.
     */
    const deltaTime =
        Math.min(
            perspectiveClock.getDelta(),
            0.1
        );


    /*
     * This changes ONLY the
     * perspective camera.
     */
    updatePerspectiveAnimation(
        deltaTime
    );


    renderer.render(
        scene,
        camera
    );
}


/* ---------------------------------------------------------
   LOADERS
--------------------------------------------------------- */

function setupLoaders() {

    const dracoLoader =
        new DRACOLoader();


    dracoLoader.setDecoderPath(
        "./src/utils/draco/"
    );


    gltfLoader =
        new GLTFLoader();


    gltfLoader.setDRACOLoader(
        dracoLoader
    );
}


/* ---------------------------------------------------------
   HDRI
--------------------------------------------------------- */

function loadHDRI() {

    const hdriUrl =
        `${import.meta.env.BASE_URL}assets/images/hdri.hdr`;


    const hdrLoader =
        new RGBELoader();


    hdrLoader.load(

        hdriUrl,


        (texture) => {

            texture.mapping =
                THREE.EquirectangularReflectionMapping;


            hdriTexture =
                texture;


            /*
             * HDRI affects reflections /
             * lighting only.
             */
            scene.environment =
                texture;


            console.log(
                "Perspective HDRI loaded:",
                hdriUrl
            );

        },


        undefined,


        (error) => {

            console.error(
                "Perspective HDRI error:",
                error
            );

        }

    );
}


/* ---------------------------------------------------------
   FIT CAMERA TO MODEL
--------------------------------------------------------- */

function fitCameraToModel(
    model,
    centerModel = true
) {

    if (
        !model ||
        !camera
    ) {
        return;
    }


    /*
     * Update transforms.
     */
    model.updateMatrixWorld(
        true
    );


    /* -----------------------------------------------------
       INITIAL BOUNDING BOX
    ----------------------------------------------------- */

    let box =
        new THREE.Box3()
            .setFromObject(
                model
            );


    if (box.isEmpty()) {

        console.warn(
            "Perspective model bounding box is empty."
        );

        return;
    }


    /* -----------------------------------------------------
       CENTER MODEL
    ----------------------------------------------------- */

    if (centerModel) {

        const center =
            box.getCenter(
                new THREE.Vector3()
            );


        /*
         * Put model's bounding-box centre
         * at world 0,0,0.
         */
        model.position.sub(
            center
        );


        model.updateMatrixWorld(
            true
        );


        /*
         * Recalculate bounding box after move.
         */
        box =
            new THREE.Box3()
                .setFromObject(
                    model
                );
    }


    /* -----------------------------------------------------
       MODEL SIZE
    ----------------------------------------------------- */

    const size =
        box.getSize(
            new THREE.Vector3()
        );


    const maxSize =
        Math.max(
            size.x,
            size.y,
            size.z
        );


    if (
        !Number.isFinite(maxSize) ||
        maxSize <= 0
    ) {

        console.warn(
            "Perspective model has invalid dimensions:",
            size
        );

        return;
    }


    /* -----------------------------------------------------
       CAMERA FOV
    ----------------------------------------------------- */

    const verticalFov =
        THREE.MathUtils.degToRad(
            camera.fov
        );


    const horizontalFov =
        2 *
        Math.atan(
            Math.tan(
                verticalFov / 2
            ) *
            camera.aspect
        );


    /*
     * Use smaller field of view so
     * model fits horizontally AND vertically.
     */
    const limitingFov =
        Math.min(
            verticalFov,
            horizontalFov
        );


    /* -----------------------------------------------------
       CAMERA DISTANCE
    ----------------------------------------------------- */

    let distance =
        maxSize /
        (
            2 *
            Math.tan(
                limitingFov / 2
            )
        );


    /*
     * Add margin around model.
     */
    distance *=
        1.35;


    /* -----------------------------------------------------
       CAMERA POSITION
    ----------------------------------------------------- */

    camera.position.copy(
        CAMERA_DIRECTION
    );


    camera.position.multiplyScalar(
        distance
    );


    /*
     * Initial orientation.
     *
     * Scroll animation later translates
     * the camera vertically without
     * changing this orientation.
     */
    camera.lookAt(
        0,
        0,
        0
    );


    /* -----------------------------------------------------
       CLIPPING PLANES
    ----------------------------------------------------- */

    camera.near =
        Math.max(
            distance / 1000,
            0.001
        );


    camera.far =
        Math.max(
            distance * 100,
            maxSize * 100
        );


    camera.updateProjectionMatrix();


    /* -----------------------------------------------------
       VERY IMPORTANT

       Now that camera.position is FINAL,
       tell perspectiveAnimation.js where
       the camera starts.
    ----------------------------------------------------- */

    setPerspectiveAnimationBasePosition(
        camera.position
    );


    console.log(
        "Perspective model size:",
        size
    );


    console.log(
        "Perspective camera distance:",
        distance
    );


    console.log(
        "Perspective camera base position:",
        camera.position
    );
}


/* ---------------------------------------------------------
   INITIALIZE
--------------------------------------------------------- */

export function initPerspectiveCanvas(
    hostElement =
        document.getElementById(
            "canvas"
        )
) {

    if (!hostElement) {

        console.error(
            "Perspective canvas: #canvas not found"
        );

        return;
    }


    /*
     * Prevent duplicate initialization.
     */
    if (renderer) {

        return;
    }


    host =
        hostElement;


    /* -----------------------------------------------------
       HOST STACKING
    ----------------------------------------------------- */

    const currentPosition =
        getComputedStyle(
            host
        ).position;


    if (
        currentPosition === "static"
    ) {

        host.style.position =
            "relative";
    }


    /* -----------------------------------------------------
       PERSPECTIVE LAYER
    ----------------------------------------------------- */

    layer =
        document.createElement(
            "div"
        );


    layer.id =
        "perspectiveCanvas";


    Object.assign(
        layer.style,
        {

            position:
                "absolute",

            inset:
                "0",

            width:
                "100%",

            height:
                "100%",

            zIndex:
                "0",

            pointerEvents:
                "none",

            overflow:
                "hidden"

        }
    );


    /*
     * Perspective canvas stays below
     * existing isometric canvas.
     */
    host.prepend(
        layer
    );


    /* -----------------------------------------------------
       SCENE
    ----------------------------------------------------- */

    scene =
        new THREE.Scene();


    /* -----------------------------------------------------
       BACKGROUND
    ----------------------------------------------------- */

    const mainColor =
        getComputedStyle(
            document.documentElement
        )
        .getPropertyValue(
            "--first-background-color"
        )
        .trim();


    scene.background =
        new THREE.Color(
            mainColor ||
            "#dcdcdc"
        );


    /* -----------------------------------------------------
       VIEWPORT SIZE
    ----------------------------------------------------- */

    const width =
        Math.max(
            host.clientWidth,
            1
        );


    const height =
        Math.max(
            host.clientHeight,
            1
        );


    /* -----------------------------------------------------
       CAMERA
    ----------------------------------------------------- */

    camera =
        new THREE.PerspectiveCamera(

            45,

            width / height,

            0.01,

            6000

        );


    /*
     * Temporary camera location.
     *
     * fitCameraToModel() replaces this
     * as soon as GLB loads.
     */
    camera.position.set(
        10,
        10,
        10
    );


    camera.lookAt(
        0,
        0,
        0
    );


    /* -----------------------------------------------------
       INITIALIZE PERSPECTIVE ANIMATION

       This receives ONLY this camera.
       It cannot affect the orthographic one.
    ----------------------------------------------------- */

    initPerspectiveAnimation(
        camera
    );


    /* -----------------------------------------------------
       RENDERER
    ----------------------------------------------------- */

    renderer =
        new THREE.WebGLRenderer({

            antialias:
                true

        });


    renderer.setPixelRatio(

        Math.min(
            window.devicePixelRatio,
            2
        )

    );


    renderer.setSize(
        width,
        height,
        false
    );


    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;


    renderer.toneMappingExposure =
        1;


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    renderer.domElement.style.width =
        "100%";


    renderer.domElement.style.height =
        "100%";


    renderer.domElement.style.display =
        "block";


    layer.appendChild(
        renderer.domElement
    );


    /* -----------------------------------------------------
       FALLBACK LIGHTS
    ----------------------------------------------------- */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            0.25
        );


    const directionalLight =
        new THREE.DirectionalLight(
            0xffffff,
            0.35
        );


    directionalLight.position.set(
        5,
        10,
        5
    );


    scene.add(
        ambientLight,
        directionalLight
    );


    /* -----------------------------------------------------
       LOADERS
    ----------------------------------------------------- */

    setupLoaders();


    /* -----------------------------------------------------
       MODEL

       Must happen AFTER setupLoaders().
    ----------------------------------------------------- */

    setPerspectiveModel(
        PERSPECTIVE_MODEL_URL
    );


    /* -----------------------------------------------------
       HDRI
    ----------------------------------------------------- */

    loadHDRI();


    /* -----------------------------------------------------
       RESIZE
    ----------------------------------------------------- */

    window.addEventListener(
        "resize",
        resizePerspectiveCanvas
    );


    resizePerspectiveCanvas();


    /* -----------------------------------------------------
       CLOCK
    ----------------------------------------------------- */

    perspectiveClock.start();


    /* -----------------------------------------------------
       START RENDERING
    ----------------------------------------------------- */

    renderPerspectiveCanvas();
}


/* ---------------------------------------------------------
   LOAD / CHANGE MODEL
--------------------------------------------------------- */

export function setPerspectiveModel(
    modelUrl
) {

    if (
        !scene ||
        !gltfLoader
    ) {

        console.warn(
            "Perspective canvas not initialized"
        );

        return;
    }


    /*
     * Null means remove model.
     */
    if (!modelUrl) {

        clearPerspectiveModel();

        return;
    }


    console.log(
        "Loading perspective model:",
        modelUrl
    );


    gltfLoader.load(

        modelUrl,


        /* SUCCESS */
        (gltf) => {

            clearPerspectiveModel();


            currentModel =
                gltf.scene;


            currentModel.position.set(
                0,
                0,
                0
            );


            scene.add(
                currentModel
            );


            currentModel.updateMatrixWorld(
                true
            );


            /*
             * Centre model + automatically
             * fit camera.
             */
            fitCameraToModel(
                currentModel,
                true
            );


            console.log(
                "Perspective model loaded:",
                modelUrl
            );

        },


        /* PROGRESS */
        (xhr) => {

            if (
                xhr.total > 0
            ) {

                const percent =
                    (
                        xhr.loaded /
                        xhr.total
                    ) *
                    100;


                console.log(
                    `Perspective model: ${percent.toFixed(1)}%`
                );

            }

        },


        /* ERROR */
        (error) => {

            console.error(
                "Perspective model error:",
                modelUrl,
                error
            );

        }

    );
}


/* ---------------------------------------------------------
   REMOVE MODEL
--------------------------------------------------------- */

export function clearPerspectiveModel() {

    if (
        !currentModel ||
        !scene
    ) {

        return;
    }


    scene.remove(
        currentModel
    );


    currentModel.traverse(
        (child) => {

            if (!child.isMesh) {

                return;
            }


            if (
                child.geometry
            ) {

                child.geometry.dispose();
            }


            const materials =
                Array.isArray(
                    child.material
                )

                    ? child.material

                    : [
                        child.material
                    ];


            for (
                const material
                of materials
            ) {

                if (
                    material
                ) {

                    material.dispose();
                }

            }

        }
    );


    currentModel =
        null;
}


/* ---------------------------------------------------------
   MANUAL CAMERA
--------------------------------------------------------- */

export function setPerspectiveCamera(
    position,
    target =
        new THREE.Vector3(
            0,
            0,
            0
        )
) {

    if (!camera) {

        return;
    }


    if (position) {

        camera.position.set(
            position.x,
            position.y,
            position.z
        );


        /*
         * New manual position becomes
         * the scroll-animation base.
         */
        setPerspectiveAnimationBasePosition(
            camera.position
        );
    }


    camera.lookAt(
        target.x,
        target.y,
        target.z
    );


    camera.updateProjectionMatrix();
}


/* ---------------------------------------------------------
   DESTROY
--------------------------------------------------------- */

export function destroyPerspectiveCanvas() {

    /* -----------------------------------------------------
       ANIMATION LOOP
    ----------------------------------------------------- */

    if (
        animationFrameId !== null
    ) {

        cancelAnimationFrame(
            animationFrameId
        );


        animationFrameId =
            null;
    }


    /* -----------------------------------------------------
       SCROLL ANIMATION
    ----------------------------------------------------- */

    destroyPerspectiveAnimation();


    /* -----------------------------------------------------
       RESIZE LISTENER
    ----------------------------------------------------- */

    window.removeEventListener(
        "resize",
        resizePerspectiveCanvas
    );


    /* -----------------------------------------------------
       MODEL
    ----------------------------------------------------- */

    clearPerspectiveModel();


    /* -----------------------------------------------------
       HDRI
    ----------------------------------------------------- */

    if (
        hdriTexture
    ) {

        hdriTexture.dispose();


        hdriTexture =
            null;
    }


    /* -----------------------------------------------------
       RENDERER
    ----------------------------------------------------- */

    if (
        renderer
    ) {

        renderer.dispose();
    }


    /* -----------------------------------------------------
       DOM
    ----------------------------------------------------- */

    if (
        layer
    ) {

        layer.remove();
    }


    /* -----------------------------------------------------
       RESET
    ----------------------------------------------------- */

    renderer =
        null;


    camera =
        null;


    scene =
        null;


    layer =
        null;


    host =
        null;


    gltfLoader =
        null;
}