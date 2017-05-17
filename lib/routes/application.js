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
    connection.query('SELECT * FROM application WHERE projectid = ?', parseInt(req.params.id), function(error, results, fields) {
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
  /* we need to check if the user is already in a project */
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('UPDATE application SET approvedin = ? WHERE groupid = ? AND projectid = ?', [new Date().toISOString().slice(0, 19).replace('T', ' '), params.groupid, params.projectid], function(error) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      else res.status(200).json({ 'result': 'ok' });
    });
  });
};
