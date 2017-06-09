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
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', 'error': error });
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
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', 'error': error });
      if (results < 1) {
        return res.status(404).json({ 'result': 'nok', 'message': 'Não foi possível encontrar projetos' });
      } else {
        res.status(200).json({ 'result': 'ok', 'data': results });
      }
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
    connection.query('SELECT * FROM project WHERE ID = ?', parseInt(req.params.id), function(error, results) {
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', 'error': error });
      // Get group from project when approved
      connection.query('SELECT `group`.id AS groupid FROM `group`, application WHERE application.groupid = `group`.id AND YEAR(application.approvedin) != 0000 AND application.projectid = ?', parseInt(req.params.id), function(error, results1) {
        connection.release();
        if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', 'error': error });
        if (results.length < 1) res.status(404).json({ 'result': 'nok', 'message': 'Não foi posível encontrar o projecto' });
        else {
          // If the project has an approved group
          if (results1.length !== 0) results[0].groupid = results1[0].groupid;
          res.status(200).json({ 'result': 'ok', 'data': results });
        }
      });
    });
  });
};

/** From route [GET] /PROJECT/:ID/APPLICATIONS
 *  Get all applications not approved of a project
 *  @param  id The id of the project that you want to know about :(
 */
exports.applInfo = function(req, res) {
  if (req.user.isadmin === 0 && req.user.role != 'teacher') return res.status(403).json({ 'result': 'nok', 'message': 'Não tem permissões para aceder a este recurso' });
  var id = parseInt(req.params.id);
  vendors.mysql.getConnection(function(err, connection) {
    async.waterfall([
      function(callback) {
        //get project + course info
        connection.query('SELECT project.id, project.year, course.id as course, project.name, project.description, user.name as owner, project.created FROM project, course, user WHERE course.id = project.courseid and user.id = project.userid AND project.id = ? LIMIT 1', id, function(error, results) {
          callback(error, results[0]);
        });
      },
      // get applications not approved
      function(pdata, callback) {
        connection.query('SELECT application.groupid FROM application WHERE application.projectid = ? and application.approvedin = "0000-00-00 00:00:00"', id, function(error, groups) {
          callback(error, pdata, groups);
        });
      },

      function(pdata, groups, callback) {
        async.mapSeries(groups, function(element, callb) {
          ///Get info user group
          connection.query('SELECT `group`.id, `group`.desc as name FROM `group` WHERE `group`.id = ? LIMIT 1', element.groupid, function(error, item) {
            if (error) callb(error);
            else {
              callb(null, item[0]);
            }
          });
        }, function(err, groupinfo) {
          pdata.groups = groupinfo;
          callback(err, pdata);
        });
      },

      function(pdata, callback) {
        async.mapSeries(pdata.groups, function(element2, callbb) {
          ///Get info user info that are in the group
          connection.query('SELECT user.id, user.name FROM user, groupuser where groupuser.userid = user.id and groupuser.groupid = ?', element2.id, function(error, item2) {
            if (error) callbb(error);
            else {
              //inject users
              element2.users = item2;
              callbb(null);
            }
          });
        }, function(err) {
          callback(err, pdata);
        });
      }
    ], function(err, endStuff) {
      connection.release();
      if (err) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', 'error': err });
      else if (endStuff.groups.length < 1 || !endStuff) res.status(404).json({ 'result': 'nok', 'message': 'Não foi possível encontrar candidaturas para o projeto especificado' });
      else res.status(200).json({ 'result': 'ok', 'data': endStuff });
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
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', 'error': error });
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
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', 'error': error });
      if (results < 1) res.status(404).json({ 'result': 'nok', 'message': 'Não foi possível encontrar candidaturas' });
      else res.status(200).json({ 'result': 'ok', 'data': results });
    });
  });
};


/**
 * From route GET /project/finished/:USERID/:GROUPID
 * Check if project is finished
 * @param  userid  The user id executing the procedure
 * @param  groupid The group name
 */
exports.isFinished = function(req, res) {
  // Users that create the group shold be able to delete it but we don't have this info
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'Não tem permissões para aceder a este recurso' });
  vendors.mysql.getConnection(function(err, connection) {
    async.waterfall([
      // Call procedure to delete the group
      function(callback) {
        connection.query('CALL isFinished(?, ?, @resultado)', [req.params.userid, req.params.groupid], function(error, results) {
          callback(error);
        });
      },
      // Check the query result
      function(callback) {
        connection.query('SELECT @resultado as resultado', function(error, results) {
          // If the result comes 'false'
          if (results[0].length > 0) {
            callback(undefined, results[0].resultado);
          } else {
            callback(error);
          }
        });
      }
    ], function(err, result) {
      connection.release();
      if (err) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', 'error': err });
      res.status(200).json({ 'result': 'ok', 'data': results });
    });
  });
};


/**
 * From route POST /project/finished/:USERID/
 * attribute a grade to a student
 * @param  userid  (on address) The user id executing the procedure
 * @param  studentid (on address) The student to attribute the grade
 * @param  groupid (on body) The group where the student is part of it
 * @param  grade (on body) The grade to attribute to the student
 */
exports.attrGrade = function(req, res) {
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {
    async.mapSeries(params.members, function(element, cbo) {
      async.waterfall([
        function(callback) {
          connection.query('CALL insertGrade(?, ?, ?, ?, @resultado)', [req.user.id, element.member_id, params.group_id, parseInt(element.member_grade)], function(error, results) {
            callback(error);
          });
        },
        // Check the query result
        function(callback) {
          connection.query('SELECT @resultado as resultado', function(error, results) {
            if (!results[0].resultado) {
              callback("Ocorreu um erro ao avaliar o aluno");
            } else {
              callback(error);
            }
          });
        }
      ], function(err, result) {
        cbo(err, result);
      });
    }, function(err, data) {
      connection.query('CALL finishProject(?, ?)', [req.user.id, params.project_id], function(error) {
        connection.release();
        if (err || error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', 'error': err | error });
        res.status(200).json({ 'result': 'ok' });
      });
    });
  });
};


exports.forceFinish = function (req, res){
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('CALL finishProject(?, ?)',[req.user.id, req.params.id] , function(error) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', 'error': error });
      res.status(200).json({ 'result': 'ok'});
    });
  });

};
