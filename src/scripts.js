
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

        function updateCam() {
            let perspCameraZoom;
            const changeCameraZoom = () => {perspCameraZoom = window.innerWidth < 1025 ? .65 : 1}
            changeCameraZoom();

            window.addEventListener("resize", changeCameraZoom);
            // Section 0
            const camPosA = new THREE.Vector3(15, 15, 10.5);
            const lookA = new THREE.Vector3(-5.5, 15, -10.5);
            const zoomA = perspCameraZoom * 1;
            // Section 1
            const camPosB = new THREE.Vector3(15, 10, 10.5);
            const lookB = new THREE.Vector3(-5.5, 7.5, -10.5);
            const zoomB = perspCameraZoom * 2;
            // Section 2
            const camPosC = new THREE.Vector3(15, 20, 10.5);
            const lookC = new THREE.Vector3(-5.5, 1.5, -10.5);
            const zoomC = perspCameraZoom * 3.5;
            // Section 3
            const camPosD = new THREE.Vector3(15, 0, -10.5);
            const lookD = new THREE.Vector3(-5.5, 1.5, -10.5);
            const zoomD = perspCameraZoom * 3.5;
            // Section 4
            const camPosE = new THREE.Vector3(15, 0, -10.5);
            const lookE = new THREE.Vector3(-5.5, 0, -10.5);
            const zoomE = perspCameraZoom * 4.5;
            // Section 5
            const camPosF = new THREE.Vector3(15, -10.5, -10.5);
            const lookF = new THREE.Vector3(-5.5, -10.5, -10.5);
            const zoomF = perspCameraZoom * 5.5;
            // Section 6
            const camPosG = new THREE.Vector3(15, -10.5, -10.5);
            const lookG = new THREE.Vector3(-5.5, -10.5, -10.5);
            const zoomG = perspCameraZoom * 5.5;
            
            let scroll = window.scrollY / sectionHeight;
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
            hdrLoader.load('./assets/textures/environment/cloisterPassage/cloisterPassage_1k.hdr', 
                (texture) => {
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    scene.environment = texture;
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

        let logoAnimation = new LogoAnimation();
        gsap.registerPlugin(ScrollTrigger);

        function viewportAnimation      () {
            let viewportTimeline = gsap.timeline({
                defaults: { duration: 6, ease: "power2.out" }});
                    
            viewportTimeline
                .to(".viewport2", {scale: 0.15})
                .to(".viewport2", {y: '-50%'}, "-=1")
                

            return viewportTimeline;
            };

        function infoBarShowOn          () {
            let infoBarTimline = gsap.timeline({
                defaults: { duration: 6, ease: "power2.out" }});

            infoBarTimline
                .to(".infoBar", {x: '0%'});
                
            return infoBarTimline;
            };

        function infoBarShowOff         () {
            let infoBarTimline = gsap.timeline({
                defaults: { duration: 6, ease: "power2.out" }});

            infoBarTimline
                .to(".infoBar", {x: '90%'});
                
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
                left: "50%",
                rotateZ: "720deg",
                duration: 6,
                ease: "power2.out",
                delay: 1
            })
            .to(".nextBtn", {
                left: "0%",
                rotateZ: "45deg",
                duration: 6,
                ease: "power2.out",
                delay: 1
            })
            .to(".nextBtn", {
                bottom: "0%",
                duration: 6,
                delay: 3
            });

            return tl;
            };

        function controlPrevBtn         () {
            let tl = gsap.timeline({
                defaults: { duration: 0.5, ease: "power2.out" }
            });
    
            tl.to(".prevBtn", {
                right: "50%",
                rotateZ: "720deg",
                duration: 6,
                ease: "power2.out",
                delay: 1
            })
            .to(".prevBtn", {
                right: "0%",
                rotateZ: "45deg",
                duration: 6,
                ease: "power2.out",
                delay: 1
            })
            .to(".prevBtn", {
                bottom: "0%",
                duration: 6,
                delay: 3
            });

            return tl;
            };

        function controlDownBtn         () {
            let tl = gsap.timeline({
                defaults: { duration: 0.5, ease: "power2.out" }
            });
 
            tl.to(".downBtn", {
                bottom: "-275%",
                rotateZ: "180deg",
                duration: 6,
                ease: "power2.out",
                delay: 1
            })
            .to(".downBtn", {
                bottom: "65%",
                rotateZ: "45deg",
                duration: 6,
                ease: "power2.out",
                delay: 1
            })
            .to(".downBtn", {
                opacity: 0,
                duration: 2,
                delay: 1
            });

            return tl;
            };

        function controlBtnsOff         () {
            let tl = gsap.timeline();
        
            tl.to(".controls", { opacity: 1, duration: 3, ease: "power2.out"})
                .to(".controls", { opacity: 0, duration: 3, ease: "power2.out" });
        
            return tl;
            };

        const mainTimeline = gsap.timeline({
            pause: true,
            scrollTrigger: {
                trigger: '.viewport2',
                start: "20% 25%",
                end: "800% 25%",
                markers: false,
                scrub: 1, 
                toggleActions: "play none reverse reverse"}
            })
        
        mainTimeline
            .add(orthoCameraAnimation(), 1)
            .add(viewportAnimation(), 1)
            .add(infoBarShowOn(), 2.5)
            .add(controlNextBtn(), 3.5)
            .add(controlPrevBtn(), 3.5)
            .add(controlDownBtn(), 3.5)
            .add(infoBarShowOff(), ">")
            .add(controlBtnsOff(), ">-1")
            

    // EVENTS
        // STOP SCROLLING AT TOP AND RELOAD TRIGGER
        window.addEventListener("scroll", () => {
            if (window.scrollY < 1) {
            window.scrollTo({
                top: 1,
                behavior: "instant"
            });
            }
        });

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

        dom.artistBtn.addEventListener('click', () => {
            loaders.loadExperience(dom.artistBtn, experiences.artist);
        });

        dom.architectBtn.addEventListener('click', () => {
            loaders.loadExperience(dom.architectBtn, experiences.architecture);
        });

        dom.programmerBtn.addEventListener('click', () => {
            loaders.loadExperience(dom.programmerBtn, experiences.programmer);
        });

        const changeDescription = (name, about, type, style) => {
            const scroll = window.scrollY;

            if (scroll >= aboutMePos*2 && scroll <= abilitiesPos) {
                dom.infoBar.innerHTML = 
                `<div>
                    <h1>Salut!</h1>
                    <h2>Mă numesc Mihael-Ionuț FURDU</h2>
                    <p>Sunt arhitect cu drept de semnătură și cu această ocazie vă învit să parcurgeți cu curiozitate acest site personal</p>

                </div>`;
                return;
            }
            if (scroll >= abilitiesPos && scroll <= experiencePos) {
               dom.infoBar.innerHTML = `
                <div>
                    <h1>${name}</h1>
                    <h2>${type}</h2>
                    <h3>${style}</h3>
                    <p>${about}</p>
                </div>`
                return; 
            }
            
            dom.infoBar.innerHTML = "";
        }

        window.addEventListener("scroll", changeDescription);

        const originalDisplay = getComputedStyle(expDetails).display;
        function toggleExpDetails(domBtn, data) {
            if (expDetails.style.display === 'none') {
                expDetails.style.display = originalDisplay;
                loadingExperience(domBtn, data);
            } 
            else {
                expDetails.style.display = 'none';
            }
        }

        const expBanner = document.getElementById('experience banner');
        const expBannerChildren = Array.from(expBanner.children);
        expBannerChildren.forEach((btn)=>{btn.addEventListener("click", toggleExpDetails)})

        dom.experiencesBtn.addEventListener('click', toggleExpDetails);

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
                        loaders.loadPress(projectsBanner);
                        break;
    
                    case 'navAboutMe':
                        loaders.loadScroll(sectionHeight * 1.6);
                        loaders.loadPress(projectsBanner);
                        break;
                    
                    case 'navProjects':
                        loaders.loadScroll(sectionHeight * 2.35);
                        loaders.loadPress(projectsBanner);
                        break;
    
                    case 'navAbilities':
                        loaders.loadScroll(abilityStartPos);
                        loaders.loadPress(abilitiesBanner);
                        break;
                    
                    case 'navExperiences':
                        loaders.loadScroll(experienceStartPos);
                        loaders.loadPress(experiencesBanner);
                        break;
    
                    case 'navContacts':
                        loaders.loadScroll(section12);
                        loaders.loadPress(contactsBanner);
                        break;
            }
        })});
            
    /* COMMITS */
        updateRefs();
        updateSectionsPos();
        // loaders.loadPage();
        loaders.loadText        (secondScene, text);
        loaders.loadIndicator   (dom);
        loaders.loadPush        (dom.experience, "Vezi mai mult");
        loaders.loadLogo        (secondScene, light, logo3D, materials, logoAnimation);
        loaders.loadNeighboar   (scene, light, neighbor, materials);
        loaders.loadBuilding    (scene, light, building, material);
        // loaders.loadInfo        (name, about, type, style);
        

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
