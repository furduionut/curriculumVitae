class Personal{    
    constructor(identifier, contacts){
    this.identifier = identifier;
    this.contacts = contacts;
    }
}

class Project{
    constructor(identifier, geometries){
        this.identifier = identifier;
        this.geometries = geometries;
    }
}

class Experience{
    constructor(identifier, experience){
        this.identifier = identifier;
        this.experience = experience;
    }
}
class Ability{
    constructor(identifier, abilities){
        this.identifier = identifier;
        this.abilities  = abilities;
    }
}

class Credit{
    constructor(identifier, credit){
        this.identifier = identifier;
        this.credit = credit;
    }
}

export {Personal, Project, Experience, Ability, Credit}