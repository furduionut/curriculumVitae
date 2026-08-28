import * as THREE               from "three";

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


const materials = {
    support: papper, 
    model: glass, 
    desk: wood};

export { materials }