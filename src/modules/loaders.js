import * as THREE       from "three";

import { GLTFLoader }   from "three/examples/jsm/Addons.js";
import { DRACOLoader }  from "three/examples/jsm/Addons.js";
import { BIM, DWG, TXT, OBJ, IMG, SWG, CGI, ART, THC, MAN, CLB, COM, DEC } from "./abilities.js";
import { styles } from "./styles.js";
import { domain as dom } from "./domain.js";

    const textureLoader = new THREE.TextureLoader();
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./src/utils/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    let currentBuilding
    let currentModel

    const loadingBuilding       = (scene, lights, building, material) => { 
        gltfLoader.load( building, (gltf) => 
            {
            if (currentModel || currentBuilding) {scene.remove(currentModel, currentBuilding)};
            currentBuilding = gltf.scene;
            currentBuilding.traverse(mesh => {if(mesh.isMesh) {mesh.material = material}});
            scene.add(lights.ambientLight, lights.keyLight);
            scene.add(currentBuilding);
            console.log(currentBuilding);
            })
        };

    const loadingModel          = (scene, lights, model, material) => { 
        gltfLoader.load( model, (gltf) => 
            {
            if (currentModel || currentBuilding) {scene.remove(currentModel, currentBuilding)};
            currentModel = gltf.scene;
            currentModel.traverse(mesh => {if(mesh.isMesh){mesh.material = material}});
            scene.add(lights.ambientLight, lights.keyLight);
            scene.add(currentModel);
            console.log(currentModel);
            })
        };

    const loadingExperience     = (dom, experiences) => {
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
    }

    const loadingSkill          = (dom, skills, style) => {
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
    }

    const showLevel = (e) => {
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

            bar.style.background = `linear-gradient(to right, ${styles.color3} ${value.completed}%, transparent ${value.completed+10}%)`;
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

                bar.style.background = `linear-gradient(to right, ${styles.color3} ${value.completed}%, transparent ${value.completed+10}%)`;
                bar.innerHTML = key;
                symbol.innerHTML = value.symbol;
    
                skill.appendChild(symbol);
                skill.appendChild(bar);
                dom.softLeveling.appendChild(skill);

        }
        }
        else {console.log('no skill to show')}
        }

    const loadingMaterial   = (textures) => {
            let texture      = textures;
            let texturePath  = {
                diffuse       : textureLoader.load(texture.diffuse),
                roughness     : textureLoader.load(texture.roughness),
                normal        : textureLoader.load(texture.normal),
                transmission  : textureLoader.load(texture.transmission)};
        
                texturePath.diffuse.flipY = false;
                texturePath.roughness.flipY = false;
                texturePath.normal.flipY = false;
                texturePath.transmission.flipY = false;
        
            let standardMaterial = new THREE.MeshStandardMaterial({
                transparent:    true,
                map:            texturePath.diffuse,        
                roughness:      texturePath.roughness, 
                normalMap:      texturePath.normal,
                alphaMap:       texturePath.transmission,       
            });

            console.log(standardMaterial)
            return standardMaterial
    }


    const loaders = {
        loadBuilding:       loadingBuilding,
        loadModel:          loadingModel,
        loadExperience:     loadingExperience,
        loadSkill:          loadingSkill,
        showLevel:          showLevel,
        loadMaterial:    loadingMaterial
    };

    export { loaders }

