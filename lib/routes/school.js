var vendors = require('../../vendors');

exports.list = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM school', function(error, results) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      if (!results[0]) {
        res.status(404).json({ 'result': 'nok', 'message': 'There are no schools available :(' });
      } else {
        res.status(200).json({ 'result': 'ok', 'data': results });
      }
    });
  });
};

exports.getCourse = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT id, `desc` as name FROM course WHERE schoolid = ?', req.params.id, function(error, results) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      if (!results[0]) {
        res.status(404).json({ 'result': 'nok', 'message': 'There are no courses available :(' });
      } else {
        res.status(200).json({ 'result': 'ok', 'data': results });
      }
    });
  });
};
