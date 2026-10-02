import { Project } from "../constructors/constructors";

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
                    main:   './assets/meshes/casaBacau/casaBacau_baked/casaBacau_outerShell.glb',
                    meshes: 
                        [
                            './assets/meshes/casaBacau/casaBacau_baked/casaBacau_outerShell.glb',
                            // './assets/meshes/casaBacau/casaBacau_baked/casaBacau_baseFloor.glb',
                            './assets/meshes/casaBacau/casaBacau_baked/casaBacau_groundFloor.glb',
                            './assets/meshes/casaBacau/casaBacau_baked/casaBacau_firstFloor.glb'
                        ],

                    textures:
                        {               
                        diffuse:      './assets/textures/casaBacau/casaBacau_diffuseMap_1k.jpg',
                        roughness:    './assets/textures/casaBacau/casaBacau_roughnessMap_1k.jpg',
                        normal:       './assets/textures/casaBacau/casaBacau_normalMap_1k.jpg',
                        transmission: './assets/textures/casaBacau/casaBacau_transmitionMap_1k.jpg'
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
                    main:   './assets/meshes/casaClim/casaClim_baked/casaClim_outerShell.glb',
                    meshes:
                        [
                            './assets/meshes/casaClim/casaClim_baked/casaClim_outerShell.glb',
                            './assets/meshes/casaClim/casaClim_baked/casaClim_groundFloor.glb', 
                            './assets/meshes/casaClim/casaClim_baked/casaClim_firstFloor.glb'
                        ],

                    textures:
                        {
                        diffuse:       './assets/textures/casaClim/casaClim_diffuseMap_1k.jpg',
                        roughness:     './assets/textures/casaClim/casaClim_roughnessMap_1k.jpg',
                        normal:        './assets/textures/casaClim/casaClim_normalMap_1k.jpg',
                        transmission:  './assets/textures/casaClim/casaClim_transmitionMap_1k.jpg'
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
                        main:   './assets/meshes/casaStolnicu/casaStolnicu_baked/casaStolnicu_outerShell.glb',
                        meshes: 
                            [
                                './assets/meshes/casaStolnicu/casaStolnicu_baked/casaStolnicu_outerShell.glb',
                                './assets/meshes/casaStolnicu/casaStolnicu_baked/casaStolnicu_groundFloor.glb', 
                                './assets/meshes/casaStolnicu/casaStolnicu_baked/casaStolnicu_firstFloor.glb'
                            ],
                        textures:
                            {
                            diffuse: './assets/textures/casaStolnicu/casaStolnicu_diffuseMap_1k.jpg',
                            roughness: './assets/textures/casaStolnicu/casaStolnicu_roughnessMap_1k.jpg',
                            normal: './assets/textures/casaStolnicu/casaStolnicu_normalMap_1k.jpg',
                            transmission: './assets/textures/casaStolnicu/casaStolnicu_transmissionMap_1k.jpg'
                            }
                        },
                    str: {},
                    ins: {}
                }
            )
} 

export {projects}