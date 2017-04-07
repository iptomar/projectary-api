var mysql = require('mysql');
var pool  = mysql.createPool({
  //connectionLimit : 100,
  host     : 'localhost',
  user     : 'root2',
  password : '',
  database : 'projectary'
});

pool.on('connection', function (connection) {
	console.log("Mysql".cyan+" database connected ...".green);
});

pool.on('acquire', function (connection) {
  console.log('Connection %d acquired'.yellow, connection.threadId);
});

pool.on('enqueue', function () {
  console.log('Waiting for available connection slot'.blue);
});

pool.on('release', function (connection) {
  console.log('Connection %d released'.magenta, connection.threadId);
});

module.exports = pool;
