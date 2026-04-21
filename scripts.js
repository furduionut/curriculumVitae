/* METACODE IDEAS
    Class Project (name, about, url, models){
        name: this.name;
        about: this.about; 
        url: this.url;
        models: this.models
        }

    project01 = new Object("name", "about", "url", [models]);
    project02 = new Object("name", "about", "url", [models]);
    project02 = new Object("name", "about", "url", [models]);

    const buildingsArr = [project01, project02, project03];

*/

    // IMPORTS
    import "./styles.css";
    import * as THREE from "three";
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
    import { GLTFLoader } from "three/examples/jsm/Addons.js";
    import { DRACOLoader } from "three/examples/jsm/Addons.js";

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
            './public/projects/casaBacau/WEB_ASSETS_OUTTER-SHELL.glb',
            ['./public/projects/casaBacau/WEB_ASSETS_2ND-FLOOR.glb',
            './public/projects/casaBacau/WEB_ASSETS_1ST-FLOOR.glb',
            './public/projects/casaBacau/WEB_ASSETS_BASEMENE.glb']
        ),

        new Project(
            'casaClim', 
            'Botosani', 
            './public/projects/casaClim/WEB_ASSETS_OUTTER-SHELL.glb', 
            [4,5,6]),

        new Project('casaBox',
            'Botosani',
            './public/projects/casaStolnicu/WEB_ASSETS_OUTTER-SHELL.glb',
            [4,5,6])
        ];


        
    // ITERATOR
    let buildingIndex = 0;
    let modelIndex = 0;
    let buildingModelIndex = 0;

    const buildings     = projects.map(p => p.mainModel);
    const models        = projects[buildingIndex].auxModels;

    // DOM
    const upBtn     = document.getElementById('upBtn');
    const nextBtn   = document.getElementById('nextBtn');
    const prevBtn   = document.getElementById('prevBtn');
    const downBtn   = document.getElementById('downBtn');

    // PARAMETERS
        // CANVAS
            const canvas        = document.getElementById('canvas');
            let canvasWidth     = canvas.clientWidth;
            let canvasHeight    = canvas.clientHeight;
            
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
        camera.position.set(15,5,15);
        camera.lookAt(new THREE.Vector3(-5,-10, -5));

    // FUNCTIONS


        // INDEX UPDATING
        const nextBuildingIndex = () => {
                if (buildingIndex < buildings.length - 1) {
                    // INCREMETING
                    buildingIndex++;

                    // RESETING MODELS
                    modelIndex = 0; 

                    // LOADING BUILDING
                    loadingBuildings();

                } else {
                    // RESET INCREMETING
                    buildingIndex = 0; 

                    // LOADING BUILDING
                    loadingBuildings();
                    
                    // RESETING MODELS
                    modelIndex = 0; 

                }
        };

        const prevBuildingIndex = () => {
                if (buildingIndex > 0) {
                    // INCREMETING
                    buildingIndex--;

                    // RESETING MODELS
                    modelIndex = 0; 

                    // LOADING BUILDING
                    loadingBuildings();


                } else {
                    // RESET INCREMETING
                    buildingIndex = buildings.length - 1;

                    // LOADING BUILDING
                    loadingBuildings();

                    // RESETING MODELS
                    modelIndex = 0; 

                }
        };

        // NEXT MODEL
        const nextModelIndex = () => {
            if (buildingModelIndex < models.length - 1) {
                // INCREMETING
                buildingModelIndex++;
            } else {
                // RESET INCREMETING
                buildingModelIndex = 0;}

            // TESTING
            console.log(models[buildingModelIndex])
            }

            // TESTING
            console.log(models[buildingModelIndex])    

        const prevModelIndex = () => {
            if (buildingModelIndex > 0) {
                // INCREMETING
                buildingModelIndex--;
            }

            else {
                // RESET INCREMETING    
                buildingModelIndex = models.length -1}    

            // TESTING
            console.log(models[buildingModelIndex])         
        };

        // INDEX
        let mURL = buildings[buildingIndex];
        

    // MODELS
        // LOADER
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();

        // SETUP
        dracoLoader.setDecoderPath('./public/draco/');
        gltfLoader.setDRACOLoader(dracoLoader);

        // LOADING
            // CURENT BUILDING
            let currentBuilding
            const loadingBuildings = () => {
                gltfLoader.load(buildings[buildingIndex], (gltf) => {    
                    // BUILDING PREVIEW
                    console.log (`building ${buildingIndex} was loaded from ${buildings[buildingIndex]}`);

                    // REMOVE MODEL
                    if (currentBuilding) {scene.remove(currentBuilding);}

                    // ADDING MODEL
                    currentBuilding = gltf.scene;
                    scene.add(currentBuilding);
        
                    // POSITION MODEL
                    currentBuilding.position.set(5,-25,0);
            })}

            // CURENT MODEL
            let currentmodel
            const loadingModels = () => {
                gltfLoader.load(models[modelIndex], (gltf) => {
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
    