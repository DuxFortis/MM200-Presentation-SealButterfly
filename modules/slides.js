const database = require("./datahandler");

class Slides {

    constructor(presentationId, slideNr, template, owner){
        this.presentationId = presentationId;
        this.slideNr = slideNr;
        this.template = template;
        this.owner = owner;
    }

    async create() {
        try {
            let resp = await database.insertSlide(this.presentationId, this.slideNr, this.template, this.owner);
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
            let resp = await database.updateSlide(this.name);
            return resp;
        }catch(err){
            console.log(err);
        }
    }

    async delete(){
        try{
            let resp = await database.deleteSlide(this.name);
            return resp;
        }catch(err){
            console.log(err);
        }
    }

}


module.exports = Slides;