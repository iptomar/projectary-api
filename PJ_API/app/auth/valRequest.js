var jwt = require('jwt-simple');
//var validateUser = require('../routes/auth').validateUser;
var validate = require('../routes/auth').validate;
module.exports = function(req, res, next) {
 
  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe. 
 
  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();
 
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['Authorization'];
 
  if (token) {
    try {
      var decoded = jwt.decode(token, require('./secret')());
 
      if (decoded.exp <= Date.now()) {
        res.status(400);
        res.json({
          "status": 400,
          "message": "Token Expired"
        });
        return;
      }
 
      // Authorize the user to see if s/he can access our resources
		var dbUser = validate(decoded.user.name, decoded.user.token);
  //    var dbUser = validateUser(decoded.user.name); // The key would be the logged in user's username
      if (dbUser) { 
        if ((req.url.indexOf('admin') >= 0 && dbUser.role == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/') >= 0)) {
		  next(); // To move to next middleware
        } else {
          res.status(403);
          res.json({
            "status": 403,
            "message": "Not Authorized"
          });
          return;
        }
      } else {
        // No user with this name exists, respond back with a 401
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid User"
        });
        return;
      }
 
    } catch (err) {
		console.log(err);
      res.status(401);
      res.json({
        "status": err,
        "message": "Invalid Token",
      });
    }
  } else {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Token not provided"
    });
    return;
  }
};