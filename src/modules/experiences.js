import { Experience } from "../constructors/constructors"

const architecture = 
    {
        rezvinci: new Experience
        (
            {
            name:   'SC REZVINCI SRL',
            period: '2025-2026',
            type:   'Employment',
            role:   'Architect senior',
            about:  'x'
            },

            {
            projects: [],
            funds: 'Public funds'
            }
        ),

        architizer: new Experience
        (
            {
            name:   'SC ARCHITIZER SRL',
            period: '2023-2025',
            type:   'Self-employment',
            role:   'Architect & 3D Artist',
            about:  'x'
            },

            {
            projects: [],
            funds: 'Private funds',
            }
        ),

        pointarch: new Experience
        (
            {
            name:   'SC POINT-ARCHITECTS SRL',
            period: '2022-2023',
            type:   'Employment',
            role:   'Architect mid-level',
            about:  'x'
            },

            {
            projects: [],
            funds: 'Private funds'
            }
        ),

        grsglobal: new Experience(
            {
            name: 'SC GRS GLOBAL PROJECT SRL',
            period: '2021-2022',
            type: 'Employment',
            role: 'Architect mid-level',
            about:  'x'
            },
            
            {
            projects: [],
            funds: 'Private funds'
            }
        ),    

        dsign: new Experience(
            {
            name: 'SC 3DSIGN SRL',
            period: '2020-2021',
            type: 'Employment',
            role: 'Architect junior',
            about:  'x'
            },

            {
            projects: [],
            funds: 'Private funds',
            }   
        ), 

        dss: new Experience(
            {
            name: 'SC 3DSIGN SRL',
            period: '2019-2020',
            type: 'Employment',
            role: 'Architect intern',
            about:  'x'
            },

            {
            projects: [],
            funds: 'Private funds'
            }
        )
    }

const experiences = {architecture}

export {experiences}