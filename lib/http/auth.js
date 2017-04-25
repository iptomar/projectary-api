var basicAuth = require('basic-auth'),
  vendors = require('../../vendors'),
  crypto = require('crypto'),
  url = require('url');

module.exports = function(req, res, next) {
  var login = basicAuth(req);

  if (!login || !login.name || !login.pass) return res.status(401).json({ 'result': 'nok', 'message': 'access denied' });

  vendors.mysql.getConnection(function(err, connection) {

    var query = connection.query('SELECT * FROM user WHERE email = ?', login.name, function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      if (results.length > 0) {
        if (results[0].password === crypto.createHash('md5').update(login.pass).digest('hex')) {
          req.user = results[0];
          return next();
        }
      }

      return res.status(401).json({ 'result': 'nok', 'message': 'access denied' });

    });
  });

};
