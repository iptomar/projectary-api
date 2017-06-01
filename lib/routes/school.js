var vendors = require('../../vendors');

/**
 * From route [GET] /SCHOOL
 * Get school's list
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.list = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM school', function(error, results) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      if (!results[0]) res.status(404).json({ 'result': 'nok', 'message': 'There are no schools available :(' });
      else res.status(200).json({ 'result': 'ok', 'data': results });
    });
  });
};

/**
 * From route [GET] /COURSE/:ID
 * Get courses from school
 * @param  id   ID of the school
 */
exports.getCourse = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT id, `desc` as name FROM course WHERE schoolid = ?', parseInt(req.params.id), function(error, results) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      if (!results[0]) res.status(404).json({ 'result': 'nok', 'message': 'There are no courses available :(' });
      else res.status(200).json({ 'result': 'ok', 'data': results });
    });
  });
};
