import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

// Only these roots / named objects are excluded. Context buildings, the lamp
// body, other layout glass and viewport2 are intentionally left alone.
export const selectiveLightingSettings = {
    projectRoots: ['activeProjectBuilding', 'activeProjectVariant'],
    layoutObjects: ['pictureFrame', 'deskPlane'],
    bloomResolutionScale: 0.5,
};

const normalized = name => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const matches = (name, keys) => keys.some(key => {
    const n = normalized(name), k = normalized(key);
    return n === k || (n.startsWith(k) && /^\d+$/.test(n.slice(k.length)));
});

function isBeam(object) {
    const list = Array.isArray(object.material) ? object.material : [object.material];
    return list.some(m => m?.uniforms?.uBeamPower && m?.uniforms?.uBeamIntensity);
}

function excluded(object) {
    if (isBeam(object)) return true;
    for (let p = object; p; p = p.parent) {
        if (matches(p.name, selectiveLightingSettings.projectRoots)) return true;
        if (selectiveLightingSettings.layoutObjects.some(key => normalized(p.name).includes(normalized(key)))) return true;
    }
    return false;
}

// For baked CAD textures and the portrait/desk, an unlit material keeps the
// original map and tint without any HDRI or moving lighting response. This also
// avoids scene.environmentIntensity overriding per-material envMapIntensity.
export function createUnlitMaterial(source) {
    if (Array.isArray(source)) return source.map(createUnlitMaterial);
    if (!source) return source;
    if (source.isMeshBasicMaterial) return source.clone();
    const target = new THREE.MeshBasicMaterial();
    const keys = ['name','map','alphaMap','aoMap','aoMapIntensity','lightMap','lightMapIntensity',
        'opacity','transparent','alphaTest','alphaHash','side','shadowSide','depthTest','depthWrite',
        'depthFunc','colorWrite','blending','blendSrc','blendDst','blendEquation','blendSrcAlpha',
        'blendDstAlpha','blendEquationAlpha','premultipliedAlpha','vertexColors','fog','toneMapped',
        'polygonOffset','polygonOffsetFactor','polygonOffsetUnits','visible','forceSinglePass',
        'clippingPlanes','clipIntersection','clipShadows','wireframe'];
    for (const key of keys) if (source[key] !== undefined && key in target) target[key] = source[key];
    if (source.color) target.color.copy(source.color);
    target.envMap = null;
    return target;
}

// A separate low-resolution bloom source render. Black substitutes preserve
// the excluded surfaces' occlusion and cutout alpha, but contribute no glow.
// Only the pure blurred light is added to the main image (not the source scene
// again). The existing BokehPass, glass capture and logo remain independent.
export class SelectiveBloomPass extends Pass {
    constructor(scene, camera, bloomPass) {
        super();
        this.scene = scene;
        this.camera = camera;
        this.bloomPass = bloomPass;
        this.source = new THREE.WebGLRenderTarget(1, 1, {
            type: THREE.HalfFloatType, depthBuffer: true, stencilBuffer: false,
        });
        this.source.texture.name = 'SelectiveBloom.source';
        this.source.texture.generateMipmaps = false;
        this.blackBackground = new THREE.Color(0x000000);
        this.masks = new WeakMap();
        this.maskMaterials = new Map();
        this.usedMasks = new Set();
        this.hidden = new THREE.MeshBasicMaterial({ visible: false });
        this.saved = [];
        this.composite = new THREE.ShaderMaterial({
            uniforms: { baseTexture: { value: null }, glowTexture: { value: null } },
            vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
            fragmentShader: `uniform sampler2D baseTexture, glowTexture; varying vec2 vUv;
                void main(){ vec4 base=texture2D(baseTexture,vUv); vec3 glow=texture2D(glowTexture,vUv).rgb;
                    gl_FragColor=vec4(base.rgb+glow,base.a);
                    #include <tonemapping_fragment>
                    #include <colorspace_fragment>
                }`,
            depthTest: false, depthWrite: false, toneMapped: true, blending: THREE.NoBlending,
        });
        this.quad = new FullScreenQuad(this.composite);
    }
    setSize(width, height) {
        const scale = THREE.MathUtils.clamp(selectiveLightingSettings.bloomResolutionScale, .25, 1);
        const w = Math.max(32, Math.round(width * scale));
        const h = Math.max(32, Math.round(height * scale));
        this.source.setSize(w,h);
        this.bloomPass.setSize(w,h);
    }
    maskFor(source) {
        if (!source || !source.visible || source.uniforms?.uBeamPower) return this.hidden;
        let mask = this.masks.get(source);
        if (!mask) {
            mask = createUnlitMaterial(source);
            mask.color.set(0x000000);
            mask.toneMapped = false; mask.fog = false;
            mask.aoMap = null; mask.lightMap = null; mask.envMap = null;
            mask.vertexColors = false;
            this.masks.set(source, mask);
            this.maskMaterials.set(source, mask);
        }
        this.usedMasks.add(source);
        // Portrait opacity is animated. Do not cache its old alpha.
        mask.opacity = source.opacity;
        mask.visible = source.visible;
        return mask;
    }
    render(renderer, writeBuffer, readBuffer, deltaTime) {
        this.usedMasks.clear();
        const oldTarget = renderer.getRenderTarget();
        const oldBackground = this.scene.background;
        const oldAutoClear = renderer.autoClear;
        const oldClear = renderer.getClearColor(new THREE.Color());
        const oldAlpha = renderer.getClearAlpha();
        const shadowAuto = renderer.shadowMap.autoUpdate;
        const shadowNeeds = renderer.shadowMap.needsUpdate;
        try {
            this.scene.traverseVisible(object => {
                if (!object.isMesh && !object.isLine && !object.isPoints) return;
                if (!object.material || !excluded(object)) return;
                const original = object.material;
                this.saved.push([object,original]);
                // The additive cone does not occlude objects behind it.
                object.material = (isBeam(object) || !object.isMesh) ? this.hidden :
                    Array.isArray(original) ? original.map(m=>this.maskFor(m)) : this.maskFor(original);
            });
            this.scene.background = this.blackBackground;
            renderer.shadowMap.autoUpdate = false;
            renderer.shadowMap.needsUpdate = false;
            renderer.autoClear = true;
            renderer.setClearColor(0x000000, 1);
            renderer.setRenderTarget(this.source);
            renderer.clear(true,true,true);
            renderer.render(this.scene,this.camera);
        } finally {
            for (const [object,material] of this.saved) object.material = material;
            this.saved.length = 0;
            for (const [source, mask] of this.maskMaterials) {
                if (!this.usedMasks.has(source)) {
                    mask.dispose(); this.maskMaterials.delete(source); this.masks.delete(source);
                }
            }
            this.scene.background = oldBackground;
            renderer.shadowMap.autoUpdate = shadowAuto;
            renderer.shadowMap.needsUpdate = shadowNeeds;
            renderer.autoClear = oldAutoClear;
            renderer.setClearColor(oldClear,oldAlpha);
            renderer.setRenderTarget(oldTarget);
        }
        // UnrealBloomPass stores the composite of its blur mips here, before
        // blending it back into its source. Use that pure-glow texture only.
        this.bloomPass.renderToScreen = false;
        this.bloomPass.render(renderer, null, this.source, deltaTime, false);
        this.composite.uniforms.baseTexture.value = readBuffer.texture;
        this.composite.uniforms.glowTexture.value = this.bloomPass.renderTargetsHorizontal[0].texture;
        renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
        this.quad.render(renderer);
    }
    dispose() {
        this.source.dispose();
        this.hidden.dispose();
        for (const mask of this.maskMaterials.values()) mask.dispose();
        this.maskMaterials.clear();
        this.bloomPass.dispose();
        this.composite.dispose();
        this.quad.dispose();
    }
}
