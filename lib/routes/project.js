var vendors = require('../../vendors'),
  async = require('async');

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
  if (req.user.isadmin === 0 && req.user.role != 'teacher') return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to access' });
  var id = parseInt(req.params.id);
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT project.id, project.year, course.id as course,  project.name, project.description, user.name as owner, project.created FROM project, course, user WHERE course.id = project.courseid and user.id = project.userid AND project.id = ? LIMIT 1', id, function(error, results) {
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      if (results < 1) {
        res.status(404).json({ 'result': 'nok', 'message': 'No applications or invalid project' });
      } else {
        connection.query('SELECT application.groupid FROM application WHERE application.projectid', id, function(error, groups) {
          if (error) {
            console.log("E1" + error);
            connection.release();
            return res.status(500).json({ 'result': 'nok', 'message': error });
          }
          else {
            async.mapSeries(groups, function(element, callb) {
              connection.query('SELECT `group`.id, `group`.desc as name FROM `group` WHERE `group`.id = ? LIMIT 1', element.groupid, function(error, item) {
                if (error) callb(error);
                else {
                  callb(null, item[0]);
                }
              });
            }, function(err, groupinfo) {
              if (err) { connection.release();  return res.status(500).json({ 'result': 'nok', 'message': err });}
              else {
                async.mapSeries(groupinfo, function(element2, callbb) {
                  connection.query('SELECT user.id, user.name FROM user JOIN `groupuser` ON `groupuser`.userid = user.id WHERE `groupuser`.groupid = ? LIMIT 1', element2.id, function(error, item2) {
                    if (error) callbb(error);
                    else {
                      element2.users = item2[0];
                      callbb(null);
                    }
                  });
                }, function(err) {
                  connection.release();
                  if (err) {
                    console.log("E2" + err);
                    return res.status(500).json({ 'result': 'nok', 'message': err });
                  }
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


exports.toApprove = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT project.id, project.name, project.description as description , user.name as owner, course.desc as course from project, user, course where course.id = project.courseid and user.id = project.userid and (project.approvedin is null)', function(error, results) {
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
