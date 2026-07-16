import { projects }     from "./projects.js";


const meshes = {
    buildingsList:  Object.values(projects).map(o => o.geometries.arc.main),
    modelsList:     Object.values(Object.values(Object.values(projects).map(o => o.geometries.arc.meshes))),
    texturesList:   Object.values(projects).map(t => t.geometries.arc.textures)
}

export { meshes }