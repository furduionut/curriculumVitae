/* IMPORTS */
    import * as THREE from "three";

/* DOM ELEMETS */
    const viewport      = document.getElementById('viewport');
    const viewport2     = document.getElementById('viewport2');

/* CAMERA PARAMETERS */
    const orthographicParams = {
        zoom: 1,
        width: viewport2.clientWidth,
        height: viewport2.clientHeight,
        aspect: viewport2.clientWidth / viewport2.clientHeight,
        dimension: 15,
        far: 50,
        near: 0.001,
        offsetX: 0,
        offsetY: 0,
        positionX: 10,
        positionY: 10,
        positionZ: 10,
        rotationX: 1,
        rotationY: 1,
        rotationZ: 1
    }

    function resizeOrthoCamera(width, height) {
        const aspect = width / height;
    
        cameras.orthographic.left   = -orthographicParams.dimension * aspect;
        cameras.orthographic.right  =  orthographicParams.dimension * aspect;
        cameras.orthographic.top    =  orthographicParams.dimension;
        cameras.orthographic.bottom = -orthographicParams.dimension;
    
        cameras.orthographic.updateProjectionMatrix();
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
    cameras.orthographic.position.set(
        orthographicParams.positionX,
        orthographicParams.positionY,
        orthographicParams.positionZ
    );

    cameras.orthographic.rotation.set(
        orthographicParams.rotationX,
        orthographicParams.rotationY,
        orthographicParams.rotationZ,
    );

    cameras.perspective.position.set(
        perpectiveParams.positionX,
        perpectiveParams.positionX,
        perpectiveParams.positionX
    );

    cameras.perspective.rotation.set(
        10 * Math.PI,
        10 * Math.PI,
        10 * Math.PI
    );

    cameras.perspective.updateProjectionMatrix();
    cameras.orthographic.updateProjectionMatrix();

/* EXPORTS */
    export {cameras, resizeOrthoCamera} 