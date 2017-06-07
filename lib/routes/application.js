var vendors = require('../../vendors'),
  async = require('async');

/**
 * From route [POST] /APPLICATION
 * Apply for a Project
 * @param  groupid    The group ID from group table
 * @param  projectid  The Project ID from project table
 */
exports.create = function(req, res) {
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {
    var values = {
      groupid: parseInt(params.groupid),
      projectid: parseInt(params.projectid)
    };
    connection.query('INSERT INTO application SET ?', values, function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

/*
 * From route [GET] /APPLICATION
 * Get Application list
 */
exports.list = function(req, res) {
  // Allow access to teacher and admin
  if (req.user.isadmin != 1 && req.user.role != 'teacher') return res.status(403).json({ 'result': 'nok', 'message': 'Não tem permissões para aceder a este recurso' });
  vendors.mysql.getConnection(function(err, connection) {
    // Select group id, group name, the project info and submited date
    connection.query('SELECT `group`.id as group_id, `group`.desc as group_name, project.id as project_id, project.name as project_name, application.submitedin FROM `group` JOIN application ON application.groupid = `group`.id JOIN project ON project.id = application.projectid', function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', error });
      if (results < 1){
        return res.status(404).json({ 'result': 'nok', 'message': 'Não foi possível encontrar candidaturas' });
      } else {
        return res.status(200).json({ 'result': 'ok', 'data': results });
      }
    });
  });
};

/**
 * From route [GET] /APPLICATION/:ID/
 * Get Application info
 * @param  projectid  Is the projectid from project table
 */
exports.info = function(req, res) {
  // Allow access to teacher and admin
  if (req.user.isadmin != 1 && req.user.role != 'teacher') return res.status(403).json({ 'result': 'nok', 'message': 'Não tem permissões para aceder a este recurso' });
  vendors.mysql.getConnection(function(err, connection) {
    // Get the project info
    connection.query('SELECT * FROM project WHERE id = ?', parseInt(req.params.id), function(error, results, fields) {
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', error });
      // Get the groups that applied to that project
      connection.query('SELECT `group`.id, `group`.desc as name FROM `group` JOIN application ON application.groupid = `group`.id WHERE application.projectid = ?', parseInt(req.params.id), function(error, results1, fields) {
        if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', error });
        if (results < 1 || results1 < 1) {
          res.status(404).json({ 'result': 'nok', 'message': 'Não foi possível encontrar candidaturas' });
        } else {
          results[0].groups = results1;
          async.mapSeries(results[0].groups, function(element, callb) {
            // Get the "leader" of the group
            connection.query('SELECT user.id, user.name FROM user JOIN `groupuser` ON `groupuser`.userid = user.id WHERE `groupuser`.groupid = ? LIMIT 1', element.id, function(error, item) {
              if (error) callb(error);
              else {
                element.users = item;
                callb(null);
              }
            });
          }, function(err) {
            connection.release();
            if (err) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', err });
            else res.status(200).json({ 'result': 'ok', 'data': results[0] });
          });
        }
      });
    });
  });
};

/**
 * From route [POST] /APPLICATION/ACCEPT
 * Approve a Application
 * @param  groupid    The group id to be accept
 * @param  projectid  The project id to be accept
 */
exports.accept = function(req, res) {
  // Allow access to teacher and admin
  if (req.user.isadmin != 1 && req.user.role != 'teacher') return res.status(403).json({ 'result': 'nok', 'message': 'Não tem permissões para aceder a este recurso' });
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {
    async.waterfall([
      // Approve the given project to the given group
      function aproveProject(callback) {
        connection.query('UPDATE application SET approvedin = ? WHERE groupid = ? AND projectid = ?', [new Date().toISOString().slice(0, 19).replace('T', ' '), parseInt(params.groupid), parseInt(params.projectid)], function(error, results) {
          callback(error);
        });
      },
      // Disaprove all other groups to the given group
      function disaproveOthers(callback) {
        connection.query('UPDATE application SET approvedin = ? WHERE groupid != ? AND projectid = ?', ['0000-00-00 00:00:00', parseInt(params.groupid), parseInt(params.projectid)], function(error, results) {
          callback(error);
        });
      },
      // Approve the given project
      function activeProject(callback) {
        connection.query('UPDATE project SET approvedin = ? WHERE project.id = ?', [new Date().toISOString().slice(0, 19).replace('T', ' '), parseInt(params.projectid)], function(error, results) {
          callback(error);
        });
      }
    ], function (error) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

/**
 * ToDo: This route will be removed in a near future
 * From route [GET] /APPLICATION/NASSIGNED/:STATE
 * Get assigned or unassigned applications
 * @param  state  When 1 -> Retrives NOT assigned applications
 *                 other -> Retrives assigned applications
 */
exports.nAssigned = function(req, res) {
  var qwy;
  //Switch state
  if (parseInt(req.params.state) == 1) qwy = 'SELECT `group`.id as groupid, `group`.desc as groupname, project.id as projectid, project.name as projectname, project.description as projectdescription FROM `group` JOIN application ON application.groupid = `group`.id JOIN project ON project.id = application.projectid WHERE YEAR(application.approvedin) = 0000';
  else qwy = 'SELECT `group`.id as groupid, `group`.desc as groupname, project.id as projectid, project.name as projectname, project.description as projectdescription FROM `group` JOIN application ON application.groupid = `group`.id JOIN project ON project.id = application.projectid WHERE YEAR(application.approvedin) != 0000';

  vendors.mysql.getConnection(function(err, connection) {
    connection.query(qwy, function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', error });
      if (results < 1) res.status(404).json({ 'result': 'nok', 'message': 'Não foi possível encontrar candidaturas' });
      else res.status(200).json({ 'result': 'ok', 'data': results });
    });
  });
};

/**
 * From route [GET] /APPLICATION/USER/:ID
 * Get applications from a user
 * @param  id   The user id
 */
exports.userInfo = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    // Get group id, group name, project id, project name and application data from a determined user
    connection.query('SELECT `group`.id as groupid, `group`.`desc` as groupname, project.id as projectid, project.name as projectname, application.submitedin, application.approvedin FROM `user`, `group`, project, application, groupuser WHERE application.projectid = project.id AND application.groupid = `group`.id AND groupuser.groupid = `group`.id AND groupuser.userid = user.id AND user.id = ?', parseInt(req.params.id), function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', error });
      if (results < 1) {
        return res.status(404).json({ 'result': 'nok', 'message': 'Não foi possível encontrar candidaturas' });
      } else {
        return res.status(200).json({ 'result': 'ok', 'data': results });
      }
    });
  });
};
