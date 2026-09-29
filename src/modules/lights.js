/* IMPORTS */
import * as THREE from "three";

/* DOM ELEMETS */

/* LIGHTS PARAMETERS */

const LightColor = 0xffffff;
const LightIntensity = 1.5;
const LightIntensity02 = 5;

/* LIGHT TARGET */
const lightFocus = new THREE.Vector3(-5, 0, 10);

/* LIGHTS INITIATION */

const lights = {
    keyLight      : new THREE.DirectionalLight(LightColor, LightIntensity),
    fillLight     : new THREE.DirectionalLight(LightColor, LightIntensity),
    backLight     : new THREE.DirectionalLight(LightColor, LightIntensity)
}

lights.keyLight.castShadow = true;
lights.fillLight.castShadow = true;
lights.backLight.castShadow = true;

lights.keyLight.position.set(10, 10, 10);
lights.backLight.position.set(-20, 20, -20);
lights.fillLight.position.set(-10, 10, 10);

lights.keyLight.target.position.set(-5, 0, -10);
lights.backLight.target.position.set(-5, 0, -10);
lights.fillLight.target.position.set(-5, 0, -10);


const helpers = {
    keyLightHelper      : new THREE.DirectionalLightHelper(lights.keyLight, 2),
    fillLightHelper     : new THREE.DirectionalLightHelper(lights.fillLight, 2),
    backLightHelper     : new THREE.DirectionalLightHelper(lights.backLight, 2)
}


export { lights, helpers }