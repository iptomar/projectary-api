var vendors = require('../../vendors');

exports.create = function(req, res) {
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {
    var values = {
      groupid: params.groupid,
      projectid: params.projectid
    };
    connection.query('INSERT INTO application SET ?', values, function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      res.status(200).json({ 'result': 'ok' });

    });
  });
};

exports.list = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM application', function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok', 'data': results });
    });
  });
};

exports.info = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM application WHERE id = ?', parseInt(req.params.id), function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      if (results < 1) {
        res.status(404).json({ 'result': 'nok', 'message': 'Application could not be found' });
      } else {
        res.status(200).json({ 'result': 'ok', 'data': results });
      }

    });
  });
};

exports.accept = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('UPDATE TABLE application SET approvedin = ? WHERE id = ?', [new Date().toDateString(), parseInt(req.params.id)], function(error) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      else res.status(200).json({ 'result': 'ok' });
    });
  });
};
