const database = require('./datahandler');
const validateToken = require("./sbToken").validate;

const authenticator = async (req, res, next) => {
    if(!req.body.authToken || !req.body.user){
      return res.status(403).json("invalid token").end();
    }
    
    let user = {
        username: req.body.user,
        //password: '6179f1da72b2f5c466c25652eff2ebf46bca54c4a4d43ccc0ba120f8e56ddc92',
        isValid: true
      }

      let token = {"authToken": req.body.authToken}
    
    let resp = validateToken(token, user);
    console.log(resp)
    if (!resp) {
        return res.status(403).json("token invalid").end();
    }
    next();
}


module.exports = authenticator