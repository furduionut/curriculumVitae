/* IMPORTS */
import * as THREE from "three";
import { styles } from "./styles";

/* DOM ELEMENT */

/* SCENE INITIATION */
const scenes = {
    mainScene: new THREE.Scene()
}

/* SCENE BACKGROUND */
const   cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.setPath('./assets/textures/environment/pavStudio/cubeTextures/');

const   cubeTextures = cubeTextureLoader.load([
    'px.png',
    'nx.png',
    'py.png',
    'ny.png',
    'pz.png',
    'nz.png'
], ()=>{console.log("cubeTextures were loaded")}, ()=>{}, ()=>{"cubeTextures failed to load"});
        
        cubeTextures.colorSpace = THREE.SRGBColorSpace;

console.log(cubeTextures);

/* SCENE PARAMETERS */
    scenes.mainScene.background = new THREE.Color(styles.color1);
    scenes.mainScene.background = cubeTextures;

/* EXPORT */

export { scenes }