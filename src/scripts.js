
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
        // PROJECT BUTTONS — real-time fade, activated by reference scroll position.
        // Independent of the scrubbed GSAP timeline so they can appear during CAM D hold.
        const PROJECT_BUTTON_START_PX = 1920;
        const PROJECT_BUTTON_END_PX = 2480;
        const PROJECT_BUTTON_ENTRY_SECONDS = 2.5;
        const PROJECT_BUTTON_EXIT_SECONDS = 0.05;
        const PROJECT_BUTTON_RISE_PX = 18;
        const getMaxScroll = () => Math.max(1,
            (document.scrollingElement || document.documentElement).scrollHeight - window.innerHeight);
        const toReferenceScroll = () => window.scrollY / getMaxScroll() * REFERENCE_SCROLL;
        const gsapTimeAt = scrollPx => scrollPx / GSAP_PX_PER_SECOND;




        /////CAMERA 0 POSITION - PORTRET/////

        // Camera's original interpolation points are unchanged (preserves the portrait framing).
        // A visual About Me scene stop lives BETWEEN B and the existing 1922px camera keyframe.
        const cameraScrollPoints = [0, 1098, 1922, 5815, 7753, 9691, 11629];
        const cameraAnimationStart = { px: 0 };  // CAM 0
        const sceneAnchors = { aboutMe: 1765 }; // CAM C — About Me; GUI can edit this live
        // CAM D — Projects uses cameraScrollPoints[2] as its ONLY position source.
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

        // Temporal smoothing only. Camera keyframes/easedT stay exactly as defined below.
        const CAMERA_FOLLOW_PER_SECOND = 4.2; // smaller = softer/longer transition
        let cameraSmoothedLook = null;
        let lastCameraFrameAt = null;

        function updateCam() {
            let perspCameraZoom;
            let clientHeight;
            const changeCameraZoom = () => {perspCameraZoom = window.innerWidth < 1025 ? .65 : 1}
            changeCameraZoom();
            const changeHeight = () => {clientHeight = window.innerHeight < 1000 ? .5 : -1.0};
            changeHeight();

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
                    sectionName = 'Camera transition';
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
            // Keep the original t² framing through the portrait (t≈0.809).
            // Hermite interpolation only near the end removes the old 80% -> 100% jump.
            let easedT = t * t;
            const finishFrom = 0.88;
            if (t > finishFrom) {
                const u = (t - finishFrom) / (1 - finishFrom);
                const startValue = finishFrom * finishFrom;
                const startSlope = 2 * finishFrom * (1 - finishFrom);
                easedT =
                    (2 * u ** 3 - 3 * u ** 2 + 1) * startValue +
                    (u ** 3 - 2 * u ** 2 + u) * startSlope +
                    (-2 * u ** 3 + 3 * u ** 2);
            }
        
            const targetPos = posStart.clone().lerp(posEnd, easedT);
            const targetLook = lookStart.clone().lerp(lookEnd, easedT);
            const targetZoom = THREE.MathUtils.lerp(zoomStart, zoomEnd, easedT);

            // Dampen the *movement in time*, not the camera path or portrait framing.
            // At rest on CAM C / CAM D the camera converges to the exact original pose.
            const now = performance.now();
            const dt = lastCameraFrameAt === null
                ? 0
                : Math.min(0.05, Math.max(0, (now - lastCameraFrameAt) / 1000));
            lastCameraFrameAt = now;

            if (cameraSmoothedLook === null) {
                // The first rendered frame must be correct immediately.
                perspCamera.position.copy(targetPos);
                cameraSmoothedLook = targetLook.clone();
                perspCamera.zoom = targetZoom;
            } else {
                const follow = 1 - Math.exp(-CAMERA_FOLLOW_PER_SECOND * dt);
                perspCamera.position.lerp(targetPos, follow);
                cameraSmoothedLook.lerp(targetLook, follow);
                perspCamera.zoom = THREE.MathUtils.lerp(perspCamera.zoom, targetZoom, follow);
            }

            perspCamera.lookAt(cameraSmoothedLook);
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
        // UP / DOWN move within the active project's model variants.
        function nextModelIndex() {
            const list = models[buildingIndex];
            if (!Array.isArray(list) || list.length === 0) return false;
            buildingModelIndex = (buildingModelIndex + 1) % list.length;
            return true;
        }
        function prevModelIndex() {
            const list = models[buildingIndex];
            if (!Array.isArray(list) || list.length === 0) return false;
            buildingModelIndex = (buildingModelIndex - 1 + list.length) % list.length;
            return true;
        }

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

    /* ACTIONS — SVG project controls (IDs kept for GSAP and the scroll GUI) */
        dom.nextBtn.addEventListener('click', () => {
            nextBuildingIndex();
            buildingModelIndex = 0;
            updateRefs();
            loaders.loadBuilding(scene, light, building, material, filterColor, filterIntensity, filterBlendMode);
            changeDescription({ animate: true });
        });

        dom.prevBtn.addEventListener('click', () => {
            prevBuildingIndex();
            buildingModelIndex = 0;
            updateRefs();
            loaders.loadBuilding(scene, light, building, material, filterColor, filterIntensity, filterBlendMode);
            changeDescription({ animate: true });
        });

        function displayCurrentModel() {
            updateRefs();
            loaders.loadModel(scene, light, model, material, filterColor, filterIntensity, filterBlendMode);
            loaders.loadInfo(name, about, type, style);
        }

        document.getElementById('upModelBtn').addEventListener('click', () => {
            if (nextModelIndex()) displayCurrentModel();
        });

        document.getElementById('downModelBtn').addEventListener('click', () => {
            if (prevModelIndex()) displayCurrentModel();
        });

        document.getElementById('wholeModelBtn').addEventListener('click', () => {
            buildingModelIndex = 0;
            updateRefs();
            loaders.loadBuilding(scene, light, building, material, filterColor, filterIntensity, filterBlendMode);
            changeDescription(name, about, type, style);
        });

        // Side images and each Illustrator SVG group animate independently.
        // The GSAP wrappers (.prevBtn / .downBtn / .nextBtn) are never transformed here.
        const projectControls = document.getElementById('controls');
        projectControls.addEventListener('click', event => {
            const control = event.target.closest('button, g[role="button"]');
            if (!control || !projectControls.contains(control)) return;

            const artwork = control.matches('g[role="button"]')
                ? control
                : control.querySelector('.project-nav-art');
            if (!artwork) return;

            artwork.classList.remove('is-tapped');
            void artwork.getBoundingClientRect(); // restart click animation
            artwork.classList.add('is-tapped');
        });

        // Inline SVG <g> elements are focusable and should work with the keyboard.
        projectControls.querySelectorAll('.project-nav-svg g[role="button"]').forEach(group => {
            group.addEventListener('keydown', event => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                group.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            });
        });

        projectControls.addEventListener('animationend', event => {
            if (event.animationName === 'projectNavTap' &&
                event.target.classList?.contains('is-tapped')) {
                event.target.classList.remove('is-tapped');
            }
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
        // Projects text enters at the same camera/navigation anchor as Projects.
        const textScrollPoints = { salut: 1103, proiect: cameraScrollPoints[2], gol: 6884 };

/*         createDashedLineAt(distance1);
        createDashedLineAt(distance2);
        createDashedLineAt(distance3); */

        const pageHeight = document.documentElement.scrollHeight;
        const distToPage = `${parseInt(distance1 / pageHeight * 100)}%`;
        console.log(distToPage);

    // ANIMATIONS
        // Only the Abilities NAV button is removed. #abilities and its hoverable row stay intact.
        document.getElementById('navAbilities')?.remove();

        // One set of listeners, safe to call again on resize (no duplicate hover animations).
        function setupNavHover() {
            document.querySelectorAll('.navItem').forEach(item => {
                if (item.dataset.navHoverReady === 'true') return;
                item.dataset.navHoverReady = 'true';

                item.addEventListener('mouseenter', () => {
                    if (window.innerWidth >= 1024) {
                        gsap.to(item, { x: '50%', duration: 0.35, ease: 'power2.out' });
                    } else {
                        gsap.to(item, { flexGrow: 2, duration: 0.35, ease: 'power2.out' });
                        item.classList.add('showText');
                    }
                });
                item.addEventListener('mouseleave', () => {
                    if (window.innerWidth >= 1024) {
                        gsap.to(item, { x: '0%', duration: 0.35, ease: 'power2.out' });
                    } else {
                        gsap.to(item, { flexGrow: 1, duration: 0.35, ease: 'power2.out' });
                        item.classList.remove('showText');
                    }
                });
            });
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

        // Projects controls appear only inside [START_PX, END_PX) reference-scroll range.
        // Animation time is independent of page scrolling and CAM D magnetic dwell.
        // Only opacity and small Y movement change: responsive CSS X/side positions remain.
        const projectButtonTargets = ['.prevBtn', '.downBtn', '.nextBtn'];
        let projectButtonsInRange = false;

        gsap.set(projectButtonTargets, {
            autoAlpha: 0,
            y: PROJECT_BUTTON_RISE_PX,
            pointerEvents: 'none'
        });

        function syncProjectButtonVisibility() {
            const referenceY = toReferenceScroll();
            const shouldShow = referenceY >= PROJECT_BUTTON_START_PX &&
                               referenceY < PROJECT_BUTTON_END_PX;

            // One transition on entering/leaving the range. Never restart on every scroll tick.
            if (shouldShow === projectButtonsInRange) return;
            projectButtonsInRange = shouldShow;

            gsap.killTweensOf(projectButtonTargets);

            if (shouldShow) {
                // Buttons remain interactive throughout their gentle entrance.
                gsap.set(projectButtonTargets, { pointerEvents: 'auto' });
                gsap.to(projectButtonTargets, {
                    autoAlpha: 1,
                    y: 0,
                    duration: PROJECT_BUTTON_ENTRY_SECONDS,
                    stagger: 0.06,
                    ease: 'power2.out',
                    overwrite: true
                });
            } else {
                gsap.set(projectButtonTargets, { pointerEvents: 'none' });
                gsap.to(projectButtonTargets, {
                    autoAlpha: 0,
                    y: PROJECT_BUTTON_RISE_PX,
                    duration: PROJECT_BUTTON_EXIT_SECONDS,
                    stagger: 0.04,
                    ease: 'power2.inOut',
                    overwrite: true
                });
            }
        }

        window.addEventListener('scroll', syncProjectButtonVisibility, { passive: true });
        // Also handle reloads/restored scroll position already inside the Projects range.
        requestAnimationFrame(syncProjectButtonVisibility);

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
            .add(orthoCameraAnimation(), gsapTimeAt(0))
            .add(viewportAnimation(), gsapTimeAt(227))
            .add(showTextOn(), gsapTimeAt(1380))
            .to('.infoBar', {
                x: '0%',
                opacity: 1,
                duration: 6,
                ease: 'power2.out'
            }, gsapTimeAt(1103))
            // Project buttons are controlled by syncProjectButtonVisibility(), not scrubbed GSAP.
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












        /* INFO BAR — SCENE & TEXT TRANSITIONS */

        const infoBarMotion = {
            exitEnd: 0.40,        // Momentul când bara a dispărut
            enterStart: 0.60,     // Momentul când bara începe să reapară
            travelPercent: 110,  // Cât de departe se retrage spre dreapta
            textFadeOut: 0.20,   // Fade-out între case
            textFadeIn: 0.38     // Fade-in între case
        };

        const infoBarContent = document.createElement('div');
        infoBarContent.className = 'infobar-content';
        dom.infoBar.replaceChildren(infoBarContent);

        let currentInfoKey = null;
        let textTransitionVersion = 0;

        const smoothInfo = value => {
            const t = Math.max(0, Math.min(1, value));
            return t * t * (3 - 2 * t);
        };

        // Construim conținutul barei
        function infoBarMarkup(key) {

            if (key === 'intro') return `
                <div>
                    <h1>Salut!</h1>
                    <h2>Mă numesc <strong>Mihael-Ionuț FURDU</strong></h2>
                    <p>Sunt arhitect cu drept de semnătură și cu această ocazie vă invit să parcurgeți site-ul.</p>
                </div>`;

            if (key.startsWith('project:')) return `
                <div>
                    <h1>${info.names[buildingIndex] ?? ''}</h1>
                    <p>${info.abouts[buildingIndex] ?? ''}</p>
                </div>`;

            return '';
        }

        // FADE ÎNTRE CASE — Next / Prev
        function updateInfoBarText(key, animateProjectChange = false) {

            if (currentInfoKey === key) return;

            const previousKey = currentInfoKey;
            currentInfoKey = key;

            const version = ++textTransitionVersion;

            gsap.killTweensOf(infoBarContent);

            const fadeBetweenHouses =
                animateProjectChange &&
                previousKey?.startsWith('project:') &&
                key.startsWith('project:');

            if (!fadeBetweenHouses) {
                infoBarContent.innerHTML = infoBarMarkup(key);
                gsap.set(infoBarContent, { opacity: 1, y: 0 });
                return;
            }

            gsap.to(infoBarContent, {
                opacity: 0,
                y: -8,
                duration: infoBarMotion.textFadeOut,
                ease: 'power2.in',
                overwrite: true,

                onComplete: () => {

                    if (version !== textTransitionVersion) return;

                    infoBarContent.innerHTML = infoBarMarkup(key);

                    gsap.fromTo(infoBarContent,
                        { opacity: 0, y: 8 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: infoBarMotion.textFadeIn,
                            ease: 'power2.out',
                            overwrite: true
                        }
                    );
                }
            });
        }

        // RETRAGERE BARĂ — CAM C -> CAM D
        function updateInfoBarScene(scroll) {

            const from = sceneAnchors.aboutMe;
            const to = textScrollPoints.proiect;
            const gap = to - from;

            let offset = 0;
            let opacity = 1;

            if (gap > 1 && scroll > from && scroll < to) {

                const progress = (scroll - from) / gap;

                if (progress < infoBarMotion.exitEnd) {

                    const t = smoothInfo(
                        progress / infoBarMotion.exitEnd
                    );

                    offset = infoBarMotion.travelPercent * t;
                    opacity = 1 - t;

                } else if (progress <= infoBarMotion.enterStart) {

                    offset = infoBarMotion.travelPercent;
                    opacity = 0;

                } else {

                    const t = smoothInfo(
                        (progress - infoBarMotion.enterStart) /
                        (1 - infoBarMotion.enterStart)
                    );

                    offset = infoBarMotion.travelPercent * (1 - t);
                    opacity = t;
                }
            }

            dom.infoBar.style.setProperty(
                '--infobar-scene-x',
                `${offset.toFixed(3)}%`
            );

            dom.infoBar.style.setProperty(
                '--infobar-scene-alpha',
                opacity.toFixed(4)
            );
        }

        // ACTUALIZAREA TEXTELOR ÎN FUNCȚIE DE SCROLL
        function changeDescription(options = {}) {

            const scroll = toReferenceScroll();

            const midTransition =
                (sceneAnchors.aboutMe + textScrollPoints.proiect) / 2;

            let key = 'empty';

            if (
                scroll >= textScrollPoints.salut &&
                scroll < textScrollPoints.gol
            ) {
                key = scroll < midTransition
                    ? 'intro'
                    : `project:${buildingIndex}`;
            }

            updateInfoBarScene(scroll);
            updateInfoBarText(key, options?.animate === true);
        }

        window.addEventListener(
            'scroll',
            changeDescription,
            { passive: true }
        );












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
                sceneAnchors,
                textScrollPoints,
                onTextChange: changeDescription,
                referenceScroll: REFERENCE_SCROLL
            });
        };
        // if (document.readyState === "complete") startUnifiedScrollEditor();
        // else window.addEventListener("load", startUnifiedScrollEditor, { once: true });

        // IMPORTANT: call this once after DOM loads
        // updateSectionsPos();
        const section1 = document.getElementById("section viewports")
        const section2 = document.getElementById("section informations")
        const section12 = parseInt(getComputedStyle(section1).height) + parseInt(getComputedStyle(section2).height)
        const section1startPos = parseInt(getComputedStyle(section1).height);
        const section2startPos = parseInt(getComputedStyle(section1).height) - parseInt(getComputedStyle(section2).height);
        const experienceStartPos = section2startPos + parseInt(getComputedStyle(experiencesBody).height) + parseInt(getComputedStyle(abilitiesBody).height)*2.575;

        sectionsBtns.forEach((e)=>{e.addEventListener("click", 
            ()=>{
                switch (e.id) {
                    case 'navGreeting':
                        loaders.loadScroll(sectionHeight * 0);
                        loaders.loadPress(document.getElementById('canvaso'));
                        break;
    
                    case 'navAboutMe':
                        loaders.loadScroll(getMaxScroll() * (sceneAnchors.aboutMe / REFERENCE_SCROLL));
                        loaders.loadPress(document.querySelector('.aboutMe'));
                        break;
                    
                    case 'navProjects':
                        loaders.loadScroll(getMaxScroll() * (cameraScrollPoints[2] / REFERENCE_SCROLL));
                        loaders.loadPress(document.querySelectorAll('.navBtn'));
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


    /* SCENE SCROLL RESISTANCE — About Me and Projects ONLY
       Same anchors as the navigation buttons and the unified GUI.
       No jump-to-anchor or forced lock: glide and continued wheel input stay responsive.
       The two nearby anchors are handled as one slow cinematic passage.
    */
    const sceneScrollFeel = {
        zoneHeightInViewports: 0.18, // outside braking zone (also limited by C-D distance)
        speedAtAnchor: 0.20,        // slow, but never nearly frozen at either marker
        betweenStopsMaxGain: 0.78, // sufficient speed through the short C-D corridor
        exponentialStrength: 1.8,
        snapPx: 12,                // capture each point without an instant scroll jump
        aboutMeDwellMs: 1200,       // readable pause at the portrait
        projectsDwellMs: 1600,      // shorter accent at the 3D project
        glide: 0.22,               // responsive but still smooth physical scroll
        maxGlideSpeedPxPerSecond: 1350 // prevents abrupt large leaps
    };

    const scrollClamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const smoothFade = value => {
        const t = scrollClamp(value, 0, 1);
        return t * t * (3 - 2 * t);
    };

    // Positions live in reference scroll units; GUI editing updates these variables.
    function getSceneStops() {
        const limit = getMaxScroll();
        return [sceneAnchors.aboutMe, cameraScrollPoints[2]]
            .map(px => scrollClamp(limit * (px / REFERENCE_SCROLL), 0, limit));
    }

    function getScrollGain(atY, stops, radius) {
        if (!stops.length) return 1;

        // The anchors are only ~157 reference px apart: avoid a sudden speed spike
        // at the midpoint. This eased corridor never exceeds betweenStopsMaxGain.
        if (stops.length === 2) {
            const first = Math.min(stops[0], stops[1]);
            const second = Math.max(stops[0], stops[1]);
            if (second > first && atY >= first && atY <= second) {
                const distanceToEdge = Math.min(atY - first, second - atY);
                const progress = smoothFade(distanceToEdge / ((second - first) / 2));
                return sceneScrollFeel.speedAtAnchor +
                    (sceneScrollFeel.betweenStopsMaxGain - sceneScrollFeel.speedAtAnchor) * progress;
            }
        }

        const nearest = Math.min(...stops.map(stop => Math.abs(stop - atY)));
        const t = smoothFade(nearest / radius);
        const k = sceneScrollFeel.exponentialStrength;
        const exponential = (Math.exp(k * t) - 1) / (Math.exp(k) - 1);
        return sceneScrollFeel.speedAtAnchor +
            (1 - sceneScrollFeel.speedAtAnchor) * exponential;
    }

    let sceneWheelTarget = window.scrollY;
    let sceneWheelFrame = null;
    let sceneWheelAnimating = false;
    let lastWheelGlideFrameAt = null;
    const completedMagneticStops = new Set();
    let magneticDwellUntil = 0;

    function stopSceneWheelGlide() {
        if (sceneWheelFrame !== null) cancelAnimationFrame(sceneWheelFrame);
        sceneWheelFrame = null;
        sceneWheelAnimating = false;
        lastWheelGlideFrameAt = null;
        sceneWheelTarget = window.scrollY;
        completedMagneticStops.clear();
        magneticDwellUntil = 0;
    }

    function sceneWheelGlide(frameTime) {
        const dt = lastWheelGlideFrameAt === null
            ? 1 / 60
            : Math.min(0.05, Math.max(0.001, (frameTime - lastWheelGlideFrameAt) / 1000));
        lastWheelGlideFrameAt = frameTime;
        const current = window.scrollY;
        const difference = sceneWheelTarget - current;

        if (Math.abs(difference) < 0.5) {
            window.scrollTo({ top: sceneWheelTarget, behavior: 'instant' });
            sceneWheelAnimating = false;
            sceneWheelFrame = null;
            lastWheelGlideFrameAt = null;

            return;
        }

        const alpha = 1 - Math.pow(1 - sceneScrollFeel.glide, dt * 60);
        const maxStep = sceneScrollFeel.maxGlideSpeedPxPerSecond * dt;
        const step = scrollClamp(difference * alpha, -maxStep, maxStep);
        window.scrollTo({ top: current + step, behavior: 'instant' });
        sceneWheelFrame = requestAnimationFrame(sceneWheelGlide);
    }

    function ensureSceneWheelGlide() {
        if (sceneWheelAnimating) return;
        sceneWheelAnimating = true;
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

    // Manual scrollbar, keyboard and navigation clicks interrupt the magnetic effect.
    window.addEventListener('pointerdown', stopSceneWheelGlide, { passive: true });
    window.addEventListener('keydown', stopSceneWheelGlide, { passive: true });
    window.addEventListener('scroll', () => {
        if (!sceneWheelAnimating) sceneWheelTarget = window.scrollY;
    }, { passive: true });

    window.addEventListener('wheel', event => {
        if (event.defaultPrevented || event.ctrlKey || event.metaKey ||
            Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

        if (event.target instanceof Element && (
            event.target.closest('input, textarea, select, [contenteditable], [data-native-scroll], .dg, #unified-scroll-editor') ||
            hasIndependentVerticalScroll(event.target, event.deltaY)
        )) return;

        const inputDelta = event.deltaY *
            (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
        if (!inputDelta) return;
        event.preventDefault();

        // Brief, bounded dwell after C/D capture. Unlike the old pendingSceneStop,
        // this timer does NOT wait for a glide to settle before it can expire.
        if (performance.now() < magneticDwellUntil) return;

        if (!sceneWheelAnimating) sceneWheelTarget = window.scrollY;
        const direction = Math.sign(inputDelta);
        const scrollLimit = getMaxScroll();
        const sceneStops = getSceneStops();
        // C and D are only ~157 reference pixels apart: large overlapping slowdown
        // zones made D feel sticky and C easy to skip. Keep the two zones separate.
        const gap = Math.abs(sceneStops[1] - sceneStops[0]);
        const radius = Math.max(24, Math.min(
            window.innerHeight * sceneScrollFeel.zoneHeightInViewports,
            gap / 2
        ));

        // Re-enable a visited stop after passing the midpoint, so reversing works.
        const rearmDistance = sceneStops.length === 2
            ? Math.min(radius, Math.abs(sceneStops[1] - sceneStops[0]) / 2)
            : radius;
        for (const stop of completedMagneticStops) {
            if (Math.abs(sceneWheelTarget - stop) > rearmDistance) {
                completedMagneticStops.delete(stop);
            }
        }
        const activeStops = sceneStops.filter(stop =>
            stop > 0 && stop < scrollLimit && !completedMagneticStops.has(stop)
        );

        let remaining = Math.min(2000, Math.abs(inputDelta));
        while (remaining > 0) {
            const step = Math.min(18, remaining);
            const next = scrollClamp(
                sceneWheelTarget + direction * step *
                    getScrollGain(sceneWheelTarget, sceneStops, radius),
                0, scrollLimit
            );
            const stop = activeStops.find(s => direction > 0
                ? sceneWheelTarget <= s && next >= s - sceneScrollFeel.snapPx
                : sceneWheelTarget >= s && next <= s + sceneScrollFeel.snapPx
            );

            if (stop !== undefined) {
                // No window.scrollTo(stop) here: that caused the visual jump.
                sceneWheelTarget = stop;
                // Capture once, then give each scene a short, predictable dwell.
                // The stop is not instantly applied to window.scrollY: glide stays smooth.
                completedMagneticStops.add(stop);
                magneticDwellUntil = performance.now() + (
                    stop === sceneStops[0]
                        ? sceneScrollFeel.aboutMeDwellMs
                        : sceneScrollFeel.projectsDwellMs
                );
                ensureSceneWheelGlide();
                return;
            }

            sceneWheelTarget = next;
            remaining -= step;
        }
        ensureSceneWheelGlide();
    }, { passive: false });



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

    // SCROLL IDLE ANIMATION — hide on any click/touch, then wait for inactivity.
    const scrollCue = document.querySelector('.scroll-indicator');
    if (scrollCue) {
        let lastScrollY = window.scrollY;
        let pointerDown = false;
        let cueTimer = null;

        const hideCue = () => {
            scrollCue.classList.remove('is-visible');
            clearTimeout(cueTimer);
        };
        const scheduleCue = (delay = 10000) => {
            clearTimeout(cueTimer);
            if (pointerDown) return;
            cueTimer = setTimeout(() => {
                const maxScroll = getMaxScroll();
                if (!pointerDown && window.scrollY < maxScroll - 50) {
                    scrollCue.classList.add('is-visible');
                }
            }, delay);
        };
        scheduleCue(15000);

        window.addEventListener('scroll', () => {
            const currentY = window.scrollY;
            const scrollingUp = currentY < lastScrollY;
            hideCue();
            scheduleCue(scrollingUp && currentY < 120 ? 1000 : 10000);
            lastScrollY = currentY;
        }, { passive: true });

        window.addEventListener('pointerdown', () => {
            pointerDown = true;
            hideCue();
        }, { passive: true });
        const endInteraction = () => {
            if (!pointerDown) return;
            pointerDown = false;
            hideCue();
            scheduleCue(10000);
        };
        window.addEventListener('pointerup', endInteraction, { passive: true });
        window.addEventListener('pointercancel', endInteraction, { passive: true });
    }
