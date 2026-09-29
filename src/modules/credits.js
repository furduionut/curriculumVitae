import { Credit } from "../constructors/constructors"

const people = 
    {
    parents: new Credit(
        {name:      'Parents'},
        {support:   'All of it'}
    )
    };

const organisations = 
    {
    blender: new Credit(
        {name:      'Blender Organisation'},
        {support:   'Blender 4.5 - 5.3'}
        ),
    
    vsCodium: new Credit(
        {name: 'SignPath Foundation'},
        {support: 'vsCodium'}

    ),

    ubuntu: new Credit(
        {name: 'Canonical Ltd'},
        {support: 'ubuntu 24-26'}
    )
    }

const credits = {people, organisations}

const PLP = [];
const SOFT = [];
const ORG = [];

export {PLP, SOFT, ORG, credits}