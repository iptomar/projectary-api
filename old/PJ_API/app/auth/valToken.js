var jwt = require('jwt-simple');
var validate = require('../controllers/auth').validate;

module.exports = function(req, res, next) {

  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe.

  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();

  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'] || req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      error: 'Token not provided'
    });
  }


  try {
    var decoded = jwt.decode(token, require('./secret')());
    req.user = decoded.user;

    if (decoded.exp <= Date.now()) {
      return res.status(401).json({
        error: 'Token Expired'
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid Token'
    });
  }

};
