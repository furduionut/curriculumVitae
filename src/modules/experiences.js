import { Experience } from "../constructors/constructors"

const architectData = {
    1: {
        years: '2026+',
        company: 'OAR',
        title: 'Obținerea dreptului de semnătură',
        items: []
    },
    2: {
        years: '2025 - 2026',
        company: 'REZ VINCI',
        title: 'Proiectare tehnică în toate fazele',
        items: [
            'Preliminar: documentații de urbanism',
            'Pregătitor: certificat de urbanism',
            'Conceptual: ilustrare și prezentare a temei',
            'Definitor: soluționare tehnică a conceptului',
            'Simplificat: documentații pentru autorizare',
            'Detaliat: proiect de execuție',
            'Prezentare: proiect de marketing'
        ]
    },
    3: {
        years: '2024-2025',
        company: 'ARCHITIZER',
        title: 'Consultanță și marketing',
        items: [
            'Analiza etapelor proiectului',
            'Consultanță de specialitate',
            'Modelare, texturare și animare',
            'Ilustrare stilizată în format video',
            'Creare conținut marketing'
        ]
    },
    4: {
        years: '2023-2024',
        company: 'MOBOTIQ SAS',
        title: 'Contractare și ofertare',
        items: [
            'Analiza și înțelegerea etapelor',
            'Elaborare contracte și anexe',
            'Realizarea ofertelor de preț',
            'Prezentare servicii',
            'Modelare, animare și export'
        ]
    },
    5: {
        years: '2022-2023',
        company: 'POINT ARCHITECTS',
        title: 'Organizare de proiect',
        items: [
            'Gestionarea timpilor în lucrul la distanță',
            'Înțelegerea etapelor de proiectare',
            'Evaluarea complexității proiectului',
            'Stabilirea tipului de lucrare',
            'Studiu de fezabilitate și prefezabilitate',
            'Proiect tehnic și detalii de execuție',
            'Listă de cantități și caiet de sarcini',
            'Proiectare BIM'
        ]
    },
    6: {
        years: '2021-2022',
        company: 'GRS GLOBAL PROJECT',
        title: 'Coordonare și colaborare',
        items: [
            'Discuții cu clientul pe concept',
            'Ilustrare și prezentare de proiect',
            'Elaborare temă de proiectare pentru specialități',
            'Documentație pentru lucrări de intervenție',
            'Proiect tehnic și autorizații de construire',
            'Proiect de mobilier și amenajare interioară',
            'Caiet de sarcini și stereotomii',
            'Extras de cantități, tabele și deviz general'
        ]
    },
    7: {
        years: '2020-2021',
        company: '3D SIGN CLASIC',
        title: 'Proiectare și verificare tehnică',
        items: [
            'Elaborare referate de verificare',
            'Analiza urbanistică și studiu fotografic',
            'Măsurători, relevee și studii de însorire',
            'Proiectare în fazele pregătitoare și concept',
            'Elaborare documentație urbanism (PUD) și (PUZ)',
            'Depunere documentație pentru CU',
            'Verificare tehnică a proiectelor',
            'Scheme și diagrame 2D'
        ]
    },
    8: {
        years: '2014-2020',
        company: 'DSS / FCI',
        title: 'Studii, concursuri și voluntariat',
        items: [
            'Finalizarea studiilor universitare',
            'Proiect de amenajare peisageră T13-T14',
            'Proiect de amenajare peisageră T4',
            'Voluntariat în domeniu'
        ]
    }
};

const programmerData = {
    1: {
        years: '2026 - 2027',
        company: 'PERSONAL PROJECT',
        title: 'Front‑End Development',
        items: [
            'Development of a responsive personal CV website',
            'Custom UI components and DOM-driven interactions',
            'Dynamic 3D website using Three.js',
            'GSAP timeline animations & ScrollTrigger integration',
            'Camera transitions and interactive 3D elements',
            'Modular JavaScript architecture and reusable components'
        ]
    },

    2: {
        years: '2025 - 2026',
        company: 'PRACTICE',
        title: 'Three.js Personal Exercises',
        items: [
            'Scene creation & camera manipulation',
            'Lighting, shadows & materials',
            'GLTF model loading & optimization',
            'Custom shader experiments',
            'Scroll-driven 3D interactions',
            'Performance tuning & debugging'
        ]
    },

    3: {
        years: '2023 - 2024',
        company: 'CERTIFICATIONS',
        title: 'Full‑Stack & Three.js Courses',
        items: [
            'Completed Mimo front-end & full-stack tracks',
            'Completed freeCodeCamp JavaScript & front-end libraries',
            'Earned certificates for full‑stack development',
            'Completed Bruno Simon’s Three.js Journey course',
            'Exercises on shaders, materials, camera controls',
            'Building interactive 3D components'
        ]
    }
};

const artistData = { 
    1: {
    years: '2023-2024',
    company: 'SC BIOLED SRL',
    title: 'Production 3D ilustration',
    items: [
        'Concept art & illustration',
        '3D modeling & texturing',
        'Animation & motion graphics',
        'Architectural visualization',
        'Creative direction'
    ]},
    2: {
        years: '2023 - 2024',
        company: 'MOBOTIQ SAS',
        title: '3D Asset Creation',
        items: [
            'Modeling of 3D assets used in the AUTONOM.ME digital platform',
            'PBR shading and texturing for realistic visual output',
            'Animation of interactive 3D elements for web integration',
            'Use of animation as a visual language to guide user interaction',
            'Consistent timing, easing and movement logic across all elements',
            'GLTF/GLB export and optimization for WebGL performance',
            'Shader-based effects and material refinement',
            'Collaboration with developers for UI/3D integration'
        ]
    }
}


const experiences = {
    architecture: architectData,
    programmer: programmerData,
    artist: artistData}

export {experiences}