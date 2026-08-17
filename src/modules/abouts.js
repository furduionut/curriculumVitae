import { projects }     from "./projects.js";
import { abilities }    from "./abilities.js";

const names     = Object.values(projects).map(o => o.identifier.name);
const abouts    = Object.values(projects).map(o => o.identifier.about);
const types     = Object.values(projects).map(o => o.identifier.type);
const styles    = Object.values(projects).map(o => o.identifier.style);

const informations = {
    names:  names,
    abouts: abouts,
    types:  types,
    styles: styles
}


console.log(informations);

export { informations }