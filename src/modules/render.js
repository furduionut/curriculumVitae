/* IMPORTS */
import * as THREE from "three";
import { domain } from "./domain.js";

let dom                 = domain;


const renders = (rendererWidth, rendererHeight, canvas) => {
    const render = new THREE.WebGLRenderer({antialias: true});
    render.setPixelRatio(window.devicePixelRatio);
    render.setSize(rendererWidth, rendererHeight);
    canvas.appendChild(render.domElement);
    return render
}


/* EXPORT */
    export { renders }

