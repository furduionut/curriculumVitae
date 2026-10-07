import { Project } from "../constructors/constructors";

const projects = 
{
    casaBacau:  new Project(
                {
                    name: 'Bacau House',
                    type: 'Rezidențial',
                    style: 'Mediteranean',
                    about: `O locuință tradițională cu două niveluri, având acoperișuri în două ape care se intersectează, 
                    acoperite cu țiglă roșiatică în tonuri calde. Fațada în culori deschise prezintă o dispunere simetrică 
                    a ferestrelor și o intrare arcuită susținută de coloane, conferindu-i un caracter suburban clasic. 
                    Geometria îmbină volume rectangulare simple cu planuri de acoperiș stratificate, în timp ce paleta 
                    cromatică contrastează nuanțele blânde ale pereților cu tonul saturat al acoperișului.`
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
                    type: 'Rezidențial',
                    style: 'Modern/Contemporan',
                    about: `O casă modernă cu două niveluri, definită de volume rectangulare curate,
                    acoperiș plat și ferestre orizontale ample. Fațada combină beton gri deschis,
                    panouri din lemn cald și detalii metalice închise la culoare, creând un aspect
                    minimalist și clar, cu un contrast geometric puternic.`,
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
                        type: 'Rezidențial',
                        style: 'Eclectism',
                        about: `O locuință contemporană cu două niveluri, 
                        redată în 3D, definită de volume geometrice curate, 
                        un acoperiș și o fațadă în tonuri deschise, 
                        precum și ferestre rectangulare bine proporționate. 
                        Elevația principală include un gol amplu ce sugerează un garaj și o zonă de acces simplă, pavată. 
                        Volumele neutre din jur reprezintă clădirile vecine, evidențiind casa ca element arhitectural central.`
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