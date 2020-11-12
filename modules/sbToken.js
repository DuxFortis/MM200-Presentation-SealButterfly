const user = require("./user.js");
const crypto = require('crypto');
const secret = process.env.tokenSecret || require("../localenv").tokenSecret;

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);
let d = new Date();
const dateNow = Date.now();
// Add two weeks
const validToDate = d.setDate(d.getDate() + 1);

function createToken(user){
    
    //console.log("now: " + dateNow + " validToDate: " + validToDate)
  
    let body = {"created":dateNow, "user":JSON.stringify(user), "validTo":validToDate};
    
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(JSON.stringify(body));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    let ivString = iv.toString("hex");
    let encryptedDataString = encrypted.toString('hex');

    let token = {"authToken":`${ivString}.${encryptedDataString}`};
    console.log(token)
    return token;
    
}

function validateToken(token, user){

    const splitToken = token.authToken.split(".");
    
    let tIV = splitToken[0];
    let tEncryptedData = splitToken[1];


    let iv = Buffer.from(tIV, 'hex');
    let encryptedToken = Buffer.from(tEncryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedToken);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    let tokenText = decrypted.toString();
    console.log(tokenText);

        
    return "";

    // omvendt av det som ligger i createToken?
    // er token info === user info
    // Er tokenet utløpt??
  
    //return token;
}


module.exports.create = createToken;
module.exports.validate = validateToken;
