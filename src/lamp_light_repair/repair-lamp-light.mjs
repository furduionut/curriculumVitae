import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(process.argv[2] || process.cwd());
const src = fs.existsSync(path.join(project,'src','modules','materials.js')) ? path.join(project,'src') : project;
const files = { materials: path.join(src,'modules','materials.js'), common: path.join(src,'modules','commonScene.js'), scripts: path.join(src,'scripts.js'), lamp: path.join(src,'modules','lampLight.js') };
function replaceOnce(s, pattern, replacement, label) {
    const count = [...s.matchAll(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags+'g'))].length;
    if (count !== 1) throw Error(`Expected one ${label}, found ${count}. Nothing written.`);
    return s.replace(pattern,replacement);
}
function add(s, present, pattern, replacement, label) {
    if (present.test(s)) { console.log('[OK]',label); return s; }
    const result = replaceOnce(s,pattern,replacement,label);
    console.log('[REPAIR]',label); return result;
}
try {
    const old = Object.fromEntries(Object.entries(files).map(([k,p])=>[k,fs.existsSync(p)?fs.readFileSync(p,'utf8'):null]));
    for (const k of ['materials','common','scripts']) if (old[k] === null) throw Error(`Missing ${files[k]}. Run from the project root.`);
    const next = {...old};
    const block = fs.readFileSync(path.join(here,'lampBeam.material.txt'),'utf8').trimEnd();
    next.materials = add(next.materials,/\bconst\s+lampBeam\s*=/,/export\s+const\s+materials\s*=\s*\{/,m=>`${block}\n\n${m}`,'lampBeam material declaration');
    next.materials = add(next.materials,/^\s*lampBeam\s*[,}]/m,/export\s+const\s+materials\s*=\s*\{/,m=>`${m}\n    lampBeam, // luminous gradient cone`,'lampBeam export');
    next.common = add(next.common,/import\s+\{[^}]*\battachLampBeam\b[^}]*\}\s+from\s+['"]\.\/lampLight\.js['"]/,/^import[^\n]+from\s+['"]\.\/liquidGlass\.js['"];?\s*$/m,m=>`${m.trimEnd()}\nimport { attachLampBeam } from './lampLight.js';`,'commonScene lamp import');
    next.common = add(next.common,/\bconst\s+lampBeam\s*=\s*attachLampBeam\s*\(\s*root\s*,\s*materials\.lampBeam\s*\)/,/^(\s*)root\.traverse\(child\s*=>\s*\{/m,(m,indent)=>`${indent}const lampBeam = attachLampBeam(root, materials.lampBeam);\n${m}`,'commonScene lamp attachment');
    next.common = add(next.common,/if\s*\(\s*!child\.isMesh\s*\|\|\s*lampBeam\.meshes\.has\(child\)\s*\)\s*return\s*;/,/if\s*\(\s*!child\.isMesh\s*\)\s*return\s*;/, 'if (!child.isMesh || lampBeam.meshes.has(child)) return;','exclude beam from glass assignment');
    next.common = add(next.common,/\blampBeam\.dispose\s*\(\s*\)/,/^(\s*)window\.removeEventListener\('scroll',\s*updatePortraitAtCamD\);/m,(m,indent)=>`${indent}lampBeam.dispose();\n${m}`,'lamp cleanup');
    next.scripts = add(next.scripts,/import\s+\{[^}]*\bsetLampBeamProjectActive\b[^}]*\}\s+from\s+['"]\.\/modules\/lampLight\.js['"]/,/^([ \t]*)import\s+\{\s*createLiquidGlassBackdrop\s*\}\s+from\s+['"]\.\/modules\/liquidGlass\.js['"];?/m,(m,indent)=>`${m}\n${indent}import { setLampBeamProjectActive } from './modules/lampLight.js';`,'scripts lamp import');
    next.scripts = add(next.scripts,/\bsetLampBeamProjectActive\s*\(\s*shouldShow\s*\)\s*;/,/^([ \t]*)projectButtonsInRange\s*=\s*shouldShow\s*;/m,(m,indent)=>`${m}\n${indent}setLampBeamProjectActive(shouldShow);`,'Projects trigger');
    // Keep an existing user's lamp module (including tuning), only add diagnostics if absent.
    const diagnostic = fs.readFileSync(path.join(here,'modules','lampLight.js'),'utf8');
    if (!next.lamp) { next.lamp = diagnostic; console.log('[REPAIR] lampLight.js created'); }
    else {
        next.lamp = add(next.lamp,/No mesh named Light found/,/if\s*\(!meshes\.size\)\s*return\s*\{\s*meshes,\s*dispose\(\)\s*\{\}\s*\};/,`if (!meshes.size) { const names = []; root.traverse(object => { if (object.name) names.push(object.name); }); console.warn('[LampBeam] No mesh named Light found in pageLayout.glb. Loaded names:', names); return { meshes, dispose() {} }; }`,'missing mesh diagnostic');
        next.lamp = add(next.lamp,/\[LampBeam\] Projects active:/,/projectsActive\s*=\s*active\s*;/,m=>`${m}\n    console.info('[LampBeam] Projects active:', active, '| controllers:', controllers.size);`,'Projects diagnostic');
        if (!/window\.lampBeamTest\s*=/.test(next.lamp)) { next.lamp += diagnostic.slice(diagnostic.indexOf('// Manual diagnostic:')); console.log('[REPAIR] manual test'); }
    }
    // Check that the attachment and exclusion actually precede the glass assignment.
    if (next.common.indexOf('attachLampBeam(root, materials.lampBeam)') > next.common.indexOf('lampBeam.meshes.has(child)')) throw Error('Lamp attachment is not before the mesh traversal. Nothing written.');
    const temp = fs.mkdtempSync(path.join(tmpdir(),'lamp-repair-'));
    try { for (const [k,v] of Object.entries(next)) { const p=path.join(temp,k+'.mjs'); fs.writeFileSync(p,v); execFileSync(process.execPath,['--check',p],{stdio:'pipe'}); } }
    finally { fs.rmSync(temp,{recursive:true,force:true}); }
    const changed = Object.keys(next).filter(k=>next[k]!==old[k]);
    if (!changed.length) { console.log('All lamp integration checks passed. No changes needed.'); }
    else {
        const backup=fs.mkdtempSync(path.join(project,'lamp-light-repair-backup-'));
        for (const k of changed) if(old[k]!==null) fs.writeFileSync(path.join(backup,path.basename(files[k])),old[k]);
        try { for(const k of changed) fs.writeFileSync(files[k],next[k]); }
        catch(e) { for(const k of changed) { if(old[k]===null) fs.rmSync(files[k],{force:true}); else fs.writeFileSync(files[k],old[k]); } throw e; }
        console.log('Lamp repair complete. Changed:',changed.join(', ')); console.log('Backup:',backup);
    }
    console.log('Refresh the site. Browser F12 Console: look for [LampBeam] Ready or No mesh named Light found. Manual test: lampBeamTest(true)');
} catch(e) { console.error('[Lamp repair]',e.message); process.exitCode=1; }
