var mysql = require('mysql');

var pool  = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'projectary-master'
});

module.exports = {
  'mysql': pool
};
