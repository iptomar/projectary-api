var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var auth = {
 
  login: function(req, res) {
 
    var username = req.body.username || '';
    var password = req.body.password || '';
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
 
    // Fire a query to your DB and check if the credentials are valid
    var dbUserObj = auth.validate(username, password, req);
    if (!dbUserObj) { // If authentication fails, we send a 401 back
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
 
    if (dbUserObj) {
 
      // If authentication is success, we will generate a token
      // and dispatch it to the client
 
      res.json(genToken(dbUserObj));
    }
 
  },
 //Bad Stuff
  validate: function(username, password, req) {	 
  var pool = req.dbm;
    pool.getConnection(function(err, connection) {
		connection.query('SELECT * from users where mail='+connection.escape(username)+' LIMIT 1', function(err, rows, fields) {
		connection.release();
		  if (!err)
		  {
			   bcrypt.compare(password, rows[0].hash, function(err, res) {
						if(res == true)	connection.vPassword = true;
						else connection.vPassword = false;;
			  }); 
		  } 
		  else {
					return null;
			  };
			  if(connection.vPassword==true)
			  connection.rows = JSON.parse(JSON.stringify(rows[0]));
		  else connection.rows=undefined;
		  });
		pool.c = connection.rows;
	});return pool.c;
  },
 
  validateUser: function(username, req) {
    var pool = req.dbm;
	pool.getConnection(function(err, connection) {
	    connection.query('SELECT * from users where email='+connection.escape(username)+' LIMIT 1', function(err, rows, fields) {
		connection.release();
		  if (!err) return JSON.stringify(rows);
		  else
			return null;
		  });
	  
	});
  },
}
 
// private method
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