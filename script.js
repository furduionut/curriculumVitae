// Importing Modules
import "./styles.css";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from "three/examples/jsm/Addons.js";

// Importing from CSS
const mainColor = '#b6cad4';

// Set 3D viewport
const container = document.getElementById("axo");
container.width = parseInt(window.getComputedStyle(container).width, 10);
container.height = parseInt(window.getComputedStyle(container).height, 10);

// Tests
console.log(container.height, container.width)

// Settingup Scene
const scene = new THREE.Scene();

// Set up Orthographic Camera (adjust near/far planes and view size based on your needs)
    // Creating parameteres for camera
        const aspect = container.width / container.height;
        const far = 1000;
        const near = 0.001;
        const top = 10;
        const bottom = -10;
        const right = 10;
        const left = -10;

// Settingup the camera
    const camera = new THREE.OrthographicCamera(left * aspect,  right * aspect,top, bottom, near, far);

// Setting the background
    scene.background = new THREE.Color(mainColor);

// Set initial camera position at the corner (isometric-like view)
    camera.position.set(10, 10, 10); // Position at (10, 10, 10) to simulate isometric view

// Set direction of the camera;
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the center of the object

// Set the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.width, container.height);
    container.appendChild(renderer.domElement);

// Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 3); // Soft light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5); // Directional light
    scene.add(ambientLight, directionalLight);

    // Light parameters
    directionalLight.position.set(5, 10, 5);

// Geometry test
    // const geometry = new THREE.BoxGeometry(5,5,5);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);

    // console.log(cube);
    // scene.add(cube);

// Creating GLTF Models paths
const stageModels = {};
const stages = ['Preliminar', 'Pregatitor', 'Conceptual', 'Definitor', 'Detaliat-a', 'Detaliat-b'];
const modelPaths = {
    "Preliminar":"./preliminar.glb",
    "Pregatitor":"./pregatitor.glb",
    "Conceptual":"./conceptual.glb",
    "Definitor":"./definitor.glb",
    "Detaliat-a":"./detaliat-a.glb",
    "Detaliat-b":"./detaliat-b.glb"
};

// Load all GLB models
const loader = new GLTFLoader()
stages.forEach(stage => {
    loader.load(
        modelPaths[stage],
        (gltf) => {
            try {
                // Scale the object
                gltf.scene.scale.set(0.75, 0.75, 0.75);

                // Center the object
                const box = new THREE.Box3().setFromObject(gltf.scene);
                box.expandByScalar(0.1);
                const center = box.getCenter(new THREE.Vector3());
                gltf.scene.position.sub(center);

                // Store the object
                stageModels[stage] = gltf.scene;

                // Apply material overrides (same for all stages)
                const backgroundColor = new THREE.Color(mainColor);
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((material, index) => {
                                if (material.name === 'iarba - verde' || material.name === 'Pamant' || material.name === 'x') {
                                    child.material[index] = new THREE.MeshBasicMaterial({
                                        color: backgroundColor,
                                        emissive: 0xf0f0f0,
                                        map: null,
                                        side: THREE.FrontSide
                                    });
                                }
                            });
                        } else {
                            const material = child.material;
                            if (material.name === 'iarba - verde' || material.name === 'Pamant' || material.name === 'x') {
                                child.material = new THREE.MeshBasicMaterial({
                                    color: backgroundColor,
                                    emissive: 0xf0f0f0,
                                    map: null,
                                    side: THREE.FrontSide
                                });
                            }
                        }
                    }
                });

                // Set model to be initially hidden except for "Definitor"
                gltf.scene.visible = (stage === 'Definitor');

                // Add model to scene
                scene.add(gltf.scene);
            } catch (error) {
                console.error(`Error processing gltf model for stage ${stage}:`, error);
            }
        },
        undefined,
        (error) => {
            console.error(`Error loading gltf model for stage ${stage}:`, error);
        }
    );
});

// Set Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
    // Set parameters of controls
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.zoomSpeed = 1.2;
    controls.minDistance = 10;  // Limit zoom to a certain minimum distance
    controls.maxDistance = 10; // Limit zoom to a certain maximum distance
    controls.enableZoom = false; // Disabling zoom
    controls.maxPolarAngle = Math.PI / 3; // Prevent vertical rotation (limit pitch to 90 degrees)
    controls.minPolarAngle = Math.PI / 3; // Lock vertical axis at 90 degrees (horizontal only)

// Set Slider/Circle Control
    const circleSize = 30;
    const sliderContainer = document.getElementsByClassName('slider-container');
    const sliderContainerElement = document.querySelector('.slider-container');
    const draggableCircle = document.getElementById('draggable-circle');
    
    sliderContainerElement.addEventListener( 'click', console.log("e"));
    draggableCircle.addEventListener( 'click', console.log("e"));

    const stageLabel = document.getElementsByClassName('stage-label');

    // Get slider width;
    const styles = window.getComputedStyle(sliderContainerElement);
    const sliderWidth = parseInt(styles.getPropertyValue('width'));

    // Set circle position based on the slider width;
    const stagePositions = [
    sliderWidth * 0.10,  // of slider width for first stage
    sliderWidth * 0.20,  // of slider width for second stage
    sliderWidth * 0.40,  // of slider width for third stage
    sliderWidth * 0.60,  // of slider width for fourth stage
    sliderWidth * 0.80,  // of slider width for fifth stage
    sliderWidth * 0.90,  // of slider width for sixth stage
    ];

// Functions
    let isDragging = false;
    let hasInteracted = false;

    // Update stage
    function updateStage(position) 
            {
                let closestStage = 0;
                let minDistance = Infinity;
                for (let i = 0; i < stagePositions.length; i++) {
                    let distance = Math.abs(position - stagePositions[i]);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestStage = i;
                    }
                }

                // Update circle position
                draggableCircle.style.left = `${stagePositions[closestStage]}px`;
                loadModel(stages[closestStage]);

                // Show stage name after interaction
                if (hasInteracted) {
                    stageLabel.innerText = stages[closestStage];
                    stageLabel.style.display = 'block';
                }
            }
    // Loading model
        function loadModel(stageName) 
            {
        // Hide all models
        Object.values(stageModels).forEach(model => model.visible = false);

        // Show the current stage model
        const model = stageModels[stageName];
        if (model) {
            model.visible = true;
        }
            }


// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

