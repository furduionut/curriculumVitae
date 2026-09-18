
    // IMPORTS
        import "./styles.css";
        import * as THREE       from "three";
        import { HDRLoader, UnrealBloomPass }    from "three/examples/jsm/Addons.js";
        import { gsap }         from "gsap";
        import  Stats           from "stats.js";

        import { ScrollTrigger } from "gsap/ScrollTrigger";
        import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
        import { RenderPass }   from "three/examples/jsm/postprocessing/RenderPass.js";
        import { BokehPass }    from "three/examples/jsm/postprocessing/BokehPass.js";
        import { LogoAnimation } from "./modules/animations.js"; 

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
        import { resizeOrthoCamera } from "./modules/cameras.js";
        import { renders }      from "./modules/render.js";
        import { rendero }      from "./modules/render.js";
        import { controls }     from "./modules/controls.js";
        import { materials }    from "./modules/materials.js";

    /* ELEMENTS */
        let dom                 = domain;
        let rendererWidth       = dom.viewport.clientWidth;
        let rendererHeight      = dom.viewport.clientHeight;
        let rendererCanvas      = dom.canvas;

        let renderoWidth       = dom.viewport2.clientWidth;
        let renderoHeight      = dom.viewport2.clientHeight;
        let renderoCanvas      = dom.canvaso;

    /* INDEXES */
        let buildingIndex       = 0;
        let buildingModelIndex  = 0;

    /* SCENES */
        let scene               = scenes.mainScene;
        let secondScene         = scenes.secondScene;

        const axes = new THREE.AxesHelper(5);
        secondScene.add(axes);

    /* CAMERAS */
        let perspCamera         = cameras.perspective;
        let orthoCamera         = cameras.orthographic;

    /* CAMERA ANIMATION */
        function updateCam() {
            const camPosA = new THREE.Vector3(15, 15, 10);
            const camPosB = new THREE.Vector3(15, 15, 10);
            const camPosC = new THREE.Vector3(15, 25, 10);
            const camPosD = new THREE.Vector3(20, 45, 15);
            const camPosE = new THREE.Vector3(15, 5, -10);
            const camPosF = new THREE.Vector3(15, -15, -10);
        
            const lookA = new THREE.Vector3(-5.5, 18, -10);
            const lookB = new THREE.Vector3(-5.5, 7.5, -10);
            const lookC = new THREE.Vector3(-5.5, 2.5, -10);
            const lookD = new THREE.Vector3(-5.5, 2.5, -10);
            const lookE = new THREE.Vector3(-5.5, -5, -10);
            const lookF = new THREE.Vector3(-5.5, -5, -10);
        
            let scroll = window.scrollY / 1000;
            let section = Math.floor(scroll);
            let t = scroll % 1;
            let sectionName;
            let posStart, posEnd, lookStart, lookEnd, zoomStart, zoomEnd;
            switch (section) {
                case 0:
                    posStart = camPosA; 
                    posEnd = camPosB;
                    lookStart = lookA; 
                    lookEnd = lookB;
                    zoomStart = 1; 
                    zoomEnd = 2;
                    sectionName = 'presentation';
                    break;
        
                case 1:
                    posStart = camPosB; 
                    posEnd = camPosC;
                    lookStart = lookB; 
                    lookEnd = lookC;
                    zoomStart = 2; 
                    zoomEnd = 3;
                    sectionName = 'aboutMe';
                    break;
        
                case 2:
                    posStart = camPosC; 
                    posEnd = camPosD;
                    lookStart = lookC; 
                    lookEnd = lookD;
                    zoomStart = 3; 
                    zoomEnd = 3;
                    sectionName = 'layout';
                    break;
        
                case 3:
                    posStart = camPosD; 
                    posEnd = camPosE;
                    lookStart = lookD; 
                    lookEnd = lookE;
                    zoomStart = 3; 
                    zoomEnd = 3;
                    sectionName = 'Abilities';
                    break;

                case 4:
                    posStart = camPosE; 
                    posEnd = camPosF;
                    lookStart = lookE; 
                    lookEnd = lookF;
                    zoomStart = 3; 
                    zoomEnd = 3;
                    sectionName = 'Experiences';
                    break;
        
                default:
                    posStart = camPosE; 
                    posEnd = camPosF;
                    lookStart = lookE; 
                    lookEnd = lookF;
                    zoomStart = 3; 
                    zoomEnd = 3;
                    sectionName = 'Contacts';
                    break;
            }
            console.log(`Window at zone ${section}. ${sectionName}`);
            let easedT = t;
            easedT = Math.pow(easedT, 2.0);
            easedT = Math.min(easedT, 0.9);
        
            const pos = posStart.clone().lerp(posEnd, easedT);
            perspCamera.position.copy(pos);
        
            const look = lookStart.clone().lerp(lookEnd, easedT);
            perspCamera.lookAt(look);
        
            perspCamera.zoom = THREE.MathUtils.lerp(zoomStart, zoomEnd, easedT);
            perspCamera.updateProjectionMatrix();
        
            const sectionEl = document.getElementById('section');
            sectionEl.innerHTML = `${sectionName}`;
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
        let logo3D              = objects.logo3D.main;
        let text                = 'Architizer';

    /* TEXTURES */
        let texturePaths        = textures[buildingIndex];

    /* MATERIAL */ 
        let material            = loaders.loadMaterial(texturePaths);

    /* LIGHTS */
        let light               = lights;
        Object.values(light).forEach((light) => {scene.add(light), secondScene.add(light)});

    /* LOADERS */
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

    /* UPDATERS */
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
            }
        function updateCanvas(){
                rendererWidth       = dom.viewport.clientWidth;
                rendererHeight      = dom.viewport.clientHeight;
                renderer.setSize    (rendererWidth, rendererHeight);
                perspCamera.aspect  = rendererWidth / rendererHeight;
                perspCamera.updateProjectionMatrix();
            }
        function updateCanvaso(){
            renderoWidth            = dom.viewport2.clientWidth;
            renderoHeight           = dom.viewport2.clientHeight;
            renderero.setSize       (renderoWidth, renderoHeight);
            orthoCamera.aspect      = renderoWidth / renderoHeight;
            resizeOrthoCamera       (renderoWidth, renderoHeight);
            }
            
    /* STATS */
        var stats = new Stats();
            stats.showPanel(1);
        document.body.appendChild(stats.dom);

    /* ENVIRONMENT */
        const   hdrLoader       = new HDRLoader();
                hdrLoader.load('./assets/textures/environment/cloisterPassage/cloisterPassage_1k.hdr', 
                    (texture) => {
                        texture.mapping = THREE.EquirectangularReflectionMapping;
                        scene.environment = texture;
                    },
                    undefined,
                    (err) => console.log('HDR load error', err))
    
    /* RENDERER */
        let renderer = renders(
            rendererWidth, 
            rendererHeight, 
            rendererCanvas);

        let renderero = rendero(
            renderoWidth,
            renderoHeight,
            renderoCanvas);

    /* ACTIONS */
        dom.nextBtn.addEventListener    
        ('click', ()=>{
            nextBuildingIndex();
            updateRefs();
            loaders.loadBuilding(scene, light, building, material);
            loaders.loadInfo(name, about, type, style);
            console.log("nextBtn was pressed");
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
    
        window.addEventListener
            ('resize', () => {
                updateCanvas();
                updateCanvaso();
            });
              
    /* CONTROL */
    const control = controls(orthoCamera, renderero.domElement);

    // COMPOSER
        const composer   = new EffectComposer(renderer);
        const composero  = new EffectComposer(renderero);

    // RENDERPASS
        const renderPass = new RenderPass(scene, perspCamera);
        const renderoPass = new RenderPass(secondScene, orthoCamera);

        composer.addPass(renderPass);
        composero.addPass(renderoPass);

    // BLURPASS
        const blurPass = new BokehPass(scene, perspCamera, {
            focus: 500,
            aperture: 5,
            maxblur: 0.001}) 
        composer.addPass( blurPass )

    // BlOMPASS
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(dom.viewport.clientWidth, dom.viewport.clientHeight),
            1.3, 0.55, 4);

        bloomPass.strength  = .05;
        bloomPass.radius    = .05;
        bloomPass.threshold = 1;

        composer.addPass(bloomPass)

    // ANIMATIONS
        let logoAnimation = new LogoAnimation();
        gsap.registerPlugin(ScrollTrigger);

        function viewportAnimation      () {
            let viewportTimeline = gsap.timeline({
                defaults: { duration: 3, ease: "power2.out" }});
                    
            viewportTimeline
                .to(".viewport2", {scale: 0.2})
                .to(".viewport2", {y: -575}, "-=1")

            return viewportTimeline;
            };

        function orthoCameraAnimation   () {
            let orthoCameraTimeline = gsap.timeline({
                defaults: { duration: 3, ease: "power2.out" }});

            orthoCameraTimeline
            .to(orthoCamera.position, {x: 0})
            .to(orthoCamera.position, {z: 0}, "-=0.5")
            

            return orthoCameraTimeline
            };

        function descriptionAnimation   () {      
            let descriptionTimeline = gsap.timeline({
                defaults: { duration: 1, ease: "power4.inOut"},
                scrollTrigger: {
                    trigger: '.infoBar',
                    start:"1250em 25%",
                    end: "5000em 35%",
                    markers: true,
                    scrub: true,
                    scrub: 1,
                    toggleActions: "play none reverse reverse"
                }
            })
            descriptionTimeline.fromTo('.infoBar', { x: '25em' }, { x: '0em'});
            descriptionTimeline.fromTo('.infoBar', { x: '0em' }, { x: '25em'});
            };

        const mainTimeline = gsap.timeline({
            pause: true,
            scrollTrigger: {
                trigger: '.viewport2',
                start: "15% 25%",
                end: "125% 25%",
                markers: true,
                scrub: 1, 
                toggleActions: "play none reverse reverse"}
        })
        
        mainTimeline
            .add(orthoCameraAnimation())
            .add(viewportAnimation(), "-=1")
            .add(descriptionAnimation())

    // EVENTS
        window.addEventListener('resize', ()=>{
            updateCanvas();
            updateCanvaso();
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY >= 1000) {
                const scrollIndicator = document.getElementById('scroll-indicator');
                if (scrollIndicator) {
                    scrollIndicator.innerHTML = '';
                    scrollIndicator.style.display = 'none';}
            }
        });
        
        window.addEventListener("load", () => {
            ScrollTrigger.refresh();
            requestAnimationFrame(() => {
              window.scrollTo(0, 0);
              ScrollTrigger.refresh();
            });
          });
        
        const pressedBtn = document.querySelectorAll(".btn");
        console.log(pressedBtn);

        // pressedBtn.forEach((btn)=>{
        //     btn.addEventListener('click', ()=>{
        //         // console.log(btn);
        //         let btnParent = btn.parentElement
        //         let btnParentSibling = btnParent.nextElementSibling
        //         if(btnParentSibling.children.length === 0){loaders.loadDisplay(btnParentSibling);}
    
        //     })
        // })
        

    /* COMMITS */
        updateRefs();
        // loaders.loadPage();
        let descriptionIni = document.getElementById("description");
        descriptionIni.innerHTML = "";

        loaders.loadText        (secondScene, text);
        loaders.loadIndicator   (dom);
        loaders.loadLogo        (secondScene, light, logo3D, materials, logoAnimation);
        loaders.loadNeighboar   (scene, light, neighbor, materials);
        loaders.loadInfo        (name, about, type, style);


    // CAMERA TIMELINE 
    

    // RENDERING
        function animate() {
            requestAnimationFrame   (animate);
            updateCam               ();
            control.update          ();
            logoAnimation.update    ();
            composero.render        ();
            composer.render         ();
        }
        animate()
