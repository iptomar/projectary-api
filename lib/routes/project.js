var vendors = require('../../vendors');

exports.create = function(req, res) {
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {

    var values = {
      name: req.body.name,
      description: req.body.description,
      userid: parseInt(req.user.id),
      courseid: parseInt(req.body.course),
      year: parseInt(new Date().getFullYear())
    };

    var query = connection.query('INSERT INTO project SET ?', values, function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      res.status(200).json({ 'result': 'ok' });

    });
  });
};

exports.list = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {

    var query = connection.query('SELECT * FROM project', function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      res.status(200).json({ 'result': 'ok', 'data': results });

    });
  });
};

exports.info = function(req, res) {
  var id = req.params.id;

  vendors.mysql.getConnection(function(err, connection) {

    var query = connection.query('SELECT * FROM project WHERE ID =?', id, function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      if (results < 1) {
        res.status(404).json({ 'result': 'nok', 'message': 'Project could not be found'});
      } else {
        res.status(200).json({ 'result': 'ok', 'data': results });
      }

    });
  });
};
