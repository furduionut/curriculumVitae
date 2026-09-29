import { projects }     from "./projects.js";
const BASE = import.meta.env.BASE_URL;

const objects = {
    buildingsList:  Object.values(projects).map(o => o.geometries.arc.main),
    modelsList:     Object.values(Object.values(Object.values(projects).map(o => o.geometries.arc.meshes))),
    texturesList:   Object.values(projects).map(t => t.geometries.arc.textures),
    neighbor: {
        main:   `${BASE}assets/meshes/mainScene/pageLayout-07.glb`,
        textures: ''},
    logo3D: {
        main:   `${BASE}assets/meshes/mainScene/logo3D.glb`
    }
}

export { objects }