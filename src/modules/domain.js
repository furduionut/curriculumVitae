import { bitNot } from "three/tsl"

const domain = {
    /* ROOT */
    root    :        document.documentElement,

    /* PROJECTS */
    aboutMe :        document.getElementById('aboutMe'),
    canvas  :        document.getElementById('canvas'),
    canvaso :        document.getElementById('canvaso'),
    viewport:        document.getElementById('viewport'),
    viewport2:       document.getElementById('viewport2'),
    upBtn   :        document.getElementById('upBtn'),
    nextBtn :        document.getElementById('nextBtn'),
    prevBtn :        document.getElementById('prevBtn'),
    stageBtn :       document.getElementById('stageBtn'),
    downBtn :        document.getElementById('downBtn'),
    abouts  :        document.getElementById('description'),
    btn     :        document.getElementById('btn'),
    experience:      document.getElementById('experience-6'),
    artistBtn:       document.getElementById('artistBtn'),
    architectBtn:    document.getElementById('architectBtn'),
    programmerBtn:   document.getElementById('programmerBtn'),
    experiencesBtn:  document.getElementById('experiences'),
    infoBar:        document.getElementById('infoBar'),
    
    /* ABILITIES */
    abilitiesBtn:    document.querySelectorAll('#abilityBtn'),
    hardLeveling:    document.getElementById('hard-leveling'),
    softLeveling:    document.getElementById('soft-leveling'),

    /* SKILLS */
    skill:           document.createElement('div'),
    symbol:          document.createElement('div'),
    bar:             document.createElement ('div')
}

export { domain }