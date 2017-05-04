var vendors = require('../../vendors');

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
        var obj = { groupid: results[0].id, userid: req.user.id, grade: null };
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
  vendors.mysql.getConnection(function(err, connection) {

    var values = {
      groupid: params.groupid,
      password: params.password
    };

    connection.query('INSERT INTO groupuser SET ?', function(error, results, fields) {
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok' });

    });
  });
};
