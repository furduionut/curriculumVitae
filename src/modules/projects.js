import { Project } from "../constructors/constructors";

const projects = 
{
    casaBacau:  new Project(
                {
                    name: 'Bacau House',
                    type: 'Residential',
                    style: 'Mediteranian',
                    about: 'A refreshing design'
                },

                {   
                arc:{
                    main:   './public/assets/meshes/casaBacau/casaBacau_baked/casaBacau_outterShell.glb',
                    meshes: 
                        [
                            './public/assets/meshes/casaBacau/casaBacau_baked/casaBacau_outterShell.glb',
                            './public/assets/meshes/casaBacau/casaBacau_baked/casaBacau_baseFloor.glb',
                            './public/assets/meshes/casaBacau/casaBacau_baked/casaBacau_groundFloor.glb',
                            './public/assets/meshes/casaBacau/casaBacau_baked/casaBacau_firstFloor.glb'
                        ],

                    textures:
                        {               
                        diffuse:      './public/assets/textures/casaBacau/casaBacau_diffuseMap_1k.jpg',
                        roughness:    './public/assets/textures/casaBacau/casaBacau_roughnessMap_1k.jpg',
                        normal:       './public/assets/textures/casaBacau/casaBacau_normalMap_1k.jpg',
                        transmission: './public/assets/textures/casaBacau/casaBacau_transmitionMap_1k.jpg'
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
                    about: 'A refreshing design',
                },

                {
                arc: {
                    main:   './public/assets/meshes/casaClim/casaClim_baked/casaClim_outterShell.glb',
                    meshes:
                        [
                            './public/assets/meshes/casaClim/casaClim_baked/casaClim_outterShell.glb',
                            './public/assets/meshes/casaClim/casaClim_baked/casaClim_baseFloor.glb',
                            './public/assets/meshes/casaClim/casaClim_baked/casaClim_groundFloor.glb', 
                            './public/assets/meshes/casaClim/casaClim_baked/casaClim_firstFloor.glb'
                        ],

                    textures:
                        {
                        diffuse:       './public/assets/textures/casaClim/casaClim_diffuseMap_1k.jpg',
                        roughness:     './public/assets/textures/casaClim/casaClim_roughnessMap_1k.jpg',
                        normal:        './public/assets/textures/casaClim/casaClim_normalMap_1k.jpg',
                        transmission:  './public/assets/textures/casaClim/casaClim_transmitionMap_1k.jpg'
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
                        main:   './public/assets/meshes/casaStolnicu/casaStolnicu_baked/casaStolnicu_groundFloor.glb',
                        meshes: 
                            [
                                './public/assets/meshes/casaStolnicu/casaStolnicu_baked/casaStolnicu_outterShell.glb',
                                './public/assets/meshes/casaStolnicu/casaStolnicu_baked/casaStolnicu_groundFloor.glb', 
                                './public/assets/meshes/casaStolnicu/casaStolnicu_baked/casaStolnicu_firstFloor.glb'
                            ],
                        textures:
                            {
                            diffuse: './public/assets/textures/casaStolnicu/casaStolnicu_diffuseMap_1k.jpg',
                            roughness: './public/assets/textures/casaStolnicu/casaStolnicu_roughnessMap_1k.jpg',
                            normal: './public/assets/textures/casaStolnicu/casaStolnicu_normalMap_1k.jpg',
                            transmission: './public/assets/textures/casaStolnicu/casaStolnicu_transmitionMap_1k.jpg'
                            }
                        },
                    str: {},
                    ins: {}
                    }
            ) 
} 

export {projects}