var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var db = require('../data/db');

var auth = {
  /*
  * User Login
  */
  loginUser: function(req, res) {
    // Receive the data that is on body
    var username = req.body.username || '';
    var password = req.body.password || '';
    if (!username || !password)
	{
	  res.status(401).json({error:"Invalid credentials"});
      return;
	}

	// Fire a query to your DB and check if the credentials are valid
    var dbUserObj = auth.validate(username, password, req);
    if (!dbUserObj) { 
		// If authentication fails, we send a 401 back
		res.status(401).json({error:"Invalid credentials"});
      return;
	}else {
		res.json(genToken(dbUserObj));
	}
  },


  /*
  * Refresh Token
  */
  refreshToken: function(req, res) {
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'] || req.headers['authorization'];
	if (token) {
    try {
      var decoded = jwt.decode(token, require('../auth/secret')());
	  //more validation need
		  if(!decoded.user.name || !decoded.user.token || !decoded.exp)
		  {
			res.status(401).json({error: 'Invalid Token'});  
		  }else {
			  if (decoded.exp <= Date.now()) {
				res.status(401).json({error: 'Token Expired'});
			  }else {
				  var dbUser = auth.validate(decoded.user.name, decoded.user.token, req);
				  if (!dbUser) { // If authentication fails, we send a 401 back
					console.log("[Renewing Token]: Attack attempt detected!".red);
					res.status(401).json({error: "Attack attempt detected!"});
				  }else {
					  res.json(genToken(dbUser));	  
				  }
			  }
			}
		}catch (err) {
		  res.status(401).json({error: 'Invalid Token'});
		}
	}
  },

  //TODO:
  validate: function(username, password, req){
		var db = req.maria;
			db.getConnection(function(err, connection) {
			  // Use the connection
			  connection.query('SELECT 1+1', function (error, results, fields) {
				// And done with the connection.
				connection.release();

				// Handle error after the release.
				if (error) throw error;

				// Don't use the connection here, it has been returned to the pool.
			  });
		});
		//Bypass hack
		return { "name": "123","token": "99999"};
  },

}

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
