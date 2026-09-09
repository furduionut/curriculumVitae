/* IMPORTS */
import * as THREE from "three";
import { styles } from "./styles";
import { GroundedSkybox } from "three/examples/jsm/Addons.js";
import { GUI } from "dat.gui";

/* DOM ELEMENT */

/* SCENE INITIATION */
const scenes = {
    mainScene: new THREE.Scene(),
    secondScene: new THREE.Scene()}

/* SCENE BACKGROUND */
    /* HDR PROJECTION */
    const skyBoxParam = {
        positionX: 10,
        positionY: 10,
        positionZ: 10,
        rotationY: 0,
        scale: 1,
        radius: 125,
        resolution: 1024
    }

    const skybox = new GroundedSkybox('', skyBoxParam.radius, skyBoxParam.resolution);
    skybox.position.set(-50 , 0, -100);
    
    const gui = new GUI();
    const skyboxControl = gui.addFolder('Skybox Control');
        skyboxControl.add(skyBoxParam, 'positionX', -100, 100, 0.01).onChange(value=>{
            skybox.position.x = value;});
        skyboxControl.add(skyBoxParam, 'positionY', -100, 100, 0.01).onChange(value=>{
            skybox.position.x = value;});
        skyboxControl.add(skyBoxParam, 'positionZ', -100, 100, 0.01).onChange(value=>{
            skybox.position.x = value;});
        skyboxControl.add(skyBoxParam, 'rotationY', -Math.PI, Math.PI, 0.01).onChange(value=>{
            skybox.rotation.y = value;});
        skyboxControl.add(skyBoxParam, 'scale', -5, 5, 0.01).onChange(value=>{
            skybox.scale.set(value, value, value);});
    
    skyboxControl.close();

/* GUI */

/* SCENE PARAMETERS */
    scenes.mainScene.background = new THREE.Color(styles.color1);
    // scenes.mainScene.environment = hdrTexture;
    // scenes.mainScene.add(skybox);
    // scenes.mainScene.backgroundBlurriness = 0.3
    scenes.secondScene.background = null;
/* EXPORT */

export { scenes }