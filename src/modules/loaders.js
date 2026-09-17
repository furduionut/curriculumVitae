    import * as THREE       from "three";
    import { GLTFLoader }   from "three/examples/jsm/Addons.js";
    import { DRACOLoader }  from "three/examples/jsm/Addons.js";
    import { FontLoader }   from "three/examples/jsm/Addons.js";
    import { TextGeometry } from "three/examples/jsm/Addons.js";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { gsap }         from "gsap";
    
    import { BIM, DWG, TXT, OBJ, IMG, SWG, CGI, ART, THC, MAN, CLB, COM, DEC } from "./abilities.js";
    import { styles } from "./styles.js";
    import { domain as dom } from "./domain.js";
    import { materials } from "./materials.js";

    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    const textureLoader = new THREE.TextureLoader();
    const fontLoader = new FontLoader();
    
    dracoLoader.setDecoderPath('./src/utils/draco/');
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

    function animateModel           (model) {
    //     gsap.registerPlugin(ScrollTrigger);
    //     let sceneTimeline = gsap.timeline(
    //         {scrollTrigger: {
    //             trigger: '.viewport',
    //             start: "15% 5%",
    //             end: "85% 35%",
    //             markers: true,
    //             toggleActions: "play none reverse pause"
    //         }});

    //     sceneTimeline.fromTo(
    //         model.position,
    //         {x: model.position.x},
    //         {x: 2, duration: 1, ease: "power4.out"
    //         });

    //     sceneTimeline.fromTo(
    //         model.scale,
    //         {x: model.scale.x},
    //         {x: .01, duration: .1, ease: "power4.out"
    //         });

    //     sceneTimeline.fromTo(
    //         model.scale,
    //         {y: model.scale.y},
    //         {y: .01, duration: .1, ease: "power4.out"
    //         });

    //     sceneTimeline.fromTo(
    //         model.scale,
    //         {z: model.scale.z},
    //         {z: .01, duration: .1, ease: "power4.out"
    //         });
        };

    function textAnimation          () {
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
        informations.innerHTML   = null;

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

        gsap.registerPlugin(ScrollTrigger);

        function loadingText(scene, text) {
            fontLoader.load('assets/fonts/arialRegular.json', font => {
        
                const chars = text.split("");
                let offsetX = 7.5;
                let typingTL = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.viewport2',
                        start: "50% 5%",
                        end: "100% 20%",
                        markers: false,
                        toggleActions: "play none reverse reverse"
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
                    letter.position.set(0, 100, 1.25);
                    letter.rotation.x = -Math.PI/2;
                    letter.translateX(offsetX);
                    
                    offsetX += width * 0.011;
        
                    scene.add(letter);
        
                    typingTL.to(letter, { visible: true, duration: 0 }, i * 0.1);
        
                    typingTL.fromTo(letter.material,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.3, ease: "power2.out", delay: 1 },
                        i * 0.1
                    );
        
                    typingTL.fromTo(letter.position,
                        { y: -0.5 },
                        { y: 3, duration: 0.3, ease: "back.out(2)", delay: 1 },
                        i * 0.1
                    );
                });
            });
        }
        
        function loadingNeighbor(scene, light, building, material){ 
            let scale = .1;
        
            gltfLoader.load(building, (gltf) => {
        
                currentBuilding = gltf.scene;
                currentBuilding.name = 'pageLayout';
                currentBuilding.position.set(0, -0.1 * scale, 0);
                currentBuilding.scale.set(scale, scale, scale);
        
                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.infoBar',
                        start: "1250em 25%",
                        end: "3500em 20%",
                        scrub: 1,
                        markers: true
                    }
                });
        
                currentBuilding.traverse((child) => {
                    if (!child.isMesh) return;
        
                    if (child.name.includes('cloud')) child.material = material.cloudDiffuse;
                    if (child.name.includes('neighboar')) child.material = material.model;
                    if (child.name.includes('papper')) child.material = material.support;
                    if (child.name.includes('desk')) child.material = material.desk;
        
                    child.material.transparent = true;
                    child.material.opacity = 0;
        
                    const originalY = child.position.y;
        
                    if (child.name.includes('neighboar')) {
                        const belowY = originalY - (Math.random() * 2 + 1);
                        child.scale.set(0, 0, 0);
                        child.position.y = belowY;
        
                        tl.to(child.scale, {
                            x: 1, y: 1, z: 1,
                            duration: 1,
                            ease: "back.out(1.7)",
                            delay: 1
                        }, 0);
        
                        tl.to(child.material, {
                            opacity: 1,
                            duration: 0.8,
                            ease: "power2.out",
                            delay: 1
                        }, 0);
        
                        tl.to(child.position, {
                            y: originalY,
                            duration: 1.2,
                            ease: "bounce.out"
                        }, 0);
        
                        return;
                    }
        
                    if (child.name.includes('desk')) {
                        child.rotation.y = 2 * Math.PI;
        
                        tl.to(child.material, {
                            opacity: 1,
                            duration: 0.4,
                            ease: "power2.out"
                        }, 0);
        
                        tl.to(child.rotation, {
                            y: 0,
                            duration: 3,
                            ease: "expo.out"
                        }, 0);
        
                        return;
                    }
        
                    tl.to(child.material, {
                        opacity: 1,
                        duration: 0.5,
                        ease: "power1.out"
                    }, 0);
                });
        
                scene.add(currentBuilding);
            });
        }
        
        


        
    function loadingBuilding        (scene, light, building, material){ 
        let scale  = .1;
        let scaleX = scale;
        let scaleY = scale;
        let scaleZ = scale;
        
        gltfLoader.load( building, (gltf) => 
            {
            if (currentModel || currentBuilding 
                && currentBuilding.name !== 'pageLayout') {
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

    function loadingExperience      (dom, experiences, style){
        const archExpNames  = experiences.map(e => e.identifier.name);
        const archPeriods   = experiences.map(e => e.identifier.period);
        const archAbout     = experiences.map(e => e.identifier.about);
        const archTypes     = experiences.map(e => e.identifier.type);
        const archRoles     = experiences.map(e => e.identifier.role);
        
        experiences.forEach(e => {
        let position = experiences.index % 2 ? 'Right' : 'Left';

        const experience        = document.createElement('div');
        experience.setAttribute     ('class', 'experience');

        const geometryUp        = document.createElement('div');
        geometryUp.setAttribute     ('class', 'geometryUp');

        const geometryDown      = document.createElement('div');
        geometryDown.setAttribute   ('class', 'goeometryDown');

        const content           = document.createElement('div');
        content.setAttribute        ('class', 'content');

        const treeBind          = document.createElement('div');
        treeBind.setAttribute       ('class', `treeBind-${position}`);

        const branch            = document.createElement('div');
        branch.setAttribute         ('class', `branch-${position}`);

        const base              = document.createElement('div');
        base.setAttribute           ('class', `base-${position}`);

        const title             = document.createElement('div');
        title.setAttribute          ('class', 'title');
        title.textContent       = archExpNames[e];

        const description       = document.createElement('div');
        description.setAttribute    ('class', 'description');
        description.textContent = archAbout[e];
    
        content.appendChild(title, description);
        treeBind.appendChild(branch, base);
        experience.appendChild(geometryUp, content, geometryDown, treeBind);
        dom.appendChild(experience);
        })
        };

    function loadingDisplay         (dom){
        const style = window.getComputedStyle(dom);
        if (style.display === "none") {dom.style.display = "flex";
        } else {dom.style.display = "none";}
        };

    function loadingAbilities       (dom, abilities, style){
        // Create ability
        const createAbility = (a) => {
            let abilities;
            abilities = document.createElement('div');
            a.forEach(e => {
                const icon = document.createElement('icon');
                const svg  = document.createElement('svg');
                const use  = document.createElement('use');
        
                icon.className = e.name;
                icon.id        = e.name;
        
                svg.className  = e.name;
                svg.id         = e.name;
        
                use.className  = e.name;
                use.id         = e.name;
        
                use.setAttribute('href', e.source);
        
                svg.appendChild(use);
                icon.appendChild(svg);

                abilities.appendChild(icon);
            });
            return abilities;
        }

        // Define elements
            let allAbilities;
            let hardAbilities;
            let softAbilities;
            
        // Assign dom
            hardAbilities   = createAbility(abilities.hardAbilities);
            softAbilities   = createAbility(abilities.softAbilities);
            allAbilities    = document.createElement("div");

        // Set attributes
            allAbilities.setAttribute     ('id',    'abilities');
            allAbilities.setAttribute     ('class', 'abilities');

        // Set styles
            /* box */
            /* size */
            /* position */
            /* distance */
            /* geometry */
            /* style */
            /* color */
            /* display */
            /* content */

        // Append element
            allAbilities.appendChild        (softAbilities);
            allAbilities.appendChild        (hardAbilities);
        };
    
    function loadingSkills          (dom, skills, style){
        // Define elements
            let skill;
            let symbol;
            let bar;

        // Assign dom
            skill = document.createElement('div');
            symbol = document.createElement('div');
            bar = document.createElement('div');

        // Set attributes
            skill.setAttribute          ('class', 'skill');
            symbol.setAttribute         ('class', 'skill');
            bar.setAttribute            ('class', 'skill');

        // Set styles
            /* box */
            skill.style.padding         = style.padding;
            symbol.style.padding        = style.padding;
            bar.style.padding           = style.padding;

            /* size */
            /* position */
            /* distance */
            /* geometry */
            /* style */
            /* color */
            /* display */
            skill.style.display         = style.display;
            skill.style.justifyContent  = style.justify;
            skill.style.alignItems      = style.alignItems;

            symbol.style.display        = style.display;
            symbol.style.justifyContent = style.justify;
            symbol.style.alignItems     = style.alignItems;
            
            bar.style.display           = style.display;
            bar.style.justifyContent    = style.justify;
            bar.style.alignItems        = style.alignItems;

            /* content */

        // Append element
            skill.appendChild(symbol, bar);
            hardLeveling.appendChild(skill);
        };

    function showLevel              (e){
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
        dom.hardLeveling.style.display = 'flex';
        dom.hardLeveling.style.flexFlow = 'column wrap'
        dom.hardLeveling.style.justifyContent = 'space-between';
        dom.softLeveling.style.display = 'flex';
        dom.softLeveling.style.flexFlow = 'column wrap'
        dom.softLeveling.style.justifyContent = 'center';

        if (e == BIM || e == DWG || e == TXT || e == OBJ || e == IMG || e == SWG || e == CGI ) 
        {
        dom.hardLeveling.innerHTML = '';
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

            bar.style.background = `linear-gradient(to right, ${styles.color3} ${value.completed}%, ${styles.color1} ${value.completed+10}%)`;
            bar.innerHTML = key;
            symbol.innerHTML = value.symbol;

            skill.appendChild(symbol);
            skill.appendChild(bar);
            dom.hardLeveling.appendChild(skill);
        }
        }
        else if (e == ART || e == THC || e == MAN || e == CLB || e == COM || e == DEC ) {
            dom.softLeveling.innerHTML = '';

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

                bar.style.background = `linear-gradient(to right, ${styles.color3} ${value.completed}%, ${styles.color1} ${value.completed+10}%)`;
                bar.innerHTML = key;
                symbol.innerHTML = value.symbol;
    
                skill.appendChild(symbol);
                skill.appendChild(bar);
                dom.softLeveling.appendChild(skill);

        }
        }
        else {console.log('no skill to show')}
        };

    function showCredit             (){
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
        loadSkill:          loadingSkills,
        loadDisplay:        loadingDisplay,
        loadLevel:          showLevel
    };

    export { loaders }

