var vendors = require('../../vendors'),
  crypto = require('crypto');

exports.createStudent = function(req, res) {
  var params = req.body;

  params.password = crypto.createHash('md5').update(params.password).digest('hex');

  vendors.mysql.getConnection(function(err, connection) {
    var values = {
      name: params.name,
      external_id: params.external,
      typeid: 1,
      email: params.email,
      phonenumber: params.phone,
      password: params.password
    };
    connection.beginTransaction(function(err) {
      if (err) return res.json({ 'result': 'nok', 'message': err });
      connection.query('INSERT INTO user SET ?', values, function(error, results, fields) {
        if (error) return connection.rollback(function() {
          connection.release();
          res.status(500).json({ 'result': 'nok', 'message': error });
        });
        var obj = { userid: results.insertId, attributeid: 2, value: params.school };
        connection.query('INSERT INTO `userattribute` SET ?', obj, function(err) {
          if (err) return connection.rollback(function() {
            connection.release();
            res.status(500).json({ 'result': 'nok', 'message': err });
          });
          obj = { userid: results.insertId, attributeid: 1, value: params.course };
          connection.query('INSERT INTO `userattribute` SET ?', obj, function(err) {
            if (err) return connection.rollback(function() {
              connection.release();
              res.status(500).json({ 'result': 'nok', 'message': err });
            });
            obj = { userid: results.insertId, attributeid: 3, value: params.interests };
            connection.query('INSERT INTO `userattribute` SET ?', obj, function(err) {
              if (err) return connection.rollback(function() {
                connection.release();
                res.status(500).json({ 'result': 'nok', 'message': err });
              });
              connection.commit(function(err) {
                if (err) return connection.rollback(function() {
                  connection.release();
                  res.status(500).json({ 'result': 'nok', 'message': 'Error executing query' });
                });
                connection.release();
                res.status(200).json({ 'result': 'ok' });
              });
            });
          });
        });
      });
    });
  });
};

exports.createTeacher = function(req, res) {
  var params = req.body;

  if (req.user.isadmin === 0) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to access' });

  params.password = crypto.createHash('md5').update(params.password).digest('hex');

  vendors.mysql.getConnection(function(err, connection) {
    var values = {
      name: params.name,
      external_id: params.external,
      typeid: 2,
      email: params.email,
      phonenumber: params.phone,
      password: params.password,
      locked: 0,
      active: 1
    };
    connection.query('INSERT INTO user SET ?', values, function(error) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

exports.list = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {

    var query = connection.query('SELECT * FROM user', function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok', 'data': results });

    });
  });
};

exports.info = function(req, res) {
  var id = parseInt(req.params.id);
  vendors.mysql.getConnection(function(err, connection) {
      connection.query('SELECT user.*, `group`.id as groupid, `group`.desc as groupname, user.name FROM `group`,groupuser,user WHERE groupuser.groupid = `group`.id and groupuser.userid = user.id and groupuser.userid = ?', id, function(error, results, fields) {
        connection.release();
        if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
        if (results < 1) {
          res.status(404).json({ 'result': 'nok', 'message': 'User could not be found' });
        } else {
          delete results[0].typeid;
          delete results[0].password;
          res.status(200).json({ 'result': 'ok', 'data': results[0] });
        }
      });
    });
};

exports.update = function(req, res) {
  var params = req.body;

  params.password = crypto.createHash('md5').update(params.password).digest('hex');

  vendors.mysql.getConnection(function(err, connection) {
    var values = {
      name: params.name,
      email: params.email,
      phonenumber: params.phonenumber,
      password: params.password
    };

    connection.query('UPDATE user SET ? WHERE id = ?', [values, req.user.id], function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

exports.login = function(req, res) {
  res.status(200).json({ 'result': 'ok', 'data': req.user });
};

exports.approve = function(req, res) {
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('UPDATE user SET active = 1 WHERE id = ?', parseInt(req.params.id), function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

exports.chPassword = function(req, res) {
  var params = req.body;
  // check for null password
  if (!params.password){
    res.status(400).json({ 'result': 'nok', 'message': 'Invalid password' });
    return;
  }
  params.password = crypto.createHash('md5').update(params.password).digest('hex');

  vendors.mysql.getConnection(function(err, connection) {

    connection.query('SELECT password FROM user WHERE id = ? LIMIT 1',req.user.id, function(error, results, fields) {
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      // when old password == new password
      if (results[0].password == params.password) res.status(400).json({ 'result': 'nok', 'message': 'You already used this password' });

      connection.query('UPDATE user SET password = ? WHERE id = ?', [params.password, req.user.id], function(error, results, fields) {
        connection.release();
        if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
        res.status(200).json({ 'result': 'ok' });
      });
    });
  });
};

exports.pending = function(req, res) {
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM user WHERE active = 0', function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok', 'data': results });
    });
  });
};

exports.swLock = function(req, res) {
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT locked FROM user WHERE id = ?', parseInt(req.params.id), function(error, results, fields) {
      var sw = (results[0].locked) ? 0 : 1;
      connection.query('UPDATE user SET locked = ? WHERE id = ?', [sw, parseInt(req.params.id)], function(error, results, fields) {
        connection.release();
        if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
        res.status(200).json({ 'result': 'ok' });
      });
    });
  });

  exports.sendPhoto = function(req, res){



  };
};
