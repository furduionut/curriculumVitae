    import * as THREE       from "three";
    import { GLTFLoader }   from "three/examples/jsm/Addons.js";
    import { DRACOLoader }  from "three/examples/jsm/Addons.js";
    import { FontLoader }   from "three/examples/jsm/Addons.js";
    import { TextGeometry } from "three/examples/jsm/Addons.js";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { gsap }         from "gsap";
    import { GUI }          from "dat.gui";
    
    import { styles } from "./styles.js";
    import { domain as dom } from "./domain.js";
    import { materials } from "./materials.js";


    const manager = new THREE.LoadingManager();
          manager.onStart = () => {
              console.log("Loading started");
          };
          
          manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const percent = Math.floor((itemsLoaded / itemsTotal) * 100);
            const barFill = document.getElementById("loading-bar-fill");
            if (barFill) barFill.style.width = percent + "%";
        };
        
        // When everything is loaded
        manager.onLoad = () => {
            console.log("All assets loaded");
            hideLoadingPage();
        };

    const gltfLoader = new GLTFLoader(manager);
    const dracoLoader = new DRACOLoader(manager);
    const textureLoader = new THREE.TextureLoader(manager);
    const fontLoader = new FontLoader(manager);

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
            flex-direction: column;
            z-index: 9999;
            transition: opacity .6s ease;
        `;
    
        // LOGO
        const logo = document.createElement('img');
        logo.src = './assets/images/firmLogoAnimated.gif';
        logo.style.cssText = `
            width: 120px;
            opacity: .95;
            transition: transform 1s ease;
            margin-bottom: 20px;
        `;
    
        // LOADING BAR
        const barContainer = document.createElement('div');
        barContainer.style.cssText = `
            width: 200px;
            height: 6px;
            background: rgba(255,255,255,0.3);
            border-radius: 3px;
            overflow: hidden;
        `;
    
        const barFill = document.createElement('div');
        barFill.id = "loading-bar-fill";
        barFill.style.cssText = `
            width: 0%;
            height: 100%;
            background: white;
            transition: width .3s ease;
        `;
    
        barContainer.appendChild(barFill);
        loading.appendChild(logo);
        loading.appendChild(barContainer);
        document.body.appendChild(loading);
    
        // Rotate logo
        setInterval(() => {
            logo.style.transform = `rotate(360deg)`;
        }, 1500);
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

    function loading3DText          (scene, text) {
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
        };

    function loading2DText          (dom, text, delay = 100) {
        
        const element = document.createElement("div");
        dom.appendChild(element);
        
        const letters = Array.from(text); // Handles emoji and other Unicode characters
        let index = 0;
        
        function showNextLetter() {
            if (index >= letters.length) return;
        
            element.textContent += letters[index++];
            setTimeout(showNextLetter, delay);
        }
        
        showNextLetter();
        return element;
        }
        
    function loadingNeighbor        (scene, light, building, material){ 
        let scale = .1;

        gltfLoader.load(building, (gltf) => {
        
            currentBuilding = gltf.scene;
            currentBuilding.name = 'pageLayout';
            currentBuilding.position.set(0, 0, 0);
            currentBuilding.scale.set(scale, scale, scale);
        
            let neighborTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '.projects',
                    start: "5% 0%",
                    end: "120% 100%",
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
                    // child.material = materials.support;
                    child.material.transparent = true;
                    child.material.opacity = 0;
                    child.position.y = originalY + 6.5;
                    child.scale.set(.55,.55,.55);

                    neighborTimeline
                        .to(child.material, {opacity: 1, duration: 5, ease: "power2.out"}, 2)
                        .to(child.material, {opacity: 0, duration: 8, ease: "power2.out"}, 4);
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
                        .to(child.position, {z: originalZ, duration: 10, ease: "power3.out"}, 2.5);
                
                    return;
                };

                if (child.name.includes('neighboar_012') || child.name.includes('neighboar_013')){
                    child.material = materials.model;
                    child.material.transparent = true;
                    child.material.opacity = 1;
                    child.material.depthWrite = true;
                    
                    neighborTimeline.to(child.material, {opacity: 0,        duration: 1,        ease: "power2.out",      }, 7.5);
                    return;
                };

                if (child.name.includes('neighboar')) {
                    const belowY = originalY - (Math.random() * 2 + 1);

                    child.scale.set(0,0,0);
                    child.material          = material.model;
                    child.position.y        = belowY;
                    
                    neighborTimeline.to(child.scale,    {x: 1, y: 1, z:1,   duration: 1,       ease: "back.out(1.7)",   }, 5.25);
                    neighborTimeline.to(child.material, {opacity: 1,        duration: 1,        ease: "power2.out",      }, 5.25);
                    neighborTimeline.to(child.position, {y: originalY,      duration: 1,      ease: "bounce.out",      }, 5.25);
                        
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

    function applyFilter            (texture, color, strength, mode) {

        const overlayColor = new THREE.Color(color);
    
        return new THREE.ShaderMaterial({
            uniforms: {
                map:      { value: texture },
                overlay:  { value: overlayColor },
                strength: { value: strength },
                mode:     { value: mode }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D map;
                uniform vec3 overlay;
                uniform float strength;
                uniform int mode;
                varying vec2 vUv;
    
                // -----------------------------
                // Basic Blend Modes
                // -----------------------------
    
                vec3 blendMultiply(vec3 base, vec3 blend) {
                    return base * blend;
                }
    
                vec3 blendScreen(vec3 base, vec3 blend) {
                    return 1.0 - (1.0 - base) * (1.0 - blend);
                }
    
                vec3 blendOverlay(vec3 base, vec3 blend) {
                    return vec3(
                        base.r < 0.5 ? (2.0 * base.r * blend.r) : (1.0 - 2.0 * (1.0 - base.r) * (1.0 - blend.r)),
                        base.g < 0.5 ? (2.0 * base.g * blend.g) : (1.0 - 2.0 * (1.0 - base.g) * (1.0 - blend.g)),
                        base.b < 0.5 ? (2.0 * base.b * blend.b) : (1.0 - 2.0 * (1.0 - base.b) * (1.0 - blend.b))
                    );
                }
    
                vec3 blendSoftLight(vec3 base, vec3 blend) {
                    return mix(
                        base - (1.0 - 2.0 * blend) * base * (1.0 - base),
                        base + (2.0 * blend - 1.0) * (sqrt(base) - base),
                        step(0.5, blend)
                    );
                }
    
                vec3 blendHardLight(vec3 base, vec3 blend) {
                    return blendOverlay(blend, base);
                }
    
                vec3 blendColorDodge(vec3 base, vec3 blend) {
                    return base / (1.0 - blend);
                }
    
                vec3 blendColorBurn(vec3 base, vec3 blend) {
                    return 1.0 - (1.0 - base) / blend;
                }
    
                vec3 blendLinearDodge(vec3 base, vec3 blend) {
                    return base + blend;
                }
    
                vec3 blendLinearBurn(vec3 base, vec3 blend) {
                    return base + blend - 1.0;
                }
    
                vec3 blendVividLight(vec3 base, vec3 blend) {
                    return vec3(
                        blend.r < 0.5 ? (1.0 - (1.0 - base.r) / (2.0 * blend.r)) : (base.r / (2.0 * (1.0 - blend.r))),
                        blend.g < 0.5 ? (1.0 - (1.0 - base.g) / (2.0 * blend.g)) : (base.g / (2.0 * (1.0 - blend.g))),
                        blend.b < 0.5 ? (1.0 - (1.0 - base.b) / (2.0 * blend.b)) : (base.b / (2.0 * (1.0 - blend.b)))
                    );
                }
    
                vec3 blendLinearLight(vec3 base, vec3 blend) {
                    return base + 2.0 * blend - 1.0;
                }
    
                vec3 blendPinLight(vec3 base, vec3 blend) {
                    return vec3(
                        blend.r < 0.5 ? min(base.r, 2.0 * blend.r) : max(base.r, 2.0 * blend.r - 1.0),
                        blend.g < 0.5 ? min(base.g, 2.0 * blend.g) : max(base.g, 2.0 * blend.g - 1.0),
                        blend.b < 0.5 ? min(base.b, 2.0 * blend.b) : max(base.b, 2.0 * blend.b - 1.0)
                    );
                }
    
                vec3 blendHardMix(vec3 base, vec3 blend) {
                    return step(1.0, base + blend);
                }
    
                vec3 blendDifference(vec3 base, vec3 blend) {
                    return abs(base - blend);
                }
    
                vec3 blendExclusion(vec3 base, vec3 blend) {
                    return base + blend - 2.0 * base * blend;
                }
    
                vec3 blendDarken(vec3 base, vec3 blend) {
                    return min(base, blend);
                }
    
                vec3 blendLighten(vec3 base, vec3 blend) {
                    return max(base, blend);
                }
    
                vec3 blendSubtract(vec3 base, vec3 blend) {
                    return base - blend;
                }
    
                vec3 blendDivide(vec3 base, vec3 blend) {
                    return base / blend;
                }
    
                // -----------------------------
                // HSL Utility Functions
                // -----------------------------
    
                vec3 rgb2hsl(vec3 c) {
                    float maxc = max(max(c.r, c.g), c.b);
                    float minc = min(min(c.r, c.g), c.b);
                    float l = (maxc + minc) * 0.5;
    
                    float h = 0.0;
                    float s = 0.0;
    
                    if (maxc != minc) {
                        float d = maxc - minc;
                        s = l > 0.5 ? d / (2.0 - maxc - minc) : d / (maxc + minc);
    
                        if (maxc == c.r) h = (c.g - c.b) / d + (c.g < c.b ? 6.0 : 0.0);
                        else if (maxc == c.g) h = (c.b - c.r) / d + 2.0;
                        else h = (c.r - c.g) / d + 4.0;
    
                        h /= 6.0;
                    }
    
                    return vec3(h, s, l);
                }
    
                float hue2rgb(float p, float q, float t) {
                    if (t < 0.0) t += 1.0;
                    if (t > 1.0) t -= 1.0;
                    if (t < 1.0/6.0) return p + (q - p) * 6.0 * t;
                    if (t < 1.0/2.0) return q;
                    if (t < 2.0/3.0) return p + (q - p) * (2.0/3.0 - t) * 6.0;
                    return p;
                }
    
                vec3 hsl2rgb(vec3 hsl) {
                    float h = hsl.x;
                    float s = hsl.y;
                    float l = hsl.z;
    
                    float r, g, b;
    
                    if (s == 0.0) {
                        r = g = b = l;
                    } else {
                        float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
                        float p = 2.0 * l - q;
                        r = hue2rgb(p, q, h + 1.0/3.0);
                        g = hue2rgb(p, q, h);
                        b = hue2rgb(p, q, h - 1.0/3.0);
                    }
    
                    return vec3(r, g, b);
                }
    
                // -----------------------------
                // HSL Blend Modes
                // -----------------------------
    
                vec3 blendHue(vec3 base, vec3 blend) {
                    vec3 bHSL = rgb2hsl(base);
                    vec3 oHSL = rgb2hsl(blend);
                    return hsl2rgb(vec3(oHSL.x, bHSL.y, bHSL.z));
                }
    
                vec3 blendSaturation(vec3 base, vec3 blend) {
                    vec3 bHSL = rgb2hsl(base);
                    vec3 oHSL = rgb2hsl(blend);
                    return hsl2rgb(vec3(bHSL.x, oHSL.y, bHSL.z));
                }
    
                vec3 blendColor(vec3 base, vec3 blend) {
                    vec3 bHSL = rgb2hsl(base);
                    vec3 oHSL = rgb2hsl(blend);
                    return hsl2rgb(vec3(oHSL.x, oHSL.y, bHSL.z));
                }
    
                vec3 blendLuminosity(vec3 base, vec3 blend) {
                    vec3 bHSL = rgb2hsl(base);
                    vec3 oHSL = rgb2hsl(blend);
                    return hsl2rgb(vec3(bHSL.x, bHSL.y, oHSL.z));
                }
    
                // -----------------------------
                // Mode Selector
                // -----------------------------
    
                vec3 blendMode(vec3 base, vec3 blend, int mode) {
                    if (mode == 0) return blendMultiply(base, blend);
                    if (mode == 1) return blendScreen(base, blend);
                    if (mode == 2) return blendOverlay(base, blend);
                    if (mode == 3) return blendSoftLight(base, blend);
                    if (mode == 4) return blendHardLight(base, blend);
                    if (mode == 5) return blendColorDodge(base, blend);
                    if (mode == 6) return blendColorBurn(base, blend);
                    if (mode == 7) return blendLinearDodge(base, blend);
                    if (mode == 8) return blendLinearBurn(base, blend);
                    if (mode == 9) return blendVividLight(base, blend);
                    if (mode == 10) return blendLinearLight(base, blend);
                    if (mode == 11) return blendPinLight(base, blend);
                    if (mode == 12) return blendHardMix(base, blend);
                    if (mode == 13) return blendDifference(base, blend);
                    if (mode == 14) return blendExclusion(base, blend);
                    if (mode == 15) return blendDarken(base, blend);
                    if (mode == 16) return blendLighten(base, blend);
                    if (mode == 17) return blendSubtract(base, blend);
                    if (mode == 18) return blendDivide(base, blend);
                    if (mode == 19) return blendHue(base, blend);
                    if (mode == 20) return blendSaturation(base, blend);
                    if (mode == 21) return blendColor(base, blend);
                    if (mode == 22) return blendLuminosity(base, blend);
    
                    return base;
                }
    
                void main() {
                    vec4 base = texture2D(map, vUv);
                    vec3 blended = blendMode(base.rgb, overlay, mode);
                    vec3 finalColor = mix(base.rgb, blended, strength);
                    gl_FragColor = vec4(finalColor, base.a);
                }
            `
        });
        };

    function loadingBuilding        (scene, light, building, material, color, intensity, blendMode) {
        let scale = .1;
        let pivot = new THREE.Vector3(0,1,0);
        let bbCenter = new THREE.Vector3();

        gltfLoader.load(building, (gltf) => {
            scene.children.slice().forEach(obj => {
                if (obj.name !== "pageLayout") scene.remove(obj);
            });
    
            if (currentModel || currentBuilding && currentBuilding.name !== 'pageLayout') {
                scene.remove(currentModel, currentBuilding);
                currentBuilding = null;
                currentModel = null;
            }
    
            currentBuilding = gltf.scene;
    
            currentBuilding.position.set(-50 * scale, 0, -100 * scale);
            currentBuilding.scale.set(scale, scale, scale);
    
            currentBuilding.traverse(child => {
                if (!child.isMesh) return;
    
                const tex =
                    material.map ||
                    child.material.map ||
                    child.material.uniforms?.map?.value;
    
                if (!tex) return;
    
                child.material = applyFilter(
                    tex,
                    color,
                    intensity,
                    blendMode
                );
            });

            
    
            scene.add(currentBuilding);
        });
        };

    function loadingModel           (scene, light, model, material, color, intensity, blendMode) {
        let scale = .1;
    
        gltfLoader.load(model, (gltf) => {
    
            // Remove everything except pageLayout
            scene.children.slice().forEach(obj => {
                if (obj.name !== "pageLayout") {
                    scene.remove(obj);
                }
            });
    
            currentModel = null;
            currentBuilding = null;
    
            currentModel = gltf.scene;
    
            currentModel.position.set(-50 * scale, 0, -100 * scale);
            currentModel.scale.set(scale, scale, scale);
    
            currentModel.traverse(child => {
                if (!child.isMesh) return;
    
                const tex =
                    material.map ||
                    child.material.map ||
                    child.material.uniforms?.map?.value;
    
                if (!tex) return;
    
                child.material = applyFilter(
                    tex,
                    color,
                    intensity,
                    blendMode
                );
            });
    
            scene.add(currentModel);
        });
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

    function loadingPush            (element, message = "Tap here") {
        // Create indicator
        const indicator = document.createElement("div");
        document.body.appendChild(indicator);
    
        // Get direct children
        const children = Array.from(element.children);
    
        // Highlight all except last
        children.slice(0, -1).forEach(child => {
            child.classList.add("highlight-outline");
        });
    
        // Highlight ONLY the children of the last child
        const lastChild = children[children.length - 1];
        if (lastChild) {
            Array.from(lastChild.children).forEach(grandchild => {
                grandchild.classList.add("highlight-outline");
            });
        }
    
        // Position indicator next to the element
    
        // Remove everything when user clicks the element
        element.addEventListener("click", () => {
            children.slice(0, -1).forEach(child => {
                child.classList.remove("highlight-outline");
            });
    
            if (lastChild) {
                Array.from(lastChild.children).forEach(grandchild => {
                    grandchild.classList.remove("highlight-outline");
                });
            }
    
            indicator.remove();
        }, { once: true });
        };

    function loadingExperience      (domBtn, data) {
        const expDetails = document.querySelector('#expDetails');
        if (!expDetails) return;
    
        // 1. Curăță containerul
        expDetails.style.display = 'flex';
        expDetails.innerHTML = '';
    
        // 2. Creează experiențele
        Object.keys(data).forEach((key, i) => {
            const exp = data[key];
    
            const index = i + 1;      // începe pe partea dreaptă
            const isOdd = index % 2 !== 0;
    
            const wrapper = document.createElement('div');
            wrapper.classList.add(`experience-${index}`);
            wrapper.classList.add(isOdd ? 'odd' : 'even');
    
            // geometry-up
            const geometryUp = document.createElement('div');
            geometryUp.classList.add('geometry-up');
            geometryUp.textContent = exp.years;
    
            // content
            const content = document.createElement('div');
            content.classList.add('content');
    
            const h3 = document.createElement('h3');
            h3.textContent = exp.title;
    
            const ul = document.createElement('ul');
            ul.classList.add('expDescription');
    
            exp.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
    
            content.appendChild(h3);
            content.appendChild(ul);
    
            // geometry-down
            const geometryDown = document.createElement('div');
            geometryDown.classList.add('geometry-down');
            geometryDown.textContent = exp.company;
    
            // pointCloud
            const pointCloud = document.createElement('div');
            pointCloud.classList.add('pointCloud');
    
            pointCloud.appendChild(document.createElement('div')).classList.add('biggerCloud');
            pointCloud.appendChild(document.createElement('div')).classList.add('bigCloud');
            pointCloud.appendChild(document.createElement('div')).classList.add('smallCloud');
    
            // asamblare finală
            wrapper.appendChild(geometryUp);
            wrapper.appendChild(content);
            wrapper.appendChild(geometryDown);
            wrapper.appendChild(pointCloud);
    
            expDetails.appendChild(wrapper);
        });
    
        // 3. Creează timeline EXACT ca în HTML-ul tău
        const timeline = document.createElement('div');
        timeline.classList.add('timeline');
    
        const mainPipe = document.createElement('div');
        mainPipe.classList.add('mainPipe');
    
        // creează EXACT 38 lineBreaks ca în exemplul tău
        for (let i = 0; i < 38; i++) {
            const lineBreak = document.createElement('div');
            lineBreak.classList.add('lineBreak');
            mainPipe.appendChild(lineBreak);
        }
    
        timeline.appendChild(mainPipe);
    
        // 4. Timeline este MEREU ultimul copil
        expDetails.appendChild(timeline);
        };
    
    const loaders = {
        loadLogo:           loadingLogo3D,
        loadPage:           createLoadingPage,
        loadInfo:           loadingInformations,
        loadIndicator:      loadingIndicators,
        load3DText:         loading3DText,
        load2DText:         loading2DText,
        loadNeighboar:      loadingNeighbor,
        loadBuilding:       loadingBuilding,
        loadModel:          loadingModel,
        loadMaterial:       loadingMaterial,
        loadPress:          loadingPressIndicator,
        loadDisplay:        loadingDisplay,
        loadScroll:         loadingScroll,
        loadPush:           loadingPush,
        loadExperience:     loadingExperience
    };

    export { loaders }

