var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var db = require('../data/db');

var auth = {

  /*
  * User Login
  */
  loginUser: function(req, res) {
    // Receive the post
    var username = req.body.username || '';
    var password = req.body.password || '';

    if (!username || !password)
      return res.status(401).json("Invalid credentials");

    // Check if the user exists
    req.maria.query('SELECT id, username, password FROM users WHERE username = ? AND locked = 0 AND active = 1',username, function(err, rows){
      if (err)
        return res.status(500).json(err);

      // If the query returns less than one result
      if (rows.length < 1)
        return res.status(401).json("Invalid credentials");

      //Let's check the password
      var resultado = bcrypt.compareSync(password, rows[0].password);
      if (!resultado)
        return res.status(401).json("Invalid credentials");

      // If it came here, the user exists and the password is ok, give the token
      //var dbUserObj = JSON.parse(JSON.stringify(rows[0]));
      //res.status(200).json(genToken(dbUserObj));

      //ToDo: insert user role
      res.status(200).json(genToken(rows[0].username));
    });
  },


  /*
  * Refresh Token
  */
  refreshToken: function(req, res) {

  },

  validate: function(username, req){
  //db from /data/db
  db.query('SELECT id, username, password FROM users WHERE username = ? AND locked = 0 AND active = 1',username, function(err, rows){
    if (err)
      return null;

    // If the query returns less than one result
    if (rows.length < 1)
      return null;

      //data.c = JSON.parse(JSON.stringify(rows[0]));
      //console.log("data.c: ",data.c);
      //return JSON.parse(JSON.stringify(rows[0]));
    //  console.log("retornei o callback: ",JSON.parse(JSON.stringify(rows[0])));
    //  callback(null,JSON.parse(JSON.stringify(rows[0])));
    });
    //console.log("data.c imp: ",data.c);
    return 'admin'; //bypass
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
