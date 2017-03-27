var jwt = require('jwt-simple');
var validate = require('../controllers/auth').validate;

module.exports = function(req, res, next) {

  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe.

  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();
  
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'] || req.headers['authorization'];

  if (token) {
    try {
      var decoded = jwt.decode(token, require('./secret')());

      if (decoded.exp <= Date.now()) {
        res.status(401).json({error: 'Token Expired'});
        return;
      }

      // Authorize the user to see if s/he can access our resources
	  //TODO:
	  var dbUser = validate(decoded.user.name, decoded.user.token, req);
      if (dbUser) {
		if((req.url.indexOf('/api/') <= 0)){
				console.log(dbUser);
				next();
		}else if ((req.url.indexOf('admin') >= 0 && dbUser.name == '123') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/') >= 0)) {
		        next(); // To move to next middleware
        }
		else {
          res.status(403).json({error: 'Not Authorized'});
          return;
        }
      } else {
        // No user with this name exists, respond back with a 401
        res.status(401).json({error: 'Invalid User'});
        return;
      }

    } catch (err) {
      res.status(401).json({error: 'Invalid Token'});
    }
  } else {
    res.status(401).json({error: 'Token not provided'});
    return;
  }
};
