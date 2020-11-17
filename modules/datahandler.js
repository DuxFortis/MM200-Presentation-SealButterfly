const pg = require("pg");
const dbCredentials = process.env.DATABASE_URL || require("../localenv").credentials;

class StorageHandler {

    constructor(credentials) {
        this.credentials = {
            connectionString: credentials,
            ssl: {
                rejectUnauthorized: false
            }
        };
    }

    //  create new user

    async insertUser(username, password) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('SELECT username from "users" where username=$1', [username]);
            const nameCheck = results.rows.find(element => element = username);
            
            if(nameCheck !== undefined){
                results = null;
                client.end();
            }else{
                results = await client.query('INSERT INTO "public"."users"("username", "password") VALUES($1, $2) RETURNING *;', [username, password]);
                results = results.rows[0].message;
                client.end();
            }
        } catch (err) {
            console.log(err);
            results = err;
            client.end();
        }

        return results;
    }

    //  login user

    async selectUser(username, password){
        const client = new pg.Client(this.credentials);
        let results = null;
        try{
            await client.connect();
            results = await client.query('SELECT * FROM "public"."users" WHERE username=$1 AND password=$2', [username, password]);
            results = (results.rows.length > 0) ? results.rows[0]:null;
            client.end();
        }catch(err){
            console.log(err);
        }

        return results;        
    }

    // create presentation

    async insertPres(name, theme, owner, isPublic) {

        const client = new pg.Client(this.credentials);
        let results = null;

        let slides = {
            "Slide1": {"title": "", "image": "", "imageText": "", "list": ""},
           }

        try {
            await client.connect();
            results = await client.query('INSERT INTO "public"."presentations"("name","slides","owner","theme","isPublic") VALUES($1,$2 , $3, $4, $5) RETURNING *;', [name, slides,owner,theme,isPublic]);
            results = results.rows[0];
            client.end();
        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }

        return results;

    }

    async getPresData(owner, isPublic){

        const client = new pg.Client(this.credentials);
        let results = null;

        try {
            await client.connect();
            results = await client.query('SELECT * FROM "public"."presentations" WHERE owner=$1 AND ispublic=$2', [owner, isPublic]);
            results = results.rows;
            client.end();
        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }

        return results;

    }

    async insertSlide(presentationId, template, owner) {

        const client = new pg.Client(this.credentials);
        let results = null;

        try {
            await client.connect();
            results = await client.query('SELECT slides FROM "public"."presentations" WHERE owner=$1 AND id=$2', [owner, presentationId]);

            const presentationCheck = results.rows;
            if(presentationCheck.length === 0){
                results = null;
                client.end()
            }else{

            const userSlides = results.rows[0].slides;
            const slidesAmount = Object.entries(userSlides);
            const newSlide = "Slide" + parseInt(slidesAmount.length + 1);
            userSlides[newSlide] = {"title": "", "image": "", "imageText": "", "list": ""};

            results = await client.query('UPDATE presentations SET slides=$2 WHERE id=$1 AND owner=$3', [presentationId, userSlides, owner]);
            results = await client.query('SELECT slides FROM "public"."presentations" WHERE owner=$1 AND id=$2', [owner, presentationId]);
            results = results.rows[0].slides;
            client.end();
            }
        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }

        return results;

    }

    async getPresentation(owner, id) {

        const client = new pg.Client(this.credentials);
        let results = null;

        try {
            await client.connect();
            results = await client.query('SELECT * FROM "public"."presentations" WHERE owner=$1 AND id=$2', [owner, id]);
            results = results.rows;
            client.end();
        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }

        return results;

    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
    /*async insert(...params) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('INSERT INTO "public"."$1"("username", "password") VALUES($2, $3) RETURNING *;', params);
            results = results.rows[0].message;
            client.end();
        } catch (err) {
            client.end();
            results = err;
        }
        return results;
    }*/


}

module.exports = new StorageHandler(dbCredentials);