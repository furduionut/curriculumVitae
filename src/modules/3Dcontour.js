
import * as THREE from "three";

export function addContourLines(model) {
    const meshes = [];

    model.traverse((child) => {
        if (child.isMesh) meshes.push(child);
    });

    meshes.forEach((child) => {
        const edges = new THREE.EdgesGeometry(
            child.geometry,
            25
        );

        const material = new THREE.LineBasicMaterial({
            color: 0x5b557d,
            transparent: true,
            opacity: 0.65,
            depthTest: true,
            depthWrite: false
        });

        const contour = new THREE.LineSegments(
            edges,
            material
        );

        contour.name = "CAD_Contour";
        child.add(contour);
    });
}
