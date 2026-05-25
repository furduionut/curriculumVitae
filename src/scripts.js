
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
    
    let backgroundColor3 = getComputedStyle(rootProps).getPropertyValue('--third-background-color').trim();


    console.log (backgroundColor3);
    // FUNCTION
    const showLevel = (e) => {
        let hardLeveling = document.getElementById('hard-leveling');
        let softLeveling = document.getElementById('soft-leveling');

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
        hardLeveling.style.display = 'flex';
        hardLeveling.style.flexFlow = 'column wrap'
        hardLeveling.style.justifyContent = 'space-between';
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
            softLeveling.style.display = 'flex';
            softLeveling.style.flexFlow = 'column wrap'
            softLeveling.style.justifyContent = 'space-between';
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
            const cameraFar = 2000;
            const cameraNear = 0.1;
            const cameraTop = 15;
            const cameraBottom = -15;
            const cameraRight = 15;
            const cameraLeft = -15;

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
        const ambientLight = new THREE.AmbientLight(0xffffff, 3);
        const directionalLight01 = new THREE.DirectionalLight(0xffffff, 5); // Directional light 01
        const directionalLight02 = new THREE.DirectionalLight(0xffffff, 5); // Directional light 02
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
        camera.position.set(15, 5,15);
        camera.lookAt(new THREE.Vector3(-5,-10, -5));

    // FUNCTIONS

        // INDEX UPDATING
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

        // NEXT MODEL
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
            }

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

                    // ADDING BUILDING
                    currentBuilding = gltf.scene;
                    scene.add(currentBuilding);
        
                    // POSITION BUILDING
                    currentBuilding.position.set(5,-25,0);
            })}

            // CURENT MODEL
            let currentModel
            const loadingModels = () => {
                gltfLoader.load(models[buildingIndex][buildingModelIndex], (gltf) => {
                    // REMOVE CURENT BUILDING
                    scene.remove(currentBuilding); 

                    // REMOVE MODEL
                    if (currentModel) {scene.remove(currentModel);}

                    // ADDING MODEL
                    currentModel = gltf.scene;
                    scene.add(currentModel);
                            
                    // POSITION MODEL
                    currentModel.position.set(5,-25,0);
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
    