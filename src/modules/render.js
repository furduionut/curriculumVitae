/* IMPORTS */
import * as THREE from "three";
import { domain } from "./domain.js";

let dom                 = domain;

const renders = (rendererWidth, rendererHeight, canvas) => {
    const render = new THREE.WebGLRenderer({antialias: true});
    render.setPixelRatio(window.devicePixelRatio);
    render.setSize(rendererWidth, rendererHeight);
    // render.autoClear = false;
    canvas.appendChild(render.domElement);
    return render
}

const renderer = renders(
    dom.viewport.clientWidth, 
    dom.viewport.clientHeight, 
    dom.canvas);


const pmremGenerator  = new THREE.PMREMGenerator(renderer);

/* EXPORT */
    export { renders, renderer, pmremGenerator}

