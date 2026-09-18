/* IMPORTS */
import * as THREE from "three";
import { styles } from "./styles";

/* DOM ELEMENT */

/* SCENE INITIATION */
const scenes = {
    mainScene: new THREE.Scene(),
    secondScene: new THREE.Scene()}

/* SCENE BACKGROUND */

/* GUI */

/* SCENE PARAMETERS */
    scenes.mainScene.background = new THREE.Color(0xd2dbf0);
    // scenes.mainScene.environment = hdrTexture;
    // scenes.mainScene.add(skybox);
    // scenes.mainScene.backgroundBlurriness = 0.3
    scenes.secondScene.background = null;
/* EXPORT */

export { scenes }