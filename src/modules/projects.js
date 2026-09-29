import { Project } from "../constructors/constructors";

const BASE = import.meta.env.BASE_URL;

const projects = 
{
    casaBacau:  new Project(
        {
            name: 'Bacau House',
            type: 'Residential',
            style: 'Mediteranian',
            about: `A traditional two‑story residential house with intersecting gable roofs clad 
            in warm reddish shingles. The light-toned façade features symmetrical window placement 
            and an arched entrance supported by columns, giving it a classic suburban character. 
            The geometry mixes simple rectangular volumes with layered roof planes, while the 
            chromatic palette contrasts soft wall colors with the saturated roof tone.`
        },

        {   
            arc:{
                main:   `${BASE}assets/meshes/casaBacau/casaBacau_baked/casaBacau_outerShell.glb`,
                meshes: 
                [
                    `${BASE}assets/meshes/casaBacau/casaBacau_baked/casaBacau_outerShell.glb`,
                    `${BASE}assets/meshes/casaBacau/casaBacau_baked/casaBacau_baseFloor.glb`,
                    `${BASE}assets/meshes/casaBacau/casaBacau_baked/casaBacau_groundFloor.glb`,
                    `${BASE}assets/meshes/casaBacau/casaBacau_baked/casaBacau_firstFloor.glb`
                ],

                textures:
                {               
                    diffuse:      `${BASE}assets/textures/casaBacau/casaBacau_diffuseMap_1k.jpg`,
                    roughness:    `${BASE}assets/textures/casaBacau/casaBacau_roughnessMap_1k.jpg`,
                    normal:       `${BASE}assets/textures/casaBacau/casaBacau_normalMap_1k.jpg`,
                    transmission: `${BASE}assets/textures/casaBacau/casaBacau_transmitionMap_1k.jpg`
                }
            },
            str: {},
            ins: {}
        }
    ),

    casaClim:   new Project(
        {
            name: 'Clim House',
            type: 'Residential',
            style: 'Modern/Contemporan',
            about: `A modern two‑story house with clean rectangular volumes, 
            flat roof, and large horizontal windows. The façade blends light grey concrete, 
            warm wood panels, and dark metal trims, creating a crisp minimalist look with 
            strong geometric contrast.`,
        },

        {
            arc: {
                main:   `${BASE}assets/meshes/casaClim/casaClim_baked/casaClim_outerShell.glb`,
                meshes:
                [
                    `${BASE}assets/meshes/casaClim/casaClim_baked/casaClim_outerShell.glb`,
                    `${BASE}assets/meshes/casaClim/casaClim_baked/casaClim_groundFloor.glb`, 
                    `${BASE}assets/meshes/casaClim/casaClim_baked/casaClim_firstFloor.glb`
                ],

                textures:
                {
                    diffuse:       `${BASE}assets/textures/casaClim/casaClim_diffuseMap_1k.jpg`,
                    roughness:     `${BASE}assets/textures/casaClim/casaClim_roughnessMap_1k.jpg`,
                    normal:        `${BASE}assets/textures/casaClim/casaClim_normalMap_1k.jpg`,
                    transmission:  `${BASE}assets/textures/casaClim/casaClim_transmitionMap_1k.jpg`
                }
            },
            str: {},
            ins: {}
        }  
    ),

    casaStolnicu:   new Project(
        {
            name: 'Stolnicu House',
            type: 'Residential',
            style: 'Eclectism',
            about: 'A refreshing design'
        },

        {
            arc:{
                main:   `${BASE}assets/meshes/casaStolnicu/casaStolnicu_baked/casaStolnicu_outerShell.glb`,
                meshes: 
                [
                    `${BASE}assets/meshes/casaStolnicu/casaStolnicu_baked/casaStolnicu_outerShell.glb`,
                    `${BASE}assets/meshes/casaStolnicu/casaStolnicu_baked/casaStolnicu_groundFloor.glb`, 
                    `${BASE}assets/meshes/casaStolnicu/casaStolnicu_baked/casaStolnicu_firstFloor.glb`
                ],
                textures:
                {
                    diffuse:       `${BASE}assets/textures/casaStolnicu/casaStolnicu_diffuseMap_1k.jpg`,
                    roughness:     `${BASE}assets/textures/casaStolnicu/casaStolnicu_roughnessMap_1k.jpg`,
                    normal:        `${BASE}assets/textures/casaStolnicu/casaStolnicu_normalMap_1k.jpg`,
                    transmission:  `${BASE}assets/textures/casaStolnicu/casaStolnicu_transmissionMap_1k.jpg`
                }
            },
            str: {},
            ins: {}
        }
    )
} 

export { projects };
