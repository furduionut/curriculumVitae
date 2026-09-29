// state.js

// These must be passed in from main.js or imported here
let buildings;
let models;
let meshes;

let buildingIndex = 0;
let buildingModelIndex = 0;

function initState(_buildings, _models, _meshes) {
    buildings = _buildings;
    models = _models;
    meshes = _meshes;
}

function updateRefs() {
    const building = buildings[buildingIndex];
    const model = models[buildingIndex][buildingModelIndex];
    const texture = meshes.texturesList[buildingIndex];

    return { building, model, texture };
}

function nextBuildingIndex() {
    buildingIndex = (buildingIndex < buildings.length - 1)
        ? buildingIndex + 1
        : 0;
}

function prevBuildingIndex() {
    buildingIndex = (buildingIndex > 0)
        ? buildingIndex - 1
        : buildings.length - 1;
}

function nextModelIndex() {
    buildingModelIndex = (buildingModelIndex < models.length - 1)
        ? buildingModelIndex + 1
        : 0;
}

function prevModelIndex() {
    buildingModelIndex = (buildingModelIndex > 0)
        ? buildingModelIndex - 1
        : models.length - 1;
}

export {
    initState,
    updateRefs,
    nextBuildingIndex,
    prevBuildingIndex,
    nextModelIndex,
    prevModelIndex
};
