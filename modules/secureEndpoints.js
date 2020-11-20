/*const express = require("express")
const authenticator = require("./auth");


let hemmelig = express.Router();
hemmelig.use(authenticator);


hemmelig.get("/", (req, res, next) => {

})

module.exports = hemmelig;*/

//fant ut at vi egentlig ikke trenger denne secureEndpoints.js, siden vi bruker auth.js og ikke /secure. Så vi kan slette denne?