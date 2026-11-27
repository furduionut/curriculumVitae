SELECTIVE LIGHTING UPDATE
Extract selective_lighting_update inside your project's src folder.
From the project root (curriculumVitae), run:
  node .\src\selective_lighting_update\install-selective-lighting.mjs
Refresh the browser or restart Vite.

The installer modifies only the relevant parts of scripts.js, modules/loaders.js,
modules/commonScene.js and modules/materials.js, and creates modules/selectiveLighting.js.
It checks the source anchors and JavaScript syntax before writing and creates a backup.
If a source anchor differs, it stops without writing anything.

Baked house textures (all floor variants), portrait and desk use unlit materials.
This preserves color/alpha maps and animated opacity, but not live normal-map
shading or reflections. The house diffuse maps are interpreted as sRGB.
The lamp cone retains its custom gradient and flicker; only its brightness changes
from the previous default 2.2 to 0.65. Change uBeamIntensity in materials.js if desired.
The lamp cone does not read HDRI lighting in its shader.

SelectiveBloomPass uses the existing bloom settings and one extra reduced-resolution
scene capture. Change bloomResolutionScale in modules/selectiveLighting.js (0.25–1).
Other objects may still cast visible bloom halos across excluded objects, and
liquid glass can still reflect/blur these objects as part of its backdrop.
The animated logo, HDRI, liquid glass settings and animation code are left intact.

The installer was checked with the last available source snapshots plus lamp repair.
The user's latest local files and actual WebGL output have not been tested here.
