import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(process.argv[2] || process.cwd());
const src = fs.existsSync(path.join(project,'src','modules','materials.js')) ? path.join(project,'src') : project;
const files = {scripts:path.join(src,'scripts.js'), loaders:path.join(src,'modules','loaders.js'), common:path.join(src,'modules','commonScene.js'), materials:path.join(src,'modules','materials.js'), module:path.join(src,'modules','selectiveLighting.js')};
function patch(s, present, pattern, replacement, label) {
    if(present.test(s)) {console.log('[OK]',label);return s;}
    const count=[...s.matchAll(new RegExp(pattern.source,pattern.flags.includes('g')?pattern.flags:pattern.flags+'g'))].length;
    if(count!==1) throw Error(`Expected one ${label}; found ${count}. Nothing written.`);
    console.log('[PATCH]',label);return s.replace(pattern,replacement);
}
try {
    const old=Object.fromEntries(Object.entries(files).map(([k,p])=>[k,fs.existsSync(p)?fs.readFileSync(p,'utf8'):null]));
    for(const k of ['scripts','loaders','common','materials']) if(old[k]===null) throw Error(`Missing ${files[k]}. Run from the project root.`);
    const next={...old};
    next.scripts=patch(next.scripts,/import\s+\{\s*SelectiveBloomPass\s*\}/,/^([ \t]*)import[^\n]+from\s+['"]\.\/modules\/liquidGlass\.js['"];?/m,(m,i)=>`${m}\n${i}import { SelectiveBloomPass } from './modules/selectiveLighting.js';`,'bloom import');
    next.scripts=patch(next.scripts,/composer\.addPass\(\s*new SelectiveBloomPass\(/,/composer\.addPass\(\s*bloomPass\s*\)\s*;/,'composer.addPass(new SelectiveBloomPass(scene, perspCamera, bloomPass));','replace global bloom');
    next.loaders=patch(next.loaders,/import\s+\{\s*createUnlitMaterial\s*\}/,/^([ \t]*)import[^\n]+from\s+['"]\.\/commonScene\.js['"];?/m,(m,i)=>`${m}\n${i}import { createUnlitMaterial } from './selectiveLighting.js';`,'house import');
    next.loaders=patch(next.loaders,/diffuseMap\.colorSpace\s*=\s*THREE\.SRGBColorSpace/,/diffuseMap\.flipY\s*=\s*false\s*;/,m=>`${m}\n            diffuseMap.colorSpace = THREE.SRGBColorSpace;`,'baked diffuse map color space');
    // Leave the existing loading and texture path logic intact. Convert the
    // returned material before it is ever attached or rendered.
    next.loaders=patch(next.loaders,/return\s+createUnlitMaterial\(mat\)/,/(function loadingMaterial\s*\([^)]*\)\s*\{[\s\S]*?)(return\s+mat\s*;)/,(m,p)=>`${p}return createUnlitMaterial(mat);`,'unlit house material');
    next.common=patch(next.common,/import\s+\{\s*createUnlitMaterial\s*\}/,/^([ \t]*)import[^\n]+from\s+['"]\.\/lampLight\.js['"];?/m,(m,i)=>`${m}\n${i}import { createUnlitMaterial } from './selectiveLighting.js';`,'layout import');
    next.common=patch(next.common,/const material\s*=\s*createUnlitMaterial\(child\.material\)/,/const material\s*=\s*child\.material\?\.clone\?\.\(\)\s*;/,'const material = createUnlitMaterial(child.material);','unlit portrait before GSAP animation');
    next.common=patch(next.common,/child\.material\s*=\s*createUnlitMaterial\(materials\.desk\)/,/child\.material\s*=\s*materials\.desk\s*;/,'child.material = createUnlitMaterial(materials.desk);','unlit desk');
    next.common=patch(next.common,/parentName\.includes\('pictureframe'\)[^\n]+\{\s*child\.material\s*=\s*createUnlitMaterial/s,/if\s*\(parentName\.includes\('pictureframe'\)\s*\|\|\s*parentName\.includes\('deskplane'\)\)\s*return\s*;/,"if (parentName.includes('pictureframe') || parentName.includes('deskplane')) {\n                child.material = createUnlitMaterial(child.material);\n                return;\n            }",'unlit nested portrait/desk meshes');
    // Preserve all user's liquid-glass settings. Lower only the cone's intensity.
    next.materials=patch(next.materials,/uBeamIntensity\s*:\s*\{\s*value\s*:\s*0\.65\s*\}/,/uBeamIntensity\s*:\s*\{\s*value\s*:\s*[\d.]+\s*\}/,'uBeamIntensity: { value: 0.65 }','reduce cone brightness');
    if(next.module===null) next.module=fs.readFileSync(path.join(here,'modules','selectiveLighting.js'),'utf8');
    else if(!next.module.includes('export class SelectiveBloomPass')) throw Error('A different selectiveLighting.js already exists. Nothing written.');
    const temp=fs.mkdtempSync(path.join(tmpdir(),'selective-lighting-'));
    try {for(const [k,v] of Object.entries(next)){const p=path.join(temp,k+'.mjs');fs.writeFileSync(p,v);execFileSync(process.execPath,['--check',p],{stdio:'pipe'});}}
    finally{fs.rmSync(temp,{recursive:true,force:true});}
    const changed=Object.keys(next).filter(k=>next[k]!==old[k]);
    if(!changed.length){console.log('All selective lighting checks passed. No changes needed.');}
    else{
        const backup=fs.mkdtempSync(path.join(project,'selective-lighting-backup-'));
        for(const k of changed) if(old[k]!==null) fs.writeFileSync(path.join(backup,path.basename(files[k])),old[k]);
        try{for(const k of changed)fs.writeFileSync(files[k],next[k]);}
        catch(e){for(const k of changed){if(old[k]===null)fs.rmSync(files[k],{force:true});else fs.writeFileSync(files[k],old[k]);}throw e;}
        console.log('Selective lighting installed. Changed:',changed.join(', '));console.log('Backup:',backup);
    }
    console.log('Refresh the site. Main houses, portrait, desk and cone no longer generate bloom.');
}catch(e){console.error('[Selective lighting]',e.message);process.exitCode=1;}
