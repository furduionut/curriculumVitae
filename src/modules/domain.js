
const domain = {
    /* ROOT */
    root    :        document.documentElement,

    /* PROJECTS */
    canvas  :        document.getElementById('canvas'),
    canvaso :        document.getElementById('canvaso'),
    viewport:        document.getElementById('viewport'),
    viewport2:       document.getElementById('viewport2'),
    upBtn   :        document.getElementById('upBtn'),
    nextBtn :        document.getElementById('nextBtn'),
    prevBtn :        document.getElementById('prevBtn'),
    downBtn :        document.getElementById('downBtn'),
    abouts  :        document.getElementById('description'),
    
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