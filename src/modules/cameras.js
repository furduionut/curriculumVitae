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
        far: 1000,
        near: 0.01,
        offsetX: 250,
        offsetY: -500
    }

    const perpectiveParams = {
        fov: 75,
        width: viewport.clientWidth,
        height: viewport.clientHeight,
        aspect: viewport.clientWidth / viewport.clientHeight,
        far: 200,
        near: 0.1
    }

/* CAMERA INITIATION */
    const cameras = {
        orthographic: new THREE.OrthographicCamera
                (
                    -orthographicParams.dimension  *orthographicParams.aspect,  
                    orthographicParams.dimension  *orthographicParams.aspect, 
                    orthographicParams.dimension, 
                    -orthographicParams.dimension, 
                    orthographicParams.near, 
                    orthographicParams.far
                ),
        perspective: new THREE.PerspectiveCamera
                (
                    75, 
                    orthographicParams.aspect, 
                    orthographicParams.near, 
                    orthographicParams.far
                )
    }

/* CAMERA SETUP */
    cameras.orthographic.zoom = orthographicParams.zoom;
    cameras.orthographic.setViewOffset(
        orthographicParams.width,      
        orthographicParams.height,     
        orthographicParams.offsetX, 
        orthographicParams.offsetY,                
        orthographicParams.width,  
        orthographicParams.height);
    cameras.orthographic.updateProjectionMatrix();

/* GUI ELEMENT */
    const gui = new GUI();
    const cameraFolder = gui.addFolder('Orthographic Camera');

    cameraFolder.add(orthographicParams, 'zoom', 1, 10, 0.01).onChange(value=>{
        cameras.orthographic.zoom = value;
        cameras.orthographic.updateProjectionMatrix();});

    cameraFolder.add(orthographicParams, 'near', 0, 300, 0.001).onChange(value=>{
        cameras.orthographic.near = value;
        cameras.orthographic.updateProjectionMatrix();});

    cameraFolder.add(orthographicParams, 'far', 0, 250, 0.001).onChange(value=>{
        cameras.orthographic.far = value;
        cameras.orthographic.updateProjectionMatrix();});    
        
    cameraFolder.add(orthographicParams, 'offsetX', -1000, 1500, 0.01).onChange(value=>{
        cameras.orthographic.setViewOffset(
            orthographicParams.width,      
            orthographicParams.height,     
            value, 
            orthographicParams.offsetY,                
            orthographicParams.width,  
            orthographicParams.height
        );
        cameras.orthographic.updateProjectionMatrix();});

    cameraFolder.add(orthographicParams, 'offsetY', -1000, 1500, 0.01).onChange(value=>{
        cameras.orthographic.setViewOffset(
            orthographicParams.width,      
            orthographicParams.height,     
            orthographicParams.offsetX,
            value,                
            orthographicParams.width,  
            orthographicParams.height
        );
        cameras.orthographic.updateProjectionMatrix();});    
    
    cameraFolder.open();

    /* const perspectiveCameraFolder = gui.addFolder('Perspective Camera');
        perspectiveCameraFolder.add(perpectiveParams, 'fov', 1, 180, 0.01).onChange(value=>{
            cameras.perspective.fov = value;
            cameras.perspective.updateProjectionMatrix();});

    perspectiveCameraFolder.open(); */

/* EXPORTS */
    export {cameras} 