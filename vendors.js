var mysql = require('mysql');

var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '123qwe',
  database : 'projectary-master',
  multipleStatements: true
});

module.exports = {
  'mysql': pool
};
