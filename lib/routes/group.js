var vendors = require('../../vendors'),
  crypto = require('crypto'),
  async = require('async');

/**
 * ToDo: Check if a group with the same name already exists
 * From route [POST] /GROUP/CREATE
 * Create a Group
 * @param  desc     The group name
 * @param  password The group password
 */
 // exports.create = function(req, res) {
 //   var params = req.body;
 //
 //   params.password = crypto.createHash('md5').update(params.password).digest('hex');
 //   vendors.mysql.getConnection(function(err, connection) {
 //     async.waterfall([
 //       // Call procedure to create the group
 //       function deleteGroup(callback) {
 //         connection.query('CALL insertNewGroup(?, ?, ?, @resultado)', [req.user.id, params.desc, params.password], function(error, results, fields) {
 //           callback(error);
 //         });
 //       },
 //       // Check the query result
 //       function checkResult(callback) {
 //         connection.query('SELECT @resultado as resultado', function(error, results, fields) {
 //           // If the result comes 'false'
 //           if (!results[0].resultado){
 //             callback("Ocorreu um erro ao criar o grupo");
 //           } else {
 //             callback(error, results);
 //           }
 //         });
 //       }
 //     ], function (err, result) {
 //       connection.release();
 //       if (err) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + err });
 //       res.status(200).json({ 'result': 'ok', 'data': {'id': result[0].resultado} });
 //     });
 //  });
 // };

 /**
  * ToDo: Check if a group with the same name already exists
  * From route [POST] /GROUP/CREATE
  * Create a Group
  * @param  desc     The group name
  * @param  password The group password
  */
  exports.create = function(req, res) {
    var params = req.body;

    params.password = crypto.createHash('md5').update(params.password).digest('hex');
    vendors.mysql.getConnection(function(err, connection) {
      var values = {
        desc: params.desc,
        password: params.password
      };
      connection.beginTransaction(function(err) {
        if (err) return res.json({ 'result': 'nok', 'message': err });
        // Add the given values to group
        connection.query('INSERT INTO `group` SET ?', values, function(error, results, fields) {
          if (error) return connection.rollback(function() {
            connection.release();
            res.status(500).json({ 'result': 'nok', 'message': error });
          });
          // Get the groupid from result, so we can add the user to the group
          var obj = { groupid: results.insertId, userid: req.user.id };
          // Add the user to the group
          connection.query('INSERT INTO `groupuser` SET ?', obj, function(err) {
            if (err) return connection.rollback(function() {
              connection.release();
              res.status(500).json({ 'result': 'nok', 'message': err });
            });
            connection.commit(function(err) {
              if (err) return connection.rollback(function() {
                connection.release();
                res.json({ status: "NOK", error: "Error executing query" });
              });
              connection.release();
              res.status(200).json({ 'result': 'ok' });
            });
          });
        });
      });
    });
 };


/**
 * From route [POST] /GROUP/JOIN
 * Join user to a Group
 * @param  id       The userid that wants to join a group
 * @param  desc     The group name that the user want to join
 * @param  password The group password
 */
exports.join = function(req, res) {
  var params = req.body;
  var id = parseInt(req.user.id);
  // Check for null password / groupname before crypto to avoid problems
  if (!params.password || !params.desc) return res.status(400).json({ 'result': 'nok', 'message': "Preencha todos os campos" });
  params.password = crypto.createHash('md5').update(params.password).digest('hex');

  vendors.mysql.getConnection(function(err, connection) {
    // Check if user already has a group
    connection.query('SELECT * FROM `groupuser` WHERE `userid` = ?', id, function(error, results, fields) {
      if (error) { connection.release(); return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error }); }
      if (results !== 0) return res.status(403).json({ 'result': 'nok', 'message': "O utilizador já está registado num grupo" });

      // Check if the given group exists
      connection.query('SELECT * FROM `group` WHERE `desc` = ? LIMIT 1', params.desc, function(error, results1, fields) {
        if (error) { connection.release(); return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error }); }
        if (results1 < 1) return res.status(404).json({ 'result': 'nok', 'message': "Não foi possível encontrar o grupo" });

        // Check if given password match with stored password
        else if (results1[0].password != params.password) { connection.release(); return res.status(400).json({ 'result': 'nok', 'message': "Password inválida" }); }
        var values = {
          groupid: results1[0].id,
          userid: id
        };
        // Add the user to the group
        connection.query('INSERT INTO groupuser SET ? ', values, function(error, results, fields) {
          if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
          res.status(200).json({ 'result': 'ok', 'data':{'id':results1[0].id} });
        });
      });
    });
  });
};

/**
 * From route [GET] /GROUP
 * Get group's list
 */
exports.list = function(req, res) {
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'Não tem permissões para aceder a este recurso' });
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT id, `desc` as name FROM `group`', function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
      if (results < 1){
        return res.status(404).json({ 'result': 'nok', 'message': 'Não foi possível encontrar grupos' });
      } else {
        return res.status(200).json({ 'result': 'ok', 'data': results });
      }
    });
  });
};

/**
 * From route DELETE /GROUP/:ID
 * Delete a Group
 * @param  groupid  The groupid to be deleted
 */
exports.remove = function(req, res) {
  // Users that create the group shold be able to delete it but we don't have this info
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'Não tem permissões para aceder a este recurso' });
  vendors.mysql.getConnection(function(err, connection) {
    async.waterfall([
      // Call procedure to delete the group
      function deleteGroup(callback) {
        connection.query('CALL deleteGroup(?, ?, @resultado)', [req.user.id, parseInt(req.params.id)], function(error, results, fields) {
          callback(error);
        });
      },
      // Check the query result
      function checkResult(callback) {
        connection.query('SELECT @resultado as resultado', function(error, results, fields) {
          // If the result comes 'false'
          if (!results[0].resultado){
            callback("Ocorreu um erro ao eliminar o grupo");
          } else {
            callback(error);
          }
        });
      }
    ], function (err, result) {
      connection.release();
      if (err) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + err });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

/**
 * From route [GET] /GROUP/:ID
 * Get group info
 * @param  id The group id
 */
exports.info = function(req, res) {
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'Não tem permissões para aceder a este recurso' });
  vendors.mysql.getConnection(function(err, connection) {
    // Get the group
    connection.query('SELECT id, `desc` as name FROM `group` WHERE id = ? LIMIT 1', parseInt(req.params.id), function(error, results) {
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
      // If the group as an accepted application, gets the project id and project name
      connection.query('SELECT project.id, project.name FROM `group` JOIN application ON application.groupid = `group`.id JOIN project ON project.id = application.projectid WHERE YEAR(application.approvedin) != 0000 and `group`.id = ?', req.params.id, function(error, rest) {
        if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
        else {
          // Get the users belonging to the groups
          connection.query('SELECT user.id, user.name FROM user JOIN groupuser ON groupuser.userid = user.id WHERE groupuser.groupid = ?', parseInt(req.params.id), function(error, results1) {
            connection.release();
            if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
            if (results < 1) {
              res.status(404).json({ 'result': 'nok', 'message': 'Não foi possível encontrar o grupo' });
            } else {
              results[0].project = rest[0] || null;
              results[0].team = results1;
              res.status(200).json({ 'result': 'ok', 'data': results[0] });
            }
          });
        }
      });
    });
  });
};

/**
 * From route [PUT] /GROUP/:ID
 * Update group info
 * @param  id   The group id that should be edited
 * @param  name The new group name
 */
exports.update = function(req, res) {
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'Não tem permissões para aceder a este recurso' });
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('UPDATE `group` SET `desc` = ? WHERE id = ?', [params.name, req.params.id], function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};
