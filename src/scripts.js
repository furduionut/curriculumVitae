
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

    import { domain }       from "./modules/domain.js";
    import { loaders }      from "./modules/loaders.js"
    import { scenes }       from "./modules/scene.js";
    import { objects }      from "./modules/objects.js";
    import { informations } from "./modules/abouts.js";
    import { lights }       from "./modules/lights.js";
    import { helpers }      from "./modules/lights.js";
    import { cameras }      from "./modules/cameras.js";
    import { renderer }     from "./modules/render.js";
    import { controls }     from "./modules/controls.js";

    /* ELEMENTS */
        let dom                 = domain;

    /* INDEXES */
        let buildingIndex       = 0;
        let buildingModelIndex  = 0;

    /* SCENES */
        let scene               = scenes.mainScene;

    /* CAMERAS */
        let camera              = cameras.perspective;
        cameras.perspective.lookAt(0, 0, 0);
     
    /* CAMERA FOCUS */
        const focusPoint        = new THREE.Vector3(-5, 0, -10);

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
            color: 'red', 
            roughness: 1, 
            envMapIntensity: .5
        }),

        glassMat            : new THREE.MeshPhysicalMaterial({
            color: 'white',
            roughness: 0.1,
            metalness: 0.5,
            transmission: 1,
            thickness: 1.25,
            ior: 1.45,
            envMapIntensity: 2.75,
            transparent: true
        }),

        woodMat             : new THREE.MeshStandardMaterial({
            color: 'brown', 
            roughness: 1, 
            envMapIntensity: .5
        })}
        
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
    /* ANIMATION */
        // gsap.to ("target", {anyCSSpropriety/-es, duration}) tween with playhead
        // let timeline = gspa.timeline()
        // tl.to(("target", {anyCSSpropriety/-es, duration}, start))
        // control methods - play(), pause(), resume()...
        // gsap.registerPlugin(...);
        // plugins (scroll plugins, text plugins, svg plugins...)

        // 
        // window.addEventListener();

        // Create sections to be logged by window.addEvent() like in bruno's video

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
    
        /* SCROLL ANIMATION */
    let currentSection = 0;
    let scrollY = window.scrollY;
    window.addEventListener(
        'scroll', 
        ()=>{
            scrollY = window.scrollY;
            currentSection = scrollY / 1000;
            console.log(Math.floor(currentSection))})

    /* COMMITS */
    console.log(`Changed indexes ${buildingIndex+1} / ${buildings.length}`);
    updateReferences();
    // loaders.loadPage();
    // loadAnimation();
    loaders.loadNeighboar(scene, light, neighbor, neighborMaterials);

    // async function startingPage() {
    //     await loaders.loadPage(); 
    //     await loadAnimation();}

    // startingPage();

    // WINDOW EVENTS
        // CANVAS RESIZE;
            window.addEventListener('resize', ()=>{});

        // WINDOW RELOAD;
            window.addEventListener('load', ()=>{});

    // RENDERING
        function animate() {
            requestAnimationFrame(animate);
            // control.update();
            if (currentSection <= 1) {
                console.log(currentSection);
                camera.position.y = 15 - scrollY / 100 *2;
                camera.lookAt(-5, - scrollY / 100 *1, -10)}
            
            effectComposer.render();}

        animate()
