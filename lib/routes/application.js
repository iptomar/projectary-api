var vendors = require('../../vendors');

exports.create = function(req, res) {
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {
    var values = {
      groupid: parseInt(params.groupid),
      projectid: parseInt(params.projectid)
    };
    connection.query('INSERT INTO application SET ?', values, function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      res.status(200).json({ 'result': 'ok' });
    });
  });
};

exports.list = function(req, res) {
  // Allow access to teacher and admin
  if (req.user.isadmin != 1 || req.user.role != 'teacher') return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM application', function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok', 'data': results });
    });
  });
};

exports.info = function(req, res) {
  // Allow access to teacher and admin
  if (req.user.isadmin != 1 || req.user.role != 'teacher') return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM project WHERE id = ?', parseInt(req.params.id), function(error, results, fields) {
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      connection.query('SELECT `group`.id, `group`.desc as name FROM `group` JOIN application ON application.groupid = `group`.id WHERE application.projectid = ?', parseInt(req.params.id), function(error, results1, fields) {
        connection.release();
        if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
        if (results < 1 || results1 < 1) {
          res.status(404).json({ 'result': 'nok', 'message': 'Applications could not be found' });
        } else {
          results.push(results1);
          res.status(200).json({ 'result': 'ok', 'data': results });
        }
      });
    });
  });
};

exports.accept = function(req, res) {
  /* we need to check if the user is already in a project */
  if (req.user.isadmin != 1 || req.user.role != 'teacher') return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('UPDATE application SET approvedin = ? WHERE groupid = ? AND projectid = ?', [new Date().toISOString().slice(0, 19).replace('T', ' '), parseInt(params.groupid), parseInt(params.projectid)], function(error) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

exports.nAssigned = function(req, res) {
  var qwy;
  if (parseInt(req.params.state) == 1) {
    qwy = 'SELECT `group`.id as groupid, `group`.desc as groupname, project.id as projectid, project.name as projectname, project.description as projectdescription FROM `group` JOIN application ON application.groupid = `group`.id JOIN project ON project.id = application.projectid WHERE YEAR(application.approvedin) = 0000';
  } else {
    qwy = 'SELECT `group`.id as groupid, `group`.desc as groupname, project.id as projectid, project.name as projectname, project.description as projectdescription FROM `group` JOIN application ON application.groupid = `group`.id JOIN project ON project.id = application.projectid WHERE YEAR(application.approvedin) != 0000';
  }

  vendors.mysql.getConnection(function(err, connection) {
    connection.query(qwy, function(error, results, fields) {
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
