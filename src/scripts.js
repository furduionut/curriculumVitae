
    // IMPORTS
    import "./styles.css";
    import * as THREE from "three";
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { GLTFLoader } from "three/examples/jsm/Addons.js";
    import { DRACOLoader } from "three/examples/jsm/Addons.js";
    import { PLP, ORG, SOFT } from "./modules/creditsInfomations.js";
    import { BIM, DWG, TXT, OBJ, IMG, SWG, CGI, ART, THC, MAN, CLB, COM, DEC } from "./modules/abilitiesContent.js";
    import { DSS, DSIGN, GRS, POINT, ARCHIZ, REZVINCI } from "./modules/experiencesContent.js";
    import { ModelAnimationController } from "./modules/modelAnimation.js";   

    import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
    import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
    import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
    import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
    import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";


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
            'Logo', 
            './public/assets/meshes/casaTest/Logo.glb',
            ['./public/assets/meshes/casaTest/Logo.glb']
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
            const cameraNear = 0.001;
            const cameraTop = 30;
            const cameraBottom = -30;
            const cameraRight = 30;
            const cameraLeft = -30;
            

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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight01 = new THREE.DirectionalLight(0xffffff, 0.2); // Directional light 01
        const directionalLight02 = new THREE.DirectionalLight(0xffffff, 0.1); // Directional light 02
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
        camera.position.set(13, 5, 13);

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


const animationController = new ModelAnimationController();

    // MODELS
        // LOADER
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();

        // SETUP
        dracoLoader.setDecoderPath('./src/utils/draco/');
        gltfLoader.setDRACOLoader(dracoLoader);

        // MATERIALS TEXTURE FOR LOGO
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

            // CURENT MODEL
            let currentModel

            const loadingModels = () => {

              animationController.stop();

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
                    
                    //animationController.play(
                        //currentModel,
                        //gltf.animations,
                        //0
                    //);

                    applyLogoMaterials(currentModel);

// HERE WAS MATERIAL IN GENERAL //



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

        
        const hdriUrl =
            `${import.meta.env.BASE_URL}assets/images/hdri.hdr`;

        const hdrLoader = new RGBELoader();

        hdrLoader.load(
            hdriUrl,

            (hdrTexture) => {
                hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

                scene.environment = hdrTexture;

                console.log("HDRI environment loaded:", hdriUrl);
            },

            undefined,

            (error) => {
                console.error("Could not load HDRI:", error);
            }
        );




        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(rendererWidth, rendererHeight),
            1.3,  // strength
            0.55,  // radius
            4   // threshold
        );

        composer.addPass(bloomPass);
        const outputPass = new OutputPass();
        composer.addPass(outputPass);


        // Disable mouse wheel scrolling over the viewport
        renderer.domElement.addEventListener(
            "wheel",
            (e) => {
                e.preventDefault();
            },
            { passive: false }
        );

    // CONTROL
        // CREATE
        const controls = new OrbitControls(camera, renderer.domElement);

        // SETUP
        controls.target.set(-5 ,-10, -5);

        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.enableZoom = false;
        controls.zoomToCursor = false;
        controls.enablePan = true;

        // LIMITS - - - Fix clipping plane
        controls.zoomSpeed = 1.2;
        controls.minDistance = 30;  // Limit zoom to a certain minimum distance - here fix clipping plane
        controls.maxDistance = 30; // Limit zoom to a certain maximum distance - here fix clipping plane
        controls.maxPolarAngle = Math.PI / 3; // Prevent vertical rotation (limit pitch to 90 degrees)
        controls.minPolarAngle = Math.PI / 3; // Lock vertical axis at 90 degrees (horizontal only)

        // SAVE INITIAL CAMERA VIEW
        const initialCameraPosition = camera.position.clone();
        const initialControlsTarget = controls.target.clone();
        const initialCameraZoom = camera.zoom;

        let isReturningCamera = false;

        // RETURN TO INITIAL CAMERA POSITION WITH A NUDGE
        const returnCameraToInitialView = () => {

            if (isReturningCamera) return;

            isReturningCamera = true;
            controls.enabled = false;

            const startPosition = camera.position.clone();
            const startTarget = controls.target.clone();
            const startZoom = camera.zoom;

            const duration = 1000;
            const startTime = performance.now();

            // Cute overshoot / nudge easing
            const easeOutBack = (t) => {

                const overshoot = 1.4;
                const value = t - 1;

                return (
                    1 +
                    (overshoot + 1) * value * value * value +
                    overshoot * value * value
                );
            };

            const animateReturn = (currentTime) => {

                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutBack(progress);

                camera.position.lerpVectors(
                    startPosition,
                    initialCameraPosition,
                    easedProgress
                );

                controls.target.lerpVectors(
                    startTarget,
                    initialControlsTarget,
                    easedProgress
                );

                camera.zoom = THREE.MathUtils.lerp(
                    startZoom,
                    initialCameraZoom,
                    easedProgress
                );

                camera.updateProjectionMatrix();
                controls.update();

                if (progress < 1) {

                    requestAnimationFrame(animateReturn);

                } else {

                    // Ensure exact final values
                    camera.position.copy(initialCameraPosition);
                    controls.target.copy(initialControlsTarget);
                    camera.zoom = initialCameraZoom;

                    camera.updateProjectionMatrix();
                    controls.update();

                    controls.enabled = true;
                    isReturningCamera = false;
                }
            };

            requestAnimationFrame(animateReturn);
        };

        controls.addEventListener("end", () => {
            returnCameraToInitialView();
        });



    // RENDERING
            function rendering() {

                requestAnimationFrame(rendering);

                animationController.update();

                controls.update();
                composer.render();
            }
        
            rendering();


                window.addEventListener("keydown", (e) => {

                    if (e.key === "p") {

                        console.log("camera.position.set(",
                            camera.position.x,
                            ",",
                            camera.position.y,
                            ",",
                            camera.position.z,
                            ");"
                        );

                        console.log("controls.target.set(",
                            controls.target.x,
                            ",",
                            controls.target.y,
                            ",",
                            controls.target.z,
                            ");"
                        );

                        console.log("camera.zoom =", camera.zoom);
                    }

                });


                // CONTROLS
 

    // TESTING
    