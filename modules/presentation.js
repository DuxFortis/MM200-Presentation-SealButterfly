const database = require("./datahandler");

class Presentation {

    constructor(name, theme, owner, isPublic, id){
        this.name = name;
        this.theme = theme;
        this.owner = owner;
        this.isPublic = isPublic;
        this.id = id;
    }

    async create() {
        try {
            let resp = await database.insertPres(this.name, this.theme, this.owner, this.isPublic);
            return resp;
        } catch (error) {
            console.error(error)
        }
    }

    async getPresentation() {
        try {
            let resp = await database.getPresentation(this.owner, this.id);
            return resp;
        } catch (error) {
            console.error(error)
        }
    }

    async update(){
        try{
            let resp = await database.updatePres(this.name);
            return resp;
        }catch(err){
            console.log(err);
        }
    }

    async delete(){
        try{
            let resp = await database.deletePres(this.name);
            return resp;
        }catch(err){
            console.log(err);
        }
    }

}


module.exports = Presentation;