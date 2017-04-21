var mysql = require('mysql');

var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '123qwe',
  database : 'projectary-master'
});

module.exports = {
  'mysql': pool
};
