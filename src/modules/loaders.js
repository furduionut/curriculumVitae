import * as THREE       from "three";


import { GLTFLoader }   from "three/examples/jsm/Addons.js";
import { DRACOLoader }  from "three/examples/jsm/Addons.js";


import { BIM, DWG, TXT, OBJ, IMG, SWG, CGI, ART, THC, MAN, CLB, COM, DEC } from "./abilities.js";
import { styles } from "./styles.js";
import { domain as dom } from "./domain.js";

    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    const textureLoader = new THREE.TextureLoader();

    dracoLoader.setDecoderPath('./src/utils/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    let currentBuilding
    let currentModel
 
    async function createLoadingPage() {
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
        }, 500);
    
        // Auto-hide after 2 seconds
        setTimeout(() => hideLoadingPage(), 6000);
    }

    function hideLoadingPage() {
        const loading = document.getElementById('loading-page');
        if (!loading) return;
        loading.style.opacity = '0';
        setTimeout(() => loading.remove(), 600);
    }

    function loadingInformations    (name, about, type, style){
        const informations       = dom.abouts;
        informations.innerHTML   = '';

        const clasifications     = document.createElement('div');

        const title              = document.createElement('h2');
        title.textContent        = name;

        const description        = document.createElement('p');
        description.textContent  = about;

        const category           = document.createElement('p');
        category.textContent     = type;

        const archType           = document.createElement('p');
        archType.textContent     = style;
    
        clasifications.appendChild(category);
        clasifications.appendChild(archType);

        informations.appendChild(title);
        informations.appendChild(description);
        informations.appendChild(clasifications);
        };

    let scale  = .1;
    let scaleX = scale;
    let scaleY = scale;
    let scaleZ = scale;

    function loadingNeighbor        (scene, light, building, material){ 
        gltfLoader.load(building, (gltf) => 
            {currentBuilding = gltf.scene;
            currentBuilding.name = 'pageLayout';
            currentBuilding.position.set(0 *scale, -.1 *scale, 0 *scale);
            currentBuilding.scale.set(scaleX, scaleY, scaleZ);
            currentBuilding.traverse(
                (child) => {
                    if (child.name.includes('neighboar')) {child.material = material.model;}
                    if (child.name.includes('papper')) {child.material = material.support;}
                    if (child.name.includes('desk')) {child.material = material.desk;}
                });
            // currentBuilding.castShadow = true;
            // currentBuilding.receiveShadow = true;
            scene.add(currentBuilding);})
        };

    function loadingBuilding        (scene, light, building, material){ 
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

    function loadingAbility         (){
        const hardAbility   = document.createElement("div");
        const hardSkill     = document.createElement("div");
        const hardLevel     = document.createElement("div");

        hardAbility.setAttribute    ('class', 'hardAbility');
        hardSkill.setAttribute      ('class', 'hardSkills'); 
        hardLevel.setAttribute      ('class', 'hardLeveling');

        hardSkill.innerHTML = '<svg/>';
        hardLevel.innerHTML = ''

        hardSkill.appendChild       (hardLevel);
        hardAbility.appendChild     (hardSkill);
        };

    const   loadingExperience     = (dom, experiences) => {
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

    const   loadingSkill          = (dom, skills, style) => {
        const   skill = document.createElement('div');
                skill.setAttribute      ('class', 'skill');
                skill.style.padding         = style.padding;
                skill.style.display         = style.display;
                skill.style.justifyContent  = style.justify;
                skill.style.alignItems      = style.alignItems;

        const   symbol = document.createElement('div');
                symbol.setAttribute        ('class', 'skill');
                symbol.style.padding           = style.padding;
                symbol.style.display           = style.display;
                symbol.style.justifyContent    = style.justify;
                symbol.style.alignItems        = style.alignItems;

        const   bar = document.createElement('div');
                bar.setAttribute        ('class', 'skill');
                bar.style.padding           = style.padding;
                bar.style.display           = style.display;
                bar.style.justifyContent    = style.justify;
                bar.style.alignItems        = style.alignItems;
        
        skill.appendChild(symbol, bar);
        hardLeveling.appendChild(skill);
        };

    const   showLevel = (e) => {
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

    const loaders = {
        loadPage:           createLoadingPage,
        loadInfo:           loadingInformations,
        loadNeighboar:      loadingNeighbor,
        loadBuilding:       loadingBuilding,
        loadModel:          loadingModel,
        loadMaterial:       loadingMaterial,
        loadExperience:     loadingExperience,
        loadSkill:          loadingSkill,
        loadLevel:          showLevel
    };

    export { loaders }

