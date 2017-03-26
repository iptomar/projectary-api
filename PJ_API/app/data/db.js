var mysql = require('mysql');

var pool  = mysql.createPool({
  //connectionLimit : 100,
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'projectary2'
});

pool.on('connection', function (connection) {
	console.log("Mysql".cyan+" database connected ...".green);
});

module.exports = pool;
