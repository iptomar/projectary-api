var vendors = require('../../vendors');

/**
 * From route [POST] /ATTRIBUTE
 * Create a attribute
 * @param  desc attribute name
 */
exports.create = function(req, res) {
  if (req.user.isadmin === 0) return res.status(403).json({ 'result': 'nok', 'message': 'Não tem permissões para aceder a este recurso' });
  vendors.mysql.getConnection(function(err, connection) {
    var values = {
      desc: req.body.name
    };
    connection.query('INSERT INTO attribute SET ?', values, function(error) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', 'error' : error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

/**
 * From route [GET] /ATTRIBUTE
 * Get attributes list
 */
exports.list = function(req, res) {
  if (req.user.isadmin === 0) return res.status(403).json({ 'result': 'nok', 'message': 'Não tem permissões para aceder a este recurso' });
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT id, `desc` as name, createdin FROM attribute', function(error, results) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.', 'error' : error });
      if (results < 1){
        return res.status(404).json({ 'result': 'nok', 'message': 'Não foi possível encontrar atributos' });
      } else {
        return res.status(200).json({ 'result': 'ok', 'data': results });
      }
    });
  });
};
