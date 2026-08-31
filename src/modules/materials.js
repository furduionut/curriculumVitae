import * as THREE               from "three";
import { styles }               from "./styles.js";

    const papper = new THREE.MeshStandardMaterial({
        color: 'red', 
        roughness: 1, 
        envMapIntensity: .5});

    const glass = new THREE.MeshPhysicalMaterial({
        color: 'white',
        roughness: 0.1,
        metalness: 0.5,
        transmission: 1,
        thickness: 1.25,
        ior: 1.45,
        envMapIntensity: 2.75,
        transparent: true});
    
    const wood = new THREE.MeshStandardMaterial({
        color: 'brown', 
        roughness: 1, 
        envMapIntensity: .5});

    const whiteColor = new THREE.MeshBasicMaterial({
        color: styles.color3
      });

    const lavenderColor = new THREE.Color(0xb57cff);
    const lightBlueColor = new THREE.Color(0xc9b8ff);
    const brightPurple = new THREE.Color(0x9b00ff);

const materials = {
    cloudDiffuse: whiteColor,
    lightBulbDiffuse: lavenderColor,
    lightBulbGlass: lightBlueColor,
    support: papper, 
    model: glass, 
    desk: wood};

export { materials }