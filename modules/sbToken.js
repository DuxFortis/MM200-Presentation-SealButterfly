const user = require("./user.js");
const crypto = require('crypto');
const secret = process.env.tokenSecret || require("../localenv").tokenSecret;

function createToken(user){

    var d = new Date();
    let dateNow = Date.now();
    // Add two weeks
    let validToDate = d.setDate(d.getDate() + 1);
    //console.log("now: " + dateNow + " validToDate: " + validToDate)
  
    let body = {"created":dateNow, "user":JSON.stringify(user), "validTo":validToDate}
    
    let token  = crypto.createHmac('sha512', secret) // Bruk annen algoritme 
                .update(JSON.stringify(body))
                .digest('hex');
  
    return token;
    
}

function validateToken(token, user){

    // omvendt av det som ligger i createToken?
    // er token info === user info
    // Er tokenet utløpt??

    let dtoken = crypto.privateDecrypt(secret, token);

    console.log(dtoken)

    var d = new Date();
    let dateNow = Date.now();
    // Add two weeks
    let validToDate = d.setDate(d.getDate() + 1);
    //console.log("now: " + dateNow + " validToDate: " + validToDate)
  
    //let body = {"created":dateNow, "user":JSON.stringify(user), "validTo":validToDate}
  
    //return token;
}


module.exports.create = createToken;
module.exports.validate = validateToken;
