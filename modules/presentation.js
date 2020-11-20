const database = require("./datahandler");

class Presentation {

    constructor(name, theme, descr, owner, isPublic, id) {
        this.name = name;
        this.theme = theme;
        this.descr = descr;
        this.owner = owner;
        this.isPublic = isPublic;
        this.id = id;
    }

    async create() {
        try {
            let resp = await database.insertPres(this.name, this.theme, this.descr, this.owner, this.isPublic);
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

}

async function getPresData(owner, isPublic) {
    try {
        let resp = await database.getPresData(owner, isPublic);
        return resp;
    } catch (err) {
        console.log(err);
    }
}

async function getAllPres() {
    try {
        let resp = await database.getAllPres();
        return resp;
    } catch (err) {
        console.log(err);
    }
}

async function updatePres(presentation, owner) {
    try {
        let resp = await database.updatePres(presentation, owner);
        return resp;
    } catch (err) {
        console.log(err);
    }
}

async function deletePres(presentation, owner) {
    try {
        let resp = await database.deletePres(presentation, owner);
        return resp;
    } catch (err) {
        console.log(err);
    }
}

async function deleteSlides(presentation, slide, owner) {
    try {

        const presentationId = presentation.id;
        let slides = presentation.slides;
        let updatedSlides = {};

        let totalSlides = Object.entries(slides);

        delete slides["Slide" + slide]

        let num = 1;
        for (let i = 1; i <= totalSlides.length; i++) {

            if (slides["Slide" + i] !== undefined) {

                updatedSlides["Slide" + num] = slides["Slide" + i];
                num++;

            }


        }




        let resp = await database.deleteSlides(presentationId, updatedSlides, owner);
        return resp;
    } catch (err) {
        console.log(err);
    }
}


module.exports = Presentation;
module.exports.getPresData = getPresData;
module.exports.getAllPres = getAllPres;
module.exports.updatePres = updatePres;
module.exports.deletePres = deletePres;
module.exports.deleteSlides = deleteSlides;