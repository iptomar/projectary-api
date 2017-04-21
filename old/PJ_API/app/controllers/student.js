var bcrypt = require('bcrypt');
var salt = require('../data/salt');

var student = {
	
/* POST: http://127.0.0.1/api/student
*
*/
createStudent: function(req, res) {
	var db = req.maria;
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var usernumber = req.body.usernumber;
	if(!username||!password||!email||!usernumber)
	{
		res.json({status:"NOK", error:"Please provide all fields"}); 
	}else {
	bcrypt.hash(password, salt, function(err, hash) {
		db.getConnection(function(err, c) {
		  c.query('CALL InsertNewUser('+c.escape(username)+','+c.escape(hash)+','+c.escape(email)+','+c.escape(1)+','+c.escape(usernumber)+')',function(err,rows){
			  c.release();
			  if(err)
			  { 
				res.json({status:"NOK", error:"Error executing query"}); 
				console.log(err);
			  }else{
				res.json({status:"OK"});   
			  }
		  })
		})
	  });	
	}
},

/* GET: http://127.0.0.1/api/student
*
*/
getStudentsLst: function (req, res) {
var db = req.maria;

	
},

/* PUT: http://127.0.0.1/api/student
*
*/
updateStudent: function (req, res) {

},

/* GET: http://127.0.0.1/api/student/:id
*
*/
getStudent: function (req, res) {

},

/* POST: http://127.0.0.1/api/student/:id/approve
*
*/
approveStudent: function (req, res) {

},

};
module.exports = student;
