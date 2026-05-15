const casaBacau = {
    name: "",
    period: "",
    location: "",
    models: {
        mainModel: "",
        sectionModel: []
    }
}

import {} from "./src/constructors/constructors.js"



const projects = [ 
    new Project(
        'casaBacau',
        'Bacau', 
        './public/assets/meshes/casaBacau/casaBacau_OUTTER-SHELL.glb',
        ['./public/assets/meshes/casaBacau/casaBacau_OUTTER-SHELL.glb',
        './public/assets/meshes/casaBacau/casaBacau_2ND-FLOOR.glb',
        './public/assets/meshes/casaBacau/casaBacau_1ST-FLOOR.glb',
        './public/assets/meshes/casaBacau/casaBacau_BASEMENT.glb']
    ),

    new Project(
        'casaClim', 
        'Botosani', 
        './public/assets/meshes/casaClim/casaClim_OUTTER-SHELL.glb', 
        ['./public/assets/meshes/casaClim/casaClim_OUTTER-SHELL.glb',
        './public/assets/meshes/casaClim/casaClim_2ND-FLOOR.glb',
        './public/assets/meshes/casaClim/casaClim_1ST-FLOOR.glb']
    ),

    new Project('casaStolnicu',
        'Botosani',
        './public/assets/meshes/casaStolnicu/casaStolnicu_OUTTER-SHELL.glb',
        ['./public/assets/meshes/casaStolnicu/casaStolnicu_OUTTER-SHELL.glb',
        './public/assets/meshes/casaStolnicu/casaStolnicu_2ND-FLOOR.glb',
        './public/assets/meshes/casaStolnicu/casaStolnicu_1ST-FLOOR.glb'])
    ];
