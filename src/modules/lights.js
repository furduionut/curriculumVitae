/* IMPORTS */
import * as THREE from "three";

/* DOM ELEMETS */

/* LIGHTS PARAMETERS */

const LightColor = 0xffffff;
const LightIntensity = 7.5;
const LightIntensity02 = 5;


/* LIGHTS INITIATION */

const lights = {
    ambientLight  : new THREE.AmbientLight(LightColor, LightIntensity02),
    keyLight      : new THREE.DirectionalLight(LightColor, LightIntensity),
    fillLight     : new THREE.DirectionalLight(LightColor, LightIntensity),
    backLight     : new THREE.DirectionalLight(LightColor, LightIntensity)
}

export { lights }