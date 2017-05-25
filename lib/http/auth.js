var basicAuth = require('basic-auth'),
  vendors = require('../../vendors'),
  crypto = require('crypto');

module.exports = function(req, res, next) {
  var login = basicAuth(req);

  if (!login || !login.name || !login.pass) return res.status(401).json({ 'result': 'nok', 'message': 'access denied' });

  vendors.mysql.getConnection(function(err, connection) {

    connection.query('SELECT user.*, type.desc as role FROM user JOIN type ON user.typeid = type.id WHERE email = ? AND active = 1 AND locked = 0', login.name, function(error, results, fields) {
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      connection.query('SELECT `group`.id, `group`.desc as name FROM `group` JOIN groupuser ON groupuser.groupid = `group`.id WHERE groupuser.userid = ?', login.name, function(error, results1, fields) {
        connection.release();

        if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

        if (results.length > 0) {
          if (results[0].password === crypto.createHash('md5').update(login.pass).digest('hex')) {

            if (results1[0]){
              results[0].groupid = results1[0].id;
              results[0].groupname = results1[0].name;
            }
            req.user = results[0];

            delete req.user.external_id;
            delete req.user.typeid;
            delete req.user.email;
            delete req.user.phonenumber;
            delete req.user.password;
            delete req.user.locked;
            delete req.user.active;
            return next();
          }
        }

        return res.status(401).json({ 'result': 'nok', 'message': 'access denied' });
      });
    });
  });
};
