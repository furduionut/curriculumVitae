
    // IMPORTS
    import "./styles.css";
    import * as THREE                   from "three";
    import { GLTFLoader }               from "three/examples/jsm/Addons.js";
    import { DRACOLoader }              from "three/examples/jsm/Addons.js";
    import { ModelAnimationController } from "./modules/modelAnimation.js";   
    import { EffectComposer }           from "three/addons/postprocessing/EffectComposer.js";
    import { RenderPass }               from "three/addons/postprocessing/RenderPass.js";
    import { UnrealBloomPass }          from "three/addons/postprocessing/UnrealBloomPass.js";
    import { OutputPass }               from "three/addons/postprocessing/OutputPass.js";
    import { RGBELoader }               from "three/examples/jsm/loaders/RGBELoader.js";
    
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
    import { scenes }       from "./modules/scene.js";
    import { meshes }       from "./modules/objects.js";
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
        let pageScene           = scenes.pageScene;

    /* CAMERAS */
        let camera              = cameras.orhographic;
        
    /* EXTRACTS */
        let buildings           = meshes.buildingsList;
        let models              = meshes.modelsList;
        let textures            = meshes.texturesList;

    /* INFORMATIONS */
        let names               = informations.names;
        let abouts              = informations.abouts;
        let types               = informations.types;
        let styles              = informations.styles;

        let name                = informations.names[buildingIndex];
        let about               = informations.abouts[buildingIndex];
        let type                = informations.types[buildingIndex];
        let style               = informations.styles[buildingIndex];

        console.log(names, abouts, types, styles);
        
    /* MESHES */
        let building            = buildings[buildingIndex];
        let model               = models[buildingIndex][buildingModelIndex];

    /* PAGE MODEL */
        let geometry          = new THREE.PlaneGeometry(10, 10);
        let mat               = new THREE.MeshBasicMaterial({color: "green"});
        let mesh              = new THREE.Mesh(geometry, mat);
        mesh.rotateX(-Math.PI/2);
        pageScene.add(mesh);
        
    /* PAGE MODEL */


    /* PAGE ANIMTION */
        const animationController = new ModelAnimationController();

    /* PAGE MODEL TEXTURE */

        const applyLogoMaterials = (model) => {
            const purple = new THREE.Color(0xb57cff);
            const glassPurple = new THREE.Color(0xc9b8ff);

            model.traverse((child) => {
                if (!child.isMesh) return;

                const name = child.name.toLowerCase();

                const isArchSegment =
                    name.startsWith("archmov");

                const isItizerSegment =
                    name.startsWith("itizermov");

                if (isArchSegment || isItizerSegment) {
                    child.material =
                        new THREE.MeshBasicMaterial({
                            color: glassPurple.clone(),

                            color: 0x8e93f8,
                            transparent: true,
                            opacity: 1,
                            depthWrite: false,
                            depthTest: true,
                            fog: false
                        });
                    child.castShadow = false;
                    child.receiveShadow = false;
                    child.renderOrder = 3;
                    child.material.needsUpdate = true;

                    
                    console.log(
                        "Prepared independent segment:",
                        child.name,
                        child.material.id
                    );

                    return;
                }

                if (name === "bec") {
                    const brightPurple = purple
                        .clone()
                        .multiplyScalar(6);

                    child.material =
                        new THREE.MeshBasicMaterial({
                            color: brightPurple,

                            transparent: true,
                            blending:
                                THREE.AdditiveBlending,

                            depthWrite: false,
                            depthTest: true,

                            toneMapped: false,
                            side: THREE.DoubleSide
                        });

                    child.renderOrder = 6;
                    child.frustumCulled = false;
                    child.material.needsUpdate = true;

                    return;
                }

                if (name === "traseu") {
                    child.material =
                        new THREE.MeshPhysicalMaterial({
                            color: 0xffffff,

                            transparent: true,
                            opacity: 0.45,
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

                    child.renderOrder = 1;
                    child.material.needsUpdate = true;
                }
            });
        };

       let currentBuilding
        const loadingBuildings = () => {
            gltfLoader.load(buildings[buildingIndex], (gltf) => {    
                // REMOVE MODEL
                scene.remove(currentModel); 

                // BUILDING PREVIEW
                console.log (`building ${buildingIndex} was loaded from ${buildings[buildingIndex]}`);

                // REMOVE BUILDING
                if (currentBuilding) {scene.remove(currentBuilding);}

                // ADDING NEW BUILDING OR LOCALSTORAGE
                    // RETRIEVE OR LOAD (localStorage.getItem('name'))
                    // CONVERT JSON -> GLTF (function)
                currentBuilding = gltf.scene;
                scene.add(currentBuilding);
    
                currentBuilding.traverse((child) => {
                    if (child.isMesh) {
                        console.log("Building mesh:", child.name);
                    }
                });



                // CHECK TEXTURES
                scene.traverse((currentBuilding)=>{
                    if(currentBuilding.material?.name == '') 
                        {
                        currentBuilding.material = new THREE.MeshStandardMaterial({
                            map: diffuseTexture,
                            roughnessMap: roughnessTexture,
                            normalMap: normalMapTexture,
                            transparent: true,
                            alphaMap: alphaMapTexture});

                        currentBuilding.material.doubleSide = true;

                        scene.traverse(child =>{
                            if (child.isMesh && child.name.includes('section')){child.material = new THREE.MeshBasicMaterial({
                                color: 0xffffff
                            })}
                        })
                        }
                        });
                if (buildingIndex === 0) {
                    applyLogoMaterials(currentBuilding);

                    console.log("Animation count:", gltf.animations.length);

                    gltf.animations.forEach((clip) => {
                        console.log("Animation clip:", clip.name);

                        clip.tracks.forEach((track) => {
                            console.log("Animation track:", track.name);
                        });
                    });

                    animationController.play(
                        currentBuilding,
                        gltf.animations,
                        0
                    );
                }


                // STORE IN LOCALSTORAGE
                        // CONVERT FILE GLTF -> JSON (const json = JSON.stringfy(mesh.toJSON))
                        // SAVE TO LOCAL (localStorage.setItem('name', json)) (max 10mb)

                // POSITION BUILDING
                currentBuilding.position.set(5,-12.5,0);
                
                // SET DIRECTIONAL LIGHT
                directionalLight01.lookAt(currentBuilding);
                directionalLight02.lookAt(currentBuilding);

        })}

    /* PAGE LIGHT */
        let pageLight           = new THREE.AmbientLight(0xffffff, 1);
        pageScene.add(pageLight);

    /* TEXTURES */
        let texturePaths        = textures[buildingIndex];

    /* MATERIAL */ 
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
        loaders.loadBuilding(scene, light, building, material);

    /* RENDERER */
        const renderer = renders(
            dom.viewport.clientWidth, 
            dom.viewport.clientHeight, 
            dom.canvas);

        const pageRenderer = renders(
            dom.pageViewport.clientWidth,
            dom.pageViewport.clientHeight,
            dom.pageCanvas);

    /* CONTROL */
        const control = controls(
            camera, 
            renderer.domElement);

    /* ANIMATE ON SCROLL */
        let scrollY = window.scrollY;
        window.addEventListener('scroll', 
            () => {scrollY = window.scrollY;
                console.log(scrollY)});

    /* ACTIONS */
        console.log(dom.abouts)
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
        function tick () {
            requestAnimationFrame(tick);
            pageRenderer.render(pageScene, camera);
        }

        function animate() {
            requestAnimationFrame(animate);
            control.update();
            renderer.render(scene, camera);
        }
        tick()
        animate()