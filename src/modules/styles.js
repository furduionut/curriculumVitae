import { domain as dom } from "./domain.js";

const styles = {
color1: getComputedStyle(dom.root).getPropertyValue('--first-background-color').trim(),
color2: getComputedStyle(dom.root).getPropertyValue('--second-background-color').trim(),
color3: getComputedStyle(dom.root).getPropertyValue('--third-background-color').trim()
}


export { styles }