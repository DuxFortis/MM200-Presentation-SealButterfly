const database = require("./datahandler");

class Presentation {

    constructor(name, theme, owner){
        this.name = name;
        this.theme = theme;
        this.owner = owner;
    }

    async create() {
        try {
            let respons = await database.insertPres(this.name, this.theme, this.owner);
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