var vendors = require('../../vendors');

exports.create = function(req, res) {
  if (req.user.isadmin === 0) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to access' });
  vendors.mysql.getConnection(function(err, connection) {
    var values = {
      desc: req.body.name
    };
    connection.query('INSERT INTO attribute SET ?', values, function(error) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

exports.list = function(req, res) {
  if (req.user.isadmin === 0) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to access' });
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT id, `desc` as name, createdin FROM attribute', function(error, results) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok', 'data': results });
    });
  });
};
