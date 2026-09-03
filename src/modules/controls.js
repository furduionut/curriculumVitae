/* IMPORTS */
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


/* DOM ELEMENT */
const controls = (camera, renderDom) => {
    const control = new OrbitControls(camera, renderDom);
    control.enableRotate = true;
    control.enablePan = false;
    control.enableZoom = false;
    control.enableDamping = true;
    control.dampingFactor = 0.05;
    return control
};


/* EXPORTS */


export { controls }
