var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var db = require('../data/db');
var async = require('async')
var auth = {
  /*
   * User Login
   */
  loginUser: function(req, res) {
    // Receive the data that is on body
    var username = req.body.username || '';
    var password = req.body.password || '';
    if (!username || !password) {
     return res.status(401).json({ error: "Invalid credentials"});
    }

    // Fire a query to your DB and check if the credentials are valid
    auth.validate(username, password, req, function(results) {
    	if (!results)
    		return res.status(401).json({
    			error: "Invalid credentials"
    		});
    		res.json(genToken(results));
    });
  },

  /*
   * Refresh Token
   */
  refreshToken: function(req, res) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'] || req.headers.authorization;
    if (token) {
      try {
        var decoded = jwt.decode(token, require('../auth/secret')());
        //more validation need
        if (!decoded.user.name || !decoded.user.token || !decoded.exp) {
          res.status(401).json({
            error: 'Invalid Token'
          });
        } else {
          if (decoded.exp <= Date.now()) {
            res.status(401).json({
              error: 'Token Expired'
            });
          } else {
            auth.validate(decoded.user.name, decoded.user.token, req, function(results){
			if(!results) return res.status(401).json({error:"Invalid User"});
				res.json(genToken(results));
			});
          }
        }
      } catch (err) {
        res.status(401).json({
          error: 'Invalid Token'
        });
      }
    }
  },

  //TODO:
	validate: function(username, password, req, mcallback){
		var db = req.maria;
		
		async.waterfall([
		  function(callback) {
			db.getConnection(function(err, connection) {
			  connection.query('SELECT id, username, password FROM users WHERE username = ? AND locked = 0 AND active = 1',username, function(err, rows, fields) {
				if (err){
				  callback("Sql error");
				}
				connection.release();
				callback(err, rows);
			  });
			});
		}
		], function(err, result) {
		  if (err || !result) return res.json({status:"NOK", error:"Invalid data"});
		  console.log("result: ",result);
		  return mcallback(result);
		});
	
	},
};

// Private methods
function genToken(user) {
  var expires = expiresIn(1); // 1 day
  var token = jwt.encode({
    exp: expires,
    user: user
  }, require('../auth/secret')());

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
