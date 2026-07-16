/* IMPORTS */
import * as THREE from "three";
import { styles } from "./styles";
/* DOM ELEMENT */


/* RENDERER INITIATION */
const scenes = {
    mainScene: new THREE.Scene()
}
/* RENDERER PARAMETERS */
    scenes.mainScene.background = new THREE.Color(styles.color1);

/* EXPORT */

export { scenes }