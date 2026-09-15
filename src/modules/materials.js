import * as THREE               from "three";
import { styles }               from "./styles.js";

    const lavenderColor = new THREE.Color(0x6a76a6);
    const lightBlueColor = new THREE.Color(0xc9b8ff);
    const brightPurple = new THREE.Color(0x9b00ff);

    const papper = new THREE.MeshStandardMaterial({
        color: 'red', 
        roughness: 1, 
        envMapIntensity: .5
    });

    const glass = new THREE.MeshPhysicalMaterial({
        color: 'white',
        roughness: 0.1,
        metalness: 0.5,
        transmission: 1,
        thickness: 1.25,
        ior: 1.45,
        envMapIntensity: 2.75,
        transparent: true
    });
    
    const wood = new THREE.MeshStandardMaterial({
        color: lavenderColor,
        roughness: 1,
        envMapIntensity: 0.01
    });
        
    const whiteColor = new THREE.MeshBasicMaterial({
        color: 'white',
    });

    const clearGlass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.05,
        transmission: 0.85,
        roughness: 0.08,
        metalness: 0,
        thickness: 0.35,
        ior: 1.45,
        attenuationColor:
            new THREE.Color(0xffffff),
        attenuationDistance: 2,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        envMapIntensity: 1.5,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: true
    });

const materials = {
    cloudDiffuse: whiteColor,
    lightBulbDiffuse: lavenderColor,
    lightBulbGlass: lightBlueColor,
    support: papper, 
    model: glass, 
    desk: wood,
    tube: clearGlass};

export { materials }