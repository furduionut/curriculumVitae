/* IMPORTS */
import * as THREE from "three";


const renders = (rendererWidth, rendererHeight, canvas) => {
    const render = new THREE.WebGLRenderer({antialias: true});
    render.setPixelRatio(window.devicePixelRatio);
    render.setSize(rendererWidth, rendererHeight);
    // render.autoClear = false;
    canvas.appendChild(render.domElement);
    return render
}

/* EXPORT */
    export { renders }

