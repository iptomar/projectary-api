var jwt = require('jwt-simple');
var validate = require('../controllers/auth').validate;

module.exports = function(req, res, next) {
  // Authorize the user to see if s/he can access our resources
  //TODO:

  validate(req.user.name, req.user.token, req, function(err, dbUser) {
    if (!dbUser || err) {
      return res.status(401).json({
        error: 'Invalid User'
      });
    }


    if ((req.url.indexOf('/api/') <= 0)) {
      console.log(dbUser);
      next();
    } else if ((req.url.indexOf('admin') >= 0 && dbUser.name == '123') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/') >= 0)) {
      next(); // To move to next middleware
    } else {
      return res.status(403).json({
        error: 'Not Authorized'
      });
    }
  });

};
