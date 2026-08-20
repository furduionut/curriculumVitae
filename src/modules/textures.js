/* IMPORTS */
import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/Addons.js";

/* CUBE PROJECTION */
    const   cubeTextureLoader = new THREE.CubeTextureLoader();
            cubeTextureLoader.setPath('./assets/textures/environment/pavStudio4k/cubeTextures/');

    const   cubeTextures = cubeTextureLoader.load([
        'px.png',
        'nx.png',
        'py.png',
        'ny.png',
        'pz.png',
        'nz.png'], 
        ()=>{}, 
        ()=>{}, 
        ()=>{});

/* HDR PROJECTION */
    const   hdrLoader = new HDRLoader();
    const   hdrTexture = hdrLoader.load('./assets/textures/environment/pavStudio/pav_studio_03_1k.hdr');
            hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
    
export {hdrTexture}