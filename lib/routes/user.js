var vendors = require('../../vendors');
var crypto = require('crypto');

exports.create = function(req, res) {
  var params = req.body;

  params.password = crypto.createHash('md5').update(params.password).digest('hex');

  vendors.mysql.getConnection(function(err, connection) {
    var values = {
      name: params.name,
      external_id: params.external,
      typeid: parseInt(params.type),
      email: params.email,
      phonenumber: params.phone,
      password: params.password
    };

    var query = connection.query('INSERT INTO user SET ?', values, function(error) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

exports.login = function(req, res) {
	res.status(200).json({ 'result': 'ok' });
};


exports.list = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {

    var query = connection.query('SELECT * FROM user', function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      res.status(200).json({ 'result': 'ok', 'data': results });

    });
  });
};

exports.info = function(req, res) {
  var id = req.params.id;

  vendors.mysql.getConnection(function(err, connection) {

    var query = connection.query('SELECT * FROM user WHERE ID =?', id, function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      if (results < 1) {
        res.status(404).json({ 'result': 'nok', 'message': 'User could not be found'});
      } else {
        res.status(200).json({ 'result': 'ok', 'data': results });
      }
    });
  });
};
