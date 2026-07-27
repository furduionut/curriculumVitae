/* IMPORTS */
    import * as THREE from "three";

/* DOM ELEMETS */
    const viewport      = document.getElementById('viewport');

/* CAMERA PARAMETERS */
    let canvasWidth     = viewport.clientWidth;
    let canvasHeight    = viewport.clientHeight;
    let cameraAspect    = canvasWidth / canvasHeight;
    let cameraFar       = 6000;
    let cameraNear      = 0.01;
    let cameraTop       = 25;
    let cameraBottom    = -25;
    let cameraRight     = 25;
    let cameraLeft      = -25;

/* CAMERA INITIATION */
    const cameras = {
        orhographic: new THREE.OrthographicCamera(
                    cameraLeft  *cameraAspect,  
                    cameraRight  *cameraAspect, 
                    cameraTop, 
                    cameraBottom, 
                    cameraNear, 
                    cameraFar)}

/* CAMERA SETUP */

/* EXPORTS */
    export {cameras} 