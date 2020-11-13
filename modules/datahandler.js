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
        let resp = null;
        try{
            await client.connect();
            let results = await client.query('SELECT * FROM "public"."users" WHERE username=$1 AND password=$2', [username, password]);
            resp = (results.rows.length > 0) ? results.rows[0]:null;
            client.end();
        }catch(err){
            console.log(err);
        }

        return resp;        
    }

    // create presentation

    async insertPres(name, theme, owner) {

        const client = new pg.Client(this.credentials);
        let results = null;

        try {
            await client.connect();
            results = await client.query('INSERT INTO "public"."presentations"("name","owner","theme") VALUES($1, $2, $3) RETURNING *;', [name, owner,theme]);
            results = results.rows[0].message;
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
