import { projects }     from "./projects.js";

const objects = {
    buildingsList:  Object.values(projects).map(o => o.geometries.arc.main),
    modelsList:     Object.values(Object.values(Object.values(projects).map(o => o.geometries.arc.meshes))),
    texturesList:   Object.values(projects).map(t => t.geometries.arc.textures),
    neighbor: {
        main:   './public/assets/meshes/mainScene/pageLayout-05.glb',
        textures: ''},
    logo3D: {
        main:   './public/assets/meshes/mainScene/logo3D.glb'
    }
}

export { objects }