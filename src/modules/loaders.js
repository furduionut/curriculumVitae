    import * as THREE       from "three";
    import { GLTFLoader }   from "three/examples/jsm/Addons.js";
    import { DRACOLoader }  from "three/examples/jsm/Addons.js";
    import { FontLoader }   from "three/examples/jsm/Addons.js";
    import { TextGeometry } from "three/examples/jsm/Addons.js";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { gsap }         from "gsap";
    
    import { styles } from "./styles.js";
    import { domain as dom } from "./domain.js";
    import { materials } from "./materials.js";

    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    const textureLoader = new THREE.TextureLoader();
    const fontLoader = new FontLoader();
    
    dracoLoader.setDecoderPath('./utils/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    let currentBuilding
    let currentModel
    let currentLogo

    function changeLanguage         (language) {
        };

    function changeDescription      (description) {
        };

    function changePageTheme        () {
        };

    function animateBuilding        (model) {
        gsap.registerPlugin(ScrollTrigger);
        let sceneTimeline = gsap.timeline(
            {scrollTrigger: {
                trigger: '.viewport',
                start: "15% 5%",
                end: "85% 35%",
                markers: false,
                toggleActions: "play none reverse pause"
            }});

        sceneTimeline.fromTo(
            model.position,
            {x: model.position.x},
            {x: 2, duration: 1, ease: "power4.out"
            });

        sceneTimeline.fromTo(
            model.scale,
            {x: model.scale.x},
            {x: .01, duration: .1, ease: "power4.out"
            });

        sceneTimeline.fromTo(
            model.scale,
            {y: model.scale.y},
            {y: .01, duration: .1, ease: "power4.out"
            });

        sceneTimeline.fromTo(
            model.scale,
            {z: model.scale.z},
            {z: .01, duration: .1, ease: "power4.out"
            });
        };

    function applyLogoMaterials     (model) {
        const purple = materials.lightBulbDiffuse;
        const glassPurple = materials.tube;

        model.traverse((child) => {
            if (!child.isMesh) return;

            const name = child.name.toLowerCase();

            const isArchSegment =
                name.startsWith("archmov");

            const isArchSegment2 =
                name.startsWith('archMesh');

            const isItizerSegment2 =
                name.startsWith('itizerMesh')

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

                
                // console.log(
                //     "Prepared independent segment:",
                //     child.name,
                //     child.material.id
                // );

                return;
            }

            if (isArchSegment2 || isItizerSegment2) {
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

                
                // console.log(
                //     "Prepared independent segment:",
                //     child.name,
                //     child.material.id
                // );

                return;
            }

            if (name === "bec" || name === 'lightBulbMesh.001') {
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

            if (name === "traseu" || name === 'bodyMesh.001') {
                child.material = materials.tube;
                child.renderOrder = 1;
                child.material.needsUpdate = true;
            }
        });
        };

    function createLoadingPage      () {
        const loading = document.createElement('div');
        loading.id = 'loading-page';
        loading.style.cssText = `
            position: fixed;
            inset: 0;
            background: ${styles.color1};
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity .6s ease;
        `;
    
        const logo = document.createElement('img');
        logo.src = './assets/images/firmLogoAnimated.gif';
        logo.style.cssText = `
            width: 120px;
            opacity: .95;
            transition: transform 1s ease;
        `;
    
        loading.appendChild(logo);
        document.body.appendChild(loading);
    
        // Rotate every 4 seconds
        setInterval(() => {
            logo.style.transform = `rotate(360deg)`;
        }, 1500);
    
        // Auto-hide after 2 seconds
        setTimeout(() => hideLoadingPage(), 2000);
        };

    function hideLoadingPage        () {
        const loading = document.getElementById('loading-page');
        if (!loading) return;
        loading.style.opacity = '0';
        setTimeout(() => loading.remove(), 600);
        };

    function loadingInformations    (name, about, type, style){
        const informations       = dom.abouts;

        const clasifications     = document.createElement('div');
        
        const title              = document.createElement('h2');
        title.textContent        = name;
        
        const category           = document.createElement('p');
        category.textContent     = `Type: ${type}`;

        const archType           = document.createElement('p');
        archType.textContent     = `Style: ${style}`;

        const description        = document.createElement('p');
        description.textContent  = `${about}`;

        clasifications.appendChild(category);
        clasifications.appendChild(archType);

        informations.appendChild(title);
        informations.appendChild(clasifications);
        informations.appendChild(description);    
        };

    function loadingIndicators      (dom){
        const aboutMe               = dom.aboutMe
        const scrollIndicator       = document.createElement('div');
        const scrollArrow           = document.createElement('div');
        const scrollText            = document.createElement('div');

        scrollText.innerHTML        = 'scroll';

        scrollIndicator.className   = 'scroll-indicator';
        scrollArrow.className       = 'scroll-arrow';
        scrollText.className        = 'scroll-text, glass';

        scrollText.style.fontSize   = '2em';

        scrollIndicator.id          = 'scroll-indicator';
        scrollArrow.id              = 'scroll-arrow';
        scrollText.id               = 'scroll-arrow';

        scrollIndicator.appendChild(scrollText);
        scrollIndicator.appendChild(scrollArrow);
        aboutMe.appendChild(scrollIndicator);
        };

    function loadingText            (scene, text) {
            gsap.registerPlugin(ScrollTrigger);
            fontLoader.load('assets/fonts/arialRegular.json', font => {
        
                const chars = text.split("");
                let offsetX = 7.5;
                let typingTL = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.viewport2',
                        start: "70% 15%",
                        end: "100% 15%",
                        markers: false,
                        toggleActions: "play none reverse reset"
                    }
                });
        
                chars.forEach((char, i) => {
        
                    const geo = new TextGeometry(char, {
                        font,
                        size: 200,
                        height: 0.05
                    });
        
                    geo.computeBoundingBox();
                    const width = geo.boundingBox.max.x - geo.boundingBox.min.x;
        
                    const mat = new THREE.MeshStandardMaterial({
                        color: 'white',
                        transparent: true,
                        opacity: 0
                    });
        
                    mat.depthWrite = true;
                    mat.depthTest = false;
        
                    const letter = new THREE.Mesh(geo, mat);
        
                    letter.scale.set(.01, .01, .01);
                    letter.position.set(-12.75, -10, 7.5);
                    letter.rotation.x = -Math.PI/2;
                    letter.translateX(offsetX);
                    
                    offsetX += width * 0.011;
        
                    scene.add(letter);
        
                    typingTL.to(letter, { visible: true, duration: 0 }, i * 0.2);
        
                    typingTL.fromTo(letter.material,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.6, ease: "power2.out", delay: 2.5 },
                        i * 0.1
                    );
        
                    typingTL.fromTo(letter.position,
                        { y: -0.5 },
                        { y: 3, duration: 0.6, ease: "back.out(2)", delay: 2.5 },
                        i * 0.1
                    );
                });
            });
        }
        
    function loadingNeighbor        (scene, light, building, material){ 
        let scale = .1;

        gltfLoader.load(building, (gltf) => {
        
            currentBuilding = gltf.scene;
            currentBuilding.name = 'pageLayout';
            currentBuilding.position.set(0, 0, 0);
            currentBuilding.scale.set(scale, scale, scale);

            console.log(currentBuilding.children);
        
            let neighborTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '.projects',
                    start: "5% 0%",
                    end: "100% 100%",
                    scrub: 1,
                    markers: false
                }
            });
        
            currentBuilding.traverse((child) => {

                if (!child.isMesh) return;
        
                const originalX = child.position.x;
                const originalY = child.position.y;
                const originalZ = child.position.z;

                child.material.transparent = true;
                child.material.opacity = 0;

                if (child.name.includes('pictureFrame')) {
                    child.material = materials.support;
                    child.material.transparent = true;
                    child.material.opacity = 0;
                    child.position.y = originalY - 2;

                    neighborTimeline.to(child.material, {opacity: 1, duration: 5, ease: "power2.out"}, 1);
                    return;
                };

                if (child.name.includes('greetingBox')) {

                    child.material          = material.model;

                    return;
                };
                

                if (child.name.includes('desk')) {
                    const startPosition = originalZ + 200;
                    child.material      = material.desk;

                    child.position.z = startPosition;
                
                    neighborTimeline
                        .to(child.position, {z: originalZ, duration: 15, ease: "power2.out"}, 6);
                
                    return;
                };

                if (child.name.includes('neighboar_012') || child.name.includes('neighboar_013')){
                    child.material = child.material.clone();
                    child.material.transparent = true;
                    child.material.opacity = 1;
                    child.material.depthWrite = false;
                    
                    neighborTimeline.to(child.material, {opacity: 0,        duration: 1,        ease: "power2.out",      }, 9);
                    return;
                };

                if (child.name.includes('neighboar')) {
                    const belowY = originalY - (Math.random() * 2 + 1);

                    child.scale.set(0,0,0);
                    child.material          = material.model;
                    child.position.y        = belowY;
                    
                    neighborTimeline.to(child.scale,    {x: 1, y: 1, z:1,   duration: 16,       ease: "back.out(1.7)",   }, 9);
                    neighborTimeline.to(child.material, {opacity: 1,        duration: 8,        ease: "power2.out",      }, 9);
                    neighborTimeline.to(child.position, {y: originalY,      duration: 4.8,      ease: "bounce.out",      }, 9);
                        
                    return;
                };

            });
        
            scene.add(currentBuilding);
        });
        };
    
    function loadingPressIndicator  (dom) {
        let on = false;
    
        const interval = setInterval(() => {
            on = !on;
            dom.style.outline = on 
                ? `3px solid orange` 
                : "none";
        }, 200); // bounce speed
    
        setTimeout(() => {
            clearInterval(interval);
            dom.style.outline = "none"; // reset
        }, 2000); // total duration
        };

    function loadingScroll          (scrollY) {
        window.scrollTo({ top: scrollY, behavior: "smooth" });
        };

    function loadingBuilding        (scene, light, building, material){ 
        let scale  = .1;
        let scaleX = scale;
        let scaleY = scale;
        let scaleZ = scale;
        
        gltfLoader.load( building, (gltf) => 
            {scene.children.slice().forEach(obj => {if (obj.name !== "pageLayout") {scene.remove(obj); }
                });
            if (currentModel || currentBuilding && currentBuilding.name !== 'pageLayout') {
                scene.remove(currentModel, currentBuilding)
                currentBuilding = null;
                currentModel = null;};
            currentBuilding = gltf.scene;
            console.log(currentBuilding);
            
            console.log(`Changed building to ${building}`);
            currentBuilding.position.set(-50 * scale , 0 * scale, -100 * scale);
            currentBuilding.scale.set(scaleX, scaleY, scaleZ);
            currentBuilding.traverse((child) => {
                if (child.isMesh) {child.material = material;}
            console.log(`Changed material to ${child.material}`)
            });
            scene.add(currentBuilding);
            })
        };

    function loadingModel           (scene, light, model, material){ 
        let scale  = .1;
        let scaleX = scale;
        let scaleY = scale;
        let scaleZ = scale; 
        gltfLoader.load( model, (gltf) => 
            {
            if (currentModel || currentBuilding) {
                scene.remove(currentModel, currentBuilding);
                currentBuilding = null;
                currentModel = null;};
            currentModel = gltf.scene;
            
            console.log(`Changed model to ${model}`);
            currentModel.position.set(-50 * scale , 0 * scale, -100 * scale);
            currentModel.scale.set(scaleX, scaleY, scaleZ);
            currentModel.traverse((child) => {  
                if (child.isMesh) {child.material = material;}
            console.log(`Changed material to ${child.material}`)
            }); 
            scene.add(currentModel);
            })
        };

    function loadingLogo3D          (scene, light, model, material, animationModel){
        let scale  = .1;
        let scaleX = scale;
        let scaleY = scale;
        let scaleZ = scale;    
    
        gltfLoader.load(model, (gltf) => {
            currentLogo = gltf.scene;
            currentLogo.scale.set(.5, .5, .5);
            currentLogo.rotation.y = -Math.PI/4;
            applyLogoMaterials(currentLogo);
            scene.add(currentLogo);
            animationModel.play(currentLogo, gltf.animations);
        });
        };
    
    function loadingMaterial        (texturePaths){
            const diffuseMap      = textureLoader.load(texturePaths.diffuse);
            const roughnessMap    = textureLoader.load(texturePaths.roughness);
            const normalMap       = textureLoader.load(texturePaths.normal);
            const transmissionMap = textureLoader.load(texturePaths.transmission);
        
            diffuseMap.flipY      = false;
            roughnessMap.flipY    = false;
            normalMap.flipY       = false;
            transmissionMap.flipY = false;
        
            const mat = new THREE.MeshStandardMaterial({
                map: diffuseMap,
                roughnessMap: roughnessMap,
                normalMap: normalMap,
                alphaMap: transmissionMap,
                transparent: true

            });
        
            mat.needsUpdate = true;
            return mat;
        };

    function loadingDisplay         (dom){
        const style = window.getComputedStyle(dom);
        if (style.display === "none") {dom.style.display = "flex";
        } else {dom.style.display = "none";}
        };


    const loaders = {
        loadLogo:           loadingLogo3D,
        loadPage:           createLoadingPage,
        loadInfo:           loadingInformations,
        loadIndicator:      loadingIndicators,
        loadText:           loadingText,
        loadNeighboar:      loadingNeighbor,
        loadBuilding:       loadingBuilding,
        loadModel:          loadingModel,
        loadMaterial:       loadingMaterial,
        loadPress:          loadingPressIndicator,
        loadDisplay:        loadingDisplay,
        loadScroll:         loadingScroll
    };

    export { loaders }

