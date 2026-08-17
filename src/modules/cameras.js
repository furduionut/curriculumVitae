/* IMPORTS */
    import * as THREE from "three";

/* DOM ELEMETS */
    const viewport      = document.getElementById('viewport');

/* CAMERA PARAMETERS */
    let canvasWidth     = viewport.clientWidth;
    let canvasHeight    = viewport.clientHeight;
    let cameraAspect    = canvasWidth / canvasHeight;
    let cameraDim       = 200;
    let cameraFar       = 1000;
    let cameraNear      = 0.1;
    let cameraTop       = cameraDim;
    let cameraBottom    = cameraDim;
    let cameraRight     = cameraDim;
    let cameraLeft      = cameraDim;

/* CAMERA INITIATION */
    const cameras = {
        orhographic: new THREE.OrthographicCamera(
                    -cameraLeft  *cameraAspect,  
                    cameraRight  *cameraAspect, 
                    cameraTop, 
                    - cameraBottom, 
                    cameraNear, 
                    cameraFar)}
        
    cameras.orhographic.position.set(0, 100, 0);
    cameras.orhographic.zoom = 1.5;
    cameras.orhographic.updateProjectionMatrix();
    
/* CAMERA SETUP */

/* EXPORTS */
    export {cameras} 