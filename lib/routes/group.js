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
    connection.query('SELECT * from `group` where id = ? LIMIT 1', params.groupid, function(error, results, fields) {
      if (error) { connection.release(); return res.status(500).json({ 'result': 'nok', 'message': error }); }
      if (results[0].password != params.password) { connection.release(); return res.status(500).json({ 'result': 'nok', 'message': "Invalid password" }); }
      var values = {
        groupid: params.groupid,
        userid: req.user.id
      };
      connection.query('INSERT INTO groupuser SET ? ON DUPLICATE KEY UPDATE ?',[values,values], function(error, results, fields) {
        if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
        res.status(200).json({ 'result': 'ok' });
      });
    });
  });
};
