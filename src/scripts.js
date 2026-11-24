
    // IMPORTS
        import "./styles.css";
        import * as THREE       from "three";
        import { HDRLoader, UnrealBloomPass }    from "three/examples/jsm/Addons.js";
        import { gsap }         from "gsap";
        import  Stats           from "stats.js";
        import { GUI }           from "dat.gui";

        import { ScrollTrigger }    from "gsap/ScrollTrigger";
        import { ScrollSmoother }   from "gsap/ScrollSmoother";
        import { EffectComposer }   from "three/examples/jsm/postprocessing/EffectComposer.js";
        import { RenderPass }       from "three/examples/jsm/postprocessing/RenderPass.js";
        import { BokehPass }        from "three/examples/jsm/postprocessing/BokehPass.js";
        import { LogoAnimation }    from "./modules/animations.js"; 

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
        import { updateGlassCutouts } from "./modules/styles.js";
        import { installUnifiedScrollTimelineEditor } from "./scroll-timeline-editor.js";
    /* PRELOAD */


    // SVG LIQUID GLASS CUTOUTS
        window.addEventListener("load", updateGlassCutouts);
        window.addEventListener("resize", updateGlassCutouts);



    /* ELEMENTS */
        let dom                 = domain;
        let rendererWidth       = dom.viewport.clientWidth;
        let rendererHeight      = dom.viewport.clientHeight;
        let rendererCanvas      = dom.canvas;

        let renderoWidth        = dom.viewport2.clientWidth;
        let renderoHeight       = dom.viewport2.clientHeight;
        let renderoCanvas       = dom.canvaso;

    /* INDEXES */
        let buildingIndex       = 0;
        let buildingModelIndex  = 0;

    /* SCENES */
        let scene               = scenes.mainScene;
        
        let secondScene         = scenes.secondScene;

    /* CAMERAS */
        let perspCamera         = cameras.perspective;
        let orthoCamera         = cameras.orthographic;

    /* CAMERA ANIMATION */
        let main                = document.getElementById('main');
        let sectionValue;
        let mainHeight;
        let sectionHeight;


        const changemainHeight = () => {
            mainHeight = main.scrollHeight;
            sectionHeight   = mainHeight / 5;
            };
        changemainHeight();

        // POZIȚII DEFINITIVE DIN EXPORTUL GUI (viewport-referință: 2560 × 1302).
        // Toate valorile sunt px de scroll, raportate la maximul original de 8413px.
        // La alte dimensiuni se păstrează proporția în scrollbar, nu pixelii ficși.
        const REFERENCE_SCROLL = 8413;
        const GSAP_PX_PER_SECOND = 110.352;
        const getMaxScroll = () => Math.max(1,
            (document.scrollingElement || document.documentElement).scrollHeight - window.innerHeight);
        const toReferenceScroll = () => window.scrollY / getMaxScroll() * REFERENCE_SCROLL;
        const gsapTimeAt = scrollPx => scrollPx / GSAP_PX_PER_SECOND;

        const cameraScrollPoints = [0, 1098, 1922, 5815, 7753, 9691, 11629];
        const cameraAnimationStart = { px: 0 };  // CAM 0
        const getCameraPhase = scrollY => {
            // Pana la CAM 0 ramanem in pozitia A (fara miscarea camerei).
            if (scrollY <= cameraAnimationStart.px) return 0;
            for (let i = 0; i < cameraScrollPoints.length - 1; i++) {
                if (scrollY < cameraScrollPoints[i + 1]) {
                    const segmentStart = i === 0 ? cameraAnimationStart.px : cameraScrollPoints[i];
                    return i + Math.max(0, Math.min(.999999,
                        (scrollY - segmentStart) /
                        Math.max(1, cameraScrollPoints[i + 1] - segmentStart)));
                }
            }
            return 5.999999;
        };

        function updateCam() {
            let perspCameraZoom;
            let clientHeight;
            const changeCameraZoom = () => {perspCameraZoom = window.innerWidth < 1025 ? .65 : 1}
            changeCameraZoom();
            const changeHeight = () => {clientHeight = window.innerHeight < 1000 ? .5 : -1.0};
            changeHeight();

            window.addEventListener("resize", changeCameraZoom);
            // Section 0
            const camPosA = new THREE.Vector3(15, 7.5, 10.5);
            const lookA = new THREE.Vector3(-5.5, 12.5, -10.5);
            const zoomA = perspCameraZoom * 1;
            // Section 1
            const camPosB = new THREE.Vector3(35, 7.5, 10.5);
            const lookB = new THREE.Vector3(-5.5, 12.5, -10.5);
            const zoomB = perspCameraZoom * 2;
            // Section 2
            const camPosC = new THREE.Vector3(15, 20, 10.5);
            const lookC = new THREE.Vector3(-7.75, clientHeight, -12.5);
            const zoomC = perspCameraZoom * 3.5;
            // Section 3
            const camPosD = new THREE.Vector3(15, 10, -10.5);
            const lookD = new THREE.Vector3(-5.5, 3, -10.5);
            const zoomD = perspCameraZoom * 3.5;
            // Section 4
            const camPosE = new THREE.Vector3(12.5, 0, -10.5);
            const lookE = new THREE.Vector3(-5.5, 0, -10.5);
            const zoomE = perspCameraZoom * 4.5;
            // Section 5
            const camPosF = new THREE.Vector3(12.5, -10.5, -10.5);
            const lookF = new THREE.Vector3(-5.5, -10.5, -10.5);
            const zoomF = perspCameraZoom * 5.5;
            // Section 6
            const camPosG = new THREE.Vector3(12.5, -10.5, -10.5);
            const lookG = new THREE.Vector3(-5.5, -10.5, -10.5);
            const zoomG = perspCameraZoom * 5.5;
            
            let scroll = getCameraPhase(toReferenceScroll());
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
                    zoomStart = zoomA; 
                    zoomEnd = zoomB;
                    sectionName = 'Greetings';
                    break;
        
                case 1:
                    posStart = camPosB; 
                    posEnd = camPosC;
                    lookStart = lookB; 
                    lookEnd = lookC;
                    zoomStart = zoomB;
                    zoomEnd = zoomC;
                    sectionName = 'About Me';
                    break;
        
                case 2:
                    posStart = camPosC; 
                    posEnd = camPosD;
                    lookStart = lookC; 
                    lookEnd = lookD;
                    zoomStart = zoomC; 
                    zoomEnd = zoomD;
                    sectionName = 'Projects';
                    break;
        
                case 3:
                    posStart = camPosD; 
                    posEnd = camPosE;
                    lookStart = lookD; 
                    lookEnd = lookE;
                    zoomStart = zoomD; 
                    zoomEnd = zoomE;
                    sectionName = 'Abilities';
                    break;

                case 4:
                    posStart = camPosE; 
                    posEnd = camPosF;
                    lookStart = lookE; 
                    lookEnd = lookF;
                    zoomStart = zoomE; 
                    zoomEnd = zoomF;
                    sectionName = 'Experiences';
                    break;

                case 5:
                    posStart = camPosF; 
                    posEnd = camPosG;
                    lookStart = lookF; 
                    lookEnd = lookG;
                    zoomStart = zoomF; 
                    zoomEnd = zoomG;
                    sectionName = 'Contacts';
                    break;
                    
                case 6:
                    posStart = camPosF; 
                    posEnd = camPosG;
                    lookStart = lookF; 
                    lookEnd = lookG;
                    zoomStart = zoomG; 
                    zoomEnd = zoomG;
                    sectionName = 'Contacts';
                    break;

                default:
                    posStart = camPosG; 
                    posEnd = camPosG;
                    lookStart = lookG; 
                    lookEnd = lookG;
                    zoomStart = zoomG; 
                    zoomEnd = zoomG;
                    sectionName = '';
                    break;
            }
            // console.log(`Window at zone ${section} at ${scroll} ${sectionName}`);
            let easedT = t;
            easedT = Math.pow(easedT, 2.0);
            easedT = Math.min(easedT, 0.8);
        
            const pos = posStart.clone().lerp(posEnd, easedT);
            perspCamera.position.copy(pos);
        
            const look = lookStart.clone().lerp(lookEnd, easedT);
            perspCamera.lookAt(look);
        
            perspCamera.zoom = THREE.MathUtils.lerp(zoomStart, zoomEnd, easedT);
            perspCamera.updateProjectionMatrix();

            };

    /* CHANGE COLOR FILTER */
        let filterColor      = "#566E9C";
        let filterIntensity  = 1;
        let filterBlendMode  = 5;
        
    /* GUI PANEL
        // The GUI panel
        const gui = new GUI();
        const blendModes = {
            Multiply: 0,
            Screen: 1,
            Overlay: 2,
            SoftLight: 3,
            HardLight: 4,
            ColorDodge: 5,
            ColorBurn: 6,
            LinearDodge: 7,
            LinearBurn: 8,
            VividLight: 9,
            LinearLight: 10,
            PinLight: 11,
            HardMix: 12,
            Difference: 13,
            Exclusion: 14,
            Darken: 15,
            Lighten: 16,
            Subtract: 17,
            Divide: 18,
            Hue: 19,
            Saturation: 20,
            Color: 21,
            Luminosity: 22
        };

        function reloadScene() {

                // 1. Dispose meshes
                scene.traverse(obj => {
                    if (obj.isMesh) {
                        if (obj.geometry) obj.geometry.dispose();
            
                        if (obj.material) {
                            if (Array.isArray(obj.material)) {
                                obj.material.forEach(m => m.dispose());
                            } else {
                                obj.material.dispose();
                            }
                        }
                    }
                });
            
                // 2. Remove all objects except pageLayout (and optionally lights)
                scene.children.slice().forEach(obj => {
                    if (obj.name !== "pageLayout") {
                        scene.remove(obj);
                    }
                });
            
                // 3. Reset indices if you want a full reset
                // or keep them if you want to stay on current building/model
                // buildingIndex = 0;
                // buildingModelIndex = 0;
            
                // 4. Update references
                updateRefs();
            
                // 5. Reload building + info with current filter settings
                loaders.loadBuilding(
                    scene,
                    light,
                    building,
                    material,
                    filterColor,
                    filterIntensity,
                    filterBlendMode
                );
            
                loaders.loadInfo(name, about, type, style);
            
                console.log("Scene fully reloaded with new filter settings.");
            };

        gui.addColor({ value: filterColor }, "value")
            .name("Filter Color")
            .onChange(v => {
                filterColor = v;
                console.log("filterColor =", filterColor);
                reloadScene(renderer, scene);
            });
        
        // Intensity slider
        gui.add({ value: filterIntensity }, "value", 0, 1, 0.001)
            .name("Intensity")
            .onChange(v => {
                filterIntensity = v;
                console.log("filterIntensity =", filterIntensity);
                reloadScene(renderer, scene);
            });

        gui.add({ value: filterBlendMode }, "value", blendModes)
            .name("Blend Mode")
            .onChange(v => {
                filterBlendMode = v;
                console.log("filterBlendMode =", filterBlendMode);
                reloadScene(renderer, scene);
            });
    */

    /* CAMERA FOCUS */
        const focusPoint        = new THREE.Vector3(-5, 0, -10);

    /* EXTRACTS */
        let buildings           = objects.buildingsList;
        let models              = objects.modelsList;
        let textures            = objects.texturesList;

    /* INFORMATIONS */
        let name                = info.names[buildingIndex];
        let about               = info.abouts[buildingIndex];
        let type                = info.types[buildingIndex];
        let style               = info.styles[buildingIndex];

        /* 
            dom.innerHTML = `Proiect ${name} de tipul ${type} în stilul ${style} este ${about}`
        */

        let symbols             = Object.values(abilities)
        
    /* MESHES */
        let neighbor            = objects.neighbor.main;
        let building            = buildings[buildingIndex];
        let model               = models[buildingIndex];

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
        function nextBuildingIndex  () {
            if      (buildingIndex < buildings.length - 1) {buildingIndex++;} 
            else    {buildingIndex = 0;}
            console.log(`Changed indexes ${buildingIndex+1} / ${buildings.length}`);
            };          
        function prevBuildingIndex  () {
            if      (buildingIndex > 0) {buildingIndex--;} 
            else    {buildingIndex = buildings.length - 1;}
            console.log(`Changed indexes ${buildingIndex+1} / ${buildings.length}`)
            };       
        function prevModelIndex     () {
            if (buildingModelIndex > 0) {buildingModelIndex--;} 
            else {buildingModelIndex = models.length - 1;}
            console.log(`Changed indexes are: 
                model ${buildingModelIndex} / ${models.length} of building ${buildingIndex+1}`)
            }; 
        // function nextModelIndex     () {
        //     if (buildingModelIndex < models.length - 1) {buildingModelIndex++;} 
        //     else {buildingModelIndex = 0;}
        //     console.log(`Changed indexes are: 
        //         model ${buildingModelIndex} / ${models.length} of building ${buildingIndex+1}`);
        //     };

    /* UPDATERS */
        function updateRefs         () {
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
            };
        function updateCanvas       () {
            rendererWidth       = dom.viewport.clientWidth;
            rendererHeight      = dom.viewport.clientHeight;
            renderer.setSize    (rendererWidth, rendererHeight);
            perspCamera.aspect  = rendererWidth / rendererHeight;
            perspCamera.updateProjectionMatrix();
            };
        function updateCanvaso      () {
            renderoWidth            = dom.viewport2.clientWidth;
            renderoHeight           = dom.viewport2.clientHeight;
            renderero.setSize       (renderoWidth, renderoHeight);
            orthoCamera.aspect      = renderoWidth / renderoHeight;
            resizeOrthoCamera       (renderoWidth, renderoHeight);
            };

    /* ENVIRONMENT */
        const   hdrLoader       = new HDRLoader();


            hdrLoader.load(
                './assets/textures/environment/cloisterPassage/studio_small_08_2k.hdr',
                (texture) => {


                    texture.mapping = THREE.EquirectangularReflectionMapping;

                    // Existing building scene
                    scene.environment = texture;

                    // Separate 3D logo scene
                    secondScene.environment = texture;




                    const hdriRotation = secondScene.environmentRotation;

                    // Tilt the HDRI diagonally
                    hdriRotation.set(
                        THREE.MathUtils.degToRad(25),  // X — vertical tilt
                        0,                             // Y — horizontal rotation
                        THREE.MathUtils.degToRad(45)   // Z — diagonal tilt
                    );

                    // Slowly rotate the reflections
                    gsap.to(hdriRotation, {
                        y: Math.PI * 2,
                        duration: 10,
                        ease: "none",
                        repeat: -1
                    });









                    // HDRI reflection intensity
                    secondScene.environmentIntensity = 1.5;

                    console.log("HDRI applied to logo scene");


                    // Logo 3D scene
                    secondScene.environment = texture;

                    // Reflection lighting strength for logo
                    secondScene.environmentIntensity = 0.45;

                    console.log("HDRI loaded for both scenes");
                },
                undefined,
                (err) => console.log('HDR load error', err)
            );
 

    /* RENDERER */
        let renderer = renders(
            rendererWidth, 
            rendererHeight, 
            rendererCanvas
            );

        let renderero = rendero(
            renderoWidth,
            renderoHeight,
            renderoCanvas
            );

    /* ACTIONS */
        dom.nextBtn.addEventListener    
            ('click', ()=>{
                nextBuildingIndex();
                updateRefs();
                loaders.loadBuilding(scene, light, building, material, filterColor, filterIntensity, filterBlendMode);
                changeDescription(name, about, type, style);
                console.log("nextBtn was pressed");
            });

        dom.prevBtn.addEventListener    
            ('click', ()=>{
                prevBuildingIndex();
                updateRefs();
                loaders.loadBuilding(scene, light, building, material, filterColor, filterIntensity, filterBlendMode);
                changeDescription(name, about, type, style);
            });

        // dom.upBtn.addEventListener      
        //     ('click', ()=>{
        //         nextModelIndex();
        //         updateRefs()
        //         loaders.loadModel(scene, light, model, material, filterColor, filterIntensity, filterBlendMode);
        //         loaders.loadInfo(name, about, type, style);
        //     });

        dom.downBtn.addEventListener    
            ('click', ()=>{
                prevModelIndex();
                updateRefs();
                loaders.loadModel(scene, light, model, material, filterColor, filterIntensity, filterBlendMode);
                loaders.loadInfo(name, about, type, style);
            });
    
        window.addEventListener
            ('resize', () => {
                updateCanvas();
                updateCanvaso();
            });

        window.addEventListener("resize", changemainHeight);
              
    /* CONTROL */
    const control = controls(orthoCamera, renderero.domElement);


        control.enablePan = false;

        // Both mouse buttons rotate instead of panning
        control.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE
        };





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

    // DISTANCES
        const infoSection = document.querySelector('.informations')
        const distance = infoSection.getBoundingClientRect().top + window.scrollY;
        console.log(distance)

        function createDashedLineAt(y) {
            const line = document.createElement('div');
        
            line.style.position = 'absolute';
            line.style.left = '0';
            line.style.width = '100%';
            line.style.top = y + 'px';
        
            line.style.borderTop = '2px dashed #555';
            line.style.pointerEvents = 'none';
            line.style.zIndex = '9999';
        
            document.body.appendChild(line);
        
            return line;
        }
        
        const distance1 = distance;
        const distance2 = distance1/2;
        const distance3 = distance1/4;
        // Praguri text; mutate live din timeline-ul unificat.
        const textScrollPoints = { salut: 1103, proiect: 3948, gol: 6884 };

/*         createDashedLineAt(distance1);
        createDashedLineAt(distance2);
        createDashedLineAt(distance3); */

        const pageHeight = document.documentElement.scrollHeight;
        const distToPage = `${parseInt(distance1 / pageHeight * 100)}%`;
        console.log(distToPage);

    // ANIMATIONS
        if (window.innerWidth >= 1024) {
            document.querySelectorAll(".navItem").forEach(item => {
                item.addEventListener("mouseenter", () => {
                    gsap.to(item, {
                        x: "50%",
                        duration: 0.35,
                        ease: "power2.out"
                    });
                });
                item.addEventListener("mouseleave", () => {
                    gsap.to(item, {
                        x: "0%",
                        duration: 0.35,
                        ease: "power2.out"
                    });
                });
            });
        }
        function setupNavHover() {
            const items = document.querySelectorAll(".navItem");
        
            if (window.innerWidth >= 1024) {
                items.forEach(item => {
                    item.addEventListener("mouseenter", () => {
                        gsap.to(item, {
                            x: "50%",
                            duration: 0.35,
                            ease: "power2.out"
                        });
                    });
                    item.addEventListener("mouseleave", () => {
                        gsap.to(item, {
                            x: "0%",
                            duration: 0.35,
                            ease: "power2.out"
                        });
                    });
                });
            } else {
                items.forEach(item => {
                    item.addEventListener("mouseenter", () => {
                        gsap.to(item, {
                            flexGrow: 2,
                            duration: 0.35,
                            ease: "power2.out"
                        });
                        item.classList.add("showText");
                    });
        
                    item.addEventListener("mouseleave", () => {
                        gsap.to(item, {
                            flexGrow: 1,
                            duration: 0.35,
                            ease: "power2.out"
                        });
                        item.classList.remove("showText");
                    });
                });
            }
        }
        
        setupNavHover();

        let logoAnimation = new LogoAnimation();
        gsap.registerPlugin(ScrollTrigger);
        

        function viewportAnimation      () {
            let viewportTimeline = gsap.timeline({
                defaults: { duration: 6, ease: "power2.out" }})
                    
            viewportTimeline
                .to(".viewport2", {scale: 0.20}) /////// here you can scale logo 2D form
                .to(".viewport2", {y: '-50%'}, "-=1")
                .to(".viewport2", {
                    x: () => -Math.max(35, Math.min(70, window.innerWidth * 0.04))
                }, ">")

            return viewportTimeline;
            };



        function showTextOn() {
            const element = dom.text2D;
            element.textContent = text;

            const textTimeline = gsap.timeline();

            // Start at viewport center and slide slightly right
            textTimeline.fromTo(
                element,
                {
                    x: 5,
                    autoAlpha: 0
                },
                {
                    x: 2, // pozitie text cand se misca la dreapta
                    autoAlpha: 1,
                    duration: 6,
                    ease: "power2.out"
                }
            );

            return textTimeline;
        }



        function showTextOff            () {
            const element = dom.text2D;
            element.style.opacity = 1;
        
            return gsap.to(element, {
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
            };

        function infoBarShowOn          () {
            let infoBarTimline = gsap.timeline({
                defaults: { duration: 6, ease: "power2.out" }});

            infoBarTimline
                .to(".infoBar", {x: '0%'})
                
            return infoBarTimline;
            };

        function infoBarShowOff         () {
            let infoBarTimline = gsap.timeline({
                defaults: { duration: 6, ease: "power2.out" }});

            infoBarTimline
                .to(".infoBar", {
                    x: "105%",
                    opacity: 0,
                    duration: 6,
                    ease: "power2.out"
                })
                
            return infoBarTimline;
            };

        function orthoCameraAnimation   () {

            let orthoCameraTimeline = gsap.timeline({
                defaults: { duration: 5, ease: "power2.out" }});

                orthoCameraTimeline
                .to(orthoCamera.position, { x: 0, z: 0.0001}, 1, 0)
            

            return orthoCameraTimeline
            };

        function controlNextBtn         () {
            let tl = gsap.timeline({
                defaults: { duration: 0.5, ease: "power2.out" }
            });
        
            tl.to(".nextBtn", {
                x: "1000%",
                y: "-275%",
                rotateZ: "720deg",
                duration: 4,
                ease: "power2.out",
                delay: 1
            })
            .to(".nextBtn", {
                x: "100%",
                rotateZ: "45deg",
                duration: 4,
                ease: "power2.out",
                delay: 1
            })
            .to(".nextBtn", {
                opacity: 0,
                duration: 4,
                delay: 12
            });
        
            return tl;
            };

        function controlPrevBtn         () {
            let tl = gsap.timeline({
                defaults: { duration: 0.5, ease: "power2.out" }
            });
        
            tl.to(".prevBtn", {
                x: "-1000%",
                y: "-275%",
                rotateZ: "720deg",
                duration: 4,
                ease: "power2.out",
                delay: 1
            })
            .to(".prevBtn", {
                x: "-100%",
                rotateZ: "45deg",
                duration: 4,
                ease: "power2.out",
                delay: 1
            })
            .to(".prevBtn", {
                opacity: 0,
                duration: 4,
                delay: 12
            });
        
            return tl;
            };

        function controlDownBtn         () {
            let tl = gsap.timeline({
                defaults: { duration: 0.5, ease: "power2.out" }
            });
        
            tl.to(".downBtn", {
                y: "275%",
                rotateZ: "180deg",
                duration: 4,
                ease: "power2.out",
                delay: 1
            })
            .to(".downBtn", {
                y: "0%",
                rotateZ: "45deg",
                duration: 4,
                ease: "power2.out",
                delay: 1
            })
            .to(".downBtn", {
                opacity: 0,
                duration: 4,
                delay: 12
            });
        
            return tl;
            };

        function controlBtnsOff         () {
            let tl = gsap.timeline();
        
            tl.to(".controls", { opacity: 1, duration: 3, ease: "power2.out"})
                .to(".controls", { opacity: 0, duration: 3, ease: "power2.out" });
        
            return tl;
            };

        // ScrollTrigger folosește ÎNTREGUL scroll real; reperele sunt cele exportate.
        const mainTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.main',
                start: 0,
                end: () => getMaxScroll(),
                invalidateOnRefresh: true,
                markers: false,
                scrub: 1
            }
        });

        // Timpii de intrare provin din PRINT / COPY (px / 110.352 px/sec).
        // Păstrăm tween-urile GSAP originale, doar mutăm începutul lor.
        mainTimeline
            .add(orthoCameraAnimation(), gsapTimeAt(546))
            .add(viewportAnimation(), gsapTimeAt(679))
            .add(showTextOn(), gsapTimeAt(2142))
            .to('.infoBar', {
                x: '0%',
                opacity: 1,
                duration: 6,
                ease: 'power2.out'
            }, gsapTimeAt(1103))
            .add(controlNextBtn(), gsapTimeAt(2798))
            .add(controlPrevBtn(), gsapTimeAt(2798))
            .add(controlDownBtn(), gsapTimeAt(2798))
            .add(infoBarShowOff(), gsapTimeAt(5667))
            .add(controlBtnsOff(), gsapTimeAt(6219))
            .add(infoBarShowOff(), gsapTimeAt(6881));

        // Ancoră invizibilă: durata totală a timeline-ului = 100% din scroll.
        mainTimeline.to({ _scrollAnchor: 0 }, {
            _scrollAnchor: 0, duration: 0.001, ease: 'none'
        }, gsapTimeAt(REFERENCE_SCROLL) - 0.001);

            // LOGO INTERACTION LOCK


            // Valorile originale 7/2 + deplasarea aplicată de editor în preview.
            const logoPreviewShift = 646 / GSAP_PX_PER_SECOND;
            const logoLockTime = 7 + logoPreviewShift;
            const logoUnlockTime = 2 + logoPreviewShift;

            let isLogoLocked = false;

            function syncLogoInteraction() {
                const time = mainTimeline.time();

                // Lock when scrolling forward into the 2D state
                if (time >= logoLockTime) {
                    isLogoLocked = true;
                }

                // Unlock only when the reverse camera
                // transition has finished
                else if (time <= logoUnlockTime) {
                    isLogoLocked = false;
                }

                control.setInteractionLocked(isLogoLocked);
            }

            mainTimeline.eventCallback("onUpdate", syncLogoInteraction);

            // Initialize interaction state
            syncLogoInteraction();





    // EVENTS


        window.addEventListener("scroll", () => {
            loaders.preventReload();
        });

        window.addEventListener('resize', ()=>{
            updateCanvas();
            updateCanvaso();
            setupNavHover();
        });
        
        window.addEventListener("reload", () => {
            const scrollIndicator = document.getElementById('scroll-indicator');
            
            scrollIndicator.style.display = 'flex';
            ScrollTrigger.refresh();
            requestAnimationFrame(() => {
              window.scrollTo(10, 10);
              ScrollTrigger.refresh();
            });
            
        });

        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();  
                if (!btn.closest("#abilities, #experiences")) {
                    loaders.loadAnimation(btn);
                    }
                setTimeout(() => {
                    const url = btn.getAttribute("href");
                    const target = btn.getAttribute("target");
        
                    if (!url) return;
        
                    if (target === "_blank") {
                        window.open(url, "_blank");
                    } else {
                        window.location.href = url;
                    }
                }, 600);
            });
        });

    /* EXPERIENCES */
        let cleanupExperienceDescriptions = () => {};
        function setupExperienceDescriptions(experiencesDes) {
            cleanupExperienceDescriptions();
          
            let activeItem = null;
            let isPinned = false;
            const items = [];
            const cleanups = [];
          
            Array.from(experiencesDes).forEach((element) => {
              const parent = element.parentElement;
              const children = Array.from(element.children);
          
              if (!parent || children.length === 0) return;
          
              element.style.display = "none";
              gsap.set(children, { height: 0, overflow: "hidden" });
          
              const item = {
                element,
                parent,
                isOpen: false,
                animation: gsap.to(children, {
                  height: "auto",
                  duration: 0.5,
                  stagger: 0.1,
                  ease: "power2.out",
                  paused: true,
                  onReverseComplete() {
                    if (!item.isOpen) {
                      element.style.display = "none";
                    }
                  }
                })
              };
          
              items.push(item);
          
              function openItem() {
                item.isOpen = true;
                element.style.display = "flex";
                item.animation.play();
              }
          
              function closeItem() {
                item.isOpen = false;
                item.animation.reverse();
              }
          
              function onMouseEnter() {
                if (activeItem !== item) {
                  if (activeItem) {
                    activeItem.isOpen = false;
                    activeItem.animation.reverse();
                  }
          
                  activeItem = item;
                  isPinned = false;
                }
          
                openItem();
              }
          
              function onMouseLeave() {
                if (activeItem === item && !isPinned) {
                  closeItem();
                  activeItem = null;
                }
              }
          
              function onClick() {
                if (activeItem === item && isPinned) {
                  closeItem();
                  activeItem = null;
                  isPinned = false;
                  return;
                }
          
                if (activeItem && activeItem !== item) {
                  activeItem.isOpen = false;
                  activeItem.animation.reverse();
                }
          
                activeItem = item;
                isPinned = true;
                openItem();
              }
          
              parent.addEventListener("mouseenter", onMouseEnter);
              parent.addEventListener("mouseleave", onMouseLeave);
              parent.addEventListener("click", onClick);
          
              cleanups.push(() => {
                parent.removeEventListener("mouseenter", onMouseEnter);
                parent.removeEventListener("mouseleave", onMouseLeave);
                parent.removeEventListener("click", onClick);
                item.animation.kill();
              });
            });
          
            function onDocumentClick(event) {
              if (activeItem && !items.some(({ parent }) => parent.contains(event.target))) {
                activeItem.isOpen = false;
                activeItem.animation.reverse();
                activeItem = null;
                isPinned = false;
              }
            }
          
            document.addEventListener("click", onDocumentClick);
          
            cleanupExperienceDescriptions = () => {
              document.removeEventListener("click", onDocumentClick);
              cleanups.forEach((cleanup) => cleanup());
            };
          }
        const experienceData = {
          architecture: experiences.architecture,
          programmer: experiences.programmer,
          artist: experiences.artist
        };
        function showExpDetails(domBtn, type) {
          const data = experienceData[type];
          if (!data) throw new Error(`Unknown experience type: ${type}`);
        
            document.querySelectorAll("#experiences .experience.banner > .btn")
                .forEach(button => {
                    button.classList.toggle("is-selected", button === domBtn);
                });



          expDetails.style.display = "flex";
          loaders.loadExperience(domBtn, data);
        
          // Initialize descriptions after the content has been loaded.
          setupExperienceDescriptions(
            expDetails.querySelectorAll(".expDescription")
          );
        };
        setupExperienceDescriptions         (expDetails.querySelectorAll(".expDescription"));
        
        dom.architectBtn.addEventListener   ("click",   () => showExpDetails(dom.architectBtn, "architecture"));
        dom.programmerBtn.addEventListener  ("click",   () => showExpDetails(dom.programmerBtn, "programmer"));
        dom.artistBtn.addEventListener      ("click",   () => showExpDetails(dom.artistBtn, "artist"));


        const sectionsNavBar        = document.getElementById("navBar");
        const sectionsBtns          = Array.from(sectionsNavBar.children);

        const projectsBanner        = document.getElementById("controls");
        const abilitiesBanner       = document.getElementById("ability banner");
        const experiencesBanner     = document.getElementById("experience banner");
        const contactsBanner        = document.getElementById("contact banner");

        const aboutMeBody           = document.getElementById("aboutMe");
        const projectsBody          = document.getElementById("viewport");
        const abilitiesBody         = document.getElementById("abilities");
        const experiencesBody       = document.getElementById("experiences");
        const contactsBody          = document.getElementById("contacts");

        let bodyPos;
        let aboutMePos;    
        let projectsPos; 
        let abilitiesPos; 
        let experiencePos; 
        let contactsPos;  
        
        function resizeSections() {
            let numberOfSections = 7;
            let totalHeight = window.innerHeight * numberOfSections;
        }

        function updateSectionsPos() {
            let aboutMeHeight           = parseFloat(getComputedStyle(aboutMeBody).height);
            let projectsHeight          = parseFloat(getComputedStyle(projectsBody).height);
            let abilitiesHeight         = parseFloat(getComputedStyle(abilitiesBody).height);
            let experiencesHeight       = parseFloat(getComputedStyle(experiencesBody).height);
            let contactsHeight          = parseFloat(getComputedStyle(contactsBody).height);
            let totalHeight = [
                    aboutMeBody,
                    projectsBody,
                    abilitiesBody,
                    experiencesBody,
                    contactsBody
                    ].reduce((sum, el) => sum + parseFloat(getComputedStyle(el).height), 0);
    
            bodyPos        = 0;
            aboutMePos     = totalHeight    - (abilitiesHeight + experiencesHeight + contactsHeight);
            projectsPos    = totalHeight    - (abilitiesHeight + experiencesHeight + contactsHeight) + aboutMePos;
            abilitiesPos   = totalHeight    - (experiencesHeight + contactsHeight) + projectsPos;
            experiencePos  = totalHeight    - contactsHeight + abilitiesPos;
            contactsPos    = totalHeight    - totalHeight;
        
            console.log(
                bodyPos,
                aboutMePos,
                projectsPos,
                abilitiesPos,
                experiencePos,
                contactsPos,
                totalHeight
            );
        }
        let heightFactor;
        const updateheightFactor = () => {heightFactor = window.innerHeight > 700 ? 1.5 : .5}
        let startAnimation = 20;
        updateheightFactor();

        const changeDescription = () => {
            const name = info.names[buildingIndex];
            const about = info.abouts[buildingIndex];
            const type = info.types[buildingIndex];
            const style = info.styles[buildingIndex];
            const scroll = toReferenceScroll();
          
            if (scroll >= textScrollPoints.salut && scroll < textScrollPoints.proiect) {
              dom.infoBar.innerHTML = `
                <div>
                  <h1>Salut!</h1>
                  <h2>Mă numesc <strong>Mihael-Ionuț FURDU</strong></h2>
                  <p>Sunt arhitect cu drept de semnătură și cu această ocazie vă învit să parcurgeți site-ul.</p>
                </div>`;
              return;
            }
          
            if (scroll >= textScrollPoints.proiect && scroll < textScrollPoints.gol) {
              dom.infoBar.innerHTML = `
                <div>
                  <h1>${name ?? ""}</h1>
                  <p>${about ?? ""}</p>
                </div>`;
              return;
            } 
          
            dom.infoBar.innerHTML = "";
          };

        window.addEventListener("scroll", changeDescription);

        // TEMPORARY UNIFIED SCROLL EDITOR — same layout and markers as v3 (CAM 0).
        // It edits the underlying live camera points, text thresholds and GSAP tweens.
        // The timeline uses the saved REFERENCE_SCROLL pixel system internally.
        const startUnifiedScrollEditor = () => {
            ScrollTrigger.refresh();
            installUnifiedScrollTimelineEditor({
                gsap,
                mainTimeline,
                cameraScrollPoints,
                cameraAnimationStart,
                textScrollPoints,
                onTextChange: changeDescription,
                referenceScroll: REFERENCE_SCROLL
            });
        };
        if (document.readyState === "complete") startUnifiedScrollEditor();
        else window.addEventListener("load", startUnifiedScrollEditor, { once: true });

        // IMPORTANT: call this once after DOM loads
        // updateSectionsPos();
        const section1 = document.getElementById("section viewports")
        const section2 = document.getElementById("section informations")
        const section12 = parseInt(getComputedStyle(section1).height) + parseInt(getComputedStyle(section2).height)
        const section1startPos = parseInt(getComputedStyle(section1).height);
        const section2startPos = parseInt(getComputedStyle(section1).height) - parseInt(getComputedStyle(section2).height);
        const abilityStartPos = section1startPos - parseInt(getComputedStyle(abilitiesBody).height)/4;
        const experienceStartPos = section2startPos + parseInt(getComputedStyle(experiencesBody).height) + parseInt(getComputedStyle(abilitiesBody).height)*2.575;

        sectionsBtns.forEach((e)=>{e.addEventListener("click", 
            ()=>{
                switch (e.id) {
                    case 'navGreeting':
                        loaders.loadScroll(sectionHeight * 0);
                        loaders.loadPress(document.getElementById('canvaso'));
                        break;
    
                    case 'navAboutMe':
                        loaders.loadScroll(getMaxScroll() * (1765 / REFERENCE_SCROLL));
                        loaders.loadPress(document.querySelector('.aboutMe'));
                        break;
                    
                    case 'navProjects':
                        loaders.loadScroll(sectionHeight * 2.35);
                        loaders.loadPress(document.querySelectorAll('.navBtn'));
                        break;
    
                    case 'navAbilities':
                        loaders.loadScroll(abilityStartPos);
                        loaders.loadPress(document.querySelector('.abilities'));
                        break;
                    
                    case 'navExperiences':
                        loaders.loadScroll(experienceStartPos);
                        loaders.loadPress(document.querySelector('.experiences'));
                        break;
    
                    case 'navContacts':
                        loaders.loadScroll(section12);
                        loaders.loadPress(contactsBanner);
                        break;
            }
        })});


    /* SCENE SCROLL RESISTANCE — Navigation scene anchors
       Applies only to user wheel/trackpad input. No changes to GSAP timings,
       camera keyframes, text triggers or navigation button destinations.
       Resistance gently fades in and out across each anchor zone.
    */
    const sceneScrollFeel = {
        zoneHeightInViewports: 0.34, // radius on EACH side of an anchor, in viewport heights
        speedAtAnchor: 0.18,        // 18% scroll speed at center (1.0 = no resistance)
        glide: 0.23                 // 0..1, higher = follows scroll more immediately
    };

    const scrollClamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const smoothFade = value => {
        const t = scrollClamp(value, 0, 1);
        return t * t * (3 - 2 * t);
    };

    // Same destinations as the existing navGreeting ... navContacts click handlers.
    function getSceneStops() {
        const limit = getMaxScroll();
        return [
            0,                                  // navGreeting
            limit * (2459 / REFERENCE_SCROLL),   // navAboutMe
            sectionHeight * 2.35,               // navProjects
            abilityStartPos,                    // navAbilities
            experienceStartPos,                 // navExperiences
            section12                           // navContacts
        ].map(value => scrollClamp(value, 0, limit));
    }

    function getScrollGain(atY, stops, radius) {
        const nearest = Math.min(...stops.map(stop => Math.abs(stop - atY)));
        // 0 at the anchor, 1 outside the fade zone; smoothstep joins with zero slope.
        const fadedDistance = smoothFade(nearest / radius);
        return sceneScrollFeel.speedAtAnchor +
            (1 - sceneScrollFeel.speedAtAnchor) * fadedDistance;
    }

    let sceneWheelTarget = window.scrollY;
    let sceneWheelFrame = null;
    let sceneWheelAnimating = false;

    function stopSceneWheelGlide() {
        if (sceneWheelFrame !== null) cancelAnimationFrame(sceneWheelFrame);
        sceneWheelFrame = null;
        sceneWheelAnimating = false;
        sceneWheelTarget = window.scrollY;
    }

    function sceneWheelGlide() {
        const current = window.scrollY;
        const difference = sceneWheelTarget - current;

        if (Math.abs(difference) < 0.5) {
            window.scrollTo({ top: sceneWheelTarget, behavior: 'instant' });
            sceneWheelAnimating = false;
            sceneWheelFrame = null;
            return;
        }

        window.scrollTo({
            top: current + difference * sceneScrollFeel.glide,
            behavior: 'instant'
        });
        sceneWheelFrame = requestAnimationFrame(sceneWheelGlide);
    }

    function hasIndependentVerticalScroll(element, direction) {
        for (let node = element; node instanceof Element && node !== document.documentElement; node = node.parentElement) {
            const style = getComputedStyle(node);
            if (!/(auto|scroll)/.test(style.overflowY)) continue;
            if (node.scrollHeight <= node.clientHeight + 1) continue;
            if (direction > 0 && node.scrollTop + node.clientHeight < node.scrollHeight - 1) return true;
            if (direction < 0 && node.scrollTop > 1) return true;
        }
        return false;
    }

    window.addEventListener('wheel', event => {
        if (event.defaultPrevented || event.ctrlKey || event.metaKey ||
            Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

        // Don't take control of controls or separately scrollable panels.
        if (event.target instanceof Element && (
            event.target.closest('input, textarea, select, [contenteditable], [data-native-scroll], .dg, #unified-scroll-editor') ||
            hasIndependentVerticalScroll(event.target, event.deltaY)
        )) return;

        // Normalize mouse wheel / line / page delta modes to CSS pixels.
        const inputDelta = event.deltaY *
            (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
        if (!inputDelta) return;
        event.preventDefault();

        if (!sceneWheelAnimating) sceneWheelTarget = window.scrollY;

        // Integrate in small steps so a fast wheel tick cannot skip a slowdown zone.
        const direction = Math.sign(inputDelta);
        const scrollLimit = getMaxScroll();
        const sceneStops = getSceneStops();
        const radius = Math.max(140, window.innerHeight * sceneScrollFeel.zoneHeightInViewports);
        let remaining = Math.min(2000, Math.abs(inputDelta));
        while (remaining > 0) {
            const step = Math.min(18, remaining);
            sceneWheelTarget = scrollClamp(
                sceneWheelTarget + direction * step * getScrollGain(sceneWheelTarget, sceneStops, radius),
                0, scrollLimit
            );
            remaining -= step;
        }

        if (!sceneWheelAnimating) {
            sceneWheelAnimating = true;
            sceneWheelFrame = requestAnimationFrame(sceneWheelGlide);
        }
    }, { passive: false });

    // Manual scrollbar dragging, keyboard navigation and nav button clicks
    // interrupt the glide; these navigation methods retain their native behavior.
    window.addEventListener('pointerdown', stopSceneWheelGlide, { passive: true });
    window.addEventListener('keydown', stopSceneWheelGlide, { passive: true });
    window.addEventListener('scroll', () => {
        if (!sceneWheelAnimating) sceneWheelTarget = window.scrollY;
    }, { passive: true });

    /* TESTING */

    /* COMMITS */
        loaders.loadVersion     ("beta", " 1.0.02")
        loaders.loadIndicator   (dom);
        updateRefs();
        updateSectionsPos();
        loaders.loadPage        ();
        changeDescription       (name, about, type, style);
        loaders.loadPush        (dom.experience, "Vezi mai mult");
        loaders.loadPush        (document.querySelector('.experience.banner'));
        loaders.loadLogo        (secondScene, light, logo3D, materials, logoAnimation);
        loaders.loadNeighboar   (scene, light, neighbor, materials);
        loaders.loadBuilding    (scene, light, building, material);

    // RENDERING
        function animate() {
            requestAnimationFrame   (animate);
            updateCam               ();
            control.update          ();
            logoAnimation.update    ();
            composero.render        ();
            composer.render         ();
        };
        animate()

    //SCROLL ANIMATION
    
      const scrollCue = document.querySelector(".scroll-indicator");
        if (scrollCue) {
            let lastScrollY = window.scrollY;

            // First appearance after 15 seconds
            let cueTimer = setTimeout(() => {
                scrollCue.classList.add("is-visible");
            }, 15000);

            window.addEventListener("scroll", () => {
                const currentY = window.scrollY;
                const scrollingUp = currentY < lastScrollY;

                // Fade out when scrolling
                scrollCue.classList.remove("is-visible");
                clearTimeout(cueTimer);

                // Reappear after inactivity, or sooner when returning to top
                const delay = scrollingUp && currentY < 120 ? 1000 : 10000;

                cueTimer = setTimeout(() => {
                    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

                    if (window.scrollY < maxScroll - 50) {
                        scrollCue.classList.add("is-visible");
                    }
                }, delay);

                lastScrollY = currentY;
            }, { passive: true });
        }  