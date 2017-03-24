var bcrypt = require('bcrypt');
const saltRounds = 13;

var users = {
  getAll: function(req, res) {
	
    },
 
  getOne: function (req, res) {
  	var db = req.db;
  	var id = req.params.id;
    var pool = req.maria;
	  pool.getConnection(function(err, connection) {
	    connection.query('SELECT * from users where idusrmongo='+connection.escape(id), function(err, rows, fields) {
		connection.release();
		  if (!err) res.json(rows);
		  else
			res.json({status:"NOK"});
		  });
	  
	});
	},
 
  create: function (req, res) {
	
	},
 
  update: function (req, res) {
	
	},

 //Not Working
 delete: function (req, res) {
	 
 },
};
 
module.exports = users;