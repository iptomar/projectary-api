var vendors = require('../../vendors'),
  crypto = require('crypto');

exports.create = function(req, res) {
  var params = req.body;

  params.password = crypto.createHash('md5').update(params.password).digest('hex');
  vendors.mysql.getConnection(function(err, connection) {
    var values = {
      desc: params.desc,
      password: params.password
    };
    connection.beginTransaction(function(err) {
      if (err) return res.json({ 'result': 'nok', 'message': err });
      connection.query('INSERT INTO `group` SET ?', values, function(error, results, fields) {
        if (error) return connection.rollback(function() {
          connection.release();
          res.status(500).json({ 'result': 'nok', 'message': error });
        });
        var obj = { groupid: results.insertId, userid: req.user.id };
        connection.query('INSERT INTO `groupuser` SET ?', obj, function(err) {
          if (err) return connection.rollback(function() {
            connection.release();
            res.status(500).json({ 'result': 'nok', 'message': err });
          });
          connection.commit(function(err) {
            if (err) return connection.rollback(function() {
              connection.release();
              res.json({ status: "NOK", error: "Error executing query" });
            });
            connection.release();
            res.status(200).json({ 'result': 'ok' });
          });
        });
      });
    });
  });
};

exports.join = function(req, res) {
  var params = req.body;
  params.password = crypto.createHash('md5').update(params.password).digest('hex');

  vendors.mysql.getConnection(function(err, connection) {
	connection.query('SELECT * from `group` where `desc` = ? LIMIT 1', params.desc, function(error, results, fields) {
		if (error) {connection.release(); return res.status(500).json({ 'result': 'nok', 'message': error }); }

      if (results[0].password != params.password) { connection.release(); return res.status(500).json({ 'result': 'nok', 'message': "Invalid password" }); }
      var values = {
        groupid: results[0].id,
        userid: req.user.id
      };
      connection.query('INSERT INTO groupuser SET ? ',values, function(error, results, fields) {
        if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
        res.status(200).json({ 'result': 'ok' });
      });
    });
  });
};

exports.list = function(req, res) {
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM `group`', function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok', 'data': results });

    });
  });
};

exports.remove = function(req, res) {
  /* Users that create the group shold be able to delete it but we don't have this info*/
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  vendors.mysql.getConnection(function(err, connection) {
    var query = connection.query('DELETE FROM `group` WHERE id = ?', req.params.id, function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok' });

    });
  });
};

exports.info = function(req, res) {
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT id,`desc` as name FROM `group` WHERE id = ?', req.params.id, function(error, results) {
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      connection.query('SELECT user.id, user.name FROM user JOIN groupuser ON groupuser.userid = user.id WHERE groupuser.groupid = ?', req.params.id, function(error, results1) {
        connection.release();

        if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
        if (results < 1) {
          res.status(404).json({ 'result': 'nok', 'message': 'Group could not be found' });
        } else {
          results.push(results1);
          res.status(200).json({ 'result': 'ok', 'data': results});
        }
      });
    });
  });
};

exports.update = function(req, res) {
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  var params = req.body;
  params.password = crypto.createHash('md5').update(params.password).digest('hex');
  vendors.mysql.getConnection(function(err, connection) {

    var values = {
      desc: params.desc,
      password: params.password
    };

    connection.query('UPDATE group SET ? WHERE id = ?', [values, req.user.id], function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      res.status(200).json({ 'result': 'ok' });
    });
  });
};

exports.userGroup = function(req, res) {
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM user WHERE id = ?', req.params.id, function(error, results, fields) {
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      connection.query('SELECT `group`.id, `group`.desc as name FROM `group`JOIN groupuser ON groupuser.groupid = `group`.id WHERE groupuser.userid = ?', req.params.id, function(error, results1, fields) {
        connection.release();
        if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

        if (results < 1) {
          res.status(404).json({ 'result': 'nok', 'message': 'The user has no groups' });
        } else {
          results.push(results1);
          res.status(200).json({ 'result': 'ok', 'data': results});
        }
      });
    });
  });
};
