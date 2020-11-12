const database = require('./datahandler');
const user = require('./user');
const validateToken = require("./sbToken").validate;

const authenticator = async (req, res, next) => {
    //console.log(req);
    let user = {
        username: 'test',
        password: '6179f1da72b2f5c466c25652eff2ebf46bca54c4a4d43ccc0ba120f8e56ddc92',
        isValid: true
      }
    let token = {
        authToken: '06b63eacf39c1b33de4285ad4f7f4023.452d6920162868f1bda82782de7e03b209aa966420182e25210f3d599a634110c53f09015f19622677ce0c34cbc729e73e2d41d33ee730cbd75d4a68155cf7c591e25fadc9b6e5007c43caf20dce9d0aff9a648d7b25d3a234edfed0be33229c172d144f7d5fb8cef957f88cafdc29f67992de0a4e93ca5bf69794f3a56178915cf262a0599647d523f396dbe1aa2b515c567c4d1abe45c04e218ed1b37ae49a0b17914a445693e3e21662be03e7b71122e5fb0303'
      }
      token = {
        authToken: '06b63eacf39c1b33de4285ad4f7f4023.452d6920162868f1bda82782de7e03b209aa966420182e25210f3d599a634110c53f09015f19622677ce0c34cbc729e73e2d41d33ee730cbd75d4a68155cf7c591e25fadc9b6e5007c43caf20dce9d0aff9a648d7b25d3a234edfed0be33229c172d144f7d5fb8cef957f88cafdc29f67992de0a4e93ca5bf69794f3a56178915cf262a0599647d523f396dbe1aa2b515c567c4d1abe45c04e218ed1b37ae49a0b17914a445693e3e21662be03e7b71122e5fb0303'
      }
    let resp = validateToken(token, user);
    if (!resp) {
        return res.status(403).json("token invalid").end();
    }
    /*if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.append("WWW-Authenticate", 'Basic realm="User Visible Realm", charset="UTF-8"').status(401).end();
    }

    const credentials = req.headers.authorization.split(' ')[1];
    const [username, password] = Buffer.from(credentials, 'base64').toString('UTF-8').split(":");

    const user = await authenticate(username, password);
    if (!user.isValid) {
        return res.status(403).end();
    }*/
    next();
}

async function authenticate(username, password) {
    
    const loginUser = new user(username, password);

    const resp = await loginUser.login();
    console.log(resp);
    //console.log(resp); // true/false
    return resp;
}


module.exports = authenticator