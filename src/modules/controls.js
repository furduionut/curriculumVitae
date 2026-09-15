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

    // save initial state
    control.initialPosition = camera.position.clone();
    control.initialTarget = control.target.clone();

    // add reset method
    control.resetToInitial = () => {
        camera.position.copy(control.initialPosition);
        control.target.copy(control.initialTarget);
        control.update();
    };

    return control;
};

/* EXPORTS */


export { controls }
