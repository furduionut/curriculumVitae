/* IMPORTS */
    import * as THREE from "three";
    import { GUI } from 'dat.gui';

/* DOM ELEMETS */
    const viewport      = document.getElementById('viewport');
    const viewport2     = document.getElementById('viewport2');

/* CAMERA PARAMETERS */
    const orthographicParams = {
        zoom: 1,
        width: viewport2.clientWidth,
        height: viewport2.clientHeight,
        aspect: viewport2.clientWidth / viewport2.clientHeight,
        dimension: 10,
        far: 25,
        near: 0.01,
        offsetX: 250,
        offsetY: -750
    }

    const perpectiveParams = {
        fov: 30,
        width: viewport.clientWidth,
        height: viewport.clientHeight,
        aspect: viewport.clientWidth / viewport.clientHeight,
        far: 150,
        near: 0.01,
        positionX: 10,
        positionY: 10,
        positionZ: 10,
        rotationX: 1,
        rotationY: 1,
        rotationZ: 1
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
                    perpectiveParams.fov, 
                    perpectiveParams.aspect, 
                    perpectiveParams.near, 
                    perpectiveParams.far
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

    cameras.perspective.position.set(
        perpectiveParams.positionX,
        perpectiveParams.positionX,
        perpectiveParams.positionX);

    cameras.perspective.rotation.set(
        10 * Math.PI,
        10 * Math.PI,
        10 * Math.PI
    )

    cameras.perspective.zoom = 2;
    cameras.perspective.updateProjectionMatrix();
    cameras.perspective.lookAt(-5, 0, -10);
    cameras.perspective.rotation.set(1, 3, 3)

/* GUI ELEMENT */
    const gui = new GUI();
    const orthocameraFolder = gui.addFolder('Orthographic Camera');

    orthocameraFolder.add(orthographicParams, 'zoom', 1, 2.5, 0.01).onChange(value=>{
        cameras.orthographic.zoom = value;
        cameras.orthographic.updateProjectionMatrix();});

    orthocameraFolder.add(orthographicParams, 'near', 0, 25, 0.01).onChange(value=>{
        cameras.orthographic.near = value;
        cameras.orthographic.updateProjectionMatrix();});

    orthocameraFolder.add(orthographicParams, 'far', 0, 25, 0.01).onChange(value=>{
        cameras.orthographic.far = value;
        cameras.orthographic.updateProjectionMatrix();});    
        
    orthocameraFolder.add(orthographicParams, 'offsetX', -10, 15, 0.01).onChange(value=>{
        cameras.orthographic.setViewOffset(
            orthographicParams.width,      
            orthographicParams.height,     
            value, 
            orthographicParams.offsetY,                
            orthographicParams.width,  
            orthographicParams.height
        );
        cameras.orthographic.updateProjectionMatrix();});

    orthocameraFolder.add(orthographicParams, 'offsetY', -10, 15, 0.01).onChange(value=>{
        cameras.orthographic.setViewOffset(
            orthographicParams.width,      
            orthographicParams.height,     
            orthographicParams.offsetX,
            value,                
            orthographicParams.width,  
            orthographicParams.height
        );
        cameras.orthographic.updateProjectionMatrix();});    
    
    orthocameraFolder.close();

    const perspCameraFolder = gui.addFolder('Perspective Camera');

    perspCameraFolder.add(perpectiveParams, 'fov', 1, 75, 0.01).onChange(value=>{
        cameras.perspective.fov = value;
        cameras.perspective.updateProjectionMatrix();});

    perspCameraFolder.add(perpectiveParams, 'near', 0.01, 50, 0.01).onChange(value=>{    
        cameras.perspective.near = value;
        cameras.perspective.updateProjectionMatrix();});

    perspCameraFolder.add(perpectiveParams, 'far', 0.01, 100, 0.01).onChange(value=>{
        cameras.perspective.far = value;
        cameras.perspective.updateProjectionMatrix();});

    perspCameraFolder.add(perpectiveParams, 'positionX', -50, 50, 0.01).onChange(value=>{
        cameras.perspective.position.x = value;
        cameras.perspective.updateProjectionMatrix();});
    
    perspCameraFolder.add(perpectiveParams, 'positionY', -50, 50, 0.01).onChange(value=>{
        cameras.perspective.position.y = value;
        cameras.perspective.updateProjectionMatrix();});

    perspCameraFolder.add(perpectiveParams, 'positionZ', -50, 50, 0.01).onChange(value=>{
        cameras.perspective.position.z = value;
        cameras.perspective.updateProjectionMatrix();});

    perspCameraFolder.add(perpectiveParams, 'rotationX', -50, 50, 0.01).onChange(value=>{
        cameras.perspective.rotation.x = value;
        cameras.perspective.updateProjectionMatrix();});

    perspCameraFolder.close();

/* CAMERA INITIATION */

/* CAMERA ANIMATION */


/* EXPORTS */
    export {cameras} 