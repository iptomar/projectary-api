var validator = require('validator'),
    bcrypt = require('bcrypt'),
    salt = require('../data/salt'),
    logger = require('../data/log');   // logs


var teacher = {

  /* POST: http://127.0.0.1/api/teacher
   * Create a teacher
   * @username -> username
   * @password -> password
   * @email    -> email
   */
  createTeacher: function(req, res) {
    var db = req.maria;
  	var username = req.body.username;
  	var password = req.body.password;
  	var email = ((validator.isEmail(req.body.email)) ? req.body.email : null);

    if(!username||!password||!email)
  	{
  		res.json({status:"NOK", error:"Please provide all fields"});
  	}else {
      bcrypt.hash(password, salt, function(err, hash) {
        if(err)
          res.json({status:"NOK", error:"Error hashing password"});

        db.getConnection(function(err, c) {
    		  c.query('CALL InsertNewUser(?,?,?,2,'')', username, hash, email, function(err,rows){
    			  c.release();
            if(err){
              res.json({status:"NOK", error:"Error executing query"});
            } else {
              res.json({status:"OK"});
            }
          });
        });
      });
    }

  },

  /* PUT: http://127.0.0.1/api/teacher
   *
   */
  updateTeacher: function (req, res) {

	},
};

module.exports = teacher;
