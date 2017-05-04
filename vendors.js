var mysql = require('mysql');

var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'projectary-master'
});

module.exports = {
  'mysql': pool
};
