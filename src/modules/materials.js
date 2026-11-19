import * as THREE               from "three";
import { styles }               from "./styles.js";

    const lavenderColor = new THREE.Color(0x6a76a6);
    const LogoPurpleColor = new THREE.Color(0x8e93f8);
    const LogoEmmisiveColor = new THREE.Color(0xffffff);
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
        // Very subtle cool glass tint
        color: 0xe8eeff,

        // Transparency
        transparent: true,
        opacity: 0.5,
        transmission: 0.35,

        // Surface properties
        roughness: 0.1,
        metalness: 0.1,

        // Soft glossy reflections
        clearcoat: 0.45,
        clearcoatRoughness: 0.2,

        // HDRI reflections
        envMapIntensity: 1.35,

        // Geometry rendering
        side: THREE.FrontSide,
        depthWrite: false,
        depthTest: true
    });

    const glassPurple = new THREE.MeshBasicMaterial({
        color: LogoPurpleColor,

        // Uniform flat color — unaffected by HDRI
        transparent: true,
        opacity: 1,

        depthWrite: false,
        depthTest: true,
        fog: false,

        toneMapped: false
    });

    const glassEmmisive = new THREE.MeshBasicMaterial({
        // Bright white bulb
        color: 0xffffff,

        transparent: true,
        opacity: 1,

        depthWrite: false,
        depthTest: true,
        fog: false,

        toneMapped: false,
        side: THREE.DoubleSide
    });


const materials = {
    cloudDiffuse: whiteColor,
    lightBulbDiffuse: lavenderColor,
    lightBulbGlass: lightBlueColor,
    support: papper, 
    model: glass, 
    desk: wood,
    tube: clearGlass,
    glassPurple: glassPurple,
    glassEmmisive: glassEmmisive,
};

export { materials }