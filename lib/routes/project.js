var vendors = require('../../vendors'),
  async = require('async');

/**
 * From route [POST] /PROJECT
 * Create a Project
 * @param   name        The project name
 * @param   description The project description
 * @param   courseid    The course of the project
 */
exports.create = function(req, res) {
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {

    var values = {
      name: params.name,
      description: params.description,
      userid: parseInt(req.user.id),
      courseid: parseInt(params.course),
      year: parseInt(new Date().getFullYear()) // We should receive this from the user
    };

    connection.query('INSERT INTO project SET ?', values, function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

/**
 * From route [GET] /PROJECT
 * Get Projects list
 */
exports.list = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM project', function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok', 'data': results });
    });
  });
};

/**
 * From route [GET] /PROJECT/:ID
 * Get a project
 * @param  id The id of the project that you want to know about :)
 */
exports.info = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    // Get project info
    connection.query('SELECT * FROM project WHERE ID = ?', parseInt(req.params.id), function(error, results, fields) {
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      // Get group from project when approved
      connection.query('SELECT `group`.id AS groupid FROM `group`, application WHERE application.groupid = `group`.id AND YEAR(application.approvedin) != 0000 AND application.projectid = ?', parseInt(req.params.id), function(error, results1, fields) {
        connection.release();
        if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
        if (results < 1){
          res.status(404).json({ 'result': 'nok', 'message': 'Project could not be found' });
        } else {
          // If the project has an approved group
          if (results1 != 0) results[0].groupid = results1[0].groupid;
          res.status(200).json({ 'result': 'ok', 'data': results });
        }
      });
    });
  });
};


exports.applInfo = function(req, res) {
  if (req.user.isadmin === 0 && req.user.role != 'teacher') return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to access' });
  var id = parseInt(req.params.id);
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT project.id, project.year, course.id as course, project.name, project.description, user.name as owner, project.created FROM project, course, user WHERE course.id = project.courseid and user.id = project.userid AND project.id = ? LIMIT 1', id, function(error, results) {
      if (error) {
        connection.release();
        return res.status(500).json({ 'result': 'nok', 'message': error });
      }
      if (results < 1) { connection.release();
        res.status(404).json({ 'result': 'nok', 'message': 'No applications or invalid project' }); } else {
        connection.query('SELECT application.groupid FROM application WHERE application.projectid = ? and application.approvedin = "0000-00-00 00:00:00"', id, function(error, groups) {
          if (error) {
            connection.release();
            return res.status(500).json({ 'result': 'nok', 'message': error });
          } else {
            if (groups < 1) { connection.release();  return res.status(404).json({ 'result': 'nok', 'message': 'No applications or invalid project' }); }
            else async.mapSeries(groups, function(element, callb) {
                connection.query('SELECT `group`.id, `group`.desc as name FROM `group` WHERE `group`.id = ? LIMIT 1', element.groupid, function(error, item) {
                  if (error) callb(error);
                  else {
                    callb(null, item[0]);
                  }
                });
              }, function(err, groupinfo) {
                if (err) { connection.release(); return res.status(500).json({ 'result': 'nok', 'message': err }); } else {
                  async.mapSeries(groupinfo, function(element2, callbb) {
                    connection.query('SELECT user.id, user.name FROM user, groupuser where groupuser.userid = user.id and groupuser.groupid = ?', element2.id, function(error, item2) {
                      if (error) callbb(error);
                      else {
                        element2.users = item2;
                        callbb(null);
                      }
                    });
                  }, function(err) {
                    connection.release();
                    if (err) return res.status(500).json({ 'result': 'nok', 'message': err });
                    else {
                      results[0].groups = groupinfo;
                      res.status(200).json({ 'result': 'ok', 'data': results[0] });
                    }
                  });
                }
              });
          }
        });
      }
    });
  });
};

/**
 * From route [PUT] /PROJECT/:ID
 * Update Project info
 * @param  name         The new project name
 * @param  description  The new project description
 * @param  course       The new course id
 * @param  year         The new project year
 */
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
      else res.status(200).json({ 'result': 'ok' });
    });
  });
};

/**
 * From route [GET] /application
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.toApprove = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT distinct project.id, project.name, project.description as description, user.name as owner, course.desc as course from project, user, course, application where course.id = project.courseid and user.id = project.userid and application.projectid = project.id and (project.approvedin is null)', function(error, results) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      if (results < 1) res.status(404).json({ 'result': 'nok', 'message': 'No applications or invalid project' });
      else res.status(200).json({ 'result': 'ok', 'data': results });
    });
  });
};
