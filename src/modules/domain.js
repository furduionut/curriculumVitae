
const domain = {
    /* ROOT */
    root    :        document.documentElement,

    /* PAGE */
    pageViewport:    document.getElementById('pageViewport'),
    pageCanvas:      document.getElementById('pageCanvas'),

    /* PROJECTS */
    canvas  :        document.getElementById('canvas'),
    viewport:        document.getElementById('viewport'),
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