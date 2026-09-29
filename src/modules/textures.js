/* IMPORTS */
import * as THREE               from "three";
import { HDRLoader }            from "three/examples/jsm/Addons.js";
import { UltraHDRLoader }       from "three/examples/jsm/Addons.js";

let hdrTexture, cubeTexture, exrTexture, envMap;

/* ENVIRONMENT MAP */

/* CUBE PROJECTION */
        const   cubeTextureLoader = new THREE.CubeTextureLoader();

/* HDR PROJECTION */
        const   hdrLoader       = new HDRLoader();
        const   ultraHDRLoader  = new UltraHDRLoader();

/* EXR PROJECTION */

export { hdrTexture, cubeTexture, exrTexture, envMap }