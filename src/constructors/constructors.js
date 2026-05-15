class Project{
    constructor(name, location, mainModel, auxModels, description){

        if(!Array.isArray(auxModels)){ throw new TypeError('auxModels should be an array')};

        this.name = name;
        this.location = location;
        this.mainModel = mainModel;
        this.auxModels = auxModels;
        this.description = description; 
    }
}

class Ability{
    constructor(name, chapters, proficiency,){
        this.name = name;
        this.proficiency = proficiency;
        this.chapters = chapters;
    }
}

class Experience{
    constructor(name, period, description, roles, projects, skills){
        this.name = name;
        this.period = period;
        this.description = description;
        this.roles = roles;
        this.projects = projects;
        this.skills = skills;
    }
}