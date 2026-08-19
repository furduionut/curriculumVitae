/* IMPORTS */
    import * as THREE from "three";
    import { GUI } from 'dat.gui';


/* DOM ELEMETS */
    const viewport      = document.getElementById('viewport');

/* CAMERA PARAMETERS */
    const orthographicParams = {
        zoom: 2.5,
        width: viewport.clientWidth,
        height: viewport.clientHeight,
        aspect: viewport.clientWidth / viewport.clientHeight,
        dimension: 200,
        far: 200,
        near: 0.1,
        offsetX: 250,
        offsetY: -500
    }

/* CAMERA INITIATION */
    const cameras = {
        orhographic: new THREE.OrthographicCamera
                (
                    -orthographicParams.dimension  *orthographicParams.aspect,  
                    orthographicParams.dimension  *orthographicParams.aspect, 
                    orthographicParams.dimension, 
                    -orthographicParams.dimension, 
                    orthographicParams.near, 
                    orthographicParams.far
                )
    }

/* CAMERA SETUP */
    cameras.orhographic.zoom = orthographicParams.zoom;
    cameras.orhographic.setViewOffset(
        orthographicParams.width,      
        orthographicParams.height,     
        orthographicParams.offsetX, 
        orthographicParams.offsetY,                
        orthographicParams.width,  
        orthographicParams.height);
    cameras.orhographic.updateProjectionMatrix();

/* GUI ELEMENT */
    const gui = new GUI();
    const cameraFolder = gui.addFolder('Camera');

    cameraFolder.add(orthographicParams, 'zoom', 1, 10, 0.01).onChange(value=>{
        cameras.orhographic.zoom = value;
        cameras.orhographic.updateProjectionMatrix();})

    cameraFolder.add(orthographicParams, 'near', 0, 250, 0.001).onChange(value=>{
        cameras.orhographic.near = value;
        cameras.orhographic.updateProjectionMatrix();})

    cameraFolder.add(orthographicParams, 'far', 0, 250, 0.001).onChange(value=>{
        cameras.orhographic.far = value;
        cameras.orhographic.updateProjectionMatrix();})    
        
    cameraFolder.add(orthographicParams, 'offsetX', -1000, 1500, 0.01).onChange(value=>{
        cameras.orhographic.setViewOffset(
            orthographicParams.width,      
            orthographicParams.height,     
            value, 
            orthographicParams.offsetY,                
            orthographicParams.width,  
            orthographicParams.height
        );
        cameras.orhographic.updateProjectionMatrix();})

    cameraFolder.add(orthographicParams, 'offsetY', -1000, 1500, 0.01).onChange(value=>{
        cameras.orhographic.setViewOffset(
            orthographicParams.width,      
            orthographicParams.height,     
            orthographicParams.offsetX,
            value,                
            orthographicParams.width,  
            orthographicParams.height
        );
        cameras.orhographic.updateProjectionMatrix();})    
    
    cameraFolder.open();

/* EXPORTS */
    export {cameras} 