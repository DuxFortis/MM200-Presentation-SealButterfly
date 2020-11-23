const database = require("./datahandler")
const crypto = require('crypto');
const secret = process.env.hashSecret || require("../localenv").hashSecret;
/*
const secret = 'abcdefg';
const hash = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');
*/
class User {
    constructor(username, password) {
        this.username = username;
        this.password = crypto.createHmac('sha256', secret)
            .update(password)
            .digest('hex');
        this.isValid = false;
        //this.email = null;
    }

    async create() {
        try {
            let resp = await database.insertUser(this.username, this.password);
            return resp;
        } catch (error) {
            console.error(error)
        }
    }

    async delete() {
        let success = false;
        try {
            let resp = await database.deleteUser(this.username, this.password);

            if (resp != null) {
                this.isValid = true;
                success = true;
                
            }
        } catch (err) {
            console.log(err);
        }
        return success;
    }
    

    async validate() {
        let success = false;
        try {
            let resp = await database.selectUser(this.username, this.password);

            if (resp != null) {
                this.isValid = true;
                success = true;
                // Her kan vi populere andre felter i user objektet
                // Eks this.email = resp.email (eller lignende)
            }
        } catch (err) {
            console.log(err);
        }
        return success;
    }

}

async update() {
    try {
        let resp = await database.updateUser(this.username, this.password);
        return resp;
    } catch (error) {
        console.error(error)
    }
}


module.exports = User