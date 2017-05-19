var vendors = require('../../vendors');

exports.create = function(req, res) {
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {

    var values = {
      name: params.name,
      description: params.description,
      userid: parseInt(req.user.id),
      courseid: parseInt(params.course),
      year: parseInt(new Date().getFullYear())
    };

    connection.query('INSERT INTO project SET ?', values, function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      res.status(200).json({ 'result': 'ok' });

    });
  });
};

exports.list = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {

    connection.query('SELECT * FROM project', function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      res.status(200).json({ 'result': 'ok', 'data': results });
    });
  });
};

exports.info = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM project WHERE ID =?', parseInt(req.params.id), function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      if (results < 1) {
        res.status(404).json({ 'result': 'nok', 'message': 'Project could not be found' });
      } else {
        res.status(200).json({ 'result': 'ok', 'data': results });
      }
    });
  });
};

exports.applInfo = function(req, res) {
  if(req.user.isadmin === 0 && req.user.role != 'teacher') return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to access'});
  vendors.mysql.getConnection(function(err, connection) {

    connection.query('SELECT * FROM application WHERE projectid = ?', parseInt(req.params.id), function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      if (results < 1) {
        res.status(404).json({ 'result': 'nok', 'message': 'No applications or invalid project' });
      } else {
        res.status(200).json({ 'result': 'ok', 'data': results });
      }

    });
  });
};

exports.update = function(req, res) {
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {

    var values = {
      name: params.name,
      description: params.description,
      userid: parseInt(req.user.id),
      courseid: parseInt(params.course),
      year: parseInt(req.user.year)
    };

    connection.query('UPDATE project SET ? WHERE id = ?', [values, req.params.id], function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      res.status(200).json({ 'result': 'ok' });

    });
  });
};
