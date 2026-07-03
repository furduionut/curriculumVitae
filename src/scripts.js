
    // IMPORTS
    import "./styles.css";
    import * as THREE from "three";
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { GLTFLoader } from "three/examples/jsm/Addons.js";
    import { DRACOLoader } from "three/examples/jsm/Addons.js";
    import { PLP, ORG, SOFT } from "./modules/creditsInfomations.js";
    import { BIM, DWG, TXT, OBJ, IMG, SWG, CGI, ART, THC, MAN, CLB, COM, DEC } from "./modules/abilitiesContent.js";
    import { DSS, DSIGN, GRS, POINT, ARCHIZ, REZVINCI } from "./modules/experiencesContent.js";

    // DOM
    const abilitiesBtn = document.querySelectorAll('#abilityBtn');
    const rootProps = document.documentElement;
    
    let backgroundColor1 = getComputedStyle(rootProps).getPropertyValue('--first-background-color').trim();
    let backgroundColor2 = getComputedStyle(rootProps).getPropertyValue('--second-background-color').trim();
    let backgroundColor3 = getComputedStyle(rootProps).getPropertyValue('--third-background-color').trim();
    console.log(backgroundColor1, backgroundColor2, backgroundColor3)

    let hardLeveling = document.getElementById('hard-leveling');
    hardLeveling.style.display = 'flex';
    hardLeveling.style.flexFlow = 'column wrap'
    hardLeveling.style.justifyContent = 'space-between';

    let softLeveling = document.getElementById('soft-leveling');   
    softLeveling.style.display = 'flex';
    softLeveling.style.flexFlow = 'column wrap'
    softLeveling.style.justifyContent = 'center';
    
    // FUNCTION
    const showLevel = (e) => {


        // Choosing object based on className
        switch (e) {
            case 'BIM': e = BIM;
            break;
                
            case 'DWG': e = DWG;
            break;
                
            case 'TXT': e = TXT;
            break;

            case 'OBJ': e = OBJ;
            break;

            case 'IMG': e = IMG;
            break;

            case 'SWG': e = SWG;
            break;

            case 'CGI': e = CGI;
            break;
                
            case 'ART': e = ART;
            break;
                
            case 'THC': e = THC;
            break;

            case 'MAN': e = MAN;
            break;

            case 'CLB': e = CLB;
            break;

            case 'COM': e = COM;
            break;

            case 'DEC': e = DEC;
            break;

            default: undefined
            }
        // Default values;

        // Measure the object length.
            const entries = Object.entries(e);

        // Update Hard-skills
        // Iterate and applies to each entry;
        if (e == BIM || e == DWG || e == TXT || e == OBJ || e == IMG || e == SWG || e == CGI ) 
        {
        hardLeveling.innerHTML = '';
        for (let i=0; i<entries.length; i++) {

            // Convert the object into a array using Destructing
            const [key, value] = entries[i];

            // Adding content to DOM
            const skill = document.createElement('div');
            const symbol = document.createElement('div');
            const bar = document.createElement ('div');

            skill.setAttribute('class', 'skill');
            symbol.setAttribute('class', 'symbol');
            bar.setAttribute('class', 'bar');
            
            bar.style.padding = '1em';
            bar.style.display = 'flex';
            bar.style.justifyContent = 'flex-start';
            bar.style.alignItems = 'center'

            symbol.style.display = 'flex';
            symbol.style.justifyContent = 'center';
            symbol.style.alignItems = 'center'

            bar.style.background = `linear-gradient(to right, ${backgroundColor3} ${value.completed}%, transparent ${value.completed+10}%)`;
            bar.innerHTML = key;
            symbol.innerHTML = value.symbol;

            skill.appendChild(symbol);
            skill.appendChild(bar);
            hardLeveling.appendChild(skill);
        }
        }
        else if (e == ART || e == THC || e == MAN || e == CLB || e == COM || e == DEC ) {
            softLeveling.innerHTML = '';

            for (let i=0; i<entries.length; i++) {

                // Convert the object into a array using Destructing
                const [key, value] = entries[i];
    
                // Adding content to DOM
                const skill = document.createElement('div');
                const symbol = document.createElement('div');
                const bar = document.createElement ('div');
    
                skill.setAttribute('class', 'skill');
                symbol.setAttribute('class', 'symbol');
                bar.setAttribute('class', 'bar');
    
                bar.style.padding = '1em';
                bar.style.display = 'flex';
                bar.style.justifyContent = 'flex-start';
                bar.style.alignItems = 'center'
    
                symbol.style.display = 'flex';
                symbol.style.justifyContent = 'center';
                symbol.style.alignItems = 'center'

                bar.style.background = `linear-gradient(to right, ${backgroundColor3} ${value.completed}%, transparent ${value.completed+10}%)`;
                bar.innerHTML = key;
                symbol.innerHTML = value.symbol;
    
                skill.appendChild(symbol);
                skill.appendChild(bar);
                softLeveling.appendChild(skill);

        }
        }
        else {console.log('no skill to show')}
        }

    abilitiesBtn.forEach((btn) => {btn.addEventListener('click', () => {showLevel(`${btn.className}`)} )});
    
    // DEFAULT

    // CONSTRUCTORS
    class Project{
        constructor(name, location, mainModel, auxModels, description){

            if(!Array.isArray(auxModels)){ throw new TypeError('auxModels should be an array')};

            this.name = name;
            this.location = location;
            this.mainModel = mainModel;
            this.auxModels = auxModels;
            this.description = description; 
        }
    }

    const projects = [ 
        new Project(
            'testRun',
            '', 
            './public/assets/meshes/casaTest/casaBacau_OUTTER-SHELL.glb',
            ['./public/assets/meshes/casaTest/casaBacau_OUTTER-SHELL.glb',
            './public/assets/meshes/casaTest/casaBacau_2ND-FLOOR.glb',
            './public/assets/meshes/casaTest/casaBacau_1ST-FLOOR.glb',
            './public/assets/meshes/casaTest/casaBacau_BASEMENT.glb']
        ),
        
        new Project(
            'casaBacau',
            'Bacau', 
            './public/assets/meshes/casaBacau/casaBacau_OUTTER-SHELL.glb',
            ['./public/assets/meshes/casaBacau/casaBacau_OUTTER-SHELL.glb',
            './public/assets/meshes/casaBacau/casaBacau_2ND-FLOOR.glb',
            './public/assets/meshes/casaBacau/casaBacau_1ST-FLOOR.glb',
            './public/assets/meshes/casaBacau/casaBacau_BASEMENT.glb']
        ),

        new Project(
            'casaClim', 
            'Botosani', 
            './public/assets/meshes/casaClim/casaClim_OUTTER-SHELL.glb', 
            ['./public/assets/meshes/casaClim/casaClim_OUTTER-SHELL.glb',
            './public/assets/meshes/casaClim/casaClim_2ND-FLOOR.glb',
            './public/assets/meshes/casaClim/casaClim_1ST-FLOOR.glb']
        ),

        new Project('casaStolnicu',
            'Botosani',
            './public/assets/meshes/casaStolnicu/casaStolnicu_OUTTER-SHELL.glb',
            ['./public/assets/meshes/casaStolnicu/casaStolnicu_OUTTER-SHELL.glb',
            './public/assets/meshes/casaStolnicu/casaStolnicu_2ND-FLOOR.glb',
            './public/assets/meshes/casaStolnicu/casaStolnicu_1ST-FLOOR.glb'])
        ];

    // ITERATOR
    let buildingIndex = 0;
    let buildingModelIndex = 0;

    let buildings     = projects.map(p => p.mainModel);
    let models        = projects.map(p => p.auxModels);

    // DOM
    const upBtn     = document.getElementById('upBtn');
    const nextBtn   = document.getElementById('nextBtn');
    const prevBtn   = document.getElementById('prevBtn');
    const downBtn   = document.getElementById('downBtn');

    // PARAMETERS
        // CANVAS
            const canvas        = document.getElementById('canvas');
            const viewport      = document.getElementById('viewport');

            let canvasWidth     = viewport.clientWidth;
            let canvasHeight    = viewport.clientHeight;

        function updateCanvasSize() {
            let canvasWidth     = viewport.clientWidth;
            let canvasHeight    = viewport.clientHeight;

        window.addEventListener('resize', updateCanvasSize);
    }
        // CAMERA
            const cameraAspect = canvasWidth / canvasHeight;
            const cameraFar = 6000;
            const cameraNear = 0.01;
            const cameraTop = 20;
            const cameraBottom = -20;
            const cameraRight = 20;
            const cameraLeft = -20;

        // RENDERER
            const rendererWidth     = canvasWidth;
            const rendererHeight    = canvasHeight;

    // SCENE
        // CREATE
        const scene = new THREE.Scene();
        
        // BACKGROUND 
        const root = document.documentElement;
        const style = getComputedStyle(root);
        const mainColor = style.getPropertyValue('--first-background-color');
        scene.background = new THREE.Color(mainColor);
    
    // LIGHTS
        // CREATE
        const ambientLight = new THREE.AmbientLight(0xffffff, 7.5);
        const directionalLight01 = new THREE.DirectionalLight(0xffffff, 1); // Directional light 01
        const directionalLight02 = new THREE.DirectionalLight(0xffffff, 1); // Directional light 02
        scene.add(ambientLight, directionalLight01, directionalLight02);
    
        // POSITION
        directionalLight01.position.set(5, 10, 5);
        directionalLight02.position.set(-5, 10, -5);

    // CAMERA
        // CREATE
        const camera = new THREE.OrthographicCamera(
            cameraLeft  *cameraAspect,  
            cameraRight  *cameraAspect, 
            cameraTop, 
            cameraBottom, 
            cameraNear, 
            cameraFar
        );
        
        // SETUP
        camera.position.set(25, 5, 15);

    // FUNCTIONS
        // CHANGE BUILDING
        const nextBuildingIndex = () => {
                if (buildingIndex < buildings.length - 1) {
                    // INCREMETING
                    buildingIndex++;

                    // LOADING BUILDING
                    loadingBuildings();

                } else {
                    // RESET INCREMETING
                    buildingIndex = 0; 

                    // LOADING BUILDING
                    loadingBuildings();

                }
        };
        const prevBuildingIndex = () => {
                if (buildingIndex > 0) {
                    // INCREMETING
                    buildingIndex--;

                    // LOADING BUILDING
                    loadingBuildings();

                } else {
                    // RESET INCREMETING
                    buildingIndex = buildings.length - 1;

                    // LOADING BUILDING
                    loadingBuildings();

                }
        };

        // CHANGE MODEL
        const prevModelIndex = () => {
            if (buildingModelIndex < models[buildingIndex].length - 1) {
                // INCREMETING
                buildingModelIndex++;

                // LOADING MODEL
                loadingModels();

            } else {
                // RESET INCREMETING
                buildingModelIndex = 0;}

                // LOADING MODEL
                    loadingModels();

            // TESTING
            console.log(`model ${buildingModelIndex+1} out of ${models[buildingIndex].length} is ${models[buildingIndex][buildingModelIndex]}`)    
        };
        const nextModelIndex = () => {
            if (buildingModelIndex > 0) {
                // INCREMETING
                buildingModelIndex--;

                // LOADING MODEL
                loadingModels();
            }

            else {
                // RESET INCREMETING    
                buildingModelIndex = models[buildingIndex].length - 1}    

                // LOADING MODEL
                loadingModels();

            // TESTING
            console.log(`model ${buildingModelIndex+1} out of ${models[buildingIndex].length} is ${models[buildingIndex][buildingModelIndex]}`)            
        };

    // TEXTURE LOADER
        const diffuseTexture = new THREE.TextureLoader().load('./public/assets/textures/casaTest/casaBacau_diffuse_1k.jpg');
        diffuseTexture.colorSpace = THREE.SRGBColorSpace;
        diffuseTexture.flipY = false;

        const roughnessTexture = new THREE.TextureLoader().load('./public/assets/textures/casaTest/casaBacau_roughness_1k.jpg');
        roughnessTexture.colorSpace = THREE.NoColorSpace;
        roughnessTexture.flipY = false;

        const normalMapTexture = new THREE.TextureLoader().load('./public/assets/textures/casaTest/casaBacau_normalMap_1k.jpg');
        normalMapTexture.colorSpace = THREE.NoColorSpace;
        normalMapTexture.flipY = false;

        const alphaMapTexture = new THREE.TextureLoader().load('./public/assets/textures/casaTest/casaBacau_transmitionMap_1k.jpg');
        alphaMapTexture.colorSpace = THREE.NoColorSpace;
        alphaMapTexture.flipY = false;

    // MODELS
        // LOADER
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();

        // SETUP
        dracoLoader.setDecoderPath('./src/utils/draco/');
        gltfLoader.setDRACOLoader(dracoLoader);

        // LOADING
            // CURENT BUILDING
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

                    // STORE IN LOCALSTORAGE
                            // CONVERT FILE GLTF -> JSON (const json = JSON.stringfy(mesh.toJSON))
                            // SAVE TO LOCAL (localStorage.setItem('name', json)) (max 10mb)

                    // POSITION BUILDING
                    currentBuilding.position.set(5,-12.5,0);
                    
                    // SET DIRECTIONAL LIGHT
                    directionalLight01.lookAt(currentBuilding);
                    directionalLight02.lookAt(currentBuilding);

            })}

            // CURENT MODEL
            let currentModel
            const loadingModels = () => {
                gltfLoader.load(models[buildingIndex][buildingModelIndex], (gltf) => {
                    // REMOVE CURENT BUILDING
                    scene.remove(currentBuilding); 

                    // REMOVE MODEL
                    if (currentModel) {scene.remove(currentModel);}

                   // ADDING NEW BUILDING OR LOCALSTORAGE
                        // RETRIEVE OR LOAD (localStorage.getItem('name'))
                        // CONVERT JSON -> GLTF (function)

                    // ADDING MODEL
                    currentModel = gltf.scene;
                    scene.add(currentModel);

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

                            scene.traverse(child => {
                                if (child.isMesh && child.name.includes('section')){child.material = new THREE.MeshBasicMaterial({
                                    color: backgroundColor2
                            })}
                            })
                            }
                            });

                    // STORE IN LOCALSTORAGE
                            // CONVERT FILE GLTF -> JSON (const json = JSON.stringfy(mesh.toJSON))
                            // SAVE TO LOCAL (localStorage.setItem('name', json)) (max 10mb)
                                                   
                    // POSITION MODEL
                    currentModel.position.set(5,-12.5,0);

                    // SET DIRECTIONAL LIGHT
                    directionalLight01.lookAt(currentBuilding);
                    directionalLight02.lookAt(currentBuilding);
                })
            }

        // INITIAL MODEL
            loadingBuildings()

    // EVENTS
        upBtn.addEventListener('click', nextModelIndex);
        nextBtn.addEventListener('click', nextBuildingIndex);
        prevBtn.addEventListener('click', prevBuildingIndex);
        downBtn.addEventListener('click', prevModelIndex);
    
    // RENDERER
        // CREATE
        const renderer = new THREE.WebGLRenderer({antialias: true});

        // SETUP
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(rendererWidth, rendererHeight);
        canvas.appendChild(renderer.domElement);

    // CONTROL
        // CREATE
        const controls = new OrbitControls(camera, renderer.domElement);

        // SETUP
        controls.target.set(-5,-10, -5);

        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.enableZoom = true;
        controls.zoomToCursor = false;
        controls.enablePan = true;

        // LIMITS
        controls.zoomSpeed = 1.2;
        controls.minDistance = 10;  // Limit zoom to a certain minimum distance
        controls.maxDistance = 10; // Limit zoom to a certain maximum distance
        controls.maxPolarAngle = Math.PI / 3; // Prevent vertical rotation (limit pitch to 90 degrees)
        controls.minPolarAngle = Math.PI / 3; // Lock vertical axis at 90 degrees (horizontal only)

    // RENDERING
            function rendering() {
                requestAnimationFrame(rendering);
                controls.update();
                renderer.render(scene, camera);
            }
            rendering();

                // CONTROLS
 

    // TESTING
    