
    // IMPORTS
    import "./styles.css";
    import * as THREE from "three";
    import { GLTFLoader } from "three/examples/jsm/Addons.js";
    import { DRACOLoader } from "three/examples/jsm/Addons.js";
    
    import { PLP, ORG, SOFT } from "./modules/credits.js";
    import { BIM, DWG, TXT, OBJ, IMG, SWG, CGI, ART, THC, MAN, CLB, COM, DEC } from "./modules/abilities.js";
    // import { DSS, DSIGN, GRS, POINT, ARCHIZ, REZVINCI } from "./modules/experiences.js";

    import { personal }     from "./modules/personal.js";
    import { projects }     from "./modules/projects.js";
    import { experiences }  from "./modules/experiences.js";
    import { abilities }    from "./modules/abilities.js";
    import { credits }      from "./modules/credits.js";

    import { domain }       from "./modules/domain.js";
    import { loaders }      from "./modules/loaders.js"
    import { styles }       from "./modules/styles.js";
    import { scenes }       from "./modules/scene.js";
    import { meshes }       from "./modules/objects.js";
    import { lights }       from "./modules/lights.js";
    import { cameras }      from "./modules/cameras.js";
    import { renders }      from "./modules/render.js";
    import { controls }     from "./modules/controls.js";
    import { materials }     from "./modules/materials.js";

    /* MODULES 
        File level scope, nothing leaks globally.
        Modules are loaded asynchronously.
        Imports are hoisted and live bindings are created.

        Global namespace pollution 
        cluttering the global scope with identifier 
        that any script can accidently overwrite.
        Because of 
            naming collisions, 
            hard-to-debug, 
            hidden dependencies, 
            security risks, 
            fragile architecture.

        Circular depedencies
        when two or more modules depend on each other in a loop, 
        preventing a clean, linear loading order.

        Improper export/import
        any mismatch, misuse, or incorrect structure in 
        how modules export values and how other modules import them. 
            Use named exports for utilities;
            Use default export when module has one purpose;
            Use consistent file extensions/paths
            Dont mix ESM with commonJs unless necesary;

        Wrong module format (commonJS / ESM)
            commonJS (const x = require('./utils.js')) [ no type=module attribute]
            .cjs (commonJS file extension)
            ESM (import {x} from './utils.js')
            .mjs (module js file extension) OR .js type=module

        Debbuging issues: 
            module failing to load, 
            exporting imcomplete,
            undefined imports,
            unpredictably behaviour,
            global leakage
    */

    /* IDEAS 
        Use a global variable for indexes
        Divide into smaller, manageable modules and document relationships.
        Extract shared logic into a third module (A → Shared ← B)
        Let modules communicate without calling each other directly 
            by using events/callbacks or by use dynamic import for delay 'await import('./B.js')
    */

    /* ELEMENTS */
        let dom       = domain;

    /* INDEXES */
        let buildingIndex       = 0;
        let buildingModelIndex  = 0;

    /* SCENES */
        let scene       = scenes.mainScene;

    /* CAMERAS */
        let camera      = cameras.orhographic;
        
    /* MESHES */
        let buildings   = meshes.buildingsList;
        let models      = meshes.modelsList;

        let building    = meshes.buildingsList[buildingIndex];
        let model       = meshes.modelsList[buildingIndex][buildingModelIndex];

    /* TEXTURES */
        let textures    = meshes.texturesList;

    /* MATERIALS */
        let material    = loaders.loadMaterial(textures[0]);

    /* LIGHTS */
        let light       = lights;

    /* ACTIONS */
        const nextBuildingIndex = () => {
            if      (buildingIndex < buildings.length - 1) {buildingIndex++;} 
            else    {buildingIndex = 0;}
            console.log(buildingIndex)};
            
        const prevBuildingIndex = () => {
            if      (buildingIndex > 0) {buildingIndex--;} 
            else    {buildingIndex = buildings.length - 1;}
            console.log(buildingIndex)};
        
        const prevModelIndex = () => {
            if (buildingModelIndex > 0) {buildingModelIndex--;} 
            else {buildingModelIndex = models.length - 1;}
            console.log(buildingModelIndex)};
            
        const nextModelIndex = () => {
            if (buildingModelIndex < models.length - 1) {buildingModelIndex++;} 
            else {buildingModelIndex = 0;}
            console.log(buildingModelIndex);};

            // setInterval(()=>{console.log(`this is ${buildingIndex}`)}, 2000);

    /* COMMITS */
        loaders.loadBuilding(
            scene, 
            light, 
            building, 
            material)

    /* RENDERER */
        const renderer = renders(
            dom.viewport.clientWidth, 
            dom.viewport.clientHeight, 
            dom.canvas);

    /* CONTROL */
        const control = controls(
            camera, 
            renderer.domElement);

    /* ACTIONS */
        dom.nextBtn.addEventListener    
            ('click', ()=>{
                nextBuildingIndex();
                loaders.loadMaterial(textures);
                loaders.loadBuilding(
                    scene, 
                    light, 
                    building,
                    material);
            });

        dom.prevBtn.addEventListener    
            ('click', ()=>{
                prevBuildingIndex();
                loaders.loadMaterial(textures);
                loaders.loadBuilding(
                    scene, 
                    light, 
                    building, 
                    material);
            });

        dom.upBtn.addEventListener      
            ('click', ()=>{
                nextModelIndex();
                loaders.loadMaterial(textures);
                loaders.loadModel(
                    scene, 
                    light, 
                    model,
                    material);
            });

        dom.downBtn.addEventListener    
            ('click', ()=>{
                prevModelIndex();
                loaders.loadMaterial(textures);
                loaders.loadModel(
                    scene, 
                    light, 
                    model, 
                    material);
            });
            
        dom.abilitiesBtn.forEach        ((btn) => {btn.addEventListener
            ('click', () => {loaders.showLevel(`${btn.className}`)} )});
    
    // RENDERING
        function animate() {
            requestAnimationFrame(animate);
            control.update();
            renderer.render(scene, camera);
        }

        animate()