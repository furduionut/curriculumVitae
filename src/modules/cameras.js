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
    let cameraTop       = 50;
    let cameraBottom    = -50;
    let cameraRight     = 50;
    let cameraLeft      = -50;

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
    cameras.orhographic.position.set(0,0,0);

/* EXPORTS */
    export {cameras} 