/* IMPORTS */
import * as THREE from "three";

const renders = (rendererWidth, rendererHeight, canvas) => {
    const render = new THREE.WebGLRenderer({antialias: true});
    render.setPixelRatio(window.devicePixelRatio);
    render.setSize(rendererWidth, rendererHeight);
    canvas.appendChild(render.domElement);
    return render
}

const rendero = (rendererWidth, rendererHeight, canvaso) => {
    const rendero = new THREE.WebGLRenderer({antialias: true, alpha: true});
    rendero.setPixelRatio(window.devicePixelRatio);
    rendero.setSize(rendererWidth, rendererHeight);
    rendero.setClearColor(0x000000, 0);
    canvaso.appendChild(rendero.domElement);
    return rendero
}

/* EXPORT */
    export { renders, rendero }

