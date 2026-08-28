
    // IMPORTS
    import "./styles.css";
    import * as THREE       from "three";
    import { HDRLoader }    from "three/examples/jsm/Addons.js";
    import { gsap }         from "gsap";
    import  Stats           from "stats.js";

    // import { stats }
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
    import { RenderPass }   from "three/examples/jsm/postprocessing/RenderPass.js";
    import { BokehPass }    from "three/examples/jsm/postprocessing/BokehPass.js";

    import { personal }     from "./modules/personal.js";
    import { projects }     from "./modules/projects.js";
    import { experiences }  from "./modules/experiences.js";
    import { abilities }    from "./modules/abilities.js";
    import { credits }      from "./modules/credits.js";

    import { info }         from "./modules/abouts.js";
    import { domain }       from "./modules/domain.js";
    import { loaders }      from "./modules/loaders.js"
    import { scenes }       from "./modules/scene.js";
    import { objects }      from "./modules/objects.js";
    import { lights }       from "./modules/lights.js";
    import { helpers }      from "./modules/lights.js";
    import { cameras }      from "./modules/cameras.js";
    import { renderer }     from "./modules/render.js";
    import { controls }     from "./modules/controls.js";
    import { materials }    from "./modules/materials.js";

    /* ELEMENTS */
        let dom                 = domain;

    /* INDEXES */
        let buildingIndex       = 0;
        let buildingModelIndex  = 0;

    /* SCENES */
        let scene               = scenes.mainScene;

    /* CAMERAS */
        let camera              = cameras.perspective;
        function updateCamera() {
            const camPosA   = new THREE.Vector3(10, 12.5, 10);
            const camPosB   = new THREE.Vector3(10, 12.5, 10);
            const camPosC   = new THREE.Vector3(5, 10, -10);
            const camPosD   = new THREE.Vector3(5, -2.5, -10);
            
            const lookA     = new THREE.Vector3(-7.5, 18, -10);
            const lookB     = new THREE.Vector3(-7.5, 7.5, -10);
            const lookC     = new THREE.Vector3(-5, 0, -10);
            const lookD     = new THREE.Vector3(-5, -2.5, -10);
    
            let scroll = window.scrollY / 1000;
        
            // Which section are we in?
            let section = Math.floor(scroll); // 0,1,2,3
            let t = scroll % 1;               // 0 → 1 inside each section
        
            let posStart, posEnd, lookStart, lookEnd, zoomStart, zoomEnd;
        
            console.log(section);
            switch (section) {
                case 0:
                    posStart = camPosA; 
                    posEnd = camPosB;
                    lookStart = lookA; 
                    lookEnd = lookB;
                    zoomStart = 1.5; 
                    zoomEnd = 1.5;
                    break;
        
                case 1:
                    posStart = camPosB; 
                    posEnd = camPosC;
                    lookStart = lookB; 
                    lookEnd = lookC;
                    zoomStart = 1.5; 
                    zoomEnd = 1.0;
                    break;
        
                case 2:
                    posStart = camPosC; 
                    posEnd = camPosD;
                    lookStart = lookC; 
                    lookEnd = lookD;
                    zoomStart = 1.0; 
                    zoomEnd = 0.5;
                    break;
        
                default:
                    posStart = camPosD; 
                    posEnd = camPosD;
                    lookStart = lookD; 
                    lookEnd = lookD;
                    zoomStart = 0.5; 
                    zoomEnd = 0.5;
                    break;
            }
        
            // Smooth position
            const pos = posStart.clone().lerp(posEnd, t);
            camera.position.copy(pos);
        
            // Smooth lookAt
            const look = lookStart.clone().lerp(lookEnd, t);
            camera.lookAt(look);
        
            // Smooth zoom
            camera.zoom = THREE.MathUtils.lerp(zoomStart, zoomEnd, t);
            camera.updateProjectionMatrix();
        }
    
    /* CAMERA FOCUS */
        const focusPoint        = new THREE.Vector3(-5, 0, -10);

    /* EXTRACTS */
        let buildings           = objects.buildingsList;
        let models              = objects.modelsList;
        let textures            = objects.texturesList;

    /* INFORMATIONS */
        let names               = info.names;
        let abouts              = info.abouts;
        let types               = info.types;
        let styles              = info.styles;

        let name                = info.names[buildingIndex];
        let about               = info.abouts[buildingIndex];
        let type                = info.types[buildingIndex];
        let style               = info.styles[buildingIndex];

        let symbols             = Object.values(abilities)
        
    /* MESHES */
        let neighbor            = objects.neighbor.main;
        let building            = buildings[buildingIndex];
        let model               = models[buildingIndex][buildingModelIndex];
        
    /* TEXTURES */
        let texturePaths        = textures[buildingIndex];

    /* MATERIAL */ 
        let material            = loaders.loadMaterial(texturePaths);

    /* LIGHTS */
        let light               = lights;
        Object.values(light).forEach((light) => {scene.add(light)});

        let helpersLight          = helpers;
        Object.values(helpers).forEach((helper) => {scene.add(helper)});

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

        function updateRefs() {
                building            = buildings[buildingIndex];
                model               = models[buildingIndex][buildingModelIndex];
                texturePaths        = textures[buildingIndex];
                material            = loaders.loadMaterial(texturePaths);
                building            = buildings[buildingIndex];
                model               = models[buildingIndex][buildingModelIndex];
                name                = info.names[buildingIndex];
                about               = info.abouts[buildingIndex];
                type                = info.types[buildingIndex];
                style               = info.styles[buildingIndex];

                // console.log (
                // `Updated references to:
                // building ${building}
                // model ${model} 
                // textures: ${Object.values(texturePaths).join('\n')}`);
            }
                

    /* CONTROL */
        const control = controls(
            camera, 
            renderer.domElement);

    /* PERFORMANCE STATS */
        var stats = new Stats();
            stats.showPanel(1);
        document.body.appendChild(stats.dom);

    // AUTOMATIC ANIMATION
    async function loadAnimation () {
        gsap.registerPlugin(ScrollTrigger);
        let sceneTimeline = gsap.timeline(
                {scrollTrigger: {
                    trigger: '.viewport',
                    start: "35% 100%",
                    markers: true,
                    toggleActions: "restart pause pause pause"
                }});
    
            sceneTimeline.fromTo(
                    blurPass.uniforms.maxblur,
                    { value: 0.05 },
                    { value: 0.001, duration: 3 });
    
            sceneTimeline.fromTo (
                    camera, 
                    {zoom: 3},
                    {zoom: 1, 
                    duration:4,
                    onUpdate: ()=>{camera.updateProjectionMatrix()}});
    
            sceneTimeline.to(
                    ".controls", 
                    { top: "25em", duration: 1},
                    "+=.5");
                }

    /* ACTIONS */
        dom.nextBtn.addEventListener    
            ('click', ()=>{
                nextBuildingIndex();
                updateRefs();
                loaders.loadBuilding(scene, light, building, material);
                loaders.loadInfo(name, about, type, style);
            });

        dom.prevBtn.addEventListener    
            ('click', ()=>{
                prevBuildingIndex();
                updateRefs();
                loaders.loadBuilding(scene, light, building, material);
                loaders.loadInfo(name, about, type, style);
            });

        dom.upBtn.addEventListener      
            ('click', ()=>{
                nextModelIndex();
                updateRefs();
                loaders.loadModel(scene, light, model, material);
                loaders.loadInfo(name, about, type, style);
            });

        dom.downBtn.addEventListener    
            ('click', ()=>{
                prevModelIndex();
                updateRefs();
                loaders.loadModel(scene, light, model, material);
                loaders.loadInfo(name, about, type, style);
            });
            
        dom.abilitiesBtn.forEach        ((btn) => {btn.addEventListener
            ('click', () => {loaders.loadLevel(`${btn.className}`)} )});
    
    // ENVIRONMENT
        const   hdrLoader       = new HDRLoader();
                hdrLoader.load('./assets/textures/environment/cloisterPassage/cloisterPassage_1k.hdr', 
                    (texture) => {
                        texture.mapping = THREE.EquirectangularReflectionMapping;
                        scene.environment = texture;
                    },
                    undefined,
                    (err) => console.log('HDR load error', err))
    
    // COMPOSER
        const effectComposer   = new EffectComposer(renderer);

    // RENDERPASS
        const renderPass = new RenderPass(scene, camera);
        effectComposer.addPass(renderPass);

    // BLURPASS
        const blurPass = new BokehPass(scene, camera, {
            focus: 500,
            aperture: 5,
            maxblur: 0.001})
            
        effectComposer.addPass( blurPass )
    

    /* COMMITS */
    updateRefs();
    // loaders.loadPage();
    // loadAnimation();
    loaders.loadNeighboar(scene, light, neighbor, materials);
    // startingPage();

    // WINDOW EVENTS
        // CANVAS RESIZE;
            window.addEventListener('resize', ()=>{});

        // WINDOW RELOAD;
            window.addEventListener('load', ()=>{});

    // CAMERA TIMELINE 

    // RENDERING
        function animate() {
            requestAnimationFrame(animate);
            // control.update();
            updateRefs();
            updateCamera();
            effectComposer.render();}

        animate()
