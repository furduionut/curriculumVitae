
    // IMPORTS
    import "./styles.css";
    import * as THREE from "three";
    import { hdrTexture } from "./modules/textures.js";

    import { personal }     from "./modules/personal.js";
    import { projects }     from "./modules/projects.js";
    import { experiences }  from "./modules/experiences.js";
    import { abilities }    from "./modules/abilities.js";
    import { credits }      from "./modules/credits.js";

    import { domain }       from "./modules/domain.js";
    import { loaders }      from "./modules/loaders.js"
    import { scenes }       from "./modules/scene.js";
    import { objects }      from "./modules/objects.js";
    import { informations } from "./modules/abouts.js";
    import { lights }       from "./modules/lights.js";
    import { cameras }      from "./modules/cameras.js";
    import { renders }      from "./modules/render.js";
    import { controls }     from "./modules/controls.js";

    /* ELEMENTS */
        let dom                 = domain;

    /* INDEXES */
        let buildingIndex       = 0;
        let buildingModelIndex  = 0;

    /* SCENES */
        let scene               = scenes.mainScene;

    /* CAMERAS */
        let camera              = cameras.orthographic;
        
    /* EXTRACTS */
        let buildings           = objects.buildingsList;
        let models              = objects.modelsList;
        let textures            = objects.texturesList;

    /* INFORMATIONS */
        let names               = informations.names;
        let abouts              = informations.abouts;
        let types               = informations.types;
        let styles              = informations.styles;

        let name                = informations.names[buildingIndex];
        let about               = informations.abouts[buildingIndex];
        let type                = informations.types[buildingIndex];
        let style               = informations.styles[buildingIndex];

        let symbols             = Object.values(abilities)
        
    /* MESHES */
        let neighbor            = objects.neighbor.main;

        let building            = buildings[buildingIndex];
        let model               = models[buildingIndex][buildingModelIndex];
        
    /* TEXTURES */
        let texturePaths        = textures[buildingIndex];

    /* MATERIAL */ 
        const neighborMaterials = {
        paperMat            : new THREE.MeshStandardMaterial({
            color: 'grey', 
            roughness: 0.5, 
            metalness: 0.5,
            envMapIntensity: 1.5
        }),

        glassMat            : new THREE.MeshPhysicalMaterial({
            color: 'grey',
            roughness: 0,
            metalness: 0.1,
            transmission: 1.0,
            envMapIntensity: 25,
            thickness: .1,
            ior: 1.5,
            transparent: true
        }),

        woodMat             : new THREE.MeshStandardMaterial({
            color: 'brown', 
            roughness: 0.5, 
            metalness: 0.5,
            envMapIntensity: 1.5
        })}
        
        let material            = loaders.loadMaterial(texturePaths);

    /* LIGHTS */
        let light               = lights;

    /* ACTIONS */
        const nextBuildingIndex = () => {
            if      (buildingIndex < buildings.length - 1) {buildingIndex++;} 
            else    {buildingIndex = 0;}
            console.log(`Changed indexes ${buildingIndex+1} / ${buildings.length}`);};
            
        const prevBuildingIndex = () => {
            if      (buildingIndex > 0) {buildingIndex--;} 
            else    {buildingIndex = buildings.length - 1;}
            console.log(`Changed indexes ${buildingIndex+1} / ${buildings.length}`)};
        
        const prevModelIndex = () => {
            if (buildingModelIndex > 0) {buildingModelIndex--;} 
            else {buildingModelIndex = models.length - 1;}
            console.log(`Changed indexes are: 
                model ${buildingModelIndex} / ${models.length} of building ${buildingIndex+1}`)};
            
        const nextModelIndex = () => {
            if (buildingModelIndex < models.length - 1) {buildingModelIndex++;} 
            else {buildingModelIndex = 0;}
            console.log(`Changed indexes are: 
                model ${buildingModelIndex} / ${models.length} of building ${buildingIndex+1}`);};

        function updateReferences() {
                building            = buildings[buildingIndex];
                model               = models[buildingIndex][buildingModelIndex];
                texturePaths        = textures[buildingIndex];
                material            = loaders.loadMaterial(texturePaths);
                building            = buildings[buildingIndex];
                model               = models[buildingIndex][buildingModelIndex];
                name                = informations.names[buildingIndex];
                about               = informations.abouts[buildingIndex];
                type                = informations.types[buildingIndex];
                style               = informations.styles[buildingIndex];
                
                console.log (
                `Updated references to:
                building ${building}
                model ${model} 
                textures: ${Object.values(texturePaths).join('\n')}`);}

    /* COMMITS */
        console.log(`Changed indexes ${buildingIndex+1} / ${buildings.length}`);
        updateReferences();
        // loaders.loadPage();
        loaders.loadNeighboar(scene, light, neighbor, neighborMaterials);

    /* RENDERER */
        const renderer = renders(
            dom.viewport.clientWidth, 
            dom.viewport.clientHeight, 
            dom.canvas);

    /* PMREM */
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        

    /* CONTROL */
        const control = controls(
            camera, 
            renderer.domElement);

    /* ACTIONS */
        dom.nextBtn.addEventListener    
            ('click', ()=>{
                nextBuildingIndex();
                updateReferences();
                loaders.loadBuilding(scene, light, building, material);
                loaders.loadInfo(name, about, type, style);
            });

        dom.prevBtn.addEventListener    
            ('click', ()=>{
                prevBuildingIndex();
                updateReferences();
                loaders.loadBuilding(scene, light, building, material);
                loaders.loadInfo(name, about, type, style);
            });

        dom.upBtn.addEventListener      
            ('click', ()=>{
                nextModelIndex();
                updateReferences();
                loaders.loadModel(scene, light, model, material);
                loaders.loadInfo(name, about, type, style);
            });

        dom.downBtn.addEventListener    
            ('click', ()=>{
                prevModelIndex();
                updateReferences();
                loaders.loadModel(scene, light, model, material);
                loaders.loadInfo(name, about, type, style);
            });
            
        dom.abilitiesBtn.forEach        ((btn) => {btn.addEventListener
            ('click', () => {loaders.loadLevel(`${btn.className}`)} )});
    
    // RENDERING
        function animate() {
            requestAnimationFrame(animate);
            control.update();
            renderer.render(scene, camera);
        }
        animate()