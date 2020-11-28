const validateToken = require("./sbToken").validate;

const authenticator = async (req, res, next) => {
  if (!req.body.authToken || !req.body.user) {
    return res.status(403).json("invalid token").end();
  }

  let user = {
    username: req.body.user,
    isValid: true
  }

  let token = { "authToken": req.body.authToken }

  let resp = validateToken(token, user);

  if (!resp) {
    return res.status(403).json("token invalid").end();
  }
  next();
}


module.exports = authenticator