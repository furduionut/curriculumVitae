/* IMPORTS */
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


/* DOM ELEMENT */
const controls = (camera, renderDom) => {
    const control = new OrbitControls(camera, renderDom);
    control.target.set(-5,-10, -5);
    control.enableDamping = true;
    control.dampingFactor = 0.05;
    control.screenSpacePanning = false;
    control.enableZoom = true;
    control.zoomToCursor = false;
    control.enablePan = true;
    control.zoomSpeed = 1.2;
    control.minDistance = 10;  // Limit zoom to a certain minimum distance
    control.maxDistance = 10; // Limit zoom to a certain maximum distance
    control.maxPolarAngle = Math.PI / 3; // Prevent vertical rotation (limit pitch to 90 degrees)
    control.minPolarAngle = Math.PI / 3; // Lock vertical axis at 90 degrees (horizontal only)
    return control
};


/* EXPORTS */


export { controls }
