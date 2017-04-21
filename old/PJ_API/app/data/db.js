var logger = require('./log');
var mysql = require('mysql');
var pool  = mysql.createPool({
  //connectionLimit : 100,
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'projectary3'
});

pool.on('connection', function (connection) {
	logger.info("[Mysql]".cyan+" Database connected ...".green);
});

pool.on('acquire', function (connection) {
  logger.info("[Mysql]".cyan+" Connection %d acquired".yellow, connection.threadId);
});

pool.on('enqueue', function () {
  logger.info("[Mysql]".cyan+" Waiting for available connection slot".blue);
});

pool.on('release', function (connection) {
  logger.info("[Mysql]".cyan+" Connection %d released".magenta, connection.threadId);
});

module.exports = pool;
